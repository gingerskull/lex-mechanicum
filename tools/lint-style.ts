// Part of npm run lint: the literal scan (style SA8, SQ1, standard L1). Fails on a colour or font literal in src/** or
// site/** outside the style files and the generated tokens.css and site/public, and on a style key in a mechanism record.
import { readdirSync, readFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

export interface StyleFinding {
  file: string; // path relative to the scanned root, forward slashes
  line: number; // 1-based
  message: string;
}

const SCANNED = ["src", "site"];
const EXCLUDED = ["src/style/", "site/styles/tokens.css", "site/public/"];
const SKIP_DIRS = new Set(["node_modules", "dist", ".astro"]);
const EXTENSIONS = /\.(ts|tsx|js|mjs|cjs|astro|css|html|svelte|vue|json)$/;

const LITERALS: { re: RegExp; what: string }[] = [
  { re: /(?<![\w&])#[0-9a-f]{3,8}\b/i, what: "hex colour" },
  { re: /\brgba?\(/i, what: "rgb() colour" },
  { re: /IBM Plex/, what: "font family" },
];
const RECORD_KEYS = /["']?\b(colou?r|alpha|lineWidth|font)["']?\s*:/;

function* files(dir: string): Generator<string> {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    if (e.isDirectory()) {
      if (!SKIP_DIRS.has(e.name)) yield* files(join(dir, e.name));
    } else if (EXTENSIONS.test(e.name)) yield join(dir, e.name);
  }
}

export function lintStyle(root: string): StyleFinding[] {
  const found: StyleFinding[] = [];
  for (const top of SCANNED) {
    for (const path of files(join(root, top))) {
      const file = relative(root, path).split(sep).join("/");
      if (EXCLUDED.some((x) => (x.endsWith("/") ? file.startsWith(x) : file === x))) continue;
      const record = file.startsWith("src/mechanisms/");
      readFileSync(path, "utf8")
        .split(/\r?\n/)
        .forEach((text, i) => {
          for (const { re, what } of LITERALS) {
            const m = re.exec(text);
            if (m) found.push({ file, line: i + 1, message: `${what} "${m[0]}" outside src/style` });
          }
          const k = record && RECORD_KEYS.exec(text);
          if (k) found.push({ file, line: i + 1, message: `style key "${k[1]}" in a mechanism record` });
        });
    }
  }
  return found;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const root = fileURLToPath(new URL("..", import.meta.url));
  const found = lintStyle(root);
  for (const f of found) console.error(`${f.file}:${f.line}: ${f.message}`);
  if (found.length) {
    console.error(`style lint: ${found.length} problem(s)`);
    process.exitCode = 1;
  } else console.log("style lint OK");
}
