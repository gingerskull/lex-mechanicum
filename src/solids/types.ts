// Solid v3 (standard D8): a part is a profile, an operation and a 3D frame. The profile (an outline with its holes) is
// swept by one operation (extrude with taper and twist, revolve, sweep along a path, loft between sections); features
// add or subtract further swept shapes; the frame places the part on its body. Manifold turns the whole into a
// watertight mesh at build time (src/solids/manifold.ts, Node only); a plain extrusion, revolution, sweep or loft with
// no features is shipped as profile and operation instead and turned into triangles in the browser
// (src/solids/tessellate.ts, D10).
import type { Vec2 } from "../core/geom";
import type { Vec3 } from "../core/axis";
import type { Motion } from "../hardware/solid";
import type { RungId } from "../style/detail";
import type { MarkKind, SolidKind, SolidRole } from "../style/kinds";

export type { Vec3 };

/**
 * A placement in 3D: the origin and the directions of the local x and z axes, in the coordinates of the body the part
 * rides (the base's, for a fixed part). Local y is z cross x, so the frame is a proper rotation.
 */
export interface Frame {
  o: Vec3;
  x: Vec3;
  z: Vec3;
}

/** An outline: counter-clockwise outer ring, clockwise hole rings (src/solids/tessellate.ts normalises them). */
export interface Profile {
  outer: Vec2[];
  holes: Vec2[][];
}

/**
 * The operation that gives a profile its third dimension.
 * - extrude: the profile in the xy plane from z = 0 to z = h; `scaleTop` scales it about the origin at the top (a
 *   frustum), `twist` turns it counter-clockwise by that many degrees over h (positive is counter-clockwise, as the
 *   helix convention); `steps` is the number of layers along h (set from the twist, never zero).
 * - revolve: the profile is the half plane section, x the radius (>= 0) and y the height along z, turned a full
 *   turn in `segments` facets (a shaft, a disc, a cone). `segments` is part of the op so Node and the browser facet
 *   it alike; `segmentsFor` in src/solids/tessellate.ts keeps the faceting under the clash tolerance.
 * - sweep: the profile carried along `path` (a polyline in local mm; closed for a loop such as a chain link) on a
 *   rotation-minimising frame, turned by `twist` degrees over the path.
 * - loft: the sections' rings joined layer by layer; section 0 is the solid's profile, the others give the ring at
 *   their height z with the same point count.
 */
export type Op =
  | { op: "extrude"; h: number; scaleTop?: number; twist?: number; steps: number }
  | { op: "revolve"; segments: number }
  | { op: "sweep"; path: Vec3[]; closed?: boolean; twist?: number }
  | { op: "loft"; sections: LoftSection[] };

export interface LoftSection {
  z: number;
  outer: Vec2[];
  holes: Vec2[][];
}

/** A shape added to or cut from the part, in the part's own coordinates. */
export interface Feature {
  mode: "add" | "cut";
  profile: Profile;
  op: Op;
  frame: Frame;
}

/** The three face tags a mesh carries. A hole wall is a wall made by a hole or a cut. */
export const TAG = { cap: 0, wall: 1, hole: 2 } as const;
export type Tag = (typeof TAG)[keyof typeof TAG];

/** A triangle mesh in the part's local frame, with one tag per triangle. Triangles are counter-clockwise from outside. */
export interface MeshData {
  /** x, y, z per vertex, mm. */
  pos: Float32Array;
  /** Three vertex indices per triangle. */
  tri: Uint32Array;
  /** One TAG per triangle. */
  tag: Uint8Array;
}

/** A line drawn on the part's top face (the engraving of a boss ring, a socket), in profile coordinates. */
export interface Mark {
  kind: MarkKind;
  pts: Vec2[];
}

/**
 * The unit of a v3 assembly. `profile`, `op` and `features` give the geometry; `frame` places it on its `body`; the
 * rest is what the build, the checks and the renderer read (the same fields a v1 solid carries, standard DL1, M10,
 * A13).
 */
export interface Solid3 {
  id: string;
  /** Catalogue name with real sizes (A13); "" for a second item of a listed set. */
  name: string;
  role: SolidRole;
  kind: SolidKind;
  /** The body it rides: a model part id or "ground". */
  body: string;
  /** Placement on the body. */
  frame: Frame;
  /** When the body's pose is a solved frame (src/core/axis.ts Frame3), its key: the part is posed by it every phase. */
  posedBy?: string;
  profile: Profile;
  op: Op;
  features?: Feature[];
  /** A result built outside the operations (a hand-made generator fed through Manifold's ofMesh): used as is. */
  mesh?: MeshData;
  marks: Mark[];
  /** Explode level (E1) and joint membership. */
  ex: number;
  /** The axis the part moves along when exploded (E10): its stack's joint axis; absent for the base z. */
  exAxis?: Vec3;
  joints: string[];
  detail: RungId;
  group?: string;
  mat?: string;
  motion?: Motion;
  closure?: "open" | "shield" | "seal";
  headKind?: "socket" | "button" | "csk";
  chamfer?: number;
  /** Nominal thread, the range of the drawn thread along the part's axis and its lead (a screw, a worm). */
  thread?: { m: number; z0: number; z1: number; lead?: number };
  /** A stretched member's two solved points: its unit-length profile spans them. */
  stretch?: [string, string];
  /** A deforming member: its profile is made again each frame from the solved state, same point count per ring. */
  deform?: boolean;
  /** A posed part whose end reaches a world point each frame. */
  reach?: { to: Vec3; end: 0 | 1 };
  flags: { inset?: boolean; accent?: boolean; faint?: boolean; isBase?: boolean; headTop?: boolean; seeThrough?: boolean };
  /**
   * Lifted 2.5D solids only (src/solids/lift.ts): the plane convention of the body's 2D pose when the part's axis is
   * x, y or posed (src/core/axis.ts). A solid the new builders make has none; its frame says everything.
   */
  legacyAxis?: "x" | "y" | "p";
  /** Sizes of round parts and free text for the audit. */
  d?: number;
  D?: number;
  why?: string;
}

/** True when the part is a plain sweep of its profile: it ships as profile and operation (D10). */
export const isPlain = (s: Pick<Solid3, "features" | "mesh">): boolean => !s.mesh && !(s.features && s.features.length);
