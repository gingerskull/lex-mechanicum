// Overrides and additions to the generated bell crank assembly (standard 5.2). The layers, the plating and the lever's
// clevis (a front plate twinned with the rear one) are the model's; the rules build every stack on them: a dead axle and
// bridge at O, shoulder bolts at A, B, S and G, a slide with its keeper, gib, wipers, nipple and end stops under each
// slider, stops for the lever, the base and the drive. What differs from the rules:
// - the lever's swing engraved on the base with an index line on the front plate (F9);
// - notes, badges and build rules (A16).
import { D2R, arcPts, polar, type Vec2 } from "../../core/geom";
import type { Polish } from "../../assemble/api";
import { swing } from "../../hardware/sub/stops";

const r2 = 40;
const O: Vec2 = [0, 0];

export const polish: Polish = (A) => {
  const ctx = A.ctx;

  // ---- F9: the lever's swing engraved on the base, read off an index line on the front plate beside arm OB. The
  // lever goes back on its axle in one way only: the scale shows the rods went back on at the modelled angle ----
  const sw = swing(ctx, ctx.parts["lever"]!)!;
  const base = A.get("base")!;
  const R0 = r2 + 16;
  for (let t = Math.ceil(sw[0] / D2R / 5) * 5; t <= sw[1] / D2R + 0.01; t += 5)
    base.marks.push({ kind: "scale", pts: [polar(R0, t * D2R, ...O), polar(R0 + (t % 15 === 0 ? 5 : 2.6), t * D2R, ...O)] });
  base.marks.push({ kind: "scale", pts: arcPts(O[0], O[1], R0, sw[0], sw[1], Math.PI / 90) });
  A.get("lever-front")!.marks.push({ kind: "index", pts: [[r2 + 8.5, 0], [r2 + 11.7, 0]] });
  (A.joint("pO").serves.F9 ??= []).push("base", "lever-front");

  // ---- A16: notes, badges, build rules ----
  const sz = (id: string) => A.get(id)?.name ?? "";
  A.joint("pO", {
    note: `${A.joint("pO").note} Both lever plates turn on this one axle, held by the base and the bridge: the plates are spaced by the axle stack, and the rods pass between them, so the lever is a clevis at A and B.`,
    badge: ["both ends held", "ok"],
  });
  A.joint("pA", {
    note: `Clevis: the front lever plate straddles the input rod's end, so the pin works in double shear. ${sz("pA-bolt")} threaded through the rear plate, shoulder through a plain hole in the front plate under the head; the rod's bearing sits between inner-race spacers.`,
    badge: ["double shear", "ok"],
  });
  A.joint("pB", {
    note: `Clevis as at A: the lever plates straddle the output rod. ${sz("pB-bolt")} threaded through the rear plate, shoulder through a plain hole in the front plate; the rod's bearing sits between inner-race spacers.`,
    badge: ["double shear", "ok"],
  });
  A.joint("pS", {
    note: `Single shear is forced: the keeper laps the carriage, so no plate can sit above the rod's end. The rod rides 1.5 mm over the keeper, the overhang is the shortest the stack allows, and the bearing sits between inner-race spacers. ${sz("pS-bolt")}.`,
    badge: ["single shear", "warn"],
  });
  A.joint("pG", {
    note: `Single shear, forced as at the input carriage: the output slider is lapped by its keeper. ${sz("pG-bolt")}; the load goes rod, bearing, bolt, slider, rails, base.`,
    badge: ["single shear", "warn"],
  });
  A.rules.push(
    { title: "Rods between the lever plates", text: "The lever is two twinned plates, rear under the rods and front over them: A and B work in double shear. The rods sit 5 mm under their layer, clear over the keepers that lap the sliders." },
    { title: "Rods long against the arms", text: "The rods are 120 and 100 mm against arms of 60 and 40: the input stays within 3.6 mm of its line and the output within 2.4 mm of its guide at the ends, so the motion stays near linear." },
    { title: "Exact arms", text: "The arm lengths 60 and 40 set the 1.5 : 1 advantage and the 90° between them is the lever plate's shape; centres are the model's and are not shortened by any plating." },
    { title: "Slides at both ends", text: "Each slider has a dowelled reference rail, a gib under the keeper, a wiper at each end, a nipple and an end stop block each side, outside the travel." },
    { title: "Set to the scale", text: "The lever's swing is engraved on the base. With the carriage at mid travel the index line sits on the scale's zero and the output rod is vertical." },
  );
};
