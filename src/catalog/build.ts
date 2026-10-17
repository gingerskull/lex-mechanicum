import { mergeSources, type SourceFile } from "./merge";
import { VOCABULARIES, type Catalog, type CatalogRecord } from "./schema";
import { validate } from "./validate";

export const CATALOG_VERSION = 1;

/** Catalogue order: family order of the vocabulary, then level, then name. */
export function sortRecords(records: CatalogRecord[]): CatalogRecord[] {
  const family: readonly string[] = VOCABULARIES.family;
  const level: readonly string[] = VOCABULARIES.level;
  return [...records].sort(
    (a, b) =>
      family.indexOf(a.family) - family.indexOf(b.family) ||
      level.indexOf(a.level) - level.indexOf(b.level) ||
      a.name.localeCompare(b.name, "en"),
  );
}

/** Merges, validates and orders the sources. `generated` is the date written into the catalogue (YYYY-MM-DD). */
export function buildCatalog(files: SourceFile[], generated: string): { catalog: Catalog; problems: string[] } {
  const { records, problems } = mergeSources(files);
  problems.push(...validate(records));
  const catalog = { version: CATALOG_VERSION, generated, vocabularies: VOCABULARIES, mechanisms: sortRecords(records) };
  return { catalog, problems };
}

/** The committed form of `data/catalog/mechanisms.json`. */
export const serializeCatalog = (catalog: Catalog) => JSON.stringify(catalog, null, 2) + "\n";
