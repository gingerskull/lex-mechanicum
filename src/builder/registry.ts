// The rules in the order they run (standard 5.1), and the AUTO table the standard's tier rows are generated from. Every
// rule has a fixture, a record the registry test builds to see the rule fire (A21).
import type { BuildCtx } from "./ctx";
import { contactRules } from "./rules/contacts";
import { base, classify, placement } from "./rules/core";
import { adjustableLength, cableClip } from "./rules/fixes";
import { drive, explode, fasteners, feet, headroom, locking, lubrication, materials, seeThrough, standoffs, stops, timingMarks, traceMarks } from "./rules/shared";
import { j1, j10, j2, j3 } from "./rules/stacks";
import { crossBearings } from "./rules/cross";
import { lugs } from "./rules/lugs";
import { pistonBore, trunnion } from "./rules/cylinder";
import type { Rule } from "./rules/types";

const byId = (id: string): Rule => contactRules.find((r) => r.id === id)!;

/**
 * Order matters: the meshes say which shafts want an eccentric or a shim before the stacks are built; moving pins, live
 * shafts and shafts in plan come first, then the contacts that stand on the base, and the bridges over dead axles last,
 * against everything that is there. The rules with an `after` run again, in this order, once everything has run: the
 * base outline needs the whole assembly, and the fasteners, the see-through stage and the explode need the base.
 */
export const rules: Rule[] = [
  classify,
  placement,
  lugs,
  base,
  byId("j6-mesh"),
  byId("j9-crossed-mesh"),
  // a tongue's slot hardware turns with its hub: built before the stacks, so a bridge is routed clear of it
  byId("tongue-slot"),
  j3,
  j2,
  j10,
  crossBearings,
  trunnion,
  pistonBore,
  byId("j4-slot-roller"),
  byId("pin-lobe"),
  byId("groove-cam"),
  byId("j5-slide"),
  byId("j7-cam"),
  byId("pallet-contact"),
  byId("fork-pin"),
  byId("pawl-tooth"),
  byId("ring-hub"),
  byId("ring-rollers"),
  byId("j8-belt"),
  byId("j12-flexible"),
  byId("strap-sheave"),
  byId("j11-screw"),
  byId("j13-compliant"),
  j1,
  stops,
  drive,
  adjustableLength,
  cableClip,
  standoffs,
  feet,
  lubrication,
  timingMarks,
  traceMarks,
  locking,
  materials,
  fasteners,
  headroom,
  seeThrough,
  explode,
];

/** Stages and code outside the rule list that serve AUTO requirements. */
export const PROVIDERS: { id: string; ids: string[] }[] = [
  { id: "axial stack builder", ids: ["A20", "A12", "A3", "A4", "A5"] },
  { id: "support router", ids: ["A14", "A19", "T11", "T12"] },
  { id: "placement solver", ids: ["A10", "A18", "A9"] },
  { id: "hardware primitives", ids: ["A13", "M1", "M3", "M5", "M11", "R3"] },
  { id: "checks (clearance, clamp, edge distance)", ids: ["A15", "M6"] },
];

export function runRules(ctx: BuildCtx, list: Rule[] = rules): void {
  for (const r of list) {
    ctx.rule = r.id;
    if (r.applies(ctx)) r.apply(ctx);
  }
  for (const r of list) {
    ctx.rule = r.id;
    if (r.applies(ctx)) r.after?.(ctx);
  }
  ctx.rule = "polish";
}

/** Every rule and stage with the standard ids it serves. */
export function autoTable(): { id: string; ids: string[] }[] {
  return [...rules.map((r) => ({ id: r.id, ids: r.ids })), ...PROVIDERS];
}
