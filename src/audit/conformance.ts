// The conformance report (standard S3, Q7): reads every mechanism's audit header and the standard's changelog and
// says, per mechanism, which standard it was audited at and which HAND changes came since. A mechanism behind a HAND
// change fails until its audit is redone or the change is deferred in the sheet with a reason
// (`defer: K7, V5 · <reason>`, or a standard version to defer all its HAND changes). AUTO and STYLE changes never
// need a re-audit. A mechanism without an audit sheet yet is reported as not audited, not failed.
import { mechanisms } from "../mechanisms";
import {
  changelog,
  compareVersions,
  parseHeader,
  readAudit,
  readStandard,
  section,
  standardVersion,
  tableRows,
} from "./sheet";

export type Status = "current" | "deferred" | "behind" | "not audited" | "no header";

export interface MechanismConformance {
  id: string;
  status: Status;
  /** Standard version of the audit, null without one. */
  audited: string | null;
  result: string | null;
  date: string | null;
  /** Requirement rows by status: PASS, FAIL, N/A, ? (unjudged). */
  rows: Record<"PASS" | "FAIL" | "N/A" | "?", number>;
  /** HAND changes since the audited version, by id (or section letter). */
  hand: string[];
  deferred: string[];
  /** HAND changes neither re-audited nor deferred. */
  behind: string[];
}

export interface Report {
  standard: string;
  mechanisms: MechanismConformance[];
  /** Ids that fail: behind a HAND change, or a sheet without a header. */
  failing: string[];
}

/** The report from the standard's text and each mechanism's audit sheet (null where none exists yet). */
export function evaluate(standard: string, audits: Record<string, string | null>): Report {
  const current = standardVersion(standard);
  const log = changelog(standard);
  const out: MechanismConformance[] = [];
  for (const [id, text] of Object.entries(audits)) {
    const base: MechanismConformance = {
      id,
      status: "not audited",
      audited: null,
      result: null,
      date: null,
      rows: { PASS: 0, FAIL: 0, "N/A": 0, "?": 0 },
      hand: [],
      deferred: [],
      behind: [],
    };
    if (text === null) {
      out.push(base);
      continue;
    }
    const h = parseHeader(text);
    if (!h || !h.standard) {
      out.push({ ...base, status: "no header" });
      continue;
    }
    for (const r of tableRows(section(text, "Requirements") ?? "")) {
      const s = r[1] as keyof MechanismConformance["rows"];
      if (s in base.rows) base.rows[s]++;
    }
    // HAND changes in every changelog entry after the audited version, up to the current one
    const since = log.filter((e) => compareVersions(e.version, h.standard) > 0 && compareVersions(e.version, current) <= 0);
    const hand: { id: string; version: string }[] = [];
    for (const e of since) for (const c of e.changes) if (c.tiers.includes("HAND")) for (const id of c.ids) hand.push({ id, version: e.version });
    const deferredBy = (x: { id: string; version: string }) => h.defers.some((d) => d.items.includes(x.id) || d.items.includes(x.version));
    const uniq = (xs: string[]) => [...new Set(xs)];
    const deferred = uniq(hand.filter(deferredBy).map((x) => x.id));
    const behind = uniq(hand.filter((x) => !deferredBy(x)).map((x) => x.id));
    out.push({
      ...base,
      status: behind.length ? "behind" : deferred.length ? "deferred" : "current",
      audited: h.standard,
      result: h.result,
      date: h.date,
      hand: uniq(hand.map((x) => x.id)),
      deferred,
      behind,
    });
  }
  return { standard: current, mechanisms: out, failing: out.filter((m) => m.status === "behind" || m.status === "no header").map((m) => m.id) };
}

/** The report for every registered mechanism, from the files in the repository. */
export function conformance(): Report {
  return evaluate(readStandard(), Object.fromEntries(Object.keys(mechanisms).map((id) => [id, readAudit(id)])));
}

/** The report as table lines. */
export function formatReport(r: Report, checks: Record<string, string> = {}): string[] {
  const head = ["mechanism", "audited", "result", "rows (pass/fail/na/?)", "HAND since", "status", ...(Object.keys(checks).length ? ["checks (K, A15, A12)"] : [])];
  const body = r.mechanisms.map((m) => [
    m.id,
    m.audited ?? "-",
    m.result ?? "-",
    m.audited ? `${m.rows.PASS}/${m.rows.FAIL}/${m.rows["N/A"]}/${m.rows["?"]}` : "-",
    m.hand.length ? m.hand.join(" ") + (m.deferred.length ? ` (deferred ${m.deferred.join(" ")})` : "") : "none",
    m.status === "behind" ? `BEHIND on ${m.behind.join(" ")}` : m.status,
    ...(Object.keys(checks).length ? [checks[m.id] ?? "-"] : []),
  ]);
  const w = head.map((h, i) => Math.max(h.length, ...body.map((b) => b[i]!.length)));
  const line = (cs: string[]) => cs.map((c, i) => c.padEnd(w[i]!)).join("  ").trimEnd();
  return [`standard ${r.standard}`, line(head), ...body.map(line)];
}
