// The shared parts of every assembly, ported to 3D frames (A6, A7, A22, M10, M13 and the rest of 5.1): rocker stops and the
// swing scale, standoffs under fixed plates, rubber feet, the drive, lubrication and timing marks, locking, materials,
// the stage-3 fasteners, headroom, the see-through stage and the explode.
import { TAU, circle, roundRect, type Vec2 } from "../../core/geom";
import { H } from "../../hardware/primitives";
import { MOTORS, PULLEYS, SENSOR, STANDOFF } from "../../hardware/tables";
import { cleanProfile } from "../../solids/manifold";
import type { Solid3 } from "../../solids/types";
import { type Vec3, v3, wrapPi, xf } from "../../kin/math";
import type { BuildCtx } from "../ctx";
import { LEVER_WALL, MIN_GAP } from "../constants";
import { canon, fromPlane, parallel, place, planeCoords, type Frame } from "../frames";
import { pointDist } from "../planar";
import { clearance } from "../router";
import { projectAlong } from "../view";
import { worldManifold, worldPoints } from "../sweeps";
import { lowestZ } from "./core";
import { inside } from "../../core/poly";
import type { Rule } from "./types";
import type { Site } from "../sites";
import { linearDrive, manualDrive, onFreeEnd, oscillatingDrive } from "./drive";

const UPF: Frame = { o: [0, 0, 0], x: [1, 0, 0], z: [0, 0, 1] };
const polar = (c: Vec2, r: number, a: number): Vec2 => [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)];

// ---------------------------------------------------------------------------------------------------- stops (A22, F5)

/** Angular range of a body about a site's axis over the cycle, radians, from the poses. */
export function swingOf(ctx: BuildCtx, body: string, axis: Vec3): { lo: number; hi: number; range: number; reverses: boolean } {
  let prev = 0;
  let acc = 0;
  let lo = 0;
  let hi = 0;
  let up = false;
  let down = false;
  ctx.sampled.us.forEach((_, i) => {
    const a = xf.angleAbout(ctx.xfOf(body, i), axis);
    if (i === 0) {
      acc = a;
      prev = a;
    } else {
      const d = wrapPi(a - prev);
      if (d > 1e-6) up = true;
      if (d < -1e-6) down = true;
      acc += d;
      prev = a;
    }
    if (i === 0) lo = hi = acc;
    lo = Math.min(lo, acc);
    hi = Math.max(hi, acc);
  });
  // a part that swings turns both ways in the cycle; a crank or a gear turns one way only
  return { lo, hi, range: hi - lo, reverses: up && down };
}

export const stops: Rule = {
  id: "stops",
  tier: "AUTO",
  ids: ["F5", "A22"],
  fixture: "four-bar",
  applies: (ctx) => ctx.sites.some((s) => s.fixed),
  apply(ctx) {
    for (const s of ctx.sites.filter((q) => q.fixed && !q.inPlan)) {
      for (const b of s.bodies) {
        const g = ctx.geoms.get(b);
        const ext = ctx.extent(b);
        if (!g || !ext || g.exact) continue;
        // a wheel (a sheave, a pulley, a disc) turns as far as its rope or belt takes it: nothing stops it
        if (["pulley", "sprocket", "disc", "gear"].includes(String(g.shape.type))) continue;
        const sw = swingOf(ctx, b, s.axis);
        // only a part that swings (a rocker, a lever) gets stops; a crank, or a gear that turns on through the cycle,
        // turns past them
        if (sw.range > TAU * 0.75 || sw.range < 0.02 || !sw.reverses) continue;
        const pivot = planeCoords(ext.frame, s.at).uv;
        const pts = g.profile.outer.map((q) => planeCoords(ext.frame, fromPlane(g.frame, q, 0)).uv);
        const reach = Math.max(...pts.map((p) => Math.hypot(p[0] - pivot[0], p[1] - pivot[1])));
        // the direction of the lever, from the pivot to its farthest point
        const tip = pts.reduce((q, p) => (Math.hypot(p[0] - pivot[0], p[1] - pivot[1]) > Math.hypot(q[0] - pivot[0], q[1] - pivot[1]) ? p : q), pts[0]!);
        const dir = Math.atan2(tip[1] - pivot[1], tip[0] - pivot[0]);
        // half width of the lever at a radius, from the outline across its own direction
        const halfWidth = (rad: number): number => {
          const near = pts.filter((p) => Math.abs(Math.hypot(p[0] - pivot[0], p[1] - pivot[1]) - rad) < 0.12 * reach);
          return near.length ? Math.max(...near.map((p) => Math.abs(-(p[0] - pivot[0]) * Math.sin(dir) + (p[1] - pivot[1]) * Math.cos(dir)))) : 8;
        };
        const over = Math.max(0.05, 0.2 * (sw.range / 2));
        const r = 3;
        const placed: string[] = [];
        const others = ctx.sweeps.moving().filter((m) => m !== b);
        for (const [k, th, side] of [[0, sw.hi + over, 1], [1, sw.lo - over, -1]] as const) {
          // the pin stands beside the lever's edge at the end of the swing, a clearance off it: at 70 % of the reach, else
          // nearer or farther where something else is in the way
          for (const [f, grow] of [[0.7, 1], [0.55, 1], [0.85, 1], [0.4, 1], [0.95, 1], [0.7, 1.7], [0.55, 1.7], [0.85, 1.7], [0.7, 2.6], [0.4, 2.6]] as const) {
            const rs = f * reach;
            const ang = dir + (th - (side > 0 ? sw.hi : sw.lo)) * grow + (side > 0 ? sw.hi : sw.lo);
            const lat = side * (halfWidth(rs) + r + MIN_GAP);
            const c: Vec2 = [pivot[0] + rs * Math.cos(ang) - lat * Math.sin(ang), pivot[1] + rs * Math.sin(ang) + lat * Math.cos(ang)];
            const w = fromPlane(ext.frame, c, 0);
            const pin = place(UPF, H.stop(`${s.id}-${b}-stop${k}`, circle(r, w[0], w[1], 20), { name: k ? "" : "Stop pin Ø6, hardened, on the lever's edge", qty: k ? 0 : 2, z0: ctx.base!.top, z1: ext.frame.o[2] + ext.w1 + 1, joints: [s.id] }));
            // the pin is judged against the other moving parts; the lever itself is meant to meet it
            const m = worldManifold(ctx.M, pin[0]!);
            const g2 = ctx.sweeps.gap(m, others, MIN_GAP + 1);
            // and it clears the lever itself over the cycle (a plate lever's far corner sweeps past its edge line)
            const g3 = g2 < MIN_GAP ? 0 : ctx.sweeps.gap(m, [b], 1);
            m.delete();
            if (g2 < MIN_GAP || g3 < 0.5) continue;
            ctx.add(pin);
            ctx.add(place(UPF, H.screw(`${s.id}-${b}-stop${k}-sc`, "button", 4, 12, { at: [w[0], w[1], 0], face: ctx.base!.bottom, dir: 1, name: "", qty: 0, joints: [s.id] })));
            placed.push(pin[0]!.id);
            (ctx.fired.stops ??= []).push(pin[0]!.id);
            break;
          }
        }
        // the swing scale engraved on the base at the lever's edge (F5, F9)
        const ticks: [number, number][][] = [];
        const n = Math.floor((sw.range * 180) / Math.PI / 5);
        for (let q = 0; q <= n; q++) {
          const a = dir + sw.lo + (q * 5 * Math.PI) / 180;
          // ticks are worked out in the lever's plane and engraved on the base, whose frame is the world's
          const w = (uv: [number, number]): [number, number] => {
            const p = fromPlane(ext.frame, uv, 0);
            return [p[0], p[1]];
          };
          ticks.push([w(polar(pivot, reach * 0.92, a)), w(polar(pivot, reach * 0.92 + (q % 2 ? 2.2 : 3.6), a))]);
        }
        for (const t of ticks) ctx.baseMarks.push({ kind: "scale", pts: t });
        ctx.note({ id: `${s.id}-${b}-stops`, kit: "stops", at: s.at, title: `Stops · ${b}`, note: `${b} swings ${((sw.range * 180) / Math.PI).toFixed(1)}°; hardened stop pins at 70 % of its reach, a fifth of the half swing past each end; swing scale engraved on the base.`, serves: { F5: placed }, badge: placed.length ? ["stopped both ends", "ok"] : ["no stop fits", "warn"] });
        if (!placed.length) ctx.issues.push(`${b}: no place for a stop pin clears the other parts`);
      }
    }
  },
};

// ---------------------------------------------------------------------------------------------------- standoffs (A6)

/** A body no joint reaches and nothing moves (a block may carry a jointless body round: a flexspline's segment): a fixed
 * plate that has to stand on the base (A6); a cover over another body's level rests on the housing round it instead
 * (covers, below). */
const isFixedPlate = (ctx: BuildCtx, id: string): boolean =>
  id !== "ground" &&
  // a body the record stands on posts of its own (rules/lugs.ts posts) takes no standoffs
  !Array.isArray((ctx.kin.bodies.find((b) => b.id === id)?.shape as { posts?: unknown } | undefined)?.posts) &&
  ctx.parts.has(id) &&
  !ctx.kin.joints.some((j) => j.a === id || j.b === id) &&
  ctx.geoms.get(id)?.level?.part !== "above" &&
  !(ctx.sampled.xfs.get(id) ?? []).some((X) => X.t.some((v) => Math.abs(v) > 1e-6) || X.R.some((v, k) => Math.abs(v - (k % 4 === 0 ? 1 : 0)) > 1e-9));

/** True when a point lies in the sweep of the plate's own body (the post is under the plate it holds). */
const insideOwn = (body: string, ctx: BuildCtx, p: Vec2): boolean => {
  void body;
  void ctx;
  void p;
  return false;
};

export const standoffs: Rule = {
  id: "standoffs",
  tier: "AUTO",
  ids: ["A6"],
  fixture: "kin:fixedPlate",
  applies: (ctx) => ctx.kin.bodies.some((b) => isFixedPlate(ctx, b.id)),
  apply() {},
  after(ctx) {
    const base = ctx.base!;
    for (const b of ctx.kin.bodies) {
      if (!isFixedPlate(ctx, b.id)) continue;
      const part = ctx.parts.get(b.id)!;
      if (!part || part.body === "ground") continue;
      const pts = part.profile.outer.map((q) => planeCoords(UPF, fromPlane(part.frame, q, 0)).uv);
      const c: Vec2 = [pts.reduce((a, p) => a + p[0], 0) / pts.length, pts.reduce((a, p) => a + p[1], 0) / pts.length];
      const far = [...pts].sort((p, q) => Math.hypot(q[0] - c[0], q[1] - c[1]) - Math.hypot(p[0] - c[0], p[1] - c[1]));
      const z1 = part.frame.o[2];
      if (z1 - base.top < 1) continue;
      // two posts under the plate, far apart, each standing clear of every moving part and of the supports already built
      const swept = ctx.sweeps.planPolys();
      const fixed = ctx.solids.filter((q) => ["standoff", "bridge", "housing", "bracket", "foot", "stop"].includes(q.kind) && q.body === "ground" && !q.flags.isBase).map((q) => ctx.sweeps.staticPolys(q));
      // a post is clear of the moving parts in plan, or, where they sweep over the plate, in 3D under it
      const clear3d = (p: Vec2): boolean => clearance(ctx, place(UPF, H.standoff("probe", { at: [p[0], p[1], 0], z0: base.top, z1 }))) >= MIN_GAP;
      const inPlan = (p: Vec2): boolean => swept.every((r) => pointDist(r, p[0], p[1]) >= STANDOFF.D / 2 + MIN_GAP || insideOwn(part.body, ctx, p));
      const free = (p: Vec2): boolean => (inPlan(p) || clear3d(p)) && fixed.every((f) => f.every((r) => pointDist(r, p[0], p[1]) >= STANDOFF.D / 2 + 1));
      // (last, nearer the edge: a ring's posts stand under its rim, outside what turns inside it)
      const at = (k: number) => (p: Vec2): Vec2 => [p[0] + (c[0] - p[0]) * k, p[1] + (c[1] - p[1]) * k];
      const cands = [...far.flatMap((p) => [0.18, 0.3, 0.45].map((k) => at(k)(p))), ...far.map(at(0.09))].filter(free);
      const a = cands[0];
      const bFar = a ? cands.find((p) => Math.hypot(p[0] - a[0], p[1] - a[1]) > 30) : undefined;
      if (!a || !bFar) {
        ctx.issues.push(`${b.id}: no place for two posts under the plate clears the sweeps`);
        continue;
      }
      [a, bFar].forEach((inset, k) => {
        const at: [number, number, number] = [inset[0], inset[1], 0];
        (ctx.fired.standoffs ??= []).push(`${b.id}-post${k}`);
        ctx.add(place(UPF, H.standoff(`${b.id}-post${k}`, { at, z0: base.top, z1, joints: [b.id], ...(k ? { name: "", qty: 0 } : { name: `Standoff Ø${STANDOFF.D} x ${+(z1 - base.top).toFixed(1)}, M${STANDOFF.M}`, qty: 2 }) })));
        // a screw that something sweeps over, or that a cover lies on, is countersunk flush (A6)
        const covered = [...ctx.geoms.values()].some((q) => q.level?.part === "above" && q.level.with === ctx.geoms.get(b.id)?.level?.with);
        ctx.add(place(UPF, H.screw(`${b.id}-post${k}-top`, inPlan(inset) && !covered ? "button" : "csk", STANDOFF.M, 6 + 1.5 * STANDOFF.M, { at, face: z1 + (part.op.op === "extrude" ? part.op.h : 6) - (inPlan(inset) && !covered ? 0 : 0.5), dir: -1, ...(k ? { name: "", qty: 0 } : {}), joints: [b.id] })));
        ctx.add(place(UPF, H.screw(`${b.id}-post${k}-bot`, "button", STANDOFF.M, base.top - base.bottom + 1.5 * STANDOFF.M, { at, face: base.bottom, dir: 1, ...(k ? { name: "", qty: 0 } : {}), joints: [b.id] })));
      });
    }
  },
};

// ---------------------------------------------------------------------------------------------------- covers (F1, F2, F7)

const topOf = (s: Solid3): number => s.frame.o[2] + (s.op.op === "extrude" ? s.op.h : 0);

/**
 * Fixed bodies placed at another body's level (an engine's housing round its rotor, its side cover over it, a stationary
 * gear under the cover): the cover is screwed and dowelled down onto the housing, and a fixed part under the cover is
 * screwed and dowelled up into it, its screws in slotted holes in the cover so it can be slid to set a mesh's backlash
 * (F1, F2, F7).
 */
export const covers: Rule = {
  id: "covers",
  tier: "AUTO",
  ids: ["F1", "F2", "F7"],
  fixture: "wankel",
  applies: (ctx) => [...ctx.geoms.values()].some((g) => g.level?.part === "above"),
  apply() {},
  after(ctx) {
    for (const [id, g] of ctx.geoms) {
      if (g.level?.part !== "above") continue;
      const cover = ctx.parts.get(id);
      if (!cover) continue;
      const ct = topOf(cover);
      const cb = cover.frame.o[2];
      const pts = cover.profile.outer.map((q) => planeCoords(UPF, fromPlane(cover.frame, q, 0)).uv);
      const xs = pts.map((q) => q[0]);
      const ys = pts.map((q) => q[1]);
      const [x0, x1, y0, y1] = [Math.min(...xs) + 12, Math.max(...xs) - 12, Math.min(...ys) + 12, Math.max(...ys) - 12];
      // onto the housing round the same body
      const housing = [...ctx.geoms].find(([h, hg]) => h !== id && hg.level?.with === g.level!.with && hg.level?.part === "all");
      if (housing) {
        const hp = ctx.parts.get(housing[0]);
        const hb = hp ? hp.frame.o[2] : cb - 10;
        [[x0, y0], [x1, y0], [x1, y1], [x0, y1]].forEach(([x, y], k) => {
          ctx.add(place(UPF, H.screw(`${id}-sc${k}`, "csk", 5, ct - hb - 2, { at: [x!, y!, 0], face: ct, dir: -1, joints: [id], ...(k ? { name: "", qty: 0 } : { qty: 4 }) })));
          (ctx.fired.covers ??= []).push(`${id}-sc${k}`);
        });
        [[x0 + 10, y0], [x1 - 10, y1]].forEach(([x, y], k) => ctx.add(place(UPF, H.dowel(`${id}-dw${k}`, 4, { at: [x!, y!, 0], z0: hb + 4, z1: ct - 1, joints: [id], ...(k ? { name: "", qty: 0 } : { name: `Dowel pin Ø4 h6, ${id} to ${housing[0]}`, qty: 2 }) }))));
      }
      // a fixed part hung under the cover: screwed up into it through slotted holes, dowelled
      for (const [f, fg] of ctx.geoms) {
        const body = ctx.kin.bodies.find((b) => b.id === f) as { fixed?: boolean } | undefined;
        if (!body?.fixed || !fg.level || fg.level.with !== g.level.with || fg.level.part === "above") continue;
        const part = ctx.parts.get(f);
        if (!part || Math.abs(topOf(part) - cb) > 0.6) continue;
        const o = part.frame.o;
        const rr = Math.min(...part.profile.outer.map((q) => Math.hypot(q[0], q[1]))) * 0.65;
        const h = part.op.op === "extrude" ? part.op.h : 6;
        for (let k = 0; k < 3; k++) {
          const a = Math.PI / 2 + (k * 2 * Math.PI) / 3;
          ctx.add(place(UPF, H.screw(`${f}-sc${k}`, "csk", 3, ct - cb + Math.min(6, h - 1), { at: [o[0] + rr * Math.cos(a), o[1] + rr * Math.sin(a), 0], face: ct, dir: -1, joints: [f], ...(k ? { name: "", qty: 0 } : { qty: 3, why: "through slotted holes in the cover: the part slides to set the mesh's backlash, then is clamped (F7)" }) })));
          (ctx.fired.covers ??= []).push(`${f}-sc${k}`);
        }
        for (let k = 0; k < 2; k++) {
          // between the screws
          const a = Math.PI / 6 + (k * 2 * Math.PI) / 3;
          ctx.add(place(UPF, H.dowel(`${f}-dw${k}`, 3, { at: [o[0] + rr * Math.cos(a), o[1] + rr * Math.sin(a), 0], z0: cb - Math.min(5, h - 1), z1: ct - 1, joints: [f], ...(k ? { name: "", qty: 0 } : { name: `Dowel pin Ø3 h6, ${f} to the cover, fitted after the backlash is set`, qty: 2 }) })));
        }
        ctx.note({ id: `${f}-fix`, kit: "covers", at: o as Vec3, title: `Covers · ${f}`, note: `${f} hangs under ${id}: three countersunk screws down through slotted holes in the cover set the mesh's backlash, then two dowels fix it; ${id} is screwed and dowelled onto ${housing?.[0] ?? "its housing"}.`, serves: { F1: [`${f}-dw0`], F2: [`${f}-sc0`], F7: [`${f}-sc0`] } });
      }
    }
  },
};

// ---------------------------------------------------------------------------------------------------- the drive (V1 to V6, F10)

/**
 * A rotary input on a shaft in plan (V1, V2, V5): the motor beside the shaft, its face screwed to the upright of one
 * angle bracket whose foot is screwed to the base top, belted in the plane across the shaft to a pulley on the shaft's
 * free end (its low end, past its pillow blocks, or its far end: onFreeEnd); the home flag on that pulley and the fork
 * sensor on the upright (V6, F10); terminals and a lead on the base top. Built in the pulley's plane: u across the shaft,
 * v up, w outward along it.
 */
function driveInPlan(ctx: BuildCtx, site: Site): void {
  const st = ctx.stacks.get(site.id)!;
  const axle = ctx.get(`${site.id}-axle`);
  if (!ctx.base || (!axle && !st.end)) return;
  onFreeEnd(ctx, site.id, (far) => driveInPlanAt(ctx, site, far));
}

/** The drive of a shaft in plan on its low end or its far end. A shaft built by its own kit (a screw, a variator's shaft)
 * names the end itself. */
function driveInPlanAt(ctx: BuildCtx, site: Site, far: boolean): void {
  const st = ctx.stacks.get(site.id)!;
  const axle = ctx.get(`${site.id}-axle`);
  if (!ctx.base || (!axle && !st.end)) return;
  let out: Vec3;
  let end: Vec3;
  let shaftBody: string;
  if (st.end) {
    out = v3.unit(st.end.out);
    end = st.end.at;
    shaftBody = st.end.body;
  } else {
    const zA = v3.unit(axle!.frame.z as Vec3);
    const hA = axle!.op.op === "extrude" ? axle!.op.h : 0;
    out = far ? zA : v3.mul(zA, -1);
    end = far ? v3.add(axle!.frame.o as Vec3, v3.mul(zA, hA)) : (axle!.frame.o as Vec3);
    shaftBody = axle!.body;
  }
  const S: Vec3 = v3.add(end, v3.mul(out, -6)); // the pulley's centre, 6 mm in from the end
  const up: Vec3 = [0, 0, 1];
  const lat = v3.unit(v3.cross(up, out));
  const PF: Frame = { o: S, x: lat, z: out };
  const h = S[2] - ctx.base.top;
  const mot = MOTORS.pancake;
  const C = 46;
  // the motor on the side with more room, away from the other fixed sites
  const others = ctx.sites.filter((q) => q !== site && q.fixed).map((q) => q.at as Vec3);
  const room = (sg: number) => Math.min(...others.map((o) => v3.dist(o, v3.add(S, v3.mul(lat, sg * C)))), 999);
  const foot = 4;
  const vm = Math.max(0, mot.R + foot + 2 - h);
  // the side whose motor keeps clear of the moving parts' sweeps, else the one with more room from the other sites
  const motorAt = (side: number) => place(PF, H.solid("drive-motor-t", { name: "", kind: "motor", role: "hw", outer: circle(mot.R + 2, side * C, vm, 32), z0: 9, z1: 15 + mot.H, joints: ["drive"] }));
  const gapOf = (side: number) => clearance(ctx, motorAt(side));
  const g1 = gapOf(1);
  const g2 = gapOf(-1);
  const sg = g1 >= MIN_GAP && g2 >= MIN_GAP ? (room(1) >= room(-1) ? 1 : -1) : g1 >= g2 ? 1 : -1;
  const Mc: Vec2 = [sg * C, vm];
  const j = ["drive"];
  const small = PULLEYS[16];
  const big = PULLEYS[32];
  const pulley = (id: string, c: Vec2, p: (typeof PULLEYS)[16], bore: number, body: string) => {
    const hole = () => [circle(bore / 2 + 0.05, c[0], c[1], 24).reverse()];
    ctx.add(place(PF, H.solid(id, { name: `GT2 timing pulley ${p.T}T`, kind: "pulley", role: "hw", mat: "Aluminium 6061-T6", outer: circle(p.od / 2, c[0], c[1], 36), holes: hole(), z0: -3, z1: 3, joints: j, body })));
    ctx.add(place(PF, H.solid(`${id}-fl0`, { name: "", kind: "pulley", role: "hw", outer: circle(p.fd / 2, c[0], c[1], 36), holes: hole(), z0: -4, z1: -3, joints: j, body })));
    ctx.add(place(PF, H.solid(`${id}-fl1`, { name: "", kind: "pulley", role: "hw", outer: circle(p.fd / 2, c[0], c[1], 36), holes: hole(), z0: 3, z1: 4, joints: j, body })));
  };
  pulley("drive-pulley-shaft", [0, 0], big, st.d, shaftBody);
  pulley("drive-pulley-motor", Mc, small, mot.shaft, "ground");
  const ring = H.hullOf([[0, 0, big.pd / 2 + 0.7], [Mc[0], Mc[1], small.pd / 2 + 0.7]]);
  const inner = H.hullOf([[0, 0, big.pd / 2 - 0.7], [Mc[0], Mc[1], small.pd / 2 - 0.7]]);
  ctx.add(place(PF, H.solid("drive-belt", { name: "GT2 belt 6 mm, closed loop", kind: "belt", role: "hw", mat: "Neoprene, glass-fibre cords", outer: ring, holes: [inner.slice().reverse()], z0: -3, z1: 3, joints: j })));
  // the angle bracket: an upright past the shaft's end, which the motor's face is screwed to, on a foot on the base
  const w0 = 11;
  const w1 = w0 + 4;
  const mouth = big.fd / 2 + 1;
  const lo = Math.min(-8, Mc[0] - 29, Mc[0] + 29);
  const hi = Math.max(8, Mc[0] - 29, Mc[0] + 29);
  const vTop = Math.max(vm + 29, mouth + SENSOR.l + 2);
  ctx.add(place(PF, H.plate("drive-bracket", roundRect(lo, -h + foot, hi, vTop, 3), { name: "Motor bracket, one piece: an upright on a foot, slotted for the belt's tension", kind: "bracket", role: "ground", z0: w0, z1: w1, holes: [circle(mot.R - 8, Mc[0], Mc[1], 36).reverse()], mat: "Aluminium 6061-T6, anodised", joints: j })));
  // the foot's frame: x outward along the shaft, z up, so y = z x x = up x out = lat and a point u across lies at y = u
  const FF: Frame = { o: [S[0], S[1], ctx.base.top], x: out, z: up };
  ctx.add(place(FF, H.plate("drive-bracket-foot", roundRect(w0, lo, w1 + mot.H + 6, hi, 3), { name: "", kind: "bracket", role: "ground", z0: 0, z1: foot, mat: "Aluminium 6061-T6, anodised", joints: j, group: "drive-bracket" })));
  for (const [k, u] of [[0, Mc[0] - sg * 20], [1, Mc[0] + sg * 20]] as const)
    ctx.add(place(FF, H.screw(`drive-ft${k}`, "socket", 4, foot + 8, { at: [w1 + mot.H + 1, u, 0], face: foot, dir: -1, ...(k ? { name: "", qty: 0 } : { qty: 2 }), joints: j })));
  ctx.add(place(PF, H.solid("drive-motor", { name: mot.name, kind: "motor", role: "hw", mat: "Aluminium housing, neodymium rotor", outer: circle(mot.R, Mc[0], Mc[1], 48), z0: w1, z1: w1 + mot.H, joints: j })));
  ctx.add(place(PF, H.solid("drive-motor-core", { name: "", kind: "motorInternal", role: "hw", outer: circle(mot.R - 4, Mc[0], Mc[1], 36), z0: w1 + 3, z1: w1 + mot.H - 3, faint: true, inset: true, joints: j })));
  ctx.add(place(PF, H.shaft("drive-shaft", { d: mot.shaft, z0: -4, z1: w1 }, { name: `Motor shaft Ø${mot.shaft}`, at: [Mc[0], Mc[1], 0], joints: j })));
  [[-15, -15], [15, -15], [15, 15], [-15, 15]].forEach(([du, dv], k) =>
    ctx.add(place(PF, H.screw(`drive-fl${k}`, "socket", 3, 4 + 4.5, { at: [Mc[0] + du!, Mc[1] + dv!, 0], face: w0, dir: 1, ...(k ? { name: "", qty: 0 } : { qty: 4 }), joints: j }))),
  );
  // the home flag on the shaft pulley's outer flange, the fork straddling it, carried on the upright (V6, F10)
  const fz = 4;
  ctx.add(place(PF, H.flag("drive-flag", big.pd / 2, mouth + SENSOR.depth - 1.5, Math.PI / 2, { at: [0, 0, 0], z0: fz, z1: fz + SENSOR.vane, joints: j, body: shaftBody })));
  const gap0 = fz + SENSOR.vane / 2 - SENSOR.slot / 2;
  const gap1 = gap0 + SENSOR.slot;
  const box = (r0: number, r1: number): Vec2[] => [[-SENSOR.w / 2, r0], [SENSOR.w / 2, r0], [SENSOR.w / 2, r1], [-SENSOR.w / 2, r1]];
  const fork = { kind: "sensor" as const, role: "hw" as const, joints: j, group: "drive-sensor" };
  ctx.add(place(PF, H.solid("drive-sensor", { ...fork, name: `Fork sensor, slotted optical, ${SENSOR.slot} mm gap`, mat: "PBT housing", outer: box(mouth, mouth + SENSOR.l), z0: gap0 - 3, z1: gap0 })));
  ctx.add(place(PF, H.solid("drive-sensor-jaw", { ...fork, name: "", outer: box(mouth, mouth + SENSOR.l), z0: gap1, z1: w0 })));
  ctx.add(place(PF, H.solid("drive-sensor-back", { ...fork, name: "", outer: box(mouth + SENSOR.depth, mouth + SENSOR.l), z0: gap0, z1: gap1 })));
  // terminals and a lead on the base top, past the motor
  const tb: [number, number, number] = [w1 + mot.H + 14, Mc[0], 0];
  ctx.add(place(FF, H.terminalBlock("drive-terminals", 4, { at: tb, z0: 0, z1: 6, joints: j })));
  ctx.add(place(FF, H.lead("drive-lead", [[w1 + mot.H, Mc[0]], [w1 + mot.H + 6, Mc[0] + sg * 4], [tb[0], tb[1]]], { z0: 0, z1: 1, joints: j })));
  ctx.note({ id: "drive", kit: "drive", at: [S[0], S[1], S[2]], title: "Drive", note: (ctx.kin.drivers.some((d) => d.kind === "oscillating" && beltDriven(d)) ? "Reversing drive (the input turns several turns each way): " : "") + "Brushless pancake motor beside the shaft in plan, its face screwed to the upright of a one-piece angle bracket whose foot is screwed to the base; GT2 16T to 32T belt across the shaft to a pulley on its free end; a home flag on the pulley read by a fork sensor on the upright; terminals and a lead on the base.", serves: { F10: ["drive-flag", "drive-sensor"] }, badge: ["motor driven", "ok"] });
}

/**
 * A driver the belt drive serves: a rotary input, or an oscillating one that turns its shaft more than a turn each way
 * (a screw's input: the motor reverses, V5's crank and link cannot swing a shaft through several turns).
 */
const beltDriven = (d: { kind: string; lo?: number; hi?: number; range?: [number, number] }): boolean => {
  if (d.kind === "rotary") return true;
  if (d.kind !== "oscillating") return false;
  const lo = d.lo ?? d.range?.[0] ?? 0;
  const hi = d.hi ?? d.range?.[1] ?? 0;
  return Math.abs(hi - lo) > 360;
};

/** Plan boxes [x0, y0, x1, y1] of a second drive's parts under the base, each moving one's over the cycle. */
function secondDriveBoxes(ctx: BuildCtx): [number, number, number, number][] {
  const out: [number, number, number, number][] = [];
  for (const q of ctx.solids) {
    if (!q.id.startsWith("drive2")) continue;
    const pts = worldPoints(ctx.M, q);
    const xs: number[] = [];
    const ys: number[] = [];
    const moves = q.body !== "ground" ? (ctx.sampled.xfs.get(q.body) ?? []) : [];
    for (const X of moves.length ? moves : [null])
      for (const p of pts) {
        xs.push(p[0] + (X ? X.t[0] : 0));
        ys.push(p[1] + (X ? X.t[1] : 0));
      }
    out.push([Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]);
  }
  return out;
}

/**
 * Builds a drive as a second one beside the first: what it adds (solids, base holes, its note) is renamed from drive-* to
 * drive2-*, so the first drive, built after it, keeps its own ids.
 */
function secondDrive(ctx: BuildCtx, build: () => void): void {
  const n0 = ctx.solids.length;
  const h0 = ctx.baseHoles.length;
  const k0 = ctx.notes.length;
  build();
  const re = (x: string) => x.replace(/^drive(?=-|$)/, "drive2");
  for (const q of ctx.solids.slice(n0)) {
    q.id = re(q.id);
    if (q.group) q.group = re(q.group);
    q.joints = q.joints.map(re);
  }
  for (const h of ctx.baseHoles.slice(h0)) h.joint = re(h.joint);
  for (const nt of ctx.notes.slice(k0)) {
    nt.id = re(nt.id);
    nt.title = nt.title.replace(/^Drive/, "Drive 2");
    if (nt.serves) for (const f of Object.keys(nt.serves) as (keyof typeof nt.serves)[]) nt.serves[f] = nt.serves[f]!.map(re);
  }
}

export const drive: Rule = {
  id: "drive",
  tier: "AUTO",
  ids: ["V1", "V2", "V3", "V5", "V6", "F10"],
  fixture: "four-bar",
  applies: (ctx) => (ctx.sites.some((s) => s.fixed && s.live && ctx.stacks.has(s.id)) && ctx.kin.drivers.some((d) => d.kind === "rotary")) || ctx.kin.drivers.some((d) => d.kind === "oscillating" || d.kind === "linear" || d.kind === "manual"),
  apply(ctx) {
    // an oscillating or a linear input has its own drive (rules/drive.ts); a rotary one is belted to its shaft. An input
    // that turns a shaft in plan more than a turn each way (a screw's) is belted the same way, the motor reversing: V5's
    // crank and link cannot swing it through several turns, and its step-up sector is for a shaft on the base normal
    // (the one exception to V5's oscillating form)
    const reversing = (d: (typeof ctx.kin.drivers)[number]) => d.kind === "oscillating" && beltDriven(d) && ctx.sites.some((s) => s.inPlan && s.joints.includes(d.joint ?? ""));
    const rotary = ctx.kin.drivers.find((d) => d.kind === "rotary" || reversing(d));
    const extra = ctx.kin.drivers.filter((d) => (d.kind === "oscillating" && !reversing(d)) || d.kind === "linear");
    if (!rotary) {
      const other = extra[0];
      if (other) return other.kind === "oscillating" ? oscillatingDrive(ctx, other) : linearDrive(ctx, other);
      return manualDrive(ctx);
    }
    // a second input beside a rotary one (an integrator's carriage beside its disc): its own V5 drive, ids drive2-*
    for (const o of extra) secondDrive(ctx, () => (o.kind === "oscillating" ? oscillatingDrive(ctx, o) : linearDrive(ctx, o)));
    const drv = rotary;
    const inPlan = ctx.sites.find((s) => s.fixed && s.live && s.inPlan && ctx.stacks.has(s.id) && s.joints.includes(drv?.joint ?? ""));
    if (inPlan) return driveInPlan(ctx, inPlan);
    const site = ctx.sites.find((s) => s.fixed && s.live && !s.inPlan && ctx.stacks.has(s.id) && s.joints.includes(drv?.joint ?? ""));
    if (!site || !ctx.base) return;
    const st = ctx.stacks.get(site.id)!;
    const bb = ctx.base.bottom;
    const S: Vec2 = [site.at[0], site.at[1]];
    // the belt plane under the base, and under the shaft's housing where a tall stack hangs it lower
    const housing = ctx.get(`${site.id}-housing`);
    const hz = housing ? Math.min(...worldPoints(ctx.M, housing).map((p) => p[2])) : bb;
    const pz = Math.min(bb - 28, hz - 7);
    // the shaft's own low end, in the world (the stack's frame stands on its family's plane, not at z 0)
    const axle = ctx.get(`${site.id}-axle`);
    const low = axle ? Math.min(...worldPoints(ctx.M, axle).map((p) => p[2])) : st.w0;
    if (low > pz - 2) {
      // the shaft does not reach the belt plane (no housing): the drive is not built
      ctx.issues.push(`drive: the live shaft ${site.id} does not reach below the base`);
    }
    const others = ctx.sites.filter((q) => q !== site && q.fixed).map((q) => [q.at[0], q.at[1]] as Vec2);
    const C = 46;
    // the motor where it is farthest from the other fixed pins, off a second drive already under the base (drive2-*: its
    // parts' plan boxes, a moving part's over its travel; the flange is 58 mm square about the motor), and its flange's
    // edge clear of the input housing's screws (a hole there would leave no wall); the next best angle when it is not
    const taken = secondDriveBoxes(ctx);
    // (and its dowels: their holes run through the flange too)
    const screws = st.solids.filter((x) => (x.id.startsWith(`${site.id}-hsc`) && x.kind === "head") || (x.id.startsWith(`${site.id}-hdw`) && x.kind === "dowel")).map((x): Vec2 => [x.frame.o[0], x.frame.o[1]]);
    // (and a screw's hole inside the flange keeps its wall to the motor's bore: Ø3 hole, 1.5 mm wall)
    const edgeOk = (m: Vec2) =>
      screws.every(([x, y]) => {
        const d = Math.max(Math.abs(x - m[0]), Math.abs(y - m[1]));
        const bore = Math.hypot(x - m[0], y - m[1]) - (MOTORS.pancake.R - 2);
        return (d < 29 - 4 && (bore > 1.5 + 1.5 + 0.1 || bore < -(1.5 + 1.5 + 0.1))) || d > 29 + 2;
      });
    const cands = Array.from({ length: 12 }, (_, k) => polar(S, C, (k / 12) * TAU))
      .filter((m) => !taken.some((b) => m[0] + 32 > b[0] && m[0] - 32 < b[2] && m[1] + 32 > b[1] && m[1] - 32 < b[3]))
      .map((m) => ({ m, clear: Math.min(...others.map((o) => Math.hypot(o[0] - m[0], o[1] - m[1])), 999) }));
    cands.sort((p, q) => q.clear - p.clear);
    const M: Vec2 | null = (cands.find((x) => edgeOk(x.m)) ?? cands[0])?.m ?? null;
    if (!M) return;
    const mot = MOTORS.pancake;
    const mTop = bb - 3;
    const mBot = mTop - mot.H;
    const g: Pick<Solid3, "joints"> = { joints: ["drive"] };
    void g;
    const j = ["drive"];
    ctx.add(place(UPF, H.solid("drive-motor", { name: mot.name, kind: "motor", role: "hw", mat: "Aluminium housing, neodymium rotor", outer: circle(mot.R, M[0], M[1], 48), z0: mBot, z1: mTop, joints: j })));
    ctx.add(place(UPF, H.solid("drive-motor-core", { name: "", kind: "motorInternal", role: "hw", outer: circle(mot.R - 4, M[0], M[1], 36), z0: mBot + 3, z1: mTop - 3, faint: true, inset: true, joints: j })));
    ctx.add(place(UPF, H.plate("drive-flange", roundRect(M[0] - 29, M[1] - 29, M[0] + 29, M[1] + 29, 4), { name: "Motor flange, screwed up into the base", kind: "bracket", z0: mTop, z1: bb, holes: [circle(mot.R - 2, M[0], M[1], 36).reverse()], joints: j })));
    [[-22, -22], [22, -22], [22, 22], [-22, 22]].forEach(([dx, dy], k) =>
      ctx.add(place(UPF, H.screw(`drive-fl${k}`, "socket", 3, 3 + 4.5, { at: [M![0] + dx!, M![1] + dy!, 0], face: mTop, dir: 1, ...(k ? { name: "", qty: 0 } : { qty: 4 }), joints: j }))),
    );
    ctx.add(place(UPF, H.shaft("drive-shaft", { d: mot.shaft, z0: mBot - 14, z1: mBot }, { name: `Motor shaft Ø${mot.shaft}`, at: [M[0], M[1], 0], joints: j })));
    // the pulleys, one on the motor shaft and one on the input shaft's free end, in one plane
    const small = PULLEYS[16];
    const big = PULLEYS[32];
    // the shaft's pulley and its flag turn with the input shaft, bored to it
    const shaftBody = ctx.get(`${site.id}-axle`)?.body ?? "ground";
    const pulley = (id: string, c: Vec2, p: (typeof PULLEYS)[16], bore: number, body: string) => {
      const hole = () => [circle(bore / 2 + 0.05, c[0], c[1], 24).reverse()];
      ctx.add(place(UPF, H.solid(id, { name: `GT2 timing pulley ${p.T}T`, kind: "pulley", role: "hw", mat: "Aluminium 6061-T6", outer: circle(p.od / 2, c[0], c[1], 36), holes: hole(), z0: pz - 3, z1: pz + 3, joints: j, body })));
      ctx.add(place(UPF, H.solid(`${id}-fl0`, { name: "", kind: "pulley", role: "hw", outer: circle(p.fd / 2, c[0], c[1], 36), holes: hole(), z0: pz - 4, z1: pz - 3, joints: j, body })));
      ctx.add(place(UPF, H.solid(`${id}-fl1`, { name: "", kind: "pulley", role: "hw", outer: circle(p.fd / 2, c[0], c[1], 36), holes: hole(), z0: pz + 3, z1: pz + 4, joints: j, body })));
    };
    pulley("drive-pulley-motor", M, small, mot.shaft, "ground");
    pulley("drive-pulley-shaft", S, big, st.d, shaftBody);
    const rb = small.pd / 2;
    const rB = big.pd / 2;
    const ring = H.hullOf([[M[0], M[1], rb + 0.7], [S[0], S[1], rB + 0.7]]);
    const inner = H.hullOf([[M[0], M[1], rb - 0.7], [S[0], S[1], rB - 0.7]]);
    ctx.add(place(UPF, H.solid("drive-belt", { name: "GT2 belt 6 mm, closed loop", kind: "belt", role: "hw", mat: "Neoprene, glass-fibre cords", outer: ring, holes: [inner.slice().reverse()], z0: pz - 3, z1: pz + 3, joints: j })));
    // the home flag on the big pulley and a fork sensor on a post under the base (V6, F10)
    const dir = Math.atan2(M[1] - S[1], M[0] - S[0]) + Math.PI / 2;
    // the vane lies on the top flange and reaches past it into the fork, whose mouth stands 1 mm clear of the flange
    const mouth = big.fd / 2 + 1;
    const fz = pz + 4;
    ctx.add(place(UPF, H.flag("drive-flag", rB, mouth + SENSOR.depth - 1.5, dir, { at: [S[0], S[1], 0], z0: fz, z1: fz + SENSOR.vane, joints: j, body: shaftBody })));
    // the fork straddles the vane along the shaft axis: two jaws above and below it, joined behind the slot
    const sz = fz + SENSOR.vane / 2 - SENSOR.h / 2;
    const gap0 = fz + SENSOR.vane / 2 - SENSOR.slot / 2;
    const gap1 = gap0 + SENSOR.slot;
    const box = (r0: number, r1: number): Vec2[] => {
      const c = Math.cos(dir), sn = Math.sin(dir), w = SENSOR.w / 2;
      return [[r0, -w], [r1, -w], [r1, w], [r0, w]].map(([r, t]): Vec2 => [S[0] + r! * c - t! * sn, S[1] + r! * sn + t! * c]);
    };
    const fork = { kind: "sensor" as const, role: "hw" as const, joints: j, group: "drive-sensor" };
    ctx.add(place(UPF, H.solid("drive-sensor", { ...fork, name: `Fork sensor, slotted optical, ${SENSOR.slot} mm gap`, mat: "PBT housing", outer: box(mouth, mouth + SENSOR.l), z0: sz, z1: gap0 })));
    ctx.add(place(UPF, H.solid("drive-sensor-jaw", { ...fork, name: "", outer: box(mouth, mouth + SENSOR.l), z0: gap1, z1: sz + SENSOR.h })));
    ctx.add(place(UPF, H.solid("drive-sensor-back", { ...fork, name: "", outer: box(mouth + SENSOR.depth, mouth + SENSOR.l), z0: gap0, z1: gap1 })));
    const post = polar(S, mouth + SENSOR.l - 6, dir);
    ctx.add(place(UPF, H.standoff("drive-sensor-post", { at: [post[0], post[1], 0], z0: sz + SENSOR.h, z1: bb, name: "Standoff Ø10 under the base, carries the sensor", joints: j })));
    const tb = polar(M, 36, dir);
    ctx.add(place(UPF, H.terminalBlock("drive-terminals", 4, { at: [tb[0], tb[1], 0], z0: bb - 6, z1: bb, joints: j })));
    ctx.add(place(UPF, H.lead("drive-lead", [M, [(M[0] + tb[0]) / 2 + 3, (M[1] + tb[1]) / 2 - 2], tb], { z0: bb - 2.2, z1: bb - 1.2, joints: j })));
    ctx.note({ id: "drive", kit: "drive", at: [S[0], S[1], 0], title: "Drive", note: `Brushless pancake motor in a flange screwed up into the base, GT2 16T to 32T closed belt in one plane under the base, a home flag on the shaft pulley and a fork sensor on a post, terminals and a lead.`, serves: { F10: ["drive-flag", "drive-sensor"] }, badge: ["motor driven", "ok"] });
    void LEVER_WALL;
  },
};

// ---------------------------------------------------------------------------------------------------- feet (A7)

export const feet: Rule = {
  id: "feet",
  tier: "AUTO",
  ids: ["A7", "D4"],
  fixture: "four-bar",
  applies: () => true,
  apply() {},
  after(ctx) {
    const base = ctx.base;
    if (!base || !base.outline.length) return;
    const xs = base.outline.map((p) => p[0]);
    const ys = base.outline.map((p) => p[1]);
    const x0 = Math.min(...xs);
    const x1 = Math.max(...xs);
    const y0 = Math.min(...ys);
    const y1 = Math.max(...ys);
    const lowest = lowestZ(ctx, base.bottom);
    const h = Math.max(6, isFinite(lowest) ? base.bottom - lowest + 3 : 6);
    const inset = 8;
    [[x0 + inset, y0 + inset], [x1 - inset, y0 + inset], [x1 - inset, y1 - inset], [x0 + inset, y1 - inset]].forEach(([x, y], k) =>
      ctx.add(
        place(UPF, H.solid(`foot${k}`, { name: k ? "" : `Rubber foot Ø16 x ${Math.round(h)}, M4 stud`, qty: k ? 0 : 4, kind: "foot", role: "ground", mat: "Neoprene, 60 Shore A", outer: circle(8, x!, y!, 28), z0: base.bottom - h, z1: base.bottom, joints: [] })),
      ),
    );
  },
};

// ---------------------------------------------------------------------------------------------------- lubrication and marks

export const lubrication: Rule = {
  id: "lubrication",
  tier: "AUTO",
  ids: ["F8"],
  fixture: "four-bar",
  applies: () => true,
  apply() {},
  after(ctx) {
    // an oil sink on every bridge over an open bearing
    for (const b of ctx.solids.filter((s) => s.kind === "bridge")) {
      const site = ctx.sites.find((s) => `${s.id}-bridge` === b.id);
      if (!site) continue;
      const uv = planeCoords(b.frame, site.at).uv;
      b.marks.push({ kind: "oilSink", pts: circle(3.2, uv[0], uv[1], 24) });
      (ctx.fired.lubrication ??= []).push(b.id);
    }
  },
};

export const timingMarks: Rule = {
  id: "timing-marks",
  tier: "AUTO",
  ids: ["F9"],
  fixture: "four-bar",
  applies: (ctx) => ctx.kin.drivers.length > 0,
  apply() {},
  after(ctx) {
    for (const d of ctx.kin.drivers) {
      const site = ctx.sites.find((s) => s.joints.includes(d.joint ?? ""));
      if (!site) continue;
      for (const b of site.bodies) {
        const part = ctx.parts.get(b);
        const g = ctx.geoms.get(b);
        if (!part || !g) continue;
        const reach = Math.max(...g.profile.outer.map((p) => Math.hypot(p[0], p[1])));
        part.marks.push({ kind: "index", pts: [[3, 0], [Math.min(reach - 1, 9), 0]] });
        // the zero on the base, beside the pivot, so a turn can be counted
        const w = fromPlane(g.frame, [reach + 5, 0], 0);
        const w2 = fromPlane(g.frame, [reach + 9, 0], 0);
        ctx.baseMarks.push({ kind: "index", pts: [[w[0], w[1]], [w2[0], w2[1]]] });
        (ctx.fired["timing-marks"] ??= []).push(b);
      }
    }
  },
};

/**
 * T4: a traced point on a moving body is engraved on that body: a ring and a cross at the point on the part's face, so
 * the eye finds on the part the point whose path the trace draws. A point outside the part's outline (a pen off the
 * body) gets nothing.
 */
export const traceMarks: Rule = {
  id: "trace-marks",
  tier: "AUTO",
  ids: ["T4", "L8"],
  fixture: "four-bar",
  applies: (ctx) => (ctx.teaching?.traces ?? []).length > 0,
  apply(ctx) {
    for (const t of ctx.teaching?.traces ?? []) {
      const pt = ctx.kin.points?.find((q) => q.id === t.point);
      const part = pt ? ctx.parts.get(pt.body) : undefined;
      const P = pt ? ctx.S.refPts.get(pt.id) : undefined;
      if (!pt || !part || !P || pt.body === "ground") continue;
      const uv = planeCoords(part.frame, P).uv;
      if (!inside(part.profile.outer, uv)) continue;
      const r = 2.5;
      part.marks.push({ kind: "index", pts: circle(r, uv[0], uv[1], 24) });
      part.marks.push({ kind: "index", pts: [[uv[0] - r - 1.5, uv[1]], [uv[0] + r + 1.5, uv[1]]] });
      part.marks.push({ kind: "index", pts: [[uv[0], uv[1] - r - 1.5], [uv[0], uv[1] + r + 1.5]] });
      (ctx.fired["trace-marks"] ??= []).push(pt.id);
    }
  },
};

export const locking: Rule = {
  id: "locking",
  tier: "AUTO",
  ids: ["M13"],
  fixture: "four-bar",
  applies: () => true,
  apply() {},
  after(ctx) {
    for (const s of ctx.solids) {
      if (!(s.kind === "shank" || s.thread) || s.why) continue;
      s.why = s.id.endsWith("-lock") ? "nyloc" : "locked with threadlocker (Loctite 243)";
      (ctx.fired.locking ??= []).push(s.id);
    }
  },
};

const BY_KIND: Partial<Record<Solid3["kind"], string>> = {
  base: "Aluminium 6061-T6, bead-blasted and anodised",
  plate: "Aluminium 6061-T6, anodised",
  bracket: "Aluminium 6061, bead-blasted",
  housing: "Aluminium 6061-T6, anodised",
  bridge: "Aluminium 6061-T6, anodised",
  standoff: "Stainless steel A2",
  spacer: "Steel, hardened",
  washer: "Steel, hardened",
  sleeve: "Steel",
  shim: "Steel shim stock",
};

export const materials: Rule = {
  id: "materials",
  tier: "AUTO",
  ids: ["M10"],
  fixture: "four-bar",
  applies: () => true,
  apply() {},
  after(ctx) {
    const gearish = new Set(["gear", "ringGear", "pulley", "sprocket", "rack", "cam"]);
    for (const s of ctx.solids) {
      if (s.mat) continue;
      if (s.kind === "part") {
        const shape = String(ctx.kin.bodies.find((b) => b.id === s.body)?.shape?.type);
        s.mat = gearish.has(shape) ? "Steel C45, teeth induction-hardened" : s.role === "link" || s.role === "link2" || s.role === "driver" || s.role === "output" ? "Steel C45, black oxide" : "Aluminium 6061-T6, anodised";
      } else s.mat = BY_KIND[s.kind] ?? "Steel";
      (ctx.fired.materials ??= []).push(s.id);
    }
  },
};

// ---------------------------------------------------------------------------------------------------- stage 3: fasteners (A8)

export const fasteners: Rule = {
  id: "fasteners",
  tier: "AUTO",
  ids: ["A8", "M4"],
  fixture: "four-bar",
  applies: () => true,
  apply() {},
  after(ctx) {
    // every shank, dowel and axle that passes a fixed plate gets a clearance hole through it; one that ends in a plate
    // is tapped there and leaves it whole
    const plates = ctx.solids.filter((p) => p.body === "ground" && ["base", "plate", "bridge", "bracket", "housing", "foot"].includes(p.kind) && p.op.op === "extrude" && !ctx.parts.has(p.id));
    for (const s of ctx.solids) {
      if (!(s.kind === "shank" || s.kind === "dowel" || s.kind === "shaft") || s.op.op !== "extrude" || s.body !== "ground" && s.kind !== "shank") continue;
      const r = (s.d ?? 0) / 2;
      if (!r) continue;
      const z = canon(s.frame.z);
      const h = s.op.h;
      for (const p of plates) {
        if (!parallel(p.frame.z, z) || p.id === s.id || (p.group && p.group === s.group)) continue;
        const dz = v3.dot(v3.sub(p.frame.o, s.frame.o), z);
        const p0 = dz;
        const p1 = dz + (p.op.op === "extrude" ? p.op.h : 0);
        const lo = 0;
        const hi = h;
        if (hi <= p0 + 0.05 || lo >= p1 - 0.05) continue;
        const uv = planeCoords(p.frame, s.frame.o).uv;
        if (!insidePlate(p, uv)) continue;
        // through: the shank spans the plate end to end; blind: it ends inside (tapped, no hole)
        const through = lo <= p0 + 0.05 && hi >= p1 - 0.05;
        if (!through) continue;
        const rr = r + (s.kind === "dowel" ? 0.02 : 0.3);
        if (p.profile.holes.some((hh) => ringHas(hh, uv, rr))) continue;
        p.profile.holes.push(circle(rr, uv[0], uv[1], Math.max(16, Math.round(rr * 6))).reverse());
        (ctx.fired.fasteners ??= []).push(`${s.id}->${p.id}`);
      }
    }
    // a hole that overlaps another is merged into one clean ring so the plate stays a single piece
    for (const p of plates) {
      if (p.profile.holes.length < 2) continue;
      const c = cleanProfile(ctx.M, p.profile);
      if (c) p.profile = c;
    }
  },
};

const insidePlate = (p: Solid3, uv: Vec2): boolean => {
  const pts = p.profile.outer;
  let c = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const a = pts[i]!;
    const b = pts[j]!;
    if (a[1] > uv[1] !== b[1] > uv[1] && uv[0] < ((b[0] - a[0]) * (uv[1] - a[1])) / (b[1] - a[1]) + a[0]) c = !c;
  }
  return c;
};

const ringHas = (ring: Vec2[], c: Vec2, r: number): boolean => ring.every((p) => Math.hypot(p[0] - c[0], p[1] - c[1]) < r * 1.8) && Math.abs(Math.hypot(ring[0]![0] - c[0], ring[0]![1] - c[1]) - r) < r * 0.5;

// ---------------------------------------------------------------------------------------------------- headroom (A13)

export const headroom: Rule = {
  id: "headroom",
  tier: "AUTO",
  ids: ["A13"],
  fixture: "four-bar",
  applies: (ctx) => ctx.sites.some((s) => !s.fixed),
  apply() {},
  after(ctx) {
    // a bolt head under a plate that passes over it needs headroom; the placer opened the gap, this checks it held. The
    // head rides its part, so it is judged with the other parts at the same phase, in plan, where their heights meet.
    for (const s of ctx.sites.filter((q) => !q.fixed)) {
      const head = ctx.get(`${s.id}-bolt-head`);
      if (!head || head.op.op !== "extrude") continue;
      const r = (head.D ?? 12) / 2;
      const w0 = head.frame.o[2];
      const w1 = w0 + head.op.h;
      const carrier = head.body;
      let worst = Infinity;
      let who = "";
      for (const b of ctx.sweeps.moving()) {
        if (s.bodies.includes(b)) continue;
        const e = ctx.extent(b);
        const g = ctx.geoms.get(b);
        if (!e || !g) continue;
        const z0 = e.frame.o[2] + e.w0;
        const z1 = e.frame.o[2] + e.w1;
        if (z1 <= w0 - 0.01 || z0 >= w1 + MIN_GAP) continue;
        ctx.sampled.us.forEach((_, i) => {
          const c = planeCoords(e.frame, xf.apply(ctx.xfOf(carrier, i), s.at)).uv;
          const ring = g.profile.outer.map((q) => planeCoords(e.frame, xf.apply(ctx.xfOf(b, i), fromPlane(g.frame, q, 0))).uv);
          const d = pointDist(ring, c[0], c[1]) - r;
          if (d < worst) {
            worst = d;
            who = b;
          }
        });
      }
      if (worst < MIN_GAP - 0.5) ctx.issues.push(`headroom: the head of ${head.id} is ${worst.toFixed(2)} mm from ${who}, which passes over it`);
      else (ctx.fired.headroom ??= []).push(head.id);
    }
  },
};

// ---------------------------------------------------------------------------------------------------- see-through (L5, T10)

export const seeThrough: Rule = {
  id: "see-through",
  tier: "AUTO",
  ids: ["L5", "T10", "T11", "T12"],
  fixture: "kin:fourBarHung",
  applies: (ctx) => ctx.principle.size > 0,
  apply() {},
  after(ctx) {
    // principle parts the record asks to see through (T10, transparency first): an Oldham coupling's output hub, which
    // would hide the disc, its tongues and the slots
    const asked = new Set(((ctx.teaching as { seeThrough?: unknown } | undefined)?.seeThrough as string[] | undefined) ?? []);
    for (const s of ctx.solids)
      // an index arrow stays opaque on its see-through part: it is the mark that part is read by
      if (asked.has(s.body) && !s.flags.seeThrough && !s.id.endsWith("-index")) {
        s.flags.seeThrough = true;
        (ctx.fired["see-through"] ??= []).push(s.id);
      }
    const dir = ctx.viewDir();
    const principle = [...ctx.principle].map((b) => ({ b, sweep: ctx.sweeps.of(b) })).filter((p): p is { b: string; sweep: NonNullable<typeof p.sweep> } => !!p.sweep);
    if (!principle.length) return;
    const proj = principle.map((p) => ({ b: p.b, cs: p.sweep.project(dir), c: centroidDepth(ctx, p.b, dir) }));
    // a ring pin a lobed disc rolls on is a principle part, though fixed: drawn whole (pin-ring)
    const ringPins = new Set(ctx.joints.filter((j) => j.kit === "pin-ring").map((j) => j.id));
    for (const s of ctx.solids) {
      if (ctx.principle.has(s.body) || s.flags.isBase || s.kind === "foot") continue;
      if ((s.kind === "roller" || s.kind === "dowel") && s.joints.some((j) => ringPins.has(j))) continue;
      // what a loop carries round, or a drive turns with the cycle, moves: it is not a support that stands over the principle
      if (s.convey || s.spin) continue;
      if (ctx.parts.get(s.body)?.id === s.id) continue;
      const m = worldManifold(ctx.M, s);
      const sp = projectAlong(m, dir);
      const sd = v3.dot(centroid(worldPoints(ctx.M, s)), dir);
      const hit: string[] = [];
      for (const p of proj) {
        // it covers the principle part when it is nearer the viewer and their outlines meet
        if (sd >= p.c) continue;
        const x = sp.intersect(p.cs);
        if (x.area() > 0.5) hit.push(p.b);
        x.delete();
      }
      sp.delete();
      m.delete();
      if (hit.length) {
        s.flags.seeThrough = true;
        ctx.covers.set(s.id, [...new Set([...(ctx.covers.get(s.id) ?? []), ...hit])]);
        (ctx.fired["see-through"] ??= []).push(s.id);
      }
    }
    // a principle gear that covers a smaller one on its own axis is drawn see-through too, never removed (a large sun
    // over a small one)
    const gears = [...ctx.principle].map((b) => ({ b, g: ctx.geoms.get(b), part: ctx.parts.get(b) })).filter((x) => x.g && x.part && String(x.g.shape.type) === "gear" && parallel(x.g.frame.z, dir));
    const reach = (x: (typeof gears)[number]) => Math.max(...x.g!.profile.outer.map((q) => Math.hypot(q[0], q[1])));
    const depth = (x: (typeof gears)[number]) => v3.dot(x.part!.frame.o, dir);
    for (const A of gears)
      for (const B of gears) {
        if (A === B || reach(A) <= reach(B) || depth(A) >= depth(B)) continue;
        const off = v3.sub(B.g!.frame.o, A.g!.frame.o);
        if (v3.len(v3.sub(off, v3.mul(dir, v3.dot(off, dir)))) > 0.5) continue;
        A.part!.flags.seeThrough = true;
        ctx.covers.set(A.part!.id, [...new Set([...(ctx.covers.get(A.part!.id) ?? []), B.b])]);
        (ctx.fired["see-through"] ??= []).push(A.part!.id);
      }
  },
};

const centroid = (pts: Vec3[]): Vec3 => {
  const s = pts.reduce((a, p) => v3.add(a, p), [0, 0, 0] as Vec3);
  return v3.mul(s, 1 / Math.max(1, pts.length));
};

function centroidDepth(ctx: BuildCtx, body: string, dir: Vec3): number {
  const p = ctx.parts.get(body);
  return p ? v3.dot(centroid(worldPoints(ctx.M, p)), dir) : 0;
}

void clearance;
void pointDist;
