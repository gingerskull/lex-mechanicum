// One generator builds J1, J2 and J10 (A20), for a joint on the base's normal and for a tilted one (the universal joint's
// yoke): the same hardware along the axis, the support chosen from where the axis stands, every solid on the axis.
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { type BuildCtx, createCtx } from "../../src/builder/ctx";
import { frameAlong, type Frame } from "../../src/builder/frames";
import type { Member } from "../../src/builder/lib";
import { rules } from "../../src/builder/registry";
import { axialStack, selectSupport, type StackSpec } from "../../src/builder/stack";
import { v3, type Vec3 } from "../../src/kin/math";
import type { Solid3 } from "../../src/solids/types";
import { fixtureRecord } from "./fixtures";

let ctx: BuildCtx;
beforeAll(async () => {
  ctx = await createCtx(fixtureRecord("kin:crankRocker"));
  for (const r of rules.slice(0, rules.findIndex((q) => q.id === "base") + 1)) {
    ctx.rule = r.id;
    r.apply(ctx);
  }
});
afterAll(() => ctx.dispose());

const members = (keyed: boolean): Member[] => [
  { solid: "m0", body: "m0", w0: 0, w1: 6, R: 9.5, keyed, name: "M0" },
  { solid: "m1", body: "m1", w0: 10, w1: 16, R: 9.5, keyed: false, name: "M1" },
];

const Z: Frame = frameAlong([220, 220, 0], [0, 0, 1], [1, 0, 0]);
const TILT: Vec3 = v3.unit([0.5, 0, 0.866]);
const T: Frame = frameAlong([220, 220, 0], TILT, [0, 1, 0]);

const spec = (id: string, frame: Frame, kind: StackSpec["kind"], over: Partial<StackSpec> = {}): StackSpec => ({
  id,
  frame,
  kind,
  members: members(kind === "live"),
  joints: [id],
  base: null,
  held: "both",
  baseTopWorld: ctx.base!.top,
  ...over,
});

/** Axial extent of a solid along its own axis, from the stack frame. */
const along = (s: Solid3, f: Frame): [number, number] => {
  const h = s.op.op === "extrude" ? s.op.h : 0;
  const w = v3.dot(v3.sub(s.frame.o, f.o), f.z);
  return [+w.toFixed(4), +(w + h).toFixed(4)];
};

/** The hardware on the axis (not the supports that stand on the base). */
const onAxis = (r: Solid3[], f: Frame): Solid3[] => r.filter((s) => v3.len(v3.cross(s.frame.z, f.z)) < 1e-9 && v3.len(v3.cross(v3.sub(s.frame.o, f.o), f.z)) < 1e-6);

describe("the axial stack builder", () => {
  const base = { top: -4, bottom: -12 };

  it("builds a dead axle (J1) on the base normal with a bridge, and tilted with pillow blocks", () => {
    const a = axialStack(ctx, spec("jz", Z, "dead", { base }));
    expect(a.support).toBe("bridge");
    expect(a.solids.some((s) => s.kind === "bridge")).toBe(true);
    expect(a.solids.filter((s) => s.kind === "bearing" && !s.id.includes("-balls") && !s.id.includes("-cage"))).toHaveLength(2);
    const t = axialStack(ctx, spec("jt", T, "dead"));
    expect(t.support).toBe("pillow");
    expect(t.solids.filter((s) => s.kind === "housing").length).toBeGreaterThanOrEqual(6);
    // the axle is on the tilted axis, whatever its direction
    const axle = onAxis(t.solids, T).filter((s) => s.kind === "shaft");
    expect(axle.length).toBeGreaterThan(0);
  });

  it("builds a live shaft (J2) with a housing behind the base, and tilted in pillow blocks", () => {
    const a = axialStack(ctx, spec("sz", Z, "live", { base, held: "base" }));
    expect(a.support).toBe("housing");
    expect(a.solids.some((s) => s.id === "sz-housing")).toBe(true);
    expect(a.solids.some((s) => s.kind === "key") || a.solids.some((s) => s.kind === "shaft")).toBe(true);
    const t = axialStack(ctx, spec("st", T, "live"));
    expect(t.support).toBe("pillow");
    expect(t.solids.some((s) => s.kind === "bearing" && s.id.startsWith("st-pb-b"))).toBe(true);
  });

  it("builds a shaft in plan (J10) with two pillow blocks, on the base normal forced and tilted", () => {
    for (const [id, f] of [["pz", Z], ["pt", T]] as const) {
      const r = axialStack(ctx, spec(id, f, "dead", { support: "pillow" }));
      expect(r.support).toBe("pillow");
      expect(r.solids.filter((s) => s.id.startsWith(`${id}-pb-b0`) || s.id.startsWith(`${id}-pb-b1`)).length).toBeGreaterThan(4);
      expect(ctx.routes.some((q) => q.support === `${id}-pb`)).toBe(true);
    }
  });

  it("is the same stack along any axis: the hardware's extents along the axis do not depend on its direction", () => {
    const a = axialStack(ctx, spec("ez", Z, "dead", { base, held: "base", support: "stub" }));
    const b = axialStack(ctx, spec("et", T, "dead", { base, held: "base", support: "stub" }));
    expect(a.support).toBe("stub");
    expect(b.support).toBe("stub");
    const ext = (r: typeof a, id: string, f: Frame) => onAxis(r.solids, f).map((s) => [s.id.replace(`${id}-`, ""), s.kind, ...along(s, f)]).sort((p, q) => String(p[0]).localeCompare(String(q[0])));
    expect(ext(b, "et", T)).toEqual(ext(a, "ez", Z));
  });

  it("the selector follows the axis and the sweeps (A20)", () => {
    const b = { top: -4, bottom: -12 };
    expect(selectSupport({ frame: Z, kind: "dead", held: "both", straddle: false, base: b })).toBe("bridge");
    expect(selectSupport({ frame: Z, kind: "dead", held: "base", straddle: false, base: b })).toBe("stub");
    expect(selectSupport({ frame: Z, kind: "dead", held: "bridge", straddle: false, base: b })).toBe("hung");
    expect(selectSupport({ frame: Z, kind: "live", held: "base", straddle: false, base: b })).toBe("housing");
    expect(selectSupport({ frame: Z, kind: "live", held: "both", straddle: true, base: b })).toBe("bridge");
    expect(selectSupport({ frame: T, kind: "live", held: "both", straddle: false, base: null })).toBe("pillow");
    expect(selectSupport({ frame: Z, kind: "moving", held: "both", straddle: false, base: b })).toBe("stub");
  });
});
