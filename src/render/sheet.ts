// The drawing sheet (SD8, SD10): paper with its grid, the frame with zones, the title block, the base-plate dimensions.
import { DRAFT } from "../style/draft";
import { TOKENS } from "../style/tokens";
import { font, rgba as paint, type ResolvedTheme } from "../style/theme";
import { layer, type Card, type CanvasLike } from "./canvas";
import { noise } from "./patterns";
import type { Projector } from "./projector";

const S = DRAFT.sheet;
const up = (t: string) => (DRAFT.type.uppercase ? t.toUpperCase() : t);

/** The paper and its grid, cached per sheet and size (paint order step 1). */
export function paper(card: Card, T: ResolvedTheme, cache: { c?: CanvasLike; key?: string }): void {
  const key = `${T.key}:${card.cw}x${card.ch}`;
  if (!cache.c || cache.key !== key) {
    const x = layer(card, cache);
    cache.key = key;
    const { w, h } = card;
    const [fx, fy] = DRAFT.paper.centre;
    const g = x.createRadialGradient(w * fx, h * fy, 0, w * fx, h * fy, Math.max(w, h) * DRAFT.paper.radius);
    g.addColorStop(0, paint(T.paper));
    g.addColorStop(1, paint(T.paperEdge));
    x.fillStyle = g;
    x.fillRect(0, 0, w, h);
    const st = TOKENS.size.grid;
    const cx = w / 2;
    const cy = h / 2;
    for (const major of [false, true]) {
      x.beginPath();
      for (let i = Math.floor(-cx / st); cx + i * st <= w; i++) {
        if ((i % TOKENS.size.gridMajor === 0) !== major) continue;
        const X = Math.round(cx + i * st) + 0.5;
        x.moveTo(X, 0);
        x.lineTo(X, h);
      }
      for (let j = Math.floor(-cy / st); cy + j * st <= h; j++) {
        if ((j % TOKENS.size.gridMajor === 0) !== major) continue;
        const Y = Math.round(cy + j * st) + 0.5;
        x.moveTo(0, Y);
        x.lineTo(w, Y);
      }
      x.lineWidth = major ? DRAFT.grid.majorWidth : DRAFT.grid.minorWidth;
      x.strokeStyle = paint(T.grid, major ? DRAFT.grid.majorAlpha : DRAFT.grid.minorAlpha);
      x.stroke();
    }
  }
  card.ctx.drawImage(cache.c as unknown as CanvasImageSource, 0, 0, card.w, card.h);
}

/** Paper tooth over the drawing (paint order step 7). */
export function tooth(card: Card, T: ResolvedTheme): void {
  if (!T.grain) return;
  const ctx = card.ctx;
  ctx.save();
  ctx.globalAlpha = T.grain;
  ctx.globalCompositeOperation = DRAFT.paper.grainBlend[T.key] as GlobalCompositeOperation;
  const p = ctx.createPattern(noise(card) as unknown as CanvasImageSource, "repeat");
  if (p) {
    ctx.fillStyle = p;
    ctx.fillRect(0, 0, card.w, card.h);
  }
  ctx.restore();
}

export interface SheetInfo {
  title: string;
  no: string;
  sheet?: string;
}

/** Frame, zones and title block. `view` is the tilt; `detail` the dial label (DL4). */
export function sheetFrame(card: Card, T: ResolvedTheme, Pr: Projector, info: SheetInfo, tilt: number, detail: string): void {
  const ctx = card.ctx;
  const i = S.inset;
  const { w, h } = card;
  ctx.save();
  ctx.strokeStyle = paint(T.ink, S.outer.alpha);
  ctx.lineWidth = S.outer.width;
  ctx.strokeRect(i + 0.5, i + 0.5, w - 2 * i - 1, h - 2 * i - 1);
  const o = S.innerOffset;
  ctx.lineWidth = S.inner.width;
  ctx.strokeStyle = paint(T.ink, S.inner.alpha);
  ctx.strokeRect(i + o + 0.5, i + o + 0.5, w - 2 * (i + o) - 1, h - 2 * (i + o) - 1);
  if (S.zones) {
    ctx.font = font(DRAFT.type.zone);
    ctx.fillStyle = paint(T.ink, S.zoneAlpha);
    ctx.strokeStyle = paint(T.ink, S.inner.alpha);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const nx = Math.max(2, Math.round(w / S.zonePitch));
    const ny = Math.max(2, Math.round(h / S.zonePitch));
    ctx.beginPath();
    for (let k = 1; k < nx; k++) {
      const X = Math.round(i + ((w - 2 * i) * k) / nx) + 0.5;
      ctx.moveTo(X, i);
      ctx.lineTo(X, i + S.zoneTick);
      ctx.moveTo(X, h - i);
      ctx.lineTo(X, h - i - S.zoneTick);
    }
    for (let k = 1; k < ny; k++) {
      const Y = Math.round(i + ((h - 2 * i) * k) / ny) + 0.5;
      ctx.moveTo(i, Y);
      ctx.lineTo(i + S.zoneTick, Y);
      ctx.moveTo(w - i, Y);
      ctx.lineTo(w - i - S.zoneTick, Y);
    }
    ctx.stroke();
    const d = S.zoneLabelInset;
    for (let k = 0; k < nx; k++) {
      const X = i + ((w - 2 * i) * (k + 0.5)) / nx;
      ctx.fillText(String(k + 1), X, i + d);
      ctx.fillText(String(k + 1), X, h - i - d);
    }
    for (let k = 0; k < ny; k++) {
      const Y = i + ((h - 2 * i) * (k + 0.5)) / ny;
      const L = String.fromCharCode(65 + k);
      ctx.fillText(L, i + d, Y);
      ctx.fillText(L, w - i - d, Y);
    }
  }
  if (S.titleBlock && w > S.titleMinCanvas) {
    const bw = Math.min(S.titleMaxW, w * S.titleWFrac);
    const rh = S.titleRow;
    const bh = rh * 4;
    const x0 = w - i - o - bw;
    const y0 = h - i - o - bh;
    const c1 = x0 + bw * S.titleSplit;
    ctx.fillStyle = paint(T.paper, S.titlePaper);
    ctx.fillRect(x0, y0, bw, bh);
    ctx.beginPath();
    ctx.rect(x0 + 0.5, y0 + 0.5, bw, bh);
    for (let r = 1; r < 4; r++) {
      ctx.moveTo(x0, y0 + r * rh + 0.5);
      ctx.lineTo(x0 + bw, y0 + r * rh + 0.5);
    }
    ctx.moveTo(c1 + 0.5, y0 + rh);
    ctx.lineTo(c1 + 0.5, y0 + 3 * rh);
    ctx.lineWidth = S.titleRule.width;
    ctx.strokeStyle = paint(T.ink, S.titleRule.alpha);
    ctx.stroke();
    // scale of the drawing against true size on a 96 dpi screen
    const k = Pr.s / (96 / 25.4);
    const sc = k >= 1 ? `${k.toFixed(1)} : 1` : `1 : ${(1 / k).toFixed(1)}`;
    const cell = (key: string, v: string, x: number, y: number, wd: number) => {
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.font = font(DRAFT.type.titleKey);
      ctx.fillStyle = paint(T.ink, S.titleKeyAlpha);
      ctx.fillText(key, x + S.titleKeyX, y + S.titleKeyY);
      ctx.font = font(DRAFT.type.titleValue);
      ctx.fillStyle = paint(T.ink, S.titleValueAlpha);
      let t = v;
      while (t.length > 3 && ctx.measureText(t).width > wd - S.titleValueMargin) t = t.slice(0, -2) + "…";
      ctx.fillText(t, x + S.titleValueX, y + rh / 2 + 0.5);
    };
    const view = tilt <= S.planTilt ? "PLAN" : tilt >= S.elevationTilt ? "ELEVATION" : `TILT ${Math.round(tilt)}°`;
    cell("TITLE", up(info.title), x0, y0, bw);
    cell("DWG", info.no, x0, y0 + rh, c1 - x0);
    cell("SCALE", sc, c1, y0 + rh, x0 + bw - c1);
    cell("VIEW", view, x0, y0 + 2 * rh, c1 - x0);
    cell("SHEET", info.sheet ?? "1/1", c1, y0 + 2 * rh, x0 + bw - c1);
    cell("DETAIL", detail, x0, y0 + 3 * rh, bw);
  }
  ctx.restore();
}

function arrow(ctx: CanvasRenderingContext2D, a: [number, number], b: [number, number], sz: number, ang: number) {
  const t = Math.atan2(b[1] - a[1], b[0] - a[0]);
  ctx.moveTo(b[0], b[1]);
  ctx.lineTo(b[0] - sz * Math.cos(t - ang), b[1] - sz * Math.sin(t - ang));
  ctx.lineTo(b[0] - sz * Math.cos(t + ang), b[1] - sz * Math.sin(t + ang));
  ctx.closePath();
}

/** Overall width and depth of the base plate, labelled in true mm (SD8). */
export function dimensions(card: Card, T: ResolvedTheme, Pr: Projector, box: [number, number, number, number], z0: number, z1: number): void {
  const D = DRAFT.dims;
  if (Pr.ct <= D.minCos) return;
  const ctx = card.ctx;
  const [x0, y0, x1, y1] = box;
  const p = [Pr.P(x0, y0, z0), Pr.P(x1, y0, z0), Pr.P(x1, y1, z1), Pr.P(x1, y0, z1)];
  const yb = Math.max(p[0]![1], p[1]![1]) + D.offset;
  const xr = Math.max(p[2]![0], p[3]![0], p[1]![0]) + D.offset;
  ctx.save();
  ctx.strokeStyle = ctx.fillStyle = paint(T.ink, D.alpha);
  ctx.lineWidth = D.width;
  const a: [number, number] = [p[0]![0], yb];
  const b: [number, number] = [p[1]![0], yb];
  ctx.beginPath();
  ctx.moveTo(a[0], p[0]![1] + D.gap);
  ctx.lineTo(a[0], yb + D.ext);
  ctx.moveTo(b[0], p[1]![1] + D.gap);
  ctx.lineTo(b[0], yb + D.ext);
  ctx.moveTo(a[0], yb);
  ctx.lineTo(b[0], yb);
  ctx.stroke();
  ctx.beginPath();
  arrow(ctx, b, a, D.arrow, D.arrowAngle);
  arrow(ctx, a, b, D.arrow, D.arrowAngle);
  ctx.fill();
  const c: [number, number] = [xr, p[1]![1]];
  const d: [number, number] = [xr, p[2]![1]];
  ctx.beginPath();
  ctx.moveTo(p[1]![0] + D.gap, c[1]);
  ctx.lineTo(xr + D.ext, c[1]);
  ctx.moveTo(p[2]![0] + D.gap, d[1]);
  ctx.lineTo(xr + D.ext, d[1]);
  ctx.moveTo(c[0], c[1]);
  ctx.lineTo(d[0], d[1]);
  ctx.stroke();
  ctx.beginPath();
  arrow(ctx, d, c, D.arrow, D.arrowAngle);
  arrow(ctx, c, d, D.arrow, D.arrowAngle);
  ctx.fill();
  ctx.font = font(DRAFT.type.dims);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const lab = (t: string, x: number, y: number, rot: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    const w = ctx.measureText(t).width + D.labelPad;
    ctx.fillStyle = paint(T.paper, D.labelPaper);
    ctx.fillRect(-w / 2, -D.labelH / 2, w, D.labelH);
    ctx.fillStyle = paint(T.ink, Math.min(1, D.alpha + D.labelGain));
    ctx.fillText(t, 0, 0.5);
    ctx.restore();
  };
  lab(`${Math.round(x1 - x0)}`, (a[0] + b[0]) / 2, yb, 0);
  if (Math.abs(d[1] - c[1]) > D.minDepthPx) lab(`${Math.round(y1 - y0)}`, xr, (c[1] + d[1]) / 2, -Math.PI / 2);
  ctx.restore();
}
