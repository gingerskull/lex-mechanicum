// The first rules: read the joints (A1, A2), place the bodies on their slabs (A18) and level the base (A7).
import { circle, roundRect, type Vec2 } from "../../core/geom";
import { rungOf } from "../../style/detail";
import { H } from "../../hardware/primitives";
import { pillowRise } from "../../hardware/sub/pillow";
import { PULLEYS, SENSOR } from "../../hardware/tables";
import { extrudeOp, revolveOp } from "../../solids/tessellate";
import type { Solid3 } from "../../solids/types";
import { type BuildCtx } from "../ctx";
import { BASE_GAP, BASE_T } from "../constants";

/** Room under a ring gear's rim for its carrier rollers' lower flanges and posts (ring-carrier), mm. */
const RING_ROOM = 9;
import { fromPlane, place, planeCoords } from "../frames";
import { titleOf } from "../lib";
import { edgeDist } from "../planar";
import { inside } from "../../core/poly";
import { worldPoints } from "../sweeps";
import { v3 } from "../../kin/math";
import type { Rule } from "./types";

const BODY_ROLE: Record<string, Solid3["role"]> = { driver: "driver", output: "output", frame: "ground" };

export const classify: Rule = {
  id: "classify",
  tier: "AUTO",
  ids: ["A1", "A2", "A3"],
  fixture: "four-bar",
  applies: () => true,
  apply(ctx) {
    for (const j of ctx.joints) (ctx.fired.classify ??= []).push(`${j.id}:${j.kit}`);
    for (const b of ctx.kin.bodies) {
      if (b.id === "ground") continue;
      // a body with a frame of its own and no joint is fixed there (a plate) or carried by a block (a flexspline's segment)
      if (!ctx.joints.some((j) => j.a === b.id || j.b === b.id) && !(b.frame && typeof b.frame === "object")) ctx.issues.push(`body ${b.id} has no joint`);
    }
    const approx = [...ctx.geoms.values()].filter((g) => g.approx).map((g) => g.id);
    if (approx.length) ctx.issues.push(`outline is a stand-in until the pilots give it a profile: ${approx.join(", ")}`);
  },
};

/** Radius of the boss round a pin: its distance to the part's outer edge. */
export function bossRadius(ctx: BuildCtx, body: string, joint: string): number {
  const g = ctx.geoms.get(body);
  const pin = g?.pins.find((p) => p.joint === joint);
  if (!g || !pin) return 8;
  return edgeDist(g.profile.outer, pin.uv[0], pin.uv[1]);
}

export const placement: Rule = {
  id: "placement",
  tier: "AUTO",
  ids: ["A10", "A18"],
  fixture: "four-bar",
  applies: () => true,
  apply(ctx) {
    for (const [id, g] of ctx.geoms) {
      const slab = ctx.extent(id);
      if (!slab && !g.exact && !g.level) continue;
      const fam = slab?.frame ?? (g.level ? ctx.extent(g.level.with)?.frame : undefined) ?? g.frame;
      // a body that stands where its joints put it (a bevel gear on its pitch cone, a yoke and a cross on their centre)
      // is placed there, wherever a slab would put it
      let o = g.exact || !slab ? v3.add(g.frame.o, v3.mul(g.frame.z, g.exact?.offset ?? 0)) : fromPlane(fam, planeCoords(fam, g.frame.o).uv, slab.w0);
      // a body at another body's level: its lower or upper plate, all of it, or above it
      const lv = g.level;
      const host = lv ? ctx.extent(lv.with) : undefined;
      const hg = lv ? ctx.geoms.get(lv.with) : undefined;
      if (lv && host && hg) {
        const lowerH = hg.upper ? hg.thick - hg.upper.h : hg.thick;
        const w = host.w0 + (lv.part === "upper" ? lowerH : lv.part === "above" ? hg.thick : 0) + (lv.gap ?? 0);
        o = fromPlane(host.frame, planeCoords(host.frame, g.frame.o).uv, w);
      }
      const body = ctx.kin.bodies.find((b) => b.id === id)!;
      // a second set of like links (`set: "B"`, a Schmidt coupling's) takes a pattern of its own (T16)
      const set = (body as { set?: unknown }).set;
      const role = BODY_ROLE[body.role] ?? (set !== undefined && set !== "A" ? "link2" : "link");
      const frame = { o, x: g.frame.x, z: g.exact ? g.frame.z : fam.z };
      // a boss ring round each pin the part carries (a joint off the part, a slide's line, has none)
      const marks: Solid3["marks"] = g.part ? [] : g.pins.filter((p) => inside(g.profile.outer, p.uv)).map((p) => ({ kind: "boss" as const, pts: circle(Math.max(1.5, edgeDist(g.profile.outer, p.uv[0], p.uv[1]) - 1.6), p.uv[0], p.uv[1], 36) }));
      // an index mark (`indexMark: { at: [x, y] }`): a bold radial arrow engraved on the part, so parts that keep the
      // same orientation show it (a Schmidt coupling's three discs)
      const im = (g.shape.indexMark as { at?: number[] } | undefined)?.at;
      if (Array.isArray(im) && im.length >= 2) {
        const L = Math.hypot(im[0]!, im[1]!) || 1;
        const u: [number, number] = [im[0]! / L, im[1]! / L];
        const v: [number, number] = [-u[1], u[0]];
        const at = (s: number, w: number): [number, number] => [u[0] * s + v[0] * w, u[1] * s + v[1] * w];
        for (const w of [-0.8, 0, 0.8]) marks.push({ kind: "index" as const, pts: [at(L - 14, w), at(L, w)] });
        marks.push({ kind: "index" as const, pts: [at(L - 4, -3), at(L + 2, 0), at(L - 4, 3), at(L - 4, -3)] });
      }
      const part: Solid3 = {
        id,
        name: titleOf(id),
        role,
        kind: "part",
        body: id,
        frame,
        profile: g.part ? { outer: [...g.part.profile.outer], holes: g.part.profile.holes.map((h) => [...h]) } : { outer: [...g.profile.outer], holes: g.profile.holes.map((h) => [...h]) },
        op: g.part ? g.part.op : g.revolve ? revolveOp(g.profile) : g.loft ? { op: "loft", sections: [{ z: 0, outer: [...g.profile.outer], holes: g.profile.holes.map((h) => [...h]) }, ...g.loft] } : extrudeOp(g.upper ? (g.upper.lower ?? g.thick - g.upper.h) : g.thick, { ...(g.scaleTop !== undefined ? { scaleTop: g.scaleTop } : {}), ...(g.twist ? { twist: g.twist } : {}) }),
        ...(g.features?.length ? { features: g.features } : {}),
        marks,
        ex: 0,
        joints: g.pins.map((p) => p.joint),
        detail: rungOf({ kind: "part", role }).id,
        flags: { ...(ctx.principle.has(id) ? {} : {}) },
      };
      ctx.parts.set(id, part);
      (ctx.fired.placement ??= []).push(id);
      // a compound gear's further levels, each on its own slab above the part (keyed to the same shaft)
      (g.levels ?? []).forEach((L, i) => {
        const r = ctx.extent(`${id}#${i + 1}`);
        if (!r) return;
        // a joined level runs down to the top of the part under it, one piece through the gap (a long pinion)
        const w = L.joined && slab ? Math.min(r.w0, slab.w0 + g.thick) : r.w0;
        const lo = fromPlane(r.frame, planeCoords(r.frame, g.frame.o).uv, w);
        const lv: Solid3 = { ...part, id: L.z ? `${id}-z${L.z}${L.joined ? "-upper" : ""}` : `${id}-disc`, name: L.z ? `${titleOf(id)}, ${L.joined ? "upper half" : `${L.z}-tooth ${String(g.shape.type) === "link" ? "gear fixed on it" : "level"}`}` : `${titleOf(id)}, flywheel disc`, frame: { o: lo, x: g.frame.x, z: r.frame.z }, profile: { outer: [...L.profile.outer], holes: L.profile.holes.map((h) => [...h]) }, op: extrudeOp(L.thick + r.w0 - w), marks: [], joints: [...part.joints] };
        ctx.levels.set(id, [...(ctx.levels.get(id) ?? []), lv]);
        (ctx.fired.placement ??= []).push(lv.id);
      });
      // a slotted upper cheek on the solid lower one
      if (g.upper) {
        const lift = g.upper.lift ?? g.thick - g.upper.h;
        ctx.add({ ...part, id: `${id}-cheek`, name: `${titleOf(id)}, ${g.upper.name ?? "upper plate"}`, frame: { ...frame, o: v3.add(o, v3.mul(frame.z, lift)) }, profile: { outer: [...g.upper.profile.outer], holes: g.upper.profile.holes.map((h) => [...h]) }, op: extrudeOp(g.upper.h), marks: [], joints: [...part.joints] });
      }
      for (const pc of g.pieces ?? [])
        ctx.add({ ...part, id: pc.id, name: pc.name, frame: pc.frame, profile: { outer: [...pc.profile.outer], holes: pc.profile.holes.map((h) => [...h]) }, op: pc.op ?? (pc.revolve ? revolveOp(pc.profile) : extrudeOp(pc.h)), ...(pc.features?.length ? { features: pc.features } : { features: [] }), marks: [], joints: [...part.joints] });
    }
    for (const c of ctx.placement.clevis) {
      const part = ctx.parts.get(c.twin);
      const fam = ctx.placement.families[ctx.placement.slab.get(c.twin)![0]]!;
      if (!part) continue;
      const w0 = fam.w0[c.slab]!;
      const base = planeCoords(fam.frame, part.frame.o);
      const twin: Solid3 = { ...part, id: `${c.twin}-b`, name: "", frame: { ...part.frame, o: fromPlane(fam.frame, base.uv, w0) }, marks: part.marks, joints: [...part.joints] };
      ctx.twins.set(c.twin, twin);
      (ctx.fired.placement ??= []).push(twin.id);
    }
  },
};

/** The lowest world z of everything built so far. */
export function lowestZ(ctx: BuildCtx, below = Infinity): number {
  let z = Infinity;
  for (const s of ctx.solids) for (const p of worldPoints(ctx.M, s)) if (p[2] < z && p[2] < below) z = p[2];
  return z;
}

/** A hole ring turned clockwise, as the base's holes are. */
const clockwise = (r: readonly (readonly [number, number])[]): Vec2[] => {
  const a = r.reduce((s, p, i) => s + p[0] * r[(i + 1) % r.length]![1] - r[(i + 1) % r.length]![0] * p[1], 0);
  const pts = r.map((p): Vec2 => [p[0], p[1]]);
  return a > 0 ? pts.reverse() : pts;
};

export const base: Rule = {
  id: "base",
  tier: "AUTO",
  ids: ["A7", "D4", "M4"],
  fixture: "four-bar",
  applies: () => true,
  apply(ctx) {
    const b = ctx.sweeps.bounds();
    const zLow = b ? b[2] : 0;
    let top = zLow - BASE_GAP;
    for (const s of ctx.sites) {
      if (!s.fixed || !s.inPlan) continue;
      const lo = zLow - 60;
      void lo;
      const reach = 60;
      const zAt = Math.min(s.at[2] - reach * Math.abs(s.axis[2]), s.at[2] + reach * Math.abs(s.axis[2]));
      top = Math.min(top, zAt - pillowRise(10));
      // the drive's pulley on an input shaft in plan carries a home flag round with it: the base stays clear of its sweep
      const input = ctx.kin.drivers.some((d) => d.joint && s.joints.includes(d.joint) && d.kind !== "select");
      if (input && Math.abs(s.axis[2]) < 0.1) top = Math.min(top, s.at[2] - (PULLEYS[32].fd / 2 + 1 + SENSOR.depth - 1.5) - 2);
    }
    // a ring on carrier rollers needs room under its rim for the rollers' lower flanges and their posts
    for (const j of ctx.joints) {
      if (j.kit !== "ring-carrier") continue;
      const ring = ctx.parts.get(j.a === "ground" ? j.b : j.a);
      if (ring) top = Math.min(top, ring.frame.o[2] - RING_ROOM);
    }
    ctx.base = { top, bottom: top - BASE_T, outline: [] };
    (ctx.fired.base ??= []).push(`level ${top.toFixed(1)}`);
  },
  after(ctx) {
    const bs = ctx.base!;
    let x0 = Infinity;
    let y0 = Infinity;
    let x1 = -Infinity;
    let y1 = -Infinity;
    const grow = (p: readonly number[]) => {
      x0 = Math.min(x0, p[0]!);
      x1 = Math.max(x1, p[0]!);
      y0 = Math.min(y0, p[1]!);
      y1 = Math.max(y1, p[1]!);
    };
    const bb = ctx.sweeps.bounds();
    if (bb) {
      grow([bb[0], bb[1]]);
      grow([bb[3], bb[4]]);
    }
    for (const s of ctx.solids) {
      if (s.body !== "ground" || s.flags.isBase) continue;
      if (!["standoff", "bridge", "housing", "plate", "foot", "bracket", "motor", "pulley", "belt", "sensor", "terminalBlock", "stop"].includes(s.kind)) continue;
      for (const p of worldPoints(ctx.M, s)) if (p[2] <= bs.top + 2) grow(p);
    }
    // the points the teaching names on the ground (a rear axle line, a turning centre) lie on the base
    // (where the kinematics put them: a coordinate may be an expression of the params)
    for (const p of ctx.kin.points ?? []) {
      const q = p.body === "ground" ? ctx.S.refPts.get(p.id) : undefined;
      if (q) grow(q);
    }
    for (const h of ctx.baseHoles) {
      grow([h.at[0] - h.r, h.at[1] - h.r]);
      grow([h.at[0] + h.r, h.at[1] + h.r]);
      for (const p of h.ring ?? []) grow(p);
    }
    if (!isFinite(x0)) return;
    const m = 16;
    const outer = roundRect(x0 - m, y0 - m, x1 + m, y1 + m, 8);
    // four counterbored mounting holes on the corner-arc centres
    const inset = 8;
    const corners: Vec2[] = [[x0 - m + inset, y0 - m + inset], [x1 + m - inset, y0 - m + inset], [x1 + m - inset, y1 + m - inset], [x0 - m + inset, y1 + m - inset]];
    const holes: Vec2[][] = [];
    for (const c of corners) holes.push(circle(2.75, c[0], c[1], 20).reverse());
    for (const h of ctx.baseHoles) holes.push(h.ring ? clockwise(h.ring) : circle(h.r, h.at[0], h.at[1], Math.max(20, Math.round(h.r * 4))).reverse());
    // the 5 mm engraved scale along the front edge and the traced paths engraved (A7)
    const ticks: Vec2[][] = [];
    const sx0 = Math.ceil((x0 - m + 14) / 5) * 5;
    for (let x = sx0; x <= x1 + m - 14; x += 5) ticks.push([[x, y0 - m + 2.5], [x, y0 - m + (x % 25 === 0 ? 6 : 4.2)]]);
    const marks = [
      ...ticks.map((pts) => ({ kind: "scale" as const, pts })),
      ...corners.map((c) => ({ kind: "boreEntry" as const, pts: circle(4.2, c[0], c[1], 24) })),
      ...ctx.baseMarks.map((m) => ({ kind: m.kind, pts: m.pts as Vec2[] })),
    ];
    const plate = place(
      { o: [0, 0, 0], x: [1, 0, 0], z: [0, 0, 1] },
      H.plate("base", outer, { name: `Base plate ${Math.round(x1 - x0 + 2 * m)} x ${Math.round(y1 - y0 + 2 * m)} x ${BASE_T}, counterbored, rubber feet`, kind: "base", z0: bs.bottom, z1: bs.top, holes, marks, isBase: true, ex: -1, chamfer: 0.6 }),
    )[0]!;
    plate.flags.isBase = true;
    ctx.base = { ...bs, outline: outer };
    ctx.rule = "base";
    ctx.add(plate);
    (ctx.fired.base ??= []).push("base");
  },
};

