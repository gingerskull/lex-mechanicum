// The bent-rod coupling (Hobson's joint): two shafts at a fixed angle, each ending in a disc with bores on a circle of
// one radius, joined by rods bent to the shafts' angle whose legs slide in the bores.
import { KinError, type BlockFn } from "../ctx";
import { R2D, type Vec3, v3, xf } from "../math";
import { elbowCorner, elbowRoot, lineMeet } from "../blocks/couplings";
import { angleFrom, outVal, spin, str } from "./shared";

type Rod = { body?: unknown; joints?: { in?: unknown; out?: unknown } };

/**
 * elbow-rods. in: input (the input shaft's angle, deg, a value name), joints { in, out } (the two shafts' ground
 * revolutes, axes meeting at the joint centre), rods [{ body, joints { in, out } (its legs' cylindrical joints in the
 * input disc and the output disc) }]. Each leg stays parallel to its shaft, so a rod never turns: it is carried along by its corner,
 * which lies on its input bore line, turned with the input, as far from the output axis as the bore is from the input
 * axis (blocks/couplings, elbowCorner), on the root the joint was assembled on. The output disc turns so its bore
 * follows the corner: by exactly the input's turn, about the output axis in the sense that carries the first rod's
 * corner round. out { turn, slideIn, slideOut }: the output's turn from the reference (deg, continuous, equal to the
 * input's), and the first rod's legs' slides along their bores in the input and the output disc (mm, from the reference).
 */
const elbowRods: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const J = (i.joints ?? {}) as Record<string, unknown>;
  const jIn = str(J.in, "elbow-rods.joints.in");
  const jOut = str(J.out, "elbow-rods.joints.out");
  const a1 = c.jointAxis(jIn);
  const a2 = c.jointAxis(jOut);
  const o1 = c.jointAt(jIn);
  const j = lineMeet(o1, a1, c.jointAt(jOut), a2);
  if (v3.dist(v3.add(o1, v3.mul(a1, v3.dot(v3.sub(j, o1), a1))), j) > 1e-6) throw new KinError(`elbow-rods ${s.id}: the shafts' axes do not meet`);
  const d = c.delta("in", c.rad(i.input));
  const grounded = (jid: string) => {
    const g = c.joint(jid);
    return g.a === "ground" ? g.b : g.a;
  };
  const rods = (i.rods as Rod[] | undefined) ?? [];
  if (!rods.length) throw new KinError(`elbow-rods ${s.id}: no rods`);
  const R1 = xf.rotAbout(o1, a1, d);
  // the corner of each rod now, from its input bore turned with the input
  const corners = rods.map((r, n) => {
    const jr = r.joints ?? {};
    const ji = str(jr.in, `elbow-rods.rods[${n}].joints.in`);
    const jo = str(jr.out, `elbow-rods.rods[${n}].joints.out`);
    const p = c.jointAt(ji);
    const b0 = lineMeet(p, c.jointAxis(ji), c.jointAt(jo), c.jointAxis(jo));
    const { k } = elbowRoot(j, a1, a2, b0);
    return { r, b0, k, at: (dd: number) => elbowCorner(j, a1, a2, xf.apply(dd === d ? R1 : xf.rotAbout(o1, a1, dd), p), k) };
  });
  // the output's sense: the turn about a2 that carries the first rod's corner round, read a little way on from the
  // reference (the turn is exactly ± the input's, so the sense is fixed for the assembly)
  const f = corners[0]!;
  const e0 = v3.perp(v3.sub(f.b0, j), a2);
  const probe = 0.5;
  const sense = Math.sign(angleFrom(v3.perp(v3.sub(f.at(probe), j), a2), a2, e0)) || 1;
  const turn = sense * d;
  spin(c, grounded(jIn), o1, a1, d);
  spin(c, grounded(jOut), j, a2, turn);
  corners.forEach((q, n) => {
    const now: Vec3 = q.at(d);
    const t = v3.sub(now, q.b0);
    c.setXf(str(q.r.body, "elbow-rods.rods.body"), xf.trans(t));
    if (n === 0) {
      outVal(c, s, v3.dot(t, a1), "slideIn");
      outVal(c, s, v3.dot(t, a2), "slideOut");
    }
  });
  outVal(c, s, turn * R2D, "turn");
};

export const ELBOW_BLOCKS: Record<string, BlockFn> = { "elbow-rods": elbowRods };
