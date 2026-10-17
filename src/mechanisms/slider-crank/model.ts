// Slider-crank (catalogue "slider-crank"): in-line, crank r 35, connecting rod l 110, guide along +x through the crank
// axis. x = r cos θ + sqrt(l² - r² sin² θ); stroke 2r = 70 mm from x 75 to 145; rod obliquity up to 18.6°.
import { D2R } from "../../core/geom";
import { V } from "../../core/vec";
import { defineMechanism } from "../../model/define";
import type { Vec2 } from "../../model/types";
import { P } from "../../parts";

export const r = 35;
export const l = 110;
const O: Vec2 = [0, 0];

/**
 * Plating offsets from the layer grid (K1), applied by the polish: the crank rides 2.5 mm up so the crank pin overhang
 * under the rod is 1.5 mm (A9); the crosshead cap rides 2.5 mm down, 1.5 mm over the rod.
 */
export const PLATING: Record<string, number> = { crank: 2.5, cap: -2.5 };

export default defineMechanism({
  id: "slider-crank",
  input: { kind: "rotary", part: "crank" },
  parts: [
    P.link("crank", r, { role: "driver", w: 19, between: ["O", "A"] }),
    P.link("rod", l, { layer: 1, w: 16, between: ["A", "B"], name: "Connecting rod" }),
    P.slider("block", 36, 20, { at: "B", name: "Crosshead" }),
    // the crosshead's cap: with the block it makes a clevis round the wrist pin (A9), reaching over the rod from the side
    // the rod never swings to
    P.plate("cap", [[0, 0], [14, 0]], { role: "output", layer: 2, r: 7, at: "B", name: "Crosshead cap" }),
    ...P.rails("rail", 52, l + r + 30, 20, { name: "Guide rail" }),
    P.cap("pO", -1, 7, { fixed: [0, 0, 0], accent: true }),
    P.cap("pA", 0, 5.5, { at: "A" }),
    P.cap("pB", 0, 5.5, { at: "B", span: 2 }),
  ],
  traceZ: 16.8,
  solve(u) {
    const A = V.at(O, u, r);
    const B: Vec2 = [A[0] + Math.sqrt(l * l - A[1] * A[1]), 0];
    return { pts: { O, A, B }, phi: Math.asin(-A[1] / l) };
  },
  paths: ["A"],
  vel: ["B", "A"],
  forces: (s) => [
    { type: "axial", a: s.pts.A!, b: s.pts.B!, key: "rod" },
    { type: "spin", c: O, r: 28, key: "input", z: 1.2 },
  ],
  angles: (s) => [{ type: "angle", c: s.pts.B!, a: [s.pts.B![0] - 40, 0], b: s.pts.A!, r: 26, key: "obliquity", value: Math.abs((s.phi as number) / D2R) }],
  plot: { label: "Slider position", unit: "mm", f: (s) => s.pts.B![0] },
});
