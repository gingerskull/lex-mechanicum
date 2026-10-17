// Shared by the doc table tools: replace the text between two markers in a document, and report drift.
import { readFileSync, writeFileSync } from "node:fs";

export const marker = (name: string) => [`<!-- ${name}:start (generated, do not edit) -->`, `<!-- ${name}:end -->`] as const;

/** The document with the block between the markers replaced by `body`. Throws when the markers are missing. */
export function replaceBlock(doc: string, name: string, body: string): string {
  const [a, b] = marker(name);
  const i = doc.indexOf(a);
  const k = doc.indexOf(b);
  if (i < 0 || k < i) throw new Error(`markers for ${name} not found`);
  return doc.slice(0, i + a.length) + "\n" + body.trimEnd() + "\n" + doc.slice(k);
}

/** Writes the document, or with `check` reports whether the committed one differs. Returns true when current. */
export function writeOrCheck(path: string, next: string, check: boolean, what: string): boolean {
  const cur = readFileSync(path, "utf8");
  if (cur === next) return true;
  if (check) {
    console.error(`${what} in ${path} is out of date: run without --check to regenerate it`);
    return false;
  }
  writeFileSync(path, next);
  console.log(`wrote ${what} in ${path}`);
  return true;
}

export const table = (head: string[], rows: string[][]) =>
  [`| ${head.join(" | ")} |`, `|${head.map(() => "---").join("|")}|`, ...rows.map((r) => `| ${r.join(" | ")} |`)].join("\n");
