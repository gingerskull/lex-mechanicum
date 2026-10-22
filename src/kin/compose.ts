// Composition of a record's `kin` block: drivers, the `solve` list of blocks, the bodies that follow from the points the
// blocks produced, and the numeric fallback for loops that do not decompose. The result is a pose of every body.
import { type BlockCtx, KinError } from "./ctx";
import { evalExpr } from "./expr";
import { BLOCKS } from "./registry";
import { D2R, R2D, TAU, type Vec3, fitXf, m3, v3, wrapPi, xf, type Xf } from "./math";
import { solveNumeric } from "./numeric";
import { resolveJoint, type ResolvedJoint } from "./residual";
import type { Controls, Kin, KinBody, KinDriver, KinJoint, Pose, SolveStep } from "./types";

type Mode = "ref" | "track" | "normal" | "probe";

/** Which of a stateful block's two closures it is on, as a function of the cycle phase. */
export class BranchTable {
  start: 0 | 1 = 0;
  flips: number[] = [];
  sampled: Int8Array;
  periodic = true;
  constructor(readonly steps: number) {
    this.sampled = new Int8Array(steps + 1);
  }
  idxAt(u: number, refined: boolean): 0 | 1 {
    const x = ((u % TAU) + TAU) % TAU;
    if (!refined) return (this.sampled[Math.min(this.steps, Math.round((x / TAU) * this.steps))] ?? 0) as 0 | 1;
    let n = 0;
    for (const f of this.flips) if (f <= x) n++;
    return ((this.start + n) % 2) as 0 | 1;
  }
  refined = false;
}

interface Tracker {
  p1?: number[];
  p2?: number[];
}

export interface Setup {
  key: string;
  controls: Controls | undefined;
  params: Map<string, number>;
  designs: Map<string, string>;
  held: Map<string, number>;
  joints: Map<string, ResolvedJoint>;
  bodyFrame: Map<string, Xf>;
  refPts: Map<string, Vec3>;
  defaults: Map<string, number>;
  refVals: Map<string, number>;
  trackers: Map<string, Tracker>;
  tables: Map<string, BranchTable>;
  stateful: string[];
  tablesReady: boolean;
  driverControls: Record<string, number>;
  /** Warm start of the numeric fallback and the driver values it belongs to. */
  fbWarm?: { poses: Map<string, Xf>; vals: Record<string, number> };
  /** Reference-pose block values (for outputs). */
  recording: { index: number } | null;
}

const TABLE_STEPS = 1440;

const key = (c?: Controls): string =>
  JSON.stringify([
    Object.entries(c?.params ?? {}).sort(),
    Object.entries(c?.design ?? {}).sort(),
    Object.entries(c?.select ?? {}).sort(),
    Object.entries((c as { drivers?: Record<string, number> } | undefined)?.drivers ?? {}).sort(),
  ]);

const joinPlain = (v: unknown): string => String(v);

export class Kinematics {
  private setups = new Map<string, Setup>();
  private bodyIds: Set<string>;
  private jointById: Map<string, KinJoint>;
  private pointById = new Map<string, { body: string; local: unknown[] }>();

  constructor(readonly kin: Kin) {
    this.bodyIds = new Set(kin.bodies.map((b) => b.id));
    if (!this.bodyIds.has("ground")) throw new KinError("kin needs a ground body");
    this.jointById = new Map(kin.joints.map((j) => [j.id, j]));
    for (const p of kin.points ?? []) this.pointById.set(p.id, p);
    for (const j of kin.joints) {
      if (!this.bodyIds.has(j.a) || !this.bodyIds.has(j.b)) throw new KinError(`joint ${j.id}: unknown body`);
    }
    for (const s of kin.solve) if (!BLOCKS[s.block]) throw new KinError(`solve step ${s.id}: unknown block ${s.block}`);
  }

  // ------------------------------------------------------------------ setup

  setup(controls?: Controls): Setup {
    const k = key(controls);
    let s = this.setups.get(k);
    if (s) return s;
    s = this.buildSetup(controls);
    this.setups.set(k, s);
    return s;
  }

  private buildSetup(controls?: Controls): Setup {
    const kin = this.kin;
    const params = new Map<string, number>();
    for (const p of kin.params ?? []) params.set(p.id, p.value);
    const held = new Map<string, number>();
    const designs = new Map<string, string>();
    for (const d of kin.design ?? []) designs.set(d.id, d.value);
    for (const [id, v] of Object.entries(controls?.design ?? {})) designs.set(id, v);
    for (const d of kin.drivers) {
      if (d.kind !== "select" || !d.options) continue;
      const choice = controls?.select?.[d.id] ?? d.value ?? Object.keys(d.options)[0];
      const opt = choice ? d.options[choice] : undefined;
      for (const [id, v] of Object.entries(opt?.params ?? {})) params.set(id, v);
      for (const [id, v] of Object.entries(opt?.drivers ?? {})) held.set(id, v);
    }
    for (const [id, v] of Object.entries(controls?.params ?? {})) params.set(id, v);
    const drv = (controls as { drivers?: Record<string, number> } | undefined)?.drivers ?? {};
    const defaults = new Map<string, number>();
    for (const d of kin.drivers) defaults.set(d.id, drv[d.id] ?? d.default ?? 0);
    for (const [id, v] of held) defaults.set(id, v);

    const num = (v: unknown): number => {
      if (typeof v === "number") return v;
      if (typeof v === "string") return evalExpr(v, (n) => params.get(n));
      throw new KinError(`not a number: ${joinPlain(v)}`);
    };
    const vec = (v: unknown): Vec3 => {
      if (!Array.isArray(v)) throw new KinError(`not a position: ${joinPlain(v)}`);
      return [num(v[0]), num(v[1]), v.length > 2 ? num(v[2]) : 0];
    };
    const joints = new Map<string, ResolvedJoint>();
    for (const j of kin.joints) joints.set(j.id, resolveJoint(j, num, vec));
    const bodyFrame = new Map<string, Xf>();
    for (const b of kin.bodies) bodyFrame.set(b.id, bodyFrameOf(b, kin.joints, joints, vec));
    const refPts = new Map<string, Vec3>();
    for (const [id, r] of joints) refPts.set(id, r.at);
    for (const p of kin.points ?? []) {
      const F = bodyFrame.get(p.body);
      if (!F) throw new KinError(`point ${p.id}: unknown body ${p.body}`);
      refPts.set(p.id, xf.apply(F, vec(p.local)));
    }
    return {
      key: key(controls),
      controls,
      params,
      designs,
      held,
      joints,
      bodyFrame,
      refPts,
      defaults,
      refVals: new Map(),
      trackers: new Map(),
      tables: new Map(),
      stateful: [],
      tablesReady: false,
      driverControls: drv,
      recording: null,
    };
  }

  /** The resolved joints (parameters bound, reference geometry) for a setting of the controls. */
  joints(controls?: Controls): ResolvedJoint[] {
    return [...this.setup(controls).joints.values()];
  }

  // ----------------------------------------------------------------- drivers

  /** Driver values (degrees or mm) for cycle phase u. */
  driverValues(u: number, controls?: Controls): Record<string, number> {
    const s = this.setup(controls);
    const out: Record<string, number> = {};
    for (const d of this.kin.drivers) {
      const held = s.held.get(d.id);
      const def = s.defaults.get(d.id) ?? 0;
      if (held !== undefined) {
        out[d.id] = held;
        continue;
      }
      const speed = d.speed ?? 1;
      const ph = (d.phase ?? 0) * D2R;
      if (d.kind === "rotary") {
        const span = d.range ? d.range[1] - d.range[0] : 360;
        out[d.id] = def + ((speed * u + ph) * R2D * span) / 360;
      } else if (d.kind === "oscillating" || d.kind === "linear") {
        const lo = d.lo ?? d.range?.[0] ?? def;
        const hi = d.hi ?? d.range?.[1] ?? def;
        out[d.id] = lo + (hi - lo) * (0.5 - 0.5 * Math.cos(speed * u + ph));
      } else out[d.id] = def;
    }
    return out;
  }

  // ------------------------------------------------------------------- poses

  /** The pose at cycle phase u (radians, 0..2π per cycle) at the given controls. Continuous, periodic. */
  pose(u: number, controls?: Controls): Pose {
    const s = this.setup(controls);
    this.ensureTables(s);
    return this.withFallback(s, u, this.driverValues(u, controls), "normal");
  }

  /** The pose at explicit driver values (declared branch where a block has two closures). */
  poseAt(values: Record<string, number>, controls?: Controls, u = 0): Pose {
    const s = this.setup(controls);
    const v = { ...this.defaultValues(s), ...values };
    return this.withFallback(s, u, v, "normal", true);
  }

  /** The reference pose: every driver at its default; every body at the identity. */
  referencePose(controls?: Controls): Pose {
    const s = this.setup(controls);
    return this.run(s, 0, this.defaultValues(s), "ref").pose;
  }

  defaultValues(s: Setup): Record<string, number> {
    const v: Record<string, number> = {};
    for (const d of this.kin.drivers) v[d.id] = s.defaults.get(d.id) ?? 0;
    return v;
  }

  private withFallback(s: Setup, u: number, vals: Record<string, number>, mode: Mode, declared = false): Pose {
    const fb = this.kin.fallback;
    if (!fb || !fb.loops.length) return this.run(s, u, vals, mode, undefined, declared).pose;
    const unknownSet = new Set(fb.loops.flat());
    const dist = (a: Record<string, number>, b: Record<string, number>) => Math.max(0, ...Object.keys(a).map((k) => Math.abs((a[k] ?? 0) - (b[k] ?? 0))));
    const step = 3; // degrees (or mm) between continuation steps
    const warm = s.fbWarm;
    if (!warm || dist(warm.vals, vals) > step) {
      // continue from the reference pose along a straight path in driver space
      const v0 = this.defaultValues(s);
      const m = Math.min(720, Math.max(1, Math.ceil(dist(v0, vals) / step)));
      let w: Map<string, Xf> | undefined;
      for (let i = 1; i <= m; i++) {
        const vi: Record<string, number> = {};
        for (const k of Object.keys(vals)) vi[k] = (v0[k] ?? 0) + ((vals[k] ?? 0) - (v0[k] ?? 0)) * (i / m);
        const r = this.run(s, u, vi, mode, { unknown: unknownSet, warm: w }, declared);
        w = r.fb;
        if (i === m) {
          s.fbWarm = { poses: w!, vals: vi };
          return r.pose;
        }
      }
    }
    const r = this.run(s, u, vals, mode, { unknown: unknownSet, warm: warm?.poses }, declared);
    s.fbWarm = { poses: r.fb!, vals };
    return r.pose;
  }

  // ----------------------------------------------------------- branch tables

  private ensureTables(s: Setup): void {
    if (s.tablesReady) return;
    const v0 = this.defaultValues(s);
    // reference run: finds the stateful blocks and the declared closures
    s.trackers.clear();
    s.stateful = [];
    this.run(s, 0, v0, "ref");
    if (s.stateful.length === 0) {
      s.tablesReady = true;
      return;
    }
    for (const id of s.stateful) s.tables.set(id, new BranchTable(TABLE_STEPS));
    // homotopy from the reference values to the cycle start, then the cycle
    const startVals = this.driverValuesFor(s, 0);
    const m = 48;
    for (let i = 1; i <= m; i++) {
      const vi: Record<string, number> = {};
      for (const k of Object.keys(v0)) vi[k] = v0[k]! + (startVals[k]! - v0[k]!) * (i / m);
      this.withFallbackNoTable(s, 0, vi, "track");
    }
    for (let i = 0; i <= TABLE_STEPS; i++) {
      const u = (i / TABLE_STEPS) * TAU;
      s.recording = { index: i };
      this.withFallbackNoTable(s, u, this.driverValuesFor(s, u), "track");
    }
    s.recording = null;
    // flips: where the tracked closure changes side; refine each at the minimum of h
    for (const id of s.stateful) {
      const t = s.tables.get(id)!;
      t.start = (t.sampled[0] ?? 0) as 0 | 1;
      t.periodic = t.sampled[0] === t.sampled[TABLE_STEPS];
      const flips: number[] = [];
      for (let i = 1; i <= TABLE_STEPS; i++) {
        if (t.sampled[i] !== t.sampled[i - 1]) {
          let lo = ((i - 1) / TABLE_STEPS) * TAU;
          let hi = (i / TABLE_STEPS) * TAU;
          const hOf = (u: number): number => {
            const r = this.run(s, u, this.driverValuesFor(s, u), "probe");
            return r.hs.get(id) ?? Infinity;
          };
          for (let k = 0; k < 60; k++) {
            const m1 = lo + (hi - lo) / 3;
            const m2 = hi - (hi - lo) / 3;
            if (hOf(m1) < hOf(m2)) hi = m2;
            else lo = m1;
          }
          flips.push((lo + hi) / 2);
        }
      }
      t.flips = flips.filter((f) => f < TAU);
      t.refined = true;
    }
    s.tablesReady = true;
  }

  private driverValuesFor(s: Setup, u: number): Record<string, number> {
    return this.driverValues(u, s.controls);
  }

  private withFallbackNoTable(s: Setup, u: number, vals: Record<string, number>, mode: Mode): void {
    this.withFallback(s, u, vals, mode);
  }

  // --------------------------------------------------------------------- run

  private run(
    s: Setup,
    u: number,
    vals: Record<string, number>,
    mode: Mode,
    fb?: { unknown: Set<string>; warm?: Map<string, Xf> },
    declared = false,
  ): { pose: Pose; hs: Map<string, number>; fb?: Map<string, Xf> } {
    const run = new Run(this, s, u, vals, mode, declared);
    run.drive();
    for (const step of this.kin.solve) run.runStep(step);
    run.resolveBodies(fb ?? { unknown: new Set((this.kin.fallback?.loops ?? []).flat()) });
    return { pose: run.pose(), hs: run.hs, fb: run.fbPoses };
  }

  /** Internals for Run. */
  get _joints(): Map<string, KinJoint> {
    return this.jointById;
  }
  get _points(): Map<string, { body: string; local: unknown[] }> {
    return this.pointById;
  }
  get _bodies(): Set<string> {
    return this.bodyIds;
  }
}

class Run implements BlockCtx {
  step!: SolveStep;
  xfs = new Map<string, Xf>([["ground", xf.id()]]);
  pts = new Map<string, Vec3>();
  vals: Record<string, number>;
  hs = new Map<string, number>();
  fallbackBlocks: string[] = [];
  fbPoses?: Map<string, Xf>;
  private flagged = false;

  constructor(
    private k: Kinematics,
    private s: Setup,
    readonly u: number,
    vals: Record<string, number>,
    private mode: Mode,
    private declared: boolean,
  ) {
    this.vals = { ...vals };
  }

  // ---- drivers: each rotates or slides the driven body of its joint relative to the driven joint's first body
  drive(): void {
    const pending = this.k.kin.drivers.filter((d) => d.joint && d.kind !== "select");
    for (let guard = 0; pending.length && guard < 8; guard++) {
      for (let i = pending.length - 1; i >= 0; i--) {
        const d = pending[i]!;
        const r = this.s.joints.get(d.joint!);
        if (!r) throw new KinError(`driver ${d.id}: unknown joint ${d.joint}`);
        const a = this.xfs.get(r.joint.a);
        if (!a) continue;
        const dv = (this.vals[d.id] ?? 0) - (this.s.defaults.get(d.id) ?? 0);
        this.xfs.set(r.joint.b, xf.mul(a, driverMotion(r, d, dv)));
        pending.splice(i, 1);
      }
    }
  }

  runStep(step: SolveStep): void {
    this.step = step;
    BLOCKS[step.block]!(this, step);
  }

  // ---- BlockCtx
  private lookupNum = (name: string): number | undefined => this.s.params.get(name) ?? this.vals[name];

  num(v: unknown, what = "value"): number {
    if (typeof v === "number") return v;
    if (typeof v === "string") {
      const direct = this.lookupNum(v);
      if (direct !== undefined) return direct;
      return evalExpr(v, this.lookupNum);
    }
    throw new KinError(`${this.step?.id ?? ""}: ${what} must be a number or a name, got ${joinPlain(v)}`);
  }
  rad(v: unknown, what?: string): number {
    return this.num(v, what) * D2R;
  }
  vec(v: unknown, what = "position"): Vec3 {
    if (typeof v === "string") return this.pt(v);
    if (Array.isArray(v)) return [this.num(v[0]), this.num(v[1]), v.length > 2 ? this.num(v[2]) : 0];
    throw new KinError(`${this.step?.id ?? ""}: ${what} must be a point name or [x, y, z]`);
  }
  refVec(v: unknown, what = "position"): Vec3 {
    if (typeof v === "string") return this.refPt(v);
    return this.vec(v, what);
  }
  refPt(name: string): Vec3 {
    const p = this.s.refPts.get(name);
    if (!p) throw new KinError(`${this.step?.id ?? ""}: unknown point ${name}`);
    return p;
  }
  pt(name: string): Vec3 {
    const set = this.pts.get(name);
    if (set) return set;
    const tp = this.k._points.get(name);
    if (tp) {
      const X = this.xfs.get(tp.body);
      if (X) return xf.apply(X, this.refPt(name));
    }
    const j = this.s.joints.get(name);
    if (j) {
      const X = this.xfs.get(j.joint.a) ?? this.xfs.get(j.joint.b);
      if (X) return xf.apply(X, j.at);
    }
    throw new KinError(`${this.step?.id ?? "?"}: point ${name} is not available yet (a block must produce it first)`);
  }
  joint(id: string): KinJoint {
    const j = this.k._joints.get(id);
    if (!j) throw new KinError(`${this.step.id}: unknown joint ${id}`);
    return j;
  }
  jointAt(id: string): Vec3 {
    const r = this.s.joints.get(id);
    if (!r) throw new KinError(`${this.step.id}: unknown joint ${id}`);
    return r.at;
  }
  jointAxis(id: string): Vec3 {
    const r = this.s.joints.get(id);
    if (!r) throw new KinError(`${this.step.id}: unknown joint ${id}`);
    return r.axis;
  }
  has(body: string): boolean {
    return this.xfs.has(body);
  }
  xf(body: string): Xf {
    return this.xfs.get(body) ?? xf.id();
  }
  setXf(body: string, X: Xf): void {
    if (!this.k._bodies.has(body)) throw new KinError(`${this.step.id}: unknown body ${body}`);
    this.xfs.set(body, X);
  }
  setPt(name: string, p: Vec3): void {
    this.pts.set(name, p);
  }
  setVal(name: string, v: number): void {
    this.vals[name] = v;
  }
  delta(key: string, now: number): number {
    const k = `${this.step.id}:${key}`;
    if (this.mode === "ref") {
      this.s.refVals.set(k, now);
      return 0;
    }
    const ref = this.s.refVals.get(k);
    if (ref === undefined) throw new KinError(`${this.step.id}: no reference value for ${key}`);
    return now - ref;
  }
  driver(id: string): KinDriver | undefined {
    return this.k.kin.drivers.find((d) => d.id === id);
  }
  design(id: string): string | undefined {
    return this.s.designs.get(id);
  }
  declaredSide(): 1 | -1 {
    const b = this.step.branch;
    if (b === undefined) return 1;
    let idx: number | undefined;
    for (const d of this.k.kin.design ?? []) {
      if (d.id === b) idx = d.options.indexOf(this.s.designs.get(d.id) ?? d.value);
      else if (d.options.includes(b)) idx = d.options.indexOf(b);
      if (idx !== undefined) break;
    }
    if (idx === undefined) idx = b === "right" || b === "-" || b === "near" || b === "-1" ? 1 : 0;
    return idx <= 0 ? 1 : -1;
  }
  flagFallback(): void {
    this.flagged = true;
  }

  root(roots: [number[], number[]], h: number): 0 | 1 {
    const id = this.step.id;
    this.hs.set(id, h);
    const declaredIdx: 0 | 1 = this.declaredSide() === 1 ? 0 : 1;
    if (this.mode === "ref") {
      if (!this.s.stateful.includes(id)) this.s.stateful.push(id);
      this.s.trackers.set(id, { p1: roots[declaredIdx] });
      return declaredIdx;
    }
    if (this.mode === "track") {
      const tr = this.s.trackers.get(id) ?? {};
      this.s.trackers.set(id, tr);
      let idx: 0 | 1 = declaredIdx;
      if (tr.p1) {
        const pred = tr.p2 ? tr.p1.map((x, i) => 2 * x - tr.p2![i]!) : tr.p1;
        const d = (r: number[]) => Math.hypot(...r.map((x, i) => x - pred[i]!));
        idx = d(roots[0]) <= d(roots[1]) ? 0 : 1;
      }
      tr.p2 = tr.p1;
      tr.p1 = roots[idx];
      const rec = this.s.recording;
      const t = this.s.tables.get(id);
      if (rec && t) t.sampled[rec.index] = idx;
      return idx;
    }
    const t = this.s.tables.get(id);
    if (!t || this.declared) return declaredIdx;
    return t.idxAt(this.u, t.refined);
  }

  // ---- after the blocks
  resolveBodies(fb?: { unknown: Set<string>; warm?: Map<string, Xf> }): void {
    const joints = [...this.s.joints.values()];
    const point = new Set(["revolute", "spherical", "universal", "flexure"]);
    for (let guard = 0; guard < 64; guard++) {
      let progress = false;
      for (const b of this.k.kin.bodies) {
        if (this.xfs.has(b.id)) continue;
        const ref: Vec3[] = [];
        const now: Vec3[] = [];
        let hint: Vec3 | undefined;
        let slide = false;
        // a prismatic partner already posed: the body keeps the partner's turn (a piston in a swinging cylinder)
        let guide: Xf | undefined;
        const add = (r: Vec3, n: Vec3) => {
          if (ref.some((q) => v3.dist(q, r) < 1e-9)) return;
          ref.push(r);
          now.push(n);
        };
        for (const [id, tp] of this.k._points) if (tp.body === b.id && this.pts.has(id)) add(this.refPt(id), this.pts.get(id)!);
        for (const r of joints) {
          const j = r.joint;
          if (j.a !== b.id && j.b !== b.id) continue;
          if (j.type === "prismatic") {
            slide = true;
            const other = j.a === b.id ? j.b : j.a;
            if (this.xfs.has(other)) guide = this.xfs.get(other);
          }
          if (j.type === "revolute" && !hint) hint = r.axis;
          if (!point.has(j.type)) continue;
          const other = j.a === b.id ? j.b : j.a;
          if (this.pts.has(j.id)) add(r.at, this.pts.get(j.id)!);
          else if (this.xfs.has(other)) add(r.at, xf.apply(this.xfs.get(other)!, r.at));
        }
        let X: Xf | null = null;
        if (ref.length >= 2) X = fitXf(ref, now, hint);
        else if (ref.length === 1 && guide) X = { R: guide.R, t: v3.sub(now[0]!, m3.mulV(guide.R, ref[0]!)) };
        else if (ref.length === 1 && slide) X = xf.trans(v3.sub(now[0]!, ref[0]!));
        if (X) {
          this.xfs.set(b.id, X);
          progress = true;
        }
      }
      if (!progress) break;
    }
    // a body no joint reaches is fixed where it stands (a port face, a fixed plate)
    for (const b of this.k.kin.bodies) if (!this.xfs.has(b.id) && !this.k.kin.joints.some((j) => j.a === b.id || j.b === b.id)) this.xfs.set(b.id, xf.id());
    const missing = this.k.kin.bodies.filter((b) => !this.xfs.has(b.id)).map((b) => b.id);
    if (missing.length) {
      const bad = fb ? missing.filter((m) => !fb.unknown.has(m)) : missing;
      if (bad.length) throw new KinError(`bodies not solved by any block: ${bad.join(", ")}`);
      if (this.mode === "ref") {
        for (const m of missing) this.xfs.set(m, xf.id());
        return;
      }
      const known = new Map(this.xfs);
      const driverValue = (id: string) => this.vals[id];
      const res = solveNumeric(joints, missing, known, fb?.warm ?? new Map(), driverValue);
      this.fbPoses = res.poses;
      for (const [b, X] of res.poses) this.xfs.set(b, X);
      this.fallbackBlocks.push(...missing.map((m) => `fallback:${m}`));
      this.flagged = true;
    }
  }

  pose(): Pose {
    const points = new Map<string, Vec3>();
    for (const id of this.s.refPts.keys()) {
      try {
        points.set(id, this.pt(id));
      } catch {
        // a joint between two bodies that were both solved still resolves above; anything else is skipped
      }
    }
    const outputs: Pose["outputs"] = {};
    for (const o of this.k.kin.outputs ?? []) {
      let v = o.from && o.to ? this.between(o.of, o.from, o.to, points) : this.output(o.kind, o.of, points);
      // a point's position along a direction (a tip's travel across its lever, a shuttle's place), mm
      if (o.axis && Array.isArray(v)) v = v3.dot(v, v3.unit(o.axis as Vec3));
      if (v !== undefined) outputs[o.id] = v;
    }
    for (const o of this.k.kin.outputs ?? []) {
      const a = outputs[o.id];
      const m = o.minus ? outputs[o.minus] : undefined;
      if (typeof a === "number" && typeof m === "number") outputs[o.id] = wrapPi((a - m) * D2R) * R2D;
    }
    return { u: this.u, bodies: this.xfs, points, values: this.vals, outputs, fallback: this.flagged ? this.fallbackBlocks : [] };
  }

  /** The angle at point `at` between the rays to `a` and `b`, degrees. */
  private between(at: string, a: string, b: string, points: Map<string, Vec3>): number | undefined {
    const p = points.get(at), q = points.get(a), r = points.get(b);
    if (!p || !q || !r) return undefined;
    const u = v3.sub(q, p), w = v3.sub(r, p);
    return Math.atan2(v3.len(v3.cross(u, w)), v3.dot(u, w)) * R2D;
  }

  private output(kind: string, of: string, points: Map<string, Vec3>): number | Vec3 | undefined {
    // a value a block gives (a chain's speed over its peak), whatever the kind it is read as
    if (of in this.vals && !this.xfs.has(of) && !points.has(of) && !this.s.joints.has(of)) return this.vals[of];
    if (kind === "position") {
      // a prismatic joint's position is its slide: how far its two bodies have moved apart along its axis
      const r = this.s.joints.get(of);
      if (r && (r.joint.type === "prismatic" || r.joint.type === "cylindrical" || r.joint.type === "screw")) {
        const Xa = this.xfs.get(r.joint.a) ?? xf.id();
        const Xb = this.xfs.get(r.joint.b) ?? xf.id();
        return v3.dot(v3.sub(xf.apply(Xa, r.at), xf.apply(Xb, r.at)), xf.dir(Xb, r.axis));
      }
    }
    if (kind === "path" || (kind === "position" && points.has(of))) return points.get(of);
    if (kind === "angle") {
      if (of in this.vals) return this.vals[of];
      const axis = this.bodyAxis(of);
      const X = this.xfs.get(of);
      if (X && axis) return xf.angleAbout(X, axis) * R2D;
      return undefined;
    }
    if (kind === "position") {
      const X = this.xfs.get(of);
      const axis = this.bodyAxis(of, "prismatic");
      if (X && axis) return v3.dot(X.t, axis);
      return X ? X.t : undefined;
    }
    return undefined;
  }

  private bodyAxis(body: string, type?: string): Vec3 | undefined {
    // a body's own axis is that of its joint to the ground, where it has one (a yoke turns on its shaft, not its pin)
    for (const r of this.s.joints.values()) {
      if ((r.joint.a === body || r.joint.b === body) && (r.joint.a === "ground" || r.joint.b === "ground") && (type ? r.joint.type === type : r.joint.type !== "gear-mesh")) return r.axis;
    }
    for (const r of this.s.joints.values()) {
      if ((r.joint.a === body || r.joint.b === body) && (type ? r.joint.type === type : r.joint.type !== "gear-mesh")) return r.axis;
    }
    return undefined;
  }
}

/** A frame object of the record, if the body has one (`o` or `origin`, and `rot`); a prose `frame` string is not one. */
function frameObj(f: unknown): { o?: unknown; rot?: unknown } | undefined {
  if (!f || typeof f !== "object") return undefined;
  const g = f as { o?: unknown; origin?: unknown; rot?: unknown };
  return { o: g.o ?? g.origin, rot: g.rot };
}

/**
 * A body's own frame in the reference configuration, which its points' `local` coordinates and its shape are given in
 * (record spec, "body frame"). An explicit frame (`o` or `origin`, and `rot`) wins. Otherwise the origin is the body's
 * `at` joint, z is that joint's axis (sign fixed so its largest component is positive), and x points toward the first
 * other joint of the body that lies off that axis, so a link's x runs along it; a body with no such joint keeps the
 * world x (or, on an axis in plan, the world z) made perpendicular to its axis. Without an `at` joint the frame is the
 * world's, and the ground's frame is always the world's.
 */
export function bodyFrameOf(b: KinBody, list: KinJoint[], joints: Map<string, ResolvedJoint>, vec: (v: unknown) => Vec3): Xf {
  // the ground is the world: its `frame` only places the plate its shape draws
  if (b.id === "ground") return xf.id();
  const f = frameObj(b.frame) ?? frameObj(b.at?.frame);
  if (f && (f.o !== undefined || f.rot !== undefined)) return { R: m3.eulerDeg(f.rot !== undefined ? vec(f.rot) : [0, 0, 0]), t: f.o !== undefined ? vec(f.o) : [0, 0, 0] };
  const at = b.at?.joint ? joints.get(b.at.joint) : undefined;
  if (!at) return xf.id();
  const z = canonAxis(at.axis);
  let x: Vec3 | undefined;
  for (const j of list) {
    if (j.a !== b.id && j.b !== b.id) continue;
    const r = joints.get(j.id);
    if (!r) continue;
    const d = v3.sub(r.at, at.at);
    const p = v3.sub(d, v3.mul(z, v3.dot(d, z)));
    if (v3.len(p) > 0.01) {
      x = v3.unit(p);
      break;
    }
  }
  if (!x) {
    const h: Vec3 = Math.abs(z[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1];
    x = v3.unit(v3.sub(h, v3.mul(z, v3.dot(h, z))));
  }
  const y = v3.cross(z, x);
  return { R: [x[0], y[0], z[0], x[1], y[1], z[1], x[2], y[2], z[2]], t: at.at };
}

/** An axis with a fixed sign: its largest component positive, so parallel axes compare equal. */
export function canonAxis(a: Vec3): Vec3 {
  const u = v3.unit(a);
  const k = Math.abs(u[2]) > 1e-6 ? 2 : Math.abs(u[1]) > 1e-6 ? 1 : 0;
  return u[k]! < 0 ? [-u[0] + 0, -u[1] + 0, -u[2] + 0] : u;
}

function driverMotion(r: ResolvedJoint, d: KinDriver, dv: number): Xf {
  const j = r.joint;
  if (j.type === "prismatic" || d.kind === "linear") return xf.trans(v3.mul(r.axis, dv));
  const ang = dv * D2R;
  if (j.type === "screw") {
    const lead = r.num(j.lead ?? 0);
    return xf.mul(xf.trans(v3.mul(r.axis, ((j.hand === "left" ? -1 : 1) * lead * ang) / TAU)), xf.rotAbout(r.at, r.axis, ang));
  }
  return xf.rotAbout(r.at, r.axis, ang);
}

void wrapPi;
