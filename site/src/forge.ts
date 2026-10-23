// The sheets a visitor can switch between (SS7, SS14): Blueprint and Drafting, and Forge once unlocked. The unlock is kept
// in the visitor's storage; where storage is blocked it lasts for the page.

export type SheetKey = "dark" | "light" | "forge";

export const SHEET_NAMES: Record<SheetKey, string> = { dark: "Blueprint", light: "Drafting", forge: "Forge" };

const KEY = "forge";
let unlockedHere = false;

export function forgeUnlocked(): boolean {
  if (unlockedHere) return true;
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export function rememberForge(): void {
  unlockedHere = true;
  try {
    localStorage.setItem(KEY, "1");
  } catch {
    // storage blocked: the unlock lasts for this page only
  }
}

/** The sheet the switch goes to next: Blueprint and Drafting in turn, then Forge too once it is unlocked. */
export function nextSheet(current: SheetKey, unlocked: boolean): SheetKey {
  const order: SheetKey[] = unlocked ? ["dark", "light", "forge"] : ["dark", "light"];
  const i = order.indexOf(current);
  return order[(i + 1) % order.length]!;
}

/** The sheet the page shows: the root's data-theme, Blueprint by default. */
export const currentSheet = (): SheetKey => {
  const t = document.documentElement.dataset.theme;
  return t === "light" || t === "forge" ? t : "dark";
};

/** A pulse of the clicks on the Rev cell: the count so far, reset after a pause; true on the click that unlocks. */
export function clickCounter(clicks: number, resetAfter: number): (now: number) => boolean {
  let n = 0;
  let last = -Infinity;
  return (now) => {
    if (now - last > resetAfter * 1000) n = 0;
    last = now;
    n++;
    if (n < clicks) return false;
    n = 0;
    return true;
  };
}
