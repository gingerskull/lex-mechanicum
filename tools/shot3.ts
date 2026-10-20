// npx tsx tools/shot3.ts <id> [--view record|PLAN|FRONT|SIDE|ISOMETRIC|DIMETRIC|"AUX O2"|"VIEW 30 40"|<view id>] [--theme dark|light]
//   [--explode 0] [--detail full] [--u 1.1] [--w 1393] [--h 870] [--dpr 1.5] [--card] [out.png]
// Draws one frame of a mechanism with the 3D renderer, in local Chrome (tools/chrome3.ts), to a PNG.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { Dial } from "../src/render/detail";
import { openChrome3, type Draw3Options } from "./chrome3";

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? process.argv[i + 1] : undefined;
}

/** A stage shot: 1393 x 870 at DPR 1.5, phase 1.1, the record's view with the sheet and dimensions on, then `o` over it. */
export function stage3(o: Partial<Draw3Options> = {}): Draw3Options {
  return { w: 1393, h: 870, dpr: 1.5, u: 1.1, ...o };
}

async function main() {
  const id = process.argv[2];
  if (!id) {
    console.error("usage: tools/shot3.ts <id> [options] [out.png]");
    process.exitCode = 1;
    return;
  }
  const view = arg("view") ?? "record";
  const theme = (arg("theme") ?? "dark") as "dark" | "light";
  const last = process.argv[process.argv.length - 1]!;
  const out = last.endsWith(".png") ? last : join("dist", "shots3", `${id}-${view.replace(/\W+/g, "-")}-${theme}.png`);
  const chrome = await openChrome3();
  try {
    const png = await chrome.shot(
      id,
      stage3({
        view,
        theme,
        u: Number(arg("u") ?? 1.1),
        w: Number(arg("w") ?? 1393),
        h: Number(arg("h") ?? 870),
        dpr: Number(arg("dpr") ?? 1.5),
        explode: Number(arg("explode") ?? 0),
        detail: (arg("detail") ?? "full") as Dial,
        ...(process.argv.includes("--card") ? { card: true } : {}),
      }),
    );
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, png);
    console.log(`wrote ${out}`);
  } finally {
    await chrome.close();
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) await main();
