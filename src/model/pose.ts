import { boxOf, frameBox, type Box3 } from "../core/axis";
import { xf } from "../core/geom";
import type { MechanismModel, Part, Pose, Shape, Solved, Vec2 } from "./types";

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

/** A deforming outline as rings: a part's `deform(s)` may return the outer ring alone or the outer ring and its holes. */
export const deformRings = (d: Vec2[] | Shape): { outer: Vec2[]; holes?: Vec2[][] } => (Array.isArray(d) ? { outer: d } : d);

/**
 * A part's rings at a solved phase: its shape, stretched along x to the distance of its two points (`stretch`), or
 * from `deform(s)` (its holes too where it gives them, else the shape's).
 */
export function partRings(p: Part, s: Solved): Shape {
  if (p.deform) {
    const r = deformRings(p.deform(s));
    return { outer: r.outer, holes: r.holes ?? p.shape.holes };
  }
  if (p.stretch && p.between) {
    const a = s.pts[p.between[0]];
    const b = s.pts[p.between[1]];
    const L = a && b ? Math.hypot(b[0] - a[0], b[1] - a[1]) : 1;
    return { outer: p.shape.outer.map(([x, y]): Vec2 => [x * L, y]), holes: p.shape.holes };
  }
  return p.shape;
}

/** A part's outline at a solved phase (partRings' outer ring). */
export const partShape = (p: Part, s: Solved): Vec2[] => partRings(p, s).outer;

/**
 * The world box of a part at a solved phase: its outline over its z range, or over its extent along an x, y or posed
 * axis. Null when the part has no pose or its frame is not solved.
 */
export function partBox(p: Part, s: Solved): Box3 | null {
  const q = poseOf(p, s);
  if (!q) return null;
  const P = xf(partShape(p, s), q);
  const w0 = p.axis === "x" || p.axis === "y" || p.axis === "p" ? (p.along ?? 0) + (p.dz ?? 0) : p.layer * 10 + (p.dz ?? 0);
  const w1 = w0 + p.thick;
  if (p.axis === "p") {
    const f = p.frame ? s.frames?.[p.frame] : undefined;
    return f ? frameBox(f, P, w0, w1) : null;
  }
  return boxOf(p.axis === "x" || p.axis === "y" ? p.axis : "z", P, w0, w1);
}

/** Velocity of a solved point per radian of cycle phase, by central difference. */
export function velocity(model: MechanismModel, u: number, point: string, du = 1e-3): Vec2 {
  const a = model.solve(u - du).pts[point];
  const b = model.solve(u + du).pts[point];
  if (!a || !b) return [NaN, NaN];
  return [(b[0] - a[0]) / (2 * du), (b[1] - a[1]) / (2 * du)];
}
