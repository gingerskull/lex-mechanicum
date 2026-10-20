// Setup of a package v2 in the browser (R9): every shape turned into triangles and drafting edges, once, however many
// solids use it. Pure and DOM-free, so the main thread, a worker and Node tests run the same code. The stages are timed
// apart for the bench (decode is timed by the caller).
import type { Shape2 } from "../package/format2";
import { edgesOfExtrude, edgesOfMesh, type EdgeSet } from "./edges";
import { capTime, tessellate } from "./tessellate";
import type { MeshData } from "./types";

/** The triangles of a shape: tessellated from its profile, or the mesh it ships. */
export const meshOfShape = (s: Shape2): MeshData => s.mesh ?? tessellate(s.profile!, s.op!, s.cap);

/** The drafting edges of a shape, straight from the profile where it is a plain extrusion, else from the mesh. */
export function edgesOfShape(s: Shape2, mesh: MeshData): EdgeSet {
  const marks = s.marks ?? [];
  if (s.profile && s.op?.op === "extrude" && !s.op.twist && (s.op.scaleTop ?? 1) === 1) return edgesOfExtrude(s.profile, s.op, marks);
  const op = s.op?.op === "extrude" ? s.op : null;
  return edgesOfMesh(mesh, marks, { z: op ? op.h : 0, scale: op?.scaleTop ?? 1, turn: ((op?.twist ?? 0) * Math.PI) / 180 });
}

export interface PreparedShapes {
  meshes: MeshData[];
  edges: EdgeSet[];
  /** Milliseconds spent turning shapes into triangles (`caps`: of that, triangulating caps) and finding their edges. */
  ms: { tessellate: number; edges: number; caps: number };
}

export function prepareShapes(shapes: readonly Shape2[]): PreparedShapes {
  capTime.ms = 0;
  const t0 = performance.now();
  const meshes = shapes.map(meshOfShape);
  const t1 = performance.now();
  const edges = shapes.map((s, i) => edgesOfShape(s, meshes[i]!));
  const t2 = performance.now();
  return { meshes, edges, ms: { tessellate: t1 - t0, edges: t2 - t1, caps: capTime.ms } };
}
