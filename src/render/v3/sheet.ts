// The drawing sheet of the 3D renderer (style SD10, SS13): the frame with its zone marks and the title block, with the VIEW
// and SCALE cells read from the camera (PLAN, FRONT, SIDE, ISOMETRIC, DIMETRIC, AUX, VIEW az/el; a section or detail adds
// its name) and the 3D stamp that marks a page drawn by this engine while both engines are on main. The paper, grid and
// paper tooth are the generic ones in src/render/sheet.ts.
import { DRAFT } from "../../style/draft";
import { font, rgba as paint, type ResolvedTheme } from "../../style/theme";
import type { Card } from "../canvas";

const S = DRAFT.sheet;
const up = (t: string) => (DRAFT.type.uppercase ? t.toUpperCase() : t);

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
  /** A section or detail view's name, added to the last row. */
  extra?: string;
}

/** Frame, zone marks and title block (paint order step 10). */
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
    // the 3D stamp sits at the right end of the title row (SS13)
    const st = S.stamp;
    ctx.font = font(DRAFT.type.titleValue);
    const sw = ctx.measureText(st.text).width + 8;
    cell("TITLE", up(text.title), x0, y0, bw - sw - 6);
    ctx.lineWidth = st.width;
    ctx.strokeStyle = paint(T.ink, st.alpha);
    ctx.strokeRect(x0 + bw - sw - 3.5, y0 + 3.5, sw, rh - 7);
    ctx.fillStyle = paint(T.ink, st.alpha);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(st.text, x0 + bw - sw / 2 - 3.5, y0 + rh / 2 + 0.5);
    cell("DWG", text.no, x0, y0 + rh, c1 - x0);
    cell("SCALE", text.scale, c1, y0 + rh, x0 + bw - c1);
    cell("VIEW", text.view, x0, y0 + 2 * rh, c1 - x0);
    cell("SHEET", text.sheet ?? "1/1", c1, y0 + 2 * rh, x0 + bw - c1);
    cell("DETAIL", text.extra ? `${text.dial} · ${text.extra}` : text.dial, x0, y0 + 3 * rh, bw);
  }
  ctx.restore();
}
