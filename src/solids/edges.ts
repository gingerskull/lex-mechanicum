// Drafting edges of a shape (style SD3): the lines the renderer classifies by depth. Found once at setup, per shape (not
// per solid: identical hardware shares them), in the shape's local frame.
//
//   cap:    between a cap face and a wall: the outline of the face, chained into rings so a hidden line's dashes run
//           along the ring (cumulative length at each end).
//   crease: between two walls meeting at more than CREASE: a corner, drawn where either wall faces the viewer.
//   smooth: between two walls meeting at less than CREASE: drawn only where one faces the viewer and the other does not
//           (the silhouette of a round wall).
//   mark:   a line engraved on the top face, drawn where the top faces the viewer.
//
// A plain extrusion (no twist, no taper) gets its edges straight from the profile, with no mesh and no adjacency search;
// any other shape gets them from its mesh. Pure functions: they run on the main thread or in a worker.
import { type Vec2 } from "../core/geom";
import { orient } from "./tessellate";
import { TAG, type MeshData, type Op, type Profile } from "./types";

export const EDGE = { cap: 0, crease: 1, smooth: 2, mark: 3 } as const;
/** Floats per edge: a (3), b (3), n1 (3), n2 (3), cumulative length at a and b, kind, flags. */
export const EF = 16;
/** Flag bits: the cap is the top one (its normal has a positive z); the edge belongs to a hole. */
export const EFLAG = { top: 1, hole: 2 } as const;

const CREASE = Math.cos((30 * Math.PI) / 180);
const FLAT = Math.cos((0.5 * Math.PI) / 180);

export interface EdgeSet {
  data: Float32Array;
  n: number;
}

class Out {
  d: number[] = [];
  push(ax: number, ay: number, az: number, bx: number, by: number, bz: number, n1: readonly number[], n2: readonly number[], cA: number, cB: number, kind: number, flags: number) {
    this.d.push(ax, ay, az, bx, by, bz, n1[0]!, n1[1]!, n1[2]!, n2[0]!, n2[1]!, n2[2]!, cA, cB, kind, flags);
  }
  done(): EdgeSet {
    return { data: Float32Array.from(this.d), n: this.d.length / EF };
  }
}

/** Mark lines on the top face at height z, in the order they were given. */
function pushMarks(out: Out, marks: { pts: Vec2[] }[], z: number, scale: number, turn: number) {
  const up = [0, 0, 1];
  const c = Math.cos(turn) * scale;
  const s = Math.sin(turn) * scale;
  for (const m of marks) {
    let cum = 0;
    for (let k = 0; k + 1 < m.pts.length; k++) {
      const p = m.pts[k]!;
      const q = m.pts[k + 1]!;
      const L = Math.hypot(q[0] - p[0], q[1] - p[1]) * scale;
      out.push(c * p[0] - s * p[1], s * p[0] + c * p[1], z, c * q[0] - s * q[1], s * q[0] + c * q[1], z, up, up, cum, cum + L, EDGE.mark, EFLAG.top);
      cum += L;
    }
  }
}

/** Edges of a plain extrusion from its profile: the cap rings at both ends and the corners up the walls. */
export function edgesOfExtrude(profile: Profile, op: Extract<Op, { op: "extrude" }>, marks: { pts: Vec2[] }[]): EdgeSet {
  const p = orient(profile);
  const out = new Out();
  const h = op.h;
  [p.outer, ...p.holes].forEach((ring, r) => {
    const n = ring.length;
    const nx = new Float64Array(n);
    const ny = new Float64Array(n);
    const len = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      const a = ring[i]!;
      const b = ring[(i + 1) % n]!;
      const dx = b[0] - a[0];
      const dy = b[1] - a[1];
      const l = Math.hypot(dx, dy) || 1;
      len[i] = l;
      nx[i] = dy / l;
      ny[i] = -dx / l;
    }
    const fl = r ? EFLAG.hole : 0;
    let cum = 0;
    for (let i = 0; i < n; i++) {
      const a = ring[i]!;
      const b = ring[(i + 1) % n]!;
      const wall = [nx[i]!, ny[i]!, 0];
      out.push(a[0], a[1], 0, b[0], b[1], 0, [0, 0, -1], wall, cum, cum + len[i]!, EDGE.cap, fl);
      out.push(a[0], a[1], h, b[0], b[1], h, [0, 0, 1], wall, cum, cum + len[i]!, EDGE.cap, fl | EFLAG.top);
      cum += len[i]!;
    }
    for (let i = 0; i < n; i++) {
      const j = (i + n - 1) % n;
      const d = nx[j]! * nx[i]! + ny[j]! * ny[i]!;
      if (d > FLAT) continue;
      const a = ring[i]!;
      out.push(a[0], a[1], 0, a[0], a[1], h, [nx[j]!, ny[j]!, 0], [nx[i]!, ny[i]!, 0], 0, h, d < CREASE ? EDGE.crease : EDGE.smooth, 0);
    }
  });
  pushMarks(out, marks, h, 1, 0);
  return out.done();
}

/** Edges found from a mesh and its tags: any shape, at the price of an adjacency search. */
/** Where the top face lies, for the mark lines: its height, and the scale and turn (radians) of its profile there. */
export interface Top {
  z: number;
  scale: number;
  turn: number;
}

export function edgesOfMesh(m: MeshData, marks: { pts: Vec2[] }[] = [], top: Top = { z: 0, scale: 1, turn: 0 }): EdgeSet {
  const { pos, tri, tag } = m;
  const nt = tag.length;
  const N = new Float32Array(nt * 3);
  for (let t = 0; t < nt; t++) {
    const a = tri[3 * t]!;
    const b = tri[3 * t + 1]!;
    const c = tri[3 * t + 2]!;
    const ux = pos[3 * b]! - pos[3 * a]!, uy = pos[3 * b + 1]! - pos[3 * a + 1]!, uz = pos[3 * b + 2]! - pos[3 * a + 2]!;
    const vx = pos[3 * c]! - pos[3 * a]!, vy = pos[3 * c + 1]! - pos[3 * a + 1]!, vz = pos[3 * c + 2]! - pos[3 * a + 2]!;
    const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    const l = Math.hypot(nx, ny, nz) || 1;
    N[3 * t] = nx / l;
    N[3 * t + 1] = ny / l;
    N[3 * t + 2] = nz / l;
  }
  const nv = pos.length / 3;
  const first = new Map<number, number>();
  const pairs: number[] = [];
  for (let t = 0; t < nt; t++)
    for (let k = 0; k < 3; k++) {
      const a = tri[3 * t + k]!;
      const b = tri[3 * t + ((k + 1) % 3)]!;
      const key = a < b ? a * nv + b : b * nv + a;
      const o = first.get(key);
      if (o === undefined) first.set(key, t);
      else pairs.push(Math.min(a, b), Math.max(a, b), o, t);
    }
  const out = new Out();
  const caps: { a: number; b: number; cap: number; wall: number; flags: number }[] = [];
  const nrm = (t: number) => [N[3 * t]!, N[3 * t + 1]!, N[3 * t + 2]!] as const;
  for (let i = 0; i < pairs.length; i += 4) {
    const a = pairs[i]!, b = pairs[i + 1]!, t1 = pairs[i + 2]!, t2 = pairs[i + 3]!;
    const c1 = tag[t1] === TAG.cap;
    const c2 = tag[t2] === TAG.cap;
    if (c1 && c2) continue;
    if (c1 || c2) {
      const cap = c1 ? t1 : t2;
      const wall = c1 ? t2 : t1;
      caps.push({ a, b, cap, wall, flags: (N[3 * cap + 2]! > 0 ? EFLAG.top : 0) | (tag[wall] === TAG.hole ? EFLAG.hole : 0) });
      continue;
    }
    const d = N[3 * t1]! * N[3 * t2]! + N[3 * t1 + 1]! * N[3 * t2 + 1]! + N[3 * t1 + 2]! * N[3 * t2 + 2]!;
    if (d > FLAT) continue;
    const L = Math.hypot(pos[3 * b]! - pos[3 * a]!, pos[3 * b + 1]! - pos[3 * a + 1]!, pos[3 * b + 2]! - pos[3 * a + 2]!);
    out.push(pos[3 * a]!, pos[3 * a + 1]!, pos[3 * a + 2]!, pos[3 * b]!, pos[3 * b + 1]!, pos[3 * b + 2]!, nrm(t1), nrm(t2), 0, L, d < CREASE ? EDGE.crease : EDGE.smooth, 0);
  }
  // cap edges chained into rings: the distance along the ring at each end, for dashes
  const at = new Map<number, number[]>();
  caps.forEach((e, i) => {
    for (const v of [e.a, e.b]) {
      const l = at.get(v);
      if (l) l.push(i);
      else at.set(v, [i]);
    }
  });
  const done = new Uint8Array(caps.length);
  for (let s = 0; s < caps.length; s++) {
    if (done[s]) continue;
    let i = s;
    let v = caps[s]!.a;
    let cum = 0;
    while (i >= 0 && !done[i]) {
      done[i] = 1;
      const e = caps[i]!;
      const w = e.a === v ? e.b : e.a;
      const L = Math.hypot(pos[3 * w]! - pos[3 * v]!, pos[3 * w + 1]! - pos[3 * v + 1]!, pos[3 * w + 2]! - pos[3 * v + 2]!);
      out.push(pos[3 * v]!, pos[3 * v + 1]!, pos[3 * v + 2]!, pos[3 * w]!, pos[3 * w + 1]!, pos[3 * w + 2]!, nrm(e.cap), nrm(e.wall), cum, cum + L, EDGE.cap, e.flags);
      cum += L;
      v = w;
      i = (at.get(v) ?? []).find((j) => !done[j] && caps[j]!.flags === e.flags) ?? -1;
    }
  }
  pushMarks(out, marks, top.z, top.scale, top.turn);
  return out.done();
}
