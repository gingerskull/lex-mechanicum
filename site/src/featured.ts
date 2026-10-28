// The featured slot of the library (SS16): while seasonal mechanisms are listed (P14, by the visitor's local date) they
// are the featured ones, in the order of their holidays; otherwise one sheet of the library, picked at random for a
// period of three days counted in UTC from a fixed epoch, so every visitor sees the same one and a shared link shows it
// too. The period's number seeds the pick, and a pick is never the previous period's. The site is static: the browser
// decides when the page is viewed (islands/featured.ts), with no new release.
import { decodeWindows, localDay } from "./season";

/** Days a rotation pick stays featured. */
export const PERIOD_DAYS = 3;
/** The first day of period 0 (UTC). */
export const EPOCH = "2026-10-01";

const DAY = 86_400_000;

/** A sheet as the pick reads it: its id, and a seasonal mechanism's listing windows (`data-season`). */
export interface Candidate {
  id: string;
  season?: string;
}

export interface Featured {
  /** The ids to show, in order: one for the rotation, every listed seasonal one otherwise. */
  ids: string[];
  seasonal: boolean;
}

/** The rotation period `now` falls in, counted in UTC days from EPOCH. */
export function periodOf(now: Date): number {
  const [y, m, d] = EPOCH.split("-").map(Number) as [number, number, number];
  const days = Math.floor((Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) - Date.UTC(y, m - 1, d)) / DAY);
  return Math.floor(days / PERIOD_DAYS);
}

/** A 32-bit hash of a string (FNV-1a, then the murmur finaliser): the same in every browser. */
function hash(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 0x01000193);
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  return (h ^ (h >>> 16)) >>> 0;
}

/**
 * The rotation's pick in period `p`: the id that draws the highest number for the period, leaving out the previous
 * period's pick. Worked forward from period 0, so a sheet added later moves a pick only in a period it wins.
 */
export function rotationPick(ids: readonly string[], p: number): string | undefined {
  const pool = [...ids].sort();
  if (!pool.length) return undefined;
  let last: string | undefined;
  for (let q = Math.min(0, p); q <= p; q++) {
    let best: string | undefined;
    let top = -1;
    for (const id of pool) {
      if (id === last && pool.length > 1) continue;
      const v = hash(`${id}:${q}`);
      if (v > top) [best, top] = [id, v];
    }
    last = best;
  }
  return last;
}

/** What the slot shows at `now`: the seasonal mechanisms listed then, by their window's start, or the rotation's pick. */
export function featured(sheets: readonly Candidate[], now = new Date()): Featured {
  const day = localDay(now);
  const listed = sheets
    .filter((s) => s.season !== undefined)
    .map((s) => ({ id: s.id, w: decodeWindows(s.season).find((w) => w.from <= day && day <= w.until) }))
    .filter((s): s is { id: string; w: { from: string; until: string } } => s.w !== undefined)
    .sort((a, b) => a.w.from.localeCompare(b.w.from) || a.w.until.localeCompare(b.w.until) || a.id.localeCompare(b.id));
  if (listed.length) return { ids: listed.map((s) => s.id), seasonal: true };
  const pick = rotationPick(
    sheets.filter((s) => s.season === undefined).map((s) => s.id),
    periodOf(now),
  );
  return { ids: pick ? [pick] : [], seasonal: false };
}
