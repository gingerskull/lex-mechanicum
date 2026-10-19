// Overrides and additions to the generated rhombic drive assembly (standard 5.2). The layer order (gears, rods plated
// 4 mm up on layers 1 and 2, yokes and rails on layer 4) is the model's; the rules build every stack, the gear mesh
// (hubs, eccentric, marks), both slides and the drive on it. The polish only records why it is built this way (A16): no
// window in the gears (the crank pin bosses fill them) and no clevis at the yokes (the rods sweep over every pin).
import type { Polish } from "../../assemble/api";

export const polish: Polish = (A) => {
  const sz = (id: string) => A.get(id)?.name ?? "";
  A.joint("pG1", {
    note: `${A.joint("pG1").note} Gear 1 takes the drive; the rods sweep over the shaft's top, so the support comes from the housing behind it and the shaft end is flush under the rods.`,
  });
  A.joint("pG2", {
    note: `${A.joint("pG2").note} Gear 2 turns on its own housing, the mesh locking its phase; the eccentric under the housing sets the backlash.`,
  });
  for (const j of ["pPL", "pPR"])
    A.joint(j, {
      note: `Crank pin: ${sz(`${j}-bolt`)} threaded into the gear, a bearing in each of the two rods on it (one on layer 1, one on layer 2) between inner-race spacers. Single shear is forced: the rods sweep over the gear and each other.`,
      badge: ["single shear", "warn"],
    });
  for (const j of ["pT", "pBt"])
    A.joint(j, {
      note: `Yoke pin: ${sz(`${j}-bolt`)} threaded into the lower rod, a bearing in the upper rod and in the yoke, between inner-race spacers. The yoke rides on layer 4, over the rods, because the rails beside the axis meet the gear tips below it.`,
      badge: ["stacked", "warn"],
    });
  A.rules.push(
    { title: "Two layers of rods, split where they meet", text: "Rods 1 and 4 ride one layer, rods 2 and 3 the next, so the two rods on each crank pin and at each yoke are on different layers; rods on one layer are always apart (one above, one below the gear line)." },
    { title: "Yokes and rails over everything", text: "The axis between the gears runs through the gear tip circles and the rails beside it meet the tips, so the yokes and their rails stand on layer 4 above the rods, the rails on pads where nothing passes under." },
    { title: "Rods clear the shaft ends", text: "The rods are plated 4 mm up so they pass over the gear hubs, the set screws and the shaft ends; nothing is raised only to clear something else." },
    { title: "Backlash and phase", text: "An eccentric under gear 2's housing sets the backlash; match marks at the mesh and a half-tooth phase on gear 2 put the crank pins back mirrored." },
    { title: "Kinematics untouched", text: "Pin centres, rod lengths and the yoke axis are the solver's; plating, rails and hardware are designed round them." },
  );
};
