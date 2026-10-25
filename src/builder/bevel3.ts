// A bevel gear's teeth in three dimensions (spiral bevel and hypoid included). The outline seen along the axis (Tredgold's
// teeth laid back onto the gear, src/core/spatial.ts bevelOutline) keeps only the radial part of each tooth: on a gear
// whose pitch cone is nearly flat (a crown or ring gear, δ near 90°) the teeth stand along the axis, and an extrusion of
// that outline shows a disc with a wavy rim that its mate's teeth sink into. Here every point of the virtual spur gear's
// tooth lies on the back cone, at (ρ - rv) cos δ off the pitch circle radially and (ρ - rv) sin δ along the axis; the
// outline at the outer end is scaled toward the apex over the face (and turned by the spiral angle along it), and closed
// by the back cone down to just below the roots, a chamfer up to a flat back face in the plane of the outer pitch circle,
// the inner back cone and a flat front face, and the bore. Straight teeth end at the plane of the inner pitch circle.
//
// Frame: the gear's axis is z, the outer pitch circle lies in z = 0, the apex at z = Re cos δ; `facing: -1` turns the
// apex toward -z. Triangles are counter-clockwise seen from outside; caps (the flat faces) are tagged as caps.
import { D2R, TAU } from "../core/geom";
import { ALPHA, bevel } from "../core/spatial";
import { TAG, type MeshData } from "../solids/types";

export interface Bevel3 {
  z: number;
  m: number;
  /** Pitch cone angle, degrees. */
  cone: number;
  /** Face width, mm (default Re / 3). */
  face?: number;
  /** Bore diameter, mm; 0 or absent: solid to the axis (a spiral gear's bore is its stack's). */
  bore?: number;
  /** Turn of the teeth from the outer to the inner end, radians (a spiral bevel's or a hypoid's), signed. */
  turn?: number;
  /** -1: the apex toward -z. */
  facing?: 1 | -1;
  /** Where the outer pitch circle lies along z, mm (default 0). */
  back?: number;
  /**
   * The pair's depth module, mm (default this gear's module): a hypoid's pinion and ring have different modules but
   * one working depth, the smaller module's.
   */
  depth?: number;
}

/**
 * The tooth proportions of a bevel gear in a pair at right angles, in modules (the Gleason long-and-short addendum): the
 * working depth 2 is shared so the larger gear's addendum is 0.54 + 0.46 / R, R = cot²δ of the pinion's cone, and the
 * pinion takes the rest; the whole depth is 2.188. The pinion's long addendum keeps a small one's teeth from being
 * undercut, and the large gear's teeth come out short and sturdy (a ring gear's). Equal gears (a miter pair) keep the
 * standard 1 and 1.25 (in the pair's depth module, `depth`, then expressed in this gear's). `shift` is the profile
 * shift that goes with it: the pinion's tooth thicker by as much as the
 * gear's is thinner, at the pitch line.
 */
export function bevelProportions(cone: number, m = 1, depth = m, spiral = false): { ha: number; hf: number; shift: number; thin: number } {
  const d = Math.min(cone, 90 - cone) * D2R;
  const R = Math.pow(1 / Math.tan(d), 2);
  const aG = 0.54 + 0.46 / R;
  // in this gear's modules, from the pair's depth module
  const k = depth / m;
  const ha = (cone >= 45 ? aG : 2 - aG) * k;
  // curved teeth (a spiral bevel's, a hypoid's) run with backlash: each tooth thinned at the pitch line, in modules
  const thin = spiral ? 0.15 : 0;
  return { ha, hf: 2.188 * k - ha, shift: ha - 1, thin };
}

/** The back-cone outline at the outer end: per point its radius, angle and offset along the back cone (ρ - rv). */
function outline(z: number, m: number, delta: number, P: { ha: number; hf: number; shift: number; thin: number }): { R: number; a: number; d: number }[] {
  const c = Math.cos(delta);
  const r = (z * m) / 2;
  const rv = r / c;
  const zv = z / c;
  const rb = rv * Math.cos(ALPHA);
  const inv = (x: number) => Math.tan(x) - x;
  const psi = (rho: number) => Math.max(0.004, Math.PI / (2 * zv) + (2 * P.shift * Math.tan(ALPHA) - P.thin / 2) / zv + inv(ALPHA) - inv(Math.acos(rb / Math.max(rho, rb))));
  const ra = rv + P.ha * m;
  const rf = rv - P.hf * m;
  const at = (rho: number, a: number, side: number) => {
    const R = r + (rho - rv) * c;
    return { R, a: a + (side * psi(rho) * rho) / R, d: rho - rv };
  };
  // four points up each flank and two across the root: enough for a drawn tooth, and the package stays small
  const N = 3;
  const pts: { R: number; a: number; d: number }[] = [];
  for (let k = 0; k < z; k++) {
    const a = (k * TAU) / z;
    for (let i = 0; i <= N; i++) pts.push(at(rf + ((ra - rf) * i) / N, a, -1));
    for (let i = N; i >= 0; i--) pts.push(at(rf + ((ra - rf) * i) / N, a, 1));
    const Rf = r - P.hf * m * c;
    const a0 = pts[pts.length - 1]!.a;
    const a1 = a + TAU / z - (psi(rf) * rf) / Rf;
    for (let i = 1; i < 3; i++) pts.push({ R: Rf, a: a0 + ((((a1 - a0 + 3 * Math.PI) % TAU) - Math.PI) * i) / 3, d: rf - rv });
  }
  return pts;
}

/** The toothed solid of a bevel gear as a closed mesh. */
export function bevelTeeth3(g: Bevel3): MeshData {
  const delta = g.cone * D2R;
  const bv = bevel(g.z, g.m, delta, g.face);
  const s = Math.sin(delta);
  const c = Math.cos(delta);
  const H = bv.apex;
  const r = (g.z * g.m) / 2;
  const P = bevelProportions(g.cone, g.m, g.depth ?? g.m, !!g.turn);
  const L = outline(g.z, g.m, delta, P);
  const n = L.length;
  // the ring the tooth outline closes onto at each end: on the back cone just below the root, so the back face stands
  // as little behind the outer pitch circle as the teeth allow (the stack behind the gear was laid out to that circle)
  const dk = -(P.hf + 0.05) * g.m;
  const Rk = r + dk * c;
  const Zk = dk * s;
  const turn = g.turn ?? 0;
  const sections = turn ? Math.max(6, Math.ceil(Math.abs(turn) / (4 * D2R))) : 1;
  const pos: number[] = [];
  const tri: number[] = [];
  const tag: number[] = [];
  const vert = (R: number, a: number, Z: number) => {
    pos.push(R * Math.cos(a), R * Math.sin(a), Z);
    return pos.length / 3 - 1;
  };
  // a point at the outer end scaled toward the apex by k and turned by the spiral at that section
  const scaled = (R: number, a: number, Z: number, k: number, t: number) => vert(R * k, a + t * turn, H + k * (Z - H));
  const kIn = bv.inner;
  // straight teeth end at the plane of the inner pitch circle where they would stand past it (the tips: the stack in
  // front of the gear was laid out to that plane); below it, on the inner back cone
  const endAt = (Z: number) => (turn ? kIn : Math.min(1, Math.max(kIn, H - Z > 0 ? (kIn * H) / (H - Z) : kIn)));
  const ring: number[][] = [];
  for (let i = 0; i <= sections; i++) {
    const t = i / sections;
    const k = 1 - t * (1 - kIn);
    ring.push(L.map((p) => scaled(p.R, p.a, p.d * s, i === sections ? endAt(p.d * s) : k, t)));
  }
  const backK = L.map((p) => scaled(Rk, p.a, Zk, 1, 0));
  const frontK = L.map((p) => scaled(Rk, p.a, Zk, kIn, 1));
  const rb = (g.bore ?? 0) / 2;
  // the back: a 30-degree chamfer from that ring up to the plane of the outer pitch circle, then flat to the bore (the
  // hardware behind the gear was laid out to that plane); on a nearly flat gear (a crown or ring gear) the face toward
  // the apex stands barely over that plane, so the back drops behind it by a web's thickness, never in front of it
  const zFront = H + kIn * (Zk - H);
  const web = Math.max(2, 0.8 * g.m);
  const zBack = Math.min(0, zFront - web);
  const R2 = Math.max(rb + 0.5, Rk - 1.7 * Math.max(0, zBack - Zk));
  const backK2 = L.map((p) => vert(R2, p.a, zBack));
  const quad = (a: number, b: number, c2: number, d: number, t: number) => {
    tri.push(a, b, c2, a, c2, d);
    tag.push(t, t);
  };
  // the toothed band, ring by ring
  for (let i = 0; i < sections; i++)
    for (let j = 0; j < n; j++) {
      const j2 = (j + 1) % n;
      quad(ring[i]![j]!, ring[i]![j2]!, ring[i + 1]![j2]!, ring[i + 1]![j]!, TAG.wall);
    }
  // the back cone and the inner back cone, from the outline down to the rings below the root
  const last = ring[sections]!;
  for (let j = 0; j < n; j++) {
    const j2 = (j + 1) % n;
    quad(ring[0]![j2]!, ring[0]![j]!, backK[j]!, backK[j2]!, TAG.wall);
    quad(backK[j2]!, backK[j]!, backK2[j]!, backK2[j2]!, TAG.wall);
    quad(last[j]!, last[j2]!, frontK[j2]!, frontK[j]!, TAG.wall);
  }
  // the flat faces and the bore
  if (rb > 0) {
    const bBack = L.map((p) => vert(rb, p.a, zBack));
    const bFront = L.map((p) => vert(rb, p.a + turn, zFront));
    for (let j = 0; j < n; j++) {
      const j2 = (j + 1) % n;
      quad(backK2[j2]!, backK2[j]!, bBack[j]!, bBack[j2]!, TAG.cap);
      quad(frontK[j]!, frontK[j2]!, bFront[j2]!, bFront[j]!, TAG.cap);
      quad(bBack[j]!, bFront[j]!, bFront[j2]!, bBack[j2]!, TAG.hole);
    }
  } else {
    const cb = vert(0, 0, zBack);
    const cf = vert(0, 0, zFront);
    for (let j = 0; j < n; j++) {
      const j2 = (j + 1) % n;
      tri.push(backK2[j2]!, backK2[j]!, cb, frontK[j]!, frontK[j2]!, cf);
      tag.push(TAG.cap, TAG.cap);
    }
  }
  // the apex toward -z: mirrored along z, then moved to its back face; the winding is set last so the outside is out
  const flip = g.facing === -1;
  const back = g.back ?? 0;
  for (let k = 2; k < pos.length; k += 3) pos[k] = (flip ? -pos[k]! : pos[k]!) + back;
  if (orientation(pos, tri) < 0) for (let k = 0; k < tri.length; k += 3) [tri[k + 1], tri[k + 2]] = [tri[k + 2]!, tri[k + 1]!];
  return { pos: Float32Array.from(pos), tri: Uint32Array.from(tri), tag: Uint8Array.from(tag) };
}

/** Six times the signed volume of a closed mesh: positive when its triangles wind counter-clockwise seen from outside. */
function orientation(pos: number[], tri: number[]): number {
  let v = 0;
  for (let k = 0; k < tri.length; k += 3) {
    const a = tri[k]! * 3, b = tri[k + 1]! * 3, c = tri[k + 2]! * 3;
    v += pos[a]! * (pos[b + 1]! * pos[c + 2]! - pos[b + 2]! * pos[c + 1]!) - pos[a + 1]! * (pos[b]! * pos[c + 2]! - pos[b + 2]! * pos[c]!) + pos[a + 2]! * (pos[b]! * pos[c + 1]! - pos[b + 1]! * pos[c]!);
  }
  return v;
}
