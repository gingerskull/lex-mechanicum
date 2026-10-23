// npx tsx tools/clearance.ts <id | all | changed> [--ci | --full] [--no-cache] [--inject <solid>,<dz>]
// A15, A12 and M6 over the full cycle (standard Q2): the mechanism built from its record v3 by the hardware builder, its
// solids tested in 3D with Manifold, penetration depth against 0.1 mm, with the hand `allow` exemptions flagged
// unnecessary when the pair never overlaps. --ci samples 8 phases and skips the `allow` audit; --full (the default)
// samples 72. Results are cached on the solids and poses (dist/cache/checks3); --no-cache recomputes. --inject moves one
// solid along its local z by dz mm, to see a clash found. Exits non-zero on a clash, clamp or edge-distance fault, or
// (full profile) an unnecessary `allow`.
// `changed` is the pre-push selection (the workflow's check table): the mechanisms whose folder or record changed since the
// branch's upstream, and every mechanism when code outside src/mechanisms changed; each gets the full 72-phase check,
// which the CI profile only samples. Each mechanism is built once (src/package/built.ts), in a pool of processes
// (tools/pool.ts).
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { allIds, isBuilt, isKnown, clashLines, check3d, sourceOf, unnecessaryLines, type CheckSource } from "../src/checks";
import { builtMechanism } from "../src/package/built";
import { runPool } from "./pool";

export interface Report {
  lines: string[];
  clashes: number;
  faults: number;
}

/** The 3D check of a source. */
export async function report3(id: string, src: CheckSource, o: { profile: "ci" | "full"; cache: boolean; inject?: [string, number] }): Promise<Report> {
  if (o.inject) {
    const [sid, dz] = o.inject;
    const s = src.solids.find((x) => x.id === sid);
    if (!s) throw new Error(`no solid "${sid}"; solids: ${src.solids.slice(0, 12).map((x) => x.id).join(", ")} ...`);
    const z = s.frame.z;
    s.frame = { ...s.frame, o: [s.frame.o[0] + z[0] * dz, s.frame.o[1] + z[1] * dz, s.frame.o[2] + z[2] * dz] };
  }
  const r = await check3d(src, o.profile, { cache: o.cache && !o.inject });
  const clashes = clashLines(r);
  const unnecessary = unnecessaryLines(r);
  const lines = [
    `${id}: ${r.clash.stats.solids} solids, ${r.clash.stats.pairs} moving pairs, ${r.clash.stats.intersections} intersections over ${r.clash.stats.phases} phases, ${r.clash.stats.ms.toFixed(0)} ms${r.cached ? " (cached)" : ""} (${r.profile})`,
    `clearance (3D): ${clashes.length} clash${clashes.length === 1 ? "" : "es"}`,
    ...r.clash.clashes.slice(0, 30).map((c) => `  ${c.a} x ${c.b}: ${c.depth.toFixed(2)} mm (${c.volume.toFixed(1)} mm³) at u ${c.u.toFixed(2)}`),
    r.profile === "full" ? `hand allow: ${r.clash.allows.length} named, ${unnecessary.length} unnecessary` : "hand allow: not audited at the ci profile",
    ...unnecessary.slice(0, 12).map((s) => `  unnecessary: ${s}`),
    `clamp (3D): ${r.clamp.length ? r.clamp.length + " fault(s)" : "clean"}`,
    ...r.clamp.map((s) => `  ${s}`),
    `edge distance: ${r.edges.length ? r.edges.length + " finding(s)" : "clean"}`,
    ...r.edges.map((s) => `  ${s}`),
  ];
  return { lines, clashes: clashes.length, faults: r.clamp.length + r.edges.length + (r.profile === "full" ? unnecessary.length : 0) };
}

interface Job {
  id: string;
  profile: "ci" | "full";
  cache: boolean;
  inject?: [string, number];
}

/** The 3D check of one mechanism, built once (a pool task). */
export async function clearanceOne(j: Job): Promise<Report> {
  // --no-cache builds again as well
  const b = await builtMechanism(j.id, { cache: j.cache });
  return report3(j.id, sourceOf(b.record, b.assembly), { profile: j.profile, cache: j.cache, ...(j.inject ? { inject: j.inject } : {}) });
}

/** The mechanisms a push changes: see the header. */
export function changedIds(base?: string): string[] {
  const git = (...a: string[]) => execFileSync("git", a, { encoding: "utf8" }).trim();
  let ref = base;
  if (!ref) {
    for (const r of ["@{upstream}", "origin/main"]) {
      try {
        ref = git("merge-base", "HEAD", r);
        break;
      } catch {
        // no such ref
      }
    }
  }
  if (!ref) return allIds();
  const files = git("diff", "--name-only", ref).split("\n").filter(Boolean);
  const ids = new Set<string>();
  for (const f of files) {
    const m = /^src\/mechanisms\/([a-z0-9-]+)\//.exec(f);
    if (m) ids.add(m[1]!);
    else if (/^(src|tools)\//.test(f) || f === "package.json") return allIds();
    else if (f.startsWith("data/catalog/")) allIds().forEach((id) => ids.add(id));
  }
  return [...ids].filter(isBuilt);
}

async function main() {
  const flags = new Set(process.argv.slice(2).filter((a) => a.startsWith("--")));
  const inj = process.argv.indexOf("--inject");
  const inject = inj > 0 ? ((): [string, number] => { const [a, b] = process.argv[inj + 1]!.split(","); return [a!, Number(b)]; })() : undefined;
  const args = process.argv.slice(2).filter((a, i, all) => !a.startsWith("--") && all[i - 1] !== "--inject");
  const arg = args[0] ?? "all";
  const ids = arg === "all" ? allIds() : arg === "changed" ? changedIds() : [arg];
  if (arg === "changed" && !ids.length) console.log("clearance: no mechanism changed");
  const profile = flags.has("--ci") ? "ci" : "full";
  const unknown = ids.find((id) => !isKnown(id));
  if (unknown) {
    console.error(`unknown mechanism ${unknown}`);
    process.exitCode = 1;
    return;
  }
  let bad = 0;
  const jobs = ids.map((id): Job => ({ id, profile, cache: !flags.has("--no-cache"), ...(inject ? { inject } : {}) }));
  await runPool(clearanceOne, fileURLToPath(import.meta.url), jobs, {
    each: (r) => {
      console.log(r.lines.join("\n"));
      bad += r.clashes + r.faults;
    },
  });
  if (bad) process.exitCode = 1;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) await main();
