// Trammel of Archimedes (catalogue "elliptic-trammel"): block X on the x groove at A = (L cos θ, 0), block Y on the y
// groove at B = (0, L sin θ), rod A to B with L 60, pen P a further p 40 past B. P = (-p cos θ, (L + p) sin θ) draws the
// ellipse x²/p² + y²/(L + p)² = 1 (half-axes 40 and 100); the crank O to M, M the rod's midpoint, is 30 long and M
// draws a circle. Crank and rod turn in opposite senses.
// Where the site differs from the catalogue (K6): the grooves are cut back to 40 mm from O, not 19. The crank pin M
// sweeps a circle of 30 mm through the layer the blocks run in, so no groove wall may stand within it; the blocks cross
// the opening on the rod's guidance (a pin at each end) and are 40 mm long, so they are in their grooves again from
// 20 mm either side of the crossing outward. The kinematics are the catalogue's.
import { D2R, ring } from "../../core/geom";
import { defineMechanism } from "../../model/define";
import type { Vec2 } from "../../model/types";
import { P, heights } from "../../parts";

export const L = 60;
export const p = 40;
const O: Vec2 = [0, 0];
/** Groove rails: gap between the pair, the nearest end to O and the outer end, mm. */
const GAP = 20;
const IN = 44;
const OUT = 88;
/**
 * Assembly phase: the build is laid out at crank angle 45°, where both blocks stand in a groove pair, so the rules find
 * every slide. u = 0 is 23.8° of crank; the cycle is still one turn.
 */
const PHASE = Math.PI / 4 - 0.37;

/**
 * Plating (K1: heights may change, centres may not): the crank sits 3 mm up so its top is 1 mm under the blocks. The rod
 * stays on its layer, 3 mm over the blocks, which leaves the keeper plates room to run under it.
 */
const CRANK_DZ = 3;
/** Boss radii of the tapered links (D1): the keyed Ø10 input and the Ø6 crank pin; the rod's big end and the pen end. */
const CRANK_R: [number, number] = [13, 9.5];
const ROD_R: [number, number] = [9, 6.5];

const rod = P.link("rod", L + p, { layer: 2, r: ROD_R, between: ["A", "P"], name: "Trammel rod" });
// the pins at M and B sit on the rod too: a ring at each
rod.marks.push(ring(6.6, L / 2, 0), ring(5.9, L, 0));
const pen = P.tracer("pen", 2, { at: "P", name: "Pen point" });

export default defineMechanism({
  id: "elliptic-trammel",
  input: { kind: "rotary", part: "crank" },
  parts: [
    P.link("crank", L / 2, { role: "driver", r: CRANK_R, dz: CRANK_DZ, between: ["O", "M"] }),
    // the grooves: a pair of rails each side of the crossing, cut back so the crank pin can go round (K6)
    ...P.rails("xr", IN, OUT, GAP, { layer: 1, name: "Groove rail" }),
    ...P.rails("xl", -OUT, -IN, GAP, { layer: 1, name: "Groove rail" }),
    ...P.rails("yu", IN, OUT, GAP, { layer: 1, fixed: [0, 0, Math.PI / 2], name: "Groove rail" }),
    ...P.rails("yd", -OUT, -IN, GAP, { layer: 1, fixed: [0, 0, Math.PI / 2], name: "Groove rail" }),
    P.slider("blockX", 40, GAP, { layer: 1, at: "A", name: "Block X" }),
    P.slider("blockY", 40, GAP, { layer: 1, at: "B", spin: () => Math.PI / 2, name: "Block Y" }),
    rod,
    P.cap("pO", -1, 7, { fixed: [0, 0, 0], accent: true }),
    P.cap("pM", 0, 5.5, { at: "M", span: 2 }),
    P.cap("pA", 1, 5.5, { at: "A" }),
    P.cap("pB", 1, 5.5, { at: "B" }),
    pen,
  ],
  traceZ: heights(pen)[1],
  solve(u) {
    const th = u + PHASE;
    const c = Math.cos(th);
    const s = Math.sin(th);
    const A: Vec2 = [L * c, 0];
    const B: Vec2 = [0, L * s];
    const M: Vec2 = [(L / 2) * c, (L / 2) * s];
    const Pp: Vec2 = [-p * c, (L + p) * s];
    return { pts: { O, A, B, M, P: Pp }, th };
  },
  paths: ["P", "M"],
  vel: ["P", "A", "B"],
  forces: (s) => {
    const th = s.th as number;
    return [
      { type: "axial", a: s.pts.A!, b: [s.pts.A![0], s.pts.A![1] + (Math.sin(th) >= 0 ? 26 : -26)], key: "groove" },
      { type: "axial", a: s.pts.B!, b: [s.pts.B![0] + (Math.cos(th) >= 0 ? 26 : -26), s.pts.B![1]], key: "groove" },
      { type: "spin", c: O, r: 22, key: "input", z: 1.2 },
    ];
  },
  angles(s) {
    const th = s.th as number;
    const deg = (((th / D2R) % 360) + 360) % 360;
    return [{ type: "angle", c: O, a: [30, 0], b: s.pts.M!, r: 16, key: "crank", value: deg, z: 1.2 }];
  },
  plot: { label: "Pen height", unit: "mm", f: (s) => s.pts.P![1] },
});
