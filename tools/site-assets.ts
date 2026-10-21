// Part of prebuild: everything the static site serves that is generated, written into site/public (git-ignored).
// - fonts/: the IBM Plex faces of tokens.css, latin subset, from the @fontsource packages (SF7, self-hosted);
// - packages/<id>.mxp: every 2.5D mechanism, packaged (R4); packages/<id>.mx2 and meta/<id>.json (the record's name,
//   teaching and kin blocks) for every mechanism the v3 stage draws (a mechanism on engine v3 has only these);
// - thumbs/<id>-<theme>.webp and -still.webp: the card drawings and the stage's still, committed in site/thumbs (R8, SS1); their fingerprints are checked
//   first, and a stale one fails the build with the command to run. Nothing is drawn here.
import { copyFileSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { recordById } from "../src/catalog";
import { allIds, engineOf } from "../src/checks";
import { buildAnyPackage } from "../src/package/any";
import { buildPackage } from "../src/package/build";
import { encode } from "../src/package/format";
import { encode2 } from "../src/package/format2";
import { drawnBy3 } from "../site/src/drawn";
import { checkThumbs, imagesOf, THUMBS_DIR } from "./thumbs";
import { FONT_FILES } from "./tokens-css";

const root = fileURLToPath(new URL("..", import.meta.url));
const pub = join(root, "site", "public");
const require = createRequire(import.meta.url);

export async function siteAssets(ids = allIds()): Promise<void> {
  mkdirSync(join(pub, "fonts"), { recursive: true });
  for (const f of FONT_FILES) {
    const dir = join(dirname(require.resolve(`@fontsource/${f.slug}/package.json`)), "files");
    copyFileSync(join(dir, `${f.slug}-latin-${f.weight}-normal.woff2`), join(pub, "fonts", f.file));
  }
  mkdirSync(join(pub, "packages"), { recursive: true });
  // what an earlier build (another SITE_V3) left for the v3 stage is not served by this one
  rmSync(join(pub, "meta"), { recursive: true, force: true });
  for (const f of readdirSync(join(pub, "packages"))) if (f.endsWith(".mx2")) rmSync(join(pub, "packages", f));
  mkdirSync(join(pub, "meta"), { recursive: true });
  const packages = new Map<string, Uint8Array>();
  for (const id of ids) {
    // the fingerprint of a thumbnail is of the package its engine draws from: v2 for engine v3, else v1
    if (engineOf(id) !== "v3") {
      const v1 = await encode((await buildPackage(id)).pkg);
      packages.set(id, v1);
      writeFileSync(join(pub, "packages", `${id}.mxp`), v1);
    }
    if (drawnBy3(id)) {
      const v2 = await encode2((await buildAnyPackage(id)).pkg);
      if (engineOf(id) === "v3") packages.set(id, v2);
      writeFileSync(join(pub, "packages", `${id}.mx2`), v2);
      const rec = recordById(id) as unknown as { name?: string; kin?: unknown; teaching?: unknown } | undefined;
      writeFileSync(join(pub, "meta", `${id}.json`), JSON.stringify({ name: rec?.name ?? id, teaching: rec?.teaching ?? null, kin: rec?.kin ?? null, lifted: engineOf(id) !== "v3" }));
    }
  }
  await checkThumbs(ids, packages);
  mkdirSync(join(pub, "thumbs"), { recursive: true });
  for (const id of ids) for (const f of imagesOf(id)) copyFileSync(join(THUMBS_DIR, f), join(pub, "thumbs", f));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  try {
    await siteAssets();
    console.log(`wrote fonts, packages and thumbnails to ${pub}`);
  } catch (e) {
    console.error(`site-assets: ${e instanceof Error ? e.message : String(e)}`);
    process.exitCode = 1;
  }
}
