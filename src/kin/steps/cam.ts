// Cam blocks: a cam and its follower (translating or swinging, roller or flat face, plate or barrel), and a rocker held
// on a follower's end by its round nose.
import { type BlockFn, KinError } from "../ctx";
import { D2R, v3, xf, R2D } from "../math";
import { camMotion, pressureAngle, scheduleOf } from "../blocks/cam";
import { lawOf, outName, outVal, str } from "./shared";

/**
 * cam. in: joint (a `cam-contact` joint carrying cam: schedule, lift, rb, e, theta0), input (the cam angle, deg),
 * follower (body), axis (the follower's direction of travel, unit; or the pivot axis when swing is true),
 * swing (true: an oscillating follower about the joint's `at`; lift is then radians' worth in degrees).
 * follower may be a list (the follower and the bodies it carries); rr (roller radius) or flat (true: a flat face) place
 * the contact point, which needs the joint's `ca` (the cam's centre).
 * A barrel track of several turns (the joint's cam `turns`, a self-reversing screw) repeats after that many turns of
 * the cam. shoe (a body) and pivot (its revolute in the follower, square to the cam's surface): a shoe that swivels on
 * its pivot to lie along a barrel groove, turned from its reference place by the change of the groove's direction
 * under it, rb t̂ − (ds/dθ) f̂ (t̂ the cam surface's way round, f̂ the follower's axis); out `swivel` is that turn (deg).
 * out {s, v, pressure, contact}: displacement (mm or deg), ds/dθ, pressure angle (deg), the contact point.
 */
const camBlock: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const jid = str(i.joint, "cam.joint");
  const j = c.joint(jid);
  if (!j.cam) throw new KinError(`cam ${s.id}: joint ${jid} has no cam data`);
  const sched = scheduleOf(j.cam, (v) => c.num(v), lawOf);
  const th0 = c.num(j.cam.theta0 ?? 0) * D2R;
  const th = th0 + c.delta("in", c.rad(i.input));
  const m = camMotion(sched, th);
  const m0 = camMotion(sched, th0);
  // the follower and the bodies it carries (a roller on its stud): one name or a list
  const carried = (Array.isArray(i.follower) ? i.follower : [i.follower]).map((f) => str(f, "cam.follower"));
  const X = i.swing === true ? xf.rotAbout(c.jointAt(jid), c.vec(i.axis), (m.s - m0.s) * D2R) : xf.trans(v3.mul(v3.unit(c.vec(i.axis)), m.s - m0.s));
  for (const f of carried) c.setXf(f, X);
  const rb = c.num(j.cam.rb);
  if (typeof i.shoe === "string" && j.cam.form === "barrel" && j.ca) {
    // the groove's direction under the follower at the pitch radius: the cam's surface carries the groove round by rb per
    // radian while the groove's centre line falls back along the follower's axis by ds/dθ
    const ax = c.jointAxis(jid);
    const f = v3.unit(c.vec(i.axis));
    const at0 = c.jointAt(jid);
    const rel = v3.sub(at0, c.vec(j.ca));
    const rHat = v3.unit(v3.sub(rel, v3.mul(ax, v3.dot(rel, ax))));
    const tHat = v3.cross(ax, rHat);
    const T = (v: number) => v3.unit(v3.sub(v3.mul(tHat, rb), v3.mul(f, v)));
    const pj = str(i.pivot, "cam.pivot");
    const pAx = c.jointAxis(pj);
    const T0 = T(m0.v);
    const T1 = T(m.v);
    const gam = Math.atan2(v3.dot(v3.cross(T0, T1), pAx), v3.dot(T0, T1));
    c.setXf(i.shoe, xf.mul(X, xf.rotAbout(c.jointAt(pj), pAx, gam)));
    outVal(c, s, gam * R2D, "swivel");
  }
  outVal(c, s, m.s, "s");
  outVal(c, s, m.v, "v");
  // a barrel cam's follower runs along the axis at the pitch radius: tan φ = s' / rb
  const phi = j.cam.form === "barrel" ? Math.atan2(m.v, rb) : pressureAngle({ rb, e: j.cam.e !== undefined ? c.num(j.cam.e) : 0 }, m.s, m.v);
  outVal(c, s, phi * R2D, "pressure");
  // the contact point on the cam (a translating follower in line with the cam centre): a roller of radius `rr` touches
  // along the pitch curve's normal, n ∝ ρ r̂ + v t̂ with ρ = rb + s; a flat face (`flat: true`) touches at ρ r̂ − v t̂,
  // the envelope of its lines. r̂ is the follower's direction from the cam centre, t̂ = axis × r̂, the cam turning about +axis.
  const kOut = outName(s, "contact");
  if (kOut && i.swing !== true && j.ca) {
    const ax = c.jointAxis(jid);
    const centre = c.vec(j.ca);
    const tip = xf.apply(X, c.jointAt(jid));
    const rel = v3.sub(tip, centre);
    const rHat = v3.unit(v3.sub(rel, v3.mul(ax, v3.dot(rel, ax))));
    const tHat = v3.cross(ax, rHat);
    const rho = rb + m.s;
    // a barrel cam: the groove's normal in the cylinder's tangent plane, n ∝ rb â + s' t̂ (â the axis)
    if (j.cam.form === "barrel") c.setPt(kOut, v3.sub(tip, v3.mul(v3.unit(v3.add(v3.mul(ax, rb), v3.mul(tHat, m.v))), c.num(i.rr ?? 0))));
    else if (i.flat === true) c.setPt(kOut, v3.add(v3.add(centre, v3.mul(ax, v3.dot(rel, ax))), v3.sub(v3.mul(rHat, rho), v3.mul(tHat, m.v))));
    else {
      const n = v3.unit(v3.add(v3.mul(rHat, rho), v3.mul(tHat, m.v)));
      c.setPt(kOut, v3.sub(tip, v3.mul(n, c.num(i.rr ?? 0))));
    }
  }
};

/**
 * rocker: a rocker held against a translating follower's end by a round nose, its pivot level with the nose at the
 * reference, so the nose drops exactly the follower's travel: ψ = sense · asin(s / arm). in: value (the travel s, mm, a
 * value name), v (ds/dθ of the driving cam, mm per radian, a value name), joint (the rocker's ground revolute), body (the
 * rocker; default the joint's b), arm (pivot to nose, mm), sense (+1 or −1 about the joint's axis), shoe (a point on the
 * rocker riding a cam lobe) and cam (the cam's ground revolute), for the pressure angle at the shoe: the angle between
 * the shoe's path in the cam's frame and the arm square to its motion. out {angle, pressure} (deg).
 */
const rockerBlock: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const jid = str(i.joint, "rocker.joint");
  const sOf = c.num(i.value);
  const b = c.num(i.arm);
  const sense = i.sense !== undefined ? c.num(i.sense) : 1;
  if (Math.abs(sOf) > b) throw new KinError(`rocker ${s.id}: travel ${sOf.toFixed(2)} beyond the arm ${b}`);
  const psi = sense * Math.asin(sOf / b);
  const body = (i.body as string | undefined) ?? c.joint(jid).b;
  const ax = c.jointAxis(jid);
  const Q = c.jointAt(jid);
  const X = xf.rotAbout(Q, ax, psi - sense * Math.asin(c.num(i.ref ?? 0) / b));
  c.setXf(body, X);
  outVal(c, s, psi * R2D, "angle");
  if (typeof i.shoe === "string" && typeof i.cam === "string" && i.v !== undefined) {
    // the shoe's path relative to the cam turning about +a: T = ψ'·a×(P−Q) − a×(P−O), ψ' = sense·v / (arm cos ψ)
    const P = xf.apply(X, c.refPt(i.shoe));
    const O = c.jointAt(i.cam);
    const a = c.jointAxis(i.cam);
    const dpsi = (sense * c.num(i.v)) / (b * Math.cos(psi));
    const T = v3.sub(v3.mul(v3.cross(ax, v3.sub(P, Q)), dpsi * v3.dot(ax, a)), v3.cross(a, v3.sub(P, O)));
    const r = v3.sub(P, Q);
    const cos = Math.abs(v3.dot(T, r)) / (v3.len(T) * v3.len(r) || 1);
    outVal(c, s, Math.acos(Math.min(1, cos)) * R2D, "pressure");
  }
};

export const CAM_BLOCKS: Record<string, BlockFn> = {
  cam: camBlock,
  rocker: rockerBlock,
};
