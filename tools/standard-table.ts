// npx tsx tools/standard-table.ts [--check]: writes the table of rules and stages that serve the AUTO requirements
// into docs/mechanism-standard.md (section 5.1), from autoTable(). With --check, fails when the committed table
// differs. Part of npm run check through tests/docs/tables.test.ts.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { autoTable } from "../src/rules/registry";
import { replaceBlock, table, writeOrCheck } from "./doc-tables";

export const STANDARD = fileURLToPath(new URL("../docs/mechanism-standard.md", import.meta.url));

export function standardTable(): string {
  return table(
    ["Rule or stage", "Serves"],
    autoTable().map((r) => [`\`${r.id}\``, r.ids.join(", ")]),
  );
}

export const standardDoc = (doc = readFileSync(STANDARD, "utf8")) => replaceBlock(doc, "auto-table", standardTable());

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  if (!writeOrCheck(STANDARD, standardDoc(), process.argv.includes("--check"), "the AUTO table")) process.exitCode = 1;
}
