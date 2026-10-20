// The default view (T7) as a viewing direction, and projection along it: what a support covers (T10) is read in the view
// the page opens in.
import { type Mat3, type Vec3, m3, v3 } from "../kin/math";
import type { Mat4 } from "../solids/frame";
import type { manifold } from "../solids/manifold";

type Wasm = Awaited<ReturnType<typeof manifold>>;
type Mf = InstanceType<Wasm["Manifold"]>;
type Cs = InstanceType<Wasm["CrossSection"]>;

/** The direction the eye looks along for a named view (record spec, `teaching.view`). `axis` is a joint's axis for AUX. */
export function viewDirection(view: string | undefined, axisOf: (joint: string) => Vec3 | undefined): Vec3 {
  const v = (view ?? "PLAN").trim();
  const up = v.toUpperCase();
  if (up === "PLAN") return [0, 0, -1];
  if (up === "FRONT") return [0, 1, 0];
  if (up === "SIDE") return [-1, 0, 0];
  if (up === "ISOMETRIC") return v3.unit([-1, 1, -1]);
  if (up === "DIMETRIC") return v3.unit([-0.35, 0.85, -0.5]);
  const aux = /^AUX\s+(\S+)/i.exec(v);
  if (aux) {
    const a = axisOf(aux[1]!);
    if (a) return v3.mul(a, -1);
  }
  const vw = /^VIEW\s+(-?[\d.]+)\s+(-?[\d.]+)/i.exec(v);
  if (vw) {
    const az = (Number(vw[1]) * Math.PI) / 180;
    const el = (Number(vw[2]) * Math.PI) / 180;
    const eye: Vec3 = [Math.sin(az) * Math.cos(el), -Math.cos(az) * Math.cos(el), Math.sin(el)];
    return v3.mul(eye, -1);
  }
  return [0, 0, -1];
}

/** Rotation taking `dir` to the plan direction (0, 0, -1). */
export function toPlan(dir: Vec3): Mat3 {
  const t: Vec3 = [0, 0, -1];
  const d = v3.unit(dir);
  const c = v3.cross(d, t);
  const s = v3.len(c);
  const k = v3.dot(d, t);
  if (s < 1e-9) return k > 0 ? [1, 0, 0, 0, 1, 0, 0, 0, 1] : [1, 0, 0, 0, -1, 0, 0, 0, -1];
  return m3.axisAngle(c, Math.atan2(s, k));
}

const mat16 = (R: Mat3): Mat4 => [R[0], R[3], R[6], 0, R[1], R[4], R[7], 0, R[2], R[5], R[8], 0, 0, 0, 0, 1];

/** The outline of a solid shape seen along `dir`, in the view's plane. */
export function projectAlong(m: Mf, dir: Vec3): Cs {
  if (Math.abs(dir[0]) < 1e-9 && Math.abs(dir[1]) < 1e-9 && dir[2] < 0) return m.project();
  const r = m.transform(mat16(toPlan(dir)));
  const out = r.project();
  r.delete();
  return out;
}
