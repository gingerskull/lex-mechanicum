// Joints read from the record (A1): every declared joint is classified to a kit, and revolute joints that share a
// point and an axis (the crank pin that joins the crank and two bars) are one site, the unit of an axial stack.
// Nothing is inferred from overlapping outlines.
import type { Setup } from "../kin/compose";
import type { Kin, KinBody, KinJoint } from "../kin/types";
import type { ResolvedJoint } from "../kin/residual";
import { type Vec3, v3 } from "../kin/math";
import { canon, parallel } from "./frames";
import { isScrew } from "./threads";

/** The kits: today's J1 to J13 and the kinds the audits found missing. */
export const KIT_IDS = [
  "J1", "J2", "J3", "J4", "J5", "J6", "J7", "J8", "J9", "J10", "J11", "J12", "J13",
  "pallet", "fork-pin", "pawl-tooth", "pin-lobe", "tongue-slot", "ring-hub", "ring-rollers", "strap-sheave", "groove-cam",
  "cross-pin", "trunnion", "piston-bore", "ring-carrier", "eccentric-bearing", "pin-ring", "pin-hole", "spider-pin",
  "ball-socket", "slipper", "sphere-fit", "eccentric", "die", "hub", "ball-cage",
  "leg-bore",
] as const;
export type KitId = (typeof KIT_IDS)[number];

export interface JointInfo {
  id: string;
  joint: KinJoint;
  r: ResolvedJoint;
  kit: KitId;
  a: string;
  b: string;
  at: Vec3;
  axis: Vec3;
  /** Set for a joint on a pin site. */
  site?: string;
}

/** A pin site: revolute-type joints at one point on parallel axes. Its bodies share one stack. */
export interface Site {
  id: string;
  at: Vec3;
  axis: Vec3;
  joints: string[];
  /** Bodies of the site other than the ground. */
  bodies: string[];
  fixed: boolean;
  /** A fixed pin that drives: the input, or one that turns a keyed part (A2). */
  live: boolean;
  /** A driver turns one of its joints (the drive is under the base, so its shaft stands on the base). */
  driven?: boolean;
  /** Another fixed site holds the same axis under this one (a large sun's shaft over the small sun's). */
  axisBelow?: boolean;
  kit: "J1" | "J2" | "J3" | "J10";
  /** The axis is not the base normal: a shaft in plan or a tilted one (J10). */
  inPlan: boolean;
  /** A kit that builds the site itself (a screw is its own shaft: J11 builds its journals and blocks). */
  owner?: KitId;
}

/** The base normal. */
export const UP: Vec3 = [0, 0, 1];

const KEYED = new Set(["gear", "ringGear", "pulley", "sprocket", "cam", "disc", "rack", "shaft"]);
const REVOLUTE_LIKE = new Set(["revolute", "cylindrical", "spherical"]);
const text = (v: unknown): string => (typeof v === "string" ? v : v && typeof v === "object" ? JSON.stringify(v) : "");

/** The kit a joint is built from. Refinements read the joint's follower, slot or flexible kind and its bodies' roles. */
function kitOf(j: KinJoint, kin: Kin, axis: Vec3): KitId {
  const body = (id: string) => kin.bodies.find((b) => b.id === id);
  const a = body(j.a);
  const b = body(j.b);
  const roles = [a?.role, b?.role];
  const any = (r: string) => roles.includes(r);
  const rec = j as unknown as Record<string, unknown>;
  // an integrator's ball: its rolling contacts and the cage that holds it on the carriage (src/builder/integrator.ts)
  const caged = (x: KinBody | undefined) => x?.shape?.type === "slider" && !!(x.shape as Record<string, unknown>).cage;
  if ((j.type === "rolling" && rec.integrator) || (j.type === "spherical" && (caged(a) || caged(b)))) return "ball-cage";
  switch (j.type) {
    case "revolute":
    case "cylindrical":
    case "spherical":
    case "universal": {
      const ground = j.a === "ground" || j.b === "ground";
      // a cylinder that swings on its trunnion turns on a pin in the port face under it
      if (ground && j.type === "revolute" && (a?.shape?.type === "cylinder" || b?.shape?.type === "cylinder")) return "trunnion";
      // a ring gear is open in the middle: it runs on rollers round its rim, not on a centre shaft
      if (ground && j.type === "revolute" && (a?.shape?.type === "ringGear" || b?.shape?.type === "ringGear")) return "ring-carrier";
      // a differential's spider turns on the cross-pin in its case's cage
      if (!ground && j.type === "revolute" && (a?.shape?.cage || b?.shape?.cage)) {
        // a joint across the case's own axis (a side gear on the case's axis turns on its shaft)
        const caseId = a?.shape?.cage ? j.a : j.b;
        const cj = kin.joints.find((q) => (q.a === caseId || q.b === caseId) && (q.a === "ground" || q.b === "ground") && q.axis);
        const ca = cj?.axis as number[] | undefined;
        if (ca && Array.isArray(ca) && ca.every((v) => typeof v === "number")) {
          const dot = Math.abs(ca[0]! * axis[0] + ca[1]! * axis[1] + (ca[2] ?? 0) * axis[2]) / Math.hypot(ca[0]!, ca[1]!, ca[2] ?? 0);
          if (dot < 0.5) return "spider-pin";
        }
      }
      // a disc that runs on an eccentric (a cam whose centre is the pin) turns on a needle ring round it, not on a pin
      if (!ground && j.type === "revolute" && (typeof a?.shape?.offset === "number" || typeof b?.shape?.offset === "number")) return "eccentric-bearing";
      // a yoke's pin into a universal joint's cross turns in needle cups in the yoke's arms
      if (!ground && (a?.shape?.type === "cross" || b?.shape?.type === "cross")) return "cross-pin";
      // a cage's spherical faces on a race and in a bell (a constant-velocity joint)
      if (!ground && j.type === "spherical" && [a, b].some((x) => x?.shape?.type === "cage") && [a, b].some((x) => x?.shape?.type === "race" || x?.shape?.type === "bell")) return "sphere-fit";
      // a ball end in a slipper's socket (a swash plate's piston)
      if (!ground && j.type === "spherical" && (a?.shape?.ball || b?.shape?.ball)) return "ball-socket";
      // a journal as large as a disc is not a pin: a sheave turning in its strap (an eccentric), or a part turning on a
      // fixed hub that carries other pivots (a bull gear round its lever's pivot)
      if (j.type === "revolute" && typeof rec.radius === "number" && rec.radius > 12) return ground ? "hub" : "eccentric";
      // a bent rod's leg sliding and turning in a bore of a turning disc (Hobson's joint)
      if (!ground && j.type === "cylindrical" && (a?.shape?.type === "elbow" || b?.shape?.type === "elbow")) return "leg-bore";
      if (!ground) return j.type === "spherical" && (any("cage") || a?.shape?.type === "cage" || b?.shape?.type === "cage") ? "ring-hub" : "J3";
      return parallel(axis, UP) ? "J1" : "J10";
    }
    case "prismatic":
      if (a?.shape?.type === "piston" || b?.shape?.type === "piston" || a?.shape?.plunger || b?.shape?.plunger) return "piston-bore";
      // a nut's guide: the screw kit builds the anti-rotation with the nut (J11, F3)
      if (kin.joints.some((q) => q.type === "screw" && (q.b === j.a || q.b === j.b) && q.b !== "ground" && isScrew(body(q.a)?.shape as Record<string, unknown> | undefined))) return "J11";
      // a slide held by springs (a pseudo-rigid beam's give, a roller between springs in a window): the compliant kit
      if (rec.spring !== undefined) return "J13";
      return /tongue/i.test(text(rec.note)) ? "tongue-slot" : "J5";
    case "pin-in-slot": {
      // pins on a circle running in round holes larger by the eccentricity (a cycloidal drive's output)
      if ((j.slot as { path?: unknown } | undefined)?.path === "circle") return "pin-hole";
      const s = text(j.slot) + text(rec.slot);
      if (/fork/i.test(s) || /fork/i.test(text(rec.note))) return "fork-pin";
      if (/groove/i.test(s)) return "groove-cam";
      if (j.slot?.arc) return "die";
      return "J4";
    }
    case "gear-mesh":
      // a lobed disc rolling on pins fixed to the ground (a cycloidal drive)
      if ((j.a === "ground" || j.b === "ground") && kin.bodies.find((q) => q.id === "ground")?.shape?.pins) return "pin-ring";
      return j.crossed ? "J9" : "J6";
    case "cam-contact": {
      if (j.follower === "knife" || any("pawl")) return "pawl-tooth";
      if (/pallet|anchor|lever|verge|escape/i.test(`${j.a}${j.b}${j.id}${a?.shape?.type ?? ""}`) || any("escapement")) return "pallet";
      if (rec.closure === "form") return "groove-cam";
      if (j.follower === "roller" && !(a?.shape?.type === "cam" || b?.shape?.type === "cam") && (any("driver") || any("star") || a?.shape?.type === "gear" || b?.shape?.type === "gear")) return "pin-lobe";
      return "J7";
    }
    case "belt": {
      const kind = String(rec.flexible ?? "belt");
      if (kind === "rope" && (j.a === "ground" || j.b === "ground")) return "strap-sheave";
      if (kind === "strap") return "strap-sheave";
      // a plain belt is J8; a declared toothed belt, chain, rope or CVT is J12 (recorded as J8 for the belt)
      return rec.flexible === undefined ? "J8" : "J12";
    }
    case "rolling":
      return any("sprags") || /sprag|roller|ball/i.test(`${j.a}${j.b}`) ? "ring-rollers" : "J6";
    case "screw":
      return "J11";
    case "flexure":
      return "J13";
    case "planar":
      // a slipper's flat face on a plate
      return "slipper";
    default:
      return "J3";
  }
}

export function classifyJoints(kin: Kin, S: Setup): { joints: JointInfo[]; sites: Site[] } {
  const driven = new Set(kin.drivers.map((d) => d.joint).filter((x): x is string => !!x));
  const joints: JointInfo[] = kin.joints.map((j) => {
    const r = S.joints.get(j.id)!;
    return { id: j.id, joint: j, r, kit: kitOf(j, kin, r.axis), a: j.a, b: j.b, at: r.at, axis: canon(r.axis) };
  });
  // sites: revolute-type joints at one point on parallel axes
  const sites: Site[] = [];
  for (const ji of joints) {
    if (!REVOLUTE_LIKE.has(ji.joint.type) || (ji.kit !== "J1" && ji.kit !== "J10" && ji.kit !== "J3")) continue;
    let s = sites.find((q) => v3.dist(q.at, ji.at) < 0.05 && parallel(q.axis, ji.axis));
    if (!s) {
      s = { id: ji.id, at: ji.at, axis: ji.axis, joints: [], bodies: [], fixed: false, live: false, kit: "J3", inPlan: false };
      sites.push(s);
    }
    s.joints.push(ji.id);
    ji.site = s.id;
    for (const id of [ji.a, ji.b]) {
      if (id === "ground") s.fixed = true;
      else if (!s.bodies.includes(id)) s.bodies.push(id);
    }
  }
  // a rope's sheave turns free on its pin (each at its own speed): it is not keyed
  const ropeSheave = (j: KinJoint) => (j as unknown as Record<string, unknown>).flexible === "rope";
  const sheaveOnly = (id: string) => kin.joints.some((j) => j.type === "belt" && ropeSheave(j) && (j.a === id || j.b === id));
  const keyedBody = (id: string) => {
    const b = kin.bodies.find((q) => q.id === id);
    if (!b) return false;
    if (sheaveOnly(id)) return false;
    if (KEYED.has(String(b.shape?.type))) return true;
    return kin.joints.some((j) => (j.type === "gear-mesh" || (j.type === "belt" && !ropeSheave(j)) || j.type === "screw") && (j.a === id || j.b === id));
  };
  for (const s of sites) {
    s.inPlan = !parallel(s.axis, UP);
    s.driven = s.joints.some((id) => driven.has(id));
    s.live = s.fixed && (s.driven || s.bodies.some(keyedBody));
    s.kit = s.fixed ? (s.inPlan ? "J10" : s.live ? "J2" : "J1") : "J3";
    s.axisBelow = s.fixed && sites.some((q) => q !== s && q.fixed && parallel(q.axis, s.axis) && Math.hypot(q.at[0] - s.at[0], q.at[1] - s.at[1]) < 0.5 && q.at[2] < s.at[2] - 0.5);
    // a body that is its own shaft, its ends turned to journals (an integrator's cylinder): src/builder/integrator.ts
    if (s.fixed && s.bodies.some((b) => journalled(kin.bodies.find((q) => q.id === b)))) s.owner = "J10";
    // a variator's shaft is built with its sheave halves (src/builder/cvt.ts)
    if (s.fixed && s.bodies.some((b) => (kin.bodies.find((q) => q.id === b)?.shape as Record<string, unknown> | undefined)?.sheave !== undefined)) s.owner = "J12";
    if (s.fixed && s.bodies.length > 0 && s.bodies.every((b) => isScrew(kin.bodies.find((q) => q.id === b)?.shape as Record<string, unknown> | undefined))) s.owner = "J11";
    for (const id of s.joints) joints.find((q) => q.id === id)!.kit = s.kit;
  }
  return { joints, sites };
}

/** A disc that is its own shaft, its ends turned to journals (shape.journal): an integrator's cylinder. */
export const journalled = (b: KinBody | undefined): boolean => {
  const sh = b?.shape as Record<string, unknown> | undefined;
  return sh?.type === "disc" && sh.journal !== undefined;
};
