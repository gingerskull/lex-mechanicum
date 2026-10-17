// Small subassemblies a polish calls by name: H.dragPack (F6), H.eccentricMount (F7), H.sensor (V6).
import { circle, type Vec2 } from "../../core/geom";
import type { RuleContext } from "../../rules/types";
import { eccentric, screw, sensor as fork, thrustWasher, waveWasher } from "../primitives";
import type { Solid } from "../solid";
import { SENSOR } from "../tables";

/**
 * H.dragPack (F6): a wave washer and a bronze friction disc on a joint, so a part resting in a clearance cannot rattle.
 * Sits in the gap [z0, z1] on the joint's axle.
 */
export function dragPack(ctx: RuleContext, jid: string, o: { at: Vec2; d: number; z0: number; z1: number; ex: number }): Solid[] {
  const h = o.z1 - o.z0;
  const G = { at: [o.at[0], o.at[1], 0] as [number, number, number], joints: [jid], ex: o.ex };
  const out = [
    waveWasher(`${jid}-drag-ww`, o.d + 0.2, o.d + 6, { ...G, z0: o.z0, z1: o.z0 + Math.min(0.5, h / 2), name: "Drag pack: wave washer" }),
    thrustWasher(`${jid}-drag-disc`, o.d + 0.2, o.d + 6, { ...G, z0: o.z0 + Math.min(0.5, h / 2), z1: o.z1, name: "Drag pack: bronze friction disc" }),
  ];
  ctx.add(out);
  (ctx.joint(jid)?.serves ?? {}).F6 = [...(ctx.joint(jid)?.serves.F6 ?? []), ...out.map((s) => s.id)];
  return out;
}

/**
 * H.eccentricMount (F7): an axle carried in an eccentric bushing on the base, turned to set a centre distance (a mesh,
 * a belt) and clamped by two screws in its arc slots.
 */
export function eccentricMount(ctx: RuleContext, jid: string, o: { at: Vec2; d: number; e?: number }): Solid[] {
  const D = o.d + 8;
  const e = eccentric(`${jid}-ecc`, o.d, D, o.e ?? 0.3, { at: [o.at[0], o.at[1], 0], z0: ctx.b1, z1: ctx.b1 + 2, ex: -1, joints: [jid] });
  const slotR = (D + 10) / 2 - 2.6;
  const out = [e, ...[0, Math.PI].flatMap((a, k) => screw(`${jid}-ecc-sc${k}`, "button", 3, 8, { at: [o.at[0] + slotR * Math.cos(a), o.at[1] + slotR * Math.sin(a), 0], face: ctx.b1 + 2, dir: -1, ex: -1, joints: [jid], name: k ? "" : undefined }))];
  ctx.add(out);
  const J = ctx.joint(jid);
  if (J) (J.serves.F7 ??= []).push(e.id);
  return out;
}

/**
 * H.sensor (V6): a fork sensor for a flat vane turning about `axis` in the plane [zv, zv + t]. The two arms reach in
 * radially from rOut to rIn above and below the vane's path; the body sits outside rOut, screwed up into the part
 * above it (a housing or the bracket).
 */
export function sensor(ctx: RuleContext, id: string, o: { axis: Vec2; a: number; rIn: number; rOut: number; zv: number; t: number; joint: string; ex: number }): Solid[] {
  const at: [number, number, number] = [o.axis[0], o.axis[1], o.a];
  const G = { at, joints: [o.joint], ex: o.ex, group: id };
  const h = SENSOR.w / 2;
  const box = (x0: number, x1: number, y: number): [number, number][] => [[x0, -y], [x1, -y], [x1, y], [x0, y]];
  const lo = o.zv - 1;
  const hi = o.zv + o.t + 1;
  const out = [
    fork(id, { ...G, outer: box(o.rOut, o.rOut + 6, h), z0: lo - 2.3, z1: hi + 1.2, marks: [{ kind: "boss", pts: circle(1, o.rOut + 3, 0, 10) }] }),
    fork(`${id}-arm0`, { ...G, name: "", outer: box(o.rIn, o.rOut, h / 2), z0: lo - 2.3, z1: lo }),
    fork(`${id}-arm1`, { ...G, name: "", outer: box(o.rIn, o.rOut, h / 2), z0: hi, z1: hi + 1.2 }),
  ];
  ctx.add(out);
  return out;
}
