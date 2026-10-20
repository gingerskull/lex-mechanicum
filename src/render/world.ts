// World solids of one frame: every packed solid posed at u, its z range moved by the explode, its outlines in world mm.
// Local geometry is unpacked once per session (Prepared); a frame only transforms it. A solid on an x or y axis
// (src/core/axis.ts) is posed in its own plane; the explode lifts it along the base z like every other solid.
import { boxOf, toWorld, type Axis, type Vec3 } from "../core/axis";
import { TAU, offsetPoly, type Pose, type Vec2 } from "../core/geom";
import { shapeAt, solidPose, type PartIndex } from "../assemble/pose";
import type { MechanismModel, Solved } from "../model/types";
import { axisOfPacked, ringsOf, hasFlag, type Package, type PackedSolid } from "../package/format";
import type { MarkKind } from "../style/kinds";
import { FORM } from "../style/form";

export interface Prepared {
  s: PackedSolid;
  axis: Axis;
  /** A tapered solid, or a helical one whose outline turns along it (src/core/spatial.ts): its ends differ. */
  mods: boolean;
  /** A helical solid that winds too far to turn its outline (a screw, a worm): its lead, drawn as thread marks. */
  threadLead: number | null;
  /** A member whose outline changes over the cycle: stretched between two points, or deforming (src/model/types.ts). */
  dyn: "stretch" | "deform" | null;
  outer: Vec2[];
  holes: Vec2[][];
  marks: { kind: MarkKind; pts: Vec2[] }[];
  /** Chamfer rings just inside the top face edges (M1), local mm. */
  edges: Vec2[][] | null;
  base: boolean;
  inset: boolean;
  accent: boolean;
  faint: boolean;
  seeThrough: boolean;
  headTop: boolean;
}

const toVec = (a: Float32Array): Vec2[] => {
  const out: Vec2[] = [];
  for (let i = 0; i < a.length; i += 2) out.push([a[i]!, a[i + 1]!]);
  return out;
};

function bounds(P: Vec2[]): [number, number, number, number] {
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  for (const [x, y] of P) {
    if (x < x0) x0 = x;
    if (x > x1) x1 = x;
    if (y < y0) y0 = y;
    if (y > y1) y1 = y;
  }
  return [x0, y0, x1, y1];
}

/** The edge break drawn just inside each edge of a top face, sized per kind by the form style. */
function edgeBreak(s: PackedSolid, outer: Vec2[], holes: Vec2[][]): Vec2[][] | null {
  const C = FORM.chamfer as Record<string, number>;
  const c = (s.chamfer ?? C[s.headKind ?? s.kind] ?? 0) * FORM.chamfer.scale;
  if (!c) return null;
  const [x0, y0, x1, y1] = bounds(outer);
  if (Math.min(x1 - x0, y1 - y0) < 6 * c) return null;
  return [
    offsetPoly(outer, -c),
    ...holes.filter((h) => { const b = bounds(h); return Math.min(b[2] - b[0], b[3] - b[1]) > 4 * c; }).map((h) => offsetPoly(h, c)),
  ];
}

/** A helical solid whose outline turns at most a quarter turn along it is drawn turning (a helical gear's teeth). */
const twisted = (s: PackedSolid): boolean => s.helix !== undefined && Math.abs((TAU * (s.z1 - s.z0)) / s.helix) <= Math.PI / 2;

/** The scale and turn of a solid's outline at w along its axis (1 and 0 for a solid with no modifier). */
export function modAt(p: Prepared, w: number): [number, number] {
  if (!p.mods) return [1, 0];
  const s = p.s;
  const t = (w - s.z0) / (s.z1 - s.z0 || 1);
  return [1 + ((s.taper ?? 1) - 1) * t, s.helix !== undefined && twisted(s) ? (TAU * (w - s.z0)) / s.helix : 0];
}

/** The pose of a solid's outline at w along its axis: its pose with the outline scaled and turned there. */
export function poseAt(p: Prepared, pose: Pose, w: number): [number, number, number, number] {
  const [k, a] = modAt(p, w);
  return [pose[0], pose[1], Math.cos(pose[2] + a) * k, Math.sin(pose[2] + a) * k];
}

/** A local point at w along the axis, posed in the solid's plane. */
export const pointAt = (P: [number, number, number, number], [x, y]: Vec2): Vec2 => [P[0] + P[2] * x - P[3] * y, P[1] + P[3] * x + P[2] * y];

export function prepare(pkg: Package): Prepared[] {
  return pkg.solids.map((s) => {
    const r = ringsOf(s);
    const outer = toVec(r.outer);
    const holes = r.holes.map(toVec);
    return {
      s,
      outer,
      holes,
      marks: r.marks.map((m) => ({ kind: m.kind, pts: toVec(m.pts) })),
      // a member that changes shape draws no edge break: its outline is new each frame
      edges: s.stretch || hasFlag(s, "deform") ? null : edgeBreak(s, outer, holes),
      axis: axisOfPacked(s),
      mods: s.taper !== undefined || twisted(s),
      threadLead: s.helix !== undefined && !twisted(s) ? s.helix : null,
      dyn: s.stretch ? "stretch" : hasFlag(s, "deform") ? "deform" : null,
      base: hasFlag(s, "isBase"),
      inset: hasFlag(s, "inset"),
      accent: hasFlag(s, "accent"),
      faint: hasFlag(s, "faint"),
      seeThrough: hasFlag(s, "seeThrough"),
      headTop: hasFlag(s, "headTop"),
    };
  });
}

export interface World {
  p: Prepared;
  /** Set for an x or y solid (its prepared axis), unset for z. */
  axis?: "x" | "y";
  /** Pose in the solid's plane; for an x or y solid lifted by the explode. */
  pose: Pose;
  /** Exploded z range: of the extrusion for a z solid, of the world box for an x or y solid. */
  z0: number;
  z1: number;
  /** Thread range along the solid's axis, exploded for a z solid. */
  thr: [number, number] | null;
  /** The outline posed in the solid's plane, world mm (for an x or y solid its v coordinate is z, exploded). */
  outer: Vec2[];
  holes: Vec2[][];
  c: Vec2;
  /** Plan bounding box (x0, y0, x1, y1). */
  bb: [number, number, number, number];
  /** An x or y solid: its extent along its axis, world mm. */
  along?: [number, number];
  /** A stretched or deforming member: its local outline in this frame (its items are refreshed from it). */
  local?: Vec2[];
}

/** The world points of an outline posed in a solid's plane, at `w` along its axis. */
export const outline3 = (w: Pick<World, "p" | "outer">, at: number): Vec3[] => w.outer.map((q) => toWorld(w.p.axis, q, at));

const xf = (pts: Vec2[], [x, y, a]: Pose): Vec2[] => {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return pts.map(([px, py]): Vec2 => [x + px * c - py * s, y + px * s + py * c]);
};

export const worldPts = xf;

/** The far end's outline of a tapered or helical solid, posed. */
const far = (p: Prepared, pose: Pose): Vec2[] => {
  const P = poseAt(p, pose, p.s.z1);
  return p.outer.map((q) => pointAt(P, q));
};

export function worldSolids(
  prepared: Prepared[],
  model: MechanismModel,
  parts: PartIndex,
  s: Solved,
  u: number,
  explode: number,
  keep: (p: Prepared) => boolean,
): World[] {
  const out: World[] = [];
  const gap = FORM.explode.gap * explode;
  for (const p of prepared) {
    if (!keep(p)) continue;
    const pose = solidPose(model, parts, p.s, s, u);
    if (!pose) continue;
    const dz = gap * p.s.ex;
    if (p.axis !== "z") {
      // the plane's v is up: the explode lifts the pose in the plane, not the extent along the axis
      const lifted: Pose = [pose[0], pose[1] + dz, pose[2]];
      const outer = xf(p.outer, lifted);
      // a tapered or helical solid's far outline differs: the box holds both ends
      const B = boxOf(p.axis, p.mods ? [...outer, ...far(p, lifted)] : outer, p.s.z0, p.s.z1);
      const c = toWorld(p.axis, [lifted[0], lifted[1]], (p.s.z0 + p.s.z1) / 2);
      out.push({ p, axis: p.axis, pose: lifted, z0: B[2], z1: B[5], thr: p.s.thr ? [p.s.thr[1], p.s.thr[2]] : null, outer, holes: p.holes.map((h) => xf(h, lifted)), c: [c[0], c[1]], bb: [B[0], B[1], B[3], B[4]], along: [p.s.z0, p.s.z1] });
      continue;
    }
    // a stretched or deforming member takes its outline of this frame
    const local = p.dyn ? shapeAt(parts, { outer: p.outer, stretch: p.s.stretch, deform: p.dyn === "deform", body: p.s.body }, s) : null;
    const outer = xf(local ?? p.outer, pose);
    out.push({
      ...(local ? { local } : {}),
      p,
      pose,
      z0: p.s.z0 + dz,
      z1: p.s.z1 + dz,
      thr: p.s.thr ? [p.s.thr[1] + dz, p.s.thr[2] + dz] : null,
      outer,
      holes: p.holes.map((h) => xf(h, pose)),
      c: [pose[0], pose[1]],
      bb: bounds(p.mods ? [...outer, ...far(p, pose)] : outer),
    });
  }
  return out;
}
