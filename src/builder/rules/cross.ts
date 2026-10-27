// The cross-pin kit (J3 for a universal joint's cross, couplings playbook): each yoke's pin into the cross turns in two
// needle cups pressed into the yoke's arms, each held by an internal circlip in the arm's bore (F2); the cross carries a
// grease nipple on its centre block (F8). The cross's trunnions and the yokes' arms are the bodies' own parts
// (src/builder/shapes/spatial.ts); this rule adds what sits between them.
import { circle } from "../../core/geom";
import { H } from "../../hardware/primitives";
import { circlipInt } from "../../hardware/tables";
import { type Vec3, v3 } from "../../kin/math";
import type { BuildCtx } from "../ctx";
import { frameAlong } from "../frames";
import { Local, titleOf } from "../lib";
import type { Rule } from "./types";

const num = (v: unknown, d: number): number => (typeof v === "number" && Number.isFinite(v) ? v : d);

export const crossBearings: Rule = {
  id: "cross-bearings",
  tier: "AUTO",
  ids: ["J3", "F2", "F8"],
  fixture: "universal-joint",
  applies: (ctx) => ctx.joints.some((j) => j.kit === "cross-pin"),
  apply(ctx: BuildCtx) {
    let nipple = false;
    for (const j of ctx.joints.filter((q) => q.kit === "cross-pin")) {
      const crossId = [j.a, j.b].find((b) => String(ctx.kin.bodies.find((q) => q.id === b)?.shape?.type) === "cross")!;
      const yokeId = crossId === j.a ? j.b : j.a;
      const yoke = ctx.kin.bodies.find((q) => q.id === yokeId)?.shape as Record<string, unknown> | undefined;
      const cross = ctx.kin.bodies.find((q) => q.id === crossId)?.shape as Record<string, unknown> | undefined;
      const yk = (yoke?.yoke ?? {}) as Record<string, unknown>;
      const R = num(yk.radius, 30);
      const a = num(yk.arm, 8);
      const cupD = num(yoke?.cup, 14);
      const d = num(cross?.diameter, 10);
      const c = circlipInt(cupD);
      const p = v3.unit(j.r.axis);
      const ids: string[] = [];
      ([1, -1] as const).forEach((k, n) => {
        const f = frameAlong(j.at as Vec3, v3.mul(p, k));
        const L = new Local(f, { joints: [j.id] });
        const id = `${j.id}-cup${n}`;
        // the drawn cup: a sleeve on the trunnion through the arm, closed by its bottom; the circlip outside it
        L.add(H.solid(id, { name: n ? "" : `Needle bearing cup Ø${cupD} on a Ø${d} trunnion, drawn and closed`, qty: n ? 0 : 4, kind: "bearing", role: "bearing", outer: circle(cupD / 2, 0, 0, 32), holes: [circle(d / 2 + 0.05, 0, 0, 24)], z0: R - a / 2, z1: R + a / 2 - c.s - 1, body: yokeId, mat: "Bearing steel 100Cr6, needles in a drawn cup", why: "the cross's trunnion turns in it" }));
        L.add(H.solid(`${id}-end`, { name: "", kind: "bearing", role: "bearing", outer: circle(cupD / 2, 0, 0, 32), holes: [], z0: R + a / 2 - c.s - 1, z1: R + a / 2 - c.s, body: yokeId, group: id }));
        L.add(H.circlip(`${j.id}-cl${n}`, cupD, { internal: true, body: yokeId, z0: R + a / 2 - c.s, z1: R + a / 2, ...(n ? { name: "", qty: 0 } : { qty: 4 }) }));
        ctx.add(L.out());
        ids.push(id, `${j.id}-cl${n}`);
      });
      if (!nipple) {
        // the grease nipple on the centre block, along the third arm direction (F8)
        const other = ctx.joints.find((q) => q.kit === "cross-pin" && q.id !== j.id);
        const n3 = other ? v3.unit(v3.cross(p, v3.unit(other.r.axis))) : ([0, 0, 1] as Vec3);
        const block = d / 2 + 3;
        const L = new Local(frameAlong(j.at as Vec3, n3), { joints: [j.id] });
        L.add(H.nipple(`${crossId}-nip`, { body: crossId, z0: block, z1: block + 9 }));
        ctx.add(L.out());
        nipple = true;
        ids.push(`${crossId}-nip`);
      }
      ctx.note({
        id: j.id,
        kit: "cross-pin",
        at: j.at,
        title: `cross-pin · ${titleOf(j.id)}`,
        note: `${titleOf(j.id)}: the ${yokeId}'s pin into the cross: two needle cups Ø${cupD} pressed into the arms, each held by an internal circlip; the trunnions run on the needles. Double support across the cross.`,
        badge: ["double shear", "ok"],
        serves: { F2: ids.filter((x) => x.includes("-cl")), F8: [`${crossId}-nip`].filter(() => true) },
      });
      (ctx.fired["cross-bearings"] ??= []).push(j.id);
    }
  },
};
