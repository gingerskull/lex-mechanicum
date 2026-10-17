// npx tsx tools/clearance.ts <id | all>: assembles a mechanism with its polish and reports clashes over the cycle
// (A15), the clamp check (A12) and hole walls (M6). Exits non-zero on a clash.
import { fileURLToPath } from "node:url";
import { assemble } from "../src/assemble";
import type { Polish } from "../src/assemble/api";
import { clampCheck, edgeCheck } from "../src/assemble/clamp";
import { clearance } from "../src/assemble/clearance";
import { mechanisms } from "../src/mechanisms";

export async function report(id: string): Promise<{ lines: string[]; clashes: number }> {
  const entry = await mechanisms[id]!();
  const a = assemble(entry.model, undefined, entry.polish ? { polish: entry.polish as Polish } : {});
  const clashes = clearance(entry.model, a);
  const clamp = clampCheck(entry.model, a);
  const edges = edgeCheck(a);
  const lines = [
    `${id}: ${a.solids.length} solids, ${a.joints.length} joints, rules ${a.ms.auto.toFixed(0)} ms, polish ${a.ms.polish.toFixed(0)} ms`,
    `clearance: ${clashes.length} clash${clashes.length === 1 ? "" : "es"}`,
    ...clashes.slice(0, 30).map((c) => `  ${c.a} x ${c.b}: ${c.depth.toFixed(2)} mm at u ${c.u.toFixed(2)}`),
    `clamp: ${clamp.length ? clamp.length + " fault(s)" : "clean"}`,
    ...clamp.map((s) => `  ${s}`),
    `edge distance: ${edges.length ? edges.length + " finding(s)" : "clean"}`,
    ...edges.map((s) => `  ${s}`),
  ];
  return { lines, clashes: clashes.length };
}

async function main() {
  const arg = process.argv[2] ?? "all";
  const ids = arg === "all" ? Object.keys(mechanisms) : [arg];
  let bad = 0;
  for (const id of ids) {
    if (!mechanisms[id]) {
      console.error(`unknown mechanism ${id}`);
      process.exitCode = 1;
      return;
    }
    const r = await report(id);
    console.log(r.lines.join("\n"));
    bad += r.clashes;
  }
  if (bad) process.exitCode = 1;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) await main();
