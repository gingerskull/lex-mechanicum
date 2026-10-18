// A mechanism page's way round the library. "Back to library" returns to it as the visitor left it: Back in the browser's
// history when they came straight from it (the browser keeps the scroll and the page), otherwise the library with its
// last filters and search, scrolled to this mechanism's card. Previous and Next step through what the library shows,
// filters and search included (all mechanisms without them). The compact bar with the name and the sheet switch shows
// once the page's heading has scrolled away.
import { isLibrary, markReturn, readLibrary } from "../library";
import { url } from "../url";

const id = document.querySelector<HTMLElement>(".stagebox")?.dataset.id;
const lib = readLibrary();

const back = document.getElementById("back") as HTMLAnchorElement | null;
// a new tab or a copied link gets the filtered library too
if (back && lib) back.href = lib.href;
back?.addEventListener("click", (e) => {
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  if (document.referrer && isLibrary(document.referrer) && history.length > 1) {
    e.preventDefault();
    history.back();
    return;
  }
  if (lib && id) markReturn(id);
});

// Previous and Next through the filtered list, round from the last to the first
const i = lib && id && lib.filtered ? lib.list.findIndex((m) => m.id === id) : -1;
if (lib && i >= 0) {
  const nav = document.querySelector<HTMLElement>(".crumbs .nav");
  if (lib.list.length < 2) nav?.setAttribute("hidden", "");
  for (const [el, j] of [[document.getElementById("prev"), i - 1], [document.getElementById("next"), i + 1]] as const) {
    const m = lib.list[(j + lib.list.length) % lib.list.length]!;
    if (el instanceof HTMLAnchorElement) {
      el.href = url(`/mechanisms/${m.id}/`);
      el.textContent = m.name;
    }
  }
}

// the compact bar: in once the heading is out of view
const bar = document.getElementById("pagebar");
const head = document.querySelector(".dhead .hrow");
if (bar && head)
  new IntersectionObserver(([e]) => bar.classList.toggle("shown", !e?.isIntersecting), { rootMargin: "-1px 0px 0px 0px" }).observe(head);
