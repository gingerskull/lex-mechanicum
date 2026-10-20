// The checks of a catalogue record v3 (standard Q1): the kinematics through the E4 verifier (K1 residual, K2
// periodicity, branch continuity), mobility (K11), the claim table (T9) and, for the solids the builder makes, SOLID
// (D11). The finding types follow `tools/check`: UNSOLVED, K1, NaN, POSE_JUMP, PERIODICITY, MOBILITY, CLAIM, SOLID.
import type { CatalogRecord } from "../catalog/schema";
import { mobility } from "../catalog/validate-kin";
import { Kinematics, verifyK1, type K1Report } from "../kin";
import type { Kin } from "../kin/types";
import { checkMesh } from "../solids/check";
import { manifold, meshOf } from "../solids/manifold";
import { quantise } from "../solids/quantise";
import type { Solid3 } from "../solids/types";
import { checkClaims, type Claim, type ClaimResult } from "./claims";

export interface RecordFinding {
  type: "UNSOLVED" | "K1" | "NaN" | "POSE_JUMP" | "PERIODICITY" | "BRANCH" | "MOBILITY" | "CLAIM" | "SOLID" | "MISSING";
  detail: string;
}

export interface RecordReport {
  id: string;
  /** The record's own composition solves over the whole cycle. */
  solved: boolean;
  k1: K1Report | null;
  /** Blocks that used the numeric fallback (the audit names them). */
  fallback: string[];
  mobility: { counted: number | undefined; dof: number; ok: boolean };
  claims: ClaimResult[];
  solids: { id: string; ok: boolean; issues: string[] }[] | null;
  findings: RecordFinding[];
}

type Rec = Pick<CatalogRecord, "id"> & { kin?: unknown; teaching?: unknown; dof?: number; motion?: { plane?: string }; topology?: { notes?: string } };

/** K1, K2, branch continuity, K11 and T9 of a record; `solids` adds SOLID (D11) for the solids a build made. */
export async function checkRecord(rec: Rec, opts: { samples?: number; solids?: Solid3[] } = {}): Promise<RecordReport> {
  const findings: RecordFinding[] = [];
  const out: RecordReport = { id: rec.id, solved: false, k1: null, fallback: [], mobility: { counted: undefined, dof: rec.dof ?? 0, ok: true }, claims: [], solids: null, findings };
  if (!rec.kin) {
    findings.push({ type: "MISSING", detail: `no kin block in record "${rec.id}"` });
    return out;
  }
  const kin = rec.kin as Kin;
  // K1: the verifier is independent of the blocks that posed the bodies
  let K: Kinematics | null = null;
  let report: K1Report | null = null;
  try {
    K = new Kinematics(kin);
    report = verifyK1(K, { samples: opts.samples ?? 360 });
  } catch (e) {
    findings.push({ type: "UNSOLVED", detail: (e as Error).message });
  }
  out.k1 = report;
  if (report) {
    out.fallback = report.fallback;
    out.solved = report.failures.length === 0;
    if (report.failures.length) findings.push({ type: "UNSOLVED", detail: `${report.failures.length} of ${report.samples + 1} samples do not solve: ${report.failures[0]!.error}` });
    if (report.maxResidual > report.tol) findings.push({ type: "K1", detail: `residual ${report.maxResidual.toExponential(1)} at ${report.worst?.joint} (tolerance ${report.tol.toExponential(0)})` });
    if (report.referenceAgreement > 1e-6) findings.push({ type: "K1", detail: `the declared branch does not reproduce the reference geometry (${report.referenceAgreement.toExponential(1)})` });
    if (report.periodicity > 1e-6) findings.push({ type: "PERIODICITY", detail: `the pose at 2π differs from the pose at 0 by ${report.periodicity.toExponential(1)}` });
    for (const j of report.jumps.slice(0, 5)) findings.push({ type: "POSE_JUMP", detail: `${j.point} at u ${j.u.toFixed(2)} (step ${j.step.toFixed(2)} mm)` });
    for (const t of report.branchNotPeriodic) findings.push({ type: "BRANCH", detail: `the branch table of ${t} is not periodic` });
  }
  // K11
  const plane = rec.motion?.plane;
  const counted = plane === "Planar" || plane === "Spatial" ? mobility(kin as never, plane) : undefined;
  const over = /overconstrained|mobility/i.test(rec.topology?.notes ?? "");
  out.mobility = { counted, dof: rec.dof ?? 0, ok: counted !== undefined && (counted === rec.dof || over) };
  if (counted === undefined) findings.push({ type: "MOBILITY", detail: `not countable for a ${String(plane)} mechanism` });
  else if (!out.mobility.ok) findings.push({ type: "MOBILITY", detail: `counted ${counted}, the record says ${rec.dof} (K11)` });
  // T9
  const claims = ((rec.teaching as { claims?: Claim[] } | undefined)?.claims ?? []) as Claim[];
  if (claims.length && !K) out.claims = claims.map((claim) => ({ claim, status: "uncheckable" as const, why: "the composition is not available" }));
  if (claims.length && K) {
    out.claims = checkClaims(K, claims, kin.outputs ?? [], { samples: opts.samples ? Math.min(opts.samples, 720) : 720 });
    for (const r of out.claims) if (r.status === "off") findings.push({ type: "CLAIM", detail: `"${r.claim.text}": ${r.claim.output} ${r.claim.stat} is ${r.got!.toFixed(3)}, the record says ${r.claim.value} ± ${r.claim.tol}` });
  }
  // D11
  if (opts.solids) {
    const M = await manifold();
    out.solids = opts.solids.map((s) => {
      try {
        const r = checkMesh(quantise(meshOf(M, s)), s.stretch ? { thin: false } : {});
        return { id: s.id, ok: r.ok, issues: r.issues };
      } catch (e) {
        return { id: s.id, ok: false, issues: [`Manifold would not mesh it: ${(e as Error).message}`] };
      }
    });
    for (const s of out.solids) if (!s.ok) findings.push({ type: "SOLID", detail: `${s.id}: ${s.issues.join("; ")}` });
  }
  return out;
}

/** The report as lines, in the style of `tools/check`. */
export function formatRecordReport(r: RecordReport): string[] {
  const lines = [`${r.id} (record v3): ${r.solved ? "solves over the cycle" : "does not solve"}${r.fallback.length ? `, numeric fallback in ${r.fallback.join(", ")}` : ""}`];
  if (r.k1) lines.push(`  K1 residual ${r.k1.maxResidual.toExponential(1)} (tolerance ${r.k1.tol.toExponential(0)}), reference ${r.k1.referenceAgreement.toExponential(1)}, periodicity ${r.k1.periodicity.toExponential(1)}`);
  lines.push(`  mobility ${r.mobility.counted ?? "?"} / dof ${r.mobility.dof}`);
  if (r.claims.length) {
    const n = (s: string) => r.claims.filter((c) => c.status === s).length;
    lines.push(`  claims: ${n("ok")} ok, ${n("off")} off, ${n("uncheckable")} uncheckable`);
    for (const c of r.claims) if (c.status !== "ok") lines.push(`    ${c.status === "off" ? "OFF" : "?"} ${c.claim.output} ${c.claim.stat} ${c.claim.value}${c.status === "off" ? ` (got ${c.got!.toFixed(3)})` : ` (${c.why})`}`);
  }
  if (r.solids) lines.push(`  SOLID: ${r.solids.filter((s) => !s.ok).length} of ${r.solids.length} solids unsound`);
  lines.push(r.findings.length ? `  ${r.findings.length} finding(s)` : "  no findings");
  for (const f of r.findings.slice(0, 20)) lines.push(`  ${f.type}: ${f.detail}`);
  return lines;
}
