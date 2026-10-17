// F8 by joint type: an oil hole to every plain bushing, an oil sink over every open bearing that has none yet, grease
// on open gears (noted). Sealed bearings need nothing; slots and slides got their felts and nipples from J4 and J5.
import { circle } from "../core/geom";
import { oilSink } from "../hardware/primitives";
import type { Rule } from "./types";

export const lubrication: Rule = {
  id: "lubrication",
  tier: "AUTO",
  ids: ["F8"],
  applies: () => true,
  apply(ctx) {
    for (const t of ctx.solids) {
      if (t.kind === "bushing") {
        const host = ctx.get(t.body);
        if (!host) continue;
        // an oil hole from the top face to the bushing, with a small sink round it
        const r = (t.D ?? 8) / 2 + 1.2;
        host.marks.push({ kind: "oilSink", pts: circle(0.8, t.at[0] + r, t.at[1], 12) }, { kind: "oilSink", pts: circle(1.4, t.at[0] + r, t.at[1], 14) });
        for (const j of t.joints) (ctx.joint(j)?.serves ?? {}).F8 = [...(ctx.joint(j)?.serves.F8 ?? []), t.id];
      }
      if (t.kind === "bearing" && t.closure === "open") {
        const served = t.joints.some((j) => (ctx.joint(j)?.serves.F8 ?? []).length > 0);
        if (served) continue;
        const host = ctx.get(t.body);
        if (host) host.marks.push(...oilSink((t.d ?? 6) / 2, t.at[0], t.at[1]));
        for (const j of t.joints) (ctx.joint(j)?.serves ?? {}).F8 = [...(ctx.joint(j)?.serves.F8 ?? []), t.id];
      }
    }
    for (const j of ctx.info) if (j.kind === "mesh") ctx.joint(j.id)!.note += " Open gears: greased at assembly.";
  },
};
