// The package of a registered mechanism (Node only, standard R4): its record and polish (src/mechanisms) built and packed
// by build3.ts. The tools that draw, bench and package go through here.
import { loadV3 } from "../mechanisms";
import type { SolidReport } from "../solids/check";
import type { Solid3 } from "../solids/types";
import { buildPackage3 } from "./build3";
import type { Package2 } from "./format2";

export interface Built {
  pkg: Package2;
  solids: Solid3[];
  reports: { id: string; report: SolidReport }[];
  failed: { id: string; error: string }[];
}

export async function buildPackage(id: string, opts: { allMesh?: boolean } = {}): Promise<Built> {
  const { record, polish } = await loadV3(id);
  const b = await buildPackage3(record as never, { ...(polish ? { polish } : {}), ...(opts.allMesh ? { allMesh: true } : {}) });
  return { pkg: b.pkg, solids: b.assembly.solids, reports: b.reports, failed: b.failed };
}
