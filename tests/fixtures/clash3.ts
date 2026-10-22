// Fixtures of the 3D clearance check (A15): small synthetic solids with a placer, and the spike's injected-clash coupler.
import type { Placer } from "../../src/checks/clash3";
import { recordSource, type CheckSource } from "../../src/checks/source";
import { loadV3 } from "../../src/mechanisms";
import { atPose, mat4, type Mat4 } from "../../src/solids/frame";
import { extrudeOp } from "../../src/solids/tessellate";
import type { Solid3 } from "../../src/solids/types";

/** A rectangular plate x0..x1, y0..y1 from z0 to z1 riding `body`. */
export function plate(id: string, body: string, [x0, y0, x1, y1]: [number, number, number, number], z0: number, z1: number, extra: Partial<Solid3> = {}): Solid3 {
  return {
    id,
    name: id,
    role: "link",
    kind: "part",
    body,
    frame: atPose(0, 0, z0),
    profile: { outer: [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], holes: [] },
    op: extrudeOp(z1 - z0),
    marks: [],
    ex: 0,
    joints: [],
    detail: "A",
    flags: {},
    ...extra,
  };
}

/** A round pin of radius r from z0 to z1 on the axis through (x, y): the profile is centred on the frame, as the builder makes round parts. */
export function pin(id: string, body: string, x: number, y: number, r: number, z0: number, z1: number, extra: Partial<Solid3> = {}): Solid3 {
  const n = 48;
  const ring = Array.from({ length: n }, (_, i): [number, number] => [r * Math.cos((2 * Math.PI * i) / n), r * Math.sin((2 * Math.PI * i) / n)]);
  const s = plate(id, body, [0, 0, 1, 1], z0, z1, extra);
  return { ...s, frame: atPose(x, y, z0), profile: { outer: ring, holes: [] } };
}

/** Bodies named in `moving` slide along -x by `travel` mm and back over the cycle; every other body stays. */
export function slidingPlacer(moving: string[], travel = 10): Placer {
  return {
    place(s, u): Mat4 {
      const dx = moving.includes(s.body) ? -(travel / 2) * (1 - Math.cos(u)) : 0;
      const m = mat4(s.frame);
      return [m[0]!, m[1]!, m[2]!, 0, m[4]!, m[5]!, m[6]!, 0, m[8]!, m[9]!, m[10]!, 0, m[12]! + dx, m[13]!, m[14]!, 1];
    },
    key: (s) => (moving.includes(s.body) ? s.body : "ground"),
  };
}

/** The four-bar of the library as built, with its polish. */
export async function fourBar(): Promise<CheckSource> {
  const { record, polish } = await loadV3("four-bar");
  return recordSource(record as never, polish ? { polish } : {});
}

/** The four-bar of the library with one solid moved along z: the spike's injected clash (#197). */
export async function injectedCoupler(solid = "coupler", dz = -12): Promise<CheckSource> {
  const src = await fourBar();
  const s = src.solids.find((x) => x.id === solid)!;
  s.frame = { ...s.frame, o: [s.frame.o[0], s.frame.o[1], s.frame.o[2] + dz] };
  return src;
}

/** Bodies named in `spinning` turn about the z axis through the origin; every other body stays. */
export function spinningPlacer(spinning: string[]): Placer {
  return {
    place(s, u): Mat4 {
      const m = mat4(s.frame);
      if (!spinning.includes(s.body)) return m;
      const c = Math.cos(u), n = Math.sin(u);
      return [c * m[0]! - n * m[1]!, n * m[0]! + c * m[1]!, m[2]!, 0, c * m[4]! - n * m[5]!, n * m[4]! + c * m[5]!, m[6]!, 0, m[8]!, m[9]!, m[10]!, 0, c * m[12]! - n * m[13]!, n * m[12]! + c * m[13]!, m[14]!, 1];
    },
    key: (s) => (spinning.includes(s.body) ? s.body : "ground"),
  };
}
