// The records the builder's tests build: the catalogue's own where its kin block poses, and the kinematic library's
// fixtures (tests/kin) otherwise, bent where a rule needs a joint kind they do not have. A registry fixture name is
// "kin:<name>" for these, or a catalogue id.
import { recordById } from "../../src/catalog";
import type { RecordLike } from "../../src/builder/ctx";
import type { Kin } from "../../src/kin";
import * as F from "../kin/fixtures";

type Maker = () => RecordLike;

const rec = (id: string, kin: Kin, teaching?: unknown): RecordLike => ({ id, kin, ...(teaching ? { teaching: teaching as RecordLike["teaching"] } : {}) });

const withJoint = (kin: Kin, id: string, patch: Record<string, unknown>): Kin => ({ ...kin, joints: kin.joints.map((j) => (j.id === id ? ({ ...j, ...patch } as typeof j) : j)) });
const withBody = (kin: Kin, id: string, patch: Record<string, unknown>): Kin => ({ ...kin, bodies: kin.bodies.map((b) => (b.id === id ? ({ ...b, ...patch } as typeof b) : b)) });

const MAKERS: Record<string, Maker> = {
  sliderCrank: () => rec("sliderCrank", F.sliderCrank()),
  gearPair: () => rec("gearPair", F.gearPair()),
  rackPinion: () => rec("rackPinion", F.rackPinion()),
  planetary: () => rec("planetary", F.planetary()),
  camFollower: () => rec("camFollower", F.camFollower()),
  leadScrew: () => rec("leadScrew", F.leadScrew()),
  geneva: () => rec("geneva", F.geneva()),
  escapement: () => rec("escapement", withJoint(withBody(F.escapement(), "pallet", { role: "link" }), "Rp", { type: "cam-contact", a: "pallet", b: "wheel", at: [0, 30, 0], follower: "flat" })),
  flexureHinge: () => rec("flexureHinge", F.flexureHinge()),
  beltDrive: () => rec("beltDrive", F.beltDrive()),
  universalJoint: () => rec("universalJoint", F.universalJoint()),
  bennett: () => rec("bennett", F.bennett()),
  crankRocker: () => rec("crankRocker", F.crankRocker()),
  crossedMesh: () => rec("crossedMesh", withJoint(F.gearPair(), "M", { crossed: true })),
  pinLobe: () => rec("pinLobe", withBody(F.camFollower(), "cam", { role: "star" })),
  chainDrive: () => rec("chainDrive", withJoint(F.beltDrive(), "B", { flexible: "chain" })),
  // a flexible member that is neither a timing belt, a chain nor a rope: the generic idler (j12-other)
  cableLoop: () => rec("cableLoop", withJoint(F.beltDrive(), "B", { flexible: "cable" })),
  rope: () => rec("rope", withJoint(withJoint(F.beltDrive(), "B", { flexible: "rope" }), "B", { a: "ground" })),
  // the Geneva wheel's pin in a fork: a pin-in-slot whose slot is a fork's
  fork: () => {
    const k = F.geneva();
    return rec("fork", { ...k, joints: k.joints.map((j) => (j.type === "pin-in-slot" ? ({ ...j, note: "pin in a fork" } as unknown as typeof j) : j)) });
  },
  // a cam with a groove: the follower is held by form
  grooveCam: () => rec("grooveCam", withJoint(F.camFollower(), "C", { closure: "form" })),
  ratchet: () => rec("ratchet", withJoint(withBody(F.escapement(), "pallet", { role: "pawl" }), "Rp", { type: "cam-contact", a: "pallet", b: "wheel", at: [0, 30, 0], follower: "knife" })),
  tongueSlot: () => rec("tongueSlot", withJoint(F.sliderCrank(), "P", { note: "tongue in its slot" })),
  ringHub: () => rec("ringHub", withBody(withJoint(F.crankRocker(), "B", { type: "spherical" }), "coupler", { shape: { type: "cage" } })),
  ringRollers: () => rec("ringRollers", withJoint(withBody(F.gearPair(), "g2", { role: "sprags" }), "M", { type: "rolling" })),
  // a plate no joint reaches, standing off the base
  fixedPlate: () => rec("fixedPlate", { ...F.crankRocker(), bodies: [...F.crankRocker().bodies, { id: "frame", role: "frame", shape: { type: "plate", outline: [[0, 0], [60, 0], [60, 30]], boss: 6 }, frame: { o: [-80, -60, 14] } }] }),
  fourBarHung: () => rec("fourBarHung", F.crankRocker(), { principle: [{ body: "crank" }, { body: "coupler" }, { body: "rocker" }], view: "PLAN", traces: [] }),
  adjustableLink: () => {
    const k = F.crankRocker();
    return rec("adjustableLink", withBody(k, "coupler", { shape: { type: "link", length: 80, boss: [9, 9], adjustable: true } }));
  },
};

/** A registry fixture name as a record. */
export function fixtureRecord(name: string): RecordLike {
  if (name.startsWith("kin:")) {
    const m = MAKERS[name.slice(4)];
    if (!m) throw new Error(`no builder fixture ${name}`);
    return m();
  }
  const r = recordById(name);
  if (!r) throw new Error(`no record ${name}`);
  return r;
}

export const fixtureNames = Object.keys(MAKERS);
