// The hand fixes of the spatial-engine pilots (bevel gear pair, block and tackle) promoted to rules: the drive for a
// rotary input on a shaft in plan, the base under an outer pillow block and the end retainer on an overhung shaft end
// (J10), the straddle bridge for a gear in a crossed mesh and the bridge search that sees an x part's sweep (J2, A9),
// the J2 spacer stopping at the J9 thrust washer, the rope rule's guards, becket, hook and part count (J12), and
// stretched parts read at their solved outline by the model check and classify.
import { describe, expect, it } from "vitest";
import { assemble, assembleWith } from "../../src/assemble";
import { clampCheck } from "../../src/assemble/clamp";
import { clearance } from "../../src/assemble/clearance";
import { bbox } from "../../src/core/geom";
import { depth } from "../../src/core/poly";
import { mechanisms } from "../../src/mechanisms";
import { checkModel } from "../../src/model/check";
import { createContext } from "../../src/rules/context";
import { classify } from "../../src/rules/classify";
import { j12 } from "../../src/rules/j12-flexible";
import { j2Straddle } from "../../src/rules/j2-straddle";
import type { PinJoint } from "../../src/rules/types";
import { j10RotaryModel, j9DriveModel, j9Model, ropeBecketModel, stretchModel } from "../fixtures/models";
import { contextBefore, run } from "./helpers";

describe("drive for a rotary input on a shaft in plan (V1 to V6)", () => {
  for (const m of [j9DriveModel, j10RotaryModel])
    it(`${m.id}: a motor beside the shaft, belted across it to a pulley on its free end, clear over the cycle`, () => {
      const { assembly: a } = assembleWith(m);
      const get = (id: string) => a.solids.find((s) => s.id === id)!;
      const shaft = get(m === j9DriveModel ? "pQ-shaft" : "pS-shaft");
      // the motor, its pulley, the belt and the upright lie in the shaft's plane; the pulley on the shaft's end
      for (const id of ["drive-motor", "drive-bell", "drive-pulley-m", "drive-pulley-in", "drive-belt", "drive-upright", "drive-pulley-m-fl0"]) expect(get(id).axis).toBe("x");
      const pin = get("drive-pulley-in");
      expect(Math.min(pin.z0 - shaft.z0, shaft.z1 - pin.z1)).toBeLessThan(14);
      // the bracket's foot, the post, leads and the terminal block lie on the base, which carries them
      const base = get("base");
      for (const id of ["drive-foot", "drive-post", "drive-terminal", "drive-lead1"]) {
        expect(get(id).axis).toBeUndefined();
        expect(get(id).outer.every((p) => depth(base.outer, [], [p[0] + get(id).at[0], p[1] + get(id).at[1]]) >= 0)).toBe(true);
      }
      // the motor clears the foot under it and turns at the belt ratio
      expect(get("drive-bell").motion).toMatchObject({ type: "geared", ratio: 2 });
      const J = a.joints.find((j) => j.id === "drive")!;
      expect(J.note).toMatch(/beside the input's shaft in plan/);
      expect(J.serves.F10).toEqual(expect.arrayContaining(["drive-flag", "drive-sensor"]));
      expect(clearance(m, a).map((c) => `${c.a} x ${c.b}`)).toEqual([]);
      expect(clampCheck(m, a)).toEqual([]);
    });

  it("turns the fork sensor beside a shaft too low to have it underneath", () => {
    const a = assemble(j10RotaryModel);
    const post = a.solids.find((s) => s.id === "drive-post")!;
    expect(post.z1).toBeGreaterThan(post.z0 + 5);
    expect(Math.abs(post.at[1])).toBeGreaterThan(20);
  });
});

describe("J10: base under an outer block, end retainer on an overhung shaft end", () => {
  it("grows the base under both pillow blocks", () => {
    const a = assemble(j9Model);
    const base = a.solids.find((s) => s.id === "base")!;
    for (const id of ["pQ-blkA-foot", "pQ-blkB-foot"]) for (const p of a.solids.find((s) => s.id === id)!.outer) expect(depth(base.outer, [], p)).toBeGreaterThanOrEqual(2);
  });

  it("holds the overhung pinion on the shaft end by a washer and a countersunk screw (F2)", () => {
    const { assembly: a, ctx } = assembleWith(j9Model);
    const get = (id: string) => a.solids.find((s) => s.id === id)!;
    const pinion = get("pinion");
    expect(get("pQ-shaft").z1).toBeCloseTo(pinion.z1, 6);
    expect(get("pQ-end-w")).toMatchObject({ axis: "x", body: "pinion", z0: pinion.z1 });
    expect(get("pQ-end").name).toMatch(/Countersunk M\d x 10/);
    expect(get("pQ-end-sh").axis).toBe("x");
    expect(ctx.joint("pQ")!.serves.F2).toEqual(expect.arrayContaining(["pQ-end-w", "pQ-end"]));
  });
});

describe("J2 straddle for a gear in a crossed mesh (A9)", () => {
  it("bridges the wheel's live shaft, the bridge's box clear of the pinion's swept box", () => {
    const ctx = contextBefore(j9Model, j2Straddle);
    run(ctx, j2Straddle);
    const br = ctx.get("pG-bridge")!;
    expect(br).toBeDefined();
    expect(ctx.joint("pG")!.badge?.[0]).toBe("straddle mounted");
    const [x0, y0, x1, y1] = bbox(br.outer);
    const sw = ctx.sweeps().find((s) => s.part.id === "pinion")!;
    const [p0, q0, p1, q1] = bbox(sw.regions.flatMap((g) => [[g.box[0], g.box[1]], [g.box[2], g.box[3]]] as [number, number][]));
    const apart = p0 >= x1 || p1 <= x0 || q0 >= y1 || q1 <= y0 || sw.z1 <= br.z0 || sw.z0 >= br.z1;
    expect(apart).toBe(true);
    const { assembly } = assembleWith(j9Model);
    expect(clearance(j9Model, assembly).map((c) => `${c.a} x ${c.b}`)).toEqual([]);
  });
});

describe("J2 and J9 stacks under a gear's back face", () => {
  it("stops the J2 spacer at the J9 thrust washer", () => {
    const a = assemble(j9Model);
    const sp = a.solids.find((s) => s.id === "pG-tw-sp")!;
    const tw = a.solids.find((s) => s.id === "mesh-pinion-gear-gear-tw0")!;
    expect(sp).toBeDefined();
    expect(sp.z1).toBeCloseTo(tw.z0, 6);
  });
});

describe("J12 rope", () => {
  const built = () => {
    const ctx = contextBefore(ropeBecketModel, j12);
    return { ctx, added: run(ctx, j12) };
  };

  it("guards every sheave whose centre stands still, not only fixed parts", () => {
    const { added } = built();
    const guards = added.filter((s) => s.id.endsWith("-guard"));
    expect(guards.map((s) => s.id).sort()).toEqual(["flex-rope-0-u1-guard", "flex-rope-0-u2-guard"]);
    expect(guards.filter((s) => s.name).map((s) => s.qty)).toEqual([2]);
  });

  it("sets the becket and the hook at their own sheaves' heights and stands the becket on a post", () => {
    const { ctx } = built();
    const u1 = ctx.solidOf["u1"]!;
    const u2 = ctx.solidOf["u2"]!;
    expect(ctx.get("flex-rope-0-becket")).toMatchObject({ z0: u2.z0 - 2, z1: u2.z1 + 2 });
    expect(ctx.get("flex-rope-0-hook")).toMatchObject({ z0: u1.z0, z1: u1.z1 });
    const pin = ctx.get("flex-rope-0-becket-pin")!;
    expect(ctx.get("flex-rope-0-becket-post")).toMatchObject({ z0: ctx.b1, z1: pin.z0, kind: "standoff" });
    expect(ctx.get("flex-rope-0-becket-post-bot")).toBeDefined();
  });

  it("lets a wrap touch its sheave and the spans it joins", () => {
    const { ctx } = built();
    expect(ctx.solidOf["w1"]!.allow).toEqual(expect.arrayContaining(["u1", "spanA", "spanM"]));
    expect(ctx.solidOf["w1"]!.allow).not.toContain("spanB");
  });

  it("counts the parts that carry the load", async () => {
    expect(built().ctx.joint("flex-rope-0")!.note).toMatch(/one part carries the load/);
    const { model } = await mechanisms["block-and-tackle"]!();
    expect(assemble(model).joints.find((j) => j.id === "flex-rope-0")!.note).toMatch(/four parts carry the load, so the fall moves four times as far/);
  });

  it("builds clear over the cycle", () => {
    const { assembly } = assembleWith(ropeBecketModel);
    expect(clearance(ropeBecketModel, assembly).map((c) => `${c.a} x ${c.b}`)).toEqual([]);
    expect(checkModel(ropeBecketModel).findings).toEqual([]);
  });
});

describe("stretched parts at their solved outline", () => {
  it("the model check sees a stretched span cross a plate on its layer", () => {
    expect(checkModel(stretchModel).findings.map((f) => f.type)).toContain("OVERLAP");
  });

  it("classify joins a pin through a stretched span's far end", () => {
    const ctx = createContext(stretchModel);
    classify.apply(ctx);
    const j = ctx.info.find((x): x is PinJoint => x.kind === "pin" && x.id === "pX")!;
    expect(j.joined.map((x) => [x.part.id, x.how])).toEqual([["span", "bore"]]);
  });
});
