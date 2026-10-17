// npx tsx tools/shot.ts <id> [--tilt 28] [--explode 0] [--theme dark] [--overlays paths,forces] [--detail full]
//   [--u 1.1] [--w 1393] [--h 870] [--dpr 1.5] [out.png]
// Renders one frame of a mechanism's package to a PNG with the site's renderer (headless, Node canvas).
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { recordById } from "../src/catalog";
import { mechanisms } from "../src/mechanisms";
import { buildPackage } from "../src/package/build";
import type { Package } from "../src/package/format";
import { defaultView, type DrawView } from "../src/render/draft";
import { createSession } from "../src/render/session";
import type { Dial } from "../src/render/detail";
import type { ThemeKey } from "../src/style/tokens";
import { nodeCanvas, nodeFactory } from "./canvas-node";

export interface ShotOptions {
  view: Partial<DrawView>;
  u: number;
  w: number;
  h: number;
  dpr: number;
}

const packages = new Map<string, Promise<Package>>();
export const packageOf = (id: string) => packages.get(id) ?? packages.set(id, buildPackage(id).then((r) => r.pkg)).get(id)!;

export async function shot(id: string, o: Partial<ShotOptions> = {}): Promise<Buffer> {
  const { model } = await mechanisms[id]!();
  const pkg = await packageOf(id);
  const w = o.w ?? 1393;
  const h = o.h ?? 870;
  const dpr = o.dpr ?? 1.5;
  const canvas = nodeCanvas(Math.round(w * dpr), Math.round(h * dpr));
  const sess = createSession(canvas as never, pkg, model, { factory: nodeFactory, w, h, dpr });
  const rec = recordById(id);
  sess.draw(o.u ?? 1.1, { ...defaultView(), dims: true, sheet: { title: rec?.name ?? id, no: `MX-${id.toUpperCase()}` }, ...o.view });
  return canvas.toBuffer("image/png");
}

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? process.argv[i + 1] : undefined;
}

async function main() {
  const id = process.argv[2];
  if (!id || !mechanisms[id]) {
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
  const png = await shot(id, { view, u: Number(arg("u") ?? 1.1), w: Number(arg("w") ?? 1393), h: Number(arg("h") ?? 870), dpr: Number(arg("dpr") ?? 1.5) });
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, png);
  console.log(`wrote ${out}`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) await main();
