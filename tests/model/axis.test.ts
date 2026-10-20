// Parts on an x or y axis (src/core/axis.ts): the model check, poses in the part's own plane, the world outline, the
// explode along the base z, the 3D-box clearance and clamp checks, and the package flag.
import { describe, expect, it } from "vitest";
import { assembleWith, type Assembly } from "../../src/assemble";
import { clampCheck } from "../../src/assemble/clamp";
import { clearance } from "../../src/assemble/clearance";
import { indexParts, solidBox, solidPose } from "../../src/assemble/pose";
import { circle, type Vec2 } from "../../src/core/geom";
import { screw } from "../../src/hardware/primitives";
import { solid } from "../../src/hardware/solid";
import { checkModel } from "../../src/model/check";
import { defineMechanism } from "../../src/model/define";
import { sample } from "../../src/model/sample";
import { envelope, zSweep } from "../../src/package/build";
import { axisOfPacked, decode, encode, pack } from "../../src/package/format";
import { heights } from "../../src/parts";
import { outline3, prepare, worldSolids } from "../../src/render/world";
import { createContext } from "../../src/rules/context";
import { rigidExplode } from "../../src/rules/explode";
import { FORM } from "../../src/style/form";
import { axisModel } from "../fixtures/models";

const rect = (x0: number, x1: number, y0: number, y1: number): Vec2[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];

function packed() {
  const sampled = sample(axisModel);
  const { assembly } = assembleWith(axisModel, { rules: [], sampled });
  return pack({ id: axisModel.id, ...assembly, envelope: envelope(axisModel, assembly), zOut: zSweep(axisModel, assembly) }, sampled);
}

describe("axis on parts", () => {
  it("passes the model check, and asks an x or y part for its place along the axis", () => {
    expect(checkModel(axisModel, 72).findings).toEqual([]);
    const bad = defineMechanism({ ...axisModel, id: "fx-axis-bad", parts: axisModel.parts.map((p) => (p.id === "shaft" ? { ...p, along: undefined } : p)) });
    expect(checkModel(bad, 72).findings.map((f) => f.type)).toContain("AXIS");
  });

  it("gives an x or y part its extent along the axis", () => {
    const parts = indexParts(axisModel);
    expect(heights(parts.shaft!)).toEqual([-40, 40]);
    expect(heights(parts.wheel!)).toEqual([40, 46]);
  });

  it("poses an x and a y solid in their own planes", () => {
    const ctx = createContext(axisModel);
    const parts = indexParts(axisModel);
    const s = axisModel.solve(1);
    const shaft = ctx.solidOf.shaft!;
    const wheel = ctx.solidOf.wheel!;
    expect(shaft.axis).toBe("x");
    expect(wheel.axis).toBe("y");
    expect(ctx.solidOf.plate!.axis).toBeUndefined();
    const qs = solidPose(axisModel, parts, shaft, s, 1)!;
    expect(qs).toEqual([0, 30, 1]);
    const bs = solidBox(shaft, qs);
    expect([bs[0], bs[3]]).toEqual([-40, 40]);
    expect(bs[1]).toBeCloseTo(-5, 1);
    expect(bs[5]).toBeCloseTo(35, 1);
    const bw = solidBox(wheel, solidPose(axisModel, parts, wheel, s, 1)!);
    expect([bw[1], bw[4]]).toEqual([40, 46]);
    expect(bw[0]).toBeCloseTo(40, 1);
    expect(bw[5]).toBeCloseTo(50, 1);
  });

  it("packs the axis as a flag and the world z of the out-of-plane solids in the bounds", async () => {
    const back = await decode(await encode(packed()));
    expect(Object.fromEntries(back.solids.map((s) => [s.id, axisOfPacked(s)]))).toEqual({ shaft: "x", wheel: "y", plate: "z" });
    expect(back.bounds.z1).toBeCloseTo(50, 1);
    expect(back.bounds.maxX).toBeGreaterThanOrEqual(80 - 0.1);
    expect(back.bounds.minX).toBeLessThanOrEqual(-40);
  });

  it("turns an x and a y solid's outline into world coordinates, and lifts them along z in the explode", () => {
    const P = prepare(packed());
    const parts = indexParts(axisModel);
    const s = axisModel.solve(0);
    const W0 = worldSolids(P, axisModel, parts, s, 0, 0, () => true);
    const shaft = W0.find((w) => w.p.s.id === "shaft")!;
    expect(shaft.along).toEqual([-40, 40]);
    expect([shaft.bb[0], shaft.bb[2]]).toEqual([-40, 40]);
    expect(shaft.z0).toBeCloseTo(25, 1);
    expect(shaft.z1).toBeCloseTo(35, 1);
    for (const [x, y, z] of outline3(shaft, -40)) {
      expect(x).toBe(-40);
      expect(Math.hypot(y, z - 30)).toBeCloseTo(5, 1);
    }
    const wheel = W0.find((w) => w.p.s.id === "wheel")!;
    for (const [x, y, z] of outline3(wheel, 46)) {
      expect(y).toBe(46);
      expect(Math.hypot(x - 60, z - 30)).toBeCloseTo(20, 1);
    }
    const W1 = worldSolids(P, axisModel, parts, s, 0, 1, () => true);
    for (const id of ["shaft", "wheel"]) {
      const a = W0.find((w) => w.p.s.id === id)!;
      const b = W1.find((w) => w.p.s.id === id)!;
      expect(a.p.s.ex).toBeGreaterThan(0);
      expect(b.z0 - a.z0).toBeCloseTo(FORM.explode.gap * a.p.s.ex, 6);
      expect(b.z1 - b.z0).toBeCloseTo(a.z1 - a.z0, 6);
      expect(b.along).toEqual(a.along);
      expect(b.bb[0]).toBe(a.bb[0]);
    }
  });

  it("explodes a mixed stack along the base z: a z screw clears the x block it passes, an x screw stays whole", () => {
    const ctx = createContext(axisModel);
    // a pillow block along x under the shaft, a z screw down through its foot, a set screw along x in its side
    const block = solid("block", { kind: "housing", axis: "x", outer: rect(-15, 15, 15, 40), holes: [circle(5.2, 0, 30)], z0: -10, z1: 10, ex: 1 });
    const down = screw("down", "socket", 4, 12, { at: [0, 0, 0], face: 25, dir: -1, ex: 0 });
    const side = screw("side", "socket", 3, 6, { axis: "x", at: [0, 36, 0], face: 10, dir: 1, ex: 3 });
    ctx.solids.push(block, ...down, ...side);
    rigidExplode(ctx);
    const head = ctx.solids.find((t) => t.kind === "head" && t.group === down[0]!.group)!;
    expect(head.ex).toBeGreaterThanOrEqual(block.ex + FORM.explode.clear);
    for (const t of down) expect(t.ex).toBe(head.ex);
    for (const t of side) expect(t.ex).toBe(side[0]!.ex);
    expect(ctx.solidOf.shaft!.ex).toBe(ctx.solidOf.wheel!.ex);
  });

  it("finds a clash between a shaft in plan and a z plate by their boxes, and none once the plate is below", () => {
    const shaft = createContext(axisModel).solidOf.shaft!;
    const plate = (z0: number, z1: number) => solid("pl", { kind: "plate", outer: rect(-10, 10, -20, 20), z0, z1 });
    const run = (z0: number, z1: number) => clearance(axisModel, { solids: [shaft, plate(z0, z1)] } as unknown as Assembly, 12);
    const hit = run(28, 40);
    expect(hit.length).toBe(1);
    expect(hit[0]!.depth).toBeCloseTo(7, 1);
    expect(run(10, 20)).toEqual([]);
    // a turning shaft resting on a ground plate's top face is a clamp fault (A12)
    expect(clampCheck(axisModel, { solids: [shaft, plate(15, 25.0)] } as unknown as Assembly, 4).length).toBe(1);
    expect(clampCheck(axisModel, { solids: [shaft, plate(15, 20)] } as unknown as Assembly, 4)).toEqual([]);
  });
});
