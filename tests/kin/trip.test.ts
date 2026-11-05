// The rack stepped by an indexer and carried back out of mesh once a cycle, and the flaps tipped by a passing finger and
// held: K1 holds over the cycle on the Maccabee eight-night indexer's record, the carriage steps one station a night and
// returns, and one more flame is up each night.
import { describe, expect, it } from "vitest";
import { recordById } from "../../src/catalog";
import { Kinematics } from "../../src/kin/compose";
import type { Kin } from "../../src/kin/types";
import { verifyK1 } from "../../src/kin/verify";

const kin = () => (recordById("eight-night-indexer") as unknown as { kin: Kin }).kin;
const STEP = (Math.PI / 4) * 25.5;
// the cycle phase of driver angle v (degrees): eight driver turns a cycle
const at = (v: number) => ((v / 8) * Math.PI) / 180;

describe("rack-release and trip blocks", () => {
  it("hold every joint over the cycle (K1), periodic", () => {
    const rep = verifyK1(new Kinematics(kin()), { samples: 576 });
    expect(rep.maxResidual).toBeLessThan(1e-9);
    expect(rep.periodicity).toBeLessThan(1e-6);
  });

  it("step the carriage one station each night and carry it back on the eighth index", () => {
    const k = new Kinematics(kin());
    for (let n = 0; n < 8; n++) {
      const v = k.pose(at(n * 360 + 30)).values;
      expect(v["carriage-x"]!).toBeCloseTo(-n * STEP, 6);
    }
    expect(k.pose(at(7 * 360 + 300)).values["carriage-x"]!).toBeCloseTo(0, 6);
  });

  it("put one more flame up each night and fold all but the first on the return", () => {
    const k = new Kinematics(kin());
    for (let n = 0; n < 8; n++) expect(k.pose(at(n * 360 + 30)).values["flames-lit"]!).toBeCloseTo(n + 1, 6);
    expect(k.pose(at(7 * 360 + 300)).values["flames-lit"]!).toBeCloseTo(1, 6);
  });
});
