// The package's geometry made ready for the GPU, once per session (standard R9): every solid's triangles (flat normals,
// expanded) in one vertex array and every solid's drafting edges in one edge array, each row naming its solid, so the
// whole assembly is drawn in one call per peeled layer and one call for the lines. Identical hardware shares a shape; its
// expanded rows are made once and copied per solid, so setup is a copy, not a recomputation. Pure and DOM-free: the
// buffers are what the GPU gets, and Node tests read them.
import type { Package2, PackedSolid3, Shape2 } from "../../package/format2";
import type { Vec2 } from "../../core/geom";
import { EF, type EdgeSet } from "../../solids/edges";
import type { MeshData } from "../../solids/types";
import { DRAFT } from "../../style/draft";
import { MARK_KINDS } from "../../style/kinds";

/** Floats per vertex: position (3), normal (3), solid index, tag, place along a running belt (mm; SD29). */
export const VF = 9;
/** Floats per edge: a (3) and cumulative length, b (3) and cumulative length, n1 (3) and kind, n2 (3) and flags, solid, mark. */
export const EF2 = 18;

/** A shape's triangles expanded to flat-shaded vertices, solid index 0. */
export function expandMesh(m: MeshData): Float32Array {
  const { pos, tri, tag } = m;
  const nt = tag.length;
  const out = new Float32Array(nt * 3 * VF);
  let o = 0;
  for (let t = 0; t < nt; t++) {
    const a = tri[3 * t]!, b = tri[3 * t + 1]!, c = tri[3 * t + 2]!;
    const ux = pos[3 * b]! - pos[3 * a]!, uy = pos[3 * b + 1]! - pos[3 * a + 1]!, uz = pos[3 * b + 2]! - pos[3 * a + 2]!;
    const vx = pos[3 * c]! - pos[3 * a]!, vy = pos[3 * c + 1]! - pos[3 * a + 1]!, vz = pos[3 * c + 2]! - pos[3 * a + 2]!;
    let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    const l = Math.hypot(nx, ny, nz) || 1;
    nx /= l; ny /= l; nz /= l;
    for (const v of [a, b, c]) {
      out[o] = pos[3 * v]!; out[o + 1] = pos[3 * v + 1]!; out[o + 2] = pos[3 * v + 2]!;
      out[o + 3] = nx; out[o + 4] = ny; out[o + 5] = nz;
      out[o + 7] = tag[t]!;
      o += VF;
    }
  }
  return out;
}

/** How far round a closed path (mm, from its first point, the way it runs) the point of it nearest (x, y) is. */
export function pathPlace(path: readonly Vec2[], x: number, y: number): number {
  let best = Infinity;
  let at = 0;
  let s = 0;
  for (let i = 0; i < path.length; i++) {
    const p = path[i]!;
    const q = path[(i + 1) % path.length]!;
    const dx = q[0] - p[0], dy = q[1] - p[1];
    const L = Math.hypot(dx, dy);
    const t = L > 0 ? Math.max(0, Math.min(1, ((x - p[0]) * dx + (y - p[1]) * dy) / (L * L))) : 0;
    const e = Math.hypot(p[0] + t * dx - x, p[1] + t * dy - y);
    if (e < best) {
      best = e;
      at = s + t * L;
    }
    s += L;
  }
  return at;
}

/** The length of a closed path (mm). */
export const loopLength = (path: readonly Vec2[]): number => path.reduce((a, p, i) => a + Math.hypot(path[(i + 1) % path.length]![0] - p[0], path[(i + 1) % path.length]![1] - p[1]), 0);

/**
 * Each vertex's place along a running belt (SD29), written into the expanded vertices `v` from `o` to `end`: on a belt's
 * band its place round the pitch path, a triangle across the path's start counted on past its length so the place runs
 * on smoothly within it; on a conveyed element its own z (it runs along its path's way).
 */
function runPlaces(s: PackedSolid3, v: Float32Array, o: number, end: number): void {
  const path = s.run?.path;
  if (!path) {
    for (let k = o; k < end; k += VF) v[k + 8] = v[k + 2]!;
    return;
  }
  const L = loopLength(path);
  for (let t = o; t < end; t += 3 * VF) {
    const a = [0, 1, 2].map((j) => pathPlace(path, v[t + j * VF]!, v[t + j * VF + 1]!));
    const wrap = Math.max(...a) - Math.min(...a) > L / 2;
    a.forEach((x, j) => (v[t + j * VF + 8] = wrap && x < L / 2 ? x + L : x));
  }
}

/** The local bounding box of a mesh: x0, y0, z0, x1, y1, z1. */
export function meshBox(m: MeshData): [number, number, number, number, number, number] {
  const b: [number, number, number, number, number, number] = [Infinity, Infinity, Infinity, -Infinity, -Infinity, -Infinity];
  const p = m.pos;
  for (let i = 0; i < p.length; i += 3) {
    for (let k = 0; k < 3; k++) {
      const v = p[i + k]!;
      if (v < b[k]!) b[k] = v;
      if (v > b[k + 3]!) b[k + 3] = v;
    }
  }
  return b[0] === Infinity ? [0, 0, 0, 0, 0, 0] : b;
}

/** A shape's edges re-laid for the GPU (a, cumA, b, cumB, n1, kind, n2, flags, solid 0, mark index), and the mark index per edge. */
export function layoutEdges(e: EdgeSet, shape: Pick<Shape2, "marks">): Float32Array {
  const out = new Float32Array(e.n * EF2);
  const d = e.data;
  // mark lines come last, in the order of the shape's marks, one edge per segment
  const markAt = new Uint8Array(e.n);
  let at = e.n;
  const segs = (shape.marks ?? []).map((m) => Math.max(0, m.pts.length - 1));
  const total = segs.reduce((a, b) => a + b, 0);
  at -= total;
  if (at >= 0) (shape.marks ?? []).forEach((m, i) => { for (let k = 0; k < segs[i]!; k++) markAt[at++] = MARK_KINDS.indexOf(m.kind) + 1; });
  for (let k = 0; k < e.n; k++) {
    const b = k * EF, o = k * EF2;
    out[o] = d[b]!; out[o + 1] = d[b + 1]!; out[o + 2] = d[b + 2]!; out[o + 3] = d[b + 12]!;
    out[o + 4] = d[b + 3]!; out[o + 5] = d[b + 4]!; out[o + 6] = d[b + 5]!; out[o + 7] = d[b + 13]!;
    out[o + 8] = d[b + 6]!; out[o + 9] = d[b + 7]!; out[o + 10] = d[b + 8]!; out[o + 11] = d[b + 14]!;
    out[o + 12] = d[b + 9]!; out[o + 13] = d[b + 10]!; out[o + 14] = d[b + 11]!; out[o + 15] = d[b + 15]!;
    out[o + 17] = markAt[k]!;
  }
  return out;
}

/** The edge kind of the accent ring (the shaders colour it with the accent). */
export const EDGE_RING = 4;

export interface Baked {
  /** Vertices, VF floats each. */
  verts: Float32Array;
  nVerts: number;
  /** Edges, EF2 floats each. */
  edges: Float32Array;
  nEdges: number;
  /** Per solid: the local box of its shape, six floats. */
  box: Float32Array;
  /** Per solid: the first and one-past-last vertex of its triangles. */
  vrange: Uint32Array;
}

export interface BakeOptions {
  /** Segments of the accent ring round a solid flagged accent (style draft.lines.accentRing). */
  ringSegments: number;
  /** Radius of the ring as a factor on the head's extent (draft.lines.accentRing.radius). */
  ringRadius: number;
}

/** What the bake reads from the style. */
export const BAKE: BakeOptions = { ringSegments: DRAFT.lines.accentRing.segments, ringRadius: DRAFT.lines.accentRing.radius };

/** Everything the GPU draws, from the package's solids and the prepared shapes. */
export function bake(pkg: Package2, meshes: readonly MeshData[], edges: readonly EdgeSet[], shapes: readonly Pick<Shape2, "marks">[], o: BakeOptions): Baked {
  const n = pkg.solids.length;
  const ex = meshes.map(expandMesh);
  const le = edges.map((e, i) => layoutEdges(e, shapes[i] ?? {}));
  const boxes = meshes.map(meshBox);
  let nv = 0;
  let ne = 0;
  let rings = 0;
  for (const s of pkg.solids) {
    nv += ex[s.shape]!.length / VF;
    ne += le[s.shape]!.length / EF2;
    if (s.flags & 2) rings += o.ringSegments;
  }
  const verts = new Float32Array(nv * VF);
  const E = new Float32Array((ne + rings) * EF2);
  const box = new Float32Array(n * 6);
  const vrange = new Uint32Array(n * 2);
  let vo = 0;
  let eo = 0;
  pkg.solids.forEach((s, i) => {
    const x = ex[s.shape]!;
    vrange[2 * i] = vo / VF;
    verts.set(x, vo);
    for (let k = 6; k < x.length; k += VF) verts[vo + k] = i;
    if (s.run) runPlaces(s, verts, vo, vo + x.length);
    vo += x.length;
    vrange[2 * i + 1] = vo / VF;
    const e = le[s.shape]!;
    E.set(e, eo);
    for (let k = 16; k < e.length; k += EF2) E[eo + k] = i;
    eo += e.length;
    box.set(boxes[s.shape]!, i * 6);
    if (s.flags & 2) {
      const b = boxes[s.shape]!;
      const cx = (b[0] + b[3]) / 2, cy = (b[1] + b[4]) / 2, z = b[5];
      const rx = (b[3] - b[0]) * o.ringRadius, ry = (b[4] - b[1]) * o.ringRadius;
      const N = o.ringSegments;
      for (let k = 0; k < N; k++) {
        const a0 = (k / N) * Math.PI * 2, a1 = ((k + 1) / N) * Math.PI * 2;
        const L = (Math.PI * 2 * (rx + ry)) / 2 / N;
        E.set([cx + rx * Math.cos(a0), cy + ry * Math.sin(a0), z, k * L, cx + rx * Math.cos(a1), cy + ry * Math.sin(a1), z, (k + 1) * L, 0, 0, 1, EDGE_RING, 0, 0, 1, 0, i, 0], eo);
        eo += EF2;
      }
    }
  });
  return { verts, nVerts: nv, edges: E, nEdges: ne + rings, box, vrange };
}
