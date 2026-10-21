// A package v2 for any mechanism while both engines live on the branch (standard S6, R4): a 2.5D mechanism is built by its
// model and lifted (build2.ts); one rebuilt on engine v3 is built from its record by the hardware builder (build3.ts).
// The tools that draw, bench and package go through here, so they work on either side by side. Node only.
import { engineOf, loadV3 } from "../checks/engine";
import type { Solid3 } from "../solids/types";
import { buildPackage2 } from "./build2";
import { buildPackage3 } from "./build3";
import type { Package } from "./format";
import type { Package2 } from "./format2";
import type { SolidReport } from "../solids/check";

export interface AnyPackage {
  engine: "2.5D" | "v3";
  pkg: Package2;
  /** The v1 package of the same build, only for a 2.5D mechanism. */
  v1: Package | null;
  solids: Solid3[];
  reports: { id: string; report: SolidReport }[];
  failed: { id: string; error: string }[];
}

export async function buildAnyPackage(id: string, opts: { allMesh?: boolean } = {}): Promise<AnyPackage> {
  if (engineOf(id) === "v3") {
    const { record, polish } = await loadV3(id);
    const b = await buildPackage3(record as never, { ...(polish ? { polish } : {}), ...(opts.allMesh ? { allMesh: true } : {}) });
    return { engine: "v3", pkg: b.pkg, v1: null, solids: b.assembly.solids, reports: b.reports, failed: b.failed };
  }
  const b = await buildPackage2(id, opts.allMesh ? { allMesh: true } : {});
  return { engine: "2.5D", pkg: b.pkg, v1: b.built.pkg, solids: b.solids, reports: b.reports, failed: b.failed };
}
