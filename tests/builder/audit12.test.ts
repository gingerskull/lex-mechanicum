// The twelve cases of the audits (hung or stub axles, bridge heights) built with no hand fix: every joint gets its
// stack, every support clears every moving part's sweep (A14), none is removed (T12), and a support that still covers a
// principle part is drawn see-through (T10).
import { afterAll, describe, expect, it } from "vitest";
import { MIN_GAP } from "../../src/builder/constants";
import { buildWithContext } from "../../src/builder/build";
import type { BuildCtx } from "../../src/builder/ctx";
import { clearance } from "../../src/builder/router";
import { recordById } from "../../src/catalog";

const CASES = [
  "antiparallelogram", "double-crank", "klann-linkage", "locomotive-drive", "parallelogram-linkage", "roberts-linkage",
  "stephenson-six-bar", "walschaerts-valve-gear", "whitworth", "jansen-linkage", "oscillating-cylinder", "hart-inversor",
];

const ctxs: BuildCtx[] = [];
afterAll(() => ctxs.forEach((c) => c.dispose()));

describe("the twelve audit cases", () => {
  for (const id of CASES) {
    it(id, async () => {
      const { assembly: a, ctx } = await buildWithContext(recordById(id)!);
      ctxs.push(ctx);
      // routed with no hand fix: nothing the router could not place, every site built
      expect(a.issues.filter((i) => /no (pair|place)|not built|stack along/.test(i))).toEqual([]);
      for (const s of ctx.sites) expect(ctx.stacks.has(s.id), `stack of ${s.id}`).toBe(true);
      expect(ctx.placement.conflicts).toEqual([]);
      // every routed support clears every moving part's swept volume by the margin of A14
      for (const r of a.routes) {
        const parts = ctx.solids.filter((s) => s.id.startsWith(r.support) && s.body === "ground" && s.kind !== "spigot" && s.kind !== "head" && s.kind !== "shank");
        expect(parts.length, `${r.support} built`).toBeGreaterThan(0);
        const g = clearance(ctx, parts, (q) => parts.includes(q), MIN_GAP + 1);
        expect(g, `${r.support} clearance`).toBeGreaterThanOrEqual(MIN_GAP - 0.05);
        // never removed (T12), and drawn see-through where it covers the principle (T10)
        if (r.covers.length) {
          const beam = ctx.solids.find((s) => s.id === r.support) ?? parts[0]!;
          expect(beam.flags.seeThrough, `${r.support} see-through`).toBe(true);
        }
      }
      // a dead axle held at both ends has its bridge; one a part sweeps over is a stub, never an unsupported axle
      for (const s of ctx.sites.filter((q) => q.fixed && !q.live && !q.inPlan)) {
        const st = ctx.stacks.get(s.id)!;
        expect(["bridge", "stub", "hung"]).toContain(st.support);
        if (st.support === "bridge" || st.support === "hung") expect(ctx.get(`${s.id}-bridge`), `${s.id} bridge`).toBeDefined();
      }
      // a live shaft is in a housing behind the base unless it is straddle mounted
      for (const s of ctx.sites.filter((q) => q.fixed && q.live && !q.inPlan)) expect(["housing", "bridge"]).toContain(ctx.stacks.get(s.id)!.support);
    }, 120_000);
  }
});
