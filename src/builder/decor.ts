// Decoration on a seasonal mechanism's scenery (standard P14, the catalogue's seasonal rules): fill patterns laid on a
// part's top face as marks, quilting tufted on a diamond grid or hatching ruled at an angle, clipped to the part's
// outline and its holes. The spacing is the style's (FORM.decor); the marks draw as fine ink lines (src/render) and sit
// on the first rung of the detail ladder, so they drop first on a slow device.
import type { Vec2 } from "../core/geom";
import { FORM } from "../style/form";
import type { Mark, Profile } from "../solids/types";
import { inside } from "../core/poly";

export type PatternKind = keyof typeof FORM.decor;

/** True when q lies on an edge of the profile's rings (within a micrometre). */
function onEdge(profile: Profile, q: Vec2): boolean {
  for (const ring of [profile.outer, ...profile.holes])
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i]!;
      const b = ring[(i + 1) % ring.length]!;
      const e: Vec2 = [b[0] - a[0], b[1] - a[1]];
      const L2 = e[0] * e[0] + e[1] * e[1] || 1;
      const t = Math.max(0, Math.min(1, ((q[0] - a[0]) * e[0] + (q[1] - a[1]) * e[1]) / L2));
      if (Math.hypot(a[0] + e[0] * t - q[0], a[1] + e[1] * t - q[1]) < 1e-6) return true;
    }
  return false;
}

/** The stretches of the line p + t d (t over the reals) inside the profile (its outline less its holes), as [t0, t1]. */
export function insideRuns(profile: Profile, p: Vec2, d: Vec2): [number, number][] {
  const ts: number[] = [];
  for (const ring of [profile.outer, ...profile.holes]) {
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i]!;
      const b = ring[(i + 1) % ring.length]!;
      const e: Vec2 = [b[0] - a[0], b[1] - a[1]];
      const den = d[0] * e[1] - d[1] * e[0];
      if (Math.abs(den) < 1e-12) continue;
      const w: Vec2 = [a[0] - p[0], a[1] - p[1]];
      const t = (w[0] * e[1] - w[1] * e[0]) / den;
      const s = (w[0] * d[1] - w[1] * d[0]) / den;
      if (s >= -1e-9 && s <= 1 + 1e-9) ts.push(t);
    }
  }
  ts.sort((x, y) => x - y);
  // each stretch between neighbouring crossings is in or out as a whole: its midpoint says which (a line through a
  // vertex or along a tangent is decided the same way)
  const solid = (q: Vec2) => inside(profile.outer, q) && !profile.holes.some((h) => inside(h, q));
  const runs: [number, number][] = [];
  for (let i = 0; i + 1 < ts.length; i++) {
    const t0 = ts[i]!;
    const t1 = ts[i + 1]!;
    if (t1 - t0 < 1e-6) continue;
    const m = (t0 + t1) / 2;
    const q: Vec2 = [p[0] + d[0] * m, p[1] + d[1] * m];
    // a stretch along an edge of the outline or a hole lies on its boundary, not on the part
    if (!solid(q) || onEdge(profile, q)) continue;
    const last = runs[runs.length - 1];
    if (last && Math.abs(last[1] - t0) < 1e-6) last[1] = t1;
    else runs.push([t0, t1]);
  }
  return runs;
}

/**
 * The pattern's lines on a profile, in its coordinates: one family at `angle` (hatching) or two at ±`angle` (quilting),
 * `pitch` apart, each cut to the profile less `inset` mm at its ends. Options override the style's values.
 */
export function patternMarks(profile: Profile, kind: PatternKind, o: { pitch?: number; angle?: number; inset?: number } = {}): Mark[] {
  const st = FORM.decor[kind];
  const pitch = o.pitch ?? st.pitch;
  const angle = o.angle ?? st.angle;
  const inset = o.inset ?? 0;
  const pts = profile.outer;
  const cx = pts.reduce((s, q) => s + q[0], 0) / pts.length;
  const cy = pts.reduce((s, q) => s + q[1], 0) / pts.length;
  const R = Math.max(...pts.map((q) => Math.hypot(q[0] - cx, q[1] - cy))) + pitch;
  const out: Mark[] = [];
  for (const a of kind === "quilt" ? [angle, -angle] : [angle]) {
    const r = (a * Math.PI) / 180;
    const d: Vec2 = [Math.cos(r), Math.sin(r)];
    const n: Vec2 = [-d[1], d[0]];
    for (let k = -Math.floor(R / pitch); k * pitch <= R; k++) {
      const p: Vec2 = [cx + n[0] * k * pitch, cy + n[1] * k * pitch];
      for (const [t0, t1] of insideRuns(profile, p, d)) {
        if (t1 - t0 <= 2 * inset + 0.5) continue;
        out.push({ kind: "quilt", pts: [[p[0] + d[0] * (t0 + inset), p[1] + d[1] * (t0 + inset)], [p[0] + d[0] * (t1 - inset), p[1] + d[1] * (t1 - inset)]] });
      }
    }
  }
  return out;
}

/**
 * A turned leg's half section [r, z] for a revolve, from its foot (z = 0) to its top (z = h), largest radius r: a foot
 * and a bead, a long shaft, a collar and a block under the top. The proportions are fixed; the shaft takes the height.
 */
export function turnedLeg(h: number, r: number): Vec2[] {
  const k = r / 7.2;
  const s = (z: number) => Math.max(0, Math.min(h, z));
  return [[0, 0], [6 * k, 0], [6 * k, s(3)], [r, s(4.5)], [r, s(8)], [4.2 * k, s(9.5)], [3.4 * k, s(13)], [4.8 * k, s(15.5)], [6.4 * k, s(18.5)], [6.4 * k, s(h - 9)], [4.6 * k, s(h - 7)], [3.6 * k, s(h - 4.5)], [6.8 * k, s(h - 2.5)], [6.8 * k, h], [0, h]];
}
