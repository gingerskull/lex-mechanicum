// A plate cam for a swinging roller follower (`cam` with `form: "rocker"`, solved by the cam-rocker block): its pitch
// curve is the roller centre's path seen from the turning cam, the meeting of the pitch radius rb + s(θ) and the arc the
// rocker's arm sweeps; the outline is that curve offset inward by the roller radius, bored for its shaft.
import { circle, type Vec2 } from "../../core/geom";
import { camMotion, scheduleOf } from "../../kin/blocks/cam";
import { type Vec3, v3, xf } from "../../kin/math";
import { swingRoller, swingSide } from "../../kin/steps/camrocker";
import { lawOf } from "../../kin/steps/shared";
import { THICK } from "../constants";
import { planeCoords } from "../frames";
import { type GeomFn, num, signedArea } from "./common";

const STEPS = 720;

/** A closed ring offset by `d` along its normals (positive outward for a counter-clockwise ring). */
export function offsetRing(ring: Vec2[], d: number): Vec2[] {
  const n = ring.length;
  return ring.map((p, i) => {
    const a = ring[(i + n - 1) % n]!;
    const b = ring[(i + 1) % n]!;
    const tx = b[0] - a[0];
    const ty = b[1] - a[1];
    const L = Math.hypot(tx, ty) || 1;
    return [p[0] + (ty / L) * d, p[1] - (tx / L) * d];
  });
}

/**
 * The pitch curve of a swinging roller follower in the cam's plane coordinates: for each turn of the cam the roller
 * centre where the cam-rocker block puts it, turned back by the cam's turn. Counter-clockwise.
 */
export function swingPitchCurve(o: { C: Vec3; axis: Vec3; G: Vec3; n: Vec3; P0: Vec3; rb: number; th0: number; s: (th: number) => number }, toPlane: (p: Vec3) => Vec2, steps = STEPS): Vec2[] {
  const arm = v3.dist(o.P0, o.G);
  const side = swingSide(o.C, o.G, o.P0, o.n);
  const out: Vec2[] = [];
  for (let k = 0; k < steps; k++) {
    const turn = (k / steps) * 2 * Math.PI;
    const P = swingRoller(o.C, o.G, arm, o.rb + o.s(o.th0 + turn), o.n, side);
    if (!P) throw new Error("swing cam: the rocker's arm cannot reach the pitch radius");
    out.push(toPlane(xf.apply(xf.rotAbout(o.C, o.axis, -turn), P)));
  }
  return signedArea(out) < 0 ? out.reverse() : out;
}

export const swingCam: GeomFn = (kin, S, b, g) => {
  if (String(g.shape.type) !== "cam" || g.shape.form !== "rocker") return null;
  const j = kin.joints.find((q) => q.type === "cam-contact" && (q.a === b.id || q.b === b.id) && q.cam);
  const step = j ? kin.solve.find((s) => s.block === "cam-rocker" && s.in?.joint === j.id) : undefined;
  const r = j ? S.joints.get(j.id) : undefined;
  const pv = step?.in?.pivot;
  const pivot = typeof pv === "string" ? S.joints.get(pv) : undefined;
  if (!j || !j.cam || !r || !r.ca || !pivot) return null;
  const sched = scheduleOf(j.cam, r.num, lawOf);
  const pitch = swingPitchCurve(
    { C: r.ca, axis: r.axis, G: pivot.at, n: pivot.axis, P0: r.at, rb: r.num(j.cam.rb), th0: (r.num(j.cam.theta0 ?? 0) * Math.PI) / 180, s: (th) => camMotion(sched, th).s },
    (p) => planeCoords(g.frame, p).uv,
  );
  const rr = num(g.shape.rollerRadius, 0);
  const outer = rr > 0 ? offsetRing(pitch, -rr) : pitch;
  const bore = num(g.shape.bore, 8);
  return { ...g, profile: { outer, holes: [circle(bore / 2, 0, 0, 28).reverse()] }, thick: num(g.shape.thick, num(g.shape.thickness, THICK)), approx: false };
};
