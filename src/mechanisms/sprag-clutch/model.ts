// Sprag clutch (catalogue "sprag-clutch"): an inner race of radius 20 and an outer race with a bore of radius 28 on one axis, the
// 8 mm gap between them holding 16 sprags, short figure-of-eight blocks whose long diagonal (8.4) is a little more than the gap,
// each a wedge between the two races. Turn the inner race the driving way (counter-clockwise) and the sprags tilt toward upright
// and wedge, so the outer race turns with it, 1:1; turn it the other way, or let the outer race run ahead, and they tilt the other
// way, the diagonal falls under the gap and the races turn free (overrun). The lock condition tan(grip angle) < mu (about 5.7° at
// mu = 0.1) is the wedge's: a sprag locks with its long diagonal near the radial direction.
// This model is the driving state, the one a single input angle can show: the inner race turns u, the outer race follows 1:1, and every
// sprag is drawn at its locking tilt, touching both races, the 16 turning with the pair. Overrun (the outer race running ahead, the
// sprags tipped the other way) needs a second independent input and is not animated; the page's notes and the audit say so (K6).
// A sprag is a stadium 8.4 long and 4.4 wide (the figure-of-eight's two contact arcs): its two end circles of radius 2.2 touch the outer
// race at radius 25.8 and the inner at 22.2, whose centres are 4 apart: that fixes its tilt (about 24° from radial) and its place.
// The outer race rides on the shaft through a spider (a hub and three arms) above it, on its own bearing, bolted to the race at the arms (polish).
// One cycle is one input turn; the sprags and races repeat (K2).
import { TAU, arcPts, circle, dBore, polar, roundedPoly, type Vec2 } from "../../core/geom";
import { defineMechanism } from "../../model/define";
import type { Solved } from "../../model/types";
import { P } from "../../parts";

export const ri = 20;
export const ro = 28;
export const nS = 16;
const RE = 2.18;
const LEN = 4;
/** Outer race outer radius; the spider's arm length. */
export const ROUT = 38;
const gap = ro - ri;
void gap;

// the locking pose of a sprag: end circles touching the outer race (centre radius ro - RE) and the inner (ri + RE)
const e1: Vec2 = polar(ro - RE - 0.01, 0);
const rIn = ri + RE + 0.01;
const delta = Math.acos((e1[0] ** 2 + rIn ** 2 - LEN ** 2) / (2 * e1[0] * rIn));
const e2: Vec2 = polar(rIn, delta);
const M: Vec2 = [(e1[0] + e2[0]) / 2, (e1[1] + e2[1]) / 2];
const axis = Math.atan2(e1[1] - e2[1], e1[0] - e2[0]);
/** The sprag's centre: radius and angle about the axis, and its tilt from the radial direction at that point. */
export const spragR = Math.hypot(M[0], M[1]);
const spragA = Math.atan2(M[1], M[0]);
export const tilt = axis - spragA;

const KEYED = dBore(5);
const sprag = (k: number) =>
  P.custom(`sprag${k}`, roundedPoly([[-LEN / 2, 0], [LEN / 2, 0]], RE), { role: "link", layer: 0, at: `S${k}`, spin: (s) => (s.a as number) + (k * TAU) / nS + axis, name: `Sprag ${k + 1}`, marks: [] });
/** The spider that carries the outer race on the shaft: a hub and three tapered arms to the race's rim (the sprags show between them). */
const HUB_R = 17;
const ARM_R = 7;
export const ARM_L = 31;
function spiderOutline(): Vec2[] {
  const a = Math.acos((HUB_R - ARM_R) / ARM_L);
  const cross = (p: Vec2, d: Vec2, q: Vec2, e2: Vec2): Vec2 => {
    const den = d[0] * e2[1] - d[1] * e2[0];
    const t = ((q[0] - p[0]) * e2[1] - (q[1] - p[1]) * e2[0]) / den;
    return [p[0] + d[0] * t, p[1] + d[1] * t];
  };
  const out: Vec2[] = [];
  for (let k = 0; k < 3; k++) {
    const th = (k * TAU) / 3;
    const C = polar(ARM_L, th);
    out.push(...arcPts(C[0], C[1], ARM_R, th - a, th + a, Math.PI / 24));
    const th2 = th + TAU / 3;
    const C2 = polar(ARM_L, th2);
    const p = polar(ARM_R, th + a, C[0], C[1]);
    const d: Vec2 = [p[0] - polar(HUB_R, th + a)[0], p[1] - polar(HUB_R, th + a)[1]];
    const q = polar(ARM_R, th2 - a, C2[0], C2[1]);
    const e2: Vec2 = [q[0] - polar(HUB_R, th2 - a)[0], q[1] - polar(HUB_R, th2 - a)[1]];
    out.push(cross(p, d, q, e2));
  }
  return out;
}
const spider = P.custom("spider", spiderOutline(), { role: "output", layer: 1, at: "O", spin: (s) => s.a as number, name: "Outer race spider", marks: [] });

const innerRace = P.disc("inner", ri, { role: "driver", layer: 0, holes: [KEYED], at: "O", spin: (s) => s.a as number, name: "Inner race", marks: [circle(ri - 3, 0, 0, 40)] });
const outerRing = P.custom("outer", circle(ROUT, 0, 0, 96), { role: "output", layer: 0, holes: [circle(ro, 0, 0, 96)], at: "O", spin: (s) => s.a as number, name: "Outer race", marks: [circle(ROUT - 3, 0, 0, 96)] });

export default defineMechanism({
  id: "sprag-clutch",
  input: { kind: "rotary", part: "inner" },
  parts: [innerRace, outerRing, spider, ...Array.from({ length: nS }, (_, k) => sprag(k)), P.cap("pO", -1, 7, { fixed: [0, 0, 0], accent: true, span: 2 })],
  solve(u): Solved {
    const a = u;
    const pts: Record<string, Vec2> = { O: [0, 0] };
    for (let k = 0; k < nS; k++) pts[`S${k}`] = polar(spragR, spragA + a + (k * TAU) / nS);
    return { pts, a };
  },
  paths: ["S0"],
  vel: ["S0"],
  forces: () => [
    { type: "spin", c: [0, 0], r: ri + 4, key: "input", z: 1.2 },
    { type: "spin", c: [0, 0], r: ROUT + 6, key: "output", z: 1.2 },
  ],
  plot: { label: "Outer race angle", unit: "°", f: (s) => ((s.a as number) * 180) / Math.PI },
});
