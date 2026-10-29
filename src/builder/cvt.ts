// A belt CVT (J12, a variator): two shafts in plan, each with a fixed sheave half keyed to it and a movable half that
// slides along it on a feather key, so the V between them closes and opens and the belt rides out or in. The input's
// movable half is set by a shift fork in its hub's groove, on a carriage that slides on a rail on the base and is clamped
// where the ratio control sets it, a scale engraved beside it (F7); the output's movable half is pushed closed by a spring
// against a collar, so the belt's tension opens it as the input closes (F6). The movable halves sit on opposite sides, so
// the belt runs in line at every ratio. The push belt's elements are conveyed round a loop whose radii follow the ratio
// (D9, a live path). Each shaft runs in two pillow blocks past everything it carries (J10).
import { circle, roundRect, type Vec2 } from "../core/geom";
import { H } from "../hardware/primitives";
import { housingBearing } from "../hardware/sub/housing";
import { v3, type Vec3 } from "../kin/math";
import type { Setup } from "../kin/compose";
import type { Kin, KinBody, KinJoint } from "../kin/types";
import { sheaveShift, variatorR2 } from "../kin/blocks/members";
import { along, beltLoop, pathLength, type ConveyPath } from "../solids/convey";
import type { Profile, Solid3 } from "../solids/types";
import type { BuildCtx } from "./ctx";
import type { Frame } from "./frames";
import { Local, titleOf } from "./lib";
import type { BodyGeom } from "./shapes";
import type { Rule } from "./rules/types";
import type { StackResult } from "./stack";
import { pillowBlocks } from "./supports";

const num = (v: unknown, d: number): number => (typeof v === "number" && Number.isFinite(v) ? v : d);
const UP: Vec3 = [0, 0, 1];
const D2R = Math.PI / 180;

/** A sheave half: a body whose shape is a pulley with `sheave` (fixed or movable). */
export const isSheave = (b: KinBody | undefined): boolean => !!b && (b.shape as Record<string, unknown> | undefined)?.sheave !== undefined;

/** The variator's belt joint. */
const cvtBelt = (kin: Kin): KinJoint | undefined => kin.joints.find((j) => j.type === "belt" && (j as unknown as Record<string, unknown>).flexible === "cvt");

interface Wheel {
  fixed: string;
  movable: string;
  slide: string;
  joint: string;
  /** Pitch radius at which the solids are built. */
  rb: number;
}

/** Evaluate a record number: a literal or a param name. */
const val = (S: Setup, v: unknown, d: number): number => (typeof v === "number" ? v : typeof v === "string" && S.params.has(v) ? S.params.get(v)! : d);

/** Both wheels of the variator, fixed and movable halves, and the radii they are built at. */
function wheelsOf(kin: Kin, S: Setup): { wheels: Wheel[]; alpha: number; rmin: number; w: number } | null {
  const j = cvtBelt(kin);
  if (!j) return null;
  const jr = j as unknown as Record<string, unknown>;
  const r1 = val(S, j.radiusA, 30);
  const r2 = variatorR2(r1, val(S, jr.C, 150), val(S, jr.pitchLength, 580));
  const out: Wheel[] = [];
  for (const [fixed, rb] of [[j.a, r1], [j.b, r2]] as const) {
    const slide = kin.joints.find((q) => q.type === "prismatic" && (q.a === fixed || q.b === fixed) && isSheave(kin.bodies.find((b) => b.id === (q.a === fixed ? q.b : q.a))));
    const rev = kin.joints.find((q) => q.type === "revolute" && (q.a === fixed || q.b === fixed) && (q.a === "ground" || q.b === "ground"));
    if (!slide || !rev) return null;
    out.push({ fixed, movable: slide.a === fixed ? slide.b : slide.a, slide: slide.id, joint: rev.id, rb });
  }
  const sh = (kin.bodies.find((b) => b.id === j.a)!.shape ?? {}) as Record<string, unknown>;
  return { wheels: out, alpha: val(S, sh.halfAngle, 11) * D2R, rmin: val(S, (kin.params ?? []).find((p) => p.id === "rmin")?.id, 25), w: num(jr.width, 24) / 2 };
}

/** The sizes of a sheave half, in its frame (z along the shaft, 0 the groove's centre as built). */
export function halfSizes(sh: Record<string, unknown>, rb: number, alpha: number, w: number) {
  const R = num(sh.diameter, 132) / 2;
  const rs = num(sh.shaft ?? sh.spline, 20) / 2;
  const t = Math.tan(alpha);
  const rh = rs + 7;
  const face = (rho: number) => w + (rho - rb) * t;
  const back = face(R) + 3;
  const movable = sh.sheave === "movable";
  // the hub: a short keyed boss on the fixed half, a long sleeve on the movable one (the fork's groove, the spring's seat)
  const hubR = rs + 14;
  const hubL = movable ? (sh.shift ? 30 : 20) : 12;
  return { R, rs, rh, t, face, back, hubR, hubL, movable };
}

/** A sheave half's revolved section (x the radius, y along its axis), on the side `side` of the groove. */
function halfProfile(sh: Record<string, unknown>, rb: number, alpha: number, w: number): Profile {
  const s = halfSizes(sh, rb, alpha, w);
  const end = s.back + s.hubL;
  const pts: Vec2[] = [[s.rs, s.face(s.rh)], [s.rh, s.face(s.rh)], [s.R, s.face(s.R)], [s.R, s.back], [s.hubR, s.back]];
  if (sh.shift) {
    // the fork's groove near the sleeve's end
    pts.push([s.hubR, end - 10], [s.hubR - 3, end - 10], [s.hubR - 3, end - 4], [s.hubR, end - 4]);
  }
  pts.push([s.hubR, end], [s.rs, end]);
  const side = num(sh.side, 1) < 0 ? -1 : 1;
  const ring = pts.map(([x, y]): Vec2 => [x, side * y]);
  return { outer: side < 0 ? ring.reverse() : ring, holes: [] };
}

/**
 * The geometry of a sheave half: revolved about its shaft, standing where its joint puts it (exact), its footprint the
 * rim's disc. Null for any other body.
 */
export function sheaveGeom(kin: Kin, S: Setup, b: KinBody, g: BodyGeom): BodyGeom | null {
  if (!isSheave(b)) return null;
  const W = wheelsOf(kin, S);
  const wh = W?.wheels.find((q) => q.fixed === b.id || q.movable === b.id);
  if (!W || !wh) return null;
  const sh = b.shape as Record<string, unknown>;
  const s = halfSizes(sh, wh.rb, W.alpha, W.w);
  return {
    ...g,
    profile: { outer: circle(s.R, 0, 0, 72), holes: [] },
    thick: s.back + s.hubL,
    approx: false,
    exact: { offset: 0 },
    part: { profile: halfProfile(sh, wh.rb, W.alpha, W.w), op: { op: "revolve", segments: 96 } },
  };
}

/** The shift fork's geometry: a half ring in its sleeve's groove (the arm and carriage are built with the kit). */
export function forkGeom(kin: Kin, S: Setup, b: KinBody, g: BodyGeom): BodyGeom | null {
  const sh = (b.shape ?? {}) as Record<string, unknown>;
  if (sh.type !== "fork") return null;
  const target = kin.bodies.find((q) => q.id === sh.groove);
  const W = wheelsOf(kin, S);
  const wh = W?.wheels.find((q) => q.movable === target?.id);
  if (!target || !W || !wh) return null;
  const s = halfSizes(target.shape as Record<string, unknown>, wh.rb, W.alpha, W.w);
  const side = num((target.shape as Record<string, unknown>).side, 1) < 0 ? -1 : 1;
  // the groove's place along the shaft, in the fork's frame (its origin on the shaft's axis)
  const end = s.back + s.hubL;
  const gz = side * (end - 7) - v3.dot(v3.sub(g.frame.o, S.joints.get(wh.slide)!.at), g.frame.z);
  const ring = forkRing(s.hubR - 3 + 0.4, s.hubR + 9);
  return { ...g, profile: { outer: ring, holes: [] }, thick: 5, approx: false, exact: { offset: gz - 2.5 } };
}

/** The fork's half ring under the shaft (x up in its frame: 180° is straight down), with a stub of its arm. */
function forkRing(r0: number, r1: number): Vec2[] {
  const out: Vec2[] = [];
  const a0 = 115 * D2R;
  const a1 = 245 * D2R;
  for (let k = 0; k <= 26; k++) {
    const a = a0 + ((a1 - a0) * k) / 26;
    out.push([r1 * Math.cos(a), r1 * Math.sin(a)]);
  }
  for (let k = 26; k >= 0; k--) {
    const a = a0 + ((a1 - a0) * k) / 26;
    out.push([r0 * Math.cos(a), r0 * Math.sin(a)]);
  }
  return out;
}

const travelOf = (ctx: BuildCtx, joint: string): [number, number] => {
  const j = ctx.kin.joints.find((q) => q.id === joint);
  const l = (j?.limits as [number, number] | undefined) ?? [0, 0];
  return [Math.min(l[0], l[1]), Math.max(l[0], l[1])];
};

function buildCvt(ctx: BuildCtx): void {
  const W = wheelsOf(ctx.kin, ctx.S);
  const bj = cvtBelt(ctx.kin);
  if (!W || !bj || !ctx.base) return;
  const baseTop = ctx.base.top;
  const out: Solid3[] = [];
  W.wheels.forEach((wh, k) => {
    const g = ctx.geoms.get(wh.fixed);
    const gm = ctx.geoms.get(wh.movable);
    const site = ctx.sites.find((s) => s.bodies.includes(wh.fixed) && s.fixed);
    if (!g || !gm || !site) return;
    const F: Frame = { o: g.frame.o, x: g.frame.x, z: g.frame.z };
    const shF = ctx.kin.bodies.find((b) => b.id === wh.fixed)!.shape as Record<string, unknown>;
    const shM = ctx.kin.bodies.find((b) => b.id === wh.movable)!.shape as Record<string, unknown>;
    const sF = halfSizes(shF, wh.rb, W.alpha, W.w);
    const sM = halfSizes(shM, wh.rb, W.alpha, W.w);
    const sideF = num(shF.side, 1) < 0 ? -1 : 1;
    const sideM = -sideF;
    // the movable half's travel along the shaft: the slide runs along its axis, which closes it
    const [t0, t1] = travelOf(ctx, wh.slide);
    const close = v3.dot(ctx.S.joints.get(wh.slide)!.axis, F.z) > 0 ? 1 : -1;
    const mv = [close * t0, close * t1];
    const endM = sideM * (sM.back + sM.hubL);
    const endF = sideF * (sF.back + sF.hubL);
    const ext: number[] = [endF, sideF * sF.face(sF.rh), endM + Math.min(...mv), endM + Math.max(...mv)];
    // the output's spring and its collar past the movable sleeve
    const spring = !!shM.spring;
    const springL = 36;
    if (spring) ext.push(sideM * (sM.back + springL + 4));
    const lo = Math.min(...ext);
    const hi = Math.max(...ext);
    const d = 2 * sF.rs;
    const pb = pillowBlocks(ctx, { id: `${site.id}-pb`, frame: F, d, live: true, lo, hi, baseTop, joints: site.joints });
    out.push(...pb.solids);
    const zLow = pb.shaft[0] - (k === 0 ? 24 : 0);
    const zHigh = pb.shaft[1];
    const L = new Local(F, { joints: site.joints });
    L.add(H.shaft(`${wh.fixed}-shaft`, { d, z0: pb.shaft[0], z1: zHigh, keyway: [Math.min(...ext), Math.max(...ext)] }, { body: wh.fixed, name: `${k ? "Output" : "Input"} shaft Ø${d}, keyed for its fixed half, a long keyway for the sliding half` }));
    // the drive end: a Ø12 journal past the first block, keyed for the drive's pulley
    const dj = 12;
    if (zLow < pb.shaft[0]) L.add(H.shaft(`${wh.fixed}-journal`, { d: dj, z0: zLow, z1: pb.shaft[0], keyway: [zLow, zLow + 14] }, { body: wh.fixed, name: `Drive journal Ø${dj}, keyed for the drive pulley` }));
    // the fixed half's key, and the sliding key the movable half runs on (its sleeve keywayed through)
    const kz0 = sideF > 0 ? sF.face(sF.rh) : -(sF.back + sF.hubL);
    const kz1 = sideF > 0 ? sF.back + sF.hubL : -sF.face(sF.rh);
    L.add(H.solid(`${wh.fixed}-key`, { name: `Feather key 6 x 6, the fixed half to its shaft`, kind: "key", role: "hw", mat: "Steel C45, bright", outer: roundRect(sF.rs - 3.2, -3, sF.rs + 2.6, 3, 1), z0: kz0 + 1, z1: kz1 - 1, body: wh.fixed }));
    const sz0 = Math.min(endM + Math.min(...mv), sideM * sM.face(sM.rh) + Math.min(...mv));
    const sz1 = Math.max(endM + Math.max(...mv), sideM * sM.face(sM.rh) + Math.max(...mv));
    L.add(H.solid(`${wh.movable}-key`, { name: "Sliding feather key 6 x 6, screwed into the shaft: the movable half slides on it", kind: "key", role: "hw", mat: "Steel C45, bright", outer: roundRect(sF.rs - 3.2, -3, sF.rs + 2.6, 3, 1), z0: sz0 + 1, z1: sz1 - 1, body: wh.fixed }));
    out.push(...L.out());
    // the movable half's keyway, through its bore
    const mp = ctx.parts.get(wh.movable);
    if (mp) {
      // the key stands along the shaft frame's x: the same direction in the movable half's own frame
      const my = v3.cross(mp.frame.z, mp.frame.x);
      const kx: Vec3 = [v3.dot(F.x, mp.frame.x), v3.dot(F.x, my), 0];
      mp.features = [{ mode: "cut", profile: { outer: roundRect(sM.rs - 4, -3.3, sM.rs + 2.9, 3.3, 0.5), holes: [] }, op: { op: "extrude", h: 2 * (sM.back + sM.hubL) + 40, steps: 1 }, frame: { o: [0, 0, -(sM.back + sM.hubL) - 20], x: kx, z: [0, 0, 1] } }];
    }
    // the spring: a coil round the sleeve from the movable half's back to a collar pinned on the shaft (F6)
    if (spring) {
      const pa = ctx.S.refPts.get("sp1");
      const pbp = ctx.S.refPts.get("sp2");
      if (pa && pbp) {
        // its turns stretched between the movable half's back and the collar (D9): each a ring of wire at its place along
        // the spring, built at unit length with the wire's axial size divided by the built length, so it is round there
        const x = v3.unit(v3.sub(pbp, pa));
        const L0 = v3.dist(pa, pbp);
        const turns = 7;
        const Rm = sM.hubR + 4;
        const wr = 1.5;
        const ell = Array.from({ length: 14 }, (_, i): Vec2 => [(wr / L0) * Math.cos((i * Math.PI) / 7), wr * Math.sin((i * Math.PI) / 7)]);
        for (let k = 0; k < turns; k++) {
          const f = (wr + 0.4 + ((L0 - 2 * wr - 0.8) * k) / (turns - 1)) / L0;
          const path: Vec3[] = Array.from({ length: 36 }, (_, i): Vec3 => {
            const a = Math.PI / 2 + (i * 2 * Math.PI) / 36;
            return [f, Rm * Math.cos(a), Rm * Math.sin(a)];
          });
          out.push({ id: `${wh.movable}-spring${k}`, name: k ? "" : `Compression spring, wire Ø${2 * wr}, ${turns} turns round the sleeve: pushes the output's movable half closed`, role: "hw", kind: "spring", body: wh.movable, frame: { o: pa, x, z: v3.unit(v3.cross(x, [1, 0, 0])) }, profile: { outer: ell, holes: [] }, op: { op: "sweep", path, closed: true }, marks: [], ex: 0, joints: [wh.slide], detail: "never", flags: {}, mat: "Spring steel EN 10270-1", stretch: ["sp1", "sp2"], group: `${wh.movable}-spring` });
        }
        const cz = v3.dot(v3.sub(pbp, F.o), F.z);
        const C = new Local(F, { joints: [wh.slide] });
        C.add(H.collar(`${wh.movable}-collar`, d, d + 16, { body: wh.fixed, z0: Math.min(cz, cz + sideM * 6), z1: Math.max(cz, cz + sideM * 6), name: "Spring collar, pinned to the shaft" }));
        out.push(...C.out());
      }
    }
    // the drive end: past the input's first block
    const end: StackResult["end"] = { at: v3.add(F.o, v3.mul(F.z, zLow)), out: v3.mul(F.z, -1), body: wh.fixed };
    ctx.routes.push({ support: `${site.id}-pb`, site: site.id, kind: "pillow", tried: pb.tried, moved: pb.moved, covers: pb.covers, gap: pb.gap });
    const serves: Record<string, string[]> = {};
    for (const [f, ids] of Object.entries(pb.serves)) if (f !== "_span") (serves[f] ??= []).push(...ids);
    (serves.F3 ??= []).push(`${wh.fixed}-key`, `${wh.movable}-key`);
    ctx.stacks.set(site.id, { solids: [], d: k === 0 ? 12 : d, fit: { d, bearing: [housingBearing(d)] }, support: "pillow", bores: [], w0: zLow, w1: zHigh, serves, notes: [], end });
    ctx.note({
      id: site.id,
      kit: "J10",
      at: site.at,
      title: `J10 · ${titleOf(site.id)}`,
      note: `${titleOf(site.id)}: the shaft runs in two pillow blocks past both sheave halves and the movable half's whole travel; the fixed half keyed to it, the movable half sliding on a feather key screwed into a long keyway${spring ? ", pushed closed by a spring against a collar pinned to the shaft" : ""}.`,
      badge: ["both ends held", "ok"],
      d,
      serves,
    });
    void gm;
  });
  ctx.add(out.splice(0));
  buildShifter(ctx, W);
  buildElements(ctx, bj, W);
  ctx.note({
    id: bj.id,
    kit: "J12",
    at: ctx.S.joints.get(bj.id)!.at,
    title: `J12 · ${titleOf(bj.id)}`,
    note: `${titleOf(bj.id)}: a steel push belt between two pairs of conical sheave halves (half-angle ${(W.alpha / D2R).toFixed(0)}°). Closing the input's V by the shift fork pushes the belt out to a larger radius; the belt's length is fixed, so it is pulled in on the output, whose movable half opens against its spring. The movable halves sit on opposite sides, so the belt stays in line.`,
    badge: ["belt length held", "ok"],
    serves: { F6: [`${W.wheels[1]!.movable}-spring0`], F7: ["shifter-clamp"] },
  });
}

/** The shift fork's arm and carriage: the carriage slides on a rail on the base and is clamped where it is set (F7). */
function buildShifter(ctx: BuildCtx, W: { wheels: Wheel[]; alpha: number; w: number }): void {
  const fb = ctx.kin.bodies.find((b) => (b.shape as Record<string, unknown> | undefined)?.type === "fork");
  const g = fb ? ctx.geoms.get(fb.id) : undefined;
  const part = fb ? ctx.parts.get(fb.id) : undefined;
  const sj = ctx.kin.joints.find((q) => q.type === "prismatic" && (q.a === fb?.id || q.b === fb?.id));
  if (!fb || !g || !part || !sj || !ctx.base) return;
  const body = fb.id;
  const bt = ctx.base.top;
  // the fork's plane: its part's frame; x up, z along the shaft
  const F: Frame = part.frame;
  const fz0 = 0;
  const fz1 = part.op.op === "extrude" ? part.op.h : 5;
  const ax = F.z;
  const down = v3.mul(F.x, -1);
  const height = v3.dot(F.o, UP) - bt;
  const rail = { h: 8, w: 12 };
  const carTop = bt + rail.h + 7;
  // the arm: from the fork's ring down to the carriage
  const rOut = Math.max(...part.profile.outer.map(([x, y]) => Math.hypot(x, y)));
  const armTop = -(rOut - 4);
  const armBot = -(v3.dot(F.o, UP) - carTop);
  const L = new Local(F, { joints: [sj.id] });
  L.add(H.solid(`${body}-arm`, { name: "Fork arm, down to its carriage", kind: "part", role: "link", mat: "Steel C45", outer: roundRect(armBot, -6, armTop, 6, 2), z0: fz0, z1: fz1, body, group: body }));
  // the carriage: a block over the rail, its cheeks either side (plan: x across, y along the shaft)
  const o = v3.add(F.o, v3.mul(down, height - (carTop - bt)));
  const P = new Local({ o: [o[0], o[1], 0], x: v3.unit(v3.cross(ax, UP)), z: UP }, { joints: [sj.id] });
  const along = 18;
  const zc = v3.dot(v3.sub(v3.add(F.o, v3.mul(ax, (fz0 + fz1) / 2)), [o[0], o[1], 0]), ax);
  const cy0 = zc - along / 2;
  const cy1 = zc + along / 2;
  P.add(H.solid(`${body}-carriage`, { name: "Shift carriage, over the rail", kind: "part", role: "link", mat: "Steel C45", outer: roundRect(-14, cy0, 14, cy1, 2), z0: bt + rail.h + 0.3, z1: carTop, body, group: body }));
  for (const [k, s] of [[0, -1], [1, 1]] as const) P.add(H.solid(`${body}-cheek${k}`, { name: "", kind: "part", role: "link", mat: "Steel C45", outer: roundRect(s < 0 ? -14 : rail.w / 2 + 0.3, cy0, s < 0 ? -rail.w / 2 - 0.3 : 14, cy1, 1), z0: bt + 0.6, z1: bt + rail.h + 0.3, body, group: body }));
  P.add(H.screw(`${body}-clamp`, "socket", 5, 12, { body, at: [0, (cy0 + cy1) / 2, 0], face: carTop, dir: -1, name: "Clamp screw M5, locks the carriage on the rail at its setting (F7)" }));
  // the rail along the shaft, screwed and dowelled to the base
  const [t0, t1] = travelOf(ctx, sj.id);
  const sgn = v3.dot(ctx.S.joints.get(sj.id)!.axis, ax) > 0 ? 1 : -1;
  // the rail runs only under the carriage's travel (the sheave's rim passes over its near end, moving with the carriage)
  const ry0a = Math.min(cy0 + sgn * t0, cy0 + sgn * t1) - 0.5;
  const ry1 = Math.max(cy1 + sgn * t0, cy1 + sgn * t1) + 8;
  // and starts past the farthest the movable half's rim reaches toward it (its most open setting)
  const wm = W.wheels[0]!;
  const shm = ctx.kin.bodies.find((b) => b.id === wm.movable)!.shape as Record<string, unknown>;
  const sm = halfSizes(shm, wm.rb, W.alpha, W.w);
  const sideMv = num(shm.side, 1) < 0 ? -1 : 1;
  const sl = ctx.S.joints.get(wm.slide)!;
  const reach = Math.max(...travelOf(ctx, wm.slide).map((t) => v3.dot(v3.sub(v3.add(v3.add(sl.at, v3.mul(ax, sideMv * sm.back)), v3.mul(sl.axis, t)), [o[0], o[1], 0]), ax)));
  const ry0 = Math.max(ry0a, reach + 1);
  P.add(H.plate(`${body}-rail`, roundRect(-rail.w / 2, ry0, rail.w / 2, ry1, 1), { kind: "plate", role: "ground", name: "Shift rail, screwed and dowelled to the base", z0: bt, z1: bt + rail.h, mat: "Steel C45, ground" }));
  for (const [k, y] of [[0, ry0 + 5], [1, ry1 - 5]] as const) P.add(H.dowel(`${body}-rd${k}`, 3, { at: [0, y, 0], z0: bt - 5, z1: bt + rail.h - 1, ...(k ? { name: "", qty: 0 } : { name: "Dowel pin Ø3 h6, rail to base", qty: 2 }) }));
  ctx.add([...L.out(), ...P.out()]);
  // the scale beside the rail: a tick where the carriage's edge stands for each 5 mm of r1
  const wh = W.wheels[0]!;
  const sh = ctx.kin.bodies.find((b) => b.id === wh.movable)!.shape as Record<string, unknown>;
  const p = ctx.kin.params?.find((q) => q.id === "r1");
  const alpha = (typeof sh.halfAngle === "string" ? (ctx.S.params.get(sh.halfAngle) ?? 11) : num(sh.halfAngle, 11)) * D2R;
  const rmin = ctx.S.params.get("rmin") ?? 25;
  if (p && p.min !== undefined && p.max !== undefined) {
    const side = v3.unit(v3.cross(ax, UP));
    for (let r = Math.ceil(p.min / 5) * 5; r <= p.max + 1e-6; r += 5) {
      const dz = sheaveShift(r, rmin, alpha) - sheaveShift(wh.rb, rmin, alpha);
      const y = cy0 + sgn * dz;
      const a = v3.add(v3.add([o[0], o[1], 0], v3.mul(ax, y)), v3.mul(side, 17));
      const b = v3.add(a, v3.mul(side, r % 10 === 0 ? 7 : 4));
      ctx.baseMarks.push({ kind: "scale", pts: [[a[0], a[1]], [b[0], b[1]]] });
    }
  }
  ctx.note({ id: sj.id, kit: "J5", at: ctx.S.joints.get(sj.id)!.at, title: `J5 · ${titleOf(sj.id)}`, note: `${titleOf(sj.id)}: the shift fork rides in the input's movable sleeve's groove; its carriage slides on a rail screwed and dowelled to the base and is locked by a clamp screw where the ratio is set (F7); a scale on the base beside the rail reads r1 every 5 mm.`, badge: ["ratio set and clamped", "ok"], serves: { F7: [`${body}-clamp`], F1: [`${body}-rd0`] } });
}

/** The push belt's elements: blocks with flanks at the sheaves' angle, conveyed round a loop whose radii are live. */
function buildElements(ctx: BuildCtx, j: KinJoint, W: { wheels: Wheel[]; alpha: number; w: number }): void {
  const step = ctx.kin.solve.find((s) => s.block === "variator");
  const outs = (step?.out ?? {}) as Record<string, string>;
  if (!outs.travel || !outs.r1 || !outs.r2) {
    ctx.issues.push(`${j.id}: the variator names no travel, r1 or r2 output: the belt's elements are not built`);
    return;
  }
  const o1 = ctx.S.joints.get(W.wheels[0]!.joint)!;
  const o2 = ctx.S.joints.get(W.wheels[1]!.joint)!;
  const axis = o1.axis;
  const n = 72;
  const pts = beltLoop(o1.at, o2.at, axis, W.wheels[0]!.rb, W.wheels[1]!.rb, n);
  const path: ConveyPath = { pts, key: outs.travel, carrier: "ground", up: axis, live: { c1: o1.at, c2: o2.at, axis, r1: outs.r1, r2: outs.r2, ...(outs.offset ? { offset: outs.offset } : {}), n } };
  const Lp = pathLength(path);
  const N = num((j as unknown as Record<string, unknown>).elements, 150);
  const sp = Lp / N;
  const th = Math.min(2.6, sp - 1);
  const t = Math.tan(W.alpha);
  const hw = (x: number) => W.w + x * t - 0.3;
  const prof: Vec2[] = [[-6, -hw(-6)], [3, -hw(3)], [3, hw(3)], [-6, hw(-6)]];
  const mid = v3.mul(v3.add(o1.at, o2.at), 0.5);
  const out: Solid3[] = [];
  for (let k = 0; k < N; k++) {
    const s0 = k * sp;
    const q = along(path, s0);
    let nr = v3.unit(v3.cross(q.t, axis));
    if (v3.dot(nr, v3.sub(q.o, mid)) < 0) nr = v3.mul(nr, -1);
    out.push({ id: `${j.id}-el${k}`, name: k ? "" : `Belt element, steel, flanks at ${(W.alpha / D2R).toFixed(0)}°: ${N} in the belt, pushed round in compression`, role: "hw", kind: "plate", body: "ground", frame: { o: v3.sub(q.o, v3.mul(q.t, th / 2)), x: nr, z: q.t }, profile: { outer: prof, holes: [] }, op: { op: "extrude", h: th, steps: 1 }, marks: [], ex: 0, joints: [j.id], detail: "never", flags: {}, mat: "Steel, hardened", convey: { path, s0 }, group: `${j.id}-belt` });
  }
  ctx.add(out);
}

export const cvt: Rule = {
  id: "j12-cvt",
  tier: "AUTO",
  ids: ["J12", "J10", "D9", "F6", "F7"],
  fixture: "cvt-belt",
  applies: (ctx) => !!cvtBelt(ctx.kin),
  apply(ctx) {
    buildCvt(ctx);
  },
};

void UP;
