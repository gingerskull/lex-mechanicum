// Mesh phasing (J6): every parallel mesh of the gear records built on v3 has its teeth in each other's gaps over the
// whole cycle: the two outlines never cut into each other by more than a sliver.
import { afterAll, describe, expect, it } from "vitest";
import { buildWithContext } from "../../src/builder/build";
import type { BuildCtx } from "../../src/builder/ctx";
import { recordById } from "../../src/catalog";
import { meshOverlap } from "./meshes";

const ctxs: BuildCtx[] = [];
afterAll(() => ctxs.forEach((c) => c.dispose()));

describe("mesh phasing", () => {
  // a train of several meshes (gear train, planetary), an internal mesh, a rack, a gear on a moving centre, a non-circular pair cut conjugate
  for (const id of ["spur-gears", "gear-train", "rack-pinion", "internal-gear-pair", "planetary", "non-circular-gears"]) {
    it(`${id}: teeth in the gaps at every sample`, async () => {
      const { ctx } = await buildWithContext(recordById(id)!);
      ctxs.push(ctx);
      const r = meshOverlap(ctx);
      expect(r.length).toBeGreaterThan(0);
      // an internal pair of few teeth leaves a sliver at the tips of the involute ring's flanks
      for (const m of r) expect(m.max, `${id} ${m.joint}`).toBeLessThan(0.5);
      // a conjugate cut samples the cycle finely: a build takes a while
    }, 120_000);
  }
});
