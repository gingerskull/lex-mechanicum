// The audit generator (standard 1 step 2, section 11): assembles a mechanism and writes its audit sheet. One row per
// requirement id parsed from the standard; evidence for everything a tool can collect; a status only where a tool
// decides it outright, `?` elsewhere. Judged rows of an existing sheet survive regeneration.
import { statSync } from "node:fs";
import { join } from "node:path";
import { clampCheck, edgeCheck } from "../assemble/clamp";
import { clearance } from "../assemble/clearance";
import type { Assembly } from "../assemble";
import { recordById } from "../catalog";
import type { Solid } from "../hardware/solid";
import { checkModel, type CheckReport } from "../model/check";
import type { MechanismModel } from "../model/types";
import { buildPackage } from "../package/build";
import { encode } from "../package/format";
import { autoTable, rules } from "../rules/registry";
import type { Joint } from "../rules/types";
import { RUNG_ORDER, rungOf, type RungId } from "../style/detail";
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
  tableRows,
  type Requirement,
} from "./sheet";

export const FUNCTIONS = ["F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10"] as const;
const FN_TITLES = ["locate", "retain", "torque", "thrust", "limit", "hold", "adjust", "lube", "timing", "protect"];

/** Rows whose status a tool decides outright: always regenerated, never kept from an earlier sheet. */
export const TOOL_DECIDED = new Set(["P1", "K2", "A12", "A15", "M6", "R7", "Q1", "Q2"]);

/** Everything the sheet is written from. */
export interface AuditInput {
  id: string;
  name: string;
  /** Today, YYYY-MM-DD. */
  date: string;
  standard: string;
  model: MechanismModel;
  assembly: Assembly;
  check: CheckReport;
  clashes: string[];
  clamp: string[];
  edges: string[];
  /** Fields of the catalogue record P1 asks for that are missing or empty; null without a record. */
  recordMissing: string[] | null;
  /** model.ts and polish.ts in bytes; missing files are absent. */
  files: Record<string, number>;
  packageBytes: number;
}

interface Row {
  status: string;
  evidence: string;
}

const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? "" : /(s|sh|ch)$/.test(w) ? "es" : "s"}`;
const kb = (b: number) => `${(b / 1024).toFixed(1)} KB`;

/** P1's record fields (standard 2); `real_world` may be empty (standard 2.3). */
const RECORD_FIELDS = ["name", "aka", "family", "level", "summary", "motion", "ratio", "dof", "topology", "backdrivable", "tags", "explain", "build", "examples", "references", "media"];

function recordMissing(id: string): string[] | null {
  const r = recordById(id) as unknown as Record<string, unknown> | undefined;
  if (!r) return null;
  const empty = (v: unknown) => v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0);
  const out = RECORD_FIELDS.filter((k) => empty(r[k]));
  const ex = r.explain as Record<string, unknown> | undefined;
  if (ex) for (const k of ["motion", "forces", "benefits", "limits"]) if (empty(ex[k])) out.push(`explain.${k}`);
  return out;
}

/** Describes the solids serving one function at one joint: named items with their count. */
export function describeServers(ids: string[], byId: Map<string, Solid>): string {
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

/** Evidence and decided statuses for every requirement the tools can say something about. */
function evidence(inp: AuditInput, reqs: Requirement[]): Record<string, Row> {
  const a = inp.assembly;
  const out: Record<string, Row> = {};
  const set = (id: string, evidence: string, status = "?") => (out[id] = { status, evidence });
  const findings = (types: string[]) => inp.check.findings.filter((f) => types.includes(f.type));
  const fmt = (fs: { type: string; part?: string }[]) => fs.map((f) => `${f.type}${f.part ? ` ${f.part}` : ""}`).join(", ");

  // what the rules fired, per requirement id
  const served: Record<string, string[]> = {};
  const ruleIds = new Set(rules.map((r) => r.id));
  for (const r of autoTable())
    for (const id of r.ids) {
      const n = a.fired[r.id]?.length ?? 0;
      // a stage outside the rule list (fasteners, explode, primitives, checks) keeps no firing record
      (served[id] ??= []).push(!ruleIds.has(r.id) ? r.id : `${r.id} (${n ? plural(n, "solid") : "no solids"})`);
    }
  for (const q of reqs) if (served[q.id]) set(q.id, `fired: ${served[q.id]!.join(", ")}`);

  // P1
  {
    const files = ["model.ts", "polish.ts", "audit.md"].filter((f) => inp.files[f] === undefined);
    const rec = inp.recordMissing === null ? "no catalogue record" : inp.recordMissing.length ? `record missing ${inp.recordMissing.join(", ")}` : "record complete";
    const ok = inp.recordMissing !== null && !inp.recordMissing.length && !files.length;
    set("P1", `${rec}; ${files.length ? `missing ${files.join(", ")}` : "model.ts, polish.ts, audit.md present"}`, ok ? "PASS" : "FAIL");
  }
  // K
  set("K1", `check: max link error ${inp.check.maxLinkErr.toExponential(1)} mm${findings(["LINK_LEN"]).length ? `; ${fmt(findings(["LINK_LEN"]))}` : ""}`);
  {
    const f = findings(["NaN", "POSE_JUMP", "PERIODICITY", "MISSING"]);
    set("K2", f.length ? `check: ${fmt(f)}` : `check: finite, continuous, periodic over ${inp.check.n} samples`, f.length ? "FAIL" : "PASS");
  }
  {
    const f = findings(["INTERFERE", "OVERLAP", "WARN", "AXIS"]);
    set("K5", f.length ? `check: ${fmt(f)}` : "check: no INTERFERE, OVERLAP or WARN");
  }
  set("K7", `input ${inp.model.input.kind} on ${inp.model.input.part}`);
  // A
  const pinTypes = a.joints.filter((j) => /^J\d$/.test(j.type)).map((j) => `${j.id} ${j.type}`);
  set("A1", `${pinTypes.join(", ") || "no joints"}; ${out.A1?.evidence ?? ""}`.replace(/; $/, ""));
  set("A2", pinTypes.join(", ") || "no joints");
  const solids = a.solids;
  const unnamed = solids.filter((s) => !s.name).length;
  set("A13", `${plural(solids.length, "solid")}, ${unnamed} unnamed (further items of a listed set)`);
  set("A12", inp.clamp.length ? `clamp: ${inp.clamp.join("; ")}` : "clamp check clean", inp.clamp.length ? "FAIL" : "PASS");
  set("A15", inp.clashes.length ? `clearance: ${plural(inp.clashes.length, "clash")}: ${inp.clashes.slice(0, 5).join("; ")}` : "clearance: 0 clashes over the cycle", inp.clashes.length ? "FAIL" : "PASS");
  {
    const noNote = a.joints.filter((j) => !j.note).map((j) => j.id);
    const noBadge = a.joints.filter((j) => !j.badge).map((j) => j.id);
    set("A16", `${plural(a.rules.length, "build rule")}; no note: ${noNote.join(", ") || "none"}; no badge: ${noBadge.join(", ") || "none"}`);
  }
  // E
  set("E1", `every solid has one explode level; levels ${Math.min(...solids.map((s) => s.ex))} to ${Math.max(...solids.map((s) => s.ex))}`);
  set("E2", `${plural(new Set(solids.filter((s) => s.group).map((s) => s.group)).size, "rigid group")}${served.E2 ? `; fired: ${served.E2.join(", ")}` : ""}`);
  // F: which joints each function is served at
  for (const f of FUNCTIONS) {
    const at = a.joints.filter((j) => j.serves[f]?.length).map((j) => j.id);
    const prev = out[f]?.evidence;
    set(f, `served at ${at.join(", ") || "no joint"}${prev ? `; ${prev}` : ""}`);
  }
  // M
  set("M6", inp.edges.length ? `edge distance: ${inp.edges.slice(0, 5).join("; ")}` : "edge distance and walls clean", inp.edges.length ? "FAIL" : "PASS");
  {
    const noMat = solids.filter((s) => !s.mat && !s.faint).length;
    set("M10", `${solids.length - noMat} of ${solids.length} solids name a material`);
    const threaded = solids.filter((s) => s.thread !== undefined);
    const unlocked = threaded.filter((s) => !s.lock).map((s) => s.id);
    set("M13", `${threaded.length} threaded, ${unlocked.length} without a locking method${unlocked.length ? `: ${unlocked.slice(0, 8).join(", ")}` : ""}`);
  }
  // R
  {
    const threads = [...new Set(solids.filter((s) => s.thread).map((s) => s.thread!))].sort((x, y) => x - y);
    const bearings = [...new Set(solids.filter((s) => s.kind === "bearing" && s.name).map((s) => s.name.replace(/^Bearing\s*/, "")))];
    const shafts = [...new Set(a.joints.filter((j) => j.d).map((j) => j.d!))].sort((x, y) => x - y);
    set("R2", `threads ${threads.map((t) => `M${t}`).join(", ") || "none"}; joint Ø ${shafts.join(", ") || "none"}; bearings ${bearings.join(", ") || "none"}`);
    const total = (inp.files["model.ts"] ?? 0) + (inp.files["polish.ts"] ?? 0);
    set("R7", `model.ts + polish.ts ${kb(total)}`, total < 20 * 1024 ? "PASS" : "FAIL");
  }
  set("R4", `package ${kb(inp.packageBytes)}; ${out.R4?.evidence ?? ""}`.replace(/; $/, ""));
  // DL
  set("DL1", `${solids.filter((s) => s.detail !== "never").length} of ${solids.length} solids on a dropping rung`);
  set("DL2", `model detail ${inp.model.detail ?? "full"}`);
  // Q
  {
    const clean = !inp.check.findings.length && !inp.clamp.length && !inp.edges.length;
    set("Q1", clean ? "check, clamp and edge distance clean" : `${plural(inp.check.findings.length, "finding")}, ${inp.clamp.length} clamp, ${inp.edges.length} edge`, clean ? "PASS" : "FAIL");
  }
  set("Q2", `${plural(inp.clashes.length, "clash")}`, inp.clashes.length ? "FAIL" : "PASS");
  set("Q4", "local: tools/shot");
  set("Q5", "local: tools/bench");
  set("Q3", `package written, ${kb(inp.packageBytes)}; site build not checked here`);
  return out;
}

/** The ten-function table of one joint, a cell per function. */
function jointCells(j: Joint, byId: Map<string, Solid>): string[] {
  return FUNCTIONS.map((f) => {
    const ids = j.serves[f];
    return ids?.length ? describeServers(ids, byId) || ids.join(", ") : "none";
  });
}

/** Writes the sheet, keeping judged rows, hand cells and hand sections of `existing`. */
export function auditSheet(inp: AuditInput, standard: string, existing: string | null): string {
  const reqs = requirements(standard);
  const ev = evidence(inp, reqs);
  const old = existing ? parseHeader(existing) : null;

  // requirements: a judged row (status other than ?) survives unless a tool decides it
  const oldRows = new Map<string, string[]>();
  for (const c of tableRows(existing ? section(existing, "Requirements") ?? "" : "")) if (c[0]) oldRows.set(c[0], c);
  const rows = reqs.map((q) => {
    const kept = oldRows.get(q.id);
    if (kept && kept[1] && kept[1] !== "?" && !TOOL_DECIDED.has(q.id)) return [q.id, kept[1], kept[2] ?? ""];
    const e = ev[q.id];
    const tier = q.tiers.join(" / ");
    const text = [tier, e?.evidence].filter(Boolean).join(" · ");
    return [q.id, e?.status ?? "?", escapeCell(text)];
  });
  const count = (s: string) => rows.filter((r) => r[1] === s).length;
  const fails = rows.filter((r) => r[1] === "FAIL").map((r) => r[0]);
  const unjudged = count("?");

  // joints: a generated "none" gives way to a hand entry of the earlier sheet
  const byId = new Map(inp.assembly.solids.map((s) => [s.id, s]));
  const oldJoints = new Map<string, string[]>();
  for (const c of tableRows(existing ? section(existing, "Joints") ?? "" : "")) if (c[0]) oldJoints.set(c[0], c);
  const jointRows = inp.assembly.joints.map((j) => {
    const prev = oldJoints.get(j.id);
    const cs = jointCells(j, byId).map((c, i) => (c === "none" && prev?.[i + 2] && prev[i + 2] !== "none" ? prev[i + 2]! : escapeCell(c)));
    return [j.id, j.type, ...cs];
  });

  // detail ladder: counts per rung; a measured frame time survives
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
  const verification = [
    `check: ${inp.check.findings.length ? plural(inp.check.findings.length, "finding") : "clean"} · clearance: ${plural(inp.clashes.length, "clash")} · clamp: ${inp.clamp.length ? "faults" : "clean"} · edge distance: ${inp.edges.length ? "findings" : "clean"} · package: ${kb(inp.packageBytes)}`,
    ...(existing ? (section(existing, "Verification") ?? "").split(/\r?\n/).filter((l) => l.trim() && !l.startsWith("check:")) : ["screenshots: ? · bench: ?"]),
  ];

  const table = (head: string[], body: string[][]) => [`| ${head.join(" | ")} |`, `|${head.map(() => "---").join("|")}|`, ...body.map((r) => `| ${r.join(" | ")} |`)].join("\n");
  const header = {
    standard: old?.standard || inp.standard,
    date: old?.date || inp.date,
    result: old?.result || "open",
    detail: old?.detail || (inp.model.detail && inp.model.detail !== "never" ? inp.model.detail : "full"),
    pass: old?.pass || "build",
  };
  const open = [fails.length ? `FAIL ${fails.join(", ")}` : "", unjudged ? `${unjudged} unjudged` : ""].filter(Boolean).join("; ") || "none";
  return [
    `# Audit: ${old?.name || inp.name} (${inp.id})`,
    headerLine(header),
    ...(old?.defers ?? []).map(deferLine),
    "",
    "## Summary",
    `PASS ${count("PASS")} · FAIL ${count("FAIL")} · N/A ${count("N/A")} · open: ${open}`,
    "",
    "## Requirements",
    table(["Id", "Status", "Evidence / action"], rows),
    "",
    "## Joints",
    table(["Joint", "Type", ...FUNCTIONS.map((f, i) => `${f} ${FN_TITLES[i]}`)], jointRows),
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

const fileSizes = (id: string): Record<string, number> => {
  const out: Record<string, number> = {};
  for (const f of ["model.ts", "polish.ts", "audit.md"]) {
    try {
      out[f] = statSync(join(ROOT, "src", "mechanisms", id, f)).size;
    } catch {
      // absent
    }
  }
  return out;
};

/** Assembles a registered mechanism and writes its audit sheet text, keeping the judged rows of `existing`. */
export async function generateAudit(
  id: string,
  opts: { existing?: string | null; date?: string; standard?: string; polish?: boolean } = {},
): Promise<string> {
  const { model, assembly, pkg } = await buildPackage(id, opts.polish === false ? { polish: false } : {});
  const standard = opts.standard ?? readStandard();
  const existing = opts.existing === undefined ? readAudit(id) : opts.existing;
  const files = fileSizes(id);
  // the sheet is about to exist; P1 judges the folder as it will be after writing
  files["audit.md"] ??= 0;
  const inp: AuditInput = {
    id,
    name: recordById(id)?.name ?? id,
    date: opts.date ?? new Date().toISOString().slice(0, 10),
    standard: standardVersion(standard),
    model,
    assembly,
    check: checkModel(model),
    clashes: clearance(model, assembly).map((c) => `${c.a} x ${c.b} ${c.depth.toFixed(2)} mm`),
    clamp: clampCheck(model, assembly),
    edges: edgeCheck(assembly),
    recordMissing: recordMissing(id),
    files,
    packageBytes: (await encode(pkg)).length,
  };
  return auditSheet(inp, standard, existing);
}

