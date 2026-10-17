import { describe, expect, it } from "vitest";
import { TAU } from "../../src/core/geom";
import { recordById } from "../../src/catalog";
import { mechanisms } from "../../src/mechanisms";
import { checkModel } from "../../src/model/check";

describe("mechanisms", () => {
  for (const id of Object.keys(mechanisms))
    it(id, async () => {
      const { model } = await mechanisms[id]!();
      expect(model.id).toBe(id);
      expect(recordById(id)).toBeDefined();
      const r = checkModel(model);
      expect(r.findings).toEqual([]);
      expect(r.maxLinkErr).toBeLessThan(1e-9);
      if (id === "four-bar") {
        // K6: the catalogue gives 73.8° (54.9° to 128.7°); the exact swing is 73.78°; sampled at 0.5° of crank it must land within 0.2° of 73.8
        const f = model.plot!.f;
        const v: number[] = [];
        for (let i = 0; i < 720; i++) v.push(f(model.solve((i / 720) * TAU), (i / 720) * TAU));
        expect(Math.abs(Math.max(...v) - Math.min(...v) - 73.8)).toBeLessThanOrEqual(0.2);
      }
    });
});
