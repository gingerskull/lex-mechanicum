import { describe, expect, it } from "vitest";
import { recordById } from "../../src/catalog";
import { Kinematics } from "../../src/kin/compose";
import type { Kin } from "../../src/kin/types";
import { models } from "../../src/mechanisms/models";
import { buildPackage2 } from "../../src/package/build2";
import { newCache, controlFor, extremes, pathOf, type Ann } from "../../src/render/v3/annotate";
import { bake, EDGE_RING, EF2, VF } from "../../src/render/v3/bake";
import { basisOfOrient, fit, namedOrient } from "../../src/render/v3/camera";
import { hybridPoser, kinPoser, legacyPoser } from "../../src/render/v3/poser";
import { mulMat, place, rows, runtime, ST, worldBox } from "../../src/render/v3/scene";
import { seeThrough, swept } from "../../src/render/v3/visibility";
import { ladder } from "../../src/render/detail";
import { setupInline } from "../../src/solids/setup";
import { encode2 } from "../../src/package/format2";
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

  it("writes the solid table: pose rows, paper, flags; a see-through solid takes half the paper", () => {
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
    expect(table[cover * ST * 4 + 12]).toBeCloseTo(plain * 0.5);
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
  const poser = turning("arm", 0, 0, { tip: (u) => [50 * Math.cos(u), 50 * Math.sin(u), 20], rock: (u) => [30 + 10 * Math.sin(u), 0, 20] });
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

describe("posers", () => {
  it("today's model places the lifted four-bar's solids: the crank turns about O2 and the ground stays", async () => {
    const b = await buildPackage2("four-bar");
    const model = await models["four-bar"]!();
    const P = legacyPoser(model, 20);
    const crank = b.pkg.solids.find((s) => s.body === "crank" && s.kind === "part")!;
    const ground = b.pkg.solids.find((s) => s.body === "ground")!;
    expect(P.place(ground, 0)).toEqual(P.place(ground, 2));
    const m0 = mulMat(P.place(crank, 0), [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    const m1 = P.place(crank, 1);
    expect(m1[0]).toBeCloseTo(Math.cos(1));
    expect(m1[1]).toBeCloseTo(Math.sin(1));
    expect(m0[0]).toBeCloseTo(1);
    expect(P.point(0, "A")![0]).toBeCloseTo(40);
    expect(P.span(0, "O2", "A")).toBeCloseTo(40);
  }, 60_000);

  it("the record's kinematic block gives the same named points, and the hybrid takes them from it", () => {
    const rec = recordById("four-bar") as unknown as { kin: Kin };
    const K = kinPoser(new Kinematics(rec.kin));
    const A = K.point(1.3, "A")!;
    expect(A[0]).toBeCloseTo(10.7, 1);
    expect(A[1]).toBeCloseTo(38.54, 1);
    expect(K.point(1, "no-such")).toBeNull();
    // a ghost setting: a longer crank moves the point
    const G = K.point(1.3, "B", { params: { b: 130 } })!;
    expect(Math.hypot(G[0] - 10.7, G[1] - 38.54)).toBeCloseTo(130, 1);
    const H = hybridPoser(legacyPoser({ parts: [], solve: () => ({ pts: { Q: [1, 2] } }) } as never, 7), K);
    expect(H.point(0, "Q")).toEqual([1, 2, 7]);
    expect(H.point(1.3, "A")![0]).toBeCloseTo(10.7, 1);
    // the workspace of a record that gives a sweep
    const sw = K.sweep!("A", undefined, undefined)!;
    expect(sw[0]!.length).toBeGreaterThan(100);
  });

  it("sets up a lifted package in Node as the browser does (decode, tessellate, edges)", async () => {
    const b = await buildPackage2("four-bar");
    const s = await setupInline(await encode2(b.pkg));
    expect(s.meshes.length).toBe(b.pkg.shapes.length);
    const rt = runtime({ pkg: s.pkg, meshes: s.meshes, edges: s.edges, poser: legacyPoser(await models["four-bar"]!(), 10), teaching: null, info: { title: "t", no: "n" } });
    expect(rt.baked.nVerts).toBeGreaterThan(10_000);
    expect(rt.fixed.some((f) => f === 0)).toBe(true);
    expect(rt.fixed.some((f) => f === 1)).toBe(true);
  }, 60_000);
});
