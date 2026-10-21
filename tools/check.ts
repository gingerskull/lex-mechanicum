// npx tsx tools/check.ts <id | all> [n] [--2d | --v3 | --both] [--no-solids]: the headless kinematic check of a mechanism
// (standard Q1). A mechanism audited below 3.0 is checked as before, on its model; one audited at 3.0 or later (or
// named with --v3) is checked from its record v3: the K1 residual of the E4 verifier, periodicity and branch
// continuity, mobility (K11), the claim table (T9) and, unless --no-solids, SOLID (D11) on the solids the builder makes.
import { recordById } from "../src/catalog";
import { allIds, checkRecord, engineOf, formatRecordReport, isKnown, loadV3, recordSource } from "../src/checks";
import { mechanisms } from "../src/mechanisms";
import { checkModel, formatReport } from "../src/model/check";

async function main() {
  const flags = new Set(process.argv.slice(2).filter((a) => a.startsWith("--")));
  const [arg, nArg] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  const ids = arg === "all" ? allIds() : arg ? [arg] : [];
  if (!ids.length) {
    console.error(`usage: tsx tools/check.ts <id | all> [n] [--2d | --v3 | --both] [--no-solids]; ids: ${allIds().join(", ")}`);
    process.exitCode = 2;
    return;
  }
  for (const id of ids) {
    if (!isKnown(id)) {
      console.error(`unknown mechanism "${id}"`);
      process.exitCode = 1;
      continue;
    }
    const mode = flags.has("--both") ? "both" : flags.has("--v3") ? "v3" : flags.has("--2d") ? "2d" : engineOf(id) === "v3" ? "v3" : "2d";
    if (mode !== "v3") {
      const load = mechanisms[id];
      if (!load) {
        console.error(`"${id}" has no 2.5D model; use --v3`);
        process.exitCode = 1;
        continue;
      }
      const { model } = await load();
      const report = checkModel(model, nArg ? Number(nArg) : undefined);
      if (!recordById(id)) report.findings.push({ type: "MISSING", detail: `no catalogue record "${id}"` });
      console.log(formatReport(report).join("\n"));
      if (report.findings.length) process.exitCode = 1;
    }
    if (mode !== "2d") {
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
}

await main();
