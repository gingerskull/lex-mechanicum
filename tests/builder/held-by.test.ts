// A shaft in plan held by a plate the record names (`heldBy`): the plate stands for the base along the axis, a dead axle
// stands in it on its shoulder and a live shaft runs in a housing cartridge behind it, on whichever side the parts are.
import { describe, expect, it } from "vitest";
import { buildAssembly } from "../../src/builder/build";
import type { Kin } from "../../src/kin/types";

/** A crank on a shaft along y, held by a side plate at y = side (its faces y = side and side - 6). */
function heldKin(side: number, pivotY: number, live: boolean): Kin {
  return {
    bodies: [
      { id: "ground", role: "ground", shape: { type: "plate", rect: [100, 100] }, at: { frame: { origin: [0, 0, -8] } } },
      {
        id: "plate",
        role: "frame",
        shape: { type: "plate", exact: true, outline: [[-40, 10], [40, 10], [40, 90], [-40, 90]], thickness: 6, posts: [{ at: [-30, side - 3], top: 10, r: 5 }, { at: [30, side - 3], top: 10, r: 5 }] },
        frame: { origin: [0, side, 0], z: [0, -1, 0], x: [1, 0, 0] },
      },
      { id: "crank", role: live ? "driver" : "link", shape: { type: "link", length: 25, boss: [9, 7] }, at: { joint: "O" } },
    ],
    joints: [{ id: "O", type: "revolute", a: "ground", b: "crank", at: [0, pivotY, 50], axis: [0, 1, 0], heldBy: "plate" }],
    params: [],
    design: [],
    drivers: [{ id: "input", joint: "O", kind: live ? "rotary" : "oscillating", range: live ? [0, 360] : [-20, 20], default: 0, ...(live ? {} : { lo: -20, hi: 20 }) }],
    solve: [],
    points: [],
    outputs: [],
    fallback: null,
  } as unknown as Kin;
}

describe("heldBy", () => {
  it("holds the shaft from the plate when the part is on the plate's far side, flipping the stack", async () => {
    // the crank at y about -40, outboard of a plate whose faces are y = -10 and -16
    const a = await buildAssembly({ id: "fx-held", kin: heldKin(-10, -40, false) } as never);
    expect(a.solids.some((s) => s.id.includes("-pb"))).toBe(false);
    const axle = a.solids.find((s) => s.id === "O-axle")!;
    expect(axle).toBeDefined();
    // the shaft reaches the crank on the plate's far side
    const crank = a.solids.find((s) => s.id === "crank")!;
    expect(Math.min(axle.frame.o[1], crank.frame.o[1])).toBeLessThan(-35);
    // the plate is bored where the axle passes
    const plate = a.solids.find((s) => s.id === "plate")!;
    expect(plate.profile.holes.length).toBeGreaterThan(0);
    expect(a.issues.filter((i) => i.includes("heldBy") || i.includes("both sides"))).toEqual([]);
  });

  it("runs a live shaft in a housing cartridge named for the plate", async () => {
    const a = await buildAssembly({ id: "fx-held-live", kin: heldKin(-10, -40, true) } as never);
    const housing = a.solids.find((s) => s.id === "O-housing")!;
    expect(housing).toBeDefined();
    expect(housing.name).toMatch(/to the plate$/);
    expect(a.solids.some((s) => s.id.includes("-pb"))).toBe(false);
  });
});
