// Overrides and additions to the generated Evans' grasshopper assembly (standard 5.2). The layers (radius link 0, beam
// 1, swing link 2), the clevis front plate of the radius link (a twin) and the tapered links are the model's; the rules build every stack on them. What differs from the
// rules:
// - the swing link's ground pivot adjustable by an eccentric bushing in the base (F7, Appendix A): the straight line
//   holds only at the exact lengths 50 : 100 : 200 and the pivot position, so O2 is set on the bench; drawn at its set
//   point, the centre stays exact;
// - a pair of stops for the input link, which the rules skip (its drive limits it) (F5);
// - the radius link's swing engraved on the base with an index line on its tip (F9);
// - notes, badges and build rules (A16).
import { D2R, arcPts, polar, type Vec2 } from "../../core/geom";
import type { Polish } from "../../assemble/api";
import { swing } from "../../hardware/sub/stops";
import { locking } from "../../rules/locking";
import { materials } from "../../rules/materials";
import { a } from "./model";

const O1: Vec2 = [0, 0];
const O2: Vec2 = [200, 60];

export const polish: Polish = (A, H) => {
  const ctx = A.ctx;

  // ---- F7: the pivot of the swing link is the one adjustable dimension; the eccentric bushing turns O2 ----
  const pO2 = ctx.pinJoint("pO2")!;
  H.eccentricMount(A, "pO2", { at: O2, d: pO2.d });

  // ---- F5: the rule skips the input link (its drive limits it); with the drive off it would still over-travel, so it
  // gets its own pair of stops 2° beyond each end (Appendix A) ----
  const swR = swing(ctx, ctx.parts["radius"]!)!;
  const pO1 = ctx.pinJoint("pO1")!;
  const sR = H.stops(A, { part: ctx.parts["radius"]!, pivot: pO1.P, range: swR, joint: "pO1" });
  A.joint("pO1").serves.F5 = [...(A.joint("pO1").serves.F5 ?? []), ...sR];

  // ---- M13, M10: the eccentric's screws and the new stops are named and threadlocked like every other fastener (the
  // locking and materials rules ran before the polish) ----
  const rule = ctx.rule;
  ctx.rule = "polish";
  locking.apply(ctx);
  materials.apply(ctx);
  ctx.rule = rule;

  // ---- F9: the swing engraved on the base, read off an index line on the radius link's tip. A grasshopper goes back
  // together on two branches; the scale shows it went back on the modelled one ----
  const sw = swing(ctx, ctx.parts["radius"]!)!;
  const base = A.get("base")!;
  const R0 = a + 12;
  for (let t = Math.ceil(sw[0] / D2R / 5) * 5; t <= sw[1] / D2R + 0.01; t += 5)
    base.marks.push({ kind: "scale", pts: [polar(R0, t * D2R, ...O1), polar(R0 + (t % 15 === 0 ? 5 : 2.6), t * D2R, ...O1)] });
  base.marks.push({ kind: "scale", pts: arcPts(O1[0], O1[1], R0, sw[0], sw[1], Math.PI / 90) });
  A.get("radius")!.marks.push({ kind: "index", pts: [[a + 6, 0], [a + 9.2, 0]] });
  (A.joint("pO1").serves.F9 ??= []).push("base", "radius");

  // ---- A16: notes, badges, build rules ----
  const sz = (id: string) => A.get(id)?.name ?? "";
  A.joint("pO1", {
    note: `${A.joint("pO1").note} Oscillating input: the shaft carries the drive lever below the base and two stops stand 2° beyond the ends of the 40° swing. The radius link sweeps over nothing here, so the support comes from the housing behind it.`,
  });
  A.joint("pO2", {
    note: `${A.joint("pO2").note} The axle sits in an eccentric bushing in the base: turn it to set the swing link's pivot exactly (the drawing is at the set point), then clamp it with its two screws.`,
    badge: ["both ends held", "ok"],
  });
  A.joint("pM", {
    note: `Clevis: the radius link and its front plate, a twin keyed on the same shaft, straddle the beam, so the pin works in double shear. ${sz("pM-bolt")} threaded through the rear plate, shoulder through the front plate under the head; the beam bearing sits between inner-race spacers.`,
    badge: ["double shear", "ok"],
  });
  A.joint("pB", {
    note: `Single shear is forced: the swing link sits over the beam end and nothing can sit above it. ${sz("pB-bolt")} threaded through the beam; the swing link bearing sits between inner-race spacers.`,
    badge: ["single shear", "warn"],
  });
  A.rules.push(
    { title: "Radius link, beam, swing link on layers 0, 1, 2", text: "The beam crosses over the radius link at M and the swing link crosses over the beam at B, so each pin passes only through the parts it joins. The radius link is a clevis (a front plate, a twin, on the same shaft) so M is in double shear." },
    { title: "Exact lengths 50 : 100 : 200", text: "Radius link 50, beam 100 with the radius pin at its midpoint, swing link 200, and the pivot O2 at (200, 60). The swing link's pivot is set by an eccentric bushing at O2; the drawing shows it at the set point, so the pin centres stay the model's." },
    { title: "Double shear at M, single at B", text: "M is a clevis. B is single shear because the swing link sits over the beam end and nothing fits above it; both pins carry a bearing between inner-race spacers." },
    { title: "Stops outside the swing", text: "Rubber-faced stop posts 2° beyond each end of the radius link's travel catch it with the drive off." },
    { title: "Kinematics untouched", text: "Pin centres are the solver's; plating heights, outlines and hardware are designed around them." },
  );
};
