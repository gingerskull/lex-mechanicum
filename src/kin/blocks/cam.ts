// Cam block: a motion law (rise, dwell, return, dwell), the follower kinds and the pressure angle.
import { TAU } from "../math";

export type CamLaw = "cycloidal" | "harmonic" | "poly345" | "uniform" | "modsine" | "trapezoidal";

/**
 * Normalised law on x in 0..1: displacement s, and ds/dx, d²s/dx². `blend` is the share of the segment at each end
 * that the trapezoidal law spends speeding up and slowing down (default 0.25).
 */
export function lawRise(law: CamLaw, x: number, blend = 0.25): { s: number; v: number; a: number } {
  const t = Math.min(1, Math.max(0, x));
  switch (law) {
    case "trapezoidal": {
      // constant speed with parabolic blends (a trapezoid of speed): it starts and ends at rest, so a rise followed by
      // a return turns round with no jump in speed; between the blends the speed is uniform, V = 1 / (1 − b)
      const b = Math.min(0.5, Math.max(1e-6, blend));
      const V = 1 / (1 - b);
      if (t < b) return { s: (V * t * t) / (2 * b), v: (V * t) / b, a: V / b };
      if (t > 1 - b) {
        const r = 1 - t;
        return { s: 1 - (V * r * r) / (2 * b), v: (V * r) / b, a: -V / b };
      }
      return { s: V * (t - b / 2), v: V, a: 0 };
    }
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
  /** The trapezoidal law's blend share at each end of the segment (0 to 0.5). */
  blend?: number;
}

export interface CamSchedule {
  segments: CamSegment[];
  /** Total lift, mm (or radians for an oscillating follower). */
  lift: number;
  /**
   * The cam angle after which the schedule repeats, radians (default 2π). A track of several turns (a self-reversing
   * screw's groove, there and back over several turns of the shaft) repeats after that many turns.
   */
  period?: number;
}

/**
 * A cam-contact joint's schedule with its numbers bound: spans in degrees to radians, the law (`lawOf` maps the
 * record's name), the trapezoidal blend where a segment gives one and the period where the joint gives `turns`.
 */
export function scheduleOf(
  cam: { schedule: { kind: "rise" | "return" | "dwell"; span: unknown; law?: string; blend?: unknown }[]; lift: unknown; turns?: unknown },
  num: (v: unknown) => number,
  lawOf: (l: string | undefined) => CamLaw,
): CamSchedule {
  const D2R = Math.PI / 180;
  const sched: CamSchedule = {
    lift: num(cam.lift),
    segments: cam.schedule.map((g) => ({ kind: g.kind, span: num(g.span) * D2R, law: lawOf(g.law), ...(g.blend !== undefined ? { blend: num(g.blend) } : {}) })),
  };
  if (cam.turns !== undefined) sched.period = num(cam.turns) * TAU;
  return sched;
}

/** Turns of the cam per repeat of its schedule (1 unless the schedule gives a longer period). */
export const camTurns = (c: CamSchedule): number => Math.max(1, Math.round((c.period ?? TAU) / TAU));

/**
 * Follower displacement s and ds/dθ at cam angle θ (periodic). The schedule's spans must sum to its period (2π unless
 * it says otherwise).
 */
export function camMotion(c: CamSchedule, theta: number): { s: number; v: number } {
  const P = c.period ?? TAU;
  let a = ((theta % P) + P) % P;
  let level = 0; // normalised level at the segment start
  for (const seg of c.segments) {
    if (a <= seg.span || seg === c.segments[c.segments.length - 1]) {
      const x = seg.span > 0 ? a / seg.span : 0;
      if (seg.kind === "dwell") return { s: level * c.lift, v: 0 };
      const r = seg.blend === undefined ? lawRise(seg.law ?? "cycloidal", x) : lawRise(seg.law ?? "cycloidal", x, seg.blend);
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
