import { describe, expect, it } from "vitest";
import { area, capsule, gearOutline, offsetPoly, roundedPoly, wrap, xf, xfPose, type Vec2 } from "../../src/core/geom";

describe("geom", () => {
  it("roundedPoly of two points is the capsule", () => {
    expect(roundedPoly([[0, 0], [50, 0]], 8)).toEqual(capsule(50, 16));
  });

  it("gearOutline(14, 4) has 14 teeth, tip radius 32 and root radius 23", () => {
    const pts = gearOutline(14, 4);
    const r = pts.map(([x, y]) => Math.hypot(x, y));
    expect(Math.max(...r)).toBeCloseTo(32, 2);
    expect(Math.min(...r)).toBeCloseTo(23, 2);
    // each tooth contributes one tip run: count entries into the tip radius going round the outline
    const tip = r.map((v) => Math.abs(v - 32) < 0.01);
    const runs = tip.filter((t, i) => t && !tip[(i - 1 + tip.length) % tip.length]).length;
    expect(runs).toBe(14);
  });

  it("offsetPoly of a square by -1 shrinks each side by 2", () => {
    const sq: Vec2[] = [[0, 0], [10, 0], [10, 10], [0, 10]];
    const out = offsetPoly(sq, -1);
    const xs = out.map((p) => p[0]);
    const ys = out.map((p) => p[1]);
    expect(Math.max(...xs) - Math.min(...xs)).toBeCloseTo(8, 9);
    expect(Math.max(...ys) - Math.min(...ys)).toBeCloseTo(8, 9);
    expect(area(out)).toBeCloseTo(64, 9);
    // the same with a clockwise outline
    expect(area(offsetPoly(sq.slice().reverse(), -1))).toBeCloseTo(-64, 9);
  });

  it("wrap and pose composition", () => {
    expect(wrap(3 * Math.PI / 2)).toBeCloseTo(-Math.PI / 2, 12);
    const [p] = xf([[10, 0]], [5, 5, Math.PI / 2]);
    expect(p![0]).toBeCloseTo(5, 12);
    expect(p![1]).toBeCloseTo(15, 12);
    const q = xfPose([5, 5, Math.PI / 2], [10, 0, 0.25]);
    expect(q[0]).toBeCloseTo(5, 12);
    expect(q[2]).toBeCloseTo(Math.PI / 2 + 0.25, 12);
  });
});
