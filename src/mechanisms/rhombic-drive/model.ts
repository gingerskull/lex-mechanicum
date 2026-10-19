// Rhombic drive (catalogue "rhombic-drive"): two 30-tooth module-2 gears at G1 (-30, 0) and G2 (30, 0), 60 apart,
// turning opposite ways at the same speed. Each carries a crank pin 20 from its centre, mirrored: PR = (e + r cos t,
// r sin t), PL = (-e - r cos t, r sin t) with e 30, r 20. Four 60 mm rods make the rhombus: PL and PR to the power
// piston's yoke T above, and to the displacer's yoke Bt below, both yokes on the axis x = 0. y_T = r sin t +
// sqrt(L^2 - (e + r cos t)^2), y_Bt = r sin t - sqrt(...): piston 26.5 to 74.2, displacer -74.2 to -26.5 (stroke 47.7
// each), the displacer leading by about 70°, no side thrust. The demo drives gear 1 at constant speed (rotary); gear 2
// is phased half a tooth so a tooth of one sits in a gap of the other on the line of centres.
// Layers: the gears at the bottom, the rods on layers 1 and 2 so the two rods at each crank pin and at each yoke are on
// different layers (rod1 and rod4 on 1, rod2 and rod3 on 2: each pair that meets is split, and rods on one layer are
// always apart), the yokes and their rails over everything on layer 4, because the axis x = 0 runs through the gears'
// tip circles up to y 11 and the rails at x = ±13.5 meet the gear tips up to y 29.
import { circle, ring, type Vec2 } from "../../core/geom";
import { defineMechanism } from "../../model/define";
import { P } from "../../parts";

export const e = 30;
export const r = 20;
export const L = 60;
const z = 30;
const m = 2;
const G1: Vec2 = [-e, 0];
const G2: Vec2 = [e, 0];
const RAIL = 26;
/** Plating (K1: heights may change, centres may not): the rods ride 4 mm up so they clear the gear hubs and the shaft ends. */
const UP = 4;

const gear1 = P.gear("gear1", z, m, { role: "driver", at: "G1", spin: (s) => s.a as number, bore: false, name: "Gear 1, 30 teeth" });
const gear2 = P.gear("gear2", z, m, { role: "link", at: "G2", spin: (s) => s.b as number, bore: false, name: "Gear 2, 30 teeth" });
// keyed bores that size the shafts (A3): Ø10
for (const g of [gear1, gear2]) {
  g.shape.holes = [circle(6, 0, 0, 36)];
  g.marks.push(ring(r - 7.5));
}

const yoke = (id: string, at: string, role: "link" | "output", name: string) => ({
  ...P.slider(id, 36, RAIL, { role, layer: 4, at, spin: () => Math.PI / 2, name }),
  thick: 6,
});

export default defineMechanism({
  id: "rhombic-drive",
  input: { kind: "rotary", part: "gear1" },
  parts: [
    gear1,
    gear2,
    P.link("rod1", L, { layer: 1, dz: UP, r: [8.5, 8.5], between: ["PL", "T"], name: "Rod, left to power yoke" }),
    P.link("rod2", L, { layer: 2, dz: UP, r: [8.5, 8.5], between: ["PR", "T"], name: "Rod, right to power yoke" }),
    P.link("rod3", L, { layer: 2, dz: UP, r: [8.5, 8.5], between: ["PL", "Bt"], name: "Rod, left to displacer yoke" }),
    P.link("rod4", L, { layer: 1, dz: UP, r: [8.5, 8.5], between: ["PR", "Bt"], name: "Rod, right to displacer yoke" }),
    yoke("piston", "T", "link", "Power piston yoke"),
    yoke("displacer", "Bt", "output", "Displacer yoke"),
    ...P.rails("prail", 5, 100, RAIL, { layer: 4, fixed: [0, 0, Math.PI / 2], name: "Piston rail" }),
    ...P.rails("drail", 5, 100, RAIL, { layer: 4, fixed: [0, 0, -Math.PI / 2], name: "Displacer rail" }),
    P.cap("pG1", -1, 7, { fixed: [G1[0], G1[1], 0], accent: true }),
    P.cap("pG2", -1, 7, { fixed: [G2[0], G2[1], 0] }),
    P.cap("pPL", 0, 5.5, { at: "PL", span: 2 }),
    P.cap("pPR", 0, 5.5, { at: "PR", span: 2 }),
    P.cap("pT", 1, 5.5, { at: "T", span: 3 }),
    P.cap("pBt", 1, 5.5, { at: "Bt", span: 3 }),
  ],
  traceZ: 46.8,
  solve(u) {
    const c = Math.cos(u);
    const s = Math.sin(u);
    const h = Math.sqrt(L * L - (e + r * c) ** 2);
    const PR: Vec2 = [e + r * c, r * s];
    const PL: Vec2 = [-e - r * c, r * s];
    return {
      pts: { G1, G2, PL, PR, T: [0, r * s + h], Bt: [0, r * s - h] },
      // gear 1 turns the other way; gear 2 is phased half a tooth for the mesh
      a: Math.PI - u,
      b: u + Math.PI / z,
    };
  },
  paths: ["T", "Bt"],
  vel: ["T", "Bt"],
  forces: (st) => [
    { type: "axial", a: st.pts.PL!, b: st.pts.T!, key: "rod" },
    { type: "axial", a: st.pts.PR!, b: st.pts.Bt!, key: "rod" },
    { type: "spin", c: G1, r: 40, key: "input", z: 1.2 },
  ],
  plot: { label: "Piston position", unit: "mm", f: (st) => st.pts.T![1] },
});
