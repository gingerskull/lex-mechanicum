// Meshes ship on a 1/64 mm grid (standard D10). Quantising welds the vertices that land on the same grid point and drops
// the triangles that collapse, so what ships is what the soundness check sees. Pure integer keys: the same input gives
// the same bytes on every machine.
import type { MeshData } from "./types";

export const MESH_GRID = 64;

/** The mesh with positions snapped to the grid, coincident vertices welded and collapsed triangles removed. */
export function quantise(m: MeshData, grid = MESH_GRID): MeshData {
  const nv = m.pos.length / 3;
  const q = new Int32Array(nv * 3);
  for (let i = 0; i < nv * 3; i++) q[i] = Math.round(m.pos[i]! * grid);
  const index = new Map<string, number>();
  const map = new Uint32Array(nv);
  const kept: number[] = [];
  for (let v = 0; v < nv; v++) {
    const key = `${q[3 * v]},${q[3 * v + 1]},${q[3 * v + 2]}`;
    let j = index.get(key);
    if (j === undefined) {
      j = kept.length / 3;
      index.set(key, j);
      kept.push(q[3 * v]!, q[3 * v + 1]!, q[3 * v + 2]!);
    }
    map[v] = j;
  }
  const tri: number[] = [];
  const tag: number[] = [];
  for (let t = 0; t < m.tag.length; t++) {
    const a = map[m.tri[3 * t]!]!;
    const b = map[m.tri[3 * t + 1]!]!;
    const c = map[m.tri[3 * t + 2]!]!;
    if (a === b || b === c || a === c) continue;
    tri.push(a, b, c);
    tag.push(m.tag[t]!);
  }
  const pos = new Float32Array(kept.length);
  for (let i = 0; i < kept.length; i++) pos[i] = kept[i]! / grid;
  return { pos, tri: Uint32Array.from(tri), tag: Uint8Array.from(tag) };
}
