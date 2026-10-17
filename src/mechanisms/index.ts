// Registry: mechanism id -> lazy import of its model and polish.
import type { Polish } from "../assemble/api";
import type { MechanismModel } from "../model/types";

export interface MechanismEntry {
  model: MechanismModel;
  polish?: Polish;
}

export const mechanisms: Record<string, () => Promise<MechanismEntry>> = {
  "four-bar": async () => ({
    model: (await import("./four-bar/model")).default,
    polish: (await import("./four-bar/polish")).polish,
  }),
  geneva: async () => ({
    model: (await import("./geneva/model")).default,
    polish: (await import("./geneva/polish")).polish,
  }),
};
