// The rules in the order they run (standard 5.1), and the AUTO table the standard's tier rows are generated from. Every
// rule has a fixture, a record the registry test builds to see the rule fire (A21).
import type { BuildCtx } from "./ctx";
import { contactRules } from "./rules/contacts";
import { base, classify, placement } from "./rules/core";
import { bendSlots } from "./rules/bend";
import { adjustableLength, cableClip } from "./rules/fixes";
import { covers, drive, fasteners, feet, headroom, locking, lubrication, materials, seeThrough, standoffs, stops, timingMarks, traceMarks } from "./rules/shared";
import { explode } from "./rules/explode";
import { j1, j10, j2, j3 } from "./rules/stacks";
import { crossBearings } from "./rules/cross";
import { lugs, posts } from "./rules/lugs";
import { wheels } from "./rules/wheels";
import { pistonBore, trunnion } from "./rules/cylinder";
import { ringCarrier } from "./rules/ring";
import { eccentricBearing, pinHole, pinRing } from "./rules/cycloid";
import { spiderPin } from "./rules/differential";
import { ballSocket } from "./rules/slipper";
import { j11 } from "./screws";
import { j13 } from "./compliant";
import { j12 } from "./flexible";
import { cvt } from "./cvt";
import { integrator } from "./integrator";
import { friction } from "./friction";
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
  // before the base: its slots are holes the base outline grows over
  bendSlots,
  base,
  posts,
  wheels,
  byId("j6-mesh"),
  friction,
  byId("j9-crossed-mesh"),
  // a tongue's slot hardware turns with its hub: built before the stacks, so a bridge is routed clear of it
  byId("tongue-slot"),
  // a belt or chain loop first: the stacks' bridges are routed clear of what it carries round
  j12,
  cvt,
  integrator,
  j3,
  j2,
  j10,
  crossBearings,
  byId("oblique-journal"),
  trunnion,
  pistonBore,
  ringCarrier,
  eccentricBearing,
  pinRing,
  pinHole,
  spiderPin,
  ballSocket,
  byId("j4-slot-roller"),
  byId("pin-lobe"),
  byId("groove-cam"),
  byId("j5-slide"),
  byId("j7-cam"),
  byId("pallet-contact"),
  byId("fork-pin"),
  byId("pawl-tooth"),
  byId("ring-hub"),
  byId("eccentric"),
  byId("die"),
  byId("hub"),
  byId("leg-bore"),
  byId("ring-rollers"),
  byId("j8-belt"),
  byId("j12-other"),
  byId("strap-sheave"),
  j11,
  j13,
  j1,
  stops,
  drive,
  adjustableLength,
  cableClip,
  standoffs,
  covers,
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

/** The rules' last step, on the complete build (after the polish and the bodies' own parts). */
export function runLast(ctx: BuildCtx, list: Rule[] = rules): void {
  for (const r of list) {
    ctx.rule = r.id;
    if (r.applies(ctx)) r.last?.(ctx);
  }
  ctx.rule = "polish";
}

/** Every rule and stage with the standard ids it serves. */
export function autoTable(): { id: string; ids: string[] }[] {
  return [...rules.map((r) => ({ id: r.id, ids: r.ids })), ...PROVIDERS];
}
