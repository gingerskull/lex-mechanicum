// Compound gear train (catalogue "gear-train"): module 3, 20° pressure angle. A 12-tooth pinion a on shaft A drives a
// 36-tooth gear b on shaft B (layer 0); a second 12-tooth pinion c, fixed to b on the same shaft one layer up, drives
// the 36-tooth output d on shaft D (layer 1). Each stage has centre distance m(12 + 36)/2 = 72; the second centre line
// leaves B at 62° from the A-B line. Train value (36/12)(36/12) = 9, two external meshes, so the output turns the same
// way as the input. Each mesh is phased on its own line of centres so a tooth sits in a gap there. The 12-tooth
// pinions lie under the 17-tooth undercut limit; the outline generator draws the involute down to the base circle
// without the undercut a cutter would leave (a deliberate simplification of the drawing, K6).
import { circle, polar } from "../../core/geom";
import { defineMechanism } from "../../model/define";
import { P } from "../../parts";

export const m = 3;
export const za = 12;
export const zb = 36;
export const zc = 12;
export const zd = 36;
export const cd = (m * (za + zb)) / 2;
/** Direction of the second centre line, B to D, from the A-B line. */
export const phi = (62 * Math.PI) / 180;
const alpha = (20 * Math.PI) / 180;
const ra = (m * za) / 2;
const rb = (m * zb) / 2;
const rc = (m * zc) / 2;
const rd = (m * zd) / 2;
const B: [number, number] = [cd, 0];
const D: [number, number] = [cd + cd * Math.cos(phi), cd * Math.sin(phi)];

const a = P.gear("a", za, m, { role: "driver", at: "A", spin: (s) => s.ta as number, bore: false, name: "Input pinion, 12 teeth" });
const b = P.gear("b", zb, m, { role: "link", at: "B", spin: (s) => s.tb as number, bore: false, name: "Cluster gear, 36 teeth" });
const c = P.gear("c", zc, m, { role: "link", layer: 1, at: "B", spin: (s) => s.tb as number, bore: false, name: "Cluster pinion, 12 teeth" });
const d = P.gear("d", zd, m, { role: "output", layer: 1, at: "D", spin: (s) => s.td as number, bore: false, name: "Output gear, 36 teeth" });
// keyed bores that size the shafts (A3): Ø10 on the input, Ø12 on the cluster and on the output
a.shape.holes = [circle(6, 0, 0, 36)];
b.shape.holes = [circle(7.2, 0, 0, 36)];
c.shape.holes = [circle(7.2, 0, 0, 36)];
d.shape.holes = [circle(7.2, 0, 0, 36)];

export default defineMechanism({
  id: "gear-train",
  input: { kind: "rotary", part: "a" },
  parts: [
    a,
    b,
    c,
    d,
    P.cap("pA", -1, 7, { fixed: [0, 0, 0], accent: true }),
    P.cap("pB", -1, 7, { fixed: [B[0], B[1], 0], span: 2 }),
    P.cap("pD", -1, 7, { fixed: [D[0], D[1], 0], span: 2 }),
  ],
  solve(u) {
    const ta = u;
    // z1 (t1 - line) + z2 (t2 - line - π) = π puts a tooth of one in a gap of the other on the line of centres
    const tb = Math.PI + (Math.PI - za * ta) / zb;
    const td = phi + Math.PI + (Math.PI - zc * (tb - phi)) / zd;
    return { pts: { A: [0, 0], B, D, Tp: polar(ra, ta + Math.PI / 2) }, ta, tb, td };
  },
  vel: ["Tp"],
  traceZ: 7.5,
  forces: () => [
    { type: "spin", c: [0, 0], r: ra + 12, key: "input" },
    { type: "spin", c: D, r: rd + 10, key: "output" },
    // each tooth force acts along its line of action: tangent to both base circles, through the pitch point
    { type: "axial", a: polar(ra * Math.cos(alpha), alpha), b: polar(rb * Math.cos(alpha), Math.PI + alpha, cd, 0), key: "line of action 1" },
    {
      type: "axial",
      a: polar(rc * Math.cos(alpha), phi + alpha, B[0], B[1]),
      b: polar(rd * Math.cos(alpha), phi + Math.PI + alpha, D[0], D[1]),
      key: "line of action 2",
    },
  ],
  plot: { label: "Output angle", unit: "°", f: (s) => ((s.td as number) * 180) / Math.PI },
});
