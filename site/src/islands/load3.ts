// Loading a mechanism for the stage and the cards: the package v2 set up in a worker (decode, tessellate, edges and the
// bake into the GPU's arrays, R9), the record's blocks, and the poser. Browser only.
import { url } from "../url";
type Engine = typeof import("./engine3");

/** What the page ships beside the package: the record's name, teaching and kin blocks (tools: site-assets). */
export interface Meta {
  name: string;
  teaching: import("../../../src/catalog/kin").Teaching | null;
  kin: import("../../../src/catalog/kin").Kin | null;
}

export interface Loaded {
  scene: import("../../../src/render/v3/scene").Scene;
  meta: Meta;
  kinematics: import("../../../src/kin/compose").Kinematics | null;
  /** Milliseconds: the worker's wall time, or the inline setup. */
  setupMs: number;
}

const bytes = async (u: string) => {
  const res = await fetch(u);
  if (!res.ok) throw new Error(`${u}: HTTP ${res.status}`);
  return new Uint8Array(await res.arrayBuffer());
};

/** Where the fetches start: call at once, before the engine chunk has arrived, so both download together. */
export function fetchAll(id: string): { blob: Promise<Uint8Array>; meta: Promise<Meta> } {
  const blob = bytes(url(`/packages/${id}.mx2`));
  const meta = fetch(url(`/meta/${id}.json`)).then((r) => {
    if (!r.ok) throw new Error(`meta ${id}: HTTP ${r.status}`);
    return r.json() as Promise<Meta>;
  });
  return { blob, meta };
}

/** The setup, off the main thread where there is a Worker (and inline where the worker fails). */
async function setup(E: Engine, blob: Uint8Array) {
  if (typeof Worker !== "undefined") {
    try {
      const w = new Worker(new URL("../../../src/solids/edges-worker.ts", import.meta.url), { type: "module" });
      const s = await E.setupInWorker(w, blob);
      w.terminate();
      return s;
    } catch {
      // fall through to the main thread
    }
  }
  const t0 = performance.now();
  const s = await E.setupInline(blob);
  return { ...s, wall: performance.now() - t0 };
}

export async function load3(E: Engine, id: string, f: ReturnType<typeof fetchAll>, title: string, no: string): Promise<Loaded> {
  const [blob, meta] = await Promise.all([f.blob, f.meta]);
  const s = await setup(E, blob);
  const kinematics = meta.kin ? new E.Kinematics(meta.kin as unknown as import("../../../src/kin/types").Kin) : null;
  const axes: Record<string, [number, number, number]> = {};
  for (const j of meta.kin?.joints ?? []) if (Array.isArray(j.axis) && j.axis.length >= 3) axes[j.id] = [j.axis[0]!, j.axis[1]!, j.axis[2]!];
  const poser = poserFor(E, { kinematics, lifts: s.pkg.lifts });
  const scene: import("../../../src/render/v3/scene").Scene = {
    pkg: s.pkg,
    meshes: s.meshes,
    edges: s.edges,
    ...(s.baked ? { baked: s.baked } : {}),
    poser,
    teaching: meta.teaching,
    axes,
    info: { title, no },
  };
  return { scene, meta, kinematics, setupMs: s.wall };
}

/** The poser of the loaded mechanism at the given control settings. */
export function poserFor(E: Engine, l: Pick<Loaded, "kinematics"> & { lifts?: Record<string, [number, number, number, number]> }, controls?: import("../../../src/kin/types").Controls) {
  return l.kinematics ? E.kinPoser(l.kinematics, controls, l.lifts) : E.staticPoser;
}
