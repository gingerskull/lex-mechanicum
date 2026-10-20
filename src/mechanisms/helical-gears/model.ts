// Helical gear pair (catalogue "helical-gears"): a 17-tooth right-hand pinion drives a 34-tooth left-hand gear on
// parallel shafts. Normal module 3, helix angle 20°, normal pressure angle 20°, face width 30. Seen along the shafts it
// is a spur pair at the transverse module mt = mn / cos β = 3.193: pitch radii 27.14 and 54.27, centre distance
// mn (z1 + z2) / (2 cos β) = 81.41 (src/core/spatial.ts). Ratio 2:1, the gear turning the other way.
// Both gears lie on the base on z axes (the drawing's base is the plan), so the mesh is a parallel one (J6), read from
// the parts. Along the face the transverse profile turns by its helix: the pinion right hand at its lead π d1 / tan β
// (468 mm, 23° over the face), the gear left hand (937 mm, 11.5°), so the teeth stay in mesh across the whole face.
// The gear is phased half a tooth so a pinion tooth sits in a gear gap on the line of centres at the lower face; the
// opposite hands keep them there up the face.
// K6: the transverse profile is drawn by the part family's involute at 20°; the transverse pressure angle of a 20°
// normal profile at β 20° is 21.17°, a difference the drawing cannot show at this scale (deliberate).
import { circle, polar } from "../../core/geom";
import { helicalCentres, helicalDiameter, helixLead, transverseModule } from "../../core/spatial";
import { defineMechanism } from "../../model/define";
import { P } from "../../parts";

export const mn = 3;
export const beta = (20 * Math.PI) / 180;
export const z1 = 17;
export const z2 = 34;
/** Face width, mm: the gears' thickness along their axes. */
export const b = 30;
export const mt = transverseModule(mn, beta);
export const cd = helicalCentres(z1, z2, mn, beta);
export const d1 = helicalDiameter(z1, mn, beta);
export const d2 = helicalDiameter(z2, mn, beta);
const r1 = d1 / 2;
const r2 = d2 / 2;

const pinion = {
  ...P.gear("pinion", z1, mt, { role: "driver", at: "O1", spin: (s) => s.a as number, bore: false, helix: helixLead(d1, beta, 1), name: "Helical pinion, 17 teeth, right hand" }),
  thick: b,
};
const gear = {
  ...P.gear("gear", z2, mt, { role: "output", at: "O2", spin: (s) => s.b as number, bore: false, helix: helixLead(d2, beta, -1), name: "Helical gear, 34 teeth, left hand" }),
  thick: b,
};
// keyed bores that size the shafts (A3): Ø10 on the input, Ø12 on the output, which carries twice the torque
pinion.shape.holes = [circle(6, 0, 0, 36)];
gear.shape.holes = [circle(7.2, 0, 0, 36)];

export default defineMechanism({
  id: "helical-gears",
  input: { kind: "rotary", part: "pinion" },
  parts: [pinion, gear, P.cap("p1", -1, 7, { fixed: [0, 0, 0], span: 4, accent: true }), P.cap("p2", -1, 7, { fixed: [cd, 0, 0], span: 4 })],
  solve(u) {
    const a = u;
    const bb = -u / 2 + Math.PI / z2;
    // one cycle is one pinion turn: the gear makes half a turn, and with 34 teeth it looks the same after it
    return { pts: { O1: [0, 0], O2: [cd, 0], Tp: polar(r1, a + Math.PI / 2) }, a, b: bb };
  },
  vel: ["Tp"],
  traceZ: b,
  forces: () => [
    { type: "spin", c: [0, 0], r: r1 + 12, key: "input" },
    { type: "spin", c: [cd, 0], r: r2 + 10, dir: -1, key: "output" },
    // the tangential tooth force on the gear at the pitch point (driving forward it pushes the gear toward +y); its
    // axial thrust, Ft tan β, runs along the shafts, out of the plan
    { type: "axial", a: [r1, 0], b: [r1, 34], key: "tooth force" },
  ],
  angles: () => [{ type: "angle", c: [r1, 0], a: [r1, 22], b: polar(22, Math.PI / 2 + Math.atan(Math.tan((20 * Math.PI) / 180) / Math.cos(beta)), r1, 0), r: 18, key: "transverse pressure angle", value: 21.2 }],
  plot: { label: "Gear angle", unit: "°", f: (_s, u) => (-u / 2) * (180 / Math.PI) },
});
