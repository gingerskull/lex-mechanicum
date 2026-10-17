// npx tsx tools/bench.ts [id ...]: per mechanism, package size, session setup, frame time at plan, 28°, side and full
// explode and at every dial position, and the solids and marks on each rung (standard R6, DL5). Writes
// dist/bench/report.md and report.json. Node canvas timings are CPU rasterisation: they rank views and rungs; the
// browser numbers of the site are measured on its stage (step 8).
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { mechanisms } from "../src/mechanisms";
import { buildPackage } from "../src/package/build";
import { encode } from "../src/package/format";
import { ladder, type Dial } from "../src/render/detail";
import { defaultView, type DrawView } from "../src/render/draft";
import { createSession } from "../src/render/session";
import { prepare } from "../src/render/world";
import { DETAIL, rungOf } from "../src/style/detail";
import { nodeCanvas, nodeFactory } from "./canvas-node";

const W = 1393;
const H = 870;
const DPR = 1.5;
const FRAMES = 24;

export interface BenchRow {
  id: string;
  packageKB: number;
  setupMs: number;
  views: Record<string, number>;
  dial: Record<string, number>;
  rungs: Record<string, { solids: number; marks: number }>;
}

function frameMs(draw: (u: number) => void): number {
  for (let i = 0; i < 3; i++) draw(0.3 + i * 0.01);
  const t: number[] = [];
  for (let i = 0; i < FRAMES; i++) {
    const t0 = performance.now();
    draw(1 + i * 0.05);
    t.push(performance.now() - t0);
  }
  t.sort((a, b) => a - b);
  return +t[Math.floor(t.length / 2)]!.toFixed(2);
}

export async function bench(id: string): Promise<BenchRow> {
  const { model } = await mechanisms[id]!();
  const { pkg } = await buildPackage(id);
  const bytes = (await encode(pkg)).byteLength;
  const canvas = nodeCanvas(Math.round(W * DPR), Math.round(H * DPR));
  const t0 = performance.now();
  const sess = createSession(canvas as never, pkg, model, { factory: nodeFactory, w: W, h: H, dpr: DPR });
  const setupMs = +(performance.now() - t0).toFixed(2);
  const base: DrawView = { ...defaultView(), dims: true, sheet: { title: id, no: id }, overlays: { paths: true } };
  const views: Record<string, number> = {};
  for (const [k, v] of [["plan", { tilt: 0 }], ["28", { tilt: 28 }], ["side", { tilt: 88 }], ["explode", { tilt: 70, explode: 1 }]] as const)
    views[k] = frameMs((u) => sess.draw(u, { ...base, ...v }));
  const dial: Record<string, number> = {};
  for (const d of ["full", ...DETAIL.map((r) => r.id)] as Dial[]) dial[d] = frameMs((u) => sess.draw(u, { ...base, detail: d }));
  const rungs: Record<string, { solids: number; marks: number }> = {};
  for (const p of prepare(pkg)) {
    const r = (rungs[p.s.detail] ??= { solids: 0, marks: 0 });
    r.solids++;
    for (const m of p.marks) (rungs[rungOf({ mark: m.kind }).id] ??= { solids: 0, marks: 0 }).marks++;
  }
  void ladder;
  return { id, packageKB: +(bytes / 1024).toFixed(1), setupMs, views, dial, rungs };
}

function report(rows: BenchRow[]): string {
  const L = [`# Bench`, ``, `${W} x ${H} at DPR ${DPR}, Node canvas (CPU), median of ${FRAMES} frames, ms.`, ``];
  for (const r of rows) {
    L.push(`## ${r.id}`, ``, `Package ${r.packageKB} KB, session setup ${r.setupMs} ms.`, ``);
    L.push(`| View | plan | 28° | side | explode 70° |`, `|---|---|---|---|---|`, `| frame ms | ${r.views.plan} | ${r.views["28"]} | ${r.views.side} | ${r.views.explode} |`, ``);
    const ks = Object.keys(r.dial);
    L.push(`| Dial | ${ks.join(" | ")} |`, `|${ks.map(() => "---").join("|")}|---|`, `| frame ms | ${ks.map((k) => r.dial[k]).join(" | ")} |`, ``);
    const rs = Object.keys(r.rungs).sort();
    L.push(`| Rung | ${rs.join(" | ")} |`, `|---|${rs.map(() => "---").join("|")}|`, `| solids | ${rs.map((k) => r.rungs[k]!.solids).join(" | ")} |`, `| marks | ${rs.map((k) => r.rungs[k]!.marks).join(" | ")} |`, ``);
  }
  return L.join("\n");
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const ids = process.argv.slice(2);
  const rows: BenchRow[] = [];
  for (const id of ids.length ? ids : Object.keys(mechanisms)) rows.push(await bench(id));
  mkdirSync("dist/bench", { recursive: true });
  writeFileSync("dist/bench/report.json", JSON.stringify(rows, null, 2));
  writeFileSync("dist/bench/report.md", report(rows));
  console.log(report(rows));
}
