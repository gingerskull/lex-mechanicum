// The 3D checks of one mechanism as the tools and tests run them (A15, A12, M6), with the two profiles of the CI budget:
// `ci` samples few phases and skips the hand `allow` audit, `full` is the 72 phases of the pre-push hook and the audit
// sheet. A result is cached on disk under a key that covers everything the check reads (the solids, their poses at
// the sampled phases, the profile and the tool version), so an unchanged mechanism costs the hash only.
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "../audit/sheet";
import { clampCheck3, edgeCheck3 } from "./clamp3";
import { clearance3, type ClashReport } from "./clash3";
import type { CheckSource } from "./source";

export interface Profile3 {
  name: "ci" | "full";
  /** Phases of the clash check (A15). */
  phases: number;
  /** Phases of the clamp check (A12). */
  clampPhases: number;
  /** Test the hand `allow` exemptions for the unnecessary ones. */
  allowCheck: boolean;
}

export const PROFILES: Record<Profile3["name"], Profile3> = {
  ci: { name: "ci", phases: 8, clampPhases: 2, allowCheck: false },
  full: { name: "full", phases: 72, clampPhases: 12, allowCheck: true },
};

/** Bump when a check changes what it reports, so stale cache entries are never read. */
export const CHECKS_VERSION = 3;

export interface Result3 {
  profile: Profile3["name"];
  clash: ClashReport;
  clamp: string[];
  edges: string[];
  cached: boolean;
  key: string;
}

export const CACHE_DIR = process.env.CHECK_CACHE_DIR ?? join(ROOT, "dist", "cache", "checks3");

/** The key of a check: a hash of the solids, their poses at the phases the profile samples, and the profile. */
export function cacheKey(src: CheckSource, p: Profile3): string {
  const h = createHash("sha256");
  h.update(`v${CHECKS_VERSION}|${p.name}|${p.phases}|${p.clampPhases}|${p.allowCheck}\n`);
  const r = (x: number) => Math.round(x * 1e5) / 1e5;
  h.update(
    JSON.stringify(src.solids, (k, v) => (typeof v === "number" ? r(v) : ArrayBuffer.isView(v) ? Array.from(v as unknown as ArrayLike<number>, r) : v)),
  );
  h.update(JSON.stringify(src.contact));
  const n = Math.max(p.phases, p.clampPhases);
  for (let i = 0; i < n; i++) {
    const u = (i / n) * Math.PI * 2;
    for (const s of src.solids) h.update(src.placer.place(s, u).map(r).join(",") + (src.placer.stretch ? `|${r(src.placer.stretch(s, u))}` : "") + ";");
  }
  return h.digest("hex").slice(0, 32);
}

export async function check3d(src: CheckSource, profile: Profile3 | Profile3["name"] = "full", o: { cache?: boolean; dir?: string } = {}): Promise<Result3> {
  const p = typeof profile === "string" ? PROFILES[profile] : profile;
  const key = cacheKey(src, p);
  const dir = o.dir ?? CACHE_DIR;
  const file = join(dir, `${src.id}-${key}.json`);
  if (o.cache !== false && existsSync(file)) {
    try {
      return { ...(JSON.parse(readFileSync(file, "utf8")) as Result3), cached: true };
    } catch {
      // a damaged entry is recomputed
    }
  }
  const clash = await clearance3(src.solids, src.placer, { phases: p.phases, contact: src.contact, allowCheck: p.allowCheck });
  const clamp = await clampCheck3(src.solids, src.placer, p.clampPhases);
  const edges = edgeCheck3(src.solids);
  const out: Result3 = { profile: p.name, clash, clamp, edges, cached: false, key };
  if (o.cache !== false) {
    mkdirSync(dir, { recursive: true });
    writeFileSync(file, JSON.stringify(out));
  }
  return out;
}

/** The clashes as sentences, and the unnecessary exemptions as sentences. */
export const clashLines = (r: Result3): string[] => r.clash.clashes.map((c) => `${c.a} x ${c.b} ${c.depth.toFixed(2)} mm`);
export const unnecessaryLines = (r: Result3): string[] => r.clash.allows.filter((a) => a.unnecessary).map((a) => `${a.a} x ${a.b}${a.why ? ` (${a.why})` : ""}`);
