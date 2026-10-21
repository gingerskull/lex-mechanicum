// The kits of a cylinder that swings on a trunnion (the quick-return and slider playbook: "pivot pin retained (F2);
// spring holding the port face (F6)"). The cylinder and its piston are the bodies' own parts (src/builder/shapes.ts):
//  - trunnion: the cylinder's ground revolute. A pin pressed into the cylinder's port pad turns in a bronze bushing in
//    the fixed port face under it, runs down through the base, and a compression spring between a thrust washer under
//    the base and a nyloc nut on the pin holds the port faces together;
//  - piston-bore: the piston's slide in the bore. Two rings in the piston head, the replaceable wear parts (M14).
import { circle } from "../../core/geom";
import { inside } from "../../core/poly";
import { H } from "../../hardware/primitives";
import { type Vec3, v3 } from "../../kin/math";
import type { BuildCtx } from "../ctx";
import { frameAlong, fromPlane, planeCoords } from "../frames";
import type { JointInfo } from "../sites";
import { Local, titleOf } from "../lib";
import type { Rule } from "./types";

const num = (v: unknown, d: number): number => (typeof v === "number" && Number.isFinite(v) ? v : d);

/** The fixed plate a point of the plan stands over, and its height range: the port face a trunnion runs in. */
function plateUnder(ctx: BuildCtx, at: Vec3): { id: string; z0: number; z1: number } | null {
  const joined = new Set(ctx.kin.joints.flatMap((j) => [j.a, j.b]));
  for (const [id, p] of ctx.parts) {
    if (joined.has(id) || p.op.op !== "extrude") continue;
    if (!inside(p.profile.outer, planeCoords(p.frame, at).uv)) continue;
    return { id: p.id, z0: p.frame.o[2], z1: p.frame.o[2] + p.op.h };
  }
  return null;
}

export const trunnion: Rule = {
  id: "trunnion",
  tier: "AUTO",
  ids: ["J1", "F2", "F4", "F6"],
  fixture: "oscillating-cylinder",
  applies: (ctx) => ctx.joints.some((j) => j.kit === "trunnion"),
  apply(ctx) {
    for (const j of ctx.joints.filter((q) => q.kit === "trunnion")) {
      const body = j.a === "ground" ? j.b : j.a;
      const pad = ctx.parts.get(body);
      const plate = plateUnder(ctx, j.at as Vec3);
      if (!pad || !plate || !ctx.base || pad.op.op !== "extrude") {
        ctx.issues.push(`trunnion ${j.id}: no port pad or no port face under it`);
        continue;
      }
      const d = 8;
      const M = 8;
      const top = pad.frame.o[2] + pad.op.h - 2;
      const bb = ctx.base.bottom;
      const f = frameAlong([j.at[0]!, j.at[1]!, 0], [0, 0, 1]);
      const L = new Local(f, { joints: [j.id] });
      const sp = 12;
      const nutH = 8;
      const end = bb - 1 - 1 - sp - 1 - nutH - 2;
      L.add(H.shaft(`${j.id}-pin`, { d, z0: end, z1: top, thread: { M, z0: end, z1: bb - 1 - 1 - sp - 1 } }, { body, name: `Trunnion pin Ø${d}, pressed into the cylinder, M${M} end` }));
      L.add(H.bushing(`${j.id}-bush`, d, d + 4, { body: "ground", z0: plate.z0, z1: plate.z1 }));
      L.add(H.thrustWasher(`${j.id}-tw`, d + 0.2, d + 10, { body: "ground", z0: bb - 1, z1: bb }));
      L.add(H.washer(`${j.id}-w0`, d + 0.3, d + 10, { body, z0: bb - 2, z1: bb - 1, name: "Spring seat washer" }));
      L.add(H.spring(`${j.id}-spring`, "compression", { body, D: d + 6, wire: 1.2, z0: bb - 2 - sp, z1: bb - 2, name: `Compression spring Ø${d + 6}, wire 1.2: holds the port faces together` }));
      L.add(H.washer(`${j.id}-w1`, d + 0.3, d + 10, { body, z0: bb - 3 - sp, z1: bb - 2 - sp, name: "" }));
      L.add(H.nut(`${j.id}-nut`, M, { body, z0: bb - 3 - sp - nutH, z1: bb - 3 - sp }));
      ctx.add(L.out());
      // the port faces slide on each other by design, held together by the spring
      pad.slides = [plate.id, `${j.id}-bush`];
      ctx.baseHoles.push({ at: [j.at[0]!, j.at[1]!], r: d / 2 + 1, joint: j.id });
      ctx.note({
        id: j.id,
        kit: "trunnion",
        at: j.at,
        title: `trunnion · ${titleOf(j.id)}`,
        note: `${titleOf(j.id)}: a Ø${d} pin pressed into the cylinder's port pad turns in a bronze bushing in the port face, runs down through the base; a compression spring between a bronze thrust washer under the base and a nyloc nut on the pin holds the cylinder's port face on the standard's, so the ports seal and the swing does the valving.`,
        badge: ["both ends held", "ok"],
        serves: { F2: [`${j.id}-nut`], F4: [`${j.id}-tw`], F6: [`${j.id}-spring`] },
      });
      (ctx.fired.trunnion ??= []).push(j.id);
    }
  },
};

export const pistonBore: Rule = {
  id: "piston-bore",
  tier: "AUTO",
  ids: ["J5", "M14"],
  fixture: "oscillating-cylinder",
  applies: (ctx) => ctx.joints.some((j) => j.kit === "piston-bore"),
  apply(ctx) {
    for (const j of ctx.joints.filter((q) => q.kit === "piston-bore")) {
      if (plungerBore(ctx, j)) continue;
      const piston = [j.a, j.b].find((b) => String(ctx.kin.bodies.find((q) => q.id === b)?.shape?.type) === "piston");
      const head = piston ? ctx.get(`${piston}-head`) : undefined;
      if (!piston || !head || head.op.op !== "extrude") continue;
      const cyl = ctx.kin.bodies.find((q) => String(q.shape?.type) === "cylinder")?.shape as Record<string, unknown> | undefined;
      const bore = num(cyl?.bore, 40);
      const L = new Local(head.frame, { joints: [j.id] });
      const h = head.op.h;
      for (const [k, z] of [[0, h * 0.2], [1, h * 0.55]] as const)
        L.add(H.solid(`${j.id}-ring${k}`, { name: k ? "" : `Piston ring Ø${bore}, cast iron`, qty: k ? 0 : 2, kind: "wearStrip", role: "hw", mat: "Cast iron, spring tempered", outer: circle(bore / 2 - 0.05, 0, 0, 48), holes: [circle(bore / 2 - 2.5, 0, 0, 40).reverse()], z0: z, z1: z + 1.5, body: piston }));
      ctx.add(L.out());
      ctx.note({ id: j.id, kit: "piston-bore", at: j.at, title: `piston-bore · ${titleOf(j.id)}`, note: `${titleOf(j.id)}: the piston slides in the cylinder's bore on two cast-iron rings, the replaceable wear parts; the rod runs out through the gland at the open end.`, serves: {} });
      (ctx.fired["piston-bore"] ??= []).push(j.id);
    }
  },
};

/**
 * A plunger (a `shaft` shape marked `plunger`, a swash plate's piston) in a bore of a fixed block: a bronze liner pressed
 * into the block's bore, the plunger running in it. True when the joint is one.
 */
function plungerBore(ctx: BuildCtx, j: JointInfo): boolean {
  const shape = (id: string) => ctx.kin.bodies.find((q) => q.id === id)?.shape as Record<string, unknown> | undefined;
  const plunger = [j.a, j.b].find((b) => shape(b)?.plunger);
  if (!plunger) return false;
  const block = plunger === j.a ? j.b : j.a;
  const bp = ctx.parts.get(block);
  const d = num(shape(plunger)!.diameter, 12);
  if (!bp || bp.op.op !== "extrude") return true;
  // the liner runs the block's length, on the bore's axis
  const uv = planeCoords(bp.frame, j.at as Vec3).uv;
  const L = new Local({ o: fromPlane(bp.frame, uv, 0), x: bp.frame.x, z: bp.frame.z }, { joints: [j.id] });
  L.add(H.bushing(`${j.id}-liner`, d, d + 4, { body: block, z0: 0, z1: bp.op.h, name: `Bore liner ${d}x${d + 4}x${bp.op.h}, bronze`, mat: "Bronze CuSn8, honed" }));
  ctx.add(L.out());
  ctx.note({ id: j.id, kit: "piston-bore", at: j.at, title: `piston-bore · ${titleOf(j.id)}`, note: `${titleOf(j.id)}: the Ø${d} plunger slides in a bronze liner pressed into the ${titleOf(block).toLowerCase()}'s bore, the replaceable wear part.`, serves: { F2: [`${j.id}-liner`] } });
  (ctx.fired["piston-bore"] ??= []).push(j.id);
  return true;
}

void v3;
