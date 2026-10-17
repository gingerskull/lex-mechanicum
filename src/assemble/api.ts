// The polish API (standard 5.2): what a mechanism's polish.ts may do to the generated assembly. It states only what
// differs: overrides, variant picks, additions, notes and the mechanism's build rules.
import type { Pose, Vec2 } from "../core/geom";
import { toLocal } from "../core/poly";
import { H as primitives } from "../hardware/primitives";
import type { Solid } from "../hardware/solid";
import { bridge } from "../hardware/sub/bridge";
import { drive } from "../hardware/sub/drive";
import { followerTrain } from "../hardware/sub/followerTrain";
import { housing } from "../hardware/sub/housing";
import { dragPack, eccentricMount, sensor } from "../hardware/sub/misc";
import { slide } from "../hardware/sub/slide";
import { stops } from "../hardware/sub/stops";
import type { MechanismModel, Solved } from "../model/types";
import { poseOf } from "../model/pose";
import type { BuildRule, Joint, RuleContext } from "../rules/types";
import { bodyPose } from "./pose";

export interface PolishApi {
  /** The rule context, for subassemblies. */
  ctx: RuleContext;
  m: MechanismModel;
  s0: Solved;
  b0: number;
  b1: number;
  levels: number[];
  exOf(z: number): number;
  solids: Solid[];
  joints: Joint[];
  /** The mechanism's 3 to 5 build rules (A16). */
  rules: BuildRule[];
  solidOf: Record<string, Solid>;
  get(id: string): Solid | undefined;
  find(f: string | RegExp | ((s: Solid) => boolean)): Solid[];
  drop(f: string | RegExp | ((s: Solid) => boolean)): Solid[];
  add(...s: (Solid | Solid[])[]): Solid[];
  set(id: string, patch: Partial<Solid>): Solid;
  /** Get or create a joint record and merge `patch` into it. */
  joint(id: string, patch?: Partial<Joint>): Joint;
  /** World position of a pin at the assembly phase. */
  pin(id: string): Vec2 | null;
  /** A world point in a body's local frame, as a pose. */
  local(body: string, pt: Vec2): Pose;
}

type Ctx = RuleContext | PolishApi;
const ctxOf = (a: Ctx): RuleContext => ("ctx" in a ? a.ctx : a);

/** The hardware primitives and subassemblies a polish uses: `H` in `polish(A, H)`. */
export const HP = {
  ...primitives,
  bridge: (a: Ctx, o: Parameters<typeof bridge>[1]) => bridge(ctxOf(a), o),
  housing: (a: Ctx, jid: string, o: Parameters<typeof housing>[2]) => housing(ctxOf(a), jid, o),
  slide: (a: Ctx, j: Parameters<typeof slide>[1]) => slide(ctxOf(a), j),
  eccentricMount: (a: Ctx, jid: string, o: Parameters<typeof eccentricMount>[2]) => eccentricMount(ctxOf(a), jid, o),
  stops: (a: Ctx, o: Parameters<typeof stops>[1]) => stops(ctxOf(a), o),
  dragPack: (a: Ctx, jid: string, o: Parameters<typeof dragPack>[2]) => dragPack(ctxOf(a), jid, o),
  followerTrain: (a: Ctx, j: Parameters<typeof followerTrain>[1]) => followerTrain(ctxOf(a), j),
  drive: (a: Ctx, o?: Parameters<typeof drive>[1]) => drive(ctxOf(a), o),
  sensor: (a: Ctx, id: string, o: Parameters<typeof sensor>[2]) => sensor(ctxOf(a), id, o),
};
export type PolishHardware = typeof HP;

export type Polish = (A: PolishApi, H: PolishHardware) => void;

export function polishApi(ctx: RuleContext, rules: BuildRule[]): PolishApi {
  const match = (f: string | RegExp | ((s: Solid) => boolean)) => (s: Solid) => (typeof f === "function" ? f(s) : f instanceof RegExp ? f.test(s.id) : s.id === f);
  const A: PolishApi = {
    ctx,
    m: ctx.model,
    s0: ctx.s0,
    b0: ctx.b0,
    b1: ctx.b1,
    levels: ctx.levels,
    exOf: ctx.exOf,
    solids: ctx.solids,
    joints: ctx.joints,
    rules,
    solidOf: ctx.solidOf,
    get: ctx.get,
    find: (f) => ctx.solids.filter(match(f)),
    drop(f) {
      const out = ctx.solids.filter(match(f));
      for (const s of out) ctx.solids.splice(ctx.solids.indexOf(s), 1);
      return out;
    },
    add: (...s) => ctx.add(...s),
    set(id, patch) {
      const s = ctx.get(id);
      if (!s) throw new Error(`polish: no solid ${id}`);
      return Object.assign(s, patch);
    },
    joint(id, patch) {
      let j = ctx.joints.find((t) => t.id === id);
      if (!j) {
        j = { id, type: "post", at: [0, 0], title: id, note: "", serves: {} };
        ctx.joints.push(j);
      }
      return patch ? Object.assign(j, patch) : j;
    },
    pin(id) {
      const p = ctx.parts[id];
      const q = p ? poseOf(p, ctx.s0) : null;
      return q ? [q[0], q[1]] : null;
    },
    local(body, pt) {
      const q = bodyPose(ctx.parts, body, ctx.s0) ?? [0, 0, 0];
      const l = toLocal(q, pt);
      return [l[0], l[1], 0];
    },
  };
  return A;
}
