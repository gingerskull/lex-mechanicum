// A7, D4: rubber feet under the four mounting holes, concentric with the corner arcs, unless something hangs there.
import { circle, xf } from "../core/geom";
import { basePlate } from "../model/sample";
import { disc } from "../hardware/primitives";
import { marks, solid } from "../hardware/solid";
import type { Rule } from "./types";

export const feet: Rule = {
  id: "feet",
  tier: "AUTO",
  ids: ["A7", "D4"],
  applies: () => true,
  apply(ctx) {
    const bp = basePlate(ctx.model, ctx.sampled, ctx.form.base);
    const fr = ctx.form.base.footR;
    const under = ctx.solids.filter((t) => t.z0 < ctx.b0 - 0.1 && t.z1 > ctx.b0 - 12);
    bp.corners.forEach(([x, y], k) => {
      const hit = under.some((t) => {
        const q = ctx.world(t);
        if (!q) return false;
        return xf(t.outer, q).some(([px, py]) => Math.hypot(px - x, py - y) < fr + 3);
      });
      if (hit) return;
      ctx.add(
        solid(`foot${k}`, {
          name: k ? "" : `Rubber foot Ø${2 * fr} x 3, neoprene`,
          qty: k ? 0 : 4,
          kind: "foot",
          role: "ground",
          mat: "Neoprene, 60 Shore A",
          at: [x, y, 0],
          outer: disc(fr),
          marks: marks("boss", circle(fr - 2, 0, 0, 28)),
          z0: ctx.b0 - 3,
          z1: ctx.b0,
          ex: -3,
          chamfer: 1.2,
        }),
      );
    });
  },
};
