// Overrides and additions to the generated Chebyshev linkage assembly (standard 5.2). The plating (coupler down,
// right rocker up), the crossed layer order and the tapered rockers are the model's; the rules build every stack on
// them. What differs from the rules:
// - the ground length 4s adjustable at O2 by an eccentric bushing in the base (F7, Appendix A): drawn at its set
//   point, the pin centre stays exact;
// - the input shaft end retained by a circlip above the lever, because the drive link passes under the shaft end
//   (rule bug, see the audit); the lever gets a full wall round the shaft;
// - the left rocker's swing engraved on the base with an index line on its tip (F9);
// - notes, badges and build rules (A16).
import { D2R, arcPts, polar, roundedPoly, type Vec2 } from "../../core/geom";
import type { Polish } from "../../assemble/api";
import { swing } from "../../hardware/sub/stops";
import { locking } from "../../rules/locking";
import { materials } from "../../rules/materials";

const r = 150;
const O2: Vec2 = [120, 0];

export const polish: Polish = (A, H) => {
  const ctx = A.ctx;

  // ---- F7: the ground length is the one adjustable dimension; the eccentric bushing turns O2 along the ground line ----
  const pO2 = ctx.pinJoint("pO2")!;
  H.eccentricMount(A, "pO2", { at: O2, d: pO2.d });

  // ---- the drive: the rule puts the motor on the far side of the input shaft, so the link crosses under the shaft
  // end and the retaining washer and screw there would foul it. Retain the lever from above with an external circlip
  // instead; the shaft end is flush with the lever. The lever's wall round the Ø10 bore is under 1.5 mm: widen it ----
  const lever = A.get("drive-lever");
  const rw = A.get("pO1-rw");
  if (lever && rw) {
    const zl = lever.z1;
    for (const id of ["pO1-rw", "pO1-rs", "pO1-rs-sh"]) A.drop(id);
    const d = ctx.pinJoint("pO1")!.d;
    A.add(H.circlip("pO1-lever-cl", d, { body: lever.body, at: [A.pin("pO1")![0], A.pin("pO1")![1], 0], z0: zl, z1: zl + 1, ex: lever.ex, joints: ["pO1"] }));
    Object.assign(lever, { outer: roundedPoly([[0, 0], [22, 0]], 7) });
    const J = A.joint("pO1");
    J.serves.F2 = [...(J.serves.F2 ?? []).filter((x) => x !== "pO1-rs"), "pO1-lever-cl"];
  }

  // ---- F5: the rule skips the input rocker (its drive limits it); with the drive off it would still over-travel, so
  // it gets its own pair of stops 2° beyond each end (Appendix A) ----
  const swL = swing(ctx, ctx.parts["rockerL"]!)!;
  const pO1 = ctx.pinJoint("pO1")!;
  const sL = H.stops(A, { part: ctx.parts["rockerL"]!, pivot: pO1.P, range: swL, joint: "pO1" });
  A.joint("pO1").serves.F5 = [...(A.joint("pO1").serves.F5 ?? []), ...sL];
  // the right rocker's stop that the rule could place carries the bill of materials entry for the pair it stands in for
  for (const id of ["pO2-stop1", "pO2-stop1-sc"]) {
    const s = A.get(id);
    if (s && !s.name) Object.assign(s, { name: id.endsWith("sc") ? "Button head M4 (ISO 7380)" : "Stop bumper, neoprene sleeve Ø12", qty: 1 });
  }

  // ---- M13, M10: the eccentric's screws and the new stops are named and threadlocked like every other fastener (the
  // locking and materials rules ran before the polish) ----
  const rule = ctx.rule;
  ctx.rule = "polish";
  locking.apply(ctx);
  materials.apply(ctx);
  ctx.rule = rule;

  // ---- F9: the swing engraved on the base, read off an index line on the left rocker's tip. A crossed four-bar goes
  // back together on two branches; the scale shows it went back on the modelled one ----
  const sw = swing(ctx, ctx.parts["rockerL"]!)!;
  const base = A.get("base")!;
  const R0 = r + 12;
  for (let t = Math.ceil(sw[0] / D2R / 5) * 5; t <= sw[1] / D2R + 0.01; t += 5)
    base.marks.push({ kind: "scale", pts: [polar(R0, t * D2R), polar(R0 + (t % 15 === 0 ? 5 : 2.6), t * D2R)] });
  base.marks.push({ kind: "scale", pts: arcPts(0, 0, R0, sw[0], sw[1], Math.PI / 90) });
  A.get("rockerL")!.marks.push({ kind: "index", pts: [[r + 6, 0], [r + 9.2, 0]] });
  (A.joint("pO1").serves.F9 ??= []).push("base", "rockerL");

  // ---- A16: notes, badges, build rules ----
  const sz = (id: string) => A.get(id)?.name ?? "";
  A.joint("pO1", {
    note: `${A.joint("pO1").note} Oscillating input: the shaft carries the drive lever below the base, held by a circlip, and two stops stand 2° beyond the ends of the 53° swing. The rocker sweeps over nothing here, so the support comes from the housing behind it.`,
  });
  A.joint("pO2", {
    note: `${A.joint("pO2").note} The axle sits in an eccentric bushing in the base: turn it to set the ground length d = 4s exactly (the drawing is at the set point), then clamp it with its two screws.`,
    badge: ["both ends held", "ok"],
  });
  A.joint("pB", {
    note: `Single shear is forced: the right rocker sweeps over this pin at the end of the stroke, so nothing fits above it. ${sz("pB-bolt")} threaded through the left rocker; the coupler is plated low so the overhang is 1.5 mm, and its bearing sits between inner-race spacers.`,
    badge: ["single shear", "warn"],
  });
  A.joint("pA", {
    note: `Single shear is forced: the left rocker sweeps under this pin at the other end of the stroke. ${sz("pA-bolt")} threaded into the coupler and through the right rocker's bearing; the right rocker is plated 1.5 mm up only as far as the pin B head needs, so the overhang stays short and the two bearings sit far apart.`,
    badge: ["single shear", "warn"],
  });
  A.rules.push(
    { title: "Rockers on layers 0 and 2, coupler between", text: "The rockers cross, and at each end of the stroke a tip pin lies on the other rocker. The coupler rides between them, so each pin only passes through the parts it joins." },
    { title: "Ratio 4 : 5 : 2 is exact", text: "Ground 120, rockers 150, coupler 60. The ground length is set by an eccentric bushing at O2; the drawing shows it at the set point, so the pin centres stay the model's." },
    { title: "Single shear, shortest overhang", text: "Both coupler pins are swept over by a rocker, so no clevis fits. The coupler is plated low over the left rocker for a 1.5 mm overhang at B, and both pins carry two bearings far apart." },
    { title: "Stops outside the swing", text: "Rubber-faced stop posts 2° beyond each end of the left rocker's travel catch it with the drive off." },
    { title: "Kinematics untouched", text: "Pin centres are the solver's; plating heights, outlines and hardware are designed around them." },
  );
};
