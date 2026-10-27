// One build per mechanism per state of the sources (Node only). The record built once by the hardware builder feeds its
// package (R4), the record checks (Q1) and the 3D checks (A15, A12): conformance, clearance, the thumbnails'
// fingerprints and the site build all start here. The build is kept on disk (dist/cache/built) under a key of what it
// reads (`buildKey`: the shared sources, the mechanism's own folder and record, the lockfile and the Node version), so
// the tools of one run build each mechanism once between them, a change to one mechanism builds only that one again, and
// CI keeps the folder between runs.
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { deserialize, serialize } from "node:v8";
import { parseHeader, readAudit, ROOT } from "../audit/sheet";
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

const MECHANISMS = join(ROOT, "src", "mechanisms");

/** Hashes every file under `dir` (by path and content) into `h`, in name order, except what `skip` names. */
function walk(h: ReturnType<typeof createHash>, dir: string, skip: (path: string, isDir: boolean) => boolean = () => false): void {
  for (const e of readdirSync(dir, { withFileTypes: true }).sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))) {
    const p = join(dir, e.name);
    if (skip(p, e.isDirectory())) continue;
    if (e.isDirectory()) walk(h, p, skip);
    else {
      h.update(`${relative(ROOT, p).replace(/\\/g, "/")}\n`);
      h.update(readFileSync(p));
    }
  }
}

let shared: string | null = null;
/**
 * The part of the key every build shares: the Node version, the lockfile, and the files under src/ and data/catalog/
 * except each mechanism's own folder and the records, which each build keys on itself (`buildKey`). The catalogue's
 * vocabularies and version count; its generation date does not.
 */
export function sharedKey(): string {
  if (shared) return shared;
  const h = createHash("sha256");
  h.update(`${process.version}\n`);
  walk(h, join(ROOT, "src"), (p, isDir) => isDir && join(p, "..") === MECHANISMS);
  walk(h, join(ROOT, "data", "catalog"), (p) => p === join(ROOT, "data", "catalog", "sources") || p === join(ROOT, "data", "catalog", "mechanisms.json"));
  const { version, vocabularies } = JSON.parse(readFileSync(join(ROOT, "data", "catalog", "mechanisms.json"), "utf8")) as { version: unknown; vocabularies: unknown };
  h.update(JSON.stringify({ version, vocabularies }));
  h.update(readFileSync(join(ROOT, "package-lock.json")));
  return (shared = h.digest("hex").slice(0, 32));
}

/**
 * The key of one mechanism's build: the shared key, its own folder (its polish; of its audit sheet only the header's
 * standard and result, which the package carries) and its record. A change to one mechanism builds that one again, a
 * change to shared code every one.
 */
export function buildKey(id: string, record: CatalogRecord, audit: string | null = readAudit(id)): string {
  const h = createHash("sha256");
  h.update(sharedKey());
  walk(h, join(MECHANISMS, id), (p) => p.endsWith("audit.md"));
  const header = audit ? parseHeader(audit) : null;
  h.update(JSON.stringify({ standard: header?.standard || "none", result: header?.result || "none" }));
  h.update(JSON.stringify(record));
  return h.digest("hex").slice(0, 32);
}

/** A mechanism built once: read from the cache when its sources are unchanged, else built, packed and kept. */
export async function builtMechanism(id: string, o: { cache?: boolean } = {}): Promise<BuiltMechanism> {
  const { record, polish } = await loadV3(id);
  const own = { id, record, ...(polish ? { polish } : {}) };
  const file = join(BUILT_DIR, `${id}.bin`);
  const k = buildKey(id, record);
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
