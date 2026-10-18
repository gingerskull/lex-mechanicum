// Oldham coupling (catalogue "oldham-coupling"): shaft offset e 28, hubs R 68 with an 18 mm slot, floating disc R 50
// with two 16 x 48 tongues at right angles. theta_out = theta_in exactly; the disc keeps the input's angle and its
// centre runs round the circle of diameter e on the line O1-O2 at twice shaft speed, C = e cos θ (cos θ, sin θ), each
// tongue stroking ±e in its slot. Slot half-length e + Lt/2 + 1 = 53 (the tongue ends clear by 1 mm).
//
// Each hub is a keyed back plate with a slot plate on it (a blind groove cannot be an extruded outline); the disc is a
// body with a tongue on each face. The input shaft comes up through the base; the output shaft comes down into its hub
// from a bridge, as the two shafts of a real coupling meet from opposite sides of the stack.
import { D2R, circle, dBore, ring, roundedPoly, slot } from "../../core/geom";
import { defineMechanism } from "../../model/define";
import type { Solved, Vec2 } from "../../model/types";
import { P } from "../../parts";

export const e = 28;
export const R = 68;
export const Rm = 50;
export const ws = 18;
export const wr = 16;
export const Lt = 48;
/** Slot half-length: the tongue stroke e plus half its length, 1 mm clear. */
export const SL = e + Lt / 2 + 1;
/** Plate thickness and the 0.5 mm running gap between the sliding faces, mm. */
export const T = 6;
export const GAP = 0.5;

/** Stack heights, mm: input back plate 0..6, its slot plate 6..12, disc 12.5..18.5, output slot plate 19..25, back 25..31. */
export const Z = { slot: T, disc: 2 * T + GAP, slotOut: 3 * T + 2 * GAP, backOut: 4 * T + 2 * GAP } as const;

/** The slot of a hub; `w` is its width (the polish relieves it behind the wear strips). */
export const slotHole = (w = ws): Vec2[] => slot(-(SL - w / 2), SL - w / 2, 0, w / 2);
/** Keyed bore of the back plates: sizes the Ø10 shafts (A3). */
const KEYED = dBore(6.5);
/** A tongue with full-radius ends, concentric with the slot ends. */
const tongue = (): Vec2[] => roundedPoly([[-(Lt - wr) / 2, 0], [(Lt - wr) / 2, 0]], wr / 2);

const O1: Vec2 = [0, 0];
const O2: Vec2 = [e, 0];
const dz = (z: number, layer: number) => z - layer * 10;

export default defineMechanism({
  id: "oldham-coupling",
  input: { kind: "rotary", part: "hubInBack" },
  parts: [
    P.disc("hubInBack", R, { role: "driver", holes: [KEYED], marks: [ring(R - 5), ring(24)], at: "O1", spin: (s) => s.th as number, name: "Input hub, back plate" }),
    P.custom("hubIn", circle(R, 0, 0, 96), { role: "driver", twin: "hubInBack", dz: Z.slot, holes: [slotHole()], marks: [ring(R - 5)], at: "O1", spin: (s) => s.th as number, name: "Input hub, slot plate" }),
    P.custom("tongueA", tongue(), { role: "link", twin: "disc", layer: 1, dz: dz(Z.disc - T, 1), at: "C", spin: (s) => s.th as number, name: "Disc tongue, input face" }),
    P.disc("disc", Rm, { role: "link", layer: 2, dz: dz(Z.disc, 2), marks: [ring(Rm - 4), ring(9)], at: "C", spin: (s) => s.th as number, name: "Floating disc" }),
    P.custom("tongueB", tongue().map(([x, y]): Vec2 => [-y, x]), { role: "link", twin: "disc", layer: 3, dz: dz(Z.disc + T, 3), at: "C", spin: (s) => s.th as number, name: "Disc tongue, output face" }),
    P.custom("hubOut", circle(R, 0, 0, 96), { role: "output", twin: "hubOutBack", layer: 4, dz: dz(Z.slotOut, 4), holes: [slotHole()], marks: [ring(R - 5)], at: "O2", spin: (s) => (s.th as number) + Math.PI / 2, name: "Output hub, slot plate" }),
    P.disc("hubOutBack", R, { role: "output", layer: 4, dz: dz(Z.backOut, 4), holes: [dBore(6.5)], marks: [ring(R - 5), ring(24)], at: "O2", spin: (s) => (s.th as number) + Math.PI / 2, name: "Output hub, back plate" }),
    P.cap("pO1", 0, 7, { fixed: [0, 0, 0], accent: true, span: 0, th: 5, over: 0.5 }),
  ],
  traceZ: Z.disc + T + 0.4,
  solve(u): Solved {
    const t = e * Math.cos(u);
    const C: Vec2 = [t * Math.cos(u), t * Math.sin(u)];
    return { pts: { O1, O2, C }, th: u };
  },
  paths: ["C"],
  vel: ["C"],
  forces: (s) => [
    // each tongue pushes square to its slot wall: the force acts across the tongue
    { type: "axial", a: s.pts.C!, b: [s.pts.C![0] - 30 * Math.sin(s.th as number), s.pts.C![1] + 30 * Math.cos(s.th as number)], key: "tongue on slot wall" },
    { type: "spin", c: O1, r: R + 8, key: "input" },
  ],
  angles: (s) => {
    const th = s.th as number;
    return [{ type: "angle", c: O1, a: [R - 12, 0], b: [(R - 12) * Math.cos(th), (R - 12) * Math.sin(th)], r: 30, key: "input angle", value: (((th / D2R) % 360) + 360) % 360 }];
  },
  // the disc centre goes round its circle at twice the shaft angle: a straight line of slope 2
  plot: { label: "Disc centre angle", unit: "°", f: (_s, u) => (2 * u) / D2R },
});
