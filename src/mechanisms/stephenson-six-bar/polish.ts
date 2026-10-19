// Overrides and additions to the generated Stephenson six-bar assembly (standard 5.2). The plating, the layer order and
// the tapered links are the model's; the rules build every stack on them. What differs from the rules:
// - the rocker pivot O4: the ternary coupler and the dyad link both sweep over it, so the rules' bridge (which stands
//   above every sweep) would put the axle through them. The axle ends on a circlip just above the rocker's bearing and
//   the coupler runs clear over it, as on the locomotive drive's wheel axles;
// - the output rocker's swing engraved on the base with an index line on it (F9);
// - notes, badges and build rules (A16).
import { D2R, arcPts, polar, type Vec2 } from "../../core/geom";
import type { Polish } from "../../assemble/api";
import { bearingName } from "../../hardware/primitives";
import { swing } from "../../hardware/sub/stops";
import { locking } from "../../rules/locking";
import { materials } from "../../rules/materials";

const f = 40;
const O6: Vec2 = [-20, -50];

export const polish: Polish = (A, H) => {
  const ctx = A.ctx;
  const rule = ctx.rule;
  ctx.rule = "polish";

  // ---- O4: no bridge. The rules' bridge, its posts and the sleeve up to it come out; the axle stops at the rocker ----
  const pid = "pO4";
  const brg = A.get(`${pid}-rocker1-brg`)!;
  const s2 = A.get(`${pid}-axle-s2`)!;
  const zc = brg.z1;
  A.drop(new RegExp(`^${pid}-(bridge|sp-top)`));
  A.drop(`${pid}-axle-shim`);
  A.drop(`${pid}-axle-head`);
  A.drop(`${pid}-axle-s2`);
  ctx.joints.splice(0, ctx.joints.length, ...ctx.joints.filter((j) => j.id !== `${pid}-bridge-post`));
  const exA = brg.ex + 1.5;
  const G = { body: s2.body, at: s2.at, ex: exA, joints: [pid], group: `${pid}-axle`, mat: s2.mat };
  H.shaft(`${pid}-axle-up`, { d: 10, z0: s2.z0, z1: zc + 1.4, grooves: [zc] }, { ...G, name: "" }).forEach((s) => A.add(s));
  A.add(H.circlip(`${pid}-axle-cl`, 10, { body: s2.body, at: s2.at, z0: zc, z1: zc + 1, ex: exA, joints: [pid], name: "External circlip DIN 471, Ø10" }));
  for (const s of A.find(new RegExp(`^${pid}-axle(-s1)?$`))) s.ex = exA;
  A.set(`${pid}-axle`, { name: "Stub axle Ø10, shouldered, circlip groove, M8 thread through the base, M8 nyloc underneath" });
  // the bearing is sealed: no bridge above to oil it from
  if (brg.closure === "open")
    Object.assign(brg, { closure: "seal", name: bearingName(brg.d!, brg.D!, "seal", !!A.get(`${pid}-rocker1-brg-fl`)), mat: "Bearing steel 100Cr6, rubber seals" });

  locking.apply(ctx);
  materials.apply(ctx);
  ctx.rule = rule;

  // ---- F9: the output rocker's swing engraved on the base, read off an index line on its tip. A six-bar goes back
  // together on more than one branch; the scale shows it went back on the modelled one ----
  const sw = swing(ctx, ctx.parts["rocker2"]!)!;
  const base = A.get("base")!;
  const R0 = f + 13;
  for (let t = Math.ceil(sw[0] / D2R / 5) * 5; t <= sw[1] / D2R + 0.01; t += 5)
    base.marks.push({ kind: "scale", pts: [polar(R0, t * D2R, ...O6), polar(R0 + (t % 15 === 0 ? 5 : 2.6), t * D2R, ...O6)] });
  base.marks.push({ kind: "scale", pts: arcPts(O6[0], O6[1], R0, sw[0], sw[1], Math.PI / 90) });
  A.get("rocker2")!.marks.push({ kind: "index", pts: [[f + 6, 0], [f + 9.2, 0]] });
  (A.joint("pO6").serves.F9 ??= []).push("base", "rocker2");

  // ---- A16: notes, badges, build rules ----
  const sz = (id: string) => A.get(id)?.name ?? "";
  A.joint("pO2", {
    note: `${A.joint("pO2").note} Support can only come from behind: the coupler sweeps straight over this hub.`,
  });
  // the bridge's posts, spigots and oil sink are gone: what serves the locate, retain and thrust functions now
  Object.assign(A.joint("pO4").serves, { F2: [`${pid}-axle-cl`, `${pid}-rocker1-cl0`], F4: [`${pid}-sp0-tw`] });
  delete A.joint("pO4").serves.F1;
  delete A.joint("pO4").serves.F8;
  A.joint("pO4", {
    note: `Stub axle Ø10 shouldered into the base, M8 nyloc underneath. The rocker carries a sealed bearing between a circlip below and an external circlip on the axle end; the ternary coupler and the dyad link both sweep over this axle, so there is no bridge: nothing stands above the rocker and the coupler clears the axle end by 1.1 mm.`,
    badge: ["single shear", "warn"],
  });
  A.joint("pA", {
    note: `${A.joint("pA").note} Single shear is forced: the coupler sweeps over the crank's input boss, so no clevis or bridge fits; the coupler is plated low so the overhang is 2.5 mm.`,
    badge: ["single shear", "warn"],
  });
  A.joint("pB", {
    note: `${A.joint("pB").note} Single shear: the coupler sweeps over the rocker and its pivot, so nothing can stand above it at B. ${sz("pB-bolt")}.`,
    badge: ["single shear", "warn"],
  });
  A.joint("pP", {
    note: `${A.joint("pP").note} The dyad link rides over the coupler: single shear, the shortest overhang the stack allows.`,
    badge: ["single shear", "warn"],
  });
  A.joint("pD", {
    note: `${A.joint("pD").note} The dyad link rides over the output rocker: single shear, no plane above to carry a second plate.`,
    badge: ["single shear", "warn"],
  });
  A.rules.push(
    { title: "Rocker under the coupler", text: "The ternary coupler sweeps over the rocker pivot O4, so the rocker takes the base plane, the coupler the next and the dyad link the one above: nothing stands above O4 and its axle is a stub." },
    { title: "Dyad link over the coupler", text: "Link PD rides over the coupler at P and over the output rocker at D, so both pins are single shear with the shortest overhang the stack allows." },
    { title: "Spacers on inner races only", text: "Every bearing is clamped through its inner race, so tightening a bolt never squeezes a moving part." },
    { title: "Stops outside the swings", text: "Rubber-faced stop posts 2° beyond each end of both rockers' travel: untouched in running, they catch a rocker with the belt off." },
    { title: "Kinematics untouched", text: "Pin centres are the solver's; plating heights, outlines and hardware are designed around them. The branch is the same all cycle: the scale on the base shows the output rocker went back on it." },
  );
};
