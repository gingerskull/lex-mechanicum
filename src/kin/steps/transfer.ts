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
 * track (the slot whose part the outputs read; default 1).
 * Every part moves one slot per turn: in turn t part k runs slot (k + t) mod n, so after one turn each part stands where
 * the next one stood and the picture is the same; the parts translate (a round part's own turn does not show). A part
 * on a seat while the beam is above its rails moves with the beam; it rests in its notch, or rolls and slides on its
 * track, otherwise. out { advance, rise, carried }: the tracked part's move along x and z from its slot's start (mm),
 * and 1 while it rides the beam.
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
  const { turn, phase } = turnOf(deg);
  for (let k = 0; k < n; k++) {
    const j = (((k + turn) % n) + n) % n;
    const p = slotAt(slots[j]!.from, slots[j]!.legs, phase, beam);
    c.setXf(parts[k]!, xf.trans(v3.sub(p, slots[k]!.from)));
  }
  if (typeof i.datum === "string" && typeof i.beam === "string") c.setXf(i.datum, c.xf(i.beam));
  const tk = Math.min(n - 1, Math.max(0, Math.round(i.track !== undefined ? c.num(i.track) : 1)));
  const t = slots[tk]!;
  const p = slotAt(t.from, t.legs, phase, beam);
  outVal(c, s, p[0] - t.from[0], "advance");
  outVal(c, s, p[2] - t.from[2], "rise");
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
