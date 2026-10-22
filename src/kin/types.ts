// The record v3 `kin` block (data/catalog/record-spec.md, "Record v3"), as the kinematic library reads it.
// Shapes are opaque here: the catalogue validator owns them. Numbers in positions, axes and block inputs may be
// parameter expressions (a string such as "a" or "2*b+3"), so a control that changes a dimension moves the geometry.

export type Num = number | string;
export type Vec = Num[]; // [x, y] or [x, y, z]; z defaults to 0

export interface Frame {
  o?: Vec;
  /** The record spec's name for `o`. */
  origin?: Vec;
  rot?: Vec; // degrees, x then y then z
  /** Instead of rot: the frame's z axis and a direction its x is made square to (either may hold expressions). */
  z?: Vec;
  x?: Vec;
}

export interface KinBody {
  id: string;
  role: string;
  shape?: Record<string, unknown>;
  at?: { joint?: string; point?: string; frame?: Frame };
  frame?: Frame; // pose of the body's own frame in the reference configuration; default: its `at` joint, else the world
  /**
   * Fixed to the ground although joints name it: it never moves and counts as ground (a ground link drawn as a link,
   * as a Bennett loop's fourth link; a stationary gear in mesh).
   */
  fixed?: boolean;
  /** n-fold rotational symmetry about its axis (a wheel's slots, a gear's teeth z): the cycle repeats modulo 2π/n (K2). */
  symmetry?: number;
  /** The body moves by instant drops (an escapement's wheel): its points may jump between samples by design. */
  drops?: boolean;
  /** Bodies this one lies above in its stack (a rod pinned down onto blocks that run in a plate's grooves): a placement hint. */
  above?: string[];
}

export type JointType =
  | "revolute"
  | "prismatic"
  | "cylindrical"
  | "screw"
  | "pin-in-slot"
  | "gear-mesh"
  | "cam-contact"
  | "belt"
  | "rolling"
  | "spherical"
  | "universal"
  | "planar"
  | "flexure";

export interface KinJoint {
  id: string;
  type: JointType;
  a: string;
  b: string;
  at: Vec; // world position in the reference configuration (the drivers' defaults)
  axis?: Vec; // world axis in the reference configuration
  limits?: [number, number];
  // screw
  lead?: Num;
  hand?: "right" | "left";
  ball?: boolean;
  // universal: the second shaft axis and the cross arm each body carries (perpendicular to its shaft)
  axis2?: Vec;
  pinA?: Vec;
  pinB?: Vec;
  homokinetic?: boolean;
  // gear-mesh, rolling, belt: tooth counts or a ratio (angle of b per angle of a, signed), crossed axes, pitch radii
  za?: Num;
  zb?: Num;
  ratio?: Num;
  internal?: boolean;
  crossed?: boolean;
  /** gear-mesh inside a planetary: the body (carrier) whose turn is subtracted from both gears' turns. */
  carrier?: string;
  radiusA?: Num; // pitch radius of a (for a rack: the pinion's), mm
  radiusB?: Num;
  ncg?: { kind: "ellipse"; e: Num; phase?: Num };
  ca?: Vec; // optional axis points whose distance the mesh keeps constant
  cb?: Vec;
  // pin-in-slot: a carries the pin (at), b carries the slot, given by two points in the reference configuration
  slot?: {
    from?: Vec;
    to?: Vec;
    /** n equal slots about the wheel axis through `center` (a Geneva wheel): the pin may be in any of them */
    repeat?: number;
    center?: Vec;
    /** A curved slot instead: an arc about `center` (reference world) of `radius` (an expansion link). */
    arc?: { center: Vec; radius: Num; from?: Num; to?: Num };
  };
  // cam-contact: the pitch radius of the cam as a function of its angle, and the follower kind
  follower?: "roller" | "flat" | "knife";
  // flexure
  neck?: Record<string, unknown>;
  // cam-contact: the cam's schedule (spans in degrees), lift, base (or prime) radius, offset and its angle at the reference
  cam?: { schedule: { kind: "rise" | "return" | "dwell"; span: Num; law?: string }[]; lift: Num; rb: Num; e?: Num; theta0?: Num; /** "barrel": the follower runs along the cam's axis at the pitch radius rb (a barrel cam's groove). */ form?: "plate" | "barrel" };
  /** The joint is engaged only while this driver is inside [lo, hi] degrees (mod 360): a Geneva pin in its slot. */
  active?: { driver: string; lo: number; hi: number };
}

export interface KinParam {
  id: string;
  value: number;
  unit?: string;
  min?: number;
  max?: number;
  note?: string;
}

export interface KinDesign {
  id: string;
  options: string[];
  value: string;
}

export interface KinDriver {
  id: string;
  joint?: string;
  kind: "rotary" | "oscillating" | "linear" | "manual" | "select";
  range?: [number, number];
  default?: number;
  lo?: number;
  hi?: number;
  /** Rotary and oscillating: turns per cycle (default 1; an integer keeps K2) and a phase offset, degrees. */
  speed?: number;
  phase?: number;
  /**
   * Joint motion per unit of the driver's value (degrees or mm per unit, default 1): a driver read in its own units, a
   * die position from -1 to +1 that turns a reverse arm 20 degrees per unit.
   */
  scale?: number;
  /** A selector's named options, each setting values of other drivers and params. */
  options?: Record<string, { drivers?: Record<string, number>; params?: Record<string, number> }> | { id: string; drivers?: Record<string, number>; params?: Record<string, number> }[];
  value?: string; // a selector's current option
  /** Set by the cycle through a block (a target path and inverse kinematics), not applied as a joint motion. */
  cycle?: { from?: string; note?: string };
}

export interface SolveStep {
  block: string;
  id: string;
  in?: Record<string, unknown>;
  branch?: string;
  out?: string | string[] | Record<string, string>;
}

export interface KinPoint {
  id: string;
  body: string;
  local: Vec;
}

export interface KinOutput {
  id: string;
  of: string;
  kind: "angle" | "position" | "speed-ratio" | "path";
  unit?: string;
  /** An angle at the point `of` between the rays to the points `from` and `to` (0 to 180 degrees): a transmission angle. */
  from?: string;
  to?: string;
  /** An angle less another angle output (degrees, wrapped to ±180): a lead or lag. */
  minus?: string;
  /**
   * A point's position as one number: its world `x`, `y` or `z` (negated with a minus, a mirrored part read the same way
   * round), or its distance (`radius`) from the point `relativeTo` (the world origin without one); or, given as a
   * direction (world mm), the point's position projected on it (a coordinate along a slide). Without an axis, a point
   * with `relativeTo` gives the distance between the two.
   */
  axis?: "x" | "y" | "z" | "-x" | "-y" | "-z" | "radius" | [number, number, number];
  relativeTo?: string;
  /** A value subtracted from a scalar output (mm or degrees): a height above a line, a datum. */
  datum?: number;
  /** An angle measured from the world x axis (the link's own direction) instead of from the reference pose. */
  absolute?: boolean;
  /** A speed ratio of the point `of` over the point `over` (their speeds), instead of a body's turn per input. */
  over?: string;
}

export interface Kin {
  bodies: KinBody[];
  joints: KinJoint[];
  params?: KinParam[];
  design?: KinDesign[];
  drivers: KinDriver[];
  solve: SolveStep[];
  points?: KinPoint[];
  outputs?: KinOutput[];
  fallback?: null | { numeric: true; loops: string[][] };
  timeMap?: { feature?: string; slow: number; span: [number, number] };
}

/** Settings the viewer may change: parameters, design choices, selector options, driver defaults. */
export interface Controls {
  params?: Record<string, number>;
  design?: Record<string, string>;
  select?: Record<string, string>;
  /** Values of manual drivers, and defaults of the others. */
  drivers?: Record<string, number>;
}

export interface Pose {
  u: number;
  bodies: Map<string, Xf>;
  points: Map<string, [number, number, number]>;
  /** Named scalars: driver values (deg or mm), block outputs (radians or mm, as the block documents). */
  values: Record<string, number>;
  outputs: Record<string, number | [number, number, number]>;
  /** Block ids that took the numeric fallback this pose. */
  fallback: string[];
}

import type { Xf } from "./math";
