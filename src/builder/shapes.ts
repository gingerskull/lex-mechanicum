// Body outlines from the record's typed `shape` (record spec v3, "shape types"), in the frame of the body's plane in the
// reference configuration. A link, plate, slot link, slider, gear, disc, wheel and shaft get their true outline; a body
// whose shape is a profile of its own (cam, cage, cross, custom) gets the disc or box that holds its joints, flagged
// `approx`, until the pilots (P) and the rebuild (R) give it a profile of its own.
import { D2R, TAU, capsule, circle, gearOutline, roundRect, roundedPoly, slot, taper, type Vec2 } from "../core/geom";
import { bevel, bevelOutline } from "../core/spatial";
import type { Kin, KinBody } from "../kin/types";
import type { Setup } from "../kin/compose";
import { type Vec3, v3 } from "../kin/math";
import type { Profile } from "../solids/types";
import { canon, frameAlong, planeCoords, xfFrame, type Frame } from "./frames";
import { THICK } from "./constants";

export interface BodyGeom {
  id: string;
  role: string;
  /** The body's plane in the world reference configuration: origin at its joint, x toward the next joint, z the normal. */
  frame: Frame;
  profile: Profile;
  thick: number;
  /** The outline is a stand-in (a disc or box round the body's joints). */
  approx: boolean;
  /** The body's joints in its plane coordinates. */
  pins: { joint: string; uv: Vec2; w: number }[];
  /** The shape the record gave. */
  shape: Record<string, unknown>;
  /** A bevel gear's toothed frustum: the scale of its inner end, toward the apex along +z (D8). */
  scaleTop?: number;
}

const num = (v: unknown, d: number): number => (typeof v === "number" && Number.isFinite(v) ? v : d);
const pair = (v: unknown, d: [number, number]): [number, number] => (Array.isArray(v) && v.length >= 2 ? [num(v[0], d[0]), num(v[1], d[1])] : d);

/** Reference position of a body's origin: its `at` joint, else its frame origin, else the centre of its joints. */
function originOf(body: KinBody, S: Setup, pins: Vec3[]): Vec3 {
  if (body.at?.joint && S.joints.has(body.at.joint)) return S.joints.get(body.at.joint)!.at;
  const f = S.bodyFrame.get(body.id);
  if (f && (f.t[0] || f.t[1] || f.t[2])) return f.t;
  // a body no joint reaches carries its own frame in the record
  const f0 = body.frame ?? body.at?.frame;
  const own = f0?.o ?? f0?.origin;
  if (own && own.every((v) => typeof v === "number")) return [own[0] as number, own[1] as number, (own[2] as number | undefined) ?? 0];
  if (!pins.length) return [0, 0, 0];
  const s = pins.reduce((a, p) => v3.add(a, p), [0, 0, 0] as Vec3);
  return v3.mul(s, 1 / pins.length);
}

/** Outline in plane coordinates for each shape type. `pins` are the body's joints in those coordinates. */
function outlineOf(shape: Record<string, unknown>, role: string, pins: Vec2[]): { profile: Profile; thick: number; approx: boolean; scaleTop?: number } {
  const type = String(shape.type ?? "");
  const far = pins.reduce((m, p) => Math.max(m, Math.hypot(p[0], p[1])), 0);
  const hole = (r: number): Vec2[] => circle(r, 0, 0, 28);
  switch (type) {
    case "link": {
      const L = num(shape.length, far);
      const [r0, r1] = pair(shape.boss, [8, 8]);
      return { profile: { outer: L > Math.abs(r0 - r1) + 1 ? taper(L, r0, r1) : circle(Math.max(r0, r1), 0, 0, 36), holes: [] }, thick: THICK, approx: false };
    }
    case "plate": {
      const pts = Array.isArray(shape.outline) ? (shape.outline as number[][]).map((q): Vec2 => [q[0]!, q[1]!]) : null;
      const r = num(shape.boss, 8.5);
      if (pts && pts.length >= 2) return { profile: { outer: roundedPoly(pts, r), holes: [] }, thick: THICK, approx: false };
      if (Array.isArray(shape.rect)) {
        const [w, h] = pair(shape.rect, [60, 40]);
        return { profile: { outer: roundRect(0, 0, w, h, Math.min(8, w / 4, h / 4)), holes: [] }, thick: num(shape.thickness, 8), approx: false };
      }
      break;
    }
    case "slotLink": {
      const L = num(shape.length, far);
      const w = num(shape.width, 22);
      const sl = Array.isArray(shape.slot) ? pair(shape.slot, [L * 0.3, L * 0.7]) : [L * 0.25, L * 0.25 + num(shape.slot, L * 0.4)];
      return { profile: { outer: roundedPoly([[0, 0], [L, 0]], w / 2), holes: [slot(sl[0]!, sl[1]!, 0, num(shape.slotWidth, 12) / 2)] }, thick: THICK, approx: false };
    }
    case "slider": {
      const L = num(shape.length, 36);
      const W = num(shape.width, 20);
      return { profile: { outer: roundRect(-L / 2, -W / 2, L / 2, W / 2, Math.min(6, W / 2 - 0.5)), holes: [] }, thick: num(shape.thickness, 7), approx: false };
    }
    case "disc": {
      const r = num(shape.radius, 20);
      const c = pair(shape.center, [0, 0]);
      const bore = num(shape.bore, 0);
      return { profile: { outer: circle(r, c[0], c[1], Math.max(36, Math.round(r * 3))), holes: bore ? [hole(bore / 2)] : [] }, thick: num(shape.thickness, 8), approx: false };
    }
    case "gear": {
      const z = num(shape.z, 20);
      const m = num(shape.module, 2);
      const bore = num(shape.bore, 6);
      if (typeof shape.cone === "number") {
        // a straight bevel gear: Tredgold's back-cone teeth at the outer end, tapering toward the apex over the face
        const bv = bevel(z, m, shape.cone * D2R, num(shape.face, 0) || undefined);
        return { profile: { outer: bevelOutline(z, m, bv.delta), holes: [hole(bore / 2)] }, thick: bv.axial, approx: false, scaleTop: bv.inner };
      }
      return { profile: { outer: gearOutline(z, m), holes: [hole(bore / 2)] }, thick: num(shape.face, 10), approx: false };
    }
    case "ringGear": {
      const z = num(shape.z, 40);
      const m = num(shape.module, 3);
      const rim = num(shape.rim, (z * m) / 2 + 12);
      return { profile: { outer: circle(rim, 0, 0, 72), holes: [gearOutline(z, m, 1.25, 1).reverse()] }, thick: num(shape.face, 10), approx: false };
    }
    case "pulley":
    case "sprocket": {
      const z = num(shape.z, 20);
      const p = num(shape.pitch, 8);
      const r = (z * p) / TAU + (type === "pulley" ? 1.4 : 2.5);
      return { profile: { outer: circle(r, 0, 0, Math.max(36, Math.round(r * 3))), holes: [hole(num(shape.bore, 8) / 2)] }, thick: num(shape.face, 10), approx: false };
    }
    case "shaft": {
      const d = num(shape.diameter, 8);
      return { profile: { outer: circle(d / 2, 0, 0, 24), holes: [] }, thick: num(shape.length, 40), approx: false };
    }
    case "rack": {
      const L = num(shape.length, 120);
      const h = num(shape.height, 20);
      return { profile: { outer: roundRect(-L / 2, -h, L / 2, 0, 1), holes: [] }, thick: num(shape.face, 12), approx: false };
    }
    default:
      break;
  }
  void role;
  // a stand-in: a capsule through the farthest joint, or a disc round a single one
  const R = Math.max(10, num(shape.radius, 0), (num(shape.diameter, 0) || 0) / 2);
  if (pins.length >= 2 && far > 1) {
    const f = pins.reduce((a, p) => (Math.hypot(p[0], p[1]) > Math.hypot(a[0], a[1]) ? p : a), pins[0]!);
    const ang = Math.atan2(f[1], f[0]);
    const cap = capsule(Math.hypot(f[0], f[1]), 2 * R);
    const c = Math.cos(ang);
    const s = Math.sin(ang);
    return { profile: { outer: cap.map(([x, y]): Vec2 => [c * x - s * y, s * x + c * y]), holes: [] }, thick: THICK, approx: true };
  }
  return { profile: { outer: circle(R, 0, 0, 36), holes: [] }, thick: THICK, approx: true };
}

/** The geometry of every body of the record except the ground, in the reference configuration. */
export function bodyGeoms(kin: Kin, S: Setup): Map<string, BodyGeom> {
  const out = new Map<string, BodyGeom>();
  for (const b of kin.bodies) {
    if (b.id === "ground") continue;
    const js = kin.joints.filter((j) => j.a === b.id || j.b === b.id).map((j) => S.joints.get(j.id)!);
    const at = b.at?.joint ? S.joints.get(b.at.joint) : undefined;
    const axis = at?.axis ?? js[0]?.axis ?? ([0, 0, 1] as Vec3);
    // the body's own frame (src/kin: bodyFrameOf), which its shape and its points are given in; a body with neither an
    // `at` joint nor a frame of its own stands round its joints in world axes
    const own = b.at?.joint || (b.frame && typeof b.frame === "object") || b.at?.frame;
    const F = own ? S.bodyFrame.get(b.id) : undefined;
    const frame = F ? xfFrame(F) : frameAlong(originOf(b, S, js.map((j) => j.at)), canon(axis), [1, 0, 0]);
    const pins = js.map((j) => ({ joint: j.joint.id, ...(({ uv, w }) => ({ uv, w }))(planeCoords(frame, j.at)) }));
    const shape = (b.shape ?? {}) as Record<string, unknown>;
    const g = outlineOf(shape, b.role, pins.map((p) => p.uv));
    out.set(b.id, { id: b.id, role: b.role, frame, profile: g.profile, thick: g.thick, approx: g.approx, pins, shape, ...(g.scaleTop !== undefined ? { scaleTop: g.scaleTop } : {}) });
  }
  phaseMeshes(kin, S, out);
  return out;
}

/**
 * Gears in mesh are turned so a tooth of the first meets a gap of the second at the mesh point (J6, J9): an outline
 * has a tooth on its x axis, so the first is turned to put one on the mesh point and the second half a tooth further.
 * A gear already turned by an earlier mesh keeps its turn.
 */
function phaseMeshes(kin: Kin, S: Setup, geoms: Map<string, BodyGeom>): void {
  const turned = new Set<string>();
  for (const j of kin.joints) {
    if (j.type !== "gear-mesh") continue;
    const at = S.joints.get(j.id)?.at;
    if (!at) continue;
    ([[j.a, 0], [j.b, 1]] as const).forEach(([id, k]) => {
      const g = geoms.get(id);
      if (!g || turned.has(id) || String(g.shape.type) !== "gear") return;
      const z = num(g.shape.z, 20);
      const uv = planeCoords(g.frame, at).uv;
      const a = Math.atan2(uv[1], uv[0]) + (k ? Math.PI / z : 0);
      if (Math.abs(a) > 1e-9) g.profile = { outer: rot(g.profile.outer, a), holes: g.profile.holes.map((h) => rot(h, a)) };
      turned.add(id);
    });
  }
}

const rot = (pts: Vec2[], a: number): Vec2[] => pts.map(([x, y]): Vec2 => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)]);
