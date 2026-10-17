import { describe, expect, it } from "vitest";
import { assembleWith } from "../../src/assemble";
import { clampCheck } from "../../src/assemble/clamp";
import { H } from "../../src/hardware/primitives";
import fourBar from "../../src/mechanisms/four-bar/model";

describe("clamp check", () => {
  it("is clean on the generated four-bar", () => {
    const { assembly: a } = assembleWith(fourBar);
    expect(clampCheck(fourBar, a)).toEqual([]);
  });

  it("reports a rotating spacer that touches the base face", () => {
    const { assembly: a } = assembleWith(fourBar);
    // a spacer on the crank pin sitting on the base top face
    a.solids.push(H.spacer("bad", 8.2, 14, { body: "crank", at: [40, 0, 0], z0: a.b1, z1: a.b1 + 1 }));
    expect(clampCheck(fourBar, a).some((s) => s.startsWith("bad (turning) touches the ground face of base"))).toBe(true);
  });
});
