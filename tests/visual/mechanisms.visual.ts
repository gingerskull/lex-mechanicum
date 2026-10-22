// Visual snapshots (style SQ9), local only: `npm run test:visual`. Each registered mechanism at plan, 28° (elevation
// 62), side and the full explode in isometric, both sheets, the sheet and every teaching layer on, drawn by the site's
// renderer in local Chrome (tools/chrome3.ts) and compared with our own baselines in tests/visual/__baselines__. Baselines
// are written once, when the look is final: `UPDATE_SNAPSHOTS=1 npm run test:visual`. Never regenerate them to make a
// run pass.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { allIds } from "../../src/mechanisms";
import type { ThemeKey } from "../../src/style/tokens";
import { openChrome3, type Chrome3, type Draw3Options } from "../../tools/chrome3";

const DIR = join(import.meta.dirname, "__baselines__");
const OUT = join("dist", "visual");
const VIEWS: [string, Partial<Draw3Options>][] = [
  ["plan", { view: "PLAN" }],
  ["28", { view: "VIEW 0 62" }],
  ["side", { view: "SIDE" }],
  ["explode", { view: "ISOMETRIC", explode: 1 }],
];
/** Pixels allowed to differ: anti-aliasing noise between runs and machines. */
const TOLERANCE = 0.002;

describe("visual snapshots", () => {
  let chrome: Chrome3;
  beforeAll(async () => {
    chrome = await openChrome3();
  }, 120_000);
  afterAll(() => chrome?.close());
  for (const id of allIds())
    for (const theme of ["dark", "light"] as ThemeKey[])
      for (const [name, v] of VIEWS)
        it(`${id} ${theme} ${name}`, { timeout: 120_000 }, async () => {
          // dial A drops only the paper grain and the faint bearing and motor internals: the grain is noise, which would
          // make every baseline large and every diff noisy
          const png = await chrome.shot(id, { w: 720, h: 450, dpr: 1, u: 1.1, theme, detail: "A", ...v });
          const file = `${id}-${theme}-${name}.png`;
          const base = join(DIR, file);
          if (process.env.UPDATE_SNAPSHOTS || !existsSync(base)) {
            mkdirSync(DIR, { recursive: true });
            // RGB at full compression: Chrome's PNGs are larger than they need to be
            writeFileSync(base, PNG.sync.write(PNG.sync.read(png), { deflateLevel: 9, colorType: 2, inputHasAlpha: true } as Parameters<typeof PNG.sync.write>[1]));
            return;
          }
          const a = PNG.sync.read(readFileSync(base));
          const b = PNG.sync.read(png);
          expect([b.width, b.height]).toEqual([a.width, a.height]);
          const diff = new PNG({ width: a.width, height: a.height });
          const n = pixelmatch(a.data, b.data, diff.data, a.width, a.height, { threshold: 0.1 });
          if (n > TOLERANCE * a.width * a.height) {
            mkdirSync(OUT, { recursive: true });
            writeFileSync(join(OUT, `diff-${file}`), PNG.sync.write(diff));
            writeFileSync(join(OUT, `new-${file}`), png);
          }
          expect(n).toBeLessThanOrEqual(TOLERANCE * a.width * a.height);
        });
});
