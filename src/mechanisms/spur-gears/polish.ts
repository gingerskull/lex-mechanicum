// Overrides and additions to the generated spur gear assembly (standard 5.2). The rules straddle mount both shafts
// (A9): nothing sweeps over the gears, so each runs up into a floating bearing in a bridge, the output's top bearing in
// an eccentric turned with the one under its housing (F7). What differs from the rules:
// - an output flange with four tapped holes on the output shaft above the bridge, where the load is coupled;
// - six spokes in the gear (M2), notes, badges and build rules (A16).
import type { Polish } from "../../assemble/api";
import { locking } from "../../rules/locking";
import { materials } from "../../rules/materials";
import { m, z2 } from "./model";

/** Output flange: Ø, thickness, tapped holes on their circle. */
const FL = { R: 17, t: 6, holes: 4, M: 4, pcd: 12 };
const SPOKES = 6;

export const polish: Polish = (A, H) => {
  const ctx = A.ctx;
  const rule = ctx.rule;
  ctx.rule = "polish";
  const gear = A.get("gear")!;

  // ---- the output flange on the free shaft end above the bridge ----
  H.outputCoupling(A, "p2", FL);

  // ---- M2: six spokes; the rim keeps 2 modules under the tooth roots, the hub 8 mm round the bore ----
  const rRoot = (m * z2) / 2 - 1.25 * m;
  gear.holes.push(...H.spokes({ rIn: ctx.pinJoint("p2")!.d / 2 + 4.5 + 8, rOut: rRoot - 2 * m, n: SPOKES, half: 4, fillet: 3 }));
  locking.apply(ctx);
  materials.apply(ctx);
  ctx.rule = rule;

  // ---- A16 ----
  A.joint("p2", { note: `${A.joint("p2").note} Above the bridge, a keyed flange with four M${FL.M} tapped holes takes the load.` });
  A.rules.push(
    { title: "Carried on both sides", text: "Nothing sweeps over the gears, so each shaft runs from its housing below to a floating bearing in the bridge above: no overhung gear." },
    { title: "One end locates, the other floats", text: "The housing pair locates each shaft axially; the bridge bearings slide on their shafts, so the three bearings never fight." },
    { title: "Backlash set at both ends", text: "Eccentric bushings under the output housing and in the bridge are turned together to set the backlash, then clamped." },
    { title: "Marked to go back in phase", text: "Match marks on the two teeth that meet at the line of centres." },
    { title: "Kinematics untouched", text: "Tooth profiles, pitch circles and the centre distance are the model's; hubs, spokes and the flange are designed round them." },
  );
};
