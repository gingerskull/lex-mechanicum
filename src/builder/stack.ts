// The axial stack builder (A20): one generator for the stack along any joint axis: bearing, spacer, retainer, thrust
// washer, hub and key on a dead axle (J1), a live shaft (J2), a shaft in plan or tilted (J10) and a moving pin (J3). It is
// written in the joint's own coordinates (z along the axis) and placed on the axis frame, so the same code serves a z
// joint and a tilted one. A support selector chooses housing, pillow block, bridge, or a stub or hung axle from where
// the sweeps leave room and what the load needs; the router (src/builder/router.ts) places the support.
import { circle } from "../core/geom";
import { realBody } from "./arms";
import { H } from "../hardware/primitives";
import type { Solid } from "../hardware/solid";
import { SHOULDER_BOLTS, circlipExt, circlipInt, headD, headH, innerRingD, keyFor, shoulderLength, threadFor, type Bearing } from "../hardware/tables";
import { housingBearing } from "../hardware/sub/housing";
import type { Solid3 } from "../solids/types";
import type { BuildCtx } from "./ctx";
import { type Frame, parallel } from "./frames";
import { Local, fitBore, half, type Fit, type Member } from "./lib";
import { bridgeSolids, routeBridge, type BridgeRoute } from "./router";
import { UP } from "./sites";
import { MIN_GAP } from "./constants";
import { liveHousing, pillowBlocks } from "./supports";

export type SupportKind = "housing" | "pillow" | "bridge" | "stub" | "hung";

export interface StackSpec {
  /** The site's id; solids are named from it. */
  id: string;
  /** Origin on the axis at the family's origin plane; z along the axis. */
  frame: Frame;
  kind: "dead" | "live" | "moving";
  members: Member[];
  /** Joint ids this stack serves. */
  joints: string[];
  /** The base along the axis (top and bottom faces, axial coordinates) when the axis is its normal; else null. */
  base: { top: number; bottom: number } | null;
  /** What can hold the stack: the base only (something passes over), a bridge only (something passes under), or both. */
  held: "both" | "base" | "bridge";
  /** The shaft end carries the accent (L4). */
  input?: boolean;
  /** Force a support instead of letting the selector choose. */
  support?: SupportKind;
  /** A live gear or pulley shaft with nothing over it is straddle mounted (A9). */
  straddle?: boolean;
  /** A mesh asked for a backlash eccentric under the housing (F7). */
  eccentric?: boolean;
  /** The axle ends flush in its top part, its clip recessed (a groove runs over it: an expansion link's trunnion). */
  flush?: boolean;
  /** Top of a pin's column in world z, for the base level (set by the caller when it needs it). */
  baseTopWorld?: number;
  /**
   * A fixed pin whose part is split in two plates with a gap between (an output crank whose pivot every other part
   * sweeps over or under): a live shaft keyed to both plates turns in a bushing in a bridge that runs in the gap.
   */
  between?: boolean;
}

export interface StackResult {
  solids: Solid3[];
  d: number;
  fit: Fit;
  support: SupportKind;
  /** Bores to cut in the member parts: solid id and radius. */
  bores: { solid: string; r: number }[];
  /** Axial extent of the hardware built, local w. */
  w0: number;
  w1: number;
  /** Solid ids that serve each function (F1 to F10), for the joint note. */
  serves: Record<string, string[]>;
  notes: string[];
  /** Where the bridge's beam is and what it covers; the bridge's id. */
  bridge?: { id: string; route: BridgeRoute };
}

const SPACER_MIN = 0.5;
const BEAM_GAP = 3;

/** The support selector (A20). */
export function selectSupport(spec: Pick<StackSpec, "kind" | "held" | "straddle" | "base" | "frame">): SupportKind {
  if (spec.kind === "moving") return "stub";
  if (!spec.base || !parallel(spec.frame.z, UP)) return "pillow";
  if (spec.kind === "live") return spec.straddle && spec.held !== "base" ? "bridge" : "housing";
  if (spec.held === "base") return "stub";
  if (spec.held === "bridge") return "hung";
  return "bridge";
}

interface Seat {
  m: Member;
  b: Bearing | null;
  z0: number;
  z1: number;
}

export function axialStack(ctx: BuildCtx, spec: StackSpec): StackResult {
  if (spec.between) return betweenStack(ctx, spec);
  const members = [...spec.members].sort((a, b) => a.w0 - b.w0);
  const fit = fitBore(members);
  const { d } = fit;
  const support = spec.support ?? selectSupport(spec);
  const L = new Local(spec.frame, { joints: spec.joints });
  const id = spec.id;
  const bores: { solid: string; r: number }[] = [];
  const serves: Record<string, string[]> = {};
  const serve = (f: string, ...ids: string[]) => ((serves[f] ??= []).push(...ids));
  const notes: string[] = [];
  const extra: Solid3[] = [];
  const moving = spec.kind === "moving";
  const live = spec.kind === "live";

  // ---- the members: a bearing in each turning part, a key and hub on each keyed one
  // a bevel gear (its teeth taper toward +w, the apex) is keyed in its own bore, its shim pack at its back face (J9)
  const isBevel = (m: Member) => ctx.geoms.get(m.body)?.scaleTop !== undefined;
  // a part with a hub of its own (a yoke) is keyed in its own bore and takes no clamp hub
  const ownHub = (m: Member) => !!ctx.geoms.get(m.body)?.exact && !isBevel(m);
  const anchorBody = realBody(ctx.kin, members[0]!.body);
  const clamped = (m: Member) => moving && m !== members[0] && realBody(ctx.kin, m.body) === anchorBody;
  const seats: Seat[] = members.map((m, i) => {
    const b = clamped(m) ? null : (fit.bearing[i] ?? null);
    if (clamped(m)) return { m, b: null, z0: m.w0, z1: m.w1 };
    if (m.keyed && !moving) return { m, b: null, z0: m.w0 - (isBevel(m) ? (m.shim ?? 0) : 0), z1: m.w1 };
    const B = b ? b.B : Math.min(6, m.w1 - m.w0);
    const c = (m.w0 + m.w1) / 2;
    const z0 = half(c - B / 2);
    return { m, b, z0, z1: z0 + B };
  });
  const keyedSeats = seats.filter((s) => s.m.keyed && !moving);
  const anchor = seats[0]!;
  // what the pin or shaft turns with: a shoulder bolt with the part it is threaded into, a live shaft with the part keyed
  // to it; a dead axle stands still. Inner-race spacers, sleeves and clips on it ride the same body.
  const turn = moving ? anchor.m.body : live ? (keyedSeats[0]?.m.body ?? anchor.m.body) : "ground";
  seats.forEach((s, i) => {
    const nm = `${id}-${i}`;
    const isAnchor = moving && s === anchor;
    if (isAnchor) {
      // the bolt threads into the lowest part: tapped, no bearing (M9)
      return;
    }
    if (s.b) {
      L.add(H.bearing(`${nm}-brg`, s.b, { body: s.m.body, z0: s.z0, z1: s.z1, closure: "shield" }));
      bores.push({ solid: s.m.solid, r: s.b.D / 2 + 0.05 });
      // an internal circlip on the outer race where the part is thick enough for it (F2)
      const c = circlipInt(s.b.D);
      if (s.m.w1 - s.z1 >= c.s + 0.3) {
        L.add(H.circlip(`${nm}-cl`, s.b.D, { internal: true, body: s.m.body, z0: s.z1, z1: s.z1 + c.s }));
        serve("F2", `${nm}-cl`);
      } else if (s.z0 - s.m.w0 >= c.s + 0.3) {
        L.add(H.circlip(`${nm}-cl`, s.b.D, { internal: true, body: s.m.body, z0: s.z0 - c.s, z1: s.z0 }));
        serve("F2", `${nm}-cl`);
      }
    } else if (clamped(s.m)) {
      // fixed on the pin's end, clamped under the head: bored to the pin, no bearing
      bores.push({ solid: s.m.solid, r: d / 2 + 0.05 });
      notes.push(`${s.m.name}: fixed on the pin's end, clamped under its head`);
    } else if (!s.m.keyed || moving) {
      const D = d + 3;
      L.add(H.bushing(`${nm}-bush`, d, D, { body: s.m.body, z0: s.m.w0, z1: s.m.w1 }));
      bores.push({ solid: s.m.solid, r: D / 2 + 0.05 });
      notes.push(`${s.m.name}: boss too small for a bearing, bronze bushing`);
    } else bores.push({ solid: s.m.solid, r: d / 2 + 0.05 });
  });
  // inner-race spacers between neighbours (A12)
  seats.forEach((s, i) => {
    const next = seats[i + 1];
    if (!next) return;
    const below = s.b || !s.m.keyed || moving ? s.z1 : s.m.w1;
    const above = next.b || !next.m.keyed || moving ? next.z0 : next.z0;
    if (moving && s === anchor) {
      // the bolt's shoulder runs from the anchor's face
      if (above - s.m.w1 > SPACER_MIN) L.add(H.spacer(`${id}-${i}-sp`, d + 0.2, next.b ? innerRingD(next.b) : d + 3, { z0: s.m.w1, z1: above, body: turn }));
      return;
    }
    if (above - below > SPACER_MIN) {
      L.add(H.spacer(`${id}-${i}-sp`, d + 0.2, s.b ? innerRingD(s.b) : next.b ? innerRingD(next.b) : d + 3, { z0: below, z1: above, body: turn }));
      serve("F4", `${id}-${i}-sp`);
    }
  });
  // keyed parts: a key over Ø8 or the D-flat, and one hub per keyed part (A5, A22). A live shaft that something sweeps
  // over ends flush in its top keyed part, keyed in the part's own bore and held by a washer and a countersunk screw into
  // the shaft end (F2, F3), so nothing stands over the part
  const kf = keyFor(d);
  const endHeld = live && spec.held === "base" && keyedSeats.length > 0;
  keyedSeats.forEach((s, i) => {
    const nm = `${id}-k${i}`;
    if (kf) {
      L.add(H.key(`${nm}-key`, kf.b, Math.max(8, s.m.w1 - s.m.w0 + 4), { body: s.m.body, at: [d / 2 - kf.t1 + kf.h / 2 - 0.4, 0, 0], z0: s.m.w0 + 0.5, z1: s.m.w0 + 0.5 + kf.h }));
      serve("F3", `${nm}-key`);
    }
    if (endHeld) return;
    const hubH = 8;
    const hubD = d + 10;
    const sh = s.m.shim ?? 0;
    if (ownHub(s.m)) return;
    if (isBevel(s.m)) {
      if (sh > 0) L.add(H.solid(`${nm}-shim`, { name: `Shim pack ${sh} mm at the back face, sets the mounting distance`, kind: "shim", role: "hw", mat: "Steel shim stock", outer: circle(hubD / 2, 0, 0, 32), holes: [circle(d / 2 + 0.1, 0, 0, 24)], z0: s.m.w0 - sh, z1: s.m.w0, body: s.m.body, inset: true }));
      return;
    }
    if (sh > 0) L.add(H.solid(`${nm}-shim`, { name: `Shim pack ${sh} mm, sets the mounting distance`, kind: "shim", role: "hw", mat: "Steel shim stock", outer: circle(hubD / 2, 0, 0, 32), holes: [circle(d / 2 + 0.1, 0, 0, 24)], z0: s.m.w1, z1: s.m.w1 + sh, body: s.m.body, inset: true }));
    L.add(H.collar(`${nm}-hub`, d, hubD, { body: s.m.body, z0: s.m.w1 + sh, z1: s.m.w1 + sh + hubH, name: `Clamp hub Ø${d}x${hubD}, two set screws at 90°` }));
    for (const k of [0, 1]) {
      const a = (k * Math.PI) / 2;
      L.add(H.setScrew(`${nm}-ss${k}`, 4, { body: s.m.body, at: [(hubD / 2 - 1) * Math.cos(a), (hubD / 2 - 1) * Math.sin(a), 0], outer: circle(2, 0, 0, 12), z0: s.m.w1 + sh + hubH / 2 - 1.5, z1: s.m.w1 + sh + hubH / 2 + 1.5, ...(k ? { name: "", qty: 0 } : { qty: 2 }) }));
    }
    serve("F3", `${nm}-hub`, `${nm}-ss0`);
  });

  const lastSeat = seats[seats.length - 1]!;
  const hubbed = keyedSeats.filter((s) => !isBevel(s.m) && !ownHub(s.m));
  const hubTop = hubbed.length && !endHeld ? Math.max(...hubbed.map((s) => s.m.w1 + (s.m.shim ?? 0) + 8)) : -Infinity;
  const zTop = Math.max(lastSeat.b || !lastSeat.m.keyed ? lastSeat.z1 : lastSeat.m.w1, hubTop, moving ? lastSeat.m.w1 : -Infinity);
  const first = members[0]!;
  const bt = spec.base?.top ?? first.w0 - 2;
  const bb = spec.base?.bottom ?? bt - 8;

  // ---- a moving pin: a shoulder bolt (J3)
  if (moving) {
    const bolt = `${id}-bolt`;
    const M = threadFor(d);
    const sb = SHOULDER_BOLTS[d];
    const k = sb ? sb.k : headH(d);
    const dk = sb ? sb.dk : headD(d);
    // the shoulder runs from the anchor's face to just over the top part, made up to the catalogue length by a washer
    // under the head; the thread runs through the anchor, tapped through (M9), and stops at its far face
    const need = zTop + 0.6 - anchor.m.w1;
    const len = shoulderLength(need);
    const wash = len - need;
    const top = anchor.m.w1 + len;
    if (wash > 0.2) L.add(H.washer(`${bolt}-wsh`, d + 0.3, Math.min(dk, d + 6), { body: turn, z0: top - wash, z1: top, name: `Shim washer ${d} x ${wash.toFixed(1)}, makes up the shoulder length`, group: bolt }));
    L.add(H.shaft(bolt, { d, z0: anchor.m.w0, z1: top, thread: { M, z0: anchor.m.w0, z1: anchor.m.w1 } }, { body: turn, name: `Shoulder bolt Ø${d} x ${len}, M${M} (ISO 7379)` }));
    L.add(H.head(`${bolt}-head`, "socket", Math.max(3, M), { body: turn, outer: circle(dk / 2, 0, 0, 36), z0: top, z1: top + k, name: "", D: dk, group: bolt }));
    bores.push({ solid: anchor.m.solid, r: M / 2 - 0.25 });
    serve("F2", bolt);
    serve("F3", bolt);
    return done(L, "stub", top + k);
  }

  // ---- a fixed axle or shaft
  const ce = circlipExt(d);
  const shaftSpec: Parameters<typeof H.shaft>[1] = { d, z0: first.w0 - 4, z1: zTop + 3 };
  const shoulders: { z: number; D: number; h: number }[] = [];
  const grooves: number[] = [];
  const shaftId = `${id}-axle`;
  let name: string;
  let bridge: StackResult["bridge"];
  const fromBase = support !== "hung" && support !== "pillow" && spec.base !== null;

  if (support === "pillow") {
    const lo = Math.min(...L.list.map((x) => x.z0), first.w0);
    const hi = Math.max(...L.list.map((x) => x.z1), zTop);
    const baseTopW = spec.baseTopWorld ?? ctx.base?.top;
    if (baseTopW === undefined) throw new Error(`${id}: the base level is not set`);
    const p = pillowBlocks(ctx, { id: `${id}-pb`, frame: spec.frame, d, live, lo, hi, baseTop: baseTopW, joints: spec.joints });
    extra.push(...p.solids);
    shaftSpec.z0 = p.shaft[0] - (live ? (spec.input ? 18 : 6) : 0);
    shaftSpec.z1 = p.shaft[1] + (live ? 12 : 0);
    // a part overhung past both blocks is held on the shaft's end by a washer and a countersunk screw (J10, F2)
    const top = members[members.length - 1]!;
    if (live && Math.max(...p.w) < top.w0) {
      const M = d >= 10 ? 5 : d >= 8 ? 4 : 3;
      const wh = 1.5;
      L.add(H.washer(`${id}-ew`, M + 0.4, d + 8, { body: turn, z0: top.w1, z1: top.w1 + wh, name: `End washer ${M + 0.4}x${d + 8}, holds the ${top.name.toLowerCase()} on the shaft end` }));
      L.add(H.screw(`${id}-es`, "csk", M, 2 * M + wh, { body: turn, face: top.w1 + wh, dir: -1 }));
      serve("F2", `${id}-ew`, `${id}-es`);
      shaftSpec.z1 = top.w1;
    }
    ctx.routes.push({ support: `${id}-pb`, site: id, kind: "pillow", tried: p.tried, moved: p.moved, covers: p.covers, gap: p.gap });
    for (const [f, ids] of Object.entries(p.serves)) serve(f, ...ids);
    p.covers.forEach((c) => ctx.covers.set(`${id}-pb-b0`, [...(ctx.covers.get(`${id}-pb-b0`) ?? []), c]));
    name = live ? `Live shaft Ø${d} in two pillow blocks${kf ? `, keyed (feather key ${kf.b}x${kf.h})` : ", D-flat"}` : `Dead shaft Ø${d}, clamped in two pillow blocks`;
    if (live) {
      if (kf) shaftSpec.keyway = [first.w0, zTop];
      else shaftSpec.flat = true;
    }
  } else {
    if (fromBase) {
      // a dead axle stands on its shoulder on the base; a live shaft is located in its housing and only its thrust
      // washer lies on the base (A12: nothing turning bears on a ground face)
      if (!live) shoulders.push({ z: bt, D: d + 4, h: 1 });
      const tw = live ? bt : bt + 1;
      shaftSpec.z0 = bb - (live ? 24 : 6);
      if (!live) shaftSpec.thread = { M: threadFor(d), z0: bb - 6, z1: bb - 0.5 };
      L.add(H.thrustWasher(`${id}-tw`, d + 0.2, d + 8, { body: "ground", z0: tw, z1: tw + 1 }));
      serve("F4", `${id}-tw`);
      const fb = seats[0]!;
      const lo = fb.b || !fb.m.keyed ? fb.z0 : fb.m.w0;
      if (lo - (tw + 1) > SPACER_MIN) L.add(H.spacer(`${id}-sp0`, d + 0.2, fb.b ? innerRingD(fb.b) : d + 3, { z0: tw + 1, z1: lo, body: turn }));
    } else {
      // hung from its bridge: a circlip under the first part keeps it up
      grooves.push(first.w0 - 4 + 0.6);
    }
    if (support === "housing" || (live && spec.base)) {
      const h = liveHousing(L, { id, d, bb, eccentric: spec.eccentric ?? false, joints: spec.joints });
      shaftSpec.z0 = h.bottom - 18;
      serve("F2", `${id}-hcl0`, `${id}-hcl1`);
      serve("F1", `${id}-hdw0`, `${id}-hdw1`);
      serve("F4", `${id}-hww`);
    }
    if (support === "bridge" || support === "hung") {
      const o = spec.frame.o;
      const baseTopW = spec.baseTopWorld ?? o[2] + bt;
      const baseBotW = o[2] + bb;
      const minBottom = o[2] + zTop + BEAM_GAP;
      const route = routeBridge(ctx, { id: `${id}-bridge`, over: [o[0], o[1]], rB: 10.5, minBottom, baseTop: baseTopW });
      if (!route) throw new Error(`${id}: no pair of posts clears the sweeps for a bridge`);
      const beamBot = route.bottom - o[2];
      const beamTop = route.top - o[2];
      const hole = (circleBushing(d) / 2) + 0.05;
      const bs = bridgeSolids(ctx, { id: `${id}-bridge`, over: [o[0], o[1]], route, hole, baseTop: baseTopW, baseBottom: baseBotW, joints: spec.joints });
      extra.push(...bs);
      bridge = { id: `${id}-bridge`, route };
      ctx.routes.push({ support: `${id}-bridge`, site: id, kind: support, tried: route.tried, moved: route.moved, covers: route.covers, gap: route.gap });
      if (route.covers.length) ctx.covers.set(`${id}-bridge`, route.covers);
      // the axle runs up through a bushing in the beam; a sleeve fills the gap over the top part
      // (a live shaft is located in its housing and its parts keyed and hubbed, so it takes no sleeve)
      if (!live && beamBot - zTop > SPACER_MIN) L.add(H.tube(`${id}-slv`, d + 0.2, innerRingD(lastSeat.b ?? { d, D: d + 10 }), { z0: zTop, z1: beamBot, body: turn }));
      L.add(H.bushing(`${id}-bb`, d, circleBushing(d), { body: "ground", z0: beamBot, z1: beamTop }));
      // a dead axle's clip bears on the bushing; a live shaft is located in its housing, so its clip only stands guard,
      // clear of the fixed beam by the sweep margin (A12, A14)
      const cz = beamTop + (live ? MIN_GAP + 0.1 : 0.3);
      grooves.push(cz);
      L.add(H.circlip(`${id}-ecl`, d, { z0: cz, z1: cz + ce.s, body: turn }));
      serve("F1", `${id}-bridge`);
      serve("F2", `${id}-ecl`);
      shaftSpec.z1 = cz + ce.s + 1.5;
    } else if (endHeld) {
      const top = keyedSeats[keyedSeats.length - 1]!.m;
      const M = d >= 10 ? 5 : d >= 8 ? 4 : 3;
      const wh = 1.5;
      L.add(H.washer(`${id}-ew`, M + 0.4, d + 8, { body: turn, z0: top.w1, z1: top.w1 + wh, name: `End washer ${M + 0.4}x${d + 8}, holds the ${top.name.toLowerCase()} on the shaft end` }));
      L.add(H.screw(`${id}-es`, "csk", M, 2 * M + wh, { body: turn, face: top.w1 + wh, dir: -1 }));
      serve("F2", `${id}-ew`, `${id}-es`);
      shaftSpec.z1 = top.w1;
    } else if (support !== "housing" || !spec.straddle) {
      const clZ = zTop + 0.3;
      grooves.push(clZ);
      L.add(H.circlip(`${id}-ecl`, d, { z0: clZ, z1: clZ + ce.s, body: turn }));
      serve("F2", `${id}-ecl`);
      shaftSpec.z1 = clZ + ce.s + (spec.flush ? 0.1 : 1.5);
    }
    name = live ? `Live shaft Ø${d}, ${kf ? `keyed (feather key ${kf.b}x${kf.h})` : "D-flat"}` : `Dead axle Ø${d}, shouldered, M${threadFor(d)} end`;
    if (live) {
      if (kf) shaftSpec.keyway = [first.w0, zTop];
      else shaftSpec.flat = true;
    }
  }
  shaftSpec.shoulders = shoulders;
  shaftSpec.grooves = grooves;
  const sh = H.shaft(shaftId, shaftSpec, { name, body: turn });
  L.add(sh);
  if (live && spec.input) sh[sh.length - 1]!.accent = true;
  if (!live) serve("F1", shaftId);
  return done(L, support, undefined, extra, bridge);

  function done(Lc: Local, sup: SupportKind, top?: number, more: Solid3[] = [], br?: StackResult["bridge"]): StackResult {
    for (const x of Lc.list) if (!x.joints.length) x.joints = [...spec.joints];
    const w0 = Math.min(...Lc.list.map((x) => x.z0));
    const w1 = Math.max(...Lc.list.map((x) => x.z1), top ?? -Infinity);
    return { solids: [...Lc.out(), ...more], d, fit, support: sup, bores, w0, w1, serves, notes, ...(br ? { bridge: br } : {}) };
  }
}

/** A live shaft keyed to the two plates of a split part, turning in a bushing in a bridge in the gap between them. */
function betweenStack(ctx: BuildCtx, spec: StackSpec): StackResult {
  const members = [...spec.members].sort((a, b) => a.w0 - b.w0);
  const lo = members[0]!;
  const hi = members[members.length - 1]!;
  const fit = fitBore(members);
  const d = Math.max(8, fit.d);
  const id = spec.id;
  const L = new Local(spec.frame, { joints: spec.joints });
  const o = spec.frame.o;
  const serves: Record<string, string[]> = {};
  const serve = (f: string, ...ids: string[]) => ((serves[f] ??= []).push(...ids));
  const baseTop = ctx.base?.top ?? o[2] + lo.w0 - 10;
  const baseBot = ctx.base?.bottom ?? baseTop - 8;
  const route = routeBridge(ctx, { id: `${id}-bridge`, over: [o[0], o[1]], rB: 10.5, minBottom: o[2] + lo.w1 + MIN_GAP + 1, baseTop, below: o[2] + hi.w0 - MIN_GAP - 1 });
  if (!route) throw new Error(`${id}: no bridge fits between the two plates`);
  const b0 = route.bottom - o[2];
  const b1 = route.top - o[2];
  const bushD = circleBushing(d);
  const extra = bridgeSolids(ctx, { id: `${id}-bridge`, over: [o[0], o[1]], route, hole: bushD / 2 + 0.05, baseTop, baseBottom: baseBot, joints: spec.joints });
  const turn = lo.body;
  L.add(H.bushing(`${id}-bb`, d, bushD, { body: "ground", z0: b0, z1: b1, name: `Bronze bushing ${d}x${bushD}, in the bridge` }));
  // bronze thrust washers each side of the beam locate the shaft; spacers on the shaft fill to the plates
  L.add(H.thrustWasher(`${id}-tw0`, d + 0.2, d + 8, { body: "ground", z0: b0 - 1, z1: b0 }));
  L.add(H.thrustWasher(`${id}-tw1`, d + 0.2, d + 8, { body: "ground", z0: b1, z1: b1 + 1, name: "" }));
  if (b0 - 1 - lo.w1 > SPACER_MIN) L.add(H.spacer(`${id}-sp0`, d + 0.2, d + 4, { body: turn, z0: lo.w1, z1: b0 - 1 }));
  if (hi.w0 - (b1 + 1) > SPACER_MIN) L.add(H.spacer(`${id}-sp1`, d + 0.2, d + 4, { body: turn, z0: b1 + 1, z1: hi.w0 }));
  serve("F4", `${id}-tw0`, `${id}-tw1`);
  // the shaft ends flush in both plates, each held by an end washer and a countersunk screw (F2, F3: D-flat in both)
  const M = d >= 10 ? 5 : d >= 8 ? 4 : 3;
  const wh = 1.5;
  L.add(H.washer(`${id}-ew0`, M + 0.4, d + 8, { body: turn, z0: hi.w1, z1: hi.w1 + wh, name: `End washer ${M + 0.4}x${d + 8}, holds the arms on the shaft`, qty: 2 }));
  L.add(H.screw(`${id}-es0`, "csk", M, 2 * M + wh, { body: turn, face: hi.w1 + wh, dir: -1, qty: 2 }));
  L.add(H.washer(`${id}-ew1`, M + 0.4, d + 8, { body: turn, z0: lo.w0 - wh, z1: lo.w0, name: "" }));
  L.add(H.screw(`${id}-es1`, "csk", M, 2 * M + wh, { body: turn, face: lo.w0 - wh, dir: 1, name: "", qty: 0 }));
  serve("F2", `${id}-ew0`, `${id}-es0`, `${id}-ew1`, `${id}-es1`);
  L.add(H.shaft(`${id}-shaft`, { d, z0: lo.w0, z1: hi.w1, flat: true }, { name: `Live shaft Ø${d}, D-flat in both arms, in a bushing in the bridge between them`, body: turn }));
  serve("F3", `${id}-shaft`);
  serve("F1", `${id}-bridge`);
  for (const x of L.list) if (!x.joints.length) x.joints = [...spec.joints];
  return {
    solids: [...L.out(), ...extra],
    d,
    fit,
    support: "bridge",
    bores: members.map((m) => ({ solid: m.solid, r: d / 2 + 0.05 })),
    w0: lo.w0 - wh,
    w1: hi.w1 + wh,
    serves,
    notes: [`a live shaft keyed to both plates turns in a bushing in a bridge between them: the other parts sweep over and under the pivot`],
    bridge: { id: `${id}-bridge`, route },
  };
}

/** Outside Ø of the bushing a bridge's boss carries for an axle of Ø d. */
const circleBushing = (d: number): number => d + 4;

export type { Solid };
export { housingBearing };
