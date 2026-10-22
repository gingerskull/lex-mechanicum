// The kits built on the axial stack (A20): J1 dead axle, J2 live shaft, J10 shaft in plan (or tilted), J3 moving pin.
// Each rule reads the sites of its kit, hands every site to the one stack builder with the members the placement
// solver set, and records the hardware, the bores it needs and the engineering note (A16).
import { circle } from "../../core/geom";
import type { Solid3 } from "../../solids/types";
import type { BuildCtx } from "../ctx";
import { fromPlane, parallel, planeCoords, type Frame } from "../frames";
import { type Member, titleOf } from "../lib";
import { bossRadius } from "./core";
import { axialStack, type StackResult, type StackSpec, type SupportKind } from "../stack";
import { UP, type Site } from "../sites";
import type { Rule } from "./types";

const KEYED = new Set(["gear", "ringGear", "pulley", "sprocket", "cam", "disc", "rack", "shaft"]);

/** The frame of a site's stack: on the axis at the origin plane of the family its bodies are stacked in. */
export function siteFrame(ctx: BuildCtx, site: Site): Frame | null {
  for (const b of site.bodies) {
    const s = ctx.placement.slab.get(b);
    if (!s) continue;
    const fam = ctx.placement.families[s[0]]!.frame;
    if (!parallel(fam.z, site.axis)) continue;
    const uv = planeCoords(fam, site.at).uv;
    return { o: fromPlane(fam, uv, 0), x: fam.x, z: fam.z };
  }
  return null;
}

/** The parts of a site's bodies on its axis, with the extents the placement gave them. */
export function membersOf(ctx: BuildCtx, site: Site, frame: Frame, keyedIds: Set<string>): Member[] {
  const out: Member[] = [];
  for (const b of site.bodies) {
    const joint = site.joints.find((j) => ctx.kin.joints.find((q) => q.id === j && (q.a === b || q.b === b)));
    const R = joint ? bossRadius(ctx, b, joint) : 8;
    for (const part of [ctx.parts.get(b), ctx.twins.get(b)]) {
      if (!part) continue;
      const slab = ctx.extent(b);
      if (!slab || !parallel(slab.frame.z, frame.z)) continue;
      // the twin's second half sits in its own slab
      const w = (part.frame.o[0] - frame.o[0]) * frame.z[0] + (part.frame.o[1] - frame.o[1]) * frame.z[1] + (part.frame.o[2] - frame.o[2]) * frame.z[2];
      const thick = part.op.op === "extrude" ? part.op.h : 6;
      out.push({ solid: part.id, body: b, w0: w, w1: w + thick, R, keyed: keyedIds.has(b), shim: ctx.shim.get(b) ?? 0, name: part.name });
    }
  }
  return out.sort((a, c) => a.w0 - c.w0);
}

/** The bodies a live site's shaft turns (A2): the driven one, or any gear, pulley or cam on it. */
function keyedBodies(ctx: BuildCtx, site: Site): Set<string> {
  const out = new Set<string>();
  if (!site.live) return out;
  const driver = new Set(ctx.kin.drivers.map((d) => d.joint));
  for (const j of site.joints) {
    const kj = ctx.kin.joints.find((q) => q.id === j)!;
    const other = kj.a === "ground" ? kj.b : kj.b === "ground" ? kj.a : null;
    if (other && driver.has(j)) out.add(other);
  }
  for (const b of site.bodies) {
    const body = ctx.kin.bodies.find((q) => q.id === b);
    if (body && KEYED.has(String(body.shape?.type))) out.add(b);
    if (ctx.kin.joints.some((j) => (j.type === "gear-mesh" || j.type === "belt" || j.type === "screw") && (j.a === b || j.b === b))) out.add(b);
  }
  if (!out.size && site.bodies[0]) out.add(site.bodies[0]);
  return out;
}

/** A bore in a part, at the world point of the axis, as a clockwise hole in its profile. */
export function cutBore(ctx: BuildCtx, solidId: string, at: readonly number[], r: number): void {
  const part = [...ctx.parts.values(), ...ctx.twins.values()].find((p) => p.id === solidId);
  if (!part) return;
  const uv = planeCoords(part.frame, [at[0]!, at[1]!, at[2]!]).uv;
  part.profile.holes.push(circle(r, uv[0], uv[1], Math.max(24, Math.round(r * 5))).reverse());
}

function describe(site: Site, r: StackResult, m: Member[]): string {
  const shear: Record<SupportKind, string> = {
    housing: "held in a housing behind the base",
    pillow: "held in two pillow blocks on the base",
    bridge: "held at both ends: the base and a bridge over the top",
    stub: "held at one end only, because a part sweeps over its top",
    hung: "hung from a bridge, because a part sweeps under it",
  };
  return `${titleOf(site.id)}: Ø${r.d} ${site.kit === "J3" ? "shoulder bolt" : site.live ? "live shaft" : "axle"} through ${m.length} part${m.length === 1 ? "" : "s"} (${m.map((x) => x.body).join(", ")}), ${shear[r.support]}.`;
}

/** Builds one site's stack and records everything it needs. */
export function buildSite(ctx: BuildCtx, site: Site): StackResult | null {
  const frame = siteFrame(ctx, site);
  if (!frame) {
    ctx.issues.push(`site ${site.id}: no family of bodies stacked along its axis`);
    return null;
  }
  const keyedIds = keyedBodies(ctx, site);
  const members = membersOf(ctx, site, frame, keyedIds);
  if (!members.length) return null;
  const alongUp = parallel(frame.z, UP);
  const base = alongUp && ctx.base ? { top: ctx.base.top - frame.o[2], bottom: ctx.base.bottom - frame.o[2] } : null;
  const driver = ctx.kin.drivers.find((d) => d.kind === "rotary" || d.kind === "manual" || d.kind === "oscillating");
  const held = ctx.placement.held.get(site.id) ?? "both";
  const straddle = site.live && alongUp && held !== "base" && [...keyedIds].some((b) => ["gear", "pulley", "sprocket"].includes(String(ctx.kin.bodies.find((q) => q.id === b)?.shape?.type)));
  const spec: StackSpec = {
    id: site.id,
    frame,
    kind: !site.fixed ? "moving" : site.live ? "live" : "dead",
    members,
    joints: site.joints,
    base,
    held: site.fixed ? held : "both",
    input: !!driver && site.joints.includes(driver.joint ?? ""),
    straddle,
    eccentric: ctx.eccentric.has(site.id),
    baseTopWorld: ctx.base?.top ?? 0,
  };
  // a support the record asks for on one of the site's joints (a crank held from above, past what turns under it)
  const asked = site.joints.map((j) => (ctx.kin.joints.find((q) => q.id === j) as { support?: SupportKind } | undefined)?.support).find(Boolean);
  if (asked) spec.support = asked;
  // both pillow blocks on one side of what the shaft carries (`side` on its joint: +1 along the axis, −1 against it)
  const side = site.joints.map((j) => (ctx.kin.joints.find((q) => q.id === j) as { side?: number } | undefined)?.side).find((v) => v === 1 || v === -1);
  if (side) spec.side = side as 1 | -1;
  const r = axialStack(ctx, spec);
  ctx.add(r.solids);
  ctx.stacks.set(site.id, r);
  const world = site.at;
  for (const b of r.bores) cutBore(ctx, b.solid, [world[0], world[1], frame.o[2] + 0], b.r);
  if (site.fixed && alongUp && (r.support === "stub" || r.support === "bridge" || r.support === "hung" || r.support === "housing")) {
    ctx.baseHoles.push({ at: [world[0], world[1]], r: site.live ? r.d / 2 + 1.5 : r.d / 2 + 0.3, joint: site.id });
  }
  const shear = r.support === "stub" || r.support === "hung" ? "single" : "double";
  const dbl = site.kit === "J3" ? (members.length >= 3 ? "double" : "single") : shear;
  ctx.note({
    id: site.id,
    kit: site.kit,
    at: site.at,
    title: `${site.kit} · ${titleOf(site.id)}`,
    note: describe(site, r, members),
    badge: dbl === "double" ? ["double shear", "ok"] : ["single shear", "warn"],
    d: r.d,
    serves: r.serves,
  });
  return r;
}

const SITE_RULES: Record<string, { id: string; ids: string[]; fixture: string }> = {
  J1: { id: "j1-dead-axle", ids: ["J1", "A4", "A11", "M8", "M9", "M11"], fixture: "four-bar" },
  J2: { id: "j2-live-shaft", ids: ["J2", "A5", "F1", "F2", "F3", "F4"], fixture: "four-bar" },
  J10: { id: "j10-shaft-in-plan", ids: ["J10", "A5", "F1", "F2", "F3", "F4"], fixture: "universal-joint" },
  J3: { id: "j3-moving-pin", ids: ["J3", "A12", "M3"], fixture: "four-bar" },
};

function siteRule(kit: "J1" | "J2" | "J10" | "J3"): Rule {
  const def = SITE_RULES[kit]!;
  return {
    id: def.id,
    tier: "AUTO",
    ids: def.ids,
    fixture: def.fixture,
    applies: (ctx) => ctx.sites.some((s) => s.kit === kit),
    apply(ctx) {
      for (const s of ctx.sites.filter((q) => q.kit === kit)) buildSite(ctx, s);
    },
  };
}

export const j3 = siteRule("J3");
export const j2 = siteRule("J2");
export const j10 = siteRule("J10");
export const j1 = siteRule("J1");

export type { Solid3 };
