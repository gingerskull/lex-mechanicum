// Flexible members (J12): the closed path a chain or belt follows round two wheels, and the centre distance that makes
// a whole number of links. Millimetres and radians; tested in tests/core/flex.test.ts.
import { TAU, arcPts, type Vec2 } from "./geom";

/** Length of the open-belt path round two wheels of pitch radius r1, r2 at centre distance C. */
export function beltLength(r1: number, r2: number, C: number): number {
  const b = Math.asin((r2 - r1) / C);
  return 2 * Math.sqrt(C * C - (r2 - r1) * (r2 - r1)) + r1 * (Math.PI - 2 * b) + r2 * (Math.PI + 2 * b);
}

/** The centre distance at which the path is exactly `L` long (bisection; L must exceed the touching length). */
export function centresFor(r1: number, r2: number, L: number): number {
  let lo = Math.abs(r2 - r1) + 1e-6;
  let hi = L;
  for (let i = 0; i < 100; i++) {
    const m = (lo + hi) / 2;
    if (beltLength(r1, r2, m) < L) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
}

/**
 * The closed path (counter-clockwise) round wheel 1 at c1 (radius r1) and wheel 2 at c2 (radius r2): the far arc of
 * each wheel and the two outer tangents, as points at most `step` radians apart on the arcs.
 */
export function beltPath(c1: Vec2, r1: number, c2: Vec2, r2: number, step = Math.PI / 24): Vec2[] {
  const dx = c2[0] - c1[0];
  const dy = c2[1] - c1[1];
  const C = Math.hypot(dx, dy);
  const a = Math.atan2(dy, dx);
  const b = Math.asin((r2 - r1) / C);
  // the tangent points sit at a ± (π/2 + b) from each centre
  const arc1 = arcPts(c1[0], c1[1], r1, a + Math.PI / 2 + b, a + TAU - Math.PI / 2 - b, step);
  const arc2 = arcPts(c2[0], c2[1], r2, a - Math.PI / 2 - b, a + Math.PI / 2 + b, step);
  return [...arc1, ...arc2];
}

/** The length of a closed polyline. */
export function pathLength(P: Vec2[]): number {
  let L = 0;
  for (let i = 0; i < P.length; i++) L += Math.hypot(P[(i + 1) % P.length]![0] - P[i]![0], P[(i + 1) % P.length]![1] - P[i]![1]);
  return L;
}
