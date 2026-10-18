// The browser bench and shot page, driven by tools/compare.ts (built by tools/bench-page/build.ts). Query:
//   ?mode=shot&id=four-bar&tilt=28&explode=0&theme=dark&dpr=1.5&detail=full   one frame on the page, then title "ready"
//   ?mode=shot&card=1&id=four-bar&theme=dark&detail=D                          a library card drawing
//   ?mode=shot&lose=1&id=four-bar                                              the same frame after a lost GPU context
//   ?mode=bench&ids=four-bar,spur-gears&dpr=1.5&frames=40&dials=full,A,B      frame times per view and dial position,
//                                                                              with draw counters, in window.__bench
import { models } from "../../src/mechanisms/models";
import { loadPackage } from "../../src/package/loader";
import { browserFactory } from "../../src/render/canvas";
import type { Dial } from "../../src/render/detail";
import { cardView, defaultView, type DrawView } from "../../src/render/draft";
import { loseContext } from "../../src/render/gl";
import { createSession, type Session } from "../../src/render/session";
import type { ThemeKey } from "../../src/style/tokens";
import { countDraws, counts, resetCounts } from "./counters";

const W = 1393;
const H = 870;
const q = new URLSearchParams(location.search);
const dpr = Number(q.get("dpr") ?? devicePixelRatio);

const VIEWS = [["plan", { tilt: 0 }], ["28", { tilt: 28 }], ["side", { tilt: 88 }], ["explode", { tilt: 70, explode: 1 }]] as const;

async function session(id: string, w = W, h = H, d = dpr): Promise<Session> {
  const model = await models[id]!();
  const pkg = await loadPackage(`./${id}.mxp`);
  const canvas = document.createElement("canvas");
  canvas.id = "stage";
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
  canvas.style.display = "block";
  document.body.replaceChildren(canvas);
  return createSession(canvas, pkg, model, { factory: browserFactory, w, h, dpr: d });
}

const view = (id: string, v: Partial<DrawView>): DrawView => ({ ...defaultView(), dims: true, sheet: { title: id, no: `MX-${id.toUpperCase()}` }, overlays: { paths: true }, ...v });

const frame = () => new Promise((r) => requestAnimationFrame(r));

/**
 * Frame time as the site sees it: frames drawn back to back on animation frames (the bench runs with the frame-rate
 * cap off), so the GPU work of each frame is paid before the next one starts. Returns the mean frame interval, the
 * median script time of a draw call, and the counters of one frame. (Reading a pixel back each frame instead stalls
 * Chrome's canvas and gives false costs.)
 */
async function frameMs(sess: Session, draw: (u: number) => void, frames: number): Promise<{ ms: number; cpu: number; counts: Record<string, number> }> {
  for (let i = 0; i < 5; i++) draw(0.3 + i * 0.01);
  resetCounts();
  draw(0.9);
  const st = sess.stats;
  const c: Record<string, number> = { ...counts, solids: sess.drawn, slices: st?.slices ?? 0, glDraws: st?.draws ?? 0, glInstances: st?.instances ?? 0, glChunks: st?.chunks ?? 0 };
  countDraws(false);
  const cpu: number[] = [];
  await frame();
  await frame();
  const t0 = performance.now();
  for (let i = 0; i < frames; i++) {
    await frame();
    const a = performance.now();
    draw(1 + i * 0.05);
    cpu.push(performance.now() - a);
  }
  await frame();
  const ms = (performance.now() - t0) / (frames + 1);
  countDraws(true);
  cpu.sort((a, b) => a - b);
  return { ms: +ms.toFixed(2), cpu: +(cpu[cpu.length >> 1] ?? 0).toFixed(2), counts: c };
}

async function bench() {
  const ids = (q.get("ids") ?? "four-bar,spur-gears").split(",");
  const frames = Number(q.get("frames") ?? 60);
  const dials = (q.get("dials") ?? "full,A,B,C,D,E,F,G,H").split(",") as Dial[];
  const out: unknown[] = [];
  for (const id of ids) {
    const sess = await session(id);
    const views: Record<string, number> = {};
    const cpu: Record<string, number> = {};
    const counters: Record<string, Record<string, number>> = {};
    for (const [k, v] of VIEWS) {
      const res = await frameMs(sess, (u) => sess.draw(u, view(id, v)), frames);
      views[k] = res.ms;
      cpu[k] = res.cpu;
      counters[k] = res.counts;
    }
    const dial: Record<string, number> = {};
    for (const d of dials) dial[d] = (await frameMs(sess, (u) => sess.draw(u, view(id, { tilt: 28, detail: d })), frames)).ms;
    out.push({ id, dpr, samples: sess.stats?.samples ?? 0, views, cpu, dial, counters });
    sess.dispose();
  }
  (window as unknown as { __bench: unknown }).__bench = out;
  document.title = "bench done";
}

async function shot() {
  const id = q.get("id") ?? "four-bar";
  const theme = (q.get("theme") ?? "dark") as ThemeKey;
  // ?card=1: a library card drawing (tools/thumbs.ts THUMB: 320 x 240 at DPR 2, phase 1.1, tilt 28, no sheet)
  if (q.get("card")) {
    const sess = await session(id, 320, 240, 2);
    sess.draw(1.1, { ...cardView(), tilt: 28, theme, sheet: null, dims: false, overlays: { paths: true }, ...(q.get("detail") ? { detail: q.get("detail") as Dial } : {}) });
    document.title = "ready";
    return;
  }
  const sess = await session(id);
  const v: Partial<DrawView> = {
    tilt: Number(q.get("tilt") ?? 28),
    explode: Number(q.get("explode") ?? 0),
    theme,
    detail: (q.get("detail") ?? "full") as Dial,
  };
  const u = Number(q.get("u") ?? 1.1);
  sess.draw(u, view(id, v));
  if (q.get("lose")) {
    // the rebuilt context must draw the same frame again, unasked by the page beyond the onRestored hook
    let redrawn = false;
    sess.onRestored = () => {
      sess.draw(u, view(id, v));
      redrawn = true;
    };
    const ctx = sess.card.ctx;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, sess.card.cw, sess.card.ch);
    if (!(await loseContext())) throw new Error("no WEBGL_lose_context");
    if (!redrawn) throw new Error("not redrawn after the context came back");
  }
  document.title = "ready";
}

void (q.get("mode") === "shot" ? shot() : bench()).catch((e: unknown) => {
  document.title = `error: ${String(e)}`;
  console.error(e);
});
