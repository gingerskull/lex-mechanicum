import { describe, expect, it } from "vitest";
import { assembleWith } from "../../src/assemble";
import { clampCheck, edgeCheck } from "../../src/assemble/clamp";
import { H } from "../../src/hardware/primitives";
import fourBar from "../../src/mechanisms/four-bar/model";
import geneva from "../../src/mechanisms/geneva/model";

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

  it("is clean on a Ø8 input: the housing sleeve and the pulley spacer bear only on the inner rings", () => {
    const { assembly: a } = assembleWith(geneva);
    expect(clampCheck(geneva, a)).toEqual([]);
  });
});

describe("edge check", () => {
  it("judges round holes only: a window whose bounding box is square is not a hole of that size", () => {
    const { assembly: a } = assembleWith(fourBar);
    const coupler = a.solids.find((s) => s.id === "coupler")!;
    // a diamond window, 20 mm across, close to the edge: its bounding box is square
    coupler.holes.push([[50, 2], [60, 12], [50, 22], [40, 12]]);
    expect(edgeCheck(a)).toEqual([]);
  });
});
