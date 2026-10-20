// Every solid's geometry as GPU items, built once per session in the solid's own millimetres. An item is three RGBA
// float texels:
//   t0 = (aux0, aux1, cumA, cumB)   t1 = (ax, ay, bx, by)   t2 = (cx, cy, 0, 0)
// Edges (outer ring and holes): a -> b, aux0 = sign of the ring's local area, aux1 = hole id (-1 on the outer ring),
// cumA/cumB = distance along the ring (mm, for dashes). Triangles of the top face: a, b, c. Vertices of the outer ring
// (for silhouettes): a = previous, b = this, c = next, aux0 = ring sign. Segments of chamfer rings and marks: like edges.
// The frame draws ranges of items in a mode (wall, face, line...), so one item set serves every pass.
import earcut from "earcut";
import { area, type Vec2 } from "../../core/geom";
import type { MarkKind } from "../../style/kinds";
import type { Prepared } from "../world";

export const ITEM_TEXELS = 3;

export type Range = [start: number, count: number];

export interface SolidItems {
  outer: Range;
  holes: Range;
  tris: Range;
  verts: Range;
  chamfer: Range;
  marks: { kind: MarkKind; closed: boolean; range: Range }[];
  /** A stretched or deforming solid: its top face's triangle indices, kept to refresh its items each frame. */
  tri?: number[];
}

export interface Items {
  /** RGBA texels, ITEM_TEXELS per item. */
  data: Float32Array;
  count: number;
  solids: Map<Prepared, SolidItems>;
  /** Per hole id: first edge item and edge count (for clipping hole walls to the hole). */
  holes: Float32Array;
}

/**
 * Rewrites a stretched or deforming solid's items (outline edges, top-face triangles, outline vertices) for its outline
 * of this frame, in place: the point count never changes, so the item ranges hold. Returns the first and last item
 * written.
 */
export function refreshItems(items: Items, p: Prepared, outer: Vec2[]): [number, number] {
  const it = items.solids.get(p)!;
  const D = items.data;
  const n = outer.length;
  const put = (i: number, aux0: number, aux1: number, cumA: number, cumB: number, a: Vec2, b: Vec2, c: Vec2 = [0, 0]) => {
    const o = i * ITEM_TEXELS * 4;
    D[o] = aux0;
    D[o + 1] = aux1;
    D[o + 2] = cumA;
    D[o + 3] = cumB;
    D[o + 4] = a[0];
    D[o + 5] = a[1];
    D[o + 6] = b[0];
    D[o + 7] = b[1];
    D[o + 8] = c[0];
    D[o + 9] = c[1];
  };
  const s = area(outer) > 0 ? 1 : -1;
  let cum = 0;
  for (let i = 0; i < n; i++) {
    const a = outer[i]!;
    const b = outer[(i + 1) % n]!;
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    put(it.outer[0] + i, s, -1, cum, cum + L, a, b);
    cum += L;
  }
  const pts = [...outer, ...p.holes.flat()];
  const tri = it.tri ?? [];
  for (let k = 0; k < tri.length; k += 3) put(it.tris[0] + k / 3, 0, 0, 0, 0, pts[tri[k]!]!, pts[tri[k + 1]!]!, pts[tri[k + 2]!]!);
  for (let i = 0; i < n; i++) put(it.verts[0] + i, s, 0, 0, 0, outer[(i - 1 + n) % n]!, outer[i]!, outer[(i + 1) % n]!);
  return [it.outer[0], it.verts[0] + it.verts[1] - 1];
}

export function buildItems(prepared: Prepared[]): Items {
  const out: number[] = [];
  const holes: number[] = [];
  let n = 0;
  const push = (aux0: number, aux1: number, cumA: number, cumB: number, a: Vec2, b: Vec2, c: Vec2 = [0, 0]) => {
    out.push(aux0, aux1, cumA, cumB, a[0], a[1], b[0], b[1], c[0], c[1], 0, 0);
    n++;
  };
  const ring = (P: Vec2[], aux1: number, closed = true) => {
    const s = area(P) > 0 ? 1 : -1;
    let cum = 0;
    const m = closed ? P.length : P.length - 1;
    for (let i = 0; i < m; i++) {
      const a = P[i]!;
      const b = P[(i + 1) % P.length]!;
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
      push(s, aux1, cum, cum + L, a, b);
      cum += L;
    }
  };
  const solids = new Map<Prepared, SolidItems>();
  for (const p of prepared) {
    const s0 = n;
    ring(p.outer, -1);
    const outer: Range = [s0, n - s0];
    const h0 = n;
    for (const h of p.holes) {
      const id = holes.length / 2;
      const e0 = n;
      ring(h, id);
      holes.push(e0, n - e0);
    }
    const holesR: Range = [h0, n - h0];
    const t0 = n;
    const flat: number[] = [];
    const idx: number[] = [];
    for (const [x, y] of p.outer) flat.push(x, y);
    for (const h of p.holes) {
      idx.push(flat.length / 2);
      for (const [x, y] of h) flat.push(x, y);
    }
    const tri = earcut(flat, idx);
    const pt = (i: number): Vec2 => [flat[2 * i]!, flat[2 * i + 1]!];
    for (let i = 0; i < tri.length; i += 3) push(0, 0, 0, 0, pt(tri[i]!), pt(tri[i + 1]!), pt(tri[i + 2]!));
    const tris: Range = [t0, n - t0];
    const v0 = n;
    const sg = area(p.outer) > 0 ? 1 : -1;
    const P = p.outer;
    for (let i = 0; i < P.length; i++) push(sg, 0, 0, 0, P[(i - 1 + P.length) % P.length]!, P[i]!, P[(i + 1) % P.length]!);
    const verts: Range = [v0, n - v0];
    const c0 = n;
    for (const k of p.edges ?? []) ring(k, -1);
    const chamfer: Range = [c0, n - c0];
    const marks: SolidItems["marks"] = [];
    for (const m of p.marks) {
      const closed = m.pts.length > 2 && m.kind !== "engrave" && m.kind !== "scale";
      const m0 = n;
      ring(m.pts, -1, closed);
      marks.push({ kind: m.kind, closed, range: [m0, n - m0] });
    }
    solids.set(p, { outer, holes: holesR, tris, verts, chamfer, marks, ...(p.dyn ? { tri: Array.from(tri) } : {}) });
  }
  return { data: new Float32Array(out), count: n, solids, holes: new Float32Array(holes) };
}
