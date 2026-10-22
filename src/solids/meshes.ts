// The meshes of built solids, made once (Node only): the package, the SOLID check (D11) and the 3D checks all mesh the
// same solids. A mesh is kept per solid while the solid's geometry fields are the objects it was made from; a solid given
// a new profile, op, features or mesh is meshed again. A solid Manifold rejects throws every time it is asked.
import { checkMesh, type SolidReport } from "./check";
import { manifold, meshOf } from "./manifold";
import { quantise } from "./quantise";
import type { MeshData, Solid3 } from "./types";

type Wasm = Awaited<ReturnType<typeof manifold>>;
type Geometry = Pick<Solid3, "id" | "profile" | "op" | "features" | "mesh">;

interface Entry {
  from: [unknown, unknown, unknown, unknown];
  mesh?: MeshData;
  quantised?: MeshData;
  report?: SolidReport;
}

const made = new WeakMap<Geometry, Entry>();

function entry(s: Geometry): Entry {
  const hit = made.get(s);
  if (hit && hit.from[0] === s.profile && hit.from[1] === s.op && hit.from[2] === s.features && hit.from[3] === s.mesh) return hit;
  const e: Entry = { from: [s.profile, s.op, s.features, s.mesh] };
  made.set(s, e);
  return e;
}

/** `meshOf`, once per solid. */
export function meshOnce(M: Wasm, s: Geometry): MeshData {
  const e = entry(s);
  return (e.mesh ??= meshOf(M, s));
}

/** The mesh on the shipping grid (`quantise`), once per solid. */
export function quantisedOnce(M: Wasm, s: Geometry): MeshData {
  const e = entry(s);
  return (e.quantised ??= quantise(meshOnce(M, s)));
}

/** SOLID (D11) of a solid's shipping mesh, once per solid; a stretched member is not tested for a sheet. */
export function solidReport(M: Wasm, s: Geometry & Pick<Solid3, "stretch">): SolidReport {
  const e = entry(s);
  return (e.report ??= checkMesh(quantisedOnce(M, s), s.stretch ? { thin: false } : {}));
}
