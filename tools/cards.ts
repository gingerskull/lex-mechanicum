// npx tsx tools/cards.ts [id ...] [--all] [--hook]: each mechanism's social card, the og:image of its page (site/src/seo.ts):
// site/cards/<id>.jpg, 1200 x 630, the stage's opening drawing on the Blueprint sheet above a title block with the
// mechanism's name, family and level and the mark. Drawn in local Chrome (tools/chrome3.ts) like the thumbnails, and
// committed the same way: site/cards/manifest.json holds each card's fingerprint (the thumbnail's package, model,
// renderer and style, and the card's own layout and words); only stale cards are drawn (--all draws every one). The site
// build checks the fingerprints and never draws (checkCards); the pre-push hook runs --hook, which redraws what is stale
// and stops the push while site/cards has changes to commit.
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { MARK_SHAPES, MARK_VIEWBOX } from "../site/src/mark";
import { recordById } from "../src/catalog";
import { allIds } from "../src/mechanisms";
import { TOKENS } from "../src/style/tokens";
import type { Page } from "playwright-core";
import { openChrome3, type Chrome3, type Draw3Options } from "./chrome3";
import { STILL, fingerprints as thumbFingerprints } from "./thumbs";
import { FONT_FILES } from "./tokens-css";

/** px: the card, the title block's height under the drawing, the mark's side in it; JPEG quality 0..1. */
export const CARD = { w: 1200, h: 630, block: 150, mark: 64, pad: 40, name: 64, nameMin: 36, quality: 0.86 };
/** A redraw that differs from the committed card in fewer pixels than this share keeps the committed file. */
const SAME = 0.001;

const root = fileURLToPath(new URL("..", import.meta.url));
export const CARDS_DIR = join(root, "site", "cards");
const MANIFEST = join(CARDS_DIR, "manifest.json");
const require = createRequire(import.meta.url);
const dark = TOKENS.themes.dark;

/** The drawing above the title block: the stage's opening frame on Blueprint, no sheet frame (the card is its sheet). */
const drawView = (): Draw3Options => ({ w: CARD.w, h: CARD.h - CARD.block, dpr: 1, u: STILL.u, theme: "dark", view: "record", over: { sheet: false } });

/** What a card says, from its record. */
function wordsOf(id: string): { name: string; family: string; level: string } {
  const r = recordById(id);
  if (!r) throw new Error(`cards: no record for ${id}`);
  return { name: r.name, family: r.family, level: r.level };
}

/** What a card is drawn from. Any part changed means it is stale. */
export interface CardFingerprint {
  package: string;
  model: string;
  renderer: string;
  style: string;
  card: string;
}
export type CardManifest = Record<string, CardFingerprint>;

const hash = (...parts: string[]) => {
  const h = createHash("sha256");
  for (const p of parts) h.update(p);
  return h.digest("hex").slice(0, 16);
};

/** Each mechanism's card fingerprint now; `packages` reuses package bytes already built (the site build has them). */
export async function cardFingerprints(ids = allIds(), packages?: Map<string, Uint8Array>): Promise<CardManifest> {
  const thumbs = await thumbFingerprints(ids, packages);
  const src = readFileSync(fileURLToPath(import.meta.url), "utf8").replace(/\r\n/g, "\n");
  const layout = hash(src, JSON.stringify([CARD, drawView(), dark, TOKENS.type, TOKENS.tiers, MARK_VIEWBOX, MARK_SHAPES]));
  const out: CardManifest = {};
  for (const id of ids) {
    const t = thumbs[id]!;
    out[id] = { package: t.package, model: t.model, renderer: t.renderer, style: t.style, card: hash(layout, JSON.stringify(wordsOf(id))) };
  }
  return out;
}

export function readCardManifest(): CardManifest {
  return existsSync(MANIFEST) ? (JSON.parse(readFileSync(MANIFEST, "utf8")) as CardManifest) : {};
}

/** A mechanism's card, by file name in site/cards. */
export const cardOf = (id: string) => `${id}.jpg`;

/** Mechanisms whose cards are missing or drawn from something else, with what changed. */
export function staleCards(manifest: CardManifest, now: CardManifest, exists: (f: string) => boolean = existsSync): { id: string; why: string[] }[] {
  const out: { id: string; why: string[] }[] = [];
  for (const [id, fp] of Object.entries(now)) {
    const was = manifest[id];
    const why = was ? (Object.keys(fp) as (keyof CardFingerprint)[]).filter((k) => fp[k] !== was[k]) : ["new"];
    if (!exists(join(CARDS_DIR, cardOf(id)))) why.push("missing");
    if (why.length) out.push({ id, why });
  }
  return out;
}

/** The site build's check: fails, without drawing, when a card is stale. */
export async function checkCards(ids: string[], packages: Map<string, Uint8Array>): Promise<void> {
  const bad = staleCards(readCardManifest(), await cardFingerprints(ids, packages));
  if (bad.length) throw new Error(`social cards out of date: ${bad.map((b) => `${b.id} (${b.why.join(", ")})`).join("; ")}. Run npm run cards and commit site/cards.`);
}

/** The faces the title block uses, inline: the card page has no font server. */
function faces(): string {
  return FONT_FILES.map((f) => {
    const file = join(dirname(require.resolve(`@fontsource/${f.slug}/package.json`)), "files", `${f.slug}-latin-${f.weight}-normal.woff2`);
    return `@font-face{font-family:"${f.family}";font-weight:${f.weight};src:url(data:font/woff2;base64,${readFileSync(file).toString("base64")}) format("woff2")}`;
  }).join("");
}

const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const inkAt = (alpha: number) => `color-mix(in srgb, ${dark.ink} ${alpha * 100}%, transparent)`;

/** The card page: the drawing, and under it the title block: kicker and name on the left, the mark and the set's name on the right. */
function cardHtml(drawing: Buffer, w: { name: string; family: string; level: string }, fonts: string): string {
  const T = TOKENS.type;
  const up = (t: string) => esc(t.toUpperCase());
  return `<!doctype html><meta charset="utf-8"><style>${fonts}
*{box-sizing:border-box;margin:0}
body{width:${CARD.w}px;height:${CARD.h}px;background:${dark.paper};color:${dark.ink};overflow:hidden}
img{display:block;width:${CARD.w}px;height:${CARD.h - CARD.block}px}
.tb{height:${CARD.block}px;border-top:1.5px solid ${inkAt(TOKENS.tiers.muted.dark)};display:grid;grid-template-columns:1fr auto;align-items:center}
.l{padding:0 ${CARD.pad}px;min-width:0;border-right:1px solid ${inkAt(TOKENS.tiers.line2.dark)};height:100%;display:flex;flex-direction:column;justify-content:center;gap:10px}
.k{font:500 15px ${T.mono};letter-spacing:${T.tracking.monoWide}em;color:${inkAt(TOKENS.tiers.muted.dark)}}
.k b{color:${dark.accent};font-weight:500}
.n{font:600 ${CARD.name}px/1 ${T.display};letter-spacing:${T.tracking.display}em;white-space:nowrap}
.r{padding:0 ${CARD.pad}px;display:flex;align-items:center;gap:18px}
.r svg{width:${CARD.mark}px;height:${CARD.mark}px;fill:${dark.ink}}
.s{font:600 22px ${T.mono};letter-spacing:${T.tracking.monoWide}em;line-height:1.3}
.s i{display:block;font:500 13px ${T.mono};font-style:normal;color:${inkAt(TOKENS.tiers.muted.dark)}}
</style><body><img src="data:image/png;base64,${drawing.toString("base64")}" alt=""><div class="tb"><div class="l"><p class="k"><b>&#9632;</b> ${up(w.family)} · ${up(w.level)}</p><p class="n">${up(w.name)}</p></div><div class="r"><svg viewBox="${MARK_VIEWBOX}">${MARK_SHAPES.join("")}</svg><p class="s">LEX<br>MECHANICUM<i>MECHANISM LIBRARY</i></p></div></div></body>`;
}

/** Draws one card: the drawing in the 3D page, the card in `page`, a plain page of the same browser. JPEG bytes. */
async function drawCard(chrome: Chrome3, page: Page, id: string, fonts: string): Promise<Buffer> {
  const drawing = await chrome.shot(id, drawView());
  await page.setContent(cardHtml(drawing, wordsOf(id), fonts));
  // a long name steps down until it fits its cell
  await page.evaluate(async ([max, min]) => {
    await document.fonts.ready;
    const n = document.querySelector<HTMLElement>(".n")!;
    for (let s = max; s > min && n.scrollWidth > n.clientWidth; s -= 2) n.style.fontSize = `${s - 2}px`;
  }, [CARD.name, CARD.nameMin] as const);
  return page.screenshot({ type: "jpeg", quality: Math.round(CARD.quality * 100), clip: { x: 0, y: 0, width: CARD.w, height: CARD.h } });
}

/** Draws the stale cards (every one with `all`) and writes the manifest. Returns the files written. */
export async function cards(ids = allIds(), all = false): Promise<string[]> {
  mkdirSync(CARDS_DIR, { recursive: true });
  const manifest = readCardManifest();
  const now = await cardFingerprints(ids);
  const todo = all ? ids : staleCards(manifest, now).map((s) => s.id);
  const files: string[] = [];
  if (todo.length) {
    const fonts = faces();
    const chrome = await openChrome3();
    try {
      const page = await chrome.page.context().browser()!.newPage({ viewport: { width: CARD.w, height: CARD.h }, deviceScaleFactor: 1 });
      for (const id of todo) {
        const f = join(CARDS_DIR, cardOf(id));
        const img = await drawCard(chrome, page, id, fonts);
        // a change that does not show keeps the committed file
        if (!(existsSync(f) && (await chrome.differ(readFileSync(f), img)) <= SAME * CARD.w * CARD.h)) {
          writeFileSync(f, img);
          files.push(f);
        }
        manifest[id] = now[id]!;
      }
    } finally {
      await chrome.close();
    }
  }
  // known mechanisms only, in catalogue order
  const out: CardManifest = {};
  for (const id of allIds()) if (manifest[id]) out[id] = manifest[id];
  writeFileSync(MANIFEST, JSON.stringify(out, null, 2) + "\n");
  return files;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const ids = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  const files = await cards(ids.length ? ids : undefined, process.argv.includes("--all"));
  for (const f of files) console.log(`wrote ${f}`);
  if (!files.length) console.log("social cards up to date");
  if (process.argv.includes("--hook")) {
    // the push carries commits: redrawn or uncommitted cards stop it until they are committed
    const dirty = execFileSync("git", ["status", "--porcelain", "--", "site/cards"], { cwd: root, encoding: "utf8" }).trim();
    if (dirty) {
      console.error(`\nsocial cards changed; commit them and push again:\n${dirty}`);
      process.exitCode = 1;
    }
  }
}
