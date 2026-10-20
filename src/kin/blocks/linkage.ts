// Closed-form planar and spatial linkage blocks: dyads, slider dyads, five-bar inverse kinematics.
import { type Vec3, v3 } from "../math";

export interface DyadSolution {
  /** The two closures: [left of a→b seen from +n, right of it]. */
  roots: [Vec3, Vec3];
  /** h² = r_a² − (distance along a→b)². Negative: the links cannot reach; h is then 0. */
  h2: number;
  h: number;
  reachable: boolean;
}

/**
 * RRR dyad: the point at distance ra from a and rb from b, in the plane through a with normal n (default +z).
 * b is projected onto that plane. roots[0] is the closure left of a→b seen from +n.
 */
export function dyadRRR(a: Vec3, b: Vec3, ra: number, rb: number, n: Vec3 = [0, 0, 1]): DyadSolution {
  const nn = v3.unit(n);
  const d = v3.perp(v3.sub(b, a), nn);
  const dist = v3.len(d);
  if (dist < 1e-12) {
    const e: Vec3 = [1, 0, 0];
    const m = v3.cross(nn, v3.unit(v3.perp(e, nn)));
    return { roots: [v3.add(a, v3.mul(m, ra)), v3.sub(a, v3.mul(m, ra))], h2: ra * ra, h: ra, reachable: Math.abs(ra - rb) < 1e-9 };
  }
  const e = v3.mul(d, 1 / dist);
  const m = v3.cross(nn, e);
  const x = (ra * ra - rb * rb + dist * dist) / (2 * dist);
  const h2 = ra * ra - x * x;
  const h = Math.sqrt(Math.max(0, h2));
  const base = v3.add(a, v3.mul(e, x));
  return { roots: [v3.add(base, v3.mul(m, h)), v3.sub(base, v3.mul(m, h))], h2, h, reachable: h2 >= -1e-9 * (ra * ra + 1) };
}

export interface SliderDyadSolution {
  /** Coordinates along the line direction of the two closures: [far, near] (larger s first). */
  s: [number, number];
  points: [Vec3, Vec3];
  h2: number;
  h: number;
  reachable: boolean;
}

/**
 * RRP dyad: the point on the line p0 + s d (a slide) at distance r from the pivot a (a crank and a slide).
 * Slider-crank, trammel and Scott Russell are this with the line fixed; an offset is the line's distance from a.
 */
export function dyadRRP(a: Vec3, r: number, p0: Vec3, d: Vec3): SliderDyadSolution {
  const dd = v3.unit(d);
  const t = v3.dot(v3.sub(a, p0), dd);
  const perp = v3.len(v3.perp(v3.sub(a, p0), dd));
  const h2 = r * r - perp * perp;
  const h = Math.sqrt(Math.max(0, h2));
  const s: [number, number] = [t + h, t - h];
  return { s, points: [v3.add(p0, v3.mul(dd, s[0])), v3.add(p0, v3.mul(dd, s[1]))], h2, h, reachable: h2 >= -1e-9 * (r * r + 1) };
}

/**
 * RPR dyad: a slotted link turning about the pivot a with a pin at p sliding in it (Whitworth, crank-shaper).
 * Returns the slotted link's direction angle in the plane of normal n (from +x projected) and the pin's distance from a.
 */
export function dyadRPR(a: Vec3, p: Vec3, n: Vec3 = [0, 0, 1]): { angle: number; dist: number } {
  const nn = v3.unit(n);
  const d = v3.perp(v3.sub(p, a), nn);
  const ex = v3.unit(v3.perp([1, 0, 0], nn));
  const ey = v3.cross(nn, ex);
  return { angle: Math.atan2(v3.dot(d, ey), v3.dot(d, ex)), dist: v3.len(d) };
}

export interface FiveBarGeometry {
  /** Base pivots of the two driven cranks. */
  A1: Vec3;
  A2: Vec3;
  /** Proximal (crank) and distal link lengths. */
  l1: number;
  l2: number;
  l3: number;
  l4: number;
  n?: Vec3;
}

/** Five-bar forward step: the elbows from the two crank angles, then the end point as a dyad of the elbows. */
export function fiveBarFK(g: FiveBarGeometry, th1: number, th2: number, side: 1 | -1 = 1): { E1: Vec3; E2: Vec3; P: Vec3; h: number } {
  const n = g.n ?? [0, 0, 1];
  const ex = v3.unit(v3.perp([1, 0, 0], n));
  const ey = v3.cross(n, ex);
  const arm = (A: Vec3, l: number, th: number): Vec3 => v3.add(A, v3.add(v3.mul(ex, l * Math.cos(th)), v3.mul(ey, l * Math.sin(th))));
  const E1 = arm(g.A1, g.l1, th1);
  const E2 = arm(g.A2, g.l2, th2);
  const sol = dyadRRR(E1, E2, g.l3, g.l4, n);
  return { E1, E2, P: side === 1 ? sol.roots[0] : sol.roots[1], h: sol.h };
}

/**
 * Five-bar inverse kinematics: the two crank angles that put the end point at P. `elbow1` and `elbow2` pick the
 * side of each arm's elbow (+1 left of base→P seen from +n). Null when P is out of reach of either arm.
 */
export function fiveBarIK(g: FiveBarGeometry, P: Vec3, elbow1: 1 | -1 = 1, elbow2: 1 | -1 = 1): { th1: number; th2: number; E1: Vec3; E2: Vec3 } | null {
  const n = g.n ?? [0, 0, 1];
  const ex = v3.unit(v3.perp([1, 0, 0], n));
  const ey = v3.cross(n, ex);
  const arm = (A: Vec3, l: number, lp: number, side: 1 | -1) => {
    const s = dyadRRR(A, P, l, lp, n); // closes the proximal l about A and the distal lp about P
    if (!s.reachable) return null;
    const E = side === 1 ? s.roots[0] : s.roots[1];
    const d = v3.sub(E, A);
    return { E, th: Math.atan2(v3.dot(d, ey), v3.dot(d, ex)) };
  };
  const a1 = arm(g.A1, g.l1, g.l3, elbow1);
  const a2 = arm(g.A2, g.l2, g.l4, elbow2);
  if (!a1 || !a2) return null;
  return { th1: a1.th, th2: a2.th, E1: a1.E, E2: a2.E };
}
