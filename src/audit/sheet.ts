// Reading and writing the pieces of an audit sheet (standard 11) and of the standard itself: the header, deferral
// lines, sections and their markdown tables, the requirement ids and the changelog. Shared by the audit generator,
// the conformance report and the packager.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export const ROOT = join(import.meta.dirname, "..", "..");
export const STANDARD_PATH = join(ROOT, "docs", "mechanism-standard.md");
export const auditPath = (id: string): string => join(ROOT, "src", "mechanisms", id, "audit.md");

export const readStandard = (): string => readFileSync(STANDARD_PATH, "utf8");
export const readAudit = (id: string): string | null => (existsSync(auditPath(id)) ? readFileSync(auditPath(id), "utf8") : null);

export interface Deferral {
  /** Requirement ids or standard versions deferred. */
  items: string[];
  reason: string;
}

export interface AuditHeader {
  name: string;
  id: string;
  standard: string;
  date: string;
  result: string;
  detail: string;
  pass: string;
  defers: Deferral[];
}

/** The header line: `standard: 2.0 · date: 2026-10-17 · result: open · detail: full · pass: build`. */
export const headerLine = (h: Pick<AuditHeader, "standard" | "date" | "result" | "detail" | "pass">): string =>
  `standard: ${h.standard} · date: ${h.date} · result: ${h.result} · detail: ${h.detail} · pass: ${h.pass}`;

/** A deferral line: `defer: K7, V5 · <reason>`. */
export const deferLine = (d: Deferral): string => `defer: ${d.items.join(", ")} · ${d.reason}`;

export function parseHeader(text: string): AuditHeader | null {
  const lines = text.split(/\r?\n/);
  const title = lines.find((l) => l.startsWith("# Audit:"));
  const fields = lines.find((l) => /^standard:\s*\S/.test(l));
  if (!title || !fields) return null;
  const t = /^# Audit:\s*(.*?)\s*\(([^)]+)\)\s*$/.exec(title);
  const kv: Record<string, string> = {};
  for (const part of fields.split("·")) {
    const m = /^\s*([a-z]+):\s*(.*?)\s*$/.exec(part);
    if (m) kv[m[1]!] = m[2]!;
  }
  const defers: Deferral[] = [];
  for (const l of lines) {
    const m = /^defer:\s*(.*?)\s*·\s*(.*?)\s*$/.exec(l);
    if (m && m[2]) defers.push({ items: m[1]!.split(/[,\s]+/).filter(Boolean), reason: m[2] });
  }
  return {
    name: t?.[1] ?? "",
    id: t?.[2] ?? "",
    standard: kv.standard ?? "",
    date: kv.date ?? "",
    result: kv.result ?? "",
    detail: kv.detail ?? "",
    pass: kv.pass ?? "",
    defers,
  };
}

/** The body of a `## title` section, up to the next `## ` heading, or null. */
export function section(text: string, title: string): string | null {
  const lines = text.split(/\r?\n/);
  const i = lines.findIndex((l) => l.trim() === `## ${title}`);
  if (i < 0) return null;
  let k = i + 1;
  while (k < lines.length && !lines[k]!.startsWith("## ")) k++;
  return lines.slice(i + 1, k).join("\n").trim();
}

/** Splits a markdown table row into trimmed cells; `\|` inside a cell is kept as a literal bar. */
export function cells(row: string): string[] {
  const s = row.trim().replace(/^\|/, "").replace(/\|$/, "");
  const out: string[] = [];
  let cur = "";
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "\\" && s[i + 1] === "|") {
      cur += "\\|";
      i++;
    } else if (s[i] === "|") {
      out.push(cur.trim());
      cur = "";
    } else cur += s[i];
  }
  out.push(cur.trim());
  return out;
}

/** Data rows of every markdown table in `text` (header and divider rows skipped). */
export function tableRows(text: string): string[][] {
  const rows: string[][] = [];
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i]!.trim();
    if (!l.startsWith("|")) continue;
    if (/^\|[\s|:-]+\|$/.test(l)) continue;
    const next = lines[i + 1]?.trim() ?? "";
    if (/^\|[\s|:-]+\|$/.test(next)) continue; // a header row
    rows.push(cells(l));
  }
  return rows;
}

export const escapeCell = (s: string): string => s.replace(/\|/g, "\\|").replace(/\r?\n/g, " ");

// ---------------------------------------------------------------------------------------------------------------
// The standard

export type Tier = "AUTO" | "HAND" | "STYLE" | "DATA" | "SITE" | "FLAG";
const TIERS: Tier[] = ["AUTO", "HAND", "STYLE", "DATA", "SITE", "FLAG"];

export interface Requirement {
  id: string;
  /** Section number and title it sits in, e.g. "5.2". */
  section: string;
  /** The requirement's short title: its bold lead, else its first words. */
  title: string;
  /** Tiers named in its tier cell; empty where the section sets the tier (J by 5b, Q). */
  tiers: Tier[];
}

const ID = /^(?:[A-Z]|DL)\d+$/;

/** Removes fenced code blocks (the audit template holds example rows). */
const unfenced = (text: string): string => text.replace(/^```[\s\S]*?^```/gm, "");

/** Every requirement row of the standard, in document order. */
export function requirements(standard: string): Requirement[] {
  const out: Requirement[] = [];
  const seen = new Set<string>();
  let sec = "";
  for (const line of unfenced(standard).split(/\r?\n/)) {
    const h = /^#{2,3}\s+(\S+?)\.?\s/.exec(line);
    if (h) sec = h[1]!;
    if (!line.trim().startsWith("|")) continue;
    const c = cells(line);
    if (!ID.test(c[0] ?? "") || seen.has(c[0]!)) continue;
    seen.add(c[0]!);
    const text = c[1] ?? "";
    const bold = /\*\*(.+?)\*\*/.exec(text);
    const title = (bold ? bold[1]! : text.split(/[.:;]/)[0]!).replace(/`/g, "").trim();
    const tierCell = c.slice(2).find((x) => TIERS.some((t) => x.startsWith(t))) ?? "";
    // the joint-type catalogue (5b) has no tier column: the rules generate every row
    const tiers = sec === "5b" ? ["AUTO" as const] : TIERS.filter((t) => tierCell.includes(t));
    out.push({ id: c[0]!, section: sec, title: title.length > 70 ? title.slice(0, 67) + "..." : title, tiers });
  }
  return out;
}

/** The `version:` of the standard's header block. */
export function standardVersion(standard: string): string {
  const m = /^version:\s*(\S+)/m.exec(standard);
  if (!m) throw new Error("standard: no version header");
  return m[1]!;
}

export interface ChangelogEntry {
  version: string;
  date: string;
  /** Requirement ids (or section letters) of each bracketed change, with the tiers it names. */
  changes: { ids: string[]; tiers: Tier[] }[];
}

/** The changelog at the end of the standard: one entry per `- **<version> (<date>).**` item. */
export function changelog(standard: string): ChangelogEntry[] {
  const i = standard.indexOf("\n## Changelog");
  if (i < 0) return [];
  const items = standard.slice(i).split(/\n- (?=\*\*)/).slice(1);
  return items.map((item) => {
    const head = /^\*\*(\S+)\s*\(([^)]*)\)/.exec(item);
    const changes = [...item.matchAll(/\[([^\]]+)\]/g)].map((m) => {
      const parts = m[1]!.split(",").map((s) => s.trim());
      const tiers = TIERS.filter((t) => m[1]!.includes(t));
      const ids = parts.flatMap((p) => {
        const r = /^([A-Z]+)(\d+) to \1?(\d+)$/.exec(p.replace(/\s+/g, " "));
        if (r) return Array.from({ length: Number(r[3]) - Number(r[2]) + 1 }, (_, k) => `${r[1]}${Number(r[2]) + k}`);
        const w = /^([A-Z]+\d*)\b/.exec(p);
        return w && !TIERS.includes(w[1] as Tier) ? [w[1]!] : [];
      });
      return { ids, tiers };
    });
    return { version: head?.[1] ?? "", date: head?.[2] ?? "", changes };
  });
}

/** Compares dotted versions numerically. */
export function compareVersions(a: string, b: string): number {
  const x = a.split(".").map(Number);
  const y = b.split(".").map(Number);
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    const d = (x[i] ?? 0) - (y[i] ?? 0);
    if (d) return d;
  }
  return 0;
}
