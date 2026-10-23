// The Forge sheet's rules that need no page (SS14): the switch's order and the unlock's click count.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { clickCounter, nextSheet } from "../../site/src/forge";
import { HINTS, isLore, LORE_WORDS, normal, pickHint } from "../../site/src/lore";
import { loadCatalog } from "../../src/catalog";
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

describe("the hold on the cog", () => {
  it("waits a second before the fill starts, and fills for two", () => {
    expect(FORGE.unlock.holdDelay).toBe(1);
    expect(FORGE.unlock.holdFill).toBe(2);
  });

  it("blips no more than once a second, so nothing flashes more than 3 times a second", () => {
    expect(FORGE.page.blips.every[0]).toBeGreaterThanOrEqual(1);
    expect(FORGE.page.blips.length).toBeLessThan(1 / 3);
  });
});

describe("the lore of the sealed search", () => {
  it("reads a query the same in any case, with any spacing or hyphens", () => {
    expect(normal("  Tech-Priest ")).toBe("tech priest");
    expect(isLore("OMNISSIAH")).toBe(true);
    expect(isLore("tech-priest")).toBe(true);
    expect(isLore("The  flesh is weak!")).toBe(true);
    expect(isLore("Metalica")).toBe(true);
    expect(isLore("")).toBe(false);
    expect(isLore("geneva")).toBe(false);
    expect(isLore("forge press")).toBe(false);
  });

  it("has a good chunk of words, every release codename among them", () => {
    expect(LORE_WORDS.length).toBeGreaterThanOrEqual(40);
    const names: string[] = JSON.parse(readFileSync("data/release-names.json", "utf8"));
    for (const n of names.slice(0, 9)) expect(isLore(n), n).toBe(true);
  });

  it("never seals a real mechanism: no lore word is a word of any record's name, other names, tags or summary", () => {
    for (const r of loadCatalog().mechanisms) {
      const text = ` ${normal([r.name, ...(r.aka ?? []), r.summary, r.family, ...r.tags.function, ...r.tags.property, ...r.tags.application, ...(r.tags.keywords ?? [])].join(" "))} `;
      for (const w of LORE_WORDS) expect(text.includes(` ${normal(w)} `), `${r.id}: ${w}`).toBe(false);
    }
  });

  it("picks every hint, and only hints", () => {
    expect(HINTS.length).toBeGreaterThanOrEqual(5);
    expect(pickHint(0)).toBe(HINTS[0]);
    expect(pickHint(0.9999)).toBe(HINTS[HINTS.length - 1]);
    expect(pickHint(1)).toBe(HINTS[HINTS.length - 1]);
    for (const h of HINTS) expect(h).toMatch(/cog|hold|hand/i);
  });
});
