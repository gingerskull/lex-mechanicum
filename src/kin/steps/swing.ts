// A rocker turned by a pin in a slot that does not run through its pivot (a fan's feather on a spreading rod).
import { type BlockFn, KinError } from "../ctx";
import { R2D, type Vec3, v3, xf } from "../math";
import { outVal, str } from "./shared";

/**
 * slot-swing. in: pivot (the rocker's revolute; its other body may move, carrying the pivot), slot (a pin-in-slot joint
 * whose `a` carries the pin, posed by an earlier block, and whose `b` is the rocker with the straight slot `from`, `to`),
 * body (the rocker). The rocker turns about its pivot until the slot's line passes through the pin: the line's offset e
 * from the pivot and the pin's distance q from it give the turn, angle(pin) − angle(slot) − asin(e/q), the closure on the
 * reference's side; the rocker rides the pivot's own motion (a translation of its carrier). out { angle }: the rocker's
 * turn from the reference, deg.
 */
const slotSwing: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const pv = str(i.pivot, "slot-swing.pivot");
  const sl = str(i.slot, "slot-swing.slot");
  const body = str(i.body, "slot-swing.body");
  const j = c.joint(sl);
  if (!j.slot?.from || !j.slot?.to) throw new KinError(`slot-swing ${s.id}: joint ${sl} needs a straight slot`);
  const n = v3.unit(c.jointAxis(pv));
  const P0 = c.jointAt(pv);
  const P = c.vec(pv);
  const Q = c.vec(sl);
  const f0 = v3.sub(c.vec(j.slot.from), P0);
  const u = v3.unit(v3.perp(v3.sub(c.vec(j.slot.to), c.vec(j.slot.from)), n));
  // in the plane square to n: e1 along the slot, e2 = n × e1
  const e2 = v3.cross(n, u);
  const e = v3.dot(f0, e2); // the slot line's offset from the pivot, along e2
  const q = v3.perp(v3.sub(Q, P), n);
  const qa = Math.atan2(v3.dot(q, e2), v3.dot(q, u));
  const ql = v3.len(q);
  if (ql < Math.abs(e)) throw new KinError(`slot-swing ${s.id}: the pin is nearer the pivot than the slot's line`);
  const a = Math.asin(e / ql);
  // the two turns that put the line through the pin: qa − a and qa − (π − a)
  const wrap = (x: number) => Math.atan2(Math.sin(x), Math.cos(x));
  const roots: [number[], number[]] = [[wrap(qa - a)], [wrap(qa - Math.PI + a)]];
  const k = c.root(roots, Math.sqrt(Math.max(0, ql * ql - e * e)));
  const th = roots[k][0]!;
  c.setXf(body, xf.mul(xf.trans(v3.sub(P, P0)), xf.rotAbout(P0, n, th)));
  outVal(c, s, th * R2D, "angle");
  void (null as unknown as Vec3);
};

export const SWING_BLOCKS: Record<string, BlockFn> = { "slot-swing": slotSwing };
