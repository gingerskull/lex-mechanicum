// Time map (standard T13): playback speed near a feature. It changes how fast the animation runs through the cycle,
// never the kinematics: the pose is still solved at the true cycle phase u.
import { D2R, TAU } from "./math";

export interface TimeMapSpec {
  /** Span of the cycle phase, degrees (may wrap past 360), and the slow factor inside it (3: three times slower). */
  span: [number, number];
  slow: number;
}

/**
 * Build the map from playback fraction t (0..1 per cycle) to cycle phase u (radians) and back. Playback time spent in a
 * stretch of phase is proportional to its length times the slow factor there.
 */
export function timeMap(spec: TimeMapSpec | undefined): { uOf: (t: number) => number; tOf: (u: number) => number } {
  if (!spec || spec.slow === 1) return { uOf: (t) => (((t % 1) + 1) % 1) * TAU, tOf: (u) => (((u / TAU) % 1) + 1) % 1 };
  const lo = ((((spec.span[0] * D2R) % TAU) + TAU) % TAU);
  const len = ((((spec.span[1] - spec.span[0]) * D2R) % TAU) + TAU) % TAU || TAU;
  const w = spec.slow;
  const total = TAU - len + len * w; // playback weight of one cycle
  // cumulative weight at phase x measured from the span start, x in 0..2π
  const cum = (x: number): number => (x <= len ? x * w : len * w + (x - len));
  const inv = (c: number): number => (c <= len * w ? c / w : len + (c - len * w));
  return {
    tOf: (u) => {
      const x = ((((u - lo) % TAU) + TAU) % TAU);
      const c0 = cum(0);
      void c0;
      // playback time of phase 0 relative to the span start
      const base = cum((TAU - lo) % TAU);
      return ((((cum(x) - base) / total) % 1) + 1) % 1;
    },
    uOf: (t) => {
      const base = cum((TAU - lo) % TAU);
      const c = ((((t * total + base) % total) + total) % total);
      return (inv(c) + lo) % TAU;
    },
  };
}
