import data from "../../data/catalog/mechanisms.json";
import type { Catalog, CatalogRecord } from "./schema";

export type * from "./schema";
export { VOCABULARIES } from "./schema";

const catalog = data as unknown as Catalog;
const byId = new Map(catalog.mechanisms.map((r) => [r.id, r]));

/** The generated master record, in catalogue order. */
export const loadCatalog = (): Catalog => catalog;

export const recordById = (id: string): CatalogRecord | undefined => byId.get(id);
