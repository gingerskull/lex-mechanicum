// The primitives lifted to Solid3: a lifted solid is the same outline, extruded over its z range, placed by its pose.
import { describe, expect, it } from "vitest";
import { solid } from "../../src/hardware/solid";
import { liftSolid } from "../../src/solids/lift";

const sq = [[-1, -1], [1, -1], [1, 1], [-1, 1]] as [number, number][];

describe("liftSolid", () => {
  it("places a plate by its pose and z0", () => {
    const s = liftSolid(solid("p", { kind: "plate", outer: sq, at: [5, 6, Math.PI / 2], z0: 2, z1: 5 }));
    expect(s.op).toMatchObject({ op: "extrude", h: 3 });
    expect(s.frame.o).toEqual([5, 6, 2]);
    expect(s.frame.x[0]).toBeCloseTo(0, 12);
    expect(s.frame.x[1]).toBeCloseTo(1, 12);
  });

  it("turns a quarter-turn helix into a twist and a long one into a thread", () => {
    const gear = liftSolid(solid("g", { kind: "part", outer: sq, z0: 0, z1: 4, helix: 32 }));
    expect(gear.op).toMatchObject({ op: "extrude", twist: 45 });
    const worm = liftSolid(solid("w", { kind: "shaft", outer: sq, z0: 0, z1: 20, helix: 4 }));
    expect(worm.op).not.toHaveProperty("twist");
    expect(worm.thread?.lead).toBe(4);
  });

  it("scales the top for a taper and keeps the plane of an axis solid", () => {
    const s = liftSolid(solid("b", { kind: "part", outer: sq, z0: 0, z1: 4, taper: 0.5, axis: "x" }));
    expect(s.op).toMatchObject({ op: "extrude", scaleTop: 0.5 });
    expect(s.legacyAxis).toBe("x");
  });
});
