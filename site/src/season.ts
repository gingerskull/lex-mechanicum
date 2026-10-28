// The seasonal listing (standard P14, record spec "Seasonal records"): a fictional seasonal mechanism is listed from 3
// days before each occurrence of its holiday (from 00:00) to the end of the 2nd day after it ends, by the visitor's own
// local date. Windows of different mechanisms may overlap. The site is static, so the windows are worked out at build
// time and carried on the page, and the browser decides when the page is viewed (islands/season.ts, the library's
// filters, the stage), with no new release.
import type { Occurrence } from "../../src/catalog/schema";

/** Days a mechanism is listed before its holiday starts, and after it ends. */
export const BEFORE_DAYS = 3;
export const AFTER_DAYS = 2;

/** A listing window: its first and last day, YYYY-MM-DD, both whole days in the visitor's local time. */
export interface ListingWindow {
  from: string;
  until: string;
}

const DAY = /^(\d{4})-(\d{2})-(\d{2})$/;
const pad = (n: number) => String(n).padStart(2, "0");

/** A day, YYYY-MM-DD, moved by `n` days on the calendar (no time zone comes into it). */
export function addDays(day: string, n: number): string {
  const m = DAY.exec(day);
  if (!m) throw new Error(`not a day YYYY-MM-DD: "${day}"`);
  const t = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]) + n));
  return `${t.getUTCFullYear()}-${pad(t.getUTCMonth() + 1)}-${pad(t.getUTCDate())}`;
}

/** The listing windows of a seasonal record's occurrences, earliest first. */
export function windowsOf(dates: Occurrence[]): ListingWindow[] {
  return dates.map((d) => ({ from: addDays(d.start, -BEFORE_DAYS), until: addDays(d.end, AFTER_DAYS) })).sort((a, b) => a.from.localeCompare(b.from));
}

/** The windows as a page carries them, in a `data-season` attribute: `from/until` pairs separated by spaces. */
export const encodeWindows = (ws: ListingWindow[]): string => ws.map((w) => `${w.from}/${w.until}`).join(" ");

/** The windows of a `data-season` attribute; a pair that is not two days is left out. */
export function decodeWindows(s: string | undefined): ListingWindow[] {
  return (s ?? "")
    .split(/\s+/)
    .map((p) => p.split("/"))
    .filter((p): p is [string, string] => p.length === 2 && DAY.test(p[0]!) && DAY.test(p[1]!))
    .map(([from, until]) => ({ from, until }));
}

/** The visitor's local date, YYYY-MM-DD. */
export const localDay = (now: Date): string => `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

/** Whether a mechanism with these windows is listed on `day` (YYYY-MM-DD). */
export const listedOn = (ws: ListingWindow[], day: string): boolean => ws.some((w) => w.from <= day && day <= w.until);

/** Whether a `data-season` attribute's mechanism is listed at `now`, in the visitor's local date. */
export const inSeason = (season: string | undefined, now = new Date()): boolean => listedOn(decodeWindows(season), localDay(now));

/** The first day the mechanism is listed again after `day`, or undefined when its dates have run out. */
export const returnsOn = (ws: ListingWindow[], day: string): string | undefined =>
  ws
    .map((w) => w.from)
    .filter((f) => f > day)
    .sort()[0];

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** A day as the page writes it: 28 October 2027. */
export function longDate(day: string): string {
  const m = DAY.exec(day);
  return m ? `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]} ${m[1]}` : day;
}
