// Overrides and additions to the generated chain drive assembly (standard 5.2). The rules build the roller chain (J12:
// rollers and link plates, the idler sprocket on its slotted arm) and straddle mount both shafts (A9). What differs from
// the rules:
// - spokes in the driven sprocket (M2);
// - no guard on the open bench, notes and build rules (A16).
import type { Polish } from "../../assemble/api";
import { N_LINKS, R2, SEAT } from "./model";

export const polish: Polish = (A, H) => {
  // ---- M2: the driven sprocket starts and stops with the motor: hub and six spokes inside the seat roots ----
  const rRoot = R2 - SEAT;
  A.get("driven")!.holes.push(...H.spokes({ rIn: A.ctx.pinJoint("pO2")!.d / 2 + 4.5 + 8, rOut: rRoot - 8, n: 6, half: 4, fillet: 3 }));

  // ---- A16: notes, build rules ----
  const J = A.joint("flex-chain-0");
  J.note += " The chain runs open, no guard: the bench is open and a guard would hide the working zone.";
  A.rules.push(
    { title: "A whole number of links", text: `The centre distance is chosen for ${N_LINKS} links, an even number, so the chain closes with a plain connecting link and no offset link.` },
    { title: "Odd teeth on the small sprocket", text: "With 15 teeth on the driver and an even chain, each roller meets a different tooth every turn, so the wear spreads evenly." },
    { title: "Tension from the idler, not the centres", text: "Both shafts are fixed in their housings and bridges; the idler on the slack span is set across the span on its slotted arm and clamped." },
    { title: "Sprockets carried both sides", text: "The chain pulls both shafts toward each other: each runs from its housing below to a floating bearing in its bridge above, never overhung." },
    { title: "Kinematics untouched", text: "Pitch circles, the centre distance, the chain path and its travel are the model's; rollers, plates, idler and hardware are built round them." },
  );
};
