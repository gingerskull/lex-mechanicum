// The orthographic camera of the 3D renderer (style SP10, SD11, standard L7): a turntable orbit about the base's z axis
// that snaps to the named views, plus an auxiliary view straight down any axis. A camera is an orthonormal basis (right,
// up, eye: eye points from the drawing toward the viewer) with a scale and an offset that fit a box to the canvas. A
// world point projects to screen CSS px as x = ox + s (p . right), y = oy - s (p . up), and its depth toward the viewer
// is p . eye; the renderer maps depth to clip z. Pure maths, no DOM: the planner, the annotation and the tests share it.
import type { Vec3 } from "../../solids/types";
import { DRAFT } from "../../style/draft";

const RAD = Math.PI / 180;
const dot = (a: Vec3, b: Vec3): number => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: Vec3, b: Vec3): Vec3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = (a: Vec3): Vec3 => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};

export const NAMED_VIEWS = ["PLAN", "FRONT", "SIDE", "ISOMETRIC", "DIMETRIC"] as const;
export type NamedView = (typeof NAMED_VIEWS)[number];

/** Where the viewer stands: a turntable pose, or straight down an axis (an AUX view). */
export interface Orient {
  /** Degrees about z. */
  yaw: number;
  /** Degrees from plan (0) to side elevation (90); past 90 the orbit goes over the top, and 180 looks up from beneath. */
  tilt: number;
  /** An auxiliary view: the direction from the drawing toward the viewer (any length); yaw and tilt are then derived. */
  aux?: Vec3;
}

export interface Basis {
  right: Vec3;
  up: Vec3;
  eye: Vec3;
}

/** The turntable basis of a yaw and tilt (degrees). At tilt 0 the eye is +z and up is +y turned by yaw. */
export function basisOf(yaw: number, tilt: number): Basis {
  const y = yaw * RAD;
  const t = tilt * RAD;
  const cy = Math.cos(y), sy = Math.sin(y), ct = Math.cos(t), st = Math.sin(t);
  return { right: [cy, sy, 0], up: [-sy * ct, cy * ct, st], eye: [sy * st, -cy * st, ct] };
}

/** The basis looking along an arbitrary direction, with up toward world z (or y where the eye is nearly vertical). */
export function basisFromEye(eyeIn: Vec3): Basis {
  const eye = unit(eyeIn);
  const vertical = Math.abs(eye[2]) > 1 - DRAFT.camera.auxMinCos;
  const up0: Vec3 = vertical ? [0, 1, 0] : [0, 0, 1];
  const right = unit(cross(up0, eye));
  return { right, up: cross(eye, right), eye };
}

export const basisOfOrient = (o: Orient): Basis => (o.aux ? basisFromEye(o.aux) : basisOf(o.yaw, o.tilt));

const wrap360 = (a: number): number => ((a % 360) + 360) % 360;
const angDiff = (a: number, b: number): number => Math.abs(((a - b + 540) % 360) - 180);

/** The turntable pose of a named view. */
export function namedOrient(name: NamedView): Orient {
  const [yaw, tilt] = DRAFT.camera.views[name]!;
  return { yaw, tilt };
}

/** The named view a pose is within the snap angle of, or null. A tilt of 0 reads PLAN whatever the yaw. */
export function snapName(o: Orient): NamedView | null {
  if (o.aux) return null;
  const snap = DRAFT.camera.snap;
  for (const n of NAMED_VIEWS) {
    const [yaw, tilt] = DRAFT.camera.views[n]!;
    if (Math.abs(o.tilt - tilt) > snap) continue;
    if (tilt === 0 || angDiff(o.yaw, yaw) <= snap) return n;
  }
  return null;
}

/** A pose snapped to the named view within reach, else as it is. */
export function snapped(o: Orient): Orient {
  const n = snapName(o);
  return n ? namedOrient(n) : o;
}

/** The title block's VIEW cell for a pose (SD10): a named view, "AUX ⟂ joint" given the joint's name, or "VIEW az/el". */
export function viewLabel(o: Orient, auxName?: string): string {
  if (o.aux && !auxName) {
    // an auxiliary view straight down a world axis is the plan, front or side view
    const e = unit(o.aux);
    for (const n of NAMED_VIEWS) {
      const b = basisOf(...(DRAFT.camera.views[n]! as [number, number]));
      if (n !== "ISOMETRIC" && n !== "DIMETRIC" && dot(e, b.eye) > 0.9999) return n;
    }
  }
  if (o.aux) return `AUX ⟂ ${(auxName ?? "AXIS").toUpperCase()}`;
  const n = snapName(o);
  if (n) return n;
  return `VIEW ${Math.round(wrap360(o.yaw))}/${Math.round(90 - o.tilt)}`;
}

/** Elevation above the horizon (degrees) of a tilt: 90 at plan, 0 at side elevation. */
export const elevationOf = (tilt: number): number => 90 - tilt;

/** An axis-aligned box in world mm: x0, y0, z0, x1, y1, z1. */
export type Box = [number, number, number, number, number, number];

export interface Camera extends Basis {
  /** CSS px per mm. */
  s: number;
  /** Screen position of the world origin, CSS px. */
  ox: number;
  oy: number;
  /** Depth range toward the viewer, mm, padded: depth d maps to clip z = 1 - 2 (d - d0) / (d1 - d0). */
  d0: number;
  d1: number;
}

export interface FitOptions {
  /** CSS px of margin; the default is the style's. */
  pad?: number;
  /** A window of the drawing to magnify (a detail view): world centre and a factor on the fitted scale. */
  window?: { centre: Vec3; scale: number };
  /** Space kept clear on each side, CSS px (the title block, a panel). */
  inset?: { left?: number; right?: number; top?: number; bottom?: number };
}

const corners = (b: Box): Vec3[] => {
  const out: Vec3[] = [];
  for (const x of [b[0], b[3]]) for (const y of [b[1], b[4]]) for (const z of [b[2], b[5]]) out.push([x, y, z]);
  return out;
};

/** The extent of a box in a basis: screen x range, screen y range and depth range, mm. */
export function extent(B: Basis, box: Box): { x: [number, number]; y: [number, number]; d: [number, number] } {
  const x: [number, number] = [Infinity, -Infinity];
  const y: [number, number] = [Infinity, -Infinity];
  const d: [number, number] = [Infinity, -Infinity];
  for (const p of corners(box)) {
    const a = dot(p, B.right), b = dot(p, B.up), c = dot(p, B.eye);
    x[0] = Math.min(x[0], a); x[1] = Math.max(x[1], a);
    y[0] = Math.min(y[0], b); y[1] = Math.max(y[1], b);
    d[0] = Math.min(d[0], c); d[1] = Math.max(d[1], c);
  }
  return { x, y, d };
}

/** The camera that fits `box` into a canvas of w x h CSS px in the given basis (a detail view magnifies a window of it). */
export function fit(B: Basis, w: number, h: number, box: Box, o: FitOptions = {}): Camera {
  const pad = o.pad ?? DRAFT.camera.pad;
  const e = extent(B, box);
  const il = o.inset?.left ?? 0, ir = o.inset?.right ?? 0, it = o.inset?.top ?? 0, ib = o.inset?.bottom ?? 0;
  const aw = Math.max(1, w - 2 * pad - il - ir);
  const ah = Math.max(1, h - 2 * pad - it - ib);
  let s = Math.max(1e-3, Math.min(aw / (e.x[1] - e.x[0] || 1), ah / (e.y[1] - e.y[0] || 1)));
  let cx = (e.x[0] + e.x[1]) / 2;
  let cy = (e.y[0] + e.y[1]) / 2;
  if (o.window) {
    s *= o.window.scale;
    cx = dot(o.window.centre, B.right);
    cy = dot(o.window.centre, B.up);
  }
  const px = pad + il + aw / 2;
  const py = pad + it + ah / 2;
  const m = Math.max(1, (e.d[1] - e.d[0]) * 0.05);
  return { ...B, s, ox: px - s * cx, oy: py + s * cy, d0: e.d[0] - m, d1: e.d[1] + m };
}

/** A world point to CSS px. */
export const project = (C: Camera, p: Vec3): [number, number] => [C.ox + C.s * dot(p, C.right), C.oy - C.s * dot(p, C.up)];

/** A world point's depth toward the viewer, mm. */
export const depthOf = (C: Camera, p: Vec3): number => dot(p, C.eye);

/** The screen direction (CSS px per mm, y down) of a world direction. */
export const screenDir = (C: Camera, v: Vec3): [number, number] => [C.s * dot(v, C.right), -C.s * dot(v, C.up)];

/** The angle (degrees, 0..90) between a direction and the view direction: 0 when it points at the viewer. */
export const angleToEye = (C: Camera, v: Vec3): number => Math.acos(Math.min(1, Math.abs(dot(unit(v), C.eye)))) / RAD;

/** The CSS px of the scale bar of the title block: the drawing's scale against true size on a 96 dpi screen. */
export const SCREEN_PX_PER_MM = 96 / 25.4;
export const scaleOf = (C: Camera): number => C.s / SCREEN_PX_PER_MM;
