// The stage (SS5): loads the mechanism's package and solve, plays it, and wires the controls: play, scrubber and
// drag-to-scrub, speed, tilt, explode, overlays, the detail dial and the keyboard. On Auto the dial adapts to the
// frame time one rung at a time with hysteresis, never past G on its own (DL4), and the slider follows it; moving the
// slider sets the dial by hand and turns Auto off. The title block shows the position. A browser without WebGL2 gets
// a still drawing (site/thumbs, drawn with the thumbnails) and a one-line note instead; the rest of the page works.
// The view modes (Wide, full screen) work either way; each canvas follows its own CSS size after a mode change.
import { autoStep } from "../autodial";
import { hasWebGL2 } from "../gl";
import { url } from "../url";
import type { Dial, DrawView } from "./engine";
type Engine = typeof import("./engine");

const TAU = Math.PI * 2;
/** Seconds per cycle at 1x. */
const CYCLE = 6;
/** Adaptive dial: step down after this many slow frames, back up after this many fast ones. */

const box = document.querySelector<HTMLElement>(".stagebox");
const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

/** Where the standard/Wide choice is remembered; the page's inline script reads it before the layout paints. */
const VIEW_KEY = "stage-view";

type FsDoc = Document & { webkitFullscreenElement?: Element | null; webkitFullscreenEnabled?: boolean; webkitExitFullscreen?: () => void };
type FsEl = HTMLElement & { webkitRequestFullscreen?: () => void };

/** Wide (the stage across the layout, the panels below; CSS keeps it to wide screens) and full screen. */
function views(box: HTMLElement) {
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

/** Without WebGL2: the still for each sheet in place of the canvas, the controls off, and the plot drawn once. */
async function still(box: HTMLElement) {
  const id = box.dataset.id!;
  const stage = box.querySelector<HTMLElement>(".stage")!;
  for (const t of ["dark", "light"]) {
    const img = document.createElement("img");
    img.className = `still t-${t}`;
    img.src = url(`/thumbs/${id}-${t}-still.webp`);
    img.alt = t === "dark" ? `${box.dataset.title ?? id}, drawing` : "";
    stage.append(img);
  }
  $("stage").hidden = true;
  const note = document.createElement("p");
  note.className = "stagenote";
  note.textContent = "This browser has no WebGL2, so the drawing is a still image and its controls are off.";
  stage.after(note);
  for (const c of box.querySelectorAll<HTMLButtonElement | HTMLInputElement>("button, input")) if (!c.closest(".views")) c.disabled = true;
  const plotCanvas = document.getElementById("plot") as HTMLCanvasElement | null;
  if (!plotCanvas) return;
  const E = await import("./engine");
  const [model, pkg] = await Promise.all([E.models[id]!(), E.loadPackage(url(`/packages/${id}.mxp`))]);
  if (!pkg.plot) return;
  const plot = E.makeCard(plotCanvas, E.browserFactory);
  const draw = () => {
    const r = plotCanvas.getBoundingClientRect();
    E.sizeCard(plot, r.width, r.height, Math.min(2, E.pixelRatio()));
    E.drawPlot(plot, E.theme(E.pageTheme()), pkg.plot!, (63 / 360) * TAU, model.plot?.unit ?? "");
  };
  draw();
  window.addEventListener("themechange", draw);
  new ResizeObserver(draw).observe(plotCanvas);
}

async function main(box: HTMLElement) {
  const E: Engine = await import("./engine");
  const LADDER: Dial[] = ["full", ...E.DETAIL.map((r) => r.id).filter((id) => id !== "H")];
  const id = box.dataset.id!;
  const canvas = $<HTMLCanvasElement>("stage");
  const [model, pkg] = await Promise.all([E.models[id]!(), E.loadPackage(url(`/packages/${id}.mxp`))]);
  const size = () => canvas.getBoundingClientRect();
  const sess = E.createSession(canvas, pkg, model, { factory: E.browserFactory, w: size().width, h: size().height, dpr: E.pixelRatio() });
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const s = {
    u: (63 / 360) * TAU,
    playing: !reduced,
    speed: 1,
    tilt: 28,
    explode: 0,
    overlays: { paths: true, forces: false, velocity: false, angles: false } as Record<string, boolean>,
    auto: true,
    rung: 0,
    slow: 0,
    fast: 0,
  };
  const view = (): DrawView => ({
    ...E.defaultView(),
    tilt: s.tilt,
    explode: s.explode,
    overlays: { ...s.overlays },
    dims: true,
    sheet: { title: box.dataset.title ?? id, no: box.dataset.no ?? "" },
    detail: LADDER[s.rung]!,
    theme: E.pageTheme(),
  });

  // the output plot
  const plotCanvas = document.getElementById("plot") as HTMLCanvasElement | null;
  const plot = plotCanvas && pkg.plot ? E.makeCard(plotCanvas, E.browserFactory) : null;
  const plotSize = () => {
    if (!plot || !plotCanvas) return;
    const r = plotCanvas.getBoundingClientRect();
    E.sizeCard(plot, r.width, r.height, Math.min(2, E.pixelRatio()));
  };
  plotSize();

  // the detail slider: right is full detail, each step left drops one more rung
  const detail = $<HTMLInputElement>("detail");
  function showDial() {
    detail.value = String(LADDER.length - 1 - s.rung);
    const r = LADDER[s.rung]!;
    $("detailv").textContent = r === "full" ? "Full" : r === "A" ? "−A" : `−A–${r}`;
    $("detailv").title = r === "full" ? "Everything drawn" : `Not drawn: ${E.DETAIL.slice(0, E.DETAIL.findIndex((x) => x.id === r) + 1).map((x) => x.name.toLowerCase()).join("; ")}`;
  }

  let dirty = true;
  // a lost GPU context came back: redraw, even when paused
  sess.onRestored = () => (dirty = true);
  const draw = () => {
    const t0 = performance.now();
    sess.draw(s.u, view());
    const ms = performance.now() - t0;
    if (plot && pkg.plot) E.drawPlot(plot, E.theme(E.pageTheme()), pkg.plot, s.u, model.plot?.unit ?? "");
    adapt(ms, sess.stats?.gpuLagMs ?? 0);
    ($<HTMLInputElement>("scrub")).value = String(Math.round((((s.u % TAU) + TAU) % TAU) / TAU * 360));
    $("scrubv").textContent = `${($<HTMLInputElement>("scrub")).value}°`;
    dirty = false;
  };
  const adapt = (ms: number, gpuLagMs: number) => {
    if (s.auto && s.playing && autoStep(s, ms, gpuLagMs, LADDER.length - 1)) showDial();
  };

  // nothing is drawn (or measured) while the stage is scrolled out of view
  let inView = true;
  new IntersectionObserver(([e]) => {
    inView = !!e?.isIntersecting;
    if (inView) dirty = true;
  }).observe(canvas);

  let last = performance.now();
  const tick = (now: number) => {
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    if (s.playing) {
      s.u += (dt * s.speed * TAU) / CYCLE;
      dirty = true;
    }
    if (dirty && inView) draw();
    requestAnimationFrame(tick);
  };

  // controls
  const play = $<HTMLButtonElement>("play");
  const setPlaying = (v: boolean) => {
    s.playing = v;
    play.setAttribute("aria-pressed", String(v));
    play.setAttribute("aria-label", v ? "Pause" : "Play");
    $("playicon").setAttribute("d", v ? "M3 2h2v8H3zM7 2h2v8H7z" : "M3 1.5l7 4.5-7 4.5z");
  };
  setPlaying(s.playing);
  play.addEventListener("click", () => setPlaying(!s.playing));
  $<HTMLInputElement>("scrub").addEventListener("input", (e) => {
    setPlaying(false);
    s.u = (Number((e.target as HTMLInputElement).value) / 360) * TAU;
    dirty = true;
  });
  for (const b of document.querySelectorAll<HTMLButtonElement>("#speed button"))
    b.addEventListener("click", () => {
      s.speed = Number(b.dataset.v);
      for (const o of document.querySelectorAll("#speed button")) o.setAttribute("aria-pressed", String(o === b));
    });
  $<HTMLInputElement>("tilt").addEventListener("input", (e) => {
    s.tilt = Number((e.target as HTMLInputElement).value);
    $("tiltv").textContent = s.tilt <= 0 ? "Plan" : s.tilt >= 88 ? "Side" : `${s.tilt}°`;
    dirty = true;
  });
  $<HTMLInputElement>("explode").addEventListener("input", (e) => {
    s.explode = Number((e.target as HTMLInputElement).value) / 100;
    $("explodev").textContent = `${Math.round(s.explode * 100)}%`;
    dirty = true;
  });
  for (const c of document.querySelectorAll<HTMLButtonElement>(".ovl .chip"))
    c.addEventListener("click", () => {
      const k = c.dataset.o!;
      s.overlays[k] = !s.overlays[k];
      c.setAttribute("aria-pressed", String(s.overlays[k]));
      dirty = true;
    });
  const auto = $<HTMLButtonElement>("auto");
  const setAuto = (v: boolean) => {
    s.auto = v;
    s.slow = s.fast = 0;
    auto.setAttribute("aria-pressed", String(v));
  };
  auto.addEventListener("click", () => {
    setAuto(!s.auto);
    if (s.auto) s.rung = 0;
    showDial();
    dirty = true;
  });
  detail.max = String(LADDER.length - 1);
  detail.addEventListener("input", () => {
    setAuto(false);
    s.rung = LADDER.length - 1 - Number(detail.value);
    showDial();
    dirty = true;
  });
  showDial();
  // drag to scrub, keyboard on the canvas
  canvas.tabIndex = 0;
  // a sideways drag scrubs and pauses; an up or down drag is the page scrolling (touch-action: pan-y hands it to the
  // browser, which cancels the pointer) and leaves the animation playing; a tap without moving plays or pauses
  const SCRUB_PX = 8;
  let drag: { id: number; x: number; y: number; u: number; scrubbing: boolean } | null = null;
  canvas.addEventListener("pointerdown", (e) => {
    if (e.button !== 0) return;
    drag = { id: e.pointerId, x: e.clientX, y: e.clientY, u: s.u, scrubbing: false };
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x;
    if (!drag.scrubbing) {
      if (Math.abs(dx) < SCRUB_PX || Math.abs(dx) < Math.abs(e.clientY - drag.y)) return;
      drag.scrubbing = true;
      drag.x = e.clientX;
      drag.u = s.u;
      canvas.setPointerCapture(e.pointerId);
      setPlaying(false);
      return;
    }
    s.u = drag.u + (dx / size().width) * TAU;
    dirty = true;
  });
  canvas.addEventListener("pointerup", (e) => {
    if (drag && e.pointerId === drag.id && !drag.scrubbing && Math.hypot(e.clientX - drag.x, e.clientY - drag.y) < SCRUB_PX) setPlaying(!s.playing);
    drag = null;
  });
  canvas.addEventListener("pointercancel", () => (drag = null));
  canvas.addEventListener("keydown", (e) => {
    if (e.key === " ") setPlaying(!s.playing);
    else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      setPlaying(false);
      s.u += ((e.key === "ArrowRight" ? 1 : -1) * TAU) / 72;
      dirty = true;
    } else return;
    e.preventDefault();
  });
  window.addEventListener("themechange", () => (dirty = true));
  // a view mode change, a window resize or a rotation: each canvas takes its new CSS size at the pixel ratio
  const resized = new ResizeObserver(() => {
    const r = size();
    sess.resize(r.width, r.height, E.pixelRatio());
    plotSize();
    dirty = true;
  });
  resized.observe(canvas);
  if (plotCanvas) resized.observe(plotCanvas);
  requestAnimationFrame(tick);
}

if (box) {
  views(box);
  void (hasWebGL2() ? main(box) : still(box));
}
