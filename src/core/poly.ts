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

/** Distance from p along the unit direction d to the first crossing of polygon P's boundary; Infinity if none. */
export function rayHit(P: Vec2[], p: Vec2, d: Vec2): number {
  let t = Infinity;
  for (let i = 0; i < P.length; i++) {
    const a = P[i]!;
    const b = P[(i + 1) % P.length]!;
    const ex = b[0] - a[0];
    const ey = b[1] - a[1];
    const den = d[0] * ey - d[1] * ex;
    if (Math.abs(den) < 1e-12) continue;
    const ax = a[0] - p[0];
    const ay = a[1] - p[1];
    const tt = (ax * ey - ay * ex) / den;
    const ss = (ax * d[1] - ay * d[0]) / den;
    if (tt > 1e-9 && ss >= 0 && ss <= 1 && tt < t) t = tt;
  }
  return t;
}

/**
 * A straight slot in a part, local mm: the centre of its closed end c0, the unit axis u from there along the slot,
 * the length len along u to the other end's centre (a closed slot) or to where the walls end (an open one, a notch in
 * the outline), and the half-width w. `hole` is its index in the part's holes for a closed slot.
 */
export interface Slot {
  c0: Vec2;
  u: Vec2;
  len: number;
  w: number;
  open: boolean;
  hole?: number;
}

/**
 * A closed stadium slot from a hole's box (the slot runs along x or y), or null for a hole shorter than `minLen` widths
 * (a round hole).
 */
export function holeSlot(h: Vec2[], hole: number, minLen = 0.3): Slot | null {
  const [x0, y0, x1, y1] = boxOf(h);
  const along = x1 - x0 >= y1 - y0;
  const w = (along ? y1 - y0 : x1 - x0) / 2;
  const L = (along ? x1 - x0 : y1 - y0) - 2 * w;
  if (L < minLen * w) return null;
  const c0: Vec2 = along ? [x0 + w, (y0 + y1) / 2] : [(x0 + x1) / 2, y0 + w];
  return { c0, u: along ? [1, 0] : [0, 1], len: L, w, open: false, hole };
}

const boxOf = (P: Vec2[]): [number, number, number, number] => region(P, []).box;

/**
 * The open slot (a notch in the outline) that holds p, a point outside the material: the walls run parallel on both
 * sides within maxW, the end is closed behind p and the mouth open ahead. Null when p is not in a notch.
 */
export function notchAt(P: Vec2[], p: Vec2, maxW: number): Slot | null {
  if (inside(P, p) || edgeDist(P, p) > maxW) return null;
  const width = (th: number) => {
    const n: Vec2 = [-Math.sin(th), Math.cos(th)];
    return rayHit(P, p, n) + rayHit(P, p, [-n[0], -n[1]]);
  };
  // the axis: a direction p escapes along, with the narrowest walls across it
  let best = -1;
  let bw = Infinity;
  const N = 144;
  for (let k = 0; k < N; k++) {
    const th = (k / N) * 2 * Math.PI;
    if (rayHit(P, p, [Math.cos(th), Math.sin(th)]) < Infinity) continue;
    const w = width(th);
    if (w < bw) {
      bw = w;
      best = th;
    }
  }
  if (best < 0 || bw > 2 * maxW) return null;
  let lo = best - Math.PI / N;
  let hi = best + Math.PI / N;
  for (let i = 0; i < 30; i++) {
    const a = lo + (hi - lo) / 3;
    const b = hi - (hi - lo) / 3;
    if (width(a) < width(b)) hi = b;
    else lo = a;
  }
  const th = (lo + hi) / 2;
  const u: Vec2 = [Math.cos(th), Math.sin(th)];
  const n: Vec2 = [-u[1], u[0]];
  const h1 = rayHit(P, p, n);
  const h2 = rayHit(P, p, [-n[0], -n[1]]);
  const w = (h1 + h2) / 2;
  const q: Vec2 = [p[0] + (n[0] * (h1 - h2)) / 2, p[1] + (n[1] * (h1 - h2)) / 2];
  const back = rayHit(P, q, [-u[0], -u[1]]);
  if (back === Infinity) return null;
  const c0: Vec2 = [q[0] - u[0] * (back - w), q[1] - u[1] * (back - w)];
  // the walls end at the mouth; they run parallel all the way, or this is a corner, not a slot
  let len = 0;
  for (let s = 0; s < 400; s += 0.25) {
    const c: Vec2 = [c0[0] + u[0] * s, c0[1] + u[1] * s];
    const a = rayHit(P, c, n);
    const b = rayHit(P, c, [-n[0], -n[1]]);
    if (a > w + 0.3 || b > w + 0.3) break;
    if (a < w - 0.3 || b < w - 0.3) return null;
    len = s;
  }
  return len >= w ? { c0, u, len, w, open: true } : null;
}
