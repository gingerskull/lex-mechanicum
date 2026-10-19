// Roberts' linkage (catalogue "roberts-linkage"): ground 2b = 100 between O1 (-50, 0) and O2 (50, 0), two equal rockers
// a = 70, and an isosceles triangular coupler with base b = 50 between the rocker tips (B1, C1) and sides a to the apex
// P, which lies on the ground side. The left rocker swings 50° to 84°; P runs x -40 to 40 along y = 0, within 0.4 mm.
// The rockers never cross and never meet in the swing, so both ride the base layer (the right one 2 mm up); the coupler
// sits above them.
import { D2R } from "../../core/geom";
import { V, circleX, osc } from "../../core/vec";
import { defineMechanism } from "../../model/define";
import type { Vec2 } from "../../model/types";
import { P, heights } from "../../parts";

const b = 50;
const a = 70;
const O1: Vec2 = [-b, 0];
const O2: Vec2 = [b, 0];
/** Height of the apex under the base B1C1, so that |B1P| = |C1P| = a. */
const h = Math.sqrt(a * a - (b * b) / 4);
const LO = 50 * D2R;
const HI = 84 * D2R;

/** Plating (K1: heights may change, centres may not): the coupler sits 1.7 mm over its layer so it clears the circlip that ends the O2 axle under the apex's sweep (A14). */
const COUPLER_DZ = 1.7;
/** The right rocker rides 2 mm up so the flange and clamp screws of the eccentric bushing at O2 (F7) pass under it. */
const ROCKER_DZ = 2;
/** Boss radii of the tapered rockers (D1): the input boss round the keyed Ø10 shaft, the pin bosses round their bearings. */
const ROCKER_L_R: [number, number] = [13, 9.5];
const ROCKER_R_R: [number, number] = [12, 9.5];

const tracer = P.tracer("apex", 1, { at: "P", name: "Coupler apex", dz: COUPLER_DZ });

export default defineMechanism({
  id: "roberts-linkage",
  input: { kind: "oscillating", part: "rockerL" },
  parts: [
    P.link("rockerL", a, { role: "driver", r: ROCKER_L_R, between: ["O1", "B1"], name: "Left rocker (input)" }),
    P.link("rockerR", a, { role: "output", dz: ROCKER_DZ, r: ROCKER_R_R, between: ["O2", "C1"], name: "Right rocker" }),
    // the isosceles triangle, local x along B1 to C1, the apex P on the right-hand side of that direction (the ground side)
    P.plate("coupler", [[0, 0], [b, 0], [b / 2, -h]], { layer: 1, r: 9.5, dz: COUPLER_DZ, role: "output", between: ["B1", "C1"], name: "Coupler triangle" }),
    P.cap("pO1", -1, 7, { fixed: [O1[0], O1[1], 0], accent: true }),
    P.cap("pO2", -1, 7, { fixed: [O2[0], O2[1], 0], span: 1 }),
    P.cap("pB1", 0, 5.5, { at: "B1" }),
    P.cap("pC1", 0, 5.5, { at: "C1", span: 2 }),
    tracer,
  ],
  traceZ: heights(tracer)[1],
  solve(u) {
    const th = osc(LO, HI)(u);
    const B1 = V.at(O1, th, a);
    // one assembly branch throughout: the rockers uncrossed, leaning the same way
    const C1 = circleX(B1, b, O2, a, 1);
    const m: Vec2 = [(B1[0] + C1[0]) / 2, (B1[1] + C1[1]) / 2];
    const dx = C1[0] - B1[0];
    const dy = C1[1] - B1[1];
    // right-hand normal of B1 to C1 (the ground side)
    const Pp: Vec2 = [m[0] + (h * dy) / b, m[1] - (h * dx) / b];
    return { pts: { O1, O2, B1, C1, P: Pp }, th };
  },
  paths: ["P"],
  vel: ["P", "B1"],
  forces: (s) => [
    { type: "axial", a: s.pts.C1!, b: O2, key: "rocker" },
    { type: "axial", a: s.pts.B1!, b: s.pts.C1!, key: "coupler" },
    { type: "spin", c: O1, r: 30, key: "input", z: 1.2 },
  ],
  angles(s) {
    const v1 = V.sub(s.pts.C1!, s.pts.B1!);
    const v2 = V.sub(O1, s.pts.B1!);
    const mu = Math.acos(Math.max(-1, Math.min(1, (v1[0] * v2[0] + v1[1] * v2[1]) / (b * a)))) / D2R;
    return [
      { type: "angle", c: s.pts.B1!, a: s.pts.C1!, b: O1, r: 22, key: "transmission", value: mu, warn: mu < 40 || mu > 140 },
      { type: "angle", c: O1, a: [O1[0] + a, 0], b: s.pts.B1!, r: 22, key: "crank", value: (s.th as number) / D2R, z: 1.2 },
    ];
  },
  plot: { label: "Apex offset from the pivot line", unit: "mm", f: (s) => s.pts.P![1] },
});
