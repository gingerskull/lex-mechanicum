// Overrides and additions to the generated four-bar assembly (standard 5.2). What differs from the rules:
// - the coupler is plated 2.5 mm low so the crank pin, single shear because the coupler sweeps over the input hub, has a
//   1.5 mm overhang (A9);
// - the rocker is a clevis: a front plate above the coupler puts B in double shear (A9); the stacks of A, B and O4 are rebuilt by the rule builders on the new plating;
// - tapered links sized to their bearings (D1), a lightening window in the coupler (D2, M2), the rocker's swing engraved
//   on the base with an index line on the rocker (F9);
// - notes, badges and build rules (A16).
import { D2R, TAU, arcPts, bbox, polar, xf, type Vec2 } from "../../core/geom";
import { edgeDist, region } from "../../core/poly";
import { poseOf } from "../../model/pose";
import type { Polish, PolishApi } from "../../assemble/api";
import { buildFixedPin } from "../../rules/j1-dead-axle";
import { buildMovingPin } from "../../rules/j3-moving-pin";
import { locking } from "../../rules/locking";
import { materials } from "../../rules/materials";
import { bearingName } from "../../hardware/primitives";
import type { Joined, PinJoint } from "../../rules/types";
import { swing } from "../../hardware/sub/stops";
import { PLATING } from "./model";

const a = 40;
const b = 120;
const c = 80;
const d = 100;
const O4: Vec2 = [d, 0];
/** Front rocker plate: 1.5 mm above the plated coupler. */
const FRONT: [number, number] = [15, 21];
/** Boss radii of the tapered links (D1): the input boss round the keyed Ø10 shaft, the pin bosses round their bearings. */
const CRANK_R: [number, number] = [13, 9.5];
const ROCKER_R: [number, number] = [12, 9.5];

const near = (h: Vec2[], p: Vec2, tol = 0.5) => {
  const [x0, y0, x1, y1] = bbox(h);
  return Math.hypot((x0 + x1) / 2 - p[0], (y0 + y1) / 2 - p[1]) < tol;
};

/** Removes the generated hardware of the pins whose stacks are rebuilt, and the seats they cut in their parts. */
function strip(A: PolishApi, pins: PinJoint[], keep: RegExp) {
  for (const j of pins) {
    A.drop((s) => s.id.startsWith(`${j.id}-`) && !keep.test(s.id));
    const J = A.joint(j.id);
    J.serves = J.serves.F5 ? { F5: J.serves.F5 } : {};
    for (const x of j.joined) {
      const host = A.solidOf[x.part.id]!;
      host.holes = host.holes.filter((h) => !near(h, x.L));
      host.marks = host.marks.filter((m) => m.kind !== "boreEntry" && !(m.kind === "thread" && near(m.pts, x.L)));
    }
    if (j.fixed) {
      const base = A.get("base")!;
      base.holes = base.holes.filter((h) => !near(h, j.P));
      base.marks = base.marks.filter((m) => !(m.kind === "thread" && near(m.pts, j.P)));
    }
  }
  const posts = A.joints.findIndex((t) => t.id === "pO4-bridge-post");
  if (posts >= 0) A.joints.splice(posts, 1);
}

export const polish: Polish = (A, H) => {
  const ctx = A.ctx;
  const pin = (id: string) => ctx.pinJoint(id)!;
  const [pA, pB, pO4] = [pin("pA"), pin("pB"), pin("pO4")];

  // ---- D1, D2: tapered links sized to their bearings, a lightening window in the coupler ----
  A.set("crank", { outer: H.taper(a, ...CRANK_R) });
  A.set("rocker", { name: "Rocker, rear plate", outer: H.taper(c, ...ROCKER_R) });
  for (const s of [A.get("crank")!, A.get("rocker")!])
    s.marks = s.marks.filter((m) => m.kind !== "boss").concat(
      { kind: "boss", pts: H.disc(s.id === "crank" ? CRANK_R[0] - 1.6 : ROCKER_R[0] - 1.6) },
      { kind: "boss", pts: H.disc(ROCKER_R[1] - 1.6, s.id === "crank" ? a : c, 0) },
    );
  // the window keeps 6 mm of web round every boss and edge: the coupler oscillates, so its mass is inertia (M2)
  const tri: Vec2[] = [[0, 0], [b, 0], [b * 0.45, 43]];
  const g: Vec2 = [(tri[0]![0] + tri[1]![0] + tri[2]![0]) / 3, (tri[0]![1] + tri[1]![1] + tri[2]![1]) / 3];
  A.get("coupler")!.holes.push(H.window(tri.map(([x, y]): Vec2 => [g[0] + (x - g[0]) * 0.42, g[1] + (y - g[1]) * 0.42]), 5));

  // ---- the clevis front plate: rides the rocker, built as its own part so the pin builders see it ----
  const rocker = A.get("rocker")!;
  const front = H.solid("rocker-front", {
    ...rocker,
    id: "rocker-front",
    name: "Rocker, front plate",
    body: "rocker-front",
    z0: FRONT[0],
    z1: FRONT[1],
    ex: 2,
    holes: [],
    marks: rocker.marks.map((m) => ({ ...m, pts: m.pts.slice() })),
    joints: [],
  });
  A.add(front);
  A.solidOf["rocker-front"] = front;
  const frontPart = { ...ctx.parts["rocker"]!, id: "rocker-front", layer: 2 };
  ctx.parts["rocker-front"] = frontPart;

  // ---- plating (K1): the coupler and its tracer drop 2.5 mm; the sweeps the bridge reads follow ----
  for (const [id, dz] of Object.entries(PLATING)) {
    const s = A.get(id)!;
    s.z0 += dz;
    s.z1 += dz;
  }
  const resweep = (id: string) => {
    const out = A.get(id)!.outer;
    return Array.from({ length: 72 }, (_, i) => region(xf(out, poseOf(ctx.parts[id]!, ctx.model.solve((i / 72) * TAU))!), []));
  };
  const sweeps = ctx.sweeps().map((sw) => {
    const dz = PLATING[sw.part.id] ?? 0;
    const regions = sw.part.id === "crank" || sw.part.id === "rocker" ? resweep(sw.part.id) : sw.regions;
    return { ...sw, regions, z0: sw.z0 + dz, z1: sw.z1 + dz };
  });
  const rs = sweeps.find((sw) => sw.part.id === "rocker")!;
  sweeps.push({ ...rs, part: frontPart, z0: FRONT[0], z1: FRONT[1] });
  ctx.sweeps = () => sweeps;

  // ---- rebuild A, B and O4 on the new plating with the rule builders ----
  const stopsNote = A.joint("pO4").note.match(/ Stops .*$/)?.[0] ?? "";
  strip(A, [pA, pB, pO4], /^$/);
  const replate = (x: Joined) => {
    const s = A.solidOf[x.part.id]!;
    x.z0 = s.z0;
    x.z1 = s.z1;
    x.R = edgeDist(s.outer, x.L);
  };
  for (const j of [pA, pB, pO4]) j.joined.forEach(replate);
  for (const j of [pB, pO4]) {
    const r = j.joined.find((x) => x.part.id === "rocker")!;
    const f: Joined = { ...r, part: frontPart, z0: FRONT[0], z1: FRONT[1] };
    j.joined.push(f);
    j.joined.sort((p, q) => p.z0 - q.z0);
    // at B the front plate turns with the bolt: a plain hole on the shoulder, the head bearing on it
    if (j === pB) j.driven.push(f);
  }
  front.joints.push("pO4", "pB");
  const rule = ctx.rule;
  ctx.rule = "polish";
  buildMovingPin(ctx, pA);
  buildMovingPin(ctx, pB);
  buildFixedPin(ctx, pO4);
  // E4: the bridge comes off before the front plate it caps
  for (const t of A.find(/^pO4-bridge/)) {
    if (t.ex === front.ex) t.ex = front.ex + 1;
    if (t.span?.[1] === front.ex) t.span = [t.span[0], front.ex + 1];
  }
  front.holes.push(H.disc(pB.d / 2 + 0.1, c, 0));
  H.boreChamfers(front);

  // O4: the rear bearing sits under the front plate where no oil reaches it, so it is sealed; the front one stays open under
  // the bridge's oil sink
  const rear = A.get("pO4-rocker-brg")!;
  if (rear.closure === "open")
    Object.assign(rear, { closure: "seal", name: bearingName(rear.d!, rear.D!, "seal", !!A.get("pO4-rocker-brg-fl")), mat: "Bearing steel 100Cr6, rubber seals" });

  for (const s of A.solids) if (s.body === "rocker-front") s.body = "rocker";

  // F5: the stops again, for the tapered rocker (the rule placed them for the model's straight link)
  const sw = swing(ctx, ctx.parts["rocker"]!)!;
  A.joint("pO4").serves.F5 = H.stops(A, { part: { ...ctx.parts["rocker"]!, shape: { outer: rocker.outer, holes: [] } }, pivot: O4, range: sw, joint: "pO4" });

  // ---- F9: the rocker's swing engraved on the base, read off an index line on the rocker tip. A four-bar assembles
  // on two branches; the scale shows at a glance that it went back together on the modelled one ----
  const base = A.get("base")!;
  const R0 = c + 13;
  for (let t = Math.ceil(sw[0] / D2R / 5) * 5; t <= sw[1] / D2R + 0.01; t += 5)
    base.marks.push({ kind: "scale", pts: [polar(R0, t * D2R, ...O4), polar(R0 + (t % 15 === 0 ? 5 : 2.6), t * D2R, ...O4)] });
  base.marks.push({ kind: "scale", pts: arcPts(O4[0], O4[1], R0, sw[0], sw[1], Math.PI / 90) });
  front.marks.push({ kind: "index", pts: [[c + 6, 0], [c + 9.2, 0]] });

  // the rebuilt hardware gets its locking method and material like the rest (M13, M10)
  locking.apply(ctx);
  materials.apply(ctx);
  ctx.rule = rule;

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
    note: `Clevis: the rear and front rocker plates straddle the coupler, so the pin works in double shear. ${sz("pB-bolt")} threaded through the rear plate, shoulder through a plain Ø${pB.d + 0.2} hole in the front plate under the head; ${sz("pB-coupler-brg")} in the coupler between inner-race spacers.`,
    badge: ["double shear", "ok"],
  });
  A.joint("pO4", {
    note: `${A.joint("pO4").note}${stopsNote} One bearing in each rocker plate: the rear one sealed, where no oil reaches it; the front one open, oiled from the bridge's sink. The plates need no hub between them: the axle stack spaces them at O4 and the clamped pin stack at B.`,
    badge: ["both ends held", "ok"],
  });
  A.rules.push(
    { title: "Crank and rear rocker share one plane", text: "Their sweeps never meet, so both sit at the base layer; the coupler rides 1.5 mm above and the front rocker plate 1.5 mm above that. Nothing is stacked only to clear something." },
    { title: "Double shear where the sweeps allow", text: "B is a clevis and O4 is held by the base and a bridge. A and the input are single shear because the coupler sweeps over them: the input gets two bearings far apart, the crank pin the shortest overhang." },
    { title: "Spacers on inner races only", text: "Every bearing is clamped through its inner race, so tightening a bolt never squeezes a moving part." },
    { title: "Stops outside the swing", text: "Rubber-faced stop posts 2° beyond each end of the rocker's travel: untouched in running, they catch the rocker with the belt off or the coupler out." },
    { title: "Kinematics untouched", text: "Pin centres are the solver's; plating heights, outlines and hardware are designed around them." },
  );

  // drop duplicate marks left by repeated chamfer passes on shared parts
  for (const s of A.solids) {
    const seen = new Set<string>();
    s.marks = s.marks.filter((m) => {
      const k = `${m.kind}:${m.pts.length}:${m.pts[0]?.map((v) => v.toFixed(2)).join(",")}`;
      return seen.has(k) ? false : (seen.add(k), true);
    });
  }
};
