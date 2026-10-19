// Hart's inversor (catalogue "hart-inversor"): ground pivots A (0, 0) and B (20, 0); a crank B to g, 20 long, swinging
// ±80° from the position pointing away from A, so g runs on a circle through A. The antiparallelogram: short bar CE, 60,
// pivoted to ground at its midpoint A; long bar EF, 120, with the crank pin g at its midpoint; short bar FD, 60; long bar
// CD, 120, with the traced point p at its midpoint. The midpoints of the four bars stay collinear and A p x A g =
// (l² - s²) / 4 = 2700 mm², so with |AB| = |Bg| = 20 the point p runs on the line x = 67.5 exactly: 113 mm for ±80°
// (the crank is limited to ±82.8°, where |Ag| = 30 and E can no longer reach g).
// The long bars cross and EF and CE pass over the input pivot B and the ground pivot A, so no through-pin stacks: crank
// and FD on layer 0, EF on layer 1, CD on layer 2, CE on layer 3. The input shaft rises from below to the crank; the
// ground pivot A is carried from above, a stub from a bridge into CE only (J1, hung), so nothing below CE meets it.
import { D2R, ring } from "../../core/geom";
import { V, circleX, osc } from "../../core/vec";
import { defineMechanism } from "../../model/define";
import type { Part, Vec2 } from "../../model/types";
import { P, heights } from "../../parts";

export const l = 120;
export const s = 60;
const crankL = 20;
const A: Vec2 = [0, 0];
const B: Vec2 = [20, 0];
const swing = 80 * D2R;
/** Plating (K1: heights may change, centres may not): CD and CE ride 3.5 mm up so the pin heads over EF (Ø13 on a Ø8 shoulder) clear them. */
const UP = 3.5;

/** Boss radii of the links (D1): the input boss round the keyed Ø10 shaft, the pin bosses round their bearings. */
const BOSS: [number, number] = [9.5, 9.5];
const CRANK_R: [number, number] = [12.5, 9.5];

/** A bar with its middle pin boss engraved like the end bosses (D1). */
function bar(id: string, L: number, layer: number, between: [string, string], name: string, mid = false, dz = 0): Part {
  const p = P.link(id, L, { role: "link", layer, r: BOSS, between, name, ...(dz ? { dz } : {}) });
  if (mid) p.marks.push(ring(BOSS[0] - 1.6, L / 2, 0));
  return p;
}

const tracer = P.tracer("p", 2, { at: "p", name: "Midpoint of CD" });

/** The six moving points for a crank angle, on one assembly branch (E, then D, picked so the bars are crossed). */
function pose(th: number) {
  const g = V.at(B, th, crankL);
  const E = circleX(A, s / 2, g, s, 1);
  const C: Vec2 = [-E[0], -E[1]];
  const F: Vec2 = [2 * g[0] - E[0], 2 * g[1] - E[1]];
  const D = circleX(C, l, F, s, 1);
  const p: Vec2 = [(C[0] + D[0]) / 2, (C[1] + D[1]) / 2];
  return { g, E, C, F, D, p };
}

export default defineMechanism({
  id: "hart-inversor",
  input: { kind: "oscillating", part: "crank" },
  parts: [
    P.link("crank", crankL, { role: "driver", r: CRANK_R, between: ["B", "g"], name: "Crank (input)" }),
    bar("CE", s, 3, ["E", "C"], "Short bar CE", true, UP),
    bar("FD", s, 0, ["F", "D"], "Short bar FD"),
    bar("EF", l, 1, ["E", "F"], "Long bar EF", true),
    { ...bar("CD", l, 2, ["C", "D"], "Long bar CD", true, UP), role: "output" },
    P.cap("pA", 3, 7, { fixed: [A[0], A[1], 0], span: 0 }),
    P.cap("pB", -1, 7, { fixed: [B[0], B[1], 0], accent: true }),
    P.cap("pg", 0, 5.5, { at: "g", span: 1 }),
    P.cap("pE", 1, 5.5, { at: "E", span: 2 }),
    P.cap("pC", 2, 5.5, { at: "C", span: 1 }),
    P.cap("pF", 0, 5.5, { at: "F", span: 1 }),
    P.cap("pD", 0, 5.5, { at: "D", span: 2 }),
    tracer,
  ],
  traceZ: heights(tracer)[1],
  solve(u) {
    const th = osc(-swing, swing)(u);
    const q = pose(th);
    return { pts: { A, B, ...q }, th };
  },
  paths: ["p"],
  vel: ["p", "g"],
  forces: (st) => [
    { type: "axial", a: st.pts.E!, b: st.pts.F!, key: "long bar" },
    { type: "axial", a: st.pts.C!, b: st.pts.D!, key: "output bar" },
    { type: "spin", c: B, r: 30, key: "input", z: 1.2 },
  ],
  angles(st) {
    return [{ type: "angle", c: B, a: [B[0] + crankL, 0], b: st.pts.g!, r: 22, key: "crank", value: (st.th as number) / D2R, z: 1.2 }];
  },
  plot: { label: "Position along the line x = 67.5", unit: "mm", f: (st) => st.pts.p![1] },
});
