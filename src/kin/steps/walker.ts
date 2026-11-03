// A walker that rides on its lower foot, and the carry of parts solved in a moving body's own frame.
//
// walker: planar legs on a body that hangs on a slide (a two-legged Klann walker on its treadmill). The input turns the
// crank shaft in the body; each leg is a chain of dyads and rigid points in the body's plane, so both feet are known in
// the body. The body rests on whichever foot is lower: along the slide it stands at its rest height less that foot's
// height above the lowest point of the foot path, so the lower foot stays on the floor and the body bobs at each change
// of feet. A belt under the feet is driven by the lower foot without slip: its travel is that foot's motion along the
// belt, summed piece by piece between the changes of feet, and the drums it runs on turn by the travel over their radius.
//
// carry: bodies an earlier block solved in a carrier's reference frame (a cam and its rocker inside the walker's body)
// are carried by the carrier's motion.
import { type BlockFn, type BlockCtx, KinError } from "../ctx";
import { D2R, R2D, type Vec3, v3, xf } from "../math";
import { dyadRRR } from "../blocks/linkage";
import { outVal, str } from "./shared";

type V2 = [number, number];

interface Link {
  /** The point this entry makes (a joint id). */
  id: string;
  kind: "dyad" | "rigid";
  /** dyad: the two points it closes on; rigid: the two points of the body that carries it. */
  p: string;
  q: string;
  /** dyad: the two lengths and the side (+1 left of p→q); rigid: the point in the frame p→q. */
  a: number;
  b: number;
  side: 1 | -1;
}

interface Leg {
  pin: string;
  links: Link[];
  foot: string;
  toes?: string;
}

/** The walker's fixed geometry, in its plane's coordinates (u along e1, v along e2) about the crank centre. */
interface Geo {
  o: Vec3;
  e1: Vec3;
  e2: Vec3;
  n: Vec3;
  up: V2;
  dir: V2;
  ref: Map<string, V2>;
  w: Map<string, number>;
  legs: Leg[];
  hmin: number;
  /** The changes of feet in a turn, input degrees after the reference. */
  switches: number[];
  turn: number;
}

const cache = new Map<string, Geo>();

const rot2 = (p: V2, a: number): V2 => [p[0] * Math.cos(a) - p[1] * Math.sin(a), p[0] * Math.sin(a) + p[1] * Math.cos(a)];
const dot2 = (a: V2, b: V2): number => a[0] * b[0] + a[1] * b[1];

/** Every point of every leg, in the plane, with the crank turned by `d` (radians) from the reference. */
function legPoints(g: Geo, leg: Leg, d: number): Map<string, V2> {
  const out = new Map<string, V2>();
  const at = (id: string): V2 => out.get(id) ?? g.ref.get(id)!;
  out.set(leg.pin, rot2(g.ref.get(leg.pin)!, d));
  for (const l of leg.links) {
    const P = at(l.p);
    const Q = at(l.q);
    if (l.kind === "rigid") {
      const ex: V2 = [Q[0] - P[0], Q[1] - P[1]];
      const L = Math.hypot(ex[0], ex[1]);
      const e: V2 = [ex[0] / L, ex[1] / L];
      out.set(l.id, [P[0] + e[0] * l.a - e[1] * l.b, P[1] + e[1] * l.a + e[0] * l.b]);
      continue;
    }
    const s = dyadRRR([P[0], P[1], 0], [Q[0], Q[1], 0], l.a, l.b, [0, 0, 1]);
    if (!s.reachable) throw new KinError(`walker: ${l.id} cannot close at ${(d * R2D).toFixed(2)}°`);
    const r = s.roots[l.side === 1 ? 0 : 1];
    out.set(l.id, [r[0], r[1]]);
  }
  return out;
}

const footAt = (g: Geo, leg: Leg, d: number): V2 => legPoints(g, leg, d).get(leg.foot)!;
const heightAt = (g: Geo, leg: Leg, d: number): number => dot2(footAt(g, leg, d), g.up);

/** The leg that is lower at turn d (index into g.legs). */
function lowerAt(g: Geo, d: number): number {
  let k = 0;
  let h = Infinity;
  g.legs.forEach((leg, i) => {
    const hi = heightAt(g, leg, d);
    if (hi < h) {
      h = hi;
      k = i;
    }
  });
  return k;
}

/** The lower foot's height at turn d. */
const lowest = (g: Geo, d: number): number => Math.min(...g.legs.map((leg) => heightAt(g, leg, d)));

/** The belt's travel (mm along dir) between turns a ≤ b within one turn after the reference: piecewise on the lower foot. */
function travelWithin(g: Geo, a: number, b: number): number {
  const cuts = [a, ...g.switches.filter((s) => s > a + 1e-12 && s < b - 1e-12), b];
  let t = 0;
  for (let i = 0; i + 1 < cuts.length; i++) {
    const leg = g.legs[lowerAt(g, (cuts[i]! + cuts[i + 1]!) / 2)]!;
    const p = footAt(g, leg, cuts[i]!);
    const q = footAt(g, leg, cuts[i + 1]!);
    t += dot2([q[0] - p[0], q[1] - p[1]], g.dir);
  }
  return t;
}

function geometry(c: BlockCtx, key: string, i: Record<string, unknown>): Geo {
  const hit = cache.get(key);
  if (hit) return hit;
  const center = str(i.center, "walker.center");
  const o = c.jointAt(center);
  const n = v3.unit(c.jointAxis(center));
  const slide = str(i.slide, "walker.slide");
  const upW = v3.unit(c.jointAxis(slide));
  // the plane's axes: e2 the slide's direction (up), e1 square to it in the plane
  const e2 = v3.unit(v3.perp(upW, n));
  const e1 = v3.cross(e2, n);
  const ref = new Map<string, V2>();
  const w = new Map<string, number>();
  const put = (id: string) => {
    if (ref.has(id)) return;
    const p = v3.sub(c.refVec(id), o);
    ref.set(id, [v3.dot(p, e1), v3.dot(p, e2)]);
    w.set(id, v3.dot(p, n));
  };
  const belt = (i.belt ?? {}) as Record<string, unknown>;
  const dW = v3.unit(c.vec(belt.dir ?? [-1, 0, 0]));
  const legs: Leg[] = ((i.legs as Record<string, unknown>[] | undefined) ?? []).map((L, k) => {
    const pin = str(L.pin, `walker.legs[${k}].pin`);
    put(pin);
    const links: Link[] = ((L.chain as Record<string, unknown>[] | undefined) ?? []).map((e) => {
      const dyad = typeof e.dyad === "string";
      const id = str(dyad ? e.dyad : e.rigid, "walker chain entry");
      const [p, q] = ((dyad ? e.from : e.on) as unknown[]).map((x) => str(x, `walker ${id}`)) as [string, string];
      [id, p, q].forEach(put);
      const X = ref.get(id)!;
      const P = ref.get(p)!;
      const Q = ref.get(q)!;
      if (dyad) {
        const cr = (Q[0] - P[0]) * (X[1] - P[1]) - (Q[1] - P[1]) * (X[0] - P[0]);
        return { id, kind: "dyad", p, q, a: Math.hypot(X[0] - P[0], X[1] - P[1]), b: Math.hypot(X[0] - Q[0], X[1] - Q[1]), side: cr >= 0 ? 1 : -1 };
      }
      const ex: V2 = [Q[0] - P[0], Q[1] - P[1]];
      const Lx = Math.hypot(ex[0], ex[1]);
      const u: V2 = [ex[0] / Lx, ex[1] / Lx];
      const r: V2 = [X[0] - P[0], X[1] - P[1]];
      return { id, kind: "rigid", p, q, a: dot2(r, u), b: -r[0] * u[1] + r[1] * u[0], side: 1 };
    });
    const foot = str(L.foot, `walker.legs[${k}].foot`);
    put(foot);
    return { pin, links, foot, toes: typeof L.toes === "string" ? L.toes : undefined };
  });
  if (legs.length < 2) throw new KinError("walker: two legs or more");
  const g: Geo = { o, e1, e2, n, up: [0, 1], dir: [v3.dot(dW, e1), v3.dot(dW, e2)], ref, w, legs, hmin: 0, switches: [], turn: 0 };
  // the floor: the lowest point of the lower foot over a turn, refined by golden section about the sampled least
  const N = 1440;
  const step = (2 * Math.PI) / N;
  let kMin = 0;
  let hMin = Infinity;
  const hs: number[][] = [];
  for (let k = 0; k < N; k++) {
    const d = k * step;
    hs.push(legs.map((leg) => heightAt(g, leg, d)));
    const h = Math.min(...hs[k]!);
    if (h < hMin) {
      hMin = h;
      kMin = k;
    }
  }
  let lo = (kMin - 1) * step;
  let hi = (kMin + 1) * step;
  const phi = (Math.sqrt(5) - 1) / 2;
  for (let it = 0; it < 200; it++) {
    const x1 = hi - phi * (hi - lo);
    const x2 = lo + phi * (hi - lo);
    if (lowest(g, x1) < lowest(g, x2)) hi = x2;
    else lo = x1;
  }
  g.hmin = lowest(g, (lo + hi) / 2);
  // the changes of feet: where the lower foot changes, each bisected to the double's resolution
  const low = (k: number) => {
    const r = hs[((k % N) + N) % N]!;
    return r.indexOf(Math.min(...r));
  };
  for (let k = 0; k < N; k++) {
    if (low(k) === low(k + 1)) continue;
    const [A, B] = [low(k), low(k + 1)];
    const f = (d: number) => heightAt(g, legs[A]!, d) - heightAt(g, legs[B]!, d);
    let a = k * step;
    let b = (k + 1) * step;
    const fa = f(a);
    for (let it = 0; it < 200 && b - a > 1e-15; it++) {
      const m = (a + b) / 2;
      if (Math.sign(f(m)) === Math.sign(fa)) a = m;
      else b = m;
    }
    // a change of feet a hair's breadth from the reference is the reference itself
    const s = (a + b) / 2;
    g.switches.push(s > 2 * Math.PI - 1e-12 ? 0 : s);
  }
  g.switches.sort((x, y) => x - y);
  g.turn = travelWithin(g, 0, 2 * Math.PI);
  cache.set(key, g);
  return g;
}

/** The cache key of a walker: its step, its inputs and the reference positions of every point it names. */
function keyOf(c: BlockCtx, id: string, i: Record<string, unknown>): string {
  const names = new Set<string>([String(i.center), String(i.slide)]);
  for (const L of (i.legs as Record<string, unknown>[] | undefined) ?? []) {
    names.add(String(L.pin));
    names.add(String(L.foot));
    for (const e of (L.chain as Record<string, unknown>[] | undefined) ?? []) for (const x of [e.dyad, e.rigid, ...((e.from ?? e.on ?? []) as unknown[])]) if (typeof x === "string") names.add(x);
  }
  const at = [...names].map((n) => c.refVec(n).map((v) => v.toPrecision(17)).join(","));
  const ax = [String(i.center), String(i.slide)].map((n) => c.jointAxis(n).join(","));
  return `${id}:${JSON.stringify(i)}:${at.join(";")}:${ax.join(";")}`;
}

/** The belt's travel from the reference to a turn d (radians, any sign), through whole turns. */
function travel(g: Geo, d: number): number {
  const turns = Math.floor(d / (2 * Math.PI));
  const r = d - turns * 2 * Math.PI;
  return turns * g.turn + travelWithin(g, 0, r);
}

/** The world position of a plane point of a named leg point, in the reference pose of the body. */
const world = (g: Geo, id: string, p: V2): Vec3 => v3.add(g.o, v3.add(v3.add(v3.mul(g.e1, p[0]), v3.mul(g.e2, p[1])), v3.mul(g.n, g.w.get(id) ?? 0)));

/**
 * walker. in: input (the crank angle, deg), center (the crank shaft's joint in the body: its centre and axis), slide (the
 * body's prismatic joint to the ground: its axis is up), body, turned (the bodies keyed on the crank shaft, turned by the
 * input about center), legs: [{ pin (the crank pin, a joint turned with the shaft), chain: [{ dyad: X, from: [P, Q] } |
 * { rigid: X, on: [P, Q] }] (each point a joint id, closed in order: a dyad on the reference's side of P→Q, a rigid
 * point carried by P and Q), foot (the foot's joint), toes (optional: a body on the foot kept level, carried by it) }],
 * belt: { dir (the belt's run under the feet, world), radius (its drums' radius to the belt), drums: [{ body, joint (its
 * ground revolute) }] }. Lengths, sides and offsets are the reference's. out { lift (the body's height from its rest, mm, 0 at
 * the lowest point of the foot path and below it after), travel (the belt's travel from the reference, mm), lower (the
 * index of the lower leg), foot0, foot1, ... (each foot's height above the floor in the body, mm) }.
 */
const walker: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const g = geometry(c, keyOf(c, s.id, i), i);
  const d = c.delta("in", c.rad(i.input));
  const body = str(i.body, "walker.body");
  const upW = v3.unit(c.jointAxis(str(i.slide, "walker.slide")));
  const lift = (dd: number) => g.hmin - lowest(g, dd);
  const dz = lift(d) - lift(0);
  const T = xf.trans(v3.mul(upW, dz));
  c.setXf(body, T);
  const turnX = xf.mul(T, xf.rotAbout(g.o, g.n, d));
  for (const b of (i.turned as unknown[] | undefined) ?? []) c.setXf(str(b, "walker.turned"), turnX);
  g.legs.forEach((leg) => {
    const pts = legPoints(g, leg, d);
    for (const [id, p] of pts) c.setPt(id, xf.apply(T, world(g, id, p)));
    if (leg.toes) {
      const F0 = world(g, leg.foot, g.ref.get(leg.foot)!);
      c.setXf(leg.toes, xf.trans(v3.sub(xf.apply(T, world(g, leg.foot, pts.get(leg.foot)!)), F0)));
    }
  });
  const belt = (i.belt ?? {}) as Record<string, unknown>;
  const t = travel(g, d);
  if (belt.radius !== undefined) {
    const R = c.num(belt.radius, "walker.belt.radius");
    // a drum turns the way that carries its top along the belt's run
    const dW = v3.unit(c.vec(belt.dir ?? [-1, 0, 0]));
    const spin = v3.cross(upW, dW);
    for (const b of (belt.drums as Record<string, unknown>[] | undefined) ?? []) {
      const id = str(b.body, "walker.belt.drums body");
      c.setXf(id, xf.rotAbout(c.jointAt(str(b.joint, "walker.belt.drums joint")), spin, t / R));
    }
  }
  outVal(c, s, lift(d), "lift");
  outVal(c, s, t, "travel");
  outVal(c, s, lowerAt(g, d), "lower");
  g.legs.forEach((leg, k) => outVal(c, s, heightAt(g, leg, d) - g.hmin, `foot${k}`));
  void D2R;
};

/**
 * carry. in: carrier (a body), bodies (solved by earlier blocks in the carrier's reference frame): each is carried by it.
 * out { offset }: how far the carrier has moved from the reference, mm.
 */
const carry: BlockFn = (c, s) => {
  const i = s.in ?? {};
  const X = c.xf(str(i.carrier, "carry.carrier"));
  for (const b of (i.bodies as unknown[] | undefined) ?? []) {
    const id = str(b, "carry.bodies");
    c.setXf(id, xf.mul(X, c.xf(id)));
  }
  outVal(c, s, v3.len(X.t), "offset");
};

export const WALKER_BLOCKS: Record<string, BlockFn> = { walker, carry };
