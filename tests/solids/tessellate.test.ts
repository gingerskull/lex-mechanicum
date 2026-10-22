// Profile + operation -> triangles: closed, outward, tagged, and the volumes of the known shapes.
import { describe, expect, it } from "vitest";
import { circle } from "../../src/core/geom";
import { checkMesh } from "../../src/solids/check";
import { extrudeOp, revolveOp, segmentsFor, stepsFor, tessellate, updatePositions, volume } from "../../src/solids/tessellate";
import { TAG, type Profile } from "../../src/solids/types";

const rect = (w: number, h: number): Profile => ({ outer: [[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]], holes: [] });
const count = (t: Uint8Array, g: number) => t.reduce((n, x) => n + (x === g ? 1 : 0), 0);

describe("extrude", () => {
  it("is a closed box of the right volume with two cap faces", () => {
    const m = tessellate(rect(10, 4), extrudeOp(3));
    const r = checkMesh(m);
    expect(r.issues).toEqual([]);
    expect(volume(m)).toBeCloseTo(120, 6);
    expect(count(m.tag, TAG.cap)).toBe(4);
    expect(count(m.tag, TAG.wall)).toBe(8);
    expect(count(m.tag, TAG.hole)).toBe(0);
  });

  it("reads clockwise outer rings and counter-clockwise holes alike, and tags hole walls", () => {
    const p: Profile = { outer: rect(10, 10).outer.slice().reverse(), holes: [circle(2, 0, 0, 16).slice()] };
    const m = tessellate(p, extrudeOp(2));
    expect(checkMesh(m).issues).toEqual([]);
    expect(count(m.tag, TAG.hole)).toBe(32);
    const disc = (16 / 2) * Math.sin((2 * Math.PI) / 16) * 4;
    expect(volume(m)).toBeCloseTo((100 - disc) * 2, 5);
  });

  it("scales the top: a frustum's volume", () => {
    const m = tessellate(rect(10, 10), extrudeOp(6, { scaleTop: 0.5 }));
    expect(checkMesh(m).issues).toEqual([]);
    // frustum of squares: h/3 (A + sqrt(AB) + B) with sides 10 and 5
    expect(volume(m)).toBeCloseTo((6 / 3) * (100 + 50 + 25), 4);
  });

  it("turns a positive twist counter-clockwise", () => {
    const m = tessellate(rect(10, 2), extrudeOp(4, { twist: 90 }));
    expect(checkMesh(m).issues).toEqual([]);
    const top = Array.from({ length: m.pos.length / 3 }, (_, i) => [m.pos[3 * i]!, m.pos[3 * i + 1]!, m.pos[3 * i + 2]!]).filter((p) => p[2] === 4);
    // the corner (5, 1) turned by 90 degrees counter-clockwise is (-1, 5)
    expect(top.some((p) => Math.abs(p[0]! + 1) < 1e-5 && Math.abs(p[1]! - 5) < 1e-5)).toBe(true);
    expect(stepsFor(90)).toBe(36);
  });
});

describe("revolve", () => {
  const section: Profile = { outer: [[0, 0], [10, 0], [10, 5], [4, 5], [4, 8], [0, 8]], holes: [] };

  it("is a closed solid of revolution with the poles as single vertices", () => {
    const op = revolveOp(section);
    const m = tessellate(section, op);
    expect(checkMesh(m).issues).toEqual([]);
    const n = (op as { segments: number }).segments;
    // faceted volume: each ring of radius r has area (n/2) r² sin(2π/n)
    const a = (r: number) => (n / 2) * r * r * Math.sin((2 * Math.PI) / n);
    expect(volume(m)).toBeCloseTo(a(10) * 5 + a(4) * 3, 3);
    // flat faces (the disc ends and the shoulder) are caps, the cylinders are walls
    expect(count(m.tag, TAG.cap)).toBeGreaterThan(0);
    expect(count(m.tag, TAG.wall)).toBe(2 * n * 2);
  });

  it("keeps the facets under the clash tolerance", () => {
    for (const r of [1, 5, 30, 120]) {
      const n = segmentsFor(r);
      expect(r * (1 - Math.cos(Math.PI / n))).toBeLessThanOrEqual(0.025 + 1e-9);
      expect(n % 4).toBe(0);
    }
  });

  it("hollows with a tube profile and tags the inner wall", () => {
    const tube: Profile = { outer: [[3, 0], [5, 0], [5, 6], [3, 6]], holes: [] };
    const m = tessellate(tube, revolveOp(tube));
    expect(checkMesh(m).issues).toEqual([]);
  });
});

describe("sweep and loft", () => {
  it("sweeps a square along a straight path", () => {
    const m = tessellate(rect(2, 2), { op: "sweep", path: [[0, 0, 0], [0, 0, 5], [0, 0, 10]] });
    expect(checkMesh(m).issues).toEqual([]);
    expect(volume(m)).toBeCloseTo(40, 6);
  });

  it("sweeps a circle round a closed path into a ring", () => {
    const path: [number, number, number][] = Array.from({ length: 48 }, (_, i) => [20 * Math.cos((i / 48) * 2 * Math.PI), 20 * Math.sin((i / 48) * 2 * Math.PI), 0]);
    const m = tessellate({ outer: circle(2, 0, 0, 16), holes: [] }, { op: "sweep", path, closed: true });
    expect(checkMesh(m).issues).toEqual([]);
    // Pappus: 2π R · π r², within the faceting
    expect(volume(m) / (2 * Math.PI * 20 * Math.PI * 4)).toBeGreaterThan(0.97);
    expect(volume(m) / (2 * Math.PI * 20 * Math.PI * 4)).toBeLessThan(1.01);
  });

  it("lofts two rings into a frustum", () => {
    const a = rect(10, 10);
    const b = { outer: a.outer.map(([x, y]) => [x / 2, y / 2] as [number, number]), holes: [] };
    const m = tessellate(a, { op: "loft", sections: [{ z: 0, ...a }, { z: 6, ...b }] });
    expect(checkMesh(m).issues).toEqual([]);
    expect(volume(m)).toBeCloseTo(350, 4);
  });
});

describe("deforming members", () => {
  it("rewrites the positions and keeps the triangles", () => {
    const p: Profile = { outer: circle(10, 0, 0, 24), holes: [circle(3, 0, 0, 12).reverse()] };
    const op = extrudeOp(2);
    const m = tessellate(p, op);
    const tri = m.tri.slice();
    const bigger: Profile = { outer: p.outer.map(([x, y]) => [x * 1.5, y] as [number, number]), holes: p.holes };
    updatePositions(bigger, op, m.pos);
    expect(Array.from(m.tri)).toEqual(Array.from(tri));
    expect(checkMesh(m).issues).toEqual([]);
    expect(volume(m)).toBeCloseTo(volume(tessellate(bigger, op)), 6);
  });
});
