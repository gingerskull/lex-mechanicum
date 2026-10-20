// A9 for live gear and wheel shafts: straddle mounting. A live shaft that carries a gear in a mesh, or a pulley or
// sprocket of a flexible member (J12), with nothing sweeping over its top, runs on up into a bridge on spigoted posts: a
// floating flanged bearing per shaft, an internal circlip under it, the housing pair below still locating. Shafts of
// meshing gears share one bridge; shafts joined by a belt or chain have one each, since one bridge over both would span
// the loop. Where the mesh asked for
// backlash (J6, F7), the top bearing sits in an eccentric bushing turned with the one under the housing, so the shaft
// stays upright when the backlash is set. A flush end screw on the top part gives way to a circlip, the shaft passing.
import { circle } from "../core/geom";
import { bearing, circlip, eccentric, headHeight, screw, shaft } from "../hardware/primitives";
import { solid } from "../hardware/solid";
import { bridge } from "../hardware/sub/bridge";
import { housingBearing } from "../hardware/sub/housing";
import { FLANGE, circlipExt, circlipInt } from "../hardware/tables";
import { circleClearance } from "../core/poly";
import { wheelsOf } from "../model/flex";
import type { PinJoint, Rule, RuleContext } from "./types";

/** Eccentricity of the top bushing: the same as the one under the housing. */
const ECC = 0.3;

/** What a straddled shaft carries and what pulls it sideways, for its note: a gear (no member), a pulley or a sprocket. */
type Carried = { what: string; by?: string };

/** Live shafts that carry a gear in a mesh, by mesh; then each live shaft that carries a wheel of a chain, belt or CVT. */
function meshShafts(ctx: RuleContext): { group: PinJoint[]; carried: Carried }[] {
  const live = ctx.info.filter((j): j is PinJoint => j.kind === "pin" && j.type === "J2");
  const groups: PinJoint[][] = [];
  for (const m of ctx.info) {
    // a gear in a parallel mesh, or in a crossed one (J9): its shaft is straddled whatever the other gear's axis
    if (!((m.kind === "mesh" && m.form !== "rack") || m.kind === "crossMesh")) continue;
    const g = [m.a, m.b].map((p) => live.find((j) => j.driven.some((x) => x.part.id === p.id))).filter((j): j is PinJoint => !!j);
    if (!g.length) continue;
    const hit = groups.find((h) => h.some((j) => g.includes(j)));
    if (!hit) groups.push(g);
    else for (const j of g) if (!hit.includes(j)) hit.push(j);
  }
  const out: { group: PinJoint[]; carried: Carried }[] = groups.map((group) => ({ group, carried: { what: "gear" } }));
  for (const f of ctx.info) {
    if (f.kind !== "flex" || f.spec.form === "rope") continue;
    // a CVT's shafts carry their fixed sheave halves (the sliding halves ride them)
    const carried = f.spec.form === "chain" ? { what: "sprocket", by: "chain" } : f.spec.form === "cvt" ? { what: "sheave", by: "belt" } : { what: "pulley", by: "belt" };
    for (const id of wheelsOf(f.spec)) {
      const j = live.find((x) => x.driven.some((d) => d.part.id === id));
      if (j && !out.some((o) => o.group.includes(j))) out.push({ group: [j], carried });
    }
  }
  return out;
}

/** Nothing moving passes over the shaft's top: no sweep above the top driven part covers its axis. */
function clearAbove(ctx: RuleContext, j: PinJoint): boolean {
  const top = Math.max(...j.driven.map((x) => x.z1));
  for (const sw of ctx.sweeps()) {
    if (sw.z1 <= top + 0.05 || j.driven.some((x) => x.part.id === sw.part.id)) continue;
    if (sw.regions.some((g) => circleClearance(j.P, j.d / 2 + 1, g) < 0)) return false;
  }
  return true;
}

export function straddle(ctx: RuleContext, group: PinJoint[], carried: Carried = { what: "gear" }): void {
  const stackTop = (j: PinJoint) => Math.max(...ctx.solids.filter((t) => t.joints.includes(j.id) && t.z0 >= ctx.b1 && t.kind !== "bridge").map((t) => t.z1));
  // the flush end screw on a top part gives way to a circlip: the shaft runs on through it
  for (const j of group) {
    const end = ctx.get(`${j.id}-end`);
    if (!end) continue;
    ctx.drop(new RegExp(`^${j.id}-end(-|$)`));
    // over a flanged pulley's top flange, the circlip sits on the flange
    const fl = ctx.solids.filter((t) => t.kind === "pulley" && t.group === end.body && t.z0 >= end.z1 - 1e-6);
    const zt = fl.length ? Math.max(end.z1 + 0.5, ...fl.map((t) => t.z1)) : end.z1 + 0.5;
    const c = circlipExt(j.d);
    ctx.add(circlip(`${j.id}-cl-top`, j.d, { body: j.body, at: j.at, z0: zt, z1: zt + c.s, ex: end.ex, joints: [j.id], group: `${j.id}-shaft` }));
    const F2 = ctx.joint(j.id)!.serves.F2 ?? [];
    ctx.joint(j.id)!.serves.F2 = [...F2.filter((id) => id !== `${j.id}-end`), `${j.id}-cl-top`];
  }
  const zMin = Math.max(...group.map(stackTop)) + 0.5;
  const outR = group.map((j) => housingBearing(j.d).D / 2 + 9.5);
  const id = `${group.map((j) => j.id).join("-")}-bridge`;
  const br = bridge(ctx, { id, over: group.map((j) => j.P), zMin, joint: group[0]!.id, rBoss: Math.max(...outR) });
  if (!br) {
    for (const j of group) ctx.joint(j.id)!.note += " No room for a bridge over the shaft top: single shear.";
    return;
  }
  for (const j of group.slice(1)) br.bridge.joints.push(j.id);
  br.bridge.name = `Bridge over the ${group.length > 1 ? "shafts" : "shaft"}, on two spigoted posts`;
  br.bridge.why = `carries the top of each live shaft in a floating bearing, so the ${carried.what}s are not overhung (A9)`;
  const Zb = br.z1;
  for (const j of group) {
    const J = ctx.joint(j.id)!;
    const b = housingBearing(j.d);
    const at: [number, number, number] = [j.P[0], j.P[1], 0];
    const G = { at, joints: [j.id], ex: br.bridge.ex };
    let seat = Zb;
    if (j.eccentric) {
      // the bushing's offset bore sits on the shaft axis: the bushing itself is drawn ECC off it
      const Db = b.D + 6;
      const bAt: [number, number, number] = [j.P[0] - ECC, j.P[1], 0];
      const eid = `${j.id}-top-ecc`;
      br.bridge.holes.push(circle(Db / 2 + 0.1, bAt[0], bAt[1], Math.max(28, Math.round((Db / 2) * 3))));
      ctx.add(solid(eid, { kind: "eccentric", name: "", mat: "Bronze CuSn8", outer: circle(Db / 2, 0, 0, Math.max(28, Math.round((Db / 2) * 3))), holes: [circle(b.D / 2 + 0.05, ECC, 0, 40)], at: bAt, z0: br.z0, z1: Zb, ex: br.bridge.ex, joints: [j.id], group: eid }));
      const fl = eccentric(`${eid}-fl`, b.D, Db, ECC, { at: bAt, z0: Zb, z1: Zb + 2.5, ex: br.bridge.ex, joints: [j.id], group: eid, slots: [Math.PI / 2, -Math.PI / 2] });
      fl.name = `Eccentric bushing Ø${Db}, ${ECC} mm offset bore Ø${b.D}, flanged, top of the shaft`;
      ctx.add(fl);
      const slotR = (Db + 10) / 2 - 2.6;
      for (const [i, a] of [Math.PI / 2, -Math.PI / 2].entries())
        ctx.add(screw(`${eid}-sc${i}`, "button", 3, 8, { at: [bAt[0] + slotR * Math.cos(a), bAt[1] + slotR * Math.sin(a), 0], face: Zb + 2.5, dir: -1, ex: br.bridge.ex, joints: [j.id], name: i ? "" : undefined, qty: i ? 0 : 2 }));
      seat = Zb + 2.5;
      (J.serves.F7 ??= []).push(`${eid}-fl`);
      for (const m of ctx.info) if (m.kind === "mesh" && j.driven.some((x) => x.part.id === m.a.id || x.part.id === m.b.id)) (ctx.joint(m.id)!.serves.F7 ??= []).push(`${eid}-fl`);
    } else br.bridge.holes.push(circle(b.D / 2 + 0.15, j.P[0], j.P[1], 40));
    // a flanged bearing floating on the shaft: the housing pair below locates it
    const F = FLANGE(b);
    const zb0 = seat - b.B;
    ctx.add(bearing(`${j.id}-top-brg`, b, { ...G, z0: zb0, z1: seat, flange: "top", name: `Bearing F${b.name}ZZ (${b.d}x${b.D}x${b.B}), floating`, seat: "flange on top, circlip below" }));
    const cl = circlipInt(b.D);
    ctx.add(circlip(`${j.id}-top-cl`, b.D, { internal: true, ...G, z0: zb0 - cl.s, z1: zb0 }));
    (J.serves.F2 ??= []).push(`${j.id}-top-brg`, `${j.id}-top-cl`);
    // the shaft runs on up through its bearing
    const segs = ctx.solids.filter((t) => t.group === `${j.id}-shaft` && t.kind === "shaft");
    const top = segs.reduce((p, q) => (q.z1 > p.z1 ? q : p));
    top.marks = top.marks.filter((mk) => mk.kind !== "chamfer" && mk.kind !== "boreEntry");
    ctx.add(shaft(`${j.id}-shaft-up`, { d: j.d, z0: top.z1, z1: seat }, { body: j.body, at: top.at, ex: top.ex, joints: [j.id], group: `${j.id}-shaft`, name: "" }));
    // above the bearing flange and any bushing screw heads the shaft end is free, for a coupling (H.outputCoupling)
    j.top = { seat, free: seat + Math.max(F.w, j.eccentric ? headHeight("button", 3) : 0) + 0.6, bearing: b };
    J.note += ` Straddle mounted: the shaft runs on up into a floating ${b.name} bearing in the bridge${j.eccentric ? ", in an eccentric bushing turned with the one under the housing so the shaft stays upright when the backlash is set" : ""}, so the ${carried.by ? `${carried.what}, pulled sideways by the ${carried.by},` : carried.what} is carried on both sides.`;
    J.badge = ["straddle mounted", "ok"];
  }
  for (const m of ctx.info)
    if (m.kind === "mesh" && group.some((j) => j.eccentric && j.driven.some((x) => x.part.id === m.a.id || x.part.id === m.b.id)))
      ctx.joint(m.id)!.note += " The backlash eccentrics sit at both ends of the shaft, bottom and top, set together.";
}

export const j2Straddle: Rule = {
  id: "j2-straddle",
  tier: "AUTO",
  ids: ["A9", "J2"],
  applies: (ctx) => ctx.info.some((j) => j.kind === "mesh" || j.kind === "crossMesh" || (j.kind === "flex" && j.spec.form !== "rope")),
  apply(ctx) {
    for (const { group, carried } of meshShafts(ctx)) {
      const clear = group.filter((j) => clearAbove(ctx, j));
      if (clear.length) straddle(ctx, clear, carried);
    }
  },
};
