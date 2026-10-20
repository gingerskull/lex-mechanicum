// Fixture models, one per joint type and drive kind. Small and exact; each exercises one rule.
import { D2R, TAU, type Vec2 } from "../../src/core/geom";
import { V, circleX, osc } from "../../src/core/vec";
import { defineMechanism } from "../../src/model/define";
import type { MechanismModel, Solved } from "../../src/model/types";
import { P } from "../../src/parts";
import { bevel, bevelOutline, pitchCones } from "../../src/core/spatial";
import { beltLength, beltPath, beltRing, centresFor, htd, radiusFor } from "../../src/core/flex";
import { sprocketR } from "../../src/rules/j12-flexible";
import { circle } from "../../src/core/geom";

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

/** J10: a wheel keyed to a shaft in plan along x (centre y 0, z 30), turning with the input phase. */
export const j10Model: MechanismModel = defineMechanism({
  id: "fx-j10",
  input: { kind: "manual", part: "wheel" },
  parts: [
    P.disc("wheel", 22, { axis: "x", along: -4, thick: 8, layer: 2, at: "S", spin: (s) => s.a as number, holes: [circle(4, 0, 0, 24)] }),
    P.cap("pS", 0, 7, { axis: "x", along: -25, span: 4, fixed: [0, 30, 0] }),
  ],
  solve: (u) => ({ pts: { S: [0, 30] }, a: u }),
});

/** J10 dead: the same wheel turning on a clamped shaft in plan (its plain outline is bored by the build). */
export const j10DeadModel: MechanismModel = defineMechanism({
  ...j10Model,
  id: "fx-j10-dead",
  parts: [{ ...j10Model.parts[0]!, shape: { outer: j10Model.parts[0]!.shape.outer, holes: [] } }, j10Model.parts[1]!],
});

/**
 * J9: the catalogue's bevel pair, the wheel keyed on a live z shaft (J2, the accent input) and the pinion keyed on a
 * shaft in plan along x (J10), the cones' apex over the wheel's centre.
 */
const [bd1, bd2] = pitchCones(16, 32);
const bp = bevel(16, 4, bd1, 20);
const bg = bevel(32, 4, bd2, 20);
export const j9Model: MechanismModel = defineMechanism({
  id: "fx-j9",
  input: { kind: "rotary", part: "gear" },
  parts: [
    { ...P.custom("gear", bevelOutline(32, 4, bd2), { role: "output", layer: 1, at: "G", spin: (s) => s.a as number, holes: [circle(5, 0, 0, 24)] }), thick: bg.axial, taper: bg.inner, m: 4, z: 32 },
    P.cap("pG", 0, 7, { fixed: [0, 0, 0], accent: true, span: 2 }),
    { ...P.custom("pinion", bevelOutline(16, 4, bd1), { role: "driver", layer: 3, at: "Q", spin: (s) => -2 * (s.a as number), holes: [circle(5, 0, 0, 24)], axis: "x", along: -bp.apex }), thick: bp.axial, taper: bp.inner, m: 4, z: 16 },
    P.cap("pQ", 0, 7, { axis: "x", along: -bp.apex - 6, span: 3, fixed: [0, 10 + bg.apex, 0] }),
  ],
  meshes: [{ a: "pinion", b: "gear", form: "bevel" }],
  solve: (u) => ({ pts: { G: [0, 0], Q: [0, 10 + bg.apex] }, a: u }),
});

/** J11: a lead screw along x (Tr12x3, centre y 0, z 30) driving a carriage, keyed to its shaft in plan. */
export const j11Model: MechanismModel = defineMechanism({
  id: "fx-j11",
  input: { kind: "manual", part: "screw" },
  parts: [
    P.disc("screw", 6, { axis: "x", along: -60, thick: 120, layer: 2, at: "S", spin: (s) => s.a as number, holes: [circle(4, 0, 0, 24)], marks: [] }),
    P.cap("pS", 0, 7, { axis: "x", along: -62, span: 12, fixed: [0, 30, 0] }),
    P.slider("carriage", 40, 50, { layer: 4, at: "N" }),
  ],
  screws: [{ screw: "screw", nut: "carriage", lead: 3, form: "lead" }],
  solve(u) {
    const a = osc(-2 * TAU, 2 * TAU)(u);
    return { pts: { S: [0, 30], N: [(3 * a) / TAU - 10, 0] }, a };
  },
});

/** J12 chain: the catalogue's chain drive, 15T and 30T ISO 606 sprockets at 12.7 pitch, the centres set for 62 links. */
const CH = { p: 12.7, z1: 15, z2: 30 };
const chR1 = sprocketR(CH.z1, CH.p);
const chR2 = sprocketR(CH.z2, CH.p);
const chC = centresFor(chR1, chR2, 62 * CH.p);
export const chainModel: MechanismModel = defineMechanism({
  id: "fx-chain",
  input: { kind: "rotary", part: "s1" },
  parts: [
    P.sprocket("s1", CH.z1, CH.p, 8.5, { role: "driver", at: "O1", spin: (s) => s.a as number, holes: [circle(6, 0, 0, 36)] }),
    P.sprocket("s2", CH.z2, CH.p, 8.5, { role: "output", at: "O2", spin: (s) => (s.a as number) * (CH.z1 / CH.z2), holes: [circle(7.2, 0, 0, 36)] }),
    P.cap("pO1", -1, 7, { fixed: [0, 0, 0], accent: true }),
    P.cap("pO2", -1, 7, { fixed: [chC, 0, 0] }),
  ],
  flexible: [{ form: "chain", over: ["s1", "s2"], travel: "t", pitch: CH.p, roller: 8.5 }],
  // one pitch of chain per tooth: the travel is the driver's angle times z1·p / 2π (the mean chain speed)
  solve: (u) => ({ pts: { O1: [0, 0], O2: [chC, 0] }, a: u, t: (u * CH.z1 * CH.p) / TAU }),
});

/** J12 rope: a rope over two fixed sheaves, a load block on one end rising as the other end is hauled down. */
const RS = 25;
const ropeSpan = (id: string, a: string, b: string): ReturnType<typeof P.custom> =>
  P.custom(id, [[0, -1.6], [1, -1.6], [1, 1.6], [0, 1.6]], { role: "link", layer: 2, dz: -8, thick: 3.2, between: [a, b], stretch: true });
export const ropeModel: MechanismModel = defineMechanism({
  id: "fx-rope",
  input: { kind: "manual", part: "load" },
  parts: [
    P.disc("u1", RS, { role: "ground", layer: 1, fixed: [-40, 0, 0] }),
    P.disc("u2", RS, { role: "ground", layer: 1, fixed: [40, 0, 0] }),
    ropeSpan("spanA", "A0", "A"),
    ropeSpan("spanM", "M0", "M1"),
    ropeSpan("spanB", "B0", "B"),
    P.custom("load", [[-14, -24], [14, -24], [14, 0], [-14, 0]], { role: "output", layer: 1, at: "A" }),
  ],
  flexible: [{ form: "rope", over: ["u1", "u2"], spans: ["spanA", "spanM", "spanB"], hook: "A", load: "load" }],
  solve(u) {
    const ya = 60 + 50 * (0.5 - 0.5 * Math.cos(u));
    return { pts: { A0: [-40 - RS, 0], A: [-40 - RS, -ya], M0: [-40, RS], M1: [40, RS], B0: [40 + RS, 0], B: [40 + RS, -170 + ya] } };
  },
});

/** J13: a notch flexure, a lever rocking ±3° on a neck cut from its ground block. */
const FX = 3 * D2R;
export const flexureModel: MechanismModel = defineMechanism({
  id: "fx-flexure",
  input: { kind: "manual", part: "lever" },
  parts: [
    P.custom("block", [[-40, -20], [-6, -20], [-6, 20], [-40, 20]], { role: "ground", fixed: [0, 0, 0] }),
    P.custom("neck", [[-6, -2], [6, -2], [6, 2], [-6, 2]], { role: "link", fixed: [0, 0, 0] }),
    P.custom("lever", [[6, -6], [70, -6], [70, 6], [6, 6]], { role: "driver", at: "N", spin: (s) => s.b as number }),
  ],
  compliant: [{ neck: "neck", ground: "block", lever: "lever", at: "N", range: [-FX, FX] }],
  solve: (u) => ({ pts: { N: [0, 0] }, b: osc(-FX, FX)(u) }),
  angles: (s) => [{ type: "bend", c: [0, 0], a: 0, L: 12, w: 4, bend: s.b as number, key: "neck" }],
});

/**
 * A deforming outline: a flexspline-like ring pushed into an ellipse whose major axis turns with the input (a wave
 * generator), 120 points every frame.
 */
const flexRing = (a: number): Vec2[] =>
  Array.from({ length: 120 }, (_, i) => {
    const t = (i / 120) * TAU;
    const r = 40 + 1.5 * Math.cos(2 * (t - a));
    return [r * Math.cos(t), r * Math.sin(t)];
  });
export const deformModel: MechanismModel = defineMechanism({
  id: "fx-deform",
  input: { kind: "rotary", part: "wave" },
  parts: [
    { ...P.custom("flexspline", flexRing(0), { role: "output", fixed: [0, 0, 0], holes: [circle(34, 0, 0, 72)] }), deform: (s: { [k: string]: unknown }) => flexRing(s.a as number) },
    P.custom("wave", Array.from({ length: 48 }, (_, i): Vec2 => [30 * Math.cos((i / 48) * TAU), 26 * Math.sin((i / 48) * TAU)]), { role: "driver", layer: 1, at: "O", spin: (s) => s.a as number, holes: [circle(5, 0, 0, 24)] }),
    P.cap("pO", -1, 7, { fixed: [0, 0, 0], accent: true, span: 2 }),
  ],
  solve: (u) => ({ pts: { O: [0, 0] }, a: u }),
});

/**
 * Posed axes (#169): a universal joint at 30°. The input shaft and its yoke turn on x; the output shaft lies in plan at
 * 30° to it. The cross and the output yoke are posed by solved frames: the cross's arms along the input yoke's pins
 * (a) and the output yoke's pins (b = s2 x a), the output yoke's axis along the output shaft.
 */
const UJ = { beta: 30 * D2R, zc: 40, r: 14 };
const s2: [number, number, number] = [Math.cos(UJ.beta), Math.sin(UJ.beta), 0];
const norm = (v: [number, number, number]): [number, number, number] => {
  const l = Math.hypot(...v) || 1;
  return [v[0] / l, v[1] / l, v[2] / l];
};
const ears = (r: number): Vec2[][] => [[[r - 3, -5], [r + 3, -5], [r + 3, 5], [r - 3, 5]], [[-r - 3, -5], [-r + 3, -5], [-r + 3, 5], [-r - 3, 5]]];
const plus = (r: number, w: number): Vec2[] => [
  [-r, -w], [-w, -w], [-w, -r], [w, -r], [w, -w], [r, -w], [r, w], [w, w], [w, r], [-w, r], [-w, w], [-r, w],
];
export const ujointModel: MechanismModel = defineMechanism({
  id: "fx-ujoint",
  input: { kind: "manual", part: "shaft1" },
  parts: [
    P.disc("shaft1", 6, { axis: "x", along: -90, thick: 72, layer: 2, at: "S", spin: (s) => s.a as number, role: "driver", marks: [] }),
    P.disc("hub1", 10, { axis: "x", along: -24, thick: 6, layer: 3, at: "S", spin: (s) => s.a as number, role: "driver" }),
    P.custom("ears1a", ears(UJ.r)[0]!, { axis: "x", along: -18, thick: 22, layer: 3, at: "S", spin: (s) => s.a as number, role: "driver" }),
    P.custom("ears1b", ears(UJ.r)[1]!, { axis: "x", along: -18, thick: 22, layer: 3, at: "S", spin: (s) => s.a as number, role: "driver" }),
    P.custom("cross", plus(UJ.r + 2, 3), { axis: "p", frame: "cross", along: -3, thick: 6, layer: 3, fixed: [0, 0, 0], role: "link" }),
    P.custom("ears2a", ears(UJ.r)[0]!, { axis: "p", frame: "yoke2", along: -4, thick: 22, layer: 3, fixed: [0, 0, 0], role: "output" }),
    P.custom("ears2b", ears(UJ.r)[1]!, { axis: "p", frame: "yoke2", along: -4, thick: 22, layer: 3, fixed: [0, 0, 0], role: "output" }),
    P.disc("hub2", 10, { axis: "p", frame: "yoke2", along: 18, thick: 6, layer: 3, fixed: [0, 0, 0], role: "output" }),
    P.disc("shaft2", 6, { axis: "p", frame: "yoke2", along: 24, thick: 66, layer: 2, fixed: [0, 0, 0], role: "output", marks: [] }),
  ],
  solve(u) {
    const a: [number, number, number] = [0, Math.cos(u), Math.sin(u)];
    const b = norm([s2[1] * a[2] - s2[2] * a[1], s2[2] * a[0] - s2[0] * a[2], s2[0] * a[1] - s2[1] * a[0]]);
    const o: [number, number, number] = [0, 0, UJ.zc];
    const v2: [number, number, number] = [s2[1] * b[2] - s2[2] * b[1], s2[2] * b[0] - s2[0] * b[2], s2[0] * b[1] - s2[1] * b[0]];
    return { pts: { S: [0, UJ.zc] }, a: u, frames: { cross: { o, u: a, v: b }, yoke2: { o, u: b, v: v2 } } };
  },
});

/** J10 driven: the J10 wheel's shaft turned by a motor (its free end past the far block). */
export const j10RotaryModel: MechanismModel = defineMechanism({ ...j10Model, id: "fx-j10-rotary", input: { kind: "rotary", part: "wheel" } });

/** J9 driven from the pinion: its shaft in plan overhangs the wheel, so the motor belts to the free end behind the blocks. */
export const j9DriveModel: MechanismModel = defineMechanism({ ...j9Model, id: "fx-j9-drive", input: { kind: "rotary", part: "pinion" } });

/**
 * J12 rope with a dead end: sheave u1 posed at a point that stands still (not a fixed part) on layer 1 with a wrap over
 * it, sheave u2 fixed on layer 3, the rope dead-ended under u2 on a becket and the load hanging from u1's side.
 */
const rbSpan = (id: string, a: string, b: string, layer: number) => P.ropeSpan(id, a, b, { layer, dz: -8 });
export const ropeBecketModel: MechanismModel = defineMechanism({
  id: "fx-rope-becket",
  input: { kind: "manual", part: "load" },
  parts: [
    P.disc("u1", RS, { role: "link", layer: 1, at: "U1", spin: (s) => s.t as number }),
    P.disc("u2", RS, { role: "ground", layer: 3, fixed: [40, 0, 0] }),
    rbSpan("spanA", "A0", "A", 2),
    rbSpan("spanM", "M0", "M1", 2),
    rbSpan("spanB", "B0", "B", 4),
    P.ropeWrap("w1", RS, Math.PI / 2, Math.PI, { layer: 2, dz: -8, at: "U1" }),
    P.custom("load", [[-14, -24], [14, -24], [14, 0], [-14, 0]], { role: "output", layer: 1, at: "A" }),
    P.cap("pU1", 0, 6, { fixed: [-40, 0, 0], span: 2 }),
  ],
  flexible: [{ form: "rope", over: ["u2", "u1"], spans: ["spanA", "spanM", "spanB"], wraps: ["w1"], dead: "B", hook: "A", load: "load" }],
  solve(u) {
    const ya = 60 + 50 * (0.5 - 0.5 * Math.cos(u));
    return { pts: { U1: [-40, 0], A0: [-40 - RS, 0], A: [-40 - RS, -ya], M0: [-40, RS], M1: [40, RS], B0: [40 + RS, 0], B: [40 + RS, -100] }, t: ya / RS };
  },
});

/** A rope span stretched between two points 50 mm apart, across a plate on its layer, and a pin through its far end. */
export const stretchModel: MechanismModel = defineMechanism({
  id: "fx-stretch",
  input: { kind: "manual", part: "span" },
  parts: [
    P.ropeSpan("span", "S0", "S1", { layer: 2, rope: 6 }),
    P.custom("plate", [[20, -2], [30, -2], [30, 2], [20, 2]], { role: "ground", layer: 2, fixed: [0, 0, 0] }),
    P.cap("pX", 2, 1.5, { fixed: [42, 0, 0] }),
  ],
  solve: () => ({ pts: { S0: [0, 0], S1: [50, 0] } }),
});

/**
 * J12 timing belt: HTD 5M, 36 and 18 grooves, the centres set for 90 teeth; the large pulley declared first and the small
 * one driving, so the slack span is the upper one and the small pulley the second (the belt drive has them the other
 * way round). The band is a fixed part round the pitch path, its teeth carried round by the travel t.
 */
const BT = { p: 5, z1: 36, z2: 18 };
const btR1 = (BT.p * BT.z1) / TAU;
const btR2 = (BT.p * BT.z2) / TAU;
const btC = centresFor(btR1, btR2, 90 * BT.p);
const btBand = (off: number): Vec2[] => beltPath([0, 0], btR1 + off, [btC, 0], btR2 + off, Math.PI / 96);
export const beltModel: MechanismModel = defineMechanism({
  id: "fx-belt",
  input: { kind: "rotary", part: "small" },
  parts: [
    P.pulley("big", BT.z1, BT.p, { role: "output", at: "O1", spin: (s) => s.b as number, holes: [circle(7.2, 0, 0, 36)] }),
    P.pulley("small", BT.z2, BT.p, { role: "driver", at: "O2", spin: (s) => s.a as number, holes: [circle(6, 0, 0, 36)] }),
    P.custom("band", btBand(htd(BT.p).hs - htd(BT.p).ht - htd(BT.p).pld), { role: "link", dz: 0.6, thick: 5.8, fixed: [0, 0, 0], holes: [btBand(-htd(BT.p).pld + 0.05)] }),
    P.cap("pO1", -1, 7, { fixed: [0, 0, 0] }),
    P.cap("pO2", -1, 7, { fixed: [btC, 0, 0], accent: true }),
  ],
  flexible: [{ form: "belt", over: ["big", "small"], travel: "t", pitch: BT.p, band: "band" }],
  solve: (u) => ({ pts: { O1: [0, 0], O2: [btC, 0] }, a: u, b: (u * btR2) / btR1, t: u * btR2 }),
});

/**
 * J12 CVT: two live z shafts 110 apart, each with a fixed sheave half (a frustum, `taper`) and a sliding half posed by
 * a frame that slides along the shaft (axis "p"), set diagonally: the input's fixed half above its sliding half, the
 * output's below. The V-belt is a deforming band (its outer and inner edges both change, a hole) on a frame that moves
 * with the belt plane. The input's wrap radius is swept over the cycle while it turns twice; the output's is solved from
 * the constant belt length (radiusFor) and its angle integrated (with a linear trim to a whole number of turns, so
 * the cycle closes). The output half is sprung; the input half is set by the cycle.
 */
export const CVT = { C: 110, R: 40, k: 0.35, t: 6, w: 10, h: 6, n: 24 };
const cvtL = beltLength(25, 25, CVT.C);
const cvtR1 = (u: number) => 25 + 7 * Math.sin(u);
const cvtR2 = (u: number) => radiusFor(cvtR1(u), CVT.C, cvtL);
/** The axial gap between the halves' faces where the belt runs at radius r. */
const cvtGap = (r: number) => CVT.w - (2 * CVT.t * (r - CVT.k * CVT.R)) / (CVT.R * (1 - CVT.k));
// the fixed halves' faces: the output's up at z 6, the input's down at the mean belt plane plus its mean gap
const CVT_N = 720;
const cvtB: number[] = [0];
let cvtG = 0;
for (let i = 0; i < CVT_N; i++) {
  const u = ((i + 0.5) / CVT_N) * TAU;
  cvtB.push(cvtB[i]! + (2 * (TAU / CVT_N) * cvtR1(u)) / cvtR2(u));
  cvtG += (cvtGap(cvtR1(u)) + cvtGap(cvtR2(u))) / 2 / CVT_N;
}
const cvtTrim = (Math.round(cvtB[CVT_N]! / TAU) * TAU - cvtB[CVT_N]!) / TAU;
const cvtOut = (u: number) => {
  const x = ((((u % TAU) + TAU) % TAU) / TAU) * CVT_N;
  const i = Math.min(CVT_N - 1, Math.floor(x));
  return cvtB[i]! + (cvtB[i + 1]! - cvtB[i]!) * (x - i) + cvtTrim * (((u % TAU) + TAU) % TAU) + Math.round(cvtB[CVT_N]! / TAU) * TAU * Math.floor(u / TAU);
};
const zOutFace = 6;
const zInFace = zOutFace + cvtG;
const cvtBand = (r1: number, r2: number) => ({
  outer: beltRing([0, 0], r1 + CVT.h / 2, [CVT.C, 0], r2 + CVT.h / 2, CVT.n),
  holes: [beltRing([0, 0], r1 - CVT.h / 2, [CVT.C, 0], r2 - CVT.h / 2, CVT.n)],
});
const half = (id: string, r: number, o: Parameters<typeof P.disc>[2], taper: number) => ({ ...P.disc(id, r, { ...o, thick: CVT.t, holes: [circle(6, 0, 0, 36)], marks: [] }), taper });
export const cvtModel: MechanismModel = defineMechanism({
  id: "fx-cvt",
  input: { kind: "rotary", part: "inFixed" },
  parts: [
    // the input's fixed half: its narrow face down (it widens toward z1, taper 1 / k)
    half("inFixed", CVT.k * CVT.R, { role: "driver", layer: 1, dz: zInFace - 10, at: "O1", spin: (s) => s.a as number }, 1 / CVT.k),
    half("inSlide", CVT.R, { role: "driver", axis: "p", frame: "inSlide", along: 0, layer: 0, fixed: [0, 0, 0] }, CVT.k),
    half("outFixed", CVT.R, { role: "output", layer: 0, dz: 0, at: "O2", spin: (s) => s.b as number }, CVT.k),
    half("outSlide", CVT.k * CVT.R, { role: "output", axis: "p", frame: "outSlide", along: 0, layer: 1, fixed: [0, 0, 0] }, 1 / CVT.k),
    { ...P.custom("vbelt", cvtBand(25, 25).outer, { role: "link", axis: "p", frame: "belt", along: -4, thick: 8, layer: 1, fixed: [0, 0, 0], holes: cvtBand(25, 25).holes }), deform: (s: Solved) => cvtBand(s.r1 as number, s.r2 as number) },
    P.cap("pO1", -1, 7, { fixed: [0, 0, 0], accent: true, span: 3 }),
    P.cap("pO2", -1, 7, { fixed: [CVT.C, 0, 0] }),
  ],
  flexible: [{ form: "cvt", pairs: [{ fixed: "inFixed", sliding: "inSlide" }, { fixed: "outFixed", sliding: "outSlide", spring: true }], belt: "vbelt" }],
  solve(u) {
    const r1 = cvtR1(u);
    const r2 = cvtR2(u);
    const g1 = cvtGap(r1);
    const g2 = cvtGap(r2);
    const a = 2 * u;
    const b = cvtOut(u);
    // the input's sliding half below its fixed one (its back at z0), the output's above (its face at z0)
    const fr = (o: [number, number, number], ang: number) => ({ o, u: [Math.cos(ang), Math.sin(ang), 0] as [number, number, number], v: [-Math.sin(ang), Math.cos(ang), 0] as [number, number, number] });
    return {
      pts: { O1: [0, 0], O2: [CVT.C, 0] },
      a,
      b,
      r1,
      r2,
      frames: {
        inSlide: fr([0, 0, zInFace - g1 - CVT.t], a),
        outSlide: fr([CVT.C, 0, zOutFace + g2], b),
        belt: fr([0, 0, (zInFace - g1 / 2 + zOutFace + g2 / 2) / 2], 0),
      },
    };
  },
});
