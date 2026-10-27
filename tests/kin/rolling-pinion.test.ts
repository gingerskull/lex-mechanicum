// gear-mesh with `rolls`: a pinion on a moving carrier rolls on a held rack and drives a second rack on its far side
// (a stroke doubler). The free rack's travel is read relative to the moving centre, so it runs twice the carrier.
import { describe, expect, it } from "vitest";
import { Kinematics } from "../../src/kin/compose";
import { verifyK1 } from "../../src/kin/verify";
import type { Kin } from "../../src/kin/types";

const doubler = (r: number, wrongWay = false): Kin =>
  ({
    bodies: [
      { id: "ground", role: "ground", shape: { type: "plate", rect: [300, 120] }, at: { frame: { origin: [0, 0, -8] } } },
      { id: "carrier", role: "driver", shape: { type: "slider", length: 40, width: 20 }, at: { joint: "P" } },
      { id: "pinion", role: "gear", shape: { type: "gear", z: (2 * r) / 2, module: 2 }, at: { joint: "P" } },
      { id: "held", role: "gear", fixed: true, shape: { type: "rack", module: 2, length: 120 }, frame: { origin: [0, -r, 0] } },
      { id: "free", role: "output", shape: { type: "rack", module: 2, length: 120 }, at: { joint: "R" }, frame: { origin: [0, r, 0], rot: [0, 0, 180] } },
    ],
    joints: [
      { id: "C", type: "prismatic", a: "ground", b: "carrier", at: [0, 0, 0], axis: [1, 0, 0] },
      { id: "P", type: "revolute", a: "carrier", b: "pinion", at: [0, 0, 0], axis: [0, 0, 1] },
      { id: "R", type: "prismatic", a: "ground", b: "free", at: [0, r, 0], axis: [1, 0, 0] },
      { id: "M1", type: "gear-mesh", a: "pinion", b: "held", at: [0, -r, 0], axis: [0, 0, 1], axis2: [1, 0, 0], radiusA: r, carrier: "carrier" },
      { id: "M2", type: "gear-mesh", a: "pinion", b: "free", at: [0, r, 0], axis: [0, 0, 1], axis2: [-1, 0, 0], radiusA: r, carrier: "carrier" },
    ],
    drivers: [{ id: "input", joint: "C", kind: "linear", range: [-30, 30], default: 0, lo: -30, hi: 30 }],
    solve: [
      { block: "gear-mesh", id: "roll", joints: ["P", "M1"], in: { joint: "M1", rolls: "P", parent: "carrier" }, out: { angle: "turn", travel: "travel" } },
      // the wrong way round: the free rack's travel taken without the moving centre (no parent)
      { block: "gear-mesh", id: "drive", joints: ["R", "M2"], in: { joint: "M2", input: "turn", ...(wrongWay ? {} : { parent: "carrier" }) }, out: { travel: "rel" } },
    ],
    points: [
      { id: "axle", body: "carrier", local: [0, 0, 0] },
      { id: "mark", body: "free", local: [0, 0, 0] },
    ],
    outputs: [],
    fallback: null,
  }) as unknown as Kin;

describe("gear-mesh: a pinion rolling on a held rack", () => {
  for (const r of [12, 24, 40]) {
    it(`the free rack runs twice the carrier for any pinion (r = ${r}), and K1 checks both meshes`, () => {
      const k = new Kinematics(doubler(r));
      const rep = verifyK1(k);
      expect(rep.failures).toEqual([]);
      expect(rep.ok).toBe(true);
      for (const u of [0.4, 1.7, 3.1, 5]) {
        const p = k.pose(u);
        const x = p.points.get("axle")![0];
        expect(p.points.get("mark")![0]).toBeCloseTo(2 * x, 9);
        // the pinion turns back as it rolls forward: -x / r
        expect(p.values["turn"]).toBeCloseTo((-x / r) * (180 / Math.PI), 9);
        expect(p.values["travel"]).toBeCloseTo(x, 9);
      }
    });
  }

  it("refuses a rolling pinion whose mesh gives no axis2 (the rack's way)", () => {
    const kin = doubler(24);
    delete (kin.joints.find((j) => j.id === "M1") as { axis2?: unknown }).axis2;
    expect(() => new Kinematics(kin).pose(0.4)).toThrow(/a rolling pinion needs the joint's axis2/);
  });

  it("a free rack posed without the moving centre fails K1 (its mesh is checked in the carrier's frame)", () => {
    const rep = verifyK1(new Kinematics(doubler(24, true)));
    expect(rep.ok).toBe(false);
  });
});
