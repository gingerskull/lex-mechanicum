// Search and facets on the library (SS3): any chip of a facet matches (or), every facet must match (and), and the
// search matches name, other names, summary, tags and keywords. All data is on the cards; nothing is fetched.
const cards = [...document.querySelectorAll<HTMLAnchorElement>(".card")];
const q = document.getElementById("q") as HTMLInputElement | null;
const toggle = document.getElementById("ftoggle");
const panel = document.getElementById("facets");
const badge = document.getElementById("fcount");
const shown = document.getElementById("shown");
const clear = document.getElementById("clear");
const empty = document.getElementById("empty");
const chips = [...document.querySelectorAll<HTMLButtonElement>("#facets .chip")];

function apply() {
  const on = chips.filter((c) => c.getAttribute("aria-pressed") === "true");
  const byFacet = new Map<string, Set<string>>();
  for (const c of on) {
    const f = c.dataset.f!;
    if (!byFacet.has(f)) byFacet.set(f, new Set());
    byFacet.get(f)!.add(c.dataset.v!);
  }
  const words = (q?.value ?? "").toLowerCase().split(/\s+/).filter(Boolean);
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
  if (empty) empty.hidden = n > 0;
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
clear?.addEventListener("click", () => {
  for (const c of chips) c.setAttribute("aria-pressed", "false");
  if (q) q.value = "";
  apply();
});

// a link from a mechanism page's tags: ?<facet>=<value> presses that chip and opens the panel, ?q=<words> searches
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
if (pressed || params.has("q")) apply();
