// Depth order (standard L6): every solid is cut at every z boundary of a solid that overlaps it in plan, and the slices
// are painted far to near. The cuts depend only on which solids overlap and on the explode, so they are cached on a
// signature of the overlapping pairs.
import type { Vec2 } from "../core/geom";

export interface Sliceable {
  z0: number;
  z1: number;
  bb: [number, number, number, number];
}

export interface Slice<T extends Sliceable = Sliceable> {
  w: T;
  z0: number;
  top: number;
  isTop: boolean;
  isBottom: boolean;
}

const MARGIN = 2;
const hit = (a: Sliceable, b: Sliceable) =>
  a.bb[0] < b.bb[2] + MARGIN && b.bb[0] < a.bb[2] + MARGIN && a.bb[1] < b.bb[3] + MARGIN && b.bb[1] < a.bb[3] + MARGIN;

export interface SliceCache {
  key: string;
  cuts: number[][];
}

/** The slices of a world list. `cache` holds the cut lists of the last overlap signature. */
export function slices<T extends Sliceable>(W: T[], cache?: { last?: SliceCache }): Slice<T>[] {
  const n = W.length;
  const pairs: number[][] = W.map(() => []);
  let sig = "";
  for (let i = 0; i < n; i++) {
    for (let k = i + 1; k < n; k++)
      if (hit(W[i]!, W[k]!)) {
        pairs[i]!.push(k);
        pairs[k]!.push(i);
      }
  }
  if (cache) sig = pairs.map((p) => p.join(",")).join(";") + "|" + W.map((w) => `${w.z0.toFixed(3)}:${w.z1.toFixed(3)}`).join(",");
  let cuts: number[][];
  if (cache?.last && cache.last.key === sig) cuts = cache.last.cuts;
  else {
    cuts = W.map((w, i) => {
      const set = new Set([w.z0, w.z1]);
      for (const k of pairs[i]!) for (const z of [W[k]!.z0, W[k]!.z1]) if (z > w.z0 + 1e-6 && z < w.z1 - 1e-6) set.add(z);
      return [...set].sort((a, b) => a - b);
    });
    if (cache) cache.last = { key: sig, cuts };
  }
  const out: Slice<T>[] = [];
  W.forEach((w, i) => {
    const zs = cuts[i]!;
    for (let j = 0; j + 1 < zs.length; j++) out.push({ w, z0: zs[j]!, top: zs[j + 1]!, isTop: j === zs.length - 2, isBottom: j === 0 });
  });
  return out;
}

/**
 * How a wall faces: it is seen when its outward screen normal n has n . d > eps for the extrusion vector d, and its shade
 * step comes from n . light. The GPU pass (gl/shaders.ts) uses the same numbers.
 */
export const FACING = { eps: 1e-6, light: [0.75, -0.25] as const };

/** The shade step of a seen wall with outward screen normal (nx, ny). */
export const facingStep = (nx: number, ny: number, steps: number): number =>
  Math.max(0, Math.min(steps - 1, Math.round(((nx * FACING.light[0] + ny * FACING.light[1] + 1) * (steps - 1)) / 2)));

/** Side walls of a projected outline that face the viewer, for the extrusion vector d, in five facing buckets. */
export function wallsOf(P: Vec2[], d: Vec2, sg: number, steps = 5): { vis: boolean[]; buckets: [Vec2, Vec2][][] } {
  const n = P.length;
  const vis: boolean[] = [];
  const buckets: [Vec2, Vec2][][] = Array.from({ length: steps }, () => []);
  for (let i = 0; i < n; i++) {
    const a = P[i]!;
    const b = P[(i + 1) % n]!;
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const L = Math.hypot(dx, dy) || 1;
    const nx = (sg * dy) / L;
    const ny = (-sg * dx) / L;
    const v = nx * d[0] + ny * d[1] > FACING.eps;
    vis.push(v);
    if (v) buckets[facingStep(nx, ny, steps)]!.push([a, b]);
  }
  return { vis, buckets };
}
