// Antiparallelogram linkage (catalogue "antiparallelogram"): two equal long cranks a = c = 100 on pivots O2 (0, 0) and
// O4 (40, 0), a short coupler b = 40 equal to the frame d, crossed assembly. The long links cross at X, which runs the
// ellipse |O2X| + |O4X| = a (foci O2, O4). At 0° and 180° the links are collinear (change points); the crossed branch
// is kept through them by flipping the side of the circle intersection there, where the other branch would be the
// parallelogram. Speed ratio |O2X| / |O4X|, 0.43 to 2.33.
import { D2R } from "../../core/geom";
import { V, circleX } from "../../core/vec";
import { defineMechanism } from "../../model/define";
import type { Vec2 } from "../../model/types";
import { P, heights } from "../../parts";

const a = 100;
const b = 40;
const c = 100;
const d = 40;
const O2: Vec2 = [0, 0];
const O4: Vec2 = [d, 0];

/** Boss radii of the tapered cranks (D1): the input boss round the keyed Ø10 shaft, the pin bosses round their bearings. */
const CRANK_R: [number, number] = [13, 9.5];
const FOLLOWER_R: [number, number] = [12, 9.5];

/**
 * Plating (K1: heights may change, centres may not): the coupler sits 2.5 mm under its layer so the pin overhang at A is
 * 1.5 mm (A9); the follower, above it and 2 mm up, passes over the head of A (top at 20.7) and over the crank's hub at O2.
 */
const COUPLER_DZ = -2.5;
const FOLLOWER_DZ = 2;

const tracer = P.tracer("X", 3, { at: "X", name: "Crossing point" });

export default defineMechanism({
  id: "antiparallelogram",
  input: { kind: "rotary", part: "crank" },
  parts: [
    P.link("crank", a, { role: "driver", r: CRANK_R, between: ["O2", "A"], name: "Crank (input)" }),
    P.link("coupler", b, { r: [9.5, 9.5], layer: 1, dz: COUPLER_DZ, between: ["A", "B"], name: "Coupler" }),
    P.link("follower", c, { role: "output", r: FOLLOWER_R, layer: 2, dz: FOLLOWER_DZ, between: ["O4", "B"], name: "Follower" }),
    P.cap("pO2", -1, 7, { fixed: [0, 0, 0], accent: true }),
    P.cap("pO4", 2, 7, { fixed: [d, 0, 0], span: 1 }),
    P.cap("pA", 0, 5.5, { at: "A", span: 1 }),
    P.cap("pB", 1, 5.5, { at: "B", span: 1 }),
    tracer,
  ],
  traceZ: heights(tracer)[1],
  solve(u) {
    const A = V.at(O2, u, a);
    // the crossed branch: the side flips with the sign of sin u, at the collinear change points
    const B = circleX(A, b, O4, c, Math.sin(u) >= 0 ? -1 : 1);
    // X: the follower line O4B meets the crank line O2A, on the ellipse |O2X| + |O4X| = a
    // closed form on the ellipse, so it stays defined at the collinear change points: rho = (a² - d²) / (2 (a - d cos u))
    const rho = (a * a - d * d) / (2 * (a - d * Math.cos(u)));
    const X = V.at(O2, u, rho);
    return { pts: { O2, O4, A, B, X }, th: u, th4: V.ang(O4, B) };
  },
  paths: ["X"],
  vel: ["X", "B"],
  forces: (s) => [
    { type: "axial", a: s.pts.A!, b: s.pts.B!, key: "coupler" },
    { type: "spin", c: O2, r: 30, key: "input", z: 1.2 },
  ],
  angles(s, u) {
    const th = ((((u / D2R) % 360) + 360) % 360);
    const th4 = ((((s.th4 as number) / D2R) % 360) + 360) % 360;
    return [
      { type: "angle", c: O2, a: [a, 0], b: s.pts.A!, r: 16, key: "crank", value: th, z: 1.2 },
      { type: "angle", c: O4, a: [O4[0] + c, 0], b: s.pts.B!, r: 16, key: "output", value: th4 },
    ];
  },
  plot: { label: "Output crank angle", unit: "°", f: (s) => ((((s.th4 as number) / D2R) % 360) + 360) % 360 },
});
