// The Node canvas factory (@napi-rs/canvas) for screenshots, thumbnails, the bench and visual snapshots, with the IBM
// Plex faces registered from the @fontsource packages so canvas lettering matches the site.
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { createCanvas, DOMMatrix, GlobalFonts, Path2D, type Canvas } from "@napi-rs/canvas";
import type { CanvasFactory, CanvasLike } from "../src/render/canvas";

const require = createRequire(import.meta.url);
let fonts = false;

/** Registers the Plex faces the style uses (mono for every canvas label). */
export function registerFonts(): void {
  if (fonts) return;
  fonts = true;
  const faces: [string, string, number[]][] = [
    ["@fontsource/ibm-plex-mono", "IBM Plex Mono", [400, 500, 600]],
    ["@fontsource/ibm-plex-sans", "IBM Plex Sans", [400, 500, 600]],
    ["@fontsource/ibm-plex-sans-condensed", "IBM Plex Sans Condensed", [500, 600, 700]],
  ];
  for (const [pkg, family, weights] of faces) {
    const dir = join(dirname(require.resolve(`${pkg}/package.json`)), "files");
    const base = pkg.split("/")[1]!;
    for (const w of weights) GlobalFonts.registerFromPath(join(dir, `${base}-latin-${w}-normal.woff2`), family);
  }
}

export const nodeFactory: CanvasFactory = {
  canvas: (w, h) => createCanvas(w, h) as unknown as CanvasLike,
  path: () => new Path2D() as unknown as globalThis.Path2D,
  matrix: (m) => new DOMMatrix(m) as unknown as globalThis.DOMMatrix,
};

export function nodeCanvas(w: number, h: number): Canvas {
  registerFonts();
  return createCanvas(w, h);
}
