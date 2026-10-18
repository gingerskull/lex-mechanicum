// Whitworth quick-return (catalogue "whitworth"): a 16-tooth pinion (module 2) drives a 50-tooth bull gear at O2 (0, 0);
// the bull gear's crank pin A (r 40) runs in the slot of a lever pivoted at O3 (0, -14), inside the crank circle (e 14 <
// r), so the lever turns a full revolution at varying speed. The lever's arm R 32 on the far side of O3 carries B, a rod
// of 100 drives the ram to C on the line y = -14. Ram extremes are where the lever lies along the ram line, at crank
// angles with sin = -e/r: beta = asin(e/r) = 20.49°, cut 180° + 2 beta = 221.0° and return 139.0° (1.59:1), stroke 2R =
// 64 mm. One cycle is one bull gear turn (the pinion makes 3.125 turns, 3 turns and 2 teeth: it looks the same again).
// The lever pivot O3 lies inside the bull gear's footprint, so the bull gear is a ring on a fixed hub that carries the
// pivot stud (as on the real machine); its bore and the hub are the model's, the bushing between them is the polish's.
import { circle, D2R, polar, ring, type Vec2 } from "../../core/geom";
import { defineMechanism } from "../../model/define";
import { P } from "../../parts";

export const r = 40;
export const e = 14;
export const R = 32;
export const Lr = 100;
export const z1 = 50;
export const z2 = 16;
export const m = 2;
/** Centre distance m(z1 + z2)/2 = 66, the pinion at 200° from the bull gear axis. */
export const cd = (m * (z1 + z2)) / 2;
const al = 200 * D2R;
const O2: Vec2 = [0, 0];
const O3: Vec2 = [0, -e];
const Pn: Vec2 = polar(cd, al);
/** The pivot hub and the bull gear's bore round it. */
export const Rhub = 24;
export const Rbore = 26;
/** The slot the crank pin runs in: its distance from O3 runs from r - e to r + e. */
const S0 = r - e;
const S1 = r + e;

const bull = P.gear("bull", z1, m, { role: "link", dz: -3, at: "O2", spin: (s) => s.b as number, bore: false, name: "Bull gear, 50 teeth" });
bull.shape.holes = [circle(Rbore, 0, 0, 72)];

export default defineMechanism({
  id: "whitworth",
  input: { kind: "rotary", part: "pinion" },
  parts: [
    // the fixed hub the bull gear turns on; the lever's pivot stud passes through it at O3
    P.disc("hub", Rhub, { role: "ground", layer: -1, thick: 14, fixed: [0, 0, 0], holes: [circle(5.15, 0, -e, 24)], name: "Pivot hub", marks: [ring(Rhub - 4)] }),
    bull,
    P.gear("pinion", z2, m, { role: "driver", dz: -3, at: "Pn", spin: (s) => s.a as number, bore: false, name: "Pinion, 16 teeth" }),
    // the slotted lever: its x runs from O3 toward the crank pin, the rod's pin B sits R behind the pivot
    P.slotLink("lever", S1, S0, S1, { x0: -R, layer: 1, dz: 1.5, role: "link", w: 22, slotW: 14, at: "O3", spin: (s) => s.phi as number, name: "Slotted lever" }),
    P.link("rod", Lr, { layer: 3, dz: 0.5, r: [8.5, 8], between: ["B", "C"], name: "Connecting rod" }),
    P.slider("ram", 28, 20, { layer: 2, at: "C", name: "Ram" }),
    P.plate("cap", [[0, 0], [14, 0]], { role: "output", layer: 4, r: 7, dz: -2, twin: "ram", at: "C", name: "Ram cap" }),
    ...P.rails("rail", 68, 150, 20, { layer: 2, fixed: [0, -e, 0], name: "Ram rail" }),
    P.cap("pPn", -1, 7, { fixed: [Pn[0], Pn[1], 0], accent: true }),
    P.cap("pO3", -1, 7, { fixed: [O3[0], O3[1], 0], span: 2, over: 2.3 }),
    P.cap("pA", 0, 5.5, { at: "A", over: 2.3 }),
    P.cap("pB", 1, 5.5, { at: "B", span: 2 }),
    P.cap("pC", 2, 5.5, { at: "C", span: 2 }),
  ],
  traceZ: 37,
  solve(u) {
    const A = polar(r, u);
    // the lever's angle: the direction from O3 to the crank pin
    const phi = Math.atan2(A[1] - O3[1], A[0] - O3[0]);
    const B: Vec2 = [O3[0] - R * Math.cos(phi), O3[1] - R * Math.sin(phi)];
    const C: Vec2 = [B[0] + Math.sqrt(Lr * Lr - (B[1] + e) ** 2), -e];
    // the pinion turns the other way, z1/z2 times as fast, phased so a tooth meets a gap on the line of centres (K6)
    const a = al - Math.PI + (Math.PI - z1 * (u - al)) / z2;
    return { pts: { O2, O3, A, B, C, Pn }, phi, a, b: u };
  },
  paths: ["B", "A"],
  vel: ["C", "B"],
  forces: (s) => [
    { type: "axial", a: s.pts.B!, b: s.pts.C!, key: "rod" },
    { type: "spin", c: Pn, r: 26, key: "input", z: 1.2 },
  ],
  angles: (s) => [{ type: "angle", c: O3, a: [60, -e], b: s.pts.A!, r: 36, key: "lever", value: Math.abs(((s.phi as number) / D2R) % 360) }],
  plot: { label: "Ram position", unit: "mm", f: (s) => s.pts.C![0] },
});
