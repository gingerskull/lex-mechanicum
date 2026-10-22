// The phone bench page builds as a static folder: the page, its scripts (the worker included), fonts and packages.
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { allIds, engineOf } from "../../src/checks/engine";
import { decode2 } from "../../src/package/format2";
import { buildPage } from "../../tools/bench-page/build";

const out = mkdtempSync(join(tmpdir(), "bench-page-"));
afterAll(() => rmSync(out, { recursive: true, force: true }));

describe("bench page", () => {
  it("builds the page, the scripts and the packages of the ids", async () => {
    // a mechanism still on the 2.5D engine carries both packages (the rebuild moves them over one batch at a time)
    const id = allIds().find((x) => engineOf(x) === "2.5D") ?? "four-bar";
    await buildPage(out, [id]);
    const files = ["index.html", "main.js", "setup-worker.js", `packages/${id}.mx2`, ...(engineOf(id) === "2.5D" ? [`packages/${id}.mxp`] : [])];
    for (const f of files) expect(existsSync(join(out, f)), f).toBe(true);
    expect(readFileSync(join(out, "index.html"), "utf8")).toContain(`data-ids="${id}"`);
    const pkg = await decode2(new Uint8Array(readFileSync(join(out, `packages/${id}.mx2`))));
    expect(pkg.id).toBe(id);
    expect(pkg.solids.length).toBeGreaterThan(50);
  }, 60_000);
});
