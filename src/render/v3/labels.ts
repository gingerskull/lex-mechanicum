// Mono labels on a paper panel with an ink hairline (SD14, SD22), placed so two never overlap and none leaves the canvas.
// The panel and text styles are the overlays' (src/style/draft.ts overlays.*); the colour is the caller's.
import { DRAFT } from "../../style/draft";
import { font, rgba as paint, type ResolvedTheme } from "../../style/theme";

const O = DRAFT.overlays;

/** Lettering at a place; `cands` are the points on screen the label could hang on instead (a construction label, SD22). */
export type Labeler = (text: string, x: number, y: number, col: string, small?: boolean, cands?: [number, number][]) => void;

/**
 * Lettering in capitals (SF7) that keeps Greek letters as written: they name quantities (β, γ, ω), and their capitals
 * read as other letters (Β as B) or as other quantities (Γ for γ).
 */
export const capitals = (text: string): string => text.replace(/[^\u0370-\u03ff]+/g, (s) => s.toUpperCase());

export function labeler(ctx: CanvasRenderingContext2D, T: ResolvedTheme, w: number, h: number): Labeler {
  const placed: [number, number, number, number][] = [];
  const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
  return (text, x, y, col, small) => {
    const t = DRAFT.type.uppercase ? capitals(text) : text;
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

/** A filled arrowhead at `to`, pointing away from `from`. */
export function arrowHead(ctx: CanvasRenderingContext2D, from: readonly [number, number], to: readonly [number, number], size: number, angle: number = O.arrowAngle): void {
  const a = Math.atan2(to[1] - from[1], to[0] - from[0]);
  ctx.beginPath();
  ctx.moveTo(to[0], to[1]);
  ctx.lineTo(to[0] - size * Math.cos(a - angle), to[1] - size * Math.sin(a - angle));
  ctx.lineTo(to[0] - size * Math.cos(a + angle), to[1] - size * Math.sin(a + angle));
  ctx.closePath();
  ctx.fill();
}

// ---------------------------------------------------------------------------------------------- construction labels

/** A construction label in one frame: its text and the points on screen it could hang on (CSS px), its overlay's order. */
export interface LabelSpot {
  /** What it reads in this frame (a dimension carries its live value), and the overlay's own label, which names it. */
  text: string;
  base: string;
  cands: [number, number][];
}

/** How the construction labels are laid out (SD22): in rails at the sides with leaders, as numbered markers, or not. */
export type LabelMode = "rails" | "markers" | "none";

/** One construction label's place for a view: the candidate it hangs on, its side, and its slot's height (rails). */
export interface LabelItem {
  key: string;
  /** Its number in the record's order, from 0 (the key under a phone's stage counts from 1). */
  n: number;
  text: string;
  cand: number;
  side: 0 | 1;
  y: number;
}

/** Where a view's construction labels go, fixed until the view changes. */
export interface LabelPlan {
  mode: "rails" | "markers";
  /** Room the drawing leaves for the rails, CSS px (0 where a side has no labels). */
  left: number;
  right: number;
  items: LabelItem[];
}

/** One label's steadiest anchor over a cycle: which candidate, and where it sits on average. */
export interface Steady {
  key: string;
  n: number;
  text: string;
  cand: number;
  mean: [number, number];
}

/** A label's key in the frame: its overlay's label and how many labels of that name came before it. */
export function spotKeys(spots: LabelSpot[]): string[] {
  const seen = new Map<string, number>();
  return spots.map((s) => {
    const n = seen.get(s.base) ?? 0;
    seen.set(s.base, n + 1);
    return `${s.base}#${n}`;
  });
}

/**
 * For each label, the candidate that moves least over a cycle's samples (an element fixed to the ground does not move
 * at all), and its mean place: the leader then barely moves, and the slot is set from where the label sits on average.
 */
export function steadiest(samples: LabelSpot[][]): Steady[] {
  const by = new Map<string, { text: string; pts: [number, number][][] }>();
  for (const frame of samples) {
    const keys = spotKeys(frame);
    frame.forEach((s, i) => {
      const e = by.get(keys[i]!) ?? { text: s.base, pts: [] };
      s.cands.forEach((c, k) => (e.pts[k] ??= []).push(c));
      by.set(keys[i]!, e);
    });
  }
  const out: Steady[] = [];
  for (const [key, e] of by) {
    let best = 0;
    let spread = Infinity;
    let mean: [number, number] = [0, 0];
    e.pts.forEach((pts, k) => {
      if (!pts.length) return;
      const mx = pts.reduce((a, p) => a + p[0], 0) / pts.length;
      const my = pts.reduce((a, p) => a + p[1], 0) / pts.length;
      const v = pts.reduce((a, p) => a + (p[0] - mx) ** 2 + (p[1] - my) ** 2, 0) / pts.length;
      // a later candidate wins only when it is clearly steadier (the first is the overlay's own place for the label)
      if (v + 1 < spread) {
        spread = v;
        best = k;
        mean = [mx, my];
      }
    });
    out.push({ key, n: out.length, text: e.text, cand: best, mean });
  }
  return out;
}

/** The rails' sides and widths from where the labels sit: a label goes to the side of the drawing it is on. */
export function railSides(items: Steady[], centreX: number, width: (t: string) => number): { sides: Map<string, 0 | 1>; left: number; right: number } {
  const R = O.rail;
  const sides = new Map<string, 0 | 1>();
  let left = 0;
  let right = 0;
  for (const it of items) {
    const side: 0 | 1 = it.mean[0] < centreX ? 0 : 1;
    sides.set(it.key, side);
    const w = Math.min(R.maxW, width(DRAFT.type.uppercase ? capitals(it.text) : it.text) + R.shoulder + 2 * R.gap + R.edge);
    if (side === 0) left = Math.max(left, w);
    else right = Math.max(right, w);
  }
  return { sides, left, right };
}

/** The slots: each side's labels in the order of their mean height, at that height, pushed apart, kept in the rail. */
export function railSlots(items: Steady[], sides: Map<string, 0 | 1>, top: number, bottom: [number, number]): LabelItem[] {
  const R = O.rail;
  const out: LabelItem[] = [];
  for (const side of [0, 1] as const) {
    const list = items.filter((it) => (sides.get(it.key) ?? 0) === side).sort((a, b) => a.mean[1] - b.mean[1]);
    const ys: number[] = [];
    list.forEach((it, i) => ys.push(Math.max(it.mean[1], i ? ys[i - 1]! + R.spacing : top)));
    for (let i = ys.length - 1; i >= 0; i--) ys[i] = Math.min(ys[i]!, i === ys.length - 1 ? bottom[side] : ys[i + 1]! - R.spacing);
    for (let i = 0; i < ys.length; i++) ys[i] = Math.max(ys[i]!, i ? ys[i - 1]! + R.spacing : top);
    list.forEach((it, i) => out.push({ key: it.key, n: it.n, text: it.text, cand: it.cand, side, y: ys[i]! }));
  }
  return out;
}

/** Draws the rails: each label in its slot, with a drafting leader (a shoulder, then a straight line) to its anchor now. */
export function drawRails(ctx: CanvasRenderingContext2D, T: ResolvedTheme, plan: LabelPlan, spots: LabelSpot[], frame: { x0: number; x1: number }, focus: number | null): void {
  const R = O.rail;
  const keys = spotKeys(spots);
  ctx.save();
  ctx.font = font(DRAFT.type.overlaySmall);
  ctx.textBaseline = "middle";
  for (const it of plan.items) {
    const k = keys.indexOf(it.key);
    const at = k >= 0 ? (spots[k]!.cands[it.cand] ?? spots[k]!.cands[0]) : undefined;
    // what it reads now (a dimension's live value), else its name
    const now = k >= 0 ? spots[k]!.text : it.text;
    const t = DRAFT.type.uppercase ? capitals(now) : now;
    const lit = focus === null || focus === it.n;
    // the rail's inner edge is where the drawing's room starts; the lettering stands outside the shoulder
    const inner = it.side === 0 ? frame.x0 + plan.left - R.edge : frame.x1 - plan.right + R.edge;
    const xText = it.side === 0 ? inner - R.shoulder - R.gap : inner + R.shoulder + R.gap;
    ctx.globalAlpha = lit ? 1 : R.dim;
    ctx.fillStyle = paint(T.ink, R.textAlpha);
    ctx.textAlign = it.side === 0 ? "right" : "left";
    ctx.fillText(t, xText, it.y + 0.5);
    if (!at) continue;
    const s0 = it.side === 0 ? xText + R.gap * 0.5 : xText - R.gap * 0.5;
    ctx.strokeStyle = paint(T.ink, R.leaderAlpha);
    ctx.lineWidth = R.leaderWidth;
    ctx.beginPath();
    ctx.moveTo(s0, it.y);
    ctx.lineTo(inner, it.y);
    ctx.lineTo(at[0], at[1]);
    ctx.stroke();
    ctx.fillStyle = paint(T.ink, R.leaderAlpha);
    ctx.beginPath();
    ctx.arc(at[0], at[1], R.dot, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

/** Draws the numbered markers at the labels' anchors now (a phone's stage; the key is under it), the picked one in accent. */
export function drawMarkers(ctx: CanvasRenderingContext2D, T: ResolvedTheme, plan: LabelPlan, spots: LabelSpot[], focus: number | null): void {
  const M = O.marker;
  const keys = spotKeys(spots);
  const placed: [number, number][] = [];
  ctx.save();
  ctx.font = font(DRAFT.type.overlaySmall);
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  for (const it of [...plan.items].sort((a, b) => a.n - b.n)) {
    const k = keys.indexOf(it.key);
    if (k < 0) continue;
    const at = spots[k]!.cands[it.cand] ?? spots[k]!.cands[0];
    if (!at) continue;
    // beside the anchor, up and to the right, and clear of the markers already drawn
    const x = at[0] + M.offset;
    let y = at[1] - M.offset;
    for (let n = 0; n < 8; n++) {
      const hit = placed.find((p) => Math.hypot(p[0] - x, p[1] - y) < 2 * M.r + 2);
      if (!hit) break;
      y = hit[1] + 2 * M.r + 3;
    }
    placed.push([x, y]);
    const lit = focus === it.n;
    ctx.globalAlpha = focus === null || lit ? 1 : M.dim;
    ctx.strokeStyle = paint(T.ink, M.leaderAlpha);
    ctx.lineWidth = M.leaderWidth;
    ctx.beginPath();
    ctx.moveTo(at[0], at[1]);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.fillStyle = paint(T.paper, 0.95);
    ctx.strokeStyle = lit ? paint(T.accent) : paint(T.ink, 0.85);
    ctx.lineWidth = lit ? M.width * 1.6 : M.width;
    ctx.beginPath();
    ctx.arc(x, y, M.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = lit ? paint(T.accent) : paint(T.ink, 0.9);
    ctx.fillText(String(it.n + 1), x, y + 0.5);
  }
  ctx.restore();
}
