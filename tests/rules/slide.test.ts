// J5 as a few blocks (standard 2.4): on the fixture slider-crank and on the mechanisms with slides, the slide's parts
// are few, the slider stays on its rails at both stroke ends, a stop stands past each end, every block is screwed, and
// a rail seat leaves room where a moving part passes under the rail.
import { describe, expect, it } from "vitest";
import { bbox } from "../../src/core/geom";
import { toLocal } from "../../src/core/poly";
import { assembleWith } from "../../src/assemble";
import type { Solid } from "../../src/hardware/solid";
import { railLayout } from "../../src/hardware/sub/slide";
import whitworth from "../../src/mechanisms/whitworth/model";
import { createContext } from "../../src/rules/context";
import { runRules } from "../../src/rules/registry";
import type { SlideJoint } from "../../src/rules/types";
import { j5Model } from "../fixtures/models";

const built = () => {
  const ctx = createContext(j5Model);
  runRules(ctx);
  return ctx;
};

/** The parts a fitter handles for one slide: a screw is one part, model parts are not counted. */
function slideParts(solids: Solid[], jids: string[], modelIds: string[]): Solid[] {
  const seen = new Set<string>();
  return solids.filter((s) => {
    if (modelIds.includes(s.id) || !s.joints.some((j) => jids.includes(j))) return false;
    const g = s.kind === "nut" ? s.id : (s.group ?? s.id);
    if (seen.has(g)) return false;
    seen.add(g);
    return true;
  });
}

describe("J5 slide as a few blocks", () => {
  it("is at most about half the parts of the 2.3 slide (41 on this fixture)", () => {
    const { assembly } = assembleWith(j5Model);
    const parts = slideParts(assembly.solids, ["slide-block", "raila-seat", "railb-seat"], j5Model.parts.map((p) => p.id));
    expect(parts.length).toBeLessThanOrEqual(21);
    const kinds = new Set(parts.map((s) => s.kind));
    for (const k of ["setScrew", "nut", "shim"]) expect(kinds.has(k as never)).toBe(false);
  });

  it("keeps the slider on its rails at both ends of the stroke", () => {
    const ctx = built();
    const j = ctx.info.find((x) => x.kind === "slide") as SlideJoint;
    const [sx0, , sx1] = bbox(j.slider.shape.outer);
    for (const r of j.rails) {
      const [x0, , x1] = bbox(r.shape.outer);
      for (const t of j.range) {
        // the slider's ends, in the rail's frame, at this end of the stroke
        const a = toLocal(r.fixed!, [t * j.axis[0] + sx0 * j.axis[0], t * j.axis[1] + sx0 * j.axis[1]])[0];
        const b = toLocal(r.fixed!, [t * j.axis[0] + sx1 * j.axis[0], t * j.axis[1] + sx1 * j.axis[1]])[0];
        expect(Math.min(a, b)).toBeGreaterThanOrEqual(x0 - 1e-6);
        expect(Math.max(a, b)).toBeLessThanOrEqual(x1 + 1e-6);
      }
    }
  });

  it("puts an end stop block with a pad just past each end of the travel, each screwed down", () => {
    const ctx = built();
    const j = ctx.info.find((x) => x.kind === "slide") as SlideJoint;
    const [sx0, , sx1] = bbox(j.slider.shape.outer);
    const along = (s: Solid) => bbox(s.outer).filter((_, i) => i % 2 === 0) as [number, number];
    const [u0] = along(ctx.get("slide-block-stop0")!);
    const [, v1] = along(ctx.get("slide-block-stop1")!);
    expect(u0).toBeGreaterThan(j.range[1] + sx1);
    expect(v1).toBeLessThan(j.range[0] + sx0);
    for (const k of [0, 1]) {
      expect(ctx.get(`slide-block-bump${k}`)).toBeDefined();
      expect(ctx.get(`slide-block-stop${k}-sc`)?.kind).toBe("head");
    }
    expect(ctx.joint("slide-block")!.serves.F5).toHaveLength(2);
  });

  it("serves every guide function from its few parts", () => {
    const ctx = built();
    const s = ctx.joint("slide-block")!.serves;
    expect(s.F2).toEqual(["slide-block-keeper"]);
    expect(s.F7).toEqual(["slide-block-gib"]);
    expect(s.F8).toEqual(["slide-block-wiper0", "slide-block-wiper1", "slide-block-nipple"]);
    expect(ctx.joint("railb-seat")!.serves.F1).toEqual(["railb-seat0-dowel", "railb-seat1-dowel"]);
  });

  it("seats a rail on pads clear of a part that passes under it (Whitworth's lever under the rails' near end)", () => {
    const ctx = createContext(whitworth);
    runRules(ctx);
    const rail = whitworth.parts.find((p) => p.id === "raila")!;
    const { risers, screws } = railLayout(ctx, rail);
    const [x0] = bbox(rail.shape.outer);
    // the seat starts past the lever's sweep, not at the rail's end
    expect(risers[0]![0]).toBeGreaterThan(x0 + 3.5 + 5);
    for (const x of screws) expect(risers.some(([a, b]) => x >= a && x <= b)).toBe(true);
  });
});
