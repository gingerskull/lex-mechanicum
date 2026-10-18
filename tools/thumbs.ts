// npx tsx tools/thumbs.ts [id ...] [--all] [--hook]: the library thumbnails (standard R8, style SS1), drawn in local
// Chrome and committed: site/thumbs/<id>-<theme>.webp, 4:3 at DPR 2, phase 1.1, tilt 28, no sheet, the traced path
// only. site/thumbs/manifest.json holds each mechanism's fingerprint: its package bytes, its model, the renderer, the
// style and the thumbnail view. Only thumbnails whose fingerprint changed are drawn (--all draws every one). The site
// build checks the fingerprints and never draws (checkThumbs); the pre-push hook runs --hook, which redraws what is
// stale and stops the push while site/thumbs has changes to commit.
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
import { mechanisms } from "../src/mechanisms";
import { buildPackage } from "../src/package/build";
import { encode } from "../src/package/format";
import { cardView } from "../src/render/draft";
import type { ThemeKey } from "../src/style/tokens";
import { openChrome } from "./chrome";

export const THUMB = { w: 320, h: 240, dpr: 2, u: 1.1, tilt: 28 };
const THEMES: ThemeKey[] = ["dark", "light"];
const QUALITY = 0.92;

const root = fileURLToPath(new URL("..", import.meta.url));
export const THUMBS_DIR = join(root, "site", "thumbs");
const MANIFEST = join(THUMBS_DIR, "manifest.json");

/** What a thumbnail is drawn from. Any part changed means it is stale. */
export interface Fingerprint {
  package: string;
  model: string;
  renderer: string;
  style: string;
  view: string;
}
export type Manifest = Record<string, Fingerprint>;

const hash = (...parts: (string | Uint8Array)[]) => {
  const h = createHash("sha256");
  for (const p of parts) h.update(p);
  return h.digest("hex").slice(0, 16);
};

/** The thumbnail's drawing options, the same for every mechanism. */
const thumbView = (theme: ThemeKey) => ({ w: THUMB.w, h: THUMB.h, dpr: THUMB.dpr, u: THUMB.u, card: true as const, view: { tilt: THUMB.tilt, theme, sheet: null, dims: false, overlays: { paths: true } } });

/**
 * The parts of the fingerprints that come from source: the files the drawing page bundles, split into each mechanism's
 * model (src/mechanisms/<id>/), the style (src/style/) and the renderer (everything else the page loads).
 */
async function sources(): Promise<{ renderer: string; style: string; model: Record<string, string> }> {
  const r = await build({ entryPoints: [join(root, "tools/draw-page/main.ts")], bundle: true, format: "esm", platform: "browser", write: false, metafile: true, absWorkingDir: root, logLevel: "silent" });
  const files = Object.keys(r.metafile.inputs).sort();
  const text = (f: string) => readFileSync(join(root, f), "utf8").replace(/\r\n/g, "\n");
  const groups = new Map<string, string[]>();
  for (const f of files) {
    const p = f.replace(/\\/g, "/");
    const m = /^src\/mechanisms\/([a-z0-9-]+)\//.exec(p);
    const g = m ? `model:${m[1]}` : p.startsWith("src/style/") ? "style" : "renderer";
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g)!.push(`${p}\n${text(f)}`);
  }
  const of = (g: string) => hash(...(groups.get(g) ?? []));
  const model: Record<string, string> = {};
  for (const g of groups.keys()) if (g.startsWith("model:")) model[g.slice(6)] = of(g);
  return { renderer: of("renderer"), style: of("style"), model };
}

/** Each mechanism's fingerprint now. `packages` reuses package bytes already built (the site build has them). */
export async function fingerprints(ids = Object.keys(mechanisms), packages?: Map<string, Uint8Array>): Promise<Manifest> {
  const src = await sources();
  const view = hash(JSON.stringify([THUMB, cardView(), thumbView("dark")]));
  const out: Manifest = {};
  for (const id of ids) {
    const bytes = packages?.get(id) ?? (await encode((await buildPackage(id)).pkg));
    out[id] = { package: hash(bytes), model: src.model[id] ?? "", renderer: src.renderer, style: src.style, view };
  }
  return out;
}

export function readManifest(): Manifest {
  return existsSync(MANIFEST) ? (JSON.parse(readFileSync(MANIFEST, "utf8")) as Manifest) : {};
}

const file = (id: string, theme: ThemeKey) => join(THUMBS_DIR, `${id}-${theme}.webp`);

/** Mechanisms whose thumbnails are missing or drawn from something else, with what changed. */
export function stale(manifest: Manifest, now: Manifest, exists: (f: string) => boolean = existsSync): { id: string; why: string[] }[] {
  const out: { id: string; why: string[] }[] = [];
  for (const [id, fp] of Object.entries(now)) {
    const was = manifest[id];
    const why = was ? (Object.keys(fp) as (keyof Fingerprint)[]).filter((k) => fp[k] !== was[k]) : ["new"];
    if (THEMES.some((t) => !exists(file(id, t)))) why.push("missing");
    if (why.length) out.push({ id, why });
  }
  return out;
}

/** The site build's check: fails, without drawing, when a thumbnail is stale. */
export async function checkThumbs(ids: string[], packages: Map<string, Uint8Array>): Promise<void> {
  const bad = stale(readManifest(), await fingerprints(ids, packages));
  if (bad.length)
    throw new Error(`thumbnails out of date: ${bad.map((b) => `${b.id} (${b.why.join(", ")})`).join("; ")}. Run npm run thumbs and commit site/thumbs.`);
}

/** Draws the stale thumbnails (every one with `all`) and writes the manifest. Returns the files written. */
export async function thumbs(ids = Object.keys(mechanisms), all = false): Promise<string[]> {
  mkdirSync(THUMBS_DIR, { recursive: true });
  const manifest = readManifest();
  const now = await fingerprints(ids);
  const todo = all ? ids : stale(manifest, now).map((s) => s.id);
  const files: string[] = [];
  if (todo.length) {
    const chrome = await openChrome();
    try {
      for (const id of todo) {
        for (const theme of THEMES) {
          writeFileSync(file(id, theme), await chrome.shot(id, thumbView(theme), { type: "image/webp", quality: QUALITY }));
          files.push(file(id, theme));
        }
        manifest[id] = now[id]!;
      }
    } finally {
      await chrome.close();
    }
  }
  // registered mechanisms only, in registry order
  const out: Manifest = {};
  for (const id of Object.keys(mechanisms)) if (manifest[id]) out[id] = manifest[id];
  writeFileSync(MANIFEST, JSON.stringify(out, null, 2) + "\n");
  return files;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const ids = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  const files = await thumbs(ids.length ? ids : undefined, process.argv.includes("--all"));
  for (const f of files) console.log(`wrote ${f}`);
  if (!files.length) console.log("thumbnails up to date");
  if (process.argv.includes("--hook")) {
    // the push carries commits: redrawn or uncommitted thumbnails stop it until they are committed
    const dirty = execFileSync("git", ["status", "--porcelain", "--", "site/thumbs"], { cwd: root, encoding: "utf8" }).trim();
    if (dirty) {
      console.error(`\nthumbnails changed; commit them and push again:\n${dirty}`);
      process.exitCode = 1;
    }
  }
}
