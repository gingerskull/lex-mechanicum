// The solids of a frame planned as GPU work, on the CPU and without a GPU (so it is unit-tested in Node): the slice table
// (pose, z range and fade per slice) and two chunk tables, one per target: the frame (paper, shade, hidden lines) and the
// lines layer (full lines, erased where later surfaces cover them). A chunk is a range of items drawn in one mode; its
// op number, written as depth, keeps the paint order of the drafting frame (style Part IV, paint order SD).
import { TAU, area, type Vec2 } from "../../core/geom";
import { DRAFT, type RoleSurface, type SurfaceKey } from "../../style/draft";
import { FORM } from "../../style/form";
import type { theme } from "../../style/theme";
import type { Ladder } from "../detail";
import type { Projector } from "../projector";
import { wallsOf, type Slice } from "../slices";
import type { World } from "../world";
import { ITEM_TEXELS, type Items, type Range } from "./geometry";
import { MODE, OPS, PER_ROW } from "./shaders";

const PLATE = new Set(["part", "plate", "bracket", "bridge", "housing", "base"]);
const L = DRAFT.lines;
const F = DRAFT.fill;
const PT = DRAFT.pattern;
/** The role patterns, in the order of the pattern texture's layers. */
export const PATTERNS = ["dots", "hatch", "cross", "dash"] as const;
const ITEM = ITEM_TEXELS * 4;

/**
 * A slice's top-face paper and occlusion. A see-through solid and the base cover once, at their top face: their inner
 * slices add nothing, since each slice would erase the lines layer again and the parts passing through the base cut it
 * into many slices, so nothing would show through it.
 */
export function cover(k: { base?: boolean; plate?: boolean; see?: boolean; top: boolean }): { face: number; occ: number; wallOcc: number } {
  const once = (k.see || k.base) && !k.top ? 0 : 1;
  const f = k.see ? F.seeThrough.opacity : 1;
  const occ = (k.base ? F.occlude.base : k.plate ? F.occlude.plate : F.occlude.other) * f;
  // the side walls of a stack of slices sit one below the other, not over each other: each slice's walls erase
  return { face: (k.base ? F.base : k.plate ? F.plate : F.other) * f * once, occ: occ * once, wallOcc: k.see ? 0 : occ * F.wallOcclude };
}

/** Chunk parameters, after the op number: up to seven floats, read by the shaders per mode. */
type Params = number[];

/** A growing chunk table: three texels per chunk (first instance, first item, slice, mode; op, params...). */
export class Chunks {
  data = new Float32Array(PER_ROW * ITEM);
  n = 0;
  instances = 0;
  push(range: Range, slice: number, mode: number, op: number, p: Params): void {
    if (!range[1]) return;
    if ((this.n + 1) * ITEM > this.data.length) {
      const d = new Float32Array(this.data.length * 2);
      d.set(this.data);
      this.data = d;
    }
    const o = this.n * ITEM;
    this.data[o] = this.instances;
    this.data[o + 1] = range[0];
    this.data[o + 2] = slice;
    this.data[o + 3] = mode;
    this.data[o + 4] = op;
    for (let i = 0; i < 7; i++) this.data[o + 5 + i] = p[i] ?? 0;
    this.n++;
    this.instances += range[1];
  }
}

/** Joint heads seen from above, for the centrelines: centre and half extents in CSS px. */
export type Heads = [number, number, number, number][];

export interface PlanInput {
  /** The frame's slices, sorted far to near. */
  list: Slice<World>[];
  T: ReturnType<typeof theme>;
  LD: Ladder;
  /** Factors on the bold top outlines (a library card draws them thinner). */
  cardK: { plate: number; base: number };
  Pr: Projector;
  items: Items;
  /** First item id of the frame's screen-space items (threads, accent rings, outermost silhouettes). */
  dynStart: number;
}

export interface FramePlan {
  /** Two texels per slice: (x, y, cos a, sin a), (z0, top, fade, 0). */
  slices: Float32Array;
  frame: Chunks;
  lines: Chunks;
  /** The frame's screen-space items, in CSS px, laid out like static items. */
  dyn: Float32Array;
  /** Dash phase at the start of each item of a dashed chunk, in CSS px; a dashed chunk points into it. */
  dash: Float32Array;
  heads: Heads;
  /** Op numbers used. */
  ops: number;
}

/**
 * The phase of a dashed line at the start of each of its items: the projected length of the ring so far, so a dash is
 * as long on screen at any tilt and pose. Each ring starts again at 0, as Canvas 2D starts each subpath.
 */
function phases(items: Items, r: Range, pose: [number, number, number], Pr: Projector, out: number[]): void {
  const D = items.data;
  const c = Math.cos(pose[2]);
  const s = Math.sin(pose[2]);
  let cum = 0;
  for (let i = r[0]; i < r[0] + r[1]; i++) {
    const o = i * ITEM;
    if (D[o + 2] === 0) cum = 0;
    out.push(cum);
    const dx = D[o + 6]! - D[o + 4]!;
    const dy = D[o + 7]! - D[o + 5]!;
    cum += Pr.s * Math.hypot(c * dx - s * dy, (s * dx + c * dy) * Pr.ct);
  }
}

export function planFrame(f: PlanInput): FramePlan {
  const { list, T, LD, cardK, Pr, items, dynStart } = f;
  const SK = DRAFT.sketch;
  const WS = F.wallShade;
  const hidden = LD.effect("hiddenLines");
  const shade = LD.effect("wallShade");
  const heads: Heads = [];
  const dyn: number[] = [];
  const dash: number[] = [];
  // screen-space items after the static ones: open or closed polylines, or loose segments
  const screen = (pts: Vec2[], closed: boolean): Range => {
    const s = dynStart + dyn.length / ITEM;
    const m = closed ? pts.length : pts.length - 1;
    for (let i = 0; i < m; i++) {
      const a = pts[i]!;
      const b = pts[(i + 1) % pts.length]!;
      dyn.push(0, 0, 0, 0, a[0], a[1], b[0], b[1], 0, 0, 0, 0);
    }
    return [s, dynStart + dyn.length / ITEM - s];
  };
  const segs = (pairs: [Vec2, Vec2][]): Range => {
    const s = dynStart + dyn.length / ITEM;
    for (const [a, b] of pairs) dyn.push(0, 0, 0, 0, a[0], a[1], b[0], b[1], 0, 0, 0, 0);
    return [s, dynStart + dyn.length / ITEM - s];
  };
  // the leftmost and rightmost point of each solid's outline, where its silhouette runs down whatever the walls do
  const extremes = new Map<World, [number, number]>();
  const extreme = (w: World): [number, number] => {
    let e = extremes.get(w);
    if (!e) {
      let lo = 0;
      let hi = 0;
      const P = w.outer;
      for (let i = 1; i < P.length; i++) {
        if (P[i]![0] < P[lo]![0]) lo = i;
        if (P[i]![0] > P[hi]![0]) hi = i;
      }
      e = [lo, hi];
      extremes.set(w, e);
    }
    return e;
  };
  const slices = new Float32Array(Math.max(1, list.length) * 8);
  const cm = new Chunks();
  const cl = new Chunks();
  let op = 1;
  list.forEach((Sl, si) => {
    const w = Sl.w;
    const p = w.p;
    const it = items.solids.get(p)!;
    const fa = p.faint ? 0.5 : 1;
    slices.set([w.pose[0], w.pose[1], Math.cos(w.pose[2]), Math.sin(w.pose[2]), Sl.z0, Sl.top, fa, 0], si * 8);
    const isBase = p.base;
    const isPlate = PLATE.has(p.s.kind) && p.s.role !== "trace";
    const R: RoleSurface = (isBase ? DRAFT.role.base : DRAFT.role[p.s.role as SurfaceKey]) ?? DRAFT.role.link;
    const see = p.seeThrough ? F.seeThrough : null;
    const { face: faceA, occ, wallOcc } = cover({ base: isBase, plate: isPlate, see: !!see, top: Sl.isTop });
    const d: Vec2 = [0, Pr.s * (Sl.top - Sl.z0) * Pr.st];
    // pen: the full line on the lines layer; the frame gets it thin and dashed, a hidden line where it is covered
    const line = (r: Range, z: number, width: number, alpha: number, withHidden: boolean, at = op) => {
      cl.push(r, si, MODE.line, at, [z, width, alpha, 0, 0, 0, 0]);
      if (withHidden && hidden && r[1]) {
        const at0 = dash.length;
        phases(items, r, w.pose, Pr, dash);
        cm.push(r, si, MODE.line, at, [z, width * L.hidden.width, alpha * L.hidden.alpha, 0, 1 + at0, 0, 0]);
      }
    };
    // 1. side walls: paper, then an ink shade stepped by facing; the lines layer erased; hole walls clipped to the hole
    const wallA = F.wall * (isBase ? F.baseWallGain : 1) * (see?.opacity ?? 1);
    cm.push(it.outer, si, MODE.wall, op, [wallA, shade ? 1 : 0, WS.outer.from, WS.outer.span]);
    cl.push(it.outer, si, MODE.wallErase, op, [Math.max(0, Math.min(1, wallOcc))]);
    op++;
    if (shade && it.holes[1]) cm.push(it.holes, si, MODE.holeWall, op++, [0, 0, WS.hole.from, WS.hole.span]);
    // 2. the plate's bottom outline before its own top face, so its back edge turns hidden behind it
    if (Sl.isBottom && isPlate) line(it.outer, Sl.z0, L.plateBottom, L.bottomAlpha, true, op++);
    // 3. the slice's top face: paper, tint and role pattern; the lines layer erased
    let patA = 0;
    let patK = 0;
    let uv = 0;
    if (Sl.isTop && LD.effect("rolePatterns") && R.pattern && R.pattern !== "none" && R.step && Pr.ct >= PT.offBelowCos) {
      patA = (R.alpha ?? 0) * T.patternGain;
      patK = PATTERNS.indexOf(R.pattern as (typeof PATTERNS)[number]);
      uv = 1 / Math.max(DRAFT.minPx / Pr.s, R.step);
    }
    cm.push(it.tris, si, MODE.face, op, [faceA, Sl.isTop ? (R.tint ?? 0) : 0, patA, patK, uv]);
    if (occ > 0) cl.push(it.tris, si, MODE.faceErase, op, [Math.max(0, Math.min(1, occ))]);
    op++;
    // threads on shanks and shafts (DL-B): screen-space segments on the visible walls
    if (w.thr && p.s.thr && FORM.thread.show && LD.mark("thread")) {
      const lo = Math.max(w.thr[0], Sl.z0);
      const hi = Math.min(w.thr[1], Sl.top);
      if (hi - lo > 0.05) {
        const P = w.outer;
        const n = P.length;
        const top = P.map((q) => Pr.P(q[0], q[1], Sl.top));
        const vis = wallsOf(top, d, area(top) > 0 ? 1 : -1, WS.steps).vis;
        const pitch = Math.max(FORM.thread.pitch(p.s.thr[0]), FORM.thread.minPitchPx / Pr.s);
        const pairs: [Vec2, Vec2][] = [];
        for (let z = lo; z < hi; z += pitch)
          for (let i = 0; i < n; i++) {
            if (!vis[i]) continue;
            const za = z + (pitch * i) / n;
            const zb = z + (pitch * (i + 1)) / n;
            if (zb > hi) break;
            pairs.push([Pr.P(P[i]![0], P[i]![1], za), Pr.P(P[(i + 1) % n]![0], P[(i + 1) % n]![1], zb)]);
          }
        cl.push(segs(pairs), si, MODE.screen, op++, [L.thread, L.threadAlpha * fa, 0, 0]);
      }
    }
    // 4. silhouettes down the walls, where the walls turn away and at the outline's far left and right; on inner
    // slices only while DL-C is drawn
    if (Sl.isTop || LD.effect("innerSilhouettes")) {
      cl.push(it.verts, si, MODE.silhouette, op, [L.silhouette, L.silhouetteAlpha]);
      const pairs: [Vec2, Vec2][] = extreme(w).map((i) => {
        const q = Pr.P(w.outer[i]![0], w.outer[i]![1], Sl.top);
        return [q, [q[0] + d[0], q[1] + d[1]]];
      });
      cl.push(segs(pairs), si, MODE.screen, op, [L.silhouette, L.silhouetteAlpha * fa, 0, 0]);
      op++;
    }
    if (Sl.isTop) {
      if (it.chamfer[1] && Pr.s > L.chamferMinScale && LD.mark("chamfer"))
        cl.push(it.chamfer, si, MODE.line, op++, [Sl.top, L.chamfer, L.chamferAlpha * (isBase ? L.baseChamferGain : 1), 0, 0, 0, 0]);
      const shown = it.marks.filter((m) => LD.mark(m.kind));
      if (shown.length) {
        for (const m of shown) cl.push(m.range, si, MODE.line, op, [Sl.top, L.marks, L.marksAlpha * (isBase ? L.baseMarksGain : 1), 0, 0, 0, 0]);
        op++;
      }
      const width = isBase ? L.baseTop * cardK.base : isPlate ? L.plateTop * cardK.plate : L.otherTop;
      line(it.outer, Sl.top, width, 1, true, op);
      line(it.holes, Sl.top, width, 1, true, op);
      op++;
      // a second, offset pencil pass round the base plate: the one loose line on the sheet
      if (isBase && SK.doubleAlpha > 0) {
        const o = SK.doubleOffset;
        cl.push(it.outer, si, MODE.line, op++, [Sl.top, SK.width, SK.doubleAlpha, 0, 0, o, o * SK.doubleOffsetY]);
      }
      if (p.accent || p.headTop) {
        let a0 = Infinity;
        let b0 = Infinity;
        let a1 = -Infinity;
        let b1 = -Infinity;
        for (const q of w.outer) {
          const [x, y] = Pr.P(q[0], q[1], Sl.top);
          if (x < a0) a0 = x;
          if (x > a1) a1 = x;
          if (y < b0) b0 = y;
          if (y > b1) b1 = y;
        }
        if (p.accent) {
          const AR = L.accentRing;
          const cx = (a0 + a1) / 2;
          const cy = (b0 + b1) / 2;
          const rx = (a1 - a0) * AR.radius;
          const ry = (b1 - b0) * AR.radius;
          const N = AR.segments;
          const ring: Vec2[] = Array.from({ length: N }, (_, k) => [cx + rx * Math.cos((k / N) * TAU), cy + ry * Math.sin((k / N) * TAU)]);
          const r = screen(ring, true);
          cl.push(r, si, MODE.screen, op, [AR.width, AR.alpha * fa, 0, 1]);
          cm.push(r, si, MODE.screen, op, [AR.width, AR.hiddenAlpha * fa, 0, 1]);
          op++;
        }
        if (p.headTop) {
          const q = Pr.P(w.c[0], w.c[1], Sl.top);
          heads.push([q[0], q[1], (a1 - a0) / 2, (b1 - b0) / 2]);
        }
      }
    }
    if (Sl.isBottom && !isPlate) cl.push(it.outer, si, MODE.bottom, op++, [L.edge, L.edgeAlpha]);
  });
  if (op >= OPS) throw new Error("render: too many draw steps for one frame");
  return { slices, frame: cm, lines: cl, dyn: new Float32Array(dyn), dash: new Float32Array(dash), heads, ops: op };
}
