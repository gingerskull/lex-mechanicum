// The featured slot of the library (SS16): what featured() picks for the day (site/src/featured.ts) shown large above the
// cards: the sheet's title block on the left (the label, name and number, family, motion and level, the summary, where it
// is found and what it does) and its drawing on the right, fitted as the stage opens it. The stage's still shows at
// once; once the slot is in view the engine loads and the drawing animates from the still's phase and margin, so the
// swap does not jump. With reduced motion it draws that one frame sharp and holds; without WebGL2 the still stays.
// Several seasonal mechanisms share the slot as a slider: dots in a corner of the drawing, a swipe, the arrow keys, and a
// turn every 8 s that waits while the slot is hovered, focused or touched (never under reduced motion). The library's
// filters hide the slot while a search or a filter is on (islands/filters.ts); it pauses while it is out of view.
import { featured } from "../featured";
import { hasWebGL2 } from "../gl";
import { url } from "../url";
import { fetchAll, load3 } from "./load3";
type Engine = typeof import("./engine3");

// the stage's still (tools/thumbs.ts, STILL): its phase, 63° of the cycle, and its width, which the live drawing's margin
// scales to
const START_U = (63 / 360) * Math.PI * 2;
const STILL_W = 1200;
const ADVANCE_MS = 8000;
const SWIPE_PX = 40;
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

interface Live {
  sess: import("./engine3").Session3;
  scene: import("./engine3").Scene;
  u: number;
  t: number;
  raf: number;
}

interface Slide {
  id: string;
  name: string;
  el: HTMLAnchorElement;
  img: HTMLImageElement;
  canvas: HTMLCanvasElement;
  live?: Promise<Live | null>;
}

const slot = document.getElementById("featured");
const view = document.getElementById("fview");
const dotsBox = document.getElementById("fdots");
const sheet = () => (document.documentElement.dataset.theme === "light" ? "light" : "dark");

let engine: Promise<Engine> | null = null;
const slides: Slide[] = [];
const dots: HTMLButtonElement[] = [];
let current = 0;
let inView = false;

const el = <K extends keyof HTMLElementTagNameMap>(tag: K, cls: string, text?: string) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
};

function make(card: HTMLAnchorElement, label: string, first: boolean): Slide {
  const id = card.dataset.id!;
  const name = card.querySelector("h2")?.textContent ?? id;
  const a = el("a", "fslide");
  a.href = card.href;
  // the title block: the label, the name and number, family, motion and level, the summary, the first uses of its
  // examples and the functions it serves, and the way in
  const block = el("div", "fblock");
  const head = el("div", "fhead");
  head.append(el("h2", "", name), el("span", "no", card.querySelector(".no")?.textContent ?? ""));
  block.append(el("span", card.dataset.season !== undefined ? "folklore" : "flabel", label), head, el("span", "meta", card.querySelector(".meta")?.textContent ?? ""), el("p", "sum", card.querySelector(".sum")?.textContent ?? ""));
  // its details at the block's foot, over the way in
  const foot = el("div", "ffoot");
  const uses = (card.dataset.uses ?? "").split("|").filter(Boolean);
  if (uses.length) {
    const found = el("div", "fuses");
    const list = el("ul", "");
    for (const u of uses) list.append(el("li", "", u));
    found.append(el("span", "k", "Found in"), list);
    foot.append(found);
  }
  const tags = el("div", "tags");
  for (const t of card.querySelectorAll(".tags .tag")) tags.append(el("span", "tag", t.textContent ?? ""));
  foot.append(tags);
  block.append(foot, el("span", "fopen", "Open the sheet"));
  // the drawing: the stage's still until the engine draws
  const draw = el("div", "fdraw");
  const img = el("img", "");
  img.alt = `${name}, drawing`;
  img.decoding = "async";
  if (first) img.fetchPriority = "high";
  else img.loading = "lazy";
  const canvas = el("canvas", "");
  canvas.setAttribute("aria-hidden", "true");
  draw.append(img, canvas);
  a.append(block, draw);
  const s: Slide = { id, name, el: a, img, canvas };
  paintStill(s);
  return s;
}

/** The stage's still of the slide for the page's sheet (Forge recolours the Blueprint one, SS14). */
const paintStill = (s: Slide) => (s.img.src = url(`/thumbs/${s.id}-${sheet()}-still.webp`));

// as the still is drawn (tools/thumbs.ts, stillView): no sheet, no construction labels, the card's dial
const drawView = (E: Engine, L: Live) => E.recordDrawView(L.scene, { sheet: false, show: { construction: false }, detail: E.DRAFT.card.detail, theme: E.pageTheme(), refW: STILL_W });

function live(s: Slide): Promise<Live | null> {
  s.live ??= (async () => {
    if (!hasWebGL2()) return null;
    const E = await (engine ??= import("./engine3"));
    const L = await load3(E, s.id, fetchAll(s.id), s.name, "");
    const r = s.canvas.getBoundingClientRect();
    const sess = E.createSession3(s.canvas, L.scene, { factory: E.browserFactory, w: Math.max(1, r.width), h: Math.max(1, r.height), dpr: E.pixelRatio() });
    const it: Live = { sess, scene: L.scene, u: START_U, t: 0, raf: 0 };
    sess.draw(it.u, drawView(E, it));
    s.el.classList.add("live");
    return it;
  })().catch(() => null);
  return s.live;
}

/** Runs the current slide's drawing while the slot is in view and the page shown; stops every other. */
async function run() {
  for (const [i, s] of slides.entries()) if (i !== current) void s.live?.then((L) => L && cancelAnimationFrame(L.raf));
  const s = slides[current];
  if (!s || !inView || document.hidden) {
    if (s) void s.live?.then((L) => L && cancelAnimationFrame(L.raf));
    return;
  }
  const L = await live(s);
  if (!L || reduced || slides[current] !== s) return;
  const E = await engine!;
  cancelAnimationFrame(L.raf);
  L.t = performance.now();
  const frame = (now: number) => {
    L.u += ((now - L.t) / 1000) * (Math.PI / 3);
    L.t = now;
    L.sess.draw(L.u, drawView(E, L));
    L.raf = requestAnimationFrame(frame);
  };
  L.raf = requestAnimationFrame(frame);
}

/** Redraws a held drawing (reduced motion, or paused) after a change of sheet or size. */
async function redraw(s: Slide) {
  const L = await s.live;
  if (!L) return;
  const E = await engine!;
  const r = s.canvas.getBoundingClientRect();
  if (r.width > 0) L.sess.resize(r.width, r.height, E.pixelRatio());
  L.sess.draw(L.u, drawView(E, L));
}

function show(i: number) {
  current = (i + slides.length) % slides.length;
  for (const [k, s] of slides.entries()) {
    const on = k === current;
    s.el.classList.toggle("on", on);
    s.el.inert = !on;
  }
  for (const [k, d] of dots.entries()) d.setAttribute("aria-current", String(k === current));
  void run();
}

function start() {
  if (!slot || !view) return;
  const cards = [...document.querySelectorAll<HTMLAnchorElement>(".card")];
  const pick = featured(cards.map((c) => ({ id: c.dataset.id!, ...(c.dataset.season !== undefined ? { season: c.dataset.season } : {}) })));
  for (const [k, id] of pick.ids.entries()) {
    const card = cards.find((c) => c.dataset.id === id);
    if (!card) continue;
    const label = pick.seasonal ? `Seasonal folklore${card.dataset.occasion ? ` · ${card.dataset.occasion}` : ""}` : "Featured";
    slides.push(make(card, label, k === 0));
  }
  if (!slides.length) {
    slot.hidden = true;
    return;
  }
  view.replaceChildren(...slides.map((s) => s.el));
  if (slides.length > 1 && dotsBox) {
    slot.setAttribute("aria-roledescription", "carousel");
    for (const [k, s] of slides.entries()) {
      const d = document.createElement("button");
      d.type = "button";
      d.setAttribute("aria-label", `Show ${s.name}`);
      d.addEventListener("click", () => show(k));
      dots.push(d);
    }
    dotsBox.replaceChildren(...dots);
    dotsBox.hidden = false;
    slider();
  }
  show(0);
  new IntersectionObserver(([e]) => {
    inView = !!e?.isIntersecting;
    void run();
  }).observe(view);
  document.addEventListener("visibilitychange", () => void run());
  addEventListener("themechange", () => {
    for (const s of slides) {
      paintStill(s);
      if (reduced || slides[current] !== s) void redraw(s);
    }
  });
  new ResizeObserver(() => {
    for (const s of slides) void redraw(s);
  }).observe(view);
}

/** The slider's own turns, swipes and keys (several seasonal mechanisms at once). */
function slider() {
  if (!slot || !view) return;
  let held = 0;
  const hold = (on: boolean) => (held = Math.max(0, held + (on ? 1 : -1)));
  slot.addEventListener("pointerenter", (e) => e.pointerType === "mouse" && hold(true));
  slot.addEventListener("pointerleave", (e) => e.pointerType === "mouse" && hold(false));
  slot.addEventListener("focusin", () => hold(true));
  slot.addEventListener("focusout", () => hold(false));
  // a touch holds the turns for good: the visitor has taken the slider in hand
  let touched = false;
  if (!reduced)
    setInterval(() => {
      if (!held && !touched && inView && !document.hidden) show(current + 1);
    }, ADVANCE_MS);
  let x0: number | null = null;
  let swiped = false;
  view.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "mouse") return;
    touched = true;
    x0 = e.clientX;
    swiped = false;
  });
  view.addEventListener("pointerup", (e) => {
    if (x0 === null) return;
    const dx = e.clientX - x0;
    x0 = null;
    if (Math.abs(dx) < SWIPE_PX) return;
    swiped = true;
    show(current + (dx < 0 ? 1 : -1));
  });
  // a swipe is not a tap on the link
  view.addEventListener("click", (e) => {
    if (!swiped) return;
    e.preventDefault();
    swiped = false;
  });
  slot.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    show(current + (e.key === "ArrowRight" ? 1 : -1));
    dots[current]?.focus();
  });
}

start();
