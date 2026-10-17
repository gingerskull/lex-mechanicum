// Builds the rule context from a model: the model parts as solids, the base plane, the explode levels, the sweeps.
import { TAU, xf, type Vec2 } from "../core/geom";
import { circleClearance, region, type Region } from "../core/poly";
import { marks, solid, type Solid } from "../hardware/solid";
import { heights } from "../parts";
import { poseOf } from "../model/pose";
import { sample, type Sampled } from "../model/sample";
import type { MechanismModel, Part } from "../model/types";
import { FORM } from "../style/form";
import { indexParts, isGround, solidPose } from "../assemble/pose";
import type { RuleContext } from "./types";

/** Phase at which the build is laid out: away from the singular positions of u = 0. */
export const U0 = 0.37;

const humanize = (id: string) =>
  (id.charAt(0).toUpperCase() + id.slice(1)).replace(/[-_]+/g, " ").replace(/([a-z])([A-Z0-9])/g, "$1 $2");

const SWEEP_STEPS = 72;
const SOLID_STEPS = 36;

export function createContext(model: MechanismModel, sampled: Sampled = sample(model)): RuleContext {
  const parts = indexParts(model);
  const s0 = model.solve(U0);
  const plates = model.parts.filter((p) => p.role !== "pin");
  const levels = [...new Set(plates.map((p) => heights(p)[0]))].sort((a, b) => a - b);
  const exOf = (z: number) => Math.max(0, levels.findIndex((l) => l >= z - 1e-6));
  const b1 = Math.min(...plates.map((p) => heights(p)[0])) - 2;
  const solids: Solid[] = [];
  const solidOf: Record<string, Solid> = {};
  for (const p of plates) {
    const [z0, z1] = heights(p);
    solidOf[p.id] = solid(p.id, {
      name: p.name ?? (p.role === "trace" ? "Tracer pin" : humanize(p.id)),
      kind: "part",
      role: p.role,
      body: p.id,
      z0,
      z1,
      outer: p.shape.outer.slice(),
      holes: p.shape.holes.map((h) => h.slice()),
      marks: marks("boss", ...p.marks),
      ex: exOf(z0),
      chamfer: FORM.chamfer.plate,
    });
    solids.push(solidOf[p.id]!);
  }

  let sweepCache: ReturnType<RuleContext["sweeps"]> | null = null;
  const solidCache = new Map<Solid, { n: number; regions: Region[] }>();
  const sweptSolid = (t: Solid): Region[] => {
    const c = solidCache.get(t);
    if (c && c.n === t.outer.length + t.holes.length) return c.regions;
    const steps = isGround(parts, t.body) && !t.motion ? 1 : SOLID_STEPS;
    const regions: Region[] = [];
    for (let i = 0; i < steps; i++) {
      const u = steps === 1 ? U0 : (i / steps) * TAU;
      const pose = solidPose(model, parts, t, steps === 1 ? s0 : model.solve(u), u);
      if (pose) regions.push(region(xf(t.outer, pose), t.holes.map((h) => xf(h, pose))));
    }
    solidCache.set(t, { n: t.outer.length + t.holes.length, regions });
    return regions;
  };

  const ctx: RuleContext = {
    model,
    parts,
    sampled,
    u0: U0,
    s0,
    solids,
    joints: [],
    info: [],
    solidOf,
    form: FORM,
    b0: b1 - 8,
    b1,
    levels,
    exOf,
    add(...list) {
      const flat = list.flat();
      for (const s of flat) {
        if (ctx.get(s.id)) throw new Error(`duplicate solid id ${s.id}`);
        solids.push(s);
        (ctx.fired[ctx.rule] ??= []).push(s.id);
      }
      return flat;
    },
    get: (id) => solids.find((s) => s.id === id),
    drop(f) {
      const out = solids.filter((s) => (typeof f === "string" ? s.id === f : f.test(s.id)));
      for (const s of out) solids.splice(solids.indexOf(s), 1);
      return out;
    },
    joint: (id) => ctx.joints.find((j) => j.id === id),
    classify: (pin) => ctx.info.find((j) => j.kind === "pin" && j.pin.id === pin.id)?.type ?? null,
    pinJoint: (id) => ctx.info.find((j) => j.kind === "pin" && j.id === id) as ReturnType<RuleContext["pinJoint"]>,
    world: (t) => solidPose(model, parts, t, s0, U0),
    swept: (t) => sweptSolid(t),
    belts: [],
    sweeps() {
      if (sweepCache) return sweepCache;
      sweepCache = model.parts
        .filter((p) => p.role !== "pin" && !p.fixed)
        .map((part: Part) => {
          const [z0, z1] = heights(part);
          const regions: Region[] = [];
          for (let i = 0; i < SWEEP_STEPS; i++) {
            const pose = poseOf(part, model.solve((i / SWEEP_STEPS) * TAU));
            if (pose) regions.push(region(xf(part.shape.outer, pose), part.shape.holes.map((h) => xf(h, pose))));
          }
          return { part, z0, z1, regions };
        });
      return sweepCache;
    },
    clearance(c: Vec2, r: number, z0: number, z1: number, ignore?: (t: Solid) => boolean) {
      let m = Infinity;
      const zHit = (a0: number, a1: number) => Math.min(a1, z1) - Math.max(a0, z0) > 0.05;
      for (const sw of ctx.sweeps()) {
        if (!zHit(sw.z0, sw.z1)) continue;
        for (const g of sw.regions) m = Math.min(m, circleClearance(c, r, g));
      }
      for (const t of solids) {
        // moving model parts are covered by their sweeps above
        if ((solidOf[t.id] === t && !isGround(parts, t.body)) || !zHit(t.z0, t.z1) || ignore?.(t)) continue;
        for (const g of sweptSolid(t)) m = Math.min(m, circleClearance(c, r, g));
      }
      return m;
    },
    fired: {},
    rule: "context",
  };
  return ctx;
}
