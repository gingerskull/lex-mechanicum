// The sheet switch (SS7): Blueprint or Drafting, remembered per visitor, defaulting to the visitor's preference (the
// inline script in the layout applies it before first paint). Every switch button on the page toggles it; switching
// tells every canvas to redraw at once. A page brought back from the browser's cache takes the sheet chosen since.
const root = document.documentElement;
const NAMES = { dark: "Blueprint", light: "Drafting" } as const;

const current = (): "dark" | "light" => (root.dataset.theme === "light" ? "light" : "dark");

function label() {
  const to = NAMES[current() === "dark" ? "light" : "dark"];
  for (const b of document.querySelectorAll<HTMLButtonElement>("[data-theme-toggle]")) {
    b.setAttribute("aria-label", `Switch to the ${to} sheet`);
    b.title = `${to} sheet`;
  }
}

function set(v: "dark" | "light", remember: boolean) {
  root.dataset.theme = v;
  if (remember)
    try {
      localStorage.setItem("theme", v);
    } catch {
      // storage blocked: the choice lasts for this page only
    }
  label();
  window.dispatchEvent(new CustomEvent("themechange", { detail: v }));
}

for (const b of document.querySelectorAll<HTMLButtonElement>("[data-theme-toggle]"))
  b.addEventListener("click", () => set(current() === "dark" ? "light" : "dark", true));
addEventListener("pageshow", (e) => {
  if (!e.persisted) return;
  let v: string | null = null;
  try {
    v = localStorage.getItem("theme");
  } catch {
    // nothing stored
  }
  if ((v === "dark" || v === "light") && v !== current()) set(v, false);
});
label();
