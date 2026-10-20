// Overlays (SD14): forces, angles and velocity over the drawing, never changing it. Models give geometry and short keys;
// the text is formatted here.
import { wrap, type Vec2 } from "../core/geom";
import { velocity } from "../model/pose";
import type { MechanismModel, OverlayItem, Solved } from "../model/types";
import { DRAFT } from "../style/draft";
import type { ColorName } from "../style/tokens";
import { LAYER } from "../parts";
import { font, rgba as paint, type ResolvedTheme } from "../style/theme";
import type { Projector } from "./projector";

const O = DRAFT.overlays;

export interface OverlayFlags {
  paths?: boolean;
  velocity?: boolean;
  forces?: boolean;
  angles?: boolean;
}

/** Label text of an overlay item from its key and value. */
export function labelOf(it: OverlayItem): string | null {
  if (!it.key) return null;
  if (it.type === "angle") return it.value === undefined ? it.key : `${it.key} ${Math.round(it.value)}°`;
  if (it.type === "axial") return `${it.key}: push / pull`;
  if (it.type === "bend") return `${it.key} ${(Math.abs(it.bend) * 180 / Math.PI).toFixed(1)}°`;
  return it.key;
}

function arrowHead(ctx: CanvasRenderingContext2D, from: Vec2, to: Vec2, size: number) {
  const a = Math.atan2(to[1] - from[1], to[0] - from[0]);
  ctx.beginPath();
  ctx.moveTo(to[0], to[1]);
  ctx.lineTo(to[0] - size * Math.cos(a - O.arrowAngle), to[1] - size * Math.sin(a - O.arrowAngle));
  ctx.lineTo(to[0] - size * Math.cos(a + O.arrowAngle), to[1] - size * Math.sin(a + O.arrowAngle));
  ctx.closePath();
  ctx.fill();
}

type Labeler = (text: string, x: number, y: number, col: string, small?: boolean) => void;

function labeler(ctx: CanvasRenderingContext2D, T: ResolvedTheme, w: number, h: number): Labeler {
  const placed: [number, number, number, number][] = [];
  const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
  return (text, x, y, col, small) => {
    const t = DRAFT.type.uppercase ? text.toUpperCase() : text;
    ctx.font = font(small ? DRAFT.type.overlaySmall : DRAFT.type.overlay);
    const lw = ctx.measureText(t).width + 2 * O.labelPadX;
    const lh = small ? O.labelHSmall : O.labelH;
    const e = O.labelEdge;
    x = clamp(x - lw / 2, e, w - lw - e);
    y = clamp(y - lh / 2, e, h - lh - e);
    for (let k = 0; k < 8; k++) {
      const hit = placed.find((r) => x < r[0] + r[2] + 2 && x + lw + 2 > r[0] && y < r[1] + r[3] + 2 && y + lh + 2 > r[1]);
      if (!hit) break;
      y = clamp(hit[1] + hit[3] + O.labelSpacing, e, h - lh - e);
    }
    placed.push([x, y, lw, lh]);
    ctx.fillStyle = paint(T[O.panel.color], O.panel.alpha);
    ctx.fillRect(x, y, lw, lh);
    ctx.lineWidth = O.labelBorder;
    ctx.strokeStyle = paint(T[O.border.color], O.border.alpha);
    ctx.strokeRect(x, y, lw, lh);
    ctx.fillStyle = col;
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    ctx.fillText(t, x + O.labelPadX, y + lh / 2 + 0.5);
  };
}

type Item = OverlayItem | { type: "force"; a: Vec2; b: Vec2; key?: string; z?: number };

function drawItem(ctx: CanvasRenderingContext2D, Pr: Projector, it: Item, col: string, label: Labeler, zDef: number, text: string | null) {
  const P = (q: Vec2) => Pr.P(q[0], q[1], it.z !== undefined ? it.z * LAYER : zDef);
  const s = Pr.s * Math.max(0.35, Pr.ct);
  ctx.strokeStyle = col;
  ctx.fillStyle = col;
  ctx.lineWidth = O.width;
  ctx.setLineDash([]);
  if (it.type === "force") {
    const a = P(it.a);
    const b = P(it.b);
    ctx.beginPath();
    ctx.moveTo(a[0], a[1]);
    ctx.lineTo(b[0], b[1]);
    ctx.stroke();
    arrowHead(ctx, a, b, O.arrow);
    if (text) {
      const dx = b[0] - a[0];
      const dy = b[1] - a[1];
      const L = Math.hypot(dx, dy) || 1;
      label(text, b[0] + (dx / L) * 16, b[1] + (dy / L) * 14, col);
    }
  } else if (it.type === "axial") {
    const a = P(it.a);
    const b = P(it.b);
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const L = Math.hypot(dx, dy) || 1;
    const ux = dx / L;
    const uy = dy / L;
    const e = O.axialOvershoot;
    const a2: Vec2 = [a[0] - ux * e, a[1] - uy * e];
    const b2: Vec2 = [b[0] + ux * e, b[1] + uy * e];
    ctx.setLineDash([...O.axialDash]);
    ctx.beginPath();
    ctx.moveTo(a2[0], a2[1]);
    ctx.lineTo(b2[0], b2[1]);
    ctx.stroke();
    ctx.setLineDash([]);
    arrowHead(ctx, a, a2, O.arrowSmall);
    arrowHead(ctx, b, b2, O.arrowSmall);
    if (text) label(text, (a[0] + b[0]) / 2 + uy * 20, (a[1] + b[1]) / 2 - ux * 20, col);
  } else if (it.type === "angle") {
    const c = P(it.c);
    const a = P(it.a);
    const b = P(it.b);
    const r = (it.r || O.angleR) * s;
    const t0 = Math.atan2(a[1] - c[1], a[0] - c[0]);
    const dt = wrap(Math.atan2(b[1] - c[1], b[0] - c[0]) - t0);
    const G = O.angleGuide;
    ctx.lineWidth = G.width;
    ctx.globalAlpha = G.alpha;
    ctx.setLineDash([...G.dash]);
    ctx.beginPath();
    for (const t of [t0, t0 + dt]) {
      ctx.moveTo(c[0], c[1]);
      ctx.lineTo(c[0] + Math.cos(t) * r * G.reach, c[1] + Math.sin(t) * r * G.reach);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.setLineDash([]);
    ctx.lineWidth = O.angleArc;
    ctx.beginPath();
    ctx.arc(c[0], c[1], r, t0, t0 + dt, dt < 0);
    ctx.stroke();
    const mid = t0 + dt / 2;
    if (text) label(text, c[0] + Math.cos(mid) * (r + 34), c[1] + Math.sin(mid) * (r + 16), col);
  } else if (it.type === "bend") {
    // the neck's centreline bent at a constant curvature through `bend` over its length, from its root
    const B = O.bend;
    const u: Vec2 = [Math.cos(it.a), Math.sin(it.a)];
    const n: Vec2 = [-u[1], u[0]];
    const root: Vec2 = [it.c[0] - (u[0] * it.L) / 2, it.c[1] - (u[1] * it.L) / 2];
    const N = 16;
    const k = it.bend / (it.L || 1);
    const at = (t: number): Vec2 => {
      const s = t * it.L;
      const x = Math.abs(k) < 1e-9 ? s : Math.sin(k * s) / k;
      const y = Math.abs(k) < 1e-9 ? 0 : (1 - Math.cos(k * s)) / k;
      return [root[0] + u[0] * x + n[0] * y, root[1] + u[1] * x + n[1] * y];
    };
    ctx.lineWidth = B.width;
    ctx.beginPath();
    for (let i = 0; i <= N; i++) {
      const q = P(at(i / N));
      if (i) ctx.lineTo(q[0], q[1]);
      else ctx.moveTo(q[0], q[1]);
    }
    ctx.stroke();
    // the stress zone: ticks across the neck on the side in tension and the side in compression
    ctx.globalAlpha = B.zoneAlpha;
    ctx.beginPath();
    for (let i = 1; i < B.ticks + 1; i++) {
      const t = i / (B.ticks + 1);
      for (const side of [-1, 1]) {
        const a = P([it.c[0] + u[0] * (t - 0.5) * it.L + n[0] * side * (it.w / 2), it.c[1] + u[1] * (t - 0.5) * it.L + n[1] * side * (it.w / 2)]);
        const b = P([it.c[0] + u[0] * (t - 0.5) * it.L + n[0] * side * (it.w / 2 + 2), it.c[1] + u[1] * (t - 0.5) * it.L + n[1] * side * (it.w / 2 + 2)]);
        ctx.moveTo(a[0], a[1]);
        ctx.lineTo(b[0], b[1]);
      }
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
    const e = P(at(1));
    if (text) label(text, e[0] + 18, e[1] - 14, col);
  } else if (it.type === "spin") {
    const c = P(it.c);
    const r = (it.r || O.spinR) * s;
    const dir = it.dir || 1;
    const t0 = -2.4;
    const t1 = -0.9;
    ctx.beginPath();
    ctx.arc(c[0], c[1], r, t0, t1);
    ctx.stroke();
    const tip = dir > 0 ? t0 : t1;
    const from = dir > 0 ? t0 + 0.2 : t1 - 0.2;
    const e: Vec2 = [c[0] + r * Math.cos(tip), c[1] + r * Math.sin(tip)];
    const e0: Vec2 = [c[0] + r * Math.cos(from), c[1] + r * Math.sin(from)];
    arrowHead(ctx, e0, [e[0] + (e[0] - e0[0]) * 0.6, e[1] + (e[1] - e0[1]) * 0.6], O.arrowSmall);
    if (text) label(text, c[0] + r * Math.cos(-1.65), c[1] + r * Math.sin(-1.65) - 14, col);
  }
}

const col = (T: ResolvedTheme, k: { color: ColorName; alpha: number }) => paint(T[k.color], k.alpha);

export function drawOverlays(
  ctx: CanvasRenderingContext2D,
  size: { w: number; h: number },
  Pr: Projector,
  T: ResolvedTheme,
  model: MechanismModel,
  s: Solved,
  u: number,
  ov: OverlayFlags,
  zTrace: number,
  vmax: Record<string, number>,
): void {
  ctx.save();
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
  ctx.lineCap = "round";
  const label = labeler(ctx, T, size.w, size.h);
  if (ov.angles && model.angles)
    for (const it of model.angles(s, u)) drawItem(ctx, Pr, it, col(T, it.type === "angle" && it.warn ? O.forcesWarn : O.angles), label, zTrace, labelOf(it));
  if (ov.velocity && model.vel)
    for (const k of model.vel) {
      const v = velocity(model, u, k);
      const sp = Math.hypot(v[0], v[1]);
      const max = vmax[k] || 1;
      const L = (O.velocityLen * sp) / max;
      const a = s.pts[k];
      if (L < O.velocityMin || !a) continue;
      // the arrow is a screen length: convert back to mm at this scale
      const mm = L / (Pr.s || 1);
      const it = { type: "force" as const, a, b: [a[0] + (v[0] / sp) * mm, a[1] + (v[1] / sp) * mm] as Vec2 };
      drawItem(ctx, Pr, it, col(T, O.velocity), label, zTrace, model.vel.length < 3 ? `v ${Math.round((sp / max) * 100)}%` : null);
    }
  if (ov.forces && model.forces) for (const it of model.forces(s, u)) drawItem(ctx, Pr, it, col(T, O.forces), label, zTrace, labelOf(it));
  ctx.restore();
}

