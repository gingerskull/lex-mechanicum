import { describe, expect, it } from "vitest";
import { withoutConstruction } from "../../src/builder/construction";
import type { Kin } from "../../src/kin/types";

describe("construction bodies", () => {
  const kin = {
    bodies: [{ id: "ground", role: "ground" }, { id: "crank", role: "driver", construction: true }, { id: "rod", role: "output" }, { id: "blockX", role: "slider" }],
    joints: [
      { id: "O", type: "revolute", a: "ground", b: "crank" },
      { id: "M", type: "revolute", a: "crank", b: "rod" },
      { id: "A", type: "revolute", a: "rod", b: "blockX" },
      { id: "SX", type: "prismatic", a: "ground", b: "blockX" },
    ],
    drivers: [{ id: "input", joint: "O", kind: "rotary", range: [0, 360] }],
  } as unknown as Kin;

  it("drops the body and its joints from the build's view, and works its driver by hand through the body it carries", () => {
    const k = withoutConstruction(kin);
    expect(k.bodies.map((b) => b.id)).toEqual(["ground", "rod", "blockX"]);
    expect(k.joints.map((j) => j.id)).toEqual(["A", "SX"]);
    expect(k.drivers[0]).toMatchObject({ kind: "manual", joint: "A", range: [0, 360] });
  });

  it("leaves a record without one as it is", () => {
    const plain = { ...kin, bodies: kin.bodies.map((b) => ({ ...b, construction: undefined })) } as unknown as Kin;
    expect(withoutConstruction(plain)).toBe(plain);
  });
});
