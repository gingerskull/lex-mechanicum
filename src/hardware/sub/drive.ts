// H.drive (V1 to V6): the prime mover by input kind. rotary: a brushless pancake motor under the base in a one-piece
// bracket, GT2 belt 32:16 to the input pulley. oscillating: the motor turns a short crank, a link swings a lever on the
// input shaft through exactly the modelled range. linear: a belt loop under the base along the stroke, a carriage
// clamped to the input slider through a slot in the base, a tensioner on the far pulley. manual: a handle on the input
// and stops at the ends of its range, no motor. Every motorised build has a home flag, a fork sensor, leads to a
// terminal block on the base edge and a cable clip.
import { TAU, bbox, circle, roundedPoly, type Pose, type Vec2 } from "../../core/geom";
import { growBase } from "../../rules/base";
import { depth, toWorld } from "../../core/poly";
import { poseOf } from "../../model/pose";
import { heights } from "../../parts";
import type { PinJoint, RuleContext, SlideJoint } from "../../rules/types";
import { cableClip, disc, flag, hullOf, lead, plate, screw, setScrew, shaft, spacer, terminalBlock, tube } from "../primitives";
import { solid, marks, type Motion, type Solid } from "../solid";
import { MOTORS, PULLEYS, BELT, innerRingD } from "../tables";
import { housingBearing } from "./housing";
import { sensor } from "./misc";
import { stops, swing } from "./stops";

export type MotorKind = "pancake" | "brushed";
const TIN = 32;
const TM = 16;
const fmt = (v: number) => String(+v.toFixed(1));

export interface DriveSpec {
  motor?: MotorKind;
}

const ring = (ro: number, ri: number) => ({ outer: disc(ro), holes: [disc(ri)] });

/** An arc band from angle t0 to t1 between radii ri and ro: the bracket wall with its belt window. */
function band(ri: number, ro: number, t0: number, t1: number, n = 48): Vec2[] {
  const pts: Vec2[] = [];
  for (let i = 0; i <= n; i++) pts.push([ro * Math.cos(t0 + ((t1 - t0) * i) / n), ro * Math.sin(t0 + ((t1 - t0) * i) / n)]);
  for (let i = n; i >= 0; i--) pts.push([ri * Math.cos(t0 + ((t1 - t0) * i) / n), ri * Math.sin(t0 + ((t1 - t0) * i) / n)]);
  return pts;
}

/**
 * Where no spot under the base fits, the motor goes beside the mechanism, away from the base centre, and the base grows
 * to carry its bracket.
 */
function grownSpot(ctx: RuleContext, from: Vec2, R: number, c: number): Vec2 {
  const [x0, y0, x1, y1] = bbox(ctx.get("base")!.outer);
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  const L = Math.hypot(from[0] - cx, from[1] - cy);
  const u: Vec2 = L > 1 ? [(from[0] - cx) / L, (from[1] - cy) / L] : [0, -1];
  const M: Vec2 = [from[0] + c * u[0], from[1] + c * u[1]];
  const m = R + 8;
  growBase(ctx, [M[0] - m, M[1] - m, M[0] + m, M[1] + m]);
  return M;
}

/** A clear spot for a motor bracket of radius R under the base, at distance c from `from` (closest first). */
function motorSpot(ctx: RuleContext, from: Vec2, R: number, z0: number, cMin: number, cMax: number): Vec2 | null {
  const base = ctx.get("base")!;
  let best: { p: Vec2; s: number } | null = null;
  for (let c = cMin; c <= cMax; c += 2)
    for (let k = 0; k < 36; k++) {
      const a = (k / 36) * TAU;
      const p: Vec2 = [from[0] + c * Math.cos(a), from[1] + c * Math.sin(a)];
      if (depth(base.outer, [], p) < R + 3) continue;
      const cl = ctx.clearance(p, R + 1, z0, ctx.b0, (t) => t.isBase === true);
      if (cl < 0) continue;
      const s = c - Math.min(cl, 10) * 0.5;
      if (!best || s < best.s) best = { p, s };
    }
  return best?.p ?? null;
}

interface MotorResult {
  M: Vec2;
  bracketTop: string;
  zFloor: number;
  leadFrom: Vec2;
}

/**
 * The motor in its one-piece bracket (V1, V2): top flange screwed up into the base from inside, a wall with a
 * full-height window toward `toward`, a floor carrying the motor; the motor below with faint internals turning at
 * the belt ratio. The pulley plane is [zp0, zp1].
 */
function motorUnit(ctx: RuleContext, M: Vec2, toward: Vec2, zp0: number, kind: MotorKind, spin: { body: string; motion: Motion } | null, shaftTop = zp0 + 7.6): MotorResult {
  const m = MOTORS[kind];
  const RO = m.R;
  const RI = RO - 3.5;
  const beta = Math.atan2(toward[1] - M[1], toward[0] - M[0]);
  const at: Pose = [M[0], M[1], 0];
  const G = { at, joints: ["drive"], group: "drive-bracket", ex: -6 };
  const zf1 = zp0 - 2.3;
  const zf0 = zf1 - 3;
  const wh = (62 * Math.PI) / 180;
  const name = `Motor bracket Ø${2 * RO}, one piece, belt window`;
  const lugs = [beta + Math.PI, beta + Math.PI / 3, beta - Math.PI / 3].map((t): Vec2 => [(RI - 3.2) * Math.cos(t), (RI - 3.2) * Math.sin(t)]);
  const face = [beta + Math.PI / 2, beta - Math.PI / 2].map((t): Vec2 => [11 * Math.cos(t), 11 * Math.sin(t)]);
  const B = { kind: "bracket" as const, role: "ground" as const, mat: "Aluminium 6061, bead-blasted", chamfer: 0.8 };
  ctx.add(solid("drive-floor", { ...B, ...G, name, outer: disc(RO), holes: [disc(6.5), ...face.map((p) => disc(1.7, ...p))], z0: zf0, z1: zf1 }));
  ctx.add(solid("drive-wall", { ...B, ...G, name: "", outer: band(RI, RO, beta + wh, beta + TAU - wh), z0: zf1, z1: ctx.b0 - 3 }));
  ctx.add(solid("drive-top", { ...B, ...G, name: "", ...ring(RO, RI - 5), holes: [disc(RI - 5), ...lugs.map((p) => disc(1.7, ...p))], z0: ctx.b0 - 3, z1: ctx.b0 }));
  lugs.forEach((p, k) => ctx.add(screw(`drive-top-sc${k}`, "button", 3, 3 + 4.5, { ...G, group: undefined, at: [M[0] + p[0], M[1] + p[1], 0], face: ctx.b0 - 3, dir: 1, name: k ? "" : undefined, qty: k ? 0 : 3 })));
  face.forEach((p, k) => ctx.add(screw(`drive-face-sc${k}`, "button", 3, 6, { ...G, group: undefined, at: [M[0] + p[0], M[1] + p[1], 0], face: zf1, dir: -1, name: k ? "" : undefined, qty: k ? 0 : 2 })));
  // the motor: stator flange on the floor, bell and magnets turning, stator and windings faint inside
  const MO = { at, joints: ["drive"], ex: -8, group: "drive-motor", role: "ground" as const };
  const turn = spin ? { body: spin.body, motion: spin.motion } : {};
  const zm = zf0;
  if (kind === "pancake") {
    ctx.add(solid("drive-motor", { ...MO, kind: "motor", name: m.name, mat: "Aluminium flange, steel bell", outer: disc(RO - 3), holes: [disc(2.1)], marks: marks("boss", circle(RO - 6, 0, 0, 64), ...face.map((p) => circle(1.6, ...p, 14))), z0: zm - 3, z1: zm, chamfer: 0.8 }));
    ctx.add(solid("drive-bell", { ...MO, ...turn, kind: "motor", name: "", mat: "Steel, black e-coat", outer: disc(RO), holes: [disc(2.1)], z0: zm - m.H, z1: zm - 3.5 }));
    ctx.add(solid("drive-stator", { ...MO, kind: "motorInternal", name: "Stator, 12 teeth, 3-phase windings", faint: true, ...ring(19.8, 4.6), z0: zm - 14, z1: zm - 4.5 }));
    ctx.add(solid("drive-magnets", { ...MO, ...turn, kind: "motorInternal", name: "Neodymium magnets, 14 poles", faint: true, ...ring(22.8, 20.6), z0: zm - 14.5, z1: zm - 4 }));
  } else {
    ctx.add(solid("drive-motor", { ...MO, kind: "motor", name: m.name, mat: "Steel can, nylon end cap", outer: disc(RO), holes: [disc(2.1)], z0: zm - m.H, z1: zm, chamfer: 1.2 }));
    ctx.add(solid("drive-armature", { ...MO, ...turn, kind: "motorInternal", name: "Armature, 5-pole, copper windings", faint: true, ...ring(12.8, 2.1), z0: zm - 42, z1: zm - 12 }));
  }
  ctx.add(shaft("drive-shaft", { d: m.shaft, z0: zm - 6, z1: shaftTop, flat: true }, { name: `Motor shaft Ø${m.shaft}, D-flat`, ...MO, ...turn, group: "drive-shaft" }));
  return { M, bracketTop: "drive-top", zFloor: zf0, leadFrom: [M[0] + RO * Math.cos(beta + Math.PI), M[1] + RO * Math.sin(beta + Math.PI)] };
}

/** A lead's start, and optionally a part it must go round on an arc (the input housing) before it heads for the block. */
interface Run {
  from: Vec2;
  around?: { c: Vec2; r: number };
}

/**
 * Leads from the motor and the sensor to a terminal block on the base edge, one cable clip under the base (V6). Each
 * lead is routed as a cable is laid: an arc round a housing it must clear (the way that keeps it away from the motor),
 * runs parallel to the base edges, and a last run square to the block into its own clamp.
 */
function cabling(ctx: RuleContext, runs: Run[], motor: Vec2): void {
  const base = ctx.get("base")!;
  const xs = base.outer.map((p) => p[0]);
  const ys = base.outer.map((p) => p[1]);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const f = runs[0]!.from;
  // the edge nearest the motor; n is the inward normal of that edge
  const cand: [Vec2, number, Vec2][] = [
    [[f[0], y0 + 6], 0, [0, 1]],
    [[f[0], y1 - 6], 0, [0, -1]],
    [[x0 + 6, f[1]], Math.PI / 2, [1, 0]],
    [[x1 - 6, f[1]], Math.PI / 2, [-1, 0]],
  ];
  cand.sort((a, b) => Math.hypot(a[0][0] - f[0], a[0][1] - f[1]) - Math.hypot(b[0][0] - f[0], b[0][1] - f[1]));
  const [T, rot, n] = cand[0]!;
  const along: Vec2 = [Math.cos(rot), Math.sin(rot)];
  const z0 = ctx.b0 - 8;
  const G = { joints: ["drive"], ex: -2 };
  ctx.add(terminalBlock("drive-terminal", 4, { ...G, at: [T[0], T[1], rot], z0, z1: ctx.b0 }));
  ctx.add(screw("drive-terminal-sc", "button", 3, 14, { ...G, at: [T[0], T[1], 0], face: z0, dir: 1, name: "Button head M3 x 14, terminal block to base" }));
  const vertical = n[0] === 0;
  runs.forEach((run, k) => {
    // its own clamp: the motor lead left of centre, the sensor lead right
    const off = (k ? 1 : -1) * 5;
    const clamp: Vec2 = [T[0] + along[0] * off + n[0] * 4, T[1] + along[1] * off + n[1] * 4];
    const approach: Vec2 = [clamp[0] + n[0] * 10, clamp[1] + n[1] * 10];
    const pts: Vec2[] = [run.from];
    if (run.around) {
      const { c, r } = run.around;
      const a0 = Math.atan2(run.from[1] - c[1], run.from[0] - c[0]);
      const a1 = Math.atan2(approach[1] - c[1], approach[0] - c[0]);
      const ccw = ((a1 - a0) % TAU + TAU) % TAU;
      const arc = (sweep: number): Vec2[] => {
        const steps = Math.max(1, Math.ceil(Math.abs(sweep) / (Math.PI / 12)));
        return Array.from({ length: steps + 1 }, (_, i): Vec2 => {
          const a = a0 + (sweep * i) / steps;
          return [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)];
        });
      };
      const clear = (p: Vec2[]) => Math.min(...p.map((q) => Math.hypot(q[0] - motor[0], q[1] - motor[1])));
      const A = arc(ccw);
      const B = arc(ccw - TAU);
      pts.push(...(clear(A) >= clear(B) ? A : B));
    }
    const last = pts[pts.length - 1]!;
    // runs parallel to the base edges, turning at the corner that keeps the lead farther from the motor bracket,
    // then square into the block
    const segClear = (a: Vec2, b: Vec2) => {
      const dx = b[0] - a[0];
      const dy = b[1] - a[1];
      const t = Math.max(0, Math.min(1, ((motor[0] - a[0]) * dx + (motor[1] - a[1]) * dy) / (dx * dx + dy * dy || 1)));
      return Math.hypot(a[0] + t * dx - motor[0], a[1] + t * dy - motor[1]);
    };
    const corners: Vec2[] = [vertical ? [approach[0], last[1]] : [last[0], approach[1]], vertical ? [last[0], approach[1]] : [approach[0], last[1]]];
    const corner = k === 0 ? corners[0]! : corners.reduce((p, q) => (Math.min(segClear(last, q), segClear(q, approach)) > Math.min(segClear(last, p), segClear(p, approach)) ? q : p));
    if (Math.hypot(corner[0] - last[0], corner[1] - last[1]) > 1 && Math.hypot(corner[0] - approach[0], corner[1] - approach[1]) > 1) pts.push(corner);
    pts.push(approach, clamp);
    // no zero-length runs: the strip outline needs a direction at every point
    const run2 = pts.filter((p, i) => i === 0 || Math.hypot(p[0] - pts[i - 1]![0], p[1] - pts[i - 1]![1]) > 0.01);
    pts.length = 0;
    pts.push(...run2);
    ctx.add(lead(`drive-lead${k}`, pts, { ...G, z0: ctx.b0 - 2.6, z1: ctx.b0 - 0.8, name: k ? "Sensor lead, 3-core" : "Motor phase leads, 3-core" }));
    if (k === 0) {
      // the clip holds the motor lead on its longest run
      let best = 0;
      for (let i = 1; i < pts.length; i++) if (Math.hypot(pts[i]![0] - pts[i - 1]![0], pts[i]![1] - pts[i - 1]![1]) > Math.hypot(pts[best + 1]![0] - pts[best]![0], pts[best + 1]![1] - pts[best]![1])) best = i - 1;
      const [p, q] = [pts[best]!, pts[best + 1]!];
      const mid: Vec2 = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
      ctx.add(cableClip("drive-clip", { ...G, at: [mid[0], mid[1], Math.atan2(q[1] - p[1], q[0] - p[0]) + Math.PI / 2], z0: ctx.b0 - 3.2, z1: ctx.b0 }));
      ctx.add(screw("drive-clip-sc", "button", 3, 6, { ...G, at: [mid[0], mid[1], 0], face: ctx.b0 - 3.2, dir: 1, name: "Button head M3 x 6, cable clip" }));
    }
  });
}

/** The home flag on the input hub and its fork sensor screwed to the housing (V6, F10). */
function homing(ctx: RuleContext, j: PinJoint, hubR: number, zv: number, away: number): void {
  const G = { body: j.body, at: j.at, joints: ["drive"], ex: -5 };
  ctx.add(flag("drive-flag", hubR - 0.5, hubR + 8, 0, { ...G, z0: zv, z1: zv + 1 }));
  sensor(ctx, "drive-sensor", { axis: j.P, a: away, rIn: hubR + 3, rOut: hubR + 9.5, zv, t: 1, joint: "drive", ex: -5 });
}

function inputJoint(ctx: RuleContext): PinJoint | undefined {
  const id = ctx.model.input.part;
  return ctx.info.find((j): j is PinJoint => j.kind === "pin" && j.type === "J2" && j.driven.some((x) => x.part.id === id));
}

function rotary(ctx: RuleContext, kind: MotorKind): string {
  const j = inputJoint(ctx);
  if (!j?.below) return "No live input shaft to drive: the input part needs a fixed pivot with the accent cap.";
  const zp0 = j.below.z0;
  const pin = PULLEYS[TIN];
  const pm = PULLEYS[TM];
  const R = MOTORS[kind].R;
  const M = motorSpot(ctx, j.P, R, zp0 - 25, R + 22, R + 60) ?? grownSpot(ctx, j.P, R, R + 24);
  const ratio = TIN / TM;
  const unit = motorUnit(ctx, M, j.P, zp0, kind, { body: j.body, motion: { type: "geared", around: M, ratio } });
  // input pulley, hub with two set screws at 90° (F3), spacer up to the lower housing bearing
  const G = { body: j.body, at: j.at, joints: ["drive", j.id], ex: -5 };
  const hubR = 8;
  ctx.add(solid("drive-pulley-in", { ...G, kind: "pulley", role: "driver", name: `Input pulley GT2 ${TIN}T, ${j.d <= 8 ? "D-bore" : "keyed"}`, mat: "Aluminium 6061-T6, anodised", outer: disc(pin.od / 2), holes: [disc(j.d / 2 + 0.01)], marks: marks("boss", circle(pin.od / 2 - 1.4, 0, 0, 48)), z0: zp0, z1: zp0 + 7 }));
  ctx.add(solid("drive-hub-in", { ...G, kind: "pulley", role: "driver", name: "Pulley hub, 2 x M3 set screws at 90°", outer: disc(hubR), holes: [disc(j.d / 2 + 0.01)], z0: zp0 + 7, z1: zp0 + 12.5 }));
  ctx.add(setScrew("drive-hub-ss0", 3, { ...G, at: [j.at[0] + hubR - 1.6, j.at[1], 0], z0: zp0 + 8, z1: zp0 + 10 }));
  ctx.add(setScrew("drive-hub-ss1", 3, { ...G, at: [j.at[0], j.at[1] + hubR - 1.6, 0], z0: zp0 + 8, z1: zp0 + 10, name: "" }));
  if (j.below.z1 - (zp0 + 12.5) > 0.3) ctx.add(spacer("drive-spacer-in", j.d + 0.2, Math.min(j.d + 3.2, innerRingD(housingBearing(j.d))), { ...G, name: "Spacer, hub to the lower inner race", z0: zp0 + 12.5, z1: j.below.z1 }));
  // motor pulley on the motor shaft, turning at the belt ratio; J8 adds its flanges
  ctx.add(solid("drive-pulley-m", { body: j.body, at: [0, 0, 0], motion: { type: "geared", around: M, ratio }, joints: ["drive"], ex: -6, kind: "pulley", role: "driver", name: `Motor pulley GT2 ${TM}T, D-bore`, mat: "Aluminium 6061-T6", outer: disc(pm.od / 2), holes: [disc(2.05)], z0: zp0, z1: zp0 + 7 }));
  ctx.add(
    solid("drive-belt", {
      kind: "belt",
      name: `Timing belt GT2, ${BELT.width} mm, closed loop`,
      mat: "Neoprene, glass-fibre cords",
      outer: hullOf([[j.P[0], j.P[1], pin.pd / 2 + BELT.thick], [M[0], M[1], pm.pd / 2 + BELT.thick]]),
      holes: [hullOf([[j.P[0], j.P[1], pin.pd / 2 + 0.15], [M[0], M[1], pm.pd / 2 + 0.15]])],
      z0: zp0 + 0.5,
      z1: zp0 + 6.5,
      ex: -5.5,
      joints: ["drive"],
      chamfer: 0,
    }),
  );
  ctx.belts.push({ belt: "drive-belt", pulleys: ["drive-pulley-m", "drive-pulley-in"], mount: unit.bracketTop, joint: "drive" });
  const away = Math.atan2(j.P[1] - M[1], j.P[0] - M[0]);
  homing(ctx, j, hubR, zp0 + 11.5, away);
  // the sensor lead leaves radially and goes round the housing, clear of the shaft
  const Rh = 30;
  const sp: Vec2 = [j.P[0] + Rh * Math.cos(away), j.P[1] + Rh * Math.sin(away)];
  cabling(ctx, [{ from: unit.leadFrom }, { from: sp, around: { c: j.P, r: Rh } }], M);
  const c = Math.hypot(M[0] - j.P[0], M[1] - j.P[1]);
  return `${kind === "pancake" ? "Brushless pancake motor Ø50 x 18" : "Brushed DC motor Ø36"} under the base in a one-piece bracket, GT2 belt ${TIN}:${TM} over ${fmt(c)} mm to the input pulley; home flag on the input hub read by a fork sensor on the housing, leads to a terminal block on the base edge.`;
}

function oscillating(ctx: RuleContext, kind: MotorKind): string {
  const j = inputJoint(ctx);
  const part = ctx.parts[ctx.model.input.part]!;
  const r = swing(ctx, part);
  if (!j?.below || !r) return "No live oscillating input to drive.";
  const zl = j.below.z0;
  const rho = 22;
  // the lever points away from the part; its tip's extremes set the crank and link at their dead centres
  const off = Math.PI;
  const tip = (th: number): Vec2 => [j.P[0] + rho * Math.cos(th + off), j.P[1] + rho * Math.sin(th + off)];
  const Tlo = tip(r[0]);
  const Thi = tip(r[1]);
  const Tm: Vec2 = [(Tlo[0] + Thi[0]) / 2, (Tlo[1] + Thi[1]) / 2];
  const R = MOTORS[kind].R;
  // the motor where its crank comes out at least 5 mm, the link at least 2.5 cranks long, the bracket clear
  let M: Vec2 | null = null;
  let bestD = Infinity;
  for (let D = 2 * rho; D <= 8 * rho; D += rho / 2)
    for (let k = 0; k < 24; k++) {
      const p: Vec2 = [Tm[0] + D * Math.cos((k / 24) * TAU), Tm[1] + D * Math.sin((k / 24) * TAU)];
      const rc0 = Math.abs(Math.hypot(p[0] - Thi[0], p[1] - Thi[1]) - Math.hypot(p[0] - Tlo[0], p[1] - Tlo[1])) / 2;
      const L0 = (Math.hypot(p[0] - Thi[0], p[1] - Thi[1]) + Math.hypot(p[0] - Tlo[0], p[1] - Tlo[1])) / 2;
      if (rc0 < 5 || L0 < 2.5 * rc0 || D >= bestD) continue;
      if (Math.hypot(p[0] - j.P[0], p[1] - j.P[1]) < R + 22) continue;
      if (depth(ctx.get("base")!.outer, [], p) < R + 3) continue;
      if (ctx.clearance(p, R + 1, zl - 40, ctx.b0, (t) => t.isBase === true) < 0) continue;
      M = p;
      bestD = D;
    }
  if (!M) {
    // beside the mechanism on a grown base: the direction round the swing that gives the longest usable crank
    const [bx0, by0, bx1, by1] = bbox(ctx.get("base")!.outer);
    const out: Vec2 = [j.P[0] - (bx0 + bx1) / 2, j.P[1] - (by0 + by1) / 2];
    let best: { p: Vec2; s: number } | null = null;
    const D = R + 30 + rho;
    for (let k = 0; k < 24; k++) {
      const a = (k / 24) * TAU;
      const p: Vec2 = [Tm[0] + D * Math.cos(a), Tm[1] + D * Math.sin(a)];
      const dh = Math.hypot(p[0] - Thi[0], p[1] - Thi[1]);
      const dl = Math.hypot(p[0] - Tlo[0], p[1] - Tlo[1]);
      const rc0 = Math.abs(dh - dl) / 2;
      if (rc0 < 5 || (dh + dl) / 2 < 2.5 * rc0) continue;
      const s = rc0 + 0.2 * (Math.cos(a) * out[0] + Math.sin(a) * out[1]) / (Math.hypot(...out) || 1);
      if (!best || s > best.s) best = { p, s };
    }
    M = best?.p ?? [Tm[0] + D, Tm[1]];
    const m = R + 8;
    growBase(ctx, [M[0] - m, M[1] - m, M[0] + m, M[1] + m]);
  }
  const dHi = Math.hypot(M[0] - Thi[0], M[1] - Thi[1]);
  const dLo = Math.hypot(M[0] - Tlo[0], M[1] - Tlo[1]);
  const L = (dHi + dLo) / 2;
  const rc = Math.abs(dHi - dLo) / 2;
  const unit = motorUnit(ctx, M, j.P, zl - 18, kind, null, zl - 5.5);
  const G = { body: j.body, joints: ["drive", j.id], ex: -5 };
  const motion = (type: "crank" | "link"): Motion => ({ type, motor: M!, r: rc, L, pivot: j.P, rho, off });
  ctx.add(solid("drive-lever", { ...G, at: [j.at[0], j.at[1], off], kind: "part", role: "driver", name: `Drive lever, ${rho} mm`, mat: "Steel C45", outer: roundedPoly([[0, 0], [rho, 0]], 7), holes: [disc(j.d / 2 + 0.01)], z0: zl, z1: zl + 6 }));
  ctx.add(solid("drive-link", { ...G, at: [0, 0, 0], motion: motion("link"), kind: "part", role: "link", name: `Drive link, ${fmt(L)} mm`, mat: "Steel C45", outer: roundedPoly([[0, 0], [L, 0]], 5), z0: zl - 5, z1: zl - 0.5 }));
  ctx.add(solid("drive-crank", { ...G, at: [0, 0, 0], motion: motion("crank"), kind: "part", role: "driver", name: `Drive crank, ${fmt(rc)} mm, on the motor shaft`, mat: "Steel C45", outer: roundedPoly([[0, 0], [rc, 0]], 6), holes: [disc(2.05)], z0: zl - 10, z1: zl - 5.5 }));
  ctx.add(solid("drive-flag", { ...G, at: [0, 0, 0], motion: motion("crank"), kind: "flag", name: "Home flag on the drive crank", mat: "Stainless steel, 1 mm", outer: [[-2, -0.5], [-10, -0.5], [-10, 0.5], [-2, 0.5]].map(([x, y]) => [x, y] as Vec2), z0: zl - 14, z1: zl - 13 }));
  sensor(ctx, "drive-sensor", { axis: M, a: 0, rIn: 4, rOut: 12, zv: zl - 14, t: 1, joint: "drive", ex: -6 });
  cabling(ctx, [{ from: unit.leadFrom }, { from: [M[0] + 18, M[1]] }], M);
  return `Motor turns a ${fmt(rc)} mm crank; a ${fmt(L)} mm link swings a ${rho} mm lever on the input shaft through exactly the modelled ${(((r[1] - r[0]) * 180) / Math.PI).toFixed(0)}° (dead centres at the ends of the swing).`;
}

function linear(ctx: RuleContext, kind: MotorKind): string {
  const s = ctx.info.find((k): k is SlideJoint => k.kind === "slide" && k.slider.id === ctx.model.input.part);
  if (!s) return "No input slide to drive.";
  const pm = PULLEYS[TM];
  const rp = pm.pd / 2;
  const q0 = poseOf(s.slider, ctx.s0)!;
  const nrm: Vec2 = [-s.axis[1], s.axis[0]];
  const line = (t: number, k = rp): Vec2 => {
    const c0 = q0[0] * s.axis[0] + q0[1] * s.axis[1];
    return [q0[0] + (t - c0) * s.axis[0] + k * nrm[0], q0[1] + (t - c0) * s.axis[1] + k * nrm[1]];
  };
  const sx0 = Math.min(...s.slider.shape.outer.map((p) => p[0]));
  const sx1 = Math.max(...s.slider.shape.outer.map((p) => p[0]));
  const tA = s.range[1] + sx1 + MOTORS[kind].R + 6;
  const tB = s.range[0] + sx0 - 12;
  const M = line(tA, 0);
  const I = line(tB, 0);
  const zp0 = ctx.b0 - 12;
  const unit = motorUnit(ctx, M, I, zp0, kind, { body: s.slider.id, motion: { type: "rolling", around: M, axis: s.axis, r: rp } });
  const G = { joints: ["drive"], ex: -5 };
  ctx.add(solid("drive-pulley-m", { ...G, body: s.slider.id, motion: { type: "rolling", around: M, axis: s.axis, r: rp }, kind: "pulley", role: "driver", name: `Motor pulley GT2 ${TM}T`, outer: disc(pm.od / 2), holes: [disc(2.05)], z0: zp0, z1: zp0 + 7 }));
  ctx.add(solid("drive-idler", { ...G, body: s.slider.id, motion: { type: "rolling", around: I, axis: s.axis, r: rp }, kind: "pulley", role: "driver", name: `Idler pulley GT2 ${TM}T on a slotted tensioner arm`, outer: disc(pm.od / 2), holes: [disc(2.5)], z0: zp0, z1: zp0 + 7 }));
  ctx.add(plate("drive-tensioner", roundedPoly([[I[0], I[1]], line(tB - 14, 0)], 6), { ...G, kind: "bracket", name: "Tensioner arm, slotted, 2 x M4", holes: [roundedPoly([line(tB - 9, 0), line(tB - 13, 0)], 2.2)], z0: zp0 + 7.5, z1: ctx.b0 }));
  ctx.add(solid("drive-belt", { ...G, kind: "belt", name: `Timing belt GT2, ${BELT.width} mm, closed loop`, outer: hullOf([[M[0], M[1], rp + BELT.thick], [I[0], I[1], rp + BELT.thick]]), holes: [hullOf([[M[0], M[1], rp + 0.15], [I[0], I[1], rp + 0.15]])], z0: zp0 + 0.5, z1: zp0 + 6.5 }));
  ctx.belts.push({ belt: "drive-belt", pulleys: ["drive-pulley-m", "drive-idler"], mount: "drive-tensioner", joint: "drive" });
  // carriage: clamps the belt's near span and rises through a slot in the base to the slider
  const [z0s] = heights(s.slider);
  const base = ctx.get("base")!;
  base.holes.push(roundedPoly([line(s.range[0], rp), line(s.range[1], rp)], 5));
  ctx.add(solid("drive-carriage", { ...G, body: s.slider.id, kind: "part", role: "driver", name: "Belt carriage, clamped to the slider", mat: "Aluminium 6061-T6", outer: roundedPoly([[-6, rp], [6, rp]], 4), z0: zp0, z1: z0s, ex: ctx.solidOf[s.slider.id]!.ex }));
  ctx.add(flag("drive-flag", 0, 8, Math.PI / 2, { ...G, body: s.slider.id, at: [0, rp + 4, 0], z0: zp0 + 8, z1: zp0 + 9 }));
  cabling(ctx, [{ from: unit.leadFrom }, { from: line(s.range[0] - 10, rp + 12) }], M);
  return `Belt loop under the base along the ${fmt(s.range[1] - s.range[0])} mm stroke, a carriage through a slot in the base clamped to the slider, tensioner arm on the far pulley.`;
}

function manual(ctx: RuleContext): string {
  const part = ctx.parts[ctx.model.input.part]!;
  const ps = ctx.solidOf[part.id]!;
  const reach = Math.max(...part.shape.outer.map(([x, y]) => Math.hypot(x, y)));
  const G = { body: part.id, joints: ["drive"], ex: ps.ex + 1 };
  let placed = false;
  for (const f of [0.85, 0.7, 0.55, 0.4]) {
    for (const a of [0, Math.PI / 2, -Math.PI / 2, Math.PI]) {
      const l: Vec2 = [reach * f * Math.cos(a), reach * f * Math.sin(a)];
      const q = poseOf(part, ctx.s0)!;
      const w = toWorld(q, l);
      if (ctx.clearance(w, 6, ps.z1 + 0.1, ps.z1 + 14, (t) => t.id === part.id) < 0.5) continue;
      ctx.add(solid("drive-handle", { ...G, at: [l[0], l[1], 0], kind: "part", role: "driver", name: "Handle knob Ø12, on a shoulder screw", mat: "Phenolic, black", outer: disc(6), z0: ps.z1 + 2, z1: ps.z1 + 14 }));
      ctx.add(tube("drive-handle-sleeve", 4, 6, { ...G, at: [l[0], l[1], 0], name: "Handle shoulder screw M4", z0: ps.z1, z1: ps.z1 + 2 }));
      placed = true;
      break;
    }
    if (placed) break;
  }
  let note = placed ? "Hand operated: a knob on the input." : "Hand operated, but no clear spot for a knob on the input part.";
  // stops at the ends of the range (F5)
  const j = ctx.info.find((k): k is PinJoint => k.kind === "pin" && k.fixed && k.joined.some((x) => x.part.id === part.id));
  const r = swing(ctx, part);
  if (j && r) {
    const ids = stops(ctx, { part, pivot: j.P, range: r, joint: "drive" });
    note += ids.length ? " Stops at both ends of its swing." : "";
  }
  return note;
}

export function drive(ctx: RuleContext, spec: DriveSpec = {}): Solid[] {
  const before = ctx.solids.length;
  const kind = spec.motor ?? "pancake";
  const k = ctx.model.input.kind;
  const note = k === "rotary" ? rotary(ctx, kind) : k === "oscillating" ? oscillating(ctx, kind) : k === "linear" ? linear(ctx, kind) : manual(ctx);
  const added = ctx.solids.slice(before);
  const serves: Record<string, string[]> = {};
  const flagId = added.find((s) => s.kind === "flag")?.id;
  if (flagId) serves.F10 = [flagId, ...added.filter((s) => s.kind === "sensor").map((s) => s.id)];
  if (k === "manual") serves.F5 = added.filter((s) => s.kind === "bumper").map((s) => s.id);
  ctx.joints.push({ id: "drive", type: "drive", at: [0, 0], title: k === "manual" ? "Drive · hand operated" : "Drive · motor", note, badge: [k === "manual" ? "hand operated" : "motorised", "ok"], serves });
  return added;
}
