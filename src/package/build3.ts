// Build-time packaging (Node only, standard R4): the record built by the hardware builder, every solid meshed by
// Manifold and checked (D11), the traces sampled from the record's kin block, and the shapes packed as package v2.
import type { CatalogRecord } from "../catalog/schema";
import { buildAssembly, type Assembly, type Polish } from "../builder";
import { makePoseSource } from "../builder/poses";
import { xfMat } from "../builder/sweeps";
import type { Kin } from "../kin/types";
import { xf } from "../kin/math";
import { checkMesh, type SolidReport } from "../solids/check";
import { mat4 } from "../solids/frame";
import { cleanProfile, manifold, meshOf } from "../solids/manifold";
import { quantise } from "../solids/quantise";
import type { Solid3 } from "../solids/types";
import type { Joint, Package2 } from "./format2";
import { pack2, type Sampled } from "./pack2";
import { parseHeader, readAudit } from "../audit/sheet";

export interface Built3 {
  assembly: Assembly;
  pkg: Package2;
  reports: { id: string; report: SolidReport }[];
  failed: { id: string; error: string }[];
}

const PHASES = 72;

/** Assembles a record, checks every solid and packs it as package v2. */
export async function buildPackage3(rec: Pick<CatalogRecord, "id"> & { kin?: unknown; teaching?: unknown }, opts: { polish?: Polish; allMesh?: boolean } = {}): Promise<Built3> {
  const assembly = await buildAssembly(rec as never, opts.polish ? { polish: opts.polish } : {});
  const M = await manifold();
  const reports: Built3["reports"] = [];
  const failed: Built3["failed"] = [];
  for (const s of assembly.solids) {
    try {
      reports.push({ id: s.id, report: checkMesh(quantise(meshOf(M, s)), s.stretch ? { thin: false } : {}) });
    } catch (e) {
      failed.push({ id: s.id, error: String(e) });
    }
  }
  const src = makePoseSource(rec.kin as Kin);
  // the traces the teaching block names, as planar paths over one cycle
  const points = new Map<string, [number, number][]>();
  const want = [...new Set(((rec.teaching as { traces?: { point: string }[] } | undefined)?.traces ?? []).map((t) => t.point))];
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity, z0 = Infinity, z1 = -Infinity;
  const grow = (x: number, y: number, z: number) => {
    x0 = Math.min(x0, x); x1 = Math.max(x1, x);
    y0 = Math.min(y0, y); y1 = Math.max(y1, y);
    z0 = Math.min(z0, z); z1 = Math.max(z1, z);
  };
  const corners = (s: Solid3): [number, number, number][] => {
    const m = quantise(meshOf(M, s));
    const out: [number, number, number][] = [];
    for (let i = 0; i < m.pos.length; i += 36) out.push([m.pos[i]!, m.pos[i + 1]!, m.pos[i + 2]!]);
    return out;
  };
  const local = assembly.solids.map((s) => {
    try {
      return corners(s);
    } catch {
      return [];
    }
  });
  for (let i = 0; i < PHASES; i++) {
    const u = (i / PHASES) * Math.PI * 2;
    let pose: ReturnType<typeof src.K.pose>;
    try {
      pose = src.K.pose(u);
    } catch {
      continue;
    }
    const bodies = pose.bodies;
    for (const id of want) {
      const p = pose.points.get(id);
      if (p) (points.get(id) ?? points.set(id, []).get(id)!).push([p[0], p[1]]);
    }
    assembly.solids.forEach((s, k) => {
      const X = s.body === "ground" ? xf.id() : (bodies.get(s.body) ?? xf.id());
      const M4 = mulM(xfMat(X), mat4(s.frame));
      for (const q of local[k]!) grow(M4[0]! * q[0] + M4[4]! * q[1] + M4[8]! * q[2] + M4[12]!, M4[1]! * q[0] + M4[5]! * q[1] + M4[9]! * q[2] + M4[13]!, M4[2]! * q[0] + M4[6]! * q[1] + M4[10]! * q[2] + M4[14]!);
    });
  }
  const sampled: Sampled = { n: PHASES, traces: Object.fromEntries(points), vmax: {}, coreBounds: { minX: x0, minY: y0, maxX: x1, maxY: y1 }, plotData: null };
  const joints: Joint[] = assembly.notes.map((n) => ({
    id: n.id,
    type: (/^J\d+$/.test(n.kit) ? n.kit : "J3") as Joint["type"],
    at: [n.at[0], n.at[1]],
    title: n.title,
    note: n.note,
    ...(n.badge ? { badge: n.badge } : {}),
    ...(n.d !== undefined ? { d: n.d } : {}),
    serves: n.serves,
  }));
  const base = assembly.solids.find((s) => s.flags.isBase);
  const b0 = base ? base.frame.o[2] : z0;
  const b1 = base ? base.frame.o[2] + (base.op.op === "extrude" ? base.op.h : 0) : z0;
  const audit = readAudit(rec.id);
  const header = audit ? parseHeader(audit) : null;
  const pkg = pack2(
    {
      id: rec.id,
      standard: header?.standard || "none",
      result: header?.result || "none",
      solids: assembly.solids,
      joints,
      levels: [...new Set(assembly.solids.map((s) => s.ex))].sort((a, b) => a - b),
      b0,
      b1,
      bounds: { minX: x0, minY: y0, maxX: x1, maxY: y1, z0, z1 },
      lifts: assembly.lifts,
    },
    sampled,
    (s) => meshOf(M, s),
    { ...(opts.allMesh ? { allMesh: true } : {}), fixProfile: (p) => cleanProfile(M, p) },
  );
  return { assembly, pkg, reports, failed };
}

const mulM = (a: ReturnType<typeof mat4>, b: ReturnType<typeof mat4>): ReturnType<typeof mat4> => {
  const o = new Array<number>(16).fill(0);
  for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) for (let k = 0; k < 4; k++) o[c * 4 + r]! += a[k * 4 + r]! * b[c * 4 + k]!;
  return o as ReturnType<typeof mat4>;
};
