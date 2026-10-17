// J4: a pin in a slot. Track roller on the stud, hardened wear strips screwed into the slot walls (M14), a felt oiler
// (F8), relief at the slot ends. A moving stud is a shoulder bolt (as J3); a fixed one is an axle (as J1).
import { buildFixedPin } from "./j1-dead-axle";
import { buildMovingPin } from "./j3-moving-pin";
import type { Rule } from "./types";

export const j4: Rule = {
  id: "j4-slot-roller",
  tier: "AUTO",
  ids: ["J4", "M14"],
  applies: (ctx) => ctx.info.some((j) => j.type === "J4"),
  apply(ctx) {
    for (const j of ctx.info) if (j.kind === "pin" && j.type === "J4") (j.fixed ? buildFixedPin : buildMovingPin)(ctx, j);
  },
};
