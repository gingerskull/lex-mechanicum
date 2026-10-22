// The stage's view modes (SS9): Wide (the stage across the layout, the panels below; CSS keeps it to wide screens) and
// full screen. Each canvas follows its own CSS size after a mode change.

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

/** Where the standard/Wide choice is remembered; the page's inline script reads it before the layout paints. */
const VIEW_KEY = "stage-view";

type FsDoc = Document & { webkitFullscreenElement?: Element | null; webkitFullscreenEnabled?: boolean; webkitExitFullscreen?: () => void };
type FsEl = HTMLElement & { webkitRequestFullscreen?: () => void };

/** Wires the Wide and full screen buttons. */
export function views(box: HTMLElement) {
  const root = document.documentElement;
  const wide = $<HTMLButtonElement>("wide");
  const showWide = () => wide.setAttribute("aria-pressed", String(root.dataset.view === "wide"));
  showWide();
  wide.addEventListener("click", () => {
    const on = root.dataset.view !== "wide";
    if (on) root.dataset.view = "wide";
    else delete root.dataset.view;
    showWide();
    try {
      localStorage.setItem(VIEW_KEY, on ? "wide" : "standard");
    } catch {
      // storage off: the mode holds for this page only
    }
  });

  const doc = document as FsDoc;
  const el = box as FsEl;
  const full = $<HTMLButtonElement>("full");
  if (!(doc.fullscreenEnabled || doc.webkitFullscreenEnabled)) {
    full.hidden = true;
    return;
  }
  const current = () => doc.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
  const sync = () => {
    const on = current() === box;
    box.toggleAttribute("data-full", on);
    full.setAttribute("aria-pressed", String(on));
    full.setAttribute("aria-label", on ? "Leave full screen" : "Full screen");
    full.title = on ? "Leave full screen (Esc)" : "Full screen";
    $("fullicon").setAttribute("d", on ? "M6 2v4H2M14 6h-4V2M10 14v-4h4M2 10h4v4" : "M2 6V2h4M10 2h4v4M14 10v4h-4M6 14H2v-4");
  };
  full.addEventListener("click", () => {
    if (current() === box) {
      if (doc.exitFullscreen) void doc.exitFullscreen().catch(() => {});
      else doc.webkitExitFullscreen?.();
    } else if (el.requestFullscreen) void el.requestFullscreen({ navigationUI: "hide" }).catch(() => {});
    else el.webkitRequestFullscreen?.();
  });
  document.addEventListener("fullscreenchange", sync);
  document.addEventListener("webkitfullscreenchange", sync);
}

