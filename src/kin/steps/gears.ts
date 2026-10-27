// Gear blocks: a mesh (with a rack, a carrier, a planet on a moving centre, a non-circular pair), the Willis and
// Ravigneaux planetary sets, a follower that turns with another body (a cycloidal drive's output), the strain-wave
// flexspline and a bevel differential's spider train.
import { type BlockFn, type BlockCtx, KinError } from "../ctx";
import type { SolveStep } from "../types";
import { D2R, type Vec3, type Xf, v3, xf, R2D } from "../math";
import { ellipticalAngle, meshRatio, ravigneaux, willis } from "../blocks/gears";
import { angleFrom, outPoint, outVal, spin, str } from "./shared";

/**
 * gear-mesh. in: joint (a `gear-mesh` joint: za/zb or ratio, internal, crossed/sign, radiusA for a rack, ncg { e, phase,
 * a }: out contact, the driver's pitch radius at the contact), input (a
 * value: body a's angle, deg), ref (b's angle in the reference configuration, default 0), parent (a body whose pose
 * carries b's centre, for a planet), shaft b's axis is joint.axis2 or joint.axis. out: b's angle (deg) or rack travel (mm).
 * With `carrier` (the angle of a link that carries the mesh round, deg) b turns relative to the carrier by the ratio
 * times a's turn relative to it (a ring of pins held still and a disc on an eccentric: a is the ground, no input; b's
 * centre rides the carrier given as `parent`).
 * A gear a on a moving centre (a planet fixed to a rod, the sun-and-planet gear): `line` [p, q], two points of body a
 * whose direction gives a's turn in place of `input`, and `carrier` (a value: the angle of the link that carries a's
 * centre round b, deg); b turns by the carrier's turn plus the ratio times a's turn relative to the carrier.
 * A pinion a rolling on a held rack b (a stroke doubler's fixed rack): `rolls` (the pinion's centre) and `parent` (the
 * body that carries it) in place of `input`; see rollingPinion. A second rack driven by that pinion is a plain rack
 * mesh with the pinion's turn as `input` and the same `parent`, so its travel is read relative to the moving centre.
 */
const gearMesh: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const jid = str(i.joint, "gear-mesh.joint");
  const j = c.joint(jid);
  if (Array.isArray(i.line)) return planetMesh(c, s, j);
  if (i.rolls !== undefined) return rollingPinion(c, s, j);
  // a's turn (a held ring or ground pins have none); with a carrier, b's turn relative to it follows a's relative to it
  const dA = i.input !== undefined ? c.delta("in", c.rad(i.input)) : 0;
  const dC = i.carrier !== undefined ? c.delta("carrier", c.rad(i.carrier)) : 0;
  const axisB = j.axis2 ? v3.unit(c.vec(j.axis2)) : c.jointAxis(jid);
  let X: Xf;
  let dB = 0;
  if (j.radiusA !== undefined && j.radiusB === undefined && j.zb === undefined && j.ratio === undefined && !j.ncg) {
    // rack: b translates along axis2 by r Δθa
    const t = c.num(j.radiusA) * dA;
    X = xf.trans(v3.mul(axisB, t));
    outVal(c, s, t, "travel");
  } else {
    dB = gearDelta(c, j, dA - dC);
    X = xf.rotAbout(c.vec(j.cb ?? j.at), axisB, dB);
  }
  if (j.ncg && j.ncg.a !== undefined) {
    // the contact on the line of centres: the driver's pitch radius there (the ellipse about its focus; at phase 0 its
    // long radius meets the driven gear's short one, as ellipticalAngle counts it)
    const e = c.num(j.ncg.e);
    const ph = c.num(j.ncg.phase ?? 0) * D2R + dA;
    const r1 = (c.num(j.ncg.a) * (1 - e * e)) / (1 - e * Math.cos(ph));
    outVal(c, s, r1, "contact");
    // and the contact point itself, on the line of centres ca-cb (out.point: the mesh joint's name keeps it there)
    if (j.ca !== undefined && j.cb !== undefined) {
      const ca = c.vec(j.ca);
      outPoint(c, s, v3.add(ca, v3.mul(v3.unit(v3.sub(c.vec(j.cb), ca)), r1)), "point");
    }
  }
  const parent = i.parent as string | undefined;
  // with a carrier but no parent, b's centre stands still and it turns by the carrier's turn as well
  const own = i.carrier !== undefined && !(parent && c.has(parent)) ? xf.mul(xf.rotAbout(c.vec(j.cb ?? j.at), axisB, dC), X) : X;
  c.setXf(j.b, parent && c.has(parent) ? xf.mul(c.xf(parent), own) : own);
  // the pitch point carried round with b's centre on the line of centres from a's (out.point)
  if (parent && c.has(parent) && j.ca !== undefined && j.cb !== undefined) {
    const ca = c.vec(j.ca);
    const cbNow = xf.apply(c.xf(parent), c.vec(j.cb));
    outPoint(c, s, v3.add(ca, v3.mul(v3.unit(v3.sub(cbNow, ca)), v3.dist(c.vec(j.at), ca))), "point");
  }
  outVal(c, s, (dB + dC) * R2D + c.num(i.ref ?? 0), "angle");
};

/** gear-mesh with a on a moving centre: a's turn from a line of two of its points, b's turn about its fixed axis. */
function planetMesh(c: BlockCtx, s: SolveStep, j: import("../types").KinJoint): void {
  const i = s.in ?? {};
  const [p, q] = i.line as unknown[];
  const axisB = j.axis2 ? v3.unit(c.vec(j.axis2)) : c.jointAxis(j.id);
  const e0 = v3.sub(c.refVec(q), c.refVec(p));
  const e1 = v3.sub(c.vec(q), c.vec(p));
  const dA = angleFrom(e1, axisB, v3.unit(e0));
  const dC = i.carrier !== undefined ? c.delta("carrier", c.rad(i.carrier)) : 0;
  const dB = dC + gearDelta(c, j, dA - dC);
  c.setXf(j.b, xf.rotAbout(c.vec(j.cb ?? j.at), axisB, dB));
  outVal(c, s, dB * R2D + c.num(i.ref ?? 0), "angle");
}

/**
 * gear-mesh with `rolls` (a point: the pinion's centre, carried by `parent`): pinion a rolls on rack b, which is held
 * (fixed, or posed before this step). The centre's travel along the rack's axis2 relative to the rack, t, turns a by
 * Δθ = -t / r about the joint's axis, so the rack moves r Δθ along axis2 relative to the centre (the rack form's law
 * read the other way). a is posed by the parent's pose and that turn about the centre. out: a's turn (deg) and t (mm).
 */
function rollingPinion(c: BlockCtx, s: SolveStep, j: import("../types").KinJoint): void {
  const i = s.in ?? {};
  if (j.radiusA === undefined) throw new KinError(`${s.id}: a rolling pinion needs the joint's radiusA`);
  // the rack's way is its own: the pinion's axis would give no travel, so the pinion would never turn
  if (j.axis2 === undefined) throw new KinError(`${s.id}: a rolling pinion needs the joint's axis2 (the rack's way)`);
  const parent = str(i.parent, "gear-mesh.parent");
  const centre = i.rolls;
  const axisB = v3.unit(c.vec(j.axis2));
  const ref = c.refVec(centre);
  // the rack's own displacement, where a block posed it before this step (a held rack has none)
  const rack = c.has(j.b) ? v3.sub(xf.apply(c.xf(j.b), ref), ref) : ([0, 0, 0] as Vec3);
  const t = c.delta("travel", v3.dot(v3.sub(v3.sub(c.vec(centre), ref), rack), axisB));
  const dA = -t / c.num(j.radiusA);
  c.setXf(j.a, xf.mul(c.xf(parent), xf.rotAbout(ref, c.jointAxis(j.id), dA)));
  outVal(c, s, dA * R2D + c.num(i.ref ?? 0), "angle");
  outVal(c, s, t, "travel");
}

/** Angle of gear b for a turn dA of a, from the joint's ratio, tooth counts or non-circular pitch curve. */
export function gearDelta(c: BlockCtx, j: import("../types").KinJoint, dA: number): number {
  if (j.ncg) {
    const e = c.num(j.ncg.e);
    const ph = c.num(j.ncg.phase ?? 0) * D2R;
    return -(ellipticalAngle(e, ph + dA) - ellipticalAngle(e, ph));
  }
  if (j.ratio !== undefined) return c.num(j.ratio) * dA;
  const sign = j.crossed ? (j.hand === "left" ? -1 : 1) : undefined;
  return meshRatio({ za: c.num(j.za), zb: c.num(j.zb), internal: j.internal, sign: (sign as 1 | -1 | undefined) }) * dA;
}

/**
 * willis. in: zs, zr (sun and ring teeth), zp (planet teeth, optional), center and axis (the common axis),
 * sun, ring, carrier: two of them as values (deg) or numbers (a held member is 0), the third is solved;
 * bodies {sun, ring, carrier}, planets [{ body, center }]. out {sun, ring, carrier, planet, spin}: the angles turned (deg);
 * planet is a planet's turn in the world, spin its turn on its own pin (relative to the carrier).
 */
const willisBlock: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const spec = { zs: c.num(i.zs), zr: c.num(i.zr), zp: i.zp !== undefined ? c.num(i.zp) : undefined };
  const known: Partial<Record<"sun" | "ring" | "carrier", number>> = {};
  for (const k of ["sun", "ring", "carrier"] as const) if (i[k] !== undefined) known[k] = c.delta(k, c.rad(i[k]));
  const w = willis(spec, known);
  const centre = c.vec(i.center);
  const axis = v3.unit(c.vec(i.axis));
  const bodies = (i.bodies as Record<string, string> | undefined) ?? {};
  for (const k of ["sun", "ring", "carrier"] as const) {
    const b = bodies[k];
    if (b) spin(c, b, centre, axis, w[k]);
    outVal(c, s, w[k] * R2D, k);
  }
  const planets = (i.planets as { body: string; center: unknown }[] | undefined) ?? [];
  for (const p of planets) {
    const pc = c.refVec(p.center);
    const own = xf.rotAbout(pc, axis, (w.planet ?? 0) - w.carrier);
    c.setXf(p.body, xf.mul(xf.rotAbout(centre, axis, w.carrier), own));
  }
  if (w.planet !== null) {
    outVal(c, s, w.planet * R2D, "planet");
    // a planet's turn on its own pin, relative to the carrier
    outVal(c, s, (w.planet - w.carrier) * R2D, "spin");
  }
};

/**
 * ravigneaux. A compound planetary set with two suns, short and long pinions on one carrier and a ring (see `ravigneaux`
 * in blocks/gears). in: zSs, zSl, zPs, zPl, zR (teeth), center, axis (the common axis), input (the input member's
 * angle, deg), inputMember, held, locked (design choices: a member's name; held "none"; locked "none" or "a+b"),
 * bodies { sunS, sunL, carrier, ring }, short and long [{ body, joint }] (each pinion on its pin, joints to the carrier).
 * out { sunS, sunL, carrier, ring, short, long }: the members' angles and the pinions' turns on their pins (deg).
 */
const ravigneauxBlock: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const members = ["sunS", "sunL", "carrier", "ring"] as const;
  type M = (typeof members)[number];
  const member = (v: string | undefined, what: string): M => {
    if (!members.includes(v as M)) throw new KinError(`${s.id}: ${what} "${String(v)}" is not sunS, sunL, carrier or ring`);
    return v as M;
  };
  const pick = (k: string): string | undefined => (typeof i[k] === "string" ? (c.choice(i[k]) ?? (i[k] as string)) : undefined);
  const inputMember = member(pick("inputMember"), "input member");
  const heldName = pick("held");
  const lockName = pick("locked");
  const held = heldName && heldName !== "none" ? member(heldName, "held member") : null;
  const lock = lockName && lockName !== "none" ? (lockName.split("+").map((m) => member(m, "locked member")) as [M, M]) : null;
  const spec = { zSs: c.num(i.zSs), zSl: c.num(i.zSl), zPs: c.num(i.zPs), zPl: c.num(i.zPl), zR: c.num(i.zR) };
  const w = ravigneaux(spec, c.delta("in", c.rad(i.input)), inputMember, lock ? null : held, lock);
  const centre = c.vec(i.center);
  const axis = v3.unit(c.vec(i.axis));
  const bodies = (i.bodies as Record<string, string> | undefined) ?? {};
  for (const k of members) {
    const b = bodies[k];
    if (b) spin(c, b, centre, axis, w[k]);
    outVal(c, s, w[k] * R2D, k);
  }
  const C = xf.rotAbout(centre, axis, w.carrier);
  for (const set of ["short", "long"] as const) {
    for (const p of (i[set] as { body: string; joint: string }[] | undefined) ?? []) c.setXf(p.body, xf.mul(C, xf.rotAbout(c.refVec(p.joint), axis, w[set])));
    outVal(c, s, w[set] * R2D, set);
  }
};

/**
 * follow. in: body (the follower), joint (its revolute to the ground), of (a body solved before it). The follower turns
 * about its joint exactly as `of` turns (a cycloidal drive's output flange with its disc, whose pins in oversized holes
 * make a parallelogram at every pin). out: the angle turned (deg).
 */
const follow: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const jid = str(i.joint, "follow.joint");
  const of = str(i.of, "follow.of");
  const axis = c.jointAxis(jid);
  const a = xf.angleAbout(c.xf(of), axis);
  spin(c, str(i.body, "follow.body"), c.jointAt(jid), axis, a);
  outVal(c, s, a * R2D, "angle");
};

/**
 * wave. A flexspline bent into an oval by its wave generator, as z rigid segments (one tooth and its piece of rim each,
 * built undeformed at angle 2πk/z). in: input (the wave generator's angle, deg), turn (the flexspline's turn, deg, from
 * its mesh), segments [bodies, k = 0..z-1], r (pitch radius at rest), w0 (radial bend at the long axis), center, axis,
 * longAxis (its angle at the reference, deg). The segments are built bent as at the reference (flexTooth with w0).
 * Segment k's material angle is 2πk/z + turn; it moves out by w = w0 cos 2(φ - input), along its radius, and tilts with
 * the oval's slope. out: the bend at segment 0 (mm).
 */
const wave: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const segs = (i.segments as string[] | undefined) ?? [];
  const z = segs.length;
  const r = c.num(i.r);
  const w0 = c.num(i.w0);
  const th = c.rad(i.input);
  const psi = c.rad(i.turn);
  const o = c.vec(i.center ?? [0, 0, 0]);
  const axis = v3.unit(c.vec(i.axis ?? [0, 0, 1]));
  const ex: Vec3 = Math.abs(axis[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1];
  const e1 = v3.unit(v3.sub(ex, v3.mul(axis, v3.dot(ex, axis))));
  const e2 = v3.cross(axis, e1);
  const at = (rad: number, a: number): Vec3 => v3.add(o, v3.add(v3.mul(e1, rad * Math.cos(a)), v3.mul(e2, rad * Math.sin(a))));
  // the input and the turn are measured from the reference, where the long axis lies at angle th0 (deg, default 0)
  const th0 = c.num(i.longAxis ?? 0) * D2R;
  const pose = (k: number, thA: number, psiA: number): Xf => {
    const pk = (k * 2 * Math.PI) / z;
    // an inextensible rim slides along itself as it bends: v = -(w0/2) sin 2(φ - th), so the teeth keep their pitch
    const phi0 = pk + psiA;
    const phi = phi0 - (w0 / 2) * Math.sin(2 * (phi0 - thA)) / r;
    const w = w0 * Math.cos(2 * (phi0 - thA));
    // the oval's slope dr/dφ: its tangent leans from the circle's by -atan(r'/r)
    const slope = -2 * w0 * Math.sin(2 * (phi0 - thA));
    const rho = psiA - Math.atan2(slope, r + w);
    // the segment turned by rho about the centre, then its pitch point carried out to the bent radius
    const turned = xf.rotAbout(o, axis, rho);
    const from = xf.apply(turned, at(r, pk));
    return xf.mul(xf.trans(v3.sub(at(r + w, phi), from)), turned);
  };
  let bend0 = 0;
  const dth = c.delta("in", th);
  const dpsi = c.delta("turn", psi);
  segs.forEach((b, k) => {
    // the segments are built bent as at the reference: their pose is from there
    c.setXf(b, xf.mul(pose(k, th0 + dth, dpsi), xf.inv(pose(k, th0, 0))));
    if (k === 0) bend0 = w0 * Math.cos(2 * (dpsi - dth));
  });
  outVal(c, s, bend0, "bend");
};

/**
 * bevel-diff. A bevel differential's spider train on its case. in: case (body, posed before), difference (the left side
 * gear's turn relative to the case, deg), sides { left: [body, joint], right: [body, joint] } (their revolutes to the case),
 * spiders [{ body, joint }] (on the cross-pin), zs, zp (side and spider teeth). The left side gear turns +difference
 * relative to the case, the right one -difference, and each spider spins on its pin by difference zs / zp about its own
 * joint's axis. out { left, right, spin }: the side gears' and a spider's turns relative to the case (deg).
 */
const bevelDiff: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const C = c.xf(str(i.case, "bevel-diff.case"));
  const d = c.delta("diff", c.rad(i.difference));
  const sides = (i.sides ?? {}) as Record<string, [string, string]>;
  const put = (pair: [string, string] | undefined, a: number) => {
    if (!pair) return;
    c.setXf(pair[0], xf.mul(C, xf.rotAbout(c.refVec(pair[1]), c.jointAxis(pair[1]), a)));
  };
  put(sides.left, d);
  put(sides.right, -d);
  const spin = (d * c.num(i.zs)) / c.num(i.zp);
  for (const sp of (i.spiders as { body: string; joint: string }[] | undefined) ?? []) c.setXf(sp.body, xf.mul(C, xf.rotAbout(c.refVec(sp.joint), c.jointAxis(sp.joint), spin)));
  outVal(c, s, d * R2D, "left");
  outVal(c, s, -d * R2D, "right");
  outVal(c, s, spin * R2D, "spin");
};

export const GEAR_BLOCKS: Record<string, BlockFn> = {
  "gear-mesh": gearMesh,
  willis: willisBlock,
  ravigneaux: ravigneauxBlock,
  follow,
  wave,
  "bevel-diff": bevelDiff,
};
