// Build-time packaging (Node only): assemble a registered mechanism with its polish, sample it, measure the swept
// envelope of every solid and pack it. The renderer and the site read the result; nothing here ships.
import { TAU, xf } from "../core/geom";
import { assemble, type Assembly } from "../assemble";
import { indexParts, solidPose } from "../assemble/pose";
import { parseHeader, readAudit } from "../audit/sheet";
import { mechanisms } from "../mechanisms";
import { sample, type Sampled } from "../model/sample";
import type { MechanismModel } from "../model/types";
import { pack, type Package } from "./format";

/** Swept 2D envelope of every solid over the cycle, from world outlines at n phases. */
export function envelope(model: MechanismModel, a: Assembly, n = 72): { minX: number; minY: number; maxX: number; maxY: number } {
  const parts = indexParts(model);
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (let i = 0; i < n; i++) {
    const u = (i / n) * TAU;
    const s = model.solve(u);
    for (const t of a.solids) {
      const q = solidPose(model, parts, t, s, u);
      if (!q) continue;
      for (const [x, y] of xf(t.outer, q)) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  return { minX, minY, maxX, maxY };
}

export interface Built {
  model: MechanismModel;
  assembly: Assembly;
  sampled: Sampled;
  pkg: Package;
}

/** Assembles and packs a registered mechanism. The package's standard and result are its audit's, or "none". */
export async function buildPackage(id: string, opts: { polish?: boolean } = {}): Promise<Built> {
  const load = mechanisms[id];
  if (!load) throw new Error(`unknown mechanism "${id}"; registered: ${Object.keys(mechanisms).join(", ")}`);
  const { model, polish } = await load();
  const sampled = sample(model);
  const assembly = assemble(model, sampled, polish && opts.polish !== false ? { polish } : {});
  const audit = readAudit(id);
  const header = audit ? parseHeader(audit) : null;
  const pkg = pack({ id, standard: header?.standard || "none", result: header?.result || "none", ...assembly, envelope: envelope(model, assembly) }, sampled);
  return { model, assembly, sampled, pkg };
}
