// The explode (standard E1 to E10): the build taken apart as it was put together, worked out once the whole build exists.
// The main parts, the ones that show how the mechanism works, come apart one by one; the small supporting hardware goes
// with what it supports, so the explode does not scatter screws and washers: a fastener with the part it holds, stack
// hardware (washers, spacers, shims, collars, keys, circlips) with the support block or plate it sits in, else its shaft,
// else the main part on its joint, posts with their bridge, a pressed or bonded part with the part it sits in (a bearing
// in its housing, a dowel, a bushing), and the motor with its bracket, pulleys, belt and sensing parts. The fixed structure lifts off the base (or drops below it, for what hangs under it); a
// moving body slides out along its own joint axis, away from the middle of the mechanism; a fastener backs out along its
// axis to its head side. A sweep in disassembly order then sets how far each unit goes: it clears, by a gap that grows
// with its size, every unit it sits on or around, so at full explode nothing is inside another part. Shafts leave after
// the parts on them and fasteners after the parts they pass through; what leaves sideways goes before the stack on the
// base, in reverse assembly order. The distance is stored as levels of
// FORM.explode.gap and the direction as `exAxis`, in the body's own frame, so a part that swings explodes along its axis
// as posed.
import { type Vec3, v3 } from "../../kin/math";
import { mat4 } from "../../solids/frame";
import { tessellate } from "../../solids/tessellate";
import type { Solid3 } from "../../solids/types";
import { FORM } from "../../style/form";
import type { Rule } from "./types";

/** Parts pressed or bonded into another: they move with the part they sit in (E5). */
const PRESSED = new Set(["bearing", "bearingBalls", "bearingCage", "bushing", "dowel", "circlipInternal", "wearStrip", "sleeve"]);
/** Parts a pressed one can sit in. */
const HOSTS = new Set(["housing", "part", "bracket", "bridge", "plate", "base", "roller"]);
/** The bought drive unit that stays whole (E6): motor and bracket, with the motor's pulley, its shaft, the belt and the
 * sensing parts and wiring on the ground. */
const DRIVE = new Set(["motor", "motorInternal", "bracket", "pulley", "belt", "shaft", "sensor", "terminalBlock", "cableClip", "lead"]);
/** Fastening hardware: it goes with the part it holds. */
const FASTENER = new Set(["head", "shank", "nut", "setScrew"]);
/** Stack hardware: it goes with the support it sits in, else its shaft, else the part on its joint. */
const STACK = new Set(["spacer", "washer", "thrustWasher", "waveWasher", "shim", "circlipExternal", "collar", "key", "sleeve", "retainerPlate"]);
/** Supports that take their hardware with them. */
const SUPPORT = new Set(["housing", "bracket", "bridge", "plate", "standoff"]);
/** Posts: they go with the bridge they carry. */
const POSTS = new Set(["standoff", "spigot"]);

type Box = [number, number, number, number, number, number];
type Tier = 0 | 1 | 2;

interface Unit {
  solids: Solid3[];
  /** Its overall box, and the box of each of its solids (the overlap test is solid by solid). */
  box: Box;
  boxes: Box[];
  /** World direction it leaves along (unit), and its place in the order: 0 parts, 1 shafts, 2 fasteners. */
  dir: Vec3;
  tier: Tier;
  base: boolean;
  /** Distance at full explode, mm. */
  t: number;
  done: boolean;
}

/** The box of a solid in the build's coordinates: its outline swept by its operation, through its frame. */
function boxOf(s: Solid3): Box {
  const pos = s.mesh?.pos ?? tessellate({ outer: s.profile.outer, holes: [] }, s.op).pos;
  let x0 = Infinity, y0 = Infinity, z0 = Infinity, x1 = -Infinity, y1 = -Infinity, z1 = -Infinity;
  for (let i = 0; i < pos.length; i += 3) {
    x0 = Math.min(x0, pos[i]!); x1 = Math.max(x1, pos[i]!);
    y0 = Math.min(y0, pos[i + 1]!); y1 = Math.max(y1, pos[i + 1]!);
    z0 = Math.min(z0, pos[i + 2]!); z1 = Math.max(z1, pos[i + 2]!);
  }
  const m = mat4(s.frame);
  const out: Box = [Infinity, Infinity, Infinity, -Infinity, -Infinity, -Infinity];
  for (const x of [x0, x1]) for (const y of [y0, y1]) for (const z of [z0, z1]) {
    const p = [m[0]! * x + m[4]! * y + m[8]! * z + m[12]!, m[1]! * x + m[5]! * y + m[9]! * z + m[13]!, m[2]! * x + m[6]! * y + m[10]! * z + m[14]!];
    for (let k = 0; k < 3; k++) {
      out[k] = Math.min(out[k]!, p[k]!);
      out[k + 3] = Math.max(out[k + 3]!, p[k]!);
    }
  }
  return out;
}

/** The volume two boxes share once each is grown by `g` mm on every side (touching parts share a sliver). */
const shared = (a: Box, b: Box, g = 0.6) => {
  let v = 1;
  for (let k = 0; k < 3; k++) v *= Math.max(0, Math.min(a[k + 3]! + g, b[k + 3]! + g) - Math.max(a[k]! - g, b[k]! - g));
  return v;
};
const union = (a: Box, b: Box): Box => [Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.min(a[2], b[2]), Math.max(a[3], b[3]), Math.max(a[4], b[4]), Math.max(a[5], b[5])];
const centre = (b: Box): Vec3 => [(b[0] + b[3]) / 2, (b[1] + b[4]) / 2, (b[2] + b[5]) / 2];
const volume = (b: Box) => Math.max(0, b[3] - b[0]) * Math.max(0, b[4] - b[1]) * Math.max(0, b[5] - b[2]);
const inside = (p: Vec3, b: Box, tol = 0.5) => p[0] >= b[0] - tol && p[0] <= b[3] + tol && p[1] >= b[1] - tol && p[1] <= b[4] + tol && p[2] >= b[2] - tol && p[2] <= b[5] + tol;
const corners = (b: Box): Vec3[] => [b[0], b[3]].flatMap((x) => [b[1], b[4]].flatMap((y) => [b[2], b[5]].map((z): Vec3 => [x, y, z])));

/** A box's extent along a direction: [from, to]. */
function along(b: Box, d: Vec3): [number, number] {
  let lo = Infinity, hi = -Infinity;
  for (const c of corners(b)) {
    const t = v3.dot(c, d);
    lo = Math.min(lo, t);
    hi = Math.max(hi, t);
  }
  return [lo, hi];
}

/** Two directions across `d`. */
function across(d: Vec3): [Vec3, Vec3] {
  const a = v3.unit(v3.cross(d, Math.abs(d[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]));
  return [a, v3.cross(d, a)];
}

/** True when the two boxes, moved by their shifts, overlap seen down `d` (by more than a touch). */
function overlapAcross(a: Box, sa: Vec3, b: Box, sb: Vec3, d: Vec3): boolean {
  for (const e of across(d)) {
    const [a0, a1] = along(a, e), [b0, b1] = along(b, e);
    const oa = v3.dot(sa, e), ob = v3.dot(sb, e);
    if (Math.min(a1 + oa, b1 + ob) - Math.max(a0 + oa, b0 + ob) <= FORM.explode.touch) return false;
  }
  return true;
}

/** The farthest point along `d` of the solids of `i` (shifted by `si`) that overlap a solid of `j` seen down `d`, or null. */
function reach(i: Unit, si: Vec3, j: Unit, d: Vec3): number | null {
  let hi: number | null = null;
  for (const bi of i.boxes)
    for (const bj of j.boxes)
      if (overlapAcross(bj, [0, 0, 0], bi, si, d)) {
        const e = along(bi, d)[1] + v3.dot(si, d);
        if (hi === null || e > hi) hi = e;
      }
  return hi;
}

export const explode: Rule = {
  id: "explode",
  tier: "AUTO",
  ids: ["E1", "E2", "E3", "E5", "E6", "E7", "E8", "E10"],
  fixture: "four-bar",
  applies: () => true,
  apply() {},
  last(ctx) {
    const S = ctx.solids;
    const n = S.length;
    const boxes = S.map(boxOf);
    // rigid units: union-find over the solids
    const up = S.map((_, i) => i);
    const find = (i: number): number => (up[i] === i ? i : (up[i] = find(up[i]!)));
    const join = (a: number, b: number) => {
      const ra = find(a), rb = find(b);
      if (ra !== rb) up[rb] = ra;
    };
    const byGroup = new Map<string, number>();
    S.forEach((s, i) => {
      if (s.group === undefined) return;
      const g = byGroup.get(s.group);
      if (g === undefined) byGroup.set(s.group, i);
      else join(g, i);
    });
    // a pressed part goes with the smallest part of its body it sits inside (E5)
    S.forEach((s, i) => {
      if (!PRESSED.has(s.kind)) return;
      const c = centre(boxes[i]!);
      let best = -1;
      S.forEach((h, k) => {
        if (k === i || PRESSED.has(h.kind) || !HOSTS.has(h.kind) || h.body !== s.body || !inside(c, boxes[k]!)) return;
        if (best < 0 || volume(boxes[k]!) < volume(boxes[best]!)) best = k;
      });
      if (best >= 0) join(best, i);
    });
    // the motor stays whole with its bracket, pulley and belt (E6); the base keeps its feet
    const drive = S.map((s, i) => (s.body === "ground" && s.joints.includes("drive") && DRIVE.has(s.kind) ? i : -1)).filter((i) => i >= 0);
    for (const i of drive.slice(1)) join(drive[0]!, i);
    const baseIdx = S.findIndex((s) => s.flags.isBase);
    if (baseIdx >= 0) S.forEach((s, i) => s.kind === "foot" && join(baseIdx, i));
    // supporting hardware goes with what it supports: the candidate it shares most with, among those `ok` allows
    const hostOf = (i: number, ok: (k: number) => boolean): number => {
      let best = -1, most = 0;
      S.forEach((_, k) => {
        if (k === i || k === baseIdx || find(k) === find(i) || !ok(k)) return;
        const v = shared(boxes[i]!, boxes[k]!);
        if (v > most) {
          most = v;
          best = k;
        }
      });
      return best;
    };
    const hw = (k: number) => FASTENER.has(S[k]!.kind) || STACK.has(S[k]!.kind) || PRESSED.has(S[k]!.kind);
    const shareJoint = (i: number, k: number) => S[i]!.joints.some((j) => S[k]!.joints.includes(j));
    // hardware already riding something (a bolt's washer in the bolt's group) stays where it is: hosting it again would
    // chain two main parts into one
    const ridden = (i: number, also: Set<string> = new Set()) => S.some((t, k) => find(k) === find(i) && !hw(k) && !also.has(t.kind));
    S.forEach((s, i) => {
      if (!FASTENER.has(s.kind) || ridden(i)) return;
      const h = hostOf(i, (k) => !FASTENER.has(S[k]!.kind) && !STACK.has(S[k]!.kind));
      if (h >= 0) join(h, i);
    });
    S.forEach((s, i) => {
      if (!STACK.has(s.kind) || ridden(i)) return;
      const h = [(k: number) => SUPPORT.has(S[k]!.kind) && S[k]!.body === "ground", (k: number) => S[k]!.kind === "shaft", (k: number) => !hw(k) && shareJoint(i, k)]
        .map((ok) => hostOf(i, ok))
        .find((k) => k >= 0);
      if (h !== undefined) join(h, i);
    });
    S.forEach((s, i) => {
      if (!POSTS.has(s.kind) || ridden(i, POSTS)) return;
      const h = hostOf(i, (k) => S[k]!.kind === "bridge");
      if (h >= 0) join(h, i);
    });

    const members = new Map<number, number[]>();
    for (let i = 0; i < n; i++) {
      const r = find(i);
      if (!members.has(r)) members.set(r, []);
      members.get(r)!.push(i);
    }
    const baseTop = baseIdx >= 0 ? boxes[baseIdx]![5] : -Infinity;
    const all = [...members.values()];
    const mid = centre(all.filter((m) => !m.includes(baseIdx)).flatMap((m) => m.map((i) => boxes[i]!)).reduce(union, [Infinity, Infinity, Infinity, -Infinity, -Infinity, -Infinity] as Box));
    const units: Unit[] = all.map((m) => {
      const ss = m.map((i) => S[i]!);
      const box = m.map((i) => boxes[i]!).reduce(union);
      const c = centre(box);
      const base = m.includes(baseIdx);
      const head = ss.find((s) => s.kind === "head");
      const shank = ss.find((s) => s.kind === "shank");
      const vertical = (): Vec3 => (c[2] >= baseTop ? [0, 0, 1] : [0, 0, -1]);
      let dir: Vec3;
      let tier: Tier = 0;
      if ((head || shank || ss.every((s) => s.kind === "setScrew" || s.kind === "nut")) && m.every(hw)) {
        // a fastener backs out along its axis to its head side (E3)
        tier = 2;
        const a = v3.unit((head ?? shank ?? ss[0]!).frame.z);
        if (head && shank) {
          const s = Math.sign(v3.dot(v3.sub(centre(boxes[S.indexOf(head)]!), centre(boxes[S.indexOf(shank)]!)), a)) || 1;
          dir = v3.mul(a, s);
        } else dir = Math.abs(a[2]) > 0.7 ? vertical() : a;
      } else if (ss.every((s) => s.body === "ground")) dir = vertical();
      else {
        // a moving body leaves along its main part's axis, away from the middle; a shaft away from what it carries, the
        // side it went in from (E8); a vertical one upward
        const main = m.reduce((a, b) => (volume(boxes[b]!) > volume(boxes[a]!) ? b : a));
        const a = v3.unit(S[main]!.frame.z);
        // a shaft with its hardware (keys, collars, an end screw) leaves after the parts on it
        if (ss.some((s) => s.kind === "shaft") && m.every((k) => S[k]!.kind === "shaft" || hw(k))) tier = 1;
        let from = mid;
        if (tier === 1) {
          // the volume-weighted middle of the moving parts it passes through (what it carries, not what holds it)
          let w = 0;
          let acc: Vec3 = [0, 0, 0];
          S.forEach((t, k) => {
            if (m.includes(k) || t.body === "ground" || !m.some((i) => shared(boxes[i]!, boxes[k]!, 0) > 0)) return;
            const v = volume(boxes[k]!);
            acc = v3.add(acc, v3.mul(centre(boxes[k]!), v));
            w += v;
          });
          if (w > 0) from = v3.mul(acc, 1 / w);
        }
        if (Math.abs(a[2]) > 0.7) dir = vertical();
        else {
          const s = Math.sign(v3.dot(v3.sub(c, from), a)) || 1;
          dir = v3.mul(a, s);
        }
      }
      return { solids: ss, box, boxes: m.map((i) => boxes[i]!), dir, tier, base, t: 0, done: base };
    });

    // the sweep, in reverse assembly order: what a joint holds leaves before what holds it, so the families that leave
    // sideways (shafts and what they carry, yokes, a cylinder on its trunnion) go first, then the upward stack from the
    // base, then what hangs below it
    const fam = (u: Unit) => units.filter((v) => !v.base && v3.dot(v.dir, u.dir) > 0.985);
    const seen = new Set<Unit>();
    const families: Unit[][] = [];
    const rank = (u: Unit) => (u.dir[2] > 0.7 ? 1 : u.dir[2] < -0.7 ? 2 : 0);
    const ordered = [...units].filter((u) => !u.base).sort((a, b) => rank(a) - rank(b));
    for (const u of ordered) {
      if (seen.has(u)) continue;
      const f = fam(u);
      f.forEach((v) => seen.add(v));
      families.push(f);
    }
    const shift = (u: Unit): Vec3 => v3.mul(u.dir, u.t);
    const C = FORM.explode.clear;
    for (const f of families) {
      const d = f[0]!.dir;
      f.sort((a, b) => a.tier - b.tier || along(a.box, d)[0] - along(b.box, d)[0]);
      for (const j of f) {
        const [s0, s1] = along(j.box, d);
        const gap = Math.max(C.min, Math.min(C.max, C.k * (s1 - s0)));
        let t = 0;
        for (const i of units) {
          if (i === j) continue;
          // what j must clear: units already placed (the base, earlier families and earlier members of this one), and units
          // of a later family that it would otherwise be left inside
          // only what lies below it as assembled; how far that has gone already decides the clearance
          const [i0] = along(i.box, d);
          if (i0 >= s1 - FORM.explode.touch) continue;
          if (!i.done && f.includes(i)) continue;
          if (!overlapAcross(j.box, [0, 0, 0], i.box, shift(i), d)) continue;
          const top = reach(i, shift(i), j, d);
          if (top !== null) t = Math.max(t, top - s0 + gap);
        }
        j.t = t;
        j.done = true;
      }
    }
    const L = FORM.explode.gap;
    for (const u of units)
      for (const s of u.solids) {
        if (u.base) {
          s.ex = 0;
          delete s.exAxis;
          continue;
        }
        s.ex = Math.round((u.t / L) * 100) / 100;
        s.exAxis = [Math.round(u.dir[0] * 1e4) / 1e4 + 0, Math.round(u.dir[1] * 1e4) / 1e4 + 0, Math.round(u.dir[2] * 1e4) / 1e4 + 0];
      }
    (ctx.fired.explode ??= []).push(`${S.length} solids in ${units.length} units`);
  },
};
