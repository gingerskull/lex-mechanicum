// A1, A2: reads the model once and classifies every joint by type. Pins: which parts each joins, in what order up the
// stack, bored, keyed or slotted; slides: rails and the block between them; meshes: gear pairs at their centre
// distance; cams: declared by the model.
import { TAU, bbox, type Vec2 } from "../core/geom";
import { edgeDist, inside, toLocal } from "../core/poly";
import { BORES, bearingFor } from "../hardware/tables";
import { poseOf } from "../model/pose";
import type { Part } from "../model/types";
import { heights } from "../parts";
import type { Joined, JointInfo, MeshJoint, PinJoint, Rule, RuleContext, SlideJoint } from "./types";

const pinLabel = (p: Part) => p.id.replace(/^p(?=[A-Z0-9])/, "").replace(/^pin-?/i, "") || p.id;

function pinJoint(ctx: RuleContext, c: Part): PinJoint | null {
  const pose = poseOf(c, ctx.s0);
  if (!pose) return null;
  const P: Vec2 = [pose[0], pose[1]];
  const [zlo, zhi] = heights(c);
  const capR = Math.max(...c.shape.outer.map((q) => Math.hypot(q[0], q[1])));
  const joined: Joined[] = [];
  for (const p of ctx.model.parts) {
    if (p.role === "pin" || p.role === "trace") continue;
    const [z0, z1] = heights(p);
    if (!(z1 > zlo + 0.1 && z0 < zhi - 0.1)) continue;
    const q = poseOf(p, ctx.s0);
    if (!q) continue;
    const L = toLocal(q, P);
    if (!inside(p.shape.outer, L)) continue;
    const R = edgeDist(p.shape.outer, L);
    const hi = p.shape.holes.findIndex((h) => inside(h, L));
    const base = { part: p, L, R, z0, z1, moving: !p.fixed };
    if (hi < 0) {
      joined.push({ ...base, how: "bore" });
      continue;
    }
    const [x0, y0, x1, y1] = bbox(p.shape.holes[hi]!);
    const w = x1 - x0;
    const h = y1 - y0;
    const centred = Math.hypot((x0 + x1) / 2 - L[0], (y0 + y1) / 2 - L[1]) < 1.6;
    if (centred && Math.max(w, h) / Math.min(w, h) < 1.3) joined.push({ ...base, how: "keyed", bore: Math.max(w, h) });
    // a big opening round the pin (ring gear, hub bore) is not a joint
    else if (Math.min(w, h) <= 4 * capR) joined.push({ ...base, how: "slot", slotW: Math.min(w, h), hole: hi });
  }
  if (!joined.length) return null;
  joined.sort((a, b) => a.z0 - b.z0);
  const fixed = !!c.fixed;
  const moving = joined.filter((j) => j.moving);
  const keyed = moving.filter((j) => j.how === "keyed");
  const bored = moving.filter((j) => j.how === "bore");
  const live = fixed && (!!c.accent || keyed.length > 0) && (keyed.length > 0 || bored.length > 0);
  let driven: Joined[] = [];
  if (live) driven = keyed.length ? keyed : bored.slice(0, 1);
  else if (!fixed) driven = keyed.length ? [keyed[0]!] : bored.slice(0, 1);
  const anchor = driven[0] ?? null;
  const slots = joined.filter((j) => j.how === "slot");
  const turning = moving.filter((j) => j.how === "bore" && !driven.includes(j));

  // A3: the largest catalogue bore every boss on the joint can take
  let d: number;
  if (keyed.length) d = BORES.find((dd) => dd <= keyed[0]!.bore! * 0.84 + 0.01) ?? 3;
  else {
    const dMax = Math.max(live ? 8 : 4, Math.round(capR * 1.45));
    const dMin = live ? 6 : 3;
    d =
      BORES.find(
        (dd) =>
          dd <= dMax &&
          dd >= dMin &&
          turning.every((j) => bearingFor(dd, j.R, j.z1 - j.z0)) &&
          (!anchor || anchor.R >= dd / 2 + 2.5) &&
          slots.every((j) => j.slotW! - dd >= 4),
      ) ??
      BORES.find((dd) => dd <= dMax && slots.every((j) => j.slotW! - dd >= 3) && (!anchor || anchor.R >= dd / 2 + 2)) ??
      3;
  }
  const body = live ? (anchor?.part.id ?? "ground") : fixed ? "ground" : (anchor?.part.id ?? c.id);
  const at: [number, number, number] = body === "ground" ? [P[0], P[1], 0] : anchor ? [anchor.L[0], anchor.L[1], 0] : [0, 0, 0];
  const type = live ? "J2" : slots.length ? "J4" : fixed ? "J1" : "J3";
  return { kind: "pin", id: c.id, type, pin: c, P, fixed, live, joined, driven, anchor, d, body, at };
}

function slides(ctx: RuleContext): SlideJoint[] {
  const out: SlideJoint[] = [];
  const rails = ctx.model.parts.filter((p) => p.fixed && p.role === "ground" && /a$/.test(p.id));
  for (const a of rails) {
    const b = ctx.model.parts.find((p) => p.id === a.id.slice(0, -1) + "b" && p.fixed);
    if (!b || Math.abs(a.fixed![2] - b.fixed![2]) > 1e-6) continue;
    const ang = a.fixed![2];
    const axis: Vec2 = [Math.cos(ang), Math.sin(ang)];
    const [bx0, , bx1] = bbox(a.shape.outer);
    const yA = toLocal(b.fixed!, [a.fixed![0], a.fixed![1]])[1];
    const slider = ctx.model.parts.find((p) => {
      if (p.fixed || p.role === "pin" || p.role === "trace") return false;
      const q = poseOf(p, ctx.s0);
      if (!q || Math.abs(Math.sin(q[2] - ang)) > 1e-6) return false;
      const l = toLocal(b.fixed!, [q[0], q[1]]);
      return l[0] >= bx0 - 1 && l[0] <= bx1 + 1 && l[1] * Math.sign(yA) > 0 && Math.abs(l[1]) < Math.abs(yA);
    });
    if (!slider) continue;
    let lo = Infinity;
    let hi = -Infinity;
    for (let i = 0; i < 72; i++) {
      const q = poseOf(slider, ctx.model.solve((i / 72) * TAU));
      if (!q) continue;
      const t = q[0] * axis[0] + q[1] * axis[1];
      lo = Math.min(lo, t);
      hi = Math.max(hi, t);
    }
    out.push({ kind: "slide", id: `slide-${slider.id}`, type: "J5", rails: [a, b], slider, axis, range: [lo, hi] });
  }
  return out;
}

function meshes(ctx: RuleContext): MeshJoint[] {
  const out: MeshJoint[] = [];
  const geared = ctx.model.parts.filter((p) => p.m !== undefined);
  const at = (p: Part): Vec2 | null => {
    const q = poseOf(p, ctx.s0);
    return q ? [q[0], q[1]] : null;
  };
  for (let i = 0; i < geared.length; i++)
    for (let j = i + 1; j < geared.length; j++) {
      const a = geared[i]!;
      const b = geared[j]!;
      if (a.m !== b.m || Math.abs(heights(a)[0] - heights(b)[0]) > 0.1) continue;
      const m = a.m!;
      const A = at(a);
      const B = at(b);
      if (!A || !B) continue;
      const c = Math.hypot(B[0] - A[0], B[1] - A[1]);
      const ringA = a.shape.holes.length > 0 && a.z !== undefined && a.shape.holes[0]!.length > 60;
      if (a.z !== undefined && b.z !== undefined) {
        const ra = (m * a.z) / 2;
        const rb = (m * b.z) / 2;
        const ext = Math.abs(c - (ra + rb)) < 0.05 * m;
        const int = Math.abs(c - Math.abs(ra - rb)) < 0.05 * m && c > 1e-6;
        if (!ext && !int) continue;
        const u: Vec2 = [(B[0] - A[0]) / c, (B[1] - A[1]) / c];
        const s = ext ? ra : ringA ? -ra : ra;
        out.push({ kind: "mesh", id: `mesh-${a.id}-${b.id}`, type: "J6", a, b, form: ext ? "external" : "internal", at: [A[0] + u[0] * s, A[1] + u[1] * s] });
      } else {
        // rack and pinion: the pinion centre sits one pitch radius off the rack's pitch line
        const [rack, pin] = a.z === undefined ? [a, b] : [b, a];
        if (pin.z === undefined) continue;
        const qr = poseOf(rack, ctx.s0);
        const P = at(pin);
        if (!qr || !P) continue;
        const l = toLocal(qr, P);
        if (Math.abs(l[1] - (m * pin.z) / 2) > 0.05 * m) continue;
        const c2 = Math.cos(qr[2]);
        const s2 = Math.sin(qr[2]);
        out.push({ kind: "mesh", id: `mesh-${rack.id}-${pin.id}`, type: "J6", a: rack, b: pin, form: "rack", at: [P[0] + s2 * ((m * pin.z) / 2), P[1] - c2 * ((m * pin.z) / 2)] });
      }
    }
  return out;
}

export const classify: Rule = {
  id: "classify",
  tier: "AUTO",
  ids: ["A1", "A2", "A3"],
  applies: () => true,
  apply(ctx) {
    const info: JointInfo[] = [];
    for (const c of ctx.model.parts.filter((p) => p.role === "pin")) {
      const j = pinJoint(ctx, c);
      if (j) info.push(j);
    }
    info.push(...slides(ctx), ...meshes(ctx));
    for (const k of ctx.model.cams ?? []) {
      const cam = ctx.parts[k.cam];
      const follower = ctx.parts[k.follower];
      if (cam && follower) info.push({ kind: "cam", id: `cam-${cam.id}`, type: "J7", cam, follower });
    }
    ctx.info = info;
    for (const j of info) {
      const at: Vec2 =
        j.kind === "pin" ? j.P : j.kind === "mesh" ? j.at : (() => {
          const q = poseOf(j.kind === "slide" ? j.slider : j.cam, ctx.s0);
          return q ? [q[0], q[1]] : [0, 0];
        })();
      const title =
        j.kind === "pin"
          ? `${pinLabel(j.pin)} · ${j.live ? (j.pin.accent ? "Input" : "Shaft") : j.fixed ? "Pivot" : j.type === "J4" ? "Roller" : "Pin"}`
          : j.kind === "slide"
            ? `Slide · ${ctx.solidOf[j.slider.id]?.name ?? j.slider.id}`
            : j.kind === "mesh"
              ? `Mesh · ${j.a.id} and ${j.b.id}`
              : `Cam · ${j.cam.id}`;
      ctx.joints.push({ id: j.id, type: j.type, at, title, note: "", serves: {}, ...(j.kind === "pin" ? { d: j.d } : {}) });
      for (const p of j.kind === "pin" ? j.joined.map((x) => x.part) : j.kind === "slide" ? [...j.rails, j.slider] : j.kind === "mesh" ? [j.a, j.b] : [j.cam, j.follower])
        ctx.solidOf[p.id]?.joints.push(j.id);
    }
  },
};
