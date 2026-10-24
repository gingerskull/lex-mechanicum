// The engine as the browser gets it: the 3D renderer, the record's kinematics and the package v2 setup. The stage imports
// it; a card imports it on first hover, so the library page loads no engine until then (R8, SS8).
export { Kinematics } from "../../../src/kin/compose";
export { timeMap } from "../../../src/kin/timemap";
export type { Controls, Kin } from "../../../src/kin/types";
export { browserFactory, makeCard, sizeCard } from "../../../src/render/canvas";
export { drawPlot } from "../../../src/render/plot";
export { DETAIL } from "../../../src/style/detail";
export { DRAFT } from "../../../src/style/draft";
export { theme } from "../../../src/style/theme";
export type { Dial } from "../../../src/render/detail";
import { snapName, type Orient } from "../../../src/render/v3/camera";
export { namedOrient, snapped, type Orient } from "../../../src/render/v3/camera";
/** The named view a pose is within reach of, or null. */
export const snappedName = (o: Orient) => snapName(o);
export { warm3 } from "../../../src/render/v3/gpu";
export { kinPoser, staticPoser, type Poser } from "../../../src/render/v3/poser";
export { createSession3, recordDrawView, ringBreath, type DrawView3, type Session3 } from "../../../src/render/v3/session";
export { defaultView, viewsOf, type ViewState } from "../../../src/render/v3/views";
export { setupInline, setupInWorker, type Setup } from "../../../src/solids/setup";
export type { Scene } from "../../../src/render/v3/scene";
export type { Teaching } from "../../../src/catalog/kin";

/** The sheet chosen on the page (SS7). */
export const pageTheme = (): "dark" | "light" | "forge" => {
  const t = document.documentElement.dataset.theme;
  return t === "light" || t === "forge" ? t : "dark";
};

/** Device pixel ratio for drawing, capped at 2. */
export const pixelRatio = () => Math.min(2, window.devicePixelRatio || 1);
export { importSims } from "../../../src/kin/sims";
