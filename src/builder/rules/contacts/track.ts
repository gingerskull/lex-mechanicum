// Follower in a fixed track (a pin-in-slot whose slot is a composite track): a track roller on a hardened stud running in
// a form-closed groove cut along the track in a plate on the base, as a groove cam's roller runs in its groove.
import { type Vec2, circle } from "../../../core/geom";
import { H, headHeight } from "../../../hardware/primitives";
import { circlipExt } from "../../../hardware/tables";
import { fromPlane as onTrack } from "../../../kin/blocks/track";
import { v3 } from "../../../kin/math";
import type { Feature } from "../../../solids/types";
import { type Frame, fromPlane, parallel, planeCoords } from "../../frames";
import { Local as LocalFrame, titleOf } from "../../lib";
import { TRACK_FOLLOWER, trackLevels, trackPlate } from "../../shapes";
import { signedArea } from "../../shapes/common";
import type { BuildCtx } from "../../ctx";
import { type JointInfo, UP } from "../../sites";
import type { Rule } from "../types";
import { bodyOf, contactRule } from "./kit";

/**
 * The world height of a track plate's top (z-up stacks only): right under the arm that carries the follower where no
 * other moving part sweeps over the plate, else under every moving part, as the base is. Decided once per build, when
 * the base rule asks (the base drops under the plate), so the kit builds at the level the base made room for.
 */
const tops = new WeakMap<BuildCtx, Map<string, number | null>>();
export function trackPlateTop(ctx: BuildCtx, ji: JointInfo): number | null {
  const memo = tops.get(ctx) ?? new Map<string, number | null>();
  tops.set(ctx, memo);
  if (memo.has(ji.id)) return memo.get(ji.id)!;
  const T = ji.r.slot?.track;
  const e = ctx.extent(ji.a);
  const plate = T ? trackPlate(T.t) : null;
  let top: number | null = null;
  if (T && e && plate && ji.b === "ground" && parallel(e.frame.z, UP) && parallel(T.n, UP)) {
    const M = ctx.M;
    const ring = plate.outline.map((p): Vec2 => {
      const q = onTrack(T, p);
      return [q[0], q[1]];
    });
    const cs = new M.CrossSection([signedArea(ring) < 0 ? ring.reverse() : ring], "NonZero");
    const clear = (z: number): boolean => {
      const lv = trackLevels(z);
      const m = M.Manifold.extrude(cs, z - lv.bottom).translate([0, 0, lv.bottom]);
      const g = ctx.sweeps.gap(m, ctx.sweeps.moving().filter((b) => b !== ji.a), TRACK_FOLLOWER.gap + 1);
      m.delete();
      return g >= TRACK_FOLLOWER.gap;
    };
    const under = fromPlane(e.frame, [0, 0], e.w0)[2] - TRACK_FOLLOWER.gap;
    const low = (ctx.sweeps.bounds()?.[2] ?? under) - TRACK_FOLLOWER.gap;
    top = clear(under) ? under : Math.min(under, low);
    cs.delete();
  }
  memo.set(ji.id, top);
  return top;
}

/**
 * A track and its follower (J4, J7 with form closure): on the ground, a plate on the base following the track (src/
 * builder/shapes/track.ts), screwed down and dowelled (F1), the groove cut along the track's centre line with a relief
 * past each end, a hardened liner in each wall (M14) and a felt oiler in the start's relief (F8); on the arm that carries
 * the pin, a stud-type track roller on a hardened stud pressed into the arm, a bronze thrust washer over the roller (F4),
 * a spacer sleeve up to the arm where the plate lies below other parts, and a circlip under the roller (F2). The groove
 * holds the roller both ways, so no spring (F6).
 */
const trackFollower = contactRule({
  id: "track-follower",
  ids: ["J4", "J7", "M14"],
  fixture: "kin:trackFollower",
  kits: ["track"],
  build(ctx, c) {
    const id = c.id;
    const T = c.ji.r.slot?.track;
    const fail = (why: string) => {
      ctx.issues.push(`joint ${id}: ${why}; the track kit is not built`);
      return { note: `${titleOf(id)}: pin in a track; ${why}.`, badge: ["track: nothing built", "warn"] as [string, "warn"] };
    };
    if (!T) return fail("no track");
    if (c.b !== "ground") return fail("its track is on a moving body, and only a track on the ground is built");
    // (the arm's own faces when the record places it: the contact reads them, src/builder/ctx.ts extent)
    const za = c.za;
    if (!za || !ctx.base || !parallel(T.n, c.frame.z) || !parallel(c.frame.z, UP)) return fail("its track does not lie in the plane of the arm's stack over the base");
    const plate = trackPlate(T.t);
    if (!plate) return fail(`an arc of its track is tighter than the groove (Ø${TRACK_FOLLOWER.D} roller)`);
    const top = trackPlateTop(ctx, c.ji);
    if (top === null) return fail("no level for its plate");
    const F = TRACK_FOLLOWER;
    // the frame: on the stack's plane under the track's start, x along the track's start, z the stack's normal
    const z = c.frame.z;
    const fr: Frame = { o: v3.sub(T.o, v3.mul(z, v3.dot(v3.sub(T.o, c.frame.o), z))), x: T.x, z };
    const L = new LocalFrame(fr, { joints: [id] });
    const loc = (p: Vec2): Vec2 => planeCoords(fr, onTrack(T, p)).uv;
    const ccw = (r: Vec2[]): Vec2[] => {
      const q = r.map(loc);
      return signedArea(q) < 0 ? q.reverse() : q;
    };
    const lv = trackLevels(top - fr.o[2]);
    const baseTop = ctx.base.top - fr.o[2];
    if (baseTop > lv.bottom + 1e-6) return fail(`the base stands ${(baseTop - lv.bottom).toFixed(1)} mm too high under its plate`);
    // the plate: through holes for its screws and dowels, the groove and the screws' counterbores cut from its top
    const screws = plate.screws.map(loc);
    const dowels = plate.dowels.map(loc);
    const k = headHeight("socket", 3);
    const face = lv.top - k - 0.3;
    const holes = [...screws.map((p) => circle(1.7, p[0], p[1], 20).reverse()), ...dowels.map((p) => circle(1.5, p[0], p[1], 20).reverse())];
    L.add(H.plate(`${id}-plate`, ccw(plate.outline), { body: "ground", kind: "plate", role: "ground", name: `Track plate, the groove ${plate.width.toFixed(1)} wide cut along the track, screwed and dowelled to the base`, z0: baseTop, z1: lv.top, holes, mat: "Aluminium 6061-T6, anodised" }));
    const cut = (outer: Vec2[], z0: number, z1: number): Feature => ({ mode: "cut", profile: { outer, holes: [] }, op: { op: "extrude", h: z1 - z0, steps: 1 }, frame: { o: [0, 0, z0 - baseTop], x: [1, 0, 0], z: [0, 0, 1] } });
    const features = [cut(ccw(plate.groove), lv.floor, lv.top + 1), ...screws.map((p) => cut(circle(3, p[0], p[1], 24), face, lv.top + 1))];
    const liners = plate.liners.map((r, n) => H.wearStrip(`${id}-liner${n}`, ccw(r), { body: "ground", z0: lv.floor, z1: lv.top, ...(n ? { name: "" } : { name: "Groove liner, hardened, along each wall of the groove", qty: 2 }) }));
    L.add(...liners);
    L.add(H.felt(`${id}-felt`, ccw(plate.felt), { body: "ground", z0: lv.floor, z1: lv.top - 1, name: "Felt oiler in the groove's relieved end, oil-soaked wool felt" }));
    screws.forEach((p, n) => L.add(H.screw(`${id}-sc${n}`, "socket", 3, face - baseTop + 6, { body: "ground", at: [p[0], p[1], 0], face, dir: -1, ...(n ? { name: "", qty: 0 } : { qty: screws.length }) })));
    dowels.forEach((p, n) => L.add(H.dowel(`${id}-dw${n}`, 3, { body: "ground", at: [p[0], p[1], 0], z0: baseTop - 4, z1: lv.top, ...(n ? { name: "", qty: 0 } : { name: "Dowel pin Ø3 h6, through the plate into the base", qty: 2 }) })));
    // the follower on the arm, at the pin
    const carrier = bodyOf(ctx, c.a);
    const pin = planeCoords(fr, c.at).uv;
    const at: [number, number, number] = [pin[0], pin[1], 0];
    const [r0, r1] = lv.roller;
    const s = circlipExt(F.d).s;
    const g = r0 - s - 0.15;
    L.add(H.shaft(`${id}-stud`, { d: F.d, z0: g - 0.6, z1: za[1] - 0.3, grooves: [g] }, { body: carrier, at, name: `Track roller stud Ø${F.d}, hardened, pressed into the arm` }));
    L.add(H.roller(`${id}-roller`, F.d, F.D, { body: carrier, at, z0: r0, z1: r1, name: `Track roller Ø${F.D} x ${F.B}, stud type, sealed: runs in the groove` }));
    L.add(H.thrustWasher(`${id}-tw`, F.d, 10, { body: carrier, at, z0: lv.washer[0], z1: lv.washer[1] }));
    // where the plate lies below other parts, a sleeve on the stud holds the roller down at the groove
    if (za[0] - lv.washer[1] > 0.05) L.add(H.tube(`${id}-sleeve`, F.d, 10, { body: carrier, at, z0: lv.washer[1], z1: za[0], name: `Spacer sleeve ${F.d}x10 on the stud, between the washer and the arm` }));
    L.add(H.circlip(`${id}-cl`, F.d, { body: carrier, at, z0: g + 0.05 }));
    const solids = L.out();
    const part = solids.find((q) => q.id === `${id}-plate`)!;
    part.features = features;
    ctx.add(solids);
    return {
      serves: { M14: liners.map((q) => q.id), F8: [`${id}-felt`], F1: [`${id}-dw0`, `${id}-dw1`], F2: [`${id}-cl`], F4: [`${id}-tw`] },
      note: `${titleOf(id)}: a Ø${F.D} track roller on a hardened stud runs in a groove cut along the track (${T.t.length.toFixed(1)} mm, ${T.t.segs.length} segments) in a plate screwed and dowelled to the base; hardened liners in both walls, a relief past each end and a felt oiler in one; form-closed, so no spring.`,
      badge: ["track built", "ok"],
    };
  },
});

export const TRACK_KITS: Rule[] = [trackFollower];
