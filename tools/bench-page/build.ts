// npx tsx tools/bench-page/build.ts [id ...]: writes dist/bench/page (index.html, main.js, <id>.mxp) for the browser bench.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { build } from "esbuild";
import { mechanisms } from "../../src/mechanisms";
import { buildPackage } from "../../src/package/build";
import { encode } from "../../src/package/format";

const out = join("dist", "bench", "page");
mkdirSync(out, { recursive: true });
const ids = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(mechanisms);
for (const id of ids) writeFileSync(join(out, `${id}.mxp`), await encode((await buildPackage(id)).pkg));
await build({ entryPoints: ["tools/bench-page/main.ts"], bundle: true, format: "esm", platform: "browser", target: "es2022", outfile: join(out, "main.js"), logLevel: "warning" });
writeFileSync(join(out, "index.html"), `<!doctype html><meta charset="utf-8"><title>bench</title><body style="margin:0"><script type="module" src="./main.js"></script>\n`);
console.log(`wrote ${out}`);
