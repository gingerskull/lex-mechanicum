// The bench's stand-in 3D renderer: it draws a package v2 the way the real renderer (E7) will have to, so the GPU stage
// and the frame times mean something before that renderer exists. One WebGL2 context; every shape's triangles and edge
// lines uploaded once; every solid an instance (a model matrix per frame); one instanced draw per shape for faces and
// one for edges; flat shading from screen derivatives and 4x MSAA. It does NOT peel layers, classify hidden edges or
// draw patterns, so its frame times are a floor for the real renderer's, and its GPU stage a floor for its upload.
import type { EdgeSet } from "../../src/solids/edges";
import { EF } from "../../src/solids/edges";
import { mat4 } from "../../src/solids/frame";
import type { MeshData } from "../../src/solids/types";
import type { Package2 } from "../../src/package/format2";
import { poseOf } from "../../src/model/pose";
import type { MechanismModel } from "../../src/model/types";
import { ladder, type Dial } from "../../src/render/detail";

const VS = `#version 300 es
in vec3 aPos;
in vec4 iM0; in vec4 iM1; in vec4 iM2; in vec4 iM3;
in float iTone;
uniform mat4 uVP;
out vec3 vPos;
out float vTone;
void main() {
  vec4 w = mat4(iM0, iM1, iM2, iM3) * vec4(aPos, 1.0);
  vPos = w.xyz;
  vTone = iTone;
  gl_Position = uVP * w;
}`;
const FS_FACE = `#version 300 es
precision mediump float;
in vec3 vPos;
in float vTone;
out vec4 o;
void main() {
  vec3 n = normalize(cross(dFdx(vPos), dFdy(vPos)));
  float s = floor(abs(n.z) * 3.0 + 0.5) / 3.0;
  o = vec4(vec3(0.62 + 0.3 * s - 0.25 * vTone), 1.0);
}`;
const FS_EDGE = `#version 300 es
precision mediump float;
in vec3 vPos;
in float vTone;
out vec4 o;
void main() { o = vec4(0.08, 0.08, 0.1, 1.0); }`;

export interface StandInView {
  tilt: number;
  explode: number;
  detail: Dial;
}

interface GpuShape {
  vao: WebGLVertexArrayObject;
  edgeVao: WebGLVertexArrayObject;
  nIdx: number;
  nEdgeVerts: number;
  /** Range of the shared instance buffer: first instance, capacity. */
  first: number;
  cap: number;
  solids: number[];
  /** Instances drawn in the current frame. */
  n: number;
}

function program(gl: WebGL2RenderingContext, vs: string, fs: string): WebGLProgram {
  const mk = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader");
    return s;
  };
  const p = gl.createProgram()!;
  gl.attachShader(p, mk(gl.VERTEX_SHADER, vs));
  gl.attachShader(p, mk(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) ?? "link");
  return p;
}

/** The page's one GPU context and the two programs, made once (R9: a page shares its context). */
export interface Gpu {
  canvas: HTMLCanvasElement;
  gl: WebGL2RenderingContext;
  face: WebGLProgram;
  line: WebGLProgram;
}

export function createGpu(canvas: HTMLCanvasElement): Gpu {
  const gl = canvas.getContext("webgl2", { antialias: true, alpha: false, powerPreference: "high-performance" });
  if (!gl) throw new Error("no WebGL2");
  return { canvas, gl, face: program(gl, VS, FS_FACE), line: program(gl, VS, FS_EDGE) };
}

export class StandIn {
  readonly gl: WebGL2RenderingContext;
  readonly canvas: HTMLCanvasElement;
  private face: WebGLProgram;
  private line: WebGLProgram;
  private made: { buffers: WebGLBuffer[]; vaos: WebGLVertexArrayObject[] } = { buffers: [], vaos: [] };
  private shapes: GpuShape[] = [];
  private inst: WebGLBuffer;
  private data: Float32Array;
  /** Per solid: its frame matrix, its body, its rung. */
  private frames: Float32Array;
  private solids: Package2["solids"];
  private radius: number;
  private centre: [number, number, number];
  private sceneMax = 1;
  /** Per solid, 0..1, for the tone. */
  private tone: Float32Array;
  readonly counters = { draws: 0, instances: 0 };

  constructor(gpu: Gpu, readonly pkg: Package2, meshes: MeshData[], edges: EdgeSet[], private model: MechanismModel | null) {
    const gl = gpu.gl;
    this.gl = gl;
    this.canvas = gpu.canvas;
    this.face = gpu.face;
    this.line = gpu.line;
    this.solids = pkg.solids;
    const n = pkg.solids.length;
    this.frames = new Float32Array(n * 16);
    this.tone = new Float32Array(n);
    pkg.solids.forEach((s, i) => {
      this.frames.set(mat4(s.fr), i * 16);
      this.tone[i] = s.role === "ground" ? 0.6 : s.role === "hw" || s.role === "bearing" ? 0.3 : 0;
    });
    this.data = new Float32Array(n * 20);
    this.inst = gl.createBuffer()!;
    this.made.buffers.push(this.inst);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.inst);
    gl.bufferData(gl.ARRAY_BUFFER, this.data.byteLength, gl.DYNAMIC_DRAW);

    const bySolid = new Map<number, number[]>();
    pkg.solids.forEach((s, i) => (bySolid.get(s.shape) ?? bySolid.set(s.shape, []).get(s.shape)!).push(i));
    let first = 0;
    meshes.forEach((m, si) => {
      const list = bySolid.get(si) ?? [];
      this.shapes.push(this.upload(m, edges[si]!, first, list));
      first += list.length;
    });
    const b = pkg.bounds;
    this.centre = [(b.minX + b.maxX) / 2, (b.minY + b.maxY) / 2, (b.z0 + b.z1) / 2];
    this.radius = Math.hypot(b.maxX - b.minX, b.maxY - b.minY, b.z1 - b.z0) / 2 || 1;
    this.sceneMax = this.radius;
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.92, 0.9, 0.86, 1);
  }

  private attrib(prog: WebGLProgram, name: string, size: number, stride: number, offset: number, divisor: number, buffer: WebGLBuffer, instOffset = 0) {
    const gl = this.gl;
    const loc = gl.getAttribLocation(prog, name);
    if (loc < 0) return;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, size, gl.FLOAT, false, stride, offset + instOffset);
    gl.vertexAttribDivisor(loc, divisor);
  }

  private bindInstances(prog: WebGLProgram, first: number) {
    const base = first * 80;
    for (let k = 0; k < 4; k++) this.attrib(prog, `iM${k}`, 4, 80, k * 16, 1, this.inst, base);
    this.attrib(prog, "iTone", 1, 80, 64, 1, this.inst, base);
  }

  private upload(m: MeshData, e: EdgeSet, first: number, solids: number[]): GpuShape {
    const gl = this.gl;
    const vao = gl.createVertexArray()!;
    this.made.vaos.push(vao);
    gl.bindVertexArray(vao);
    const vb = gl.createBuffer()!;
    this.made.buffers.push(vb);
    gl.bindBuffer(gl.ARRAY_BUFFER, vb);
    gl.bufferData(gl.ARRAY_BUFFER, m.pos, gl.STATIC_DRAW);
    this.attrib(this.face, "aPos", 3, 12, 0, 0, vb);
    const ib = gl.createBuffer()!;
    this.made.buffers.push(ib);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, m.tri, gl.STATIC_DRAW);
    this.bindInstances(this.face, first);

    const edgeVao = gl.createVertexArray()!;
    this.made.vaos.push(edgeVao);
    gl.bindVertexArray(edgeVao);
    const lines = new Float32Array(e.n * 6);
    for (let i = 0; i < e.n; i++) lines.set(e.data.subarray(i * EF, i * EF + 6), i * 6);
    const eb = gl.createBuffer()!;
    this.made.buffers.push(eb);
    gl.bindBuffer(gl.ARRAY_BUFFER, eb);
    gl.bufferData(gl.ARRAY_BUFFER, lines, gl.STATIC_DRAW);
    this.attrib(this.line, "aPos", 3, 12, 0, 0, eb);
    this.bindInstances(this.line, first);
    gl.bindVertexArray(null);
    return { vao, edgeVao, nIdx: m.tri.length, nEdgeVerts: e.n * 2, first, cap: solids.length, solids, n: 0 };
  }

  /** Sizes the drawing buffer in device pixels. */
  resize(w: number, h: number, dpr: number) {
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  /** The solids' instance matrices at phase u: rigid bodies posed by the model, the rest at rest. */
  private pose(u: number, explode: number, mask: Uint8Array) {
    const s = this.model ? this.model.solve(u) : null;
    const parts = this.model ? this.model.parts : [];
    const body = new Map<string, [number, number, number]>();
    if (s) for (const p of parts) if (p.axis === undefined || p.axis === "z") {
        const q = poseOf(p, s);
        if (q) body.set(p.id, q);
      }
    const lift = explode * 6;
    const d = this.data;
    for (const sh of this.shapes) {
      let k = 0;
      for (const i of sh.solids) {
        if (!mask[i]) continue;
        const f = this.frames;
        const o = (sh.first + k) * 20;
        const sol = this.solids[i]!;
        const b = body.get(sol.body);
        const F = i * 16;
        if (b && !sol.legacyAxis) {
          const c = Math.cos(b[2]);
          const sn = Math.sin(b[2]);
          // body pose (x, y, angle) composed with the frame: rotate the x and y columns, then move the origin
          d[o] = c * f[F]! - sn * f[F + 1]!;
          d[o + 1] = sn * f[F]! + c * f[F + 1]!;
          d[o + 2] = f[F + 2]!;
          d[o + 3] = 0;
          d[o + 4] = c * f[F + 4]! - sn * f[F + 5]!;
          d[o + 5] = sn * f[F + 4]! + c * f[F + 5]!;
          d[o + 6] = f[F + 6]!;
          d[o + 7] = 0;
          d[o + 8] = c * f[F + 8]! - sn * f[F + 9]!;
          d[o + 9] = sn * f[F + 8]! + c * f[F + 9]!;
          d[o + 10] = f[F + 10]!;
          d[o + 11] = 0;
          d[o + 12] = c * f[F + 12]! - sn * f[F + 13]! + b[0];
          d[o + 13] = sn * f[F + 12]! + c * f[F + 13]! + b[1];
          d[o + 14] = f[F + 14]! + lift * sol.ex;
        } else {
          for (let j = 0; j < 16; j++) d[o + j] = f[F + j]!;
          d[o + 14] = f[F + 14]! + lift * sol.ex;
        }
        d[o + 15] = 1;
        d[o + 16] = this.tone[i]!;
        k++;
      }
      sh.n = k;
    }
  }

  private viewProj(tilt: number): Float32Array {
    const t = (tilt * Math.PI) / 180;
    const c = Math.cos(t);
    const s = Math.sin(t);
    const aspect = this.canvas.width / this.canvas.height;
    const R = this.sceneMax * 1.1;
    const sx = 1 / (R * Math.max(1, aspect));
    const sy = aspect >= 1 ? 1 / R : aspect / R;
    const [cx, cy, cz] = this.centre;
    // screen x = x, y = y cos t + z sin t, toward the viewer = -y sin t + z cos t; depth = -toward / R
    const m = new Float32Array(16);
    m[0] = sx;
    m[5] = c * sy;
    m[6] = (s / R) * 0.5;
    m[9] = s * sy;
    m[10] = (c / R) * -0.5;
    m[15] = 1;
    m[12] = -cx * sx;
    m[13] = -(cy * c + cz * s) * sy;
    m[14] = -((-cy * s + cz * c) / R) * -0.5;
    return m;
  }

  /** Draws a frame; returns the number of instances drawn. */
  draw(u: number, v: StandInView): number {
    const gl = this.gl;
    const L = ladder(v.detail, { tilt: v.tilt, explode: v.explode });
    const mask = new Uint8Array(this.solids.length);
    this.solids.forEach((s, i) => (mask[i] = L.solid(s.detail) ? 1 : 0));
    this.pose(u, v.explode, mask);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.inst);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.data);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    const vp = this.viewProj(v.tilt);
    this.counters.draws = 0;
    this.counters.instances = 0;
    gl.useProgram(this.face);
    gl.uniformMatrix4fv(gl.getUniformLocation(this.face, "uVP"), false, vp);
    for (const sh of this.shapes) {
      const n = sh.n;
      if (!n) continue;
      gl.bindVertexArray(sh.vao);
      gl.drawElementsInstanced(gl.TRIANGLES, sh.nIdx, gl.UNSIGNED_INT, 0, n);
      this.counters.draws++;
      this.counters.instances += n;
    }
    gl.useProgram(this.line);
    gl.uniformMatrix4fv(gl.getUniformLocation(this.line, "uVP"), false, vp);
    for (const sh of this.shapes) {
      const n = sh.n;
      if (!n) continue;
      gl.bindVertexArray(sh.edgeVao);
      gl.drawArraysInstanced(gl.LINES, 0, sh.nEdgeVerts, n);
      this.counters.draws++;
    }
    return this.counters.instances;
  }

  /** Waits for the GPU: a one-pixel read-back. */
  finish() {
    const px = new Uint8Array(4);
    this.gl.readPixels(0, 0, 1, 1, this.gl.RGBA, this.gl.UNSIGNED_BYTE, px);
  }

  /** Frees this mechanism's buffers; the context and programs stay for the next one. */
  dispose() {
    for (const b of this.made.buffers) this.gl.deleteBuffer(b);
    for (const v of this.made.vaos) this.gl.deleteVertexArray(v);
  }
}
