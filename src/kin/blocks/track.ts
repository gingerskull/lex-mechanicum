// Composite track: a fixed slot's centre line made of tangent arcs and lines (G1 by construction), exact per segment.
// One geometry for the `target-path` block that runs a point along it, the K1 residual that keeps a pin on it, the
// record validator and the builder that cuts its groove. The track lies in a plane: in its own coordinates it starts
// at (0, 0) heading along +x; a segment of signed curvature k (1/radius, + turning left, counter-clockwise seen from
// the plane's normal) and length L follows on from the last one's end and heading.
import { type Vec3, v3 } from "../math";

export type Vec2 = [number, number];

/** The record's form of a track (data/catalog/record-spec.md, "Joints"): numbers may be parameter expressions. */
export interface TrackSpec {
  /** The start of the centre line; it lies in the plane through the joint's `at` square to its axis. */
  start: unknown[];
  /** The direction at the start: a vector, or degrees about the axis from world x (from world y if the axis is along x). */
  dir: unknown;
  /** In order from the start: `length` (mm), or `angle` (degrees turned) on an arc; `radius` (signed, + turning left) or `curvature` (1/mm); a line has neither. */
  segments: { length?: unknown; radius?: unknown; curvature?: unknown; angle?: unknown }[];
}

/** One segment in the plane: its start, heading (radians), signed curvature (1/mm, 0 a line), length and travel at its start. */
export interface TrackSeg {
  p0: Vec2;
  h0: number;
  k: number;
  L: number;
  s0: number;
}

export interface Track {
  segs: TrackSeg[];
  length: number;
}

/** A point of the track: its place, heading (radians) and curvature. */
export interface TrackPoint {
  p: Vec2;
  h: number;
  k: number;
}

/** The nearest point of the track: its travel, place, unsigned distance and signed offset (+ left of the way it runs). */
export interface TrackNearest {
  s: number;
  p: Vec2;
  d: number;
  off: number;
}

const LINE = 1e-12;
const TAU = 2 * Math.PI;
const mod = (a: number, m: number): number => ((a % m) + m) % m;

/** A track in the plane from its start, heading (radians) and segments ({ k, L }), each following on from the last. */
export function track(start: Vec2, heading: number, segs: { k: number; L: number }[]): Track {
  const out: TrackSeg[] = [];
  let p: Vec2 = [start[0], start[1]];
  let h = heading;
  let s = 0;
  for (const g of segs) {
    const seg: TrackSeg = { p0: p, h0: h, k: Math.abs(g.k) < LINE ? 0 : g.k, L: g.L, s0: s };
    out.push(seg);
    const e = segAt(seg, g.L);
    p = e.p;
    h = e.h;
    s += g.L;
  }
  return { segs: out, length: s };
}

/** The point at local travel t along one segment (not clamped). */
function segAt(g: TrackSeg, t: number): TrackPoint {
  if (g.k === 0) return { p: [g.p0[0] + t * Math.cos(g.h0), g.p0[1] + t * Math.sin(g.h0)], h: g.h0, k: 0 };
  const h = g.h0 + g.k * t;
  const r = 1 / g.k;
  return { p: [g.p0[0] + r * (Math.sin(h) - Math.sin(g.h0)), g.p0[1] - r * (Math.cos(h) - Math.cos(g.h0))], h, k: g.k };
}

/** The point at travel s from the start (clamped to the track's ends). */
export function trackAt(t: Track, s: number): TrackPoint {
  const x = Math.min(t.length, Math.max(0, s));
  let g = t.segs[0]!;
  for (const q of t.segs) if (x >= q.s0) g = q;
  return segAt(g, Math.min(g.L, x - g.s0));
}

/** The unit tangent at travel s. */
export const trackTangent = (t: Track, s: number): Vec2 => {
  const h = trackAt(t, s).h;
  return [Math.cos(h), Math.sin(h)];
};

/** The nearest point of one segment to q, as a local travel. */
function segNearest(g: TrackSeg, q: Vec2): number {
  const cands = [0, g.L];
  if (g.k === 0) {
    const t = (q[0] - g.p0[0]) * Math.cos(g.h0) + (q[1] - g.p0[1]) * Math.sin(g.h0);
    if (t > 0 && t < g.L) cands.push(t);
  } else {
    // the circle's centre, and the heading at which the point on it lies toward q
    const r = 1 / g.k;
    const c: Vec2 = [g.p0[0] - r * Math.sin(g.h0), g.p0[1] + r * Math.cos(g.h0)];
    const phi = Math.atan2(q[1] - c[1], q[0] - c[0]);
    const delta = phi + Math.sign(g.k) * (Math.PI / 2) - g.h0;
    const sweep = g.k * g.L;
    if (g.k > 0) {
      const m = mod(delta, TAU);
      if (m <= sweep) cands.push(m / g.k);
    } else {
      const m = -mod(-delta, TAU);
      if (m >= sweep) cands.push(m / g.k);
    }
  }
  let best = 0;
  let bd = Infinity;
  for (const t of cands) {
    const p = segAt(g, t).p;
    const d = Math.hypot(q[0] - p[0], q[1] - p[1]);
    if (d < bd - 1e-15) {
      bd = d;
      best = t;
    }
  }
  return best;
}

/** The nearest point of the track to q: exact per segment, the first on a tie. */
export function trackNearest(t: Track, q: Vec2): TrackNearest {
  let best: TrackNearest | null = null;
  for (const g of t.segs) {
    const loc = segNearest(g, q);
    const pt = segAt(g, loc);
    const dx = q[0] - pt.p[0];
    const dy = q[1] - pt.p[1];
    const d = Math.hypot(dx, dy);
    if (!best || d < best.d - 1e-15) {
      const lateral = -dx * Math.sin(pt.h) + dy * Math.cos(pt.h);
      best = { s: g.s0 + loc, p: pt.p, d, off: lateral < 0 ? -d : d };
    }
  }
  return best!;
}

/**
 * The curve at a signed offset from the track (+ to the left), from travel s0 to s1 (default the whole track), as a
 * polyline whose chords leave the true curve by no more than `sag` (mm). Every segment junction is a vertex.
 */
export function trackOffset(t: Track, off: number, sag = 0.01, s0 = 0, s1 = t.length): Vec2[] {
  const out: Vec2[] = [];
  const push = (s: number) => {
    const q = trackAt(t, s);
    const p: Vec2 = [q.p[0] - off * Math.sin(q.h), q.p[1] + off * Math.cos(q.h)];
    const last = out[out.length - 1];
    if (!last || Math.hypot(p[0] - last[0], p[1] - last[1]) > 1e-9) out.push(p);
  };
  for (const g of t.segs) {
    const a = Math.max(s0, g.s0);
    const b = Math.min(s1, g.s0 + g.L);
    if (b < a) continue;
    // on an arc the offset curve is an arc of radius |1/k − off|; its chord's sag is r (1 − cos(dθ/2))
    let n = 1;
    if (g.k !== 0) {
      const r = Math.abs(1 / g.k - off);
      const dTh = r > sag ? 2 * Math.acos(1 - sag / r) : Math.PI / 8;
      n = Math.max(1, Math.ceil((Math.abs(g.k) * (b - a)) / Math.min(dTh, Math.PI / 8)));
    }
    for (let i = 0; i <= n; i++) push(a + ((b - a) * i) / n);
  }
  return out;
}

/** The track in 3D: its plane (origin at the start, x the start direction, n the normal) and the track in that plane. */
export interface Track3 {
  o: Vec3;
  x: Vec3;
  y: Vec3;
  n: Vec3;
  t: Track;
}

/** A point's coordinates in the track's plane, and its height off it along the normal. */
export function toPlane(T: Track3, p: Vec3): { uv: Vec2; w: number } {
  const d = v3.sub(p, T.o);
  return { uv: [v3.dot(d, T.x), v3.dot(d, T.y)], w: v3.dot(d, T.n) };
}

/** The world point of plane coordinates uv, w along the normal. */
export const fromPlane = (T: Track3, uv: Vec2, w = 0): Vec3 => v3.add(T.o, v3.add(v3.mul(T.x, uv[0]), v3.add(v3.mul(T.y, uv[1]), v3.mul(T.n, w))));

/** The world point at travel s. */
export const track3At = (T: Track3, s: number): Vec3 => fromPlane(T, trackAt(T.t, s).p);

/** The pin's miss of the track, in the plane (its height along the normal is not counted, as an arc slot's is not): signed, + left. */
export const trackMiss = (T: Track3, p: Vec3): number => trackNearest(T.t, toPlane(T, p).uv).off;

/**
 * What is wrong with a track as the record gives it (empty when nothing is), at the values `num` gives its numbers. The
 * pin's `at`, when given, must lie on the track.
 */
export function trackProblems(spec: unknown, num: (v: unknown) => number, vec: (v: unknown) => Vec3, at?: Vec3, axis: Vec3 = [0, 0, 1]): string[] {
  const out: string[] = [];
  const sp = spec as Partial<TrackSpec> | undefined;
  if (!sp || typeof sp !== "object") return ["a track must be { start, dir, segments }"];
  if (!Array.isArray(sp.start) || sp.start.length < 2) out.push("track.start must be [x, y] or [x, y, z]");
  if (sp.dir === undefined) out.push("track.dir must be a direction [x, y, z?] or an angle in degrees");
  if (!Array.isArray(sp.segments) || !sp.segments.length) out.push("track.segments must list at least one segment");
  if (out.length) return out;
  sp.segments!.forEach((g, i) => {
    const at = `track segment ${i + 1}`;
    if (!g || typeof g !== "object") return void out.push(`${at} must be { length } or { radius | curvature, length | angle }`);
    if (g.radius !== undefined && g.curvature !== undefined) out.push(`${at} gives both radius and curvature`);
    if (g.length !== undefined && g.angle !== undefined) out.push(`${at} gives both length and angle`);
    if (g.length === undefined && g.angle === undefined) out.push(`${at} needs a length (or, on an arc, an angle)`);
    try {
      const k = curvatureOf(g, num);
      if (g.angle !== undefined && k === 0) out.push(`${at}: an angle needs a radius or curvature`);
      const L = lengthOf(g, k, num);
      if (!(L > 0) || !Number.isFinite(L)) out.push(`${at}: length must be a positive number (got ${L})`);
    } catch (e) {
      out.push(`${at}: ${(e as Error).message}`);
    }
  });
  if (out.length) return out;
  let T: Track3;
  try {
    T = resolveTrack(sp, num, vec, at ?? vec(sp.start), axis);
  } catch (e) {
    return [(e as Error).message];
  }
  if (at) {
    const near = trackNearest(T.t, toPlane(T, at).uv);
    if (near.d > 1e-6) out.push(`the pin (at) is ${near.d.toPrecision(3)} mm off its track; the nearest point is at travel ${near.s.toFixed(3)}`);
  }
  return out;
}

function curvatureOf(g: TrackSpec["segments"][number], num: (v: unknown) => number): number {
  if (g.curvature !== undefined) {
    const k = num(g.curvature);
    if (!Number.isFinite(k)) throw new Error("curvature must be a number");
    return k;
  }
  if (g.radius !== undefined) {
    const r = num(g.radius);
    if (!Number.isFinite(r) || r === 0) throw new Error("radius must be a non-zero number (signed: + turns left)");
    return 1 / r;
  }
  return 0;
}

function lengthOf(g: TrackSpec["segments"][number], k: number, num: (v: unknown) => number): number {
  if (g.angle !== undefined) return ((Math.abs(num(g.angle)) * Math.PI) / 180) / Math.abs(k);
  return num(g.length);
}

/**
 * The record's track in 3D: its plane goes through the joint's `at` square to the joint's axis; the start is projected
 * into it, the start direction made square to the axis. Throws on a track it cannot build.
 */
export function resolveTrack(spec: unknown, num: (v: unknown) => number, vec: (v: unknown) => Vec3, at: Vec3, axis: Vec3): Track3 {
  const sp = spec as TrackSpec;
  if (!sp || !Array.isArray(sp.start) || !Array.isArray(sp.segments) || !sp.segments.length) throw new Error("a track must be { start, dir, segments }");
  const n = v3.unit(axis);
  const p0 = vec(sp.start);
  const o = v3.add(p0, v3.mul(n, v3.dot(v3.sub(at, p0), n)));
  let d: Vec3;
  if (Array.isArray(sp.dir)) d = vec(sp.dir);
  else {
    // an angle about the axis from world x (from world y where the axis runs along x)
    const ref: Vec3 = Math.abs(n[0]) > 0.9 ? [0, 1, 0] : [1, 0, 0];
    const e1 = v3.unit(v3.perp(ref, n));
    const e2 = v3.cross(n, e1);
    const a = (num(sp.dir) * Math.PI) / 180;
    d = v3.add(v3.mul(e1, Math.cos(a)), v3.mul(e2, Math.sin(a)));
  }
  const xd = v3.perp(d, n);
  if (v3.len(xd) < 1e-9) throw new Error("track.dir runs along the joint's axis");
  const x = v3.unit(xd);
  const y = v3.cross(n, x);
  const segs = sp.segments.map((g) => {
    const k = curvatureOf(g, num);
    const L = lengthOf(g, k, num);
    if (!(L > 0)) throw new Error("a track segment's length must be positive");
    return { k, L };
  });
  return { o, x, y, n, t: track([0, 0], 0, segs) };
}
