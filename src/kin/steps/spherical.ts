// The spherical four-bar: four revolutes whose axes all pass through one centre (a wobble drive's input shaft, inclined
// journal, trunnion axis and output shaft), solved in closed form. The Hooke joint is the case with every link at 90°
// and keeps its own block (./spatial).
import { type BlockFn, KinError } from "../ctx";
import { R2D, type Vec3, m3, v3, xf } from "../math";
import { sphericalFourBar, sphericalLinkAngles } from "../blocks/spatial";
import { outVal, str } from "./shared";

/** A rotation taking the orthonormal frame built on (p0, q0) to the one built on (p, q): p first, q made square to it. */
function turnPair(p0: Vec3, q0: Vec3, p: Vec3, q: Vec3) {
  const frame = (a: Vec3, b: Vec3) => {
    const e1 = v3.unit(a);
    const e2 = v3.unit(v3.sub(b, v3.mul(e1, v3.dot(b, e1))));
    const e3 = v3.cross(e1, e2);
    return [e1[0], e2[0], e3[0], e1[1], e2[1], e3[1], e1[2], e2[2], e3[2]] as import("../math").Mat3;
  };
  return m3.mul(frame(p, q), m3.T(frame(p0, q0)));
}

/**
 * spherical-four-bar. in: input (the driven ground joint's angle, deg, as a value name), joints [j1, j2, j3, j4] round
 * the loop: j1 ground to input (driven), j2 input to coupler, j3 coupler to output, j4 output to ground, every axis
 * through one centre (checked, within 0.01 mm); bodies [input, coupler, output] (else the body each pair of neighbouring
 * joints shares); carry { input: [bodies], output: [bodies] }, bodies rigid with the input or the output (a journal
 * sleeve pinned on the input shaft, an arm keyed on the output's). The link angles are read from the four axes in the
 * reference pose. The output turns about j4 by the root of A cos ψ + B sin ψ + C = cos(coupler angle) that passes
 * through the reference pose (branch "other" takes the second); the coupler turns so its two axes ride on the input's
 * and the output's. out.angle: the output's turn from the reference, deg.
 */
const sphericalFourBarBlock: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const ids = (Array.isArray(i.joints) ? i.joints : []).map((j, k) => str(j, `spherical-four-bar.joints[${k}]`));
  if (ids.length !== 4) throw new KinError(`spherical-four-bar ${s.id}: four joints round the loop`);
  const [a1, a2, a3, a4] = ids.map((id) => c.jointAxis(id)) as [Vec3, Vec3, Vec3, Vec3];
  const centre = c.jointAt(ids[1]!);
  for (const id of ids) {
    const off = v3.len(v3.cross(v3.sub(c.jointAt(id), centre), c.jointAxis(id)));
    if (off > 0.01) throw new KinError(`spherical-four-bar ${s.id}: joint ${id}'s axis misses the centre by ${off.toFixed(3)} mm`);
  }
  const links = sphericalLinkAngles(a1, a2, a3, a4);
  if (links.some((l) => l < 1e-6)) throw new KinError(`spherical-four-bar ${s.id}: two neighbouring axes coincide`);
  // the root through the reference pose: the one whose ψ is 0 at θ = 0
  const ref = sphericalFourBar(a1, a2, a3, a4, 0, 1);
  const first = Math.abs(ref.roots[0]) <= Math.abs(ref.roots[1]) ? 0 : 1;
  const theta = c.delta("in", c.rad(i.input));
  const sol = sphericalFourBar(a1, a2, a3, a4, theta, 1);
  if (sol.h < -1e-9) throw new KinError(`spherical-four-bar ${s.id}: the loop does not close at ${(theta * R2D).toFixed(2)}°`);
  const ordered: [number, number] = first === 0 ? sol.roots : [sol.roots[1], sol.roots[0]];
  const k = c.root([[Math.cos(ordered[0]), Math.sin(ordered[0])], [Math.cos(ordered[1]), Math.sin(ordered[1])]], sol.h);
  const psi = ordered[k];
  const Xin = xf.rotAbout(centre, a1, theta);
  const Xout = xf.rotAbout(centre, a4, psi);
  const R = turnPair(a2, a3, xf.dir(Xin, a2), xf.dir(Xout, a3));
  const Xc = { R, t: v3.sub(centre, m3.mulV(R, centre)) };
  const shared = (ja: string, jb: string): string | undefined => {
    const A = c.joint(ja);
    const B = c.joint(jb);
    return [A.a, A.b].find((b) => b !== "ground" && (b === B.a || b === B.b));
  };
  const given = (i.bodies as string[] | undefined) ?? [];
  const bIn = given[0] ?? shared(ids[0]!, ids[1]!);
  const bC = given[1] ?? shared(ids[1]!, ids[2]!);
  const bOut = given[2] ?? shared(ids[2]!, ids[3]!);
  if (!bIn || !bC || !bOut) throw new KinError(`spherical-four-bar ${s.id}: the joints do not name three moving bodies round the loop`);
  c.setXf(bIn, Xin);
  c.setXf(bC, Xc);
  c.setXf(bOut, Xout);
  const carry = (i.carry ?? {}) as { input?: unknown; output?: unknown };
  for (const b of Array.isArray(carry.input) ? carry.input : []) c.setXf(str(b, "spherical-four-bar.carry.input"), Xin);
  for (const b of Array.isArray(carry.output) ? carry.output : []) c.setXf(str(b, "spherical-four-bar.carry.output"), Xout);
  outVal(c, s, psi * R2D, "angle");
};

export const SPHERICAL_BLOCKS: Record<string, BlockFn> = { "spherical-four-bar": sphericalFourBarBlock };
