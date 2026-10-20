// Numeric fallback: Gauss–Newton with damping on the joint residuals of the bodies that no block solved.
// It continues from a warm start (the previous pose), so the branch is the one it was on.
import { type Vec3, m3, v3, xf, type Xf } from "./math";
import { jointResidual, type ResolvedJoint } from "./residual";

type Poses = Map<string, Xf>;

function solveLinear(A: number[][], b: number[]): number[] | null {
  const n = b.length;
  const M = A.map((r, i) => [...r, b[i]!]);
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(M[r]![c]!) > Math.abs(M[p]![c]!)) p = r;
    if (Math.abs(M[p]![c]!) < 1e-14) return null;
    [M[c], M[p]] = [M[p]!, M[c]!];
    for (let r = c + 1; r < n; r++) {
      const f = M[r]![c]! / M[c]![c]!;
      for (let k = c; k <= n; k++) M[r]![k]! -= f * M[c]![k]!;
    }
  }
  const x = new Array<number>(n).fill(0);
  for (let r = n - 1; r >= 0; r--) {
    let s = M[r]![n]!;
    for (let k = r + 1; k < n; k++) s -= M[r]![k]! * x[k]!;
    x[r] = s / M[r]![r]!;
  }
  return x;
}

const applyDelta = (X: Xf, d: number[]): Xf => {
  const w: Vec3 = [d[0]!, d[1]!, d[2]!];
  const ang = v3.len(w);
  const R = ang < 1e-15 ? X.R : m3.mul(m3.axisAngle(w, ang), X.R);
  return { R, t: [X.t[0] + d[3]!, X.t[1] + d[4]!, X.t[2] + d[5]!] };
};

export interface NumericResult {
  poses: Poses;
  residual: number;
  iterations: number;
}

/**
 * Solve the poses of `unknown` bodies so that every joint touching them closes, the others held at `known`.
 * `start` gives the warm start (identity where missing).
 */
export function solveNumeric(
  joints: ResolvedJoint[],
  unknown: string[],
  known: Poses,
  start: Poses,
  driverValue: (id: string) => number | undefined,
  tol = 1e-12,
): NumericResult {
  const cur: Poses = new Map(known);
  for (const b of unknown) cur.set(b, start.get(b) ?? xf.id());
  const rel = joints.filter((r) => unknown.includes(r.joint.a) || unknown.includes(r.joint.b));
  const residual = (P: Poses): number[] => {
    const out: number[] = [];
    for (const r of rel) out.push(...jointResidual(r, P.get(r.joint.a) ?? xf.id(), P.get(r.joint.b) ?? xf.id(), driverValue));
    return out;
  };
  const norm = (v: number[]) => Math.max(0, ...v.map(Math.abs));
  let res = residual(cur);
  let lambda = 1e-6;
  let it = 0;
  const n = unknown.length * 6;
  for (; it < 80 && norm(res) > tol; it++) {
    // numeric Jacobian
    const J: number[][] = res.map(() => new Array<number>(n).fill(0));
    for (let k = 0; k < n; k++) {
      const body = unknown[Math.floor(k / 6)]!;
      const comp = k % 6;
      const h = 1e-6;
      const dp = new Array<number>(6).fill(0);
      dp[comp] = h;
      const dm = new Array<number>(6).fill(0);
      dm[comp] = -h;
      const base = cur.get(body)!;
      const P1 = new Map(cur).set(body, applyDelta(base, dp));
      const P2 = new Map(cur).set(body, applyDelta(base, dm));
      const r1 = residual(P1);
      const r2 = residual(P2);
      for (let i = 0; i < res.length; i++) J[i]![k] = (r1[i]! - r2[i]!) / (2 * h);
    }
    const JtJ: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(0));
    const Jtr = new Array<number>(n).fill(0);
    for (let i = 0; i < res.length; i++)
      for (let a = 0; a < n; a++) {
        Jtr[a]! += J[i]![a]! * res[i]!;
        for (let b = 0; b < n; b++) JtJ[a]![b]! += J[i]![a]! * J[i]![b]!;
      }
    let improved = false;
    for (let tryN = 0; tryN < 12 && !improved; tryN++) {
      const A = JtJ.map((r, i) => r.map((v, j) => (i === j ? v + lambda * (1 + v) : v)));
      const dx = solveLinear(A, Jtr.map((v) => -v));
      if (dx) {
        const next: Poses = new Map(cur);
        unknown.forEach((b, bi) => next.set(b, applyDelta(cur.get(b)!, dx.slice(bi * 6, bi * 6 + 6))));
        const r2 = residual(next);
        if (norm(r2) < norm(res)) {
          cur.clear();
          next.forEach((v, k) => cur.set(k, v));
          res = r2;
          lambda = Math.max(1e-12, lambda / 5);
          improved = true;
          continue;
        }
      }
      lambda *= 10;
    }
    if (!improved) break;
  }
  const poses: Poses = new Map();
  for (const b of unknown) poses.set(b, cur.get(b)!);
  return { poses, residual: norm(res), iterations: it };
}
