// Body outlines from the record's typed `shape` (record spec v3, "shape types"), in the frame of the body's plane in the
// reference configuration. A link, plate, slot link, slider, gear, disc, wheel and shaft get their true outline; a body
// whose shape is a profile of its own (cam, cage, cross, custom) gets the disc or box that holds its joints, flagged
// `approx`, until the pilots (P) and the rebuild (R) give it a profile of its own.
import { D2R, TAU, capsule, circle, gearOutline, rackOutline, roundRect, roundedPoly, slot, taper, type Vec2 } from "../core/geom";
import { bevel, bevelOutline, wormSection } from "../core/spatial";
import type { Kin, KinBody, KinJoint } from "../kin/types";
import { bodyFrameOf, type Setup } from "../kin/compose";
import { type Vec3, v3 } from "../kin/math";
import type { LoftSection, Profile } from "../solids/types";
import { canon, frameAlong, fromPlane, planeCoords, xfFrame, type Frame } from "./frames";
import { THICK } from "./constants";
import { noncircularOutline, pitchOf } from "./conjugate";

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
  /** Further solids of the body's own (a yoke's bar and arms, a cross's second trunnion), in world reference frames. */
  pieces?: { id: string; name: string; frame: Frame; profile: Profile; h: number }[];
  /** The body's whole footprint in its frame's plane, where its pieces reach past its own part (the placer reads it). */
  plan?: Vec2[];
  /**
   * A compound gear's further toothed levels on the same body (a cluster: a `gear` with `cluster`), each in a slab of
   * its own above the body's part; a mesh whose tooth count for this body is a level's meshes with that level.
   */
  levels?: Level[];
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
function outlineOf(shape: Record<string, unknown>, role: string, pins: Vec2[]): { profile: Profile; thick: number; approx: boolean; scaleTop?: number; twist?: number; loft?: LoftSection[]; exact?: boolean; exactOffset?: number } {
  const g = outlineOf0(shape, role, pins);
  // holes the record names on a disc or a plate ([x, y, r] in the body's frame): a port face's ports
  if (Array.isArray(shape.holes) && (shape.type === "disc" || shape.type === "plate"))
    for (const h of shape.holes as number[][]) g.profile.holes.push(circle(h[2]!, h[0]!, h[1]!, 28).reverse());
  return g;
}

function outlineOf0(shape: Record<string, unknown>, role: string, pins: Vec2[]): { profile: Profile; thick: number; approx: boolean; scaleTop?: number; twist?: number; loft?: LoftSection[]; exact?: boolean; exactOffset?: number } {
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
      // a spider (a planet carrier): a hub and an arm out to each of the body's pins off its centre
      if (typeof shape.arms === "number") {
        const [hub, arm] = pair(shape.boss, [18, 10]);
        const ends = pins.filter((p) => Math.hypot(p[0], p[1]) > 1);
        return { profile: { outer: spider(ends, hub, arm), holes: [] }, thick: num(shape.thickness, 6), approx: false };
      }
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
      // an eccentric: a disc whose centre stands `offset` off its shaft, toward the frame's x (its other joint)
      const c = typeof shape.offset === "number" ? ([shape.offset, 0] as [number, number]) : pair(shape.center, [0, 0]);
      const bore = num(shape.bore, 0);
      return { profile: { outer: circle(r, c[0], c[1], Math.max(36, Math.round(r * 3))), holes: bore ? [hole(bore / 2)] : [] }, thick: num(shape.thickness, 8), approx: false, ...(shape.exact === true ? { exact: true } : {}) };
    }
    case "gear": {
      const z = num(shape.z, 20);
      const m = num(shape.module, 2);
      const bore = num(shape.bore, 6);
      if (typeof shape.cone === "number") {
        // a straight bevel gear: Tredgold's back-cone teeth at the outer end, tapering toward the apex over the face
        const bv = bevel(z, m, shape.cone * D2R, num(shape.face, 0) || undefined);
        const outer = bevelOutline(z, m, bv.delta);
        if (typeof shape.spiral === "number" && shape.spiral !== 0) {
          // a spiral bevel or hypoid gear: the back-cone teeth lofted toward the apex, shrinking along the pitch cone and
          // turning by the spiral angle along the face (left hand clockwise going in); the bore is the stack's
          const rMean = ((z * m) / 2) * (1 - (1 - bv.inner) / 2);
          const turn = ((bv.b * Math.tan(shape.spiral * D2R)) / rMean) * (shape.hand === "left" ? -1 : 1);
          const n = Math.max(6, Math.ceil(Math.abs(turn) / (4 * D2R)));
          const loft: LoftSection[] = Array.from({ length: n }, (_, i) => {
            const t = (i + 1) / n;
            const s = 1 - t * (1 - bv.inner);
            return { z: t * bv.axial, outer: rot(outer, t * turn).map(([x, y]): Vec2 => [x * s, y * s]), holes: [] };
          });
          return { profile: { outer, holes: [] }, thick: bv.axial, approx: false, scaleTop: bv.inner, loft, exact: true };
        }
        // its back face at `backFace` along the frame's z (default the frame's origin); `facing: -1` puts its apex toward
        // -z: the frustum then runs from its small end up to its back face
        const back = num(shape.backFace, 0);
        if (shape.facing === -1) {
          const s = bv.inner;
          return { profile: { outer: outer.map(([x, y]): Vec2 => [x * s, y * s]), holes: [hole(bore / 2)] }, thick: bv.axial, approx: false, scaleTop: 1 / s, exact: true, exactOffset: back - bv.axial };
        }
        return { profile: { outer, holes: [hole(bore / 2)] }, thick: bv.axial, approx: false, scaleTop: bv.inner, exact: true, ...(back ? { exactOffset: back } : {}) };
      }
      if (shape.form === "worm" || shape.form === "worm wheel") return wormShape(shape, z, m);
      // a non-circular gear: teeth along its own pitch curve (the gear it drives is cut conjugate to it, conjugate.ts)
      const pc = pitchOf(shape);
      if (pc) return { profile: { outer: noncircularOutline(pc, z).outer, holes: [hole(bore / 2)] }, thick: num(shape.face, 10), approx: false };
      if (typeof shape.helix === "number" && shape.helix !== 0 && Array.isArray(shape.hand)) {
        // a herringbone (double-helical) gear: two halves of opposite hand meeting in a V across a relief groove cut to
        // the root circle; a loft of sections every few millimetres so each half's twist stays true
        const beta = shape.helix * D2R;
        const mt = shape.modules === "transverse" ? m : m / Math.cos(beta);
        const halves = (shape.halves ?? {}) as Record<string, unknown>;
        const w = num(halves.width, 20);
        const gap = num(halves.gap, 0);
        const rp = (z * mt) / 2;
        const sense = shape.hand[0] === "left" ? -1 : 1;
        const t = (sense * w * Math.tan(beta)) / rp;
        const base = gearOutline(z, mt);
        const rf = rp - 1.25 * mt - 0.4;
        // the bore is the stack's, cut into every section
        const bore: Vec2[][] = [];
        const ring = (a: number, groove = false): Vec2[] =>
          rot(base, a).map(([x, y]): Vec2 => {
            const r = Math.hypot(x, y);
            return groove && r > rf ? [(x * rf) / r, (y * rf) / r] : [x, y];
          });
        const n = Math.max(2, Math.ceil(Math.abs(t / D2R) / 3));
        const sections: LoftSection[] = [];
        for (let i = 1; i <= n; i++) sections.push({ z: (w * i) / n, outer: ring((t * i) / n), holes: bore });
        if (gap > 0) {
          sections.push({ z: w + 0.01, outer: ring(t, true), holes: bore }, { z: w + gap - 0.01, outer: ring(t, true), holes: bore }, { z: w + gap, outer: ring(t), holes: bore });
        }
        for (let i = 1; i <= n; i++) sections.push({ z: w + gap + (w * i) / n, outer: ring(t - (t * i) / n), holes: bore });
        return { profile: { outer: base, holes: bore }, thick: 2 * w + gap, approx: false, loft: sections, exact: true };
      }
      if (typeof shape.helix === "number" && shape.helix !== 0) {
        // a helical gear: the transverse outline of the normal module, turned along the face by its helix (right hand
        // counter-clockwise going up its axis); it stands at its joint's plane, so both of a pair share their faces
        const beta = shape.helix * D2R;
        const mt = shape.modules === "transverse" ? m : m / Math.cos(beta);
        const b = num(shape.face, 10);
        const turn = ((b * Math.tan(beta)) / ((z * mt) / 2)) * (shape.hand === "left" ? -1 : 1);
        // centred on its joint (a crossed pair meets at mid-face), else standing on it
        return { profile: { outer: gearOutline(z, mt), holes: [hole(bore / 2)] }, thick: b, approx: false, twist: turn / D2R, exact: true, ...(shape.centred === true ? { exactOffset: -b / 2 } : {}) };
      }
      return { profile: { outer: gearOutline(z, m), holes: [hole(bore / 2)] }, thick: num(shape.face, 10), approx: false };
    }
    case "ringGear": {
      const z = num(shape.z, 40);
      const m = num(shape.module, 3);
      const rim = num(shape.rim, (z * m) / 2 + 12);
      // its teeth's tips stand `addendum` modules in from the pitch circle (short teeth, a harmonic drive's rigid spline)
      return { profile: { outer: circle(rim, 0, 0, 72), holes: [gearOutline(z, m, 1.25, num(shape.addendum, 1)).reverse()] }, thick: num(shape.face, 10), approx: false };
    }
    case "pulley":
    case "sprocket": {
      const z = num(shape.z, 20);
      const p = num(shape.pitch, 8);
      const r = (z * p) / TAU + (type === "pulley" ? 1.4 : 2.5);
      return { profile: { outer: circle(r, 0, 0, Math.max(36, Math.round(r * 3))), holes: [hole(num(shape.bore, 8) / 2)] }, thick: num(shape.face, 10), approx: false };
    }
    case "custom": {
      const prof = (shape.profile ?? {}) as Record<string, unknown>;
      if (Array.isArray(prof.ellipse)) {
        // an elliptical cam (a wave generator), semi-axes [a, b] along the frame's x and y
        const [ea, eb] = pair(prof.ellipse, [20, 15]);
        const outer = Array.from({ length: 144 }, (_, i): Vec2 => [ea * Math.cos((i * TAU) / 144), eb * Math.sin((i * TAU) / 144)]);
        return { profile: { outer, holes: typeof shape.bore === "number" ? [hole(shape.bore / 2).reverse()] : [] }, thick: num(shape.thickness, 10), approx: false, ...(shape.exact === true ? { exact: true } : {}) };
      }
      if (prof.flexTooth && typeof prof.flexTooth === "object") {
        // one tooth of a flexspline with its piece of rim, at angle 2πk/z (the wave block bends the rim)
        const f = prof.flexTooth as Record<string, unknown>;
        return { profile: { outer: flexTooth(num(f.z, 30), num(f.module, 2), num(f.addendum, 0.8), num(f.inner, 26.5), num(f.k, 0), num(f.w0, 0)), holes: [] }, thick: num(shape.thickness, 10), approx: false, exact: true };
      }
      if (/trochoid/.test(String(prof.curve ?? ""))) {
        // a cycloidal disc: N - 1 lobes rolling on N ring pins (radius Rr on a circle R), eccentricity e; 0.1 mm running
        // clearance on the pins; its bore and the output pins' holes ({ count, radius, circle, start })
        const outer = cycloidalDisc(num(prof.R, 50), num(prof.Rr, 5) + 0.1, num(prof.e, 4), num(prof.N, 10));
        const holes: Vec2[][] = [];
        if (typeof shape.bore === "number") holes.push(hole(shape.bore / 2).reverse());
        const hs = (shape.holes ?? {}) as Record<string, unknown>;
        const n = num(hs.count, 0);
        for (let k = 0; k < n; k++) {
          const a = (num(hs.start, 0) + (k * 360) / n) * D2R;
          holes.push(circle(num(hs.radius, 5), num(hs.circle, 20) * Math.cos(a), num(hs.circle, 20) * Math.sin(a), 32).reverse());
        }
        return { profile: { outer, holes }, thick: num(shape.thickness, 10), approx: false };
      }
      break;
    }
    case "shaft": {
      const d = num(shape.diameter, 8);
      return { profile: { outer: circle(d / 2, 0, 0, 24), holes: [] }, thick: num(shape.length, 40), approx: false };
    }
    case "rack": {
      // toothed along its pitch line (y = 0, the frame's x); the mesh phasing shifts the teeth to put a gap at the mesh
      const L = num(shape.length, 120);
      const h = num(shape.height, 20);
      const m = num(shape.module, 0);
      return { profile: { outer: m > 0 ? rackOutline(m, -L / 2, L / 2, h) : roundRect(-L / 2, -h, L / 2, 0, 1), holes: [] }, thick: num(shape.face, 12), approx: false };
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
    const geom: BodyGeom = { id: b.id, role: b.role, frame, profile: g.profile, thick: g.thick, approx: g.approx, pins, shape, ...(g.scaleTop !== undefined ? { scaleTop: g.scaleTop } : {}), ...(g.twist ? { twist: g.twist } : {}), ...(g.loft ? { loft: g.loft } : {}), ...(g.exact || fixed ? { exact: { offset: g.exactOffset ?? 0 } } : {}) };
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
      geom.pieces = [{ id: `${b.id}-wall`, name: "", frame: { o: v3.add(frame.o, v3.mul(frame.z, -L)), x: frame.x, z: frame.z }, profile: { outer: flexWall(num(ft.z, 30), num(ft.module, 2), num(ft.inner, 26.5), num(wl.thickness, 0.8), num(ft.k, 0), num(ft.w0, 0)), holes: [] }, h: L }];
    }
    out.set(b.id, universal(kin, S, b, geom) ?? cylinder(b, geom) ?? geom);
  }
  phaseMeshes(kin, S, out);
  return out;
}

/**
 * A hub of radius `hub` at the origin with an arm of half-width `arm` out to each end, rounded round each end: the
 * outline of the union, which is star-shaped about the origin, sampled along rays from it.
 */
export function spider(ends: Vec2[], hub: number, arm: number, n = 240): Vec2[] {
  const exitOf = (d: Vec2): number => {
    let t = hub;
    for (const e of ends) {
      const L = Math.hypot(e[0], e[1]);
      const u: Vec2 = [e[0] / L, e[1] / L];
      // the ray leaves the capsule [0, e] of radius arm at the largest t still within arm of the segment
      const inside = (s: number) => {
        const q: Vec2 = [s * d[0], s * d[1]];
        const k = Math.max(0, Math.min(L, q[0] * u[0] + q[1] * u[1]));
        return Math.hypot(q[0] - k * u[0], q[1] - k * u[1]) <= arm;
      };
      let lo = 0;
      let hi = L + arm;
      for (let i = 0; i < 40; i++) {
        const m = (lo + hi) / 2;
        if (inside(m)) lo = m;
        else hi = m;
      }
      t = Math.max(t, lo);
    }
    return t;
  };
  return Array.from({ length: n }, (_, i): Vec2 => {
    const a = (i * TAU) / n;
    const d: Vec2 = [Math.cos(a), Math.sin(a)];
    const t = exitOf(d);
    return [t * d[0], t * d[1]];
  });
}

/**
 * A body's further levels (Level): a compound gear's `cluster` ([{ z, module, face, bore }]) over its part, a link's
 * `gear` ({ z, module, face, at: the joint it is centred on }) over its part, a gear's `disc` ({ radius, thickness }, a
 * flywheel) under it.
 */
function clusterLevels(shape: Record<string, unknown>, pins: { joint: string; uv: Vec2 }[]): Level[] {
  const out: Level[] = [];
  const type = String(shape.type);
  if (type === "gear" && Array.isArray(shape.cluster))
    for (const l of shape.cluster as Record<string, unknown>[]) {
      const z = num(l.z, 12);
      out.push({ z, profile: { outer: gearOutline(z, num(l.module, num(shape.module, 2))), holes: [circle(num(l.bore, num(shape.bore, 6)) / 2, 0, 0, 28)] }, thick: num(l.face, num(shape.face, 10)) });
    }
  if (type === "link" && shape.gear && typeof shape.gear === "object") {
    const l = shape.gear as Record<string, unknown>;
    const c = pins.find((p) => p.joint === l.at)?.uv ?? ([0, 0] as Vec2);
    const z = num(l.z, 20);
    out.push({ z, center: c, profile: { outer: gearOutline(z, num(l.module, 2)).map(([x, y]): Vec2 => [x + c[0], y + c[1]]), holes: [] }, thick: num(l.face, 10), ...(l.below === true ? { below: true } : {}) });
  }
  if (type === "gear" && shape.disc && typeof shape.disc === "object") {
    const d = shape.disc as Record<string, unknown>;
    const R = num(d.radius, 60);
    out.push({ z: 0, below: true, profile: { outer: circle(R, 0, 0, Math.max(72, Math.round(R * 2))), holes: [circle(num(shape.bore, 6) / 2, 0, 0, 28)] }, thick: num(d.thickness, 10) });
  }
  return out;
}

/** Which level of a body a mesh joint reaches: 0 its own part, k its k-th cluster level (by the tooth count the joint gives it). */
export function meshLevel(g: BodyGeom | undefined, j: { a: string; b: string; za?: unknown; zb?: unknown }): number {
  if (!g?.levels?.length) return 0;
  const z = g.id === j.a ? j.za : g.id === j.b ? j.zb : undefined;
  if (typeof z !== "number" || z === num(g.shape.z, 20)) return 0;
  const k = g.levels.findIndex((l) => l.z > 0 && l.z === z);
  return k < 0 ? 0 : k + 1;
}

/** The placer's name for a body's k-th cluster level. */
export const levelId = (body: string, k: number): string => (k ? `${body}#${k}` : body);

/**
 * One tooth of a z-tooth gear (addendum ha modules, dedendum 1.25) with its piece of rim down to the inner radius, the
 * tooth centred at angle 2πk/z, the piece spanning half a pitch either side (a flexspline's segment).
 */
export function flexTooth(z: number, m: number, ha: number, inner: number, k: number, w0 = 0): Vec2[] {
  const full = gearOutline(z, m, ha, 1.25);
  const per = full.length / z;
  // tooth 0's points and its root arc to the next tooth's start, then turned to tooth k; a hairline gap between
  // neighbouring segments, which tighten on the oval's curve
  const half = Math.PI / z - 0.4 / inner;
  // the tooth thinned by 8% for running clearance in the rigid spline's spaces (its flanks are a 30-tooth involute
  // working in 32-tooth spaces)
  const pts = full.filter(([x, y]) => Math.abs(Math.atan2(y, x)) < half - 1e-9).map(([x, y]): Vec2 => {
    const r = Math.hypot(x, y);
    const t = Math.atan2(y, x) * 0.92;
    return [r * Math.cos(t), r * Math.sin(t)];
  });
  const rf = (z * m) / 2 - 1.25 * m;
  const edge = (a: number): Vec2 => [rf * Math.cos(a), rf * Math.sin(a)];
  const arc = Array.from({ length: 9 }, (_, i): Vec2 => [inner * Math.cos(half - (i * 2 * half) / 8), inner * Math.sin(half - (i * 2 * half) / 8)]);
  void per;
  const ring: Vec2[] = [edge(-half), ...pts.sort((p, q) => Math.atan2(p[1], p[0]) - Math.atan2(q[1], q[0])), edge(half), ...arc];
  return bentSegment(ring, z, m, k, w0);
}

/** A flexspline's wall strip under segment k: a band of the cup's wall, inner - t to inner, bent as the segment is. */
export function flexWall(z: number, m: number, inner: number, t: number, k: number, w0 = 0): Vec2[] {
  const half = Math.PI / z - 0.4 / inner;
  const arc = (r: number, s: 1 | -1) => Array.from({ length: 9 }, (_, i): Vec2 => [r * Math.cos(s * (-half + (i * 2 * half) / 8)), r * Math.sin(s * (-half + (i * 2 * half) / 8))]);
  return bentSegment([...arc(inner, 1), ...arc(inner - t, -1)], z, m, k, w0);
}

/** A segment's ring, drawn about angle 0, turned to segment k of z and bent as the wave block bends it at the reference. */
function bentSegment(ring: Vec2[], z: number, m: number, k: number, w0: number): Vec2[] {
  const a = (k * TAU) / z;
  if (!w0) return rot(ring, a);
  // bent as at the reference, its long axis on x: out by w = w0 cos 2a along its radius, tilted with the oval's slope
  const r = (z * m) / 2;
  const w = w0 * Math.cos(2 * a);
  const rho = -Math.atan2(-2 * w0 * Math.sin(2 * a), r + w);
  // the inextensible rim's slide along itself (the wave block's)
  const at = a - ((w0 / 2) * Math.sin(2 * a)) / r;
  const p = rot([[r, 0]], rho + a)[0]!;
  const t: Vec2 = [(r + w) * Math.cos(at) - p[0], (r + w) * Math.sin(at) - p[1]];
  return rot(ring, rho + a).map(([x, y]): Vec2 => [x + t[0], y + t[1]]);
}

/**
 * A cycloidal disc's outline (counter-clockwise, about its centre): the curtate epitrochoid offset by the pin radius
 * that rolls N - 1 lobes on N pins of radius Rr on a circle R, eccentricity e; at its reference the disc's centre stands
 * at +e on x and a pin at angle 0 sits between two lobes.
 */
export function cycloidalDisc(R: number, Rr: number, e: number, N: number, n = 720): Vec2[] {
  const pts: Vec2[] = [];
  for (let i = 0; i < n; i++) {
    const t = (i * TAU) / n;
    const psi = Math.atan2(Math.sin((1 - N) * t), R / (e * N) - Math.cos((1 - N) * t));
    pts.push([R * Math.cos(t) - Rr * Math.cos(t + psi) - e * Math.cos(N * t), -R * Math.sin(t) + Rr * Math.sin(t + psi) + e * Math.sin(N * t)]);
  }
  return pts.reverse();
}

/**
 * A worm (`form: "worm"`, `z` starts, `module` axial, `pitchDiameter`, `face` its length) or its wheel
 * (`form: "worm wheel"`, `z` teeth, `helix` the worm's lead angle, `throat: { centre, radius }` the worm's axis distance
 * and the throat's radius about it), both as lofts centred on their joint: the worm's square section turned by its lead
 * along its length (right hand counter-clockwise), the wheel's teeth turned by the lead angle across its face and
 * reaching up round the worm in the throat. Their bores are the stack's, cut into every section.
 */
function wormShape(shape: Record<string, unknown>, z: number, m: number): { profile: Profile; thick: number; approx: boolean; loft: LoftSection[]; exact: boolean; exactOffset: number } {
  const sense = shape.hand === "left" ? -1 : 1;
  const L = num(shape.face, 20);
  const sections: LoftSection[] = [];
  if (shape.form === "worm") {
    const d1 = num(shape.pitchDiameter, 10 * m);
    const lead = Math.PI * m * z;
    const s0 = wormSection(m, z, d1, 72);
    const turn = (sense * 2 * Math.PI * L) / lead;
    const n = Math.max(2, Math.ceil(Math.abs(turn) / (12 * D2R)));
    for (let i = 1; i <= n; i++) sections.push({ z: (L * i) / n, outer: rot(s0, (turn * i) / n), holes: [] });
    return { profile: { outer: s0, holes: [] }, thick: L, approx: false, loft: sections, exact: true, exactOffset: -L / 2 };
  }
  const rp = (z * m) / 2;
  const lam = num(shape.helix, 5) * D2R;
  const th = (shape.throat ?? {}) as Record<string, unknown>;
  const a = num(th.centre, 0);
  const R = num(th.radius, 0);
  const n = Math.max(4, Math.round(L));
  const ring = (dz: number): Vec2[] => {
    // the tips follow the throat round the worm: higher toward the faces, up to 1.6 modules
    const rt = a > 0 && R > Math.abs(dz) ? a - Math.sqrt(R * R - dz * dz) : rp + m;
    const ad = Math.max(1, Math.min(1.6, (rt - rp) / m));
    return rot(gearOutline(z, m, ad), (sense * dz * Math.tan(lam)) / rp);
  };
  for (let i = 1; i <= n; i++) sections.push({ z: (L * i) / n, outer: ring((L * i) / n - L / 2), holes: [] });
  return { profile: { outer: ring(-L / 2), holes: [] }, thick: L, approx: false, loft: sections, exact: true, exactOffset: -L / 2 };
}

/** Angle wrapped into [-h, h) for a period 2h. */
const wrapTo = (a: number, h: number): number => a - 2 * h * Math.floor((a + h) / (2 * h));

/**
 * Gears in mesh are turned so a tooth of one meets a gap of the other at the mesh point (J6, J9). Every outline starts
 * with a tooth (a ring: a gap) on its x axis; a gear's turn is set once, by the first mesh that reaches it from a gear
 * already set, from where that gear's nearest tooth stands off the mesh point: a train of several meshes (a sun and
 * its planets, the planets and their ring) then meshes everywhere. A crossed mesh puts a tooth of the first and a gap
 * of the second on the mesh point.
 */
function phaseMeshes(kin: Kin, S: Setup, geoms: Map<string, BodyGeom>): void {
  type Side = { id: string; key: string; g: BodyGeom; kind: "gear" | "ring" | "rack"; z: number; m: number; lv: number; c?: Vec2 };
  const sideOf = (id: string, j: KinJoint): Side | null => {
    const g = geoms.get(id);
    if (!g) return null;
    const t = String(g.shape.type);
    if (t === "rack") return num(g.shape.module, 0) > 0 ? { id, key: id, g, kind: "rack", z: 0, m: num(g.shape.module, 0), lv: 0 } : null;
    if (t === "ringGear") return { id, key: id, g, kind: "ring", z: num(g.shape.z, 40), m: num(g.shape.module, 3), lv: 0 };
    if ((t !== "gear" && t !== "link") || j.ncg) return null;
    const lv = meshLevel(g, j);
    // a link meshes only through a gear fixed on it
    if (t === "link" && !lv) return null;
    const L = lv ? g.levels![lv - 1]! : null;
    const m = t === "link" ? num((g.shape.gear as Record<string, unknown> | undefined)?.module, 2) : num(g.shape.module, 2);
    return { id, key: levelId(id, lv), g, kind: "gear", z: L ? L.z : num(g.shape.z, 20), m, lv, ...(L?.center ? { c: L.center } : {}) };
  };
  // a gear's reference turn: its tooth (a ring's gap) stands at this angle; a rack's teeth are centred at this x
  const set = new Map<string, number>();
  const apply = (s: Side, v: number): void => {
    set.set(s.key, v);
    if (s.kind === "rack") {
      const L = num(s.g.shape.length, 120);
      s.g.profile = { outer: rackOutline(s.m, -L / 2, L / 2, num(s.g.shape.height, 20), v), holes: s.g.profile.holes };
      return;
    }
    if (Math.abs(v) < 1e-12) return;
    if (s.lv) {
      const L = s.g.levels![s.lv - 1]!;
      const c = L.center ?? [0, 0];
      const r = (pts: Vec2[]) => rot(pts.map(([x, y]): Vec2 => [x - c[0], y - c[1]]), v).map(([x, y]): Vec2 => [x + c[0], y + c[1]]);
      L.profile = { outer: r(L.profile.outer), holes: L.profile.holes.map(r) };
    } else {
      s.g.profile = { outer: rot(s.g.profile.outer, v), holes: s.g.profile.holes.map((h) => rot(h, v)) };
      if (s.g.loft) s.g.loft = s.g.loft.map((x) => ({ z: x.z, outer: rot(x.outer, v), holes: x.holes.map((h) => rot(h, v)) }));
    }
  };
  const meshes = kin.joints.filter((j) => j.type === "gear-mesh" && S.joints.get(j.id));
  const done = new Set<string>();
  for (let guard = 0; done.size < meshes.length && guard < 4 * meshes.length + 4; guard++) {
    let progress = false;
    for (const j of meshes) {
      if (done.has(j.id)) continue;
      const P = S.joints.get(j.id)!.at;
      const A = sideOf(j.a, j);
      const B = sideOf(j.b, j);
      if (!A || !B) {
        done.add(j.id);
        continue;
      }
      const knownA = set.has(A.key);
      const knownB = set.has(B.key);
      // a mesh no gear already set reaches waits; a new train is started below when nothing else moves
      if (!knownA && !knownB) continue;
      done.add(j.id);
      progress = true;
      if (knownA && knownB) continue;
      const phi = (s: Side): number => {
        const uv = planeCoords(s.g.frame, P).uv;
        const c = s.c ?? [0, 0];
        return Math.atan2(uv[1] - c[1], uv[0] - c[0]);
      };
      if (j.crossed) {
        // a tooth of the first, a gap of the second on the mesh point
        if (!knownA && A.kind !== "rack") apply(A, phi(A));
        if (!knownB && B.kind !== "rack") apply(B, phi(B) + (B.kind === "ring" ? 0 : Math.PI / B.z));
        continue;
      }
      // the known side, the side to set
      const [K, U] = knownA || (!knownB && A.kind !== "rack") ? [A, B] : [B, A];
      if (!set.has(K.key)) apply(K, K.kind === "rack" ? planeCoords(K.g.frame, P).uv[0] : phi(K));
      if (K.kind === "rack") {
        // a pinion set from its rack: a tooth into the rack's gap nearest the mesh point
        const p = Math.PI * K.m;
        const x = planeCoords(K.g.frame, P).uv[0];
        const d = wrapTo(x - set.get(K.key)! - p / 2, p / 2);
        const t = v3.unit(v3.cross(U.g.frame.z, v3.sub(P, fromPlane(U.g.frame, U.c ?? [0, 0], 0))));
        const sgn = Math.sign(v3.dot(t, K.g.frame.x)) || 1;
        apply(U, phi(U) - (sgn * d) / ((U.z * U.m) / 2));
        continue;
      }
      // where K's nearest tooth (a ring: its nearest gap) stands off the mesh point, as an arc on the pitch circle
      const off = wrapTo(phi(K) - set.get(K.key)!, Math.PI / K.z);
      const arc = off * ((K.z * K.m) / 2);
      if (U.kind === "rack") {
        // the rack's gap where the pinion's tooth is, along the pinion's turning direction at the mesh
        const t = v3.unit(v3.cross(K.g.frame.z, v3.sub(P, fromPlane(K.g.frame, K.c ?? [0, 0], 0))));
        const sgn = Math.sign(v3.dot(t, U.g.frame.x)) || 1;
        const x = planeCoords(U.g.frame, P).uv[0];
        apply(U, x - sgn * arc + (Math.PI * U.m) / 2);
        continue;
      }
      const rU = (U.z * U.m) / 2;
      const internal = K.kind === "ring" || U.kind === "ring";
      if (internal) {
        // both centres on one side: the pitch circles run the same way at the mesh, a tooth faces a gap
        apply(U, phi(U) - arc / rU);
      } else {
        // the pitch circles run opposite ways at the mesh; U's gap faces K's tooth
        apply(U, phi(U) + arc / rU + Math.PI / U.z);
      }
    }
    if (!progress) {
      // a new train: its first gear puts a tooth on the mesh point
      const j = meshes.find((q) => !done.has(q.id));
      if (!j) break;
      const A = sideOf(j.a, j);
      if (A && A.kind !== "rack" && !set.has(A.key)) {
        const uv = planeCoords(A.g.frame, S.joints.get(j.id)!.at).uv;
        const c = A.c ?? [0, 0];
        apply(A, Math.atan2(uv[1] - c[1], uv[0] - c[0]));
      } else if (A) set.set(A.key, 0);
    }
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
