// Compliant joints (J13) and the drive of an input that only swings or slides a short way (V5). A flexure hinge is one
// blank: the ground's block and the lever joined by a circular-notch neck, drawn rigid either side of the neck's centre
// (D9; its bend shows on the overlays). The kit builds the block's half of the blank, its seat plate and clamp plate,
// screws and dowels, and a stop pin each side of the lever. The drive: a pin pressed into the input runs down through a
// slot in the base to a slotted yoke under it, driven by a crank on a gear motor that makes one turn per cycle (a
// Scotch yoke: its slide is the exact cosine law of an oscillating or linear driver, which a crank and link only near).
import { circle, roundRect, type Vec2 } from "../core/geom";
import { H } from "../hardware/primitives";
import { MOTORS, SENSOR } from "../hardware/tables";
import { v3, xf, type Vec3 } from "../kin/math";
import type { Kin, KinBody, KinDriver } from "../kin/types";
import type { Solid3 } from "../solids/types";
import type { BuildCtx } from "./ctx";
import { fromPlane, type Frame } from "./frames";
import { Local, titleOf } from "./lib";
import type { BodyGeom } from "./shapes";
import type { Rule } from "./rules/types";

const num = (v: unknown, d: number): number => (typeof v === "number" && Number.isFinite(v) ? v : d);
const UP: Vec3 = [0, 0, 1];

/** A ring counter-clockwise. */
function ccw(p: Vec2[]): Vec2[] {
  let a = 0;
  for (let i = 0; i < p.length; i++) {
    const q = p[i]!;
    const r = p[(i + 1) % p.length]!;
    a += q[0] * r[1] - r[0] * q[1];
  }
  return a < 0 ? [...p].reverse() : p;
}

/** The neck's edge: the upper notch circle (centre (0, R + t/2), radius R) at x, |x| ≤ R. */
const notchY = (R: number, t: number, x: number): number => R + t / 2 - Math.sqrt(Math.max(0, R * R - x * x));

/** The neck of a flexure joint: { R, t } from the joint's `neck`. */
function neckOf(kin: Kin, body: string): { R: number; t: number; joint: string } | null {
  const j = kin.joints.find((q) => q.type === "flexure" && (q.a === body || q.b === body) && (q.a === "ground" || q.b === "ground"));
  const n = j?.neck as { R?: unknown; t?: unknown } | undefined;
  if (!j || !n) return null;
  return { R: num(n.R, 5), t: num(n.t, 0.8), joint: j.id };
}

/**
 * The lever of a flexure hinge (a `link` with a `root` on a flexure joint that has a `neck`): its half of the neck from
 * the neck's centre to the notch's end, a flat root face, and a taper to a boss round the drive pin at its tip.
 */
export function flexureGeom(kin: Kin, b: KinBody, g: BodyGeom): BodyGeom | null {
  const sh = (b.shape ?? {}) as Record<string, unknown>;
  const root = sh.root as { half?: unknown } | undefined;
  if (sh.type !== "link" || !root) return null;
  const nk = neckOf(kin, b.id);
  if (!nk) return null;
  const { R, t } = nk;
  const L = num(sh.length, 100);
  const W = num(root.half, 9);
  const rTip = num((sh.boss as unknown[] | undefined)?.[1], 7);
  // the tangent on the tip boss from a root corner (side s)
  const tangent = (s: number): number => {
    const dx = L - R;
    const dy = -s * W;
    const d = Math.hypot(dx, dy);
    return Math.atan2(dy, dx) + s * Math.asin(rTip / d) + s * (Math.PI / 2);
  };
  const a0 = tangent(-1);
  let a1 = tangent(1);
  while (a1 < a0) a1 += 2 * Math.PI;
  const tip: Vec2[] = [];
  for (let k = 0; k <= 24; k++) {
    const a = a0 + ((a1 - a0) * k) / 24;
    tip.push([L + rTip * Math.cos(a), rTip * Math.sin(a)]);
  }
  const lower: Vec2[] = [];
  const upper: Vec2[] = [];
  for (let k = 0; k <= 12; k++) {
    const x = (R * k) / 12;
    lower.push([x, -notchY(R, t, x)]);
    upper.push([R - x, notchY(R, t, R - x)]);
  }
  const outer = ccw([...lower, [R, -W], ...tip, [R, W], ...upper]);
  const pin = num(sh.pin, 4);
  return { ...g, profile: { outer, holes: [circle(pin / 2 + 0.01, L, 0, 24).reverse()] }, thick: num(sh.thickness, 10), approx: false };
}

// ------------------------------------------------------------------------------------------------ J13

export const j13: Rule = {
  id: "j13-compliant",
  tier: "AUTO",
  ids: ["J13", "A6", "F1", "F2", "F5"],
  fixture: "flexure-hinge",
  applies: (ctx) => ctx.joints.some((j) => j.kit === "J13"),
  apply(ctx) {
    const flex = (b: string) => ctx.kin.joints.some((q) => q.type === "flexure" && (q.a === b || q.b === b));
    const pads: string[] = [];
    let padBody = "";
    for (const ji of ctx.joints.filter((j) => j.kit === "J13")) {
      const lever = ji.a === "ground" ? ji.b : ji.a;
      const grounded = ji.a === "ground" || ji.b === "ground";
      const nk = grounded ? neckOf(ctx.kin, lever) : null;
      const note = (text: string) => ctx.note({ id: ji.id, kit: "J13", at: ji.at, title: `J13 · ${titleOf(ji.id)}`, note: `${titleOf(ji.id)}: ${text}`, badge: ["one piece, no pivot", "ok"], serves: {} });
      if (nk) buildBlank(ctx, ji.id, lever, nk);
      else if (ji.joint.type === "prismatic" && !(flex(ji.a) && flex(ji.b))) buildWindow(ctx, ji.id);
      else if (ji.joint.type === "prismatic") note("the axial give of a pseudo-rigid beam, which the model splits in two halves; in the blank it is one thin beam (D9).");
      else {
        if (grounded && !padBody) padBody = lever;
        if (grounded) pads.push(ji.id);
        note(grounded ? "a beam's root on its anchor pad, a flexure of the one-piece blank, drawn rigid either side; its bend shows on the overlays (D9)." : "a flexure of the one-piece blank, drawn rigid either side; its bend shows on the overlays (D9).");
      }
    }
    if (pads.length) buildPads(ctx, pads, padBody);
    // a shuttle that moves without turning between necks gets a stop pin past each end of its travel (F5)
    const snap = ctx.kin.solve.find((q) => q.block === "flexure" && q.in?.mode === "snap");
    const sh = snap?.in?.shuttle;
    if (typeof sh === "string") shuttleStops(ctx, sh, v3.unit((snap?.in?.axis as Vec3 | undefined) ?? [0, 1, 0]));
  },
};

function buildBlank(ctx: BuildCtx, jid: string, lever: string, nk: { R: number; t: number }): void {
  const g = ctx.geoms.get(lever);
  const part = ctx.parts.get(lever);
  const ext = ctx.extent(lever);
  if (!g || !part || !ext || !ctx.base) return;
  const { R, t } = nk;
  const F: Frame = { o: part.frame.o, x: part.frame.x, z: part.frame.z };
  const h = g.thick;
  const gsh = (ctx.kin.bodies.find((q) => q.id === "ground")?.shape ?? {}) as Record<string, unknown>;
  const [bw, bh] = Array.isArray(gsh.rect) ? [num(gsh.rect[0], 40), num(gsh.rect[1], 40)] : [40, 40];
  const out: Solid3[] = [];
  const L = new Local(F, { joints: [jid] });
  // the block's half of the blank: the block and the neck from the notch's start to the neck's centre
  const neck: Vec2[] = [];
  for (let k = 0; k <= 12; k++) {
    const x = -R + (R * k) / 12;
    neck.push([x, notchY(R, t, x)]);
  }
  const low = neck.map(([x, y]): Vec2 => [x, -y]);
  const half = bh / 2;
  const blank = ccw([[-R - bw, -half], [-R, -half], [-R, -notchY(R, t, -R)], ...low.slice(1), [0, -t / 2], [0, t / 2], ...neck.slice(0, -1).reverse(), [-R, notchY(R, t, -R)], [-R, half], [-R - bw, half]]);
  const holes = [[-R - bw + 8, -half + 8], [-R - bw + 8, half - 8], [-R - 12, -half + 8], [-R - 12, half - 8]].map(([x, y]) => circle(1.7, x!, y!, 20).reverse());
  L.add(H.plate(`${jid}-block`, blank, { body: "ground", kind: "part", role: "ground", name: `Flexure blank, block and neck (circular notch R ${R}, t ${t}), one piece with the lever, aluminium 7075-T6`, z0: 0, z1: h, holes, mat: "Aluminium 7075-T6" }));
  // the seat plate under the block, of its outline, on the base (never posts, A6)
  const baseTop = ctx.base.top - F.o[2];
  L.add(H.plate(`${jid}-seat`, roundRect(-R - bw, -half, -R - 1, half, 2), { body: "ground", kind: "plate", role: "ground", name: "Ground seat plate under the blank's block", z0: baseTop, z1: 0, holes: holes.map((q) => q.map((p) => [...p] as Vec2)), mat: "Steel C45, ground" }));
  // the clamp plate over the block, two screws and two dowels reamed through clamp, block and seat (F1, F2)
  L.add(H.plate(`${jid}-clamp`, roundRect(-R - bw + 2, -half + 2, -R - 6, half - 2, 2), { body: "ground", kind: "plate", role: "ground", name: "Clamp plate over the blank's block", z0: h, z1: h + 4, holes: holes.map((q) => q.map((p) => [...p] as Vec2)), mat: "Aluminium 6061-T6, anodised" }));
  for (const [k, x, y] of [[0, -R - bw + 8, -half + 8], [1, -R - 12, half - 8]] as const)
    L.add(H.screw(`${jid}-sc${k}`, "socket", 3, h + 4 + -baseTop + 6, { body: "ground", at: [x, y, 0], face: h + 4, dir: -1, ...(k ? { name: "", qty: 0 } : { qty: 2 }) }));
  for (const [k, x, y] of [[0, -R - bw + 8, half - 8], [1, -R - 12, -half + 8]] as const)
    L.add(H.dowel(`${jid}-dw${k}`, 3, { body: "ground", at: [x, y, 0], z0: baseTop - 4, z1: h + 4, ...(k ? { name: "", qty: 0 } : { name: "Dowel pin Ø3 h6, reamed through clamp, block and seat", qty: 2 }) }));
  // a hardened stop pin each side of the lever at 70 % of its reach, a fifth of the half swing past each end (F5)
  const pin = ctx.kin.joints.find((q) => q.id === jid);
  const lim = (pin?.limits ?? [-2, 2]) as [number, number];
  const halfSwing = ((lim[1] - lim[0]) / 2) * (Math.PI / 180);
  const reach = Math.max(...g.profile.outer.map((p) => p[0]));
  const xs = reach * 0.7;
  // the lever's edge at xs: the taper between the root and the tip boss
  const ring = g.profile.outer;
  let edge = 0;
  for (let i = 0; i < ring.length; i++) {
    const p = ring[i]!;
    const q = ring[(i + 1) % ring.length]!;
    if ((p[0] - xs) * (q[0] - xs) > 0 || p[0] === q[0]) continue;
    edge = Math.max(edge, Math.abs(p[1] + ((q[1] - p[1]) * (xs - p[0])) / (q[0] - p[0])));
  }
  for (const [k, s] of [[0, 1], [1, -1]] as const) {
    const a = s * halfSwing * 1.2;
    // the pin's centre: where the lever's edge stands at that angle, plus the pin's radius
    const ex = xs * Math.cos(a) - s * edge * Math.sin(a);
    const ey = xs * Math.sin(a) + s * edge * Math.cos(a);
    L.add(H.solid(`${jid}-stop${k}`, { name: k ? "" : "Stop pin Ø4, hardened, pressed into the base", kind: "stop", role: "hw", mat: "Steel 100Cr6, hardened", outer: circle(2, ex, ey + s * 2, 20), z0: baseTop - 6, z1: h, body: "ground", ...(k ? { qty: 0 } : { qty: 2 }) }));
  }
  out.push(...L.out());
  ctx.add(out);
  ctx.note({
    id: jid,
    kit: "J13",
    at: ctx.S.joints.get(jid)!.at,
    title: `J13 · ${titleOf(jid)}`,
    note: `${titleOf(jid)}: circular notch R ${R}, neck ${t} mm, cut in one blank with the block and the lever, which turns about the neck's centre by bending it, with no pin, play or wear; the neck is drawn rigid, its bend on the overlays (D9). The block stands on a ground seat plate of its outline and is clamped to the base under a plate by two screws and two dowels (F1, F2); a hardened stop pin each side catches the lever a fifth of its half swing past each end, before the neck yields (F5).`,
    badge: ["one piece, no pivot", "ok"],
    serves: { F1: [`${jid}-dw0`], F2: [`${jid}-clamp`], F5: [`${jid}-stop0`, `${jid}-stop1`] },
  });
}


/**
 * The anchor pads of a compliant blank whose flexures meet the ground without a notch (a bistable's beams): each pad of
 * the ground's `rects`, in the blank's plane, on a ground seat plate of its outline, clamped under a plate by two screws
 * and two dowels (J13, F1, F2, A6).
 */
function buildPads(ctx: BuildCtx, joints: string[], body: string): void {
  const gsh = (ctx.kin.bodies.find((q) => q.id === "ground")?.shape ?? {}) as Record<string, unknown>;
  const rects = (Array.isArray(gsh.rects) ? gsh.rects : []) as { center?: unknown; size?: unknown }[];
  const part = ctx.parts.get(body);
  const ext = ctx.extent(body);
  if (!part || !ext || !ctx.base || !rects.length) return;
  const z0 = v3.dot(v3.add(ext.frame.o, v3.mul(ext.frame.z, ext.w0)), UP);
  const h = ext.w1 - ext.w0;
  const F: Frame = { o: [0, 0, z0], x: [1, 0, 0], z: UP };
  const L = new Local(F, { joints });
  const baseTop = ctx.base.top - z0;
  rects.forEach((r, k) => {
    const c = Array.isArray(r.center) ? [num(r.center[0], 0), num(r.center[1], 0)] : [0, 0];
    const sz = Array.isArray(r.size) ? [num(r.size[0], 20), num(r.size[1], 20)] : [20, 20];
    const [x0, x1, y0, y1] = [c[0]! - sz[0]! / 2, c[0]! + sz[0]! / 2, c[1]! - sz[1]! / 2, c[1]! + sz[1]! / 2];
    const s = Math.sign(c[0]!) || 1;
    // the screws and dowels on the outer half of the pad, clear of the beam's root
    const xo = s > 0 ? x1 - 6 : x0 + 6;
    const xi = s > 0 ? x0 + 12 : x1 - 12;
    const holes = [[xo, y0 + 6], [xo, y1 - 6], [xi, y0 + 6], [xi, y1 - 6]].map(([x, y]) => circle(1.7, x!, y!, 20).reverse());
    const id = `pad${k}`;
    L.add(H.plate(`${id}`, roundRect(x0, y0, x1, y1, 2), { body: "ground", kind: "part", role: "ground", name: k ? "" : "Blank's anchor pad, one piece with the beams and the shuttle, polypropylene", z0: 0, z1: h, holes, mat: "Polypropylene, one piece" }));
    // the seat stops short of the pad's inner edge, where the beam's root turns over it (A12)
    const sx0 = s > 0 ? x0 + 1.5 : x0;
    const sx1 = s > 0 ? x1 : x1 - 1.5;
    L.add(H.plate(`${id}-seat`, roundRect(sx0, y0, sx1, y1, 2), { body: "ground", kind: "plate", role: "ground", name: k ? "" : "Ground seat plate under each anchor pad", z0: baseTop, z1: 0, holes: holes.map((q) => q.map((p) => [...p] as Vec2)), mat: "Steel C45, ground" }));
    const cx0 = s > 0 ? x0 + 6 : x0;
    const cx1 = s > 0 ? x1 : x1 - 6;
    L.add(H.plate(`${id}-clamp`, roundRect(cx0, y0, cx1, y1, 2), { body: "ground", kind: "plate", role: "ground", name: k ? "" : "Clamp plate over each anchor pad", z0: h, z1: h + 3, holes: holes.map((q) => q.map((p) => [...p] as Vec2)), mat: "Aluminium 6061-T6, anodised" }));
    for (const [n, x, y] of [[0, xo, y0 + 6], [1, xi, y1 - 6]] as const) L.add(H.screw(`${id}-sc${n}`, "socket", 3, h + 3 - baseTop + 6, { body: "ground", at: [x, y, 0], face: h + 3, dir: -1, ...(n || k ? { name: "", qty: 0 } : { qty: 4 }) }));
    for (const [n, x, y] of [[0, xo, y1 - 6], [1, xi, y0 + 6]] as const) L.add(H.dowel(`${id}-dw${n}`, 3, { body: "ground", at: [x, y, 0], z0: baseTop - 4, z1: h + 3, ...(n || k ? { name: "", qty: 0 } : { name: "Dowel pin Ø3 h6, reamed through clamp, pad and seat", qty: 4 }) }));
  });
  ctx.add(L.out());
}

/**
 * A slide held by springs: the pusher's roller in the shuttle's window between two compression springs (J13). The roller
 * on a stud down from the pusher's arm into the window; each spring drawn between the roller's rim and the window's end
 * (a stretched member, D9).
 */
function buildWindow(ctx: BuildCtx, jid: string): void {
  const j = ctx.kin.joints.find((q) => q.id === jid)!;
  const pusher = ctx.kin.bodies.find((b) => b.id === j.a)!;
  const shuttle = j.b;
  const psh = (pusher.shape ?? {}) as Record<string, unknown>;
  const pe = ctx.extent(pusher.id);
  const se = ctx.extent(shuttle);
  const pg = ctx.geoms.get(pusher.id);
  if (!pe || !se || !pg) return;
  const at = ctx.S.joints.get(jid)!.at;
  const zOf = (e: NonNullable<ReturnType<BuildCtx["extent"]>>, w: number) => v3.dot(v3.add(e.frame.o, v3.mul(e.frame.z, w)), UP);
  const sz0 = zOf(se, se.w0);
  const sz1 = zOf(se, se.w1);
  const pz0 = zOf(pe, pe.w0);
  const pz1 = zOf(pe, pe.w1);
  const F: Frame = { o: [at[0], at[1], 0], x: [1, 0, 0], z: UP };
  const L = new Local(F, { joints: [jid] });
  const arm = psh.arm as { from?: unknown; to?: unknown; width?: unknown } | undefined;
  const rd = num(psh.roller, 11);
  if (arm) {
    const a = Array.isArray(arm.from) ? [num(arm.from[0], 0), num(arm.from[1], 0)] : [0, 0];
    const b = Array.isArray(arm.to) ? [num(arm.to[0], 0), num(arm.to[1], 40)] : [0, 40];
    // the arm in the pusher's own plane, from the roller to the slider block (pusher frame coordinates, its origin the joint)
    const po = pg.frame.o;
    const off: Vec2 = [po[0] - at[0], po[1] - at[1]];
    // the arm stands on the slider block's top, over the slide's end stop, and reaches back to the roller
    const w = num(arm.width, 10) / 2;
    const az0 = pz1 + 2.5;
    L.add(H.plate(`${pusher.id}-arm`, H.window([[a[0]! + off[0], a[1]! + off[1]], [b[0]! + off[0], b[1]! + off[1]]], w), { body: pusher.id, kind: "part", role: "driver", name: "Pusher arm, reaches over the shuttle to the roller", z0: az0, z1: az0 + (pz1 - pz0), mat: "Aluminium 6061-T6, anodised" }));
    L.add(H.plate(`${pusher.id}-arm-riser`, roundRect(b[0]! + off[0] - w, b[1]! + off[1] - 2 * w, b[0]! + off[0] + w, b[1]! + off[1], 2), { body: pusher.id, kind: "part", role: "driver", name: "", z0: pz1, z1: az0, mat: "Aluminium 6061-T6, anodised", group: `${pusher.id}-arm` }));
  }
  // the roller on a stud down from the arm into the window
  const d = 4;
  L.add(H.shaft(`${jid}-stud`, { d, z0: sz0 + 0.5, z1: pz1 + 2.5 + (pz1 - pz0) }, { body: pusher.id, name: `Roller stud Ø${d}, pressed into the pusher's arm` }));
  L.add(H.solid(`${jid}-roller`, { name: `Roller Ø${rd} on a needle bushing, between the window's springs`, kind: "roller", role: "hw", mat: "Steel 100Cr6, hardened", outer: circle(rd / 2, 0, 0, 36), holes: [circle(d / 2 + 0.05, 0, 0, 20).reverse()], z0: sz0 + 0.5, z1: sz1 - 0.5, body: pusher.id }));
  ctx.add(L.out());
  // the springs: a coil outline at unit length along x, stretched between the roller's rim and the window's end
  const coils = 7;
  const wire = 0.06;
  const D = Math.min(rd - 3, sz1 - sz0 - 1);
  const zig: Vec2[] = [];
  for (let k = 0; k <= 2 * coils; k++) zig.push([k / (2 * coils), (k % 2 ? 1 : -1) * (D / 2 - 0.4)]);
  const band = (pts: Vec2[], w: number): Vec2[] => [...pts.map(([x, y]): Vec2 => [x, y + (y > 0 ? 0.4 : -0.4) * 0 + w]), ...pts.map(([x, y]): Vec2 => [x, y - w]).reverse()];
  const outer = band(zig, 0.4);
  void wire;
  const pts = ctx.kin.points ?? [];
  const end = (a: string, b: string): { a: string; b: string } | null => (pts.some((p) => p.id === a) && pts.some((p) => p.id === b) ? { a, b } : null);
  const pairs = [end("Rp", "Wp"), end("Rm", "Wm")].filter((x): x is { a: string; b: string } => !!x);
  const zc = (sz0 + sz1) / 2;
  pairs.forEach((p, k) => {
    const A = ctx.S.refPts.get(p.a)!;
    const B = ctx.S.refPts.get(p.b)!;
    const x = v3.unit([B[0] - A[0], B[1] - A[1], 0]);
    const s3: Solid3 = {
      id: `${jid}-spring${k}`,
      name: k ? "" : `Compression spring Ø${D.toFixed(0)}, ${coils} coils, between the roller and the window's end`,
      role: "hw",
      kind: "spring",
      body: pusher.id,
      frame: { o: [A[0], A[1], zc - D / 2], x, z: UP },
      profile: { outer: ccw(outer), holes: [] },
      op: { op: "extrude", h: D, steps: 1 },
      marks: [],
      ex: 0,
      joints: [jid],
      detail: "never",
      flags: {},
      mat: "Spring steel EN 10270-1",
      stretch: [p.a, p.b],
      ...(k ? {} : {}),
    };
    ctx.add(s3);
  });
  ctx.note({
    id: jid,
    kit: "J13",
    at,
    title: `J13 · ${titleOf(jid)}`,
    note: `${titleOf(jid)}: the pusher's roller on a stud down from its arm into the shuttle's window, between two compression springs: the pusher drives the shuttle through the springs, which let it snap ahead of the pusher where the beams' force passes theirs.`,
    badge: ["drive through springs", "ok"],
    serves: { F6: [`${jid}-spring0`] },
  });
}

/** Stop pins past each end of a shuttle's travel, a fifth of its half travel past its end faces (J13, F5). */
function shuttleStops(ctx: BuildCtx, shuttle: string, axis: Vec3): void {
  const part = ctx.parts.get(shuttle);
  const ext = ctx.extent(shuttle);
  if (!part || !ext || !ctx.base) return;
  const xs = ctx.sampled.xfs.get(shuttle) ?? [];
  const along = xs.map((X) => v3.dot(X.t, axis));
  const lo = Math.min(...along);
  const hi = Math.max(...along);
  const half = (hi - lo) / 2;
  const pts = part.profile.outer.map((q) => fromPlane(part.frame, q, 0));
  const proj = pts.map((p) => v3.dot(p, axis));
  const c = pts.reduce((a, p) => v3.add(a, p), [0, 0, 0] as Vec3).map((v) => v / pts.length) as Vec3;
  const pMin = Math.min(...proj) + lo - 0.2 * half - 2.5;
  const pMax = Math.max(...proj) + hi + 0.2 * half + 2.5;
  const zTop = v3.dot(v3.add(ext.frame.o, v3.mul(ext.frame.z, ext.w1)), UP);
  const F: Frame = { o: [0, 0, 0], x: [1, 0, 0], z: UP };
  const L = new Local(F, { joints: [] });
  [pMin, pMax].forEach((p, k) => {
    const q = v3.add(c, v3.mul(axis, p - v3.dot(c, axis)));
    L.add(H.solid(`${shuttle}-stop${k}`, { name: k ? "" : "Stop pin Ø5, hardened, pressed into the base", kind: "stop", role: "hw", mat: "Steel 100Cr6, hardened", outer: circle(2.5, q[0], q[1], 20), z0: ctx.base!.top - 6, z1: zTop, body: "ground", ...(k ? { qty: 0 } : { qty: 2 }) }));
  });
  ctx.add(L.out());
}

// ------------------------------------------------------------------------------------------------ the yoke drive (V5)

/** A driver the yoke drive serves: a swing of less than a turn, or a linear one, with a pin point named. */
const yokeDriven = (d: KinDriver & { pin?: unknown }): boolean => typeof d.pin === "string" && (d.kind === "linear" || (d.kind === "oscillating" && Math.abs((d.hi ?? d.range?.[1] ?? 0) - (d.lo ?? d.range?.[0] ?? 0)) <= 360));

/** The cycle phase at which an oscillating or linear driver stands at its default. */
function refPhase(d: KinDriver): number {
  const lo = d.lo ?? d.range?.[0] ?? 0;
  const hi = d.hi ?? d.range?.[1] ?? 0;
  const k = hi === lo ? 0 : ((d.default ?? 0) - lo) / (hi - lo);
  return Math.acos(Math.max(-1, Math.min(1, 1 - 2 * k)));
}

export const yokeDrive: Rule = {
  id: "yoke-drive",
  tier: "AUTO",
  ids: ["V1", "V2", "V5", "V6", "F10"],
  fixture: "flexure-hinge",
  applies: (ctx) => ctx.kin.drivers.some(yokeDriven),
  apply(ctx) {
    const d = ctx.kin.drivers.find(yokeDriven) as KinDriver & { pin: string };
    buildYoke(ctx, d);
  },
};

function buildYoke(ctx: BuildCtx, d: KinDriver & { pin: string }): void {
  if (!ctx.base) return;
  const pt = ctx.kin.points?.find((p) => p.id === d.pin);
  if (!pt) {
    ctx.issues.push(`drive: the driver's pin ${d.pin} is not a point`);
    return;
  }
  const body = pt.body;
  const ref = ctx.S.refPts.get(pt.id)!;
  const lo = d.lo ?? d.range![0];
  const hi = d.hi ?? d.range![1];
  const X0 = ctx.K.poseAt({ [d.id]: lo }).bodies.get(body)!;
  const X1 = ctx.K.poseAt({ [d.id]: hi }).bodies.get(body)!;
  const P0 = xf.apply(X0, ref);
  const P1 = xf.apply(X1, ref);
  const run: Vec3 = [P1[0] - P0[0], P1[1] - P0[1], 0];
  const e: Vec3 = v3.unit(run);
  const f: Vec3 = v3.cross(UP, e);
  const mid: Vec3 = [(P0[0] + P1[0]) / 2, (P0[1] + P1[1]) / 2, 0];
  // the yoke's slot stands off the pin along f; the crank turns about the slot's mean place with the slot's half run as
  // its throw (a part that swings carries its slot on a smaller radius than its pin)
  const pinR = Math.hypot(...v3.sub(P1, P0).slice(0, 2) as [number, number]) / 2;
  const off = pinR + 9;
  const S = v3.add(ref, v3.mul(f, -off));
  const S0 = xf.apply(X0, S);
  const S1 = xf.apply(X1, S);
  const r = Math.hypot(S1[0] - S0[0], S1[1] - S0[1]) / 2;
  const C: Vec3 = [(S0[0] + S1[0]) / 2, (S0[1] + S1[1]) / 2, 0];
  const bb = ctx.base.bottom;
  const bt = ctx.base.top;
  const u0 = refPhase(d);
  const j = ["drive"];
  // the frame of the drive under the base: x along the run, z up
  const Fd: Frame = { o: [0, 0, 0], x: e, z: UP };
  const at2 = (p: Vec3): [number, number] => [v3.dot(p, e), v3.dot(p, f)];
  const D = new Local(Fd, { joints: j });
  const [cx, cy] = at2(C);
  const [px, py] = at2(ref);
  const pinD = 4;
  // the pin pressed into the input runs down through a slot in the base to the yoke
  const partTop = (() => {
    const ext = ctx.extent(body);
    return ext ? v3.dot(v3.add(ext.frame.o, v3.mul(ext.frame.z, ext.w1)), UP) : ref[2];
  })();
  D.add(H.shaft(`drive-pin`, { d: pinD, z0: bb - 8, z1: partTop }, { body, at: [px, py, 0], name: `Drive pin Ø${pinD}, pressed into the ${titleOf(body).toLowerCase()}` }));
  // the yoke: clamped on the pin's end, its slot square to the run over the crank's circle
  const yz0 = bb - 7;
  const yz1 = bb - 3;
  const slotHalf = r + pinD / 2 + 1.5;
  const yoke = ccw([[px - 6, py + 6], [px - 6, cy - slotHalf - 5], [px + 6, cy - slotHalf - 5], [px + 6, py + 6]].map(([a, b]): Vec2 => [a!, b!]));
  // a swinging yoke tilts with its part: the slot's clearance takes the tilt over the crank pin's run along it
  const c = 0.1 + r * Math.abs(Math.sin(((hi - lo) / 2) * (Math.PI / 180))) * (d.kind === "linear" ? 0 : 1);
  const [sx] = at2(S);
  const slotRing = ccw([[sx - pinD / 2 - c, cy - slotHalf], [sx + pinD / 2 + c, cy - slotHalf], [sx + pinD / 2 + c, cy + slotHalf], [sx - pinD / 2 - c, cy + slotHalf]]).reverse();
  D.add(H.plate(`drive-yoke`, yoke, { body, kind: "plate", role: "driver", name: "Slotted yoke, clamped on the drive pin (Scotch yoke)", z0: yz0, z1: yz1, holes: [circle(pinD / 2, px, py, 20).reverse(), slotRing], mat: "Steel C45, slot hardened" }));
  void cx;
  // the crank: a disc on the gear motor's shaft, its pin in the yoke's slot at radius r
  const mot = MOTORS.pancake;
  const cz0 = yz0 - 6;
  const cz1 = yz0 - 1.5;
  const crankAt: Vec3 = [C[0], C[1], 0];
  const spin = { at: crankAt, axis: UP, u0 };
  // the crank pin at the reference: the cosine law puts it at e = -r cos u0 from the centre, turned about z
  const pinAt: Vec3 = v3.add(C, v3.add(v3.mul(e, -r * Math.cos(u0)), v3.mul(f, -r * Math.sin(u0))));
  const [qx, qy] = at2(pinAt);
  D.add(H.solid(`drive-crank`, { name: `Crank disc Ø${2 * r + 12}, throw ${r.toFixed(2)}, on the gear motor's shaft`, kind: "pulley", role: "driver", mat: "Steel C45", outer: circle(r + 6, cx, cy, 36), holes: [circle(mot.shaft / 2, cx, cy, 16).reverse()], z0: cz0, z1: cz1 }));
  D.add(H.shaft(`drive-crank-pin`, { d: pinD, z0: cz1 - 1, z1: yz1 - 0.5 }, { at: [qx, qy, 0], name: `Crank pin Ø${pinD}, hardened, runs in the yoke's slot` }));
  D.add(H.flag(`drive-flag`, r + 6, r + 6 + SENSOR.depth - 1.5 + 2, Math.atan2(qy - cy, qx - cx) + Math.PI, { at: [cx, cy, 0], z0: cz0 - 1, z1: cz0 - 1 + SENSOR.vane }));
  const spun = D.list.filter((s) => s.id.startsWith("drive-crank") || s.id === "drive-flag");
  // the motor under the crank, on a plate hung from the base on two standoffs
  const mz1 = cz0 - 3;
  const mz0 = mz1 - mot.H;
  D.add(H.solid(`drive-motor`, { name: `Gear motor Ø${2 * mot.R} x ${mot.H}, one turn per cycle, 24 V`, kind: "motor", role: "hw", mat: "Aluminium housing", outer: circle(mot.R, cx, cy, 48), z0: mz0, z1: mz1 }));
  D.add(H.solid(`drive-motor-core`, { name: "", kind: "motorInternal", role: "hw", outer: circle(mot.R - 4, cx, cy, 36), z0: mz0 + 3, z1: mz1 - 3, faint: true, inset: true }));
  D.add(H.shaft(`drive-shaft`, { d: mot.shaft, z0: mz1, z1: cz1 }, { at: [cx, cy, 0], name: `Motor shaft Ø${mot.shaft}` }));
  const plateZ1 = mz0;
  const plateZ0 = mz0 - 4;
  D.add(H.plate(`drive-plate`, roundRect(cx - mot.R - 14, cy - mot.R - 4, cx + mot.R + 14, cy + mot.R + 4, 4), { kind: "bracket", role: "ground", name: "Motor plate, hung from the base on two standoffs", z0: plateZ0, z1: plateZ1, mat: "Aluminium 6061-T6, anodised" }));
  for (const [k, s] of [[0, -1], [1, 1]] as const) {
    D.add(H.standoff(`drive-so${k}`, { at: [cx + s * (mot.R + 8), cy, 0], z0: plateZ1, z1: bb, ...(k ? { name: "" } : {}) }));
    D.add(H.screw(`drive-sos${k}`, "socket", 5, 10, { at: [cx + s * (mot.R + 8), cy, 0], face: plateZ0, dir: 1, ...(k ? { name: "", qty: 0 } : { qty: 2 }) }));
  }
  // the fork sensor straddling the flag, on the plate; terminals and a lead under the base
  const sa = Math.atan2(qy - cy, qx - cx) + Math.PI;
  const mouth = r + 6 + 1;
  const box = (r0: number, r1: number): Vec2[] => {
    const c = Math.cos(sa), sn = Math.sin(sa), w = SENSOR.w / 2;
    return ccw([[r0, -w], [r1, -w], [r1, w], [r0, w]].map(([a, b]): Vec2 => [cx + a! * c - b! * sn, cy + a! * sn + b! * c]));
  };
  const fz = cz0 - 1 + SENSOR.vane / 2;
  D.add(H.solid(`drive-sensor`, { name: `Fork sensor, slotted optical, ${SENSOR.slot} mm gap`, kind: "sensor", role: "hw", mat: "PBT housing", outer: box(mouth, mouth + SENSOR.l), z0: fz - SENSOR.h / 2, z1: fz - SENSOR.slot / 2, group: "drive-sensor" }));
  D.add(H.solid(`drive-sensor-jaw`, { name: "", kind: "sensor", role: "hw", outer: box(mouth, mouth + SENSOR.l), z0: fz + SENSOR.slot / 2, z1: fz + SENSOR.h / 2, group: "drive-sensor" }));
  D.add(H.solid(`drive-sensor-back`, { name: "", kind: "sensor", role: "hw", outer: box(mouth + SENSOR.depth, mouth + SENSOR.l), z0: fz - SENSOR.slot / 2, z1: fz + SENSOR.slot / 2, group: "drive-sensor" }));
  const post: Vec2 = [cx + (mouth + SENSOR.l - 5) * Math.cos(sa), cy + (mouth + SENSOR.l - 5) * Math.sin(sa)];
  D.add(H.standoff(`drive-sensor-post`, { at: [post[0], post[1], 0], z0: fz + SENSOR.h / 2, z1: bb, name: "Standoff Ø10 under the base, carries the sensor" }));
  const tb: Vec2 = [cx, cy - mot.R - 16];
  D.add(H.terminalBlock(`drive-terminals`, 4, { at: [tb[0], tb[1], 0], z0: bb - 6, z1: bb }));
  D.add(H.lead(`drive-lead`, [[cx, cy - mot.R + 2], [cx + 3, cy - mot.R - 6], tb], { z0: bb - 2.2, z1: bb - 1.2 }));
  const solids = D.out();
  for (const s of solids) if (spun.some((q) => q.id === s.id)) s.spin = spin;
  ctx.add(solids);
  // the base: a slot along the pin's run
  const n = 16;
  const pts: Vec2[] = [];
  const xs = ctx.sampled.xfs.get(body) ?? [];
  const path = xs.map((X) => xf.apply(X, ref));
  const along = path.map((q) => v3.dot(v3.sub(q, mid), e));
  const a0 = Math.min(...along) - pinD / 2 - 1;
  const a1 = Math.max(...along) + pinD / 2 + 1;
  for (let k = 0; k <= n; k++) {
    const s = a0 + ((a1 - a0) * k) / n;
    const q = v3.add(mid, v3.mul(e, s));
    pts.push([q[0] + f[0] * (pinD / 2 + 1), q[1] + f[1] * (pinD / 2 + 1)]);
  }
  for (let k = n; k >= 0; k--) {
    const s = a0 + ((a1 - a0) * k) / n;
    const q = v3.add(mid, v3.mul(e, s));
    pts.push([q[0] - f[0] * (pinD / 2 + 1), q[1] - f[1] * (pinD / 2 + 1)]);
  }
  ctx.baseSlots.push(ccw(pts));
  void bt;
  void fromPlane;
  ctx.note({
    id: "drive",
    kit: "drive",
    at: [C[0], C[1], bb],
    title: "Drive",
    note: `A pin pressed into the ${titleOf(body).toLowerCase()} runs down through a slot in the base to a slotted yoke; a crank of ${r.toFixed(2)} mm throw on a gear motor that makes one turn per cycle drives the yoke (a Scotch yoke: the slide follows the driver's cosine law exactly). The motor hangs from the base on a plate and two standoffs; a home flag on the crank disc, a fork sensor on a standoff, terminals and a lead under the base.`,
    serves: { F10: ["drive-flag", "drive-sensor"] },
    badge: ["motor driven", "ok"],
  });
}

export type { Vec3 };
