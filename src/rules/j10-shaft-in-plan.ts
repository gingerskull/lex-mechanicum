// J10: a shaft in plan, a fixed pin on an x or y axis (src/core/axis.ts). It runs in two pillow blocks standing on the
// base past either end of what it carries (H.pillowBlock): a live shaft turns in a sealed bearing in each, located in
// the first block by two collars against its inner race and floating in the second, so it can grow (F2, F4); a dead
// shaft is clamped in both and every part turns on it in its own bearing (F2). Parts keyed to a live shaft take a
// D-flat to Ø8 and a feather key above (A5, F3). The blocks lift with the shaft in the explode.
import { dBore } from "../core/geom";
import { collar, disc, key, setScrew, shaft } from "../hardware/primitives";
import { pillowBlock, pillowWidth } from "../hardware/sub/pillow";
import { keyFor } from "../hardware/tables";
import { heights } from "../parts";
import { partName, seatBearing } from "./pins";
import { inPlane, type PinJoint, type Rule, type RuleContext } from "./types";

const fmt = (v: number) => String(+v.toFixed(1));
/** Clearance between what the shaft carries and a block, and the collar's width, mm. */
const GAP = 3;
const COLLAR = 6;

export function buildShaftInPlan(ctx: RuleContext, j: PinJoint): void {
  const axis = j.pin.axis as "x" | "y";
  const J = ctx.joint(j.id)!;
  const d = j.d;
  const live = j.live;
  const ex = Math.max(0, ...j.joined.map((x) => ctx.solidOf[x.part.id]!.ex));
  const a0 = Math.min(...j.joined.map((x) => x.z0));
  const a1 = Math.max(...j.joined.map((x) => x.z1));
  const L = pillowWidth(d, live);
  // a located block before the parts (with a collar each side of its bearing on a live shaft), a floating one after;
  // where something sweeps past the parts' far end (a bevel pinion overhanging its wheel), both blocks stand behind
  // the parts, far apart (A9: the shortest overhang, two bearings far apart)
  const wA = a0 - GAP - (live ? COLLAR : 0) - L;
  const after = a1 + GAP;
  const overhung = blocked(ctx, axis, j.P, after, after + L, d);
  const wB = overhung ? wA - Math.max(20, 2 * d) - L : after;
  const A = pillowBlock(ctx, `${j.id}-blkA`, { axis, P: j.P, w0: wA, d, live, located: true, ex, first: true });
  const B = pillowBlock(ctx, `${j.id}-blkB`, { axis, P: j.P, w0: wB, d, live, located: false, ex, first: false });
  // a hand-turned input takes a handwheel on the shaft's free end (the drive rule fits it there)
  const input = ctx.model.input.kind === "manual" && j.driven.some((x) => x.part.id === ctx.model.input.part);
  if (input) j.below = overhung ? { z0: B.w[0] - 14, z1: B.w[0] - 2 } : { z0: B.w[1] + 2, z1: B.w[1] + 14 };
  for (const b of [A, B]) {
    for (const t of ctx.solids.filter((s) => s.joints.includes(b.housing.id))) t.joints.push(j.id);
    (J.serves.F1 ??= []).push(`${b.housing.id}-dw0`, `${b.housing.id}-dw1`);
  }
  const group = `${j.id}-shaft`;
  const [w0, w1] = heights(j.pin);
  const z0 = Math.min(overhung ? B.w[0] - 2 : wA - (live ? COLLAR + 1 : 2), w0, j.below?.z0 ?? Infinity);
  const z1 = Math.max(overhung ? a1 + 1 : B.w[1] + 2, w1, j.below?.z1 ?? -Infinity);
  const k = live ? keyFor(d) : null;
  const driven = live ? j.driven : [];
  ctx.add(
    shaft(group, { d, z0, z1, flat: live && !k, ...(k && driven.length ? { keyway: [Math.min(...driven.map((x) => x.z0)), Math.max(...driven.map((x) => x.z1))] as [number, number] } : {}) }, {
      name: `${live ? "Shaft" : "Dead shaft"} Ø${d} h6 in plan, ${live ? (k ? `feather key ${k.b} x ${k.h}` : "D-flat") : "clamped in its blocks"}`,
      role: j.pin.accent ? "driver" : "hw",
      axis,
      body: j.body,
      at: j.at,
      ex,
      joints: [j.id],
    }),
  );
  const notes: string[] = [];
  inPlane(ctx, j.pin, () => {
    if (live) {
      // keyed parts (A5, F3): the bore cut to the shaft, a key above Ø8
      for (const x of driven) {
        const host = ctx.solidOf[x.part.id]!;
        const bore = k ? disc(d / 2 + 0.01, ...x.L) : dBore(d / 2 + 0.025).map(([a, b]) => [a + x.L[0], b + x.L[1]] as [number, number]);
        if (x.how === "keyed" && x.hole !== undefined) host.holes[x.hole] = bore;
        else host.holes.push(bore);
        if (k) {
          const kk = key(`${j.id}-${x.part.id}-key`, k.b, x.z1 - x.z0, {
            body: x.part.id,
            at: [x.L[0], x.L[1], 0],
            outer: [[d / 2 - k.t1, -k.b / 2], [d / 2 - k.t1 + k.h, -k.b / 2], [d / 2 - k.t1 + k.h, k.b / 2], [d / 2 - k.t1, k.b / 2]],
            z0: x.z0,
            z1: x.z1,
            ex: host.ex,
            joints: [j.id],
          });
          ctx.add(kk);
          (J.serves.F3 ??= []).push(kk.id);
        } else if (!(J.serves.F3 ??= []).includes(group)) J.serves.F3.push(group);
      }
      // the shaft located by two collars against the inner race of the first block's bearing (F2, F4)
      for (const [c, zc] of [["cA0", A.w[0] - COLLAR - 0.5], ["cA1", A.w[1] + 0.5]] as const) {
        const id = `${j.id}-${c}`;
        ctx.add(collar(id, d, d + 10, { body: j.body, at: j.at, z0: zc, z1: zc + COLLAR, ex, joints: [j.id], name: c === "cA0" ? `Shaft collar Ø${d} x Ø${d + 10} x ${COLLAR}, set screw M3` : "", qty: c === "cA0" ? 2 : 0 }));
        ctx.add(setScrew(`${id}-ss`, 3, { body: j.body, at: [j.at[0], j.at[1] + d / 2 + 2.5, 0], outer: disc(1.5), z0: zc + COLLAR / 2 - 1.5, z1: zc + COLLAR / 2 + 1.5, ex, joints: [j.id] }));
        (J.serves.F2 ??= []).push(id);
        (J.serves.F4 ??= []).push(id);
      }
      notes.push(`turns in sealed ${A.bearing?.name ?? ""} bearings in two pillow blocks ${fmt(Math.abs(B.seat[0] - A.seat[1]))} mm apart${overhung ? ", both behind the part" : ""}, located in the nearer by two collars, floating in the other`);
    } else {
      // every part turns on the clamped shaft in its own bearing (F2)
      for (const x of j.joined) seatBearing(ctx, j, x, "shield");
      notes.push("clamped in two pillow blocks, every part on its own bearing");
    }
  });
  for (const id of [A.housing.id, B.housing.id]) (J.serves.F2 ??= []).push(id);
  J.note = `Shaft in plan along ${axis}, Ø${d}, ${notes.join("; ")}${driven.length ? `; keyed to the ${driven.map((x) => partName(ctx, x)).join(" and ")}` : ""}.`;
  J.badge = ["two blocks", "ok"];
}

/** Whether a block from w0 to w1 along the axis would stand in the sweep of a moving part. */
function blocked(ctx: RuleContext, axis: "x" | "y", P: [number, number], w0: number, w1: number, d: number): boolean {
  const half = d / 2 + 20;
  const [u0, u1] = [P[0] - half, P[0] + half];
  const box = axis === "x" ? [w0, u0, w1, u1] : [u0, w0, u1, w1];
  const z1 = P[1] + d / 2 + 10;
  return ctx.sweeps().some((sw) => sw.z1 > ctx.b1 + 0.05 && sw.z0 < z1 && sw.regions.some((g) => g.box[0] < box[2]! && g.box[2] > box[0]! && g.box[1] < box[3]! && g.box[3] > box[1]!));
}

export const j10: Rule = {
  id: "j10-shaft-in-plan",
  tier: "AUTO",
  ids: ["J10", "A5", "F1", "F2", "F3", "F4"],
  applies: (ctx) => ctx.info.some((j) => j.type === "J10"),
  apply(ctx) {
    for (const j of ctx.info) if (j.kind === "pin" && j.type === "J10") buildShaftInPlan(ctx, j);
  },
};
