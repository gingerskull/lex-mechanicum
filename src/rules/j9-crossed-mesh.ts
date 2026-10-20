// J9: a crossed-axis mesh the model declares (MechanismModel.meshes): bevel, hypoid, worm or crossed helical gears on
// two axes. Each gear is located on its shaft and set to its mounting distance by a shim pack at its back face, the
// adjustment of the mesh's backlash (F7); a bronze thrust washer takes the mesh's push along each shaft (F4): toward the
// back face of a bevel or hypoid gear (away from the apex), both ways on a worm and on crossed helical gears, which
// reverse with the drive. Timing marks at the mesh (F9).
import { disc, thrustWasher } from "../hardware/primitives";
import { solid } from "../hardware/solid";
import { heights } from "../parts";
import { inPlane, type CrossMeshJoint, type PinJoint, type Rule, type RuleContext } from "./types";

/** Shim pack and thrust washer thickness, mm. */
const SHIM = 0.5;
const TW = 1.5;

const shaftOf = (ctx: RuleContext, part: string): PinJoint | undefined =>
  ctx.info.find((j): j is PinJoint => j.kind === "pin" && (j.type === "J2" || j.type === "J10") && j.driven.some((x) => x.part.id === part));

function member(ctx: RuleContext, m: CrossMeshJoint, gid: string, both: boolean): string[] {
  const J = ctx.joint(m.id)!;
  const g = ctx.parts[gid]!;
  const host = ctx.solidOf[gid]!;
  const pj = shaftOf(ctx, gid);
  if (!pj) return [`no driving shaft for the ${gid}`];
  const x = pj.driven.find((y) => y.part.id === gid)!;
  const d = pj.d;
  const [z0, z1] = heights(g);
  // the back face: the wide end of a tapered gear (its outer cone), else the end away from the other gear's axis
  const back = (host.taper ?? 1) <= 1 ? z0 : z1;
  const dir = back === z0 ? -1 : 1;
  const out: string[] = [];
  inPlane(ctx, g, () => {
    const at: [number, number, number] = [x.L[0], x.L[1], 0];
    const sh = solid(`${m.id}-${gid}-shim`, {
      name: `Shim pack Ø${d + 0.2} x Ø${d + 8}, ${SHIM} mm, sets the ${gid}'s mounting distance`,
      kind: "shim",
      role: "hw",
      body: gid,
      at,
      outer: disc((d + 8) / 2),
      holes: [disc(d / 2 + 0.1)],
      z0: dir < 0 ? back - SHIM : back,
      z1: dir < 0 ? back : back + SHIM,
      ex: host.ex,
      joints: [m.id],
      mat: "Steel shim stock, peelable",
      why: "set at assembly so the pitch cones meet at their apex: the backlash and the contact pattern (F7)",
    });
    ctx.add(sh);
    (J.serves.F7 ??= []).push(sh.id);
    const ends = both ? [-1, 1] : [dir];
    for (const e of ends) {
      const face = e === dir ? (dir < 0 ? back - SHIM : back + SHIM) : e < 0 ? z0 : z1;
      const tw = thrustWasher(`${m.id}-${gid}-tw${e < 0 ? 0 : 1}`, d + 0.2, d + 10, {
        body: pj.body === gid ? gid : pj.body,
        at: pj.body === gid ? at : pj.at,
        z0: e < 0 ? face - TW : face,
        z1: e < 0 ? face : face + TW,
        ex: host.ex,
        joints: [m.id, pj.id],
        why: `takes the mesh's push along the ${gid}'s shaft (F4)`,
      });
      ctx.add(tw);
      (J.serves.F4 ??= []).push(tw.id);
      // a spacer of the shaft's own stack (J2 under the first part) that ran up to the back face stops at the washer
      for (const t of ctx.solids)
        if (t.kind === "spacer" && t.joints.includes(pj.id) && !t.joints.includes(m.id) && t.z1 > tw.z0 + 0.01 && t.z0 < tw.z0 - 0.3 && t.z1 <= Math.max(face, back) + 0.01) t.z1 = tw.z0;
    }
    // a timing mark on the gear's face at tooth 0 (F9)
    const r = Math.max(...host.outer.map(([a, b]) => Math.hypot(a, b)));
    host.marks.push({ kind: "timing", pts: [[x.L[0] + 0.6 * r, x.L[1]], [x.L[0] + 0.82 * r, x.L[1]]] });
    (J.serves.F9 ??= []).push(gid);
  });
  return out;
}

export const j9: Rule = {
  id: "j9-crossed-mesh",
  tier: "AUTO",
  ids: ["J9", "F4", "F7", "F9"],
  applies: (ctx) => ctx.info.some((j) => j.type === "J9"),
  apply(ctx) {
    for (const m of ctx.info) {
      if (m.kind !== "crossMesh") continue;
      const J = ctx.joint(m.id)!;
      // a bevel or hypoid gear is pushed away from the apex only; a worm and crossed helical gears both ways
      const both = m.form === "worm" || m.form === "crossed";
      const missing = [...member(ctx, m, m.a.id, both), ...member(ctx, m, m.b.id, m.form === "crossed")];
      const name = { bevel: "Bevel", hypoid: "Hypoid", worm: "Worm", crossed: "Crossed helical" }[m.form];
      J.note = `${name} mesh of ${m.a.id} and ${m.b.id}: each gear set to its mounting distance by a shim pack at its back face (backlash, F7), a bronze thrust washer where the mesh pushes along its shaft${both ? " (both ways on the worm)" : ""} (F4), timing marks at tooth 0 (F9)${missing.length ? `; ${missing.join(", ")}` : ""}.`;
      J.badge = ["mounting distance set by shims", missing.length ? "warn" : "ok"];
    }
  },
};
