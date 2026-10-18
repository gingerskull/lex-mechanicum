// The library's state as the visitor left it (filters and search in its URL, and the scroll position), kept for the
// tab in sessionStorage, so "All mechanisms" on a mechanism page returns to the library as it was.
import { url } from "./url";

const KEY = "library";
const RESTORE = "library-restore";

export interface LibraryState {
  /** Path and query of the library page, filters and search included. */
  href: string;
  y: number;
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
    return v && typeof v.href === "string" && typeof v.y === "number" ? v : null;
  } catch {
    return null;
  }
}

/** Marks the next library load as a return, so it scrolls to where the visitor was. */
export const markReturn = () => store()?.setItem(RESTORE, "1");

/** True once, on the library load that follows markReturn. */
export function takeReturn(): boolean {
  const s = store();
  const v = s?.getItem(RESTORE) === "1";
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
