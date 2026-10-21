import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { codenameOf, releaseLine } from "../../site/src/release";
import { CODENAMES, NAMES, bump, codenames, heading, headings, nameAt, nextName, release, roman, runRelease } from "../../tools/release";

const LOG = `# Changelog

## 0.36.0 — 2026-10-20

- Worm drive added.

## 0.35.0 — 2026-10-20

- Flexure hinge added.
`;

const NAMED = `# Changelog

## 0.37.1, Graia — 2026-10-23

- A fix.

## 0.37.0, Graia — 2026-10-22

- A feature.

## 0.36.0 — 2026-10-20

- Worm drive added.
`;

const names = JSON.parse(readFileSync(NAMES, "utf8")) as string[];
const at = (kind: "minor" | "patch", version: string, changelog: string, list: string[] = names) =>
  release({ kind, version, changelog, names: list, date: "2026-10-24" });

describe("release names", () => {
  it("writes Roman numerals", () => {
    const cases: [number, string][] = [[1, "I"], [2, "II"], [4, "IV"], [9, "IX"], [14, "XIV"], [16, "XVI"], [40, "XL"], [1994, "MCMXCIV"]];
    for (const [n, s] of cases) expect(roman(n)).toBe(s);
  });

  it("are taken in file order, the first unused one next", () => {
    expect(nextName(["A", "B", "C"], [])).toBe("A");
    expect(nextName(["A", "B", "C"], ["A"])).toBe("B");
    expect(nextName(["A", "B", "C"], ["A", "B"])).toBe("C");
  });

  it("come round again with a numeral when the list runs out", () => {
    expect(nextName(["A", "B"], ["A", "B"])).toBe("A II");
    expect(nextName(["A", "B"], ["A", "B", "A II"])).toBe("B II");
    expect(nextName(["A", "B"], ["A", "B", "A II", "B II"])).toBe("A III");
    expect(nameAt(["A", "B"], 31)).toBe("B XVI");
  });

  it("start with Graia, number at least 60, are unique and read right with a numeral after them", () => {
    expect(names[0]).toBe("Graia");
    expect(names.length).toBeGreaterThanOrEqual(60);
    expect(new Set(names).size).toBe(names.length);
    // a name that ended in a numeral would read wrong on the second pass (Stygies VIII II)
    for (const n of names) expect(n, n).toMatch(/^[A-Z][A-Za-z'-]*(?: [A-Z][A-Za-z'-]*)*$/);
    for (const n of names) expect(n, n).not.toMatch(/ [IVXLCDM]+$/);
  });
});

describe("changelog headings", () => {
  it("read `## <version>, <codename> — <date>`, and without a codename `## <version> — <date>`", () => {
    expect(heading({ version: "0.37.0", codename: "Graia", date: "2026-10-22" })).toBe("## 0.37.0, Graia — 2026-10-22");
    expect(heading({ version: "0.36.1", date: "2026-10-22" })).toBe("## 0.36.1 — 2026-10-22");
  });

  it("parse back with and without a codename, for every name of both passes", () => {
    for (const codename of [...names, `${names[0]} II`, "Triplex Phall III"]) {
      expect(headings(heading({ version: "1.2.0", codename, date: "2026-10-22" }))).toEqual([{ version: "1.2.0", codename, date: "2026-10-22" }]);
    }
    expect(headings(NAMED).map((h) => [h.version, h.codename])).toEqual([["0.37.1", "Graia"], ["0.37.0", "Graia"], ["0.36.0", undefined]]);
  });

  it("parse every release heading of CHANGELOG.md, the older ones without a codename", () => {
    const log = readFileSync("CHANGELOG.md", "utf8");
    expect(headings(log).length).toBe(log.split("\n").filter((l) => l.startsWith("## ")).length);
    expect(headings(log).length).toBeGreaterThan(30);
  });

  it("give data/codenames.json, which the release step keeps in step with CHANGELOG.md", () => {
    expect(JSON.parse(readFileSync(CODENAMES, "utf8"))).toEqual(codenames(readFileSync("CHANGELOG.md", "utf8")));
    expect(codenames(NAMED)).toEqual({ "0.37": "Graia" });
  });
});

describe("the release step", () => {
  it("bumps a minor or a patch", () => {
    expect(bump("0.36.0", "minor")).toBe("0.37.0");
    expect(bump("0.37.2", "minor")).toBe("0.38.0");
    expect(bump("0.37.2", "patch")).toBe("0.37.3");
    expect(() => bump("0.37", "patch")).toThrow(/x\.y\.z/);
  });

  it("gives the next minor release the first name, above the older headings, which stay as they are", () => {
    const r = at("minor", "0.36.0", LOG);
    expect(r).toMatchObject({ version: "0.37.0", codename: "Graia", codenames: { "0.37": "Graia" } });
    expect(r.changelog).toBe(LOG.replace("# Changelog\n\n", "# Changelog\n\n## 0.37.0, Graia — 2026-10-24\n\n"));
  });

  it("gives a patch its minor's name, and none to a patch of a release from before the codenames", () => {
    expect(at("patch", "0.37.1", NAMED)).toMatchObject({ version: "0.37.2", codename: "Graia" });
    const old = at("patch", "0.36.0", LOG);
    expect(old.codename).toBeUndefined();
    expect(old.changelog.split("\n")[2]).toBe("## 0.36.1 — 2026-10-24");
    expect(old.codenames).toEqual({});
  });

  it("takes the next unused name for the next minor release: patches use none up", () => {
    expect(at("minor", "0.37.1", NAMED)).toMatchObject({ version: "0.38.0", codename: "Lucius", codenames: { "0.37": "Graia", "0.38": "Lucius" } });
  });

  it("goes on to the second pass with a numeral", () => {
    const log = NAMED.replace("# Changelog\n\n", "# Changelog\n\n## 0.38.0, Lucius — 2026-10-23\n\n");
    expect(at("minor", "0.38.0", log, ["Graia", "Lucius"]).codename).toBe("Graia II");
  });

  it("moves the lines written under `## Unreleased` under the new heading", () => {
    const r = at("minor", "0.36.0", LOG.replace("# Changelog\n\n", "# Changelog\n\n## Unreleased\n\n- A feature.\n\n"));
    expect(r.changelog.split("\n").slice(2, 5)).toEqual(["## 0.37.0, Graia — 2026-10-24", "", "- A feature."]);
    expect(r.changelog).not.toContain("Unreleased");
  });

  it("refuses a version the changelog already has", () => {
    expect(() => at("patch", "0.37.0", NAMED)).toThrow(/already has 0\.37\.1/);
  });

  it("writes the version, the lock file, the heading and the codenames in a repository", () => {
    const root = mkdtempSync(join(tmpdir(), "release-"));
    mkdirSync(join(root, "data"));
    const pkg = { name: "fixture", version: "0.36.0", private: true, scripts: { test: "vitest run" } };
    const lock = { name: "fixture", version: "0.36.0", lockfileVersion: 3, packages: { "": { name: "fixture", version: "0.36.0" }, "node_modules/x": { version: "1.0.0" } } };
    const put = (f: string, v: string) => writeFileSync(join(root, f), v);
    put("package.json", JSON.stringify(pkg, null, 2) + "\n");
    put("package-lock.json", JSON.stringify(lock, null, 2) + "\n");
    put("CHANGELOG.md", LOG);
    put(NAMES, JSON.stringify(["Graia", "Lucius"]));
    put(CODENAMES, "{}\n");
    const get = (f: string) => readFileSync(join(root, f), "utf8");

    runRelease(root, "minor", "2026-10-22");
    runRelease(root, "patch", "2026-10-23");
    const r = runRelease(root, "minor", "2026-10-24");

    expect(r).toMatchObject({ version: "0.38.0", codename: "Lucius" });
    expect(get("package.json")).toBe(JSON.stringify({ ...pkg, version: "0.38.0" }, null, 2) + "\n");
    const l = JSON.parse(get("package-lock.json"));
    expect([l.version, l.packages[""].version, l.packages["node_modules/x"].version]).toEqual(["0.38.0", "0.38.0", "1.0.0"]);
    expect(get("CHANGELOG.md").split("\n").filter((x) => x.startsWith("## "))).toEqual([
      "## 0.38.0, Lucius — 2026-10-24",
      "## 0.37.1, Graia — 2026-10-23",
      "## 0.37.0, Graia — 2026-10-22",
      "## 0.36.0 — 2026-10-20",
      "## 0.35.0 — 2026-10-20",
    ]);
    expect(get(CODENAMES)).toBe('{\n  "0.37": "Graia",\n  "0.38": "Lucius"\n}\n');
  });
});

describe("the footer's release line", () => {
  it("reads `drawn under XVI laws · <codename> · <version>`", () => {
    expect(releaseLine("0.37.0", "Graia")).toBe("drawn under XVI laws · Graia · 0.37.0");
    expect(releaseLine("0.37.2", codenameOf("0.37.2", { "0.37": "Graia" }))).toBe("drawn under XVI laws · Graia · 0.37.2");
  });

  it("shows the version alone, with no empty separator, before a codename exists", () => {
    expect(releaseLine("0.36.0")).toBe("drawn under XVI laws · 0.36.0");
    expect(releaseLine("0.36.1", codenameOf("0.36.1", { "0.37": "Graia" }))).toBe("drawn under XVI laws · 0.36.1");
    expect(releaseLine("0.36.0", codenameOf("0.36.0", {}))).not.toMatch(/·\s*·/);
  });

  it("reads the codename the release step writes", () => {
    const r = at("minor", "0.36.0", LOG);
    expect(releaseLine(r.version, codenameOf(r.version, r.codenames))).toBe("drawn under XVI laws · Graia · 0.37.0");
  });
});
