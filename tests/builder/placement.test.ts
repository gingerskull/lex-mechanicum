// The placement solver (A18) against the hand layers the first builds of two mechanisms used: no more slabs than the
// hand-set layers, and at least the hand clevises (a clevis is only taken where it needs no new slab).
import { afterAll, describe, expect, it } from "vitest";
import { buildWithContext } from "../../src/builder/build";
import type { BuildCtx } from "../../src/builder/ctx";
import { recordById } from "../../src/catalog";

// a record two tests read is built once
const built = new Map<string, Promise<BuildCtx>>();
const build = (id: string) => {
  if (!built.has(id)) built.set(id, buildWithContext(recordById(id)!).then(({ ctx }) => ctx));
  return built.get(id)!;
};
afterAll(async () => {
  for (const c of built.values()) (await c).dispose();
});

/** The layers the hand set and the clevis twins it declared, in the models these mechanisms were first built from. */
const HAND = { "jansen-linkage": { layers: 3, clevis: 0 }, "stephenson-six-bar": { layers: 3, clevis: 0 } } as const;

describe("placement solver", () => {
  for (const [id, h] of Object.entries(HAND)) {
    it(`${id}: no more slabs than the hand layers, no fewer clevises`, async () => {
      const ctx = await build(id);
      expect(ctx.placement.height).toBeLessThanOrEqual(h.layers);
      expect(ctx.placement.clevis.length).toBeGreaterThanOrEqual(h.clevis);
      expect(ctx.placement.conflicts).toEqual([]);
    });
  }

  it("keeps parts that meet apart and lets parts that never meet share a slab (A10)", async () => {
    const ctx = await build("jansen-linkage");
    const slab = (b: string) => ctx.placement.slab.get(b)![1];
    // the crank, the upper triangle and the foot never meet: one plane; the bars that pass over them are in the next
    expect(slab("crank")).toBe(slab("upper"));
    expect(slab("upper")).toBe(slab("foot"));
    expect(slab("j")).toBeGreaterThan(slab("crank"));
    expect(slab("k")).toBeGreaterThan(slab("j"));
  });

  it("stacks a compound gear's levels one slab apart, each meshing at its own level", async () => {
    const ctx = await build("gear-train");
    const slab = (b: string) => ctx.placement.slab.get(b)![1];
    // the cluster's 36 teeth mesh with the input in one slab, its 12-tooth level with the output in the next
    expect(slab("cluster#1")).toBe(slab("cluster") + 1);
    expect(slab("a")).toBe(slab("cluster"));
    expect(slab("d")).toBe(slab("cluster#1"));
    const level = ctx.solids.find((s) => s.id === "cluster-z12")!;
    expect(level.body).toBe("cluster");
    expect(ctx.placement.conflicts).toEqual([]);
  });

  it("builds a joined level as one piece with the level under it, and hangs an undriven live shaft from its bridge", async () => {
    const ctx = await build("ravigneaux");
    const slab = (b: string) => ctx.placement.slab.get(b)![1];
    // the long pinion meshes the short pinion and small sun in one slab and the large sun and ring in the next, nothing
    // between; the carrier spider under them
    expect(slab("long0#1")).toBe(slab("long0") + 1);
    expect(slab("short0")).toBe(slab("long0"));
    expect(slab("sunL")).toBe(slab("long0#1"));
    expect(slab("ring")).toBe(slab("long0#1"));
    expect(slab("carrier")).toBeLessThan(slab("sunS"));
    expect(ctx.placement.relaxed).toEqual([]);
    const low = ctx.solids.find((x) => x.id === "long0")!;
    const up = ctx.solids.find((x) => x.id === "long0-z24-upper")!;
    const h = (x: typeof low) => (x.op as { h: number }).h;
    expect(up.frame.o[2]).toBeCloseTo(low.frame.o[2] + h(low), 6);
    // the small sun's shaft stands on its housing (the drive); the large sun's runs in the bridge alone
    expect(ctx.stacks.get("Jss")!.support).toBe("housing");
    expect(ctx.stacks.get("Jsl")!.support).toBe("hung");
    expect(ctx.solids.some((x) => x.id === "Jsl-housing")).toBe(false);
    // the large sun covers the small one in plan: drawn see-through
    expect(ctx.solids.find((x) => x.id === "sunL")!.flags.seeThrough).toBe(true);
  }, 120_000);
});

