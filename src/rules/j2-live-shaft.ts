// J2: a ground revolute on a live shaft. Housing cartridge behind the base (H.housing), keyed shaft (A5: D-flat to
// Ø8, feather key above), a bronze thrust washer under the first part (F4), the top retained by a flush end screw or a
// circlip over a hub (F2), an end retainer below (F2), a clearance hole in the base (A7). The drive rule adds the
// pulley, the home flag and the sensor (F10, V6).
import { dBore } from "../core/geom";
import { circlip, collar, disc, key, plainWasher, screw, setScrew, shaft, thrustWasher, tube } from "../hardware/primitives";
import { housing } from "../hardware/sub/housing";
import { circlipExt, innerRingD, keyFor, standardLength } from "../hardware/tables";
import { elements, partName, stackSpacers } from "./pins";
import type { PinJoint, Rule, RuleContext } from "./types";

const fmt = (v: number) => String(+v.toFixed(1));
/** Space a live input shaft leaves below its housing for the pulley, its spacer and the end retainer, mm. */
export const INPUT_END = 15;

export function buildLiveShaft(ctx: RuleContext, j: PinJoint): void {
  const J = ctx.joint(j.id)!;
  const input = !!j.pin.accent;
  const d = j.d;
  const group = `${j.id}-shaft`;
  const H = housing(ctx, j.id, { at: j.P, d, ...(j.eccentric ? { eccentric: true } : {}) });
  const { els, names } = elements(ctx, j, j.body, j.at, group, "shield");
  // the gap over the base under the first part: a bronze thrust washer (F4)
  const first = els[0]!;
  if (first.z0 - ctx.b1 > 0.3) {
    ctx.add(thrustWasher(`${j.id}-tw`, d + 0.2, d + 6, { body: j.body, at: j.at, z0: ctx.b1, z1: first.z0, ex: first.ex, joints: [j.id], why: "takes the downward load of the driven part on the base (F4)" }));
    (J.serves.F4 ??= []).push(`${j.id}-tw`);
  }
  stackSpacers(ctx, j, els, j.body, j.at, false);
  const driven = j.driven;
  const topDriven = driven[driven.length - 1]!;
  const lowDriven = driven[0]!;
  const hub = ctx.solids.find((t) => t.body === topDriven.part.id && t.why === "hub");
  const topZ = Math.max(topDriven.z1, hub?.z1 ?? -Infinity);
  const k = keyFor(d);
  // keyed parts (A5, F3): D-bore to Ø8, round bore with a feather key above
  for (const x of driven) {
    const host = ctx.solidOf[x.part.id]!;
    if (x.how !== "keyed") host.holes.push(k ? disc(d / 2 + 0.01, ...x.L) : dBore(d / 2 + 0.025).map(([a, b]) => [a + x.L[0], b + x.L[1]] as [number, number]));
    // a D-flat transmits the torque itself (F3)
    if (!k) (J.serves.F3 ??= []).includes(group) || J.serves.F3.push(group);
    if (k) {
      const kz0 = x.z0;
      const kz1 = x.z1;
      const kk = key(`${j.id}-${x.part.id}-key`, k.b, kz1 - kz0, {
        body: x.part.id,
        at: [x.L[0], x.L[1], 0],
        outer: [[d / 2 - k.t1, -k.b / 2], [d / 2 - k.t1 + k.h, -k.b / 2], [d / 2 - k.t1 + k.h, k.b / 2], [d / 2 - k.t1, k.b / 2]],
        z0: kz0,
        z1: kz1,
        ex: host.ex,
        joints: [j.id],
      });
      ctx.add(kk);
      host.marks.push({ kind: "keyway", pts: kk.outer.map(([a, b]) => [a + x.L[0], b + x.L[1]] as [number, number]) });
      (J.serves.F3 ??= []).push(kk.id);
    }
  }
  // top retention (F2): a circlip in a groove over a hub, else a flush countersunk end screw
  let z1: number;
  const grooves: number[] = [];
  const endM = d <= 6 ? 3 : d <= 8 ? 4 : d <= 10 ? 5 : 6;
  if (hub) {
    const c = circlipExt(d);
    grooves.push(topZ);
    z1 = topZ + c.s + 0.6;
    ctx.add(circlip(`${j.id}-cl-top`, d, { body: j.body, at: j.at, z0: topZ, z1: topZ + c.s, ex: topDriven.z1 > 0 ? ctx.solidOf[topDriven.part.id]!.ex : 0, joints: [j.id], group }));
    (J.serves.F2 ??= []).push(`${j.id}-cl-top`);
  } else {
    z1 = topZ - 0.5;
    ctx.add(screw(`${j.id}-end`, "csk", endM, 2 * endM + 2, { body: j.body, at: j.at, face: topZ, dir: -1, ex: ctx.solidOf[topDriven.part.id]!.ex + 1, joints: [j.id], accent: input, headTop: true, name: `Countersunk M${endM} x ${standardLength(2 * endM + 2)} (ISO 10642), into the shaft end, flush` }));
    (J.serves.F2 ??= []).push(`${j.id}-end`);
  }
  // below the housing: the input leaves room for the pulley (drive rule); other shafts end in a collar
  const zb = input ? H.z0 - INPUT_END : H.z0 - 5;
  const segs = shaft(group, { d, z0: zb, z1, flat: !k, ...(k ? { keyway: [lowDriven.z0, topDriven.z1] as [number, number] } : {}), grooves }, {
    name: `${input ? "Input" : "Drive"} shaft Ø${d} h6, ${k ? `feather key ${k.b} x ${k.h}` : "D-flat"}`,
    role: input ? "driver" : "hw",
    body: j.body,
    at: j.at,
    ex: -4,
    joints: [j.id],
  });
  ctx.add(segs);
  ctx.add(tube(`${j.id}-hsleeve`, d + 0.2, Math.min(d + 3, innerRingD(H.bearing)), { name: "Spacer sleeve between the housing bearings, inner races", body: j.body, at: j.at, z0: H.lower[1], z1: H.upper[0], ex: -3, joints: [j.id], inset: true }));
  if (input) {
    j.below = { z0: zb, z1: H.lower[0] };
    // end retainer (F2): a washer and a socket screw into the shaft end
    const M = endM;
    ctx.add(plainWasher(`${j.id}-rw`, M, { name: `Retaining washer Ø${d + 6} x 1.5`, body: j.body, at: j.at, z0: zb - 1.5, z1: zb, outer: disc((d + 6) / 2), ex: -5, joints: [j.id], group: `${j.id}-rs` }));
    ctx.add(screw(`${j.id}-rs`, "socket", M, 2 * M, { body: j.body, at: j.at, face: zb - 1.5, dir: 1, ex: -5, joints: [j.id], name: `Socket head M${M} x ${standardLength(2 * M)} (ISO 4762), into the shaft end` }));
    (J.serves.F2 ??= []).push(`${j.id}-rs`);
  } else {
    ctx.add(collar(`${j.id}-collar`, d, d + 10, { body: j.body, at: j.at, z0: H.z0 - 5, z1: H.z0 - 0.5, ex: -4, joints: [j.id] }));
    ctx.add(setScrew(`${j.id}-collar-ss`, 3, { body: j.body, at: [j.at[0] + (d + 10) / 2 - 2, j.at[1], 0], z0: H.z0 - 4, z1: H.z0 - 1.5, ex: -4, joints: [j.id] }));
    (J.serves.F2 ??= []).push(`${j.id}-collar`);
  }
  const base = ctx.get("base")!;
  base.holes.push(disc(d / 2 + 1, ...j.P));
  base.joints.push(j.id);
  J.note = `${input ? "Input" : "Live"} shaft Ø${d}, ${k ? "feather-keyed" : "on a D-flat"} to the ${driven.map((x) => partName(ctx, x)).join(" and ")}, in two sealed ${H.bearing.name} bearings ${fmt(H.upper[0] - H.lower[1])} mm apart in a housing behind the base${j.eccentric ? " on an eccentric bushing" : ""}${names.length ? "; " + names.join(", ") : ""}.`;
  J.badge = ["two bearings", "ok"];
}

export const j2: Rule = {
  id: "j2-live-shaft",
  tier: "AUTO",
  ids: ["J2", "A5", "F1", "F2", "F3", "F4"],
  applies: (ctx) => ctx.info.some((j) => j.type === "J2"),
  apply(ctx) {
    for (const j of ctx.info) if (j.kind === "pin" && j.type === "J2") buildLiveShaft(ctx, j);
  },
};
