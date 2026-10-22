// The library's Sort button and its menu (SS3, SS10): a menu button whose items are radio items, the current order
// checked. It opens on a click, Enter, Space or an arrow key, with the focus on the current order; the arrow keys, Home
// and End move through the orders, Enter or Space picks one, and Escape, Tab or a click elsewhere closes the menu.
import type { Order } from "../sort";

export interface SortMenu {
  /** The orders the menu offers, in its order. */
  offered: Order[];
  /** Checks `order` in the menu and names it on the button. */
  mark(order: Order): void;
}

/** Sets up the menu; `pick` is called with the order the visitor picks. Null when the page has no Sort button. */
export function sortMenu(pick: (order: Order) => void): SortMenu | null {
  const btn = document.getElementById("sbtn");
  const menu = document.getElementById("sortmenu");
  const wrap = btn?.parentElement;
  if (!btn || !menu || !wrap) return null;
  const value = document.getElementById("sortv");
  const items = [...menu.querySelectorAll<HTMLButtonElement>("[data-sort]")];
  const isOpen = () => btn.getAttribute("aria-expanded") === "true";

  const open = (last = false) => {
    btn.setAttribute("aria-expanded", "true");
    menu.hidden = false;
    const current = items.findIndex((x) => x.getAttribute("aria-checked") === "true");
    items[last ? items.length - 1 : Math.max(0, current)]?.focus();
  };
  const close = (refocus: boolean) => {
    if (!isOpen()) return;
    btn.setAttribute("aria-expanded", "false");
    menu.hidden = true;
    if (refocus) btn.focus();
  };
  const mark = (order: Order) => {
    for (const x of items) x.setAttribute("aria-checked", String(x.dataset.sort === order));
    const item = items.find((x) => x.dataset.sort === order);
    if (value && item) value.textContent = item.textContent?.trim() ?? "";
  };

  btn.addEventListener("click", () => (isOpen() ? close(false) : open()));
  btn.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") open(e.key === "ArrowUp");
    else if (e.key === "Escape" && isOpen()) close(true);
    else return;
    e.preventDefault();
  });
  menu.addEventListener("keydown", (e) => {
    const i = items.indexOf(document.activeElement as HTMLButtonElement);
    const to = (j: number) => items[(j + items.length) % items.length]?.focus();
    if (e.key === "ArrowDown") to(i + 1);
    else if (e.key === "ArrowUp") to(i - 1);
    else if (e.key === "Home") to(0);
    else if (e.key === "End") to(items.length - 1);
    else if (e.key === "Escape") close(true);
    else {
      // Tab leaves the menu closed and moves on as usual
      if (e.key === "Tab") close(false);
      return;
    }
    e.preventDefault();
  });
  for (const item of items)
    item.addEventListener("click", () => {
      const order = item.dataset.sort as Order;
      mark(order);
      close(true);
      pick(order);
    });
  // a click anywhere else closes it (not on focus loss: Safari does not focus a clicked button, so the Sort button's own
  // click would close the menu and open it again)
  document.addEventListener("pointerdown", (e) => {
    if (!wrap.contains(e.target as Node)) close(false);
  });

  return { offered: items.map((x) => x.dataset.sort as Order), mark };
}
