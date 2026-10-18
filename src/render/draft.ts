// The drafting frame (style Part IV, paint order SD). Every solid is a paper surface that partly hides what is behind
// it, with its role pattern on the top face. Every edge is drawn twice: a full-weight line on a lines layer that later
// surfaces erase where they cover it, and a thin dashed copy on the frame, so an edge seen through a part reads as a
// hidden line. Fine detail lives only on the lines layer and disappears behind parts. One accent; everything else ink.
// The solids are drawn on the GPU (gl/); the paper, construction lines, centrelines, dimensions, traces, sheet and
// overlays are drawn here on the 2D canvas, under and over them.
import { TAU, type Vec2 } from "../core/geom";
import type { Solved } from "../model/types";
import { DRAFT } from "../style/draft";
import { FORM } from "../style/form";
import { font, theme, rgba as paint } from "../style/theme";
import type { ThemeKey } from "../style/tokens";
import { ladder, type Dial } from "./detail";
import { drawSolids, gpuReady } from "./gl";
import { drawOverlays, type OverlayFlags } from "./overlays";
import { projector, type Projector } from "./projector";
import { dimensions, paper, sheetFrame, tooth, type SheetInfo } from "./sheet";
import { slices } from "./slices";
import type { Session } from "./session";
import { worldSolids, type World } from "./world";
import { LAYER } from "../parts";

export interface DrawView {
  /** Degrees, 0 (plan) to 88 (side elevation). */
  tilt: number;
  /** 0 (assembled) to 1 (fully exploded). */
  explode: number;
  overlays: OverlayFlags;
  /** Draw the base plate. */
  base: boolean;
  /** Overall base-plate dimensions (detail stage). */
  dims: boolean;
  /** Sheet frame and title block (detail stage); null on thumbnails. */
  sheet: SheetInfo | null;
  detail: Dial;
  /** A joint id to ring with a callout. */
  highlight: string | null;
  theme: ThemeKey;
  /** A library card drawing (thumbnail or hover): bold outlines thinner by DRAFT.card. */
  card?: boolean;
}

export const defaultView = (): DrawView => ({
  tilt: DRAFT.sheet.defaultTilt,
  explode: 0,
  overlays: { paths: true },
  base: true,
  dims: false,
  sheet: null,
  detail: "full",
  highlight: null,
  theme: "dark",
});

/** The view of a library card (SS1): the default view at the card's dial position and line weights. */
export const cardView = (): DrawView => ({ ...defaultView(), detail: DRAFT.card.detail, card: true });

const addPoly = (c: CanvasRenderingContext2D, P: Vec2[], close = true) => {
  if (!P.length) return;
  c.moveTo(P[0]![0], P[0]![1]);
  for (let i = 1; i < P.length; i++) c.lineTo(P[i]![0], P[i]![1]);
  if (close) c.closePath();
};

/** z range of the whole drawing at an explode, for a stable frame while the mechanism moves. */
function zRange(sess: Session, explode: number): [number, number] {
  const gap = FORM.explode.gap * explode;
  let z0 = Infinity;
  let z1 = -Infinity;
  for (const p of sess.prepared) {
    z0 = Math.min(z0, p.s.z0 + gap * p.s.ex);
    z1 = Math.max(z1, p.s.z1 + gap * p.s.ex);
  }
  return [z0, z1];
}

/** Draws the frame. `drawn` is null when the GPU context is lost: the canvas keeps its image, to redraw once restored. */
export function drawFrame(sess: Session, u: number, view: DrawView): { s: Solved; Pr: Projector; drawn: number | null } {
  const card = sess.card;
  const T = theme(view.theme);
  const LD = ladder(view.detail, view);
  const cardK = view.card ? { plate: DRAFT.card.plateTopFactor, base: DRAFT.card.baseTopFactor } : { plate: 1, base: 1 };
  const s = sess.model.solve(u);
  const e = view.explode;
  const pad = Math.max(16, Math.min(card.w, card.h) * 0.07);
  const B = sess.pkg.bounds;
  const Pr = projector(view, card, B, zRange(sess, e), pad);
  if (!gpuReady(card)) return { s, Pr, drawn: null };
  const main = card.ctx;
  main.setTransform(card.dpr, 0, 0, card.dpr, 0, 0);
  main.globalCompositeOperation = "source-over";
  main.globalAlpha = 1;
  main.lineJoin = "round";
  main.lineCap = "round";
  paper(card, T, sess.cache.paper);
  const W = worldSolids(sess.prepared, sess.model, sess.parts, s, u, e, (p) => (view.base || !p.base) && LD.solid(p.s.detail));
  const list = slices(W, sess.cache.slices).sort(
    (a, b) => a.top - b.top || (a.w.p.inset ? 0 : 1) - (b.w.p.inset ? 0 : 1) || Pr.key(...a.w.c) - Pr.key(...b.w.c) || a.z0 - b.z0,
  );
  const ink = T.ink;
  const SK = DRAFT.sketch;
  // construction lines along the base plate's straight edges, past its rounded corners (under everything, SD9)
  const base = W.find((w) => w.p.base);
  if (base && SK.overshoot > 0) {
    const [x0, y0, x1, y1] = base.bb;
    const z = base.z1;
    const o = SK.overshoot / Pr.s;
    main.beginPath();
    for (const [a, b] of [[[x0 - o, y1], [x1 + o, y1]], [[x0 - o, y0], [x1 + o, y0]], [[x0, y0 - o], [x0, y1 + o]], [[x1, y0 - o], [x1, y1 + o]]] as [Vec2, Vec2][]) {
      const p = Pr.P(a[0], a[1], z);
      const q = Pr.P(b[0], b[1], z);
      main.moveTo(p[0], p[1]);
      main.lineTo(q[0], q[1]);
    }
    main.lineWidth = SK.width;
    main.strokeStyle = paint(ink, SK.alpha);
    main.stroke();
  }
  const r = drawSolids({ card, prepared: sess.prepared, own: sess.gpu, T, LD, cardK, Pr, main, list });
  sess.gpu = r.own;
  const heads = r.heads;
  // chain centrelines through every joint head (SD6)
  const C = DRAFT.centre;
  if (view.tilt < C.maxTilt && Pr.s > C.minScale && heads.length) {
    main.beginPath();
    for (const [x, y, rx, ry] of heads) {
      const ox = rx + C.overshoot;
      const oy = ry + C.overshoot;
      main.moveTo(x - ox, y);
      main.lineTo(x + ox, y);
      main.moveTo(x, y - oy);
      main.lineTo(x, y + oy);
    }
    main.setLineDash([...C.dash]);
    main.lineWidth = C.width;
    main.strokeStyle = paint(ink, C.alpha);
    main.stroke();
    main.setLineDash([]);
  }
  if (view.dims && base) dimensions(card, T, Pr, base.bb, base.z0, base.z1);
  if (LD.effect("grain")) tooth(card, T);
  // traced paths (SD7): fine dotted, the first with a comet at the current point
  const SP = DRAFT.path;
  const tz = (sess.model.traceZ ?? 2 * LAYER) + e * FORM.explode.gap * (sess.pkg.levels.length - 1) * 0.5;
  if (view.overlays.paths !== false)
    Object.values(sess.pkg.traces).forEach((pts, i) => {
      const tr: Vec2[] = [];
      for (let k = 0; k < pts.length; k += 2) tr.push(Pr.P(pts[k]!, pts[k + 1]!, tz));
      const N = tr.length;
      if (N < 2) return;
      main.save();
      main.lineCap = "round";
      main.setLineDash([...SP.dash]);
      main.lineWidth = SP.width;
      main.strokeStyle = paint(T[SP.color], SP.alpha * (i ? SP.otherGain : 1));
      main.beginPath();
      addPoly(main, tr);
      main.stroke();
      main.setLineDash([]);
      if (i === 0) {
        const idx = Math.round(((((u % TAU) + TAU) % TAU) / TAU) * N);
        const len = Math.min(SP.cometSamples, N >> 1);
        for (let k = 0; k < len; k++) {
          const a = tr[(idx - k - 1 + 10 * N) % N]!;
          const b = tr[(idx - k + 10 * N) % N]!;
          main.beginPath();
          main.moveTo(a[0], a[1]);
          main.lineTo(b[0], b[1]);
          main.lineWidth = (SP.comet - SP.cometMin) * (1 - k / len) + SP.cometMin;
          main.strokeStyle = paint(T[SP.color], (1 - k / len) * SP.cometAlpha);
          main.stroke();
        }
        const pt = tr[idx % N]!;
        main.beginPath();
        main.arc(pt[0], pt[1], SP.headR, 0, TAU);
        main.fillStyle = paint(T.paper);
        main.fill();
        main.lineWidth = SP.headStroke;
        main.strokeStyle = paint(T[SP.color]);
        main.stroke();
      }
      main.restore();
    });
  if (view.highlight) highlight(sess, main, T, Pr, view, W);
  if (view.sheet) sheetFrame(card, T, Pr, view.sheet, view.tilt, LD.label);
  drawOverlays(main, card, Pr, T, sess.model, s, u, view.overlays, tz, sess.pkg.vmax);
  return { s, Pr, drawn: W.length };
}

function highlight(sess: Session, ctx: CanvasRenderingContext2D, T: ReturnType<typeof theme>, Pr: Projector, view: DrawView, W: World[]) {
  const jt = sess.pkg.joints.find((j) => j.id === view.highlight);
  if (!jt) return;
  const top = Math.max(...W.filter((w) => w.p.s.id.startsWith(jt.id)).map((w) => w.z1), 0);
  const [x, y] = Pr.P(jt.at[0], jt.at[1], top);
  const HL = DRAFT.highlight;
  ctx.save();
  ctx.strokeStyle = paint(T[HL.color], HL.alpha);
  ctx.lineWidth = HL.width;
  ctx.setLineDash([...HL.dash]);
  ctx.beginPath();
  ctx.arc(x, y, HL.r, 0, TAU);
  ctx.stroke();
  ctx.setLineDash([]);
  const [l0, l1, l2] = HL.leader;
  ctx.beginPath();
  ctx.moveTo(x + l0, y - l0);
  ctx.lineTo(x + l1, y - l1);
  ctx.lineTo(x + l2, y - l1);
  ctx.stroke();
  ctx.font = font(DRAFT.type.callout);
  ctx.fillStyle = paint(T[HL.color]);
  ctx.textBaseline = "bottom";
  ctx.fillText((jt.title.split("·")[0] ?? jt.id).trim().toUpperCase(), x + HL.labelOffset, y - HL.labelOffset);
  ctx.restore();
}
