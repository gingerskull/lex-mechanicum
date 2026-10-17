// npx tsx tools/audit.ts <id>: writes src/mechanisms/<id>/audit.md from the template in standard section 11, keeping
// the judged rows of the sheet already there (standard 1, step 2 and step 6).
import { writeFileSync } from "node:fs";
import { generateAudit } from "../src/audit/generate";
import { auditPath, parseHeader, section, tableRows } from "../src/audit/sheet";
import { mechanisms } from "../src/mechanisms";

async function main() {
  const id = process.argv[2];
  if (!id || !mechanisms[id]) {
    console.error(`usage: tsx tools/audit.ts <id>; registered: ${Object.keys(mechanisms).join(", ")}`);
    process.exitCode = id ? 1 : 2;
    return;
  }
  const text = await generateAudit(id);
  writeFileSync(auditPath(id), text);
  const h = parseHeader(text)!;
  const rows = tableRows(section(text, "Requirements") ?? "");
  const n = (s: string) => rows.filter((r) => r[1] === s).length;
  console.log(`${auditPath(id)}: standard ${h.standard}, result ${h.result}; PASS ${n("PASS")}, FAIL ${n("FAIL")}, N/A ${n("N/A")}, unjudged ${n("?")}`);
}

await main();
