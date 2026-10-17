// npx tsx tools/check.ts <id> [n]: headless kinematic check of one mechanism (or every one with "all").
import { recordById } from "../src/catalog";
import { mechanisms } from "../src/mechanisms";
import { checkModel, formatReport } from "../src/model/check";

async function main() {
  const [arg, nArg] = process.argv.slice(2);
  const ids = arg === "all" ? Object.keys(mechanisms) : arg ? [arg] : [];
  if (!ids.length) {
    console.error(`usage: tsx tools/check.ts <id | all> [n]; ids: ${Object.keys(mechanisms).join(", ")}`);
    process.exitCode = 2;
    return;
  }
  for (const id of ids) {
    const load = mechanisms[id];
    if (!load) {
      console.error(`unknown mechanism "${id}"`);
      process.exitCode = 1;
      continue;
    }
    const { model } = await load();
    const report = checkModel(model, nArg ? Number(nArg) : undefined);
    if (!recordById(id)) report.findings.push({ type: "MISSING", detail: `no catalogue record "${id}"` });
    console.log(formatReport(report).join("\n"));
    if (report.findings.length) process.exitCode = 1;
  }
}

await main();
