// Watt's linkage (catalogue "watt-linkage"): two equal rockers r 90 on pivots O1 (-90, 30) and O2 (90, -30), a coupler
// c 60 between their tips. With both rockers horizontal the coupler is vertical (ground offset 2r by c), and its
// midpoint M runs on a near-straight vertical line: 74 mm of travel for ±24° of the left rocker, x within 0.6 mm.
// The rockers never cross and never meet in the swing, so both ride the base layer (the right one 2 mm up); the coupler sits above them.
import { D2R } from "../../core/geom";
import { V, circleX, osc } from "../../core/vec";
import { defineMechanism } from "../../model/define";
import type { Vec2 } from "../../model/types";
import { P, heights } from "../../parts";

const r = 90;
const c = 60;
const swing = 24 * D2R;
const O1: Vec2 = [-r, c / 2];
const O2: Vec2 = [r, -c / 2];

/** Plating (K1: heights may change, centres may not): the coupler sits 0.5 mm under its layer so the overhang of B is 1.5 mm over the raised right rocker (A sits 3.5 mm over the left tip) (A9). */
const COUPLER_DZ = -0.5;
/** The right rocker rides 2 mm up so the flange and clamp screws of the eccentric bushing at O2 (F7) pass under it. The base follows the lowest part, so the left rocker cannot rise with it. */
const ROCKER_DZ = 2;
/** Boss radii of the tapered rockers (D1): the input boss round the keyed Ø10 shaft, the pin bosses round their bearings. */
const ROCKER_L_R: [number, number] = [13, 9.5];
const ROCKER_R_R: [number, number] = [12, 9.5];

const tracer = P.tracer("mid", 1, { at: "M", name: "Coupler midpoint", dz: COUPLER_DZ });

export default defineMechanism({
  id: "watt-linkage",
  input: { kind: "oscillating", part: "rockerL" },
  parts: [
    P.link("rockerL", r, { role: "driver", r: ROCKER_L_R, between: ["O1", "A"], name: "Left rocker (input)" }),
    P.link("rockerR", r, { role: "output", dz: ROCKER_DZ, r: ROCKER_R_R, between: ["O2", "B"], name: "Right rocker, rear plate" }),
    // the right rocker is a clevis: a front plate above the coupler puts B in double shear (A9)
    P.link("rockerR-front", r, { role: "output", r: ROCKER_R_R, layer: 2, dz: -3, twin: "rockerR", between: ["O2", "B"], name: "Right rocker, front plate" }),
    P.link("coupler", c, { r: [9.5, 9.5], layer: 1, dz: COUPLER_DZ, between: ["A", "B"], name: "Coupler" }),
    P.cap("pO1", -1, 7, { fixed: [O1[0], O1[1], 0], accent: true }),
    P.cap("pO2", -1, 7, { fixed: [O2[0], O2[1], 0], span: 3 }),
    P.cap("pA", 0, 5.5, { at: "A" }),
    P.cap("pB", 0, 5.5, { at: "B", span: 2 }),
    tracer,
  ],
  traceZ: heights(tracer)[1],
  solve(u) {
    const th = osc(-swing, swing)(u);
    const A = V.at(O1, th, r);
    // one assembly branch throughout: B on the near side of the coupler, rockers pointing at each other
    const B = circleX(A, c, O2, r, -1);
    const M: Vec2 = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
    return { pts: { O1, O2, A, B, M }, th };
  },
  paths: ["M"],
  vel: ["M", "A"],
  forces: (s) => [
    { type: "axial", a: s.pts.B!, b: O2, key: "rocker" },
    { type: "axial", a: s.pts.A!, b: s.pts.B!, key: "coupler" },
    { type: "spin", c: O1, r: 30, key: "input", z: 1.2 },
  ],
  angles(s) {
    const v1 = V.sub(s.pts.B!, s.pts.A!);
    const v2 = V.sub(O1, s.pts.A!);
    const mu = Math.acos(Math.max(-1, Math.min(1, (v1[0] * v2[0] + v1[1] * v2[1]) / (c * r)))) / D2R;
    return [
      { type: "angle", c: s.pts.A!, a: s.pts.B!, b: O1, r: 22, key: "transmission", value: mu, warn: mu < 40 || mu > 140 },
      { type: "angle", c: O1, a: [O1[0] + r, O1[1]], b: s.pts.A!, r: 22, key: "crank", value: (s.th as number) / D2R, z: 1.2 },
    ];
  },
  plot: { label: "Midpoint offset from the vertical line", unit: "mm", f: (s) => s.pts.M![0] },
});
