// npm run judge -- <id[,id ...] | all> <row> <PASS | FAIL | N/A> "<note>": writes one judgement into the audit sheets of
// the named mechanisms (standard 1, step 6). --file <judgements.json> writes many at once, as
// {"<id>[,<id> ...]": {"<row>": ["PASS", "<note>"]}}. --open <id> lists the rows a sheet still leaves unjudged, with
// their titles and evidence. Every judgement is checked before any sheet is written (src/audit/judge.ts); the generator
// keeps judged rows when it regenerates a sheet.
import { readFileSync, writeFileSync } from "node:fs";
import { judgeSheet, openRows, refusal, type Judgement, type Verdict } from "../src/audit/judge";
import { auditPath, readAudit, readStandard, requirements } from "../src/audit/sheet";
import { allIds, isBuilt } from "../src/mechanisms";

const USAGE = 'usage: npm run judge -- <id[,id ...] | all> <row> <PASS | FAIL | N/A> "<note>" | --file <judgements.json> | --open <id>';

const idsOf = (spec: string): string[] => (spec === "all" ? allIds() : spec.split(",").map((s) => s.trim()).filter(Boolean));

function main() {
  const args = process.argv.slice(2);
  if (args[0] === "--open") {
    const id = args[1] ?? "";
    const text = readAudit(id);
    if (!text) return fail(`no audit sheet for "${id}"`);
    const titles = new Map(requirements(readStandard()).map((q) => [q.id, q.title]));
    const rows = openRows(text);
    for (const r of rows) console.log(`${r[0]}  ${titles.get(r[0]!) ?? ""}\n    ${r[2] ?? ""}`);
    console.log(`${id}: ${rows.length} unjudged`);
    return;
  }
  // per mechanism, its judgements
  const plan = new Map<string, Judgement[]>();
  const add = (spec: string, row: string, status: string, note: string) => {
    for (const id of idsOf(spec)) plan.set(id, [...(plan.get(id) ?? []), { row, status: status as Verdict, note }]);
  };
  if (args[0] === "--file") {
    const json = JSON.parse(readFileSync(args[1] ?? "", "utf8")) as Record<string, Record<string, [string, string]>>;
    for (const [spec, rows] of Object.entries(json)) for (const [row, [status, note]] of Object.entries(rows)) add(spec, row, status, note);
  } else if (args.length === 4) add(args[0]!, args[1]!, args[2]!, args[3]!);
  else return fail(USAGE, 2);

  // every judgement checked before any sheet is written
  const problems: string[] = [];
  const texts = new Map<string, string>();
  for (const [id, js] of plan) {
    const text = isBuilt(id) ? readAudit(id) : null;
    if (!text) {
      problems.push(`${id}: not a registered mechanism with an audit sheet`);
      continue;
    }
    texts.set(id, text);
    for (const j of js) {
      const why = refusal(text, j);
      if (why) problems.push(`${id}: ${why}`);
    }
  }
  if (problems.length) return fail(problems.join("\n"));
  for (const [id, js] of plan) {
    writeFileSync(auditPath(id), judgeSheet(texts.get(id)!, js));
    console.log(`${auditPath(id)}: ${js.map((j) => `${j.row} ${j.status}`).join(", ")}`);
  }
}

function fail(message: string, code = 1) {
  console.error(message);
  process.exitCode = code;
}

main();
