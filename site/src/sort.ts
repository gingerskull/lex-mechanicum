// The library's orders (SS3): New, most recently added first, is the default; Name A to Z, Oldest origin and Sheet number
// are the others. The page is built in the default order and the filters island sorts the cards in the browser; both
// use this module, so they agree. A non-default order lives in the library's address as ?sort=<key>.

export type Order = "new" | "name" | "origin" | "sheet";

/** What the orders read from a sheet. */
export interface Sortable {
  /** The sheet number: 1 for MX-01. */
  no: number;
  name: string;
  /** The day the sheet went live, YYYY-MM-DD, once its record has one. */
  added?: string;
  /** The mechanism's date of origin as a sortable number (originKey), once its record has one. */
  origin?: number;
}

export const ORDERS: { key: Order; label: string }[] = [
  { key: "new", label: "New" },
  { key: "name", label: "Name A to Z" },
  { key: "origin", label: "Oldest origin" },
  { key: "sheet", label: "Sheet number" },
];

export const DEFAULT_ORDER: Order = "new";

const DAY = /^(-?\d{1,6})-(\d{2})-(\d{2})$/;

/** A date of origin, YYYY-MM-DD with a negative year before the year 1, as a number that sorts oldest first. */
export function originKey(date: string): number | undefined {
  const m = DAY.exec(date);
  return m ? Number(m[1]) * 10_000 + Number(m[2]) * 100 + Number(m[3]) : undefined;
}

const names = new Intl.Collator("en", { sensitivity: "base", numeric: true });

/** Missing values go last, whichever way the present ones sort. */
const present = (a: unknown, b: unknown) => (a === undefined ? 1 : 0) - (b === undefined ? 1 : 0);

const COMPARE: Record<Order, (a: Sortable, b: Sortable) => number> = {
  // the latest added day first, then the highest sheet number: until records carry the date, the sheet number alone
  new: (a, b) => present(a.added, b.added) || (b.added ?? "").localeCompare(a.added ?? "") || b.no - a.no,
  name: (a, b) => names.compare(a.name, b.name) || a.no - b.no,
  origin: (a, b) => present(a.origin, b.origin) || (a.origin ?? 0) - (b.origin ?? 0) || a.no - b.no,
  sheet: (a, b) => a.no - b.no,
};

/** A sorted copy of `items` in `order`; `of` gives what the order reads from an item. */
export function sortBy<T>(items: readonly T[], order: Order, of: (t: T) => Sortable = (t) => t as Sortable): T[] {
  const cmp = COMPARE[order];
  return [...items].sort((a, b) => cmp(of(a), of(b)));
}

/** The orders the library offers: Oldest origin only once some sheet has a date of origin. */
export function offeredOrders(items: readonly Sortable[]): Order[] {
  const dated = items.some((s) => s.origin !== undefined);
  return ORDERS.map((o) => o.key).filter((k) => k !== "origin" || dated);
}

/** The order a ?sort= value asks for, if the library offers it; otherwise the default. */
export function orderFrom(value: string | null, offered: readonly Order[]): Order {
  return offered.find((k) => k === value) ?? DEFAULT_ORDER;
}
