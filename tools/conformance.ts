// npx tsx tools/conformance.ts: the conformance report (standard S3, Q7) for every registered mechanism, with the
// current check results (K, A15, A12). Exits non-zero on a mechanism behind a HAND change without a deferral, or on a
// failing check. Part of `npm run check`.
import { assemble } from "../src/assemble";
import { clampCheck } from "../src/assemble/clamp";
import { clearance } from "../src/assemble/clearance";
import { conformance, formatReport } from "../src/audit/conformance";
import { mechanisms } from "../src/mechanisms";
import { checkModel } from "../src/model/check";

async function main() {
  const report = conformance();
  const checks: Record<string, string> = {};
  let failed = false;
  for (const id of Object.keys(mechanisms)) {
    const { model, polish } = await mechanisms[id]!();
    const k = checkModel(model, 360).findings.length;
    const a = assemble(model, undefined, polish ? { polish } : {});
    const clashes = clearance(model, a).length;
    const clamp = clampCheck(model, a).length;
    checks[id] = `K ${k ? `${k} finding(s)` : "clean"}, A15 ${clashes} clash${clashes === 1 ? "" : "es"}, A12 ${clamp ? `${clamp} fault(s)` : "clean"}`;
    if (k || clashes || clamp) failed = true;
  }
  console.log(formatReport(report, checks).join("\n"));
  if (report.failing.length) console.error(`behind the standard without a deferral: ${report.failing.join(", ")}`);
  if (report.failing.length || failed) process.exitCode = 1;
}

await main();
