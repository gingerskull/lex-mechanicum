import { describe, expect, it } from "vitest";
import { assembleWith } from "../../src/assemble";
import fourBar from "../../src/mechanisms/four-bar/model";
import { createContext } from "../../src/rules/context";
import { rigidExplode } from "../../src/rules/explode";
import { fasteners } from "../../src/rules/fasteners";
import { runRules } from "../../src/rules/registry";
import { j1Model } from "../fixtures/models";

describe("rigid explode", () => {
  it("leaves every solid on one level and every head with its shank", () => {
    const { assembly: a } = assembleWith(fourBar);
    for (const s of a.solids) {
      expect(Number.isFinite(s.ex), s.id).toBe(true);
      expect(s.span, s.id).toBeUndefined();
    }
    for (const h of a.solids.filter((s) => s.kind === "head")) {
      const body = a.solids.filter((s) => s.group === h.group && s !== h);
      expect(body.length, h.id).toBeGreaterThan(0);
      for (const s of body) expect(s.ex, `${h.id} / ${s.id}`).toBe(h.ex);
    }
  });

  it("sends a screw out on its head side and a nut out the far side", () => {
    const { assembly: a } = assembleWith(j1Model);
    const head = a.solids.find((s) => s.id === "pO-axle-head")!;
    const nut = a.solids.find((s) => s.id === "pO-nut")!;
    const arm = a.solids.find((s) => s.id === "arm")!;
    const base = a.solids.find((s) => s.id === "base")!;
    expect(head.ex).toBeGreaterThan(arm.ex);
    expect(nut.ex).toBeLessThan(base.ex);
  });

  it("never stretches a solid", () => {
    const ctx = createContext(fourBar);
    runRules(ctx);
    fasteners(ctx);
    const len = new Map(ctx.solids.map((s) => [s.id, s.z1 - s.z0]));
    rigidExplode(ctx);
    for (const s of ctx.solids) expect(s.z1 - s.z0, s.id).toBeCloseTo(len.get(s.id)!, 9);
  });
});
