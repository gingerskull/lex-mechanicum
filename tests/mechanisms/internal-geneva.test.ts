import { describe, expect, it } from "vitest";
import { TAU, xf, type Vec2 } from "../../src/core/geom";
import { edgeDist, inside } from "../../src/core/poly";
import { a, c, crankOutline, lockOpening, wheelAt } from "../../src/mechanisms/internal-geneva/model";

const deg = 180 / Math.PI;
const hole = lockOpening();
const body = crankOutline();
/** The crank outline in the wheel's frame at crank angle u, the wheel turned a further `d` from its rest. */
const inWheel = (u: number, d = 0): Vec2[] => xf(xf(body, [c, 0, u]), [0, 0, -(wheelAt(u).w + d)]);

describe("internal Geneva", () => {
  it("indexes 90° the crank's way in 270° of crank, resting for the other 90°", () => {
    const w = (t: number) => wheelAt((t * Math.PI) / 180).w * deg;
    expect(w(135) - w(-135)).toBeCloseTo(90, 9);
    expect(w(225) - w(135)).toBeCloseTo(0, 9);
    expect(w(360) - w(0)).toBeCloseTo(90, 9);
  });

  it("holds the pin on the slot axis while it is in a slot (tangential entry)", () => {
    for (let t = -134; t <= 134; t += 2) {
      const u = (t * Math.PI) / 180;
      const p: Vec2 = [c + a * Math.cos(u), a * Math.sin(u)];
      expect(Math.hypot(...p)).toBeGreaterThan(c * Math.cos(Math.PI / 4) - 1e-9);
      expect(Math.abs(Math.atan2(p[1], p[0]) - wheelAt(u).w)).toBeLessThan(1e-9);
    }
  });

  it("keeps the crank inside the locking plate's opening, at least 0.9 mm clear, over the whole cycle", () => {
    let min = Infinity;
    for (let i = 0; i < 360; i++)
      for (const q of inWheel((i / 360) * TAU)) {
        expect(inside(hole, q)).toBe(true);
        min = Math.min(min, edgeDist(hole, q));
      }
    expect(min).toBeGreaterThan(0.9);
  });

  it("locks the wheel to within 4° through the whole dwell", () => {
    for (let t = 135; t <= 225; t += 5)
      for (const sg of [1, -1]) {
        let d = 0;
        while (d < 0.2 && inWheel((t * Math.PI) / 180, sg * d).every((q) => inside(hole, q))) d += 0.0005;
        expect(d * deg).toBeLessThan(4);
      }
  });
});
