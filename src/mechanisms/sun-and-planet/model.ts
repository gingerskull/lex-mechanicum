// Sun and planet gear (catalogue "sun-and-planet"): Watt's way of turning a beam's rocking into a crank's turning
// without a crank. The beam rocks about Ob and drives a connecting rod; a 24-tooth planet is fixed to the rod's lower
// end, so it cannot turn on its own axis; a retaining link from the sun shaft Os to the planet centre P (length
// c = m (zs + zp) / 2 = 72) keeps it in mesh with the 24-tooth sun as P orbits Os. The planet turns with the rod, so the
// sun is carried round by the orbit and by the rolling mesh: with equal gears it makes two turns per orbit.
// The catalogue's figures are scaled by 0.6 (module 3 for the catalogue's 5: beam 180, rod 240, orbit 72); the
// ground distance is not the catalogue's (360), which is not a crank-rocker (c + d = 432 against 420 for the beam and
// rod): Ob (-180, 240) and Os (0, 0), 300 apart, give a beam that rocks -23.8° to +23.5° (the catalogue's about ±24°)
// while the retainer turns fully (K6, deliberate). The orbit angle is the cycle phase (the catalogue allows "drive the
// planet orbit angle directly for animation"): the beam's angle is derived from it, rocking once per orbit. The
// 24-tooth planet and sun are the same gear, drawn at module 3.
import { D2R, circle, dBore, polar } from "../../core/geom";
import { V, circleX } from "../../core/vec";
import { defineMechanism } from "../../model/define";
import type { Vec2 } from "../../model/types";
import { P } from "../../parts";

export const m = 3;
export const zs = 24;
export const zp = 24;
/** Orbit radius, the retainer's length: m (zs + zp) / 2. */
export const c = (m * (zs + zp)) / 2;
const beamL = 180;
const rodL = 240;
export const Os: Vec2 = [0, 0];
export const Ob: Vec2 = [-180, 240];
const FLY_R = 78;
/** The rod rides 4 mm up (K1: heights may change, centres may not): clear of the sun hub, its set screw and the circlip on the shaft end. */
const ROD_DZ = 4;
/** The beam rides 8 mm up, under the rod end at B (touching it): beam z 8 to 14, rod z 14 to 20. */
const BEAM_DZ = 8;

/** Boss radii of the tapered links (D1): round a keyed Ø10 shaft, round a bearing. */
const BEAM_R: [number, number] = [13, 9.5];
const ROD_R: [number, number] = [11, 17];
const RET_R: [number, number] = [14, 10];

const sun = P.gear("sun", zs, m, { role: "output", layer: 0, at: "Os", spin: (s) => s.th as number, bore: false, name: "Sun gear, 24 teeth" });
sun.shape.holes = [circle(6, 0, 0, 36)];
const planet = P.gear("planet", zp, m, { role: "link", layer: 0, at: "P", spin: (s) => s.psi as number, bore: false, name: "Planet gear, 24 teeth, fixed to the rod" });
const flywheel = P.disc("flywheel", FLY_R, { role: "output", layer: -2, at: "Os", spin: (s) => s.th as number, holes: [circle(6, 0, 0, 36)], name: "Flywheel" });

export default defineMechanism({
  id: "sun-and-planet",
  input: { kind: "oscillating", part: "beam" },
  parts: [
    P.link("beam", beamL, { role: "driver", layer: 0, dz: BEAM_DZ, r: BEAM_R, holes: [dBore(6)], between: ["Ob", "B"], name: "Beam" }),
    P.link("rod", rodL, { role: "link", layer: 1, dz: ROD_DZ, r: ROD_R, between: ["B", "P"], name: "Connecting rod" }),
    planet,
    sun,
    flywheel,
    P.link("retainer", c, { role: "link", layer: -1, r: RET_R, between: ["Os", "P"], name: "Retaining link" }),
    P.cap("pOb", -1, 7, { fixed: [Ob[0], Ob[1], 0], accent: true, span: 2 }),
    P.cap("pOs", -2, 7, { fixed: [0, 0, 0], span: 2 }),
    P.cap("pB", 0, 5.5, { at: "B", span: 1 }),
    P.cap("pP", -1, 5.5, { at: "P", span: 2 }),
  ],
  solve(u) {
    const t = u;
    const Pp = polar(c, t);
    const B = circleX(Pp, rodL, Ob, beamL, -1);
    const phi = V.ang(Ob, B);
    // the planet is fixed to the rod: it turns with the rod's direction B -> P
    const psi = V.ang(B, Pp);
    // Willis, equal teeth, phased so a planet tooth meets a sun gap on the line of centres at every phase
    const th = t + (zp / zs) * (t - psi) + Math.PI / zs;
    return { pts: { Os, Ob, B, P: Pp }, th, psi, phi };
  },
  paths: ["B", "P"],
  vel: ["P", "B"],
  forces: (s) => [
    { type: "axial", a: s.pts.B!, b: s.pts.P!, key: "connecting rod" },
    { type: "spin", c: Os, r: FLY_R + 8, key: "output", z: 1.2 },
  ],
  angles: (s) => [{ type: "angle", c: Ob, a: [Ob[0] + 36, Ob[1]], b: polar(36, s.phi as number, ...Ob), r: 30, key: "beam", value: ((s.phi as number) / D2R), z: 1.2 }],
  plot: { label: "Sun angle", unit: "°", f: (s) => ((s.th as number) / D2R) },
});
