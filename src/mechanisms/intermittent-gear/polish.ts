// Overrides and additions to the generated intermittent gear assembly (standard 5.2). The rules straddle mount both
// shafts (nothing sweeps over the stacks), key the gears, disc and plate on Ø8 D-flats, and find the gear mesh. What
// differs from the rules:
// - six spokes in the driven gear (M2), the member that is started and stopped every turn;
// - a replaceable hardened locking segment on the disc (M14);
// - a drag pack on the driven hub (F6), where the disc locks the plate one way only;
// - notes, badges and build rules (A16).
import type { Polish } from "../../assemble/api";
import { locking } from "../../rules/locking";
import { materials } from "../../rules/materials";
import { RL, cd, m, z2 } from "./model";

const SPOKES = 6;

export const polish: Polish = (A, H) => {
  const ctx = A.ctx;
  const rule = ctx.rule;
  ctx.rule = "polish";
  const driven = A.get("driven")!;

  // ---- M2: six spokes; the rim keeps 2 modules under the tooth roots, the hub 8 mm round the bore ----
  const rRoot = (m * z2) / 2 - 1.25 * m;
  driven.holes.push(...H.spokes({ rIn: ctx.pinJoint("p2")!.d / 2 + 4.5 + 8, rOut: rRoot - 2 * m, n: SPOKES, half: 4, fillet: 3 }));
  // ---- F6: drag pack. The disc locks the plate both ways only through the middle of the dwell: for about 30° after
  // the teeth leave and before they return the arcs hold one way or not at all, and the plate rides in its 0.5 mm
  // clearance. A bronze friction disc on the driven hub's top face, under a wave washer preloaded by the bridge, holds
  // it there ----
  const hub = A.get("driven-hub")!;
  const bridge = A.get("p1-p2-bridge")!;
  H.dragPack(A, "p2", { at: [cd, 0], d: 14, D: 19, z0: hub.z1, z1: bridge.z0, ex: bridge.ex - 0.5, on: "the driven hub", by: "the bridge" });

  // ---- M14: the locking rim is a replaceable hardened segment on the disc, on countersunk screws ----
  H.lockingSegment(A, A.get("disc")!, { r: RL, depth: 4, joint: "p1" });

  locking.apply(ctx);
  materials.apply(ctx);
  for (const id of ["driver", "driven", "disc", "plate"]) A.get(id)!.mat = "Aluminium 6061-T6, hard anodised";
  ctx.rule = rule;

  // ---- A16 ----
  A.joint("p1", { note: `${A.joint("p1").note} The driver gear and its locking disc sit one layer apart on the one shaft, so teeth and locking never share a plane.` });
  A.joint("p2", { note: `${A.joint("p2").note} The driven gear and the locking plate are one stack on the one shaft; the plate's four arcs sit at the dwell angle of the gear.` });
  A.rules.push(
    { title: "Two planes, one shaft each", text: "Gears work on one layer, disc and plate on the layer below, each pair keyed to its own shaft on a D-flat, so the locking and the teeth cannot foul each other." },
    { title: "Shortened end teeth", text: "The first and last of the five teeth are cut down to a tip radius near the pitch circle so they clear the stopped gear's teeth on the way in and out." },
    { title: "Disc relieved for the lobes", text: "The locking disc is cut back where the plate's lobes pass it during the mesh; the relief is taken from the plate's real outline plus 1.2 mm." },
    { title: "Held through the ends of the dwell", text: "The disc locks the plate both ways only through the middle of the dwell; a drag pack (bronze disc, wave washer under the bridge) on the driven hub holds it in the rest, and each shaft is straddle mounted so nothing flexes." },
    { title: "Kinematics untouched", text: "Teeth, pitch circles, the centre distance, disc and arc radii are the model's; spokes and hardware are designed round them." },
  );
};
