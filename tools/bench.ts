// npx tsx tools/bench.ts [id ...] [--runs 3] [--dpr 1.5] [--frames 40]: the browser bench (standard R6, DL5), in local
// Chrome on the GPU: per mechanism, frame time at plan, 28°, side and full explode and at every dial position, the
// draw counters of one frame, the package size and the solids and marks on each rung. Frames are drawn back to back
// on animation frames with the frame-rate cap off, so each frame's GPU work is paid before the next (what the stage
// gets); the median of the runs. Writes dist/bench/report.md and report.json.
//
// Package v2 (standard R6, R10): `--page [--out dir] [id ...]` builds the bench page as a static folder (default
// dist/bench-page: index.html, the scripts, the fonts and the v1 and v2 packages of the ids; the pilots when none is
// given), ready to publish and open on a phone; `--v2 [id ...]` builds it, opens it in local Chrome and runs it, printing
// the page's report (setup split into decode, tessellate, edges and GPU, frame time per view and dial position, today's
// renderer beside it) and writing dist/bench/report-v2.md and report-v2.json.
//
// A mechanism rebuilt on engine v3 has no 2.5D renderer to set beside it, so naming one (or --v3) runs the v2 page with
// today's renderer left out: setup split into decode, tessellate, edges and GPU, and frame time paced and with a GPU wait,
// against the targets of R6 (8 ms desktop frame, 20 ms setup), reported as flags, never as failures.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { allIds, engineOf } from "../src/checks/engine";
import { buildFrom, buildPackage } from "../src/package/build";
import { encode } from "../src/package/format";
import type { Dial } from "../src/render/detail";
import { prepare } from "../src/render/world";
import { DETAIL, rungOf } from "../src/style/detail";
import { buildPage, PAGE_IDS, runPage } from "./bench-page/build";
import { openChrome, type BenchResult } from "./chrome";

const W = 1393;
const H = 870;

export interface BenchRow extends BenchResult {
  packageKB: number;
  rungs: Record<string, { solids: number; marks: number }>;
  /** Largest spread of a view's frame time across the runs, as a fraction of its median. */
  spread: number;
}

const med = (v: number[]) => [...v].sort((a, b) => a - b)[Math.floor(v.length / 2)]!;

/** The solids and marks each rung drops, and the package size: data, no drawing. */
async function inventory(id: string): Promise<Pick<BenchRow, "packageKB" | "rungs">> {
  const { pkg } = id.startsWith("fx-") ? buildFrom(id, (await import("../tests/fixtures/scenes")).scenes[id]!) : await buildPackage(id);
  const rungs: BenchRow["rungs"] = {};
  for (const p of prepare(pkg)) {
    (rungs[p.s.detail] ??= { solids: 0, marks: 0 }).solids++;
    for (const m of p.marks) (rungs[rungOf({ mark: m.kind }).id] ??= { solids: 0, marks: 0 }).marks++;
  }
  return { packageKB: +((await encode(pkg)).byteLength / 1024).toFixed(1), rungs };
}

export async function benchAll(ids: string[], o: { runs: number; dpr: number; frames: number }): Promise<{ gpu: string; rows: BenchRow[] }> {
  const chrome = await openChrome({ fixtures: ids.some((id) => id.startsWith("fx-")) });
  const dials: Dial[] = ["full", ...DETAIL.map((r) => r.id)];
  const rows: BenchRow[] = [];
  try {
    for (const id of ids) {
      const runs: BenchResult[] = [];
      for (let i = 0; i < o.runs; i++) runs.push(await chrome.bench(id, { w: W, h: H, dpr: o.dpr, frames: o.frames, dials }));
      const pick = (k: "views" | "cpu" | "dial") => Object.fromEntries(Object.keys(runs[0]![k]).map((x) => [x, med(runs.map((r) => r[k][x]!))]));
      const spread = Math.max(...Object.keys(runs[0]!.views).map((k) => {
        const v = runs.map((r) => r.views[k]!);
        return (Math.max(...v) - Math.min(...v)) / med(v);
      }));
      rows.push({ ...runs[0]!, setupMs: med(runs.map((r) => r.setupMs)), views: pick("views"), cpu: pick("cpu"), dial: pick("dial"), spread, ...(await inventory(id)) });
      console.log(`bench ${id}`);
    }
  } finally {
    await chrome.close();
  }
  return { gpu: chrome.gpu, rows };
}

export function report(gpu: string, rows: BenchRow[], o: { runs: number; dpr: number; frames: number }): string {
  const L = [`# Browser bench`, ``, `${W} x ${H} at DPR ${o.dpr}, ${gpu}, ${rows[0]?.samples ?? 0}x MSAA. Frame: mean interval of ${o.frames} frames drawn back to back on animation frames, frame-rate cap off, ms; median of ${o.runs} runs. Script: median time inside the draw call.`, ``];
  L.push(`| Mechanism | package KB | setup ms | plan | 28° | side | explode 70° | script at 28° | run spread |`, `|---|---|---|---|---|---|---|---|---|`);
  for (const r of rows) L.push(`| ${r.id} | ${r.packageKB} | ${r.setupMs} | ${r.views.plan} | ${r.views["28"]} | ${r.views.side} | ${r.views.explode} | ${r.cpu["28"]} | ${(100 * r.spread).toFixed(0)} % |`);
  const dials = Object.keys(rows[0]?.dial ?? {});
  L.push(``, `Frame at 28° by dial position (ms):`, ``, `| Mechanism | ${dials.join(" | ")} |`, `|---|${dials.map(() => "---").join("|")}|`);
  for (const r of rows) L.push(`| ${r.id} | ${dials.map((d) => r.dial[d]).join(" | ")} |`);
  L.push(``, `Draw counters at 28°, full detail (one frame):`, ``, `| Mechanism | solids | slices | 2D fills | 2D strokes | GL draws | GL chunks | GL instances | deforming (items) |`, `|---|---|---|---|---|---|---|---|---|`);
  for (const r of rows) {
    const c = r.counters["28"]!;
    const n = (k: string) => c[k] ?? 0;
    L.push(`| ${r.id} | ${n("solids")} | ${n("slices")} | ${n("fill")} | ${n("stroke")} | ${n("glDraws")} | ${n("glChunks")} | ${n("glInstances")} | ${n("glDyn")} (${n("glDynItems")}) |`);
  }
  const rs = [...DETAIL.map((r) => r.id), "never"];
  L.push(``, `Solids and marks per rung:`, ``, `| Mechanism | ${rs.join(" | ")} |`, `|---|${rs.map(() => "---").join("|")}|`);
  for (const r of rows) L.push(`| ${r.id} | ${rs.map((k) => (r.rungs[k] ? `${r.rungs[k].solids} / ${r.rungs[k].marks}` : "")).join(" | ")} |`);
  return L.join("\n") + "\n";
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const arg = (k: string, d: string) => {
    const i = process.argv.indexOf(`--${k}`);
    return i > 0 ? process.argv[i + 1]! : d;
  };
  const flag = (k: string) => process.argv.includes(`--${k}`);
  const named = process.argv.slice(2).filter((a, i, all) => !a.startsWith("--") && !new Set(["--out", "--runs", "--dpr", "--frames", "--w", "--h"]).has(all[i - 1] ?? ""));
  const has3 = flag("v3") || named.some((id) => engineOf(id) === "v3");
  if (flag("page") || flag("v2") || has3) {
    const num = (k: string, d: number) => Number(arg(k, String(d)));
    const val = new Set(["--out", "--runs", "--dpr", "--frames", "--w", "--h"]);
    const given = process.argv.slice(2).filter((a, i, all) => !a.startsWith("--") && !val.has(all[i - 1] ?? ""));
    const ids = given.length ? given : PAGE_IDS;
    const root = fileURLToPath(new URL("..", import.meta.url));
    if (flag("page")) {
      const out = await buildPage(arg("out", join(root, "dist", "bench-page")), ids);
      console.log(`bench page for ${ids.join(", ")} built in ${out}; publish that folder and open index.html on the phone`);
    } else {
      const dir = await buildPage(join(root, "dist", "bench-page"), ids);
      const o = { ids, runs: num("runs", 3), frames: num("frames", 40), w: num("w", W), h: num("h", H), dpr: num("dpr", 1.5), today: !ids.some((id) => engineOf(id) === "v3"), worker: true };
      const { gpu, md, json } = await runPage(dir, o);
      mkdirSync("dist/bench", { recursive: true });
      writeFileSync("dist/bench/report-v2.json", JSON.stringify(json, null, 2));
      writeFileSync("dist/bench/report-v2.md", md);
      console.log(`${gpu}
${md}`);
    }
    process.exit(0);
  }
  const opts = { runs: Number(arg("runs", "3")), dpr: Number(arg("dpr", "1.5")), frames: Number(arg("frames", "40")) };
  const flags = new Set(["--runs", "--dpr", "--frames"]);
  const ids = process.argv.slice(2).filter((a, i, all) => !a.startsWith("--") && !flags.has(all[i - 1] ?? ""));
  const { gpu, rows } = await benchAll(ids.length ? ids : allIds().filter((id) => engineOf(id) !== "v3"), opts);
  mkdirSync("dist/bench", { recursive: true });
  writeFileSync("dist/bench/report.json", JSON.stringify({ gpu, ...opts, rows }, null, 2));
  writeFileSync("dist/bench/report.md", report(gpu, rows, opts));
  console.log(report(gpu, rows, opts));
}
