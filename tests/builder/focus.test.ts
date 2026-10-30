import { describe, expect, it } from "vitest";
import { FLAG3, hasFlag3 } from "../../src/package/format2";
import { buildPackage } from "../../src/package/build";

describe("the part to watch (T18)", () => {
  it("flags a body's own part, never the hardware or bearings on it", async () => {
    const b = await buildPackage("wobble-box");
    const focus = b.pkg.solids.filter((s) => hasFlag3(s, "focus"));
    expect(focus.map((s) => s.id)).toEqual(["ring"]);
    // the ring's bearings stay as they are
    expect(b.pkg.solids.filter((s) => s.body === "ring" && s.role === "bearing").some((s) => hasFlag3(s, "focus"))).toBe(false);
    expect(b.pkg.solids.some((s) => hasFlag3(s, "cover"))).toBe(false);
  }, 120_000);

  it("flags the solids of one kind on a body, and the rest of that body as their cover, never its screws", async () => {
    const b = await buildPackage("ball-screw");
    const nut = b.pkg.solids.filter((s) => s.body === "nut");
    expect(nut.filter((s) => hasFlag3(s, "focus")).every((s) => s.kind === "roller")).toBe(true);
    expect(nut.filter((s) => s.kind === "roller").every((s) => hasFlag3(s, "focus"))).toBe(true);
    expect(nut.find((s) => s.id === "nut")!.flags & FLAG3.cover).toBeTruthy();
    expect(nut.filter((s) => s.kind === "head" || s.kind === "shank").some((s) => hasFlag3(s, "cover"))).toBe(false);
  }, 120_000);
});
