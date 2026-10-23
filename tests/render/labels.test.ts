// Construction labels (SD22): each hangs on the steadiest of the points it could, its slot is set from where it sits over
// the cycle (so it does not move while the drawing plays), and the slots of a rail keep their order, their spacing and
// the rail's bounds.
import { describe, expect, it } from "vitest";
import { railSides, railSlots, spotKeys, steadiest, type LabelSpot } from "../../src/render/v3/labels";
import { DRAFT } from "../../src/style/draft";

const R = DRAFT.overlays.rail;
/** A label whose first point swings round a circle and whose second stays put, sampled over a cycle. */
const cycle = (n: number): LabelSpot[][] =>
  Array.from({ length: n }, (_, k) => {
    const a = (k / n) * Math.PI * 2;
    return [
      { text: "CRANK", base: "CRANK", cands: [[300 + 40 * Math.cos(a), 200 + 40 * Math.sin(a)], [300, 200]] },
      { text: "AXIS", base: "AXIS", cands: [[620, 120]] },
      { text: "AXIS", base: "AXIS", cands: [[640, 400]] },
    ];
  });

describe("construction labels (SD22)", () => {
  it("tells apart labels of the same name by their place in the order", () => {
    expect(spotKeys(cycle(1)[0]!)).toEqual(["CRANK#0", "AXIS#0", "AXIS#1"]);
  });

  it("knows a label by its overlay's name, though what it reads changes (a dimension's live value)", () => {
    const frames: LabelSpot[][] = [12.5, 13.1, 14.8].map((v) => [{ text: `OFFSET ${v}`, base: "OFFSET", cands: [[100, 100]] }]);
    expect(steadiest(frames)).toHaveLength(1);
  });

  it("hangs a label on its steadiest point, and keeps the first where none is steadier", () => {
    const st = steadiest(cycle(24));
    const crank = st.find((s) => s.text === "CRANK")!;
    expect(crank.cand).toBe(1);
    expect(crank.mean[0]).toBeCloseTo(300);
    expect(st.filter((s) => s.text === "AXIS").map((s) => s.cand)).toEqual([0, 0]);
    // numbered in the record's order
    expect(st.map((s) => s.n)).toEqual([0, 1, 2]);
  });

  it("puts each label in the rail on its side of the drawing, the rail as wide as its widest label", () => {
    const st = steadiest(cycle(24));
    const { sides, left, right } = railSides(st, 500, (t) => t.length * 7);
    expect(sides.get("CRANK#0")).toBe(0);
    expect(sides.get("AXIS#0")).toBe(1);
    expect(left).toBeGreaterThan(0);
    expect(right).toBeGreaterThan(0);
    expect(Math.max(left, right)).toBeLessThanOrEqual(R.maxW);
  });

  it("keeps a rail's labels in the order of their height, apart, and inside the rail", () => {
    const items = Array.from({ length: 8 }, (_, i) => ({ key: `L${i}#0`, n: i, text: `L${i}`, cand: 0, mean: [700, 300 + (i % 3)] as [number, number] }));
    const sides = new Map(items.map((it) => [it.key, 1 as const]));
    const slots = railSlots(items, sides, 30, [600, 560]);
    const ys = slots.map((s) => s.y);
    for (let i = 1; i < ys.length; i++) expect(ys[i]! - ys[i - 1]!).toBeGreaterThanOrEqual(R.spacing - 1e-9);
    expect(Math.min(...ys)).toBeGreaterThanOrEqual(30);
    expect(Math.max(...ys)).toBeLessThanOrEqual(560 + 1e-9);
  });

  it("sets the slots from the whole cycle, so where the drawing is in it does not move them", () => {
    const a = steadiest(cycle(24));
    const b = steadiest(cycle(24).slice(5).concat(cycle(24).slice(0, 5)));
    expect(b.map((s) => [s.key, s.cand, Math.round(s.mean[0]), Math.round(s.mean[1])])).toEqual(a.map((s) => [s.key, s.cand, Math.round(s.mean[0]), Math.round(s.mean[1])]));
  });
});
