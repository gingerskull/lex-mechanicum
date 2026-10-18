// The canvas the renderer draws on: a factory makes the offscreen canvases (layers, tiles, the shared GPU canvas), so
// nothing else in the renderer touches the DOM. Drawing needs a browser with WebGL2; the tools draw in local Chrome
// (tools/chrome.ts), while packaging, rules, checks and audits run in Node without a canvas.

export interface CanvasLike {
  width: number;
  height: number;
  getContext(type: "2d"): CanvasRenderingContext2D | null;
}

/** A 2D affine transform [a, b, c, d, e, f], as DOMMatrix takes it: x' = a x + c y + e, y' = b x + d y + f. */
export type Affine = [number, number, number, number, number, number];

export interface CanvasFactory {
  canvas(w: number, h: number): CanvasLike;
}

/** The browser's factory. */
export const browserFactory: CanvasFactory = {
  canvas(w, h) {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    return c;
  },
};

/** A canvas with its size in CSS px and device pixels. */
export interface Card {
  canvas: CanvasLike;
  ctx: CanvasRenderingContext2D;
  f: CanvasFactory;
  /** CSS px. */
  w: number;
  h: number;
  dpr: number;
  /** Device px. */
  cw: number;
  ch: number;
}

export function makeCard(canvas: CanvasLike, f: CanvasFactory): Card {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("render: no 2d context");
  return { canvas, ctx, f, w: 0, h: 0, dpr: 1, cw: 0, ch: 0 };
}

/** Sizes the card to w x h CSS px at a device pixel ratio. */
export function sizeCard(card: Card, w: number, h: number, dpr: number): void {
  card.w = w;
  card.h = h;
  card.dpr = dpr;
  card.cw = Math.max(1, Math.round(w * dpr));
  card.ch = Math.max(1, Math.round(h * dpr));
  card.canvas.width = card.cw;
  card.canvas.height = card.ch;
}

/** A scratch canvas of the card's device size, cleared, with the CSS px transform set. */
export function layer(card: Card, cache: { c?: CanvasLike }): CanvasRenderingContext2D {
  if (!cache.c || cache.c.width !== card.cw || cache.c.height !== card.ch) cache.c = card.f.canvas(card.cw, card.ch);
  const x = cache.c.getContext("2d")!;
  x.setTransform(1, 0, 0, 1, 0, 0);
  x.globalAlpha = 1;
  x.globalCompositeOperation = "source-over";
  x.clearRect(0, 0, card.cw, card.ch);
  x.setTransform(card.dpr, 0, 0, card.dpr, 0, 0);
  return x;
}
