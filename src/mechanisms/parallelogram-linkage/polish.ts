// Overrides and additions to the generated parallelogram assembly (standard 5.2). The plating (coupler 0.5 mm low) and
// the tapered links are the model's; the rules build every stack on them. What differs from the rules:
// - the follower's axle at O4: the coupler sweeps over it at 0° and 180° of the crank, so the rules' bridge (which
//   stands above the sweep) would put the axle through the coupler. The axle ends on an external circlip just above
//   the bearing, a sealed bearing, and the coupler runs clear over it;
// - the coupler made adjustable between A and B by H.turnbuckle, in its own plane (F7): b = d and a = c are exact, or
//   the coupler stops translating;
// - index marks on the crank, the follower and the base, so the follower is put back in step (F9);
// - notes, badges and build rules (A16).
import { arcPts, polar, type Vec2 } from "../../core/geom";
import type { Polish } from "../../assemble/api";
import { BEARINGS } from "../../hardware/tables";
import { locking } from "../../rules/locking";
import { materials } from "../../rules/materials";

const a = 40;
const b = 100;
const O2: Vec2 = [0, 0];
const O4: Vec2 = [100, 0];

export const polish: Polish = (A, H) => {
  const ctx = A.ctx;
  const rule = ctx.rule;
  ctx.rule = "polish";
  const pB = ctx.pinJoint("pB")!;

  // ---- O4: no bridge (the coupler passes over), the axle ends on a circlip 1 mm over the bearing's inner race ----
  const brg = A.get("pO4-follower-brg")!;
  const s2 = A.get("pO4-axle-s2")!;
  const zc = brg.z1;
  A.drop(/^pO4-(bridge|sp-top)/);
  A.drop("pO4-axle-shim");
  A.drop("pO4-axle-head");
  A.drop("pO4-axle-s2");
  ctx.joints.splice(0, ctx.joints.length, ...ctx.joints.filter((j) => j.id !== "pO4-bridge-post"));
  const G = { body: s2.body, at: s2.at, ex: s2.ex, joints: ["pO4"], group: "pO4-axle", mat: s2.mat };
  H.shaft("pO4-axle-up", { d: 10, z0: s2.z0, z1: zc + 1.6, grooves: [zc] }, { ...G, name: "" }).forEach((s) => A.add(s));
  A.add(H.circlip("pO4-axle-cl", 10, { body: s2.body, at: s2.at, z0: zc, z1: zc + 1, ex: s2.ex, joints: ["pO4"], name: "External circlip DIN 471, Ø10" }));
  A.set("pO4-axle", { name: "Stub axle Ø10, shouldered, circlip groove, M8 thread through the base, M8 nyloc underneath" });
  // the bearing is sealed: no bridge above to oil it from
  const old = A.drop(/^pO4-follower-brg/);
  const bb = BEARINGS.find((x) => x.d === 10 && x.D === 19)!;
  for (const s of H.bearing("pO4-follower-brg", bb, { body: brg.body, at: brg.at, ex: brg.ex, joints: brg.joints, z0: brg.z0, z1: brg.z1, closure: "seal", seat: old[0]!.seat })) A.add(s);

  // ---- F7: a = c and b = d are exact or the coupler is no longer a translation: one adjustable link, the coupler,
  // halfway between A and B, in its own plane (nothing fits above or below the swept stack) ----
  H.turnbuckle(A, "coupler", {
    at: [b / 2, 0],
    set: b,
    title: "Adjuster · coupler",
    why: `It sets A to B equal to the frame O2 to O4 (${b} mm), which keeps the coupler parallel to the ground line. Nothing sweeps in the coupler's plane between A and B.`,
  });

  // ---- M13, M10: the new axle parts and the turnbuckle are named and threadlocked like every other fastener ----
  locking.apply(ctx);
  materials.apply(ctx);
  ctx.rule = rule;

  // ---- F9: zero marks. Crank and follower must go back in step: an index on each arm tip, a tick on the base at each
  // pivot, both along the ground line; the two ticks read together say the cranks are parallel ----
  const base = A.get("base")!;
  const R0 = a + 13;
  for (const O of [O2, O4]) base.marks.push({ kind: "scale", pts: [polar(R0, 0, ...O), polar(R0 + 6, 0, ...O)] });
  base.marks.push({ kind: "scale", pts: arcPts(O2[0], O2[1], R0, -0.1, 0.1, Math.PI / 90) }, { kind: "scale", pts: arcPts(O4[0], O4[1], R0, -0.1, 0.1, Math.PI / 90) });
  A.get("crank")!.marks.push({ kind: "index", pts: [[a + 6, 0], [a + 9.2, 0]] });
  A.get("follower")!.marks.push({ kind: "index", pts: [[a + 6, 0], [a + 9.2, 0]] });
  (A.joint("pO2").serves.F9 ??= []).push("base", "crank");
  (A.joint("pO4").serves.F9 ??= []).push("base", "follower");

  // ---- A16: notes, badges, build rules ----
  const sz = (id: string) => A.get(id)?.name ?? "";
  A.joint("pO2", {
    note: `${A.joint("pO2").note} Support can only come from behind: the coupler sweeps straight over this hub.`,
  });
  A.joint("pO4", {
    note: `Stub axle Ø10 shouldered into the base, M8 nyloc underneath. The follower carries a sealed F6800 bearing, retained by a circlip in the follower and an external circlip on the axle end. The coupler sweeps over the axle, so there is no bridge: it clears the axle end by 1.9 mm.`,
    badge: ["single shear", "warn"],
    serves: { F1: ["pO4-axle-s1"], F2: ["pO4-axle-cl", "pO4-follower-cl0"], F4: ["pO4-sp0-tw"], F9: ["base", "follower"] },
  });
  A.joint("pA", {
    note: `Single shear is forced: the coupler sweeps over the crank tip and nothing can sit above it. ${sz("pA-bolt")} threaded through the crank; the coupler bearing sits between inner-race spacers.`,
    badge: ["single shear", "warn"],
  });
  A.joint("pB", {
    note: `Single shear is forced: the coupler sweeps over the follower tip. ${sz("pB-bolt")} threaded through the follower at a Ø${pB.d} pin; the coupler bearing sits between inner-race spacers.`,
    badge: ["single shear", "warn"],
  });
  A.rules.push(
    { title: "Crank and follower share one plane", text: "They are 100 mm apart and sweep 49.5 mm each, so their sweeps never meet; the coupler rides above both. Nothing is stacked only to clear something." },
    { title: "Equal lengths, one adjuster", text: `A to B equals O2 to O4 (${b} mm) and the follower equals the crank (${a} mm): the coupler carries a turnbuckle at its middle, drawn at its set point, so every pin centre is the solver's.` },
    { title: "No bridge where the coupler passes", text: "The coupler sweeps over both hubs, so O4 has no bridge: its axle ends on a circlip below the coupler, and the input shaft is held from behind." },
    { title: "Index marks for the phase", text: "Crank and follower can be fitted a turn apart and still run; an index on each tip and a tick on the base at each pivot show they are parallel." },
    { title: "Kinematics untouched", text: "Pin centres are the solver's; plating heights, outlines and hardware are designed around them." },
  );
};
