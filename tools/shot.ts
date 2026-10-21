// npx tsx tools/shot.ts <id> [--tilt 28] [--explode 0] [--theme dark] [--overlays paths,forces] [--detail full]
//   [--u 1.1] [--w 1393] [--h 870] [--dpr 1.5] [out.png]
// Draws one frame of a mechanism with the site's renderer, in local Chrome (tools/chrome.ts), to a PNG.
// A mechanism rebuilt on engine v3 (or any with --v3) is drawn by the 3D renderer instead, with the options of tools/shot3
// (--view, --set for the Q4 set, ...); the two renderers live side by side until the cut-over.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { recordById } from "../src/catalog";
import { engineOf, isKnown } from "../src/checks/engine";
import { mechanisms } from "../src/mechanisms";
import type { DrawView } from "../src/render/draft";
import type { Dial } from "../src/render/detail";
import type { ThemeKey } from "../src/style/tokens";
import { openChrome, type DrawOptions } from "./chrome";

/** A stage drawing of the mechanism: 1393 x 870 at DPR 1.5, phase 1.1, sheet and dimensions on, then `o` over it. */
export function stageShot(id: string, o: Partial<Omit<DrawOptions, "view">> & { view?: Partial<DrawView> } = {}): DrawOptions {
  const rec = recordById(id);
  return {
    w: o.w ?? 1393,
    h: o.h ?? 870,
    dpr: o.dpr ?? 1.5,
    u: o.u ?? 1.1,
    ...(o.card ? { card: true } : {}),
    view: { dims: true, sheet: { title: rec?.name ?? id, no: `MX-${id.toUpperCase()}` }, ...o.view },
  };
}

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? process.argv[i + 1] : undefined;
}

async function main() {
  const id = process.argv[2];
  if (id && (process.argv.includes("--v3") || process.argv.includes("--set") || (isKnown(id) && engineOf(id) === "v3"))) {
    await (await import("./shot3")).main();
    return;
  }
  if (!id || (!mechanisms[id] && !id.startsWith("fx-"))) {
    console.error(`usage: tools/shot.ts <id> [options] [out.png]; ids: ${Object.keys(mechanisms).join(", ")}`);
    process.exitCode = 1;
    return;
  }
  const ov = (arg("overlays") ?? "paths").split(",").filter(Boolean);
  const view: Partial<DrawView> = {
    tilt: Number(arg("tilt") ?? 28),
    explode: Number(arg("explode") ?? 0),
    theme: (arg("theme") ?? "dark") as ThemeKey,
    detail: (arg("detail") ?? "full") as Dial,
    overlays: { paths: ov.includes("paths"), forces: ov.includes("forces"), angles: ov.includes("angles"), velocity: ov.includes("velocity") },
  };
  const last = process.argv[process.argv.length - 1]!;
  const out = last.endsWith(".png") ? last : join("dist", "shots", `${id}-${view.theme}-t${view.tilt}-e${view.explode}.png`);
  const chrome = await openChrome({ fixtures: id.startsWith("fx-") });
  try {
    const png = await chrome.shot(id, stageShot(id, { view, u: Number(arg("u") ?? 1.1), w: Number(arg("w") ?? 1393), h: Number(arg("h") ?? 870), dpr: Number(arg("dpr") ?? 1.5) }));
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, png);
    console.log(`wrote ${out}`);
  } finally {
    await chrome.close();
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) await main();
