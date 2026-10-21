// npx tsx tools/compare.ts [--shots] [--cards] [--lose] [--v3] [--ids four-bar,spur-gears] [--dpr 1.5] [--ref dir]
//   [--dials full,A,B,C,D]: the renderer's look, drawn in local Chrome (tools/chrome.ts), into dist/compare.
// --shots: one PNG per mechanism, sheet and view in dist/compare/shots; with --ref (PNGs named <id>-<theme>-<view>.png),
//          a diff against each and a grid per mechanism and sheet (reference, now, differing pixels).
// --cards: library card drawings at each dial position, one strip per mechanism and sheet (cards.png).
// --lose:  a frame drawn, the GPU context lost and restored, the frame drawn again; fails if it differs.
// --v3:    draw with the 3D renderer (tools/chrome3.ts) instead: plan, 28 degrees (elevation 62), side and the full explode;
//          the default when every id is a mechanism rebuilt on engine v3. The two renderers live side by side until the cut-over.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
import { engineOf } from "../src/checks/engine";
import { openChrome } from "./chrome";
import { openChrome3, type Draw3Options } from "./chrome3";
import { stageShot } from "./shot";
import { THUMB } from "./thumbs";

const arg = (k: string, d: string) => {
  const i = process.argv.indexOf(`--${k}`);
  return i > 0 ? process.argv[i + 1]! : d;
};
const has = (k: string) => process.argv.includes(`--${k}`);
const ids = arg("ids", "four-bar,spur-gears").split(",");
const dpr = Number(arg("dpr", "1.5"));
const ref = has("ref") ? arg("ref", "") : null;
if (!has("shots") && !has("cards") && !has("lose")) throw new Error("compare: say what to do: --shots, --cards or --lose");
const three = has("v3") || ids.every((id) => engineOf(id) === "v3");
const VIEWS = [["plan", 0, 0], ["28", 28, 0], ["side", 88, 0], ["explode", 70, 1]] as const;
const VIEWS3: Record<(typeof VIEWS)[number][0], Partial<Draw3Options>> = { plan: { view: "PLAN" }, "28": { view: "VIEW 0 62" }, side: { view: "SIDE" }, explode: { view: "ISOMETRIC", explode: 1 } };
const THEMES = ["dark", "light"] as const;
const OUT = join("dist", "compare");
mkdirSync(join(OUT, "shots"), { recursive: true });

const chrome = three ? await openChrome3() : await openChrome();
const stage3 = (o: Partial<Draw3Options>): Draw3Options => ({ w: 1393, h: 870, dpr, u: 1.1, ...o });
console.log(`GPU: ${chrome.gpu}`);
try {
  if (has("shots")) {
    const diffs: string[] = ["| Mechanism | Sheet | View | differing from the reference |", "|---|---|---|---|"];
    for (const id of ids)
      for (const theme of THEMES) {
        const row: Record<"ref" | "now" | "diff", (Buffer | null)[]> = { ref: [], now: [], diff: [] };
        for (const [name, tilt, explode] of VIEWS) {
          const buf = three
            ? await (chrome as Awaited<ReturnType<typeof openChrome3>>).shot(id, stage3({ ...VIEWS3[name], theme }))
            : await (chrome as Awaited<ReturnType<typeof openChrome>>).shot(id, stageShot(id, { dpr, view: { tilt, explode, theme } }));
          writeFileSync(join(OUT, "shots", `${id}-${theme}-${name}.png`), buf);
          row.now.push(buf);
          const rf = ref && join(ref, `${id}-${theme}-${name}.png`);
          if (!rf || !existsSync(rf)) {
            row.ref.push(null);
            row.diff.push(null);
            continue;
          }
          const rb = readFileSync(rf);
          const a = PNG.sync.read(rb);
          const b = PNG.sync.read(buf);
          const out = new PNG({ width: a.width, height: a.height });
          const n = pixelmatch(a.data, b.data, out.data, a.width, a.height, { threshold: 0.1, alpha: 0.2 });
          const db = PNG.sync.write(out);
          writeFileSync(join(OUT, "shots", `${id}-${theme}-${name}-diff.png`), db);
          row.ref.push(rb);
          row.diff.push(db);
          diffs.push(`| ${id} | ${theme} | ${name} | ${((100 * n) / (a.width * a.height)).toFixed(2)} % |`);
        }
        if (!ref) continue;
        const grid = await chrome.compose({
          w: 696,
          h: 435,
          pad: 28,
          columns: VIEWS.map((v) => v[0]),
          rows: [{ label: "reference", cells: row.ref }, { label: "now", cells: row.now }, { label: "pixels differing", cells: row.diff }],
        });
        writeFileSync(join(OUT, `grid-${id}-${theme}.png`), grid);
        console.log(`grid ${id} ${theme}`);
      }
    if (ref) {
      writeFileSync(join(OUT, "diffs.md"), diffs.join("\n") + "\n");
      console.log(diffs.join("\n"));
    }
  }

  if (has("lose"))
    for (const id of ids) {
      const before = PNG.sync.read(three ? await (chrome as Awaited<ReturnType<typeof openChrome3>>).shot(id, stage3({})) : await (chrome as Awaited<ReturnType<typeof openChrome>>).shot(id, stageShot(id, { dpr })));
      const after = PNG.sync.read(three ? await (chrome as Awaited<ReturnType<typeof openChrome3>>).lose(id, stage3({})) : await (chrome as Awaited<ReturnType<typeof openChrome>>).lose(id, stageShot(id, { dpr })));
      const n = pixelmatch(before.data, after.data, null, before.width, before.height, { threshold: 0.1 });
      console.log(`${id}: redrawn after a lost context, ${n} pixels differ`);
      if (n > before.width * before.height * 0.001) throw new Error(`compare: ${id} differs after a lost context`);
    }

  if (has("cards")) {
    const dials = arg("dials", "full,A,B,C,D").split(",");
    const label = (d: string) => (d === "full" ? "full detail" : d === "A" ? "drops A" : `drops A-${d}`);
    const rows: { label: string; cells: Buffer[] }[] = [];
    for (const id of ids)
      for (const theme of THEMES) {
        const cells: Buffer[] = [];
        for (const d of dials) {
          const buf = three
            ? await (chrome as Awaited<ReturnType<typeof openChrome3>>).shot(id, { w: THUMB.w, h: THUMB.h, dpr: THUMB.dpr, u: THUMB.u, card: true, theme, view: "record", detail: d as never })
            : await (chrome as Awaited<ReturnType<typeof openChrome>>).shot(id, { w: THUMB.w, h: THUMB.h, dpr: THUMB.dpr, u: THUMB.u, card: true, view: { tilt: THUMB.tilt, theme, sheet: null, dims: false, overlays: { paths: true }, detail: d as never } });
          writeFileSync(join(OUT, "shots", `card-${id}-${theme}-${d}.png`), buf);
          cells.push(buf);
        }
        rows.push({ label: `${id}, ${theme}`, cells });
      }
    writeFileSync(join(OUT, "cards.png"), await chrome.compose({ w: 640, h: 480, pad: 30, columns: dials.map(label), rows }));
    console.log("cards written");
  }
} finally {
  await chrome.close();
}
