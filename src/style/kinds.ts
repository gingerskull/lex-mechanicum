// The names the detail ladder selects on: solid kinds, roles, mark kinds and render effects. Primitives and rules tag
// what they make with these (standard DL1); the renderer asks the ladder whether to draw them.

/** The roles of the part family. */
export const PART_ROLES = ["driver", "link", "link2", "output", "ground", "pin", "trace"] as const;
export type Role = (typeof PART_ROLES)[number];

/** Roles a solid may carry: a part role, or hardware and bearings added by the build. */
export const SOLID_ROLES = [...PART_ROLES, "hw", "bearing"] as const;
export type SolidRole = (typeof SOLID_ROLES)[number];

/** What a solid is, as set by the primitive or rule that makes it (standard Appendix B). */
export const SOLID_KINDS = [
  // the mechanism and the frame
  "part", "base", "plate", "bracket", "housing", "bridge", "standoff", "foot",
  // joint main hardware
  "shaft", "shank", "head", "bearing", "bushing", "roller", "tube", "key",
  // bought units and the drive
  "motor", "pulley", "belt",
  // inside bought units
  "bearingBalls", "bearingCage", "motorInternal",
  // stack hardware inside a joint
  "spacer", "washer", "thrustWasher", "waveWasher", "sleeve", "shim", "circlipInternal",
  // service and sensing
  "nipple", "felt", "wiper", "flag", "sensor", "terminalBlock", "cableClip", "lead",
  // retention and adjustment
  "circlipExternal", "retainerPlate", "nut", "setScrew", "collar", "eccentric", "gib", "stop", "bumper", "spring",
  "wearStrip", "dowel", "spigot",
  // decoration on the themed scenery of a seasonal mechanism (mouldings, rosettes, beads, a carved bat)
  "ornament",
] as const;
export type SolidKind = (typeof SOLID_KINDS)[number];

/** What an engraved or drawn mark on a top face is. */
export const MARK_KINDS = [
  // manufacturing marks
  "chamfer", "boreEntry", "headFlute", "hexSocket", "knurl", "keyway", "thread",
  // service and timing
  "oilSink", "timing",
  // form: engraved paths, the base scale, boss rings, base circles, index lines
  "engrave", "scale", "boss", "index",
  // decoration on a seasonal mechanism's scenery: carved lines and features, and fill patterns (quilting, hatching)
  "carve", "quilt",
] as const;
export type MarkKind = (typeof MARK_KINDS)[number];

/** Render effects the ladder can switch off. */
export const EFFECTS = [
  "grain", // paper tooth
  "wallShade", // stepped ink shade on side walls
  "fullDpr", // device pixel ratio above 1
  "rolePatterns", // role surface patterns
  "hiddenLines", // dashed copies of covered edges
  "deepLayers", // depth layers beyond the nearest two
] as const;
export type Effect = (typeof EFFECTS)[number];
