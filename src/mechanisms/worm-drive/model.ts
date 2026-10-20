// Worm drive (catalogue "worm-drive"): a single-start worm, axial module 3, diameter factor q 10 (pitch Ø30), drives a
// 30-tooth wheel (pitch Ø90) on a crossing shaft, centre distance 60, 20° pressure angle. Lead 9.42 (one axial pitch),
// lead angle atan(1 / 10) = 5.71°, ratio 30:1 (src/core/spatial.ts).
// The base is the plan plane: the wheel lies on it on a z axis, the worm stands on a shaft in plan along x, its axis at
// the wheel's mid-plane. Both are right hand: the worm's thread is drawn by its helix at the lead, the wheel's teeth
// turned at the lead angle across its face (its helix, src/core/spatial.ts wheelLead).
// K6: the catalogue puts the worm "above" the wheel in plan (+y); here it lies in front of it (-y), nearer the viewer
// at every tilt, so the side elevation shows the worm crossing the wheel. The worm is 6 leads long (56.5 mm, the
// catalogue's 50) so a thread crest sits at its middle. The wheel's throated rim is drawn straight (an extrusion along
// its axis): the throat follows the worm's tip, its depth under 1.5 mm across a 20 mm face at this scale.
// One cycle is one worm turn: the wheel turns one tooth (12°), which with 30 whole teeth looks the same again (K2).
// Phase: at u = 0 a thread crest stands on the worm's mesh side at x = 0, in the wheel's tooth gap under it, and the
// wheel's tooth 0 (its timing mark) is the tooth beside that gap.
import { D2R, circle, gearOutline } from "../../core/geom";
import { worm as wormPair } from "../../core/spatial";
import { defineMechanism } from "../../model/define";
import { P } from "../../parts";

export const m = 3;
export const z1 = 1;
export const z2 = 30;
export const q = 10;
export const w = wormPair(m, z1, z2, q);
/** Wheel face width and its mid-plane, the worm's axis height; the worm's axis in plan (y), mm. */
export const FACE = 20;
export const ZW = 10 + FACE / 2;
export const YW = -w.a;
/** The worm: tip radius (pitch + one module), six leads long, centred on x = 0. */
export const RW = w.d1 / 2 + m;
export const WL = 6 * w.lead;
const r2 = w.d2 / 2;

const wheelSpin = (u: number): number => -u * w.ratio - 7 * ((2 * Math.PI) / z2);

const wheel = {
  ...P.custom("wheel", gearOutline(z2, m), { role: "output", layer: 1, at: "G", spin: (s) => s.b as number, holes: [circle(7.2, 0, 0, 36)], helix: w.wheelLead, name: "Worm wheel, 30 teeth" }),
  thick: FACE,
  m,
  z: z2,
};
const wormPart = {
  ...P.disc("worm", RW, { role: "driver", layer: 3, at: "W", spin: (s) => s.a as number, holes: [circle(6, 0, 0, 36)], axis: "x", along: -WL / 2, thick: WL, helix: w.lead, marks: [], name: "Worm, single start" }),
  m,
  z: z1,
};

export default defineMechanism({
  id: "worm-drive",
  input: { kind: "rotary", part: "worm" },
  parts: [
    wheel,
    wormPart,
    P.cap("pG", 0, 7, { fixed: [0, 0, 0], span: 3 }),
    P.cap("pW", 0, 7, { axis: "x", along: -WL / 2 - 1, span: 5, fixed: [YW, ZW, 0], accent: true }),
  ],
  meshes: [{ a: "worm", b: "wheel", form: "worm" }],
  solve(u) {
    const a = u;
    // the wheel turns one tooth per worm turn, clockwise in plan (the crest on the worm's mesh side runs toward -x)
    const b = wheelSpin(u);
    // the worm's pitch point that starts on top at x = 0, seen in plan: it runs across the worm at the pitch line speed
    return { pts: { G: [0, 0], W: [YW, ZW], Tw: [0, YW - (w.d1 / 2) * Math.sin(a)] }, a, b };
  },
  vel: ["Tw"],
  traceZ: ZW + w.d1 / 2,
  forces: () => [
    { type: "spin", c: [0, 0], r: r2 + 14, dir: -1, key: "output" },
    // the wheel pushes back on the thread: the worm's thrust along its shaft, toward +x
    { type: "axial", a: [WL / 2 + 6, YW], b: [WL / 2 + 46, YW], key: "worm thrust", z: (ZW + RW) / 10 },
  ],
  // the lead angle, seen on the worm's top in plan: the thread against the line across the worm
  angles: () => [{ type: "angle", c: [0, YW], a: [0, YW + 26], b: [-26 * Math.sin(w.gamma), YW + 26 * Math.cos(w.gamma)], r: 22, key: "lead angle", value: +(w.gamma / D2R).toFixed(1), z: (ZW + RW) / 10 }],
  plot: { label: "Wheel angle", unit: "°", f: (_s, u) => wheelSpin(u) / D2R + 7 * 12 },
});
