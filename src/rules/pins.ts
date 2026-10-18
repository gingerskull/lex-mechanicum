// Shared build steps of the pin joints (J1, J3, J4): bearing seats with their retention, inner-race spacers, the
// shoulder bolt or axle, and the track roller with its wear strips. The rule modules decide which steps a type gets.
import { circle, offsetPoly, type Pose, type Vec2 } from "../core/geom";
import { holeSlot, type Slot } from "../core/poly";
import { boreChamfers, bearing, bushing, circlip, disc, felt, head, roller, screw, shaft, spacer, thrustWasher, tube, washer, wearStrip } from "../hardware/primitives";
import type { Solid } from "../hardware/solid";
import { CIRCLIP_ROOM, FLANGE, SHOULDER_BOLTS, bearingFor, circlipInt, innerRingD, shoulderLength, threadFor } from "../hardware/tables";
import type { Joined, PinJoint, RuleContext } from "./types";

/** An element of the stack on the shaft or bolt: a part face or a bearing inner race. */
export interface Element {
  z0: number;
  z1: number;
  ex: number;
  /** Top of anything the element carries above its part (a bearing flange), for clearing heads. */
  over: number;
  label: string;
}

const fmt = (v: number) => String(+v.toFixed(1));
const low = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

export const partName = (ctx: RuleContext, x: Joined) => low(ctx.solidOf[x.part.id]?.name ?? x.part.id);

/**
 * Seats a bearing in a part that turns relative to the shaft or bolt (A3, F2): the largest bearing its boss takes,
 * retained by two internal circlips when the plate is thick enough, else flanged on top with one circlip below; a
 * bronze bushing where no bearing fits.
 */
export function seatBearing(ctx: RuleContext, j: PinJoint, x: Joined, closure: "open" | "shield" | "seal" = "shield"): Element {
  const host = ctx.solidOf[x.part.id]!;
  const t = x.z1 - x.z0;
  const b = bearingFor(j.d, x.R, t);
  const sid = `${j.id}-${x.part.id}`;
  const at: Pose = [x.L[0], x.L[1], 0];
  const common = { body: x.part.id, at, ex: host.ex, joints: [j.id] };
  const serve = (k: "F2" | "F4", id: string) => (ctx.joint(j.id)!.serves[k] ??= []).push(id);
  if (!b) {
    const D = j.d + (j.d >= 10 ? 4 : 3);
    host.holes.push(disc(D / 2 + 0.1, ...x.L));
    ctx.add(bushing(`${sid}-bush`, j.d, D, { ...common, z0: x.z0, z1: x.z1, why: `no catalogue bearing fits the ${partName(ctx, x)} boss` }));
    return { z0: x.z0, z1: x.z1, ex: host.ex, over: x.z1, label: `a bronze bushing in the ${partName(ctx, x)}` };
  }
  host.holes.push(disc(b.D / 2 + 0.15, ...x.L));
  const room = t - b.B;
  const clip = circlipInt(b.D);
  let zb0: number;
  let over = x.z1;
  let flange: "top" | undefined;
  if (room >= 2 * clip.s + 0.2) {
    zb0 = (x.z0 + x.z1) / 2 - b.B / 2;
    for (const [k, z] of [[0, zb0 - clip.s], [1, zb0 + b.B]] as const) {
      const c = circlip(`${sid}-cl${k}`, b.D, { internal: true, ...common, z0: z, z1: z + clip.s, name: k ? "" : `Internal circlip DIN 472, Ø${b.D}`, qty: k ? 0 : 2 });
      ctx.add(c);
      serve("F2", c.id);
    }
  } else {
    // a flanged bearing: the flange on the top face locates it one way, a circlip below the other
    flange = "top";
    zb0 = x.z1 - b.B;
    over = x.z1 + FLANGE(b).w;
    if (room >= Math.min(CIRCLIP_ROOM, clip.s + 0.1)) {
      const c = circlip(`${sid}-cl0`, b.D, { internal: true, ...common, z0: zb0 - clip.s, z1: zb0 });
      ctx.add(c);
      serve("F2", c.id);
    }
  }
  const parts = bearing(`${sid}-brg`, b, { ...common, z0: zb0, z1: zb0 + b.B, closure, ...(flange ? { flange } : {}), seat: flange ? "flange on top, circlip below" : "circlip each side" });
  ctx.add(parts);
  serve("F2", parts[0]!.id);
  return { z0: zb0, z1: zb0 + b.B, ex: host.ex, over, label: `a ${parts[0]!.name.replace(/^Bearing /, "")} bearing in the ${partName(ctx, x)}` };
}

/**
 * Relieves an open slot (a notch in the outline) by `strip` behind its walls and round its end, so strips of that
 * thickness have the modelled walls as their faces. The mouth corners slide along the rim edges they meet. Returns
 * the relieved wall length from the end centre to the mouth.
 */
function relieveNotch(host: Solid, s: Slot, strip: number): number {
  const n: Vec2 = [-s.u[1], s.u[0]];
  const loc = (p: Vec2): [number, number] => {
    const dx = p[0] - s.c0[0];
    const dy = p[1] - s.c0[1];
    return [dx * s.u[0] + dy * s.u[1], dx * n[0] + dy * n[1]];
  };
  const at = (a: number, b: number): Vec2 => [s.c0[0] + s.u[0] * a + n[0] * b, s.c0[1] + s.u[1] * a + n[1] * b];
  const P = host.outer;
  const on = P.map((p) => {
    const [a, b] = loc(p);
    if (a >= 0) return a <= s.len + 0.3 && Math.abs(Math.abs(b) - s.w) < 0.2;
    return Math.abs(Math.hypot(a, b) - s.w) < 0.2;
  });
  const out = P.map((p, i): Vec2 => {
    if (!on[i]) return p;
    const [a, b] = loc(p);
    if (a >= 0) return at(a, Math.sign(b) * (s.w + strip));
    const r = Math.hypot(a, b);
    return at((a / r) * (s.w + strip), (b / r) * (s.w + strip));
  });
  let len = s.len;
  const m = P.length;
  for (let i = 0; i < m; i++) {
    if (!on[i]) continue;
    for (const k of [(i + 1) % m, (i - 1 + m) % m]) {
      if (on[k]) continue;
      // the mouth corner: where the relieved wall line meets the rim edge it ran into
      const [a0, b0] = loc(P[i]!);
      const [a1, b1] = loc(P[k]!);
      const bw = Math.sign(b0) * (s.w + strip);
      if (Math.abs(b1 - b0) < 1e-9) continue;
      const t = (bw - b0) / (b1 - b0);
      const a = a0 + (a1 - a0) * t;
      out[i] = at(a, bw);
      len = Math.min(len, a);
    }
  }
  host.outer = out;
  return len;
}

/**
 * J4: a track roller on the stud, hardened wear strips screwed into the walls of every slot the roller runs in (the
 * strips' faces are the modelled walls, the slot is relieved behind them), a felt oiler at each slot's end: in the
 * relieved end, brushing the roller at its deepest point, where the roller leaves room, else on the top face past it.
 */
export function slotRoller(ctx: RuleContext, j: PinJoint, x: Joined, body: string, at: Pose, group: string): Element {
  const host = ctx.solidOf[x.part.id]!;
  const strip = 1.5;
  const slots = x.slots?.length ? x.slots : (() => {
    const h = holeSlot(host.holes[x.hole!]!, x.hole!, 0);
    return h ? [{ ...h, reach: [0, h.len] as [number, number] }] : [];
  })();
  const sid = `${j.id}-${x.part.id}`;
  const common = { body: x.part.id, at: [0, 0, 0] as Pose, ex: host.ex, joints: [j.id], z0: x.z0, z1: x.z1 };
  const D = 2 * Math.min(...slots.map((s) => s.w)) - 0.3;
  const N = slots.length;
  const J = ctx.joint(j.id)!;
  let over = x.z1;
  slots.forEach((s, k) => {
    const n: Vec2 = [-s.u[1], s.u[0]];
    const P = (a: number, b: number): Vec2 => [s.c0[0] + s.u[0] * a + n[0] * b, s.c0[1] + s.u[1] * a + n[1] * b];
    const rect = (a0: number, a1: number, b0: number, b1: number): Vec2[] => [P(a0, b0), P(a1, b0), P(a1, b1), P(a0, b1)];
    let len = s.len;
    if (s.hole !== undefined) host.holes[s.hole] = offsetPoly(host.holes[s.hole]!, strip);
    else len = relieveNotch(host, s, strip);
    for (const [side, lo, hi] of [[0, s.w, s.w + strip], [1, -s.w - strip, -s.w]] as const) {
      const i = 2 * k + side;
      ctx.add(wearStrip(`${sid}-ws${i}`, rect(0, len, lo, hi), { ...common, name: i ? "" : `Wear strip ${fmt(len)} x ${strip}, hardened, 2 x M2 csk`, qty: i ? 0 : 2 * N }));
      // two countersunk M2 per strip, half in the strip, half in the wall, clear of the roller
      for (const [c, f] of [[0, 0.2], [1, 0.8]] as const) {
        const p = P(len * f, side ? -s.w - strip - 0.7 : s.w + strip + 0.7);
        ctx.add(screw(`${sid}-ws${i}-sc${c}`, "csk", 2, 5, { body: x.part.id, at: [p[0], p[1], 0], face: x.z1, dir: -1, ex: host.ex, joints: [j.id], name: "" }));
      }
    }
    const fid = N > 1 ? `${sid}-felt${k}` : `${sid}-felt`;
    const fname = k ? "" : `Felt oiler${s.open ? " in the slot end" : ""}, oil-soaked wool felt`;
    // in the relieved end of an open slot, cut to brush the roller at its deepest point
    const rEnd = s.w + strip - 0.1;
    const brush = s.reach[0] - D / 2 + 0.25;
    if (s.open && brush > -rEnd + 1) {
      const t0 = Math.acos(Math.max(-1, Math.min(1, brush / rEnd)));
      const pts: Vec2[] = [];
      for (let q = 0; q <= 24; q++) {
        const t = t0 + ((2 * Math.PI - 2 * t0) * q) / 24;
        pts.push(P(rEnd * Math.cos(t), rEnd * Math.sin(t)));
      }
      ctx.add(felt(fid, pts, { ...common, name: fname, qty: k ? 0 : N, z0: x.z0 + 1, z1: x.z1 - 1, allow: [`${sid}-roller`], why: "keeps the roller track oiled (F8)" }));
    } else {
      const a0 = s.open ? -s.w - strip - 5.5 : len + s.w / 2 + strip + 1.5;
      ctx.add(felt(fid, rect(a0, a0 + 4, -2.5, 2.5), { ...common, name: fname, qty: k ? 0 : N, z0: x.z1, z1: x.z1 + 1.2, why: "keeps the roller track oiled (F8)" }));
      over = x.z1 + 1.2;
    }
    (J.serves.F8 ??= []).push(fid);
  });
  const r = roller(`${sid}-roller`, j.d, D, { body, at, z0: x.z0 + 0.3, z1: x.z1 - 0.3, ex: host.ex, joints: [j.id], group });
  ctx.add(r);
  const where = N > 1 ? `each of the ${N} ${partName(ctx, x)} slots` : `the ${partName(ctx, x)} slot`;
  return { z0: x.z0 + 0.3, z1: x.z1 - 0.3, ex: host.ex, over, label: `a Ø${fmt(D)} track roller in ${where}, between hardened wear strips` };
}

/**
 * Outside Ø of an inner-race spacer on this joint: `want`, but never past the inner ring of any bearing it bears on,
 * so the spacer clamps only the inner race (A12).
 */
export function raceD(ctx: RuleContext, j: PinJoint, want: number): number {
  let cap = Infinity;
  for (const t of ctx.solids)
    if (t.kind === "bearing" && t.joints.includes(j.id) && t.d === j.d && t.D !== undefined && !t.id.endsWith("-fl"))
      cap = Math.min(cap, innerRingD({ d: t.d, D: t.D }));
  return Math.max(j.d + 1.6, Math.min(want, cap));
}

/** Inner-race spacers in every gap of the stack (A12); the gap over the base is a bronze thrust washer (F4). */
export function stackSpacers(ctx: RuleContext, j: PinJoint, els: Element[], body: string, at: Pose, overBase: boolean): Solid[] {
  const out: Solid[] = [];
  for (let i = 0; i + 1 < els.length; i++) {
    const lo = els[i]!;
    const hi = els[i + 1]!;
    const gap = hi.z0 - lo.z1;
    if (gap <= 0.3) continue;
    const o = { body, at, z0: lo.z1, z1: hi.z0, span: [lo.ex, hi.ex] as [number, number], ex: lo.ex, joints: [j.id] };
    const id = `${j.id}-sp${i}`;
    const D = raceD(ctx, j, gap > 3.2 ? j.d + 4 : j.d + 3.2);
    if (i === 0 && overBase) {
      const tw = Math.min(gap, 1.5);
      out.push(thrustWasher(`${id}-tw`, j.d + 0.2, D, { ...o, z0: hi.z0 - tw, ex: hi.ex, span: undefined }));
      if (gap - tw > 0.3) out.push(gap - tw > 3.2 ? tube(id, j.d + 0.2, D, { ...o, z1: hi.z0 - tw }) : spacer(id, j.d + 0.2, D, { ...o, z1: hi.z0 - tw }));
      (ctx.joint(j.id)!.serves.F4 ??= []).push(`${id}-tw`);
    } else out.push(gap > 3.2 ? tube(id, j.d + 0.2, D, { ...o, name: `Inner-race spacer sleeve ${fmt(j.d + 0.2)}x${fmt(D)}` }) : spacer(id, j.d + 0.2, D, o));
  }
  ctx.add(out);
  return out;
}

/**
 * A shoulder bolt (ISO 7379) or a headed axle: the shoulder Ø d from `z0`, the thread below it with its undercut, the
 * head on top. The stack needs the head at `z1`; the shoulder is the next standard length (M9, A13) and a hardened shim
 * under the head makes up the difference. One explode group (E2).
 */
export function shoulderBolt(
  ctx: RuleContext,
  j: PinJoint,
  o: { id: string; body: string; at: Pose; z0: number; z1: number; thread: [number, number]; name: string; ex: number },
): Solid[] {
  const sb = SHOULDER_BOLTS[j.d];
  const M = sb?.M ?? threadFor(j.d);
  const zh = o.z0 + shoulderLength(o.z1 - o.z0);
  const segs = shaft(o.id, { d: j.d, z0: Math.min(o.thread[0], o.z0), z1: zh, thread: { M, z0: o.thread[0], z1: o.thread[1] } }, {
    name: o.name,
    body: o.body,
    at: o.at,
    ex: o.ex,
    joints: [j.id],
    mat: "Alloy steel 12.9, ground shoulder, black oxide",
  });
  const dk = sb?.dk ?? j.d * 1.66;
  const out: Solid[] = [...segs];
  if (zh - o.z1 > 0.05)
    out.push(washer(`${o.id}-shim`, j.d + 0.2, dk, { name: `Shim washer ${fmt(j.d + 0.2)}x${fmt(dk)}x${fmt(zh - o.z1)}, under the head`, body: o.body, at: o.at, z0: o.z1, z1: zh, ex: o.ex, joints: [j.id], inset: false }));
  const h = head(`${o.id}-head`, "socket", M, {
    name: "",
    body: o.body,
    at: o.at,
    z0: zh,
    z1: zh + (sb?.k ?? 5),
    outer: disc(dk / 2),
    D: dk,
    ex: o.ex,
    joints: [j.id],
    group: o.id,
    headTop: true,
    accent: !!j.pin.accent,
  });
  out.push(h);
  ctx.add(out);
  return out;
}

export const boltName = (d: number, L: number) => `Shoulder bolt Ø${d} x ${shoulderLength(L)}, M${SHOULDER_BOLTS[d]?.M ?? threadFor(d)} (ISO 7379)`;

/** The elements a pin's parts put on its stack, and bore chamfers on every seat (M3). */
export function elements(ctx: RuleContext, j: PinJoint, body: string, at: Pose, group: string, closure: "open" | "shield" | "seal"): { els: Element[]; names: string[] } {
  const els: Element[] = [];
  const names: string[] = [];
  for (const x of j.joined) {
    const host = ctx.solidOf[x.part.id]!;
    if (j.driven.includes(x)) els.push({ z0: x.z0, z1: x.z1, ex: host.ex, over: x.z1, label: "" });
    else if (x.how === "slot") {
      const e = slotRoller(ctx, j, x, body, at, group);
      els.push(e);
      names.push(e.label);
    } else if (x.moving || !j.fixed) {
      const e = seatBearing(ctx, j, x, closure);
      els.push(e);
      names.push(e.label);
    } else els.push({ z0: x.z0, z1: x.z1, ex: host.ex, over: x.z1, label: "" });
    boreChamfers(host);
  }
  els.sort((a, b) => a.z0 - b.z0);
  return { els, names };
}

/** Ring marks for a tapped hole on a plate's top face. */
export const tappedMark = (M: number, x: number, y: number) => ({ kind: "thread" as const, pts: circle(M / 2 + 0.45, x, y, 24) });
