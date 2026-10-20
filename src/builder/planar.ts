// Small polygon queries in a plane, for the placement solver: distance between two outlines and containment.
import type { Vec2 } from "../core/geom";

export interface Box2 {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

export function boxOf(P: readonly Vec2[]): Box2 {
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  for (const [x, y] of P) {
    if (x < x0) x0 = x;
    if (x > x1) x1 = x;
    if (y < y0) y0 = y;
    if (y > y1) y1 = y;
  }
  return { x0, y0, x1, y1 };
}

/** Gap between two boxes (0 when they overlap). */
export function boxGap(a: Box2, b: Box2): number {
  const dx = Math.max(0, a.x0 - b.x1, b.x0 - a.x1);
  const dy = Math.max(0, a.y0 - b.y1, b.y0 - a.y1);
  return Math.hypot(dx, dy);
}

export function inside(P: readonly Vec2[], x: number, y: number): boolean {
  let c = false;
  for (let i = 0, j = P.length - 1; i < P.length; j = i++) {
    const a = P[i]!;
    const b = P[j]!;
    if (a[1] > y !== b[1] > y && x < ((b[0] - a[0]) * (y - a[1])) / (b[1] - a[1]) + a[0]) c = !c;
  }
  return c;
}

function segDist(px: number, py: number, ax: number, ay: number, bx: number, by: number): number {
  const dx = bx - ax;
  const dy = by - ay;
  const l = dx * dx + dy * dy;
  const t = l > 0 ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / l)) : 0;
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

/** Distance from a point to a ring's edge. */
export function edgeDist(P: readonly Vec2[], x: number, y: number): number {
  let d = Infinity;
  for (let i = 0, j = P.length - 1; i < P.length; j = i++) d = Math.min(d, segDist(x, y, P[j]![0], P[j]![1], P[i]![0], P[i]![1]));
  return d;
}

/** Distance from a point to a filled ring: 0 inside. */
export const pointDist = (P: readonly Vec2[], x: number, y: number): number => (inside(P, x, y) ? 0 : edgeDist(P, x, y));

/**
 * Distance between two filled rings: 0 when they overlap, else the least distance between their edges. Early out at
 * `stop`: any value at or under it is returned as soon as found (the caller only needs to know the gap is small).
 */
export function ringDist(A: readonly Vec2[], B: readonly Vec2[], stop = 0): number {
  const ba = boxOf(A);
  const bb = boxOf(B);
  const g = boxGap(ba, bb);
  if (g > 0 && g > stop + 1e-9) return g;
  if (inside(B, A[0]![0], A[0]![1]) || inside(A, B[0]![0], B[0]![1])) return 0;
  let d = Infinity;
  for (let i = 0, j = A.length - 1; i < A.length; j = i++) {
    const a0 = A[j]!;
    const a1 = A[i]!;
    for (let k = 0, l = B.length - 1; k < B.length; l = k++) {
      const b0 = B[l]!;
      const b1 = B[k]!;
      // crossing segments
      const d1 = (a1[0] - a0[0]) * (b0[1] - a0[1]) - (a1[1] - a0[1]) * (b0[0] - a0[0]);
      const d2 = (a1[0] - a0[0]) * (b1[1] - a0[1]) - (a1[1] - a0[1]) * (b1[0] - a0[0]);
      const d3 = (b1[0] - b0[0]) * (a0[1] - b0[1]) - (b1[1] - b0[1]) * (a0[0] - b0[0]);
      const d4 = (b1[0] - b0[0]) * (a1[1] - b0[1]) - (b1[1] - b0[1]) * (a1[0] - b0[0]);
      if (d1 * d2 < 0 && d3 * d4 < 0) return 0;
      d = Math.min(d, segDist(a0[0], a0[1], b0[0], b0[1], b1[0], b1[1]), segDist(a1[0], a1[1], b0[0], b0[1], b1[0], b1[1]), segDist(b0[0], b0[1], a0[0], a0[1], a1[0], a1[1]), segDist(b1[0], b1[1], a0[0], a0[1], a1[0], a1[1]));
      if (d <= stop) return d;
    }
  }
  return d;
}
