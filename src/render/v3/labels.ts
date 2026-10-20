// Mono labels on a paper panel with an ink hairline (SD14, SD22), placed so two never overlap and none leaves the canvas.
// The panel and text styles are the overlays' (src/style/draft.ts overlays.*); the colour is the caller's.
import { DRAFT } from "../../style/draft";
import { font, rgba as paint, type ResolvedTheme } from "../../style/theme";

const O = DRAFT.overlays;

export type Labeler = (text: string, x: number, y: number, col: string, small?: boolean) => void;

export function labeler(ctx: CanvasRenderingContext2D, T: ResolvedTheme, w: number, h: number): Labeler {
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
