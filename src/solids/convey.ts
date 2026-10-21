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

/** The move of a solid placed at `s0` on the path to where a travel carries it, in the carrier's frame (column-major). */
export function conveyMatrix(p: ConveyPath, s0: number, travel: number): number[] {
  return mul4(frameAt(p, s0 + travel), inv(frameAt(p, s0)));
}
