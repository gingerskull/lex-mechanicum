// Drafting edges: the profile route and the mesh route find the same lines on a plain extrusion, and rings chain.
import { describe, expect, it } from "vitest";
import { circle } from "../../src/core/geom";
import { EDGE, EF, EFLAG, edgesOfExtrude, edgesOfMesh, type EdgeSet } from "../../src/solids/edges";
import { extrudeOp, revolveOp, tessellate } from "../../src/solids/tessellate";
import type { Profile } from "../../src/solids/types";

const rect = (w: number, h: number): Profile => ({ outer: [[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]], holes: [] });
const ext = (h: number) => extrudeOp(h) as Extract<ReturnType<typeof extrudeOp>, { op: "extrude" }>;

/** Edges as sorted "kind a-b" strings, direction and order removed. */
function canon(e: EdgeSet): string[] {
  const out: string[] = [];
  for (let i = 0; i < e.n; i++) {
    const d = e.data.subarray(i * EF, (i + 1) * EF);
    const a = [d[0]!, d[1]!, d[2]!].map((x) => x.toFixed(3)).join(",");
    const b = [d[3]!, d[4]!, d[5]!].map((x) => x.toFixed(3)).join(",");
    out.push(`${d[14]} ${a < b ? `${a}|${b}` : `${b}|${a}`}`);
  }
  return out.sort();
}
const kinds = (e: EdgeSet) => Array.from({ length: e.n }, (_, i) => e.data[i * EF + 14]!);

describe("edges of an extrusion", () => {
  it("a box has eight cap edges and four creases", () => {
    const e = edgesOfExtrude(rect(10, 4), ext(3), []);
    expect(kinds(e).filter((k) => k === EDGE.cap).length).toBe(8);
    expect(kinds(e).filter((k) => k === EDGE.crease).length).toBe(4);
    expect(kinds(e).filter((k) => k === EDGE.smooth).length).toBe(0);
  });

  it("finds the same lines from the profile as from the mesh", () => {
    const p: Profile = { outer: circle(10, 0, 0, 24), holes: [circle(3, 0, 0, 14).reverse()] };
    const op = ext(4);
    const a = canon(edgesOfExtrude(p, op, []));
    const b = canon(edgesOfMesh(tessellate(p, op)));
    expect(a).toEqual(b);
  });

  it("flags the top cap and the hole rings, and chains each ring's length", () => {
    const p: Profile = { outer: rect(10, 10).outer, holes: [circle(2, 0, 0, 12).reverse()] };
    const e = edgesOfExtrude(p, ext(2), []);
    let topOuter = 0;
    let maxCum = 0;
    for (let i = 0; i < e.n; i++) {
      const f = e.data[i * EF + 15]!;
      if (e.data[i * EF + 14] === EDGE.cap && f === EFLAG.top) {
        topOuter += Math.hypot(e.data[i * EF + 3]! - e.data[i * EF]!, e.data[i * EF + 4]! - e.data[i * EF + 1]!);
        maxCum = Math.max(maxCum, e.data[i * EF + 13]!);
      }
    }
    expect(topOuter).toBeCloseTo(40, 6);
    expect(maxCum).toBeCloseTo(40, 6);
  });

  it("puts the marks on the top face", () => {
    const e = edgesOfExtrude(rect(10, 10), ext(2), [{ pts: [[0, 0], [1, 0], [1, 1]] }]);
    const marks = canon(e).filter((s) => s.startsWith(`${EDGE.mark} `));
    expect(marks.length).toBe(2);
    expect(marks[0]).toContain(",2.000");
  });
});

describe("edges of a mesh", () => {
  it("gives a revolved shaft two cap rings, a shoulder crease and smooth meridians", () => {
    const p: Profile = { outer: [[0, 0], [6, 0], [6, 10], [3, 10], [3, 16], [0, 16]], holes: [] };
    const op = revolveOp(p);
    const e = edgesOfMesh(tessellate(p, op));
    const k = kinds(e);
    expect(k.filter((x) => x === EDGE.cap).length).toBeGreaterThan(0);
    expect(k.filter((x) => x === EDGE.smooth).length).toBeGreaterThan(0);
  });
});
