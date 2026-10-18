// Spur gear pair (catalogue "spur-gears"): a 14-tooth pinion drives a 28-tooth gear, module 4, 20° pressure angle,
// centre distance m(z1 + z2)/2 = 84. Ratio 2:1, the gear turning the other way. The gear is phased half a tooth so a
// tooth of one sits in a gap of the other on the line of centres. The 14-tooth pinion lies under the 17-tooth undercut
// limit; the outline generator draws the involute down to the base circle and a radial flank below it, without the
// small undercut a generating cutter would leave (a deliberate simplification of the drawing, K6).
import { circle, polar } from "../../core/geom";
import { defineMechanism } from "../../model/define";
import { P } from "../../parts";

export const m = 4;
export const z1 = 14;
export const z2 = 28;
export const cd = (m * (z1 + z2)) / 2;
const r1 = (m * z1) / 2;
const r2 = (m * z2) / 2;
const alpha = (20 * Math.PI) / 180;

const pinion = P.gear("pinion", z1, m, { role: "driver", at: "O1", spin: (s) => s.a as number, bore: false, name: "Pinion, 14 teeth" });
const gear = P.gear("gear", z2, m, { role: "output", at: "O2", spin: (s) => s.b as number, bore: false, name: "Gear, 28 teeth" });
// keyed bores that size the shafts (A3): Ø10 on the input, Ø12 on the output, which carries twice the torque
pinion.shape.holes = [circle(6, 0, 0, 36)];
gear.shape.holes = [circle(7.2, 0, 0, 36)];

export default defineMechanism({
  id: "spur-gears",
  input: { kind: "rotary", part: "pinion" },
  parts: [pinion, gear, P.cap("p1", -1, 7, { fixed: [0, 0, 0], accent: true }), P.cap("p2", -1, 7, { fixed: [cd, 0, 0] })],
  solve(u) {
    const a = u;
    const b = -u / 2 + Math.PI / z2;
    // one cycle is one pinion turn: the gear makes half a turn, and with 28 teeth it looks the same after it
    return { pts: { O1: [0, 0], O2: [cd, 0], Tp: polar(r1, a + Math.PI / 2) }, a, b };
  },
  vel: ["Tp"],
  traceZ: 7.5,
  forces: () => [
    { type: "spin", c: [0, 0], r: r1 + 12, key: "input" },
    { type: "spin", c: [cd, 0], r: r2 + 10, dir: -1, key: "output" },
  ],
  angles: () => [{ type: "angle", c: [r1, 0], a: [r1, 22], b: polar(22, Math.PI / 2 + alpha, r1, 0), r: 18, key: "pressure angle", value: 20 }],
  plot: { label: "Gear angle", unit: "°", f: (_s, u) => (-u / 2) * (180 / Math.PI) },
});
