// Overrides and additions to the generated sun and planet assembly (standard 5.2). The rules give the sun, flywheel and
// shaft a live housing (the shaft is what the flywheel carries away), the beam its input shaft and the drive lever
// (oscillating input), the pins their bearings. What differs from the rules:
// - the planet is FIXED to the rod: the rule's second bearing in the rod is dropped, a hub sleeve stands between the
//   planet and the rod end and four screws hold the rod to the planet, so the pair turns as one on the planet's bearing;
// - the sun's key sits in the shaft's keyway: the key and the shaft turn together, so their overlap is allowed;
// - a pair of stops 2° beyond the ends of the beam's rocking, which the rules skip (the drive limits it) (F5), and the swing engraved
//   on the base with an index line on the beam (F9);
// - six spokes in the flywheel, the rim carrying the mass (M2); the retainer and rod are tapered links;
// - notes, badges and build rules (A16).
import { D2R, arcPts, circle, polar, type Vec2 } from "../../core/geom";
import type { Polish } from "../../assemble/api";
import { swing } from "../../hardware/sub/stops";
import { locking } from "../../rules/locking";
import { materials } from "../../rules/materials";

/** Hub sleeve between the planet and the rod end: bore (clear of the planet bearing's flange), outside Ø, screws. */
const HUB = { d: 23, D: 31, screws: 4, M: 3, pcd: 27 };
const SPOKES = 6;

export const polish: Polish = (A, H) => {
  const ctx = A.ctx;
  const rule = ctx.rule;
  ctx.rule = "polish";
  const rod = A.get("rod")!;
  const planet = A.get("planet")!;
  const fly = A.get("flywheel")!;

  // ---- the sun key sits in the shaft keyway (both turn with the sun) ----
  A.set("pOs-sun-key", { allow: A.find(/^pOs-shaft/).map((x) => x.id) });

  // ---- the planet is fixed to the rod: one bearing (the planet's), a hub sleeve and four screws ----
  A.drop(/^pP-rod-/);
  const hi = rod.holes.findIndex((h) => Math.hypot(h.reduce((a, v) => a + v[0], 0) / h.length - ctx.model.parts.find((p) => p.id === "rod")!.len!, h.reduce((a, v) => a + v[1], 0) / h.length) < 1);
  if (hi >= 0) rod.holes[hi] = circle(5.8, ctx.model.parts.find((p) => p.id === "rod")!.len!, 0, 28);
  // the clamp stack through the hub runs on to the rod's top face
  A.set("pP-sp1", { z1: rod.z1 });
  A.add(
    H.tube("pP-hub", HUB.d, HUB.D, {
      body: "planet",
      at: [0, 0, 0],
      joints: ["pP"],
      name: `Planet hub sleeve Ø${HUB.D}, ${(rod.z0 - planet.z1).toFixed(0)} mm, rod end bolted to it`,
      role: planet.role,
      z0: planet.z1,
      z1: rod.z0,
      ex: planet.ex + 0.5,
      mat: "Steel C45",
    }),
  );
  const hub = A.get("pP-hub")!;
  const L = ctx.model.parts.find((p) => p.id === "rod")!.len!;
  for (let i = 0; i < HUB.screws; i++) {
    const [x, y] = polar(HUB.pcd / 2, (i * Math.PI * 2) / HUB.screws + Math.PI / 4) as Vec2;
    // clearance holes in the hub and the rod end, a tapped hole mark in the planet
    hub.holes.push(circle(HUB.M / 2 + 0.3, x, y, 16));
    rod.holes.push(circle(HUB.M / 2 + 0.3, L + x, y, 16));
    planet.marks.push({ kind: "thread", pts: circle(HUB.M / 2 - 0.2, x, y, 16) });
    A.add(H.screw(`pP-hub-s${i}`, "button", HUB.M, rod.z1 - (planet.z1 - 3), { body: "planet", at: [x, y, 0], joints: ["pP"], face: rod.z1, dir: -1, ex: rod.ex }));
  }

  // ---- F5, F9: stops just outside the beam's swing, and the swing engraved on the base ----
  const beam = ctx.parts["beam"]!;
  const sw = swing(ctx, beam)!;
  const pOb = ctx.pinJoint("pOb")!;
  const stops = H.stops(A, { part: beam, pivot: pOb.P, range: sw, joint: "pOb" });
  A.joint("pOb").serves.F5 = [...(A.joint("pOb").serves.F5 ?? []), ...stops];
  const base = A.get("base")!;
  const R0 = 180 + 14;
  for (let t = Math.ceil(sw[0] / D2R / 5) * 5; t <= sw[1] / D2R + 0.01; t += 5)
    base.marks.push({ kind: "scale", pts: [polar(R0, t * D2R, ...(pOb.P as Vec2)), polar(R0 + (t % 15 === 0 ? 5 : 2.6), t * D2R, ...(pOb.P as Vec2))] });
  base.marks.push({ kind: "scale", pts: arcPts(pOb.P[0], pOb.P[1], R0, sw[0], sw[1], Math.PI / 90) });
  A.get("beam")!.marks.push({ kind: "index", pts: [[180 + 6, 0], [180 + 9.2, 0]] });
  (A.joint("pOb").serves.F9 ??= []).push("base", "beam");

  // ---- M2: the flywheel keeps its mass in the rim: six spokes ----
  fly.holes.push(...H.spokes({ rIn: 22, rOut: 62, n: SPOKES, half: 8, fillet: 4 }));
  fly.name = "Flywheel, rim and six spokes";
  locking.apply(ctx);
  materials.apply(ctx);
  ctx.rule = rule;

  // ---- A16 ----
  A.joint("pP", {
    note: `The retaining link carries the shoulder bolt, which runs up through the planet's bearing, the hub sleeve and a plain hole in the rod end: the planet and the rod are bolted to each other (four M${HUB.M} through the rod end and the hub into the planet) and turn together on that one bearing. The planet must not turn on its own axis relative to the rod.`,
    badge: ["planet fixed to the rod", "ok"],
  });
  A.joint("pOs", { note: `${A.joint("pOs").note} The sun and the flywheel are keyed to the shaft; the retaining link turns on the shaft between them on its own bearing, so the shaft carries the output below the base.` });
  A.rules.push(
    { title: "The planet never turns on its own axis", text: "It is bolted to the rod through a hub sleeve, four screws, one bearing: the rod's direction is the planet's direction, which is what makes the sun turn twice per orbit." },
    { title: "Retainer between sun and flywheel", text: "The retaining link turns on the sun shaft on its own bearing and carries the planet pin round; the sun and the flywheel are keyed to the shaft either side of it." },
    { title: "Flywheel carries the dead centres", text: "The beam alone cannot drive the sun through the top and bottom of the stroke; the flywheel's mass does. Its rim carries the mass on six spokes." },
    { title: "Mesh set by the retainer", text: "The retaining link's length m (zs + zp) / 2 = 72 sets the centre distance exactly; the backlash is set by the eccentric bushing under the sun shaft's housing." },
    { title: "Kinematics untouched", text: "The tooth profiles, the beam, rod and retainer lengths and the pivots are the model's; hubs, screws, spokes and marks are fitted round them." },
  );
};
