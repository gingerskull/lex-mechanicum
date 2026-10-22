// The generated doc tables match the code: the standard's AUTO table and the style reference's Part VI.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { STANDARD, standardDoc } from "../../tools/standard-table";
import { STYLE_REF, styleDoc } from "../../tools/style-table";

describe("generated doc tables", () => {
  it("the standard's AUTO table is current (npx tsx tools/standard-table.ts)", () => {
    expect(standardDoc()).toBe(readFileSync(STANDARD, "utf8"));
  });

  it("the style reference's Part VI is current (npx tsx tools/style-table.ts)", () => {
    expect(styleDoc()).toBe(readFileSync(STYLE_REF, "utf8"));
  });
});

describe("audit template", () => {
  const std = readFileSync(STANDARD, "utf8");
  const tpl = std.slice(std.indexOf("## 11. Audit sheet template"));
  const block = tpl.slice(tpl.indexOf("```markdown"), tpl.indexOf("```\n", tpl.indexOf("```markdown") + 3));
  const heads = (t: string) => [...t.matchAll(/^## (.+)$/gm)].map((m) => m[1]);

  it("has the sections the generator writes, in the same order", () => {
    const sheet = readFileSync(new URL(`../../src/mechanisms/four-bar/audit.md`, import.meta.url), "utf8");
    expect(heads(block)).toEqual(heads(sheet));
  });

  it("has the `teaching:` line under the header and the kit, block, support and stack columns (S2, A20, A21)", () => {
    const lines = block.split("\n");
    expect(lines.findIndex((l) => l.startsWith("teaching:"))).toBe(lines.findIndex((l) => l.startsWith("standard:")) + 1);
    expect(block).toMatch(/\| Joint \| Kit \| Block \| Support \| Stack \| F1 locate/);
  });
});
