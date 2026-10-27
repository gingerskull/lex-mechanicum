// The oblique-journal kit: a wobble drive's trunnion ring on the inclined journal of its input shaft. Two sealed
// bearings side by side on the journal, in the ring's bore, each outer race held by an internal circlip in the ring
// (F2); the inner races stand on the journal's collar and are held by an external circlip at the journal's end (F2).
// The journal is one forging with the wobble hub keyed on the input shaft (the stack's key, F3). The journal and the
// ring are the bodies' own parts (src/builder/shapes/wobble.ts); this rule adds what sits between them.
import { BEARINGS } from "../../../hardware/tables";
import { H } from "../../../hardware/primitives";
import type { Vec3 } from "../../../kin/math";
import type { BuildCtx } from "../../ctx";
import { frameAlong } from "../../frames";
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
      const jrnId = ringId === j.a ? j.b : j.a;
      const ring = shapeOf(ringId) ?? {};
      const jrn = shapeOf(jrnId) ?? {};
      const dj = num(jrn.diameter, 20);
      const D = num(ring.bore, 32);
      const [s0, s1] = pair(jrn.seat, [-7, 7]);
      const b = BEARINGS.find((q) => q.d === dj && q.D === D) ?? BEARINGS.find((q) => q.d === dj);
      if (!b) throw new Error(`${j.id}: no bearing in the table has a ${dj} mm bore for the journal ${jrnId}`);
      const n = Math.max(1, Math.round((s1 - s0) / b.B));
      // the journal's axis, its sign as the journal's frame has it (its collar at the seat's start)
      const g = ctx.geoms.get(jrnId);
      const z = g ? g.frame.z : j.r.axis;
      const L = new Local(frameAlong(j.at as Vec3, z), { joints: [j.id] });
      const f2: string[] = [];
      for (let k = 0; k < n; k++) L.add(H.bearing(`${j.id}-brg${k}`, b, { body: ringId, z0: s0 + k * b.B, z1: s0 + (k + 1) * b.B, closure: "seal", ...(k ? { name: "", qty: 0 } : { qty: n }) }));
      const end = s0 + n * b.B;
      L.add(H.circlip(`${j.id}-cli0`, D, { internal: true, body: ringId, z0: end, qty: 2 }));
      L.add(H.circlip(`${j.id}-cli1`, D, { internal: true, body: ringId, z0: s0 - 1.2, z1: s0, name: "", qty: 0 }));
      L.add(H.circlip(`${j.id}-cle`, dj, { body: jrnId, z0: end }));
      f2.push(`${j.id}-cli0`, `${j.id}-cli1`, `${j.id}-cle`);
      ctx.add(L.out());
      // the journal and the hub's straight shank are one forging, built as two bodies so a change of the journal angle
      // turns the journal alone: where the collar runs into the shank (and over the shank's key) is the forging itself
      const shaftJ = typeof jrn.shaft === "string" ? ctx.joints.find((q) => q.id === jrn.shaft) : undefined;
      const hubId = shaftJ ? (shaftJ.a === "ground" ? shaftJ.b : shaftJ.a) : undefined;
      if (hubId) {
        // (the hub's own part is in ctx.parts until the build joins it; the collar and the keys are solids already)
        const into = [hubId, ...ctx.solids.filter((s) => s.body === hubId && s.kind === "key").map((s) => s.id)];
        for (const s of ctx.solids.filter((q) => q.id === `${jrnId}-collar`))
          Object.assign(s, { allow: [...(s.allow ?? []), ...into], why: `one forging with the ${hubId}: the journal runs into the hub's shank` });
      }
      ctx.note({
        id: j.id,
        kit: "oblique-journal",
        at: j.at,
        title: `oblique-journal · ${titleOf(j.id)}`,
        note: `${titleOf(j.id)}: the ${ringId} turns on the inclined Ø${dj} journal on ${n} sealed bearings ${b.name}-2RS side by side, the outer races held in the ring's bore by internal circlips, the inner races on the journal's collar and held by an external circlip; the journal is one forging with the wobble hub keyed on the input shaft. The trunnion loads go ring to bearings to journal to the input shaft and its pillow blocks.`,
        badge: ["both ends held", "ok"],
        serves: { F2: f2 },
      });
      (ctx.fired["oblique-journal"] ??= []).push(j.id);
    }
  },
};

export const WOBBLE_KITS: Rule[] = [obliqueJournal];
