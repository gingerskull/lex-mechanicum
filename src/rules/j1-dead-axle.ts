// J1: a ground revolute on a dead axle. Shouldered axle (A4), a bearing in every turning part with circlips (F2),
// inner-race spacers, a bronze thrust washer on the base (F4), a bridge over the top on spigoted posts (F1, A11),
// the axle threaded into the base or through it to a washer and nyloc (M9), an oil sink over the open bearing (F8).
import { bridge } from "../hardware/sub/bridge";
import { disc, nut, oilSink, plainWasher, spacer, tube } from "../hardware/primitives";
import { NUTS, SHOULDER_BOLTS, WASHERS, engagement, threadFor } from "../hardware/tables";
import { boltName, elements, partName, raceD, shoulderBolt, stackSpacers, tappedMark, type Element } from "./pins";
import type { PinJoint, Rule, RuleContext } from "./types";

const fmt = (v: number) => String(+v.toFixed(1));

export function buildFixedPin(ctx: RuleContext, j: PinJoint): void {
  const J = ctx.joint(j.id)!;
  const group = `${j.id}-axle`;
  const at = j.at;
  const { els, names } = elements(ctx, j, "ground", at, group, "open");
  const baseEl: Element = { z0: ctx.b0, z1: ctx.b1, ex: -1, over: ctx.b1, label: "" };
  stackSpacers(ctx, j, [baseEl, ...els], "ground", at, true);
  const top = els[els.length - 1]!;
  const topJoined = j.joined[j.joined.length - 1]!;
  const base = ctx.get("base")!;
  const M = SHOULDER_BOLTS[j.d]?.M ?? threadFor(j.d);
  const exTop = Math.max(...els.map((e) => e.ex));
  // M9: 1.5 d of thread in the aluminium base, else through it to a washer and nyloc underneath
  const threaded = engagement(M, "aluminium") <= ctx.b1 - ctx.b0;
  let thread: [number, number];
  if (threaded) {
    thread = [ctx.b1 - engagement(M, "aluminium"), ctx.b1];
    base.marks.push(tappedMark(M, ...j.P));
  } else {
    const w = WASHERS[M] ?? WASHERS[5]!;
    const n = NUTS[M] ?? NUTS[5]!;
    thread = [ctx.b0 - w.h - n.m - 1, ctx.b1];
    base.holes.push(disc(M / 2 + 0.3, ...j.P));
    ctx.add(plainWasher(`${j.id}-uw`, M, { at, z0: ctx.b0 - w.h, z1: ctx.b0, ex: -2, joints: [j.id], group: `${j.id}-nut` }));
    ctx.add(nut(`${j.id}-nut`, M, { at, z0: ctx.b0 - w.h - n.m, z1: ctx.b0 - w.h, ex: -2, joints: [j.id], group: `${j.id}-nut` }));
  }
  let zTop: number;
  let held = "";
  if (!topJoined.moving) {
    // a fixed plate on the same axle clamps its other end
    zTop = topJoined.z1;
    held = ` and clamped at the top by the ${partName(ctx, topJoined)}`;
    J.badge = ["both ends held", "ok"];
  } else {
    const zMin = Math.max(...els.map((e) => e.over)) + 0.5;
    const br = bridge(ctx, { id: `${j.id}-bridge`, over: [j.P], zMin, joint: j.id });
    if (br) {
      br.bridge.holes.push(disc(j.d / 2 + 0.01, ...j.P));
      br.bridge.marks.push(...oilSink(j.d / 2, ...j.P));
      (J.serves.F8 ??= []).push(br.bridge.id);
      (J.serves.F1 ??= []).push(`${br.bridge.id}-post0-spigot`, `${br.bridge.id}-post1-spigot`);
      const gap = br.z0 - top.z1;
      if (gap > 0.3) {
        const o = { at, z0: top.z1, z1: br.z0, ex: top.ex, span: [top.ex, br.bridge.ex] as [number, number], joints: [j.id] };
        const D = raceD(ctx, j, gap > 3.2 ? j.d + 4 : j.d + 3.2);
        ctx.add(gap > 3.2 ? tube(`${j.id}-sp-top`, j.d + 0.2, D, { ...o, name: `Inner-race spacer sleeve ${fmt(j.d + 0.2)}x${fmt(D)}` }) : spacer(`${j.id}-sp-top`, j.d + 0.2, D, o));
      }
      zTop = br.z1;
      held = " and held at the top by the bridge";
      J.badge = ["both ends held", "ok"];
    } else {
      zTop = Math.max(...els.map((e) => e.over)) + 0.6;
      ctx.add(spacer(`${j.id}-top`, j.d + 0.2, raceD(ctx, j, j.d + 3.2), { name: "Washer under the head, on the inner race", at, z0: top.z1, z1: zTop, ex: top.ex, joints: [j.id] }));
      J.badge = ["single shear", "warn"];
      // no bridge: shield the bearings instead of oiling them from a sink
      for (const t of ctx.solids) if (t.joints.includes(j.id) && t.kind === "bearing" && t.closure === "open") t.closure = "shield";
    }
  }
  const name = `${boltName(j.d, zTop - ctx.b1).replace("Shoulder bolt", "Axle, shoulder bolt")}${threaded ? ", threaded into the base" : `, through the base, M${M} nyloc underneath`}`;
  shoulderBolt(ctx, j, { id: group, body: "ground", at, z0: ctx.b1, z1: zTop, thread, name, ex: exTop + 2 });
  base.joints.push(j.id);
  J.note = `Dead axle Ø${j.d}${threaded ? ` threaded M${M} into the base` : `, through the base to a washer and M${M} nyloc`}${held}${names.length ? "; " + names.join(", ") : ""}.`;
}

export const j1: Rule = {
  id: "j1-dead-axle",
  tier: "AUTO",
  ids: ["J1", "A4", "A11", "M8", "M9", "M11"],
  applies: (ctx) => ctx.info.some((j) => j.type === "J1"),
  apply(ctx) {
    for (const j of ctx.info) if (j.kind === "pin" && j.type === "J1") buildFixedPin(ctx, j);
  },
};
