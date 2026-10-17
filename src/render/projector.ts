// The view (standard L7): tilt from 0° (true plan) to 88° (side elevation) about the x axis, no sideways shear. A point
// (X, Y, z) in mm projects to (ox + s X, oy - s (Y cos t + z sin t)) in CSS px; for one z that is an affine map, so a
// face can be drawn from its body-local path with one transform.
import type { Affine } from "./canvas";

export interface View {
  /** Degrees, 0 (plan) to 88 (side). */
  tilt: number;
}

export interface Projector {
  /** px per mm. */
  s: number;
  ct: number;
  st: number;
  /** Painter key of a point: smaller is farther back. */
  key(X: number, Y: number): number;
  P(X: number, Y: number, z: number): [number, number];
  /** The map from world mm at height z to CSS px. */
  affine(z: number): Affine;
}

export interface Bounds2 {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export const MAX_TILT = 88;

export function projector(view: View, size: { w: number; h: number }, b: Bounds2, z: [number, number], pad: number): Projector {
  const t = (Math.min(MAX_TILT, Math.max(0, view.tilt)) * Math.PI) / 180;
  const ct = Math.cos(t);
  const st = Math.sin(t);
  let y0 = Infinity;
  let y1 = -Infinity;
  for (const Y of [b.minY, b.maxY]) for (const zz of z) {
    const v = Y * ct + zz * st;
    y0 = Math.min(y0, v);
    y1 = Math.max(y1, v);
  }
  const s = Math.min((size.w - 2 * pad) / (b.maxX - b.minX || 1), (size.h - 2 * pad) / (y1 - y0 || 1));
  const ox = size.w / 2 - (s * (b.minX + b.maxX)) / 2;
  const oy = size.h / 2 + (s * (y0 + y1)) / 2;
  return {
    s,
    ct,
    st,
    key: (_X, Y) => -Y * (st / Math.max(0.05, ct)),
    P: (X, Y, zz) => [ox + s * X, oy - s * (Y * ct + zz * st)],
    affine: (zz) => [s, 0, 0, -s * ct, ox, oy - s * zz * st],
  };
}
