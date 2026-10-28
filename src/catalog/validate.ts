import { addedProblems, originProblems } from "./origin";
import { validateKinTeaching, validateRetired } from "./validate-kin";
import { DUTIES, VOCABULARIES, type CatalogRecord, type Vocabularies, type Waivable } from "./schema";

const URL_OK = /^https?:\/\//;
const YOUTUBE = /^https:\/\/(www\.youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)[\w-]{11}/;

/** Checks merged records against record-spec.md. Each problem is one line, `<id>: <what>`; none means valid. */
export function validate(records: CatalogRecord[], opts: { asVersion?: 2 | 3 } = {}): string[] {
  const problems: string[] = [];

  for (const r of records) {
    const say = (what: string) => problems.push(`${r.id}: ${what}`);
    const v3 = (opts.asVersion ?? r.record_version) === 3;
    const vocab = (field: string, list: keyof Vocabularies, value: unknown, many = false) => {
      const allowed: readonly string[] = VOCABULARIES[list];
      if (value === undefined) return say(`${field} missing`);
      const values = many && Array.isArray(value) ? value : [value];
      for (const v of values) if (!allowed.includes(v as string)) say(`${field} "${String(v)}" not in vocabulary`);
    };

    vocab("family", "family", r.family);
    vocab("level", "level", r.level);
    vocab("motion.input", "motion", r.motion?.input);
    vocab("motion.output", "motion", r.motion?.output);
    vocab("motion.output_character", "character", r.motion?.output_character, true);
    vocab("motion.axes", "axes", r.motion?.axes);
    vocab("motion.plane", "plane", r.motion?.plane);
    vocab("ratio.kind", "ratioKind", r.ratio?.kind);
    vocab("ratio.class", "ratioClass", r.ratio?.class);
    vocab("tags.function", "function", r.tags?.function, true);
    vocab("tags.property", "property", r.tags?.property, true);
    vocab("tags.application", "application", r.tags?.application, true);
    for (const x of r.references ?? []) vocab("reference kind", "refKind", x.kind);
    for (const x of r.media ?? []) vocab("media kind", "mediaKind", x.kind);

    // a seasonal record has generated images in place of its links (P14): no minimum counts
    const seasonal = r.season !== undefined;
    const waived = (k: Waivable) => seasonal || (r.waive?.includes(k) ?? false);
    if (!waived("media") && !(r.media ?? []).some((m) => m.kind === "video")) say("no video");
    const refs = (r.references ?? []).length;
    if (!waived("references") && refs < 2) say(`${refs} references, at least 2 needed`);
    for (const x of [...(r.references ?? []), ...(r.media ?? [])]) if (!URL_OK.test(x.url ?? "")) say(`bad url ${String(x.url)}`);
    problems.push(...validateKinTeaching(r, { required: v3 }));
    if (v3 && opts.asVersion === undefined) problems.push(...validateRetired(r));
    problems.push(...originProblems(r));
    problems.push(...addedProblems(r));
    problems.push(...seasonProblems(r));
    for (const x of r.real_world ?? []) if (!YOUTUBE.test(x.url ?? "")) say(`real-world example not a YouTube video: ${String(x.url)}`);
  }

  const seen = new Set<string>();
  for (const r of records) {
    if (seen.has(r.id)) problems.push(`${r.id}: duplicate id`);
    seen.add(r.id);
  }
  return problems;
}

const DAY = /^(\d{4})-(\d{2})-(\d{2})$/;
const WEBP = /^[a-z0-9][a-z0-9-]*\.webp$/;
const SEASON_FIELDS = ["occasion", "date_rule", "duty", "dates"];
const isText = (x: unknown) => typeof x === "string" && x.trim().length > 0;

/** A real day, YYYY-MM-DD with a four-digit year. */
function isDay(x: unknown): x is string {
  const m = typeof x === "string" ? DAY.exec(x) : null;
  if (!m) return false;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const t = new Date(Date.UTC(y, mo - 1, d));
  return y >= 1000 && t.getUTCFullYear() === y && t.getUTCMonth() === mo - 1 && t.getUTCDate() === d;
}

/**
 * Checks a seasonal record (record-spec.md, "Seasonal records"; standard P14): the `season` block's occasion, date rule,
 * duty and dates (real days, each end on or after its start, the occurrences in order), its 2 to 4 images, and no links,
 * which its images replace. `images` belong to a seasonal record only.
 */
export function seasonProblems(r: CatalogRecord): string[] {
  const out: string[] = [];
  const say = (what: string) => out.push(`${r.id}: ${what}`);
  const s = r.season as unknown;
  if (s === undefined) {
    if (r.images !== undefined) say("images on a record without a season block (P14)");
    return out;
  }
  if (typeof s !== "object" || s === null || Array.isArray(s)) return [`${r.id}: season is not an object`];
  const season = s as Record<string, unknown>;
  for (const k of Object.keys(season)) if (!SEASON_FIELDS.includes(k)) say(`season.${k} is not a field of the season block`);
  if (!isText(season.occasion)) say("season.occasion missing");
  if (!isText(season.date_rule)) say("season.date_rule missing");
  if (!(DUTIES as readonly unknown[]).includes(season.duty)) say(`season.duty "${String(season.duty)}" not in vocabulary`);
  const dates = Array.isArray(season.dates) ? (season.dates as { start?: unknown; end?: unknown }[]) : [];
  if (!dates.length) say("season.dates has no occurrence");
  let last: string | undefined;
  dates.forEach((d, i) => {
    if (!isDay(d?.start) || !isDay(d?.end)) return say(`season.dates[${i}] is not a start and an end YYYY-MM-DD`);
    if (d.end < d.start) say(`season.dates[${i}] ends (${d.end}) before it starts (${d.start})`);
    if (last !== undefined && d.start <= last) say(`season.dates[${i}] starts (${d.start}) before the occurrence before it has ended (${last})`);
    last = d.end;
  });
  const images = Array.isArray(r.images) ? r.images : [];
  if (images.length < 2 || images.length > 4) say(`${images.length} images, 2 to 4 needed`);
  images.forEach((m, i) => {
    if (!isText(m?.prompt)) say(`images[${i}].prompt missing`);
    if (!isText(m?.alt)) say(`images[${i}].alt missing`);
    if (m?.file !== undefined && m.file !== "" && !WEBP.test(m.file)) say(`images[${i}].file "${String(m.file)}" is not a .webp file name`);
  });
  for (const k of ["references", "media", "real_world"] as const)
    if ((r[k] ?? []).length) say(`${k} on a seasonal record: its images take their place (P14)`);
  return out;
}

/** Months ahead in which a seasonal record must have an occurrence starting, or its dates have run out. */
export const SEASON_AHEAD_MONTHS = 13;

/**
 * A seasonal record whose dates have run out: none of its occurrences starts between `today` (YYYY-MM-DD) and 13
 * months after it. Null when one does, or for a record that is not seasonal. Date-dependent, so a test runs it on the
 * real catalogue, not the validator.
 */
export function datesRunOut(r: CatalogRecord, today: string): string | null {
  if (!r.season) return null;
  const m = DAY.exec(today);
  if (!m) throw new Error(`datesRunOut: "${today}" is not a day YYYY-MM-DD`);
  const horizon = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1 + SEASON_AHEAD_MONTHS, Number(m[3]))).toISOString().slice(0, 10);
  const next = (r.season.dates ?? []).some((d) => d.start >= today && d.start <= horizon);
  return next ? null : `${r.id}: no occurrence of ${r.season.occasion} starts between ${today} and ${horizon}; add the next years to season.dates`;
}
