// Everything drawn on the 2D canvas around the GPU's solids (style paint order, steps 2 and 6 to 11): the base plate's
// loose touches, centrelines along the joint axes, dimensions, traces with their comet, equal-time ticks and ghost paths,
// phantom positions, construction overlays, explode trail lines, highlights, and the force, velocity and angle overlays.
// Every function projects 3D points through the frame's camera and draws by the drafting conventions (SP5): nothing here
// changes the drawing beneath. Teaching content is drawn at every dial position (DL6).
import type { Teaching } from "../../catalog/kin";
import { hasFlag3 } from "../../package/format2";
import { EF, EDGE, EFLAG } from "../../solids/edges";
import { mat4 } from "../../solids/frame";
import type { Vec3 } from "../../solids/types";
import { xf } from "../../kin/math";
const xfApply = xf.apply;
const xfInv = xf.inv;
import { DRAFT } from "../../style/draft";
import { FORM } from "../../style/form";
import { font, rgba as paint, type ResolvedTheme } from "../../style/theme";
import type { Ladder } from "../detail";
import { angleToEye, project, scaleOf, type Camera } from "./camera";
import { arrowHead, drawCallouts, drawMarkers, drawRails, labeler, type LabelMode, type LabelPlan, type LabelSpot, type Labeler } from "./labels";
import type { Controls } from "./poser";
import { applyMat, mulMat, type Runtime } from "./scene";

const TAU = Math.PI * 2;
const O = DRAFT.overlays;
const sub = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const add = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const mul = (a: Vec3, k: number): Vec3 => [a[0] * k, a[1] * k, a[2] * k];
const dot = (a: Vec3, b: Vec3): number => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: Vec3, b: Vec3): Vec3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const len = (a: Vec3): number => Math.hypot(a[0], a[1], a[2]);
const unit = (a: Vec3): Vec3 => mul(a, 1 / (len(a) || 1));

/** What the annotation layers need of a frame. */
export interface Ann {
  ctx: CanvasRenderingContext2D;
  /** Canvas size, CSS px. */
  w: number;
  h: number;
  C: Camera;
  T: ResolvedTheme;
  rt: Runtime;
  /** The solids' world matrices of this frame (16 floats each, explode applied). */
  mats: Float32Array;
  u: number;
  explode: number;
  LD: Ladder;
  cache: AnnCache;
}

/** Sampled paths, kept by the session: a path depends on the point and the control settings only. */
export interface AnnCache {
  paths: Map<string, Float32Array>;
  extremes: Map<string, number[]>;
}

export const newCache = (): AnnCache => ({ paths: new Map(), extremes: new Map() });

/** Samples of one cycle in a sampled path. */
const SAMPLES = 240;

const P = (A: Ann, p: Vec3): [number, number] => project(A.C, p);

/** The 3D path of a named point over one cycle at the given controls (cached), 3 floats per sample; null if the point is unknown. */
export function pathOf(A: Ann, point: string, ctl?: Controls): Float32Array | null {
  const key = `${point}|${ctl ? JSON.stringify(ctl) : ""}`;
  const hit = A.cache.paths.get(key);
  if (hit) return hit.length ? hit : null;
  const poser = A.rt.scene.poser;
  const out = new Float32Array(SAMPLES * 3);
  let ok = true;
  for (let k = 0; k < SAMPLES; k++) {
    const p = poser.point((k / SAMPLES) * poser.period, point, ctl);
    if (!p) {
      ok = false;
      break;
    }
    out.set(p, k * 3);
  }
  A.cache.paths.set(key, ok ? out : new Float32Array(0));
  return ok ? out : null;
}

/** Controls that set one of the record's controls to a value (for a ghost trace, SD23). */
export function controlFor(t: Teaching | null, id: string, value: unknown): Controls {
  const c = t?.controls.find((x) => x.id === id) as ({ id: string; kind: string; [k: string]: unknown }) | undefined;
  const key = (k: string) => (typeof c?.[k] === "string" ? (c[k] as string) : id);
  const num = typeof value === "number" ? value : Number(value);
  switch (c?.kind) {
    case "param": return { params: { [key("param")]: num } };
    case "design": return { design: { [key("design")]: String(value) } };
    case "selector": return { select: { [key("selector")]: String(value) } };
    case "driver": return { drivers: { [key("driver")]: num } };
    // a ghost of a design choice the page does not offer as a control (one that would change the built parts): the
    // choice by its id, so its path is still drawn
    default: return typeof value === "string" && !Number.isFinite(num) ? { design: { [id]: value } } : { drivers: { [key("driver")]: num } };
  }
}

/** The inverse of a rigid 4 x 4 (column-major): [Rᵀ | −Rᵀt]. */
const invRigid = (m: ArrayLike<number>): number[] => {
  const t: Vec3 = [m[12]!, m[13]!, m[14]!];
  const r = (i: number, j: number) => m[j * 4 + i]!;
  const o = [r(0, 0), r(0, 1), r(0, 2), 0, r(1, 0), r(1, 1), r(1, 2), 0, r(2, 0), r(2, 1), r(2, 2), 0, 0, 0, 0, 1];
  o[12] = -(o[0]! * t[0] + o[4]! * t[1] + o[8]! * t[2]);
  o[13] = -(o[1]! * t[0] + o[5]! * t[1] + o[9]! * t[2]);
  o[14] = -(o[2]! * t[0] + o[6]! * t[1] + o[10]! * t[2]);
  return o;
};

/**
 * The path of a named point over one cycle as the body `frame` sees it, drawn where that body is at phase u (a cam's
 * pitch curve turns with the cam): each sample is carried back by the body's pose at its own phase, then forward by the
 * pose at u. Null without the body's poses.
 */
export function framedPath(A: Ann, point: string, frame: string): Float32Array | null {
  const poser = A.rt.scene.poser;
  if (!poser.body) return null;
  const key = `${point}@${frame}`;
  let local = A.cache.paths.get(key);
  if (!local) {
    local = new Float32Array(SAMPLES * 3);
    for (let k = 0; k < SAMPLES; k++) {
      const u = (k / SAMPLES) * poser.period;
      const p = poser.point(u, point);
      const M = poser.body(u, frame);
      if (!p || !M) {
        local = new Float32Array(0);
        break;
      }
      local.set(applyMat(invRigid(M), p), k * 3);
    }
    A.cache.paths.set(key, local);
  }
  const Mu = poser.body(A.u, frame);
  if (!local.length || !Mu) return null;
  const out = new Float32Array(local.length);
  for (let k = 0; k < local.length; k += 3) out.set(applyMat(Mu, [local[k]!, local[k + 1]!, local[k + 2]!]), k);
  return out;
}

/** The path's sample nearest a fraction of the cycle. */
const sampleAt = (path: Float32Array, f: number): Vec3 | null => {
  const n = path.length / 3;
  if (!n) return null;
  const k = Math.round(f * n) % n;
  return [path[k * 3]!, path[k * 3 + 1]!, path[k * 3 + 2]!];
};

/** A projected path whose last sample is far from its first (more than four times its mean step): it does not close. */
const isOpen = (pts: [number, number][]): boolean => {
  const n = pts.length;
  if (n < 3) return true;
  let sum = 0;
  for (let k = 1; k < n; k++) sum += Math.hypot(pts[k]![0] - pts[k - 1]![0], pts[k]![1] - pts[k - 1]![1]);
  return Math.hypot(pts[0]![0] - pts[n - 1]![0], pts[0]![1] - pts[n - 1]![1]) > (4 * sum) / (n - 1) + 1;
};

const pathPts = (A: Ann, path: Float32Array): [number, number][] => {
  const out: [number, number][] = [];
  for (let k = 0; k < path.length; k += 3) out.push(P(A, [path[k]!, path[k + 1]!, path[k + 2]!]));
  return out;
};

const stroke = (ctx: CanvasRenderingContext2D, pts: [number, number][], close: boolean) => {
  if (pts.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(pts[0]![0], pts[0]![1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i]![0], pts[i]![1]);
  if (close) ctx.closePath();
  ctx.stroke();
};

// ---------------------------------------------------------------------------------------------- base plate, step 2

/** Construction lines along the base plate's straight edges and a second pencil pass round it (SD9), under everything. */
export function baseSketch(A: Ann): void {
  const { ctx, rt, mats, T } = A;
  const SK = DRAFT.sketch;
  const base = rt.scene.pkg.solids.findIndex((_s, i) => rt.isBase[i]);
  if (base < 0) return;
  const s = rt.scene.pkg.solids[base]!;
  const e = rt.scene.edges[s.shape]!;
  const M = mats.subarray(base * 16, base * 16 + 16);
  const segs: [Vec3, Vec3][] = [];
  for (let k = 0; k < e.n; k++) {
    const o = k * EF;
    if (e.data[o + 14] !== EDGE.cap || !(e.data[o + 15]! & EFLAG.top) || e.data[o + 15]! & EFLAG.hole) continue;
    const a = applyMat(M, [e.data[o]!, e.data[o + 1]!, e.data[o + 2]!]);
    const b = applyMat(M, [e.data[o + 3]!, e.data[o + 4]!, e.data[o + 5]!]);
    segs.push([a, b]);
  }
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineWidth = SK.width;
  ctx.strokeStyle = paint(T.ink, SK.alpha);
  const over = SK.overshoot / A.C.s;
  ctx.beginPath();
  // the long straight runs, drawn past their ends (the rounded corners' arcs are short segments and are skipped)
  for (const [a, b] of segs) {
    const L = len(sub(b, a));
    if (L < 20) continue;
    const d = unit(sub(b, a));
    const p2 = P(A, sub(a, mul(d, over)));
    const q2 = P(A, add(b, mul(d, over)));
    ctx.moveTo(p2[0], p2[1]);
    ctx.lineTo(q2[0], q2[1]);
  }
  ctx.stroke();
  ctx.restore();
}

/** The second, offset pencil pass round the base outline (drawn over the paper, with the other loose touch). */
export function basePencil(A: Ann): void {
  const { ctx, rt, mats, T } = A;
  const SK = DRAFT.sketch;
  if (SK.doubleAlpha <= 0) return;
  const base = rt.scene.pkg.solids.findIndex((_s, i) => rt.isBase[i]);
  if (base < 0) return;
  const s = rt.scene.pkg.solids[base]!;
  const e = rt.scene.edges[s.shape]!;
  const M = mats.subarray(base * 16, base * 16 + 16);
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineWidth = SK.width;
  ctx.strokeStyle = paint(T.ink, SK.doubleAlpha);
  ctx.beginPath();
  const dx = SK.doubleOffset;
  const dy = SK.doubleOffset * SK.doubleOffsetY;
  for (let k = 0; k < e.n; k++) {
    const o = k * EF;
    if (e.data[o + 14] !== EDGE.cap || !(e.data[o + 15]! & EFLAG.top) || e.data[o + 15]! & EFLAG.hole) continue;
    const p = P(A, applyMat(M, [e.data[o]!, e.data[o + 1]!, e.data[o + 2]!]));
    const q = P(A, applyMat(M, [e.data[o + 3]!, e.data[o + 4]!, e.data[o + 5]!]));
    ctx.moveTo(p[0] + dx, p[1] + dy);
    ctx.lineTo(q[0] + dx, q[1] + dy);
  }
  ctx.stroke();
  ctx.restore();
}

// ---------------------------------------------------------------------------------------------- centrelines, step 6

/** The solids whose axes carry a centreline: the first head-top solid of each joint, with the joint's solids' extent. */
export function centreSolids(rt: Runtime): { solid: number; group: number[] }[] {
  const cache = rt as Runtime & { _centres?: { solid: number; group: number[] }[] };
  if (cache._centres) return cache._centres;
  const solids = rt.scene.pkg.solids;
  const byJoint = new Map<string, number[]>();
  solids.forEach((s, i) => {
    for (const j of s.joints ?? []) (byJoint.get(j) ?? byJoint.set(j, []).get(j)!).push(i);
  });
  const done = new Set<string>();
  const out: { solid: number; group: number[] }[] = [];
  solids.forEach((s, i) => {
    if (!hasFlag3(s, "headTop")) return;
    const joint = (s.joints ?? [])[0] ?? s.id;
    if (done.has(joint)) return;
    done.add(joint);
    out.push({ solid: i, group: byJoint.get(joint) ?? [i] });
  });
  cache._centres = out;
  return out;
}

/** Chain centrelines (long dash, short dash) along each joint axis; a centre cross where the axis is seen end-on (SD6). */
export function centrelines(A: Ann): void {
  const { ctx, rt, mats, C, T } = A;
  const D = DRAFT.centre;
  if (C.s < D.minScale) return;
  ctx.save();
  ctx.setLineDash([...D.dash]);
  ctx.lineWidth = D.width;
  ctx.strokeStyle = paint(T.ink, D.alpha);
  ctx.lineCap = "butt";
  ctx.beginPath();
  for (const { solid, group } of centreSolids(rt)) {
    if (!A.LD.solid(rt.scene.pkg.solids[solid]!.detail)) continue;
    const b = rt.box;
    const o = solid * 6;
    const M = mats.subarray(solid * 16, solid * 16 + 16);
    const c0: Vec3 = [(b[o]! + b[o + 3]!) / 2, (b[o + 1]! + b[o + 4]!) / 2, (b[o + 2]! + b[o + 5]!) / 2];
    const centre = applyMat(M, c0);
    const axis = unit([M[8]!, M[9]!, M[10]!]);
    // the joint's extent along its axis, from its solids' world boxes
    let lo = Infinity;
    let hi = -Infinity;
    for (const g of group) {
      const gb = rt.box;
      const go = g * 6;
      for (const x of [gb[go]!, gb[go + 3]!])
        for (const y of [gb[go + 1]!, gb[go + 4]!])
          for (const z of [gb[go + 2]!, gb[go + 5]!]) {
            const t = dot(sub(applyMat(mats, [x, y, z], g * 16), centre), axis);
            if (t < lo) lo = t;
            if (t > hi) hi = t;
          }
    }
    const over = D.overshoot / C.s;
    if (angleToEye(C, axis) < D.endOnDeg) {
      const [x, y] = P(A, centre);
      const r = D.cross;
      ctx.moveTo(x - r, y);
      ctx.lineTo(x + r, y);
      ctx.moveTo(x, y - r);
      ctx.lineTo(x, y + r);
    } else {
      const p = P(A, add(centre, mul(axis, lo - over)));
      const q = P(A, add(centre, mul(axis, hi + over)));
      ctx.moveTo(p[0], p[1]);
      ctx.lineTo(q[0], q[1]);
    }
  }
  ctx.stroke();
  ctx.restore();
}

// ---------------------------------------------------------------------------------------------- dimensions, step 7

const longest = (v: Vec3, axes: Vec3[]): number => axes.reduce((best, a, i) => (Math.abs(dot(v, a)) > Math.abs(dot(v, axes[best]!)) ? i : best), 0);

function arrow(ctx: CanvasRenderingContext2D, a: [number, number], b: [number, number], sz: number, ang: number) {
  arrowHead(ctx, a, b, sz, ang);
}

/** Overall base-plate width and depth in true mm (SD8), in a view where the base reads true (PLAN, FRONT, SIDE). */
export function dimensions(A: Ann): void {
  const { ctx, rt, mats, C, T } = A;
  const D = DRAFT.dims;
  const world: Vec3[] = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
  // axis-aligned view only: the screen's right and up are world axes
  const ri = longest(C.right, world);
  const ui = longest(C.up, world);
  if (Math.abs(dot(C.right, world[ri]!)) < 0.999 || Math.abs(dot(C.up, world[ui]!)) < 0.999 || ri === ui) return;
  const b = [Infinity, Infinity, Infinity, -Infinity, -Infinity, -Infinity];
  rt.scene.pkg.solids.forEach((_s, i) => {
    if (!rt.isBase[i]) return;
    for (const x of [rt.box[i * 6]!, rt.box[i * 6 + 3]!])
      for (const y of [rt.box[i * 6 + 1]!, rt.box[i * 6 + 4]!])
        for (const z of [rt.box[i * 6 + 2]!, rt.box[i * 6 + 5]!]) {
          const p = applyMat(mats, [x, y, z], i * 16);
          for (let k = 0; k < 3; k++) {
            if (p[k]! < b[k]!) b[k] = p[k]!;
            if (p[k]! > b[k + 3]!) b[k + 3] = p[k]!;
          }
        }
  });
  if (!Number.isFinite(b[0]!)) return;
  const sx = [P(A, [b[0]!, b[1]!, b[2]!]), P(A, [b[3]!, b[4]!, b[5]!])];
  const x0 = Math.min(sx[0]![0], sx[1]![0]), x1 = Math.max(sx[0]![0], sx[1]![0]);
  const y0 = Math.min(sx[0]![1], sx[1]![1]), y1 = Math.max(sx[0]![1], sx[1]![1]);
  const wmm = b[ri + 3]! - b[ri]!;
  const hmm = b[ui + 3]! - b[ui]!;
  const yb = y1 + D.offset;
  const xr = x1 + D.offset;
  ctx.save();
  ctx.strokeStyle = ctx.fillStyle = paint(T.ink, D.alpha);
  ctx.lineWidth = D.width;
  ctx.beginPath();
  ctx.moveTo(x0, y1 + D.gap); ctx.lineTo(x0, yb + D.ext);
  ctx.moveTo(x1, y1 + D.gap); ctx.lineTo(x1, yb + D.ext);
  ctx.moveTo(x0, yb); ctx.lineTo(x1, yb);
  ctx.stroke();
  arrow(ctx, [x1, yb], [x0, yb], D.arrow, D.arrowAngle);
  arrow(ctx, [x0, yb], [x1, yb], D.arrow, D.arrowAngle);
  const tall = y1 - y0 > D.minDepthPx;
  if (tall) {
    ctx.beginPath();
    ctx.moveTo(x1 + D.gap, y1); ctx.lineTo(xr + D.ext, y1);
    ctx.moveTo(x1 + D.gap, y0); ctx.lineTo(xr + D.ext, y0);
    ctx.moveTo(xr, y1); ctx.lineTo(xr, y0);
    ctx.stroke();
    arrow(ctx, [xr, y0], [xr, y1], D.arrow, D.arrowAngle);
    arrow(ctx, [xr, y1], [xr, y0], D.arrow, D.arrowAngle);
  }
  ctx.font = font(DRAFT.type.dims);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const lab = (t: string, x: number, y: number, rot: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    const w = ctx.measureText(t).width + D.labelPad;
    ctx.fillStyle = paint(T.paper, D.labelPaper);
    ctx.fillRect(-w / 2, -D.labelH / 2, w, D.labelH);
    ctx.fillStyle = paint(T.ink, Math.min(1, D.alpha + D.labelGain));
    ctx.fillText(t, 0, 0.5);
    ctx.restore();
  };
  lab(`${Math.round(wmm)}`, (x0 + x1) / 2, yb, 0);
  if (tall) lab(`${Math.round(hmm)}`, xr, (y0 + y1) / 2, -Math.PI / 2);
  ctx.restore();
}

// ---------------------------------------------------------------------------------------------- traces, step 9

export interface TraceFlags {
  traces: boolean;
  ghosts: boolean;
  ticks: boolean;
}

/** How thin a set of points is: the square root of the smaller spread over the larger, 0 for a line, 1 for a round cloud. */
function thinness2(pts: readonly (readonly [number, number])[]): number {
  let mx = 0, my = 0;
  for (const p of pts) { mx += p[0]; my += p[1]; }
  mx /= pts.length || 1; my /= pts.length || 1;
  let a = 0, b = 0, c = 0;
  for (const p of pts) { const x = p[0] - mx, y = p[1] - my; a += x * x; b += x * y; c += y * y; }
  const tr = a + c, det = a * c - b * b, d = Math.sqrt(Math.max(0, (tr * tr) / 4 - det));
  const l1 = tr / 2 + d, l2 = Math.max(0, tr / 2 - d);
  return l1 > 1e-9 ? Math.sqrt(l2 / l1) : 0;
}

/** The same in 3D, of a path's two widest spreads: 0 for a straight path, 1 for a round one. */
function thinness3(path: Float32Array): number {
  const n = path.length / 3;
  const m = [0, 0, 0];
  for (let i = 0; i < n; i++) for (let k = 0; k < 3; k++) m[k]! += path[i * 3 + k]! / n;
  const C = [0, 0, 0, 0, 0, 0]; // xx, xy, xz, yy, yz, zz
  for (let i = 0; i < n; i++) {
    const x = path[i * 3]! - m[0]!, y = path[i * 3 + 1]! - m[1]!, z = path[i * 3 + 2]! - m[2]!;
    C[0]! += x * x; C[1]! += x * y; C[2]! += x * z; C[3]! += y * y; C[4]! += y * z; C[5]! += z * z;
  }
  // the largest spread by power iteration, then the largest across it
  const mul = (v: number[]) => [C[0]! * v[0]! + C[1]! * v[1]! + C[2]! * v[2]!, C[1]! * v[0]! + C[3]! * v[1]! + C[4]! * v[2]!, C[2]! * v[0]! + C[4]! * v[1]! + C[5]! * v[2]!];
  let v = [1, 0.7, 0.3];
  for (let k = 0; k < 30; k++) {
    const w = mul(v);
    const l = Math.hypot(w[0]!, w[1]!, w[2]!) || 1;
    v = w.map((x) => x / l);
  }
  const l1 = v.reduce((s, x, k) => s + x * mul(v)[k]!, 0);
  const tr = C[0]! + C[3]! + C[5]!;
  // the rest of the spread lies across v; its larger part is at least half of it
  const rest = Math.max(0, tr - l1);
  return l1 > 1e-9 ? Math.sqrt(rest / l1) : 0;
}

/**
 * How much of a path to draw: a curved path seen edge-on collapses to a line that tells nothing and reads as a stray
 * stroke through the parts, so it fades out as its plane turns to the view (a path straight in 3D always shows).
 */
export function faceOn(screen: readonly (readonly [number, number])[], path: Float32Array): number {
  const r3 = thinness3(path);
  if (r3 < DRAFT.path.edgeOn.straight) return 1;
  const t = Math.min(1, thinness2(screen) / r3);
  const [a, b] = DRAFT.path.edgeOn.fade;
  const x = Math.max(0, Math.min(1, (t - a) / (b - a)));
  return x * x * (3 - 2 * x);
}

/** Ghost paths (SD23), then the teaching traces with ticks and the comet (SD7, SD24): fine accent lines at the trace's height. */
export function traces(A: Ann, f: TraceFlags): void {
  const t = A.rt.scene.teaching;
  if (!t || !t.traces.length) return;
  const { ctx, T, u } = A;
  const SP = DRAFT.path;
  const poser = A.rt.scene.poser;
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  if (f.ghosts) {
    ctx.setLineDash([...DRAFT.ghost.dash]);
    ctx.lineWidth = DRAFT.ghost.width;
    ctx.strokeStyle = paint(T[SP.color], SP.alpha * DRAFT.ghost.alpha);
    for (const tr of t.traces)
      for (const g of tr.ghosts ?? []) {
        const path = pathOf(A, tr.point, controlFor(t, g.control, g.value));
        if (!path) continue;
        const gp = pathPts(A, path);
        ctx.globalAlpha = faceOn(gp, path);
        if (ctx.globalAlpha > 0) stroke(ctx, gp, true);
        ctx.globalAlpha = 1;
      }
  }
  if (f.traces) {
    t.traces.forEach((tr, i) => {
      const path = tr.frame ? framedPath(A, tr.point, tr.frame) : pathOf(A, tr.point);
      if (!path) return;
      const pts = pathPts(A, path);
      ctx.setLineDash([...SP.dash]);
      ctx.lineWidth = SP.width;
      ctx.strokeStyle = paint(T[SP.color], SP.alpha * (i ? SP.otherGain : 1));
      // a path that does not close over a cycle (an indexing wheel's mark moves on a step each turn) is drawn open
      const open = isOpen(pts);
      // the path and its ticks fade as the path turns edge-on; the comet keeps showing the motion
      const shown = faceOn(pts, path);
      ctx.globalAlpha = shown;
      if (shown > 0) stroke(ctx, pts, !open);
      ctx.setLineDash([]);
      if (f.ticks && tr.ticks?.every) {
        // equal-time ticks (SD24): short strokes across the path in its accent; where they would crowd, every m-th is
        // drawn (still equal steps of time, so uneven spacing still reads as uneven speed), and a path too short to carry
        // them has none
        const K = DRAFT.tick;
        const n = Math.max(1, Math.floor(360 / tr.ticks.every));
        const at: [number, number][] = [];
        for (let k = 0; k < n; k++) {
          // in a body's frame, the tick is the path's sample at that phase (the path is already carried to now)
          const p = tr.frame ? sampleAt(path, k / n) : poser.point((k / n) * poser.period, tr.point);
          at.push(p ? P(A, p) : [NaN, NaN]);
        }
        let length = 0;
        for (let k = 1; k < pts.length; k++) length += Math.hypot(pts[k]![0] - pts[k - 1]![0], pts[k]![1] - pts[k - 1]![1]);
        const gaps = at.map((p, k) => Math.hypot(p[0] - at[(k + 1) % n]![0], p[1] - at[(k + 1) % n]![1])).filter(Number.isFinite).sort((a, b) => a - b);
        const median = gaps[gaps.length >> 1] ?? 0;
        const m = median > 0 ? Math.max(1, Math.ceil(K.minGap / median)) : 1;
        if (length >= K.minPath && shown > 0) {
          ctx.lineWidth = K.width;
          ctx.strokeStyle = paint(T[SP.color], K.alpha * (i ? SP.otherGain : 1));
          ctx.beginPath();
          for (let k = 0; k < n; k += m) {
            const [x, y] = at[k]!;
            if (!Number.isFinite(x)) continue;
            // across the path: square to the line through its neighbours on the path
            const a = at[(k - 1 + n) % n]!, b = at[(k + 1) % n]!;
            let dx = b[0] - a[0], dy = b[1] - a[1];
            const l = Math.hypot(dx, dy);
            if (!(l > 1e-6)) continue;
            dx /= l;
            dy /= l;
            ctx.moveTo(x - dy * K.half, y + dx * K.half);
            ctx.lineTo(x + dy * K.half, y - dx * K.half);
          }
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
      if (tr.comet) {
        const N = pts.length;
        const idx = Math.round(((((u % TAU) + TAU) % TAU) / TAU) * N);
        const L = Math.min(SP.cometSamples, N >> 1);
        for (let k = 0; k < L; k++) {
          if (open && idx - k - 1 < 0) break;
          const a = pts[(idx - k - 1 + 10 * N) % N]!;
          const b = pts[(idx - k + 10 * N) % N]!;
          ctx.beginPath();
          ctx.moveTo(a[0], a[1]);
          ctx.lineTo(b[0], b[1]);
          ctx.lineWidth = (SP.comet - SP.cometMin) * (1 - k / L) + SP.cometMin;
          ctx.strokeStyle = paint(T[SP.color], (1 - k / L) * SP.cometAlpha);
          ctx.stroke();
        }
        const cur = poser.point(u, tr.point) ?? null;
        const pt = cur ? P(A, cur) : pts[idx % N]!;
        ctx.beginPath();
        ctx.arc(pt[0], pt[1], SP.headR, 0, TAU);
        ctx.fillStyle = paint(T.paper);
        ctx.fill();
        ctx.lineWidth = SP.headStroke;
        ctx.strokeStyle = paint(T[SP.color]);
        ctx.stroke();
      }
    });
  }
  ctx.restore();
}

// ---------------------------------------------------------------------------------------------- phantoms (SD21)

/** The cycle phases at which a body's solids are at the two ends of their range (an oscillator's angle, a slider's travel). */
export function extremes(A: Ann, body: string): number[] {
  const hit = A.cache.extremes.get(body);
  if (hit) return hit;
  const { rt } = A;
  const poser = rt.scene.poser;
  const idx = rt.scene.pkg.solids.findIndex((s) => s.body === body);
  const out: number[] = [];
  if (idx >= 0) {
    const s = rt.scene.pkg.solids[idx]!;
    const N = 180;
    const ang: number[] = [];
    const org: Vec3[] = [];
    let prev = 0;
    for (let k = 0; k < N; k++) {
      const m = mulMat(poser.place(s, (k / N) * poser.period), mat4(s.fr));
      let a = Math.atan2(m[1]!, m[0]!);
      if (k) {
        while (a - prev > Math.PI) a -= TAU;
        while (a - prev < -Math.PI) a += TAU;
      }
      prev = a;
      ang.push(a);
      org.push([m[12]!, m[13]!, m[14]!]);
    }
    const lo = Math.min(...ang), hi = Math.max(...ang);
    let at: number[];
    if (hi - lo > 0.01 && hi - lo < TAU * 0.9) at = [ang.indexOf(lo), ang.indexOf(hi)];
    else {
      // travel: along the principal direction of the origin's motion
      const o0 = org[0]!;
      let far = 0;
      for (let k = 1; k < N; k++) if (len(sub(org[k]!, o0)) > len(sub(org[far]!, o0))) far = k;
      const d = unit(sub(org[far]!, o0));
      const t = org.map((p) => dot(p, d));
      at = len(sub(org[far]!, o0)) > 1e-6 ? [t.indexOf(Math.min(...t)), t.indexOf(Math.max(...t))] : [];
    }
    for (const k of at) out.push((k / N) * poser.period);
  }
  A.cache.extremes.set(body, out);
  return out;
}

/** A body's solids at an extreme position: thin dashed outlines in ink, no fill (SD21). */
export function phantoms(A: Ann, bodies: string[]): void {
  if (!bodies.length) return;
  const { ctx, rt, T } = A;
  const poser = rt.scene.poser;
  ctx.save();
  ctx.setLineDash([...DRAFT.phantom.dash]);
  ctx.lineWidth = DRAFT.phantom.width;
  ctx.strokeStyle = paint(T.ink, DRAFT.lines.hidden.alpha * DRAFT.phantom.alpha);
  ctx.lineCap = "round";
  for (const body of bodies) {
    const us = extremes(A, body);
    rt.scene.pkg.solids.forEach((s) => {
      if (s.body !== body || !A.LD.solid(s.detail)) return;
      const e = rt.scene.edges[s.shape]!;
      for (const u of us) {
        const M = mulMat(poser.place(s, u), mat4(s.fr));
        ctx.beginPath();
        for (let k = 0; k < e.n; k++) {
          const o = k * EF;
          // the outlines of the caps: the top face's rings, the part's silhouette
          if (e.data[o + 14] !== EDGE.cap || !(e.data[o + 15]! & EFLAG.top)) continue;
          const p = P(A, applyMat(M, [e.data[o]!, e.data[o + 1]!, e.data[o + 2]!]));
          const q = P(A, applyMat(M, [e.data[o + 3]!, e.data[o + 4]!, e.data[o + 5]!]));
          ctx.moveTo(p[0], p[1]);
          ctx.lineTo(q[0], q[1]);
        }
        ctx.stroke();
      }
    });
  }
  ctx.restore();
}

// ---------------------------------------------------------------------------------------------- explode trails (SD12)

/** A thin dashed trail from each exploded part to its assembled position. */
export function trails(A: Ann): void {
  if (A.explode <= 0) return;
  const { ctx, rt, T } = A;
  const gap = FORM.explode.gap * A.explode;
  ctx.save();
  ctx.setLineDash([...DRAFT.trail.dash]);
  ctx.lineWidth = DRAFT.trail.width;
  ctx.strokeStyle = paint(T.ink, DRAFT.trail.alpha);
  ctx.beginPath();
  rt.scene.pkg.solids.forEach((s, i) => {
    if (!s.ex || !A.LD.solid(s.detail)) return;
    const b = rt.box;
    const o = i * 6;
    const c0: Vec3 = [(b[o]! + b[o + 3]!) / 2, (b[o + 1]! + b[o + 4]!) / 2, (b[o + 2]! + b[o + 5]!) / 2];
    const now = applyMat(A.mats, c0, i * 16);
    const home = sub(now, [rt.axis[i * 3]! * gap * s.ex, rt.axis[i * 3 + 1]! * gap * s.ex, rt.axis[i * 3 + 2]! * gap * s.ex]);
    const p = P(A, home);
    const q = P(A, now);
    ctx.moveTo(p[0], p[1]);
    ctx.lineTo(q[0], q[1]);
  });
  ctx.stroke();
  ctx.restore();
}

// ---------------------------------------------------------------------------------------------- construction overlays (SD22)

type Ov = Teaching["overlays"][number];

/** A named point of the mechanism, or a literal [x, y, z], in world mm. */
export function pointOf(A: Ann, ref: unknown): Vec3 | null {
  if (Array.isArray(ref) && ref.length >= 2 && ref.every((x) => typeof x === "number")) return [ref[0] as number, ref[1] as number, (ref[2] as number | undefined) ?? 0];
  if (typeof ref !== "string") return null;
  return A.rt.scene.poser.point(A.u, ref);
}

/** A circle or arc about `c` in the plane with unit normal n, from angle a0 to a1 (radians, about n from the x-ish direction `e0`). */
function arcPts(c: Vec3, e0: Vec3, n: Vec3, r: number, a0: number, a1: number, steps = 64): Vec3[] {
  const e1 = cross(n, e0);
  const out: Vec3[] = [];
  for (let k = 0; k <= steps; k++) {
    const a = a0 + ((a1 - a0) * k) / steps;
    out.push(add(c, add(mul(e0, r * Math.cos(a)), mul(e1, r * Math.sin(a)))));
  }
  return out;
}

/**
 * The plane of a circle or ranged arc: its `normal`, else the axis of the joint it is centred on (a circle about a shaft in
 * front elevation lies in that shaft's plane), else z; x is the world x made square to the normal (the world y where the
 * normal is x).
 */
function planeOf(A: Ann, o: Record<string, unknown>): { n: Vec3; e0: Vec3 } {
  const ax = Array.isArray(o.normal) ? (o.normal as Vec3) : typeof o.center === "string" ? A.rt.scene.axes?.[o.center] : undefined;
  const n = unit(ax ?? [0, 0, 1]);
  const h: Vec3 = Math.abs(n[0]) > 0.9 ? [0, 1, 0] : [1, 0, 0];
  return { n, e0: unit(sub(h, mul(n, dot(h, n)))) };
}

const worldNormal = (a: Vec3, b: Vec3, c: Vec3): Vec3 => {
  const n = cross(sub(a, c), sub(b, c));
  return len(n) < 1e-6 ? [0, 0, 1] : unit(n);
};

/** Dashed fine ink lines with mono labels on a paper panel: dead centres, tangents, axis lines, moment arms, chords, arcs, workspaces. */
/** How the construction labels of a frame are drawn (SD22), and the label picked out (its number in the record's order). */
export interface LabelDraw {
  mode: LabelMode;
  plan: LabelPlan | null;
  focus: number | null;
  /** The sheet's drawing area across, CSS px: the rails stand inside it. */
  frame: { x0: number; x1: number };
  /** Callout rows mid-tween (session), by label key. */
  rows?: Map<string, number>;
}

/**
 * The construction overlays (SD22). Their labels stand in rails at the sides with leaders, or are numbered markers with
 * the key under the stage, as `L` says; with no layout they are lettered beside their elements (the screenshot tool's
 * old form); with mode "none" (a card) there are none. A picked-out label's element is drawn bold in accent and the rest
 * fade.
 */
export function overlays(A: Ann, L?: LabelDraw): void {
  const t = A.rt.scene.teaching;
  if (!t || !t.overlays.length) return;
  const { ctx, T } = A;
  const spots: LabelSpot[] = [];
  let base = "";
  const collect: Labeler = (text, x, y, _c, _s, cands) => spots.push({ text, base: base || text, cands: cands?.length ? cands : [[x, y]] });
  const label = L ? (L.mode === "none" ? () => {} : collect) : labeler(ctx, T, A.w, A.h);
  const ink = paint(T.ink, O.line.alpha + 0.3);
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  let n = 0;
  for (const ov of t.overlays) {
    const k = typeof ov.label === "string" && ov.label ? n++ : -1;
    const picked = L?.focus !== null && L?.focus !== undefined && k === L.focus;
    ctx.globalAlpha = L?.focus === null || L?.focus === undefined || picked ? 1 : O.rail.dim;
    ctx.strokeStyle = picked ? paint(T.accent) : paint(T.ink, O.line.alpha);
    ctx.lineWidth = picked ? O.line.width * 1.8 : O.line.width;
    base = typeof ov.label === "string" ? ov.label : "";
    drawOverlay(A, ov, label, ink);
  }
  ctx.restore();
  if (L?.plan && L.mode === "callouts") drawCallouts(ctx, T, L.plan, spots, L.focus, L.rows);
  else if (L?.plan && L.mode === "rails") drawRails(ctx, T, L.plan, spots, L.frame, L.focus);
  else if (L?.plan && L.mode === "markers") drawMarkers(ctx, T, L.plan, spots, L.focus);
}

/** A 2D context that draws nothing: the overlays' geometry run for where their labels would go. */
const DRY = new Proxy({}, { get: (_t, k) => (k === "measureText" ? () => ({ width: 0 }) : () => undefined), set: () => true }) as unknown as CanvasRenderingContext2D;

/** Where the construction labels could hang at phase u, without drawing (the layout follows them over the cycle). */
export function labelSpots(A: Ann, u: number): LabelSpot[] {
  const t = A.rt.scene.teaching;
  if (!t?.overlays.length) return [];
  const out: LabelSpot[] = [];
  let base = "";
  const collect: Labeler = (text, x, y, _c, _s, cands) => out.push({ text, base: base || text, cands: cands?.length ? cands : [[x, y]] });
  const B: Ann = { ...A, ctx: DRY, u };
  for (const ov of t.overlays) {
    base = typeof ov.label === "string" ? ov.label : "";
    drawOverlay(B, ov, collect, "");
  }
  return out;
}

/** The two points of a line overlay drawn through two named points (`from` and `through`, or `from` and `to`). */
function lineOf(A: Ann, ov: Ov | undefined): [Vec3, Vec3] | null {
  if (!ov) return null;
  const o = ov as Record<string, unknown>;
  if (o.from === undefined || (o.through === undefined && o.to === undefined)) return null;
  const a = pointOf(A, o.from), b = pointOf(A, o.through ?? o.to);
  return a && b && len(sub(b, a)) > 1e-6 ? [a, b] : null;
}

/** Where two lines cross in the plan plane (at the first line's height); null when they are near parallel. */
function crossing(l: [Vec3, Vec3], m: [Vec3, Vec3]): Vec3 | null {
  const d1 = sub(l[1], l[0]), d2 = sub(m[1], m[0]);
  const den = d1[0] * d2[1] - d1[1] * d2[0];
  if (Math.abs(den) < 1e-9 * len(d1) * len(d2)) return null;
  const w = sub(m[0], l[0]);
  const t = (w[0] * d2[1] - w[1] * d2[0]) / den;
  return add(l[0], mul(d1, t));
}

/** The point where the lines a `meet` overlay names cross (the first two of them), if they do. */
function meetOf(A: Ann, names: unknown): Vec3 | null {
  if (!Array.isArray(names) || names.length < 2) return null;
  const all = A.rt.scene.teaching?.overlays ?? [];
  const l = lineOf(A, all.find((q) => q.id === names[0]));
  const m = lineOf(A, all.find((q) => q.id === names[1]));
  return l && m ? crossing(l, m) : null;
}

function drawOverlay(A: Ann, ov: Ov, label: Labeler, ink: string): void {
  const { ctx } = A;
  const text = typeof ov.label === "string" ? ov.label : "";
  const dash = () => ctx.setLineDash([...O.line.dash]);
  const solid = () => ctx.setLineDash([]);
  const poly = (pts: Vec3[], close = false) => {
    dash();
    stroke(ctx, pts.map((p) => P(A, p)), close);
    solid();
  };
  // a label at a point, offset as it is lettered beside it; `more` are other points of the element it could hang on
  // instead (its ends, its centre), for a layout that picks the steadiest (SD22)
  const tag = (p: Vec3, dx = 0, dy = -14, more: (Vec3 | null)[] = []) => {
    if (!text) return;
    const [x, y] = P(A, p);
    label(text, x + dx, y + dy, ink, true, [[x, y], ...more.filter((q): q is Vec3 => !!q).map((q) => P(A, q))]);
  };
  const o = ov as Record<string, unknown>;
  // a posed overlay is drawn where an output reaches an extreme (a dead centre, the ends of a stroke): `pose` for all
  // its points, `fromPose` and `toPose` for its first and second
  const posed = (ref: unknown, which?: unknown): Vec3 | null => {
    const q = (which ?? o.pose) as { output?: string; stat?: string } | undefined;
    if (!q?.output || (q.stat !== "max" && q.stat !== "min")) return pointOf(A, ref);
    const u = A.rt.scene.poser.phaseOf?.(q.output, q.stat);
    if (u === null || u === undefined || typeof ref !== "string") return pointOf(A, ref);
    return A.rt.scene.poser.point(u, ref);
  };
  const fromPt = () => posed(o.from, o.fromPose);
  const toPt = () => posed(o.to, o.toPose);
  // the same point where the kinematics put it, for a true length: the drawn point rides the top of its part
  const rawOf = (ref: unknown, which?: unknown): Vec3 | null => {
    const P = A.rt.scene.poser;
    if (typeof ref !== "string" || !P.rawPoint) return null;
    const q = (which ?? o.pose) as { output?: string; stat?: string } | undefined;
    const u = q?.output && (q.stat === "max" || q.stat === "min") ? (P.phaseOf?.(q.output, q.stat) ?? A.u) : A.u;
    return P.rawPoint(u, ref);
  };
  switch (ov.kind) {
    case "line":
    case "chord": {
      // a line drawn at a fixed pose (a toggle, an aim line at neutral) holds its driver at that value; one posed at an
      // output's extreme (a dead centre) is drawn there
      const fixed = o.pose as { driver?: unknown; value?: unknown } | undefined;
      const held = fixed && typeof fixed.driver === "string" && typeof fixed.value === "number" && A.rt.scene.poser.pointAt;
      const at = (ref: unknown) => (typeof ref === "string" ? A.rt.scene.poser.pointAt!({ [fixed!.driver as string]: fixed!.value as number }, ref) : pointOf(A, ref));
      const a = held ? at(o.from) : fromPt(), b = held ? at(o.to) : toPt();
      if (!a || !b) return;
      const ext = o.extend === true ? 0.25 : 0;
      const d = sub(b, a);
      poly([sub(a, mul(d, ext)), add(b, mul(d, ext))]);
      // a line too short to carry its label (an eccentric's O-E) keeps it clear, past its far end
      const [sx, sy] = P(A, a);
      const [tx, ty] = P(A, b);
      const sl = Math.hypot(tx - sx, ty - sy);
      if (text && sl < O.shortLine) {
        const ux = sl > 1e-6 ? (tx - sx) / sl : 1;
        const uy = sl > 1e-6 ? (ty - sy) / sl : 0;
        ctx.save();
        ctx.font = font(DRAFT.type.overlaySmall);
        const w = ctx.measureText(DRAFT.type.uppercase ? text.toUpperCase() : text).width / 2 + O.labelPadX + O.shortGap;
        ctx.restore();
        label(text, tx + ux * w, ty + uy * (O.labelHSmall / 2 + O.shortGap), ink, true, [[tx, ty], [sx, sy]]);
      } else tag(mul(add(a, b), 0.5), 0, -14, [a, b]);
      return;
    }
    case "dimension": {
      const a = fromPt();
      // a moment arm: from the point square to a line through two named points (the foot of the perpendicular, in plan)
      const ln = Array.isArray(o.line) && o.line.length === 2 ? [pointOf(A, o.line[0]), pointOf(A, o.line[1])] : null;
      let b = ln ? null : toPt();
      if (a && ln && ln[0] && ln[1]) {
        const d: Vec3 = [ln[1][0] - ln[0][0], ln[1][1] - ln[0][1], 0];
        const t = ((a[0] - ln[0][0]) * d[0] + (a[1] - ln[0][1]) * d[1]) / Math.max(1e-9, d[0] * d[0] + d[1] * d[1]);
        b = [ln[0][0] + d[0] * t, ln[0][1] + d[1] * t, a[2]];
        // the line itself, carried to the foot where it falls outside the two points
        const lo = Math.min(0, t), hi = Math.max(1, t);
        poly([add(ln[0], mul(sub(ln[1], ln[0]), lo)), add(ln[0], mul(sub(ln[1], ln[0]), hi))]);
      }
      if (!a || !b) return;
      // one component of the span only (an offset measured square to a slide)
      const k = typeof o.component === "string" ? "xyz".indexOf(o.component) : -1;
      if (k >= 0) b = a.map((v, i) => (i === k ? b![i]! : v)) as Vec3;
      const p = P(A, a), q = P(A, b);
      ctx.save();
      ctx.fillStyle = ctx.strokeStyle;
      ctx.lineWidth = O.dimWidth;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(p[0], p[1]);
      ctx.lineTo(q[0], q[1]);
      ctx.stroke();
      arrowHead(ctx, q, p, O.arrowDim);
      arrowHead(ctx, p, q, O.arrowDim);
      ctx.restore();
      // the true length: between the points where the kinematics put them (at their poses, one component if asked)
      const ra = ln ? null : rawOf(o.from, o.fromPose);
      let rb = ln ? null : rawOf(o.to, o.toPose);
      if (ra && rb && k >= 0) rb = ra.map((v, i) => (i === k ? rb![i]! : v)) as Vec3;
      const m = ln ? Math.hypot(b[0] - a[0], b[1] - a[1]) : ra && rb ? len(sub(rb, ra)) : typeof o.from === "string" && typeof o.to === "string" ? A.rt.scene.poser.measure?.(A.u, o.from, o.to) : null;
      if (text) label(`${text} ${(m ?? len(sub(b, a))).toFixed(1)}`, (p[0] + q[0]) / 2, (p[1] + q[1]) / 2 - 14, ink, true, [[(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], p, q]);
      return;
    }
    case "circle": {
      // a circle at a named point, or where the lines it names meet (a turning centre); of a given radius, of a radius the
      // kinematics solve (a variator's pitch radius), or through a point (a contact circle on a disc)
      const c = o.meet !== undefined ? meetOf(A, o.meet) : pointOf(A, o.center);
      const { n, e0 } = planeOf(A, o);
      const th = pointOf(A, o.through);
      const rv = typeof o.radius === "string" ? (A.rt.scene.poser.value?.(A.u, o.radius) ?? null) : null;
      const across = (d: Vec3) => len(sub(d, mul(n, dot(d, n))));
      const r = typeof o.radius === "number" ? o.radius : rv !== null ? rv : c && th ? across(sub(th, c)) : null;
      if (!c || r === null) return;
      poly(arcPts(c, e0, n, r, 0, TAU), true);
      tag(add(c, mul(e0, r)), 18, 0, [c]);
      return;
    }
    case "arc": {
      const c = pointOf(A, o.center);
      if (!c) return;
      if (typeof o.radius === "number" && Array.isArray(o.range)) {
        // an arc over a range of angles (degrees from the plane's x, about its normal), turning with the body `frame`
        const { n, e0 } = planeOf(A, o);
        const [a0, a1] = (o.range as number[]).map((x) => x * (Math.PI / 180));
        let pts = arcPts(c, e0, n, o.radius, a0!, a1!);
        const M = typeof o.frame === "string" ? A.rt.scene.poser.body?.(A.u, o.frame) : null;
        if (M) {
          const M0 = A.rt.scene.poser.body?.(A.u, o.frame as string);
          // the centre is where the body's joint is now; the arc is laid out in the reference and carried by the pose
          const cRef = applyMat(invRigid(M0!), c);
          pts = arcPts(cRef, e0, n, o.radius, a0!, a1!).map((p) => applyMat(M, p));
        }
        poly(pts);
        tag(pts[Math.floor(pts.length / 2)]!, 0, -10, [c]);
        return;
      }
      const from = fromPt(), to = toPt(), through = pointOf(A, o.through);
      if (from && to && (o.fromPose || o.toPose)) {
        // an arc on the circle a point runs on, between two of its poses (the cut and return of a crank): turning
        // counter-clockwise about +z unless `sweep` is "cw"
        // (the in-plane radius: the point stands on its part's top face, above the centre's level)
        const r = Math.hypot(from[0] - c[0], from[1] - c[1]);
        const a0 = Math.atan2(from[1] - c[1], from[0] - c[0]);
        let a1 = Math.atan2(to[1] - c[1], to[0] - c[0]);
        if (o.sweep === "cw") while (a1 > a0) a1 -= TAU;
        else while (a1 < a0) a1 += TAU;
        const pts = arcPts(c, [1, 0, 0], [0, 0, 1], r, a0, a1);
        poly(pts);
        tag(pts[32]!, 0, -10, [c]);
        return;
      }
      if (from && to) {
        const n = worldNormal(from, to, c);
        const e0 = unit(sub(from, c));
        const e1 = cross(n, e0);
        const v = sub(to, c);
        let ang = Math.atan2(dot(v, e1), dot(v, e0));
        if (ang < 0) ang += TAU;
        const r = Math.min(len(sub(from, c)), len(sub(to, c))) * 0.5;
        poly(arcPts(c, e0, n, r, 0, ang));
        tag(arcPts(c, e0, n, r, 0, ang)[32]!, 0, -10, [c]);
        return;
      }
      if (through) {
        // the arc a point sweeps about the centre over the cycle: its extreme angles about the plane's normal (z)
        // (with `range`, only over those driver values: the stretch of a coupler curve that is a circular arc, at the
        // arc's own `radius` when the record gives one; else from the point's cached path, since sampling it each frame
        // costs a pose per sample)
        const poser = A.rt.scene.poser;
        const r = typeof o.radius === "number" ? o.radius : len(sub(through, c));
        const name = typeof o.through === "string" ? o.through : "";
        const swept = Array.isArray(o.range) && poser.sweep ? poser.sweep(name, o.range as [number, number])?.[0] : undefined;
        const path = swept || !name ? null : pathOf(A, name);
        const cached = path ? Array.from({ length: path.length / 3 }, (_, k): Vec3 => [path[3 * k]!, path[3 * k + 1]!, path[3 * k + 2]!]) : null;
        const samples = swept ?? cached ?? Array.from({ length: 120 }, (_, k) => poser.point((k / 120) * poser.period, name));
        const angs: number[] = [];
        let prev = 0;
        for (const p of samples) {
          if (!p) continue;
          let a = Math.atan2(p[1] - c[1], p[0] - c[0]);
          if (angs.length) {
            while (a - prev > Math.PI) a -= TAU;
            while (a - prev < -Math.PI) a += TAU;
          }
          prev = a;
          angs.push(a);
        }
        if (!angs.length) return;
        const lo = Math.min(...angs), hi = Math.max(...angs);
        const full = hi - lo > TAU * 0.9;
        const pts = arcPts(c, [1, 0, 0], [0, 0, 1], r, full ? 0 : lo, full ? TAU : hi);
        poly(pts, full);
        tag(pts[Math.floor(pts.length / 2)]!, 0, -10, [c]);
      }
      return;
    }
    case "bend": {
      // a flexure's bend (record spec, overlay kind bend): the turn of a point of the bent part about the flexure, from
      // its rest place, as a signed arc with the angle in degrees, about the joint's axis
      const c = pointOf(A, o.at);
      const from = pointOf(A, o.from), to = pointOf(A, o.to);
      if (!c || !from || !to) return;
      const n = unit((A.rt.scene.axes?.[typeof o.at === "string" ? o.at : ""] as Vec3 | undefined) ?? [0, 0, 1]);
      const e0 = unit(sub(from, c));
      const e1 = cross(n, e0);
      const v = sub(to, c);
      const ang = Math.atan2(dot(v, e1), dot(v, e0));
      const r = len(sub(from, c));
      const pts = arcPts(c, e0, n, r, Math.min(0, ang), Math.max(0, ang));
      poly([c, from]);
      if (Math.abs(ang) > 1e-4) poly(pts);
      const deg = (ang * 180) / Math.PI;
      if (text) label(`${text} ${deg >= 0 ? "+" : ""}${deg.toFixed(2)}°`, P(A, from)[0], P(A, from)[1] - 14, ink, true, [P(A, from), P(A, c)]);
      return;
    }
    case "axis-line": {
      // a line from one named point through another (a wheel's axis), carried on to where it meets the line named by
      // `extend`, or to the meeting point of a circle overlay that names it
      const ln = lineOf(A, ov);
      if (ln) {
        const [p, q] = ln;
        const d = sub(q, p);
        const all = A.rt.scene.teaching?.overlays ?? [];
        const ends: number[] = [0, 1];
        const reach = (x: Vec3 | null) => {
          if (x && len(sub(x, p)) < 50 * len(d)) ends.push(dot(sub(x, p), d) / dot(d, d));
        };
        if (typeof o.extend === "string") reach(crossing(ln, lineOf(A, all.find((m) => m.id === o.extend)) ?? ln));
        for (const m of all) {
          const mm = m as Record<string, unknown>;
          if (Array.isArray(mm.meet) && mm.meet.includes(ov.id)) reach(meetOf(A, mm.meet));
        }
        const lo = Math.min(...ends) - 0.1, hi = Math.max(...ends) + 0.1;
        poly([add(p, mul(d, lo)), add(p, mul(d, hi))]);
        tag(add(p, mul(d, hi)), 0, -12, [p, q]);
        return;
      }
      // or at a point (`at`, or `point`) with its direction (`axis`, or `dir`)
      const at = o.at ?? o.point;
      const c = pointOf(A, at);
      if (!c) return;
      const dir = o.axis ?? o.dir;
      const ax = Array.isArray(dir) ? (dir as Vec3) : (A.rt.scene.axes?.[typeof at === "string" ? at : ""] ?? [0, 0, 1]);
      const a = unit(ax);
      const L = typeof o.length === "number" ? o.length : 80;
      poly([sub(c, mul(a, L)), add(c, mul(a, L))]);
      tag(add(c, mul(a, L)), 0, -12, [c]);
      return;
    }
    case "workspace": {
      const pt = typeof o.point === "string" ? o.point : "";
      const poser = A.rt.scene.poser;
      const pts: Vec3[] = [];
      // the outline a tip reaches over two drivers' ranges (a five-bar's workspace)
      if (Array.isArray(o.over) && o.over.length === 2 && poser.area) {
        const out = poser.area(pt, [String(o.over[0]), String(o.over[1])]);
        if (out) {
          poly(out, true);
          tag(out[Math.floor(out.length / 8)]!, 0, -12);
        }
        return;
      }
      // the point's path seen from a moving body, carried by that body now: the centrode that rolls on the fixed one
      if (typeof o.frame === "string" && poser.bodyAt) {
        const now = poser.bodyAt(A.u, o.frame);
        if (!now) return;
        const n = 180;
        for (let k = 0; k <= n; k++) {
          const u = (k / n) * poser.period;
          const p = poser.point(u, pt), X = poser.bodyAt(u, o.frame);
          if (p && X) pts.push(xfApply(now, xfApply(xfInv(X), p)));
        }
        poly(pts, true);
        if (pts[0]) tag(pts[Math.floor(n / 4)]!, 0, -12);
        return;
      }
      const sweeps = poser.sweep ? poser.sweep(pt, Array.isArray(o.range) ? (o.range as [number, number]) : undefined, Array.isArray(o.branches) ? (o.branches as string[]) : undefined) : null;
      if (sweeps) for (const line of sweeps) { poly(line); if (line.length) pts.push(line[Math.floor(line.length / 2)]!); }
      else {
        const path = pathOf(A, pt);
        if (path) for (let k = 0; k < path.length; k += 3) pts.push([path[k]!, path[k + 1]!, path[k + 2]!]);
        poly(pts, true);
      }
      if (pts[0]) tag(pts[0], 0, -12);
      return;
    }
    default:
      return;
  }
}

// ---------------------------------------------------------------------------------------------- highlights (SD26)

/** The accent callout on the part or point a view or a setting makes the point of: dashed circle, leader, label. */
export function highlights(A: Ann, names: string[]): void {
  if (!names.length) return;
  const { ctx, T, rt } = A;
  const HL = DRAFT.highlight;
  ctx.save();
  names.forEach((name, k) => {
    let at: Vec3 | null = rt.scene.poser.point(A.u, name);
    if (!at) {
      const sol = rt.scene.pkg.solids.map((s, i) => [s, i] as const).filter(([s]) => s.body === name);
      if (sol.length) {
        const [, i] = sol[0]!;
        const b = rt.box;
        const o = i * 6;
        at = applyMat(A.mats, [(b[o]! + b[o + 3]!) / 2, (b[o + 1]! + b[o + 4]!) / 2, b[o + 5]!], i * 16);
      }
    }
    if (!at) return;
    const [x, y] = P(A, at);
    ctx.strokeStyle = paint(T[HL.color], HL.alpha);
    ctx.lineWidth = HL.width;
    ctx.setLineDash([...HL.dash]);
    ctx.beginPath();
    ctx.arc(x, y, HL.r, 0, TAU);
    ctx.stroke();
    ctx.setLineDash([]);
    const [l0, l1, l2] = HL.leader;
    const dy = k * 16;
    ctx.beginPath();
    ctx.moveTo(x + l0, y - l0);
    ctx.lineTo(x + l1, y - l1 - dy);
    ctx.lineTo(x + l2, y - l1 - dy);
    ctx.stroke();
    ctx.font = font(DRAFT.type.callout);
    ctx.fillStyle = paint(T[HL.color]);
    ctx.textBaseline = "bottom";
    ctx.textAlign = "left";
    ctx.fillText(name.toUpperCase(), x + HL.labelOffset, y - HL.labelOffset - dy);
  });
  ctx.restore();
}

// ---------------------------------------------------------------------------------------------- forces, velocity, angles (SD14)

export type Item3 =
  | { type: "force"; a: Vec3; b: Vec3; key?: string; warn?: boolean }
  | { type: "axial"; a: Vec3; b: Vec3; key?: string }
  | { type: "angle"; c: Vec3; a: Vec3; b: Vec3; r?: number; key?: string; value?: number; warn?: boolean };

export interface OverlayFlags {
  forces?: boolean;
  velocity?: boolean;
  angles?: boolean;
}

const col = (T: ResolvedTheme, k: { color: keyof ResolvedTheme & string; alpha: number }) => paint(T[k.color as "ink"], k.alpha);

/** Force arrows, velocity arrows (from the poser's points) and angle arcs, over the drawing and never changing it. */
export function overlayItems(A: Ann, f: OverlayFlags, items: { forces?: Item3[]; angles?: Item3[]; velocity?: { point: string; max: number }[] }): void {
  const { ctx, T, C } = A;
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineWidth = O.width;
  ctx.setLineDash([]);
  const label = labeler(ctx, T, A.w, A.h);
  const labelOf = (it: Item3): string | null => (!it.key ? null : it.type === "angle" && it.value !== undefined ? `${it.key} ${Math.round(it.value)}°` : it.key);
  const arrowItem = (a: Vec3, b: Vec3, c: string, text: string | null) => {
    ctx.strokeStyle = ctx.fillStyle = c;
    const p = P(A, a), q = P(A, b);
    ctx.beginPath();
    ctx.moveTo(p[0], p[1]);
    ctx.lineTo(q[0], q[1]);
    ctx.stroke();
    arrowHead(ctx, p, q, O.arrow);
    if (text) {
      const dx = q[0] - p[0], dy = q[1] - p[1];
      const L = Math.hypot(dx, dy) || 1;
      label(text, q[0] + (dx / L) * 16, q[1] + (dy / L) * 14, c);
    }
  };
  if (f.angles)
    for (const it of items.angles ?? []) {
      if (it.type !== "angle") continue;
      const c = col(T, it.warn ? O.forcesWarn : O.angles);
      ctx.strokeStyle = c;
      const r = (it.r ?? O.angleR);
      const n = worldNormal(it.a, it.b, it.c);
      const e0 = unit(sub(it.a, it.c));
      const e1 = cross(n, e0);
      const v = sub(it.b, it.c);
      const ang = Math.atan2(dot(v, e1), dot(v, e0));
      const G = O.angleGuide;
      ctx.lineWidth = G.width;
      ctx.globalAlpha = G.alpha;
      ctx.setLineDash([...G.dash]);
      ctx.beginPath();
      for (const q of [e0, unit(sub(it.b, it.c))]) {
        const p = P(A, it.c), t = P(A, add(it.c, mul(q, r * G.reach)));
        ctx.moveTo(p[0], p[1]);
        ctx.lineTo(t[0], t[1]);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.setLineDash([]);
      ctx.lineWidth = O.angleArc;
      const arc = arcPts(it.c, e0, n, r, 0, ang, 32);
      stroke(ctx, arc.map((p) => P(A, p)), false);
      const text = labelOf(it);
      if (text) {
        const m = arc[16]!;
        const [x, y] = P(A, add(it.c, mul(unit(sub(m, it.c)), r * 1.6)));
        label(text, x, y, c);
      }
      ctx.lineWidth = O.width;
    }
  if (f.velocity) {
    const poser = A.rt.scene.poser;
    for (const v of items.velocity ?? []) {
      const du = 1e-3;
      const a = poser.point(A.u - du, v.point), b = poser.point(A.u + du, v.point), p0 = poser.point(A.u, v.point);
      if (!a || !b || !p0) continue;
      const d = mul(sub(b, a), 1 / (2 * du));
      const sp = len(d);
      const L = (O.velocityLen * sp) / (v.max || 1);
      if (L < O.velocityMin) continue;
      const mm = L / (C.s || 1);
      arrowItem(p0, add(p0, mul(unit(d), mm)), col(T, O.velocity), items.velocity!.length < 3 ? `v ${Math.round((sp / (v.max || 1)) * 100)}%` : null);
    }
  }
  if (f.forces) for (const it of items.forces ?? []) if (it.type === "force") arrowItem(it.a, it.b, col(T, it.warn ? O.forcesWarn : O.forces), labelOf(it));
  ctx.restore();
}

/** The scale shown in the title block of a camera. */
export const scaleLabel = (C: Camera): string => {
  const k = scaleOf(C);
  return k >= 1 ? `${k.toFixed(1)} : 1` : `1 : ${(1 / k).toFixed(1)}`;
};
