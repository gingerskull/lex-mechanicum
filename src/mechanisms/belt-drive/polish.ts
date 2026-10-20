// Overrides and additions to the generated belt drive assembly (standard 5.2). The rules build the timing belt (J12:
// its teeth, the small pulley's flanges, the idler on its slotted arm) and straddle mount both shafts (A9). What
// differs from the rules:
// - spokes in the driven pulley (M2);
// - no guard on the open bench, notes and build rules (A16).
import type { Polish } from "../../assemble/api";
import { HTD, N_TEETH, R2 } from "./model";

export const polish: Polish = (A, H) => {
  // ---- M2: the driven pulley starts and stops with the motor: hub and six spokes inside the groove roots ----
  const rRoot = R2 - HTD.pld - HTD.groove.depth;
  A.get("driven")!.holes.push(...H.spokes({ rIn: A.ctx.pinJoint("pO2")!.d / 2 + 4.5 + 8, rOut: rRoot - 7, n: 6, half: 4, fillet: 3 }));

  // ---- A16: notes, build rules ----
  const J = A.joint("flex-belt-0");
  J.note += " The belt runs open, no guard: the bench is open and a guard would hide the working zone.";
  A.rules.push(
    { title: "A whole number of teeth", text: `The centre distance is chosen for ${N_TEETH} belt teeth, so the belt fits the 8 mm pitch exactly and every tooth meets a groove.` },
    { title: "Tension from the idler, not the centres", text: "Both shafts are fixed in their housings and bridges; the idler on the slack span is set across the span on its slotted arm and clamped." },
    { title: "Pulleys carried both sides", text: "The belt pulls both shafts toward each other: each runs from its housing below to a floating bearing in its bridge above, never overhung." },
    { title: "Belt kept on", text: "Flanges on the small pulley and on the idler keep the belt from walking off; the large pulley needs none." },
    { title: "Kinematics untouched", text: "Pitch circles, the centre distance, the belt path and its travel are the model's; teeth, idler and hardware are built round them." },
  );
};
