// Gears in mesh: a body's further levels (a compound gear's cluster, a gear on a link, a flywheel disc) and which level a
// mesh reaches, one working depth for bevel gears in mesh, a bevel gear seated on its pitch cone, and every mesh phased
// so a tooth meets a gap.
import { D2R, circle, gearOutline, rackOutline, type Vec2 } from "../../core/geom";
import { bevel } from "../../core/spatial";
import type { Kin, KinJoint } from "../../kin/types";
import type { Setup } from "../../kin/compose";
import { type Vec3, v3 } from "../../kin/math";
import type { MeshData } from "../../solids/types";
import { bevelTeeth3 } from "../bevel3";
import { fromPlane, planeCoords } from "../frames";
import type { BodyGeom, Level } from "../shapes";
import { num, rot } from "./common";
import { spiralTurn } from "./gears";

/** Bevel gears in mesh share one working depth, the smaller module's (a hypoid's pinion and ring differ in module). */
export function matchBevelDepth(kin: Kin, geoms: Map<string, BodyGeom>): void {
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
export function seatBevels(kin: Kin, S: Setup, geoms: Map<string, BodyGeom>): void {
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
 * A body's further levels (Level): a compound gear's `cluster` ([{ z, module, face, bore }]) over its part, a link's
 * `gear` ({ z, module, face, at: the joint it is centred on }) over its part, a gear's `disc` ({ radius, thickness }, a
 * flywheel) under it.
 */
export function clusterLevels(shape: Record<string, unknown>, pins: { joint: string; uv: Vec2 }[]): Level[] {
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

/** Angle wrapped into [-h, h) for a period 2h. */
const wrapTo = (a: number, h: number): number => a - 2 * h * Math.floor((a + h) / (2 * h));

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
export function phaseMeshes(kin: Kin, S: Setup, geoms: Map<string, BodyGeom>): void {
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
