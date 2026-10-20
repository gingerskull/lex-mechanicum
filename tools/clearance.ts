// npx tsx tools/clearance.ts <id | all | changed> [--2d | --3d | --v3 | --both] [--ci | --full] [--no-cache] [--inject <solid>,<dz>]
// A15, A12 and M6 over the full cycle (standard Q2). Two engines live side by side until the cut-over:
//   --2d   the 2.5D mechanism's own check on its outlines (default for a mechanism audited below 3.0);
//   --3d   the same mechanism's solids lifted to 3D and tested with Manifold, penetration depth against 0.1 mm,
//          with the hand `allow` exemptions flagged unnecessary when the pair never overlaps (the transition view);
//   --v3   a mechanism rebuilt from its record v3 (default for a mechanism audited at 3.0 or later);
//   --both the 2.5D check and the lifted 3D check.
// --ci samples 8 phases and skips the `allow` audit; --full (the default) samples 72. Results are cached on the solids
// and poses (dist/cache/checks3); --no-cache recomputes. --inject moves one solid along its local z by dz mm, to see a
// clash found. Exits non-zero on a clash, clamp or edge-distance fault, or (full profile) an unnecessary `allow`.
// `changed` is the pre-push selection (the workflow's check table): the mechanisms whose folder changed since the branch's
// upstream, and every mechanism when code outside src/mechanisms changed; a 2.5D mechanism gets its own cheap check, one
// rebuilt on engine v3 the full 72-phase 3D check, which the CI profile only samples.
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { assemble } from "../src/assemble";
import type { Polish } from "../src/assemble/api";
import { clampCheck, edgeCheck } from "../src/assemble/clamp";
import { clearance } from "../src/assemble/clearance";
import { allIds, engineOf, isKnown, loadV3, clashLines, check3d, legacySourceOf, recordSource, unnecessaryLines, type CheckSource } from "../src/checks";
import { mechanisms } from "../src/mechanisms";

export interface Report {
  lines: string[];
  clashes: number;
  faults: number;
}

/** The 2.5D check, as before. */
export async function report(id: string): Promise<Report> {
  const entry = await mechanisms[id]!();
  const a = assemble(entry.model, undefined, entry.polish ? { polish: entry.polish as Polish } : {});
  const clashes = clearance(entry.model, a);
  const clamp = clampCheck(entry.model, a);
  const edges = edgeCheck(a);
  const lines = [
    `${id}: ${a.solids.length} solids, ${a.joints.length} joints, rules ${a.ms.auto.toFixed(0)} ms, polish ${a.ms.polish.toFixed(0)} ms (2.5D engine)`,
    `clearance: ${clashes.length} clash${clashes.length === 1 ? "" : "es"}`,
    ...clashes.slice(0, 30).map((c) => `  ${c.a} x ${c.b}: ${c.depth.toFixed(2)} mm at u ${c.u.toFixed(2)}`),
    `clamp: ${clamp.length ? clamp.length + " fault(s)" : "clean"}`,
    ...clamp.map((s) => `  ${s}`),
    `edge distance: ${edges.length ? edges.length + " finding(s)" : "clean"}`,
    ...edges.map((s) => `  ${s}`),
  ];
  return { lines, clashes: clashes.length, faults: clamp.length + edges.length };
}

/** The 3D check of a source (lifted or native). */
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
    `${id}: ${r.clash.stats.solids} solids, ${r.clash.stats.pairs} moving pairs, ${r.clash.stats.intersections} intersections over ${r.clash.stats.phases} phases, ${r.clash.stats.ms.toFixed(0)} ms${r.cached ? " (cached)" : ""} (${src.engine}, ${r.profile})`,
    `clearance (3D): ${clashes.length} clash${clashes.length === 1 ? "" : "es"}`,
    ...r.clash.clashes.slice(0, 30).map((c) => `  ${c.a} x ${c.b}: ${c.depth.toFixed(2)} mm (${c.volume.toFixed(1)} mm³) at u ${c.u.toFixed(2)}`),
    r.profile === "full" ? `hand allow: ${r.clash.allows.length} named, ${unnecessary.length} unnecessary${unnecessary.length ? "" : ""}` : "hand allow: not audited at the ci profile",
    ...unnecessary.slice(0, 12).map((s) => `  unnecessary: ${s}`),
    `clamp (3D): ${r.clamp.length ? r.clamp.length + " fault(s)" : "clean"}`,
    ...r.clamp.map((s) => `  ${s}`),
    `edge distance: ${r.edges.length ? r.edges.length + " finding(s)" : "clean"}`,
    ...r.edges.map((s) => `  ${s}`),
  ];
  return { lines, clashes: clashes.length, faults: r.clamp.length + r.edges.length + (r.profile === "full" ? unnecessary.length : 0) };
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
    else if (f.startsWith("data/catalog/")) allIds().filter((id) => engineOf(id) === "v3").forEach((id) => ids.add(id));
  }
  return [...ids].filter(isKnown);
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
  let bad = 0;
  for (const id of ids) {
    if (!isKnown(id)) {
      console.error(`unknown mechanism ${id}`);
      process.exitCode = 1;
      return;
    }
    const mode = flags.has("--both") ? "both" : flags.has("--3d") ? "3d" : flags.has("--2d") ? "2d" : flags.has("--v3") ? "v3" : engineOf(id) === "v3" ? "v3" : "2d";
    if (mode === "2d" || mode === "both") {
      const r = await report(id);
      console.log(r.lines.join("\n"));
      bad += r.clashes + r.faults;
    }
    if (mode === "3d" || mode === "both") {
      const r = await report3(id, await legacySourceOf(id), { profile, cache: !flags.has("--no-cache"), ...(inject ? { inject } : {}) });
      console.log(r.lines.join("\n"));
      // the lifted view informs: a transition finding in a mechanism the old engine passes is reported, and fails only a rebuilt one
      if (mode === "3d") bad += r.clashes + r.faults;
    }
    if (mode === "v3") {
      const { record, polish } = await loadV3(id);
      const r = await report3(id, await recordSource(record as never, polish ? { polish } : {}), { profile, cache: !flags.has("--no-cache"), ...(inject ? { inject } : {}) });
      console.log(r.lines.join("\n"));
      bad += r.clashes + r.faults;
    }
  }
  if (bad) process.exitCode = 1;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) await main();
