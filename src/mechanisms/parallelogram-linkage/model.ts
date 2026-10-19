// Parallelogram linkage (catalogue "parallelogram-linkage"): crank a 40 and follower c 40 turn in step on pivots O2 (0, 0)
// and O4 (100, 0), the coupler b 100 equals the frame d, so it stays parallel to the ground line and every point of it
// runs a circle of radius 40. a = c and b = d is a change-point Grashof linkage (s + l = p + q): the parallel branch is
// forced (B = A + (d, 0)) because the solver could otherwise flip to the antiparallelogram at 0° and 180°.
import { D2R } from "../../core/geom";
import { V } from "../../core/vec";
import { defineMechanism } from "../../model/define";
import type { Vec2 } from "../../model/types";
import { P, heights } from "../../parts";

const a = 40;
const b = 100;
const d = 100;
const O2: Vec2 = [0, 0];
const O4: Vec2 = [d, 0];

/** Plating (K1: heights may change, centres may not): the coupler sits 0.5 mm under its layer: it passes over the follower hub at O4, whose axle ends 1.9 mm below the coupler. */
const COUPLER_DZ = -0.5;
/** Boss radii of the tapered cranks (D1): the input boss round the keyed Ø10 shaft, the pin bosses round their bearings. */
const CRANK_R: [number, number] = [13, 9.5];
const FOLLOWER_R: [number, number] = [12, 9.5];

const tracer = P.tracer("mid", 1, { at: "M", name: "Coupler midpoint", dz: COUPLER_DZ });

export default defineMechanism({
  id: "parallelogram-linkage",
  input: { kind: "rotary", part: "crank" },
  parts: [
    P.link("crank", a, { role: "driver", r: CRANK_R, between: ["O2", "A"], name: "Crank (input)" }),
    P.link("follower", a, { role: "output", r: FOLLOWER_R, between: ["O4", "B"], name: "Follower" }),
    P.link("coupler", b, { r: [9.5, 9.5], layer: 1, dz: COUPLER_DZ, between: ["A", "B"], name: "Coupler" }),
    P.cap("pO2", -1, 7, { fixed: [0, 0, 0], accent: true }),
    P.cap("pO4", -1, 7, { fixed: [d, 0, 0] }),
    P.cap("pA", 0, 5.5, { at: "A" }),
    P.cap("pB", 0, 5.5, { at: "B" }),
    tracer,
  ],
  traceZ: heights(tracer)[1],
  solve(u) {
    const A = V.at(O2, u, a);
    // the parallel branch, forced: B = A + (d, 0)
    const B: Vec2 = [A[0] + d, A[1]];
    const M: Vec2 = [A[0] + b / 2, A[1]];
    return { pts: { O2, O4, A, B, M }, th: u, th4: V.ang(O4, B) };
  },
  paths: ["M"],
  vel: ["M", "B"],
  forces: (s) => [
    { type: "axial", a: s.pts.A!, b: s.pts.B!, key: "coupler" },
    { type: "spin", c: O2, r: 30, key: "input", z: 1.2 },
  ],
  angles(s, u) {
    const th = ((((u / D2R) % 360) + 360) % 360);
    return [
      { type: "angle", c: O2, a: [a, 0], b: s.pts.A!, r: 16, key: "crank", value: th, z: 1.2 },
      { type: "angle", c: O4, a: [O4[0] + a, 0], b: s.pts.B!, r: 16, key: "output", value: th },
    ];
  },
  plot: { label: "Follower angle", unit: "°", f: (s) => ((((s.th4 as number) / D2R) % 360) + 360) % 360 },
});
