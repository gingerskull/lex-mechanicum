// Overrides and additions to the generated scissor-lift assembly (standard 5.2). The clevis (every b bar a rear and a
// front plate, the front a twin), the platform plating and the carriage on the track are the model's; the rules build
// every stack, the slide, the stops and the belt drive on them. What differs from the rules:
// - a height scale engraved on the base with an index on the platform (F9);
// - notes, badges and build rules (A16).
import type { Polish } from "../../assemble/api";
import { H_LOW, H_HIGH } from "./model";

export const polish: Polish = (A) => {
  const base = A.get("base")!;

  // ---- F9: the platform height engraved beside the left column, read off an index line on the platform ----
  const x0 = -14.5;
  for (let H = Math.ceil(H_LOW / 10) * 10; H <= H_HIGH; H += 10) base.marks.push({ kind: "scale", pts: [[x0, H], [x0 - (H % 50 === 0 ? 5 : 2.6), H]] });
  A.get("platform")!.marks.push({ kind: "index", pts: [[-10.5, 0], [-7.3, 0]] });

  // ---- A16: notes, badges, build rules ----
  const sz = (id: string) => A.get(id)?.name ?? "";
  A.joint("pL0", { note: `${A.joint("pL0").note} The first a bar turns on a ground axle: held by the base below and a bridge over it, so both ends of the axle are held.`, badge: ["both ends held", "ok"] });
  A.joint("pR0", {
    note: `The carriage pin is the input: ${sz("pR0-bolt")} threaded into the carriage, a sealed bearing in each b0 plate between inner-race spacers, the front plate held under the head, so the pin is carried at both ends. The belt pushes the carriage.`,
    badge: ["both ends held", "ok"],
  });
  for (const k of ["pM0", "pM1", "pM2", "pL1", "pL2", "pR1", "pR2"])
    A.joint(k, { note: `Clevis: an a bar between the b rear plate and its front plate, so the pin works in double shear. ${A.joint(k).note}`, badge: ["double shear", "ok"] });
  A.joint("pL3", { note: `The top of the last b bar: its two plates and the platform on one pin, double shear between the plates; the platform's bearing sits over the front plate on a spacer. ${A.joint("pL3").note}`, badge: ["double shear", "ok"] });
  A.joint("pR3", {
    note: `Track roller on the stud of the last a bar, running in the platform's slot on hardened wear strips; the slot is 1.5 mm longer than the travel at each end. Single shear: the platform has to sit clear above the roller to slide, so the stud is carried by the bar alone and held by the head and the roller's inner race. ${A.joint("pR3").note}`,
    badge: ["single shear", "warn"],
  });
  A.rules.push(
    { title: "Crossings on separate layers", text: "The b rear plates, the a bars and the b front plates each have their own layer, so every crossing clears and each a bar sits between a b plate pair." },
    { title: "Double shear at every bar pin", text: "Clevis at every pivot between bars; only the slotted end of the platform is single shear, for the slot's sake." },
    { title: "Level platform", text: "Equal bars and the pin-in-slot at the top keep the platform level at every span; the slot is cut 1.5 mm past the travel." },
    { title: "Belt-driven carriage", text: "A belt loop under the base along the track pushes the carriage through a slot in the base; rubber end stops sit just past the travel." },
    { title: "Kinematics untouched", text: "Pin centres, bar length, travel and platform height are the model's; plating heights and hardware are designed round them." },
  );
};
