// Slider-crank (catalogue "slider-crank"): in-line, crank r 35, connecting rod l 110, guide along +x through the crank
// axis. x = r cos θ + sqrt(l² - r² sin² θ); stroke 2r = 70 mm from x 75 to 145; rod obliquity up to 18.6°.
import { D2R, ring, roundedPoly } from "../../core/geom";
import { V } from "../../core/vec";
import { defineMechanism } from "../../model/define";
import type { Vec2 } from "../../model/types";
import { P } from "../../parts";

export const r = 35;
export const l = 110;
const O: Vec2 = [0, 0];

/** Crank: pin boss, input boss and a counterweight lobe opposite the pin (M2), boss radius 9.5. */
const CW: Vec2[] = [[r, 0], [-16, 13], [-16, -13]];

export default defineMechanism({
  id: "slider-crank",
  input: { kind: "rotary", part: "crank" },
  parts: [
    // plated 2.5 mm up so the crank pin overhang under the rod is 1.5 mm (A9); the rod cannot come down instead, the
    // slide's keeper runs under it
    P.custom("crank", roundedPoly(CW, 9.5), { role: "driver", dz: 2.5, between: ["O", "A"], name: "Counterweighted crank", marks: [ring(7.9), ring(7.9, r, 0), ring(11.4)] }),
    P.link("rod", l, { layer: 1, r: [8.5, 8], between: ["A", "B"], name: "Connecting rod" }),
    P.slider("block", 36, 20, { at: "B", name: "Crosshead" }),
    // the crosshead's cap: with the block it makes a clevis round the wrist pin (A9), reaching over the rod from the side
    // the rod never swings to
    P.plate("cap", [[0, 0], [14, 0]], { role: "output", layer: 2, r: 7, dz: -2.5, twin: "block", at: "B", name: "Crosshead cap" }),
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
