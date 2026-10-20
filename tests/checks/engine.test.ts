// Which engine a mechanism is on, and the result cache of the 3D checks.
import { mkdtempSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { allIds, engineOf, isKnown } from "../../src/checks/engine";
import { cacheKey, check3d, PROFILES } from "../../src/checks/run";
import { mechanisms } from "../../src/mechanisms";
import { pin, plate, slidingPlacer } from "../fixtures/clash3";

describe("engineOf", () => {
  it("puts every registered mechanism on the 2.5D engine until its audit is at 3.0 or later (S6)", () => {
    for (const id of Object.keys(mechanisms)) expect(engineOf(id)).toBe("2.5D");
    expect(allIds()).toEqual(expect.arrayContaining(Object.keys(mechanisms)));
    expect(isKnown("four-bar")).toBe(true);
    expect(isKnown("no-such-mechanism")).toBe(false);
  });
});

describe("check3d and its cache", () => {
  const solids = [plate("a", "ground", [0, 0, 100, 100], 0, 5), plate("b", "mover", [120, 0, 220, 100], 3, 8), pin("p", "mover", 160, 50, 5, 0, 20)];
  const src = { id: "fx-cache", engine: "v3" as const, solids, placer: slidingPlacer(["mover"], 130), contact: [] };

  it("keys on the solids, the poses and the profile", () => {
    const k = cacheKey(src, PROFILES.ci);
    expect(cacheKey(src, PROFILES.ci)).toBe(k);
    expect(cacheKey(src, PROFILES.full)).not.toBe(k);
    expect(cacheKey({ ...src, solids: [solids[0]!, { ...solids[1]!, frame: { ...solids[1]!.frame, o: [0, 0, 4] } }, solids[2]!] }, PROFILES.ci)).not.toBe(k);
    expect(cacheKey({ ...src, placer: slidingPlacer(["mover"], 131) }, PROFILES.ci)).not.toBe(k);
  });

  it("writes a result once and reads it back", async () => {
    const dir = mkdtempSync(join(tmpdir(), "checks3-"));
    try {
      const first = await check3d(src, "ci", { dir });
      expect(first.cached).toBe(false);
      expect(first.clash.clashes.map((c) => `${c.a} x ${c.b}`)).toContain("a x b");
      expect(readdirSync(dir)).toHaveLength(1);
      const again = await check3d(src, "ci", { dir });
      expect(again.cached).toBe(true);
      expect(again.clash.clashes).toEqual(first.clash.clashes);
      expect((await check3d(src, "ci", { dir, cache: false })).cached).toBe(false);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
