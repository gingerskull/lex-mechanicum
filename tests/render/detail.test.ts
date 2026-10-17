import { beforeAll, describe, expect, it } from "vitest";
import { buildPackage } from "../../src/package/build";
import type { Package } from "../../src/package/format";
import { ladder } from "../../src/render/detail";
import { prepare, type Prepared } from "../../src/render/world";

let P: Prepared[];
beforeAll(async () => {
  const pkg: Package = (await buildPackage("four-bar")).pkg;
  P = prepare(pkg);
}, 60_000);

const kept = (dial: Parameters<typeof ladder>[0], explode = 0, tilt = 28) => {
  const L = ladder(dial, { tilt, explode });
  return P.filter((p) => L.solid(p.s.detail));
};

describe("detail ladder on the four-bar", () => {
  it("at D hides washers and spacers and keeps bearings", () => {
    const k = kept("D");
    expect(k.some((p) => p.s.kind === "spacer" || p.s.kind === "washer" || p.s.kind === "thrustWasher")).toBe(false);
    expect(k.some((p) => p.s.kind === "bearing")).toBe(true);
    // and the balls inside them went at A
    expect(k.some((p) => p.s.kind === "bearingBalls")).toBe(false);
  });

  it("draws the stack hardware again when exploded", () => {
    const k = kept("D", 0.5);
    expect(k.some((p) => p.s.kind === "spacer")).toBe(true);
  });

  it("at H keeps only what is never dropped", () => {
    expect(kept("H").every((p) => p.s.detail === "never")).toBe(true);
    expect(kept("H").length).toBeLessThan(P.length);
  });

  it("drops manufacturing marks edge-on and says the position", () => {
    expect(ladder("full", { tilt: 85, explode: 0 }).mark("chamfer")).toBe(false);
    expect(ladder("full", { tilt: 28, explode: 0 }).mark("chamfer")).toBe(true);
    expect(ladder("full", { tilt: 28, explode: 0 }).label).toBe("FULL");
    expect(ladder("D", { tilt: 28, explode: 0 }).label).toBe("DETAIL A-D");
    expect(ladder("C", { tilt: 28, explode: 0 }).effect("fullDpr")).toBe(false);
    expect(ladder("F", { tilt: 28, explode: 0 }).effect("hiddenLines")).toBe(true);
  });
});
