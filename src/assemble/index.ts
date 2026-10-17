// assemble(model): the rules, then the mechanism's polish (only what differs), then stage 3 fasteners, then the rigid
// explode pass (standard 5). The result is everything the packager and the renderer need.
import type { Solid } from "../hardware/solid";
import { sample, type Sampled } from "../model/sample";
import type { MechanismModel } from "../model/types";
import { createContext } from "../rules/context";
import { rigidExplode } from "../rules/explode";
import { fasteners } from "../rules/fasteners";
import { rules as defaultRules, runRules } from "../rules/registry";
import type { BuildRule, Joint, JointInfo, Rule, RuleContext } from "../rules/types";
import { HP, polishApi, type Polish } from "./api";

export interface Assembly {
  solids: Solid[];
  joints: Joint[];
  /** The mechanism's build rules from its polish (A16). */
  rules: BuildRule[];
  /** z of each model layer, lowest first: explode level i is levels[i]. */
  levels: number[];
  zmin: number;
  zmax: number;
  b0: number;
  b1: number;
  /** Time spent in the rules and in the polish, ms. */
  ms: { auto: number; polish: number };
  /** Which rule added which solids. */
  fired: Record<string, string[]>;
  info: JointInfo[];
}

export interface AssembleOptions {
  polish?: Polish;
  rules?: Rule[];
  sampled?: Sampled;
}

export interface Assembled {
  assembly: Assembly;
  ctx: RuleContext;
}

export function assembleWith(model: MechanismModel, opts: AssembleOptions = {}): Assembled {
  const t0 = performance.now();
  const ctx = createContext(model, opts.sampled ?? sample(model));
  runRules(ctx, opts.rules ?? defaultRules);
  const tAuto = performance.now() - t0;
  const buildRules: BuildRule[] = [];
  const t1 = performance.now();
  if (opts.polish) opts.polish(polishApi(ctx, buildRules), HP);
  const tPolish = performance.now() - t1;
  fasteners(ctx);
  rigidExplode(ctx);
  let zmin = Infinity;
  let zmax = -Infinity;
  for (const s of ctx.solids) {
    zmin = Math.min(zmin, s.z0);
    zmax = Math.max(zmax, s.z1);
  }
  return {
    ctx,
    assembly: {
      solids: ctx.solids,
      joints: ctx.joints,
      rules: buildRules,
      levels: ctx.levels,
      zmin,
      zmax,
      b0: ctx.b0,
      b1: ctx.b1,
      ms: { auto: tAuto, polish: tPolish },
      fired: ctx.fired,
      info: ctx.info,
    },
  };
}

export const assemble = (model: MechanismModel, sampled?: Sampled, opts: Omit<AssembleOptions, "sampled"> = {}): Assembly =>
  assembleWith(model, { ...opts, ...(sampled ? { sampled } : {}) }).assembly;

export type { Polish, PolishApi } from "./api";
