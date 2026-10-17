// V1 to V6, F10: the drive chosen by the model's input kind (H.drive). Runs after every joint so the motor finds a
// clear spot under the base.
import { drive as build } from "../hardware/sub/drive";
import type { Rule } from "./types";

export const drive: Rule = {
  id: "drive",
  tier: "AUTO",
  ids: ["V1", "V2", "V3", "V5", "V6", "F10"],
  applies: () => true,
  apply(ctx) {
    build(ctx);
  },
};
