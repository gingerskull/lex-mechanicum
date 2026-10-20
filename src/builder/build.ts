// The hardware builder's entry point: a catalogue record in, a v3 assembly out. Reads the record's joints, places the
// bodies, builds every joint from its kit, routes the supports against the swept volumes, and gives every solid the frame
// of the body it rides. Build time, Node only.
import type { Solid3 } from "../solids/types";
import { createCtx, type RecordLike, type BuildCtx, type BuildOpts, type JointNote, type RouteLog } from "./ctx";
import { moveFrame, toBody } from "./frames";
import { applyPolish, type Polish, type PolishApi } from "./polish";
import { rules, runRules } from "./registry";
import type { Rule } from "./rules/types";
import { xf } from "../kin/math";

export interface Assembly {
  id: string;
  /** Solids in the frames of the bodies they ride (ground: the world). */
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
  ctx.rule = "polish";
}

function assemble(ctx: BuildCtx, polish?: PolishApi["log"]): Assembly {
  const bodyFrame = (id: string) => ctx.S.bodyFrame.get(id) ?? xf.id();
  const solids = ctx.solids.map((s) => (s.body === "ground" ? s : { ...s, frame: toBody(bodyFrame(s.body), s.frame) }));
  void moveFrame;
  const slabOf: Record<string, number> = {};
  for (const [b, [, s]] of ctx.placement.slab) slabOf[b] = s;
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
  };
}
