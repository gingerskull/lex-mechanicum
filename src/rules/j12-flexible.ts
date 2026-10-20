// J12: a flexible member the model declares (MechanismModel.flexible), extending J8 to timing belts, chains, ropes and
// CVT belts.
// - Timing belt (recorded as J8): its back is the model's fixed band round the pitch path, never a plate on posts; its
//   teeth are carried round the two pulleys by the solved travel (a conveyed placement, D9); the small pulley is
//   flanged (J8, F10); it runs dry (no F8).
// - Chain: its rollers and link plates are carried round the two sprockets by the solved travel (a conveyed placement:
//   each a small rigid solid on the fixed path, nothing deforms); greased (F8).
// - Both: the centres are fixed by the shafts, so an idler on the slack span near the small wheel, outside the loop,
//   takes up the stretch: on a sealed bearing on a stud through an arm slotted across the span and clamped on two posts
//   (F7); a belt's idler is a flat flanged pulley on the belt's back, a chain's a sprocket.
// - Rope: its spans are stretched parts of the model, its wraps fixed arcs over the sheaves (P.ropeSpan, P.ropeWrap),
//   touching their sheaves and the spans they join by design; a becket on a post dead-ends it with a thimble (F1, F2),
//   the hook hangs on a swivel so the load can turn (F3), each at its own sheave's height, and a guard over each sheave
//   whose centre stands still keeps the rope in its groove (F2). The note counts the parts that carry the load.
// - CVT: each sliding sheave half is keyed to its shaft so it slides but cannot turn on it (F3), and a spring presses
//   it on the belt (F6).
import { beltLength, beltPath, beltTooth, htd, pathLength } from "../core/flex";
import { TAU, arcPts, circle, roundedPoly, type Vec2 } from "../core/geom";
import { toLocal } from "../core/poly";
import { bearing, circlip, disc, dowel, hullOf, key, nut, plainWasher, plate, screw, shaft, spacer, spring, standoff } from "../hardware/primitives";
import { solid, type Solid } from "../hardware/solid";
import { BEARINGS } from "../hardware/tables";
import { poseOf } from "../model/pose";
import { FLANGE_T, flanges } from "./j8-belt";
import type { FlexJoint, Joint, Rule, RuleContext } from "./types";

const fmt = (v: number) => String(+v.toFixed(1));
/** Link plate thickness and the gap the idler leaves over the chain, mm. */
const PLATE = 1.2;

/** Pitch radius of a sprocket of z teeth at chain pitch p. */
export const sprocketR = (z: number, p: number): number => p / (2 * Math.sin(Math.PI / z));

/** The tensioner arm: its thickness and gap over what it clears, its posts along and outward of the idler, the slot. */
const ARM = { t: 5, gap: 0.7, along: 26, out: 6, slot: 4 };
/** A flat idler's and a timing belt's small pulley's flanges stand this far past the belt's back, mm. */
const FLANGE_RISE = 2.5;

/**
 * The idler of a chain or belt (F7): on the slack span (the one leaving the driving wheel as the travel grows), near the
 * small wheel, outside the loop, touching the member's back (`back` out from the pitch line); turning with the loop on
 * a sealed bearing on a stud, the stud through an arm above it that is slotted across the span on two posts and clamped
 * there by two screws. Returns the idler, or null when the wheels have no pose.
 */
function idler(
  ctx: RuleContext,
  j: FlexJoint & { spec: { over: [string, string]; travel: string } },
  o: { r: [number, number]; ri: number; back: number; z: [number, number]; top: number; ex: number; outer: Vec2[]; name: string; mat: string; flanged?: boolean },
): Solid | null {
  const J = ctx.joint(j.id)!;
  const [a, b] = j.spec.over.map((id) => ctx.parts[id]!);
  const qa = poseOf(a!, ctx.s0);
  const qb = poseOf(b!, ctx.s0);
  if (!qa || !qb) return null;
  const c1: Vec2 = [qa[0], qa[1]];
  const c2: Vec2 = [qb[0], qb[1]];
  const [r1, r2] = o.r;
  const C = Math.hypot(c2[0] - c1[0], c2[1] - c1[1]);
  const ang = Math.atan2(c2[1] - c1[1], c2[0] - c1[0]);
  const beta = Math.asin((r2 - r1) / C);
  const tangent = (c: Vec2, r: number, s: number): Vec2 => [c[0] + r * Math.cos(ang + s * (Math.PI / 2 + beta)), c[1] + r * Math.sin(ang + s * (Math.PI / 2 + beta))];
  // the path runs along the lower span from wheel 1 to wheel 2: that span leaves wheel 1 as the travel grows, and is
  // slack when wheel 1 drives
  const lower: [Vec2, Vec2] = [tangent(c1, r1, -1), tangent(c2, r2, -1)];
  const upper: [Vec2, Vec2] = [tangent(c1, r1, 1), tangent(c2, r2, 1)];
  const drives1 = ctx.model.input.part !== b!.id;
  const t0 = ctx.model.solve(0)[j.spec.travel];
  const t1 = ctx.model.solve(0.01)[j.spec.travel];
  const grows = typeof t0 !== "number" || typeof t1 !== "number" || t1 >= t0;
  const slack = drives1 === grows ? lower : upper;
  // from the small wheel's end
  const [S1, S2] = r1 <= r2 ? slack : [slack[1], slack[0]];
  const L = Math.hypot(S2[0] - S1[0], S2[1] - S1[1]);
  const t: Vec2 = [(S2[0] - S1[0]) / L, (S2[1] - S1[1]) / L];
  // outward: away from the middle of the two centres
  const mid: Vec2 = [(c1[0] + c2[0]) / 2, (c1[1] + c2[1]) / 2];
  const sgn = (S1[0] - mid[0]) * t[1] - (S1[1] - mid[1]) * t[0] >= 0 ? 1 : -1;
  const n: Vec2 = [sgn * t[1], -sgn * t[0]];
  const off = (p: Vec2, u: number, v: number): Vec2 => [p[0] + t[0] * u + n[0] * v, p[1] + t[1] * u + n[1] * v];
  const ci = off(S1, 0.3 * L, o.back + o.ri);
  const id = `${j.id}-idler`;
  const G = { joints: [j.id], ex: o.ex };
  // it turns with the loop, geared to the first wheel
  const turn = { body: a!.id, motion: { type: "geared" as const, around: ci, ratio: -r1 / o.ri } };
  const brg = BEARINGS.find((x) => x.name === "6800")!;
  const [z0, z1] = o.z;
  const idl = solid(id, { ...G, ...turn, kind: "pulley", role: "link", name: o.name, outer: o.outer, holes: [disc(brg.D / 2)], z0, z1, mat: o.mat });
  ctx.add(idl);
  if (o.flanged) flanges(ctx, idl, 2 * (o.ri + FLANGE_RISE), J, "Idler flanges");
  const A0 = Math.max(o.top, o.flanged ? z1 + FLANGE_T : z1) + ARM.gap;
  const A1 = A0 + ARM.t;
  const at: [number, number, number] = [ci[0], ci[1], 0];
  // E4: the arm comes off first with the stud and what rides it; the idler and its bearing stay in the loop's plane
  const UP = { joints: [j.id], ex: o.ex + 1 };
  const zb = (z0 + z1 - brg.B) / 2;
  ctx.add(bearing(`${id}-brg`, brg, { ...G, at, z0: zb, z1: zb + brg.B, closure: "seal", name: `Bearing ${brg.name}-2RS (${brg.d}x${brg.D}x${brg.B}), pressed into the idler, retaining compound` }));
  ctx.add(circlip(`${id}-cl`, brg.d, { ...UP, at, z0: zb - 1 }));
  ctx.add(spacer(`${id}-sp`, brg.d, brg.d + 4, { ...UP, at, z0: zb + brg.B, z1: A0, name: `Inner-race spacer ${brg.d}x${brg.d + 4}, idler to arm` }));
  ctx.add(shaft(`${id}-stud`, { d: brg.d, z0: zb - 1.2, z1: A1 + 1.5, grooves: [zb - 1], thread: { M: 8, z0: A0, z1: A1 + 1.5 } }, { ...UP, at, name: `Idler stud Ø${brg.d}, M8 end through the arm` }));
  ctx.add(plainWasher(`${id}-wa`, 8, { ...UP, at, z0: A1 }));
  ctx.add(nut(`${id}-nut`, 8, { ...UP, at, z0: A1 + 1.6 }));
  // the arm: a boss over the idler and an ear each side, slotted across the span at its posts
  const posts = [off(ci, -ARM.along, ARM.out), off(ci, ARM.along, ARM.out)];
  const slot = (p: Vec2) => roundedPoly([[p[0] - n[0] * ARM.slot, p[1] - n[1] * ARM.slot], [p[0] + n[0] * ARM.slot, p[1] + n[1] * ARM.slot]], 2.75);
  const arm = plate(`${j.id}-arm`, hullOf([[ci[0], ci[1], 10], ...posts.map((p): [number, number, number] => [p[0], p[1], 7.5])]), { ...UP, kind: "bracket", name: "Tensioner arm, steel, slotted across the span for the take-up", holes: [disc(4.2, ci[0], ci[1]), ...posts.map(slot)], z0: A0, z1: A1, mat: "Steel S235, zinc plated" });
  ctx.add(arm);
  posts.forEach((p, k) => {
    const pat: [number, number, number] = [p[0], p[1], 0];
    const pid = `${j.id}-arm-post${k}`;
    ctx.add(standoff(pid, { ...G, at: pat, z0: ctx.b1, z1: A0, name: k ? "" : `Standoff Ø10 x ${fmt(A0 - ctx.b1)}, M5, the tensioner arm's posts`, qty: k ? 0 : 2 }));
    ctx.add(plainWasher(`${pid}-wa`, 5, { ...UP, at: pat, z0: A1 }));
    ctx.add(screw(`${pid}-top`, "socket", 5, 12, { ...G, at: pat, face: A1 + 1, dir: -1, ex: o.ex + 1.5, name: k ? "" : "Socket head M5 x 12, clamps the arm in its slot", qty: k ? 0 : 2 }));
    ctx.add(screw(`${pid}-bot`, "button", 5, ctx.b1 - ctx.b0 + 6, { ...G, at: pat, face: ctx.b0, dir: 1, ex: -1.5, lock: "threadlocker, medium strength (Loctite 243)" }));
  });
  (J.serves.F7 ??= []).push(arm.id, id);
  (J.serves.F2 ??= []).push(`${id}-cl`, `${id}-nut`);
  return idl;
}

function belt(ctx: RuleContext, j: FlexJoint & { spec: { form: "belt" } }): void {
  const J: Joint = ctx.joint(j.id)!;
  const f = j.spec;
  const [a, b] = f.over.map((id) => ctx.parts[id]!);
  const qa = poseOf(a!, ctx.s0);
  const qb = poseOf(b!, ctx.s0);
  const band = ctx.solidOf[f.band];
  if (!qa || !qb || a!.z === undefined || b!.z === undefined || !band) {
    J.note = "Timing belt: both pulleys need a pose and a tooth count (P.pulley), and the band a part.";
    return;
  }
  const P = htd(f.pitch);
  const r1 = (f.pitch * a!.z) / TAU;
  const r2 = (f.pitch * b!.z) / TAU;
  const path = beltPath([qa[0], qa[1]], r1, [qb[0], qb[1]], r2, Math.PI / 96);
  const L = beltLength(r1, r2, Math.hypot(qb[0] - qa[0], qb[1] - qa[1]));
  const N = Math.round(L / f.pitch);
  // D9: the teeth carried round the pitch path; they run the belt's full width, the band standing 0.1 mm in at each
  // face (the model), so a tooth is never level with the band it is moulded to and draws as its own edge
  const T = beltTooth(f.pitch);
  for (let i = 0; i < N; i++)
    ctx.add(solid(`${j.id}-t${i}`, { kind: "belt", role: "link", name: i ? "" : `Belt teeth, HTD ${f.pitch}M, ${N}`, qty: i ? 0 : N, motion: { type: "convey", path, key: f.travel, offset: i * f.pitch }, outer: T, z0: band.z0 - 0.1, z1: band.z1 + 0.1, ex: band.ex, joints: [j.id], allow: [band.id, a!.id, b!.id], mat: "Neoprene, glass-fibre cords" }));
  // J8, F10: flanges on the small pulley; the thrust washer under it gives way to the lower one
  const back = P.hs - P.ht - P.pld;
  const [small, rs] = r1 <= r2 ? [a!, r1] : [b!, r2];
  const ss = ctx.solidOf[small.id]!;
  flanges(ctx, ss, 2 * (rs + back + FLANGE_RISE), J);
  const pin = ctx.info.find((i) => i.kind === "pin" && i.driven.some((x) => x.part.id === small.id));
  if (pin)
    for (const t of ctx.solids)
      if (t.joints.includes(pin.id) && t.body === ss.body && t.z1 > ss.z0 - FLANGE_T + 1e-6 && t.z1 <= ss.z0 + 1e-6 && t.z0 < ss.z0 - FLANGE_T) t.z1 = ss.z0 - FLANGE_T;
  // F7: the idler on the belt's back
  const ri = Math.max(14, rs * 0.45);
  idler(ctx, j, { r: [r1, r2], ri, back, z: [ss.z0, ss.z1], top: ss.z1, ex: band.ex, outer: disc(ri), name: `Idler pulley Ø${fmt(2 * ri)}, flat, on the belt's back`, mat: "Aluminium 6061-T6, hard anodised", flanged: true });
  const off = L - N * f.pitch;
  J.note = `HTD ${f.pitch}M timing belt, ${N} teeth, ${fmt(N * f.pitch)} mm pitch length, over the ${a!.z}-groove ${a!.id} and the ${b!.z}-groove ${b!.id} pulley${Math.abs(off) > 0.5 ? ` (${fmt(L)} mm of path: ${fmt(off)} mm off a whole number of teeth, taken up by the idler)` : ": the centre distance is set for a whole number of teeth"}; the teeth are carried round in the grooves by the belt's travel, so the ratio is exact. Flanged small pulley (F10). The centres are fixed, so a flat flanged idler on the belt's back, on the slack span near the small pulley, takes up the stretch: its arm slides ±${ARM.slot} mm across the span on two posts and is clamped by two M5 screws (F7); it also lays more belt on the small pulley. No lubrication: a dry belt (F8 none).`;
  J.badge = ["belt tensioned", "ok"];
}

function chain(ctx: RuleContext, j: FlexJoint & { spec: { form: "chain" } }): void {
  const J = ctx.joint(j.id)!;
  const f = j.spec;
  const [a, b] = f.over.map((id) => ctx.parts[id]!);
  const qa = poseOf(a!, ctx.s0);
  const qb = poseOf(b!, ctx.s0);
  if (!qa || !qb || a!.z === undefined || b!.z === undefined) {
    J.note = "Chain: both sprockets need a pose and a tooth count.";
    return;
  }
  const r1 = sprocketR(a!.z, f.pitch);
  const r2 = sprocketR(b!.z, f.pitch);
  const path = beltPath([qa[0], qa[1]], r1, [qb[0], qb[1]], r2);
  const L = pathLength(path);
  const N = Math.round(L / f.pitch);
  const s = ctx.solidOf[a!.id]!;
  const [z0, z1] = [s.z0, s.z1];
  const allow = [a!.id, b!.id];
  const G = { body: "ground", joints: [j.id], ex: s.ex, allow };
  const plateW = f.roller * 1.45;
  const link = roundedPoly([[-f.pitch / 2, 0], [f.pitch / 2, 0]], plateW / 2);
  for (let i = 0; i < N; i++) {
    const conv = (o: number) => ({ type: "convey" as const, path, key: f.travel, offset: o });
    ctx.add(solid(`${j.id}-r${i}`, { ...G, kind: "roller", role: "bearing", name: i ? "" : `Roller chain ${fmt(f.pitch)} pitch, ${N} links`, qty: i ? 0 : 1, motion: conv(i * f.pitch), outer: disc(f.roller / 2), holes: [], z0, z1, mat: "Steel, case hardened" }));
    // inner links (even) sit next to the rollers, outer links (odd) outside them
    const k = i % 2;
    for (const [side, w0] of [["t", z1 + k * PLATE], ["b", z0 - (k + 1) * PLATE]] as const)
      ctx.add(solid(`${j.id}-p${i}${side}`, { ...G, kind: "plate", role: "hw", name: "", qty: 0, motion: conv((i + 0.5) * f.pitch), outer: link, holes: [], z0: w0, z1: w0 + PLATE, mat: "Steel, through hardened", chamfer: 0 }));
  }
  // the idler sprocket on the slack span, outside the chain; its teeth take the rollers by design
  const ri = Math.max(14, r1 * 0.6);
  const idl = idler(ctx, j, { r: [r1, r2], ri, back: f.roller / 2 - 1.5, z: [z0, z1], top: z1 + 2 * PLATE, ex: s.ex, outer: circle(ri, 0, 0, 48), name: `Idler sprocket Ø${fmt(2 * ri)} on a sealed bearing`, mat: "Steel C45" });
  if (idl) allow.push(idl.id);
  J.note = `Roller chain, ${fmt(f.pitch)} pitch, ${N} links (${fmt(L)} mm of path${Math.abs(L - N * f.pitch) > 0.5 ? `: ${fmt(L - N * f.pitch)} mm off a whole number of links, taken up by the idler` : ""}) over the ${a!.id} and the ${b!.id}: rollers and link plates carried round, an idler sprocket on the slack span on an arm slotted across it and clamped on two posts (F7), greased (F8).`;
  J.badge = ["chain tensioned", "ok"];
}

/** Whether a part's centre stands still over the cycle (a sheave on a fixed pin, whether or not it is a fixed part). */
function still(ctx: RuleContext, id: string): boolean {
  const p = ctx.parts[id];
  if (!p) return false;
  if (p.fixed) return true;
  const q0 = poseOf(p, ctx.s0);
  if (!q0) return false;
  for (let i = 0; i < 24; i++) {
    const q = poseOf(p, ctx.model.solve((i / 24) * TAU));
    if (!q || Math.hypot(q[0] - q0[0], q[1] - q0[1]) > 1e-6) return false;
  }
  return true;
}

/** The world centre and rim radius of a sheave at the assembly phase. */
function rim(ctx: RuleContext, id: string): { c: Vec2; R: number } | null {
  const p = ctx.parts[id];
  const q = p ? poseOf(p, ctx.s0) : null;
  return p && q ? { c: [q[0], q[1]], R: Math.max(...p.shape.outer.map(([x, y]) => Math.hypot(x, y))) } : null;
}

function rope(ctx: RuleContext, j: FlexJoint & { spec: { form: "rope" } }): void {
  const J = ctx.joint(j.id)!;
  const f = j.spec;
  const dead = f.dead ? ctx.s0.pts[f.dead] : undefined;
  const hook = f.hook ? ctx.s0.pts[f.hook] : undefined;
  const ex = Math.max(0, ...f.over.map((id) => ctx.solidOf[id]?.ex ?? 0));
  const sheaves = f.over.filter((id) => ctx.solidOf[id] && rim(ctx, id));
  const zOf = (id: string): [number, number] => [ctx.solidOf[id]!.z0, ctx.solidOf[id]!.z1];
  // a point's own sheave: the one whose rim is nearest it, among those at the height of the rope part ending there
  const own = (pt: string | undefined, among: string[]): string | undefined => {
    const P = pt ? ctx.s0.pts[pt] : undefined;
    if (!P || !among.length) return among[0];
    const sp = f.spans.map((id) => ctx.parts[id]).find((p) => p?.between?.includes(pt!));
    const zs = sp ? ctx.solidOf[sp.id] : undefined;
    const meets = (id: string) => !zs || Math.min(zs.z1, zOf(id)[1]) - Math.max(zs.z0, zOf(id)[0]) > 0;
    const d = (id: string) => {
      const r = rim(ctx, id)!;
      return Math.abs(Math.hypot(P[0] - r.c[0], P[1] - r.c[1]) - r.R);
    };
    return [...among].sort((a, b) => Number(meets(b)) - Number(meets(a)) || d(a) - d(b))[0];
  };
  const fixed = sheaves.filter((id) => still(ctx, id));
  const moves = sheaves.filter((id) => !fixed.includes(id));
  if (dead) {
    // the becket: a plate holding a thimble the rope's dead end is spliced round (F1, F2), its pin threaded into the top
    // of a post screwed up from under the base (A11)
    const span = f.spans.map((id) => ctx.parts[id]).find((p) => p?.between?.includes(f.dead!));
    const far = span?.between?.find((k) => k !== f.dead);
    const [z0, z1] = zOf(own(far, sheaves) ?? sheaves[0]!);
    ctx.add(plate(`${j.id}-becket`, roundedPoly([[dead[0], dead[1] + 6], [dead[0], dead[1] + 16]], 6), { body: "ground", joints: [j.id], ex, kind: "bracket", name: "Becket with a thimble, the rope's dead end spliced round it", z0: z0 - 2, z1: z1 + 2, holes: [circle(3, dead[0], dead[1] + 11, 20)], mat: "Steel, galvanised" }));
    const at: [number, number, number] = [dead[0], dead[1] + 11, 0];
    const pin = dowel(`${j.id}-becket-pin`, 6, { body: "ground", at, z0: z0 - 4, z1: z1 + 4, ex, joints: [j.id], name: "Becket pin Ø6, split-pinned" });
    ctx.add(pin);
    if (pin.z0 - ctx.b1 > 1) {
      ctx.add(standoff(`${j.id}-becket-post`, { body: "ground", at, z0: ctx.b1, z1: pin.z0, ex: pin.ex - 0.5, joints: [j.id], name: `Becket post Ø10 x ${fmt(pin.z0 - ctx.b1)}, the becket pin threaded into its top` }));
      ctx.add(screw(`${j.id}-becket-post-bot`, "button", 5, ctx.b1 - ctx.b0 + 8, { body: "ground", at, face: ctx.b0, dir: 1, ex: -1.5, joints: [j.id], lock: "threadlocker, medium strength (Loctite 243)" }));
    }
    (J.serves.F1 ??= []).push(`${j.id}-becket`);
    (J.serves.F2 ??= []).push(`${j.id}-becket-pin`);
  }
  // the hook on a swivel on the moving block, at its own sheave's height: the load turns without twisting the rope (F3)
  const moving = (f.load ? [ctx.parts[f.load]] : f.over.map((id) => ctx.parts[id])).find((p) => p && !p.fixed);
  if (hook && moving) {
    const q = poseOf(moving, ctx.s0)!;
    const l = toLocal(q, hook);
    const body = moving.id;
    const near = moves.length ? moves : sheaves;
    const [z0, z1] = zOf([...near].sort((a, b) => Math.hypot(hook[0] - rim(ctx, a)!.c[0], hook[1] - rim(ctx, a)!.c[1]) - Math.hypot(hook[0] - rim(ctx, b)!.c[0], hook[1] - rim(ctx, b)!.c[1]))[0] ?? f.over[0]!);
    ctx.add(solid(`${j.id}-swivel`, { body, at: [l[0], l[1], 0], kind: "collar", role: "hw", name: "Hook swivel on a thrust bearing", outer: disc(7), holes: [disc(3)], z0: z0 - 1, z1: z1 + 1, ex: ctx.solidOf[body]!.ex, joints: [j.id], mat: "Steel, forged" }));
    ctx.add(solid(`${j.id}-hook`, { body, at: [l[0], l[1] - 10, 0], kind: "part", role: "output", name: "Load hook with a safety latch", outer: [...arcPts(0, -6, 8, 0, Math.PI, Math.PI / 10), ...arcPts(0, -6, 4, Math.PI, 0, Math.PI / 8)], z0, z1, ex: ctx.solidOf[body]!.ex, joints: [j.id], mat: "Steel, forged" }));
    (J.serves.F3 ??= []).push(`${j.id}-swivel`);
  }
  // a guard over each sheave whose centre stands still keeps the rope in the groove when it goes slack (F2)
  fixed.forEach((id, k) => {
    const { c, R } = rim(ctx, id)!;
    const [x, y] = c;
    const [z0, z1] = zOf(id);
    const band = [...arcPts(x, y, R + 4, Math.PI * 0.15, Math.PI * 0.85, Math.PI / 24), ...arcPts(x, y, R + 2, Math.PI * 0.85, Math.PI * 0.15, Math.PI / 24)];
    ctx.add(solid(`${j.id}-${id}-guard`, { body: "ground", kind: "stop", role: "hw", name: k ? "" : "Rope guard over the sheave, steel strip", qty: k ? 0 : fixed.length, outer: band, z0: z0 - 1, z1: z1 + 1, ex: ctx.solidOf[id]!.ex, joints: [j.id], mat: "Steel S235" }));
    (J.serves.F2 ??= []).push(`${j.id}-${id}-guard`);
  });
  // each wrap lies in its sheave's groove and meets the spans at their tangent points, by design
  for (const id of f.wraps ?? []) {
    const w = ctx.parts[id];
    const ws = ctx.solidOf[id];
    const q = w ? poseOf(w, ctx.s0) : null;
    if (!w || !ws || !q) continue;
    const r = w.shape.outer.map(([x, y]) => Math.hypot(x, y));
    const [r0, r1] = [Math.min(...r) - 0.5, Math.max(...r) + 0.5];
    const on = (P: Vec2 | undefined) => !!P && Math.hypot(P[0] - q[0], P[1] - q[1]) >= r0 && Math.hypot(P[0] - q[0], P[1] - q[1]) <= r1;
    const grooves = sheaves.filter((s) => Math.hypot(rim(ctx, s)!.c[0] - q[0], rim(ctx, s)!.c[1] - q[1]) < 0.01);
    const joins = f.spans.filter((s) => ctx.parts[s]?.between?.some((k) => on(ctx.s0.pts[k])));
    ws.allow = [...(ws.allow ?? []), ...grooves, ...joins];
  }
  // the rope lies in the sheaves' grooves and through the becket and swivel by design
  const touch = ctx.solids.filter((t) => t.joints.includes(j.id) || f.over.includes(t.body)).map((t) => t.id);
  for (const id of f.spans) {
    const sp = ctx.solidOf[id];
    if (sp) sp.allow = [...(sp.allow ?? []), ...f.over, ...touch];
  }
  // the parts that carry the load: spans with an end on a moving sheave's rim, or on the load itself
  const load = f.load ? ctx.parts[f.load] : undefined;
  const lq = load ? poseOf(load, ctx.s0) : null;
  const carries = f.spans.filter((id) =>
    (ctx.parts[id]?.between ?? []).some((k) => {
      const P = ctx.s0.pts[k];
      if (!P) return false;
      if (lq && Math.hypot(P[0] - lq[0], P[1] - lq[1]) < 0.5) return true;
      if (hook && Math.hypot(P[0] - hook[0], P[1] - hook[1]) < 0.5) return true;
      return moves.some((s) => {
        const { c, R } = rim(ctx, s)!;
        return Math.hypot(P[0] - c[0], P[1] - c[1]) <= R + 0.5;
      });
    }),
  ).length;
  const n = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight"][carries] ?? String(carries);
  const parts = carries > 1 ? `${n} parts carry the load, so the fall moves ${n} times as far as the load` : `${n} part carries the load`;
  const held = [dead && "dead-ended on a becket with a thimble on a post", hook && moving && "the hook on a swivel", fixed.length && "a guard over each sheave whose centre stands still"].filter(Boolean);
  J.note = `Rope reeved over ${f.over.length} sheaves, ${f.spans.length} straight parts: ${parts}. Its spans stretch between their tangent points${f.wraps?.length ? ", its wraps lie in the grooves" : ""}${held.length ? `; ${held.join(", ")}` : ""}.`;
  J.badge = ["rope reeved", "ok"];
}

function cvt(ctx: RuleContext, j: FlexJoint & { spec: { form: "cvt" } }): void {
  const J = ctx.joint(j.id)!;
  for (const id of j.spec.over) {
    const host = ctx.solidOf[id];
    if (!host) continue;
    const G = { body: id, joints: [j.id], ex: host.ex };
    const k = key(`${j.id}-${id}-key`, 4, host.z1 - host.z0, { ...G, outer: [[5, -2], [9, -2], [9, 2], [5, 2]], z0: host.z0, z1: host.z1, name: "Sliding key: the sheave half slides on the shaft, never turns on it" });
    ctx.add(k);
    ctx.add(spring(`${j.id}-${id}-spring`, "compression", { ...G, D: 18, wire: 1.6, z0: host.z1, z1: host.z1 + 12, name: "Compression spring pressing the sheave half on the belt" }));
    (J.serves.F3 ??= []).push(k.id);
    (J.serves.F6 ??= []).push(`${j.id}-${id}-spring`);
  }
  J.note = "CVT belt between sheave pairs: each sliding half keyed to its shaft and pressed on the belt by a spring.";
  J.badge = ["sheaves keyed and sprung", "ok"];
}

export const j12: Rule = {
  id: "j12-flexible",
  tier: "AUTO",
  ids: ["J12", "J8", "A11", "F2", "F3", "F6", "F7", "F8", "F10"],
  applies: (ctx) => ctx.info.some((j) => j.type === "J12"),
  apply(ctx) {
    for (const j of ctx.info) {
      if (j.kind !== "flex") continue;
      if (j.spec.form === "chain") chain(ctx, j as FlexJoint & { spec: { form: "chain" } });
      else if (j.spec.form === "belt") belt(ctx, j as FlexJoint & { spec: { form: "belt" } });
      else if (j.spec.form === "rope") rope(ctx, j as FlexJoint & { spec: { form: "rope" } });
      else cvt(ctx, j as FlexJoint & { spec: { form: "cvt" } });
    }
  },
};
