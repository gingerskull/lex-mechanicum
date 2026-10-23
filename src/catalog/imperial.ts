// The Imperial date (style SD10, the title block's DATE cell): a record date YYYY-MM-DD written as the part of the year
// gone, the year within its millennium and the millennium, `800.026.M3` for 20 October 2026. No imports, so the tools
// and the site can share it.

const DATE = /^(-?)(\d{4})-(\d{2})-(\d{2})$/;
const MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/** A leap year of the proleptic Gregorian calendar, by astronomical year (1 BC is year 0). */
const leap = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;

const pad3 = (n: number) => String(n).padStart(3, "0");

/**
 * `date` as `fff.yyy.Mn`: fff is the part of the year gone before the day, floor(days before it / days in the year x
 * 1000); yyy the year within its millennium; n the millennium. Years 1 to 1000 are M1, 1001 to 2000 M2, 2001 to 3000 M3
 * (the year that ends one reads 000). Years before 1 are negative (-0250 is 250 BC, there is no year 0) and count back
 * from year 0: 1 to 1000 BC are M0 (250 BC reads `.250.M0`), 1001 to 2000 BC M-1, and so on. Null when `date` is not a
 * date. A record known only to the year or the period has the filled day of its origin date (record-spec.md), so its
 * first part is that day's, like the full date the title block always shows.
 */
export function imperialDate(date: string): string | null {
  const m = DATE.exec(date);
  if (!m) return null;
  const bc = m[1] === "-";
  const year = Number(m[2]) * (bc ? -1 : 1);
  const month = Number(m[3]);
  const day = Number(m[4]);
  if (year === 0 || month < 1 || month > 12) return null;
  const astro = bc ? year + 1 : year;
  const days = MONTH.map((d, i) => (i === 1 && leap(astro) ? 29 : d));
  if (day < 1 || day > days[month - 1]!) return null;
  const before = days.slice(0, month - 1).reduce((a, b) => a + b, 0) + day - 1;
  const part = Math.floor((before * 1000) / (leap(astro) ? 366 : 365));
  const n = Math.abs(year);
  const millennium = bc ? -Math.floor((n - 1) / 1000) : Math.ceil(n / 1000);
  return `${pad3(part)}.${pad3(n % 1000)}.M${millennium}`;
}
