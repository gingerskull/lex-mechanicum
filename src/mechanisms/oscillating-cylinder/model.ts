// Oscillating cylinder engine (catalogue "oscillating-cylinder"): crank r 35 about O2 at the origin, trunnion O3 at
// (d, 0) with d 120, piston rod and piston rigid, crank pin A to piston centre Lp 120. The cylinder rocks about O3 and
// always points at A: psi = atan2(O3 - A), swing ±asin(r/d) = ±17.0°. The piston centre lies s = Lp - |A - O3| from
// the trunnion along the bore, +35 to -35 mm: it crosses the trunnion line, so the bore (90 mm) is centred on O3.
//
// Input: the crank is animated as the driver (rotary, K7), as the catalogue notes say, so the build takes the standard
// pancake motor and belt to the crank shaft instead of steam; the catalogue input "piston pushed by steam" is the
// physical source of the same motion.
//
// The cylinder is a built-up block (K1: heights may change, centres may not): a floor with the port face on the
// standard, a frame whose walls are the bore, and a cover. The trunnion axis runs through floor and cover; the piston
// rod is therefore notched along its axis where it crosses the trunnion line, so the stud runs in the notch (J4)
// instead of through a solid piston. Stack, bottom to top: standard (ground disc with the steam and exhaust ports),
// floor, frame and piston (one plane), cover.
import { D2R, circle, ring, roundRect, roundedPoly, type Vec2 } from "../../core/geom";
import { V } from "../../core/vec";
import { defineMechanism } from "../../model/define";
import { P } from "../../parts";

export const r = 35;
export const d = 120;
export const Lp = 120;
/** Bore length, and the end walls either side of it. */
export const BORE = 90;
const WALL = 5;
/** Half width of the bore, of the cylinder body, of the neck the rod passes through the crank end wall. */
const BW = 20;
const BODY_W = 28;
const NECK_W = 16;
/** Port angle either side of the centre line, and the radius of the port circle on the standard. */
export const PORT_A = 11 * D2R;
export const PORT_R = 13;
/** Standard disc radius, and the radius of a port hole. */
export const STD_R = 24;
export const PORT_HOLE = 1.5;

/** Crank: pin boss, input boss and a counterweight lobe opposite the pin (M2), boss radius 9.5. */
const CW: Vec2[] = [[r, 0], [-16, 13], [-16, -13]];

const O2: Vec2 = [0, 0];
const O3: Vec2 = [d, 0];

/** Plating (K1): heights only. Standard -6..0, floor 0.4..12.4 (the lapped port face runs 0.4 mm off the standard), frame 12.4..22.4 with the piston inside it, cover 22.4..28.4. */
export const Z = { stdDz: 4, floorDz: 0.4, floorT: 12, frameDz: 2.4, frameT: 10, rodDz: 2.9, rodT: 9, coverDz: 2.4, crankDz: 5.4 };

/** The cylinder's outer outline in its own frame (x along the bore axis, O3 at the origin). */
const body = roundRect(-(BORE / 2 + WALL), -BODY_W, BORE / 2 + WALL, BODY_W, 8);
/** The bore with the neck at the crank end, a T shaped cut; the polish rounds its corners (M5). */
export const bore: Vec2[] = [
  [-(BORE / 2 + WALL), -NECK_W], [-BORE / 2, -NECK_W], [-BORE / 2, -BW], [BORE / 2, -BW], [BORE / 2, BW], [-BORE / 2, BW], [-BORE / 2, NECK_W], [-(BORE / 2 + WALL), NECK_W],
];

/** Piston rod and piston: boss round A, rod tapering to 28 wide, piston 12 long and 34 wide centred at Lp, notched along its axis from the piston face to the closest the trunnion comes. */
const dMin = d - r;
const NOTCH_R = 7.5;
function rodOutline(): Vec2[] {
  const out: Vec2[] = [];
  for (let k = 0; k <= 12; k++) {
    const a = Math.PI / 2 + (Math.PI * k) / 12;
    out.push([10 * Math.cos(a), 10 * Math.sin(a)]);
  }
  out.push([40, -14], [Lp - 10, -14], [Lp - 10, -17], [Lp + 6, -17], [Lp + 6, -NOTCH_R]);
  // the notch end: a half circle round the closest trunnion position
  for (let k = 0; k <= 12; k++) {
    const a = -Math.PI / 2 - (Math.PI * k) / 12;
    out.push([dMin + NOTCH_R * Math.cos(a), NOTCH_R * Math.sin(a)]);
  }
  out.push([Lp + 6, NOTCH_R], [Lp + 6, 17], [Lp - 10, 17], [Lp - 10, 14], [40, 14]);
  return out;
}

export default defineMechanism({
  id: "oscillating-cylinder",
  input: { kind: "rotary", part: "crank" },
  parts: [
    // plated up so the rod's big end rides 1.5 mm over the crank (A9); single shear at A is forced, the rod sweeps over
    // the input shaft at the far end of the stroke
    P.custom("crank", roundedPoly(CW, 9.5), { role: "driver", dz: Z.crankDz, between: ["O2", "A"], name: "Counterweighted crank", marks: [ring(7.9), ring(7.9, r, 0), ring(11.4)] }),
    P.custom("rod", rodOutline(), { role: "link", layer: 1, thick: Z.rodT, dz: Z.rodDz, between: ["A", "Pc"], marks: [ring(8, 0, 0)], name: "Piston rod and piston" }),
    P.disc("standard", STD_R, {
      role: "ground",
      layer: -1,
      dz: Z.stdDz,
      fixed: [d, 0, 0],
      holes: [circle(PORT_HOLE, d + PORT_R * Math.cos(PORT_A), PORT_R * Math.sin(PORT_A), 20), circle(PORT_HOLE, d + PORT_R * Math.cos(PORT_A), -PORT_R * Math.sin(PORT_A), 20)],
      marks: [],
      name: "Port standard",
    }),
    P.custom("cyl-floor", body, { role: "output", layer: 0, thick: Z.floorT, dz: Z.floorDz, holes: [circle(PORT_HOLE, PORT_R, 0, 20)], at: "O3", spin: (s) => s.psi as number, name: "Cylinder, port block" }),
    P.custom("cyl-frame", body, { role: "output", layer: 1, thick: Z.frameT, dz: Z.frameDz, holes: [bore], at: "O3", spin: (s) => s.psi as number, name: "Cylinder, bore frame" }),
    P.custom("cyl-cover", body, { role: "output", layer: 2, dz: Z.coverDz, at: "O3", spin: (s) => s.psi as number, name: "Cylinder, cover" }),
    P.cap("pO2", -1, 7, { fixed: [0, 0, 0], accent: true }),
    P.cap("pO3", -1, 7, { fixed: [d, 0, 0], span: 3 }),
    P.cap("pA", 0, 5.5, { at: "A" }),
  ],
  traceZ: 17,
  solve(u) {
    const A = V.at(O2, u, r);
    const dx = O3[0] - A[0];
    const dy = O3[1] - A[1];
    const L = Math.hypot(dx, dy);
    const psi = Math.atan2(dy, dx);
    const Pc: Vec2 = [A[0] + (dx / L) * Lp, A[1] + (dy / L) * Lp];
    return { pts: { O2, O3, A, Pc }, psi };
  },
  paths: ["A", "Pc"],
  vel: ["Pc", "A"],
  forces: (s) => [
    { type: "axial", a: s.pts.A!, b: s.pts.Pc!, key: "piston thrust" },
    { type: "spin", c: O2, r: 28, key: "input", z: 1.2 },
  ],
  angles: (s) => [{ type: "angle", c: O3, a: [O3[0] - 44, 0], b: s.pts.A!, r: 32, key: "swing", value: Math.abs((s.psi as number) / D2R) }],
  plot: { label: "Cylinder swing", unit: "°", f: (s) => (s.psi as number) / D2R },
});
