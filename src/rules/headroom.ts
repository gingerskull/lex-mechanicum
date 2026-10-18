// Shoulder bolt headroom (A13), after the fasteners: a shoulder bolt's shoulder is the next catalogue length, so its
// head can ride up to 5 mm high on a shim. Every such head is tested against everything over the cycle: where it would
// meet a solid, the shoulder is ground to the stack's length and the shim goes; where it clears, a lift of more than
// LIFT_NOTE mm is reported in the joint note with the room left over the head.
import { TAU, xf } from "../core/geom";
import { overlap, region, type Region } from "../core/poly";
import type { Solid } from "../hardware/solid";
import { indexParts, isGround, solidPose } from "../assemble/pose";
import { CLASH_TOL } from "../assemble/clearance";
import type { RuleContext } from "./types";

const STEPS = 72;
/** A lift above this is worth a line in the joint note, mm. */
const LIFT_NOTE = 2;

const fmt = (v: number) => String(+v.toFixed(1));

/** For a head: the deepest clash over the cycle, and the smallest gap to anything that passes over it. */
function probe(ctx: RuleContext, head: Solid, z0: number, z1: number): { clash: number; gap: number; over: string } {
  const parts = indexParts(ctx.model);
  const key = (t: Solid) => (t.motion ? `m:${JSON.stringify(t.motion)}:${t.body}` : isGround(parts, t.body) ? "ground" : t.body);
  const hk = key(head);
  const others = ctx.solids.filter((t) => t !== head && !t.faint && t.role !== "trace" && key(t) !== hk && (!head.group || t.group !== head.group) && t.z1 > z0 + 0.05);
  let clash = 0;
  let gap = Infinity;
  let over = "";
  for (let i = 0; i < STEPS; i++) {
    const u = (i / STEPS) * TAU;
    const s = ctx.model.solve(u);
    const reg = (t: Solid): Region | null => {
      const q = solidPose(ctx.model, parts, t, s, u);
      return q ? region(xf(t.outer, q), t.holes.map((h) => xf(h, q))) : null;
    };
    const hr = reg(head);
    if (!hr) continue;
    for (const t of others) {
      const above = t.z0 >= z1 - 0.05;
      if (!above && Math.min(t.z1, z1) - Math.max(t.z0, z0) <= 0.05) continue;
      if (above && t.z0 - z1 >= gap) continue;
      const r = reg(t);
      if (!r) continue;
      const d = overlap(hr, r);
      if (above) {
        if (d > 0) {
          gap = t.z0 - z1;
          over = t.name || t.id;
        }
      } else if (d > CLASH_TOL) clash = Math.max(clash, d);
    }
  }
  return { clash, gap, over };
}

export function headroom(ctx: RuleContext): void {
  for (const shim of ctx.solids.filter((t) => t.id.endsWith("-shim") && t.kind === "washer")) {
    const group = shim.id.slice(0, -"-shim".length);
    const head = ctx.get(`${group}-head`);
    const segs = ctx.solids.filter((t) => t.group === group && t.kind === "shaft");
    if (!head || !segs.length) continue;
    const lift = shim.z1 - shim.z0;
    const jid = head.joints[0];
    const J = jid ? ctx.joint(jid) : undefined;
    const p = probe(ctx, head, head.z0, head.z1);
    if (p.clash > 0) {
      // the shoulder ground to the stack: the head comes down onto the stack, the shim goes
      ctx.drop(shim.id);
      const top = segs.reduce((a, b) => (b.z1 > a.z1 ? b : a));
      top.z1 -= lift;
      head.z0 -= lift;
      head.z1 -= lift;
      const named = segs.find((t) => t.name) ?? top;
      named.name = named.name.replace(/ x (\d+(?:\.\d+)?)/, (_, L: string) => ` x ${fmt(Number(L) - lift)} (shoulder ground from ${L})`);
      const q = probe(ctx, head, head.z0, head.z1);
      if (J) J.note += q.clash > 0 ? ` The bolt head meets a moving part even on a shoulder ground to length (${fmt(q.clash)} mm).` : ` The shoulder is ground ${fmt(lift)} mm short of its catalogue length so the head clears the part above.`;
      (ctx.fired.headroom ??= []).push(group);
    } else if (lift > LIFT_NOTE && J)
      J.note += ` The catalogue shoulder lifts the head ${fmt(lift)} mm on a shim; ${p.gap === Infinity ? "nothing passes over it" : `${fmt(p.gap)} mm clear under the ${p.over.charAt(0).toLowerCase()}${p.over.slice(1)}`}.`;
  }
}
