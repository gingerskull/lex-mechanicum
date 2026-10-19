// Eccentric sheave and strap (catalogue "eccentric-sheave"): a disc R 40 keyed to the shaft at O, its centre E offset
// by e = 12; the strap rides round it and, rigid with the eccentric rod, pushes the valve rod's block at V, 150 from E,
// along the guide line y = 0. A slider-crank with crank radius e: x = e cos θ + sqrt(l² - e² sin² θ), travel 2e = 24 mm
// (x 138 to 162), rod obliquity up to 4.6°. The catalogue's angular advance is a phase against a main crank this model
// does not have: the sheave angle is the cycle phase (K6). The strap's ring is the crank pin's bearing, so there is no
// pin at E: the polish builds the bronze liner between sheave and strap.
import { D2R, circle, ring, taper } from "../../core/geom";
import { V } from "../../core/vec";
import { defineMechanism } from "../../model/define";
import type { Vec2 } from "../../model/types";
import { P } from "../../parts";

export const e = 12;
export const R = 40;
export const l = 150;
/** The strap's bore (the liner sits between the sheave and it) and its outer radius round E. */
export const Rbore = 42;
export const Rstrap = 55;
const O: Vec2 = [0, 0];

export default defineMechanism({
  id: "eccentric-sheave",
  input: { kind: "rotary", part: "sheave" },
  parts: [
    // the sheave: a disc round E, keyed to the shaft at O, in the strap's plane
    P.custom("sheave", circle(R, e, 0, 96), { role: "driver", layer: 1, between: ["O", "E"], name: "Eccentric sheave Ø80", marks: [ring(R - 4, e, 0), ring(7.9)] }),
    // the strap and its rod: the ring round the sheave tapering to the valve rod's wrist pin
    P.custom("strap", taper(l, Rstrap, 8.5), { layer: 1, between: ["E", "V"], holes: [circle(Rbore, 0, 0, 96)], name: "Strap and eccentric rod", marks: [ring(Rstrap - 3), ring(6.9, l, 0)] }),
    P.slider("block", 36, 20, { at: "V", name: "Valve rod block" }),
    P.plate("cap", [[0, 0], [14, 0]], { role: "output", layer: 2, r: 7, dz: -2.5, twin: "block", at: "V", name: "Valve rod cap" }),
    ...P.rails("rail", 118, 195, 20, { name: "Guide rail" }),
    P.cap("pO", -1, 7, { fixed: [0, 0, 0], accent: true, span: 2 }),
    P.cap("pV", 0, 5.5, { at: "V", span: 2 }),
  ],
  traceZ: 16.8,
  solve(u) {
    const E = V.at(O, u, e);
    const Vp: Vec2 = [E[0] + Math.sqrt(l * l - E[1] * E[1]), 0];
    return { pts: { O, E, V: Vp }, phi: Math.asin(-E[1] / l) };
  },
  paths: ["E"],
  vel: ["V", "E"],
  forces: (s) => [
    { type: "axial", a: s.pts.E!, b: s.pts.V!, key: "rod" },
    { type: "spin", c: O, r: 28, key: "input", z: 1.2 },
  ],
  angles: (s) => [{ type: "angle", c: s.pts.V!, a: [s.pts.V![0] - 50, 0], b: s.pts.E!, r: 30, key: "obliquity", value: Math.abs((s.phi as number) / D2R) }],
  plot: { label: "Valve rod position", unit: "mm", f: (s) => s.pts.V![0] },
});
