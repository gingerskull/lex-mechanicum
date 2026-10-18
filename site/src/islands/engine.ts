// The engine as the browser gets it: the registry (each model its own chunk), the package loader and the renderer.
// The stage imports it; a card imports it on first hover, so the library page loads no engine until then (R8, SS8).
export { models } from "../../../src/mechanisms/models";
export { loadPackage } from "../../../src/package/loader";
export { browserFactory } from "../../../src/render/canvas";
export { defaultView, cardView } from "../../../src/render/draft";
export type { DrawView } from "../../../src/render/draft";
export { createSession } from "../../../src/render/session";
export type { Session } from "../../../src/render/session";
export { makeCard, sizeCard } from "../../../src/render/canvas";
export { drawPlot } from "../../../src/render/plot";
export { theme } from "../../../src/style/theme";
export type { Dial } from "../../../src/render/detail";
export { DETAIL } from "../../../src/style/detail";
export type { ThemeKey } from "../../../src/style/tokens";

/** The sheet chosen on the page (SS7). */
export const pageTheme = (): "dark" | "light" => (document.documentElement.dataset.theme === "light" ? "light" : "dark");

/** Device pixel ratio for drawing, capped at 2. */
export const pixelRatio = () => Math.min(2, window.devicePixelRatio || 1);
