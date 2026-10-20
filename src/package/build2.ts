// Build-time packaging for package v2 (Node only): a v1 build lifted to v3 solids (src/solids/lift.ts, until the new
// builders make solids natively), every solid meshed by Manifold and checked (D11), and the shapes packed.
import { checkMesh, type SolidReport } from "../solids/check";
import { liftAll } from "../solids/lift";
import { manifold, meshOf } from "../solids/manifold";
import { quantise } from "../solids/quantise";
import type { Solid3 } from "../solids/types";
import { buildPackage, type Built } from "./build";
import type { Package2 } from "./format2";
import { pack2 } from "./pack2";

export interface Built2 {
  /** The 2.5D build the solids were lifted from. */
  built: Built;
  solids: Solid3[];
  pkg: Package2;
  /** The soundness report of every solid's Manifold mesh as shipped quantised (standard D11). */
  reports: { id: string; report: SolidReport }[];
  /** Solids Manifold would not mesh. */
  failed: { id: string; error: string }[];
}

/** Assembles a registered mechanism, lifts it, checks every solid and packs it as package v2. */
export async function buildPackage2(id: string, opts: { polish?: boolean; allMesh?: boolean } = {}): Promise<Built2> {
  const built = await buildPackage(id, opts);
  const solids = liftAll(built.assembly.solids);
  const M = await manifold();
  const reports: Built2["reports"] = [];
  const failed: Built2["failed"] = [];
  for (const s of solids) {
    try {
      reports.push({ id: s.id, report: checkMesh(quantise(meshOf(M, s))) });
    } catch (e) {
      failed.push({ id: s.id, error: String(e) });
    }
  }
  const pkg = pack2(
    { id, standard: built.pkg.standard, result: built.pkg.result, solids, joints: built.pkg.joints, levels: built.pkg.levels, b0: built.pkg.b0, b1: built.pkg.b1, bounds: built.pkg.bounds },
    built.sampled,
    (s) => meshOf(M, s),
    opts.allMesh ? { allMesh: true } : {},
  );
  return { built, solids, pkg, reports, failed };
}
