// Construction labels (SD22): each hangs on the steadiest of the points it could, its slot is set from where it sits over
// the cycle (so it does not move while the drawing plays), and the slots of a rail keep their order, their spacing and
// the rail's bounds.
import { describe, expect, it } from "vitest";
import { calloutPlan, coverage, spotKeys, steadiest, type LabelSpot } from "../../src/render/v3/labels";
import { DRAFT } from "../../src/style/draft";

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

  it("keeps callouts apart, and their lettering off the drawing where the sheet has room", () => {
    const frames = cycle(24);
    const st = steadiest(frames);
    // the drawing fills the middle of an 800 x 500 sheet
    const drawn = coverage([[250, 120, 550, 380]], 800, 500);
    const items = calloutPlan(frames, st, 400, { w: 800, h: 500, block: [560, 440, 790, 490], drawn }, (t) => t.length * 7);
    expect(items).toHaveLength(3);
    // each label's lettering at the first phase, as calloutPlan lays it out
    const K = DRAFT.overlays.callout;
    const boxes = items.map((it) => {
      const k = frames[0]!.findIndex((f, i) => `${f.base}#${frames[0]!.slice(0, i).filter((g) => g.base === f.base).length}` === it.key);
      const a = frames[0]![k]!.cands[it.cand]!;
      const s = it.side === 0 ? -1 : 1;
      const w = it.text.length * 7;
      const x0 = a[0] + s * (K.gap + (it.x ?? 0)), x1 = x0 + s * w;
      const ky = a[1] + it.y;
      return [Math.min(x0, x1), ky - K.textH - K.lift, Math.max(x0, x1), ky] as [number, number, number, number];
    });
    for (let i = 0; i < boxes.length; i++)
      for (let j = i + 1; j < boxes.length; j++) {
        const [a, b] = [boxes[i]!, boxes[j]!];
        expect(a[2] + K.sepX / 2 <= b[0] || b[2] + K.sepX / 2 <= a[0] || a[3] + K.sepY / 2 <= b[1] || b[3] + K.sepY / 2 <= a[1], `${items[i]!.key} and ${items[j]!.key}`).toBe(true);
      }
    for (const b of boxes) expect(drawn(b)).toBeLessThan(0.05);
  });

  it("counts an outline off the canvas as covering nothing", () => {
    const drawn = coverage([[-400, 10, -100, 200]], 400, 300);
    expect(drawn([0, 0, 400, 300])).toBe(0);
  });

  it("numbers labels by their overlay, so a frame where one draws nothing shifts no other", () => {
    const frames: LabelSpot[][] = [
      [{ text: "A", base: "A", n: 0, sub: 0, cands: [[10, 10]] }, { text: "B", base: "B", n: 1, sub: 0, cands: [[50, 50]] }, { text: "C", base: "C", n: 2, sub: 0, cands: [[90, 90]] }],
      [{ text: "A", base: "A", n: 0, sub: 0, cands: [[10, 10]] }, { text: "C", base: "C", n: 2, sub: 0, cands: [[90, 90]] }],
    ];
    expect(steadiest(frames).map((s) => [s.text, s.n])).toEqual([["A", 0], ["B", 1], ["C", 2]]);
  });

  it("finds how much of a box lies over the drawing", () => {
    const drawn = coverage([[100, 100, 200, 200]], 400, 300);
    expect(drawn([10, 10, 60, 60])).toBe(0);
    expect(drawn([110, 110, 190, 190])).toBe(1);
    expect(drawn([50, 120, 150, 180])).toBeGreaterThan(0.3);
  });

  it("sets the slots from the whole cycle, so where the drawing is in it does not move them", () => {
    const a = steadiest(cycle(24));
    const b = steadiest(cycle(24).slice(5).concat(cycle(24).slice(0, 5)));
    expect(b.map((s) => [s.key, s.cand, Math.round(s.mean[0]), Math.round(s.mean[1])])).toEqual(a.map((s) => [s.key, s.cand, Math.round(s.mean[0]), Math.round(s.mean[1])]));
  });
});
