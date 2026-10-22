// Flexible members (J12; a timing belt is recorded as J8): the declared belt joint between two pulleys, built round the
// pitch path the kinematics solve on. A timing belt: its back a fixed band round the pitch path, on no posts; its teeth
// conveyed round the loop by the solved travel (D9), one a pitch apart, meeting the pulleys' grooves (phased so a groove
// stands at a tooth); flanges on the small pulley (F10); a flat flanged idler on the slack span's back, on a sealed
// bearing on a stud through an arm slotted across the span and clamped on two posts (F7). A large wheel that starts and
// stops with the motor gets a hub and spokes (M2), and each wheel an index mark (F9) so the turns can be counted.
import { TAU, circle, roundRect, type Vec2 } from "../core/geom";
import { beltPath, beltTooth, htd, pathLength as polyLength, pulleyOutline } from "../core/flex";
import { H } from "../hardware/primitives";
import { BEARINGS } from "../hardware/tables";
import { v3, type Vec3 } from "../kin/math";
import type { KinJoint } from "../kin/types";
import { along, pathLength, type ConveyPath } from "../solids/convey";
import type { Solid3 } from "../solids/types";
import type { BuildCtx } from "./ctx";
import type { Frame } from "./frames";
import { Local, titleOf } from "./lib";
import type { Rule } from "./rules/types";

const num = (v: unknown, d: number): number => (typeof v === "number" && Number.isFinite(v) ? v : d);
const UP: Vec3 = [0, 0, 1];

interface Wheel {
  body: string;
  c: Vec2;
  z: number;
  p: number;
  r: number;
}

function wheelOf(ctx: BuildCtx, body: string): Wheel | null {
  const g = ctx.geoms.get(body);
  if (!g) return null;
  const sh = g.shape;
  const z = num(sh.z, 20);
  const p = num(sh.pitch, 8);
  return { body, c: [g.frame.o[0], g.frame.o[1]], z, p, r: (z * p) / TAU };
}

/** The angle of a part's frame x in the world plane (a profile's angles are measured from it). */
const frameAngle = (s: Solid3): number => Math.atan2(s.frame.x[1], s.frame.x[0]);

/** Spokes in a wheel whose rim is far from its hub (M2): six windows between the hub and the rim's root. */
function spokesIn(ctx: BuildCtx, part: Solid3, rRoot: number): void {
  const hub = 14;
  if (rRoot - hub < 22) return;
  part.profile.holes.push(...H.spokes({ rIn: hub, rOut: rRoot - 6, n: 6, half: 4, fillet: 3 }));
  void ctx;
}

/** The z range of a body's part along the base normal (world). */
function zRange(ctx: BuildCtx, body: string): [number, number] | null {
  const e = ctx.extent(body);
  if (!e) return null;
  const a = v3.dot(v3.add(e.frame.o, v3.mul(e.frame.z, e.w0)), UP);
  const b = v3.dot(v3.add(e.frame.o, v3.mul(e.frame.z, e.w1)), UP);
  return [Math.min(a, b), Math.max(a, b)];
}

/** The travel value a convey step gives for a belt joint (out.travel), or null. */
function travelKey(ctx: BuildCtx, joint: string): string | null {
  const st = ctx.kin.solve.find((q) => q.block === "convey" && q.in?.joint === joint);
  const o = st?.out;
  return o && typeof o === "object" && !Array.isArray(o) ? (o.travel ?? null) : null;
}

function buildTimingBelt(ctx: BuildCtx, j: KinJoint): void {
  const w1 = wheelOf(ctx, j.a);
  const w2 = wheelOf(ctx, j.b);
  const zr = zRange(ctx, j.a);
  const key = travelKey(ctx, j.id);
  if (!w1 || !w2 || !zr || !ctx.base) return;
  if (!key) {
    ctx.issues.push(`${j.id}: the belt's convey step names no travel (out.travel): its teeth are not built`);
    return;
  }
  const P = htd(w1.p);
  const p = w1.p;
  const rec = j as unknown as Record<string, unknown>;
  const N = num(rec.teeth, Math.round(polyLength(beltPath(w1.c, w1.r, w2.c, w2.r)) / p));
  const pitch = beltPath(w1.c, w1.r, w2.c, w2.r, Math.PI / 96);
  const L = polyLength(pitch);
  const zc = (zr[0] + zr[1]) / 2;
  const width = Math.min(num(rec.width, 8) + 2, zr[1] - zr[0] - 1);
  const z0 = zc - width / 2;
  const path: ConveyPath = { pts: pitch.map(([x, y]): Vec3 => [x, y, z0]), key, carrier: "ground", up: UP };
  const step = pathLength(path) / N;
  const out: Solid3[] = [];
  // the teeth, a pitch apart round the loop
  const tooth = beltTooth(p);
  for (let k = 0; k < N; k++) {
    const s0 = k * step;
    const f = along(path, s0);
    out.push({ id: `${j.id}-tooth${k}`, name: k ? "" : `Belt tooth HTD ${p}M, ${N} round the loop`, role: "hw", kind: "belt", body: "ground", frame: { o: f.o, x: f.t, z: UP }, profile: { outer: tooth, holes: [] }, op: { op: "extrude", h: width, steps: 1 }, marks: [], ex: 0, joints: [j.id], detail: "never", flags: {}, mat: "Neoprene, glass-fibre cords", convey: { path, s0 }, group: `${j.id}-belt` });
  }
  // the band of the belt's back, fixed round the pitch path: from just outside the teeth's roots to the back
  const back = P.hs - P.ht - P.pld;
  const ring = (off: number): Vec2[] => beltPath(w1.c, w1.r + off, w2.c, w2.r + off, Math.PI / 96);
  out.push({ id: `${j.id}-band`, name: `Timing belt HTD ${p}M, ${N} teeth, ${(N * p).toFixed(0)} mm pitch length, ${width.toFixed(0)} mm wide`, role: "hw", kind: "belt", body: "ground", frame: { o: [0, 0, z0], x: [1, 0, 0], z: UP }, profile: { outer: ring(back), holes: [ring(-0.35).reverse()] }, op: { op: "extrude", h: width, steps: 1 }, marks: [], ex: 0, joints: [j.id], detail: "never", flags: {}, mat: "Neoprene, glass-fibre cords", group: `${j.id}-belt` });
  // the pulleys' grooves, phased to the teeth: a groove where a tooth stands on each wheel's arc
  const a = Math.atan2(w2.c[1] - w1.c[1], w2.c[0] - w1.c[0]);
  const b = Math.asin((w2.r - w1.r) / Math.hypot(w2.c[0] - w1.c[0], w2.c[1] - w1.c[1]));
  const start1 = a + Math.PI / 2 + b;
  const arc1 = w1.r * (Math.PI - 2 * b);
  const span = Math.sqrt((w2.c[0] - w1.c[0]) ** 2 + (w2.c[1] - w1.c[1]) ** 2 - (w2.r - w1.r) ** 2);
  const s2 = arc1 + span;
  const k2 = Math.ceil(s2 / step - 1e-9);
  const start2 = a - Math.PI / 2 - b + (k2 * step - s2) / w2.r;
  for (const [w, phase] of [[w1, start1], [w2, start2]] as const) {
    const part = ctx.parts.get(w.body);
    if (!part) continue;
    const local = phase - frameAngle(part);
    const bore = part.profile.holes;
    part.profile = { outer: pulleyOutline(w.z, p, local), holes: bore };
    spokesIn(ctx, part, w.r - P.pld - P.groove.depth);
    // an index mark on the face, a radial line at the first groove (F9): the turns can be counted
    const ro = w.r - P.pld - P.groove.depth - 1;
    part.marks.push({ kind: "index", pts: [[(ro - 6) * Math.cos(local + Math.PI / w.z), (ro - 6) * Math.sin(local + Math.PI / w.z)], [ro * Math.cos(local + Math.PI / w.z), ro * Math.sin(local + Math.PI / w.z)]] });
  }
  // flanges on the small pulley (F10): one each side of the belt
  const small = w1.r <= w2.r ? w1 : w2;
  const sp = ctx.parts.get(small.body);
  const flangeR = small.r + P.hs - P.pld + 1.5;
  const L1 = new Local({ o: [small.c[0], small.c[1], 0], x: [1, 0, 0], z: UP }, { joints: [j.id] });
  for (const [k, za, zb] of [[0, zr[0] - 1.2, zr[0]], [1, zr[1], zr[1] + 1.2]] as const)
    L1.add(H.solid(`${j.id}-flange${k}`, { name: k ? "" : `Pulley flange Ø${(2 * flangeR).toFixed(0)}, both sides of the small pulley`, kind: "pulley", role: "hw", mat: "Steel, zinc plated", outer: circle(flangeR, 0, 0, 64), holes: [circle(Math.max(6, small.r - P.pld - P.groove.depth - 6), 0, 0, 40).reverse()], z0: za, z1: zb, body: small.body, ...(k ? { qty: 0 } : { qty: 2 }) }));
  // the flange over the belt is drawn see-through, so the teeth in the grooves stay in view (T10)
  const fl = L1.out();
  for (const q of fl) if (q.id.endsWith("flange1")) q.flags.seeThrough = true;
  out.push(...fl);
  void sp;
  // the idler on the slack span's back, near the small wheel (F7, F10)
  const idler = buildIdler(ctx, j, w1, w2, back, zr, out);
  ctx.add(out);
  ctx.note({
    id: j.id,
    kit: "J8",
    at: ctx.S.joints.get(j.id)!.at,
    title: `J8 · ${titleOf(j.id)}`,
    note: `${titleOf(j.id)}: timing belt HTD ${p}M of ${N} teeth on a pitch path ${L.toFixed(1)} mm long, so a whole number of teeth fits and every tooth meets a groove; its back a fixed band round the pitch path, its teeth carried round by the belt's travel. Flanges on the small pulley keep the belt on (F10); ${idler ? "a flat flanged idler on the slack span's back, on a sealed bearing on a stud through an arm slotted across the span and clamped on two posts, takes up the stretch (F7)" : "no room was found for an idler"}. Both shafts are carried in their housings and bridges, since the belt pulls them together (A9). Dry: no lubrication (J12).`,
    badge: ["whole number of teeth", "ok"],
    serves: { F10: [`${j.id}-flange0`], F7: idler ? [`${j.id}-idler-arm`] : [] },
  });
}

/** A flat flanged idler on the back of the slack span (the lower span of a counter-clockwise loop), near the small wheel. */
function buildIdler(ctx: BuildCtx, j: KinJoint, w1: Wheel, w2: Wheel, back: number, zr: [number, number], out: Solid3[]): boolean {
  const a = Math.atan2(w2.c[1] - w1.c[1], w2.c[0] - w1.c[0]);
  const b = Math.asin((w2.r - w1.r) / Math.hypot(w2.c[0] - w1.c[0], w2.c[1] - w1.c[1]));
  // driven counter-clockwise by wheel 1, the span from wheel 1's arc end to wheel 2 runs off the driver: the slack one
  const t1 = a + TAU - Math.PI / 2 - b;
  const P1: Vec2 = [w1.c[0] + w1.r * Math.cos(t1), w1.c[1] + w1.r * Math.sin(t1)];
  const t2 = a - Math.PI / 2 - b;
  const P2: Vec2 = [w2.c[0] + w2.r * Math.cos(t2), w2.c[1] + w2.r * Math.sin(t2)];
  const d: Vec2 = [P2[0] - P1[0], P2[1] - P1[1]];
  const l = Math.hypot(d[0], d[1]);
  const u: Vec2 = [d[0] / l, d[1] / l];
  // outward: away from the loop's inside (to the right of a counter-clockwise loop's direction of travel)
  const nOut: Vec2 = [u[1], -u[0]];
  const small = w1.r <= w2.r ? 0.3 : 0.7;
  const R = 10;
  const at: Vec2 = [P1[0] + d[0] * small + nOut[0] * (back + R + 0.3), P1[1] + d[1] * small + nOut[1] * (back + R + 0.3)];
  if (!ctx.base) return false;
  const brg = BEARINGS.find((q) => q.name === "625")!;
  const zc = (zr[0] + zr[1]) / 2;
  const F: Frame = { o: [at[0], at[1], 0], x: [u[0], u[1], 0], z: UP };
  const L = new Local(F, { joints: [j.id] });
  const bt = ctx.base.top;
  L.add(H.solid(`${j.id}-idler`, { name: `Flat idler Ø${2 * R}, flanged, on a sealed bearing`, kind: "pulley", role: "hw", mat: "Aluminium 6061-T6, anodised", outer: circle(R, 0, 0, 48), holes: [circle(brg.D / 2 + 0.05, 0, 0, 24).reverse()], z0: zr[0], z1: zr[1] }));
  for (const [k, za, zb] of [[0, zr[0] - 1.2, zr[0]], [1, zr[1], zr[1] + 1.2]] as const) L.add(H.solid(`${j.id}-idler-fl${k}`, { name: "", kind: "pulley", role: "hw", outer: circle(R + 3, 0, 0, 48), holes: [circle(brg.D / 2 + 0.05, 0, 0, 24).reverse()], z0: za, z1: zb, group: `${j.id}-idler` }));
  L.add(H.bearing(`${j.id}-idler-brg`, brg, { z0: zc - brg.B / 2, z1: zc + brg.B / 2, closure: "seal" }));
  // the stud down through the arm, the arm slotted across the span, clamped on two posts
  // the arm above the idler, on two posts from the base beside the loop
  const armBot = zr[1] + 1.2 + 0.5;
  const armTop = armBot + 4;
  L.add(H.shaft(`${j.id}-idler-stud`, { d: brg.d, z0: zr[0] - 1.2, z1: armTop + 3 }, { name: `Idler stud Ø${brg.d}, through the arm's slot, nut above` }));
  L.add(H.plate(`${j.id}-idler-arm`, roundRect(-30, -6, 8, 6, 3), { kind: "bracket", role: "ground", name: "Idler arm, slotted across the span, clamped on two posts", z0: armBot, z1: armTop, holes: [roundRect(-brg.d / 2 - 0.2, -brg.d / 2 - 0.2, brg.d / 2 + 0.2, brg.d / 2 + 0.2, brg.d / 2).reverse(), circle(1.7, -24, 0, 20).reverse(), circle(1.7, -16, 0, 20).reverse()], mat: "Steel C45" }));
  for (const [k, x] of [[0, -24], [1, -16]] as const) {
    L.add(H.standoff(`${j.id}-idler-post${k}`, { at: [x, 0, 0], z0: bt, z1: armBot, ...(k ? { name: "" } : {}) }));
    L.add(H.screw(`${j.id}-idler-sc${k}`, "socket", 3, 8, { at: [x, 0, 0], face: armTop, dir: -1, ...(k ? { name: "", qty: 0 } : { qty: 2 }) }));
  }
  out.push(...L.out());
  return true;
}

export const j12: Rule = {
  id: "j12-flexible",
  tier: "AUTO",
  ids: ["J12", "J8", "A11", "F2", "F3", "F6", "F7", "F8", "F10"],
  fixture: "belt-drive",
  applies: (ctx) => ctx.kin.joints.some((j) => j.type === "belt" && (j as unknown as Record<string, unknown>).flexible === "belt" && j.a !== "ground" && j.b !== "ground"),
  apply(ctx) {
    for (const j of ctx.kin.joints) {
      const rec = j as unknown as Record<string, unknown>;
      if (j.type === "belt" && rec.flexible === "belt" && j.a !== "ground" && j.b !== "ground") buildTimingBelt(ctx, j);
    }
  },
};
