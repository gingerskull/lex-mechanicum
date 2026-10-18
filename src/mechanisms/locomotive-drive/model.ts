// Locomotive driving gear (catalogue "locomotive-drive"): driving wheels W1 (0, 0) and W2 (80, 0), radius 34, crank pins
// at r 17 on both, in the same phase. The coupling rod C1 to C2 is 80 mm, the axle spacing, so it stays level and only
// translates round a circle of radius 17 (a parallelogram; the antiparallelogram branch is never taken because the
// rod is a translation, not a circle intersection). The main rod X to C1 is 80 mm and drives the crosshead along the
// guide through the axle line: x = r cos θ - sqrt(Lm² - r² sin² θ), stroke 2r = 34 mm from x -97 to -63.
// The model runs on the wheel angle and derives the crosshead, so the animation passes both dead centres. The input
// is the crosshead (the piston pushes it), so the drive is a belt carriage clamped to it.
import { D2R, ring } from "../../core/geom";
import { V } from "../../core/vec";
import { defineMechanism } from "../../model/define";
import type { Vec2 } from "../../model/types";
import { P } from "../../parts";

export const R = 34;
export const sp = 80;
export const r = 17;
export const Lm = 80;
const W1: Vec2 = [0, 0];

/**
 * Plating (K1: heights may change, centres may not): the coupling rod 2.5 mm under its layer so the crank pin overhang
 * above the wheel is short; the main rod 2.5 mm under its layer, over the crosshead, which sits on the rails.
 */
const COUPLING_DZ = -2.5;
const MAIN_DZ = -5;
/** The crosshead and its guide bars sit 5 mm under their layer, so the main rod runs clear over the keeper plate. */
const GUIDE_DZ = -5;
/** Guide rails along the axle line, left of the first wheel: x0, x1 and the gap between them. */
const RAIL: [number, number, number] = [-116, -44, 20];

export default defineMechanism({
  id: "locomotive-drive",
  input: { kind: "linear", part: "crosshead" },
  parts: [
    P.disc("wheel1", R, { role: "output", dz: -8, thick: 14, at: "W1", spin: (s) => s.th as number, marks: [ring(R - 3), ring(r + 9.5, r, 0)], name: "Driving wheel" }),
    P.disc("wheel2", R, { role: "output", dz: -8, thick: 14, at: "W2", spin: (s) => s.th as number, marks: [ring(R - 3), ring(r + 9.5, r, 0)], name: "Coupled wheel" }),
    P.link("coupling", sp, { layer: 1, dz: COUPLING_DZ, r: [9.5, 9.5], between: ["C1", "C2"], name: "Coupling rod" }),
    P.link("main", Lm, { layer: 2, dz: MAIN_DZ, r: [8.5, 10], between: ["X", "C1"], name: "Main rod" }),
    P.slider("crosshead", 26, 20, { role: "driver", layer: 1, dz: GUIDE_DZ, at: "X", name: "Crosshead" }),
    ...P.rails("guide", RAIL[0], RAIL[1], RAIL[2], { layer: 1, name: "Guide bar" }).map((p) => ({ ...p, dz: GUIDE_DZ })),
    P.cap("pW1", -1, 7, { fixed: [0, 0, 0] }),
    P.cap("pW2", -1, 7, { fixed: [sp, 0, 0] }),
    P.cap("pC1", 0, 5.5, { at: "C1", span: 3 }),
    P.cap("pC2", 0, 5.5, { at: "C2", span: 2 }),
    P.cap("pX", 1, 5.5, { at: "X", span: 2, accent: true }),
  ],
  traceZ: 25,
  solve(u) {
    const C1 = V.at(W1, u, r);
    const C2: Vec2 = [C1[0] + sp, C1[1]];
    const X: Vec2 = [C1[0] - Math.sqrt(Lm * Lm - C1[1] * C1[1]), 0];
    return { pts: { W1, W2: [sp, 0], C1, C2, X }, th: u, phi: Math.asin(C1[1] / Lm) };
  },
  paths: ["C1"],
  vel: ["X", "C1"],
  forces: (s) => [
    { type: "axial", a: s.pts.X!, b: s.pts.C1!, key: "main rod" },
    { type: "spin", c: W1, r: R + 8, key: "driving wheel" },
  ],
  angles: (s) => [{ type: "angle", c: s.pts.X!, a: [s.pts.X![0] + 40, 0], b: s.pts.C1!, r: 24, key: "rod angle", value: Math.abs((s.phi as number) / D2R) }],
  plot: { label: "Crosshead position", unit: "mm", f: (s) => s.pts.X![0] },
});
