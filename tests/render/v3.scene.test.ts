import { DRAFT } from "../../src/style/draft";
import { describe, expect, it } from "vitest";
import { recordById } from "../../src/catalog";
import { Kinematics } from "../../src/kin/compose";
import type { Kin } from "../../src/kin/types";
import { buildPackage } from "../../src/package/build";
import { newCache, controlFor, extremes, locusOf, pathOf, type Ann } from "../../src/render/v3/annotate";
import { bake, EDGE_RING, EF2, loopLength, pathPlace, VF } from "../../src/render/v3/bake";
import { basisOfOrient, fit, namedOrient } from "../../src/render/v3/camera";
import { kinPoser } from "../../src/render/v3/poser";
import { place, rows, runMarks, runtime, ST, worldBox } from "../../src/render/v3/scene";
import { seeThrough, swept } from "../../src/render/v3/visibility";
import { ladder } from "../../src/render/detail";
import { setupInline } from "../../src/solids/setup";
import { encode2, FLAG3 } from "../../src/package/format2";
import { theme } from "../../src/style/theme";
import { FLAGS, scene3, turning, type Fx } from "../fixtures/scene3";

// a link turning about the origin under a plate that sits over its sweep, a post beside it and a plate under it
const SOLIDS: Fx[] = [
  { id: "base", body: "ground", rect: [-80, -80, 80, 80], z0: 0, z1: 4, role: "ground", kind: "base", flags: FLAGS.isBase },
  { id: "link", body: "arm", rect: [0, -5, 50, 5], z0: 10, z1: 16, role: "driver" },
  { id: "cover", body: "ground", rect: [-20, -20, 60, 20], z0: 20, z1: 24, role: "ground", kind: "plate" },
  { id: "under", body: "ground", rect: [-20, -20, 60, 20], z0: 5, z1: 8, role: "ground", kind: "plate" },
  { id: "far", body: "ground", rect: [60, 60, 70, 70], z0: 5, z1: 30, role: "ground", kind: "standoff" },
  { id: "mover", body: "arm", rect: [20, -2, 30, 2], z0: 30, z1: 34, role: "link" },
];
const teaching = { principle: [{ body: "arm" }], traces: [], overlays: [], view: "PLAN", controls: [], plot: { x: "i", y: "o", label: "L" }, claims: [], exceptions: [], review: { verdict: "keep", date: "2026-10-20", note: "" } } as never;

describe("scene runtime", () => {
  const scene = scene3(SOLIDS, { poser: turning("arm", 0, 0), teaching });
  const rt = runtime(scene);

  it("finds the solids that never move and the principle ones", () => {
    const ids = SOLIDS.map((s) => s.id);
    expect(ids.filter((_, i) => rt.fixed[i]).sort()).toEqual(["base", "cover", "far", "under"]);
    expect(ids.filter((_, i) => rt.principle[i]).sort()).toEqual(["link", "mover"]);
  });

  it("bakes every solid's triangles and edges once, naming the solid", () => {
    const b = rt.baked;
    expect(b.verts.length).toBeGreaterThanOrEqual(b.nVerts * VF);
    // a box: 12 triangles
    expect((b.vrange[3]! - b.vrange[2]!) / 3).toBe(12);
    const owners = new Set<number>();
    for (let k = 0; k < b.nVerts; k++) owners.add(b.verts[k * VF + 6]!);
    expect([...owners].sort()).toEqual([0, 1, 2, 3, 4, 5]);
    const e = new Set<number>();
    for (let k = 0; k < b.nEdges; k++) e.add(b.edges[k * EF2 + 16]!);
    expect([...e].sort()).toEqual([0, 1, 2, 3, 4, 5]);
    // the normals are unit and outward: a top cap faces +z
    const top = [...Array(b.vrange[3]! - b.vrange[2]!).keys()].map((k) => (b.vrange[2]! + k) * VF + 5).filter((o) => b.verts[o]! > 0.99);
    expect(top.length).toBe(6);
  });

  it("adds an accent ring edge round a solid flagged accent", () => {
    const s = scene3([{ id: "shaft", body: "g", disc: [0, 0, 6], z0: 0, z1: 20, flags: FLAGS.accent }]);
    const b = bake(s.pkg, s.meshes, s.edges, s.pkg.shapes, { ringSegments: 72, ringRadius: 0.62 });
    let ring = 0;
    for (let k = 0; k < b.nEdges; k++) if (b.edges[k * EF2 + 11] === EDGE_RING) ring++;
    expect(ring).toBe(72);
  });

  it("places solids by the poser and shifts an exploded level along its axis", () => {
    const m = new Float32Array(rt.n * 16);
    place(rt, Math.PI / 2, 0, m);
    const link = SOLIDS.findIndex((s) => s.id === "link");
    // turned a quarter turn: the link's x axis now points along +y
    expect(m[link * 16 + 0]).toBeCloseTo(0);
    expect(m[link * 16 + 1]).toBeCloseTo(1);
    const lv = scene3([{ id: "a", body: "g", rect: [0, 0, 10, 10], z0: 0, z1: 5, ex: 2 }]);
    const r2 = runtime(lv);
    const mm = new Float32Array(16);
    place(r2, 0, 1, mm);
    expect(mm[14]).toBeCloseTo(22); // 2 levels of 11 mm
    place(r2, 0, 0, mm);
    expect(mm[14]).toBeCloseTo(0);
    const w = worldBox(r2, mm, 0);
    expect(w[5]).toBeCloseTo(5);
  });

  it("writes the solid table: pose rows, paper, flags; a see-through solid takes its share of the paper", () => {
    const m = new Float32Array(rt.n * 16);
    place(rt, 0, 0, m);
    const see = new Uint8Array(rt.n);
    const table = new Float32Array(rt.n * ST * 4);
    const L = ladder("full", { tilt: 0, explode: 0 });
    rows(rt, m, { see, ladder: L, card: false, patterns: true }, table);
    const cover = SOLIDS.findIndex((s) => s.id === "cover");
    const plain = table[cover * ST * 4 + 12]!;
    see[cover] = 1;
    rows(rt, m, { see, ladder: L, card: false, patterns: true }, table);
    expect(table[cover * ST * 4 + 12]).toBeCloseTo(plain * DRAFT.fill.seeThrough.opacity);
    expect(table[cover * ST * 4 + 12 + 2]).toBeLessThan(1);
    // the detail ladder hides a solid by a flag
    const hide = ladder("H", { tilt: 0, explode: 0 });
    const s2 = scene3([{ id: "w", body: "g", rect: [0, 0, 5, 5], z0: 0, z1: 2, kind: "washer", detail: "D" }]);
    const r3 = runtime(s2);
    const t3 = new Float32Array(ST * 4 * 1024);
    rows(r3, new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]), { see: new Uint8Array(1), ladder: hide, card: false, patterns: true }, t3);
    expect(t3[24 + 1]).toBe(1);
  });
});

describe("principle visibility (T10, T17)", () => {
  const scene = scene3(SOLIDS, { poser: turning("arm", 0, 0), teaching });
  const rt = runtime(scene);
  const m = new Float32Array(rt.n * 16);
  place(rt, 0, 0, m);
  const boxes = new Float64Array(rt.n * 6);
  const wb: number[] = [];
  for (let i = 0; i < rt.n; i++) {
    worldBox(rt, m, i, wb);
    for (let k = 0; k < 6; k++) boxes[i * 6 + k] = wb[k]!;
  }
  const cam = (name: "PLAN" | "FRONT" | "ISOMETRIC") => fit(basisOfOrient(namedOrient(name)), 800, 600, [-80, -80, 0, 80, 80, 34]);
  const ids = (s: Uint8Array) => SOLIDS.filter((_, i) => s[i]).map((x) => x.id);

  it("sweeps a principle part over the cycle", () => {
    const sw = swept(rt);
    const link = SOLIDS.findIndex((s) => s.id === "link");
    // a 50 mm link turning about the origin sweeps a 100 mm square
    expect(sw[link * 6]).toBeLessThan(-45);
    expect(sw[link * 6 + 3]).toBeGreaterThan(45);
  });

  it("draws a static solid over the principle see-through in plan, and nothing else", () => {
    const see = seeThrough(rt, boxes, cam("PLAN"));
    expect(ids(see)).toEqual(["cover"]);
  });

  it("never makes the base, a principle part or a solid behind it see-through; one beside it is not covering", () => {
    const see = seeThrough(rt, boxes, cam("PLAN"));
    for (const id of ["base", "link", "mover", "under", "far"]) expect(see[SOLIDS.findIndex((s) => s.id === id)], id).toBe(0);
  });

  it("judges the view: from below the plate under the link covers it, and the cover now lies between the viewer and the mover", () => {
    const below = fit(basisOfOrient({ yaw: 0, tilt: 180 }), 800, 600, [-80, -80, 0, 80, 80, 34]);
    expect(ids(seeThrough(rt, boxes, below))).toEqual(["cover", "under"]);
  });

  it("eases a solid in and out of see-through while the view turns, never in one step", () => {
    const amount = new Float32Array(rt.n);
    let prev: Float32Array | null = null;
    let worst = 0;
    let moved = 0;
    for (let t = 0; t <= 180; t += 0.5) {
      const C = fit(basisOfOrient({ yaw: 30, tilt: t }), 800, 600, [-80, -80, 0, 80, 80, 34]);
      seeThrough(rt, boxes, C, new Uint8Array(rt.n), amount);
      if (prev) for (let i = 0; i < rt.n; i++) {
        const d = Math.abs(amount[i]! - prev[i]!);
        worst = Math.max(worst, d);
        if (d > 0) moved++;
      }
      prev = amount.slice();
    }
    expect(moved).toBeGreaterThan(0);
    expect(worst).toBeLessThan(0.34);
  });

  it("is stable while the part moves: the set depends on the sweep, not on the phase", () => {
    const m2 = new Float32Array(rt.n * 16);
    place(rt, 2.3, 0, m2);
    const b2 = new Float64Array(rt.n * 6);
    for (let i = 0; i < rt.n; i++) {
      worldBox(rt, m2, i, wb);
      for (let k = 0; k < 6; k++) b2[i * 6 + k] = wb[k]!;
    }
    expect(ids(seeThrough(rt, b2, cam("PLAN")))).toEqual(["cover"]);
  });
});

describe("teaching layers", () => {
  const poser = turning("arm", 0, 0, {
    tip: (u) => [50 * Math.cos(u), 50 * Math.sin(u), 20],
    rock: (u) => [30 + 10 * Math.sin(u), 0, 20],
    // a wheel's mark turned on 240 degrees a cycle, and one on a ratio that never comes round
    wheel: (u) => [40 * Math.cos((2 * u) / 3), 40 * Math.sin((2 * u) / 3), 20],
    slip: (u) => [40 * Math.cos(0.515 * u), 40 * Math.sin(0.515 * u), 20],
  });
  const scene = scene3(SOLIDS, { poser, teaching });
  const rt = runtime(scene);
  const ann = (): Ann => ({ ctx: null as never, w: 100, h: 100, C: fit(basisOfOrient(namedOrient("PLAN")), 100, 100, [-80, -80, 0, 80, 80, 34]), T: theme("dark"), rt, mats: new Float32Array(rt.n * 16), u: 0, explode: 0, LD: ladder("full", { tilt: 0, explode: 0 }), cache: newCache() });

  it("samples a named point's path over the cycle once, and ghost paths at other settings", () => {
    const A = ann();
    const p = pathOf(A, "tip")!;
    expect(p.length).toBe(240 * 3);
    expect(Math.hypot(p[0]!, p[1]!)).toBeCloseTo(50);
    expect(pathOf(A, "tip")).toBe(p);
    expect(pathOf(A, "nowhere")).toBeNull();
    const g = pathOf(A, "rock", { drivers: { phase: Math.PI } })!;
    expect(g[0]).toBeCloseTo(30); // sin(pi) = 0 at u = 0
    expect(pathOf(A, "rock")![3 * 60]).toBeCloseTo(40); // sin(pi / 2) at a quarter
  });

  it("follows a point over the cycles its path takes: closed when it comes round, open once it has gone all round", () => {
    const A = ann();
    expect(locusOf(A, "tip")).toMatchObject({ cycles: 1, closed: true });
    const w = locusOf(A, "wheel")!;
    expect(w).toMatchObject({ cycles: 3, closed: true });
    expect(w.path.length).toBe(3 * 240 * 3);
    // the last sample is a step short of the first: the path closes on itself
    const n = w.path.length;
    expect(Math.hypot(w.path[n - 3]! - w.path[0]!, w.path[n - 2]! - w.path[1]!)).toBeLessThan(1);
    const s = locusOf(A, "slip")!;
    expect(s).toMatchObject({ cycles: 2, closed: false });
    expect(locusOf(A, "nowhere")).toBeNull();
    expect(locusOf(A, "wheel")).toBe(w);
  });

  it("maps a ghost's control to the setting it stands for", () => {
    const t = { controls: [{ id: "die", kind: "driver", driver: "die-pos" }, { id: "e", kind: "param", param: "ecc" }, { id: "br", kind: "design", design: "branch" }] } as never;
    expect(controlFor(t, "die", 1)).toEqual({ drivers: { "die-pos": 1 } });
    expect(controlFor(t, "e", 4)).toEqual({ params: { ecc: 4 } });
    expect(controlFor(t, "br", "up")).toEqual({ design: { branch: "up" } });
    expect(controlFor(null, "x", 2)).toEqual({ drivers: { x: 2 } });
  });

  it("finds the extreme positions of an oscillator and of a slider", () => {
    const swing = scene3([{ id: "r", body: "rocker", rect: [0, -3, 40, 3], z0: 0, z1: 4 }], {
      poser: { period: Math.PI * 2, place: (_s, u) => { const a = 0.4 * Math.sin(u); return [Math.cos(a), Math.sin(a), 0, 0, -Math.sin(a), Math.cos(a), 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]; }, point: () => null, span: () => null },
    });
    const A = { ...ann(), rt: runtime(swing) };
    const us = extremes(A, "rocker");
    expect(us.length).toBe(2);
    expect(Math.sin(us[0]!)).toBeCloseTo(-1, 1);
    expect(Math.sin(us[1]!)).toBeCloseTo(1, 1);
    const slide = scene3([{ id: "s", body: "slider", rect: [0, 0, 10, 10], z0: 0, z1: 4 }], {
      poser: { period: Math.PI * 2, place: (_s, u) => [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 30 * Math.cos(u), 0, 0, 1], point: () => null, span: () => null },
    });
    const B = { ...ann(), rt: runtime(slide) };
    const ex = extremes(B, "slider");
    expect(ex.map((u) => Math.cos(u)).sort()).toEqual([expect.closeTo(-1, 1), expect.closeTo(1, 1)]);
  });
});

// the four-bar's package, built once for the tests that read it
let built: ReturnType<typeof buildPackage> | null = null;
const fourBar = () => (built ??= buildPackage("four-bar"));

describe("posers", () => {
  it("the record's kinematic block places the four-bar's solids: the crank turns a radian a radian and the ground stays", async () => {
    const b = await fourBar();
    const rec = recordById("four-bar") as unknown as { kin: Kin };
    const P = kinPoser(new Kinematics(rec.kin), undefined, b.pkg.lifts);
    const crank = b.pkg.solids.find((s) => s.body === "crank")!;
    const ground = b.pkg.solids.find((s) => s.body === "ground")!;
    expect(P.place(ground, 0)).toEqual(P.place(ground, 2));
    // the crank's rotation from phase 0 to phase 1 is one radian about its axis
    const m0 = P.place(crank, 0);
    const m1 = P.place(crank, 1);
    const turn = Math.atan2(m0[0]! * m1[1]! - m0[1]! * m1[0]!, m0[0]! * m1[0]! + m0[1]! * m1[1]!);
    expect(Math.abs(turn)).toBeCloseTo(1, 5);
  }, 60_000);

  it("the record's kinematic block gives the named points, ghost settings and a sweep", () => {
    const rec = recordById("four-bar") as unknown as { kin: Kin };
    const K = kinPoser(new Kinematics(rec.kin));
    const A = K.point(1.3, "A")!;
    expect(A[0]).toBeCloseTo(10.7, 1);
    expect(A[1]).toBeCloseTo(38.54, 1);
    expect(K.point(1, "no-such")).toBeNull();
    // a ghost setting: a longer crank moves the point
    const G = K.point(1.3, "B", { params: { b: 130 } })!;
    expect(Math.hypot(G[0] - 10.7, G[1] - 38.54)).toBeCloseTo(130, 1);
    // the workspace of a record that gives a sweep
    const sw = K.sweep!("A", undefined, undefined)!;
    expect(sw[0]!.length).toBeGreaterThan(100);
  });

  it("sets up a package in Node as the browser does (decode, tessellate, edges)", async () => {
    const b = await fourBar();
    const s = await setupInline(await encode2(b.pkg));
    expect(s.meshes.length).toBe(b.pkg.shapes.length);
    const rec = recordById("four-bar") as unknown as { kin: Kin };
    const rt = runtime({ pkg: s.pkg, meshes: s.meshes, edges: s.edges, poser: kinPoser(new Kinematics(rec.kin), undefined, s.pkg.lifts), teaching: null, info: { title: "t", no: "n" } });
    expect(rt.baked.nVerts).toBeGreaterThan(10_000);
    expect(rt.fixed.some((f) => f === 0)).toBe(true);
    expect(rt.fixed.some((f) => f === 1)).toBe(true);
  }, 60_000);
});

describe("running belts (SD29)", () => {
  it("puts a whole number of marks round a belt, spaced within draft.spin.belt, that come back in step after a cycle", () => {
    for (const [L, T] of [[140, 64], [696, 192], [430.7, -188.5], [12, 64]] as const) {
      const { n, k } = runMarks(L, T);
      expect(Number.isInteger(n)).toBe(true);
      if (L / DRAFT.spin.belt[1] >= 1) expect(L / n).toBeGreaterThanOrEqual(DRAFT.spin.belt[0] - 1e-9);
      // the marks' travel over a cycle is a whole number of marks, a percent or so off the belt's
      const m = (k * T * n) / L;
      expect(Math.abs(m - Math.round(m))).toBeLessThan(1e-9);
      if (L > 100) expect(Math.abs(k - 1)).toBeLessThan(0.02);
    }
    // a belt that comes back where it started (a linear input's) needs no slip
    expect(runMarks(300, 0).k).toBe(1);
  });

  it("measures a point's place round a closed path the way it runs", () => {
    const sq: [number, number][] = [[0, 0], [10, 0], [10, 10], [0, 10]];
    expect(loopLength(sq)).toBe(40);
    expect(pathPlace(sq, 4, -1)).toBeCloseTo(4, 12);
    expect(pathPlace(sq, 11, 3)).toBeCloseTo(13, 12);
    expect(pathPlace(sq, -1, 2)).toBeCloseTo(38, 12);
  });

  it("the four-bar's motor belt runs a turn of its 32-tooth pulley a cycle, and its marks are baked along it", async () => {
    const b = await fourBar();
    const belt = b.pkg.solids.find((s) => s.id === "drive-belt")!;
    const tr = belt.run!.tr!;
    expect(belt.run!.path!.length).toBeGreaterThan(16);
    // a GT2 pulley of 32 teeth carries 64 mm of belt a turn
    expect(Math.abs(tr[tr.length - 1]! - tr[0]!)).toBeCloseTo(64, 1);
    const s = await setupInline(await encode2(b.pkg));
    const rec = recordById("four-bar") as unknown as { kin: Kin };
    const rt = runtime({ ...scene3([], {}), pkg: b.pkg, meshes: s.meshes, edges: s.edges, baked: s.baked, poser: kinPoser(new Kinematics(rec.kin), undefined, b.pkg.lifts) } as never);
    const i = b.pkg.solids.indexOf(belt);
    const run = rt.runs.find((r) => r.i === i)!;
    expect(run.perMm).toBeGreaterThan(1 / DRAFT.spin.belt[1] - 1e-9);
    // its vertices carry their place along the belt, from 0 to about its length
    const L = loopLength(belt.run!.path!);
    const places = [...Array(rt.baked.vrange[2 * i + 1]! - rt.baked.vrange[2 * i]!).keys()].map((k) => rt.baked.verts[(rt.baked.vrange[2 * i]! + k) * VF + 8]!);
    expect(Math.min(...places)).toBeGreaterThanOrEqual(0);
    expect(Math.max(...places)).toBeGreaterThan(L * 0.9);
    expect(Math.max(...places)).toBeLessThan(L * 1.5);
    // the phase moves on with the cycle and is back in step after it
    expect(Math.abs(run.phase(1) - run.phase(0))).toBeGreaterThan(0.1);
    const d = run.phase(2 * Math.PI) - run.phase(0);
    expect(Math.abs(d - Math.round(d))).toBeLessThan(1e-6);
    // the belt runs the way its pulley's rim goes: on the arc where the path wraps the shaft's (bigger) pulley, a point
    // the pulley carries moves along the path's way as the travel grows
    const pul = b.pkg.solids.find((x) => x.id === "drive-pulley-shaft")!;
    const fr = belt.fr;
    const y = [fr.z[1] * fr.x[2] - fr.z[2] * fr.x[1], fr.z[2] * fr.x[0] - fr.z[0] * fr.x[2], fr.z[0] * fr.x[1] - fr.z[1] * fr.x[0]];
    const world = (q: readonly number[]) => [0, 1, 2].map((k) => fr.o[k]! + fr.x[k]! * q[0]! + y[k]! * q[1]!);
    const path = belt.run!.path!;
    // the radius of the circle through a path point and its neighbours: the bigger arc's points have the bigger radius
    const radius = (k: number) => {
      const [a, q, c] = [path[(k + path.length - 1) % path.length]!, path[k]!, path[(k + 1) % path.length]!];
      const ab = Math.hypot(q[0] - a[0], q[1] - a[1]), bc = Math.hypot(c[0] - q[0], c[1] - q[1]), ca = Math.hypot(a[0] - c[0], a[1] - c[1]);
      const area = Math.abs((q[0] - a[0]) * (c[1] - a[1]) - (q[1] - a[1]) * (c[0] - a[0])) / 2;
      return area > 1e-9 ? (ab * bc * ca) / (4 * area) : Infinity;
    };
    const rs = path.map((_, k) => radius(k));
    // (an arc's radius comes up at every point inside it; a point where an arc meets a span gives a stray one)
    const big = Math.max(...rs.filter((r) => rs.filter((q) => Math.abs(q - r) < 0.2).length >= 5));
    expect(Math.abs(big - 32 / Math.PI)).toBeLessThan(0.3);
    const k0 = rs.findIndex((r) => r === big);
    const on = world(path[k0]!);
    const way = world(path[(k0 + 1) % path.length]!).map((v, k) => v - on[k]!);
    const P = kinPoser(new Kinematics(rec.kin), undefined, b.pkg.lifts);
    const m0 = P.place(pul, 0);
    const m1 = P.place(pul, 1e-3);
    const local = [0, 1, 2].map((r) => [0, 1, 2].reduce((a, k) => a + m0[r * 4 + k]! * (on[k]! - m0[12 + k]!), 0));
    const moved = [0, 1, 2].map((r) => m1[12 + r]! + [0, 1, 2].reduce((a, k) => a + m1[k * 4 + r]! * local[k]!, 0) - on[r]!);
    expect(Math.hypot(...moved)).toBeGreaterThan(1e-4);
    const dot = moved.reduce((a, v, k) => a + v * way[k]!, 0);
    const tr0 = belt.run!.tr!;
    expect(Math.sign(dot)).toBe(Math.sign(tr0[1]! - tr0[0]!));
  }, 60_000);
});

describe("the part to watch (SD30)", () => {
  it("marks a focus solid in the table and keeps its opacity; a cover goes lighter; nothing else changes", () => {
    const solids: Fx[] = [
      { id: "base", body: "ground", rect: [-80, -80, 80, 80], z0: 0, z1: 4, role: "ground", kind: "base", flags: FLAGS.isBase },
      { id: "ring", body: "arm", rect: [0, -5, 50, 5], z0: 10, z1: 16, role: "link" },
      { id: "shell", body: "arm", rect: [20, -2, 30, 2], z0: 30, z1: 34, role: "link" },
    ];
    const table = (flags: number[]) => {
      const sc = scene3(solids, { poser: turning("arm", 0, 0), teaching });
      sc.pkg.solids.forEach((s, i) => (s.flags |= flags[i] ?? 0));
      const rt = runtime(sc);
      const m = new Float32Array(rt.n * 16);
      place(rt, 0, 0, m);
      const t = new Float32Array(rt.n * ST * 4);
      rows(rt, m, { see: new Uint8Array(rt.n), ladder: ladder("full", { tilt: 0, explode: 0 }), card: false, patterns: true }, t);
      return t;
    };
    const plain = table([]);
    const marked = table([0, FLAG3.focus, FLAG3.cover]);
    const o = ST * 4;
    // the ring: the focus mark in texel 6 w, its opacity and occlusion untouched
    expect(marked[o + 27]).toBe(1);
    expect(plain[o + 27]).toBe(0);
    expect(Array.from(marked.slice(o + 12, o + 16))).toEqual(Array.from(plain.slice(o + 12, o + 16)));
    // the shell over it: lighter than a see-through part would be
    const c = 2 * ST * 4;
    expect(marked[c + 12]!).toBeLessThan(plain[c + 12]! * DRAFT.fill.seeThrough.opacity + 1e-6);
    expect(marked[c + 23]).toBe(1);
    // the base: the same table either way
    expect(Array.from(marked.slice(0, ST * 4))).toEqual(Array.from(plain.slice(0, ST * 4)));
  });
});
