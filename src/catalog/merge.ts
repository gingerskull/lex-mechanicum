import { WAIVABLE, type CatalogRecord, type Origin, type Waivable } from "./schema";

export interface SourceFile {
  name: string;
  json: unknown;
}

const BATCH = /^[bn]\d+\.json$/;
const PATCH = /^(gap|rw|v3|origin|added).*\.json$/;
const V3_PATCH = /^v3.*\.json$/;
const PATCH_KEYS = ["media", "references", "real_world"] as const;

const byName = (a: SourceFile, b: SourceFile) => a.name.localeCompare(b.name, "en", { numeric: true });
const isObject = (x: unknown): x is Record<string, unknown> => typeof x === "object" && x !== null && !Array.isArray(x);

/**
 * Merges the catalogue sources into one record list. Batch files (`b*.json` and the later waves' `n*.json`, arrays of
 * records) are concatenated in name order; patch files (`gap*.json`, `rw*.json`, `origin*.json`, `added*.json`, objects keyed by id) add `media`,
 * `references` and `real_world` entries whose URL the record does not have yet, may `waive` minimum counts research could
 * not meet, and set the `origin` date and the `added` date. `related` keeps known ids only and `motion.label` is derived.
 * Problems are reported, never thrown. Shapes inside records are checked by `validate`.
 */
/** Replaces an existing value at a dotted path (`explain.motion`, `motion.axes`); false when the path is missing. */
function setPath(root: object, path: string, value: unknown): boolean {
  const keys = path.split(".");
  let cur: unknown = root;
  for (const k of keys.slice(0, -1)) {
    if (!isObject(cur) || !(k in cur)) return false;
    cur = cur[k];
  }
  const last = keys[keys.length - 1]!;
  if (!isObject(cur) || !(last in cur)) return false;
  cur[last] = value;
  return true;
}

export function mergeSources(files: SourceFile[]): { records: CatalogRecord[]; problems: string[] } {
  const problems: string[] = [];
  const records: CatalogRecord[] = [];
  const sorted = [...files].sort(byName);

  for (const f of sorted) {
    if (PATCH.test(f.name)) continue;
    if (!BATCH.test(f.name)) problems.push(`${f.name}: not a batch or patch file`);
    else if (!Array.isArray(f.json)) problems.push(`${f.name}: batch file is not an array`);
    else records.push(...(structuredClone(f.json) as CatalogRecord[]));
  }

  const index = new Map(records.map((r) => [r.id, r]));
  for (const f of sorted.filter((f) => PATCH.test(f.name))) {
    if (!isObject(f.json)) {
      problems.push(`${f.name}: patch file is not an object keyed by id`);
      continue;
    }
    for (const [id, patch] of Object.entries(f.json)) {
      const r = index.get(id);
      if (!r) {
        problems.push(`${f.name}: unknown id ${id}`);
        continue;
      }
      if (!isObject(patch)) {
        problems.push(`${f.name}: patch for ${id} is not an object`);
        continue;
      }
      if (V3_PATCH.test(f.name)) {
        for (const key of ["kin", "teaching"] as const) if (patch[key] !== undefined) (r as unknown as Record<string, unknown>)[key] = patch[key];
        const edits = patch.edit;
        if (edits !== undefined && !isObject(edits)) problems.push(`${f.name}: ${id}.edit is not an object of dotted paths`);
        else for (const [path, value] of Object.entries(edits ?? {})) if (!setPath(r, path, value)) problems.push(`${f.name}: ${id}.edit path ${path} does not exist`);
        continue;
      }
      for (const key of PATCH_KEYS) {
        const add = patch[key];
        if (add === undefined) continue;
        if (!Array.isArray(add)) {
          problems.push(`${f.name}: ${id}.${key} is not an array`);
          continue;
        }
        const list = (r[key] ??= []) as { url: string }[];
        for (const x of add as { url: string }[]) if (!list.some((y) => y.url === x.url)) list.push(x);
      }
      if (patch.origin !== undefined) r.origin = patch.origin as Origin;
      if (patch.added !== undefined) r.added = patch.added as string;
      if (patch.waive !== undefined) {
        const waive = Array.isArray(patch.waive) ? (patch.waive as unknown[]) : [patch.waive];
        for (const w of waive) {
          if (!WAIVABLE.includes(w as Waivable)) problems.push(`${f.name}: ${id} waives unknown "${String(w)}"`);
          else if (!r.waive?.includes(w as Waivable)) (r.waive ??= []).push(w as Waivable);
        }
      }
    }
  }

  const ids = new Set(records.map((r) => r.id));
  for (const r of records) {
    if (isObject(r.motion)) r.motion.label = `${r.motion.input} → ${r.motion.output}`;
    r.related = (r.related ?? []).filter((x) => x !== r.id && ids.has(x));
  }
  return { records, problems };
}
