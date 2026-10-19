// Overrides and additions to the generated double-rocker assembly (standard 5.2). The plating (coupler 2.5 mm low, output
// rocker 2 mm up, so it passes over the head of A) and the tapered rockers are the model's; the rules build every stack
// on them. What differs from the rules:
// - a pair of stops for the input rocker, which the rules skip (its drive limits it) (F5);
// - the swing of each rocker engraved on the base with an index line on its tip (F9): a double rocker goes back
//   together on two branches, and the scales show it went back on the modelled one;
// - notes, badges and build rules (A16).
import { D2R, arcPts, polar, type Vec2 } from "../../core/geom";
import type { Polish } from "../../assemble/api";
import { swing } from "../../hardware/sub/stops";
import { locking } from "../../rules/locking";
import { materials } from "../../rules/materials";

const a = 70;
const c = 80;
const O2: Vec2 = [0, 0];
const O4: Vec2 = [100, 0];

export const polish: Polish = (A, H) => {
  const ctx = A.ctx;
  const pB = ctx.pinJoint("pB")!;

  // ---- F5: the rule skips the input rocker (its drive limits it); with the drive off it would still over-travel, so it
  // gets its own pair of stops 2° beyond each end (Appendix A) ----
  const swIn = swing(ctx, ctx.parts["rockerIn"]!)!;
  const pO2 = ctx.pinJoint("pO2")!;
  const sI = H.stops(A, { part: ctx.parts["rockerIn"]!, pivot: pO2.P, range: swIn, joint: "pO2" });
  A.joint("pO2").serves.F5 = [...(A.joint("pO2").serves.F5 ?? []), ...sI];

  // ---- M13, M10: the new stops (and the turnbuckle) are named and threadlocked like every other fastener (the locking and
  // materials rules ran before the polish) ----
  const rule = ctx.rule;
  ctx.rule = "polish";
  locking.apply(ctx);
  materials.apply(ctx);
  ctx.rule = rule;

  // ---- F9: both swings engraved on the base, each read off an index line on its rocker's tip ----
  const base = A.get("base")!;
  const scale = (O: Vec2, R0: number, sw: [number, number]) => {
    for (let t = Math.ceil(sw[0] / D2R / 5) * 5; t <= sw[1] / D2R + 0.01; t += 5)
      base.marks.push({ kind: "scale", pts: [polar(R0, t * D2R, ...O), polar(R0 + (t % 15 === 0 ? 5 : 2.6), t * D2R, ...O)] });
    base.marks.push({ kind: "scale", pts: arcPts(O[0], O[1], R0, sw[0], sw[1], Math.PI / 90) });
  };
  scale(O2, a + 13, swIn);
  const swOut = swing(ctx, ctx.parts["rockerOut"]!)!;
  scale(O4, c + 13, swOut);
  A.get("rockerIn")!.marks.push({ kind: "index", pts: [[a + 6, 0], [a + 9.2, 0]] });
  A.get("rockerOut")!.marks.push({ kind: "index", pts: [[c + 6, 0], [c + 9.2, 0]] });
  (A.joint("pO2").serves.F9 ??= []).push("base", "rockerIn");
  (A.joint("pO4").serves.F9 ??= []).push("base", "rockerOut");

  // ---- A16: notes, badges, build rules ----
  const sz = (id: string) => A.get(id)?.name ?? "";
  A.joint("pO2", {
    note: `${A.joint("pO2").note} Oscillating input: the shaft carries the drive lever below the base and two stops stand 2° beyond the ends of the 66° swing. Nothing sweeps over this hub, so the support comes from the housing behind it.`,
  });
  A.joint("pA", {
    note: `Single shear is forced: the coupler sweeps over the input rocker tip and the output rocker passes over the pin. ${sz("pA-bolt")} threaded through the input rocker; the coupler bearing sits between inner-race spacers and the head stays 1.3 mm under the output rocker.`,
    badge: ["single shear", "warn"],
  });
  A.joint("pB", {
    note: `Single shear is forced: the output rocker rides on top of the coupler and nothing fits above it. ${sz("pB-bolt")} threaded through the coupler at a Ø${pB.d} pin; the output rocker's bearing sits between inner-race spacers.`,
    badge: ["single shear", "warn"],
  });
  A.rules.push(
    { title: "Three layers: input rocker, coupler, output rocker", text: "At the lower toggle the two rockers lie along one line, so they cannot share a layer: the coupler sits between them and the output rocker rides above the head of A." },
    { title: "Both pivots free", text: "Neither rocker reaches the other's pivot, so O2 is carried from behind on the input shaft and O4 has the rules' bridge over it; nothing is stacked only to clear something." },
    { title: "Stops outside the swing", text: "Rubber-faced stop posts 2° beyond each end of both rockers' travel: untouched in running, they catch the rockers with the drive off." },
    { title: "Driven inside the toggles", text: "The input swings 20° to 86°, a degree or two inside the toggle limits 18.2° and 87.9°, so the linkage never reaches a position where it can flip branch." },
    { title: "Kinematics untouched", text: "Pin centres are the solver's; plating heights, outlines and hardware are designed around them." },
  );
};
