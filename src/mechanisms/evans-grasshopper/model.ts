// Evans' grasshopper linkage (catalogue "evans-grasshopper"): radius link O1 to M, a = 50, on the ground pivot O1
// (0, 0); a beam of length 2a pinned to it at its midpoint M, its end B on a swing link of length b = 200 from the
// ground pivot O2 (200, 60). With B held on the y axis (a Scott Russell slide) the other beam end P = 2M - B would run
// exactly along the x axis; the long swing link replaces the slide, so P stays within 1.4 mm of y = 0 while the radius
// link swings 25° to 65° and P runs x 40 to 90.
// The radius link rides on layer 0, the beam over it on layer 1, the swing link over the beam on layer 2; a front plate
// of the radius link (a twin) over the beam puts M in double shear.
import { D2R, ring } from "../../core/geom";
import { V, circleX, osc } from "../../core/vec";
import { defineMechanism } from "../../model/define";
import type { Vec2 } from "../../model/types";
import { P, heights } from "../../parts";

export const a = 50;
export const b = 200;
const O1: Vec2 = [0, 0];
const O2: Vec2 = [200, 60];
const LO = 25 * D2R;
const HI = 65 * D2R;
/** Boss radii of the tapered links (D1): the input boss round the keyed Ø10 shaft, the pin bosses round their bearings. */
const RADIUS_R: [number, number] = [13, 9.5];
const SWING_R: [number, number] = [12, 9.5];

const tracer = P.tracer("tip", 1, { at: "P", name: "Beam end" });

const beam = P.link("beam", 2 * a, { role: "output", layer: 1, r: [9.5, 9.5], between: ["B", "P"], name: "Beam" });
// the middle pin boss engraved like the end bosses (D1)
beam.marks.push(ring(9.5 - 1.6, a, 0));

export default defineMechanism({
  id: "evans-grasshopper",
  input: { kind: "oscillating", part: "radius" },
  parts: [
    P.link("radius", a, { role: "driver", r: RADIUS_R, between: ["O1", "M"], name: "Radius link (input)" }),
    // the radius link is a clevis: a front plate over the beam puts M in double shear (A9)
    P.link("radius-front", a, { role: "driver", r: RADIUS_R, layer: 2, dz: -2.5, twin: "radius", between: ["O1", "M"], name: "Radius link, front plate" }),
    beam,
    P.link("swing", b, { role: "link", layer: 2, r: SWING_R, between: ["O2", "B"], name: "Swing link" }),
    P.cap("pO1", -1, 7, { fixed: [O1[0], O1[1], 0], accent: true, span: 4 }),
    P.cap("pO2", -1, 7, { fixed: [O2[0], O2[1], 0], span: 3 }),
    P.cap("pM", 0, 5.5, { at: "M", span: 3 }),
    P.cap("pB", 1, 5.5, { at: "B", span: 2 }),
    tracer,
  ],
  traceZ: heights(tracer)[1],
  solve(u) {
    const th = osc(LO, HI)(u);
    const M = V.at(O1, th, a);
    // the intersection of circle(M, a) and circle(O2, b) nearest to x = 0
    const B = circleX(M, a, O2, b, 1);
    const Pt: Vec2 = [2 * M[0] - B[0], 2 * M[1] - B[1]];
    return { pts: { O1, O2, M, B, P: Pt }, th };
  },
  paths: ["P"],
  vel: ["P", "B"],
  forces: (s) => [
    { type: "axial", a: s.pts.B!, b: O2, key: "swing link" },
    { type: "axial", a: s.pts.B!, b: s.pts.P!, key: "beam" },
    { type: "spin", c: O1, r: 30, key: "input", z: 1.2 },
  ],
  angles(s) {
    const v1 = V.sub(s.pts.M!, s.pts.B!);
    const v2 = V.sub(O2, s.pts.B!);
    const mu = Math.acos(Math.max(-1, Math.min(1, (v1[0] * v2[0] + v1[1] * v2[1]) / (a * b)))) / D2R;
    return [
      { type: "angle", c: s.pts.B!, a: s.pts.M!, b: O2, r: 22, key: "transmission", value: mu, warn: mu < 40 || mu > 140 },
      { type: "angle", c: O1, a: [a, 0], b: s.pts.M!, r: 22, key: "crank", value: (s.th as number) / D2R, z: 1.2 },
    ];
  },
  plot: { label: "Beam end offset from y = 0", unit: "mm", f: (s) => s.pts.P![1] },
});
