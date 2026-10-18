// Overrides and additions to the generated Hoekens assembly (standard 5.2). The plating, the clevis rocker (its front
// plate a twin of the rear one) and the tapered links are the model's; the rules build every stack on them. What
// differs from the rules:
// - the rear rocker bearing at O4 sealed: it sits under the front plate where no oil reaches it;
// - the rocker's swing engraved on the base with an index line on the rocker (F9);
// - notes, badges and build rules (A16).
import { D2R, arcPts, polar, type Vec2 } from "../../core/geom";
import type { Polish } from "../../assemble/api";
import { bearingName } from "../../hardware/primitives";
import { swing } from "../../hardware/sub/stops";
import { s } from "./model";

const c = 2.5 * s;
const O4: Vec2 = [2 * s, 0];

export const polish: Polish = (A, H) => {
  void H;
  const ctx = A.ctx;
  const pB = ctx.pinJoint("pB")!;

  // O4: the rear bearing sits under the front plate where no oil reaches it, so it is sealed; the front one stays open
  // under the bridge's oil sink
  const rear = A.get("pO4-rocker-brg")!;
  if (rear.closure === "open")
    Object.assign(rear, { closure: "seal", name: bearingName(rear.d!, rear.D!, "seal", !!A.get("pO4-rocker-brg-fl")), mat: "Bearing steel 100Cr6, rubber seals" });

  // ---- F9: the rocker's swing engraved on the base, read off an index line on the rocker tip. A four-bar assembles on
  // two branches; the scale shows at a glance that it went back together on the modelled one ----
  const sw = swing(ctx, ctx.parts["rocker"]!)!;
  const base = A.get("base")!;
  const R0 = c + 13;
  for (let t = Math.ceil(sw[0] / D2R / 5) * 5; t <= sw[1] / D2R + 0.01; t += 5)
    base.marks.push({ kind: "scale", pts: [polar(R0, t * D2R, ...O4), polar(R0 + (t % 15 === 0 ? 5 : 2.6), t * D2R, ...O4)] });
  base.marks.push({ kind: "scale", pts: arcPts(O4[0], O4[1], R0, sw[0], sw[1], Math.PI / 90) });
  A.get("rocker-front")!.marks.push({ kind: "index", pts: [[c + 6, 0], [c + 9.2, 0]] });

  // ---- A16: notes, badges, build rules ----
  const sz = (id: string) => A.get(id)?.name ?? "";
  A.joint("pO2", {
    note: `${A.joint("pO2").note} Support can only come from behind: the coupler sweeps straight over this hub.`,
  });
  A.joint("pA", {
    note: `${A.joint("pA").note} Single shear is forced here: the coupler sweeps over the crank's input boss, so no clevis or bridge fits; the coupler is plated low so the overhang is 1.5 mm, and the input shaft carries the moment on two bearings with centres 15 mm apart.`,
    badge: ["single shear", "warn"],
  });
  A.joint("pB", {
    note: `Clevis: the rear and front rocker plates straddle the coupler, so the pin works in double shear. ${sz("pB-bolt")} threaded through the rear plate, shoulder through a plain Ø${pB.d + 0.2} hole in the front plate under the head; ${sz("pB-coupler-brg")} in the coupler between inner-race spacers. The coupler runs on past B to the tip, a 100 mm free overhang that carries no pin.`,
    badge: ["double shear", "ok"],
  });
  A.joint("pO4", {
    note: `${A.joint("pO4").note} One bearing in each rocker plate: the rear one sealed, where no oil reaches it; the front one open, oiled from the bridge's sink. The plates need no hub between them: the axle stack spaces them at O4 and the clamped pin stack at B.`,
    badge: ["both ends held", "ok"],
  });
  A.rules.push(
    { title: "Exact ratios 1 : 2 : 2.5 : 2.5 : 5", text: "The straight line depends on the length ratios, not on the scale: every centre is the solver's, and any adjustment has to be set at the modelled lengths." },
    { title: "Crank and rear rocker share one plane", text: "Their sweeps never meet, so both sit at the base layer; the coupler rides 1.5 mm above and the front rocker plate 1.5 mm above that. Nothing is stacked only to clear something." },
    { title: "Double shear where the sweeps allow", text: "B is a clevis and O4 is held by the base and a bridge. A and the input are single shear because the coupler sweeps over them: the input gets two bearings far apart, the crank pin the shortest overhang." },
    { title: "Stops outside the swing", text: "Rubber-faced stop posts 2° beyond each end of the rocker's travel: untouched in running, they catch the rocker with the belt off or the coupler out." },
    { title: "Kinematics untouched", text: "Pin centres are the solver's; plating heights, outlines and hardware are designed around them." },
  );
};
