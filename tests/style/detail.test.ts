import { describe, expect, it } from "vitest";
import { DETAIL, RUNG_ORDER, rungOf } from "../../src/style/detail";
import { EFFECTS, MARK_KINDS, SOLID_KINDS, SOLID_ROLES } from "../../src/style/kinds";

describe("the detail ladder", () => {
  it("has rungs A to H in order", () => {
    expect(DETAIL.map((r) => r.id)).toEqual(["A", "B", "C", "D", "E", "F", "G", "H"]);
    expect(RUNG_ORDER.at(-1)).toBe("never");
  });

  it("selects only known kinds, roles, mark kinds and effects", () => {
    for (const r of DETAIL) {
      for (const k of r.drops.kinds ?? []) expect(SOLID_KINDS).toContain(k);
      for (const k of r.drops.roles ?? []) expect(SOLID_ROLES).toContain(k);
      for (const k of r.drops.marks ?? []) expect(MARK_KINDS).toContain(k);
      for (const k of r.drops.effects ?? []) expect(EFFECTS).toContain(k);
    }
  });

  it("places every selector on one rung only", () => {
    const seen = new Set<string>();
    for (const r of DETAIL) {
      const all = [
        ...(r.drops.kinds ?? []).map((k) => `kind:${k}`),
        ...(r.drops.roles ?? []).map((k) => `role:${k}`),
        ...(r.drops.marks ?? []).map((k) => `mark:${k}`),
        ...(r.drops.effects ?? []).map((k) => `effect:${k}`),
      ];
      for (const s of all) {
        expect(seen.has(s), s).toBe(false);
        seen.add(s);
      }
    }
  });

  it("maps a washer to D, a chamfer mark to B, a nut to H and a plate to never", () => {
    expect(rungOf({ kind: "washer" }).id).toBe("D");
    expect(rungOf({ mark: "chamfer" }).id).toBe("B");
    expect(rungOf({ kind: "nut" }).id).toBe("H");
    expect(rungOf({ kind: "plate" }).id).toBe("never");
  });

  it("puts every render effect on a rung", () => {
    for (const e of EFFECTS) expect(rungOf({ effect: e }).id).not.toBe("never");
    expect(rungOf({ effect: "grain" }).id).toBe("A");
    expect(rungOf({ effect: "rolePatterns" }).id).toBe("F");
    expect(rungOf({ effect: "hiddenLines" }).id).toBe("G");
  });

  it("lets a solid move up the ladder, never down (DL1)", () => {
    expect(rungOf({ kind: "washer", detail: "H" }).id).toBe("H");
    expect(rungOf({ kind: "washer", detail: "never" }).id).toBe("never");
    expect(rungOf({ kind: "nut", detail: "A" }).id).toBe("H");
  });

  it("carries the view-aware exceptions (DL3)", () => {
    expect(DETAIL.find((r) => r.id === "D")?.exceptions).toEqual({ whenExplode: "draw" });
    expect(DETAIL.find((r) => r.id === "B")?.exceptions).toEqual({ atSide: "skip" });
  });
});
