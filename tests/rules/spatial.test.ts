// The rules for spatial joints (standard 2.7): J10 shaft in plan, J9 crossed-axis mesh, J11 screw, the universal
// joint's cross bearings, and the model check's mixed-axis joints. Each on its fixture model.
import { describe, expect, it } from "vitest";
import { assembleWith } from "../../src/assemble";
import { clampCheck } from "../../src/assemble/clamp";
import { clearance } from "../../src/assemble/clearance";
import { crossBearings } from "../../src/hardware/sub/misc";
import { pillowRise } from "../../src/hardware/sub/pillow";
import { MIXED_AXIS_JOINTS, checkModel } from "../../src/model/check";
import { defineMechanism } from "../../src/model/define";
import { createContext } from "../../src/rules/context";
import { j9 } from "../../src/rules/j9-crossed-mesh";
import { j10 } from "../../src/rules/j10-shaft-in-plan";
import { j11 } from "../../src/rules/j11-screw";
import { j10DeadModel, j10Model, j11Model, j9Model, j1Model } from "../fixtures/models";
import { contextBefore, kinds, run } from "./helpers";

describe("J10 shaft in plan", () => {
  it("classifies a fixed pin on an x axis as J10 and drops the base so its blocks fit", () => {
    const ctx = createContext(j10Model);
    // the shaft's centre stands at least a block's rise over the base top
    expect(30 - ctx.b1).toBeGreaterThanOrEqual(pillowRise(6) - 1e-9);
    const c = contextBefore(j10Model, j10);
    expect(c.info.find((j) => j.kind === "pin")!.type).toBe("J10");
  });

  it("builds two pillow blocks (foot, housing on the axis, bearing), screws and dowels, the shaft and two collars", () => {
    const ctx = contextBefore(j10Model, j10);
    const added = run(ctx, j10);
    const k = kinds(added);
    expect(k.housing).toBe(4); // two feet, two housings
    expect(k.bearing).toBe(2);
    expect(k.circlipInternal).toBe(2); // the located block only
    expect(k.dowel).toBe(4);
    expect(k.head).toBe(4);
    expect(k.collar).toBe(2);
    expect(k.shaft).toBeGreaterThanOrEqual(1);
    // what stands on the base is on the plan axis; what turns with or carries the shaft is on the shaft's axis
    for (const s of added) {
      if (s.id.endsWith("-foot") || s.kind === "head" || s.kind === "shank" || s.kind === "dowel") expect(s.axis, s.id).toBeUndefined();
      else expect(s.axis, s.id).toBe("x");
    }
    const J = ctx.joint("pS")!;
    expect(J.type).toBe("J10");
    expect(J.serves.F1).toHaveLength(4);
    expect(J.serves.F2!.length).toBeGreaterThanOrEqual(2);
  });

  it("assembles live and dead shafts in plan with no clash and no clamp fault", () => {
    for (const m of [j10Model, j10DeadModel]) {
      const { assembly } = assembleWith(m);
      expect(clearance(m, assembly, 24), m.id).toEqual([]);
      expect(clampCheck(m, assembly, 6), m.id).toEqual([]);
    }
    // the dead shaft carries the wheel on its own bearing, its blocks clamp it
    const { assembly } = assembleWith(j10DeadModel);
    expect(assembly.solids.some((s) => s.kind === "bearing" && s.body === "wheel" && s.axis === "x")).toBe(true);
    expect(assembly.solids.some((s) => s.kind === "setScrew" && s.id.startsWith("pS-blk"))).toBe(true);
  });

  it("puts a handwheel on the free shaft end of a hand-turned input", () => {
    const { assembly } = assembleWith(j10Model);
    const w = assembly.solids.find((s) => s.id === "drive-wheel")!;
    expect(w.axis).toBe("x");
    const blk = assembly.solids.find((s) => s.id === "pS-blkB")!;
    expect(w.z0).toBeGreaterThanOrEqual(blk.z1);
  });
});

describe("J9 crossed-axis mesh", () => {
  it("shims each gear at its back face, takes the bevel's thrust away from the apex, marks the mesh", () => {
    const ctx = contextBefore(j9Model, j9);
    const added = run(ctx, j9);
    expect(kinds(added)).toEqual({ shim: 2, thrustWasher: 2 });
    const pin = added.find((s) => s.id.endsWith("pinion-shim"))!;
    expect(pin.axis).toBe("x");
    // the pinion's back face is its wide end, at its z0 (the cone narrows toward the apex)
    expect(pin.z1).toBeCloseTo(ctx.solidOf.pinion!.z0, 9);
    const J = ctx.joint("mesh-pinion-gear")!;
    expect(J.type).toBe("J9");
    expect(J.serves.F7).toHaveLength(2);
    expect(J.serves.F4).toHaveLength(2);
    expect(ctx.solidOf.gear!.marks.some((m) => m.kind === "timing")).toBe(true);
  });

  it("sets the pinion's blocks behind it where the wheel sweeps past its far end, and assembles with no clash", () => {
    const { assembly } = assembleWith(j9Model);
    const pin = assembly.solids.find((s) => s.id === "pinion")!;
    for (const id of ["pQ-blkA", "pQ-blkB"]) expect(assembly.solids.find((s) => s.id === id)!.z1).toBeLessThanOrEqual(pin.z0);
    expect(clearance(j9Model, assembly, 24)).toEqual([]);
  });
});

describe("J11 screw", () => {
  it("draws the screw's thread at its lead and puts a nut, its screws and an anti-rotation key on the carriage", () => {
    const ctx = contextBefore(j11Model, j11);
    const added = run(ctx, j11);
    expect(ctx.solidOf.screw!.helix).toBe(3);
    const nut = added.find((s) => s.id.endsWith("-nut"))!;
    expect(nut.body).toBe("carriage");
    expect(nut.allow).toContain("screw");
    expect(added.some((s) => s.id.endsWith("-antirot"))).toBe(true);
    expect(ctx.joint("screw-screw")!.type).toBe("J11");
    // the screw's end bearings come from its shaft in plan
    expect(ctx.info.find((j) => j.kind === "pin")!.type).toBe("J10");
  });

  it("gives a ball nut its ball return and two wipers", () => {
    const m = defineMechanism({ ...j11Model, id: "fx-j11-ball", screws: [{ screw: "screw", nut: "carriage", lead: 5, form: "ball" }] });
    const ctx = contextBefore(m, j11);
    const added = run(ctx, j11);
    expect(kinds(added).wiper).toBe(2);
    expect(added.some((s) => s.id.endsWith("-return"))).toBe(true);
  });

  it("assembles with no clash and no clamp fault", () => {
    const { assembly } = assembleWith(j11Model);
    expect(clearance(j11Model, assembly, 24)).toEqual([]);
    expect(clampCheck(j11Model, assembly, 6)).toEqual([]);
  });
});

describe("universal joint cross bearings", () => {
  it("puts a needle cup and a circlip on each of the four arms, on the arm's axis", () => {
    const ctx = createContext(j1Model);
    const out = crossBearings(ctx, "uj", { at: [0, 0], zc: 30, r: 20, d: 8, ex: 0, joint: "uj" });
    expect(kinds(out)).toEqual({ bearing: 4, circlipExternal: 4 });
    expect(out.filter((s) => s.kind === "bearing").map((s) => s.axis)).toEqual(["x", "x", "y", "y"]);
    const cup = out[0]!;
    expect(cup.z1).toBe(20);
    expect(cup.at).toEqual([0, 30, 0]);
  });
});

describe("mixed-axis joints in the model check", () => {
  it("lets J9 and J11 join parts on different axes, and asks a crossed mesh for two axes", () => {
    expect(MIXED_AXIS_JOINTS).toEqual(["J9", "J11"]);
    expect(checkModel(j9Model).findings).toEqual([]);
    expect(checkModel(j11Model).findings).toEqual([]);
    const same = defineMechanism({ ...j9Model, id: "fx-j9-same", meshes: [{ a: "gear", b: "gear", form: "bevel" }] });
    expect(checkModel(same, 72).findings.map((f) => f.type)).toContain("AXIS");
  });
});
