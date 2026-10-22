// Conveyed solids (standard D9: "conveyed small rigid solids carried along a fixed closed path by a solved travel"): a
// belt's teeth, a chain's rollers and plates, a ball screw's balls. Each solid is built at its place on the path in the
// reference configuration; at a pose it is carried along the path by the travel (a kin value, mm along the path),
// turned to the path's direction there, all in the frame of the body that carries the path (the ground for a belt, the
// nut for a ball circuit). Shared by the renderer's poser and the 3D checks.
import type { Vec3 } from "./types";

export interface ConveyPath {
  /** Points of the closed path in the world reference coordinates of its carrier body. */
  pts: Vec3[];
  /** The kin value that gives the travel along the path, mm (0 at the reference). */
  key: string;
  /** The body whose pose carries the path ("ground" for a fixed path). */
  carrier: string;
  /** A direction the solid's frame keeps as near as it can to its own z (a planar path's normal); default world z. */
  up?: Vec3;
  /**
   * The travel is not measured along the path but in a coordinate of its own (a chain's links, which wrap a sprocket on
   * its seat circle, a little longer than their pitch): breakpoints `c` of that coordinate (from 0 to the loop's whole
   * length in it) and the path distance `d` at each, linear between.
   */
  map?: { c: number[]; d: number[] };
  /**
   * A loop whose shape follows kin values (a CVT's belt): an open belt round two wheels at c1 and c2 (their axes along
   * `axis`) whose pitch radii are the values `r1` and `r2`, its plane moved along the axis by the value `offset`. `pts`
   * is the same loop at the radii it is built at; a pose carries each solid from its place on `pts` to the same distance
   * plus the travel on the loop the values give (the belt's length is the same).
   */
  live?: { c1: Vec3; c2: Vec3; axis: Vec3; r1: string; r2: string; offset?: string; n: number };
}

/**
 * The open-belt loop round two wheels (counter-clockwise seen from +axis): from where it leaves wheel 1's far arc on the
 * upper tangent, round wheel 1's far side, the lower tangent, round wheel 2's far side; n points on each arc.
 */
export function beltLoop(c1: Vec3, c2: Vec3, axis: Vec3, r1: number, r2: number, n: number): Vec3[] {
  const l = Math.hypot(axis[0], axis[1], axis[2]) || 1;
  const w: Vec3 = [axis[0] / l, axis[1] / l, axis[2] / l];
  const d: Vec3 = [c2[0] - c1[0], c2[1] - c1[1], c2[2] - c1[2]];
  const k = d[0] * w[0] + d[1] * w[1] + d[2] * w[2];
  const dp: Vec3 = [d[0] - k * w[0], d[1] - k * w[1], d[2] - k * w[2]];
  const C = Math.hypot(dp[0], dp[1], dp[2]) || 1;
  const u: Vec3 = [dp[0] / C, dp[1] / C, dp[2] / C];
  const v: Vec3 = [w[1] * u[2] - w[2] * u[1], w[2] * u[0] - w[0] * u[2], w[0] * u[1] - w[1] * u[0]];
  const b = Math.asin((r2 - r1) / C);
  const out: Vec3[] = [];
  const arc = (o: Vec3, r: number, t0: number, t1: number) => {
    for (let i = 0; i < n; i++) {
      const t = t0 + ((t1 - t0) * i) / (n - 1);
      const x = r * Math.cos(t);
      const y = r * Math.sin(t);
      out.push([o[0] + u[0] * x + v[0] * y, o[1] + u[1] * x + v[1] * y, o[2] + u[2] * x + v[2] * y]);
    }
  };
  arc(c1, r1, Math.PI / 2 + b, 2 * Math.PI - Math.PI / 2 - b);
  arc([c1[0] + dp[0], c1[1] + dp[1], c1[2] + dp[2]], r2, -Math.PI / 2 - b, Math.PI / 2 + b);
  return out;
}

const liveCache = new WeakMap<ConveyPath, { key: string; path: ConveyPath }>();

/** The loop a live path takes at the given kin values (itself when it is not live or the values are missing). */
export function livePath(p: ConveyPath, vals?: Record<string, number>): ConveyPath {
  const lv = p.live;
  if (!lv || !vals) return p;
  const r1 = vals[lv.r1];
  const r2 = vals[lv.r2];
  if (r1 === undefined || r2 === undefined) return p;
  const off = lv.offset ? (vals[lv.offset] ?? 0) : 0;
  const key = `${r1}|${r2}|${off}`;
  const hit = liveCache.get(p);
  if (hit && hit.key === key) return hit.path;
  const l = Math.hypot(lv.axis[0], lv.axis[1], lv.axis[2]) || 1;
  const sh: Vec3 = [(lv.axis[0] / l) * off, (lv.axis[1] / l) * off, (lv.axis[2] / l) * off];
  const add = (a: Vec3): Vec3 => [a[0] + sh[0], a[1] + sh[1], a[2] + sh[2]];
  const path: ConveyPath = { pts: beltLoop(add(lv.c1), add(lv.c2), lv.axis, r1, r2, lv.n), key: p.key, carrier: p.carrier, ...(p.up ? { up: p.up } : {}) };
  liveCache.set(p, { key, path });
  return path;
}

/** The path distance of a place given in the path's travel coordinate. */
export function distOf(p: ConveyPath, c: number): number {
  const m = p.map;
  if (!m) return c;
  const C = m.c[m.c.length - 1]!;
  const L = m.d[m.d.length - 1]!;
  const turns = Math.floor(c / C);
  const x = c - turns * C;
  let k = 0;
  while (k < m.c.length - 2 && m.c[k + 1]! <= x) k++;
  const f = (x - m.c[k]!) / (m.c[k + 1]! - m.c[k]! || 1);
  return turns * L + m.d[k]! + f * (m.d[k + 1]! - m.d[k]!);
}

interface Cum {
  s: Float64Array;
  L: number;
}
const cums = new WeakMap<ConveyPath, Cum>();

function cumOf(p: ConveyPath): Cum {
  const hit = cums.get(p);
  if (hit) return hit;
  const n = p.pts.length;
  const s = new Float64Array(n + 1);
  for (let i = 0; i < n; i++) {
    const a = p.pts[i]!;
    const b = p.pts[(i + 1) % n]!;
    s[i + 1] = s[i]! + Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
  }
  const c = { s, L: s[n]! };
  cums.set(p, c);
  return c;
}

/** Length of a closed path. */
export const pathLength = (p: ConveyPath): number => cumOf(p).L;

/** Position and unit tangent at arc length `at` (wrapped round the loop). */
export function along(p: ConveyPath, at: number): { o: Vec3; t: Vec3 } {
  const { s, L } = cumOf(p);
  const n = p.pts.length;
  const x = ((at % L) + L) % L;
  let lo = 0;
  let hi = n;
  while (hi - lo > 1) {
    const m = (lo + hi) >> 1;
    if (s[m]! <= x) lo = m;
    else hi = m;
  }
  const a = p.pts[lo]!;
  const b = p.pts[(lo + 1) % n]!;
  const d = s[lo + 1]! - s[lo]! || 1;
  const f = (x - s[lo]!) / d;
  const t: Vec3 = [(b[0] - a[0]) / d, (b[1] - a[1]) / d, (b[2] - a[2]) / d];
  return { o: [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f], t };
}

/** Column-major 4x4 of the frame at arc length `at`: x along the path, z as near `up` as square to it. */
export function frameAt(p: ConveyPath, at: number): number[] {
  const { o, t } = along(p, at);
  const u = p.up ?? [0, 0, 1];
  const k = u[0] * t[0] + u[1] * t[1] + u[2] * t[2];
  let z: Vec3 = [u[0] - k * t[0], u[1] - k * t[1], u[2] - k * t[2]];
  let l = Math.hypot(z[0], z[1], z[2]);
  if (l < 1e-9) {
    z = Math.abs(t[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0];
    const k2 = z[0] * t[0] + z[1] * t[1] + z[2] * t[2];
    z = [z[0] - k2 * t[0], z[1] - k2 * t[1], z[2] - k2 * t[2]];
    l = Math.hypot(z[0], z[1], z[2]);
  }
  z = [z[0] / l, z[1] / l, z[2] / l];
  const y: Vec3 = [z[1] * t[2] - z[2] * t[1], z[2] * t[0] - z[0] * t[2], z[0] * t[1] - z[1] * t[0]];
  return [t[0], t[1], t[2], 0, y[0], y[1], y[2], 0, z[0], z[1], z[2], 0, o[0], o[1], o[2], 1];
}

/** Inverse of a rigid column-major 4x4. */
function inv(m: number[]): number[] {
  const r = [m[0]!, m[4]!, m[8]!, 0, m[1]!, m[5]!, m[9]!, 0, m[2]!, m[6]!, m[10]!, 0, 0, 0, 0, 1];
  const t = [m[12]!, m[13]!, m[14]!];
  r[12] = -(r[0]! * t[0]! + r[4]! * t[1]! + r[8]! * t[2]!);
  r[13] = -(r[1]! * t[0]! + r[5]! * t[1]! + r[9]! * t[2]!);
  r[14] = -(r[2]! * t[0]! + r[6]! * t[1]! + r[10]! * t[2]!);
  return r;
}

export function mul4(a: ArrayLike<number>, b: ArrayLike<number>): number[] {
  const o = new Array<number>(16).fill(0);
  for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) for (let k = 0; k < 4; k++) o[c * 4 + r]! += a[k * 4 + r]! * b[c * 4 + k]!;
  return o;
}

/**
 * The frame of a stretched member between two points (a rope's span, a spring): at the first, x toward the second, z as
 * near `up` as square to it; column-major, unscaled (the member's profile is given at unit length along x).
 */
export function stretchFrame(a: Vec3, b: Vec3, up: Vec3): number[] {
  const l = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]) || 1;
  const t: Vec3 = [(b[0] - a[0]) / l, (b[1] - a[1]) / l, (b[2] - a[2]) / l];
  const k = up[0] * t[0] + up[1] * t[1] + up[2] * t[2];
  let z: Vec3 = [up[0] - k * t[0], up[1] - k * t[1], up[2] - k * t[2]];
  let lz = Math.hypot(z[0], z[1], z[2]);
  if (lz < 1e-9) {
    z = Math.abs(t[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0];
    const k2 = z[0] * t[0] + z[1] * t[1] + z[2] * t[2];
    z = [z[0] - k2 * t[0], z[1] - k2 * t[1], z[2] - k2 * t[2]];
    lz = Math.hypot(z[0], z[1], z[2]);
  }
  z = [z[0] / lz, z[1] / lz, z[2] / lz];
  const y: Vec3 = [z[1] * t[2] - z[2] * t[1], z[2] * t[0] - z[0] * t[2], z[0] * t[1] - z[1] * t[0]];
  return [t[0], t[1], t[2], 0, y[0], y[1], y[2], 0, z[0], z[1], z[2], 0, a[0], a[1], a[2], 1];
}

/**
 * The matrix of a stretched member whose solid was built with frame F0 between the points a0, b0 and now spans a, b: its
 * place relative to its ends kept (an offset along its z), its unit length along x scaled to the span (column-major).
 */
export function stretchMatrix(a: Vec3, b: Vec3, a0: Vec3, b0: Vec3, F0: ArrayLike<number>): number[] {
  const up: Vec3 = [F0[8]!, F0[9]!, F0[10]!];
  const L = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
  const S = stretchFrame(a, b, up);
  for (let k = 0; k < 3; k++) S[k] = S[k]! * L;
  return mul4(S, mul4(inv(stretchFrame(a0, b0, up)), F0));
}

/** A turn about the axis through `at` by `a` radians, column-major. */
export function turnMatrix(at: Vec3, axis: Vec3, a: number): number[] {
  const l = Math.hypot(axis[0], axis[1], axis[2]) || 1;
  const [x, y, z] = [axis[0] / l, axis[1] / l, axis[2] / l];
  const c = Math.cos(a), s = Math.sin(a), t = 1 - c;
  const R = [t * x * x + c, t * x * y + s * z, t * x * z - s * y, t * x * y - s * z, t * y * y + c, t * y * z + s * x, t * x * z + s * y, t * y * z - s * x, t * z * z + c];
  const m = [R[0]!, R[1]!, R[2]!, 0, R[3]!, R[4]!, R[5]!, 0, R[6]!, R[7]!, R[8]!, 0, 0, 0, 0, 1];
  m[12] = at[0] - (m[0]! * at[0] + m[4]! * at[1] + m[8]! * at[2]);
  m[13] = at[1] - (m[1]! * at[0] + m[5]! * at[1] + m[9]! * at[2]);
  m[14] = at[2] - (m[2]! * at[0] + m[6]! * at[1] + m[10]! * at[2]);
  return m;
}

/** The move of a solid placed at `s0` on the path to where a travel carries it, in the carrier's frame (column-major). */
export function conveyMatrix(p: ConveyPath, s0: number, travel: number, s1?: number, vals?: Record<string, number>): number[] {
  // a live loop: the place on the loop the values give, from the place on the loop as built
  const q = livePath(p, vals);
  if (s1 !== undefined) return mul4(linkFrame(q, s0 + travel, s1 + travel), inv(linkFrame(p, s0, s1)));
  return mul4(frameAt(q, distOf(q, s0 + travel)), inv(frameAt(p, distOf(p, s0))));
}

/** A rigid link between two places on the path (a chain's plate between two rollers): at the first, x toward the second. */
function linkFrame(p: ConveyPath, s0: number, s1: number): number[] {
  const a = along(p, distOf(p, s0)).o;
  const b = along(p, distOf(p, s1)).o;
  const l = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]) || 1;
  const t: Vec3 = [(b[0] - a[0]) / l, (b[1] - a[1]) / l, (b[2] - a[2]) / l];
  const u = p.up ?? [0, 0, 1];
  const k = u[0] * t[0] + u[1] * t[1] + u[2] * t[2];
  let z: Vec3 = [u[0] - k * t[0], u[1] - k * t[1], u[2] - k * t[2]];
  const lz = Math.hypot(z[0], z[1], z[2]) || 1;
  z = [z[0] / lz, z[1] / lz, z[2] / lz];
  const y: Vec3 = [z[1] * t[2] - z[2] * t[1], z[2] * t[0] - z[0] * t[2], z[0] * t[1] - z[1] * t[0]];
  return [t[0], t[1], t[2], 0, y[0], y[1], y[2], 0, z[0], z[1], z[2], 0, a[0], a[1], a[2], 1];
}
