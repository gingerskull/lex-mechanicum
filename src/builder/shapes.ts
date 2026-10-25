// Body outlines from the record's typed `shape` (record spec v3, "shape types"), in the frame of the body's plane in the
// reference configuration. A link, plate, slot link, slider, gear, disc, wheel and shaft get their true outline; a body
// whose shape is a profile of its own (cam, cage, cross, custom) gets the disc or box that holds its joints, flagged
// `approx`, until the pilots (P) and the rebuild (R) give it a profile of its own.
import { D2R, TAU, area, capsule, circle, gearOutline, rackOutline, roundRect, roundedPoly, slot, taper, type Vec2 } from "../core/geom";
import { filletPoly, spokes } from "../hardware/primitives";
import { bevel, bevelOutline, wormSection } from "../core/spatial";
import { hullOf } from "../hardware/primitives";
import type { Kin, KinBody, KinJoint } from "../kin/types";
import { Kinematics, bodyFrameOf, type Setup } from "../kin/compose";
import { lawRise, type CamLaw } from "../kin/blocks/cam";
import { sawOutline, starOutline, type StarSpec } from "../kin/blocks/timed";
import { type Vec3, m3, v3, xf } from "../kin/math";
import type { Feature, LoftSection, MeshData, Op, Profile } from "../solids/types";
import { bevelTeeth3, type Bevel3 } from "./bevel3";
import { inside } from "../core/poly";
import { nutGeom, screwGeom } from "./screws";
import { flexureGeom } from "./compliant";
import { forkGeom, sheaveGeom } from "./cvt";
import { ballGeom, carriageGeom } from "./integrator";
import { canon, frameAlong, fromPlane, planeCoords, xfFrame, type Frame } from "./frames";
import { THICK } from "./constants";
import { noncircularOutline, pitchOf } from "./conjugate";
import { barrelGroove, camLawOf, flatCam, rollerCam } from "./cams";
import { genevaCrank, genevaWheel, intermittentDriven, intermittentDriver } from "./indexers";

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
const signedArea = (p: Vec2[]): number => p.reduce((a, q, i) => { const r = p[(i + 1) % p.length]!; return a + q[0] * r[1] - r[0] * q[1]; }, 0) / 2;

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
  pieces?: { id: string; name: string; frame: Frame; profile: Profile; h: number; revolve?: boolean; op?: Op; features?: import("../solids/types").Feature[] }[];
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
function outlineOf(shape: Record<string, unknown>, role: string, pins: Vec2[]): { profile: Profile; thick: number; approx: boolean; scaleTop?: number; twist?: number; loft?: LoftSection[]; exact?: boolean; exactOffset?: number; upper?: BodyGeom["upper"]; plan?: Vec2[]; features?: import("../solids/types").Feature[]; mesh?: MeshData; teeth?: Bevel3 } {
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

function outlineOf0(shape: Record<string, unknown>, role: string, pins: Vec2[]): { profile: Profile; thick: number; approx: boolean; scaleTop?: number; twist?: number; loft?: LoftSection[]; exact?: boolean; exactOffset?: number; upper?: BodyGeom["upper"]; plan?: Vec2[]; features?: import("../solids/types").Feature[]; mesh?: MeshData; teeth?: Bevel3 } {
  const type = String(shape.type ?? "");
  const far = pins.reduce((m, p) => Math.max(m, Math.hypot(p[0], p[1])), 0);
  const hole = (r: number): Vec2[] => circle(r, 0, 0, 28);
  switch (type) {
    case "link": {
      const L = num(shape.length, far);
      const [r0, r1] = pair(shape.boss, [8, 8]);
      // a link the record places itself (`place`) takes its own thickness (a Sarrus leaf, a governor's arm)
      const thick = typeof shape.place === "number" ? num(shape.thickness, THICK) : THICK;
      // a second arm on the same hub, `gap` above it (an output crank split round a bridge that carries its shaft)
      const up = shape.upper as Record<string, unknown> | undefined;
      if (up && typeof up === "object") {
        const L2 = num(up.length, L);
        const [q0, q1] = pair(up.boss, [r0, r1]);
        const a = num(up.angle, 180) * D2R;
        const gap = num(up.gap, 14);
        const arm = rot(taper(L2, q0, q1), a);
        const h2 = num(up.thick, THICK);
        return { profile: { outer: taper(L, r0, r1), holes: [] }, thick: THICK + gap + h2, approx: false, upper: { profile: { outer: arm, holes: [] }, h: h2, lift: THICK + gap, lower: THICK, name: "upper arm" } };
      }
      // a bore at its origin: an eccentric strap, a ring round its sheave with a slim rod to the far pin
      const bore = num(shape.bore, 0);
      if (bore > 0 && r0 > r1) return { profile: { outer: ringAndRod(L, r0, r1), holes: [circle(bore, 0, 0, 96).reverse()] }, thick: THICK, approx: false };
      return { profile: { outer: L > Math.abs(r0 - r1) + 1 ? taper(L, r0, r1) : circle(Math.max(r0, r1), 0, 0, 36), holes: [] }, thick, approx: false };
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
      // `exact`: the outline as drawn (a T-shaped follower, a notched plate), its corners filleted; else rounded round its points
      if (pts && pts.length >= 3 && shape.exact === true) return { profile: { outer: filletPoly(area(pts) < 0 ? pts.slice().reverse() : pts, num(shape.fillet, 1.5)), holes: [] }, thick: num(shape.thickness, THICK), approx: false };
      if (pts && pts.length >= 2) return { profile: { outer: roundedPoly(pts, r), holes: [] }, thick: num(shape.thickness, THICK), approx: false };
      if (Array.isArray(shape.rect)) {
        const [w, h] = pair(shape.rect, [60, 40]);
        // from its corner at the frame origin, or about the point `center` of its frame
        const [cx, cy] = pair(shape.center, [w / 2, h / 2]);
        return { profile: { outer: roundRect(cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2, Math.min(8, w / 4, h / 4)), holes: [] }, thick: num(shape.thickness, 8), approx: false };
      }
      break;
    }
    case "slotLink": {
      const L = num(shape.length, far);
      const w = num(shape.width, 22);
      const sl = Array.isArray(shape.slot) ? pair(shape.slot, [L * 0.3, L * 0.7]) : [L * 0.25, L * 0.25 + num(shape.slot, L * 0.4)];
      // an arm back past the pivot (a slotted lever whose rod pin is behind its pivot)
      const back = -num(shape.arm, 0);
      return { profile: { outer: roundedPoly([[back, 0], [L, 0]], w / 2), holes: [slot(sl[0]!, sl[1]!, 0, num(shape.slotWidth, 12) / 2)] }, thick: THICK, approx: false };
    }
    case "slider": {
      const L = num(shape.length, 36);
      const W = num(shape.width, 20);
      // centred on its joint, or starting at `from` along its x (a plunger whose pin is at its back end)
      const x0 = shape.from !== undefined ? num(shape.from, -L / 2) : -L / 2;
      return { profile: { outer: roundRect(x0, -W / 2, x0 + L, W / 2, Math.min(6, W / 2 - 0.5)), holes: [] }, thick: num(shape.thickness, 7), approx: false };
    }
    case "disc": {
      const r = num(shape.radius, 20);
      // an eccentric: a disc whose centre stands `offset` off its shaft, toward the frame's x (its other joint)
      const c = typeof shape.offset === "number" ? ([shape.offset, 0] as [number, number]) : pair(shape.center, [0, 0]);
      const bore = num(shape.bore, 0);
      // a ring (`ring: { inner, spokes?, hub? }`): a rim, bare (a floating disc) or spoked to a hub on its shaft
      const ring = shape.ring as { inner?: unknown; spokes?: unknown; hub?: unknown } | undefined;
      if (ring && typeof ring === "object") {
        const inner = num(ring.inner, r * 0.6);
        const n = num(ring.spokes, 0);
        const cw = (h: Vec2[]): Vec2[] => (signedArea(h) > 0 ? [...h].reverse() : h);
        const holes = n > 0 ? [...spokes({ rIn: num(ring.hub, 14), rOut: inner, n, half: 5, fillet: 3 }).map(cw), ...(bore ? [hole(bore / 2)] : [])] : [circle(inner, 0, 0, Math.max(36, Math.round(inner * 3))).reverse()];
        return { profile: { outer: circle(r, c[0], c[1], Math.max(36, Math.round(r * 3))), holes }, thick: num(shape.thickness, 8), approx: false };
      }
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
          const turn = spiralTurn(shape);
          const n = Math.max(6, Math.ceil(Math.abs(turn) / (4 * D2R)));
          const loft: LoftSection[] = Array.from({ length: n }, (_, i) => {
            const t = (i + 1) / n;
            const s = 1 - t * (1 - bv.inner);
            return { z: t * bv.axial, outer: rot(outer, t * turn).map(([x, y]): Vec2 => [x * s, y * s]), holes: [] };
          });
          // the part itself: the teeth on the back cone (the loft stands for it in the planning)
          const teeth: Bevel3 = { z, m, cone: shape.cone, face: bv.b, turn };
          return { profile: { outer, holes: [] }, thick: bv.axial, approx: false, scaleTop: bv.inner, loft, exact: true, mesh: bevelTeeth3(teeth), teeth };
        }
        // its back face at `backFace` along the frame's z (default the frame's origin); `facing: -1` puts its apex toward
        // -z: the frustum then runs from its small end up to its back face. The part is its teeth on the back cone (the
        // frustum stands for it in the planning)
        const back = num(shape.backFace, 0);
        if (shape.facing === -1) {
          const s = bv.inner;
          const teeth: Bevel3 = { z, m, cone: shape.cone, face: bv.b, bore, facing: -1, back: bv.axial };
          return { profile: { outer: outer.map(([x, y]): Vec2 => [x * s, y * s]), holes: [hole(bore / 2)] }, thick: bv.axial, approx: false, scaleTop: 1 / s, exact: true, exactOffset: back - bv.axial, mesh: bevelTeeth3(teeth), teeth };
        }
        const teeth: Bevel3 = { z, m, cone: shape.cone, face: bv.b, bore };
        return { profile: { outer, holes: [hole(bore / 2)] }, thick: bv.axial, approx: false, scaleTop: bv.inner, exact: true, ...(back ? { exactOffset: back } : {}), mesh: bevelTeeth3(teeth), teeth };
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
      const pr = (shape.profile ?? {}) as Record<string, Record<string, unknown> | undefined>;
      if (pr.rotor) return rotorOf(pr.rotor, pr.internalGear, num(shape.thick, 16));
      if (pr.housing) return { profile: housingOf(pr.housing, pr.bore), thick: num(shape.thick, 16), approx: false };
      const sa = (shape.profile as { slotArc?: Record<string, unknown> } | undefined)?.slotArc;
      if (sa) {
        const g = linkArc(sa, (shape.profile as { foot?: unknown }).foot, num(shape.thick, 10));
        return { profile: g.profile, thick: g.thick, approx: false, upper: g.upper };
      }
      break;
    }
    case "shaft": {
      const d = num(shape.diameter, 8);
      return { profile: { outer: circle(d / 2, 0, 0, 24), holes: [] }, thick: num(shape.length, 40), approx: false };
    }
    case "intermittentDriver":
    case "intermittentDriven": {
      const part = type === "intermittentDriver" ? intermittentDriver(shape, gearOutline) : intermittentDriven(shape, gearOutline);
      return { profile: part.profile, thick: part.thick, approx: false, features: part.features };
    }
    case "ratchetWheel": {
      // a ratchet wheel's sawtooth: steep faces and back slopes (src/kin sawOutline)
      const outer = sawOutline({ n: num(shape.n, 12), root: num(shape.root, 50), tip: num(shape.tip, 62), face: num(shape.face, 3), back: num(shape.back, 27), tip0: num(shape.tip0, 0) }, 0);
      return { profile: { outer, holes: [circle(num(shape.bore, 12) / 2, 0, 0, 28).reverse()] }, thick: num(shape.thickness, 8), approx: false };
    }
    case "escapeWheel": {
      // an escape wheel's pointed teeth: each tip with its two roots `lead` and `back` degrees from it (src/kin escape)
      const n = num(shape.n, 30);
      const outer: Vec2[] = [];
      for (let k = 0; k < n; k++) {
        const a = (num(shape.tip0, 0) + (360 / n) * k) * D2R;
        if (Array.isArray(shape.tooth)) {
          for (const q of shape.tooth as number[][]) outer.push([q[0]! * Math.cos(a) - q[1]! * Math.sin(a), q[0]! * Math.sin(a) + q[1]! * Math.cos(a)]);
          continue;
        }
        for (const [r, b] of [[num(shape.root, 40), a + num(shape.lead, 1) * D2R], [num(shape.tip, 50), a], [num(shape.root, 40), a + num(shape.back, 8) * D2R]] as const) outer.push([r * Math.cos(b), r * Math.sin(b)]);
      }
      const ring = area(outer) < 0 ? outer.reverse() : outer;
      return { profile: { outer: ring, holes: [circle(num(shape.bore, 6) / 2, 0, 0, 24).reverse()] }, thick: num(shape.thickness, 4), approx: false };
    }
    case "star": {
      // a star wheel: straight flanks from each tip to the roots half a pitch either side (src/kin starOutline)
      const outer = starOutline({ n: num(shape.n, 10), tip: num(shape.tip, 20), root: num(shape.root, 12), tip0: num(shape.tip0, 0), c: [0, 0] } as StarSpec, 0);
      return { profile: { outer, holes: [circle(num(shape.bore, 6) / 2, 0, 0, 24).reverse()] }, thick: num(shape.thickness, 6), approx: false };
    }
    case "genevaWheel":
    case "genevaCrank": {
      const part = type === "genevaWheel" ? genevaWheel(shape) : genevaCrank(shape);
      return { profile: part.profile, thick: part.thick, approx: false, features: part.features };
    }
    case "spatial-link": {
      // a link between skew hinges (Bennett): its knuckle on its own hinge; the bar and the far knuckle come after
      const span = pair(shape.span, [-5, 5]);
      return { profile: { outer: circle(num(shape.knuckle, 9), 0, 0, 40), holes: [] }, thick: span[1] - span[0], approx: false };
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
    const built =
      universal(kin, S, b, geom) ?? cylinder(b, geom) ?? plateCam(kin, S, b, geom) ?? ringWheel(geom) ?? crown(kin, S, b, geom) ?? vergeStaff(geom) ??
      screwGeom(b, geom) ?? nutGeom(b, geom) ?? flexureGeom(kin, b, geom) ?? sheaveGeom(kin, S, b, geom) ?? forkGeom(kin, S, b, geom) ?? ballGeom(b, geom) ?? carriageGeom(kin, b, geom) ??
      spatialLink(S, geom) ?? spherical(kin, S, b, geom) ?? geom;
    if (built.shape.rollers && typeof built.shape.rollers === "object") built.pieces = [...(built.pieces ?? []), ...turretRollers(built)];
    out.set(b.id, withPieces(b, withIndex(withBars(withBall(built)))));
  }
  matchBevelDepth(kin, out);
  seatBevels(kin, S, out);
  phaseMeshes(kin, S, out);
  return out;
}

/** Bevel gears in mesh share one working depth, the smaller module's (a hypoid's pinion and ring differ in module). */
function matchBevelDepth(kin: Kin, geoms: Map<string, BodyGeom>): void {
  for (const j of kin.joints) {
    if (j.type !== "gear-mesh") continue;
    const A = geoms.get(j.a)?.teeth, B = geoms.get(j.b)?.teeth;
    if (!A || !B || Math.abs(A.m - B.m) < 1e-9) continue;
    const depth = Math.min(A.m, B.m);
    for (const id of [j.a, j.b]) {
      const g = geoms.get(id)!;
      if (g.teeth!.depth === depth) continue;
      g.teeth = { ...g.teeth!, depth };
      g.mesh = bevelTeeth3(g.teeth);
    }
  }
}

/**
 * A bevel or hypoid gear stands along its axis so its pitch cone passes through its mesh point (J9): a mesh given at
 * the mean point of contact (a hypoid's) puts the gear's outer pitch circle behind it, where the cone's radius is the
 * outer pitch radius. A gear whose record sets its back face (`backFace`, `place`) or turns it over (`facing: -1`)
 * stands where it says.
 */
function seatBevels(kin: Kin, S: Setup, geoms: Map<string, BodyGeom>): void {
  for (const g of geoms.values()) {
    const sh = g.shape;
    if (String(sh.type) !== "gear" || typeof sh.cone !== "number" || sh.facing === -1 || sh.backFace !== undefined || sh.place !== undefined || !g.exact) continue;
    const j = kin.joints.find((q) => q.type === "gear-mesh" && (q.a === g.id || q.b === g.id) && S.joints.get(q.id));
    if (!j) continue;
    const P = S.joints.get(j.id)!.at;
    const z = num(sh.z, 20);
    const m = num(sh.module, 2);
    const bv = bevel(z, m, sh.cone * D2R, num(sh.face, 0) || undefined);
    const { uv, w } = planeCoords(g.frame, P);
    const k = Math.hypot(uv[0], uv[1]) / ((z * m) / 2);
    if (k < bv.inner - 0.02 || k > 1.02) continue;
    // the cone's radius is k of the outer pitch radius at (1 - k) of the apex's height over the outer pitch circle
    const offset = w - (1 - k) * bv.apex;
    if (Math.abs(offset - g.exact.offset) > 0.05) g.exact = { offset };
  }
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
      out.push({ z, profile: { outer: gearOutline(z, num(l.module, num(shape.module, 2))), holes: [circle(num(l.bore, num(shape.bore, 6)) / 2, 0, 0, 28)] }, thick: num(l.face, num(shape.face, 10)), ...(l.joined === true ? { joined: true } : {}) });
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

/**
 * Which level of a body a mesh joint reaches: 0 its own part, k its k-th cluster level (by the tooth count the joint
 * gives it, or the joint's `level` for the body where two levels have the same count: a long pinion).
 */
export function meshLevel(g: BodyGeom | undefined, j: { a: string; b: string; za?: unknown; zb?: unknown; level?: unknown }): number {
  if (!g?.levels?.length) return 0;
  const named = j.level && typeof j.level === "object" ? (j.level as Record<string, unknown>)[g.id] : undefined;
  if (typeof named === "number" && named >= 0 && named <= g.levels.length) return named;
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

/** A spiral bevel or hypoid gear's turn of its teeth from the outer end to the inner, radians, signed by its hand; 0 else. */
function spiralTurn(shape: Record<string, unknown>): number {
  if (typeof shape.cone !== "number" || typeof shape.spiral !== "number" || !shape.spiral) return 0;
  const z = num(shape.z, 20);
  const m = num(shape.module, 2);
  const bv = bevel(z, m, shape.cone * D2R, num(shape.face, 0) || undefined);
  const rMean = ((z * m) / 2) * (1 - (1 - bv.inner) / 2);
  return ((bv.b * Math.tan(shape.spiral * D2R)) / rMean) * (shape.hand === "left" ? -1 : 1);
}

/** How far a spiral gear's teeth have turned from the outer end where they cross the section through `P`, radians. */
function spiralAt(g: BodyGeom, P: Vec3): number {
  const turn = spiralTurn(g.shape);
  if (!turn) return 0;
  const z = num(g.shape.z, 20);
  const m = num(g.shape.module, 2);
  const bv = bevel(z, m, num(g.shape.cone, 45) * D2R, num(g.shape.face, 0) || undefined);
  const uv = planeCoords(g.frame, P).uv;
  const k = Math.hypot(uv[0], uv[1]) / ((z * m) / 2);
  return Math.max(0, Math.min(1, (1 - k) / (1 - bv.inner))) * turn;
}

/** A mesh turned by `a` about its z axis. */
function turnMesh(m: MeshData, a: number): MeshData {
  const c = Math.cos(a);
  const s = Math.sin(a);
  const pos = new Float32Array(m.pos.length);
  for (let k = 0; k < pos.length; k += 3) {
    pos[k] = c * m.pos[k]! - s * m.pos[k + 1]!;
    pos[k + 1] = s * m.pos[k]! + c * m.pos[k + 1]!;
    pos[k + 2] = m.pos[k + 2]!;
  }
  return { pos, tri: m.tri, tag: m.tag };
}

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
      if (s.g.mesh) s.g.mesh = turnMesh(s.g.mesh, v);
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
      if (j.crossed && A.kind !== "rack" && B.kind !== "rack") {
        // the set gear's nearest tooth (a spiral tooth where it crosses the mesh point's section) stands off the mesh
        // point by an arc along its pitch circle; the other gear's gap goes to the same place, carried along its own
        // turning direction there (the two pitch surfaces roll on each other at the mesh)
        const [K, U] = knownA ? [A, B] : [B, A];
        const radius = (q: Side) => Math.hypot(...planeCoords(q.g.frame, P).uv);
        const along = (q: Side) => v3.unit(v3.cross(q.g.frame.z, v3.sub(P, fromPlane(q.g.frame, q.c ?? [0, 0], 0))));
        const off = wrapTo(phi(K) - spiralAt(K.g, P) - set.get(K.key)!, Math.PI / K.z);
        const d = (-off * radius(K) * v3.dot(along(K), along(U))) / Math.max(1e-9, radius(U));
        apply(U, phi(U) - spiralAt(U.g, P) + d + (U.kind === "ring" ? 0 : Math.PI / U.z));
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
        const at = S.joints.get(j.id)!.at;
        const uv = planeCoords(A.g.frame, at).uv;
        const c = A.c ?? [0, 0];
        apply(A, Math.atan2(uv[1] - c[1], uv[0] - c[0]) - spiralAt(A.g, at));
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

/**
 * A curved slotted link (an expansion link): an arc band about `center` of radius `radius`, from `from` to `to` degrees
 * measured from the direction away from the centre through the frame origin (the link's trunnion, on the arc), the slot
 * `width` wide with a `wall` either side, round-ended; an ear out to the `foot` pin. Two cheeks: the lower one solid,
 * carrying the trunnion, the upper one slotted for the die, so the die runs in a groove over the trunnion.
 */
function linkArc(sa: Record<string, unknown>, foot: unknown, thick: number): { profile: Profile; thick: number; upper: { profile: Profile; h: number; name?: string } } {
  const [cx, cy] = pair(sa.center, [180, 0]);
  const R = num(sa.radius, 180);
  const w = num(sa.width, 15) / 2;
  const wall = num(sa.wall, 10);
  // angles about the centre, from the direction of the trunnion (the frame origin)
  const a0 = Math.atan2(-cy, -cx);
  const A0 = a0 + num(sa.from, -31) * D2R;
  const A1 = a0 + num(sa.to, 31) * D2R;
  const ft: Vec2 | null = Array.isArray(foot) && foot.length >= 2 ? [Number(foot[0]), Number(foot[1])] : null;
  const earR = 10;
  const band = (r0: number, r1: number, ear: boolean): Vec2[] => {
    const rc = (r1 - r0) / 2;
    const rm = (r0 + r1) / 2;
    const n = 120;
    const out: Vec2[] = [];
    // the outer arc, pushed out over the ear toward the foot
    const fr = ft ? Math.hypot(ft[0] - cx, ft[1] - cy) : 0;
    const fa = ft ? Math.atan2(ft[1] - cy, ft[0] - cx) : 0;
    for (let k = 0; k <= n; k++) {
      const t = A0 + ((A1 - A0) * k) / n;
      let r = r1;
      if (ear && ft) {
        const d = Math.sin(t - fa) * fr;
        if (Math.abs(d) < earR && Math.cos(t - fa) > 0) r = Math.max(r, fr * Math.cos(t - fa) + Math.sqrt(earR * earR - d * d));
      }
      out.push([cx + r * Math.cos(t), cy + r * Math.sin(t)]);
    }
    // round end at A1, the inner arc back, round end at A0
    for (let k = 1; k < 16; k++) {
      const t = A1 + (Math.PI * k) / 16;
      out.push([cx + rm * Math.cos(A1) + rc * Math.cos(t), cy + rm * Math.sin(A1) + rc * Math.sin(t)]);
    }
    for (let k = 0; k <= n; k++) {
      const t = A1 - ((A1 - A0) * k) / n;
      out.push([cx + r0 * Math.cos(t), cy + r0 * Math.sin(t)]);
    }
    for (let k = 1; k < 16; k++) {
      const t = A0 + Math.PI + (Math.PI * k) / 16;
      out.push([cx + rm * Math.cos(A0) + rc * Math.cos(t), cy + rm * Math.sin(A0) + rc * Math.sin(t)]);
    }
    return out;
  };
  const outer = band(R - w - wall, R + w + wall, true);
  // a hole winds clockwise
  const slotHole = band(R - w, R + w, false).reverse();
  // the lower cheek the thicker: it takes the trunnion's bearing and the clip recessed above it
  const h = Math.floor(thick * 0.45);
  return { profile: { outer, holes: [] }, thick, upper: { profile: { outer: band(R - w - wall, R + w + wall, false), holes: [slotHole] }, h, name: "slotted upper cheek" } };
}

/**
 * A rotary engine's rotor about its centre (the frame origin): three apexes at `apexRadius`, the first on the frame's x,
 * each flank an arc about the opposite apex's side, `flank` times the apex-to-apex distance in radius (1 is the
 * Reuleaux triangle, larger is flatter), bored for its eccentric (`bore`, radius). Its internal gear ring stands on it as
 * an upper plate: `internalGear` { z, module, rim } about the centre, half the rotor's thickness.
 */
function rotorOf(r: Record<string, unknown>, ig: Record<string, unknown> | undefined, thick: number): { profile: Profile; thick: number; approx: boolean; upper?: { profile: Profile; h: number; name?: string } } {
  const R = num(r.apexRadius, 102.6);
  const side = R * Math.sqrt(3);
  const rho = num(r.flank, 1.25) * side;
  const outer: Vec2[] = [];
  for (let k = 0; k < 3; k++) {
    const a = (k * TAU) / 3;
    const b = ((k + 1) * TAU) / 3;
    const A: Vec2 = [R * Math.cos(a), R * Math.sin(a)];
    const B: Vec2 = [R * Math.cos(b), R * Math.sin(b)];
    // the arc's centre on the far side of the rotor centre from the flank's middle
    const m: Vec2 = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
    const ml = Math.hypot(m[0], m[1]);
    const d = Math.sqrt(rho * rho - (side / 2) ** 2);
    const c: Vec2 = [(-m[0] / ml) * (d - ml), (-m[1] / ml) * (d - ml)];
    const t0 = Math.atan2(A[1] - c[1], A[0] - c[0]);
    let t1 = Math.atan2(B[1] - c[1], B[0] - c[0]);
    while (t1 < t0) t1 += TAU;
    for (let i = 0; i < 40; i++) {
      const t = t0 + ((t1 - t0) * i) / 40;
      outer.push([c[0] + rho * Math.cos(t), c[1] + rho * Math.sin(t)]);
    }
  }
  const bore = num(r.bore, 28);
  const holes = [circle(bore, 0, 0, 96).reverse()];
  if (!ig) return { profile: { outer, holes }, thick, approx: false };
  const z = num(ig.z, 45);
  const m = num(ig.module, 2);
  const rim = num(ig.rim, (z * m) / 2 + 9);
  const h = Math.floor(thick / 2);
  return { profile: { outer, holes }, thick, approx: false, upper: { profile: { outer: circle(rim, 0, 0, 96), holes: [gearOutline(z, m, 1.25, 1).reverse()] }, h, name: `internal gear ring, ${z} teeth` } };
}

/**
 * A rotary engine's housing about the shaft (the frame origin): a block `rect` [w, h] with corners of `corner`, its bore
 * the epitrochoid the apexes trace, x = R cos b - e cos 3b, y = R sin b - e sin 3b, opened `clear` mm (the apex seals'
 * running clearance is the rotor's).
 */
function housingOf(h: Record<string, unknown>, bore: Record<string, unknown> | undefined): Profile {
  const [w, ht] = pair(h.rect, [296, 236]);
  const ep = (bore?.epitrochoid ?? {}) as Record<string, unknown>;
  const R = num(ep.R, 103);
  const e = num(ep.e, 15);
  const hole: Vec2[] = [];
  for (let k = 0; k < 360; k++) {
    const b = (k * TAU) / 360;
    hole.push([R * Math.cos(b) - e * Math.cos(3 * b), R * Math.sin(b) - e * Math.sin(3 * b)]);
  }
  return { outer: roundRect(-w / 2, -ht / 2, w / 2, ht / 2, num(h.corner, 22)), holes: [hole.reverse()] };
}

/** A ring of radius r0 at the origin with a rod of half width r1 to a round end at L along x (counter-clockwise). */
function ringAndRod(L: number, r0: number, r1: number): Vec2[] {
  const a = Math.asin(r1 / r0);
  const out: Vec2[] = [];
  const n = 96;
  for (let k = 0; k <= n; k++) {
    const t = a + ((TAU - 2 * a) * k) / n;
    out.push([r0 * Math.cos(t), r0 * Math.sin(t)]);
  }
  for (let k = 0; k <= 16; k++) {
    const t = -Math.PI / 2 + (Math.PI * k) / 16;
    out.push([L + r1 * Math.cos(t), r1 * Math.sin(t)]);
  }
  return out;
}

const rot = (pts: Vec2[], a: number): Vec2[] => pts.map(([x, y]): Vec2 => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)]);

/**
 * A plate cam (`cam` shape) from the cam-contact joint it drives: the outline is the law wrapped round the cam's centre
 * (src/builder/cams.ts), a roller follower's as the roller's inner envelope, a flat face's as the face lines' envelope;
 * bored for its shaft. The joint's `at` is the roller centre (or the face's point on the follower line) at the reference.
 */
function plateCam(kin: Kin, S: Setup, b: KinBody, g: BodyGeom): BodyGeom | null {
  if (String(g.shape.type) !== "cam") return null;
  if (g.shape.form === "barrel") return barrel(kin, S, b, g);
  if (g.shape.form === "lobes") return lobes(kin, b, g);
  if (g.shape.form === "globoid") return globoid(kin, S, b, g);
  if (g.shape.form === "face-groove") return faceGroove(kin, S, b, g);
  const j = kin.joints.find((q) => q.type === "cam-contact" && (q.b === b.id || q.a === b.id) && q.cam);
  const r = j ? S.joints.get(j.id) : undefined;
  if (!j || !r) return null;
  const uv = planeCoords(g.frame, r.at).uv;
  const L = camLawOf(j, r.num, Math.atan2(uv[1], uv[0]));
  if (!L) return null;
  const rr = num(g.shape.rollerRadius, 0);
  const outer = j.follower === "flat" || !rr ? flatCam(L) : rollerCam(L, rr);
  const bore = num(g.shape.bore, 8);
  return { ...g, profile: { outer, holes: [circle(bore / 2, 0, 0, 28).reverse()] }, thick: num(g.shape.thick, num(g.shape.thickness, THICK)), approx: false };
}

/**
 * A face-groove cam (`cam` with `form: face-groove`): a plain disc of `radius` with the groove cut into its top face,
 * the pitch curve offset by half the groove's `width` each side, `depth` deep. The roller runs on the pitch curve, so
 * the groove's centre line is the law (the joint's rb is the pitch radius).
 */
function faceGroove(kin: Kin, S: Setup, b: KinBody, g: BodyGeom): BodyGeom | null {
  const j = kin.joints.find((q) => q.type === "cam-contact" && (q.b === b.id || q.a === b.id) && q.cam);
  const r = j ? S.joints.get(j.id) : undefined;
  if (!j || !r) return null;
  const uv = planeCoords(g.frame, r.at).uv;
  const L = camLawOf(j, r.num, Math.atan2(uv[1], uv[0]));
  if (!L) return null;
  const gr = (g.shape.groove ?? {}) as Record<string, unknown>;
  const w = num(gr.width, 10.2);
  const depth = num(gr.depth, 6);
  const thick = num(g.shape.thick, num(g.shape.thickness, 16));
  const R = num(g.shape.radius, 75);
  const bore = num(g.shape.bore, 10);
  const outerWall = rollerCam(L, -w / 2);
  const innerWall = rollerCam(L, w / 2).reverse();
  return {
    ...g,
    profile: { outer: circle(R, 0, 0, 144), holes: [circle(bore / 2, 0, 0, 28).reverse()] },
    thick,
    approx: false,
    features: [{ mode: "cut", profile: { outer: outerWall, holes: [innerWall] }, op: { op: "extrude", h: depth + 1, steps: 1 }, frame: { o: [0, 0, thick - depth], x: [1, 0, 0], z: [0, 0, 1] } }],
  };
}

/**
 * A barrel cam (`cam` with `form: barrel`): a drum of `radius` and `length` on its axis (the body's frame z), centred on
 * its joint unless `place` says where it starts, its groove cut by the law: a tube of the groove's section carried round
 * the drum (src/builder/cams.ts barrelGroove), subtracted by Manifold. The roller's joint sets the pitch radius's place
 * and the groove's axial origin.
 */
function barrel(kin: Kin, S: Setup, b: KinBody, g: BodyGeom): BodyGeom | null {
  const j = kin.joints.find((q) => q.type === "cam-contact" && (q.b === b.id || q.a === b.id) && q.cam);
  const r = j ? S.joints.get(j.id) : undefined;
  if (!j || !r) return null;
  const pc = planeCoords(g.frame, r.at);
  const L = camLawOf(j, r.num, Math.atan2(pc.uv[1], pc.uv[0]));
  if (!L) return null;
  const R = num(g.shape.radius, 64);
  const len = num(g.shape.length, 140);
  const gr = (g.shape.groove ?? {}) as Record<string, unknown>;
  const w = num(gr.width, 12.1);
  const depth = num(gr.depth, 8);
  const rp = Math.hypot(pc.uv[0], pc.uv[1]);
  const offset = typeof g.shape.place === "number" ? g.shape.place : -len / 2;
  const bore = num(g.shape.bore, num(g.shape.shaft, 16));
  const mesh = barrelGroove(L, pc.w, rp, w, R - depth, R + 2);
  return {
    ...g,
    profile: { outer: circle(R, 0, 0, 144), holes: [circle(bore / 2, 0, 0, 32).reverse()] },
    thick: len,
    approx: false,
    exact: { offset },
    features: [{ mode: "cut", profile: { outer: [], holes: [] }, op: { op: "extrude", h: 1, steps: 1 }, frame: { o: [0, 0, -offset], x: [1, 0, 0], z: [0, 0, 1] }, mesh }],
  };
}

/**
 * Plates of a body beyond its own part, declared in its shape (`pieces`: { id, outline, origin, rot, thick, fillet }, the
 * frame in world reference coordinates, the outline filleted as drawn): an upright on a slide that carries a roller's stud.
 */
function withPieces(b: KinBody, g: BodyGeom): BodyGeom {
  const list = g.shape.pieces;
  if (!Array.isArray(list) || !list.length) return g;
  const pieces = [...(g.pieces ?? [])];
  list.forEach((pc: Record<string, unknown>, k) => {
    const pts = (pc.outline as number[][]).map((q): Vec2 => [q[0]!, q[1]!]);
    const o = (pc.origin as number[] | undefined) ?? [0, 0, 0];
    const R = m3.eulerDeg(((pc.rot as number[] | undefined) ?? [0, 0, 0]) as Vec3);
    const frame = { o: [o[0]!, o[1]!, o[2] ?? 0] as Vec3, x: [R[0], R[3], R[6]] as Vec3, z: [R[2], R[5], R[8]] as Vec3 };
    const holes = Array.isArray(pc.holes) ? (pc.holes as number[][][]).map((h) => { const r = h.map((q): Vec2 => [q[0]!, q[1]!]); return area(r) > 0 ? r.reverse() : r; }) : [];
    pieces.push({ id: `${b.id}-${String(pc.id ?? `piece${k}`)}`, name: "", frame, profile: { outer: filletPoly(area(pts) < 0 ? pts.slice().reverse() : pts, num(pc.fillet, 1.5)), holes }, h: num(pc.thick, 8) });
  });
  return { ...g, pieces };
}

/**
 * A camshaft of conjugate lobes (`cam` with `form: lobes`): a hub along the shaft (`hub` radius, from `place` for
 * `length`), and one lobe per entry of `lobes` ({ id, shoe, radius, lash, from, to }): the inner envelope of a circle of
 * `radius + lash` round the named shoe point's path in the camshaft's frame over the cycle, as the kinematics move it,
 * between `from` and `to` along the shaft's axis. Each lobe is then exactly what its rocker needs (K1).
 */
function lobes(kin: Kin, b: KinBody, g: BodyGeom): BodyGeom | null {
  const list = g.shape.lobes;
  if (!Array.isArray(list)) return null;
  const K = new Kinematics(kin);
  const N = 720;
  const poses = Array.from({ length: N }, (_, k) => K.pose((k / N) * TAU));
  const F = g.frame;
  const pieces = [...(g.pieces ?? [])];
  for (const lb of list as Record<string, unknown>[]) {
    const shoe = String(lb.shoe);
    const path: Vec2[] = [];
    for (const P of poses) {
      const X = P.bodies.get(b.id);
      const p = P.points.get(shoe);
      if (!X || !p) return null;
      path.push(planeCoords(F, xf.apply(xf.inv(X), p)).uv);
    }
    const r = num(lb.radius, 8) + num(lb.lash, 0);
    // the inner offset of the shoe's path (counter-clockwise about the shaft) by r, along its normals
    const ccw = area(path) < 0 ? path.slice().reverse() : path;
    const n = ccw.length;
    const outer: Vec2[] = ccw.map((q, k) => {
      const a = ccw[(k - 1 + n) % n]!;
      const c = ccw[(k + 1) % n]!;
      const tx = c[0] - a[0];
      const ty = c[1] - a[1];
      const L = Math.hypot(tx, ty) || 1;
      // the outward normal of a counter-clockwise curve is (ty, -tx)
      return [q[0] - (r * ty) / L, q[1] + (r * tx) / L];
    });
    const z0 = num(lb.from, 0);
    const z1 = num(lb.to, 8);
    pieces.push({ id: `${b.id}-${String(lb.id ?? "lobe")}`, name: "", frame: { o: v3.add(F.o, v3.mul(F.z, z0)), x: F.x, z: F.z }, profile: { outer, holes: [] }, h: z1 - z0 });
  }
  const len = num(g.shape.length, 40);
  return {
    ...g,
    profile: { outer: circle(num(g.shape.hub, 10), 0, 0, 48), holes: [] },
    thick: len,
    approx: false,
    exact: { offset: typeof g.shape.place === "number" ? g.shape.place : -len / 2 },
    pieces,
  };
}

/**
 * An internal Geneva wheel (`genevaWheel` with `internal`): its own part is the web under the ring (`web` thick, a plain
 * disc on the wheel's shaft), so the shaft's stack ends below the ring where the crank's pin passes; the slotted ring is a
 * piece of the body in the ring's plane, its slots and arcs cut as features.
 */
function ringWheel(g: BodyGeom): BodyGeom | null {
  if (String(g.shape.type) !== "genevaWheel" || !g.shape.internal) return null;
  const web = num(g.shape.web, 6);
  const place = num(g.shape.place, 0);
  const rOut = num((g.shape.internal as Record<string, unknown>).rimOut, 88);
  const F = g.frame;
  const ring = { id: `${g.id}-ring`, name: "", frame: { o: v3.add(F.o, v3.mul(F.z, place)), x: F.x, z: F.z }, profile: g.profile, h: g.thick, ...(g.features ? { features: g.features } : {}) };
  return { ...g, profile: { outer: circle(rOut, 0, 0, 144), holes: [] }, thick: web, features: [], exact: { offset: place - web - 1 }, pieces: [...(g.pieces ?? []), ring] };
}

/**
 * A crown wheel (`crownWheel`): a ring of radius `R` (rim `rim` wide) on spokes, its face in the plane through its joint
 * square to its axis, and `n` saw teeth standing `h` out of that face toward its front (−axis): each a triangle of its
 * steep leading face and its back slope (`back` deg of the circle behind), extruded across the rim. The first tooth's
 * tip stands at `tip0` deg from the world +z toward +x (the verge block's convention; the simulated phase at the
 * reference). The wheel turns forward about +y.
 */
function crown(kin: Kin, S: Setup, b: KinBody, g: BodyGeom): BodyGeom | null {
  if (String(g.shape.type) !== "crownWheel") return null;
  const j = kin.joints.find((q) => (q.a === "ground" || q.b === "ground") && (q.a === b.id || q.b === b.id));
  const C = j ? S.joints.get(j.id)!.at : g.frame.o;
  const n = num(g.shape.n, 15);
  const R = num(g.shape.R, 40);
  const rim = num(g.shape.rim, 5);
  const h = num(g.shape.h, 8);
  const back = num(g.shape.back, 12) * D2R;
  const t0 = num(g.shape.tip0, 0) * D2R;
  const pieces = [...(g.pieces ?? [])];
  const bl = (R - rim / 2) * back;
  for (let k = 0; k < n; k++) {
    const a = t0 + (k * TAU) / n;
    const rad: Vec3 = [Math.sin(a), 0, Math.cos(a)];
    const tan: Vec3 = [Math.cos(a), 0, -Math.sin(a)];
    pieces.push({ id: `${b.id}-tooth${k}`, name: "", frame: { o: v3.add(C, v3.mul(rad, R - rim)), x: tan, z: rad }, profile: { outer: [[0, 0.2], [0, -h], [-bl, 0.2]], holes: [] }, h: rim });
  }
  // the rim and its spokes, in the face's plane: the body's frame has z along +y
  const spokes = 4;
  const holes: Vec2[][] = [];
  for (let k = 0; k < spokes; k++) {
    const a0 = (k * TAU) / spokes + 0.2;
    const a1 = ((k + 1) * TAU) / spokes - 0.2;
    const w: Vec2[] = [];
    for (let i = 0; i <= 12; i++) w.push([(R - rim) * Math.cos(a0 + ((a1 - a0) * i) / 12), (R - rim) * Math.sin(a0 + ((a1 - a0) * i) / 12)]);
    for (let i = 12; i >= 0; i--) w.push([9 * Math.cos(a0 + ((a1 - a0) * i) / 12), 9 * Math.sin(a0 + ((a1 - a0) * i) / 12)]);
    holes.push(w.reverse());
  }
  return { ...g, profile: { outer: circle(R, 0, 0, 120), holes }, thick: num(g.shape.thickness, 4), approx: false, exact: { offset: 0 }, pieces };
}

/**
 * A verge (`verge`): a staff (`staff` { diameter, from, to } along its axis from its joint), two flag pallets
 * (`pallets` [{ at (height), angle (deg from +x about +z at foliot 0), from, to, height, thickness }]) and a foliot bar
 * (`foliot` { at, length, weights, weightR }) across its top.
 */
function vergeStaff(g: BodyGeom): BodyGeom | null {
  if (String(g.shape.type) !== "verge") return null;
  const F = g.frame;
  const st = (g.shape.staff ?? {}) as Record<string, number>;
  const d = num(st.diameter, 4);
  const from = num(st.from, -50);
  const to = num(st.to, 80);
  const pieces = [...(g.pieces ?? [])];
  const up: Vec3 = F.z;
  for (const [k, p] of ((g.shape.pallets ?? []) as Record<string, number>[]).entries()) {
    const be = num(p.angle, 0) * D2R;
    const dir: Vec3 = [Math.cos(be), Math.sin(be), 0];
    const nrm: Vec3 = [-Math.sin(be), Math.cos(be), 0];
    const th = num(p.thickness, 1.5);
    const zc = num(p.at, 0);
    const hh = num(p.height, 10) / 2;
    // frame x along the flag, z its normal, so y is −z of the world: the outline's v is minus the height
    pieces.push({ id: `${g.id}-pallet${k}`, name: "", frame: { o: v3.sub(F.o, v3.mul(nrm, th / 2)), x: dir, z: nrm }, profile: { outer: [[num(p.from, 2), -(zc - hh)], [num(p.to, 12), -(zc - hh)], [num(p.to, 12), -(zc + hh)], [num(p.from, 2), -(zc + hh)]].map(([a, c]): Vec2 => [a!, c!]), holes: [] }, h: th });
  }
  const fo = (g.shape.foliot ?? {}) as Record<string, number>;
  const fz = num(fo.at, to);
  const L = num(fo.length, 160) / 2;
  const top = v3.add(F.o, v3.mul(up, fz));
  pieces.push({ id: `${g.id}-foliot`, name: "", frame: { o: top, x: [1, 0, 0], z: up }, profile: { outer: roundedPoly([[-L, 0], [L, 0]], 3), holes: [] }, h: 5 });
  for (const s2 of [1, -1]) pieces.push({ id: `${g.id}-weight${s2 > 0 ? 0 : 1}`, name: "", frame: { o: v3.add(top, v3.mul(up, -2)), x: [1, 0, 0], z: up }, profile: { outer: circle(num(fo.weightR, 8), s2 * num(fo.weights, 60), 0, 32), holes: [] }, h: 9 });
  return { ...g, profile: { outer: circle(d / 2, 0, 0, 24), holes: [] }, thick: to - from, approx: false, exact: { offset: from }, pieces };
}

/**
 * A roller-gear indexer's globoidal cam (`cam` with `form: globoid`): a blank cylinder of `blank` radius and `length` on
 * the camshaft, bored for its shaft, with every pose of the turret's rollers over a turn subtracted in the camshaft's
 * frame (the turret stepping `step` deg by `law` over `index` deg of camshaft from `phi0`, dwelling the rest): what
 * remains is the rib, the envelope of the rollers, straight over the dwell and twisted over the index (D8, a boolean).
 * The turret is the cam contact's other body; its shape's `rollers` { n, pitchRadius, diameter, length, firstAt } give
 * the rollers, radial in its mid-plane.
 */
function globoid(kin: Kin, S: Setup, b: KinBody, g: BodyGeom): BodyGeom | null {
  const cj = kin.joints.find((q) => q.type === "cam-contact" && (q.a === b.id || q.b === b.id));
  if (!cj) return null;
  const turret = cj.a === b.id ? cj.b : cj.a;
  const tb = kin.bodies.find((q) => q.id === turret);
  const tj = kin.joints.find((q) => (q.a === "ground" || q.b === "ground") && (q.a === turret || q.b === turret));
  const aj = kin.joints.find((q) => (q.a === "ground" || q.b === "ground") && (q.a === b.id || q.b === b.id));
  if (!tb || !tj || !aj) return null;
  const B = S.joints.get(tj.id)!;
  const A = S.joints.get(aj.id)!;
  const ro = (tb.shape?.rollers ?? {}) as Record<string, number>;
  const n = num(ro.n, 8);
  const Rp = num(ro.pitchRadius, 60);
  const rr = num(ro.diameter, 20) / 2 + num(g.shape.clearance, 0.15);
  const len = num(ro.length, 18);
  const first = num(ro.firstAt, 0) * D2R;
  const step = num(g.shape.step, 45) * D2R;
  const index = num(g.shape.index, 120) * D2R;
  const phi0 = num(g.shape.phi0, 0) * D2R;
  const sense = num(g.shape.sense, 1) >= 0 ? 1 : -1;
  const law = (String(g.shape.law ?? "modsine") === "modified sine" ? "modsine" : String(g.shape.law ?? "modsine")) as CamLaw;
  const turn = (p: number) => {
    const k = Math.floor(p / TAU);
    return step * (k + lawRise(law, Math.min(1, (p - k * TAU) / index)).s);
  };
  const length = num(g.shape.length, 96);
  const offset = -length / 2;
  const F = g.frame;
  const Fy = v3.cross(F.z, F.x);
  const P0 = v3.add(F.o, v3.mul(F.z, offset));
  const toPart = (p: Vec3): Vec3 => { const d = v3.sub(p, P0); return [v3.dot(d, F.x), v3.dot(d, Fy), v3.dot(d, F.z)]; };
  const dirPart = (d: Vec3): Vec3 => [v3.dot(d, F.x), v3.dot(d, Fy), v3.dot(d, F.z)];
  const features: import("../solids/types").Feature[] = [];
  const toCam = v3.unit(v3.sub([A.at[0], A.at[1], B.at[2]], [B.at[0], B.at[1], B.at[2]]));
  const samples = Math.round(num(g.shape.samples, 240));
  for (let i = 0; i < samples; i++) {
    const th = (i / samples) * TAU;
    const t = sense * (turn(phi0 + th) - turn(phi0));
    // the camshaft turned by th: a world point in the cam's frame is turned back by −th about its axis
    const back = xf.rotAbout(A.at, A.axis, -th);
    for (let k = 0; k < n; k++) {
      const be = first + (k * TAU) / n + t;
      const d: Vec3 = [Math.cos(be), Math.sin(be), 0];
      if (v3.dot(d, toCam) < Math.cos(75 * D2R)) continue;
      // each cutter runs 4 mm past the roller's inner end, so it breaks cleanly through the blank's surface
      const start = xf.apply(back, v3.add(B.at, v3.mul(d, Rp - len / 2 - 4)));
      const dir = xf.dir(back, d);
      const zl = dirPart(dir);
      const h0: Vec3 = Math.abs(zl[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0];
      const xl = v3.unit(v3.cross(h0, zl));
      features.push({ mode: "cut", profile: { outer: circle(rr, 0, 0, 20), holes: [] }, op: { op: "extrude", h: len + 4, steps: 1 }, frame: { o: toPart(start), x: xl, z: zl } });
    }
  }
  return {
    ...g,
    profile: { outer: circle(num(g.shape.blank, 50), 0, 0, 96), holes: [circle(num(g.shape.shaft, 20) / 2, 0, 0, 32).reverse()] },
    thick: length,
    approx: false,
    exact: { offset },
    features,
  };
}

/** A turret's radial rollers (`rollers` { n, pitchRadius, diameter, length, firstAt }) in its mid-plane, as pieces. */
function turretRollers(g: BodyGeom): NonNullable<BodyGeom["pieces"]> {
  const ro = g.shape.rollers as Record<string, number>;
  const F = g.frame;
  const Fy = v3.cross(F.z, F.x);
  const mid = num(g.shape.place, 0) + g.thick / 2;
  const out: NonNullable<BodyGeom["pieces"]> = [];
  const n = num(ro.n, 8);
  const len = num(ro.length, 18);
  for (let k = 0; k < n; k++) {
    // firstAt is from the world x, as the rib reads it; in the body's frame, from its own x
    const a = num(ro.firstAt, 0) * D2R + (k * TAU) / n;
    const d: Vec3 = [Math.cos(a), Math.sin(a), 0];
    const o = v3.add(v3.add(F.o, v3.mul(F.z, mid)), v3.mul(d, num(ro.pitchRadius, 60) - len / 2));
    const x = v3.unit(v3.cross(F.z, d));
    out.push({ id: `${g.id}-roller${k}`, name: "", frame: { o, x, z: d }, profile: { outer: circle(num(ro.diameter, 20) / 2, 0, 0, 32), holes: [] }, h: len });
  }
  void Fy;
  return out;
}

/** A sphere's half profile for a revolve about its frame's z: radius r, centred on the frame's origin. */
export function ballProfile(r: number, n = 24): Profile {
  const pts: Vec2[] = [];
  for (let i = 0; i <= n; i++) {
    const t = (Math.PI * i) / n;
    pts.push([Math.max(0, r * Math.sin(t)), -r * Math.cos(t)]);
  }
  return { outer: pts, holes: [] };
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
 * A link between two skew hinges (`spatial-link`, a Bennett linkage): a knuckle on each hinge, side by side with its
 * neighbour's along the hinge (`span` on its own hinge, `far.span` on the other, both along the hinge's axis from the
 * joint, its sign fixed as `canon`), and a round bar between the knuckles (`barAt`: where it leaves each, along its
 * hinge; default the knuckles' middles). The far
 * knuckle is a lug of the far hinge's stack (rules/lugs); the bar is a piece of the body.
 */
function spatialLink(S: Setup, g: BodyGeom): BodyGeom | null {
  const sh = g.shape;
  if (String(sh.type) !== "spatial-link") return null;
  const span = pair(sh.span, [-5, 5]);
  const far = (sh.far ?? {}) as { joint?: unknown; span?: unknown };
  const fj = typeof far.joint === "string" ? S.joints.get(far.joint) : undefined;
  if (!fj) return { ...g, exact: { offset: span[0] } };
  const fs = pair(far.span, [-5, 5]);
  // the bar leaves each knuckle at `bar.at` along the hinge (default the knuckle's middle): a long barrel can carry the
  // bar well off the common normal, clear of the other links where the loop passes through a crossed pose
  const at = (sh.barAt ?? []) as number[];
  const a = v3.add(g.frame.o, v3.mul(g.frame.z, typeof at[0] === "number" ? at[0] : (span[0] + span[1]) / 2));
  const b = v3.add(fj.at, v3.mul(canon(fj.axis), typeof at[1] === "number" ? at[1] : (fs[0] + fs[1]) / 2));
  const z = v3.unit(v3.sub(b, a));
  const rb = num(sh.bar, 6);
  // the bar starts and ends in the knuckles' walls, clear of the pin bores
  const rk = num(sh.knuckle, 9) - 1;
  const a1 = v3.add(a, v3.mul(z, rk));
  const L = v3.dist(a, b) - 2 * rk;
  return {
    ...g,
    exact: { offset: span[0] },
    pieces: [{ id: `${g.id}-bar`, name: "", frame: { o: a1, x: v3.unit(v3.perp(Math.abs(z[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0], z)), z }, profile: { outer: circle(rb, 0, 0, 28), holes: [] }, h: L }],
  };
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

/** Points of an arc in (r, z) about (0, zc), radius R, from angle a0 to a1 (radians, from the +r axis toward +z). */
function arcRZ(R: number, zc: number, a0: number, a1: number, n = 12): Vec2[] {
  return Array.from({ length: n + 1 }, (_, i) => {
    const a = a0 + ((a1 - a0) * i) / n;
    return [Math.max(0, R * Math.cos(a)), zc + R * Math.sin(a)] as Vec2;
  });
}

/** A ball's swept track in a race or bell: a tube along a meridian arc of radius rp about the centre, in the body's frame. */
function grooveCut(sJ: number, rp: number, rb: number, phase: number, span: number): Feature {
  const path: Vec3[] = [];
  const c = Math.cos(phase * D2R);
  const s = Math.sin(phase * D2R);
  // 16 steps keep the chord's sag under 0.05 mm on a 25 mm arc; an 18-sided tube keeps its inscribed radius over the
  // ball's (rb is the ball's radius plus 0.2)
  for (let i = 0; i <= 16; i++) {
    const a = -span + (2 * span * i) / 16;
    const r = rp * Math.cos(a);
    path.push([r * c, r * s, sJ + rp * Math.sin(a)]);
  }
  return { mode: "cut", profile: { outer: circle(rb, 0, 0, 18), holes: [] }, op: { op: "sweep", path }, frame: { o: [0, 0, 0], x: [1, 0, 0], z: [0, 0, 1] } };
}

/**
 * The parts of a ball-and-groove constant-velocity joint (a Rzeppa), all solids of revolution about the body's axis:
 * `ball` (diameter), `race` (the inner race: a spherical band of `sphere` radius, `width` wide, with `grooves` meridian
 * grooves for balls of `ballDiameter` on a pitch radius `pitch`, at `phases` about its axis from its frame's x, on a
 * keyed hub), `bell` (the outer race: a cup whose spherical cavity of `sphere` radius holds the cage, grooved likewise),
 * and `cage` (a spherical band between `inner` and `outer`, `width` wide, with a window at each ball it holds). `center`
 * names the joint at the joint's centre.
 */
function spherical(kin: Kin, S: Setup, b: KinBody, g: BodyGeom): BodyGeom | null {
  const sh = g.shape;
  const type = String(sh.type);
  if (!["ball", "race", "bell", "cage"].includes(type)) return null;
  if (type === "ball") return { ...g, profile: ballProfile(num(sh.diameter, 16) / 2, 32), thick: 0, revolve: true, exact: { offset: 0 }, approx: false };
  const cj = typeof sh.center === "string" ? S.joints.get(sh.center) : undefined;
  const J = cj?.at ?? g.frame.o;
  const sJ = v3.dot(v3.sub(J, g.frame.o), g.frame.z);
  const rb = num(sh.ballDiameter, 16) / 2 + 0.2;
  const rp = num(sh.pitch, 25);
  const phases = (Array.isArray(sh.phases) ? sh.phases : []) as number[];
  if (type === "cage") {
    const ri = num(sh.inner, 24.5);
    const ro = num(sh.outer, 32.5);
    const w = num(sh.width, 22) / 2;
    const ai = Math.asin(w / ri);
    const ao = Math.asin(w / ro);
    const outer: Vec2[] = [...arcRZ(ro, 0, -ao, ao), ...arcRZ(ri, 0, ai, -ai)];
    // a window at each ball the cage holds (its planar joints), through the band
    const [ww, wh] = pair(sh.window, [18, 16.4]);
    const features: Feature[] = kin.joints
      .filter((j) => (j.a === b.id || j.b === b.id) && j.type === "planar")
      .map((j) => {
        const p = v3.sub(S.joints.get(j.id)!.at, g.frame.o);
        const yv = v3.cross(g.frame.z, g.frame.x);
        const u = v3.unit([v3.dot(p, g.frame.x), v3.dot(p, yv), 0]);
        return { mode: "cut" as const, profile: { outer: roundRect(-wh / 2, -ww / 2, wh / 2, ww / 2, 2), holes: [] }, op: { op: "extrude" as const, h: ro + 6 - (ri - 6), steps: 1 }, frame: { o: v3.mul(u, ri - 6), x: [0, 0, 1] as Vec3, z: u } };
      });
    return { ...g, profile: { outer, holes: [] }, thick: 0, revolve: true, features, exact: { offset: 0 }, approx: false };
  }
  const R = num(sh.sphere, type === "race" ? 24 : 33);
  const grooves = phases.map((ph) => grooveCut(sJ, rp, rb, ph, 45 * D2R));
  const hubR = num(sh.hub, 13);
  const hubL = 14;
  if (type === "race") {
    const w = num(sh.width, 24) / 2;
    const a = Math.asin(w / R);
    const band: Vec2[] = [[0, sJ - w], ...arcRZ(R, sJ, -a, a), [0, sJ + w]];
    // the hub sits behind the band, toward the frame's origin (the race's own shaft end)
    const dir = sJ >= 0 ? 1 : -1;
    const h0 = sJ - dir * (w + hubL);
    return {
      ...g,
      profile: { outer: circle(hubR, 0, 0, 36), holes: [] },
      thick: hubL,
      exact: { offset: Math.min(h0, h0 + dir * hubL) },
      approx: false,
      pieces: [{ id: `${b.id}-race`, name: "", frame: { o: g.frame.o, x: g.frame.x, z: g.frame.z }, profile: { outer: band, holes: [] }, h: 0, revolve: true, features: grooves }],
    };
  }
  // the bell: its mouth toward the inner race (toward the frame's... the side away from its own shaft), its back closed
  const Ro = num(sh.outer, 42);
  const dir = sJ <= 0 ? 1 : -1; // from the centre toward the bell's back (its shaft)
  const mouth = num(sh.mouth, 16);
  const back = num(sh.back, 22);
  const zM = sJ - dir * mouth;
  const zB = sJ + dir * (back + 8);
  const aM = -Math.asin(mouth / R);
  const aB = Math.asin(back / R);
  const cav = arcRZ(R, 0, aB, aM).map(([r, z]): Vec2 => [r, sJ + dir * (z - 0)]);
  const outer: Vec2[] = [[Ro, zM], [Ro, zB], [0, zB], [0, sJ + dir * back], ...cav];
  return {
    ...g,
    profile: { outer: circle(hubR + 1, 0, 0, 36), holes: [] },
    thick: hubL,
    exact: { offset: Math.min(zB, zB + dir * hubL) },
    approx: false,
    pieces: [{ id: `${b.id}-bell`, name: "", frame: { o: g.frame.o, x: g.frame.x, z: g.frame.z }, profile: { outer, holes: [] }, h: 0, revolve: true, features: grooves }],
  };
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
