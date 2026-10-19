// Cycloidal drive (catalogue "cycloidal-drive"): an eccentric shaft (e = 2) carries an 11-lobe cycloidal disc round a
// ring of N = 12 fixed pins on R = 50 (pin radius 5). The disc profile is the curtate epitrochoid offset by the pin
// radius, ψ = atan2(sin((1-N)t), R / (eN) - cos((1-N)t)); as the shaft turns the disc walks round the pins and turns
// slowly the other way, -1/11 of the input (32.7° per input turn), and six output pins on radius 25, each in a hole 2 mm
// wider than itself (hole radius ro + e), pick that slow turn up and carry it to the output flange, coaxial with the
// input. Ratio 11:1, output opposite to input. One cycle is one OUTPUT turn, eleven input turns: the disc, the flange and its
// pins then come back exactly (K2; one input turn would leave them 32.7° on, a different picture of the points); the catalogue's
// "input 360° per turn" is the same motion measured on the input (K6, deliberate).
// The disc is cut BACKLASH smaller all round (a ground disc has a tolerance on the profile) and its holes are 0.06 mm
// wider than e + the pin, so the check, which counts any vertex of one part inside another, can tell contact from overlap.
// The twelve ring pins are not parts of the model (they would be twelve plates for the rules to stand on posts): they are the
// polish's, set on the housing plate and held at the top by a cover ring; their contact with the disc is exact by the profile's
// construction and the clearance test runs over them. Heights: the housing plate on layer -1, the disc on layer 0, the flange
// above it on layer 1, the output pins on layer 0 (held in the flange, free in the disc).
import { D2R, TAU, circle, offsetPoly, polar } from "../../core/geom";
import { defineMechanism } from "../../model/define";
import { P } from "../../parts";

export const R = 50;
export const Rr = 5;
export const e = 2;
export const N = 12;
export const n = N - 1;
export const Ro = 25;
export const ro = 5;
export const NOUT = 6;
const BACKLASH = 0.06;
/** Bearing 6804 (20 x 32 x 7) between the eccentric cam and the disc, and the cam it sits on (Ø20, offset by e on the shaft). */
const CAM_R = 10;
const BORE_R = 16;

const outline = () => {
  const pts: [number, number][] = [];
  for (let i = 0; i < 360; i++) {
    const t = (i / 360) * TAU;
    const psi = Math.atan2(Math.sin((1 - N) * t), R / (e * N) - Math.cos((1 - N) * t));
    pts.push([R * Math.cos(t) - Rr * Math.cos(t + psi) - e * Math.cos(N * t), -R * Math.sin(t) + Rr * Math.sin(t + psi) + e * Math.sin(N * t)]);
  }
  return offsetPoly(pts, -BACKLASH);
};

const outAng = Array.from({ length: NOUT }, (_, j) => (j * TAU) / NOUT);
const holes = [circle(BORE_R, 0, 0, 48), ...outAng.map((g) => circle(ro + e + 0.06, ...polar(Ro, g), 28))];
const disc = P.custom("disc", outline(), { role: "link", layer: 0, thick: 9.6, at: "E", spin: (s) => s.phi as number, holes, name: "Cycloidal disc, 11 lobes" });
const eccentric = P.disc("eccentric", CAM_R, { role: "driver", layer: 0, at: "E", spin: (s) => s.th as number, holes: [circle(6, -e, 0, 36)], name: "Eccentric cam", marks: [] });
const flange = P.disc("flange", 37, { role: "output", layer: 1, at: "O", spin: (s) => s.phi as number, name: "Output flange" });
const outPins = outAng.map((g, j) => P.disc(`op${j}`, ro, { role: "output", layer: 0, thick: 7, at: `OP${j}`, name: `Output pin ${j + 1}`, marks: [] }));
// the plate's own frame sits on its rim, 72 mm left of the axis, so no pin of the checks mistakes it for a part turning on it
const OX = 72;
const lower = P.custom("housing", circle(72, OX, 0, 96), { role: "ground", layer: -1, thick: 6, fixed: [-OX, 0, 0], holes: [circle(46, OX, 0, 96)], name: "Housing plate" });

export default defineMechanism({
  id: "cycloidal-drive",
  input: { kind: "rotary", part: "eccentric" },
  parts: [lower, disc, eccentric, flange, ...outPins, P.cap("pO", -1, 7, { fixed: [0, 0, 0], accent: true, span: 2 })],
  solve(u) {
    // one cycle is one output turn, eleven input turns: the whole drive is then back where it started (K2)
    const th = n * u;
    const E = polar(e, th);
    // the disc and the flange turn -1/n of the input
    const phi = -u;
    const pts: Record<string, [number, number]> = { O: [0, 0], E };
    outAng.forEach((g, j) => (pts[`OP${j}`] = polar(Ro, g + phi)));
    return { pts, th, phi };
  },
  paths: ["E"],
  vel: ["E"],
  forces: () => [
    { type: "spin", c: [0, 0], r: 30, key: "input", z: 1.2 },
    { type: "spin", c: [0, 0], r: 45, dir: -1, key: "output", z: 1.2 },
  ],
  plot: { label: "Output angle", unit: "°", f: (s) => (-(s.phi as number)) / D2R },
});
