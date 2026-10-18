// Overrides and additions to the generated compound gear train assembly (standard 5.2). The rules straddle mount the
// shafts that nothing sweeps over (A9) and build both meshes (J6). What differs from the rules:
// - the cluster gear's own hub is dropped: the pinion sits directly above it on the same shaft and key, so a hub would
//   run into the pinion (the hub rule builds one per keyed gear and does not see a neighbour on the shaft);
// - an output flange on the free end of the output shaft, above the bridge, where the load is coupled;
// - six spokes in each 36-tooth gear (M2), notes, badges and build rules (A16).
import type { Polish } from "../../assemble/api";
import { locking } from "../../rules/locking";
import { materials } from "../../rules/materials";
import { m, zb, zd } from "./model";

/** Output flange: Ø, thickness, tapped holes on their circle. */
const FL = { R: 19, t: 6, holes: 4, M: 4, pcd: 14 };
const SPOKES = 6;

export const polish: Polish = (A, H) => {
  const ctx = A.ctx;
  const rule = ctx.rule;
  ctx.rule = "polish";

  // ---- the cluster gear carries its pinion directly: no hub of its own ----
  A.drop(/^b-hub/);
  const mesh = A.joint("mesh-a-b");
  mesh.serves.F3 = (mesh.serves.F3 ?? []).filter((s) => !/^b-hub/.test(s));

  // ---- the pinion is fixed to the cluster gear: the shaft, both gears and their keys are one rigid body ----
  const shaftBody = A.get("pB-shaft")!.body;
  for (const s of A.find((t) => t.body === "c")) s.body = shaftBody;

  // ---- the output flange on the free shaft end above the bridge ----
  H.outputCoupling(A, "pD", FL);

  // ---- M2: six spokes in each 36-tooth gear; the rim keeps 2 modules under the tooth roots, the hub 8 mm round the bore ----
  for (const [id, pin, z] of [["b", "pB", zb], ["d", "pD", zd]] as const) {
    const g = A.get(id)!;
    const rRoot = (m * z) / 2 - 1.25 * m;
    g.holes.push(...H.spokes({ rIn: ctx.pinJoint(pin)!.d / 2 + 4.5 + 8, rOut: rRoot - 2 * m, n: SPOKES, half: 4, fillet: 3 }));
  }
  locking.apply(ctx);
  materials.apply(ctx);
  ctx.rule = rule;

  // ---- A16 ----
  A.joint("pD", { note: `${A.joint("pD").note} Above the bridge, a keyed flange with four M${FL.M} tapped holes takes the load.` });
  A.rules.push(
    { title: "Cluster on one shaft", text: "The 36-tooth gear and the 12-tooth pinion above it are keyed to the same shaft with a sleeve between them, so they turn as one body and the second mesh sits a layer above the first." },
    { title: "Carried on both sides", text: "Nothing sweeps over the gears, so each shaft runs from its housing below to a floating bearing in the bridge above: no overhung gear." },
    { title: "Backlash set at the eccentrics", text: "Eccentric bushings under the housings of the driven shafts are turned to set each mesh's backlash, then clamped." },
    { title: "Marked to go back in phase", text: "Match marks on the two teeth that meet at the line of centres of each mesh." },
    { title: "Kinematics untouched", text: "Tooth profiles, pitch circles, the 72 mm centre distances and the 62° second centre line are the model's; hubs, spokes and the flange are designed round them." },
  );
};
