// The rules engine contract (standard 5.1): one module per rule, run in registry order on a shared context.
import type { Pose, Vec2 } from "../core/geom";
import type { Region } from "../core/poly";
import type { Solid } from "../hardware/solid";
import type { Sampled } from "../model/sample";
import type { MechanismModel, Part, Solved } from "../model/types";
import type { Form } from "../style/form";
import type { PartIndex } from "../assemble/pose";

export type JointType = "J1" | "J2" | "J3" | "J4" | "J5" | "J6" | "J7" | "J8";

/** A part a pin passes through, at the assembly phase. */
export interface Joined {
  part: Part;
  /** Pin centre in the part's local frame. */
  L: Vec2;
  /** Distance from the pin centre to the part's outer edge: the boss radius. */
  R: number;
  /** bore: the build bores it; keyed: the model gave it a keyed bore; slot: the pin runs in a slot. */
  how: "bore" | "keyed" | "slot";
  slotW?: number;
  /** Index of the slot hole in the part's holes. */
  hole?: number;
  /** Width of a keyed bore. */
  bore?: number;
  z0: number;
  z1: number;
  moving: boolean;
}

export interface PinJoint {
  kind: "pin";
  id: string;
  type: "J1" | "J2" | "J3" | "J4";
  pin: Part;
  /** World centre at the assembly phase. */
  P: Vec2;
  fixed: boolean;
  /** A fixed pin that drives: the input, or one with a keyed part (A2). */
  live: boolean;
  /** Joined parts, lowest first. */
  joined: Joined[];
  /** Parts that turn with the shaft or bolt. */
  driven: Joined[];
  /** Backlash adjustment requested by a mesh (J6): the housing sits on an eccentric. */
  eccentric?: boolean;
  /** Where the drive mounts on a live input shaft: the free shaft end below the housing. */
  below?: { z0: number; z1: number };
  /** The part the bolt threads into (J3, J4), or the first driven part (J2). */
  anchor: Joined | null;
  /** Shaft or bolt Ø (A3). */
  d: number;
  /** Body the shaft or bolt rides, and its pose there. */
  body: string;
  at: Pose;
}

export interface SlideJoint {
  kind: "slide";
  id: string;
  type: "J5";
  rails: [Part, Part];
  slider: Part;
  /** World unit vector along the rails. */
  axis: Vec2;
  /** Travel of the slider centre along the axis over the cycle, mm. */
  range: [number, number];
}

export interface MeshJoint {
  kind: "mesh";
  id: string;
  type: "J6";
  a: Part;
  b: Part;
  form: "external" | "internal" | "rack";
  /** Pitch point at the assembly phase. */
  at: Vec2;
}

export interface CamJoint {
  kind: "cam";
  id: string;
  type: "J7";
  cam: Part;
  follower: Part;
}

export type JointInfo = PinJoint | SlideJoint | MeshJoint | CamJoint;

/** The engineering record of a joint (A16): read by the audit, never shown on the page (P8). */
export interface Joint {
  id: string;
  type: JointType | "post" | "drive" | "stop";
  at: Vec2;
  title: string;
  note: string;
  badge?: [string, "ok" | "warn"];
  d?: number;
  /** Solid ids that serve each of the ten functions (F1 to F10), filled by the rules. */
  serves: Partial<Record<"F1" | "F2" | "F3" | "F4" | "F5" | "F6" | "F7" | "F8" | "F9" | "F10", string[]>>;
}

/** A mechanism-specific build rule, written in the polish (A16). */
export interface BuildRule {
  title: string;
  text: string;
}

/** The shared state the rules build on. */
export interface RuleContext {
  model: MechanismModel;
  parts: PartIndex;
  sampled: Sampled;
  /** Assembly phase and its solution. */
  u0: number;
  s0: Solved;
  solids: Solid[];
  joints: Joint[];
  info: JointInfo[];
  /** The solid of each model part. */
  solidOf: Record<string, Solid>;
  form: Form;
  /** Base plate bottom and top z. */
  b0: number;
  b1: number;
  levels: number[];
  exOf(z: number): number;
  add(...s: (Solid | Solid[])[]): Solid[];
  get(id: string): Solid | undefined;
  drop(id: string | RegExp): Solid[];
  joint(id: string): Joint | undefined;
  /** Joint type of a pin, from the classification. */
  classify(pin: Part): JointType | null;
  pinJoint(id: string): PinJoint | undefined;
  /** World pose of a solid at the assembly phase. */
  world(t: Solid): Pose | null;
  /** World regions of a solid over the cycle (one region for a static solid). */
  swept(t: Solid): Region[];
  /** Belt drives: the belt solid, its pulleys (small first) and the mount that tensions it. */
  belts: { belt: string; pulleys: [string, string]; mount?: string; joint: string }[];
  /** Swept outlines of every moving model part, sampled over the cycle. */
  sweeps(): { part: Part; z0: number; z1: number; regions: Region[] }[];
  /**
   * Clearance of a circle (centre, radius) over the z range to every moving part's sweep and to the ground solids
   * already built, mm (negative when it hits). `ignore` skips solids by id.
   */
  clearance(c: Vec2, r: number, z0: number, z1: number, ignore?: (t: Solid) => boolean): number;
  /** Record which rule added what (the audit reads it). */
  fired: Record<string, string[]>;
  rule: string;
}

export interface Rule {
  id: string;
  tier: "AUTO";
  /** The standard requirement ids this rule serves. */
  ids: string[];
  applies(ctx: RuleContext): boolean;
  apply(ctx: RuleContext): void;
}
