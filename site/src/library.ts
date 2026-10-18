// The library's state as the visitor left it (filters and search in its URL, the scroll position and the mechanisms it
// shows), kept for the tab in sessionStorage: "Back to library" on a mechanism page returns to it, and Previous and Next step
// through what it shows.
import { url } from "./url";

const KEY = "library";
const RESTORE = "library-restore";

export interface LibraryState {
  /** Path and query of the library page, filters and search included. */
  href: string;
  y: number;
  /** The mechanisms shown, in the library's order. */
  list: { id: string; name: string }[];
  /** True when filters or a search narrow the list. */
  filtered: boolean;
}

const store = (): Storage | null => {
  try {
    return sessionStorage;
  } catch {
    return null;
  }
};

export function saveLibrary(s: LibraryState): void {
  store()?.setItem(KEY, JSON.stringify(s));
}

export function readLibrary(): LibraryState | null {
  try {
    const v = JSON.parse(store()?.getItem(KEY) ?? "null") as LibraryState | null;
    return v && typeof v.href === "string" && typeof v.y === "number" && Array.isArray(v.list) ? v : null;
  } catch {
    return null;
  }
}

/** Marks the next library load as a return from mechanism `id`, so it scrolls to that mechanism's card. */
export const markReturn = (id: string) => store()?.setItem(RESTORE, id);

/** The mechanism returned from, once, on the library load that follows markReturn. */
export function takeReturn(): string | null {
  const s = store();
  const v = s?.getItem(RESTORE) ?? null;
  s?.removeItem(RESTORE);
  return v;
}

/** Whether a URL is the library page of this site. */
export function isLibrary(href: string): boolean {
  try {
    const u = new URL(href, location.href);
    return u.origin === location.origin && u.pathname.replace(/\/$/, "") === url("/").replace(/\/$/, "");
  } catch {
    return false;
  }
}
