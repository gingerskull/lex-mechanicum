// Watt six-bar linkage (catalogue "watt-six-bar", the Watt II arrangement): two four-bars in series. Frame pivots O2
// (0, 0), O4 (100, 0) and O6 (180, 60). Loop 1: crank a 30, coupler b 100, rocker c 60 on O4, ground d 100; Grashof
// (30 + 100 <= 60 + 100), so the crank turns fully and rocker1 swings 62° (74° to 136°). The rocker is a ternary plate:
// its second arm O4C, 50 mm, stands 90° clockwise of O4B. Loop 2: coupler e 60 from C to D, output rocker f 30 on O6;
// rocker2 swings about 91°. Mobility 3(6 - 1) - 2·7 = 1. Branches as the catalogue: B = circleX(A, b, O4, c, +1), C from the
// plate, D = circleX(C, e, O6, f, +1), the same all cycle.
import { D2R, clamp } from "../../core/geom";
import { V, circleX } from "../../core/vec";
import { defineMechanism } from "../../model/define";
import type { Vec2 } from "../../model/types";
import { P } from "../../parts";

const a = 30;
const b = 100;
const c = 60;
const d = 100;
const c2 = 50;
const e = 60;
const f = 30;
const O2: Vec2 = [0, 0];
const O4: Vec2 = [d, 0];
const O6: Vec2 = [180, 60];

/**
 * Plating (K1: heights may change, centres may not): both couplers sit 2.5 mm under their layer, so the overhang of the
 * crank pin is 1.5 mm (A9).
 */
const COUPLER_DZ = -2.5;
/** The rockers' front plates ride 5 mm under their layer, 1.5 mm over the couplers. */
const FRONT_DZ = -5;
/** Boss radii of the tapered links (D1): the input boss round the keyed Ø10 shaft, the pin bosses round their bearings. */
const CRANK_R: [number, number] = [13, 9.5];
const ROCKER_R: [number, number] = [12, 9.5];
const COUPLER_R: [number, number] = [9.5, 9.5];

/** The pin centres for a crank angle, on the one assembly branch. */
function pose(u: number): { A: Vec2; B: Vec2; C: Vec2; D: Vec2 } {
  const A = V.at(O2, u, a);
  const B = circleX(A, b, O4, c, 1);
  const C = V.at(O4, V.ang(O4, B) - Math.PI / 2, c2);
  const D = circleX(C, e, O6, f, 1);
  return { A, B, C, D };
}

export default defineMechanism({
  id: "watt-six-bar",
  input: { kind: "rotary", part: "crank" },
  parts: [
    P.link("crank", a, { role: "driver", r: CRANK_R, between: ["O2", "A"] }),
    P.link("rocker2", f, { role: "output", r: ROCKER_R, between: ["O6", "D"], name: "Output rocker, rear plate" }),
    P.plate("rocker1", [[0, 0], [c, 0], [0, -c2]], { r: 11, between: ["O4", "B"], name: "Ternary rocker, rear plate" }),
    P.link("coupler1", b, { layer: 1, dz: COUPLER_DZ, r: COUPLER_R, between: ["A", "B"], name: "Coupler AB" }),
    P.link("coupler2", e, { layer: 1, dz: COUPLER_DZ, r: COUPLER_R, between: ["C", "D"], name: "Coupler CD" }),
    // both rockers are clevises: a front plate over the couplers puts B, C and D in double shear (A9)
    P.plate("rocker1-front", [[0, 0], [c, 0], [0, -c2]], { r: 11, layer: 2, dz: FRONT_DZ, twin: "rocker1", between: ["O4", "B"], name: "Ternary rocker, front plate" }),
    P.link("rocker2-front", f, { role: "output", r: ROCKER_R, layer: 2, dz: FRONT_DZ, twin: "rocker2", between: ["O6", "D"], name: "Output rocker, front plate" }),
    P.cap("pO2", -1, 7, { fixed: [0, 0, 0], accent: true }),
    P.cap("pO4", -1, 7, { fixed: [d, 0, 0], span: 3 }),
    P.cap("pO6", -1, 7, { fixed: [O6[0], O6[1], 0], span: 3 }),
    P.cap("pA", 0, 5.5, { at: "A" }),
    P.cap("pB", 0, 5.5, { at: "B", span: 2 }),
    P.cap("pC", 0, 5.5, { at: "C", span: 2 }),
    P.cap("pD", 0, 5.5, { at: "D", span: 2 }),
  ],
  traceZ: 24,
  solve(u) {
    const { A, B, C, D } = pose(u);
    return { pts: { O2, O4, O6, A, B, C, D }, th: u };
  },
  paths: ["D", "C"],
  vel: ["D", "B"],
  forces: (s) => [
    { type: "axial", a: s.pts.A!, b: s.pts.B!, key: "coupler AB" },
    { type: "axial", a: s.pts.C!, b: s.pts.D!, key: "coupler CD" },
    { type: "spin", c: O2, r: 30, key: "input", z: 1.2 },
  ],
  angles(s, u) {
    const v1 = V.sub(s.pts.C!, s.pts.D!);
    const v2 = V.sub(O6, s.pts.D!);
    const mu = Math.acos(clamp((v1[0] * v2[0] + v1[1] * v2[1]) / (e * f), -1, 1)) / D2R;
    const th = ((((u / D2R) % 360) + 360) % 360);
    return [
      { type: "angle", c: s.pts.D!, a: s.pts.C!, b: O6, r: 20, key: "transmission", value: mu, warn: mu < 40 || mu > 140 },
      { type: "angle", c: O2, a: [a, 0], b: s.pts.A!, r: 16, key: "crank", value: th, z: 1.2 },
    ];
  },
  plot: { label: "Output rocker angle", unit: "°", f: (s) => Math.atan2(s.pts.D![1] - O6[1], s.pts.D![0] - O6[0]) / D2R },
});
