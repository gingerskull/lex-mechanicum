// J1 variant: a ground pivot carried from above. A moving link that sweeps over another link's pivot cannot be stacked
// round a shaft that rises from the base, and no layer order clears it (A9, A10). The pivot is then a stub: a bridge on
// two spigoted posts, placed outside every sweep and high enough to clear all of them, holds the top of a short shouldered
// stud, and the stud runs down into the topmost part that turns on it only, so nothing below that part meets it. The
// pin's cap in the model is declared at that part's layer, with `top: "hung"`.
import { circlip, disc, nut, plainWasher, shaft } from "../hardware/primitives";
import { bridge } from "../hardware/sub/bridge";
import { NUTS, SHOULDER_BOLTS, WASHERS, circlipExt, threadFor } from "../hardware/tables";
import { elements, partName, stackSpacers, type Element } from "./pins";
import type { PinJoint, RuleContext } from "./types";

const fmt = (v: number) => String(+v.toFixed(1));

/** A fixed pin the model declares hung (`top: "hung"`) with a part turning on it. */
export function isHung(_ctx: RuleContext, j: PinJoint): boolean {
  return j.fixed && !j.live && j.pin.top === "hung" && j.joined.some((x) => x.moving);
}

/** Builds the hung pivot: bearings in the turning parts, circlip under the lowest, sleeves up to the bridge, stud and nut. */
export function buildHungPin(ctx: RuleContext, j: PinJoint): void {
  const J = ctx.joint(j.id)!;
  const at = j.at;
  const { els, names } = elements(ctx, j, "ground", at, `${j.id}-axle`, "shield");
  const M = SHOULDER_BOLTS[j.d]?.M ?? threadFor(j.d);
  const top = els[els.length - 1]!;
  const zMin = Math.max(...els.map((e) => e.over)) + 0.5;
  const br = bridge(ctx, { id: `${j.id}-bridge`, over: [j.P], zMin, joint: j.id });
  if (!br) {
    J.note = "No place for a bridge outside every sweep: the pivot cannot be carried from above.";
    J.badge = ["unheld", "warn"];
    return;
  }
  const b = br.bridge;
  b.holes.push(disc(M / 2 + 0.3, ...j.P));
  b.why = "carries the hung pivot's stud: nothing below the top turning part may meet the pivot (A9, A11)";
  (J.serves.F1 ??= []).push(`${b.id}-post0-spigot`, `${b.id}-post1-spigot`);
  // sleeves between the bearings and up to the bridge's underside, clamping inner races only (A12)
  stackSpacers(ctx, j, [...els, { z0: br.z0, z1: br.z1, ex: b.ex, over: br.z1, label: "" } as Element], "ground", at, false);

  // the stud: an external circlip under the lowest bearing keeps the stack on, the thread goes up through the bridge
  const low = els[0]!;
  const c = circlipExt(j.d);
  const clipZ = low.z0 - c.s;
  const w = WASHERS[M] ?? WASHERS[5]!;
  const n = NUTS[M] ?? NUTS[5]!;
  const zNut = br.z1 + w.h + n.m;
  const zTop = zNut + 1;
  const stud = shaft(`${j.id}-axle`, { d: j.d, z0: clipZ - 0.6, z1: zTop, grooves: [clipZ - 0.05], thread: { M, z0: br.z0, z1: zTop } }, {
    name: `Hung stud Ø${j.d}, M${M} thread, circlip groove`,
    body: "ground",
    at,
    ex: b.ex,
    joints: [j.id],
    mat: "Alloy steel 12.9, ground shoulder, black oxide",
  });
  ctx.add(stud);
  ctx.add(
    circlip(`${j.id}-clip`, j.d, { body: "ground", at, z0: clipZ, z1: low.z0, ex: low.ex, span: [low.ex, low.ex], joints: [j.id], name: `External circlip DIN 471, Ø${j.d}` }),
  );
  (J.serves.F2 ??= []).push(`${j.id}-clip`);
  ctx.add(plainWasher(`${j.id}-uw`, M, { body: "ground", at, z0: br.z1, z1: br.z1 + w.h, ex: b.ex + 1, joints: [j.id], group: `${j.id}-nut` }));
  ctx.add(nut(`${j.id}-nut`, M, { body: "ground", at, z0: br.z1 + w.h, z1: zNut, ex: b.ex + 1, joints: [j.id], group: `${j.id}-nut` }));
  J.note = `Hung stud Ø${j.d} carried from the bridge (M${M} through it to a washer and nyloc), down into the ${partName(ctx, j.joined[j.joined.length - 1]!)} only, so the links below sweep clear of it${names.length ? "; " + names.join(", ") : ""}; an external circlip under the lowest bearing, ${fmt(br.z0 - top.z1)} mm of sleeve to the bridge.`;
  J.badge = ["single shear", "warn"];
}
