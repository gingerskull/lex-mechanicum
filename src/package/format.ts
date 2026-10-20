// The package (standard R4): an assembled mechanism reduced to what the renderer draws, built at build time and shipped
// as one binary blob. The rules engine, the hardware library and the polish never reach the browser; only this does.
//
// Blob layout: "MXP" + format version byte, then a deflate-raw stream of: header length (uint32 LE), header JSON
// (UTF-8, padded to 4 bytes), the payload. Geometry and traces are millimetres on a power-of-two grid (`grid` steps
// per mm), stored as int16 differences from the previous point of the same solid or trace (they compress well):
// pack() snaps every coordinate to that grid, so the stored value is exact and decode(encode(p)) equals p. The plot
// is float32. In memory every coordinate list is a Float32Array. Compression uses the CompressionStream that both
// browsers and Node provide, so encode() and decode() are async.
import type { Pose, Vec2 } from "../core/geom";
import type { Motion, Solid } from "../hardware/solid";
import type { Sampled } from "../model/sample";
import type { Joint } from "../rules/types";
import type { RungId } from "../style/detail";
import type { MarkKind, SolidKind, SolidRole } from "../style/kinds";

export const FORMAT = 1;

/** Bits of `PackedSolid.flags`. */
export const FLAG = { inset: 1, accent: 2, faint: 4, isBase: 8, headTop: 16, seeThrough: 32, axisX: 64, axisY: 128 } as const;
export type FlagName = keyof typeof FLAG;
/** The flags read from a solid's own fields of the same name (the axis bits come from `axis`). */
const FIELD_FLAGS = ["inset", "accent", "faint", "isBase", "headTop", "seeThrough"] as const;

export interface PackedSolid {
  id: string;
  /** Catalogue name (A13); "" for a second item of a listed set. */
  name: string;
  kind: SolidKind;
  role: SolidRole;
  /** The body it rides: a model part id or "ground". */
  body: string;
  at: Pose;
  z0: number;
  z1: number;
  /** Explode level (E1). */
  ex: number;
  detail: RungId;
  /** Solids with the same group are one body (a screw, a stepped shaft). */
  group?: string;
  motion?: Motion;
  mat?: string;
  closure?: "open" | "shield" | "seal";
  headKind?: "socket" | "button" | "csk";
  /** Edge break on the top face, mm (M1). */
  chamfer?: number;
  /** Thread: nominal M size and the z range of the drawn thread. */
  thr?: [number, number, number];
  /** FLAG bits: inset, accent, faint, isBase, headTop, seeThrough, and the axis (axisX, axisY; neither is z). */
  flags: number;
  /** x, y pairs, body-local mm: the outer outline, then each hole, then each mark. */
  pts: Float32Array;
  /** Point count of the outer outline. */
  outer: number;
  /** Point count of each hole. */
  holes: number[];
  /** Kind and point count of each mark. */
  marks: { kind: MarkKind; n: number }[];
}

export interface PackageBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  /** z range of all solids, assembled (an x or y solid's world z over the cycle). */
  z0: number;
  z1: number;
}

export interface Package {
  v: typeof FORMAT;
  id: string;
  /** Standard version of the mechanism's audit, or "none" before its first audit. */
  standard: string;
  /** The audit's result: "pass", "open", or "none" before its first audit. */
  result: string;
  /** Swept envelope of every solid over the cycle, plus the z range. */
  bounds: PackageBounds;
  /** Grid steps per mm the coordinates are snapped to. */
  grid: number;
  /** Base plate bottom and top z. */
  b0: number;
  b1: number;
  /** z of each explode level, lowest first. */
  levels: number[];
  /** Traced paths: x, y pairs over one cycle. */
  traces: Record<string, Float32Array>;
  /** Largest speed of each velocity point, mm per radian of phase (velocity overlay scale). */
  vmax: Record<string, number>;
  /** Plot of output against input at 181 phases over the cycle. */
  plot?: Float32Array;
  joints: Joint[];
  solids: PackedSolid[];
}

/** The rings of a packed solid as views into its `pts`, for drawing. */
export function ringsOf(s: PackedSolid): { outer: Float32Array; holes: Float32Array[]; marks: { kind: MarkKind; pts: Float32Array }[] } {
  let o = 0;
  const take = (n: number) => s.pts.subarray(o, (o += 2 * n));
  const outer = take(s.outer);
  const holes = s.holes.map(take);
  const marks = s.marks.map((m) => ({ kind: m.kind, pts: take(m.n) }));
  return { outer, holes, marks };
}

export const hasFlag = (s: PackedSolid, f: FlagName): boolean => (s.flags & FLAG[f]) !== 0;

/** The axis of a packed solid: "z" unless an axis flag is set. */
export const axisOfPacked = (s: PackedSolid): "z" | "x" | "y" => (hasFlag(s, "axisX") ? "x" : hasFlag(s, "axisY") ? "y" : "z");

const INT16 = 32767;
/** Finest grid: 1/256 mm. A larger mechanism gets a coarser grid so its farthest point still fits in int16. */
const MAX_GRID = 256;

/** The finest power-of-two grid on which every |coordinate| up to `max` fits in int16. */
export function gridFor(max: number): number {
  let g = MAX_GRID;
  while (g > 1 && max * g > INT16) g /= 2;
  if (max * g > INT16) throw new Error(`package: a coordinate of ${max.toFixed(0)} mm does not fit the int16 grid`);
  return g;
}

const flat = (pts: Vec2[], out: number[]) => {
  for (const [x, y] of pts) out.push(x, y);
};

/** What pack() reads from an assembly (src/package/build.ts adds the id, the standard and the envelope). */
export interface PackInput {
  id: string;
  standard?: string;
  result?: string;
  solids: Solid[];
  joints: Joint[];
  levels: number[];
  b0: number;
  b1: number;
  /** The 2D envelope of the drawing; the packager computes it from the solids' sweeps. */
  envelope: { minX: number; minY: number; maxX: number; maxY: number };
  /** World z range swept by the solids on an x or y axis, when there are any. */
  zOut?: [number, number] | null;
}

/** Reduces an assembly to its package. Coordinates are snapped to the package grid. */
export function pack(a: PackInput, sampled: Sampled): Package {
  const raw = a.solids.map((s) => {
    const xs: number[] = [];
    flat(s.outer, xs);
    for (const h of s.holes) flat(h, xs);
    for (const m of s.marks) flat(m.pts, xs);
    return xs;
  });
  const traceRaw: Record<string, number[]> = {};
  for (const [k, pts] of Object.entries(sampled.traces)) flat(pts, (traceRaw[k] = []));
  let max = 0;
  for (const xs of [...raw, ...Object.values(traceRaw)]) for (const x of xs) max = Math.max(max, Math.abs(x));
  const grid = gridFor(max);
  // "+ 0" turns -0 into 0, as the int16 store does
  const snap = (xs: number[]) => Float32Array.from(xs, (x) => Math.round(x * grid) / grid + 0);

  let z0 = Infinity;
  let z1 = -Infinity;
  if (a.zOut) {
    z0 = a.zOut[0];
    z1 = a.zOut[1];
  }
  const solids = a.solids.map((s, i): PackedSolid => {
    // an x or y solid's z0..z1 run along its axis; its world z is in zOut
    if (!s.axis) {
      z0 = Math.min(z0, s.z0);
      z1 = Math.max(z1, s.z1);
    }
    let flags = 0;
    for (const f of FIELD_FLAGS) if (s[f]) flags |= FLAG[f];
    if (s.axis === "x") flags |= FLAG.axisX;
    if (s.axis === "y") flags |= FLAG.axisY;
    const p: PackedSolid = {
      id: s.id,
      name: s.name,
      kind: s.kind,
      role: s.role,
      body: s.body,
      at: [s.at[0], s.at[1], s.at[2]],
      z0: s.z0,
      z1: s.z1,
      ex: s.ex,
      detail: s.detail,
      flags,
      pts: snap(raw[i]!),
      outer: s.outer.length,
      holes: s.holes.map((h) => h.length),
      marks: s.marks.map((m) => ({ kind: m.kind, n: m.pts.length })),
    };
    if (s.group !== undefined) p.group = s.group;
    if (s.motion) p.motion = s.motion;
    if (s.mat !== undefined) p.mat = s.mat;
    if (s.closure) p.closure = s.closure;
    if (s.headKind) p.headKind = s.headKind;
    if (s.chamfer !== undefined) p.chamfer = s.chamfer;
    if (s.thread !== undefined && s.threadZ) p.thr = [s.thread, s.threadZ[0], s.threadZ[1]];
    return p;
  });
  const traces: Record<string, Float32Array> = {};
  for (const [k, xs] of Object.entries(traceRaw)) traces[k] = snap(xs);
  const pkg: Package = {
    v: FORMAT,
    id: a.id,
    standard: a.standard ?? "none",
    result: a.result ?? "none",
    bounds: { ...a.envelope, z0, z1 },
    grid,
    b0: a.b0,
    b1: a.b1,
    levels: [...a.levels],
    traces,
    vmax: { ...sampled.vmax },
    joints: a.joints.map((j) => structuredClone(j)),
    solids,
  };
  if (sampled.plotData) pkg.plot = Float32Array.from(sampled.plotData);
  return pkg;
}

const MAGIC = [0x4d, 0x58, 0x50]; // "MXP"

type HeaderSolid = Omit<PackedSolid, "pts">;
interface Header extends Omit<Package, "traces" | "plot" | "solids"> {
  traces: [string, number][];
  plot: number;
  solids: HeaderSolid[];
}

const pad4 = (n: number) => (n + 3) & ~3;

/** The package as one uncompressed blob body (no magic). */
function encodeBody(p: Package): Uint8Array {
  const { traces, plot, solids, ...rest } = p;
  const header: Header = {
    ...rest,
    traces: Object.entries(traces).map(([k, t]) => [k, t.length]),
    plot: plot?.length ?? 0,
    solids: solids.map((s): HeaderSolid => {
      const { pts, ...meta } = s;
      void pts;
      return meta;
    }),
  };
  const json = new TextEncoder().encode(JSON.stringify(header));
  const hLen = pad4(json.length);
  const nGeom = solids.reduce((n, s) => n + s.pts.length, 0) + Object.values(traces).reduce((n, t) => n + t.length, 0);
  const geomBytes = pad4(nGeom * 2);
  const buf = new Uint8Array(4 + hLen + geomBytes + (plot?.length ?? 0) * 4);
  new DataView(buf.buffer).setUint32(0, hLen, true);
  buf.set(json, 4);
  buf.fill(0x20, 4 + json.length, 4 + hLen); // pad the JSON with spaces
  const geom = new Int16Array(buf.buffer, 4 + hLen, nGeom);
  let o = 0;
  // x and y each as the difference from the previous point's, wrapped to int16 (a jump across the whole drawing may
  // overflow it); the reader unwraps it, since every coordinate itself fits in ±32767
  const put = (xs: Float32Array) => {
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
  for (const s of solids) put(s.pts);
  for (const t of Object.values(traces)) put(t);
  if (plot) new Float32Array(buf.buffer, 4 + hLen + geomBytes, plot.length).set(plot);
  return buf;
}

async function pipe(data: Uint8Array, stream: CompressionStream | DecompressionStream): Promise<Uint8Array> {
  const out = new Response(new Response(data as BodyInit).body!.pipeThrough(stream as ReadableWritablePair<Uint8Array, Uint8Array>));
  return new Uint8Array(await out.arrayBuffer());
}

/** The package as one compressed binary blob. */
export async function encode(p: Package): Promise<Uint8Array> {
  const z = await pipe(encodeBody(p), new CompressionStream("deflate-raw"));
  const buf = new Uint8Array(4 + z.length);
  buf.set(MAGIC, 0);
  buf[3] = FORMAT;
  buf.set(z, 4);
  return buf;
}

/** Reads a blob written by encode(). */
export async function decode(buf: Uint8Array): Promise<Package> {
  if (buf[0] !== MAGIC[0] || buf[1] !== MAGIC[1] || buf[2] !== MAGIC[2]) throw new Error("package: not an .mxp blob");
  if (buf[3] !== FORMAT) throw new Error(`package: format ${buf[3]}, this reader knows ${FORMAT}`);
  return decodeBody(await pipe(buf.subarray(4), new DecompressionStream("deflate-raw")));
}

function decodeBody(bytes: Uint8Array): Package {
  const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const hLen = dv.getUint32(0, true);
  const header = JSON.parse(new TextDecoder().decode(bytes.subarray(4, 4 + hLen))) as Header;
  const { traces: tLens, plot: plotLen, solids: hs, ...rest } = header;
  const nGeom = hs.reduce((n, s) => n + 2 * (s.outer + s.holes.reduce((a, b) => a + b, 0) + s.marks.reduce((a, m) => a + m.n, 0)), 0) + tLens.reduce((n, [, l]) => n + l, 0);
  const geom = new Int16Array(bytes.buffer, bytes.byteOffset + 4 + hLen, nGeom);
  // one Float32Array for all coordinates; every solid and trace is a view into it
  const all = new Float32Array(nGeom);
  let o = 0;
  const take = (n: number) => {
    let x = 0;
    let y = 0;
    for (let i = o; i < o + n; i += 2) {
      x = ((x + geom[i]! + 32768) & 0xffff) - 32768;
      y = ((y + geom[i + 1]! + 32768) & 0xffff) - 32768;
      all[i] = x / header.grid;
      all[i + 1] = y / header.grid;
    }
    return all.subarray(o, (o += n));
  };
  const solids = hs.map((s): PackedSolid => ({ ...s, pts: take(2 * (s.outer + s.holes.reduce((a, b) => a + b, 0) + s.marks.reduce((a, m) => a + m.n, 0))) }));
  const traces: Record<string, Float32Array> = {};
  for (const [k, l] of tLens) traces[k] = take(l);
  const pkg: Package = { ...rest, traces, solids };
  if (plotLen) pkg.plot = new Float32Array(bytes.slice(4 + hLen + pad4(nGeom * 2)).buffer, 0, plotLen);
  return pkg;
}
