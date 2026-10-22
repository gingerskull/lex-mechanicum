// The kit of a differential's spider on its case (spider-pin): the spiders turn on a cross-pin carried by the case's
// cage, not on a pin of their own: the pin runs from the cage's member through the spider's bore to the case's centre,
// and the spider runs on it in a bronze bushing, a thrust washer at its back face against the cage (J3, F2, F4).
import { H } from "../../hardware/primitives";
import { type Vec3, v3 } from "../../kin/math";
import { frameAlong } from "../frames";
import { Local, titleOf } from "../lib";
import type { Rule } from "./types";

const num = (v: unknown, d: number): number => (typeof v === "number" && Number.isFinite(v) ? v : d);

export const spiderPin: Rule = {
  id: "spider-pin",
  tier: "AUTO",
  ids: ["J3", "F2", "F4"],
  fixture: "differential",
  applies: (ctx) => ctx.joints.some((j) => j.kit === "spider-pin"),
  apply(ctx) {
    for (const j of ctx.joints.filter((q) => q.kit === "spider-pin")) {
      const caseId = ctx.kin.bodies.find((b) => b.id === j.a)?.shape?.cage ? j.a : j.b;
      const spider = caseId === j.a ? j.b : j.a;
      const cage = (ctx.kin.bodies.find((b) => b.id === caseId)!.shape!.cage ?? {}) as Record<string, unknown>;
      const sh = (ctx.kin.bodies.find((b) => b.id === spider)?.shape ?? {}) as Record<string, unknown>;
      const part = ctx.parts.get(spider);
      if (!part) continue;
      // along the pin, outward from the case's centre: the spider's back face is at its joint, its bore runs inward
      const out: Vec3 = v3.unit(j.axis as Vec3);
      const sgn = v3.dot(out, j.at as Vec3) >= 0 ? 1 : -1;
      const ax: Vec3 = v3.mul(out, sgn);
      const back = Math.abs(v3.dot(j.at as Vec3, ax));
      const h = num(cage.half, 50);
      // a bevel's bore tapers with its teeth: the pin fits its narrow end
      const g = ctx.geoms.get(spider);
      const narrow = g?.scaleTop !== undefined ? Math.min(g.scaleTop, 1 / g.scaleTop) : 1;
      const d = Math.max(4, Math.floor(num(sh.bore, 12) * narrow) - 2);
      const L = new Local(frameAlong([0, 0, 0], ax), { joints: [j.id] });
      const depth = part.op.op === "extrude" ? part.op.h : 12;
      L.add(H.dowel(`${j.id}-pin`, d, { body: caseId, z0: back - depth - 2, z1: h, name: `Cross-pin Ø${d}, hardened, in the case's cage` }));
      L.add(H.bushing(`${j.id}-bush`, d, d + 2, { body: spider, z0: back - depth + 0.5, z1: back - 0.5 }));
      L.add(H.thrustWasher(`${j.id}-tw`, d + 0.2, d + 12, { body: caseId, z0: back + 0.3, z1: back + 1.3 }));
      ctx.add(L.out());
      ctx.note({ id: j.id, kit: "spider-pin", at: j.at, title: `spider-pin · ${titleOf(j.id)}`, note: `${titleOf(j.id)}: the ${spider} turns on the case's Ø${d} cross-pin in a bronze bushing, a bronze thrust washer at its back face takes its thrust against the cage; the pin's load goes into the case's cage and through it into the ring gear.`, serves: { F2: [`${j.id}-pin`], F4: [`${j.id}-tw`] }, badge: ["cross-pin", "ok"] });
    }
  },
};
