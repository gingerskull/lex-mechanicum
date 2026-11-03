// A walker's contacts: the body's vertical slide on a column (a sleeve on a turned column from the base, keyed against
// turning, with a stop collar), a free flat belt round two drums whose axes lie in the base plane (its band round the
// pitch path, its marks running with the drums' turn), and a foot's sole on that belt (a rubber pad under the toes).
import { circle, roundRect } from "../../../core/geom";
import { H } from "../../../hardware/primitives";
import { type Vec3, v3 } from "../../../kin/math";
import type { BuildCtx } from "../../ctx";
import { place, type Frame } from "../../frames";
import { titleOf } from "../../lib";
import { turnTravel } from "../../belt-run";
import { MIN_GAP } from "../../constants";
import type { Rule } from "../types";

const num = (v: unknown, d: number): number => (typeof v === "number" && Number.isFinite(v) ? v : d);
const rec = (j: unknown): Record<string, unknown> => j as Record<string, unknown>;

/** The body's travel along a prismatic joint's axis over the sampled cycle, from the reference. */
function travelOf(ctx: BuildCtx, body: string, axis: Vec3): [number, number] {
  let lo = 0;
  let hi = 0;
  ctx.sampled.us.forEach((_, i) => {
    const t = v3.dot(ctx.xfOf(body, i).t, axis);
    lo = Math.min(lo, t);
    hi = Math.max(hi, t);
  });
  return [lo, hi];
}

export const column: Rule = {
  id: "column-slide",
  tier: "AUTO",
  ids: ["J5", "A9", "F3", "F8"],
  fixture: "turkey-trot-walker",
  applies: (ctx) => ctx.joints.some((j) => j.kit === "column"),
  apply(ctx) {
    for (const ji of ctx.joints.filter((j) => j.kit === "column")) {
      const body = ji.a === "ground" ? ji.b : ji.a;
      const ax = v3.unit(ji.axis);
      const [t0, t1] = travelOf(ctx, body, ax);
      const R = num(rec(ji.joint).column, 8);
      const sleeve = num(rec(ji.joint).sleeve, 40);
      const base = ctx.base ? ctx.base.top : ji.at[2] - 100;
      const f: Frame = { o: [ji.at[0], ji.at[1], 0], x: [1, 0, 0], z: [0, 0, 1] };
      const top = ji.at[2] + sleeve / 2 + t1 + 4;
      const out = [
        H.solid(`${ji.id}-column`, { name: `Column Ø${2 * R}, turned, a flat along it`, kind: "shaft", role: "ground", mat: "Steel C45, ground", outer: circle(R, 0, 0, 40), z0: base, z1: top + 6, body: "ground" }),
        H.solid(`${ji.id}-flange`, { name: `Column flange Ø${2 * R + 16}, four M4 screws into the base`, kind: "collar", role: "ground", mat: "Steel C45", outer: circle(R + 8, 0, 0, 40), holes: [circle(R, 0, 0, 40).reverse()], z0: base, z1: base + 5, body: "ground" }),
        H.solid(`${ji.id}-key`, { name: "Key strip along the column's flat: the sleeve slides and does not turn", kind: "key", role: "ground", mat: "Steel C45, bright", outer: roundRect(R - 1, -1.5, R + 1.5, 1.5, 0.4), z0: ji.at[2] - sleeve / 2 + t0 - 2, z1: top, body: "ground" }),
        H.solid(`${ji.id}-sleeve`, { name: `Sleeve, bronze-bushed, ${sleeve} mm long, keyed on the column`, kind: "housing", role: "link", mat: "Aluminium 6061-T6", outer: circle(R + 6, 0, 0, 40), holes: [circle(R + 2.05, 0, 0, 40).reverse()], z0: ji.at[2] - sleeve / 2, z1: ji.at[2] + sleeve / 2, body }),
        H.bushing(`${ji.id}-bush`, 2 * R + 0.1, 2 * R + 4, { body, z0: ji.at[2] - sleeve / 2, z1: ji.at[2] + sleeve / 2, name: `Bronze bushing ${2 * R}x${2 * R + 4}x${sleeve}`, mat: "Bronze CuSn8, oil-impregnated" }),
        H.collar(`${ji.id}-stop`, 2 * R, 2 * R + 8, { body: "ground", z0: top - 1, z1: top + 5, name: `Stop collar Ø${2 * R + 8} on the column's top, set screw` }),
      ];
      ctx.add(place(f, out, { joints: [ji.id] }));
      ctx.note({ id: ji.id, kit: "column", at: ji.at, title: `column · ${titleOf(ji.id)}`, note: `${titleOf(ji.id)}: the ${titleOf(body).toLowerCase()} rides a bronze-bushed sleeve ${sleeve} mm long on a turned Ø${2 * R} column from the base, keyed on a strip along the column's flat so it slides and does not turn; a collar on the column's top stops it. Its travel over the cycle is ${(t1 - t0).toFixed(1)} mm.`, serves: { F3: [`${ji.id}-key`], F8: [`${ji.id}-bush`], F1: [`${ji.id}-flange`] }, badge: ["column built", "ok"] });
      (ctx.fired["column-slide"] ??= []).push(ji.id);
    }
  },
};

export const flatBelt: Rule = {
  id: "flat-belt",
  tier: "AUTO",
  ids: ["J8", "J12"],
  fixture: "turkey-trot-walker",
  applies: (ctx) => ctx.joints.some((j) => j.kit === "flat-belt"),
  apply(ctx) {
    for (const ji of ctx.joints.filter((j) => j.kit === "flat-belt")) {
      const r = rec(ji.joint);
      const R = num(r.radiusA, 15);
      const t = num(r.thickness, 2);
      const w = num(r.width, 60);
      const ga = ctx.S.joints.get([...ctx.kin.joints].find((q) => (q.a === "ground" && q.b === ji.a) || (q.b === "ground" && q.a === ji.a))?.id ?? "");
      const gb = ctx.S.joints.get([...ctx.kin.joints].find((q) => (q.a === "ground" && q.b === ji.b) || (q.b === "ground" && q.a === ji.b))?.id ?? "");
      if (!ga || !gb) {
        ctx.issues.push(`${ji.id}: a flat belt runs on two drums on ground revolutes`);
        continue;
      }
      // the belt's plane: square to the drums' axis, the turn's sense of ga's axis
      const z = v3.unit(ga.axis);
      const x0 = v3.sub(gb.at, ga.at);
      const x = v3.unit(v3.perp(x0, z));
      const f: Frame = { o: ga.at, x, z };
      const y = v3.cross(z, x);
      const uv = (p: Vec3): [number, number] => [v3.dot(v3.sub(p, ga.at), x), v3.dot(v3.sub(p, ga.at), y)];
      const [bx, by] = uv(gb.at);
      const pitch = H.hullOf([[0, 0, R], [bx, by, R]]);
      const outer = H.hullOf([[0, 0, R + t / 2], [bx, by, R + t / 2]]);
      const inner = H.hullOf([[0, 0, R - t / 2], [bx, by, R - t / 2]]);
      const run = { path: pitch, tr: turnTravel(ctx, ji.a, z, R, pitch) };
      // centred on the drums' middle along the axis
      const pa = ctx.parts.get(ji.a);
      const mid = pa && pa.op.op === "extrude" ? v3.dot(v3.sub(pa.frame.o, ga.at), z) * (v3.dot(pa.frame.z, z) > 0 ? 1 : -1) + (v3.dot(pa.frame.z, z) > 0 ? pa.op.h / 2 : -pa.op.h / 2) : 0;
      ctx.add(place(f, [H.solid(`${ji.id}-band`, { name: `Flat belt ${w} mm wide, ${t} mm thick, endless, rubber on polyester`, kind: "belt", role: "hw", mat: "Rubber on polyester carcass", outer, holes: [inner.slice().reverse()], z0: mid - w / 2, z1: mid + w / 2, body: "ground" })], { joints: [ji.id], run }));
      ctx.note({ id: ji.id, kit: "flat-belt", at: ji.at, title: `flat-belt · ${titleOf(ji.id)}`, note: `${titleOf(ji.id)}: an endless flat belt ${w} mm wide round both drums, ${t} mm thick, its middle on the drums' ${R.toFixed(2)} mm radius; nothing turns the drums but the belt, and the belt is driven only by what stands on its top run. Its marks run with the drums' turn. Dry: no lubrication.`, serves: {}, badge: ["flat belt built", "ok"] });
      (ctx.fired["flat-belt"] ??= []).push(ji.id);
      void MIN_GAP;
    }
  },
};

export const sole: Rule = {
  id: "sole-pad",
  tier: "AUTO",
  ids: ["J7", "M14"],
  fixture: "turkey-trot-walker",
  applies: (ctx) => ctx.joints.some((j) => j.kit === "sole"),
  apply(ctx) {
    for (const ji of ctx.joints.filter((j) => j.kit === "sole")) {
      const foot = ji.a === "ground" ? ji.b : ji.a;
      const part = ctx.parts.get(foot);
      if (!part) continue;
      // a rubber pad under the foot's plate, its own outline, 1 mm
      const s = H.solid(`${ji.id}-pad`, { name: "Sole pad, natural rubber 1 mm, bonded: grips the belt", kind: "wearStrip", role: "hw", mat: "Natural rubber, 60 Shore A", outer: part.profile.outer.map((q) => [q[0], q[1]] as [number, number]), z0: -1, z1: 0, body: foot });
      ctx.add(place(part.frame, [s], { joints: [ji.id] }));
      ctx.note({ id: ji.id, kit: "sole", at: ji.at, title: `sole · ${titleOf(ji.id)}`, note: `${titleOf(ji.id)}: the ${titleOf(foot).toLowerCase()} stand on the belt's top run on a bonded rubber pad while this foot is the lower, and push the belt back with it; the pad lifts clear in the swing.`, serves: { F2: [`${ji.id}-pad`] }, badge: ["sole built", "ok"] });
      (ctx.fired["sole-pad"] ??= []).push(ji.id);
    }
  },
};

export const WALKER_KITS: Rule[] = [column, flatBelt, sole];
