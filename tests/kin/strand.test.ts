// strand: a chain anchored to the ground runs round a sprocket on a moving carrier to an output (a chain stroke
// doubler). The output runs twice the carrier for any sprocket, and K1 checks every strand in the carrier's frame.
import { describe, expect, it } from "vitest";
import { Kinematics } from "../../src/kin/compose";
import { verifyK1 } from "../../src/kin/verify";
import type { Kin } from "../../src/kin/types";

const doubler = (r: number, opts: { wrongWay?: boolean } = {}): Kin =>
  ({
    bodies: [
      { id: "ground", role: "ground", shape: { type: "plate", rect: [300, 120] }, at: { frame: { origin: [0, 0, -8] } } },
      { id: "carrier", role: "driver", shape: { type: "slider", length: 40, width: 20 }, at: { joint: "S" } },
      { id: "sprocket", role: "link", shape: { type: "sprocket", z: 12, pitch: 12.7 }, at: { joint: "S" } },
      { id: "out", role: "output", shape: { type: "slider", length: 120, width: 16 }, at: { joint: "O" }, frame: { origin: [0, r + 20, 0] } },
    ],
    joints: [
      { id: "C", type: "prismatic", a: "ground", b: "carrier", at: [0, 0, 0], axis: [1, 0, 0] },
      { id: "S", type: "revolute", a: "carrier", b: "sprocket", at: [0, 0, 0], axis: [0, 0, 1] },
      { id: "O", type: "prismatic", a: "ground", b: "out", at: [0, r + 20, 0], axis: [1, 0, 0] },
      { id: "held", type: "belt", flexible: "chain", strand: true, a: "sprocket", b: "ground", carrier: "carrier", at: [0, -r, 0], axis: [0, 0, 1], axis2: [1, 0, 0], radiusA: r },
      { id: "run", type: "belt", flexible: "chain", strand: true, a: "sprocket", b: "out", carrier: "carrier", at: [0, r, 0], axis: [0, 0, 1], axis2: [-1, 0, 0], radiusA: r },
      // a second chain the block does not pose (it repeats the first): declared the wrong way round, K1 must catch it
      ...(opts.wrongWay ? [{ id: "run2", type: "belt", flexible: "chain", strand: true, a: "sprocket", b: "out", carrier: "carrier", at: [0, r, 0], axis: [0, 0, 1], axis2: [1, 0, 0], radiusA: r }] : []),
    ],
    drivers: [{ id: "input", joint: "C", kind: "linear", range: [-30, 30], default: 0, lo: -30, hi: 30 }],
    solve: [{ block: "strand", id: "doubler", joints: ["S", "held", "run", ...(opts.wrongWay ? ["run2"] : []), "O"], in: { carrier: "carrier", joint: "S", held: "held", running: ["run"] }, out: { angle: "turn", travel: "travel" } }],
    points: [
      { id: "axle", body: "carrier", local: [0, 0, 0] },
      { id: "end", body: "out", local: [-50, -20, 0] },
    ],
    outputs: [],
    fallback: null,
  }) as unknown as Kin;

describe("strand: a chain anchored round a sprocket on a moving carrier", () => {
  for (const r of [12, 24.255213, 40]) {
    it(`the output runs twice the carrier for any sprocket (r = ${r}), and K1 checks both strands`, () => {
      const k = new Kinematics(doubler(r));
      const rep = verifyK1(k);
      expect(rep.failures).toEqual([]);
      expect(rep.ok).toBe(true);
      for (const u of [0.4, 1.7, 3.1, 5]) {
        const p = k.pose(u);
        const x = p.points.get("axle")![0];
        expect(p.points.get("end")![0] + 50).toBeCloseTo(2 * x, 9);
        // the sprocket turns back as the carrier goes forward: -x / r; the chain runs -x past the carrier
        expect(p.values["turn"]).toBeCloseTo((-x / r) * (180 / Math.PI), 9);
        expect(p.values["travel"]).toBeCloseTo(-x, 9);
      }
    });
  }

  it("a repeated strand declared the wrong way round fails K1 (each strand is checked in the carrier frame)", () => {
    const rep = verifyK1(new Kinematics(doubler(24, { wrongWay: true })));
    expect(rep.ok).toBe(false);
  });
});
