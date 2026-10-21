// Mechanisms rebuilt on engine v3: a catalogue record v3 plus, only where the builder needs a true exception, a polish
// (the polish API v3, src/builder/polish.ts). A mechanism is in the 3.0 world when its audit sheet says standard 3.0 or
// later (src/checks/engine.ts); its polish, if it has one, is registered here by the pass that rebuilds it.
import type { Polish } from "../builder";

export const polishes3: Record<string, () => Promise<{ polish: Polish }>> = {
  "four-bar": () => import("./four-bar/polish3"),
  "elliptic-trammel": () => import("./elliptic-trammel/polish3"),
};
