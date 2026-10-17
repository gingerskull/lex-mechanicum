// npx tsx tools/thumbs.ts [id ...]: pre-renders the library thumbnails (standard R8, style SS1): dist/thumbs/<id>-<theme>.png,
// 4:3 at DPR 2, phase 1.1, tilt 28, no sheet, the traced path only. The cards show these until hovered.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { mechanisms } from "../src/mechanisms";
import type { ThemeKey } from "../src/style/tokens";
import { shot } from "./shot";

export const THUMB = { w: 320, h: 240, dpr: 2, u: 1.1, tilt: 28 };

export async function thumbs(ids = Object.keys(mechanisms), out = "dist/thumbs"): Promise<string[]> {
  mkdirSync(out, { recursive: true });
  const files: string[] = [];
  for (const id of ids)
    for (const theme of ["dark", "light"] as ThemeKey[]) {
      const png = await shot(id, { w: THUMB.w, h: THUMB.h, dpr: THUMB.dpr, u: THUMB.u, view: { tilt: THUMB.tilt, theme, sheet: null, dims: false, overlays: { paths: true } } });
      const f = join(out, `${id}-${theme}.png`);
      writeFileSync(f, png);
      files.push(f);
    }
  return files;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const ids = process.argv.slice(2);
  for (const f of await thumbs(ids.length ? ids : undefined)) console.log(`wrote ${f}`);
}
