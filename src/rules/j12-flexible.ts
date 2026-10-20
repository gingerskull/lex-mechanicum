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
// - CVT: per shaft a fixed half and a sliding half (posed by a frame that slides along the shaft): each sliding half
//   slides on a feather key sized from the shaft so it cannot turn on it (F3); where the spec asks, a spring round the
//   shaft from a seat collar fixed on it presses the half on the belt (F6), its length following the half.
import { beltLength, beltPath, beltTooth, chainPath, htd, sprocketOutline, sprocketR } from "../core/flex";
import { TAU, arcPts, circle, dBore, roundedPoly, type Vec2 } from "../core/geom";
import { inside, toLocal } from "../core/poly";
import { framePoint } from "../core/axis";
import { bearing, circlip, collar, disc, dowel, hullOf, key, nut, plainWasher, plate, screw, shaft, spacer, spring, standoff } from "../hardware/primitives";
import { onAxis, solid, type Solid } from "../hardware/solid";
import { BEARINGS, circlipExt, keyFor } from "../hardware/tables";
import { poseOf } from "../model/pose";
import { alongPath } from "../assemble/pose";
import { FLANGE_T, flanges } from "./j8-belt";
import type { Solved } from "../model/types";
import type { FlexJoint, Joint, PinJoint, Rule, RuleContext } from "./types";

const fmt = (v: number) => String(+v.toFixed(1));
/** Link plate thickness and the gap the idler leaves over the chain, mm. */
const PLATE = 1.2;
/** The chain idler sprocket's teeth: odd, so its wear spreads over the even chain. */
const IDLER_TEETH = 9;

export { sprocketR };

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
  o: {
    r: [number, number];
    ri: number;
    back: number;
    z: [number, number];
    top: number;
    ex: number;
    outer: Vec2[];
    name: string;
    mat: string;
    flanged?: boolean;
    /** Its turn per turn of the first wheel (default -r1 / ri), and its angle at the assembly phase given its centre. */
    ratio?: number;
    phase?: (ci: Vec2) => number;
  },
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
  const ratio = o.ratio ?? -r1 / o.ri;
  const turn = { body: a!.id, motion: { type: "geared" as const, around: ci, ratio }, ...(o.phase ? { at: [0, 0, o.phase(ci) - qa[2] * ratio] as [number, number, number] } : {}) };
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
  const c1: Vec2 = [qa[0], qa[1]];
  const c2: Vec2 = [qb[0], qb[1]];
  // the chain is a whole number of links; it is conveyed on a path exactly that long, so no roller creeps a lap
  const L = beltLength(r1, r2, Math.hypot(c2[0] - c1[0], c2[1] - c1[1]));
  const N = Math.round(L / f.pitch);
  const { path, off } = chainPath(c1, r1, c2, r2, N, f.pitch);
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
  // the idler: a sprocket of a whole number of teeth outside the chain, its pitch circle on the rollers' line, a seat
  // on the roller nearest it at the assembly phase, turning one tooth per pitch of travel (the first wheel's z / its z)
  const zi = IDLER_TEETH;
  const ri = sprocketR(zi, f.pitch);
  const t0 = ctx.s0[f.travel];
  const rollers = Array.from({ length: N }, (_, i) => alongPath(path, (typeof t0 === "number" ? t0 : 0) + i * f.pitch));
  const phase = (ci: Vec2): number => {
    const X = rollers.reduce((p, q) => (Math.hypot(q[0] - ci[0], q[1] - ci[1]) < Math.hypot(p[0] - ci[0], p[1] - ci[1]) ? q : p));
    return Math.atan2(X[1] - ci[1], X[0] - ci[0]);
  };
  const idl = idler(ctx, j, { r: [r1, r2], ri, back: 0, z: [z0, z1], top: z1 + 2 * PLATE, ex: s.ex, outer: sprocketOutline(zi, f.pitch, f.roller), name: `Idler sprocket, ${zi} teeth, ISO 606, on a sealed bearing`, mat: "Steel C45", ratio: -a!.z / zi, phase });
  if (idl) allow.push(idl.id);
  J.note = `Roller chain, ${fmt(f.pitch)} pitch, ${N} links over the ${a!.z}-tooth ${a!.id} and the ${b!.z}-tooth ${b!.id}${Math.abs(L - N * f.pitch) > 0.5 ? ` (${fmt(L)} mm on the pitch circles: ${fmt(L - N * f.pitch)} mm off a whole number of links, taken up by the idler)` : ""}: rollers and link plates carried round on a path exactly ${N} pitches long${Math.abs(off) > 0.05 ? `, ${fmt(off)} mm off the pitch circles` : ""}; a ${zi}-tooth idler sprocket on the slack span, its pitch circle on the rollers' line and its seats on them, on an arm slotted across the span and clamped on two posts (F7), greased (F8).`;
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

/** A CVT spring's wire per mm of shaft Ø, its shortest length over the cycle, and the seat collar's width, mm. */
const CVT_SPRING = { wirePerD: 0.14, minLen: 8, seat: 6 };

/**
 * A live z shaft runs on up to `z` where a sliding half's travel or its spring seat stands past its top: a segment of
 * the shaft added on, the flush end screw over the fixed half giving way to a circlip on the shaft's new end.
 */
function runOn(ctx: RuleContext, j: PinJoint, ax: "x" | "y" | "z", z: number, keyway?: [number, number]): void {
  if (ax !== "z") return;
  const segs = ctx.solids.filter((t) => t.group === `${j.id}-shaft` && t.kind === "shaft");
  if (!segs.length) return;
  const top = segs.reduce((p, q) => (q.z1 > p.z1 ? q : p));
  if (top.z1 >= z) return;
  const J = ctx.joint(j.id)!;
  const end = ctx.get(`${j.id}-end`);
  if (end) {
    ctx.drop(new RegExp(`^${j.id}-end(-|$)`));
    J.serves.F2 = (J.serves.F2 ?? []).filter((id) => id !== `${j.id}-end`);
  }
  top.marks = top.marks.filter((mk) => mk.kind !== "chamfer" && mk.kind !== "boreEntry");
  ctx.add(shaft(`${j.id}-shaft-cvt`, { d: j.d, z0: top.z1, z1: z, ...(keyway ? { keyway } : {}) }, { body: j.body, at: top.at, ex: top.ex, joints: [j.id], group: `${j.id}-shaft`, name: "" }));
  const c = circlipExt(j.d);
  ctx.add(circlip(`${j.id}-cl-cvt`, j.d, { body: j.body, at: j.at, z0: z - 1 - c.s, z1: z - 1, ex: top.ex, joints: [j.id], group: `${j.id}-shaft` }));
  (J.serves.F2 ??= []).push(`${j.id}-cl-cvt`);
  J.note += " The shaft runs on past the sliding sheave half's travel, a circlip on its end.";
}

/** A world point's coordinate along a base axis. */
const alongOf = (axis: "x" | "y" | "z", X: [number, number, number]): number => X[axis === "x" ? 0 : axis === "y" ? 1 : 2];

/**
 * CVT (J12): per shaft, a fixed sheave half on the live shaft and a sliding half posed by a frame that slides along it.
 * Each sliding half carries a feather key, sized from the shaft (DIN 6885), in a keyway running the length of its travel
 * along the shaft, so it slides but cannot turn (F3). Where the spec asks, a compression spring round the shaft presses
 * it on the belt (F6): from its back face to a seat collar fixed on the shaft past the end of its travel, its length
 * following the half each frame (`reach`). The other half is the controlled freedom: the mechanism's polish sets it.
 */
function cvt(ctx: RuleContext, j: FlexJoint & { spec: { form: "cvt" } }): void {
  const J = ctx.joint(j.id)!;
  const sprung: string[] = [];
  for (const pr of j.spec.pairs) {
    const fixed = ctx.parts[pr.fixed];
    const sl = ctx.parts[pr.sliding];
    const host = ctx.solidOf[pr.sliding];
    const fHost = ctx.solidOf[pr.fixed];
    const shaftJ = ctx.info.find((x): x is PinJoint => x.kind === "pin" && x.live && x.driven.some((d) => d.part.id === pr.fixed));
    if (!fixed || !sl || !host || !fHost || !shaftJ || sl.axis !== "p" || !sl.frame || fixed.axis === "p") {
      J.note += ` ${pr.sliding}: no sliding half on a frame beside a fixed half on a live shaft, so no key or spring.`;
      continue;
    }
    const d = shaftJ.d;
    // the shaft's segments, and the one the straddle runs on up later
    const shaftIds = [...ctx.solids.filter((t) => t.group === `${shaftJ.id}-shaft`).map((t) => t.id), `${shaftJ.id}-shaft-up`, `${shaftJ.id}-shaft-cvt`];
    // the half rides the shaft by design (its bore on the shaft, the key in the shaft's keyway)
    (host.allow ??= []).push(...shaftIds);
    const G = { body: pr.sliding, axis: "p" as const, frame: sl.frame, joints: [j.id], ex: host.ex, allow: shaftIds };
    // the half's ends along the shaft's axis, world mm, at a phase
    const ax = fixed.axis ?? "z";
    const endAt = (s: Solved, w: number): [number, number, number] | null => {
      const f = s.frames?.[sl.frame!];
      const q = poseOf(sl, s);
      return f && q ? framePoint(f, [q[0], q[1]], w) : null;
    };
    const phases = Array.from({ length: 72 }, (_, i) => ctx.model.solve((i / 72) * TAU));
    let lo = Infinity;
    let hi = -Infinity;
    for (const s of phases)
      for (const w of [host.z0, host.z1]) {
        const X = endAt(s, w);
        if (X) [lo, hi] = [Math.min(lo, alongOf(ax, X)), Math.max(hi, alongOf(ax, X))];
      }
    // the shaft's spacers give way to the half's travel: each keeps its part clear of it, or goes
    for (const t of ctx.solids.filter((x) => x.kind === "spacer" && x.joints.includes(shaftJ.id) && (x.axis ?? "z") === ax && x.z1 > lo - 0.5 && x.z0 < hi + 0.5)) {
      if (t.z0 < lo) t.z1 = lo - 0.5;
      else t.z0 = hi + 0.5;
      if (t.z1 - t.z0 < 1) ctx.drop(new RegExp(`^${t.id}$`));
      else J.note += ` The ${t.name ? t.name.charAt(0).toLowerCase() + t.name.slice(1) : "spacer"} is cut short of the sliding half's travel.`;
    }
    // the feather key in the hub (A5, F3): its section in the bore at the shaft's surface, the hub's length; to Ø8 the
    // half's D-bore slides on the shaft's flat
    const k = keyFor(d);
    // the bore cut to the shaft (the model's bore round the centre only places it), a sliding fit
    const bore = k ? disc(d / 2 + 0.03) : dBore(d / 2 + 0.05);
    const hb = host.holes.findIndex((h) => inside(h, [0, 0]));
    if (hb >= 0) host.holes[hb] = bore;
    else host.holes.push(bore);
    if (!k) (J.serves.F3 ??= []).push(host.id);
    const kk = !k ? null : key(`${j.id}-${pr.sliding}-key`, k.b, host.z1 - host.z0, {
      ...G,
      at: [0, 0, 0],
      outer: [[d / 2 - k.t1, -k.b / 2], [d / 2 - k.t1 + k.h, -k.b / 2], [d / 2 - k.t1 + k.h, k.b / 2], [d / 2 - k.t1, k.b / 2]],
      z0: host.z0,
      z1: host.z1,
      name: `Feather key ${k.b} x ${k.h} x ${+(host.z1 - host.z0).toFixed(1)} (DIN 6885) in the hub, sliding in a keyway along the shaft`,
    });
    if (kk) {
      ctx.add(kk);
      (J.serves.F3 ??= []).push(kk.id);
    }
    if (!pr.spring) {
      runOn(ctx, shaftJ, ax, hi + 1, k ? [lo, hi] : undefined);
      continue;
    }
    // the back face: the end of the half farther from the fixed half, along the shaft's axis
    const mid = (fHost.z0 + fHost.z1) / 2;
    const P0 = endAt(ctx.s0, host.z0);
    const P1 = endAt(ctx.s0, host.z1);
    if (!P0 || !P1) continue;
    const end: 0 | 1 = Math.abs(alongOf(ax, P1) - mid) > Math.abs(alongOf(ax, P0) - mid) ? 1 : 0;
    const dir = Math.sign(alongOf(ax, end ? P1 : P0) - alongOf(ax, end ? P0 : P1)) || 1;
    // the seat stands the spring's shortest length past the back face's farthest reach over the cycle
    let reach = -Infinity;
    for (const s of phases) {
      const X = endAt(s, end ? host.z1 : host.z0);
      if (X) reach = Math.max(reach, dir * alongOf(ax, X));
    }
    const seat = dir * reach + dir * CVT_SPRING.minLen;
    const wire = Math.max(1, Math.round(d * CVT_SPRING.wirePerD * 10) / 10);
    const D = d + 2 + 2 * wire;
    const L = shaftJ.driven.find((x) => x.part.id === pr.fixed)!.L;
    const sid = `${j.id}-${pr.sliding}-seat`;
    const [s0, s1] = dir > 0 ? [seat, seat + CVT_SPRING.seat] : [seat - CVT_SPRING.seat, seat];
    ctx.add(collar(sid, d, D + 6, { body: pr.fixed, ...onAxis(fixed), at: [L[0], L[1], 0], z0: s0, z1: s1, ex: fHost.ex, joints: [j.id, shaftJ.id], name: `Spring seat collar Ø${d} x Ø${D + 6} x ${CVT_SPRING.seat}, set screw, fixed on the shaft` }));
    // the seat's face toward the half, on the shaft's axis, in world mm
    const B0 = end ? P1 : P0;
    const to: [number, number, number] = [B0[0], B0[1], B0[2]];
    to[ax === "x" ? 0 : ax === "y" ? 1 : 2] = seat;
    const len0 = Math.abs(seat - alongOf(ax, B0));
    const spr = spring(`${j.id}-${pr.sliding}-spring`, "compression", {
      ...G,
      at: [0, 0, 0],
      D,
      wire,
      z0: end ? host.z1 : host.z0 - len0,
      z1: end ? host.z1 + len0 : host.z0,
      reach: { to, end: end ? 1 : 0 },
      name: `Compression spring Ø${+D.toFixed(1)}, wire ${wire}, round the shaft: presses the sheave half on the belt`,
      allow: [...shaftIds, sid],
    });
    ctx.add(spr);
    (J.serves.F6 ??= []).push(spr.id);
    (J.serves.F2 ??= []).push(sid);
    runOn(ctx, shaftJ, ax, Math.max(hi + 1, s1 + 1), k ? [lo, hi] : undefined);
    sprung.push(pr.sliding);
  }
  // the belt runs in the grooves of both halves on each shaft by design
  const belt = ctx.solidOf[j.spec.belt];
  if (belt) (belt.allow ??= []).push(...j.spec.pairs.flatMap((p) => [p.fixed, p.sliding]));
  const free = j.spec.pairs.filter((p) => !p.spring).map((p) => p.sliding);
  J.note = `CVT belt between ${j.spec.pairs.length} sheave pairs: each sliding half keyed to its shaft, sliding on a feather key along it (F3)${sprung.length ? `; ${sprung.join(" and ")} pressed on the belt by a spring round the shaft from a seat collar fixed on it (F6)` : ""}${free.length ? `; ${free.join(" and ")} set by the mechanism's control` : ""}.${J.note}`;
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
