// Cam outlines from the cam-contact joint that drives them (J7, D1): the follower's motion law wrapped round the cam's
// centre, so the cam is exactly the law the kinematics run (K1). A roller follower's cam is the inner envelope of the
// roller on the pitch curve; a flat face's cam is the envelope of the face's lines. Outlines are in the cam body's plane
// coordinates (its frame), sampled finely enough that a 1° step moves the contact well under 0.1 mm.
import { D2R, TAU, type Vec2 } from "../core/geom";
import { camMotion, type CamLaw, type CamSchedule } from "../kin/blocks/cam";
import type { KinJoint } from "../kin/types";

export interface CamLawSpec {
  sched: CamSchedule;
  /** Base (flat) or prime (roller) radius: the pitch curve's least radius, mm. */
  rb: number;
  /** Schedule angle at the reference configuration, radians. */
  theta0: number;
  /** The follower's direction from the cam centre at the reference, in the cam's plane coordinates, radians. */
  beta0: number;
}

/** The cam law of a cam-contact joint, its numbers bound. */
export function camLawOf(j: KinJoint, num: (v: unknown) => number, beta0: number): CamLawSpec | null {
  if (!j.cam) return null;
  const sched: CamSchedule = {
    lift: num(j.cam.lift),
    segments: j.cam.schedule.map((g) => ({ kind: g.kind, span: num(g.span) * D2R, law: (g.law as CamLaw | undefined) ?? "cycloidal" })),
  };
  return { sched, rb: num(j.cam.rb), theta0: num(j.cam.theta0 ?? 0) * D2R, beta0 };
}

/**
 * Pitch radius ρ and dρ/dψ at the cam's own angle ψ: the follower stands at ψ = β0 − Δ when the cam has turned Δ, so the
 * law is read at θ = θ0 + β0 − ψ.
 */
export function pitchAt(L: CamLawSpec, psi: number): { rho: number; drho: number } {
  const m = camMotion(L.sched, L.theta0 + L.beta0 - psi);
  return { rho: L.rb + m.s, drho: -m.v };
}

const STEPS = 720;

/** The pitch curve (the roller centre's path in the cam's frame), closed, counter-clockwise. */
export function pitchCurve(L: CamLawSpec, steps = STEPS): Vec2[] {
  const out: Vec2[] = [];
  for (let k = 0; k < steps; k++) {
    const psi = (k / steps) * TAU;
    const { rho } = pitchAt(L, psi);
    out.push([rho * Math.cos(psi), rho * Math.sin(psi)]);
  }
  return out;
}

/** A roller cam: the pitch curve offset inward by the roller radius along its normal ρ r̂ − ρ' t̂. */
export function rollerCam(L: CamLawSpec, rr: number, steps = STEPS): Vec2[] {
  const out: Vec2[] = [];
  for (let k = 0; k < steps; k++) {
    const psi = (k / steps) * TAU;
    const { rho, drho } = pitchAt(L, psi);
    const c = Math.cos(psi);
    const s = Math.sin(psi);
    // outward normal in (r̂, t̂): (ρ, −ρ'), normalised
    const h = Math.hypot(rho, drho);
    const nr = rho / h;
    const nt = -drho / h;
    const x = rho * c - rr * (nr * c - nt * s);
    const y = rho * s - rr * (nr * s + nt * c);
    out.push([x, y]);
  }
  return out;
}

/** A flat-faced follower's cam: the envelope of the face lines x·r̂(ψ) = ρ(ψ), at ρ r̂ + ρ' t̂. */
export function flatCam(L: CamLawSpec, steps = STEPS): Vec2[] {
  const out: Vec2[] = [];
  for (let k = 0; k < steps; k++) {
    const psi = (k / steps) * TAU;
    const { rho, drho } = pitchAt(L, psi);
    const c = Math.cos(psi);
    const s = Math.sin(psi);
    out.push([rho * c - drho * s, rho * s + drho * c]);
  }
  return out;
}

/** The least radius of curvature of a closed polyline (mm) and whether it is convex everywhere (no undercut, D1). */
export function curvature(pts: Vec2[]): { least: number; convex: boolean } {
  let least = Infinity;
  let convex = true;
  const n = pts.length;
  for (let k = 0; k < n; k++) {
    const a = pts[(k - 1 + n) % n]!;
    const b = pts[k]!;
    const c = pts[(k + 1) % n]!;
    const cr = (b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0]);
    if (cr < -1e-9) convex = false;
    const ab = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const bc = Math.hypot(c[0] - b[0], c[1] - b[1]);
    const ca = Math.hypot(a[0] - c[0], a[1] - c[1]);
    const R = (ab * bc * ca) / (2 * Math.abs(cr) || 1e-12);
    if (R < least) least = R;
  }
  return { least, convex };
}
