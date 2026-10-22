// The sixteen laws at the top of the standard: numbered I to XVI, every requirement id under exactly one law, and
// every section and id a law names one the standard has.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { requirements, section, tableRows } from "../../src/audit/sheet";
import { roman } from "../../tools/release";

const std = readFileSync(new URL("../../docs/mechanism-standard.md", import.meta.url), "utf8");
const laws = tableRows(section(std, "The sixteen laws") ?? "");
const ids = requirements(std).map((r) => r.id);

/** "A1 to A8, J3" → [{ prefix: "A", lo: 1, hi: 8 }, { prefix: "J", lo: 3, hi: 3 }]. */
const ranges = (cell: string) =>
  cell.split(",").map((part) => {
    const m = /^([A-Z]+)(\d+)(?: to \1(\d+))?$/.exec(part.trim());
    if (!m) throw new Error(`"${part.trim()}" is neither an id nor a range of ids`);
    return { prefix: m[1]!, lo: Number(m[2]), hi: Number(m[3] ?? m[2]) };
  });

const lawsOf = (id: string) => {
  const [, prefix, n] = /^([A-Z]+)(\d+)$/.exec(id)!;
  return laws.filter((l) => ranges(l[3]!).some((r) => r.prefix === prefix && Number(n) >= r.lo && Number(n) <= r.hi)).map((l) => l[0]);
};

describe("the sixteen laws", () => {
  it("are numbered I to XVI, one line each with its rule, sections and requirements", () => {
    expect(laws.map((l) => l[0])).toEqual(Array.from({ length: 16 }, (_, i) => roman(i + 1)));
    for (const l of laws) expect(l.length, l[0]).toBe(4);
  });

  it("put every requirement id of the standard under exactly one law", () => {
    expect(ids.length).toBeGreaterThan(100);
    expect(ids.filter((id) => lawsOf(id).length !== 1).map((id) => `${id}: ${lawsOf(id).join(", ") || "none"}`)).toEqual([]);
  });

  it("name only requirement ids and sections the standard has", () => {
    for (const l of laws) {
      for (const r of ranges(l[3]!)) for (const n of [r.lo, r.hi]) expect(ids, `law ${l[0]}`).toContain(`${r.prefix}${n}`);
      for (const s of l[2]!.split(",").map((x) => x.trim())) expect(std, `law ${l[0]}, section ${s}`).toMatch(new RegExp(`^#{2,3} ${s.replace(/\./g, "\\.")}[. ]`, "m"));
    }
  });

  it("stay out of the requirement rows the audit reads", () => {
    const first = requirements(std)[0]!;
    expect(first).toMatchObject({ id: "S1", section: "0" });
  });
});
