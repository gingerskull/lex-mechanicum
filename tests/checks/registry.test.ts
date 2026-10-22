// The registry (a mechanism is a record audited at 3.0 or later), and the result cache of the 3D checks.
import { mkdtempSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { compareVersions } from "../../src/audit/sheet";
import { loadCatalog } from "../../src/catalog";
import { cacheKey, check3d, PROFILES } from "../../src/checks/run";
import { allIds, auditedStandard, isBuilt, isKnown, V3_STANDARD } from "../../src/mechanisms";
import { pin, plate, slidingPlacer } from "../fixtures/clash3";

describe("the registry", () => {
  it("registers every record whose audit is at 3.0 or later, in catalogue order", () => {
    const ids = allIds();
    expect(ids.length).toBeGreaterThan(0);
    for (const id of ids) expect(compareVersions(auditedStandard(id)!, V3_STANDARD), id).toBeGreaterThanOrEqual(0);
    const order = loadCatalog().mechanisms.map((r) => r.id).filter(isBuilt);
    expect(ids).toEqual(order);
    expect(isKnown("four-bar")).toBe(true);
    expect(isKnown("no-such-mechanism")).toBe(false);
  });
});

describe("check3d and its cache", () => {
  const solids = [plate("a", "ground", [0, 0, 100, 100], 0, 5), plate("b", "mover", [120, 0, 220, 100], 3, 8), pin("p", "mover", 160, 50, 5, 0, 20)];
  const src = { id: "fx-cache", solids, placer: slidingPlacer(["mover"], 130), contact: [] };

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
