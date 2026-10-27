// A rod's leg in a bore of a turning disc (a cylindrical joint between two moving bodies: Hobson's joint). The leg slides
// and turns in an oil-impregnated bronze bushing pressed into the disc's bore, through the disc's thickness: the
// replaceable wear part (M14), oiled by its own pores (F8).
import { H } from "../../../hardware/primitives";
import type { Vec3 } from "../../../kin/math";
import { fromPlane, planeCoords } from "../../frames";
import { Local, titleOf } from "../../lib";
import { num } from "../../shapes/common";
import type { Rule } from "../types";

const legBore: Rule = {
  id: "leg-bore",
  tier: "AUTO",
  ids: ["J5", "F2", "F8", "M14"],
  fixture: "hobsons-joint",
  applies: (ctx) => ctx.joints.some((j) => j.kit === "leg-bore"),
  apply(ctx) {
    const shape = (id: string) => ctx.kin.bodies.find((q) => q.id === id)?.shape as Record<string, unknown> | undefined;
    for (const j of ctx.joints.filter((q) => q.kit === "leg-bore")) {
      // the rod is the body whose shape is a bent rod; the other carries the bore
      const rod = String(shape(j.b)?.type) === "elbow" ? j.b : j.a;
      const disc = rod === j.b ? j.a : j.b;
      const bp = ctx.parts.get(disc);
      if (!bp || bp.op.op !== "extrude") {
        ctx.issues.push(`joint ${j.id}: the bore's body ${disc} is not an extruded part, leg-bore not built`);
        continue;
      }
      const d = num(shape(rod)?.diameter, 6);
      const D = d + 4;
      const uv = planeCoords(bp.frame, j.at as Vec3).uv;
      const L = new Local({ o: fromPlane(bp.frame, uv, 0), x: bp.frame.x, z: bp.frame.z }, { joints: [j.id] });
      L.add(H.bushing(`${j.id}-bush`, d, D, { body: disc, z0: 0, z1: bp.op.h, name: `Bronze bushing ${d}x${D}x${bp.op.h}, oil-impregnated, pressed in` }));
      ctx.add(L.out());
      ctx.note({
        id: j.id,
        kit: "leg-bore",
        at: j.at,
        title: `leg-bore · ${titleOf(j.id)}`,
        note: `${titleOf(j.id)}: the Ø${d} leg of ${titleOf(rod).toLowerCase()} slides and turns in a sintered bronze bushing pressed through the ${titleOf(disc).toLowerCase()}'s bore, the replaceable wear part, oiled from its pores; the rod is held by its other leg in the other disc, so nothing else retains it.`,
        serves: { F8: [`${j.id}-bush`] },
        badge: ["leg in bushing", "ok"],
      });
      (ctx.fired["leg-bore"] ??= []).push(j.id);
    }
  },
};

export const ELBOW_KITS: Rule[] = [legBore];
