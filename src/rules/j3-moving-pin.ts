// J3: a moving revolute. Shoulder bolt threaded into the lowest part, a bearing in every other part, inner-race
// spacers, threadlocker (M13, by the locking rule), bore chamfers (M3). Clevis choices belong to the polish (A9).
import { boreChamfers, disc, spacer } from "../hardware/primitives";
import { SHOULDER_BOLTS, threadFor } from "../hardware/tables";
import { boltName, elements, partName, raceD, shoulderBolt, stackSpacers, tappedMark } from "./pins";
import { inPlane, type PinJoint, type Rule, type RuleContext } from "./types";

/** Builds a pin whose bolt rides a moving part (J3, and J4 with a slot). */
export function buildMovingPin(ctx: RuleContext, j: PinJoint): void {
  const J = ctx.joint(j.id)!;
  const anchor = j.anchor;
  if (!anchor) {
    J.note = "No part to anchor the bolt in: every part on this pin turns on it; give one part a bore the bolt can thread into.";
    J.badge = ["unanchored", "warn"];
    return;
  }
  const group = `${j.id}-bolt`;
  const { els, names } = elements(ctx, j, j.body, j.at, group, "shield");
  stackSpacers(ctx, j, els, j.body, j.at, false);
  const host = ctx.solidOf[anchor.part.id]!;
  const M = SHOULDER_BOLTS[j.d]?.M ?? threadFor(j.d);
  // the thread runs through the anchor; its hole is tapped through
  host.holes.push(disc(M / 2, ...anchor.L));
  host.marks.push(tappedMark(M, ...anchor.L));
  // the other parts turning with the bolt (a clevis twin): a plain hole on the shoulder
  for (const x of j.driven) {
    if (x === anchor) continue;
    const t = ctx.solidOf[x.part.id]!;
    t.holes.push(disc(j.d / 2 + 0.1, ...x.L));
    boreChamfers(t);
  }
  const top = els[els.length - 1]!;
  const exTop = Math.max(...els.map((e) => e.ex));
  const zt = Math.max(...els.map((e) => e.over)) + 0.6;
  if (top.z0 > anchor.z0 + 1e-6)
    ctx.add(spacer(`${j.id}-top`, j.d + 0.2, raceD(ctx, j, j.d + 3.2), { name: "Washer under the head, on the inner race", body: j.body, at: j.at, z0: top.z1, z1: zt, ex: top.ex, span: [top.ex, exTop + 1], joints: [j.id] }));
  shoulderBolt(ctx, j, { id: group, body: j.body, at: j.at, z0: anchor.z1, z1: zt, thread: [anchor.z0, anchor.z1], name: `${boltName(j.d, zt - anchor.z1)}${j.type === "J4" ? ", roller stud" : ""}`, ex: exTop + 1 });
  (J.serves.F2 ??= []).push(`${group}-head`);
  J.note = `Shoulder bolt Ø${j.d}, M${M} threaded through the ${partName(ctx, anchor)}${names.length ? "; " + names.join(", ") : ""}; inner-race spacers so the bolt clamps only inner races.`;
  J.badge = j.joined.length <= 2 ? ["single shear", "warn"] : ["stacked", "warn"];
}

export const j3: Rule = {
  id: "j3-moving-pin",
  tier: "AUTO",
  ids: ["J3", "A12", "M3"],
  applies: (ctx) => ctx.info.some((j) => j.type === "J3"),
  apply(ctx) {
    for (const j of ctx.info) if (j.kind === "pin" && j.type === "J3") inPlane(ctx, j.pin, () => buildMovingPin(ctx, j));
  },
};
