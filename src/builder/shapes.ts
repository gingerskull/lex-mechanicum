// Body outlines from the record's typed `shape` (record spec v3, "shape types"), in the frame of the body's plane in the
// reference configuration. A link, plate, slot link, slider, gear, disc, wheel and shaft get their true outline; a body
// whose shape is a profile of its own (cam, cage, cross, custom) gets the disc or box that holds its joints, flagged
// `approx`, until the pilots (P) and the rebuild (R) give it a profile of its own. Each family's outlines and special
// geometries are in a file of their own under ./shapes; the tables here dispatch to them.
import { area, capsule, circle, type Vec2 } from "../core/geom";
import { filletPoly } from "../hardware/primitives";
import { hullOf } from "../hardware/primitives";
import type { Kin, KinBody } from "../kin/types";
import { bodyFrameOf, type Setup } from "../kin/compose";
import { type Vec3, m3, v3 } from "../kin/math";
import type { LoftSection, Mark, MeshData, Op, Profile } from "../solids/types";
import type { Bevel3 } from "./bevel3";
import { inside } from "../core/poly";
import { nutGeom, screwGeom } from "./screws";
import { flexureGeom } from "./compliant";
import { forkGeom, sheaveGeom } from "./cvt";
import { ballGeom, carriageGeom } from "./integrator";
import { canon, frameAlong, planeCoords, xfFrame, type Frame } from "./frames";
import { THICK } from "./constants";
import { type GeomFn, type Outline, type OutlineFn, num, pair, rot, signedArea } from "./shapes/common";
import { PLAIN_OUTLINES, PLAIN_PROFILES } from "./shapes/plain";
import { GEAR_OUTLINES } from "./shapes/gears";
import { clusterLevels, matchBevelDepth, phaseMeshes, seatBevels } from "./shapes/meshing";
import { DRIVE_PROFILES, flexWall } from "./shapes/drives";
import { ENGINE_PROFILES, cylinder } from "./shapes/engines";
import { plateCam } from "./shapes/cams";
import { INDEXER_OUTLINES, ringWheel, turretRollers } from "./shapes/indexers";
import { TIMED_OUTLINES, crown, vergeStaff } from "./shapes/timed";
import { SPATIAL_OUTLINES, ballProfile, spatialLink, spherical, universal } from "./shapes/spatial";
import { wobble } from "./shapes/wobble";
import { elbowGeom } from "./shapes/elbow";
import { patternMarks } from "./decor";
import { SOLID_KINDS } from "../style/kinds";
import { swingCam } from "./shapes/swingcam";

export { spider } from "./shapes/plain";
export { levelId, meshLevel } from "./shapes/meshing";
export { cycloidalDisc, flexTooth, flexWall } from "./shapes/drives";
export { ballProfile } from "./shapes/spatial";

/**
 * A further level of a body, in a slab of its own: a compound gear's next gear (a `gear` with `cluster`), a gear fixed
 * on a link's end (a `link` with `gear`, centred on one of its joints) or a disc under a gear (a `gear` with `disc`, a
 * flywheel). `z` is its tooth count (0 for a disc), `center` its centre in the body's frame, `below` that it stands
 * under the body's part instead of over it.
 */
export interface Level {
  z: number;
  profile: Profile;
  thick: number;
  center?: Vec2;
  below?: boolean;
  /** The level runs down to the part under it as one piece (a long pinion through two slabs). */
  joined?: boolean;
}

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
  /** A helical gear's teeth: the turn of the outline over its face, degrees, counter-clockwise for a right hand (D8). */
  twist?: number;
  /** A part made by a loft (a herringbone gear's two halves and its groove): the sections above the profile's z = 0. */
  loft?: LoftSection[];
  /**
   * The body stands where its joints put it, not on a slab of the placement solver (a bevel gear on its cone, a
   * universal joint's yoke and cross on their centre); its own part starts `offset` along the frame's z.
   */
  exact?: { offset: number };
  /** The own part is the floor under a piece of the same body (an internal Geneva wheel's web under its slotted ring). */
  floor?: boolean;
  /** Further solids of the body's own (a yoke's bar and arms, a cross's second trunnion), in world reference frames. */
  pieces?: { id: string; name: string; frame: Frame; profile: Profile; h: number; revolve?: boolean; op?: Op; features?: import("../solids/types").Feature[]; marks?: import("../solids/types").Mark[]; kind?: import("../style/kinds").SolidKind }[];
  /** The own part is a solid of revolution about the frame's z (a ball, a cage), its profile in (r, z). */
  revolve?: boolean;
  /** The body's own part when it is not an extrusion of `profile` (a screw's core, revolved): its profile and operation. */
  part?: { profile: Profile; op: Op };
  /** A body of revolution about the axis it turns on (a screw): its sweep is a revolve, its samples need no probes. */
  axisym?: boolean;
  /** Shapes cut from or added to the part (a cam's groove), in the part's own coordinates (D8: a boolean result). */
  features?: import("../solids/types").Feature[];
  /**
   * The part as a closed mesh where no operation makes it (a bevel gear's teeth on the back cone, src/builder/bevel3.ts):
   * drawn and packed as it is, while `profile`, `thick` and `scaleTop` stand for it in the planning and the checks.
   */
  mesh?: MeshData;
  /** The bevel teeth `mesh` was made from, made again when the pair's depth module is known (matchBevelDepth). */
  teeth?: Bevel3;
  /** The body's whole footprint in its frame's plane, where its pieces reach past its own part (the placer reads it). */
  plan?: Vec2[];
  /**
   * A compound gear's further toothed levels on the same body (a cluster: a `gear` with `cluster`), each in a slab of
   * its own above the body's part; a mesh whose tooth count for this body is a level's meshes with that level.
   */
  levels?: Level[];
  /**
   * A second plate on top of the part, `h` of the body's thickness (a slotted link's upper cheek over a solid lower one,
   * so a die runs in a groove and a trunnion can stand under it): the part is the lower plate.
   */
  upper?: { profile: Profile; h: number; name?: string; lift?: number; lower?: number };
  /**
   * Placed at another body's slab rather than one of its own (a stationary gear in the rotor's gear ring, an engine's
   * housing round its rotor, its side cover over it): `part` "lower", "upper" (that body's upper plate), "all" or
   * "above" it, `gap` mm further along the normal.
   */
  level?: { with: string; part: "lower" | "upper" | "all" | "above"; gap?: number };
}

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
function outlineOf(shape: Record<string, unknown>, role: string, pins: Vec2[]): Outline {
  const g = outlineOf0(shape, role, pins);
  // a window along a plate's x (a shuttle's window for the pusher's roller): { from, to, width }
  const win = shape.window as { from?: unknown; to?: unknown; width?: unknown } | undefined;
  if (win && shape.type === "plate") {
    const w = num(win.width, 10) / 2;
    const x0 = num(win.from, 0) + w;
    const x1 = num(win.to, 20) - w;
    const ring: Vec2[] = [];
    for (let i = 0; i <= 16; i++) ring.push([x1 + w * Math.cos(-Math.PI / 2 + (Math.PI * i) / 16), w * Math.sin(-Math.PI / 2 + (Math.PI * i) / 16)]);
    for (let i = 0; i <= 16; i++) ring.push([x0 + w * Math.cos(Math.PI / 2 + (Math.PI * i) / 16), w * Math.sin(Math.PI / 2 + (Math.PI * i) / 16)]);
    g.profile.holes.push(ring.reverse());
  }
  // an arm a plate carries in its own plane (a pusher's arm to its roller): the placer sees its whole footprint
  const arm = shape.arm as { from?: unknown; to?: unknown; width?: unknown } | undefined;
  if (arm && shape.type === "plate") {
    const p0: Vec2 = Array.isArray(arm.from) ? [num(arm.from[0], 0), num(arm.from[1], 0)] : [0, 0];
    const p1: Vec2 = Array.isArray(arm.to) ? [num(arm.to[0], 0), num(arm.to[1], 0)] : [0, 0];
    const w = num(arm.width, 10) / 2;
    g.plan = hullOf([...g.profile.outer.map((q): [number, number, number] => [q[0], q[1], 0.5]), [p0[0], p0[1], Math.max(w, num(shape.roller, 0) / 2)], [p1[0], p1[1], w]]);
  }
  // holes the record names on a disc or a plate ([x, y, r] in the body's frame): a port face's ports
  if (Array.isArray(shape.holes) && (shape.type === "disc" || shape.type === "plate"))
    for (const h of shape.holes as number[][]) g.profile.holes.push(circle(h[2]!, h[0]!, h[1]!, 28).reverse());
  // windows the record draws as polygons (a spider's windows over the sprags)
  if (Array.isArray(shape.windows))
    for (const w of shape.windows as number[][][]) {
      const ring = w.map((q): Vec2 => [q[0]!, q[1]!]);
      g.profile.holes.push(area(ring) > 0 ? ring.reverse() : ring);
    }
  return g;
}

/**
 * The outline of each shape type: a family's types are in a file of its own under ./shapes, added here with one line. A
 * `custom` shape's profiles are tried in turn, each family's in order: the first that knows the profile draws it.
 */
const CUSTOM_PROFILES: OutlineFn[] = [...DRIVE_PROFILES, ...ENGINE_PROFILES, ...PLAIN_PROFILES];
const OUTLINES: Record<string, OutlineFn> = {
  ...PLAIN_OUTLINES,
  ...GEAR_OUTLINES,
  ...INDEXER_OUTLINES,
  ...TIMED_OUTLINES,
  ...SPATIAL_OUTLINES,
  custom: (shape, pins, far, type) => CUSTOM_PROFILES.reduce<Outline | null>((o, f) => o ?? f(shape, pins, far, type), null),
};

function outlineOf0(shape: Record<string, unknown>, role: string, pins: Vec2[]): Outline {
  const type = String(shape.type ?? "");
  const far = pins.reduce((m, p) => Math.max(m, Math.hypot(p[0], p[1])), 0);
  const own = OUTLINES[type]?.(shape, pins, far, type);
  if (own) return own;
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

/**
 * The bodies with a geometry of their own beyond their outline, in order: the first that knows the body's shape
 * builds it, else the outline stands. A family adds its geometries here, each in its place in the order.
 */
const GEOMS: GeomFn[] = [
  universal,
  (_kin, _S, b, g) => cylinder(b, g),
  swingCam,
  plateCam,
  (_kin, _S, _b, g) => ringWheel(g),
  crown,
  (_kin, _S, _b, g) => vergeStaff(g),
  (_kin, _S, b, g) => screwGeom(b, g),
  (_kin, _S, b, g) => nutGeom(b, g),
  (kin, _S, b, g) => flexureGeom(kin, b, g),
  sheaveGeom,
  forkGeom,
  (_kin, _S, b, g) => ballGeom(b, g),
  (kin, _S, b, g) => carriageGeom(kin, b, g),
  (_kin, S, _b, g) => spatialLink(S, g),
  spherical,
  wobble,
  elbowGeom,
];

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
    // a slider's block lies along its slide: its length on the prismatic joint's axis, whatever the body's frame
    const slide = String(shape.type) === "slider" ? js.find((j) => j.joint.type === "prismatic") : undefined;
    if (slide) {
      const d = planeCoords(frame, v3.add(frame.o, slide.axis)).uv;
      const o = planeCoords(frame, frame.o).uv;
      const ang = Math.atan2(d[1] - o[1], d[0] - o[0]);
      if (Math.abs(Math.sin(ang)) > 1e-6) g.profile = { outer: rot(g.profile.outer, ang), holes: g.profile.holes.map((h) => rot(h, ang)) };
      // (on ground ways, the room its rails, risers and keeper take is kept by the placer's rail zone)
    }
    // a body no joint reaches stands at its own frame, unless it is placed at another body's level
    const lv = shape.level as BodyGeom["level"] | undefined;
    const fixed = !js.length && !!F && !lv;
    // `place`: the part starts that far along its frame's z, where the joints put it (a roller down in a groove), not on a slab
    const placed = typeof shape.place === "number" ? { exact: { offset: shape.place } } : g.exact || fixed ? { exact: { offset: g.exactOffset ?? 0 } } : {};
    const geom: BodyGeom = { id: b.id, role: b.role, frame, profile: g.profile, thick: g.thick, approx: g.approx, pins, shape, ...(g.upper ? { upper: g.upper } : {}), ...(lv ? { level: lv } : {}), ...(g.plan ? { plan: g.plan } : {}), ...(g.scaleTop !== undefined ? { scaleTop: g.scaleTop } : {}), ...(g.twist ? { twist: g.twist } : {}), ...(g.loft ? { loft: g.loft } : {}), ...(g.features ? { features: g.features } : {}), ...(g.mesh ? { mesh: g.mesh } : {}), ...(g.teeth ? { teeth: g.teeth } : {}), ...placed };
    const levels = clusterLevels(shape, pins);
    if (levels.length) geom.levels = levels;
    // a differential's case: its ring gear (the part) and a cage frame round the spiders and side gears, in the plane of
    // the cross-pin and the case's axis (`cage`: from, to along the axis; half its height along the pin; its wall; its
    // thickness across; reach, how far its end member runs out to bolt to the ring gear's back face)
    if (String(shape.type) === "gear" && shape.cage && typeof shape.cage === "object") {
      const cg = shape.cage as Record<string, unknown>;
      const x0 = num(cg.from, -40);
      const x1 = num(cg.to, 30);
      const h = num(cg.half, 50);
      const w = num(cg.wall, 6);
      const R = num(cg.reach, h);
      const t = num(cg.thickness, 10);
      // the cage's plane: the case's axis (frame z) and the cross-pin (frame x); its normal the third direction
      const n = v3.cross(frame.z, frame.x);
      const outer: Vec2[] = [[x0, -h], [x1 - w, -h], [x1 - w, -R], [x1, -R], [x1, R], [x1 - w, R], [x1 - w, h], [x0, h]];
      const win: Vec2[] = [[x0 + w, -h + w], [x0 + w, h - w], [x1 - w, h - w], [x1 - w, -h + w]];
      geom.pieces = [...(geom.pieces ?? []), { id: `${b.id}-cage`, name: "Case cage, bolted to the ring gear, carries the cross-pin", frame: { o: v3.add(frame.o, v3.mul(n, -t / 2)), x: frame.z, z: n }, profile: { outer, holes: [win] }, h: t }];
    }
    // a flexspline segment's strip of the cup wall, down from its rim
    const ft = ((shape.profile ?? {}) as Record<string, unknown>).flexTooth as Record<string, unknown> | undefined;
    if (String(shape.type) === "custom" && ft && typeof ft.wall === "object" && ft.wall) {
      const wl = ft.wall as Record<string, unknown>;
      const L = num(wl.length, 20);
      geom.pieces = [...(geom.pieces ?? []), { id: `${b.id}-wall`, name: "", frame: { o: v3.add(frame.o, v3.mul(frame.z, -L)), x: frame.x, z: frame.z }, profile: { outer: flexWall(num(ft.z, 30), num(ft.module, 2), num(ft.inner, 26.5), num(wl.thickness, 0.8), num(ft.k, 0), num(ft.w0, 0)), holes: [] }, h: L }];
    }
    // a pulley or sprocket turns on its own axis: its sweep is a revolve, its samples need no probes
    // (a wheel or disc on a ground revolute whose axis runs through the body's own frame, along its z)
    if (["pulley", "sprocket", "disc"].includes(String(shape.type))) {
      const rev = js.find((r) => r.joint.type === "revolute" && (r.joint.a === "ground" || r.joint.b === "ground"));
      if (rev && Math.abs(Math.abs(v3.dot(v3.unit(rev.axis), frame.z)) - 1) < 1e-6 && v3.len(v3.cross(v3.sub(frame.o, rev.at), v3.unit(rev.axis))) < 1e-6) geom.axisym = true;
    }
    const built = GEOMS.reduce<BodyGeom | null>((r, f) => r ?? f(kin, S, b, geom), null) ?? geom;
    if (built.shape.rollers && typeof built.shape.rollers === "object") built.pieces = [...(built.pieces ?? []), ...turretRollers(built)];
    out.set(b.id, withPieces(b, withIndex(withBars(withBall(built)))));
  }
  matchBevelDepth(kin, out);
  seatBevels(kin, S, out);
  phaseMeshes(kin, S, out);
  return out;
}

/**
 * Plates of a body beyond its own part, declared in its shape (`pieces`: { id, outline, origin, rot, thick, fillet }, the
 * frame in world reference coordinates, the outline filleted as drawn): an upright on a slide that carries a roller's stud.
 * The frame may instead give its axes, `x` and `z`. A piece may be turned (`op: "revolve"`, its `profile` the half
 * section [r, z] about the frame's z: a turned leg), carry marks on its top face (`marks`: [{ kind, pts }], carved
 * lines and features) and a fill pattern there (`pattern`: "quilt" or "hatch", or { kind, angle, pitch, inset }, laid
 * by src/builder/decor.ts), and be `ornament: true` (decoration on themed scenery, the first rung of the detail ladder)
 * or name a solid `kind` of its own (a rubber bump stop).
 */
function withPieces(b: KinBody, g: BodyGeom): BodyGeom {
  const list = g.shape.pieces;
  if (!Array.isArray(list) || !list.length) return g;
  const pieces = [...(g.pieces ?? [])];
  list.forEach((pc: Record<string, unknown>, k) => {
    const o = (pc.origin as number[] | undefined) ?? [0, 0, 0];
    const R = m3.eulerDeg(((pc.rot as number[] | undefined) ?? [0, 0, 0]) as Vec3);
    const axis = (v: unknown): Vec3 | null => (Array.isArray(v) && v.length >= 3 ? v3.unit([Number(v[0]), Number(v[1]), Number(v[2])]) : null);
    const z = axis(pc.z) ?? ([R[2], R[5], R[8]] as Vec3);
    const x0 = axis(pc.x) ?? ([R[0], R[3], R[6]] as Vec3);
    // axes the record gives are made square; a rotation's are square already
    const frame = { o: [o[0]!, o[1]!, o[2] ?? 0] as Vec3, x: pc.x || pc.z ? v3.unit(v3.sub(x0, v3.mul(z, v3.dot(x0, z)))) : x0, z };
    const id = `${b.id}-${String(pc.id ?? `piece${k}`)}`;
    // decoration takes the ornament kind; a piece that is a part of a kind of its own (a rubber bump stop) names it
    const named = SOLID_KINDS.find((k) => k === pc.kind);
    const kind = pc.ornament === true ? ({ kind: "ornament" } as const) : named ? { kind: named } : {};
    if (pc.op === "revolve") {
      const half = (pc.profile as number[][]).map((q): Vec2 => [Math.max(0, q[0]!), q[1]!]);
      pieces.push({ id, name: String(pc.name ?? ""), frame, profile: { outer: half, holes: [] }, h: 0, revolve: true, ...kind });
      return;
    }
    const pts = (pc.outline as number[][]).map((q): Vec2 => [q[0]!, q[1]!]);
    const holes = Array.isArray(pc.holes) ? (pc.holes as number[][][]).map((h) => { const r = h.map((q): Vec2 => [q[0]!, q[1]!]); return area(r) > 0 ? r.reverse() : r; }) : [];
    const profile = { outer: filletPoly(area(pts) < 0 ? pts.slice().reverse() : pts, num(pc.fillet, 1.5)), holes };
    const marks: Mark[] = Array.isArray(pc.marks) ? (pc.marks as { kind?: string; pts: number[][] }[]).map((m) => ({ kind: m.kind === "quilt" ? "quilt" : "carve", pts: m.pts.map((q): Vec2 => [q[0]!, q[1]!]) })) : [];
    const pat = pc.pattern as string | { kind?: string; angle?: number; pitch?: number; inset?: number } | undefined;
    const pk = typeof pat === "string" ? pat : pat?.kind;
    if (pk === "quilt" || pk === "hatch") marks.push(...patternMarks(profile, pk, typeof pat === "object" ? pat : {}));
    pieces.push({ id, name: String(pc.name ?? ""), frame, profile, h: num(pc.thick, 8), ...(marks.length ? { marks } : {}), ...kind });
  });
  return { ...g, pieces };
}

/**
 * A link that ends in a ball (`ball: { diameter }`, a governor's flyweight): a sphere on the link's far end, centred in
 * its thickness. Only for a part the record places itself (`place`), whose thickness is known here.
 */
function withBall(g: BodyGeom): BodyGeom {
  const ball = g.shape.ball as { diameter?: unknown } | undefined;
  const type = String(g.shape.type);
  if (!ball || (type !== "link" && type !== "shaft") || !g.exact) return g;
  const r = num(ball.diameter, 30) / 2;
  // a link's ball on its far end, in its thickness; a shaft's (a plunger's ball end) on its start
  const o = type === "shaft" ? v3.add(g.frame.o, v3.mul(g.frame.z, g.exact.offset)) : v3.add(g.frame.o, v3.add(v3.mul(g.frame.x, num(g.shape.length, 0)), v3.mul(g.frame.z, g.exact.offset + g.thick / 2)));
  return { ...g, pieces: [...(g.pieces ?? []), { id: `${g.id}-ball`, name: type === "shaft" ? "" : `Flyweight ball Ø${2 * r}`, frame: { o, x: g.frame.x, z: g.frame.z }, profile: ballProfile(r), h: 0, revolve: true }] };
}

/**
 * Straight bars standing on a part's face (`bars: [{ from: [x, y], to: [x, y], width, z: [z0, z1] }]`, in the body's
 * frame, z from its origin): a hub's slot jaws, an Oldham disc's tongues. Pieces of the body.
 */
function withBars(g: BodyGeom): BodyGeom {
  const bars = g.shape.bars as { from?: unknown; to?: unknown; width?: unknown; z?: unknown }[] | undefined;
  if (!Array.isArray(bars) || !bars.length) return g;
  const pieces = bars.map((b, k) => {
    const [x0, y0] = pair(b.from, [0, 0]);
    const [x1, y1] = pair(b.to, [10, 0]);
    const [z0, z1] = pair(b.z, [0, 5]);
    const w = num(b.width, 10) / 2;
    const L = Math.hypot(x1 - x0, y1 - y0) || 1;
    const nx = (-(y1 - y0) / L) * w;
    const ny = ((x1 - x0) / L) * w;
    const outer: Vec2[] = [[x0 + nx, y0 + ny], [x0 - nx, y0 - ny], [x1 - nx, y1 - ny], [x1 + nx, y1 + ny]];
    const area = (outer[1]![0] - outer[0]![0]) * (outer[2]![1] - outer[0]![1]) - (outer[2]![0] - outer[0]![0]) * (outer[1]![1] - outer[0]![1]);
    if (area < 0) outer.reverse();
    return { id: `${g.id}-bar${k}`, name: "", frame: { o: v3.add(g.frame.o, v3.mul(g.frame.z, z0)), x: g.frame.x, z: g.frame.z }, profile: { outer, holes: [] }, h: z1 - z0 };
  });
  return { ...g, pieces: [...(g.pieces ?? []), ...pieces] };
}

/**
 * An index mark (`indexMark: { at: [x, y] }`, a Schmidt coupling's discs) as a raised arrow on the part's top face,
 * pointing out along the radius through `at`: one bold mark per part, so parts that keep their orientation show it. It
 * stays opaque when its part is drawn see-through. Only on a part the record places itself (`place`).
 */
function withIndex(g: BodyGeom): BodyGeom {
  const at = (g.shape.indexMark as { at?: number[] } | undefined)?.at;
  if (!Array.isArray(at) || at.length < 2 || !g.exact) return g;
  const L = Math.hypot(at[0]!, at[1]!) || 1;
  const u: Vec2 = [at[0]! / L, at[1]! / L];
  const v: Vec2 = [-u[1], u[0]];
  const p = (s: number, w: number): Vec2 => [u[0] * s + v[0] * w, u[1] * s + v[1] * w];
  // a small arrow on the material along its ray, clear of both edges (a ring's inner edge): its tip short of the outer
  // edge, its tail in from the inner one, a head of 4.5 mm, 5 wide, on a shaft 2 wide, 12 long in all at the most
  const solid = (r: number) => inside(g.profile.outer, p(r, 0)) && !g.profile.holes.some((h) => inside(h, p(r, 0)));
  let lo = L, hi = L;
  while (lo > 0 && solid(lo - 0.25)) lo -= 0.25;
  while (hi < 4 * L && solid(hi + 0.25)) hi += 0.25;
  const tip = Math.min(L, hi - 2.5);
  const tail = Math.min(tip - 7, Math.max(tip - 12, lo > 0.5 ? lo + 3 : 0));
  const neck = tip - 4.5;
  let outer: Vec2[] = [p(tail, -1), p(neck, -1), p(neck, -2.5), p(tip, 0), p(neck, 2.5), p(neck, 1), p(tail, 1)];
  if (signedArea(outer) < 0) outer = outer.reverse();
  const o = v3.add(g.frame.o, v3.mul(g.frame.z, g.exact.offset + g.thick));
  return { ...g, pieces: [...(g.pieces ?? []), { id: `${g.id}-index`, name: "Index arrow, raised", frame: { o, x: g.frame.x, z: g.frame.z }, profile: { outer, holes: [] }, h: 1.5 }] };
}
