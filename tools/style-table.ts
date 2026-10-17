// npx tsx tools/style-table.ts [--check]: writes the value tables of docs/style-reference.md Part VI from the style
// files, with each knob's unit and use taken from its comment in the source (SA9). With --check, fails when the
// committed tables differ. Part of npm run check through tests/docs/tables.test.ts.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { DETAIL } from "../src/style/detail";
import { DRAFT } from "../src/style/draft";
import { FORM } from "../src/style/form";
import { TOKENS } from "../src/style/tokens";
import { replaceBlock, table, writeOrCheck } from "./doc-tables";

export const STYLE_REF = fileURLToPath(new URL("../docs/style-reference.md", import.meta.url));
const src = (f: string) => readFileSync(fileURLToPath(new URL(`../src/style/${f}`, import.meta.url)), "utf8");

/** Trailing comments of a style source by dotted key path (keys of nested object literals, one per line). */
export function comments(text: string): Map<string, string> {
  const out = new Map<string, string>();
  const stack: string[] = [];
  for (const raw of text.split("\n")) {
    const line = raw.replace(/\/\/.*$/, "");
    const m = /^\s*([A-Za-z_]\w*|"[^"]+"|\d+(?:\.\d+)?):\s*(.*)$/.exec(line);
    const note = /\/\/\s*(.*)$/.exec(raw)?.[1]?.trim();
    if (m) {
      const key = m[1]!.replace(/"/g, "");
      const rest = m[2]!;
      const path = [...stack, key].join(".");
      if (note) out.set(path, note);
      const open = (rest.match(/[{[]/g) ?? []).length - (rest.match(/[}\]]/g) ?? []).length;
      if (open > 0) stack.push(key);
      continue;
    }
    const close = (line.match(/[}\]]/g) ?? []).length - (line.match(/[{[]/g) ?? []).length;
    for (let i = 0; i < close && stack.length; i++) stack.pop();
  }
  return out;
}

const fmt = (v: unknown): string => {
  if (typeof v === "function") return "function (see source)";
  if (Array.isArray(v)) return `[${v.map(fmt).join(", ")}]`;
  if (typeof v === "string") return `\`${v}\``;
  return String(v);
};

/** Leaf values of an object as [dotted path, value]; small objects of plain values stay one row. */
function flatten(o: object, prefix = ""): [string, unknown][] {
  const out: [string, unknown][] = [];
  for (const [k, v] of Object.entries(o)) {
    const p = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) {
      const vals = Object.values(v);
      if (vals.length <= 4 && vals.every((x) => typeof x !== "object" || Array.isArray(x)) && Object.keys(v).every((x) => x === "dark" || x === "light"))
        out.push([p, v]);
      else out.push(...flatten(v, p));
    } else out.push([p, v]);
  }
  return out;
}

const perTheme = (v: unknown) => (v && typeof v === "object" && "dark" in v ? `${fmt((v as Record<string, unknown>).dark)} / ${fmt((v as Record<string, unknown>).light)}` : fmt(v));

function knobTable(root: string, o: object, notes: Map<string, string>): string {
  return table(
    ["Knob", "Value", "Unit and use"],
    // a value inside a one-line object takes that object's comment
    flatten(o).map(([p, v]) => [`\`${root}.${p}\``, perTheme(v), (notes.get(p) ?? notes.get(p.replace(/\.[^.]+$/, "")) ?? "").replace(/\|/g, "/")]),
  );
}

export function styleTables(): Record<string, string> {
  const tn = comments(src("tokens.ts"));
  const { dark, light } = TOKENS.themes;
  const colours = Object.keys(dark).filter((k) => k !== "name") as (keyof typeof dark)[];
  const palettes = table(
    ["Token", `${dark.name} (dark)`, `${light.name} (light)`, "Use"],
    colours.map((k) => [`\`${k}\``, fmt(dark[k]), fmt(light[k]), tn.get(`themes.dark.${k}`) ?? tn.get(`themes.light.${k}`) ?? ""]),
  );
  const tiers = table(
    ["Tier", "Dark", "Light", "Use"],
    [...Object.entries(TOKENS.tiers).map(([k, v]) => [`\`--${k.replace(/(\d)/, "-$1")}\``, String(v.dark), String(v.light), tn.get(`tiers.${k}`) ?? ""]),
      ...Object.entries(TOKENS.gridTiers).map(([k, v]) => [`\`--${k.replace(/(\d)/, "-$1")}\``, String(v.dark), String(v.light), "page grid, alpha of `grid`"])],
  );
  const type = knobTable("tokens.type", TOKENS.type, new Map([...tn].filter(([k]) => k.startsWith("type.")).map(([k, v]) => [k.slice(5), v])));
  const site = knobTable("tokens.size", { ...TOKENS.size, ...TOKENS.ratio }, new Map([...tn].flatMap(([k, v]) => (k.startsWith("size.") ? [[k.slice(5), v]] : k.startsWith("ratio.") ? [[k.slice(6), v]] : [])) as [string, string][]));
  const drawing = knobTable("draft", DRAFT, comments(src("draft.ts")));
  const form = knobTable("form", FORM, comments(src("form.ts")));
  const ladder = table(
    ["Rung", "What stops being drawn", "Selectors", "Exceptions"],
    DETAIL.map((r) => [
      r.id,
      r.name,
      [r.drops.kinds && `kinds: ${r.drops.kinds.join(", ")}`, r.drops.roles && `roles: ${r.drops.roles.join(", ")}`, r.drops.marks && `marks: ${r.drops.marks.join(", ")}`, r.drops.effects && `effects: ${r.drops.effects.join(", ")}`].filter(Boolean).join("; "),
      r.exceptions ? Object.entries(r.exceptions).map(([k, v]) => `${k}: ${v}`).join(", ") : "",
    ]),
  );
  return { "style-palettes": palettes, "style-tiers": tiers, "style-type": type, "style-drawing": drawing, "style-form": form, "style-site": site, "style-ladder": ladder };
}

export function styleDoc(doc = readFileSync(STYLE_REF, "utf8")): string {
  let out = doc;
  for (const [name, body] of Object.entries(styleTables())) out = replaceBlock(out, name, body);
  return out;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  if (!writeOrCheck(STYLE_REF, styleDoc(), process.argv.includes("--check"), "the Part VI tables")) process.exitCode = 1;
}
