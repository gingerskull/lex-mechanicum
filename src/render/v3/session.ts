// A drawing session of the 3D renderer: one canvas (a stage, a card, a screenshot), a scene unpacked once, and the last
// view, so draw() redraws only when the phase, the view, the theme, the size or the controls changed (R8). The frame is the
// style's paint order: paper, base-plate construction lines, the solids peeled on the GPU (shared context), centrelines,
// dimensions, paper tooth, teaching traces and overlays, the sheet, and the force, velocity and angle overlays.
import { DRAFT } from "../../style/draft";
import { FORGE } from "../../style/forge";
import { MARK_KINDS } from "../../style/kinds";
import { rgba as paint, theme, type ResolvedTheme } from "../../style/theme";
import type { ThemeKey } from "../../style/tokens";
import { makeCard, sizeCard, type CanvasFactory, type CanvasLike, type Card } from "../canvas";
import { ladder, type Dial } from "../detail";
import { paper, tooth } from "../sheet";
import { baseSketch, basePencil, centrelines, dimensions, highlights, labelSpots, newCache, overlayItems, overlays, phantoms, scaleLabel, traces, trails, type Ann, type OverlayFlags } from "./annotate";
import { font } from "../../style/theme";
import { calloutPlan, coverage, railSides, railSlots, steadiest, type LabelMode, type LabelPlan } from "./labels";
import { basisOfOrient, fit, project, snapName, viewLabel, type Box, type Camera } from "./camera";
import type { Vec3 } from "../../solids/types";
import { Geometry, gpu3, gpuReady, onRestored, postPass, type Stats3 } from "./gpu";
import type { Poser } from "./poser";
import { place, rows, runtime, worldBox, type Runtime, type Scene } from "./scene";
import { sheetFrame } from "./sheet";
import { defaultView as recordView, type DetailSpec, type ViewState } from "./views";
import { seeThrough } from "./visibility";

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
  /** The input ring's strength, 0..1: below 1 only while a paused drawing breathes (ringBreath). */
  ring?: number;
  /** A Forge glitch pulse, 0..1 (0 or absent outside one): the post-process tears bands and splits the colours wider. */
  glitch?: number;
  /** How the construction labels are laid out (SD22); absent: none on a card, rails on a wide stage, else markers. */
  labels?: LabelMode;
  /** A construction label picked out (its number in the record's order, from 0): its element bold, the rest faded. */
  focus?: number | null;
  /** The views' clock, ms (performance.now on the stage): callout rows ease to a new place on it; absent, they jump. */
  now?: number;
}

/**
 * The input ring's strength `t` seconds after the drawing was paused (LM-06, draft.lines.accentRing.breathe): from 1
 * down to `low` and back once a `period`, on a cosine, so a pause starts at full strength.
 */
export function ringBreath(t: number): number {
  const B = DRAFT.lines.accentRing.breathe;
  return B.low + (1 - B.low) * (0.5 + 0.5 * Math.cos((2 * Math.PI * t) / B.period));
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
  /** True while a callout row is easing to a new place: whoever draws keeps drawing until it settles. */
  readonly busy: boolean;
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
  const seeA = new Float32Array(rt.n);
  const cache = { paper: {} as { c?: CanvasLike; key?: string }, ann: newCache() };
  let geo: Geometry | null = null;
  let last = "";
  let rev = 0;
  let frame = 0;
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
    get busy() {
      return tween !== null;
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
      const mode = labelMode(view);
      const plan = labelPlan(view, u, e, mode, { ctx: card.ctx, w: card.w, h: card.h, T, rt, mats, u, explode: e, LD, cache: cache.ann });
      const C = camera(view, u, e, plan?.mode === "rails" ? plan : undefined);
      sess.camera = C;
      for (let i = 0; i < rt.n; i++) {
        if (rt.fixed[i]) {
          worldBox(rt, mats, i, wb);
          for (let k = 0; k < 6; k++) boxes[i * 6 + k] = wb[k]!;
        }
      }
      seeThrough(rt, boxes, C, see, seeA);
      rows(rt, mats, { see: seeA, ladder: LD, card: !!view.card, patterns: LD.effect("rolePatterns") }, table);
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
        { card, cam: C, cw: card.cw, ch: card.ch, dpr: card.dpr, T, layers: LD.effect("deepLayers") ? DRAFT.peel.layers : DRAFT.peel.layersLow, hidden: LD.effect("hiddenLines"), patterns: LD.effect("rolePatterns"), shade: LD.effect("wallShade"), clip, markMask, ring: view.ring ?? 1 },
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
      const edge = DRAFT.sheet.inset + DRAFT.sheet.innerOffset;
      // a card draws no construction at all (SD22); the stage opens with it off, and the visitor turns it on
      if (sh.construction !== false && !view.card) overlays(A, { mode, plan, focus: view.focus ?? null, frame: { x0: edge, x1: card.w - edge }, rows: tweenRows(plan, view.now) });
      frames(A, view.frames);
      highlights(A, [...view.highlight, ...(view.state.section?.highlight ?? []), ...(view.state.detail?.highlight ?? [])]);
      if (view.sheet && !view.card) {
        const info = scene.info;
        sheetFrame(card, T, {
          title: info.title,
          no: info.no,
          ...(info.sheet ? { sheet: info.sheet } : {}),
          ...(info.date ? { date: info.date } : {}),
          view: viewLabel(view.state.orient, view.state.auxName),
          scale: scaleLabel(C),
          dial: LD.label,
          ...(sec ? { extra: sec.name } : view.state.detail ? { extra: view.state.detail.name } : {}),
        });
      }
      const items = scene.items;
      const fl: OverlayFlags = { forces: sh.forces !== false, velocity: sh.velocity !== false, angles: sh.angles !== false };
      if (items) overlayItems(A, fl, { ...(items.forces ? { forces: items.forces(u) } : {}), ...(items.angles ? { angles: items.angles(u) } : {}), ...(items.velocity ? { velocity: items.velocity } : {}) });
      // the Forge sheet's post-process, with the paper grain (rung A), so it is the first thing the dial drops (SS14)
      if (view.theme === "forge" && !view.card && LD.effect("grain")) {
        const F = FORGE.canvas;
        const k = Math.max(0, Math.min(1, view.glitch ?? 0));
        postPass(card, { seed: ++frame % 997, grain: F.grain, chroma: (F.chroma + k * (F.glitchChroma - F.chroma)) * card.dpr, wobble: F.wobble * card.dpr, wobbleRows: F.wobbleRows * card.dpr, tear: k * F.tear * card.dpr, band: F.band * card.dpr, torn: k * F.tornShare });
      }
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

  // where the construction labels go for a view, and the room the rails take: fixed for the view (SD22)
  let labelCache: { key: string; plan: LabelPlan | null; eye?: Vec3 } = { key: "", plan: null };
  // a callout row moving to the place a new plan gives it: from where it was, over `tween` ms of the views' clock
  let tween: { from: Map<string, number>; t0: number } | null = null;
  const labelMode = (view: DrawView3): LabelMode => (view.card ? "none" : (view.labels ?? (card.w >= DRAFT.overlays.rail.minStage ? "callouts" : "markers")));
  function labelPlan(view: DrawView3, u: number, e: number, mode: LabelMode, A0: Omit<Ann, "C">): LabelPlan | null {
    const t = scene.teaching;
    if (mode === "none" || view.show.construction === false || !t?.overlays.some((o) => typeof o.label === "string" && o.label)) return null;
    const eye = basisOfOrient(view.state.orient).eye;
    // callouts keep their rows while the view turns less than `replanDeg` from where they were chosen (no jumps in an
    // orbit); anything else about the view chooses again
    const rest = { ...view.state, orient: undefined };
    const key = JSON.stringify([mode === "callouts" ? rest : view.state, view.state.orient.aux ?? null, card.w, card.h, mode, rev, Math.round(e * 4), view.theme]);
    const near = labelCache.eye && Math.acos(Math.min(1, Math.abs(labelCache.eye[0] * eye[0] + labelCache.eye[1] * eye[1] + labelCache.eye[2] * eye[2]))) < (DRAFT.overlays.callout.replanDeg * Math.PI) / 180;
    if (labelCache.key === key && (mode !== "callouts" || near)) return labelCache.plan;
    const R = DRAFT.overlays.rail;
    const follow = (C: Camera) => steadiest(Array.from({ length: R.samples }, (_, k) => labelSpots({ ...A0, C }, (k / R.samples) * scene.poser.period)));
    const C0 = camera(view, u, e);
    let st = follow(C0);
    let plan: LabelPlan;
    if (mode === "markers") plan = { mode, left: 0, right: 0, items: st.map((s) => ({ key: s.key, n: s.n, text: s.text, cand: s.cand, side: 0, y: 0 })) };
    else if (mode === "callouts") {
      const samples = Array.from({ length: R.samples }, (_, k) => labelSpots({ ...A0, C: C0 }, (k / R.samples) * scene.poser.period));
      const box = sceneBox(rt, mats, e);
      const cx = project(C0, [(box[0] + box[3]) / 2, (box[1] + box[4]) / 2, (box[2] + box[5]) / 2])[0];
      const S = DRAFT.sheet;
      const tw = Math.max(S.titleMinW, Math.min(S.titleMaxW, card.w * S.titleWFrac));
      const e0 = S.inset + S.innerOffset;
      const block: [number, number, number, number] | null = view.sheet && card.w > S.titleMinCanvas ? [card.w - e0 - tw, card.h - e0 - 4 * S.titleRow, card.w - e0, card.h - e0] : null;
      // where the drawing is over the cycle: each solid's outline on the sheet (the base plate and its feet left out, its
      // plain face is fine to letter over), at every sampled phase for a moving one
      const rects: [number, number, number, number][] = [];
      const M = new Float32Array(rt.n * 16);
      const wb: number[] = [];
      const solids = rt.scene.pkg.solids;
      const rectOf = (m: Float32Array, i: number) => {
        worldBox(rt, m, i, wb);
        let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
        for (const x of [wb[0]!, wb[3]!]) for (const y of [wb[1]!, wb[4]!]) for (const z of [wb[2]!, wb[5]!]) {
          const p = project(C0, [x, y, z]);
          x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]);
        }
        rects.push([x0, y0, x1, y1]);
      };
      const skip = (i: number) => rt.isBase[i] === 1 || solids[i]!.kind === "foot" || !LDof(view, e).solid(solids[i]!.detail);
      place(rt, u, e, M);
      for (let i = 0; i < rt.n; i++) if (!skip(i) && rt.fixed[i]) rectOf(M, i);
      for (let k = 0; k < R.samples; k++) {
        place(rt, (k / R.samples) * scene.poser.period, e, M);
        for (let i = 0; i < rt.n; i++) if (!skip(i) && !rt.fixed[i]) rectOf(M, i);
      }
      const drawn = coverage(rects, card.w, card.h);
      const ctx = card.ctx;
      ctx.save();
      ctx.font = font(DRAFT.type.overlaySmall);
      const items = calloutPlan(samples, st, cx, { w: card.w, h: card.h, block, drawn }, (x) => ctx.measureText(x).width);
      ctx.restore();
      // where the old rows were, for the tween
      const old = labelCache.plan?.mode === "callouts" ? labelCache.plan : null;
      if (old && view.now !== undefined) {
        const from = new Map<string, number>();
        for (const it of items) {
          const o = old.items.find((q) => q.key === it.key && q.side === it.side);
          if (o && o.y !== it.y) from.set(it.key, o.y);
        }
        tween = from.size ? { from, t0: view.now } : null;
      }
      plan = { mode, left: 0, right: 0, items };
    } else {
      const ctx = card.ctx;
      ctx.save();
      ctx.font = font(DRAFT.type.overlaySmall);
      const { sides, left, right } = railSides(st, card.w / 2, (x) => ctx.measureText(x).width);
      ctx.restore();
      // the drawing fitted again with the rails' room, and the labels followed again in that camera
      st = follow(camera(view, u, e, { left, right }));
      const S = DRAFT.sheet;
      const top = S.inset + S.innerOffset + R.spacing;
      const block = view.sheet && card.w > S.titleMinCanvas ? 4 * S.titleRow + R.spacing : 0;
      const bottom: [number, number] = [card.h - S.inset - S.innerOffset - R.spacing, card.h - S.inset - S.innerOffset - block - R.spacing];
      plan = { mode, left, right, items: railSlots(st, sides, top, bottom) };
    }
    labelCache = { key, plan, eye };
    return plan;
  }

  /** The callout rows of this frame mid-tween, or undefined when none is moving. */
  function tweenRows(plan: LabelPlan | null, now: number | undefined): Map<string, number> | undefined {
    if (!tween || !plan || now === undefined) return undefined;
    const k = Math.min(1, (now - tween.t0) / DRAFT.overlays.callout.tween);
    if (k >= 1) {
      tween = null;
      return undefined;
    }
    const e = 1 - (1 - k) * (1 - k);
    const out = new Map<string, number>();
    for (const it of plan.items) {
      const f = tween.from.get(it.key);
      if (f !== undefined) out.set(it.key, f + (it.y - f) * e);
    }
    return out;
  }

  const LDof = (view: DrawView3, e: number) => ladder(view.detail, { tilt: tiltOf(basisFor(view)), explode: e });
  const basisFor = (view: DrawView3): Camera => ({ ...basisOfOrient(view.state.orient), s: 1, ox: 0, oy: 0, d0: 0, d1: 1 });

  function camera(view: DrawView3, u: number, explode: number, rails?: { left: number; right: number }): Camera {
    const B = basisOfOrient(view.state.orient);
    const box = sceneBox(rt, mats, explode);
    const det = view.state.detail;
    let win: { centre: [number, number, number]; scale: number } | undefined;
    if (det) {
      const c = Array.isArray(det.centre) ? det.centre : scene.poser.point(u, det.centre);
      if (c) win = { centre: c, scale: Math.max(det.scale, DRAFT.detailView.minScale) };
    }
    // the dimension lines of the detail stage run along the bottom and the right of the drawing: keep room for them
    const room = view.sheet && view.dims && !view.card ? DRAFT.dims.offset + DRAFT.dims.ext + DRAFT.dims.labelH / 2 : 0;
    const side = rails ?? { left: 0, right: 0 };
    // a card's margin is the thumbnail's, scaled to the card: the live drawing takes over from the image without a jump
    const pad = view.card ? (DRAFT.camera.pad * card.w) / DRAFT.card.refW : DRAFT.camera.pad;
    return fit(B, card.w, card.h, box, { pad, ...(win ? { window: win } : {}), ...(room || side.left || side.right ? { inset: { left: side.left, right: room + side.right, bottom: room } } : {}) });
  }

  /** Outlines the windows of detail views in this view (SD20). */
  function frames(A: Ann, specs: DetailSpec[]) {
    if (!specs.length) return;
    const D = DRAFT.detailView.frame;
    const ctx = A.ctx;
    ctx.save();
    ctx.setLineDash([...D.dash]);
    ctx.lineWidth = D.width;
    ctx.strokeStyle = paint(A.T.ink, D.alpha);
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

  return sess;
}

export type { ResolvedTheme };
