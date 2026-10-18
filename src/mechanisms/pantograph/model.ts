// Pantograph (catalogue "pantograph"): two arms of 2h = 110 mm hinged at the elbow A, and two bars of h = 55 mm joining
// their midpoints M1, M2 to the stylus T, so M1-A-M2-T is a rhombus. T = (O + E) / 2: O, T and E stay on one line and
// the pen E copies the stylus T at k = 2. Two degrees of freedom: solve(u) drives the stylus round a five-lobed flower
// centred at (72, 14), r = 25 + 5 cos 5u, and the arms follow on branch +1 (elbow above the line OE, under 160°).
import { ring, taper } from "../../core/geom";
import { V, circleX } from "../../core/vec";
import { defineMechanism } from "../../model/define";
import type { Vec2 } from "../../model/types";
import { P, heights } from "../../parts";

const h = 55;
const k = 2;
const cx = 72;
const cy = 14;
const r0 = 25;
const O: Vec2 = [0, 0];

/**
 * Plating (K1: heights may change, centres may not). The arm O-A and the bar T-M2 are the middle plates of every joint
 * (layer 1, 2.5 mm under it); the arm A-E and the bar M1-T are clevis pairs round them, rear plate at layer 0 and front
 * plate at layer 2, 5 mm under it, 1.5 mm clear of the middle plates (A9). Only parts that never cross share a plane.
 */
const MID_DZ = -2.5;
const FRONT_DZ = -5;
/** Boss radii of the tapered links (D1): the input boss round the keyed Ø10 shaft, the pin bosses round their bearings. */
const ARM_O: [number, number] = [13, 9.5];
const ARM_E: [number, number] = [9.5, 9];
const BAR: [number, number] = [9.5, 9.5];

/** The pen is carried by the rear plate alone, past the end of the front one. */
const pen = P.tracer("pen", 0, { at: "E", name: "Pen" });
/** The front plate of the elbow arm clevis ends 20 mm short of the pen (the clevis is needed at A and M2 only). */
const FRONT_LEN = 2 * h - 20;

export default defineMechanism({
  id: "pantograph",
  input: { kind: "manual", part: "armO" },
  parts: [
    P.link("armO", 2 * h, { role: "driver", r: ARM_O, layer: 1, dz: MID_DZ, between: ["O", "A"], name: "Arm O-A" }),
    P.link("armE", 2 * h, { role: "output", r: ARM_E, between: ["A", "E"], name: "Arm A-E, rear plate" }),
    P.custom("armE-front", taper(FRONT_LEN, ARM_E[0], 9.5), { role: "output", layer: 2, dz: FRONT_DZ, twin: "armE", between: ["A", "E"], name: "Arm A-E, front plate", marks: [ring(ARM_E[0] - 1.6), ring(7.9, FRONT_LEN, 0)] }),
    P.link("barM1", h, { r: BAR, between: ["M1", "T"], name: "Bar M1-T, rear plate" }),
    P.link("barM1-front", h, { r: BAR, layer: 2, dz: FRONT_DZ, twin: "barM1", between: ["M1", "T"], name: "Bar M1-T, front plate" }),
    P.link("barM2", h, { r: BAR, layer: 1, dz: MID_DZ, between: ["T", "M2"], name: "Bar T-M2" }),
    P.cap("pO", -1, 7, { fixed: [0, 0, 0], span: 2, accent: true }),
    P.cap("pA", 0, 5.5, { at: "A", span: 3 }),
    P.cap("pM1", 0, 5.5, { at: "M1", span: 3 }),
    P.cap("pM2", 0, 5.5, { at: "M2", span: 3 }),
    P.cap("pT", 0, 5.5, { at: "T", span: 3 }),
    pen,
  ],
  traceZ: heights(pen)[1],
  solve(u) {
    const r = r0 + 5 * Math.cos(5 * u);
    const T: Vec2 = [cx + r * Math.cos(u), cy + r * Math.sin(u)];
    const E = V.mul(T, k);
    // one assembly branch throughout: the elbow above the line OE
    const A = circleX(O, 2 * h, E, 2 * h, 1);
    const M1 = V.mul(A, 0.5);
    const M2 = V.lerp(A, E, 0.5);
    return { pts: { O, A, E, M1, M2, T }, th: V.ang(O, A) };
  },
  paths: ["E", "T"],
  vel: ["E", "T"],
  forces: (s) => [
    { type: "axial", a: s.pts.O!, b: s.pts.A!, key: "arm" },
    { type: "axial", a: s.pts.M1!, b: s.pts.T!, key: "bar" },
  ],
  angles(s) {
    const { A, O, E } = s.pts as Record<string, Vec2>;
    const v1 = V.sub(O!, A!);
    const v2 = V.sub(E!, A!);
    const elbow = Math.acos(Math.max(-1, Math.min(1, (v1[0] * v2[0] + v1[1] * v2[1]) / (4 * h * h)))) * (180 / Math.PI);
    return [{ type: "angle", c: A!, a: O!, b: E!, r: 24, key: "elbow", value: elbow, warn: elbow > 150 }];
  },
  plot: { label: "Scale OE / OT", unit: "", f: (s) => V.len(s.pts.E!) / V.len(s.pts.T!) },
});
