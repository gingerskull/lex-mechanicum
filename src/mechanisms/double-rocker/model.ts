// Double-rocker linkage (catalogue "double-rocker"): input rocker a 70 on O2 (0, 0), coupler b 40 (the shortest link),
// output rocker c 80 on O4 (100, 0), frame d 100. Grashof: s + l = 140 <= p + q = 150 with the coupler shortest, so
// neither rocker turns fully. The input toggles at 18.2° and 87.9°, where |O4A| = c ± b; it is driven 20° to 86°, inside
// both, and the output rocker follows on one branch (+1): it falls from 133° to 105.6° and back up to 135°.
import { D2R, clamp } from "../../core/geom";
import { V, circleX, osc } from "../../core/vec";
import { defineMechanism } from "../../model/define";
import type { Vec2 } from "../../model/types";
import { P, heights } from "../../parts";

const a = 70;
const b = 40;
const c = 80;
const d = 100;
const swing: [number, number] = [20 * D2R, 86 * D2R];
const O2: Vec2 = [0, 0];
const O4: Vec2 = [d, 0];

/**
 * Plating (K1: heights may change, centres may not): the coupler sits 2.5 mm under its layer so the pin overhang at A is
 * 1.5 mm (A9). The rockers lie along one line at the lower toggle (O4, A, B collinear), so they cannot share a layer:
 * the output rocker rides above the coupler, 2 mm up so it passes over the head of A (top at 20.7).
 */
const COUPLER_DZ = -2.5;
const OUTPUT_DZ = 2;
/** Boss radii of the tapered rockers (D1): the input boss round the keyed Ø10 shaft, the pin bosses round their bearings. */
const INPUT_R: [number, number] = [13, 9.5];
const OUTPUT_R: [number, number] = [12, 9.5];

const tracer = P.tracer("M", 1, { at: "M", name: "Coupler midpoint", dz: COUPLER_DZ });

export default defineMechanism({
  id: "double-rocker",
  input: { kind: "oscillating", part: "rockerIn" },
  parts: [
    P.link("rockerIn", a, { role: "driver", r: INPUT_R, between: ["O2", "A"], name: "Input rocker" }),
    P.link("coupler", b, { r: [9.5, 9.5], layer: 1, dz: COUPLER_DZ, between: ["A", "B"], name: "Coupler" }),
    P.link("rockerOut", c, { role: "output", r: OUTPUT_R, layer: 2, dz: OUTPUT_DZ, between: ["O4", "B"], name: "Output rocker" }),
    P.cap("pO2", -1, 7, { fixed: [0, 0, 0], accent: true }),
    P.cap("pO4", -1, 7, { fixed: [d, 0, 0], span: 3 }),
    P.cap("pA", 0, 5.5, { at: "A", span: 1 }),
    P.cap("pB", 1, 5.5, { at: "B", span: 1 }),
    tracer,
  ],
  traceZ: heights(tracer)[1],
  solve(u) {
    const th = osc(...swing)(u);
    const A = V.at(O2, th, a);
    // one assembly branch throughout (+1): inside the toggle limits the intersection always exists
    const B = circleX(A, b, O4, c, 1);
    const M: Vec2 = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
    return { pts: { O2, O4, A, B, M }, th, th4: V.ang(O4, B) };
  },
  paths: ["M"],
  vel: ["M", "B"],
  forces: (s) => [
    { type: "axial", a: s.pts.A!, b: s.pts.B!, key: "coupler" },
    { type: "spin", c: O2, r: 30, key: "input", z: 1.2 },
  ],
  angles(s) {
    const v1 = V.sub(s.pts.A!, s.pts.B!);
    const v2 = V.sub(O4, s.pts.B!);
    const mu = Math.acos(clamp((v1[0] * v2[0] + v1[1] * v2[1]) / (b * c), -1, 1)) / D2R;
    return [
      { type: "angle", c: s.pts.B!, a: s.pts.A!, b: O4, r: 22, key: "transmission", value: mu, warn: mu < 40 || mu > 140 },
      { type: "angle", c: O2, a: [a, 0], b: s.pts.A!, r: 16, key: "input", value: (s.th as number) / D2R, z: 1.2 },
    ];
  },
  plot: { label: "Output rocker angle", unit: "°", f: (s) => (s.th4 as number) / D2R },
});
