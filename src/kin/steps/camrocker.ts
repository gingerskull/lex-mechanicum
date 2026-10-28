// A plate cam with a swinging roller follower: the roller's centre stands at the cam's pitch radius from the cam's centre
// (rb + s(θ), the law), on the circle the rocker's arm sweeps about its pivot. The rocker turns where the two circles
// meet, so the cam-contact joint's own check (the roller centre at the pitch radius, src/kin/residual.ts) holds exactly.
import { type BlockFn, KinError } from "../ctx";
import { D2R, R2D, type Vec3, v3, xf } from "../math";
import { dyadRRR } from "../blocks/linkage";
import { camMotion, scheduleOf } from "../blocks/cam";
import { angleFrom, lawOf, outVal, str } from "./shared";

/**
 * The roller centre of a swinging follower at pitch radius `rho` from the cam centre `C`: the meeting of the circle of
 * radius `arm` about the pivot `G` and the circle of radius `rho` about `C`, in the plane square to `n`, on `side` (+1:
 * left of G→C seen from +n). Null where the circles do not meet.
 */
export function swingRoller(C: Vec3, G: Vec3, arm: number, rho: number, n: Vec3, side: 1 | -1): Vec3 | null {
  const sol = dyadRRR(G, C, arm, rho, n);
  if (!sol.reachable) return null;
  return sol.roots[side === 1 ? 0 : 1];
}

/** The side of G→C the reference roller centre P0 lies on, seen from +n. */
export const swingSide = (C: Vec3, G: Vec3, P0: Vec3, n: Vec3): 1 | -1 => (v3.dot(n, v3.cross(v3.sub(C, G), v3.sub(P0, G))) >= 0 ? 1 : -1);

/**
 * cam-rocker. in: joint (a `cam-contact` joint, a: the roller, b: the cam, `at` the roller centre at the reference,
 * `ca` the cam centre, carrying cam: schedule, lift (mm of pitch radius), rb (the prime radius, base + roller), theta0),
 * input (the cam angle, deg), cam (the cam body, turned about the joint's axis through ca by the input; optional when a
 * driver turns it), pivot (the rocker's ground revolute), follower (the rocker and the bodies it carries: its roller).
 * The rocker's arm is the reference distance from the pivot to the roller centre. The branch is the reference side.
 * out {s, angle, pressure}: the pitch radius's rise (mm), the rocker's turn from the reference (deg), and the pressure
 * angle at the roller (deg): between the pitch curve's normal and the roller centre's path round the pivot.
 */
const camRocker: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const jid = str(i.joint, "cam-rocker.joint");
  const j = c.joint(jid);
  if (!j.cam || !j.ca) throw new KinError(`cam-rocker ${s.id}: joint ${jid} needs cam data and its centre ca`);
  const sched = scheduleOf(j.cam, (v) => c.num(v), lawOf);
  const th0 = c.num(j.cam.theta0 ?? 0) * D2R;
  const turn = c.delta("in", c.rad(i.input));
  const ax = c.jointAxis(jid);
  const C = c.vec(j.ca);
  if (typeof i.cam === "string") c.setXf(i.cam, xf.rotAbout(C, ax, turn));
  const pj = str(i.pivot, "cam-rocker.pivot");
  const G = c.jointAt(pj);
  const n = c.jointAxis(pj);
  const P0 = c.jointAt(jid);
  const arm = v3.dist(P0, G);
  const rb = c.num(j.cam.rb);
  const side = swingSide(C, G, P0, n);
  const at = (th: number) => {
    const m = camMotion(sched, th);
    const P = swingRoller(C, G, arm, rb + m.s, n, side);
    if (!P) throw new KinError(`cam-rocker ${s.id}: the arm cannot reach the pitch radius ${(rb + m.s).toFixed(2)}`);
    return { P, m };
  };
  const { P, m } = at(th0 + turn);
  const psi = angleFrom(v3.sub(P, G), n, v3.unit(v3.sub(P0, G)));
  const X = xf.rotAbout(G, n, psi);
  const carried = (Array.isArray(i.follower) ? i.follower : [i.follower]).map((f) => str(f, "cam-rocker.follower"));
  for (const f of carried) c.setXf(f, X);
  outVal(c, s, m.s, "s");
  outVal(c, s, psi * R2D, "angle");
  // the pitch curve in the cam's frame near this angle (the roller centre turned back by the cam's turn): its normal, and
  // the roller centre's path round the pivot seen from the cam (its swing less the cam's turn under it)
  const h = 1e-4;
  const inCam = (th: number) => xf.apply(xf.rotAbout(C, ax, -(th - th0)), at(th).P);
  const T = v3.sub(inCam(th0 + turn + h), inCam(th0 + turn - h));
  const N = v3.unit(v3.cross(ax, T));
  const path = v3.unit(v3.cross(n, v3.sub(P, G)));
  const back = xf.dir(xf.rotAbout(C, ax, -turn), path);
  const cos = Math.abs(v3.dot(N, back));
  outVal(c, s, Math.acos(Math.min(1, cos)) * R2D, "pressure");
};

export const CAM_ROCKER_BLOCKS: Record<string, BlockFn> = { "cam-rocker": camRocker };
