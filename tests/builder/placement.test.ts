// The placement solver (A18) against the hand layers of the audited mechanisms: no more slabs than the hand-set layers,
// and at least the hand clevises (a clevis is only taken where it needs no new slab).
import { afterAll, describe, expect, it } from "vitest";
import { buildWithContext } from "../../src/builder/build";
import type { BuildCtx } from "../../src/builder/ctx";
import jansen from "../../src/mechanisms/jansen-linkage/model";
import stephenson from "../../src/mechanisms/stephenson-six-bar/model";
import { recordById } from "../../src/catalog";

const ctxs: BuildCtx[] = [];
afterAll(() => ctxs.forEach((c) => c.dispose()));

/** What the hand put in the model: the layers its mechanism parts use and the clevis twins it declared. */
function hand(model: { parts: { role: string; layer: number; twin?: string }[] }) {
  const parts = model.parts.filter((p) => p.role !== "pin" && p.role !== "trace");
  return { layers: new Set(parts.map((p) => p.layer)).size, clevis: parts.filter((p) => p.twin).length };
}

describe("placement solver", () => {
  for (const [id, model] of [["jansen-linkage", jansen], ["stephenson-six-bar", stephenson]] as const) {
    it(`${id}: no more slabs than the hand layers, no fewer clevises`, async () => {
      const { ctx } = await buildWithContext(recordById(id)!);
      ctxs.push(ctx);
      const h = hand(model as never);
      expect(ctx.placement.height).toBeLessThanOrEqual(h.layers);
      expect(ctx.placement.clevis.length).toBeGreaterThanOrEqual(h.clevis);
      expect(ctx.placement.conflicts).toEqual([]);
    });
  }

  it("keeps parts that meet apart and lets parts that never meet share a slab (A10)", async () => {
    const { ctx } = await buildWithContext(recordById("jansen-linkage")!);
    ctxs.push(ctx);
    const slab = (b: string) => ctx.placement.slab.get(b)![1];
    // the crank, the upper triangle and the foot never meet: one plane; the bars that pass over them are in the next
    expect(slab("crank")).toBe(slab("upper"));
    expect(slab("upper")).toBe(slab("foot"));
    expect(slab("j")).toBeGreaterThan(slab("crank"));
    expect(slab("k")).toBeGreaterThan(slab("j"));
  });
});
