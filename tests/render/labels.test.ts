import { describe, expect, it } from "vitest";
import { capitals } from "../../src/render/v3/labels";

describe("label lettering", () => {
  it("capitals the words and keeps the Greek letters as written", () => {
    expect(capitals("swash angle γ")).toBe("SWASH ANGLE γ");
    expect(capitals("β/2")).toBe("β/2");
    expect(capitals("h = g / ω² 110.6")).toBe("H = G / ω² 110.6");
  });
});
