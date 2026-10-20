// npx tsx tools/thumbs.ts [id ...] [--all] [--hook]: the library thumbnails (standard R8, style SS1), drawn in local
// Chrome and committed (a redraw that looks the same keeps the committed file): site/thumbs/<id>-<theme>.webp, 4:3 at DPR 2, phase 1.1, tilt 28, no sheet, the traced path
// only; and <id>-<theme>-still.webp, the stage's opening view as one large still, shown where a browser has no WebGL2
// (no title block, which comes from the catalogue). site/thumbs/manifest.json holds each mechanism's fingerprint: its package bytes, its model, the renderer, the
// style and the thumbnail view. Only thumbnails whose fingerprint changed are drawn (--all draws every one). The site
// build checks the fingerprints and never draws (checkThumbs); the pre-push hook runs --hook, which redraws what is
// stale and stops the push while site/thumbs has changes to commit.
//
// Two engines side by side (S6): a 2.5D mechanism is drawn by the 2.5D renderer from its v1 package at tilt 28; a mechanism
// rebuilt on engine v3 (src/checks/engine.ts) is drawn by the 3D renderer from its v2 package in the view its record
// declares (T7), and its fingerprint says so (`engine: "v3"`, the package is the v2 bytes, the model part is the record's kin
// and teaching blocks and its polish, the renderer part is the 3D renderer's sources).
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
import { recordById } from "../src/catalog";
import { allIds, engineOf } from "../src/checks";
import { buildAnyPackage } from "../src/package/any";
import { buildPackage } from "../src/package/build";
import { encode } from "../src/package/format";
import { encode2 } from "../src/package/format2";
import { cardView } from "../src/render/draft";
import type { ThemeKey } from "../src/style/tokens";
import { openChrome } from "./chrome";
import { openChrome3, type Draw3Options } from "./chrome3";

export const THUMB = { w: 320, h: 240, dpr: 2, u: 1.1, tilt: 28 };
/** The still: the stage's opening frame (63° of the cycle, tilt 28, dimensions on) at dial A, since paper grain is noise
 * that would make each image several times larger. */
export const STILL = { w: 1200, h: 750, dpr: 1, u: (63 / 360) * Math.PI * 2, tilt: 28, detail: "A" as const, quality: 0.75 };
const THEMES: ThemeKey[] = ["dark", "light"];
const QUALITY = 0.92;
/** A redraw that differs from the committed image in fewer pixels than this share keeps the committed file. */
const SAME = 0.001;

const root = fileURLToPath(new URL("..", import.meta.url));
export const THUMBS_DIR = join(root, "site", "thumbs");
const MANIFEST = join(THUMBS_DIR, "manifest.json");

/** What a thumbnail is drawn from. Any part changed means it is stale. */
export interface Fingerprint {
  /** Absent for a 2.5D mechanism (so its committed entry is unchanged); "v3" for one drawn by the 3D renderer. */
  engine?: "v3";
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

/** The thumbnail's and the still's drawing options, the same for every mechanism. */
const thumbView = (theme: ThemeKey) => ({ w: THUMB.w, h: THUMB.h, dpr: THUMB.dpr, u: THUMB.u, card: true as const, view: { tilt: THUMB.tilt, theme, sheet: null, dims: false, overlays: { paths: true } } });
const stillView = (theme: ThemeKey) => ({ w: STILL.w, h: STILL.h, dpr: STILL.dpr, u: STILL.u, view: { tilt: STILL.tilt, theme, sheet: null, dims: true, detail: STILL.detail, overlays: { paths: true } } });

/** The 3D renderer's drawing of the thumbnail and the still: the record's own view (T7), no sheet on the thumbnail. */
const thumbView3 = (theme: ThemeKey): Draw3Options => ({ w: THUMB.w, h: THUMB.h, dpr: THUMB.dpr, u: THUMB.u, card: true, theme, view: "record" });
const stillView3 = (theme: ThemeKey): Draw3Options => ({ w: STILL.w, h: STILL.h, dpr: STILL.dpr, u: STILL.u, theme, detail: STILL.detail, view: "record", over: { sheet: false } });

/**
 * The parts of the fingerprints that come from source: the files the drawing page bundles, split into each mechanism's
 * model (src/mechanisms/<id>/), the style (src/style/) and the renderer (everything else the page loads).
 */
async function sources(entry = "tools/draw-page/main.ts"): Promise<{ renderer: string; style: string; model: Record<string, string> }> {
  const r = await build({ entryPoints: [join(root, entry)], bundle: true, format: "esm", platform: "browser", write: false, metafile: true, absWorkingDir: root, logLevel: "silent" });
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
export async function fingerprints(ids = allIds(), packages?: Map<string, Uint8Array>): Promise<Manifest> {
  const v3 = ids.filter((id) => engineOf(id) === "v3");
  const src = await sources();
  const src3 = v3.length ? await sources("tools/draw3-page/main.ts") : null;
  const view = hash(JSON.stringify([THUMB, cardView(), thumbView("dark"), STILL, stillView("dark"), QUALITY]));
  const view3 = hash(JSON.stringify([THUMB, thumbView3("dark"), STILL, stillView3("dark"), QUALITY, "v3"]));
  const out: Manifest = {};
  for (const id of ids) {
    if (engineOf(id) === "v3") {
      const bytes = packages?.get(id) ?? (await encode2((await buildAnyPackage(id)).pkg));
      const rec = recordById(id) as unknown as { kin?: unknown; teaching?: unknown } | undefined;
      const polish = join(root, "src", "mechanisms", id, "polish.ts");
      const model = hash(JSON.stringify([rec?.kin ?? null, rec?.teaching ?? null]), existsSync(polish) ? readFileSync(polish, "utf8").replace(/\r\n/g, "\n") : "");
      out[id] = { engine: "v3", package: hash(bytes), model, renderer: src3!.renderer, style: src3!.style, view: view3 };
      continue;
    }
    const bytes = packages?.get(id) ?? (await encode((await buildPackage(id)).pkg));
    out[id] = { package: hash(bytes), model: src.model[id] ?? "", renderer: src.renderer, style: src.style, view };
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
    const old = todo.filter((id) => engineOf(id) !== "v3");
    const new3 = todo.filter((id) => engineOf(id) === "v3");
    const chrome = old.length ? await openChrome() : null;
    const chrome3 = new3.length ? await openChrome3() : null;
    try {
      for (const id of todo) {
        const three = engineOf(id) === "v3";
        for (const theme of THEMES)
          for (const [f, q, still] of [[file(id, theme), QUALITY, false], [file(id, theme, true), STILL.quality, true]] as const) {
            const o = still ? stillView(theme) : thumbView(theme);
            const img = three
              ? await chrome3!.shot(id, still ? stillView3(theme) : thumbView3(theme), { type: "image/webp", quality: q })
              : await chrome!.shot(id, o, { type: "image/webp", quality: q });
            // a change that does not show (a renderer refactor, antialiasing noise) keeps the committed file
            if (existsSync(f) && (await (three ? chrome3! : chrome!).differ(readFileSync(f), img)) <= SAME * o.w * o.h * o.dpr * o.dpr) continue;
            writeFileSync(f, img);
            files.push(f);
          }
        manifest[id] = now[id]!;
      }
    } finally {
      await chrome?.close();
      await chrome3?.close();
    }
  }
  // known mechanisms only, in registry order
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
