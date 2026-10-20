// Overrides and additions to the generated bevel gear assembly (standard 5.2). The rules give the gear a live shaft in a
// housing behind the base (J2), straddle mounted in a bridge (A9), the pinion a shaft in plan in two pillow blocks, both
// behind it since the pinion overhangs the gear, with the pinion held on the shaft end (J10), the mesh its shim packs,
// thrust washers and timing marks (J9), and the drive: a motor beside the pinion's shaft, belted across it to a pulley
// on its free end (V1 to V6). What differs:
// - the gear on a hub and six arms (M2);
// - notes and build rules (A16).
import type { Polish } from "../../assemble/api";
import type { PinJoint } from "../../rules/types";
import { gw, m } from "./model";

export const polish: Polish = (A, H) => {
  const jG = A.ctx.info.find((j): j is PinJoint => j.kind === "pin" && j.id === "pG")!;

  // ---- M2: the gear on a hub and six arms; the rim keeps 2 modules under the roots (the windows taper with the teeth) ----
  const rRoot = gw.d / 2 - 1.25 * m * Math.cos(gw.delta);
  A.get("gear")!.holes.push(...H.spokes({ rIn: jG.d / 2 + 4.5 + 8, rOut: rRoot - 2 * m, n: 6, half: 5, fillet: 3 }));

  // ---- A16 ----
  A.joint("pQ", { note: `${A.joint("pQ").note} The mesh pushes the pinion back onto its shim and thrust washer.` });
  const mesh = A.joint("mesh-pinion-gear");
  mesh.note = `${mesh.note} The teeth are open, greased at assembly (F8). The gear's back face sits on its own thrust washer, the housing's spacer stopping short of it.`;
  A.rules.push(
    { title: "One apex", text: "Both pitch cones must meet at one point: the shim packs behind each gear set its mounting distance, and so the backlash and where the teeth bear." },
    { title: "Pushed away from the apex", text: "The mesh pushes each gear toward its back face: a bronze thrust washer there takes it, on the pinion against the located block's collars, on the gear against the housing." },
    { title: "Pinion overhung, gear straddled", text: "The pinion overhangs the gear, so both its blocks stand behind it, far apart; the gear shaft runs from its housing below to a floating bearing in a bridge above." },
    { title: "Marked to go back in phase", text: "Timing marks on tooth 0 of each gear: the pinion's marked tooth goes in beside the gear's marked tooth." },
    { title: "Kinematics untouched", text: "Cone angles, back-cone teeth and the apex are the model's; blocks, bridge, shims and the drive are fitted round them." },
  );
};
