// The escapement's wheel, found by simulation (the anchor and the lever escapement share it). The pallets are driven
// (their angle about the pallet pivot is a function of the cycle phase); the escape wheel, centred on the origin and
// urged forward (counter-clockwise) by its train, is moved forward at a limited speed as far as the pallets let it,
// and pushed back where a pallet moves into a tooth (the recoil). Teeth and pallets are convex polygons, tested by
// separating axes. The table holds the wheel angle over one cycle, after the motion has settled into its loop.
import { TAU, type Vec2 } from "../../core/geom";

export interface EscapeSpec {
  /** Teeth on the wheel. */
  n: number;
  /** One tooth, convex, in the wheel's frame with its tip at angle 0. */
  tooth: Vec2[];
  /** Root radius: no pallet corner may go inside it. */
  rRoot: number;
  /** The pallets, convex, in the ground frame at pallet angle 0. */
  pallets: Vec2[][];
  /** Pallet pivot. */
  pivot: Vec2;
  /** Pallet angle at cycle phase u. */
  phi(u: number): number;
  /** Steps per cycle, the wheel's top speed per step (rad), cycles run before the recorded one. */
  steps?: number;
  dmax?: number;
  settle?: number;
}

const rot = (p: Vec2, a: number, c: Vec2): Vec2 => {
  const co = Math.cos(a);
  const si = Math.sin(a);
  const x = p[0] - c[0];
  const y = p[1] - c[1];
  return [c[0] + x * co - y * si, c[1] + x * si + y * co];
};

/** Separating-axis test of two convex polygons; touching is not overlapping. */
export function overlap(a: Vec2[], b: Vec2[]): boolean {
  for (const poly of [a, b])
    for (let i = 0; i < poly.length; i++) {
      const p = poly[i]!;
      const q = poly[(i + 1) % poly.length]!;
      const l = Math.hypot(q[1] - p[1], p[0] - q[0]);
      if (l < 1e-9) continue;
      const ax: Vec2 = [(q[1] - p[1]) / l, (p[0] - q[0]) / l];
      let a0 = Infinity;
      let a1 = -Infinity;
      let b0 = Infinity;
      let b1 = -Infinity;
      for (const v of a) {
        const d = v[0] * ax[0] + v[1] * ax[1];
        a0 = Math.min(a0, d);
        a1 = Math.max(a1, d);
      }
      for (const v of b) {
        const d = v[0] * ax[0] + v[1] * ax[1];
        b0 = Math.min(b0, d);
        b1 = Math.max(b1, d);
      }
      if (a1 <= b0 + 1e-6 || b1 <= a0 + 1e-6) return false;
    }
  return true;
}

/** The wheel angle at u = 2π i / steps, i = 0..steps, over one settled cycle, and the advance per cycle. */
export function escapeTable(o: EscapeSpec): { tab: number[]; advance: number } {
  const S = o.steps ?? 1440;
  const dmax = o.dmax ?? (0.2 * Math.PI) / 180;
  const pitch = TAU / o.n;
  const back = 0.02 * (Math.PI / 180);
  const hit = (w: number, pals: Vec2[][], th: number[]): boolean => {
    for (let i = 0; i < pals.length; i++) {
      const pl = pals[i]!;
      const k0 = Math.ceil((th[i]! - 0.6 * pitch - w) / pitch);
      const k1 = Math.floor((th[i]! + 0.6 * pitch - w) / pitch);
      for (let k = k0 - 1; k <= k1 + 1; k++) {
        const a = w + k * pitch;
        if (overlap(o.tooth.map(([x, y]): Vec2 => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)]), pl)) return true;
      }
    }
    return false;
  };
  let w = 0;
  const tab: number[] = [];
  const cycles = (o.settle ?? 4) + 1;
  for (let k = 0; k < cycles * S; k++) {
    const phi = o.phi((TAU * (k % S)) / S);
    const pals = o.pallets.map((pl) => pl.map((p) => rot(p, phi, o.pivot)));
    for (const pl of pals) for (const p of pl) if (Math.hypot(p[0], p[1]) < o.rRoot) throw new Error("escapement: a pallet reaches inside the root circle");
    const th = pals.map((pl) => Math.atan2(pl.reduce((s, p) => s + p[1], 0), pl.reduce((s, p) => s + p[0], 0)));
    let wn = w + dmax;
    let tries = 0;
    while (hit(wn, pals, th)) {
      wn -= back;
      if (++tries > 2000) throw new Error(`escapement: the wheel jams at step ${k}`);
    }
    w = wn;
    if (k >= (cycles - 1) * S) tab.push(w);
  }
  // the advance is a whole number of half pitches (the wheel locks in the same places every cycle)
  const advance = Math.round((2 * (w - tab[0]!)) / pitch) * (pitch / 2);
  // the recorded cycle closes on itself one advance on: the last entry is the first moved on, exactly
  tab.push(tab[0]! + advance);
  return { tab, advance };
}

/** The wheel angle at phase u (any number of cycles on), interpolated from the table. */
export function wheelAt(t: { tab: number[]; advance: number }, u: number): number {
  const S = t.tab.length - 1;
  const c = Math.floor(u / TAU + 1e-12);
  const f = Math.min(S, Math.max(0, (u / TAU - c) * S));
  const i = Math.min(S - 1, Math.floor(f));
  return t.tab[i]! + (t.tab[i + 1]! - t.tab[i]!) * (f - i) + c * t.advance;
}
