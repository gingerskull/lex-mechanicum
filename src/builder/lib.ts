// Helpers every kit shares: catalogue sizing of a stack (A3), the local build frame, and naming.
import { BEARINGS, BEARING_WALL, bearingFor, type Bearing } from "../hardware/tables";
import type { Solid } from "../hardware/solid";
import { place, type Frame } from "./frames";
import type { Solid3 } from "../solids/types";
import { v3, type Vec3 } from "../kin/math";

/** A member of a stack: a body's part turning on the axis, with its extent along it and the boss that holds the bore. */
export interface Member {
  /** Solid id of the part (a clevis's second half has its own). */
  solid: string;
  body: string;
  /** Extent along the axis, from the stack frame's origin plane. */
  w0: number;
  w1: number;
  /** Boss radius round the axis. */
  R: number;
  /** Turns with the shaft (keyed), else turns free on it. */
  keyed: boolean;
  /** A shim pack between the part and its hub, mm (J9). */
  shim?: number;
  /** The part's name, for notes. */
  name: string;
}

export interface Fit {
  d: number;
  /** Bearing of each member, null where a bushing takes the bore. */
  bearing: (Bearing | null)[];
}

/** Shaft sizes tried, largest first (R2): the standard series, then the miniature bores below it. */
const SIZES = [12, 10, 8, 6, 5, 4, 3];

/**
 * A3: the bore is the largest catalogue bore every boss on the axis can take; each part gets the largest bearing its
 * boss fits with a 1.2 mm wall, else a bronze bushing.
 */
export function fitBore(members: readonly Member[], max = 12): Fit {
  for (const d of SIZES.filter((s) => s <= max)) {
    const b = members.map((m) => bearingFor(d, m.R, Math.max(1, m.w1 - m.w0)));
    if (b.every((x) => x)) return { d, bearing: b };
  }
  // a bushing wall of 1.5 mm where no bearing fits
  for (const d of SIZES.filter((s) => s <= max)) {
    const ok = members.every((m) => bearingFor(d, m.R, m.w1 - m.w0) || m.R >= d / 2 + 1.5 + BEARING_WALL);
    if (ok) return { d, bearing: members.map((m) => bearingFor(d, m.R, m.w1 - m.w0)) };
  }
  const d = 3;
  return { d, bearing: members.map((m) => bearingFor(d, m.R, m.w1 - m.w0)) };
}

/** The bearing sizes that exist for a bore, for tests. */
export const bearingsOfBore = (d: number): Bearing[] => BEARINGS.filter((b) => b.d === d);

/** Builds old-style solids in a joint's local coordinates (z along the axis) and places them on the frame. */
export class Local {
  readonly list: Solid[] = [];
  constructor(
    readonly frame: Frame,
    readonly defaults: { joints: string[]; ex?: number } = { joints: [] },
  ) {}

  add(...s: (Solid | Solid[])[]): Solid[] {
    const flat = s.flat();
    for (const x of flat) {
      x.joints = x.joints.length ? x.joints : [...this.defaults.joints];
      this.list.push(x);
    }
    return flat;
  }

  /** The solids as Solid3 in the world, each on its own body. */
  out(over: Partial<Solid3> = {}): Solid3[] {
    return place(this.frame, this.list, over);
  }
}

/** A point of the axis `w` along it from the frame's origin. */
export const onAxis = (f: Frame, w: number): Vec3 => v3.add(f.o, v3.mul(f.z, w));

/** Title-cases a body id for a name. */
export const titleOf = (id: string): string => id.replace(/[-_]+/g, " ").replace(/^./, (c) => c.toUpperCase());

/** Rounds to half a millimetre, the grid a stack is laid out on. */
export const half = (v: number): number => Math.round(v * 2) / 2;
