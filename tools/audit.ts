// npx tsx tools/audit.ts <id> [--ci]: writes src/mechanisms/<id>/audit.md from the template in standard section 11,
// keeping the judged rows of the sheet already there (standard 1, step 2 and step 6): the `teaching:` line, the kit and
// block of each joint, the K1 residual, the claim table (T9), the supports and the 3D clearance. --ci samples fewer phases
// and does not audit the hand `allow` exemptions (the full run is the default).
import { writeFileSync } from "node:fs";
import { generateAudit3 } from "../src/audit/generate3";
import { auditPath, parseHeader, section, tableRows } from "../src/audit/sheet";
import { isKnown } from "../src/mechanisms";

async function main() {
  const flags = new Set(process.argv.slice(2).filter((a) => a.startsWith("--")));
  const id = process.argv.slice(2).find((a) => !a.startsWith("--"));
  if (!id || !isKnown(id)) {
    console.error(`usage: tsx tools/audit.ts <id> [--ci]; "${id ?? ""}" is not a catalogue record`);
    process.exitCode = id ? 1 : 2;
    return;
  }
  const text = await generateAudit3(id, { profile: flags.has("--ci") ? "ci" : "full" });
  writeFileSync(auditPath(id), text);
  const h = parseHeader(text)!;
  const rows = tableRows(section(text, "Requirements") ?? "");
  const n = (s: string) => rows.filter((r) => r[1] === s).length;
  console.log(`${auditPath(id)}: standard ${h.standard}, teaching ${h.teaching}, result ${h.result}; PASS ${n("PASS")}, FAIL ${n("FAIL")}, N/A ${n("N/A")}, unjudged ${n("?")}`);
}

await main();
