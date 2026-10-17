// J7: cam contact (H.followerTrain): return spring with seat, guide and preload screw (F6), guide bushing with circlip
// (F2), anti-rotation key on a flat follower (F3), felt oiler on the track (F8). Zero line by the timing rule (F9).
import { followerTrain } from "../hardware/sub/followerTrain";
import type { Rule } from "./types";

export const j7: Rule = {
  id: "j7-cam",
  tier: "AUTO",
  ids: ["J7", "F6"],
  applies: (ctx) => ctx.info.some((j) => j.type === "J7"),
  apply(ctx) {
    for (const j of ctx.info) if (j.kind === "cam") followerTrain(ctx, j);
  },
};
