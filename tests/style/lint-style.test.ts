import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, describe, expect, it } from "vitest";
import { lintStyle } from "../../tools/lint-style";

const root = mkdtempSync(join(tmpdir(), "lint-style-"));
afterAll(() => rmSync(root, { recursive: true, force: true }));
const put = (file: string, text: string) => {
  mkdirSync(dirname(join(root, file)), { recursive: true });
  writeFileSync(join(root, file), text);
};

describe("lint-style", () => {
  it("fails on a hex in a renderer file, with the file and line", () => {
    put("src/render/draw.ts", "const a = 1;\nctx.strokeStyle = \"#F29A6B\";\n");
    put("src/style/tokens.ts", 'export const accent = "#F29A6B"; // allowed here\n');
    put("site/styles/tokens.css", ":root { --accent: #F29A6B; }\n");
    expect(lintStyle(root)).toEqual([
      { file: "src/render/draw.ts", line: 2, message: 'hex colour "#F29A6B" outside src/style' },
    ]);
  });

  it("fails on rgb(), font families and style keys in records", () => {
    put("site/styles/base.css", "body { color: rgba(0, 0, 0, .5); font-family: 'IBM Plex Sans'; }\n");
    put("src/mechanisms/four-bar/polish.ts", "export const x = { lineWidth: 2 };\n");
    const found = lintStyle(root).map((f) => `${f.file}:${f.line}: ${f.message}`);
    expect(found).toContain('site/styles/base.css:1: rgb() colour "rgba(" outside src/style');
    expect(found).toContain('site/styles/base.css:1: font family "IBM Plex" outside src/style');
    expect(found).toContain('src/mechanisms/four-bar/polish.ts:1: style key "lineWidth" in a mechanism record');
  });

  it("passes on the real tree", () => {
    expect(lintStyle(fileURLToPath(new URL("../..", import.meta.url)))).toEqual([]);
  });
});
