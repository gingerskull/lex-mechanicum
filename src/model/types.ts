// The model contract: what a mechanism's model.ts provides. Kinematics only; no prose and no style.
import type { Pose, Vec2 } from "../core/geom";

export type { Pose, Vec2 };

export type InputKind = "rotary" | "oscillating" | "linear" | "manual";
export type Role = "driver" | "link" | "output" | "ground" | "pin" | "trace";
/** Detail ladder rung; "never" is never drawn. */
export type Rung = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "never";

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
  /** Integer layer, LAYER mm apart; z0 = layer · LAYER. */
  layer: number;
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
  detail?: Rung;
}
