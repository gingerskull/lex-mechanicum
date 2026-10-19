// The model contract: what a mechanism's model.ts provides. Kinematics only; no prose and no style.
import type { Pose, Vec2 } from "../core/geom";
import type { RungId } from "../style/detail";
import type { Role } from "../style/kinds";

// Role and the rung ids are the detail ladder's vocabulary (src/style); the model shares them, never redefines them.
export type { Pose, Role, RungId, Vec2 };

export type InputKind = "rotary" | "oscillating" | "linear" | "manual";

export interface Shape {
  outer: Vec2[];
  holes: Vec2[][];
}

/** The solver output for one cycle phase u. */
export interface Solved {
  pts: Record<string, Vec2>;
  poses?: Record<string, Pose>;
  [k: string]: unknown;
}

/**
 * A part from the part family, in body-local millimetres. Placement, in order of precedence: `fixed`, a pose in
 * `Solved.poses` under the part id, `between` two solved points (local x runs from the first toward the second, plus
 * `off`), or `at` one solved point (angle `spin(s)`, default 0).
 */
export interface Part {
  id: string;
  role: Role;
  /** Integer layer, LAYER mm apart; z0 = layer · LAYER + dz. */
  layer: number;
  /**
   * Plating offset from the layer grid, mm (K1: heights may change, centres may not): a part plated low over a pin
   * shortens the pin's overhang (A9). The explode level stays the layer's.
   */
  dz?: number;
  /**
   * Clevis twin: the id of the part this one pairs with round a pin (A9). It has the same pose, turns with the bolt
   * where its partner anchors it (a plain hole on the shoulder), gets its own bearing on a ground pivot, shares its
   * partner's stops, and rides its partner's body in the build.
   */
  twin?: string;
  thick: number;
  shape: Shape;
  marks: Vec2[][];
  fixed?: Pose;
  between?: [string, string];
  at?: string;
  off?: number;
  spin?(s: Solved): number;
  /** Pins: the number of layers the pin passes through. */
  span?: number;
  /** Pins: cap thickness and overhang above the last layer. */
  th?: number;
  over?: number;
  /** The input shaft cap. */
  accent?: boolean;
  /**
   * Ground pins: how the top of the pivot is held when links sweep over it. "hung": carried from a bridge into the
   * topmost part only, nothing rising from the base (J1, hung); "free": no bridge, the axle stops over its stack
   * (single shear) because a part sweeps over it above. Unset: the rules' bridge where it fits.
   */
  top?: "hung" | "free";
  name?: string;
  /** Links: the modelled pin-to-pin length, checked against the solved points. */
  len?: number;
  /** Gears: tooth count and module. */
  z?: number;
  m?: number;
}

/** Overlay items carry geometry and short keys only; labels and text are formatted by the renderer. */
export type OverlayItem =
  | { type: "axial"; a: Vec2; b: Vec2; key?: string; z?: number }
  | { type: "spin"; c: Vec2; r: number; dir?: 1 | -1; key?: string; z?: number }
  | { type: "angle"; c: Vec2; a: Vec2; b: Vec2; r: number; key?: string; value?: number; warn?: boolean; z?: number };

export interface Plot {
  label: string;
  unit: string;
  f(s: Solved, u: number): number;
}

export interface MechanismModel {
  id: string;
  input: { kind: InputKind; part: string };
  parts: Part[];
  /** u is the cycle phase in 0..2π; continuous, periodic, finite. */
  solve(u: number): Solved;
  /** Solved points whose paths are traced. */
  paths?: string[];
  /** Solved points that show a velocity arrow. */
  vel?: string[];
  /** z of the traced paths, mm. */
  traceZ?: number;
  forces?(s: Solved, u: number): OverlayItem[];
  angles?(s: Solved, u: number): OverlayItem[];
  plot?: Plot;
  /** Cam contacts (J7): the cam part and the follower it drives. Other joints are read from the parts. */
  cams?: { cam: string; follower: string }[];
  /** Detail ladder rung of the whole mechanism; "never" is never dropped. */
  detail?: RungId;
}
