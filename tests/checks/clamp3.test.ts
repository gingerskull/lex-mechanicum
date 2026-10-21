// A12 and M6 on 3D solids.
import { describe, expect, it } from "vitest";
import { clampCheck3, edgeCheck3 } from "../../src/checks/clamp3";
import { pin, plate, spinningPlacer } from "../fixtures/clash3";

describe("clampCheck3 (A12)", () => {
  const ground = (z0: number, z1: number) => plate("housing", "ground", [-30, -30, 30, 30], z0, z1, { kind: "housing" });

  it("finds a turning part pressed on a ground face", async () => {
    const out = await clampCheck3([ground(-5, 0), pin("gear", "spinner", 0, 0, 12, 0, 6)], spinningPlacer(["spinner"]), 4);
    expect(out).toEqual(["gear (turning) touches the ground face of housing"]);
  });

  it("is clean with a gap, and for a thrust washer (the designed sliding face)", async () => {
    expect(await clampCheck3([ground(-5, 0), pin("gear", "spinner", 0, 0, 12, 0.5, 6)], spinningPlacer(["spinner"]), 4)).toEqual([]);
    expect(await clampCheck3([ground(-5, 0), pin("w", "spinner", 0, 0, 12, 0, 1, { kind: "thrustWasher" })], spinningPlacer(["spinner"]), 4)).toEqual([]);
  });

  it("lets a turning part touch the inner race of a bearing only", async () => {
    // a 6 x 16 bearing has an inner race out to about Ø9.8: a Ø8 hub on it is clean, a Ø15 hub reaches the outer race
    const bearing = pin("brg", "ground", 0, 0, 8, -5, 0, { kind: "bearing", d: 6, D: 16 });
    expect(await clampCheck3([bearing, pin("hub", "spinner", 0, 0, 4, 0, 6)], spinningPlacer(["spinner"]), 4)).toEqual([]);
    expect(await clampCheck3([bearing, pin("hub", "spinner", 0, 0, 7.5, 0, 6)], spinningPlacer(["spinner"]), 4)).toHaveLength(1);
  });
});

describe("edgeCheck3 (M6)", () => {
  const hole = (cx: number, r: number): [number, number][] => Array.from({ length: 32 }, (_, i): [number, number] => [cx + r * Math.cos((-2 * Math.PI * i) / 32), r * Math.sin((-2 * Math.PI * i) / 32)]);

  it("flags a thin wall round a round hole and passes a thick one", () => {
    const p = plate("link", "crank", [0, -10, 40, 10], 0, 6);
    p.profile = { ...p.profile, holes: [hole(5, 4)] };
    expect(edgeCheck3([p])).toEqual([expect.stringMatching(/link: wall 1\.00 mm round the Ø8\.0 hole/)]);
    p.profile = { ...p.profile, holes: [hole(8, 4)] };
    expect(edgeCheck3([p])).toEqual([]);
  });

  it("allows 1.2 mm round a bearing seat", () => {
    const p = plate("link", "crank", [0, -10, 40, 10], 0, 6);
    p.profile = { ...p.profile, holes: [hole(5.2, 4)] };
    expect(edgeCheck3([p])).toHaveLength(1);
    expect(edgeCheck3([p, pin("brg", "crank", 5.2, 0, 4, 0, 6, { kind: "bearing" })])).toEqual([]);
  });
});
