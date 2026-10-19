// The desmodromic cam's conjugacy, proved by sampling the lobes' outlines (not the construction): each rocker's shoe is the
// lash from its lobe at every cam angle, the valve's faces are where the rockers' noses put them, and no rocker meets its lobe.
import { describe, expect, it } from "vitest";
import { TAU, xf } from "../../src/core/geom";
import { overlap, region } from "../../src/core/poly";
import model, { E0, L, Q1, Q2, base1, base2, collarX1, contact, lash, law, lobeClose, lobeOpen, rt, shoeGap } from "../../src/mechanisms/desmodromic-cam/model";

const N = 1440;
const part = (id: string) => model.parts.find((p) => p.id === id)!;
const pose = (id: string, u: number) => {
  const p = part(id);
  const s = model.solve(u);
  const a = p.at ? s.pts[p.at]! : [0, 0];
  return [a[0], a[1], p.spin!(s)] as [number, number, number];
};

describe("desmodromic cam", () => {
  it("keeps each shoe the lash from its lobe at every cam angle", () => {
    for (const which of [1, 2] as const)
      for (let k = 0; k < N; k++) {
        const g = shoeGap(which, (k / N) * TAU);
        expect(Math.abs(g - lash)).toBeLessThan(0.005);
      }
  });

  it("has the catalogue's base circles and a lift of 10 at the valve", () => {
    const r = (o: [number, number][]) => o.map(([x, y]) => Math.hypot(x, y));
    expect(Math.min(...r(lobeOpen))).toBeCloseTo(base1, 2);
    expect(Math.min(...r(lobeClose))).toBeCloseTo(base2, 2);
    const y = Array.from({ length: N }, (_, k) => law((k / N) * TAU).y);
    expect(Math.max(...y)).toBeCloseTo(10, 6);
    expect(Math.min(...y)).toBe(0);
    // 60° rise, 60° return, 240° dwell
    const open = y.filter((v) => v > 1e-9).length / N;
    expect(Math.abs(open - 120 / 360)).toBeLessThan(0.01);
  });

  it("puts the valve's end face and the collar's face where the noses are, so lift = 30 sin(psi)", () => {
    for (let k = 0; k < 360; k++) {
      const u = (k / 360) * TAU;
      const s = model.solve(u);
      const y = law(u).y;
      expect(s.pts.N1![0] + rt - (E0 + y)).toBeCloseTo(0, 9);
      expect(s.pts.N2![0] - rt - (collarX1 + y)).toBeCloseTo(0, 9);
      expect(s.pts.N1![0] - Q1[0]).toBeCloseTo(y, 9);
      expect(s.pts.N2![0] - Q2[0]).toBeCloseTo(y, 9);
      expect(Math.hypot(s.pts.N1![0] - Q1[0], s.pts.N1![1] - Q1[1])).toBeCloseTo(L, 9);
    }
  });

  it("never lets a rocker's body meet its lobe, and keeps the pressure angle under 35°", () => {
    for (const [r, l, w] of [["rockerOpen", "lobeOpen", 1], ["rockerClose", "lobeClose", 2]] as const) {
      let worst = 0;
      let pa = 0;
      for (let k = 0; k < 360; k++) {
        const u = (k / 360) * TAU;
        const ra = region(xf(part(r).shape.outer, pose(r, u)), []);
        const q = pose(l, u);
        const rb = region(xf(part(l).shape.outer, q), part(l).shape.holes.map((h) => xf(h, q)));
        worst = Math.max(worst, overlap(ra, rb));
        pa = Math.max(pa, contact(w, u).pa);
      }
      expect(worst).toBeLessThan(0.05);
      expect(pa).toBeLessThan(35);
    }
  });
});
