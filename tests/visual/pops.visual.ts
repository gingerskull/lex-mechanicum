// No pop-ins (style SQ12), local only: `npm run test:visual`. Each pilot is scrubbed through its cycle with the camera
// still, and orbited through a range of yaw clear of the axis-aligned views (where many walls turn edge-on at once, a
// real event of the geometry). The frames are measured tile by tile for a change smooth motion cannot explain
// (tests/visual/pops.ts), and the count of such spikes may not rise above what the finished renderer shows, recorded in
// pops.allow.json: a pop-in that comes back (an effect switching on a threshold, a label jumping, a see-through solid
// flipping in one frame) adds spikes and fails. The allowance is set once, when the look is final, with
// `UPDATE_POPS=1 npm run test:visual`, never to make a run pass.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { openChrome3, type Chrome3, type Draw3Options } from "../../tools/chrome3";
import { luma, tileBends, tileSpikes } from "./pops";

const PILOTS = ["four-bar", "bevel-gears", "oscillating-cylinder", "universal-joint"];
const ALLOW = join(import.meta.dirname, "pops.allow.json");
const N_SCRUB = 360;
const ORBIT: [number, number, number] = [10, 80, 0.5]; // degrees: from, to, step
const base: Draw3Options = { w: 640, h: 400, dpr: 1, u: 1.1, theme: "dark", over: { sheet: false, dims: false } };

const allow: Record<string, number> = existsSync(ALLOW) ? (JSON.parse(readFileSync(ALLOW, "utf8")) as Record<string, number>) : {};
const found: Record<string, number> = {};

describe("no pop-ins", () => {
  let chrome: Chrome3;
  beforeAll(async () => {
    chrome = await openChrome3();
  }, 120_000);
  afterAll(async () => {
    await chrome?.close();
    if (process.env.UPDATE_POPS || !existsSync(ALLOW)) writeFileSync(ALLOW, JSON.stringify({ ...allow, ...found }, null, 2) + "\n");
  });

  const sequences: [string, (k: number) => Partial<Draw3Options>, number][] = [
    ["scrub", (k) => ({ view: "VIEW 30 62", u: (k / N_SCRUB) * Math.PI * 2 }), N_SCRUB + 1],
    ["orbit", (k) => ({ view: `VIEW ${ORBIT[0] + k * ORBIT[2]} 62` }), Math.round((ORBIT[1] - ORBIT[0]) / ORBIT[2]) + 1],
  ];
  for (const id of PILOTS)
    for (const [name, at, n] of sequences)
      it(`${id} ${name}`, { timeout: 600_000 }, async () => {
        const frames: Float32Array[] = [];
        let w = 0, h = 0;
        for (let k = 0; k < n; k++) {
          const l = luma(await chrome.shot(id, { ...base, ...at(k) }));
          frames.push(l.v);
          w = l.w;
          h = l.h;
        }
        const spikes = tileSpikes(tileBends(frames, w, h));
        const key = `${id} ${name}`;
        found[key] = spikes.length;
        if (process.env.UPDATE_POPS || allow[key] === undefined) return;
        expect(spikes.length, `${key}: worst ${JSON.stringify(spikes.slice(0, 3))}`).toBeLessThanOrEqual(allow[key]!);
      });
});
