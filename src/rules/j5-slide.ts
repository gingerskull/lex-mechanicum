// J5: a prismatic slide (H.slide), a few blocks: a reference rail, a gib clamped under the keeper on the other rail
// (F2, F7), wipers and nipple (F8), an end stop block with a pad at each end (F5). The rails' seat is A6 (standoffs).
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
