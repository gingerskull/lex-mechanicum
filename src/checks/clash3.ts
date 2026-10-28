// A15 in true 3D (standard 5.2, 10 Q2): every pair of solids that move relative to each other is intersected with
// Manifold at sampled phases, after a world-box filter, and judged by penetration depth (2 x volume / area of the
// intersection) against the clash tolerance, so a shaft in its own faceted bore is not a clash. A hand `allow` names
// a pair and is reported unnecessary when the pair does not overlap at any phase. Build time, Node only.
import type { Mat4 } from "../solids/frame";
import { manifold } from "../solids/manifold";
import { meshOnce } from "../solids/meshes";
import { tessellate } from "../solids/tessellate";
import { isPlain, type Solid3 } from "../solids/types";

export type Wasm = Awaited<ReturnType<typeof manifold>>;
type Mf = InstanceType<Wasm["Manifold"]>;

/** Penetration below this is touching, not clashing (faceting sag is 0.025 mm, `FACET_TOL`), mm. */
export const CLASH_TOL = 0.1;
/** An intersection below this volume is numerical noise, mm³. */
const NOISE_VOL = 0.02;

/** What a check needs of a solid beyond Solid3: nothing, an `allow` list is already a field of Solid3. */
export type ClashSolid = Solid3;

/** Where a solid is at a phase: its local frame to the world, column-major, with a scale along local x (a stretched member). */
export interface Placer {
  /** Phase count the cycle is sampled at is the caller's; u is radians in 0..2π. */
  place(s: ClashSolid, u: number): Mat4;
  /** Solids that move together (same body, same motion) share a key; null when the solid cannot be placed. */
  key(s: ClashSolid): string;
  /** Local x scale of a stretched member at the phase. */
  stretch?(s: ClashSolid, u: number): number;
}

export interface ClashOptions {
  /** Phases over the cycle (default 72). */
  phases?: number;
  tol?: number;
  /** Test the pairs a hand `allow` names, to report the unnecessary ones (default true; the CI profile skips them). */
  allowCheck?: boolean;
  /** Body pairs that touch by design (gear teeth, cam and follower, belt and pulley): never a clash. */
  contact?: [string, string][];
  /** Solid ids left out (traces, faint internals); `faint` and trace-role solids are always left out. */
  skip?: (s: ClashSolid) => boolean;
}

export interface Clash3 {
  a: string;
  b: string;
  /** Phase of the deepest contact, radians. */
  u: number;
  /** Penetration depth, mm. */
  depth: number;
  /** Intersection volume at that phase, mm³. */
  volume: number;
}

export interface AllowFinding {
  a: string;
  b: string;
  /** The reason given on the solids (`why`), if any. */
  why: string;
  /** Deepest overlap seen at any phase, mm (0 when the pair never meets in 3D). */
  depth: number;
  /** The exemption names a pair that does not overlap in 3D: delete it (A15). */
  unnecessary: boolean;
}

export interface ClashReport {
  clashes: Clash3[];
  allows: AllowFinding[];
  stats: { solids: number; pairs: number; boxHits: number; intersections: number; phases: number; ms: number };
}

export type Box = [number, number, number, number, number, number];

export const boxOfMesh = (pos: Float32Array): Box => {
  const b: Box = [Infinity, Infinity, Infinity, -Infinity, -Infinity, -Infinity];
  for (let i = 0; i < pos.length; i += 3)
    for (let k = 0; k < 3; k++) {
      b[k] = Math.min(b[k]!, pos[i + k]!);
      b[k + 3] = Math.max(b[k + 3]!, pos[i + k]!);
    }
  return b as Box;
};

/** The world box of a local box under a column-major matrix. */
/**
 * The box of a solid in its own frame, without a boolean where it can be avoided: a plain solid is its outline's sweep
 * (holes lie inside it), anything else is meshed. Null when the solid cannot be meshed (the SOLID check's finding).
 */
export function localBox(M: Wasm, s: Solid3): Box | null {
  try {
    if (isPlain(s)) return boxOfMesh(tessellate({ outer: s.profile.outer, holes: [] }, s.op).pos);
  } catch {
    // fall through to Manifold
  }
  try {
    return boxOfMesh(meshOnce(M, s).pos);
  } catch {
    return null;
  }
}

export function worldBox(b: Box, m: Mat4): Box {
  const out: Box = [Infinity, Infinity, Infinity, -Infinity, -Infinity, -Infinity];
  for (let i = 0; i < 8; i++) {
    const x = i & 1 ? b[3]! : b[0]!;
    const y = i & 2 ? b[4]! : b[1]!;
    const z = i & 4 ? b[5]! : b[2]!;
    for (let k = 0; k < 3; k++) {
      const v = m[k]! * x + m[4 + k]! * y + m[8 + k]! * z + m[12 + k]!;
      out[k] = Math.min(out[k]!, v);
      out[k + 3] = Math.max(out[k + 3]!, v);
    }
  }
  return out;
}

/**
 * The boxes overlap by more than `tol` along every axis. A body inside a slab of thickness t has 2V/A <= t (its volume is
 * at most t times its shadow, and its surface at least twice the shadow), so a pair that overlaps by no more than the
 * tolerance along some axis cannot penetrate deeper than it.
 */
const boxesMeet = (a: Box, b: Box, tol: number): boolean =>
  Math.min(a[3], b[3]) - Math.max(a[0], b[0]) > tol && Math.min(a[4], b[4]) - Math.max(a[1], b[1]) > tol && Math.min(a[5], b[5]) - Math.max(a[2], b[2]) > tol;

export interface Obb {
  c: [number, number, number];
  /** Unit axes, then half extents along them. */
  a: [number, number, number][];
  h: [number, number, number];
}

/** A local box under a column-major matrix, as an oriented box. */
export function obbOf(b: Box, m: Mat4): Obb {
  const lc = [(b[0] + b[3]) / 2, (b[1] + b[4]) / 2, (b[2] + b[5]) / 2];
  const a: Obb["a"] = [];
  const h: number[] = [];
  for (let i = 0; i < 3; i++) {
    const l = Math.hypot(m[4 * i]!, m[4 * i + 1]!, m[4 * i + 2]!) || 1;
    a.push([m[4 * i]! / l, m[4 * i + 1]! / l, m[4 * i + 2]! / l]);
    h.push(((b[i + 3]! - b[i]!) / 2) * l);
  }
  const c: Obb["c"] = [0, 1, 2].map((k) => m[k]! * lc[0]! + m[4 + k]! * lc[1]! + m[8 + k]! * lc[2]! + m[12 + k]!) as Obb["c"];
  return { c, a, h: h as Obb["h"] };
}

const dot3 = (u: readonly number[], v: readonly number[]): number => u[0]! * v[0]! + u[1]! * v[1]! + u[2]! * v[2]!;

/**
 * The oriented boxes overlap by more than `tol` along every one of the 15 separating axes. The same slab argument as
 * `boxesMeet` holds for any unit axis, so a pair that fails this cannot penetrate deeper than `tol`.
 */
export function obbMeet(A: Obb, B: Obb, tol: number): boolean {
  const d: [number, number, number] = [B.c[0] - A.c[0], B.c[1] - A.c[1], B.c[2] - A.c[2]];
  const test = (L: [number, number, number]): boolean => {
    const n = Math.hypot(L[0], L[1], L[2]);
    if (n < 1e-9) return true;
    const u: [number, number, number] = [L[0] / n, L[1] / n, L[2] / n];
    let r = 0;
    for (let i = 0; i < 3; i++) r += A.h[i]! * Math.abs(dot3(A.a[i]!, u)) + B.h[i]! * Math.abs(dot3(B.a[i]!, u));
    return r - Math.abs(dot3(d, u)) > tol;
  };
  for (let i = 0; i < 3; i++) if (!test(A.a[i]!) || !test(B.a[i]!)) return false;
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++) {
      const p = A.a[i]!;
      const q = B.a[j]!;
      if (!test([p[1]! * q[2]! - p[2]! * q[1]!, p[2]! * q[0]! - p[0]! * q[2]!, p[0]! * q[1]! - p[1]! * q[0]!])) return false;
    }
  return true;
}

/** The inverse of a rigid column-major matrix (orthonormal columns). */
export function rigidInverse(m: Mat4): Mat4 {
  // the transpose of the rotation, row by row: row i of Rᵀ is column i of R (m[4i], m[4i + 1], m[4i + 2])
  const r = [m[0]!, m[1]!, m[2]!, m[4]!, m[5]!, m[6]!, m[8]!, m[9]!, m[10]!];
  const t = [-(r[0]! * m[12]! + r[1]! * m[13]! + r[2]! * m[14]!), -(r[3]! * m[12]! + r[4]! * m[13]! + r[5]! * m[14]!), -(r[6]! * m[12]! + r[7]! * m[13]! + r[8]! * m[14]!)];
  return [r[0]!, r[3]!, r[6]!, 0, r[1]!, r[4]!, r[7]!, 0, r[2]!, r[5]!, r[8]!, 0, t[0]!, t[1]!, t[2]!, 1];
}

export function matMul(a: Mat4, b: Mat4): Mat4 {
  const o = new Array<number>(16).fill(0);
  for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) for (let k = 0; k < 4; k++) o[c * 4 + r]! += a[k * 4 + r]! * b[c * 4 + k]!;
  return o as Mat4;
}

/** True when the matrix is a turn about the z axis through the origin and nothing else. */
export function isTurnAboutZ(d: Mat4, eps = 1e-6): boolean {
  return Math.abs(d[2]!) < eps && Math.abs(d[6]!) < eps && Math.abs(d[8]!) < eps && Math.abs(d[9]!) < eps && Math.abs(d[10]! - 1) < eps && Math.abs(d[12]!) < eps && Math.abs(d[13]!) < eps && Math.abs(d[14]!) < eps;
}

/**
 * A solid that a turn about its own z axis leaves as it is (to within its facets): a revolution, or a plain extrusion of
 * regular polygons centred on the axis (a shaft, a washer, a bearing, a disc). The check reuses a pair's result when the
 * pair's relative pose changes by such a turn only.
 */
export function axisymmetric(s: Solid3): boolean {
  if (!isPlain(s) || s.stretch || s.deform) return false;
  if (s.op.op === "revolve") return true;
  if (s.op.op !== "extrude" || s.op.twist) return false;
  const rings = [s.profile.outer, ...s.profile.holes];
  return rings.every((r) => {
    const n = r.length;
    if (n < 12) return false;
    const R = Math.hypot(r[0]![0], r[0]![1]);
    if (R < 1e-6) return false;
    for (let i = 0; i < n; i++) {
      const a = r[i]!;
      if (Math.abs(Math.hypot(a[0], a[1]) - R) > 1e-3 * R) return false;
      const b = r[(i + 1) % n]!;
      const turn = Math.atan2(a[0] * b[1] - a[1] * b[0], a[0] * b[0] + a[1] * b[1]);
      if (Math.abs(Math.abs(turn) - (2 * Math.PI) / n) > 1e-3) return false;
    }
    return true;
  });
}

export const matClose = (a: Mat4, b: Mat4): boolean => {
  for (let i = 0; i < 16; i++) if (Math.abs(a[i]! - b[i]!) > 1e-7) return false;
  return true;
};

/** The relative matrix inverse(A) * B of two rigid transforms is constant over the phases: they move as one. */
function sameMotion(mats: Mat4[][], i: number, j: number): boolean {
  const rel0 = matMul(rigidInverse(mats[0]![i]!), mats[0]![j]!);
  for (let p = 1; p < mats.length; p++) if (!matClose(matMul(rigidInverse(mats[p]![i]!), mats[p]![j]!), rel0)) return false;
  return true;
}

export const withScale = (m: Mat4, k: number): Mat4 => (k === 1 ? m : [m[0]! * k, m[1]! * k, m[2]! * k, 0, m[4]!, m[5]!, m[6]!, 0, m[8]!, m[9]!, m[10]!, 0, m[12]!, m[13]!, m[14]!, 1]);

/**
 * A15 for a list of solids and a placer. `solids` are in their body's own frame as the builders make them; the placer
 * says where each body is at a phase.
 */
export async function clearance3(solids: ClashSolid[], placer: Placer, opts: ClashOptions = {}): Promise<ClashReport> {
  const t0 = performance.now();
  const N = opts.phases ?? 72;
  const tol = opts.tol ?? CLASH_TOL;
  const M = await manifold();
  const S = solids.filter((s) => !s.flags.faint && s.role !== "trace" && !opts.skip?.(s));
  // the local boxes are cheap; a solid's Manifold is made when a pair first needs it
  const local: (Box | null)[] = S.map((s) => localBox(M, s));
  const base: (Mf | null | undefined)[] = S.map((_, i) => (local[i] ? undefined : null));
  const baseOf = (i: number): Mf | null => {
    if (base[i] !== undefined) return base[i]!;
    try {
      const m = meshOnce(M, S[i]!);
      base[i] = M.Manifold.ofMesh(new M.Mesh({ numProp: 3, vertProperties: m.pos, triVerts: m.tri }));
    } catch {
      // a solid Manifold would not mesh is the SOLID check's finding, not a clash
      base[i] = null;
    }
    return base[i]!;
  };
  const phases = Array.from({ length: N }, (_, i) => (i / N) * Math.PI * 2);
  const rigid: Mat4[][] = phases.map((u) => S.map((s) => placer.place(s, u)));
  const mats: Mat4[][] = phases.map((u, p) => S.map((s, i) => withScale(rigid[p]![i]!, placer.stretch?.(s, u) ?? 1)));
  const contact = new Set((opts.contact ?? []).flatMap(([a, b]) => [`${a}|${b}`, `${b}|${a}`]));
  // solids that share a pose key share a matrix: relative motion is decided per key pair
  const keys = S.map((s) => placer.key(s));
  const firstOf = new Map<string, number>();
  keys.forEach((k, i) => firstOf.has(k) || firstOf.set(k, i));
  const rel = new Map<string, boolean>();
  const movesRel = (i: number, j: number): boolean => {
    const a = keys[i]!;
    const b = keys[j]!;
    if (a === b) return false;
    const id = a < b ? `${a}|${b}` : `${b}|${a}`;
    let v = rel.get(id);
    if (v === undefined) {
      v = !sameMotion(rigid, firstOf.get(a)!, firstOf.get(b)!);
      rel.set(id, v);
    }
    return v;
  };

  const pairs: [number, number, boolean][] = [];
  const allowPairs = new Map<string, { a: string; b: string; why: string; depth: number }>();
  for (let i = 0; i < S.length; i++)
    for (let k = i + 1; k < S.length; k++) {
      const a = S[i]!;
      const b = S[k]!;
      if (!local[i] || !local[k]) continue;
      const allowed = !!(a.allow?.includes(b.id) || b.allow?.includes(a.id));
      if (allowed && opts.allowCheck === false) continue;
      if (allowed) allowPairs.set(`${i}|${k}`, { a: a.id, b: b.id, why: (a.allow?.includes(b.id) ? a.why : b.why) || a.why || b.why || "", depth: 0 });
      const moves = movesRel(i, k);
      if (!moves && !allowed) continue;
      if (a.group && a.group === b.group && !allowed) continue;
      // a belt runs on its pulleys by design (its teeth in their grooves), and the pieces of one flexible member meet end
      // to end (a rope's parts and its wraps round the sheaves)
      if (((a.kind === "belt" && b.kind === "pulley") || (a.kind === "pulley" && b.kind === "belt") || (a.member !== undefined && a.member === b.member)) && !allowed) continue;
      if (contact.has(`${a.body}|${b.body}`) && !allowed) continue;
      pairs.push([i, k, moves]);
    }

  // pairs where one solid is a body of revolution: the result is reused when the relative pose only turns about its axis
  const sym = S.map(axisymmetric);
  const seen = new Map<string, Mat4[]>();
  const worst = new Map<string, Clash3>();
  let boxHits = 0;
  let inter = 0;
  for (let p = 0; p < N; p++) {
    const wb = S.map((_, i) => (local[i] ? worldBox(local[i]!, mats[p]![i]!) : null));
    const ob = new Map<number, Obb>();
    const obb = (i: number): Obb => {
      let o = ob.get(i);
      if (!o) ob.set(i, (o = obbOf(local[i]!, mats[p]![i]!)));
      return o;
    };
    const posed = new Map<number, Mf>();
    const at = (i: number): Mf => {
      let m = posed.get(i);
      if (!m) {
        m = baseOf(i)!.transform(mats[p]![i]!);
        posed.set(i, m);
      }
      return m;
    };
    for (const [i, k, moves] of pairs) {
      if (!moves && p > 0) continue; // a static allowed pair is tested once
      if (!boxesMeet(wb[i]!, wb[k]!, tol) || !obbMeet(obb(i), obb(k), tol)) continue;
      const al = allowPairs.get(`${i}|${k}`);
      // a hand exemption already shown necessary is not tested again
      if (al && al.depth > tol) continue;
      if ((sym[i] || sym[k]) && !S[i]!.stretch && !S[k]!.stretch) {
        // T is the pose of k in the frame of i; a turn of i about its axis (left) or of k about its axis (right) is no change
        const T = matMul(rigidInverse(rigid[p]![i]!), rigid[p]![k]!);
        const key = `${i}|${k}`;
        const list = seen.get(key) ?? [];
        if (list.some((q) => (sym[i] && isTurnAboutZ(matMul(T, rigidInverse(q)))) || (sym[k] && isTurnAboutZ(matMul(rigidInverse(q), T))))) continue;
        list.push(T);
        seen.set(key, list);
      }
      boxHits++;
      if (!baseOf(i) || !baseOf(k)) continue;
      const x = at(i).intersect(at(k));
      inter++;
      const vol = x.volume();
      const depth = vol > NOISE_VOL ? (2 * vol) / Math.max(1e-9, x.surfaceArea()) : 0;
      x.delete();
      if (al) al.depth = Math.max(al.depth, depth);
      if (al || !moves || depth <= tol) continue;
      const key = `${i}|${k}`;
      const w = worst.get(key);
      if (!w || depth > w.depth) worst.set(key, { a: S[i]!.id, b: S[k]!.id, u: phases[p]!, depth, volume: vol });
    }
    posed.forEach((m) => m.delete());
  }
  base.forEach((m) => m?.delete());
  const allows = [...allowPairs.values()].map((x): AllowFinding => ({ ...x, unnecessary: x.depth <= tol }));
  return {
    clashes: [...worst.values()].sort((x, y) => y.depth - x.depth),
    allows,
    stats: { solids: S.length, pairs: pairs.length, boxHits, intersections: inter, phases: N, ms: performance.now() - t0 },
  };
}
