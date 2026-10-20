import type { MechanismModel, Part, Pose, Solved, Vec2 } from "./types";

/**
 * A part's pose from, in order: its fixed pose, an explicit solved pose, the segment between two named points (the
 * part's x axis runs from the first toward the second), or a single named point (pins, tracers). Null if unplaced.
 */
export function poseOf(p: Part, s: Solved): Pose | null {
  if (p.fixed) return p.fixed;
  const solved = s.poses?.[p.id];
  if (solved) return solved;
  if (p.between) {
    const a = s.pts[p.between[0]];
    const b = s.pts[p.between[1]];
    if (!a || !b) return null;
    return [a[0], a[1], Math.atan2(b[1] - a[1], b[0] - a[0]) + (p.off ?? 0)];
  }
  if (p.at) {
    const a = s.pts[p.at];
    return a ? [a[0], a[1], p.spin ? p.spin(s) : 0] : null;
  }
  return null;
}

/**
 * A part's outline at a solved phase: its shape, stretched along x to the distance of its two points (`stretch`), or
 * from `deform(s)`.
 */
export function partShape(p: Part, s: Solved): Vec2[] {
  if (p.deform) return p.deform(s);
  if (p.stretch && p.between) {
    const a = s.pts[p.between[0]];
    const b = s.pts[p.between[1]];
    const L = a && b ? Math.hypot(b[0] - a[0], b[1] - a[1]) : 1;
    return p.shape.outer.map(([x, y]): Vec2 => [x * L, y]);
  }
  return p.shape.outer;
}

/** Velocity of a solved point per radian of cycle phase, by central difference. */
export function velocity(model: MechanismModel, u: number, point: string, du = 1e-3): Vec2 {
  const a = model.solve(u - du).pts[point];
  const b = model.solve(u + du).pts[point];
  if (!a || !b) return [NaN, NaN];
  return [(b[0] - a[0]) / (2 * du), (b[1] - a[1]) / (2 * du)];
}
