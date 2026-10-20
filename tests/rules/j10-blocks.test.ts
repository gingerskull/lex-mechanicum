// J10's block placement: a block past the far end of what the shaft carries stands there unless a moving part's
// sweep outline meets its area in plan (the housing's over the foot, the foot's for a sweep that reaches down to it).
// A worm, whose wheel's teeth pass beside its ends, stands between its two blocks; a bevel pinion, whose wheel lies
// under its far end, stays overhung on both blocks behind it.
import { describe, expect, it } from "vitest";
import { assemble } from "../../src/assemble";
import { j9Model, j9WormModel } from "../fixtures/models";

describe("J10 blocks against the sweeps' outlines (A9)", () => {
  it("stands a worm between its two blocks, never overhung", () => {
    const a = assemble(j9WormModel);
    const get = (id: string) => a.solids.find((s) => s.id === id);
    const w = get("worm")!;
    expect(get("pW-blkA")!.z1).toBeLessThan(w.z0);
    expect(get("pW-blkB")!.z0).toBeGreaterThan(w.z1);
    // no end retainer: the worm is not on the shaft's free end
    expect(get("pW-end-w")).toBeUndefined();
    const J = a.joints.find((j) => j.id === "pW")!;
    expect(J.note).not.toMatch(/behind the part/);
    // the wheel's teeth reach into the strip of the far block's foot along the shaft, under the housing's height
    const wheel = get("wheel")!;
    const tip = Math.max(...wheel.outer.map(([x, y]) => Math.hypot(x, y)));
    const foot = get("pW-blkB-foot")!;
    const [x0, y1] = [Math.min(...foot.outer.map((p) => p[0])), Math.max(...foot.outer.map((p) => p[1]))];
    expect(Math.hypot(x0, y1)).toBeLessThan(tip);
    expect(wheel.z0).toBeGreaterThanOrEqual(foot.z1);
  });

  it("keeps a bevel pinion overhung, both blocks behind it", () => {
    const a = assemble(j9Model);
    const get = (id: string) => a.solids.find((s) => s.id === id)!;
    const p = get("pinion");
    expect(get("pQ-blkA").z1).toBeLessThan(p.z0);
    expect(get("pQ-blkB").z1).toBeLessThan(p.z0);
    expect(a.joints.find((j) => j.id === "pQ")!.note).toMatch(/both behind the part/);
  });
});
