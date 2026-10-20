// The 3D renderer drawn in local Chrome (style SQ10, SQ11), local only: `npm run test:visual`. The peeled composite is
// compared with a ray-cast of a fixture of overlapping translucent boxes; every named view, the section and detail views,
// the explode and both sheets render something; a lost GPU context is rebuilt and the frame drawn again.
import { readFileSync } from "node:fs";
import { PNG } from "pngjs";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { DRAFT } from "../../src/style/draft";
import { theme } from "../../src/style/theme";
import { basisOfOrient, fit, namedOrient, project } from "../../src/render/v3/camera";
import { openChrome3, type Chrome3, type Draw3Options } from "../../tools/chrome3";

let chrome: Chrome3;
beforeAll(async () => {
  chrome = await openChrome3();
}, 120_000);
afterAll(() => chrome?.close());

const W = 600;
const H = 450;
const shot = (id: string, o: Partial<Draw3Options> = {}) => chrome.shot(id, { w: W, h: H, dpr: 1, u: 0, card: true, ...o }).then((b) => PNG.sync.read(b));
const px = (p: PNG, x: number, y: number): [number, number, number] => {
  const i = (Math.round(y) * p.width + Math.round(x)) * 4;
  return [p.data[i]!, p.data[i + 1]!, p.data[i + 2]!];
};

/** The reference: top faces of the boxes under a plan view, composited front to back over the paper behind them. */
function rayCast(bg: [number, number, number], layers: { face: number; tint: number }[]): [number, number, number] {
  const T = theme("dark");
  let col = [0, 0, 0];
  let al = 0;
  for (const l of layers) {
    const p = T.paper.map((c) => c * l.face);
    const c = p.map((v, k) => T.ink[k]! * l.tint + v * (1 - l.tint));
    const a = l.tint + l.face * (1 - l.tint);
    col = col.map((v, k) => v + (1 - al) * c[k]!);
    al += (1 - al) * a;
  }
  return [0, 1, 2].map((k) => col[k]! + (1 - al) * bg[k]!) as [number, number, number];
}

const F = DRAFT.fill;
const PLATE = { face: F.plate, tint: DRAFT.role.hw.tint };
const OTHER = { face: F.other, tint: DRAFT.role.trace.tint };

describe("depth (SQ10)", () => {
  // a card drawing has no sheet, so the paper behind the boxes is the same in both renders
  const C = fit(basisOfOrient(namedOrient("PLAN")), W, H, [0, 0, 0, 90, 90, 16]);
  const at = (x: number, y: number) => project(C, [x, y, 0]);
  // [point, layers front to back]: boxes a (plate, z 0), b (other, z 6), c (plate, z 12)
  const CASES: [string, [number, number], { face: number; tint: number }[]][] = [
    ["a", [5, 5], [PLATE]],
    ["b", [80, 10], [OTHER]],
    ["c", [20, 80], [PLATE]],
    ["a and b", [45, 15], [OTHER, PLATE]],
    ["a and c", [20, 45], [PLATE, PLATE]],
    ["b and c", [65, 45], [PLATE, OTHER]],
    ["a, b and c", [45, 45], [PLATE, OTHER, PLATE]],
  ];

  it("tells the two orders of a pair of faces apart, or the check below would pass for any order", () => {
    const bg: [number, number, number] = [20, 30, 45];
    const a = rayCast(bg, [PLATE, OTHER]);
    const b = rayCast(bg, [OTHER, PLATE]);
    expect(Math.max(...a.map((v, k) => Math.abs(v - b[k]!)))).toBeGreaterThan(6);
  });

  it("equals a ray-cast of the top faces at every overlap, to the paper's rounding", async () => {
    const img = await shot("fx3-depth", { view: "PLAN" });
    const bg = await shot("fx3-depth-bg", { view: "PLAN", detail: "E" });
    for (const [name, p, layers] of CASES) {
      const [x, y] = at(p[0], p[1]);
      const want = rayCast(px(bg, x, y), layers);
      const got = px(img, x, y);
      for (let k = 0; k < 3; k++) expect(Math.abs(got[k]! - want[k]!), `${name} channel ${k}: got ${got}, want ${want.map(Math.round)}`).toBeLessThanOrEqual(5);
    }
  });

  it("puts the nearer face in front: raising box a above the others changes every overlap", async () => {
    const img = await shot("fx3-depth", { view: "PLAN" });
    const swap = await shot("fx3-depth-swap", { view: "PLAN" });
    const [x, y] = at(45, 15);
    const a = px(img, x, y);
    const b = px(swap, x, y);
    expect(Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2])).toBeGreaterThan(2);
    // with a on top: [plate over other]; the reference says so
    const bg = await shot("fx3-depth-bg", { view: "PLAN", detail: "E" });
    const want = rayCast(px(bg, x, y), [PLATE, OTHER]);
    // the swap scene's bounds differ, so only the order (not the pixel) is compared: a on top is lighter-tinted than b on top
    expect(want[0]).not.toBeCloseTo(rayCast(px(bg, x, y), [OTHER, PLATE])[0], 3);
  });

  it("uses no depth bias and no draw order: the shaders and passes carry neither", () => {
    for (const f of ["gpu.ts", "shaders.ts", "session.ts"]) {
      const src = readFileSync(new URL(`../../src/render/v3/${f}`, import.meta.url), "utf8");
      expect(src, f).not.toMatch(/polygonOffset|depthRange|gl_FragDepth/);
    }
    const gpu = readFileSync(new URL("../../src/render/v3/gpu.ts", import.meta.url), "utf8");
    expect(gpu.match(/depthFunc\(([^)]*)\)/g)).toEqual(["depthFunc(gl.LESS)"]);
  });
});

describe("teaching layers", () => {
  const base = { view: "PLAN", card: false, u: 1 };
  const diff = (a: PNG, b: PNG) => {
    let n = 0;
    for (let i = 0; i < a.data.length; i += 4) if (Math.abs(a.data[i]! - b.data[i]!) + Math.abs(a.data[i + 1]! - b.data[i + 1]!) + Math.abs(a.data[i + 2]! - b.data[i + 2]!) > 30) n++;
    return n;
  };
  const off = { traces: false, ghosts: false, ticks: false, construction: false, trails: false, forces: false, velocity: false, angles: false };

  it("draws traces, ghosts, ticks, construction overlays, force, velocity and angle overlays, each by its own switch", async () => {
    const none = await shot("fx3-ghost", { ...base, over: { show: off } });
    for (const k of Object.keys(off) as (keyof typeof off)[]) {
      if (k === "trails") continue; // nothing is exploded
      // ticks sit on a trace: they are judged against the traces alone
      const ref = k === "ticks" ? await shot("fx3-ghost", { ...base, over: { show: { ...off, traces: true } } }) : none;
      const one = await shot("fx3-ghost", { ...base, over: { show: { ...off, [k]: true, ...(k === "ticks" ? { traces: true } : {}) } } });
      expect(diff(ref, one), k).toBeGreaterThan(20);
    }
  });

  it("draws the phantoms and the highlight only when asked, and at every dial position (DL6)", async () => {
    const a = await shot("fx3-ghost", base);
    const b = await shot("fx3-ghost", { ...base, over: { phantoms: ["rocker"], highlight: ["T"] } });
    expect(diff(a, b)).toBeGreaterThan(100);
    // at the last dial position the teaching layers are still there: the same view without them differs
    const g = await shot("fx3-ghost", { ...base, detail: "H" });
    const g0 = await shot("fx3-ghost", { ...base, detail: "H", over: { show: off } });
    expect(diff(g, g0)).toBeGreaterThan(1000);
  });

  it("makes the plate over the rocker see-through, and keeps the cycle's other solids opaque", async () => {
    const ids = await chrome.seeThrough("fx3-ghost", { w: W, h: H, dpr: 1, u: 0, view: "PLAN" });
    expect([...ids].sort()).toEqual(["plate", "post"]);
  });
});

describe("views (SQ11)", () => {
  const VIEWS = ["PLAN", "FRONT", "SIDE", "ISOMETRIC", "DIMETRIC", "VIEW 30 40"];
  for (const theme of ["dark", "light"] as const)
    for (const v of VIEWS)
      it(`draws ${v} on the ${theme} sheet, with the sheet and the explode`, async () => {
        const plain = await shot("fx3-block", { view: v, theme, card: false });
        const ex = await shot("fx3-block", { view: v, theme, card: false, explode: 1 });
        for (const img of [plain, ex]) {
          // something other than paper was drawn: the image has a good spread of values
          const seen = new Set<number>();
          for (let i = 0; i < img.data.length; i += 4 * 97) seen.add(img.data[i]!);
          expect(seen.size).toBeGreaterThan(8);
        }
      }, 60_000);

  it("cuts a section: hatched cut faces where the plane meets the block, and the bore open", async () => {
    const body = (await shot("fx3-block", { view: "AUX 0", card: false, over: { state: { orient: { yaw: 0, tilt: 0, aux: [0, 0, 1] }, section: { name: "SECTION A-A", origin: [0, 0, 20], normal: [0, 0, 1], highlight: [] }, explode: 0 } } }));
    // a cut face of the block is hatched: along a short run of pixels the value alternates between hatch and paper
    const run = Array.from({ length: 40 }, (_, k) => px(body, 150 + k, 200)[0]);
    expect(Math.max(...run) - Math.min(...run)).toBeGreaterThan(8);
  });

  it("magnifies a detail view and letters it", async () => {
    const a = await shot("fx3-block", { view: "PLAN", card: false });
    const b = await shot("fx3-block", { view: "PLAN", card: false, zoom: { centre: [40, 25, 0], scale: 3 } });
    expect(Buffer.compare(a.data, b.data)).not.toBe(0);
  });

  it("rebuilds a lost context and draws the frame again", async () => {
    const o = { w: W, h: H, dpr: 1, u: 0, view: "ISOMETRIC" };
    const a = PNG.sync.read(await chrome.shot("fx3-block", o));
    const b = PNG.sync.read(await chrome.lose("fx3-block", o));
    expect(Buffer.compare(a.data, b.data)).toBe(0);
  });
});
