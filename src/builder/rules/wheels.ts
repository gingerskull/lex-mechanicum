// A wheel carried by a body (`shape.wheel` in the record: a steering knuckle's road wheel). The wheel stands on edge on a
// stub axle, its axis through the body's pivot and the record's wheel-centre point, so the axis line the teaching draws
// is the wheel's own. The stub is pressed into an open tube that rises from the body round its pivot, the knuckle's
// upright; the pivot's own hardware stays inside the tube. The wheel turns with its body: it is part of the knuckle.
import { circle, roundRect } from "../../core/geom";
import { H } from "../../hardware/primitives";
import { bearingFor } from "../../hardware/tables";
import { v3, xf, type Vec3 } from "../../kin/math";
import type { BuildCtx } from "../ctx";
import { MIN_GAP } from "../constants";
import { place, type Frame } from "../frames";
import { Local } from "../lib";
import type { Rule } from "./types";

interface WheelSpec {
  diameter: number;
  width: number;
  stub: number;
}

const UP: Vec3 = [0, 0, 1];
/** The upright tube round the pivot: bore and wall (mm). */
const TUBE = { bore: 10.75, wall: 2 };

const wheelBodies = (ctx: BuildCtx): { id: string; w: WheelSpec }[] =>
  ctx.kin.bodies
    .map((b) => ({ id: b.id, w: (b.shape as { wheel?: WheelSpec } | undefined)?.wheel }))
    .filter((q): q is { id: string; w: WheelSpec } => !!q.w && ctx.parts.has(q.id));

export const wheels: Rule = {
  id: "wheels",
  tier: "AUTO",
  ids: ["D1", "F2"],
  fixture: "ackermann-steering",
  applies: (ctx) => wheelBodies(ctx).length > 0,
  apply(ctx) {
    for (const { id, w } of wheelBodies(ctx)) {
      const part = ctx.parts.get(id)!;
      const F = ctx.S.bodyFrame.get(id) ?? xf.id();
      const pivot = F.t;
      // the wheel centre: the body's point at the stub's distance from the pivot, else straight out along the body's -x
      const pt = (ctx.kin.points ?? []).find((p) => p.body === id && Math.abs(Math.hypot(Number(p.local[0]), Number(p.local[1])) - w.stub) < 0.5);
      const toward = pt ? v3.sub(xf.apply(F, [Number(pt.local[0]), Number(pt.local[1]), 0]), pivot) : xf.dir(F, [-1, 0, 0]);
      const u = v3.unit([toward[0], toward[1], 0]);
      const thick = part.op.op === "extrude" ? part.op.h : 6;
      const top = part.frame.o[2] + thick;
      const R = w.diameter / 2;
      const tubeR = TUBE.bore + TUBE.wall;
      // the wheel stands clear of the body below it and of the tube beside it
      const zc = top + MIN_GAP + R;
      const inner = Math.max(w.stub - w.width / 2, tubeR + MIN_GAP);
      const outer = inner + w.width;
      const base: Vec3 = [pivot[0], pivot[1], zc];
      const along: Frame = { o: base, x: UP, z: u };
      const L = new Local(along, { joints: [id] });
      const brg = bearingFor(8, R * 0.5, 7);
      L.add(
        H.plate(`${id}-wheel`, circle(R, 0, 0, 72), {
          body: id,
          kind: "part",
          role: part.role,
          name: `Wheel Ø${w.diameter} x ${w.width}, on a stub axle`,
          mat: "Polyamide 6.6, turned",
          holes: [circle(brg ? brg.D / 2 : 4.2, 0, 0, 32).reverse()],
          z0: inner,
          z1: outer,
        }),
      );
      if (brg) for (const [k, z] of [[0, inner], [1, outer - brg.B]] as const) L.add(H.bearing(`${id}-wheel-brg${k}`, brg, { body: id, z0: z, z1: z + brg.B, ...(k ? { name: "", qty: 0 } : {}) }));
      L.add(H.washer(`${id}-wheel-tw`, 8.2, 14, { body: id, kind: "thrustWasher", name: "Thrust washer 8.2x14, bronze", mat: "Bronze CuSn8", z0: inner - 1, z1: inner }));
      L.add(...H.shaft(`${id}-stub`, { d: 8, z0: tubeR - TUBE.wall - 1, z1: outer + 9 }, { body: id, name: "Stub axle Ø8, pressed into the upright, M8 end" }));
      L.add(H.washer(`${id}-stub-w`, 8.4, 16, { body: id, name: "Washer M8 (ISO 7089)", z0: outer, z1: outer + 1.6 }));
      L.add(H.nut(`${id}-stub-nut`, 8, { body: id, z0: outer + 1.6 }));
      ctx.add(L.out());
      // the upright: an open tube round the pivot from the body's top to above the stub
      const tubeF: Frame = { o: [pivot[0], pivot[1], top], x: [1, 0, 0], z: UP };
      ctx.add(
        place(
          tubeF,
          H.plate(`${id}-upright`, circle(tubeR, 0, 0, 48), {
            body: id,
            kind: "bracket",
            role: part.role,
            name: `Upright tube Ø${2 * tubeR} x ${Math.round(zc + 10 - top)}, welded to the knuckle, carries the stub axle`,
            mat: "Steel tube, welded",
            holes: [circle(TUBE.bore, 0, 0, 48).reverse()],
            z0: 0,
            z1: zc + 10 - top,
            joints: [id],
          }),
        ),
      );
      ctx.sweeps.touch([id]);
      (ctx.fired.wheels ??= []).push(`${id}-wheel`);
      ctx.note({ id: `${id}-wheel`, kit: "wheels", at: base, title: `Wheel · ${id}`, note: `${id} carries a Ø${w.diameter} wheel on a stub axle along its axis line, ${w.stub} mm out from the pivot; the stub is pressed into an open tube round the pivot, whose hardware stays reachable from above. The wheel turns on two bearings and is held by a washer and a nyloc nut.`, serves: { F2: [`${id}-stub-nut`] }, badge: ["wheel on the knuckle", "ok"] });
      void roundRect;
    }
  },
};
