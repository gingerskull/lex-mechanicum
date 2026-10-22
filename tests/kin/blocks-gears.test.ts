// The gear blocks the rebuild of the gears added, on their records: a mesh carried round by its carrier (a disc on an
// eccentric against ring pins), follow (an output flange turning with its disc), wave (a flexspline's segments bent
// round the oval), a gear on a moving centre (sun and planet), a non-circular pair's contact on the line of centres and
// the Ravigneaux set at each option of its gear selector.
import { describe, expect, it } from "vitest";
import { Kinematics, TAU, verifyK1, xf, type K1Report } from "../../src/kin";
import { ravigneaux } from "../../src/kin/blocks/gears";
import { selectorOption } from "../../src/kin/compose";
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

  it("ravigneaux: the four gears from the tooth counts, a lock turns the set as one, a free set is refused", () => {
    const z = { zSs: 30, zSl: 36, zPs: 18, zPl: 24, zR: 84 };
    expect(ravigneaux(z, 1, "sunS", "carrier", null).ring).toBeCloseTo(30 / 84, 12);
    const second = ravigneaux(z, 1, "sunS", "sunL", null);
    expect(second.carrier).toBeCloseTo(30 / 66, 12);
    expect(second.ring).toBeCloseTo((30 / 66) * (120 / 84), 12);
    // the long pinion meshes the short one and the large sun: both give its spin on the pin
    expect(second.long).toBeCloseTo(-(36 / 24) * (second.sunL - second.carrier), 12);
    const third = ravigneaux(z, 1, "sunS", null, ["sunS", "carrier"]);
    for (const m of ["sunL", "carrier", "ring"] as const) expect(third[m]).toBeCloseTo(1, 12);
    expect(third.short).toBeCloseTo(0, 12);
    expect(ravigneaux(z, 1, "sunL", "carrier", null).ring).toBeCloseTo(-36 / 84, 12);
    expect(() => ravigneaux(z, 1, "sunS", "sunS", null)).toThrow();
  });

  it("ravigneaux: every option of the gear selector solves with K1, and an option sets the cycle", () => {
    const k = new Kinematics(kin("ravigneaux"));
    const d = k.kin.drivers.find((x) => x.kind === "select")!;
    expect(selectorOption(d)).toMatchObject({ id: "2nd", cycle: 792 });
    expect(selectorOption(d, "reverse")).toMatchObject({ set: { "input-member": "sunL" } });
    for (const gear of ["1st", "2nd", "3rd", "reverse"]) {
      const r = verifyK1(k, { controls: { select: { gear } } });
      expect(r.ok, `${gear} ${rep(r)}`).toBe(true);
    }
    // 2nd: one carrier turn per cycle (792 deg of input), the large sun held
    const p = k.pose(TAU / 4, { select: { gear: "2nd" } });
    expect(p.values.input).toBeCloseTo(198, 9);
    expect(p.values["carrier-turn"]).toBeCloseTo(90, 9);
    expect(p.values["sunL-turn"]).toBeCloseTo(0, 9);
    // reverse: the large sun is the input and the ring runs backwards
    const q = k.pose(TAU / 4, { select: { gear: "reverse" } });
    expect(q.values["sunL-turn"]).toBeCloseTo(90, 9);
    expect(q.values["ring-turn"]).toBeCloseTo((-36 / 84) * 90, 9);
  });
});
