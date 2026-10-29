// The drive of an oscillating or a linear input (standard V1 to V6, F10), beside the rotary drive of the `drive` rule
// (shared.ts). oscillating: the motor in its flange under the base turns a short crank; a link from the crank pin to a
// pin in a lever keyed on the input shaft's low end swings the input through exactly its range, the crank and the link at
// a dead centre at each end of the swing (the crank belongs to the drive: src/solids/drive.ts poses it from the input).
// A compliant joint's lever (J13) has no shaft: a pin pressed into its tip runs down through an arc slot in the base to
// the link, the motor in a one-piece bracket on the line of the tip's chord. linear: a belt loop under the base along the
// stroke, a carriage clamped to the belt's near span and rising through a slot in the base to the slider, the motor in a
// one-piece bracket at one end and a slotted tensioner under the idler at the other. Every form has the home flag on the
// input, a fork sensor on a post, leads to a terminal block and the cable clip (the cable-clip rule). Everything is laid
// out under the base, clear of the feet, the housings and the base hardware (V3), so no part of the drive covers the
// principle parts in the default view (A19, T10 to T12).
import { TAU, circle, gearOutline, roundRect, roundedPoly, type Vec2 } from "../../core/geom";
import { H, stroke } from "../../hardware/primitives";
import { MOTORS, PULLEYS, SENSOR, circlipExt, keyFor } from "../../hardware/tables";
import { D2R, type Vec3, v3, wrapPi, xf } from "../../kin/math";
import type { KinDriver } from "../../kin/types";
import { crankPin, driveSide, type DriveMotion } from "../../solids/drive";
import type { Solid3 } from "../../solids/types";
import { MIN_GAP } from "../constants";
import type { BuildCtx, JointNote } from "../ctx";
import { fromPlane, parallel, place, planeCoords, rot2 as rot, type Frame } from "../frames";
import { pointDist, ringDist } from "../planar";
import { clearance } from "../router";
import { UP } from "../sites";
import { worldManifold, worldPoints } from "../sweeps";
import { cutBore } from "./stacks";
import { slideTravel } from "../belt-run";

const UPF: Frame = { o: [0, 0, 0], x: [1, 0, 0], z: [0, 0, 1] };
const J = ["drive"];
const MOT = MOTORS.pancake;
const PIN = 4;
const fmt = (v: number): string => String(+v.toFixed(1));
const deg = (r: number): string => String(+((r * 180) / Math.PI).toFixed(1));
const xy = (p: Vec3): Vec2 => [p[0], p[1]];
const at3 = (p: Vec2, z = 0): Vec3 => [p[0], p[1], z];
const d2 = (a: Vec2, b: Vec2): number => Math.hypot(a[0] - b[0], a[1] - b[1]);
const add2 = (a: Vec2, b: Vec2, k = 1): Vec2 => [a[0] + b[0] * k, a[1] + b[1] * k];
const dir2 = (a: number): Vec2 => [Math.cos(a), Math.sin(a)];
const ang2 = (a: Vec2, b: Vec2): number => Math.atan2(b[1] - a[1], b[0] - a[0]);
const hole = (r: number, c: Vec2, n = 24): Vec2[] => circle(r, c[0], c[1], n).reverse();
/** A frame on the base plane at p whose x points along angle a. */
const frameAt = (p: Vec2, a: number): Frame => ({ o: [p[0], p[1], 0], x: [Math.cos(a), Math.sin(a), 0], z: [0, 0, 1] });

/** The driver's range, its value at each end of the swing or stroke. */
const rangeOf = (d: KinDriver): [number, number] => [d.lo ?? d.range?.[0] ?? d.default ?? 0, d.hi ?? d.range?.[1] ?? d.default ?? 0];

// ------------------------------------------------------------------------------------------------ what is under the base

/** A solid under the base seen from above, with its height range: what a drive part laid out there must clear. */
/** The shortest post a fork sensor stands on, mm: below it the fork goes beside the hub (oscillatingInPlan). */
const POST_MIN = 6;

interface Obstacle {
  id: string;
  polys: Vec2[][];
  z0: number;
  z1: number;
}

/** Every solid that reaches below `zTop` (the base itself and the drive's own parts excepted). */
function obstacles(ctx: BuildCtx, zTop: number): Obstacle[] {
  const out: Obstacle[] = [];
  for (const s of ctx.solids) {
    if (s.flags.isBase || s.joints.includes("drive")) continue;
    const pts = worldPoints(ctx.M, s);
    let z0 = Infinity;
    let z1 = -Infinity;
    for (const p of pts) {
      z0 = Math.min(z0, p[2]);
      z1 = Math.max(z1, p[2]);
    }
    if (z0 >= zTop) continue;
    out.push({ id: s.id, polys: ctx.sweeps.staticPolys(s), z0, z1 });
  }
  return out;
}

/** True when a disc of radius r at p, from z0 to z1, keeps `gap` from every obstacle. */
const clearDisc = (obs: Obstacle[], p: Vec2, r: number, z0: number, z1: number, gap = MIN_GAP): boolean =>
  obs.every((o) => o.z1 <= z0 || o.z0 >= z1 || o.polys.every((ring) => pointDist(ring, p[0], p[1]) >= r + gap));

/** True when a ring from z0 to z1 keeps `gap` from every obstacle. */
const clearRing = (obs: Obstacle[], ring: Vec2[], z0: number, z1: number, gap = MIN_GAP): boolean =>
  obs.every((o) => o.z1 <= z0 || o.z0 >= z1 || o.polys.every((q) => ringDist(ring, q, gap) >= gap));

// ------------------------------------------------------------------------------------------------ motor mountings

/**
 * The motor hung under the base in its flange, screwed up into the base from inside (V1, V2): the form of the rotary
 * drive under the base. Returns the motor's underside.
 */
function motorInFlange(ctx: BuildCtx, M: Vec2, drive?: DriveMotion, shaftTo?: number): number {
  const bb = ctx.base!.bottom;
  const mTop = bb - 3;
  const mBot = mTop - MOT.H;
  ctx.add(place(UPF, H.solid("drive-motor", { name: MOT.name, kind: "motor", role: "hw", mat: "Aluminium housing, neodymium rotor", outer: circle(MOT.R, M[0], M[1], 48), holes: [hole(MOT.shaft / 2 + 0.2, M, 16)], z0: mBot, z1: mTop, joints: J })));
  ctx.add(place(UPF, H.solid("drive-motor-core", { name: "", kind: "motorInternal", role: "hw", outer: circle(MOT.R - 4, M[0], M[1], 36), z0: mBot + 3, z1: mTop - 3, faint: true, inset: true, joints: J })));
  ctx.add(place(UPF, H.plate("drive-flange", roundRect(M[0] - 29, M[1] - 29, M[0] + 29, M[1] + 29, 4), { name: "Motor flange, screwed up into the base", kind: "bracket", z0: mTop, z1: bb, holes: [hole(MOT.R - 2, M, 36)], joints: J })));
  [[-22, -22], [22, -22], [22, 22], [-22, 22]].forEach(([dx, dy], k) =>
    ctx.add(place(UPF, H.screw(`drive-fl${k}`, "socket", 3, 3 + 4.5, { at: [M[0] + dx!, M[1] + dy!, 0], face: mTop, dir: 1, ...(k ? { name: "", qty: 0 } : { qty: 4 }), joints: J }))),
  );
  // the shaft runs up into the motor's bore, short of its core
  ctx.add(place(UPF, H.shaft("drive-shaft", { d: MOT.shaft, z0: shaftTo ?? mBot - 14, z1: mBot + 2.5, flat: true }, { name: `Motor shaft Ø${MOT.shaft}, D-flat`, at: [M[0], M[1], 0], joints: J }), drive ? { drive } : {}));
  return mBot;
}

/** An arc band from angle t0 to t1 between radii ri and ro about c: the bracket wall with its window. */
function band(c: Vec2, ri: number, ro: number, t0: number, t1: number, n = 48): Vec2[] {
  const pts: Vec2[] = [];
  for (let i = 0; i <= n; i++) pts.push(add2(c, dir2(t0 + ((t1 - t0) * i) / n), ro));
  for (let i = n; i >= 0; i--) pts.push(add2(c, dir2(t0 + ((t1 - t0) * i) / n), ri));
  return pts;
}

/** Heights of the one-piece bracket under the base, from its floor's top face. */
interface BracketZ {
  floorTop: number;
  /** Top of the motor shaft, above the floor. */
  shaftTop: number;
}

/**
 * The motor in a one-piece bracket under the base (V1, V2): a top flange screwed up into the base from inside, a wall
 * with a full-height window toward `toward` (angle) for the belt or the link, a floor the motor's face is screwed to,
 * the motor under the floor with its shaft up through it into the bracket.
 */
function motorBracket(ctx: BuildCtx, M: Vec2, toward: number, z: BracketZ, drive?: DriveMotion, windowHalf = (62 * Math.PI) / 180): void {
  const bb = ctx.base!.bottom;
  const R = MOT.R;
  const zf1 = z.floorTop;
  const zf0 = zf1 - 3;
  const B = { kind: "bracket" as const, role: "ground" as const, mat: "Aluminium 6061-T6, anodised", joints: J, group: "drive-bracket" };
  const lugs = [toward + Math.PI, toward + (2 * Math.PI) / 3, toward - (2 * Math.PI) / 3].map((t) => add2(M, dir2(t), R - 6));
  const face = [toward + Math.PI / 2, toward - Math.PI / 2].map((t) => add2(M, dir2(t), 11));
  ctx.add(place(UPF, H.plate("drive-top", circle(R, M[0], M[1], 48), { ...B, name: `Motor bracket Ø${2 * R}, one piece: top flange, wall with a window, floor`, holes: [hole(R - 9, M, 40), ...lugs.map((p) => hole(1.7, p, 14))], z0: bb - 3, z1: bb })));
  ctx.add(place(UPF, H.plate("drive-wall", band(M, R - 3, R, toward + windowHalf, toward + TAU - windowHalf), { ...B, name: "", z0: zf1, z1: bb - 3 })));
  ctx.add(place(UPF, H.plate("drive-floor", circle(R, M[0], M[1], 48), { ...B, name: "", holes: [hole(MOT.shaft / 2 + 1, M, 16), ...face.map((p) => hole(1.7, p, 14))], z0: zf0, z1: zf1 })));
  lugs.forEach((p, k) => ctx.add(place(UPF, H.screw(`drive-top-sc${k}`, "button", 3, 3 + 4.5, { at: at3(p), face: bb - 3, dir: 1, ...(k ? { name: "", qty: 0 } : { qty: 3 }), joints: J }))));
  face.forEach((p, k) => ctx.add(place(UPF, H.screw(`drive-face-sc${k}`, "button", 3, 6, { at: at3(p), face: zf1, dir: -1, ...(k ? { name: "", qty: 0 } : { qty: 2 }), joints: J }))));
  const mTop = zf0;
  const mBot = mTop - MOT.H;
  ctx.add(place(UPF, H.solid("drive-motor", { name: MOT.name, kind: "motor", role: "hw", mat: "Aluminium housing, neodymium rotor", outer: circle(MOT.R, M[0], M[1], 48), holes: [hole(MOT.shaft / 2 + 0.2, M, 16)], z0: mBot, z1: mTop, joints: J })));
  ctx.add(place(UPF, H.solid("drive-motor-core", { name: "", kind: "motorInternal", role: "hw", outer: circle(MOT.R - 4, M[0], M[1], 36), z0: mBot + 3, z1: mTop - 3, faint: true, inset: true, joints: J })));
  ctx.add(place(UPF, H.shaft("drive-shaft", { d: MOT.shaft, z0: mTop - 2.5, z1: z.shaftTop, flat: true }, { name: `Motor shaft Ø${MOT.shaft}, D-flat`, at: [M[0], M[1], 0], joints: J }), drive ? { drive } : {}));
}

// ------------------------------------------------------------------------------------------------ sensing and cabling

/**
 * A fork sensor straddling a vane at height vz (the vane's underside), its mouth `mouth` from the frame's origin along
 * its x, carried by a post up to the base (V6, F10). Returns the point its lead leaves from.
 */
function forkSensor(ctx: BuildCtx, F: Frame, mouth: number, vz: number, post = true): Vec2 {
  const bb = ctx.base!.bottom;
  const mid = vz + SENSOR.vane / 2;
  const sz = mid - SENSOR.h / 2;
  const gap0 = mid - SENSOR.slot / 2;
  const gap1 = gap0 + SENSOR.slot;
  const box = (r0: number, r1: number): Vec2[] => [[r0, -SENSOR.w / 2], [r1, -SENSOR.w / 2], [r1, SENSOR.w / 2], [r0, SENSOR.w / 2]];
  const fork = { kind: "sensor" as const, role: "hw" as const, joints: J, group: "drive-sensor" };
  ctx.add(place(F, H.solid("drive-sensor", { ...fork, name: `Fork sensor, slotted optical, ${SENSOR.slot} mm gap`, mat: "PBT housing", outer: box(mouth, mouth + SENSOR.l), z0: sz, z1: gap0 })));
  ctx.add(place(F, H.solid("drive-sensor-jaw", { ...fork, name: "", outer: box(mouth, mouth + SENSOR.l), z0: gap1, z1: sz + SENSOR.h })));
  ctx.add(place(F, H.solid("drive-sensor-back", { ...fork, name: "", outer: box(mouth + SENSOR.depth, mouth + SENSOR.l), z0: gap0, z1: gap1 })));
  const r = mouth + SENSOR.l - 6;
  if (post) ctx.add(place(F, H.standoff("drive-sensor-post", { at: [r, 0, 0], z0: sz + SENSOR.h, z1: bb, name: "Standoff Ø10 under the base, carries the sensor", joints: J })));
  const w = F.o;
  return [w[0] + F.x[0] * (mouth + SENSOR.l), w[1] + F.x[1] * (mouth + SENSOR.l)];
}

/** The fork sensor's footprint in plan (for the layout checks). */
function forkRing(F: Frame, mouth: number): Vec2[] {
  const y: Vec2 = [-F.x[1], F.x[0]];
  const o: Vec2 = [F.o[0], F.o[1]];
  const p = (r: number, t: number): Vec2 => [o[0] + F.x[0] * r + y[0] * t, o[1] + F.x[1] * r + y[1] * t];
  return [p(mouth, -SENSOR.w / 2), p(mouth + SENSOR.l, -SENSOR.w / 2), p(mouth + SENSOR.l, SENSOR.w / 2), p(mouth, SENSOR.w / 2)];
}

/** The motor and sensor leads, each along its own route, to a terminal block under the base (V6). */
function cabling(ctx: BuildCtx, tb: Vec2, tbDir: number, routes: Vec2[][]): void {
  const bb = ctx.base!.bottom;
  ctx.add(place(frameAt(tb, tbDir + Math.PI / 2), H.terminalBlock("drive-terminals", 4, { z0: bb - 6, z1: bb, joints: J })));
  // each lead into its own clamp of the block
  routes.forEach((r, k) => ctx.add(place(UPF, H.lead(k ? "drive-lead-sensor" : "drive-lead", [...r, add2(tb, dir2(tbDir + Math.PI / 2), k ? 5 : -5)], { z0: bb - 2.2, z1: bb - 1.2, joints: J, ...(k ? { name: "" } : {}) }))));
}

// ------------------------------------------------------------------------------------------------ oscillating, on a shaft

interface CrankLayout {
  M: Vec2;
  r: number;
  L: number;
  score: number;
}

/**
 * The motor's place for a crank and link that swing a pin through the positions `tips` (one per sample), its ends Tlo
 * and Thi: the crank and the link at a dead centre at each end, so the swing is exactly the input's range. `ok` judges a
 * candidate's footprint; the nearest one that passes is taken.
 */
function crankLayouts(tips: Vec2[], Tlo: Vec2, Thi: Vec2, from: Vec2, span: [number, number], rcMin: number, ok: (c: CrankLayout) => boolean): CrankLayout | null {
  let best: CrankLayout | null = null;
  const step = Math.max(2, (span[1] - span[0]) / 14);
  for (let D = span[0]; D <= span[1]; D += step)
    for (let k = 0; k < 36; k++) {
      const M = add2(from, dir2((k / 36) * TAU), D);
      const dHi = d2(M, Thi);
      const dLo = d2(M, Tlo);
      const r = Math.abs(dHi - dLo) / 2;
      const L = (dHi + dLo) / 2;
      // the crank comes out long enough to make, the link long enough to keep the transmission angle and to pass its own
      // pin clear of the crank (a dead centre at each end)
      if (r < rcMin || L < 2.5 * r || L < 2 * r + 12.5) continue;
      // every position of the pin within reach of the crank and the link: the swing's ends are its farthest and nearest
      if (tips.some((t) => d2(M, t) > L + r + 1e-6 || d2(M, t) < L - r - 1e-6)) continue;
      const c = { M, r, L, score: D };
      if (best && best.score <= c.score) continue;
      if (ok(c)) best = c;
    }
  return best;
}

/** The widest swing a crank and link drive directly; a wider one goes through a gear step-up. */
const SWING_MAX = 150 * D2R;
/** The swing the step-up's sector is given at most. */
const SECTOR_SWING = 110 * D2R;

/**
 * An oscillating input on a live shaft (J2, its axis the base normal): a lever keyed on the shaft's low end under the
 * housing, the motor in its flange under the base, its crank and the link below the motor. A swing wider than a crank
 * and link can give (a balance's turn and a half) goes through a step-up: a pinion keyed on the shaft's end meshes a
 * gear sector on its own pivot, hung from the base, and the link swings the sector by a pin in its face.
 */
function oscillatingShaft(ctx: BuildCtx, drv: KinDriver, siteId: string): void {
  const site = ctx.sites.find((s) => s.id === siteId)!;
  const st = ctx.stacks.get(site.id)!;
  const axle = ctx.get(`${site.id}-axle`);
  const base = ctx.base!;
  if (!axle || !parallel(site.axis, UP)) {
    ctx.issues.push(`drive: the oscillating input ${site.id} has no shaft along the base normal to take a lever`);
    return;
  }
  const input = axle.body;
  const bb = base.bottom;
  // heights: the motor in its flange, the crank under it, the link, then the lever on the shaft's end (the shaft's low
  // end is bb - 40, under the housing)
  const zc: [number, number] = [bb - 26.5, bb - 22];
  const zk: [number, number] = [bb - 31.5, bb - 27];
  const zl: [number, number] = [bb - 37, bb - 32];
  const axleLow = Math.min(...worldPoints(ctx.M, axle).map((p) => p[2]));
  if (axleLow > zl[0] - 1.5) {
    ctx.issues.push(`drive: the input shaft ${site.id} ends at ${fmt(axleLow)}, above the drive lever`);
    return;
  }
  const P: Vec2 = [site.at[0], site.at[1]];
  const d = st.d;
  const [lo, hi] = rangeOf(drv);
  const def = drv.default ?? (lo + hi) / 2;
  const speed = drv.speed ?? 1;
  const phase = (drv.phase ?? 0) * D2R;
  // the driver is the joint's angle: the swing is its range (a turn and more reads wrongly off the poses)
  const swing = Math.abs(hi - lo) * D2R;
  const X0 = ctx.K.poseAt({ [drv.id]: def }).bodies.get(input) ?? xf.id();
  const X1 = ctx.K.poseAt({ [drv.id]: def + 5 }).bodies.get(input) ?? xf.id();
  const sign: 1 | -1 = xf.angleAbout(xf.mul(X1, xf.inv(X0)), UP) >= 0 ? 1 : -1;
  const law = (u: number): number => lo + (hi - lo) * (0.5 - 0.5 * Math.cos(speed * u + phase));
  // the step-up: a pinion of zp teeth (module 1) on the shaft, a sector of ratio x zp on its own pivot
  const ratio = swing > SWING_MAX ? Math.ceil(swing / SECTOR_SWING) : 1;
  const zp = Math.max(12, Math.ceil(d + 8));
  const zs = zp * ratio;
  const rpP = zp / 2;
  const rpS = zs / 2;
  const centre = rpP + rpS + 0.15;
  const stepped = ratio > 1;
  const hubR = stepped ? rpP + 1 : d / 2 + 5;
  const turn = stepped ? swing / ratio : swing;
  // a swing too small for a 22 mm lever to give a 5 mm crank (a few degrees) gets a longer lever and a 2 mm crank
  const small = 22 * Math.sin(turn / 2) < 5;
  const rho = stepped ? rpS - 7 : small ? Math.ceil(2 / Math.sin(turn / 2)) : 22;
  const rcMin = small ? 2 : 5;
  const obs = obstacles(ctx, bb);
  const below = obs.filter((o) => o.z0 < bb - 0.5);
  const n = ctx.sampled.us.length;
  const bounds = ctx.sweeps.bounds();
  const outside = (p: Vec2): number => (bounds ? Math.max(0, bounds[0] - p[0], p[0] - bounds[3], bounds[1] - p[1], p[1] - bounds[4]) : 0);
  const own = below.filter((o) => !ctx.get(o.id) || ctx.get(o.id)!.body !== input);
  const sectorAt = (v: number): number => (-sign * (v - def) * D2R) / ratio;

  type Choice = { a: number; T0: Vec2; G: Vec2 | null; c: CrankLayout; fa: number };
  let chosen: Choice | null = null;
  const gs = stepped ? Array.from({ length: 24 }, (_, q) => (q / 24) * TAU) : [NaN];
  for (const g of gs) {
    const G = stepped ? add2(P, dir2(g), centre) : null;
    // the sector, its pivot's post up to the base, and the pinion keep clear of everything under the base
    if (G && (!clearDisc(own, G, rpS + 1, zl[0] - 4, zl[1]) || !clearDisc(below, G, 5, zl[1], bb))) continue;
    const Q = G ?? P;
    const na = stepped ? 12 : 24;
    for (let qa = 0; qa < na; qa++) {
      const a = (qa / na) * TAU;
      const T0 = add2(Q, dir2(a), rho);
      // the pin's positions over the cycle, and at the ends of the range
      const at = (v: number, i?: number): Vec2 => {
        if (G) {
          const t = sectorAt(v);
          return add2(G, rot([T0[0] - G[0], T0[1] - G[1]], t));
        }
        const X = i === undefined ? (ctx.K.poseAt({ [drv.id]: v }).bodies.get(input) ?? xf.id()) : ctx.xfOf(input, i);
        return xy(xf.apply(X, at3(T0)));
      };
      const tips = ctx.sampled.us.map((u, i) => at(law(u), i));
      const Tlo = at(lo);
      const Thi = at(hi);
      // the lever's sweep (its hub and its arm), or the sector's disc and the pinion, keeps clear of everything under
      // the base but its own shaft
      const arm = G
        ? (p: Vec2): number => Math.min(d2(p, G) - (rpS + 1), d2(p, P) - (rpP + 1))
        : (p: Vec2): number => Math.min(d2(p, P) - hubR, ...tips.filter((_, i) => i % 4 === 0).flatMap((t) => [0.25, 0.5, 0.75, 1].map((k) => d2(p, add2(P, [t[0] - P[0], t[1] - P[1]], k)) - (hubR + (6 - hubR) * k))));
      if (!G && !tips.filter((_, i) => i % 3 === 0).every((t) => clearDisc(own, t, 6, zl[0], zl[1]))) continue;
      // the home flag and its fork on the input, opposite the lever's arm (or the sector)
      const fa = G ? g + Math.PI : a + Math.PI;
      const FF = frameAt(P, fa);
      const mouth = hubR + 1.5;
      const fring = forkRing(FF, mouth);
      const vz = G ? zl[0] - 0.5 - SENSOR.vane : (zl[0] + zl[1]) / 2 - SENSOR.vane / 2;
      const fmid = vz + SENSOR.vane / 2;
      if (!clearRing(own, fring, fmid - SENSOR.h / 2, fmid + SENSOR.h / 2) || !clearDisc(own, add2(P, dir2(fa), mouth + SENSOR.l - 6), 5, fmid + SENSOR.h / 2, bb)) continue;
      if (G && ringDist(fring, circle(rpS + 1, G[0], G[1], 48), MIN_GAP) < MIN_GAP) continue;
      const c = crankLayouts(tips, Tlo, Thi, [(Tlo[0] + Thi[0]) / 2, (Tlo[1] + Thi[1]) / 2], [2 * rho, 8 * rho], rcMin, ({ M, r, L }) => {
        // the motor and its flange, the crank, and the crank pin's circlip that passes over the lever
        if (!clearDisc(below, M, MOT.R, bb - 3 - MOT.H, bb)) return false;
        if (![[-22, -22], [22, -22], [22, 22], [-22, 22]].every(([dx, dy]) => clearDisc(below, [M[0] + dx!, M[1] + dy!], 7, bb - 3, bb))) return false;
        if (!clearDisc(below, M, r + 6, zc[0] - 1, zc[1])) return false;
        if (d2(M, P) - r - 6 < hubR + MIN_GAP) return false;
        if (G && (d2(M, G) < MOT.R + 5 + MIN_GAP || d2(M, G) - r - 6 < 5 + MIN_GAP)) return false;
        for (let k = 0; k < 24; k++) if (arm(add2(M, dir2((k / 24) * TAU), r)) < 4.5 + MIN_GAP) return false;
        // the link over the cycle, against everything under the base, the input's own shaft, the fork and the sector's post
        const m = { motor: at3(M), axis: UP, r, L };
        for (let i = 0; i < n; i += 2) {
          const C = xy(crankPin(m, at3(tips[i]!), driveSide({ side: 1, speed, phase }, ctx.sampled.us[i]!)));
          const T = tips[i]!;
          const len = d2(C, T);
          for (let s = 0; s <= len; s += 4) {
            const p = add2(C, [(T[0] - C[0]) / len, (T[1] - C[1]) / len], s);
            if (!clearDisc(below, p, 6, zk[0], zk[1] + 1)) return false;
            if (pointDist(fring, p[0], p[1]) < 6 + MIN_GAP) return false;
            if (G && d2(p, G) < 5 + 6 + MIN_GAP) return false;
          }
        }
        return true;
      });
      if (!c) continue;
      const score = c.score + 2 * outside(c.M);
      if (!chosen || score < chosen.c.score + 2 * outside(chosen.c.M)) chosen = { a, T0, G, c, fa };
    }
  }
  if (!chosen) {
    ctx.issues.push(`drive: no place under the base for the motor, crank and link of the oscillating input ${site.id}`);
    return;
  }
  const { a, T0, G, c, fa } = chosen;
  const { M, r, L } = c;
  const tip3 = at3(T0, (zk[0] + zk[1]) / 2);
  const motor = at3(M, (zc[0] + zc[1]) / 2);
  const step = G ? { pivot: at3(G), ratio, lo, hi, def, sign } : undefined;
  const pin0 = crankPin({ motor, axis: UP, r, L }, tip3, 1);
  const C0 = xy(pin0);
  const crank: DriveMotion = { part: "crank", input, motor, axis: UP, tip: tip3, pin: pin0, r, L, side: 1, speed, phase, ...(step ? { step } : {}) };
  const link: DriveMotion = { ...crank, part: "link" };
  const sector: DriveMotion = { ...crank, part: "sector" };

  // on the shaft's end, keyed and set-screwed, a circlip under it: the lever, whose pin carries the link, or the pinion
  // (F2, F3)
  const onIn = { body: input, joints: [...J, site.id] };
  const mid = (zl[0] + zl[1]) / 2;
  const hubId = G ? "drive-pinion" : "drive-lever";
  const hubAt = G ? ang2(P, G) : a;
  if (G) {
    // a tooth of the pinion faces the sector (tooth k is centred on k 2π/z)
    const pinion = gearOutline(zp, 1).map((q) => add2(P, rot(q, hubAt)));
    ctx.add(place(UPF, H.solid(hubId, { ...onIn, name: `Drive pinion ${zp}T, module 1, on the input shaft`, kind: "part", role: "hw", mat: "Steel C45, hardened", outer: pinion, holes: [hole(d / 2 + 0.05, P)], z0: zl[0], z1: zl[1] })));
  } else ctx.add(place(UPF, H.solid(hubId, { ...onIn, name: `Drive lever, ${rho} mm, keyed on the input shaft`, kind: "part", role: "hw", mat: "Steel C45", outer: H.hullOf([[P[0], P[1], hubR], [T0[0], T0[1], 6]]), holes: [hole(d / 2 + 0.05, P), hole(PIN / 2, T0, 20)], z0: zl[0], z1: zl[1] })));
  const kf = keyFor(d);
  if (kf) ctx.add(place(frameAt(P, hubAt + Math.PI / 2), H.key(`${hubId}-key`, kf.b, zl[1] - zl[0] + 4, { ...onIn, at: [d / 2 - kf.t1 + kf.h / 2 - 0.4, 0, 0], z0: zl[0] + 0.5, z1: zl[0] + 0.5 + kf.h })));
  const ssM = !G && hubR - 3 > d / 2 + 2 ? 4 : 3;
  // on the pinion, inside its root circle, clear of the sector's teeth
  const ss = add2(P, dir2(hubAt - Math.PI / 2), G ? d / 2 + ssM / 2 + 0.25 : Math.max(d / 2 + ssM / 2 + 0.5, hubR - 3));
  ctx.add(place(UPF, H.setScrew(`${hubId}-ss`, ssM, { ...onIn, at: at3(ss), outer: circle(ssM / 2, 0, 0, 12), z0: mid - 1.5, z1: mid + 1.5, name: kf ? `Set screw M${ssM} (DIN 916) over the key, threadlocked` : `Set screw M${ssM} (DIN 916) on the shaft's flat, threadlocked` })));
  const cs = circlipExt(d).s;
  ctx.add(place(UPF, H.circlip(`${hubId}-cl`, d, { ...onIn, at: at3(P), z0: zl[0] - cs - 0.1 })));
  const onTip = G ? { joints: J } : onIn;
  const tipDrive = G ? { drive: sector } : {};
  ctx.add(place(UPF, H.dowel("drive-tip-pin", PIN, { ...onTip, at: at3(T0), z0: zl[0], z1: zk[1] + 1.5, name: `Drive pin Ø${PIN} h6, pressed into the ${G ? "sector" : "lever"}, carries the link` }), tipDrive));
  ctx.add(place(UPF, H.circlip("drive-tip-pin-cl", PIN, { ...onTip, at: at3(T0), z0: zk[1] + 0.1 }), tipDrive));
  if (G) {
    // the sector: teeth over its swing and four more each side, a space facing the pinion's tooth; on a bushing on a
    // shoulder screw up into a post screwed to the base (A11)
    const toP = ang2(G, P);
    const span = turn / 2 + (4 * TAU) / zs;
    const outer = gearOutline(zs, 1, 1, 1.25, (k) => Math.abs(wrapPi((k * TAU) / zs - Math.PI / zs)) <= span).map((q) => add2(G, rot(q, toP - Math.PI / zs)));
    ctx.add(place(UPF, H.solid("drive-sector", { name: `Drive sector, ${zs}T module 1 (${ratio}:1 step-up), on its own pivot`, kind: "part", role: "hw", mat: "Steel C45", outer, holes: [hole(4, G), hole(PIN / 2, T0, 20)], z0: zl[0], z1: zl[1], joints: J }), { drive: sector }));
    ctx.add(place(UPF, H.bushing("drive-sector-b", 6, 8, { at: at3(G), z0: zl[0], z1: zl[1], joints: J }), { drive: sector }));
    ctx.add(place(UPF, H.standoff("drive-sector-post", { at: at3(G), z0: zl[1] + 0.5, z1: bb, name: "Standoff Ø10 under the base, carries the sector's pivot", joints: J })));
    ctx.add(place(UPF, H.screw("drive-sector-sc", "socket", 5, bb - zl[0] - 4, { at: at3(G), face: zl[0] - 0.3, dir: 1, name: "Shoulder screw Ø6, M5, the sector's pivot, into the post", joints: J })));
  }
  // the home flag on the hub, opposite its arm (V6); under the pinion, where the sector shares its plane
  const mouth = hubR + 1.5;
  const vz = G ? zl[0] - 0.5 - SENSOR.vane : mid - SENSOR.vane / 2;
  ctx.add(place(UPF, H.flag("drive-flag", hubR - 1, mouth + SENSOR.depth - 1.5, fa, { ...onIn, at: at3(P), z0: vz, z1: vz + SENSOR.vane })));

  // the motor, its crank and the crank pin; the link with a bushing at each end
  motorInFlange(ctx, M, crank, zc[0]);
  ctx.add(place(UPF, H.solid("drive-crank", { name: `Drive crank, ${fmt(r)} mm throw, clamped on the motor shaft's flat`, kind: "part", role: "hw", mat: "Steel C45", outer: H.hullOf([[M[0], M[1], 6], [C0[0], C0[1], 5]]), holes: [hole(MOT.shaft / 2 + 0.05, M, 16), hole(PIN / 2, C0, 20)], z0: zc[0], z1: zc[1], joints: J }), { drive: crank }));
  ctx.add(place(UPF, H.dowel("drive-crank-pin", PIN, { at: at3(C0), z0: zk[0] - 1.5, z1: zc[1], name: `Crank pin Ø${PIN} h6, pressed into the crank`, joints: J }), { drive: crank }));
  ctx.add(place(UPF, H.circlip("drive-crank-pin-cl", PIN, { at: at3(C0), z0: zk[0] - 0.8, joints: J }), { drive: crank }));
  ctx.add(place(UPF, H.solid("drive-link", { name: `Drive link, ${fmt(L)} mm`, kind: "part", role: "hw", mat: "Steel C45", outer: H.hullOf([[C0[0], C0[1], 6], [T0[0], T0[1], 6]]), holes: [hole(4, C0), hole(4, T0)], z0: zk[0], z1: zk[1], joints: J }), { drive: link }));
  for (const [k, p] of [[0, C0], [1, T0]] as const) ctx.add(place(UPF, H.bushing(`drive-link-b${k}`, PIN, 8, { at: at3(p), z0: zk[0], z1: zk[1], joints: J, ...(k ? { name: "", qty: 0 } : { qty: 2 }) }), { drive: link }));

  // the fork on a post opposite the lever's arm; terminals beyond the motor, the leads round the housing
  const FF = frameAt(P, fa);
  const sOut = forkSensor(ctx, FF, mouth, vz);
  const away = ang2(P, M);
  const tb = add2(M, dir2(away), MOT.R + 14);
  // the sensor's lead goes round the input's shaft and housing on an arc, the short way to the block
  const tbA = ang2(P, tb);
  const sweep = wrapPi(tbA - fa);
  const steps = Math.max(2, Math.ceil(Math.abs(sweep) / (Math.PI / 6)));
  const arc = Array.from({ length: steps + 1 }, (_, k) => add2(P, dir2(fa + (sweep * k) / steps), 34));
  cabling(ctx, tb, away, [[add2(M, dir2(away), MOT.R - 4), add2(M, dir2(away), MOT.R + 4)], [sOut, ...arc]]);
  const via = G ? `swings a ${zs}T gear sector on its own pivot, which turns a ${zp}T pinion keyed on the input shaft's low end ${ratio} times as far, so the input swings` : `swings a ${rho} mm lever keyed on the input shaft's low end`;
  ctx.note({
    id: "drive",
    kit: "drive",
    at: at3(P),
    title: "Drive",
    note: `Oscillating input: brushless pancake motor in a flange screwed up into the base; it turns a ${fmt(r)} mm crank, and a ${fmt(L)} mm link ${via} through exactly the modelled ${deg(swing)}° (the crank and the link at a dead centre at each end of the swing); bushings in the link, circlips on both pins; a home flag on the ${G ? "pinion" : "lever"}'s hub read by a fork sensor on a post; terminals and leads under the base.`,
    serves: { F10: ["drive-flag", "drive-sensor"], F2: [`${hubId}-cl`, "drive-tip-pin-cl", "drive-crank-pin-cl"], F3: [kf ? `${hubId}-key` : `${hubId}-ss`] },
    badge: ["motor driven", "ok"],
  });
}

// ------------------------------------------------------------------------------------------------ oscillating, in plan

/** A convex hull of plane points (monotone chain), counter-clockwise. */
function hull2(pts: Vec2[]): Vec2[] {
  const p = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  if (p.length < 3) return p;
  const cr = (o: Vec2, a: Vec2, b: Vec2) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo: Vec2[] = [];
  for (const q of p) {
    while (lo.length >= 2 && cr(lo[lo.length - 2]!, lo[lo.length - 1]!, q) <= 0) lo.pop();
    lo.push(q);
  }
  const up: Vec2[] = [];
  for (const q of p.reverse()) {
    while (up.length >= 2 && cr(up[up.length - 2]!, up[up.length - 1]!, q) <= 0) up.pop();
    up.push(q);
  }
  return [...lo.slice(0, -1), ...up.slice(0, -1)];
}

/** Every solid seen along a frame's z within [w0, w1] of its origin, as a hull in the frame's plane (the base excepted). */
function obstaclesIn(ctx: BuildCtx, F: Frame, w0: number, w1: number): Obstacle[] {
  const out: Obstacle[] = [];
  for (const s of ctx.solids) {
    if (s.flags.isBase || s.joints.includes("drive")) continue;
    const pc = worldPoints(ctx.M, s).map((p) => planeCoords(F, p));
    const z0 = Math.min(...pc.map((q) => q.w));
    const z1 = Math.max(...pc.map((q) => q.w));
    if (z1 <= w0 || z0 >= w1) continue;
    out.push({ id: s.id, polys: [hull2(pc.map((q) => q.uv))], z0, z1 });
  }
  return out;
}

/**
 * Builds a drive on a shaft in plan's free end (V1, V5): its low end, or the far one where the low end faces the eye in
 * the default view (a front elevation looking at the low end) and the drive built there keeps clear of the moving parts'
 * sweeps (not where a link is overhung on the shaft's end, or where a part comes down over it). Else the low end, the
 * far end's stub back to its length with no drive there (stack.ts). `build(far)` builds the drive on that end through
 * ctx.add and ctx.note; a shaft whose kit names its end (`end` on its stack) is built as it says.
 */
export function onFreeEnd(ctx: BuildCtx, siteId: string, build: (far: boolean) => void): void {
  const st = ctx.stacks.get(siteId);
  const axle = ctx.get(`${siteId}-axle`);
  if (st && !st.end && axle && v3.dot(v3.unit(axle.frame.z as Vec3), ctx.viewDir()) > 0.5) {
    // a trial on the far end, kept aside so its own parts ride no sweep while they are tested against the others
    const trial: Solid3[] = [];
    const notes: JointNote[] = [];
    const issues = ctx.issues.length;
    const { add, note } = ctx;
    ctx.add = (...s) => {
      const out = s.flat();
      trial.push(...out);
      return out;
    };
    ctx.note = (n) => void notes.push(n);
    try {
      build(true);
    } finally {
      ctx.add = add;
      ctx.note = note;
    }
    // what turns with the shaft or rides the drive's own motion is left out: the stationary parts are tested
    const fixed = trial.filter((s) => s.body !== axle.body && !s.drive);
    if (ctx.issues.length === issues && trial.length && clearance(ctx, fixed, () => true) > 0) {
      ctx.add(trial);
      notes.forEach((n) => ctx.note(n));
      return;
    }
    ctx.issues.splice(issues);
    if (st.farStub && axle.op.op === "extrude") {
      axle.op = { ...axle.op, h: axle.op.h - st.farStub };
      ctx.sweeps.touch([axle.body]);
    }
  }
  build(false);
}

/**
 * An oscillating input on a shaft in plan (J10): the lever keyed on the shaft's free end (the end the rotary drive in
 * plan takes), the link and the crank beyond it, the motor on the upright of a one-piece angle bracket whose foot is
 * screwed to the base, its axis along the shaft; the fork sensor under the lever's hub on a post from the base; terminals
 * and leads on the base top. Laid out in the plane of the lever: u across the shaft, v up, w out along it from its end.
 */
function oscillatingInPlan(ctx: BuildCtx, drv: KinDriver, siteId: string, far: boolean): void {
  const site = ctx.sites.find((s) => s.id === siteId)!;
  const st = ctx.stacks.get(site.id)!;
  const axle = ctx.get(`${site.id}-axle`);
  const base = ctx.base!;
  if (!axle || Math.abs(v3.unit(axle.frame.z as Vec3)[2]) > 1e-6) {
    ctx.issues.push(`drive: the oscillating input ${site.id} has no level shaft in plan to take a lever`);
    return;
  }
  const input = axle.body;
  // the shaft's free end, as onFreeEnd chooses it for the rotary drive in plan as well
  const zA = v3.unit(axle.frame.z as Vec3);
  const hA = axle.op.op === "extrude" ? axle.op.h : 0;
  const out: Vec3 = far ? zA : v3.mul(zA, -1);
  const E: Vec3 = far ? v3.add(axle.frame.o as Vec3, v3.mul(zA, hA)) : (axle.frame.o as Vec3);
  const up: Vec3 = [0, 0, 1];
  const lat = v3.unit(v3.cross(up, out));
  const PF: Frame = { o: E, x: lat, z: out };
  const W = (uv: Vec2, w: number): Vec3 => fromPlane(PF, uv, w);
  // heights along the shaft: the lever on its end, the link, the crank, then the bracket's upright and the motor
  const zl: [number, number] = [-9, -4];
  const zk: [number, number] = [-3.5, 1];
  const zc: [number, number] = [1.5, 6];
  const w0 = 11;
  const w1 = w0 + 4;
  const foot = 4;
  const vBase = base.top - E[2];
  const P: Vec2 = [0, 0];
  const d = st.d;
  const hubR = d / 2 + 5;
  const [lo, hi] = rangeOf(drv);
  const speed = drv.speed ?? 1;
  const phase = (drv.phase ?? 0) * D2R;
  const swing = Math.abs(hi - lo) * D2R;
  const small = 22 * Math.sin(swing / 2) < 5;
  const rho = small ? Math.ceil(2 / Math.sin(swing / 2)) : 22;
  const rcMin = small ? 2 : 5;
  const obs = obstaclesIn(ctx, PF, -14, w1 + MOT.H + 2);
  const own = obs.filter((o) => ctx.get(o.id)?.body !== input);
  const n = ctx.sampled.us.length;
  const vk = (zk[0] + zk[1]) / 2;
  const mouth = hubR + 1.5;
  // the fork hangs under the lever's hub on a post from the base; where the shaft stands too low over the base for that
  // (a post shorter than POST_MIN), it sits beside the hub on the side clear of the rest, its post under it
  const down = -Math.PI / 2;
  const forkAt = (a: number): Frame => ({ o: E, x: a === down ? v3.mul(up, -1) : v3.add(v3.mul(lat, Math.cos(a)), v3.mul(up, Math.sin(a))), z: out });
  const forkGap = (a: number): number => {
    const zm = (zl[0] + zl[1]) / 2;
    const box: Vec2[] = [[mouth, -SENSOR.w / 2], [mouth + SENSOR.l, -SENSOR.w / 2], [mouth + SENSOR.l, SENSOR.w / 2], [mouth, SENSOR.w / 2]];
    return clearance(ctx, place(forkAt(a), H.solid("drive-fork-t", { name: "", kind: "sensor", role: "hw", outer: box, z0: zm - SENSOR.h / 2, z1: zm + SENSOR.h / 2, joints: J })));
  };
  const fa = E[2] - (mouth + SENSOR.l) - base.top >= POST_MIN ? down : forkGap(0) >= forkGap(Math.PI) ? 0 : Math.PI;
  const FF = (): Frame => forkAt(fa);
  const fring = forkRing({ o: [0, 0, 0], x: [Math.cos(fa), Math.sin(fa), 0], z: [0, 0, 1] }, mouth);
  let chosen: { a: number; T0: Vec2; c: CrankLayout } | null = null;
  for (let q = 0; q < 24; q++) {
    const a = (q / 24) * TAU;
    // the lever keeps off the fork under its hub; off the fork beside it by the fork's own width too, since the lever's
    // web passes level with the fork's slot there
    if (Math.abs(wrapPi(a - fa)) < swing / 2 + (50 * Math.PI) / 180 + (fa === down ? 0 : Math.atan2(SENSOR.w / 2, mouth))) continue;
    const T0 = add2(P, dir2(a), rho);
    const tip = (X: ReturnType<typeof xf.id>): Vec2 => planeCoords(PF, xf.apply(X, W(T0, vk))).uv;
    const tips = ctx.sampled.us.map((_, i) => tip(ctx.xfOf(input, i)));
    const Tlo = tip(ctx.K.poseAt({ [drv.id]: lo }).bodies.get(input) ?? xf.id());
    const Thi = tip(ctx.K.poseAt({ [drv.id]: hi }).bodies.get(input) ?? xf.id());
    if (!tips.filter((_, i) => i % 3 === 0).every((t) => clearDisc(own, t, 6, zl[0], zl[1]) && t[1] - 6 >= vBase + MIN_GAP)) continue;
    const arm = (p: Vec2): number => Math.min(d2(p, P) - hubR, ...tips.filter((_, i) => i % 4 === 0).flatMap((t) => [0.25, 0.5, 0.75, 1].map((k) => d2(p, add2(P, [t[0] - P[0], t[1] - P[1]], k)) - (hubR + (6 - hubR) * k))));
    const c = crankLayouts(tips, Tlo, Thi, [(Tlo[0] + Thi[0]) / 2, (Tlo[1] + Thi[1]) / 2], [2 * rho, 8 * rho], rcMin, ({ M, r, L }) => {
      // the motor on its bracket above the base, its crank, and the crank pin's circlip that passes over the lever
      if (M[1] - MOT.R < vBase + foot + MIN_GAP) return false;
      if (!clearDisc(obs, M, MOT.R + 4, w0, w1 + MOT.H)) return false;
      if (!clearDisc(obs, M, r + 6, zc[0] - 1, zc[1]) || M[1] - r - 6 < vBase + MIN_GAP) return false;
      if (d2(M, P) - r - 6 < hubR + MIN_GAP) return false;
      for (let k = 0; k < 24; k++) if (arm(add2(M, dir2((k / 24) * TAU), r)) < 4.5 + MIN_GAP) return false;
      const m = { motor: at3(M), axis: UP, r, L };
      for (let i = 0; i < n; i += 2) {
        const C = xy(crankPin(m, at3(tips[i]!), driveSide({ side: 1, speed, phase }, ctx.sampled.us[i]!)));
        const T = tips[i]!;
        const len = d2(C, T);
        for (let s = 0; s <= len; s += 4) {
          const p = add2(C, [(T[0] - C[0]) / len, (T[1] - C[1]) / len], s);
          if (!clearDisc(obs, p, 6, zk[0], zk[1] + 1) || p[1] - 6 < vBase + MIN_GAP) return false;
          if (pointDist(fring, p[0], p[1]) < 6 + MIN_GAP) return false;
          // and the lever's circlip on the shaft's end
          if (d2(p, P) < d / 2 + 3 + 6 + MIN_GAP) return false;
        }
      }
      return true;
    });
    if (!c) continue;
    if (!chosen || c.score < chosen.c.score) chosen = { a, T0, c };
  }
  if (!chosen) {
    ctx.issues.push(`drive: no place for the motor, crank and link of the oscillating input ${site.id} on its shaft in plan`);
    return;
  }
  const { a, T0, c } = chosen;
  const { M, r, L } = c;
  const tip3 = W(T0, vk);
  const motor = W(M, (zc[0] + zc[1]) / 2);
  const pin0 = crankPin({ motor, axis: out, r, L }, tip3, 1);
  const C0 = planeCoords(PF, pin0).uv;
  const crank: DriveMotion = { part: "crank", input, motor, axis: out, tip: tip3, pin: pin0, r, L, side: 1, speed, phase };
  const link: DriveMotion = { ...crank, part: "link" };
  const onIn = { body: input, joints: [...J, site.id] };
  const mid = (zl[0] + zl[1]) / 2;
  // the lever on the shaft's end, keyed or set on a flat, a circlip outside it; its pin carries the link (F2, F3)
  ctx.add(place(PF, H.solid("drive-lever", { ...onIn, name: `Drive lever, ${rho} mm, keyed on the input shaft's end`, kind: "part", role: "hw", mat: "Steel C45", outer: H.hullOf([[0, 0, hubR], [T0[0], T0[1], 6]]), holes: [hole(d / 2 + 0.05, P), hole(PIN / 2, T0, 20)], z0: zl[0], z1: zl[1] })));
  const kf = keyFor(d);
  if (kf) ctx.add(place(PF, H.key("drive-lever-key", kf.b, zl[1] - zl[0] + 4, { ...onIn, at: [(d / 2 - kf.t1 + kf.h / 2 - 0.4) * Math.cos(a + Math.PI / 2), (d / 2 - kf.t1 + kf.h / 2 - 0.4) * Math.sin(a + Math.PI / 2), a + Math.PI / 2], z0: zl[0] + 0.5, z1: zl[0] + 0.5 + kf.h })));
  const ssM = hubR - 3 > d / 2 + 2 ? 4 : 3;
  const ss = dir2(a - Math.PI / 2).map((k) => k * Math.max(d / 2 + ssM / 2 + 0.5, hubR - 3)) as Vec2;
  ctx.add(place(PF, H.setScrew("drive-lever-ss", ssM, { ...onIn, at: at3(ss), outer: circle(ssM / 2, 0, 0, 12), z0: mid - 1.5, z1: mid + 1.5, name: kf ? `Set screw M${ssM} (DIN 916) over the key, threadlocked` : `Set screw M${ssM} (DIN 916) on the shaft's flat, threadlocked` })));
  ctx.add(place(PF, H.circlip("drive-lever-cl", d, { ...onIn, z0: zl[1] + 0.1 })));
  ctx.add(place(PF, H.dowel("drive-tip-pin", PIN, { ...onIn, at: at3(T0), z0: zl[0], z1: zk[1] + 1.5, name: `Drive pin Ø${PIN} h6, pressed into the lever, carries the link` })));
  ctx.add(place(PF, H.circlip("drive-tip-pin-cl", PIN, { ...onIn, at: at3(T0), z0: zk[1] + 0.1 })));
  ctx.add(place(PF, H.flag("drive-flag", hubR - 1, mouth + SENSOR.depth - 1.5, fa, { ...onIn, z0: mid - SENSOR.vane / 2, z1: mid + SENSOR.vane / 2 })));
  // the crank on the motor shaft and its pin; the link with a bushing at each end
  ctx.add(place(PF, H.solid("drive-crank", { name: `Drive crank, ${fmt(r)} mm throw, clamped on the motor shaft's flat`, kind: "part", role: "hw", mat: "Steel C45", outer: H.hullOf([[M[0], M[1], 6], [C0[0], C0[1], 5]]), holes: [hole(MOT.shaft / 2 + 0.05, M, 16), hole(PIN / 2, C0, 20)], z0: zc[0], z1: zc[1], joints: J }), { drive: crank }));
  ctx.add(place(PF, H.dowel("drive-crank-pin", PIN, { at: at3(C0), z0: zk[0] - 1.5, z1: zc[1], name: `Crank pin Ø${PIN} h6, pressed into the crank`, joints: J }), { drive: crank }));
  ctx.add(place(PF, H.circlip("drive-crank-pin-cl", PIN, { at: at3(C0), z0: zk[0] - 0.8, joints: J }), { drive: crank }));
  ctx.add(place(PF, H.solid("drive-link", { name: `Drive link, ${fmt(L)} mm`, kind: "part", role: "hw", mat: "Steel C45", outer: H.hullOf([[C0[0], C0[1], 6], [T0[0], T0[1], 6]]), holes: [hole(4, C0), hole(4, T0)], z0: zk[0], z1: zk[1], joints: J }), { drive: link }));
  for (const [k, p] of [[0, C0], [1, T0]] as const) ctx.add(place(PF, H.bushing(`drive-link-b${k}`, PIN, 8, { at: at3(p), z0: zk[0], z1: zk[1], joints: J, ...(k ? { name: "", qty: 0 } : { qty: 2 }) }), { drive: link }));
  ctx.add(place(PF, H.shaft("drive-shaft", { d: MOT.shaft, z0: zc[0], z1: w1 + 2.5, flat: true }, { name: `Motor shaft Ø${MOT.shaft}, D-flat`, at: at3(M), joints: J }), { drive: crank }));
  // the motor's face on the upright of one angle bracket, its foot screwed to the base (V2)
  const lo2 = M[0] - 29;
  const hi2 = M[0] + 29;
  const B = { kind: "bracket" as const, role: "ground" as const, mat: "Aluminium 6061-T6, anodised", joints: J, group: "drive-bracket" };
  ctx.add(place(PF, H.plate("drive-bracket", roundRect(lo2, vBase + foot, hi2, M[1] + 29, 3), { ...B, name: "Motor bracket, one piece: an upright on a foot", z0: w0, z1: w1, holes: [hole(MOT.R - 8, M, 36)] })));
  const BF: Frame = { o: [E[0], E[1], base.top], x: out, z: up };
  ctx.add(place(BF, H.plate("drive-bracket-foot", roundRect(w0, lo2, w1 + MOT.H + 6, hi2, 3), { ...B, name: "", z0: 0, z1: foot })));
  for (const [k, u] of [[0, M[0] - 20], [1, M[0] + 20]] as const)
    ctx.add(place(BF, H.screw(`drive-ft${k}`, "socket", 4, foot + 8, { at: [w1 + MOT.H + 1, u, 0], face: foot, dir: -1, ...(k ? { name: "", qty: 0 } : { qty: 2 }), joints: J })));
  ctx.add(place(PF, H.solid("drive-motor", { name: MOT.name, kind: "motor", role: "hw", mat: "Aluminium housing, neodymium rotor", outer: circle(MOT.R, M[0], M[1], 48), holes: [hole(MOT.shaft / 2 + 0.2, M, 16)], z0: w1, z1: w1 + MOT.H, joints: J })));
  ctx.add(place(PF, H.solid("drive-motor-core", { name: "", kind: "motorInternal", role: "hw", outer: circle(MOT.R - 4, M[0], M[1], 36), z0: w1 + 3, z1: w1 + MOT.H - 3, faint: true, inset: true, joints: J })));
  [[-15, -15], [15, -15], [15, 15], [-15, 15]].forEach(([du, dv], k) =>
    ctx.add(place(PF, H.screw(`drive-fl${k}`, "socket", 3, 4 + 4.5, { at: [M[0] + du!, M[1] + dv!, 0], face: w0, dir: 1, ...(k ? { name: "", qty: 0 } : { qty: 4 }), joints: J }))),
  );
  // the fork under the lever's hub (or beside it, above), on a post from the base (V6)
  const fork = FF();
  forkSensor(ctx, fork, mouth, mid - SENSOR.vane / 2, false);
  const postAt = fromPlane(fork, [mouth + SENSOR.l - 6, 0], mid);
  const forkLow = fa === down ? E[2] - (mouth + SENSOR.l) : E[2] - SENSOR.w / 2;
  ctx.add(place(UPF, H.standoff("drive-sensor-post", { at: [postAt[0], postAt[1], 0], z0: base.top, z1: forkLow, name: "Standoff Ø10 on the base, carries the sensor", joints: J })));
  // terminals and the leads on the base top, past the motor
  const tb: [number, number, number] = [w1 + MOT.H + 14, M[0], 0];
  ctx.add(place(BF, H.terminalBlock("drive-terminals", 4, { at: tb, z0: 0, z1: 6, joints: J })));
  const postBF: Vec2 = [v3.dot(v3.sub([postAt[0], postAt[1], base.top], BF.o), out), v3.dot(v3.sub([postAt[0], postAt[1], base.top], BF.o), lat)];
  ctx.add(place(BF, H.lead("drive-lead", [[w1 + MOT.H, M[0]], [w1 + MOT.H + 6, M[0] - 5], [tb[0], tb[1] - 5]], { z0: 0, z1: 1, joints: J })));
  ctx.add(place(BF, H.lead("drive-lead-sensor", [[postBF[0], postBF[1] + 6], [w1 + MOT.H + 6, postBF[1] + 6], [tb[0], tb[1] + 5]], { z0: 0, z1: 1, joints: J, name: "" })));
  ctx.note({
    id: "drive",
    kit: "drive",
    at: E,
    title: "Drive",
    note: `Oscillating input on a shaft in plan: brushless pancake motor on the upright of a one-piece angle bracket, its axis along the shaft; it turns a ${fmt(r)} mm crank, and a ${fmt(L)} mm link swings a ${rho} mm lever on the shaft's free end through exactly the modelled ${deg(swing)}° (the crank and the link at a dead centre at each end of the swing); a home flag on the lever's hub read by a fork sensor on a post; terminals and leads on the base.`,
    serves: { F10: ["drive-flag", "drive-sensor"], F2: ["drive-lever-cl", "drive-tip-pin-cl", "drive-crank-pin-cl"], F3: [kf ? "drive-lever-key" : "drive-lever-ss"] },
    badge: ["motor driven", "ok"],
  });
}

// ------------------------------------------------------------------------------------------------ oscillating, compliant

/**
 * A compliant joint's lever (J13) has no shaft (V5): a pin pressed into its tip runs down through an arc slot in the base
 * to the link; the motor in a one-piece bracket on the line of the tip's chord turns a crank of half the chord inside the
 * bracket, so the link swings the lever through exactly its range. The home flag is on the pin, under the base.
 */
function oscillatingCompliant(ctx: BuildCtx, drv: KinDriver, jointId: string): void {
  const jt = ctx.joints.find((q) => q.id === jointId)!;
  const lever = jt.a === "ground" ? jt.b : jt.a;
  const part = ctx.parts.get(lever);
  const base = ctx.base!;
  if (!part || !parallel(jt.axis, UP)) {
    ctx.issues.push(`drive: the compliant input ${jointId} has no lever along the base normal to take a pin`);
    return;
  }
  const bb = base.bottom;
  const R = MOT.R;
  // heights in the bracket, from the base down: the fork round the pin's vane, the link, the crank on the shaft's top
  // (over the heads of the motor's face screws), the floor
  const zk: [number, number] = [bb - 16, bb - 11.5];
  const zc: [number, number] = [bb - 21, bb - 16.5];
  const floorTop = zc[0] - 2.5;
  const P = xy(jt.at);
  const pts = worldPoints(ctx.M, part);
  const levTop = Math.max(...pts.map((p) => p[2]));
  const far = pts.reduce((q, p) => (d2(xy(p), P) > d2(xy(q), P) ? p : q), pts[0]!);
  const reach = d2(xy(far), P);
  const a0 = ang2(P, xy(far));
  const [lo, hi] = rangeOf(drv);
  const Xlo = ctx.K.poseAt({ [drv.id]: lo }).bodies.get(lever) ?? xf.id();
  const Xhi = ctx.K.poseAt({ [drv.id]: hi }).bodies.get(lever) ?? xf.id();
  const swing = Math.abs(xf.angleAbout(xf.mul(Xhi, xf.inv(Xlo)), UP));
  // the pin at the tip, or nearer the neck where the tip's chord would ask for a crank too big for the bracket
  const rcMax = R - 3 - 6 - MIN_GAP;
  const rho = Math.max(10, Math.min(reach - 7, (2 * rcMax) / (2 * Math.sin(Math.max(swing, 1e-3) / 2))));
  const T0 = add2(P, dir2(a0), rho);
  const tips = ctx.sampled.us.map((_, i) => xy(xf.apply(ctx.xfOf(lever, i), at3(T0))));
  const Tlo = xy(xf.apply(Xlo, at3(T0)));
  const Thi = xy(xf.apply(Xhi, at3(T0)));
  const chord = d2(Tlo, Thi);
  const u: Vec2 = [(Thi[0] - Tlo[0]) / chord, (Thi[1] - Tlo[1]) / chord];
  const Tm: Vec2 = [(Tlo[0] + Thi[0]) / 2, (Tlo[1] + Thi[1]) / 2];
  const obs = obstacles(ctx, bb).filter((o) => o.z0 < bb - 0.5);
  const speed = drv.speed ?? 1;
  const phase = (drv.phase ?? 0) * D2R;
  const vz = bb - 6.5;
  const mouth = rho + PIN / 2 + 1.5;
  const FF = frameAt(P, a0);
  const fring = forkRing(FF, mouth);
  // the motor on the chord's line, beyond either end, its bracket clear of the pin's arc
  let best: { M: Vec2; s: number } | null = null;
  for (const sg of [1, -1])
    for (let D = R + chord / 2 + 6; D <= R + chord / 2 + 60; D += 2) {
      const M = add2(Tm, u, sg * D);
      const dHi = d2(M, Thi);
      const dLo = d2(M, Tlo);
      const r = Math.abs(dHi - dLo) / 2;
      const L = (dHi + dLo) / 2;
      if (r < 2 || L < 2.5 * r || L < 2 * r + 12.5 || r > rcMax) continue;
      if (tips.some((t) => d2(M, t) > L + r + 1e-6 || d2(M, t) < L - r - 1e-6 || d2(M, t) < R + 6 + MIN_GAP)) continue;
      if (!clearDisc(obs, M, R, floorTop - 3 - MOT.H, bb)) continue;
      if (ringDist(circle(R, M[0], M[1], 36), fring, MIN_GAP) < MIN_GAP) continue;
      if (!best || D < best.s) best = { M, s: D };
      break;
    }
  if (!best) {
    ctx.issues.push(`drive: no place under the base for the motor of the compliant input ${jointId}`);
    return;
  }
  const M = best.M;
  const dHi = d2(M, Thi);
  const dLo = d2(M, Tlo);
  const r = Math.abs(dHi - dLo) / 2;
  const L = (dHi + dLo) / 2;
  const tip3 = at3(T0, (zk[0] + zk[1]) / 2);
  const motor = at3(M, (zc[0] + zc[1]) / 2);
  const pin0 = crankPin({ motor, axis: UP, r, L }, tip3, 1);
  const C0 = xy(pin0);
  const crank: DriveMotion = { part: "crank", input: lever, motor, axis: UP, tip: tip3, pin: pin0, r, L, side: 1, speed, phase };
  const link: DriveMotion = { ...crank, part: "link" };
  // the window in the bracket's wall: as wide as the link swings, toward the arc
  const toward = ang2(M, Tm);
  let half = 0;
  ctx.sampled.us.forEach((uu, i) => {
    const C = xy(crankPin(crank, at3(tips[i]!), driveSide(crank, uu)));
    const T = tips[i]!;
    // the link's two edges, a clearance out, wherever they pass through the wall
    const len = d2(C, T);
    const e: Vec2 = [(T[0] - C[0]) / len, (T[1] - C[1]) / len];
    for (const o of [-(6 + MIN_GAP), 6 + MIN_GAP])
      for (let k = -6; k <= len + 6; k += 0.5) {
        const p: Vec2 = [C[0] + e[0] * k - e[1] * o, C[1] + e[1] * k + e[0] * o];
        const rr = d2(p, M);
        if (rr < R - 3.5 || rr > R + 0.5) continue;
        let da = ang2(M, p) - toward;
        while (da > Math.PI) da -= TAU;
        while (da < -Math.PI) da += TAU;
        half = Math.max(half, Math.abs(da));
      }
  });
  motorBracket(ctx, M, toward, { floorTop, shaftTop: zc[1] }, crank, Math.min(Math.PI * 0.8, Math.max((40 * Math.PI) / 180, half)));
  // the pin pressed into the lever's tip, down through the base to the link; a circlip under the link (F2)
  const onLever = { body: lever, joints: [...J, jointId] };
  cutBore(ctx, part.id, at3(T0, levTop), PIN / 2);
  ctx.add(place(UPF, H.dowel("drive-tip-pin", PIN, { ...onLever, at: at3(T0), z0: zk[0] - 1.5, z1: levTop, name: `Drive pin Ø${PIN} h6, pressed into the lever's tip, down through an arc slot in the base to the link` })));
  ctx.add(place(UPF, H.circlip("drive-tip-pin-cl", PIN, { ...onLever, at: at3(T0), z0: zk[0] - 0.8 })));
  ctx.add(place(UPF, H.flag("drive-flag", rho, mouth + SENSOR.depth - 1.5, a0, { ...onLever, at: at3(P), z0: vz, z1: vz + SENSOR.vane })));
  // the arc slot the pin runs in, a millimetre clear all round
  const arc = [...tips].sort((p, q) => {
    const wa = (x: Vec2) => {
      let v = ang2(P, x) - a0;
      while (v > Math.PI) v -= TAU;
      while (v < -Math.PI) v += TAU;
      return v;
    };
    return wa(p) - wa(q);
  });
  const ends = (p: Vec2, q: Vec2): Vec2 => add2(p, [(p[0] - q[0]) / (d2(p, q) || 1), (p[1] - q[1]) / (d2(p, q) || 1)], PIN / 2 + 1);
  const path = [ends(arc[0]!, arc[1]!), ...arc.filter((_, i) => i % 2 === 0), ends(arc[arc.length - 1]!, arc[arc.length - 2]!)];
  ctx.baseHoles.push({ at: Tm, r: 0, joint: "drive", ring: stroke(path, PIN / 2 + 1) as [number, number][] });
  // the crank inside the bracket, its pin up through the link
  ctx.add(place(UPF, H.solid("drive-crank", { name: `Drive crank, ${fmt(r)} mm throw, clamped on the motor shaft's flat`, kind: "part", role: "hw", mat: "Steel C45", outer: H.hullOf([[M[0], M[1], 6], [C0[0], C0[1], 5]]), holes: [hole(MOT.shaft / 2 + 0.05, M, 16), hole(PIN / 2, C0, 20)], z0: zc[0], z1: zc[1], joints: J }), { drive: crank }));
  ctx.add(place(UPF, H.dowel("drive-crank-pin", PIN, { at: at3(C0), z0: zc[0], z1: zk[1] + 1.5, name: `Crank pin Ø${PIN} h6, pressed into the crank`, joints: J }), { drive: crank }));
  ctx.add(place(UPF, H.circlip("drive-crank-pin-cl", PIN, { at: at3(C0), z0: zk[1] + 0.1, joints: J }), { drive: crank }));
  ctx.add(place(UPF, H.solid("drive-link", { name: `Drive link, ${fmt(L)} mm`, kind: "part", role: "hw", mat: "Steel C45", outer: H.hullOf([[C0[0], C0[1], 6], [T0[0], T0[1], 6]]), holes: [hole(4, C0), hole(4, T0)], z0: zk[0], z1: zk[1], joints: J }), { drive: link }));
  for (const [k, p] of [[0, C0], [1, T0]] as const) ctx.add(place(UPF, H.bushing(`drive-link-b${k}`, PIN, 8, { at: at3(p), z0: zk[0], z1: zk[1], joints: J, ...(k ? { name: "", qty: 0 } : { qty: 2 }) }), { drive: link }));
  const sOut = forkSensor(ctx, FF, mouth, vz);
  const away = ang2(Tm, M);
  const tb = add2(M, dir2(away), R + 14);
  cabling(ctx, tb, away, [[add2(M, dir2(away), R - 4), add2(M, dir2(away), R + 4)], [sOut, add2(sOut, dir2(away), 10)]]);
  ctx.note({
    id: "drive",
    kit: "drive",
    at: at3(P),
    title: "Drive",
    note: `Compliant input: brushless pancake motor in a one-piece bracket under the base, on the line of the tip's ${fmt(chord)} mm chord; it turns a ${fmt(r)} mm crank inside the bracket, and a ${fmt(L)} mm link takes the pin pressed into the lever ${fmt(rho)} mm from the neck, down through an arc slot in the base, and swings the lever through exactly the modelled ${deg(swing)}° (dead centres at the ends of the swing); a home flag on the pin read by a fork sensor under the base; terminals and leads.`,
    serves: { F10: ["drive-flag", "drive-sensor"], F2: ["drive-tip-pin-cl", "drive-crank-pin-cl"] },
    badge: ["motor driven", "ok"],
  });
}

/** An oscillating input: on its live shaft, or by a pin in a compliant lever's tip. */
export function oscillatingDrive(ctx: BuildCtx, drv: KinDriver): void {
  if (!ctx.base) return;
  const site = ctx.sites.find((s) => s.fixed && s.live && ctx.stacks.has(s.id) && s.joints.includes(drv.joint ?? ""));
  if (site) return site.inPlan ? onFreeEnd(ctx, site.id, (far) => oscillatingInPlan(ctx, drv, site.id, far)) : oscillatingShaft(ctx, drv, site.id);
  const jt = ctx.joints.find((q) => q.id === drv.joint && q.kit === "J13");
  if (jt) return oscillatingCompliant(ctx, drv, jt.id);
  ctx.issues.push(`drive: the oscillating input ${drv.joint ?? drv.id} is neither a live shaft nor a compliant lever: no drive built`);
}

// ------------------------------------------------------------------------------------------------ linear

/**
 * A linear input on a slide (J5) along the base plane: a belt loop under the base along the stroke, its near span under
 * the slider's centreline; a carriage clamps that span between a jaw and a clamp plate and rises through a slot in the
 * base to the slider's underside; the motor in a one-piece bracket at one end, the idler on a slotted tensioner plate at
 * the other; the home flag on the carriage, a fork sensor at the end of the stroke.
 */
export function linearDrive(ctx: BuildCtx, drv: KinDriver): void {
  if (!ctx.base) return;
  const jt = ctx.joints.find((q) => q.id === drv.joint && q.kit === "J5");
  const base = ctx.base;
  if (!jt || Math.abs(v3.unit(jt.axis)[2]) > 1e-6) {
    ctx.issues.push(`drive: the linear input ${drv.joint ?? drv.id} is not a slide along the base plane: no drive built`);
    return;
  }
  const slider = jt.a === "ground" ? jt.b : jt.a;
  const part = ctx.parts.get(slider);
  if (!part) {
    ctx.issues.push(`drive: the linear input's slider ${slider} has no part`);
    return;
  }
  const bb = base.bottom;
  const bt = base.top;
  const R = MOT.R;
  const pm = PULLEYS[16];
  const rp = pm.pd / 2;
  const a3 = v3.unit(jt.axis);
  const ax: Vec2 = [a3[0], a3[1]];
  const nx: Vec2 = [-ax[1], ax[0]];
  const q0 = xy(jt.at);
  const line = (t: number, k = 0): Vec2 => [q0[0] + t * ax[0] + k * nx[0], q0[1] + t * ax[1] + k * nx[1]];
  // the slider's travel along the axis over the cycle, and its underside
  const ts = ctx.sampled.us.map((_, i) => {
    const X = ctx.xfOf(slider, i);
    return X.t[0] * ax[0] + X.t[1] * ax[1];
  });
  const tLo = Math.min(...ts);
  const tHi = Math.max(...ts);
  const zS = Math.min(...worldPoints(ctx.M, part).map((p) => p[2]));
  // heights: the pulleys and the belt under the base; the carriage's jaws round the belt down to the vane
  const zp: [number, number] = [bb - 11, bb - 5];
  const zj: [number, number] = [bb - 15, bb - 4.6];
  const floorTop = bb - 13;
  const obs = obstacles(ctx, bb).filter((o) => o.z0 < bb - 0.5);
  const onTop = ctx.solids.filter((s) => s.body === "ground" && !s.flags.isBase && !s.joints.includes("drive")).filter((s) => {
    const z = worldPoints(ctx.M, s).map((p) => p[2]);
    return Math.min(...z) < bt + 1 && Math.max(...z) > bt - 0.5;
  });
  const CW = 6; // carriage half length along the axis
  type Plan = { sg: 1 | -1; end: 1 | -1; tA: number; tB: number; slot: Vec2[]; len: number };
  let best: Plan | null = null;
  for (const sg of [1, -1] as const) {
    // the carriage across the axis: the jaw on the far side of the near span from the loop, the clamp plate on the near
    const n0 = sg > 0 ? -4 : -6;
    const n1 = sg > 0 ? 6 : 4;
    // the slot's round ends past the carriage's corners at each end of the stroke
    const slot = roundedPoly([line(tLo - CW + 1, (n0 + n1) / 2), line(tHi + CW - 1, (n0 + n1) / 2)], (n1 - n0) / 2 + 1);
    if (onTop.some((s) => ctx.sweeps.staticPolys(s).some((q) => ringDist(slot, q, 1) < 1))) continue;
    // the carriage's run under the base, clear of what hangs there
    const run = roundedPoly([line(tLo, (n0 + n1) / 2), line(tHi, (n0 + n1) / 2)], CW);
    if (!clearRing(obs, run, zj[0], bb)) continue;
    for (const end of [1, -1] as const) {
      // the motor at one end of the stroke, the idler at the other, each stepped out until it clears
      let tA = end > 0 ? tHi + CW + R + 2 : tLo - CW - R - 2;
      for (let k = 0; k < 30 && !clearDisc(obs, line(tA, -sg * rp), R, floorTop - 3 - MOT.H, bb); k++) tA += end * 3;
      if (!clearDisc(obs, line(tA, -sg * rp), R, floorTop - 3 - MOT.H, bb)) continue;
      let tB = end > 0 ? tLo - CW - pm.fd / 2 - 3 : tHi + CW + pm.fd / 2 + 3;
      const idlerClear = (t: number) => clearDisc(obs, line(t, -sg * rp), pm.fd / 2 + 1, bb - 13, bb) && clearDisc(obs, line(t - end * 14, -sg * rp), 9, bb - 3, bb);
      for (let k = 0; k < 30 && !idlerClear(tB); k++) tB -= end * 3;
      if (!idlerClear(tB)) continue;
      const len = Math.abs(tA - tB);
      if (!best || len < best.len) best = { sg, end, tA, tB, slot, len };
    }
  }
  if (!best) {
    ctx.issues.push(`drive: no place under the base for the belt loop of the linear input ${jt.id}`);
    return;
  }
  const { sg, end, tA, tB, slot } = best;
  const Mm = line(tA, -sg * rp);
  const I = line(tB, -sg * rp);
  const along = Math.atan2(ax[1], ax[0]);
  // the bracket's window faces the idler
  motorBracket(ctx, Mm, ang2(Mm, I), { floorTop, shaftTop: zp[1] + 0.5 });
  const pulley = (id: string, c: Vec2, bore: number, name: string) => {
    const hl = () => [hole(bore / 2 + 0.05, c)];
    ctx.add(place(UPF, H.solid(id, { name, kind: "pulley", role: "hw", mat: "Aluminium 6061-T6", outer: circle(pm.od / 2, c[0], c[1], 36), holes: hl(), z0: zp[0], z1: zp[1], joints: J })));
    ctx.add(place(UPF, H.solid(`${id}-fl0`, { name: "", kind: "pulley", role: "hw", outer: circle(pm.fd / 2, c[0], c[1], 36), holes: hl(), z0: zp[0] - 1, z1: zp[0], joints: J })));
    ctx.add(place(UPF, H.solid(`${id}-fl1`, { name: "", kind: "pulley", role: "hw", outer: circle(pm.fd / 2, c[0], c[1], 36), holes: hl(), z0: zp[1], z1: zp[1] + 1, joints: J })));
  };
  pulley("drive-pulley-motor", Mm, MOT.shaft, `GT2 timing pulley ${pm.T}T, set screw on the motor shaft's flat`);
  pulley("drive-idler", I, 5, `GT2 idler pulley ${pm.T}T on a bearing, on the tensioner`);
  const ring = H.hullOf([[Mm[0], Mm[1], rp + 0.7], [I[0], I[1], rp + 0.7]]);
  const inner = H.hullOf([[Mm[0], Mm[1], rp - 0.7], [I[0], I[1], rp - 0.7]]);
  // its marks run round the pitch path as the carriage, clamped to the span on the input's axis, slides (SD29)
  const pitch = H.hullOf([[Mm[0], Mm[1], rp], [I[0], I[1], rp]]);
  const run = { path: pitch, tr: slideTravel(ctx, slider, { x: UPF.x as Vec3, z: UPF.z as Vec3 }, pitch, line((tA + tB) / 2)) };
  ctx.add(place(UPF, H.solid("drive-belt", { name: "GT2 belt 6 mm, closed loop", kind: "belt", role: "hw", mat: "Neoprene, glass-fibre cords", outer: ring, holes: [inner.slice().reverse()], z0: zp[0], z1: zp[1], joints: J }), { run }));
  // the tensioner: a plate under the base, slotted along the axis for two screws up into the base, the idler on a
  // shoulder screw into it (F7)
  const out: Vec2 = [-end * ax[0], -end * ax[1]];
  const Te = add2(I, out, 16);
  const slots = [6, 13].map((s) => roundedPoly([add2(I, out, s - 2), add2(I, out, s + 2)], 2.2));
  ctx.add(place(UPF, H.plate("drive-tensioner", roundedPoly([I, Te], 9), { name: "Belt tensioner plate, slotted, 2 x M4 up into the base", kind: "bracket", z0: bb - 3, z1: bb, holes: [hole(2, I, 16), ...slots.map((s) => s.slice().reverse())], joints: J })));
  [6, 13].forEach((s, k) => ctx.add(place(UPF, H.screw(`drive-tn${k}`, "button", 4, 3 + 6, { at: at3(add2(I, out, s)), face: bb - 3, dir: 1, ...(k ? { name: "", qty: 0 } : { qty: 2 }), joints: J }))));
  ctx.add(place(UPF, H.screw("drive-idler-sc", "socket", 4, zp[1] + 1 - (zp[0] - 1) + 2 + 3, { at: at3(I), face: zp[0] - 1, dir: 1, name: "Shoulder screw Ø5, M4, the idler's axle, into the tensioner", joints: J })));
  ctx.add(place(UPF, H.spacer("drive-idler-sp", 4.2, 7, { at: at3(I), z0: zp[1] + 1, z1: bb - 3, joints: J })));
  // the carriage on the slider: a block up through the base slot to the slider's underside, a jaw and a clamp plate
  // round the belt's near span, two screws through them (F2); the flag on its jaw
  const CF: Frame = { o: at3(q0), x: [ax[0], ax[1], 0], z: [0, 0, 1] };
  const nRect = (y0: number, y1: number, x0 = -CW, x1 = CW): Vec2[] => roundRect(x0, Math.min(sg * y0, sg * y1), x1, Math.max(sg * y0, sg * y1), 1);
  const onS = { body: slider, joints: [...J, jt.id] };
  ctx.add(place(CF, H.solid("drive-carriage", { ...onS, name: "Belt carriage, screwed to the slider's underside, up through a slot in the base", kind: "part", role: "hw", mat: "Aluminium 6061-T6", outer: nRect(-4, 6), z0: zj[1], z1: zS })));
  ctx.add(place(CF, H.solid("drive-carriage-jaw", { ...onS, name: "", kind: "part", role: "hw", mat: "Aluminium 6061-T6", outer: nRect(0.8, 6), z0: zj[0], z1: zj[1], group: "drive-carriage" })));
  ctx.add(place(CF, H.plate("drive-belt-clamp", nRect(-4, -0.8), { ...onS, name: "Belt clamp plate, the near span between it and the jaw", kind: "plate", role: "hw", z0: zj[0], z1: zj[1] })));
  [-3.5, 3.5].forEach((x, k) => {
    const sf: Frame = { o: [q0[0] + x * ax[0] - sg * 4 * nx[0], q0[1] + x * ax[1] - sg * 4 * nx[1], bb - 13], x: [0, 0, 1], z: [sg * nx[0], sg * nx[1], 0] };
    ctx.add(place(sf, H.screw(`drive-clamp-sc${k}`, "socket", 3, 9, { ...onS, at: [0, 0, 0], face: 0, dir: 1, ...(k ? { name: "", qty: 0 } : { qty: 2 }) })));
  });
  const vz = zj[0];
  const mouth = 7.5;
  ctx.add(place(CF, H.flag("drive-flag", 5, mouth + SENSOR.depth - 1.5, sg > 0 ? Math.PI / 2 : -Math.PI / 2, { ...onS, z0: vz, z1: vz + SENSOR.vane })));
  // the slot in the base, a millimetre clear of the carriage at each end of the stroke
  ctx.baseHoles.push({ at: line((tLo + tHi) / 2), r: 0, joint: "drive", ring: slot as [number, number][] });
  // the fork at the idler's end of the stroke, outside the carriage's run
  const tHome = end > 0 ? tLo : tHi;
  const FF = frameAt(line(tHome), Math.atan2(sg * nx[1], sg * nx[0]));
  const sOut = forkSensor(ctx, FF, mouth, vz);
  const tb = line(tA + end * (R + 14), -sg * rp);
  const motorOut = line(tA + end * (R - 4), -sg * rp);
  cabling(ctx, tb, along, [[motorOut, line(tA + end * (R + 4), -sg * rp)], [sOut, line(tA, sg * (mouth + SENSOR.l)), line(tA + end * (R + 6), sg * (mouth + SENSOR.l))]]);
  ctx.note({
    id: "drive",
    kit: "drive",
    at: at3(q0),
    title: "Drive",
    note: `Linear input: brushless pancake motor in a one-piece bracket under the base at one end of the ${fmt(tHi - tLo)} mm stroke, GT2 16T pulleys and a closed belt loop along it, the idler on a slotted tensioner plate at the other end; a carriage clamps the belt's near span between its jaw and a clamp plate and rises through a slot in the base to the slider; a home flag on the carriage read by a fork sensor at the end of the stroke; terminals and leads under the base.`,
    serves: { F10: ["drive-flag", "drive-sensor"], F7: ["drive-tensioner"], F2: ["drive-belt-clamp"] },
    badge: ["motor driven", "ok"],
  });
}


// ------------------------------------------------------------------------------------------------ manual

/**
 * A hand-worked input (V5 `manual`): no motor; a knob on a shoulder screw on the input part, where it clears every other
 * part's sweep, toward the part's far end. The stops at the ends of a swing are the stops rule's (F5); the page says
 * hand operated.
 */
export function manualDrive(ctx: BuildCtx): void {
  const manual = ctx.kin.drivers.filter((d) => d.kind === "manual" && d.joint);
  manual.forEach((drv, n) => {
    const jt = ctx.joints.find((q) => q.id === drv.joint);
    if (!jt) return;
    // an input that turns about its own axis and has its knob from its kit (a screw's knurled knob on its end, J11)
    if ([jt.a, jt.b].some((b) => !!(ctx.kin.bodies.find((q) => q.id === b)?.shape as Record<string, unknown> | undefined)?.knob)) return;
    const placed = [jt.a, jt.b].filter((b) => b !== "ground" && ctx.parts.has(b)).some((body) => {
      const part = ctx.parts.get(body)!;
      const pts = worldPoints(ctx.M, part);
      const top = Math.max(...pts.map((p) => p[2]));
      const J0 = xy(jt.at);
      const far = pts.reduce((q, p) => (d2(xy(p), J0) > d2(xy(q), J0) ? p : q), pts[0]!);
      const reach = d2(xy(far), J0);
      const a = ang2(J0, xy(far));
      // away from the part's joints, whose heads stand on its top face
      const pins = ctx.joints.filter((q) => q.a === body || q.b === body).map((q) => xy(q.at));
      const others = ctx.sweeps.moving().filter((b) => b !== body);
      // on a crank, toward its far end; on a moving pin (a stylus), as near the pin as its head allows
      const at = jt.a === "ground" || jt.b === "ground" ? [0.85, 0.7, 0.55, 0.4, 0.25].map((f) => f * reach) : [14, 18, 24, 30, 40].filter((s) => s < reach);
      // at the grip the record names on the part, else along it
      const grip = (ctx.kin.points ?? []).filter((q) => q.body === body && /grip|handle|knob/i.test(q.id)).map((q) => ctx.S.refPts.get(q.id)).filter((q): q is Vec3 => !!q);
      // on the part's centreline from the pivot (toward its far end): a knob off to one side reads as a stray peg
      const mid = centreline(part, J0, a);
      const cands: Vec2[] = [...grip.map(xy), ...at.map((s) => add2(J0, dir2(mid), s)), ...at.flatMap((s) => [0.12, -0.12].map((da) => add2(J0, dir2(mid + da), s)))];
      for (const p of cands) {
        if (pts.length && pins.some((q) => d2(q, p) < 12)) continue;
        if (!onPart(part, p)) continue;
        const id = manual.length > 1 ? `drive-knob${n}` : "drive-knob";
        const knob = place(UPF, H.solid(id, { body, name: "Handle knob Ø12, phenolic, on a shoulder screw M4", kind: "part", role: "hw", mat: "Phenolic, black", outer: circle(6, p[0], p[1], 24), z0: top + 2, z1: top + 14, joints: [...J, jt.id] }));
        const m = worldManifold(ctx.M, knob[0]!);
        const g = ctx.sweeps.gap(m, others, MIN_GAP + 1);
        m.delete();
        if (g < MIN_GAP) continue;
        ctx.add(knob);
        ctx.add(place(UPF, H.tube(`${id}-sleeve`, 4, 6, { body, at: at3(p), name: "Shoulder screw M4, the knob's axle", z0: top, z1: top + 2, joints: [...J, jt.id] })));
        return true;
      }
      return false;
    });
    if (!placed) ctx.issues.push(`drive: no place for a knob on the hand-worked input ${drv.id} clears the other parts`);
  });
  ctx.note({ id: "drive", kit: "drive", at: manual[0] ? (ctx.joints.find((q) => q.id === manual[0]!.joint)?.at ?? [0, 0, 0]) : [0, 0, 0], title: "Drive · hand operated", note: "Hand operated: no motor; a knob on a shoulder screw on each hand-worked input, its range limited by the stops at the ends of its swing where it has ends.", serves: {}, badge: ["hand operated", "ok"] });
}

/**
 * The direction from the pivot J0 along the middle of the part (a crank's centreline): of the directions near `a` (its
 * farthest point's), the one whose ray stays on the part longest, ties broken toward the middle of the run.
 */
function centreline(part: { frame: Frame; profile: { outer: Vec2[] } }, J0: Vec2, a: number): number {
  const ring = part.profile.outer.map((q): Vec2 => {
    const w = fromPlane(part.frame, q, 0);
    return [w[0], w[1]];
  });
  const reach = (t: number) => {
    let s = 0;
    while (s < 400 && pointDist(ring, J0[0] + Math.cos(t) * (s + 1), J0[1] + Math.sin(t) * (s + 1)) === 0) s += 1;
    return s;
  };
  const tries = Array.from({ length: 41 }, (_, k) => a + ((k - 20) * Math.PI) / 120);
  const r = tries.map(reach);
  const best = Math.max(...r);
  const ok = tries.filter((_, k) => r[k]! >= best - 1);
  return ok[Math.floor(ok.length / 2)]!;
}

/** True when the world point p lies on the part's outline in plan (its frame's plane is the base plane's). */
function onPart(part: { frame: Frame; profile: { outer: Vec2[] } }, p: Vec2): boolean {
  const ring = part.profile.outer.map((q): Vec2 => {
    const w = fromPlane(part.frame, q, 0);
    return [w[0], w[1]];
  });
  return pointDist(ring, p[0], p[1]) === 0 && ring.every((q) => d2(q, p) >= 4);
}
