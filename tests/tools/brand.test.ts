import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PNG } from "pngjs";
import { describe, expect, it } from "vitest";
import { MARK_SHAPES } from "../../site/src/mark";
import { TOKENS } from "../../src/style/tokens";
import { BRAND_DIR, BRAND_FILES, brandStale, faviconSvg, ico } from "../../tools/brand";

const file = (f: string) => readFileSync(join(BRAND_DIR, f));

describe("the mark's icons and social card", () => {
  it("are committed, drawn from the current mark and tokens", () => {
    expect(brandStale()).toBeNull();
    for (const f of BRAND_FILES) expect(file(f).length, f).toBeGreaterThan(0);
  });

  it("give the favicon the mark in one colour, the ink of the sheet matching the browser's scheme", () => {
    const svg = file("favicon.svg").toString("utf8");
    expect(svg).toBe(faviconSvg());
    for (const s of MARK_SHAPES) expect(svg).toContain(s);
    expect(svg).toContain(`fill:${TOKENS.themes.light.ink}`);
    expect(svg).toMatch(new RegExp(`prefers-color-scheme:dark\\)\\{g\\{fill:${TOKENS.themes.dark.ink}`));
    for (const s of MARK_SHAPES) expect(s).not.toMatch(/fill=/);
  });

  it("draw the PNG fallbacks at 16, 32 and 48 px, and the social card at 1200 x 630", () => {
    for (const s of [16, 32, 48]) {
      const png = PNG.sync.read(file(`favicon-${s}.png`));
      expect([png.width, png.height]).toEqual([s, s]);
    }
    const card = PNG.sync.read(file("social.png"));
    expect([card.width, card.height]).toEqual([1200, 630]);
  });

  it("pack the three PNGs into the ICO, smallest first", () => {
    const icon = file("favicon.ico");
    expect(icon.readUInt16LE(2)).toBe(1);
    expect(icon.readUInt16LE(4)).toBe(3);
    const sizes = [0, 1, 2].map((i) => icon.readUInt8(6 + 16 * i));
    expect(sizes).toEqual([16, 32, 48]);
    for (const [i, s] of sizes.entries()) {
      const len = icon.readUInt32LE(6 + 16 * i + 8);
      const at = icon.readUInt32LE(6 + 16 * i + 12);
      expect(icon.subarray(at, at + len).equals(file(`favicon-${s}.png`))).toBe(true);
    }
    expect(ico([]).length).toBe(6);
  });
});
