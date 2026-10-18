// Crank and slotted lever quick-return (catalogue "crank-shaper"): crank r 40 at O2 (0, 0), lever pivot O3 100 below
// it, lever length Ll 160 to B, link l 40 to the ram on the line y 64. The crank pin runs in the lever's slot (a track
// roller, J4); the lever rocks +-asin(r/d) = 23.58°, so the cut takes 227.2° of crank and the return 132.8° (1.71:1) and
// the stroke is 2 Ll sin(beta) = 128 mm. The ram moves from x -28 to x 100.
import { D2R, ring, roundedPoly } from "../../core/geom";
import { V } from "../../core/vec";
import { defineMechanism } from "../../model/define";
import type { Vec2 } from "../../model/types";
import { P } from "../../parts";

export const r = 40;
export const d = 100;
export const Ll = 160;
export const l = 40;
export const yR = 64;
const O2: Vec2 = [0, 0];
const O3: Vec2 = [0, -d];

/** The crank pin's distance from O3 runs from d - r to d + r: the slot's centre line. */
const S0 = d - r;
const S1 = d + r;

/** Crank: pin boss, input boss and a counterweight lobe opposite the pin (M2). */
const CW: Vec2[] = [[r, 0], [-16, 13], [-16, -13]];

export default defineMechanism({
  id: "crank-shaper",
  input: { kind: "rotary", part: "crank" },
  parts: [
    // the lever is plated 2.5 mm down so every pin works with a 1.5 mm overhang over the crank and the link (A9)
    P.custom("crank", roundedPoly(CW, 10), { role: "driver", layer: 1, between: ["O2", "A"], name: "Counterweighted crank", marks: [ring(8.4), ring(8.4, r, 0), ring(11.9)] }),
    // the slotted lever: the crank pin's roller runs in the slot from S0 to S1, the link hangs on its tip
    P.slotLink("lever", Ll, S0, S1, { layer: 2, dz: -2.5, role: "link", w: 30, slotW: 14, between: ["O3", "B"], name: "Slotted lever" }),
    P.link("link", l, { layer: 1, r: [9, 8.5], between: ["B", "C"], name: "Link" }),
    P.slider("ram", 36, 20, { layer: 0, at: "C", name: "Ram" }),
    // the ram's cap: with the ram it makes a clevis round the link's end (A9), reaching over the link from the side
    // the link never swings to
    P.plate("cap", [[0, 0], [14, 0]], { role: "output", layer: 2, r: 7, dz: -2.5, twin: "ram", at: "C", name: "Ram cap" }),
    ...P.rails("rail", -62, 134, 20, { fixed: [0, yR, 0], name: "Ram rail" }),
    P.cap("pO2", -1, 7, { fixed: [0, 0, 0], accent: true, span: 2 }),
    P.cap("pO3", -1, 7, { fixed: [0, -d, 0], span: 3 }),
    P.cap("pA", 1, 5.5, { at: "A" }),
    P.cap("pB", 1, 5.5, { at: "B" }),
    P.cap("pC", 0, 5.5, { at: "C", span: 2 }),
  ],
  traceZ: 26.8,
  solve(u) {
    const A = V.at(O2, u, r);
    // the lever's angle from vertical: the direction from O3 to the crank pin
    const phi = Math.atan2(A[0] - O3[0], A[1] - O3[1]);
    const B: Vec2 = [O3[0] + Ll * Math.sin(phi), O3[1] + Ll * Math.cos(phi)];
    const C: Vec2 = [B[0] + Math.sqrt(l * l - (yR - B[1]) ** 2), yR];
    return { pts: { O2, O3, A, B, C }, phi };
  },
  paths: ["B"],
  vel: ["C", "A"],
  forces: (s) => [
    { type: "axial", a: s.pts.B!, b: s.pts.C!, key: "link" },
    { type: "spin", c: O2, r: 28, key: "input", z: 1.2 },
  ],
  angles: (s) => [{ type: "angle", c: O3, a: [0, -d + 60], b: s.pts.B!, r: 40, key: "lever", value: Math.abs((s.phi as number) / D2R) }],
  plot: { label: "Ram position", unit: "mm", f: (s) => s.pts.C![0] },
});
