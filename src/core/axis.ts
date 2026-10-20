// The out-of-plane axis of a part or a solid (decision #86, option 1: a planar model with declared axes). A solid is an
// outline in the plane normal to its axis, extruded along it. The axis is z of the base (the default: a plate lying on
// the base), or x or y (a shaft in plan, a disc standing on edge). The solver's 2D points are read in each part's own
// plane:
//
//   axis z: local (u, v) -> world (x, y), the extent along the axis is z (today's case);
//   axis x: local (u, v) -> world (y, z), the extent along the axis is x;
//   axis y: local (u, v) -> world (x, z), the extent along the axis is y.
//
// So v is always up (z) for an axis in plan, and an angle about a y axis turns from x toward z.
import type { Vec2 } from "./geom";

export type Axis = "z" | "x" | "y";
export type Vec3 = [number, number, number];
/** An axis-aligned box in world mm: x0, y0, z0, x1, y1, z1. */
export type Box3 = [number, number, number, number, number, number];

/** True for an axis other than z: the part or solid stands out of the plan plane. */
export const isOut = (axis: Axis | undefined): axis is "x" | "y" => axis === "x" || axis === "y";

/** World point of a point (p, q) in the plane of `axis` at `w` along it. */
export function toWorld(axis: Axis | undefined, [p, q]: Vec2, w: number): Vec3 {
  if (axis === "x") return [w, p, q];
  if (axis === "y") return [p, w, q];
  return [p, q, w];
}

/** The unit vector of an axis in world coordinates. */
export const axisVec = (axis: Axis | undefined): Vec3 => (axis === "x" ? [1, 0, 0] : axis === "y" ? [0, 1, 0] : [0, 0, 1]);

/** The world box of an outline already posed in its plane, extruded from w0 to w1 along `axis`. */
export function boxOf(axis: Axis | undefined, P: Vec2[], w0: number, w1: number): Box3 {
  let p0 = Infinity;
  let q0 = Infinity;
  let p1 = -Infinity;
  let q1 = -Infinity;
  for (const [p, q] of P) {
    if (p < p0) p0 = p;
    if (p > p1) p1 = p;
    if (q < q0) q0 = q;
    if (q > q1) q1 = q;
  }
  if (axis === "x") return [w0, p0, q0, w1, p1, q1];
  if (axis === "y") return [p0, w0, q0, p1, w1, q1];
  return [p0, q0, w0, p1, q1, w1];
}

/** How far two boxes overlap: the smallest overlap over the three directions, mm (≤ 0 when they are apart). */
export function boxOverlap(a: Box3, b: Box3): number {
  return Math.min(Math.min(a[3], b[3]) - Math.max(a[0], b[0]), Math.min(a[4], b[4]) - Math.max(a[1], b[1]), Math.min(a[5], b[5]) - Math.max(a[2], b[2]));
}

/** The plan (x, y) corners of a box, for envelopes and base sizing. */
export const planCorners = (b: Box3): Vec2[] => [
  [b[0], b[1]],
  [b[3], b[1]],
  [b[3], b[4]],
  [b[0], b[4]],
];
