// npx tsx tools/shot3.ts <id> [--view record|PLAN|FRONT|SIDE|ISOMETRIC|DIMETRIC|"AUX O2"|"VIEW 30 40"|<view id>] [--theme dark|light]
//   [--explode 0] [--detail full] [--u 1.1] [--w 1393] [--h 870] [--dpr 1.5] [--card] [--params a=1,b=2]
//   [--select name=option] [--drivers speed=120] [out.png]
// Draws one frame of a mechanism with the 3D renderer, in local Chrome (tools/chrome3.ts), to a PNG.
// --set [dir] draws the set of standard Q4 instead: the record's default view, PLAN, FRONT, SIDE and ISOMETRIC, every
// section and detail view of the record, and the full explode, each on both sheets, with the overlays on, into
// dist/shots3/<id> (or dir). tools/shot forwards a mechanism rebuilt on engine v3 here.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { recordById } from "../src/catalog";
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

/** The views of standard Q4 for a record: [file stem, options]. */
export function setOf(id: string): [string, Partial<Draw3Options>][] {
  const teaching = (recordById(id) as unknown as { teaching?: { views?: { id: string }[] } } | undefined)?.teaching;
  return [
    ["record", { view: "record" }],
    ["plan", { view: "PLAN" }],
    ["front", { view: "FRONT" }],
    ["side", { view: "SIDE" }],
    ["isometric", { view: "ISOMETRIC" }],
    ...(teaching?.views ?? []).map((v): [string, Partial<Draw3Options>] => [`view-${v.id.replace(/\W+/g, "-")}`, { view: v.id }]),
    ["explode", { view: "ISOMETRIC", explode: 1 }],
  ];
}

/** Draws the Q4 set on both sheets. Returns the files written. */
export async function shotSet(id: string, dir: string): Promise<string[]> {
  mkdirSync(dir, { recursive: true });
  const chrome = await openChrome3();
  const files: string[] = [];
  try {
    for (const [stem, o] of setOf(id))
      for (const theme of ["dark", "light"] as const) {
        const f = join(dir, `${stem}-${theme}.png`);
        writeFileSync(f, await chrome.shot(id, stage3({ ...o, theme })));
        files.push(f);
      }
  } finally {
    await chrome.close();
  }
  return files;
}

/** --params a=1,b=2 --select s=above --drivers speed=120: settings of the record's controls. */
function controlsArg(): NonNullable<Draw3Options["controls"]> {
  const pairs = (v: string | undefined) => Object.fromEntries((v ?? "").split(",").filter(Boolean).map((kv) => kv.split("=") as [string, string]));
  const nums = (v: string | undefined) => Object.fromEntries(Object.entries(pairs(v)).map(([k, x]) => [k, Number(x)]));
  return { params: nums(arg("params")), select: pairs(arg("select")), drivers: nums(arg("drivers")) };
}

export async function main() {
  const id = process.argv[2];
  if (!id) {
    console.error("usage: tools/shot3.ts <id> [options] [out.png]");
    process.exitCode = 1;
    return;
  }
  if (process.argv.includes("--set")) {
    const dir = process.argv[process.argv.indexOf("--set") + 1];
    for (const f of await shotSet(id, dir && !dir.startsWith("--") ? dir : join("dist", "shots3", id))) console.log(`wrote ${f}`);
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
        ...(arg("zoom") ? { zoom: { centre: arg("zoom")!, scale: Number(arg("scale") ?? 4) } } : {}),
        ...(process.argv.includes("--card") ? { card: true } : {}),
        ...(arg("params") || arg("select") || arg("drivers") ? { controls: controlsArg() } : {}),
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
