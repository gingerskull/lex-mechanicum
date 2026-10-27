// Gear mesh (J6) and crossed mesh (J9): timing marks at the pitch point, the backlash set by an eccentric housing or a
// slid hub, a shim pack behind each gear of a crossed pair.
import type { Vec2 } from "../../../core/geom";
import { planeCoords } from "../../frames";
import type { BuildCtx } from "../../ctx";
import { titleOf } from "../../lib";
import type { Rule } from "../types";
import { contactRule } from "./kit";

/** A timing mark on a part's top face at the pitch point (F9). */
function timingMark(ctx: BuildCtx, body: string, at: readonly number[]): boolean {
  const part = ctx.parts.get(body);
  if (!part) return false;
  const p = planeCoords(part.frame, [at[0]!, at[1]!, at[2]!]).uv;
  const r = Math.hypot(p[0], p[1]);
  if (r < 2) return false;
  const u: Vec2 = [p[0] / r, p[1] / r];
  part.marks.push({ kind: "timing", pts: [[u[0] * (r - 2.5), u[1] * (r - 2.5)], [u[0] * (r - 0.4), u[1] * (r - 0.4)]] });
  return true;
}

function siteOf(ctx: BuildCtx, body: string) {
  return ctx.sites.find((s) => s.fixed && s.bodies.includes(body));
}

const j6 = contactRule({
  id: "j6-mesh",
  ids: ["J6", "F7", "F9"],
  fixture: "kin:gearPair",
  kits: ["J6"],
  // a friction pair (a rolling joint given by its ratio) is built by src/builder/friction.ts
  skip: (ji) => ji.joint.type === "rolling" && ji.joint.ratio !== undefined,
  build(ctx, c) {
    const marked = [c.a, c.b].filter((b) => timingMark(ctx, b, c.at));
    // a gear on a fixed hub sets the backlash by its hub, slid on slotted holes in the base; else the backlash eccentric
    // goes under the housing of the second gear's live shaft (F7)
    const hubbed = ctx.joints.find((q) => q.kit === "hub" && [q.a, q.b].some((x) => x === c.a || x === c.b));
    const s = hubbed ? undefined : (siteOf(ctx, c.b) ?? siteOf(ctx, c.a));
    if (s && s.live) ctx.eccentric.add(s.id);
    const F7 = hubbed ? [`${hubbed.id}-hub`] : s ? [`${s.id}-ecc`] : [];
    const how = hubbed ? `; the hub at ${hubbed.id} slides on slotted holes to set the backlash` : s ? `; eccentric housing on ${s.id} sets the backlash` : "";
    return { serves: { F9: marked, F7 }, note: `${titleOf(c.id)}: parallel mesh; timing marks on ${marked.join(" and ") || "the gears"}${how}.` };
  },
});

/** Gears of a crossed mesh get a shim pack at the back face and a thrust washer (F7, F4, F9). */
const j9 = contactRule({
  id: "j9-crossed-mesh",
  ids: ["J9", "F4", "F7", "F9"],
  fixture: "kin:crossedMesh",
  kits: ["J9"],
  build(ctx, c) {
    const marked = [c.a, c.b].filter((b) => timingMark(ctx, b, c.at));
    for (const b of [c.a, c.b]) {
      const s = siteOf(ctx, b);
      if (s) ctx.shim.set(b, 1);
    }
    return { serves: { F9: marked, F7: [c.a, c.b].map((b) => `${b}-shim`), F4: [c.a, c.b].map((b) => `${b}-tw`) }, note: `${titleOf(c.id)}: crossed-axis mesh; a 1 mm shim pack behind each gear sets the mounting distance (backlash, contact pattern), timing marks at the mesh.` };
  },
});

export const MESH_KITS: Rule[] = [j6, j9];
