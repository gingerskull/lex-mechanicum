// Cams: a plate cam from the law of its contact, a face-groove cam, a barrel cam, a camshaft of conjugate lobes and a
// roller-gear indexer's globoidal cam.
import { D2R, TAU, area, circle, type Vec2 } from "../../core/geom";
import type { Kin, KinBody } from "../../kin/types";
import { Kinematics, type Setup } from "../../kin/compose";
import { camMotion, camTurns, lawRise, type CamLaw } from "../../kin/blocks/cam";
import { type Vec3, v3, xf } from "../../kin/math";
import { THICK } from "../constants";
import { planeCoords } from "../frames";
import { barrelGroove, barrelTrack, camLawOf, type CamLawSpec, flatCam, rollerCam } from "../cams";
import type { BodyGeom } from "../shapes";
import { num } from "./common";

/**
 * A plate cam (`cam` shape) from the cam-contact joint it drives: the outline is the law wrapped round the cam's centre
 * (src/builder/cams.ts), a roller follower's as the roller's inner envelope, a flat face's as the face lines' envelope;
 * bored for its shaft. The joint's `at` is the roller centre (or the face's point on the follower line) at the reference.
 */
export function plateCam(kin: Kin, S: Setup, b: KinBody, g: BodyGeom): BodyGeom | null {
  if (String(g.shape.type) === "shoe") return grooveShoe(kin, S, b, g);
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
  if (camTurns(L.sched) > 1) return barrelTrackGeom(g, L, pc.w, rp, { R, len, w, depth, offset, bore });
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
 * A barrel track of several turns (a self-reversing screw's crossing grooves): the drum with the track cut in pieces
 * (src/builder/cams.ts barrelTrack), each cutter reaching 1 mm below the groove's root, then the root put back as one
 * turned core over the grooved length, so the root is one smooth cylinder where the grooves cross (D8, a boolean).
 */
function barrelTrackGeom(g: BodyGeom, L: CamLawSpec, a0: number, rp: number, d: { R: number; len: number; w: number; depth: number; offset: number; bore: number }): BodyGeom {
  const { R, len, w, depth, offset, bore } = d;
  const rIn = R - depth;
  const pieces = barrelTrack(L, a0, rp, w, rIn - 1, R + 2);
  // the grooved length along the drum's axis, in the part's coordinates (from its start), with a groove's width spare
  let lo = Infinity;
  let hi = -Infinity;
  for (const m of pieces)
    for (let k = 2; k < m.pos.length; k += 3) {
      lo = Math.min(lo, m.pos[k]!);
      hi = Math.max(hi, m.pos[k]!);
    }
  const z0 = Math.max(0.5, lo - offset - w / 2);
  const z1 = Math.min(len - 0.5, hi - offset + w / 2);
  const features: import("../../solids/types").Feature[] = pieces.map((mesh) => ({ mode: "cut", profile: { outer: [], holes: [] }, op: { op: "extrude", h: 1, steps: 1 }, frame: { o: [0, 0, -offset], x: [1, 0, 0], z: [0, 0, 1] }, mesh }));
  features.push({ mode: "add", profile: { outer: circle(rIn, 0, 0, 144), holes: [circle(bore / 2, 0, 0, 32).reverse()] }, op: { op: "extrude", h: z1 - z0, steps: 1 }, frame: { o: [0, 0, z0], x: [1, 0, 0], z: [0, 0, 1] } });
  return {
    ...g,
    profile: { outer: circle(R, 0, 0, 144), holes: [circle(bore / 2, 0, 0, 32).reverse()] },
    thick: len,
    approx: false,
    exact: { offset },
    features,
  };
}

/**
 * A groove shoe (`shoe`): the swivelling follower of a barrel track that crosses itself, a boat-shaped blade in the
 * groove under a round boss that carries its pivot. Its body is the cam contact's follower on the drum (the joint's
 * `at` the blade's centre at the pitch radius) and turns on its own pivot square to the drum's surface (its `at` joint),
 * so the blade lies along the groove at the reference and the kinematics swivel it with the groove (the cam block's
 * `shoe`). The blade is `length` long and `width` wide at its middle, narrowing to round points (an ellipse in plan), so
 * it bridges the crossing groove and clears the walls as they twist away from its middle; its underside is cut round
 * the drum's axis, `root` clear of the groove's root, and its top meets the boss `clear` above the drum.
 */
function grooveShoe(kin: Kin, S: Setup, b: KinBody, g: BodyGeom): BodyGeom | null {
  const cj = kin.joints.find((q) => q.type === "cam-contact" && (q.a === b.id || q.b === b.id) && q.cam);
  const r = cj ? S.joints.get(cj.id) : undefined;
  if (!cj || !r || !r.ca) return null;
  const drum = kin.bodies.find((q) => q.id === (cj.a === b.id ? cj.b : cj.a));
  const ds = (drum?.shape ?? {}) as Record<string, unknown>;
  const R = num(ds.radius, 16);
  const depth = num(((ds.groove ?? {}) as Record<string, unknown>).depth, 4);
  const rIn = R - depth;
  const L = camLawOf(cj, r.num, 0);
  if (!L) return null;
  const sh = g.shape;
  const len = num(sh.length, 18);
  const wid = num(sh.width, 6.8);
  const rootGap = num(sh.root, 0.8);
  const clear = num(sh.clear, 1);
  const bossR = num((sh.boss as Record<string, unknown> | undefined)?.radius, 5);
  const bossH = num((sh.boss as Record<string, unknown> | undefined)?.height, 5);
  // the world directions at the reference: inward to the drum's axis, the drum's axis, the groove's way round
  const ax = v3.unit(r.axis);
  const foot = v3.add(r.ca, v3.mul(ax, v3.dot(v3.sub(r.at, r.ca), ax)));
  const out = v3.unit(v3.sub(r.at, foot));
  const rp = v3.dist(r.at, foot);
  const tHat = v3.cross(ax, out);
  const v0 = camMotion(L.sched, L.theta0).v;
  const T0 = v3.unit(v3.sub(v3.mul(tHat, L.rb), v3.mul(ax, v0)));
  // the blade: an ellipse in the plane square to the radius, from inside the crescent's cut up into the boss
  const n = 48;
  const lens: Vec2[] = Array.from({ length: n }, (_, k) => {
    const t = (k / n) * TAU;
    return [(len / 2) * Math.cos(t), (wid / 2) * Math.sin(t)];
  });
  const r0 = rIn + rootGap - 1.5;
  const rTop = R + clear + 0.4;
  const blade = {
    id: `${b.id}-blade`,
    name: `Shoe blade ${len} x ${wid}, hardened bronze`,
    frame: { o: v3.add(foot, v3.mul(out, r0)), x: T0, z: out },
    profile: { outer: lens, holes: [] as Vec2[][] },
    h: rTop - r0,
    // the underside cut round the drum's axis (its centre r0 below the piece's origin), square to the blade's long axis
    features: [{ mode: "cut" as const, profile: { outer: circle(rIn + rootGap, 0, r0, 180), holes: [] }, op: { op: "extrude" as const, h: wid + 4, steps: 1 }, frame: { o: [0, -(wid / 2 + 2), 0] as Vec3, x: [1, 0, 0] as Vec3, z: [0, 1, 0] as Vec3 } }],
  };
  // the boss: the body's own part, on its pivot, from `clear` above the drum outward
  const pz = v3.dot(out, g.frame.z) >= 0 ? 1 : -1;
  const w0 = pz * (R + clear - rp);
  const offset = pz > 0 ? w0 : w0 - bossH;
  return {
    ...g,
    profile: { outer: circle(bossR, 0, 0, 48), holes: [] },
    thick: bossH,
    approx: false,
    exact: { offset },
    pieces: [...(g.pieces ?? []), blade],
  };
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
  const features: import("../../solids/types").Feature[] = [];
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
