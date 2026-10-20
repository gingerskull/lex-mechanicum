// Fixture models, one per joint type and drive kind. Small and exact; each exercises one rule.
import { D2R, TAU, type Vec2 } from "../../src/core/geom";
import { V, circleX, osc } from "../../src/core/vec";
import { defineMechanism } from "../../src/model/define";
import type { MechanismModel } from "../../src/model/types";
import { P } from "../../src/parts";

/** J1: an arm 8 mm thick turning on a plain fixed pin (no accent, nothing keyed): a dead axle. */
export const j1Model: MechanismModel = defineMechanism({
  id: "fx-j1",
  input: { kind: "rotary", part: "arm" },
  parts: [{ ...P.link("arm", 60, { role: "output", w: 20, between: ["O", "A"] }), thick: 8 }, P.cap("pO", -1, 6, { fixed: [0, 0, 0] })],
  solve: (u) => ({ pts: { O: [0, 0], A: V.at([0, 0], u, 60) } }),
});

/** J2: a crank on the accent input pivot: a live shaft. */
export const j2Model: MechanismModel = defineMechanism({
  id: "fx-j2",
  input: { kind: "rotary", part: "crank" },
  parts: [P.link("crank", 40, { role: "driver", w: 19, between: ["O", "A"] }), P.cap("pO", -1, 7, { fixed: [0, 0, 0], accent: true })],
  solve: (u) => ({ pts: { O: [0, 0], A: V.at([0, 0], u, 40) } }),
});

/** J4: a crank pin running in the slot of a link that swings on a fixed pivot below (a quick-return core). */
const O4: Vec2 = [0, -80];
export const j4Model: MechanismModel = defineMechanism({
  id: "fx-j4",
  input: { kind: "rotary", part: "crank" },
  parts: [
    P.link("crank", 30, { role: "driver", w: 19, between: ["O2", "A"] }),
    P.slotLink("lever", 130, 40, 120, { layer: 1, w: 24, slotW: 12, between: ["O4", "A"] }),
    P.cap("pO2", -1, 7, { fixed: [0, 0, 0], accent: true }),
    P.cap("pO4", -1, 7, { fixed: [O4[0], O4[1], 0], span: 2 }),
    P.cap("pA", 0, 5.5, { at: "A", span: 2 }),
  ],
  solve: (u) => ({ pts: { O2: [0, 0], O4, A: V.at([0, 0], u, 30) } }),
});

/** J5: an in-line slider-crank on rails. */
const a = 25;
const b = 90;
export const j5Model: MechanismModel = defineMechanism({
  id: "fx-j5",
  input: { kind: "rotary", part: "crank" },
  parts: [
    P.link("crank", a, { role: "driver", w: 19, between: ["O", "A"] }),
    P.link("rod", b, { layer: 1, w: 16, between: ["A", "C"] }),
    P.slider("block", 30, 20, { at: "C" }),
    ...P.rails("rail", 40, 160, 20),
    P.cap("pO", -1, 7, { fixed: [0, 0, 0], accent: true }),
    P.cap("pA", 0, 5.5, { at: "A" }),
    P.cap("pC", 0, 5.5, { at: "C" }),
  ],
  solve(u) {
    const A = V.at([0, 0], u, a);
    const C: Vec2 = [A[0] + Math.sqrt(b * b - A[1] * A[1]), 0];
    return { pts: { O: [0, 0], A, C } };
  },
});

/** J6: a 14T pinion on the input meshing a 28T wheel, module 4, both keyed on fixed pivots. */
export const j6Model: MechanismModel = defineMechanism({
  id: "fx-j6",
  input: { kind: "rotary", part: "g1" },
  parts: [
    P.gear("g1", 14, 4, { at: "O1", spin: (s) => s.a as number }),
    P.gear("g2", 28, 4, { at: "O2", spin: (s) => s.b as number, role: "output" }),
    P.cap("p1", -1, 7, { fixed: [0, 0, 0], accent: true }),
    P.cap("p2", -1, 7, { fixed: [84, 0, 0] }),
  ],
  solve: (u) => ({ pts: { O1: [0, 0], O2: [84, 0] }, a: u, b: -u / 2 + Math.PI / 28 }),
});

/** J7: a disc cam on the input lifting a slider follower on rails. */
const camR = (t: number) => 30 + 8 * (1 - Math.cos(t)) / 2;
export const j7Model: MechanismModel = defineMechanism({
  id: "fx-j7",
  input: { kind: "rotary", part: "cam" },
  parts: [
    P.custom("cam", Array.from({ length: 72 }, (_, i) => { const t = (i / 72) * TAU; return [camR(t) * Math.cos(t), camR(t) * Math.sin(t)] as Vec2; }), { role: "driver", at: "O", spin: (s) => s.u as number }),
    P.slider("follower", 30, 16, { at: "F" }),
    ...P.rails("rail", 40, 120, 16),
    P.cap("pO", -1, 7, { fixed: [0, 0, 0], accent: true }),
  ],
  cams: [{ cam: "cam", follower: "follower" }],
  solve(u) {
    // the follower's flat face rests on the cam where the cam radius points along +x
    const r = camR(-u);
    return { pts: { O: [0, 0], F: [r + 15, 0] }, u };
  },
});

/** Oscillating input: a rocker on the accent pivot swinging ±30°. */
export const oscModel: MechanismModel = defineMechanism({
  id: "fx-osc",
  input: { kind: "oscillating", part: "rocker" },
  parts: [P.link("rocker", 50, { role: "driver", w: 18, between: ["O", "A"] }), P.cap("pO", -1, 7, { fixed: [0, 0, 0], accent: true })],
  solve: (u) => ({ pts: { O: [0, 0], A: V.at([0, 0], osc(60 * D2R, 120 * D2R)(u), 50) } }),
});

/** Manual input: the same rocker turned by hand. */
export const manualModel: MechanismModel = defineMechanism({ ...oscModel, id: "fx-manual", input: { kind: "manual", part: "rocker" } });

/** A four-bar for J3 (pins between links), as the catalogue's. */
export const j3Model: MechanismModel = defineMechanism({
  id: "fx-j3",
  input: { kind: "rotary", part: "crank" },
  parts: [
    P.link("crank", 40, { role: "driver", w: 19, between: ["O2", "A"] }),
    P.link("rocker", 80, { role: "output", w: 16, between: ["O4", "B"] }),
    P.link("coupler", 120, { layer: 1, w: 22, between: ["A", "B"] }),
    P.cap("pO2", -1, 7, { fixed: [0, 0, 0], accent: true }),
    P.cap("pO4", -1, 7, { fixed: [100, 0, 0] }),
    P.cap("pA", 0, 5.5, { at: "A" }),
    P.cap("pB", 0, 5.5, { at: "B" }),
  ],
  solve(u) {
    const A = V.at([0, 0], u, 40);
    return { pts: { O2: [0, 0], O4: [100, 0], A, B: circleX(A, 120, [100, 0], 80, 1) } };
  },
});

/**
 * Promotions: the J3 four-bar with a plated coupler (dz), tapered links and a clevis rocker (a front plate twinned with
 * the rear one round B and O4).
 */
export const clevisModel: MechanismModel = defineMechanism({
  id: "fx-clevis",
  input: { kind: "rotary", part: "crank" },
  parts: [
    P.link("crank", 40, { role: "driver", r: [13, 9.5], between: ["O2", "A"] }),
    P.link("rocker", 80, { role: "output", r: [12, 9.5], between: ["O4", "B"] }),
    P.link("coupler", 120, { layer: 1, w: 22, dz: -2.5, between: ["A", "B"] }),
    P.link("front", 80, { role: "output", r: [12, 9.5], layer: 2, dz: -5, twin: "rocker", between: ["O4", "B"] }),
    P.cap("pO2", -1, 7, { fixed: [0, 0, 0], accent: true }),
    P.cap("pO4", -1, 7, { fixed: [100, 0, 0], span: 3 }),
    P.cap("pA", 0, 5.5, { at: "A" }),
    P.cap("pB", 0, 5.5, { at: "B", span: 2 }),
  ],
  solve(u) {
    const A = V.at([0, 0], u, 40);
    return { pts: { O2: [0, 0], O4: [100, 0], A, B: circleX(A, 120, [100, 0], 80, 1) } };
  },
});

/**
 * A hung pivot: a lever on a ground pivot in the top layer, and a crank beneath it whose sweep covers that pivot, so no
 * shaft can rise from the base to the lever. The lever turns with the crank's phase, nothing joins them.
 */
export const hungModel: MechanismModel = defineMechanism({
  id: "fx-hung",
  input: { kind: "rotary", part: "crank" },
  parts: [
    P.link("crank", 60, { role: "driver", r: [13, 9.5], between: ["O2", "A"] }),
    P.link("lever", 50, { role: "output", r: [12, 9.5], layer: 2, between: ["O4", "B"] }),
    P.cap("pO2", -1, 7, { fixed: [0, 0, 0], accent: true }),
    P.cap("pO4", 2, 7, { fixed: [25, 0, 0], top: "hung" }),
  ],
  solve(u) {
    return { pts: { O2: [0, 0], O4: [25, 0], A: V.at([0, 0], u, 60), B: V.at([25, 0], osc(-60 * D2R, 60 * D2R)(u), 50) } };
  },
});

/**
 * Axes out of the plan plane (src/core/axis.ts): a shaft in plan along x (its section in the y-z plane, centre y 0,
 * z 30), a wheel standing on edge normal to y (centre x 60, z 30) and a plate lying on the base plane beside them.
 */
export const axisModel: MechanismModel = defineMechanism({
  id: "fx-axis",
  input: { kind: "rotary", part: "shaft" },
  parts: [
    P.disc("shaft", 5, { axis: "x", along: -40, thick: 80, layer: 2, at: "S", spin: (s) => s.a as number, marks: [] }),
    P.disc("wheel", 20, { axis: "y", along: 40, thick: 6, layer: 2, at: "W", spin: (s) => s.a as number, role: "output" }),
    P.disc("plate", 25, { fixed: [0, 60, 0], role: "ground" }),
  ],
  solve: (u) => ({ pts: { S: [0, 30], W: [60, 30] }, a: u }),
});
