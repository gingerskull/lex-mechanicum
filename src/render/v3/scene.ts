// A mechanism as the 3D renderer sees it: the package (shapes and solids), the prepared geometry (triangles and edges), the
// kinematics (a poser), and the record's teaching block. `runtime()` derives what a frame needs from them once; `place()`
// and `rows()` then turn a phase, an explode and a set of see-through solids into the solid table the shaders read.
import type { Teaching } from "../../catalog/kin";
import type { Package2 } from "../../package/format2";
import { hasFlag3 } from "../../package/format2";
import type { EdgeSet } from "../../solids/edges";
import { mat4, type Mat4 } from "../../solids/frame";
import { stretchMatrix } from "../../solids/convey";
import type { MeshData, Vec3 } from "../../solids/types";
import { DRAFT, type RoleSurface, type SurfaceKey } from "../../style/draft";
import { FORM } from "../../style/form";
import type { Ladder } from "../detail";
import { bake, BAKE, loopLength, meshBox, type Baked } from "./bake";
import type { Item3 } from "./annotate";
import type { Poser } from "./poser";

export const PLATE = new Set(["part", "plate", "bracket", "bridge", "housing", "base"]);
/** The role patterns, in the order of the pattern texture's layers. */
export const PATTERNS = ["dots", "hatch", "cross", "dash"] as const;

/** The sheet the drawing sits on: title, drawing number, sheet, and the record's origin as an Imperial date. */
export interface SheetInfo {
  title: string;
  no: string;
  sheet?: string;
  date?: string;
}

export interface Scene {
  pkg: Package2;
  meshes: MeshData[];
  edges: EdgeSet[];
  poser: Poser;
  teaching: Teaching | null;
  info: SheetInfo;
  /** Joint axes by joint id (unit, world), for axis-line overlays; the record's `kin.joints[].axis`. */
  axes?: Record<string, Vec3>;
  /** The vertex and edge arrays when the setup worker already made them (R9); else `runtime` bakes them. */
  baked?: Baked;
  /** Force and angle items per phase and the points that carry a velocity arrow (SD14): none unless the mechanism gives them. */
  items?: { forces?(u: number): Item3[]; angles?(u: number): Item3[]; velocity?: { point: string; max: number }[] };
}

/** Texels per solid in the solid table: three model rows and five style rows. */
export const ST = 8;

export interface Runtime {
  scene: Scene;
  n: number;
  baked: Baked;
  /** The solid's local box: x0, y0, z0, x1, y1, z1. */
  box: Float32Array;
  /** Solids of the base plate, and plates (by kind). */
  isBase: Uint8Array;
  isPlate: Uint8Array;
  /** Principle solids: those on a body the teaching block names (T3). */
  principle: Uint8Array;
  /** Solids whose body never moves over the cycle, found by sampling the poser. */
  fixed: Uint8Array;
  /** The radius (mm) of a round solid that turns over the cycle (SD29), else 0. */
  spin: Float32Array;
  /** The running belts' marks (SD29): per marked solid, marks per mm along it and their phase at u (in marks). */
  runs: { i: number; perMm: number; phase(u: number): number }[];
  /** The role surface per solid and its pattern layer (-1 for none). */
  surface: RoleSurface[];
  pattern: Int8Array;
  /** The explode direction (unit, world) of each solid, as posed in the last frame placed. */
  axis: Float32Array;
  /** Rest matrices (phase 0, no explode), 16 floats per solid. */
  rest: Float32Array;
}

/** a after b: (a after b)(p) = a(b(p)), column-major affine matrices. */
export function mulMat(a: Mat4, b: Mat4): Mat4 {
  const r = new Array<number>(16).fill(0) as Mat4;
  for (let c = 0; c < 4; c++)
    for (let row = 0; row < 3; row++) {
      let s = 0;
      for (let k = 0; k < 3; k++) s += a[k * 4 + row]! * b[c * 4 + k]!;
      if (c === 3) s += a[12 + row]!;
      r[c * 4 + row] = s;
    }
  r[15] = 1;
  return r;
}

export const applyMat = (m: ArrayLike<number>, p: Vec3, o = 0): Vec3 => [
  m[o]! * p[0] + m[o + 4]! * p[1] + m[o + 8]! * p[2] + m[o + 12]!,
  m[o + 1]! * p[0] + m[o + 5]! * p[1] + m[o + 9]! * p[2] + m[o + 13]!,
  m[o + 2]! * p[0] + m[o + 6]! * p[1] + m[o + 10]! * p[2] + m[o + 14]!,
];

export function runtime(scene: Scene): Runtime {
  const { pkg, poser } = scene;
  const n = pkg.solids.length;
  const baked = scene.baked ?? bake(pkg, scene.meshes, scene.edges, pkg.shapes.length ? pkg.shapes : scene.meshes.map(() => ({})), BAKE);
  const isBase = new Uint8Array(n);
  const isPlate = new Uint8Array(n);
  const principle = new Uint8Array(n);
  const fixed = new Uint8Array(n);
  const spin = new Float32Array(n);
  const roundR = scene.meshes.map(roundRadius);
  // a ball: round about its z and as tall as it is wide, so it is round about every axis
  const ball = scene.meshes.map((m, k) => {
    const R = roundR[k] ?? 0;
    if (!m || !R) return false;
    const b = meshBox(m);
    return Math.abs(b[5] - b[2] - 2 * R) < 0.05 * R;
  });
  const pattern = new Int8Array(n);
  const surface: RoleSurface[] = [];
  const axis = new Float32Array(n * 3);
  const rest = new Float32Array(n * 16);
  const bodies = new Set((scene.teaching?.principle ?? []).map((p) => p.body).filter((b): b is string => !!b));
  const phases = [0, 1, 2, 3.5];
  const turning = new Uint8Array(n);
  pkg.solids.forEach((s, i) => {
    isBase[i] = hasFlag3(s, "isBase") ? 1 : 0;
    isPlate[i] = PLATE.has(s.kind) && s.role !== "trace" ? 1 : 0;
    principle[i] = bodies.has(s.body) ? 1 : 0;
    const R: RoleSurface = (isBase[i] ? DRAFT.role.base : DRAFT.role[s.role as SurfaceKey]) ?? DRAFT.role.link;
    surface.push(R);
    pattern[i] = R.pattern && R.pattern !== "none" ? PATTERNS.indexOf(R.pattern as (typeof PATTERNS)[number]) : -1;
    const M0 = poser.place(s, 0);
    const m = mulMat(M0, mat4(s.fr));
    rest.set(m, i * 16);
    // the explode axis: the solid's own axis in the world (a lifted solid explodes along the base z, as before)
    const z: Vec3 = s.legacyAxis ? [0, 0, 1] : [m[8]!, m[9]!, m[10]!];
    const l = Math.hypot(...z) || 1;
    axis.set([z[0] / l, z[1] / l, z[2] / l], i * 3);
    let still = 1;
    let turns = false;
    for (const u of phases) {
      const q = poser.place(s, u);
      for (let k = 0; k < 16; k++) if (Math.abs(q[k]! - M0[k]!) > 1e-6) still = 0;
      // turning: the local x swings round (a part that only slides keeps it); a ball turns about any axis, so its z
      // swinging counts too (one rolling about its own x keeps x), while a round part that only swings across its axis
      // (a steered wheel, a rocking cylinder) does not turn
      const w = mulMat(q, mat4(s.fr));
      if (Math.abs(w[0]! - m[0]!) + Math.abs(w[1]! - m[1]!) + Math.abs(w[2]! - m[2]!) > 1e-3) turns = true;
      if (ball[s.shape] && Math.abs(w[8]! - m[8]!) + Math.abs(w[9]! - m[9]!) + Math.abs(w[10]! - m[10]!) > 1e-3) turns = true;
    }
    fixed[i] = still;
    turning[i] = turns ? 1 : 0;
  });
  // like parts handed on round a circuit (a body's `next`) are one part at as many places: they all turn if one does,
  // since each turns only where it is on the circuit, which the few phases sampled may miss
  const handed = new Set<string>();
  const turned = new Set(pkg.solids.filter((_, i) => turning[i]).map((s) => s.body));
  for (const s of pkg.solids) {
    const ring: string[] = [];
    for (let b: string | undefined = s.body; b && !ring.includes(b); b = poser.next?.(b)) ring.push(b);
    if (ring.length > 1 && ring.some((b) => turned.has(b))) for (const b of ring) handed.add(b);
  }
  pkg.solids.forEach((s, i) => {
    spin[i] = (turning[i] || handed.has(s.body)) && !s.stretch ? (roundR[s.shape] ?? 0) : 0;
  });
  return { scene, n, baked, box: baked.box, isBase, isPlate, principle, fixed, spin, runs: beltRuns(scene), surface, pattern, axis, rest };
}

/**
 * How many marks go round a running belt L mm long that travels T mm over a cycle, and the factor on its travel that
 * brings them back in step after the cycle (SD29): a whole number round it, spaced within `draft.spin.belt`, the count
 * whose cycle's travel comes nearest a whole number of marks (nearest `spin.pitch` apart on a tie). The marks slip on
 * the belt by that much, a percent or so; a belt that comes back where it started needs none.
 */
export function runMarks(L: number, T: number): { n: number; k: number } {
  const [p0, p1] = DRAFT.spin.belt;
  const near = Math.max(1, Math.round(L / DRAFT.spin.pitch));
  if (Math.abs(T) < 1e-6) return { n: near, k: 1 };
  let best = { n: near, k: Math.max(1, Math.round((T * near) / L)) / ((T * near) / L), e: Infinity };
  for (let n = Math.max(1, Math.ceil(L / p1)); n <= Math.floor(L / p0); n++) {
    const m = (T * n) / L;
    const r = Math.round(m);
    if (!r) continue;
    const e = Math.abs(m - r) / Math.abs(m) + Math.abs(L / n - DRAFT.spin.pitch) * 1e-9;
    if (e < best.e) best = { n, k: r / m, e };
  }
  return { n: best.n, k: best.k };
}

/** The marks of every running belt (Solid3.run): its band stands still and the marks move round its pitch path. */
function beltRuns(scene: Scene): Runtime["runs"] {
  const { pkg, poser } = scene;
  const TAU = 2 * Math.PI;
  const out: Runtime["runs"] = [];
  pkg.solids.forEach((s, i) => {
    if (!s.run) return;
    const { tr, key } = s.run;
    // its travel (mm) at phase u, counted on through whole cycles
    let travel: (u: number) => number;
    if (tr && tr.length > 1) {
      const N = tr.length - 1;
      const T = tr[N]! - tr[0]!;
      travel = (u) => {
        const c = Math.floor(u / TAU);
        const x = ((u - c * TAU) / TAU) * N;
        const k = Math.min(N - 1, Math.floor(x));
        return tr[k]! + (tr[k + 1]! - tr[k]!) * (x - k) + c * T;
      };
    } else if (key && poser.value) travel = (u) => poser.value!(u, key) ?? 0;
    else return;
    const L = loopLength(s.run.path);
    if (L <= 0) return;
    const t0 = travel(0);
    const { n, k } = runMarks(L, travel(TAU) - t0);
    const perMm = n / L;
    out.push({ i, perMm, phase: (u) => (travel(u) - t0) * k * perMm });
  });
  return out;
}

/**
 * The outer radius of a shape round its local z axis when its outline is round, else 0: no point in the band
 * DRAFT.spin.round of that radius at a height where the outline reaches it (a gear's teeth or a cam's flank, beside its
 * rim), and its widest ring going all round; a ball's or a crowned roller's points in the band lie above and below
 * its widest ring, and it is round.
 */
function roundRadius(m: MeshData | undefined): number {
  if (!m) return 0;
  const p = m.pos;
  let R = 0;
  for (let k = 0; k < p.length; k += 3) R = Math.max(R, Math.hypot(p[k]!, p[k + 1]!));
  if (R <= 0) return 0;
  const [lo, hi] = DRAFT.spin.round;
  const level = (z: number) => Math.round(z * 100);
  const rim = new Set<number>();
  for (let k = 0; k < p.length; k += 3) if (Math.hypot(p[k]!, p[k + 1]!) > 0.995 * R) rim.add(level(p[k + 2]!));
  for (let k = 0; k < p.length; k += 3) {
    const r = Math.hypot(p[k]!, p[k + 1]!) / R;
    if (r > lo && r < hi && rim.has(level(p[k + 2]!))) return 0;
  }
  // and its widest ring goes all round, with no gap wider than DRAFT.spin.gap (a square or a hexagon has its corners
  // alone at the widest radius)
  const angs: number[] = [];
  for (let k = 0; k < p.length; k += 3) if (Math.hypot(p[k]!, p[k + 1]!) > 0.995 * R) angs.push(Math.atan2(p[k + 1]!, p[k]!));
  angs.sort((a, b) => a - b);
  let gap = angs.length ? angs[0]! + 2 * Math.PI - angs[angs.length - 1]! : 2 * Math.PI;
  for (let k = 1; k < angs.length; k++) gap = Math.max(gap, angs[k]! - angs[k - 1]!);
  return gap <= (DRAFT.spin.gap * Math.PI) / 180 ? R : 0;
}

/** The world matrices of every solid at phase u and explode e (0..1): body pose, frame, stretch, then the explode shift. */
export function place(rt: Runtime, u: number, explode: number, out: Float32Array): void {
  const { scene } = rt;
  const gap = FORM.explode.gap * explode;
  scene.pkg.solids.forEach((s, i) => {
    const B = scene.poser.place(s, u);
    let M: Mat4 = mulMat(B, mat4(s.fr));
    if (gap && s.ex) {
      // the direction it leaves along as posed (E10): its unit's axis in its body's frame, so a part that swings explodes
      // along its axis where it is now; without one, its own axis
      // a conveyed part (a ball round its circuit, a chain link) is posed along its path: its unit's direction as built
      const a = s.exAxis;
      const d: Vec3 = a && s.cv ? [a[0], a[1], a[2]] : a ? [B[0]! * a[0] + B[4]! * a[1] + B[8]! * a[2], B[1]! * a[0] + B[5]! * a[1] + B[9]! * a[2], B[2]! * a[0] + B[6]! * a[1] + B[10]! * a[2]] : s.legacyAxis ? [0, 0, 1] : [M[8]!, M[9]!, M[10]!];
      const l = Math.hypot(d[0], d[1], d[2]) || 1;
      rt.axis.set([d[0] / l, d[1] / l, d[2] / l], i * 3);
    }
    if (s.stretch) {
      // between its two points as solved: at the first, x toward the second, its unit length scaled to the span
      // ends held at the heights the build gave them (a rope part in its sheaves' planes)
      const atZ = (p: [Vec3, Vec3] | null | undefined): [Vec3, Vec3] | null | undefined => (p && s.sz ? [[p[0][0], p[0][1], s.sz[0]], [p[1][0], p[1][1], s.sz[1]]] : p);
      const e = atZ(scene.poser.ends?.(u, s.stretch[0], s.stretch[1]));
      const e0 = atZ(scene.poser.refEnds?.(s.stretch[0], s.stretch[1]));
      if (e && e0) M = stretchMatrix(e[0], e[1], e0[0], e0[1], mat4(s.fr)) as Mat4;
      else {
        const L = scene.poser.span(u, s.stretch[0], s.stretch[1]);
        if (L !== null) for (let k = 0; k < 3; k++) M[k] = M[k]! * L;
      }
    }
    if (gap && s.ex) {
      const d = gap * s.ex;
      M[12] = M[12]! + rt.axis[i * 3]! * d;
      M[13] = M[13]! + rt.axis[i * 3 + 1]! * d;
      M[14] = M[14]! + rt.axis[i * 3 + 2]! * d;
    }
    out.set(M, i * 16);
  });
}

/** The world box of solid i under the matrices (x0, y0, z0, x1, y1, z1). */
export function worldBox(rt: Runtime, mats: ArrayLike<number>, i: number, out: number[] = []): number[] {
  const b = rt.box;
  const o = i * 6;
  out[0] = out[1] = out[2] = Infinity;
  out[3] = out[4] = out[5] = -Infinity;
  for (const x of [b[o]!, b[o + 3]!])
    for (const y of [b[o + 1]!, b[o + 4]!])
      for (const z of [b[o + 2]!, b[o + 5]!]) {
        const p = applyMat(mats, [x, y, z], i * 16);
        for (let k = 0; k < 3; k++) {
          if (p[k]! < out[k]!) out[k] = p[k]!;
          if (p[k]! > out[k + 3]!) out[k + 3] = p[k]!;
        }
      }
  return out;
}

export interface RowState {
  /** Per solid, how far it is drawn see-through (L5, T10), 0..1: 1 outright, between while it eases in or out. */
  see: ArrayLike<number>;
  ladder: Ladder;
  /** A library card: its two bold outlines are thinner (SD16). */
  card: boolean;
  /** The role patterns are drawn (rung F not dropped). */
  patterns: boolean;
  /** The phase (radians), for the marks on a running belt; 0 when omitted. */
  u?: number;
}

/** The solid table's rows (ST * 4 floats per solid): model rows 0 to 2, then face, pattern, flags, widths. */
export function rows(rt: Runtime, mats: Float32Array, st: RowState, table: Float32Array): void {
  const F = DRAFT.fill;
  const L = DRAFT.lines;
  const cardK = st.card ? { plate: DRAFT.card.plateTopFactor, base: DRAFT.card.baseTopFactor } : { plate: 1, base: 1 };
  rt.scene.pkg.solids.forEach((s, i) => {
    const o = i * ST * 4;
    const b = i * 16;
    for (let r = 0; r < 3; r++) table.set([mats[b + r]!, mats[b + 4 + r]!, mats[b + 8 + r]!, mats[b + 12 + r]!], o + r * 4);
    const base = rt.isBase[i] === 1;
    const plate = rt.isPlate[i] === 1;
    const a = hasFlag3(s, "seeThrough") ? 1 : Math.max(0, Math.min(1, st.see[i] ?? 0));
    const f = 1 + (F.seeThrough.opacity - 1) * a;
    const occ = (base ? F.occlude.base : plate ? F.occlude.plate : F.occlude.other) * (1 + (F.seeThrough.occlude - 1) * a);
    const face = (base ? F.base : plate ? F.plate : F.other) * f;
    const wallA = F.wall * (base ? F.baseWallGain : 1) * f;
    const R = rt.surface[i]!;
    const pat = rt.pattern[i]!;
    const kx = s.stretch ? Math.hypot(mats[b]!, mats[b + 1]!, mats[b + 2]!) || 1 : 1;
    // the walls take the same see-through share as the faces: a part reads as one solid at one opacity
    table.set([face, wallA, Math.min(1, occ), Math.min(1, occ * F.wallOcclude)], o + 12);
    const tint = (R.tint ?? 0) + Math.max(0, F.seeThrough.tint - (R.tint ?? 0)) * a;
    table.set([tint, st.patterns && pat >= 0 ? (R.alpha ?? 0) : 0, Math.max(0, pat), R.step ?? 1], o + 16);
    table.set([hasFlag3(s, "faint") ? 0.5 : 1, base ? 1 : 0, plate ? 1 : 0, a], o + 20);
    const top = base ? L.baseTop * cardK.base : plate ? L.plateTop * cardK.plate : L.otherTop;
    table.set([top, st.ladder.solid(s.detail) ? 0 : 1, kx, 0], o + 24);
    // rulings on a turning round part (SD29): its radius, the count round it, their alpha
    const sr = st.patterns ? rt.spin[i]! : 0;
    const [c0, c1] = DRAFT.spin.count;
    const count = sr ? Math.max(c0, Math.min(c1, 4 * Math.round((2 * Math.PI * sr) / DRAFT.spin.pitch / 4))) : 0;
    table.set([sr, count, sr ? DRAFT.spin.alpha : 0, Math.min(DRAFT.spin.bandMax, DRAFT.spin.band * sr)], o + 28);
  });
  // a running belt's marks (SD29), drawn wherever the role patterns are: marks per mm along it and their phase
  if (st.patterns)
    for (const r of rt.runs) {
      const ph = r.phase(st.u ?? 0);
      table.set([0, r.perMm, DRAFT.spin.alpha, ph - Math.floor(ph)], r.i * ST * 4 + 28);
    }
}
