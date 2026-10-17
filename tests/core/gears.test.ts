import { describe, expect, it } from "vitest";
import { TAU } from "../../src/core/geom";
import { mesh, meshIn } from "../../src/core/gears";

describe("mesh", () => {
  it("puts a gap of gear 2 at the pitch point when gear 1 has a tooth there", () => {
    const z2 = 28;
    const th2 = mesh(0, 14, z2, 0);
    // the pitch point is at direction π from gear 2's centre; teeth sit at k·2π/z2, gaps half a pitch between
    const local = (((Math.PI - th2) % (TAU / z2)) + TAU / z2) % (TAU / z2);
    expect(local).toBeCloseTo(TAU / z2 / 2, 12);
  });

  it("rolls at the tooth ratio", () => {
    for (let u = -3; u <= 7; u += 0.37) expect(mesh(u, 14, 28, 0) - mesh(0, 14, 28, 0)).toBeCloseTo((-u * 14) / 28, 12);
  });

  it("meshIn: a planet rolling inside a fixed ring turns backward at zr/zp", () => {
    const zr = 60;
    const zp = 20;
    expect(meshIn(0, zr, zp, 0.3) - meshIn(0, zr, zp, 0)).toBeCloseTo(0.3 - (0.3 * zr) / zp, 12);
  });
});
