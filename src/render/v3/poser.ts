// What the renderer asks of a mechanism's kinematics, whatever produced them: where each solid's body is at cycle phase u
// (a 4 x 4 matrix from the body's local frame to the world, column-major), and where a named point is. Two adapters: the
// kinematic library of a record's `kin` block (src/kin), and today's 2.5D model, for the lifted pilots while both engines
// live on the branch. A controls object overrides settings for a ghost trace (SD23).
import { frameAxis } from "../../core/axis";
import { poseOf } from "../../model/pose";
import type { MechanismModel } from "../../model/types";
import { Kinematics } from "../../kin/compose";
import type { Controls } from "../../kin/types";
import type { Xf } from "../../kin/math";
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
}

export const ID4: Mat4 = mat4(IDENTITY);

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
export function kinPoser(k: Kinematics, controls?: Controls): Poser {
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
      const X = pose(u).bodies.get(s.body);
      return X ? fromXf(X) : ID4;
    },
    point: (u, id, ctl) => pose(u, ctl).points.get(id) ?? null,
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
            const p = k.poseAt({ [d.id]: lo + ((hi - lo) * i) / 180 }, { ...controls, ...ctl }).points.get(point);
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
      const p = pose(u).points;
      const A = p.get(a);
      const B = p.get(b);
      return A && B ? Math.hypot(B[0] - A[0], B[1] - A[1], B[2] - A[2]) : null;
    },
  };
}

/** The axis conventions of today's model: a part's 2D pose (x, y, angle) is in the plane normal to its axis. */
function planeMatrix(axis: "x" | "y" | "z" | "p", pose: [number, number, number], frame?: { o: Vec3; u: Vec3; v: Vec3 }): Mat4 {
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
    ...(points.sweep ? { sweep: (pt: string, r?: [number, number], br?: string[]) => safe(() => points.sweep!(pt, r, br)) } : {}),
  };
}

/** A poser of nothing moving (a fixture of static solids, a package drawn without its model). */
export const staticPoser: Poser = { period: Math.PI * 2, place: () => ID4, point: () => null, span: () => null };
