import { describe, expect, it } from "vitest";
import type { Kin, Teaching } from "../../src/catalog/kin";
import { mergeSources } from "../../src/catalog/merge";
import { validate } from "../../src/catalog/validate";
import { mobility } from "../../src/catalog/validate-kin";
import { record } from "./fixtures";

/** A crank-rocker, small and complete: every check of the record spec passes on it. */
function fourBar(): { kin: Kin; teaching: Teaching } {
  const z = [0, 0, 1] as [number, number, number];
  return {
    kin: {
      bodies: [
        { id: "ground", role: "ground", shape: { type: "plate" } },
        { id: "crank", role: "driver", shape: { type: "link", length: 40 }, at: { joint: "O2" } },
        { id: "coupler", role: "link", shape: { type: "plate" }, at: { joint: "A" } },
        { id: "rocker", role: "output", shape: { type: "link", length: 80 }, at: { joint: "O4" } },
      ],
      joints: [
        { id: "O2", type: "revolute", a: "ground", b: "crank", at: [0, 0, 0], axis: z },
        { id: "A", type: "revolute", a: "crank", b: "coupler", at: [40, 0, 0], axis: z },
        { id: "B", type: "revolute", a: "coupler", b: "rocker", at: [136.67, 71.1, 0], axis: z },
        { id: "O4", type: "revolute", a: "ground", b: "rocker", at: [100, 0, 0], axis: z },
      ],
      params: [{ id: "b", value: 120, unit: "mm", min: 90, max: 150 }],
      design: [{ id: "branch", options: ["elbow-up", "elbow-down"], value: "elbow-up" }],
      drivers: [{ id: "input", joint: "O2", kind: "rotary", range: [0, 360], default: 0 }],
      solve: [{ block: "dyad", id: "dy", joints: ["A", "B", "O4"], in: { a: "A", b: "O4", ra: "b", rb: 80 }, branch: "elbow-up", out: "B" }],
      points: [{ id: "C", body: "coupler", local: [54, 43, 0] }],
      outputs: [{ id: "rocker-angle", of: "rocker", kind: "angle", unit: "deg" }],
      fallback: null,
    },
    teaching: {
      review: { verdict: "keep", date: "2026-10-20", note: "n" },
      principle: [{ body: "crank" }, { point: "C" }],
      traces: [{ id: "c", point: "C", comet: true, ticks: { every: 15 } }],
      overlays: [{ id: "arc", kind: "arc", center: "B", from: "A", to: "O4", label: "TRANSMISSION ANGLE" }],
      view: "PLAN",
      controls: [{ id: "crank", kind: "driver", driver: "input" }],
      plot: { x: "input", y: "rocker-angle", label: "ROCKER ANGLE" },
      claims: [{ text: "swing 73.8°", output: "rocker-angle", stat: "range", value: 73.8, tol: 0.5 }],
      exceptions: [],
    },
  };
}

type Blocks = { kin: Kin; teaching: Teaching };
const withBlocks = (edit: (b: Blocks) => void, over: Parameters<typeof record>[1] = {}) => {
  const b = fourBar();
  edit(b);
  return record("x", { ...over, kin: b.kin, teaching: b.teaching });
};
const has = (problems: string[], text: string) => problems.some((p) => p.includes(text));

describe("kin and teaching validation", () => {
  it("passes a complete record and counts its mobility", () => {
    expect(mobility(fourBar().kin, "Planar")).toBe(1);
    expect(validate([withBlocks(() => {})])).toEqual([]);
    expect(validate([withBlocks(() => {})], { asVersion: 3 })).toEqual([]);
  });

  it("requires the blocks at version 3 and rejects the retired build fields", () => {
    const p = validate([record("x", { record_version: 3 })]);
    expect(p).toEqual(expect.arrayContaining(["x: kin block missing", "x: teaching block missing", "x: build.members is retired in record v3"]));
    expect(validate([record("x")])).toEqual([]);
    expect(validate([record("x")], { asVersion: 3 })).toEqual(["x: kin block missing", "x: teaching block missing"]);
  });

  it("checks joints against bodies and every joint against a block", () => {
    expect(validate([withBlocks((b) => (b.kin.joints[1]!.b = "nope"))])).toContain('x: joint A: b "nope" is not a body');
    expect(validate([withBlocks((b) => (b.kin.solve[0]!.joints = ["A", "B"]))])).toContain("x: joint O4 belongs to no solve block, fallback or driver");
    expect(validate([withBlocks((b) => b.kin.solve.push({ block: "dyad", id: "two", joints: ["A"], in: {}, out: "Q" }))])).toContain(
      "x: joint A belongs to two blocks (solve dy and solve two)",
    );
  });

  it("checks the names a block reads and the block library", () => {
    expect(has(validate([withBlocks((b) => (b.kin.solve[0]!.in.a = "Z"))]), 'in.a "Z"')).toBe(true);
    expect(has(validate([withBlocks((b) => (b.kin.solve[0]!.block = "magic"))]), 'block "magic"')).toBe(true);
    expect(validate([withBlocks((b) => (b.kin.solve[0]!.block = "new:magic"))])).toEqual([]);
  });

  it("checks values against their ranges", () => {
    expect(validate([withBlocks((b) => (b.kin.params[0]!.value = 200))])).toContain("x: param b: value 200 outside [90, 150]");
    expect(validate([withBlocks((b) => (b.kin.design[0]!.value = "sideways"))])).toContain("x: design branch: value sideways is not one of its options");
    expect(validate([withBlocks((b) => (b.kin.drivers[0]!.default = 400))])).toContain("x: driver input: default 400 outside its range");
  });

  it("checks a cam's turns, blends and spans at the params' values", () => {
    const withCam = (cam: Record<string, unknown>) =>
      validate([
        withBlocks((b) => {
          b.kin.params.push({ id: "N", value: 2, unit: "turns", min: 1, max: 3 });
          b.kin.joints.push({ id: "K", type: "cam-contact", a: "rocker", b: "crank", at: [0, 0, 0], cam: { lift: 10, rb: 30, ...cam } } as unknown as Kin["joints"][number]);
        }),
      ]);
    const rise = (span: unknown, blend?: unknown) => ({ kind: "rise", span, law: "trapezoidal", ...(blend !== undefined ? { blend } : {}) });
    const ret = (span: unknown) => ({ kind: "return", span });
    expect(has(withCam({ schedule: [rise(180), ret(180)] }), "joint K: cam schedule")).toBe(false);
    expect(has(withCam({ turns: "N", schedule: [rise("180*N", 0.25), ret("180*N")] }), "joint K: cam schedule")).toBe(false);
    expect(has(withCam({ turns: 1.5, schedule: [rise(270), ret(270)] }), "joint K: cam schedule: turns 1.5 must be a whole number from 1")).toBe(true);
    expect(has(withCam({ schedule: [rise(180, 0.7), ret(180)] }), "joint K: cam schedule: blend 0.7 must lie in 0 to 0.5")).toBe(true);
    expect(has(withCam({ turns: "N", schedule: [rise(360), ret(360)] }), "joint K: cam schedule: spans sum to 720°, not 360° × 2 turns")).toBe(false);
    expect(has(withCam({ turns: "N+1", schedule: [rise(360), ret(360)] }), "joint K: cam schedule: spans sum to 720°, not 360° × 3 turns")).toBe(true);
  });

  it("checks mobility against dof (K11), excusing a stated overconstraint", () => {
    expect(has(validate([withBlocks(() => {}, { dof: 2 })]), "mobility counted from kin is 1 but dof is 2")).toBe(true);
    const notes = { links: 4, revolute: 4, prismatic: 0, higher_pairs: 0, notes: "overconstrained" };
    expect(validate([withBlocks(() => {}, { dof: 2, topology: notes })])).toEqual([]);
  });

  it("checks that everything the teaching block names exists", () => {
    expect(has(validate([withBlocks((b) => (b.teaching.traces[0]!.point = "Q"))]), 'trace c: point "Q"')).toBe(true);
    expect(has(validate([withBlocks((b) => (b.teaching.overlays[0]!["from"] = "Q"))]), 'overlay arc: from "Q"')).toBe(true);
    expect(has(validate([withBlocks((b) => (b.teaching.claims[0]!.output = "nope"))]), 'output "nope" is not in kin.outputs')).toBe(true);
    expect(has(validate([withBlocks((b) => (b.teaching.plot = { x: "input", y: "nope", label: "L" }))]), 'plot.y "nope"')).toBe(true);
    expect(has(validate([withBlocks((b) => (b.teaching.principle = [{ point: "Q" }]))]), 'point "Q"')).toBe(true);
  });

  it("maps every control to a driver, param or design choice, and every driver to a control", () => {
    expect(validate([withBlocks((b) => (b.teaching.controls = []))])).toContain("x: driver input has no control (T14)");
    expect(has(validate([withBlocks((b) => b.teaching.controls.push({ id: "p", kind: "param", param: "zz" }))]), 'param "zz"')).toBe(true);
  });

  it("checks views, ghosts and the time map", () => {
    expect(has(validate([withBlocks((b) => (b.teaching.view = "TOP"))]), 'teaching.view "TOP"')).toBe(true);
    expect(validate([withBlocks((b) => (b.teaching.view = "AUX O4"))])).toEqual([]);
    expect(validate([withBlocks((b) => (b.teaching.view = "VIEW 30 20"))])).toEqual([]);
    expect(has(validate([withBlocks((b) => (b.teaching.traces[0]!.ghosts = [{ control: "b", value: 500 }]))]), "outside the range of b")).toBe(true);
    expect(has(validate([withBlocks((b) => (b.teaching.timeMap = { feature: "f", slow: 0, span: [1, 2] }))]), "timeMap")).toBe(true);
    expect(has(validate([withBlocks((b) => (b.teaching.views = [{ id: "s", kind: "section", highlight: ["rocker.port"] }]))]), "a section needs plane")).toBe(true);
  });
});

describe("v3 patch files", () => {
  const batch = { name: "b1.json", json: [record("x")] };

  it("attach kin and teaching and replace existing text by dotted path", () => {
    const b = fourBar();
    const edit = { "explain.motion": "new", summary: "short" };
    const { records, problems } = mergeSources([batch, { name: "v3-a.json", json: { x: { kin: b.kin, teaching: b.teaching, edit } } }]);
    expect(problems).toEqual([]);
    expect(records[0]!.kin).toEqual(b.kin);
    expect(records[0]!.explain.motion).toBe("new");
    expect(records[0]!.summary).toBe("short");
  });

  it("reports an edit of a path that is not in the record, and an unknown id", () => {
    const { problems } = mergeSources([batch, { name: "v3-a.json", json: { x: { edit: { "explain.nothing": "a" } }, y: {} } }]);
    expect(problems).toEqual(["v3-a.json: x.edit path explain.nothing does not exist", "v3-a.json: unknown id y"]);
  });
});
