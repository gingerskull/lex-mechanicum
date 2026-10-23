// The Forge sheet (SS14, LM-12): the unlock (the sheet switch held until its cog fills with brass, or the library title
// block's Rev cell clicked once per law), the unlock moment, the living effects while Forge is the sheet, the hints (a
// glint on the cog, a line in the console, the hint phrases of site/src/lore.ts) and a greeting once it is unlocked. Every
// layer here is fixed over the page and takes no click; under reduced motion the moment is a plain fade and nothing moves.
// Strengths and timings are in src/style/forge.ts. The layers hang from the root, not the body: the moment filters the
// body, and a filtered body would hold its fixed children to its own height.
import { FORGE } from "../../../src/style/forge";
import { TOKENS } from "../../../src/style/tokens";
import { clickCounter, currentSheet, forgeUnlocked, rememberForge } from "../forge";
import { pickHint } from "../lore";
import { setSheet } from "./theme";

const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const P = FORGE.page;
const U = FORGE.unlock;
const BRASS = TOKENS.themes.forge.accent;
const rand = (a: number, b: number) => a + Math.random() * (b - a);
const root = document.documentElement;

/** A tile of grey noise as a data URL, made once. */
let noiseUrl = "";
function noise(): string {
  if (noiseUrl) return noiseUrl;
  const n = P.grain.tile;
  const c = document.createElement("canvas");
  c.width = c.height = n;
  const ctx = c.getContext("2d");
  if (!ctx) return "";
  const img = ctx.createImageData(n, n);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = Math.floor(Math.random() * 256);
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  noiseUrl = `url(${c.toDataURL()})`;
  return noiseUrl;
}

/** The knobs the stylesheet reads, as custom properties on a layer. */
function knobs(el: HTMLElement) {
  const set = (k: string, v: string | number) => el.style.setProperty(k, String(v));
  set("--fx-noise", noise());
  set("--fx-tile", `${P.grain.tile}px`);
  set("--fx-grain", P.grain.alpha);
  set("--fx-scan", `${P.scanlines.alpha * 100}%`);
  set("--fx-pitch", `${P.scanlines.pitch}px`);
  set("--fx-drift", `${P.scanlines.drift}s`);
  set("--fx-roll", `${P.roll.alpha * 100}%`);
  set("--fx-roll-height", `${P.roll.height}px`);
  set("--fx-roll-period", `${P.roll.period}s`);
  set("--fx-vignette", `${P.vignette.alpha * 100}%`);
  set("--fx-vignette-start", `${P.vignette.start * 100}%`);
  set("--fx-glow", `${P.glow.alpha * 100}%`);
  set("--fx-glow-size", `${P.glow.size}px`);
  set("--fx-glow-low", P.glow.low);
  set("--fx-glow-period", `${P.glow.period}s`);
  set("--fx-flicker", P.flicker.depth);
  set("--fx-flicker-period", `${P.flicker.period}s`);
  set("--fx-blip", P.blips.depth);
  set("--fx-band-hue", `${P.glitch.hue}deg`);
  set("--fx-lit", `${U.glow}s`);
  set("--fx-noise-burst", U.noise);
  set("--fx-dip", U.flickerDepth);
}

// the living layers while Forge is the sheet; the grain is a layer of its own so it blends with the page
let fx: HTMLElement | null = null;
let grain: HTMLElement | null = null;
let grainTimer = 0;
let pulseTimer = 0;
let blipTimer = 0;

/** The drawing on the page tears with the page (islands/stage3.ts): `strength` 1 at a pulse, less at a blip. */
const tearDrawing = (length: number, strength: number) => dispatchEvent(new CustomEvent("forgeglitch", { detail: { length, strength } }));

/** A glitch pulse: a few thin bands of the page shift in colour, the text's fringe widens, the drawing tears. */
function pulse() {
  if (!fx) return;
  const bands = fx.querySelector<HTMLElement>(".fx-bands");
  for (let k = 0; k < P.glitch.bands && bands; k++) {
    const b = document.createElement("div");
    b.className = "fx-band";
    b.style.top = `${rand(0.05, 0.95) * innerHeight}px`;
    b.style.height = `${rand(P.glitch.height[0], P.glitch.height[1])}px`;
    bands.append(b);
    setTimeout(() => b.remove(), P.glitch.length * 1000);
  }
  root.classList.add("forge-jolt");
  setTimeout(() => root.classList.remove("forge-jolt"), P.glitch.length * 1000);
  tearDrawing(P.glitch.length, 1);
  pulseTimer = window.setTimeout(pulse, rand(P.glitch.every[0], P.glitch.every[1]) * 1000);
}

/** A blip: a strip of the page brightens or dims for a moment, or a thin line tears across it; the drawing twitches. */
function blip() {
  if (!fx) return;
  const bands = fx.querySelector<HTMLElement>(".fx-bands");
  const b = document.createElement("div");
  const kind = Math.random();
  b.className = kind < 0.4 ? "fx-blip dim" : kind < 0.75 ? "fx-blip lit" : "fx-blip line";
  b.style.top = `${rand(0.03, 0.97) * innerHeight}px`;
  if (kind < 0.75) b.style.height = `${rand(P.blips.height[0], P.blips.height[1])}px`;
  bands?.append(b);
  setTimeout(() => b.remove(), P.blips.length * 1000);
  if (Math.random() < 0.5) tearDrawing(P.blips.length, FORGE.canvas.blip);
  blipTimer = window.setTimeout(blip, rand(P.blips.every[0], P.blips.every[1]) * 1000);
}

function mount() {
  if (fx) return;
  fx = document.createElement("div");
  fx.className = "forge-fx";
  fx.setAttribute("aria-hidden", "true");
  fx.innerHTML = '<div class="fx-glow"></div><div class="fx-scan"></div><div class="fx-roll"></div><div class="fx-flicker"></div><div class="fx-bands"></div>';
  knobs(fx);
  grain = document.createElement("div");
  grain.className = "forge-grain";
  grain.setAttribute("aria-hidden", "true");
  knobs(grain);
  root.append(fx, grain);
  // the text's warm and cool fringe (forge.css reads these on the root)
  root.style.setProperty("--fx-ab", `${P.aberration.shift}px`);
  root.style.setProperty("--fx-ab-pulse", `${P.aberration.pulse}px`);
  root.style.setProperty("--fx-ab-alpha", `${P.aberration.alpha * 100}%`);
  // the furnace comes up
  requestAnimationFrame(() => requestAnimationFrame(() => fx?.classList.add("lit")));
  if (reduced) return;
  const g = grain;
  grainTimer = window.setInterval(() => {
    g.style.transform = `translate(${-Math.floor(Math.random() * P.grain.tile)}px, ${-Math.floor(Math.random() * P.grain.tile)}px)`;
  }, 1000 / P.grain.fps);
  pulseTimer = window.setTimeout(pulse, rand(P.glitch.every[0], P.glitch.every[1]) * 1000);
  blipTimer = window.setTimeout(blip, rand(P.blips.every[0], P.blips.every[1]) * 1000);
}

function unmount() {
  clearInterval(grainTimer);
  clearTimeout(pulseTimer);
  clearTimeout(blipTimer);
  fx?.remove();
  grain?.remove();
  fx = grain = null;
  root.classList.remove("forge-jolt");
  for (const k of ["--fx-ab", "--fx-ab-pulse", "--fx-ab-alpha"]) root.style.removeProperty(k);
}

const sync = () => (currentSheet() === "forge" ? mount() : unmount());

const consoleFont = (w: number, size: number) => `font: ${w} ${size}px ${TOKENS.type.mono};`;

/** For whoever opens the developer tools on an unlocked sheet. */
function greet() {
  const F = TOKENS.themes.forge;
  console.log(
    "%cLEX MECHANICUM%c  forge sheet\n%cThe motive force is kindled. Sixteen laws, one drawing office, every part accounted for.\nThe switch now has three sheets.",
    `${consoleFont(600, 13)} letter-spacing: .14em; color: ${F.accent}; background: ${F.paper}; padding: 4px 8px;`,
    `${consoleFont(500, 11)} letter-spacing: .08em; color: ${F.ink}; background: ${F.paper}; padding: 4px 8px;`,
    `${consoleFont(400, 11)} color: ${F.grid};`,
  );
}

/** For whoever opens the developer tools before the unlock. */
const whisper = () => console.log("%cThe forge sleeps. Hold the cog.", `${consoleFont(500, 11)} letter-spacing: .08em; color: ${TOKENS.themes.forge.grid};`);

/** The unlock moment: flicker, torn bands, a red and blue split and a burst of noise that settles into the Forge sheet. */
function moment() {
  if (reduced) {
    const veil = document.createElement("div");
    veil.className = "forge-veil";
    veil.style.setProperty("--fx-fade", `${U.fade / 2}s`);
    root.append(veil);
    requestAnimationFrame(() => veil.classList.add("on"));
    setTimeout(() => {
      setSheet("forge", true);
      veil.classList.remove("on");
      setTimeout(() => veil.remove(), (U.fade / 2) * 1000);
    }, (U.fade / 2) * 1000);
    return;
  }
  const layer = document.createElement("div");
  layer.className = "forge-moment";
  layer.setAttribute("aria-hidden", "true");
  layer.innerHTML = '<div class="m-noise"></div><div class="m-dip"></div>';
  knobs(layer);
  root.append(layer);
  const burst = layer.querySelector<HTMLElement>(".m-noise")!;
  const dip = layer.querySelector<HTMLElement>(".m-dip")!;
  const turb = document.getElementById("forge-turb");
  const tear = document.getElementById("forge-tear");
  const red = document.getElementById("forge-red");
  const blue = document.getElementById("forge-blue");
  const body = document.body;
  body.classList.add("forge-glitching");
  const t0 = performance.now();
  let switched = false;
  let seedAt = 0;
  let done = false;
  // a key still held from the hold on the cog repeats: only a fresh press skips
  const skip = (e: KeyboardEvent) => {
    if (!e.repeat) end();
  };
  const end = () => {
    if (done) return;
    done = true;
    removeEventListener("pointerdown", end, true);
    removeEventListener("keydown", skip, true);
    body.classList.remove("forge-glitching");
    tear?.setAttribute("scale", "0");
    red?.setAttribute("dx", "0");
    blue?.setAttribute("dx", "0");
    layer.remove();
    if (!switched) setSheet("forge", true);
  };
  // any click or key skips to the end
  addEventListener("pointerdown", end, true);
  addEventListener("keydown", skip, true);
  const frame = (now: number) => {
    if (done) return;
    const t = (now - t0) / 1000;
    if (t >= U.moment) return end();
    // strong at first, settling from half a second on
    const k = t < 0.5 ? 1 : Math.max(0, 1 - (t - 0.5) / 0.7);
    tear?.setAttribute("scale", String(2 * U.tear * k));
    red?.setAttribute("dx", String(-U.split * k));
    blue?.setAttribute("dx", String(U.split * k));
    if (now - seedAt > 70) {
      seedAt = now;
      turb?.setAttribute("seed", String(1 + Math.floor(Math.random() * 997)));
      burst.style.transform = `translate(${-Math.floor(Math.random() * P.grain.tile)}px, ${-Math.floor(Math.random() * P.grain.tile)}px)`;
    }
    burst.style.opacity = String(U.noise * (t < 0.3 ? t / 0.3 : Math.max(0, 1 - (t - 0.3) / 0.9)));
    // two dips, 0.3 s apart: never more than 3 flashes a second
    dip.style.opacity = U.flickers.some((f) => t >= f && t < f + U.flickerLength) ? String(U.flickerDepth) : "0";
    if (!switched && t >= U.switchAt) {
      switched = true;
      setSheet("forge", true);
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

function unlock() {
  const first = !forgeUnlocked();
  rememberForge();
  dispatchEvent(new CustomEvent("forgeunlock"));
  if (first) greet();
  moment();
}

// --- the cog: held for a second, it starts to fill with brass; full, it unlocks. A shorter press is a plain switch.

/** True while a hold has gone past the switch: the click that ends it must not switch the sheet. */
let eatClick = false;
/** Until when (ms) a click is still taken for the end of a hold: a hold that ends with no click leaves nothing behind. */
let eatUntil = 0;
addEventListener(
  "click",
  (e) => {
    if (!(eatClick || performance.now() < eatUntil) || !(e.target as Element | null)?.closest?.("[data-theme-toggle]")) return;
    eatClick = false;
    eatUntil = 0;
    e.preventDefault();
    e.stopImmediatePropagation();
  },
  true,
);

function holdable(btn: HTMLButtonElement) {
  let state: "idle" | "waiting" | "filling" = "idle";
  let wait = 0;
  let raf = 0;
  let from = 0;
  let at: [number, number] | null = null;
  let kindle: HTMLElement | null = null;

  const clear = () => {
    clearTimeout(wait);
    cancelAnimationFrame(raf);
    kindle?.remove();
    kindle = null;
    btn.classList.remove("kindling");
    state = "idle";
  };
  const fill = (now: number) => {
    const p = Math.min(1, (now - from) / (U.holdFill * 1000));
    kindle?.style.setProperty("--kindle", `${(p * 360).toFixed(1)}deg`);
    if (p < 1) {
      raf = requestAnimationFrame(fill);
      return;
    }
    clear();
    unlock();
  };
  const begin = (x?: number, y?: number) => {
    clear();
    eatClick = false;
    at = x === undefined || y === undefined ? null : [x, y];
    state = "waiting";
    wait = window.setTimeout(() => {
      // from here the hold is not a switch any more: the click that ends it is eaten
      state = "filling";
      eatClick = true;
      const svg = btn.querySelector("svg");
      if (!svg) return;
      kindle = document.createElement("span");
      kindle.className = "kindle";
      kindle.setAttribute("aria-hidden", "true");
      kindle.style.color = BRASS;
      kindle.append(svg.cloneNode(true));
      btn.append(kindle);
      btn.classList.add("kindling");
      from = performance.now();
      raf = requestAnimationFrame(fill);
    }, U.holdDelay * 1000);
  };

  /** The hold is over: what it started stops, and the click that may follow is eaten for a moment only. */
  const release = () => {
    if (state !== "idle") clear();
    if (eatClick) {
      eatClick = false;
      eatUntil = performance.now() + 400;
    }
  };
  let touch = false;
  btn.addEventListener("pointerdown", (e) => {
    touch = e.pointerType === "touch";
    if (!e.isPrimary || e.button !== 0) return;
    begin(e.clientX, e.clientY);
  });
  btn.addEventListener("pointermove", (e) => {
    if (e.isPrimary && state !== "idle" && at && Math.hypot(e.clientX - at[0], e.clientY - at[1]) > U.holdSlop) release();
  });
  for (const ev of ["pointerup", "pointercancel", "pointerleave"] as const)
    btn.addEventListener(ev, (e) => {
      if (e.isPrimary) release();
    });
  // a hold the page loses (another window, another tab, the focus elsewhere) does not go on by itself
  btn.addEventListener("blur", release);
  addEventListener("blur", release);
  document.addEventListener("visibilitychange", () => document.hidden && release());
  // a finger's long press, or a press already holding, is ours, not the browser's menu; a right-click stays a right-click
  btn.addEventListener("contextmenu", (e) => {
    if (touch || state !== "idle") e.preventDefault();
  });
  // the keyboard: Space or Enter held the same way; a short press still switches
  btn.addEventListener("keydown", (e) => {
    if (e.key !== " " && e.key !== "Enter") return;
    e.preventDefault();
    if (!e.repeat && state === "idle") begin();
  });
  btn.addEventListener("keyup", (e) => {
    if (e.key !== " " && e.key !== "Enter") return;
    e.preventDefault();
    const short = state === "waiting";
    if (state !== "idle") clear();
    eatClick = false;
    eatUntil = 0;
    if (short) btn.click();
  });
}

for (const b of document.querySelectorAll<HTMLButtonElement>("[data-theme-toggle]")) holdable(b);

// the Rev cell of the library's title block: silent until the last click
const key = document.querySelector<HTMLElement>("[data-forge-key]");
if (key) {
  const count = clickCounter(U.clicks, U.resetAfter);
  key.addEventListener("click", () => {
    if (count(performance.now())) unlock();
  });
}

// --- the hints

/** Every hint line on the page says one of the phrases, picked now. */
export function hint(): void {
  for (const el of document.querySelectorAll<HTMLElement>("[data-lore-hint]")) el.textContent = pickHint();
}
hint();

/** The visit count, and on the visit set in the knobs, while Forge is still locked, a glint on the cog. */
function glint() {
  let n: number;
  try {
    n = Number(localStorage.getItem("forge-visits") ?? 0) + 1;
    localStorage.setItem("forge-visits", String(n));
  } catch {
    return;
  }
  if (n !== U.glintVisit || forgeUnlocked() || reduced) return;
  setTimeout(() => {
    for (const b of document.querySelectorAll<HTMLElement>("[data-theme-toggle]")) {
      b.style.setProperty("--brass", BRASS);
      b.style.setProperty("--glint", `${U.glint}s`);
      b.classList.add("glint");
      setTimeout(() => b.classList.remove("glint"), U.glint * 1000);
    }
  }, 1500);
}
glint();

addEventListener("themechange", sync);
sync();
if (forgeUnlocked()) greet();
else whisper();
