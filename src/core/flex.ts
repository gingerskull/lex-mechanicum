// Flexible members (J12): the closed path a chain or belt follows round two wheels, the HTD timing belt's profile (the
// pulley's grooved outline and the belt's tooth) and the ISO 606 sprocket. Millimetres and radians; used by the
// builder's flexible-member kits (src/builder/flexible.ts).
import { TAU, arcPts, polar, type Vec2 } from "./geom";

/**
 * HTD timing belt profiles by pitch: pitch line differential, tooth height and belt height; the pulley's groove
 * (round-bottomed: its radius and depth) and the belt's tooth (its tip radius, the tip's distance in from the pitch
 * line, and where its flanks meet the back, in from the pitch line).
 */
export const HTD: Record<number, { pld: number; ht: number; hs: number; groove: { r: number; depth: number }; tooth: { r: number; tip: number; root: number } }> = {
  3: { pld: 0.381, ht: 1.22, hs: 2.4, groove: { r: 0.95, depth: 1.3 }, tooth: { r: 0.85, tip: 1.55, root: 0.2 } },
  5: { pld: 0.5715, ht: 2.06, hs: 3.8, groove: { r: 1.6, depth: 2.1 }, tooth: { r: 1.4, tip: 2.55, root: 0.3 } },
  8: { pld: 0.686, ht: 3.38, hs: 5.6, groove: { r: 2.6, depth: 3.4 }, tooth: { r: 2.3, tip: 0.686 + 3.2, root: 0.4 } },
};

/** The HTD profile of a pitch, the nearest one listed. */
export function htd(p: number): (typeof HTD)[number] {
  const k = Object.keys(HTD).map(Number).sort((a, b) => Math.abs(a - p) - Math.abs(b - p))[0]!;
  return HTD[k]!;
}

/**
 * A timing pulley of z round-bottomed grooves at belt pitch p: the outside circle (the pitch circle less the pitch line
 * differential) with a groove centred at angle a0 and every 2π/z on.
 */
export function pulleyOutline(z: number, p: number, a0 = 0): Vec2[] {
  const P = htd(p);
  const ro = (p * z) / TAU - P.pld;
  const g = P.groove.r;
  const yc = ro - P.groove.depth + g;
  const out: Vec2[] = [];
  const land = 6;
  const h = Math.asin(g / ro);
  for (let k = 0; k < z; k++) {
    const a = a0 + (k * TAU) / z;
    const groove: Vec2[] = [[ro * Math.cos(-h), ro * Math.sin(-h)], [yc, -g]];
    for (let i = 1; i < 12; i++) groove.push(polar(g, -Math.PI / 2 - (i * Math.PI) / 12, yc, 0));
    groove.push([yc, g], [ro * Math.cos(h), ro * Math.sin(h)]);
    // the groove turned to its place, then the land to the next groove
    out.push(...groove.map(([x, y]): Vec2 => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)]));
    for (let i = 1; i < land; i++) out.push(polar(ro, a + h + (i * (TAU / z - 2 * h)) / land));
  }
  return out;
}

/** A belt tooth on the pitch path at pitch p: local x along the belt, y in toward the pulleys, counter-clockwise. */
export function beltTooth(p: number): Vec2[] {
  const { r, tip, root } = htd(p).tooth;
  const yc = tip - r;
  const pts: Vec2[] = [[-r, root]];
  for (let i = 0; i <= 12; i++) {
    const a = Math.PI + (i * Math.PI) / 12;
    pts.push([r * Math.cos(a), yc - r * Math.sin(a)]);
  }
  pts.push([r, root]);
  return pts.reverse();
}

/**
 * The closed path (counter-clockwise) round wheel 1 at c1 (radius r1) and wheel 2 at c2 (radius r2): the far arc of
 * each wheel and the two outer tangents, as points at most `step` radians apart on the arcs.
 */
export function beltPath(c1: Vec2, r1: number, c2: Vec2, r2: number, step = Math.PI / 24): Vec2[] {
  const dx = c2[0] - c1[0];
  const dy = c2[1] - c1[1];
  const C = Math.hypot(dx, dy);
  const a = Math.atan2(dy, dx);
  const b = Math.asin((r2 - r1) / C);
  // the tangent points sit at a ± (π/2 + b) from each centre
  const arc1 = arcPts(c1[0], c1[1], r1, a + Math.PI / 2 + b, a + TAU - Math.PI / 2 - b, step);
  const arc2 = arcPts(c2[0], c2[1], r2, a - Math.PI / 2 - b, a + Math.PI / 2 + b, step);
  return [...arc1, ...arc2];
}

/** The length of a closed polyline. */
export function pathLength(P: Vec2[]): number {
  let L = 0;
  for (let i = 0; i < P.length; i++) L += Math.hypot(P[(i + 1) % P.length]![0] - P[i]![0], P[(i + 1) % P.length]![1] - P[i]![1]);
  return L;
}

/** Pitch radius of a sprocket of z teeth at chain pitch p: the pitch polygon's circumradius. */
export const sprocketR = (z: number, p: number): number => p / (2 * Math.sin(Math.PI / z));

/** ISO 606 roller seat radius for rollers of Ø d1, mm. */
export const sprocketSeat = (d1: number): number => 0.505 * d1 + 0.069 * Math.cbrt(d1);

/**
 * An ISO 606 sprocket of z teeth at chain pitch p for rollers of Ø d1: a roller seat centred on each vertex of the pitch
 * polygon (the first at angle a0), its seating angle 140° - 90°/z, convex flanks of the mean standard radius tangent to
 * it, the tip circle midway between the standard's limits, a land left on each tip.
 */
export function sprocketOutline(z: number, p: number, d1: number, a0 = 0, tip: "mid" | "min" = "mid"): Vec2[] {
  const R = sprocketR(z, p);
  const seat = sprocketSeat(d1);
  const al = ((140 - 90 / z) * Math.PI) / 180;
  const re = (0.12 * d1 * (z + 2) + 0.008 * d1 * (z * z + 180)) / 2;
  // the tip circle midway between the standard's limits, or at its least: a sprocket whose free strands are drawn along
  // the seat circle's tangents, which the teeth of the larger tip would graze as a roller leaves its seat
  const Ra = tip === "min" ? (2 * R + p * (1 - 1.6 / z) - d1) / 2 : (2 * R + p * (1 - 1.6 / z) - d1 + (2 * R + 1.25 * p - d1)) / 4;
  // one tooth gap in its own frame (the vertex on +x): the seat, then the flank on the +y side out to the tip circle
  const E: Vec2 = [R - seat * Math.cos(al / 2), seat * Math.sin(al / 2)];
  const cf: Vec2 = [E[0] + (re * (R - E[0])) / seat, E[1] + (re * (0 - E[1])) / seat];
  const flank: Vec2[] = [];
  for (let ps = Math.PI - al / 2; ps > Math.PI - al / 2 - Math.PI / 2; ps -= 0.01) {
    const q = polar(re, ps, cf[0], cf[1]);
    flank.push(q);
    if (Math.hypot(q[0], q[1]) >= Ra) break;
  }
  // the tip half-angle the flank reaches, held short of the half pitch so the tip keeps a land
  const tipA = Math.min(Math.atan2(flank[flank.length - 1]![1], flank[flank.length - 1]![0]), Math.PI / z - 0.02);
  const half = flank.filter(([x, y]) => Math.atan2(y, x) < tipA);
  const gap: Vec2[] = [...half.map(([x, y]): Vec2 => [x, -y]).reverse(), ...arcPts(R, 0, seat, Math.PI + al / 2, Math.PI - al / 2, Math.PI / 24), ...half];
  const out: Vec2[] = [];
  for (let k = 0; k < z; k++) {
    const a = a0 + (k * TAU) / z;
    const rot = ([x, y]: Vec2): Vec2 => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];
    out.push(...gap.map(rot));
    out.push(...arcPts(0, 0, Ra, a + tipA, a + TAU / z - tipA, Math.PI / 90).slice(1, -1));
  }
  return out;
}
