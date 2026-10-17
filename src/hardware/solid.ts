// The unit of a built assembly: an extruded outline in body-local millimetres with a z range, riding on a body the
// solver poses. Every solid carries its kind, role, material and detail rung (standard DL1, M10, A13).
import type { Pose, Vec2 } from "../core/geom";
import { rungOf, type RungId } from "../style/detail";
import type { MarkKind, SolidKind, SolidRole } from "../style/kinds";

/** A line drawn on a solid's top face; its kind places it on the detail ladder. */
export interface Mark {
  kind: MarkKind;
  pts: Vec2[];
}

/**
 * How a solid moves when it does not simply ride its body:
 * - geared: turns about a fixed axis at `ratio` times the body's angle (motor pulley, idler);
 * - rolling: turns about a fixed axis by the body's travel along `axis` over radius `r` (linear drive pulleys);
 * - crank / link: the oscillating drive's crank on the motor and its connecting link (standard V5), solved from the
 *   input part's angle about `pivot`.
 */
export type Motion =
  | { type: "geared"; around: Vec2; ratio: number }
  | { type: "rolling"; around: Vec2; axis: Vec2; r: number }
  | { type: "crank" | "link"; motor: Vec2; r: number; L: number; pivot: Vec2; rho: number; off: number };

export interface Solid {
  id: string;
  /** Catalogue name with real sizes (A13); "" for a second item of a listed set. */
  name: string;
  role: SolidRole;
  kind: SolidKind;
  /** The body it rides: a model part id or "ground". */
  body: string;
  /** Pose on the body, body-local mm and radians. */
  at: Pose;
  z0: number;
  z1: number;
  outer: Vec2[];
  holes: Vec2[][];
  marks: Mark[];
  /** Explode level after the rigid explode pass (E1); before it, `span` may give a range. */
  ex: number;
  /** Pre-explode level range of a solid that spans several levels (a post, an axle, a spacer). */
  span?: [number, number];
  /** Solids with the same group move as one body in the explode (E2, E8): a screw, a stepped shaft. */
  group?: string;
  joints: string[];
  detail: RungId;
  mat?: string;
  /** Bore and outside Ø of round parts. */
  d?: number;
  D?: number;
  /** Nominal thread of a threaded part (M size). */
  thread?: number;
  /** z range of the drawn thread on a shank or shaft. */
  threadZ?: [number, number];
  /** Locking method of a threaded fastener (M13). */
  lock?: string;
  /** Bearing closure (6.2). */
  closure?: "open" | "shield" | "seal";
  /** Sits inside another part's bore (drawn without its own hidden-line copy). */
  inset?: boolean;
  /** The input shaft cap: the one accent (L4). */
  accent?: boolean;
  /** Drawn faint: internals of bought units. */
  faint?: boolean;
  /** Drawn see-through: it covers a working zone of the mechanism (L5), set by the see-through stage. */
  seeThrough?: boolean;
  motion?: Motion;
  /** Solids this one may overlap by design (a spigot in its bridge, a shank in its tapped hole). */
  allow?: string[];
  /** Number in the parts list when one name stands for a set. */
  qty?: number;
  isBase?: boolean;
  /** Head type of a screw head (kind "head"). */
  headKind?: "socket" | "button" | "csk";
  /** A head whose top face is the top of its stack (the renderer draws its socket). */
  headTop?: boolean;
  /** Edge break on the top face, mm (M1); defaults from the form style by kind. */
  chamfer?: number;
  /** Seat of a bearing in its bore (F2), for the audit. */
  seat?: string;
  /** Free text for the audit: why this solid exists. */
  why?: string;
}

export type SolidInit = Partial<Solid> & { kind: SolidKind; outer: Vec2[] };

/** A solid with defaults: ground body, hardware role, no holes or marks, level 0, detail rung from its kind. */
export function solid(id: string, o: SolidInit): Solid {
  const s: Solid = {
    id,
    name: id,
    role: "hw",
    body: "ground",
    at: [0, 0, 0],
    z0: 0,
    z1: 1,
    holes: [],
    marks: [],
    ex: 0,
    joints: [],
    detail: "never",
    ...o,
  };
  if (o.detail === undefined) s.detail = rungOf({ kind: s.kind, role: s.role }).id;
  return s;
}

/** Marks of one kind from point lists. */
export const marks = (kind: MarkKind, ...lists: Vec2[][]): Mark[] => lists.map((pts) => ({ kind, pts }));
