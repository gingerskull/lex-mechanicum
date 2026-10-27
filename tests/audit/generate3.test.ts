// The v3 audit sheet (standard 11, 3.0): the `teaching:` line, kit and block per joint, the tool-decided rows from the
// record's checks, the Supports section, and the same sections as the template.
import { readFileSync } from "node:fs";
import { beforeAll, describe, expect, it } from "vitest";
import { AUTO_FILLED, autoFill, generateAudit3 } from "../../src/audit/generate3";
import { parseHeader, readStandard, requirements, section, tableRows, type Requirement } from "../../src/audit/sheet";

const opts = { existing: null, date: "2026-10-21", profile: "ci" } as const;
let sheet: string;

beforeAll(async () => {
  sheet = await generateAudit3("four-bar", opts);
}, 120_000);

const rowsOf = (text: string, title: string) => new Map(tableRows(section(text, title) ?? "").map((c) => [c[0]!, c]));

describe("generateAudit3 on the four-bar record", () => {
  it("has a row for every requirement id and the sections of the template, in order", () => {
    expect([...rowsOf(sheet, "Requirements").keys()]).toEqual(requirements(readStandard()).map((r) => r.id));
    const std = readFileSync(new URL("../../docs/mechanism-standard.md", import.meta.url), "utf8");
    const tpl = std.slice(std.indexOf("## 11. Audit sheet template"));
    const block = tpl.slice(tpl.indexOf("```markdown"), tpl.indexOf("```\n", tpl.indexOf("```markdown") + 3));
    const heads = (t: string) => [...t.matchAll(/^## (.+)$/gm)].map((m) => m[1]);
    expect(heads(sheet)).toEqual(heads(block));
  });

  it("starts with the header and the teaching line from the record's review", () => {
    const h = parseHeader(sheet)!;
    expect(h).toMatchObject({ id: "four-bar", date: "2026-10-21", result: "open", teaching: "keep" });
    expect(sheet.split("\n")[2]).toBe("teaching: keep · decisions in the record");
  });

  it("decides the tool rows from the record and its checks", () => {
    const rows = rowsOf(sheet, "Requirements");
    for (const id of ["P1", "K1", "K2", "K11", "T9", "D11", "A12", "A15", "M6", "Q1", "Q2"]) expect(["PASS", "FAIL", "N/A", "?"]).toContain(rows.get(id)![1]);
    expect(rows.get("K1")![2]).toMatch(/K1 residual [\d.]+e[-+]\d+/);
    expect(rows.get("K11")![1]).toBe("PASS");
    expect(rows.get("T9")![2]).toMatch(/claim table: \d+ ok, \d+ off, \d+ uncheckable of 3/);
    expect(rows.get("D11")![1]).toBe("PASS");
    expect(rows.get("A15")![2]).toMatch(/clearance in 3D over \d+ phases/);
    expect(rows.get("A21")![2]).toMatch(/kit per joint: A J3, B J3, O2 J2/);
    expect(rows.has("K5")).toBe(false);
  });

  it("fills the rows the rules' output and the pipeline decide, marked so a later run fills them again", () => {
    const rows = rowsOf(sheet, "Requirements");
    expect(rows.get("J3")![1]).toBe("PASS");
    expect(rows.get("J4")!.slice(1)).toEqual(["N/A", expect.stringContaining(`${AUTO_FILLED}: no joint of this type`)]);
    expect(rows.get("A1")!.slice(1)).toEqual(["PASS", expect.stringContaining(`${AUTO_FILLED}: the pipeline holds it`)]);
    // a row that needs judgement stays open
    expect(rows.get("T1")![1]).toBe("?");
  });

  it("decides only joint-type, pipeline and AUTO rows a rule built solids for", () => {
    const q = (id: string, section: string, tiers: Requirement["tiers"]): Requirement => ({ id, section, title: "", tiers });
    expect(autoFill(q("J9", "5b", ["AUTO"]), false)).toMatchObject({ status: "N/A" });
    expect(autoFill(q("J9", "5b", ["AUTO"]), true)).toMatchObject({ status: "PASS" });
    expect(autoFill(q("L8", "8", ["AUTO"]), true)).toMatchObject({ status: "PASS" });
    expect(autoFill(q("L8", "8", ["AUTO"]), false)).toBeNull();
    expect(autoFill(q("A9", "5.2", ["AUTO", "HAND"]), true)).toBeNull();
    expect(autoFill(q("S6", "2", ["AUTO"]), undefined)).toMatchObject({ status: "PASS" });
  });

  it("lists the kit and the block of every joint, and the supports", () => {
    const joints = rowsOf(sheet, "Joints");
    expect(joints.get("O2")!.slice(0, 3)).toEqual(["O2", "J2", expect.any(String)]);
    expect(joints.get("A")![1]).toBe("J3");
    expect(section(sheet, "Supports")).toMatch(/O4-bridge/);
  });

  it("keeps judged rows, hand cells, the header and the hand sections on regeneration", async () => {
    const judged = sheet
      .replace("date: 2026-10-21", "date: 2026-10-01")
      .replace(/^\| A9 \| \? \|.*$/m, "| A9 | PASS | clevis pair at A and B |")
      .replace(/^\| A15 \| \w+ \|.*$/m, "| A15 | PASS | stale hand entry |")
      .replace(/^\| J4 \| [^|]+ \|.*$/m, `| J4 | PASS | AUTO · ${AUTO_FILLED}: stale fill |`)
      .replace("None yet.", "- rocker stops from the rule");
    const again = await generateAudit3("four-bar", { ...opts, existing: judged });
    const rows = rowsOf(again, "Requirements");
    expect(rows.get("A9")!.slice(1)).toEqual(["PASS", "clevis pair at A and B"]);
    expect(rows.get("A15")![2]).not.toMatch(/stale/);
    expect(rows.get("J4")![1]).toBe("N/A");
    expect(parseHeader(again)!.date).toBe("2026-10-01");
    expect(section(again, "Promotion candidates")).toBe("- rocker stops from the rule");
  }, 120_000);
});
