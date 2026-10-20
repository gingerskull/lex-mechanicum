// The drawing page of the 3D renderer: tools/chrome3.ts loads it in local Chrome and calls the functions it puts on
// window (shot, bench, lose). Packages (v2) and the records' teaching and kin blocks come from the page's server; every
// drawing on the page shares one GPU context, as on the site.
import type { Kin, Teaching } from "../../src/catalog/kin";
import { Kinematics } from "../../src/kin/compose";
import type { Controls, Kin as KinLib } from "../../src/kin/types";
import { models } from "../../src/mechanisms/models";
import type { MechanismModel } from "../../src/model/types";
import { browserFactory } from "../../src/render/canvas";
import type { Dial } from "../../src/render/detail";
import { gpu3, loseContext } from "../../src/render/v3/gpu";
import { hybridPoser, kinPoser, legacyPoser, staticPoser, type Poser } from "../../src/render/v3/poser";
import type { Scene } from "../../src/render/v3/scene";
import { createSession3, recordDrawView, type DrawView3, type Session3 } from "../../src/render/v3/session";
import { parseView, viewsOf, type ViewState } from "../../src/render/v3/views";
import { setupInline } from "../../src/solids/setup";
import type { Vec3 } from "../../src/solids/types";

/** What the server sends besides the package: the record's blocks and its name. */
export interface Meta {
  name: string;
  teaching: Teaching | null;
  kin: Kin | null;
}

/** One drawing: canvas size in CSS px, pixel ratio, phase, and the view over the record's own. */
export interface Draw3Options {
  w: number;
  h: number;
  dpr: number;
  u: number;
  card?: boolean;
  /** "record" (the default view of the teaching block), a name such as "PLAN", "AUX O2" or "VIEW 30 40", or a record view id (a section). */
  view?: string;
  explode?: number;
  theme?: "dark" | "light";
  detail?: Dial;
  /** Settings of the record's controls for this drawing. */
  controls?: Controls;
  /** A detail window on a named point or a world point: the drawing magnified about it. */
  zoom?: { centre: string | Vec3; scale: number; name?: string };
  /** Moves a record section's cut plane (the lifted pilots' z differs from the record's frame until the new builders place solids by the record). */
  sectionShift?: Vec3;
  over?: Partial<DrawView3>;
}

export interface ImageOut {
  type?: "image/png" | "image/webp";
  quality?: number;
}

const stamp = () => document.body.dataset.v ?? "";

interface Loaded {
  scene: Scene;
  meta: Meta;
  model: MechanismModel | null;
  setupMs: number;
}
const cache = new Map<string, Promise<Loaded>>();

const bytes = async (url: string) => new Uint8Array(await (await fetch(`${url}?v=${stamp()}`)).arrayBuffer());

function poserFor(l: { meta: Meta; model: MechanismModel | null; z: number }, controls?: Controls): Poser {
  const legacy: Poser = l.model ? legacyPoser(l.model, l.z) : staticPoser;
  return l.meta.kin ? hybridPoser(legacy, kinPoser(new Kinematics(l.meta.kin as unknown as KinLib), controls)) : legacy;
}

async function load(id: string): Promise<Loaded> {
  const hit = cache.get(id);
  if (hit) return hit;
  const p = (async () => {
    const [blob, meta] = await Promise.all([bytes(`./packages/${id}.mx2`), fetch(`./meta/${id}.json?v=${stamp()}`).then((r) => r.json() as Promise<Meta>)]);
    const t0 = performance.now();
    const s = await setupInline(blob);
    const setupMs = performance.now() - t0;
    const model = models[id] ? await models[id]!() : null;
    const axes: Record<string, Vec3> = {};
    for (const j of meta.kin?.joints ?? []) if (Array.isArray(j.axis) && j.axis.length >= 3) axes[j.id] = [j.axis[0] as number, j.axis[1] as number, j.axis[2] as number];
    const scene: Scene = { pkg: s.pkg, meshes: s.meshes, edges: s.edges, poser: poserFor({ meta, model, z: s.pkg.bounds.z1 }), teaching: meta.teaching, axes, info: { title: meta.name, no: `MX-${id.toUpperCase()}` } };
    return { scene, meta, model, setupMs };
  })();
  cache.set(id, p);
  return p;
}

function viewOf(scene: Scene, o: Draw3Options): DrawView3 {
  const base = recordDrawView(scene, { card: !!o.card, sheet: !o.card, dims: !o.card, ...(o.theme ? { theme: o.theme } : {}), ...(o.detail ? { detail: o.detail } : {}), ...o.over });
  let state: ViewState = base.state;
  const v = o.view ?? "record";
  if (v !== "record") {
    const axisOf = (j: string) => scene.axes?.[j] ?? null;
    const named = viewsOf(scene.teaching, axisOf).find((x) => x.id === v);
    if (named) state = named.state;
    else {
      const p = parseView(v, axisOf);
      if (p) state = { orient: p.orient, ...(p.auxName ? { auxName: p.auxName } : {}), explode: 0 };
    }
  }
  if (state.section && o.sectionShift) state = { ...state, section: { ...state.section, origin: [state.section.origin[0] + o.sectionShift[0], state.section.origin[1] + o.sectionShift[1], state.section.origin[2] + o.sectionShift[2]] } };
  const detail = o.zoom ? { name: o.zoom.name ?? "DETAIL Z", centre: o.zoom.centre, scale: o.zoom.scale, highlight: [] } : state.detail;
  return { ...base, state: { ...state, ...(detail ? { detail } : {}), explode: o.explode ?? state.explode } };
}

async function session(id: string, o: Draw3Options): Promise<{ sess: Session3; scene: Scene; setupMs: number; bakeMs: number }> {
  const l = await load(id);
  const canvas = document.createElement("canvas");
  canvas.id = "stage";
  canvas.style.width = `${o.w}px`;
  canvas.style.height = `${o.h}px`;
  canvas.style.display = "block";
  document.body.replaceChildren(canvas);
  const b0 = performance.now();
  const sess = createSession3(canvas, l.scene, { factory: browserFactory, w: o.w, h: o.h, dpr: o.dpr });
  const bakeMs = performance.now() - b0;
  if (o.controls) sess.setPoser(poserFor({ meta: l.meta, model: l.model, z: l.scene.pkg.bounds.z1 }, o.controls));
  return { sess, scene: sess.scene, setupMs: l.setupMs, bakeMs };
}

/** Draws one frame and returns it as a data URL. */
async function shot(id: string, o: Draw3Options, out: ImageOut = {}): Promise<string> {
  const { sess, scene } = await session(id, o);
  sess.draw(o.u, viewOf(scene, o));
  const url = (sess.card.canvas as HTMLCanvasElement).toDataURL(out.type ?? "image/png", out.quality);
  sess.dispose();
  return url;
}

/** Draws a frame, loses and restores the GPU context, and returns the frame drawn again through onRestored. */
async function lose(id: string, o: Draw3Options): Promise<string> {
  const { sess, scene } = await session(id, o);
  const v = viewOf(scene, o);
  sess.draw(o.u, v);
  let redrawn = false;
  sess.onRestored = () => {
    sess.draw(o.u, v);
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

const frame = () => new Promise<number>((r) => requestAnimationFrame(r));
const med = (v: number[]) => [...v].sort((a, b) => a - b)[Math.floor(v.length / 2)] ?? 0;
const r2 = (x: number) => Math.round(x * 100) / 100;

export interface Bench3 {
  id: string;
  /** Decode, tessellate and edges (the worker's share), then the session's bake into GPU arrays, then the first frame (program build on a cold page, buffers, first peel). */
  setupMs: number;
  bakeMs: number;
  firstFrameMs: number;
  /** Shader compile and link, once per page; 0 when the page already had its context. */
  contextMs: number;
  tris: number;
  edges: number;
  layers: number;
  draws: number;
  see: number;
  views: Record<string, { paced: number; gpu: number; cpu: number }>;
}

/** Frame times per view: the mean interval of paced frames, draw plus a read-back (the GPU's cost), and the script time. */
async function bench(id: string, o: { w: number; h: number; dpr: number; frames: number; views: Record<string, Partial<Draw3Options>> }): Promise<Bench3> {
  const base: Draw3Options = { w: o.w, h: o.h, dpr: o.dpr, u: 1 };
  const { sess, scene, setupMs, bakeMs } = await session(id, base);
  const t0 = performance.now();
  sess.draw(1, viewOf(scene, base));
  sess.finish();
  const firstFrameMs = performance.now() - t0;
  const contextMs = gpu3(sess.card).buildMs;
  const views: Bench3["views"] = {};
  for (const [name, spec] of Object.entries(o.views)) {
    const v = viewOf(scene, { ...base, ...spec });
    const draw = (u: number) => sess.draw(u, v);
    for (let i = 0; i < 5; i++) draw(0.3 + i * 0.01);
    sess.finish();
    const cpu: number[] = [];
    await frame();
    await frame();
    const a0 = performance.now();
    for (let i = 0; i < o.frames; i++) {
      await frame();
      const a = performance.now();
      draw(1 + i * 0.05);
      cpu.push(performance.now() - a);
    }
    await frame();
    const paced = (performance.now() - a0) / (o.frames + 1);
    sess.finish();
    const g0 = performance.now();
    for (let i = 0; i < o.frames; i++) {
      draw(2 + i * 0.05);
      sess.finish();
    }
    views[name] = { paced: r2(paced), gpu: r2((performance.now() - g0) / o.frames), cpu: r2(med(cpu)) };
  }
  const st = sess.stats;
  const out: Bench3 = { id, setupMs: r2(setupMs), bakeMs: r2(bakeMs), firstFrameMs: r2(firstFrameMs), contextMs: r2(contextMs), tris: st?.tris ?? 0, edges: st?.edges ?? 0, layers: st?.layers ?? 0, draws: st?.draws ?? 0, see: sess.see.reduce((a, b) => a + b, 0), views };
  sess.dispose();
  return out;
}

/** The GPU's name, for reports. */
function gpu(): string {
  const gl = document.createElement("canvas").getContext("webgl2");
  const x = gl?.getExtension("WEBGL_debug_renderer_info");
  return x ? String(gl!.getParameter(x.UNMASKED_RENDERER_WEBGL)) : gl ? "unknown" : "no WebGL2";
}

/** The solids a drawing makes see-through, by id, for the audit and the checks (T10). */
async function seeThrough(id: string, o: Draw3Options): Promise<string[]> {
  const { sess, scene } = await session(id, o);
  sess.draw(o.u, viewOf(scene, o));
  const out = scene.pkg.solids.filter((_s, i) => sess.see[i]).map((s) => s.id);
  sess.dispose();
  return out;
}

const api = { shot, lose, bench, gpu, seeThrough };
export type Draw3Page = typeof api;
Object.assign(window, { draw3: api });
void Promise.all([...document.fonts].map((f) => f.load())).then(
  () => (document.title = "ready"),
  (e: unknown) => (document.title = `error: ${String(e)}`),
);
