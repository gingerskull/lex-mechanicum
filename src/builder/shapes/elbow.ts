// A rod bent to the angle between its two joints' axes (an `elbow` shape: Hobson's joint). Its frame is its corner; each
// leg runs from the corner toward its joint, along the joint's axis, the bend turned on a radius between them.
import { circle } from "../../core/geom";
import type { Kin, KinBody } from "../../kin/types";
import type { Setup } from "../../kin/compose";
import { type Vec3, v3 } from "../../kin/math";
import { planeCoords } from "../frames";
import type { BodyGeom } from "../shapes";
import { num, pair } from "./common";

/**
 * The `elbow` shape ({ diameter, legs: [first, second], bend }): leg lengths from the corner, the bend's radius on the
 * rod's axis. The rod is one part, its round section swept from the first leg's end round the bend to the second's, in
 * the body's frame (whose z the record may set to anything: a rod that leaves both bores at once comes out along the
 * line between its legs, the explode reads it there).
 */
export function elbowGeom(kin: Kin, S: Setup, b: KinBody, g: BodyGeom): BodyGeom | null {
  const sh = g.shape;
  if (String(sh.type) !== "elbow") return null;
  const js = kin.joints.filter((j) => j.a === b.id || j.b === b.id).map((j) => S.joints.get(j.id)!);
  if (js.length !== 2) throw new Error(`${b.id}: an elbow rod needs its two leg joints`);
  const F = g.frame;
  // each leg's direction from the corner, along its joint's axis, toward the joint, in the frame's coordinates
  const dirOf = (k: number): Vec3 => {
    const j = js[k]!;
    const ax = v3.unit(j.axis);
    const s = Math.sign(v3.dot(v3.sub(j.at, F.o), ax)) || 1;
    const q = planeCoords(F, v3.add(F.o, v3.mul(ax, s)));
    return v3.unit([q.uv[0], q.uv[1], q.w]);
  };
  const d1 = dirOf(0);
  const d2 = dirOf(1);
  const r = num(sh.diameter, 6) / 2;
  const [L1, L2] = pair(sh.legs, [60, 60]);
  const rho = num(sh.bend, 2 * r);
  // the bend: tangent to both legs, t from the corner along each
  const phi = Math.acos(Math.max(-1, Math.min(1, v3.dot(d1, d2))));
  const t = rho / Math.tan(phi / 2);
  const c = v3.mul(v3.unit(v3.add(d1, d2)), rho / Math.sin(phi / 2));
  const e1 = v3.unit(v3.sub(v3.mul(d1, t), c));
  const e2 = v3.unit(v3.sub(v3.mul(d2, t), c));
  const sweep = Math.acos(Math.max(-1, Math.min(1, v3.dot(e1, e2))));
  const ax = v3.unit(v3.cross(e1, e2));
  const n = Math.max(6, Math.ceil(sweep / (Math.PI / 24)));
  const path: Vec3[] = [v3.mul(d1, L1)];
  for (let k = 0; k <= n; k++) {
    const a = (sweep * k) / n;
    path.push(v3.add(c, v3.mul(v3.add(v3.mul(e1, Math.cos(a)), v3.mul(v3.cross(ax, e1), Math.sin(a))), rho)));
  }
  path.push(v3.mul(d2, L2));
  const section = { outer: circle(r, 0, 0, 20), holes: [] };
  return { ...g, profile: section, thick: 2 * r, approx: false, exact: { offset: 0 }, part: { profile: section, op: { op: "sweep", path } } };
}
