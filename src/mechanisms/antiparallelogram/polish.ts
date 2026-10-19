// Overrides and additions to the generated antiparallelogram assembly (standard 5.2). The plating (coupler 2.5 mm low,
// follower 2 mm up) and the tapered links are the model's; the rules build every stack on them. What differs from the
// rules:
// - the follower's pivot O4: the long crank sweeps over O4 once a turn, so the rules' dead axle (standing on the base
//   through the crank's layer) would pass through it. The axle hangs from the bridge instead: head on top of the bridge,
//   down through the follower's bearing, an M8 nyloc nut under the bearing's thrust washer, nothing below that, and the
//   crank runs clear underneath;
// - a bridge the rules place and size (posts where nothing moving passes);
// - the follower made adjustable by H.turnbuckle in its own plane, so c = a is exact (F7);
// - index marks on both cranks and the base so the cranks go back in step (F9);
// - notes, badges and build rules (A16).
import { arcPts, polar, type Vec2 } from "../../core/geom";
import type { Polish } from "../../assemble/api";
import { locking } from "../../rules/locking";
import { materials } from "../../rules/materials";

const a = 100;
const O2: Vec2 = [0, 0];
const O4: Vec2 = [40, 0];

export const polish: Polish = (A, H) => {
  const ctx = A.ctx;
  const rule = ctx.rule;
  ctx.rule = "polish";

  // ---- O4: the axle hangs from the bridge: below the follower's thrust washer only an M8 nyloc nut and its washer ----
  const tw = A.get("pO4-sp0-tw")!;
  const s2 = A.get("pO4-axle-s2")!;
  for (const id of ["pO4-axle", "pO4-axle-s1", "pO4-uw", "pO4-nut", "pO4-sp0"]) A.drop(id);
  const nutM = 8;
  const G = { at: s2.at, ex: s2.ex, joints: ["pO4"], body: s2.body, group: "pO4-axle" };
  const wz1 = tw.z0;
  const wz0 = wz1 - 1.6;
  const nz1 = wz0;
  const nz0 = nz1 - 8;
  A.add(H.plainWasher("pO4-hw", nutM, { ...G, z0: wz0, z1: wz1 }));
  A.add(H.nut("pO4-hnut", nutM, { ...G, z0: nz0, z1: nz1 }));
  A.set("pO4-axle-s2", {
    z0: nz0 - 1.5,
    name: "Hanging axle, shoulder bolt Ø10, M8 thread at the lower end, head on top of the bridge",
    qty: 1,
  });
  // the base has no axle through it any more: its clearance hole under O4 goes
  const base = A.get("base")!;
  base.holes = base.holes.filter((h) => Math.min(...h.map((p) => Math.hypot(p[0] - O4[0], p[1] - O4[1]))) > 6);

  // ---- F7: the two long links must be equal (c = a) or the output stops being a copy of the input. The 40 mm coupler is
  // all bosses, with no room for an adjuster, so the follower carries it: a turnbuckle halfway along, in its own
  // plane. b = d is held by drilling the coupler and the frame from one jig ----
  H.turnbuckle(A, "follower", {
    at: [a / 2, 0],
    set: a,
    title: "Adjuster · follower",
    why: `It sets the follower to ${a} mm between pin centres, equal to the crank, which keeps the long links crossing as an antiparallelogram. Nothing sweeps in the follower's plane between its pins except the crank far below.`,
  });

  // ---- M13, M10: the new axle parts and the turnbuckle are named and threadlocked like every other fastener ----
  locking.apply(ctx);
  materials.apply(ctx);
  ctx.rule = rule;

  // ---- F9: zero marks: an index on each crank tip and a tick on the base at each pivot along the ground line; the
  // cranks go back together a turn apart or mirrored and still run, so the two ticks must read together ----
  const R0 = 113;
  for (const O of [O2, O4]) base.marks.push({ kind: "scale", pts: [polar(R0, 0, ...O), polar(R0 + 6, 0, ...O)] });
  base.marks.push({ kind: "scale", pts: arcPts(O2[0], O2[1], R0, -0.08, 0.08, Math.PI / 90) }, { kind: "scale", pts: arcPts(O4[0], O4[1], R0, -0.08, 0.08, Math.PI / 90) });
  A.get("crank")!.marks.push({ kind: "index", pts: [[a + 6, 0], [a + 9.2, 0]] });
  A.get("follower")!.marks.push({ kind: "index", pts: [[a + 6, 0], [a + 9.2, 0]] });
  (A.joint("pO2").serves.F9 ??= []).push("base", "crank");

  // ---- A16: notes, badges, build rules ----
  const sz = (id: string) => A.get(id)?.name ?? "";
  A.joint("pO2", {
    note: `${A.joint("pO2").note} Support can only come from behind: the follower sweeps straight over this hub.`,
  });
  A.joint("pO4", {
    note: `Hanging axle Ø10: head on top of the bridge, down through the follower's F6800 bearing and a bronze thrust washer, M8 nyloc nut and washer under it. The crank sweeps over O4 once a turn, so nothing stands on the base here: the crank passes under the nut. The bridge posts stand where no link reaches.`,
    badge: ["held from above", "warn"],
    serves: { F1: ["pO4-bridge-post0-spigot", "pO4-bridge-post1-spigot"], F2: ["pO4-hnut", "pO4-follower-cl0"], F4: ["pO4-sp0-tw"], F8: ["pO4-bridge"], F9: ["base", "follower"] },
  });
  A.joint("pA", {
    note: `${A.joint("pA").note} The follower sweeps over this pin, 2 mm above its head.`,
    badge: ["single shear", "warn"],
  });
  A.joint("pB", {
    note: `${sz("pB-bolt")} threaded through the coupler, through the follower's bearing between inner-race spacers; head and washer on top of the follower.`,
    badge: ["single shear", "warn"],
  });
  A.rules.push(
    { title: "Three layers: crank, coupler, follower", text: "The long links cross all the time, so they cannot share a layer; the short coupler sits between them. The follower rides above the crank's hub and the head of A." },
    { title: "Each long link sweeps the other's pivot", text: "The crank is carried from behind on the input shaft and the follower hangs from a bridge above: nothing stands on the base at O4, so the crank passes under it." },
    { title: "Exact equal lengths, one adjuster", text: `a = c = ${a} mm and b = d = 40 mm are exact or the links stop crossing: the follower has a turnbuckle at its middle, drawn at its set point, so every pin centre is the solver's; the coupler and frame holes come from one drilling jig.` },
    { title: "Index marks for the phase", text: "The cranks can be refitted a turn apart and still run. An index on each tip and a tick on the base at each pivot show the assembly is at the modelled phase." },
    { title: "Kinematics untouched", text: "Pin centres are the solver's; plating heights, outlines and hardware are designed around them." },
  );
};
