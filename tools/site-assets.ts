// Part of prebuild: everything the static site serves that is generated, written into site/public (git-ignored).
// - fonts/: the IBM Plex faces of tokens.css, latin subset, from the @fontsource packages (SF7, self-hosted);
// - packages/<id>.mxp: every registered mechanism, packaged (R4);
// - thumbs/<id>-<theme>.png: the pre-rendered card drawings (R8, SS1).
import { copyFileSync, mkdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { mechanisms } from "../src/mechanisms";
import { buildPackage } from "../src/package/build";
import { encode } from "../src/package/format";
import { thumbs } from "./thumbs";
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
  for (const id of ids) writeFileSync(join(pub, "packages", `${id}.mxp`), await encode((await buildPackage(id)).pkg));
  await thumbs(ids, join(pub, "thumbs"));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  await siteAssets();
  console.log(`wrote fonts, packages and thumbnails to ${pub}`);
}
