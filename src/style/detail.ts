// DETAIL: the detail ladder (standard 9b), ordered by what a viewer notices, least first. Passing a rung stops drawing
// everything it selects. Re-ranking a rung is a change to this table only. The dial position is a rung id; "never"
// holds the build itself and is not a rung of the dial.

import type { Effect, MarkKind, SolidKind, SolidRole } from "./kinds";

export type RungId = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "never";

export interface Rung {
  id: RungId;
  name: string; // what stops being drawn, for the bench, the audit and the title block
  drops: {
    kinds?: SolidKind[];
    roles?: SolidRole[];
    marks?: MarkKind[];
    effects?: Effect[];
  };
  // View-aware exceptions (DL3): drawn again whenever explode > 0; skipped at side elevation (draft.sheet.elevationTilt).
  exceptions?: { whenExplode?: "draw"; atSide?: "skip" };
}

export const DETAIL: Rung[] = [
  {
    id: "A",
    name: "Paper grain, bearing balls and cages, motor internals",
    drops: { kinds: ["bearingBalls", "bearingCage", "motorInternal"], effects: ["grain"] },
  },
  {
    id: "B",
    name: "Manufacturing marks",
    drops: { marks: ["chamfer", "boreEntry", "headFlute", "hexSocket", "knurl", "keyway", "thread"] },
    exceptions: { atSide: "skip" },
  },
  {
    id: "C",
    name: "Wall shading, deep depth layers",
    drops: { effects: ["wallShade", "deepLayers"] },
  },
  {
    id: "D",
    name: "Stack hardware inside a joint",
    drops: { kinds: ["spacer", "washer", "thrustWasher", "waveWasher", "sleeve", "shim", "circlipInternal"] },
    exceptions: { whenExplode: "draw" },
  },
  {
    id: "E",
    name: "Service and sensing parts, timing marks",
    drops: {
      kinds: ["nipple", "felt", "wiper", "flag", "sensor", "terminalBlock", "cableClip", "lead"],
      marks: ["oilSink", "timing"],
    },
  },
  {
    id: "F",
    name: "Role surface patterns",
    drops: { effects: ["rolePatterns"] },
  },
  {
    id: "G",
    name: "Hidden lines, full pixel ratio",
    drops: { effects: ["hiddenLines", "fullDpr"] },
  },
  {
    id: "H",
    name: "Retention and adjustment parts",
    drops: {
      kinds: [
        "circlipExternal", "retainerPlate", "nut", "setScrew", "collar", "eccentric", "gib", "stop", "bumper", "spring",
        "wearStrip", "dowel", "spigot",
      ],
    },
  },
];

/** What is always drawn: the mechanism's parts, the frame, every joint's main hardware, the drive, paths, overlays. */
export const NEVER: Rung = { id: "never", name: "The build itself", drops: {} };

/** Rung ids from first dropped to never dropped. */
export const RUNG_ORDER: readonly RungId[] = [...DETAIL.map((r) => r.id), "never"];

/** Something the ladder can place: a solid (kind, role, optional override), a mark or a render effect. */
export type Detailed =
  | { kind: SolidKind; role?: SolidRole; detail?: RungId }
  | { mark: MarkKind }
  | { effect: Effect };

const byId = (id: RungId): Rung => DETAIL.find((r) => r.id === id) ?? NEVER;

/** The rung at which `x` stops being drawn. A solid's own `detail` may only move it up the ladder (DL1). */
export function rungOf(x: Detailed): Rung {
  let found: Rung | undefined;
  if ("mark" in x) found = DETAIL.find((r) => r.drops.marks?.includes(x.mark));
  else if ("effect" in x) found = DETAIL.find((r) => r.drops.effects?.includes(x.effect));
  else {
    const role = x.role;
    found = DETAIL.find((r) => r.drops.kinds?.includes(x.kind) || (role !== undefined && r.drops.roles?.includes(role)));
    if (x.detail && RUNG_ORDER.indexOf(x.detail) > RUNG_ORDER.indexOf(found?.id ?? "never")) return byId(x.detail);
  }
  return found ?? NEVER;
}
