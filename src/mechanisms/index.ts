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
  "spur-gears": async () => ({
    model: (await import("./spur-gears/model")).default,
    polish: (await import("./spur-gears/polish")).polish,
  }),
  "slider-crank": async () => ({
    model: (await import("./slider-crank/model")).default,
    polish: (await import("./slider-crank/polish")).polish,
  }),
};
