// World pose of a solid at a solved phase: its body's pose composed with its local pose, or the solid's own motion
// (belt-driven pulleys, the oscillating drive's crank and link). Shared by assembly, checks, packaging and renderer.
import { boxOf, frameAxis, frameBox, type Box3, type Frame3 } from "../core/axis";
import { xf, xfPose, type Pose, type Vec2 } from "../core/geom";
import { circleX } from "../core/vec";
import type { Solid } from "../hardware/solid";
import { deformRings, poseOf } from "../model/pose";
import type { MechanismModel, Part, Solved } from "../model/types";

export type PartIndex = Record<string, Part>;

export const indexParts = (model: MechanismModel): PartIndex => Object.fromEntries(model.parts.map((p) => [p.id, p]));

export function bodyPose(parts: PartIndex, body: string, s: Solved): Pose | null {
  if (body === "ground") return [0, 0, 0];
  const p = parts[body];
  return p ? poseOf(p, s) : null;
}

/** True when the body never moves relative to ground (a posed part fixed in its frame moves with the frame). */
export const isGround = (parts: PartIndex, body: string): boolean => body === "ground" || (!!parts[body]?.fixed && parts[body]!.axis !== "p");

/** The phase direction of the input at u: +1 when the input angle grows. */
function direction(model: MechanismModel, parts: PartIndex, body: string, u: number): 1 | -1 {
  const a = bodyPose(parts, body, model.solve(u - 1e-3));
  const b = bodyPose(parts, body, model.solve(u + 1e-3));
  return a && b && b[2] < a[2] ? -1 : 1;
}

/** Point and direction at arc length `s` along a closed path. */
export function alongPath(path: Vec2[], s: number): Pose {
  let L = 0;
  for (let i = 0; i < path.length; i++) L += Math.hypot(path[(i + 1) % path.length]![0] - path[i]![0], path[(i + 1) % path.length]![1] - path[i]![1]);
  let r = ((s % L) + L) % L;
  for (let i = 0; i < path.length; i++) {
    const a = path[i]!;
    const b = path[(i + 1) % path.length]!;
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (r <= l || i === path.length - 1) {
      const t = l ? Math.min(1, r / l) : 0;
      return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, Math.atan2(b[1] - a[1], b[0] - a[0])];
    }
    r -= l;
  }
  return [path[0]![0], path[0]![1], 0];
}

/**
 * A solid's local rings at a solved phase: its outline, stretched along x to the distance of its two points, or its
 * part's deforming outline (src/model/types.ts); a deforming part that gives its holes replaces the solid's first
 * holes with them (the rules may have cut more, which stay).
 */
export function ringsAt(parts: PartIndex, t: Pick<Solid, "outer" | "holes" | "stretch" | "deform" | "body">, s: Solved): { outer: Vec2[]; holes: Vec2[][] } {
  if (t.stretch) {
    const a = s.pts[t.stretch[0]];
    const b = s.pts[t.stretch[1]];
    const L = a && b ? Math.hypot(b[0] - a[0], b[1] - a[1]) : 1;
    return { outer: t.outer.map(([x, y]): Vec2 => [x * L, y]), holes: t.holes };
  }
  if (t.deform) {
    const f = parts[t.body]?.deform;
    if (f) {
      const r = deformRings(f(s));
      return { outer: r.outer, holes: r.holes ? [...r.holes, ...t.holes.slice(r.holes.length)] : t.holes };
    }
  }
  return t;
}

/** A solid's local outline at a solved phase (ringsAt's outer ring). */
export const shapeAt = (parts: PartIndex, t: Pick<Solid, "outer" | "stretch" | "deform" | "body">, s: Solved): Vec2[] =>
  ringsAt(parts, { ...t, holes: [] }, s).outer;

/**
 * A solid's extent along its axis at a solved phase: z0..z1, or for a posed solid that reaches a world point
 * (`reach`), that end moved to where the point lies along the frame's axis.
 */
export function extentAt(t: Pick<Solid, "z0" | "z1" | "reach">, f?: Frame3): [number, number] {
  if (!t.reach || !f) return [t.z0, t.z1];
  const W = frameAxis(f);
  const w = (t.reach.to[0] - f.o[0]) * W[0] + (t.reach.to[1] - f.o[1]) * W[1] + (t.reach.to[2] - f.o[2]) * W[2];
  return t.reach.end === 1 ? [t.z0, w] : [w, t.z1];
}

export function solidPose(model: MechanismModel, parts: PartIndex, t: Pick<Solid, "body" | "at" | "motion">, s: Solved, u: number): Pose | null {
  const B = bodyPose(parts, t.body, s);
  if (!B) return null;
  const m = t.motion;
  if (!m) return xfPose(B, t.at);
  if (m.type === "geared") return [m.around[0], m.around[1], B[2] * m.ratio + t.at[2]];
  if (m.type === "convey") {
    const v = s[m.key];
    return xfPose(alongPath(m.path, (typeof v === "number" ? v : 0) + m.offset), t.at);
  }
  if (m.type === "rolling") {
    const travel = B[0] * m.axis[0] + B[1] * m.axis[1];
    return [m.around[0], m.around[1], -travel / m.r + t.at[2]];
  }
  // oscillating drive: the rocker arm tip on the input, the crank pin on the motor circle, the link between them
  const th = B[2] + m.off;
  const T: Vec2 = [m.pivot[0] + m.rho * Math.cos(th), m.pivot[1] + m.rho * Math.sin(th)];
  const side = direction(model, parts, t.body, u);
  const C = circleX(m.motor, m.r, T, m.L, side);
  const P: Pose =
    m.type === "crank" ? [m.motor[0], m.motor[1], Math.atan2(C[1] - m.motor[1], C[0] - m.motor[0])] : [C[0], C[1], Math.atan2(T[1] - C[1], T[0] - C[0])];
  return xfPose(P, t.at);
}

/**
 * The world box of a solid at a pose (its outline posed in its plane, over its extent along its axis); a solid that
 * widens toward its far end (taper above 1) is boxed at its widest. With `parts`, a stretched or deforming solid is
 * boxed at its outline of the phase.
 */
export const solidBox = (
  t: Pick<Solid, "axis" | "outer" | "z0" | "z1" | "taper" | "frame" | "reach" | "stretch" | "deform" | "body">,
  q: Pose,
  s?: Solved,
  parts?: PartIndex,
): Box3 => {
  const k = Math.max(1, t.taper ?? 1);
  const O = parts && s && (t.stretch || t.deform) ? shapeAt(parts, t, s) : t.outer;
  const P = xf(k === 1 ? O : O.map(([x, y]): Vec2 => [x * k, y * k]), q);
  if (t.axis === "p") {
    // a posed solid is boxed in its frame at the phase (a far box when the frame is not solved)
    const f = t.frame ? s?.frames?.[t.frame] : undefined;
    if (!f) return [1e9, 1e9, 1e9, 1e9, 1e9, 1e9];
    const [w0, w1] = extentAt(t, f);
    return frameBox(f, P, w0, w1);
  }
  return boxOf(t.axis, P, t.z0, t.z1);
};

/** The axis a solid's outline lies normal to, for comparing two solids' planes (a posed one by its frame). */
export const planeKey = (t: Pick<Solid, "axis" | "frame">): string => (t.axis === "p" ? `p:${t.frame}` : (t.axis ?? "z"));
