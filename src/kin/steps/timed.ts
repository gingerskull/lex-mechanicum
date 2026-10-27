// Timed and intermittent blocks: a star wheel and its jumper, a lever ratchet, a one-way clutch, the escapements (in a
// plane, verge and crown wheel, and the oscillator-phase escapement) and the indexers (Geneva, mutilated gear, cam).
import type { BlockFn } from "../ctx";
import { D2R, TAU, type Vec3, v3, xf, R2D } from "../math";
import { lawRise } from "../blocks/cam";
import { simKey, simulated } from "../sims";
import { genevaAngle, genevaInternalAngle, ratchetWheel, rideAngle, sawOutline, simulateEscape, simulateEscapement, simulateStar, simulateVerge, type VergeSpec, type EscapementSpec, type RatchetSpec, type StarSpec } from "../blocks/timed";
import { lawOf, outVal, spin, str } from "./shared";

/**
 * star (a star wheel driven by a finger, held and snapped by a jumper): in: input (the driver's angle, deg), driver (its
 * ground joint), star and jumper (bodies), starJoint and jumperJoint (their ground revolutes), n, tip, root, tip0 (deg,
 * a tip's angle at rest), rf (finger radius), pin (its contact radius), finger0 (deg, the finger's angle at rest), arm,
 * roller, swing ([deg, deg] the arm's range about its pivot), snap (deg of driver). The star turns clockwise (seen from
 * +z) by ψ; the jumper rides it. out {star, push, jumper}: ψ (deg), the finger's push alone (deg), the jumper's turn (deg,
 * counter-clockwise).
 */
const starBlock: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const O = c.jointAt(str(i.driver, "star.driver"));
  const sj = str(i.starJoint, "star.starJoint");
  const jj = str(i.jumperJoint, "star.jumperJoint");
  const C = c.jointAt(sj);
  const J = c.jointAt(jj);
  const spec: StarSpec = {
    n: c.num(i.n), tip: c.num(i.tip), root: c.num(i.root), tip0: c.num(i.tip0),
    c: [C[0] - O[0], C[1] - O[1]], rf: c.num(i.rf), pin: c.num(i.pin), finger0: c.num(i.finger0),
    jumper: [J[0] - O[0], J[1] - O[1]], swing: (i.swing as number[]).map((v) => c.num(v)) as [number, number],
    arm: c.num(i.arm), roller: c.num(i.roller), snap: c.num(i.snap),
  };
  const sim = simulated(simKey("star", spec), () => simulateStar(spec));
  const th = c.delta("in", c.num(i.input));
  const x = ((((th % 360) + 360) % 360) / sim.step);
  const k = Math.min(sim.star.length - 2, Math.floor(x));
  const f = x - k;
  const lerp = (t: Float64Array) => t[k]! + (t[k + 1]! - t[k]!) * f;
  const turns = Math.floor(th / 360);
  const pitch = 360 / spec.n;
  const psi = lerp(sim.star) + turns * pitch;
  const jum = lerp(sim.jumper);
  spin(c, str(i.star, "star.star"), C, [0, 0, 1], -psi * D2R);
  spin(c, str(i.jumper, "star.jumper"), J, [0, 0, 1], jum * D2R);
  outVal(c, s, psi, "star");
  outVal(c, s, lerp(sim.push), "push");
  outVal(c, s, jum, "jumper");
};

/**
 * ratchet (a lever ratchet with a driving pawl on the lever and a holding pawl on the ground): in: input (the lever's
 * angle, deg, an oscillating driver from `lo`), lo, lost (deg of lost motion before the pawl meets a face), wheel (body),
 * wheelJoint, the sawtooth (n, root, tip, face, back, tip0: see blocks/timed sawOutline), pawls ([{ body, joint (its
 * pivot), tip (a point at its tip at rest), carrier (the body its pivot rides, "ground" or the lever), carrierJoint,
 * swing (deg either side of its line at rest) }]). The wheel steps one pitch per forward stroke; each pawl rides the teeth
 * where its spring holds it. out {wheel}: the wheel's turn (deg).
 */
const ratchetBlock: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const spec: RatchetSpec = { n: c.num(i.n), root: c.num(i.root), tip: c.num(i.tip), face: c.num(i.face), back: c.num(i.back), tip0: c.num(i.tip0) };
  const W = c.jointAt(str(i.wheelJoint, "ratchet.wheelJoint"));
  const lever = c.num(i.input);
  const lo = c.num(i.lo);
  const pitch = 360 / spec.n;
  // the driver's own phase (deg): the cycle may start part way through the stroke
  const ph = c.num(i.phase ?? 0) * D2R;
  const turn = (u: number, lv: number) => ratchetWheel(u + ph, lv, lo, c.num(i.lost), pitch) - ratchetWheel(ph, lo, lo, c.num(i.lost), pitch);
  const w = c.delta("wheel", turn(c.u, lever) * D2R);
  spin(c, str(i.wheel, "ratchet.wheel"), W, [0, 0, 1], w);
  outVal(c, s, w * R2D, "wheel");
  const local = (p: Vec3): [number, number] => [p[0] - W[0], p[1] - W[1]];
  for (const pw of (i.pawls as Record<string, unknown>[] | undefined) ?? []) {
    const body = str(pw.body, "ratchet.pawls.body");
    const jp = str(pw.joint, "ratchet.pawls.joint");
    const P0 = c.jointAt(jp);
    const T0 = c.refPt(str(pw.tip, "ratchet.pawls.tip"));
    const arm = Math.hypot(T0[0] - P0[0], T0[1] - P0[1]);
    const line0 = Math.atan2(T0[1] - P0[1], T0[0] - P0[0]);
    const carrier = (pw.carrier as string | undefined) ?? "ground";
    const Xc = carrier === "ground" ? xf.id() : c.xf(carrier);
    const P = xf.apply(Xc, P0);
    const cTurn = carrier === "ground" ? 0 : xf.angleAbout(Xc, [0, 0, 1]);
    const sw = c.num(pw.swing ?? 25);
    const ride = (ww: number, pv: [number, number], base: number) => rideAngle(sawOutline(spec, ww), pv, arm, 0, [(base - sw * D2R) * R2D, (base + sw * D2R) * R2D], [0, 0]);
    const a = ride(w, local(P), line0 + cTurn);
    // the record's tip point is where the tip rests at the reference, so the reference pose is the identity
    c.setXf(body, xf.mul(xf.rotAbout(P, [0, 0, 1], a - line0 - cTurn), Xc));
  }
};

/**
 * one-way (a freewheel, a sprag clutch): the output follows the input 1:1 while the input turns forward and stays while
 * it turns back, so an oscillating input steps it. in: input (an oscillating driver, deg, from `lo`; its cycle runs
 * forward for the first half), lo, stroke (its travel, deg), phase (the driver's, deg), output (body), joint (its ground revolute), carried
 * (bodies that turn with the output: a sprag set), thrust ([a, b]: two points whose line, against the radius at a,
 * gives the grip angle). out {angle, grip}: the output's turn and the grip angle (deg).
 */
const oneWay: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const lo = c.num(i.lo ?? 0);
  const ph = c.num(i.phase ?? 0) * D2R;
  const lv = c.num(i.input);
  // the forward half follows the input; the return holds; `stroke` (deg) is the input's travel per half cycle
  const span = (u: number, v: number) => {
    const turns = Math.floor((u + ph) / TAU);
    const w = u + ph - turns * TAU;
    return w < Math.PI ? turns * c.num(i.stroke ?? 0) + (v - lo) : (turns + 1) * c.num(i.stroke ?? 0);
  };
  const d = c.delta("out", span(c.u, lv) * D2R);
  const jid = str(i.joint, "one-way.joint");
  const O = c.jointAt(jid);
  const ax = c.jointAxis(jid);
  for (const b of [str(i.output, "one-way.output"), ...((i.carried as string[] | undefined) ?? [])]) spin(c, b, O, ax, d);
  outVal(c, s, d * R2D, "angle");
  const th = i.thrust as string[] | undefined;
  if (th && th.length === 2) {
    const X = c.xf(str(i.output, "one-way.output"));
    const a = xf.apply(X, c.refPt(th[0]!));
    const b = xf.apply(X, c.refPt(th[1]!));
    // in the plane square to the axis
    const t = v3.perp(v3.sub(b, a), ax);
    const r = v3.perp(v3.sub(a, O), ax);
    outVal(c, s, Math.acos(Math.min(1, Math.abs(v3.dot(t, r)) / (v3.len(t) * v3.len(r)))) * R2D, "grip");
  }
};

/**
 * escape (a geometric escapement in a plane: anchor, lever): the pallets swing with the oscillating driver of their arbor
 * (`lo` to `hi` deg over the cycle, `default` at the reference); the escape wheel, urged forward by its train, goes on
 * until a tooth meets a pallet and is pushed back where a pallet moves into a tooth (blocks/timed simulateEscape).
 * in: input (the pallets' angle, deg), lo, hi, default, wheel (body), wheelJoint, palletJoint, plane ("xz" or "xy": the
 * escapement's plane, its 2D axes), sense (+1: the wheel goes forward counter-clockwise in the plane), the wheel's teeth
 * (n, tip, root, lead and back: the tip's two roots, deg from the tip, positive ahead), tip0 (deg), pallets (outlines,
 * [u, v] in the plane relative to the arbor at the reference); `fork` (a balance driving a lever: see below) with
 * `pallets_body` (the lever) and `rate` (a speed limit on the wheel). out {advance, recoil, pallet}: the wheel's turn
 * since the cycle's start, the recoil of the current beat, the lever's angle (deg).
 */
const escapeBlock: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const E = c.jointAt(str(i.wheelJoint, "escape.wheelJoint"));
  const Aj = str(i.palletJoint, "escape.palletJoint");
  const A = c.jointAt(Aj);
  const plane = (i.plane as string | undefined) ?? "xy";
  const P2 = (p: Vec3): [number, number] => (plane === "xz" ? [p[0], p[2]] : [p[0], p[1]]);
  const n = c.num(i.n);
  const D = Math.PI / 180;
  const tip0 = c.num(i.tip0 ?? 0);
  const wc = P2(E);
  const wheel: [number, number][] = [];
  // a tooth: the record's polygon (in the wheel's plane, its tip at angle 0), else a pointed tip with its two roots
  const tooth = i.tooth as number[][] | undefined;
  for (let k = 0; k < n; k++) {
    const a = (tip0 + (360 / n) * k) * D;
    if (tooth) {
      for (const q of tooth) wheel.push([wc[0] + q[0]! * Math.cos(a) - q[1]! * Math.sin(a), wc[1] + q[0]! * Math.sin(a) + q[1]! * Math.cos(a)]);
      continue;
    }
    for (const [r, b] of [[c.num(i.root), a + c.num(i.lead) * D], [c.num(i.tip), a], [c.num(i.root), a + c.num(i.back) * D]] as const) wheel.push([wc[0] + r * Math.cos(b), wc[1] + r * Math.sin(b)]);
  }
  const ac = P2(A);
  const pallets = ((i.pallets as number[][][] | undefined) ?? []).map((pl) => pl.map((q): [number, number] => [ac[0] + q[0]!, ac[1] + q[1]!]));
  const lo = c.num(i.lo);
  const hi = c.num(i.hi);
  const def = c.num(i.default ?? 0);
  const sense = (c.num(i.sense ?? 1) >= 0 ? 1 : -1) as 1 | -1;
  const spec = { wheel, wc, pallets, ac, n, sense };
  // the pallets' angle (rad, from the reference) at cycle phase u: the driver's own swing, or, with a `fork` (a lever's
  // fork on a balance's impulse pin: { joint (the balance's), roller, reach (lever pivot to fork), window (deg) }), the
  // lever following the pin while the balance is within the window and resting on its banking outside it
  const fork = i.fork as Record<string, unknown> | undefined;
  const swing = (u: number) => (lo + (hi - lo) * (0.5 - 0.5 * Math.cos(u)) - def) * D;
  let palletAt = swing;
  if (fork) {
    const rr = c.num(fork.roller);
    const reach = c.num(fork.reach);
    const win = c.num(fork.window) * D;
    const follow = (t: number) => Math.atan2(-rr * Math.sin(t), reach + rr - rr * Math.cos(t));
    const bank = Math.abs(follow(win));
    palletAt = (u) => {
      const t = swing(u);
      return Math.abs(t) < win ? follow(t) : -Math.sign(t) * bank;
    };
  }
  const rate = i.rate !== undefined ? c.num(i.rate) : Infinity;
  const sim = simulated(simKey("escape", [spec, lo, hi, def, fork ?? null, rate]), () => simulateEscape(spec, palletAt, 1440, rate));
  const N = sim.wheel.length - 1;
  // the reference (every driver at its default) is where the swing first passes the default
  const input = c.num(i.input);
  const uRef = Math.acos(Math.max(-1, Math.min(1, (lo + hi - 2 * def) / (hi - lo))));
  const u = c.u === 0 && Math.abs(input - def) < 1e-12 && Math.abs(def - lo) > 1e-12 ? uRef : c.u;
  const turns = Math.floor(u / TAU);
  const f = ((u - turns * TAU) / TAU) * N;
  const k = Math.min(N - 1, Math.floor(f));
  const t = f - k;
  const w = sim.wheel[k]! + (sim.wheel[k + 1]! - sim.wheel[k]!) * t + turns * sim.advance;
  const d = c.delta("wheel", w);
  // the wheel's axis: its plane's normal, the sense of the 2D turn (xz: about −y; xy: about +z)
  spin(c, str(i.wheel, "escape.wheel"), E, plane === "xz" ? [0, -1, 0] : [0, 0, 1], sense * d);
  if (fork && typeof i.pallets_body === "string") {
    // the lever, moved by the fork (its arbor is not driven)
    spin(c, i.pallets_body, A, plane === "xz" ? [0, -1, 0] : [0, 0, 1], palletAt(u) - palletAt(uRef));
    outVal(c, s, palletAt(u) * R2D, "pallet");
  }
  outVal(c, s, (w - sim.wheel[0]!) * R2D, "advance");
  outVal(c, s, sim.recoil[k]! * R2D, "recoil");
  outVal(c, s, w * R2D, "phase");
};

/**
 * verge (a crown wheel and a verge with two flag pallets): in: input (the foliot's angle, deg, an oscillating driver: lo,
 * hi, default), wheel (body), wheelJoint (its revolute, axis along y, the crown's rim face in the plane through it, the
 * teeth pointing toward −y), vergeJoint (the staff's, axis z), n, R, h, back (deg), upper and lower (the pallets'
 * directions at foliot 0, deg from +x about +z), from, to, width (the pallets' reach and width), sense. out {advance,
 * recoil} (deg).
 */
const vergeBlock: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const C = c.jointAt(str(i.wheelJoint, "verge.wheelJoint"));
  const V = c.jointAt(str(i.vergeJoint, "verge.vergeJoint"));
  const D = Math.PI / 180;
  const sense = (c.num(i.sense ?? 1) >= 0 ? 1 : -1) as 1 | -1;
  const spec: VergeSpec = {
    n: c.num(i.n), R: c.num(i.R), h: c.num(i.h), back: c.num(i.back) * D,
    staff: [V[0] - C[0], V[1] - C[1]], upper: c.num(i.upper) * D, lower: c.num(i.lower) * D,
    from: c.num(i.from), to: c.num(i.to), width: c.num(i.width), sense,
  };
  const lo = c.num(i.lo);
  const hi = c.num(i.hi);
  const def = c.num(i.default ?? 0);
  const sim = simulated(simKey("verge", [spec, lo, hi, def]), () => simulateVerge(spec, (u) => (lo + (hi - lo) * (0.5 - 0.5 * Math.cos(u)) - def) * D));
  const N = sim.wheel.length - 1;
  const input = c.num(i.input);
  const uRef = Math.acos(Math.max(-1, Math.min(1, (lo + hi - 2 * def) / (hi - lo))));
  const u = c.u === 0 && Math.abs(input - def) < 1e-12 && Math.abs(def - lo) > 1e-12 ? uRef : c.u;
  const turns = Math.floor(u / TAU);
  const f = ((u - turns * TAU) / TAU) * N;
  const k = Math.min(N - 1, Math.floor(f));
  const w = sim.wheel[k]! + (sim.wheel[k + 1]! - sim.wheel[k]!) * (f - k) + turns * sim.advance;
  // the crown turns about +y: its top teeth move toward +x for a positive turn
  spin(c, str(i.wheel, "verge.wheel"), C, [0, 1, 0], sense * c.delta("wheel", w));
  outVal(c, s, (w - sim.wheel[0]!) * R2D, "advance");
  outVal(c, s, sim.recoil[k]! * R2D, "recoil");
  // the wheel's absolute angle in the simulation (the drawn wheel's teeth stand at its value at the reference)
  outVal(c, s, w * R2D, "phase");
};

const escapementCache = new Map<string, ReturnType<typeof simulateEscapement>>();

/**
 * escapement. in: kind ("anchor" | "lever" | "verge"), z (wheel teeth), amplitude (deg), lock (0..1), drop (0..1),
 * recoil (0..1), wheel and pallet (bodies), wheelCenter and palletCenter (points), wheelAxis, palletAxis.
 * The oscillator is the cycle phase itself, θ = A sin u. out {wheel, pallet}: angles (deg).
 */
const escapementBlock: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const spec: EscapementSpec = {
    kind: ((i.kind as string | undefined) ?? "anchor") as EscapementSpec["kind"],
    z: c.num(i.z),
    amplitude: c.num(i.amplitude) * D2R,
    lock: c.num(i.lock ?? 0.5),
    drop: c.num(i.drop ?? 0.1),
    recoil: c.num(i.recoil ?? 0),
  };
  const key = JSON.stringify(spec);
  let sim = escapementCache.get(key);
  if (!sim) {
    sim = simulateEscapement(spec);
    escapementCache.set(key, sim);
  }
  const now = sim.at(c.u);
  const ref = sim.at(0);
  if (typeof i.wheel === "string") spin(c, i.wheel, c.vec(i.wheelCenter), v3.unit(c.vec(i.wheelAxis ?? [0, 0, 1])), now.wheel - ref.wheel);
  if (typeof i.pallet === "string") spin(c, i.pallet, c.vec(i.palletCenter), v3.unit(c.vec(i.palletAxis ?? [0, 0, 1])), now.pallet - ref.pallet);
  outVal(c, s, (now.wheel - ref.wheel) * R2D, "wheel");
  outVal(c, s, (now.pallet - ref.pallet) * R2D, "pallet");
};

/**
 * indexer (Geneva and star wheel). in: n (slots or teeth), input (the crank angle, deg, measured from the line of
 * centres with the pin nearest the wheel at 0; for an internal Geneva, `internal: true`, farthest from it), phi0 (its
 * reference value), wheel (body), center, axis, sense (+1 or −1; default −1 for an external Geneva, which turns against
 * its crank, +1 for an internal one). `mode: "mutilated"`: a mutilated gear pair, `window` (deg of driver, centred on
 * φ = 0) and `ratio` (driven per driver while in mesh, default −1).
 * out {angle}: the wheel's angle (deg).
 */
const indexer: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const n = i.mode === "mutilated" || i.mode === "cam" ? 0 : c.num(i.n);
  const phi0 = c.num(i.phi0 ?? 0) * D2R;
  const phi = phi0 + c.delta("in", c.rad(i.input));
  // an external Geneva turns against its crank, an internal one with it
  if (i.mode === "cam") {
    // a cam indexer (a roller-gear or barrel indexer): the output steps `step` deg by the law over `index` deg of input
    // (from φ = 0 each turn) and dwells the rest
    const step = c.num(i.step) * D2R;
    const idx = c.num(i.index) * D2R;
    const law = lawOf(i.law as string | undefined);
    const at = (p: number) => {
      const turns = Math.floor(p / TAU);
      const local = p - turns * TAU;
      return step * (turns + lawRise(law, Math.min(1, local / idx)).s);
    };
    const dm = (c.num(i.sense ?? 1) >= 0 ? 1 : -1) * (at(phi) - at(phi0));
    if (typeof i.wheel === "string") spin(c, i.wheel, c.vec(i.center), v3.unit(c.vec(i.axis ?? [0, 0, 1])), dm);
    outVal(c, s, dm * R2D, "angle");
    return;
  }
  if (i.mode === "mutilated") {
    // a mutilated gear: the driven gear turns at `ratio` while the driver's toothed `window` (deg, centred on φ = 0)
    // passes the mesh, and is held by the locking rim for the rest of the turn
    const w = c.num(i.window) * D2R;
    const ratio = c.num(i.ratio ?? -1);
    const law = (p: number) => {
      const turns = Math.round(p / TAU);
      const local = p - turns * TAU;
      return ratio * (Math.max(-w / 2, Math.min(w / 2, local)) + turns * w);
    };
    const dm = law(phi) - law(phi0);
    if (typeof i.wheel === "string") spin(c, i.wheel, c.vec(i.center), v3.unit(c.vec(i.axis ?? [0, 0, 1])), dm);
    outVal(c, s, dm * R2D, "angle");
    return;
  }
  const internal = i.internal === true;
  const sense = i.sense !== undefined ? c.num(i.sense) : internal ? 1 : -1;
  const law = internal ? genevaInternalAngle : genevaAngle;
  const d = sense * (law(n, phi) - law(n, phi0));
  if (typeof i.wheel === "string") spin(c, i.wheel, c.vec(i.center), v3.unit(c.vec(i.axis ?? [0, 0, 1])), d);
  outVal(c, s, d * R2D, "angle");
};

export const TIMED_BLOCKS: Record<string, BlockFn> = {
  star: starBlock,
  ratchet: ratchetBlock,
  "one-way": oneWay,
  escape: escapeBlock,
  verge: vergeBlock,
  escapement: escapementBlock,
  indexer,
};
