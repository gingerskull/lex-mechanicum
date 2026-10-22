// The kit of a ring gear on its ground revolute (ring-carrier): a ring is open in the middle, where its pinion or its
// planets run, so it has no shaft at its centre. It runs on three flanged track rollers round its rim, each on a stud
// screwed into a post on the base: the rollers carry it radially, their flanges above and below the rim hold it axially
// (F2), and the three studs locate it (F1).
import { circle, roundedPoly, type Vec2 } from "../../core/geom";
import { H } from "../../hardware/primitives";
import type { BuildCtx } from "../ctx";
import { frameAlong } from "../frames";
import { Local, titleOf } from "../lib";
import type { Rule } from "./types";

const num = (v: unknown, d: number): number => (typeof v === "number" && Number.isFinite(v) ? v : d);

/** Roller radius, its running gap to the rim, and how far a flange laps the rim (mm). */
const RR = 8;
const GAP = 0.3;
const LAP = 3;

/** The ring's outer radius and its centre for a ring-carrier joint. */
function ringOf(ctx: BuildCtx, ring: string): { R: number; z0: number; z1: number } | null {
  const part = ctx.parts.get(ring);
  const body = ctx.kin.bodies.find((b) => b.id === ring);
  if (!part || part.op.op !== "extrude" || !body) return null;
  const sh = (body.shape ?? {}) as Record<string, unknown>;
  const R = num(sh.rim, Math.max(...part.profile.outer.map(([x, y]) => Math.hypot(x, y))));
  return { R, z0: part.frame.o[2], z1: part.frame.o[2] + part.op.h };
}

export const ringCarrier: Rule = {
  id: "ring-carrier",
  tier: "AUTO",
  ids: ["J6", "F1", "F2"],
  fixture: "internal-gear-pair",
  applies: (ctx) => ctx.joints.some((j) => j.kit === "ring-carrier"),
  apply(ctx) {
    for (const j of ctx.joints.filter((q) => q.kit === "ring-carrier")) {
      const ring = j.a === "ground" ? j.b : j.a;
      const r = ringOf(ctx, ring);
      if (!r || !ctx.base) {
        ctx.issues.push(`ring-carrier ${j.id}: no ring part or no base`);
        continue;
      }
      const c: Vec2 = [j.at[0]!, j.at[1]!];
      const D = r.R + RR + GAP;
      // the three stations turned to stand clearest of the other fixed shafts and the meshes
      const avoid: Vec2[] = [
        ...ctx.sites.filter((s) => s.fixed).map((s): Vec2 => [s.at[0]!, s.at[1]!]),
        ...ctx.joints.filter((q) => q.joint.type === "gear-mesh").map((q): Vec2 => [q.at[0]!, q.at[1]!]),
      ];
      let best = 0;
      let a0 = Math.PI / 2;
      for (let k = 0; k < 24; k++) {
        const a = Math.PI / 2 + (k * Math.PI) / 36;
        const clear = Math.min(...[0, 1, 2].flatMap((i) => avoid.map((p) => Math.hypot(c[0] + D * Math.cos(a + (i * 2 * Math.PI) / 3) - p[0], c[1] + D * Math.sin(a + (i * 2 * Math.PI) / 3) - p[1]))), 999);
        if (clear > best + 1e-6) {
          best = clear;
          a0 = a;
        }
      }
      const L = new Local(frameAlong([0, 0, 0], [0, 0, 1], [1, 0, 0]), { joints: [j.id] });
      const bt = ctx.base.top;
      const bb = ctx.base.bottom;
      const f0 = r.z0 - 0.5 - 2;
      const f1 = r.z1 + 0.5 + 2;
      for (let i = 0; i < 3; i++) {
        const a = a0 + (i * 2 * Math.PI) / 3;
        const p: [number, number, number] = [c[0] + D * Math.cos(a), c[1] + D * Math.sin(a), 0];
        const first = i === 0;
        const n = (name: string | undefined) => (first ? (name === undefined ? {} : { name, qty: 3 }) : { name: "", qty: 0 });
        L.add(H.standoff(`${j.id}-post${i}`, { at: p, z0: bt, z1: f0, ...n(undefined), ...(first ? { qty: 3 } : {}) }));
        L.add(H.washer(`${j.id}-fl${i}a`, 8.4, 2 * (RR + LAP + GAP), { at: p, z0: f0, z1: f0 + 2, body: "ground", ...n("Roller flange, under the rim") }));
        L.add(H.roller(`${j.id}-roller${i}`, 8, 2 * RR, { at: p, z0: r.z0, z1: r.z1, body: "ground", ...(first ? { qty: 3 } : { name: "", qty: 0 }) }));
        L.add(H.washer(`${j.id}-fl${i}b`, 8.4, 2 * (RR + LAP + GAP), { at: p, z0: f1 - 2, z1: f1, body: "ground", ...n("Roller flange, over the rim") }));
        L.add(H.screw(`${j.id}-stud${i}`, "socket", 8, f1 - f0 + 12, { at: p, face: f1, dir: -1, ...(first ? { name: "Shoulder screw M8, the roller's stud", qty: 3 } : { name: "", qty: 0 }) }));
        L.add(H.screw(`${j.id}-base${i}`, "socket", 5, bt - bb + 10, { at: p, face: bb, dir: 1, ...(first ? { qty: 3 } : { name: "", qty: 0 }) }));
        ctx.baseHoles.push({ at: [p[0], p[1]], r: 2.75, joint: j.id });
      }
      // a ring turned by hand (a manual driver on its joint): a knurled knob on the rim to turn it, and an index plunger
      // on the first station that drops into one of twelve holes round the rim to hold it (V5, F6)
      const manual = ctx.kin.drivers.some((d) => d.kind === "manual" && d.joint === j.id);
      const held: string[] = [];
      if (manual) {
        const part = ctx.parts.get(ring)!;
        const rIdx = r.R - 6;
        const rim = (a: number): [number, number] => [c[0] + rIdx * Math.cos(a), c[1] + rIdx * Math.sin(a)];
        // the index holes, in the ring's own frame (the frame's x is its first joint's direction, turned by its phasing)
        for (let k = 0; k < 12; k++) {
          const a = a0 + (k * Math.PI) / 6;
          const w = rim(a);
          const uv = [w[0] - part.frame.o[0], w[1] - part.frame.o[1]];
          const x = part.frame.x;
          const y = [-x[1], x[0]];
          part.profile.holes.push(circle(2.6, uv[0]! * x[0]! + uv[1]! * x[1]!, uv[0]! * y[0]! + uv[1]! * y[1]!, 20).reverse());
        }
        const s0: Vec2 = [c[0] + D * Math.cos(a0), c[1] + D * Math.sin(a0)];
        const pin = rim(a0);
        const bz = f1;
        L.add(H.plate(`${j.id}-ixb`, roundedPoly([s0, pin], 7), { body: "ground", kind: "bracket", z0: bz, z1: bz + 4, name: "Index bracket, clamped under the first roller's stud", holes: [circle(2.6, pin[0], pin[1], 20).reverse()] }));
        L.add(H.dowel(`${j.id}-ixp`, 5, { body: "ground", at: [pin[0], pin[1], 0], z0: r.z1 - 6, z1: bz + 14, name: "Index plunger pin Ø5, drops into a hole in the rim" }));
        L.add(H.spring(`${j.id}-ixs`, "compression", { body: "ground", at: [pin[0], pin[1], 0], D: 8, wire: 0.8, z0: bz + 4, z1: bz + 10, name: "Compression spring Ø8, holds the plunger down" }));
        L.add(H.collar(`${j.id}-ixk`, 5, 12, { body: "ground", at: [pin[0], pin[1], 0], z0: bz + 10, z1: bz + 14, name: "Pull knob on the plunger, knurled" }));
        const kn = rim(a0 + Math.PI / 12);
        L.add(H.collar(`${j.id}-knob`, 4.2, 14, { body: ring, at: [kn[0], kn[1], 0], z0: r.z1, z1: r.z1 + 12, name: "Knurled knob on the rim, turns the ring by hand" }));
        L.add(H.screw(`${j.id}-knob-sc`, "csk", 4, 16, { body: ring, at: [kn[0], kn[1], 0], face: r.z0, dir: 1, name: "" }));
        held.push(`${j.id}-ixp`, `${j.id}-ixs`);
      }
      ctx.add(L.out());
      ctx.note({
        id: j.id,
        kit: "ring-carrier",
        at: j.at,
        title: `ring-carrier · ${titleOf(j.id)}`,
        note: `${titleOf(j.id)}: the ring is open in the middle, so it has no centre shaft: it runs on three Ø${2 * RR} track rollers round its Ø${(2 * r.R).toFixed(0)} rim, each on an M8 shoulder screw in a post on the base; a flange above and below each roller laps the rim by ${LAP} mm and holds it axially; the load goes through the studs and posts into the base.${manual ? " Turned by hand: a knurled knob on the rim; an index plunger on the first roller's stud drops into one of twelve holes in the rim and holds it." : ""}`,
        serves: { F1: [`${j.id}-post0`], F2: [`${j.id}-fl0a`, `${j.id}-fl0b`], ...(held.length ? { F6: held } : {}) },
        badge: ["three rollers", "ok"],
      });
    }
  },
};
