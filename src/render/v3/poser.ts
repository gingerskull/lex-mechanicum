// What the renderer asks of a mechanism's kinematics, whatever produced them: where each solid's body is at cycle phase u
// (a 4 x 4 matrix from the body's local frame to the world, column-major), and where a named point is: the kinematic
// library of a record's `kin` block (src/kin). A controls object overrides settings for a ghost trace (SD23).
import { Kinematics, anchorAt, handStroke } from "../../kin/compose";
import type { Controls } from "../../kin/types";
import { m3, v3, xf, type Xf } from "../../kin/math";
import { fiveBarFK } from "../../kin/blocks/linkage";

/** A joint's frame: at its point, z along its axis, x the world up (or x) made square to it. */
function jointFrame(at: Vec3, axis: Vec3): Xf {
  const z = v3.unit(axis);
  const h: Vec3 = Math.abs(z[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1];
  const x = v3.unit(v3.sub(h, v3.mul(z, v3.dot(h, z))));
  const y = v3.cross(z, x);
  return { R: [x[0], y[0], z[0], x[1], y[1], z[1], x[2], y[2], z[2]], t: at };
}

const moved = (D: Xf): boolean => Math.hypot(...D.t) > 1e-6 || D.R.some((v, i) => Math.abs(v - (i % 4 === 0 ? 1 : 0)) > 1e-9);
void m3;
import { driveXf } from "../../solids/drive";
import { IDENTITY, mat4, type Mat4 } from "../../solids/frame";
import { conveyMatrix, mul4, turnMatrix } from "../../solids/convey";
import type { PackedSolid3 } from "../../package/format2";
import type { Vec3 } from "../../solids/types";

export type { Controls };

export interface Poser {
  /** One cycle of the input, radians (2π). */
  readonly period: number;
  /** The solid's body-local to world matrix at phase u; identity for a body that never moves. */
  place(s: PackedSolid3, u: number): Mat4;
  /** A named point (a joint, a trace point) in world mm at phase u, with optional control overrides; null if unknown. */
  point(u: number, id: string, ctl?: Controls): Vec3 | null;
  /** The distance of its two points at phase u (mm). */
  span(u: number, a: string, b: string): number | null;
  /** A value the kinematics solve (a block's output, a pitch radius) at phase u; null if unknown. */
  value?(u: number, name: string, ctl?: Controls): number | null;
  /** Two named points as solved at phase u (a stretched member's ends), world mm. */
  ends?(u: number, a: string, b: string): [Vec3, Vec3] | null;
  /** The same two points in the reference configuration (where the member was built). */
  refEnds?(a: string, b: string): [Vec3, Vec3] | null;
  /** The true distance of two kinematic points at phase u (mm), before any is lifted onto a part's top face: what a dimension reads. */
  measure?(u: number, a: string, b: string): number | null;
  /** A named point with drivers held at given values (degrees or mm): an overlay drawn at a fixed pose, such as a toggle. */
  pointAt?(values: Record<string, number>, id: string): Vec3 | null;
  /** A body's pose at phase u (reference to now): a curve carried by a moving body (a rolling centrode). */
  bodyAt?(u: number, body: string): Xf | null;
  /** The outline a five-bar's tip reaches over the ranges of its two cranks' drivers (a workspace, T5); null if none. */
  area?(point: string, drivers: [string, string]): Vec3[] | null;
  /**
   * The path of a named point over a range of the input (degrees or mm; the whole input range when omitted), one polyline
   * per branch of the assembly: a workspace outline (T5). Absent where the poser cannot sweep.
   */
  sweep?(point: string, range?: [number, number], branches?: string[]): Vec3[][] | null;
  /** The cycle phase (radians) at which a kin output reaches its max or min; null where the poser has no such output. */
  phaseOf?(output: string, stat: "max" | "min"): number | null;
  /** A named point where the kinematics put it, not raised to the top face of its part (a dimension's true length). */
  rawPoint?(u: number, id: string): Vec3 | null;
  /** A body's pose at phase u (reference configuration to now) as a matrix: a trace or arc drawn in a moving body's frame. */
  body?(u: number, id: string, ctl?: Controls): Mat4 | null;
}

export const ID4: Mat4 = mat4(IDENTITY);

/** A point as solved (not lifted): a named kin point, or a kit's body anchor (@body:x:y:z). */
const rawPoint = (P: { points: Map<string, Vec3>; bodies: Map<string, Xf> }, n: string): Vec3 | null => P.points.get(n) ?? (n.startsWith("@") ? anchorAt(n, P.bodies) : null);

/** How far a teaching point is carried onto its body's top face at most, mm: a deep stack of slabs, no more. */
const LIFT_REACH = 40;

/** A kin body pose (reference configuration to now) as a matrix. */
function fromXf(X: Xf): Mat4 {
  const R = X.R;
  return [R[0], R[3], R[6], 0, R[1], R[4], R[7], 0, R[2], R[5], R[8], 0, X.t[0], X.t[1], X.t[2], 1];
}

/**
 * The poser of a record's kinematic block. A solid's frame is placed in the reference configuration (every driver at its
 * default), so a body's pose Xf, which carries that configuration to the present one, is its matrix.
 */
export function kinPoser(k: Kinematics, controls?: Controls, lifts?: Record<string, [number, number, number, number]>): Poser {
  // a teaching point is drawn on the top face of the body it rides, where the builder placed that body (package v2
  // `lifts`); a joint rides the higher of its two bodies
  const rideOf = new Map<string, string>();
  if (lifts) {
    const top = (b: string) => lifts[b]?.[3] ?? -Infinity;
    for (const j of k.kin.joints) {
      const b = [j.a, j.b].filter((x) => lifts[x]).sort((x, y) => top(y) - top(x))[0];
      if (b) rideOf.set(j.id, b);
    }
    for (const p of k.kin.points ?? []) if (lifts[p.body]) rideOf.set(p.id, p.body);
  }
  const lifted = (P: ReturnType<Kinematics["pose"]>, id: string, ctl?: Controls): Vec3 | null => {
    const p = P.points.get(id);
    if (!p) return id.startsWith("@") ? anchorAt(id, P.bodies) : null;
    const b = rideOf.get(id);
    const X = b ? P.bodies.get(b) : undefined;
    const ref = b ? k.setup(ctl ? { ...controls, ...ctl } : controls).refPts.get(id) : undefined;
    if (!b || !X || !ref) return p;
    const [nx, ny, nz, t] = lifts![b]!;
    const d = t - (nx * ref[0] + ny * ref[1] + nz * ref[2]);
    // a point far off the body's face is not on it (a roller's centre up on a slide's upright): drawn where it is
    if (Math.abs(d) > LIFT_REACH) return p;
    const R = X.R;
    const v: Vec3 = [nx * d, ny * d, nz * d];
    return [p[0] + R[0] * v[0] + R[1] * v[1] + R[2] * v[2], p[1] + R[3] * v[0] + R[4] * v[1] + R[5] * v[2], p[2] + R[6] * v[0] + R[7] * v[1] + R[8] * v[2]];
  };
  // the solids are built at the record's own settings; a control that changes the geometry (a bend, an offset) moves
  // each body's reference frame, so a body is carried from its built frame to the new one, and the ground hardware of
  // a joint that moves (an output shaft's blocks) goes with that joint
  const built = k.setup(undefined);
  const now = k.setup(controls);
  const bodyShift = new Map<string, Xf>();
  const jointShift = new Map<string, Xf>();
  if (now !== built) {
    for (const [id, F1] of now.bodyFrame) {
      const D = xf.mul(F1, xf.inv(built.bodyFrame.get(id) ?? xf.id()));
      if (moved(D)) bodyShift.set(id, D);
    }
    for (const [id, r1] of now.joints) {
      const r0 = built.joints.get(id);
      if (!r0) continue;
      const D = xf.mul(jointFrame(r1.at, r1.axis), xf.inv(jointFrame(r0.at, r0.axis)));
      if (moved(D)) jointShift.set(id, D);
    }
  }
  const shiftOf = (s: PackedSolid3): Xf | undefined => {
    if (s.body !== "ground") return bodyShift.get(s.body);
    for (const j of s.joints ?? []) {
      const D = jointShift.get(j);
      if (D) return D;
    }
    return undefined;
  };
  let at = NaN;
  let cached: ReturnType<Kinematics["pose"]> | null = null;
  const phases = new Map<string, number | null>();
  const pose = (u: number, ctl?: Controls) => {
    if (ctl) return k.pose(u, { ...controls, ...ctl });
    if (u !== at || !cached) {
      cached = k.pose(u, controls);
      at = u;
    }
    return cached;
  };
  return {
    period: Math.PI * 2,
    place: (s, u) => {
      // a drive part the record has no body for is posed from the input it swings
      if (s.drive) return fromXf(driveXf(s.drive, pose(u).bodies.get(s.drive.input) ?? xf.id(), u));
      const X = s.body === "ground" ? xf.id() : pose(u).bodies.get(s.body);
      const D = shiftOf(s);
      if (!X) return ID4;
      const M = fromXf(D ? xf.mul(X, D) : X);
      // a conveyed solid: carried along its path by the travel, in the frame of the body that carries the path
      const cv = s.cv?.path;
      if (s.spin) return mul4(M, turnMatrix(s.spin.at, s.spin.axis, u - s.spin.u0)) as Mat4;
      return cv ? (mul4(M, conveyMatrix(cv, s.cv!.s0, pose(u).values[cv.key] ?? 0, s.cv!.s1, pose(u).values)) as Mat4) : M;
    },
    point: (u, id, ctl) => lifted(pose(u, ctl), id, ctl),
    rawPoint: (u, id) => pose(u).points.get(id) ?? null,
    value: (u, name, ctl) => pose(u, ctl).values[name] ?? null,
    body: (u, id, ctl) => {
      const X = id === "ground" ? xf.id() : pose(u, ctl).bodies.get(id);
      return X ? fromXf(X) : null;
    },
    sweep: (point, range, branches) => {
      const d = k.kin.drivers.find((x) => x.kind === "rotary" || x.kind === "oscillating" || handStroke(x));
      if (!d) return null;
      const lo = range?.[0] ?? d.range?.[0] ?? 0;
      const hi = range?.[1] ?? d.range?.[1] ?? 360;
      const designs = (branches?.length ? branches : [undefined]).map((b) => (b !== undefined ? { design: Object.fromEntries(k.kin.design?.filter((x) => x.options.includes(b)).map((x) => [x.id, b]) ?? []) } : undefined));
      const out: Vec3[][] = [];
      for (const ctl of designs) {
        const line: Vec3[] = [];
        for (let i = 0; i <= 180; i++) {
          try {
            const p = lifted(k.poseAt({ [d.id]: lo + ((hi - lo) * i) / 180 }, { ...controls, ...ctl }), point, ctl);
            if (p) line.push(p);
          } catch {
            // an angle outside this branch's range does not assemble: the line has a gap there
          }
        }
        if (line.length) out.push(line);
      }
      return out.length ? out : null;
    },
    phaseOf: (output, stat) => {
      const key = `${output}|${stat}`;
      if (phases.has(key)) return phases.get(key)!;
      let best: number | null = null;
      let bv = stat === "max" ? -Infinity : Infinity;
      const N = 720;
      for (let i = 0; i < N; i++) {
        const u = (i / N) * Math.PI * 2;
        const v = k.pose(u, controls).outputs[output];
        if (typeof v !== "number") break;
        if (stat === "max" ? v > bv : v < bv) {
          bv = v;
          best = u;
        }
      }
      phases.set(key, best);
      return best;
    },
    refEnds: (a, b) => {
      const P = k.referencePose(controls);
      const A = rawPoint(P, a);
      const B = rawPoint(P, b);
      return A && B ? [A, B] : null;
    },
    ends: (u, a, b) => {
      const P = pose(u);
      const A = rawPoint(P, a);
      const B = rawPoint(P, b);
      return A && B ? [A, B] : null;
    },
    // a stretched member's length: its two points as solved (not lifted to the top faces the teaching layers draw on)
    span: (u, a, b) => {
      const P = pose(u);
      const A = rawPoint(P, a);
      const B = rawPoint(P, b);
      return A && B ? Math.hypot(B[0] - A[0], B[1] - A[1], B[2] - A[2]) : null;
    },
    bodyAt: (u, body) => pose(u).bodies.get(body) ?? null,
    area: (point, drivers) => {
      const step = k.kin.solve.find((q) => q.block === "five-bar");
      const ds = drivers.map((id) => k.kin.drivers.find((d) => d.id === id));
      if (!step || !ds[0]?.range || !ds[1]?.range) return null;
      const S = k.setup(controls);
      const i = step.in ?? {};
      const at = (v: unknown): Vec3 | undefined => (typeof v === "string" ? S.joints.get(v)?.at : undefined);
      const num = (v: unknown): number => (typeof v === "number" ? v : S.params.get(String(v)) ?? NaN);
      const A1 = at(i.A1), A2 = at(i.A2);
      if (!A1 || !A2) return null;
      const g = { A1, A2, l1: num(i.l1), l2: num(i.l2), l3: num(i.l3), l4: num(i.l4) };
      // the tip's branch and height as drawn now
      const P = pose(0);
      const now = P.points.get(point);
      const lift = lifted(P, point);
      if (!now || !lift) return null;
      const th = (d: (typeof ds)[number]) => ((P.values[d!.id] ?? 0) * Math.PI) / 180;
      const side: 1 | -1 = v3.dist(fiveBarFK(g, th(ds[0]), th(ds[1]), 1).P, now) < v3.dist(fiveBarFK(g, th(ds[0]), th(ds[1]), -1).P, now) ? 1 : -1;
      const dz = lift[2] - now[2];
      const [r1, r2] = [ds[0].range, ds[1].range];
      const out: Vec3[] = [];
      const n = 60;
      const edge = (f: (t: number) => [number, number]) => {
        for (let q = 0; q <= n; q++) {
          const [a, b] = f(q / n);
          const sol = fiveBarFK(g, (a * Math.PI) / 180, (b * Math.PI) / 180, side);
          if (sol.h > 0) out.push([sol.P[0], sol.P[1], sol.P[2] + dz]);
        }
      };
      const lerp = (r: [number, number], t: number) => r[0] + (r[1] - r[0]) * t;
      edge((t) => [lerp(r1, t), r2[0]]);
      edge((t) => [r1[1], lerp(r2, t)]);
      edge((t) => [lerp(r1, 1 - t), r2[1]]);
      edge((t) => [r1[0], lerp(r2, 1 - t)]);
      return out.length ? out : null;
    },
    pointAt: (values, id) => {
      try {
        return lifted(k.poseAt(values, controls), id);
      } catch {
        return null;
      }
    },
    measure: (u, a, b) => {
      const P = pose(u);
      const A = P.points.get(a);
      const B = P.points.get(b);
      return A && B ? Math.hypot(B[0] - A[0], B[1] - A[1], B[2] - A[2]) : null;
    },
  };
}

/** A poser of nothing moving (a fixture of static solids, a package drawn without its kinematics). */
export const staticPoser: Poser = { period: Math.PI * 2, place: () => ID4, point: () => null, span: () => null };
