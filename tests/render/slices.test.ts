import { describe, expect, it } from "vitest";
import { slices, type Sliceable } from "../../src/render/slices";

const box = (z0: number, z1: number, x = 0): Sliceable => ({ z0, z1, bb: [x, 0, x + 10, 10] });

describe("slices", () => {
  it("cuts overlapping solids at every z boundary of each other", () => {
    const a = box(0, 6);
    const b = box(3, 9);
    const out = slices([a, b]).map((s) => [s.w === a ? "a" : "b", s.z0, s.top]);
    expect(out).toEqual([["a", 0, 3], ["a", 3, 6], ["b", 3, 6], ["b", 6, 9]]);
  });

  it("does not cut solids that do not overlap in plan", () => {
    const out = slices([box(0, 6), box(3, 9, 50)]);
    expect(out).toHaveLength(2);
  });

  it("marks the top and bottom slice of each solid", () => {
    const out = slices([box(0, 6), box(3, 9)]);
    expect(out.filter((s) => s.isTop).map((s) => s.top)).toEqual([6, 9]);
    expect(out.filter((s) => s.isBottom).map((s) => s.z0)).toEqual([0, 3]);
  });

  it("returns the cached cuts for the same explode and overlap signature", () => {
    const cache: Parameters<typeof slices>[1] = {};
    slices([box(0, 6), box(3, 9)], cache);
    const first = cache!.last!.cuts;
    slices([box(0, 6, 1), box(3, 9, 2)], cache);
    expect(cache!.last!.cuts).toBe(first);
    slices([box(0, 6), box(4, 9)], cache);
    expect(cache!.last!.cuts).not.toBe(first);
  });
});
