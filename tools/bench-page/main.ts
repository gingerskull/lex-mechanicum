// The browser bench (tools/bench.ts --browser): draws each packaged mechanism on a 1393 x 870 stage at the page's DPR
// and reports frame times per view and dial position in window.__bench.
import { models } from "../../src/mechanisms/models";
import { loadPackage } from "../../src/package/loader";
import { browserFactory } from "../../src/render/canvas";
import type { Dial } from "../../src/render/detail";
import { defaultView, type DrawView } from "../../src/render/draft";
import { createSession } from "../../src/render/session";
import { DETAIL } from "../../src/style/detail";

const W = 1393;
const H = 870;
const FRAMES = 60;

async function frameMs(draw: (u: number) => void): Promise<number> {
  for (let i = 0; i < 5; i++) draw(0.3 + i * 0.01);
  const t: number[] = [];
  for (let i = 0; i < FRAMES; i++) {
    const t0 = performance.now();
    draw(1 + i * 0.05);
    t.push(performance.now() - t0);
    if (i % 10 === 0) await new Promise((r) => setTimeout(r, 0));
  }
  t.sort((a, b) => a - b);
  return +t[Math.floor(t.length / 2)]!.toFixed(2);
}

async function run() {
  const ids = (new URLSearchParams(location.search).get("ids") ?? Object.keys(models).join(",")).split(",");
  const dpr = Number(new URLSearchParams(location.search).get("dpr") ?? devicePixelRatio);
  const out: unknown[] = [];
  for (const id of ids) {
    const model = await models[id]!();
    const t0 = performance.now();
    const pkg = await loadPackage(`./${id}.mxp`);
    const loadMs = performance.now() - t0;
    const canvas = document.createElement("canvas");
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    document.body.append(canvas);
    const t1 = performance.now();
    const sess = createSession(canvas, pkg, model, { factory: browserFactory, w: W, h: H, dpr });
    const setupMs = performance.now() - t1;
    const base: DrawView = { ...defaultView(), dims: true, sheet: { title: id, no: id }, overlays: { paths: true } };
    const views: Record<string, number> = {};
    for (const [k, v] of [["plan", { tilt: 0 }], ["28", { tilt: 28 }], ["side", { tilt: 88 }], ["explode", { tilt: 70, explode: 1 }]] as const)
      views[k] = await frameMs((u) => sess.draw(u, { ...base, ...v }));
    const dial: Record<string, number> = {};
    for (const d of ["full", ...DETAIL.map((r) => r.id)] as Dial[]) dial[d] = await frameMs((u) => sess.draw(u, { ...base, detail: d }));
    out.push({ id, dpr, loadMs: +loadMs.toFixed(2), setupMs: +setupMs.toFixed(2), views, dial });
  }
  (window as unknown as { __bench: unknown }).__bench = out;
  document.title = "bench done";
}

void run();
