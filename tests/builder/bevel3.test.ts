import { describe, expect, it } from "vitest";
import { bevelTeeth3 } from "../../src/builder/bevel3";
import { bevel } from "../../src/core/spatial";
import { D2R } from "../../src/core/geom";
import type { MeshData } from "../../src/solids/types";

/** Every directed edge met once by its reverse: a closed mesh, consistently wound. */
function closed(m: MeshData): boolean {
  const seen = new Map<string, number>();
  for (let t = 0; t < m.tri.length; t += 3)
    for (let k = 0; k < 3; k++) {
      const a = m.tri[t + k]!;
      const b = m.tri[t + ((k + 1) % 3)]!;
      seen.set(`${a}>${b}`, (seen.get(`${a}>${b}`) ?? 0) + 1);
    }
  for (const [e, n] of seen) {
    const [a, b] = e.split(">");
    if (n !== 1 || seen.get(`${b}>${a}`) !== 1) return false;
  }
  return true;
}

function volume(m: MeshData): number {
  const p = m.pos;
  let v = 0;
  for (let t = 0; t < m.tri.length; t += 3) {
    const a = m.tri[t]! * 3, b = m.tri[t + 1]! * 3, c = m.tri[t + 2]! * 3;
    v += p[a]! * (p[b + 1]! * p[c + 2]! - p[b + 2]! * p[c + 1]!) - p[a + 1]! * (p[b]! * p[c + 2]! - p[b + 2]! * p[c]!) + p[a + 2]! * (p[b]! * p[c + 1]! - p[b + 1]! * p[c]!);
  }
  return v / 6;
}

/** The z range of the vertices within radius `rMax` of the axis (all of them by default). */
const zRange = (m: MeshData, rMax = Infinity): [number, number] => {
  let lo = Infinity, hi = -Infinity;
  for (let k = 2; k < m.pos.length; k += 3) {
    if (Math.hypot(m.pos[k - 2]!, m.pos[k - 1]!) > rMax) continue;
    lo = Math.min(lo, m.pos[k]!);
    hi = Math.max(hi, m.pos[k]!);
  }
  return [lo, hi];
};

describe("bevel teeth in three dimensions", () => {
  it("makes a closed, outward-wound solid for straight, bored and spiral gears", () => {
    for (const g of [
      { z: 16, m: 4, cone: 58, bore: 16 },
      { z: 41, m: 4.878, cone: 76.3, bore: 120, facing: -1 as const, back: 5 },
      { z: 10, m: 6.57, cone: 13.7, turn: -0.6 },
    ]) {
      const m = bevelTeeth3(g);
      expect(closed(m), JSON.stringify(g)).toBe(true);
      expect(volume(m)).toBeGreaterThan(0);
      expect(m.tag.length).toBe(m.tri.length / 3);
    }
  });

  it("stands a crown gear's teeth along its axis: a full tooth depth across the face, not a flat disc", () => {
    const m = 4.878;
    const g = bevelTeeth3({ z: 41, m, cone: 76.3, bore: 40 });
    const [lo, hi] = zRange(g);
    // tips at the outer end m sin δ over the pitch plane, roots 1.25 m sin δ under it: the tooth depth along the axis
    expect(hi).toBeGreaterThan(0.9 * m);
    expect(hi - lo).toBeGreaterThan(2.2 * m);
  });

  it("keeps a straight gear's faces at the old frustum's planes: the back face at the outer pitch circle, tips cut at the inner one", () => {
    const bv = bevel(10, 4, 32 * D2R, 14);
    const g = bevelTeeth3({ z: 10, m: 4, cone: 32, face: 14, bore: 14 });
    // round the bore the back is flat at the pitch plane (the stack behind is laid out to it); only the rim reaches back
    expect(zRange(g, 9)[0]).toBeCloseTo(0, 5);
    expect(zRange(g)[1]).toBeLessThanOrEqual(bv.axial + 1e-6);
  });

  it("turns the apex toward -z on facing -1, its outer pitch circle at the back given", () => {
    const bv = bevel(10, 4, 32 * D2R, 14);
    const g = bevelTeeth3({ z: 10, m: 4, cone: 32, face: 14, bore: 14, facing: -1, back: bv.axial });
    expect(zRange(g, 9)[1]).toBeCloseTo(bv.axial, 5);
    expect(zRange(g)[0]).toBeGreaterThanOrEqual(-1e-6);
  });
});
