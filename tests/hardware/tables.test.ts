import { describe, expect, it } from "vitest";
import { BEARINGS, BORES, bearingFor, circlipExt, circlipInt, keyFor, standardLength, threadFor } from "../../src/hardware/tables";

describe("hardware tables", () => {
  it("holds the 23 catalogue bearings and their bores, largest first", () => {
    expect(BEARINGS).toHaveLength(23);
    expect(BORES[0]).toBe(20);
    expect(BORES[BORES.length - 1]).toBe(3);
  });

  it("picks the largest bearing a boss takes with a 1.2 mm wall, preferring room for a circlip", () => {
    // R 8 in a 6 mm plate: 686 (13 x 5) fits with 1.35 mm wall and leaves 1 mm for a circlip
    expect(bearingFor(6, 8, 6)?.name).toBe("686");
    // R 11, 6 mm: 698 (19 x 6) would fill the plate; 688 (16 x 5) leaves room
    expect(bearingFor(8, 11, 6)?.name).toBe("688");
    expect(bearingFor(8, 5, 6)).toBeNull();
  });

  it("sizes screws, threads, circlips and keys from their series", () => {
    expect(standardLength(13.5)).toBe(14);
    expect(standardLength(21)).toBe(25);
    expect(threadFor(6)).toBe(5);
    expect(threadFor(8)).toBe(6);
    expect(circlipExt(10).s).toBe(1);
    expect(circlipInt(19).d2).toBe(20);
    expect(keyFor(8)).toBeNull();
    expect(keyFor(10)).toMatchObject({ b: 3, h: 3 });
    expect(keyFor(12)).toMatchObject({ b: 4, h: 4 });
  });
});
