// The registry (Node only): a mechanism is a catalogue record v3 built by the hardware builder (src/builder), registered
// by its audit sheet at standard 3.0 or later (src/mechanisms/<id>/audit.md). Its polish, where the builder needs a true
// exception, is listed in v3.ts. The browser never loads this module: the site ships packages and the records' blocks.
import { loadCatalog, recordById } from "../catalog";
import type { CatalogRecord } from "../catalog/schema";
import { compareVersions, parseHeader, readAudit } from "../audit/sheet";
import type { Polish } from "../builder";
import { polishes3 } from "./v3";

/** The standard version from which a mechanism is built from its record v3. */
export const V3_STANDARD = "3.0";

/** The audited standard of a mechanism, null without an audit sheet. */
export function auditedStandard(id: string): string | null {
  const text = readAudit(id);
  return (text && parseHeader(text)?.standard) || null;
}

/** True when a record is a registered mechanism: its audit sheet is at standard 3.0 or later. */
export function isBuilt(id: string): boolean {
  const v = auditedStandard(id);
  return !!v && compareVersions(v, V3_STANDARD) >= 0;
}

/** Every registered mechanism, in catalogue order. */
export const allIds = (): string[] => loadCatalog().mechanisms.filter((r) => isBuilt(r.id)).map((r) => r.id);

/**
 * The mechanisms a local working loop builds, draws and tests: `LM_IDS=a,b,c` narrows allIds() for the dev server, the
 * site assets and the visual snapshots while a change is iterated on a few mechanisms; unset, every one. The checks,
 * the thumbnails' manifest and the pre-push hook always read allIds().
 */
export function workIds(): string[] {
  const ids = allIds();
  const only = process.env.LM_IDS?.split(",").map((s) => s.trim()).filter(Boolean);
  if (!only?.length) return ids;
  const unknown = only.filter((id) => !ids.includes(id));
  if (unknown.length) throw new Error(`LM_IDS: not a registered mechanism: ${unknown.join(", ")}`);
  return ids.filter((id) => only.includes(id));
}

/** The record and polish of a mechanism. */
export async function loadV3(id: string): Promise<{ record: CatalogRecord; polish?: Polish }> {
  const record = recordById(id);
  if (!record) throw new Error(`no catalogue record "${id}"`);
  const load = polishes3[id];
  const polish = load ? (await load()).polish : undefined;
  return { record, ...(polish ? { polish } : {}) };
}

/** True when an id is a catalogue record (registered or not). */
export const isKnown = (id: string): boolean => !!recordById(id);
