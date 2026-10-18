// Stephenson six-bar linkage (catalogue "stephenson-six-bar", Stephenson III): a four-bar crank-rocker with a dyad
// hung on the coupler. Frame pivots O2 (0, 0), O4 (60, 0) and O6 (-20, -50). Loop 1: crank a 20, ternary coupler AB
// b 60, rocker c 50 on O4, ground d 60; Grashof (20 + 60 <= 50 + 60), so the crank turns fully. The coupler carries a
// third pin P at local (30, -40) from A (x along AB). Loop 2: link e 70 from P to D, output rocker f 40 on O6. The
// rocker swings about 54° (-49° to 5°). Mobility 3(6 - 1) - 2·7 = 1. Branches as the catalogue: B = circleX(A, b, O4, c, +1),
// D = circleX(P, e, O6, f, +1), the same all cycle.
import { D2R, clamp } from "../../core/geom";
import { V, circleX } from "../../core/vec";
import { defineMechanism } from "../../model/define";
import type { Vec2 } from "../../model/types";
import { P } from "../../parts";

const a = 20;
const b = 60;
const c = 50;
const d = 60;
const px = 30;
const py = -40;
const e = 70;
const f = 40;
const O2: Vec2 = [0, 0];
const O4: Vec2 = [d, 0];
const O6: Vec2 = [-20, -50];

/**
 * Plating (K1: heights may change, centres may not): the coupler sits 1.5 mm under its layer, so the crank pin overhang
 * is 2.5 mm (A9) and the coupler runs 1.1 mm over the stub axle at O4; the dyad link sits 4 mm under its layer, over the
 * coupler at P. The coupler sweeps over the rocker pivot O4, so the rocker stays under it and nothing stands above O4:
 * no clevis there.
 */
const COUPLER_DZ = -1.5;
const LINK_DZ = -4;
/** Boss radii of the tapered links (D1): the input boss round the keyed Ø10 shaft, the pin bosses round their bearings. */
const CRANK_R: [number, number] = [13, 9.5];
const ROCKER_R: [number, number] = [12, 9.5];
const LINK_R: [number, number] = [9.5, 9.5];

/** The pin centres for a crank angle, on the one assembly branch. */
function pose(u: number): { A: Vec2; B: Vec2; P: Vec2; D: Vec2 } {
  const A = V.at(O2, u, a);
  const B = circleX(A, b, O4, c, 1);
  const Pp = V.at(A, V.ang(A, B), px, py);
  const D = circleX(Pp, e, O6, f, 1);
  return { A, B, P: Pp, D };
}

export default defineMechanism({
  id: "stephenson-six-bar",
  input: { kind: "rotary", part: "crank" },
  parts: [
    P.link("crank", a, { role: "driver", r: CRANK_R, between: ["O2", "A"] }),
    P.link("rocker1", c, { r: ROCKER_R, between: ["O4", "B"], name: "Rocker" }),
    P.plate("coupler", [[0, 0], [b, 0], [px, py]], { layer: 1, r: 11, dz: COUPLER_DZ, between: ["A", "B"], name: "Ternary coupler" }),
    P.link("link5", e, { layer: 2, dz: LINK_DZ, r: LINK_R, between: ["P", "D"], name: "Dyad link PD" }),
    P.link("rocker2", f, { role: "output", layer: 1, dz: COUPLER_DZ, r: ROCKER_R, between: ["O6", "D"], name: "Output rocker" }),
    P.cap("pO2", -1, 7, { fixed: [0, 0, 0], accent: true }),
    P.cap("pO4", -1, 7, { fixed: [d, 0, 0] }),
    P.cap("pO6", -1, 7, { fixed: [O6[0], O6[1], 0], span: 2 }),
    P.cap("pA", 0, 5.5, { at: "A" }),
    P.cap("pB", 0, 5.5, { at: "B" }),
    P.cap("pP", 1, 5.5, { at: "P", span: 1 }),
    P.cap("pD", 1, 5.5, { at: "D", span: 1 }),
  ],
  traceZ: 24,
  solve(u) {
    const { A, B, P: Pp, D } = pose(u);
    return { pts: { O2, O4, O6, A, B, P: Pp, D }, th: u };
  },
  paths: ["P"],
  vel: ["P", "D"],
  forces: (s) => [
    { type: "axial", a: s.pts.A!, b: s.pts.B!, key: "coupler" },
    { type: "axial", a: s.pts.P!, b: s.pts.D!, key: "link PD" },
    { type: "spin", c: O2, r: 30, key: "input", z: 1.2 },
  ],
  angles(s, u) {
    const v1 = V.sub(s.pts.P!, s.pts.D!);
    const v2 = V.sub(O6, s.pts.D!);
    const mu = Math.acos(clamp((v1[0] * v2[0] + v1[1] * v2[1]) / (e * f), -1, 1)) / D2R;
    const th = ((((u / D2R) % 360) + 360) % 360);
    return [
      { type: "angle", c: s.pts.D!, a: s.pts.P!, b: O6, r: 20, key: "transmission", value: mu, warn: mu < 40 || mu > 140 },
      { type: "angle", c: O2, a: [a, 0], b: s.pts.A!, r: 16, key: "crank", value: th, z: 1.2 },
    ];
  },
  plot: { label: "Output rocker angle", unit: "°", f: (s) => Math.atan2(s.pts.D![1] - O6[1], s.pts.D![0] - O6[0]) / D2R - 360 },
});
