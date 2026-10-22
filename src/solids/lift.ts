// The hardware primitives (src/hardware: an outline with a z range on a body) as Solid3, for the builder's `place`
// (src/builder/frames.ts), which carries them onto a joint frame. Every lifted solid is a plain extrusion of its outline;
// the builders make revolves, sweeps and booleans natively. A primitive made on an x, y or posed axis keeps that plane
// convention (`legacyAxis`).
import { TAU } from "../core/geom";
import type { Solid } from "../hardware/solid";
import { atPose } from "./frame";
import { cleanRing, extrudeOp, stepsFor } from "./tessellate";
import type { Op, Solid3 } from "./types";

/** A helical solid turns its outline when it winds at most a quarter turn; further it carries thread marks (a screw). */
const twisted = (s: Solid): boolean => s.helix !== undefined && Math.abs((TAU * (s.z1 - s.z0)) / s.helix) <= Math.PI / 2;

/** A primitive's solid as a v3 solid. */
export function liftSolid(s: Solid): Solid3 {
  const h = s.z1 - s.z0;
  const turn = twisted(s) ? (360 * h) / s.helix! : 0;
  const op: Op = extrudeOp(h, { ...(s.taper !== undefined ? { scaleTop: s.taper } : {}), ...(turn ? { twist: turn } : {}) });
  if (op.op === "extrude" && turn) op.steps = stepsFor(turn);
  const out: Solid3 = {
    id: s.id,
    name: s.name,
    role: s.role,
    kind: s.kind,
    body: s.body,
    frame: atPose(s.at[0], s.at[1], s.z0, (s.at[2] * 180) / Math.PI),
    profile: { outer: cleanRing(s.outer), holes: s.holes.map(cleanRing) },
    op,
    marks: s.marks.map((m) => ({ kind: m.kind, pts: m.pts })),
    ex: s.ex,
    joints: s.joints,
    detail: s.detail,
    flags: {
      ...(s.inset ? { inset: true } : {}),
      ...(s.accent ? { accent: true } : {}),
      ...(s.faint ? { faint: true } : {}),
      ...(s.isBase ? { isBase: true } : {}),
      ...(s.headTop ? { headTop: true } : {}),
      ...(s.seeThrough ? { seeThrough: true } : {}),
    },
  };
  if (s.group !== undefined) out.group = s.group;
  if (s.allow?.length) out.allow = s.allow;
  if (s.why !== undefined) out.why = s.why;
  if (s.mat !== undefined) out.mat = s.mat;
  if (s.motion) out.motion = s.motion;
  if (s.closure) out.closure = s.closure;
  if (s.headKind) out.headKind = s.headKind;
  if (s.chamfer !== undefined) out.chamfer = s.chamfer;
  if (s.thread !== undefined && s.threadZ) out.thread = { m: s.thread, z0: s.threadZ[0] - s.z0, z1: s.threadZ[1] - s.z0, ...(s.helix !== undefined && !twisted(s) ? { lead: s.helix } : {}) };
  else if (s.helix !== undefined && !twisted(s)) out.thread = { m: 0, z0: 0, z1: h, lead: s.helix };
  if (s.stretch) out.stretch = [s.stretch[0], s.stretch[1]];
  if (s.deform) out.deform = true;
  if (s.axis === "p" && s.frame) out.posedBy = s.frame;
  if (s.axis === "p" && s.reach) out.reach = { to: [s.reach.to[0], s.reach.to[1], s.reach.to[2]], end: s.reach.end };
  if (s.axis) out.legacyAxis = s.axis;
  if (s.d !== undefined) out.d = s.d;
  if (s.D !== undefined) out.D = s.D;
  return out;
}
