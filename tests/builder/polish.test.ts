// Polish API v3: exceptions only. pin() and local() work in 3D, an addition rides its body, and a post or a plate is never
// removed unless the record names it with its reason (T12).
import { afterAll, describe, expect, it } from "vitest";
import { buildWithContext } from "../../src/builder/build";
import type { BuildCtx } from "../../src/builder/ctx";
import { polishApi } from "../../src/builder/polish";
import { fixtureRecord } from "./fixtures";

const ctxs: BuildCtx[] = [];
afterAll(() => ctxs.forEach((c) => c.dispose()));
const built = async (name: string, extra?: object) => {
  const rec = { ...fixtureRecord(name), ...(extra ?? {}) };
  const r = await buildWithContext(rec);
  ctxs.push(r.ctx);
  return r.ctx;
};

describe("polish API v3", () => {
  it("pin() and local() are inverse in 3D, on a body that has turned", async () => {
    const ctx = await built("kin:crankRocker");
    const A = polishApi(ctx);
    const p = A.pin("coupler", [10, 5, 3]);
    const back = A.local("coupler", p);
    expect(back[0]).toBeCloseTo(10, 6);
    expect(back[1]).toBeCloseTo(5, 6);
    expect(back[2]).toBeCloseTo(3, 6);
    // a named point of the record
    const k = ctx.kin.points?.[0];
    if (k) expect(A.pin("ground", k.id)).toHaveLength(3);
  });

  it("an addition builds on a frame of a body and is logged", async () => {
    const ctx = await built("kin:crankRocker");
    const A = polishApi(ctx);
    const f = A.frame("rocker", [0, 0, 0]);
    const out = A.build(f, (L, h) => L.add(h.nipple("extra-nipple", { z0: 0, z1: 9 })), { body: "rocker" });
    expect(out).toHaveLength(1);
    expect(A.get("extra-nipple")?.body).toBe("rocker");
    expect(A.log.added).toContain("extra-nipple");
  });

  it("never removes a post or a plate unless the record names it (T12)", async () => {
    const ctx = await built("kin:crankRocker");
    const A = polishApi(ctx);
    const base = ctx.solids.find((s) => s.kind === "base" || s.kind === "foot" || s.kind === "bridge");
    expect(base).toBeDefined();
    expect(() => A.drop(base!.id)).toThrow(/never removed/);
    const part = ctx.solids.find((s) => s.kind === "part")!;
    expect(() => A.drop(part.id)).toThrow(/principle part|never/);
    // hardware that is not a support may go
    const nipple = A.build(A.frame("rocker", [0, 0, 0]), (L, h) => L.add(h.nipple("gone", { z0: 0, z1: 9 })), { body: "rocker" })[0]!;
    expect(A.drop(nipple.id)).toHaveLength(1);
  });

  it("a record can name a support it allows removed, with its reason", async () => {
    const ctx = await built("kin:crankRocker", { teaching: { exceptions: [] } });
    ctx.teaching = { ...(ctx.teaching ?? {}), exceptions: [{ solid: "foot0", reason: "the fork end replaces it" }] } as never;
    const A = polishApi(ctx);
    expect(A.drop("foot0")).toHaveLength(1);
    expect(A.log.dropped).toEqual(["foot0"]);
  });
});
