// Part of prebuild: everything the static site serves that is generated, written into site/public (git-ignored).
// - fonts/: the IBM Plex faces of tokens.css, latin subset, from the @fontsource packages (SF7, self-hosted);
// - packages/<id>.mxp: every registered mechanism, packaged (R4);
// - thumbs/<id>-<theme>.webp: the card drawings, committed in site/thumbs (R8, SS1); their fingerprints are checked
//   first, and a stale one fails the build with the command to run. Nothing is drawn here.
import { copyFileSync, mkdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { mechanisms } from "../src/mechanisms";
import { buildPackage } from "../src/package/build";
import { encode } from "../src/package/format";
import { checkThumbs, THUMBS_DIR } from "./thumbs";
import { FONT_FILES } from "./tokens-css";

const root = fileURLToPath(new URL("..", import.meta.url));
const pub = join(root, "site", "public");
const require = createRequire(import.meta.url);

export async function siteAssets(ids = Object.keys(mechanisms)): Promise<void> {
  mkdirSync(join(pub, "fonts"), { recursive: true });
  for (const f of FONT_FILES) {
    const dir = join(dirname(require.resolve(`@fontsource/${f.slug}/package.json`)), "files");
    copyFileSync(join(dir, `${f.slug}-latin-${f.weight}-normal.woff2`), join(pub, "fonts", f.file));
  }
  mkdirSync(join(pub, "packages"), { recursive: true });
  const packages = new Map<string, Uint8Array>();
  for (const id of ids) {
    const bytes = await encode((await buildPackage(id)).pkg);
    packages.set(id, bytes);
    writeFileSync(join(pub, "packages", `${id}.mxp`), bytes);
  }
  await checkThumbs(ids, packages);
  mkdirSync(join(pub, "thumbs"), { recursive: true });
  for (const id of ids) for (const t of ["dark", "light"]) copyFileSync(join(THUMBS_DIR, `${id}-${t}.webp`), join(pub, "thumbs", `${id}-${t}.webp`));
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
