// The phone bench page builds as a static folder: the page, its scripts (the worker included), fonts and packages.
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { decode2 } from "../../src/package/format2";
import { buildPage } from "../../tools/bench-page/build";

const out = mkdtempSync(join(tmpdir(), "bench-page-"));
afterAll(() => rmSync(out, { recursive: true, force: true }));

describe("bench page", () => {
  it("builds the page, the scripts and the packages of the ids", async () => {
    const id = "four-bar";
    await buildPage(out, [id]);
    const files = ["index.html", "main.js", "setup-worker.js", `packages/${id}.mx2`, `meta/${id}.json`];
    for (const f of files) expect(existsSync(join(out, f)), f).toBe(true);
    expect(readFileSync(join(out, "index.html"), "utf8")).toContain(`data-ids="${id}"`);
    const pkg = await decode2(new Uint8Array(readFileSync(join(out, `packages/${id}.mx2`))));
    expect(pkg.id).toBe(id);
    expect(pkg.solids.length).toBeGreaterThan(50);
  }, 60_000);
});
