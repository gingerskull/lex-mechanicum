// Package v2 (standard R4, D10, R9): an assembled v3 mechanism reduced to what the renderer draws.
//
// Geometry is shipped by operation: a plain extrusion, revolution, sweep or loft is a *profile and an operation* that
// the browser turns into triangles (src/solids/tessellate.ts); a boolean result (a bored gear, a grooved cylinder) is a
// *mesh* quantised to 1/64 mm with a tag per triangle. Identical hardware is one shape that many solids point to, each
// with its own frame, so a screw, a washer or a bearing set is stored once.
//
// Blob layout: "MXP" + format byte 2, then a deflate-raw stream of: header length (uint32 LE), header JSON (UTF-8,
// padded to 4 bytes), then the sections, each padded to 4 bytes: profile points and traces (int16 grid steps, x and y
// each as the difference from the previous point, wrapped), mesh positions (int16 at 1/64 mm, differences wrapped), mesh
// triangle indices (int32 differences), mesh tags (bytes), the plot (float32).
import type { Vec2 } from "../core/geom";
import type { Motion } from "../hardware/solid";
import type { Joint } from "../rules/types";
import type { RungId } from "../style/detail";
import type { MarkKind, SolidKind, SolidRole } from "../style/kinds";
import { MESH_GRID } from "../solids/quantise";
import type { Frame, LoftSection, MeshData, Op, Profile, Vec3 } from "../solids/types";
import type { PackageBounds } from "./format";

export const FORMAT2 = 2;

/** Bits of `PackedSolid3.flags` (the same bits as package v1). */
export const FLAG3 = { inset: 1, accent: 2, faint: 4, isBase: 8, headTop: 16, seeThrough: 32, deform: 256 } as const;
export type Flag3 = keyof typeof FLAG3;

/** One shared piece of geometry: a profile with its operation, or a mesh. */
export interface Shape2 {
  profile?: Profile;
  /** Marks on the top face, in profile coordinates. */
  marks?: { kind: MarkKind; pts: Vec2[] }[];
  op?: Op;
  /** Triangulation of the cap of an extrusion or open sweep: indices into the profile's rings (outer, then holes). */
  cap?: Uint32Array;
  mesh?: MeshData;
}

export interface PackedSolid3 {
  id: string;
  name: string;
  kind: SolidKind;
  role: SolidRole;
  body: string;
  /** Placement on the body, rounded for storage. */
  fr: Frame;
  /** Index into `shapes`. */
  shape: number;
  ex: number;
  detail: RungId;
  joints?: string[];
  group?: string;
  motion?: Motion;
  mat?: string;
  closure?: "open" | "shield" | "seal";
  headKind?: "socket" | "button" | "csk";
  chamfer?: number;
  thr?: { m: number; z0: number; z1: number; lead?: number };
  stretch?: [string, string];
  posedBy?: string;
  reach?: { to: Vec3; end: 0 | 1 };
  legacyAxis?: "x" | "y" | "p";
  flags: number;
}

export interface Package2 {
  v: typeof FORMAT2;
  id: string;
  standard: string;
  result: string;
  bounds: PackageBounds;
  /** Grid steps per mm the profile coordinates are snapped to. */
  grid: number;
  b0: number;
  b1: number;
  levels: number[];
  traces: Record<string, Float32Array>;
  vmax: Record<string, number>;
  plot?: Float32Array;
  joints: Joint[];
  shapes: Shape2[];
  solids: PackedSolid3[];
  /**
   * Engine v3: where the builder drew each body's top face, as a plane [nx, ny, nz, t] (unit normal along the body's
   * axis, dot(n, p) = t) in the reference configuration. A teaching point of the body is drawn on it (src/render/v3/poser).
   */
  lifts?: Record<string, [number, number, number, number]>;
}

export const hasFlag3 = (s: PackedSolid3, f: Flag3): boolean => (s.flags & FLAG3[f]) !== 0;

const INT16 = 32767;
const MAGIC = [0x4d, 0x58, 0x50]; // "MXP"
const pad4 = (n: number) => (n + 3) & ~3;

/** A loft in the header: the section heights only, the rings are in the geometry stream. */
interface LoftHead {
  op: "loft";
  z: number[];
}
interface HeaderShape {
  k: 0 | 1;
  op?: Exclude<Op, { op: "loft" }> | LoftHead;
  outer?: number;
  holes?: number[];
  marks?: { kind: MarkKind; n: number }[];
  /** Number of cap indices. */
  nc?: number;
  nv?: number;
  nt?: number;
}
interface Header extends Omit<Package2, "traces" | "plot" | "shapes"> {
  traces: [string, number][];
  plot: number;
  shapes: HeaderShape[];
}

const ringsOfShape = (s: Shape2): Vec2[][] => {
  if (s.mesh) return (s.marks ?? []).map((m) => m.pts);
  const out: Vec2[][] = [s.profile!.outer, ...s.profile!.holes, ...(s.marks ?? []).map((m) => m.pts)];
  if (s.op?.op === "loft") for (const sec of s.op.sections.slice(1)) out.push(sec.outer, ...sec.holes);
  return out;
};

function headerOf(s: Shape2): HeaderShape {
  if (s.mesh) return { k: 1, nv: s.mesh.pos.length / 3, nt: s.mesh.tag.length, marks: (s.marks ?? []).map((m) => ({ kind: m.kind, n: m.pts.length })) };
  const op = s.op!;
  return {
    k: 0,
    op: op.op === "loft" ? { op: "loft", z: op.sections.map((x) => x.z) } : op,
    outer: s.profile!.outer.length,
    holes: s.profile!.holes.map((h) => h.length),
    marks: (s.marks ?? []).map((m) => ({ kind: m.kind, n: m.pts.length })),
    ...(s.cap ? { nc: s.cap.length } : {}),
  };
}

/** The package as one uncompressed blob body (no magic). */
function encodeBody(p: Package2): Uint8Array {
  const { traces, plot, shapes, ...rest } = p;
  const header: Header = { ...rest, traces: Object.entries(traces).map(([k, t]) => [k, t.length]), plot: plot?.length ?? 0, shapes: shapes.map(headerOf) };
  const json = new TextEncoder().encode(JSON.stringify(header));
  const hLen = pad4(json.length);
  const profileRings = shapes.flatMap(ringsOfShape);
  const nGeom = profileRings.reduce((n, r) => n + 2 * r.length, 0) + Object.values(traces).reduce((n, t) => n + t.length, 0);
  const caps = shapes.filter((s) => s.cap).map((s) => s.cap!);
  const nCap = caps.reduce((n, c) => n + c.length, 0);
  const meshes = shapes.filter((s) => s.mesh).map((s) => s.mesh!);
  const nPos = meshes.reduce((n, m) => n + m.pos.length, 0);
  const nIdx = meshes.reduce((n, m) => n + m.tri.length, 0);
  const nTag = meshes.reduce((n, m) => n + m.tag.length, 0);
  const geomBytes = pad4(nGeom * 2);
  const capBytes = pad4(nCap * 2);
  const posBytes = pad4(nPos * 2);
  const tagBytes = pad4(nTag);
  const buf = new Uint8Array(4 + hLen + geomBytes + capBytes + posBytes + nIdx * 4 + tagBytes + (plot?.length ?? 0) * 4);
  new DataView(buf.buffer).setUint32(0, hLen, true);
  buf.set(json, 4);
  buf.fill(0x20, 4 + json.length, 4 + hLen);
  let at = 4 + hLen;
  const geom = new Int16Array(buf.buffer, at, nGeom);
  at += geomBytes;
  const capIdx = new Int16Array(buf.buffer, at, nCap);
  at += capBytes;
  const pos = new Int16Array(buf.buffer, at, nPos);
  at += posBytes;
  const idx = new Int32Array(buf.buffer, at, nIdx);
  at += nIdx * 4;
  const tag = new Uint8Array(buf.buffer, at, nTag);
  at += tagBytes;
  let o = 0;
  const put = (xs: ArrayLike<number>) => {
    let px = 0;
    let py = 0;
    for (let i = 0; i < xs.length; i += 2) {
      const qx = Math.round(xs[i]! * p.grid);
      const qy = Math.round(xs[i + 1]! * p.grid);
      if (Math.abs(qx) > INT16 || Math.abs(qy) > INT16) throw new Error(`package ${p.id}: coordinate outside the grid`);
      geom[o++] = qx - px;
      geom[o++] = qy - py;
      px = qx;
      py = qy;
    }
  };
  for (const r of profileRings) put(r.flat());
  for (const t of Object.values(traces)) put(t);
  let co = 0;
  for (const c of caps) {
    let last = 0;
    for (let i = 0; i < c.length; i++) {
      capIdx[co++] = c[i]! - last;
      last = c[i]!;
    }
  }
  let po = 0;
  let io = 0;
  let to = 0;
  for (const m of meshes) {
    let q0 = 0;
    let q1 = 0;
    let q2 = 0;
    for (let i = 0; i < m.pos.length; i += 3) {
      const a = Math.round(m.pos[i]! * MESH_GRID);
      const b = Math.round(m.pos[i + 1]! * MESH_GRID);
      const c = Math.round(m.pos[i + 2]! * MESH_GRID);
      if (Math.abs(a) > INT16 || Math.abs(b) > INT16 || Math.abs(c) > INT16) throw new Error(`package ${p.id}: a mesh coordinate is outside 1/64 mm int16`);
      pos[po++] = a - q0;
      pos[po++] = b - q1;
      pos[po++] = c - q2;
      q0 = a;
      q1 = b;
      q2 = c;
    }
    let last = 0;
    for (let i = 0; i < m.tri.length; i++) {
      idx[io++] = m.tri[i]! - last;
      last = m.tri[i]!;
    }
    tag.set(m.tag, to);
    to += m.tag.length;
  }
  if (plot) new Float32Array(buf.buffer, at, plot.length).set(plot);
  return buf;
}

async function pipe(data: Uint8Array, stream: CompressionStream | DecompressionStream): Promise<Uint8Array> {
  const out = new Response(new Response(data as BodyInit).body!.pipeThrough(stream as ReadableWritablePair<Uint8Array, Uint8Array>));
  return new Uint8Array(await out.arrayBuffer());
}

/** The package as one compressed binary blob. */
export async function encode2(p: Package2): Promise<Uint8Array> {
  const z = await pipe(encodeBody(p), new CompressionStream("deflate-raw"));
  const buf = new Uint8Array(4 + z.length);
  buf.set(MAGIC, 0);
  buf[3] = FORMAT2;
  buf.set(z, 4);
  return buf;
}

/** Reads a blob written by encode2(). */
export async function decode2(buf: Uint8Array): Promise<Package2> {
  if (buf[0] !== MAGIC[0] || buf[1] !== MAGIC[1] || buf[2] !== MAGIC[2]) throw new Error("package: not an .mxp blob");
  if (buf[3] !== FORMAT2) throw new Error(`package: format ${buf[3]}, this reader knows ${FORMAT2}`);
  return decodeBody2(await pipe(buf.subarray(4), new DecompressionStream("deflate-raw")));
}

/** Reads an uncompressed body (the part of decode2 after inflating; the bench times it apart). */
export function decodeBody2(bytes: Uint8Array): Package2 {
  const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const hLen = dv.getUint32(0, true);
  const header = JSON.parse(new TextDecoder().decode(bytes.subarray(4, 4 + hLen))) as Header;
  const { traces: tLens, plot: plotLen, shapes: hs, ...rest } = header;
  const pointsOf = (h: HeaderShape): number => {
    if (h.k === 1) return h.marks!.reduce((a, m) => a + m.n, 0);
    const ring = h.outer! + h.holes!.reduce((a, b) => a + b, 0);
    const extra = h.op && "z" in h.op ? (h.op.z.length - 1) * ring : 0;
    return ring + h.marks!.reduce((a, m) => a + m.n, 0) + extra;
  };
  const nGeom = hs.reduce((n, h) => n + 2 * pointsOf(h), 0) + tLens.reduce((n, [, l]) => n + l, 0);
  const nCap = hs.reduce((n, h) => n + (h.nc ?? 0), 0);
  const meshHs = hs.filter((h) => h.k === 1);
  const nPos = meshHs.reduce((n, h) => n + h.nv! * 3, 0);
  const nIdx = meshHs.reduce((n, h) => n + h.nt! * 3, 0);
  const nTag = meshHs.reduce((n, h) => n + h.nt!, 0);
  let at = bytes.byteOffset + 4 + hLen;
  const geom = new Int16Array(bytes.buffer, at, nGeom);
  at += pad4(nGeom * 2);
  const capIdx = new Int16Array(bytes.buffer, at, nCap);
  at += pad4(nCap * 2);
  const pos = new Int16Array(bytes.buffer, at, nPos);
  at += pad4(nPos * 2);
  const idx = new Int32Array(bytes.buffer, at, nIdx);
  at += nIdx * 4;
  const tags = new Uint8Array(bytes.buffer, at, nTag);
  at += pad4(nTag);
  const grid = header.grid;
  let o = 0;
  const ring = (n: number): Vec2[] => {
    const out: Vec2[] = new Array(n);
    let x = 0;
    let y = 0;
    for (let i = 0; i < n; i++) {
      x = ((x + geom[o]! + 32768) & 0xffff) - 32768;
      y = ((y + geom[o + 1]! + 32768) & 0xffff) - 32768;
      o += 2;
      out[i] = [x / grid, y / grid];
    }
    return out;
  };
  let co = 0;
  let po = 0;
  let io = 0;
  let to = 0;
  const shapes = hs.map((h): Shape2 => {
    if (h.k === 1) {
      const nv = h.nv!;
      const nt = h.nt!;
      const p = new Float32Array(nv * 3);
      let a = 0;
      let b = 0;
      let c = 0;
      for (let i = 0; i < nv * 3; i += 3) {
        a = ((a + pos[po + i]! + 32768) & 0xffff) - 32768;
        b = ((b + pos[po + i + 1]! + 32768) & 0xffff) - 32768;
        c = ((c + pos[po + i + 2]! + 32768) & 0xffff) - 32768;
        p[i] = a / MESH_GRID;
        p[i + 1] = b / MESH_GRID;
        p[i + 2] = c / MESH_GRID;
      }
      po += nv * 3;
      const tri = new Uint32Array(nt * 3);
      let last = 0;
      for (let i = 0; i < nt * 3; i++) {
        last += idx[io + i]!;
        tri[i] = last;
      }
      io += nt * 3;
      const tag = tags.slice(to, to + nt);
      to += nt;
      return { mesh: { pos: p, tri, tag }, marks: h.marks!.map((m) => ({ kind: m.kind, pts: ring(m.n) })) };
    }
    const outer = ring(h.outer!);
    const holes = h.holes!.map(ring);
    const marks = h.marks!.map((m) => ({ kind: m.kind, pts: ring(m.n) }));
    let op = h.op as Op;
    if (h.op && "z" in h.op) {
      const zs = h.op.z;
      const sections: LoftSection[] = [{ z: zs[0]!, outer, holes }];
      for (let i = 1; i < zs.length; i++) sections.push({ z: zs[i]!, outer: ring(h.outer!), holes: h.holes!.map(ring) });
      op = { op: "loft", sections };
    }
    const out: Shape2 = { profile: { outer, holes }, marks, op };
    if (h.nc) {
      const cap = new Uint32Array(h.nc);
      let last = 0;
      for (let i = 0; i < h.nc; i++) {
        last += capIdx[co + i]!;
        cap[i] = last;
      }
      co += h.nc;
      out.cap = cap;
    }
    return out;
  });
  const traces: Record<string, Float32Array> = {};
  for (const [k, l] of tLens) {
    const t = new Float32Array(l);
    let x = 0;
    let y = 0;
    for (let i = 0; i < l; i += 2) {
      x = ((x + geom[o]! + 32768) & 0xffff) - 32768;
      y = ((y + geom[o + 1]! + 32768) & 0xffff) - 32768;
      o += 2;
      t[i] = x / grid;
      t[i + 1] = y / grid;
    }
    traces[k] = t;
  }
  const pkg: Package2 = { ...rest, traces, shapes };
  if (plotLen) pkg.plot = new Float32Array(bytes.slice(at - bytes.byteOffset, at - bytes.byteOffset + plotLen * 4).buffer, 0, plotLen);
  return pkg;
}
