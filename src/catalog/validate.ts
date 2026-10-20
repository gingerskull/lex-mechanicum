import { validateKinTeaching, validateRetired } from "./validate-kin";
import { VOCABULARIES, type CatalogRecord, type Vocabularies, type Waivable } from "./schema";

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

    const waived = (k: Waivable) => r.waive?.includes(k) ?? false;
    if (!waived("media") && !(r.media ?? []).some((m) => m.kind === "video")) say("no video");
    const refs = (r.references ?? []).length;
    if (!waived("references") && refs < 2) say(`${refs} references, at least 2 needed`);
    for (const x of [...(r.references ?? []), ...(r.media ?? [])]) if (!URL_OK.test(x.url ?? "")) say(`bad url ${String(x.url)}`);
    problems.push(...validateKinTeaching(r, { required: v3 }));
    if (v3 && opts.asVersion === undefined) problems.push(...validateRetired(r));
    for (const x of r.real_world ?? []) if (!YOUTUBE.test(x.url ?? "")) say(`real-world example not a YouTube video: ${String(x.url)}`);
  }

  const seen = new Set<string>();
  for (const r of records) {
    if (seen.has(r.id)) problems.push(`${r.id}: duplicate id`);
    seen.add(r.id);
  }
  return problems;
}
