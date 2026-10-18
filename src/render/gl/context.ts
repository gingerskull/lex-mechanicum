// The page's one WebGL2 context, shared by every drawing session (the stage and all cards): the programs, the role
// pattern layers, the per-frame tables and the two render targets (the frame and the lines layer), grown to the largest
// canvas drawn. A lost context (a driver reset, a sleeping GPU) is rebuilt when the browser gives it back; sessions see
// the new generation, upload their geometry again, and whoever listens with onRestored redraws.
import { DRAFT } from "../../style/draft";
import type { Card } from "../canvas";
import { tile } from "../patterns";
import { PATTERNS } from "./plan";
import { FRAG, QUAD_FRAG, QUAD_VERT, VERT } from "./shaders";

interface Target {
  msaa: WebGLFramebuffer;
  resolve: WebGLFramebuffer;
  tex: WebGLTexture;
  rbs: WebGLRenderbuffer[];
}

/** A float texture of `w` texels per row that grows when a write does not fit (the earlier rows are then lost). */
export class Table {
  tex: WebGLTexture;
  rows = 0;
  constructor(
    private gl: WebGL2RenderingContext,
    private w: number,
    private red = false,
  ) {
    this.tex = this.alloc(1);
  }
  private alloc(rows: number): WebGLTexture {
    const gl = this.gl;
    const t = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, this.red ? gl.R32F : gl.RGBA32F, this.w, rows, 0, this.red ? gl.RED : gl.RGBA, gl.FLOAT, null);
    this.rows = rows;
    return t;
  }
  /** Writes the first n floats of src from row y0. Returns true when the table grew, so rows before y0 need writing again. */
  write(src: Float32Array, n: number, y0 = 0): boolean {
    const gl = this.gl;
    const per = (this.red ? 1 : 4) * this.w;
    const rows = Math.max(1, Math.ceil(n / per));
    let grew = false;
    if (y0 + rows > this.rows) {
      gl.deleteTexture(this.tex);
      this.tex = this.alloc((y0 + rows) * 2);
      grew = true;
    }
    if (!n) return grew;
    let data = src.length >= rows * per ? src.subarray(0, rows * per) : null;
    if (!data) {
      data = new Float32Array(rows * per);
      data.set(src.subarray(0, n));
    }
    gl.bindTexture(gl.TEXTURE_2D, this.tex);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, y0, this.w, rows, this.red ? gl.RED : gl.RGBA, gl.FLOAT, data);
    return grew;
  }
  drop(): void {
    this.gl.deleteTexture(this.tex);
  }
}

export interface Gpu {
  gl: WebGL2RenderingContext;
  canvas: HTMLCanvasElement;
  /** Bumped on every rebuild after a lost context; a session's uploads belong to one generation. */
  gen: number;
  lost: boolean;
  prog: WebGLProgram;
  quad: WebGLProgram;
  vao: WebGLVertexArrayObject;
  u: Record<string, WebGLUniformLocation | null>;
  qu: Record<string, WebGLUniformLocation | null>;
  /** The role pattern layers (PATTERNS), made from the first card drawn. */
  patTex: WebGLTexture | null;
  slices: Table;
  chunks: [Table, Table];
  dash: Table;
  samples: number;
  /** Size of the canvas and the targets in device px: the largest drawn so far. */
  w: number;
  h: number;
  targets: [Target, Target] | null;
}

let G: Gpu | null = null;
const listeners = new Set<() => void>();

/** Calls `f` after a lost context is rebuilt, so a drawing that is not animating redraws. Returns the unsubscribe. */
export function onRestored(f: () => void): () => void {
  listeners.add(f);
  return () => listeners.delete(f);
}

function compile(gl: WebGL2RenderingContext, vs: string, fs: string): WebGLProgram {
  const p = gl.createProgram()!;
  for (const [type, src] of [[gl.VERTEX_SHADER, vs], [gl.FRAGMENT_SHADER, fs]] as const) {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS) && !gl.isContextLost()) throw new Error(`render: shader: ${gl.getShaderInfoLog(s)}`);
    gl.attachShader(p, s);
  }
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS) && !gl.isContextLost()) throw new Error(`render: link: ${gl.getProgramInfoLog(p)}`);
  return p;
}

/** Antialiasing by device: fewer samples where a pixel is small (a phone, a dense screen). */
function samplesFor(gl: WebGL2RenderingContext): number {
  const g = globalThis as { matchMedia?: (q: string) => { matches: boolean }; devicePixelRatio?: number };
  const dense = !!g.matchMedia?.("(pointer: coarse)").matches || (g.devicePixelRatio ?? 1) >= 2;
  const want = dense ? DRAFT.gpu.samplesDense : DRAFT.gpu.samples;
  return Math.max(1, Math.min(want, gl.getParameter(gl.MAX_SAMPLES) as number));
}

/** Programs, tables and settings of a fresh (or restored) context. */
function build(gl: WebGL2RenderingContext, canvas: HTMLCanvasElement, gen: number): Gpu {
  const prog = compile(gl, VERT, FRAG);
  const quad = compile(gl, QUAD_VERT, QUAD_FRAG);
  const u: Gpu["u"] = {};
  for (const n of ["uItems", "uChunks", "uSlices", "uHoles", "uDash", "uPat", "uNChunks", "uLines", "uSize", "uS", "uCt", "uSt", "uOx", "uOy", "uInk", "uPaper", "uAccent", "uShade", "uSteps", "uDash0", "uDash1"])
    u[n] = gl.getUniformLocation(prog, n);
  const qu: Gpu["qu"] = {};
  for (const n of ["uTex", "uLinesLayer", "uInk", "uAccent", "uUv"]) qu[n] = gl.getUniformLocation(quad, n);
  return {
    gl,
    canvas,
    gen,
    lost: false,
    prog,
    quad,
    vao: gl.createVertexArray()!,
    u,
    qu,
    patTex: null,
    slices: new Table(gl, 1024),
    chunks: [new Table(gl, 1023), new Table(gl, 1023)],
    dash: new Table(gl, 1024, true),
    samples: samplesFor(gl),
    w: 0,
    h: 0,
    targets: null,
  };
}

/** The shared context, made on first use with the card's canvas factory. Throws where there is no WebGL2. */
export function gpu(card: Card): Gpu {
  if (G) return G;
  const canvas = card.f.canvas(1, 1) as unknown as HTMLCanvasElement;
  const gl = (canvas as { getContext?: HTMLCanvasElement["getContext"] }).getContext?.("webgl2", {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    depth: false,
    stencil: false,
  }) as WebGL2RenderingContext | null | undefined;
  if (!gl) throw new Error("render: WebGL2 is not available");
  const g = build(gl, canvas, 1);
  canvas.addEventListener("webglcontextlost", (e) => {
    e.preventDefault(); // asks the browser to give the context back
    if (G) G.lost = true;
  });
  canvas.addEventListener("webglcontextrestored", () => {
    G = build(gl, canvas, (G?.gen ?? 0) + 1);
    for (const f of listeners) f();
  });
  G = g;
  return g;
}

/** False while the shared context is lost: a frame then keeps the image it has, and redraws once onRestored fires. */
export function gpuReady(card: Card): boolean {
  const g = gpu(card);
  return !g.lost && !g.gl.isContextLost();
}

function target(gl: WebGL2RenderingContext, w: number, h: number, samples: number): Target {
  const msaa = gl.createFramebuffer()!;
  gl.bindFramebuffer(gl.FRAMEBUFFER, msaa);
  const color = gl.createRenderbuffer()!;
  gl.bindRenderbuffer(gl.RENDERBUFFER, color);
  gl.renderbufferStorageMultisample(gl.RENDERBUFFER, samples, gl.RGBA8, w, h);
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, color);
  const depth = gl.createRenderbuffer()!;
  gl.bindRenderbuffer(gl.RENDERBUFFER, depth);
  gl.renderbufferStorageMultisample(gl.RENDERBUFFER, samples, gl.DEPTH_COMPONENT24, w, h);
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depth);
  const tex = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  const resolve = gl.createFramebuffer()!;
  gl.bindFramebuffer(gl.FRAMEBUFFER, resolve);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  return { msaa, resolve, tex, rbs: [color, depth] };
}

/** The targets and the canvas at least w x h device px. */
export function targets(g: Gpu, w: number, h: number): [Target, Target] {
  if (g.targets && w <= g.w && h <= g.h) return g.targets;
  const gl = g.gl;
  if (g.targets)
    for (const t of g.targets) {
      gl.deleteFramebuffer(t.msaa);
      gl.deleteFramebuffer(t.resolve);
      gl.deleteTexture(t.tex);
      for (const r of t.rbs) gl.deleteRenderbuffer(r);
    }
  g.w = Math.max(w, g.w);
  g.h = Math.max(h, g.h);
  g.canvas.width = g.w;
  g.canvas.height = g.h;
  g.targets = [target(gl, g.w, g.h, g.samples), target(gl, g.w, g.h, g.samples)];
  return g.targets;
}

/** The role pattern layers, white on clear, drawn once per context from the card's canvas factory. */
export function patterns(g: Gpu, card: Card): WebGLTexture {
  if (g.patTex) return g.patTex;
  const gl = g.gl;
  const t = gl.createTexture()!;
  const T = DRAFT.pattern.tile;
  gl.bindTexture(gl.TEXTURE_2D_ARRAY, t);
  gl.texImage3D(gl.TEXTURE_2D_ARRAY, 0, gl.RGBA8, T, T, PATTERNS.length, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  PATTERNS.forEach((k, i) =>
    gl.texSubImage3D(gl.TEXTURE_2D_ARRAY, 0, 0, 0, i, T, T, 1, gl.RGBA, gl.UNSIGNED_BYTE, tile(card, k, [255, 255, 255]) as unknown as HTMLCanvasElement),
  );
  // no mipmaps: they wash the dots out
  gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_T, gl.REPEAT);
  g.patTex = t;
  return t;
}

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
