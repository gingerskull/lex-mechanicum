// Overrides and additions to the generated double-crank assembly (standard 5.2). The plating (coupler 2.5 mm low,
// output crank 2 mm up) and the tapered links are the model's; the rules build every stack on them. What differs from
// the rules:
// - the output crank's pivot O4: the input crank sweeps over O4 once a turn, so the rules' dead axle (standing on the
//   base through the crank's layer) would pass through it. The axle hangs from the bridge instead: head on top of the
//   bridge, down through the output crank's bearing, an M8 nyloc nut under its thrust washer, nothing below that, and
//   the input crank runs clear underneath;
// - index marks on both cranks and ticks on the base, so the linkage goes back together on the modelled branch (F9);
// - notes, badges and build rules (A16).
import { arcPts, polar, type Vec2 } from "../../core/geom";
import type { Polish } from "../../assemble/api";
import { locking } from "../../rules/locking";
import { materials } from "../../rules/materials";

const a = 80;
const c = 90;
const O2: Vec2 = [0, 0];
const O4: Vec2 = [40, 0];

export const polish: Polish = (A, H) => {
  const ctx = A.ctx;
  const rule = ctx.rule;
  ctx.rule = "polish";

  // ---- O4: the axle hangs from the bridge: below the output crank's thrust washer only an M8 nyloc nut and its washer ----
  const tw = A.get("pO4-sp0-tw")!;
  const s2 = A.get("pO4-axle-s2")!;
  for (const id of ["pO4-axle", "pO4-axle-s1", "pO4-uw", "pO4-nut", "pO4-sp0"]) A.drop(id);
  const G = { at: s2.at, ex: s2.ex, joints: ["pO4"], body: s2.body, group: "pO4-axle" };
  const wz1 = tw.z0;
  const wz0 = wz1 - 1.6;
  const nz0 = wz0 - 8;
  A.add(H.plainWasher("pO4-hw", 8, { ...G, z0: wz0, z1: wz1 }));
  A.add(H.nut("pO4-hnut", 8, { ...G, z0: nz0, z1: wz0 }));
  A.set("pO4-axle-s2", {
    z0: nz0 - 1.5,
    name: "Hanging axle, shoulder bolt Ø10, M8 thread at the lower end, head on top of the bridge",
    qty: 1,
  });
  // the base has no axle through it any more: its clearance hole under O4 goes
  const base = A.get("base")!;
  base.holes = base.holes.filter((h) => Math.min(...h.map((p) => Math.hypot(p[0] - O4[0], p[1] - O4[1]))) > 6);

  // ---- M13, M10: the new axle parts are named and threadlocked like every other fastener ----
  locking.apply(ctx);
  materials.apply(ctx);
  ctx.rule = rule;

  // ---- F9: zero marks. A drag link assembles on two mirror-image branches and both turn. An index on each crank tip
  // and a tick on the base at each pivot: the input's at 0°, the output's where the model puts it at that phase ----
  const B0 = A.m.solve(0).pts.B!;
  const phi0 = Math.atan2(B0[1], B0[0] - O4[0]);
  for (const [O, th, R] of [[O2, 0, a], [O4, phi0, c]] as const) {
    const R0 = R + 13;
    base.marks.push({ kind: "scale", pts: [polar(R0, th, ...O), polar(R0 + 6, th, ...O)] });
    base.marks.push({ kind: "scale", pts: arcPts(O[0], O[1], R0, th - 0.08, th + 0.08, Math.PI / 90) });
  }
  A.get("crank")!.marks.push({ kind: "index", pts: [[a + 6, 0], [a + 9.2, 0]] });
  A.get("follower")!.marks.push({ kind: "index", pts: [[c + 6, 0], [c + 9.2, 0]] });
  (A.joint("pO2").serves.F9 ??= []).push("base", "crank");

  // ---- A16: notes, badges, build rules ----
  const sz = (id: string) => A.get(id)?.name ?? "";
  A.joint("pO2", {
    note: `${A.joint("pO2").note} Support can only come from behind: the output crank sweeps straight over this hub.`,
  });
  A.joint("pO4", {
    note: `Hanging axle Ø10: head on top of the bridge, down through the output crank's F6800 bearing and a bronze thrust washer, M8 nyloc nut and washer under it. The input crank sweeps over O4 once a turn, so nothing stands on the base here: the crank passes under the nut. The bridge posts stand where no link reaches.`,
    badge: ["held from above", "warn"],
    serves: { F1: ["pO4-bridge-post0-spigot", "pO4-bridge-post1-spigot"], F2: ["pO4-hnut", "pO4-follower-cl0"], F4: ["pO4-sp0-tw"], F8: ["pO4-bridge"], F9: ["base", "follower"] },
  });
  A.joint("pA", {
    note: `${A.joint("pA").note} The output crank sweeps over this pin, 2 mm above its head.`,
    badge: ["single shear", "warn"],
  });
  A.joint("pB", {
    note: `${sz("pB-bolt")} threaded through the coupler, through the output crank's bearing between inner-race spacers; head and washer on top of the output crank.`,
    badge: ["single shear", "warn"],
  });
  A.rules.push(
    { title: "Three layers: crank, coupler, output crank", text: "Both cranks are longer than the 40 mm frame, so each sweeps over the other's pivot; they cannot share a layer, and the coupler sits between them. The output crank rides above the input crank's hub and the head of A." },
    { title: "Each crank sweeps the other's pivot", text: "The input crank is carried from behind on the input shaft and the output crank hangs from a bridge above: nothing stands on the base at O4, so the input crank passes under it." },
    { title: "Branch marks", text: "The links go back together on either of two mirror-image branches and both turn. An index on each crank tip and a tick on the base at each pivot show it was refitted on the modelled one." },
    { title: "Kinematics untouched", text: "Pin centres are the solver's; plating heights, outlines and hardware are designed around them. The lengths set the Grashof condition, not an exact ratio, so no link is adjustable." },
  );
};
