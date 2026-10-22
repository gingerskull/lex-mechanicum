// The paper of the drawing sheet (SD8): the paper with its grid, and the paper tooth over the drawing. The frame and the
// title block are the 3D renderer's (src/render/v3/sheet.ts).
import { DRAFT } from "../style/draft";
import { TOKENS } from "../style/tokens";
import { rgba as paint, type ResolvedTheme } from "../style/theme";
import { layer, type Card, type CanvasLike } from "./canvas";
import { noise } from "./patterns";

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
    // multiply darkens on average (the noise averages mid-grey): dividing by that average again (colour-dodge with its
    // complement) keeps the sheet's tone, so dropping the grain (DL-A) changes the texture only
    if (ctx.globalCompositeOperation === "multiply") {
      const g = Math.round(255 * T.grain * 0.5);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "color-dodge";
      ctx.fillStyle = paint([g, g, g]);
      ctx.fillRect(0, 0, card.w, card.h);
    }
  }
  ctx.restore();
}
