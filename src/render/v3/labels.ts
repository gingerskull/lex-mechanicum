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
export type LabelMode = "callouts" | "rails" | "markers" | "none";

/** One construction label's place for a view: the candidate it hangs on, its side, and its slot's height (rails). */
export interface LabelItem {
  key: string;
  /** A callout's shoulder run before its lettering, CSS px (it carries the lettering clear of the drawing). */
  x?: number;
  /** Its number in the record's order, from 0 (the key under a phone's stage counts from 1). */
  n: number;
  text: string;
  cand: number;
  side: 0 | 1;
  y: number;
}

/** Where a view's construction labels go, fixed until the view changes. */
export interface LabelPlan {
  mode: "callouts" | "rails" | "markers";
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
  // a point several labels share (a pivot two lines start from, an apex where axes meet) would leave their leaders on
  // one dot: each label takes the steadiest of its points clear of the anchors already taken, in the record's order
  const sep = DRAFT.overlays.callout.sep;
  const taken: [number, number][] = [];
  for (const [key, e] of by) {
    const stats = e.pts
      .map((pts, k) => {
        if (!pts.length) return null;
        const mx = pts.reduce((a, p) => a + p[0], 0) / pts.length;
        const my = pts.reduce((a, p) => a + p[1], 0) / pts.length;
        const v = pts.reduce((a, p) => a + (p[0] - mx) ** 2 + (p[1] - my) ** 2, 0) / pts.length;
        // the first is the overlay's own place for the label: a later one wins only when clearly steadier
        return { k, v: k === 0 ? v - 1 : v, mean: [mx, my] as [number, number] };
      })
      .filter((x): x is { k: number; v: number; mean: [number, number] } => !!x)
      .sort((a, b) => a.v - b.v);
    const clear = (m: [number, number]) => Math.min(Infinity, ...taken.map((t) => Math.hypot(t[0] - m[0], t[1] - m[1])));
    const pick = stats.find((s) => clear(s.mean) >= sep) ?? [...stats].sort((a, b) => clear(b.mean) - clear(a.mean))[0];
    if (!pick) continue;
    taken.push(pick.mean);
    out.push({ key, n: out.length, text: e.text, cand: pick.k, mean: pick.mean });
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

// ------------------------------------------------------------------------------------------ elbow callouts (wide)

/**
 * The callouts of a wide stage (SD22): each label rides its element. From the anchor a leader drops straight up or down
 * to the label's row, then a horizontal shoulder runs outboard (away from the drawing's middle), and the lettering sits on
 * the shoulder. The row and side are chosen once for the view, over the whole cycle, so two labels never meet while the
 * drawing plays: each label in the record's order takes the first row, above its anchor then below, whose lettering and
 * drop stay clear of those already placed at every sampled phase, inside the sheet and off the title block.
 */
export function calloutPlan(samples: LabelSpot[][], steady: Steady[], cx: number, area: { w: number; h: number; block: [number, number, number, number] | null; drawn?: (b: [number, number, number, number]) => number }, width: (t: string) => number): LabelItem[] {
  const K = O.callout;
  const th = K.textH;
  type Box = [number, number, number, number];
  const hit = (a: Box, b: Box) => a[0] < b[2] && a[2] > b[0] && a[1] < b[3] && a[3] > b[1];
  const keysBy = samples.map(spotKeys);
  const placed: Box[][] = samples.map(() => []);
  const edge = DRAFT.sheet.inset + DRAFT.sheet.innerOffset + 4;
  const out: LabelItem[] = [];
  for (const it of steady) {
    const tw = width(DRAFT.type.uppercase ? capitals(it.text) : it.text);
    const pts = samples.map((f, k) => {
      const i = keysBy[k]!.indexOf(it.key);
      return i < 0 ? null : (f[i]!.cands[it.cand] ?? f[i]!.cands[0]!);
    });
    const boxes = (side: 0 | 1, dy: number, run = 0): (Box[] | null)[] =>
      pts.map((p) => {
        if (!p) return null;
        const s = side === 0 ? -1 : 1;
        const ky = p[1] + dy;
        const x0 = p[0] + s * (K.gap + run), x1 = p[0] + s * (K.gap + run + tw);
        // each box carries the labels' margin, so two labels keep at least that much paper between them
        const mx = K.sepX / 2, my = K.sepY / 2;
        const text: Box = [Math.min(x0, x1) - mx, ky - th - K.lift - my, Math.max(x0, x1) + mx, ky + 1 + my];
        const drop: Box = [p[0] - mx / 2, Math.min(p[1], ky), p[0] + mx / 2, Math.max(p[1], ky)];
        return [text, drop];
      });
    // a candidate's cost: off the sheet or on the title block is out; on another label or its drop nearly so; lettering
    // over the drawing costs by how much of it is covered; then the shorter leader wins
    const n = Math.max(1, pts.filter(Boolean).length);
    const cost = (bx: (Box[] | null)[], dy: number, run: number): number => {
      let bad = 0;
      bx.forEach((b, k) => {
        if (!b) return;
        const t = b[0]!;
        if (t[0] < edge || t[2] > area.w - edge || t[1] < edge || t[3] > area.h - edge) bad += 1000;
        if (area.block && hit(t, area.block)) bad += 1000;
        for (const q of placed[k]!) for (const m of b) if (hit(m, q)) bad += 200;
        if (area.drawn) bad += K.overDrawing * area.drawn([t[0] - K.clear + K.sepX / 2, t[1] - K.clear + K.sepY / 2, t[2] + K.clear - K.sepX / 2, t[3] + K.clear - K.sepY / 2]);
      });
      return bad / n + K.perPx * (Math.abs(dy) + run);
    };
    const home: 0 | 1 = it.mean[0] < cx ? 0 : 1;
    const rows: number[] = [];
    for (let r = 0; r < K.rows; r++) rows.push(-(K.drop + r * (th + K.rowGap)));
    for (let r = 0; r < K.rows; r++) rows.push(K.drop + th + r * (th + K.rowGap));
    let best: { side: 0 | 1; dy: number; run: number; bad: number } | null = null;
    for (const side of [home, (1 - home) as 0 | 1])
      for (const dy of rows)
        for (let run = 0; run <= K.maxRun; run += K.runStep) {
          const bad = cost(boxes(side, dy, run), dy, run) + (side === home ? 0 : K.otherSide);
          if (!best || bad < best.bad) best = { side, dy, run, bad };
        }
    const pick = best!;
    boxes(pick.side, pick.dy, pick.run).forEach((b, k) => b && placed[k]!.push(...b));
    out.push({ key: it.key, n: it.n, text: it.text, cand: it.cand, side: pick.side, y: pick.dy, x: pick.run });
  }
  return out;
}

/** Draws the callouts at the anchors now: a drop, a shoulder outboard, the lettering on it; `dy` overrides a row mid-tween. */
export function drawCallouts(ctx: CanvasRenderingContext2D, T: ResolvedTheme, plan: LabelPlan, spots: LabelSpot[], focus: number | null, dy?: Map<string, number>): void {
  const K = O.callout;
  const keys = spotKeys(spots);
  ctx.save();
  ctx.font = font(DRAFT.type.overlaySmall);
  ctx.textBaseline = "alphabetic";
  for (const it of plan.items) {
    const k = keys.indexOf(it.key);
    if (k < 0) continue;
    const a = spots[k]!.cands[it.cand] ?? spots[k]!.cands[0];
    if (!a) continue;
    const now = spots[k]!.text;
    const t = DRAFT.type.uppercase ? capitals(now) : now;
    const tw = ctx.measureText(t).width;
    const s = it.side === 0 ? -1 : 1;
    const ky = a[1] + (dy?.get(it.key) ?? it.y);
    const run = it.x ?? 0;
    const end = a[0] + s * (K.gap * 2 + run + tw);
    const lit = focus === null || focus === it.n;
    ctx.globalAlpha = lit ? 1 : O.rail.dim;
    const ink = focus === it.n ? paint(T.accent) : paint(T.ink, K.leaderAlpha);
    // the lettering's ground: the paper, so it reads where it crosses a part
    const tx = s < 0 ? end + K.gap * 0.5 : a[0] + K.gap * 1.5 + run;
    ctx.fillStyle = paint(T.paper, K.panel);
    ctx.fillRect(Math.min(tx, tx + tw) - 2, ky - K.textH - K.lift, tw + 4, K.textH + K.lift - 1);
    ctx.strokeStyle = ink;
    ctx.lineWidth = K.width;
    ctx.beginPath();
    ctx.moveTo(a[0], a[1]);
    ctx.lineTo(a[0], ky);
    ctx.lineTo(end, ky);
    ctx.stroke();
    // the end on the element: an arrowhead along the drop, touching the line it names (the drafting mark for a line or
    // an edge); a dot where there is no drop to point along
    ctx.fillStyle = ink;
    if (Math.abs(ky - a[1]) > K.arrow) arrowHead(ctx, [a[0], ky], [a[0], a[1]], K.arrow, K.arrowAngle);
    else {
      ctx.beginPath();
      ctx.arc(a[0], a[1], K.dot, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = focus === it.n ? paint(T.accent) : paint(T.ink, K.textAlpha);
    ctx.textAlign = "left";
    ctx.fillText(t, tx, ky - K.lift);
  }
  ctx.restore();
}

/**
 * Where the drawing is, for the callouts (SD22): screen rectangles (the solids' outlines, every sampled phase of a moving
 * one) laid on a grid of `cell` px, with a summed-area table so a box's covered share is found at once. Returns that query:
 * 0 for a box clear of the drawing, 1 for one wholly over it.
 */
export function coverage(rects: [number, number, number, number][], w: number, h: number, cell = 6): (b: [number, number, number, number]) => number {
  const nx = Math.ceil(w / cell) + 1, ny = Math.ceil(h / cell) + 1;
  const g = new Uint8Array(nx * ny);
  for (const r of rects) {
    const x0 = Math.max(0, Math.floor(r[0] / cell)), x1 = Math.min(nx - 1, Math.floor(r[2] / cell));
    const y0 = Math.max(0, Math.floor(r[1] / cell)), y1 = Math.min(ny - 1, Math.floor(r[3] / cell));
    for (let y = y0; y <= y1; y++) g.fill(1, y * nx + x0, y * nx + x1 + 1);
  }
  const S = new Float64Array((nx + 1) * (ny + 1));
  for (let y = 0; y < ny; y++)
    for (let x = 0; x < nx; x++) S[(y + 1) * (nx + 1) + x + 1] = g[y * nx + x]! + S[y * (nx + 1) + x + 1]! + S[(y + 1) * (nx + 1) + x]! - S[y * (nx + 1) + x]!;
  return (b) => {
    const x0 = Math.max(0, Math.min(nx, Math.floor(b[0] / cell))), x1 = Math.max(0, Math.min(nx, Math.ceil(b[2] / cell)));
    const y0 = Math.max(0, Math.min(ny, Math.floor(b[1] / cell))), y1 = Math.max(0, Math.min(ny, Math.ceil(b[3] / cell)));
    const area = (x1 - x0) * (y1 - y0);
    if (area <= 0) return 0;
    const sum = S[y1 * (nx + 1) + x1]! - S[y0 * (nx + 1) + x1]! - S[y1 * (nx + 1) + x0]! + S[y0 * (nx + 1) + x0]!;
    return sum / area;
  };
}
