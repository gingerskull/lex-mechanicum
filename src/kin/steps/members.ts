// Blocks of the flexible and compliant members and the continuous drives: a screw and its nuts, a conveyor or chain, a
// flexure (and a bistable snap), a block and tackle, a belt variator and a ball-and-disc integrator.
import type { BlockFn, BlockCtx } from "../ctx";
import type { SolveStep } from "../types";
import { D2R, TAU, type Vec3, type Xf, m3, v3, xf, R2D } from "../math";
import { chainAdvance, chainSpeed, chainTurn, differentialAdvance, flexureEnd, pathAt, pathLength, reeve, screwAdvance, sheaveShift, variatorR2, vonMises } from "../blocks/members";
import { outVal, spin, str } from "./shared";

/**
 * screw. in: joint (a `screw` joint: lead, hand; a the shaft, b the nut), input (the shaft's angle about the joint's axis,
 * deg), nut (body; default the joint's b), hand (optional: the name of a design choice whose value "opposite" flips the
 * joint's hand, a differential screw's hand switch), lead2 (a second lead for a differential screw: the second nut `nut2`
 * advances (lead − lead2) per turn), balls ({ ratio, r }: a ball nut's balls, the ball
 * centres' share of the turn and their circle's radius; their travel along the circuit is out.balls, mm).
 * The nut does not turn (its guide holds it), so it turns by −Δθ relative to the shaft and, by the helical law, moves
 * hand · lead · (−Δθ) / 2π along the axis relative to the shaft, plus whatever the shaft itself has advanced (a screw
 * running in a fixed nut of its own). A right-hand screw turned positively about +axis drives its nut toward −axis.
 */
const screwBlock: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const jid = str(i.joint, "screw.joint");
  const j = c.joint(jid);
  const d = c.delta("in", c.rad(i.input));
  const axis = c.jointAxis(jid);
  const at = c.jointAt(jid);
  const lead = c.num(j.lead);
  let hand = j.hand ?? "right";
  if (typeof i.hand === "string") {
    if (c.design(i.hand) === "opposite") hand = hand === "right" ? "left" : "right";
  }
  const shaft = (i.shaft as string | undefined) ?? j.a;
  const own = shaft !== "ground" && c.has(shaft) ? v3.dot(v3.sub(xf.apply(c.xf(shaft), at), at), axis) : 0;
  const adv = own + screwAdvance(lead, -d, hand);
  c.setXf((i.nut as string | undefined) ?? j.b, xf.trans(v3.mul(axis, adv)));
  outVal(c, s, adv, "advance");
  // a ball nut's balls roll between the turning and the still groove: relative to the nut each ball centre turns at
  // `ratio` of the screw's turn, on its helix of radius `r`; their travel along the circuit (mm) for the conveyed balls
  const balls = i.balls as { ratio?: unknown; r?: unknown } | undefined;
  if (balls) outVal(c, s, c.num(balls.ratio ?? 0.5) * d * Math.hypot(c.num(balls.r), lead / (2 * Math.PI)), "balls");
  if (i.lead2 !== undefined && typeof i.nut2 === "string") {
    const a2 = differentialAdvance(lead, c.num(i.lead2), d) * (j.hand === "left" ? -1 : 1);
    c.setXf(i.nut2, xf.trans(v3.mul(axis, a2)));
    outVal(c, s, a2, "advance2");
  }
};

/**
 * convey. in: joint (a `belt` joint: radiusA of the driving pulley, radiusB, crossed), input (driving pulley angle,
 * deg), C and r (obround path: centre distance and pitch radius), items [{ body, s }] (arc length of each at the
 * reference), origin and rot (the path's plane in the world, xy by default), driven (body, centre point).
 * out {angle}: the driven pulley's angle (deg).
 */
const conveyBlock: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const jid = str(i.joint, "convey.joint");
  const j = c.joint(jid);
  const d = c.delta("in", c.rad(i.input));
  if (i.mode === "chain") {
    // a roller chain on the sprockets' pitch polygons (chordal action): the joint gives za, zb, pitch and the seated
    // rollers' phases (deg); the travel is the chain's advance, the driven sprocket turns to take it up
    const jr = j as unknown as Record<string, unknown>;
    const za = c.num(j.za), zb = c.num(j.zb), p = c.num(jr.pitch);
    const pa = c.num(jr.phaseA ?? 0) * D2R, pb = c.num(jr.phaseB ?? 0) * D2R;
    const t = chainAdvance(d, za, p, pa) - chainAdvance(0, za, p, pa);
    const dB = chainTurn(chainAdvance(0, zb, p, pb) + t, zb, p, pb);
    if (typeof i.driven === "string") spin(c, i.driven, c.vec(i.drivenCenter ?? j.at), c.jointAxis(jid), dB);
    outVal(c, s, dB * R2D, "angle");
    outVal(c, s, t, "travel");
    outVal(c, s, chainSpeed(d, za, pa), "speed");
    return;
  }
  const ra = c.num(j.radiusA);
  const rb = c.num(j.radiusB ?? j.radiusA);
  const path = { C: c.num(i.C), r: c.num(i.r) };
  const travel = ra * d;
  const G: Xf = { R: m3.eulerDeg(i.rot ? c.vec(i.rot) : [0, 0, 0]), t: i.origin ? c.vec(i.origin) : [0, 0, 0] };
  const items = (i.items as { body: string; s: unknown }[] | undefined) ?? [];
  void pathLength;
  for (const it of items) {
    const s0 = c.num(it.s);
    const p0 = pathAt(path, s0);
    const p1 = pathAt(path, s0 + travel);
    const local = xf.mul(xf.trans([p1.x - p0.x, p1.y - p0.y, 0]), xf.rotAbout([p0.x, p0.y, 0], [0, 0, 1], p1.heading - p0.heading));
    c.setXf(it.body, xf.mul(G, xf.mul(local, xf.inv(G))));
  }
  const dB = (j.crossed ? -1 : 1) * (ra / rb) * d;
  if (typeof i.driven === "string") spin(c, i.driven, c.vec(i.drivenCenter ?? j.at), c.jointAxis(jid), dB);
  outVal(c, s, dB * R2D, "angle");
  outVal(c, s, travel, "travel");
};

/**
 * flexure. in: joint (a `flexure` joint at the pseudo-rigid-body pivot), input (the pivot angle Θ, deg), beam (the rigid
 * link, body), l (beam length), thetaMax (deg). out {bend, end}: Θ over Θmax, and the free end's distance along the beam.
 */
const flexureBlock: BlockFn = (c, s) => {
  const i = s.in ?? {};
  if (i.mode === "snap") return snapBlock(c, s);
  const jid = str(i.joint, "flexure.joint");
  const th = c.rad(i.input);
  const d = c.delta("in", th);
  const beam = (i.beam as string | undefined) ?? c.joint(jid).b;
  spin(c, beam, c.jointAt(jid), c.jointAxis(jid), d);
  const e = flexureEnd(c.num(i.l), th, i.thetaMax !== undefined ? c.num(i.thetaMax) * D2R : undefined);
  outVal(c, s, e.bend, "bend");
  outVal(c, s, e.a, "end");
};

/**
 * flexure, mode "snap": a bistable shuttle held by two inclined beams (vonMises in blocks/members) and driven by a
 * pusher through springs. in: drive (the pusher's driver value, mm), q0 (the pusher's place at drive 0; default the
 * stable rest L0 sin θ0), dir (+1 or −1: the pusher's place moves dir · drive), L0, theta0 (deg), ka, ks, span (deg of
 * the cycle the snap takes, so a fold is not a jump, K2), shuttle (body), axis (its slide), beams [{ a, b, anchor, tip }]
 * (each beam's two pseudo-rigid halves, its anchor joint and its joint on the shuttle). On the way out (the drive rising,
 * the first half of the cycle) the shuttle stays on its first branch until the pusher passes the fold, then crosses to the
 * other over `span`; on the way back the same, mirrored. out { y, bend }: the shuttle's place and the beams' turn (deg).
 */
function snapBlock(c: BlockCtx, s: SolveStep): void {
  const i = s.in ?? {};
  const vm = vonMises({ L0: c.num(i.L0), theta0: c.num(i.theta0) * D2R, ka: c.num(i.ka), ks: c.num(i.ks) });
  const dir = i.dir !== undefined ? c.num(i.dir) : 1;
  const q0 = i.q0 !== undefined ? c.num(i.q0) : vm.rest;
  const drive = c.num(i.drive);
  const q = q0 + dir * drive;
  const span = c.num(i.span ?? 8) * D2R;
  const u = ((c.u % TAU) + TAU) % TAU;
  // the side the shuttle starts on is the one its rest is on; the pusher's place at each phase of the driver's cosine law
  const start: 1 | -1 = q0 >= 0 ? 1 : -1;
  const qAt = (x: number): number => q0 + dir * driveAt(c, str(i.drive, "flexure.drive"), x);
  let y: number;
  const blend = (t: number) => t * t * (3 - 2 * t);
  const out = u <= Math.PI;
  const from: 1 | -1 = out ? start : (-start as 1 | -1);
  // the fold on this half: the branch `from` ends where q passes from · qFold toward the other side
  const fold = from * vm.qFold;
  const beyond = (qq: number) => (from > 0 ? qq < fold : qq > fold);
  // the phase of the fold on this half (bisection on the cosine law, which is monotonic in each half)
  let us = NaN;
  {
    let lo = out ? 0 : Math.PI;
    let hi = out ? Math.PI : TAU;
    if (beyond(qAt(hi)) && !beyond(qAt(lo))) {
      for (let k = 0; k < 60; k++) {
        const m = (lo + hi) / 2;
        if (beyond(qAt(m))) hi = m;
        else lo = m;
      }
      us = (lo + hi) / 2;
    }
  }
  if (c.u === 0 || !Number.isFinite(us) || u < us) y = vm.solve(beyond(q) ? fold : q, from);
  else if (u < us + span) {
    const t = blend((u - us) / span);
    y = (1 - t) * vm.solve(fold, from) + t * vm.solve(q, (-from) as 1 | -1);
  } else y = vm.solve(q, (-from) as 1 | -1);
  const dy = c.delta("y", y);
  const axis = v3.unit(c.vec(i.axis ?? [0, 1, 0]));
  if (typeof i.shuttle === "string") c.setXf(i.shuttle, xf.trans(v3.mul(axis, dy)));
  let bend = 0;
  for (const b of (i.beams as { a: string; b: string; anchor: string; tip: string }[] | undefined) ?? []) {
    const A = c.jointAt(b.anchor);
    const T0 = c.jointAt(b.tip);
    const T = v3.add(T0, v3.mul(axis, dy));
    const n = c.jointAxis(b.anchor);
    const ang = (p: Vec3) => Math.atan2(v3.dot(n, v3.cross([1, 0, 0], v3.sub(p, A))), v3.dot([1, 0, 0], v3.sub(p, A)));
    let dphi = ang(T) - ang(T0);
    while (dphi > Math.PI) dphi -= TAU;
    while (dphi < -Math.PI) dphi += TAU;
    c.setXf(b.a, xf.rotAbout(A, n, dphi));
    c.setXf(b.b, xf.mul(xf.trans(v3.sub(T, T0)), xf.rotAbout(T0, n, dphi)));
    bend = dphi * R2D;
  }
  outVal(c, s, y, "y");
  outVal(c, s, bend, "bend");
}

/** A driver's value at cycle phase x by its own law (the oscillating and linear cosine law, lo at 0). */
function driveAt(c: BlockCtx, id: string, x: number): number {
  const d = c.driver(id);
  if (!d) return 0;
  const lo = d.lo ?? d.range?.[0] ?? 0;
  const hi = d.hi ?? d.range?.[1] ?? 0;
  return lo + (hi - lo) * (0.5 - 0.5 * Math.cos(x));
}

/**
 * reeve (a block and tackle). in: fall (the driver: the fall hauled, mm), D0 (pin spacing at no haul), DX (the lower pin's
 * offset across the load line, the fleet), slanted (parts at the fleet; the first part is vertical), block (the lower
 * block, body), axis (its rise), sheaves [{ body, center (joint or point), k }] (k the slanted parts the rope has run
 * before reaching the sheave: the turn is (rise + k · shortening) / RP), RP (rope pitch radius), turn axis (default +z).
 * out { rise }: the block's rise (mm).
 */
const reeveBlock: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const r = reeve({ D0: c.num(i.D0), DX: c.num(i.DX), slanted: c.num(i.slanted ?? 3) });
  const h = c.num(i.fall);
  const D = r.spacing(h);
  const rise = c.num(i.D0) - D;
  const slant = r.slant(D);
  const dRise = c.delta("rise", rise);
  const dSlant = c.delta("slant", slant);
  const ax = v3.unit(c.vec(i.axis ?? [0, 1, 0]));
  if (typeof i.block === "string") c.setXf(i.block, xf.trans(v3.mul(ax, dRise)));
  const n = v3.unit(c.vec(i.turnAxis ?? [0, 0, 1]));
  const RP = c.num(i.RP);
  for (const sh of (i.sheaves as { body: string; center: string; k: number; moving?: boolean }[] | undefined) ?? []) {
    const ang = (dRise + sh.k * dSlant) / RP;
    const ctr = c.refVec(sh.center);
    const turn = xf.rotAbout(ctr, n, ang);
    c.setXf(sh.body, sh.moving ? xf.mul(xf.trans(v3.mul(ax, dRise)), turn) : turn);
  }
  outVal(c, s, rise, "rise");
};

/**
 * variator (a belt CVT). in: r1 (wheel 1's pitch radius, the ratio setting), built (the r1 the solids are built at), C,
 * length (the belt's pitch length), alpha (sheave half-angle, deg), rmin (pitch radius at a sheave's open stop), input
 * (wheel 1's angle, deg); wheels [{ fixed, movable, joint (the shaft's revolute), slide (the movable half's prismatic
 * joint, its axis the closing direction) }, same for wheel 2]; shifter (optional: a body that carries wheel 1's shift).
 * Wheel 2's radius keeps the belt's length; each movable half sits closed by its shift from the open stop; wheel 2 turns
 * r1/r2 times wheel 1; the belt advances r1 per radian. out { r1, r2, shift1, shift2, angle, travel, offset }: offset is the
 * belt plane's move along wheel 1's axis from where it is built (half of each sheave's move, averaged).
 */
const variatorBlock: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const C = c.num(i.C);
  const L = c.num(i.length);
  const al = c.rad(i.alpha);
  const rmin = c.num(i.rmin);
  const r1 = c.num(i.r1);
  const r2 = variatorR2(r1, C, L);
  const rb1 = c.num(i.built ?? i.r1);
  const rb2 = variatorR2(rb1, C, L);
  const sh = [sheaveShift(r1, rmin, al), sheaveShift(r2, rmin, al)];
  const d = [sheaveShift(r1, rmin, al) - sheaveShift(rb1, rmin, al), sheaveShift(r2, rmin, al) - sheaveShift(rb2, rmin, al)];
  const dA = c.delta("in", c.rad(i.input));
  const turns = [dA, (r1 / r2) * dA];
  const wheels = (i.wheels as { fixed: string; movable: string; joint: string; slide: string }[] | undefined) ?? [];
  const ax0 = wheels[0] ? c.jointAxis(wheels[0].joint) : ([0, 0, 1] as Vec3);
  let off = 0;
  wheels.forEach((w, k) => {
    const at = c.jointAt(w.joint);
    const ax = c.jointAxis(w.joint);
    const R = xf.rotAbout(at, ax, turns[k]!);
    c.setXf(w.fixed, R);
    const close = c.jointAxis(w.slide);
    c.setXf(w.movable, xf.mul(xf.trans(v3.mul(close, d[k]!)), R));
    off += (d[k]! / 2) * v3.dot(close, ax0);
  });
  if (typeof i.shifter === "string" && wheels[0]) c.setXf(i.shifter, xf.trans(v3.mul(c.jointAxis(wheels[0].slide), d[0]!)));
  outVal(c, s, r1, "r1");
  outVal(c, s, r2, "r2");
  outVal(c, s, sh[0]!, "shift1");
  outVal(c, s, sh[1]!, "shift2");
  outVal(c, s, turns[1]! * R2D, "angle");
  outVal(c, s, r1 * dA, "travel");
  outVal(c, s, off / 2, "offset");
};

/**
 * integrator (a ball-and-disc integrator). in: disc and x (drivers: the disc's angle, deg, and the ball's radius on it, mm,
 * the carriage's travel), rc (the output cylinder's radius), rb (the ball's), ball (body) and centre (the joint at its
 * centre, on the carriage), spinAxis (the ball's spin axis: the carriage's travel), cylinder (body) and cylJoint (its
 * ground revolute). The ball rolls on the disc at radius x and drives the cylinder: θc = (1/rc) ∫ x dθd over the
 * drivers' laws from the reference to this phase, so it holds for any setting of either.
 * out { angle, spin }: the cylinder's and the ball's turns (deg).
 */
/**
 * ∫ x dθd from the reference to phase u (θd in radians): in closed form for a rotary disc and a carriage held or on its
 * cosine law (each checked against the drivers' values), else by Simpson's rule.
 */
function integral(c: BlockCtx, dId: string, xId: string, u: number): number {
  const dd = c.driver(dId);
  const dx = c.driver(xId);
  const a = (c.driverAt(dId, 1) - c.driverAt(dId, 0)) * D2R;
  const x0 = c.driverAt(xId, 0.3);
  const x1 = c.driverAt(xId, 1.1);
  if (dd?.kind === "rotary" && dx && Math.abs(c.driverAt(dId, 2) - c.driverAt(dId, 0) - 2 * (a / D2R)) < 1e-9) {
    if (Math.abs(x1 - x0) < 1e-12 && Math.abs(c.driverAt(xId, 2.7) - x0) < 1e-12) return a * x0 * u;
    if (dx.kind === "linear" || dx.kind === "oscillating") {
      const lo = dx.lo ?? dx.range?.[0] ?? 0;
      const hi = dx.hi ?? dx.range?.[1] ?? 0;
      const sp = dx.speed ?? 1;
      const ph = (dx.phase ?? 0) * D2R;
      const m = (lo + hi) / 2;
      const A = (hi - lo) / 2;
      const law = (v: number) => m - A * Math.cos(sp * v + ph);
      if (Math.abs(law(0.3) - x0) < 1e-9 && Math.abs(law(1.1) - x1) < 1e-9) return a * (m * u - (A / sp) * (Math.sin(sp * u + ph) - Math.sin(ph)));
    }
  }
  const n = 2 * Math.max(1, Math.ceil((Math.abs(u) / TAU) * 200));
  const h = u / n;
  const th = (v: number) => c.driverAt(dId, v) * D2R;
  const f = (v: number) => c.driverAt(xId, v) * ((th(v + 1e-5) - th(v - 1e-5)) / 2e-5);
  let sum = f(0) + f(u);
  for (let k = 1; k < n; k++) sum += (k % 2 ? 4 : 2) * f(k * h);
  return (sum * h) / 3;
}

const integratorBlock: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const dId = str(i.disc, "integrator.disc");
  const xId = str(i.x, "integrator.x");
  const rc = c.num(i.rc);
  const rb = c.num(i.rb);
  const u = c.u;
  const theta = u === 0 ? 0 : integral(c, dId, xId, u) / rc;
  const dTheta = c.delta("theta", theta);
  const phi = (dTheta * rc) / rb;
  const cj = str(i.cylJoint, "integrator.cylJoint");
  if (typeof i.cylinder === "string") c.setXf(i.cylinder, xf.rotAbout(c.jointAt(cj), c.jointAxis(cj), dTheta));
  if (typeof i.ball === "string" && typeof i.centre === "string") {
    const ref = c.refVec(i.centre);
    const now = c.vec(i.centre);
    c.setXf(i.ball, xf.mul(xf.trans(v3.sub(now, ref)), xf.rotAbout(ref, v3.unit(c.vec(i.spinAxis ?? [0, 1, 0])), phi)));
  }
  outVal(c, s, dTheta * R2D, "angle");
  outVal(c, s, phi * R2D, "spin");
};

export const MEMBER_BLOCKS: Record<string, BlockFn> = {
  screw: screwBlock,
  convey: conveyBlock,
  flexure: flexureBlock,
  reeve: reeveBlock,
  variator: variatorBlock,
  integrator: integratorBlock,
};
