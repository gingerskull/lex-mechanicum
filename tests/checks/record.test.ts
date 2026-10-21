// The K checks of a record (K1 residual, K2, branch continuity, K11, the claim table T9) on the kinematic library's
// fixtures, with a negative control for each.
import { describe, expect, it } from "vitest";
import { checkClaims, type Claim } from "../../src/checks/claims";
import { checkRecord } from "../../src/checks/record";
import { Kinematics } from "../../src/kin";
import type { Kin } from "../../src/kin/types";
import { crankRocker, universalJoint } from "../kin/fixtures";

const record = (kin: Kin, claims: Claim[] = [], extra: Record<string, unknown> = {}) => ({ id: "fx", kin, dof: 1, motion: { plane: "Planar" }, teaching: { claims }, ...extra });

/** The rocker angle over the cycle, straight from the library. */
function rocker(): number[] {
  const K = new Kinematics(crankRocker());
  return Array.from({ length: 720 }, (_, i) => K.pose((i / 720) * Math.PI * 2).outputs["rocker-angle"] as number);
}

describe("checkRecord", () => {
  it("passes the crank-rocker: K1 residual within tolerance, periodic, mobility 1", async () => {
    const r = await checkRecord(record(crankRocker()));
    expect(r.findings).toEqual([]);
    expect(r.solved).toBe(true);
    expect(r.k1!.maxResidual).toBeLessThan(1e-9);
    expect(r.mobility).toEqual({ counted: 1, dof: 1, ok: true });
  });

  it("reports a wrong dof, and accepts an overconstrained mechanism that says so", async () => {
    const wrong = await checkRecord(record(crankRocker(), [], { dof: 2 }));
    expect(wrong.findings.map((f) => f.type)).toEqual(["MOBILITY"]);
    const said = await checkRecord(record(crankRocker(), [], { dof: 2, topology: { notes: "overconstrained: the loop has a redundant link" } }));
    expect(said.findings).toEqual([]);
  });

  it("reports a record that does not solve instead of throwing", async () => {
    const kin = crankRocker();
    kin.solve = [{ block: "no-such-block", id: "x", in: {} }];
    const r = await checkRecord(record(kin));
    expect(r.solved).toBe(false);
    expect(r.findings[0]).toMatchObject({ type: "UNSOLVED" });
    expect(r.findings[0]!.detail).toMatch(/unknown block/);
  });

  it("finds a coupler whose declared length does not fit the geometry (a negative control for K1)", async () => {
    const kin = crankRocker();
    kin.params = kin.params!.map((p) => (p.id === "c" ? { ...p, value: 400 } : p));
    const r = await checkRecord(record(kin));
    expect(r.findings.map((f) => f.type)).toEqual(["K1", "K1"]);
    expect(r.findings[0]!.detail).toMatch(/residual 1\.\de\+3 at A/);
  });

  it("reads a record with no kin block as MISSING", async () => {
    expect((await checkRecord({ id: "bare" } as never)).findings).toEqual([{ type: "MISSING", detail: 'no kin block in record "bare"' }]);
  });

  it("checks the universal joint, whose concurrent axes the record calls overconstrained", async () => {
    const r = await checkRecord(record(universalJoint(), [], { motion: { plane: "Spatial" }, topology: { notes: "overconstrained (concurrent axes)" } }));
    expect(r.k1!.maxResidual).toBeLessThan(1e-9);
  });
});

describe("the claim table (T9)", () => {
  const th = rocker();
  const lo = Math.min(...th);
  const hi = Math.max(...th);
  const claim = (stat: string, value: number, extra: Partial<Claim> = {}): Claim => ({ text: stat, output: "rocker-angle", stat, value, tol: 0.05, ...extra });
  const run = (claims: Claim[]) => checkClaims(new Kinematics(crankRocker()), claims, crankRocker().outputs!);

  it("agrees with the motion on range, max, min and mean", () => {
    const r = run([claim("range", hi - lo), claim("max", hi), claim("min", lo), claim("mean", th.reduce((a, b) => a + b, 0) / th.length)]);
    expect(r.map((x) => x.status)).toEqual(["ok", "ok", "ok", "ok"]);
  });

  it("calls a wrong number off, with the value the motion gives", () => {
    const [r] = run([claim("range", hi - lo + 3)]);
    expect(r).toMatchObject({ status: "off" });
    expect(r!.got).toBeCloseTo(hi - lo, 6);
  });

  it("reads `at` as a driver value inside the input range", () => {
    const K = new Kinematics(crankRocker());
    const v = K.poseAt({ input: 90 }).outputs["rocker-angle"] as number;
    const [r] = run([claim("at", v, { at: 90 })]);
    expect(r!.status).toBe("ok");
  });

  it("measures a ratio and a dwell, and leaves what it cannot compute as uncheckable", () => {
    // the rocker swings and returns: no net turn per input turn
    const [ratio] = run([claim("ratio", 0)]);
    expect(ratio!.status).toBe("ok");
    const [missing] = run([{ text: "x", output: "no-such-output", stat: "max", value: 1, tol: 1 }]);
    expect(missing).toMatchObject({ status: "uncheckable", why: "no output no-such-output" });
    const [over] = run([claim("max", 1, { over: "speed" })]);
    expect(over!.status).toBe("uncheckable");
  });
});
