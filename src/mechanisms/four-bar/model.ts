// Four-bar crank-rocker (catalogue "four-bar"): a 40, b 120, c 80, d 100, coupler point 0.45 b along AB and 43 off it.
// Grashof: s + l = 160 <= p + q = 180 with the crank shortest, so the crank turns fully and the rocker swings 73.8°.
import { D2R, clamp } from "../../core/geom";
import { V, circleX } from "../../core/vec";
import { defineMechanism } from "../../model/define";
import type { Vec2 } from "../../model/types";
import { P, heights } from "../../parts";

const a = 40;
const b = 120;
const c = 80;
const d = 100;
const cpx = b * 0.45;
const cpy = 43;
const O2: Vec2 = [0, 0];
const O4: Vec2 = [d, 0];

/**
 * Plating (K1: heights may change, centres may not): the coupler sits 2.5 mm under its layer so the crank pin overhang
 * is 1.5 mm (A9); the rocker's front plate 5 mm under its layer, 1.5 mm over the coupler.
 */
const COUPLER_DZ = -2.5;
/** Boss radii of the tapered links (D1): the input boss round the keyed Ø10 shaft, the pin bosses round their bearings. */
const CRANK_R: [number, number] = [13, 9.5];
const ROCKER_R: [number, number] = [12, 9.5];

const tracer = P.tracer("cp", 1, { at: "C", name: "Coupler point", dz: COUPLER_DZ });

export default defineMechanism({
  id: "four-bar",
  input: { kind: "rotary", part: "crank" },
  parts: [
    P.link("crank", a, { role: "driver", r: CRANK_R, between: ["O2", "A"] }),
    P.link("rocker", c, { role: "output", r: ROCKER_R, between: ["O4", "B"], name: "Rocker, rear plate" }),
    P.plate("coupler", [[0, 0], [b, 0], [cpx, cpy]], { layer: 1, r: 11, dz: COUPLER_DZ, between: ["A", "B"] }),
    // the rocker is a clevis: a front plate above the coupler puts B in double shear (A9)
    P.link("rocker-front", c, { role: "output", r: ROCKER_R, layer: 2, dz: -5, twin: "rocker", between: ["O4", "B"], name: "Rocker, front plate" }),
    P.cap("pO2", -1, 7, { fixed: [0, 0, 0], accent: true }),
    P.cap("pO4", -1, 7, { fixed: [d, 0, 0], span: 3 }),
    P.cap("pA", 0, 5.5, { at: "A" }),
    P.cap("pB", 0, 5.5, { at: "B", span: 2 }),
    tracer,
  ],
  traceZ: heights(tracer)[1],
  solve(u) {
    const A = V.at(O2, u, a);
    // one assembly branch throughout (+1, B above the ground line)
    const B = circleX(A, b, O4, c, 1);
    const C = V.at(A, V.ang(A, B), cpx, cpy);
    return { pts: { O2, O4, A, B, C }, th: u };
  },
  paths: ["C"],
  vel: ["C", "B"],
  forces: (s) => [
    { type: "axial", a: s.pts.A!, b: s.pts.B!, key: "coupler" },
    { type: "spin", c: O2, r: 30, key: "input", z: 1.2 },
  ],
  angles(s, u) {
    const v1 = V.sub(s.pts.A!, s.pts.B!);
    const v2 = V.sub(O4, s.pts.B!);
    const mu = Math.acos(clamp((v1[0] * v2[0] + v1[1] * v2[1]) / (b * c), -1, 1)) / D2R;
    const th = ((((u / D2R) % 360) + 360) % 360);
    return [
      { type: "angle", c: s.pts.B!, a: s.pts.A!, b: O4, r: 22, key: "transmission", value: mu, warn: mu < 40 || mu > 140 },
      { type: "angle", c: O2, a: [a, 0], b: s.pts.A!, r: 16, key: "crank", value: th, z: 1.2 },
    ];
  },
  plot: { label: "Rocker angle", unit: "°", f: (s) => Math.atan2(s.pts.B![1], s.pts.B![0] - d) / D2R },
});
