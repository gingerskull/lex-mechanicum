// Overrides and additions to the generated drag-link quick-return assembly (standard 5.2). The layer order and the split
// output crank are the model's. What differs from the rules:
// - O4: the rules see a ground pivot under sweeps and hang it from a bridge over everything, through the rod's plane, which
//   O4 circles. Built by hand instead: one shaft, D-flat, keyed in the follower below and the ram arm above, turning in a
//   bearing in a bridge between them, on two spigoted posts outside every sweep; circlips on the shaft under the follower
//   and over the arm, inner-race sleeves between;
// - match marks for the arm's 180° on the follower and the arm (F9); notes, badges and build rules (A16).
import { circle, dBore, type Vec2 } from "../../core/geom";
import type { Polish } from "../../assemble/api";
import { BEARINGS, STANDOFF, circlipExt, innerRingD } from "../../hardware/tables";
import { locking } from "../../rules/locking";
import { materials } from "../../rules/materials";

const SD = 8;

export const polish: Polish = (A, H) => {
  const ctx = A.ctx;
  const fol = A.get("follower")!;
  const arm = A.get("arm")!;
  const O4 = A.pin("pO4")!;
  const at: [number, number, number] = [O4[0], O4[1], 0];

  // ---- the rules' hung pivot comes out: bridge, posts, stud, sleeves and the bearings and seats in both plates ----
  A.drop(/^pO4-/);
  ctx.joints.splice(0, ctx.joints.length, ...ctx.joints.filter((j) => j.id !== "pO4-bridge-post"));
  const nearO = (h: Vec2[]) => Math.max(...h.map((p) => Math.hypot(p[0], p[1]))) < 12;
  for (const p of [fol, arm]) {
    p.holes = p.holes.filter((h) => !nearO(h));
    p.marks = p.marks.filter((m) => m.kind !== "boreEntry" || !nearO(m.pts));
    // the keyed bore on the shaft's D-flat (A5); the arm points the other way, so its bore is turned half a turn
    p.holes.push(dBore(SD / 2 + 0.025).map(([x, y]): Vec2 => (p === arm ? [-x, -y] : [x, y])));
    H.boreChamfers(p);
  }

  // ---- the bridge between the follower and the arm: above the B bolt's head, under the arm ----
  const zb = Math.max(...A.find((s) => s.joints.includes("pB") && s.kind === "head").map((s) => s.z1)) + 1;
  const br = H.bridge(A, { id: "pO4-bridge", over: [O4], zMin: zb, joint: "pO4" })!;
  const dz = zb - br.z0;
  for (const s of A.find(/^pO4-bridge(-post\d-(spigot|top(-sh)?))?$/)) Object.assign(s, { z0: s.z0 + dz, z1: s.z1 + dz });
  for (const k of [0, 1]) A.set(`pO4-bridge-post${k}`, { z1: zb, ...(k ? {} : { name: `Standoff Ø${STANDOFF.D} x ${+(zb - ctx.b1).toFixed(1)}, M${STANDOFF.M}, Ø${STANDOFF.spigotD} h7 spigot` }) });
  const z1 = zb + 6;
  const b = BEARINGS.find((x) => x.d === SD && x.D === 16)!;
  br.bridge.holes.push(circle(b.D / 2 + 0.15, O4[0], O4[1], 40));
  br.bridge.why = "carries the output shaft between the follower and the ram arm, which O4 must not pass beyond (A9, A11)";
  const G = { body: "ground", at, ex: br.bridge.ex, joints: ["pO4"] };
  A.add(H.bearing("pO4-brg", b, { ...G, z0: z1 - b.B, z1, closure: "shield", seat: "shoulder above, circlip below" }));
  A.add(H.circlip("pO4-brg-cl", b.D, { ...G, internal: true, z0: z1 - b.B - 1, z1: z1 - b.B, name: `Internal circlip DIN 472, Ø${b.D}` }));

  // ---- the shaft, keyed in both plates, turning with the follower; circlips outside, inner-race sleeves between ----
  const c = circlipExt(SD);
  const S = { body: "follower", at: [0, 0, 0] as [number, number, number], joints: ["pO4"] };
  const zs0 = fol.z0 - c.s - 0.6;
  const zs1 = arm.z1 + c.s + 0.6;
  A.add(H.shaft("pO4-shaft", { d: SD, z0: zs0, z1: zs1, flat: true, grooves: [fol.z0 - c.s - 0.05, arm.z1] }, { ...S, ex: arm.ex + 1, name: `Output shaft Ø${SD} h6, D-flat, circlip grooves` }));
  const R = innerRingD(b);
  A.add(H.tube("pO4-sp0", SD + 0.2, R, { ...S, z0: fol.z1, z1: z1 - b.B, ex: fol.ex + 0.5, name: `Inner-race spacer sleeve ${SD + 0.2}x${R.toFixed(1)}` }));
  A.add(H.tube("pO4-sp1", SD + 0.2, R, { ...S, z0: z1, z1: arm.z0, ex: br.bridge.ex + 0.5, name: "" }));
  A.add(H.circlip("pO4-cl0", SD, { ...S, z0: fol.z0 - c.s, z1: fol.z0, ex: fol.ex, name: `External circlip DIN 471, Ø${SD}`, qty: 2 }));
  A.add(H.circlip("pO4-cl1", SD, { ...S, z0: arm.z1, z1: arm.z1 + c.s, ex: arm.ex, name: "" }));

  // ---- F9: the arm sits 180° from the follower on the flat; a match mark on each at the shaft ----
  fol.marks.push({ kind: "index", pts: [[-9, 0], [-12, 0]] });
  arm.marks.push({ kind: "index", pts: [[9, 0], [12, 0]] });

  const J = A.joint("pO4");
  J.serves = {
    F1: ["pO4-bridge-post0-spigot", "pO4-bridge-post1-spigot"],
    F2: ["pO4-brg-cl", "pO4-cl0", "pO4-cl1"],
    F3: ["pO4-shaft"],
    F4: ["pO4-sp0", "pO4-sp1"],
    F9: ["follower", "arm"],
  };

  const rule = ctx.rule;
  ctx.rule = "polish";
  locking.apply(ctx);
  materials.apply(ctx);
  ctx.rule = rule;

  // ---- A16: notes, badges, build rules ----
  const sz = (id: string) => A.get(id)?.name ?? "";
  J.note = `Output shaft Ø${SD}, D-flat, keyed in the follower below the bridge and the ram arm above it, turning in ${sz("pO4-brg")} in the bridge, located by a shoulder and a circlip; inner-race sleeves to both plates and an external circlip outside each. The coupler, crank and rod all turn round O4, so nothing may cross it from the base or from above.`;
  J.badge = ["carried between the plates", "ok"];
  A.joint("pO2", { note: `${A.joint("pO2").note} The coupler, follower and rod sweep over the shaft's top, so the support comes from the housing behind it.` });
  A.joint("pA", { note: `${sz("pA-bolt")} threaded into the crank, a bearing in the coupler. Single shear: the follower and rod sweep over it.`, badge: ["single shear", "warn"] });
  A.joint("pB", { note: `${sz("pB-bolt")} threaded into the coupler, a bearing in the follower; the head runs under the bridge.`, badge: ["single shear", "warn"] });
  A.joint("pD", { note: `${sz("pD-bolt")} threaded into the ram arm, a bearing in the rod. Single shear: the rod sweeps over everything below.`, badge: ["single shear", "warn"] });
  A.rules.push(
    { title: "Split output crank", text: "O4 is circled by the coupler, the crank and the rod, so the output crank is two plates keyed on one shaft: the follower below a bridge, the ram arm above it." },
    { title: "Bridge between the plates", text: "The bridge holds the shaft's bearing at mid height, on two spigoted posts outside every sweep; the follower turns under it, the arm over it." },
    { title: "Rod on top", text: "The rod passes over every pin of the linkage, so it rides the top plane, the ram's clevis round its end." },
    { title: "Arm opposite the follower", text: "The ram arm is in line with the follower on the far side of O4: the B and D pins stand 110 apart, the timing is the catalogue's." },
    { title: "Kinematics untouched", text: "Pin centres and lengths are the solver's; the split, the bridge and the hardware are designed round them." },
  );
};
