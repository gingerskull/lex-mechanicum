// The belt drive's hand fixes promoted to rules: the J12 timing belt form (teeth conveyed round the pitch path, no posts
// under the band, the small pulley flanged, the idler on the slack span on an arm slotted across it on two posts, shared
// with the chain), the straddle bridge for shafts joined by a flexible member (A9), and the timing pulley P.pulley.
import { describe, expect, it } from "vitest";
import { assemble, assembleWith } from "../../src/assemble";
import { clampCheck } from "../../src/assemble/clamp";
import { clearance } from "../../src/assemble/clearance";
import { HTD, pulleyOutline } from "../../src/core/flex";
import { TAU } from "../../src/core/geom";
import { checkModel } from "../../src/model/check";
import { P } from "../../src/parts";
import { j12 } from "../../src/rules/j12-flexible";
import { j2Straddle } from "../../src/rules/j2-straddle";
import { beltModel, chainModel } from "../fixtures/models";
import { contextBefore, kinds, run } from "./helpers";

const J = "flex-belt-0";

describe("P.pulley", () => {
  it("cuts z round-bottomed grooves on the pitch circle less the pitch line differential, a groove at a0", () => {
    const p = P.pulley("pl", 24, 8, { a0: 0.3 });
    expect(p.z).toBe(24);
    expect(p.m).toBeUndefined();
    const rp = (8 * 24) / TAU;
    const r = p.shape.outer.map(([x, y]) => Math.hypot(x, y));
    expect(Math.max(...r)).toBeCloseTo(rp - HTD[8]!.pld, 6);
    expect(Math.min(...r)).toBeCloseTo(rp - HTD[8]!.pld - HTD[8]!.groove.depth, 6);
    // the grooves' bottoms lie on the a0 ray and every 2π/z on
    const bottom = p.shape.outer.reduce((a, b) => (Math.hypot(...b) < Math.hypot(...a) - 1e-9 ? b : a));
    const k = (Math.atan2(bottom[1], bottom[0]) - 0.3) / (TAU / 24);
    expect(k).toBeCloseTo(Math.round(k), 6);
    expect(pulleyOutline(24, 8, 0.3)).toEqual(p.shape.outer);
  });
});

describe("J12 timing belt", () => {
  const built = () => {
    const ctx = contextBefore(beltModel, j12);
    return { ctx, added: run(ctx, j12) };
  };

  it("conveys a whole number of teeth round the pitch path by the travel, the band on no posts", () => {
    const { ctx, added } = built();
    const teeth = added.filter((s) => /-t\d+$/.test(s.id));
    expect(teeth).toHaveLength(90);
    expect(teeth[1]!.motion).toMatchObject({ type: "convey", key: "t", offset: 5 });
    const band = ctx.solidOf["band"]!;
    expect(teeth[0]).toMatchObject({ z0: band.z0 - 0.1, z1: band.z1 + 0.1, mat: "Neoprene, glass-fibre cords" });
    expect(ctx.solids.some((s) => s.id.startsWith("band-post"))).toBe(false);
    expect(ctx.joints.some((j) => j.id === "band-post")).toBe(false);
    expect(band.joints).toContain(J);
  });

  it("flanges the small pulley (here the second) and lets the thrust washer under it give way", () => {
    const { ctx } = built();
    const small = ctx.solidOf["small"]!;
    expect(ctx.get("small-fl0")).toMatchObject({ z0: small.z0 - 0.8, z1: small.z0, group: "small" });
    expect(ctx.get("small-fl1")).toMatchObject({ z0: small.z1, z1: small.z1 + 0.8 });
    expect(ctx.get("big-fl0")).toBeUndefined();
    expect(ctx.get("pO2-tw")!.z1).toBeCloseTo(small.z0 - 0.8, 9);
    expect(ctx.get("pO1-tw")!.z1).toBeCloseTo(ctx.solidOf["big"]!.z0, 9);
  });

  it("sets a flanged idler on the slack span near the small pulley, on an arm slotted across it on two posts", () => {
    const { ctx, added } = built();
    const idler = ctx.get(`${J}-idler`)!;
    const around = (idler.motion as { around: [number, number] }).around;
    // the small pulley drives and the travel grows: the slack span is the upper one, leaving it
    expect(around[1]).toBeGreaterThan(0);
    const C = ctx.parts["pO2"]!.fixed![0];
    expect(around[0]).toBeGreaterThan(C / 2);
    expect(idler.motion).toMatchObject({ type: "geared" });
    for (const id of ["idler-fl0", "idler-fl1", "idler-brg", "idler-cl", "idler-sp", "idler-stud", "idler-nut", "arm", "arm-post0", "arm-post1", "arm-post0-top", "arm-post1-bot"]) expect(ctx.get(`${J}-${id}`)).toBeDefined();
    const arm = ctx.get(`${J}-arm`)!;
    expect(arm.holes).toHaveLength(3);
    expect(arm.z0).toBeGreaterThan(ctx.get(`${J}-idler-fl1`)!.z1);
    expect(kinds(added.filter((s) => s.id.includes("-arm-post") && s.kind === "standoff"))).toEqual({ standoff: 2 });
  });

  it("records the joint as J8 with its note, badge and functions; no lubrication", () => {
    const { ctx } = built();
    const j = ctx.joint(J)!;
    expect(j.type).toBe("J8");
    expect(j.title).toBe("Belt · big and small");
    expect(j.badge).toEqual(["belt tensioned", "ok"]);
    expect(j.note).toMatch(/90 teeth, 450 mm pitch length/);
    expect(j.note).toMatch(/whole number of teeth/);
    expect(j.serves.F10).toEqual(["small-fl0", `${J}-idler-fl0`]);
    expect(j.serves.F7).toEqual([`${J}-arm`, `${J}-idler`]);
    expect(j.serves.F2).toEqual([`${J}-idler-cl`, `${J}-idler-nut`]);
    expect(j.serves.F8).toBeUndefined();
  });

  it("names the belt and its pulleys' materials", () => {
    const a = assemble(beltModel);
    const get = (id: string) => a.solids.find((s) => s.id === id)!;
    expect(get("band").mat).toBe("Neoprene, glass-fibre cords");
    expect(get("small").mat).toBe("Aluminium 6061-T6, anodised");
  });

  it("builds clear over the cycle", () => {
    expect(checkModel(beltModel).findings).toEqual([]);
    const { assembly } = assembleWith(beltModel);
    expect(clearance(beltModel, assembly).map((c) => `${c.a} x ${c.b}`)).toEqual([]);
    expect(clampCheck(beltModel, assembly)).toEqual([]);
  });
});

describe("J12 chain: the shared idler", () => {
  it("sets the idler sprocket on the slack (lower) span near the small sprocket, on the arm on two posts", () => {
    const ctx = contextBefore(chainModel, j12);
    run(ctx, j12);
    const around = (ctx.get("flex-chain-0-idler")!.motion as { around: [number, number] }).around;
    expect(around[1]).toBeLessThan(0);
    expect(around[0]).toBeLessThan(ctx.parts["pO2"]!.fixed![0] / 2);
    expect(ctx.get("flex-chain-0-arm-post1")).toBeDefined();
    expect(ctx.joint("flex-chain-0")!.note).toMatch(/clamped on two posts \(F7\), greased \(F8\)/);
    const { assembly } = assembleWith(chainModel);
    expect(clearance(chainModel, assembly).map((c) => `${c.a} x ${c.b}`)).toEqual([]);
  });
});

describe("J2 straddle for shafts joined by a flexible member (A9)", () => {
  for (const [m, what, by] of [[beltModel, "pulley", "belt"], [chainModel, "sprocket", "chain"]] as const)
    it(`${m.id}: one bridge per shaft, the note naming the ${what}`, () => {
      const ctx = contextBefore(m, j2Straddle);
      run(ctx, j2Straddle);
      for (const id of ["pO1", "pO2"]) {
        expect(ctx.get(`${id}-bridge`)).toBeDefined();
        expect(ctx.get(`${id}-top-brg`)).toBeDefined();
        const j = ctx.joint(id)!;
        expect(j.badge?.[0]).toBe("straddle mounted");
        expect(j.note).toMatch(new RegExp(`so the ${what}, pulled sideways by the ${by}, is carried on both sides`));
      }
      expect(ctx.get("pO1-pO2-bridge")).toBeUndefined();
    });

  it("seats the top circlip on the small pulley's flange", () => {
    const ctx = contextBefore(beltModel, j2Straddle);
    run(ctx, j2Straddle);
    expect(ctx.get("pO2-cl-top")!.z0).toBeCloseTo(ctx.get("small-fl1")!.z1, 9);
  });
});
