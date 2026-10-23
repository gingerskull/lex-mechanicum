// Search, facets and order on the library (SS3): any chip of a facet matches (or), every facet must match (and), the
// search matches sheet number, name, other names, summary, tags and keywords, and the cards are sorted in the order
// picked from the Sort menu, which stays as filters change. All data is on the cards; nothing is fetched. The filters,
// search and order live in the page's URL as they change, and the state is kept for the tab when the page is left, so a
// mechanism page's "Back to library" brings the library back as it was and its Previous and Next follow what it shows.
import { readLibrary, saveLibrary, takeReturn } from "../library";
import { DEFAULT_ORDER, orderFrom, sortBy, type Order, type Sortable } from "../sort";
import { sortMenu } from "./sortmenu";

const cards = [...document.querySelectorAll<HTMLAnchorElement>(".card")];
const q = document.getElementById("q") as HTMLInputElement | null;
const qclear = document.getElementById("qclear");
const toggle = document.getElementById("ftoggle");
const panel = document.getElementById("facets");
const badge = document.getElementById("fcount");
const shown = document.getElementById("shown");
const clear = document.getElementById("clear");
const fclear = document.getElementById("fclear") as HTMLButtonElement | null;
const empty = document.getElementById("empty");
const chips = [...document.querySelectorAll<HTMLButtonElement>("#facets .chip")];
const grid = document.getElementById("grid");
const main = document.getElementById("library");
const libbar = document.getElementById("libbar");

// what the orders read from each card; the page comes in the default order
const keys = new Map<HTMLElement, Sortable>(
  cards.map((c) => [c, { no: Number(c.dataset.no), name: c.querySelector("h2")?.textContent ?? "", added: c.dataset.added, origin: c.dataset.origin ? Number(c.dataset.origin) : undefined }]),
);
let order: Order = DEFAULT_ORDER;
let sorted = cards;
// a new order starts from the top of the list: a page scrolled further down goes back to it
const menu = sortMenu((next) => {
  arrange(next);
  apply();
  if (!main) return;
  const top = main.getBoundingClientRect().top + scrollY - (libbar?.offsetHeight ?? 0);
  if (scrollY > top) scrollTo({ top });
});

/** Puts the cards in `next` order; the empty note stays after them. */
function arrange(next: Order) {
  order = next;
  menu?.mark(next);
  sorted = sortBy(cards, next, (c) => keys.get(c)!);
  for (const c of sorted) grid?.insertBefore(c, empty);
}

function apply() {
  const on = chips.filter((c) => c.getAttribute("aria-pressed") === "true");
  const byFacet = new Map<string, Set<string>>();
  for (const c of on) {
    const f = c.dataset.f!;
    if (!byFacet.has(f)) byFacet.set(f, new Set());
    byFacet.get(f)!.add(c.dataset.v!);
  }
  // a sheet number of the old set code (MX-07) finds the sheet it is now (ST-07)
  const words = (q?.value ?? "").toLowerCase().split(/\s+/).filter(Boolean).map((w) => w.replace(/^mx-(\d)/, "st-$1"));
  let n = 0;
  for (const card of cards) {
    const facets = [...byFacet].every(([f, vals]) => (card.dataset[f] ?? "").split("|").some((v) => vals.has(v)));
    const text = words.every((w) => (card.dataset.text ?? "").includes(w));
    const ok = facets && text;
    card.hidden = !ok;
    if (ok) n++;
  }
  if (shown) shown.textContent = `${n} of ${cards.length} sheets`;
  if (badge) {
    badge.hidden = on.length === 0;
    badge.textContent = String(on.length);
  }
  if (clear) clear.hidden = on.length === 0 && words.length === 0;
  if (fclear) fclear.disabled = on.length === 0 && words.length === 0;
  if (empty) empty.hidden = n > 0;
  if (qclear) qclear.hidden = !q?.value;
  // the URL says what is shown: ?<facet>=<value>..., ?q=<words> and ?sort=<order> (not the default)
  const p = new URLSearchParams();
  for (const c of on) p.append(c.dataset.f!, c.dataset.v!);
  if (q?.value.trim()) p.set("q", q.value.trim());
  if (order !== DEFAULT_ORDER) p.set("sort", order);
  const search = p.toString() ? `?${p.toString()}` : "";
  if (search !== location.search) history.replaceState(history.state, "", location.pathname + search + location.hash);
}

toggle?.addEventListener("click", () => {
  const open = toggle.getAttribute("aria-expanded") !== "true";
  toggle.setAttribute("aria-expanded", String(open));
  if (panel) panel.hidden = !open;
});
for (const c of chips)
  c.addEventListener("click", () => {
    c.setAttribute("aria-pressed", String(c.getAttribute("aria-pressed") !== "true"));
    apply();
  });
q?.addEventListener("input", apply);
// the search's clear (x): empties the field and the results follow, the field keeps the focus
const clearSearch = () => {
  if (!q) return;
  q.value = "";
  apply();
  q.focus();
};
qclear?.addEventListener("pointerdown", (e) => e.preventDefault());
qclear?.addEventListener("click", clearSearch);
q?.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && q.value) {
    e.preventDefault();
    clearSearch();
  }
});

// once the bar sticks (the header above it has scrolled away), it carries the set's name and count
const header = document.querySelector("header.top");
if (libbar && header)
  new IntersectionObserver(([e]) => libbar.classList.toggle("stuck", !e?.isIntersecting), { rootMargin: "-1px 0px 0px 0px" }).observe(header);
// clearing the filters also returns the order to the default
const clearAll = () => {
  for (const c of chips) c.setAttribute("aria-pressed", "false");
  if (q) q.value = "";
  if (order !== DEFAULT_ORDER) arrange(DEFAULT_ORDER);
  apply();
};
clear?.addEventListener("click", clearAll);
fclear?.addEventListener("click", clearAll);

// a link from a mechanism page's tags: ?<facet>=<value> presses that chip and opens the panel, ?q=<words> searches;
// a shared link's ?sort=<order> sorts the cards (an order the library does not offer leaves the default)
const params = new URLSearchParams(location.search);
let pressed = false;
for (const c of chips)
  if (params.getAll(c.dataset.f!).includes(c.dataset.v!)) {
    c.setAttribute("aria-pressed", "true");
    pressed = true;
  }
if (pressed && toggle && panel) {
  toggle.setAttribute("aria-expanded", "true");
  panel.hidden = false;
}
if (q && params.has("q")) q.value = params.get("q")!;
const asked = orderFrom(params.get("sort"), menu?.offered ?? []);
if (asked !== DEFAULT_ORDER) arrange(asked);
if (pressed || params.has("q") || params.has("sort")) apply();

// leaving the page keeps its state for the way back; arriving by "Back to library" from a mechanism page shows that
// mechanism's card (or, if the filters hide it, the place the library was left)
addEventListener("pagehide", () => {
  const list = sorted.filter((c) => !c.hidden).map((c) => ({ id: c.dataset.id!, name: c.querySelector("h2")?.textContent ?? c.dataset.id! }));
  saveLibrary({ href: location.pathname + location.search, y: scrollY, list, custom: list.length < cards.length || order !== "sheet" });
});
const from = takeReturn();
if (from) {
  const lib = readLibrary();
  const card = cards.find((c) => c.dataset.id === from && !c.hidden);
  requestAnimationFrame(() => (card ? card.scrollIntoView({ block: "center" }) : scrollTo(0, lib?.y ?? 0)));
}
