// Blocks of the transfers: a walking beam that hands like parts on round a closed circuit, one station per turn.
import { type BlockCtx, type BlockFn, KinError } from "../ctx";
import type { SolveStep } from "../types";
import { D2R, TAU, type Vec3, v3, xf } from "../math";
import { outVal, str } from "./shared";

/** A leg of a slot: the part rides the beam over a window of the turn, or moves on a straight line to a point. */
export type Leg = { carry: true; window: [number, number] } | { carry: false; to: Vec3; window: [number, number] };

/** The smooth start and stop of a move (cycloidal): 0 at 0, 1 at 1, at rest at both ends. */
export const ease = (t: number): number => (t <= 0 ? 0 : t >= 1 ? 1 : t - Math.sin(TAU * t) / TAU);

/**
 * Where a part that starts a slot at `from` stands at the phase `deg` of the turn (0 to 360): the legs in order, each
 * over its window; before a leg's window the part holds where the last one left it. `beam(deg)` is the beam's
 * translation from the reference at that phase (the crank pin's displacement: the beam translates without turning).
 */
export function slotAt(from: Vec3, legs: Leg[], deg: number, beam: (deg: number) => Vec3): Vec3 {
  let p = from;
  for (const l of legs) {
    const [lo, hi] = l.window;
    if (deg <= lo) break;
    const f = Math.min(1, (deg - lo) / (hi - lo));
    if (l.carry) {
      const end = Math.min(deg, hi);
      p = v3.add(p, v3.sub(beam(end), beam(lo)));
    } else p = v3.add(p, v3.mul(v3.sub(l.to, p), ease(f)));
    if (deg < hi) break;
  }
  return p;
}

/** How a leg turns a part that rolls: about `axis` (unit, world) from `a0` to `a1` (radians); null where it does not roll. */
export type Roll = { axis: Vec3; a0: number; a1: number } | null;

const UP: Vec3 = [0, 0, 1];

/**
 * The roll of every leg of the circuit for a round part of radius `r` (SD29): where it moves on its own it rolls by its
 * travel in the base plane over r, about the line across that travel in the base plane; on the beam it does not turn. A
 * run of moves about one axis is rounded to whole turns (the slip is a few percent), so a part leaves every run as it
 * came in and the picture after a turn is the same whatever marks it carries. `rolls[j][l]` is slot j's leg l.
 */
export function circuitRolls(slots: { from: Vec3; legs: Leg[] }[], r: number, beam: (deg: number) => Vec3): Roll[][] {
  const legs: { j: number; l: number; h: number; axis: Vec3 | null; carry: boolean }[] = [];
  slots.forEach((s, j) => {
    let p = s.from;
    s.legs.forEach((g, l) => {
      if (g.carry) {
        p = v3.add(p, v3.sub(beam(g.window[1]), beam(g.window[0])));
        legs.push({ j, l, h: 0, axis: null, carry: true });
        return;
      }
      const d: Vec3 = [g.to[0] - p[0], g.to[1] - p[1], 0];
      const h = v3.len(d);
      // a drop straight down rolls nothing and takes the axis of the run it is in
      legs.push({ j, l, h, axis: h > 1e-9 ? v3.unit(v3.cross(UP, d)) : null, carry: false });
      p = g.to;
    });
  });
  // runs of moves about one axis, in circuit order from a leg on the beam (one run round a circuit with none)
  const n = legs.length;
  const s0 = Math.max(0, legs.findIndex((g) => g.carry));
  const runs: { ids: number[]; axis: Vec3 | null }[] = [];
  let run: { ids: number[]; axis: Vec3 | null } | null = null;
  for (let q = 0; q < n; q++) {
    const i = (s0 + q) % n;
    const g = legs[i]!;
    if (g.carry) {
      run = null;
      continue;
    }
    if (run && (!g.axis || !run.axis || v3.dot(g.axis, run.axis) > 1 - 1e-9)) {
      run.ids.push(i);
      run.axis ??= g.axis;
    } else runs.push((run = { ids: [i], axis: g.axis }));
  }
  if (!legs.some((g) => g.carry) && runs.length > 1) {
    const last = runs[runs.length - 1]!;
    const first = runs[0]!;
    if (!last.axis || !first.axis || v3.dot(last.axis, first.axis) > 1 - 1e-9) {
      first.ids.unshift(...last.ids);
      first.axis ??= last.axis;
      runs.pop();
    }
  }
  const rolls: Roll[][] = slots.map((s) => s.legs.map(() => null));
  for (const u of runs) {
    const H = u.ids.reduce((a, i) => a + legs[i]!.h, 0);
    if (!u.axis || H / r < 1e-9) continue;
    const k = (TAU * Math.max(1, Math.round(H / r / TAU))) / H;
    let a = 0;
    for (const i of u.ids) {
      const g = legs[i]!;
      rolls[g.j]![g.l] = { axis: u.axis, a0: a, a1: (a += g.h * k) };
    }
  }
  return rolls;
}

/**
 * How far a part that starts a slot has rolled at the phase `deg` (0 to 360), as an axis and angle (null: not turned):
 * the legs in order over their windows, as `slotAt` moves it; before the first, as the previous slot's last leg left it.
 */
export function rollAt(legs: Leg[], rolls: Roll[], before: Roll, deg: number): { axis: Vec3; a: number } | null {
  let st = before ? { axis: before.axis, a: before.a1 } : null;
  for (let l = 0; l < legs.length; l++) {
    const [lo, hi] = legs[l]!.window;
    if (deg <= lo) break;
    const R = rolls[l]!;
    st = R ? { axis: R.axis, a: R.a0 + (R.a1 - R.a0) * ease(Math.min(1, (deg - lo) / (hi - lo))) } : null;
    if (deg < hi) break;
  }
  return st;
}

/** The phase of a turn (degrees, 0 to 360) and the whole turns before it, from the crank's angle in degrees. */
export function turnOf(deg: number): { turn: number; phase: number } {
  const turn = Math.floor(deg / 360 + 1e-12);
  return { turn, phase: Math.max(0, deg - 360 * turn) };
}

/**
 * walking-beam. in: input (the crank's angle, deg: whole turns count on), crank ({ center, pin, axis }: a crank's
 * ground pivot and its pin on the beam; the beam translates by the pin's move, as parallel-cranks poses it), datum
 * (optional: a construction body that takes the beam's pose, so the seats it carries are checked by K1 against the
 * beam), parts [body] (in circuit order: part k starts the turn on slot k), slots [{ from (point), legs: [{ carry
 * (the beam's body), window [lo, hi] } | { to (point), window }] }] (the circuit, slot k ends where slot k + 1 starts),
 * track (the slot whose part the outputs read; default 1), radius (optional: the parts are round, of this radius in mm,
 * and roll where they move on their own, as `circuitRolls` gives; without it they only translate).
 * Every part moves one slot per turn: in turn t part k runs slot (k + t) mod n, so after one turn each part stands where
 * the next one stood and the picture is the same. A part on a seat while the beam is above its rails moves with the
 * beam without turning; it rests in its notch, or rolls on its track, otherwise. Its turn depends only on where it is on
 * the circuit, so each part looks after a turn as the next one did. out { advance, rise, carried }: the tracked part's
 * move from its slot's start (mm) along the slot's way in the base plane and along the base normal, and 1 while it rides
 * the beam.
 */
const walkingBeam: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const deg = c.num(i.input);
  const cr = (i.crank ?? {}) as Record<string, unknown>;
  const O = c.refVec(cr.center);
  const A = c.refVec(cr.pin);
  const axis = v3.unit(cr.axis ? c.vec(cr.axis) : [0, 1, 0]);
  const beam = (d: number): Vec3 => v3.sub(xf.apply(xf.rotAbout(O, axis, d * D2R), A), A);
  const parts = (i.parts as unknown[] | undefined)?.map((p) => str(p, "walking-beam.parts")) ?? [];
  const slots = readSlots(c, s);
  if (parts.length !== slots.length) throw new KinError(`walking-beam ${s.id}: ${parts.length} parts on ${slots.length} slots; one part per slot`);
  const n = slots.length;
  // the circuit closes: each slot ends where the next begins
  for (let k = 0; k < n; k++) {
    const end = slotAt(slots[k]!.from, slots[k]!.legs, 360, beam);
    const next = slots[(k + 1) % n]!.from;
    if (v3.dist(end, next) > 1e-6) throw new KinError(`walking-beam ${s.id}: slot ${k} ends ${v3.dist(end, next).toFixed(4)} mm from where slot ${(k + 1) % n} starts`);
  }
  const radius = i.radius !== undefined ? c.num(i.radius) : 0;
  const rolls = radius > 0 ? circuitRolls(slots, radius, beam) : null;
  const { turn, phase } = turnOf(deg);
  for (let k = 0; k < n; k++) {
    const j = (((k + turn) % n) + n) % n;
    const p = slotAt(slots[j]!.from, slots[j]!.legs, phase, beam);
    const T = xf.trans(v3.sub(p, slots[k]!.from));
    const prev = rolls?.[(j + n - 1) % n];
    const r = rolls ? rollAt(slots[j]!.legs, rolls[j]!, prev![prev!.length - 1] ?? null, phase) : null;
    // turned about its own centre where it started, then carried to where it is
    c.setXf(parts[k]!, r ? xf.mul(T, xf.rotAbout(slots[k]!.from, r.axis, r.a)) : T);
  }
  if (typeof i.datum === "string" && typeof i.beam === "string") c.setXf(i.datum, c.xf(i.beam));
  const tk = Math.min(n - 1, Math.max(0, Math.round(i.track !== undefined ? c.num(i.track) : 1)));
  const t = slots[tk]!;
  const p = slotAt(t.from, t.legs, phase, beam);
  // the advance is read along the slot's own way in the base plane (from its start to its end), so the record may face
  // the transfer any way round; the rise is along the base normal
  const d = v3.sub(slotAt(t.from, t.legs, 360, beam), t.from);
  const way = Math.hypot(d[0], d[1]) > 1e-9 ? v3.unit([d[0], d[1], 0]) : ([1, 0, 0] as Vec3);
  const moved = v3.sub(p, t.from);
  outVal(c, s, v3.dot(moved, way), "advance");
  outVal(c, s, moved[2], "rise");
  outVal(c, s, t.legs.some((l) => l.carry && phase > l.window[0] && phase < l.window[1]) ? 1 : 0, "carried");
};

function readSlots(c: BlockCtx, s: SolveStep): { from: Vec3; legs: Leg[] }[] {
  const raw = (s.in?.slots as Record<string, unknown>[] | undefined) ?? [];
  return raw.map((q, k) => {
    const legs = ((q.legs as Record<string, unknown>[] | undefined) ?? []).map((l): Leg => {
      const w = l.window as unknown[] | undefined;
      if (!Array.isArray(w) || w.length !== 2) throw new KinError(`walking-beam ${s.id}: slot ${k} has a leg with no window`);
      const window: [number, number] = [c.num(w[0]), c.num(w[1])];
      if (!(window[0] >= 0 && window[1] <= 360 && window[0] < window[1])) throw new KinError(`walking-beam ${s.id}: slot ${k}: window ${window.join(" to ")} is not inside the turn`);
      if (l.carry !== undefined) return { carry: true, window };
      return { carry: false, to: c.refVec(l.to), window };
    });
    return { from: c.refVec(q.from), legs };
  });
}

export const TRANSFER_BLOCKS: Record<string, BlockFn> = {
  "walking-beam": walkingBeam,
};
