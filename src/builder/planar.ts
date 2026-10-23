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
 * A ring with the box of each run of RUN edges (edge i runs from point i − 1, the last point for i = 0, to point i): a
 * query skips a run whose box is farther than the best distance found so far, which no edge in it can beat, so it gives
 * what the edge-by-edge loop gives, in a fraction of the time for the long outlines of gears. Made once per ring and
 * reused for every query against it.
 */
export interface Ring {
  P: readonly Vec2[];
  box: Box2;
  /** x0, y0, x1, y1 of each run. */
  runs: Float64Array;
}

const RUN = 16;
/** A run is skipped only when its box is farther than the best so far by more than this: rounding never decides it. */
const SKIP_EPS = 1e-9;

export function ringOf(P: readonly Vec2[]): Ring {
  const n = P.length;
  const R = Math.ceil(n / RUN);
  const runs = new Float64Array(R * 4);
  for (let r = 0; r < R; r++) {
    let x0 = Infinity;
    let y0 = Infinity;
    let x1 = -Infinity;
    let y1 = -Infinity;
    for (let i = r * RUN - 1, end = Math.min(n, (r + 1) * RUN); i < end; i++) {
      const [x, y] = P[i < 0 ? n - 1 : i]!;
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
    runs[r * 4] = x0;
    runs[r * 4 + 1] = y0;
    runs[r * 4 + 2] = x1;
    runs[r * 4 + 3] = y1;
  }
  return { P, box: boxOf(P), runs };
}

/** `inside` on a ring: a run whose points are all above the ray or all on or below it cannot cross it. */
export function insideRing(A: Ring, x: number, y: number): boolean {
  const P = A.P;
  const n = P.length;
  let c = false;
  for (let r = 0, R = A.runs.length / 4; r < R; r++) {
    if (A.runs[r * 4 + 1]! > y || A.runs[r * 4 + 3]! <= y) continue;
    for (let i = r * RUN, end = Math.min(n, i + RUN); i < end; i++) {
      const a = P[i]!;
      const b = P[i === 0 ? n - 1 : i - 1]!;
      if (a[1] > y !== b[1] > y && x < ((b[0] - a[0]) * (y - a[1])) / (b[1] - a[1]) + a[0]) c = !c;
    }
  }
  return c;
}

/**
 * `edgeDist` on a ring, the nearest run first (the least is the same in any order). Early out at `stop`, as `ringDist`:
 * a value at or under it is returned as soon as found.
 */
export function edgeDistRing(A: Ring, x: number, y: number, stop = -1): number {
  const P = A.P;
  const n = P.length;
  const R = A.runs.length / 4;
  const near = new Float64Array(R);
  let first = 0;
  for (let r = 0; r < R; r++) {
    near[r] = Math.hypot(Math.max(0, A.runs[r * 4]! - x, x - A.runs[r * 4 + 2]!), Math.max(0, A.runs[r * 4 + 1]! - y, y - A.runs[r * 4 + 3]!));
    if (near[r]! < near[first]!) first = r;
  }
  let d = Infinity;
  for (let k = 0; k < R; k++) {
    const r = k === 0 ? first : k <= first ? k - 1 : k;
    if (near[r]! > d + SKIP_EPS) continue;
    for (let i = r * RUN, end = Math.min(n, i + RUN); i < end; i++) {
      const a = P[i === 0 ? n - 1 : i - 1]!;
      const b = P[i]!;
      d = Math.min(d, segDist(x, y, a[0], a[1], b[0], b[1]));
    }
    if (d <= stop) return d;
  }
  return d;
}

/**
 * Distance between two filled rings: 0 when they overlap, else the least distance between their edges. Early out at
 * `stop`: any value at or under it is returned as soon as found (the caller only needs to know the gap is small).
 */
export function ringDist(A: readonly Vec2[], B: readonly Vec2[], stop = 0): number {
  return ringDistRing(ringOf(A), ringOf(B), stop);
}

/** `ringDist` on rings. */
export function ringDistRing(RA: Ring, RB: Ring, stop = 0): number {
  const A = RA.P;
  const B = RB.P;
  const g = boxGap(RA.box, RB.box);
  if (g > 0 && g > stop + 1e-9) return g;
  if (inside(B, A[0]![0], A[0]![1]) || inside(A, B[0]![0], B[0]![1])) return 0;
  const m = B.length;
  const runs = RB.runs;
  const R = runs.length / 4;
  let d = Infinity;
  for (let i = 0, j = A.length - 1; i < A.length; j = i++) {
    const a0 = A[j]!;
    const a1 = A[i]!;
    const ex0 = Math.min(a0[0], a1[0]);
    const ex1 = Math.max(a0[0], a1[0]);
    const ey0 = Math.min(a0[1], a1[1]);
    const ey1 = Math.max(a0[1], a1[1]);
    // B's edges in order, as the full loop takes them: a skipped run neither crosses this edge nor comes nearer than d
    for (let r = 0; r < R; r++) {
      const dx = Math.max(0, runs[r * 4]! - ex1, ex0 - runs[r * 4 + 2]!);
      const dy = Math.max(0, runs[r * 4 + 1]! - ey1, ey0 - runs[r * 4 + 3]!);
      if (Math.hypot(dx, dy) > d + SKIP_EPS) continue;
      for (let k = r * RUN, end = Math.min(m, k + RUN); k < end; k++) {
        const b0 = B[k === 0 ? m - 1 : k - 1]!;
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
  }
  return d;
}
