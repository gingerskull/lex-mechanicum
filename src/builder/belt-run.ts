// A running belt's travel over the cycle (SD29), for the marks that ride on it: from the sampled poses of the part that
// drives it, a pulley's turn unwrapped through whole turns or a carriage's slide, at even phases the renderer reads.
import type { Vec2 } from "../core/geom";
import { type Vec3, v3, wrapPi, xf } from "../kin/math";
import type { BuildCtx } from "./ctx";

/** The even phases a belt's travel is stored at: N + 1 values from 0 to 2π. */
export const RUN_N = 48;

/** Twice the signed area of a closed outline: above 0 when it runs counter-clockwise. */
const area2 = (P: Vec2[]): number => P.reduce((a, p, i) => a + p[0] * P[(i + 1) % P.length]![1] - P[(i + 1) % P.length]![0] * p[1], 0);

/** A table over the sampled phases (one value each), closed at 2π by `end`, read at RUN_N + 1 even phases. */
function resample(us: number[], vs: number[], end: number): number[] {
  const U = [...us, 2 * Math.PI];
  const V = [...vs, end];
  const out: number[] = [];
  let k = 0;
  for (let i = 0; i <= RUN_N; i++) {
    const u = (i / RUN_N) * 2 * Math.PI;
    while (k < U.length - 2 && U[k + 1]! < u) k++;
    const f = (u - U[k]!) / (U[k + 1]! - U[k]! || 1);
    out.push(V[k]! + (V[k + 1]! - V[k]!) * Math.min(1, Math.max(0, f)));
  }
  return out;
}

/**
 * The travel (mm, the way `path` runs) of a belt wrapped on a pulley of pitch radius r on `body`, which turns about
 * `axis` (unit, world: the belt's own normal, its profile's z): the pulley's turn from the reference, counted on
 * through whole turns, times r. A counter-clockwise path runs the way a counter-clockwise turn carries the belt.
 */
export function turnTravel(ctx: BuildCtx, body: string, axis: Vec3, r: number, path: Vec2[]): number[] {
  const { us } = ctx.sampled;
  const sg = area2(path) > 0 ? 1 : -1;
  const vs: number[] = [];
  let a = 0;
  for (let i = 0; i < us.length; i++) {
    if (i) a += wrapPi(xf.angleAbout(xf.mul(ctx.xfOf(body, i), xf.inv(ctx.xfOf(body, i - 1))), axis));
    vs.push(sg * r * a);
  }
  const end = a + wrapPi(xf.angleAbout(xf.mul(ctx.xfOf(body, 0), xf.inv(ctx.xfOf(body, us.length - 1))), axis));
  return resample(us, vs, sg * r * end);
}

/**
 * The travel of a belt whose span at `at` (in its profile's coordinates, frame x and y given in the world) is clamped to
 * `body`, which slides: the body's move from the reference along the path's way at that point.
 */
export function slideTravel(ctx: BuildCtx, body: string, frame: { x: Vec3; z: Vec3 }, path: Vec2[], at: Vec2): number[] {
  const { us } = ctx.sampled;
  // the path's way at the point of it nearest `at`
  let best = Infinity;
  let way: Vec2 = [1, 0];
  path.forEach((p, i) => {
    const q = path[(i + 1) % path.length]!;
    const d = [q[0] - p[0], q[1] - p[1]];
    const L = Math.hypot(d[0]!, d[1]!) || 1;
    const t = Math.max(0, Math.min(1, ((at[0] - p[0]) * d[0]! + (at[1] - p[1]) * d[1]!) / (L * L)));
    const e = Math.hypot(p[0] + t * d[0]! - at[0], p[1] + t * d[1]! - at[1]);
    if (e < best) {
      best = e;
      way = [d[0]! / L, d[1]! / L];
    }
  });
  const y = v3.cross(frame.z, frame.x);
  const dir = v3.add(v3.mul(frame.x, way[0]), v3.mul(y, way[1]));
  const t0 = ctx.xfOf(body, 0).t;
  const vs = us.map((_, i) => v3.dot(v3.sub(ctx.xfOf(body, i).t, t0), dir));
  return resample(us, vs, 0);
}
