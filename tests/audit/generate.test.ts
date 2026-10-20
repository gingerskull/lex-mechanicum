// The audit generator (standard 1 step 2, section 11): a row per requirement id, the ten-function table from the
// assembly, judged rows kept on regeneration.
import { beforeAll, describe, expect, it } from "vitest";
import { generateAudit } from "../../src/audit/generate";
import { parseHeader, readStandard, requirements, section, standardVersion, tableRows } from "../../src/audit/sheet";

const opts = { existing: null, date: "2026-10-17", polish: false } as const;
const current = standardVersion(readStandard());
let sheet: string;

beforeAll(async () => {
  sheet = await generateAudit("four-bar", opts);
}, 60_000);

const rowsOf = (text: string, title: string) => new Map(tableRows(section(text, title) ?? "").map((c) => [c[0]!, c]));

describe("generateAudit on four-bar without polish", () => {
  it("has a row for every requirement id in the standard", () => {
    const ids = requirements(readStandard()).map((r) => r.id);
    expect(ids.length).toBeGreaterThan(100);
    expect([...rowsOf(sheet, "Requirements").keys()]).toEqual(ids);
  });

  it("starts with the header of section 11, open and at the current standard", () => {
    const h = parseHeader(sheet)!;
    expect(h).toMatchObject({ id: "four-bar", standard: current, date: "2026-10-17", result: "open", detail: "full" });
  });

  it("decides tool rows and leaves the rest unjudged", () => {
    const rows = rowsOf(sheet, "Requirements");
    expect(rows.get("A15")!.slice(1, 2)).toEqual(["PASS"]);
    expect(rows.get("A12")![1]).toBe("PASS");
    expect(rows.get("A9")![1]).toBe("?");
    expect(rows.get("J2")![2]).toMatch(/fired: j2-live-shaft \(\d+ solids\)/);
  });

  it("lists pO2 as J2 with the housing dowels, circlips and its key", () => {
    const pO2 = rowsOf(sheet, "Joints").get("pO2")!;
    expect(pO2[1]).toBe("J2");
    expect(pO2[2]).toMatch(/Dowel pin.*housing/);
    expect(pO2[3]).toMatch(/circlip/i);
    // A5: D-flat to Ø8, feather key above; the input shaft is Ø10
    expect(pO2[4]).toMatch(/Feather key/);
    expect(pO2[6]).toBe("none");
  });

  it("keeps hand-judged rows, hand joint cells and the header on regeneration", async () => {
    const judged = sheet
      .replace(`standard: ${current} · date: 2026-10-17 · result: open`, `standard: ${current} · date: 2026-10-01 · result: open`)
      .replace(/^\| A9 \| \? \|.*$/m, "| A9 | PASS | clevis pair at A and B, double shear |")
      .replace(/^\| A15 \| PASS \|.*$/m, "| A15 | FAIL | stale hand entry |")
      .replace(/^(\| pO2 \| J2 \|(?: [^|]* \|){4}) none \|/m, "$1 – input, the drive limits nothing |")
      .replace("None yet.", "- stop bumpers on every rocker");
    const again = await generateAudit("four-bar", { ...opts, existing: judged });
    const rows = rowsOf(again, "Requirements");
    expect(rows.get("A9")!.slice(1)).toEqual(["PASS", "clevis pair at A and B, double shear"]);
    // a row a tool decides is always regenerated
    expect(rows.get("A15")![1]).toBe("PASS");
    expect(rowsOf(again, "Joints").get("pO2")![6]).toBe("– input, the drive limits nothing");
    expect(parseHeader(again)!.date).toBe("2026-10-01");
    expect(section(again, "Promotion candidates")).toBe("- stop bumpers on every rocker");
  }, 60_000);
});

describe("generateAudit lists every joint type in A1 and A2", () => {
  it("J9 to J13 included, not only J1 to J8", async () => {
    const fresh = await generateAudit("block-and-tackle", { ...opts, existing: null, polish: true });
    const rows = rowsOf(fresh, "Requirements");
    expect(rows.get("A2")![2]).toMatch(/flex-rope-0 J12/);
    expect(rows.get("A1")![2]).toMatch(/flex-rope-0 J12/);
    const bevel = rowsOf(await generateAudit("bevel-gears", { ...opts, existing: null, polish: true }), "Requirements");
    expect(bevel.get("A2")![2]).toMatch(/pQ J10/);
    expect(bevel.get("A2")![2]).toMatch(/mesh-pinion-gear J9/);
  }, 120_000);
});
