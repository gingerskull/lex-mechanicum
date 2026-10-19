// Bell crank (catalogue "bell-crank"): an L-shaped lever pivoted at O with arm OA 60 mm along -y and arm OB 40 mm along
// +x, 90° apart. The input rod (120 mm) joins A to a slider on the horizontal line y = -60; the output rod (100 mm)
// joins B to a slider in the vertical guide x = 40. The lever swings ±20°: the input slider travels about 41 mm and the
// output slider about 27 mm, mechanical advantage r1 / r2 = 1.5. The model runs on the lever angle and derives both
// sliders, as the locomotive drive does with its crosshead; the input is the slider the drive pulls.
import { D2R } from "../../core/geom";
import { V, osc } from "../../core/vec";
import { defineMechanism } from "../../model/define";
import type { Vec2 } from "../../model/types";
import { P } from "../../parts";

const r1 = 60;
const r2 = 40;
const Lin = 120;
const Lout = 100;
const swing = 20 * D2R;
/** The guide of the output rod stands on x = 40, so the rod is vertical with the lever at mid swing. */
const GX = r2;
const SY = -r1;
const O: Vec2 = [0, 0];

/**
 * Plating (K1: heights may change, centres may not), after the locomotive drive: the sliders and their guide bars sit
 * 5 mm under layer 1 and the rods 5 mm under layer 2, over them, so each rod runs clear over the keeper that laps its
 * slider (single shear at the sliders, forced by the keeper). The lever is a clevis (A9): a rear plate under the rods
 * (layer 1, 2.5 mm low, 1.5 mm below them) and a front plate over them (layer 3, 7.5 mm low), so A and B work in
 * double shear.
 */
const SLIDE_DZ = -5;
const ROD_DZ = -5;
const LEVER_DZ = -2.5;
const FRONT_DZ = -7.5;
/** Boss radii of the tapered rods (D1): the pin bosses round their bearings. */
const ROD_R: [number, number] = [9.5, 9.5];

export default defineMechanism({
  id: "bell-crank",
  input: { kind: "linear", part: "carriage" },
  parts: [
    P.plate("lever", [[0, 0], [r2, 0], [0, -r1]], { layer: 1, dz: LEVER_DZ, r: 12, between: ["O", "B"], name: "Bell crank, rear plate" }),
    P.plate("lever-front", [[0, 0], [r2, 0], [0, -r1]], { layer: 3, dz: FRONT_DZ, twin: "lever", r: 12, between: ["O", "B"], name: "Bell crank, front plate" }),
    P.link("rod-in", Lin, { layer: 2, dz: ROD_DZ, r: ROD_R, between: ["S", "A"], name: "Input rod" }),
    P.link("rod-out", Lout, { role: "output", layer: 2, dz: ROD_DZ, r: ROD_R, between: ["B", "G"], name: "Output rod" }),
    P.slider("carriage", 36, 20, { role: "driver", layer: 1, dz: SLIDE_DZ, at: "S", name: "Input carriage" }),
    ...P.rails("in-guide", -176, -76, 20, { layer: 1, fixed: [0, SY, 0], name: "Input guide bar" }).map((p) => ({ ...p, dz: SLIDE_DZ })),
    P.slider("slide-out", 36, 20, { role: "output", layer: 1, dz: SLIDE_DZ, at: "G", spin: () => Math.PI / 2, name: "Output slider" }),
    ...P.rails("out-guide", 60, 160, 20, { layer: 1, fixed: [GX, 0, Math.PI / 2], name: "Output guide bar" }).map((p) => ({ ...p, dz: SLIDE_DZ })),
    P.cap("pO", -1, 7, { fixed: [0, 0, 0], span: 4 }),
    P.cap("pA", 1, 5.5, { at: "A", span: 2 }),
    P.cap("pB", 1, 5.5, { at: "B", span: 2 }),
    P.cap("pS", 1, 5.5, { at: "S", span: 1, accent: true }),
    P.cap("pG", 1, 5.5, { at: "G", span: 1 }),
  ],
  traceZ: 31,
  solve(u) {
    const phi = osc(-swing, swing)(u);
    const A = V.at(O, phi, 0, -r1);
    const B = V.at(O, phi, r2, 0);
    // the input slider on y = -60, the rod 120 mm to its left of A; the output slider on x = 40, the rod 100 mm above B
    const S: Vec2 = [A[0] - Math.sqrt(Lin * Lin - (A[1] - SY) ** 2), SY];
    const G: Vec2 = [GX, B[1] + Math.sqrt(Lout * Lout - (B[0] - GX) ** 2)];
    return { pts: { O, A, B, S, G }, th: phi, phi };
  },
  paths: ["B"],
  vel: ["G", "S"],
  forces: (s) => [
    { type: "axial", a: s.pts.S!, b: s.pts.A!, key: "input rod" },
    { type: "axial", a: s.pts.B!, b: s.pts.G!, key: "output rod" },
  ],
  angles: (s) => [{ type: "angle", c: O, a: [0, -r1], b: s.pts.A!, r: 28, key: "lever", value: ((s.phi as number) / D2R), z: 1.2 }],
  plot: { label: "Output rod position", unit: "mm", f: (s) => s.pts.G![1] - (Lout - 0) },
});
