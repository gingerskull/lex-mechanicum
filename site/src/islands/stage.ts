// The stage (SS5): loads the mechanism's package and solve, plays it, and wires the controls: play, scrubber and
// drag-to-scrub, speed, tilt, explode, overlays, the detail dial and the keyboard. On Auto the dial adapts to the
// frame time one rung at a time with hysteresis, never past G on its own (DL4), and the slider follows it; moving the
// slider sets the dial by hand and turns Auto off. The title block shows the position. A browser without WebGL2 gets
// a still drawing (site/thumbs, drawn with the thumbnails) and a one-line note instead; the rest of the page works.
import { hasWebGL2 } from "../gl";
import { url } from "../url";
import type { Dial, DrawView } from "./engine";
type Engine = typeof import("./engine");

const TAU = Math.PI * 2;
/** Seconds per cycle at 1x. */
const CYCLE = 6;
/** Adaptive dial: step down after this many slow frames, back up after this many fast ones. */
const SLOW_MS = 14;
const FAST_MS = 7;
const SLOW_N = 30;
const FAST_N = 180;
/** A frame is missed when its interval is this much longer than the display's (the shortest interval seen lately). */
const MISSED = 1.5;

const box = document.querySelector<HTMLElement>(".stagebox");
const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

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
  for (const c of box.querySelectorAll<HTMLButtonElement | HTMLInputElement>("button, input")) c.disabled = true;
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
  // the display's frame interval, the shortest of the last few seconds: a frame much longer than it was missed, which
  // is how a GPU-bound frame shows (its work is paid after the draw call returns)
  const gaps: number[] = [];
  let lastDraw = 0;
  const draw = () => {
    const t0 = performance.now();
    const gap = lastDraw ? t0 - lastDraw : 0;
    lastDraw = t0;
    sess.draw(s.u, view());
    const ms = performance.now() - t0;
    if (plot && pkg.plot) E.drawPlot(plot, E.theme(E.pageTheme()), pkg.plot, s.u, model.plot?.unit ?? "");
    let missed = false;
    if (gap > 0 && gap < 250) {
      gaps.push(gap);
      if (gaps.length > 180) gaps.shift();
      missed = gaps.length > 30 && gap > MISSED * Math.min(...gaps);
    }
    adapt(ms, missed);
    ($<HTMLInputElement>("scrub")).value = String(Math.round((((s.u % TAU) + TAU) % TAU) / TAU * 360));
    $("scrubv").textContent = `${($<HTMLInputElement>("scrub")).value}°`;
    dirty = false;
  };
  const adapt = (ms: number, missed: boolean) => {
    if (!s.auto || !s.playing) return;
    if (ms > SLOW_MS || missed) {
      s.fast = 0;
      if (++s.slow >= SLOW_N && s.rung < LADDER.length - 1) {
        s.rung++;
        s.slow = 0;
        showDial();
      }
    } else if (ms < FAST_MS) {
      s.slow = 0;
      if (++s.fast >= FAST_N && s.rung > 0) {
        s.rung--;
        s.fast = 0;
        showDial();
      }
    }
  };

  let last = performance.now();
  const tick = (now: number) => {
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    if (s.playing) {
      s.u += (dt * s.speed * TAU) / CYCLE;
      dirty = true;
    }
    if (dirty) draw();
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
  let drag: { x: number; u: number } | null = null;
  canvas.addEventListener("pointerdown", (e) => {
    drag = { x: e.clientX, u: s.u };
    canvas.setPointerCapture(e.pointerId);
    setPlaying(false);
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!drag) return;
    s.u = drag.u + ((e.clientX - drag.x) / size().width) * TAU;
    dirty = true;
  });
  canvas.addEventListener("pointerup", () => (drag = null));
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
  new ResizeObserver(() => {
    const r = size();
    sess.resize(r.width, r.height, E.pixelRatio());
    plotSize();
    dirty = true;
  }).observe(canvas);
  requestAnimationFrame(tick);
}

if (box) void (hasWebGL2() ? main(box) : still(box));
