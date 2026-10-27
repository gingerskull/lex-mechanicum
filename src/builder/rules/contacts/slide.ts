// Slide (J5): a slider between a dowelled reference rail and a gibbed rail under a keeper on ground risers, with wipers,
// a nipple and end stops; a block in a moving link's slot; a collar on a turning shaft; a stem in a guide bushing.
import { circle, roundRect, type Vec2 } from "../../../core/geom";
import { H } from "../../../hardware/primitives";
import { fromPlane, planeCoords } from "../../frames";
import type { BuildCtx } from "../../ctx";
import { MIN_GAP } from "../../constants";
import { type Contact, cutRing, localAt, stadium } from "../../contact";
import { Local, Local as LocalFrame, titleOf } from "../../lib";
import type { Rule } from "../types";
import { v3 } from "../../../kin/math";
import type { Solid3 } from "../../../solids/types";
import { worldManifold } from "../../sweeps";
import { type KitBuild, baseZ, bodyOf, contactRule } from "./kit";

/** Extent of a body's part in a contact's frame: [x0, x1, y0, y1]. */
function extentIn(ctx: BuildCtx, c: Contact, body: string, whole = false): [number, number, number, number] {
  const part = ctx.parts.get(body);
  if (!part) return [-20, 20, -10, 10];
  // a body that is more than its sliding block (a crosshead with an arm) names the block: [length, width] about the joint
  const blk = (ctx.kin.bodies.find((b) => b.id === body)?.shape as { slider?: unknown } | undefined)?.slider;
  if (!whole && Array.isArray(blk) && blk.length >= 2) return [-Number(blk[0]) / 2, Number(blk[0]) / 2, -Number(blk[1]) / 2, Number(blk[1]) / 2];
  const p0 = planeCoords(c.frame, c.at).uv;
  const pts = part.profile.outer.map((q) => planeCoords(c.frame, fromPlane(part.frame, q, 0)).uv);
  const xs = pts.map((q) => q[0] - p0[0]);
  const ys = pts.map((q) => q[1] - p0[1]);
  return [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
}

/** A collar on a turning shaft, sliding along it: a bronze bushing pressed into its bore, running on the shaft (J5). */
function sleeveOnShaft(ctx: BuildCtx, c: Contact, slider: string, host: string): ReturnType<KitBuild> {
  const part = ctx.parts.get(slider);
  const d = Number((ctx.kin.bodies.find((b) => b.id === host)?.shape as { diameter?: unknown } | undefined)?.diameter ?? 16);
  if (!part || part.op.op !== "extrude") return { note: `${titleOf(c.id)}: ${titleOf(slider)} slides on ${titleOf(host)}.`, serves: {} };
  const h = part.op.h;
  const D = d + 4;
  part.profile.holes = [circle(D / 2 + 0.05, 0, 0, 40).reverse()];
  const L = new Local(part.frame, { joints: [c.id] });
  L.add(H.bushing(`${c.id}-bush`, d, D, { body: slider, z0: 0, z1: h, name: `Bronze bushing ${d}x${D}x${h}`, mat: "Bronze CuSn8, oil-impregnated" }));
  ctx.add(L.out());
  return {
    note: `${titleOf(c.id)}: ${titleOf(slider)} slides on the Ø${d} ${titleOf(host)} in a bronze bushing; it turns with the shaft because its links ride the shaft's arms.`,
    serves: { F2: [`${c.id}-bush`] },
  };
}

/** True when every one of the solids clears the sweeps of the given bodies by the least gap. */
function clearOf(ctx: BuildCtx, solids: Solid3[], bodies: string[]): boolean {
  for (const s of solids) {
    const m = worldManifold(ctx.M, s);
    const g = ctx.sweeps.gap(m, bodies, MIN_GAP + 1);
    m.delete();
    if (g < MIN_GAP) return false;
  }
  return true;
}

/**
 * A block sliding in a slot of a moving link (the swinging lever of a crank-shaper or a Whitworth gear): the slot is the
 * guide, cut over the block's run with room for a hardened wear strip in each wall.
 */
function blockInSlot(ctx: BuildCtx, c: Contact, L: Local, slider: string, host: string, e: [number, number, number, number], run: [number, number]): ReturnType<KitBuild> {
  const id = c.id;
  const sw = (e[3] - e[2]) / 2 + 0.2 + 1.5;
  const x0 = run[0] + e[0];
  const x1 = run[1] + e[1];
  const part = ctx.parts.get(host);
  if (part) {
    // a slot the link's own shape drew on the run gives way to the one cut here
    const p0 = planeCoords(c.frame, c.at).uv;
    const onRun = (h: Vec2[]) => {
      const q = h.reduce<Vec2>((a, b) => [a[0] + b[0] / h.length, a[1] + b[1] / h.length], [0, 0]);
      const w = planeCoords(c.frame, fromPlane(part.frame, q, 0)).uv;
      const u = w[0] - p0[0];
      const v = w[1] - p0[1];
      return u > x0 - 2 && u < x1 + 2 && Math.abs(v) < sw;
    };
    part.profile.holes = part.profile.holes.filter((h) => !onRun(h));
    cutRing(ctx, c, part.id, stadium(x0, x1, sw));
  }
  const ext = ctx.extent(host);
  const zb: [number, number] = c.zb ?? (ext ? [ext.w0, ext.w1] : [-3, 3]);
  const strips: string[] = [];
  for (const [k, y] of [[0, sw - 0.75], [1, -(sw - 0.75)]] as const) {
    const wall: Vec2[] = [[x0, y - 0.75], [x1, y - 0.75], [x1, y + 0.75], [x0, y + 0.75]];
    L.add(H.wearStrip(`${id}-wear${k}`, wall, { body: host, z0: zb[0] + 0.5, z1: zb[1] - 0.5, ...(k ? { name: "" } : { qty: 2 }) }));
    strips.push(`${id}-wear${k}`);
  }
  const blk = ctx.parts.get(slider);
  if (blk) blk.slides = [...(blk.slides ?? []), ...strips, ...(part ? [part.id] : [])];
  return {
    serves: { M14: strips },
    note: `${titleOf(id)}: the block slides in the link's slot over its ${(c.run[1] - c.run[0]).toFixed(0)} mm run, on a hardened wear strip in each wall; the slot is the guide, so nothing is fixed to the base.`,
  };
}

/**
 * A stem that slides along its own axis (a `shaft` on a prismatic joint, a desmodromic's follower): a bronze bushing in a
 * guide block round the stem, the block on four standoffs from the base, clear of what the stem carries. The block
 * stands at the stem's `guide` ([z0, z1] along its axis from its frame origin), else at the middle of its free length.
 */
function stemGuide(ctx: BuildCtx, c: Contact, id: string, stem: string): ReturnType<KitBuild> {
  const g = ctx.geoms.get(stem)!;
  const ax = g.frame.z;
  const d = Number(g.shape.diameter ?? 8);
  const gv = Array.isArray(g.shape.guide) ? (g.shape.guide as number[]) : null;
  const place = Number(g.shape.place ?? 0);
  const len = Number(g.shape.length ?? 60);
  const [z0, z1] = gv ? [gv[0]!, gv[1]!] : [place + len * 0.3, place + len * 0.55];
  const Lg = new LocalFrame({ o: g.frame.o, x: g.frame.x, z: ax }, { joints: [id] });
  const D = d + 6;
  const half = Number(g.shape.guideHalf ?? 25);
  Lg.add(H.bushing(`${id}-bush`, d + 0.05, D, { body: "ground", z0, z1, name: `Guide bushing ${d}x${D}x${z1 - z0}, sintered bronze, oil-impregnated` }));
  Lg.add(H.plate(`${id}-block`, roundRect(-half, -half, half, half, 4), { body: "ground", kind: "plate", role: "ground", name: "Guide block, bored for the bushing", z0: z0 + 2, z1: z1 - 2, holes: [circle(D / 2 + 0.05, 0, 0, 36)], mat: "Aluminium 6061-T6, anodised", joints: [id] }));
  const baseTop = ctx.base ? ctx.base.top - g.frame.o[2] : -4;
  const legs: string[] = [];
  for (const [k, x, y] of [[0, -1, -1], [1, 1, -1], [2, 1, 1], [3, -1, 1]] as const) {
    Lg.add(H.standoff(`${id}-leg${k}`, { body: "ground", at: [x * (half - 6), y * (half - 6), 0], z0: baseTop, z1: z0 + 2, ...(k ? { name: "", qty: 0 } : { qty: 4, name: "Standoff Ø10, M5, carries the guide block" }) }));
    legs.push(`${id}-leg${k}`);
  }
  ctx.add(Lg.out());
  void c;
  return { serves: { F1: legs, F8: [`${id}-bush`] }, note: `${titleOf(id)}: the stem in an oil-impregnated bronze bushing, in a guide block on four standoffs from the base.` };
}

/**
 * A slider's declared guide length (`shape.guide` [s0, s1], mm along the slide's own axis from the body's frame origin)
 * in a contact's frame, or null.
 */
function guideIn(ctx: BuildCtx, c: Contact, body: string): [number, number] | null {
  const gd = ctx.geoms.get(body);
  const gv = gd?.shape.guide;
  if (!gd || !Array.isArray(gv) || gv.length < 2) return null;
  const ax = c.ji.r.axis;
  const p0 = planeCoords(c.frame, c.at).uv;
  const xs = [Number(gv[0]), Number(gv[1])].map((x) => planeCoords(c.frame, v3.add(gd.frame.o, v3.mul(ax, x))).uv[0] - p0[0]);
  return [Math.min(...xs), Math.max(...xs)];
}

const j5 = contactRule({
  id: "j5-slide",
  ids: ["J5", "F5", "F7", "A6"],
  fixture: "kin:sliderCrank",
  kits: ["J5"],
  // a load's guide rod (a tackle's hook on its line) is built with the rope (src/builder/flexible.ts)
  // a sheave half sliding on its shaft and the shift fork's carriage are built by the CVT kit (src/builder/cvt.ts)
  skip: (ji, ctx) => {
    const r = ji.joint as unknown as Record<string, unknown>;
    // (and an integrator's carriage by its kit, src/builder/integrator.ts)
    const fork = [ji.a, ji.b].some((b) => {
      const sh = ctx.kin.bodies.find((q) => q.id === b)?.shape as Record<string, unknown> | undefined;
      return sh?.type === "fork" || (sh?.type === "slider" && !!sh.cage);
    });
    return !!r.rod || !!r.spline || fork;
  },
  build(ctx, c, L) {
    const id = c.id;
    const slider = c.a === "ground" ? c.b : c.a;
    const host = slider === c.a ? c.b : c.a;
    // a collar sliding on a turning shaft (a governor's sleeve): the shaft is its guide, a bushing in its bore
    if (host !== "ground" && String(ctx.kin.bodies.find((b) => b.id === host)?.shape?.type) === "shaft") return sleeveOnShaft(ctx, c, slider, host);
    if (String(ctx.geoms.get(slider)?.shape.type) === "shaft") return stemGuide(ctx, c, id, slider);
    const e = extentIn(ctx, c, slider);
    // the contact's run is a's travel against b: the slider's own travel when it is a, reversed when it is b
    const trv: [number, number] = slider === c.a ? c.run : [-c.run[1], -c.run[0]];
    if (host !== "ground" && ctx.parts.has(host)) return blockInSlot(ctx, c, L, slider, host, e, trv);
    // a slider whose part reaches past its guide (a cam follower's stem down to its roller) is held over its `guide`
    // only ([x0, x1] along its own frame x): rails, stops and wipers stay on that length, off what the rest reaches over
    const gd = guideIn(ctx, c, slider);
    const reachLo = gd ? e[0] < gd[0] - 0.5 : false;
    const reachHi = gd ? e[1] > gd[1] + 0.5 : false;
    if (gd) [e[0], e[1]] = [Math.max(e[0], gd[0]), Math.min(e[1], gd[1])];
    const zs = ctx.extent(slider);
    if (!zs) return;
    const w0 = zs.w0;
    // the slider's own thickness: its slab may be taller (a split part beside it)
    const sp = ctx.parts.get(slider);
    const w1 = sp && sp.op.op === "extrude" ? Math.min(zs.w1, w0 + sp.op.h) : zs.w1;
    const Ls = e[1] - e[0];
    const hostBody = bodyOf(ctx, host);
    // the rails stand flush with the slider's top and a thin keeper laps it, so a part pinned over the slider passes clear
    const rh = w1 - w0;
    const KT = 2;
    const gap = 3;
    const others = ctx.sweeps.moving().filter((m) => m !== slider);
    const baseTop = baseZ(ctx, c);
    const lo = trv[0] + e[0];
    const hi = trv[1] + e[1];
    // a side of the slide, +1 or -1 across it: the slider's edge there and a distance out from it
    const edge = (s: number) => (s > 0 ? e[3] : e[2]);
    const out = (s: number, d: number) => edge(s) + s * d;
    // a body that reaches past its block on one side (a crosshead's arm) runs there on its riser's lip alone: a rail
    // would stand in the arm's way. The gibbed rail and its keeper go on the other side.
    const full = extentIn(ctx, c, slider, true);
    // a rack is guided from its back: its toothed side stays open for the pinion (no rail there), which holds it against
    // the gibbed rail on the other side
    const rack = String(ctx.kin.bodies.find((b) => b.id === slider)?.shape?.type) === "rack";
    const meshAt = rack ? ctx.kin.joints.find((j) => j.type === "gear-mesh" && (j.a === slider || j.b === slider)) : undefined;
    const teeth = meshAt ? Math.sign(planeCoords(c.frame, ctx.S.joints.get(meshAt.id)!.at).uv[1] - planeCoords(c.frame, c.at).uv[1] - (e[2] + e[3]) / 2) : 0;
    const armSide = teeth || (full[3] > e[3] + 1 ? 1 : full[2] < e[2] - 1 ? -1 : 0);
    const gs = armSide > 0 ? -1 : armSide < 0 ? 1 : -1;
    const rs = -gs;
    const railOff = (s: number) => 3.5 + 0.5 + (s === gs ? gap : 0);
    const sides = [rs, gs].filter((s) => s !== armSide);
    const railRect = (s: number, a: number, b: number) => roundRect(a, Math.min(out(s, railOff(s) - 3.5), out(s, railOff(s) + 3.5)), b, Math.max(out(s, railOff(s) - 3.5), out(s, railOff(s) + 3.5)), 3.5);
    // a riser runs under its rail (or under the slider's edge alone) and laps 1 mm under the slider, the way it runs on
    const riserRect = (s: number, a: number, b: number) => {
      const y0 = out(s, -1);
      const y1 = out(s, s === armSide ? 4.5 : railOff(s) + 6);
      return roundRect(a, Math.min(y0, y1), b, Math.max(y0, y1), 1);
    };
    const one = (make: (T: Local) => void): Solid3[] => {
      const T = localAt(ctx, c);
      make(T);
      return T.out();
    };
    const railFor = (s: number, a: number, b: number) => one((T) => T.add(H.plate(`${id}-rail`, railRect(s, a, b), { body: hostBody, kind: "plate", role: "ground", z0: w0, z1: w0 + rh })));
    const riserFor = (s: number, a: number, b: number) => one((T) => T.add(H.plate(`${id}-riser`, riserRect(s, a, b), { body: hostBody, kind: "plate", role: "ground", z0: baseTop, z1: w0 })));
    const risen = w0 - baseTop > 0.5;
    // the rails run 10 mm past the slider's travel at each end, less where another part sweeps by (a crank turning past
    // the near end), down to half a slider short of its extreme (it overhangs the ways there), each side on its own;
    // judged on a slider's length of the rail's end as it would be built
    const margins = [10, 7, 4, 2, 0, -Ls / 8, -Ls / 4, -Ls / 3, -Ls / 2];
    const chunk = Math.max(12, Ls);
    const railEnds = new Map<number, [number, number]>();
    for (const s of sides) {
      const a = margins.find((m) => clearOf(ctx, railFor(s, lo - m, lo - m + chunk), others));
      const b = margins.find((m) => clearOf(ctx, railFor(s, hi + m - chunk, hi + m), others));
      railEnds.set(s, [lo - (a ?? margins[margins.length - 1]!), hi + (b ?? margins[margins.length - 1]!)]);
    }
    const span = (s: number): [number, number] => railEnds.get(s) ?? [lo - 4, hi + 4];
    // a riser keeps at least 20 mm under its rail (the rail cantilevers past it toward a sweep)
    const riserEnds = new Map<number, [number, number]>();
    for (const s of [rs, gs]) {
      const [a, b] = span(s);
      const steps = [0, 3, 6, 10, 15, 20, 30, 40, 55, 70, 90, 120];
      const cut = (from: number, dir: 1 | -1, limit: number) => steps.filter((d) => d <= limit).find((d) => clearOf(ctx, riserFor(s, dir > 0 ? from + d : from - d - 4, dir > 0 ? from + d + 4 : from - d), others));
      const da = cut(a, 1, b - a - 20) ?? 0;
      const db = cut(b, -1, b - a - 20 - da) ?? 0;
      riserEnds.set(s, [a + da, b - db]);
    }
    const [g0, g1] = span(gs);
    const run = g1 - g0;
    const x0 = Math.max(...sides.map((s) => span(s)[0]));
    const x1 = Math.min(...sides.map((s) => span(s)[1]));
    // the reference rail (plain, dowelled) and the gibbed rail with its keeper (F1, F2, F7)
    const ways: string[] = [];
    for (const s of [rs, gs]) {
      const k = s === rs ? 0 : 1;
      if (s !== armSide) {
        const [a, b] = span(s);
        L.add(H.plate(`${id}-rail${k}`, railRect(s, a, b), { body: hostBody, kind: "plate", role: "ground", name: k ? "Gibbed slide rail" : "Reference slide rail, dowelled", z0: w0, z1: w0 + rh, joints: [id], mat: "Steel C45, ground" }));
        ways.push(`${id}-rail${k}`);
      }
      // a rack's toothed side stays open down to the base: the pinion runs there
      if (risen && !(teeth && s === armSide)) {
        const [ra, rb] = riserEnds.get(s)!;
        L.add(H.plate(`${id}-riser${k}`, riserRect(s, ra, rb), { body: hostBody, kind: "plate", role: "ground", name: "Ground steel riser", z0: baseTop, z1: w0, mat: "Steel C45, ground" }));
        ways.push(`${id}-riser${k}`);
      }
    }
    // a rack rides on a hardened strip on a ground way under its back half instead (M14)
    if (teeth) {
      const [ra, rb] = risen ? riserEnds.get(gs)! : span(gs);
      const ya = out(gs, -1.5);
      const yb = (e[2] + e[3]) / 2;
      const strip = roundRect(ra + 4, Math.min(ya, yb), rb - 4, Math.max(ya, yb), 1);
      if (w0 - baseTop > 2) L.add(H.plate(`${id}-way`, strip, { body: hostBody, kind: "plate", role: "ground", name: "Way under the rack's back, ground", z0: baseTop, z1: w0 - 1.5, mat: "Steel C45, ground" }));
      L.add(H.wearStrip(`${id}-strip`, strip, { body: hostBody, z0: w0 - 1.5, z1: w0, name: "Wear strip under the rack, hardened" }));
      ways.push(`${id}-strip`);
    }
    // gib on the gibbed side, between the slider and its rail (F7)
    L.add(H.gib(`${id}-gib`, Math.max(10, run - 20), { body: hostBody, at: [g0 + Math.min(10, run / 4), out(gs, gap / 2 + 0.5), 0], z0: w0 + 0.5, z1: w1 - 0.5 }));
    // keeper plate over the gibbed rail, lapping the slider (F2)
    const ky = out(gs, railOff(gs));
    const kA = out(gs, railOff(gs) + 5);
    const kB = out(gs, -2);
    L.add(H.plate(`${id}-keeper`, roundRect(g0 + 8, Math.min(kA, kB), g1 - 8, Math.max(kA, kB), 1), { body: hostBody, kind: "plate", role: "ground", name: "Keeper plate, laps the slider", z0: w0 + rh, z1: w0 + rh + KT, mat: "Aluminium 6061-T6, anodised" }));
    ways.push(`${id}-gib`, `${id}-keeper`);
    // the keeper's screws go down through the gibbed rail and its riser into the base
    const [s0, s1] = risen ? riserEnds.get(gs)! : [g0, g1];
    const nScrew = Math.max(2, Math.ceil((s1 - s0 - 16) / 100) + 1);
    for (let k = 0; k < nScrew; k++) {
      const x = s1 - s0 < 24 ? (s0 + s1) / 2 + (k ? 4 : -4) : s0 + 6 + ((s1 - s0 - 12) * k) / (nScrew - 1);
      L.add(H.screw(`${id}-sc${k}`, "csk", 3, rh + KT + 4 + Math.max(0, w0 - baseTop), { body: hostBody, at: [x, ky, 0], face: w0 + rh + KT, dir: -1, ...(k ? { name: "", qty: 0 } : {}) }));
    }
    // dowels: the reference rail to the base, or the riser alone where an arm runs over that side
    // (a rack's go in its gibbed rail, its only rail)
    const ds = teeth ? gs : rs;
    const [d0, d1] = risen ? riserEnds.get(ds)! : span(ds);
    const dy = out(ds, ds === armSide ? 3 : railOff(ds));
    // (recessed under the riser's top where the arm runs over it)
    const dz1 = ds === armSide ? w0 - 0.5 : w0 + rh;
    for (const [k, x] of [[0, d0 + 4], [1, d1 - 4]] as const) L.add(H.dowel(`${id}-dw${k}`, 3, { body: hostBody, at: [x, dy, 0], z0: baseTop, z1: dz1, ...(k ? { name: "", qty: 0 } : { name: `Dowel pin Ø3 h6, ${teeth ? "gibbed rail" : ds === armSide ? "riser" : "reference rail"} to base`, qty: 2 }) }));
    // wipers at both ends of the slider where they clear, and a grease nipple (F8)
    const sb = bodyOf(ctx, slider);
    const wipers: string[] = [];
    // at the slider's two ends, where it stands at the reference (the contact's origin), riding it
    for (const [k, x] of [[0, e[0] - 3], [1, e[1] + 1]] as const) {
      const wip = H.wiper(`${id}-wip${k}`, [[x, e[2]], [x + 2, e[2]], [x + 2, e[3]], [x, e[3]]], { body: sb, z0: w0 + 0.5, z1: w1 - 0.5, ...(wipers.length ? { name: "", qty: 0 } : { qty: 2 }) });
      // a wiper rides the slider: judged against the others' sweeps as the slider carries it
      if (!clearOf(ctx, one((T) => T.add(wip)), others.filter((m) => m !== sb))) continue;
      L.add(wip);
      wipers.push(`${id}-wip${k}`);
    }
    // the nipple where nothing sweeps over it: on the keeper mid run, else nearer an end, else on the reference rail
    const nipAt = ([x, y, z]: [number, number, number]) => H.nipple(`${id}-nip`, { body: hostBody, at: [x, y, 0], z0: z, z1: z + 9 });
    const along = [0.5, 0.25, 0.75, 0.1, 0.9].map((f) => g0 + 12 + (run - 24) * f);
    const spots: [number, number, number][] = [
      ...along.map((x): [number, number, number] => [x, ky, w0 + rh + KT]),
      ...(rs !== armSide ? along.map((x): [number, number, number] => [x, out(rs, railOff(rs)), w0 + rh]) : []),
    ];
    const nx = spots.find((q) => clearOf(ctx, one((T) => T.add(nipAt(q))), others));
    if (nx) L.add(nipAt(nx));
    // an end stop block with a neoprene pad past each end of the travel, where there is room beyond the slider's wipers
    // and it clears every other part (F5); a slider its rod drives never over-travels, so an end without room keeps none
    const stops: string[] = [];
    for (const [k, x, s] of [[0, x0 + 1, 1], [1, x1 - 1, -1]] as const) {
      // no stop across an end the part reaches out of (past its guide)
      if ((k === 0 && reachLo) || (k === 1 && reachHi)) continue;
      const room = s > 0 ? lo - 3 - x0 : x1 - (hi + 3);
      if (room < 9) continue;
      const sx = x - s * 4;
      const T = localAt(ctx, c);
      T.add(H.stop(`${id}-stop${k}`, roundRect(Math.min(x, x - s * 8), e[2] - 4, Math.max(x, x - s * 8), e[3] + 4, 1), { body: hostBody, z0: w0, z1: w1 + 2, ...(stops.length ? { name: "", qty: 0 } : { qty: 2 }) }));
      T.add(H.bumper(`${id}-pad${k}`, 3, 8, { body: hostBody, at: [sx + s * 6, 0, 0], z0: w0 + 1, z1: w0 + 3, ...(stops.length ? { name: "", qty: 0 } : { qty: 2 }) }));
      if (!clearOf(ctx, T.out(), others)) continue;
      L.add(...T.list);
      stops.push(`${id}-stop${k}`);
    }
    const part = ctx.parts.get(slider);
    if (part) part.slides = [...(part.slides ?? []), ...ways];
    const stopText = stops.length === 2 ? "an end stop with a pad at each end" : stops.length ? "an end stop with a pad at one end" : "no end stops, as the rod drives the slider and other parts sweep past both ends";
    const guide = teeth
      ? "guided from its back: a gibbed rail under a keeper on a ground riser, and a hardened strip on a way under its back half; its toothed side stays open and the pinion holds it against the gib, which sets the mesh"
      : armSide
        ? "on the lips of two ground risers, a gibbed rail under a keeper on the side away from its arm (the arm runs over the other riser)"
        : "on the lips of two ground risers, between a dowelled reference rail and a gibbed rail under a keeper";
    return {
      serves: { F1: [`${id}-dw0`, `${id}-dw1`], F2: [`${id}-keeper`], F5: stops, F7: [`${id}-gib`], F8: [...wipers, ...(nx ? [`${id}-nip`] : [])], ...(teeth ? { M14: [`${id}-strip`] } : {}) },
      note: `${titleOf(id)}: ${Ls.toFixed(0)} mm ${teeth ? "rack" : "slider"} ${guide}; ${wipers.length === 2 ? "wipers at both ends" : wipers.length ? "a wiper at the free end" : "no wipers (parts sweep close past both ends)"}, ${nx ? "a grease nipple" : "an oil hole in the keeper (no room for a nipple under the parts that sweep over it)"}; ${stopText} of the ${(trv[1] - trv[0]).toFixed(0)} mm travel.`,
    };
  },
});

export const SLIDE_KITS: Rule[] = [j5];
