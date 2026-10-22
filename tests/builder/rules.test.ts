// Every rule has a fixture: a record whose build makes the rule fire (A21), and the registry serves every AUTO requirement
// of the standard, which is what the generated AUTO table in the standard is made from.
import { readFileSync } from "node:fs";
import { afterAll, describe, expect, it } from "vitest";
import { buildWithContext } from "../../src/builder/build";
import type { BuildCtx } from "../../src/builder/ctx";
import { autoTable, rules } from "../../src/builder/registry";
import { fixtureRecord } from "./fixtures";

const built = new Map<string, Promise<{ ctx: BuildCtx }>>();
const build = (name: string) => {
  if (!built.has(name)) built.set(name, buildWithContext(fixtureRecord(name)).then(({ ctx }) => ({ ctx })));
  return built.get(name)!;
};
afterAll(async () => {
  for (const p of built.values()) (await p).ctx.dispose();
});

describe("rule registry", () => {
  it("has unique rule ids, every rule AUTO, every rule with a fixture", () => {
    expect(new Set(rules.map((r) => r.id)).size).toBe(rules.length);
    for (const r of rules) {
      expect(r.tier).toBe("AUTO");
      expect(r.fixture, r.id).toBeTruthy();
    }
  });

  it("serves every AUTO requirement id of the standard", () => {
    const text = readFileSync(new URL("../../docs/mechanism-standard.md", import.meta.url), "utf8");
    const sections = [/^### 5\.1 /m, /^### 5b\. /m, /^### 6\.1 /m, /^## 7\. /m, /^## 8\. /m];
    const ids: string[] = [];
    for (const re of sections) {
      const start = text.search(re);
      expect(start, String(re)).toBeGreaterThan(0);
      const rest = text.slice(text.indexOf("\n", start) + 1);
      const end = rest.search(/^#{2,3} /m);
      for (const line of (end > 0 ? rest.slice(0, end) : rest).split("\n")) {
        const cells = line.split("|").map((c) => c.trim());
        const id = cells[1] ?? "";
        if (!/^[A-Z]{1,2}\d+$/.test(id)) continue;
        if (id.startsWith("J") || cells.slice(2).some((c) => /\bAUTO\b/.test(c))) ids.push(id);
      }
    }
    const served = new Set(autoTable().flatMap((r) => r.ids));
    expect([...new Set(ids)].filter((id) => !served.has(id))).toEqual([]);
  });
});

describe("rule fixtures", () => {
  for (const r of rules) {
    it(`${r.id} fires on ${r.fixture}`, async () => {
      const { ctx } = await build(r.fixture);
      expect(r.applies(ctx), `${r.id} applies`).toBe(true);
      expect(ctx.fired[r.id]?.length ?? 0, `${r.id} fired`).toBeGreaterThan(0);
    });
  }
});
