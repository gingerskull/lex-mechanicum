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
import { bake, BAKE, type Baked } from "./bake";
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
  /** The role surface per solid and its pattern layer (-1 for none). */
  surface: RoleSurface[];
  pattern: Int8Array;
  /** The explode direction (unit, world) of each solid. */
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
  const pattern = new Int8Array(n);
  const surface: RoleSurface[] = [];
  const axis = new Float32Array(n * 3);
  const rest = new Float32Array(n * 16);
  const bodies = new Set((scene.teaching?.principle ?? []).map((p) => p.body).filter((b): b is string => !!b));
  const phases = [0, 1, 2, 3.5];
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
    for (const u of phases) {
      const q = poser.place(s, u);
      for (let k = 0; k < 16; k++) if (Math.abs(q[k]! - M0[k]!) > 1e-6) still = 0;
    }
    fixed[i] = still;
  });
  return { scene, n, baked, box: baked.box, isBase, isPlate, principle, fixed, surface, pattern, axis, rest };
}

/** The world matrices of every solid at phase u and explode e (0..1): body pose, frame, stretch, then the explode shift. */
export function place(rt: Runtime, u: number, explode: number, out: Float32Array): void {
  const { scene } = rt;
  const gap = FORM.explode.gap * explode;
  scene.pkg.solids.forEach((s, i) => {
    let M: Mat4 = mulMat(scene.poser.place(s, u), mat4(s.fr));
    if (s.stretch) {
      // between its two points as solved: at the first, x toward the second, its unit length scaled to the span
      const e = scene.poser.ends?.(u, s.stretch[0], s.stretch[1]);
      const e0 = scene.poser.refEnds?.(s.stretch[0], s.stretch[1]);
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
  /** Per solid, 1 when it is drawn see-through (L5, T10). */
  see: Uint8Array;
  ladder: Ladder;
  /** A library card: its two bold outlines are thinner (SD16). */
  card: boolean;
  /** The role patterns are drawn (rung F not dropped). */
  patterns: boolean;
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
    const see = st.see[i] === 1 || hasFlag3(s, "seeThrough");
    const f = see ? F.seeThrough.opacity : 1;
    const occ = (base ? F.occlude.base : plate ? F.occlude.plate : F.occlude.other) * (see ? F.seeThrough.occlude : 1);
    const face = (base ? F.base : plate ? F.plate : F.other) * f;
    const wallA = F.wall * (base ? F.baseWallGain : 1) * f;
    const R = rt.surface[i]!;
    const pat = rt.pattern[i]!;
    const kx = s.stretch ? Math.hypot(mats[b]!, mats[b + 1]!, mats[b + 2]!) || 1 : 1;
    table.set([face, wallA, Math.min(1, occ), see ? 0 : Math.min(1, occ * F.wallOcclude)], o + 12);
    const tint = see ? Math.max(R.tint ?? 0, F.seeThrough.tint) : (R.tint ?? 0);
    table.set([tint, st.patterns && pat >= 0 ? (R.alpha ?? 0) : 0, Math.max(0, pat), R.step ?? 1], o + 16);
    table.set([hasFlag3(s, "faint") ? 0.5 : 1, base ? 1 : 0, plate ? 1 : 0, see ? 1 : 0], o + 20);
    const top = base ? L.baseTop * cardK.base : plate ? L.plateTop * cardK.plate : L.otherTop;
    table.set([top, st.ladder.solid(s.detail) ? 0 : 1, kx, 0], o + 24);
    table.set([0, 0, 0, 0], o + 28);
  });
}
