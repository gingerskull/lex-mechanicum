// The conformance report (standard S3): a mechanism behind a HAND change fails until re-audited or deferred.
import { describe, expect, it } from "vitest";
import { conformance, evaluate } from "../../src/audit/conformance";
import { changelog, readStandard } from "../../src/audit/sheet";

const STANDARD = `# Mechanism standard

\`\`\`
version: 2.0
\`\`\`

| Id | Requirement | Tier |
|---|---|---|
| K7 | **Input kind declared** | HAND |

## Changelog

- **2.0 (2026-10-17).** Input kind and drive by input kind [K7, V5, HAND + AUTO]. Stepped shafts [A4, AUTO].
  Look [L1, STYLE].
- **1.0 (2026-10-16).** The hand-off standard.
`;

const sheet = (version: string, extra = "") => `# Audit: Fixture (fx)
standard: ${version} · date: 2026-10-16 · result: pass · detail: full · pass: build
teaching: keep · decisions in the record
${extra}
## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| K7 | PASS | rotary |
`;

describe("conformance", () => {
  it("reads the HAND changes of the changelog", () => {
    const log = changelog(STANDARD);
    expect(log.map((e) => e.version)).toEqual(["2.0", "1.0"]);
    expect(log[0]!.changes).toEqual([
      { ids: ["K7", "V5"], tiers: ["AUTO", "HAND"] },
      { ids: ["A4"], tiers: ["AUTO"] },
      { ids: ["L1"], tiers: ["STYLE"] },
    ]);
  });

  it("reports an audit at 1.0 with a HAND change since as behind", () => {
    const r = evaluate(STANDARD, { fx: sheet("1.0") });
    expect(r.mechanisms[0]).toMatchObject({ status: "behind", audited: "1.0", behind: ["K7", "V5"] });
    expect(r.failing).toEqual(["fx"]);
  });

  it("reports an audit at 2.0 as current", () => {
    const r = evaluate(STANDARD, { fx: sheet("2.0") });
    expect(r.mechanisms[0]).toMatchObject({ status: "current", hand: [], rows: { PASS: 1, FAIL: 0, "N/A": 0, "?": 0 } });
    expect(r.failing).toEqual([]);
  });

  it("clears the failure with a deferral line that gives a reason", () => {
    const byId = evaluate(STANDARD, { fx: sheet("1.0", "defer: K7, V5 · the drive comes with the next pass") });
    expect(byId.mechanisms[0]).toMatchObject({ status: "deferred", deferred: ["K7", "V5"], behind: [] });
    expect(byId.failing).toEqual([]);
    const byVersion = evaluate(STANDARD, { fx: sheet("1.0", "defer: 2.0 · rebuilt in the next pass") });
    expect(byVersion.failing).toEqual([]);
    // only part deferred, or no reason: still behind
    expect(evaluate(STANDARD, { fx: sheet("1.0", "defer: K7 · later") }).mechanisms[0]!.behind).toEqual(["V5"]);
    expect(evaluate(STANDARD, { fx: sheet("1.0", "defer: K7, V5") }).failing).toEqual(["fx"]);
  });

  it("reports a mechanism without an audit as not audited, and one without a header as failing", () => {
    const r = evaluate(STANDARD, { none: null, bad: "# notes\n" });
    expect(r.mechanisms.map((m) => m.status)).toEqual(["not audited", "no header"]);
    expect(r.failing).toEqual(["bad"]);
  });

  it("on the real standard, an audit at 1.0 is behind on the 2.0 HAND changes", () => {
    const r = evaluate(readStandard(), { fx: sheet("1.0") });
    expect(r.mechanisms[0]!.behind).toEqual(expect.arrayContaining(["F", "K7", "V5"]));
  });

  it("finds no registered mechanism behind", () => {
    expect(conformance().failing).toEqual([]);
  });
});

describe("standard 2.7", () => {
  const std = readStandard();
  it("brings no HAND change, nor do 2.8 and 2.9, so audits at 2.6 stay current", () => {
    const e = changelog(std).find((x) => x.version === "2.7")!;
    for (const v of ["2.8", "2.9"]) expect(changelog(std).find((x) => x.version === v)!.changes.every((c) => !c.tiers.includes("HAND"))).toBe(true);
    expect(e.changes.flatMap((c) => c.ids)).toEqual(expect.arrayContaining(["D8", "J9", "J10", "J11", "L6", "Q1"]));
    expect(e.changes.every((c) => !c.tiers.includes("HAND"))).toBe(true);
    const r = evaluate(std, { old: sheet("2.6"), now: sheet("2.7") });
    expect(r.mechanisms.map((m) => [m.id, m.status])).toEqual([["old", "current"], ["now", "current"]]);
    expect(r.failing).toEqual([]);
  });
});

describe("conformance of a 3.0 audit (S6)", () => {
  const SPLIT = `# Mechanism standard

\`\`\`
version: 3.1
\`\`\`

| Id | Requirement | Tier |
|---|---|---|
| K7 | **Input kind declared** | HAND |

## Changelog

- **3.1 (2026-11-01).** Section 9a [R7, HAND].
- **3.0 (2026-10-20).** True 3D parts [K8, T1, AUTO + HAND].
- **2.0 (2026-10-17).** Input kind [K7, V5, HAND].
`;
  const v3sheet = (version: string, teaching = "teaching: keep · decisions in the record") => `# Audit: Fixture (fx)
standard: ${version} · date: 2026-10-21 · result: pass · detail: full · pass: build
${teaching}

## Requirements
| Id | Status | Evidence / action |
|---|---|---|
| K7 | PASS | rotary |
`;

  it("holds an audit to every HAND change after it, the 3.0 ones included", () => {
    const behind = evaluate(SPLIT, { fx: sheet("2.0") });
    expect(behind.mechanisms[0]).toMatchObject({ status: "behind", behind: expect.arrayContaining(["K8", "T1", "R7"]) });
  });

  it("holds a 3.0 audit to the HAND changes after it, and to the teaching line", () => {
    const behind = evaluate(SPLIT, { fx: v3sheet("3.0") });
    expect(behind.mechanisms[0]).toMatchObject({ status: "behind", behind: ["R7"] });
    const current = evaluate(SPLIT, { fx: v3sheet("3.1") });
    expect(current.mechanisms[0]).toMatchObject({ status: "current" });
    const none = evaluate(SPLIT, { fx: v3sheet("3.1", "") });
    expect(none.mechanisms[0]).toMatchObject({ status: "no teaching" });
    expect(none.failing).toEqual(["fx"]);
    expect(evaluate(SPLIT, { fx: v3sheet("3.1", "teaching: ? · decisions in the record") }).failing).toEqual(["fx"]);
  });
});
