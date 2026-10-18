// Chebyshev linkage (catalogue "chebyshev-linkage"): crossed double-rocker four-bar in the ratio ground : rocker :
// coupler = 4 : 5 : 2 with s 30, so d 120, r 150, c 60. The left rocker swings from acos(d/r) = 36.9° to 90°; the
// coupler midpoint M runs from directly above O2 to directly above O1 along y = d, within 0.29 mm of straight.
// The rockers cross, so they sit on layers 0 and 2 with the coupler between: at the ends of the stroke a tip pin lies
// on the other rocker.
import { D2R } from "../../core/geom";
import { V, circleX, osc } from "../../core/vec";
import { defineMechanism } from "../../model/define";
import type { Vec2 } from "../../model/types";
import { P, heights } from "../../parts";

const s = 30;
const d = 4 * s;
const r = 5 * s;
const c = 2 * s;
const O1: Vec2 = [0, 0];
const O2: Vec2 = [d, 0];
/** The input swing, rad: the left rocker's angle at the right-hand end of the stroke and at the left-hand end. */
export const LO = Math.acos(d / r);
export const HI = Math.PI / 2;

/** Plating (K1: heights may change, centres may not): the coupler sits 2.5 mm under its layer so the overhang of B is 1.5 mm (A9). */
const COUPLER_DZ = -2.5;
/** The right rocker rides 1.5 mm up so it clears the head of the B bolt, which stands up between the coupler and it. */
const RIGHT_DZ = 1.5;
/** Boss radii of the tapered rockers (D1): the input boss round the keyed Ø10 shaft, the pin boss round its bearing. */
const ROCKER_L_R: [number, number] = [13, 9.5];
const ROCKER_R_R: [number, number] = [12, 9.5];

const tracer = P.tracer("mid", 1, { at: "M", name: "Coupler midpoint", dz: COUPLER_DZ });

export default defineMechanism({
  id: "chebyshev-linkage",
  input: { kind: "oscillating", part: "rockerL" },
  parts: [
    P.link("rockerL", r, { role: "driver", r: ROCKER_L_R, between: ["O1", "B"], name: "Left rocker (input)" }),
    P.link("coupler", c, { r: [9.5, 9.5], layer: 1, dz: COUPLER_DZ, between: ["A", "B"], name: "Coupler" }),
    P.link("rockerR", r, { role: "output", r: ROCKER_R_R, layer: 2, dz: RIGHT_DZ, between: ["O2", "A"], name: "Right rocker" }),
    P.cap("pO1", -1, 7, { fixed: [0, 0, 0], accent: true }),
    P.cap("pO2", -1, 7, { fixed: [d, 0, 0], span: 3 }),
    P.cap("pB", 0, 5.5, { at: "B", span: 1 }),
    P.cap("pA", 1, 5.5, { at: "A", span: 2 }),
    tracer,
  ],
  traceZ: heights(tracer)[1],
  solve(u) {
    const th = osc(LO, HI)(u);
    const B = V.at(O1, th, r);
    // crossed assembly: A on the far side of the coupler from B's rocker
    const A = circleX(B, c, O2, r, -1);
    const M: Vec2 = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
    return { pts: { O1, O2, A, B, M }, th };
  },
  paths: ["M"],
  vel: ["M", "B"],
  forces: (s) => [
    { type: "axial", a: s.pts.A!, b: O2, key: "rocker" },
    { type: "axial", a: s.pts.A!, b: s.pts.B!, key: "coupler" },
    { type: "spin", c: O1, r: 30, key: "input", z: 1.2 },
  ],
  angles(s) {
    const v1 = V.sub(s.pts.A!, s.pts.B!);
    const v2 = V.sub(O1, s.pts.B!);
    const mu = Math.acos(Math.max(-1, Math.min(1, (v1[0] * v2[0] + v1[1] * v2[1]) / (c * r)))) / D2R;
    return [
      { type: "angle", c: s.pts.B!, a: s.pts.A!, b: O1, r: 24, key: "transmission", value: mu, warn: mu < 40 || mu > 140 },
      { type: "angle", c: O1, a: [r, 0], b: s.pts.B!, r: 22, key: "crank", value: (s.th as number) / D2R, z: 1.2 },
    ];
  },
  plot: { label: "Midpoint offset from y = 120", unit: "mm", f: (s) => s.pts.M![1] - d },
});
