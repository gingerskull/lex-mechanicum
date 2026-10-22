// npx tsx tools/check.ts <id | all> [n] [--no-solids]: the headless kinematic check of a mechanism (standard Q1), from its
// record v3: the K1 residual of the E4 verifier, periodicity and branch continuity, mobility (K11), the claim table (T9)
// and, unless --no-solids, SOLID (D11) on the solids the builder makes.
import { allIds, checkRecord, formatRecordReport, isKnown, loadV3, recordSource } from "../src/checks";

async function main() {
  const flags = new Set(process.argv.slice(2).filter((a) => a.startsWith("--")));
  const [arg, nArg] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  const ids = arg === "all" ? allIds() : arg ? [arg] : [];
  if (!ids.length) {
    console.error(`usage: tsx tools/check.ts <id | all> [n] [--no-solids]; ids: ${allIds().join(", ")}`);
    process.exitCode = 2;
    return;
  }
  for (const id of ids) {
    if (!isKnown(id)) {
      console.error(`unknown mechanism "${id}"`);
      process.exitCode = 1;
      continue;
    }
    const { record, polish } = await loadV3(id);
    let solids;
    if (!flags.has("--no-solids")) {
      try {
        solids = (await recordSource(record as never, polish ? { polish } : {})).solids;
      } catch (e) {
        console.log(`${id}: the builder does not build it yet (${(e as Error).message})`);
      }
    }
    const report = await checkRecord(record as never, { ...(nArg ? { samples: Number(nArg) } : {}), ...(solids ? { solids } : {}) });
    console.log(formatRecordReport(report).join("\n"));
    if (report.findings.length) process.exitCode = 1;
  }
}

await main();
