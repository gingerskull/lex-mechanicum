// The origin date of a record (record-spec.md, "Origin date"): its format and the day and month a date gets when only
// its year or its period is known.
import { VOCABULARIES, type CatalogRecord } from "./schema";

/** YYYY-MM-DD with a four-digit year, negative before the year 1: -0250-05-17 is in 250 BC. There is no year 0. */
const DATE = /^(-?\d{4})-(\d{2})-(\d{2})$/;
const DAYS = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/**
 * The month and day of a date known only to the year or the period, taken from the mechanism id (FNV-1a hash), so a
 * rerun gives the same date. The day runs 1 to 28, which every month has.
 */
export function dayOfId(id: string): { month: number; day: number } {
  let h = 0x811c9dc5;
  for (let i = 0; i < id.length; i++) h = Math.imul(h ^ id.charCodeAt(i), 0x01000193) >>> 0;
  return { month: 1 + (h % 12), day: 1 + (Math.floor(h / 12) % 28) };
}

const pad = (n: number, width: number) => String(Math.abs(n)).padStart(width, "0");

/** The date of a record known only to the year or the period: `year` with the id's month and day. */
export function fillDate(id: string, year: number): string {
  const { month, day } = dayOfId(id);
  return `${year < 0 ? "-" : ""}${pad(year, 4)}-${pad(month, 2)}-${pad(day, 2)}`;
}

/** Checks a record's `origin`: present, a real date, a known precision, the id's day for a year or a period, a note. */
export function originProblems(r: CatalogRecord): string[] {
  const problems: string[] = [];
  const say = (what: string) => problems.push(`${r.id}: ${what}`);
  const o = r.origin;
  if (o === undefined) return [`${r.id}: origin missing`];
  const precisions: readonly string[] = VOCABULARIES.precision;
  if (!precisions.includes(o.precision)) say(`origin.precision "${String(o.precision)}" not in vocabulary`);
  const m = DATE.exec(o.date ?? "");
  const [year, month, day] = m ? [Number(m[1]), Number(m[2]), Number(m[3])] : [0, 0, 0];
  if (!m || year === 0 || month < 1 || month > 12 || day < 1 || day > DAYS[month - 1]!) say(`origin.date "${String(o.date)}" is not a date YYYY-MM-DD`);
  else if ((o.precision === "year" || o.precision === "period") && o.date !== fillDate(r.id, year))
    say(`origin.date ${o.date} at precision ${o.precision} should be ${fillDate(r.id, year)}`);
  if (typeof o.note !== "string" || !o.note.trim()) say("origin.note missing");
  return problems;
}
