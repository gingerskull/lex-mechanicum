// A flexible member anchored at one end and run round a sprocket (or sheave) that a moving member carries: the stroke
// doubler's chain. The member is held where it is anchored, so the sprocket rolls along that strand as its carrier
// moves, and the strand that leaves the other side of it draws the output twice the carrier's travel.
import type { BlockFn } from "../ctx";
import { R2D, type Vec3, v3, xf } from "../math";
import { outVal, str } from "./shared";

/**
 * strand. in: carrier (the body that carries the sprocket, posed before this step), joint (the sprocket's revolute on
 * the carrier: its centre and axis), held (the anchored strand: a `belt` joint from the sprocket, a, to the body its end
 * is fixed to, b: the ground or a body posed before this step), running (optional: the strand joints from the sprocket
 * to the bodies the member draws, each body posed here). Each strand joint gives `radiusA` (the sprocket's radius for
 * the member, z p / 2π for a chain measured in links), `at` (where the strand leaves the sprocket) and `axis2` (the way
 * a positive turn of the sprocket moves the strand there, relative to the sprocket's centre).
 * The held body's travel past the carrier along the held strand's axis2, t, turns the sprocket by t / r relative to the
 * carrier; a running strand moves r Δθ along its own axis2 relative to the carrier, and its body with it. Where the two
 * strands run parallel and opposite the drawn body moves the carrier's travel twice over, the same way.
 * out { angle, travel }: the sprocket's turn relative to the carrier (deg) and r Δθ (mm), the member's travel along its
 * path relative to the carrier.
 */
const strandBlock: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const carrier = str(i.carrier, "strand.carrier");
  const rev = str(i.joint, "strand.joint");
  const hid = str(i.held, "strand.held");
  const held = c.joint(hid);
  const r = c.num(held.radiusA, `${hid}.radiusA`);
  const Xc = c.xf(carrier);
  const A0 = c.jointAt(hid);
  const Xh = held.b !== "ground" && c.has(held.b) ? c.xf(held.b) : xf.id();
  // the held end's place seen from the carrier, against where it stands at the reference
  const rel = v3.sub(xf.apply(xf.inv(Xc), xf.apply(Xh, A0)), A0);
  const ax2 = (id: string): Vec3 => {
    const j = c.joint(id);
    return v3.unit(c.vec(j.axis2 ?? [1, 0, 0]));
  };
  const t = c.delta("travel", v3.dot(rel, ax2(hid)));
  const dTh = t / r;
  c.setXf(held.a, xf.mul(Xc, xf.rotAbout(c.jointAt(rev), c.jointAxis(rev), dTh)));
  for (const id of (i.running as string[] | undefined) ?? []) {
    const j = c.joint(id);
    const rr = c.num(j.radiusA ?? held.radiusA, `${id}.radiusA`);
    c.setXf(j.b, xf.mul(Xc, xf.trans(v3.mul(ax2(id), rr * dTh))));
  }
  outVal(c, s, dTh * R2D, "angle");
  outVal(c, s, r * dTh, "travel");
};

export const STRAND_BLOCKS: Record<string, BlockFn> = { strand: strandBlock };
