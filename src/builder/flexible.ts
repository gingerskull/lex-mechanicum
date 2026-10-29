// Flexible members (J12; a timing belt is recorded as J8): the declared belt joint between two pulleys, built round the
// pitch path the kinematics solve on. A timing belt: its back a fixed band round the pitch path, on no posts; its teeth
// conveyed round the loop by the solved travel (D9), one a pitch apart, meeting the pulleys' grooves (phased so a groove
// stands at a tooth); flanges on the small pulley (F10); a flat flanged idler on the slack span's back, on a sealed
// bearing on a stud through an arm slotted across the span and clamped on two posts (F7). A large wheel that starts and
// stops with the motor gets a hub and spokes (M2), and each wheel an index mark (F9) so the turns can be counted.
import { TAU, arcPts, circle, roundRect, roundedPoly as roundedPolyOf, type Vec2 } from "../core/geom";
import { beltPath, beltTooth, htd, pathLength as polyLength, pulleyOutline, sprocketOutline, sprocketR } from "../core/flex";
import { H } from "../hardware/primitives";
import { BEARINGS } from "../hardware/tables";
import { v3, type Vec3 } from "../kin/math";
import type { KinJoint } from "../kin/types";
import { along, distOf, pathLength, type ConveyPath } from "../solids/convey";
import type { Solid3 } from "../solids/types";
import type { BuildCtx } from "./ctx";
import { place, type Frame } from "./frames";
import { Local, titleOf } from "./lib";
import type { Rule } from "./rules/types";
import { worldPoints } from "./sweeps";
import { BASE_GAP, BASE_T } from "./constants";
import { buildStrands } from "./strand";

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
  // the band of the belt's back, fixed round the pitch path: from just outside the teeth's roots to the back; its marks
  // run round the pitch path with the teeth (SD29)
  const back = P.hs - P.ht - P.pld;
  const ring = (off: number): Vec2[] => beltPath(w1.c, w1.r + off, w2.c, w2.r + off, Math.PI / 96);
  out.push({ id: `${j.id}-band`, name: `Timing belt HTD ${p}M, ${N} teeth, ${(N * p).toFixed(0)} mm pitch length, ${width.toFixed(0)} mm wide`, role: "hw", kind: "belt", body: "ground", frame: { o: [0, 0, z0], x: [1, 0, 0], z: UP }, profile: { outer: ring(back), holes: [ring(-0.35).reverse()] }, op: { op: "extrude", h: width, steps: 1 }, marks: [], ex: 0, joints: [j.id], detail: "never", flags: {}, mat: "Neoprene, glass-fibre cords", group: `${j.id}-belt`, run: { path: pitch, key } });
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


/**
 * A roller chain between two sprockets (J12): its rollers, pins and inner and outer link plates conveyed round the loop
 * by the chain's advance (D9). The loop's path runs on the sprockets' seat circles (the pitch polygons' circumcircles) and
 * their outer tangents; the advance is measured in links, a pitch per roller, which wrap a sprocket a seat per pitch, so
 * the rollers ride the seats exactly while the chain's speed ripples with the polygon (the chordal action the kinematics
 * solve). Each plate is a rigid link between its two rollers. A polymer shoe on a slotted arm presses the slack span's
 * outer plates (F7); the chain is greased (F8).
 */
function buildChain(ctx: BuildCtx, j: KinJoint): void {
  const g1 = ctx.geoms.get(j.a);
  const g2 = ctx.geoms.get(j.b);
  const zr = zRange(ctx, j.a);
  const key = travelKey(ctx, j.id);
  if (!g1 || !g2 || !zr || !ctx.base) return;
  if (!key) {
    ctx.issues.push(`${j.id}: the chain's convey step names no travel (out.travel): its links are not built`);
    return;
  }
  const rec = j as unknown as Record<string, unknown>;
  const p = num(rec.pitch, num(g1.shape.pitch, 12.7));
  const d1 = num(rec.roller, num(g1.shape.roller, 8.5));
  const N = num(rec.links, 60);
  const z1 = num(g1.shape.z, 15);
  const z2 = num(g2.shape.z, 30);
  const c1: Vec2 = [g1.frame.o[0], g1.frame.o[1]];
  const c2: Vec2 = [g2.frame.o[0], g2.frame.o[1]];
  const R1 = sprocketR(z1, p);
  const R2 = sprocketR(z2, p);
  const C = Math.hypot(c2[0] - c1[0], c2[1] - c1[1]);
  const a = Math.atan2(c2[1] - c1[1], c2[0] - c1[0]);
  const b = Math.asin((R2 - R1) / C);
  const span = Math.sqrt(C * C - (R2 - R1) ** 2);
  const cArc1 = ((Math.PI - 2 * b) * z1 * p) / TAU;
  const cArc2 = ((Math.PI + 2 * b) * z2 * p) / TAU;
  const total = cArc1 + cArc2 + 2 * span;
  if (Math.abs(total - N * p) > 0.01) ctx.issues.push(`${j.id}: the loop is ${(total / p).toFixed(3)} links at C ${C.toFixed(3)}, not ${N}: set the centre distance for a whole number of links`);
  // the path, and its breakpoints in links against distance
  const arc1 = arcPts(c1[0], c1[1], R1, a + Math.PI / 2 + b, a + TAU - Math.PI / 2 - b, Math.PI / 180);
  const arc2 = arcPts(c2[0], c2[1], R2, a - Math.PI / 2 - b, a + Math.PI / 2 + b, Math.PI / 180);
  const pts2: Vec2[] = [...arc1, ...arc2];
  const zc = (zr[0] + zr[1]) / 2;
  const cum: number[] = [0];
  for (let i = 1; i <= pts2.length; i++) cum.push(cum[i - 1]! + Math.hypot(pts2[i % pts2.length]![0] - pts2[i - 1]![0], pts2[i % pts2.length]![1] - pts2[i - 1]![1]));
  const dA1 = cum[arc1.length - 1]!;
  const dS1 = cum[arc1.length]!;
  const dA2 = cum[pts2.length - 1]!;
  const dL = cum[pts2.length]!;
  const path: ConveyPath = { pts: pts2.map(([x, y]): Vec3 => [x, y, zc]), key, carrier: "ground", up: UP, map: { c: [0, cArc1, cArc1 + span, cArc1 + span + cArc2, total], d: [0, dA1, dS1, dA2, dL] } };
  // the sprockets' seats: one at the path's start on the driver, and where the rollers stand on the driven's arc
  const A1s = a + Math.PI / 2 + b;
  const A2s = a - Math.PI / 2 - b;
  const A2e = a + Math.PI / 2 + b;
  const c2s = cArc1 + span;
  const seat2 = A2s + ((Math.ceil(c2s / p - 1e-9) * p - c2s) * (TAU / z2)) / p;
  const out: Solid3[] = [];
  for (const [g, z, phase] of [[g1, z1, A1s], [g2, z2, seat2]] as const) {
    const part = ctx.parts.get(g.id);
    if (!part) continue;
    const local = phase - frameAngle(part);
    part.profile = { outer: sprocketOutline(z, p, d1, local), holes: part.profile.holes };
    const R = sprocketR(z, p);
    spokesIn(ctx, part, R - d1);
    const ro = R - d1 - 2;
    part.marks.push({ kind: "index", pts: [[(ro - 6) * Math.cos(local), (ro - 6) * Math.sin(local)], [ro * Math.cos(local), ro * Math.sin(local)]] });
  }
  // the phases the kinematics read (the seated roller from the tight span's foot on each sprocket), checked
  const alpha = seat2 + Math.round((A2e - seat2) / (TAU / z2)) * (TAU / z2);
  const phB = ((alpha - A2e) * 180) / Math.PI;
  if (Math.abs(num(rec.phaseA, 0)) > 0.01 || Math.abs(num(rec.phaseB, 0) - phB) > 0.01) ctx.issues.push(`${j.id}: the chain's phases are 0 and ${phB.toFixed(4)} deg here, the record says ${num(rec.phaseA, 0)} and ${num(rec.phaseB, 0)}`);
  // rollers, pins and plates (ISO 606 08B proportions)
  const rw = 7.75;
  const pt = 1.6;
  const pinD = 4.45;
  const plateR = 5.9;
  const inner0 = zc + rw / 2 + 0.1;
  const outer0 = inner0 + pt + 0.1;
  const plate = (): { outer: Vec2[]; holes: Vec2[][] } => ({ outer: roundedPolyOf([[0, 0], [p, 0]], plateR), holes: [circle(pinD / 2 + 0.05, 0, 0, 20).reverse(), circle(pinD / 2 + 0.05, p, 0, 20).reverse()] });
  const mat = "Steel, case hardened";
  for (let k = 0; k < N; k++) {
    const s0 = k * p;
    const q = along(path, distOf(path, s0));
    const fr = { o: q.o, x: q.t, z: UP };
    out.push({ id: `${j.id}-roller${k}`, name: k ? "" : `Roller Ø${d1}, ${N} in the chain (ISO 606 08B)`, role: "hw", kind: "roller", body: "ground", frame: { ...fr, o: [q.o[0], q.o[1], zc - rw / 2] }, profile: { outer: circle(d1 / 2, 0, 0, 28), holes: [circle(pinD / 2 + 0.03, 0, 0, 20).reverse()] }, op: { op: "extrude", h: rw, steps: 1 }, marks: [], ex: 0, joints: [j.id], detail: "never", flags: {}, mat, convey: { path, s0 }, group: `${j.id}-chain` });
    out.push({ id: `${j.id}-pin${k}`, name: k ? "" : `Pin Ø${pinD}, riveted, ${N} in the chain`, role: "hw", kind: "shaft", body: "ground", frame: { ...fr, o: [q.o[0], q.o[1], zc - (outer0 + pt - zc) - 0.6] }, profile: { outer: circle(pinD / 2, 0, 0, 20), holes: [] }, op: { op: "extrude", h: 2 * (outer0 + pt - zc) + 1.2, steps: 1 }, marks: [], ex: 0, joints: [j.id], detail: "never", flags: {}, mat, convey: { path, s0 }, group: `${j.id}-chain` });
    // a plate pair from this roller to the next: inner plates on even links, outer on odd, either side of the rollers
    const z0 = k % 2 ? outer0 : inner0;
    for (const [n, zz] of [[0, z0], [1, 2 * zc - z0 - pt]] as const) {
      const pr = plate();
      out.push({ id: `${j.id}-plate${k}-${n}`, name: k > 1 || n ? "" : k % 2 ? `Outer link plates, ${N} pairs in the chain` : `Inner link plates`, role: "hw", kind: "plate", body: "ground", frame: { o: [q.o[0], q.o[1], zz], x: v3.unit(v3.sub(along(path, distOf(path, s0 + p)).o, q.o)), z: UP }, profile: pr, op: { op: "extrude", h: pt, steps: 1 }, marks: [], ex: 0, joints: [j.id], detail: "never", flags: {}, mat, convey: { path, s0, s1: s0 + p }, group: `${j.id}-chain` });
    }
  }
  // the tensioner: a polymer shoe on the slack span's outer plates, on an arm slotted across the span, on two posts
  const t1 = a + TAU - Math.PI / 2 - b;
  const P1: Vec2 = [c1[0] + R1 * Math.cos(t1), c1[1] + R1 * Math.sin(t1)];
  const t2 = a - Math.PI / 2 - b;
  const P2: Vec2 = [c2[0] + R2 * Math.cos(t2), c2[1] + R2 * Math.sin(t2)];
  const dd: Vec2 = [P2[0] - P1[0], P2[1] - P1[1]];
  const ll = Math.hypot(dd[0], dd[1]);
  const u: Vec2 = [dd[0] / ll, dd[1] / ll];
  const nOut: Vec2 = [u[1], -u[0]];
  const mid: Vec2 = [P1[0] + dd[0] * 0.35, P1[1] + dd[1] * 0.35];
  const F: Frame = { o: [mid[0], mid[1], 0], x: [u[0], u[1], 0], z: UP };
  const L = new Local(F, { joints: [j.id] });
  const off = plateR + 0.4;
  const shoeZ0 = 2 * zc - outer0 - pt;
  const shoeZ1 = outer0 + pt;
  const ny = -1;
  void nOut;
  // the frame's y = z × x points to the loop's inside for a counter-clockwise loop's lower span: the shoe sits at −y
  L.add(H.solid(`${j.id}-shoe`, { name: "Tensioner shoe, UHMW polyethylene, on the slack span's plates", kind: "wearStrip", role: "hw", mat: "UHMW polyethylene", outer: roundRect(-22, ny * off - 6, 22, ny * off, 3).map(([x, y]): Vec2 => [x, y]), z0: shoeZ0, z1: shoeZ1 }));
  const armBot = shoeZ1 + 0.5;
  const armTop = armBot + 4;
  L.add(H.plate(`${j.id}-shoe-arm`, roundRect(-26, ny * off - 18, 26, ny * off - 2, 3), { kind: "bracket", role: "ground", name: "Shoe arm, slotted across the span, clamped on two posts", z0: armBot, z1: armTop, holes: [roundRect(-21.6, ny * off - 15.5, -18.4, ny * off - 10.5, 1.6).reverse(), roundRect(18.4, ny * off - 15.5, 21.6, ny * off - 10.5, 1.6).reverse()], mat: "Steel C45" }));
  for (const [k, x] of [[0, -20], [1, 20]] as const) {
    L.add(H.standoff(`${j.id}-shoe-post${k}`, { at: [x, ny * off - 13, 0], z0: ctx.base.top, z1: armBot, ...(k ? { name: "" } : {}) }));
    L.add(H.screw(`${j.id}-shoe-sc${k}`, "socket", 3, 8, { at: [x, ny * off - 13, 0], face: armTop, dir: -1, ...(k ? { name: "", qty: 0 } : { qty: 2 }) }));
  }
  L.add(H.screw(`${j.id}-shoe-fix`, "csk", 3, 9, { at: [0, ny * off - 3, 0], face: armBot, dir: -1, name: "Countersunk M3, the shoe to its arm" }));
  out.push(...L.out());
  ctx.add(out);
  ctx.note({
    id: j.id,
    kit: "J12",
    at: ctx.S.joints.get(j.id)!.at,
    title: `J12 · ${titleOf(j.id)}`,
    note: `${titleOf(j.id)}: ISO 606 08B roller chain of ${N} links on sprockets of ${z1} and ${z2} teeth; the centre distance ${C.toFixed(2)} mm makes the loop a whole number of links, so a roller meets every seat. Rollers, pins and plates are carried round by the chain's advance, which the pitch polygon makes ripple once per tooth (chordal action). A polymer shoe on an arm slotted across the slack span takes up the stretch (F7); greased (F8).`,
    badge: ["whole number of links", "ok"],
    serves: { F7: [`${j.id}-shoe-arm`], F8: [] },
  });
}


/**
 * A rope reeved over sheaves (J12, a block and tackle): each part a stretched member between its two points (D9), in the
 * plane of the sheaves it runs between (a part crossing from one sheave's plane to another's runs midway); each sheave a
 * core under the rope with a flange either side (the groove); the rope's wraps fixed arcs in the grooves on the side away
 * from the other block; the dead end on a becket pin with a thimble in a post on the base (F1, F2); the hook on a swivel
 * under the lower block (F3); a guard round each sheave whose centre stands still keeps the rope in its groove (F2).
 */
function buildRope(ctx: BuildCtx, ropes: KinJoint[]): void {
  if (!ctx.base) return;
  const out: Solid3[] = [];
  const sheaves = new Set<string>();
  for (const j of ropes) for (const b of [j.a, j.b]) if (ctx.geoms.get(b)?.shape.type === "pulley") sheaves.add(b);
  const midZ = (b: string): number | null => {
    const z = zRange(ctx, b);
    return z ? (z[0] + z[1]) / 2 : null;
  };
  const rr = (j: KinJoint) => num((j as unknown as Record<string, unknown>).rope, 3.2) / 2;
  const centre = (b: string): Vec3 => ctx.geoms.get(b)!.frame.o;
  const pointOf = (id: string): Vec3 | null => ctx.S.refPts.get(id) ?? null;
  // the rope's parts and wraps are one member, meeting end to end
  const member = `rope:${ropes[0]?.id ?? ""}`;
  const rope = (id: string, name: string, a: Vec3, b: Vec3, z: number, r: number, ends: [string, string], body: string): Solid3 => {
    const ring = circle(r, 0, 0, 16);
    // ends at their sheaves' heights (a part crossing between planes slants): built in the frame it is stretched in;
    // ends given flat run at the height of the planes they join
    const flat = a[2] === 0 && b[2] === 0;
    const x = v3.unit(flat ? v3.sub([b[0], b[1], 0], [a[0], a[1], 0]) : v3.sub(b, a));
    const up = v3.unit(v3.sub(UP, v3.mul(x, v3.dot(UP, x))));
    return { id, name, role: "hw", kind: "belt", body, frame: { o: flat ? [a[0], a[1], z] : a, x, z: up }, profile: { outer: ring, holes: [] }, op: { op: "sweep", path: [[0, 0, 0], [1, 0, 0]] }, marks: [], ex: 0, joints: [], detail: "never", flags: {}, mat: "Polyester rope, braided", stretch: ends, member };
  };
  // the sheaves: a core under the rope, a flange each side of it
  for (const s of sheaves) {
    const g = ctx.geoms.get(s)!;
    const part = ctx.parts.get(s);
    const z = zRange(ctx, s);
    if (!part || !z) continue;
    const RS = num(g.shape.diameter, 60) / 2;
    const RP = num(g.shape.pitchDiameter, 56.8) / 2;
    const r0 = ropes.reduce((m, j) => Math.max(m, rr(j)), 1.6);
    const core = RP - r0 - 0.2;
    part.profile = { outer: circle(core, 0, 0, 72), holes: part.profile.holes };
    part.name = `${titleOf(s)}, ${2 * RS} mm, grooved for the rope`;
    const t = Math.min(1.5, (z[1] - z[0] - 2 * r0 - 0.6) / 2);
    const L = new Local({ o: [g.frame.o[0], g.frame.o[1], 0], x: [1, 0, 0], z: UP }, { joints: [] });
    for (const [k, a, b] of [[0, z[0], z[0] + t], [1, z[1] - t, z[1]]] as const)
      L.add(H.solid(`${s}-flange${k}`, { name: "", kind: "part", role: "link", mat: "Aluminium 6061-T6, anodised", outer: circle(RS, 0, 0, 72), holes: [circle(core - 0.01, 0, 0, 72).reverse()], z0: a, z1: b, body: s, group: s }));
    // an index mark on the top flange, so the turns can be counted
    const fl = L.list[L.list.length - 1]!;
    fl.marks.push({ kind: "index", pts: [[RS - 4, 0], [RS - 0.6, 0]] });
    out.push(...L.out());
  }
  // the parts
  const zOfPart = (j: KinJoint): number => {
    const zs = [j.a, j.b].map((b) => (sheaves.has(b) ? midZ(b) : null)).filter((x): x is number => x !== null);
    return zs.reduce((a, b) => a + b, 0) / Math.max(1, zs.length);
  };
  // each end at the height of the sheave it meets, where the placement put that sheave (not the record's height for its
  // plane, which the placement may have moved); a dead end on the ground at its sheave's; an end on a moving body (the
  // fall's on its carriage) at its point's, where its clamp is built
  const bodyOfPoint = (id: string) => ctx.kin.points?.find((p) => p.id === id)?.body ?? "ground";
  const zEnd = (j: KinJoint, k: 0 | 1, P: Vec3): number => {
    const s = k ? j.b : j.a;
    const other = k ? j.a : j.b;
    if (sheaves.has(s)) {
      const m = midZ(s) ?? P[2];
      // a part crossing to another plane leaves its groove as far from that plane as the groove allows, so its slant
      // clears the flange on the side it heads for
      const o = sheaves.has(other) ? midZ(other) : null;
      const zr = zRange(ctx, s);
      if (o === null || Math.abs(o - m) < 0.5 || !zr) return m;
      const r = rr(j);
      const t = Math.min(1.5, (zr[1] - zr[0] - 2 * r - 0.6) / 2);
      const spare = Math.max(0, (zr[1] - zr[0]) / 2 - t - r - 0.2);
      return m + Math.sign(m - o) * spare;
    }
    return bodyOfPoint(((j as unknown as Record<string, unknown>).ends as [string, string])[k]) === "ground" && sheaves.has(other) ? (midZ(other) ?? P[2]) : P[2];
  };
  const dead: { at: Vec3; to: Vec3; r: number; id: string }[] = [];
  for (const j of ropes) {
    const ends = (j as unknown as Record<string, unknown>).ends as [string, string] | undefined;
    if (!ends) continue;
    const a0 = pointOf(ends[0]);
    const b0 = pointOf(ends[1]);
    if (!a0 || !b0) continue;
    const za = zEnd(j, 0, a0);
    const zb = zEnd(j, 1, b0);
    const a: Vec3 = [a0[0], a0[1], za];
    const b: Vec3 = [b0[0], b0[1], zb];
    const body = bodyOfPoint(ends[0]);
    out.push({ ...rope(`${j.id}-rope`, `Rope, ${titleOf(j.id).toLowerCase()}, Ø${2 * rr(j)} braided polyester`, a, b, zOfPart(j), rr(j), ends, body), stretchZ: [za, zb] });
    ends.forEach((e, k) => {
      if (bodyOfPoint(e) === "ground" && !sheaves.has(k ? j.b : j.a)) dead.push({ at: k ? b : a, to: k ? a : b, r: rr(j), id: e });
    });
  }
  // a dead end on the ground: round a thimble on a becket pin in a post screwed to the base, at the rope's height (F1)
  const seen = new Set<string>();
  for (const d of dead) {
    // one post per dead end, however many parts name its point
    if (seen.has(d.id)) continue;
    seen.add(d.id);
    const out2 = v3.unit([d.at[0] - d.to[0], d.at[1] - d.to[1], 0]);
    const c: Vec3 = v3.add(d.at, v3.mul(out2, 5 + d.r));
    const L = new Local({ o: [c[0], c[1], 0], x: [1, 0, 0], z: UP }, { joints: [] });
    const z = d.at[2];
    if (z - 5 < ctx.base.top + 1) {
      ctx.issues.push(`rope: the dead end ${d.id} is ${(z - ctx.base.top).toFixed(1)} mm over the base: no room for its becket post`);
      continue;
    }
    L.add(H.standoff(`${d.id}-post`, { at: [0, 0, 0], z0: ctx.base.top, z1: z - 5, name: "Becket post, screwed to the base" }));
    L.add(H.dowel(`${d.id}-becket`, 4, { body: "ground", at: [0, 0, 0], z0: z - 6, z1: z + 5, name: "Becket pin Ø4, in the post" }));
    L.add(H.collar(`${d.id}-thimble`, 4, 10, { body: "ground", at: [0, 0, 0], z0: z - d.r - 0.5, z1: z + d.r + 0.5, name: "Thimble Ø10 on the becket pin, the rope's dead end round it" }));
    out.push(...L.out());
  }
  // a rope's end on a moving body (the fall on its carriage): clamped between two jaws on the body's top face, the lower
  // jaw a post standing from it, so the rope runs in over whatever the body's slide carries at its ends (F1)
  for (const j of ropes) {
    const ends = (j as unknown as Record<string, unknown>).ends as [string, string] | undefined;
    if (!ends) continue;
    ends.forEach((e, k) => {
      const pt = ctx.kin.points?.find((p) => p.id === e);
      const P = pointOf(e);
      const Q = pointOf(ends[1 - k]!);
      if (!pt || !P || !Q || pt.body === "ground" || sheaves.has(k ? j.b : j.a)) return;
      const part = ctx.parts.get(pt.body);
      if (!part || part.op.op !== "extrude") return;
      const d = v3.unit([Q[0] - P[0], Q[1] - P[1], 0]);
      const L = new Local({ o: [P[0], P[1], 0], x: d, z: UP }, { joints: [j.id] });
      const zE = P[2];
      const r = rr(j);
      const body = pt.body;
      // the jaws stand on the body's own top face
      const top = part.frame.o[2] + part.op.h;
      if (zE - r - 0.3 - top < 1) ctx.issues.push(`${j.id}: the rope's end ${e} is ${(zE - top).toFixed(1)} mm over its body's top: no room for the clamp's lower jaw`);
      L.add(H.solid(`${e}-jaw0`, { name: "Rope clamp: a post on the carriage and a jaw screwed down on the rope's end", kind: "part", role: "link", mat: "Steel, zinc plated", outer: roundRect(-4, -6, 10, 6, 2), z0: top, z1: zE - r - 0.3, body, group: `${e}-clamp` }));
      L.add(H.solid(`${e}-jaw1`, { name: "", kind: "part", role: "link", mat: "Steel, zinc plated", outer: roundRect(-4, -6, 10, 6, 2), z0: zE + r + 0.3, z1: zE + r + 3.3, body, group: `${e}-clamp` }));
      for (const [n, y] of [[0, -4], [1, 4]] as const) L.add(H.screw(`${e}-js${n}`, "socket", 3, zE + r + 3.3 - top + 4, { body, at: [3, y, 0], face: zE + r + 3.3, dir: -1, ...(n ? { name: "", qty: 0 } : { qty: 2, name: "Socket screw M3, the jaw down on the rope and the post to the carriage" }) }));
      out.push(...L.out());
    });
  }
  // the wraps: on each sheave, from where one part leaves to where the next arrives, round the far side
  for (const s of sheaves) {
    const c = centre(s);
    const g = ctx.geoms.get(s)!;
    const RP = num(g.shape.pitchDiameter, 56.8) / 2;
    const touching: Vec3[] = [];
    let toward: Vec3 = [0, 0, 0];
    for (const j of ropes) {
      const ends = (j as unknown as Record<string, unknown>).ends as [string, string] | undefined;
      if (!ends || (j.a !== s && j.b !== s)) continue;
      ends.forEach((e, k) => {
        const p = pointOf(e);
        const other = pointOf(ends[1 - k]!);
        if (p && other && Math.abs(Math.hypot(p[0] - c[0], p[1] - c[1]) - RP) < 1.5) {
          touching.push(p);
          toward = v3.add(toward, v3.unit([other[0] - p[0], other[1] - p[1], 0]));
        }
      });
    }
    if (touching.length < 2) continue;
    // the parts leave toward their other ends: the wrap is on the far side
    const away = v3.mul(v3.unit(toward), -1);
    const angs = touching.slice(0, 2).map((p) => Math.atan2(p[1] - c[1], p[0] - c[0]));
    const mid = Math.atan2(away[1], away[0]);
    // the arc from the first angle to the second that passes the far side
    let a0 = angs[0]!;
    let a1 = angs[1]!;
    const within = (x: number, lo: number, hi: number) => {
      let t = x - lo;
      while (t < 0) t += TAU;
      while (t >= TAU) t -= TAU;
      return t <= ((hi - lo) % TAU + TAU) % TAU;
    };
    if (!within(mid, a0, a1)) [a0, a1] = [a1, a0];
    while (a1 < a0) a1 += TAU;
    const z = midZ(s)!;
    const r = ropes.reduce((m, j) => Math.max(m, rr(j)), 1.6);
    const path: Vec3[] = [];
    for (let k = 0; k <= 24; k++) {
      const t = a0 + ((a1 - a0) * k) / 24;
      path.push([RP * Math.cos(t), RP * Math.sin(t), 0]);
    }
    // the wrap rides what carries the sheave's pin (the lower block, or the ground)
    const rev = ctx.kin.joints.find((q) => q.type === "revolute" && (q.a === s || q.b === s));
    const carrier = rev ? (rev.a === s ? rev.b : rev.a) : "ground";
    out.push({ id: `${s}-wrap`, name: "", role: "hw", kind: "belt", body: carrier, frame: { o: [c[0], c[1], z], x: [1, 0, 0], z: UP }, profile: { outer: circle(r, 0, 0, 16), holes: [] }, op: { op: "sweep", path }, marks: [], ex: 0, joints: [], detail: "never", flags: {}, mat: "Polyester rope, braided", member });
    // a guard round the far side of a sheave that stands still, keeping the rope in its groove
    if (carrier === "ground") {
      const RS = num(g.shape.diameter, 60) / 2;
      const ring: Vec2[] = [];
      for (let k = 0; k <= 24; k++) ring.push([(RS + 1) * Math.cos(a0 + 0.2 + ((a1 - a0 - 0.4) * k) / 24), (RS + 1) * Math.sin(a0 + 0.2 + ((a1 - a0 - 0.4) * k) / 24)]);
      for (let k = 24; k >= 0; k--) ring.push([(RS + 3) * Math.cos(a0 + 0.2 + ((a1 - a0 - 0.4) * k) / 24), (RS + 3) * Math.sin(a0 + 0.2 + ((a1 - a0 - 0.4) * k) / 24)]);
      const zr = zRange(ctx, s)!;
      out.push({ ...place({ o: [c[0], c[1], 0], x: [1, 0, 0], z: UP }, H.plate(`${s}-guard`, ring, { kind: "bracket", role: "ground", name: "Rope guard round the sheave, keeps the rope in its groove", z0: zr[0], z1: zr[1], mat: "Steel, zinc plated" }))[0]! });
    }
  }
  ctx.add(out);
}


/**
 * The load's guide (a prismatic joint declared `rod`: a tackle's lower block on its load line): a hook block on a swivel
 * under the lower block (F3), bushed on a ground rod along the load line that stands out of a block screwed and dowelled
 * to the base past the hook's travel (F1, F2); the hook block's bushing is the rod's slide.
 */
function buildLoadRod(ctx: BuildCtx, j: KinJoint): void {
  const body = j.a === "ground" ? j.b : j.a;
  const g = ctx.geoms.get(body);
  const part = ctx.parts.get(body);
  const ext = ctx.extent(body);
  const hook = ctx.kin.points?.find((p) => p.body === body && p.id === "hook");
  if (!g || !part || !ext || !ctx.base || !hook) return;
  const axis = v3.unit((j.axis as Vec3 | undefined) ?? [0, 1, 0]);
  const H0 = ctx.S.refPts.get("hook")!;
  const along = (ctx.sampled.xfs.get(body) ?? []).map((X) => v3.dot(X.t, axis));
  const lo = Math.min(0, ...along);
  const hi = Math.max(0, ...along);
  const z0 = v3.dot(v3.add(ext.frame.o, v3.mul(ext.frame.z, ext.w0)), UP);
  const z1 = v3.dot(v3.add(ext.frame.o, v3.mul(ext.frame.z, ext.w1)), UP);
  const zc = (z0 + z1) / 2;
  const F: Frame = { o: [H0[0], H0[1], 0], x: axis, z: UP };
  const L = new Local(F, { joints: [j.id] });
  // the hook block: on a swivel at the lower block's hook point, reaching sideways to its eye, bushed on the rod, which
  // runs beside the block along the load's line, clear of it over the whole travel
  const eyeL = 8;
  const side = -30;
  const rodD = 6;
  const bushD = rodD + 3;
  const eyeD = bushD + 4;
  const eyeLen = 20;
  const sg = Math.sign(side);
  // the arm, from the swivel to the eye's side
  L.add(H.plate(`${j.id}-hook`, H.window([[0, 0], [-eyeL, side - sg * (bushD / 2 + 5)]], 4.5), { body, kind: "part", role: "output", name: "Hook block on a swivel, its eye bushed on the guide rod (the load's eye)", z0, z1, mat: "Steel C45, forged" }));
  L.add(H.solid(`${j.id}-swivel`, { name: "Swivel pin Ø6, the hook turns on it", kind: "shaft", role: "hw", mat: "Steel 42CrMo4", outer: circle(3, 0, 0, 20), z0: z0 - 1, z1: z1 + 1, body }));
  // the rod: from just past the eye at the top of the travel down to its block on the base
  const top = -eyeL + hi + 12;
  const bot = -eyeL + lo - 40;
  const lat = v3.cross(UP, axis);
  // the rod's axis mid-way up the block, or high enough that the eye clears the base
  const zRod = Math.max(zc, ctx.base.top + 0.6 + eyeD / 2);
  const rodAt: Vec3 = v3.add([H0[0], H0[1], zRod], v3.mul(lat, side));
  // the eye: a boss along the rod, the bushing pressed in, part of the hook block
  const E = new Local({ o: v3.add(rodAt, v3.mul(axis, -eyeL - eyeLen / 2)), x: UP, z: axis }, { joints: [j.id] });
  E.add(H.solid(`${j.id}-eye`, { name: "", kind: "part", role: "output", mat: "Steel C45, forged", outer: circle(eyeD / 2, 0, 0, 32), holes: [circle(bushD / 2, 0, 0, 32).reverse()], z0: 0, z1: eyeLen, body, group: `${j.id}-hook` }));
  E.add(H.bushing(`${j.id}-bush`, rodD, bushD, { body, z0: 0, z1: eyeLen, name: `Bronze bushing ${rodD} x ${bushD}, runs on the guide rod` }));
  // a round rod along the axis: a solid of its own frame, its z along the axis
  const R = new Local({ o: v3.add(rodAt, v3.mul(axis, bot)), x: UP, z: axis }, { joints: [j.id] });
  R.add(H.shaft(`${j.id}-rod`, { d: rodD, z0: 0, z1: top - bot }, { name: `Guide rod Ø${rodD}, ground, on the load's line` }));
  // the rod's block on the base: the rod pressed in and pinned
  const bt = ctx.base.top;
  const B = new Local({ o: [0, 0, 0], x: [1, 0, 0], z: UP }, { joints: [j.id] });
  const P0 = v3.add([rodAt[0], rodAt[1], 0], v3.mul(axis, bot + 12));
  const e = axis;
  const f = v3.cross(UP, e);
  const corner = (u: number, w: number): Vec2 => [P0[0] + e[0] * u + f[0] * w, P0[1] + e[1] * u + f[1] * w];
  B.add(H.plate(`${j.id}-rodblock`, [corner(-12, -11), corner(12, -11), corner(12, 11), corner(-12, 11)], { kind: "bracket", role: "ground", name: "Rod block, screwed and dowelled to the base, the rod pressed in", z0: bt, z1: zRod + rodD / 2 + 5, mat: "Steel C45" }));
  for (const [k, u] of [[0, -6], [1, 6]] as const) {
    const c = corner(u, 7);
    const d = corner(u, -7);
    B.add(H.screw(`${j.id}-rbs${k}`, "socket", 4, 10, { at: [c[0], c[1], 0], face: bt - 8, dir: 1, ...(k ? { name: "", qty: 0 } : { qty: 2 }) }));
    B.add(H.dowel(`${j.id}-rbd${k}`, 4, { at: [d[0], d[1], 0], z0: bt - 5, z1: bt + 6, ...(k ? { name: "", qty: 0 } : { name: "Dowel pin Ø4 h6, rod block to base", qty: 2 }) }));
  }
  ctx.add([...L.out(), ...E.out(), ...R.out(), ...B.out()]);
  ctx.note({ id: j.id, kit: "J5", at: ctx.S.joints.get(j.id)!.at, title: `J5 · ${titleOf(j.id)}`, note: `${titleOf(j.id)}: the lower block hangs on its rope parts; its hook block, on a swivel under it (F3), runs on a ground rod along the load's line in a bronze bushing, so the load rises straight; the rod stands out of a block screwed and dowelled to the base past the hook's travel (F1, F2).`, badge: ["load guided on its line", "ok"], serves: { F1: [`${j.id}-rbd0`], F3: [`${j.id}-swivel`] } });
}

/** The flexible members this rule builds: a timing belt or a roller chain between two wheels. */
export const builds = (j: KinJoint): boolean => j.type === "belt" && ["belt", "chain"].includes(String((j as unknown as Record<string, unknown>).flexible)) && j.a !== "ground" && j.b !== "ground" && !(j as unknown as Record<string, unknown>).strand;

/** A strand of a member anchored at one end round a sprocket on a moving carrier (a stroke doubler): src/builder/strand.ts. */
const isStrand = (j: KinJoint): boolean => j.type === "belt" && !!(j as unknown as Record<string, unknown>).strand;

export const j12: Rule = {
  id: "j12-flexible",
  tier: "AUTO",
  ids: ["J12", "J8", "A11", "F2", "F3", "F6", "F7", "F8", "F10"],
  fixture: "belt-drive",
  applies: (ctx) => ctx.kin.joints.some((j) => builds(j) || isStrand(j) || (j.type === "belt" && (j as unknown as Record<string, unknown>).flexible === "rope")),
  apply(ctx) {
    if (ctx.kin.joints.some(isStrand)) buildStrands(ctx);
    for (const j of ctx.kin.joints.filter(builds)) {
      if ((j as unknown as Record<string, unknown>).flexible === "chain") buildChain(ctx, j);
      else buildTimingBelt(ctx, j);
    }
    const ropes = ctx.kin.joints.filter((j) => j.type === "belt" && (j as unknown as Record<string, unknown>).flexible === "rope");
    if (ropes.length) buildRope(ctx, ropes);
    for (const j of ctx.kin.joints) if (j.type === "prismatic" && (j as unknown as Record<string, unknown>).rod) buildLoadRod(ctx, j);
    // the base drops under what the loop carries below its wheels (a chain's lower plates)
    if (ctx.base) {
      let low = Infinity;
      for (const q of ctx.solids) if (q.convey) for (const p of worldPoints(ctx.M, q)) low = Math.min(low, p[2]);
      if (low - BASE_GAP < ctx.base.top) ctx.base = { ...ctx.base, top: low - BASE_GAP, bottom: low - BASE_GAP - BASE_T };
    }
  },
};
