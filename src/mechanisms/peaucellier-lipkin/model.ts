// Peaucellier-Lipkin linkage (catalogue "peaucellier-lipkin"): ground pivots O (0, 0) and Q (45, 0), |OQ| = r = 45; input
// arm Q to C (r), two long arms O to A and O to B (l = 125), a rhombus A C B D of side q = 55. O, C and D stay in line
// and OC x OD = l² - q² = 12600 mm², so D is the inverse of C. C runs on a circle through O, so D runs on the straight
// line x = (l² - q²) / (2 r) = 140 exactly, y from -87.5 to +87.5 (175 mm) for an input swing of ±64°.
import { D2R } from "../../core/geom";
import { V, circleX, osc } from "../../core/vec";
import { defineMechanism } from "../../model/define";
import type { Vec2 } from "../../model/types";
import { P, heights } from "../../parts";

export const l = 125;
export const q = 55;
export const r = 45;
export const swing = 64;
const O: Vec2 = [0, 0];
const Q: Vec2 = [r, 0];
const phi = osc(-swing * D2R, swing * D2R);

/** Boss radii of the tapered links (D1): the input boss round the keyed Ø10 shaft, the arms round the O axle, the pins' bosses round their bearings. */
const INPUT_R: [number, number] = [13, 9.5];
const ARM_R: [number, number] = [12, 9.5];
const SIDE_R: [number, number] = [9.5, 9.5];

/**
 * Layers (K5). The input crosses both long arms over its swing, so it sits alone on layer 0, under everything. At the
 * ends of the swing each long arm comes within a millimetre of the rhombus side that runs from its far end to C, so
 * the four planes of the arms and the C sides are all different: AC 1, BC 2, armA 3, armB 4. The far sides fill the
 * gaps without meeting a neighbour: AD 2 (parallel to BC, a rhombus height away), BD 3. Every pin joins distinct
 * layers: C (input 0, AC 1, BC 2), A (AC 1, AD 2, armA 3), B (BC 2, BD 3, armB 4), D (AD 2, BD 3), O (armA 3, armB 4).
 */
const pD = P.cap("pD", 2, 5.5, { at: "D", span: 1 });

export default defineMechanism({
  id: "peaucellier-lipkin",
  input: { kind: "oscillating", part: "input" },
  parts: [
    P.link("input", r, { role: "driver", r: INPUT_R, layer: 0, between: ["Q", "C"], name: "Input arm" }),
    P.link("armB", l, { r: ARM_R, layer: 4, between: ["O", "B"], name: "Long arm B" }),
    P.link("armA", l, { r: ARM_R, layer: 3, between: ["O", "A"], name: "Long arm A" }),
    P.link("AC", q, { r: SIDE_R, layer: 1, between: ["A", "C"], name: "Rhombus side AC" }),
    P.link("BC", q, { r: SIDE_R, layer: 2, between: ["B", "C"], name: "Rhombus side BC" }),
    P.link("AD", q, { role: "output", r: SIDE_R, layer: 2, between: ["A", "D"], name: "Rhombus side AD" }),
    P.link("BD", q, { r: SIDE_R, layer: 3, between: ["B", "D"], name: "Rhombus side BD" }),
    P.cap("pO", -1, 7, { fixed: [0, 0, 0], span: 5 }),
    P.cap("pQ", -1, 7, { fixed: [r, 0, 0], accent: true }),
    P.cap("pC", 0, 5.5, { at: "C", span: 2 }),
    P.cap("pA", 1, 5.5, { at: "A", span: 2 }),
    P.cap("pB", 2, 5.5, { at: "B", span: 2 }),
    pD,
  ],
  traceZ: heights(pD)[1],
  solve(u) {
    const a = phi(u);
    const C = V.at(Q, a, r);
    // one assembly branch throughout: A above the line O to C, B below
    const A = circleX(O, l, C, q, 1);
    const B = circleX(O, l, C, q, -1);
    const D: Vec2 = [A[0] + B[0] - C[0], A[1] + B[1] - C[1]];
    return { pts: { O, Q, C, A, B, D }, th: a };
  },
  paths: ["D", "C"],
  vel: ["D", "C"],
  forces: (s) => [
    { type: "axial", a: s.pts.O!, b: s.pts.A!, key: "arm" },
    { type: "spin", c: Q, r: 30, key: "input", z: 1.2 },
  ],
  angles(s) {
    const A = s.pts.A!;
    const D = s.pts.D!;
    const C = s.pts.C!;
    const ang = Math.acos(Math.max(-1, Math.min(1, ((C[0] - A[0]) * (D[0] - A[0]) + (C[1] - A[1]) * (D[1] - A[1])) / (q * q)))) / D2R;
    return [
      { type: "angle", c: A, a: C, b: D, r: 20, key: "rhombus", value: ang },
      { type: "angle", c: Q, a: [r + 30, Q[1]], b: s.pts.C!, r: 16, key: "input", value: (s.th as number) / D2R, z: 1.2 },
    ];
  },
  plot: { label: "Output position", unit: "mm", f: (s) => s.pts.D![1] },
});
