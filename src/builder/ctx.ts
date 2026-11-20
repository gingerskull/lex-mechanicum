// The shared state the builder's rules work on (standard 5.1): the record's poses, its joints and sites, the placement,
// the solids built so far, and the log the audit reads. Everything is in the reference configuration's world
// coordinates until the end, where `finish` gives each solid the frame of the body it rides.
import { withoutConstruction } from "./construction";
import type { CatalogRecord } from "../catalog/schema";
import { armPoses, withArms } from "./arms";

/** What the builder needs of a record: its id, its kinematic block and its teaching block. */
export type RecordLike = Pick<CatalogRecord, "id"> & { kin?: unknown; teaching?: Teaching | undefined };
import type { Teaching } from "../catalog/kin";
import type { Kinematics } from "../kin/compose";
import type { Setup } from "../kin/compose";
import type { Kin } from "../kin/types";
import type { Vec3, Xf } from "../kin/math";
import { v3, xf } from "../kin/math";
import { cutConjugates } from "./conjugate";
import { manifold } from "../solids/manifold";
import type { Solid3 } from "../solids/types";
import { moveFrame, type Frame } from "./frames";
import { type Placement, type Sampled, slabRange, solvePlacement } from "./placer";
import { makePoseSource, type PoseSource } from "./poses";
import { sampleBodies } from "./sample";
import { SAMPLES, SAMPLES_NUMERIC } from "./constants";
import { bodyGeoms, type BodyGeom } from "./shapes";
import { classifyJoints, type JointInfo, type Site } from "./sites";
import { Sweeps } from "./sweeps";
import { viewDirection } from "./view";

export type Wasm = Awaited<ReturnType<typeof manifold>>;

/** The engineering record of a joint (A16): read by the audit, never shown on the page. */
export interface JointNote {
  id: string;
  kit: string;
  at: Vec3;
  title: string;
  note: string;
  badge?: [string, "ok" | "warn"];
  d?: number;
  /** Solid ids that serve each of the ten functions (F1 to F10). */
  serves: Partial<Record<"F1" | "F2" | "F3" | "F4" | "F5" | "F6" | "F7" | "F8" | "F9" | "F10", string[]>>;
}

/** A bore a pin or a bearing needs in a body: the body's own part is cut by it when it is emitted. */
export interface Bore {
  /** Centre in the body's world reference coordinates. */
  at: Vec3;
  axis: Vec3;
  r: number;
  /** Which joint it serves. */
  joint: string;
}

/** What the support router did with one support (A19). */
export interface RouteLog {
  support: string;
  site: string;
  kind: "housing" | "pillow" | "bridge" | "stub" | "hung";
  /** Candidate positions tried, and the one taken. */
  tried: number;
  /** The route moved the support from its first choice to clear a sweep. */
  moved: boolean;
  /** Principle bodies whose view the support still covers: it is drawn see-through (T10). */
  covers: string[];
  /** Least clearance to any moving part's swept volume, mm (A14). */
  gap: number;
}

export interface BuildOpts {
  controls?: Parameters<Kinematics["pose"]>[1];
  samples?: number;
}

export interface BuildCtx {
  id: string;
  rec: RecordLike;
  kin: Kin;
  source: PoseSource;
  K: Kinematics;
  S: Setup;
  M: Wasm;
  teaching: Teaching | undefined;
  geoms: Map<string, BodyGeom>;
  joints: JointInfo[];
  sites: Site[];
  sampled: Sampled;
  placement: Placement;
  principle: Set<string>;
  /** The solid of each body's own part, at its slab (bores not cut yet). */
  parts: Map<string, Solid3>;
  /** A clevis's second half. */
  twins: Map<string, Solid3>;
  /** A compound gear's further toothed levels, by body (bores not cut yet). */
  levels: Map<string, Solid3[]>;
  /** Hinge lugs by site: parts of a body whose plane is not square to the hinge (rules/lugs). */
  lugs: Map<string, Solid3[]>;
  /** The lugs joined to their body's part by a web (not a spatial link's plain knuckle), by solid id. */
  lugWebs: Set<string>;
  bores: Map<string, Bore[]>;
  /** Holes the base needs, world xy and radius, with the joint that asked; `ring` gives a slot's own outline. */
  baseHoles: { at: [number, number]; r: number; joint: string; ring?: [number, number][] }[];
  /** Marks engraved on the base top: swing scales, index lines (F5, F9). */
  baseMarks: { kind: "scale" | "index" | "engrave"; pts: [number, number][] }[];
  /** Backlash eccentrics a mesh asked for, by site id. */
  eccentric: Set<string>;
  /** Shim pack thickness behind a gear on a crossed mesh, by body (J9). */
  shim: Map<string, number>;
  /** What each site's stack built, for the joint notes and the audit. */
  stacks: Map<string, import("./stack").StackResult>;
  solids: Solid3[];
  notes: JointNote[];
  routes: RouteLog[];
  /** Solid id to the principle bodies it covers in the default view. */
  covers: Map<string, string[]>;
  /** Base plate top and bottom, world z. */
  base: { top: number; bottom: number; outline: [number, number][] } | null;
  sweeps: Sweeps;
  fired: Record<string, string[]>;
  rule: string;
  /** Problems the rules could not resolve (audit). */
  issues: string[];
  add(...s: (Solid3 | Solid3[])[]): Solid3[];
  get(id: string): Solid3 | undefined;
  note(n: JointNote): void;
  /**
   * World axial range of a body along its family normal, with the frame of the family: its slab's, or for a part the
   * record places itself (`place`), the part's own faces whichever way its frame faces.
   */
  extent(body: string): { frame: Frame; w0: number; w1: number } | null;
  xfOf(body: string, i: number): Xf;
  /** The direction the default view looks along. */
  viewDir(): Vec3;
  dispose(): void;
}

const UNIT: Xf = xf.id();

/** Builds the context: poses, geometry of every body, joints, placement. */
export async function createCtx(rec: RecordLike, opts: BuildOpts = {}): Promise<BuildCtx> {
  if (!rec.kin) throw new Error(`${rec.id}: no kin block`);
  const M = await manifold();
  // the catalogue types leave a joint position open to a point name; the kinematic library resolves it
  const source = makePoseSource(rec.kin as Kin, opts.controls);
  const K = source.K;
  // outboard arms are bodies of their own for the build (src/builder/arms.ts)
  // construction bodies (a hand-worked trammel's crank) are kinematics only: the build never sees them
  const W = withArms(withoutConstruction(source.kin), K.setup(opts.controls));
  const kin = W.kin;
  const S = W.S;
  const geoms = bodyGeoms(kin, S);
  const { joints, sites } = classifyJoints(kin, S);
  const n = opts.samples ?? (source.route === "numeric" ? SAMPLES_NUMERIC : SAMPLES);
  // a non-circular mesh's driven gear is cut conjugate to its driver over the cycle
  cutConjugates(M, K, kin, geoms, opts.controls);
  const sampled = sampleBodies(K, kin, n, opts.controls, geoms);
  armPoses(kin, sampled.xfs);
  const placement = solvePlacement(kin, geoms, sampled, joints, sites);
  const principle = new Set<string>();
  for (const p of rec.teaching?.principle ?? []) {
    const e = p as { body?: string; point?: string };
    if (e.body) principle.add(e.body);
    else if (e.point) {
      const pt = kin.points?.find((q) => q.id === e.point);
      if (pt) principle.add(pt.body);
    }
  }
  const ctx: BuildCtx = {
    id: rec.id,
    rec,
    kin,
    source,
    K,
    S,
    M,
    teaching: rec.teaching,
    geoms,
    joints,
    sites,
    sampled,
    placement,
    principle,
    parts: new Map(),
    twins: new Map(),
    levels: new Map(),
    lugs: new Map(),
    lugWebs: new Set(),
    bores: new Map(),
    baseHoles: [],
    baseMarks: [],
    eccentric: new Set(),
    shim: new Map(),
    stacks: new Map(),
    solids: [],
    notes: [],
    routes: [],
    covers: new Map(),
    base: null,
    sweeps: null as unknown as Sweeps,
    fired: {},
    rule: "",
    issues: [],
    add(...s) {
      const out: Solid3[] = [];
      for (const x of s.flat()) {
        if (this.solids.some((q) => q.id === x.id)) throw new Error(`${rec.id}: solid ${x.id} added twice (rule ${this.rule})`);
        this.solids.push(x);
        out.push(x);
        (this.fired[this.rule] ??= []).push(x.id);
      }
      this.sweeps?.touch(out.map((x) => x.body));
      return out;
    },
    get(id) {
      return this.solids.find((q) => q.id === id);
    },
    note(nt) {
      this.notes.push(nt);
    },
    extent(body) {
      const r = slabRange(this.placement, body);
      if (!r) return null;
      const own = placedSpan(this, body, r.fam.frame);
      return { frame: r.fam.frame, w0: own?.[0] ?? r.w0, w1: own?.[1] ?? r.w1 };
    },
    xfOf(body, i) {
      return this.sampled.xfs.get(body)?.[i] ?? UNIT;
    },
    viewDir() {
      return viewDirection(rec.teaching?.view, (j) => this.joints.find((q) => q.id === j)?.axis);
    },
    dispose() {
      this.sweeps.dispose();
    },
  };
  ctx.sweeps = new Sweeps(ctx);
  for (const f of placement.relaxed) ctx.issues.push(`parts pass on both sides of a pin among ${f.join(", ")}: decided in the mechanism's issue (T12)`);
  return ctx;
}

/**
 * A solid's own span along its frame's z, from its frame origin: an extrusion's height (a part made as a mesh keeps the
 * extrusion it stands for), a loft's sections, a turned part's profile; null for a sweep.
 */
export function localSpan(s: Pick<Solid3, "op" | "profile">): [number, number] | null {
  const op = s.op;
  if (op.op === "extrude") return [0, op.h];
  if (op.op === "loft") return [Math.min(...op.sections.map((x) => x.z)), Math.max(...op.sections.map((x) => x.z))];
  if (op.op === "revolve") {
    const ys = s.profile.outer.map((p) => p[1]);
    return ys.length ? [Math.min(...ys), Math.max(...ys)] : null;
  }
  return null;
}

/**
 * The range a part takes along a frame's z (from the frame's origin), read from its own faces and its own facing: a part
 * whose z runs against the frame's spans back from its origin. Null when the part is not square to the frame or its op
 * gives no span.
 */
export function spanAlong(s: Pick<Solid3, "op" | "profile" | "frame">, f: Frame, fallback?: [number, number]): [number, number] | null {
  const k = s.frame.z[0] * f.z[0] + s.frame.z[1] * f.z[1] + s.frame.z[2] * f.z[2];
  if (Math.abs(Math.abs(k) - 1) > 1e-6) return null;
  const loc = localSpan(s) ?? fallback;
  if (!loc) return null;
  const w = (s.frame.o[0] - f.o[0]) * f.z[0] + (s.frame.o[1] - f.o[1]) * f.z[1] + (s.frame.o[2] - f.o[2]) * f.z[2];
  const a = w + k * loc[0];
  const b = w + k * loc[1];
  return [Math.min(a, b), Math.max(a, b)];
}

/**
 * The own span of a part the record places (`place` on its shape: where its joints put it, not on a slab) along a
 * family frame, whichever way its frame faces: from `place` along its frame's z, as thick as the record makes it
 * (`thickness`, else its built part's height, else its geometry's). Where a shape builds its working plate as a piece
 * beside its own part (an internal Geneva wheel's slotted ring over its web), the record's `place` and `thickness` are
 * the working plate's. Null for any other body, which keeps its slab.
 */
function placedSpan(ctx: BuildCtx, body: string, f: Frame): [number, number] | null {
  const g = ctx.geoms.get(body);
  const at = g?.shape.place;
  if (!g || typeof at !== "number") return null;
  const part = ctx.parts.get(body);
  const own = part ? localSpan(part) : null;
  const h = typeof g.shape.thickness === "number" ? g.shape.thickness : own ? own[1] - own[0] : g.thick;
  const o = v3.add(g.frame.o, v3.mul(g.frame.z, at));
  return spanAlong({ frame: { o, x: g.frame.x, z: g.frame.z }, op: { op: "extrude", h, steps: 1 }, profile: g.profile }, f);
}

/** A solid's frame in world coordinates after `X` (used for the pose of a body at a sample). */
export const posed = (s: Solid3, X: Xf): Frame => moveFrame(s.frame, X);

/** Every body's own solids not yet among the solids: parts, clevis twins and compound-gear levels. */
export const ownParts = (ctx: BuildCtx): Solid3[] => [...ctx.parts.values(), ...ctx.twins.values(), ...[...ctx.levels.values()].flat()];
