// Time map (standard T13): playback speed near a feature. It changes how fast the animation runs through the cycle,
// never the kinematics: the pose is still solved at the true cycle phase u.
import { D2R, TAU } from "./math";

export interface TimeMapSpec {
  /** Span of the cycle phase, degrees (may wrap past 360), and the slow factor inside it (3: three times slower). */
  span?: [number, number];
  /** Several spans at the same slow factor (a feature that comes twice a cycle, a snap there and back). */
  spans?: [number, number][];
  slow: number;
}

/** The spans of a spec as [start, length] in radians, start in 0..2π. */
function spansOf(spec: TimeMapSpec): [number, number][] {
  const list = spec.spans ?? (spec.span ? [spec.span] : []);
  return list.map(([a, b]) => {
    const lo = (((a * D2R) % TAU) + TAU) % TAU;
    const len = (((((b - a) * D2R) % TAU) + TAU) % TAU) || TAU;
    return [lo, len];
  });
}

/**
 * Build the map from playback fraction t (0..1 per cycle) to cycle phase u (radians) and back. Playback time spent in a
 * stretch of phase is proportional to its length times the slow factor there.
 */
export function timeMap(spec: TimeMapSpec | undefined): { uOf: (t: number) => number; tOf: (u: number) => number } {
  const spans = spec && spec.slow !== 1 ? spansOf(spec) : [];
  if (!spec || !spans.length) return { uOf: (t) => (((t % 1) + 1) % 1) * TAU, tOf: (u) => (((u / TAU) % 1) + 1) % 1 };
  const w = spec.slow;
  // the cycle cut at every span edge into pieces, each with its weight (slow inside a span, 1 outside)
  const cuts = new Set<number>([0, TAU]);
  for (const [lo, len] of spans) {
    cuts.add(lo);
    const hi = lo + len;
    if (hi > TAU) cuts.add(hi - TAU);
    else cuts.add(hi);
  }
  const xs = [...cuts].sort((a, b) => a - b);
  const inside = (x: number): boolean => spans.some(([lo, len]) => ((((x - lo) % TAU) + TAU) % TAU) < len);
  const pieces = xs.slice(0, -1).map((a, i) => ({ a, b: xs[i + 1]!, w: inside((a + xs[i + 1]!) / 2) ? w : 1 }));
  const c0: number[] = [];
  let acc = 0;
  for (const p of pieces) {
    c0.push(acc);
    acc += (p.b - p.a) * p.w;
  }
  const total = acc;
  return {
    tOf: (u) => {
      const x = (((u % TAU) + TAU) % TAU);
      const k = pieces.findIndex((p) => x >= p.a && x < p.b);
      const p = pieces[k < 0 ? pieces.length - 1 : k]!;
      return (c0[k < 0 ? pieces.length - 1 : k]! + (x - p.a) * p.w) / total;
    },
    uOf: (t) => {
      const c = ((((t % 1) + 1) % 1) * total);
      let k = pieces.length - 1;
      for (let i = 0; i < pieces.length; i++) if (c < c0[i]! + (pieces[i]!.b - pieces[i]!.a) * pieces[i]!.w) { k = i; break; }
      const p = pieces[k]!;
      return p.a + (c - c0[k]!) / p.w;
    },
  };
}
