// One build per mechanism per state of the sources (Node only). The record built once by the hardware builder feeds its
// package (R4), the record checks (Q1) and the 3D checks (A15, A12): conformance, clearance, the thumbnails'
// fingerprints and the site build all start here. The build is kept on disk (dist/cache/built) under a key of every file
// a build reads (src/, data/catalog/, the lockfile) and the Node version, so the tools of one run build each mechanism
// once between them, and a change to any source builds it again.
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { deserialize, serialize } from "node:v8";
import { ROOT } from "../audit/sheet";
import { buildAssembly, type Assembly, type Polish } from "../builder";
import type { CatalogRecord } from "../catalog/schema";
import { loadV3 } from "../mechanisms";
import { packAssembly } from "./build3";
import { encode2 } from "./format2";

export const BUILT_DIR = process.env.BUILT_CACHE_DIR ?? join(ROOT, "dist", "cache", "built");

export interface BuiltMechanism {
  id: string;
  record: CatalogRecord;
  polish?: Polish;
  assembly: Assembly;
  /** The package v2, encoded. */
  bytes: Uint8Array;
  /** Read from the cache, not built in this call. */
  cached: boolean;
}

let key: string | null = null;
/** The key of every build: a hash of the files under src/ and data/catalog/, the lockfile and the Node version. */
export function sourcesKey(): string {
  if (key) return key;
  const h = createHash("sha256");
  h.update(`${process.version}\n`);
  const walk = (dir: string) => {
    for (const e of readdirSync(dir, { withFileTypes: true }).sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))) {
      const p = join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else {
        h.update(`${relative(ROOT, p).replace(/\\/g, "/")}\n`);
        h.update(readFileSync(p));
      }
    }
  };
  for (const d of ["src", "data/catalog"]) walk(join(ROOT, d));
  h.update(readFileSync(join(ROOT, "package-lock.json")));
  return (key = h.digest("hex").slice(0, 32));
}

/** A mechanism built once: read from the cache when its sources are unchanged, else built, packed and kept. */
export async function builtMechanism(id: string, o: { cache?: boolean } = {}): Promise<BuiltMechanism> {
  const { record, polish } = await loadV3(id);
  const own = { id, record, ...(polish ? { polish } : {}) };
  const file = join(BUILT_DIR, `${id}.bin`);
  const k = sourcesKey();
  if (o.cache !== false && existsSync(file)) {
    try {
      const hit = deserialize(readFileSync(file)) as { key: string; assembly: Assembly; bytes: Uint8Array };
      // the bytes on their own buffer, not a view of the whole entry's
      if (hit.key === k) return { ...own, assembly: hit.assembly, bytes: hit.bytes.slice(), cached: true };
    } catch {
      // a damaged entry is built again
    }
  }
  const assembly = await buildAssembly(record as never, polish ? { polish } : {});
  const bytes = await encode2((await packAssembly(record as never, assembly)).pkg);
  if (o.cache !== false) {
    // whole or not at all: another tool may be reading the same entry; a cache that cannot be written only costs a build
    const tmp = `${file}.${process.pid}.tmp`;
    try {
      mkdirSync(BUILT_DIR, { recursive: true });
      writeFileSync(tmp, serialize({ key: k, assembly, bytes }));
      renameSync(tmp, file);
    } catch {
      rmSync(tmp, { force: true });
    }
  }
  return { ...own, assembly, bytes, cached: false };
}

/** A mechanism's encoded package, built once (a task for the tools' process pool). */
export async function builtBytes(id: string): Promise<Uint8Array> {
  return (await builtMechanism(id)).bytes;
}
