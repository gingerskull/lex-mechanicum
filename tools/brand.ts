// npx tsx tools/brand.ts [--check]: the icons and the social card, drawn from the mark (site/src/mark.ts) and the tokens,
// written into site/brand (committed); prebuild copies them into site/public. The SVG favicon is text; the PNGs, the
// ICO and the social card are rasterised in local Chrome (playwright-core, channel "chrome", or the browser at
// CHROME_PATH). brand.json holds the fingerprint of what they are drawn from: prebuild fails while it is stale, and
// --check does the same without drawing.
//   favicon.svg          the mark in the sheet's ink: Drafting ink in a light browser, Blueprint ink in a dark one
//   favicon-{16,32,48}.png, favicon.ico (16, 32, 48)   fallbacks for browsers without SVG icons: Drafting ink, clear
//   apple-touch-icon.png 180 px, the mark in Blueprint ink on Blueprint paper
//   social.png           1200 x 630, the mark on the Blueprint sheet with its grid
import { createHash } from "node:crypto";
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";
import { MARK_SHAPES, MARK_VIEWBOX } from "../site/src/mark";
import { TOKENS } from "../src/style/tokens";

const root = fileURLToPath(new URL("..", import.meta.url));
export const BRAND_DIR = join(root, "site", "brand");
const FINGERPRINT = join(BRAND_DIR, "brand.json");

const dark = TOKENS.themes.dark;
const light = TOKENS.themes.light;

/** Fallback icon sizes, px; the ICO holds the same three. */
const ICON_SIZES = [16, 32, 48] as const;
const TOUCH = 180; // px, apple-touch-icon
const TOUCH_MARK = 0.72; // 0..1, the mark's share of the touch icon's side
const CARD = { w: 1200, h: 630, mark: 300 }; // px, social card and the mark's side on it

/** Every file this writes into site/brand, brand.json aside. */
export const BRAND_FILES = ["favicon.svg", ...ICON_SIZES.map((s) => `favicon-${s}.png`), "favicon.ico", "apple-touch-icon.png", "social.png"];

const shapes = MARK_SHAPES.join("");

/** The mark as an SVG document, every shape filled with `fill`, `size` px square when given. */
const markSvg = (fill: string, size?: number) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${MARK_VIEWBOX}"${size ? ` width="${size}" height="${size}"` : ""} fill="${fill}">${shapes}</svg>`;

/** The favicon: one colour, the ink of the sheet that matches the browser's own light or dark scheme. */
export const faviconSvg = () =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${MARK_VIEWBOX}"><style>g{fill:${light.ink}}@media (prefers-color-scheme:dark){g{fill:${dark.ink}}}</style><g>${shapes}</g></svg>\n`;

/** What the images are drawn from: the mark, the colours they use (the public sheets' only), the sizes and this file. */
export function fingerprint(): string {
  const grid = Object.fromEntries(Object.entries(TOKENS.gridTiers).map(([k, v]) => [k, { dark: v.dark, light: v.light }]));
  const src = readFileSync(fileURLToPath(import.meta.url), "utf8").replace(/\r\n/g, "\n");
  return createHash("sha256").update(JSON.stringify([MARK_VIEWBOX, MARK_SHAPES, dark, light, grid, TOKENS.size.grid, TOKENS.size.gridMajor, src])).digest("hex").slice(0, 16);
}

/** null when the committed images are drawn from the current mark and tokens, else what to run. */
export function brandStale(): string | null {
  let stored: string | undefined;
  try {
    stored = (JSON.parse(readFileSync(FINGERPRINT, "utf8")) as { fingerprint?: string }).fingerprint;
  } catch {
    // none yet
  }
  return stored === fingerprint() ? null : "the icons and social card in site/brand are stale: run npx tsx tools/brand.ts and commit site/brand";
}

/** The social card page: the Blueprint sheet, its grid at the page's pitch and alphas, the mark in the middle. */
function cardHtml(): string {
  const g = TOKENS.size.grid;
  const major = g * TOKENS.size.gridMajor;
  const line = (alpha: number, pitch: number) =>
    `linear-gradient(color-mix(in srgb, ${dark.grid} ${alpha * 100}%, transparent) 1px, transparent 1px) 0 0 / ${pitch}px ${pitch}px,` +
    `linear-gradient(90deg, color-mix(in srgb, ${dark.grid} ${alpha * 100}%, transparent) 1px, transparent 1px) 0 0 / ${pitch}px ${pitch}px`;
  const bg = `${line(TOKENS.gridTiers.grid2.dark, major)},${line(TOKENS.gridTiers.grid1.dark, g)},${dark.paper}`;
  // the grid is centred on the mark, as the drawing's grid is centred on the drawing (SF12)
  const pos = `${(CARD.w / 2) % major}px ${(CARD.h / 2) % major}px`;
  return `<body style="margin:0;width:${CARD.w}px;height:${CARD.h}px;display:grid;place-items:center;background:${bg};background-position:${pos}">${markSvg(dark.ink, CARD.mark)}</body>`;
}

/** The touch icon page: the mark centred on Blueprint paper. */
const touchHtml = () =>
  `<body style="margin:0;width:${TOUCH}px;height:${TOUCH}px;display:grid;place-items:center;background:${dark.paper}">${markSvg(dark.ink, Math.round(TOUCH * TOUCH_MARK))}</body>`;

/** An ICO of PNG images (Vista and later read PNG entries), smallest first. */
export function ico(pngs: { size: number; png: Buffer }[]): Buffer {
  const head = Buffer.alloc(6 + 16 * pngs.length);
  head.writeUInt16LE(0, 0);
  head.writeUInt16LE(1, 2); // icon
  head.writeUInt16LE(pngs.length, 4);
  let offset = head.length;
  pngs.forEach(({ size, png }, i) => {
    const e = 6 + 16 * i;
    head.writeUInt8(size >= 256 ? 0 : size, e);
    head.writeUInt8(size >= 256 ? 0 : size, e + 1);
    head.writeUInt16LE(1, e + 4); // colour planes
    head.writeUInt16LE(32, e + 6); // bits per pixel
    head.writeUInt32LE(png.length, e + 8);
    head.writeUInt32LE(offset, e + 12);
    offset += png.length;
  });
  return Buffer.concat([head, ...pngs.map((p) => p.png)]);
}

export async function drawBrand(): Promise<void> {
  mkdirSync(BRAND_DIR, { recursive: true });
  writeFileSync(join(BRAND_DIR, "favicon.svg"), faviconSvg());
  const exe = process.env.CHROME_PATH;
  const browser = await chromium.launch(exe ? { executablePath: exe, headless: true } : { channel: "chrome", headless: true });
  try {
    const shot = async (html: string, w: number, h: number, clear: boolean): Promise<Buffer> => {
      const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
      await page.setContent(`<!doctype html><meta charset="utf-8">${html}`);
      const png = await page.screenshot({ omitBackground: clear, clip: { x: 0, y: 0, width: w, height: h } });
      await page.close();
      return png;
    };
    const icons: { size: number; png: Buffer }[] = [];
    for (const s of ICON_SIZES) {
      const png = await shot(`<body style="margin:0">${markSvg(light.ink, s)}</body>`, s, s, true);
      writeFileSync(join(BRAND_DIR, `favicon-${s}.png`), png);
      icons.push({ size: s, png });
    }
    writeFileSync(join(BRAND_DIR, "favicon.ico"), ico(icons));
    writeFileSync(join(BRAND_DIR, "apple-touch-icon.png"), await shot(touchHtml(), TOUCH, TOUCH, false));
    writeFileSync(join(BRAND_DIR, "social.png"), await shot(cardHtml(), CARD.w, CARD.h, false));
  } finally {
    await browser.close();
  }
  writeFileSync(FINGERPRINT, JSON.stringify({ fingerprint: fingerprint() }, null, 2) + "\n");
}

/** Part of prebuild: copies the committed images into site/public; fails while they are stale. */
export function copyBrand(pub: string): void {
  const stale = brandStale();
  if (stale) throw new Error(stale);
  mkdirSync(pub, { recursive: true });
  for (const f of BRAND_FILES) copyFileSync(join(BRAND_DIR, f), join(pub, f));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  try {
    if (process.argv.includes("--check")) {
      const stale = brandStale();
      if (stale) throw new Error(stale);
      console.log("site/brand is up to date");
    } else {
      await drawBrand();
      console.log(`wrote ${BRAND_FILES.join(", ")} to ${BRAND_DIR}`);
    }
  } catch (e) {
    console.error(`brand: ${e instanceof Error ? e.message : String(e)}`);
    process.exitCode = 1;
  }
}
