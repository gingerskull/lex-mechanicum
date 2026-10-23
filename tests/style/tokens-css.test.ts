import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { theme, rgba, hexToRgb } from "../../src/style/theme";
import { COLOR_NAMES, TOKENS } from "../../src/style/tokens";
import { kebab, tokensCss, writeTokensCss } from "../../tools/tokens-css";

const css = tokensCss();
const block = (selector: string) => {
  const start = css.indexOf(`${selector} {`);
  expect(start, selector).toBeGreaterThanOrEqual(0);
  return css.slice(start, css.indexOf("}", start));
};

describe("generated tokens.css", () => {
  it("has a dark :root block, a light block and a forge block", () => {
    expect(block(":root")).toContain("color-scheme: dark");
    expect(block(':root[data-theme="light"]')).toContain("color-scheme: light");
    expect(block(':root[data-theme="forge"]')).toContain("color-scheme: dark");
  });

  it("names every theme token as --kebab in every block, with its value", () => {
    for (const key of ["dark", "light", "forge"] as const) {
      const b = block(key === "dark" ? ":root" : `:root[data-theme="${key}"]`);
      const t = TOKENS.themes[key];
      for (const c of COLOR_NAMES) expect(b).toContain(`${kebab(c)}: ${t[c]};`);
      expect(b).toContain(`--pattern-gain: ${t.patternGain};`);
      expect(b).toContain(`--grain: ${t.grain};`);
      for (const tier of [...Object.keys(TOKENS.tiers), ...Object.keys(TOKENS.gridTiers)]) expect(b).toContain(kebab(tier));
    }
    expect(kebab("paperEdge")).toBe("--paper-edge");
    expect(kebab("line2")).toBe("--line-2");
  });

  it("holds no colour or font value that is not in the tokens", () => {
    const hexes = new Set(Object.values(TOKENS.themes).flatMap((t) => COLOR_NAMES.map((c) => t[c].toLowerCase())));
    for (const h of css.match(/#[0-9a-f]{3,8}\b/gi) ?? []) expect(hexes).toContain(h.toLowerCase());
    expect(css).not.toMatch(/rgba?\(/);
    for (const m of css.matchAll(/--font-(\w+): ([^;]+);/g)) {
      expect(m[2]).toBe(TOKENS.type[m[1] as "display" | "body" | "mono"]);
    }
    // derived tiers only mix token colours
    for (const m of css.matchAll(/color-mix\(in srgb, var\((--[\w-]+)\)/g)) expect(["--ink", "--grid"]).toContain(m[1]);
  });

  const dir = mkdtempSync(join(tmpdir(), "tokens-css-"));
  afterAll(() => rmSync(dir, { recursive: true, force: true }));

  it("writes the same file when run twice", () => {
    const path = join(dir, "styles", "tokens.css");
    writeTokensCss(path);
    const first = readFileSync(path, "utf8");
    writeTokensCss(path);
    expect(readFileSync(path, "utf8")).toBe(first);
    expect(first).toBe(css);
    expect(first.startsWith("/* Generated")).toBe(true);
  });
});

describe("theme()", () => {
  it("resolves every colour to an rgb triple", () => {
    const t = theme("dark");
    expect(t.paper).toEqual([0x14, 0x21, 0x30]);
    expect(t.dark).toBe(true);
    expect(theme("light").dark).toBe(false);
    expect(theme("forge").dark).toBe(true);
    expect(rgba(t.accent, 0.5)).toBe("rgba(242,154,107,0.5)");
    expect(hexToRgb("#fff")).toEqual([255, 255, 255]);
  });

  it("keeps warn amber on every sheet (no red, SF3)", () => {
    for (const key of ["dark", "light", "forge"] as const) {
      const [r, g, b] = theme(key).warn.map((v) => v / 255) as [number, number, number];
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      const hue = max === r ? (60 * (g - b)) / (max - min) : 0;
      expect(hue, key).toBeGreaterThan(28);
      expect(hue, key).toBeLessThan(50);
    }
  });
});
