import { describe, expect, it } from "vitest";
import { projector } from "../../src/render/projector";

const size = { w: 800, h: 500 };
const B = { minX: -100, minY: -80, maxX: 120, maxY: 90 };

describe("projector", () => {
  it("ignores z in plan", () => {
    const P = projector({ tilt: 0 }, size, B, [-10, 30], 20);
    expect(P.P(10, 20, 0)).toEqual(P.P(10, 20, 25));
  });

  it("projects a height to its sine at side elevation", () => {
    const P = projector({ tilt: 88 }, size, B, [-10, 30], 20);
    const a = P.P(0, 0, 0);
    const b = P.P(0, 0, 10);
    expect(a[1] - b[1]).toBeCloseTo(10 * Math.sin((88 * Math.PI) / 180) * P.s, 9);
    expect(a[0]).toBeCloseTo(b[0], 12);
  });

  it("has an affine map per height equal to P", () => {
    const P = projector({ tilt: 28 }, size, B, [-10, 30], 20);
    for (const [X, Y, z] of [[0, 0, 0], [37, -12, 6], [-80, 55, 21.5]] as const) {
      const [a, b, c, d, e, f] = P.affine(z);
      const q = P.P(X, Y, z);
      expect(a * X + c * Y + e).toBeCloseTo(q[0], 9);
      expect(b * X + d * Y + f).toBeCloseTo(q[1], 9);
    }
  });

  it("fits the bounds inside the padding", () => {
    const P = projector({ tilt: 28 }, size, B, [-10, 30], 20);
    for (const X of [B.minX, B.maxX]) for (const Y of [B.minY, B.maxY]) for (const z of [-10, 30]) {
      const [x, y] = P.P(X, Y, z);
      expect(x).toBeGreaterThanOrEqual(20 - 1e-6);
      expect(x).toBeLessThanOrEqual(780 + 1e-6);
      expect(y).toBeGreaterThanOrEqual(20 - 1e-6);
      expect(y).toBeLessThanOrEqual(480 + 1e-6);
    }
  });
});
