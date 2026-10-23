// The Recovered badge (LM-17): a sheet wears it for its first days after its `added` date. The site is static, so the
// browser decides when the page is viewed (islands/recovered.ts), and the badge goes without a new release.

/** Days a sheet wears the badge: day 0 (the day it went live) to day 6. */
export const RECOVERED_DAYS = 7;

const DAY = 86_400_000;

/** Whole days from `added` (YYYY-MM-DD) to `now`, counted in UTC; NaN for anything that is not a date. */
export function daysSince(added: string, now: Date): number {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(added);
  if (!m) return NaN;
  const then = Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return Math.round((today - then) / DAY);
}

/** Whether a sheet added on `added` wears the badge at `now`. */
export const isRecovered = (added: string | undefined, now: Date): boolean => {
  const d = added ? daysSince(added, now) : NaN;
  return d >= 0 && d < RECOVERED_DAYS;
};
