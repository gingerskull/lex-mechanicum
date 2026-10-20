import { describe, expect, it } from "vitest";
import { axisVec, boxOf, boxOverlap, planCorners, toWorld } from "../../src/core/axis";

describe("axis", () => {
  it("maps a point of each plane to the world", () => {
    expect(toWorld("z", [1, 2], 3)).toEqual([1, 2, 3]);
    expect(toWorld(undefined, [1, 2], 3)).toEqual([1, 2, 3]);
    expect(toWorld("x", [1, 2], 3)).toEqual([3, 1, 2]);
    expect(toWorld("y", [1, 2], 3)).toEqual([1, 3, 2]);
    expect(axisVec("x")).toEqual([1, 0, 0]);
    expect(axisVec("y")).toEqual([0, 1, 0]);
    expect(axisVec(undefined)).toEqual([0, 0, 1]);
  });

  it("boxes an outline over its extent along the axis", () => {
    const sq: [number, number][] = [[-1, -2], [1, -2], [1, 2], [-1, 2]];
    expect(boxOf("z", sq, 5, 6)).toEqual([-1, -2, 5, 1, 2, 6]);
    expect(boxOf("x", sq, 5, 6)).toEqual([5, -1, -2, 6, 1, 2]);
    expect(boxOf("y", sq, 5, 6)).toEqual([-1, 5, -2, 1, 6, 2]);
    expect(planCorners([0, 1, 2, 3, 4, 5])).toEqual([[0, 1], [3, 1], [3, 4], [0, 4]]);
  });

  it("measures box overlap by its thinnest direction", () => {
    expect(boxOverlap([0, 0, 0, 10, 10, 10], [5, 8, 9, 20, 20, 20])).toBe(1);
    expect(boxOverlap([0, 0, 0, 10, 10, 10], [11, 0, 0, 20, 10, 10])).toBe(-1);
  });
});
