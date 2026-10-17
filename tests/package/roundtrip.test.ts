// The package format (standard R4): decode(encode(pack(a))) equals pack(a), the four-bar stays small, and solids keep
// what the renderer reads.
import { beforeAll, describe, expect, it } from "vitest";
import { buildPackage, type Built } from "../../src/package/build";
import { decode, encode, FLAG, gridFor, hasFlag, ringsOf, type Package } from "../../src/package/format";

let built: Built;
let blob: Uint8Array;
let back: Package;

beforeAll(async () => {
  built = await buildPackage("four-bar");
  blob = await encode(built.pkg);
  back = await decode(blob);
}, 60_000);

describe("package round trip", () => {
  it("decodes to the packed package, field by field", () => {
    const p = built.pkg;
    const { solids, traces, plot, ...rest } = p;
    const { solids: s2, traces: t2, plot: p2, ...rest2 } = back;
    expect(rest2).toEqual(rest);
    expect(Object.keys(t2)).toEqual(Object.keys(traces));
    for (const k of Object.keys(traces)) expect(Array.from(t2[k]!)).toEqual(Array.from(traces[k]!));
    expect(Array.from(p2 ?? [])).toEqual(Array.from(plot ?? []));
    expect(s2.length).toBe(solids.length);
    solids.forEach((s, i) => {
      const { pts, ...meta } = s;
      const { pts: pts2, ...meta2 } = s2[i]!;
      expect(meta2).toEqual(meta);
      expect(Array.from(pts2)).toEqual(Array.from(pts));
    });
  });

  it("keeps the four-bar under 60 KB", () => {
    expect(blob.length).toBeLessThan(60 * 1024);
  });

  it("keeps every solid's detail rung, explode level and typed marks", () => {
    const a = built.assembly;
    expect(back.solids.map((s) => [s.id, s.detail, s.ex])).toEqual(a.solids.map((s) => [s.id, s.detail, s.ex]));
    a.solids.forEach((s, i) => {
      const r = ringsOf(back.solids[i]!);
      expect(r.outer.length).toBe(2 * s.outer.length);
      expect(r.holes.map((h) => h.length)).toEqual(s.holes.map((h) => 2 * h.length));
      expect(r.marks.map((m) => [m.kind, m.pts.length])).toEqual(s.marks.map((m) => [m.kind, 2 * m.pts.length]));
    });
    // the drive's belt-driven parts keep their motion; the input cap keeps its accent
    expect(back.solids.some((s) => s.motion)).toBe(true);
    expect(back.solids.filter((s) => hasFlag(s, "accent")).length).toBeGreaterThan(0);
    expect(back.solids.find((s) => s.flags & FLAG.isBase)?.kind).toBe("base");
  });

  it("snaps coordinates to the grid within half a step", () => {
    const g = back.grid;
    const a = built.assembly.solids[0]!;
    const r = ringsOf(back.solids[0]!);
    a.outer.forEach(([x, y], i) => {
      expect(Math.abs(r.outer[2 * i]! - x)).toBeLessThanOrEqual(0.5 / g + 1e-9);
      expect(Math.abs(r.outer[2 * i + 1]! - y)).toBeLessThanOrEqual(0.5 / g + 1e-9);
    });
    expect(gridFor(100)).toBe(256);
    expect(gridFor(200)).toBe(128);
    expect(() => gridFor(40_000)).toThrow();
  });

  it("rejects a blob that is not a package", async () => {
    await expect(decode(new Uint8Array([1, 2, 3, 4]))).rejects.toThrow(/not an .mxp/);
  });
});
