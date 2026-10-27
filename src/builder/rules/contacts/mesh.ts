// Gear mesh (J6) and crossed mesh (J9): timing marks at the pitch point, the backlash set by an eccentric housing or a
// slid hub, a shim pack behind each gear of a crossed pair; a held rack seated, slotted and dowelled on the base.
import { roundRect, type Vec2 } from "../../../core/geom";
import { H } from "../../../hardware/primitives";
import { planeCoords } from "../../frames";
import type { BuildCtx } from "../../ctx";
import { Local, titleOf } from "../../lib";
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

/** A rack that stands still (`fixed: true`, a stroke doubler's fixed rack): the body of the mesh it is, else none. */
function heldRack(ctx: BuildCtx, a: string, b: string): string | undefined {
  return [a, b].find((x) => {
    const k = ctx.kin.bodies.find((q) => q.id === x);
    return !!k?.fixed && String(k.shape?.type) === "rack";
  });
}

/**
 * A held rack seated on the base (Gears playbook: screwed and dowelled to the base): a ground steel riser under its back,
 * the teeth's side left open for what runs under them; socket screws down through slots across the rack, the riser and
 * into the base, so the rack is set to its pinion (F7) before two dowels pin it (F1). Built once, at its first mesh.
 */
function seatRack(ctx: BuildCtx, rack: string, at: readonly number[]): { F1: string[]; F7: string[]; note: string } | null {
  const part = ctx.parts.get(rack);
  const shape = ctx.kin.bodies.find((q) => q.id === rack)?.shape as Record<string, unknown> | undefined;
  if (!part || !shape || part.op.op !== "extrude" || !ctx.base || ctx.get(`${rack}-riser`)) return null;
  const m = Number(shape.module ?? 3);
  const h = Number(shape.height ?? 20);
  const len = Number(shape.length ?? 120);
  const back: [number, number] = [-h, -1.25 * m - 1];
  const yc = (back[0] + back[1]) / 2;
  const bottom = ctx.base.top - part.frame.o[2];
  const top = part.op.h;
  if (bottom > -0.5) return null;
  const M = 4;
  // the slots need a wall of 1 mm each side in the back, the dowels 30 mm in from each end 12 mm between them
  const slotH = M + 2.5;
  if (back[1] - back[0] < slotH + 2) throw new Error(`${rack}: a held rack ${h} mm high (module ${m}) has ${(back[1] - back[0]).toFixed(2)} mm of back under its teeth, too little for its setting slots (${slotH + 2} mm)`);
  if (len < 72) throw new Error(`${rack}: a held rack ${len} mm long is too short for its two dowels 30 mm in from each end (72 mm at least)`);
  const L = new Local(part.frame, { joints: [] });
  const x0 = -len / 2;
  const x1 = len / 2;
  L.add(H.plate(`${rack}-riser`, roundRect(x0 + 2, back[0], x1 - 2, back[1], 1), { body: "ground", kind: "plate", role: "ground", name: "Ground steel riser under the rack's back", z0: bottom, z1: 0, mat: "Steel C45, ground" }));
  // screws at most 100 mm apart, near each end; slots across the rack for the setting, 1 mm each way
  const n = Math.max(2, Math.ceil((len - 24) / 100) + 1);
  const xs = Array.from({ length: n }, (_, k) => x0 + 12 + ((len - 24) * k) / (n - 1));
  const slot = (x: number) => roundRect(x - M / 2 - 0.25, yc - M / 2 - 1.25, x + M / 2 + 0.25, yc + M / 2 + 1.25, M / 2 + 0.25).reverse();
  part.profile.holes = [...part.profile.holes, ...xs.map(slot)];
  // the match mark at the pitch point, across the root line under the pinion's tooth at the reference (F9)
  const xm = planeCoords(part.frame, [at[0]!, at[1]!, at[2]!]).uv[0];
  part.marks.push({ kind: "timing", pts: [[xm, -1.25 * m - 0.4], [xm, -1.25 * m - 2.9]] });
  xs.forEach((x, k) => L.add(H.screw(`${rack}-sc${k}`, "socket", M, top - bottom + 6, { body: "ground", at: [x, yc, 0], face: top, dir: -1, ...(k ? { name: "", qty: 0 } : { qty: n }) })));
  // two dowels between the screws, diagonal across the back, through rack and riser into the base
  const dws = [0, 1].map((k) => {
    const x = k ? x1 - 30 : x0 + 30;
    const y = yc + (k ? 2 : -2);
    L.add(H.dowel(`${rack}-dw${k}`, 4, { body: "ground", at: [x, y, 0], z0: bottom - 4, z1: top, ...(k ? { name: "", qty: 0 } : { name: "Dowel pin Ø4 h6, rack and riser to base, fitted once the rack is set", qty: 2 }) }));
    return `${rack}-dw${k}`;
  });
  ctx.add(L.out());
  return { F1: dws, F7: [`${rack}-sc0`], note: `${titleOf(rack)} on a ground riser under its back, ${n} socket screws M${M} down through slots across it into the base to set it to the pinion, then two Ø4 dowels` };
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
    // a held rack is seated on the base and set to its pinion on its own slots
    const held = heldRack(ctx, c.a, c.b);
    if (held) {
      const seat = seatRack(ctx, held, c.at);
      if (seat) marked.push(held);
      const serves: Record<string, string[]> = { F9: marked, F7: seat?.F7 ?? [], F1: seat?.F1 ?? [] };
      return { serves, note: `${titleOf(c.id)}: parallel mesh with a held rack; timing marks on ${marked.join(" and ") || "the gears"}; ${seat ? seat.note : `${titleOf(held)} seated at its first mesh`}.` };
    }
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
