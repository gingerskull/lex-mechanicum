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
  "peaucellier-lipkin": () => import("./peaucellier-lipkin/polish"),
  "intermittent-gear": () => import("./intermittent-gear/polish"),
  geneva: () => import("./geneva/polish"),
  "spur-gears": () => import("./spur-gears/polish"),
  "jansen-linkage": () => import("./jansen-linkage/polish"),
  "gear-train": () => import("./gear-train/polish"),
  "slider-crank": () => import("./slider-crank/polish"),
  "toggle-clamp": () => import("./toggle-clamp/polish"),
  "tusi-couple": () => import("./tusi-couple/polish"),
  "rack-pinion": () => import("./rack-pinion/polish"),
  "cam-follower": () => import("./cam-follower/polish"),
  "ratchet-pawl": () => import("./ratchet-pawl/polish"),
  "chebyshev-linkage": () => import("./chebyshev-linkage/polish"),
  pantograph: () => import("./pantograph/polish"),
  "crank-shaper": () => import("./crank-shaper/polish"),
  planetary: () => import("./planetary/polish"),
  "scissor-lift": () => import("./scissor-lift/polish"),
  "elliptic-trammel": () => import("./elliptic-trammel/polish"),
  "watt-linkage": () => import("./watt-linkage/polish"),
  "locomotive-drive": () => import("./locomotive-drive/polish"),
  whitworth: () => import("./whitworth/polish"),
  "oldham-coupling": () => import("./oldham-coupling/polish"),
  "oscillating-cylinder": () => import("./oscillating-cylinder/polish"),
  "scotch-yoke": () => import("./scotch-yoke/polish"),
  "hoekens-linkage": () => import("./hoekens-linkage/polish"),
};

export const mechanisms: Record<string, () => Promise<MechanismEntry>> = Object.fromEntries(
  Object.keys(models).map((id) => [id, async () => ({ model: await models[id]!(), polish: (await polishes[id]!()).polish })]),
);
