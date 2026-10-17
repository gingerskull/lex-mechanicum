// Point and polygon queries for the build: containment, distances, overlap of outlines with holes.
import type { Pose, Vec2 } from "./geom";

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

/** Signed depth of q in a region (outer minus holes): positive inside material, negative outside or in a hole. */
export function depth(outer: Vec2[], holes: Vec2[][], q: Vec2): number {
  if (!inside(outer, q)) return -edgeDist(outer, q);
  let d = edgeDist(outer, q);
  for (const h of holes) {
    if (inside(h, q)) return -edgeDist(h, q);
    d = Math.min(d, edgeDist(h, q));
  }
  return d;
}

/** A point in body-local coordinates of `pose`. */
export function toLocal(pose: Pose, [x, y]: Vec2): Vec2 {
  const c = Math.cos(-pose[2]);
  const s = Math.sin(-pose[2]);
  const dx = x - pose[0];
  const dy = y - pose[1];
  return [dx * c - dy * s, dx * s + dy * c];
}

export const toWorld = (pose: Pose, [x, y]: Vec2): Vec2 => {
  const c = Math.cos(pose[2]);
  const s = Math.sin(pose[2]);
  return [pose[0] + x * c - y * s, pose[1] + x * s + y * c];
};

export interface Region {
  outer: Vec2[];
  holes: Vec2[][];
  box: [number, number, number, number];
}

export function region(outer: Vec2[], holes: Vec2[][]): Region {
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  for (const [x, y] of outer) {
    if (x < x0) x0 = x;
    if (x > x1) x1 = x;
    if (y < y0) y0 = y;
    if (y > y1) y1 = y;
  }
  return { outer, holes, box: [x0, y0, x1, y1] };
}

/**
 * How far two regions interpenetrate: the largest depth of a vertex of one inside the material of the other, 0 when
 * they only touch or are apart. Outlines are dense polygons, so vertex depth is a good measure.
 */
export function overlap(a: Region, b: Region): number {
  if (a.box[0] > b.box[2] || b.box[0] > a.box[2] || a.box[1] > b.box[3] || b.box[1] > a.box[3]) return 0;
  let m = 0;
  const probe = (p: Region, q: Region) => {
    for (const v of p.outer) {
      if (v[0] < q.box[0] || v[0] > q.box[2] || v[1] < q.box[1] || v[1] > q.box[3]) continue;
      const d = depth(q.outer, q.holes, v);
      if (d > m) m = d;
    }
  };
  probe(a, b);
  probe(b, a);
  return m;
}

/** Smallest distance between a circle and a region's material (negative when it overlaps). */
export function circleClearance(c: Vec2, r: number, g: Region): number {
  if (c[0] + r < g.box[0] - 50 || c[0] - r > g.box[2] + 50 || c[1] + r < g.box[1] - 50 || c[1] - r > g.box[3] + 50) return 50;
  return -depth(g.outer, g.holes, c) - r;
}
