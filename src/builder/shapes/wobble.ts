// A wobble drive's two own parts: the inclined journal of the wobble hub (turned at the journal angle on a collar that
// runs back into the hub's straight shank, the input body's part keyed on the shaft) and the trunnion ring that turns on
// it (a housing bored for the journal's bearings, with two trunnion pins square to the journal on bosses). Both stand
// where the joints put them, centred on the common centre of the four axes; the yoke the trunnions sit in is the
// universal joint's (./spatial).
import { circle } from "../../core/geom";
import type { Kin, KinBody } from "../../kin/types";
import type { Setup } from "../../kin/compose";
import { type Vec3, v3 } from "../../kin/math";
import type { Feature } from "../../solids/types";
import type { BodyGeom } from "../shapes";
import { num, pair } from "./common";

/** A cylindrical cut along a world line through a part whose own frame is (o, x, z): a bore for a shaft passing obliquely. */
function boreCut(o: Vec3, x: Vec3, z: Vec3, through: Vec3, dir: Vec3, r: number, len: number): Feature {
  const y = v3.cross(z, x);
  const loc = (q: Vec3): Vec3 => [v3.dot(q, x), v3.dot(q, y), v3.dot(q, z)];
  const d = v3.unit(loc(dir));
  const start = v3.sub(loc(v3.sub(through, o)), v3.mul(d, len / 2));
  const fx = v3.unit(v3.perp(Math.abs(d[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0], d));
  return { mode: "cut", profile: { outer: circle(r, 0, 0, 32), holes: [] }, op: { op: "extrude", h: len, steps: 1 }, frame: { o: start, x: fx, z: d } };
}

/**
 * `wobble-journal` (diameter, collar, neck, seat [s0, s1]: where the bearings sit along the journal from the centre;
 * bore and shaft: the input shaft's diameter and ground joint): the journal from the seat's start to past its end (room
 * for the circlip that holds the bearings), and below the seat the collar the inner races stand on, `neck` long, running
 * back into the hub's shank; both bored along the input shaft, which runs on through to its far pillow block.
 * `wobble-ring` (outer, width, bore, trunnion, pad): the housing round the journal's bearings, its trunnions out to the
 * yoke's cup radius along the trunnion joint's axis, each on a boss pad.
 */
export function wobble(kin: Kin, S: Setup, b: KinBody, g: BodyGeom): BodyGeom | null {
  const sh = g.shape;
  const type = String(sh.type);
  if (type !== "wobble-journal" && type !== "wobble-ring") return null;
  const F = g.frame;
  const o = F.o;
  if (type === "wobble-journal") {
    const rj = num(sh.diameter, 20) / 2;
    const rc = num(sh.collar, 25) / 2;
    const [s0, s1] = pair(sh.seat, [-7, 7]);
    // the collar the inner races stand on runs back along the journal's axis into the hub's straight shank (`neck`)
    const collar = num(sh.neck, 10);
    const end = s1 + 1.5;
    const po = v3.add(o, v3.mul(F.z, s0));
    const co = v3.add(o, v3.mul(F.z, s0 - collar));
    // the input shaft runs through the hub obliquely: a bore along its axis through journal and collar (`bore`, `shaft`)
    const shaftJ = typeof sh.shaft === "string" ? S.joints.get(sh.shaft) : undefined;
    const rb = num(sh.bore, 0) / 2;
    const len = 4 * (end - s0 + collar + rc);
    const cut = (at: Vec3) => (shaftJ && rb > 0 ? [boreCut(at, F.x, F.z, o, shaftJ.axis, rb + 0.05, len)] : []);
    return {
      ...g,
      profile: { outer: circle(rj, 0, 0, 40), holes: [] },
      thick: end - s0,
      approx: false,
      exact: { offset: s0 },
      features: cut(po),
      pieces: [{ id: `${b.id}-collar`, name: "", frame: { o: co, x: F.x, z: F.z }, profile: { outer: circle(rc, 0, 0, 40), holes: [] }, h: collar, features: cut(co) }],
    };
  }
  const ro = num(sh.outer, 40) / 2;
  const w = num(sh.width, 18);
  const bore = num(sh.bore, 32) / 2 + 0.05;
  const rt = num(sh.trunnion, 10) / 2;
  const rp = num(sh.pad, 16) / 2;
  // the trunnion axis and the yoke's cup radius, from the trunnion joint and the yoke's shape
  const tj = kin.joints.find((j) => (j.a === b.id || j.b === b.id) && j.type === "revolute" && [j.a, j.b].some((x) => (kin.bodies.find((q) => q.id === x)?.shape as Record<string, unknown> | undefined)?.yoke));
  const yokeId = tj ? (tj.a === b.id ? tj.b : tj.a) : undefined;
  const yk = ((kin.bodies.find((q) => q.id === yokeId)?.shape as Record<string, unknown> | undefined)?.yoke ?? {}) as Record<string, unknown>;
  const reach = num(yk.radius, ro + 10);
  const t = v3.unit(tj ? S.joints.get(tj.id)!.axis : F.x);
  const root = bore + 1;
  const pads = ([1, -1] as const).flatMap((k) => {
    const d = v3.mul(t, k);
    return [
      { id: `${b.id}-pad${k > 0 ? 0 : 1}`, name: "", frame: { o: v3.add(o, v3.mul(d, root)), x: F.z, z: d }, profile: { outer: circle(rp, 0, 0, 36), holes: [] }, h: ro + 1.5 - root },
      { id: `${b.id}-pin${k > 0 ? 0 : 1}`, name: "", frame: { o: v3.add(o, v3.mul(d, ro + 1.5)), x: F.z, z: d }, profile: { outer: circle(rt, 0, 0, 28), holes: [] }, h: reach - ro - 1.5 },
    ];
  });
  return {
    ...g,
    profile: { outer: circle(ro, 0, 0, 48), holes: [circle(bore, 0, 0, 40).reverse()] },
    thick: w,
    approx: false,
    exact: { offset: -w / 2 },
    pieces: pads,
  };
}
