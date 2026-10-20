// The recurring hand fixes, promoted to rules (A22): an exact adjustable length (F7) as a turnbuckle in the link's own
// plane, and the cable clips along the drive's lead. The rocker stops and the swing scale are in shared.ts, the hub of a
// keyed gear in the stack builder.
import { TAU, roundRect, type Vec2 } from "../../core/geom";
import { H } from "../../hardware/primitives";
import { threadFor } from "../../hardware/tables";
import { v3, type Vec3 } from "../../kin/math";
import type { Solid3 } from "../../solids/types";
import type { BuildCtx } from "../ctx";
import { fromPlane, place, type Frame } from "../frames";
import { Local } from "../lib";
import type { Rule } from "./types";

const UPF: Frame = { o: [0, 0, 0], x: [1, 0, 0], z: [0, 0, 1] };

/** Bodies the record marks as adjustable in length (`shape.adjustable`): one length that must be exact (F7). */
const adjustables = (ctx: BuildCtx): string[] => ctx.kin.bodies.filter((b) => (b.shape as { adjustable?: boolean } | undefined)?.adjustable === true && ctx.parts.has(b.id)).map((b) => b.id);

export const adjustableLength: Rule = {
  id: "adjustable-length",
  tier: "AUTO",
  ids: ["F7", "A22"],
  fixture: "kin:adjustableLink",
  applies: (ctx) => adjustables(ctx).length > 0,
  apply(ctx) {
    const M = ctx.M;
    for (const id of adjustables(ctx)) {
      const part = ctx.parts.get(id)!;
      const g = ctx.geoms.get(id)!;
      if (ctx.twins.has(id)) continue;
      const xs = g.pins.map((p) => p.uv[0]);
      const xm = (Math.min(...xs) + Math.max(...xs)) / 2;
      const gap = 14;
      // the link in two halves: its outline cut either side of a gap in the middle, the bores kept in whichever half holds them
      const all = [part.profile.outer, ...part.profile.holes];
      const cs = new M.CrossSection(all, "EvenOdd");
      const box = (x0: number, x1: number): Vec2[] => [[x0, -1e4], [x1, -1e4], [x1, 1e4], [x0, 1e4]];
      const halves = [box(-1e4, xm - gap / 2), box(xm + gap / 2, 1e4)].map((b) => {
        const c = new M.CrossSection([b], "NonZero");
        const x = cs.intersect(c);
        c.delete();
        const polys = x.toPolygons() as Vec2[][];
        x.delete();
        return polys;
      });
      cs.delete();
      const area = (r: Vec2[]) => r.reduce((a, p, i) => a + (p[0] * r[(i + 1) % r.length]![1] - r[(i + 1) % r.length]![0] * p[1]), 0) / 2;
      const profileOf = (polys: Vec2[][]) => {
        const outer = polys.filter((r) => area(r) > 0).sort((a, b) => area(b) - area(a))[0]!;
        return { outer, holes: polys.filter((r) => area(r) < 0) };
      };
      const [near, far] = halves.map(profileOf) as [ReturnType<typeof profileOf>, ReturnType<typeof profileOf>];
      part.profile = near;
      const farPart: Solid3 = { ...part, id: `${id}-far`, name: "", profile: far, marks: [], joints: [...part.joints] };
      ctx.sweeps.touch([id]);
      ctx.rule = adjustableLength.id;
      ctx.add(farPart);
      // the turnbuckle: left and right hand studs, a flat body in the link's plane, a jam nut on each stud (F7)
      const thick = part.op.op === "extrude" ? part.op.h : 6;
      const o = fromPlane(part.frame, [xm, 0], thick / 2);
      const run: Vec3 = part.frame.x;
      const axisF: Frame = { o, x: part.frame.z, z: run };
      const L = new Local(axisF, { joints: [id] });
      const M3 = threadFor(4);
      L.add(H.shaft(`${id}-stud`, { d: 4, z0: -gap / 2 - 6, z1: gap / 2 + 6 }, { body: id, name: `Turnbuckle studs M${M3}, left and right hand` }));
      for (const [k, z] of [[0, -gap / 2 - 2.4], [1, gap / 2]] as const) L.add(H.nut(`${id}-jam${k}`, 3, { body: id, z0: z, z1: z + 2.4, ...(k ? { name: "", qty: 0 } : { name: "Jam nuts M3", qty: 2 }) }));
      ctx.add(L.out());
      const bodyF: Frame = { o: fromPlane(part.frame, [xm, 0], 0), x: part.frame.x, z: part.frame.z };
      ctx.add(place(bodyF, H.plate(`${id}-turnbuckle`, roundRect(-gap / 2 - 1, -4, gap / 2 + 1, 4, 2), { body: id, kind: "bracket", role: "link", name: "Turnbuckle body, flat, in the link's plane", z0: 0, z1: thick, joints: [id] })));
      ctx.sweeps.touch([id]);
      ctx.note({ id: `${id}-adjust`, kit: "adjustable-length", at: part.frame.o, title: `Adjustable length · ${id}`, note: `${id} is two halves joined in its own plane by left and right hand studs, a flat body and jam nuts; set to the record's length and locked.`, serves: { F7: [`${id}-turnbuckle`, `${id}-stud`] }, badge: ["adjustable, set", "ok"] });
      void TAU;
    }
  },
};

export const cableClip: Rule = {
  id: "cable-clip",
  tier: "AUTO",
  ids: ["A22", "V6"],
  fixture: "four-bar",
  applies: (ctx) => ctx.solids.some((s) => s.kind === "lead"),
  apply(ctx) {
    for (const lead of ctx.solids.filter((s) => s.kind === "lead")) {
      const r = lead.profile.outer;
      const n = r.length / 2;
      const centre: Vec2[] = [];
      for (let i = 0; i < n; i++) centre.push([(r[i]![0] + r[r.length - 1 - i]![0]) / 2, (r[i]![1] + r[r.length - 1 - i]![1]) / 2]);
      // a clip at each end and every 40 mm between, on the underside of the base beside the lead
      let acc = 0;
      const at: Vec2[] = [centre[0]!];
      for (let i = 1; i < centre.length; i++) {
        acc += Math.hypot(centre[i]![0] - centre[i - 1]![0], centre[i]![1] - centre[i - 1]![1]);
        if (acc >= 40) {
          at.push(centre[i]!);
          acc = 0;
        }
      }
      at.push(centre[centre.length - 1]!);
      const z0 = lead.frame.o[2];
      at.forEach((p, k) => {
        const w = fromPlane(lead.frame, p, 0);
        ctx.add(place(UPF, H.cableClip(`${lead.id}-clip${k}`, { at: [w[0], w[1], 0], z0: z0 - 1, z1: z0 + 2, joints: lead.joints, ...(k ? { name: "", qty: 0 } : { qty: at.length }) })));
      });
      void v3;
    }
  },
};
