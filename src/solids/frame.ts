// Frames in 3D: the placement of a part on its body as an origin and two axes. Matrices are column-major 4 x 4 (the
// layout of Manifold's transform and of WebGL uniforms).
import type { Frame, Vec3 } from "./types";

/** Sixteen numbers, column-major. */
export type Mat4 = [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number];

export const IDENTITY: Frame = { o: [0, 0, 0], x: [1, 0, 0], z: [0, 0, 1] };

export const cross = (a: Vec3, b: Vec3): Vec3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export const dot = (a: Vec3, b: Vec3): number => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const norm = (a: Vec3): Vec3 => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};

/** The local y axis of a frame. */
export const frameY = (f: Frame): Vec3 => cross(f.z, f.x);

/** A frame at (x, y, z) turned by `deg` degrees (counter-clockwise) about the z axis. */
export function atPose(x: number, y: number, z: number, deg = 0): Frame {
  const a = (deg * Math.PI) / 180;
  return { o: [x, y, z], x: [Math.cos(a), Math.sin(a), 0], z: [0, 0, 1] };
}

/** The frame's matrix: columns x, y, z, origin. */
export function mat4(f: Frame): Mat4 {
  const y = frameY(f);
  return [f.x[0], f.x[1], f.x[2], 0, y[0], y[1], y[2], 0, f.z[0], f.z[1], f.z[2], 0, f.o[0], f.o[1], f.o[2], 1];
}

/** A direction of the frame (no origin) in the parent's coordinates. */
export function direction(f: Frame, v: Vec3): Vec3 {
  const y = frameY(f);
  return [f.x[0] * v[0] + y[0] * v[1] + f.z[0] * v[2], f.x[1] * v[0] + y[1] * v[1] + f.z[1] * v[2], f.x[2] * v[0] + y[2] * v[1] + f.z[2] * v[2]];
}

/** A local point in the parent's coordinates. */
export function apply(f: Frame, p: Vec3): Vec3 {
  const d = direction(f, p);
  return [f.o[0] + d[0], f.o[1] + d[1], f.o[2] + d[2]];
}

/** `a` placed in `b`: the frame that takes a local point of `a` to the coordinates `b` lives in. */
export function compose(b: Frame, a: Frame): Frame {
  return { o: apply(b, a.o), x: direction(b, a.x), z: direction(b, a.z) };
}

/** Rounds a frame for storage: origins to 1e-4 mm and directions to 1e-6, so the stored value is the same everywhere. */
export function rounded(f: Frame): Frame {
  const r = (n: number, k: number) => Math.round(n * k) / k + 0;
  const v = (a: Vec3, k: number): Vec3 => [r(a[0], k), r(a[1], k), r(a[2], k)];
  return { o: v(f.o, 1e4), x: v(f.x, 1e6), z: v(f.z, 1e6) };
}
