// The joint kits (A21): one per joint type. A kit holds the joint's kinematic block, its hardware rule, its explode axis,
// its see-through zone and its detail rungs. The hardware rules are in rules/stacks.ts and rules/contacts.ts; this is the
// table that ties each kit to them, and what the audit and the renderer ask of a joint (E10, T10, DL1).
import { v3, type Vec3 } from "../kin/math";
import { rungOf, type RungId } from "../style/detail";
import type { SolidKind } from "../style/kinds";
import type { BuildCtx } from "./ctx";
import { contactOf } from "./contact";
import type { JointInfo, KitId } from "./sites";

/** A working zone a covering static solid must not hide: a disc round a point on a plane. */
export interface Zone {
  at: Vec3;
  r: number;
  /** What happens there, for the audit. */
  what: string;
}

export interface Kit {
  id: KitId;
  title: string;
  /** Standard rows the kit builds (section 5b). */
  std: string[];
  /** Kinematic blocks (src/kin) that drive the joint. */
  blocks: string[];
  /** The id of the rule in the registry that builds the hardware. */
  rule: string;
  /** What the kit builds, by solid kind: the detail ladder rungs follow from these (DL1). */
  kinds: SolidKind[];
  /** The direction the joint's stack moves along when exploded (E10). */
  explodeAxis(ctx: BuildCtx, j: JointInfo): Vec3;
  /** Where the working of the joint shows and must stay uncovered (T10). */
  zones(ctx: BuildCtx, j: JointInfo): Zone[];
}

const normalOf = (ctx: BuildCtx, j: JointInfo): Vec3 => {
  const c = contactOf(ctx, j);
  return c ? c.frame.z : j.axis;
};

const pinZone = (what: string) => (_ctx: BuildCtx, j: JointInfo): Zone[] => [{ at: j.at, r: 8, what }];

/** The run of a pin or slider on its partner, as a zone about the middle of the run. */
const runZone = (what: string) => (ctx: BuildCtx, j: JointInfo): Zone[] => {
  const c = contactOf(ctx, j);
  if (!c) return [{ at: j.at, r: 10, what }];
  const mid = (c.run[0] + c.run[1]) / 2;
  return [{ at: v3.add(j.at, v3.mul(c.frame.x, mid)), r: Math.max(8, (c.run[1] - c.run[0]) / 2 + 8), what }];
};

const mk = (id: KitId, title: string, std: string[], blocks: string[], rule: string, kinds: SolidKind[], explodeAxis: Kit["explodeAxis"], zones: Kit["zones"]): Kit => ({ id, title, std, blocks, rule, kinds, explodeAxis, zones });
const own: Kit["explodeAxis"] = (_c, j) => j.axis;

export const KITS: Record<KitId, Kit> = {
  J1: mk("J1", "Ground revolute, dead axle", ["J1"], ["dyad"], "j1-dead-axle", ["shaft", "bearing", "spacer", "thrustWasher", "circlipExternal", "circlipInternal", "bridge", "standoff", "bushing"], own, pinZone("the pivot")),
  J2: mk("J2", "Ground revolute, live shaft", ["J2"], ["dyad", "gear-mesh"], "j2-live-shaft", ["shaft", "bearing", "housing", "key", "collar", "setScrew", "waveWasher", "circlipInternal", "dowel"], own, pinZone("the shaft")),
  J3: mk("J3", "Moving revolute", ["J3"], ["dyad"], "j3-moving-pin", ["shaft", "head", "bearing", "spacer", "circlipInternal"], own, pinZone("the pin")),
  J4: mk("J4", "Pin in slot", ["J4"], ["slider-dyad"], "j4-slot-roller", ["roller", "shaft", "wearStrip", "felt"], normalOf, runZone("the run of the roller in the slot")),
  J5: mk("J5", "Prismatic slide", ["J5"], ["slider-dyad"], "j5-slide", ["plate", "gib", "wiper", "nipple", "stop", "bumper", "dowel"], normalOf, runZone("the slider's travel")),
  J6: mk("J6", "Gear mesh", ["J6"], ["gear-mesh", "willis"], "j6-mesh", ["eccentric", "collar"], normalOf, pinZone("the pitch point")),
  J7: mk("J7", "Cam contact", ["J7"], ["cam"], "j7-cam", ["roller", "shaft", "spring", "felt", "bracket"], normalOf, pinZone("the cam contact")),
  J8: mk("J8", "Belt", ["J8"], ["convey"], "j8-belt", ["pulley", "bearing", "bracket"], normalOf, pinZone("the belt's wrap")),
  J9: mk("J9", "Crossed-axis mesh", ["J9"], ["gear-mesh"], "j9-crossed-mesh", ["shim", "thrustWasher"], normalOf, pinZone("the pitch point")),
  J10: mk("J10", "Shaft in plan", ["J10"], ["dyad", "hooke"], "j10-shaft-in-plan", ["shaft", "bearing", "housing", "collar", "setScrew", "circlipInternal"], own, pinZone("the shaft")),
  J11: mk("J11", "Screw", ["J11"], ["screw"], "j11-screw", ["collar", "plate", "wiper"], own, runZone("the nut's travel")),
  J12: mk("J12", "Flexible member", ["J12", "J8"], ["convey"], "j12-flexible", ["pulley", "bearing", "bracket"], normalOf, pinZone("the span")),
  J13: mk("J13", "Compliant joint", ["J13"], ["flexure"], "j13-compliant", ["stop", "plate", "dowel"], own, pinZone("the neck")),
  pallet: mk("pallet", "Pallet contact", ["J7"], ["escapement"], "pallet-contact", ["wearStrip", "setScrew"], normalOf, pinZone("the pallet face")),
  "fork-pin": mk("fork-pin", "Fork and pin", ["J4"], ["escapement"], "fork-pin", ["roller", "dowel"], normalOf, pinZone("the fork mouth")),
  "pawl-tooth": mk("pawl-tooth", "Pawl and tooth", ["J7"], ["cam", "escapement"], "pawl-tooth", ["spring", "head"], normalOf, pinZone("the tooth")),
  "pin-lobe": mk("pin-lobe", "Pin and lobe", ["J4"], ["cam"], "pin-lobe", ["roller", "shaft", "wearStrip", "felt"], normalOf, runZone("the pin in the lobe")),
  "tongue-slot": mk("tongue-slot", "Tongue in slot", ["J5"], ["dyad", "slider-dyad"], "tongue-slot", ["wearStrip", "nipple"], normalOf, runZone("the tongue in its slot")),
  "ring-hub": mk("ring-hub", "Ring on hub", ["J3"], ["homokinetic", "hooke"], "ring-hub", ["retainerPlate"], own, pinZone("the ring")),
  "ring-rollers": mk("ring-rollers", "Ring on rollers", ["J6"], ["gear-mesh"], "ring-rollers", ["washer"], normalOf, pinZone("the rollers")),
  "strap-sheave": mk("strap-sheave", "Strap on sheave", ["J12"], ["convey"], "strap-sheave", ["dowel", "collar", "plate"], normalOf, pinZone("the wrap on the sheave")),
  "cross-pin": mk("cross-pin", "Yoke pin in a universal joint's cross", ["J3"], ["hooke"], "cross-bearings", ["bearing", "circlipInternal", "nipple"], own, pinZone("the cross")),
  trunnion: mk("trunnion", "Cylinder trunnion in a port face", ["J1"], ["slider-dyad"], "trunnion", ["shaft", "bushing", "thrustWasher", "spring", "nut", "washer"], own, pinZone("the port face")),
  "piston-bore": mk("piston-bore", "Piston in its bore", ["J5"], ["slider-dyad"], "piston-bore", ["wearStrip"], own, pinZone("the bore")),
  eccentric: mk("eccentric", "Sheave in its strap", ["J3"], ["dyad", "slider-dyad"], "eccentric", ["bushing", "washer", "nipple"], own, pinZone("the sheave in its strap")),
  die: mk("die", "Die in a curved link", ["J4"], ["dyad"], "die", ["roller", "shaft"], normalOf, pinZone("the die in the link's slot")),
  "groove-cam": mk("groove-cam", "Groove cam", ["J7"], ["cam"], "groove-cam", ["roller", "shaft", "wearStrip", "felt"], normalOf, runZone("the roller in the groove")),
};

/** The detail ladder rungs a kit's hardware sits on, from the kinds it builds (DL1). */
export const rungsOf = (k: Kit): RungId[] => [...new Set(k.kinds.map((kind) => rungOf({ kind, role: "hw" }).id))];
