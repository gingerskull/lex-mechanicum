// T9: the numbers a record's explanation states, `teaching.claims`, checked against the solved motion. Each claim names
// an output of the kin block and a statistic over the cycle of the primary driver:
//   range, max, min, mean  the spread, extremes and average of the output over the cycle;
//   ratio                  output change per input change (output turns per input turn, or the slope against a
//                          non-rotary input);
//   at                     the output where the input has the claim's `at` value: a driver value (degrees or mm) when
//                          it lies in the input's range, else a cycle angle in degrees;
//   phase                  the cycle angle, degrees, where the output reaches its max or min (`of`) or a dwell's start
//                          or end (`feature`);
//   dwell                  the longest span of the cycle, degrees, in which the output stays within `band` (default
//                          one thousandth of its range).
// A path's `range` is its extent, the longest chord between two of its points.
// A claim `over` a driver (a speed control) takes its statistic over that driver's range instead of the cycle. Outputs
// the library does not compute are reported as uncheckable, never as a mismatch.
import type { Kinematics } from "../kin/compose";
import type { Pose } from "../kin/types";

export interface Claim {
  text: string;
  output: string;
  stat: string;
  value: number;
  tol: number;
  at?: number;
  of?: string;
  feature?: string;
  band?: number | [number, number];
  over?: string;
  [k: string]: unknown;
}

export interface ClaimResult {
  claim: Claim;
  status: "ok" | "off" | "uncheckable";
  /** The value the solved motion gives. */
  got?: number;
  /** Why it could not be checked. */
  why?: string;
}

/** An angle series made continuous (no jump of 180 degrees or more between neighbours). */
function unwrap(xs: number[]): number[] {
  const out = [xs[0]!];
  for (let i = 1; i < xs.length; i++) {
    let d = xs[i]! - xs[i - 1]!;
    d -= 360 * Math.round(d / 360);
    out.push(out[i - 1]! + d);
  }
  return out;
}

interface Series {
  /** Cycle angle of each sample, degrees. */
  u: number[];
  /** Primary input value of each sample (degrees or mm). */
  x: number[];
  y: number[];
}

/** The longest cyclic window in which the series stays within `band`; its start, length (samples). */
function longestDwell(y: number[], band: number): { start: number; len: number } {
  const n = y.length;
  const d = y.concat(y);
  let best = { start: 0, len: 0 };
  // monotonic deques for the window's max and min
  const mx: number[] = [];
  const mn: number[] = [];
  let lo = 0;
  for (let hi = 0; hi < 2 * n; hi++) {
    while (mx.length && d[mx[mx.length - 1]!]! <= d[hi]!) mx.pop();
    mx.push(hi);
    while (mn.length && d[mn[mn.length - 1]!]! >= d[hi]!) mn.pop();
    mn.push(hi);
    while (d[mx[0]!]! - d[mn[0]!]! > band) {
      lo++;
      while (mx[0]! < lo) mx.shift();
      while (mn[0]! < lo) mn.shift();
    }
    const len = Math.min(hi - lo + 1, n);
    if (len > best.len) best = { start: lo % n, len };
  }
  return best;
}

/** Everything a claim needs of one output, from `samples` poses over the cycle at the record's own controls. */
function seriesOf(K: Kinematics, claim: Claim, outputs: { id: string; of: string; kind: string }[], poses: Pose[]): Series | string {
  const o = outputs.find((q) => q.id === claim.output);
  if (!o) return `no output ${claim.output}`;
  const drv = K.kin.drivers.find((d) => (claim.over ? d.id === claim.over : d.kind === "rotary" || d.kind === "oscillating" || d.kind === "linear" || d.kind === "manual"));
  if (!drv) return claim.over ? `claim over ${claim.over}: no such driver` : "no primary driver";
  const n = poses.length;
  const u = poses.map((_, i) => (i / n) * 360);
  const x = poses.map((p) => p.values[drv.id] ?? NaN);
  let y: number[];
  if (o.kind === "speed-ratio") {
    // the turn of the output body per turn of the input, from the series of its angle
    // the angle of `of`: an output or value of that name, else the body's own angle output
    const via = outputs.find((q) => q.of === o.of && q.kind === "angle")?.id;
    const angle = poses.map((p) => angleOf(p, o.of) ?? (via ? angleOf(p, via) : undefined));
    if (angle.some((a) => a === undefined)) return `output ${o.id}: no angle of ${o.of}`;
    const a = unwrap(angle as number[]);
    const xs = unwrap(x);
    y = a.map((_, i) => {
      const j = Math.min(i + 1, n - 1);
      const k = j === i ? i - 1 : i;
      const dX = xs[k + 1]! - xs[k]!;
      return dX ? (a[k + 1]! - a[k]!) / dX : NaN;
    });
  } else {
    const raw = poses.map((p) => p.outputs[o.id]);
    if (raw.some((v) => typeof v !== "number")) return o.kind === "path" ? "a path is not a number" : `output ${o.id} is not computed`;
    y = raw as number[];
    if (o.kind === "angle") y = unwrap(y);
  }
  if (y.some((v) => !Number.isFinite(v))) return `output ${o.id} is not finite`;
  return { u, x, y };
}

const angleOf = (p: Pose, id: string): number | undefined => (typeof p.outputs[id] === "number" ? (p.outputs[id] as number) : p.values[id]);

function evaluate(S: Series, c: Claim, rotary: boolean): number | string {
  const { y, u, x } = S;
  const n = y.length;
  const lo = Math.min(...y);
  const hi = Math.max(...y);
  switch (c.stat) {
    case "range":
      return hi - lo;
    case "max":
      return hi;
    case "min":
      return lo;
    case "mean":
      return y.reduce((a, b) => a + b, 0) / n;
    case "ratio": {
      if (rotary) return (y[n - 1]! - y[0]!) / (x[n - 1]! - x[0]!);
      // slope of output against input
      const mx = x.reduce((a, b) => a + b, 0) / n;
      const my = y.reduce((a, b) => a + b, 0) / n;
      let sxy = 0;
      let sxx = 0;
      for (let i = 0; i < n; i++) {
        sxy += (x[i]! - mx) * (y[i]! - my);
        sxx += (x[i]! - mx) ** 2;
      }
      return sxx ? sxy / sxx : "input does not move";
    }
    case "at": {
      if (c.at === undefined) return y[0]!;
      const target = c.at;
      const xlo = Math.min(...x);
      const xhi = Math.max(...x);
      // a value inside the input's range is a driver value, else a cycle angle
      const inRange = target >= xlo - 1e-9 && target <= xhi + 1e-9 && xhi - xlo < 359.5;
      const key = inRange ? x : u;
      const at = inRange ? target : ((target % 360) + 360) % 360;
      let best = -1;
      let bd = Infinity;
      for (let i = 0; i < n; i++) {
        const d = Math.abs(key[i]! - at);
        if (d < bd) {
          bd = d;
          best = i;
        }
      }
      if (best < 0) return "no sample";
      // interpolate between the neighbours bracketing the target on a monotone stretch
      const j = key[best]! < at ? (best + 1) % n : (best + n - 1) % n;
      const dk = key[j]! - key[best]!;
      if (!inRange && Math.abs(dk) > 180) return y[best]!;
      return Math.abs(dk) > 1e-12 && Math.sign(dk) === Math.sign(at - key[best]!) ? y[best]! + ((y[j]! - y[best]!) * (at - key[best]!)) / dk : y[best]!;
    }
    case "phase": {
      if (c.feature && /dwell/.test(c.feature)) {
        const d = longestDwell(y, typeof c.band === "number" ? c.band : (hi - lo) * 1e-3);
        if (d.len === 0) return "no dwell";
        return /end/.test(c.feature) ? ((d.start + d.len) % n * 360) / n : (d.start * 360) / n;
      }
      const want = c.of === "min" ? lo : hi;
      return u[y.findIndex((v) => Math.abs(v - want) < 1e-9 * (1 + Math.abs(want)))]!;
    }
    case "dwell": {
      // a band [lo, hi]: the longest stretch of the cycle with the output inside it (a port open while the swing is
      // in a range); a number: the longest stretch where the output holds within that much (a dwell)
      const bv: unknown = c.band;
      if (Array.isArray(bv) && bv.length === 2) {
        const [b0, b1] = [Math.min(bv[0] as number, bv[1] as number), Math.max(bv[0] as number, bv[1] as number)];
        const inside = y.map((v) => v >= b0 && v <= b1);
        if (inside.every(Boolean)) return 360;
        let best = 0;
        let run = 0;
        for (let i = 0; i < 2 * n; i++) {
          run = inside[i % n] ? run + 1 : 0;
          best = Math.max(best, Math.min(run, n));
        }
        return (best * 360) / n;
      }
      const band: number = typeof bv === "number" ? bv : (hi - lo) * 1e-3;
      return (longestDwell(y, band).len * 360) / n;
    }
    default:
      return `unknown stat ${c.stat}`;
  }
}

/** The claim table: every claim against the motion of `K`, over `samples` phases (default 720). */
export function checkClaims(K: Kinematics, claims: Claim[], outputs: { id: string; of: string; kind: string }[], opts: { samples?: number } = {}): ClaimResult[] {
  const n = opts.samples ?? 720;
  let poses: Pose[];
  try {
    poses = Array.from({ length: n }, (_, i) => K.pose((i / n) * Math.PI * 2));
  } catch (e) {
    return claims.map((claim) => ({ claim, status: "uncheckable", why: `does not solve: ${(e as Error).message}` }));
  }
  const rotary = K.kin.drivers.find((d) => d.kind === "rotary" || d.kind === "oscillating" || d.kind === "linear" || d.kind === "manual")?.kind === "rotary";
  // a claim `over` a driver sweeps that driver across its range with the cycle at its start (a speed control)
  const swept = new Map<string, Pose[] | string>();
  const sweep = (id: string): Pose[] | string => {
    const d = K.kin.drivers.find((q) => q.id === id);
    const r = d?.range ?? (d?.lo !== undefined && d?.hi !== undefined ? [d.lo, d.hi] : undefined);
    if (!d || !r) return `claim over ${id}: no driver with a range`;
    try {
      return Array.from({ length: n }, (_, i) => K.poseAt({ [id]: r[0] + ((r[1] - r[0]) * i) / (n - 1) }));
    } catch (e) {
      return `does not solve over ${id}: ${(e as Error).message}`;
    }
  };
  return claims.map((claim): ClaimResult => {
    let P: Pose[] | string = poses;
    if (claim.over) {
      if (!swept.has(claim.over)) swept.set(claim.over, sweep(claim.over));
      P = swept.get(claim.over)!;
      if (typeof P === "string") return { claim, status: "uncheckable", why: P };
    }
    // a path's range is its extent: the longest chord between two of its points (an orbit's diameter)
    const po = outputs.find((q) => q.id === claim.output);
    if (po?.kind === "path" && claim.stat === "range") {
      const pts = P.map((p) => p.outputs[po.id]).filter((v): v is [number, number, number] => Array.isArray(v));
      if (pts.length !== P.length) return { claim, status: "uncheckable", why: `output ${po.id} is not computed` };
      let got = 0;
      for (let a = 0; a < pts.length; a++) for (let b = a + 1; b < pts.length; b++) got = Math.max(got, Math.hypot(pts[a]![0] - pts[b]![0], pts[a]![1] - pts[b]![1], pts[a]![2] - pts[b]![2]));
      return { claim, status: Math.abs(got - claim.value) <= claim.tol ? "ok" : "off", got };
    }
    const S = seriesOf(K, claim, outputs, P);
    if (typeof S === "string") return { claim, status: "uncheckable", why: S };
    const v = evaluate(S, claim, rotary);
    if (typeof v === "string") return { claim, status: "uncheckable", why: v };
    return { claim, status: Math.abs(v - claim.value) <= claim.tol ? "ok" : "off", got: v };
  });
}

