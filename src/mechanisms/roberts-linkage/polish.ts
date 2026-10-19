// Overrides and additions to the generated Roberts' linkage assembly (standard 5.2). The plating (coupler down, right rocker up) and
// the tapered rockers are the model's; the rules build every stack on them. What differs from the rules:
// - the ground length 2b adjustable at O2 by an eccentric bushing in the base (F7, Appendix A): the straight line holds
//   only at the exact ratios 100 : 70 : 70 : 50, so the pivot is set on the bench; drawn at its set point, the centre
//   stays exact;
// - no bridge over O2: the coupler apex sweeps over that pivot at the end of the stroke, so the axle is held by the
//   base and the eccentric, with its head just over the bearing (A11, as the Whitworth O3);
// - the drive lever widened to a full wall round the Ø10 shaft (M6);
// - a pair of stops for the input rocker, which the rules skip (its drive limits it) (F5);
// - the left rocker's swing engraved on the base with an index line on its tip (F9);
// - notes, badges and build rules (A16).
import { D2R, arcPts, polar, roundedPoly, type Vec2 } from "../../core/geom";
import type { Polish } from "../../assemble/api";
import { swing } from "../../hardware/sub/stops";
import { locking } from "../../rules/locking";
import { materials } from "../../rules/materials";

const r = 70;
const O1: Vec2 = [-50, 0];
const O2: Vec2 = [50, 0];

export const polish: Polish = (A, H) => {
  const ctx = A.ctx;

  // ---- F7: the offset between the pivots is the one adjustable dimension; the eccentric bushing turns O2 ----
  const pO2 = ctx.pinJoint("pO2")!;
  H.eccentricMount(A, "pO2", { at: O2, d: pO2.d });

  // ---- A14: the coupler apex sweeps over O2 at the end of the stroke, so the rule's bridge, posts and axle head come
  // out: the axle stops 1.6 mm over the bearing flange, held by an external circlip, under the coupler (A11) ----
  const rule0 = ctx.rule;
  ctx.rule = "polish";
  A.drop(/^pO2-bridge/);
  A.drop("pO2-axle-shim");
  A.drop("pO2-axle-head");
  const brg = A.get("pO2-rockerR-brg-fl")!;
  const s2 = A.get("pO2-axle-s2")!;
  const zc = brg.z1;
  A.set("pO2-sp-top", { z1: zc, name: "Inner-race spacer 10.2x13.1", kind: "spacer", span: undefined });
  A.drop("pO2-axle-s2");
  H.shaft("pO2-axle-up", { d: 10, z0: s2.z0, z1: zc + 1.6, grooves: [zc] }, { body: s2.body, at: s2.at, ex: s2.ex, joints: ["pO2"], group: "pO2-axle", mat: s2.mat, name: "" }).forEach((x) => A.add(x));
  A.add(H.circlip("pO2-axle-cl", 10, { body: s2.body, at: s2.at, z0: zc, z1: zc + 1, ex: s2.ex, joints: ["pO2"], name: "External circlip DIN 471, Ø10" }));
  for (const t of A.find((x) => x.joints.includes("pO2") && x.kind === "bearing" && x.closure === "open")) A.set(t.id, { closure: "shield" });
  const J2 = A.joint("pO2");
  J2.serves.F1 = ["pO2-axle", "pO2-axle-up"];
  J2.serves.F2 = [...(J2.serves.F2 ?? []), "pO2-axle-cl"];
  delete J2.serves.F8;
  ctx.joints.splice(0, ctx.joints.length, ...ctx.joints.filter((j) => j.id !== "pO2-bridge-post"));
  ctx.rule = rule0;

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
    note: `${A.joint("pO1").note} Oscillating input: the shaft carries the drive lever below the base and two stops stand 2° beyond the ends of the 34° swing. The rocker sweeps over nothing here, so the support comes from the housing behind it.`,
  });
  A.joint("pO2", {
    note: `${A.joint("pO2").note} The coupler apex sweeps over this pivot at the end of the stroke, so there is no bridge: the axle is held by the base and the eccentric bushing, and ends 1.6 mm over the bearing flange in a circlip. Turn the bushing to set the ground length 2b exactly (the drawing is at the set point), then clamp it with its two screws.`,
    badge: ["held at the base", "warn"],
  });
  A.joint("pB1", {
    note: `Single shear is forced: the coupler sweeps over the left rocker tip and nothing can sit above it. ${sz("pB1-bolt")} threaded through the left rocker; the coupler rides 1.7 mm over its layer to clear the O2 axle circlip, and a spacer closes the gap to the rocker. The bearing sits between inner-race spacers.`,
    badge: ["single shear", "warn"],
  });
  A.joint("pC1", {
    note: `Single shear is forced: the coupler sweeps over the right rocker tip and nothing can sit above it. ${sz("pC1-bolt")} threaded through the right rocker; the coupler bearing sits between inner-race spacers.`,
    badge: ["single shear", "warn"],
  });
  A.rules.push(
    { title: "Rockers on the base layer, coupler above", text: "The two rockers never meet in the swing, so they share one plane; the coupler rides above both. The right rocker is raised 2 mm so the eccentric's flange and screws pass under it; the coupler is raised 1.7 mm so the apex clears the O2 axle end." },
    { title: "Exact ratios 100 : 70 : 70 : 50", text: "Ground 100, rockers 70, coupler base 50 and sides 70. The ground length is set by an eccentric bushing at O2; the drawing shows it at the set point, so the pin centres stay the model's." },
    { title: "No bridge over O2", text: "The coupler apex runs over O2 at the end of the stroke, so the dead axle is held by the base and its eccentric and ends in a circlip under the coupler. Both coupler pins are single shear for the same reason." },
    { title: "Stops outside the swing", text: "Rubber-faced stop posts 2° beyond each end of both rockers' travel catch them with the drive off." },
    { title: "Kinematics untouched", text: "Pin centres are the solver's; plating heights, outlines and hardware are designed around them." },
  );
};
