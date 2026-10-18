// Overrides and additions to the generated Peaucellier-Lipkin assembly (standard 5.2). The layer order (input alone on
// layer 0, the rhombus sides and long arms on 1 to 4) and the tapered links are the model's; the rules build every stack
// on them. What differs from the rules:
// - the ground length OQ = r adjustable at O by an eccentric bushing in the base (F7, Appendix A): the inversion is
//   exact only when C runs on a circle through O, i.e. |QC| = |OQ|; drawn at its set point, the pin centre stays exact;
// - the input shaft end retained by a circlip above the lever, because the drive link passes over the shaft end
//   (rule bug, see the audit); the lever gets a full wall round the shaft;
// - the input arm's swing engraved on the base with an index line on its tip (F9), and its own pair of stops (F5);
// - notes, badges and build rules (A16).
import { D2R, arcPts, polar, roundedPoly, type Vec2 } from "../../core/geom";
import type { Polish } from "../../assemble/api";
import { swing as swingOf } from "../../hardware/sub/stops";
import { locking } from "../../rules/locking";
import { materials } from "../../rules/materials";
import { r } from "./model";

const WINDOW = 85;
const O: Vec2 = [0, 0];
const Q: Vec2 = [r, 0];

export const polish: Polish = (A, H) => {
  const ctx = A.ctx;

  // ---- F7: the ground length OQ is the one adjustable dimension; the eccentric bushing turns O along the ground line ----
  const pO = ctx.pinJoint("pO")!;
  H.eccentricMount(A, "pO", { at: O, d: pO.d });

  // ---- the drive: the link crosses the input shaft end, so the retaining washer and screw there would foul it.
  // Retain the lever from above with an external circlip instead; the shaft end is flush with the lever. The lever's
  // wall round the Ø10 bore is under 1.5 mm: widen it ----
  const lever = A.get("drive-lever");
  const rw = A.get("pQ-rw");
  if (lever && rw) {
    const zl = lever.z1;
    for (const id of ["pQ-rw", "pQ-rs", "pQ-rs-sh"]) A.drop(id);
    const d = ctx.pinJoint("pQ")!.d;
    A.add(H.circlip("pQ-lever-cl", d, { body: lever.body, at: [ctx.pinJoint("pQ")!.at[0], ctx.pinJoint("pQ")!.at[1], 0], z0: zl, z1: zl + 1, ex: lever.ex, joints: ["pQ"] }));
    Object.assign(lever, { outer: roundedPoly([[0, 0], [22, 0]], 7) });
    const J = A.joint("pQ");
    J.serves.F2 = [...(J.serves.F2 ?? []).filter((x) => x !== "pQ-rs"), "pQ-lever-cl"];
  }

  // ---- A15: the link of the drive swings across the edge of the bracket's belt window; open the window wider (the wall
  // keeps its radii and its top flange, only the arc it covers shrinks) ----
  const wall = A.get("drive-wall");
  if (wall) {
    const Mc: Vec2 = [wall.at[0], wall.at[1]];
    const beta = Math.atan2(Q[1] - Mc[1], Q[0] - Mc[0]);
    const wh = (WINDOW * Math.PI) / 180;
    const RO = 25; // MOTORS.pancake.R
    const RI = RO - 3.5;
    const n = 48;
    const pts: Vec2[] = [];
    for (let i = 0; i <= n; i++) pts.push([RO * Math.cos(beta + wh + ((2 * Math.PI - 2 * wh) * i) / n), RO * Math.sin(beta + wh + ((2 * Math.PI - 2 * wh) * i) / n)]);
    for (let i = n; i >= 0; i--) pts.push([RI * Math.cos(beta + wh + ((2 * Math.PI - 2 * wh) * i) / n), RI * Math.sin(beta + wh + ((2 * Math.PI - 2 * wh) * i) / n)]);
    Object.assign(wall, { outer: pts });
  }

  // ---- F5: the rule skips the input arm (its drive limits it); with the drive off it would still over-travel, so
  // it gets its own pair of stops 2° beyond each end (Appendix A) ----
  const inp = ctx.parts["input"]!;
  const swI = swingOf(ctx, inp)!;
  const pQ = ctx.pinJoint("pQ")!;
  const sI = H.stops(A, { part: inp, pivot: pQ.P, range: swI, joint: "pQ" });
  A.joint("pQ").serves.F5 = [...(A.joint("pQ").serves.F5 ?? []), ...sI];
  // a lone stop that found room carries the bill of materials entry for the pair it stands in for
  const lone = sI.filter((id) => !id.endsWith("-sc"));
  if (lone.length === 1) {
    for (const id of sI) {
      const s = A.get(id);
      if (s && !s.name) Object.assign(s, { name: id.endsWith("-sc") ? "Button head M4 (ISO 7380)" : "Stop bumper, neoprene sleeve �12", qty: 1 });
    }
  }

  // the long arms' stops: the rule found room for two of the three, and the one standing for arm B has no bill of
  // materials entry (rule bug, see the audit): name and count it like its twin
  const sb = A.get("pO-armB-stop1");
  const sbs = A.get("pO-armB-stop1-sc");
  const ref = A.get("pO-stop0-sc");
  if (sb && !sb.name) Object.assign(sb, { name: "Stop bumper, neoprene sleeve �12", qty: 1 });
  if (sbs && !sbs.name) Object.assign(sbs, { name: ref?.name ?? "Button head M4 (ISO 7380)", qty: 1 });

  // ---- M13, M10: the eccentric's screws and the new stops are named and threadlocked like every other fastener ----
  const rule = ctx.rule;
  ctx.rule = "polish";
  locking.apply(ctx);
  materials.apply(ctx);
  ctx.rule = rule;

  // ---- F9: the swing engraved on the base round Q, read off an index line on the input arm's tip. The rhombus goes
  // back together on either branch; the scale shows it went back on the modelled one ----
  const sw = swI;
  const base = A.get("base")!;
  const R0 = r + 12;
  const at = (rad: number, t: number): Vec2 => {
    const p = polar(rad, t);
    return [Q[0] + p[0], Q[1] + p[1]];
  };
  for (let t = Math.ceil(sw[0] / D2R / 5) * 5; t <= sw[1] / D2R + 0.01; t += 5)
    base.marks.push({ kind: "scale", pts: [at(R0, t * D2R), at(R0 + (t % 15 === 0 ? 5 : 2.6), t * D2R)] });
  base.marks.push({ kind: "scale", pts: arcPts(Q[0], Q[1], R0, sw[0], sw[1], Math.PI / 90) });
  A.get("input")!.marks.push({ kind: "index", pts: [[r + 6, 0], [r + 9.2, 0]] });
  (A.joint("pQ").serves.F9 ??= []).push("base", "input");

  // ---- A16: notes, badges, build rules ----
  A.joint("pQ", {
    note: `${A.joint("pQ").note} Oscillating input: the shaft carries the drive lever below the base, held by a circlip, and two stops stand 2° beyond the ends of the 128° swing. The input arm sits alone on the lowest layer, under both long arms.`,
  });
  A.joint("pO", {
    note: `${A.joint("pO").note} The axle sits in an eccentric bushing in the base: turn it to set the ground length OQ = 45 mm exactly (the drawing is at the set point), then clamp it with its two screws. Both long arms turn on it, one above the other.`,
    badge: ["both ends held", "ok"],
  });
  A.rules.push(
    { title: "Five planes, no crossing parts meet", text: "The input arm is alone on the lowest layer; the long arms and the rhombus sides sit on four more, so every pin joins only the parts it carries and no link passes through another." },
    { title: "OQ = QC is exact", text: "The inversion is exact only when the input arm is as long as the ground distance OQ, so C runs on a circle through O. The ground length is set by an eccentric bushing at O; the drawing shows it at the set point." },
    { title: "Rhombus on bearings", text: "A, B, C and D are bearing pins with inner-race spacers in the gaps between the layers; the long arms are l = 125 and the sides q = 55, so D runs on x = 140 mm." },
    { title: "Stops outside the swing", text: "Rubber-faced stop posts 2° beyond each end of the input arm's travel catch it with the drive off." },
    { title: "Kinematics untouched", text: "Pin centres are the solver's; plating heights, outlines and hardware are designed around them." },
  );
};
