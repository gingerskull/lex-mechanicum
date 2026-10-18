// Visual snapshots (style SQ9), local only: `npm run test:visual`. Each registered mechanism at plan, 28°, side and full
// explode at 70°, both sheets, overlays on, rendered by the site's renderer in Node and compared with our own
// baselines in tests/visual/__baselines__. Baselines are written once, when the look is final:
// `UPDATE_SNAPSHOTS=1 npm run test:visual`. Never regenerate them to make a run pass.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { mechanisms } from "../../src/mechanisms";
import type { ThemeKey } from "../../src/style/tokens";
import { openChrome, type Chrome } from "../../tools/chrome";
import { stageShot } from "../../tools/shot";

const DIR = join(import.meta.dirname, "__baselines__");
const OUT = join("dist", "visual");
const VIEWS = [
  ["plan", { tilt: 0, explode: 0 }],
  ["28", { tilt: 28, explode: 0 }],
  ["side", { tilt: 88, explode: 0 }],
  ["explode70", { tilt: 70, explode: 1 }],
] as const;
/** Pixels allowed to differ: anti-aliasing noise between runs and machines. */
const TOLERANCE = 0.002;

describe("visual snapshots", () => {
  let chrome: Chrome;
  beforeAll(async () => {
    chrome = await openChrome();
  }, 120_000);
  afterAll(() => chrome?.close());
  for (const id of Object.keys(mechanisms))
    for (const theme of ["dark", "light"] as ThemeKey[])
      for (const [name, v] of VIEWS)
        it(`${id} ${theme} ${name}`, { timeout: 60_000 }, async () => {
          // dial A drops only the paper grain and the faint bearing and motor internals: the grain is noise, which would
          // make every baseline large and every diff noisy
          const png = await chrome.shot(id, stageShot(id, { w: 720, h: 450, dpr: 1, view: { ...v, theme, detail: "A", overlays: { paths: true, forces: true, angles: true } } }));
          const file = `${id}-${theme}-${name}.png`;
          const base = join(DIR, file);
          if (process.env.UPDATE_SNAPSHOTS || !existsSync(base)) {
            mkdirSync(DIR, { recursive: true });
            writeFileSync(base, png);
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
