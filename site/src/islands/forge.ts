// The Forge sheet (SS14, LM-12): the unlock on the library's title block (its Rev cell, clicked once per law), the unlock
// moment, the living effects while Forge is the sheet, and a greeting in the console once it is unlocked. Every layer here
// is fixed over the page and takes no click; under reduced motion the moment is a plain fade and nothing moves. Strengths
// and timings are in src/style/forge.ts. The layers hang from the root, not the body: the moment filters the body, and a
// filtered body would hold its fixed children to its own height.
import { FORGE } from "../../../src/style/forge";
import { TOKENS } from "../../../src/style/tokens";
import { clickCounter, currentSheet, forgeUnlocked, rememberForge } from "../forge";
import { setSheet } from "./theme";

const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const P = FORGE.page;
const U = FORGE.unlock;
const rand = (a: number, b: number) => a + Math.random() * (b - a);

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
  set("--fx-vignette", `${P.vignette.alpha * 100}%`);
  set("--fx-vignette-start", `${P.vignette.start * 100}%`);
  set("--fx-glow", `${P.glow.alpha * 100}%`);
  set("--fx-glow-size", `${P.glow.size}px`);
  set("--fx-flicker", P.flicker.depth);
  set("--fx-flicker-period", `${P.flicker.period}s`);
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
  // the drawing on the page tears with it (islands/stage3.ts)
  dispatchEvent(new CustomEvent("forgeglitch", { detail: { length: P.glitch.length } }));
  schedule();
}

function schedule() {
  clearTimeout(pulseTimer);
  pulseTimer = window.setTimeout(pulse, rand(P.glitch.every[0], P.glitch.every[1]) * 1000);
}

function mount() {
  if (fx) return;
  fx = document.createElement("div");
  fx.className = "forge-fx";
  fx.setAttribute("aria-hidden", "true");
  fx.innerHTML = '<div class="fx-glow"></div><div class="fx-scan"></div><div class="fx-flicker"></div><div class="fx-bands"></div>';
  knobs(fx);
  grain = document.createElement("div");
  grain.className = "forge-grain";
  grain.setAttribute("aria-hidden", "true");
  knobs(grain);
  document.documentElement.append(fx, grain);
  // the furnace comes up
  requestAnimationFrame(() => requestAnimationFrame(() => fx?.classList.add("lit")));
  if (reduced) return;
  const g = grain;
  grainTimer = window.setInterval(() => {
    g.style.transform = `translate(${-Math.floor(Math.random() * P.grain.tile)}px, ${-Math.floor(Math.random() * P.grain.tile)}px)`;
  }, 1000 / P.grain.fps);
  schedule();
}

function unmount() {
  clearInterval(grainTimer);
  clearTimeout(pulseTimer);
  fx?.remove();
  grain?.remove();
  fx = grain = null;
}

const sync = () => (currentSheet() === "forge" ? mount() : unmount());

/** For whoever opens the developer tools on an unlocked sheet. */
function greet() {
  const F = TOKENS.themes.forge;
  const mono = TOKENS.type.mono;
  console.log(
    "%cLEX MECHANICUM%c  forge sheet\n%cThe motive force is kindled. Sixteen laws, one drawing office, every part accounted for.\nThe switch now has three sheets.",
    `font: 600 13px ${mono}; letter-spacing: .14em; color: ${F.accent}; background: ${F.paper}; padding: 4px 8px;`,
    `font: 500 11px ${mono}; letter-spacing: .08em; color: ${F.ink}; background: ${F.paper}; padding: 4px 8px;`,
    `font: 400 11px ${mono}; color: ${F.grid};`,
  );
}

/** The unlock moment: flicker, torn bands, a red and blue split and a burst of noise that settles into the Forge sheet. */
function moment() {
  if (reduced) {
    const veil = document.createElement("div");
    veil.className = "forge-veil";
    veil.style.setProperty("--fx-fade", `${U.fade / 2}s`);
    document.documentElement.append(veil);
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
  document.documentElement.append(layer);
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
  const end = () => {
    if (done) return;
    done = true;
    removeEventListener("pointerdown", end, true);
    removeEventListener("keydown", end, true);
    body.classList.remove("forge-glitching");
    tear?.setAttribute("scale", "0");
    red?.setAttribute("dx", "0");
    blue?.setAttribute("dx", "0");
    layer.remove();
    if (!switched) setSheet("forge", true);
  };
  // any click or key skips to the end
  addEventListener("pointerdown", end, true);
  addEventListener("keydown", end, true);
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
  rememberForge();
  dispatchEvent(new CustomEvent("forgeunlock"));
  greet();
  moment();
}

// the Rev cell of the library's title block: silent until the last click
const key = document.querySelector<HTMLElement>("[data-forge-key]");
if (key) {
  const count = clickCounter(U.clicks, U.resetAfter);
  key.addEventListener("click", () => {
    if (count(performance.now())) unlock();
  });
}

addEventListener("themechange", sync);
sync();
if (forgeUnlocked()) greet();
