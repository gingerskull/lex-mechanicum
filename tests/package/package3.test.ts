// The two engines side by side (S6): a 2.5D mechanism packs as v1 and v2 from its model; a record-only mechanism (no
// 2.5D model) packs as v2 from its record by the hardware builder, and decodes to the same solids it was built with.
import { describe, expect, it } from "vitest";
import { recordById } from "../../src/catalog";
import { buildAnyPackage } from "../../src/package/any";
import { buildPackage3 } from "../../src/package/build3";
import { decode2, encode2 } from "../../src/package/format2";

describe("package v2 from either engine", () => {
  it("a 2.5D mechanism gives both its v1 package and its v2 package", async () => {
    const b = await buildAnyPackage("slider-crank");
    expect(b.engine).toBe("2.5D");
    expect(b.v1).not.toBeNull();
    expect(b.pkg.solids.length).toBe(b.v1!.solids.length);
    expect(b.failed).toEqual([]);
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
