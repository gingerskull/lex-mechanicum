// Frames for the 3D hardware builder (standard A18 to A22). Everything is built in the coordinates of the reference
// configuration (every body at the identity, src/kin: Kinematics.referencePose), where a stack along a joint axis is a
// stack along that axis, whatever its direction. `toBody` turns the finished frames into the body-local ones a Solid3
// carries; the kinematic pose of a body (an Xf) then moves a part by its body.
import type { Vec2 } from "../core/geom";
import type { Solid } from "../hardware/solid";
import { apply, compose, cross, dot, norm } from "../solids/frame";
import { liftSolid } from "../solids/lift";
import type { Frame, Solid3 } from "../solids/types";
import { type Mat3, type Vec3, m3, v3, xf, type Xf } from "../kin/math";

export type { Frame, Vec3, Xf };

/** A frame at `o` whose local z is `axis`; its x is `xHint` made perpendicular, else any direction perpendicular to z. */
export function frameAlong(o: Vec3, axis: Vec3, xHint?: Vec3): Frame {
  const z = norm(axis);
  let h: Vec3 = xHint ? norm(xHint) : Math.abs(z[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0];
  if (xHint === undefined) {
    // the perpendicular nearest the world x for a plan axis, else the world-up-perpendicular
    const x = norm(cross(h, z));
    return { o, x, z };
  }
  const k = dot(h, z);
  h = norm([h[0] - k * z[0], h[1] - k * z[1], h[2] - k * z[2]]);
  return { o, x: h, z };
}

/** A frame as an Xf (columns x, y, z). */
export function frameXf(f: Frame): Xf {
  const y = cross(f.z, f.x);
  const R: Mat3 = [f.x[0], y[0], f.z[0], f.x[1], y[1], f.z[1], f.x[2], y[2], f.z[2]];
  return { R, t: [...f.o] };
}

/** The frame of an Xf: where the identity frame goes. */
export function xfFrame(X: Xf): Frame {
  return { o: [...X.t], x: [X.R[0], X.R[3], X.R[6]], z: [X.R[2], X.R[5], X.R[8]] };
}

/** A frame moved by a rigid transform. */
export function moveFrame(f: Frame, X: Xf): Frame {
  return { o: xf.apply(X, f.o), x: xf.dir(X, f.x), z: xf.dir(X, f.z) };
}

/** `a`, given in the coordinates of a parent frame `p`, as a frame in the world. */
export const inWorld = (p: Frame, a: Frame): Frame => compose(p, a);

/** The world frame `w` expressed in a body whose own frame (in the world) is `bodyFrame`. */
export function toBody(bodyFrame: Xf, w: Frame): Frame {
  return moveFrame(w, xf.inv(bodyFrame));
}

/** A Solid3 moved by a rigid transform (its frame only; the geometry stays in its own coordinates). */
export function moveSolid(s: Solid3, X: Xf): Solid3 {
  return { ...s, frame: moveFrame(s.frame, X) };
}

/** Local z of a frame along `axis` offset: the frame shifted `w` along its own z. */
export const shifted = (f: Frame, w: number): Frame => ({ o: [f.o[0] + f.z[0] * w, f.o[1] + f.z[1] * w, f.o[2] + f.z[2] * w], x: f.x, z: f.z });

/**
 * Solids built the old way (a z solid in the joint's own coordinates, extent z0..z1 along the axis) placed on a frame:
 * the joint frame carries them to the world. This is how the primitives of src/hardware serve any axis.
 */
export function place(f: Frame, solids: Solid | readonly Solid[], over: Partial<Solid3> = {}): Solid3[] {
  const list = Array.isArray(solids) ? solids : [solids as Solid];
  return list.map((s) => {
    const l = liftSolid(s);
    return { ...l, ...over, frame: compose(f, l.frame) };
  });
}

/** Rotates a plane point by `a` radians. */
export const rot2 = (p: Vec2, a: number): Vec2 => [p[0] * Math.cos(a) - p[1] * Math.sin(a), p[0] * Math.sin(a) + p[1] * Math.cos(a)];

/** The 2D coordinates of a world point in the plane of a frame (x, y of the frame), and its height along z. */
export function planeCoords(f: Frame, p: Vec3): { uv: Vec2; w: number } {
  const y = cross(f.z, f.x);
  const d = v3.sub(p, f.o);
  return { uv: [dot(d, f.x), dot(d, y)], w: dot(d, f.z) };
}

/** A world point from plane coordinates and a height. */
export const fromPlane = (f: Frame, uv: Vec2, w = 0): Vec3 => apply(f, [uv[0], uv[1], w]);

/** An axis with a fixed sign: its largest component positive, so parallel axes compare equal and a stack has one 'up'. */
export function canon(a: Vec3): Vec3 {
  const u = v3.unit(a);
  const k = Math.abs(u[2]) > 1e-6 ? 2 : Math.abs(u[1]) > 1e-6 ? 1 : 0;
  return u[k]! < 0 ? [-u[0] + 0, -u[1] + 0, -u[2] + 0] : u;
}

/** True when two directions are parallel or antiparallel to within `tol` (the sine). */
export const parallel = (a: Vec3, b: Vec3, tol = 1e-4): boolean => v3.len(v3.cross(v3.unit(a), v3.unit(b))) < tol;

export { m3, v3, xf };
