// npx tsx tools/bench3.ts [id ...] [--frames 40] [--w 1393] [--h 870] [--dpr 1.5]: frame times of the 3D renderer in local
// Chrome (standard R6, R10): per view the mean interval of paced frames, draw plus a one-pixel read-back (what the frame
// costs when the display's rate is not the limit) and the script time, with setup and the first frame. The targets are 8 ms
// on the desktop and 16 ms on a mid-range phone (flags, not gates); the phone is measured with the bench page.
import { mkdirSync, writeFileSync } from "node:fs";
import { openChrome3, type Bench3 } from "./chrome3";

const argv = process.argv.slice(2);
const flag = (n: string, d: number) => {
  const i = argv.indexOf(`--${n}`);
  return i >= 0 ? Number(argv[i + 1]) : d;
};
const ids = argv.filter((a, i) => !a.startsWith("--") && !argv[i - 1]?.startsWith("--"));
const run = ids.length ? ids : ["four-bar", "bevel-gears", "oscillating-cylinder", "watt-linkage"];

const VIEWS = {
  plan: { view: "PLAN" },
  "28": { view: "VIEW 0 62" },
  side: { view: "SIDE" },
  iso: { view: "ISOMETRIC" },
  explode: { view: "ISOMETRIC", explode: 1 },
  "28-detailC": { view: "VIEW 0 62", detail: "C" as const },
  "28-detailG": { view: "VIEW 0 62", detail: "G" as const },
};

const chrome = await openChrome3();
const rows: Bench3[] = [];
try {
  console.log(`GPU: ${chrome.gpu}`);
  for (const id of run) {
    const r = await chrome.bench(id, { w: flag("w", 1393), h: flag("h", 870), dpr: flag("dpr", 1.5), frames: flag("frames", 40), views: VIEWS });
    rows.push(r);
    console.log(`${id}: ${r.tris} tris, ${r.edges} edges, ${r.draws} draws, ${r.layers} layers, ${r.see} see-through; setup ${r.setupMs} ms (decode, tessellate, edges), bake ${r.bakeMs} ms, first frame ${r.firstFrameMs} ms, context ${r.contextMs} ms`);
    for (const [v, t] of Object.entries(r.views)) console.log(`  ${v.padEnd(12)} paced ${t.paced} ms   gpu ${t.gpu} ms   script ${t.cpu} ms`);
  }
} finally {
  await chrome.close();
}
mkdirSync("dist/bench", { recursive: true });
writeFileSync("dist/bench/report-v3.json", JSON.stringify({ gpu: "see console", rows }, null, 2));
