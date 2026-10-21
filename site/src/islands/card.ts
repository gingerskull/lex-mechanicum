// Library cards (SS1, R8): the thumbnail is a pre-rendered image; on hover the engine loads (once) and the card's
// canvas animates the mechanism from the thumbnail's pose until the pointer leaves, and starts again from it on the next
// hover. Only the last few cards keep a live session; older ones are freed. Reduced motion, or a browser without
// WebGL2, keeps the images still.
import { hasWebGL2 } from "../gl";
import { url } from "../url";
import { fetchAll, load3 } from "./load3";
type Engine = typeof import("./engine");
type Engine3 = typeof import("./engine3");

let engine: Promise<Engine> | null = null;
const load = () => (engine ??= import("./engine"));
let engine3: Promise<Engine3> | null = null;
const load3e = () => (engine3 ??= import("./engine3"));
// the phase of the pre-rendered thumbnail (tools/thumbs.ts, THUMB.u): every hover starts from it, so the swap never jumps
const START_U = 1.1;
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

interface Live {
  /** Draws the card's frame at phase u. */
  draw(u: number): void;
  dispose(): void;
  raf: number;
  u: number;
  t: number;
  running: boolean;
}

/** Live card sessions kept: hovering through the library frees the older ones, so memory stays flat. */
const KEEP = 3;
// insertion order is use order: the first entry is the one used longest ago
const live = new Map<HTMLElement, Live>();
const making = new Map<HTMLElement, Promise<Live>>();

function keep(thumb: HTMLElement, L: Live) {
  live.delete(thumb);
  live.set(thumb, L);
  for (const [t, old] of live) {
    if (live.size <= KEEP) break;
    if (old.running) continue;
    old.dispose();
    live.delete(t);
  }
}
// the card animating now: on touch there is no pointer leaving, so one card runs at a time and a tap elsewhere stops it
let active: HTMLAnchorElement | null = null;

async function start(card: HTMLAnchorElement) {
  const thumb = card.querySelector<HTMLElement>(".thumb");
  const canvas = thumb?.querySelector("canvas");
  const id = card.dataset.id;
  if (!thumb || !canvas || !id || reduced || !hasWebGL2()) return;
  const v3 = card.dataset.engine === "v3";
  const E = v3 ? null : await load();
  const E3 = v3 ? await load3e() : null;
  if (!card.matches(":hover")) return;
  // one session per card, however many enters arrive while it loads
  let made = making.get(thumb);
  if (!live.has(thumb) && !made) {
    made = (async (): Promise<Live> => {
      const r = thumb.getBoundingClientRect();
      if (E3) {
        // a card drawn by the v3 engine: the record's own view, no sheet (SD16), as its committed thumbnail is
        const L = await load3(E3, id, fetchAll(id), card.querySelector("h2")?.textContent ?? id, "");
        const sess = E3.createSession3(canvas, L.scene, { factory: E3.browserFactory, w: r.width, h: r.height, dpr: E3.pixelRatio() });
        const view = () => E3.recordDrawView(L.scene, { card: true, sheet: false, dims: false, theme: E3.pageTheme() });
        return { draw: (u) => sess.draw(u, view()), dispose: () => sess.dispose(), raf: 0, u: START_U, t: performance.now(), running: false };
      }
      const [model, pkg] = await Promise.all([E!.models[id]!(), E!.loadPackage(url(`/packages/${id}.mxp`))]);
      const sess = E!.createSession(canvas, pkg, model, { factory: E!.browserFactory, w: r.width, h: r.height, dpr: E!.pixelRatio() });
      return { draw: (u) => sess.draw(u, { ...E!.cardView(), theme: E!.pageTheme() }), dispose: () => sess.dispose(), raf: 0, u: START_U, t: performance.now(), running: false };
    })();
    making.set(thumb, made);
  }
  const L = live.get(thumb) ?? (await made!);
  making.delete(thumb);
  keep(thumb, L);
  const it = L;
  if (it.running) return; // a repeat enter (a tap while it plays, a scroll) never restarts it
  if (active && active !== card) stop(active);
  active = card;
  it.running = true;
  it.u = START_U;
  thumb.classList.add("live");
  it.t = performance.now();
  const frame = (now: number) => {
    it.u += ((now - it.t) / 1000) * (Math.PI / 3);
    it.t = now;
    it.draw(it.u);
    it.raf = requestAnimationFrame(frame);
  };
  cancelAnimationFrame(it.raf);
  it.raf = requestAnimationFrame(frame);
}

function stop(card: HTMLAnchorElement) {
  const thumb = card.querySelector<HTMLElement>(".thumb");
  const L = thumb && live.get(thumb);
  if (!thumb || !L) return;
  cancelAnimationFrame(L.raf);
  L.running = false;
  thumb.classList.remove("live");
  if (active === card) active = null;
}

for (const card of document.querySelectorAll<HTMLAnchorElement>(".card")) {
  card.addEventListener("pointerenter", () => void start(card));
  card.addEventListener("pointerleave", (e) => {
    if (e.pointerType === "mouse") stop(card);
  });
  card.addEventListener("focus", () => {
    if (hasWebGL2()) void (card.dataset.engine === "v3" ? load3e() : load());
  });
}
// the thumbnails load lazily; once the page is idle, every card's image for the current sheet is fetched ahead of
// scrolling, so none pops in (the other sheet's images wait until the sheet is switched)
const ahead = () => {
  const t = document.documentElement.dataset.theme === "light" ? "light" : "dark";
  for (const img of document.querySelectorAll<HTMLImageElement>(`.thumb img.t-${t}`)) img.loading = "eager";
};
const idle = (f: () => void) => ("requestIdleCallback" in window ? requestIdleCallback(f, { timeout: 1500 }) : setTimeout(f, 300));
if (document.readyState === "complete") idle(ahead);
else addEventListener("load", () => idle(ahead), { once: true });
addEventListener("themechange", ahead);

document.addEventListener("pointerdown", (e) => {
  if (e.pointerType !== "mouse" && active && !active.contains(e.target as Node)) stop(active);
});
