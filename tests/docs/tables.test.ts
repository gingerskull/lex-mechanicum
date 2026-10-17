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
