// npx tsx tools/conformance.ts: the conformance report (standard S3, Q7) for every mechanism, with the current check
// results (K1, A15, A12). Exits non-zero on a mechanism behind a HAND change without a deferral, on a rebuilt mechanism
// without its `teaching:` line, or on a failing check. Part of `npm run check`.
// The two engines are told apart by the audit sheet's standard (S6): a 2.5D mechanism is checked on its model and its
// outlines as before; a mechanism rebuilt on engine v3 is checked from its record (K1 residual, claim table) and in 3D
// (A15, A12) with the cached CI profile.
import { assemble } from "../src/assemble";
import { clampCheck } from "../src/assemble/clamp";
import { clearance } from "../src/assemble/clearance";
import { conformance, formatReport } from "../src/audit/conformance";
import { check3d, checkRecord, clashLines, engineOf, loadV3, recordSource } from "../src/checks";
import { mechanisms } from "../src/mechanisms";
import { checkModel } from "../src/model/check";

async function main() {
  const report = conformance();
  const checks: Record<string, string> = {};
  let failed = false;
  for (const m of report.mechanisms) {
    const id = m.id;
    if (engineOf(id) === "v3") {
      const { record, polish } = await loadV3(id);
      const src = await recordSource(record as never, polish ? { polish } : {});
      const rec = await checkRecord(record as never, { solids: src.solids });
      const r = await check3d(src, "ci");
      const clashes = clashLines(r).length;
      const k = rec.k1 ? rec.k1.maxResidual.toExponential(1) : "unsolved";
      checks[id] = `K1 ${k}${rec.findings.length ? ` (${rec.findings.length} finding(s))` : ""}, claims ${rec.claims.filter((c) => c.status === "ok").length}/${rec.claims.length}, A15 ${clashes} clash${clashes === 1 ? "" : "es"} (3D), A12 ${r.clamp.length ? `${r.clamp.length} fault(s)` : "clean"}`;
      if (rec.findings.length || clashes || r.clamp.length) failed = true;
      continue;
    }
    if (!mechanisms[id]) continue;
    const { model, polish } = await mechanisms[id]!();
    const k = checkModel(model, 360).findings.length;
    const a = assemble(model, undefined, polish ? { polish } : {});
    const clashes = clearance(model, a).length;
    const clamp = clampCheck(model, a).length;
    checks[id] = `K ${k ? `${k} finding(s)` : "clean"}, A15 ${clashes} clash${clashes === 1 ? "" : "es"}, A12 ${clamp ? `${clamp} fault(s)` : "clean"}`;
    if (k || clashes || clamp) failed = true;
  }
  console.log(formatReport(report, checks).join("\n"));
  if (report.failing.length) console.error(`behind the standard without a deferral, or without a teaching line: ${report.failing.join(", ")}`);
  if (report.failing.length || failed) process.exitCode = 1;
}

await main();
