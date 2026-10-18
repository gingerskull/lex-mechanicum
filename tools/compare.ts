// npx tsx tools/compare.ts [--shots] [--bench] [--cards] [--lose] [--ids four-bar,spur-gears] [--runs 3] [--dpr 1.5]
//   [--ref dir]: the renderer drawn in local Chrome (GPU on) from the bench page (tools/bench-page/build.ts first).
// --shots: one PNG per mechanism, sheet and view in dist/compare/shots; with --ref (PNGs named <id>-<theme>-<view>.png),
//          a diff against each and a grid per mechanism and sheet (reference, now, differing pixels).
// --bench: frame times per view and dial position with draw counters, median of the runs (dist/compare/bench.md, .json).
// --cards: library card drawings at each dial position (dist/compare/cards.png).
// --lose:  a frame drawn, the GPU context lost and restored, the frame drawn again.
import { createServer } from "node:http";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { extname, join } from "node:path";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
import { chromium } from "playwright-core";
import { nodeCanvas } from "./canvas-node";
import { loadImage } from "@napi-rs/canvas";

const arg = (k: string, d: string) => {
  const i = process.argv.indexOf(`--${k}`);
  return i > 0 ? process.argv[i + 1]! : d;
};
const has = (k: string) => process.argv.includes(`--${k}`);
const ids = arg("ids", "four-bar,spur-gears").split(",");
const runs = Number(arg("runs", "3"));
const dpr = Number(arg("dpr", "1.5"));
const ref = has("ref") ? arg("ref", "") : null;
const doShots = has("shots");
const doBench = has("bench");
const doCards = has("cards");
const doLose = has("lose");
if (!doShots && !doBench && !doCards && !doLose) throw new Error("compare: say what to do: --shots, --bench, --cards or --lose");
const VIEWS = [["plan", 0, 0], ["28", 28, 0], ["side", 88, 0], ["explode", 70, 1]] as const;
const THEMES = ["dark", "light"] as const;
const OUT = join("dist", "compare");
mkdirSync(join(OUT, "shots"), { recursive: true });

const root = join("dist", "bench", "page");
if (!existsSync(join(root, "main.js"))) throw new Error("compare: build the page first: npx tsx tools/bench-page/build.ts");
const TYPES: Record<string, string> = { ".html": "text/html", ".js": "text/javascript" };
const server = createServer((q, r) => {
  let p = decodeURIComponent(new URL(q.url ?? "/", "http://x").pathname);
  if (p.endsWith("/")) p += "index.html";
  try {
    const body = readFileSync(join(root, p));
    r.writeHead(200, { "content-type": TYPES[extname(p)] ?? "application/octet-stream" });
    r.end(body);
  } catch {
    r.writeHead(404);
    r.end();
  }
});
await new Promise<void>((ok) => server.listen(0, ok));
const port = (server.address() as { port: number }).port;
// the real GPU in headless Chrome, and frames not held to the display's rate (so a frame costs what it costs)
const browser = await chromium.launch({ channel: "chrome", headless: true, args: ["--enable-gpu", "--use-angle=d3d11", "--ignore-gpu-blocklist", "--enable-gpu-rasterization", "--disable-gpu-vsync", "--disable-frame-rate-limit"] });
const page = await browser.newPage({ viewport: { width: 1393, height: 870 }, deviceScaleFactor: 1 });
page.on("console", (m) => m.type() === "error" && !m.text().includes("404") && console.error(`page: ${m.text()}`));
const until = async (t: RegExp, ms: number) => {
  await page.waitForFunction((s) => new RegExp(s).test(document.title), t.source, { timeout: ms });
  const title = await page.title();
  if (title.startsWith("error")) throw new Error(title);
};
const open = async (query: string, done = /ready|error/, ms = 60_000) => {
  await page.goto(`http://localhost:${port}/?${query}`);
  await until(done, ms);
};
const png = async () => Buffer.from((await page.evaluate(() => (document.getElementById("stage") as HTMLCanvasElement).toDataURL("image/png"))).split(",")[1]!, "base64");
await open(`mode=shot&id=${ids[0]}&dpr=1`);
const gpu = await page.evaluate(() => {
  const gl = document.createElement("canvas").getContext("webgl2");
  const x = gl?.getExtension("WEBGL_debug_renderer_info");
  return x ? String(gl!.getParameter(x.UNMASKED_RENDERER_WEBGL)) : "unknown";
});
console.log(`GPU: ${gpu}`);

if (doShots) {
  const pct = (n: number, img: PNG) => (100 * n) / (img.width * img.height);
  const diffs: string[] = ["| Mechanism | Sheet | View | differing from the reference |", "|---|---|---|---|"];
  for (const id of ids)
    for (const theme of THEMES) {
      const cells: Record<string, string> = {};
      for (const [name, tilt, explode] of VIEWS) {
        await open(`mode=shot&id=${id}&tilt=${tilt}&explode=${explode}&theme=${theme}&dpr=${dpr}`);
        const buf = await png();
        const f = join(OUT, "shots", `${id}-${theme}-${name}.png`);
        writeFileSync(f, buf);
        cells[`${name}|now`] = f;
        const rf = ref && join(ref, `${id}-${theme}-${name}.png`);
        if (!rf || !existsSync(rf)) continue;
        cells[`${name}|ref`] = rf;
        const a = PNG.sync.read(readFileSync(rf));
        const b = PNG.sync.read(buf);
        const out = new PNG({ width: a.width, height: a.height });
        const n = pixelmatch(a.data, b.data, out.data, a.width, a.height, { threshold: 0.1, alpha: 0.2 });
        const df = join(OUT, "shots", `${id}-${theme}-${name}-diff.png`);
        writeFileSync(df, PNG.sync.write(out));
        cells[`${name}|diff`] = df;
        diffs.push(`| ${id} | ${theme} | ${name} | ${pct(n, a).toFixed(2)} % |`);
      }
      if (!ref) continue;
      // the grid: reference, now and the differing pixels, one column per view, half size, labelled
      const sw = Math.round(1393 * 0.5);
      const sh = Math.round(870 * 0.5);
      const pad = 28;
      const rowsK = [["ref", "reference"], ["now", "now"], ["diff", "pixels differing"]] as const;
      const g = nodeCanvas(pad + VIEWS.length * sw, pad + rowsK.length * (sh + pad));
      const x = g.getContext("2d")!;
      x.fillStyle = "#ffffff";
      x.fillRect(0, 0, g.width, g.height);
      x.fillStyle = "#000000";
      x.font = "16px sans-serif";
      for (let c = 0; c < VIEWS.length; c++) x.fillText(VIEWS[c]![0], pad + c * sw + 6, 20);
      for (let k = 0; k < rowsK.length; k++) {
        const y = pad + k * (sh + pad);
        x.fillStyle = "#000000";
        x.fillText(rowsK[k]![1], pad + 6, y + 18);
        for (let c = 0; c < VIEWS.length; c++) {
          const f = cells[`${VIEWS[c]![0]}|${rowsK[k]![0]}`];
          if (f) x.drawImage((await loadImage(readFileSync(f))) as never, pad + c * sw, y + pad - 4, sw - 4, sh - 4);
        }
      }
      writeFileSync(join(OUT, `grid-${id}-${theme}.png`), g.toBuffer("image/png"));
      console.log(`grid ${id} ${theme}`);
    }
  if (ref) {
    writeFileSync(join(OUT, "diffs.md"), diffs.join("\n") + "\n");
    console.log(diffs.join("\n"));
  }
}

if (doLose) {
  for (const id of ids) {
    await open(`mode=shot&id=${id}&dpr=${dpr}`);
    const before = PNG.sync.read(await png());
    await open(`mode=shot&lose=1&id=${id}&dpr=${dpr}`);
    const after = PNG.sync.read(await png());
    const n = pixelmatch(before.data, after.data, null, before.width, before.height, { threshold: 0.1 });
    console.log(`${id}: redrawn after a lost context, ${n} pixels differ`);
    if (n > before.width * before.height * 0.001) throw new Error(`compare: ${id} differs after a lost context`);
  }
}

// library card drawings at each dial position, one strip per mechanism and sheet
if (doCards) {
  const dials = arg("dials", "full,A,B,C,D").split(",");
  const label = (d: string) => (d === "full" ? "full detail" : d === "A" ? "drops A" : `drops A-${d}`);
  const rowsK = ids.flatMap((id) => THEMES.map((t) => [id, t] as const));
  const cw = 640;
  const ch = 480;
  const pad = 30;
  const g = nodeCanvas(pad + dials.length * (cw + 10), pad + rowsK.length * (ch + pad));
  const x = g.getContext("2d")!;
  x.fillStyle = "#ffffff";
  x.fillRect(0, 0, g.width, g.height);
  x.fillStyle = "#000000";
  x.font = "18px sans-serif";
  dials.forEach((d, c) => x.fillText(label(d), pad + c * (cw + 10) + 4, 22));
  for (let k = 0; k < rowsK.length; k++) {
    const [id, theme] = rowsK[k]!;
    const y = pad + k * (ch + pad);
    x.fillStyle = "#000000";
    x.fillText(`${id}, ${theme}`, pad + 4, y + 20);
    for (let c = 0; c < dials.length; c++) {
      await open(`mode=shot&card=1&id=${id}&theme=${theme}&detail=${dials[c]}`);
      const buf = await png();
      writeFileSync(join(OUT, "shots", `card-${id}-${theme}-${dials[c]}.png`), buf);
      x.drawImage((await loadImage(buf)) as never, pad + c * (cw + 10), y + pad - 4, cw, ch);
    }
  }
  writeFileSync(join(OUT, "cards.png"), g.toBuffer("image/png"));
  console.log("cards written");
}

if (doBench) {
  type Row = { id: string; samples: number; views: Record<string, number>; cpu: Record<string, number>; dial: Record<string, number>; counters: Record<string, Record<string, number>> };
  const all: Row[][] = [];
  for (let i = 0; i < runs; i++) {
    await open(`mode=bench&ids=${ids.join(",")}&dpr=${dpr}&frames=40${has("dials") ? `&dials=${arg("dials", "")}` : ""}`, /bench done|error/, 900_000);
    all.push(await page.evaluate(() => (window as unknown as { __bench: never }).__bench));
    console.log(`bench run ${i + 1}/${runs}`);
  }
  const med = (v: number[]) => [...v].sort((a, b) => a - b)[Math.floor(v.length / 2)]!;
  const pick = (j: number, key: "views" | "cpu" | "dial", row: Row) => Object.fromEntries(Object.keys(row[key]).map((k) => [k, med(all.map((a) => a[j]![key][k]!))]));
  const rows = all[0]!.map((row, j) => ({
    ...row,
    views: pick(j, "views", row),
    cpu: pick(j, "cpu", row),
    dial: pick(j, "dial", row),
    spread: Math.max(...Object.keys(row.views).map((k) => {
      const v = all.map((a) => a[j]!.views[k]!);
      return (Math.max(...v) - Math.min(...v)) / med(v);
    })),
  }));
  const dials = Object.keys(rows[0]?.dial ?? {});
  const L = [`# Browser bench`, ``, `1393 x 870 at DPR ${dpr}, ${gpu}, ${rows[0]?.samples ?? 0}x MSAA, median of ${runs} runs. Frame: mean interval of 40 frames drawn back to back on animation frames, frame-rate cap off (what the stage gets), ms. Script: median time inside the draw call.`, ``];
  L.push(`| Mechanism | plan | 28° | side | explode 70° | script at 28° | run spread |`, `|---|---|---|---|---|---|---|`);
  for (const r of rows) L.push(`| ${r.id} | ${r.views.plan} | ${r.views["28"]} | ${r.views.side} | ${r.views.explode} | ${r.cpu["28"]} | ${(100 * r.spread).toFixed(0)} % |`);
  L.push(``, `Frame at 28° by dial position (ms):`, ``, `| Mechanism | ${dials.join(" | ")} |`, `|---|${dials.map(() => "---").join("|")}|`);
  for (const r of rows) L.push(`| ${r.id} | ${dials.map((d) => r.dial[d]).join(" | ")} |`);
  L.push(``, `Draw counters at 28°, full detail (one frame):`, ``, `| Mechanism | solids | slices | 2D fills | 2D strokes | GL draws | GL chunks | GL instances |`, `|---|---|---|---|---|---|---|---|`);
  for (const r of rows) {
    const c = r.counters["28"]!;
    const n = (k: string) => c[k] ?? 0;
    L.push(`| ${r.id} | ${n("solids")} | ${n("slices")} | ${n("fill")} | ${n("stroke")} | ${n("glDraws")} | ${n("glChunks")} | ${n("glInstances")} |`);
  }
  writeFileSync(join(OUT, "bench.md"), L.join("\n") + "\n");
  writeFileSync(join(OUT, "bench.json"), JSON.stringify({ gpu, runs: all }, null, 1));
  console.log(L.join("\n"));
}
await browser.close();
server.close();
