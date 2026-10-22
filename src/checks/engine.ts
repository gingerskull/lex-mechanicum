// Which engine builds and checks a mechanism while both live on the branch (standard S6). A mechanism whose audit sheet
// is at standard 3.0 or later was rebuilt from its record v3 and is checked by the 3D tools; every other registered
// mechanism is a 2.5D mechanism: its audit stays current at its own standard, and the 3D checks only read it lifted.
import { loadCatalog, recordById } from "../catalog";
import type { CatalogRecord } from "../catalog/schema";
import { mechanisms } from "../mechanisms";
import { polishes3 } from "../mechanisms/v3";
import { compareVersions, parseHeader, readAudit } from "../audit/sheet";
import type { Polish } from "../builder";

export type Engine = "2.5D" | "v3";

/** The standard version at which a mechanism is built from its record v3. */
export const V3_STANDARD = "3.0";

/** The audited standard of a mechanism, null without an audit sheet. */
export function auditedStandard(id: string): string | null {
  const text = readAudit(id);
  return (text && parseHeader(text)?.standard) || null;
}

/** Ids drawn and checked on v3 before their audit says so (a pass in progress): `MDB_V3=a,b` in the environment. */
const trial = (): string[] => (typeof process !== "undefined" ? (process.env.MDB_V3 ?? "").split(",").filter(Boolean) : []);

export function engineOf(id: string): Engine {
  if (trial().includes(id)) return "v3";
  const v = auditedStandard(id);
  return v && compareVersions(v, V3_STANDARD) >= 0 ? "v3" : "2.5D";
}

/** Every mechanism the tools know: the 2.5D registry, plus the records audited at 3.0 or later. */
export function allIds(): string[] {
  const ids = new Set(Object.keys(mechanisms));
  for (const r of loadCatalog().mechanisms) if (!ids.has(r.id) && engineOf(r.id) === "v3") ids.add(r.id);
  return [...ids];
}

/** The record and polish of a v3 mechanism. */
export async function loadV3(id: string): Promise<{ record: CatalogRecord; polish?: Polish }> {
  const record = recordById(id);
  if (!record) throw new Error(`no catalogue record "${id}"`);
  const load = polishes3[id];
  const polish = load ? (await load()).polish : undefined;
  return { record, ...(polish ? { polish } : {}) };
}

/** True when an id is a known mechanism of either engine. */
export const isKnown = (id: string): boolean => !!mechanisms[id] || !!recordById(id);
