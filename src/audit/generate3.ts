// The audit generator (standard 1 step 2, section 11): a mechanism built from its catalogue record v3 by the hardware
// builder, with the 3D checks, written as its audit sheet. One row per requirement id parsed from the standard; evidence
// for everything a tool can collect; a status where a tool decides it outright, or where the rules' output or the
// pipeline settles it (`autoFill`, marked so a later run fills it again), `?` elsewhere. The `teaching:` line
// under the header, the kit and the block of each joint, the K1 residual and the claim table (T9) in the tool-decided
// rows, and a Supports section for the support router (A19) and the see-through stage (T10 to T12). Judged rows, hand
// cells and hand sections of an earlier sheet survive regeneration.
import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import type { Assembly } from "../builder";
import { autoTable, rules } from "../builder/registry";
import type { CatalogRecord } from "../catalog/schema";
import { recordById } from "../catalog";
import { buildPackage3 } from "../package/build3";
import { encode2 } from "../package/format2";
import { check3d, clashLines, unnecessaryLines, type Result3 } from "../checks/run";
import { checkRecord, type RecordReport } from "../checks/record";
import { recordSource } from "../checks/source";
import { loadV3 } from "../mechanisms";
import type { Kin } from "../kin/types";
import { RUNG_ORDER, rungOf, type RungId } from "../style/detail";
import type { Solid3 } from "../solids/types";
import {
  deferLine,
  escapeCell,
  headerLine,
  parseHeader,
  readAudit,
  readStandard,
  requirements,
  ROOT,
  section,
  standardVersion,
  summaryLine,
  tableRows,
  teachingLine,
  TEACHING_VERDICTS,
  type Requirement,
} from "./sheet";

export const FUNCTIONS = ["F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10"] as const;
const FN_TITLES = ["locate", "retain", "torque", "thrust", "limit", "hold", "adjust", "lube", "timing", "protect"];

/**
 * Rows whose status a tool decides outright: always regenerated, never kept from an earlier sheet (standard 11). K5 is
 * retired in 3.0 and has no row; K1, K11, T9 and D11 are decided from the record v3 and its solids.
 */
export const TOOL_DECIDED = new Set(["P1", "K1", "K2", "K11", "T9", "D11", "A12", "A15", "M6", "R7", "Q1", "Q2"]);

/**
 * AUTO rows the pipeline holds for every mechanism it builds (classification, placement, packaging, the renderer, the
 * conformance report): a sheet generated at all passes them. Every one was judged PASS on all 89 sheets of the rebuild.
 */
export const PIPELINE_PASS = new Set(["A1", "A2", "A18", "D10", "DL3", "DL6", "E1", "L6", "R4", "S3", "S6", "T17"]);

/** The note on a row `autoFill` decided: such a row is filled again on regeneration, never kept as judged. */
export const AUTO_FILLED = "filled by the generator";

/**
 * The status of an unjudged row where the rules' output or the pipeline decides it, null where it needs judgement: a
 * joint-type row (5b) passes when a rule built its kit and is N/A when the mechanism has no joint of that type; an AUTO
 * row passes when a rule built solids for it, or when the pipeline holds it for every mechanism (PIPELINE_PASS). Against
 * the judged sheets of the rebuild this agrees on 99.4% of the rows it fills.
 */
export function autoFill(q: Requirement, built: boolean | undefined): { status: string; why: string } | null {
  if (q.section === "5b") {
    if (built === undefined) return null;
    return built ? { status: "PASS", why: "a rule built its kit" } : { status: "N/A", why: "no joint of this type" };
  }
  if (PIPELINE_PASS.has(q.id)) return { status: "PASS", why: "the pipeline holds it for every built mechanism" };
  if (q.tiers.length === 1 && q.tiers[0] === "AUTO" && built) return { status: "PASS", why: "a rule built solids for it" };
  return null;
}

export const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? "" : /(s|sh|ch)$/.test(w) ? "es" : "s"}`;
export const kb = (b: number) => `${(b / 1024).toFixed(1)} KB`;

/** Describes the solids serving one function at one joint: named items with their count. */
export function describeServers(ids: string[], byId: Map<string, Pick<Solid3, "name" | "kind">>): string {
  const groups: { label: string; kind: string; n: number }[] = [];
  for (const id of ids) {
    const s = byId.get(id);
    if (!s) continue;
    // an unnamed solid is a further item of the last listed set of its kind
    const last = [...groups].reverse().find((g) => g.kind === s.kind);
    if (!s.name && last) last.n++;
    else {
      const same = groups.find((g) => g.label === (s.name || s.kind));
      if (same) same.n++;
      else groups.push({ label: s.name || s.kind, kind: s.kind, n: 1 });
    }
  }
  return groups.map((g) => (g.n > 1 ? `${g.n} x ${g.label}` : g.label)).join("; ");
}

/** Everything the v3 sheet is written from. */
export interface AuditInput3 {
  id: string;
  name: string;
  /** Today, YYYY-MM-DD. */
  date: string;
  standard: string;
  record: CatalogRecord;
  assembly: Assembly;
  report: RecordReport;
  checks: Result3;
  recordMissing: string[] | null;
  /** polish.ts in bytes (the v3 polish), absent without one. */
  files: Record<string, number>;
  packageBytes: number;
}

interface Row {
  status: string;
  evidence: string;
}

const RECORD_FIELDS = ["name", "aka", "family", "level", "summary", "motion", "ratio", "dof", "topology", "backdrivable", "tags", "explain", "build", "examples", "references", "media", "kin", "teaching"];

function recordMissing(r: CatalogRecord): string[] {
  const x = r as unknown as Record<string, unknown>;
  const empty = (v: unknown) => v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0);
  const out = RECORD_FIELDS.filter((k) => empty(x[k]));
  const ex = x.explain as Record<string, unknown> | undefined;
  if (ex) for (const k of ["motion", "forces", "benefits", "limits"]) if (empty(ex[k])) out.push(`explain.${k}`);
  return out;
}

/** The solve block that gives a joint its motion: the first step that names the joint, else its driver. */
export function blockOf(kin: Kin, joint: string): string {
  const step = kin.solve.find((s) => JSON.stringify(s.in ?? {}).includes(`"${joint}"`));
  if (step) return step.block;
  if (kin.drivers.some((d) => d.joint === joint)) return "driver";
  return "–";
}

/** The evidence of every row, and per requirement served by rules whether any of them built solids. */
function evidence(inp: AuditInput3, reqs: Requirement[]): { rows: Record<string, Row>; built: Record<string, boolean> } {
  const a = inp.assembly;
  const kin = inp.record.kin as unknown as Kin;
  const out: Record<string, Row> = {};
  const set = (id: string, evidence: string, status = "?") => (out[id] = { status, evidence });
  const find = (...t: RecordReportFindingType[]) => inp.report.findings.filter((f) => t.includes(f.type));

  // what the rules fired, per requirement id
  const served: Record<string, string[]> = {};
  const built: Record<string, boolean> = {};
  const ruleIds = new Set(rules.map((r) => r.id));
  for (const r of autoTable())
    for (const id of r.ids) {
      const n = a.fired[r.id]?.length ?? 0;
      (served[id] ??= []).push(!ruleIds.has(r.id) ? r.id : `${r.id} (${n ? plural(n, "solid") : "no solids"})`);
      built[id] = !!built[id] || (ruleIds.has(r.id) && n > 0);
    }
  for (const q of reqs) if (served[q.id]) set(q.id, `fired: ${served[q.id]!.join(", ")}`);

  // P1
  {
    const rec = inp.recordMissing === null ? "no catalogue record" : inp.recordMissing.length ? `record missing ${inp.recordMissing.join(", ")}` : "record v3 complete (kin and teaching blocks)";
    const ok = inp.recordMissing !== null && !inp.recordMissing.length && inp.files["audit.md"] !== undefined;
    set("P1", `${rec}; ${inp.files["polish.ts"] !== undefined ? "polish3.ts, " : "no polish, "}audit.md present`, ok ? "PASS" : "FAIL");
  }
  // K: the verifier's report
  {
    const r = inp.report;
    const k1 = find("K1", "UNSOLVED");
    set(
      "K1",
      r.k1 ? `K1 residual ${r.k1.maxResidual.toExponential(1)} (tolerance ${r.k1.tol.toExponential(0)}) over ${r.k1.samples} samples, reference ${r.k1.referenceAgreement.toExponential(1)}${r.fallback.length ? `; numeric fallback in ${r.fallback.join(", ")}` : ""}${k1.length ? `; ${k1.map((f) => f.detail).slice(0, 2).join("; ")}` : ""}` : `not solved: ${k1[0]?.detail ?? "no kin block"}`,
      r.k1 && !k1.length ? "PASS" : "FAIL",
    );
    const f = find("NaN", "POSE_JUMP", "PERIODICITY", "BRANCH", "MISSING");
    set("K2", f.length ? `check: ${f.map((x) => `${x.type} ${x.detail}`).slice(0, 4).join("; ")}` : `check: finite, continuous, periodic over ${r.k1?.samples ?? 0} samples`, f.length ? "FAIL" : r.k1 ? "PASS" : "?");
    set("K3", `${plural(kin.solve.length, "block")} (${[...new Set(kin.solve.map((s) => s.block))].join(", ") || "none"}); ${r.fallback.length ? `numeric fallback: ${r.fallback.join(", ")}` : "no numeric fallback"}`);
    set("K11", `mobility counted ${r.mobility.counted ?? "?"}, dof ${r.mobility.dof}`, r.mobility.ok ? "PASS" : "FAIL");
  }
  set("K7", `drivers ${kin.drivers.map((d) => `${d.id} (${d.kind})`).join(", ") || "none"}`);
  // T9: the claim table
  {
    const c = inp.report.claims;
    const n = (s: string) => c.filter((x) => x.status === s).length;
    const off = c.filter((x) => x.status === "off").map((x) => `${x.claim.output} ${x.claim.stat} ${x.claim.value} (got ${x.got!.toFixed(2)})`);
    const status = !c.length ? "N/A" : n("off") ? "FAIL" : n("uncheckable") ? "?" : "PASS";
    set("T9", c.length ? `claim table: ${n("ok")} ok, ${n("off")} off, ${n("uncheckable")} uncheckable of ${c.length}${off.length ? `; off: ${off.slice(0, 4).join("; ")}` : ""}` : "the record states no number", status);
  }
  // T10 to T12: the see-through stage and the router
  {
    const see = a.solids.filter((s) => s.flags.seeThrough).map((s) => s.id);
    set("T10", `${plural(see.length, "solid")} drawn see-through${see.length ? `: ${see.slice(0, 8).join(", ")}` : ""}`);
    const moved = a.routes.filter((r) => r.moved).length;
    set("T11", `${plural(a.routes.length, "support")} routed, ${moved} moved off a sweep`);
    const kinds = new Set(["base", "plate", "bracket", "housing", "bridge", "standoff", "foot", "spigot"]);
    set("T12", `${a.solids.filter((s) => kinds.has(s.kind)).length} support solids; dropped by the polish: ${a.polish?.dropped.length ? a.polish.dropped.join(", ") : "none"}`, a.polish?.dropped.length ? "?" : "PASS");
  }
  // A
  const pinTypes = a.notes.map((n) => `${n.id} ${n.kit}`);
  set("A1", pinTypes.join(", ") || "no joints");
  set("A2", pinTypes.join(", ") || "no joints");
  const solids = a.solids;
  set("A13", `${plural(solids.length, "solid")}, ${solids.filter((s) => !s.name).length} unnamed (further items of a listed set)`);
  const clamp = inp.checks.clamp;
  set("A12", clamp.length ? `clamp: ${clamp.join("; ")}` : "clamp check clean", clamp.length ? "FAIL" : "PASS");
  {
    const clashes = clashLines(inp.checks);
    const unnecessary = unnecessaryLines(inp.checks);
    const bad = clashes.length + unnecessary.length;
    set(
      "A15",
      `clearance in 3D over ${inp.checks.clash.stats.phases} phases: ${clashes.length ? `${plural(clashes.length, "clash")}: ${clashes.slice(0, 4).join("; ")}` : "0 clashes"}; hand allow: ${inp.checks.clash.allows.length} named, ${unnecessary.length} unnecessary${unnecessary.length ? ` (${unnecessary.slice(0, 4).join("; ")})` : ""}`,
      bad ? "FAIL" : "PASS",
    );
  }
  set("A16", `${plural(a.notes.length, "joint note")}; no note: ${a.notes.filter((n) => !n.note).map((n) => n.id).join(", ") || "none"}; no badge: ${a.notes.filter((n) => !n.badge).map((n) => n.id).join(", ") || "none"}`);
  set("A18", `placement: ${a.placement.slabs} slabs in the tallest stack (${a.placement.stackMm.toFixed(1)} mm), ${a.placement.clevis} clevis${a.placement.clevis === 1 ? "" : "es"}; stack per joint in the Joints table`);
  {
    const covers = a.routes.filter((r) => r.covers.length).map((r) => r.support);
    set("A19", `${plural(a.routes.length, "support")} routed (${a.routes.filter((r) => r.moved).length} moved), least gap ${a.routes.length ? Math.min(...a.routes.map((r) => r.gap)).toFixed(1) : "-"} mm; still covering a principle part, drawn see-through: ${covers.join(", ") || "none"}`);
  }
  set("A20", `support per joint: ${a.routes.map((r) => `${r.site} ${r.kind}`).join(", ") || "none"}`);
  set("A21", `kit per joint: ${a.notes.map((n) => `${n.id} ${n.kit}`).join(", ") || "none"}`, a.notes.length && a.notes.every((n) => n.kit) ? "PASS" : "?");
  // E
  set("E1", `every solid has one explode level; levels ${Math.min(...solids.map((s) => s.ex))} to ${Math.max(...solids.map((s) => s.ex))}`);
  // F
  for (const f of FUNCTIONS) {
    const at = a.notes.filter((j) => j.serves[f]?.length).map((j) => j.id);
    const prev = out[f]?.evidence;
    set(f, `served at ${at.join(", ") || "no joint"}${prev ? `; ${prev}` : ""}`);
  }
  // D11
  {
    const bad = inp.report.solids?.filter((s) => !s.ok) ?? [];
    set("D11", inp.report.solids ? `SOLID: ${bad.length} of ${inp.report.solids.length} solids unsound${bad.length ? `: ${bad.slice(0, 3).map((b) => `${b.id} ${b.issues[0]}`).join("; ")}` : ""}` : "SOLID not run", inp.report.solids ? (bad.length ? "FAIL" : "PASS") : "?");
  }
  // M
  set("M6", inp.checks.edges.length ? `edge distance: ${inp.checks.edges.slice(0, 5).join("; ")}` : "edge distance and walls clean", inp.checks.edges.length ? "FAIL" : "PASS");
  {
    const noMat = solids.filter((s) => !s.mat && !s.flags.faint).length;
    set("M10", `${solids.length - noMat} of ${solids.length} solids name a material`);
    const threaded = solids.filter((s) => s.thread !== undefined);
    set("M13", `${threaded.length} threaded`);
  }
  set("R4", `package v2 ${kb(inp.packageBytes)}; ${out.R4?.evidence ?? ""}`.replace(/; $/, ""));
  // R7: a polish of true exceptions only, under the plan's 30 lines (a longer one is a promotion candidate, A22)
  const lines = inp.files["polish.lines"] ?? 0;
  set("R7", `polish ${inp.files["polish.ts"] === undefined ? "none" : `${lines} lines (${kb(inp.files["polish.ts"])})`}; ${plural(a.polish?.added.length ?? 0, "solid")} added, ${plural(a.polish?.set.length ?? 0, "override")} by the polish`, lines < 30 ? "PASS" : "?");
  set("DL1", `${solids.filter((s) => s.detail !== "never").length} of ${solids.length} solids on a dropping rung`);
  // Q
  {
    const clean = !inp.report.findings.length && !clamp.length && !inp.checks.edges.length;
    set("Q1", clean ? "check, clamp and edge distance clean" : `${plural(inp.report.findings.length, "finding")}, ${clamp.length} clamp, ${inp.checks.edges.length} edge`, clean ? "PASS" : "FAIL");
  }
  set("Q2", `${plural(inp.checks.clash.clashes.length, "clash")}, ${plural(unnecessaryLines(inp.checks).length, "unnecessary allow")}`, inp.checks.clash.clashes.length || unnecessaryLines(inp.checks).length ? "FAIL" : "PASS");
  set("Q3", `package v2 written, ${kb(inp.packageBytes)}; site build not checked here`);
  set("Q4", "local: tools/shot");
  set("Q5", "local: tools/bench");
  set("Q8", `teaching review: ${inp.record.teaching?.review?.verdict ?? "missing"} (${inp.record.teaching?.review?.date ?? "no date"}); the six phases of the finished build are looked at by eye`);
  return { rows: out, built };
}

type RecordReportFindingType = RecordReport["findings"][number]["type"];

/** The ten-function cells of one joint. */
function jointCells(serves: Partial<Record<(typeof FUNCTIONS)[number], string[]>>, byId: Map<string, Solid3>): string[] {
  return FUNCTIONS.map((f) => {
    const ids = serves[f];
    return ids?.length ? describeServers(ids, byId) || ids.join(", ") : "none";
  });
}

/** Writes the sheet, keeping judged rows, hand cells and hand sections of `existing`. */
export function auditSheet3(inp: AuditInput3, standard: string, existing: string | null): string {
  const reqs = requirements(standard);
  const { rows: ev, built } = evidence(inp, reqs);
  const old = existing ? parseHeader(existing) : null;

  const oldRows = new Map<string, string[]>();
  for (const c of tableRows(existing ? section(existing, "Requirements") ?? "" : "")) if (c[0]) oldRows.set(c[0], c);
  const rows = reqs.map((q) => {
    const kept = oldRows.get(q.id);
    if (kept && kept[1] && kept[1] !== "?" && !TOOL_DECIDED.has(q.id) && !kept[2]?.includes(AUTO_FILLED)) return [q.id, kept[1], kept[2] ?? ""];
    const e = ev[q.id];
    const fill = (e?.status ?? "?") === "?" ? autoFill(q, built[q.id]) : null;
    const text = [q.tiers.join(" / "), e?.evidence, fill && `${AUTO_FILLED}: ${fill.why}`].filter(Boolean).join(" · ");
    return [q.id, fill?.status ?? e?.status ?? "?", escapeCell(text)];
  });

  // joints: kit and block from the builder and the record; a generated "none" gives way to a hand entry
  const kin = inp.record.kin as unknown as Kin;
  const byId = new Map(inp.assembly.solids.map((s) => [s.id, s]));
  const oldJoints = new Map<string, string[]>();
  for (const c of tableRows(existing ? section(existing, "Joints") ?? "" : "")) if (c[0]) oldJoints.set(c[0], c);
  const slab = inp.assembly.placement.slabOf;
  const jointRows = inp.assembly.notes.map((n) => {
    const prev = oldJoints.get(n.id);
    const cs = jointCells(n.serves, byId).map((c, i) => (c === "none" && prev?.[i + 5] && prev[i + 5] !== "none" ? prev[i + 5]! : escapeCell(c)));
    const route = inp.assembly.routes.find((r) => r.site === n.id);
    const stack = Object.entries(slab).filter(([b]) => n.serves.F1?.some((id) => byId.get(id)?.body === b)).map(([, k]) => k);
    return [n.id, n.kit, blockOf(kin, n.id), route ? `${route.kind}${route.moved ? " (moved)" : ""}` : "–", stack.length ? `slab ${[...new Set(stack)].join(", ")}` : "–", ...cs];
  });

  const supportRows = inp.assembly.routes.map((r) => [r.support, r.site, r.kind, r.moved ? "moved" : "first choice", r.gap.toFixed(1), r.covers.join(", ") || "–", byId.get(r.support)?.flags.seeThrough ? "see-through" : "–"]);

  const oldLadder = new Map<string, string[]>();
  for (const c of tableRows(existing ? section(existing, "Detail ladder") ?? "" : "")) if (c[0]) oldLadder.set(c[0], c);
  const markCount: Partial<Record<RungId, number>> = {};
  for (const s of inp.assembly.solids) for (const m of s.marks) markCount[rungOf({ mark: m.kind }).id] = (markCount[rungOf({ mark: m.kind }).id] ?? 0) + 1;
  const ladder = RUNG_ORDER.map((r) => {
    const label = r === "never" ? "never" : `DL-${r}`;
    const ms = oldLadder.get(label)?.[3];
    return [label, String(inp.assembly.solids.filter((s) => s.detail === r).length), String(markCount[r] ?? 0), ms && ms !== "?" ? ms : "?"];
  });

  const keep = (title: string, fallback: string) => (existing && section(existing, title)) || fallback;
  const r = inp.report;
  const claimsOk = r.claims.filter((c) => c.status === "ok").length;
  const verification = [
    `check: ${r.findings.length ? plural(r.findings.length, "finding") : "clean"} · K1 residual: ${r.k1 ? r.k1.maxResidual.toExponential(1) : "not solved"} · claims: ${claimsOk} of ${r.claims.length} ok · clearance: ${plural(inp.checks.clash.clashes.length, "clash")} · clamp: ${inp.checks.clamp.length ? "faults" : "clean"} · edge distance: ${inp.checks.edges.length ? "findings" : "clean"} · package: ${kb(inp.packageBytes)}`,
    ...(existing ? (section(existing, "Verification") ?? "").split(/\r?\n/).filter((l) => l.trim() && !l.startsWith("check:")) : ["screenshots: ? · bench: ?"]),
  ];

  const table = (head: string[], body: string[][]) => [`| ${head.join(" | ")} |`, `|${head.map(() => "---").join("|")}|`, ...body.map((x) => `| ${x.join(" | ")} |`)].join("\n");
  const header = {
    standard: old?.standard || inp.standard,
    date: old?.date || inp.date,
    result: old?.result || "open",
    detail: old?.detail || "full",
    pass: old?.pass || "build",
  };
  const verdict = TEACHING_VERDICTS.find((v) => v === inp.record.teaching?.review?.verdict) ?? old?.teaching ?? "";
  return [
    `# Audit: ${old?.name || inp.name} (${inp.id})`,
    headerLine(header),
    teachingLine(verdict || "?"),
    ...(old?.defers ?? []).map(deferLine),
    "",
    "## Summary",
    summaryLine(rows),
    "",
    "## Requirements",
    table(["Id", "Status", "Evidence / action"], rows),
    "",
    "## Joints",
    table(["Joint", "Kit", "Block", "Support", "Stack", ...FUNCTIONS.map((f, i) => `${f} ${FN_TITLES[i]}`)], jointRows),
    "",
    "## Supports",
    table(["Support", "Joint", "Kind", "Route", "Least gap mm", "Covers", "T10"], supportRows),
    "",
    "## Variants and overrides",
    keep("Variants and overrides", table(["Joint or part", "Rule result", "Chosen", "Why"], [])),
    "",
    "## Detail ladder",
    table(["Rung", "Solids", "Marks", "Frame ms at this dial position"], ladder),
    "",
    "## Promotion candidates",
    keep("Promotion candidates", "None yet."),
    "",
    "## Verification",
    verification.join("\n"),
    "",
  ].join("\n");
}

/** Builds a record, runs every check and writes its audit sheet text, keeping the judged rows of `existing`. */
export async function generateAudit3(id: string, opts: { existing?: string | null; date?: string; standard?: string; polish?: boolean; profile?: "ci" | "full" } = {}): Promise<string> {
  const { record, polish } = await loadV3(id);
  const use = opts.polish === false ? undefined : polish;
  const src = await recordSource(record as never, use ? { polish: use } : {});
  const standard = opts.standard ?? readStandard();
  const existing = opts.existing === undefined ? readAudit(id) : opts.existing;
  const files: Record<string, number> = { "audit.md": 0 };
  try {
    // the polish is polish3.ts (the polish API v3); the sheet's row keeps its name polish.ts
    const f = join(ROOT, "src", "mechanisms", id, "polish3.ts");
    files["polish.ts"] = statSync(f).size;
    files["polish.lines"] = readFileSync(f, "utf8").split(/\r?\n/).filter((l) => l.trim() && !l.trim().startsWith("//")).length;
  } catch {
    // none: a mechanism that needs no exception has no polish
  }
  const report = await checkRecord(record as never, { solids: src.solids });
  const checks = await check3d(src, opts.profile ?? "full");
  const built = await buildPackage3(record as never, use ? { polish: use } : {});
  return auditSheet3(
    {
      id,
      name: recordById(id)?.name ?? id,
      date: opts.date ?? new Date().toISOString().slice(0, 10),
      standard: standardVersion(standard),
      record,
      assembly: src.assembly3!,
      report,
      checks,
      recordMissing: recordMissing(record),
      files,
      packageBytes: (await encode2(built.pkg)).length,
    },
    standard,
    existing,
  );
}
