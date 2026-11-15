// A bridge shaped as a narrow bar (`bridge: "bar"` on a fixed pin's joint: the plug-door hinge's dead axle at H): a bar
// of the posts' pad width from each post to a boss at the pin, not the plate over all three; the posts, the bushing and
// the screws as the router builds them.
import { afterAll, describe, expect, it } from "vitest";
import { buildWithContext } from "../../src/builder/build";
import { worldManifold } from "../../src/builder/sweeps";
import { H } from "../../src/hardware/primitives";
import { STANDOFF } from "../../src/hardware/tables";
import { fixtureRecord } from "./fixtures";

const built = buildWithContext(fixtureRecord("plug-door-hinge"));
afterAll(async () => (await built).ctx.dispose());

const area = (r: readonly [number, number][]): number => Math.abs(r.reduce((s, p, i) => s + p[0] * r[(i + 1) % r.length]![1] - r[(i + 1) % r.length]![0] * p[1], 0) / 2);

describe("bridge as a bar", () => {
  it("builds a bar from each post to a boss at the pin, well under the plate's area (63% here)", async () => {
    const { ctx } = await built;
    const site = ctx.sites.find((s) => s.joints.includes("H"))!;
    const route = ctx.stacks.get(site.id)!.bridge!.route;
    const [P0, P1] = route.posts;
    const plate = H.hullOf([[site.at[0], site.at[1], 10.5], [P0[0], P0[1], STANDOFF.D / 2 + 1.5], [P1[0], P1[1], STANDOFF.D / 2 + 1.5]]);
    expect(area(route.footprint)).toBeLessThan(0.7 * area(plate));
    const m = worldManifold(ctx.M, ctx.get("H-bridge")!);
    const b = m.boundingBox();
    m.delete();
    // it still reaches both posts and the pin
    for (const p of [P0, P1, [site.at[0], site.at[1]]]) {
      expect(p[0]).toBeGreaterThan(b.min[0] - 1e-6);
      expect(p[0]).toBeLessThan(b.max[0] + 1e-6);
      expect(p[1]).toBeGreaterThan(b.min[1] - 1e-6);
      expect(p[1]).toBeLessThan(b.max[1] + 1e-6);
    }
    expect(ctx.get("H-bridge")!.kind).toBe("bridge");
    for (const id of ["H-bridge-post0", "H-bridge-post1", "H-bb"]) expect(ctx.get(id), id).toBeDefined();
  });
});
