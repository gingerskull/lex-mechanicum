// npx tsx tools/thumbs.ts [id ...] [--all] [--hook]: the library thumbnails (standard R8, style SS1), drawn by the 3D
// renderer in local Chrome (tools/chrome3.ts) from the v2 package and committed (a redraw that looks the same keeps the
// committed file): site/thumbs/<id>-<theme>.webp, 4:3 at DPR 2, phase 1.1, in the view the record declares (T7), no
// sheet; and <id>-<theme>-still.webp, the stage's opening view as one large still, shown where a browser has no WebGL2
// (no title block, which comes from the catalogue). site/thumbs/manifest.json holds each mechanism's fingerprint: its
// package bytes, its model (the record's kin and teaching blocks and its polish), the renderer, the style and the
// thumbnail view. Only thumbnails whose fingerprint changed are drawn (--all draws every one). The site build checks the
// fingerprints and never draws (checkThumbs); the pre-push hook runs --hook, which redraws what is stale and stops the
// push while site/thumbs has changes to commit.
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
import { recordById } from "../src/catalog";
import { allIds } from "../src/mechanisms";
import type { ThemeKey } from "../src/style/tokens";
import { openChrome3, type Draw3Options } from "./chrome3";
import { runPool } from "./pool";

export const THUMB = { w: 320, h: 240, dpr: 2, u: 1.1 };
/** The still: the stage's opening frame (63° of the cycle, dimensions on) at dial A, since paper grain is noise that
 * would make each image several times larger. */
export const STILL = { w: 1200, h: 750, dpr: 1, u: (63 / 360) * Math.PI * 2, detail: "A" as const, quality: 0.75 };
const THEMES: ThemeKey[] = ["dark", "light"];
const QUALITY = 0.92;
/** A redraw that differs from the committed image in fewer pixels than this share keeps the committed file. */
const SAME = 0.001;

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

/** The thumbnail's and the still's drawing: the record's own view (T7), no sheet on either. */
const thumbView = (theme: ThemeKey): Draw3Options => ({ w: THUMB.w, h: THUMB.h, dpr: THUMB.dpr, u: THUMB.u, card: true, theme, view: "record" });
const stillView = (theme: ThemeKey): Draw3Options => ({ w: STILL.w, h: STILL.h, dpr: STILL.dpr, u: STILL.u, theme, detail: STILL.detail, view: "record", over: { sheet: false } });

/**
 * The parts of the fingerprints that come from source: the files the drawing page bundles, split into the style
 * (src/style/) and the renderer (everything else the page loads).
 */
async function sources(): Promise<{ renderer: string; style: string }> {
  const r = await build({ entryPoints: [join(root, "tools/draw3-page/main.ts")], bundle: true, format: "esm", platform: "browser", write: false, metafile: true, absWorkingDir: root, logLevel: "silent" });
  const files = Object.keys(r.metafile.inputs).sort();
  const text = (f: string) => readFileSync(join(root, f), "utf8").replace(/\r\n/g, "\n");
  const groups = new Map<string, string[]>();
  for (const f of files) {
    const p = f.replace(/\\/g, "/");
    const g = p.startsWith("src/style/") ? "style" : "renderer";
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g)!.push(`${p}\n${text(f)}`);
  }
  const of = (g: string) => hash(...(groups.get(g) ?? []));
  return { renderer: of("renderer"), style: of("style") };
}

/**
 * Each mechanism's fingerprint now. `packages` reuses package bytes already built (the site build has them); the others
 * come from the build cache or are built in a pool of processes (src/package/built.ts, tools/pool.ts).
 */
export async function fingerprints(ids = allIds(), packages?: Map<string, Uint8Array>): Promise<Manifest> {
  const src = await sources();
  const view = hash(JSON.stringify([THUMB, thumbView("dark"), STILL, stillView("dark"), QUALITY]));
  const todo = ids.filter((id) => !packages?.has(id));
  const made = await runPool<string, Uint8Array>(join(root, "src", "package", "built.ts"), "builtBytes", todo);
  const out: Manifest = {};
  for (const id of ids) {
    const bytes = packages?.get(id) ?? made[todo.indexOf(id)]!;
    const rec = recordById(id) as unknown as { kin?: unknown; teaching?: unknown } | undefined;
    const polish = join(root, "src", "mechanisms", id, "polish3.ts");
    const model = hash(JSON.stringify([rec?.kin ?? null, rec?.teaching ?? null]), existsSync(polish) ? readFileSync(polish, "utf8").replace(/\r\n/g, "\n") : "");
    out[id] = { package: hash(bytes), model, renderer: src.renderer, style: src.style, view };
  }
  return out;
}

export function readManifest(): Manifest {
  return existsSync(MANIFEST) ? (JSON.parse(readFileSync(MANIFEST, "utf8")) as Manifest) : {};
}

const file = (id: string, theme: ThemeKey, still = false) => join(THUMBS_DIR, `${id}-${theme}${still ? "-still" : ""}.webp`);
/** The images of one mechanism, by file name in site/thumbs. */
export const imagesOf = (id: string): string[] => THEMES.flatMap((t) => [`${id}-${t}.webp`, `${id}-${t}-still.webp`]);

/** Mechanisms whose thumbnails are missing or drawn from something else, with what changed. */
export function stale(manifest: Manifest, now: Manifest, exists: (f: string) => boolean = existsSync): { id: string; why: string[] }[] {
  const out: { id: string; why: string[] }[] = [];
  for (const [id, fp] of Object.entries(now)) {
    const was = manifest[id];
    const why = was ? (Object.keys(fp) as (keyof Fingerprint)[]).filter((k) => fp[k] !== was[k]) : ["new"];
    if (imagesOf(id).some((f) => !exists(join(THUMBS_DIR, f)))) why.push("missing");
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
export async function thumbs(ids = allIds(), all = false): Promise<string[]> {
  mkdirSync(THUMBS_DIR, { recursive: true });
  const manifest = readManifest();
  const now = await fingerprints(ids);
  const todo = all ? ids : stale(manifest, now).map((s) => s.id);
  const files: string[] = [];
  if (todo.length) {
    const chrome = await openChrome3();
    try {
      for (const id of todo) {
        for (const theme of THEMES)
          for (const [f, q, still] of [[file(id, theme), QUALITY, false], [file(id, theme, true), STILL.quality, true]] as const) {
            const o = still ? stillView(theme) : thumbView(theme);
            const img = await chrome.shot(id, o, { type: "image/webp", quality: q });
            // a change that does not show (a renderer refactor, antialiasing noise) keeps the committed file
            if (existsSync(f) && (await chrome.differ(readFileSync(f), img)) <= SAME * o.w * o.h * o.dpr * o.dpr) continue;
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
  const out: Manifest = {};
  for (const id of allIds()) if (manifest[id]) out[id] = manifest[id];
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
