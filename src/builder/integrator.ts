// A ball-and-disc integrator: a ball held in a cage on a carriage rolls on a disc's face at the carriage's radius and
// drives a cylinder above it. The ball is a sphere standing where its cage puts it. The carriage is an arm over the
// disc's face, its cage round the ball's equator open below (onto the disc) and toward the cylinder; the arm runs out past
// the disc's rim to a block that straddles a rail on the base, with end stops past its travel (F5). Its drive pin (the
// driver's `pin`) is taken down through the base by the yoke drive (src/builder/compliant.ts).
import { TAU, roundRect, type Vec2 } from "../core/geom";
import { H } from "../hardware/primitives";
import { v3, type Vec3 } from "../kin/math";
import { housingBearing } from "../hardware/sub/housing";
import { pillowBlocks } from "./supports";
import type { Frame } from "./frames";
import { journalled } from "./sites";
import type { Kin, KinBody } from "../kin/types";
import type { BuildCtx } from "./ctx";
import { Local, titleOf } from "./lib";
import type { BodyGeom } from "./shapes";
import type { Rule } from "./rules/types";

const num = (v: unknown, d: number): number => (typeof v === "number" && Number.isFinite(v) ? v : d);

/** A ball: a custom revolved body whose profile is a circle (a sphere about its frame's origin). */
export function ballGeom(b: KinBody, g: BodyGeom): BodyGeom | null {
  const sh = (b.shape ?? {}) as Record<string, unknown>;
  const pr = sh.profile as { circle?: unknown } | undefined;
  if (sh.type !== "custom" || sh.op !== "revolve" || typeof pr?.circle !== "number") return null;
  const r = pr.circle;
  const n = 32;
  // the half section, x the radius: from the bottom pole round the equator to the top pole
  const half: Vec2[] = Array.from({ length: n + 1 }, (_, i): Vec2 => {
    const a = -Math.PI / 2 + (Math.PI * i) / n;
    return [Math.max(0, r * Math.cos(a)), r * Math.sin(a)];
  });
  return {
    ...g,
    profile: { outer: Array.from({ length: 48 }, (_, i): Vec2 => [r * Math.cos((TAU * i) / 48), r * Math.sin((TAU * i) / 48)]), holes: [] },
    thick: 2 * r,
    approx: false,
    exact: { offset: 0 },
    part: { profile: { outer: half, holes: [] }, op: { op: "revolve", segments: 48 } },
  };
}

/** The cage's sizes: the ball's radius, the ring round it, the arm. */
const cageOf = (sh: Record<string, unknown>) => {
  const c = (sh.cage ?? {}) as Record<string, unknown>;
  const rb = num(c.ball, 12) / 2;
  return { rb, r0: rb + 0.4, r1: rb + 4, h: 6, armW: 14 };
};

/** The arm and cage outline in the carriage's frame (x toward the cylinder, y along the travel): the ring round the
 * ball open over ±80° toward +x, the arm out along −x to `reach`. */
function cageOutline(r0: number, r1: number, reach: number, w: number): Vec2[] {
  const open = (80 * Math.PI) / 180;
  const aw = Math.asin(Math.min(0.99, w / 2 / r1));
  const out: Vec2[] = [];
  const arc = (r: number, a0: number, a1: number, n: number) => {
    for (let k = 0; k <= n; k++) {
      const a = a0 + ((a1 - a0) * k) / n;
      out.push([r * Math.cos(a), r * Math.sin(a)]);
    }
  };
  arc(r1, open, Math.PI - aw, 12);
  out.push([-reach, w / 2], [-reach, -w / 2]);
  arc(r1, Math.PI + aw, TAU - open, 12);
  arc(r0, TAU - open, open, 36);
  return out;
}

/** The carriage of an integrator: a `slider` with a `cage`, standing at its frame (exact). */
export function carriageGeom(kin: Kin, b: KinBody, g: BodyGeom): BodyGeom | null {
  const sh = (b.shape ?? {}) as Record<string, unknown>;
  if (sh.type !== "slider" || !sh.cage) return null;
  const c = cageOf(sh);
  const reach = num(sh.reach, 80);
  void kin;
  return { ...g, profile: { outer: cageOutline(c.r0, c.r1, reach, c.armW), holes: [] }, thick: c.h, approx: false, exact: { offset: -c.h / 2 } };
}

function buildCarriage(ctx: BuildCtx, b: KinBody): void {
  const g = ctx.geoms.get(b.id);
  const part = ctx.parts.get(b.id);
  const sj = ctx.kin.joints.find((j) => j.type === "prismatic" && (j.a === b.id || j.b === b.id));
  if (!g || !part || !sj || !ctx.base) return;
  const sh = (b.shape ?? {}) as Record<string, unknown>;
  const c = cageOf(sh);
  const reach = num(sh.reach, 80);
  const bt = ctx.base.top;
  const F = g.frame;
  const armBot = v3.dot(F.o, F.z) - c.h / 2;
  const axis = v3.unit(ctx.S.joints.get(sj.id)!.axis);
  const lim = (sj.limits as [number, number] | undefined) ?? [0, 0];
  const body = b.id;
  // the block at the arm's end over the rail: x across the rail, y along the travel, in the carriage's frame
  const L = new Local({ o: [F.o[0], F.o[1], 0], x: F.x, z: [0, 0, 1] }, { joints: [sj.id] });
  const rail = { h: 8, w: 12 };
  const bx = -reach + 8;
  const blockW = 30;
  const blockL = 24;
  L.add(H.solid(`${body}-block`, { name: "Carriage block, the arm screwed to it, over the rail", kind: "part", role: "driver", mat: "Steel C45", outer: roundRect(bx - blockW / 2, -blockL / 2, bx + blockW / 2, blockL / 2, 2), z0: bt + rail.h + 0.3, z1: armBot, body, group: body }));
  for (const [k, s] of [[0, -1], [1, 1]] as const) L.add(H.solid(`${body}-cheek${k}`, { name: "", kind: "part", role: "driver", mat: "Steel C45", outer: roundRect(s < 0 ? bx - blockW / 2 : bx + rail.w / 2 + 0.3, -blockL / 2, s < 0 ? bx - rail.w / 2 - 0.3 : bx + blockW / 2, blockL / 2, 1), z0: bt + 0.6, z1: bt + rail.h + 0.3, body, group: body }));
  for (const [k, y] of [[0, -6], [1, 6]] as const) L.add(H.screw(`${body}-as${k}`, "socket", 4, 8, { body, at: [bx, y, 0], face: armBot + c.h, dir: -1, ...(k ? { name: "", qty: 0 } : { qty: 2, name: "Socket screw M4, the arm to its block" }) }));
  // the rail, dowelled to the base, with an end stop and a pad past each end of the travel (F1, F5)
  const sgn = v3.dot(axis, [0, 1, 0]) >= 0 ? 1 : -1;
  const t0 = Math.min(lim[0], lim[1]);
  const t1 = Math.max(lim[0], lim[1]);
  const y0 = sgn * t0 - blockL / 2 - 10;
  const y1 = sgn * t1 + blockL / 2 + 10;
  const ya = Math.min(y0, -y1, y1, -y0);
  const yb = Math.max(y0, -y1, y1, -y0);
  L.add(H.plate(`${body}-rail`, roundRect(bx - rail.w / 2, ya, bx + rail.w / 2, yb, 1), { kind: "plate", role: "ground", name: "Carriage rail, ground, screwed and dowelled to the base", z0: bt, z1: bt + rail.h, mat: "Steel C45, ground" }));
  for (const [k, y] of [[0, ya + 5], [1, yb - 5]] as const) L.add(H.dowel(`${body}-rd${k}`, 3, { at: [bx, y, 0], z0: bt - 5, z1: bt + rail.h - 1, ...(k ? { name: "", qty: 0 } : { name: "Dowel pin Ø3 h6, rail to base", qty: 2 }) }));
  for (const [k, y, s] of [[0, ya, 1], [1, yb, -1]] as const) {
    L.add(H.stop(`${body}-stop${k}`, roundRect(bx - blockW / 2, Math.min(y, y + s * 6), bx + blockW / 2, Math.max(y, y + s * 6), 1), { z0: bt + rail.h, z1: bt + rail.h + 8, ...(k ? { name: "", qty: 0 } : { qty: 2 }) }));
    L.add(H.bumper(`${body}-pad${k}`, 3, 8, { at: [bx, y + s * 8, 0], z0: bt + rail.h + 2, z1: bt + rail.h + 6, ...(k ? { name: "", qty: 0 } : { qty: 2 }) }));
  }
  ctx.add(L.out());
  ctx.note({ id: sj.id, kit: "J5", at: ctx.S.joints.get(sj.id)!.at, title: `J5 · ${titleOf(sj.id)}`, note: `${titleOf(sj.id)}: the carriage's arm reaches over the disc's face to the cage round the ball (open below onto the disc and toward the cylinder); its block straddles a rail screwed and dowelled to the base past the disc's rim, with an end stop and a pad past each end of the ${(t1 - t0).toFixed(0)} mm travel (F5).`, badge: ["ball held at its radius", "ok"], serves: { F1: [`${body}-rd0`], F5: [`${body}-stop0`, `${body}-stop1`] } });
}

/** A body that is its own shaft (shape.journal: the journals' diameter): two pillow blocks past its ends, journals to them. */
function buildJournalled(ctx: BuildCtx, b: KinBody): void {
  const g = ctx.geoms.get(b.id);
  const sh = (b.shape ?? {}) as Record<string, unknown>;
  const site = ctx.sites.find((s) => s.bodies.includes(b.id) && s.fixed);
  if (!g || !site || !ctx.base) return;
  const F: Frame = { o: g.frame.o, x: g.frame.x, z: g.frame.z };
  const d = num(sh.journal, 12);
  const L0 = g.thick;
  const pb = pillowBlocks(ctx, { id: `${site.id}-pb`, frame: F, d, live: true, lo: 0, hi: L0, baseTop: ctx.base.top, joints: site.joints });
  const J = new Local(F, { joints: site.joints });
  J.add(H.shaft(`${b.id}-journal0`, { d, z0: pb.shaft[0], z1: 0.01 }, { body: b.id, name: `Journal Ø${d}, turned on the ${titleOf(b.id).toLowerCase()}'s end` }));
  J.add(H.shaft(`${b.id}-journal1`, { d, z0: L0 - 0.01, z1: pb.shaft[1] }, { body: b.id, name: "" }));
  ctx.add([...pb.solids, ...J.out()]);
  const serves: Record<string, string[]> = {};
  for (const [f, ids] of Object.entries(pb.serves)) if (f !== "_span") (serves[f] ??= []).push(...ids);
  ctx.routes.push({ support: `${site.id}-pb`, site: site.id, kind: "pillow", tried: pb.tried, moved: pb.moved, covers: pb.covers, gap: pb.gap });
  ctx.stacks.set(site.id, { solids: [], d, fit: { d, bearing: [housingBearing(d)] }, support: "pillow", bores: [], w0: pb.shaft[0], w1: pb.shaft[1], serves, notes: [] });
  ctx.note({ id: site.id, kit: "J10", at: site.at, title: `J10 · ${titleOf(site.id)}`, note: `${titleOf(site.id)}: the ${titleOf(b.id).toLowerCase()} is its own shaft, its ends turned to Ø${d} journals in two pillow blocks past its length, located in one and floating in the other.`, badge: ["both ends held", "ok"], d, serves });
}

export const integrator: Rule = {
  id: "integrator-carriage",
  tier: "AUTO",
  ids: ["J5", "F1", "F5"],
  fixture: "ball-disc-integrator",
  applies: (ctx) => ctx.kin.bodies.some((b) => ((b.shape as Record<string, unknown> | undefined)?.type === "slider" && !!(b.shape as Record<string, unknown>).cage) || journalled(b)),
  apply(ctx) {
    for (const b of ctx.kin.bodies) if (journalled(b)) buildJournalled(ctx, b);
    // the ball's joints: its two rolling contacts and its cage
    for (const ji of ctx.joints.filter((j) => j.kit === "ball-cage")) {
      const what = ji.joint.type === "spherical" ? "the ball turns freely in its cage's ring, open below onto the disc and toward the cylinder" : ji.joint.a === "ground" || ji.joint.b === "ground" ? "" : `the ball rolls on the ${titleOf(ji.joint.a === "ball" ? ji.joint.b : ji.joint.a).toLowerCase()}, pressed onto it by the cylinder's height (F6)`;
      ctx.note({ id: ji.id, kit: "ball-cage", at: ji.at, title: `Ball cage · ${titleOf(ji.id)}`, note: `${titleOf(ji.id)}: ${what}.`, badge: ["ball held at its radius", "ok"], serves: {} });
    }
    for (const b of ctx.kin.bodies) if ((b.shape as Record<string, unknown> | undefined)?.type === "slider" && (b.shape as Record<string, unknown>).cage) buildCarriage(ctx, b);
  },
};

void (0 as unknown as Vec3);
