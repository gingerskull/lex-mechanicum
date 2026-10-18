// Offset slider-crank (catalogue "offset-slider-crank"): crank r 30, connecting rod l 100, guide along +x on the line
// y = e = 20, above the crank axis. x = r cos θ + sqrt(l² - (e - r sin θ)²); outer dead centre x 128.5, inner 67.1,
// stroke 61.4 mm. The dead centres are 187.8° and 172.2° of crank angle apart: time ratio 1.09:1 (K6).
import { D2R, ring, roundedPoly } from "../../core/geom";
import { V } from "../../core/vec";
import { defineMechanism } from "../../model/define";
import type { Vec2 } from "../../model/types";
import { P } from "../../parts";

export const r = 30;
export const l = 100;
export const e = 20;
const O: Vec2 = [0, 0];

/** Crank: pin boss, input boss and a counterweight lobe opposite the pin (M2), boss radius 9.5. */
const CW: Vec2[] = [[r, 0], [-14, 13], [-14, -13]];

export default defineMechanism({
  id: "offset-slider-crank",
  input: { kind: "rotary", part: "crank" },
  parts: [
    // plated 2.5 mm up so the crank pin overhang under the rod is 1.5 mm (A9); the rod cannot come down instead, the
    // slide's keeper runs under it
    P.custom("crank", roundedPoly(CW, 9.5), { role: "driver", dz: 2.5, between: ["O", "A"], name: "Counterweighted crank", marks: [ring(7.9), ring(7.9, r, 0), ring(11.4)] }),
    P.link("rod", l, { layer: 1, r: [8.5, 8], between: ["A", "B"], name: "Connecting rod" }),
    P.slider("block", 36, 20, { at: "B", name: "Crosshead" }),
    // the crosshead's cap: with the block it makes a clevis round the wrist pin (A9), on the side the rod never swings to
    P.plate("cap", [[0, 0], [14, 0]], { role: "output", layer: 2, r: 7, dz: -2.5, twin: "block", at: "B", name: "Crosshead cap" }),
    ...P.rails("rail", 52, l + r + 30, 20, { fixed: [0, e, 0], name: "Guide rail" }),
    P.cap("pO", -1, 7, { fixed: [0, 0, 0], accent: true }),
    P.cap("pA", 0, 5.5, { at: "A" }),
    P.cap("pB", 0, 5.5, { at: "B", span: 2 }),
  ],
  traceZ: 16.8,
  solve(u) {
    const A = V.at(O, u, r);
    const B: Vec2 = [A[0] + Math.sqrt(l * l - (e - A[1]) ** 2), e];
    return { pts: { O, A, B }, phi: Math.asin((e - A[1]) / l) };
  },
  paths: ["A"],
  vel: ["B", "A"],
  forces: (s) => [
    { type: "axial", a: s.pts.A!, b: s.pts.B!, key: "rod" },
    { type: "spin", c: O, r: 28, key: "input", z: 1.2 },
  ],
  angles: (s) => [{ type: "angle", c: s.pts.B!, a: [s.pts.B![0] - 40, e], b: s.pts.A!, r: 26, key: "obliquity", value: Math.abs((s.phi as number) / D2R) }],
  plot: { label: "Slider position", unit: "mm", f: (s) => s.pts.B![0] },
});
