// F5: stops just outside the swing of every oscillating part on a ground pivot (H.stops from the solved range), so the
// part lands on rubber when the drive is off. The input is limited by its drive and is skipped.
import { stops as stopPosts, swing } from "../hardware/sub/stops";
import type { Rule } from "./types";

export const stops: Rule = {
  id: "stops",
  tier: "AUTO",
  ids: ["F5"],
  applies: (ctx) => ctx.info.some((j) => j.kind === "pin" && j.fixed),
  apply(ctx) {
    for (const j of ctx.info) {
      if (j.kind !== "pin" || !j.fixed) continue;
      for (const x of j.joined) {
        if (!x.moving || x.part.id === ctx.model.input.part) continue;
        const r = swing(ctx, x.part);
        if (!r) continue;
        const ids = stopPosts(ctx, { part: x.part, pivot: j.P, range: r, joint: j.id });
        const J = ctx.joint(j.id)!;
        (J.serves.F5 ??= []).push(...ids);
        const deg = ((r[1] - r[0]) * 180) / Math.PI;
        J.note += ids.length
          ? ` Stops 2° beyond each end of the ${x.part.id}'s ${deg.toFixed(0)}° swing.`
          : ` No room for stops beyond the ${x.part.id}'s swing.`;
      }
    }
  },
};
