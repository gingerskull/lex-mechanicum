// What the renderer asks of a mechanism's kinematics, whatever produced them: where each solid's body is at cycle phase u
// (a 4 x 4 matrix from the body's local frame to the world, column-major), and where a named point is. Two adapters: the
// kinematic library of a record's `kin` block (src/kin), and today's 2.5D model, for the lifted pilots while both engines
// live on the branch. A controls object overrides settings for a ghost trace (SD23).
import { frameAxis } from "../../core/axis";
import { poseOf } from "../../model/pose";
import type { MechanismModel } from "../../model/types";
import { Kinematics, anchorAt } from "../../kin/compose";
import type { Controls } from "../../kin/types";
import { m3, v3, xf, type Xf } from "../../kin/math";

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
import { IDENTITY, mat4, type Mat4 } from "../../solids/frame";
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
  /**
   * The path of a named point over a range of the input (degrees or mm; the whole input range when omitted), one polyline
   * per branch of the assembly: a workspace outline (T5). Absent where the poser cannot sweep.
   */
  sweep?(point: string, range?: [number, number], branches?: string[]): Vec3[][] | null;
  /** A body's pose at phase u (reference configuration to now) as a matrix: a trace or arc drawn in a moving body's frame. */
  body?(u: number, id: string, ctl?: Controls): Mat4 | null;
}

export const ID4: Mat4 = mat4(IDENTITY);

/** How far a teaching point is carried onto its body's top face at most, mm: a deep stack of slabs, no more. */
const LIFT_REACH = 40;

const m4 = (X: Vec3, Y: Vec3, Z: Vec3, T: Vec3): Mat4 => [X[0], X[1], X[2], 0, Y[0], Y[1], Y[2], 0, Z[0], Z[1], Z[2], 0, T[0], T[1], T[2], 1];

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
      const X = s.body === "ground" ? xf.id() : pose(u).bodies.get(s.body);
      const D = shiftOf(s);
      if (!X) return ID4;
      return fromXf(D ? xf.mul(X, D) : X);
    },
    point: (u, id, ctl) => lifted(pose(u, ctl), id, ctl),
    body: (u, id, ctl) => {
      const X = id === "ground" ? xf.id() : pose(u, ctl).bodies.get(id);
      return X ? fromXf(X) : null;
    },
    sweep: (point, range, branches) => {
      const d = k.kin.drivers.find((x) => x.kind === "rotary" || x.kind === "oscillating");
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
    span: (u, a, b) => {
      const P = pose(u);
      const A = lifted(P, a);
      const B = lifted(P, b);
      return A && B ? Math.hypot(B[0] - A[0], B[1] - A[1], B[2] - A[2]) : null;
    },
  };
}

/** The axis conventions of today's model: a part's 2D pose (x, y, angle) is in the plane normal to its axis. */
export function planeMatrix(axis: "x" | "y" | "z" | "p", pose: [number, number, number], frame?: { o: Vec3; u: Vec3; v: Vec3 }): Mat4 {
  const [px, py, a] = pose;
  const c = Math.cos(a), s = Math.sin(a);
  if (axis === "p" && frame) {
    const f = frame;
    const Z = frameAxis(f);
    return m4([c * f.u[0] + s * f.v[0], c * f.u[1] + s * f.v[1], c * f.u[2] + s * f.v[2]], [-s * f.u[0] + c * f.v[0], -s * f.u[1] + c * f.v[1], -s * f.u[2] + c * f.v[2]], Z, [f.o[0] + px * f.u[0] + py * f.v[0], f.o[1] + px * f.u[1] + py * f.v[1], f.o[2] + px * f.u[2] + py * f.v[2]]);
  }
  if (axis === "x") return m4([0, c, s], [0, -s, c], [1, 0, 0], [0, px, py]);
  if (axis === "y") return m4([c, 0, s], [-s, 0, c], [0, 1, 0], [px, 0, py]);
  return m4([c, s, 0], [-s, c, 0], [0, 0, 1], [px, py, 0]);
}

/**
 * Today's model as a poser, for the lifted pilots. `z` is the height the model's 2D points are drawn at (a trace rides
 * at the top of the stack). A solid's frame holds its placement in the body's plane (src/solids/lift.ts), so the matrix
 * is the body's 2D pose carried into the world by the solid's own axis.
 */
export function legacyPoser(model: MechanismModel, z: number): Poser {
  const parts = new Map(model.parts.map((p) => [p.id, p]));
  let at = NaN;
  let S: ReturnType<MechanismModel["solve"]> | null = null;
  const solved = (u: number) => {
    if (u !== at || !S) {
      S = model.solve(u);
      at = u;
    }
    return S;
  };
  return {
    period: Math.PI * 2,
    place: (s, u) => {
      const part = parts.get(s.body);
      if (!part) return ID4;
      const S2 = solved(u);
      const q = poseOf(part, S2);
      if (!q) return ID4;
      const axis = s.legacyAxis ?? "z";
      const f = axis === "p" && s.posedBy ? S2.frames?.[s.posedBy] : undefined;
      return planeMatrix(axis, q, f);
    },
    point: (u, id) => {
      const p = solved(u).pts[id];
      return p ? [p[0], p[1], z] : null;
    },
    span: (u, a, b) => {
      const P = solved(u).pts;
      const A = P[a];
      const B = P[b];
      return A && B ? Math.hypot(B[0] - A[0], B[1] - A[1]) : null;
    },
  };
}

/**
 * Bodies from one poser, points from another: today's model places the lifted pilots' solids while a record's kinematic
 * block, where it solves, gives the named points the teaching layers use. A point the second poser cannot give comes from
 * the first.
 */
export function hybridPoser(bodies: Poser, points: Poser): Poser {
  const safe = <T>(f: () => T | null): T | null => {
    try {
      return f();
    } catch {
      return null;
    }
  };
  return {
    period: bodies.period,
    place: (s, u) => bodies.place(s, u),
    point: (u, id, ctl) => safe(() => points.point(u, id, ctl)) ?? (ctl ? null : bodies.point(u, id)),
    span: (u, a, b) => bodies.span(u, a, b) ?? safe(() => points.span(u, a, b)),
    ...(points.body ? { body: (u: number, id: string, ctl?: Controls) => safe(() => points.body!(u, id, ctl)) } : {}),
    ...(points.sweep ? { sweep: (pt: string, r?: [number, number], br?: string[]) => safe(() => points.sweep!(pt, r, br)) } : {}),
  };
}

/** A poser of nothing moving (a fixture of static solids, a package drawn without its model). */
export const staticPoser: Poser = { period: Math.PI * 2, place: () => ID4, point: () => null, span: () => null };
