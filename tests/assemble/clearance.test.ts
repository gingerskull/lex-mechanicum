// A15 across axes: a z solid against one on an x or y axis is tested by its posed outline against the other's plan
// footprint where their boxes meet, so a wheel beside a pillow block is clear by its teeth, while a block moved into
// the teeth still clashes.
import { describe, expect, it } from "vitest";
import { assemble } from "../../src/assemble";
import { boxOverlap } from "../../src/core/axis";
import { CLASH_TOL, clearance } from "../../src/assemble/clearance";
import { indexParts, solidBox, solidPose } from "../../src/assemble/pose";
import type { Vec2 } from "../../src/core/geom";
import { j9Model, j9WormModel } from "../fixtures/models";

describe("clearance between a z solid and one on an x or y axis (A15)", () => {
  const a = assemble(j9WormModel);
  const get = (id: string) => a.solids.find((s) => s.id === id)!;

  it("clears a wheel whose box meets a block's but whose teeth do not", () => {
    const m = j9WormModel;
    const parts = indexParts(m);
    const s = m.solve(0);
    const box = (id: string) => solidBox(get(id), solidPose(m, parts, get(id), s, 0)!, s);
    // the boxes meet by more than the tolerance: the box test alone saw a clash here
    expect(boxOverlap(box("wheel"), box("pW-blkB"))).toBeGreaterThan(CLASH_TOL);
    expect(clearance(m, a).map((c) => `${c.a} x ${c.b}`)).toEqual([]);
  });

  it("still finds a block moved into the wheel's teeth", () => {
    // the far block's housing moved 20 mm across the shaft toward the wheel (its plane's u is world y)
    const moved = { ...a, solids: a.solids.map((t) => (t.id === "pW-blkB" ? { ...t, outer: t.outer.map(([p, q]): Vec2 => [p + 20, q]) } : t)) };
    const hit = clearance(j9WormModel, moved).find((c) => c.a === "wheel" && c.b === "pW-blkB");
    expect(hit?.depth).toBeGreaterThan(5);
  });

  it("keeps the bevel pair clear", () => {
    expect(clearance(j9Model, assemble(j9Model)).map((c) => `${c.a} x ${c.b}`)).toEqual([]);
  });
});
