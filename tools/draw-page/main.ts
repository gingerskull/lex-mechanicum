// The drawing page: every tool that draws (shot, thumbs, bench, compare, the visual snapshots) loads it in local Chrome
// through tools/chrome.ts and calls the functions it puts on window. Packages come from the page's server (built on
// demand); all drawings on the page share one GPU context, as on the site.
import { models } from "../../src/mechanisms/models";
import { loadPackage } from "../../src/package/loader";
import type { Package } from "../../src/package/format";
import { browserFactory } from "../../src/render/canvas";
import type { Dial } from "../../src/render/detail";
import { cardView, defaultView, type DrawView } from "../../src/render/draft";
import { loseContext } from "../../src/render/gl";
import { createSession, type Session } from "../../src/render/session";
import { countDraws, counts, resetCounts } from "./counters";

/** One drawing: canvas size in CSS px, pixel ratio, phase, and the view over the default (or card) view. */
export interface DrawOptions {
  w: number;
  h: number;
  dpr: number;
  u: number;
  card?: boolean;
  view: Partial<DrawView>;
}

/** An image to write out: "image/png" or "image/webp" with a quality. */
export interface ImageOut {
  type?: "image/png" | "image/webp";
  quality?: number;
}

const packages = new Map<string, Promise<Package>>();
const pkgOf = (id: string) => packages.get(id) ?? packages.set(id, loadPackage(`./packages/${id}.mxp`)).get(id)!;

async function session(id: string, w: number, h: number, dpr: number): Promise<Session> {
  const [model, pkg] = await Promise.all([models[id]!(), pkgOf(id)]);
  const canvas = document.createElement("canvas");
  canvas.id = "stage";
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
  canvas.style.display = "block";
  document.body.replaceChildren(canvas);
  return createSession(canvas, pkg, model, { factory: browserFactory, w, h, dpr });
}

const viewOf = (o: DrawOptions): DrawView => ({ ...(o.card ? cardView() : defaultView()), ...o.view });

/** Draws one frame and returns it as a data URL. */
async function shot(id: string, o: DrawOptions, out: ImageOut = {}): Promise<string> {
  const sess = await session(id, o.w, o.h, o.dpr);
  sess.draw(o.u, viewOf(o));
  const url = (sess.card.canvas as HTMLCanvasElement).toDataURL(out.type ?? "image/png", out.quality);
  sess.dispose();
  return url;
}

/** Draws a frame, loses and restores the GPU context, and returns the frame drawn again through onRestored. */
async function lose(id: string, o: DrawOptions): Promise<string> {
  const sess = await session(id, o.w, o.h, o.dpr);
  sess.draw(o.u, viewOf(o));
  let redrawn = false;
  sess.onRestored = () => {
    sess.draw(o.u, viewOf(o));
    redrawn = true;
  };
  const ctx = sess.card.ctx;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, sess.card.cw, sess.card.ch);
  if (!(await loseContext())) throw new Error("no WEBGL_lose_context");
  if (!redrawn) throw new Error("not redrawn after the context came back");
  const url = (sess.card.canvas as HTMLCanvasElement).toDataURL("image/png");
  sess.dispose();
  return url;
}

const frame = () => new Promise((r) => requestAnimationFrame(r));

/**
 * Frame time as the site sees it: frames drawn back to back on animation frames (Chrome runs with the frame-rate cap
 * off), so the GPU work of each frame is paid before the next one starts. Returns the mean frame interval, the median
 * script time of a draw call, and the counters of one frame. (Reading a pixel back each frame instead stalls Chrome's
 * canvas and gives false costs.)
 */
async function frameMs(sess: Session, draw: (u: number) => void, frames: number): Promise<{ ms: number; cpu: number; counts: Record<string, number> }> {
  for (let i = 0; i < 5; i++) draw(0.3 + i * 0.01);
  resetCounts();
  draw(0.9);
  const st = sess.stats;
  const c: Record<string, number> = { ...counts, solids: sess.drawn, slices: st?.slices ?? 0, glDraws: st?.draws ?? 0, glInstances: st?.instances ?? 0, glChunks: st?.chunks ?? 0, glDyn: st?.dyn ?? 0, glDynItems: st?.dynItems ?? 0 };
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

export interface BenchResult {
  id: string;
  samples: number;
  setupMs: number;
  views: Record<string, number>;
  cpu: Record<string, number>;
  dial: Record<string, number>;
  counters: Record<string, Record<string, number>>;
}

const VIEWS = [["plan", { tilt: 0 }], ["28", { tilt: 28 }], ["side", { tilt: 88 }], ["explode", { tilt: 70, explode: 1 }]] as const;

/** Frame times of one mechanism per view and, at 28°, per dial position. */
async function bench(id: string, o: { w: number; h: number; dpr: number; frames: number; dials: Dial[] }): Promise<BenchResult> {
  await pkgOf(id);
  const t0 = performance.now();
  const sess = await session(id, o.w, o.h, o.dpr);
  const base = (v: Partial<DrawView>): DrawView => ({ ...defaultView(), dims: true, sheet: { title: id, no: `MX-${id.toUpperCase()}` }, overlays: { paths: true }, ...v });
  sess.draw(1, base({}));
  const setupMs = +(performance.now() - t0).toFixed(2);
  const views: Record<string, number> = {};
  const cpu: Record<string, number> = {};
  const counters: Record<string, Record<string, number>> = {};
  for (const [k, v] of VIEWS) {
    const r = await frameMs(sess, (u) => sess.draw(u, base(v)), o.frames);
    views[k] = r.ms;
    cpu[k] = r.cpu;
    counters[k] = r.counts;
  }
  const dial: Record<string, number> = {};
  for (const d of o.dials) dial[d] = (await frameMs(sess, (u) => sess.draw(u, base({ tilt: 28, detail: d })), o.frames)).ms;
  const samples = sess.stats?.samples ?? 0;
  sess.dispose();
  return { id, samples, setupMs, views, cpu, dial, counters };
}

/** Lays images out on a white sheet: one row per row, labels above, each cell scaled to w x h. Returns a PNG data URL. */
async function compose(g: { w: number; h: number; pad: number; columns: string[]; rows: { label: string; cells: (string | null)[] }[] }): Promise<string> {
  const c = document.createElement("canvas");
  const n = Math.max(...g.rows.map((r) => r.cells.length), g.columns.length);
  c.width = g.pad + n * (g.w + 6);
  c.height = g.pad + g.rows.length * (g.h + g.pad);
  const x = c.getContext("2d")!;
  x.fillStyle = "white";
  x.fillRect(0, 0, c.width, c.height);
  x.fillStyle = "black";
  x.font = "16px sans-serif";
  g.columns.forEach((t, i) => x.fillText(t, g.pad + i * (g.w + 6) + 4, 20));
  for (const [k, r] of g.rows.entries()) {
    const y = g.pad + k * (g.h + g.pad);
    x.fillStyle = "black";
    x.fillText(r.label, g.pad + 4, y + 18);
    for (const [i, url] of r.cells.entries()) {
      if (!url) continue;
      const img = new Image();
      img.src = url;
      await img.decode();
      x.drawImage(img, g.pad + i * (g.w + 6), y + g.pad - 4, g.w, g.h);
    }
  }
  return c.toDataURL("image/png");
}

/** Pixels of two images (data URLs, same size) whose channels differ by more than `tolerance` of 255. */
async function differ(a: string, b: string, tolerance: number): Promise<number> {
  const px = async (u: string) => {
    const img = new Image();
    img.src = u;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    const x = c.getContext("2d", { willReadFrequently: true })!;
    x.drawImage(img, 0, 0);
    return x.getImageData(0, 0, c.width, c.height).data;
  };
  const [A, B] = await Promise.all([px(a), px(b)]);
  if (A.length !== B.length) return Infinity;
  let n = 0;
  for (let i = 0; i < A.length; i += 4)
    if (Math.max(Math.abs(A[i]! - B[i]!), Math.abs(A[i + 1]! - B[i + 1]!), Math.abs(A[i + 2]! - B[i + 2]!), Math.abs(A[i + 3]! - B[i + 3]!)) > tolerance * 255) n++;
  return n;
}

/** The GPU's name, for reports. */
function gpu(): string {
  const gl = document.createElement("canvas").getContext("webgl2");
  const x = gl?.getExtension("WEBGL_debug_renderer_info");
  return x ? String(gl!.getParameter(x.UNMASKED_RENDERER_WEBGL)) : gl ? "unknown" : "no WebGL2";
}

const api = { shot, lose, bench, compose, differ, gpu };
export type DrawPage = typeof api;
Object.assign(window, { draw: api });
// the canvas lettering needs the Plex faces loaded before the first frame
void Promise.all([...document.fonts].map((f) => f.load())).then(
  () => (document.title = "ready"),
  (e: unknown) => (document.title = `error: ${String(e)}`),
);
