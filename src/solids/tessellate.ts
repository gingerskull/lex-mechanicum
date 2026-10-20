// Profile + operation -> triangles (standard D10): what the browser does with a plain extrusion, revolution, sweep or
// loft that package v2 ships as a profile, and what the soundness check and the tests do in Node. No Manifold here.
// Rings are indexed, caps share their vertices with the walls, so the mesh is closed; every triangle carries a TAG
// (cap, wall, or hole wall). A deforming member keeps its topology and has its positions rewritten each frame
// (`updatePositions`). Positions are computed in doubles and stored as float32.
import earcut from "earcut";
import { TAU, area, type Vec2 } from "../core/geom";
import { cross, dot, norm } from "./frame";
import { TAG, type MeshData, type Op, type Profile, type Vec3 } from "./types";

/** The most a faceted circle may fall short of the true one, mm: a quarter of the clash tolerance (A15). */
export const FACET_TOL = 0.025;
/** A wall whose normal is this close to the axis is a cap (a flat face across the part's axis). */
export const CAP_COS = 0.999;

/** Facets round a revolved radius `r`: a multiple of four, so the extreme points are exact, with sag under `tol`. */
export function segmentsFor(r: number, tol = FACET_TOL): number {
  if (!(r > tol)) return 8;
  const n = Math.ceil(Math.PI / Math.acos(Math.max(0, 1 - tol / r)));
  return Math.min(256, Math.max(16, Math.ceil(n / 4) * 4));
}

/** Layers along an extrusion that twists by `twist` degrees: one per 2.5 degrees, at least one. */
export const stepsFor = (twist = 0): number => (twist ? Math.max(2, Math.ceil(Math.abs(twist) / 2.5)) : 1);

/** An extrude op with its layer count set from the twist. */
export const extrudeOp = (h: number, o: { scaleTop?: number; twist?: number } = {}): Op => {
  const op: Op = { op: "extrude", h, steps: stepsFor(o.twist) };
  if (o.scaleTop !== undefined && o.scaleTop !== 1) op.scaleTop = o.scaleTop;
  if (o.twist) op.twist = o.twist;
  return op;
};

/** A revolve op with the faceting set from the profile's largest radius. */
export const revolveOp = (profile: Profile): Op => ({ op: "revolve", segments: segmentsFor(Math.max(...profile.outer.map((p) => p[0]))) });

const EPS = 1e-9;

/** A ring without a closing duplicate point or repeated points. */
export function cleanRing(r: readonly Vec2[]): Vec2[] {
  const out: Vec2[] = [];
  for (const p of r) {
    const q = out[out.length - 1];
    if (!q || Math.abs(p[0] - q[0]) > EPS || Math.abs(p[1] - q[1]) > EPS) out.push(p);
  }
  while (out.length > 1 && Math.abs(out[0]![0] - out[out.length - 1]![0]) <= EPS && Math.abs(out[0]![1] - out[out.length - 1]![1]) <= EPS) out.pop();
  return out;
}

/**
 * A ring without the points that lie exactly on the line between their neighbours. The triangulation of a cap leaves such
 * a point out, which would open the mesh there; on a package's grid they are exact, so they can be dropped for good.
 */
export function dropCollinear(r: readonly Vec2[]): Vec2[] {
  let out = r.slice();
  for (let again = true; again && out.length > 3; ) {
    again = false;
    const keep: Vec2[] = [];
    for (let i = 0; i < out.length; i++) {
      const a = out[(i + out.length - 1) % out.length]!;
      const p = out[i]!;
      const b = out[(i + 1) % out.length]!;
      const cross = (p[0] - a[0]) * (b[1] - p[1]) - (p[1] - a[1]) * (b[0] - p[0]);
      const ahead = (p[0] - a[0]) * (b[0] - p[0]) + (p[1] - a[1]) * (b[1] - p[1]) > 0;
      if (cross === 0 && ahead && keep.length + (out.length - i - 1) > 2) again = true;
      else keep.push(p);
    }
    out = keep;
  }
  return out;
}

/** The profile with clean rings, the outer counter-clockwise and the holes clockwise . */
export function orient(p: Profile): Profile {
  const fix = (r: readonly Vec2[], ccw: boolean): Vec2[] => {
    const c = cleanRing(r);
    return c.length < 3 || area(c) > 0 === ccw ? c : c.slice().reverse();
  };
  return { outer: fix(p.outer, true), holes: p.holes.map((h) => fix(h, false)) };
}

interface Layers {
  /** Points per ring, the outer ring first. */
  rings: number[];
  /** Layers along the sweep. */
  K: number;
  /** The last layer joins the first (a loop). */
  closed: boolean;
  /** x, y, z per point, layer by layer, ring by ring. */
  pts: Float64Array;
  /** Flat x, y coordinates of the start and end cap rings, for triangulating the caps (none when closed). */
  start: number[];
  end: number[];
}

const flat2 = (rings: readonly (readonly Vec2[])[]): number[] => rings.flatMap((r) => r.flatMap((p) => [p[0], p[1]]));

function extrudeLayers(p: Profile, op: Extrude): Layers {
  const rings = [p.outer, ...p.holes];
  const N = rings.reduce((n, r) => n + r.length, 0);
  const K = op.steps + 1;
  const pts = new Float64Array(K * N * 3);
  const k1 = op.scaleTop ?? 1;
  const tw = ((op.twist ?? 0) * Math.PI) / 180;
  let o = 0;
  for (let k = 0; k < K; k++) {
    const t = k / op.steps;
    const s = 1 + (k1 - 1) * t;
    const a = tw * t;
    const c = Math.cos(a) * s;
    const sn = Math.sin(a) * s;
    for (const r of rings)
      for (const [x, y] of r) {
        pts[o++] = c * x - sn * y;
        pts[o++] = sn * x + c * y;
        pts[o++] = op.h * t;
      }
  }
  // one array for both caps, so the layered mesh triangulates the cap once and reuses it
  const xy = flat2(rings);
  return { rings: rings.map((r) => r.length), K, closed: false, pts, start: xy, end: xy };
}

/** The rotation-minimising frames (x, y, tangent) at each path point, seeded so profile y lies toward world z. */
function pathFrames(path: readonly Vec3[], closed: boolean): { x: Vec3; y: Vec3; t: Vec3 }[] {
  const m = path.length;
  const T: Vec3[] = path.map((p, i) => {
    const a = closed ? path[(i + m - 1) % m]! : path[Math.max(0, i - 1)]!;
    const b = closed ? path[(i + 1) % m]! : path[Math.min(m - 1, i + 1)]!;
    return norm([b[0] - a[0], b[1] - a[1], b[2] - a[2]]);
  });
  const up: Vec3 = Math.abs(T[0]![2]) > 0.99 ? [0, 1, 0] : [0, 0, 1];
  const d = dot(up, T[0]!);
  let y = norm([up[0] - d * T[0]![0], up[1] - d * T[0]![1], up[2] - d * T[0]![2]]);
  let x = cross(y, T[0]!);
  const out = [{ x, y, t: T[0]! }];
  for (let i = 1; i < m; i++) {
    // parallel transport: the rotation that takes tangent i-1 to tangent i (double reflection, Wang et al.)
    const a = path[i - 1]!;
    const b = path[i]!;
    const v1: Vec3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
    const c1 = dot(v1, v1) || 1;
    const rL = (v: Vec3): Vec3 => {
      const f = (2 * dot(v1, v)) / c1;
      return [v[0] - f * v1[0], v[1] - f * v1[1], v[2] - f * v1[2]];
    };
    const tL = rL(out[i - 1]!.t);
    const v2: Vec3 = [T[i]![0] - tL[0], T[i]![1] - tL[1], T[i]![2] - tL[2]];
    const c2 = dot(v2, v2) || 1;
    const rr = (v: Vec3): Vec3 => {
      const f = (2 * dot(v2, v)) / c2;
      return [v[0] - f * v2[0], v[1] - f * v2[1], v[2] - f * v2[2]];
    };
    x = rr(rL(x));
    y = rr(rL(y));
    out.push({ x, y, t: T[i]! });
  }
  return out;
}

function sweepLayers(p: Profile, op: Sweep): Layers {
  const path = op.path;
  const closed = !!op.closed;
  const m = path.length;
  const F = pathFrames(path, closed);
  const rings = [p.outer, ...p.holes];
  const N = rings.reduce((n, r) => n + r.length, 0);
  const pts = new Float64Array(m * N * 3);
  let len = 0;
  const cum = path.map((q, i) => (i ? (len += Math.hypot(q[0] - path[i - 1]![0], q[1] - path[i - 1]![1], q[2] - path[i - 1]![2])) : 0));
  const total = closed ? len + Math.hypot(path[0]![0] - path[m - 1]![0], path[0]![1] - path[m - 1]![1], path[0]![2] - path[m - 1]![2]) : len;
  const tw = ((op.twist ?? 0) * Math.PI) / 180;
  let o = 0;
  for (let k = 0; k < m; k++) {
    const { x, y } = F[k]!;
    const a = total ? (tw * cum[k]!) / total : 0;
    const c = Math.cos(a);
    const s = Math.sin(a);
    const q = path[k]!;
    for (const r of rings)
      for (const [u, v] of r) {
        const uu = c * u - s * v;
        const vv = s * u + c * v;
        pts[o++] = q[0] + x[0] * uu + y[0] * vv;
        pts[o++] = q[1] + x[1] * uu + y[1] * vv;
        pts[o++] = q[2] + x[2] * uu + y[2] * vv;
      }
  }
  const xy = closed ? [] : flat2(rings);
  return { rings: rings.map((r) => r.length), K: m, closed, pts, start: xy, end: xy };
}

function loftLayers(op: Loft): Layers {
  const S = op.sections;
  const rings0 = [S[0]!.outer, ...S[0]!.holes];
  const N = rings0.reduce((n, r) => n + r.length, 0);
  const pts = new Float64Array(S.length * N * 3);
  let o = 0;
  for (const sec of S) {
    const rings = [sec.outer, ...sec.holes];
    if (rings.length !== rings0.length || rings.some((r, i) => r.length !== rings0[i]!.length)) throw new Error("loft: every section needs the same rings and point counts");
    for (const r of rings)
      for (const [x, y] of r) {
        pts[o++] = x;
        pts[o++] = y;
        pts[o++] = sec.z;
      }
  }
  const last = S[S.length - 1]!;
  return { rings: rings0.map((r) => r.length), K: S.length, closed: false, pts, start: flat2(rings0), end: flat2([last.outer, ...last.holes]) };
}

type Extrude = Extract<Op, { op: "extrude" }>;
type Sweep = Extract<Op, { op: "sweep" }>;
type Loft = Extract<Op, { op: "loft" }>;

const layersOf = (p: Profile, op: Op): Layers => {
  if (op.op === "extrude") return extrudeLayers(p, op);
  if (op.op === "sweep") return sweepLayers(p, op);
  if (op.op === "loft") return loftLayers(op);
  throw new Error("revolve has no layers");
};

/** Milliseconds spent triangulating caps since the last reset: the bench splits tessellation with it. */
export const capTime = { ms: 0 };

/** Triangles of a flat cap given its flat ring coordinates, as indices into the cap's points; counter-clockwise in xy. */
function capTriangles(xy: number[], rings: number[]): number[] {
  const t0 = performance.now();
  try {
    return capTrianglesRaw(xy, rings);
  } finally {
    capTime.ms += performance.now() - t0;
  }
}

function capTrianglesRaw(xy: number[], rings: number[]): number[] {
  const holes: number[] = [];
  let o = 0;
  for (let i = 0; i < rings.length - 1; i++) holes.push((o += rings[i]!));
  const tri = earcut(xy, holes.length ? holes : undefined, 2);
  // earcut's winding follows the input; make every triangle counter-clockwise
  for (let i = 0; i < tri.length; i += 3) {
    const a = tri[i]! * 2;
    const b = tri[i + 1]! * 2;
    const c = tri[i + 2]! * 2;
    if ((xy[b]! - xy[a]!) * (xy[c + 1]! - xy[a + 1]!) - (xy[b + 1]! - xy[a + 1]!) * (xy[c]! - xy[a]!) < 0) {
      const t = tri[i + 1]!;
      tri[i + 1] = tri[i + 2]!;
      tri[i + 2] = t;
    }
  }
  return tri;
}

function layeredMesh(L: Layers): MeshData {
  const N = L.rings.reduce((a, b) => a + b, 0);
  const wallLayers = L.closed ? L.K : L.K - 1;
  const nWall = wallLayers * N * 2;
  const startTri = L.closed ? [] : capTriangles(L.start, L.rings);
  const endTri = L.closed ? [] : L.end === L.start ? startTri : capTriangles(L.end, L.rings);
  const tri = new Uint32Array((nWall + (startTri.length + endTri.length) / 3) * 3);
  const tag = new Uint8Array(tri.length / 3);
  let o = 0;
  let t = 0;
  for (let k = 0; k < wallLayers; k++) {
    const k2 = (k + 1) % L.K;
    let off = 0;
    L.rings.forEach((n, r) => {
      for (let i = 0; i < n; i++) {
        const j = (i + 1) % n;
        const a0 = k * N + off + i;
        const b0 = k * N + off + j;
        const a1 = k2 * N + off + i;
        const b1 = k2 * N + off + j;
        tri[o++] = a0;
        tri[o++] = b0;
        tri[o++] = b1;
        tri[o++] = a0;
        tri[o++] = b1;
        tri[o++] = a1;
        tag[t++] = r === 0 ? TAG.wall : TAG.hole;
        tag[t++] = r === 0 ? TAG.wall : TAG.hole;
      }
      off += n;
    });
  }
  // the start cap faces back along the sweep, the end cap forward
  for (let i = 0; i < startTri.length; i += 3) {
    tri[o++] = startTri[i]!;
    tri[o++] = startTri[i + 2]!;
    tri[o++] = startTri[i + 1]!;
    tag[t++] = TAG.cap;
  }
  const e = (L.K - 1) * N;
  for (let i = 0; i < endTri.length; i += 3) {
    tri[o++] = e + endTri[i]!;
    tri[o++] = e + endTri[i + 1]!;
    tri[o++] = e + endTri[i + 2]!;
    tag[t++] = TAG.cap;
  }
  return { pos: Float32Array.from(L.pts), tri, tag };
}

/** Index maps of a revolve: the profile's points that lie on the axis are single vertices. */
function revolveGrid(ring: Vec2[], segments: number) {
  const idx: number[] = [];
  let n = 0;
  for (const [x] of ring) {
    idx.push(n);
    n += Math.abs(x) < EPS ? 1 : segments;
  }
  return { idx, n };
}

function revolveRings(p: Profile): Vec2[][] {
  return [p.outer, ...p.holes];
}

function revolvePositions(p: Profile, op: Extract<Op, { op: "revolve" }>): Float32Array {
  const N = op.segments;
  const out: number[] = [];
  for (const ring of revolveRings(p))
    for (const [x, z] of ring) {
      if (Math.abs(x) < EPS) out.push(0, 0, z);
      else
        for (let j = 0; j < N; j++) {
          const a = (TAU * j) / N;
          out.push(x * Math.cos(a), x * Math.sin(a), z);
        }
    }
  return Float32Array.from(out);
}

function revolveMesh(p: Profile, op: Extract<Op, { op: "revolve" }>): MeshData {
  const N = op.segments;
  const tris: number[] = [];
  const tags: number[] = [];
  let base = 0;
  revolveRings(p).forEach((ring, r) => {
    const g = revolveGrid(ring, N);
    const m = ring.length;
    for (let i = 0; i < m; i++) {
      const j = (i + 1) % m;
      const [x0, z0] = ring[i]!;
      const [x1, z1] = ring[j]!;
      const on0 = Math.abs(x0) < EPS;
      const on1 = Math.abs(x1) < EPS;
      if (on0 && on1) continue;
      const len = Math.hypot(x1 - x0, z1 - z0);
      const tg = r > 0 ? TAG.hole : Math.abs(x1 - x0) / len > CAP_COS ? TAG.cap : TAG.wall;
      const v = (row: number, s: number) => base + g.idx[row]! + (Math.abs(ring[row]![0]) < EPS ? 0 : s % N);
      for (let s = 0; s < N; s++) {
        // outward is toward larger turn angle on the near side, so each quad runs (i,s) (i,s+1) (j,s+1) (j,s)
        if (on0) {
          tris.push(v(i, s), v(j, s + 1), v(j, s));
          tags.push(tg);
        } else if (on1) {
          tris.push(v(i, s), v(i, s + 1), v(j, s));
          tags.push(tg);
        } else {
          tris.push(v(i, s), v(i, s + 1), v(j, s + 1), v(i, s), v(j, s + 1), v(j, s));
          tags.push(tg, tg);
        }
      }
    }
    base += g.n;
  });
  return { pos: revolvePositions(p, op), tri: Uint32Array.from(tris), tag: Uint8Array.from(tags) };
}

/** The mesh of a profile under an operation (extrude, revolve, sweep or loft). */
export function tessellate(profile: Profile, op: Op): MeshData {
  if (op.op === "revolve") return revolveMesh(orient(profile), op);
  if (op.op === "loft") return layeredMesh(layersOf(profile, op));
  return layeredMesh(layersOf(orient(profile), op));
}

/**
 * Rewrites `pos` for a profile with the same ring sizes as the one tessellated (a deforming member, D9): the triangles
 * and tags stay, only the positions follow the new rings. Returns `pos`.
 */
export function updatePositions(profile: Profile, op: Op, pos: Float32Array): Float32Array {
  const P = op.op === "revolve" ? revolvePositions(orient(profile), op) : Float32Array.from(layersOf(op.op === "loft" ? profile : orient(profile), op).pts);
  if (P.length !== pos.length) throw new Error("updatePositions: the rings changed size");
  pos.set(P);
  return pos;
}

/** Signed volume of a closed mesh, mm³ (positive when the triangles face outward). */
export function volume(m: MeshData): number {
  let v = 0;
  const p = m.pos;
  for (let i = 0; i < m.tri.length; i += 3) {
    const a = m.tri[i]! * 3;
    const b = m.tri[i + 1]! * 3;
    const c = m.tri[i + 2]! * 3;
    v += (p[a]! * (p[b + 1]! * p[c + 2]! - p[b + 2]! * p[c + 1]!) - p[a + 1]! * (p[b]! * p[c + 2]! - p[b + 2]! * p[c]!) + p[a + 2]! * (p[b]! * p[c + 1]! - p[b + 1]! * p[c]!)) / 6;
  }
  return v;
}
