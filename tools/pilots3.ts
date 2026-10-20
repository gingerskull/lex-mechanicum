// npx tsx tools/pilots3.ts [out-dir]: the 3D renderer's acceptance shots (issue #209) in local Chrome: the pilots at plan
// and 28 degrees on both sheets, the record's own views, the oscillating cylinder's section, the phantom and ghost traces
// of Watt and Walschaerts, and a full explode. Written as PNGs to dist/shots3 by default.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { openChrome3, type Draw3Options } from "./chrome3";
import { stage3 } from "./shot3";

const out = process.argv[2] ?? join("dist", "shots3");
mkdirSync(out, { recursive: true });
const chrome = await openChrome3();
const save = async (name: string, id: string, o: Partial<Draw3Options>) => {
  writeFileSync(join(out, `${name}.png`), await chrome.shot(id, stage3(o)));
  console.log(`wrote ${name}`);
};
try {
  // the look match (SQ2): plan and 28 degrees, both sheets
  for (const id of ["four-bar", "bevel-gears", "oscillating-cylinder"])
    for (const theme of ["dark", "light"] as const) {
      await save(`${id}-plan-${theme}`, id, { view: "PLAN", theme });
      await save(`${id}-28-${theme}`, id, { view: "VIEW 0 62", theme });
    }
  for (const id of ["four-bar", "bevel-gears", "oscillating-cylinder", "watt-linkage", "walschaerts-valve-gear"]) await save(`${id}-record`, id, {});
  await save("oscillating-cylinder-section", "oscillating-cylinder", { view: "port-face", sectionShift: [0, 0, 14.2] });
  await save("oscillating-cylinder-section-light", "oscillating-cylinder", { view: "port-face", theme: "light", sectionShift: [0, 0, 14.2] });
  await save("watt-linkage-ghost", "watt-linkage", { view: "PLAN" });
  await save("walschaerts-ghost", "walschaerts-valve-gear", { view: "PLAN" });
  await save("four-bar-explode", "four-bar", { view: "ISOMETRIC", explode: 1 });
  await save("bevel-gears-explode", "bevel-gears", { view: "ISOMETRIC", explode: 1 });
  await save("four-bar-side", "four-bar", { view: "SIDE" });
  await save("four-bar-front", "four-bar", { view: "FRONT" });
  await save("four-bar-dimetric", "four-bar", { view: "DIMETRIC" });
  await save("four-bar-aux", "four-bar", { view: "AUX A" });
} finally {
  await chrome.close();
}
