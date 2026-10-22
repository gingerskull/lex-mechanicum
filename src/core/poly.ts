// Point and polygon queries for the build: containment and the distance to an outline.
import type { Vec2 } from "./geom";

/** Even-odd point in polygon. */
export function inside(P: Vec2[], [x, y]: Vec2): boolean {
  let c = false;
  for (let i = 0, j = P.length - 1; i < P.length; j = i++) {
    const a = P[i]!;
    const b = P[j]!;
    if (a[1] > y !== b[1] > y && x < ((b[0] - a[0]) * (y - a[1])) / (b[1] - a[1]) + a[0]) c = !c;
  }
  return c;
}

export function segDist(q: Vec2, a: Vec2, b: Vec2): number {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const L2 = dx * dx + dy * dy || 1;
  const t = Math.max(0, Math.min(1, ((q[0] - a[0]) * dx + (q[1] - a[1]) * dy) / L2));
  return Math.hypot(q[0] - a[0] - t * dx, q[1] - a[1] - t * dy);
}

/** Distance from q to the boundary of P. */
export function edgeDist(P: Vec2[], q: Vec2): number {
  let d = Infinity;
  for (let i = 0; i < P.length; i++) d = Math.min(d, segDist(q, P[i]!, P[(i + 1) % P.length]!));
  return d;
}
