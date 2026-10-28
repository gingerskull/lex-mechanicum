// A15 in 3D: penetration depth (2 x volume / area) against the clash tolerance, the box filter, the exemptions and the
// unnecessary-`allow` report; and the spike's injected-clash coupler, found.
import { describe, expect, it } from "vitest";
import { CLASH_TOL, clearance3 } from "../../src/checks/clash3";
import { check3d } from "../../src/checks/run";
import { fourBar, injectedCoupler, pin, plate, slidingPlacer, spinningPlacer } from "../fixtures/clash3";

describe("clearance3 on synthetic solids", () => {
  it("reports the depth of a plate pushed into another as its overlap", async () => {
    // two 100 x 100 plates overlapping by 2 mm in z while one slides over the other: 2V/A of a wide thin lens is its thickness
    const r = await clearance3([plate("a", "ground", [0, 0, 100, 100], 0, 5), plate("b", "mover", [120, 0, 220, 100], 3, 8)], slidingPlacer(["mover"], 130), { phases: 36 });
    expect(r.clashes).toHaveLength(1);
    expect(r.clashes[0]!.depth).toBeGreaterThan(1.8);
    expect(r.clashes[0]!.depth).toBeLessThan(2);
    expect(r.clashes[0]!.volume).toBeGreaterThan(10000);
  });

  it("is clear when the plates only touch, and when they never meet", async () => {
    const touching = await clearance3([plate("a", "ground", [0, 0, 10, 10], 0, 5), plate("b", "mover", [20, 0, 30, 10], 5, 8)], slidingPlacer(["mover"]), { phases: 36 });
    expect(touching.clashes).toEqual([]);
    const apart = await clearance3([plate("a", "ground", [0, 0, 10, 10], 0, 5), plate("b", "mover", [20, 30, 30, 40], 3, 8)], slidingPlacer(["mover"]), { phases: 36 });
    expect(apart.clashes).toEqual([]);
  });

  it("does not call a shaft in its own faceted bore a clash", async () => {
    // a shaft turning in a bore: the bore is a 24-gon, the shaft a 48-gon, both on the nominal circle, so the shaft's
    // facets bite into the bore's flats by a fraction of a millimetre: a sliver whose depth 2V/A is under the tolerance
    const hole = Array.from({ length: 24 }, (_, i): [number, number] => [5 * Math.cos((-2 * Math.PI * i) / 24), 5 * Math.sin((-2 * Math.PI * i) / 24)]);
    const bored = plate("bored", "ground", [-20, -20, 20, 20], 0, 6);
    bored.profile = { ...bored.profile, holes: [hole] };
    const r = await clearance3([bored, pin("shaft", "spinner", 0, 0, 5, -3, 9)], spinningPlacer(["spinner"]), { phases: 12 });
    expect(r.clashes).toEqual([]);
    // the same shaft pushed 0.5 mm off its axis is a clash
    const off = await clearance3([bored, pin("shaft", "spinner", 0.5, 0, 5, -3, 9)], spinningPlacer(["spinner"]), { phases: 12 });
    expect(off.clashes[0]?.depth).toBeGreaterThan(CLASH_TOL);
  });

  it("skips pairs that move together, pairs in a group and contact by design", async () => {
    const a = plate("a", "mover", [0, 0, 10, 10], 0, 5);
    const together = await clearance3([a, plate("b", "mover", [5, 0, 15, 10], 0, 5)], slidingPlacer(["mover"]), { phases: 12 });
    expect(together.clashes).toEqual([]);
    const grouped = await clearance3([plate("a", "ground", [0, 0, 10, 10], 0, 5, { group: "g" }), plate("b", "mover", [0, 0, 10, 10], 2, 7, { group: "g" })], slidingPlacer(["mover"]), { phases: 12 });
    expect(grouped.clashes).toEqual([]);
    const touching = await clearance3([plate("a", "ground", [0, 0, 10, 10], 0, 5), plate("b", "mover", [0, 0, 10, 10], 2, 7)], slidingPlacer(["mover"]), { phases: 12, contact: [["ground", "mover"]] });
    expect(touching.clashes).toEqual([]);
  });

  it("flags a hand allow as unnecessary when the pair never overlaps, and keeps one that does", async () => {
    const solids = [
      plate("a", "ground", [0, 0, 10, 10], 0, 5, { allow: ["far"], why: "stale" }),
      plate("far", "mover", [20, 30, 30, 40], 0, 5),
      plate("near", "mover", [0, 0, 10, 10], 3, 8, { allow: ["a"], why: "rope through the sheave" }),
    ];
    const r = await clearance3(solids, slidingPlacer(["mover"]), { phases: 24 });
    // allowed pairs are not clashes
    expect(r.clashes).toEqual([]);
    const byPair = Object.fromEntries(r.allows.map((x) => [`${x.a}|${x.b}`, x]));
    expect(byPair["a|far"]!.unnecessary).toBe(true);
    expect(byPair["a|near"]!.unnecessary).toBe(false);
    expect(byPair["a|near"]!.why).toBe("rope through the sheave");
  });
});

describe("the injected-clash coupler (spike #197)", () => {
  it("the four-bar is clear as built", async () => {
    const src = await fourBar();
    const r = await check3d(src, "ci", { cache: false });
    expect(r.clash.clashes).toEqual([]);
  }, 60_000);

  it("finds the coupler moved down into the cranks' plane", async () => {
    // the coupler's slab is 14 mm over the cranks' (both 6 mm thick): 12 mm down it overlaps them by 4 mm
    const src = await injectedCoupler("coupler", -12);
    const r = await check3d(src, "ci", { cache: false });
    const pairs = r.clash.clashes.map((c) => [c.a, c.b].sort().join(" x "));
    expect(pairs).toContain("coupler x crank");
    expect(pairs).toContain("coupler x rocker");
    const crank = r.clash.clashes.find((c) => [c.a, c.b].includes("crank"))!;
    expect(crank.depth).toBeGreaterThan(2);
  }, 60_000);
});

describe("rigid transforms", () => {
  it("inverts a rigid matrix turned about any axis", async () => {
    const { rigidInverse, matMul } = await import("../../src/checks/clash3");
    const { mat4 } = await import("../../src/solids/frame");
    const c = Math.cos(0.7);
    const s = Math.sin(0.7);
    for (const f of [{ o: [1, 2, 3], x: [c, s, 0], z: [0, 0, 1] }, { o: [-4, 2, 9], x: [c, 0, s], z: [0, 1, 0] }, { o: [0, 5, 1], x: [0, c, s], z: [1, 0, 0] }]) {
      const M = mat4(f as never);
      const I = matMul(rigidInverse(M), M);
      I.forEach((v, i) => expect(v).toBeCloseTo(i % 5 === 0 ? 1 : 0, 12));
    }
  });
});
