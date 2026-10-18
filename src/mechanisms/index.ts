// Registry: mechanism id -> its model (models.ts) and a lazy import of its polish. Node tools, assembly and packaging
// load both; the browser loads models.ts only.
import type { Polish } from "../assemble/api";
import type { MechanismModel } from "../model/types";
import { models } from "./models";

export { models };

export interface MechanismEntry {
  model: MechanismModel;
  polish?: Polish;
}

const polishes: Record<string, () => Promise<{ polish: Polish }>> = {
  "four-bar": () => import("./four-bar/polish"),
  geneva: () => import("./geneva/polish"),
  "spur-gears": () => import("./spur-gears/polish"),
  "slider-crank": () => import("./slider-crank/polish"),
  "oldham-coupling": () => import("./oldham-coupling/polish"),
};

export const mechanisms: Record<string, () => Promise<MechanismEntry>> = Object.fromEntries(
  Object.keys(models).map((id) => [id, async () => ({ model: await models[id]!(), polish: (await polishes[id]!()).polish })]),
);
