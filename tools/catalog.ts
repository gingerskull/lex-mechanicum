// npm run catalog: merges and validates data/catalog/sources, writes data/catalog/mechanisms.json (committed) and the
// generated views dist/catalog/mechanisms.csv and dist/catalog/CATALOG.md (not committed).
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildCatalog, serializeCatalog } from "../src/catalog/build";
import type { SourceFile } from "../src/catalog/merge";
import { toCsv, toMarkdown } from "../src/catalog/views";

const root = fileURLToPath(new URL("..", import.meta.url));
export const SOURCES = join(root, "data/catalog/sources");
export const CATALOG = join(root, "data/catalog/mechanisms.json");
const VIEWS = join(root, "dist/catalog");

export function readSources(dir = SOURCES): SourceFile[] {
  return readdirSync(dir)
    .filter((name) => name.endsWith(".json"))
    .map((name) => ({ name, json: JSON.parse(readFileSync(join(dir, name), "utf8")) as unknown }));
}

function main() {
  const files = readSources();
  const { catalog, problems } = buildCatalog(files, new Date().toISOString().slice(0, 10));
  console.log(`${catalog.mechanisms.length} records from ${files.map((f) => f.name).join(", ")}`);
  if (problems.length) {
    console.error(problems.join("\n"));
    process.exitCode = 1;
    return;
  }
  console.log("vocab OK");
  for (const r of catalog.mechanisms) if (r.waive) console.log(`waived: ${r.id} (${r.waive.join(", ")})`);
  writeFileSync(CATALOG, serializeCatalog(catalog));
  mkdirSync(VIEWS, { recursive: true });
  writeFileSync(join(VIEWS, "mechanisms.csv"), toCsv(catalog.mechanisms));
  writeFileSync(join(VIEWS, "CATALOG.md"), toMarkdown(catalog.mechanisms));
  console.log(`wrote ${CATALOG} and ${VIEWS}`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
