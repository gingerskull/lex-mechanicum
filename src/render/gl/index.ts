// The solids pass on the GPU (WebGL2). A session's geometry is uploaded once (geometry.ts); a frame is planned on the CPU
// (plan.ts), its tables uploaded, each target drawn in one instanced call, and the frame and the lines layer composited
// onto the session's 2D canvas, where the sheet, dimensions, traces and overlays are drawn over it. Browser only.
import { DRAFT } from "../../style/draft";
import type { theme } from "../../style/theme";
import type { Card } from "../canvas";
import type { Ladder } from "../detail";
import type { Projector } from "../projector";
import type { Slice } from "../slices";
import type { Prepared, World } from "../world";
import { gpu, patterns, Table, targets, type Gpu } from "./context";
import { ITEM_TEXELS, buildItems, refreshItems, type Items } from "./geometry";
import { planFrame, type Heads } from "./plan";
import { PER_ROW, ROW, SROW } from "./shaders";

export { gpuReady, onRestored, loseContext } from "./context";
export type { Heads } from "./plan";

const L = DRAFT.lines;
const WS = DRAFT.fill.wallShade;

/** What one frame cost on the GPU side, for the bench and the stage's readout. */
export interface GpuStats {
  slices: number;
  draws: number;
  instances: number;
  chunks: number;
  items: number;
  samples: number;
  /** Members whose outline was rewritten on the GPU this frame (stretched or deforming), and their items. */
  dyn: number;
  dynItems: number;
  /**
   * How long the GPU had been on the previous frame and was still not done when this one started, ms (0 when it was
   * done): the honest sign of a GPU-bound drawing, whatever the display's rate or the page's scrolling does.
   */
  gpuLagMs: number;
}

/** A session's own GPU state: its items (kept across a lost context) and their textures (one context generation). */
export interface GpuSession {
  items: Items;
  gen: number;
  itemsTex: Table | null;
  staticRows: number;
  holesTex: Table | null;
  stats: GpuStats;
  /** Set after each frame; checked, without waiting, at the next. */
  fence: WebGLSync | null;
  fenceAt: number;
}

/** Everything the solids pass of a frame needs. */
export interface SolidsPass {
  card: Card;
  prepared: Prepared[];
  own: GpuSession | null;
  T: ReturnType<typeof theme>;
  LD: Ladder;
  cardK: { plate: number; base: number };
  Pr: Projector;
  main: CanvasRenderingContext2D;
  /** The frame's slices, sorted far to near. */
  list: Slice<World>[];
}

const unit = (c: readonly number[]) => [c[0]! / 255, c[1]! / 255, c[2]! / 255] as const;

/** The session's items, and their textures for the current context generation. */
function own(f: SolidsPass, g: Gpu | null): GpuSession {
  let o = f.own;
  if (!o) {
    const items = buildItems(f.prepared);
    o = { items, gen: 0, itemsTex: null, staticRows: Math.max(1, Math.ceil(items.data.length / (4 * ROW))), holesTex: null, stats: { slices: 0, draws: 0, instances: 0, chunks: 0, items: items.count, samples: 0, dyn: 0, dynItems: 0, gpuLagMs: 0 }, fence: null, fenceAt: 0 };
  }
  if (g && o.gen !== g.gen) {
    // a new context: the old textures (and fence) went with the old one
    o.gen = g.gen;
    o.fence = null;
    o.itemsTex = new Table(g.gl, ROW);
    o.itemsTex.write(o.items.data, o.items.data.length);
    const H = o.items.holes;
    const holes = new Float32Array((H.length / 2) * 4);
    for (let i = 0; i < H.length / 2; i++) holes.set([H[2 * i]!, H[2 * i + 1]!, 0, 0], 4 * i);
    o.holesTex = new Table(g.gl, SROW);
    o.holesTex.write(holes, holes.length);
  }
  return o;
}

/** Frees a session's textures (a card session let go). */
export function disposeSolids(o: GpuSession | null): void {
  if (!o) return;
  o.itemsTex?.drop();
  o.holesTex?.drop();
  o.itemsTex = o.holesTex = null;
  o.fence = null;
  o.gen = 0;
}

/** Draws the frame's solids onto the card's 2D canvas. Returns the session's GPU state and the joint heads. */
export function drawSolids(f: SolidsPass): { own: GpuSession; heads: Heads } {
  const { card, T, LD, cardK, Pr, main, list } = f;
  const g = gpu(card);
  const o = own(f, g.lost ? null : g);
  // stretched and deforming members: their items rewritten for this frame's outline, in place
  let lo = Infinity;
  let hi = -Infinity;
  let dyn = 0;
  const seen = new Set<Prepared>();
  for (const Sl of list) {
    const w = Sl.w;
    if (!w.local || seen.has(w.p)) continue;
    seen.add(w.p);
    const [a, b] = refreshItems(o.items, w.p, w.local);
    lo = Math.min(lo, a);
    hi = Math.max(hi, b);
    dyn++;
  }
  const plan = planFrame({ list, T, LD, cardK, Pr, items: o.items, dynStart: o.staticRows * PER_ROW });
  o.stats = { slices: list.length, draws: 0, instances: 0, chunks: plan.frame.n + plan.lines.n, items: o.items.count, samples: g.samples, dyn, dynItems: dyn ? hi - lo + 1 : 0, gpuLagMs: 0 };
  // a lost context draws nothing until it is back; onRestored listeners redraw then
  if (g.lost || g.gl.isContextLost() || !o.itemsTex || !o.holesTex) return { own: o, heads: plan.heads };
  const gl = g.gl;
  // is the GPU done with the previous frame?
  if (o.fence) {
    if (gl.getSyncParameter(o.fence, gl.SYNC_STATUS) !== gl.SIGNALED) o.stats.gpuLagMs = performance.now() - o.fenceAt;
    gl.deleteSync(o.fence);
    o.fence = null;
  }

  // the frame's tables: slices, chunks, dash phases, and the screen-space items after the static ones
  g.slices.write(plan.slices, list.length * 12);
  g.chunks[0].write(plan.frame.data, plan.frame.n * 12);
  g.chunks[1].write(plan.lines.data, plan.lines.n * 12);
  g.dash.write(plan.dash, plan.dash.length);
  if (dyn) {
    // the rows holding the rewritten items
    const per = ROW * 4;
    const r0 = Math.floor((lo * ITEM_TEXELS * 4) / per);
    const r1 = Math.floor(((hi + 1) * ITEM_TEXELS * 4 - 1) / per);
    const src = o.items.data.subarray(r0 * per, Math.min(o.items.data.length, (r1 + 1) * per));
    o.itemsTex.write(src, src.length, r0);
  }
  if (plan.dyn.length && o.itemsTex.write(plan.dyn, plan.dyn.length, o.staticRows)) {
    o.itemsTex.write(o.items.data, o.items.data.length);
    o.itemsTex.write(plan.dyn, plan.dyn.length, o.staticRows);
  }

  const cw = card.cw;
  const ch = card.ch;
  const tg = targets(g, cw, ch);
  gl.viewport(0, 0, cw, ch);
  gl.useProgram(g.prog);
  gl.bindVertexArray(g.vao);
  const u = g.u;
  const A0 = Pr.affine(0);
  gl.uniform2f(u.uSize!, card.w, card.h);
  gl.uniform1f(u.uS!, Pr.s);
  gl.uniform1f(u.uCt!, Pr.ct);
  gl.uniform1f(u.uSt!, Pr.st);
  gl.uniform1f(u.uOx!, A0[4]);
  gl.uniform1f(u.uOy!, A0[5]);
  gl.uniform3fv(u.uInk!, unit(T.ink));
  gl.uniform3fv(u.uPaper!, unit(T.paper));
  gl.uniform3fv(u.uAccent!, unit(T[L.accentRing.color]));
  gl.uniform1f(u.uShade!, WS.shade);
  gl.uniform1f(u.uSteps!, WS.steps);
  gl.uniform1f(u.uDash0!, L.hidden.dash[0]);
  gl.uniform1f(u.uDash1!, L.hidden.dash[1]);
  const bind = (n: number, name: string, tex: WebGLTexture, kind: number = gl.TEXTURE_2D) => {
    gl.activeTexture(gl.TEXTURE0 + n);
    gl.bindTexture(kind, tex);
    gl.uniform1i(u[name]!, n);
  };
  bind(0, "uItems", o.itemsTex.tex);
  bind(2, "uSlices", g.slices.tex);
  bind(3, "uHoles", o.holesTex.tex);
  bind(4, "uPat", patterns(g, card), gl.TEXTURE_2D_ARRAY);
  bind(5, "uDash", g.dash.tex);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.GREATER);
  gl.depthMask(true);
  ([plan.frame, plan.lines] as const).forEach((c, i) => {
    gl.bindFramebuffer(gl.FRAMEBUFFER, tg[i]!.msaa);
    gl.clearColor(0, 0, 0, 0);
    gl.clearDepth(0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    if (!c.n) return;
    bind(1, "uChunks", g.chunks[i]!.tex);
    gl.uniform1i(u.uNChunks!, c.n);
    gl.uniform1i(u.uLines!, i);
    gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, c.instances);
    o.stats.draws++;
    o.stats.instances += c.instances;
  });
  gl.disable(gl.DEPTH_TEST);
  // resolve the samples, then the frame and the lines layer over it onto the canvas (its lower left cw x ch)
  for (const t of tg) {
    gl.bindFramebuffer(gl.READ_FRAMEBUFFER, t.msaa);
    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, t.resolve);
    gl.blitFramebuffer(0, 0, cw, ch, 0, 0, cw, ch, gl.COLOR_BUFFER_BIT, gl.NEAREST);
  }
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.useProgram(g.quad);
  gl.uniform3fv(g.qu.uInk!, unit(T.ink));
  gl.uniform3fv(g.qu.uAccent!, unit(T[L.accentRing.color]));
  gl.uniform2f(g.qu.uUv!, cw / g.w, ch / g.h);
  tg.forEach((t, i) => {
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, t.tex);
    gl.uniform1i(g.qu.uTex!, 0);
    gl.uniform1i(g.qu.uLinesLayer!, i);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  });
  main.save();
  main.setTransform(1, 0, 0, 1, 0, 0);
  main.globalAlpha = 1;
  main.globalCompositeOperation = "source-over";
  main.drawImage(g.canvas, 0, g.h - ch, cw, ch, 0, 0, cw, ch);
  main.restore();
  o.fence = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
  o.fenceAt = performance.now();
  gl.flush();
  return { own: o, heads: plan.heads };
}
