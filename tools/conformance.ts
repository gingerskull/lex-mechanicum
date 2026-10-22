// npx tsx tools/conformance.ts: the conformance report (standard S3, Q7) for every mechanism, with the current check
// results: from its record (K1 residual, claim table) and in 3D (A15, A12) with the cached CI profile. Exits non-zero on a
// mechanism behind a HAND change without a deferral, on a sheet without its `teaching:` line, or on a failing check. Part
// of `npm run check`.
import { conformance, formatReport } from "../src/audit/conformance";
import { check3d, checkRecord, clashLines, loadV3, recordSource } from "../src/checks";

async function main() {
  const report = conformance();
  const checks: Record<string, string> = {};
  let failed = false;
  for (const m of report.mechanisms) {
    const id = m.id;
    const { record, polish } = await loadV3(id);
    const src = await recordSource(record as never, polish ? { polish } : {});
    const rec = await checkRecord(record as never, { solids: src.solids });
    const r = await check3d(src, "ci");
    const clashes = clashLines(r).length;
    const k = rec.k1 ? rec.k1.maxResidual.toExponential(1) : "unsolved";
    checks[id] = `K1 ${k}${rec.findings.length ? ` (${rec.findings.length} finding(s))` : ""}, claims ${rec.claims.filter((c) => c.status === "ok").length}/${rec.claims.length}, A15 ${clashes} clash${clashes === 1 ? "" : "es"} (3D), A12 ${r.clamp.length ? `${r.clamp.length} fault(s)` : "clean"}`;
    if (rec.findings.length || clashes || r.clamp.length) failed = true;
  }
  console.log(formatReport(report, checks).join("\n"));
  if (report.failing.length) console.error(`behind the standard without a deferral, or without a teaching line: ${report.failing.join(", ")}`);
  if (report.failing.length || failed) process.exitCode = 1;
}

await main();
