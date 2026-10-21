// The solids pass on the GPU (WebGL2), browser only. One context serves the whole page (R9): the three programs are
// compiled once, the role pattern layers made once, and the render targets (up to four peeled layers and the output) grown
// to the largest canvas drawn. A session's geometry is uploaded once into a `Geometry`; a frame writes the solid table (the
// poses, styles and flags), peels, composites and draws the lines, and the result is read by the session's 2D canvas.
// A lost context is rebuilt when the browser gives it back: sessions see the new generation, upload again, and whoever
// listens with onRestored redraws.
import { DRAFT } from "../../style/draft";
import type { ResolvedTheme } from "../../style/theme";
import { MARK_KINDS } from "../../style/kinds";
import type { Card, CanvasFactory } from "../canvas";
import { tile } from "../patterns";
import { EF2, VF, type Baked } from "./bake";
import type { Camera } from "./camera";
import { PATTERNS, ST } from "./scene";
import { COMP_FRAG, LINE_FRAG, LINE_VERT, PEEL_FRAG, PEEL_VERT, QUAD_VERT, TABLE_W } from "./shaders";

const L = DRAFT.lines;
const WS = DRAFT.fill.wallShade;
const MAX_LAYERS = 4;

type U = Record<string, WebGLUniformLocation | null>;

interface Layer {
  fb: WebGLFramebuffer;
  c: WebGLTexture;
  m: WebGLTexture;
  d: WebGLTexture;
}

export interface Gpu3 {
  gl: WebGL2RenderingContext;
  canvas: HTMLCanvasElement;
  /** Bumped on every rebuild after a lost context; a session's uploads belong to one generation. */
  gen: number;
  lost: boolean;
  peel: WebGLProgram;
  comp: WebGLProgram;
  line: WebGLProgram;
  up: U;
  uc: U;
  ul: U;
  patTex: WebGLTexture | null;
  /** Size of the targets (device px): the largest drawn so far. */
  w: number;
  h: number;
  layers: Layer[];
  out: { fb: WebGLFramebuffer; t: WebGLTexture } | null;
  /** Shader compile and link time of the first context, ms (R6: once per page). */
  buildMs: number;
}

let G: Gpu3 | null = null;
const listeners = new Set<() => void>();

/** Calls `f` after a lost context is rebuilt, so a drawing that is not animating redraws. Returns the unsubscribe. */
export function onRestored(f: () => void): () => void {
  listeners.add(f);
  return () => listeners.delete(f);
}

/** Submits a program: compiles both shaders and links, without asking for the result yet. */
function submit(gl: WebGL2RenderingContext, vs: string, fs: string): { p: WebGLProgram; shaders: WebGLShader[] } {
  const p = gl.createProgram()!;
  const shaders: WebGLShader[] = [];
  for (const [type, src] of [[gl.VERTEX_SHADER, vs], [gl.FRAGMENT_SHADER, fs]] as const) {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    gl.attachShader(p, s);
    shaders.push(s);
  }
  gl.linkProgram(p);
  return { p, shaders };
}

/** Asks for the result of a submitted program (this waits for the driver) and throws on an error. */
function settle(gl: WebGL2RenderingContext, { p, shaders }: { p: WebGLProgram; shaders: WebGLShader[] }): WebGLProgram {
  for (const s of shaders) if (!gl.getShaderParameter(s, gl.COMPILE_STATUS) && !gl.isContextLost()) throw new Error(`render: shader: ${gl.getShaderInfoLog(s)}`);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS) && !gl.isContextLost()) throw new Error(`render: link: ${gl.getProgramInfoLog(p)}`);
  return p;
}

function uniforms(gl: WebGL2RenderingContext, p: WebGLProgram): U {
  const u: U = {};
  const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS) as number;
  for (let i = 0; i < n; i++) {
    // an array's location is its first element's; a plain uniform keeps its own name
    const full = gl.getActiveUniform(p, i)!.name;
    const name = full.replace(/\[0\]$/, "");
    u[name] = gl.getUniformLocation(p, full);
  }
  return u;
}

function build(gl: WebGL2RenderingContext, canvas: HTMLCanvasElement, gen: number): Gpu3 {
  const t0 = performance.now();
  // all three programs are handed to the driver before the first result is asked for, and with
  // KHR_parallel_shader_compile on they build on the driver's own threads at the same time
  gl.getExtension("KHR_parallel_shader_compile");
  const sp = submit(gl, PEEL_VERT, PEEL_FRAG);
  const sc = submit(gl, QUAD_VERT, COMP_FRAG);
  const sl = submit(gl, LINE_VERT, LINE_FRAG);
  const peel = settle(gl, sp);
  const comp = settle(gl, sc);
  const line = settle(gl, sl);
  return { gl, canvas, gen, lost: false, peel, comp, line, up: uniforms(gl, peel), uc: uniforms(gl, comp), ul: uniforms(gl, line), patTex: null, w: 0, h: 0, layers: [], out: null, buildMs: performance.now() - t0 };
}

/** The shared context, made on first use with the card's canvas factory. Throws where there is no WebGL2. */
export function gpu3(card: Card): Gpu3 {
  if (G) return G;
  const canvas = card.f.canvas(1, 1) as unknown as HTMLCanvasElement;
  const gl = (canvas as { getContext?: HTMLCanvasElement["getContext"] }).getContext?.("webgl2", { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false }) as WebGL2RenderingContext | null | undefined;
  if (!gl) throw new Error("render: WebGL2 is not available");
  if (!gl.getExtension("EXT_color_buffer_float")) gl.getExtension("EXT_color_buffer_half_float");
  const g = build(gl, canvas, 1);
  canvas.addEventListener("webglcontextlost", (e) => {
    e.preventDefault();
    if (G) G.lost = true;
  });
  canvas.addEventListener("webglcontextrestored", () => {
    G = build(gl, canvas, (G?.gen ?? 0) + 1);
    for (const f of listeners) f();
  });
  G = g;
  return g;
}

/** Makes the shared context and builds its programs now, so a page does it while its data loads (R9). */
export const warm3 = (f: CanvasFactory): Gpu3 => gpu3({ f } as unknown as Card);

/** False while the shared context is lost: a frame then keeps the image it has, and redraws once onRestored fires. */
export const gpuReady = (card: Card): boolean => {
  const g = gpu3(card);
  return !g.lost && !g.gl.isContextLost();
};

/** Loses and restores the shared context (WEBGL_lose_context), to check the rebuild. Resolves once restored. */
export async function loseContext(): Promise<boolean> {
  const x = G?.gl.getExtension("WEBGL_lose_context");
  if (!G || !x) return false;
  const restored = new Promise<void>((ok) => {
    const off = onRestored(() => {
      off();
      ok();
    });
  });
  x.loseContext();
  await new Promise((r) => setTimeout(r, 50));
  x.restoreContext();
  await restored;
  return true;
}

function tex(gl: WebGL2RenderingContext, w: number, h: number, internal: number, format: number, type: number): WebGLTexture {
  const t = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, t);
  gl.texImage2D(gl.TEXTURE_2D, 0, internal, w, h, 0, format, type, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  return t;
}

/** The targets and the canvas at least w x h device px. */
function targets(g: Gpu3, w: number, h: number): void {
  if (g.out && w <= g.w && h <= g.h) return;
  const gl = g.gl;
  for (const l of g.layers) {
    gl.deleteFramebuffer(l.fb);
    for (const t of [l.c, l.m, l.d]) gl.deleteTexture(t);
  }
  if (g.out) {
    gl.deleteFramebuffer(g.out.fb);
    gl.deleteTexture(g.out.t);
  }
  g.w = Math.max(w, g.w);
  g.h = Math.max(h, g.h);
  g.canvas.width = g.w;
  g.canvas.height = g.h;
  g.layers = Array.from({ length: MAX_LAYERS }, () => {
    const fb = gl.createFramebuffer()!;
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    const c = tex(gl, g.w, g.h, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE);
    const m = tex(gl, g.w, g.h, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE);
    const d = tex(gl, g.w, g.h, gl.DEPTH_COMPONENT32F, gl.DEPTH_COMPONENT, gl.FLOAT);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, c, 0);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT1, gl.TEXTURE_2D, m, 0);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, d, 0);
    gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1]);
    return { fb, c, m, d };
  });
  const fb = gl.createFramebuffer()!;
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
  const t = tex(gl, g.w, g.h, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0);
  g.out = { fb, t };
}

/** The role pattern layers, white on clear, drawn once per context from the card's canvas factory. */
function patterns(g: Gpu3, card: Card): WebGLTexture {
  if (g.patTex) return g.patTex;
  const gl = g.gl;
  const t = gl.createTexture()!;
  const T = DRAFT.pattern.tile;
  gl.bindTexture(gl.TEXTURE_2D_ARRAY, t);
  gl.texImage3D(gl.TEXTURE_2D_ARRAY, 0, gl.RGBA8, T, T, PATTERNS.length, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  PATTERNS.forEach((k, i) => gl.texSubImage3D(gl.TEXTURE_2D_ARRAY, 0, 0, 0, i, T, T, 1, gl.RGBA, gl.UNSIGNED_BYTE, tile(card, k, [255, 255, 255]) as unknown as HTMLCanvasElement));
  // no mipmaps: they wash the dots out
  gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_T, gl.REPEAT);
  g.patTex = t;
  return t;
}

/** What one frame cost, for the bench and the stage's readout. */
export interface Stats3 {
  tris: number;
  edges: number;
  layers: number;
  draws: number;
  /** How long the GPU was still busy with the previous frame when this one started (a fence), ms: the adaptive dial's measure (DL4). */
  gpuLagMs: number;
}

/** What a frame needs besides the solid table. */
export interface PassInput {
  card: Card;
  cam: Camera;
  /** Canvas size in device px and the pixel ratio. */
  cw: number;
  ch: number;
  dpr: number;
  T: ResolvedTheme;
  /** Depth layers to peel, 1 to 4. */
  layers: number;
  hidden: boolean;
  patterns: boolean;
  shade: boolean;
  /** A section plane, [nx, ny, nz, d]: what has n . p + d > 0 is cut away. Null for none. */
  clip: [number, number, number, number] | null;
  /** The mark kinds drawn, as a bit mask over MARK_KINDS index + 1. */
  markMask: number;
}

const unit = (c: readonly number[]) => [c[0]! / 255, c[1]! / 255, c[2]! / 255];

/** A session's geometry on the GPU: the vertex and edge buffers and the solid table, of one context generation. */
export class Geometry {
  readonly gen: number;
  readonly stats: Stats3;
  private vao: WebGLVertexArrayObject;
  private evao: WebGLVertexArrayObject;
  private buffers: WebGLBuffer[] = [];
  private tableTex: WebGLTexture;
  private rows: number;
  private px = new Uint8Array(4);
  private fence: WebGLSync | null = null;
  private fenceAt = 0;

  constructor(readonly g: Gpu3, readonly baked: Baked, readonly n: number) {
    const gl = g.gl;
    this.gen = g.gen;
    this.stats = { tris: baked.nVerts / 3, edges: baked.nEdges, layers: 0, draws: 0, gpuLagMs: 0 };
    this.vao = gl.createVertexArray()!;
    gl.bindVertexArray(this.vao);
    const vb = gl.createBuffer()!;
    this.buffers.push(vb);
    gl.bindBuffer(gl.ARRAY_BUFFER, vb);
    gl.bufferData(gl.ARRAY_BUFFER, baked.verts.subarray(0, baked.nVerts * VF), gl.STATIC_DRAW);
    for (const [name, size, off] of [["aPos", 3, 0], ["aNrm", 3, 12], ["aMeta", 2, 24]] as const) {
      const loc = gl.getAttribLocation(g.peel, name);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, VF * 4, off);
    }
    this.evao = gl.createVertexArray()!;
    gl.bindVertexArray(this.evao);
    const eb = gl.createBuffer()!;
    this.buffers.push(eb);
    gl.bindBuffer(gl.ARRAY_BUFFER, eb);
    gl.bufferData(gl.ARRAY_BUFFER, baked.edges.subarray(0, baked.nEdges * EF2), gl.STATIC_DRAW);
    for (const [name, size, off] of [["aA", 4, 0], ["aB", 4, 16], ["aN1", 4, 32], ["aN2", 4, 48], ["aSol", 2, 64]] as const) {
      const loc = gl.getAttribLocation(g.line, name);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, EF2 * 4, off);
      gl.vertexAttribDivisor(loc, 1);
    }
    gl.bindVertexArray(null);
    this.rows = Math.max(1, Math.ceil((n * ST) / TABLE_W));
    this.tableTex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, this.tableTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, TABLE_W, this.rows, 0, gl.RGBA, gl.FLOAT, null);
    for (const k of [gl.TEXTURE_MIN_FILTER, gl.TEXTURE_MAG_FILTER]) gl.texParameteri(gl.TEXTURE_2D, k, gl.NEAREST);
  }

  /** Size of the float array a solid table needs (rows of TABLE_W texels). */
  get tableLength(): number {
    return this.rows * TABLE_W * 4;
  }

  private common(u: U, p: PassInput) {
    const gl = this.g.gl;
    const C = p.cam;
    gl.uniform2f(u.uSize!, p.cw / p.dpr, p.ch / p.dpr);
    gl.uniform1f(u.uS!, C.s);
    gl.uniform1f(u.uOx!, C.ox);
    gl.uniform1f(u.uOy!, C.oy);
    gl.uniform3fv(u.uRight!, C.right);
    gl.uniform3fv(u.uUp!, C.up);
    gl.uniform3fv(u.uEye!, C.eye);
    gl.uniform1f(u.uD0!, C.d0);
    gl.uniform1f(u.uD1!, C.d1);
    gl.uniform4fv(u.uClip!, p.clip ?? [0, 0, 0, 0]);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.tableTex);
    gl.uniform1i(u.uSolids!, 0);
  }

  /** Draws the frame into the shared canvas (device px, top left). `table` is the solid table of this frame. */
  draw(p: PassInput, table: Float32Array): void {
    const { g, stats } = this;
    const gl = g.gl;
    const K = Math.max(1, Math.min(MAX_LAYERS, p.layers));
    targets(g, p.cw, p.ch);
    patterns(g, p.card);
    stats.draws = 0;
    // is the GPU done with the previous frame?
    stats.gpuLagMs = 0;
    if (this.fence) {
      if (gl.getSyncParameter(this.fence, gl.SYNC_STATUS) !== gl.SIGNALED) stats.gpuLagMs = performance.now() - this.fenceAt;
      gl.deleteSync(this.fence);
      this.fence = null;
    }
    gl.bindTexture(gl.TEXTURE_2D, this.tableTex);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, TABLE_W, this.rows, gl.RGBA, gl.FLOAT, table);
    gl.viewport(0, 0, p.cw, p.ch);
    gl.disable(gl.BLEND);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LESS);
    gl.depthMask(true);
    gl.useProgram(g.peel);
    this.common(g.up, p);
    const up = g.up;
    gl.uniform3fv(up.uInk!, unit(p.T.ink));
    gl.uniform3fv(up.uPaper!, unit(p.T.paper));
    gl.uniform1f(up.uSteps!, WS.steps);
    gl.uniform1f(up.uShade!, p.shade ? WS.shade : 0);
    gl.uniform1f(up.uPatGain!, p.patterns ? p.T.patternGain : 0);
    gl.uniform1f(up.uMinStep!, DRAFT.minPx / p.cam.s);
    gl.uniform1f(up.uPatOff!, DRAFT.pattern.offBelowCos);
    gl.uniform1f(up.uHatch!, DRAFT.section.hatch.pitch * p.dpr * Math.SQRT2);
    gl.uniform1f(up.uHatchW!, DRAFT.section.hatch.width * p.dpr * Math.SQRT2);
    gl.uniform1f(up.uCapA!, DRAFT.fill.plate);
    gl.uniform1f(up.uHatchA!, DRAFT.section.hatch.alpha);
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D_ARRAY, g.patTex);
    gl.uniform1i(up.uPat!, 2);
    gl.bindVertexArray(this.vao);
    for (let k = 0; k < K; k++) {
      const l = g.layers[k]!;
      gl.bindFramebuffer(gl.FRAMEBUFFER, l.fb);
      gl.clearBufferfv(gl.COLOR, 0, [0, 0, 0, 0]);
      gl.clearBufferfv(gl.COLOR, 1, [0, 0, 0, 0]);
      gl.clearBufferfi(gl.DEPTH_STENCIL, 0, 1, 0);
      gl.uniform1i(up.uLayer!, k);
      gl.activeTexture(gl.TEXTURE1);
      // layer 0 reads nothing; the previous layer's colour texture stands in so no texture is its own target
      gl.bindTexture(gl.TEXTURE_2D, k ? g.layers[k - 1]!.d : g.layers[1]!.c);
      gl.uniform1i(up.uPrev!, 1);
      gl.drawArrays(gl.TRIANGLES, 0, this.baked.nVerts);
      stats.draws++;
    }
    gl.disable(gl.DEPTH_TEST);
    // composite the layers front to back
    gl.bindFramebuffer(gl.FRAMEBUFFER, g.out!.fb);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(g.comp);
    gl.bindVertexArray(null);
    for (let k = 0; k < 4; k++) {
      gl.activeTexture(gl.TEXTURE3 + k);
      gl.bindTexture(gl.TEXTURE_2D, g.layers[Math.min(k, K - 1)]!.c);
      gl.uniform1i(g.uc[`uC${k}`]!, 3 + k);
      gl.activeTexture(gl.TEXTURE7 + k);
      gl.bindTexture(gl.TEXTURE_2D, g.layers[Math.min(k, K - 1)]!.m);
      gl.uniform1i(g.uc[`uN${k}`]!, 7 + k);
    }
    gl.uniform1i(g.uc.uK!, K);
    gl.uniform3fv(g.uc.uInk!, unit(p.T.ink));
    gl.uniform1f(g.uc.uSection!, p.clip ? 1 : 0);
    gl.uniform1f(g.uc.uOutline!, Math.max(1, Math.round((DRAFT.section.outline.width * p.dpr) / 2)));
    gl.uniform1f(g.uc.uOutlineA!, DRAFT.section.outline.alpha);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    stats.draws++;
    // the lines over it
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.useProgram(g.line);
    const ul = g.ul;
    this.common(ul, p);
    for (let k = 0; k < 4; k++) {
      const l = g.layers[Math.min(k, K - 1)]!;
      gl.activeTexture(gl.TEXTURE3 + k);
      gl.bindTexture(gl.TEXTURE_2D, l.d);
      gl.uniform1i(ul[`uD${k}t`]!, 3 + k);
      gl.activeTexture(gl.TEXTURE7 + k);
      gl.bindTexture(gl.TEXTURE_2D, l.m);
      gl.uniform1i(ul[`uM${k}`]!, 7 + k);
    }
    gl.uniform1i(ul.uK!, K);
    gl.uniform3fv(ul.uInk!, unit(p.T.ink));
    gl.uniform3fv(ul.uAccent!, unit(p.T[DRAFT.lines.accentRing.color]));
    gl.uniform1f(ul.uDash0!, L.hidden.dash[0]);
    gl.uniform1f(ul.uDash1!, L.hidden.dash[1]);
    // an edge's own faces sit at its depth: a margin in clip depth per mm of depth range
    const perMm = 1 / (p.cam.d1 - p.cam.d0);
    gl.uniform1f(ul.uEps!, DRAFT.peel.edgeEps * perMm);
    gl.uniform1f(ul.uEpsOwn!, (DRAFT.peel.ownPx / p.cam.s + DRAFT.peel.ownEps) * perMm);
    gl.uniform1f(ul.uDpr!, p.dpr);
    gl.uniform1f(ul.uHidden!, p.hidden ? 1 : 0);
    gl.uniform1i(ul.uMarkMask!, p.markMask);
    const mk = new Float32Array(32);
    MARK_KINDS.forEach((kind, i) => {
      const [w, a] = kind === "chamfer" ? [L.chamfer, L.chamferAlpha] : kind === "thread" ? [L.thread, L.threadAlpha] : [L.marks, L.marksAlpha];
      mk[(i + 1) * 2] = w;
      mk[(i + 1) * 2 + 1] = a;
    });
    gl.uniform2fv(ul.uMark!, mk);
    gl.uniform2f(ul.uBaseGain!, L.baseMarksGain, L.baseChamferGain);
    gl.bindVertexArray(this.evao);
    gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, this.baked.nEdges);
    stats.draws++;
    gl.bindVertexArray(null);
    gl.disable(gl.BLEND);
    // to the canvas: the drawing sits at its top left
    gl.bindFramebuffer(gl.READ_FRAMEBUFFER, g.out!.fb);
    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
    gl.blitFramebuffer(0, 0, p.cw, p.ch, 0, g.h - p.ch, p.cw, g.h, gl.COLOR_BUFFER_BIT, gl.NEAREST);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    stats.layers = K;
    this.fence = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    this.fenceAt = performance.now();
  }

  /** Waits for the GPU: a one-pixel read-back (the bench's "gpu" time). */
  finish(): void {
    const gl = this.g.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, this.px);
  }

  dispose(): void {
    const gl = this.g.gl;
    if (this.g.gen !== this.gen || gl.isContextLost()) return;
    if (this.fence) gl.deleteSync(this.fence);
    this.fence = null;
    for (const b of this.buffers) gl.deleteBuffer(b);
    gl.deleteVertexArray(this.vao);
    gl.deleteVertexArray(this.evao);
    gl.deleteTexture(this.tableTex);
  }
}
