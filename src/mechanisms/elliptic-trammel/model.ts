// Trammel of Archimedes (catalogue "elliptic-trammel"): block X on the x groove at A = (L cos θ, 0), block Y on the y
// groove at B = (0, L sin θ), rod A to B with L 60, pen P a further p 40 past B. P = (-p cos θ, (L + p) sin θ) draws the
// ellipse x²/p² + y²/(L + p)² = 1 (half-axes 40 and 100); the crank O to M, M the rod's midpoint, is 30 long and M
// draws a circle. Crank and rod turn in opposite senses.
// Layout (review fix, #61): the grooves are one cross-shaped plate, a + with both grooves cut through it and meeting at
// the centre, so the blocks cross the middle in a groove. Everything that turns is under the plate: the crank on the
// input shaft, the rod over it, and the blocks stand in the plate's own layer and pin down onto the rod. Nothing
// passes through the plate but the blocks, so the crank pin never meets a groove wall. The plate (hardware of the
// assembly, added by the polish from plateShape) stands on posts at the arm ends, outside the rod's sweep. The kinematics are the catalogue's.
import { D2R, ring } from "../../core/geom";
import { defineMechanism } from "../../model/define";
import type { Vec2 } from "../../model/types";
import { P, heights } from "../../parts";

export const L = 60;
export const p = 40;
const O: Vec2 = [0, 0];
/** Groove width, mm; the blocks are 40 long and fit it. */
export const GAP = 20;
/** Groove half length (closed ends carry the end-stop pads), plate wall beside a groove and the plate's arm ends. */
export const GROOVE = 86;
export const WALL = 7;
export const ARM_X = 98;
export const ARM_Y = 126;
/** Plate thickness: 0.3 mm over the blocks, so a keeper on its top clears them. */
export const PLATE_T = 7.3;
/** Inside corners of the plate and groove, mm (M7). */
const FIL = 2.5;
/** Block width across the groove: a 1.2 mm bronze gib on one wall and a running clearance either side. */
export const BLOCK_W = 17;
const PHASE = Math.PI / 4 - 0.37;

/** A closed polygon with every corner filleted to its own radius. */
function filleted(v: [number, number, number][]): Vec2[] {
  const out: Vec2[] = [];
  const n = v.length;
  for (let i = 0; i < n; i++) {
    const [x, y, r] = v[i]!;
    const [px, py] = v[(i + n - 1) % n]!;
    const [nx, ny] = v[(i + 1) % n]!;
    const a: Vec2 = [px - x, py - y];
    const b: Vec2 = [nx - x, ny - y];
    const la = Math.hypot(...a);
    const lb = Math.hypot(...b);
    const ua: Vec2 = [a[0] / la, a[1] / la];
    const ub: Vec2 = [b[0] / lb, b[1] / lb];
    const ang = Math.acos(Math.max(-1, Math.min(1, ua[0] * ub[0] + ua[1] * ub[1])));
    if (r <= 0 || ang > Math.PI - 1e-6) { out.push([x, y]); continue; }
    const t = r / Math.tan(ang / 2);
    const bis: Vec2 = [ua[0] + ub[0], ua[1] + ub[1]];
    const lbis = Math.hypot(...bis);
    const c: Vec2 = [x + (bis[0] / lbis) * (r / Math.sin(ang / 2)), y + (bis[1] / lbis) * (r / Math.sin(ang / 2))];
    const t0: Vec2 = [x + ua[0] * t, y + ua[1] * t];
    const t1: Vec2 = [x + ub[0] * t, y + ub[1] * t];
    const a0 = Math.atan2(t0[1] - c[1], t0[0] - c[0]);
    const a1 = Math.atan2(t1[1] - c[1], t1[0] - c[0]);
    let d = a1 - a0;
    while (d > Math.PI) d -= 2 * Math.PI;
    while (d < -Math.PI) d += 2 * Math.PI;
    const k = Math.max(3, Math.ceil(Math.abs(d) / (Math.PI / 12)));
    for (let j = 0; j <= k; j++) {
      const q = a0 + (d * j) / k;
      out.push([c[0] + r * Math.cos(q), c[1] + r * Math.sin(q)]);
    }
  }
  return out;
}

/**
 * The groove plate, one piece: a + whose two grooves are cut through it and meet at the centre. It is hardware of the
 * assembly (the polish adds it): the model carries the blocks and what turns, the rules need no rails to place it.
 */
export function plateShape(): { outer: Vec2[]; groove: Vec2[] } {
  const w = GAP / 2 + WALL;
  const g = GAP / 2;
  const R = GROOVE;
  const arms: [number, number, number][] = [
    [w, w, FIL + 2], [w, ARM_Y, 4], [-w, ARM_Y, 4], [-w, w, FIL + 2], [-ARM_X, w, 4], [-ARM_X, -w, 4],
    [-w, -w, FIL + 2], [-w, -ARM_Y, 4], [w, -ARM_Y, 4], [w, -w, FIL + 2], [ARM_X, -w, 4], [ARM_X, w, 4],
  ];
  const cut: [number, number, number][] = [
    [g, g, FIL], [g, R, FIL], [-g, R, FIL], [-g, g, FIL], [-R, g, FIL], [-R, -g, FIL],
    [-g, -g, FIL], [-g, -R, FIL], [g, -R, FIL], [g, -g, FIL], [R, -g, FIL], [R, g, FIL],
  ];
  return { outer: filleted(arms), groove: filleted(cut) };
}

/** Boss radii of the tapered links (D1): the keyed Ø10 input and the Ø6 crank pin; the rod's big end and the pen end. */
const CRANK_R: [number, number] = [13, 9.5];
const ROD_R: [number, number] = [9, 6.5];

/** The rod rides 3 mm under its layer, 1 mm over the crank, so the pin heads under the plate stay clear of it (K1: heights only). */
const ROD_DZ = -3;
const rod = P.link("rod", L + p, { layer: 1, dz: ROD_DZ, r: ROD_R, between: ["A", "P"], name: "Trammel rod" });
// the pins at M and B sit on the rod too: a ring at each
rod.marks.push(ring(6.6, L / 2, 0), ring(5.9, L, 0));
const pen = P.tracer("pen", 1, { at: "P", dz: ROD_DZ, name: "Pen point" });

export default defineMechanism({
  id: "elliptic-trammel",
  input: { kind: "rotary", part: "crank" },
  parts: [
    P.link("crank", L / 2, { role: "driver", r: CRANK_R, layer: 0, between: ["O", "M"] }),
    P.slider("blockX", 40, BLOCK_W, { layer: 2, at: "A", name: "Block X" }),
    P.slider("blockY", 40, BLOCK_W, { layer: 2, at: "B", spin: () => Math.PI / 2, name: "Block Y" }),
    rod,
    P.cap("pO", -1, 7, { fixed: [0, 0, 0], accent: true }),
    P.cap("pM", 0, 5.5, { at: "M", span: 1 }),
    P.cap("pA", 1, 5.5, { at: "A", span: 1, dz: ROD_DZ }),
    P.cap("pB", 1, 5.5, { at: "B", span: 1, dz: ROD_DZ }),
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
