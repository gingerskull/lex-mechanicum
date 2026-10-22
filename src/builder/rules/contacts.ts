// The joint kits for contacts (A21): pin in a slot (J4), slide (J5), gear mesh (J6), cam (J7), belt and flexible member
// (J8, J12), crossed mesh (J9), screw (J11), compliant joint (J13), and the kinds the audits found missing: pallet
// contact, fork and pin, pawl and tooth, pin and lobe, tongue in slot, ring on hub, ring on rollers, strap on sheave,
// groove cam. Each builds its canonical hardware in the contact's own frame from the declared joint.
import { circle, roundRect, type Vec2 } from "../../core/geom";
import { H } from "../../hardware/primitives";
import { BEARINGS, NIPPLES, circlipExt } from "../../hardware/tables";
import { planeCoords } from "../frames";
import { fromPlane } from "../frames";
import type { BuildCtx, JointNote } from "../ctx";
import { MIN_GAP } from "../constants";
import { clearance } from "../router";
import { type Contact, contactOf, cutRing, freeSpot, localAt, mid, ringOffsets, stadium } from "../contact";
import { titleOf } from "../lib";
import type { JointInfo, KitId } from "../sites";
import { Local } from "../lib";
import type { Rule } from "./types";
import { v3, type Vec3 } from "../../kin/math";
import { anchorName } from "../../kin/compose";
import type { Solid3 } from "../../solids/types";
import { Local as LocalFrame } from "../lib";
import { worldManifold } from "../sweeps";

interface KitBuild {
  (ctx: BuildCtx, c: Contact, L: Local): { serves?: Record<string, string[]>; note: string; badge?: [string, "ok" | "warn"] } | void;
}

interface KitDef {
  id: string;
  ids: string[];
  fixture: string;
  kits: KitId[];
  build: KitBuild;
  /** Joints of the kit another rule builds. */
  skip?: (ji: JointInfo, ctx: BuildCtx) => boolean;
}

const bodyOf = (ctx: BuildCtx, id: string): string => (ctx.parts.has(id) ? id : "ground");
const partId = (ctx: BuildCtx, id: string): string | undefined => ctx.parts.get(id)?.id;

/** Local z of the top of the base under a contact, or null when the base is not under the stack axis. */
const baseZ = (ctx: BuildCtx, c: Contact): number => (ctx.base ? ctx.base.top - c.frame.o[2] : -4);

function contactRule(def: KitDef): Rule {
  return {
    id: def.id,
    tier: "AUTO",
    ids: def.ids,
    fixture: def.fixture,
    applies: (ctx) => ctx.joints.some((j) => def.kits.includes(j.kit) && !def.skip?.(j, ctx)),
    apply(ctx) {
      for (const ji of ctx.joints.filter((j) => def.kits.includes(j.kit) && !def.skip?.(j, ctx))) {
        const c = contactOf(ctx, ji);
        if (!c) {
          ctx.issues.push(`joint ${ji.id}: no body of it is stacked, kit ${ji.kit} not built`);
          continue;
        }
        const L = localAt(ctx, c);
        const r = def.build(ctx, c, L);
        const solids = L.out();
        if (solids.length) ctx.add(solids);
        const note: JointNote = {
          id: ji.id,
          kit: ji.kit,
          at: ji.at,
          title: `${ji.kit} · ${titleOf(ji.id)}`,
          note: r?.note ?? `${titleOf(ji.id)}: ${ji.kit} built from the declared joint.`,
          serves: r?.serves ?? {},
          // the kit built the joint's hardware: its badge says so unless the kit gave its own
          badge: r?.badge ?? (solids.length ? [`${ji.kit} built`, "ok"] : [`${ji.kit}: nothing built`, "warn"]),
        };
        ctx.note(note);
        (ctx.fired[def.id] ??= []).push(ji.id);
      }
    },
  };
}

// ------------------------------------------------------------------------------------------------ J4 and kin

const ROLLER = BEARINGS.find((b) => b.name === "625")!;

/** A track roller on a stud in a slot cut in the other body, wear strips on its walls, a felt oiler. */
function rollerInSlot(ctx: BuildCtx, c: Contact, L: Local, what: string): ReturnType<KitBuild> {
  const id = c.id;
  const d = ROLLER.d;
  const D = 13;
  const zc = mid(c.zb, mid(c.za));
  const rw = 4;
  const lo = Math.min(c.za?.[0] ?? zc, c.zb?.[0] ?? zc) - 0.5;
  const hi = Math.max(c.za?.[1] ?? zc, c.zb?.[1] ?? zc) + 1;
  const carrier = bodyOf(ctx, c.a);
  L.add(H.shaft(`${id}-stud`, { d, z0: lo, z1: hi }, { body: carrier, name: `Stud Ø${d} x ${+(hi - lo).toFixed(1)}, pressed into the pin carrier` }));
  L.add(H.roller(`${id}-roller`, d, D, { body: carrier, z0: zc - rw / 2, z1: zc + rw / 2 }));
  // a wheel that carries its own slots (a Geneva wheel, cut from the record's numbers) needs only the roller and its stud
  if (String(ctx.geoms.get(c.b)?.shape.type ?? "").startsWith("geneva")) return { serves: {}, note: `${titleOf(id)}: ${what}; Ø${D} track roller on a Ø${d} stud pressed into the crank, running in the wheel's own slots.` };
  const sw = (D + 0.4) / 2 + 1.5;
  const relief = 4;
  const x0 = c.run[0] - relief;
  const x1 = c.run[1];
  const sid = partId(ctx, c.b);
  if (sid) cutRing(ctx, c, sid, stadium(x0, x1, sw));
  const z0 = c.zb?.[0] ?? zc - 3;
  const z1 = c.zb?.[1] ?? zc + 3;
  const strips: string[] = [];
  for (const [k, y] of [[0, sw - 0.75], [1, -(sw - 0.75)]] as const) {
    const wall: Vec2[] = [[x0 - D / 2, y - 0.75], [x1 + D / 2, y - 0.75], [x1 + D / 2, y + 0.75], [x0 - D / 2, y + 0.75]];
    L.add(H.wearStrip(`${id}-wear${k}`, wall, { body: bodyOf(ctx, c.b), z0: z0 + 0.5, z1: z1 - 0.5, ...(k ? { name: "" } : { qty: 2 }) }));
    strips.push(`${id}-wear${k}`);
  }
  L.add(H.felt(`${id}-felt`, [[x0 - D / 2 - 3.5, -1.5], [x0 - D / 2 + 0.5, -1.5], [x0 - D / 2 + 0.5, 1.5], [x0 - D / 2 - 3.5, 1.5]], { body: bodyOf(ctx, c.b), z0: z0 + 1, z1: z1 - 1 }));
  void circlipExt;
  return { serves: { F8: [`${id}-felt`], M14: strips }, note: `${titleOf(id)}: ${what}; Ø${D} track roller on a Ø${d} stud, hardened wear strips in the slot walls, a felt oiler in the relieved end.` };
}

const j4 = contactRule({ id: "j4-slot-roller", ids: ["J4", "M14"], fixture: "kin:geneva", kits: ["J4"], build: (ctx, c, L) => rollerInSlot(ctx, c, L, "pin in a slot") });
const pinLobe = contactRule({ id: "pin-lobe", ids: ["J4", "M14"], fixture: "kin:pinLobe", kits: ["pin-lobe"], build: (ctx, c, L) => rollerInSlot(ctx, c, L, "pin and lobe") });
/**
 * A groove cam. Where the cam's own shape carries its groove (a face-groove or barrel cam, cut by the builder from the
 * joint's law) and the record carries the roller, the kit adds what the groove needs: a felt oiler on the follower beside
 * the roller (F8) and a zero line on the cam (F9); the groove holds the follower both ways, so no spring (F6). Otherwise
 * it is a roller in a slot cut in the other body.
 */
const grooveCam = contactRule({
  id: "groove-cam",
  ids: ["J7", "M14"],
  fixture: "kin:grooveCam",
  kits: ["groove-cam"],
  build(ctx, c, L) {
    const camBody = [c.a, c.b].find((b) => { const sh = ctx.geoms.get(b)?.shape; return String(sh?.type) === "cam" && (sh?.form === "face-groove" || sh?.form === "barrel"); });
    if (!camBody) return rollerInSlot(ctx, c, L, "roller in a groove");
    const roller = camBody === c.a ? c.b : c.a;
    const rg = ctx.geoms.get(roller);
    const rr = Number(rg?.shape.radius ?? 5);
    // the body the roller's pin is in: the follower that carries the oiler
    const pinJ = ctx.kin.joints.find((j) => j.type === "revolute" && (j.a === roller || j.b === roller));
    const carrier = pinJ ? (pinJ.a === roller ? pinJ.b : pinJ.a) : roller;
    const exC = ctx.extent(carrier);
    const serves: Record<string, string[]> = {};
    if (rg && exC) {
      // a felt wick on the follower's underside dipping toward the groove, beside the roller, clear of the walls' tops
      const Lw = new LocalFrame({ o: rg.frame.o, x: rg.frame.x, z: rg.frame.z }, { joints: [c.id] });
      const zc = v3.dot(v3.sub(fromPlane(exC.frame, [0, 0], exC.w0), rg.frame.o), rg.frame.z);
      Lw.add(H.felt(`${c.id}-oil`, [[-2, rr + 1.5], [2, rr + 1.5], [2, rr + 4.5], [-2, rr + 4.5]], { body: carrier, z0: zc - 0.8, z1: zc, name: "Felt oiler over the groove, oil-soaked wool felt" }));
      ctx.add(Lw.out());
      serves.F8 = [`${c.id}-oil`];
    }
    const part = ctx.parts.get(camBody);
    if (part) {
      const p = planeCoords(part.frame, c.at).uv;
      const L0 = Math.hypot(p[0], p[1]) || 1;
      const r0 = Number(ctx.geoms.get(camBody)?.shape.bore ?? 10) / 2 + 5;
      part.marks.push({ kind: "timing", pts: [[(p[0] / L0) * r0, (p[1] / L0) * r0], [(p[0] / L0) * (L0 - rr - 3), (p[1] / L0) * (L0 - rr - 3)]] });
      serves.F9 = [camBody];
    }
    void L;
    return { serves, note: `${titleOf(c.id)}: roller in the cam's own groove (form-closed, so no spring); felt oiler over the groove; zero line on the cam.` };
  },
});

// ------------------------------------------------------------------------------------------------ J5

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
    const armSide = full[3] > e[3] + 1 ? 1 : full[2] < e[2] - 1 ? -1 : 0;
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
      if (risen) {
        const [ra, rb] = riserEnds.get(s)!;
        L.add(H.plate(`${id}-riser${k}`, riserRect(s, ra, rb), { body: hostBody, kind: "plate", role: "ground", name: "Ground steel riser", z0: baseTop, z1: w0, mat: "Steel C45, ground" }));
        ways.push(`${id}-riser${k}`);
      }
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
    const [d0, d1] = risen ? riserEnds.get(rs)! : span(rs);
    const dy = out(rs, rs === armSide ? 3 : railOff(rs));
    // (recessed under the riser's top where the arm runs over it)
    const dz1 = rs === armSide ? w0 - 0.5 : w0 + rh;
    for (const [k, x] of [[0, d0 + 4], [1, d1 - 4]] as const) L.add(H.dowel(`${id}-dw${k}`, 3, { body: hostBody, at: [x, dy, 0], z0: baseTop, z1: dz1, ...(k ? { name: "", qty: 0 } : { name: `Dowel pin Ø3 h6, ${rs === armSide ? "riser" : "reference rail"} to base`, qty: 2 }) }));
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
    const guide = armSide ? "on the lips of two ground risers, a gibbed rail under a keeper on the side away from its arm (the arm runs over the other riser)" : "on the lips of two ground risers, between a dowelled reference rail and a gibbed rail under a keeper";
    return {
      serves: { F1: [`${id}-dw0`, `${id}-dw1`], F2: [`${id}-keeper`], F5: stops, F7: [`${id}-gib`], F8: [...wipers, ...(nx ? [`${id}-nip`] : [])] },
      note: `${titleOf(id)}: ${Ls.toFixed(0)} mm slider ${guide}; ${wipers.length === 2 ? "wipers at both ends" : wipers.length ? "a wiper at the free end" : "no wipers (parts sweep close past both ends)"}, ${nx ? "a grease nipple" : "an oil hole in the keeper (no room for a nipple under the parts that sweep over it)"}; ${stopText} of the ${(trv[1] - trv[0]).toFixed(0)} mm travel.`,
    };
  },
});

// ------------------------------------------------------------------------------------------------ J6 and J9

/** A timing mark on a part's top face at the pitch point (F9). */
function timingMark(ctx: BuildCtx, body: string, at: readonly number[]): boolean {
  const part = ctx.parts.get(body);
  if (!part) return false;
  const p = planeCoords(part.frame, [at[0]!, at[1]!, at[2]!]).uv;
  const r = Math.hypot(p[0], p[1]);
  if (r < 2) return false;
  const u: Vec2 = [p[0] / r, p[1] / r];
  part.marks.push({ kind: "timing", pts: [[u[0] * (r - 2.5), u[1] * (r - 2.5)], [u[0] * (r - 0.4), u[1] * (r - 0.4)]] });
  return true;
}

function siteOf(ctx: BuildCtx, body: string) {
  return ctx.sites.find((s) => s.fixed && s.bodies.includes(body));
}

const j6 = contactRule({
  id: "j6-mesh",
  ids: ["J6", "F7", "F9"],
  fixture: "kin:gearPair",
  kits: ["J6"],
  // a friction pair (a rolling joint given by its ratio) is built by src/builder/friction.ts
  skip: (ji) => ji.joint.type === "rolling" && ji.joint.ratio !== undefined,
  build(ctx, c) {
    const marked = [c.a, c.b].filter((b) => timingMark(ctx, b, c.at));
    // a gear on a fixed hub sets the backlash by its hub, slid on slotted holes in the base; else the backlash eccentric
    // goes under the housing of the second gear's live shaft (F7)
    const hubbed = ctx.joints.find((q) => q.kit === "hub" && [q.a, q.b].some((x) => x === c.a || x === c.b));
    const s = hubbed ? undefined : (siteOf(ctx, c.b) ?? siteOf(ctx, c.a));
    if (s && s.live) ctx.eccentric.add(s.id);
    const F7 = hubbed ? [`${hubbed.id}-hub`] : s ? [`${s.id}-ecc`] : [];
    const how = hubbed ? `; the hub at ${hubbed.id} slides on slotted holes to set the backlash` : s ? `; eccentric housing on ${s.id} sets the backlash` : "";
    return { serves: { F9: marked, F7 }, note: `${titleOf(c.id)}: parallel mesh; timing marks on ${marked.join(" and ") || "the gears"}${how}.` };
  },
});

/** Gears of a crossed mesh get a shim pack at the back face and a thrust washer (F7, F4, F9). */
const j9 = contactRule({
  id: "j9-crossed-mesh",
  ids: ["J9", "F4", "F7", "F9"],
  fixture: "kin:crossedMesh",
  kits: ["J9"],
  build(ctx, c) {
    const marked = [c.a, c.b].filter((b) => timingMark(ctx, b, c.at));
    for (const b of [c.a, c.b]) {
      const s = siteOf(ctx, b);
      if (s) ctx.shim.set(b, 1);
    }
    return { serves: { F9: marked, F7: [c.a, c.b].map((b) => `${b}-shim`), F4: [c.a, c.b].map((b) => `${b}-tw`) }, note: `${titleOf(c.id)}: crossed-axis mesh; a 1 mm shim pack behind each gear sets the mounting distance (backlash, contact pattern), timing marks at the mesh.` };
  },
});

// ------------------------------------------------------------------------------------------------ J7 and cams

/**
 * J7: a cam and its follower. The record's roller (a disc body on a pin in the follower) is the roller, so the kit adds
 * none; a translating follower gets its return spring (F6), a compression spring stretched between a pin on the
 * follower's far end and a post past the guide's end stop, above the slide, pushing the follower onto the cam; a felt
 * oiler rides the follower behind the roller (F8); a zero line is engraved on the cam from its hub to its base circle
 * (F9). A swinging follower is held on its cam by its own linkage or by a form-closed partner and takes no spring.
 */
const camBuild: KitBuild = (ctx, c) => {
  const id = c.id;
  const isCam = (b: string) => String(ctx.geoms.get(b)?.shape.type) === "cam";
  // a rocker's nose on a follower (a desmodromic's opening finger on the stem's end): the rocker's own stack holds it
  if (!isCam(c.a) && !isCam(c.b)) return { serves: {}, note: `${titleOf(id)}: a rocker's nose on the follower; nothing to add, the rocker's pivot and the follower's guide hold both.` };
  const cam = isCam(c.b) ? c.b : c.a;
  const other = cam === c.a ? c.b : c.a;
  const camG = ctx.geoms.get(cam);
  const up = c.frame.z;
  const serves: Record<string, string[]> = {};
  const notes: string[] = [];
  // the translating follower: the other body, or the body it rides on a pin, on a prismatic joint to the ground
  const carriers = [other, ...ctx.kin.joints.filter((j) => j.type === "revolute" && (j.a === other || j.b === other)).map((j) => (j.a === other ? j.b : j.a))];
  const slide = ctx.kin.joints.find((j) => j.type === "prismatic" && (j.a === "ground" || j.b === "ground") && carriers.includes(j.a === "ground" ? j.b : j.a));
  const F = slide ? (slide.a === "ground" ? slide.b : slide.a) : null;
  const partF = F ? ctx.parts.get(F) : undefined;
  const exF = F ? ctx.extent(F) : null;
  if (F && slide && partF && exF && camG) {
    const r = ctx.joints.find((q) => q.id === slide.id)!.r;
    const centre = camG.frame.o;
    const away = v3.dot(v3.sub(c.at, centre), r.axis) >= 0 ? 1 : -1;
    const d = v3.unit(v3.mul(v3.perp(r.axis, up), away));
    const o = v3.sub(c.at, v3.mul(up, v3.dot(v3.sub(c.at, c.frame.o), up)));
    const Lf = new LocalFrame({ o, x: d, z: up }, { joints: [id] });
    const xOf = (p: readonly number[]) => v3.dot(v3.sub([p[0]!, p[1]!, p[2]!], o), d);
    const pts = partF.profile.outer.map((q) => fromPlane(partF.frame, q, 0));
    const far = Math.max(...pts.map(xOf));
    const top = v3.dot(v3.sub(fromPlane(exF.frame, [0, 0], exF.w1), o), up);
    // the stroke: the slide's limits, else how far the follower moves along its axis over the cycle
    const along = ctx.sampled.us.map((_, i) => v3.dot(ctx.xfOf(F, i).t, d));
    const travel = Math.max(1, slide.limits ? Math.abs(slide.limits[1] - slide.limits[0]) : Math.max(...along) - Math.min(...along));
    const Ds = 6;
    const zs0 = top + 3;
    const zs1 = zs0 + Ds;
    const xa = far - 6;
    const xb = far + travel + 18;
    const baseTop = ctx.base ? ctx.base.top - o[2] : baseZ(ctx, c);
    {
      Lf.add(H.shaft(`${id}-spin`, { d: 4, z0: top - 0.5, z1: zs1 + 1 }, { body: F, at: [xa, 0, 0], name: "Spring pin Ø4, pressed into the follower" }));
      Lf.add(H.standoff(`${id}-post`, { body: "ground", at: [xb, 0, 0], z0: baseTop, z1: zs1 + 1, name: "Spring post Ø8 on the base, M4" }));
    }
    // the spring at unit length along the follower's axis, stretched from the pin to the post each frame (D9)
    // from the pin's face to the post's (pin Ø4, post Ø8)
    const aW = v3.add(o, v3.add(v3.mul(d, xa + 2.5), v3.mul(up, (zs0 + zs1) / 2)));
    const bW = v3.add(o, v3.add(v3.mul(d, xb - 5.5), v3.mul(up, (zs0 + zs1) / 2)));
    const coil = H.spring(`${id}-spring`, "compression", { body: F, D: Ds, z0: zs0, z1: zs1, name: `Compression spring Ø${Ds}, wire 0.8: holds the follower on the cam` });
    coil.outer = [[0, -Ds / 2], [1, -Ds / 2], [1, Ds / 2], [0, Ds / 2]];
    coil.holes = [];
    coil.marks = [{ kind: "boss", pts: Array.from({ length: 13 }, (_, k): [number, number] => [k / 12, (k % 2 ? 1 : -1) * (Ds / 2 - 0.6)]) }];
    coil.at = [xa + 2.5, 0, 0];
    coil.stretch = [anchorName(F, aW), anchorName("ground", bW)];
    Lf.add(coil);
    // the felt oiler behind the roller, on the follower (F8)
    const rr = Number(ctx.geoms.get(other)?.shape.radius ?? 0);
    const exO = ctx.extent(other);
    if (rr > 0 && exO) {
      const z0 = v3.dot(v3.sub(fromPlane(exO.frame, [0, 0], exO.w0), o), up);
      const z1 = v3.dot(v3.sub(fromPlane(exO.frame, [0, 0], exO.w1), o), up);
      Lf.add(H.felt(`${id}-oil`, [[rr + 0.6, -3], [rr + 3.6, -3], [rr + 3.6, 3], [rr + 0.6, 3]], { body: F, z0: z0 + 1, z1: z1 - 1, name: "Felt oiler on the roller, oil-soaked wool felt" }));
      serves.F8 = [`${id}-oil`];
    } else if (!rr) {
      // a flat face: a felt pad on the foot beside the stem keeps the face oiled
      Lf.add(H.felt(`${id}-oil`, [[1, 9], [7, 9], [7, 15], [1, 15]], { body: F, z0: top, z1: top + 3, name: "Felt oiler on the follower's foot, oil-soaked wool felt" }));
      serves.F8 = [`${id}-oil`];
    }
    ctx.add(Lf.out());
    serves.F6 = [`${id}-spring`, `${id}-post`, `${id}-spin`];
    notes.push(`a compression spring between a pin on the follower and a post past the guide holds the follower on the cam (${travel.toFixed(0)} mm stroke)`);
  } else notes.push("the follower is held on the cam by its own linkage or a form-closed partner");
  // the zero line on the cam, from its hub to its base circle, toward the follower at the reference (F9)
  const part = ctx.parts.get(cam);
  if (part && camG) {
    const p = planeCoords(part.frame, c.at).uv;
    const rIn = Number(camG.shape.bore ?? 8) / 2 + 5;
    const rOut = Math.min(...part.profile.outer.map(([x, y]) => Math.hypot(x, y))) - 2;
    const L0 = Math.hypot(p[0], p[1]) || 1;
    if (rOut > rIn) {
      part.marks.push({ kind: "timing", pts: [[(p[0] / L0) * rIn, (p[1] / L0) * rIn], [(p[0] / L0) * rOut, (p[1] / L0) * rOut]] });
      serves.F9 = [cam];
    }
  }
  return { serves, note: `${titleOf(id)}: ${other === F ? "follower" : "roller follower on its pin"}; ${notes.join("; ")}; felt oiler; zero line on the cam.` };
};
const j7 = contactRule({ id: "j7-cam", ids: ["J7", "F6"], fixture: "kin:camFollower", kits: ["J7"], build: camBuild });

// ------------------------------------------------------------------------------------------------ J8 / J12

/** An idler on the slack span: a flanged flat pulley on a stud through an arm slotted across the span, on two posts (F7, F10). */
function idler(ctx: BuildCtx, c: Contact, L: Local, what: string): ReturnType<KitBuild> {
  const id = c.id;
  const ga = ctx.geoms.get(c.a);
  const gb = ctx.geoms.get(c.b);
  const pa = ga ? ga.frame.o : c.at;
  const pb = gb ? gb.frame.o : c.at;
  const span = v3.sub(pb, pa);
  const mid3 = v3.add(pa, v3.mul(span, 0.35));
  const along = v3.unit(span);
  const nrm = v3.cross(c.frame.z, along);
  const R = 9;
  const z = mid(c.za, mid(c.zb));
  const p0 = planeCoords(c.frame, c.at).uv;
  const tries: Vec2[] = [];
  for (const side of [1, -1]) for (const off of [14, 20, 28, 40]) tries.push([side * off, 0]);
  const centre = planeCoords(c.frame, mid3).uv;
  const nuv = planeCoords({ ...c.frame, o: [0, 0, 0] }, nrm).uv;
  const spot = freeSpot(ctx, centre, R, tries.map(([s]) => [nuv[0] * s, nuv[1] * s] as Vec2), c.frame.o[2] + z - 6, c.frame.o[2] + z + 8);
  if (!spot) {
    ctx.issues.push(`${id}: no free place for an idler on the span`);
    return { note: `${titleOf(id)}: ${what}; no free place for the idler found.` };
  }
  const q: Vec2 = [spot[0] - p0[0], spot[1] - p0[1]];
  L.add(H.bearing(`${id}-idler-brg`, ROLLER, { at: [q[0], q[1], 0], z0: z - 2.5, z1: z + 2.5, closure: "seal" }));
  L.add(H.solid(`${id}-idler`, { name: `Flat idler Ø${2 * R}, flanged`, kind: "pulley", role: "hw", mat: "Aluminium 6061-T6, anodised", outer: circle(R, q[0], q[1], 36), holes: [circle(ROLLER.D / 2, q[0], q[1], 24)], z0: z - 3, z1: z + 3, D: 2 * R }));
  L.add(H.plate(`${id}-arm`, roundRect(q[0] - 6, q[1] - 22, q[0] + 6, q[1] + 22, 3), { kind: "bracket", role: "ground", name: "Idler arm, slotted across the span", z0: z + 4, z1: z + 8, holes: [stadium(q[1] - 12, q[1] + 12, 2.6).map(([a, b]): Vec2 => [q[0] + b * 0 + (a - q[1]) * 0 + 0, a])] }));
  void idler;
  return { serves: { F7: [`${id}-arm`], F10: [`${id}-idler`] }, note: `${titleOf(id)}: ${what}; idler on a sealed bearing on a stud through an arm slotted across the span, for the take-up.` };
}

const j8 = contactRule({ id: "j8-belt", ids: ["J8", "V4"], fixture: "kin:beltDrive", kits: ["J8"], build: (ctx, c, L) => idler(ctx, c, L, "belt") });
// a timing belt between two pulleys is built by src/builder/flexible.ts
const j12 = contactRule({ id: "j12-other", ids: ["J12", "F7"], fixture: "kin:cableLoop", kits: ["J12"], skip: (ji) => ["belt", "chain", "rope", "cvt"].includes(String((ji.joint as unknown as Record<string, unknown>).flexible)), build: (ctx, c, L) => idler(ctx, c, L, "flexible member") });

const strapSheave = contactRule({
  id: "strap-sheave",
  ids: ["J12", "F1", "F2", "A11"],
  fixture: "kin:rope",
  kits: ["strap-sheave"],
  // a rope reeved over sheaves is built by src/builder/flexible.ts
  skip: (ji) => String((ji.joint as unknown as Record<string, unknown>).flexible) === "rope" && !!(ji.joint as unknown as Record<string, unknown>).ends,
  build(ctx, c, L) {
    const id = c.id;
    const z = mid(c.za, mid(c.zb));
    L.add(H.dowel(`${id}-becket`, 4, { body: "ground", at: [8, 0, 0], z0: z - 5, z1: z + 5, name: "Becket pin Ø4, in a post screwed to the base" }));
    L.add(H.collar(`${id}-thimble`, 4, 10, { body: "ground", at: [8, 0, 0], z0: z - 2, z1: z + 2, name: "Thimble Ø10 on the becket pin" }));
    L.add(H.plate(`${id}-guard`, roundRect(-16, -16, 16, 16, 4), { body: "ground", kind: "bracket", role: "ground", name: "Guard over the sheave, keeps the rope in its groove", z0: z + 4, z1: z + 6.5 }));
    return { serves: { F1: [`${id}-becket`], F2: [`${id}-guard`] }, note: `${titleOf(id)}: rope end on a becket pin with a thimble; a guard over the sheave keeps the rope in its groove.` };
  },
});

// J11 is src/builder/screws.ts, J13 src/builder/compliant.ts

// ------------------------------------------------------------------------------------------------ the missing kinds

const pallet = contactRule({
  id: "pallet-contact",
  ids: ["J7", "F6", "M14"],
  fixture: "kin:escapement",
  kits: ["pallet"],
  build(ctx, c, L) {
    const id = c.id;
    const pal = c.a;
    const z0 = ctx.extent(pal)?.w0 ?? 0;
    const z1 = ctx.extent(pal)?.w1 ?? z0 + 6;
    L.add(H.wearStrip(`${id}-stone`, [[-4, -1.2], [4, -1.2], [4, 1.2], [-4, 1.2]], { body: bodyOf(ctx, pal), z0: z0 + 0.5, z1: z1 - 0.5, name: "Pallet stone, hardened, set in the pallet" }));
    L.add(H.setScrew(`${id}-ss`, 2, { body: bodyOf(ctx, pal), at: [0, 2.5, 0], z0: z0 + 1, z1: z1 - 1, outer: circle(1, 0, 0, 12), name: "Set screw M2, adjusts the pallet stone" }));
    return { serves: { M14: [`${id}-stone`], F6: [`${id}-ss`] }, note: `${titleOf(id)}: pallet contact; a hardened pallet stone set in the pallet and held by a set screw for the adjustment.` };
  },
});

const forkPin = contactRule({
  id: "fork-pin",
  ids: ["J4", "F2"],
  fixture: "kin:fork",
  kits: ["fork-pin"],
  build(ctx, c, L) {
    const id = c.id;
    const z = mid(c.zb, mid(c.za));
    L.add(H.roller(`${id}-pin`, 2, 5, { body: bodyOf(ctx, c.a), z0: z - 2, z1: z + 2, name: "Impulse pin Ø5, jewelled, on the balance" }));
    L.add(H.dowel(`${id}-guard`, 2, { body: bodyOf(ctx, c.b), at: [6, 6, 0], z0: z - 3, z1: z + 3, name: "Guard pin Ø2, keeps the lever from tripping" }));
    return { serves: { F2: [`${id}-pin`] }, note: `${titleOf(id)}: impulse pin in the fork; a guard pin beside the fork mouth.` };
  },
});

/**
 * A pawl (or a jumper) on a tooth: a torsion spring coiled round the pawl's own pivot, above the pawl, one leg on a pin in
 * the base and the other on the pawl, holds it onto the teeth (F6); it stays inside the base whatever the pawl does.
 */
const pawlTooth = contactRule({
  id: "pawl-tooth",
  ids: ["J7", "F6", "F5"],
  fixture: "kin:ratchet",
  kits: ["pawl-tooth"],
  build(ctx, c) {
    const id = c.id;
    const pawl = [c.a, c.b].find((b) => { const r = ctx.kin.bodies.find((q) => q.id === b)?.role; return r === "pawl" || r === "spring"; }) ?? c.a;
    // the pawl's pivot: on the ground (a holding pawl, a jumper) or on the body that carries it (a driving pawl on a lever)
    const pivot = ctx.joints.find((j) => j.joint.type === "revolute" && (j.a === pawl || j.b === pawl) && ![c.a, c.b].includes(j.a === pawl ? j.b : j.a));
    const carrier = pivot ? (pivot.a === pawl ? pivot.b : pivot.a) : "ground";
    const ex = ctx.extent(pawl);
    if (!pivot || !ex) return { note: `${titleOf(id)}: pawl on a tooth.` };
    const z = pivot.axis;
    // the top of the pawl's own part where it stands (a part placed by its joint is not on a slab)
    const part = ctx.parts.get(pawl);
    const top = part && part.op.op === "extrude" ? v3.dot(v3.sub(part.frame.o as Vec3, pivot.at), z) + part.op.h : v3.dot(v3.sub(fromPlane(ex.frame, [0, 0], ex.w1), pivot.at), z);
    const L = new LocalFrame({ o: pivot.at, x: [1, 0, 0], z }, { joints: [id] });
    const stack = ctx.stacks.get(pivot.site ?? pivot.id);
    const d = stack?.d ?? 4;
    // the coil sits on the pawl's boss, round the pin's head
    const D = d + 9;
    L.add(H.spring(`${id}-spring`, "torsion", { body: carrier, D, wire: 0.8, z0: top + 0.3, z1: top + 3.3, name: `Torsion spring Ø${D}, wire 0.8: holds the pawl on the teeth` }));
    ctx.add(L.out());
    return { serves: { F6: [`${id}-spring`] }, note: `${titleOf(id)}: pawl on a tooth; a torsion spring round its pivot holds it on the teeth.` };
  },
});

const tongueSlot = contactRule({
  id: "tongue-slot",
  ids: ["J5", "F8", "M14"],
  fixture: "kin:tongueSlot",
  kits: ["tongue-slot"],
  build(ctx, c, L) {
    const id = c.id;
    const z = mid(c.zb, mid(c.za));
    const run = Math.max(8, c.run[1] - c.run[0]);
    // the slotted body names its slot (`slot: { width, length }`): the liners line its walls, the nipple greases it from
    // its far end, pointing out along it (an Oldham hub, whose face the disc sweeps over); else a narrow slot in b
    const shapeOf = (b: string) => ctx.kin.bodies.find((q) => q.id === b)?.shape as { slot?: { width?: number; length?: number } } | undefined;
    const slotted = [c.b, c.a].find((b) => shapeOf(b)?.slot);
    const slot = slotted ? shapeOf(slotted)!.slot! : undefined;
    const body = bodyOf(ctx, slotted ?? c.b);
    const half = slot?.width ? slot.width / 2 - 0.6 : 4;
    // the slot's walls are the slotted body's jaws (`bars`) where it has them: the liners run their height
    const g0 = slotted ? ctx.geoms.get(slotted) : undefined;
    const jaws = (g0?.shape.bars as { z?: [number, number] }[] | undefined)?.map((b) => b.z).filter((q): q is [number, number] => Array.isArray(q));
    const wz = (h: number) => (g0 ? planeCoords(L.frame, v3.add(g0.frame.o, v3.mul(g0.frame.z, h))).w : z);
    const [lz0, lz1] = jaws?.length ? ([wz(Math.min(...jaws.map((q) => q[0]))), wz(Math.max(...jaws.map((q) => q[1])))].sort((p, q) => p - q) as [number, number]) : [z - 2, z + 2];
    for (const [k, y] of [[0, half], [1, -half]] as const) L.add(H.wearStrip(`${id}-liner${k}`, [[-run / 2 - 4, y - 0.6], [run / 2 + 4, y - 0.6], [run / 2 + 4, y + 0.6], [-run / 2 - 4, y + 0.6]], { body, z0: lz0 + 0.5, z1: lz1 - 0.5, ...(k ? { name: "", qty: 0 } : { qty: 2 }) }));
    if (slot?.length && slotted) {
      // the slot runs symmetric about the slotted body's centre; the nipple stands at its end beyond the liners
      const g = ctx.geoms.get(slotted);
      const cx = g ? planeCoords(L.frame, g.frame.o).uv[0] : 0;
      // at whichever end of the slot it keeps clear of the supports and the other parts' sweeps
      const at = (sg: 1 | -1) => {
        const f = { o: fromPlane(L.frame, [cx + (sg * (slot.length ?? 0)) / 2, 0], (lz0 + lz1) / 2), x: L.frame.z, z: v3.mul(L.frame.x, sg) };
        const N = new Local(f, { joints: [id] });
        N.add(H.nipple(`${id}-nip`, { body, z0: 0, z1: 9 }));
        return N.out();
      };
      const plus = at(1);
      ctx.add(clearance(ctx, plus, (q) => q.body === body) >= MIN_GAP ? plus : at(-1));
    } else L.add(H.nipple(`${id}-nip`, { body, at: [0, 9, 0], z0: z, z1: z + 9 }));
    return { serves: { M14: [`${id}-liner0`], F8: [`${id}-nip`] }, note: `${titleOf(id)}: tongue in its slot; liners on both sides and a grease nipple into the slot.` };
  },
});

const ringHub = contactRule({
  id: "ring-hub",
  ids: ["J3", "F2"],
  fixture: "kin:ringHub",
  kits: ["ring-hub"],
  build(ctx, c, L) {
    const id = c.id;
    const z = ctx.extent(c.a)?.w1 ?? 0;
    L.add(H.retainerPlate(`${id}-ret`, 14, 26, { body: "ground", z0: z + 0.5, z1: z + 2.5, name: "Retainer ring over the ring on its hub" }));
    return { serves: { F2: [`${id}-ret`] }, note: `${titleOf(id)}: ring on its hub, held by a retainer ring.` };
  },
});

const ringRollers = contactRule({
  id: "ring-rollers",
  ids: ["J6", "F2"],
  fixture: "kin:ringRollers",
  kits: ["ring-rollers"],
  build(ctx, c, L) {
    const id = c.id;
    const z = mid(c.za, mid(c.zb));
    L.add(H.washer(`${id}-cage`, 36, 42, { body: bodyOf(ctx, c.a), z0: z - 1.5, z1: z + 1.5, name: "Roller cage ring, keeps the rollers apart" }));
    return { serves: { F2: [`${id}-cage`] }, note: `${titleOf(id)}: ring on rollers; a cage ring keeps the rollers apart.` };
  },
});

// ------------------------------------------------------------------------------------------------ eccentric

/**
 * A sheave turning in its strap (an eccentric): the strap's bore lined with a split bronze liner on the sheave's rim, a
 * cheek ring screwed to the sheave's top face lapping the strap, which its pin at the far end locates the other way
 * (F2), an oil nipple on the strap's ring (F8). The journal is the sheave itself, so there is no pin.
 */
const eccentric = contactRule({
  id: "eccentric",
  ids: ["J3", "F2", "F8", "M14"],
  fixture: "eccentric-sheave",
  kits: ["eccentric"],
  build(ctx, c, L) {
    const id = c.id;
    const rec = c.ji.joint as unknown as { radius: number };
    const R = rec.radius;
    const sheave = ctx.kin.bodies.find((b) => b.id === c.a)?.shape?.type === "disc" ? c.a : c.b;
    const strap = sheave === c.a ? c.b : c.a;
    const zs = ctx.extent(sheave);
    const zt0 = ctx.extent(strap);
    // a strap with a plate of its own on top (a rotor's gear ring) runs on the eccentric with its lower plate
    const tg = ctx.geoms.get(strap);
    const zt = zt0 && tg?.upper ? { ...zt0, w1: zt0.w1 - tg.upper.h } : zt0;
    const z0 = Math.min(zs?.w0 ?? -4, zt?.w0 ?? -4);
    // the sheave's own plate: its slab may be taller (a rotor's gear ring stands over it)
    const sp = ctx.parts.get(sheave);
    const zsTop = zs && sp && sp.op.op === "extrude" ? zs.w0 + sp.op.h : (zs?.w1 ?? 4);
    const z1 = Math.max(zsTop, zt?.w1 ?? 4);
    const bore = ((ctx.kin.bodies.find((b) => b.id === strap)?.shape as { bore?: number } | undefined)?.bore ?? R + 2);
    L.add(H.bushing(`${id}-liner`, 2 * R + 0.1, 2 * bore, { body: bodyOf(ctx, strap), z0: (zt?.w0 ?? z0) + 0.3, z1: (zt?.w1 ?? z1) - 0.3, name: `Split bronze liner ${2 * R}x${2 * bore}, in the strap round the sheave` }));
    const lap = bore + 2;
    L.add(H.washer(`${id}-cheek`, 2 * R - 10, 2 * lap, { body: bodyOf(ctx, sheave), z0: z1 + 0.3, z1: z1 + 2.3, name: `Cheek ring ${2 * R - 10}x${2 * lap}, screwed to the sheave, laps the strap` }));
    // the nipple on the strap's ring, outside the cheek ring, on the side away from the rod; a strap with a plate on top
    // of it is oiled through the shaft instead
    const nip = !tg?.upper;
    if (nip) L.add(H.nipple(`${id}-nip`, { body: bodyOf(ctx, strap), at: [-(lap + NIPPLES.s / 2 + 2), 0, 0], z0: zt?.w1 ?? z1, z1: (zt?.w1 ?? z1) + 9 }));
    const part = ctx.parts.get(strap);
    if (part) part.slides = [...(part.slides ?? []), `${id}-cheek`];
    return {
      serves: { F2: [`${id}-cheek`], F8: nip ? [`${id}-nip`] : [], M14: [`${id}-liner`] },
      note: `${titleOf(id)}: the Ø${2 * R} eccentric turns in its strap on a split bronze liner (the replaceable wear part); a cheek ring on the eccentric's top face laps the strap, ${nip ? "whose pin at the rod end locates it the other way; an oil nipple on the strap's ring feeds the liner" : "whose own gear ring keeps it in mesh the other way; oil comes up through the shaft"}.`,
    };
  },
});

// ------------------------------------------------------------------------------------------------ die

/**
 * A die in a curved link's slot (an expansion link): a bronze die, round so it sits any way in the curve, on a hardened
 * stud pressed into the pin carrier, running in the slotted upper cheek over the solid lower one (M14: the die is the
 * wear part).
 */
const die = contactRule({
  id: "die",
  ids: ["J4", "M14"],
  fixture: "walschaerts-valve-gear",
  kits: ["die"],
  build(ctx, c, L) {
    const id = c.id;
    const g = ctx.geoms.get(c.b);
    const zl = ctx.extent(c.b);
    const za = ctx.extent(c.a);
    if (!g?.upper || !zl || !za) return { note: `${titleOf(id)}: pin in a curved slot.` };
    const sa = (g.shape.profile as { slotArc?: { width?: number } }).slotArc ?? {};
    const D = (sa.width ?? 15) - 0.4;
    const z0 = zl.w1 - g.upper.h + 0.3;
    const z1 = zl.w1 - 0.3;
    // a pin through the same point (the lifting link's on the radius rod) carries the die on a spigot down from its
    // lowest part; else a stud pressed into the pin carrier does
    const site = ctx.sites.find((s) => !s.fixed && v3.dist(s.at, c.at) < 0.05);
    const lowest = site ? site.bodies.map((b) => ({ b, e: ctx.extent(b) })).filter((x) => x.e).sort((x, y) => x.e!.w0 - y.e!.w0)[0] : undefined;
    const carrier = lowest ? lowest.b : bodyOf(ctx, c.a);
    const top = lowest ? lowest.e!.w0 : za.w0 + Math.min(6, za.w1 - za.w0 - 1);
    L.add(H.roller(`${id}-die`, 6, D, { body: carrier, z0, z1, name: `Die, bronze, Ø${+D.toFixed(1)}, runs in the link's slot` }));
    L.add(H.shaft(`${id}-stud`, { d: 6, z0: z0 - 0.2, z1: top }, { body: carrier, name: lowest ? "Die spigot Ø6, screwed into the pin below its lowest part" : "Die stud Ø6, hardened, pressed into the pin carrier" }));
    return { serves: { M14: [`${id}-die`] }, note: `${titleOf(id)}: a round bronze die on a hardened stud runs in the link's curved slot, in the upper cheek over the solid lower one that carries the trunnion; the die is the replaceable wear part.` };
  },
});

// ------------------------------------------------------------------------------------------------ hub

/**
 * A part that turns on a fixed hub (a bull gear round the pivot of the lever it drives): the hub a post of the radius
 * the joint gives, screwed to the base, the part on a split bronze liner round it, a cap ring screwed on the hub's top
 * lapping the part (F2). Another pivot may stand inside the hub: the cap is a ring round it.
 */
const hub = contactRule({
  id: "hub",
  ids: ["J1", "F1", "F2", "M14"],
  fixture: "whitworth",
  kits: ["hub"],
  build(ctx, c, L) {
    const id = c.id;
    const R = (c.ji.joint as unknown as { radius: number }).radius;
    const part = c.a === "ground" ? c.b : c.a;
    const ze = ctx.extent(part);
    const pp = ctx.parts.get(part);
    if (!ze || !pp || !ctx.base) return { note: `${titleOf(id)}: a part on a fixed hub.` };
    const top = ze.w0 + (pp.op.op === "extrude" ? pp.op.h : ze.w1 - ze.w0);
    const baseTop = baseZ(ctx, c);
    const bore = (ctx.kin.bodies.find((b) => b.id === part)?.shape as { bore?: number } | undefined)?.bore;
    const rb = bore ? bore / 2 : R + 2;
    L.add(H.plate(`${id}-hub`, circle(R, 0, 0, 96), { body: "ground", kind: "housing", role: "ground", name: `Fixed hub Ø${2 * R}, screwed to the base`, z0: baseTop, z1: top - 0.3, mat: "Steel C45, ground" }));
    L.add(H.bushing(`${id}-liner`, 2 * R + 0.1, 2 * rb, { body: bodyOf(ctx, part), z0: ze.w0 + 0.3, z1: top - 0.3, name: `Split bronze liner ${2 * R}x${2 * rb}, in the part round the hub` }));
    const ri = R - 3;
    L.add(H.plate(`${id}-cap`, circle(rb + 2, 0, 0, 96), { body: "ground", kind: "plate", role: "ground", name: `Cap ring Ø${2 * (rb + 2)}, screwed on the hub, laps the part`, z0: top + 0.3, z1: top + 2.3, holes: [circle(ri, 0, 0, 64).reverse()], mat: "Steel, hardened" }));
    for (let k = 0; k < 3; k++) {
      const a = Math.PI / 6 + (k * 2 * Math.PI) / 3;
      L.add(H.screw(`${id}-sc${k}`, "csk", 3, 8, { body: "ground", at: [(R - 1.5) * Math.cos(a), (R - 1.5) * Math.sin(a), 0], face: top + 2.3, dir: -1, ...(k ? { name: "", qty: 0 } : { qty: 3 }) }));
    }
    const pt = ctx.parts.get(part);
    if (pt) pt.slides = [...(pt.slides ?? []), `${id}-cap`, `${id}-hub`];
    return {
      serves: { F1: [`${id}-hub`], F2: [`${id}-cap`], M14: [`${id}-liner`] },
      note: `${titleOf(id)}: the part turns on a fixed hub Ø${2 * R} screwed to the base through slotted holes (it slides to set a mesh's backlash), on a split bronze liner (the wear part); a cap ring on the hub's top laps it; a pivot that stands inside it rises through the hub.`,
    };
  },
});

export const contactRules: Rule[] = [eccentric, die, hub, j6, j9, j4, pinLobe, grooveCam, j5, j7, pallet, forkPin, pawlTooth, tongueSlot, ringHub, ringRollers, j8, j12, strapSheave];

void MIN_GAP;
void ringOffsets;
