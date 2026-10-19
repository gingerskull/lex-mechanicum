// Scott Russell linkage (catalogue "scott-russell"): crank O to M of length a = 50 on a ground pivot O (0, 0), a beam of
// length 2a pinned to the crank at its midpoint M, its end B on a slider that runs along the x axis. With M = a (cos φ,
// sin φ) the slider is at B = (2a cos φ, 0) and the other beam end P = (0, 2a sin φ) runs on the y axis exactly. The
// slider runs x 95 to 20 (φ 18° to 78°); P rises from y 31 to y 98.
// The crank sweeps over the rails, so it rides on layer 1 over the slider and rails; the beam is on layer 2, over the crank.
import { ring } from "../../core/geom";
import { osc } from "../../core/vec";
import { defineMechanism } from "../../model/define";
import type { Vec2 } from "../../model/types";
import { P, heights } from "../../parts";

export const a = 50;
const O: Vec2 = [0, 0];
/** Slider stroke, x of B: far end, near end. */
const X_FAR = 95;
const X_NEAR = 20;
const stroke = osc(X_FAR, X_NEAR);
/** Boss radii of the links (D1): bearings at every pin. */
const BOSS: [number, number] = [9.5, 9.5];

const tracer = P.tracer("tip", 2, { at: "P", name: "Beam end" });

const beam = P.link("beam", 2 * a, { role: "output", layer: 2, r: BOSS, between: ["B", "P"], name: "Beam" });
// the middle pin boss engraved like the end bosses (D1)
beam.marks.push(ring(BOSS[0] - 1.6, a, 0));

export default defineMechanism({
  id: "scott-russell",
  input: { kind: "linear", part: "slider" },
  parts: [
    P.slider("slider", 22, 20, { role: "driver", at: "B", name: "Slider" }),
    ...P.rails("rail", 8, 108, 20, { name: "Track" }),
    P.link("crank", a, { role: "link", layer: 1, r: BOSS, between: ["O", "M"], name: "Crank" }),
    beam,
    P.cap("pO", -1, 7, { fixed: [O[0], O[1], 0], span: 2 }),
    P.cap("pM", 1, 5.5, { at: "M", span: 2 }),
    P.cap("pB", 0, 5.5, { at: "B", span: 3, accent: true }),
    tracer,
  ],
  traceZ: heights(tracer)[1],
  solve(u) {
    const x = stroke(u);
    const phi = Math.acos(x / (2 * a));
    const M: Vec2 = [a * Math.cos(phi), a * Math.sin(phi)];
    const B: Vec2 = [x, 0];
    const Pt: Vec2 = [0, 2 * a * Math.sin(phi)];
    return { pts: { O, M, B, P: Pt }, x, phi, th: u };
  },
  paths: ["P"],
  vel: ["P", "B"],
  forces: (s) => [
    { type: "axial", a: s.pts.O!, b: s.pts.M!, key: "crank" },
    { type: "axial", a: s.pts.B!, b: s.pts.P!, key: "beam" },
    { type: "axial", a: s.pts.B!, b: [(s.x as number) + 34, 0], key: "slider push" },
  ],
  angles(s) {
    return [{ type: "angle", c: O, a: [a, 0], b: s.pts.M!, r: 24, key: "crank", value: ((s.phi as number) * 180) / Math.PI }];
  },
  plot: { label: "Beam end height", unit: "mm", f: (s) => s.pts.P![1] },
});
