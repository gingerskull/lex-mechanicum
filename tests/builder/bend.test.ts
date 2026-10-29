import { describe, expect, it } from "vitest";
import { slotAlong } from "../../src/builder/rules/bend";

describe("slots along a path (F7)", () => {
  it("are round at both ends: every outline point lies r from the path, and the ends reach r past it", () => {
    const r = 2.8;
    const path: [number, number][] = Array.from({ length: 25 }, (_, i) => {
      const a = (i / 24) * (Math.PI / 4);
      return [80 * Math.cos(a), 80 * Math.sin(a)];
    });
    const ring = slotAlong(path, r);
    // the distance from each outline point to the path (its nearest sample, or the arc between) is r
    for (const p of ring) {
      const d = Math.min(...path.map((q) => Math.hypot(p[0] - q[0], p[1] - q[1])));
      expect(d).toBeLessThan(r + 1e-6);
      expect(d).toBeGreaterThan(r * 0.99);
    }
    // each end reaches r past its end point, along the path's way there
    const reach = (end: [number, number], t: [number, number]) => Math.max(...ring.map((p) => (p[0] - end[0]) * t[0] + (p[1] - end[1]) * t[1]));
    expect(reach(path[24]!, [-Math.sin(Math.PI / 4), Math.cos(Math.PI / 4)])).toBeCloseTo(r, 2);
    expect(reach(path[0]!, [0, -1])).toBeCloseTo(r, 2);
    // and it runs counter-clockwise
    const area = ring.reduce((a, p, i) => a + p[0] * ring[(i + 1) % ring.length]![1] - ring[(i + 1) % ring.length]![0] * p[1], 0);
    expect(area).toBeGreaterThan(0);
  });
});
