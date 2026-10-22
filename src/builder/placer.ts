// The placement solver (A18): every axial position of the bodies, in place of layers, `dz` and `twin`.
//
// Bodies whose planes are parallel form a family and are stacked in slabs along their normal. Two bodies may share a
// slab when their outlines keep apart over the whole cycle (A10); bodies that touch by design (a gear mesh, a belt, a
// cam and its roller) share one by constraint. A body that sweeps over the pin of a site it is not a member of must
// lie wholly on one side of that site's stack (or the pin would run through it); that side decides how a fixed pin is
// held: a stub axle when something passes over it, a hung one when something passes under it. The solver finds the
// fewest slabs, then the fewest empty slots inside a stack, then the most clevises that fit without a new slab (A9).
import type { Vec2 } from "../core/geom";
import { v3, xf, type Vec3, type Xf } from "../kin/math";
import type { Kin } from "../kin/types";
import { HEADROOM, LATERAL, PITCH, RAIL_ZONE, SLAB_GAP, SLIDE_ROOM, THREAD_ROOM } from "./constants";
import { fromPlane, planeCoords, parallel, type Frame } from "./frames";
import { pointDist, ringDist } from "./planar";
import type { BodyGeom } from "./shapes";
import type { JointInfo, Site } from "./sites";

export interface Sampled {
  us: number[];
  /** Per body, its transform at each sample (reference configuration to now). */
  xfs: Map<string, Xf[]>;
}

export interface Clevis {
  site: string;
  /** The body whose end the clevis straddles. */
  host: string;
  /** The body that is built as a pair. */
  twin: string;
  /** The slab of the twin's second half. */
  slab: number;
}

export interface Pass {
  site: string;
  over: string[];
  under: string[];
}

export interface FamilyPlacement {
  /** The family's plane: origin on the lowest declared plane, z the normal. */
  frame: Frame;
  bodies: string[];
  slabs: number;
  /** Lower face of each slab along the normal, from the frame's origin, and its height. */
  w0: number[];
  h: number[];
}

export interface Placement {
  families: FamilyPlacement[];
  /** Body to [family, slab]. */
  slab: Map<string, [number, number]>;
  clevis: Clevis[];
  passes: Pass[];
  /** The most slabs in any family, and the same counted as millimetres of stack. */
  height: number;
  stackMm: number;
  /** The solver's reading of each site: which side the stack is held from. */
  held: Map<string, "both" | "base" | "bridge">;
  /** Bodies the solver could not place without a clash (kept apart in the order found). */
  conflicts: string[][];
  /** Families where a pin has parts passing on both sides of it: decided in the mechanism's issue (T12). */
  relaxed: string[][];
}

/** The outline of a body at one sample, in the plane coordinates of a family frame. */
function outlineAt(g: BodyGeom, X: Xf, fam: Frame): Vec2[] {
  return (g.plan ?? g.profile.outer).map((p) => {
    const q = planeCoords(fam, xf.apply(X, fromPlane(g.frame, p)));
    return q.uv;
  });
}

const HEAD_R = 8;

interface Node {
  ids: string[];
}

export function solvePlacement(kin: Kin, geoms: Map<string, BodyGeom>, sampled: Sampled, joints: JointInfo[], sites: Site[]): Placement {
  // a body no joint reaches stands at its own frame (a fixed plate, a port face): it takes no slab
  const joined = new Set(kin.joints.flatMap((j) => [j.a, j.b]));
  const ids = [...geoms.keys()].filter((id) => joined.has(id));
  // families by normal
  const famOf = new Map<string, number>();
  const famFrames: Frame[] = [];
  const famIds: string[][] = [];
  for (const id of ids) {
    const g = geoms.get(id)!;
    let k = famFrames.findIndex((f) => parallel(f.z, g.frame.z));
    if (k < 0) {
      k = famFrames.length;
      famFrames.push({ ...g.frame });
      famIds.push([]);
    }
    famOf.set(id, k);
    famIds[k]!.push(id);
  }
  // origin of a family on its lowest declared plane
  famFrames.forEach((f, k) => {
    let lo = Infinity;
    for (const id of famIds[k]!) lo = Math.min(lo, planeCoords(f, geoms.get(id)!.frame.o).w);
    f.o = fromPlane(f, [0, 0], lo);
  });

  const placement: Placement = { families: [], slab: new Map(), clevis: [], passes: [], height: 0, stackMm: 0, held: new Map(), conflicts: [], relaxed: [] };
  const sampleIdx = sampled.us.map((_, i) => i);

  famFrames.forEach((fam, k) => {
    const fid = famIds[k]!;
    // same-slab groups: bodies in contact by design
    const parent = new Map(fid.map((id) => [id, id]));
    const find = (x: string): string => (parent.get(x) === x ? x : (parent.set(x, find(parent.get(x)!)), parent.get(x)!));
    const contact = new Set<string>();
    const pairKey = (a: string, b: string) => (a < b ? `${a}|${b}` : `${b}|${a}`);
    for (const j of joints) {
      const t = j.joint.type;
      const planar = t === "gear-mesh" || t === "rolling" || t === "belt" || t === "cam-contact";
      if (!planar || !parent.has(j.a) || !parent.has(j.b)) continue;
      if (j.joint.crossed) continue;
      contact.add(pairKey(j.a, j.b));
      parent.set(find(j.a), find(j.b));
    }
    const nodes = new Map<string, Node>();
    for (const id of fid) {
      const r = find(id);
      if (!nodes.has(r)) nodes.set(r, { ids: [] });
      nodes.get(r)!.ids.push(id);
    }
    const nodeIds = [...nodes.keys()];
    const nodeOf = (id: string) => find(id);
    const N = nodeIds.length;
    const idx = new Map(nodeIds.map((r, i) => [r, i]));

    // outlines per sample
    const rings = new Map<string, Vec2[][]>();
    for (const id of fid) {
      const g = geoms.get(id)!;
      const xs = sampled.xfs.get(id) ?? [];
      rings.set(id, sampleIdx.map((i) => outlineAt(g, xs[i] ?? xf.id(), fam)));
    }

    // clash graph between nodes
    const clash: boolean[][] = Array.from({ length: N }, () => new Array<boolean>(N).fill(false));
    for (let a = 0; a < fid.length; a++) {
      for (let b = a + 1; b < fid.length; b++) {
        const A = fid[a]!;
        const B = fid[b]!;
        if (contact.has(pairKey(A, B)) || nodeOf(A) === nodeOf(B)) continue;
        let hit = false;
        for (const i of sampleIdx) {
          if (ringDist(rings.get(A)![i]!, rings.get(B)![i]!, LATERAL) <= LATERAL) {
            hit = true;
            break;
          }
        }
        if (hit) {
          clash[idx.get(nodeOf(A))!]![idx.get(nodeOf(B))!] = true;
          clash[idx.get(nodeOf(B))!]![idx.get(nodeOf(A))!] = true;
        }
      }
    }
    // a slider on the ground runs between rails, a gib and end stops that stand beside and past its travel (J5): a body
    // that sweeps over that zone cannot share the slider's slab
    for (const j of kin.joints) {
      if (j.type !== "prismatic" || (j.a !== "ground" && j.b !== "ground")) continue;
      const sl = j.a === "ground" ? j.b : j.a;
      if (!fid.includes(sl)) continue;
      const ax = planeCoords(fam, v3.add(fam.o, (j.axis as number[]).map(Number) as Vec3)).uv;
      const L = Math.hypot(ax[0], ax[1]);
      if (L < 1e-6) continue;
      const dx = ax[0] / L, dy = ax[1] / L;
      let s0 = Infinity, s1 = -Infinity, t0 = Infinity, t1 = -Infinity;
      for (const ring of rings.get(sl)!)
        for (const [x, y] of ring) {
          const sv = x * dx + y * dy, tv = -x * dy + y * dx;
          s0 = Math.min(s0, sv); s1 = Math.max(s1, sv); t0 = Math.min(t0, tv); t1 = Math.max(t1, tv);
        }
      const [S0, S1, T0, T1] = [s0 - RAIL_ZONE.along, s1 + RAIL_ZONE.along, t0 - RAIL_ZONE.across, t1 + RAIL_ZONE.across];
      const zone: Vec2[] = [[S0, T0], [S1, T0], [S1, T1], [S0, T1]].map(([sv, tv]) => [sv! * dx - tv! * dy, sv! * dy + tv! * dx]);
      for (const id of fid) {
        if (id === sl || nodeOf(id) === nodeOf(sl) || kin.joints.some((q) => (q.a === id && q.b === sl) || (q.b === id && q.a === sl))) continue;
        if (sampleIdx.some((i) => ringDist(zone, rings.get(id)![i]!, LATERAL) <= LATERAL)) {
          const a = idx.get(nodeOf(id))!, b = idx.get(nodeOf(sl))!;
          clash[a]![b] = clash[b]![a] = true;
        }
      }
    }
    // bodies on one pin site share its column: they clash even when a boss is missing
    const famSites = sites.filter((s) => parallel(s.axis, fam.z) && s.bodies.some((b) => parent.has(b)));
    for (const s of famSites) {
      const inFam = s.bodies.filter((b) => parent.has(b));
      for (let a = 0; a < inFam.length; a++)
        for (let b = a + 1; b < inFam.length; b++) {
          const i = idx.get(nodeOf(inFam[a]!))!;
          const j = idx.get(nodeOf(inFam[b]!))!;
          if (i !== j) clash[i]![j] = clash[j]![i] = true;
        }
    }

    // passers: a non-member whose outline reaches the pin of a site
    interface SiteC {
      site: Site;
      members: number[];
      passers: number[];
    }
    const siteCs: SiteC[] = [];
    for (const s of famSites) {
      const members = [...new Set(s.bodies.filter((b) => parent.has(b)).map((b) => idx.get(nodeOf(b))!))];
      if (!members.length) continue;
      const passers = new Set<number>();
      for (const id of fid) {
        if (s.bodies.includes(id)) continue;
        const n = idx.get(nodeOf(id))!;
        if (members.includes(n)) continue;
        for (const i of sampleIdx) {
          // the pin rides its first member (a ground site stays put)
          const carrier = s.bodies[0];
          const X = s.fixed || !carrier ? xf.id() : (sampled.xfs.get(carrier)?.[i] ?? xf.id());
          const p = planeCoords(fam, xf.apply(X, s.at)).uv;
          if (pointDist(rings.get(id)![i]!, p[0], p[1]) < HEAD_R + LATERAL) {
            passers.add(n);
            break;
          }
        }
      }
      siteCs.push({ site: s, members, passers: [...passers] });
    }

    // thickness of each node (a slab is as high as the thickest body in it)
    const thick = nodeIds.map((r) => Math.max(...nodes.get(r)!.ids.map((id) => geoms.get(id)!.thick)));

    // bodies the record lays above others: [upper node, lower node]
    const aboves: [number, number][] = [];
    for (const b of kin.bodies) for (const u of b.above ?? []) if (idx.has(nodeOf(b.id)) && idx.has(nodeOf(u))) aboves.push([idx.get(nodeOf(b.id))!, idx.get(nodeOf(u))!]);
    const orderOk = (assign: number[]) => aboves.every(([a, b]) => assign[a]! < 0 || assign[b]! < 0 || assign[a]! > assign[b]!);

    // ---- search
    const order = [...Array(N).keys()].sort((a, b) => clash[b]!.filter(Boolean).length - clash[a]!.filter(Boolean).length || a - b);
    const lb = Math.max(1, cliqueBound(clash));
    type Best = { assign: number[]; cost: number[] };
    // sliders on the ground run on rails on the base: they want the lowest slab, with what drives them above (J5)
    const grounded = [...new Set(kin.joints.filter((j) => j.type === "prismatic" && (j.a === "ground" || j.b === "ground")).map((j) => (j.a === "ground" ? j.b : j.a)).filter((b) => fid.includes(b)).map((b) => idx.get(nodeOf(b))!))];
    const limit = N;
    let budget = 1_500_000;
    // strict: every passer on one side of its pin; relaxed: a pin with parts passing on both sides is allowed (it needs a
    // different construction, decided in that mechanism's issue, T12)
    const attempt = (relax: boolean): Best | null => {
      let found: Best | null = null;
      for (let h = lb; h <= limit && !found && budget > 0; h++) {
        const assign = new Array<number>(N).fill(-1);
        const leaf = () => {
          if (!relax && !sidesOk(assign, siteCs)) return;
          const spacers = siteCs.reduce((t, c) => {
            const s = c.members.map((m) => assign[m]!);
            return t + (Math.max(...s) - Math.min(...s) + 1 - new Set(s).size);
          }, 0);
          const picks = clevisPicks(assign, siteCs, clash, h, nodeIds, nodes);
          // a fixed pin held from a bridge only (something passes under it) is the last resort
          const hung = siteCs.reduce((t, c) => t + (c.site.fixed && c.passers.some((p) => assign[p]! < Math.min(...c.members.map((m) => assign[m]!))) ? 1 : 0), 0);
          const raised = grounded.reduce((t, n) => t + assign[n]!, 0);
          const cost = [spacers, hung, raised, -picks.length];
          const f = found;
          const d = f ? cost.findIndex((c, i) => c !== f.cost[i]) : -1;
          const less = !f || (d >= 0 && cost[d]! < f.cost[d]!);
          if (less) found = { assign: assign.slice(), cost };
        };
        const dfs = (k: number): void => {
          if (budget-- <= 0) return;
          if (k === N) return leaf();
          const v = order[k]!;
          // slab labels are not interchangeable: a passer cares which side of a stack it is on, and a live shaft stands on the base
          for (let s = 0; s < h; s++) {
            if (clash[v]!.some((c, u) => c && assign[u] === s)) continue;
            assign[v] = s;
            if (orderOk(assign) && (relax || passOk(assign, siteCs))) dfs(k + 1);
            assign[v] = -1;
            const f = found as Best | null;
            if (f && f.cost[0] === 0 && f.cost[1] === 0 && f.cost[2] === 0 && f.cost[3]! <= -clevisCap(siteCs)) return;
          }
        };
        dfs(0);
      }
      return found;
    };
    let best: Best | null = attempt(false);
    if (!best) {
      budget = 1_500_000;
      best = attempt(true);
      if (best) placement.relaxed.push(fid);
    }
    if (!best) {
      // first fit on the clash graph alone: the search gave out (a tangle of parts all passing each other)
      const assign = new Array<number>(N).fill(-1);
      for (const v of order) {
        let s = 0;
        while (clash[v]!.some((c, u) => c && assign[u] === s)) s++;
        assign[v] = s;
      }
      best = { assign, cost: [0, 0, 0, 0] };
      placement.conflicts.push(fid);
    }
    const assign = (best as { assign: number[] }).assign;
    const slabs = Math.max(...assign) + 1;
    // slab geometry
    const hts = new Array<number>(slabs).fill(0);
    assign.forEach((s, n) => (hts[s] = Math.max(hts[s]!, thick[n]!)));
    // the gap above a slab: a plate right over a site's pin needs the head of the bolt under it (the headroom of A13)
    const gapAfter = new Array<number>(slabs).fill(SLAB_GAP);
    for (const c of siteCs) {
      const top = Math.max(...c.members.map((m) => assign[m]!));
      if (c.passers.some((p) => assign[p] === top + 1) && top + 1 < slabs) gapAfter[top] = Math.max(gapAfter[top]!, HEADROOM);
      // a moving pin's thread end runs under its first part: a plate right under it needs the thread's length
      const low = Math.min(...c.members.map((m) => assign[m]!));
      if (!c.site.fixed && low > 0 && c.passers.some((p) => assign[p] === low - 1)) gapAfter[low - 1] = Math.max(gapAfter[low - 1]!, THREAD_ROOM);
    }
    // a slider on the ground runs between rails and under a keeper that stand above its top (J5): the slab above it
    // keeps clear of them
    for (const j of kin.joints) {
      if (j.type !== "prismatic" || (j.a !== "ground" && j.b !== "ground")) continue;
      const sl = j.a === "ground" ? j.b : j.a;
      const n = idx.get(nodeOf(sl));
      if (n === undefined || !fid.includes(sl)) continue;
      const sk = assign[n]!;
      if (sk + 1 < slabs) gapAfter[sk] = Math.max(gapAfter[sk]!, SLIDE_ROOM);
    }
    const w0: number[] = [];
    let w = 0;
    for (let s = 0; s < slabs; s++) {
      w0.push(w);
      w += hts[s]! + gapAfter[s]!;
    }
    placement.families.push({ frame: fam, bodies: fid, slabs, w0, h: hts });
    for (const id of fid) placement.slab.set(id, [k, assign[idx.get(nodeOf(id))!]!]);
    for (const c of clevisPicks(assign, siteCs, clash, slabs, nodeIds, nodes)) {
      const host = nodes.get(nodeIds[c.host]!)!.ids[0]!;
      const twin = nodes.get(nodeIds[c.twin]!)!.ids[0]!;
      placement.clevis.push({ site: c.site, host, twin, slab: c.slab });
    }
    for (const c of siteCs) {
      const lo = Math.min(...c.members.map((m) => assign[m]!));
      const over: string[] = [];
      const under: string[] = [];
      for (const p of c.passers) {
        const names = nodes.get(nodeIds[p]!)!.ids;
        (assign[p]! > lo ? over : under).push(...names);
      }
      placement.passes.push({ site: c.site.id, over, under });
      placement.held.set(c.site.id, over.length && !c.site.fixed ? "both" : !c.site.fixed ? "both" : over.length ? "base" : under.length ? "bridge" : "both");
    }
  });

  placement.height = Math.max(0, ...placement.families.map((f) => f.slabs));
  placement.stackMm = Math.max(0, ...placement.families.map((f) => f.w0[f.slabs - 1]! + f.h[f.slabs - 1]!));
  void PITCH;
  void v3;
  return placement;
}

/** Slab range of a body for the solids it builds: along the family's normal, from the frame's origin. */
export function slabRange(p: Placement, id: string): { fam: FamilyPlacement; w0: number; w1: number } | null {
  const s = p.slab.get(id);
  if (!s) return null;
  const fam = p.families[s[0]]!;
  return { fam, w0: fam.w0[s[1]]!, w1: fam.w0[s[1]]! + fam.h[s[1]]! };
}

function cliqueBound(clash: boolean[][]): number {
  // greedy clique: a lower bound on the slabs
  const N = clash.length;
  let best = 1;
  for (let s = 0; s < N; s++) {
    const cl = [s];
    for (let v = 0; v < N; v++) if (v !== s && cl.every((u) => clash[u]![v])) cl.push(v);
    best = Math.max(best, cl.length);
  }
  return best;
}

interface SiteConstraint {
  site: Site;
  members: number[];
  passers: number[];
}

/** No passer inside the stack range of its site (checked on what is assigned so far). */
function passOk(assign: number[], cs: SiteConstraint[]): boolean {
  for (const c of cs) {
    const m = c.members.map((x) => assign[x]!).filter((s) => s >= 0);
    if (!m.length) continue;
    const lo = Math.min(...m);
    const hi = Math.max(...m);
    for (const p of c.passers) {
      const s = assign[p]!;
      if (s >= lo && s >= 0 && s <= hi) return false;
    }
  }
  return true;
}

/** All passers of a site on one side of it. */
function sidesOk(assign: number[], cs: SiteConstraint[]): boolean {
  for (const c of cs) {
    if (!c.passers.length) continue;
    const lo = Math.min(...c.members.map((x) => assign[x]!));
    const above = c.passers.map((p) => assign[p]! > lo);
    if (above.some((a) => a) && above.some((a) => !a)) return false;
    // a live shaft stands on its housing behind the base: nothing may pass between the base and its first part
    if (c.site.fixed && c.site.live && above.some((a) => !a)) return false;

  }
  return true;
}

const clevisCap = (cs: SiteConstraint[]): number => cs.filter((c) => c.members.length === 2).length;

interface ClevisPick {
  site: string;
  host: number;
  twin: number;
  slab: number;
}

/**
 * Clevises that fit the slabs as they are: at a site of exactly two bodies one slab apart, the one body is built as a
 * pair that straddles the other (A9), when the slab on the far side exists, is free of anything that would meet the
 * pair, and puts no passer inside either pin stack.
 */
function clevisPicks(assign: number[], cs: SiteConstraint[], clash: boolean[][], H: number, nodeIds: string[], nodes: Map<string, Node>): ClevisPick[] {
  void nodeIds;
  void nodes;
  const picks: ClevisPick[] = [];
  const twinned = new Set<number>();
  for (const c of cs) {
    if (c.members.length !== 2 || c.site.joints.length > 2) continue;
    const [m0, m1] = c.members as [number, number];
    for (const [host, twin] of [[m0, m1], [m1, m0]] as const) {
      if (twinned.has(twin) || Math.abs(assign[host]! - assign[twin]!) !== 1) continue;
      const t = 2 * assign[host]! - assign[twin]!;
      if (t < 0 || t >= H) continue;
      // nothing already there meets the twin
      if (assign.some((s, u) => s === t && u !== twin && clash[twin]![u])) continue;
      // the twin's second half is a member of every site the twin is in: no passer inside that stack
      const trial = assign.slice();
      const bad = cs.some((q) => {
        if (!q.members.includes(twin)) return false;
        const ms = q.members.map((x) => (x === twin ? [trial[x]!, t] : [trial[x]!])).flat();
        const lo = Math.min(...ms);
        const hi = Math.max(...ms);
        return q.passers.some((p) => trial[p]! >= lo && trial[p]! <= hi);
      });
      if (bad) continue;
      picks.push({ site: c.site.id, host, twin, slab: t });
      twinned.add(twin);
      break;
    }
  }
  return picks;
}
