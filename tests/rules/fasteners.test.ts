import { describe, expect, it } from "vitest";
import { roundRect } from "../../src/core/geom";
import { H } from "../../src/hardware/primitives";
import { createContext } from "../../src/rules/context";
import { fasteners } from "../../src/rules/fasteners";
import { j1Model } from "../fixtures/models";

/** Two ground plates stacked at z 0..6 and 6..9, the upper one pre-drilled at (50, 50), a button head on top. */
function stack() {
  const ctx = createContext(j1Model);
  const lower = H.plate("lower", roundRect(30, 30, 70, 70, 3), { z0: 0, z1: 6 });
  const upper = H.plate("upper", roundRect(30, 30, 70, 70, 3), { z0: 6, z1: 9, holes: [H.disc(1.7, 50, 50)] });
  const head = H.head("h", "button", 3, { at: [50, 50, 0], z0: 9, z1: 10.65 });
  ctx.add(lower, upper, head);
  fasteners(ctx);
  return { ctx, lower, upper, head };
}

describe("stage 3 fasteners", () => {
  it("gives a button head over a pre-drilled hole its shank", () => {
    const { ctx } = stack();
    const sh = ctx.get("h-sh")!;
    expect(sh.kind).toBe("shank");
    expect(sh.group).toBe(ctx.get("h")!.group);
    expect([sh.z0, sh.z1]).toEqual([1.5, 9]);
  });

  it("threads the shank only where it engages, not through the clearance hole", () => {
    const { ctx } = stack();
    expect(ctx.get("h-sh")!.threadZ).toEqual([1.5, 6]);
  });

  it("draws a blind tapped hole as a mark, not a hole", () => {
    const { lower, upper } = stack();
    expect(lower.holes).toHaveLength(0);
    expect(lower.marks.filter((m) => m.kind === "thread")).toHaveLength(1);
    // the upper plate's own hole is kept, not doubled
    expect(upper.holes).toHaveLength(1);
  });

  it("stops two screws meeting in a standoff short of its middle", () => {
    const ctx = createContext(j1Model);
    ctx.add(H.standoff("so", { at: [50, 50, 0], z0: 0, z1: 10 }));
    ctx.add(H.screw("a", "button", 5, 12, { at: [50, 50, 0], face: 12, dir: -1 }), H.screw("b", "button", 5, 12, { at: [50, 50, 0], face: -2, dir: 1 }));
    fasteners(ctx);
    const a = ctx.get("a-sh")!;
    const b = ctx.get("b-sh")!;
    expect(a.z0).toBeGreaterThan(b.z1);
  });
});
