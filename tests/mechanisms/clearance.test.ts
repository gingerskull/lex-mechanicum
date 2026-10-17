// A15 and A12 for every registered mechanism: zero clashes over the cycle and no rotating part clamped against
// ground. One `it` per id, so a changed-files filter can select it.
import { describe, expect, it } from "vitest";
import { assemble } from "../../src/assemble";
import { clampCheck } from "../../src/assemble/clamp";
import { clearance } from "../../src/assemble/clearance";
import { mechanisms } from "../../src/mechanisms";

describe("clearance", () => {
  for (const id of Object.keys(mechanisms))
    it(id, { timeout: 60_000 }, async () => {
      const { model, polish } = await mechanisms[id]!();
      const a = assemble(model, undefined, polish ? { polish } : {});
      expect(clearance(model, a).map((c) => `${c.a} x ${c.b} ${c.depth.toFixed(2)} mm`)).toEqual([]);
      expect(clampCheck(model, a)).toEqual([]);
    });
});

describe("four-bar without polish", () => {
  it("contains every J1, J2, J3 and drive component by name", async () => {
    const { model } = await mechanisms["four-bar"]!();
    const a = assemble(model);
    const names = a.solids.map((s) => s.name).filter(Boolean).join("\n");
    for (const re of [
      // J1 at O4
      /Axle, shoulder bolt Ø6/, /Bearing F?686/, /Internal circlip DIN 472/, /Thrust washer/, /Bridge over the pivot/, /Standoff Ø10 x .*spigot/,
      // J2 at O2
      /Bearing housing/, /Bearing 6800-2RS/, /Wave washer/, /Dowel pin Ø3/, /Input shaft Ø10 h6, feather key/, /Feather key 3 x 3/, /Countersunk M5 into the shaft end/, /Retaining washer/,
      // J3 at A and B
      /Shoulder bolt Ø8 x .*M6 \(ISO 7379\)/, /Bearing F?688/, /Inner-race spacer/,
      // drive
      /Brushless pancake motor Ø50 x 18/, /Motor bracket Ø50, one piece/, /Timing belt GT2/, /Input pulley GT2 32T/, /Motor pulley GT2 16T/, /Pulley flanges/, /Home flag/, /Fork sensor/, /Terminal block/, /P-clip/, /Motor phase leads/, /Sensor lead/,
    ])
      expect(names).toMatch(re);
  });
});
