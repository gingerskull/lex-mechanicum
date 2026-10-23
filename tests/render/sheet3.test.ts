// The drawing sheet's eggs that can be checked without drawing: the microprint's bits and the paused ring's breath.
import { describe, expect, it } from "vitest";
import { ringBreath } from "../../src/render/v3/session";
import { MICROPRINT, MICROPRINT_BITS } from "../../src/render/v3/sheet";
import { DRAFT } from "../../src/style/draft";

describe("the microprint (LM-05)", () => {
  it("is the 8-bit ASCII of LEX MECHANICUM, as ones and zeros", () => {
    expect(MICROPRINT).toBe("LEX MECHANICUM");
    expect(MICROPRINT_BITS).toMatch(/^[01]+$/);
    expect(MICROPRINT_BITS).toHaveLength(8 * MICROPRINT.length);
    const back = MICROPRINT_BITS.match(/.{8}/g)!.map((b) => String.fromCharCode(parseInt(b, 2))).join("");
    expect(back).toBe(MICROPRINT);
    expect(MICROPRINT_BITS.startsWith("01001100")).toBe(true);
  });
});

describe("the paused ring's breath (LM-06)", () => {
  const B = DRAFT.lines.accentRing.breathe;

  it("starts at full strength, is faintest half a period later and full again after one", () => {
    expect(ringBreath(0)).toBeCloseTo(1, 9);
    expect(ringBreath(B.period / 2)).toBeCloseTo(B.low, 9);
    expect(ringBreath(B.period)).toBeCloseTo(1, 9);
  });

  it("stays between low and full strength", () => {
    for (let t = 0; t < 3 * B.period; t += 0.07) {
      expect(ringBreath(t)).toBeGreaterThanOrEqual(B.low - 1e-12);
      expect(ringBreath(t)).toBeLessThanOrEqual(1 + 1e-12);
    }
  });

  it("is a slow 5 s cycle down to 35%, redrawn often enough to look smooth", () => {
    expect(B.period).toBe(5);
    expect(B.low).toBe(0.35);
    // a step of at most a few hundredths of the range between redraws
    expect((1 - B.low) * Math.PI / (B.period * B.fps)).toBeLessThan(0.03);
  });
});
