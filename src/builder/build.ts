// The hardware builder's entry point: a catalogue record in, a v3 assembly out. Reads the record's joints, places the
// bodies, builds every joint from its kit, routes the supports against the swept volumes, and gives every solid the frame
// of the body it rides. Build time, Node only.
import type { Solid3 } from "../solids/types";
import { createCtx, type RecordLike, type BuildCtx, type BuildOpts, type JointNote, type RouteLog } from "./ctx";
import { applyPolish, type Polish, type PolishApi } from "./polish";
import { rules, runRules } from "./registry";
import type { Rule } from "./rules/types";

export interface Assembly {
  id: string;
  /**
   * Solids in the world coordinates of the reference configuration (every driver at its default). A body's kin pose
   * (an Xf from the reference configuration to now) places every solid that rides it, as src/kin defines a pose.
   */
  solids: Solid3[];
  notes: JointNote[];
  routes: RouteLog[];
  /** Solid id to the principle bodies it covers in the default view (T10). */
  covers: Record<string, string[]>;
  fired: Record<string, string[]>;
  issues: string[];
  poseRoute: "declared" | "numeric";
  poseNotes: string[];
  /** Slabs in the tallest stack and the solver's clevises (A18). */
  /** What the polish changed (exceptions only). */
  polish?: PolishApi["log"];
  placement: { slabs: number; stackMm: number; clevis: number; slabOf: Record<string, number> };
  /** Each placed body's top face as a plane [nx, ny, nz, t] (dot(n, p) = t, reference configuration): teaching points ride it. */
  lifts: Record<string, [number, number, number, number]>;
}

/** Builds an assembly and returns it together with the live context (the caller disposes it). */
export async function buildWithContext(rec: RecordLike, opts: BuildOpts & { rules?: Rule[]; polish?: Polish } = {}): Promise<{ assembly: Assembly; ctx: BuildCtx }> {
  const ctx = await createCtx(rec, opts);
  runRules(ctx, opts.rules ?? rules);
  const polish = opts.polish ? applyPolish(ctx, opts.polish) : undefined;
  finalize(ctx);
  return { assembly: assemble(ctx, polish), ctx };
}

export async function buildAssembly(rec: RecordLike, opts: BuildOpts & { rules?: Rule[]; polish?: Polish } = {}): Promise<Assembly> {
  const { assembly, ctx } = await buildWithContext(rec, opts);
  ctx.dispose();
  return assembly;
}

/** The bodies' own parts join the solids, with their bores. */
function finalize(ctx: BuildCtx): void {
  ctx.rule = "placement";
  for (const p of ctx.parts.values()) ctx.add(p);
  for (const t of ctx.twins.values()) ctx.add(t);
  for (const l of ctx.levels.values()) ctx.add(l);
  ctx.rule = "polish";
}

function assemble(ctx: BuildCtx, polish?: PolishApi["log"]): Assembly {
  const solids = ctx.solids;
  const slabOf: Record<string, number> = {};
  const lifts: Assembly["lifts"] = {};
  for (const [b, [, s]] of ctx.placement.slab) {
    slabOf[b] = s;
    if (ctx.geoms.get(b)?.levels && b.includes("#")) continue;
    const r = ctx.extent(b);
    // a bevel gear stands where its cone says, so its points are drawn where the kinematics put them
    if (!r || ctx.geoms.get(b)?.exact) continue;
    const n = r.frame.z;
    const o = r.frame.o;
    lifts[b] = [n[0], n[1], n[2], n[0] * o[0] + n[1] * o[1] + n[2] * o[2] + r.w1];
  }
  return {
    id: ctx.id,
    solids,
    notes: ctx.notes,
    routes: ctx.routes,
    covers: Object.fromEntries(ctx.covers),
    fired: ctx.fired,
    issues: ctx.issues,
    poseRoute: ctx.source.route,
    poseNotes: ctx.source.notes,
    ...(polish ? { polish } : {}),
    placement: { slabs: ctx.placement.height, stackMm: ctx.placement.stackMm, clevis: ctx.placement.clevis.length, slabOf },
    lifts,
  };
}
