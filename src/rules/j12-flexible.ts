// J12: a flexible member the model declares (MechanismModel.flexible), extending J8 to chains, ropes and CVT belts.
// - Chain: its rollers and link plates are carried round the two sprockets by the solved travel (a conveyed placement:
//   each a small rigid solid on the fixed path, nothing deforms); an idler sprocket on a slotted arm on the slack span
//   takes up the stretch (F7); the chain is greased (F8).
// - Rope: its spans are stretched parts of the model; a becket dead-ends it with a thimble (F1, F2), the hook hangs on
//   a swivel so the load can turn (F3), and a guard over each fixed sheave keeps the rope in its groove (F2).
// - CVT: each sliding sheave half is keyed to its shaft so it slides but cannot turn on it (F3), and a spring presses
//   it on the belt (F6).
import { beltPath, pathLength } from "../core/flex";
import { arcPts, circle, roundedPoly, type Vec2 } from "../core/geom";
import { toLocal } from "../core/poly";
import { disc, dowel, key, plate, screw, spring } from "../hardware/primitives";
import { solid } from "../hardware/solid";
import { poseOf } from "../model/pose";
import type { FlexJoint, Rule, RuleContext } from "./types";

const fmt = (v: number) => String(+v.toFixed(1));
/** Link plate thickness and the gap the idler leaves over the chain, mm. */
const PLATE = 1.2;

/** Pitch radius of a sprocket of z teeth at chain pitch p. */
export const sprocketR = (z: number, p: number): number => p / (2 * Math.sin(Math.PI / z));

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
  // the idler on the slack span, outside the chain, on an arm slotted for the take-up (F7)
  const ia = path[Math.floor(path.length - 1)]!;
  const ib = path[0]!;
  const mid: Vec2 = [(ia[0] + ib[0]) / 2, (ia[1] + ib[1]) / 2];
  const t: Vec2 = [ib[0] - ia[0], ib[1] - ia[1]];
  const tl = Math.hypot(t[0], t[1]) || 1;
  // outward normal of a counter-clockwise path
  const n: Vec2 = [t[1] / tl, -t[0] / tl];
  const ri = Math.max(14, r1 * 0.6);
  const ci: Vec2 = [mid[0] + n[0] * (ri + f.roller / 2 - 1.5), mid[1] + n[1] * (ri + f.roller / 2 - 1.5)];
  // it turns with the chain (geared to the driving sprocket); the rollers run on its teeth by design
  allow.push(`${j.id}-idler`);
  ctx.add(solid(`${j.id}-idler`, { ...G, body: a!.id, motion: { type: "geared", around: ci, ratio: -r1 / ri }, kind: "pulley", role: "hw", name: `Idler sprocket Ø${fmt(2 * ri)} on a sealed bearing`, outer: circle(ri, 0, 0, 48), holes: [circle(4, 0, 0, 24)], z0, z1, mat: "Steel C45" }));
  const pv: Vec2 = [ci[0] + (t[0] / tl) * 40, ci[1] + (t[1] / tl) * 40];
  const armZ: [number, number] = [z0 - 2 * PLATE - 4, z0 - 2 * PLATE - 1];
  const arm = plate(`${j.id}-arm`, roundedPoly([ci, pv], 7), { ...G, kind: "bracket", name: "Tensioner arm, slotted at its pivot for the take-up", holes: [roundedPoly([[pv[0] - 3 * (t[0] / tl), pv[1] - 3 * (t[1] / tl)], [pv[0] + 3 * (t[0] / tl), pv[1] + 3 * (t[1] / tl)]], 2.6)], z0: armZ[0], z1: armZ[1], mat: "Steel S235, zinc plated" });
  ctx.add(arm);
  ctx.add(screw(`${j.id}-arm-sc`, "socket", 5, 12, { ...G, at: [pv[0], pv[1], 0], face: armZ[1], dir: -1, ex: s.ex + 1, name: "Socket head M5, clamps the tensioner arm in its slot" }));
  (J.serves.F7 ??= []).push(arm.id, `${j.id}-idler`);
  J.note = `Roller chain, ${fmt(f.pitch)} pitch, ${N} links (${fmt(L)} mm of path${Math.abs(L - N * f.pitch) > 0.5 ? `: ${fmt(L - N * f.pitch)} mm off a whole number of links, taken up by the idler` : ""}) over the ${a!.id} and the ${b!.id}: rollers and link plates carried round, an idler sprocket on a slotted arm on the slack span (F7), greased (F8).`;
  J.badge = ["chain tensioned", "ok"];
}

function rope(ctx: RuleContext, j: FlexJoint & { spec: { form: "rope" } }): void {
  const J = ctx.joint(j.id)!;
  const f = j.spec;
  const dead = f.dead ? ctx.s0.pts[f.dead] : undefined;
  const hook = f.hook ? ctx.s0.pts[f.hook] : undefined;
  const ex = Math.max(0, ...f.over.map((id) => ctx.solidOf[id]?.ex ?? 0));
  const ref = ctx.solidOf[f.over[0]!]!;
  const [z0, z1] = [ref.z0, ref.z1];
  if (dead) {
    // the becket: a plate on the upper block holding a thimble the rope's dead end is spliced round (F1, F2)
    ctx.add(plate(`${j.id}-becket`, roundedPoly([[dead[0], dead[1] + 6], [dead[0], dead[1] + 16]], 6), { body: "ground", joints: [j.id], ex, kind: "bracket", name: "Becket with a thimble, the rope's dead end spliced round it", z0: z0 - 2, z1: z1 + 2, holes: [circle(3, dead[0], dead[1] + 11, 20)], mat: "Steel, galvanised" }));
    ctx.add(dowel(`${j.id}-becket-pin`, 6, { body: "ground", at: [dead[0], dead[1] + 11, 0], z0: z0 - 4, z1: z1 + 4, ex, joints: [j.id], name: "Becket pin Ø6, split-pinned" }));
    (J.serves.F1 ??= []).push(`${j.id}-becket`);
    (J.serves.F2 ??= []).push(`${j.id}-becket-pin`);
  }
  // the hook on a swivel on the moving block: the load turns without twisting the rope (F3)
  const moving = (f.load ? [ctx.parts[f.load]] : f.over.map((id) => ctx.parts[id])).find((p) => p && !p.fixed);
  if (hook && moving) {
    const q = poseOf(moving, ctx.s0)!;
    const l = toLocal(q, hook);
    const body = moving.id;
    ctx.add(solid(`${j.id}-swivel`, { body, at: [l[0], l[1], 0], kind: "collar", role: "hw", name: "Hook swivel on a thrust bearing", outer: disc(7), holes: [disc(3)], z0: z0 - 1, z1: z1 + 1, ex: ctx.solidOf[body]!.ex, joints: [j.id], mat: "Steel, forged" }));
    ctx.add(solid(`${j.id}-hook`, { body, at: [l[0], l[1] - 10, 0], kind: "part", role: "output", name: "Load hook with a safety latch", outer: [...arcPts(0, -6, 8, 0, Math.PI, Math.PI / 10), ...arcPts(0, -6, 4, Math.PI, 0, Math.PI / 8)], z0, z1, ex: ctx.solidOf[body]!.ex, joints: [j.id], mat: "Steel, forged" }));
    (J.serves.F3 ??= []).push(`${j.id}-swivel`);
  }
  // a guard over each fixed sheave's rim keeps the rope in the groove when it goes slack (F2)
  for (const id of f.over) {
    const p = ctx.parts[id];
    if (!p?.fixed) continue;
    const R = Math.max(...p.shape.outer.map(([x, y]) => Math.hypot(x, y)));
    const [x, y] = p.fixed;
    const band = [...arcPts(x, y, R + 4, Math.PI * 0.15, Math.PI * 0.85, Math.PI / 24), ...arcPts(x, y, R + 2, Math.PI * 0.85, Math.PI * 0.15, Math.PI / 24)];
    ctx.add(solid(`${j.id}-${id}-guard`, { body: "ground", kind: "stop", role: "hw", name: "Rope guard over the sheave", outer: band, z0: z0 - 1, z1: z1 + 1, ex: ctx.solidOf[id]!.ex, joints: [j.id], mat: "Steel S235" }));
    (J.serves.F2 ??= []).push(`${j.id}-${id}-guard`);
  }
  // the rope lies in the sheaves' grooves and through the becket and swivel by design
  const touch = ctx.solids.filter((t) => t.joints.includes(j.id) || f.over.includes(t.body)).map((t) => t.id);
  for (const id of f.spans) {
    const sp = ctx.solidOf[id];
    if (sp) sp.allow = [...(sp.allow ?? []), ...f.over, ...touch];
  }
  J.note = `Rope reeved over ${f.over.length} sheaves in ${f.spans.length} parts: its spans stretch between the sheaves; dead-ended on a becket with a thimble, the hook on a swivel, a guard over each fixed sheave.`;
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
  ids: ["J12", "F2", "F3", "F6", "F7", "F8"],
  applies: (ctx) => ctx.info.some((j) => j.type === "J12"),
  apply(ctx) {
    for (const j of ctx.info) {
      if (j.kind !== "flex") continue;
      if (j.spec.form === "chain") chain(ctx, j as FlexJoint & { spec: { form: "chain" } });
      else if (j.spec.form === "rope") rope(ctx, j as FlexJoint & { spec: { form: "rope" } });
      else cvt(ctx, j as FlexJoint & { spec: { form: "cvt" } });
    }
  },
};
