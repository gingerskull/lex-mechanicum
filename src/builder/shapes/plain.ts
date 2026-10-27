// Plain bodies: a link (tapered, with an upper arm or an eccentric strap's ring), a plate (a spider, an outline, a
// rectangle), a straight or curved slotted link, a slider, a disc (an eccentric, a ring) and a shaft.
import { D2R, TAU, area, circle, roundRect, roundedPoly, slot, taper, type Vec2 } from "../../core/geom";
import { filletPoly, spokes } from "../../hardware/primitives";
import type { Profile } from "../../solids/types";
import { THICK } from "../constants";
import { type OutlineFn, hole, num, pair, rot, signedArea } from "./common";

const link: OutlineFn = (shape, pins, far) => {
  const L = num(shape.length, far);
  const [r0, r1] = pair(shape.boss, [8, 8]);
  // a link the record places itself (`place`) takes its own thickness (a Sarrus leaf, a governor's arm)
  const thick = typeof shape.place === "number" ? num(shape.thickness, THICK) : THICK;
  // a second arm on the same hub, `gap` above it (an output crank split round a bridge that carries its shaft)
  const up = shape.upper as Record<string, unknown> | undefined;
  if (up && typeof up === "object") {
    const L2 = num(up.length, L);
    const [q0, q1] = pair(up.boss, [r0, r1]);
    const a = num(up.angle, 180) * D2R;
    const gap = num(up.gap, 14);
    const arm = rot(taper(L2, q0, q1), a);
    const h2 = num(up.thick, THICK);
    return { profile: { outer: taper(L, r0, r1), holes: [] }, thick: THICK + gap + h2, approx: false, upper: { profile: { outer: arm, holes: [] }, h: h2, lift: THICK + gap, lower: THICK, name: "upper arm" } };
  }
  // a bore at its origin: an eccentric strap, a ring round its sheave with a slim rod to the far pin
  const bore = num(shape.bore, 0);
  if (bore > 0 && r0 > r1) return { profile: { outer: ringAndRod(L, r0, r1), holes: [circle(bore, 0, 0, 96).reverse()] }, thick: THICK, approx: false };
  return { profile: { outer: L > Math.abs(r0 - r1) + 1 ? taper(L, r0, r1) : circle(Math.max(r0, r1), 0, 0, 36), holes: [] }, thick, approx: false };
};

const plate: OutlineFn = (shape, pins) => {
  // a spider (a planet carrier): a hub and an arm out to each of the body's pins off its centre
  if (typeof shape.arms === "number") {
    const [hub, arm] = pair(shape.boss, [18, 10]);
    const ends = pins.filter((p) => Math.hypot(p[0], p[1]) > 1);
    return { profile: { outer: spider(ends, hub, arm), holes: [] }, thick: num(shape.thickness, 6), approx: false };
  }
  const pts = Array.isArray(shape.outline) ? (shape.outline as number[][]).map((q): Vec2 => [q[0]!, q[1]!]) : null;
  const r = num(shape.boss, 8.5);
  // `exact`: the outline as drawn (a T-shaped follower, a notched plate), its corners filleted; else rounded round its points
  if (pts && pts.length >= 3 && shape.exact === true) return { profile: { outer: filletPoly(area(pts) < 0 ? pts.slice().reverse() : pts, num(shape.fillet, 1.5)), holes: [] }, thick: num(shape.thickness, THICK), approx: false };
  if (pts && pts.length >= 2) return { profile: { outer: roundedPoly(pts, r), holes: [] }, thick: num(shape.thickness, THICK), approx: false };
  if (Array.isArray(shape.rect)) {
    const [w, h] = pair(shape.rect, [60, 40]);
    // from its corner at the frame origin, or about the point `center` of its frame
    const [cx, cy] = pair(shape.center, [w / 2, h / 2]);
    return { profile: { outer: roundRect(cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2, Math.min(8, w / 4, h / 4)), holes: [] }, thick: num(shape.thickness, 8), approx: false };
  }
  return null;
};

const slotLink: OutlineFn = (shape, _pins, far) => {
  const L = num(shape.length, far);
  const w = num(shape.width, 22);
  const sl = Array.isArray(shape.slot) ? pair(shape.slot, [L * 0.3, L * 0.7]) : [L * 0.25, L * 0.25 + num(shape.slot, L * 0.4)];
  // an arm back past the pivot (a slotted lever whose rod pin is behind its pivot)
  const back = -num(shape.arm, 0);
  return { profile: { outer: roundedPoly([[back, 0], [L, 0]], w / 2), holes: [slot(sl[0]!, sl[1]!, 0, num(shape.slotWidth, 12) / 2)] }, thick: THICK, approx: false };
};

const slider: OutlineFn = (shape) => {
  const L = num(shape.length, 36);
  const W = num(shape.width, 20);
  // centred on its joint, or starting at `from` along its x (a plunger whose pin is at its back end)
  const x0 = shape.from !== undefined ? num(shape.from, -L / 2) : -L / 2;
  return { profile: { outer: roundRect(x0, -W / 2, x0 + L, W / 2, Math.min(6, W / 2 - 0.5)), holes: [] }, thick: num(shape.thickness, 7), approx: false };
};

const disc: OutlineFn = (shape) => {
  const r = num(shape.radius, 20);
  // an eccentric: a disc whose centre stands `offset` off its shaft, toward the frame's x (its other joint)
  const c = typeof shape.offset === "number" ? ([shape.offset, 0] as [number, number]) : pair(shape.center, [0, 0]);
  const bore = num(shape.bore, 0);
  // a ring (`ring: { inner, spokes?, hub? }`): a rim, bare (a floating disc) or spoked to a hub on its shaft
  const ring = shape.ring as { inner?: unknown; spokes?: unknown; hub?: unknown } | undefined;
  if (ring && typeof ring === "object") {
    const inner = num(ring.inner, r * 0.6);
    const n = num(ring.spokes, 0);
    const cw = (h: Vec2[]): Vec2[] => (signedArea(h) > 0 ? [...h].reverse() : h);
    const holes = n > 0 ? [...spokes({ rIn: num(ring.hub, 14), rOut: inner, n, half: 5, fillet: 3 }).map(cw), ...(bore ? [hole(bore / 2)] : [])] : [circle(inner, 0, 0, Math.max(36, Math.round(inner * 3))).reverse()];
    return { profile: { outer: circle(r, c[0], c[1], Math.max(36, Math.round(r * 3))), holes }, thick: num(shape.thickness, 8), approx: false };
  }
  return { profile: { outer: circle(r, c[0], c[1], Math.max(36, Math.round(r * 3))), holes: bore ? [hole(bore / 2)] : [] }, thick: num(shape.thickness, 8), approx: false, ...(shape.exact === true ? { exact: true } : {}) };
};

const shaft: OutlineFn = (shape) => {
  const d = num(shape.diameter, 8);
  return { profile: { outer: circle(d / 2, 0, 0, 24), holes: [] }, thick: num(shape.length, 40), approx: false };
};

/** A `custom` shape's curved slot (`profile.slotArc`, an expansion link). */
const slotArcProfile: OutlineFn = (shape) => {
  const sa = (shape.profile as { slotArc?: Record<string, unknown> } | undefined)?.slotArc;
  if (sa) {
    const g = linkArc(sa, (shape.profile as { foot?: unknown }).foot, num(shape.thick, 10));
    return { profile: g.profile, thick: g.thick, approx: false, upper: g.upper };
  }
  return null;
};

/**
 * A hub of radius `hub` at the origin with an arm of half-width `arm` out to each end, rounded round each end: the
 * outline of the union, which is star-shaped about the origin, sampled along rays from it.
 */
export function spider(ends: Vec2[], hub: number, arm: number, n = 240): Vec2[] {
  const exitOf = (d: Vec2): number => {
    let t = hub;
    for (const e of ends) {
      const L = Math.hypot(e[0], e[1]);
      const u: Vec2 = [e[0] / L, e[1] / L];
      // the ray leaves the capsule [0, e] of radius arm at the largest t still within arm of the segment
      const inside = (s: number) => {
        const q: Vec2 = [s * d[0], s * d[1]];
        const k = Math.max(0, Math.min(L, q[0] * u[0] + q[1] * u[1]));
        return Math.hypot(q[0] - k * u[0], q[1] - k * u[1]) <= arm;
      };
      let lo = 0;
      let hi = L + arm;
      for (let i = 0; i < 40; i++) {
        const m = (lo + hi) / 2;
        if (inside(m)) lo = m;
        else hi = m;
      }
      t = Math.max(t, lo);
    }
    return t;
  };
  return Array.from({ length: n }, (_, i): Vec2 => {
    const a = (i * TAU) / n;
    const d: Vec2 = [Math.cos(a), Math.sin(a)];
    const t = exitOf(d);
    return [t * d[0], t * d[1]];
  });
}

/**
 * A curved slotted link (an expansion link): an arc band about `center` of radius `radius`, from `from` to `to` degrees
 * measured from the direction away from the centre through the frame origin (the link's trunnion, on the arc), the slot
 * `width` wide with a `wall` either side, round-ended; an ear out to the `foot` pin. Two cheeks: the lower one solid,
 * carrying the trunnion, the upper one slotted for the die, so the die runs in a groove over the trunnion.
 */
function linkArc(sa: Record<string, unknown>, foot: unknown, thick: number): { profile: Profile; thick: number; upper: { profile: Profile; h: number; name?: string } } {
  const [cx, cy] = pair(sa.center, [180, 0]);
  const R = num(sa.radius, 180);
  const w = num(sa.width, 15) / 2;
  const wall = num(sa.wall, 10);
  // angles about the centre, from the direction of the trunnion (the frame origin)
  const a0 = Math.atan2(-cy, -cx);
  const A0 = a0 + num(sa.from, -31) * D2R;
  const A1 = a0 + num(sa.to, 31) * D2R;
  const ft: Vec2 | null = Array.isArray(foot) && foot.length >= 2 ? [Number(foot[0]), Number(foot[1])] : null;
  const earR = 10;
  const band = (r0: number, r1: number, ear: boolean): Vec2[] => {
    const rc = (r1 - r0) / 2;
    const rm = (r0 + r1) / 2;
    const n = 120;
    const out: Vec2[] = [];
    // the outer arc, pushed out over the ear toward the foot
    const fr = ft ? Math.hypot(ft[0] - cx, ft[1] - cy) : 0;
    const fa = ft ? Math.atan2(ft[1] - cy, ft[0] - cx) : 0;
    for (let k = 0; k <= n; k++) {
      const t = A0 + ((A1 - A0) * k) / n;
      let r = r1;
      if (ear && ft) {
        const d = Math.sin(t - fa) * fr;
        if (Math.abs(d) < earR && Math.cos(t - fa) > 0) r = Math.max(r, fr * Math.cos(t - fa) + Math.sqrt(earR * earR - d * d));
      }
      out.push([cx + r * Math.cos(t), cy + r * Math.sin(t)]);
    }
    // round end at A1, the inner arc back, round end at A0
    for (let k = 1; k < 16; k++) {
      const t = A1 + (Math.PI * k) / 16;
      out.push([cx + rm * Math.cos(A1) + rc * Math.cos(t), cy + rm * Math.sin(A1) + rc * Math.sin(t)]);
    }
    for (let k = 0; k <= n; k++) {
      const t = A1 - ((A1 - A0) * k) / n;
      out.push([cx + r0 * Math.cos(t), cy + r0 * Math.sin(t)]);
    }
    for (let k = 1; k < 16; k++) {
      const t = A0 + Math.PI + (Math.PI * k) / 16;
      out.push([cx + rm * Math.cos(A0) + rc * Math.cos(t), cy + rm * Math.sin(A0) + rc * Math.sin(t)]);
    }
    return out;
  };
  const outer = band(R - w - wall, R + w + wall, true);
  // a hole winds clockwise
  const slotHole = band(R - w, R + w, false).reverse();
  // the lower cheek the thicker: it takes the trunnion's bearing and the clip recessed above it
  const h = Math.floor(thick * 0.45);
  return { profile: { outer, holes: [] }, thick, upper: { profile: { outer: band(R - w - wall, R + w + wall, false), holes: [slotHole] }, h, name: "slotted upper cheek" } };
}

/** A ring of radius r0 at the origin with a rod of half width r1 to a round end at L along x (counter-clockwise). */
function ringAndRod(L: number, r0: number, r1: number): Vec2[] {
  const a = Math.asin(r1 / r0);
  const out: Vec2[] = [];
  const n = 96;
  for (let k = 0; k <= n; k++) {
    const t = a + ((TAU - 2 * a) * k) / n;
    out.push([r0 * Math.cos(t), r0 * Math.sin(t)]);
  }
  for (let k = 0; k <= 16; k++) {
    const t = -Math.PI / 2 + (Math.PI * k) / 16;
    out.push([L + r1 * Math.cos(t), r1 * Math.sin(t)]);
  }
  return out;
}

export const PLAIN_OUTLINES: Record<string, OutlineFn> = { link, plate, slotLink, slider, disc, shaft };
export const PLAIN_PROFILES: OutlineFn[] = [slotArcProfile];
