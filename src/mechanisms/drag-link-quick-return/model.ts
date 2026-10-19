// Drag-link quick-return (catalogue "drag-link-quick-return"): a double-crank four-bar with the ground shortest, d 25
// (O2 at the origin, O4 at (25, 0)), input crank a 60, coupler b 70, output crank c 60 (s + l = 95 <= p + q = 120). The
// output crank carries the ram arm in line with it, on the far side of O4: D at r 50 from O4, B at 60 (the catalogue
// draws D beside B; the far side keeps the two pins 110 apart and only swaps which way the slow stroke runs). A rod L 180
// drives the ram along the ground line y = 0. On the open branch the output crank turns a full revolution at varying
// speed; the ram's extremes fall at output angles 0° and 180°, at input angles 54.5° and 271° (the catalogue's 305.5° and
// 89°, mirrored by the assembly branch): slow stroke 216.5°, fast 143.5°, 1.51:1, stroke 100 mm.
// Both cranks (60) are longer than the ground link (25), so each turns round the other's pivot, and the rod passes over
// A, B, O2 and O4 while O4 turns a full circle about the rod's pin D: no pivot may pass through the crank, the output
// crank or the rod, so no single stack carries O4. The output crank is split: the follower O4-B below a bridge, the ram
// arm O4-D above it, keyed on one shaft that turns in the bridge's bearing. Bottom up: crank, coupler, follower,
// (bridge), ram arm, rod; the input shaft rises from below into the crank only.
import { D2R, ring, roundedPoly } from "../../core/geom";
import { V, circleX } from "../../core/vec";
import { defineMechanism } from "../../model/define";
import type { Solved, Vec2 } from "../../model/types";
import { P } from "../../parts";

export const d = 25;
export const a = 60;
export const b = 70;
export const c = 60;
export const r = 50;
export const L = 180;
const O2: Vec2 = [0, 0];
const O4: Vec2 = [d, 0];

/** Input crank: pin boss, input boss and a counterweight lobe opposite the pin (M2). */
const CW: Vec2[] = [[a, 0], [-16, 13], [-16, -13]];

function solve(u: number): Solved {
  const A = V.at(O2, u, a);
  const B = circleX(A, b, O4, c, 1);
  const phi = V.ang(O4, B);
  // the ram arm in line with the follower, on the far side of O4
  const D = V.at(O4, phi + Math.PI, r);
  const E: Vec2 = [D[0] + Math.sqrt(L * L - D[1] * D[1]), 0];
  return { pts: { O2, O4, A, B, D, E }, phi };
}

export default defineMechanism({
  id: "drag-link-quick-return",
  input: { kind: "rotary", part: "crank" },
  parts: [
    P.custom("crank", roundedPoly(CW, 10), { role: "driver", layer: 0, between: ["O2", "A"], name: "Counterweighted crank", marks: [ring(8.4), ring(8.4, a, 0), ring(11.9)] }),
    P.link("coupler", b, { layer: 1, r: [9.5, 9.5], between: ["A", "B"], name: "Coupler" }),
    P.link("follower", c, { role: "output", layer: 2, r: [12, 9.5], between: ["O4", "B"], name: "Output crank" }),
    // the ram arm, keyed on the follower's shaft above the bridge, in line with it on the far side of O4: D at r
    P.link("arm", r, { role: "output", layer: 4, dz: 1.5, r: [12, 9.5], between: ["O4", "D"], name: "Ram arm" }),
    P.link("rod", L, { layer: 5, r: [9, 8.5], between: ["D", "E"], name: "Connecting rod" }),
    P.slider("ram", 36, 20, { layer: 4, at: "E", name: "Ram" }),
    // the ram's cap: with the ram it makes a clevis round the rod's end (A9)
    P.plate("cap", [[0, 0], [14, 0]], { role: "output", layer: 6, r: 7, dz: -2.5, twin: "ram", at: "E", name: "Ram cap" }),
    ...P.rails("rail", 120, 290, 20, { layer: 4, name: "Ram rail" }),
    P.cap("pO2", -1, 7, { fixed: [0, 0, 0], accent: true }),
    // O4: the shaft of the follower and the ram arm, in the bridge between them
    P.cap("pO4", 2, 5.5, { fixed: [d, 0, 0], span: 2 }),
    P.cap("pA", 0, 5.5, { at: "A" }),
    P.cap("pB", 1, 5.5, { at: "B" }),
    P.cap("pD", 4, 5.5, { at: "D" }),
    P.cap("pE", 4, 5.5, { at: "E", span: 2 }),
  ],
  traceZ: 66.8,
  solve,
  paths: ["E", "D"],
  vel: ["E", "B"],
  forces: (s) => [
    { type: "axial", a: s.pts.D!, b: s.pts.E!, key: "rod" },
    { type: "spin", c: O2, r: 28, key: "input", z: 1.2 },
  ],
  angles: (s) => {
    const v1 = V.sub(s.pts.A!, s.pts.B!);
    const v2 = V.sub(O4, s.pts.B!);
    const mu = Math.acos(Math.max(-1, Math.min(1, (v1[0] * v2[0] + v1[1] * v2[1]) / (b * c)))) / D2R;
    return [{ type: "angle", c: s.pts.B!, a: s.pts.A!, b: O4, r: 22, key: "transmission", value: mu, warn: mu < 30 }];
  },
  plot: { label: "Ram position", unit: "mm", f: (s) => s.pts.E![0] },
});
