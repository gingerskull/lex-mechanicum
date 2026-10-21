// A15 and A12 for every registered mechanism: zero clashes over the cycle and no rotating part clamped against
// ground; L5: no working zone hidden under solid paper. One `it` per id, so a changed-files filter can select it.
// Each mechanism's assembly is also lifted to 3D solids and tested with Manifold (A15 in 3D, the CI profile: few phases, no
// audit of the hand `allow` exemptions, cached on the solids and their poses). That is the transition view of the 2.5D
// engine: it may not find a clash the baseline below does not already hold, and the baseline goes when the mechanism is
// rebuilt on engine v3 (S6).
import { describe, expect, it } from "vitest";
import { assemble, assembleWith } from "../../src/assemble";
import { clampCheck } from "../../src/assemble/clamp";
import { clearance } from "../../src/assemble/clearance";
import { check3d, clashLines, legacySource } from "../../src/checks";
import { mechanisms } from "../../src/mechanisms";
import { HIDDEN, hiddenShare } from "../../src/rules/see-through";

/**
 * Clashes the lifted 3D check finds in a frozen 2.5D mechanism that its outline check cannot see (a wiper pressed 1 mm
 * onto its rails: the old pipeline draws the seal compressed). They are not fixed here; the rebuild replaces the part.
 */
const LIFTED_BASELINE: Record<string, string[]> = {
  "flat-faced-cam": ["raila x slide-follower-wiper0", "railb x slide-follower-wiper0", "slide-follower-gib x slide-follower-wiper0"],
};

describe("clearance", () => {
  for (const id of Object.keys(mechanisms))
    it(id, { timeout: 60_000 }, async () => {
      const { model, polish } = await mechanisms[id]!();
      const { assembly: a, ctx } = assembleWith(model, polish ? { polish } : {});
      expect(clearance(model, a).map((c) => `${c.a} x ${c.b} ${c.depth.toFixed(2)} mm`)).toEqual([]);
      expect(clampCheck(model, a)).toEqual([]);
      expect(hiddenShare(ctx).filter((z) => z.hidden >= HIDDEN)).toEqual([]);
      const lifted = await check3d(legacySource(id, model, a), "ci");
      expect(clashLines(lifted).map((c) => c.replace(/ [\d.]+ mm$/, ""))).toEqual(LIFTED_BASELINE[id] ?? []);
    });
});

describe("four-bar without polish", () => {
  it("contains every J1, J2, J3 and drive component by name", async () => {
    const { model } = await mechanisms["four-bar"]!();
    const a = assemble(model);
    const names = a.solids.map((s) => s.name).filter(Boolean).join("\n");
    for (const re of [
      // J1 at O4
      /Axle, shoulder bolt Ø10/, /Bearing F6800 \(10x19x5\)/, /M8 nyloc/, /Internal circlip DIN 472/, /Thrust washer/, /Bridge over the pivot/, /Standoff Ø10 x .*spigot/,
      // J2 at O2
      /Bearing housing/, /Bearing 6800-2RS/, /Wave washer/, /Dowel pin Ø3/, /Input shaft Ø10 h6, feather key/, /Feather key 3 x 3/, /Countersunk M5 x \d+ \(ISO 10642\), into the shaft end/, /Retaining washer/,
      // J3 at A and B
      /Shoulder bolt Ø8 x .*M6 \(ISO 7379\)/, /Bearing F?688/, /Inner-race spacer/,
      // drive
      /Brushless pancake motor Ø50 x 18/, /Motor bracket Ø50, one piece/, /Timing belt GT2/, /Input pulley GT2 32T/, /Motor pulley GT2 16T/, /Pulley flanges/, /Home flag/, /Fork sensor/, /Terminal block/, /P-clip/, /Motor phase leads/, /Sensor lead/,
    ])
      expect(names).toMatch(re);
  });
});
