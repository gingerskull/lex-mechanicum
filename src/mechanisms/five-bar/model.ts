// Five-bar linkage, geared (catalogue "five-bar"): pivots O1 (0, 0) and O2 (50, 0), proximal arms l1 60, distal arms l2 80
// meeting at the tip P. Mobility 3(5 - 1) - 2·5 = 2; a gear pair between the two cranks (the catalogue's 1-DOF
// variant) fixes the second input to the first: a 22-tooth gear on the left crank meshes a 28-tooth gear on the right,
// module 2, pitch radii 22 + 28 = 50 = d, so thetaR = k - (22 / 28) thetaL. The cranks cannot turn fully (the distal
// arms reach only 160 mm across), so the input oscillates: thetaL swings 95° to 145° and the tip P runs up and down a
// curve 47 mm long (x 9 to 19, y 89 to 136). The catalogue's two-motor demo (independent phases) is replaced by this coupling.
// K6: the catalogue's elbows-out, tip-up branch (side +1) is kept.
import { D2R, circle } from "../../core/geom";
import { V, circleX, osc } from "../../core/vec";
import { defineMechanism } from "../../model/define";
import type { Part, Vec2 } from "../../model/types";
import { P } from "../../parts";

const d = 50;
const l1 = 60;
const l2 = 80;
const M = 2;
const Z1 = 22;
const Z2 = 28;
/**
 * Gear ratio and the right crank's angle at thetaL = 0, rad: thetaR = K - N thetaL. K is an odd multiple of half a tooth
 * pitch (pi / 28), so the gear keyed to the right crank turns with it (it is the crank's twin) and still meshes.
 */
const N = Z1 / Z2;
const K = (27 * Math.PI) / 28;
/** The right crank's swing, rad: thetaL 155° to 85° mapped through the gear pair. */
const LO = 95 * D2R;
const HI = 145 * D2R;
const O1: Vec2 = [0, 0];
const O2: Vec2 = [d, 0];

/**
 * Layers: the cranks lowest, the gears over them on the same keyed shafts (the gear hubs stand up from the gears' top
 * faces), the left distal arm level with the gears (its sweep never reaches them) and the right one above it. Plating
 * (K1: heights may change, centres may not): the arms sit low so the overhangs at the pins are short (A9).
 */
const DISTAL_L_DZ = -2.5;
const DISTAL_R_DZ = -5;
/** Boss radii of the tapered cranks (D1): the shaft boss round the keyed Ø10 shaft, the pin boss round its bearing. */
const CRANK_R: [number, number] = [13, 9.5];
const DISTAL_R: [number, number] = [9.5, 9.5];

/**
 * Keyed Ø10 shafts at both pivots (A3): the gear and the crank on each shaft are keyed to it and turn together, so the
 * gear pair couples the two cranks.
 */
const keyed = (part: Part): Part => {
  part.shape.holes.push(circle(6, 0, 0, 36));
  return part;
};

export default defineMechanism({
  id: "five-bar",
  input: { kind: "oscillating", part: "crankL" },
  parts: [
    P.gear("gearL", Z1, M, { role: "driver", layer: 1, twin: "crankL", at: "O1", spin: (s) => s.a as number, bore: false, name: "Gear, 22 teeth" }),
    P.gear("gearR", Z2, M, { role: "link", layer: 1, twin: "crankR", at: "O2", spin: (s) => s.b as number, bore: false, name: "Gear, 28 teeth" }),
    keyed(P.link("crankL", l1, { role: "driver", layer: 0, r: CRANK_R, between: ["O1", "A"], name: "Left crank (input)" })),
    keyed(P.link("crankR", l1, { layer: 0, r: CRANK_R, between: ["O2", "B"], name: "Right crank" })),
    P.link("distalL", l2, { layer: 1, dz: DISTAL_L_DZ, r: DISTAL_R, between: ["A", "P"], name: "Left distal arm" }),
    P.link("distalR", l2, { role: "output", layer: 2, dz: DISTAL_R_DZ, r: DISTAL_R, between: ["B", "P"], name: "Right distal arm" }),
    P.cap("pO1", -1, 7, { fixed: [0, 0, 0], accent: true, span: 2 }),
    P.cap("pO2", -1, 7, { fixed: [d, 0, 0], span: 2 }),
    P.cap("pA", 0, 5.5, { at: "A", span: 1 }),
    P.cap("pB", 0, 5.5, { at: "B", span: 2 }),
    P.cap("pP", 1, 5.5, { at: "P", span: 1 }),
  ],
  // the traced path is drawn on the right distal arm's top face (z 21), at the tip pin where both arms meet
  traceZ: 22,
  solve(u) {
    const thL = osc(LO, HI)(u);
    const thR = K - N * thL;
    const A = V.at(O1, thL, l1);
    const B = V.at(O2, thR, l1);
    // elbows out, tip up: one assembly branch throughout
    const Pt = circleX(A, l2, B, l2, 1);
    return { pts: { O1, O2, A, B, P: Pt }, th: thL, a: thL, b: K - N * thL };
  },
  paths: ["P"],
  vel: ["P", "A"],
  forces: (s) => [
    { type: "axial", a: s.pts.A!, b: s.pts.P!, key: "left arm" },
    { type: "axial", a: s.pts.B!, b: s.pts.P!, key: "right arm" },
    { type: "spin", c: O1, r: 30, key: "input", z: 1.2 },
  ],
  angles(s) {
    const v1 = V.sub(s.pts.A!, s.pts.P!);
    const v2 = V.sub(s.pts.B!, s.pts.P!);
    const ang = Math.acos(Math.max(-1, Math.min(1, (v1[0] * v2[0] + v1[1] * v2[1]) / (l2 * l2)))) / D2R;
    return [
      { type: "angle", c: s.pts.P!, a: s.pts.A!, b: s.pts.B!, r: 24, key: "at the tip", value: ang, warn: ang < 25 || ang > 155 },
      { type: "angle", c: O1, a: [l1, 0], b: s.pts.A!, r: 20, key: "left crank", value: ((s.th as number) / D2R), z: 1.2 },
    ];
  },
  plot: { label: "Tip height", unit: "mm", f: (s) => s.pts.P![1] },
});
