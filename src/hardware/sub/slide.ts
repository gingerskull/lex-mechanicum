// H.slide (J5): a prismatic slide as a few blocks. Two rails: the plain one is the reference, dowelled to the base; the
// other carries a bronze gib on its top, bearing on the slider's side, and a keeper plate over the gib lapping the
// slider (F2). The gib is set across on slotted holes and clamped by the keeper's screws, which are the rail's own
// fixing screws, down through keeper, gib, rail and riser into the base (F7, M13). A felt wiper at each end of the
// slider and a grease nipple on the keeper (F8); one end stop block with a neoprene pad just past each end of the travel
// (F5). The rails sit on ground risers (A6, `seatRail`): one per rail, split into pads only where a moving part passes
// under it.
import { TAU, bbox, circle, roundedPoly, xf, type Pose, type Vec2 } from "../../core/geom";
import { overlap, region, toLocal, toWorld } from "../../core/poly";
import { poseOf } from "../../model/pose";
import type { Part } from "../../model/types";
import { heights } from "../../parts";
import { clearOf } from "../../rules/space";
import type { RuleContext, SlideJoint } from "../../rules/types";
import { bumper, disc, dowel, gib, nipple, plate, screw, standoff, stop, wiper } from "../primitives";
import { HEADS } from "../tables";

/** End stop block lengths along the slide, longest first: a stop is shortened to clear a sweep before it is dropped. */
const STOP_LENGTHS = [8, 7, 6, 5];

/**
 * Rail fixings: shortest riser or pad, the screw's inset from a riser end, the most one screw may be from the next,
 * the screw and dowel sizes, the step of the free-run search along the rail.
 */
export const RAIL = { pad: 12, inset: 6, pitch: 100, M: 3, dowel: 3, dowelIn: 5, step: 2 };

const fmt = (v: number) => String(+v.toFixed(1));

const rect = (x0: number, x1: number, y0: number, y1: number): Vec2[] => [
  [Math.min(x0, x1), Math.min(y0, y1)],
  [Math.max(x0, x1), Math.min(y0, y1)],
  [Math.max(x0, x1), Math.max(y0, y1)],
  [Math.min(x0, x1), Math.max(y0, y1)],
];

/** Where a rail sits and is screwed, in the rail's own frame: riser spans along x and screw positions. */
export interface RailLayout {
  risers: [number, number][];
  screws: number[];
}

const layouts = new WeakMap<RuleContext, Map<string, RailLayout>>();

/**
 * The rail's seat (A6): one riser under the rail's straight run where nothing moving passes under it; where something
 * does, the riser is split into pads on the free runs (2.2), each at least `RAIL.pad` long. A screw near each end of a
 * riser and between them at most `RAIL.pitch` apart. Decided once per rail, so the slide and the seat agree.
 */
export function railLayout(ctx: RuleContext, p: Part): RailLayout {
  let m = layouts.get(ctx);
  if (!m) layouts.set(ctx, (m = new Map()));
  const known = m.get(p.id);
  if (known) return known;
  const F = p.fixed!;
  const [x0, y0, x1, y1] = bbox(p.shape.outer);
  const w = y1 - y0;
  // the straight run of a stadium rail
  const a = x0 + w / 2 + 0.5;
  const b = x1 - w / 2 - 0.5;
  const z0 = ctx.b1;
  const z1 = ctx.solidOf[p.id]!.z0;
  const free = (s: number, e: number) => z1 - z0 < 0.3 || clearOf(ctx, rect(s, e, -w / 2, w / 2).map((q) => toWorld(F, q)), z0, z1);
  const risers: [number, number][] = [];
  if (free(a, b)) risers.push([a, b]);
  else {
    // free runs along the rail, in steps
    let s: number | null = null;
    for (let x = a; x < b + 1e-9; x += RAIL.step) {
      const e = Math.min(b, x + RAIL.step);
      const ok = free(x, e);
      if (ok && s === null) s = x;
      if ((!ok || e >= b) && s !== null) {
        const end = ok ? e : x;
        if (end - s >= RAIL.pad) risers.push([s, end]);
        s = null;
      }
    }
    // nothing free: pads at the ends as the rail would have without a clearance search
    if (!risers.length) risers.push([a, a + RAIL.pad], [b - RAIL.pad, b]);
  }
  const screws: number[] = [];
  for (const [s, e] of risers) {
    const p0 = s + RAIL.inset;
    const p1 = e - RAIL.inset;
    if (p1 - p0 < 1) {
      screws.push((s + e) / 2);
      continue;
    }
    const n = Math.ceil((p1 - p0) / RAIL.pitch) + 1;
    for (let i = 0; i < n; i++) screws.push(p0 + ((p1 - p0) * i) / (n - 1));
  }
  const out = { risers, screws };
  m.set(p.id, out);
  return out;
}

/**
 * Seat a slide rail (A6, F1): its risers or pads, ground to the gap over the base; a countersunk screw at each fixing,
 * down from `top` (the keeper on the gib rail, the rail itself on the reference rail) into the base; on the reference
 * rail, a dowel by each end screw, so the slider's bearing face goes back straight after a rebuild.
 */
export function seatRail(ctx: RuleContext, p: Part, jid: string, o: { ref: boolean; top?: { id: string; z1: number; ex: number } }): void {
  const q = ctx.solidOf[p.id]!;
  const F = p.fixed!;
  const [, y0, , y1] = bbox(p.shape.outer);
  const w = y1 - y0;
  const { risers, screws } = railLayout(ctx, p);
  const h = q.z0 - ctx.b1;
  const serves: string[] = [];
  const top = o.top ?? { id: q.id, z1: q.z1, ex: q.ex };
  if (h >= 0.3) {
    const same = risers.every(([s, e]) => Math.abs(e - s - (risers[0]![1] - risers[0]![0])) < 0.05);
    risers.forEach(([s, e], k) => {
      const one = risers.length === 1;
      const named = !same || k === 0;
      ctx.add(standoff(`${jid}${k}`, {
        name: named ? `${one ? "Rail riser" : "Rail pad"} ${fmt(w)} x ${fmt(e - s)} x ${fmt(h)}, steel, ground` : "",
        qty: named ? (same ? risers.length : 1) : 0,
        mat: "Steel C45, ground",
        outer: rect(s, e, -w / 2, w / 2),
        D: undefined,
        at: F,
        z0: ctx.b1,
        z1: q.z0,
        ex: -1,
        joints: [jid],
      }));
    });
  }
  screws.forEach((x, k) => {
    const c = toWorld(F, [x, 0]);
    q.holes.push(disc(RAIL.M / 2 + 0.3, x, 0));
    ctx.add(screw(`${jid}${k}-sc`, "csk", RAIL.M, top.z1 - ctx.b1 + 1.5 * RAIL.M, { at: [c[0], c[1], 0], face: top.z1, dir: -1, ex: top.ex, joints: [jid], name: k ? "" : undefined, qty: k ? 0 : screws.length }));
  });
  if (o.ref && screws.length >= 2) {
    // a dowel just outside each end screw, into the base and up into the rail
    const ends: [number, number][] = [[screws[0]!, -1], [screws[screws.length - 1]!, 1]];
    ends.forEach(([x, dir], k) => {
      const d = toWorld(F, [x + dir * (RAIL.pad / 2 - RAIL.dowel / 2 - 1.5), 0]);
      const id = `${jid}${k}-dowel`;
      ctx.add(dowel(id, RAIL.dowel, { at: [d[0], d[1], 0], z0: ctx.b1 - RAIL.dowelIn, z1: q.z0 + Math.min(3, (q.z1 - q.z0) / 2), ex: -1, joints: [jid], name: k ? "" : `Dowel pin Ø${RAIL.dowel} h6 (ISO 8734), rail to base`, qty: k ? 0 : 2 }));
      serves.push(id);
    });
  }
  const seat = h >= 0.3 ? (risers.length === 1 ? "a ground steel riser" : `${risers.length} ground steel pads, clear of what passes under it`) : "the base";
  const n = screws.length;
  ctx.joints.push({
    id: jid,
    type: "post",
    at: toWorld(F, [screws[0]!, 0]),
    title: `Seat · ${q.name}`,
    note: `Seated on ${seat}${h >= 0.3 ? ` ${fmt(h)} mm thick` : ""}; ${n} countersunk M${RAIL.M} down ${o.top ? "through keeper, gib and rail" : "through the rail"} into the base.${o.ref ? ` The reference rail: two Ø${RAIL.dowel} dowels by its end screws locate it, so the slider's bearing face goes back straight after a rebuild.` : " Not dowelled: the gib on it takes up the fit against the reference rail."}`,
    badge: [o.ref ? "seated and dowelled" : "seated", "ok"],
    serves: o.ref ? { F1: serves } : {},
  });
  q.joints.push(jid);
}

/** A wiper on the slider stays clear of every other moving part over the cycle (the contact end of a cam follower). */
function wiperClear(ctx: RuleContext, j: SlideJoint, local: Vec2[], z0: number, z1: number): boolean {
  for (let i = 0; i < 36; i++) {
    const s = ctx.model.solve((i / 36) * TAU);
    const q = poseOf(j.slider, s);
    if (!q) continue;
    const g = region(xf(local, q), []);
    for (const p of ctx.model.parts) {
      if (p === j.slider || p.fixed || p.role === "pin" || p.role === "trace") continue;
      const [a, b] = heights(p);
      if (Math.min(b, z1) - Math.max(a, z0) <= 0.05) continue;
      const pq = poseOf(p, s);
      if (pq && overlap(g, region(xf(p.shape.outer, pq), p.shape.holes.map((h) => xf(h, pq)))) > 0.05) return false;
    }
  }
  return true;
}

export function slide(ctx: RuleContext, j: SlideJoint): void {
  const J = ctx.joint(j.id)!;
  const [ra, rb] = j.rails;
  const F: Pose = rb.fixed!;
  const W = (pts: Vec2[]) => pts.map((p) => toWorld(F, p));
  const yA = toLocal(F, [ra.fixed![0], ra.fixed![1]])[1];
  const sg = Math.sign(yA) || 1;
  const [, , Lr0] = bbox(rb.shape.outer);
  const Lr = Lr0 - 3.5;
  const rz1 = heights(ra)[1];
  const [sz0, sz1] = heights(j.slider);
  const [sx0, sy0, sx1, sy1] = bbox(j.slider.shape.outer);
  const yAi = yA - 3.5 * sg;
  const G = { joints: [j.id], ex: ctx.solidOf[ra.id]!.ex };
  const serve = (k: "F2" | "F5" | "F7" | "F8", id: string) => (J.serves[k] ??= []).push(id);

  // rail a's fixings, in the slide's frame (the keeper's screws are the rail's)
  const aL = railLayout(ctx, ra);
  const fix = aL.screws.map((x) => toLocal(F, toWorld(ra.fixed!, [x, 0]))[0]);

  // the gib on rail a, its inner edge on the slider's side, 0.3 mm proud of the slider's top: slotted across at each
  // fixing, so it is set against the slider and clamped by the keeper screws (F7)
  const kz0 = sz1 + 0.3;
  const slots = fix.map((x) => W(roundedPoly([[x, yA - 0.4], [x, yA + 0.4]], RAIL.M / 2 + 0.3)));
  const g = gib(`${j.id}-gib`, Lr + 5, { ...G, outer: W(rect(-2.5, Lr + 2.5, yAi, yA + 3.5 * sg)), holes: slots, z0: rz1, z1: kz0, name: `Gib strip ${fmt(Lr + 5)} x 7 x ${fmt(kz0 - rz1)}, bronze, slotted, clamped under the keeper` });
  ctx.add(g);
  serve("F7", g.id);
  // the keeper over the gib, lapping the slider by 2 mm (F2)
  const keeper = plate(`${j.id}-keeper`, W(rect(-2.5, Lr + 2.5, yAi - 2 * sg, yA + 3.5 * sg)), { ...G, name: "Keeper plate, holds the slider down", z0: kz0, z1: kz0 + 2.5, mat: "Steel, ground" });
  ctx.add(keeper);
  serve("F2", keeper.id);

  // felt wipers at both ends of the slider (F8)
  const sl = ctx.solidOf[j.slider.id]!;
  for (const [k, x0, x1] of [[0, sx1, sx1 + 2], [1, sx0 - 2, sx0]] as const) {
    if (!wiperClear(ctx, j, rect(x0, x1, sy0 + 1, sy1 - 1), sz0 + 1, sz1 - 1)) {
      J.note += ` No wiper at the ${k ? "lower" : "upper"} end: a moving part meets the slider there.`;
      continue;
    }
    const w = wiper(`${j.id}-wiper${k}`, rect(x0, x1, sy0 + 1, sy1 - 1), { body: j.slider.id, z0: sz0 + 1, z1: sz1 - 1, ex: sl.ex, joints: [j.id], name: k ? "" : undefined, qty: k ? 0 : 2 });
    ctx.add(w);
    serve("F8", w.id);
  }

  // end stops (F5): a hardened block with a neoprene pad, 1.5 mm past each end of the travel; where a moving part passes
  // behind the pad, the block is shortened before the stop is given up
  const off = F[0] * j.axis[0] + F[1] * j.axis[1];
  const ends: [number, number][] = [[j.range[1] - off + sx1 + 2, 1], [j.range[0] - off + sx0 - 2, -1]];
  const yIn0 = 3.5 * sg + 0.5 * sg;
  const yIn1 = yAi - 0.5 * sg;
  // the block length each end takes, decided first so the parts list counts what is placed
  const H4 = HEADS.button[4]!;
  const fit = ends.map(([x, dir]) => {
    const pad = rect(x + dir * 1.5, x + dir * 3.5, yIn0, yIn1);
    // the block and the head of its screw, at the block's centre, both clear
    const fits = (len: number) => {
      const c = toWorld(F, [x + dir * (3.5 + len / 2), (yIn0 + yIn1) / 2]);
      return clearOf(ctx, W(rect(x + dir * 3.5, x + dir * (3.5 + len), yIn0, yIn1)), ctx.b1, sz1) && clearOf(ctx, circle(H4.dk / 2, c[0], c[1], 24), sz1 - 1, sz1 - 1 + H4.k);
    };
    return clearOf(ctx, W(pad), ctx.b1, sz1 - 1) ? STOP_LENGTHS.find(fits) : undefined;
  });
  const n = fit.filter((L) => L !== undefined).length;
  let placed = 0;
  ends.forEach(([x, dir], k) => {
    const L = fit[k];
    if (L === undefined) {
      J.note += ` No room for the ${k ? "lower" : "upper"} end stop: something moving passes there.`;
      return;
    }
    const pad = rect(x + dir * 1.5, x + dir * 3.5, yIn0, yIn1);
    const blk = rect(x + dir * 3.5, x + dir * (3.5 + L), yIn0, yIn1);
    if (L < STOP_LENGTHS[0]!) J.note += ` The ${k ? "lower" : "upper"} end stop is ${L} mm long instead of ${STOP_LENGTHS[0]}, to clear a moving part's sweep.`;
    const first = placed++ === 0;
    const s = stop(`${j.id}-stop${k}`, W(blk), { ...G, z0: ctx.b1, z1: sz1 - 1, name: first ? "End stop block, hardened" : "", qty: first ? n : 0 });
    const b = bumper(`${j.id}-bump${k}`, 0, 0, { ...G, outer: W(pad), z0: ctx.b1 + 1, z1: sz1 - 1.5, name: first ? "Stop pad, neoprene 2 mm" : "", qty: first ? n : 0 });
    ctx.add(s, b);
    serve("F5", s.id);
    const c = toWorld(F, [x + dir * (3.5 + L / 2), (yIn0 + yIn1) / 2]);
    ctx.add(screw(`${j.id}-stop${k}-sc`, "button", 4, sz1 - 1 - ctx.b1 + 6, { ...G, at: [c[0], c[1], 0], face: sz1 - 1, dir: -1, name: first ? undefined : "" }));
  });

  // grease nipple on the keeper between its screws, where nothing passes over it (F8)
  const cand: number[] = [];
  for (let i = 0; i + 1 < fix.length; i++) {
    const [p, q] = [Math.min(fix[i]!, fix[i + 1]!), Math.max(fix[i]!, fix[i + 1]!)];
    if (q - p > 20) cand.push(p + 9, q - 9);
    cand.push((p + q) / 2);
  }
  if (!cand.length) cand.push(Lr / 2);
  for (const x of cand) {
    const p = toWorld(F, [x, yA + 0.5 * sg]);
    const nip = nipple(`${j.id}-nipple`, { ...G, at: [p[0], p[1], 0], z0: keeper.z1 });
    if (!clearOf(ctx, nip.outer.map(([u, v]) => [u + p[0], v + p[1]] as Vec2), nip.z0, nip.z1)) continue;
    ctx.add(nip);
    serve("F8", nip.id);
    break;
  }
  J.note = `Slide on two rails: the plain rail is the dowelled reference; on the other a bronze gib bears on the slider's side and a keeper over it holds the slider down, both clamped by the rail's own screws (the gib is set across on its slotted holes first). Felt wipers at both ends of the slider${J.serves.F8?.some((s) => s.endsWith("nipple")) ? ", a grease nipple on the keeper" : ""}, an end stop block with a neoprene pad just past each end of the travel.${J.note}`;
  J.badge = ["guided both sides", "ok"];
}
