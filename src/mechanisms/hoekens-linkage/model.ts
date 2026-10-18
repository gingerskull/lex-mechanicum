// Hoekens linkage (catalogue "hoekens-linkage"): scale s 40; crank a = s, ground d = 2s, rocker c = 2.5s, coupler AB b = 2.5s,
// and the coupler extended along AB to a tip T at e = 5s from A. Grashof (crank shortest), so the crank turns fully; for
// crank 90° to 270° the tip runs along the line y = 4s = 160 over x 0 to 160 (deviation under 0.4 mm) at nearly constant
// speed, then returns along a raised arc. Solve as in the catalogue: B = circleX(A, b, O4, c, +1), T = A + e (unit AB).
import { D2R, clamp } from "../../core/geom";
import { V, circleX } from "../../core/vec";
import { defineMechanism } from "../../model/define";
import type { Vec2 } from "../../model/types";
import { P, heights } from "../../parts";

export const s = 40;
const a = s;
const d = 2 * s;
const b = 2.5 * s;
const c = 2.5 * s;
const e = 5 * s;
const O2: Vec2 = [0, 0];
const O4: Vec2 = [d, 0];

/** Plating (K1: heights may change, centres may not): the coupler sits 2.5 mm under its layer so the crank pin overhang is 1.5 mm (A9). */
const COUPLER_DZ = -2.5;
/** Boss radii of the tapered links (D1): the input boss round the keyed Ø10 shaft, the pin bosses round their bearings. */
const CRANK_R: [number, number] = [13, 9.5];
const ROCKER_R: [number, number] = [12, 9.5];

const tracer = P.tracer("tip", 1, { at: "T", name: "Coupler tip", dz: COUPLER_DZ });

/** The three moving points for a crank angle, on the one assembly branch (+1, B above the ground line). */
function pose(u: number): { A: Vec2; B: Vec2; T: Vec2 } {
  const A = V.at(O2, u, a);
  const B = circleX(A, b, O4, c, 1);
  return { A, B, T: V.at(A, V.ang(A, B), e) };
}

/** Mean tip speed per radian of crank over a full turn, for the plot. */
const MEAN = (() => {
  const N = 720;
  let len = 0;
  let prev = pose(0).T;
  for (let i = 1; i <= N; i++) {
    const T = pose((i / N) * 2 * Math.PI).T;
    len += Math.hypot(T[0] - prev[0], T[1] - prev[1]);
    prev = T;
  }
  return len / (2 * Math.PI);
})();

export default defineMechanism({
  id: "hoekens-linkage",
  input: { kind: "rotary", part: "crank" },
  parts: [
    P.link("crank", a, { role: "driver", r: CRANK_R, between: ["O2", "A"] }),
    P.link("rocker", c, { role: "output", r: ROCKER_R, between: ["O4", "B"], name: "Rocker, rear plate" }),
    // the coupler runs from A through B on to the tip T
    P.plate("coupler", [[0, 0], [b, 0], [e, 0]], { layer: 1, r: 10, dz: COUPLER_DZ, role: "output", between: ["A", "T"] }),
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
    const { A, B, T } = pose(u);
    return { pts: { O2, O4, A, B, T }, th: u };
  },
  paths: ["T"],
  vel: ["T", "B"],
  forces: (st) => [
    { type: "axial", a: st.pts.A!, b: st.pts.B!, key: "coupler" },
    { type: "spin", c: O2, r: 30, key: "input", z: 1.2 },
  ],
  angles(st, u) {
    const v1 = V.sub(st.pts.A!, st.pts.B!);
    const v2 = V.sub(O4, st.pts.B!);
    const mu = Math.acos(clamp((v1[0] * v2[0] + v1[1] * v2[1]) / (b * c), -1, 1)) / D2R;
    const th = ((((u / D2R) % 360) + 360) % 360);
    return [
      { type: "angle", c: st.pts.B!, a: st.pts.A!, b: O4, r: 22, key: "transmission", value: mu, warn: mu < 40 || mu > 140 },
      { type: "angle", c: O2, a: [a, 0], b: st.pts.A!, r: 16, key: "crank", value: th, z: 1.2 },
    ];
  },
  // the tip's speed as a percentage of its mean, by a central difference of the solved tip
  plot: {
    label: "Tip speed, % of mean",
    unit: "%",
    f: (_st, u) => {
      const h = 1e-4;
      const p0 = pose(u - h).T;
      const p1 = pose(u + h).T;
      return (100 * Math.hypot(p1[0] - p0[0], p1[1] - p0[1])) / (2 * h) / MEAN;
    },
  },
});
