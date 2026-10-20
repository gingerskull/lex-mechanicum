// Joints read from the record (A1): every declared joint is classified to a kit, and revolute joints that share a
// point and an axis (the crank pin that joins the crank and two bars) are one site, the unit of an axial stack.
// Nothing is inferred from overlapping outlines.
import type { Setup } from "../kin/compose";
import type { Kin, KinJoint } from "../kin/types";
import type { ResolvedJoint } from "../kin/residual";
import { type Vec3, v3 } from "../kin/math";
import { canon, parallel } from "./frames";

/** The kits: today's J1 to J13 and the kinds the audits found missing. */
export const KIT_IDS = [
  "J1", "J2", "J3", "J4", "J5", "J6", "J7", "J8", "J9", "J10", "J11", "J12", "J13",
  "pallet", "fork-pin", "pawl-tooth", "pin-lobe", "tongue-slot", "ring-hub", "ring-rollers", "strap-sheave", "groove-cam",
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
  kit: "J1" | "J2" | "J3" | "J10";
  /** The axis is not the base normal: a shaft in plan or a tilted one (J10). */
  inPlan: boolean;
}

/** The base normal. */
export const UP: Vec3 = [0, 0, 1];

const KEYED = new Set(["gear", "ringGear", "pulley", "sprocket", "cam", "disc", "rack"]);
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
  switch (j.type) {
    case "revolute":
    case "cylindrical":
    case "spherical":
    case "universal": {
      const ground = j.a === "ground" || j.b === "ground";
      if (!ground) return j.type === "spherical" && (any("cage") || a?.shape?.type === "cage" || b?.shape?.type === "cage") ? "ring-hub" : "J3";
      return parallel(axis, UP) ? "J1" : "J10";
    }
    case "prismatic":
      return /tongue/i.test(text(rec.note)) ? "tongue-slot" : "J5";
    case "pin-in-slot": {
      const s = text(j.slot) + text(rec.slot);
      if (/fork/i.test(s) || /fork/i.test(text(rec.note))) return "fork-pin";
      if (/groove/i.test(s)) return "groove-cam";
      return "J4";
    }
    case "gear-mesh":
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
  const keyedBody = (id: string) => {
    const b = kin.bodies.find((q) => q.id === id);
    if (!b) return false;
    if (KEYED.has(String(b.shape?.type))) return true;
    return kin.joints.some((j) => (j.type === "gear-mesh" || j.type === "belt" || j.type === "screw") && (j.a === id || j.b === id));
  };
  for (const s of sites) {
    s.inPlan = !parallel(s.axis, UP);
    s.live = s.fixed && (s.joints.some((id) => driven.has(id)) || s.bodies.some(keyedBody));
    s.kit = s.fixed ? (s.inPlan ? "J10" : s.live ? "J2" : "J1") : "J3";
    for (const id of s.joints) joints.find((q) => q.id === id)!.kit = s.kit;
  }
  return { joints, sites };
}
