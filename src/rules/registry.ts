// The rules in the order they run (standard 5.1), and the AUTO table the standard's tier rows are generated from.
import { base } from "./base";
import { classify } from "./classify";
import { drive } from "./drive";
import { feet } from "./feet";
import { j1 } from "./j1-dead-axle";
import { j2 } from "./j2-live-shaft";
import { j2Straddle } from "./j2-straddle";
import { j3 } from "./j3-moving-pin";
import { j4 } from "./j4-slot-roller";
import { j5 } from "./j5-slide";
import { j6 } from "./j6-mesh";
import { j7 } from "./j7-cam";
import { j8 } from "./j8-belt";
import { j9 } from "./j9-crossed-mesh";
import { j10 } from "./j10-shaft-in-plan";
import { j11 } from "./j11-screw";
import { j12 } from "./j12-flexible";
import { j13 } from "./j13-compliant";
import { locking } from "./locking";
import { lubrication } from "./lubrication";
import { materials } from "./materials";
import { standoffs } from "./standoffs";
import { stops } from "./stops";
import { timingMarks } from "./timing-marks";
import type { Rule, RuleContext } from "./types";

/**
 * Order matters: the mesh rule asks J2 for hubs and an eccentric before the shafts are built; the bridges (J1) are
 * placed after every moving pin's hardware exists; shafts in plan (J10) after the live shafts, then the crossed meshes
 * (J9) that shim the gears on both kinds and the screws (J11) on their shafts in plan; the drive after every housing;
 * the straddle bridges over live gear
 * shafts after the drive, whose motor they keep clear of; the feet after everything that hangs under the base;
 * lubrication, timing, locking and materials last, over everything.
 */
export const rules: Rule[] = [classify, base, j6, j2, j10, j9, j11, j3, j4, j5, j7, j1, stops, standoffs, drive, j8, j12, j13, j2Straddle, feet, lubrication, timingMarks, locking, materials];

/** Stages and code outside the rule list that serve AUTO requirements. */
export const PROVIDERS: { id: string; ids: string[] }[] = [
  { id: "fasteners (stage 3)", ids: ["A8", "M4"] },
  { id: "headroom", ids: ["A13"] },
  { id: "see-through", ids: ["L5"] },
  { id: "explode", ids: ["E1", "E2", "E3", "E5", "E6", "E7", "E8"] },
  { id: "hardware primitives", ids: ["A13", "M1", "M3", "M5", "M11", "R3"] },
  { id: "checks (clearance, clamp, edge distance)", ids: ["A12", "A15", "M6"] },
];

export function runRules(ctx: RuleContext, list: Rule[] = rules): void {
  for (const r of list) {
    ctx.rule = r.id;
    if (r.applies(ctx)) r.apply(ctx);
  }
  ctx.rule = "polish";
}

/** Every rule and stage with the standard ids it serves. */
export function autoTable(): { id: string; ids: string[] }[] {
  return [...rules.map((r) => ({ id: r.id, ids: r.ids })), ...PROVIDERS];
}
