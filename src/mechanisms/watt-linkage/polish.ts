// Overrides and additions to the generated Watt's linkage assembly (standard 5.2). The plating (coupler down), the
// layer order and the tapered rockers are the model's; the rules build every stack on them. What differs from the rules:
// - the ground offset adjustable at O2 by an eccentric bushing in the base (F7, Appendix A): the rocker lengths and the
//   offset must meet the model exactly, so the pivot is set on the bench; drawn at its set point, the centre stays exact;
// - the drive lever widened to a full wall round the Ø10 shaft (M6);
// - a pair of stops for the input rocker, which the rules skip (its drive limits it) (F5);
// - the left rocker's swing engraved on the base with an index line on its tip (F9);
// - notes, badges and build rules (A16).
import { D2R, arcPts, polar, roundedPoly, type Vec2 } from "../../core/geom";
import type { Polish } from "../../assemble/api";
import { swing } from "../../hardware/sub/stops";
import { locking } from "../../rules/locking";
import { materials } from "../../rules/materials";

const r = 90;
const O1: Vec2 = [-90, 30];
const O2: Vec2 = [90, -30];

export const polish: Polish = (A, H) => {
  const ctx = A.ctx;

  // ---- F7: the offset between the pivots is the one adjustable dimension; the eccentric bushing turns O2 ----
  const pO2 = ctx.pinJoint("pO2")!;
  H.eccentricMount(A, "pO2", { at: O2, d: pO2.d });

  // ---- M6: the drive lever's wall round the Ø10 bore is under 1.5 mm with the rule's tip radius: widen it ----
  const lever = A.get("drive-lever");
  if (lever) Object.assign(lever, { outer: roundedPoly([[0, 0], [22, 0]], 7) });

  // ---- F5: the rule skips the input rocker (its drive limits it); with the drive off it would still over-travel, so
  // it gets its own pair of stops 2° beyond each end (Appendix A) ----
  const swL = swing(ctx, ctx.parts["rockerL"]!)!;
  const pO1 = ctx.pinJoint("pO1")!;
  const sL = H.stops(A, { part: ctx.parts["rockerL"]!, pivot: pO1.P, range: swL, joint: "pO1" });
  A.joint("pO1").serves.F5 = [...(A.joint("pO1").serves.F5 ?? []), ...sL];

  // ---- M13, M10: the eccentric's screws and the new stops are named and threadlocked like every other fastener (the
  // locking and materials rules ran before the polish) ----
  const rule = ctx.rule;
  ctx.rule = "polish";
  locking.apply(ctx);
  materials.apply(ctx);
  ctx.rule = rule;

  // ---- F9: the swing engraved on the base, read off an index line on the left rocker's tip. A double rocker goes
  // back together on two branches; the scale shows it went back on the modelled one ----
  const sw = swing(ctx, ctx.parts["rockerL"]!)!;
  const base = A.get("base")!;
  const R0 = r + 12;
  for (let t = Math.ceil(sw[0] / D2R / 5) * 5; t <= sw[1] / D2R + 0.01; t += 5)
    base.marks.push({ kind: "scale", pts: [polar(R0, t * D2R, ...O1), polar(R0 + (t % 15 === 0 ? 5 : 2.6), t * D2R, ...O1)] });
  base.marks.push({ kind: "scale", pts: arcPts(O1[0], O1[1], R0, sw[0], sw[1], Math.PI / 90) });
  A.get("rockerL")!.marks.push({ kind: "index", pts: [[r + 6, 0], [r + 9.2, 0]] });
  (A.joint("pO1").serves.F9 ??= []).push("base", "rockerL");

  // ---- A16: notes, badges, build rules ----
  const sz = (id: string) => A.get(id)?.name ?? "";
  A.joint("pO1", {
    note: `${A.joint("pO1").note} Oscillating input: the shaft carries the drive lever below the base and two stops stand 2° beyond the ends of the 48° swing. The rocker sweeps over nothing here, so the support comes from the housing behind it.`,
  });
  A.joint("pO2", {
    note: `${A.joint("pO2").note} The axle sits in an eccentric bushing in the base: turn it to set the pivot offset exactly (the drawing is at the set point), then clamp it with its two screws.`,
    badge: ["both ends held", "ok"],
  });
  A.joint("pA", {
    note: `Single shear is forced: the coupler sweeps over the rocker tip and nothing can sit above it. ${sz("pA-bolt")} threaded through the left rocker; the coupler must clear the right rocker, which is raised 2 mm for the eccentric at O2, so it sits 3.5 mm over this rocker: a spacer closes the gap, the overhang stays 1.5 mm over the coupler's top face, and the bearing sits between inner-race spacers.`,
    badge: ["single shear", "warn"],
  });
  A.joint("pB", {
    note: `Clevis: the rear and front right-rocker plates straddle the coupler, so the pin works in double shear. ${sz("pB-bolt")} threaded through the rear plate, shoulder through a plain hole in the front plate under the head; the coupler bearing sits between inner-race spacers.`,
    badge: ["double shear", "ok"],
  });
  A.rules.push(
    { title: "Rockers on the base layer, coupler above", text: "The two rockers never meet in the swing, so they share one plane; the coupler rides above both. The right rocker is raised 2 mm so the eccentric's flange and screws pass under it; the base follows the lowest part, so the left rocker cannot rise with it, and the coupler stands 3.5 mm over the left tip and 1.5 mm over the right plate." },
    { title: "Equal rockers, exact offset", text: "Both rockers are 90 mm between centres and the pivots are 180 mm by 60 mm apart. The offset is set by an eccentric bushing at O2; the drawing shows it at the set point, so the pin centres stay the model's." },
    { title: "Double shear at B, single at A", text: "B is a clevis: a front plate on the right rocker, twinned with the rear one. A is single shear because the coupler sweeps over the left rocker tip and nothing fits above it; the bearing sits between inner-race spacers." },
    { title: "Stops outside the swing", text: "Rubber-faced stop posts 2° beyond each end of both rockers' travel catch them with the drive off." },
    { title: "Kinematics untouched", text: "Pin centres are the solver's; plating heights, outlines and hardware are designed around them." },
  );
};
