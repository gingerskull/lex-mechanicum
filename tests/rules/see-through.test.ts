// The see-through stage (L5): a static solid that hides a working zone is drawn see-through; one beside it is not.
import { describe, expect, it } from "vitest";
import { roundRect } from "../../src/core/geom";
import { solid } from "../../src/hardware/solid";
import { createContext } from "../../src/rules/context";
import { runRules } from "../../src/rules/registry";
import { HIDDEN, hiddenShare, seeThrough, zones } from "../../src/rules/see-through";
import { j6Model } from "../fixtures/models";

const built = () => {
  const ctx = createContext(j6Model);
  runRules(ctx);
  return ctx;
};

describe("see-through", () => {
  it("finds the mesh zone at the pitch point", () => {
    const [z] = zones(built());
    expect(z!.joint).toBeTruthy();
    const xs = z!.pts.map((p) => p[0]);
    expect(Math.min(...xs)).toBeGreaterThan(28 - 12.1);
    expect(Math.max(...xs)).toBeLessThan(28 + 12.1);
  });

  it("marks a plate over the mesh see-through and leaves a plate beside it", () => {
    const ctx = built();
    const top = Math.max(...ctx.solids.map((s) => s.z1));
    const over = solid("over", { kind: "bridge", outer: roundRect(-10, -20, 90, 20, 4), z0: top + 1, z1: top + 7 });
    const beside = solid("beside", { kind: "plate", outer: roundRect(0, 60, 80, 90, 4), z0: top + 1, z1: top + 7 });
    ctx.add(over, beside);
    expect(hiddenShare(ctx)[0]!.hidden).toBeGreaterThanOrEqual(HIDDEN);
    seeThrough(ctx);
    expect(over.seeThrough).toBe(true);
    expect(beside.seeThrough).toBeUndefined();
    expect(hiddenShare(ctx)[0]!.hidden).toBe(0);
  });

  it("leaves solids under the gears alone", () => {
    const ctx = built();
    const under = solid("under", { kind: "plate", outer: roundRect(-10, -20, 90, 20, 4), z0: -30, z1: -24 });
    ctx.add(under);
    seeThrough(ctx);
    expect(under.seeThrough).toBeUndefined();
  });
});
