// Overrides and additions to the generated planetary assembly (standard 5.2). The model gives the carrier as a cage of
// two plates round the planets (a clevis, A9) and the sun on a live shaft; the rules build the sun's housing, key and
// hub, the carrier's bearings on the shaft, the planet bearings on shoulder bolts, the base and the drive. What
// differs from the rules:
// - the input shaft runs on up through the upper carrier plate's bearing and is retained above it (the rule stops it
//   at the sun's hub), so both carrier plates ride on the shaft;
// - four tapped holes on the upper plate's hub take the load (the output), inside fillets on both plates (M7);
// - the ring gear on four standoffs, two of them spigoted, one in a round hole and one in a slot (F1);
// - phase marks on every planet and the carrier arms (F9), notes, badges and build rules (A16).
import { TAU, circle, polar, roundedPoly, type Vec2 } from "../../core/geom";
import type { Polish } from "../../assemble/api";
import { STANDOFF, circlipExt } from "../../hardware/tables";
import { locking } from "../../rules/locking";
import { materials } from "../../rules/materials";
import { HUB_R, cd, m, nP, rp } from "./model";

/** Output: tapped holes on the upper plate's hub, number, thread and pitch circle radius. */
const OUT = { n: 4, M: 3, R: 13.2 };
/** Radius the fillets at the carrier's inside corners are milled to. */
const FILLET = 6;

const rot = (p: Vec2, t: number): Vec2 => [p[0] * Math.cos(t) - p[1] * Math.sin(t), p[0] * Math.sin(t) + p[1] * Math.cos(t)];

export const polish: Polish = (A, H) => {
  const ctx = A.ctx;
  const rule = ctx.rule;
  ctx.rule = "polish";
  const J = (id: string) => A.joint(id);

  // ---- the input shaft runs up through both carrier plates ----
  const pO = ctx.pinJoint("pO")!;
  const d = pO.d;
  const old = A.get("pO-shaft")!;
  const hubTop = A.get("sun-hub")!.z1;
  const brg = A.get("pO-carrier-top-brg")!;
  const clip = circlipExt(d);
  const zTop = brg.z1 + clip.s + 0.6;
  const sun = A.get("sun")!;
  A.drop(/^pO-shaft/);
  A.add(
    H.shaft("pO-shaft", { d, z0: old.z0, z1: zTop, keyway: [sun.z0, sun.z1], grooves: [hubTop, brg.z1] }, { name: old.name, role: old.role, body: old.body, at: old.at, ex: old.ex, joints: old.joints }),
  );
  // the spacer between the hub circlip and the upper plate's bearing, and the circlip that closes the stack above it
  A.set("pO-sp2", { z0: hubTop + clip.s });
  A.add(H.circlip("pO-cl-top2", d, { body: old.body, at: old.at, z0: brg.z1, z1: brg.z1 + clip.s, ex: brg.ex, joints: ["pO"], group: "pO-shaft-top" }));
  J("pO").serves.F2!.push("pO-cl-top2");

  // ---- M7 and the output: fillets in the carrier's inside corners, tapped holes on the upper hub ----
  const top = A.get("carrier-top")!;
  for (const id of ["carrier", "carrier-top"]) {
    const s = A.get(id)!;
    s.outer = H.filletPoly(s.outer, FILLET);
  }
  const holes = H.boltCircle(OUT.n, OUT.R, Math.PI / 4);
  for (const [x, y] of holes) top.marks.push({ kind: "thread", pts: circle(OUT.M / 2 + 0.45, x, y, 20) });
  top.name = `Carrier, upper plate, ${OUT.n} x M${OUT.M} tapped in the hub for the load`;

  // ---- A6, F1: the ring on four standoffs; two are spigoted, a round hole and a slot ----
  const ring = A.get("ring")!;
  const b1 = ctx.b1;
  const p0 = A.get("ring-post0")!.at;
  const at = (k: number): Vec2 => (k === 0 ? [p0[0], p0[1]] : k === 1 ? [-p0[0], -p0[1]] : rot([p0[0], p0[1]], k === 2 ? Math.PI / 2 : -Math.PI / 2));
  const holeAt = (c: Vec2) => ring.holes.findIndex((h) => Math.hypot(h.reduce((a, v) => a + v[0], 0) / h.length - c[0], h.reduce((a, v) => a + v[1], 0) / h.length - c[1]) < 0.5);
  const M = STANDOFF.M;
  const sp = STANDOFF.spigotD / 2;
  for (const k of [2, 3]) {
    const c = at(k);
    const G = { at: [c[0], c[1], 0] as [number, number, number], joints: ["ring-post"] };
    ring.holes.push(circle(M / 2 + 0.3, c[0], c[1], 16));
    A.add(H.standoff(`ring-post${k}`, { ...G, name: "", outer: H.disc(STANDOFF.D / 2), D: STANDOFF.D, z0: b1, z1: ring.z0, span: [-1, ring.ex], ex: -1 }));
    A.add(H.screw(`ring-post${k}-top`, "button", M, ring.z1 - ring.z0 + 1.5 * M, { ...G, face: ring.z1, dir: -1, ex: ring.ex }));
    A.add(H.screw(`ring-post${k}-bot`, "button", M, b1 - ctx.b0 + 1.5 * M, { ...G, face: ctx.b0, dir: 1, ex: -1 }));
  }
  const spigots: string[] = [];
  for (const k of [0, 1]) {
    const c = at(k);
    const i = holeAt(c);
    const ang = Math.atan2(c[1], c[0]);
    // post 0 locates in a round reamed hole, post 1 in a slot along the radius, so the ring cannot bind
    ring.holes[i] = k === 0 ? circle(sp, c[0], c[1], 20) : roundedPoly([[-1.2, 0], [1.2, 0]], sp).map((p) => { const q = rot(p, ang); return [q[0] + c[0], q[1] + c[1]] as Vec2; });
    A.add(H.spigot(`ring-post${k}-spigot`, { at: [c[0], c[1], 0], joints: ["ring-post"], z0: ring.z0, z1: ring.z0 + STANDOFF.spigotH, ex: ring.ex, allow: ["ring"] }));
    spigots.push(`ring-post${k}-spigot`);
  }
  A.joint("ring-post", {
    note: `Four Ø${STANDOFF.D} standoffs, ${(ring.z0 - b1).toFixed(0)} mm, hold the ring gear off the base, M${M} button heads from both sides. Two of them carry a Ø${STANDOFF.spigotD} spigot: one in a reamed round hole, one in a slot along the radius, so the ring goes back where it came from and cannot bind. The four posts take the full reaction torque of the stage.`,
    badge: ["ring held on four posts", "ok"],
    serves: { F1: spigots },
  });

  // ---- F9: planet phase. The rule marks planet 1 and the ring and sun at its mesh; planets 2 and 3 get the same mark
  // on the tooth that meets the sun at the assembly phase, and each arm of the carrier a dot count for its planet ----
  const r0 = rp - 2.2 * m;
  const r1 = rp - 1.3 * m;
  for (let k = 1; k < nP; k++) {
    const a = Math.PI + (k * TAU) / nP;
    A.get(`planet${k}`)!.marks.push({ kind: "timing", pts: [polar(r0, a), polar(r1, a)] });
  }
  for (let k = 0; k < nP; k++) {
    const th = (k * TAU) / nP;
    for (const s of [A.get("carrier")!, top])
      for (let i = 0; i <= k; i++) s.marks.push({ kind: "timing", pts: circle(0.8, ...(polar(HUB_R + 6, th + (i - k / 2) * 0.16) as Vec2), 10) });
  }

  // ---- A9, A16: notes and badges on the planet pins and the meshes ----
  for (let k = 0; k < nP; k++) {
    const j = J(`pC${k}`);
    j.note = `Shoulder bolt Ø8, M6 threaded into the lower carrier plate, its shoulder through a plain hole in the upper plate: the planet's bearing sits between the two plates, so the pin works in double shear (clevis cage). Inner-race spacers on both faces so the bolt clamps only the inner race.`;
    j.badge = ["double shear", "ok"];
  }
  J("pO").note = `${J("pO").note} The shaft runs on up through both carrier plates and is closed by a circlip above the upper plate's bearing: the carrier turns on the input shaft, held between the hub circlip and the top circlip.`;
  J("mesh-ring-planet0").note = `Internal mesh of the ring and the planets, cut with ${0.12} mm of backlash a flank. The eccentric bushing under the input housing moves the sun shaft, and with it the carrier and every planet, toward the ring to set this backlash; the planet pins are reamed to the carrier circle, so the sun mesh does not change. Timing marks at the mesh; open gears are greased at assembly.`;
  J("mesh-ring-planet0").badge = ["backlash adjustable", "ok"];
  J("mesh-sun-planet0").note = `Spur mesh of the sun and the planets: hub with set screw on the keyed sun (F3), the planets ride free on bearings. Centre distance ${cd} mm is set by the reamed pin holes in the carrier plates, not adjusted. Timing marks on the sun, on the planet tooth that meets it, and on all three planets.`;
  // M9: the planet bolts thread 6 mm (one diameter) into the lower plate, which therefore is steel, not aluminium
  for (const id of ["carrier", "carrier-top"]) A.get(id)!.mat = "Steel C45, black oxide";
  materials.apply(ctx);
  locking.apply(ctx);
  ctx.rule = rule;

  A.rules.push(
    { title: "Planets go in in phase", text: "A match mark on the tooth of each planet that meets the sun, a dot count on each carrier arm: fit planet 1 on the arm with one dot, and so on, with the marked tooth toward the sun." },
    { title: "Ring first, then the cluster", text: "The ring is screwed and spigoted to its four posts first. The sun, carrier and planets go in as one cluster on the input shaft, which is then eccentrically set to the ring for backlash." },
    { title: "Carrier cage in double shear", text: "Each planet pin is held in both carrier plates, so the planet sits between two supports; nothing overhangs." },
    { title: "Equal spacing", text: "(Sun + ring) / 3 = 16 teeth, so three planets at 120° mesh at the same phase; the carrier pin holes are reamed to the 48 mm circle." },
    { title: "Kinematics untouched", text: "Tooth profiles, pitch circles, the carrier circle and the ring's position are the model's; hubs, plates, posts and marks are cut round them." },
  );
};
