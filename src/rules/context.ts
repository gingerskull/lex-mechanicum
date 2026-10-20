// Builds the rule context from a model: the model parts as solids, the base plane, the explode levels, the sweeps.
import { boxOf, isOut, planCorners } from "../core/axis";
import { TAU, xf, type Vec2 } from "../core/geom";
import { circleClearance, region, type Region } from "../core/poly";
import { marks, onAxis, solid, type Solid } from "../hardware/solid";
import { heights, layerZ } from "../parts";
import { partShape, poseOf } from "../model/pose";
import { sample, type Sampled } from "../model/sample";
import type { MechanismModel, Part } from "../model/types";
import { FORM } from "../style/form";
import { pillowRise } from "../hardware/sub/pillow";
import { BORES } from "../hardware/tables";

/** Room a chain's lower link plates take under its sprockets, mm (two plates and a gap). */
const CHAIN_UNDER = 3;
import { indexParts, isGround, shapeAt, solidBox, solidPose } from "../assemble/pose";
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
  // explode levels follow the layer grid: a plated part keeps its layer's level
  const levels = [...new Set(plates.map(layerZ))].sort((a, b) => a - b);
  const exOf = (z: number) => Math.max(0, levels.findIndex((l) => l >= z - 1e-6));
  // the base sits under the lowest part: for a part on an x or y axis, the lowest world z of its outline
  const lowest = (p: Part) => {
    if (!isOut(p.axis)) return heights(p)[0];
    const q = poseOf(p, s0);
    return q ? Math.min(...xf(p.shape.outer, q).map((v) => v[1])) : Infinity;
  };
  // J10's base growth rule: a shaft in plan stands high enough over the base for its pillow blocks
  const shaftsInPlan = model.parts.filter((p) => p.role === "pin" && p.fixed && isOut(p.axis));
  const capR = (p: Part) => Math.max(...p.shape.outer.map((q) => Math.hypot(q[0], q[1])));
  // J12's: a chain's lower link plates pass under its sprockets
  const chained = (model.flexible ?? []).flatMap((f) => (f.form === "chain" ? f.over : [])).map((id) => parts[id]).filter((p): p is Part => !!p);
  const b1 = Math.min(...plates.map(lowest), ...shaftsInPlan.map((p) => p.fixed![1] - pillowRise(BORES.find((d) => d <= Math.max(8, Math.round(capR(p) * 1.45))) ?? 8)), ...chained.map((p) => heights(p)[0] - CHAIN_UNDER)) - 2;
  const solids: Solid[] = [];
  const solidOf: Record<string, Solid> = {};
  for (const p of plates) {
    const [z0, z1] = heights(p);
    solidOf[p.id] = solid(p.id, {
      name: p.name ?? (p.role === "trace" ? "Tracer pin" : humanize(p.id)),
      kind: "part",
      role: p.role,
      body: p.id,
      ...onAxis(p),
      ...(p.taper !== undefined ? { taper: p.taper } : {}),
      ...(p.helix !== undefined ? { helix: p.helix } : {}),
      ...(p.stretch && p.between ? { stretch: [p.between[0], p.between[1]] as [string, string] } : {}),
      ...(p.deform ? { deform: true } : {}),
      z0,
      z1,
      outer: p.shape.outer.slice(),
      holes: p.shape.holes.map((h) => h.slice()),
      marks: marks("boss", ...p.marks),
      ex: exOf(layerZ(p)),
      chamfer: FORM.chamfer.plate,
    });
    solids.push(solidOf[p.id]!);
  }

  let sweepCache: ReturnType<RuleContext["sweeps"]> | null = null;
  // a solid on an x or y axis is seen by these plan tests as its box: the plan footprint over the box's z range
  const solidCache = new Map<Solid, { n: number; regions: Region[]; z: [number, number] }>();
  const sweptOf = (t: Solid) => {
    const c = solidCache.get(t);
    if (c && c.n === t.outer.length + t.holes.length) return c;
    const steps = isGround(parts, t.body) && !t.motion ? 1 : SOLID_STEPS;
    const regions: Region[] = [];
    const z: [number, number] = t.axis ? [Infinity, -Infinity] : [t.z0, t.z1];
    for (let i = 0; i < steps; i++) {
      const u = steps === 1 ? U0 : (i / steps) * TAU;
      const s = steps === 1 ? s0 : model.solve(u);
      const pose = solidPose(model, parts, t, s, u);
      if (!pose) continue;
      if (t.axis) {
        const b = solidBox(t, pose);
        regions.push(region(planCorners(b), []));
        z[0] = Math.min(z[0], b[2]);
        z[1] = Math.max(z[1], b[5]);
      } else regions.push(region(xf(shapeAt(parts, t, s), pose), t.holes.map((h) => xf(h, pose))));
    }
    const out = { n: t.outer.length + t.holes.length, regions, z };
    solidCache.set(t, out);
    return out;
  };
  const sweptSolid = (t: Solid): Region[] => sweptOf(t).regions;
  const zOf = (t: Solid): [number, number] => (t.axis ? sweptOf(t).z : [t.z0, t.z1]);

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
        if (ctx.axis && !s.axis) s.axis = ctx.axis;
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
          let [z0, z1] = heights(part);
          const regions: Region[] = [];
          // a part on an x or y axis sweeps its box: the plan footprint, over the box's z range
          const out = isOut(part.axis);
          const [w0, w1] = [z0, z1];
          if (out) [z0, z1] = [Infinity, -Infinity];
          for (let i = 0; i < SWEEP_STEPS; i++) {
            const s = model.solve((i / SWEEP_STEPS) * TAU);
            const pose = poseOf(part, s);
            if (!pose) continue;
            if (out) {
              const b = boxOf(part.axis, xf(part.shape.outer, pose), w0, w1);
              regions.push(region(planCorners(b), []));
              z0 = Math.min(z0, b[2]);
              z1 = Math.max(z1, b[5]);
            } else regions.push(region(xf(partShape(part, s), pose), part.shape.holes.map((h) => xf(h, pose))));
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
        if ((solidOf[t.id] === t && !isGround(parts, t.body)) || !zHit(...zOf(t)) || ignore?.(t)) continue;
        for (const g of sweptSolid(t)) m = Math.min(m, circleClearance(c, r, g));
      }
      return m;
    },
    hits(c: Vec2, r: number, z0: number, z1: number, ignore?: (t: Solid) => boolean) {
      const zHit = (a0: number, a1: number) => Math.min(a1, z1) - Math.max(a0, z0) > 0.05;
      // a region whose box the circle cannot reach is skipped before the exact test
      const near = (g: Region) => c[0] + r > g.box[0] && c[0] - r < g.box[2] && c[1] + r > g.box[1] && c[1] - r < g.box[3];
      for (const sw of ctx.sweeps()) {
        if (!zHit(sw.z0, sw.z1)) continue;
        for (const g of sw.regions) if (near(g) && circleClearance(c, r, g) < 0) return true;
      }
      for (const t of solids) {
        if ((solidOf[t.id] === t && !isGround(parts, t.body)) || !zHit(...zOf(t)) || ignore?.(t)) continue;
        for (const g of sweptSolid(t)) if (near(g) && circleClearance(c, r, g) < 0) return true;
      }
      return false;
    },
    fired: {},
    rule: "context",
  };
  return ctx;
}
