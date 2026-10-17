// J5: a prismatic slide (H.slide): guide, gib with adjusters and lock nuts (F7), keeper (F2), wipers and nipple (F8),
// end stops with bumpers (F5).
import { slide } from "../hardware/sub/slide";
import type { Rule } from "./types";

export const j5: Rule = {
  id: "j5-slide",
  tier: "AUTO",
  ids: ["J5", "F5", "F7"],
  applies: (ctx) => ctx.info.some((j) => j.type === "J5"),
  apply(ctx) {
    for (const j of ctx.info) if (j.kind === "slide") slide(ctx, j);
  },
};
