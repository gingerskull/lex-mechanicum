// SOLID (standard D11): every solid is a closed manifold of non-zero volume, every triangle carries a tag, and no part
// is a zero-thickness sheet. Works on any mesh, so it checks Manifold's output and the browser's tessellation alike.
import { volume } from "./tessellate";
import { TAG, type MeshData } from "./types";

export interface SolidReport {
  ok: boolean;
  /** Plain-language faults, empty when ok. */
  issues: string[];
  volume: number;
  triangles: number;
  holeWalls: number;
}

/** Thinnest a solid may be, as volume per surface area times 3 (a sheet is zero), mm. */
const MIN_THICKNESS = 0.05;

/** `thin: false` skips the sheet test (a stretched member's unit-length profile is a sheet until it is stretched). */
export function checkMesh(m: MeshData, o: { thin?: boolean } = {}): SolidReport {
  const issues: string[] = [];
  const nt = m.tag.length;
  if (!nt) return { ok: false, issues: ["no triangles"], volume: 0, triangles: 0, holeWalls: 0 };
  const nv = m.pos.length / 3;
  // vertices at the same position are one (two rings that touch each share a point); edges are matched by position
  const canon = new Uint32Array(nv);
  const at = new Map<string, number>();
  for (let v = 0; v < nv; v++) {
    const k = `${m.pos[3 * v]},${m.pos[3 * v + 1]},${m.pos[3 * v + 2]}`;
    const j = at.get(k);
    if (j === undefined) at.set(k, v);
    canon[v] = j ?? v;
  }
  // every directed edge once, and its reverse once: closed, consistently wound, no T-junction shared by three faces
  const seen = new Map<number, number>();
  let bad = 0;
  let degenerate = 0;
  let area = 0;
  for (let t = 0; t < nt; t++) {
    const a0 = m.tri[3 * t]!;
    const b0 = m.tri[3 * t + 1]!;
    const c0 = m.tri[3 * t + 2]!;
    if (a0 >= nv || b0 >= nv || c0 >= nv) {
      issues.push(`triangle ${t} indexes a missing vertex`);
      break;
    }
    const a = canon[a0]!;
    const b = canon[b0]!;
    const c = canon[c0]!;
    if (a === b || b === c || a === c) degenerate++;
    for (const [u, v] of [[a, b], [b, c], [c, a]] as const) {
      const k = u * nv + v;
      seen.set(k, (seen.get(k) ?? 0) + 1);
    }
    const p = m.pos;
    const ux = p[3 * b]! - p[3 * a]!, uy = p[3 * b + 1]! - p[3 * a + 1]!, uz = p[3 * b + 2]! - p[3 * a + 2]!;
    const vx = p[3 * c]! - p[3 * a]!, vy = p[3 * c + 1]! - p[3 * a + 1]!, vz = p[3 * c + 2]! - p[3 * a + 2]!;
    area += 0.5 * Math.hypot(uy * vz - uz * vy, uz * vx - ux * vz, ux * vy - uy * vx);
  }
  for (const [k, n] of seen) {
    const u = Math.floor(k / nv);
    const v = k % nv;
    if (n !== 1 || seen.get(v * nv + u) !== 1) bad++;
  }
  if (degenerate) issues.push(`${degenerate} degenerate triangles`);
  if (bad) issues.push(`${bad} edges are open, doubled or wound the wrong way (not a closed manifold)`);
  const vol = volume(m);
  if (!(vol > 0)) issues.push(`volume ${vol.toFixed(3)} mm³ is not positive`);
  else if (o.thin !== false && (3 * vol) / area < MIN_THICKNESS) issues.push(`thickness ${((3 * vol) / area).toFixed(3)} mm: a sheet`);
  let holeWalls = 0;
  for (let t = 0; t < nt; t++) {
    const g = m.tag[t]!;
    if (g > TAG.hole) issues.push(`triangle ${t} has tag ${g}`);
    if (g === TAG.hole) holeWalls++;
  }
  return { ok: issues.length === 0, issues, volume: vol, triangles: nt, holeWalls };
}
