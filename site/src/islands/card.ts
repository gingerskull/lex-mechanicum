// Library cards (SS1, R8): the thumbnail is a pre-rendered image; on hover the engine loads (once) and the card's
// canvas animates the mechanism from the thumbnail's pose until the pointer leaves, and starts again from it on the next hover. Reduced motion keeps the images still.
import { url } from "../url";
type Engine = typeof import("./engine");

let engine: Promise<Engine> | null = null;
const load = () => (engine ??= import("./engine"));
// the phase of the pre-rendered thumbnail (tools/thumbs.ts, THUMB.u): every hover starts from it, so the swap never jumps
const START_U = 1.1;
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

interface Live {
  sess: import("./engine").Session;
  raf: number;
  u: number;
  t: number;
}

const live = new WeakMap<HTMLElement, Live>();

async function start(card: HTMLAnchorElement) {
  const thumb = card.querySelector<HTMLElement>(".thumb");
  const canvas = thumb?.querySelector("canvas");
  const id = card.dataset.id;
  if (!thumb || !canvas || !id || reduced) return;
  const E = await load();
  if (!card.matches(":hover")) return;
  let L = live.get(thumb);
  if (!L) {
    const [model, pkg] = await Promise.all([E.models[id]!(), E.loadPackage(url(`/packages/${id}.mxp`))]);
    const r = thumb.getBoundingClientRect();
    const sess = E.createSession(canvas, pkg, model, { factory: E.browserFactory, w: r.width, h: r.height, dpr: E.pixelRatio() });
    L = { sess, raf: 0, u: START_U, t: performance.now() };
    live.set(thumb, L);
  }
  const it = L;
  it.u = START_U;
  thumb.classList.add("live");
  it.t = performance.now();
  const frame = (now: number) => {
    it.u += ((now - it.t) / 1000) * (Math.PI / 3);
    it.t = now;
    it.sess.draw(it.u, { ...E.cardView(), theme: E.pageTheme() });
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
  thumb.classList.remove("live");
}

for (const card of document.querySelectorAll<HTMLAnchorElement>(".card")) {
  card.addEventListener("pointerenter", () => void start(card));
  card.addEventListener("pointerleave", () => stop(card));
  card.addEventListener("focus", () => void load());
}
