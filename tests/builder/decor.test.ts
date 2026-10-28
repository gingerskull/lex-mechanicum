// Decoration on a seasonal mechanism's scenery: fill patterns laid as marks inside a part's outline and its holes, the
// turned leg's section, and pieces that are turned, marked, patterned or ornaments (src/builder/decor.ts, shapes.ts).
import { describe, expect, it } from "vitest";
import { insideRuns, patternMarks, turnedLeg } from "../../src/builder/decor";
import { inside } from "../../src/core/poly";
import { FORM } from "../../src/style/form";
import { rungOf } from "../../src/style/detail";
import type { Profile } from "../../src/solids/types";
import { buildAssembly } from "../../src/builder/build";
import type { Kin } from "../../src/kin/types";

const square = (s: number): [number, number][] => [[0, 0], [s, 0], [s, s], [0, s]];
const hole = (cx: number, cy: number, r: number): [number, number][] => Array.from({ length: 24 }, (_, i) => [cx + r * Math.cos((-2 * Math.PI * i) / 24), cy + r * Math.sin((-2 * Math.PI * i) / 24)]);

describe("fill patterns", () => {
  const plate: Profile = { outer: square(60), holes: [hole(30, 30, 8)] };

  it("cuts a line to the stretches inside the outline and outside its holes", () => {
    const runs = insideRuns(plate, [0, 30], [1, 0]);
    expect(runs).toHaveLength(2);
    expect(runs[0]![0]).toBeCloseTo(0, 6);
    expect(runs[0]![1]).toBeCloseTo(22, 1);
    expect(runs[1]![1]).toBeCloseTo(60, 6);
  });

  it("quilts on two families of lines at the style's pitch, every mark inside the part", () => {
    const m = patternMarks(plate, "quilt");
    expect(m.length).toBeGreaterThan(10);
    const angles = new Set(m.map((k) => Math.round((Math.atan2(k.pts[1]![1] - k.pts[0]![1], k.pts[1]![0] - k.pts[0]![0]) * 180) / Math.PI + 360) % 180));
    expect([...angles].sort()).toEqual([180 - FORM.decor.quilt.angle, FORM.decor.quilt.angle].sort());
    for (const k of m) {
      expect(k.kind).toBe("quilt");
      // a quarter of the way in from each end (a line tangent to the hole touches it at its middle)
      for (const f of [0.25, 0.75]) {
        const q: [number, number] = [k.pts[0]![0] + (k.pts[1]![0] - k.pts[0]![0]) * f, k.pts[0]![1] + (k.pts[1]![1] - k.pts[0]![1]) * f];
        expect(inside(plate.outer, q)).toBe(true);
        expect(inside(plate.holes[0]!, q)).toBe(false);
      }
    }
  });

  it("hatches in one family, its spacing overridden where the piece asks", () => {
    const m = patternMarks({ outer: square(20), holes: [] }, "hatch", { angle: 0, pitch: 5 });
    expect(m.map((k) => k.pts[0]![1]).sort((a, b) => a - b)).toEqual([5, 10, 15]);
  });

  it("puts decoration on the first rung of the ladder, so it drops first", () => {
    expect(rungOf({ kind: "ornament" }).id).toBe("A");
    expect(rungOf({ mark: "carve" }).id).toBe("A");
    expect(rungOf({ mark: "quilt" }).id).toBe("A");
  });
});

describe("turned leg", () => {
  it("is a closed half section from the axis at its foot to the axis at its top, its largest radius r", () => {
    const p = turnedLeg(50, 7.2);
    expect(p[0]).toEqual([0, 0]);
    expect(p[p.length - 1]).toEqual([0, 50]);
    expect(Math.max(...p.map((q) => q[0]))).toBeCloseTo(7.2, 9);
    for (let i = 1; i < p.length; i++) expect(p[i]![1]).toBeGreaterThanOrEqual(p[i - 1]![1]);
  });
});

describe("decorated pieces and turned posts in the build", () => {
  // a fixed plate on two turned posts, carrying a marked, a patterned, an ornamental and a turned piece
  const kin: Kin = {
    bodies: [
      { id: "ground", role: "ground", shape: { type: "plate", rect: [100, 100] }, at: { frame: { origin: [0, 0, -8] } } },
      {
        id: "box",
        role: "frame",
        shape: {
          type: "plate",
          exact: true,
          outline: [[-30, -20], [30, -20], [30, 20], [-30, 20]],
          thickness: 4,
          posts: [{ at: [-20, 0], top: 40, r: 6, turned: true }, { at: [20, 0], top: 40, r: 6, turned: true }],
          pieces: [
            { id: "panel", outline: [[0, 0], [40, 0], [40, 20], [0, 20]], origin: [-20, -20, 44], x: [1, 0, 0], z: [0, -1, 0], thick: 1, marks: [{ kind: "carve", pts: [[5, 5], [35, 15]] }] },
            { id: "quilt", outline: [[-25, -15], [25, -15], [25, 15], [-25, 15]], origin: [0, 0, 44], z: [0, 0, 1], x: [1, 0, 0], thick: 2, pattern: "quilt" },
            { id: "rosette", outline: [[0, 0], [4, 0], [4, 4], [0, 4]], origin: [0, 0, 46], z: [0, 0, 1], x: [1, 0, 0], thick: 1, ornament: true },
            { id: "knob", op: "revolve", profile: [[0, 0], [3, 0], [3, 4], [0, 4]], origin: [25, 15, 44], z: [0, 0, 1], x: [1, 0, 0] },
          ],
        },
        frame: { origin: [0, 0, 40] },
      },
      { id: "crank", role: "driver", shape: { type: "link", length: 20, boss: [8, 6] }, at: { joint: "O" } },
    ],
    joints: [{ id: "O", type: "revolute", a: "ground", b: "crank", at: [60, 0, 0], axis: [0, 0, 1] }],
    params: [],
    design: [],
    drivers: [{ id: "input", joint: "O", kind: "rotary", range: [0, 360], default: 0 }],
    solve: [],
    points: [],
    outputs: [],
    fallback: null,
  } as unknown as Kin;

  it("builds them with their marks, kinds and operations, and stands the body on its posts, not standoffs", async () => {
    const a = await buildAssembly({ id: "fx-decor", kin } as never);
    const get = (id: string) => a.solids.find((s) => s.id === id)!;
    expect(get("box-panel").marks).toEqual([{ kind: "carve", pts: [[5, 5], [35, 15]] }]);
    expect(get("box-quilt").marks.length).toBeGreaterThan(4);
    expect(get("box-quilt").marks.every((m) => m.kind === "quilt")).toBe(true);
    expect(get("box-rosette").kind).toBe("ornament");
    expect(get("box-rosette").detail).toBe("A");
    expect(get("box-knob").op.op).toBe("revolve");
    // the panel's frame from its axes: x along +x, z toward -y, so its top face looks out along -y
    expect(get("box-panel").frame.z).toEqual([0, -1, 0]);
    const post = get("box-post0");
    expect(post.op.op).toBe("revolve");
    expect(post.name).toMatch(/^Turned leg/);
    expect(a.solids.some((s) => s.kind === "standoff" && s.id.startsWith("box-post") && s.op.op !== "revolve")).toBe(false);
  });
});
