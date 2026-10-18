// npx tsx tools/bench-page/build.ts [id ...]: writes dist/bench/page (index.html, main.js, <id>.mxp) for the browser bench.
import { copyFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { build } from "esbuild";
import { mechanisms } from "../../src/mechanisms";
import { buildPackage } from "../../src/package/build";
import { encode } from "../../src/package/format";

const out = join("dist", "bench", "page");
mkdirSync(out, { recursive: true });
const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const ids = args.length ? args : Object.keys(mechanisms);
// the site's packages from the last prebuild are reused unless --fresh
const fresh = process.argv.includes("--fresh");
for (const id of ids) {
  const site = join("site", "public", "packages", `${id}.mxp`);
  if (!fresh && existsSync(site)) copyFileSync(site, join(out, `${id}.mxp`));
  else writeFileSync(join(out, `${id}.mxp`), await encode((await buildPackage(id)).pkg));
}
await build({ entryPoints: ["tools/bench-page/main.ts"], bundle: true, format: "esm", platform: "browser", target: "es2022", outfile: join(out, "main.js"), logLevel: "warning" });
writeFileSync(join(out, "index.html"), `<!doctype html><meta charset="utf-8"><title>bench</title><body style="margin:0;background:#888"><script type="module" src="./main.js"></script>\n`);
console.log(`wrote ${out}`);
