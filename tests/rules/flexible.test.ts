// Members that change shape (standard 2.8): stretched spans, conveyed chain links, deforming outlines and their GPU
// items, the bend overlay's input, and the rules for flexible members (J12) and compliant joints (J13).
import { describe, expect, it } from "vitest";
import { assembleWith } from "../../src/assemble";
import { clampCheck } from "../../src/assemble/clamp";
import { clearance } from "../../src/assemble/clearance";
import { alongPath, indexParts, shapeAt, solidPose } from "../../src/assemble/pose";
import { beltLength, beltPath, centresFor, pathLength } from "../../src/core/flex";
import { checkModel } from "../../src/model/check";
import { buildFrom } from "../../src/package/build";
import { decode, encode, hasFlag } from "../../src/package/format";
import { buildItems, ITEM_TEXELS, refreshItems } from "../../src/render/gl/geometry";
import { prepare, worldSolids } from "../../src/render/world";
import { j12, sprocketR } from "../../src/rules/j12-flexible";
import { j13 } from "../../src/rules/j13-compliant";
import { chainModel, deformModel, flexureModel, ropeModel } from "../fixtures/models";
import { contextBefore, kinds, run } from "./helpers";

describe("flexible member geometry", () => {
  it("finds the centre distance for a whole number of links and lays the path round both wheels", () => {
    const r1 = sprocketR(15, 12.7);
    const r2 = sprocketR(30, 12.7);
    expect(2 * r1).toBeCloseTo(61.08, 2);
    expect(2 * r2).toBeCloseTo(121.5, 1);
    const C = centresFor(r1, r2, 62 * 12.7);
    expect(beltLength(r1, r2, C)).toBeCloseTo(62 * 12.7, 6);
    // the polyline's chords run a little short of the arcs
    const P = beltPath([0, 0], r1, [C, 0], r2, Math.PI / 90);
    expect(pathLength(P)).toBeCloseTo(62 * 12.7, 0);
    expect(alongPath([[0, 0], [10, 0], [10, 10], [0, 10]], 15)).toEqual([10, 5, Math.PI / 2]);
    expect(alongPath([[0, 0], [10, 0], [10, 10], [0, 10]], 45)[0]).toBeCloseTo(5, 9);
  });
});

describe("stretched, conveyed and deforming members", () => {
  it("stretches a rope span's unit outline to its two points' distance", () => {
    const { assembly } = assembleWith(ropeModel);
    const span = assembly.solids.find((s) => s.id === "spanA")!;
    expect(span.stretch).toEqual(["A0", "A"]);
    const parts = indexParts(ropeModel);
    for (const u of [0, 1, 2.5]) {
      const s = ropeModel.solve(u);
      const L = Math.hypot(s.pts.A![0] - s.pts.A0![0], s.pts.A![1] - s.pts.A0![1]);
      const xs = shapeAt(parts, span, s).map((p) => p[0]);
      expect(Math.max(...xs)).toBeCloseTo(L, 9);
    }
  });

  it("carries each chain roller along the path by the solved travel, a pitch apart", () => {
    const { assembly } = assembleWith(chainModel);
    const parts = indexParts(chainModel);
    const r0 = assembly.solids.find((s) => s.id === "flex-chain-0-r0")!;
    const r1 = assembly.solids.find((s) => s.id === "flex-chain-0-r1")!;
    expect(kinds(assembly.solids.filter((s) => s.joints.includes("flex-chain-0") && s.motion?.type === "convey"))).toEqual({ roller: 62, plate: 124 });
    for (const u of [0, 0.7, 3]) {
      const s = chainModel.solve(u);
      const a = solidPose(chainModel, parts, r0, s, u)!;
      const b = solidPose(chainModel, parts, r1, s, u)!;
      // neighbouring rollers are about a pitch apart (a chord on the arcs)
      expect(Math.hypot(b[0] - a[0], b[1] - a[1])).toBeGreaterThan(12.2);
      expect(Math.hypot(b[0] - a[0], b[1] - a[1])).toBeLessThan(12.75);
    }
  });

  it("takes a deforming outline from the solved state, packs the flag, and refreshes its GPU items in place", async () => {
    const b = buildFrom(deformModel.id, { model: deformModel });
    const back = await decode(await encode(b.pkg));
    const fs = back.solids.find((s) => s.id === "flexspline")!;
    expect(hasFlag(fs, "deform")).toBe(true);
    const P = prepare(back);
    const p = P.find((x) => x.s.id === "flexspline")!;
    expect(p.dyn).toBe("deform");
    expect(p.edges).toBeNull();
    const items = buildItems(P);
    const W = worldSolids(P, deformModel, indexParts(deformModel), deformModel.solve(1), 1, 0, () => true);
    const w = W.find((x) => x.p === p)!;
    expect(w.local!.outer).toHaveLength(120);
    const before = items.data.slice();
    const [lo, hi] = refreshItems(items, p, w.local!);
    const it = items.solids.get(p)!;
    expect([lo, hi]).toEqual([it.outer[0], it.verts[0] + it.verts[1] - 1]);
    // only the solid's own items change, and its first edge now starts at the deformed outline's first point
    for (let i = 0; i < items.data.length; i++) if (i < lo * ITEM_TEXELS * 4 || i >= (hi + 1) * ITEM_TEXELS * 4) expect(items.data[i]).toBe(before[i]);
    const o = it.outer[0] * ITEM_TEXELS * 4;
    expect(items.data[o + 4]).toBeCloseTo(w.local!.outer[0]![0], 4);
  });

  it("assembles each fixture with no clash and no clamp fault, and the model check accepts the declarations", () => {
    for (const m of [chainModel, ropeModel, flexureModel, deformModel]) {
      expect(checkModel(m).findings, m.id).toEqual([]);
      const { assembly } = assembleWith(m);
      expect(clearance(m, assembly, 24), m.id).toEqual([]);
      expect(clampCheck(m, assembly, 6), m.id).toEqual([]);
    }
  });
});

describe("J12 flexible members", () => {
  it("builds the chain's rollers and plates and an idler on a slotted arm (F7)", () => {
    const ctx = contextBefore(chainModel, j12);
    const added = run(ctx, j12);
    const k = kinds(added);
    expect(k.roller).toBe(62);
    expect(k.plate).toBe(124);
    expect(k.pulley).toBe(1);
    expect(k.bracket).toBe(1);
    expect(ctx.joint("flex-chain-0")!.serves.F7).toHaveLength(2);
  });

  it("gives the rope a swivel on its hook and a guard over each fixed sheave", () => {
    const ctx = contextBefore(ropeModel, j12);
    const added = run(ctx, j12);
    expect(added.filter((s) => s.kind === "stop")).toHaveLength(2);
    const sw = added.find((s) => s.id.endsWith("-swivel"))!;
    expect(sw.body).toBe("load");
    expect(ctx.joint("flex-rope-0")!.type).toBe("J12");
  });
});

describe("J13 compliant joints", () => {
  it("puts a stop pin just past each end of the swing and clamps the blank to the base", () => {
    const ctx = contextBefore(flexureModel, j13);
    const added = run(ctx, j13);
    const stops = added.filter((s) => s.kind === "stop");
    expect(stops).toHaveLength(2);
    // each stop clears the lever over the whole swing, by the margin
    const { assembly } = assembleWith(flexureModel);
    expect(clearance(flexureModel, assembly, 72).filter((c) => c.a.includes("stop") || c.b.includes("stop"))).toEqual([]);
    expect(added.some((s) => s.id.endsWith("-clamp"))).toBe(true);
    const J = ctx.joint("flexure-neck")!;
    expect(J.serves.F5).toHaveLength(2);
    expect(J.serves.F1).toHaveLength(2);
    // the model's bend overlay for the neck
    expect(flexureModel.angles!(flexureModel.solve(1), 1)[0]!.type).toBe("bend");
  });
});
