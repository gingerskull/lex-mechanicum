// A manual driver worked by a hand on another body (`hand` on the driver: the plug-door hinge's handle on its door, the
// driver's joint the hinge tube): a pull handle on that body's face at the hand point, the joint a plain pivot; a piece
// the record joins to a pin (`joints` on a piece) is a member of its stack; the track kit reads a placed arm's own faces.
import { afterAll, describe, expect, it } from "vitest";
import { buildWithContext } from "../../src/builder/build";
import { worldManifold } from "../../src/builder/sweeps";
import { fixtureRecord } from "./fixtures";

const built = buildWithContext(fixtureRecord("plug-door-hinge"));
afterAll(async () => (await built).ctx.dispose());

const box = (ctx: Awaited<typeof built>["ctx"], id: string) => {
  const m = worldManifold(ctx.M, ctx.get(id)!);
  const b = m.boundingBox();
  m.delete();
  return b;
};

describe("hand on another body", () => {
  it("puts a pull handle on the door's inner face at the hand point, with no knob", async () => {
    const { ctx, assembly } = await built;
    for (const id of ["drive-grip-post0", "drive-grip-post1", "drive-grip-bar", "drive-grip-sc0"]) expect(ctx.get(id)?.body, id).toBe("door");
    expect(ctx.get("drive-knob")).toBeUndefined();
    const bar = box(ctx, "drive-grip-bar");
    // the handle point is [62, 10.2, 17] on the door, whose inner face is y = 10.2: the bar stands off it, inside
    expect((bar.min[0] + bar.max[0]) / 2).toBeCloseTo(62, 3);
    expect((bar.min[2] + bar.max[2]) / 2).toBeCloseTo(17, 3);
    expect(bar.min[1]).toBeGreaterThan(10.2);
    expect(ctx.issues.filter((s) => s.startsWith("drive"))).toEqual([]);
    expect(assembly.notes.find((n) => n.id === "drive")!.note).toMatch(/pull handle on door/);
  });

  it("builds the driver's joint as a plain pivot, not an input shaft", async () => {
    const { ctx } = await built;
    const H = ctx.sites.find((s) => s.joints.includes("H"))!;
    expect(H.live).toBe(false);
    expect(H.kit).toBe("J1");
    expect(ctx.get("H-hold")).toBeUndefined();
  });

  it("makes a piece the record joins to a pin a member of its stack (the door's ear over the goose-neck at N)", async () => {
    const { ctx } = await built;
    const ear = box(ctx, "door-ear");
    const bolt = box(ctx, "N-bolt-s2");
    expect(bolt.max[2]).toBeGreaterThan(ear.max[2]);
    expect(ctx.solids.filter((s) => s.id.startsWith("N-") && s.body === "door").length).toBeGreaterThan(2);
  });

  it("stands the track plate under the placed guide arm", async () => {
    const { ctx } = await built;
    const plate = box(ctx, "F-plate");
    const roller = box(ctx, "F-roller");
    expect(plate.max[2]).toBeLessThan(0);
    expect(roller.max[2]).toBeLessThan(0);
    expect(ctx.issues.filter((s) => s.includes("joint F"))).toEqual([]);
  });
});
