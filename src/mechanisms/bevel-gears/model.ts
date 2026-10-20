// Bevel gear pair (catalogue "bevel-gears"): a 16-tooth pinion drives a 32-tooth gear at 90°, outer module 4, 20°
// pressure angle, face width 20. Pitch cones from the tooth counts (tan δ1 = z1 / z2): δ1 26.57°, δ2 63.43°, outer
// cone distance Re 71.55, both cones meeting at one apex. Ratio 2:1. The teeth are Tredgold back-cone teeth, the
// outline tapered toward the apex by (Re - b) / Re (src/core/spatial.ts).
// The base is the plan plane, so the gear lies on it on a z axis and the pinion stands on a shaft in plan along x. The
// catalogue lays the pinion along x and the gear along y with the apex at the origin; here the gear's axis is z and
// the apex is over the gear's centre at the pinion's height (K6, deliberate: the drawing's base is the plan).
// One cycle is one pinion turn; the gear makes half a turn, which with 32 whole teeth looks the same again (K2).
// The gear is phased half a tooth so a pinion tooth sits in a gear gap at the mesh, under the pinion's axis; the J9
// rule does not phase the teeth (Tredgold outline: tooth k at k 2π / z).
import { circle, polar } from "../../core/geom";
import { bevel, bevelOutline, pitchCones } from "../../core/spatial";
import { defineMechanism } from "../../model/define";
import { P } from "../../parts";

export const m = 4;
export const z1 = 16;
export const z2 = 32;
export const b = 20;
export const [d1, d2] = pitchCones(z1, z2);
export const pin = bevel(z1, m, d1, b);
export const gw = bevel(z2, m, d2, b);
/** The gear's back face (layer 1) and the apex over its centre, at the pinion's axis height, mm. */
export const zBack = 10;
export const zApex = zBack + gw.apex;
const r2 = gw.d / 2;

const gear = { ...P.custom("gear", bevelOutline(z2, m, d2), { role: "output", layer: 1, at: "G", spin: (s) => s.b as number, holes: [circle(7.2, 0, 0, 36)], name: "Bevel gear, 32 teeth" }), thick: gw.axial, taper: gw.inner, m, z: z2 };
const pinion = {
  ...P.custom("pinion", bevelOutline(z1, m, d1), { role: "driver", layer: 3, at: "Q", spin: (s) => (s.a as number) - Math.PI / 2, holes: [circle(6, 0, 0, 36)], axis: "x", along: -pin.apex, name: "Bevel pinion, 16 teeth" }),
  thick: pin.axial,
  taper: pin.inner,
  m,
  z: z1,
};

export default defineMechanism({
  id: "bevel-gears",
  input: { kind: "rotary", part: "pinion" },
  parts: [gear, pinion, P.cap("pG", 0, 7, { fixed: [0, 0, 0], span: 2 }), P.cap("pQ", 0, 7, { axis: "x", along: -pin.apex - 19, span: 3, fixed: [0, zApex, 0], accent: true })],
  meshes: [{ a: "pinion", b: "gear", form: "bevel" }],
  solve(u) {
    const a = u;
    // the gear turns half as fast. Tooth 0 of each gear carries its timing mark: at u = 0 the pinion's tooth 0 points
    // down into the mesh (its spin is a - π/2) and the gear's tooth 0 stands half a tooth beside it, a gap facing it
    const bb = -u / 2 + Math.PI + Math.PI / z2;
    // the pinion's outer pitch point that starts at the mesh, seen in plan: it runs across the pinion's back face, at
    // the pitch line speed as it passes the mesh
    return { pts: { G: [0, 0], Q: [0, zApex], Tp: [-pin.apex, (pin.d / 2) * Math.sin(a)] }, a, b: bb };
  },
  vel: ["Tp"],
  traceZ: zBack,
  forces: () => [
    { type: "spin", c: [0, 0], r: r2 + 14, dir: -1, key: "output" },
    { type: "axial", a: [-pin.apex - 40, 0], b: [-pin.apex, 0], key: "pinion thrust" },
  ],
  angles: () => [{ type: "angle", c: [0, 0], a: [-pin.Re, 0], b: polar(pin.Re, Math.PI - d1), r: 34, key: "pinion pitch cone", value: 26.6 }],
  plot: { label: "Gear angle", unit: "°", f: (_s, u) => (-u / 2) * (180 / Math.PI) },
});
