// Vector and kinematic helpers used by mechanism solvers.
import type { Vec2 } from "./geom";

export const V = {
  add: (a: Vec2, b: Vec2): Vec2 => [a[0] + b[0], a[1] + b[1]],
  sub: (a: Vec2, b: Vec2): Vec2 => [a[0] - b[0], a[1] - b[1]],
  mul: (a: Vec2, k: number): Vec2 => [a[0] * k, a[1] * k],
  len: (a: Vec2): number => Math.hypot(a[0], a[1]),
  dist: (a: Vec2, b: Vec2): number => Math.hypot(b[0] - a[0], b[1] - a[1]),
  /** Direction of b seen from a. */
  ang: (a: Vec2, b: Vec2): number => Math.atan2(b[1] - a[1], b[0] - a[0]),
  lerp: (a: Vec2, b: Vec2, t: number): Vec2 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t],
  rot: (a: Vec2, t: number): Vec2 => [a[0] * Math.cos(t) - a[1] * Math.sin(t), a[0] * Math.sin(t) + a[1] * Math.cos(t)],
  /** Point on a rigid body with origin o and angle th, at local (x, y). */
  at: (o: Vec2, th: number, x: number, y = 0): Vec2 => [
    o[0] + x * Math.cos(th) - y * Math.sin(th),
    o[1] + x * Math.sin(th) + y * Math.cos(th),
  ],
};

/** Intersection of circles (c1, r1) and (c2, r2). side = +1 picks the point left of c1→c2, −1 the right one. */
export function circleX(c1: Vec2, r1: number, c2: Vec2, r2: number, side: 1 | -1 = 1): Vec2 {
  const dx = c2[0] - c1[0];
  const dy = c2[1] - c1[1];
  const d = Math.hypot(dx, dy) || 1e-9;
  const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, r1 * r1 - a * a));
  const ex = dx / d;
  const ey = dy / d;
  return [c1[0] + a * ex - side * h * ey, c1[1] + a * ey + side * h * ex];
}

/** Oscillating input profile: u in 0..2π sweeps smoothly from lo to hi and back. */
export const osc =
  (lo: number, hi: number) =>
  (u: number): number =>
    lo + (hi - lo) * (0.5 - 0.5 * Math.cos(u));
