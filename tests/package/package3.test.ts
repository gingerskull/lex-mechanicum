// A record packs as v2 by the hardware builder, with no model: the solids are sound and the package decodes to the same
// solids it was built with; a registered mechanism packs from its record and its polish.
import { describe, expect, it } from "vitest";
import { recordById } from "../../src/catalog";
import { buildPackage } from "../../src/package/build";
import { buildPackage3 } from "../../src/package/build3";
import { decode2, encode2 } from "../../src/package/format2";

describe("package v2 from a record", () => {
  it("a registered mechanism packs from its record and its polish", async () => {
    const b = await buildPackage("four-bar");
    expect(b.failed).toEqual([]);
    expect(b.pkg.id).toBe("four-bar");
    expect(b.pkg.solids.map((s) => s.id)).toEqual(b.solids.map((s) => s.id));
  }, 60_000);

  it("a record builds without a model: the solids are sound and the package round-trips", async () => {
    const b = await buildPackage3(recordById("universal-joint") as never);
    expect(b.failed).toEqual([]);
    expect(b.reports.filter((r) => !r.report.ok)).toEqual([]);
    const back = await decode2(await encode2(b.pkg));
    expect(back.id).toBe("universal-joint");
    expect(back.solids.map((s) => s.id)).toEqual(b.pkg.solids.map((s) => s.id));
    expect(back.joints.length).toBeGreaterThan(0);
    expect(back.bounds.z1).toBeGreaterThan(back.bounds.z0);
  }, 60_000);
});
