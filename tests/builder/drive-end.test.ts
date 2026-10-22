// The drive of a shaft in plan (rules/drive.ts onFreeEnd, for the belt drive and the oscillating lever) takes the shaft's
// far end when the low end faces the eye in the default view, but only where the drive built there keeps clear of the
// moving parts' sweeps; else the low end, the far end's stub as long as with no drive asked there.
import { describe, expect, it } from "vitest";
import type { RecordLike } from "../../src/builder/ctx";
import { viewDirection } from "../../src/builder/view";
import { check3d, recordSource } from "../../src/checks";
import { v3, type Vec3 } from "../../src/kin/math";
import { fixtureRecord } from "./fixtures";

/** The shaft that carries the drive's pulley or lever, which end that part is on, whether the shaft's low end faces the
 * eye in the default view, and the clashes of the drive's parts over the cycle (A15). */
async function driveEnd(rec: RecordLike) {
  const src = await recordSource(rec);
  const onShaft = src.solids.find((s) => s.id === "drive-pulley-shaft" || s.id === "drive-lever")!;
  const axle = src.solids.find((s) => s.id.endsWith("-axle") && s.body === onShaft.body)!;
  const z = axle.frame.z as Vec3;
  const h = axle.op.op === "extrude" ? axle.op.h : 0;
  const t = v3.dot(v3.sub(onShaft.frame.o as Vec3, axle.frame.o as Vec3), z);
  const view = viewDirection(rec.teaching?.view as string | undefined, () => undefined);
  const r = await check3d(src, "full", { cache: false });
  const clashes = r.clash.clashes.filter((c) => c.a.startsWith("drive") || c.b.startsWith("drive"));
  return { src, h, onShaft, onFar: t > h / 2, faces: v3.dot(z, view) > 0.5, clashes };
}

describe("the drive's end of a shaft in plan", () => {
  it("takes the far end when the low end faces the eye and the drive there is clear (desmodromic cam)", async () => {
    const d = await driveEnd(fixtureRecord("desmodromic-cam"));
    expect(d.faces).toBe(true);
    expect(d.onFar).toBe(true);
    expect(d.clashes).toEqual([]);
  });

  it("keeps the low end when a link is overhung on the far end (Bennett)", async () => {
    const d = await driveEnd(fixtureRecord("bennett-linkage"));
    expect(d.faces).toBe(true);
    expect(d.onFar).toBe(false);
    expect(d.clashes).toEqual([]);
  });

  it("puts an oscillating lever on the low end when the far end is refused, the shaft as with no drive asked there (Sarrus)", async () => {
    const rec = fixtureRecord("sarrus-linkage");
    const d = await driveEnd(rec);
    expect(d.onShaft.id).toBe("drive-lever");
    expect(d.faces).toBe(true);
    expect(d.onFar).toBe(false);
    expect(d.clashes).toEqual([]);
    // the shaft stands too low over the base for the fork to hang under the hub: it sits beside it, on a post
    const post = d.src.solids.find((s) => s.id === "drive-sensor-post")!;
    expect(post.op.op === "extrude" ? post.op.h : 0).toBeGreaterThan(5);
    // seen in plan nothing faces the eye: the same shaft, its lever in the same place
    const plan = await driveEnd({ ...rec, teaching: { ...rec.teaching, view: "PLAN" } } as RecordLike);
    expect(plan.faces).toBe(false);
    expect(d.h).toBeCloseTo(plan.h, 9);
    for (const i of [0, 1, 2]) expect(d.onShaft.frame.o[i]).toBeCloseTo(plan.onShaft.frame.o[i]!, 9);
  });
});
