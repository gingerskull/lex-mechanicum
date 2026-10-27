// Judging a sheet's open rows: the status and the note go into the row after the generated evidence, the Summary is
// counted again, and a judgement the sheet cannot take is refused before anything is written.
import { describe, expect, it } from "vitest";
import { AUTO_FILLED } from "../../src/audit/generate3";
import { judgeSheet, openRows, refusal } from "../../src/audit/judge";
import { section, tableRows } from "../../src/audit/sheet";

const SHEET = [
  "# Audit: Test (test)",
  "standard: 3.0 · date: 2026-10-27 · result: open · detail: full · pass: build",
  "teaching: keep · decisions in the record",
  "",
  "## Summary",
  "PASS 1 · FAIL 0 · N/A 0 · open: 3 unjudged",
  "",
  "## Requirements",
  "| Id | Status | Evidence / action |",
  "|---|---|---|",
  "| S1 | ? | DATA |",
  "| A9 | ? | AUTO / HAND · fired: placement solver |",
  `| A1 | PASS | AUTO · O2 J2 · ${AUTO_FILLED}: the pipeline holds it for every built mechanism |`,
  "| T1 | ? | HAND · a \\| b |",
  "| K1 | PASS | K1 residual 1e-14 |",
  "",
  "## Joints",
  "| Joint | Kit |",
  "|---|---|",
  "| A9 | J3 |",
  "",
].join("\n");

const rows = (text: string) => new Map(tableRows(section(text, "Requirements") ?? "").map((c) => [c[0]!, c]));

describe("judgeSheet", () => {
  it("writes the status and note after the generated evidence and counts the Summary again", () => {
    const out = judgeSheet(SHEET, [
      { row: "A9", status: "PASS", note: "clevis pair at A and B" },
      { row: "S1", status: "N/A", note: "no such field" },
    ]);
    expect(rows(out).get("A9")!.slice(1)).toEqual(["PASS", "AUTO / HAND · fired: placement solver · clevis pair at A and B"]);
    expect(rows(out).get("S1")!.slice(1)).toEqual(["N/A", "DATA · no such field"]);
    expect(out).toContain("PASS 3 · FAIL 0 · N/A 1 · open: 1 unjudged");
    // a joint of the same name is not a requirement row
    expect(section(out, "Joints")).toContain("| A9 | J3 |");
  });

  it("drops the generator's fill note when a row is judged over it, and keeps escaped bars", () => {
    const out = judgeSheet(SHEET, [
      { row: "A1", status: "FAIL", note: "O2 is not a live shaft" },
      { row: "T1", status: "PASS", note: "reads well" },
    ]);
    expect(rows(out).get("A1")!.slice(1)).toEqual(["FAIL", "AUTO · O2 J2 · O2 is not a live shaft"]);
    expect(rows(out).get("T1")![2]).toBe("HAND · a \\| b · reads well");
    expect(out).toContain("open: FAIL A1; 2 unjudged");
  });

  it("refuses a tool-decided row, an unknown row, a bad status and an empty note", () => {
    expect(refusal(SHEET, { row: "K1", status: "PASS", note: "x" })).toMatch(/decided by the tools/);
    expect(refusal(SHEET, { row: "Z9", status: "PASS", note: "x" })).toMatch(/no such row/);
    expect(refusal(SHEET, { row: "S1", status: "OK" as never, note: "x" })).toMatch(/not one of/);
    expect(refusal(SHEET, { row: "S1", status: "PASS", note: " " })).toMatch(/needs a note/);
    expect(() => judgeSheet(SHEET, [{ row: "K1", status: "PASS", note: "x" }])).toThrow(/decided by the tools/);
  });

  it("lists the open rows", () => {
    expect(openRows(SHEET).map((r) => r[0])).toEqual(["S1", "A9", "T1"]);
  });
});
