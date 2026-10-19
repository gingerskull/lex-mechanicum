// Non-circular gears (catalogue "non-circular-gears"): two identical elliptical gears, each turning about one focus,
// the foci 2a = 80 apart (a = 40, e = 0.3). The pitch curve about a focus is r(α) = a (1 - e²) / (1 - e cos α), the
// contact is always on the line of centres with r1 + r2 = 2a, and the arcs rolled on the two curves are equal, so the
// driven gear turns once per input turn at a speed w2/w1 = r1/r2 swinging between (1 - e)/(1 + e) = 0.54 and
// (1 + e)/(1 - e) = 1.86. Both gears have 26 teeth spaced equally by arc length along the pitch curve (pitch
// P/26 = 9.45 mm, module about 3, 20° flanks): a tooth is a rack tooth set on the curve's normal (the rack's flank
// angle, the circular gear's involute replaced by straight flanks, a deliberate simplification of the drawing, K6).
// The layout is turned 180° about the middle of the line of centres from the catalogue's (the driver sits at x = 80, the driven gear
// at the origin, both gears' bodies turned by π with it): the same machine, which puts the drive where its bracket clears (K6,
// deliberate). Gear 2 is phased half a pitch, so a tooth of one meets a gap of the other on the line of centres at u = 0, where the
// long radius of gear 1 meets the short radius of gear 2. One cycle is one input turn, and since each gear has a whole
// number of teeth round its perimeter the pair looks the same after it (K2).
// The teeth are cut BACKLASH thinner on each flank, as cut teeth would be: straight-flanked teeth on a changing curve
// are not exactly conjugate, and the model check counts a tooth vertex inside the other gear as an overlap.
import { D2R, TAU, circle, polar, type Vec2 } from "../../core/geom";
import { defineMechanism } from "../../model/define";
import { P } from "../../parts";

export const a = 40;
export const e = 0.3;
export const cd = 2 * a;
export const z = 26;
const p0 = a * (1 - e * e);
const rOf = (al: number) => p0 / (1 - e * Math.cos(al));
const drOf = (al: number) => (-p0 * e * Math.sin(al)) / (1 - e * Math.cos(al)) ** 2;
const alpha = 20 * D2R;
const BACKLASH = 0.22;

/** Cumulative arc length of the pitch curve, α from 0 to π on a fine table; periodic and odd beyond. */
const N = 8000;
const tab: number[] = [0];
for (let i = 1; i <= N; i++) {
  const a0 = ((i - 0.5) / N) * Math.PI;
  tab.push(tab[i - 1]! + Math.hypot(rOf(a0), drOf(a0)) * (Math.PI / N));
}
export const S_PI = tab[N]!;
export const PERIM = 2 * S_PI;
export const pitch = PERIM / z;
export const m = pitch / Math.PI;
/** Arc length from α = 0, any α. */
export function arcOf(al: number): number {
  const k = Math.floor(al / TAU);
  const x = al - k * TAU;
  let s: number;
  if (x <= Math.PI) s = interp(x);
  else s = PERIM - interp(TAU - x);
  return s + k * PERIM;
}
function interp(x: number): number {
  const f = (x / Math.PI) * N;
  const i = Math.min(N - 1, Math.floor(f));
  return tab[i]! + (tab[i + 1]! - tab[i]!) * (f - i);
}
/** α at arc length s from α = 0 (inverse of arcOf). */
export function alphaOf(s: number): number {
  const k = Math.floor(s / PERIM);
  let x = s - k * PERIM;
  const flip = x > S_PI;
  if (flip) x = PERIM - x;
  let lo = 0;
  let hi = N;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (tab[mid]! <= x) lo = mid;
    else hi = mid;
  }
  const f = (x - tab[lo]!) / (tab[lo + 1]! - tab[lo]!);
  const al = ((lo + f) / N) * Math.PI;
  return k * TAU + (flip ? TAU - al : al);
}

/** The pitch point and the outward unit normal at arc length s. */
export function pitchAt(s: number): { p: Vec2; n: Vec2 } {
  const al = alphaOf(s);
  const r = rOf(al);
  const dr = drOf(al);
  const c = Math.cos(al);
  const sn = Math.sin(al);
  const t: Vec2 = [dr * c - r * sn, dr * sn + r * c];
  const L = Math.hypot(t[0], t[1]);
  return { p: [r * c, r * sn], n: [t[1] / L, -t[0] / L] };
}

/** The toothed outline about the focus: teeth centred at arc s0 + k pitch, rack-shaped on the normal. */
function outline(s0: number): Vec2[] {
  const ad = m;
  const de = 1.25 * m;
  const tw = Math.tan(alpha);
  const hw = pitch / 4 - BACKLASH;
  const pt = (s: number, h: number): Vec2 => {
    const q = pitchAt(s);
    return [q.p[0] + h * q.n[0], q.p[1] + h * q.n[1]];
  };
  const out: Vec2[] = [];
  for (let k = 0; k < z; k++) {
    const c = s0 + k * pitch;
    out.push(pt(c - hw - de * tw, -de), pt(c - hw + ad * tw, ad), pt(c + hw - ad * tw, ad), pt(c + hw + de * tw, -de));
    const r0 = c + hw + de * tw;
    const r1 = c + pitch - hw - de * tw;
    for (let j = 1; j <= 3; j++) out.push(pt(r0 + ((r1 - r0) * j) / 4, -de));
  }
  return out;
}

const gear1 = P.custom("gear1", outline(0), { role: "driver", layer: 0, at: "F1", spin: (s) => (s.a as number) + Math.PI, holes: [circle(6, 0, 0, 36)], name: "Elliptical gear 1, 26 teeth" });
const gear2 = P.custom("gear2", outline(S_PI + pitch / 2), { role: "output", layer: 0, at: "F2", spin: (s) => (s.b as number) + Math.PI, holes: [circle(6, 0, 0, 36)], name: "Elliptical gear 2, 26 teeth" });

// The mesh rules classify a pair of gears by tooth count and module: the pair is declared as one of 26 teeth of module
// 2a / 26 = 3.08, whose pitch circles (radius a) touch at the centre distance 2a, the mean of the two ellipses (K6, deliberate:
// the actual teeth are the outlines above).
gear1.z = z;
gear1.m = cd / z;
gear2.z = z;
gear2.m = cd / z;

export default defineMechanism({
  id: "non-circular-gears",
  input: { kind: "rotary", part: "gear1" },
  parts: [gear1, gear2, P.cap("p1", -1, 7, { fixed: [cd, 0, 0], accent: true }), P.cap("p2", -1, 7, { fixed: [0, 0, 0] })],
  solve(u) {
    // gear 1 turns u; its contact point is at local α1 = -u, on the line of centres; the arcs rolled are equal, so
    // gear 2's contact is at α2 with arc(α2) - arc(π) = arc(u), and it has turned θ2 = π - α2
    const a2 = alphaOf(S_PI + arcOf(u));
    const th2 = Math.PI - a2;
    const r1 = rOf(-u);
    return { pts: { F1: [cd, 0], F2: [0, 0], C: [cd - r1, 0] }, a: u, b: th2, ratio: rOf(-u) / rOf(a2) };
  },
  vel: ["C"],
  forces: () => [
    { type: "spin", c: [cd, 0], r: a * (1 + e) + 10, key: "input" },
    { type: "spin", c: [0, 0], r: a * (1 + e) + 10, dir: -1, key: "output" },
  ],
  angles: (s) => [{ type: "angle", c: [s.pts.C![0], 0], a: [s.pts.C![0], 20], b: polar(20, Math.PI / 2 + alpha, s.pts.C![0], 0), r: 14, key: "pressure angle", value: 20 }],
  plot: { label: "Output angle", unit: "°", f: (s) => (-(s.b as number)) / D2R },
});
