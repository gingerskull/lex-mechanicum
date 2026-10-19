// Geometry of the desmodromic cam, generated (no stored points): circle intersections, a lobe as the offset of its shoe's
// path, the gap from a shoe to a lobe outline, and the rockers' outlines as a smooth union of round arms.
import { D2R, TAU, type Vec2 } from "../../core/geom";

export const ang = (a: Vec2, b: Vec2) => Math.atan2(b[1] - a[1], b[0] - a[0]);
export const wrap = (a: number) => ((((a + Math.PI) % TAU) + TAU) % TAU) - Math.PI;
export function circInt(c1: Vec2, r1: number, c2: Vec2, r2: number): Vec2[] {
  const d = Math.hypot(c2[0] - c1[0], c2[1] - c1[1]);
  const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
  const k = Math.sqrt(Math.max(0, r1 * r1 - a * a));
  const ex = (c2[0] - c1[0]) / d;
  const ey = (c2[1] - c1[1]) / d;
  const m: Vec2 = [c1[0] + a * ex, c1[1] + a * ey];
  return [[m[0] - k * ey, m[1] + k * ex], [m[0] + k * ey, m[1] - k * ex]];
}
/** A shoe's centre path (world, per cam angle) in the cam's frame about O. */
const inCam = (p: Vec2, O: Vec2, th: number): Vec2 => {
  const [x, y] = [p[0] - O[0], p[1] - O[1]];
  return [x * Math.cos(th) + y * Math.sin(th), -x * Math.sin(th) + y * Math.cos(th)];
};
/** A lobe's outline: the shoe's path in the cam's frame offset inward by `off`, one point per 0.5° of cam angle. */
export function envelope(pad: (th: number) => Vec2, O: Vec2, off: number, n = 720): Vec2[] {
  const pc = Array.from({ length: n }, (_, i) => inCam(pad((i / n) * TAU), O, (i / n) * TAU));
  return pc.map((p, i): Vec2 => {
    const a = pc[(i + n - 1) % n]!;
    const b = pc[(i + 1) % n]!;
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
    let N: Vec2 = [(b[1] - a[1]) / l, -(b[0] - a[0]) / l];
    if (N[0] * p[0] + N[1] * p[1] < 0) N = [-N[0], -N[1]];
    return [p[0] - off * N[0], p[1] - off * N[1]];
  });
}
/** Gap between a shoe of radius r and a lobe outline at cam angle th: the polygon's nearest point to the shoe centre less r. */
export function gap(out: Vec2[], pad: (th: number) => Vec2, O: Vec2, th: number, r: number): number {
  const q = inCam(pad(th), O, th);
  let d = Infinity;
  for (let i = 0; i < out.length; i++) {
    const a = out[i]!;
    const b = out[(i + 1) % out.length]!;
    const [dx, dy] = [b[0] - a[0], b[1] - a[1]];
    const t = Math.max(0, Math.min(1, ((q[0] - a[0]) * dx + (q[1] - a[1]) * dy) / (dx * dx + dy * dy)));
    d = Math.min(d, Math.hypot(q[0] - a[0] - t * dx, q[1] - a[1] - t * dy));
  }
  return d - r;
}
// The rockers' outlines in their own frame (pivot at the origin, tip arm along +x): the union of round arms, filleted by a
// smooth minimum, found by marching along rays from the pivot.
export type Round = { a: Vec2; ra: number; b: Vec2; rb: number; knee?: number };
const sdArm = (p: Vec2, { a, ra, b, rb, knee = 1 }: Round): number => {
  const [dx, dy] = [b[0] - a[0], b[1] - a[1]];
  const len2 = dx * dx + dy * dy;
  const t = len2 < 1e-9 ? 0 : Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / len2));
  return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy) - (ra + Math.min(1, t / knee) * (rb - ra));
};
const smin = (a: number, b: number, k: number) => Math.min(a, b) - (Math.max(k - Math.abs(a - b), 0) ** 2) / (4 * k);
/** The body's arms joined with fillet k1, then the bulbs (a shoe) with the small k2, so the shoe stays a circle where it touches. */
export function bone(body: Round[], bulbs: Round[], k1: number, k2: number, n = 720): Vec2[] {
  const sd = (p: Vec2) => bulbs.reduce((m, r) => smin(m, sdArm(p, r), k2), body.map((r) => sdArm(p, r)).reduce((m, x) => smin(m, x, k1)));
  return Array.from({ length: n }, (_, i): Vec2 => {
    const u: Vec2 = [Math.cos((i / n) * TAU), Math.sin((i / n) * TAU)];
    let [lo, hi] = [0, 90];
    for (let it = 0; it < 40; it++) {
      const m = (lo + hi) / 2;
      if (sd([u[0] * m, u[1] * m]) < 0) lo = m;
      else hi = m;
    }
    return [u[0] * lo, u[1] * lo];
  });
}

/** The contact on a lobe, the unit normal from the shoe centre toward it, and the pressure angle (degrees), from the shoe path. */
export function contactAt(f: (th: number) => Vec2, O: Vec2, th: number, off: number): { c: Vec2; n: Vec2; pa: number } {
  const p = f(th);
  const [a, b] = [f(th - 1e-4), f(th + 1e-4)];
  const v: Vec2 = [(b[0] - a[0]) / 2e-4, (b[1] - a[1]) / 2e-4];
  // the shoe's velocity relative to the cam, which turns +1 rad per rad about O
  const rel: Vec2 = [v[0] + (p[1] - O[1]), v[1] - (p[0] - O[0])];
  const l = Math.hypot(rel[0], rel[1]) || 1;
  let n: Vec2 = [-rel[1] / l, rel[0] / l];
  if (n[0] * (O[0] - p[0]) + n[1] * (O[1] - p[1]) < 0) n = [-n[0], -n[1]];
  const vl = Math.hypot(v[0], v[1]);
  const pa = vl < 1e-9 ? 0 : Math.acos(Math.min(1, Math.abs(n[0] * v[0] + n[1] * v[1]) / vl)) / D2R;
  return { c: [p[0] + off * n[0], p[1] + off * n[1]], n, pa };
}
/** An outline with the points on the circle (c, r) within the arc [a0, a1] from direction f pulled in to radius r - depth. */
export function cutArc(out: Vec2[], c: Vec2, r: number, f: number, a0: number, a1: number, depth: number): Vec2[] {
  return out.map((p): Vec2 => {
    const d = Math.hypot(p[0] - c[0], p[1] - c[1]);
    const t = wrap(Math.atan2(p[1] - c[1], p[0] - c[0]) - f);
    return Math.abs(d - r) < 0.35 && t >= a0 && t <= a1 ? [c[0] + ((p[0] - c[0]) * (r - depth)) / d, c[1] + ((p[1] - c[1]) * (r - depth)) / d] : p;
  });
}
