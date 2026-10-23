// What a mechanism's page and the drawing page load beside its package (meta/<id>.json): the record's name, its teaching
// and kin blocks, and its origin as an Imperial date for the title block's DATE cell.
import type { CatalogRecord } from "../src/catalog/schema";
import { imperialDate } from "../src/catalog/imperial";
import { Kinematics } from "../src/kin";
import type { Controls, Kin } from "../src/kin/types";
import { controlFor } from "../src/render/v3/annotate";
import type { Meta } from "./draw3-page/main";

export function metaOf(id: string, rec: CatalogRecord | undefined): Meta {
  const r = rec as unknown as { name?: string; kin?: Meta["kin"]; teaching?: Meta["teaching"]; origin?: { date?: string } } | undefined;
  const date = r?.origin?.date ? imperialDate(r.origin.date) : null;
  const tables = r?.kin ? tablesOf(r.kin as unknown as Kin, r.teaching ?? null) : [];
  return { name: r?.name ?? id, teaching: r?.teaching ?? null, kin: r?.kin ?? null, ...(date ? { date } : {}), ...(tables.length ? { tables } : {}) };
}

/**
 * The branch tables of the record's own setting and of each ghost trace's (R9): made here, at the site's build, so a
 * record whose closures are tracked numerically does not build them in the browser before its first frame. A setting
 * with no tracked closure is left out.
 */
function tablesOf(kin: Kin, teaching: Meta["teaching"]): NonNullable<Meta["tables"]> {
  const k = new Kinematics(kin);
  const settings: (Controls | undefined)[] = [undefined];
  for (const tr of teaching?.traces ?? []) for (const g of tr.ghosts ?? []) settings.push(controlFor(teaching, g.control, g.value) as Controls);
  const out: NonNullable<Meta["tables"]> = [];
  const seen = new Set<string>();
  for (const c of settings) {
    const key = JSON.stringify(c ?? null);
    if (seen.has(key)) continue;
    seen.add(key);
    try {
      const blocks = k.branchTables(c);
      if (Object.keys(blocks).length) out.push({ ...(c ? { controls: c } : {}), blocks });
    } catch {
      // a setting that does not assemble has no tables; the page finds that out as it always did
    }
  }
  return out;
}
