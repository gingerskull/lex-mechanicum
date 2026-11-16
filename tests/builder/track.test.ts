// The track kit: a pin-in-slot whose slot is a composite track is built as a roller on a stud in a groove cut along the
// track in a plate on the base, with liners, a felt oiler, screws and dowels; every solid of it is sound (D11), the
// groove follows the track, and the plate stands on the base under the arm.
import { afterAll, describe, expect, it } from "vitest";
import { buildWithContext } from "../../src/builder/build";
import { fromPlane, planeCoords } from "../../src/builder/frames";
import { TRACK_FOLLOWER } from "../../src/builder/shapes";
import { trackNearest } from "../../src/kin/blocks/track";
import { xf } from "../../src/kin/math";
import { checkMesh } from "../../src/solids/check";
import { meshOf } from "../../src/solids/manifold";
import { check3d, clashLines } from "../../src/checks/run";
import { recordSource } from "../../src/checks/source";
import { fixtureRecord } from "./fixtures";

const built = buildWithContext(fixtureRecord("kin:trackFollower"));
afterAll(async () => (await built).ctx.dispose());

describe("track kit", () => {
  it("classifies the pin in a track and builds the plate and the follower", async () => {
    const { ctx, assembly } = await built;
    expect(ctx.joints.find((j) => j.id === "F")!.kit).toBe("track");
    expect(ctx.fired["track-follower"]).toContain("F");
    expect(ctx.issues.filter((s) => s.includes("joint F"))).toEqual([]);
    for (const id of ["F-plate", "F-liner0", "F-liner1", "F-felt", "F-stud", "F-roller", "F-tw", "F-cl", "F-dw0", "F-dw1", "F-sc0"]) expect(ctx.get(id), id).toBeDefined();
    expect(ctx.get("F-plate")!.body).toBe("ground");
    expect(ctx.get("F-roller")!.body).toBe("arm");
    expect(ctx.get("F-plate")!.features!.length).toBeGreaterThan(0);
    expect(assembly.notes.find((n) => n.id === "F")!.badge).toEqual(["track built", "ok"]);
  });

  it("makes every solid of the kit sound", async () => {
    const { ctx } = await built;
    const mine = ctx.solids.filter((s) => s.id.startsWith("F-"));
    expect(mine.length).toBeGreaterThan(10);
    for (const s of mine) expect(checkMesh(meshOf(ctx.M, s)).issues, s.id).toEqual([]);
  });

  it("keeps the roller on the track and inside the groove over the cycle", async () => {
    const { ctx } = await built;
    const T = ctx.joints.find((j) => j.id === "F")!.r.slot!.track!;
    const roller = ctx.get("F-roller")!;
    for (let i = 0; i < ctx.sampled.us.length; i++) {
      const c = xf.apply(ctx.xfOf("arm", i), fromPlane(roller.frame, [0, 0], 0));
      const q = planeCoords({ o: T.o, x: T.x, z: T.n }, c).uv;
      expect(trackNearest(T.t, q).d).toBeLessThan(1e-6);
    }
    // the groove is the roller's Ø and its play wide, between the liners
    const plate = ctx.get("F-plate")!;
    const groove = plate.features![0]!.profile.outer;
    const at = planeCoords(plate.frame, T.o).uv;
    const near = Math.min(...groove.map((p) => Math.hypot(p[0] - at[0], p[1] - at[1])));
    expect(near).toBeCloseTo(TRACK_FOLLOWER.D / 2 + TRACK_FOLLOWER.play + TRACK_FOLLOWER.liner, 1);
  });

  it("stands the plate on the base, below the arm and every part that sweeps over it, a sleeve down to the roller", async () => {
    const { ctx } = await built;
    const plate = ctx.get("F-plate")!;
    expect(plate.frame.o[2]).toBeCloseTo(ctx.base!.top, 6);
    const e = ctx.extent("arm")!;
    const top = plate.frame.o[2] + (plate.op as { h: number }).h;
    expect(fromPlane(e.frame, [0, 0], e.w0)[2] - top).toBeGreaterThanOrEqual(TRACK_FOLLOWER.gap - 1e-9);
    // here the crank sweeps over the plate under the arm: the plate goes under it, the sleeve fills the stud to the arm
    expect(ctx.get("F-sleeve")).toBeDefined();
  });

  it("clears every moving part (A15) and leaves the walls round its holes (M6)", async () => {
    const r = await check3d(await recordSource(fixtureRecord("kin:trackFollower")), "ci", { cache: false });
    expect(clashLines(r)).toEqual([]);
    expect(r.clamp).toEqual([]);
    expect(r.edges).toEqual([]);
  }, 60000);
});
