// H: the hardware primitives (standard Appendix B). Real catalogue sizes, a default material, a default locking method
// where threaded and the detail rung of their kind. Each returns finished solids; callers place them.
import { TAU, arcPts, bbox, circle, dBore, polar, roundedPoly, type Vec2 } from "../core/geom";
import { FORM } from "../style/form";
import { solid, marks, type Mark, type Solid } from "./solid";
import {
  BEARINGS, FLANGE, HEADS, NIPPLES, NUTS, SCREW_STANDARD, SENSOR, SPRINGS, STANDOFF, WASHERS, circlipExt, circlipInt,
  standardLength, type Bearing, type HeadKind,
} from "./tables";

export type Opts = Partial<Solid>;

// ---- outline helpers ----

export const disc = (r: number, x = 0, y = 0): Vec2[] => circle(r, x, y, Math.max(28, Math.round(r * 3)));
export const hex = (r: number, x = 0, y = 0, a = 0): Vec2[] =>
  Array.from({ length: 6 }, (_, i): Vec2 => [x + r * Math.cos(a + (i * TAU) / 6), y + r * Math.sin(a + (i * TAU) / 6)]);
/** Hex of width s across flats. */
export const hexAF = (s: number, x = 0, y = 0, a = 0): Vec2[] => hex(s / Math.sqrt(3), x, y, a);

import { taper } from "../core/geom";
export { taper };

/** Centres of n holes on a circle of radius R. */
export const boltCircle = (n: number, R: number, a0 = 0, x = 0, y = 0): Vec2[] =>
  Array.from({ length: n }, (_, i) => polar(R, a0 + (i * TAU) / n, x, y));

/** Convex hull of circles [x, y, r]: bridges, brackets, belts. */
export function hullOf(cs: [number, number, number][]): Vec2[] {
  const P = cs.flatMap(([x, y, r]) => circle(r, x, y, 64)).sort((p, q) => p[0] - q[0] || p[1] - q[1]);
  const cr = (o: Vec2, a: Vec2, b: Vec2) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo: Vec2[] = [];
  const up: Vec2[] = [];
  for (const p of P) {
    while (lo.length > 1 && cr(lo[lo.length - 2]!, lo[lo.length - 1]!, p) <= 0) lo.pop();
    lo.push(p);
  }
  for (const p of [...P].reverse()) {
    while (up.length > 1 && cr(up[up.length - 2]!, up[up.length - 1]!, p) <= 0) up.pop();
    up.push(p);
  }
  return lo.slice(0, -1).concat(up.slice(0, -1));
}

/** Lightening window through the points `pieces` with a cutter radius of at least 1.5 mm (M5). */
export const window = (pieces: Vec2[], r: number): Vec2[] => roundedPoly(pieces, Math.max(1.5, r));

/** Round every corner of a closed outline with radius r, convex and concave alike: a milled window (M5). */
export function filletPoly(P: Vec2[], r: number): Vec2[] {
  const out: Vec2[] = [];
  const n = P.length;
  for (let i = 0; i < n; i++) {
    const p = P[(i - 1 + n) % n]!;
    const c = P[i]!;
    const q = P[(i + 1) % n]!;
    const u: Vec2 = [p[0] - c[0], p[1] - c[1]];
    const v: Vec2 = [q[0] - c[0], q[1] - c[1]];
    const lu = Math.hypot(...u);
    const lv = Math.hypot(...v);
    const th = Math.acos(Math.max(-1, Math.min(1, (u[0] * v[0] + u[1] * v[1]) / (lu * lv))));
    const t = r / Math.tan(th / 2);
    if (th > Math.PI - 0.15 || t > 0.45 * Math.min(lu, lv)) {
      out.push(c);
      continue;
    }
    const a: Vec2 = [c[0] + (u[0] / lu) * t, c[1] + (u[1] / lu) * t];
    const b: Vec2 = [c[0] + (v[0] / lv) * t, c[1] + (v[1] / lv) * t];
    const bis: Vec2 = [u[0] / lu + v[0] / lv, u[1] / lu + v[1] / lv];
    const bl = Math.hypot(...bis);
    const h = r / Math.sin(th / 2);
    const C: Vec2 = [c[0] + (bis[0] / bl) * h, c[1] + (bis[1] / bl) * h];
    const a0 = Math.atan2(a[1] - C[1], a[0] - C[0]);
    let a1 = Math.atan2(b[1] - C[1], b[0] - C[0]);
    while (a1 - a0 > Math.PI) a1 -= TAU;
    while (a0 - a1 > Math.PI) a1 += TAU;
    out.push(...arcPts(C[0], C[1], r, a0, a1, Math.PI / 12));
  }
  return out;
}

/**
 * The windows of a spoked wheel (M2): hub of radius rIn, rim of inner radius rOut, n straight spokes of half-width
 * `half`, every corner filleted. The first window is centred between spokes at a0 + pi / n.
 */
export function spokes(o: { rIn: number; rOut: number; n: number; half: number; fillet: number; a0?: number }): Vec2[][] {
  const e0 = Math.asin(o.half / o.rIn);
  const f0 = Math.asin(o.half / o.rOut);
  return Array.from({ length: o.n }, (_, k) => {
    const a0 = (o.a0 ?? 0) + (k * TAU) / o.n + Math.PI / o.n;
    const a1 = a0 + TAU / o.n;
    return filletPoly([...arcPts(0, 0, o.rOut, a0 + f0, a1 - f0, Math.PI / 40), ...arcPts(0, 0, o.rIn, a1 - e0, a0 + e0, Math.PI / 40)], o.fillet);
  });
}

/** Oil sink round a pivot on a bridge (F8): a countersunk cup drawn as two rings. */
export const oilSink = (r: number, x = 0, y = 0): Mark[] =>
  marks("oilSink", circle(r + 0.9, x, y, 40), circle(r + 1.8, x, y, 44));

/**
 * Bore entry chamfers (M3): a second ring just outside every round hole of radius at least minR. Idempotent: a hole
 * that already has its ring gets no second one.
 */
export function boreChamfers(s: Solid, minR = 1.9, c = 0.5): void {
  const has = new Set(s.marks.filter((m) => m.kind === "boreEntry").map((m) => ringKey(bbox(m.pts))));
  for (const h of s.holes) {
    const [x0, y0, x1, y1] = bbox(h);
    const r = (x1 - x0) / 2;
    if (r < minR || Math.abs((y1 - y0) / 2 - r) >= 0.05) continue;
    // a square bounding box is not a round hole: every vertex must lie on the circle (a window symmetric about a diagonal)
    const cx = (x0 + x1) / 2;
    const cy = (y0 + y1) / 2;
    if (h.some((p) => Math.abs(Math.hypot(p[0] - cx, p[1] - cy) - r) > 0.05 * r + 0.05)) continue;
    const pts = circle(r + c, (x0 + x1) / 2, (y0 + y1) / 2, Math.max(28, Math.round(r * 3)));
    const k = ringKey(bbox(pts));
    if (has.has(k)) continue;
    has.add(k);
    s.marks.push({ kind: "boreEntry", pts });
  }
}
const ringKey = ([x0, y0, x1, y1]: [number, number, number, number]) => `${((x0 + x1) / 2).toFixed(2)},${((y0 + y1) / 2).toFixed(2)},${((x1 - x0) / 2).toFixed(2)}`;

const ticks = (r0: number, r1: number, n: number): Vec2[][] =>
  Array.from({ length: n }, (_, i) => [polar(r0, (i * TAU) / n), polar(r1, (i * TAU) / n)]);

const ringOutline = (ro: number, ri: number, gap = 0, n = 64): { outer: Vec2[]; holes: Vec2[][] } => {
  if (!gap) return { outer: disc(ro), holes: [disc(ri)] };
  const pts: Vec2[] = [];
  for (let i = 0; i <= n; i++) pts.push(polar(ro, gap + ((TAU - 2 * gap) * i) / n));
  for (let i = n; i >= 0; i--) pts.push(polar(ri, gap + ((TAU - 2 * gap) * i) / n));
  return { outer: pts, holes: [] };
};

const fmt = (v: number) => String(+v.toFixed(1));

// ---- shafts ----

export interface ShaftSpec {
  d: number;
  z0: number;
  z1: number;
  /** D-flat over the whole length (A5, Ø8 and under). */
  flat?: boolean;
  /** Feather keyway z range (A5, over Ø8). */
  keyway?: [number, number];
  /** Shoulder collars where a part seats: z of the collar's lower face, its Ø and height. */
  shoulders?: { z: number; D: number; h: number }[];
  /** Circlip grooves (F2): z of the groove's lower face. */
  grooves?: number[];
  /** Threaded end with an undercut where it meets the shoulder (A4, M8). */
  thread?: { M: number; z0: number; z1: number };
  /** Wrench flats where the shaft is tightened without a head (M11). */
  wrench?: boolean;
}

/** A stepped shaft (A4): one coaxial solid per diameter step, moving as one body (E1, E8). */
export function shaft(id: string, spec: ShaftSpec, o: Opts = {}): Solid[] {
  const { d } = spec;
  const segs: { z0: number; z1: number; r: number; outer?: Vec2[]; name?: string; m?: Mark[] }[] = [];
  const cuts: { z0: number; z1: number; r: number; m?: Mark[] }[] = [];
  for (const g of spec.grooves ?? []) {
    const c = circlipExt(d);
    cuts.push({ z0: g, z1: g + c.s + 0.1, r: c.d2 / 2 });
  }
  if (spec.thread) {
    const t = spec.thread;
    const p = FORM.thread.pitch(t.M);
    cuts.push({ z0: t.z0, z1: t.z1, r: t.M / 2, m: marks("thread", circle(t.M / 2 - 0.6 * p, 0, 0, 24)) });
    // the undercut: a relief groove 1.5 pitches long where the thread runs out against the shoulder
    const atTop = t.z1 >= spec.z1 - 1e-6;
    const u0 = atTop ? t.z0 - 1.5 * p : t.z1;
    cuts.push({ z0: u0, z1: u0 + 1.5 * p, r: t.M / 2 - 0.7 * p });
  }
  cuts.sort((a, b) => a.z0 - b.z0);
  // plain body between the cuts
  let z = spec.z0;
  const body = (z0: number, z1: number) => {
    if (z1 - z0 > 1e-6) segs.push({ z0, z1, r: d / 2 });
  };
  for (const c of cuts) {
    body(z, Math.max(z, c.z0));
    segs.push({ z0: Math.max(c.z0, spec.z0), z1: Math.min(c.z1, spec.z1), r: c.r, ...(c.m ? { m: c.m } : {}) });
    z = Math.min(c.z1, spec.z1);
  }
  body(z, spec.z1);
  for (const s of spec.shoulders ?? []) segs.push({ z0: s.z, z1: s.z + s.h, r: s.D / 2 });
  const out: Solid[] = [];
  segs
    .filter((s) => s.z1 - s.z0 > 1e-6)
    .sort((a, b) => a.z0 - b.z0)
    .forEach((s, i) => {
      const plainOuter = spec.flat && Math.abs(s.r - d / 2) < 1e-6 ? dBore(d / 2) : disc(s.r);
      const m: Mark[] = [...(s.m ?? [])];
      if (spec.keyway && s.r === d / 2 && s.z1 > spec.keyway[0] && s.z0 < spec.keyway[1])
        m.push({ kind: "keyway", pts: [[d / 2 - 1.5, -1], [d / 2, -1], [d / 2, 1], [d / 2 - 1.5, 1]] });
      out.push(
        solid(i ? `${id}-s${i}` : id, {
          name: i ? "" : (o.name ?? `Shaft Ø${d}`),
          kind: "shaft",
          mat: "Steel C45, ground h6",
          outer: plainOuter,
          z0: s.z0,
          z1: s.z1,
          d: 2 * s.r,
          group: id,
          ...o,
          ...(i ? { name: "" } : {}),
          marks: m,
        }),
      );
    });
  // turned-part marks on the end faces (M11): chamfer ring, centre hole; wrench flats where tightened bare
  const top = out[out.length - 1]!;
  top.marks.push({ kind: "chamfer", pts: circle((top.d ?? d) / 2 - 0.4, 0, 0, 32) });
  top.marks.push({ kind: "boreEntry", pts: circle(Math.max(0.5, d * 0.08), 0, 0, 12) });
  if (spec.wrench) top.marks.push({ kind: "knurl", pts: [[-d * 0.42, -d / 2], [-d * 0.42, d / 2]] }, { kind: "knurl", pts: [[d * 0.42, -d / 2], [d * 0.42, d / 2]] });
  if (spec.thread) top.threadZ = [spec.thread.z0, spec.thread.z1];
  for (const s of out) if (spec.thread) s.thread = spec.thread.M;
  return out;
}

// ---- bearings and bushings ----

export const bearingName = (d: number, D: number, closure: "open" | "shield" | "seal" = "shield", flanged = false) => {
  const b = BEARINGS.find((x) => x.d === d && x.D === D);
  const suffix = closure === "seal" ? "-2RS" : closure === "shield" ? "ZZ" : "";
  return b ? `Bearing ${flanged ? "F" : ""}${b.name}${suffix} (${d}x${D}x${b.B})` : `Bearing ${d}x${D}`;
};

/**
 * Deep-groove ball bearing (6.2): open shows its balls, shield one extra ring, seal is flush. A flanged bearing
 * returns its flange as a second solid of the same group. Balls and cage are their own faint solids (DL-A).
 */
export function bearing(id: string, b: Bearing, o: Opts & { closure?: "open" | "shield" | "seal"; flange?: "top" | "bottom" } = {}): Solid[] {
  const closure = o.closure ?? "shield";
  const { d, D } = b;
  const z0 = o.z0 ?? 0;
  const z1 = o.z1 ?? z0 + b.B;
  const rIn = d / 2 + (D - d) * 0.18;
  const rOut = D / 2 - (D - d) * 0.18;
  const m: Mark[] = marks("boss", circle(rIn, 0, 0, 36), circle(rOut, 0, 0, 36));
  if (closure === "shield") m.push({ kind: "boss", pts: circle((rIn + rOut) / 2, 0, 0, 36) });
  const { closure: _c, flange, ...rest } = o;
  void _c;
  const main = solid(id, {
    name: bearingName(d, D, closure, !!flange),
    role: "bearing",
    kind: "bearing",
    mat: closure === "seal" ? "Bearing steel 100Cr6, rubber seals" : closure === "shield" ? "Bearing steel 100Cr6, steel shields" : "Bearing steel 100Cr6",
    outer: disc(D / 2),
    holes: [disc(d / 2)],
    marks: m,
    inset: true,
    d,
    D,
    closure,
    group: id,
    ...rest,
    z0,
    z1,
  });
  const out = [main];
  if (flange) {
    const F = FLANGE(b);
    out.push(
      solid(`${id}-fl`, {
        name: "",
        role: "bearing",
        kind: "bearing",
        outer: disc(F.D / 2),
        holes: [disc((d + D) / 4)],
        d,
        D: F.D,
        group: id,
        ...rest,
        z0: flange === "top" ? z1 : z0 - F.w,
        z1: flange === "top" ? z1 + F.w : z0,
      }),
    );
  }
  // the ball set and cage, seen through an open bearing or the transparent shield
  if (D >= 9) {
    const pr = (d + D) / 4;
    const br = Math.max(0.45, (D - d) * 0.16);
    const n = Math.max(6, Math.floor((TAU * pr) / (br * 2.5)));
    const zc = (z0 + z1) / 2;
    const common = { ...rest, name: "", role: "bearing" as const, group: id, inset: true, faint: true, mat: "Bearing steel 100Cr6", qty: 0 };
    out.push(solid(`${id}-balls`, { ...common, kind: "bearingBalls", outer: disc(pr + br), holes: [disc(pr - br)], z0: zc - br, z1: zc + br, marks: marks("boss", ...boltCircle(n, pr).map(([x, y]) => circle(br, x, y, 10))) }));
    out.push(solid(`${id}-cage`, { ...common, kind: "bearingCage", outer: disc(pr + br * 0.5), holes: [disc(pr - br * 0.5)], z0: zc - br * 0.3, z1: zc + br * 0.3 }));
  }
  return out;
}

/** Track roller (J4): a bearing whose outer race runs on a slot wall. */
export const roller = (id: string, d: number, D: number, o: Opts = {}): Solid =>
  solid(id, {
    name: `Track roller Ø${fmt(D)} on Ø${d} stud, sealed`,
    role: "bearing",
    kind: "roller",
    mat: "Bearing steel 100Cr6, hardened outer ring",
    outer: disc(D / 2),
    holes: [disc(d / 2)],
    marks: marks("boss", circle(d / 2 + (D - d) * 0.2, 0, 0, 36)),
    inset: true,
    d,
    D,
    ...o,
  });

export const bushing = (id: string, d: number, D: number, o: Opts = {}): Solid =>
  solid(id, {
    name: `Bronze bushing ${d}x${fmt(D)}, oil-impregnated`,
    role: "bearing",
    kind: "bushing",
    mat: "Sintered bronze, oil-impregnated",
    outer: disc(D / 2),
    holes: [disc(d / 2)],
    inset: true,
    d,
    D,
    ...o,
  });

// ---- stack hardware ----

export const washer = (id: string, d: number, D: number, o: Opts = {}): Solid =>
  solid(id, { name: `Washer ${d}x${fmt(D)}`, kind: "washer", mat: "Steel, hardened", outer: disc(D / 2), holes: [disc(d / 2)], inset: true, d, D, ...o });

/** Inner-race spacer (A12): rides the shaft and clamps only the inner race. */
export const spacer = (id: string, d: number, D: number, o: Opts = {}): Solid =>
  solid(id, { name: `Inner-race spacer ${fmt(d)}x${fmt(D)}`, kind: "spacer", mat: "Steel, hardened", outer: disc(D / 2), holes: [disc(d / 2)], inset: true, d, D, ...o });

export const thrustWasher = (id: string, d: number, D: number, o: Opts = {}): Solid =>
  solid(id, {
    name: `Thrust washer ${fmt(d)}x${fmt(D)}, bronze`,
    kind: "thrustWasher",
    mat: "Sintered bronze, oil-impregnated",
    outer: disc(D / 2),
    holes: [disc(d / 2)],
    inset: true,
    d,
    D,
    ...o,
  });

/** Wave washer (F4, F6): preload for a floating bearing or drag in a drag pack. */
export const waveWasher = (id: string, d: number, D: number, o: Opts = {}): Solid =>
  solid(id, {
    name: `Wave washer ${fmt(d)}x${fmt(D)}, spring steel`,
    kind: "waveWasher",
    mat: "Spring steel",
    outer: disc(D / 2),
    holes: [disc(d / 2)],
    marks: marks("boss", ...boltCircle(3, (d + D) / 4).map(([x, y]) => circle((D - d) / 6, x, y, 12))),
    inset: true,
    d,
    D,
    ...o,
  });

/** Tube: a sleeve or long spacer. */
export const tube = (id: string, d: number, D: number, o: Opts = {}): Solid =>
  solid(id, { name: `Spacer sleeve ${fmt(d)}x${fmt(D)}`, kind: "sleeve", mat: "Steel", outer: disc(D / 2), holes: [disc(d / 2)], d, D, ...o });

// ---- fasteners ----

/** Threaded shank of a screw (the head is a separate solid of the same group). */
export const shank = (id: string, d: number, o: Opts = {}): Solid =>
  solid(id, { name: "", kind: "shank", mat: "Steel 10.9, black oxide", outer: disc(d / 2), inset: true, d, thread: d, ...o });

/** Screw head: socket cap (hex socket and flutes), button or countersunk. */
export function head(id: string, kind: HeadKind, M: number, o: Opts = {}): Solid {
  const h = HEADS[kind][M] ?? HEADS[kind][5]!;
  const m: Mark[] = [{ kind: "hexSocket", pts: hexAF(h.s) }];
  if (kind === "socket") m.push(...ticks((h.dk / 2) * 0.78, (h.dk / 2) * 0.95, Math.max(12, Math.round(h.dk * 2.4))).map((pts) => ({ kind: "headFlute" as const, pts })));
  return solid(id, {
    name: `${kind === "socket" ? "Socket head" : kind === "button" ? "Button head" : "Countersunk"} M${M} (${SCREW_STANDARD[kind]})`,
    kind: "head",
    headKind: kind,
    mat: "Steel 10.9, black oxide",
    outer: disc(h.dk / 2),
    marks: m,
    D: h.dk,
    thread: M,
    chamfer: FORM.chamfer[kind === "socket" ? "head" : kind],
    ...o,
  });
}

/** Head height of a screw. */
export const headHeight = (kind: HeadKind, M: number) => (HEADS[kind][M] ?? HEADS[kind][5]!).k;

/**
 * A complete screw: head seated on the plane `seat`, shank running `L` from the seat in direction `dir`
 * (−1: head on top, shank down). The length is rounded up to the standard series and named (M9, A13).
 */
export function screw(
  id: string,
  kind: HeadKind,
  M: number,
  L: number,
  o: Opts & { face: number; dir: -1 | 1; lock?: string },
): Solid[] {
  const { face: seat, dir, ...rest } = o;
  const thread = rest.threadZ?.[0];
  const len = standardLength(L);
  const k = headHeight(kind, M);
  const sunk = kind === "csk" ? k : 0;
  const h = head(id, kind, M, {
    ...rest,
    name: rest.name ?? `${head(id, kind, M).name.replace(/ \(/, ` x ${len} (`)}`,
    z0: dir < 0 ? seat - sunk : seat - k + sunk,
    z1: dir < 0 ? seat + k - sunk : seat + sunk,
    group: id,
  });
  const zA = dir < 0 ? seat - sunk : seat + sunk;
  const zB = zA + dir * (len - sunk);
  const sh = shank(`${id}-sh`, M, {
    body: rest.body ?? "ground",
    at: rest.at ?? [0, 0, 0],
    joints: rest.joints ?? [],
    z0: Math.min(zA, zB),
    z1: Math.max(zA, zB),
    threadZ: thread !== undefined ? [Math.min(thread, zB), Math.max(thread, zB)] : [Math.min(zA, zB), Math.max(zA, zB)],
    ex: rest.ex ?? 0,
    group: id,
    ...(rest.lock ? { lock: rest.lock } : {}),
  });
  return [h, sh];
}

export const nut = (id: string, M: number, o: Opts = {}): Solid => {
  const n = NUTS[M] ?? NUTS[5]!;
  return solid(id, {
    name: `Nyloc nut M${M} (DIN 985)`,
    kind: "nut",
    mat: "Steel 8, zinc plated, nylon insert",
    outer: hexAF(n.s),
    holes: [disc(M / 2)],
    marks: marks("boss", circle(n.s * 0.42, 0, 0, 36)),
    thread: M,
    lock: "nylon insert",
    z1: (o.z0 ?? 0) + n.m,
    ...o,
  });
};

export const plainWasher = (id: string, M: number, o: Opts = {}): Solid => {
  const w = WASHERS[M] ?? WASHERS[5]!;
  return washer(id, M + 0.3, w.D, { name: `Washer M${M} (ISO 7089)`, z1: (o.z0 ?? 0) + w.h, inset: false, ...o });
};

// ---- frame ----

export const plate = (id: string, outer: Vec2[], o: Opts = {}): Solid =>
  solid(id, { kind: "plate", role: "ground", mat: "Aluminium 6061-T6, anodised", outer, chamfer: FORM.chamfer.plate, ...o });

export const standoff = (id: string, o: Opts = {}): Solid =>
  solid(id, { name: `Standoff Ø${STANDOFF.D}, M${STANDOFF.M}`, kind: "standoff", role: "ground", mat: "Stainless steel A2", outer: disc(STANDOFF.D / 2), D: STANDOFF.D, chamfer: FORM.chamfer.standoff, ...o });

/** Ø6 h7 spigot turned on a standoff (F1): fits a reamed hole or a slot in the plate it locates. */
export const spigot = (id: string, o: Opts = {}): Solid =>
  solid(id, {
    name: "",
    kind: "spigot",
    role: "ground",
    mat: "Stainless steel A2",
    outer: disc(STANDOFF.spigotD / 2),
    holes: [disc(STANDOFF.M / 2 + 0.25)],
    D: STANDOFF.spigotD,
    ...o,
  });

export const dowel = (id: string, d: number, o: Opts = {}): Solid =>
  solid(id, { name: `Dowel pin Ø${d} h6 (ISO 8734)`, kind: "dowel", mat: "Steel, hardened and ground", outer: disc(d / 2), inset: true, d, chamfer: 0.15, ...o });

/** Circlip: DIN 471 on a shaft of Ø d, or DIN 472 in a bore of Ø d. */
export function circlip(id: string, d: number, o: Opts & { internal?: boolean } = {}): Solid {
  const { internal, ...rest } = o;
  const c = internal ? circlipInt(d) : circlipExt(d);
  const ri = internal ? c.d2 / 2 - c.b : c.d2 / 2;
  const ro = internal ? c.d2 / 2 : c.d2 / 2 + c.b;
  const gap = 0.35;
  const shape = ringOutline(ro, ri, gap);
  const er = (ro - ri) * 0.32 + 0.2;
  const ex = (ri + ro) / 2;
  return solid(id, {
    name: internal ? `Internal circlip DIN 472, Ø${d}` : `External circlip DIN 471, Ø${d}`,
    kind: internal ? "circlipInternal" : "circlipExternal",
    mat: "Spring steel",
    ...shape,
    marks: marks("boss", circle(er, ...polar(ex, gap + 0.3)), circle(er, ...polar(ex, -gap - 0.3))),
    inset: true,
    d,
    D: 2 * ro,
    chamfer: 0,
    z1: (rest.z0 ?? 0) + c.s,
    ...rest,
  });
}

/** Bearing retainer plate: a ring over the outer race, held by n screws (F2). */
export const retainerPlate = (id: string, d: number, D: number, o: Opts = {}): Solid =>
  solid(id, { name: `Bearing retainer plate ${fmt(d)}x${fmt(D)}`, kind: "retainerPlate", mat: "Steel, zinc plated", outer: disc(D / 2), holes: [disc(d / 2)], d, D, ...o });

/** DIN 6885 feather key, b wide, L long, along local x from the bore. */
export const key = (id: string, b: number, L: number, o: Opts = {}): Solid =>
  solid(id, { name: `Feather key ${b} x ${b} x ${fmt(L)} (DIN 6885)`, kind: "key", mat: "Steel C45, bright", outer: roundedPoly([[-L / 2 + b / 2, 0], [L / 2 - b / 2, 0]], b / 2), ...o });

/** DIN 916 cup-point set screw, drawn end-on where it shows (F3). */
export const setScrew = (id: string, M: number, o: Opts = {}): Solid =>
  solid(id, { name: `Set screw M${M} (DIN 916), threadlocked`, kind: "setScrew", mat: "Steel 45H, black oxide", outer: disc(M / 2), marks: [{ kind: "hexSocket", pts: hexAF(M * 0.5) }], thread: M, lock: "threadlocker (Loctite 243)", ...o });

export const collar = (id: string, d: number, D: number, o: Opts = {}): Solid =>
  solid(id, { name: `Shaft collar ${d}x${fmt(D)}, set screw`, kind: "collar", mat: "Steel, black oxide", outer: disc(D / 2), holes: [disc(d / 2)], d, D, ...o });

export type SpringKind = "compression" | "torsion" | "leaf";

/** Spring (6.2): compression coil outline, torsion coil with tail, or a leaf screwed at one end. */
export function spring(id: string, kind: SpringKind, o: Opts & { D?: number; wire?: number; L?: number } = {}): Solid {
  const { D: Dg, wire: wg, L: Lg, ...rest } = o;
  const s = SPRINGS.find((x) => x.D >= (Dg ?? 6)) ?? SPRINGS[1]!;
  const D = Dg ?? s.D;
  const w = wg ?? s.wire;
  if (kind === "leaf") {
    const L = Lg ?? 30;
    return solid(id, { name: `Leaf spring ${fmt(L)} x 6 x ${w}`, kind: "spring", mat: "Spring steel, hardened", outer: roundedPoly([[0, 0], [L, 0]], 3), ...rest });
  }
  return solid(id, {
    name: kind === "torsion" ? `Torsion spring Ø${fmt(D)}, wire ${w}` : `Compression spring Ø${fmt(D)}, wire ${w}, ${s.rate} N/mm`,
    kind: "spring",
    mat: "Spring steel EN 10270",
    outer: disc(D / 2),
    holes: [disc(D / 2 - w)],
    marks: marks("boss", ...Array.from({ length: 5 }, (_, i) => [polar(D / 2 - w, (i * TAU) / 5), polar(D / 2, (i * TAU) / 5 + 0.4)])),
    D,
    d: D - 2 * w,
    ...rest,
  });
}

/** Hard stop block (F5). */
export const stop = (id: string, outer: Vec2[], o: Opts = {}): Solid =>
  solid(id, { name: "Stop block", kind: "stop", role: "ground", mat: "Steel, hardened", outer, ...o });

/** Elastomer bumper on a stop (F5). */
export const bumper = (id: string, d: number, D: number, o: Opts = {}): Solid =>
  solid(id, { name: `Stop bumper, neoprene Ø${fmt(D)}`, kind: "bumper", role: "ground", mat: "Neoprene, 70 Shore A", outer: disc(D / 2), holes: d ? [disc(d / 2)] : [], d, D, ...o });

/** Grease nipple DIN 71412, M6 (F8). */
export const nipple = (id: string, o: Opts = {}): Solid =>
  solid(id, { name: `Grease nipple M${NIPPLES.M} (DIN 71412)`, kind: "nipple", mat: "Steel, zinc plated", outer: hexAF(NIPPLES.s), marks: marks("boss", circle(NIPPLES.head / 2, 0, 0, 24)), z1: (o.z0 ?? 0) + NIPPLES.h, ...o });

/** Felt pad or wiper (F8). */
export const felt = (id: string, outer: Vec2[], o: Opts = {}): Solid =>
  solid(id, { name: "Felt oiler, oil-soaked wool felt", kind: "felt", mat: "Wool felt F1", outer, ...o });

export const wiper = (id: string, outer: Vec2[], o: Opts = {}): Solid =>
  solid(id, { name: "Felt wiper in a steel clip", kind: "wiper", mat: "Wool felt, spring steel clip", outer, ...o });

/** Hardened wear strip (M14), screwed into a slot wall or a guide. */
export const wearStrip = (id: string, outer: Vec2[], o: Opts = {}): Solid =>
  solid(id, { name: "Wear strip, hardened", kind: "wearStrip", mat: "Tool steel O1, hardened 58 HRC", outer, ...o });

/** Eccentric bushing (F7): flanged, offset bore, arc slots, index line. */
export function eccentric(id: string, d: number, D: number, e: number, o: Opts & { slots?: number[]; slotR?: number } = {}): Solid {
  const F = D + 10;
  const { slots: at = [0, Math.PI], slotR = F / 2 - 2.6, ...rest } = o;
  // arc slots for the clamp screws: the bushing turns ±20° to set the offset, then is clamped
  const slots = at.map((a) => roundedPoly([polar(slotR, a - 0.35), polar(slotR, a), polar(slotR, a + 0.35)], 1.7));
  o = rest;
  return solid(id, {
    name: `Eccentric bushing Ø${D}, ${e} mm offset bore Ø${d}, flanged`,
    kind: "eccentric",
    mat: "Bronze CuSn8",
    outer: disc(F / 2),
    holes: [disc(d / 2 + 0.1, e, 0), ...slots],
    marks: [{ kind: "index", pts: [[F / 2 - 2, 0], [F / 2, 0]] }, ...marks("boss", circle(1.2, 0, F / 2 - 1.6, 12), circle(1.2, 0, -F / 2 + 1.6, 12))],
    d,
    D: F,
    ...o,
  });
}

/** Gib strip 3 x 6 (F7), along local x. */
export const gib = (id: string, L: number, o: Opts = {}): Solid =>
  solid(id, { name: `Gib strip 3 x 6 x ${fmt(L)}, bronze`, kind: "gib", mat: "Bronze CuSn8", outer: [[0, -1.5], [L, -1.5], [L, 1.5], [0, 1.5]], ...o });

// ---- sensing and cabling (V6) ----

/** Home flag: a 1 mm vane on a rotating part, radius r0 to r1 at angle a. */
export const flag = (id: string, r0: number, r1: number, a = 0, o: Opts = {}): Solid => {
  const w = SENSOR.vane;
  const pts: Vec2[] = [[r0, -w / 2], [r1, -w / 2], [r1, w / 2], [r0, w / 2]];
  const c = Math.cos(a);
  const s = Math.sin(a);
  return solid(id, { name: "Home flag, 1 mm steel vane", kind: "flag", mat: "Stainless steel, 1 mm", outer: pts.map(([x, y]): Vec2 => [x * c - y * s, x * s + y * c]), ...o });
};

/** Fork sensor, slot toward local +x. */
export const sensor = (id: string, o: Opts = {}): Solid => {
  const { w, l, slot, depth } = SENSOR;
  const outer: Vec2[] = [[-l / 2, -w / 2], [l / 2, -w / 2], [l / 2, -slot / 2], [l / 2 - depth, -slot / 2], [l / 2 - depth, slot / 2], [l / 2, slot / 2], [l / 2, w / 2], [-l / 2, w / 2]];
  return solid(id, { name: "Fork sensor, slotted optical, 5 mm gap", kind: "sensor", mat: "PBT housing", outer, ...o });
};

export const terminalBlock = (id: string, ways = 4, o: Opts = {}): Solid =>
  solid(id, {
    name: `Terminal block, ${ways}-way, 5 mm pitch`,
    kind: "terminalBlock",
    mat: "Polyamide, brass clamps",
    outer: [[-ways * 2.5, -4], [ways * 2.5, -4], [ways * 2.5, 4], [-ways * 2.5, 4]],
    marks: marks("boss", ...Array.from({ length: ways }, (_, i) => circle(1.2, -ways * 2.5 + 2.5 + i * 5, 0, 12))),
    ...o,
  });

export const cableClip = (id: string, o: Opts = {}): Solid =>
  solid(id, { name: "P-clip, nylon, 6 mm", kind: "cableClip", mat: "Polyamide 6.6", outer: roundedPoly([[-4, 0], [4, 0]], 2.5), ...o });

/** Outline of a stroke of half-width r along a polyline, mitred at the bends. */
export function stroke(pts: Vec2[], r: number): Vec2[] {
  const n = pts.length;
  const nrm = (a: Vec2, b: Vec2): Vec2 => {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    return [-(b[1] - a[1]) / L, (b[0] - a[0]) / L];
  };
  const left: Vec2[] = [];
  const right: Vec2[] = [];
  for (let i = 0; i < n; i++) {
    const a = i > 0 ? nrm(pts[i - 1]!, pts[i]!) : nrm(pts[0]!, pts[1]!);
    const b = i < n - 1 ? nrm(pts[i]!, pts[i + 1]!) : a;
    const mx = a[0] + b[0];
    const my = a[1] + b[1];
    const L = Math.hypot(mx, my) || 1;
    // mitre: along the bisector, long enough to keep the strip r wide, capped at 3 r
    const k = Math.min(3 * r, r / Math.max(0.2, (mx * a[0] + my * a[1]) / L));
    const p = pts[i]!;
    left.push([p[0] + (mx / L) * k, p[1] + (my / L) * k]);
    right.push([p[0] - (mx / L) * k, p[1] - (my / L) * k]);
  }
  return [...left, ...right.reverse()];
}

/** A lead as a thin strip along a polyline (world or body-local points). */
export const lead = (id: string, pts: Vec2[], o: Opts = {}): Solid =>
  solid(id, { name: "Lead, silicone insulated", kind: "lead", mat: "Tinned copper, silicone", outer: stroke(pts, 0.9), ...o });

export const H = {
  disc, hex, hexAF, taper, boltCircle, hullOf, window, filletPoly, spokes, oilSink, boreChamfers,
  shaft, bearing, roller, bushing, washer, spacer, thrustWasher, waveWasher, tube, shank, head, screw, nut, plainWasher,
  plate, standoff, spigot, dowel, circlip, retainerPlate, key, setScrew, collar, spring, stop, bumper, nipple, felt,
  wiper, wearStrip, eccentric, gib, flag, sensor, terminalBlock, cableClip, lead, solid,
};
export type HardwareApi = typeof H;
