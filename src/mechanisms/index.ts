// Registry: mechanism id -> lazy import of its model and polish.
import type { MechanismModel } from "../model/types";

export interface MechanismEntry {
  model: MechanismModel;
  // the polish signature is set by the assembly API; any function fits until then
  polish?: (...args: never[]) => void;
}

export const mechanisms: Record<string, () => Promise<MechanismEntry>> = {
  "four-bar": async () => ({
    model: (await import("./four-bar/model")).default,
    polish: (await import("./four-bar/polish")).polish,
  }),
};
