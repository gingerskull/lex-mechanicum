import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { autoTable, rules } from "../../src/rules/registry";

/** Requirement ids of the AUTO rows in sections 5.1, 5b, 6.1, 7 and 8 of the standard (every J row is AUTO). */
function autoIds(): string[] {
  const text = readFileSync(new URL("../../docs/mechanism-standard.md", import.meta.url), "utf8");
  const sections = [/^### 5\.1 /m, /^### 5b\. /m, /^### 6\.1 /m, /^## 7\. /m, /^## 8\. /m];
  const ids: string[] = [];
  for (const re of sections) {
    const start = text.search(re);
    expect(start, String(re)).toBeGreaterThan(0);
    // the section runs to the next heading after its own
    const rest = text.slice(text.indexOf("\n", start) + 1);
    const end = rest.search(/^#{2,3} /m);
    const body = end > 0 ? rest.slice(0, end) : rest;
    for (const line of body.split("\n")) {
      const cells = line.split("|").map((c) => c.trim());
      const id = cells[1] ?? "";
      if (!/^[A-Z]{1,2}\d+$/.test(id)) continue;
      if (id.startsWith("J") || cells.slice(2).some((c) => /\bAUTO\b/.test(c))) ids.push(id);
    }
  }
  return [...new Set(ids)];
}

describe("rules registry", () => {
  it("has unique rule ids, every rule AUTO", () => {
    expect(new Set(rules.map((r) => r.id)).size).toBe(rules.length);
    for (const r of rules) expect(r.tier).toBe("AUTO");
  });

  it("serves every AUTO requirement id of the standard", () => {
    const served = new Set(autoTable().flatMap((r) => r.ids));
    const ids = autoIds();
    expect(ids.length).toBeGreaterThan(30);
    expect(ids.filter((id) => !served.has(id))).toEqual([]);
  });
});
