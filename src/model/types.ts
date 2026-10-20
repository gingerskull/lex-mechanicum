// The model contract: what a mechanism's model.ts provides. Kinematics only; no prose and no style.
import type { Axis, Frame3 } from "../core/axis";
import type { Pose, Vec2 } from "../core/geom";
import type { RungId } from "../style/detail";
import type { Role } from "../style/kinds";

// Role and the rung ids are the detail ladder's vocabulary (src/style); the model shares them, never redefines them.
export type { Axis, Frame3, Pose, Role, RungId, Vec2 };

export type InputKind = "rotary" | "oscillating" | "linear" | "manual";

export interface Shape {
  outer: Vec2[];
  holes: Vec2[][];
}

/** The solver output for one cycle phase u. */
export interface Solved {
  pts: Record<string, Vec2>;
  poses?: Record<string, Pose>;
  /** Posed frames of members whose axis is none of x, y, z (Part.axis "p", src/core/axis.ts). */
  frames?: Record<string, Frame3>;
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
  /**
   * Integer layer, LAYER mm apart; z0 = layer · LAYER + dz. For a part whose axis is x or y it is only the part's
   * explode level: its plane is placed by `along`.
   */
  layer: number;
  /**
   * The axis the part turns about and is extruded along (src/core/axis.ts): z of the base (the default), or x or y for
   * a part standing out of the plan plane (a shaft in plan, a disc on edge). Its outline, its pose and the solved points
   * it is placed by lie in the plane normal to the axis.
   */
  axis?: Axis | "p";
  /** Axis x, y or p: where the part's extent along its axis starts, world mm (its z0 for a z part). Required then. */
  along?: number;
  /**
   * Axis "p", a posed axis: the key of the solved frame (`solve(u).frames`) whose plane the outline lies in. The part's
   * pose (fixed, at, between) is then a pose within that plane.
   */
  frame?: string;
  /**
   * Solid modifiers (src/core/spatial.ts): `taper`, the outline's scale at the far end (z1) about the solid's origin,
   * so the solid is a frustum (a bevel gear, a cone); `helix`, a lead in mm per turn (+ right hand, - left), so the
   * outline turns 2π (w - z0) / lead along the axis (a helical gear), or, where that would wind more than a quarter
   * turn, the walls carry thread marks at that lead (a screw, a worm).
   */
  taper?: number;
  helix?: number;
  /**
   * Members that change shape over the cycle (cheapest first): `stretch`, a part placed `between` two solved points
   * whose outline is given at unit length along x and stretched to their distance (a rope span, a spring); `deform`,
   * the outline from the solved state each frame, always with the same point count (a flexspline, a belt's wrap); it
   * may return its holes too (`{ outer, holes }`, a band whose inner and outer edges both change), each ring with the
   * point count of the part's shape.
   */
  stretch?: boolean;
  deform?(s: Solved): Vec2[] | Shape;
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
  | { type: "angle"; c: Vec2; a: Vec2; b: Vec2; r: number; key?: string; value?: number; warn?: boolean; z?: number }
  /**
   * A flexure's bend (the neck is drawn rigid): the neck's centre `c`, its direction `a` (radians), length `L` and
   * width `w`, mm, and the angle it is bent through (radians). Drawn as the bent centreline over the stress zone.
   */
  | { type: "bend"; c: Vec2; a: number; L: number; w: number; bend: number; key?: string; z?: number };

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
  /**
   * Crossed-axis meshes (J9): two gear parts on different axes (src/core/axis.ts) that mesh: a bevel or hypoid pair, a
   * worm and its wheel, crossed helical gears. Parallel meshes are read from the parts (J6).
   */
  meshes?: { a: string; b: string; form: "bevel" | "hypoid" | "worm" | "crossed" }[];
  /** Screw joints (J11): the screw part (on an x or y axis), the nut part it drives along that axis, the lead and the kind. */
  screws?: { screw: string; nut: string; lead: number; form: "lead" | "ball" }[];
  /**
   * Flexible members (J12): a roller chain over two sprockets (its links carried round by the solved travel `travel`,
   * mm, at `pitch`), a rope over sheaves (its spans are stretched parts, `spans`; its wraps over the sheaves, `wraps`,
   * fixed arcs, P.ropeWrap), a toothed timing belt over two timing pulleys (P.pulley, tooth counts `z`; the belt's
   * back is the fixed part `band` round the pitch path, its teeth carried round by the solved travel `travel`, mm, at
   * `pitch`, HTD), or a CVT belt between sheave pairs: per shaft its `fixed` half (on the shaft, turning with it) and its
   * `sliding` half (posed by a frame that slides along the shaft, axis "p"), sprung on the belt where `spring` is set,
   * and the belt (`belt`, a deforming part). A chain's and a belt's path starts at the first wheel's tangent
   * point on the span that runs onto it and goes counter-clockwise; the travel grows with the input.
   */
  flexible?: (
    | { form: "chain"; over: [string, string]; travel: string; pitch: number; roller: number }
    | { form: "rope"; over: string[]; spans: string[]; wraps?: string[]; dead?: string; hook?: string; load?: string }
    | { form: "belt"; over: [string, string]; travel: string; pitch: number; band: string }
    | { form: "cvt"; pairs: { fixed: string; sliding: string; spring?: boolean }[]; belt: string }
  )[];
  /** Compliant joints (J13): a flexure neck joining a lever to the ground block it is cut from, its swing range. */
  compliant?: { neck: string; ground: string; lever: string; at: string; range: [number, number] }[];
  /** Detail ladder rung of the whole mechanism; "never" is never dropped. */
  detail?: RungId;
}
