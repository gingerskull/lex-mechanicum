// Overrides and additions to the generated five-bar assembly (standard 5.2). The layers, the plating, the keyed
// shafts and the twinned gears are the model's; the rules build every stack on them: a live input shaft at O1 and a live
// shaft at O2 on its eccentric bushing (the backlash of the gear pair), hubs and timing marks at the mesh, shoulder
// bolts at A, B and P, the base and the drive. What differs from the rules:
// - a pair of stops for the input crank, which the rules skip (its drive limits it) (F5);
// - the input crank's swing engraved on the base with an index line on its tip (F9);
// - notes, badges and build rules (A16).
import { D2R, arcPts, polar, type Vec2 } from "../../core/geom";
import type { Polish } from "../../assemble/api";
import { swing } from "../../hardware/sub/stops";
import { locking } from "../../rules/locking";
import { materials } from "../../rules/materials";

const l1 = 60;
const O1: Vec2 = [0, 0];

export const polish: Polish = (A, H) => {
  const ctx = A.ctx;

  // ---- F5: the rule skips the input crank (its drive limits it); with the drive off it would still over-travel, so it
  // gets its own pair of stops 2° beyond each end (Appendix A) ----
  const sw = swing(ctx, ctx.parts["crankL"]!)!;
  const pO1 = ctx.pinJoint("pO1")!;
  const stops = H.stops(A, { part: ctx.parts["crankL"]!, pivot: pO1.P, range: sw, joint: "pO1" });
  A.joint("pO1").serves.F5 = [...(A.joint("pO1").serves.F5 ?? []), ...stops];

  // ---- M13, M10: the new stops are named and threadlocked like every other fastener (the rules ran before the polish) ----
  const rule = ctx.rule;
  ctx.rule = "polish";
  locking.apply(ctx);
  materials.apply(ctx);
  ctx.rule = rule;

  // ---- F9: the crank's swing engraved on the base, read off an index line on its tip. The pair is timed by its
  // teeth; the scale shows the left crank went back on at the modelled angle ----
  const base = A.get("base")!;
  const R0 = l1 + 13;
  for (let t = Math.ceil(sw[0] / D2R / 5) * 5; t <= sw[1] / D2R + 0.01; t += 5)
    base.marks.push({ kind: "scale", pts: [polar(R0, t * D2R, ...O1), polar(R0 + (t % 15 === 0 ? 5 : 2.6), t * D2R, ...O1)] });
  base.marks.push({ kind: "scale", pts: arcPts(O1[0], O1[1], R0, sw[0], sw[1], Math.PI / 90) });
  A.get("crankL")!.marks.push({ kind: "index", pts: [[l1 + 6, 0], [l1 + 9.2, 0]] });
  (A.joint("pO1").serves.F9 ??= []).push("base", "crankL");

  // ---- A16: notes, badges, build rules ----
  const sz = (id: string) => A.get(id)?.name ?? "";
  A.joint("pO1", {
    note: `${A.joint("pO1").note} Oscillating input: the shaft carries the drive lever below the base and two stops stand 2° beyond the ends of the swing. The crank and its gear are one rigid unit on the shaft.`,
  });
  A.joint("pO2", {
    note: `${A.joint("pO2").note} The right crank and its 28-tooth gear turn together on this shaft; the backlash of the pair is set by the eccentric bushing under its housing.`,
  });
  A.joint("pA", {
    note: `Single shear is forced: the left distal arm sweeps over the crank's tip and nothing fits above it. ${sz("pA-bolt")} threaded through the crank; the arm sits 2.5 mm under its layer, so the overhang is short, and the bearing sits between inner-race spacers.`,
    badge: ["single shear", "warn"],
  });
  A.joint("pB", {
    note: `Single shear, forced as at A: the right distal arm rides above the left one over the crank's tip. ${sz("pB-bolt")} threaded through the crank, a spacer filling the gap to the arm, the bearing between inner-race spacers.`,
    badge: ["single shear", "warn"],
  });
  A.joint("pP", {
    note: `The two distal arms meet here, the right one above the left. ${sz("pP-bolt")} threaded through the left arm, the right arm's bearing on inner-race spacers; the tip path is read at this pin.`,
    badge: ["single shear", "warn"],
  });
  A.rules.push(
    { title: "Cranks under the gears", text: "Each gear sits above its crank on the same keyed shaft, so the gear hub stands up from the gear's top face, clear of everything. The left distal arm runs level with the gears (its sweep never reaches them) and the right one above it." },
    { title: "Gear pair as the second input", text: "A 22-tooth and a 28-tooth gear, module 2, pitch radii 22 and 28 mm, centres 50 mm apart: the right crank is geared to the left. The right gear is set a half tooth out, so a tooth of one sits in a gap of the other on the line of centres." },
    { title: "Exact spacing", text: "The pivots are 50 mm apart, the gear centre distance too: the backlash is trimmed by the eccentric bushing under the right housing, the pivot centres stay the model's." },
    { title: "Stops outside the swing", text: "Rubber-faced stop posts 2° beyond each end of the input crank's travel catch it with the drive off." },
    { title: "Kinematics untouched", text: "Pin centres are the solver's; plating heights, outlines and hardware are designed around them." },
  );
};
