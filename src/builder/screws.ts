// The screw kit (J11): a screw and its nuts, built from the record's declared joints. The screw is its own shaft (a
// `shaft` shape with a thread, threads or a ball groove): its core turned to the thread's minor diameter, the thread a
// ridge swept along its helix at the lead (D8), its ends turned down to journals in two pillow blocks (J10: one located,
// one floating, F2, F4). A nut (a `nut` shape) is a carriage block with a flanged bronze nut screwed to it, its own
// ridge in the screw's groove, a wiper at each end (F8) and a grease nipple; it is kept from turning by a flag whose fork
// straddles a guide rail beside the screw (F3), with an end stop and a pad past each end of its travel (F5).
import { circle, roundRect, type Vec2 } from "../core/geom";
import { H } from "../hardware/primitives";
import type { Solid } from "../hardware/solid";
import { housingBearing } from "../hardware/sub/housing";
import { v3, xf, type Vec3 } from "../kin/math";
import type { Kin, KinBody } from "../kin/types";
import type { Setup } from "../kin/compose";
import { helixSweep } from "../solids/helix";
import { extrudeOp, segmentsFor } from "../solids/tessellate";
import type { Op, Profile, Solid3 } from "../solids/types";
import type { BuildCtx } from "./ctx";
import { place, type Frame } from "./frames";
import { Local, titleOf } from "./lib";
import type { BodyGeom } from "./shapes";
import type { Rule } from "./rules/types";
import { pillowBlocks } from "./supports";
import { nutRidge, ridgeProfile, threadsOf, type ThreadSpec } from "./threads";
import type { StackResult } from "./stack";

const num = (v: unknown, d: number): number => (typeof v === "number" && Number.isFinite(v) ? v : d);

/** A revolve profile (radius, height) of a stepped core: one radius per axial span, chamfered 0.5 at both ends. */
function coreProfile(spans: { z0: number; z1: number; r: number }[]): Profile {
  const s = [...spans].sort((a, b) => a.z0 - b.z0);
  const c = 0.5;
  const pts: Vec2[] = [[0, s[0]!.z0], [s[0]!.r - c, s[0]!.z0], [s[0]!.r, s[0]!.z0 + c]];
  for (let i = 0; i < s.length; i++) {
    const a = s[i]!;
    const b = s[i + 1];
    if (!b) {
      pts.push([a.r, a.z1 - c], [a.r - c, a.z1], [0, a.z1]);
      break;
    }
    // a plain shank between two threads at the smaller core, stepped at each thread's end
    const m = Math.min(a.r, b.r);
    pts.push([a.r, a.z1], [m, a.z1], [m, b.z0], [b.r, b.z0]);
  }
  return { outer: pts, holes: [] };
}

/** The ridge of a thread on the screw, as a solid frame and sweep in the screw's own frame. */
function ridgeOf(t: ThreadSpec): { profile: Profile; op: Op } {
  return helixSweep({ r: t.minor / 2, lead: t.lead, z0: t.from, z1: t.to, hand: t.hand }, ridgeProfile(t));
}

/**
 * A screw body: the core (the threads' minor diameters over their ranges) as its own part, revolved; each thread's
 * ridge a piece swept along its helix. It stands on its joint's axis, not on a slab, and it is a body of revolution
 * about the axis it turns on (its sweep is a revolve, its samples need no probes).
 */
export function screwGeom(b: KinBody, g: BodyGeom): BodyGeom | null {
  const T = threadsOf(b.shape as Record<string, unknown>);
  if (!T.length) return null;
  const spans = T.map((t) => ({ z0: t.from, z1: t.to, r: t.minor / 2 }));
  const rMax = Math.max(...T.map((t) => t.major / 2));
  const core = coreProfile(spans);
  return {
    ...g,
    profile: { outer: circle(rMax, 0, 0, 36), holes: [] },
    thick: Math.max(...T.map((t) => t.to)) - Math.min(...T.map((t) => t.from)),
    approx: false,
    exact: { offset: 0 },
    axisym: true,
    part: { profile: core, op: { op: "revolve", segments: segmentsFor(rMax) } },
    pieces: T.map((t, k) => {
      const r = ridgeOf(t);
      return { id: `${b.id}-thread${k ? k : ""}`, name: `${t.form === "ball" ? "Ball groove" : `Tr${t.major}x${t.pitch}`} thread, ${t.hand} hand, ${(t.to - t.from).toFixed(0)} long`, frame: { ...g.frame }, profile: r.profile, h: 0, op: r.op };
    }),
  };
}

/**
 * A nut body (`nut` shape: length along the axis, width across, height, the flag's side): the carriage block on the
 * screw's axis, bored for the bronze nut the kit fits. It stands where its joint puts it, centred on it.
 */
export function nutGeom(b: KinBody, g: BodyGeom): BodyGeom | null {
  const sh = (b.shape ?? {}) as Record<string, unknown>;
  if (sh.type !== "nut") return null;
  const L = num(sh.length, 30);
  const W = num(sh.width, 34);
  const Ht = num(sh.height, 34);
  return {
    ...g,
    profile: { outer: roundRect(-Ht / 2, -W / 2, Ht / 2, W / 2, 3), holes: [] },
    thick: L,
    approx: false,
    exact: { offset: -L / 2 },
  };
}

// ------------------------------------------------------------------------------------------------ the kit

interface Nut {
  body: string;
  joint: string;
  t: ThreadSpec;
  /** The nut's frame (its joint's, z the screw's axis). */
  F: Frame;
  L: number;
  W: number;
  Ht: number;
  /** Its axial travel over the cycle, as shifts of its frame along z. */
  d0: number;
  d1: number;
  shape: Record<string, unknown>;
}

const UP: Vec3 = [0, 0, 1];

/** A frame on the axis at w with x the world up made square to the axis (the screw kit's working frame). */
const axisFrame = (F: Frame, w: number): Frame => {
  const z = F.z;
  const k = v3.dot(UP, z);
  const x = v3.unit(v3.sub(UP, v3.mul(z, k)));
  return { o: v3.add(F.o, v3.mul(z, w)), x, z };
};

/** The axial shifts a body makes over the cycle along an axis. */
function travel(ctx: BuildCtx, body: string, axis: Vec3): [number, number] {
  const xs = ctx.sampled.xfs.get(body) ?? [];
  let lo = 0;
  let hi = 0;
  for (const X of xs) {
    const d = v3.dot(X.t, axis);
    lo = Math.min(lo, d);
    hi = Math.max(hi, d);
  }
  return [lo, hi];
}

/** The thread of a screw under an axial position (the one whose range holds it, else the nearest). */
const threadAt = (T: ThreadSpec[], w: number): ThreadSpec => T.find((t) => w >= t.from - 1e-6 && w <= t.to + 1e-6) ?? [...T].sort((a, b) => Math.min(Math.abs(a.from - w), Math.abs(a.to - w)) - Math.min(Math.abs(b.from - w), Math.abs(b.to - w)))[0]!;

/** The bronze nut, its ridge, its flange screws, the wipers and the nipple, on the nut body (J11, F3, F8). */
function buildNut(ctx: BuildCtx, screwF: Frame, n: Nut, out: Solid3[], serves: Record<string, string[]>): string {
  const serve = (f: string, ...ids: string[]) => ((serves[f] ??= []).push(...ids));
  const t = n.t;
  const id = n.body;
  const ball = t.form === "ball";
  // the working frame at the nut's centre: z along the screw, x up
  const w0 = v3.dot(v3.sub(n.F.o, screwF.o), screwF.z);
  const A = axisFrame(screwF, w0);
  const L = new Local(A, { joints: [n.joint] });
  const Dn = ball ? Math.round(t.major + 14) : Math.round(t.major + 8);
  const fl = { D: Dn + 12, t: 4 };
  const z0 = -n.L / 2;
  const z1 = n.L / 2;
  const rBore = ball ? t.major / 2 + 0.2 : t.major / 2 + 0.15;
  const name = ball ? `Ball nut, ${t.major} x ${t.lead}, ${num(n.shape.turns, 3)} loaded turns, preloaded, ${String(n.shape.return ?? "tube")} return` : `Flanged bronze nut Tr${t.major}x${t.pitch}, ${t.hand} hand`;
  // the nut's body in the carriage, its flange on the carriage's face toward the screw's low end
  L.add(H.solid(`${id}-nut`, { name, kind: "bushing", role: "hw", mat: ball ? "Steel 100Cr6, hardened, ground grooves" : "Bronze CuSn12", outer: circle(Dn / 2, 0, 0, 48), holes: [circle(rBore, 0, 0, 48)], z0, z1, body: id }));
  L.add(H.solid(`${id}-nut-flange`, { name: "", kind: "bushing", role: "hw", mat: ball ? "Steel 100Cr6" : "Bronze CuSn12", outer: circle(fl.D / 2, 0, 0, 48), holes: [circle(rBore, 0, 0, 48)], z0: z0 - fl.t, z1: z0, body: id, group: `${id}-nut` }));
  // flange screws into the carriage's face (M13 threadlocked)
  const pcd = (Dn / 2 + fl.D / 2) / 2;
  for (let k = 0; k < 4; k++) {
    const a = Math.PI / 4 + (k * Math.PI) / 2;
    L.add(H.screw(`${id}-fsc${k}`, "socket", 3, fl.t + 8, { body: id, at: [pcd * Math.cos(a), pcd * Math.sin(a), 0], face: z0 - fl.t, dir: 1, ...(k ? { name: "", qty: 0 } : { qty: 4 }) }));
  }
  serve("F3", `${id}-nut`, `${id}-fsc0`);
  // wipers: a felt ring at each end of the nut on the screw's crests (F8)
  for (const [k, a, b] of [[0, z0 - fl.t - 2, z0 - fl.t], [1, z1, z1 + 2]] as const)
    L.add(H.solid(`${id}-wiper${k}`, { name: k ? "" : `Felt wiper ring ${t.major} x ${Dn - 2}, at each end of the nut`, kind: "wiper", role: "hw", mat: "Felt, oil soaked", outer: circle(Dn / 2 - 1, 0, 0, 40), holes: [circle(t.major / 2, 0, 0, 40)], z0: a, z1: b, body: id, ...(k ? { qty: 0 } : { qty: 2 }) }));
  serve("F8", `${id}-wiper0`);
  out.push(...L.out());
  out.push(nutThread(screwF, t, w0 + z0, w0 + z1, id, `${id}-nut-thread`, n.joint));
  // the grease nipple on the carriage's top, feeding the nut (F8)
  const top = n.Ht / 2;
  const Lt = new Local({ o: v3.add(A.o, v3.mul(A.x, top)), x: A.z, z: A.x }, { joints: [n.joint] });
  Lt.add(H.nipple(`${id}-nip`, { body: id, at: [0, 0, 0], z0: 0, z1: 9 }));
  out.push(...Lt.out());
  serve("F8", `${id}-nip`);
  return name;
}

/** A nut's ridge in the screw's groove over [za, zb] of the screw's frame: the screw's helix shifted to it, on `body`. */
function nutThread(screwF: Frame, t: ThreadSpec, za: number, zb: number, body: string, sid: string, joint: string): Solid3 {
  const r = nutRidge(t);
  const s = t.hand === "left" ? -1 : 1;
  // the screw's ridge centre at path angle a lies at z = from + s a lead / 2π; the nut's ridge at that plus the shift
  const phase = s * ((2 * Math.PI * (za - t.from - r.shift)) / t.lead);
  const sw = helixSweep({ r: r.rootR, lead: t.lead, z0: za, z1: zb, hand: t.hand, phase }, r.pts.map(([u, v]): [number, number] => [-u, v]));
  const ball = t.form === "ball";
  const base = place(screwF, H.solid(sid, { name: "", kind: "bushing", role: "hw", mat: ball ? "Steel 100Cr6" : "Bronze CuSn12", outer: [[0, 0], [1, 0], [0, 1]], z0: 0, z1: 1, body, joints: [joint] }))[0]!;
  return { ...base, profile: sw.profile, op: sw.op, frame: { ...screwF } };
}

/**
 * A screw that runs in a nut fixed to the ground (a differential screw's first thread): a pedestal block on the base,
 * screwed and dowelled to it (F1), a flanged bronze nut screwed into it (F3), its ridge in the screw's groove, a felt
 * wiper each end and a grease nipple on top (F8).
 */
function buildFixedNut(ctx: BuildCtx, screwF: Frame, t: ThreadSpec, w0: number, L: number, joint: string, baseTop: number, out: Solid3[], serves: Record<string, string[]>): void {
  const serve = (f: string, ...ids: string[]) => ((serves[f] ??= []).push(...ids));
  const id = `${joint}-nut`;
  const A = axisFrame(screwF, w0);
  const Dn = Math.round(t.major + 8);
  const W = Dn + 16;
  const above = W / 2;
  const below = v3.dot(v3.sub(A.o, [A.o[0], A.o[1], baseTop]), UP);
  const lat = v3.cross(A.z, A.x);
  void lat;
  const P = new Local(A, { joints: [joint] });
  // the pedestal: from the base up past the axis, across the screw, bored for the nut
  P.add(H.plate(`${id}-block`, roundRect(-below, -W / 2, above, W / 2, 2), { body: "ground", kind: "housing", role: "ground", name: `Nut block ${W} x ${L}, screwed and dowelled to the base`, z0: -L / 2, z1: L / 2, holes: [circle(Dn / 2 + 0.05, 0, 0, 48).reverse()], mat: "Cast iron EN-GJL-250" }));
  const fl = { D: Dn + 10, t: 4 };
  P.add(H.solid(`${id}-bronze`, { name: `Flanged bronze nut Tr${t.major}x${t.pitch}, ${t.hand} hand, fixed`, kind: "bushing", role: "hw", mat: "Bronze CuSn12", outer: circle(Dn / 2, 0, 0, 48), holes: [circle(t.major / 2 + 0.15, 0, 0, 48)], z0: -L / 2, z1: L / 2, body: "ground" }));
  P.add(H.solid(`${id}-flange`, { name: "", kind: "bushing", role: "hw", mat: "Bronze CuSn12", outer: circle(fl.D / 2, 0, 0, 48), holes: [circle(t.major / 2 + 0.15, 0, 0, 48)], z0: -L / 2 - fl.t, z1: -L / 2, body: "ground", group: `${id}-bronze` }));
  const pcd = (Dn / 2 + fl.D / 2) / 2;
  for (let k = 0; k < 4; k++) {
    const a = Math.PI / 4 + (k * Math.PI) / 2;
    P.add(H.screw(`${id}-fsc${k}`, "socket", 3, fl.t + 8, { body: "ground", at: [pcd * Math.cos(a), pcd * Math.sin(a), 0], face: -L / 2 - fl.t, dir: 1, ...(k ? { name: "", qty: 0 } : { qty: 4 }) }));
  }
  for (const [k, a, b] of [[0, -L / 2 - fl.t - 2, -L / 2 - fl.t], [1, L / 2, L / 2 + 2]] as const)
    P.add(H.solid(`${id}-wiper${k}`, { name: k ? "" : `Felt wiper ring ${t.major} x ${Dn - 2}, at each end of the nut`, kind: "wiper", role: "hw", mat: "Felt, oil soaked", outer: circle(Dn / 2 - 1, 0, 0, 40), holes: [circle(t.major / 2, 0, 0, 40)], z0: a, z1: b, body: "ground", ...(k ? { qty: 0 } : { qty: 2 }) }));
  out.push(...P.out());
  out.push(nutThread(screwF, t, w0 - L / 2, w0 + L / 2, "ground", `${id}-thread`, joint));
  // screws down into the base and two dowels (F1); a grease nipple on top (F8)
  const S = new Local({ o: [A.o[0], A.o[1], baseTop], x: A.z, z: UP }, { joints: [joint] });
  for (const [k, u] of [[0, -W / 2 + 4], [1, W / 2 - 4]] as const) {
    S.add(H.screw(`${id}-sc${k}`, "socket", 4, 14, { body: "ground", at: [0, u, 0], face: -8, dir: 1, ...(k ? { name: "", qty: 0 } : { qty: 2 }) }));
    S.add(H.dowel(`${id}-dw${k}`, 4, { body: "ground", at: [k ? L / 2 - 4 : -L / 2 + 4, u, 0], z0: -6, z1: 6, ...(k ? { name: "", qty: 0 } : { name: "Dowel pin Ø4 x 12 h6, nut block to base", qty: 2 }) }));
  }
  const Lt = new Local({ o: v3.add(A.o, v3.mul(A.x, above)), x: A.z, z: A.x }, { joints: [joint] });
  Lt.add(H.nipple(`${id}-nip`, { body: "ground", at: [0, 0, 0], z0: 0, z1: 9 }));
  out.push(...S.out(), ...Lt.out());
  serve("F1", `${id}-dw0`);
  serve("F3", `${id}-bronze`, `${id}-fsc0`);
  serve("F8", `${id}-wiper0`, `${id}-nip`);
}

/**
 * The anti-rotation guide (F3): a flag on the carriage's side whose fork straddles a rail beside the screw, bronze pads in
 * its jaws; the rail on two end posts screwed to the base; an end stop with a neoprene pad on the rail past each end of
 * the travel (F5).
 */
function buildGuide(ctx: BuildCtx, screwF: Frame, n: Nut, baseTop: number, out: Solid3[], serves: Record<string, string[]>): void {
  const serve = (f: string, ...ids: string[]) => ((serves[f] ??= []).push(...ids));
  const id = n.body;
  const w0 = v3.dot(v3.sub(n.F.o, screwF.o), screwF.z);
  const flag = (n.shape.flag ?? {}) as Record<string, unknown>;
  const side = num(flag.side, -1) >= 0 ? 1 : -1;
  // the frame: z along the screw, x toward the rail (level, square to the screw), y then up or down
  const z = screwF.z;
  const latW = v3.unit(v3.cross(UP, z));
  const x = v3.mul(latW, side);
  const Fg: Frame = { o: v3.add(screwF.o, v3.mul(z, w0)), x, z };
  const yUp = Math.sign(v3.dot(v3.cross(z, x), UP)) || 1;
  const h = (v: number) => v * yUp;
  const Lr = n.W / 2 + num(flag.gap, 16);
  const rw = 5;
  const rh = 4;
  const jaw = 5;
  const c = 0.2;
  const fw = 16;
  // the flag: an arm from the carriage's side to a fork round the rail (open on the far side), on the nut body
  const armTop = rh + c + 1 + jaw;
  const arm: Vec2[] = [[n.W / 2 - 3, h(-armTop)], [Lr - rw - 2, h(-armTop)], [Lr - rw - 2, h(armTop)], [n.W / 2 - 3, h(armTop)]];
  const jawUp: Vec2[] = [[Lr - rw - 2.5, h(rh + c + 1)], [Lr + rw + 3, h(rh + c + 1)], [Lr + rw + 3, h(armTop)], [Lr - rw - 2.5, h(armTop)]];
  const jawDn: Vec2[] = jawUp.map(([a, b]): Vec2 => [a, -b]);
  const G = new Local(Fg, { joints: [n.joint] });
  const flagMat = "Aluminium 6061-T6, anodised";
  for (const [k, pts] of [[0, arm], [1, jawUp], [2, jawDn]] as const)
    G.add(H.plate(`${id}-flag${k ? `-j${k}` : ""}`, ordered(pts), { body: id, kind: "plate", role: "output", name: k ? "" : "Flag with a fork, keeps the nut from turning", z0: -fw / 2, z1: fw / 2, mat: flagMat, group: `${id}-flag` }));
  // bronze pads in the jaws, bearing on the rail's top and bottom
  for (const [k, s] of [[0, 1], [1, -1]] as const)
    G.add(H.wearStrip(`${id}-pad${k}`, ordered([[Lr - rw - 2, h(s * (rh + c))], [Lr + rw + 2, h(s * (rh + c))], [Lr + rw + 2, h(s * (rh + c + 1))], [Lr - rw - 2, h(s * (rh + c + 1))]]), { body: id, z0: -fw / 2 + 1, z1: fw / 2 - 1, name: k ? "" : "Bronze pad, bears on the guide rail", mat: "Bronze CuSn8", ...(k ? { qty: 0 } : { qty: 2 }) }));
  out.push(...G.out());
  serve("F3", `${id}-flag`, `${id}-pad0`);
  // the rail: past the fork's travel by the stops and the posts, in the screw's frame along z
  const a0 = w0 + n.d0 - fw / 2 - 16;
  const a1 = w0 + n.d1 + fw / 2 + 16;
  const Fr: Frame = { o: screwF.o, x, z };
  const R = new Local(Fr, { joints: [n.joint] });
  R.add(H.plate(`${id}-rail`, ordered([[Lr - rw, h(-rh)], [Lr + rw, h(-rh)], [Lr + rw, h(rh)], [Lr - rw, h(rh)]]), { body: "ground", kind: "plate", role: "ground", name: `Guide rail ${2 * rw} x ${2 * rh} x ${(a1 - a0).toFixed(0)}, ground, keeps the nut from turning`, z0: a0, z1: a1, mat: "Steel C45, ground" }));
  // the end stops with neoprene pads, a fork's half-width past each end of the travel (F5)
  for (const [k, sgn, at] of [[0, -1, w0 + n.d0 - fw / 2 - 1], [1, 1, w0 + n.d1 + fw / 2 + 1]] as const) {
    const s0 = sgn < 0 ? at - 8 : at + 1.5;
    const s1 = sgn < 0 ? at - 1.5 : at + 8;
    R.add(H.stop(`${id}-stop${k}`, ordered([[Lr - rw, h(rh)], [Lr + rw, h(rh)], [Lr + rw, h(rh + 5)], [Lr - rw, h(rh + 5)]]), { body: "ground", z0: s0, z1: s1, name: k ? "" : "End stop on the rail, screwed down", ...(k ? { qty: 0 } : { qty: 2 }) }));
    R.add(H.solid(`${id}-bump${k}`, { name: k ? "" : "Neoprene pad on the end stop", kind: "bumper", role: "hw", mat: "Neoprene 60 Shore A", outer: ordered([[Lr - rw + 1, h(rh + 0.5)], [Lr + rw - 1, h(rh + 0.5)], [Lr + rw - 1, h(rh + 4.5)], [Lr - rw + 1, h(rh + 4.5)]]), z0: sgn < 0 ? at - 1.5 : at, z1: sgn < 0 ? at : at + 1.5, body: "ground", ...(k ? { qty: 0 } : { qty: 2 }) }));
  }
  out.push(...R.out());
  serve("F5", `${id}-stop0`, `${id}-stop1`);
  // two posts carry the rail's ends on the base, the rail screwed down into each
  const railBot = screwF.o[2] - rh;
  for (const [k, a] of [[0, a0 + 5], [1, a1 - 5]] as const) {
    const P = v3.add(v3.add(screwF.o, v3.mul(z, a)), v3.mul(x, Lr));
    const S = new Local({ o: [P[0], P[1], baseTop], x: z, z: UP }, { joints: [n.joint] });
    const top = railBot - baseTop;
    S.add(H.plate(`${id}-post${k}`, roundRect(-5, -rw - 1, 5, rw + 1, 1.5), { body: "ground", kind: "bracket", role: "ground", name: k ? "" : "Rail post, screwed and dowelled to the base", z0: 0, z1: top, mat: "Aluminium 6061-T6, anodised", ...(k ? { qty: 0 } : { qty: 2 }) }));
    S.add(H.screw(`${id}-psc${k}`, "csk", 3, 2 * rh + 8, { body: "ground", at: [0, 0, 0], face: top + 2 * rh, dir: -1, ...(k ? { name: "", qty: 0 } : { qty: 2 }) }));
    S.add(H.screw(`${id}-pbs${k}`, "socket", 4, 10, { body: "ground", at: [0, 0, 0], face: -8, dir: 1, ...(k ? { name: "", qty: 0 } : { qty: 2 }) }));
    out.push(...S.out());
  }
  serve("F1", `${id}-post0`);
}

/** A ring counter-clockwise. */
function ordered(p: Vec2[]): Vec2[] {
  let a = 0;
  for (let i = 0; i < p.length; i++) {
    const q = p[i]!;
    const r = p[(i + 1) % p.length]!;
    a += q[0] * r[1] - r[0] * q[1];
  }
  return a < 0 ? [...p].reverse() : p;
}

/** The screws of a record: bodies with a threaded shaft shape. */
export function screwBodies(kin: Kin): string[] {
  return kin.bodies.filter((b) => threadsOf(b.shape as Record<string, unknown>).length > 0).map((b) => b.id);
}

export const j11: Rule = {
  id: "j11-screw",
  tier: "AUTO",
  ids: ["J11", "J10", "F2", "F3", "F4", "F5", "F8"],
  fixture: "lead-screw",
  applies: (ctx) => screwBodies(ctx.kin).length > 0,
  apply(ctx) {
    for (const sb of screwBodies(ctx.kin)) buildScrew(ctx, sb);
  },
};

function buildScrew(ctx: BuildCtx, sb: string): void {
  const g = ctx.geoms.get(sb);
  const body = ctx.kin.bodies.find((b) => b.id === sb)!;
  if (!g) return;
  const T = threadsOf(body.shape as Record<string, unknown>);
  const F: Frame = { o: g.frame.o, x: g.frame.x, z: g.frame.z };
  const out: Solid3[] = [];
  const serves: Record<string, string[]> = {};
  // the nuts: bodies the screw drives through a screw joint (not the ground's fixed nut)
  const nuts: Nut[] = [];
  for (const j of ctx.kin.joints) {
    if (j.type !== "screw" || j.a !== sb || j.b === "ground") continue;
    const nb = ctx.kin.bodies.find((b) => b.id === j.b);
    const ng = ctx.geoms.get(j.b);
    if (!nb || !ng) continue;
    const sh = (nb.shape ?? {}) as Record<string, unknown>;
    const at = ctx.S.joints.get(j.id)!.at;
    const w = v3.dot(v3.sub(at, F.o), F.z);
    const [d0, d1] = travel(ctx, j.b, F.z);
    nuts.push({ body: j.b, joint: j.id, t: threadAt(T, w), F: { o: ng.frame.o, x: ng.frame.x, z: F.z }, L: num(sh.length, 30), W: num(sh.width, 34), Ht: num(sh.height, 34), d0, d1, shape: sh });
  }
  const baseTop = ctx.base?.top ?? 0;
  // the carriages: bored for their nuts
  for (const n of nuts) {
    const part = ctx.parts.get(n.body);
    const ball = n.t.form === "ball";
    const Dn = ball ? Math.round(n.t.major + 14) : Math.round(n.t.major + 8);
    if (part) part.profile.holes.push(circle(Dn / 2 + 0.05, 0, 0, 48).reverse());
  }
  const nutServes = nuts.map(() => ({}) as Record<string, string[]>);
  const guideServes = nuts.map(() => ({}) as Record<string, string[]>);
  const names = nuts.map((n, i) => buildNut(ctx, F, n, out, nutServes[i]!));
  nuts.forEach((n, i) => buildGuide(ctx, F, n, baseTop, out, guideServes[i]!));
  // the nuts and guides first: the pillow blocks are routed clear of the rail's posts as well as the sweeps
  ctx.add(out.splice(0));
  // the screw's supports: a live screw in two pillow blocks past what it carries
  const ground = ctx.kin.joints.find((j) => (j.a === "ground" && j.b === sb) || (j.b === "ground" && j.a === sb));
  const site = ctx.sites.find((s) => s.bodies.includes(sb) && s.fixed);
  const lo = Math.min(...T.map((t) => t.from), ...nuts.map((n) => v3.dot(v3.sub(n.F.o, F.o), F.z) + n.d0 - n.L / 2 - 6));
  const hi = Math.max(...T.map((t) => t.to), ...nuts.map((n) => v3.dot(v3.sub(n.F.o, F.o), F.z) + n.d1 + n.L / 2 + 2));
  const journal = num((body.shape as Record<string, unknown>).journal, 8);
  let end: StackResult["end"];
  let support: StackResult["support"] = "pillow";
  if (ground?.type === "revolute" && site) {
    const pb = pillowBlocks(ctx, { id: `${site.id}-pb`, frame: F, d: journal, live: true, lo, hi, baseTop, joints: site.joints });
    out.push(...pb.solids);
    const zLow = Math.min(...pb.w) - 20 - 18;
    const zHigh = Math.max(...pb.w) + 12;
    const t0 = T[0]!;
    const tN = T[T.length - 1]!;
    const Lj = new Local(F, { joints: site.joints });
    Lj.add(H.shaft(`${sb}-journal0`, { d: journal, z0: zLow, z1: t0.from, keyway: [zLow, zLow + 16] }, { body: sb, name: `Screw journal Ø${journal}, keyed for the drive pulley` }));
    Lj.add(H.shaft(`${sb}-journal1`, { d: journal, z0: tN.to, z1: zHigh }, { body: sb, name: "" }));
    out.push(...Lj.out());
    end = { at: v3.add(F.o, v3.mul(F.z, zLow)), out: v3.mul(F.z, -1), body: sb };
    ctx.routes.push({ support: `${site.id}-pb`, site: site.id, kind: "pillow", tried: pb.tried, moved: pb.moved, covers: pb.covers, gap: pb.gap });
    for (const [f, ids] of Object.entries(pb.serves)) if (f !== "_span") (serves[f] ??= []).push(...ids);
    ctx.stacks.set(site.id, { solids: [], d: journal, fit: { d: journal, bearing: [housingBearing(journal)] }, support, bores: [], w0: zLow, w1: zHigh, serves, notes: [], end });
    ctx.note({
      id: site.id,
      kit: "J10",
      at: site.at,
      title: `J10 · ${titleOf(site.id)}`,
      note: `${titleOf(site.id)}: the screw is its own shaft, its ends turned to Ø${journal} journals in two pillow blocks past the nut's travel, located in the block at the drive end and floating in the other (J11, J10).`,
      badge: ["both ends held", "ok"],
      d: journal,
      serves,
    });
  }
  // a screw that runs in a nut of the ground's (a differential screw): the fixed nut on its pedestal, and a knurled knob
  // on the free end, since the screw advances through its nut and a belt could not follow it (V5)
  const fixed = ctx.kin.joints.filter((j) => j.type === "screw" && j.a === "ground" && j.b === sb);
  for (const j of fixed) {
    const w = v3.dot(v3.sub(ctx.S.joints.get(j.id)!.at, F.o), F.z);
    const gsh = (ctx.kin.bodies.find((b) => b.id === "ground")?.shape ?? {}) as Record<string, unknown>;
    const L = num((gsh.nut as Record<string, unknown> | undefined)?.length, 30);
    const fs: Record<string, string[]> = {};
    buildFixedNut(ctx, F, threadAt(T, w), w, L, j.id, baseTop, out, fs);
    ctx.note({ id: j.id, kit: "J11", at: ctx.S.joints.get(j.id)!.at, title: `J11 · ${titleOf(j.id)}`, note: `${titleOf(j.id)}: the screw runs in a flanged bronze nut fixed in a pedestal block screwed and dowelled to the base (F1, F3), so each turn advances the screw itself by its lead; a felt wiper at each end and a grease nipple (F8).`, badge: ["screw carried by the fixed nut", "ok"], serves: fs });
  }
  const knob = (body.shape as Record<string, unknown>).knob as Record<string, unknown> | undefined;
  if (fixed.length && knob) {
    const D = num(knob.diameter, 30);
    const at = num(knob.at, T[0]!.from - 15);
    const t0 = T[0]!;
    const K = new Local(F, { joints: fixed.map((j) => j.id) });
    const jd = Math.round(t0.minor - 2);
    K.add(H.shaft(`${sb}-journal0`, { d: jd, z0: at - 2, z1: t0.from }, { body: sb, name: `Screw end Ø${jd}, the knob pinned on it` }));
    const kn: Vec2[] = [];
    const N = 36;
    for (let k = 0; k < N; k++) {
      const a = (2 * Math.PI * k) / N;
      const r = D / 2 - (k % 2 ? 0.8 : 0);
      kn.push([r * Math.cos(a), r * Math.sin(a)]);
    }
    K.add(H.solid(`${sb}-knob`, { name: `Knurled knob Ø${D} x 14, taper-pinned to the screw, index line on its face`, kind: "part", role: "driver", mat: "Aluminium 6061-T6, knurled", outer: kn, holes: [circle(jd / 2 + 0.02, 0, 0, 32)], z0: at - 14, z1: at, body: sb, marks: [{ kind: "index", pts: [[D / 2 - 6, 0], [D / 2 - 1.5, 0]] }] }));
    K.add(H.dowel(`${sb}-knob-pin`, 3, { body: sb, at: [0, 0, 0], z0: at - 9, z1: at - 5, name: "Taper pin Ø3, knob to screw" }));
    const ks = K.out();
    // the knob's own solid turns about the screw's axis: its frame starts at the screw's
    for (const q of ks) if (q.id === `${sb}-knob`) q.flags.accent = true;
    out.push(...ks);
  }
  void support;
  ctx.add(out);
  for (const n of nuts) {
    const i = nuts.indexOf(n);
    ctx.note({ id: n.joint, kit: "J11", at: ctx.S.joints.get(n.joint)!.at, title: `J11 · ${titleOf(n.joint)}`, note: `${titleOf(n.joint)}: ${names[i]} screwed to the carriage by its flange, its ridge in the screw's groove; a felt wiper at each end and a grease nipple on the carriage (F8).`, badge: ["nut carried by the screw's flanks", "ok"], serves: nutServes[i]! });
    const guide = ctx.kin.joints.find((j) => j.type === "prismatic" && (j.a === n.body || j.b === n.body));
    if (guide)
      ctx.note({ id: guide.id, kit: "J11", at: ctx.S.joints.get(guide.id)!.at, title: `J11 · ${titleOf(guide.id)}`, note: `${titleOf(guide.id)}: the nut's flag straddles a ground rail beside the screw with bronze pads in its fork, so the nut cannot turn and only slides (F3); an end stop with a neoprene pad on the rail past each end of the travel (F5); the rail on two posts screwed to the base (F1).`, badge: ["anti-rotation by the rail", "ok"], serves: guideServes[i]! });
  }
  (ctx.fired["j11-screw"] ??= []).push(sb);
}

export type { Solid, Setup };
