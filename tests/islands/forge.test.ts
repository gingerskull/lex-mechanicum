// The Forge sheet's rules that need no page (SS14): the switch's order and the unlock's click count.
import { describe, expect, it } from "vitest";
import { clickCounter, nextSheet } from "../../site/src/forge";
import { FORGE } from "../../src/style/forge";
import { PUBLIC_THEMES, TOKENS } from "../../src/style/tokens";

describe("the sheet switch", () => {
  it("swaps Blueprint and Drafting until Forge is unlocked", () => {
    expect(nextSheet("dark", false)).toBe("light");
    expect(nextSheet("light", false)).toBe("dark");
  });

  it("steps through three sheets once it is", () => {
    expect(nextSheet("dark", true)).toBe("light");
    expect(nextSheet("light", true)).toBe("forge");
    expect(nextSheet("forge", true)).toBe("dark");
  });

  it("leaves Forge for Blueprint if the unlock is gone", () => {
    expect(nextSheet("forge", false)).toBe("dark");
  });
});

describe("the unlock", () => {
  it("opens on the 16th click, one per law, and not before", () => {
    expect(FORGE.unlock.clicks).toBe(16);
    const count = clickCounter(16, 4);
    for (let i = 0; i < 15; i++) expect(count(i * 300)).toBe(false);
    expect(count(15 * 300)).toBe(true);
    // and counts again from nothing
    expect(count(15 * 300 + 200)).toBe(false);
  });

  it("starts the count again after a pause", () => {
    const count = clickCounter(16, 4);
    for (let i = 0; i < 10; i++) count(i * 300);
    let t = 9 * 300 + 4001;
    for (let i = 0; i < 15; i++) expect(count(t + i * 300)).toBe(false);
    t += 15 * 300;
    expect(count(t)).toBe(true);
  });
});

describe("the Forge sheet's safety and scope", () => {
  it("never flashes more than 3 times a second in the unlock moment", () => {
    const f = FORGE.unlock.flickers;
    for (const a of f) expect(f.filter((b) => b >= a && b < a + 1).length).toBeLessThanOrEqual(3);
    expect(f.length).toBeLessThanOrEqual(3);
    expect(FORGE.unlock.flickerLength).toBeLessThan(Math.min(...f.slice(1).map((b, i) => b - f[i]!)));
  });

  it("pulses no more often than every 20 s", () => {
    expect(FORGE.page.glitch.every[0]).toBeGreaterThanOrEqual(20);
    expect(FORGE.page.glitch.every[1]).toBeGreaterThan(FORGE.page.glitch.every[0]);
  });

  it("is not one of the public sheets, so no thumbnail, still or snapshot is drawn on it", () => {
    expect(PUBLIC_THEMES).toEqual(["dark", "light"]);
    expect(TOKENS.themes.forge.name).toBe("Forge");
  });
});
