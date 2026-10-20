// Polish API v3 (standard 5.2): what a mechanism's polish may do to the generated assembly, for true exceptions only. It
// states what differs from the builder: an override, a variant, an addition, a note. It never re-describes a joint, and
// it never removes a post or a plate (T12): a support stays, and the see-through stage and the router handle what it
// covers. `pin()` and `local()` work in 3D: a point of a body in its own frame, and back.
import { H } from "../hardware/primitives";
import type { Solid } from "../hardware/solid";
import { type Vec3, xf } from "../kin/math";
import type { Solid3 } from "../solids/types";
import type { BuildCtx, JointNote } from "./ctx";
import { place, type Frame } from "./frames";
import { Local } from "./lib";

/** Kinds that hold the assembly up; the polish cannot drop them (T12). */
const SUPPORTS = new Set(["base", "plate", "bracket", "housing", "bridge", "standoff", "foot", "spigot"]);

export interface PolishApi {
  ctx: BuildCtx;
  /** A point given in a body's own frame (or the name of a point of the record), in the reference configuration's world. */
  pin(body: string, at: Vec3 | string): Vec3;
  /** A world point of the reference configuration in a body's own frame. */
  local(body: string, world: Vec3): Vec3;
  /** A frame on a body at a point of its own, z along an axis of its own (default: its plane's normal). */
  frame(body: string, at: Vec3, axis?: Vec3): Frame;
  get(id: string): Solid3 | undefined;
  find(f: string | RegExp | ((s: Solid3) => boolean)): Solid3[];
  /** Adds old-style solids in a local frame, or Solid3 as they are. */
  add(...s: (Solid3 | Solid3[])[]): Solid3[];
  /** Builds hardware in the local frame `f` (z along the joint axis), with the primitives, and adds it. */
  build(f: Frame, make: (L: Local, h: typeof H) => void, over?: Partial<Solid3>): Solid3[];
  /** Overrides fields of a solid (a variant: sealed for open, a size). */
  set(id: string, patch: Partial<Solid3>): Solid3;
  /** Removes a solid. A post, plate, bridge, housing or foot is refused unless the record's `teaching.exceptions` names it. */
  drop(f: string | RegExp | ((s: Solid3) => boolean)): Solid3[];
  /** The engineering note of a joint (A16). */
  note(n: Omit<JointNote, "serves"> & { serves?: JointNote["serves"] }): void;
  /** What the polish changed, for the audit. */
  log: { added: string[]; set: string[]; dropped: string[]; notes: string[] };
}

/** The polish of a mechanism: exceptions only. */
export type Polish = (A: PolishApi, h: typeof H) => void;

const match = (f: string | RegExp | ((s: Solid3) => boolean)): ((s: Solid3) => boolean) => (typeof f === "string" ? (s) => s.id === f : f instanceof RegExp ? (s) => f.test(s.id) : f);

export function polishApi(ctx: BuildCtx): PolishApi {
  const bodyXf = (b: string) => ctx.S.bodyFrame.get(b) ?? xf.id();
  const allowed = new Set<string>();
  for (const e of ctx.teaching?.exceptions ?? []) {
    const ex = e as { solid?: string; solids?: string[] };
    const ids = ex.solids ?? (ex.solid ? [ex.solid] : []);
    ids.forEach((i) => allowed.add(i));
  }
  const log = { added: [] as string[], set: [] as string[], dropped: [] as string[], notes: [] as string[] };
  const A: PolishApi = {
    ctx,
    pin(body, at) {
      let p: Vec3;
      if (typeof at === "string") {
        const pt = ctx.kin.points?.find((q) => q.id === at);
        if (!pt) throw new Error(`polish: no point ${at}`);
        const l = pt.local as number[];
        p = [l[0] ?? 0, l[1] ?? 0, l[2] ?? 0];
        body = pt.body;
      } else p = at;
      return xf.apply(bodyXf(body), p);
    },
    local(body, world) {
      return xf.apply(xf.inv(bodyXf(body)), world);
    },
    frame(body, at, axis) {
      const o = A.pin(body, at);
      const g = ctx.geoms.get(body);
      const z = axis ? xf.dir(bodyXf(body), axis) : (g?.frame.z ?? [0, 0, 1]);
      const x = g?.frame.x ?? [1, 0, 0];
      return { o, x, z: z as Vec3 };
    },
    get: (id) => ctx.get(id) ?? [...ctx.parts.values(), ...ctx.twins.values()].find((s) => s.id === id),
    find(f) {
      const m = match(f);
      return [...ctx.solids, ...ctx.parts.values(), ...ctx.twins.values()].filter(m);
    },
    add(...s) {
      ctx.rule = "polish";
      const out = ctx.add(...s);
      out.forEach((x) => log.added.push(x.id));
      return out;
    },
    build(f, make, over = {}) {
      const L = new Local(f);
      make(L, H);
      const out = place(f, L.list as Solid[], over);
      return A.add(out);
    },
    set(id, patch) {
      const s = A.get(id);
      if (!s) throw new Error(`polish: no solid ${id}`);
      Object.assign(s, patch);
      ctx.sweeps.touch([s.body]);
      log.set.push(id);
      return s;
    },
    drop(f) {
      const m = match(f);
      const hit = ctx.solids.filter(m);
      for (const s of hit) {
        if (SUPPORTS.has(s.kind) && !allowed.has(s.id)) throw new Error(`polish: ${s.id} is a ${s.kind}; posts and plates are never removed (T12), name it in teaching.exceptions with its reason`);
        if (ctx.parts.get(s.body)?.id === s.id) throw new Error(`polish: ${s.id} is a principle part of the mechanism and stays`);
      }
      ctx.solids = ctx.solids.filter((s) => !hit.includes(s));
      ctx.sweeps.touch(hit.map((s) => s.body));
      hit.forEach((s) => log.dropped.push(s.id));
      return hit;
    },
    note(n) {
      ctx.note({ serves: {}, ...n });
      log.notes.push(n.id);
    },
    log,
  };
  return A;
}

/** Runs a polish on a built context. */
export function applyPolish(ctx: BuildCtx, polish: Polish): PolishApi["log"] {
  const A = polishApi(ctx);
  ctx.rule = "polish";
  polish(A, H);
  return A.log;
}
