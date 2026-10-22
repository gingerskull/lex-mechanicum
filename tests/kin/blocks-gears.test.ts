// The gear blocks the rebuild of the gears added, on their records: a mesh carried round by its carrier (a disc on an
// eccentric against ring pins), follow (an output flange turning with its disc), wave (a flexspline's segments bent
// round the oval), a gear on a moving centre (sun and planet) and a non-circular pair's contact on the line of centres.
import { describe, expect, it } from "vitest";
import { Kinematics, TAU, verifyK1, xf, type K1Report } from "../../src/kin";
import type { Kin } from "../../src/kin/types";
import { recordById } from "../../src/catalog";

const rep = (r: K1Report): string => JSON.stringify({ ...r, jumps: r.jumps.slice(0, 3), failures: r.failures.slice(0, 3) });
const kin = (id: string) => recordById(id)!.kin as unknown as Kin;
const turn = (X: { R: number[] }) => Math.atan2(X.R[3]!, X.R[0]!);

describe("gear blocks of the rebuild", () => {
  it("cycloidal drive: the disc walks back one lobe per input turn and the flange turns with it", () => {
    const k = new Kinematics(kin("cycloidal-drive"));
    const r = verifyK1(k);
    expect(r.ok, rep(r)).toBe(true);
    // one cycle is 9 input turns; after one input turn the disc and the flange have turned -40 deg
    const p = k.pose(TAU / 9);
    expect((turn(p.bodies.get("disc")!) * 180) / Math.PI).toBeCloseTo(-40, 6);
    expect((turn(p.bodies.get("flange")!) * 180) / Math.PI).toBeCloseTo(-40, 6);
  });

  it("harmonic drive: the flexspline creeps back two teeth per input turn; a segment on the long axis is bent out by w0", () => {
    const k = new Kinematics(kin("harmonic-drive"));
    const r = verifyK1(k);
    expect(r.ok, rep(r)).toBe(true);
    const p = k.pose(TAU / 15);
    expect(p.values["flex-turn"]).toBeCloseTo(-24, 6);
    // a quarter input turn on: the long axis is at 90 deg, so segment 0 (near 0 deg) is pulled in by w0 from its
    // reference, where it stood out by w0
    const q = k.pose(TAU / 60);
    const P0 = xf.apply(q.bodies.get("fs0")!, [32, 0, 0]);
    expect(Math.hypot(P0[0], P0[1])).toBeCloseTo(28, 1);
  });

  it("sun and planet: two sun turns per orbit with equal gears", () => {
    const k = new Kinematics(kin("sun-and-planet"));
    const r = verifyK1(k);
    expect(r.ok, rep(r)).toBe(true);
    // its speed swings with the rod's tilt, so half an orbit is not one turn; a whole orbit is two
    expect(k.pose(TAU).values["sun-turn"]).toBeCloseTo(720, 6);
  });

  it("non-circular gears: the contact runs from 60 to 20 mm along the line of centres", () => {
    const k = new Kinematics(kin("non-circular-gears"));
    const r = verifyK1(k);
    expect(r.ok, rep(r)).toBe(true);
    expect(k.pose(0).values["contact-r1"]).toBeCloseTo(60, 9);
    expect(k.pose(Math.PI).values["contact-r1"]).toBeCloseTo(20, 9);
  });
});
