// Overrides and additions to the generated block-and-tackle assembly (standard 5.2). The rope's parts, wraps, becket
// and its post, hook and swivel, the guards over the upper sheaves, the slides, the drive and every pin stack are the
// model's and the rules'. What differs from them:
// - the fall's eye is spliced round a thimble on the carriage pin (an allowed contact);
// - spoked sheaves (M2: they reverse every stroke, and the spokes show them turn);
// - notes, badges and build rules (A16).
import type { Polish } from "../../assemble/api";

export const polish: Polish = (A, H) => {
  const flex = "flex-rope-0";

  // ---- the fall's eye on the carriage pin, by design ----
  A.set("fall", { allow: [...(A.get("fall")!.allow ?? []), ...A.find(/^pF-/).map((s) => s.id)] });

  // ---- M2: spoked sheaves, hub round the bearing, five arms ----
  for (const id of ["UA", "UB", "LA", "LB"]) A.get(id)!.holes.push(...H.spokes({ rIn: 14, rOut: 23, n: 5, half: 3, fillet: 1.5 }));

  // ---- A16: notes, badges, build rules ----
  A.joint("pU", {
    note: `${A.joint("pU").note.replace(/ No room for stops beyond the U[AB]'s swing\./g, "")} The sheaves need no stops: the rope turns them, a few turns each way.`,
    badge: ["both ends held", "ok"],
  });
  A.joint("pL", {
    note: `The lower block's pin: ${A.joint("pL").note} The top cheek is the bottom cheek's clevis twin, so both sheaves turn between the cheeks and the bolt works in double shear.`,
    badge: ["double shear", "ok"],
  });
  A.joint("pK", {
    note: `Distance bolt under the sheaves: a sleeve between the cheeks sets their spacing and the bolt clamps them. ${A.joint("pK").note}`,
    badge: ["both ends held", "ok"],
  });
  A.joint("pF", {
    note: `The fall's eye is spliced round a thimble on this pin, so the carriage hauls the rope. ${A.joint("pF").note}`,
    badge: ["single shear", "warn"],
  });
  A.joint(flex, {
    note: `Double tackle. ${A.joint(flex).note} The dead end hangs under the upper block and the fall leaves upper sheave B. Parts 1 and 2 run in plane A, part 4 and the fall in plane B, part 3 crosses between them.`,
  });
  A.rules.push(
    { title: "Reeved to a fixed plan", text: "Dead end on the upper block, lower A, upper A, lower B, upper B, fall: four parts carry the block, so the fall moves four times as far as the load." },
    { title: "Three rope heights", text: "Plane A and plane B ropes run in their sheaves' grooves; the crossing part runs between the sheaves, so no two rope parts share a height." },
    { title: "Fall clear of the lower block", text: "The lower block hangs 8 mm right of the upper pin, so the fall runs past the lower sheaves with 4.8 mm to spare." },
    { title: "Guided block", text: "The lower block runs on a slide, the idealised vertical guide; its cheeks and the distance bolt hold both sheaves in double shear." },
    { title: "Kinematics untouched", text: "Tangent points, rope lengths, sheave angles and the fall's travel are the model's; the hardware is built round them." },
  );
};
