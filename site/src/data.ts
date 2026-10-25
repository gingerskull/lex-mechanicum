// What the pages read at build time: the registered mechanisms in catalogue order, with their sheet numbers, the
// catalogue records, the drive and the facets. Nothing here ships to the browser.
import { isConstruction } from "../../src/builder/construction";
import pkg from "../../package.json";
import { loadCatalog, recordById, type CatalogRecord } from "../../src/catalog";
import type { Kin, Teaching } from "../../src/catalog/kin";
import { workIds } from "../../src/mechanisms";
import { originKey, type Sortable } from "./sort";

/** The app's name: the library's heading, the footer and the site name in every page's head. */
export const APP = "Lex Mechanicum";
export const VERSION = pkg.version;

export interface Sheet {
  id: string;
  no: string;
  /** The sheet number as a number: 1 for ST-01. */
  n: number;
  rec: CatalogRecord;
}

/** Registered mechanisms in catalogue order (family, level, name), numbered ST-01, ST-02 ... (only LM_IDS in a local
 * working loop, src/mechanisms) */
const KNOWN = new Set(workIds());
export const SHEETS: Sheet[] = loadCatalog()
  .mechanisms.filter((r) => KNOWN.has(r.id))
  .map((rec, i) => ({ id: rec.id, no: `ST-${String(i + 1).padStart(2, "0")}`, n: i + 1, rec }));

export const sheetOf = (id: string) => SHEETS.find((s) => s.id === id)!;

/** The day a record's sheet went live (its `added` date, YYYY-MM-DD), when the record has one. */
function addedOf(r: CatalogRecord): string | undefined {
  const v = (r as { added?: unknown }).added;
  return typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : undefined;
}

/** A record's date of origin (`origin.date`, YYYY-MM-DD with a negative year before the year 1) as a sort key. */
function originOf(r: CatalogRecord): number | undefined {
  const v = (r as { origin?: { date?: unknown } }).origin?.date;
  return typeof v === "string" ? originKey(v) : undefined;
}

/** What the library's orders read from a sheet (site/src/sort.ts). */
export const sortableOf = (s: Sheet): Sortable => ({ no: s.n, name: s.rec.name, added: addedOf(s.rec), origin: originOf(s.rec) });

/** The drive line of the at-a-glance facts (P3, V5), from the record's first driver. */
export function driveOf(id: string): string {
  const kin = (recordById(id) as { kin?: Kin } | undefined)?.kin;
  // a driver on a construction body's joint (a trammel's crank, which the hand stands in for) is worked by hand
  const drv = kin?.drivers[0];
  const onConstruction = !!drv && kin!.joints.some((j) => j.id === drv.joint && [j.a, j.b].some((b) => kin!.bodies.find((q) => q.id === b && isConstruction(q))));
  const d = onConstruction ? "manual" : drv?.kind;
  const k = d === "oscillating" || d === "linear" || d === "manual" ? d : "rotary";
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

/** One control of a v3 stage, from the record's `teaching.controls` (T14): a slider or a choice, and where its value goes. */
export interface StageControl {
  id: string;
  label: string;
  title?: string;
  /** Which part of the kinematics' controls the value is for. */
  target: "params" | "design" | "select" | "drivers";
  key: string;
  type: "range" | "choice";
  min?: number;
  max?: number;
  step?: number;
  value: number | string;
  unit?: string;
  options?: { value: string; label: string }[];
}

/** A step that gives about a hundred stops over a range, a round number. */
function stepOf(lo: number, hi: number): number {
  const raw = (hi - lo) / 100;
  const p = 10 ** Math.floor(Math.log10(raw || 1));
  return [1, 2, 5, 10].map((k) => k * p).find((k) => k >= raw) ?? raw;
}

/** The sliders and choices of a record: its parameters, design choices, selectors and manual drivers. The cycle driver is the scrubber. */
export function controlsOf(rec: CatalogRecord): StageControl[] {
  const r = rec as unknown as { kin?: Kin; teaching?: Teaching };
  const kin = r.kin;
  const out: StageControl[] = [];
  if (!kin || !r.teaching) return out;
  for (const c of r.teaching.controls) {
    const label = String(c.id).replace(/[-_]/g, " ");
    if (c.kind === "param") {
      const p = kin.params.find((x) => x.id === c.param);
      if (p) out.push({ id: c.id, label, title: p.note, target: "params", key: p.id, type: "range", min: p.min, max: p.max, step: stepOf(p.min, p.max), value: p.value, unit: p.unit });
    } else if (c.kind === "design") {
      const d = kin.design.find((x) => x.id === c.design);
      if (d) out.push({ id: c.id, label, target: "design", key: d.id, type: "choice", value: String(d.value), options: d.options.map((o) => ({ value: String(o), label: String(o) })) });
    } else if (c.kind === "selector") {
      const d = kin.drivers.find((x) => x.id === c.selector);
      const ids = (d?.options ?? []).map((o) => (typeof o === "string" ? o : String((o as { id?: unknown }).id ?? ""))).filter(Boolean);
      if (d && ids.length) out.push({ id: c.id, label, target: "select", key: d.id, type: "choice", value: String(d.default ?? ids[0]), options: ids.map((o) => ({ value: o, label: o })) });
    } else if (c.kind === "driver") {
      const d = kin.drivers.find((x) => x.id === c.driver);
      // the first rotary, oscillating or linear driver, or a hand stroke (a manual driver with lo and hi), is the cycle (the
      // scrubber); another driver, held by hand, is a slider
      const cycle = kin.drivers.find((x) => x.kind === "rotary" || x.kind === "oscillating" || x.kind === "linear" || (x.kind === "manual" && typeof x.lo === "number" && typeof x.hi === "number"));
      if (d && d !== cycle && d.range) out.push({ id: c.id, label, target: "drivers", key: d.id, type: "range", min: d.range[0], max: d.range[1], step: stepOf(d.range[0], d.range[1]), value: Number(d.default ?? d.range[0]), unit: d.kind === "linear" ? "mm" : "°" });
    }
  }
  return out;
}

/** The section and detail views a record declares (buttons on the stage). */
export function viewButtons(rec: CatalogRecord): { id: string; kind: "section" | "detail" }[] {
  const t = (rec as unknown as { teaching?: Teaching }).teaching;
  return (t?.views ?? []).filter((v) => v.kind === "section" || v.kind === "detail").map((v) => ({ id: v.id, kind: v.kind as "section" | "detail" }));
}
