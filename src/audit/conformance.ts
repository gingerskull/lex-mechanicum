// The conformance report (standard S3, Q7): reads every mechanism's audit header and the standard's changelog and
// says, per mechanism, which standard it was audited at and which HAND changes came since. A mechanism behind a HAND
// change fails until its audit is redone or the change is deferred in the sheet with a reason
// (`defer: K7, V5 · <reason>`, or a standard version to defer all its HAND changes). AUTO and STYLE changes never
// need a re-audit. A mechanism without an audit sheet yet is reported as not audited, not failed.
//
// Two engines live side by side until the cut-over (S6). An audit below 3.0 belongs to a 2.5D mechanism: it stays
// current at its own standard, and the HAND changes of 3.0 and later never count against it (they bind at the rebuild,
// whose pass replaces the audit). An audit at 3.0 or later belongs to a mechanism rebuilt from its record v3: it is
// held to every HAND change after its version, and it must carry the `teaching:` line (S2, T2).
import { allIds } from "../checks/engine";
import {
  TEACHING_VERDICTS,
  changelog,
  compareVersions,
  parseHeader,
  readAudit,
  readStandard,
  section,
  standardVersion,
  tableRows,
} from "./sheet";

export type Status = "current" | "deferred" | "behind" | "not audited" | "no header" | "no teaching";

/** The standard version from which a mechanism is built from its record v3; an audit below it is a 2.5D audit. */
export const V3_FROM = "3.0";

export interface MechanismConformance {
  id: string;
  /** Which engine the audit belongs to: "2.5D" below 3.0, "v3" from 3.0 on. */
  engine: "2.5D" | "v3" | null;
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
      engine: null,
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
    const v3 = compareVersions(h.standard, V3_FROM) >= 0;
    base.engine = v3 ? "v3" : "2.5D";
    // HAND changes in every changelog entry after the audited version, up to the current one; a 2.5D audit is only
    // behind the changes of its own engine (S6)
    const since = log.filter((e) => compareVersions(e.version, h.standard) > 0 && compareVersions(e.version, current) <= 0 && (v3 || compareVersions(e.version, V3_FROM) < 0));
    const hand: { id: string; version: string }[] = [];
    for (const e of since) for (const c of e.changes) if (c.tiers.includes("HAND")) for (const id of c.ids) hand.push({ id, version: e.version });
    const deferredBy = (x: { id: string; version: string }) => h.defers.some((d) => d.items.includes(x.id) || d.items.includes(x.version));
    const uniq = (xs: string[]) => [...new Set(xs)];
    const deferred = uniq(hand.filter(deferredBy).map((x) => x.id));
    const behind = uniq(hand.filter((x) => !deferredBy(x)).map((x) => x.id));
    // S2: a 3.0 sheet records the teaching review's verdict
    const noTeaching = v3 && !(TEACHING_VERDICTS as readonly string[]).includes(h.teaching);
    out.push({
      ...base,
      status: noTeaching ? "no teaching" : behind.length ? "behind" : deferred.length ? "deferred" : "current",
      audited: h.standard,
      result: h.result,
      date: h.date,
      hand: uniq(hand.map((x) => x.id)),
      deferred,
      behind,
    });
  }
  return { standard: current, mechanisms: out, failing: out.filter((m) => m.status === "behind" || m.status === "no header" || m.status === "no teaching").map((m) => m.id) };
}

/** The report for every registered mechanism, from the files in the repository. */
export function conformance(): Report {
  return evaluate(readStandard(), Object.fromEntries(allIds().map((id) => [id, readAudit(id)])));
}

/** The report as table lines. */
export function formatReport(r: Report, checks: Record<string, string> = {}): string[] {
  const head = ["mechanism", "engine", "audited", "result", "rows (pass/fail/na/?)", "HAND since", "status", ...(Object.keys(checks).length ? ["checks (K1, A15, A12)"] : [])];
  const body = r.mechanisms.map((m) => [
    m.id,
    m.engine ?? "-",
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
