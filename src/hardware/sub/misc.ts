// Small subassemblies a polish calls by name: H.dragPack (F6), H.lockingSegment (M14), H.outputCoupling,
// H.eccentricMount (F7 at a ground pivot), H.turnbuckle (F7 on a moving link), H.sensor (V6).
import { TAU, arcPts, circle, dBore, polar, type Vec2 } from "../../core/geom";
import { clipHalfPlane, edgeDist, inside, toWorld } from "../../core/poly";
import type { RuleContext } from "../../rules/types";
import { boltCircle, disc, eccentric, key as keyPart, plate, screw, sensor as fork, shaft, spacer, thrustWasher, waveWasher, wearStrip } from "../primitives";
import { onAxis, solid, type Solid } from "../solid";
import { JAM_NUTS, NUTS, SENSOR, innerRingD, keyFor, standardLength } from "../tables";

const fmt = (v: number) => String(+v.toFixed(1));

/**
 * H.dragPack (F6): a bronze friction disc and the wave washer that preloads it, so a part resting in a clearance cannot
 * rattle. The rings bear on the turning part, not on an inner race: inner Ã˜ d and outer Ã˜ D are those of the face they
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
  const G = { body: host.body, ...onAxis(host), z0: host.z0, z1: host.z1, ex: host.ex, joints: [o.joint] };
  const seg = wearStrip(`${host.id}-seg`, [...arcPts(0, 0, o.r, s0, s1), ...arcPts(0, 0, ri, s1, s0)], { ...G, name: `Locking segment, hardened, ${n} x M${M} csk`, role: host.role });
  const out: Solid[] = [seg];
  for (let i = 0; i < n; i++) {
    const p = polar(ri, s0 + ((s1 - s0) * (i + 0.5)) / n);
    out.push(...screw(`${host.id}-seg-sc${i}`, "csk", M, 2 * M, { body: host.body, ...onAxis(host), at: [p[0], p[1], 0], face: host.z1, dir: -1, ex: host.ex, joints: [o.joint], name: i ? "" : undefined, qty: i ? 0 : n }));
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
    name: `Output flange Ã˜${2 * o.R}, ${key ? "keyed" : "on the D-flat"}, ${o.holes} x M${o.M} tapped for the load`,
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
 * H.turnbuckle (F7, Appendix A linkages): a moving link made adjustable at its set point, in its own plane. The link is
 * cut across at `at` (host-local, on its axis `dir`, default local x) into two halves; a left and a right hand stud is
 * threadlocked into the end of each half, and a turnbuckle body milled flat to the link's thickness joins them, a thin
 * jam nut on each stud against it. Everything sits flush inside the link's z range and outline, so a swept stack with
 * no room above or below the link still takes it. The halves ride the link's body and the pin centres are untouched:
 * the drawn length is the modelled one (K1), shown at its set point. Rod thread: the largest that leaves 1.5 mm of
 * wall to both faces (M3 in a 6 mm link) unless `M` is given. The half without the body origin becomes a new solid
 * `<host>-half`; holes and marks go with the half they lie in.
 */
export function turnbuckle(
  ctx: RuleContext,
  host: Solid,
  o: { at: Vec2; dir?: Vec2; M?: number; set?: number; joint?: string; title?: string; why?: string },
): { half: Solid; parts: Solid[] } {
  const t = host.z1 - host.z0;
  const zm = (host.z0 + host.z1) / 2;
  const M = o.M ?? [6, 5, 4, 3].find((m) => m <= t - 3 && NUTS[m]!.s <= t + 1) ?? 3;
  const nut = NUTS[M] ?? NUTS[3]!;
  const jam = JAM_NUTS[M] ?? JAM_NUTS[3]!;
  const L = 5 * M;
  const AC = (2 * nut.s) / Math.sqrt(3);
  const g = L / 2 + jam.m + M / 2;
  const tap = 1.5 * M;
  const len = Math.hypot(...(o.dir ?? [1, 0]));
  const u: Vec2 = o.dir ? [o.dir[0] / len, o.dir[1] / len] : [1, 0];
  const v: Vec2 = [-u[1], u[0]];
  const c = o.at;
  const along = (p: Vec2) => (p[0] - c[0]) * u[0] + (p[1] - c[1]) * u[1];
  const pt = (a: number, b: number): Vec2 => [c[0] + u[0] * a + v[0] * b, c[1] + u[1] * a + v[1] * b];
  // the body is as wide as the link allows with a 3 mm shoulder each side, from 2M + 2 up to 4M
  let hw = 0;
  while (hw < 60 && inside(host.outer, pt(0, hw + 0.25)) && inside(host.outer, pt(0, -hw - 0.25))) hw += 0.25;
  const W = Math.max(2 * M + 2, Math.min(4 * M, 2 * hw - 6));
  const rect = (a0: number, a1: number, hw: number): Vec2[] => [pt(a0, -hw), pt(a1, -hw), pt(a1, hw), pt(a0, hw)];
  const jid = o.joint ?? `${host.id}-adjust`;

  // the body must sit in the link with a wall round it, and every hole must stand clear of the stud ends
  if (!rect(-L / 2, L / 2, W / 2).every((p) => inside(host.outer, p) && edgeDist(host.outer, p) >= 1))
    throw new Error(`turnbuckle: ${host.id} is too narrow for an M${M} turnbuckle body at (${c[0]}, ${c[1]})`);
  for (const h of host.holes)
    if (Math.min(...h.map((p) => Math.abs(along(p)))) < g + tap + 1.5) throw new Error(`turnbuckle: a hole in ${host.id} is within reach of the M${M} studs`);

  // the cut: the host keeps the half holding its origin (a pin), the other half is a new solid on the same body
  const side = Math.sign(along([0, 0])) || -1;
  const near = clipHalfPlane(host.outer, pt(side * g, 0), [u[0] * side, u[1] * side]);
  const far = clipHalfPlane(host.outer, pt(-side * g, 0), [-u[0] * side, -u[1] * side]);
  const mid = (P: Vec2[]) => along([P.reduce((s, p) => s + p[0], 0) / P.length, P.reduce((s, p) => s + p[1], 0) / P.length]);
  const onFar = (P: Vec2[]) => Math.sign(mid(P)) === -side;
  const across = (P: Vec2[]) => P.some((p) => Math.abs(along(p)) < g);
  const half: Solid = {
    ...host,
    id: `${host.id}-half`,
    name: `${host.name}, second half (turnbuckle)`,
    outer: far,
    holes: host.holes.filter(onFar),
    marks: host.marks.filter((k) => !across(k.pts) && onFar(k.pts)),
    joints: [...new Set([...host.joints, jid])],
    ...(host.allow ? { allow: [...host.allow] } : {}),
  };
  delete half.qty;
  host.outer = near;
  host.holes = host.holes.filter((h) => !onFar(h));
  host.marks = host.marks.filter((k) => !across(k.pts) && !onFar(k.pts));
  if (!host.joints.includes(jid)) host.joints.push(jid);

  const G = { role: "hw" as const, body: host.body, ...onAxis(host), at: host.at, ex: host.ex, joints: [jid] };
  const body = solid(`${host.id}-tb-body`, {
    ...G,
    kind: "collar",
    name: `Turnbuckle body ${W} x ${fmt(t)} x ${L}, milled flat, M${M} left and right hand`,
    mat: "Steel C45, zinc plated",
    outer: rect(-L / 2, L / 2, W / 2),
    z0: host.z0,
    z1: host.z1,
    marks: [{ kind: "index", pts: [pt(0, -W / 2), pt(0, W / 2)] }],
  });
  const nuts = [-1, 1].map((k, i) =>
    solid(`${host.id}-tb-jam${i}`, {
      ...G,
      kind: "nut",
      name: i ? "" : `Jam nut M${M} (DIN 439), one left hand and one right hand`,
      qty: i ? 0 : 2,
      mat: "Steel 8, zinc plated",
      outer: rect(k < 0 ? -L / 2 - jam.m : L / 2, k < 0 ? -L / 2 : L / 2 + jam.m, AC / 2),
      z0: zm - nut.s / 2,
      z1: zm + nut.s / 2,
      thread: M,
      lock: "jam nut against the turnbuckle body",
    }),
  );
  const studLen = g + tap - (L / 2 - 2 * M);
  const studs = [-1, 1].map((k, i) => {
    const a0 = k * (L / 2 - 2 * M);
    const a1 = k * (g + tap);
    const ticks = [0.33, 0.67].map((f) => k * (L / 2 + jam.m + (M / 2) * f));
    return solid(`${host.id}-tb-stud${i}`, {
      ...G,
      kind: "shaft",
      name: i ? "" : `Stud M${M} x ${fmt(studLen)}, one left hand and one right hand, threadlocked into the halves`,
      qty: i ? 0 : 2,
      mat: "Steel 8.8, zinc plated",
      outer: rect(Math.min(a0, a1), Math.max(a0, a1), M / 2),
      marks: ticks.map((a) => ({ kind: "thread" as const, pts: [pt(a, -M / 2 + 0.3), pt(a, M / 2 - 0.3)] })),
      z0: zm - M / 2,
      z1: zm + M / 2,
      thread: M,
      group: `${host.id}-tb-stud${i}`,
      lock: "threadlocker, medium strength (Loctite 243), into the half",
    });
  });
  const parts = [body, ...nuts, ...studs];
  ctx.add(half, ...parts);

  const q = ctx.world(host);
  const w = q ? toWorld(q, c) : c;
  const J = ctx.joint(jid);
  const set = o.set !== undefined ? ` Set at ${fmt(o.set)} mm between pin centres; the drawn length is exact.` : " The drawn length is exact.";
  const note = `Turnbuckle in ${host.name.toLowerCase()}, in the link's own plane: the link is made in two halves, a left and a right hand M${M} stud threadlocked into the end of each; the body, milled flat to the ${fmt(t)} mm thickness, joins them and turns to set the length, a jam nut on each stud locks it.${set}${o.why ? ` ${o.why}` : ""}`;
  const rec = {
    id: jid,
    type: "post" as const,
    at: w,
    title: o.title ?? `Adjuster Â· ${host.name}`,
    note,
    badge: ["adjustable", "ok"] as [string, "ok"],
    serves: { F2: nuts.map((n) => n.id), F7: [body.id, ...nuts.map((n) => n.id), ...studs.map((s) => s.id)], F9: [body.id] },
  };
  if (J) Object.assign(J, rec);
  else ctx.joints.push(rec);
  return { half, parts };
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
