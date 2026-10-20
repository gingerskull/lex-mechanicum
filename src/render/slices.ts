// Depth order (standard L6): every solid is cut at every z boundary of a solid that overlaps it in plan, and the slices
// are painted far to near. The cuts depend only on which solids overlap and on the explode, so they are cached on a
// signature of the overlapping pairs.
//
// A solid on an x or y axis (src/core/axis.ts) is cut along its own axis instead: at the boundaries, along that axis,
// of every solid whose world box meets its own; and a z solid is cut at the world z of such a solid it meets. A frame
// with such solids is ordered by depthOrder(): the z slices keep the order of a frame without them, and each x or y
// slice goes in after every slice it must cover and before every slice that must cover it, by the plane that
// separates their boxes.
import type { Box3 } from "../core/axis";
import type { Vec2 } from "../core/geom";

export interface Sliceable {
  /** World z range (for an x or y solid, of its world box). */
  z0: number;
  z1: number;
  /** Plan box. */
  bb: [number, number, number, number];
  /** An x, y or posed ("p") solid, and its extent along that axis. A posed solid is never cut. */
  axis?: "z" | "x" | "y" | "p";
  along?: [number, number];
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
  if (W.some(isOutW)) return mixedSlices(W, cache);
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

const isOutW = (w: Sliceable): boolean => w.axis === "x" || w.axis === "y" || w.axis === "p";
/** Two boxes meet when they overlap by more than this in every direction, mm. */
const MEET = 0.05;

/** The world box of a solid, or of its slice from `a` to `b` along its axis. */
export function boxOfSliceable(w: Sliceable, a?: number, b?: number): Box3 {
  const B: Box3 = [w.bb[0], w.bb[1], w.z0, w.bb[2], w.bb[3], w.z1];
  if (a === undefined || b === undefined || w.axis === "p") return B;
  const k = w.axis === "x" ? 0 : w.axis === "y" ? 1 : 2;
  B[k] = a;
  B[k + 3] = b;
  return B;
}

const meet = (a: Box3, b: Box3) =>
  Math.min(a[3], b[3]) - Math.max(a[0], b[0]) > MEET && Math.min(a[4], b[4]) - Math.max(a[1], b[1]) > MEET && Math.min(a[5], b[5]) - Math.max(a[2], b[2]) > MEET;

/** Slices of a frame with x or y solids: z solids cut as before, plus at the world z of an x or y solid they meet. */
function mixedSlices<T extends Sliceable>(W: T[], cache?: { last?: SliceCache }): Slice<T>[] {
  const n = W.length;
  const boxes = W.map((w) => boxOfSliceable(w));
  const range = (w: Sliceable): [number, number] => (isOutW(w) ? w.along! : [w.z0, w.z1]);
  const k3 = (w: Sliceable) => (w.axis === "x" ? 0 : w.axis === "y" ? 1 : 2);
  const pairs: number[][] = W.map(() => []);
  for (let i = 0; i < n; i++)
    for (let k = i + 1; k < n; k++) {
      const z2 = !isOutW(W[i]!) && !isOutW(W[k]!);
      if (z2 ? hit(W[i]!, W[k]!) : meet(boxes[i]!, boxes[k]!)) {
        pairs[i]!.push(k);
        pairs[k]!.push(i);
      }
    }
  // the cuts along an x or y axis move with the solids that make them: the boxes are part of the signature
  const sig = cache ? pairs.map((p) => p.join(",")).join(";") + "|" + boxes.map((b) => b.map((v) => v.toFixed(3)).join(":")).join(",") : "";
  let cuts: number[][];
  if (cache?.last && cache.last.key === sig) cuts = cache.last.cuts;
  else {
    cuts = W.map((w, i) => {
      const [lo, hi] = range(w);
      const set = new Set([lo, hi]);
      // a posed solid's axis runs along no base axis: it stays whole and is ordered by its box
      const a = k3(w);
      if (w.axis !== "p") for (const k of pairs[i]!) for (const v of [boxes[k]![a]!, boxes[k]![a + 3]!]) if (v > lo + 1e-6 && v < hi - 1e-6) set.add(v);
      return [...set].sort((x, y) => x - y);
    });
    if (cache) cache.last = { key: sig, cuts };
  }
  const out: Slice<T>[] = [];
  W.forEach((w, i) => {
    const zs = cuts[i]!;
    const m = zs.length - 2;
    // the face seen of a y solid is its near end, at the low y (the viewer is on the -y side)
    const near = (j: number) => (w.axis === "y" ? j === 0 : j === m);
    const far = (j: number) => (w.axis === "y" ? j === m : j === 0);
    for (let j = 0; j <= m; j++) out.push({ w, z0: zs[j]!, top: zs[j + 1]!, isTop: near(j), isBottom: far(j) });
  });
  return out;
}

/** The view's tilt as cos and sin (Projector.ct, st). */
export interface Tilt {
  ct: number;
  st: number;
}

const SEP = 0.01;
/** -1 when the range a lies below b, 1 when above, 0 when they overlap. */
const side = (a0: number, a1: number, b0: number, b1: number) => (a1 <= b0 + SEP ? -1 : b1 <= a0 + SEP ? 1 : 0);

/**
 * Which of two boxes is drawn first when they overlap on screen: -1 a, 1 b, 0 when no plane between them says (they
 * meet, or do not overlap on screen). The viewer is above (+z) and in front (-y): a box below another, or behind it,
 * is farther.
 */
export function separate(a: Box3, b: Box3, t: Tilt): -1 | 0 | 1 {
  if (Math.min(a[3], b[3]) - Math.max(a[0], b[0]) <= SEP) return 0;
  const va0 = a[1] * t.ct + a[2] * t.st;
  const va1 = a[4] * t.ct + a[5] * t.st;
  const vb0 = b[1] * t.ct + b[2] * t.st;
  const vb1 = b[4] * t.ct + b[5] * t.st;
  if (Math.min(va1, vb1) - Math.max(va0, vb0) <= SEP) return 0;
  const rz = side(a[2], a[5], b[2], b[5]);
  const ry = t.st > 1e-6 ? -side(a[1], a[4], b[1], b[4]) : 0;
  if (rz && ry && rz !== ry) return 0;
  return (rz || ry) as -1 | 0 | 1;
}

/** Counters of the last depthOrder() call, for the bench: x and y slices, box tests, constraints that could not all hold. */
export const orderStats = { out: 0, tests: 0, conflicts: 0 };

/**
 * The painting order of a frame's slices, far to near. Without x or y slices it is `cmp` alone (the order of L6).
 * Otherwise the z slices keep `cmp`'s order and every x or y slice goes in after the last slice it must cover and
 * before the first that must cover it; an x or y slice that meets a z slice's box goes first (a shaft in its bore),
 * and of two x or y slices that meet, the smaller.
 */
export function depthOrder<T extends Sliceable>(list: Slice<T>[], cmp: (a: Slice<T>, b: Slice<T>) => number, t: Tilt): Slice<T>[] {
  if (!list.some((s) => isOutW(s.w))) return list.sort(cmp);
  const Z = list.filter((s) => !isOutW(s.w)).sort(cmp);
  const O = list.filter((s) => isOutW(s.w));
  const zb = Z.map((s) => boxOfSliceable(s.w, s.z0, s.top));
  const ob = O.map((s) => boxOfSliceable(s.w, s.z0, s.top));
  const vol = (b: Box3) => (b[3] - b[0]) * (b[4] - b[1]) * (b[5] - b[2]);
  const nearness = (b: Box3) => ((b[2] + b[5]) / 2) * t.ct - ((b[1] + b[4]) / 2) * t.st;
  orderStats.out = O.length;
  orderStats.tests = 0;
  orderStats.conflicts = 0;
  // the x and y slices among themselves: Kahn's order on their pairwise constraints, the farthest available first
  const m = O.length;
  const before: number[][] = O.map(() => []);
  const indeg = new Array<number>(m).fill(0);
  const rel = (i: number, k: number): -1 | 0 | 1 => {
    const r = separate(ob[i]!, ob[k]!, t);
    if (r || !meet(ob[i]!, ob[k]!)) return r;
    return vol(ob[i]!) <= vol(ob[k]!) ? -1 : 1;
  };
  for (let i = 0; i < m; i++)
    for (let k = i + 1; k < m; k++) {
      const r = rel(i, k);
      if (r < 0) {
        before[k]!.push(i);
        indeg[k]!++;
      } else if (r > 0) {
        before[i]!.push(k);
        indeg[i]!++;
      }
    }
  const done = new Array<boolean>(m).fill(false);
  const seq: number[] = [];
  for (let step = 0; step < m; step++) {
    let pick = -1;
    for (let i = 0; i < m; i++) if (!done[i] && indeg[i] === 0 && (pick < 0 || nearness(ob[i]!) < nearness(ob[pick]!))) pick = i;
    if (pick < 0) {
      // a cycle: the farthest left goes next
      orderStats.conflicts++;
      for (let i = 0; i < m; i++) if (!done[i] && (pick < 0 || nearness(ob[i]!) < nearness(ob[pick]!))) pick = i;
    }
    done[pick] = true;
    seq.push(pick);
    for (let k = 0; k < m; k++) if (!done[k] && before[k]!.includes(pick)) indeg[k]!--;
  }
  // each x or y slice after the last z slice it must cover, and after every x or y slice it must cover
  const gap = new Array<number>(m).fill(-1);
  for (const i of seq) {
    let lo = -1;
    let hi = Z.length;
    for (let k = 0; k < Z.length; k++) {
      orderStats.tests++;
      let r = separate(ob[i]!, zb[k]!, t);
      if (!r && meet(ob[i]!, zb[k]!)) r = -1;
      if (r > 0) lo = Math.max(lo, k);
      else if (r < 0) hi = Math.min(hi, k);
    }
    for (const k of before[i]!) lo = Math.max(lo, gap[k]!);
    if (lo >= hi) orderStats.conflicts++;
    gap[i] = lo;
  }
  const at: number[][] = Array.from({ length: Z.length + 1 }, () => []);
  for (const i of seq) at[gap[i]! + 1]!.push(i);
  const out: Slice<T>[] = [];
  for (let k = 0; k <= Z.length; k++) {
    for (const i of at[k]!) out.push(O[i]!);
    if (k < Z.length) out.push(Z[k]!);
  }
  return out;
}
