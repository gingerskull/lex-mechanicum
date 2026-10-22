// Friction contacts (J6 recorded, a rolling pair given by its ratio): a wheel's tyre on a disc's face, a ball between a
// disc and a roller. There is no tooth to time, so no timing marks and no backlash eccentric; what the contact needs is a
// tread that grips and a preload. A tyred wheel gets its rubber tyre on a hub (M10: the contact surface is the tyre); a
// wheel set along its shaft by a control (shape.slide, the ratio setting) is clamped where it is set by its hub's set
// screws (F7), and a scale engraved on the base under its shaft reads the setting.
import { circle } from "../core/geom";
import { H } from "../hardware/primitives";
import type { KinJoint } from "../kin/types";
import { v3 } from "../kin/math";
import type { BuildCtx } from "./ctx";
import { titleOf } from "./lib";
import type { Rule } from "./rules/types";

const num = (v: unknown, d: number): number => (typeof v === "number" && Number.isFinite(v) ? v : d);

/** A friction pair: a rolling joint whose ratio is given (no teeth). */
export const isFriction = (j: KinJoint): boolean => j.type === "rolling" && j.ratio !== undefined;

function tyre(ctx: BuildCtx, body: string, joint: string): string | null {
  const g = ctx.geoms.get(body);
  const part = ctx.parts.get(body);
  const t = g?.shape.tyre as { thickness?: unknown; material?: unknown } | undefined;
  if (!g || !part || !t || part.op.op !== "extrude") return null;
  const R = num(g.shape.radius, 30);
  const th = num(t.thickness, 4);
  // the hub stops under the tyre; the tyre a ring of rubber over it, the same width
  part.profile.outer = circle(R - th, 0, 0, Math.max(48, Math.round(R * 3)));
  part.name = `${titleOf(body)}, hub under its tyre`;
  const h = part.op.h;
  ctx.add({ ...part, id: `${body}-tyre`, name: `Tyre, ${String(t.material ?? "rubber")} ${th} mm, vulcanised to the hub: the contact's grip`, kind: "part", profile: { outer: circle(R, 0, 0, Math.max(48, Math.round(R * 3))), holes: [circle(R - th, 0, 0, Math.max(48, Math.round(R * 3))).reverse()] }, op: { op: "extrude", h, steps: 1 }, marks: [], joints: [joint], mat: "Nitrile rubber, 80 Shore A" });
  return `${body}-tyre`;
}

export const friction: Rule = {
  id: "friction-contact",
  tier: "AUTO",
  ids: ["J6", "F6", "F7", "M10"],
  fixture: "friction-wheel-drive",
  applies: (ctx) => ctx.kin.joints.some(isFriction),
  apply(ctx) {
    for (const j of ctx.kin.joints.filter(isFriction)) {
      const tyres = [j.a, j.b].map((b) => tyre(ctx, b, j.id)).filter((x): x is string => !!x);
      // a wheel set along its shaft: a scale on the base under its shaft, a tick every 10 mm of its range
      const set: string[] = [];
      for (const b of [j.a, j.b]) {
        const g = ctx.geoms.get(b);
        const sl = g?.shape.slide as { param?: string; along?: number[] } | undefined;
        const par = sl?.param ? ctx.kin.params?.find((q) => q.id === sl.param) : undefined;
        if (!g || !par || par.min === undefined || par.max === undefined) continue;
        const along = v3.unit((sl!.along as [number, number, number] | undefined) ?? [1, 0, 0]);
        const at = ctx.S.joints.get(j.id)!.at;
        // the contact's place at the setting's zero: the scale reads the setting itself
        const zero = v3.sub(at, v3.mul(along, par.value));
        const side = v3.cross([0, 0, 1], along);
        const y = 14;
        for (let v = Math.ceil(par.min / 10) * 10; v <= par.max + 1e-6; v += 10) {
          const p = v3.add(zero, v3.mul(along, v));
          const long = v % 30 === 0 ? 7 : 4;
          const a = v3.add(p, v3.mul(side, y));
          const b2 = v3.add(p, v3.mul(side, y + long));
          ctx.baseMarks.push({ kind: "scale", pts: [[a[0], a[1]], [b2[0], b2[1]]] });
        }
        set.push(b);
      }
      ctx.note({
        id: j.id,
        kit: "J6",
        at: ctx.S.joints.get(j.id)!.at,
        title: `J6 · ${titleOf(j.id)}`,
        note: `${titleOf(j.id)}: a friction contact, no teeth: ${tyres.length ? "a rubber tyre on its hub gives the grip (M10), pressed onto the face by the height of its shaft's blocks, its rubber taking the preload (F6)" : "hardened rolling surfaces, preloaded by their supports (F6)"}; nothing to time.${set.length ? ` The ${set.map(titleOf).join(" and ").toLowerCase()} is set along its shaft by the ratio control and clamped there by its hub's set screws (F7); a scale engraved on the base under the shaft reads the setting.` : ""}`,
        badge: ["friction, preloaded", "ok"],
        serves: { F6: tyres, F7: [] },
      });
    }
  },
};

void H;
