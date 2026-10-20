// The bench page (standard R6, R10): the measurements of tools/bench for package v2, run in whatever browser opens the
// page, a phone's included, with the results shown on the page to copy. Per mechanism:
//
//   setup      decode, tessellate, edges, GPU (program, buffers, first frame to the screen); ms. The same setup run
//              in a worker is timed as well (wall clock, and the main thread's share).
//   frames     at plan, 28 degrees, side and explode 70 degrees, and at 28 degrees for every dial position: the mean
//              interval of animation frames ("paced"), the mean of draw plus a one-pixel read-back ("gpu": what the
//              frame costs when the display's rate is not the limit), and the median script time of the draw call.
//   today      the same views through today's renderer (package v1), when asked.
//
// The v2 frames are drawn by a stand-in (tools/bench-page/standin.ts) until the 3D renderer exists: a floor for its
// cost, not its cost. Everything is a median of the runs.
import { models } from "../../src/mechanisms/models";
import { loadPackage } from "../../src/package/loader";
import { browserFactory } from "../../src/render/canvas";
import type { Dial } from "../../src/render/detail";
import { defaultView, type DrawView } from "../../src/render/draft";
import { createSession } from "../../src/render/session";
import { setupInWorker, setupInline } from "../../src/solids/setup";
import { DETAIL } from "../../src/style/detail";
import { createGpu, StandIn, type Gpu, type StandInView } from "./standin";

export interface Opts {
  ids: string[];
  runs: number;
  frames: number;
  /** Stage size in CSS pixels and the pixel ratio. */
  w: number;
  h: number;
  dpr: number;
  today: boolean;
  worker: boolean;
}

interface Timing {
  paced: number;
  gpu: number;
  cpu: number;
}
interface Row {
  id: string;
  kb: { v1: number; v2: number };
  solids: number;
  shapes: number;
  triangles: number;
  edges: number;
  setup: { decode: number; tessellate: number; caps: number; edges: number; gpu: number; total: number };
  worker?: { wall: number };
  views: Record<string, Timing>;
  dial: Record<string, Timing>;
  draws: number;
  instances: number;
  today?: { setup: number; views: Record<string, number>; dial: Record<string, number>; cpu: Record<string, number> };
}
export interface Report {
  /** Context and shader creation, once per page (milliseconds). */
  contextMs: number;
  device: Record<string, string | number>;
  opts: Opts;
  rows: Row[];
}

interface Hosts {
  gpu: HTMLElement;
  today: HTMLElement;
}

const med = (v: number[]) => [...v].sort((a, b) => a - b)[Math.floor(v.length / 2)] ?? 0;
const r2 = (x: number) => Math.round(x * 100) / 100;
const frame = () => new Promise<number>((r) => requestAnimationFrame(r));
const bytes = async (url: string) => new Uint8Array(await (await fetch(url)).arrayBuffer());

const VIEWS: [string, { tilt: number; explode: number }][] = [["plan", { tilt: 0, explode: 0 }], ["28", { tilt: 28, explode: 0 }], ["side", { tilt: 88, explode: 0 }], ["explode", { tilt: 70, explode: 1 }]];

function device(): Record<string, string | number> {
  const gl = document.createElement("canvas").getContext("webgl2");
  const x = gl?.getExtension("WEBGL_debug_renderer_info");
  const nav = navigator as Navigator & { deviceMemory?: number };
  return {
    userAgent: navigator.userAgent,
    gpu: x ? String(gl!.getParameter(x.UNMASKED_RENDERER_WEBGL)) : gl ? "unknown" : "no WebGL2",
    cores: navigator.hardwareConcurrency,
    memoryGB: nav.deviceMemory ?? 0,
    screen: `${screen.width}x${screen.height}`,
    dpr: window.devicePixelRatio,
  };
}

async function timeFrames(draw: (u: number) => void, sync: () => void, n: number): Promise<Timing> {
  for (let i = 0; i < 5; i++) draw(0.3 + i * 0.01);
  sync();
  const cpu: number[] = [];
  await frame();
  await frame();
  const t0 = performance.now();
  for (let i = 0; i < n; i++) {
    await frame();
    const a = performance.now();
    draw(1 + i * 0.05);
    cpu.push(performance.now() - a);
  }
  await frame();
  const paced = (performance.now() - t0) / (n + 1);
  sync();
  const g0 = performance.now();
  for (let i = 0; i < n; i++) {
    draw(2 + i * 0.05);
    sync();
  }
  const gpu = (performance.now() - g0) / n;
  return { paced: r2(paced), gpu: r2(gpu), cpu: r2(med(cpu)) };
}

function canvasIn(host: HTMLElement): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.style.display = "block";
  c.style.maxWidth = "100%";
  host.replaceChildren(c);
  return c;
}

/** The page's one context, and what making it cost (the once-per-page share of the GPU stage). */
let shared: { gpu: Gpu; ms: number } | null = null;
function gpuFor(host: HTMLElement): { gpu: Gpu; ms: number } {
  if (!shared) {
    const t0 = performance.now();
    const gpu = createGpu(canvasIn(host));
    gpu.gl.finish();
    shared = { gpu, ms: performance.now() - t0 };
  }
  return shared;
}

async function one(id: string, o: Opts, host: Hosts, log: (s: string) => void): Promise<Row> {
  const model = await models[id]!();
  const blob2 = await bytes(`packages/${id}.mx2`);
  const blob1 = await bytes(`packages/${id}.mxp`);
  const dials: Dial[] = ["full", ...DETAIL.map((r) => r.id)];
  const setups: Row["setup"][] = [];
  const workers: number[] = [];
  let counts = { solids: 0, shapes: 0, triangles: 0, edges: 0, draws: 0, instances: 0 };
  const views: Record<string, Timing[]> = {};
  const dial: Record<string, Timing[]> = {};
  for (let run = 0; run < o.runs; run++) {
    log(`${id}: run ${run + 1} of ${o.runs}, setup`);
    const s = await setupInline(blob2.slice());
    const g0 = performance.now();
    const stand = new StandIn(gpuFor(host.gpu).gpu, s.pkg, s.meshes, s.edges, model);
    stand.resize(o.w, o.h, o.dpr);
    stand.draw(1, { tilt: 28, explode: 0, detail: "full" });
    stand.finish();
    const gpu = performance.now() - g0;
    setups.push({ decode: s.ms.decode, tessellate: s.ms.tessellate, caps: s.ms.caps, edges: s.ms.edges, gpu, total: s.ms.decode + s.ms.tessellate + s.ms.edges + gpu });
    if (o.worker && typeof Worker !== "undefined") {
      const w = new Worker(`setup-worker.js?v=${document.body.dataset.v ?? ""}`, { type: "module" });
      workers.push((await setupInWorker(w, blob2)).wall);
      w.terminate();
    }
    log(`${id}: run ${run + 1}, frames`);
    for (const [k, v] of VIEWS) (views[k] ??= []).push(await timeFrames((u) => stand.draw(u, { ...v, detail: "full" }), () => stand.finish(), o.frames));
    for (const d of dials) (dial[d] ??= []).push(await timeFrames((u) => stand.draw(u, { tilt: 28, explode: 0, detail: d } satisfies StandInView), () => stand.finish(), Math.max(10, o.frames >> 1)));
    stand.draw(1, { tilt: 28, explode: 0, detail: "full" });
    counts = { solids: s.pkg.solids.length, shapes: s.meshes.length, triangles: s.meshes.reduce((n, m) => n + m.tag.length, 0), edges: s.edges.reduce((n, e) => n + e.n, 0), draws: stand.counters.draws, instances: stand.counters.instances };
    stand.dispose();
  }
  const pick = (m: Record<string, Timing[]>): Record<string, Timing> =>
    Object.fromEntries(Object.entries(m).map(([k, t]) => [k, { paced: r2(med(t.map((x) => x.paced))), gpu: r2(med(t.map((x) => x.gpu))), cpu: r2(med(t.map((x) => x.cpu))) }]));
  const field = (k: keyof Row["setup"]) => r2(med(setups.map((x) => x[k])));
  const row: Row = {
    id,
    kb: { v1: r2(blob1.length / 1024), v2: r2(blob2.length / 1024) },
    solids: counts.solids,
    shapes: counts.shapes,
    triangles: counts.triangles,
    edges: counts.edges,
    setup: { decode: field("decode"), tessellate: field("tessellate"), caps: field("caps"), edges: field("edges"), gpu: field("gpu"), total: field("total") },
    views: pick(views),
    dial: pick(dial),
    draws: counts.draws,
    instances: counts.instances,
  };
  if (workers.length) row.worker = { wall: r2(med(workers)) };
  if (o.today) row.today = await todays(id, o, host.today, log);
  return row;
}

async function todays(id: string, o: Opts, host: HTMLElement, log: (s: string) => void): Promise<NonNullable<Row["today"]>> {
  log(`${id}: today's renderer`);
  const [m, pkg] = await Promise.all([models[id]!(), loadPackage(`packages/${id}.mxp`)]);
  const setup: number[] = [];
  const views: Record<string, number[]> = {};
  const cpus: Record<string, number[]> = {};
  const dial: Record<string, number[]> = {};
  const base = (v: Partial<DrawView>): DrawView => ({ ...defaultView(), dims: true, sheet: { title: id, no: `MX-${id.toUpperCase()}` }, overlays: { paths: true }, ...v });
  for (let run = 0; run < o.runs; run++) {
    const canvas = canvasIn(host);
    canvas.style.width = `${o.w}px`;
    canvas.style.height = `${o.h}px`;
    const t0 = performance.now();
    const sess = createSession(canvas, pkg, m, { factory: browserFactory, w: o.w, h: o.h, dpr: o.dpr });
    sess.draw(1, base({}));
    setup.push(performance.now() - t0);
    for (const [k, v] of VIEWS) {
      const t = await timeFrames((u) => sess.draw(u, base(v)), () => undefined, o.frames);
      (views[k] ??= []).push(t.paced);
      (cpus[k] ??= []).push(t.cpu);
    }
    for (const d of ["full", ...DETAIL.map((r) => r.id)] as Dial[]) (dial[d] ??= []).push((await timeFrames((u) => sess.draw(u, base({ tilt: 28, detail: d })), () => undefined, Math.max(10, o.frames >> 1))).paced);
    sess.dispose();
  }
  const pick = (r: Record<string, number[]>) => Object.fromEntries(Object.entries(r).map(([k, v]) => [k, r2(med(v))]));
  return { setup: r2(med(setup)), views: pick(views), cpu: pick(cpus), dial: pick(dial) };
}

/** The report as Markdown, to paste into the issue. */
export function markdown(r: Report): string {
  const L: string[] = [];
  const d = r.device;
  L.push(`## Bench, package v2`, ``, `${String(d.userAgent)}`, `GPU ${String(d.gpu)}, ${String(d.cores)} cores, ${String(d.memoryGB)} GB, screen ${String(d.screen)}, DPR ${String(d.dpr)}`, `Stage ${r.opts.w} x ${r.opts.h} CSS px at DPR ${r.opts.dpr}; ${r.opts.runs} runs, ${r.opts.frames} frames per view; medians. v2 frames are drawn by the stand-in renderer (a floor).`, ``);
  L.push(`Setup, ms. GPU is buffers, sizing and the first frame on the page's shared context; the context and both shader programs were made once, in ${r.contextMs} ms.`, ``);
  L.push(`Setup, ms (decode / tessellate / edges / GPU / total):`, ``, `| Mechanism | v1 KB | v2 KB | solids | shapes | triangles | edges | decode | tessellate (caps) | edges | GPU | total | worker wall | via worker (wall + GPU) |`, `|---|---|---|---|---|---|---|---|---|---|---|---|---|---|`);
  for (const x of r.rows) L.push(`| ${x.id} | ${x.kb.v1} | ${x.kb.v2} | ${x.solids} | ${x.shapes} | ${x.triangles} | ${x.edges} | ${x.setup.decode} | ${x.setup.tessellate} (${x.setup.caps}) | ${x.setup.edges} | ${x.setup.gpu} | ${x.setup.total} | ${x.worker?.wall ?? ""} | ${x.worker ? r2(x.worker.wall + x.setup.gpu) : ""} |`);
  const vs = VIEWS.map(([k]) => k);
  L.push(``, `Frames per view, ms (paced / gpu wait / script):`, ``, `| Mechanism | ${vs.join(" | ")} |`, `|---|${vs.map(() => "---").join("|")}|`);
  for (const x of r.rows) L.push(`| ${x.id} | ${vs.map((k) => `${x.views[k]?.paced} / ${x.views[k]?.gpu} / ${x.views[k]?.cpu}`).join(" | ")} |`);
  const ds = Object.keys(r.rows[0]?.dial ?? {});
  L.push(``, `Frame at 28° by dial position, ms (paced / gpu wait):`, ``, `| Mechanism | ${ds.join(" | ")} |`, `|---|${ds.map(() => "---").join("|")}|`);
  for (const x of r.rows) L.push(`| ${x.id} | ${ds.map((k) => `${x.dial[k]?.paced} / ${x.dial[k]?.gpu}`).join(" | ")} |`);
  if (r.rows.some((x) => x.today)) {
    L.push(``, `Today's renderer (package v1), paced ms:`, ``, `| Mechanism | setup | ${vs.join(" | ")} | script at 28° |`, `|---|---|${vs.map(() => "---").join("|")}|---|`);
    for (const x of r.rows) if (x.today) L.push(`| ${x.id} | ${x.today.setup} | ${vs.map((k) => x.today!.views[k]).join(" | ")} | ${x.today.cpu["28"]} |`);
  }
  return L.join("\n") + "\n";
}

export async function run(o: Opts, host: HTMLElement, log: (s: string) => void = () => undefined): Promise<Report> {
  const rows: Row[] = [];
  const hosts: Hosts = { gpu: document.createElement("div"), today: document.createElement("div") };
  host.replaceChildren(hosts.gpu, hosts.today);
  for (const id of o.ids) rows.push(await one(id, o, hosts, log));
  return { contextMs: r2(shared?.ms ?? 0), device: device(), opts: o, rows };
}

Object.assign(window, { bench3: run, bench3md: markdown });

// the page: controls, a log, the results to copy
const ui = document.getElementById("app");
if (ui) {
  const p = new URLSearchParams(location.search);
  const ids = (document.body.dataset.ids ?? "").split(",").filter(Boolean);
  const wide = Math.min(1393, document.documentElement.clientWidth - 24);
  const num = (k: string, d: number) => (p.has(k) ? Number(p.get(k)) : d);
  ui.innerHTML = `
    <h1>Bench: package v2</h1>
    <p>Measures setup (decode, tessellate, edges, GPU) and frame times on this device. Keep the tab in the foreground and the screen on; a run takes a few minutes. Then copy the results.</p>
    <fieldset><legend>Mechanisms</legend>${ids.map((i) => `<label><input type="checkbox" name="id" value="${i}" checked> ${i}</label>`).join(" ")}</fieldset>
    <label>Runs <input id="runs" type="number" value="${num("runs", 3)}" min="1" max="9" style="width:3em"></label>
    <label>Frames <input id="frames" type="number" value="${num("frames", 30)}" min="10" max="200" style="width:4em"></label>
    <label><input id="today" type="checkbox" checked> also today's renderer</label>
    <label><input id="worker" type="checkbox" checked> also in a worker</label>
    <p><button id="go">Run</button> <button id="copy" disabled>Copy results</button> <span id="log"></span></p>
    <pre id="out"></pre>
    <div id="stage"></div>`;
  const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
  let last = "";
  $("go").onclick = () => {
    $<HTMLButtonElement>("go").disabled = true;
    const chosen = [...document.querySelectorAll<HTMLInputElement>("input[name=id]:checked")].map((x) => x.value);
    const o: Opts = {
      ids: chosen,
      runs: Number($<HTMLInputElement>("runs").value),
      frames: Number($<HTMLInputElement>("frames").value),
      w: num("w", wide),
      h: num("h", Math.round(wide * 0.62)),
      dpr: num("dpr", Math.min(window.devicePixelRatio, 3)),
      today: $<HTMLInputElement>("today").checked,
      worker: $<HTMLInputElement>("worker").checked,
    };
    run(o, $("stage"), (s) => ($("log").textContent = s)).then(
      (r) => {
        last = markdown(r) + "\n```json\n" + JSON.stringify(r) + "\n```\n";
        $("out").textContent = last;
        $("log").textContent = "done";
        $<HTMLButtonElement>("copy").disabled = false;
        $<HTMLButtonElement>("go").disabled = false;
      },
      (e: unknown) => {
        $("log").textContent = `failed: ${String(e)}`;
        $<HTMLButtonElement>("go").disabled = false;
      },
    );
  };
  $("copy").onclick = () => {
    const done = () => ($("log").textContent = "copied");
    if (navigator.clipboard) navigator.clipboard.writeText(last).then(done, () => ($("out").focus(), document.execCommand("copy")));
    else {
      const r = document.createRange();
      r.selectNodeContents($("out"));
      getSelection()?.removeAllRanges();
      getSelection()?.addRange(r);
      document.execCommand("copy");
      done();
    }
  };
}
document.title = "ready";
