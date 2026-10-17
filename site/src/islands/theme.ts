// The sheet switch (SS7): Blueprint or Drafting, remembered per visitor, defaulting to the visitor's preference (the
// inline script in the layout applies it before first paint). Switching tells every canvas to redraw at once.
const root = document.documentElement;
const seg = document.getElementById("theme");

function current(): "dark" | "light" {
  return root.dataset.theme === "light" ? "light" : "dark";
}

function show() {
  for (const b of seg?.querySelectorAll<HTMLButtonElement>("button") ?? []) b.setAttribute("aria-pressed", String(b.dataset.v === current()));
}

seg?.addEventListener("click", (e) => {
  const b = (e.target as HTMLElement).closest<HTMLButtonElement>("button[data-v]");
  if (!b) return;
  const v = b.dataset.v === "light" ? "light" : "dark";
  root.dataset.theme = v;
  try {
    localStorage.setItem("theme", v);
  } catch {
    // storage blocked: the choice lasts for this page only
  }
  show();
  window.dispatchEvent(new CustomEvent("themechange", { detail: v }));
});
show();
