// Ackermann steering linkage (catalogue "ackermann-steering"): a four-bar trapezoid. Kingpins KL (-75, 0) and KR (75, 0)
// on the axle beam (track w 150), steering arms r 30 pointing at the rear axle centre (0, -250), 16.7° inward of
// straight back, and a tie rod t 132.8 behind the axle (w - 2 r sin β). The left arm is rocked ±40°; the right arm
// follows, so the inner wheel always turns more than the outer one (cot δo - cot δi = w / L ideal; this trapezoid
// approximates it).
import { D2R } from "../../core/geom";
import { V, circleX, osc } from "../../core/vec";
import { defineMechanism } from "../../model/define";
import type { Vec2 } from "../../model/types";
import { P } from "../../parts";

const w = 150;
const L = 250;
const r = 30;
const beta = Math.atan2(w / 2, L);
const t = w - 2 * r * Math.sin(beta);
// Full lock each way: the left (input) arm turns 40° as the inner wheel (left turn) and 30° as the outer wheel (right
// turn), where the right wheel is the inner one at 38.7°. The tie rod cannot reach beyond about -37° of the input arm, so
// the catalogue "rocked ±40°" is read as 40° of the inner wheel, the most this trapezoid allows on one side.
const swing: [number, number] = [-30 * D2R, 40 * D2R];
const KL: Vec2 = [-w / 2, 0];
const KR: Vec2 = [w / 2, 0];
/** Neutral arm directions: both point at the rear axle centre. */
const phiL = -Math.PI / 2 + beta;
const phiR = -Math.PI / 2 - beta;

/** Plating (K1: heights may change, centres may not): the tie rod rides over the arm tips, 1.5 mm over each pin end. */
const ROD_DZ = -2.5;
/** Boss radii of the tapered arms (D1): the kingpin boss round the keyed Ø10 shaft / bearing, the pin boss round its bearing. */
const ARM_L_R: [number, number] = [13, 9.5];
const ARM_R_R: [number, number] = [12, 9.5];

export default defineMechanism({
  id: "ackermann-steering",
  input: { kind: "oscillating", part: "armL" },
  parts: [
    P.link("armL", r, { role: "driver", r: ARM_L_R, between: ["KL", "PL"], name: "Left knuckle arm (input)" }),
    P.link("armR", r, { role: "output", r: ARM_R_R, between: ["KR", "PR"], name: "Right knuckle arm" }),
    P.link("tieRod", t, { r: [9.5, 9.5], layer: 1, dz: ROD_DZ, between: ["PL", "PR"], name: "Tie rod" }),
    P.cap("pKL", -1, 7, { fixed: [KL[0], KL[1], 0], accent: true }),
    P.cap("pKR", -1, 7, { fixed: [KR[0], KR[1], 0] }),
    P.cap("pPL", 0, 5.5, { at: "PL" }),
    P.cap("pPR", 0, 5.5, { at: "PR" }),
  ],
  solve(u) {
    const th = osc(...swing)(u);
    const PL = V.at(KL, phiL + th, r);
    // one assembly branch throughout: the tie rod behind the axle
    const PR = circleX(PL, t, KR, r, -1);
    const dR = V.ang(KR, PR) - phiR;
    return { pts: { KL, KR, PL, PR }, th, dR };
  },
  paths: ["PL", "PR"],
  vel: ["PL", "PR"],
  forces: (s) => [
    { type: "axial", a: s.pts.PL!, b: s.pts.PR!, key: "tie rod" },
    { type: "spin", c: KL, r: 30, key: "input", z: 1.2 },
  ],
  angles(s) {
    return [
      { type: "angle", c: KL, a: V.at(KL, phiL, 26), b: s.pts.PL!, r: 22, key: "input", value: Math.abs((s.th as number) / D2R), z: 1.2 },
      { type: "angle", c: KR, a: V.at(KR, phiR, 26), b: s.pts.PR!, r: 22, key: "output", value: Math.abs((s.dR as number) / D2R) },
    ];
  },
  plot: { label: "Right wheel angle", unit: "°", f: (s) => (s.dR as number) / D2R },
});
