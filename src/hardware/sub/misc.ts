// Small subassemblies a polish calls by name: H.dragPack (F6), H.lockingSegment (M14), H.outputCoupling,
// H.eccentricMount (F7), H.sensor (V6).
import { TAU, arcPts, circle, dBore, polar, type Vec2 } from "../../core/geom";
import type { RuleContext } from "../../rules/types";
import { boltCircle, disc, eccentric, key as keyPart, plate, screw, sensor as fork, shaft, spacer, thrustWasher, waveWasher, wearStrip } from "../primitives";
import type { Solid } from "../solid";
import { SENSOR, innerRingD, keyFor, standardLength } from "../tables";

/**
 * H.dragPack (F6): a bronze friction disc and the wave washer that preloads it, so a part resting in a clearance cannot
 * rattle. The rings bear on the turning part, not on an inner race: inner Ø d and outer Ø D are those of the face they
 * press (a bearing's outer ring flange, a hub). The pack fills the gap [z0, z1] on the joint's axis with the disc
 * against the turning part, which is below the pack unless `part` says "above".
 */
export function dragPack(
  ctx: RuleContext,
  jid: string,
  o: { at: Vec2; d: number; D: number; z0: number; z1: number; ex: number; part?: "below" | "above"; on?: string; by?: string },
): Solid[] {
  const h = o.z1 - o.z0;
  const td = h * 0.55;
  const below = o.part !== "above";
  const [d0, d1] = below ? [o.z0, o.z0 + td] : [o.z1 - td, o.z1];
  const [w0, w1] = below ? [d1, o.z1] : [o.z0, d0];
  const G = { at: [o.at[0], o.at[1], 0] as [number, number, number], joints: [jid], ex: o.ex };
  const out = [
    thrustWasher(`${jid}-drag-disc`, o.d, o.D, { ...G, z0: d0, z1: d1, name: `Drag pack: bronze friction disc ${o.d.toFixed(1)}x${o.D.toFixed(1)}${o.on ? `, on ${o.on}` : ""}` }),
    waveWasher(`${jid}-drag-ww`, o.d, o.D, { ...G, z0: w0, z1: w1, name: `Drag pack: wave washer${o.by ? `, preloaded by ${o.by}` : ""}` }),
  ];
  ctx.add(out);
  const J = ctx.joint(jid);
  if (J) (J.serves.F6 ??= []).push(...out.map((t) => t.id));
  return out;
}

/**
 * H.lockingSegment (M14): the working arc of a part's outline (a locking arc of radius r about the part's origin) made
 * a replaceable hardened segment `depth` deep, held by countersunk screws on the joint line. The part's outline is cut
 * back behind it; the segment's outside is the modelled arc, so the kinematics are untouched (K1).
 */
export function lockingSegment(ctx: RuleContext, host: Solid, o: { r: number; depth: number; joint: string; screws?: number; M?: number; margin?: number }): Solid[] {
  const P = host.outer;
  const on = P.map(([x, y]) => Math.abs(Math.hypot(x, y) - o.r) < 0.05);
  const m = P.length;
  // the run of outline points on the arc, rotated to the front
  const start = on.findIndex((v, i) => v && !on[(i - 1 + m) % m]);
  if (start < 0) return [];
  const rot = [...P.slice(start), ...P.slice(0, start)];
  const run = rot.findIndex((_, i) => !on[(start + i) % m]);
  const arc = rot.slice(0, run < 0 ? m : run);
  const rest = run < 0 ? [] : rot.slice(run);
  const ang = arc.map(([x, y]) => Math.atan2(y, x));
  for (let i = 1; i < ang.length; i++) {
    while (ang[i]! - ang[i - 1]! > Math.PI) ang[i] = ang[i]! - TAU;
    while (ang[i - 1]! - ang[i]! > Math.PI) ang[i] = ang[i]! + TAU;
  }
  const a0 = ang[0]!;
  const a1 = ang[ang.length - 1]!;
  const sg = Math.sign(a1 - a0) || 1;
  const margin = o.margin ?? 0.12;
  const s0 = a0 + sg * margin;
  const s1 = a1 - sg * margin;
  const ri = o.r - o.depth;
  host.outer = [...arcPts(0, 0, o.r, a0, s0, 0.05), ...arcPts(0, 0, ri, s0, s1), ...arcPts(0, 0, o.r, s1, a1, 0.05), ...rest];
  const n = o.screws ?? 4;
  const M = o.M ?? 3;
  const G = { body: host.body, z0: host.z0, z1: host.z1, ex: host.ex, joints: [o.joint] };
  const seg = wearStrip(`${host.id}-seg`, [...arcPts(0, 0, o.r, s0, s1), ...arcPts(0, 0, ri, s1, s0)], { ...G, name: `Locking segment, hardened, ${n} x M${M} csk`, role: host.role });
  const out: Solid[] = [seg];
  for (let i = 0; i < n; i++) {
    const p = polar(ri, s0 + ((s1 - s0) * (i + 0.5)) / n);
    out.push(...screw(`${host.id}-seg-sc${i}`, "csk", M, 2 * M, { body: host.body, at: [p[0], p[1], 0], face: host.z1, dir: -1, ex: host.ex, joints: [o.joint], name: i ? "" : undefined, qty: i ? 0 : n }));
  }
  ctx.add(out);
  return out;
}

/**
 * H.outputCoupling: where a rotary output takes its load, a keyed flange on the free end of a straddle-mounted shaft
 * (above its bridge bearing): an inner-race spacer up from the bearing, the flange keyed and held by a flush end screw,
 * n tapped holes on a pitch circle for whatever the output drives. A D-flat shaft gets a D-bore instead of a key.
 */
export function outputCoupling(ctx: RuleContext, jid: string, o: { R: number; t: number; holes: number; M: number; pcd: number; a0?: number }): Solid[] {
  const j = ctx.pinJoint(jid);
  if (!j?.top) return [];
  const d = j.d;
  const up = ctx.solids.filter((t) => t.id.startsWith(`${jid}-shaft-up`));
  const seg = up.find((t) => t.kind === "shaft") ?? ctx.solids.find((t) => t.group === `${jid}-shaft`)!;
  const G = { body: seg.body, at: seg.at, joints: [jid] };
  const zf = j.top.free;
  const ex = Math.max(...ctx.solids.filter((t) => t.joints.includes(jid) && t.kind === "bridge").map((t) => t.ex), seg.ex);
  // the shaft runs on up to the flange top
  ctx.drop(new RegExp(`^${jid}-shaft-up`));
  const out: Solid[] = [...shaft(`${jid}-shaft-up`, { d, z0: Math.min(...up.map((t) => t.z0), j.top.seat), z1: zf + o.t }, { ...G, ex: seg.ex, group: `${jid}-shaft`, name: "" })];
  out.push(spacer(`${jid}-top-sp`, d + 0.2, innerRingD(j.top.bearing), { ...G, z0: j.top.seat, z1: zf, ex }));
  const key = keyFor(d);
  const holes = boltCircle(o.holes, o.pcd, o.a0 ?? Math.PI / 4);
  const fl = plate(`${jid}-flange`, disc(o.R), {
    name: `Output flange Ø${2 * o.R}, ${key ? "keyed" : "on the D-flat"}, ${o.holes} x M${o.M} tapped for the load`,
    role: "output",
    ...G,
    z0: zf,
    z1: zf + o.t,
    ex: ex + 1,
    holes: [key ? disc(d / 2 + 0.01) : dBore(d / 2 + 0.025), ...holes.map(([x, y]) => disc(o.M / 2, x, y))],
    marks: [
      ...holes.map(([x, y]) => ({ kind: "thread" as const, pts: disc(o.M / 2 + 0.45, x, y) })),
      ...(key ? [{ kind: "keyway" as const, pts: [[d / 2 - 1, -key.b / 2], [d / 2 + key.h - key.t1, -key.b / 2], [d / 2 + key.h - key.t1, key.b / 2], [d / 2 - 1, key.b / 2]] as Vec2[] }] : []),
    ],
    mat: "Steel C45, black oxide",
  });
  out.push(fl);
  const J = ctx.joint(jid);
  if (key) {
    const outline: Vec2[] = [[d / 2 - key.t1, -key.b / 2], [d / 2 - key.t1 + key.h, -key.b / 2], [d / 2 - key.t1 + key.h, key.b / 2], [d / 2 - key.t1, key.b / 2]];
    out.push(keyPart(`${jid}-flange-key`, key.b, o.t, { ...G, outer: outline, z0: zf, z1: zf + o.t, ex: ex + 1 }));
    if (J) (J.serves.F3 ??= []).push(`${jid}-flange-key`);
  }
  const M = d <= 6 ? 3 : d <= 8 ? 4 : d <= 10 ? 5 : 6;
  out.push(...screw(`${jid}-flange-end`, "csk", M, 2 * M + 2, { ...G, face: zf + o.t, dir: -1, ex: ex + 1.5, headTop: true, name: `Countersunk M${M} x ${standardLength(2 * M + 2)} (ISO 10642), into the shaft end, flush` }));
  if (J) (J.serves.F2 ??= []).push(`${jid}-flange-end`);
  ctx.add(out);
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
