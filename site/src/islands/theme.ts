// The sheet switch (SS7): Blueprint or Drafting, and Forge once it is unlocked (SS14), remembered per visitor, defaulting
// to the visitor's preference (the inline script in the layout applies it before first paint). Every switch button on the
// page steps it on; switching tells every canvas to redraw at once. A page brought back from the browser's cache takes
// the sheet chosen since.
import { currentSheet, forgeUnlocked, nextSheet, SHEET_NAMES, type SheetKey } from "../forge";

const root = document.documentElement;

function label() {
  const to = SHEET_NAMES[nextSheet(currentSheet(), forgeUnlocked())];
  for (const b of document.querySelectorAll<HTMLButtonElement>("[data-theme-toggle]")) {
    b.setAttribute("aria-label", `Switch to ${to}`);
    b.title = `Switch to ${to}`;
  }
}

/** Shows sheet `v` everywhere on the page, and keeps it for the visitor when `remember` is set. */
export function setSheet(v: SheetKey, remember: boolean) {
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
  b.addEventListener("click", () => setSheet(nextSheet(currentSheet(), forgeUnlocked()), true));
addEventListener("pageshow", (e) => {
  if (!e.persisted) return;
  let v: string | null = null;
  try {
    v = localStorage.getItem("theme");
  } catch {
    // nothing stored
  }
  if ((v === "dark" || v === "light" || (v === "forge" && forgeUnlocked())) && v !== currentSheet()) setSheet(v, false);
});
addEventListener("forgeunlock", label);
label();
