// The drawing sheet of the 3D renderer (style SD10): the frame with its zone marks, the microprint between its borders and
// the title block, with the VIEW and SCALE cells read from the camera (PLAN, FRONT, SIDE, ISOMETRIC, DIMETRIC, AUX, VIEW
// az/el; a section or detail view gives its own name instead) and the DATE cell from the record's origin. The paper, grid and paper tooth
// are the generic ones in src/render/sheet.ts.
import { DRAFT } from "../../style/draft";
import { font, rgba as paint, type ResolvedTheme } from "../../style/theme";
import { TOKENS } from "../../style/tokens";
import type { Card } from "../canvas";

const S = DRAFT.sheet;
const up = (t: string) => (DRAFT.type.uppercase ? t.toUpperCase() : t);

/** The microprint's text (LM-05), written round the frame as the ones and zeros of its 8-bit ASCII. */
export const MICROPRINT = "LEX MECHANICUM";
export const MICROPRINT_BITS = [...MICROPRINT].map((c) => c.charCodeAt(0).toString(2).padStart(8, "0")).join("");

export interface SheetText {
  title: string;
  no: string;
  sheet?: string;
  /** VIEW cell: "PLAN", "ISOMETRIC", "AUX ⟂ O2", "VIEW 30/40". */
  view: string;
  /** SCALE cell: "2.1 : 1". */
  scale: string;
  /** The dial position (DL4): "FULL" or "DETAIL A-F". */
  dial: string;
  /** A section or detail view's name, shown in the VIEW cell in place of the orientation. */
  extra?: string;
  /** DATE cell: the record's origin as an Imperial date, "800.026.M3". */
  date?: string;
}

/** A gap in the microprint along one side: from `a` to `b`, in px along the side. */
type Gap = [number, number];

/**
 * The microprint between the two borders, clockwise from the top left so it reads round the frame: each side's run is cut
 * where a zone mark or a tick crosses the band, and the bits carry on from one piece to the next.
 */
function microprint(ctx: CanvasRenderingContext2D, T: ResolvedTheme, w: number, h: number, nx: number, ny: number) {
  const M = S.microprint;
  const i = S.inset;
  const o = S.innerOffset;
  const c = i + o / 2 + 0.5;
  ctx.font = font(DRAFT.type.micro);
  ctx.fillStyle = paint(T[M.color], M.alpha);
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  const adv = ctx.measureText("0").width;
  if (!(adv > 0)) return;
  // a zone mark's half extent along the side: its width across the top and bottom, its height down the sides
  ctx.font = font(DRAFT.type.zone);
  const across = Array.from({ length: nx }, (_, k) => ctx.measureText(String(k + 1)).width / 2 + M.gap);
  const down = Array.from({ length: ny }, () => TOKENS.type.size[DRAFT.type.zone.size] * 0.35 + M.gap);
  ctx.font = font(DRAFT.type.micro);
  // a side's gaps, in px from its start: the corner, the zone marks at the zone centres and the ticks between them
  const gaps = (len: number, n: number, halves: number[], flip: boolean): Gap[] => {
    const g: Gap[] = [[-Infinity, i + o + M.gap], [len - i - o - M.gap, Infinity]];
    for (let k = 0; k < n; k++) {
      const m = i + ((len - 2 * i) * (k + 0.5)) / n;
      const t = flip ? len - m : m;
      g.push([t - halves[k]!, t + halves[k]!]);
      if (k > 0) {
        const b = i + ((len - 2 * i) * k) / n;
        const tb = flip ? len - b : b;
        g.push([tb - M.gap, tb + M.gap]);
      }
    }
    return g.sort((p, q) => p[0] - q[0]);
  };
  let bit = 0;
  const run = (x: number, y: number, angle: number, len: number, g: Gap[]) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    let from = -Infinity;
    for (const [a, b] of [...g, [Infinity, Infinity] as Gap]) {
      const n = Math.floor((Math.min(a, len) - Math.max(from, 0)) / adv);
      if (n > 0) {
        let t = "";
        for (let k = 0; k < n; k++) t += MICROPRINT_BITS[(bit + k) % MICROPRINT_BITS.length];
        bit = (bit + n) % MICROPRINT_BITS.length;
        ctx.fillText(t, Math.max(from, 0) + (Math.min(a, len) - Math.max(from, 0) - n * adv) / 2, 0);
      }
      from = Math.max(from, b);
    }
    ctx.restore();
  };
  run(0, c, 0, w, gaps(w, nx, across, false));
  run(w - c, 0, Math.PI / 2, h, gaps(h, ny, down, false));
  run(w, h - c, Math.PI, w, gaps(w, nx, across, true));
  run(c, h, -Math.PI / 2, h, gaps(h, ny, down, true));
}

/** Frame, zone marks, microprint and title block (paint order step 10). */
export function sheetFrame(card: Card, T: ResolvedTheme, text: SheetText): void {
  const ctx = card.ctx;
  const i = S.inset;
  const { w, h } = card;
  ctx.save();
  ctx.setLineDash([]);
  ctx.strokeStyle = paint(T.ink, S.outer.alpha);
  ctx.lineWidth = S.outer.width;
  ctx.strokeRect(i + 0.5, i + 0.5, w - 2 * i - 1, h - 2 * i - 1);
  const o = S.innerOffset;
  ctx.lineWidth = S.inner.width;
  ctx.strokeStyle = paint(T.ink, S.inner.alpha);
  ctx.strokeRect(i + o + 0.5, i + o + 0.5, w - 2 * (i + o) - 1, h - 2 * (i + o) - 1);
  if (S.zones) {
    const nx = Math.max(2, Math.round(w / S.zonePitch));
    const ny = Math.max(2, Math.round(h / S.zonePitch));
    microprint(ctx, T, w, h, nx, ny);
    ctx.font = font(DRAFT.type.zone);
    ctx.fillStyle = paint(T.ink, S.zoneAlpha);
    ctx.strokeStyle = paint(T.ink, S.inner.alpha);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.beginPath();
    for (let k = 1; k < nx; k++) {
      const X = Math.round(i + ((w - 2 * i) * k) / nx) + 0.5;
      ctx.moveTo(X, i); ctx.lineTo(X, i + S.zoneTick);
      ctx.moveTo(X, h - i); ctx.lineTo(X, h - i - S.zoneTick);
    }
    for (let k = 1; k < ny; k++) {
      const Y = Math.round(i + ((h - 2 * i) * k) / ny) + 0.5;
      ctx.moveTo(i, Y); ctx.lineTo(i + S.zoneTick, Y);
      ctx.moveTo(w - i, Y); ctx.lineTo(w - i - S.zoneTick, Y);
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
    const bw = Math.min(S.titleMaxW, Math.max(S.titleMinW, w * S.titleWFrac));
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
    ctx.lineTo(c1 + 0.5, y0 + 4 * rh);
    ctx.lineWidth = S.titleRule.width;
    ctx.strokeStyle = paint(T.ink, S.titleRule.alpha);
    ctx.stroke();
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
    cell("TITLE", up(text.title), x0, y0, bw);
    cell("DWG", text.no, x0, y0 + rh, c1 - x0);
    cell("SCALE", text.scale, c1, y0 + rh, x0 + bw - c1);
    cell("VIEW", text.extra ?? text.view, x0, y0 + 2 * rh, c1 - x0);
    cell("SHEET", text.sheet ?? "1/1", c1, y0 + 2 * rh, x0 + bw - c1);
    cell("DETAIL", text.dial, x0, y0 + 3 * rh, c1 - x0);
    cell("DATE", text.date ?? "", c1, y0 + 3 * rh, x0 + bw - c1);
  }
  ctx.restore();
}
