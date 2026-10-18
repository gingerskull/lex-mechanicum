// Toggle clamp (catalogue "toggle-clamp"): handle pivot O at the origin, plunger guide on the +x axis. Handle arm a 40
// to the knee A, link b 70 to the plunger pin B, grip T at H 95 and 165° from the arm. x_B = a cos t + sqrt(b² - a² sin² t).
// The handle swings 73° from -70° (open) to +3° (past centre); toggle at t = 0, where arm and link are in line and the
// plunger travels 37 mm (B from 72.7 to 110 mm). The pad meets the work face at x 173.2 mm at the toggle.
import { D2R, arcPts, ring } from "../../core/geom";
import { V, osc } from "../../core/vec";
import { defineMechanism } from "../../model/define";
import type { Vec2 } from "../../model/types";
import { P } from "../../parts";

export const a = 40;
export const b = 70;
export const H = 95;
export const g = 165 * D2R;
export const open = -70 * D2R;
export const over = 3 * D2R;
const O: Vec2 = [0, 0];
/** Grip position in the handle's frame (x along the arm O to A). */
export const T: Vec2 = [H * Math.cos(g), H * Math.sin(g)];

/**
 * Plunger outline in its own frame (origin at the pin B): body from -15 to 55, width 20 between the rails. The rear
 * half is open at the end: a notch 9.4 wide from x 28 (inside corners radius 1.5, M5) holds the clamp spindle, whose
 * pad face is the catalogue's clamp pad at 63 mm.
 */
const NOTCH = 4.7;
const PLUNGER: Vec2[] = [
  [-15, -10],
  [55, -10],
  [55, -NOTCH],
  ...arcPts(29.5, -(NOTCH - 1.5), 1.5, -Math.PI / 2, -Math.PI, Math.PI / 12),
  ...arcPts(29.5, NOTCH - 1.5, 1.5, Math.PI, Math.PI / 2, Math.PI / 12),
  [55, NOTCH],
  [55, 10],
  [-15, 10],
];

/** Plating: handle plates and the plunger cap sit 1.5 mm clear of the link, so the pins pass in double shear (A9). */
const HANDLE_DZ = 2.5;
const FRONT_DZ = -2.5;

export default defineMechanism({
  id: "toggle-clamp",
  input: { kind: "manual", part: "handle" },
  parts: [
    // the handle is a clevis round the knee: a rear plate with the grip and a front plate over the link
    P.plate("handle", [[0, 0], [a, 0], T], { role: "driver", dz: HANDLE_DZ, r: 9, between: ["O", "A"], name: "Handle, rear plate" }),
    P.link("handle-front", a, { role: "driver", layer: 2, dz: FRONT_DZ, r: [11, 9], twin: "handle", between: ["O", "A"], name: "Handle, front plate" }),
    P.link("link", b, { layer: 1, r: [8.5, 8.5], between: ["A", "B"], name: "Toggle link" }),
    P.custom("plunger", PLUNGER, { role: "output", at: "B", name: "Plunger", marks: [ring(6.5)] }),
    // the plunger's cap: with the plunger it makes a clevis round the link pin, on the side the link never swings to
    P.plate("plunger-cap", [[0, 0], [14, 0]], { role: "output", layer: 2, r: 7, dz: FRONT_DZ, twin: "plunger", at: "B", name: "Plunger cap" }),
    ...P.rails("rail", 56, 192, 20, { name: "Guide rail" }),
    P.cap("pO", -1, 7, { fixed: [0, 0, 0], span: 3, accent: true }),
    P.cap("pA", 0, 5.5, { at: "A", span: 2 }),
    P.cap("pB", 0, 5.5, { at: "B", span: 2 }),
  ],
  traceZ: 24,
  solve(u) {
    const t = osc(open, over)(u);
    const A = V.at(O, t, a);
    const B: Vec2 = [A[0] + Math.sqrt(b * b - A[1] * A[1]), 0];
    const Tw = V.at(O, t + g, H);
    return { pts: { O, A, B, T: Tw }, t, phi: Math.asin(-A[1] / b) };
  },
  paths: ["T"],
  vel: ["T", "B"],
  forces: (s) => [
    { type: "axial", a: s.pts.A!, b: s.pts.B!, key: "link" },
    { type: "spin", c: O, r: 28, key: "input", z: 1.2 },
  ],
  angles: (s) => [
    { type: "angle", c: s.pts.B!, a: [s.pts.B![0] - 40, 0], b: s.pts.A!, r: 26, key: "obliquity", value: Math.abs((s.phi as number) / D2R) },
    { type: "angle", c: O, a: [a, 0], b: s.pts.A!, r: 16, key: "handle", value: Math.abs((s.t as number) / D2R), z: 1.2 },
  ],
  plot: { label: "Plunger position", unit: "mm", f: (s) => s.pts.B![0] },
});
