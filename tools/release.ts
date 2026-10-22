// npm run release -- minor | patch [--date YYYY-MM-DD]: the release step (docs/workflow.md, Versions). Bumps the
// version in package.json and the lock file, writes the CHANGELOG heading and data/codenames.json, which the footer
// reads. A minor release takes the next unused name of data/release-names.json, in file order; when the list runs
// out it comes round again with a numeral (Graia II). A patch keeps its minor's name. Releases from before the first
// codename keep their headings and have none.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

export type Bump = "minor" | "patch";

export interface Heading {
  version: string;
  codename?: string;
  date: string;
}

export const NAMES = "data/release-names.json";
export const CODENAMES = "data/codenames.json";

const NUMERALS: [number, string][] = [
  [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"],
  [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
];

/** `n` in Roman numerals: 2 → "II", 16 → "XVI". */
export function roman(n: number): string {
  let out = "";
  for (const [v, s] of NUMERALS) for (; n >= v; n -= v) out += s;
  return out;
}

/** The `i`-th name of the endless sequence: the list in file order, then the list again with II, then III ... */
export function nameAt(names: readonly string[], i: number): string {
  const pass = Math.floor(i / names.length) + 1;
  const name = names[i % names.length]!;
  return pass === 1 ? name : `${name} ${roman(pass)}`;
}

/** The first name of the sequence that is not in `used`. */
export function nextName(names: readonly string[], used: Iterable<string>): string {
  if (!names.length) throw new Error(`release: no names in ${NAMES}`);
  const taken = new Set(used);
  for (let i = 0; ; i++) if (!taken.has(nameAt(names, i))) return nameAt(names, i);
}

/** A changelog heading: `## 0.37.0, Graia — 2026-10-22`, or `## 0.36.0 — 2026-10-20` for a release without a name. */
export const heading = (h: Heading): string => `## ${h.version}${h.codename ? `, ${h.codename}` : ""} — ${h.date}`;

const HEADING = /^## (\d+\.\d+\.\d+)(?:, (.+?))? — (\S+)\s*$/;

/** Every release heading of a changelog, in the order written (newest first), with or without a codename. */
export function headings(changelog: string): Heading[] {
  return changelog.split(/\r?\n/).flatMap((l) => {
    const m = HEADING.exec(l);
    return m ? [{ version: m[1]!, codename: m[2], date: m[3]! }] : [];
  });
}

/** `0.37.2` → `0.37`: the key a codename is kept under, shared by a minor release and its patches. */
export const minorOf = (version: string): string => version.split(".").slice(0, 2).join(".");

/** The codename of each named minor release, oldest first: the content of data/codenames.json. */
export function codenames(changelog: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const h of headings(changelog).reverse()) if (h.codename) out[minorOf(h.version)] ??= h.codename;
  return out;
}

/** The version after `version`: a minor release resets the patch number. */
export function bump(version: string, kind: Bump): string {
  const m = /^(\d+)\.(\d+)\.(\d+)$/.exec(version);
  if (!m) throw new Error(`release: version "${version}" is not x.y.z`);
  const [major, minor, patch] = [Number(m[1]), Number(m[2]), Number(m[3])];
  return kind === "minor" ? `${major}.${minor + 1}.0` : `${major}.${minor}.${patch + 1}`;
}

/** The changelog with `line` as its newest heading: in place of an `## Unreleased` heading, else above the newest. */
function withHeading(changelog: string, line: string): string {
  const lines = changelog.split("\n");
  const top = lines.findIndex((l) => l.startsWith("## "));
  if (top < 0) return `${changelog.trimEnd()}\n\n${line}\n`;
  if (lines[top]!.trim() === "## Unreleased") lines[top] = line;
  else lines.splice(top, 0, line, "");
  return lines.join("\n");
}

export interface Release {
  version: string;
  codename?: string;
  changelog: string;
  codenames: Record<string, string>;
}

/** The next release from the current version and changelog: its version, codename, changelog and codenames. */
export function release(o: { kind: Bump; version: string; changelog: string; names: readonly string[]; date: string }): Release {
  const version = bump(o.version, o.kind);
  const done = headings(o.changelog);
  if (done.some((h) => h.version === version)) throw new Error(`release: the changelog already has ${version}`);
  const codename = o.kind === "minor" ? nextName(o.names, done.flatMap((h) => (h.codename ? [h.codename] : []))) : codenames(o.changelog)[minorOf(version)];
  const changelog = withHeading(o.changelog, heading({ version, codename, date: o.date }));
  return { version, codename, changelog, codenames: codenames(changelog) };
}

const json = (v: unknown) => JSON.stringify(v, null, 2) + "\n";

/** Runs the release in the repository at `root` and writes package.json, the lock file, CHANGELOG.md and the codenames. */
export function runRelease(root: string, kind: Bump, date: string): Release {
  const path = (f: string) => join(root, f);
  const read = (f: string) => readFileSync(path(f), "utf8");
  const pkg = JSON.parse(read("package.json"));
  const r = release({ kind, version: pkg.version, changelog: read("CHANGELOG.md"), names: JSON.parse(read(NAMES)), date });
  writeFileSync(path("package.json"), json({ ...pkg, version: r.version }));
  if (existsSync(path("package-lock.json"))) {
    const lock = JSON.parse(read("package-lock.json"));
    lock.version = r.version;
    if (lock.packages?.[""]) lock.packages[""].version = r.version;
    writeFileSync(path("package-lock.json"), json(lock));
  }
  writeFileSync(path("CHANGELOG.md"), r.changelog);
  writeFileSync(path(CODENAMES), json(r.codenames));
  return r;
}

const today = () => {
  const d = new Date();
  return [d.getFullYear(), d.getMonth() + 1, d.getDate()].map((n) => String(n).padStart(2, "0")).join("-");
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const [kind, ...rest] = process.argv.slice(2);
  const d = rest.indexOf("--date");
  const date = d >= 0 ? (rest[d + 1] ?? "") : today();
  if (kind !== "minor" && kind !== "patch") {
    console.error("usage: npm run release -- minor | patch [--date YYYY-MM-DD]");
    process.exitCode = 1;
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    console.error(`release: date "${date}" is not YYYY-MM-DD`);
    process.exitCode = 1;
  } else {
    const r = runRelease(fileURLToPath(new URL("..", import.meta.url)), kind, date);
    const line = heading({ version: r.version, codename: r.codename, date });
    const after = r.changelog.slice(r.changelog.indexOf(line) + line.length).trimStart();
    const empty = !after || after.startsWith("## ");
    console.log(`release: ${line}${empty ? " (write its lines under the heading)" : ""}`);
  }
}
