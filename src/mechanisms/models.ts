// Models only: what the site's stage and cards load. A separate module from the full registry, so the browser bundle
// holds no reference to a polish (R4: the rules, the hardware library and the polishes never ship).
import type { MechanismModel } from "../model/types";

export const models: Record<string, () => Promise<MechanismModel>> = {
  "four-bar": async () => (await import("./four-bar/model")).default,
  "intermittent-gear": async () => (await import("./intermittent-gear/model")).default,
  geneva: async () => (await import("./geneva/model")).default,
  "spur-gears": async () => (await import("./spur-gears/model")).default,
  "jansen-linkage": async () => (await import("./jansen-linkage/model")).default,
  "slider-crank": async () => (await import("./slider-crank/model")).default,
  "toggle-clamp": async () => (await import("./toggle-clamp/model")).default,
  "tusi-couple": async () => (await import("./tusi-couple/model")).default,
  "rack-pinion": async () => (await import("./rack-pinion/model")).default,
  "cam-follower": async () => (await import("./cam-follower/model")).default,
};
