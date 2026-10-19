// Double-crank (drag-link) linkage (catalogue "double-crank"): crank a 80 on O2 (0, 0), coupler b 100, output crank c 90
// on O4 (40, 0), the frame d 40 the shortest link. Grashof: s + l = 140 <= p + q = 170 with the shortest link fixed, so
// both cranks turn fully: the output speed ratio runs 0.51 to 2.07 and the transmission angle 24° to 78°. Neither
// crank is shorter than the frame, so each sweeps over the other's pivot: three layers, crank, coupler, output crank.
import { D2R, clamp } from "../../core/geom";
import { V, circleX } from "../../core/vec";
import { defineMechanism } from "../../model/define";
import type { Vec2 } from "../../model/types";
import { P, heights } from "../../parts";

const a = 80;
const b = 100;
const c = 90;
const d = 40;
const O2: Vec2 = [0, 0];
const O4: Vec2 = [d, 0];

/** Boss radii of the tapered cranks (D1): the input boss round the keyed Ø10 shaft, the pin bosses round their bearings. */
const CRANK_R: [number, number] = [13, 9.5];
const FOLLOWER_R: [number, number] = [12, 9.5];

/**
 * Plating (K1: heights may change, centres may not): the coupler sits 2.5 mm under its layer so the pin overhang at A is
 * 1.5 mm (A9); the output crank, above it and 2 mm up, passes over the head of A (top at 20.7) and over the input
 * crank's hub at O2.
 */
const COUPLER_DZ = -2.5;
const FOLLOWER_DZ = 2;

const tracer = P.tracer("M", 1, { at: "M", name: "Coupler midpoint", dz: COUPLER_DZ });

export default defineMechanism({
  id: "double-crank",
  input: { kind: "rotary", part: "crank" },
  parts: [
    P.link("crank", a, { role: "driver", r: CRANK_R, between: ["O2", "A"], name: "Crank (input)" }),
    P.link("coupler", b, { r: [9.5, 9.5], layer: 1, dz: COUPLER_DZ, between: ["A", "B"], name: "Coupler" }),
    P.link("follower", c, { role: "output", r: FOLLOWER_R, layer: 2, dz: FOLLOWER_DZ, between: ["O4", "B"], name: "Output crank" }),
    P.cap("pO2", -1, 7, { fixed: [0, 0, 0], accent: true }),
    P.cap("pO4", 2, 7, { fixed: [d, 0, 0], span: 1 }),
    P.cap("pA", 0, 5.5, { at: "A", span: 1 }),
    P.cap("pB", 1, 5.5, { at: "B", span: 1 }),
    tracer,
  ],
  traceZ: heights(tracer)[1],
  solve(u) {
    const A = V.at(O2, u, a);
    // one assembly branch throughout (+1); with the shortest link fixed there is no change point to cross
    const B = circleX(A, b, O4, c, 1);
    const M: Vec2 = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
    return { pts: { O2, O4, A, B, M }, th: u, th4: V.ang(O4, B) };
  },
  paths: ["M"],
  vel: ["M", "B"],
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
  plot: { label: "Output crank angle", unit: "°", f: (s) => ((((s.th4 as number) / D2R) % 360) + 360) % 360 },
});
