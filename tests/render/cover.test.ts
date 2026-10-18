import { describe, expect, it } from "vitest";
import { cover } from "../../src/render/draft";
import { DRAFT } from "../../src/style/draft";

const F = DRAFT.fill;
// what a stack of slices lets through of the lines layer under it: each top face erases its occlusion
const through = (n: number, kind: { base?: boolean; plate?: boolean; see?: boolean }) => {
  let t = 1;
  for (let i = 0; i < n; i++) t *= 1 - cover({ ...kind, top: i === n - 1 }).occ;
  return t;
};

describe("cover", () => {
  it("the base lets its tenth through however many slices the parts passing through it cut it into", () => {
    for (const n of [1, 3, 10]) expect(through(n, { base: true })).toBeCloseTo(1 - F.occlude.base, 6);
  });

  it("the base lays its paper once, on its top slice", () => {
    expect(cover({ base: true, top: true }).face).toBe(F.base);
    expect(cover({ base: true, top: false }).face).toBe(0);
  });

  it("a see-through solid covers once, at half strength", () => {
    expect(through(4, { plate: true, see: true })).toBeCloseTo(1 - F.occlude.plate * F.seeThrough.opacity, 6);
  });
});
