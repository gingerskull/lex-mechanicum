// The oblique-journal kit: a wobble drive's trunnion ring on the inclined journal of its input hub. One double-row
// angular-contact bearing on the journal, in the ring's bore, which carries the trunnion loads and the thrust along the
// journal both ways; its outer race held in the ring by an internal circlip each side (F2), its inner race on the
// journal's collar and held by an external circlip at the journal's end (F2). The journal is machined on the hub, which
// the stack keys on the input shaft (F3). The hub and the ring are the bodies' own parts (src/builder/shapes/wobble.ts);
// this rule adds what sits between them.
import { BEARINGS, BEARINGS_DOUBLE_ROW } from "../../../hardware/tables";
import { H } from "../../../hardware/primitives";
import type { Vec3 } from "../../../kin/math";
import type { BuildCtx } from "../../ctx";
import { canon, frameAlong } from "../../frames";
import { Local, titleOf } from "../../lib";
import type { Rule } from "../types";

const num = (v: unknown, d: number): number => (typeof v === "number" && Number.isFinite(v) ? v : d);
const pair = (v: unknown, d: [number, number]): [number, number] => (Array.isArray(v) && v.length >= 2 ? [num(v[0], d[0]), num(v[1], d[1])] : d);

const obliqueJournal: Rule = {
  id: "oblique-journal",
  tier: "AUTO",
  ids: ["J3", "F2"],
  fixture: "wobble-box",
  applies: (ctx) => ctx.joints.some((j) => j.kit === "oblique-journal"),
  apply(ctx: BuildCtx) {
    for (const j of ctx.joints.filter((q) => q.kit === "oblique-journal")) {
      const shapeOf = (id: string) => ctx.kin.bodies.find((q) => q.id === id)?.shape as Record<string, unknown> | undefined;
      const ringId = shapeOf(j.a)?.type === "wobble-ring" ? j.a : j.b;
      const hubId = ringId === j.a ? j.b : j.a;
      const ring = shapeOf(ringId) ?? {};
      const jrn = (shapeOf(hubId)?.journal ?? {}) as Record<string, unknown>;
      const dj = num(jrn.diameter, 20);
      const D = num(ring.bore, 32);
      const [s0, s1] = pair(jrn.seat, [-5, 5]);
      // one bearing as wide as the seat: a double-row one where the table has it, else the deep-groove rows that fill it
      const wide = BEARINGS_DOUBLE_ROW.find((q) => q.d === dj && q.D === D && Math.abs(q.B - (s1 - s0)) < 0.01);
      const b = wide ?? BEARINGS.find((q) => q.d === dj && q.D === D) ?? BEARINGS.find((q) => q.d === dj);
      if (!b) throw new Error(`${j.id}: no bearing in the table has a ${dj} mm bore for the journal of ${hubId}`);
      const n = Math.max(1, Math.round((s1 - s0) / b.B));
      // the journal's axis, its sign as the hub's shape takes it (its collar at the seat's start)
      const z = canon(j.r.axis);
      const L = new Local(frameAlong(j.at as Vec3, z), { joints: [j.id] });
      const f2: string[] = [];
      const name = wide ? `Double-row angular-contact bearing ${b.name}-2RS (${b.d}x${b.D}x${b.B})` : undefined;
      for (let k = 0; k < n; k++) L.add(H.bearing(`${j.id}-brg${k}`, b, { body: ringId, z0: s0 + k * b.B, z1: s0 + (k + 1) * b.B, closure: "seal", ...(k ? { name: "", qty: 0 } : { qty: n, ...(name ? { name } : {}) }) }));
      const end = s0 + n * b.B;
      L.add(H.circlip(`${j.id}-cli0`, D, { internal: true, body: ringId, z0: end, qty: 2 }));
      L.add(H.circlip(`${j.id}-cli1`, D, { internal: true, body: ringId, z0: s0 - 1.2, z1: s0, name: "", qty: 0 }));
      L.add(H.circlip(`${j.id}-cle`, dj, { body: hubId, z0: end }));
      f2.push(`${j.id}-cli0`, `${j.id}-cli1`, `${j.id}-cle`);
      ctx.add(L.out());
      // the hub's key runs in the straight shank only (the stack keys the whole planned length, which spans the shaft's
      // run on through the journal to the far pillow block)
      const shank = num(jrn.shank, NaN);
      if (Number.isFinite(shank))
        for (const k of ctx.solids.filter((s) => s.body === hubId && s.kind === "key" && s.op.op === "extrude")) {
          const h = (k.op as { h: number }).h;
          const kl = Math.min(h, shank - 1);
          if (kl < h) Object.assign(k, { op: { ...k.op, h: kl }, name: k.name.replace(/ x [\d.]+ \(DIN 6885\)/, ` x ${kl} (DIN 6885)`) });
        }
      const what = wide ? `one double-row angular-contact bearing ${b.name}-2RS, which takes the trunnion loads and the thrust along the journal both ways` : `${n} sealed bearings ${b.name}-2RS side by side`;
      ctx.note({
        id: j.id,
        kit: "oblique-journal",
        at: j.at,
        title: `oblique-journal · ${titleOf(j.id)}`,
        note: `${titleOf(j.id)}: the ${ringId} turns on the inclined Ø${dj} journal on ${what}; the outer race held in the ring's bore by internal circlips, the inner race on the journal's collar and held by an external circlip; the journal is machined on the ${hubId} hub, keyed on the input shaft. The trunnion loads go ring to bearing to journal to the input shaft and its pillow blocks.`,
        badge: ["both ends held", "ok"],
        serves: { F2: f2 },
      });
      (ctx.fired["oblique-journal"] ??= []).push(j.id);
    }
  },
};

export const WOBBLE_KITS: Rule[] = [obliqueJournal];
