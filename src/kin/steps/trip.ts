// A rack stepped by an indexer and carried back once a cycle with its pinion out of mesh, and flaps tipped over by a
// finger on the carrier as it reaches each station and held there (bistable), folded by a reset tab on the way back.
import { type BlockFn, KinError } from "../ctx";
import { D2R, R2D, v3, xf } from "../math";
import { outVal, spin, str } from "./shared";

const clamp01 = (x: number): number => Math.max(0, Math.min(1, x));
/** The cycloidal ease: 0 to 1 with zero speed at both ends. */
const ease = (s: number): number => s - Math.sin(2 * Math.PI * s) / (2 * Math.PI);

/**
 * rack-release. in: joint (the rack's `gear-mesh` joint: radiusA, axis2), input (the pinion's turn, deg: an indexer's
 * angle), step (deg of pinion per index), steps (the indexes made in mesh each cycle). The cycle holds steps + 1 indexes:
 * the rack follows the pinion through the first `steps`, then on the last one it is out of mesh and is carried back to
 * its start in step with that index (the pinion's own law), so the cycle closes. The joint's `active` window leaves the
 * last index out of the mesh's K1 check. The count is taken within the cycle, so the next cycle plays as the first
 * while the stage's clock runs on. out { travel (mm along axis2), back (0 in mesh, 0 to 1 over the return), reach
 * (the farthest travel of this cycle so far: the travel in mesh, the far end over the return) }.
 */
const rackRelease: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const jid = str(i.joint, "rack-release.joint");
  const j = c.joint(jid);
  if (j.radiusA === undefined) throw new KinError(`rack-release ${s.id}: joint ${jid} needs radiusA (the pinion's pitch radius)`);
  const r = c.num(j.radiusA);
  const axis = j.axis2 ? v3.unit(c.vec(j.axis2)) : c.jointAxis(jid);
  const dA = c.delta("in", c.rad(i.input));
  const step = Math.abs(c.num(i.step)) * D2R;
  const steps = c.num(i.steps);
  // indexes made since the reference (the cycle's start, the carriage home): the indexer's angle runs on while the stage
  // plays past one cycle, so the count is taken within this cycle, 0 to steps + 1
  const n = Math.abs(dA) / step;
  const w = n % (steps + 1);
  const sg = dA < 0 ? -1 : 1;
  let t = r * sg * w * step;
  let back = 0;
  let reach = t;
  if (w > steps) {
    back = Math.min(1, w - steps);
    reach = r * sg * steps * step;
    t = reach * (1 - back);
  }
  c.setXf(j.b, xf.trans(v3.mul(axis, t)));
  outVal(c, s, t, "travel");
  outVal(c, s, back, "back");
  outVal(c, s, reach, "reach");
};

/**
 * trip. in: travel (a value: the carrier's travel, mm), reach (a value: its farthest travel this cycle, from rack-release;
 * default the travel), at (its travel at the station), lead (mm of travel over which the
 * finger turns the flap, ending at the station), sense (−1: the carrier trips moving toward −travel, the default; +1),
 * back (a value: the return's progress, 0 in mesh), fold ({ at, lead }: the reset tab folds the flap while the carrier,
 * going back, runs `at` past the station, over `lead` mm), turn (deg, folded to up), body (the flap), joint (its
 * revolute), add (a value: the flaps up before this one). The flap follows the finger by the cycloidal ease and holds
 * where it is left (a toggle spring each side of centre). out { angle (deg), state (0 folded, 1 up), count (add + state) }.
 */
const trip: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const travel = c.num(i.travel);
  const at = c.num(i.at);
  const lead = c.num(i.lead);
  const sense = i.sense === undefined ? -1 : c.num(i.sense) >= 0 ? 1 : -1;
  const back = i.back === undefined ? 0 : c.num(i.back);
  const reach = i.reach === undefined ? travel : c.num(i.reach);
  const d = sense * (travel - at); // past the station in the tripping direction (mm), negative before it
  // tripped as far as the carrier has reached: a flap stays up while the carrier goes back
  let state = clamp01((sense * (reach - at)) / lead + 1);
  if (back > 0 && i.fold && typeof i.fold === "object") {
    const f = i.fold as { at: unknown; lead: unknown };
    const q = clamp01((-d - c.num(f.at)) / c.num(f.lead) + 0.5);
    state = Math.min(state, 1 - q);
  }
  const jid = str(i.joint, "trip.joint");
  // the angle from folded; the body turns by its change from the reference pose, where it is drawn
  const ang = c.num(i.turn) * D2R * ease(state);
  spin(c, str(i.body, "trip.body"), c.jointAt(jid), c.jointAxis(jid), c.delta("angle", ang));
  outVal(c, s, ang * R2D, "angle");
  outVal(c, s, state, "state");
  outVal(c, s, (i.add === undefined ? 0 : c.num(i.add)) + state, "count");
};

export const TRIP_BLOCKS: Record<string, BlockFn> = {
  "rack-release": rackRelease,
  trip,
};
