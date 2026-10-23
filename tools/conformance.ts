// npx tsx tools/conformance.ts: the conformance report (standard S3, Q7) for every mechanism, with the current check
// results: from its record (K1 residual, claim table) and in 3D (A15, A12) with the cached CI profile. Exits non-zero on a
// mechanism behind a HAND change without a deferral, on a sheet without its `teaching:` line, or on a failing check. Part
// of `npm run check`. Each mechanism is built once (src/package/built.ts), in a pool of processes (tools/pool.ts): the
// same build gives its checks and its package, which the site build then reads from the cache.
import { fileURLToPath } from "node:url";
import { conformance, formatReport } from "../src/audit/conformance";
import { check3d, checkRecord, clashLines, sourceOf } from "../src/checks";
import { builtMechanism } from "../src/package/built";
import { inPool, runPool } from "./pool";

/** One mechanism's check results as the report prints them, and whether a check fails. */
export async function conformanceOne(id: string): Promise<{ line: string; failed: boolean }> {
  const b = await builtMechanism(id);
  const src = sourceOf(b.record, b.assembly);
  const rec = await checkRecord(b.record, { solids: src.solids });
  const r = await check3d(src, "ci");
  const clashes = clashLines(r).length;
  const k = rec.k1 ? rec.k1.maxResidual.toExponential(1) : "unsolved";
  const line = `K1 ${k}${rec.findings.length ? ` (${rec.findings.length} finding(s))` : ""}, claims ${rec.claims.filter((c) => c.status === "ok").length}/${rec.claims.length}, A15 ${clashes} clash${clashes === 1 ? "" : "es"} (3D), A12 ${r.clamp.length ? `${r.clamp.length} fault(s)` : "clean"}`;
  return { line, failed: !!(rec.findings.length || clashes || r.clamp.length) };
}

async function main() {
  const report = conformance();
  const ids = report.mechanisms.map((m) => m.id);
  const results = await runPool(conformanceOne, fileURLToPath(import.meta.url), ids);
  const checks: Record<string, string> = Object.fromEntries(ids.map((id, i) => [id, results[i]!.line]));
  console.log(formatReport(report, checks).join("\n"));
  if (report.failing.length) console.error(`behind the standard without a deferral, or without a teaching line: ${report.failing.join(", ")}`);
  if (report.failing.length || results.some((r) => r.failed)) process.exitCode = 1;
}

// the gate of `npm run check` runs whenever it is started; a pool child only imports it for its task
if (!inPool()) await main();
