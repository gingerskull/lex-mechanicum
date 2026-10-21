// The kit of a ring gear on its ground revolute (ring-carrier): a ring is open in the middle, where its pinion or its
// planets run, so it has no shaft at its centre. It runs on three flanged track rollers round its rim, each on a stud
// screwed into a post on the base: the rollers carry it radially, their flanges above and below the rim hold it axially
// (F2), and the three studs locate it (F1).
import { type Vec2 } from "../../core/geom";
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
      const L = new Local(frameAlong([0, 0, 0], [0, 0, 1]), { joints: [j.id] });
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
      ctx.add(L.out());
      ctx.note({
        id: j.id,
        kit: "ring-carrier",
        at: j.at,
        title: `ring-carrier · ${titleOf(j.id)}`,
        note: `${titleOf(j.id)}: the ring is open in the middle, so it has no centre shaft: it runs on three Ø${2 * RR} track rollers round its Ø${(2 * r.R).toFixed(0)} rim, each on an M8 shoulder screw in a post on the base; a flange above and below each roller laps the rim by ${LAP} mm and holds it axially; the load goes through the studs and posts into the base.`,
        serves: { F1: [`${j.id}-post0`], F2: [`${j.id}-fl0a`, `${j.id}-fl0b`] },
        badge: ["three rollers", "ok"],
      });
    }
  },
};
