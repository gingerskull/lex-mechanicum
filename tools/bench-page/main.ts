// The bench page (standard R6, R10): the measurements of tools/bench for package v2, run in whatever browser opens the
// page, a phone's included, with the results shown on the page to copy. Per mechanism:
//
//   setup      decode, tessellate, edges, GPU (program, buffers, first frame to the screen); ms. The same setup run
//              in a worker is timed as well (wall clock, and the main thread's share).
//   frames     at plan, 28 degrees, side and explode 70 degrees, and at 28 degrees for every dial position: the mean
//              interval of animation frames ("paced"), the mean of draw plus a one-pixel read-back ("gpu": what the
//              frame costs when the display's rate is not the limit), and the median script time of the draw call.
//
// The frames are drawn by the 3D renderer (src/render/v3), posed by the record's kinematics, with its teaching layers.
// Everything is a median of the runs.
import { browserFactory } from "../../src/render/canvas";
import type { Dial } from "../../src/render/detail";
import { setupInWorker, setupInline } from "../../src/solids/setup";
import { DETAIL } from "../../src/style/detail";
import { Kinematics } from "../../src/kin/compose";
import type { Kin as KinLib } from "../../src/kin/types";
import { gpu3 } from "../../src/render/v3/gpu";
import { kinPoser, staticPoser } from "../../src/render/v3/poser";
import { createSession3, recordDrawView, type DrawView3 } from "../../src/render/v3/session";
import type { Meta } from "../draw3-page/main";

/** What a bench view asks of the renderer: the tilt from plan, the explode and the dial. */
interface StandInView {
  tilt: number;
  explode: number;
  detail: Dial;
}

export interface Opts {
  ids: string[];
  runs: number;
  frames: number;
  /** Stage size in CSS pixels and the pixel ratio. */
  w: number;
  h: number;
  dpr: number;
  worker: boolean;
}

interface Timing {
  paced: number;
  gpu: number;
  cpu: number;
}
interface Row {
  id: string;
  kb: number;
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
}
export interface Report {
  /** Context and shader creation, once per page (milliseconds). */
  contextMs: number;
  device: Record<string, string | number>;
  opts: Opts;
  rows: Row[];
}

/** The page's one context cost (shader compile and link), ms. */
let shared: { ms: number } | null = null;

const med = (v: number[]) => [...v].sort((a, b) => a - b)[Math.floor(v.length / 2)] ?? 0;
const r2 = (x: number) => Math.round(x * 100) / 100;
const frame = () => new Promise<number>((r) => requestAnimationFrame(r));
/** The page's build stamp: scripts and packages are fetched with it so a phone never reuses an older build. */
const stamp = () => document.body.dataset.v ?? "";
const bytes = async (url: string) => new Uint8Array(await (await fetch(`${url}?v=${stamp()}`)).arrayBuffer());

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

async function one(id: string, o: Opts, host: HTMLElement, log: (s: string) => void): Promise<Row> {
  const blob2 = await bytes(`packages/${id}.mx2`);
  const meta = (await (await fetch(`meta/${id}.json?v=${stamp()}`)).json()) as Meta;
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
    const canvas = canvasIn(host);
    const poser = meta.kin ? kinPoser(new Kinematics(meta.kin as unknown as KinLib), undefined, s.pkg.lifts) : staticPoser;
    const scene = { pkg: s.pkg, meshes: s.meshes, edges: s.edges, poser, teaching: meta.teaching, info: { title: meta.name, no: `MX-${id.toUpperCase()}` } };
    const sess = createSession3(canvas, scene, { factory: browserFactory, w: o.w, h: o.h, dpr: o.dpr });
    const viewOf = (v: StandInView): DrawView3 => recordDrawView(scene, { state: { orient: { yaw: 0, tilt: v.tilt }, explode: v.explode }, detail: v.detail });
    const stand = { draw: (u: number, v: StandInView) => sess.draw(u, viewOf(v)), finish: () => sess.finish(), dispose: () => sess.dispose(), counters: { draws: 0, instances: 0 } };
    stand.draw(1, { tilt: 28, explode: 0, detail: "full" });
    stand.finish();
    const gpu = performance.now() - g0;
    shared = { ms: gpu3(sess.card).buildMs };
    setups.push({ decode: s.ms.decode, tessellate: s.ms.tessellate, caps: s.ms.caps, edges: s.ms.edges, gpu, total: s.ms.decode + s.ms.tessellate + s.ms.edges + gpu });
    if (o.worker && typeof Worker !== "undefined") {
      const w = new Worker(`setup-worker.js?v=${stamp()}`, { type: "module" });
      workers.push((await setupInWorker(w, blob2)).wall);
      w.terminate();
    }
    log(`${id}: run ${run + 1}, frames`);
    for (const [k, v] of VIEWS) (views[k] ??= []).push(await timeFrames((u) => stand.draw(u, { ...v, detail: "full" }), () => stand.finish(), o.frames));
    for (const d of dials) (dial[d] ??= []).push(await timeFrames((u) => stand.draw(u, { tilt: 28, explode: 0, detail: d } satisfies StandInView), () => stand.finish(), Math.max(10, o.frames >> 1)));
    stand.draw(1, { tilt: 28, explode: 0, detail: "full" });
    counts = { solids: s.pkg.solids.length, shapes: s.meshes.length, triangles: s.meshes.reduce((n, m) => n + m.tag.length, 0), edges: s.edges.reduce((n, e) => n + e.n, 0), draws: sess.stats?.draws ?? 0, instances: 0 };
    stand.dispose();
  }
  const pick = (m: Record<string, Timing[]>): Record<string, Timing> =>
    Object.fromEntries(Object.entries(m).map(([k, t]) => [k, { paced: r2(med(t.map((x) => x.paced))), gpu: r2(med(t.map((x) => x.gpu))), cpu: r2(med(t.map((x) => x.cpu))) }]));
  const field = (k: keyof Row["setup"]) => r2(med(setups.map((x) => x[k])));
  const row: Row = {
    id,
    kb: r2(blob2.length / 1024),
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
  return row;
}

/** The targets of standard R6 in ms: a desktop frame, a mid-range phone frame, setup. */
export const FRAME_TARGET = 8;
export const FRAME_PHONE = 16;
export const SETUP_TARGET = 20;

/** The report as Markdown, to paste into the issue. */
export function markdown(r: Report): string {
  const L: string[] = [];
  const d = r.device;
  L.push(`## Bench, package v2`, ``, `${String(d.userAgent)}`, `GPU ${String(d.gpu)}, ${String(d.cores)} cores, ${String(d.memoryGB)} GB, screen ${String(d.screen)}, DPR ${String(d.dpr)}`, `Stage ${r.opts.w} x ${r.opts.h} CSS px at DPR ${r.opts.dpr}; ${r.opts.runs} runs, ${r.opts.frames} frames per view; medians. Frames are drawn by the 3D renderer.`, ``);
  L.push(`Setup, ms. GPU is buffers, sizing and the first frame on the page's shared context; the context and both shader programs were made once, in ${r.contextMs} ms.`, ``);
  L.push(`Setup, ms (decode / tessellate / edges / GPU / total):`, ``, `| Mechanism | KB | solids | shapes | triangles | edges | decode | tessellate (caps) | edges | GPU | total | worker wall | via worker (wall + GPU) |`, `|---|---|---|---|---|---|---|---|---|---|---|---|---|`);
  for (const x of r.rows) L.push(`| ${x.id} | ${x.kb} | ${x.solids} | ${x.shapes} | ${x.triangles} | ${x.edges} | ${x.setup.decode} | ${x.setup.tessellate} (${x.setup.caps}) | ${x.setup.edges} | ${x.setup.gpu} | ${x.setup.total} | ${x.worker?.wall ?? ""} | ${x.worker ? r2(x.worker.wall + x.setup.gpu) : ""} |`);
  const vs = VIEWS.map(([k]) => k);
  L.push(``, `Frames per view, ms (paced / gpu wait / script):`, ``, `| Mechanism | ${vs.join(" | ")} |`, `|---|${vs.map(() => "---").join("|")}|`);
  for (const x of r.rows) L.push(`| ${x.id} | ${vs.map((k) => `${x.views[k]?.paced} / ${x.views[k]?.gpu} / ${x.views[k]?.cpu}`).join(" | ")} |`);
  const ds = Object.keys(r.rows[0]?.dial ?? {});
  L.push(``, `Frame at 28° by dial position, ms (paced / gpu wait):`, ``, `| Mechanism | ${ds.join(" | ")} |`, `|---|${ds.map(() => "---").join("|")}|`);
  for (const x of r.rows) L.push(`| ${x.id} | ${ds.map((k) => `${x.dial[k]?.paced} / ${x.dial[k]?.gpu}`).join(" | ")} |`);
  // R6: over the target is a flag to look at, never a failure
  const flags: string[] = [];
  for (const x of r.rows) {
    if (x.setup.total > SETUP_TARGET) flags.push(`${x.id}: setup ${x.setup.total} ms over the ${SETUP_TARGET} ms target`);
    for (const k of vs) {
      const v = x.views[k];
      if (v && v.gpu > FRAME_TARGET) flags.push(`${x.id}, ${k}: ${v.gpu} ms with a GPU wait over the ${FRAME_TARGET} ms desktop target${v.gpu > FRAME_PHONE ? ` (and the ${FRAME_PHONE} ms phone target)` : ""}`);
    }
  }
  L.push(``, `Flags (R6, not failures; the targets are ${FRAME_TARGET} ms a frame on the desktop, ${FRAME_PHONE} ms on a phone, ${SETUP_TARGET} ms setup):`, ``, ...(flags.length ? flags.map((f) => `- ${f}`) : ["- none"]));
  return L.join("\n") + "\n";
}

export async function run(o: Opts, host: HTMLElement, log: (s: string) => void = () => undefined): Promise<Report> {
  const rows: Row[] = [];
  for (const id of o.ids) rows.push(await one(id, o, host, log));
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
