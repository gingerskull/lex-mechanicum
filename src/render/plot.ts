// The output plot (SD15): output against input over one cycle, from the package's 181 samples, with the current phase.
import { TAU } from "../core/geom";
import { DRAFT } from "../style/draft";
import { font, rgba as paint, type ResolvedTheme } from "../style/theme";
import type { Card } from "./canvas";

const PL = DRAFT.plot;

export function drawPlot(card: Card, T: ResolvedTheme, data: ArrayLike<number>, u: number, unit: string): void {
  const ctx = card.ctx;
  const { w, h } = card;
  const m = PL.margin;
  ctx.setTransform(card.dpr, 0, 0, card.dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  const n = data.length;
  let lo = Infinity;
  let hi = -Infinity;
  for (let i = 0; i < n; i++) {
    lo = Math.min(lo, data[i]!);
    hi = Math.max(hi, data[i]!);
  }
  const pad = (hi - lo || 1) * PL.pad;
  lo -= pad;
  hi += pad;
  const X = (i: number) => m.left + ((w - m.left - m.right) * i) / (n - 1);
  const Y = (v: number) => h - m.bottom - ((h - m.top - m.bottom) * (v - lo)) / (hi - lo);
  // value gridlines on round steps
  const raw = (hi - lo) / PL.ticks;
  const p10 = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 5, 10].map((k) => k * p10).find((k) => k >= raw) ?? raw;
  ctx.font = font(DRAFT.type.plot);
  ctx.textBaseline = "middle";
  ctx.textAlign = "right";
  ctx.lineWidth = PL.grid.width;
  ctx.setLineDash([...PL.grid.dash]);
  for (let v = Math.ceil(lo / step) * step; v <= hi; v += step) {
    ctx.strokeStyle = paint(T.ink, PL.grid.alpha);
    ctx.beginPath();
    ctx.moveTo(m.left, Y(v));
    ctx.lineTo(w - m.right, Y(v));
    ctx.stroke();
    ctx.fillStyle = paint(T.ink, PL.labelAlpha);
    ctx.fillText(`${+v.toFixed(2)}${unit}`, m.left - 4, Y(v));
  }
  ctx.setLineDash([]);
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  for (const [k, t] of [[0, "0°"], [0.5, "180°"], [1, "360°"]] as const) ctx.fillText(t, X(k * (n - 1)), h - m.bottom + 6);
  // hatching under the curve, then the curve
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(X(0), h - m.bottom);
  for (let i = 0; i < n; i++) ctx.lineTo(X(i), Y(data[i]!));
  ctx.lineTo(X(n - 1), h - m.bottom);
  ctx.closePath();
  ctx.clip();
  ctx.beginPath();
  for (let x = m.left - h; x < w; x += PL.hatch.pitch) {
    ctx.moveTo(x, h);
    ctx.lineTo(x + h, 0);
  }
  ctx.lineWidth = PL.hatch.width;
  ctx.strokeStyle = paint(T.ink, PL.hatch.alpha);
  ctx.stroke();
  ctx.restore();
  ctx.beginPath();
  for (let i = 0; i < n; i++) (i ? ctx.lineTo : ctx.moveTo).call(ctx, X(i), Y(data[i]!));
  ctx.lineWidth = PL.curve.width;
  ctx.strokeStyle = paint(T.ink, PL.curve.alpha);
  ctx.stroke();
  // the current phase
  const f = (((u % TAU) + TAU) % TAU) / TAU;
  const i = f * (n - 1);
  const k = Math.floor(i);
  const v = data[k]! + (data[Math.min(n - 1, k + 1)]! - data[k]!) * (i - k);
  ctx.strokeStyle = paint(T.accent, PL.cursorAlpha);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(X(i), m.top);
  ctx.lineTo(X(i), h - m.bottom);
  ctx.stroke();
  ctx.fillStyle = paint(T.accent);
  ctx.beginPath();
  ctx.arc(X(i), Y(v), PL.pointR, 0, TAU);
  ctx.fill();
}
