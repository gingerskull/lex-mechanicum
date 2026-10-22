// Part of prebuild: everything the static site serves that is generated, written into site/public (git-ignored).
// - fonts/: the IBM Plex faces of tokens.css, latin subset, from the @fontsource packages (SF7, self-hosted);
// - packages/<id>.mx2 and meta/<id>.json: every mechanism's package v2 (R4) and its record's name, teaching and kin
//   blocks; a package conformance built from the same sources is read from the cache (src/package/built.ts), the
//   others are built in a pool of processes (tools/pool.ts);
// - thumbs/<id>-<theme>.webp and -still.webp: the card drawings and the stage's still, committed in site/thumbs (R8, SS1); their fingerprints are checked
//   first, and a stale one fails the build with the command to run. Nothing is drawn here.
// - favicon.svg, favicon-*.png, favicon.ico, apple-touch-icon.png, social.png: the mark's icons and the social card,
//   committed in site/brand by tools/brand.ts and checked the same way.
import { copyFileSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { recordById } from "../src/catalog";
import { allIds } from "../src/mechanisms";
import { copyBrand } from "./brand";
import { runPool } from "./pool";
import { checkThumbs, imagesOf, THUMBS_DIR } from "./thumbs";
import { FONT_FILES } from "./tokens-css";

const root = fileURLToPath(new URL("..", import.meta.url));
const pub = join(root, "site", "public");
const require = createRequire(import.meta.url);

export async function siteAssets(ids = allIds()): Promise<void> {
  copyBrand(pub);
  mkdirSync(join(pub, "fonts"), { recursive: true });
  for (const f of FONT_FILES) {
    const dir = join(dirname(require.resolve(`@fontsource/${f.slug}/package.json`)), "files");
    copyFileSync(join(dir, `${f.slug}-latin-${f.weight}-normal.woff2`), join(pub, "fonts", f.file));
  }
  // nothing an earlier build left is served by this one
  rmSync(join(pub, "meta"), { recursive: true, force: true });
  rmSync(join(pub, "packages"), { recursive: true, force: true });
  mkdirSync(join(pub, "packages"), { recursive: true });
  mkdirSync(join(pub, "meta"), { recursive: true });
  const packages = new Map<string, Uint8Array>();
  const bytes = await runPool<string, Uint8Array>(fileURLToPath(new URL("../src/package/built.ts", import.meta.url)), "builtBytes", ids);
  for (const [i, id] of ids.entries()) {
    const v2 = bytes[i]!;
    packages.set(id, v2);
    writeFileSync(join(pub, "packages", `${id}.mx2`), v2);
    const rec = recordById(id) as unknown as { name?: string; kin?: unknown; teaching?: unknown } | undefined;
    writeFileSync(join(pub, "meta", `${id}.json`), JSON.stringify({ name: rec?.name ?? id, teaching: rec?.teaching ?? null, kin: rec?.kin ?? null }));
  }
  await checkThumbs(ids, packages);
  mkdirSync(join(pub, "thumbs"), { recursive: true });
  for (const id of ids) for (const f of imagesOf(id)) copyFileSync(join(THUMBS_DIR, f), join(pub, "thumbs", f));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  try {
    await siteAssets();
    console.log(`wrote the icons, fonts, packages and thumbnails to ${pub}`);
  } catch (e) {
    console.error(`site-assets: ${e instanceof Error ? e.message : String(e)}`);
    process.exitCode = 1;
  }
}
