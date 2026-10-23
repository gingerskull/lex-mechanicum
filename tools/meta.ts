// What a mechanism's page and the drawing page load beside its package (meta/<id>.json): the record's name, its teaching
// and kin blocks, and its origin as an Imperial date for the title block's DATE cell.
import type { CatalogRecord } from "../src/catalog/schema";
import { imperialDate } from "../src/catalog/imperial";
import type { Meta } from "./draw3-page/main";

export function metaOf(id: string, rec: CatalogRecord | undefined): Meta {
  const r = rec as unknown as { name?: string; kin?: Meta["kin"]; teaching?: Meta["teaching"]; origin?: { date?: string } } | undefined;
  const date = r?.origin?.date ? imperialDate(r.origin.date) : null;
  return { name: r?.name ?? id, teaching: r?.teaching ?? null, kin: r?.kin ?? null, ...(date ? { date } : {}) };
}
