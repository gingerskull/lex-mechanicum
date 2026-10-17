// The drafting frame (style Part IV, paint order SD). Every solid is a paper surface that partly hides what is behind
// it, with its role pattern on the top face. Every edge is drawn twice: a full-weight line on a lines layer that later
// surfaces erase where they cover it, and a thin dashed copy on the frame, so an edge seen through a part reads as a
// hidden line. Fine detail lives only on the lines layer and disappears behind parts. One accent; everything else ink.
import { TAU, area, type Vec2 } from "../core/geom";
import type { Solved } from "../model/types";
import { DRAFT, type RoleSurface, type SurfaceKey } from "../style/draft";
import { FORM } from "../style/form";
import { font, theme, rgba as paint } from "../style/theme";
import type { ThemeKey } from "../style/tokens";
import { layer } from "./canvas";
import { ladder, type Dial } from "./detail";
import { drawOverlays, type OverlayFlags } from "./overlays";
import { fillPattern } from "./patterns";
import { projector, type Projector } from "./projector";
import { dimensions, paper, sheetFrame, tooth, type SheetInfo } from "./sheet";
import { slices, wallPath, wallsOf } from "./slices";
import type { Session } from "./session";
import { worldPts, worldSolids, type World } from "./world";
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

const PLATE = new Set(["part", "plate", "bracket", "bridge", "housing", "base"]);
const L = DRAFT.lines;
const F = DRAFT.fill;

const addPoly = (c: CanvasRenderingContext2D, P: Vec2[], close = true) => {
  if (!P.length) return;
  c.moveTo(P[0]![0], P[0]![1]);
  for (let i = 1; i < P.length; i++) c.lineTo(P[i]![0], P[i]![1]);
  if (close) c.closePath();
};

function bbox(P: Vec2[]): [number, number, number, number] {
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  for (const [x, y] of P) {
    if (x < x0) x0 = x;
    if (x > x1) x1 = x;
    if (y < y0) y0 = y;
    if (y > y1) y1 = y;
  }
  return [x0, y0, x1, y1];
}

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

export function drawFrame(sess: Session, u: number, view: DrawView): { s: Solved; Pr: Projector; drawn: number } {
  const card = sess.card;
  const T = theme(view.theme);
  const LD = ladder(view.detail, view);
  const s = sess.model.solve(u);
  const e = view.explode;
  const pad = Math.max(16, Math.min(card.w, card.h) * 0.07);
  const B = sess.pkg.bounds;
  const Pr = projector(view, card, B, zRange(sess, e), pad);
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
  const lx = layer(card, sess.cache.lines);
  lx.lineJoin = "round";
  lx.lineCap = "round";
  const ink = T.ink;
  const SK = DRAFT.sketch;
  const hidden = LD.effect("hiddenLines");
  const heads: [number, number, number, number][] = [];
  const at = (pts: Vec2[], z: number) => pts.map((q) => Pr.P(q[0], q[1], z));
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
  // pen: the full line goes to the lines layer; the frame gets it thin and dashed, a hidden line where it is covered
  const pen = (build: (c: CanvasRenderingContext2D) => void, width: number, alpha: number, withHidden = true) => {
    lx.beginPath();
    build(lx);
    lx.lineWidth = width;
    lx.strokeStyle = paint(ink, alpha);
    lx.stroke();
    if (withHidden && hidden) {
      main.beginPath();
      build(main);
      main.lineWidth = width * L.hidden.width;
      main.setLineDash([...L.hidden.dash]);
      main.strokeStyle = paint(ink, alpha * L.hidden.alpha);
      main.stroke();
      main.setLineDash([]);
    }
  };
  // surface: paper over the frame by alpha, and the lines layer erased by the occlusion
  const surface = (build: (c: CanvasRenderingContext2D) => void, paperA: number, occ: number, rule: CanvasFillRule) => {
    main.beginPath();
    build(main);
    main.fillStyle = paint(T.paper, paperA);
    main.fill(rule);
    lx.beginPath();
    build(lx);
    lx.globalCompositeOperation = "destination-out";
    lx.fillStyle = paint([0, 0, 0], Math.max(0, Math.min(1, occ)));
    lx.fill(rule);
    lx.globalCompositeOperation = "source-over";
  };
  const face = (c: CanvasRenderingContext2D, T2: { outer: Vec2[]; holes: Vec2[][] }) => {
    addPoly(c, T2.outer);
    for (const h of T2.holes) addPoly(c, h);
  };
  for (const S of list) {
    const w = S.w as World;
    const p = w.p;
    const fa = p.faint ? 0.5 : 1;
    main.globalAlpha = lx.globalAlpha = fa;
    const isBase = p.base;
    const isPlate = PLATE.has(p.s.kind) && p.s.role !== "trace";
    const R: RoleSurface = (isBase ? DRAFT.role.base : DRAFT.role[p.s.role as SurfaceKey]) ?? DRAFT.role.link;
    // a see-through solid covers once, at its top face: its inner slices and walls add no paper over the zone
    const see = p.seeThrough ? F.seeThrough : null;
    const seeK = see ? (S.isTop ? 1 : 0) : 1;
    const occ = (isBase ? F.occlude.base : isPlate ? F.occlude.plate : F.occlude.other) * (see?.opacity ?? 1) * seeK;
    const faceA = (isBase ? F.base : isPlate ? F.plate : F.other) * (see?.opacity ?? 1) * seeK;
    const Tf = { outer: at(w.outer, S.top), holes: w.holes.map((h) => at(h, S.top)) };
    const B0 = Pr.P(0, 0, S.z0);
    const B1 = Pr.P(0, 0, S.top);
    const d: Vec2 = [B0[0] - B1[0], B0[1] - B1[1]];
    const Wo = wallsOf(Tf.outer, d, area(Tf.outer) > 0 ? 1 : -1, F.wallShade.steps);
    // 1. side walls: paper, then an ink shade stepped by facing
    surface((c) => { for (const bk of Wo.buckets) wallPath(c, bk, d); }, F.wall * (isBase ? F.baseWallGain : 1) * (see?.opacity ?? 1), see ? 0 : occ * F.wallOcclude, "nonzero");
    if (LD.effect("wallShade")) {
      const WS = F.wallShade;
      const n = WS.steps - 1 || 1;
      Wo.buckets.forEach((bk, i) => {
        if (!bk.length) return;
        main.beginPath();
        wallPath(main, bk, d);
        main.fillStyle = paint(ink, WS.shade * (WS.outer.from + (WS.outer.span * i) / n));
        main.fill();
      });
      for (const h of Tf.holes) {
        const hw = wallsOf(h, d, area(h) > 0 ? -1 : 1, WS.steps);
        main.save();
        main.beginPath();
        addPoly(main, h);
        main.clip();
        hw.buckets.forEach((bk, i) => {
          if (!bk.length) return;
          main.beginPath();
          wallPath(main, bk, d);
          main.fillStyle = paint(ink, WS.shade * (WS.hole.from + (WS.hole.span * i) / n));
          main.fill();
        });
        main.restore();
      }
    }
    // 2. the plate's bottom outline before its own top face, so its back edge turns hidden behind it
    if (S.isBottom && isPlate) pen((c) => addPoly(c, at(w.outer, S.z0)), L.plateBottom, L.bottomAlpha);
    // 3. the slice's top face
    surface((c) => face(c, Tf), faceA, occ, "evenodd");
    if (S.isTop) {
      if (R.tint) {
        main.beginPath();
        face(main, Tf);
        main.fillStyle = paint(ink, R.tint);
        main.fill("evenodd");
      }
      if (LD.effect("rolePatterns") && R.pattern !== "none") {
        const path = sess.card.f.path();
        for (const P of [Tf.outer, ...Tf.holes]) {
          path.moveTo(P[0]![0], P[0]![1]);
          for (let i = 1; i < P.length; i++) path.lineTo(P[i]![0], P[i]![1]);
          path.closePath();
        }
        fillPattern(card, main, path, w.pose, S.top, Pr, R, ink, (R.alpha ?? 0) * T.patternGain);
      }
    }
    // threads on shanks and shafts: visible only (DL-B)
    if (w.thr && p.s.thr && FORM.thread.show && LD.mark("thread")) {
      const lo = Math.max(w.thr[0], S.z0);
      const hi = Math.min(w.thr[1], S.top);
      if (hi - lo > 0.05) {
        const pitch = Math.max(FORM.thread.pitch(p.s.thr[0]), FORM.thread.minPitchPx / Pr.s);
        const P = w.outer;
        const n = P.length;
        lx.beginPath();
        for (let z = lo; z < hi; z += pitch)
          for (let i = 0; i < n; i++) {
            if (!Wo.vis[i]) continue;
            const za = z + (pitch * i) / n;
            const zb = z + (pitch * (i + 1)) / n;
            if (zb > hi) break;
            const a = Pr.P(P[i]![0], P[i]![1], za);
            const b = Pr.P(P[(i + 1) % n]![0], P[(i + 1) % n]![1], zb);
            lx.moveTo(a[0], a[1]);
            lx.lineTo(b[0], b[1]);
          }
        lx.lineWidth = L.thread;
        lx.strokeStyle = paint(ink, L.threadAlpha);
        lx.stroke();
      }
    }
    // 4. silhouettes down the walls; on inner slices only while DL-C is drawn
    if (S.isTop || LD.effect("innerSilhouettes"))
      pen(
        (c) => {
          const P = Tf.outer;
          const n = P.length;
          let lo = 0;
          let hi = 0;
          for (let i = 0; i < n; i++) {
            if (P[i]![0] < P[lo]![0]) lo = i;
            if (P[i]![0] > P[hi]![0]) hi = i;
          }
          for (const i of [lo, hi]) {
            c.moveTo(P[i]![0], P[i]![1]);
            c.lineTo(P[i]![0] + d[0], P[i]![1] + d[1]);
          }
          for (let i = 0; i < n; i++)
            if (Wo.vis[i] !== Wo.vis[(i - 1 + n) % n]) {
              c.moveTo(P[i]![0], P[i]![1]);
              c.lineTo(P[i]![0] + d[0], P[i]![1] + d[1]);
            }
        },
        L.silhouette,
        L.silhouetteAlpha,
        false,
      );
    if (S.isTop) {
      if (p.edges && Pr.s > L.chamferMinScale && LD.mark("chamfer")) {
        lx.beginPath();
        for (const k of p.edges) addPoly(lx, at(worldPts(k, w.pose), S.top));
        lx.lineWidth = L.chamfer;
        lx.strokeStyle = paint(ink, L.chamferAlpha * (isBase ? L.baseChamferGain : 1));
        lx.stroke();
      }
      const shown = p.marks.filter((m) => LD.mark(m.kind));
      if (shown.length) {
        lx.beginPath();
        for (const m of shown) addPoly(lx, at(worldPts(m.pts, w.pose), S.top), m.pts.length > 2 && m.kind !== "engrave" && m.kind !== "scale");
        lx.lineWidth = L.marks;
        lx.strokeStyle = paint(ink, L.marksAlpha * (isBase ? L.baseMarksGain : 1));
        lx.stroke();
      }
      pen((c) => face(c, Tf), isBase ? L.baseTop : isPlate ? L.plateTop : L.otherTop, 1);
      // a second, offset pencil pass round the base plate: the one loose line on the sheet
      if (isBase && SK.doubleAlpha > 0) {
        const o = SK.doubleOffset;
        lx.save();
        lx.translate(o, o * SK.doubleOffsetY);
        lx.beginPath();
        addPoly(lx, Tf.outer);
        lx.lineWidth = SK.width;
        lx.strokeStyle = paint(ink, SK.doubleAlpha);
        lx.stroke();
        lx.restore();
      }
      if (p.accent) {
        const AR = L.accentRing;
        const [a0, b0, a1, b1] = bbox(Tf.outer);
        const cx = (a0 + a1) / 2;
        const cy = (b0 + b1) / 2;
        for (const c of [lx, main]) {
          c.beginPath();
          c.ellipse(cx, cy, (a1 - a0) * AR.radius, (b1 - b0) * AR.radius, 0, 0, TAU);
          c.lineWidth = AR.width;
          c.strokeStyle = paint(T[AR.color], c === lx ? AR.alpha : AR.hiddenAlpha);
          c.stroke();
        }
      }
      if (p.headTop) {
        const bb = bbox(Tf.outer);
        const q = Pr.P(w.c[0], w.c[1], S.top);
        heads.push([q[0], q[1], (bb[2] - bb[0]) / 2, (bb[3] - bb[1]) / 2]);
      }
    }
    if (S.isBottom && !isPlate)
      pen(
        (c) => {
          const P = Tf.outer;
          for (let i = 0; i < P.length; i++) {
            if (!Wo.vis[i]) continue;
            const a = P[i]!;
            const b = P[(i + 1) % P.length]!;
            c.moveTo(a[0] + d[0], a[1] + d[1]);
            c.lineTo(b[0] + d[0], b[1] + d[1]);
          }
        },
        L.edge,
        L.edgeAlpha,
        false,
      );
  }
  main.globalAlpha = 1;
  lx.globalAlpha = 1;
  main.save();
  main.setTransform(1, 0, 0, 1, 0, 0);
  main.drawImage(sess.cache.lines.c as unknown as CanvasImageSource, 0, 0);
  main.restore();
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
