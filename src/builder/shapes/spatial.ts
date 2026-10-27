// Spatial joints and linkages: a universal joint's yokes and cross, a Bennett link between skew hinges, and the parts
// of a ball-and-groove constant-velocity joint (balls, inner race, bell, cage).
import { D2R, circle, roundRect, roundedPoly, type Vec2 } from "../../core/geom";
import type { Kin, KinBody } from "../../kin/types";
import type { Setup } from "../../kin/compose";
import { type Vec3, v3 } from "../../kin/math";
import type { Feature, Profile } from "../../solids/types";
import { canon } from "../frames";
import type { BodyGeom } from "../shapes";
import { type OutlineFn, num, pair } from "./common";

const knuckle: OutlineFn = (shape) => {
  // a link between skew hinges (Bennett): its knuckle on its own hinge; the bar and the far knuckle come after
  const span = pair(shape.span, [-5, 5]);
  return { profile: { outer: circle(num(shape.knuckle, 9), 0, 0, 40), holes: [] }, thick: span[1] - span[0], approx: false };
};

/**
 * A universal joint's yoke (a `shaft` shape with a `yoke`) or cross (a `cross` shape), from the joints at the cross
 * centre. The yoke is a hub keyed on its live shaft (the shaft is the stack's, J10), a bar across the shaft and two
 * arms reaching to the cross's pin ends, each bored for a needle cup; the cross is two trunnions on a centre block.
 * Both stand where the joints put them.
 */
export function universal(kin: Kin, S: Setup, b: KinBody, g: BodyGeom): BodyGeom | null {
  const sh = g.shape;
  const isYoke = String(sh.type) === "shaft" && typeof sh.yoke === "object" && sh.yoke !== null;
  const isCross = String(sh.type) === "cross";
  if (!isYoke && !isCross) return null;
  // the yoke's pins go into a cross, or into a wobble drive's trunnion ring (./wobble)
  const crossOf = (j: { a: string; b: string }) => [j.a, j.b].find((x) => ["cross", "wobble-ring"].includes(String(kin.bodies.find((q) => q.id === x)?.shape?.type)));
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
 * A link between two skew hinges (`spatial-link`, a Bennett linkage): a knuckle on each hinge, side by side with its
 * neighbour's along the hinge (`span` on its own hinge, `far.span` on the other, both along the hinge's axis from the
 * joint, its sign fixed as `canon`), and a round bar between the knuckles (`barAt`: where it leaves each, along its
 * hinge; default the knuckles' middles). The far
 * knuckle is a lug of the far hinge's stack (rules/lugs); the bar is a piece of the body.
 */
export function spatialLink(S: Setup, g: BodyGeom): BodyGeom | null {
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
export function spherical(kin: Kin, S: Setup, b: KinBody, g: BodyGeom): BodyGeom | null {
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

export const SPATIAL_OUTLINES: Record<string, OutlineFn> = { "spatial-link": knuckle };
