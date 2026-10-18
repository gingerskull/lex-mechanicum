// Overrides and additions to the generated Watt six-bar assembly (standard 5.2). The plating, the clevis rockers (a
// front plate twinned with each rear one) and the tapered links are the model's; the rules build every stack on
// them: a live shaft at O2, a dead axle and bridge at O4 and O6 with stops for both rockers, shoulder bolts at A to D,
// the base and the drive. What differs from the rules:
// - the output rocker's swing engraved on the base with an index line on its tip (F9);
// - notes, badges and build rules (A16).
import { D2R, arcPts, polar, type Vec2 } from "../../core/geom";
import type { Polish } from "../../assemble/api";
import { swing } from "../../hardware/sub/stops";

const f = 30;
const O6: Vec2 = [180, 60];

export const polish: Polish = (A) => {
  const ctx = A.ctx;

  // ---- F9: the output rocker's swing engraved on the base, read off an index line on its front plate. Two loops in
  // series assemble on more than one branch each; the scale shows the second loop went back on the modelled one ----
  const sw = swing(ctx, ctx.parts["rocker2"]!)!;
  const base = A.get("base")!;
  const R0 = f + 14;
  for (let t = Math.ceil(sw[0] / D2R / 5) * 5; t <= sw[1] / D2R + 0.01; t += 5)
    base.marks.push({ kind: "scale", pts: [polar(R0, t * D2R, ...O6), polar(R0 + (t % 15 === 0 ? 5 : 2.6), t * D2R, ...O6)] });
  base.marks.push({ kind: "scale", pts: arcPts(O6[0], O6[1], R0, sw[0], sw[1], Math.PI / 90) });
  A.get("rocker2-front")!.marks.push({ kind: "index", pts: [[f + 6, 0], [f + 9.2, 0]] });
  (A.joint("pO6").serves.F9 ??= []).push("base", "rocker2-front");

  // ---- A16: notes, badges, build rules ----
  const sz = (id: string) => A.get(id)?.name ?? "";
  A.joint("pO2", {
    note: `${A.joint("pO2").note} Support can only come from behind: the first coupler sweeps straight over this hub.`,
  });
  A.joint("pA", {
    note: `${A.joint("pA").note} Single shear is forced: the first coupler sweeps over the crank's input boss, so no clevis or bridge fits; the coupler is plated low so the overhang is 1.5 mm, and the input shaft carries the moment on two bearings.`,
    badge: ["single shear", "warn"],
  });
  A.joint("pB", {
    note: `Clevis: the rear and front plates of the ternary rocker straddle the first coupler, so the pin works in double shear. ${sz("pB-bolt")} threaded through the rear plate, shoulder through a plain hole in the front plate under the head; the coupler's bearing sits between inner-race spacers.`,
    badge: ["double shear", "ok"],
  });
  A.joint("pC", {
    note: `Clevis as at B: the same two rocker plates straddle the second coupler. ${sz("pC-bolt")}; the plates are clamped on the shoulder and spaced by the stack.`,
    badge: ["double shear", "ok"],
  });
  A.joint("pD", {
    note: `Clevis: the rear and front plates of the output rocker straddle the second coupler. ${sz("pD-bolt")} threaded through the rear plate, shoulder through a plain hole in the front plate; the coupler's bearing sits between inner-race spacers.`,
    badge: ["double shear", "ok"],
  });
  A.joint("pO4", {
    note: `${A.joint("pO4").note} Both plates of the ternary rocker turn on this one axle, held by the base and the bridge; the couplers pass between them.`,
    badge: ["both ends held", "ok"],
  });
  A.joint("pO6", {
    note: `${A.joint("pO6").note} Both plates of the output rocker turn on this axle, held by the base and the bridge; stops stand 2° beyond each end of the swing.`,
    badge: ["both ends held", "ok"],
  });
  A.rules.push(
    { title: "Rockers clevised, couplers between", text: "Both rockers are twinned plate pairs, rear under the couplers and front over them: B, C and D work in double shear. Only the crank pin A is single shear, because the first coupler sweeps over the crank boss." },
    { title: "Ternary rocker, one rigid unit", text: "The 60 mm and 50 mm arms of the rocker stand 90° apart as one plate pair on one axle: its two loops share the angle, so the plate is cut as one piece and never adjusted." },
    { title: "Two loops, one branch each", text: "The first loop is the upper branch, the second loop the upper branch too: the scale on the base shows the output rocker went back on the modelled one." },
    { title: "Stops outside the swings", text: "Rubber-faced stop posts 2° beyond each end of both rockers' travel: untouched in running, they catch a rocker with the belt off." },
    { title: "Kinematics untouched", text: "Pin centres are the solver's; plating heights, outlines and hardware are designed around them." },
  );
};
