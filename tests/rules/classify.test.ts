import { describe, expect, it } from "vitest";
import fourBar from "../../src/mechanisms/four-bar/model";
import { classify } from "../../src/rules/classify";
import { j4Model, j5Model, j6Model, j7Model } from "../fixtures/models";
import { contextBefore, run } from "./helpers";

const types = (m: Parameters<typeof contextBefore>[0]) => {
  const ctx = contextBefore(m, classify);
  run(ctx, classify);
  return Object.fromEntries(ctx.info.map((j) => [j.id, j.type]));
};

describe("classify", () => {
  it("reads the four-bar's joints: live input, dead axle, two moving pins", () => {
    expect(types(fourBar)).toEqual({ pO2: "J2", pO4: "J1", pA: "J3", pB: "J3" });
  });

  it("finds a pin in a slot, a slide, a mesh and a cam", () => {
    expect(types(j4Model)).toMatchObject({ pA: "J4", pO4: "J1", pO2: "J2" });
    expect(types(j5Model)["slide-block"]).toBe("J5");
    expect(types(j6Model)["mesh-g1-g2"]).toBe("J6");
    expect(types(j7Model)["cam-cam"]).toBe("J7");
  });

  it("puts the mesh pitch point one pitch radius from the pinion", () => {
    const ctx = contextBefore(j6Model, classify);
    run(ctx, classify);
    const m = ctx.info.find((j) => j.kind === "mesh")!;
    expect(m.kind === "mesh" && m.at[0]).toBeCloseTo(28, 6);
  });
});
