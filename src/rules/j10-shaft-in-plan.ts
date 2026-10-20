// J10: a shaft in plan, a fixed pin on an x or y axis (src/core/axis.ts). It runs in two pillow blocks standing on the
// base past either end of what it carries (H.pillowBlock): a live shaft turns in a sealed bearing in each, located in
// the first block by two collars against its inner race and floating in the second, so it can grow (F2, F4); a dead
// shaft is clamped in both and every part turns on it in its own bearing (F2). Parts keyed to a live shaft take a
// D-flat to Ø8 and a feather key above (A5, F3); a part overhung on the shaft's free end is held there by a washer and
// a countersunk screw into the shaft end (F2). The base grows under a block that stands past it. A hand-turned or
// motor-driven input keeps a free end past the blocks for its handwheel or pulley. The blocks lift with the shaft in
// the explode.
import { bbox, dBore } from "../core/geom";
import { boxRegion, depth, overlap, type Region } from "../core/poly";
import { collar, disc, key, setScrew, shaft, screw, washer } from "../hardware/primitives";
import { bossR, FOOT, FOOT_PAST, footHalf, pillowBlock, pillowWidth } from "../hardware/sub/pillow";
import { keyFor } from "../hardware/tables";
import { heights } from "../parts";
import { growBase } from "./base";
import { partName, seatBearing } from "./pins";
import { inPlane, type PinJoint, type Rule, type RuleContext } from "./types";

const fmt = (v: number) => String(+v.toFixed(1));
/** Clearance between what the shaft carries and a block, and the collar's width, mm. */
const GAP = 3;
const COLLAR = 6;
/** The free end past the outer block: a handwheel's run, or a pulley and its hub's, mm. */
const END: Record<string, number> = { manual: 12, rotary: 14 };
/** The end retainer: washer thickness, and the base's margin round a block foot it grows under, mm. */
const END_W = 2;
const MARGIN = 8;

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
  const overhung = blocked(ctx, axis, j.P, after, after + L, d, live);
  const wB = overhung ? wA - Math.max(20, 2 * d) - L : after;
  const A = pillowBlock(ctx, `${j.id}-blkA`, { axis, P: j.P, w0: wA, d, live, located: true, ex, first: true });
  const B = pillowBlock(ctx, `${j.id}-blkB`, { axis, P: j.P, w0: wB, d, live, located: false, ex, first: false });
  // the base under a block that stands past it
  for (const b of [A, B]) {
    if (b.foot.outer.every((p) => depth(ctx.get("base")!.outer, [], p) >= 2)) continue;
    const [x0, y0, x1, y1] = bbox(b.foot.outer);
    growBase(ctx, [x0 - MARGIN, y0 - MARGIN, x1 + MARGIN, y1 + MARGIN]);
  }
  // a hand-turned input takes a handwheel on the shaft's free end, a motor-driven one its pulley (the drive rule fits
  // them there)
  const run = END[ctx.model.input.kind];
  const input = run !== undefined && j.driven.some((x) => x.part.id === ctx.model.input.part);
  if (input) j.below = overhung ? { z0: B.w[0] - 2 - run, z1: B.w[0] - 2 } : { z0: B.w[1] + 2, z1: B.w[1] + 2 + run };
  // an overhung part keyed on the shaft's free end: held there by a washer and a countersunk screw (F2)
  const tip = overhung && live ? j.driven.find((x) => x.z1 >= a1 - 0.01) : undefined;
  for (const b of [A, B]) {
    for (const t of ctx.solids.filter((s) => s.joints.includes(b.housing.id))) t.joints.push(j.id);
    (J.serves.F1 ??= []).push(`${b.housing.id}-dw0`, `${b.housing.id}-dw1`);
  }
  const group = `${j.id}-shaft`;
  const [w0, w1] = heights(j.pin);
  const z0 = Math.min(overhung ? B.w[0] - 2 : wA - (live ? COLLAR + 1 : 2), w0, j.below?.z0 ?? Infinity);
  // a retained end stops flush with the part it holds
  const z1 = tip ? a1 : Math.max(overhung ? a1 + 1 : B.w[1] + 2, w1, j.below?.z1 ?? -Infinity);
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
  let end = "";
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
      if (tip) {
        const host = ctx.solidOf[tip.part.id]!;
        const M = d >= 14 ? 5 : d >= 10 ? 4 : 3;
        const E = { body: tip.part.id, at: [tip.L[0], tip.L[1], 0] as [number, number, number], ex: host.ex, joints: [j.id] };
        const w = `${j.id}-end-w`;
        ctx.add(washer(w, M + 0.3, d + 6, { ...E, name: `End washer Ø${d + 6} x ${END_W}, steel`, z0: a1, z1: a1 + END_W, inset: false }));
        ctx.add(screw(`${j.id}-end`, "csk", M, 10, { ...E, face: a1 + END_W, dir: -1, name: `Countersunk M${M} x 10 (ISO 10642), into the shaft end`, lock: "threadlocker, medium (Loctite 243)" }));
        (J.serves.F2 ??= []).push(w, `${j.id}-end`);
        end = ` On the free end, a washer and a countersunk M${M} into the shaft end hold the ${partName(ctx, tip)}.`;
      }
      notes.push(`turns in sealed ${A.bearing?.name ?? ""} bearings in two pillow blocks ${fmt(Math.abs(B.seat[0] - A.seat[1]))} mm apart${overhung ? ", both behind the part" : ""}, located in the nearer by two collars, floating in the other`);
    } else {
      // every part turns on the clamped shaft in its own bearing (F2)
      for (const x of j.joined) seatBearing(ctx, j, x, "shield");
      notes.push("clamped in two pillow blocks, every part on its own bearing");
    }
  });
  for (const id of [A.housing.id, B.housing.id]) (J.serves.F2 ??= []).push(id);
  J.note = `Shaft in plan along ${axis}, Ø${d}, ${notes.join("; ")}${driven.length ? `; keyed to the ${driven.map((x) => partName(ctx, x)).join(" and ")}` : ""}.${end}`;
  J.badge = ["two blocks", "ok"];
}

/**
 * Whether a block from w0 to w1 along the axis would stand in the sweep of a moving part: each sweep's outline (a plan
 * footprint for a part on an x or y axis) against the block's area in plan, the housing's for a sweep that passes over
 * the foot, the foot's for one that reaches down to it, over the block's height.
 */
function blocked(ctx: RuleContext, axis: "x" | "y", P: [number, number], w0: number, w1: number, d: number, live: boolean): boolean {
  const area = (half: number, past: number): Region => {
    const [a0, a1, u0, u1] = [w0 - past, w1 + past, P[0] - half, P[0] + half];
    return axis === "x" ? boxRegion(a0, u0, a1, u1) : boxRegion(u0, a0, u1, a1);
  };
  const housing = area(bossR(d, live), 0);
  const foot = area(footHalf(d, live), FOOT_PAST);
  const top = ctx.b1 + FOOT;
  const z1 = P[1] + bossR(d, live);
  return ctx.sweeps().some((sw) => sw.z1 > ctx.b1 + 0.05 && sw.z0 < z1 && sw.regions.some((g) => overlap(g, sw.z0 < top ? foot : housing) > 0));
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
