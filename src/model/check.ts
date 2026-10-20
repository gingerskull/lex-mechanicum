// Headless kinematic checks (standard K1, K2, K5): rigidity, continuity, periodicity, pin joins, interference, and the
// axes of parts standing out of the plan plane (src/core/axis.ts).
import { boxOf, isOut, planCorners } from "../core/axis";
import { TAU, xf } from "../core/geom";
import { poseOf } from "./pose";
import type { MechanismModel, Part, Pose, Solved, Vec2 } from "./types";

export type FindingType = "MISSING" | "NaN" | "LINK_LEN" | "POSE_JUMP" | "INTERFERE" | "OVERLAP" | "WARN" | "PERIODICITY" | "AXIS";

/**
 * The joint types that may join two parts of different axes (a crossed-axis mesh, a screw). A declared joint between
 * parts of different axes whose type is not listed is an AXIS finding.
 */
export const MIXED_AXIS_JOINTS: readonly string[] = ["J9", "J11"];

const axisOf = (p: Part) => p.axis ?? "z";

export interface Finding {
  type: FindingType;
  part?: string;
  detail: string;
}

export interface CheckReport {
  id: string;
  n: number;
  findings: Finding[];
  /** Largest |solved length − modelled length| over every link with `len` and `between`, mm. */
  maxLinkErr: number;
  /** Largest step of each solved point between neighbouring samples, mm. */
  maxStep: Record<string, number>;
  /** Bodies each pin or tracer joins: rigidly ("rocker@0") or sliding in a slot ("yoke@1(slot)"). */
  joins: Record<string, string[]>;
  /** Swept envelope [width, height] of every part over the cycle, mm. */
  boundsSize: [number, number];
}

const LINK_TOL = 1e-6;
const PERIOD_TOL = 1e-6;
/** A pose step above this (mm, or radians × 30) between neighbouring samples is a jump. */
const JUMP = 8;
/** Same-layer overlap tolerance, mm. */
const OVERLAP_TOL = 0.3;

const toLocal = (q: Vec2 | Pose, [x, y, a]: Pose): Vec2 => {
  const dx = q[0] - x;
  const dy = q[1] - y;
  const c = Math.cos(a);
  const s = Math.sin(a);
  return [dx * c + dy * s, -dx * s + dy * c];
};

function inPoly(q: Vec2, P: Vec2[]): boolean {
  let c = false;
  for (let i = 0, j = P.length - 1; i < P.length; j = i++) {
    const a = P[i]!;
    const b = P[j]!;
    if (a[1] > q[1] !== b[1] > q[1] && q[0] < ((b[0] - a[0]) * (q[1] - a[1])) / (b[1] - a[1]) + a[0]) c = !c;
  }
  return c;
}

function segD(q: Vec2, a: Vec2, b: Vec2): number {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const L2 = dx * dx + dy * dy || 1;
  const t = Math.max(0, Math.min(1, ((q[0] - a[0]) * dx + (q[1] - a[1]) * dy) / L2));
  return Math.hypot(q[0] - a[0] - t * dx, q[1] - a[1] - t * dy);
}

function polyD(q: Vec2, P: Vec2[]): number {
  let d = Infinity;
  for (let i = 0; i < P.length; i++) d = Math.min(d, segD(q, P[i]!, P[(i + 1) % P.length]!));
  return d;
}

/** Samples n + 1 phases over one cycle (both ends) and checks the model. */
export function checkModel(model: MechanismModel, n = 720): CheckReport {
  const findings: Finding[] = [];
  const add = (type: FindingType, detail: string, part?: string) => findings.push(part ? { type, part, detail } : { type, detail });
  const S: Solved[] = [];
  for (let i = 0; i <= n; i++) S.push(model.solve((i / n) * TAU));
  const s0 = S[0]!;

  // MISSING: every named point must be solved
  const named = new Set<string>([...(model.paths ?? []), ...(model.vel ?? [])]);
  for (const p of model.parts) {
    for (const k of p.between ?? []) named.add(k);
    if (p.at) named.add(p.at);
  }
  for (const k of named) if (!s0.pts[k]) add("MISSING", `point "${k}" is not in solve(u).pts`);
  for (const p of model.parts) if (!poseOf(p, s0)) add("MISSING", "no pose at u = 0", p.id);

  // NaN
  const nanSeen = new Set<string>();
  for (let i = 0; i <= n; i++)
    for (const [k, q] of Object.entries(S[i]!.pts))
      if (!nanSeen.has(k) && !(Number.isFinite(q[0]) && Number.isFinite(q[1]))) {
        nanSeen.add(k);
        add("NaN", `point "${k}" not finite at sample ${i}`);
      }

  // LINK_LEN
  let maxLinkErr = 0;
  for (const p of model.parts) {
    if (p.len === undefined || !p.between) continue;
    let worst = 0;
    for (const s of S) {
      const a = s.pts[p.between[0]];
      const b = s.pts[p.between[1]];
      if (!a || !b) continue;
      worst = Math.max(worst, Math.abs(Math.hypot(b[0] - a[0], b[1] - a[1]) - p.len));
    }
    maxLinkErr = Math.max(maxLinkErr, worst);
    if (worst > LINK_TOL) add("LINK_LEN", `length ${p.len} off by up to ${worst.toFixed(4)} mm`, p.id);
  }

  // continuity and PERIODICITY
  const maxStep: Record<string, number> = {};
  for (let i = 1; i <= n; i++)
    for (const [k, b] of Object.entries(S[i]!.pts)) {
      const a = S[i - 1]!.pts[k];
      if (!a) continue;
      const d = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (!(maxStep[k]! >= d)) maxStep[k] = d;
    }
  const sN = S[n]!;
  for (const [k, a] of Object.entries(s0.pts)) {
    const b = sN.pts[k];
    const d = b ? Math.hypot(a[0] - b[0], a[1] - b[1]) : Infinity;
    if (d > PERIOD_TOL) add("PERIODICITY", `point "${k}" moves ${d.toFixed(3)} mm over one cycle`);
  }
  // the player runs u on past 2π, so loops 0..4 are checked as one run: every solved point repeats from loop to loop
  // (a model keyed on absolute u fails here), and no part's pose steps, at a loop point or anywhere in a later loop,
  // by more than a few times the largest step the part makes in loop 0 (a wheel that falls back one pitch per loop does)
  const LOOPS = 5;
  const loop = (k: number): Solved[] => (k === 0 ? S : S.map((_, i) => model.solve(((i + k * n) / n) * TAU)));
  const later = Array.from({ length: LOOPS - 1 }, (_, k) => loop(k + 1));
  for (let i = 0; i <= n; i += Math.max(1, Math.floor(n / 90)))
    for (const [k, q] of Object.entries(S[i]!.pts)) {
      let worst = 0;
      for (const L of later) {
        const r = L[i]!.pts[k];
        worst = Math.max(worst, r ? Math.hypot(q[0] - r[0], q[1] - r[1]) : Infinity);
      }
      if (worst > PERIOD_TOL) add("PERIODICITY", `point "${k}" differs ${worst.toFixed(3)} mm in a later loop (sample ${i})`);
    }
  const run: Solved[] = [...S, ...later.flatMap((L) => L.slice(1))];
  for (const p of model.parts) {
    const step = (i: number): number => {
      const a = poseOf(p, run[i - 1]!);
      const b = poseOf(p, run[i]!);
      if (!a || !b) return 0;
      return Math.max(Math.hypot(b[0] - a[0], b[1] - a[1]), Math.abs(((b[2] - a[2] + 3 * Math.PI) % TAU) - Math.PI) * 30);
    };
    let ref = 0;
    for (let i = 1; i <= n; i++) ref = Math.max(ref, step(i));
    let worst = 0;
    let at = 0;
    for (let i = n + 1; i < run.length; i++) {
      const d = step(i);
      if (d > worst) {
        worst = d;
        at = i;
      }
    }
    if (worst > 3 * ref + 0.05) add("POSE_JUMP", `step ${worst.toFixed(2)} at loop ${(at / n).toFixed(2)} against ${ref.toFixed(2)} in loop 0`, p.id);
  }

  // POSE_JUMP
  for (const p of model.parts) {
    let mx = 0;
    for (let i = 1; i <= n; i++) {
      const a = poseOf(p, S[i - 1]!);
      const b = poseOf(p, S[i]!);
      if (!a || !b) continue;
      const da = Math.abs(((b[2] - a[2] + 3 * Math.PI) % TAU) - Math.PI);
      mx = Math.max(mx, Math.hypot(b[0] - a[0], b[1] - a[1]), da * 30);
    }
    if (mx > JUMP) add("POSE_JUMP", `step ${mx.toFixed(2)} between samples`, p.id);
  }

  // AXIS: a part on an x or y axis is placed along it by `along`; a cam contact between parts of different axes must be
  // a joint type that allows it
  for (const p of model.parts) if (isOut(p.axis) && p.along === undefined) add("AXIS", `axis ${p.axis} needs \`along\`, the start of the part along its axis`, p.id);
  const byId = Object.fromEntries(model.parts.map((p) => [p.id, p]));
  for (const m of model.meshes ?? []) {
    const a = byId[m.a];
    const b = byId[m.b];
    if (!a || !b) add("MISSING", `crossed mesh ${m.a} / ${m.b}: no such part`);
    else if (axisOf(a) === axisOf(b)) add("AXIS", `${m.form} mesh ${m.a} / ${m.b}: both on axis ${axisOf(a)}; a mesh on one axis is read from the parts (J6)`, m.a);
    else if (a.m === undefined || b.m === undefined) add("AXIS", `${m.form} mesh ${m.a} / ${m.b}: a gear needs its module m`, m.a);
  }
  for (const s of model.screws ?? []) {
    const a = byId[s.screw];
    if (!a || !byId[s.nut]) add("MISSING", `screw ${s.screw} / ${s.nut}: no such part`);
    else if (!isOut(a.axis)) add("AXIS", `screw ${s.screw}: a screw lies on an x or y axis`, s.screw);
    if (!(Math.abs(s.lead) > 0)) add("AXIS", `screw ${s.screw}: lead ${s.lead}`, s.screw);
  }
  for (const c of model.cams ?? []) {
    const a = byId[c.cam];
    const b = byId[c.follower];
    if (a && b && axisOf(a) !== axisOf(b) && !MIXED_AXIS_JOINTS.includes("J7"))
      add("AXIS", `cam contact ${c.cam} (axis ${axisOf(a)}) and ${c.follower} (axis ${axisOf(b)}): J7 does not join parts of different axes`, c.cam);
  }

  // pins: which bodies carry the pin centre at a constant local point (joins), which it passes through (INTERFERE)
  const pins = model.parts.filter((p) => p.role === "pin" || p.role === "trace");
  const bodies = model.parts.filter((p) => p.role !== "pin" && p.role !== "trace");
  const joins: Record<string, string[]> = {};
  const join = (pin: Part, s: string) => (joins[pin.id] ??= []).push(s);
  for (const pin of pins) {
    const pr = Math.max(...pin.shape.outer.map((q) => Math.hypot(q[0], q[1])));
    const lo = pin.layer;
    const hi = pin.role === "pin" ? pin.layer + (pin.span ?? 1) : pin.layer;
    for (const b of bodies) {
      // a pin and a body on different axes lie in different planes: their points are not comparable
      if (axisOf(b) !== axisOf(pin)) continue;
      let attached = true;
      let l0: Vec2 | null = null;
      let inside = false;
      let holeOk = true;
      for (let i = 0; i <= n; i += 2) {
        const s = S[i]!;
        const pp = poseOf(pin, s);
        const bp = poseOf(b, s);
        if (!pp || !bp) continue;
        const loc = toLocal(pp, bp);
        l0 ??= loc;
        if (Math.hypot(loc[0] - l0[0], loc[1] - l0[1]) > 1e-4) attached = false;
        const O = xf(b.shape.outer, bp);
        const q: Vec2 = [pp[0], pp[1]];
        if (inPoly(q, O) || polyD(q, O) < pr) {
          inside = true;
          const inHole = b.shape.holes.some((h) => {
            const H = xf(h, bp);
            return inPoly(q, H) && polyD(q, H) >= pr - 0.05;
          });
          if (!inHole) holeOk = false;
        }
      }
      const inRange = b.layer >= lo && b.layer <= hi;
      const where = `${b.id}@${b.layer}`;
      if (inside && inRange && !attached && !holeOk) add("INTERFERE", `pin [${lo}..${hi}] passes through ${where}`, pin.id);
      if (attached && inRange) join(pin, where);
      if (inside && inRange && !attached && holeOk) join(pin, `${where}(slot)`);
      if (attached && !inRange && inside) add("WARN", `pin [${lo}..${hi}] rigid with ${where} but the layer is out of range`, pin.id);
    }
  }

  // OVERLAP: same-layer bodies, vertex inside the other outline (and not in one of its holes) by more than the tolerance
  for (let i = 0; i < bodies.length; i++)
    for (let j = i + 1; j < bodies.length; j++) {
      const A = bodies[i]!;
      const B = bodies[j]!;
      if (A.layer !== B.layer || axisOf(A) !== axisOf(B)) continue;
      let hit = 0;
      let first = -1;
      for (let k = 0; k <= n; k += 3) {
        const pa = poseOf(A, S[k]!);
        const pb = poseOf(B, S[k]!);
        if (!pa || !pb) continue;
        const OA = xf(A.shape.outer, pa);
        const OB = xf(B.shape.outer, pb);
        const test = (X: Vec2[], Y: Vec2[], Yh: Vec2[][]) => X.some((q) => inPoly(q, Y) && polyD(q, Y) > OVERLAP_TOL && !Yh.some((h) => inPoly(q, h)));
        if (test(OA, OB, B.shape.holes.map((h) => xf(h, pb))) || test(OB, OA, A.shape.holes.map((h) => xf(h, pa)))) {
          hit++;
          if (first < 0) first = k;
        }
      }
      if (hit) add("OVERLAP", `${A.id} & ${B.id} on layer ${A.layer}: ${hit} samples, first u = ${((first / n) * TAU).toFixed(2)}`, A.id);
    }

  // swept bounds
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  for (let k = 0; k <= n; k += 6)
    for (const p of model.parts) {
      const pp = poseOf(p, S[k]!);
      if (!pp) continue;
      const w0 = (p.along ?? 0) + (p.dz ?? 0);
      for (const [x, y] of isOut(p.axis) ? planCorners(boxOf(p.axis, xf(p.shape.outer, pp), w0, w0 + p.thick)) : xf(p.shape.outer, pp)) {
        x0 = Math.min(x0, x);
        x1 = Math.max(x1, x);
        y0 = Math.min(y0, y);
        y1 = Math.max(y1, y);
      }
    }

  // the overlay and plot functions must run and stay finite
  const u1 = 1;
  const s1 = model.solve(u1);
  for (const it of [...(model.forces?.(s1, u1) ?? []), ...(model.angles?.(s1, u1) ?? [])])
    if ("value" in it && it.value !== undefined && !Number.isFinite(it.value)) add("NaN", `overlay "${it.key ?? it.type}" value not finite`);
  if (model.plot)
    for (let i = 0; i <= 36; i++) {
      const u = (i / 36) * TAU;
      if (!Number.isFinite(model.plot.f(model.solve(u), u))) {
        add("NaN", `plot not finite at u = ${u.toFixed(2)}`);
        break;
      }
    }

  return { id: model.id, n, findings, maxLinkErr, maxStep, joins, boundsSize: [x1 - x0, y1 - y0] };
}

/** The report as printable lines. */
export function formatReport(r: CheckReport): string[] {
  const out = [`${r.id}: ${r.findings.length ? `${r.findings.length} finding(s)` : "clean"} (${r.n} samples)`];
  for (const f of r.findings) out.push(`  ${f.type}${f.part ? ` ${f.part}` : ""}: ${f.detail}`);
  out.push(`  max link err ${r.maxLinkErr.toExponential(2)} mm`);
  out.push(`  max step per point (mm per ${(360 / r.n).toFixed(2)}°): ${Object.entries(r.maxStep).map(([k, v]) => `${k} ${v.toFixed(2)}`).join(", ")}`);
  out.push(`  pin joins: ${Object.entries(r.joins).map(([k, v]) => `${k} → ${v.join(" ")}`).join("; ")}`);
  out.push(`  bounds ${r.boundsSize[0].toFixed(0)} x ${r.boundsSize[1].toFixed(0)} mm`);
  return out;
}
