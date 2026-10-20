// A drawing session of the 3D renderer: one canvas (a stage, a card, a screenshot), a scene unpacked once, and the last
// view, so draw() redraws only when the phase, the view, the theme, the size or the controls changed (R8). The frame is the
// style's paint order: paper, base-plate construction lines, the solids peeled on the GPU (shared context), centrelines,
// dimensions, paper tooth, teaching traces and overlays, the sheet, and the force, velocity and angle overlays.
import { DRAFT } from "../../style/draft";
import { MARK_KINDS } from "../../style/kinds";
import { theme, type ResolvedTheme } from "../../style/theme";
import type { ThemeKey } from "../../style/tokens";
import { makeCard, sizeCard, type CanvasFactory, type CanvasLike, type Card } from "../canvas";
import { ladder, type Dial } from "../detail";
import { paper, tooth } from "../sheet";
import { baseSketch, basePencil, centrelines, dimensions, highlights, newCache, overlayItems, overlays, phantoms, scaleLabel, traces, trails, type Ann, type OverlayFlags } from "./annotate";
import { basisOfOrient, fit, snapName, viewLabel, type Box, type Camera } from "./camera";
import { Geometry, gpu3, gpuReady, onRestored, type Stats3 } from "./gpu";
import type { Poser } from "./poser";
import { place, rows, runtime, ST, worldBox, type Runtime, type Scene } from "./scene";
import { sheetFrame } from "./sheet";
import { defaultView as recordView, type DetailSpec, type ViewState } from "./views";
import { seeThrough } from "./visibility";
import { FORM } from "../../style/form";

export interface DrawView3 {
  state: ViewState;
  theme: ThemeKey;
  detail: Dial;
  /** A library card drawing: bold outlines thinner, no sheet (SD16). */
  card?: boolean;
  /** Sheet frame and title block (the detail stage); false on thumbnails. */
  sheet: boolean;
  /** Overall base-plate dimensions in a view where the base reads true (the detail stage). */
  dims: boolean;
  /** Teaching layers (DL6: drawn at every dial position). Each defaults to on. */
  show: { traces?: boolean; ghosts?: boolean; ticks?: boolean; construction?: boolean; trails?: boolean; forces?: boolean; velocity?: boolean; angles?: boolean };
  /** Bodies or points to ring with the highlight callout (SD26). */
  highlight: string[];
  /** Bodies drawn at their two extreme positions as phantoms (SD21). */
  phantoms: string[];
  /** Windows of a detail view to frame in this view (SD20). */
  frames: DetailSpec[];
}

/** The view a record opens in: its default named view, every teaching layer on, the sheet on. */
export function recordDrawView(scene: Pick<Scene, "teaching" | "axes">, o: Partial<DrawView3> = {}): DrawView3 {
  const axisOf = (j: string) => scene.axes?.[j] ?? null;
  return { state: recordView(scene.teaching, axisOf), theme: "dark", detail: "full", sheet: true, dims: true, show: {}, highlight: [], phantoms: [], frames: [], ...o };
}

export interface Session3 {
  card: Card;
  scene: Scene;
  rt: Runtime;
  /** The camera of the last frame. */
  camera: Camera | null;
  /** Draws the frame for cycle phase u and the view; skips the work when nothing changed. */
  draw(u: number, view: DrawView3): void;
  resize(w: number, h: number, dpr: number): void;
  /** Replaces the kinematics (a control changed): paths are sampled again and the next draw redraws. */
  setPoser(p: Poser): void;
  /** Solids see-through in the last frame (T10), for the audit and the tests. */
  readonly see: Uint8Array;
  readonly stats: Stats3 | null;
  /** Called after a lost GPU context is rebuilt (set by whoever draws). */
  onRestored: (() => void) | null;
  /** Waits for the GPU (the bench's gpu time). */
  finish(): void;
  /** Frees the session's GPU state; it is made again if the session draws again. */
  dispose(): void;
}

export interface SessionOptions3 {
  factory: CanvasFactory;
  w: number;
  h: number;
  dpr?: number;
}

/** The angle of the view from plan, degrees: 0 looking straight down, 90 side on (the ladder's tilt). */
const tiltOf = (C: Camera): number => (Math.acos(Math.min(1, Math.abs(C.eye[2])) ) * 180) / Math.PI;

function sceneBox(rt: Runtime, mats: Float32Array, explode: number): Box {
  const b = rt.scene.pkg.bounds;
  const out: Box = [b.minX, b.minY, b.z0, b.maxX, b.maxY, b.z1];
  if (explode > 0) {
    const w: number[] = [];
    for (let i = 0; i < rt.n; i++) {
      worldBox(rt, mats, i, w);
      for (let k = 0; k < 3; k++) {
        if (w[k]! < out[k]!) out[k] = w[k]!;
        if (w[k + 3]! > out[k + 3]!) out[k + 3] = w[k + 3]!;
      }
    }
  }
  return out;
}

export function createSession3(canvas: CanvasLike, scene0: Scene, o: SessionOptions3): Session3 {
  const card = makeCard(canvas, o.factory);
  const dpr = o.dpr ?? 1;
  sizeCard(card, o.w, o.h, dpr);
  let scene = scene0;
  const rt = runtime(scene);
  const mats = new Float32Array(rt.n * 16);
  let table = new Float32Array(0);
  const see = new Uint8Array(rt.n);
  const cache = { paper: {} as { c?: CanvasLike; key?: string }, ann: newCache() };
  let geo: Geometry | null = null;
  let last = "";
  let rev = 0;
  let full = dpr;
  let off: (() => void) | null = null;
  const boxes = new Float64Array(rt.n * 6);
  const wb: number[] = [];
  const sess: Session3 = {
    card,
    get scene() {
      return scene;
    },
    rt,
    camera: null,
    see,
    get stats() {
      return geo?.stats ?? null;
    },
    onRestored: null,
    draw(u, view) {
      const key = `${u}|${JSON.stringify(view)}|${card.cw}x${card.ch}|${rev}`;
      if (key === last) return;
      const LD = ladder(view.detail, { tilt: tiltOf(basisFor(view)), explode: view.state.explode });
      const want = LD.effect("fullDpr") ? full : 1;
      if (want !== card.dpr) sizeCard(card, card.w, card.h, want);
      if (!gpuReady(card)) return;
      const g = gpu3(card);
      off ??= onRestored(() => {
        last = "";
        sess.onRestored?.();
      });
      if (!geo || geo.gen !== g.gen) {
        geo = new Geometry(g, rt.baked, rt.n);
        table = new Float32Array(geo.tableLength);
      }
      const T = theme(view.theme);
      const e = view.state.explode;
      place(rt, u, e, mats);
      const C = camera(view, u, e);
      sess.camera = C;
      for (let i = 0; i < rt.n; i++) {
        if (rt.fixed[i]) {
          worldBox(rt, mats, i, wb);
          for (let k = 0; k < 6; k++) boxes[i * 6 + k] = wb[k]!;
        }
      }
      seeThrough(rt, boxes, C, see);
      rows(rt, mats, { see, ladder: LD, card: !!view.card, patterns: LD.effect("rolePatterns") }, table);
      const A: Ann = { ctx: card.ctx, w: card.w, h: card.h, C, T, rt, mats, u, explode: e, LD, cache: cache.ann };
      const ctx = card.ctx;
      ctx.setTransform(card.dpr, 0, 0, card.dpr, 0, 0);
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      paper(card, T, cache.paper);
      baseSketch(A);
      const sec = view.state.section;
      let clip: [number, number, number, number] | null = null;
      if (sec) {
        const s = Math.sign(sec.normal[0] * C.eye[0] + sec.normal[1] * C.eye[1] + sec.normal[2] * C.eye[2]) || 1;
        const n = [sec.normal[0] * s, sec.normal[1] * s, sec.normal[2] * s];
        const l = Math.hypot(n[0]!, n[1]!, n[2]!) || 1;
        clip = [n[0]! / l, n[1]! / l, n[2]! / l, -(n[0]! * sec.origin[0] + n[1]! * sec.origin[1] + n[2]! * sec.origin[2]) / l];
      }
      let markMask = 0;
      MARK_KINDS.forEach((k, i) => {
        if (LD.mark(k) && (k !== "chamfer" || C.s > DRAFT.lines.chamferMinScale)) markMask |= 1 << (i + 1);
      });
      geo.draw(
        { card, cam: C, cw: card.cw, ch: card.ch, dpr: card.dpr, T, layers: LD.effect("deepLayers") ? DRAFT.peel.layers : DRAFT.peel.layersLow, hidden: LD.effect("hiddenLines"), patterns: LD.effect("rolePatterns"), shade: LD.effect("wallShade"), clip, markMask },
        table,
      );
      const gl = gpu3(card).canvas;
      ctx.drawImage(gl as unknown as CanvasImageSource, 0, 0, card.cw, card.ch, 0, 0, card.w, card.h);
      basePencil(A);
      centrelines(A);
      if (view.dims && view.sheet && !view.card && snapName({ yaw: 0, tilt: tiltOf(C) }) !== null) dimensions(A);
      if (LD.effect("grain")) tooth(card, T);
      const sh = view.show;
      if (sh.trails !== false) trails(A);
      phantoms(A, view.phantoms);
      traces(A, { traces: sh.traces !== false, ghosts: sh.ghosts !== false, ticks: sh.ticks !== false });
      if (sh.construction !== false) overlays(A);
      frames(A, view.frames);
      highlights(A, [...view.highlight, ...(view.state.section?.highlight ?? []), ...(view.state.detail?.highlight ?? [])]);
      if (view.sheet && !view.card) {
        const info = scene.info;
        sheetFrame(card, T, {
          title: info.title,
          no: info.no,
          ...(info.sheet ? { sheet: info.sheet } : {}),
          view: viewLabel(view.state.orient, view.state.auxName),
          scale: scaleLabel(C),
          dial: LD.label,
          ...(sec ? { extra: sec.name } : view.state.detail ? { extra: view.state.detail.name } : {}),
        });
      }
      const items = scene.items;
      const fl: OverlayFlags = { forces: sh.forces !== false, velocity: sh.velocity !== false, angles: sh.angles !== false };
      if (items) overlayItems(A, fl, { ...(items.forces ? { forces: items.forces(u) } : {}), ...(items.angles ? { angles: items.angles(u) } : {}), ...(items.velocity ? { velocity: items.velocity } : {}) });
      last = key;
    },
    resize(w, h, d) {
      full = d;
      sizeCard(card, w, h, d);
      last = "";
    },
    setPoser(p) {
      scene = { ...scene, poser: p };
      rt.scene = scene;
      cache.ann = newCache();
      rev++;
      last = "";
    },
    finish() {
      geo?.finish();
    },
    dispose() {
      geo?.dispose();
      geo = null;
      off?.();
      off = null;
      last = "";
    },
  };

  const basisFor = (view: DrawView3): Camera => ({ ...basisOfOrient(view.state.orient), s: 1, ox: 0, oy: 0, d0: 0, d1: 1 });

  function camera(view: DrawView3, u: number, explode: number): Camera {
    const B = basisOfOrient(view.state.orient);
    const box = sceneBox(rt, mats, explode);
    const det = view.state.detail;
    let win: { centre: [number, number, number]; scale: number } | undefined;
    if (det) {
      const c = Array.isArray(det.centre) ? det.centre : scene.poser.point(u, det.centre);
      if (c) win = { centre: c, scale: Math.max(det.scale, DRAFT.detailView.minScale) };
    }
    return fit(B, card.w, card.h, box, win ? { window: win } : {});
  }

  /** Outlines the windows of detail views in this view (SD20). */
  function frames(A: Ann, specs: DetailSpec[]) {
    if (!specs.length) return;
    const D = DRAFT.detailView.frame;
    const ctx = A.ctx;
    ctx.save();
    ctx.setLineDash([...D.dash]);
    ctx.lineWidth = D.width;
    ctx.strokeStyle = `rgba(${A.T.ink[0]},${A.T.ink[1]},${A.T.ink[2]},${D.alpha})`;
    for (const sp of specs) {
      const c = Array.isArray(sp.centre) ? sp.centre : scene.poser.point(A.u, sp.centre);
      if (!c) continue;
      const r = Math.min(A.w, A.h) / (2 * Math.max(sp.scale, DRAFT.detailView.minScale));
      const px = A.C.ox + A.C.s * (c[0] * A.C.right[0] + c[1] * A.C.right[1] + c[2] * A.C.right[2]);
      const py = A.C.oy - A.C.s * (c[0] * A.C.up[0] + c[1] * A.C.up[1] + c[2] * A.C.up[2]);
      ctx.strokeRect(px - r, py - r, 2 * r, 2 * r);
    }
    ctx.restore();
  }

  void ST;
  void FORM;
  return sess;
}

export type { ResolvedTheme };
