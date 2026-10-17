// The see-through stage (L5), after the polish and the fasteners: the working zones of the mechanism stay in view. A
// zone is where the motion is made: the pitch point of every mesh, the run of every slot roller. A static solid above
// a zone that hides it (a bridge over a gear pair, a plate over a Geneva wheel) is drawn see-through, so the zone
// reads through it as hidden lines instead of vanishing under paper.
import { TAU, type Vec2 } from "../core/geom";
import { depth, toLocal } from "../core/poly";
import { heights } from "../parts";
import { poseOf } from "../model/pose";
import type { Solid } from "../hardware/solid";
import { isGround } from "../assemble/pose";
import type { RuleContext } from "./types";

/** A zone counts as hidden when covering solids hide this share of it. */
export const HIDDEN = 0.5;
/** A solid takes part in hiding a zone when it covers at least this share of it. */
const PART = 0.1;
/** Zone radius at a mesh, in modules: the teeth that meet. Without a module, mm. */
const MESH_R = 3;
const MESH_R_MM = 6;
/** Phases sampled along a slot roller's run. */
const RUN_STEPS = 24;
/** Sample points across a zone disc, per diameter. */
const GRID = 7;

export interface Zone {
  /** The joint the zone belongs to. */
  joint: string;
  /** Sample points, world mm. */
  pts: Vec2[];
  /** Top of the parts that make the zone: only solids above it can hide it. */
  top: number;
}

function disc(c: Vec2, r: number, out: Vec2[]): void {
  for (let i = 0; i < GRID; i++)
    for (let k = 0; k < GRID; k++) {
      const x = ((i + 0.5) / GRID) * 2 - 1;
      const y = ((k + 0.5) / GRID) * 2 - 1;
      if (x * x + y * y <= 1) out.push([c[0] + x * r, c[1] + y * r]);
    }
}

/** The working zones of an assembly. */
export function zones(ctx: RuleContext): Zone[] {
  const out: Zone[] = [];
  for (const j of ctx.info) {
    if (j.kind === "mesh") {
      const m = Math.max(j.a.m ?? 0, j.b.m ?? 0);
      const pts: Vec2[] = [];
      disc(j.at, m ? MESH_R * m : MESH_R_MM, pts);
      out.push({ joint: j.id, pts, top: Math.max(heights(j.a)[1], heights(j.b)[1]) });
    }
    if (j.kind === "pin" && j.type === "J4") {
      const slot = j.joined.find((x) => x.how === "slot");
      if (!slot) continue;
      const pts: Vec2[] = [];
      for (let i = 0; i < RUN_STEPS; i++) {
        const q = poseOf(j.pin, ctx.model.solve((i / RUN_STEPS) * TAU));
        if (q) disc([q[0], q[1]], (slot.slotW ?? 6) / 2, pts);
      }
      out.push({ joint: j.id, pts, top: Math.max(...j.joined.map((x) => x.z1)) });
    }
  }
  return out;
}

/** Share of a zone's points a solid covers at the assembly phase. */
function cover(ctx: RuleContext, t: Solid, z: Zone): number {
  const pose = ctx.world(t);
  if (!pose) return 0;
  let n = 0;
  for (const p of z.pts) if (depth(t.outer, t.holes, toLocal(pose, p)) > 0) n++;
  return n / (z.pts.length || 1);
}

/** Solids that can hide a zone: static, above it, not the base plate and not a part of the mechanism. */
const hiders = (ctx: RuleContext, z: Zone) =>
  ctx.solids.filter((t) => !t.isBase && t.kind !== "part" && !t.motion && isGround(ctx.parts, t.body) && t.z0 >= z.top - 0.05);

/** How much of each zone is hidden, counting see-through solids as hiding nothing. */
export function hiddenShare(ctx: RuleContext): { joint: string; hidden: number }[] {
  return zones(ctx).map((z) => {
    const H = hiders(ctx, z).filter((t) => !t.seeThrough);
    let n = 0;
    for (const p of z.pts)
      if (H.some((t) => { const pose = ctx.world(t); return !!pose && depth(t.outer, t.holes, toLocal(pose, p)) > 0; })) n++;
    return { joint: z.joint, hidden: n / (z.pts.length || 1) };
  });
}

export function seeThrough(ctx: RuleContext): void {
  for (const z of zones(ctx)) {
    const H = hiders(ctx, z).map((t) => ({ t, c: cover(ctx, t, z) })).filter((x) => x.c >= PART);
    let n = 0;
    for (const p of z.pts)
      if (H.some(({ t }) => { const pose = ctx.world(t); return !!pose && depth(t.outer, t.holes, toLocal(pose, p)) > 0; })) n++;
    if (n / (z.pts.length || 1) < HIDDEN) continue;
    for (const { t } of H) {
      if (t.seeThrough) continue;
      t.seeThrough = true;
      (ctx.fired["see-through"] ??= []).push(t.id);
    }
  }
}
