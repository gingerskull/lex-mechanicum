// The supports a stack can stand on (A20): the live shaft's housing behind the base (J2), pillow blocks for a shaft in
// plan or tilted (J10), and, from the router, the bridge over a dead axle's top (J1). Housing and blocks are written in
// the joint's own frame or on the base and placed like every other solid.
import { circle, type Vec2 } from "../core/geom";
import { H } from "../hardware/primitives";
import { marks } from "../hardware/solid";
import { HEADS, circlipInt } from "../hardware/tables";
import { FOOT, FOOT_PAST, bossR, footHalf, pillowWidth } from "../hardware/sub/pillow";
import { housingBearing } from "../hardware/sub/housing";
import { v3, type Vec3 } from "../kin/math";
import type { Solid3 } from "../solids/types";
import type { BuildCtx } from "./ctx";
import { MIN_GAP } from "./constants";
import { frameAlong, place, type Frame } from "./frames";
import { Local } from "./lib";
import { clearance, standFrame, unitAlong } from "./router";
import { projectAlong } from "./view";
import { worldManifold } from "./sweeps";

const ECC = 3;

/** The live shaft's cartridge behind the base, in the shaft's own frame (A9, F1, F2, F4). Returns the housing's lowest face. */
export function liveHousing(L: Local, o: { id: string; d: number; bb: number; eccentric?: boolean; joints: string[] }): { bottom: number; bearing: ReturnType<typeof housingBearing> } {
  const b = housingBearing(o.d);
  const top = o.eccentric ? o.bb - ECC : o.bb;
  const len = Math.max(22, 2 * b.B + 12);
  const z0 = top - len;
  const Rs = b.D / 2 + 4.5;
  const Rh = b.D / 2 + 8.5;
  const head = HEADS.socket[3]!;
  const sAng = [Math.PI / 2, Math.PI / 2 + (2 * Math.PI) / 3, Math.PI / 2 + (4 * Math.PI) / 3];
  const screwsAt = sAng.map((a): Vec2 => [Rs * Math.cos(a), Rs * Math.sin(a)]);
  const dowelsAt = [Math.PI / 6 + Math.PI / 2, Math.PI / 6 + Math.PI / 2 + Math.PI].map((a): Vec2 => [Rs * Math.cos(a), Rs * Math.sin(a)]);
  const id = o.id;
  L.add(
    H.plate(`${id}-housing`, H.disc(Rh), {
      name: `Bearing housing Ø${2 * Rh} x ${len}, screwed and dowelled to the base`,
      kind: "housing",
      z0,
      z1: top,
      holes: [H.disc(b.D / 2 + 0.15), ...screwsAt.map((p) => H.disc(1.7, ...p)), ...dowelsAt.map((p) => H.disc(1.5, ...p))],
      marks: marks("boreEntry", ...screwsAt.map((p) => H.disc(head.dk / 2 + 0.3, ...p))),
      why: "carries the live shaft in two bearings far apart, behind the base",
    }),
  );
  const lower: [number, number] = [z0 + 1, z0 + 1 + b.B];
  const upper: [number, number] = [top - 1 - b.B, top - 1];
  L.add(H.bearing(`${id}-hb0`, b, { z0: lower[0], z1: lower[1], closure: "seal", qty: 2 }));
  L.add(H.bearing(`${id}-hb1`, b, { z0: upper[0], z1: upper[1], closure: "seal", name: "" }));
  const c = circlipInt(b.D);
  const ww = 0.4;
  L.add(H.circlip(`${id}-hcl0`, b.D, { internal: true, z0: lower[1], z1: lower[1] + c.s, qty: 2 }));
  L.add(H.circlip(`${id}-hcl1`, b.D, { internal: true, z0: upper[0] - ww - c.s, z1: upper[0] - ww, name: "" }));
  L.add(H.waveWasher(`${id}-hww`, (b.d + b.D) / 2, b.D - 0.2, { z0: upper[0] - ww, z1: upper[0], why: "preloads the upper bearing so the shaft has no end float (F4)" }));
  const seat = z0 + 0.2 + head.k;
  screwsAt.forEach((p, k) =>
    L.add(H.screw(`${id}-hsc${k}`, "socket", 3, o.bb - seat + 4.5, { at: [p[0], p[1], 0], face: seat, dir: 1, ...(k ? { name: "", qty: 0 } : { qty: 3 }) })),
  );
  dowelsAt.forEach((p, k) => L.add(H.dowel(`${id}-hdw${k}`, 3, { at: [p[0], p[1], 0], z0: top - 6, z1: o.bb + 4, ...(k ? { name: "", qty: 0 } : { name: "Dowel pin Ø3 x 10 h6, housing to base", qty: 2 }) })));
  if (o.eccentric) {
    L.add(H.eccentric(`${id}-ecc`, o.d + 2, 2 * Rh - 10, 0.3, { z0: top, z1: o.bb, slots: sAng, slotR: Rs, why: "turned to set the mesh backlash, then clamped by the housing screws (F7)" }));
  }
  return { bottom: z0, bearing: b };
}

// ---- pillow blocks (J10)

export interface PillowOut {
  solids: Solid3[];
  /** Axial centres of the two blocks. */
  w: [number, number];
  /** The shaft's ends: the outer faces of the blocks and a little past. */
  shaft: [number, number];
  tried: number;
  moved: boolean;
  covers: string[];
  gap: number;
  /** Solid ids of each block's parts that locate the shaft, for F1 and F2. */
  serves: Record<string, string[]>;
}

interface BlockGeom {
  foot: Solid3;
  ped: Solid3;
  boss: Solid3;
}

/** The three castings of a block at axial position wb: foot plate, pedestal and boss. */
function blockGeom(ctx: BuildCtx, o: { id: string; f: Frame; d: number; live: boolean; wb: number; baseTop: number; first: boolean }): BlockGeom {
  const W = pillowWidth(o.d, o.live);
  const Rb = bossR(o.d, o.live);
  const half = footHalf(o.d, o.live);
  const b = o.live ? housingBearing(o.d) : null;
  const P = unitAlong(o.f, o.wb);
  const a = o.f.z;
  const st = standFrame(P, a, o.baseTop);
  const run = Math.hypot(a[0], a[1]);
  const hl = (W / 2) * run + Rb * Math.sqrt(Math.max(0, 1 - run * run)) + FOOT_PAST;
  const rect = (x: number, y: number): Vec2[] => [[-x, -y], [x, -y], [x, y], [-x, y]];
  const foot = place(
    st,
    H.plate(`${o.id}-foot`, rect(hl, half), {
      kind: "housing",
      role: "ground",
      name: o.first ? `Pillow block foot ${2 * half} x ${+(2 * hl).toFixed(1)} x ${FOOT}, screwed and dowelled to the base` : "",
      z0: 0,
      z1: FOOT,
      mat: "Cast iron EN-GJL-250",
      joints: [o.id],
      group: o.id,
      why: "carries the block on the base and takes its screws and dowels (F1)",
    }),
  )[0]!;
  const pedTop = Math.max(FOOT + 1, P[2] - o.baseTop);
  const ped = place(
    st,
    H.plate(`${o.id}-ped`, rect(Math.max(2, hl - FOOT_PAST), Rb), { kind: "housing", role: "ground", name: "", z0: FOOT, z1: pedTop, mat: "Cast iron EN-GJL-250", joints: [o.id], group: o.id }),
  )[0]!;
  const bf = frameAlong(unitAlong(o.f, o.wb - W / 2), a, st.x);
  const boss = place(
    bf,
    H.plate(`${o.id}`, H.disc(Rb), {
      kind: "housing",
      role: "ground",
      name: o.first ? `Pillow block, ${b ? `bored for a ${b.name ? `${b.name}-2RS` : "bearing"}` : `clamping the Ø${o.d} shaft`}` : "",
      z0: 0,
      z1: W,
      holes: [H.disc(b ? b.D / 2 + 0.15 : o.d / 2 + 0.02)],
      mat: "Cast iron EN-GJL-250",
      joints: [o.id],
      group: o.id,
      chamfer: 0.6,
      why: "holds the shaft's bearing at the shaft's height",
    }),
  )[0]!;
  void ctx;
  return { foot, ped, boss };
}

const geomList = (g: BlockGeom): Solid3[] => [g.foot, g.ped, g.boss];

/**
 * Two blocks for a shaft in plan or tilted: past either end of what the shaft carries, far apart (A9), or both behind it
 * where something sweeps past its far end; each routed against the sweeps (A19). The nearer end's block locates a live
 * shaft, the other floats (F2, F4).
 */
export function pillowBlocks(ctx: BuildCtx, o: { id: string; frame: Frame; d: number; live: boolean; lo: number; hi: number; baseTop: number; joints: string[] }): PillowOut {
  const W = pillowWidth(o.d, o.live);
  const gap = 3;
  const tryAt = (wb: number): boolean => {
    const g = blockGeom(ctx, { id: `${o.id}-t`, f: o.frame, d: o.d, live: o.live, wb, baseTop: o.baseTop, first: false });
    const c = clearance(ctx, geomList(g));
    return c >= MIN_GAP;
  };
  const below: number[] = [];
  const above: number[] = [];
  let tried = 0;
  for (let k = 0; k < 12 && below.length < 2; k++) {
    const wb = o.lo - W / 2 - gap - 2 * k;
    tried++;
    if (tryAt(wb)) below.push(wb);
    if (below.length === 1) break;
  }
  for (let k = 0; k < 12 && above.length < 2; k++) {
    const wb = o.hi + W / 2 + gap + 2 * k;
    tried++;
    if (tryAt(wb)) above.push(wb);
    if (above.length === 1) break;
  }
  let w: [number, number];
  let moved: boolean;
  if (below.length && above.length) {
    w = [below[0]!, above[0]!];
    moved = below[0]! < o.lo - W / 2 - gap - 1e-6 || above[0]! > o.hi + W / 2 + gap + 1e-6;
  } else {
    // both on the one side that clears, one block width apart
    const side = below.length ? -1 : 1;
    const w0 = (below[0] ?? above[0])!;
    if (w0 === undefined) throw new Error(`${o.id}: no place for a pillow block clears the sweeps`);
    const step = W + 4;
    w = side < 0 ? [w0, w0 - step] : [w0, w0 + step];
    moved = true;
  }
  const located = w[0] <= w[1] ? 0 : 1;
  const solids: Solid3[] = [];
  const serves: Record<string, string[]> = {};
  const serve = (f: string, ...ids: string[]) => ((serves[f] ??= []).push(...ids));
  const covers = new Set<string>();
  const b = o.live ? housingBearing(o.d) : null;
  w.forEach((wb, k) => {
    const id = `${o.id}-b${k}`;
    const first = k === 0;
    const g = blockGeom(ctx, { id, f: o.frame, d: o.d, live: o.live, wb, baseTop: o.baseTop, first });
    solids.push(...geomList(g));
    const L = new Local(o.frame, { joints: [...o.joints, id] });
    if (b) {
      L.add(H.bearing(`${id}-brg`, b, { z0: wb - b.B / 2, z1: wb + b.B / 2, closure: "seal", seat: k === located ? "circlip each side" : "floating", ...(first ? {} : { name: "" }) }));
      if (k === located) {
        const c = circlipInt(b.D);
        for (const [n, z] of [[0, wb - b.B / 2 - c.s], [1, wb + b.B / 2]] as const) L.add(H.circlip(`${id}-cl${n}`, b.D, { internal: true, z0: z, z1: z + c.s, ...(n || !first ? { name: "" } : {}) }));
        serve("F2", `${id}-cl0`, `${id}-cl1`);
        // two shaft collars against the inner race hold it both ways
        for (const [n, z0] of [[0, wb - W / 2 - 4], [1, wb + W / 2]] as const) L.add(H.collar(`${id}-col${n}`, o.d, o.d + 8, { z0, z1: z0 + 4 }));
        serve("F4", `${id}-col0`, `${id}-col1`);
      }
    } else {
      L.add(H.setScrew(`${id}-ss`, 4, { at: [0, o.d / 2 + 3, 0], outer: circle(2, 0, 0, 12), z0: wb - 2, z1: wb + 2, name: "Set screw M4 on a flat, clamps the dead shaft (F2, F3)" }));
      serve("F2", `${id}-ss`);
    }
    solids.push(...L.out());
    // two screws down through the foot into the base, two dowels on the other diagonal (F1)
    const P = unitAlong(o.frame, wb);
    const st = standFrame(P, o.frame.z, o.baseTop);
    const Rb = bossR(o.d, o.live);
    const sx = Rb + 4.5;
    const S = new Local(st, { joints: [id] });
    for (const [n, u] of [[0, -sx], [1, sx]] as const) {
      S.add(H.screw(`${id}-sc${n}`, "socket", 5, FOOT + 8, { at: [0, u, 0], face: FOOT, dir: -1, ...(n || !first ? { name: "", qty: 0 } : {}) }));
      S.add(H.dowel(`${id}-dw${n}`, 4, { at: [n ? -3 : 3, n ? u + 2.5 : u - 2.5, 0], z0: 0.5 - 6, z1: FOOT, ...(n || !first ? { name: "", qty: 0 } : { name: "Dowel pin Ø4 x 14 h6, block to base", qty: 2 }) }));
    }
    solids.push(...S.out());
    serve("F1", `${id}-dw0`, `${id}-dw1`);
    // what the block covers of the principle in the default view
    const m = geomList(g).map((s) => worldManifold(ctx.M, s));
    const dir = ctx.viewDir();
    for (const p of ctx.principle) {
      const sv = ctx.sweeps.of(p);
      if (!sv) continue;
      const pp = sv.project(dir);
      for (const q of m) {
        const pr = projectAlong(q, dir);
        const x = pr.intersect(pp);
        if (x.area() > 0.5) covers.add(p);
        x.delete();
        pr.delete();
      }
      pp.delete();
    }
    m.forEach((q) => q.delete());
  });
  const g0 = Math.min(...w) - W / 2;
  const g1 = Math.max(...w) + W / 2;
  const sorted = [...w].sort((a, b) => a - b);
  void v3;
  return { solids, w, shaft: [g0 - 4, g1 + 4], tried, moved, covers: [...covers], gap: MIN_GAP, serves: { ...serves, _span: [] }, ...{ sorted } } as PillowOut;
}

export type { Vec3 };
