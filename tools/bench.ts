// npx tsx tools/bench.ts [id ...] [--runs 3] [--frames 40] [--w 1393] [--h 870] [--dpr 1.5]: the browser bench (standard R6,
// R10, DL5) in local Chrome on the GPU: it builds the bench page (tools/bench-page) for the ids (the pilots when none is
// given), opens it and runs it: per mechanism, the package size, setup split into decode, tessellate, edges and GPU (also
// in a worker), and frame time at plan, 28°, side and full explode and at every dial position, paced and with a GPU
// wait, against the targets of R6 (8 ms desktop frame, 20 ms setup), reported as flags, never as failures. Writes
// dist/bench/report.md and report.json.
//
// `--page [--out dir] [id ...]` only builds the page as a static folder (default dist/bench-page: index.html, the scripts,
// the fonts, the packages and the records' blocks), ready to publish and open on a phone.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildPage, PAGE_IDS, runPage } from "./bench-page/build";

const W = 1393;
const H = 870;

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const arg = (k: string, d: string) => {
    const i = process.argv.indexOf(`--${k}`);
    return i > 0 ? process.argv[i + 1]! : d;
  };
  const num = (k: string, d: number) => Number(arg(k, String(d)));
  const val = new Set(["--out", "--runs", "--dpr", "--frames", "--w", "--h"]);
  const given = process.argv.slice(2).filter((a, i, all) => !a.startsWith("--") && !val.has(all[i - 1] ?? ""));
  const ids = given.length ? given : PAGE_IDS;
  const root = fileURLToPath(new URL("..", import.meta.url));
  if (process.argv.includes("--page")) {
    const out = await buildPage(arg("out", join(root, "dist", "bench-page")), ids);
    console.log(`bench page for ${ids.join(", ")} built in ${out}; publish that folder and open index.html on the phone`);
  } else {
    const dir = await buildPage(join(root, "dist", "bench-page"), ids);
    const o = { ids, runs: num("runs", 3), frames: num("frames", 40), w: num("w", W), h: num("h", H), dpr: num("dpr", 1.5), worker: true };
    const { gpu, md, json } = await runPage(dir, o);
    mkdirSync("dist/bench", { recursive: true });
    writeFileSync("dist/bench/report.json", JSON.stringify(json, null, 2));
    writeFileSync("dist/bench/report.md", md);
    console.log(`${gpu}\n${md}`);
  }
  process.exit(0);
}
