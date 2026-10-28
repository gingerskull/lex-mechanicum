// The polishes: where the builder needs a true exception for a mechanism, its polish (the polish API v3,
// src/builder/polish.ts) is registered here by the pass that builds it. The registry is index.ts.
import type { Polish } from "../builder";

export const polishes3: Record<string, () => Promise<{ polish: Polish }>> = {
  "four-bar": () => import("./four-bar/polish3"),
  "elliptic-trammel": () => import("./elliptic-trammel/polish3"),
  "toggle-clamp": () => import("./toggle-clamp/polish3"),
  "crypt-lid-quick-return": () => import("./crypt-lid-quick-return/polish3"),
};
