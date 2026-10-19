// Overrides and additions to the generated sprag clutch assembly (standard 5.2). The model has the inner race keyed to the shaft,
// the outer race, its spider and the sixteen sprags at their locking tilt; the rules build the shaft's housing, key and bearings,
// the spider's bearing on the shaft and the drive. What differs from the rules:
// - the shaft runs on up through the spider's bearing and is closed by a circlip above it (the rule stops it at the inner race),
//   so the spider, and with it the outer race, rides on the shaft;
// - the spider bolted to the outer race through its three arms (M3 into the race's rim);
// - a garter spring, a steel wire ring round the sprags, tipping them toward engagement (F6);
// - four tapped holes in the spider's hub take the load (the output);
// - notes, badges and build rules (A16).
import { circle, polar, type Vec2 } from "../../core/geom";
import type { Polish } from "../../assemble/api";
import { circlipExt } from "../../hardware/tables";
import { locking } from "../../rules/locking";
import { materials } from "../../rules/materials";
import { ARM_L, ri, ro } from "./model";

const TAU = Math.PI * 2;
const OUT = { n: 4, M: 2.5, R: 13.5 };
const BOLT = { M: 3, R: ARM_L };

export const polish: Polish = (A, H) => {
  const ctx = A.ctx;
  const rule = ctx.rule;
  ctx.rule = "polish";
  const spider = A.get("spider")!;
  const outer = A.get("outer")!;

  // ---- the shaft runs up through the spider's bearing and is closed above it by a circlip ----
  const pO = ctx.pinJoint("pO")!;
  const d = pO.d;
  const old = A.get("pO-shaft")!;
  const brg = A.get("pO-spider-brg")!;
  const fl = A.get("pO-spider-brg-fl");
  const clip = circlipExt(d);
  const zb = fl?.z1 ?? brg.z1;
  A.drop(/^pO-shaft/);
  A.drop(/^pO-end/);
  A.add(H.shaft("pO-shaft", { d, z0: old.z0, z1: zb + clip.s + 0.4, flat: true, grooves: [zb] }, { name: old.name, role: old.role, body: old.body, at: old.at, ex: old.ex, joints: old.joints }));
  A.add(H.circlip("pO-cl-top", d, { body: old.body, at: old.at, z0: zb, z1: zb + clip.s, ex: spider.ex + 0.5, joints: ["pO"], group: "pO-shaft-top" }));
  (A.joint("pO").serves.F2 ??= []).push("pO-cl-top");

  // ---- the spider bolted to the outer race through its three arms, on spacer sleeves over the race's face ----
  for (let k = 0; k < 3; k++) {
    const [x, y] = polar(BOLT.R, (k * TAU) / 3) as Vec2;
    spider.holes.push(circle(BOLT.M / 2 + 0.3, x, y, 16));
    outer.marks.push({ kind: "thread", pts: circle(BOLT.M / 2 - 0.2, x, y, 16) });
    A.add(H.screw(`spider-s${k}`, "button", BOLT.M, spider.z1 - (outer.z1 - 5), { body: "outer", at: [x, y, 0], joints: ["pO"], face: spider.z1, dir: -1, ex: spider.ex + 0.5, name: k ? "" : `Button head M${BOLT.M}, spider to outer race, 3 off` }));
    A.add(H.tube(`spider-sp${k}`, BOLT.M + 0.4, 9, { body: "outer", at: [x, y, 0], joints: ["pO"], name: k ? "" : `Spacer sleeve Ø9 x ${(spider.z0 - outer.z1).toFixed(0)}, 3 off`, role: spider.role, z0: outer.z1, z1: spider.z0, ex: (outer.ex + spider.ex) / 2, mat: "Steel C45" }));
  }

  // ---- F6: the garter spring, a wire ring round the sprags on their top faces ----
  const D = 2 * (ri + (ro - ri) / 2);
  A.add(H.spring("garter", "torsion", { D, wire: 0.8, body: "outer", at: [0, 0, 0], joints: ["pO"], z0: outer.z1 + 0.2, z1: outer.z1 + 1.0, ex: outer.ex + 0.3, name: "Garter spring, steel wire ring Ø0.8, round the sprags" }));
  (A.joint("pO").serves.F6 ??= []).push("garter");

  // ---- the output: four tapped holes in the spider's hub ----
  for (const [x, y] of H.boltCircle(OUT.n, OUT.R, Math.PI / 4)) spider.marks.push({ kind: "thread", pts: circle(OUT.M / 2 - 0.2, x, y, 16) });
  spider.name = `Outer race spider, ${OUT.n} x M${OUT.M} tapped in the hub for the load`;
  locking.apply(ctx);
  materials.apply(ctx);
  ctx.rule = rule;

  // ---- A16 ----
  A.joint("pO", {
    note: `${A.joint("pO").note} The shaft runs on up through the spider's bearing and is closed by a circlip above it: the inner race is keyed to it, the outer race hangs from the spider on that bearing, and between the races sixteen sprags wedge in the driving direction (the model shows that state) and tip free the other way.`,
  });
  A.rules.push(
    { title: "Sprags are a matched set", text: "All sixteen come from one grinding lot: one sprag a few hundredths long would carry the whole torque. Fit them with the garter spring round them, long diagonal tilted toward the driving direction." },
    { title: "Races ground and hardened", text: "The inner race and the outer race's bore are ground to 8.00 mm apart and hardened: the sprag wedges between two hard faces, and a worn race slips." },
    { title: "Outer race on the shaft", text: "The outer race hangs from a spider on its own bearing on the input shaft, so the races keep their gap; nothing else may carry it." },
    { title: "Direction is the sprags' tilt", text: "Counter-clockwise drives: the sprags tilt toward upright and wedge. Clockwise (or the outer race running ahead) tips them over and the races turn free; the model shows the driving state." },
    { title: "Kinematics untouched", text: "The race radii, the sprag size and its locking tilt are the model's; the spider's screws, the spring and the shaft's closing circlip are fitted round them." },
  );
};
