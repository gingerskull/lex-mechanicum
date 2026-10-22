// Cam block: a motion law (rise, dwell, return, dwell), the follower kinds and the pressure angle.
import { TAU } from "../math";

export type CamLaw = "cycloidal" | "harmonic" | "poly345" | "uniform" | "modsine";

/** Normalised law on x in 0..1: displacement s, and ds/dx, d²s/dx². */
export function lawRise(law: CamLaw, x: number): { s: number; v: number; a: number } {
  const t = Math.min(1, Math.max(0, x));
  switch (law) {
    case "cycloidal":
      return { s: t - Math.sin(TAU * t) / TAU, v: 1 - Math.cos(TAU * t), a: TAU * Math.sin(TAU * t) };
    case "harmonic":
      return { s: (1 - Math.cos(Math.PI * t)) / 2, v: (Math.PI / 2) * Math.sin(Math.PI * t), a: (Math.PI * Math.PI / 2) * Math.cos(Math.PI * t) };
    case "poly345":
      return { s: 10 * t ** 3 - 15 * t ** 4 + 6 * t ** 5, v: 30 * t ** 2 - 60 * t ** 3 + 30 * t ** 4, a: 60 * t - 180 * t ** 2 + 120 * t ** 3 };
    case "uniform":
      return { s: t, v: 1, a: 0 };
    case "modsine": {
      // modified sine (Cv 1.76): sine acceleration over the first and last eighths, a long sine between
      const k = Math.PI + 4;
      if (t <= 1 / 8) return { s: (Math.PI * t - 0.25 * Math.sin(4 * Math.PI * t)) / k, v: (Math.PI - Math.PI * Math.cos(4 * Math.PI * t)) / k, a: (4 * Math.PI * Math.PI * Math.sin(4 * Math.PI * t)) / k };
      if (t <= 7 / 8) return { s: (2 + Math.PI * t - 2.25 * Math.sin((Math.PI / 3) * (1 + 4 * t))) / k, v: (Math.PI - 3 * Math.PI * Math.cos((Math.PI / 3) * (1 + 4 * t))) / k, a: (4 * Math.PI * Math.PI * Math.sin((Math.PI / 3) * (1 + 4 * t))) / k };
      return { s: (4 + Math.PI * t - 0.25 * Math.sin(4 * Math.PI * t)) / k, v: (Math.PI - Math.PI * Math.cos(4 * Math.PI * t)) / k, a: (4 * Math.PI * Math.PI * Math.sin(4 * Math.PI * t)) / k };
    }
  }
}

export interface CamSegment {
  kind: "rise" | "return" | "dwell";
  /** Angle span, radians. */
  span: number;
  law?: CamLaw;
}

export interface CamSchedule {
  segments: CamSegment[];
  /** Total lift, mm (or radians for an oscillating follower). */
  lift: number;
}

/** Follower displacement s and ds/dθ at cam angle θ (periodic). The schedule's spans must sum to 2π. */
export function camMotion(c: CamSchedule, theta: number): { s: number; v: number } {
  let a = ((theta % TAU) + TAU) % TAU;
  let level = 0; // normalised level at the segment start
  for (const seg of c.segments) {
    if (a <= seg.span || seg === c.segments[c.segments.length - 1]) {
      const x = seg.span > 0 ? a / seg.span : 0;
      if (seg.kind === "dwell") return { s: level * c.lift, v: 0 };
      const r = lawRise(seg.law ?? "cycloidal", x);
      if (seg.kind === "rise") return { s: (level + r.s) * c.lift, v: (r.v / seg.span) * c.lift };
      return { s: (level - r.s) * c.lift, v: (-r.v / seg.span) * c.lift };
    }
    a -= seg.span;
    if (seg.kind === "rise") level += 1;
    else if (seg.kind === "return") level -= 1;
  }
  return { s: level * c.lift, v: 0 };
}

export interface FollowerGeometry {
  /** Base circle radius (flat) or prime circle radius (roller: base + roller radius), mm. */
  rb: number;
  /** Offset of the follower line from the cam centre, mm. */
  e?: number;
}

/** Pressure angle of a translating roller follower: tan φ = (ds/dθ − e) / (√(rp² − e²) + s). */
export function pressureAngle(g: FollowerGeometry, s: number, v: number): number {
  const e = g.e ?? 0;
  return Math.atan2(v - e, Math.sqrt(Math.max(0, g.rb * g.rb - e * e)) + s);
}

/** Flat-faced translating follower: contact lies ds/dθ off the follower line, the pressure angle is 0. */
export const flatContactOffset = (v: number): number => v;

/** Pitch-curve point of a translating roller follower in the cam's frame at cam angle θ (follower on +x at offset e). */
export function pitchPoint(g: FollowerGeometry, s: number, theta: number): [number, number] {
  const e = g.e ?? 0;
  const x = Math.sqrt(Math.max(0, g.rb * g.rb - e * e)) + s;
  const c = Math.cos(-theta);
  const sn = Math.sin(-theta);
  return [x * c - e * sn, x * sn + e * c];
}
