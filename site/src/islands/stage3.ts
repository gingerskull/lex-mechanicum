// The stage of a mechanism (SS5): the transport (play, scrub, drag to scrub, speed), and the camera (right drag or two
// fingers to orbit, the named views, the record's own view, tilt), the section and detail views the record declares, explode, the
// detail dial (adaptive per DL4) and the record's own controls (T14). Playback honours the record's time map (SD27): the
// scrubber and the plot stay on the true input. The setup runs in a worker, the shaders build while the data downloads,
// and the first frame is drawn at a coarse dial until the page is idle (R9). A browser without WebGL2 gets the still and a
// note; the plot and the rest of the page work.
import { AUTO, autoLast, autoSettle, autoState, autoStep, isDesktop } from "../autodial";
import { hasWebGL2 } from "../gl";
import { url } from "../url";
import type { StageControl } from "../data";
import { fetchAll, load3, poserFor, type Loaded } from "./load3";
import { views } from "./views";
import type { Dial, DrawView3, Orient, ViewState } from "./engine3";
type Engine = typeof import("./engine3");

const TAU = Math.PI * 2;
/** Seconds per cycle at 1x. */
const CYCLE = 6;
/** Degrees of orbit per CSS pixel of drag. */
const ORBIT = 0.4;
const DRAG_PX = 8;
/** Degrees one Shift and arrow press orbits. */
const KEY_ORBIT = 5;
/** Explode opened in a view tilted less than this (a plan) eases to the 28 degree view, over this many seconds. */
const EXPLODE_TILT_BELOW = 15;
const EXPLODE_TILT = 28;
const TWEEN_S = 0.45;

const box = document.querySelector<HTMLElement>('.stagebox[data-engine="v3"]');
const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

type Vec3 = [number, number, number];
type Ctl = { params: Record<string, number>; design: Record<string, string | number>; select: Record<string, string>; drivers: Record<string, number> };

/** One output's samples over one cycle at the given controls, from the record's kinematics; null where it does not solve. */
function sampleOutput(K: NonNullable<Loaded["kinematics"]>, y: string, ctl?: Ctl): number[] | null {
  const data: number[] = [];
  try {
    for (let i = 0; i <= 180; i++) {
      const v = K.pose((i / 180) * TAU, ctl as never).outputs[y];
      if (typeof v !== "number") return null;
      data.push(v);
    }
  } catch {
    return null;
  }
  return data;
}

/** The settings with one of the record's controls set to a value (a ghost curve's). */
function ghostCtl(t: NonNullable<Loaded["meta"]["teaching"]>, base: Ctl | undefined, id: string, value: unknown): Ctl {
  const c: Ctl = base ? (JSON.parse(JSON.stringify(base)) as Ctl) : { params: {}, design: {}, select: {}, drivers: {} };
  const k = t.controls.find((x) => x.id === id) as ({ id: string; kind: string; [k: string]: unknown }) | undefined;
  const key = (f: string) => (typeof k?.[f] === "string" ? (k[f] as string) : id);
  if (k?.kind === "param") c.params[key("param")] = Number(value);
  else if (k?.kind === "design") c.design[key("design")] = String(value);
  else if (k?.kind === "selector") c.select[key("selector")] = String(value);
  else c.drivers[key("driver")] = Number(value);
  return c;
}

/**
 * The output plot over one cycle at the given controls, from the record's kinematics (the v2 package carries none): the
 * record's first plot, its ghosts (the same output at the settings it names: a family of curves), and the record's
 * further plots that share its unit and its range.
 */
function plotSeries(E: Engine, L: Pick<Loaded, "meta" | "kinematics">, ctl?: Ctl): { data: number[]; unit: string; more: { data: number[]; ghost: boolean }[] } | null {
  const t = L.meta.teaching;
  const plots = (t ? (Array.isArray(t.plot) ? t.plot : t.plot ? [t.plot] : []) : []) as { y: string; ghosts?: { control: string; value: unknown }[] }[];
  const p = plots[0];
  const K = L.kinematics;
  if (!t || !p || !K) return null;
  const data = sampleOutput(K, p.y, ctl);
  if (!data) return null;
  const unitOf = (y: string) => L.meta.kin?.outputs.find((o) => o.id === y)?.unit ?? "";
  const unit = unitOf(p.y);
  const more: { data: number[]; ghost: boolean }[] = [];
  for (const g of p.ghosts ?? []) {
    const d = sampleOutput(K, p.y, ghostCtl(t, ctl, g.control, g.value));
    if (d) more.push({ data: d, ghost: true });
  }
  // (where its range overlaps the first's: a curve far off it would only squash the first)
  const lo = Math.min(...data);
  const hi = Math.max(...data);
  for (const q of plots.slice(1)) {
    if (unitOf(q.y) !== unit) continue;
    const d = sampleOutput(K, q.y, ctl);
    if (!d) continue;
    const overlap = Math.min(hi, Math.max(...d)) - Math.max(lo, Math.min(...d));
    if (overlap > 0.5 * Math.min(hi - lo, Math.max(...d) - Math.min(...d))) more.push({ data: d, ghost: false });
  }
  void E;
  return { data, unit: unit === "deg" ? "°" : unit ? ` ${unit}` : "", more };
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
  const E: Engine = await import("./engine3");
  const meta = await fetchAll(id).meta;
  const series = plotSeries(E, { meta, kinematics: meta.kin ? new E.Kinematics(meta.kin as never) : null });
  if (!series) return;
  const plot = E.makeCard(plotCanvas, E.browserFactory);
  const draw = () => {
    const r = plotCanvas.getBoundingClientRect();
    E.sizeCard(plot, r.width, r.height, Math.min(2, E.pixelRatio()));
    E.drawPlot(plot, E.theme(E.pageTheme()), series.data, (63 / 360) * TAU, series.unit, series.more);
  };
  draw();
  window.addEventListener("themechange", draw);
  new ResizeObserver(draw).observe(plotCanvas);
}

/** The turntable pose of an auxiliary view's direction, so the orbit continues from it. */
function turntable(o: Orient): { yaw: number; tilt: number } {
  if (!o.aux) return { yaw: o.yaw, tilt: o.tilt };
  const l = Math.hypot(...o.aux) || 1;
  const e = o.aux.map((x) => x / l) as Vec3;
  const tilt = (Math.acos(Math.max(-1, Math.min(1, e[2]))) * 180) / Math.PI;
  return { yaw: tilt < 1e-3 ? 0 : (Math.atan2(e[0], -e[1]) * 180) / Math.PI, tilt };
}

async function main(box: HTMLElement) {
  const id = box.dataset.id!;
  const title = box.dataset.title ?? id;
  const no = box.dataset.no ?? "";
  const err = $("stage-err");
  const fail = (text: string) => {
    err.textContent = text;
    err.hidden = false;
  };
  // the downloads start before the engine chunk arrives; the shaders build while the package is on its way
  const fetches = fetchAll(id);
  fetches.blob.catch(() => {});
  fetches.meta.catch(() => {});
  const E: Engine = await import("./engine3");
  const canvas = $<HTMLCanvasElement>("stage");
  let L: Loaded;
  try {
    E.warm3(E.browserFactory);
    L = await load3(E, id, fetches, title, no);
  } catch (e) {
    fail(`The drawing could not be loaded (${e instanceof Error ? e.message : String(e)}).`);
    return;
  }
  const size = () => canvas.getBoundingClientRect();
  const sess = E.createSession3(canvas, L.scene, { factory: E.browserFactory, w: size().width, h: size().height, dpr: E.pixelRatio() });
  const teaching = L.meta.teaching;
  const axisOf = (j: string): Vec3 | null => L.scene.axes?.[j] ?? null;
  const base: ViewState = E.defaultView(teaching, axisOf);
  const rviews = E.viewsOf(teaching, axisOf);
  const tm = E.timeMap(teaching?.timeMap ? { ...(teaching.timeMap.span ? { span: teaching.timeMap.span } : {}), ...(teaching.timeMap.spans ? { spans: teaching.timeMap.spans } : {}), slow: teaching.timeMap.slow } : undefined);
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const LADDER: Dial[] = ["full", ...E.DETAIL.map((r) => r.id).filter((x) => x !== "H")];
  /** The coarsest rung Auto may reach here (DL4): a desktop keeps the look (site/src/autodial.ts). */
  const autoFloor = autoLast(LADDER, isDesktop(window), AUTO.desktopFloor);
  const dial = autoState();

  const s = {
    t: tm.tOf((63 / 360) * TAU),
    u: (63 / 360) * TAU,
    playing: !reduced,
    speed: 1,
    orient: { ...base.orient } as Orient,
    auxName: base.auxName as string | undefined,
    section: undefined as ViewState["section"],
    detail: undefined as ViewState["detail"],
    rview: "" as string,
    explode: 0,
    show: { paths: true, construction: true, velocity: false, forces: false, angles: false } as Record<string, boolean>,
    /** A construction label picked out in the key (its number in the record's order), or null. */
    focus: null as number | null,
    auto: true,
    /** The input ring's strength: it breathes while paused (LM-06), never while playing or under reduced motion. */
    ring: 1,
    /** A Forge glitch on the drawing (SS14): 1 at a pulse, less at a blip, 0 between. */
    glitch: 0,
  };
  /** Frames are drawn at the coarsest dial until the page is idle (R9). */
  let warm = true;
  let warmQueued = false;
  const ctl: Ctl = { params: {}, design: {}, select: {}, drivers: {} };
  let good: Ctl = JSON.parse(JSON.stringify(ctl));

  const state = (): ViewState => ({ orient: s.orient, ...(s.auxName ? { auxName: s.auxName } : {}), ...(s.section ? { section: s.section } : {}), ...(s.detail ? { detail: s.detail } : {}), explode: s.explode });
  const view = (): DrawView3 =>
    E.recordDrawView(L.scene, {
      state: state(),
      theme: E.pageTheme(),
      detail: warm ? LADDER[LADDER.length - 1]! : LADDER[dial.rung]!,
      sheet: true,
      dims: true,
      // the ghost paths are sampled at other settings, each a cycle of solves: they come with the frame after the first (R9)
      show: { traces: s.show.paths, ghosts: s.show.paths && !warm, ticks: s.show.paths, construction: s.show.construction, forces: s.show.forces, velocity: s.show.velocity, angles: s.show.angles },
      ring: s.ring,
      glitch: s.glitch,
      focus: s.focus,
    });

  // the output plot
  const plotCanvas = document.getElementById("plot") as HTMLCanvasElement | null;
  // sampled from the record's kinematics
  let series = plotCanvas ? plotSeries(E, L) : null;
  const plot = plotCanvas && series ? E.makeCard(plotCanvas, E.browserFactory) : null;
  const plotSize = () => {
    if (!plot || !plotCanvas) return;
    const r = plotCanvas.getBoundingClientRect();
    E.sizeCard(plot, r.width, r.height, Math.min(2, E.pixelRatio()));
  };
  plotSize();

  // the detail slider: right is full detail, each step left drops one more rung
  const detail = $<HTMLInputElement>("detail");
  function showDial() {
    detail.value = String(LADDER.length - 1 - dial.rung);
    const r = LADDER[dial.rung]!;
    $("detailv").textContent = r === "full" ? "Full" : r === "A" ? "−A" : `−A–${r}`;
    // why Auto dropped detail, so a screenshot is never mistaken for the full build (DL4)
    const why = s.auto && dial.why !== null ? ` Auto stepped down: frames took about ${Math.round(dial.why)} ms against a budget of ${AUTO.budgetMs} ms.` : "";
    $("detailv").title = r === "full" ? "Everything drawn" : `Not drawn: ${E.DETAIL.slice(0, E.DETAIL.findIndex((x) => x.id === r) + 1).map((x) => x.name.toLowerCase()).join("; ")}.${why}`;
  }

  // the camera controls reflect the pose
  const tilt = $<HTMLInputElement>("tilt");
  function showCamera() {
    const named = E.snappedName(s.orient);
    for (const b of document.querySelectorAll<HTMLButtonElement>("#presets button")) b.setAttribute("aria-pressed", String(!s.section && !s.detail && b.dataset.view === named));
    for (const b of document.querySelectorAll<HTMLButtonElement>("#vviews button")) b.setAttribute("aria-pressed", String(b.dataset.rview === s.rview));
    $("record-view").setAttribute("aria-pressed", String(!s.section && !s.detail && JSON.stringify(s.orient) === JSON.stringify(base.orient)));
    const o = turntable(s.orient);
    tilt.value = String(Math.round(o.tilt));
    $("tiltv").textContent = s.orient.aux ? "Aux" : o.tilt <= 0.5 ? "Plan" : o.tilt >= 89.5 ? "Side" : `${Math.round(o.tilt)}°`;
  }

  let dirty = true;
  let ctlDirty = false;
  sess.onRestored = () => (dirty = true);
  const applyControls = () => {
    ctlDirty = false;
    sess.setPoser(poserFor(E, { kinematics: L.kinematics, lifts: L.scene.pkg.lifts }, ctl as never));
    dirty = true;
  };
  let note = 0;
  /** How long the last frame took, ms. */
  let lastMs = 0;
  const draw = () => {
    const t0 = performance.now();
    try {
      sess.draw(s.u, view());
    } catch (e) {
      // a setting the mechanism cannot assemble in: back to the last one that drew
      if (JSON.stringify(ctl) !== JSON.stringify(good)) {
        Object.assign(ctl, JSON.parse(JSON.stringify(good)));
        syncControls();
        fail("That setting does not assemble, so the last one is back.");
        clearTimeout(note);
        note = window.setTimeout(() => (err.hidden = true), 4000);
        applyControls();
        return;
      }
      fail(`The drawing stopped (${e instanceof Error ? e.message : String(e)}).`);
      throw e;
    }
    good = JSON.parse(JSON.stringify(ctl));
    const ms = performance.now() - t0;
    lastMs = ms;
    if (plot && series) E.drawPlot(plot, E.theme(E.pageTheme()), series.data, s.u, series.unit, series.more);
    const st = sess.stats;
    if (!warm && s.auto && s.playing && autoStep(dial, ms, st?.gpuMs ?? st?.gpuLagMs ?? 0, autoFloor)) showDial();
    const deg = Math.round((((s.u % TAU) + TAU) % TAU) / TAU * 360) % 360;
    $<HTMLInputElement>("scrub").value = String(deg);
    $("scrubv").textContent = `${deg}°`;
    dirty = false;
    if (warm && !warmQueued) {
      warmQueued = true;
      const done = () => {
        warm = false;
        autoSettle(dial);
        dirty = true;
      };
      if ("requestIdleCallback" in window) requestIdleCallback(done, { timeout: 400 });
      else setTimeout(done, 120);
    }
  };

  // nothing is drawn (or measured) while the stage is scrolled out of view
  let inView = true;
  new IntersectionObserver(([e]) => {
    inView = !!e?.isIntersecting;
    if (inView) dirty = true;
  }).observe(canvas);

  let last = performance.now();
  // the paused ring's breath: a redraw of its own a few times a second, from the moment of the pause; a device that
  // cannot draw a frame in that time lets the ring rest at full strength until the next pause
  const breathe = E.DRAFT.lines.accentRing.breathe;
  let pausedAt = performance.now();
  let breathAt = 0;
  let breathless = false;
  const tick = (now: number) => {
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    if (s.playing) {
      // playback runs on the time map (SD27): the phase is a function of the playback fraction
      s.t = (s.t + (dt * s.speed) / CYCLE) % 1;
      s.u = tm.uOf(s.t);
      dirty = true;
    } else if (!reduced && !breathless && inView && now - breathAt >= 1000 / breathe.fps) {
      if (breathAt > pausedAt && lastMs > 1000 / breathe.fps) {
        breathless = true;
        s.ring = 1;
      } else s.ring = E.ringBreath((now - pausedAt) / 1000);
      breathAt = now;
      dirty = true;
    }
    if (tween) {
      const k = Math.min(1, (now - tween.t0) / (TWEEN_S * 1000));
      const e = k * k * (3 - 2 * k);
      s.orient = { yaw: tween.from.yaw + (tween.to.yaw - tween.from.yaw) * e, tilt: tween.from.tilt + (tween.to.tilt - tween.from.tilt) * e };
      s.auxName = undefined;
      showCamera();
      dirty = true;
      if (k >= 1) tween = null;
    }
    if (glitchUntil) {
      s.glitch = now < glitchUntil ? glitchStrength : 0;
      if (!s.glitch) glitchUntil = 0;
      dirty = true;
    }
    if (ctlDirty) applyControls();
    if (dirty && inView) draw();
    requestAnimationFrame(tick);
  };
  // a Forge glitch pulse or blip tears the drawing for its length (islands/forge.ts sends it, never under reduced motion)
  let glitchUntil = 0;
  let glitchStrength = 1;
  /** A camera move under way (explode leaving a plan for the 28 degree view). */
  let tween: { from: Orient; to: Orient; t0: number } | null = null;
  addEventListener("forgeglitch", (e) => {
    if (E.pageTheme() !== "forge") return;
    const d = (e as CustomEvent<{ length?: number; strength?: number }>).detail ?? {};
    const now = performance.now();
    // a blip inside a pulse neither shortens it nor weakens it
    const going = glitchUntil > now;
    glitchStrength = going ? Math.max(glitchStrength, d.strength ?? 1) : (d.strength ?? 1);
    glitchUntil = Math.max(going ? glitchUntil : 0, now + (d.length ?? 0) * 1000);
  });

  // transport
  const play = $<HTMLButtonElement>("play");
  const setPlaying = (v: boolean) => {
    if (v) s.ring = 1;
    else if (s.playing) {
      pausedAt = performance.now();
      breathless = false;
    }
    s.playing = v;
    play.setAttribute("aria-pressed", String(v));
    play.setAttribute("aria-label", v ? "Pause" : "Play");
    $("playicon").setAttribute("d", v ? "M3 2h2v8H3zM7 2h2v8H7z" : "M3 1.5l7 4.5-7 4.5z");
  };
  setPlaying(s.playing);
  play.addEventListener("click", () => setPlaying(!s.playing));
  const setPhase = (u: number) => {
    s.u = ((u % TAU) + TAU) % TAU;
    s.t = tm.tOf(s.u);
    const deg = Math.round((s.u / TAU) * 360) % 360;
    $<HTMLInputElement>("scrub").value = String(deg);
    $("scrubv").textContent = `${deg}°`;
    dirty = true;
  };
  $<HTMLInputElement>("scrub").addEventListener("input", (e) => {
    setPlaying(false);
    setPhase((Number((e.target as HTMLInputElement).value) / 360) * TAU);
  });
  for (const b of document.querySelectorAll<HTMLButtonElement>("#speed button"))
    b.addEventListener("click", () => {
      s.speed = Number(b.dataset.v);
      for (const o of document.querySelectorAll("#speed button")) o.setAttribute("aria-pressed", String(o === b));
    });

  // camera: presets, the record's view, the record's section and detail views, tilt
  const leaveViews = () => {
    s.section = undefined;
    s.detail = undefined;
    s.rview = "";
  };
  for (const b of document.querySelectorAll<HTMLButtonElement>("#presets button"))
    b.addEventListener("click", () => {
      leaveViews();
      s.orient = E.namedOrient(b.dataset.view as never);
      s.auxName = undefined;
      showCamera();
      dirty = true;
    });
  $("record-view").addEventListener("click", () => {
    leaveViews();
    s.orient = { ...base.orient };
    s.auxName = base.auxName;
    showCamera();
    dirty = true;
  });
  for (const b of document.querySelectorAll<HTMLButtonElement>("#vviews button"))
    b.addEventListener("click", () => {
      const rv = rviews.find((x) => x.id === b.dataset.rview);
      if (!rv) return;
      if (s.rview === rv.id) {
        leaveViews();
        s.orient = { ...base.orient };
        s.auxName = base.auxName;
      } else {
        s.rview = rv.id;
        s.orient = { ...rv.state.orient };
        s.auxName = rv.state.auxName;
        s.section = rv.state.section;
        s.detail = rv.state.detail;
      }
      showCamera();
      dirty = true;
    });
  tilt.addEventListener("input", () => {
    const o = turntable(s.orient);
    s.orient = { yaw: o.yaw, tilt: Number(tilt.value) };
    s.auxName = undefined;
    if (!s.section) s.rview = "";
    showCamera();
    dirty = true;
  });
  // explode holds the mechanism still where it is, so the parts do not drift while they are apart (SD12); playback picks
  // up again once it closes, if it was playing
  let playAfterExplode = false;
  $<HTMLInputElement>("explode").addEventListener("input", (e) => {
    const was = s.explode;
    s.explode = Number((e.target as HTMLInputElement).value) / 100;
    if (was === 0 && s.explode > 0) {
      playAfterExplode = s.playing;
      setPlaying(false);
      // a plan looks straight down most explode axes, so the parts would only stack up unseen: ease to the 28 degree
      // view, keeping the turn of the plan (SD12)
      const o = turntable(s.orient);
      if (!s.section && !s.detail && o.tilt < EXPLODE_TILT_BELOW) {
        const to: Orient = { yaw: o.yaw, tilt: EXPLODE_TILT };
        if (reduced) {
          s.orient = to;
          showCamera();
        } else tween = { from: { yaw: o.yaw, tilt: o.tilt }, to, t0: performance.now() };
      }
    } else if (was > 0 && s.explode === 0 && playAfterExplode) {
      playAfterExplode = false;
      setPlaying(true);
    }
    $("explodev").textContent = `${Math.round(s.explode * 100)}%`;
    dirty = true;
  });
  // overlay chips: the ones the record has nothing for are not offered
  const items = L.scene.items;
  const has: Record<string, boolean> = {
    paths: (teaching?.traces.length ?? 0) > 0,
    construction: (teaching?.overlays.length ?? 0) > 0,
    forces: !!items?.forces,
    velocity: !!items?.velocity?.length,
    angles: !!items?.angles,
  };
  for (const c of document.querySelectorAll<HTMLButtonElement>(".ovl .chip")) {
    const k = c.dataset.o!;
    if (!has[k]) c.hidden = true;
    c.addEventListener("click", () => {
      s.show[k] = !s.show[k];
      c.setAttribute("aria-pressed", String(s.show[k]));
      if (k === "construction") showKey();
      dirty = true;
    });
  }
  const ovl = document.querySelector<HTMLElement>(".ovl");
  if (ovl && !Object.values(has).some(Boolean)) ovl.hidden = true;

  // the dial
  const auto = $<HTMLButtonElement>("auto");
  const setAuto = (v: boolean) => {
    s.auto = v;
    autoSettle(dial);
    auto.setAttribute("aria-pressed", String(v));
  };
  auto.addEventListener("click", () => {
    setAuto(!s.auto);
    if (s.auto) Object.assign(dial, autoState());
    showDial();
    dirty = true;
  });
  detail.max = String(LADDER.length - 1);
  detail.addEventListener("input", () => {
    setAuto(false);
    dial.rung = LADDER.length - 1 - Number(detail.value);
    showDial();
    dirty = true;
  });

  // the record's own controls (T14)
  const optionValue = (target: string, key: string, v: string): string | number => {
    if (target !== "design") return v;
    const opt = L.meta.kin?.design.find((d) => d.id === key)?.options[0];
    return typeof opt === "number" ? Number(v) : v;
  };
  let plotTimer = 0;
  const setCtl = (target: StageControl["target"], key: string, v: string | number) => {
    (ctl[target] as Record<string, string | number>)[key] = v;
    ctlDirty = true;
    // the plot follows the settings once they stop changing
    clearTimeout(plotTimer);
    plotTimer = window.setTimeout(() => {
      if (plot) series = plotSeries(E, L, ctl) ?? series;
      dirty = true;
    }, 250);
  };
  const showValue = (i: HTMLInputElement) => {
    const o = document.querySelector<HTMLOutputElement>(`output[data-for="${i.dataset.ctl}"]`);
    if (o) o.textContent = `${i.value}${o.dataset.unit ? ` ${o.dataset.unit}` : ""}`;
  };
  function syncControls() {
    for (const i of document.querySelectorAll<HTMLInputElement>("input[data-ctl]")) {
      const v = (ctl[i.dataset.target as keyof Ctl] as Record<string, number | string>)[i.dataset.key!];
      if (v !== undefined) i.value = String(v);
      showValue(i);
    }
    for (const g of document.querySelectorAll<HTMLElement>(".seg[data-ctl]")) {
      const v = (ctl[g.dataset.target as keyof Ctl] as Record<string, number | string>)[g.dataset.key!];
      if (v !== undefined) for (const b of g.querySelectorAll("button")) b.setAttribute("aria-pressed", String(b.dataset.v === String(v)));
    }
  }
  for (const i of document.querySelectorAll<HTMLInputElement>("input[data-ctl]"))
    i.addEventListener("input", () => {
      setCtl(i.dataset.target as StageControl["target"], i.dataset.key!, Number(i.value));
      showValue(i);
    });
  for (const g of document.querySelectorAll<HTMLElement>(".seg[data-ctl]"))
    for (const b of g.querySelectorAll<HTMLButtonElement>("button"))
      b.addEventListener("click", () => {
        for (const o of g.querySelectorAll("button")) o.setAttribute("aria-pressed", String(o === b));
        setCtl(g.dataset.target as StageControl["target"], g.dataset.key!, optionValue(g.dataset.target!, g.dataset.key!, b.dataset.v!));
      });

  // the construction key: shown under a stage narrow enough for numbered markers, while construction is on (SD22); a
  // tap picks a line out on the drawing, a second tap lets it go
  const ckey = document.getElementById("ckey");
  const showKey = () => {
    if (ckey) ckey.hidden = !s.show.construction || size().width >= E.DRAFT.overlays.rail.minStage;
  };
  for (const b of ckey?.querySelectorAll<HTMLButtonElement>("button") ?? [])
    b.addEventListener("click", () => {
      const n = Number(b.dataset.n);
      s.focus = s.focus === n ? null : n;
      for (const o of ckey!.querySelectorAll("button")) o.setAttribute("aria-pressed", String(Number((o as HTMLElement).dataset.n) === s.focus));
      dirty = true;
    });
  showKey();

  // pointer (SS5): a sideways drag scrubs the cycle and pauses, as on the 2.5D stage; a tap plays or pauses. A mouse
  // orbits with the right button (or Shift and the left), and the stage's menu stays shut after an orbit. A finger drags
  // sideways to scrub and leaves up and down to the page (touch-action: pan-y); two fingers orbit.
  canvas.tabIndex = 0;
  const orbitTo = (yaw: number, tilt: number) => {
    tween = null;
    s.orient = { yaw, tilt: Math.max(0, Math.min(90, tilt)) };
    s.auxName = undefined;
    if (!s.section) s.rview = "";
    showCamera();
    dirty = true;
  };
  // a drag that ends near a named view lands on it; a plan turned in its plane stays as turned
  const landOrbit = () => {
    s.orient = E.snappedName(s.orient) === "PLAN" ? { yaw: s.orient.yaw, tilt: 0 } : E.snapped(s.orient);
    showCamera();
    dirty = true;
  };
  const scrubBy = (u0: number, dx: number) => {
    setPlaying(false);
    setPhase(u0 + (dx / size().width) * TAU);
  };
  type Drag = { id: number; x: number; y: number; mode: "" | "scrub" | "orbit"; orbit: boolean; u: number; yaw: number; tilt: number };
  let drag: Drag | null = null;
  let orbitedAt = 0;
  const start = (id: number, x: number, y: number, orbit: boolean): Drag => {
    const o = turntable(s.orient);
    return { id, x, y, mode: "", orbit, u: s.u, yaw: o.yaw, tilt: o.tilt };
  };
  canvas.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "touch" || (e.button !== 0 && e.button !== 2)) return;
    drag = start(e.pointerId, e.clientX, e.clientY, e.button === 2 || e.shiftKey);
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x;
    const dy = e.clientY - drag.y;
    if (!drag.mode) {
      if (Math.hypot(dx, dy) < DRAG_PX) return;
      // the left button scrubs only sideways; up and down it does nothing
      if (!drag.orbit && Math.abs(dx) < Math.abs(dy)) return;
      drag.mode = drag.orbit ? "orbit" : "scrub";
      canvas.setPointerCapture(e.pointerId);
      if (drag.orbit) canvas.style.cursor = "move";
    }
    if (drag.mode === "orbit") orbitTo(drag.yaw - dx * ORBIT, drag.tilt - dy * ORBIT);
    else scrubBy(drag.u, dx);
  });
  canvas.addEventListener("pointerup", (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    if (drag.mode === "orbit") {
      landOrbit();
      orbitedAt = performance.now();
    } else if (!drag.mode && !drag.orbit && Math.hypot(e.clientX - drag.x, e.clientY - drag.y) < DRAG_PX) setPlaying(!s.playing);
    drag = null;
    canvas.style.cursor = "";
  });
  canvas.addEventListener("pointercancel", () => {
    drag = null;
    canvas.style.cursor = "";
  });
  // the right button is the orbit button: after a right drag (the menu opens on release on some systems) no menu
  canvas.addEventListener("contextmenu", (e) => {
    if (drag?.mode === "orbit" || performance.now() - orbitedAt < 400) e.preventDefault();
  });
  // touch: touch events, so a second finger can take the gesture over before the page starts to scroll
  let touch: (Drag & { fingers: number }) | null = null;
  const centre = (t: TouchList): [number, number] => {
    let x = 0, y = 0;
    for (const p of Array.from(t)) {
      x += p.clientX;
      y += p.clientY;
    }
    return [x / t.length, y / t.length];
  };
  canvas.addEventListener("touchstart", (e) => {
    const [x, y] = centre(e.touches);
    if (e.touches.length === 1) touch = { ...start(0, x, y, false), fingers: 1 };
    else if (e.touches.length === 2) {
      // a second finger turns the gesture into an orbit, from where the fingers are now
      touch = { ...start(0, x, y, true), fingers: 2, mode: "orbit" };
      if (e.cancelable) e.preventDefault();
    } else touch = null;
  }, { passive: false });
  canvas.addEventListener("touchmove", (e) => {
    if (!touch || e.touches.length !== touch.fingers) return;
    const [x, y] = centre(e.touches);
    const dx = x - touch.x;
    const dy = y - touch.y;
    if (touch.mode === "orbit") {
      if (e.cancelable) e.preventDefault();
      orbitTo(touch.yaw - dx * ORBIT, touch.tilt - dy * ORBIT);
      return;
    }
    if (!touch.mode) {
      if (Math.hypot(dx, dy) < DRAG_PX) return;
      // mostly up or down: the page scrolls, and this finger is done with the drawing
      if (Math.abs(dx) < Math.abs(dy)) {
        touch = null;
        return;
      }
      touch.mode = "scrub";
    }
    if (e.cancelable) e.preventDefault();
    scrubBy(touch.u, dx);
  }, { passive: false });
  canvas.addEventListener("touchend", (e) => {
    if (!touch) return;
    if (touch.mode === "orbit") {
      // lifting one of two fingers ends the orbit; the other finger does nothing more
      landOrbit();
      touch = null;
      return;
    }
    if (!touch.mode && e.touches.length === 0) {
      const p = e.changedTouches[0];
      if (p && Math.hypot(p.clientX - touch.x, p.clientY - touch.y) < DRAG_PX) {
        setPlaying(!s.playing);
        // no click after the tap: it would reach the canvas as a mouse click too
        if (e.cancelable) e.preventDefault();
      }
    }
    if (e.touches.length === 0) touch = null;
  });
  canvas.addEventListener("touchcancel", () => (touch = null));
  // keyboard on the drawing (SS10): Space plays or pauses, the arrows step the cycle, Shift with the arrows orbits, 1 to 5
  // are the named views and 0 the record's own
  const NAMED = ["PLAN", "FRONT", "SIDE", "ISOMETRIC", "DIMETRIC"];
  const plain = (e: KeyboardEvent) => !e.ctrlKey && !e.metaKey && !e.altKey;
  canvas.addEventListener("keydown", (e) => {
    if (e.key === " ") setPlaying(!s.playing);
    else if (e.key.startsWith("Arrow") && e.shiftKey) {
      const o = turntable(s.orient);
      const k = KEY_ORBIT;
      orbitTo(o.yaw + (e.key === "ArrowLeft" ? k : e.key === "ArrowRight" ? -k : 0), o.tilt + (e.key === "ArrowUp" ? -k : e.key === "ArrowDown" ? k : 0));
      landOrbit();
    } else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      setPlaying(false);
      setPhase(s.u + ((e.key === "ArrowRight" ? 1 : -1) * TAU) / 72);
    } else if (/^[1-5]$/.test(e.key) && plain(e)) document.querySelector<HTMLButtonElement>(`#presets button[data-view="${NAMED[Number(e.key) - 1]}"]`)?.click();
    else if (e.key === "0" && plain(e)) $("record-view").click();
    else return;
    e.preventDefault();
  });
  window.addEventListener("themechange", () => (dirty = true));
  const resized = new ResizeObserver(() => {
    const r = size();
    sess.resize(r.width, r.height, E.pixelRatio());
    plotSize();
    showKey();
    dirty = true;
  });
  resized.observe(canvas);
  if (plotCanvas) resized.observe(plotCanvas);

  showDial();
  showCamera();
  box.dataset.ready = "1";
  requestAnimationFrame(tick);
}

if (box) {
  views(box);
  void (hasWebGL2() ? main(box) : still(box));
}
