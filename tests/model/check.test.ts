import { describe, expect, it } from "vitest";
import { roundRect } from "../../src/core/geom";
import { V } from "../../src/core/vec";
import { checkModel } from "../../src/model/check";
import { defineMechanism } from "../../src/model/define";
import { sample, basePlate } from "../../src/model/sample";
import type { Vec2 } from "../../src/model/types";
import fourBar from "../../src/mechanisms/four-bar/model";
import { P } from "../../src/parts";

const O: Vec2 = [0, 0];
const types = (m: Parameters<typeof checkModel>[0]) => checkModel(m, 180).findings.map((f) => f.type);

describe("checkModel", () => {
  it("reports LINK_LEN for a link whose solved length differs from its modelled length", () => {
    const m = defineMechanism({
      id: "fixture-link",
      input: { kind: "rotary", part: "crank" },
      parts: [P.link("crank", 40, { role: "driver", between: ["O", "A"] })],
      solve: (u) => ({ pts: { O, A: V.at(O, u, 41) } }),
    });
    expect(types(m)).toContain("LINK_LEN");
    expect(checkModel(m, 180).maxLinkErr).toBeCloseTo(1, 9);
  });

  it("reports INTERFERE for a pin sweeping through a plate on its own layer", () => {
    const m = defineMechanism({
      id: "fixture-pin",
      input: { kind: "rotary", part: "pin" },
      parts: [P.custom("plate", roundRect(-30, -30, 30, 30, 4), { role: "ground", fixed: [0, 0, 0] }), P.cap("pin", 0, 5.5, { at: "Q" })],
      solve: (u) => ({ pts: { Q: V.at(O, u, 10) } }),
    });
    const f = checkModel(m, 180).findings;
    expect(f.map((x) => x.type)).toContain("INTERFERE");
    expect(f.find((x) => x.type === "INTERFERE")!.part).toBe("pin");
  });

  it("reports MISSING, PERIODICITY and POSE_JUMP", () => {
    const m = defineMechanism({
      id: "fixture-bad",
      input: { kind: "rotary", part: "crank" },
      parts: [P.link("crank", 40, { role: "driver", between: ["O", "A"] }), P.tracer("t", 0, { at: "Z" })],
      solve: (u) => ({ pts: { O, A: V.at(O, u < 3 ? u : u + 2, 40), T: [u, 0] } }),
    });
    expect(types(m)).toEqual(expect.arrayContaining(["MISSING", "PERIODICITY", "POSE_JUMP"]));
  });

  it("four-bar is clean and exact", () => {
    const r = checkModel(fourBar);
    expect(r.findings).toEqual([]);
    expect(r.maxLinkErr).toBeLessThan(1e-9);
    expect(r.joins.pA).toEqual(["crank@0", "coupler@1"]);
  });
});

describe("defineMechanism", () => {
  it("rejects duplicate ids, a missing input part and fractional layers", () => {
    const solve = () => ({ pts: {} });
    expect(() =>
      defineMechanism({ id: "x", input: { kind: "rotary", part: "a" }, parts: [P.disc("a", 5, { fixed: [0, 0, 0] }), P.disc("a", 5, { fixed: [0, 0, 0] })], solve }),
    ).toThrow(/duplicate/);
    expect(() => defineMechanism({ id: "x", input: { kind: "rotary", part: "b" }, parts: [P.disc("a", 5, { fixed: [0, 0, 0] })], solve })).toThrow(/input part/);
    expect(() => defineMechanism({ id: "x", input: { kind: "rotary", part: "a" }, parts: [P.disc("a", 5, { layer: 0.5, fixed: [0, 0, 0] })], solve })).toThrow(/integer/);
  });
});

describe("sample and basePlate", () => {
  it("samples traces, velocity scale, bounds and plot data", () => {
    const s = sample(fourBar);
    expect(s.traces.C).toHaveLength(360);
    expect(s.vmax.C).toBeGreaterThan(0);
    expect(s.plotData).toHaveLength(181);
    expect(s.coreBounds.maxX - s.coreBounds.minX).toBeGreaterThan(150);
  });

  it("puts the base plate margin outside the envelope with four corner centres", () => {
    const s = sample(fourBar);
    const b = basePlate(fourBar, s, { cornerR: 12, margin: 16, footR: 6.5, mountHoleR: 2.8 });
    expect(b.bounds.minX).toBeCloseTo(s.coreBounds.minX - 16, 9);
    expect(b.corners).toHaveLength(4);
    expect(b.corners[0]![0]).toBeCloseTo(b.bounds.minX + 12, 6);
    expect(b.feet).toHaveLength(4);
  });
});
