// npm run kin-check -- <id|file>...: merges the catalogue sources and validates the kin and teaching blocks of the
// named records (an id, or a patch file under data/catalog/sources whose ids are checked). Also lists the numbers in a
// record's explanation text that no teaching claim mentions, for the review to judge (standard T9).
import { readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";
import { SOURCES } from "./catalog";
import { mergeSources, type SourceFile } from "../src/catalog/merge";
import { validate } from "../src/catalog/validate";

const args = process.argv.slice(2);
// a patch file another session is still writing may not parse: skip it, but fail if it is one of the named files
const files: SourceFile[] = [];
for (const name of readdirSync(SOURCES).filter((n) => n.endsWith(".json"))) {
  try {
    files.push({ name, json: JSON.parse(readFileSync(join(SOURCES, name), "utf8")) as unknown });
  } catch (e) {
    if (process.argv.slice(2).some((a) => basename(a) === name)) throw e;
  }
}
const { records, problems: mergeProblems } = mergeSources(files);
const wanted = new Set<string>();
for (const a of args) {
  const f = files.find((x) => x.name === basename(a));
  if (f && typeof f.json === "object" && f.json !== null && !Array.isArray(f.json)) Object.keys(f.json).forEach((id) => wanted.add(id));
  else wanted.add(a);
}
const subset = args.length ? records.filter((r) => wanted.has(r.id)) : records;
for (const id of wanted) if (!subset.some((r) => r.id === id)) console.log(`unknown id ${id}`);
const problems = [...mergeProblems, ...validate(subset, { asVersion: 3 }).filter((p) => /kin|teaching|joint|solve|point|body|param|driver|design|trace|overlay|view|claim|control|output|mobility|plot|block|principle|branch|fallback|exception/i.test(p))];
const NUM = /\d+(?:\.\d+)?\s*(?:°|mm|:1|×|x\b|%)|\b\d+(?:\.\d+)?:\d+(?:\.\d+)?/g;
for (const r of subset) {
  const claimText = JSON.stringify(r.teaching?.claims ?? []);
  const text = [r.explain?.motion, r.explain?.forces, r.explain?.benefits, r.explain?.limits].join(" ");
  const loose = [...new Set(text.match(NUM) ?? [])].filter((n) => !claimText.replace(/\s/g, "").includes(n.replace(/\s/g, "")));
  if (loose.length) console.log(`${r.id}: numbers in the explanation with no claim: ${loose.join(", ")}`);
}
console.log(problems.length ? problems.join("\n") : `${subset.length} records OK`);
process.exitCode = problems.length ? 1 : 0;
