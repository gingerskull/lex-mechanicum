// The K1 verifier: at build time, the loop-closure residual of every declared joint in 3D over the cycle, with branch
// continuity through toggles. It reads only the joints and the body poses, never the blocks that made them.
import { KinError } from "./ctx";
import { TAU, type Vec3, m3, v3, xf, type Xf } from "./math";
import { ncgResidual, stepResidual, jointResidual } from "./residual";
import type { Kinematics } from "./compose";
import type { Controls, Pose } from "./types";

/** The K1 tolerance on a joint residual (mm and unit-vector components). */
export const K1_TOL = 1e-9;

export interface K1Options {
  /** Samples over the cycle (default 720). */
  samples?: number;
  controls?: Controls;
  tol?: number;
}

export interface K1Report {
  ok: boolean;
  tol: number;
  samples: number;
  /** Largest joint residual over all samples, and where. */
  maxResidual: number;
  worst: { joint: string; u: number; value: number } | null;
  byJoint: Record<string, number>;
  /** Largest deviation of any body's pose from the identity at the drivers' defaults (the declared branch must reproduce the reference geometry). */
  referenceAgreement: number;
  /** Largest pose difference between u = 0 and u = 2π (K2 periodicity). */
  periodicity: number;
  /** Consecutive samples where a point jumped far more than its neighbours did: a branch flip. */
  jumps: { u: number; point: string; step: number }[];
  /** Samples where a block could not close (links out of reach) or threw. */
  failures: { u: number; error: string }[];
  /** Blocks that used the numeric fallback (the audit names them). */
  fallback: string[];
  /** Stateful blocks whose closure is not the same at the end of the cycle as at its start. */
  branchNotPeriodic: string[];
}

const poseDiff = (a: Xf, b: Xf): number => Math.max(...a.R.map((r, i) => Math.abs(r - b.R[i]!)), v3.len(v3.sub(a.t, b.t)));

export function verifyK1(k: Kinematics, opts: K1Options = {}): K1Report {
  const N = opts.samples ?? 720;
  const tol = opts.tol ?? K1_TOL;
  const controls = opts.controls;
  const setup = k.setup(controls);
  const joints = k.joints(controls);
  const byJoint: Record<string, number> = {};
  const failures: K1Report["failures"] = [];
  const fallback = new Set<string>();
  let maxResidual = 0;
  let worst: K1Report["worst"] = null;
  const note = (joint: string, u: number, v: number) => {
    const a = Math.abs(v);
    byJoint[joint] = Math.max(byJoint[joint] ?? 0, a);
    if (a > maxResidual) {
      maxResidual = a;
      worst = { joint, u, value: a };
    }
  };

  const poses: (Pose | null)[] = [];
  for (let i = 0; i <= N; i++) {
    const u = (i / N) * TAU;
    try {
      poses.push(k.pose(u, controls));
    } catch (e) {
      poses.push(null);
      failures.push({ u, error: e instanceof KinError || e instanceof Error ? e.message : String(e) });
    }
  }
  // reference agreement
  let referenceAgreement = 0;
  try {
    const ref = k.poseAt({}, controls);
    for (const X of ref.bodies.values()) referenceAgreement = Math.max(referenceAgreement, poseDiff(X, xf.id()));
  } catch (e) {
    failures.push({ u: 0, error: `reference pose: ${(e as Error).message}` });
  }

  for (let i = 0; i <= N; i++) {
    const P = poses[i];
    if (!P) continue;
    for (const f of P.fallback) fallback.add(f);
    const dv = (id: string) => P.values[id];
    for (const r of joints) {
      const Xa = P.bodies.get(r.joint.a);
      const Xb = P.bodies.get(r.joint.b);
      if (!Xa || !Xb) continue;
      const res = jointResidual(r, Xa, Xb, dv);
      for (const v of res) note(r.joint.id, P.u, v);
      const Q = poses[i + 1];
      if (Q) {
        const car = r.joint.carrier;
        const s = stepResidual(r, { a0: Xa, a1: Q.bodies.get(r.joint.a)!, b0: Xb, b1: Q.bodies.get(r.joint.b)!, c0: car ? P.bodies.get(car) : undefined, c1: car ? Q.bodies.get(car) : undefined });
        if (s !== null) note(r.joint.id, P.u, s);
        const n = ncgResidual(r, Xa, Q.bodies.get(r.joint.a)!, Xb, Q.bodies.get(r.joint.b)!);
        if (n !== null) note(r.joint.id, P.u, n);
      }
    }
  }

  // periodicity
  let periodicity = 0;
  const p0 = poses[0];
  const pN = poses[N];
  if (p0 && pN) {
    for (const [b, X] of p0.bodies) {
      const Y = pN.bodies.get(b) ?? X;
      const body = k.kin.bodies.find((q) => q.id === b);
      const n = body?.symmetry ?? (typeof body?.shape?.z === "number" ? (body.shape.z as number) : undefined);
      const jr = [...setup.joints.values()].find((r) => r.joint.a === b || r.joint.b === b);
      const ax = jr?.axis;
      // a sheave half is a body of revolution: it may come back turned by any angle about its axis
      if (body?.shape?.sheave !== undefined && ax) {
        const rel = xf.mul(Y, xf.inv(X));
        const R = xf.rotAbout(jr!.at, ax, xf.angleAbout(rel, ax));
        const resid = xf.mul(xf.inv(R), rel);
        periodicity = Math.max(periodicity, v3.len(v3.perp(resid.t, ax)), v3.len(v3.perp(m3.log(resid.R), ax)));
      } else if (n && ax) {
        // rotation about the axis may differ by a whole number of symmetry steps; nothing else may differ
        const rel = xf.mul(Y, xf.inv(X));
        const ang = xf.angleAbout(rel, ax);
        const step = TAU / n;
        const off = Math.abs(ang - Math.round(ang / step) * step);
        const R = xf.rotAbout(jr!.at, ax, Math.round(ang / step) * step);
        const resid = xf.mul(xf.inv(R), rel);
        periodicity = Math.max(periodicity, off, v3.len(v3.perp(resid.t, ax)), v3.len(v3.perp(m3.log(resid.R), ax)));
      } else periodicity = Math.max(periodicity, poseDiff(X, Y));
    }
  }

  // branch continuity: a point that jumps while its neighbours move smoothly
  const jumps: K1Report["jumps"] = [];
  let scale = 0;
  const first = poses.find((p) => p);
  if (first) {
    let lo: Vec3 = [Infinity, Infinity, Infinity];
    let hi: Vec3 = [-Infinity, -Infinity, -Infinity];
    for (const p of first.points.values()) {
      lo = [Math.min(lo[0], p[0]), Math.min(lo[1], p[1]), Math.min(lo[2], p[2])];
      hi = [Math.max(hi[0], p[0]), Math.max(hi[1], p[1]), Math.max(hi[2], p[2])];
    }
    scale = v3.dist(lo, hi) || 1;
  }
  const ids = first ? [...first.points.keys()] : [];
  for (const id of ids) {
    const steps: number[] = [];
    for (let i = 0; i < N; i++) {
      const a = poses[i]?.points.get(id);
      const b = poses[i + 1]?.points.get(id);
      steps.push(a && b ? v3.dist(a, b) : NaN);
    }
    for (let i = 0; i < N; i++) {
      const s = steps[i]!;
      if (Number.isNaN(s)) continue;
      const prev = steps[(i + N - 1) % N] ?? 0;
      const next = steps[(i + 1) % N] ?? 0;
      const nb = Math.max(Number.isNaN(prev) ? 0 : prev, Number.isNaN(next) ? 0 : next);
      if (s > 3 * nb + 2e-3 * scale) jumps.push({ u: (i / N) * TAU, point: id, step: s });
    }
  }

  const branchNotPeriodic = [...setup.tables].filter(([, t]) => !t.periodic).map(([id]) => id);
  const ok = failures.length === 0 && maxResidual <= tol && referenceAgreement <= 1e-6 && periodicity <= 1e-6 && jumps.length === 0 && branchNotPeriodic.length === 0;
  return { ok, tol, samples: N, maxResidual, worst, byJoint, referenceAgreement, periodicity, jumps, failures, fallback: [...fallback], branchNotPeriodic };
}
