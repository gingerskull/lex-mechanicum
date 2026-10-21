// Body outlines from the record's typed `shape` (record spec v3, "shape types"), in the frame of the body's plane in the
// reference configuration. A link, plate, slot link, slider, gear, disc, wheel and shaft get their true outline; a body
// whose shape is a profile of its own (cam, cage, cross, custom) gets the disc or box that holds its joints, flagged
// `approx`, until the pilots (P) and the rebuild (R) give it a profile of its own.
import { D2R, TAU, capsule, circle, gearOutline, roundRect, roundedPoly, slot, taper, type Vec2 } from "../core/geom";
import { bevel, bevelOutline } from "../core/spatial";
import type { Kin, KinBody } from "../kin/types";
import { bodyFrameOf, type Setup } from "../kin/compose";
import { type Vec3, v3 } from "../kin/math";
import type { Op, Profile } from "../solids/types";
import { nutGeom, screwGeom } from "./screws";
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
  /**
   * The body stands where its joints put it, not on a slab of the placement solver (a bevel gear on its cone, a
   * universal joint's yoke and cross on their centre); its own part starts `offset` along the frame's z.
   */
  exact?: { offset: number };
  /** Further solids of the body's own (a yoke's bar and arms, a cross's second trunnion), in world reference frames. */
  pieces?: { id: string; name: string; frame: Frame; profile: Profile; h: number; op?: Op }[];
  /** The body's own part when it is not an extrusion of `profile` (a screw's core, revolved): its profile and operation. */
  part?: { profile: Profile; op: Op };
  /** A body of revolution about the axis it turns on (a screw): its sweep is a revolve, its samples need no probes. */
  axisym?: boolean;
  /** The body's whole footprint in its frame's plane, where its pieces reach past its own part (the placer reads it). */
  plan?: Vec2[];
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
function outlineOf(shape: Record<string, unknown>, role: string, pins: Vec2[]): { profile: Profile; thick: number; approx: boolean; scaleTop?: number; exact?: boolean } {
  const g = outlineOf0(shape, role, pins);
  // holes the record names on a disc or a plate ([x, y, r] in the body's frame): a port face's ports
  if (Array.isArray(shape.holes) && (shape.type === "disc" || shape.type === "plate"))
    for (const h of shape.holes as number[][]) g.profile.holes.push(circle(h[2]!, h[0]!, h[1]!, 28).reverse());
  return g;
}

function outlineOf0(shape: Record<string, unknown>, role: string, pins: Vec2[]): { profile: Profile; thick: number; approx: boolean; scaleTop?: number; exact?: boolean } {
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
        return { profile: { outer: bevelOutline(z, m, bv.delta), holes: [hole(bore / 2)] }, thick: bv.axial, approx: false, scaleTop: bv.inner, exact: true };
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
    // a body no joint reaches is out of the kinematics' setup: its frame is read from the record the same way
    const F = own ? (S.bodyFrame.get(b.id) ?? bodyFrameOf(b, kin.joints, S.joints, (v) => (Array.isArray(v) ? [Number(v[0]), Number(v[1]), Number(v[2] ?? 0)] : [0, 0, 0]))) : undefined;
    const frame = F ? xfFrame(F) : frameAlong(originOf(b, S, js.map((j) => j.at)), canon(axis), [1, 0, 0]);
    const pins = js.map((j) => ({ joint: j.joint.id, ...(({ uv, w }) => ({ uv, w }))(planeCoords(frame, j.at)) }));
    const shape = (b.shape ?? {}) as Record<string, unknown>;
    const g = outlineOf(shape, b.role, pins.map((p) => p.uv));
    // a body no joint reaches stands at its own frame
    const fixed = !js.length && !!F;
    const geom: BodyGeom = { id: b.id, role: b.role, frame, profile: g.profile, thick: g.thick, approx: g.approx, pins, shape, ...(g.scaleTop !== undefined ? { scaleTop: g.scaleTop } : {}), ...(g.exact || fixed ? { exact: { offset: 0 } } : {}) };
    out.set(b.id, universal(kin, S, b, geom) ?? cylinder(b, geom) ?? screwGeom(b, geom) ?? nutGeom(b, geom) ?? geom);
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

/**
 * A universal joint's yoke (a `shaft` shape with a `yoke`) or cross (a `cross` shape), from the joints at the cross
 * centre. The yoke is a hub keyed on its live shaft (the shaft is the stack's, J10), a bar across the shaft and two
 * arms reaching to the cross's pin ends, each bored for a needle cup; the cross is two trunnions on a centre block.
 * Both stand where the joints put them.
 */
function universal(kin: Kin, S: Setup, b: KinBody, g: BodyGeom): BodyGeom | null {
  const sh = g.shape;
  const isYoke = String(sh.type) === "shaft" && typeof sh.yoke === "object" && sh.yoke !== null;
  const isCross = String(sh.type) === "cross";
  if (!isYoke && !isCross) return null;
  const crossOf = (j: { a: string; b: string }) => [j.a, j.b].find((x) => String(kin.bodies.find((q) => q.id === x)?.shape?.type) === "cross");
  const F = g.frame;
  const o = F.o;
  const z = F.z;
  const along = (s: number): Vec3 => v3.add(o, v3.mul(z, s));
  const pinsOf = kin.joints.filter((j) => (j.a === b.id || j.b === b.id) && j.type === "revolute" && (isCross || crossOf(j))).map((j) => S.joints.get(j.id)!);
  if (!pinsOf.length) return null;
  const centre = pinsOf[0]!.at;
  if (isCross) {
    const r = num(sh.arm, 30);
    const d = num(sh.diameter, 10);
    const pB = pinsOf.find((q) => Math.abs(v3.dot(v3.unit(q.axis), z)) < 0.5)?.axis ?? F.x;
    const zB = v3.unit(pB);
    const block = d / 2 + 3;
    return {
      ...g,
      profile: { outer: circle(d / 2, 0, 0, 32), holes: [] },
      thick: 2 * r,
      approx: false,
      exact: { offset: v3.dot(v3.sub(centre, o), z) - r },
      pieces: [
        { id: `${b.id}-b`, name: "", frame: { o: v3.sub(centre, v3.mul(zB, r)), x: z, z: zB }, profile: { outer: circle(d / 2, 0, 0, 32), holes: [] }, h: 2 * r },
        { id: `${b.id}-block`, name: "", frame: { o: v3.sub(centre, v3.mul(z, block)), x: F.x, z }, profile: { outer: roundRect(-block, -block, block, block, 2), holes: [] }, h: 2 * block },
      ],
    };
  }
  // a yoke: s runs along the shaft (the frame's z), the centre at s = sc; the pin across it, q the third direction
  const yk = sh.yoke as Record<string, unknown>;
  const R = num(yk.radius, 30);
  const a = num(yk.arm, 8);
  const cupD = num(sh.cup, 14);
  const rb = cupD / 2 + 3;
  const sc = v3.dot(v3.sub(centre, o), z);
  const sg = Math.sign(sc) || 1;
  const p = v3.unit(pinsOf[0]!.axis);
  const sFace = sc - sg * (R + rb + 4);
  const sBar = sFace - sg * 8;
  const hub = 14;
  const rh = num(sh.diameter, 16) / 2 + 3;
  const lo = (s0: number, s1: number) => Math.min(s0, s1);
  // the bar: across the shaft, the arms' length apart, in the plane of the pin
  const half = R + a / 2;
  const bar: Vec2[] = roundRect(-half, -rb, half, rb, 3);
  const arm = (k: 1 | -1) => {
    const base = v3.add(o, v3.mul(p, k * R - a / 2));
    const ax = v3.mul(z, 1);
    const prof: Profile = { outer: roundedPoly([[sBar + sg * 2, 0], [sc, 0]], rb), holes: [circle(cupD / 2 + 0.05, sc, 0, 32).reverse()] };
    return { id: `${b.id}-arm${k > 0 ? 0 : 1}`, name: "", frame: { o: base, x: ax, z: p }, profile: prof, h: a };
  };
  return {
    ...g,
    profile: { outer: circle(rh, 0, 0, 36), holes: [] },
    thick: hub,
    approx: false,
    exact: { offset: lo(sBar, sBar - sg * hub) },
    pieces: [
      { id: `${b.id}-bar`, name: "", frame: { o: along(lo(sFace, sBar)), x: p, z }, profile: { outer: bar.map(([u, w]): Vec2 => [u, w]), holes: [] }, h: 8 },
      arm(1),
      arm(-1),
    ],
  };
}

/**
 * A cylinder that swings on a trunnion (`cylinder`) and its piston on a rod (`piston`), in the body's frame: x along
 * the bore, z the trunnion's axis. The cylinder is a port pad on the trunnion, its flat port face at `face`, the port
 * drilled through it at `port` [x, r]; a tube on the pad along x at `axis` height, open at the rod end through a gland,
 * closed at the other. The piston is a rod from its eye on the crank pin to a head that fills the bore. Both stand
 * where their joints put them.
 */
function cylinder(b: KinBody, g: BodyGeom): BodyGeom | null {
  const sh = g.shape;
  const type = String(sh.type);
  if (type !== "cylinder" && type !== "piston") return null;
  const F = g.frame;
  const yv = v3.cross(F.z, F.x);
  const at = (x: number, y: number, z: number): Vec3 => v3.add(F.o, v3.add(v3.mul(F.x, x), v3.add(v3.mul(yv, y), v3.mul(F.z, z))));
  const h = num(sh.axis, 14);
  const bore = num(sh.bore, 40);
  if (type === "cylinder") {
    const R = bore / 2 + num(sh.wall, 6);
    const [x0, x1] = pair(sh.span, [-46, 46]);
    const face = num(sh.face, -14);
    const [p0, p1, pw] = (Array.isArray(sh.pad) ? sh.pad : [-12, 40, 28]) as number[];
    const [px, pr] = pair(sh.port, [30, 2.5]);
    const tube = (id: string, a: number, c: number, holeR: number) => ({ id, name: "", frame: { o: at(a, 0, h), x: F.z, z: F.x }, profile: { outer: circle(R, 0, 0, 48), holes: holeR > 0 ? [circle(holeR, 0, 0, 40).reverse()] : [] }, h: c - a });
    return {
      ...g,
      frame: F,
      profile: { outer: roundRect(p0!, -pw! / 2, p1!, pw! / 2, 4), holes: [circle(pr, px, 0, 24).reverse()] },
      // the pad rises from the port face into the tube's wall, short of the bore
      thick: h - bore / 2 - face,
      approx: false,
      exact: { offset: face },
      plan: roundRect(x0 - 5, -R, x1 + 5, R, 4),
      pieces: [tube(`${b.id}-tube`, x0, x1, bore / 2), tube(`${b.id}-head`, x1, x1 + 5, 0), tube(`${b.id}-gland`, x0 - 5, x0, num(sh.rod, 10) / 2 + 0.5)],
    };
  }
  // the piston: its eye on the crank pin at the origin, the rod along x to the head
  const L = num(sh.length, 120);
  const rod = num(sh.rod, 10);
  const eye = num(sh.eye, 9);
  const [hl, hd] = pair(sh.head, [16, bore - 1]);
  return {
    ...g,
    profile: { outer: circle(eye, 0, 0, 36), holes: [] },
    thick: rod,
    approx: false,
    exact: { offset: h - rod / 2 },
    plan: roundedPoly([[0, 0], [L + hl / 2, 0]], Math.max(eye, hd / 2)),
    pieces: [
      { id: `${b.id}-rod`, name: "", frame: { o: at(eye - 2, 0, h), x: F.z, z: F.x }, profile: { outer: circle(rod / 2, 0, 0, 24), holes: [] }, h: L - hl / 2 - (eye - 2) },
      { id: `${b.id}-head`, name: "", frame: { o: at(L - hl / 2, 0, h), x: F.z, z: F.x }, profile: { outer: circle(hd / 2, 0, 0, 48), holes: [] }, h: hl },
    ],
  };
}

const rot = (pts: Vec2[], a: number): Vec2[] => pts.map(([x, y]): Vec2 => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)]);
