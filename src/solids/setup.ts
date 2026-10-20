// Setup of a package v2 (R9): decode, tessellate, edges, in one go on this thread or in a worker. The worker takes the
// blob, does all three, and sends back typed arrays only (transferred, not copied) with the package's solids and the
// rest; the profile rings it decoded stay in the worker.
import { decode2, type Package2 } from "../package/format2";
import type { EdgeSet } from "./edges";
import { prepareShapes } from "./prepare";
import type { MeshData } from "./types";

export interface Setup {
  /** The package; in a worker's result `shapes` is empty (the geometry is in `meshes` and `edges`). */
  pkg: Package2;
  /** Per shape. */
  meshes: MeshData[];
  edges: EdgeSet[];
  /** Milliseconds per stage, measured where the stage ran. */
  ms: { decode: number; tessellate: number; edges: number };
}

/** Decodes a blob and prepares every shape on this thread. */
export async function setupInline(blob: Uint8Array): Promise<Setup> {
  const t0 = performance.now();
  const pkg = await decode2(blob);
  const t1 = performance.now();
  const p = prepareShapes(pkg.shapes);
  return { pkg, meshes: p.meshes, edges: p.edges, ms: { decode: t1 - t0, tessellate: p.ms.tessellate, edges: p.ms.edges } };
}

/** Everything the worker sends back, and the buffers to transfer. */
export async function setupForWorker(blob: Uint8Array): Promise<{ result: Setup; transfer: ArrayBuffer[] }> {
  const s = await setupInline(blob);
  const transfer = new Set<ArrayBuffer>();
  for (const m of s.meshes) for (const a of [m.pos, m.tri, m.tag]) transfer.add(a.buffer as ArrayBuffer);
  for (const e of s.edges) transfer.add(e.data.buffer as ArrayBuffer);
  for (const t of Object.values(s.pkg.traces)) transfer.add(t.buffer as ArrayBuffer);
  return { result: { ...s, pkg: { ...s.pkg, shapes: [] } }, transfer: [...transfer] };
}

/** Runs the setup in `worker` (a module worker running src/solids/edges-worker.ts); resolves when the arrays are back. */
export function setupInWorker(worker: Worker, blob: Uint8Array): Promise<Setup & { wall: number }> {
  const t0 = performance.now();
  return new Promise((resolve, reject) => {
    worker.onmessage = (e: MessageEvent<Setup>) => resolve({ ...e.data, wall: performance.now() - t0 });
    worker.onerror = (e) => reject(new Error(e.message));
    const copy = blob.slice();
    worker.postMessage(copy.buffer, [copy.buffer]);
  });
}
