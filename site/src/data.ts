// What the pages read at build time: the registered mechanisms in catalogue order, with their sheet numbers, the
// catalogue records, the drive and the facets. Nothing here ships to the browser.
import pkg from "../../package.json";
import { loadCatalog, recordById, type CatalogRecord } from "../../src/catalog";
import { mechanisms } from "../../src/mechanisms";

export const VERSION = pkg.version;

export interface Sheet {
  id: string;
  no: string;
  rec: CatalogRecord;
}

/** Registered mechanisms in catalogue order (family, level, name), numbered MX-01, MX-02 ... */
export const SHEETS: Sheet[] = loadCatalog()
  .mechanisms.filter((r) => r.id in mechanisms)
  .map((rec, i) => ({ id: rec.id, no: `MX-${String(i + 1).padStart(2, "0")}`, rec }));

export const sheetOf = (id: string) => SHEETS.find((s) => s.id === id)!;

/** The drive line of the at-a-glance facts (P3, V5), from the model's input kind. */
export async function driveOf(id: string): Promise<string> {
  const { model } = await mechanisms[id]!();
  const k = model.input.kind;
  if (k === "manual") return "Hand operated";
  return `Motorised: brushless pancake motor, ${k === "rotary" ? "GT2 belt 32:16 to the input" : k === "oscillating" ? "crank and link swinging the input" : "belt carriage on the input slide"}`;
}

/** Facets shown in the filter panel, with the value of each sheet. */
export const FACETS: { key: string; label: string; of: (r: CatalogRecord) => string[] }[] = [
  { key: "family", label: "Family", of: (r) => [r.family] },
  { key: "input", label: "Input", of: (r) => [r.motion.input] },
  { key: "output", label: "Output", of: (r) => [r.motion.output] },
  { key: "level", label: "Level", of: (r) => [r.level] },
  { key: "function", label: "Function", of: (r) => r.tags.function },
  { key: "ratio", label: "Ratio", of: (r) => [r.ratio.class] },
];

export const recordOf = (id: string) => recordById(id)!;
