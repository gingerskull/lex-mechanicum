// The walker riding on its lower foot over the belt it drives, the carry of parts solved in a moving body's frame, and a
// rocker turned by a pin in an offset slot: K1 holds over the cycle on the Turkey trot walker's record, the body's height
// is its rest less the lower foot's height, and the belt moves with the lower foot.
import { describe, expect, it } from "vitest";
import { recordById } from "../../src/catalog";
import { Kinematics } from "../../src/kin/compose";
import type { Kin } from "../../src/kin/types";
import { verifyK1 } from "../../src/kin/verify";

const D = Math.PI / 180;
const kin = () => (recordById("turkey-trot-walker") as unknown as { kin: Kin }).kin;

describe("walker, carry and slot-swing blocks", () => {
  it("hold every joint over the cycle (K1), periodic", () => {
    const rep = verifyK1(new Kinematics(kin()), { samples: 180 });
    expect(rep.maxResidual).toBeLessThan(1e-9);
    expect(rep.periodicity).toBeLessThan(1e-6);
  });

  it("rest the body on the lower foot: the lower foot's height plus the body's lift is the floor", () => {
    const k = new Kinematics(kin());
    for (const u of [0, 50, 100, 150, 200, 250, 300]) {
      const v = k.pose(u * D).values;
      expect(Math.min(v["near-foot"]!, v["far-foot"]!) + v["body-lift"]!).toBeCloseTo(0, 9);
      expect(v["body-lift"]!).toBeLessThanOrEqual(1e-12);
    }
  });

  it("move the belt with the lower foot: a planar contact off its drum's turn fails K1", () => {
    const bent = structuredClone(kin());
    (bent.joints.find((j) => j.id === "Tn") as unknown as { radiusA: number }).radiusA *= 1.01;
    const rep = verifyK1(new Kinematics(bent), { samples: 90 });
    expect(rep.byJoint.Tn!).toBeGreaterThan(1e-4);
  });
});
