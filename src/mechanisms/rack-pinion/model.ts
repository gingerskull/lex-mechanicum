// Rack and pinion (catalogue "rack-pinion"): a 16-tooth pinion, module 4, 20° pressure angle, pitch radius 32, swings
// ±150° about O and drives a 17-tooth rack whose pitch line runs at y = -32. Rack position x = p/2 + rp θ, travel
// ±83.8 mm (167.6 mm); the half pitch offset puts a pinion tooth over a rack gap at θ = 0, so the teeth mesh at every
// angle (an even tooth count puts a tooth straight down at θ = 0). One cycle is one swing there and back.
import { D2R, circle, polar } from "../../core/geom";
import { osc } from "../../core/vec";
import { defineMechanism } from "../../model/define";
import { P } from "../../parts";

export const m = 4;
export const z = 16;
/** Pinion pitch radius, also the distance from the pinion axis to the rack's pitch line. */
export const rp = (m * z) / 2;
/** Rack pitch. */
export const pitch = Math.PI * m;
/** Pinion swing amplitude, rad. */
export const THETA = 150 * D2R;
/** Rack teeth are numbered from -8 to +8 (17 teeth, 213.6 mm of rack). */
export const K = 8;
const alpha = 20 * D2R;
const rb = rp * Math.cos(alpha);

const pinion = P.gear("pinion", z, m, { role: "driver", at: "O", spin: (s) => s.th as number, bore: false, name: "Pinion, 16 teeth" });
// keyed bore that sizes the shaft (A3): Ø10
pinion.shape.holes = [circle(6, 0, 0, 36)];

export default defineMechanism({
  id: "rack-pinion",
  // a reversing servo drive: the swing is the motor's programmed travel (a 300° swing cannot come from a crank and link,
  // whose link would cross the shaft); the page and the drive follow the rotary input kind (K7)
  input: { kind: "rotary", part: "pinion" },
  parts: [pinion, P.rack("rack", -K, K, m, { role: "output", at: "R", name: "Rack, 17 teeth" }), P.cap("pO", -1, 7, { fixed: [0, 0, 0], accent: true })],
  traceZ: 8,
  solve(u) {
    const th = osc(-THETA, THETA)(u);
    return { pts: { O: [0, 0], R: [pitch / 2 + rp * th, -rp] }, th };
  },
  paths: ["R"],
  vel: ["R"],
  forces(_s, u) {
    // the tooth force acts along the line of action through the pitch point, tilted by the pressure angle; it flips
    // side with the direction of the swing
    const f = Math.sin(u) >= 0 ? 1 : -1;
    const a = polar(rb, -Math.PI / 2 - f * alpha);
    return [
      { type: "spin", c: [0, 0], r: rp + 12, key: "input", z: 1.2 },
      { type: "axial", a, b: [-a[0], -2 * rp - a[1]], key: "line of action" },
    ];
  },
  angles: () => [{ type: "angle", c: [0, -rp], a: [30, -rp], b: polar(30, -alpha, 0, -rp), r: 22, key: "pressure angle", value: 20 }],
  plot: { label: "Rack travel", unit: "mm", f: (s) => s.pts.R![0] - pitch / 2 },
});
