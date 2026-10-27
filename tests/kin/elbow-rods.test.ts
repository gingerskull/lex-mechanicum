import { describe, expect, it } from "vitest";
import { elbowCorner, elbowRoot, lineMeet } from "../../src/kin/blocks/couplings";
import type { Vec3 } from "../../src/kin/math";

const r = 22;
const J: Vec3 = [0, 0, 0];
const a1: Vec3 = [1, 0, 0];
const a2: Vec3 = [0, -1, 0];
const bore = (deg: number): Vec3 => [-62, r * Math.cos((deg * Math.PI) / 180), r * Math.sin((deg * Math.PI) / 180)];
const distToAxis = (p: Vec3, a: Vec3) => {
  const k = p[0] * a[0] + p[1] * a[1] + p[2] * a[2];
  return Math.hypot(p[0] - k * a[0], p[1] - k * a[1], p[2] - k * a[2]);
};

describe("elbow-rods closed form (Hobson's joint)", () => {
  it("meets two crossing lines at their common point", () => {
    expect(lineMeet([-5, 3, 1], [1, 0, 0], [2, -7, 1], [0, 1, 0])).toEqual([2, 3, 1]);
  });

  it("puts the corner as far from the output axis as the bore is from the input axis, in one plane through J", () => {
    for (const k of [1, -1])
      for (let d = 0; d < 360; d += 15) {
        const B = elbowCorner(J, a1, a2, bore(d), k);
        expect(distToAxis(B, a2)).toBeCloseTo(r, 9);
        expect(distToAxis(B, a1)).toBeCloseTo(r, 9);
        // the root k = 1 keeps x = q·a2 = -y; k = -1 keeps x = y
        expect(B[0]).toBeCloseTo(k === 1 ? -B[1] : B[1], 9);
      }
  });

  it("reads the assembled root from the reference corner and refuses one on the crossing of the roots", () => {
    expect(elbowRoot(J, a1, a2, [r, r, 0]).k).toBe(-1);
    expect(elbowRoot(J, a1, a2, [-r, r, 0]).k).toBe(1);
    expect(() => elbowRoot(J, a1, a2, [0, 0, r])).toThrow(/roots meet/);
  });

  it("gives each of three rods at 120° a different output turn on the other root, so they hold the assembled one", () => {
    const outTurn = (B: Vec3, B0: Vec3) => Math.atan2(B[2], B[0]) - Math.atan2(B0[2], B0[0]);
    const wrap = (x: number) => Math.atan2(Math.sin(x), Math.cos(x));
    for (const d of [0, 30, 60]) {
      const turns = [0, 120, 240].map((ph) => wrap(outTurn(elbowCorner(J, a1, a2, bore(d + ph), 1), elbowCorner(J, a1, a2, bore(ph), -1))));
      expect(Math.abs(turns[0]! - turns[1]!)).toBeGreaterThan(0.1);
      expect(Math.abs(turns[1]! - turns[2]!)).toBeGreaterThan(0.1);
    }
  });
});
