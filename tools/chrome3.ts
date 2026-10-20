// Local Chrome for the 3D renderer's tools: bundles the drawing page (tools/draw3-page), serves it with the Plex faces,
// the v2 packages built from the current code and the records' teaching and kin blocks, and opens it in headless Chrome on
// the real GPU with the frame-rate cap off. Nothing draws in Node. Uses the installed Chrome (playwright-core).
import { createServer, type Server } from "node:http";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
import { chromium, type Browser, type Page } from "playwright-core";
import { recordById } from "../src/catalog";
import { ghostTeaching } from "../tests/fixtures/ghost3";
import { buildPackage2 } from "../src/package/build2";
import { encode2 } from "../src/package/format2";
import type { Bench3, Draw3Options, Draw3Page, ImageOut, Meta } from "./draw3-page/main";
import { FONT_FILES } from "./tokens-css";

export type { Bench3, Draw3Options, ImageOut } from "./draw3-page/main";

const root = fileURLToPath(new URL("..", import.meta.url));
const require = createRequire(import.meta.url);
const ARGS = ["--enable-gpu", "--use-angle=d3d11", "--ignore-gpu-blocklist", "--enable-gpu-rasterization", "--disable-gpu-vsync", "--disable-frame-rate-limit"];

const fontPath = (file: string) => {
  const f = FONT_FILES.find((x) => x.file === file);
  return f && join(dirname(require.resolve(`@fontsource/${f.slug}/package.json`)), "files", `${f.slug}-latin-${f.weight}-normal.woff2`);
};

const html = () => {
  const faces = FONT_FILES.map((f) => `@font-face{font-family:"${f.family}";font-weight:${f.weight};font-style:normal;src:url("fonts/${f.file}") format("woff2")}`).join("");
  return `<!doctype html><meta charset="utf-8"><title>loading</title><link rel="icon" href="data:,"><style>${faces}</style><body style="margin:0;background:#888"><script type="module" src="./main.js"></script>\n`;
};

async function bundle(): Promise<string> {
  const r = await build({ entryPoints: [join(root, "tools/draw3-page/main.ts")], bundle: true, format: "esm", platform: "browser", target: "es2022", write: false, logLevel: "warning" });
  return r.outputFiles[0]!.text;
}

function serve(js: string): Promise<{ server: Server; port: number }> {
  const packages = new Map<string, Promise<Uint8Array>>();
  const server = createServer((q, r) => {
    const p = decodeURIComponent(new URL(q.url ?? "/", "http://x").pathname);
    const send = (type: string, body: string | Uint8Array) => {
      r.writeHead(200, { "content-type": type });
      r.end(body);
    };
    const fail = (code: number, e?: unknown) => {
      if (e) console.error(`chrome3: ${p}: ${String(e)}`);
      r.writeHead(code);
      r.end();
    };
    if (p === "/") return send("text/html", html());
    if (p === "/main.js") return send("text/javascript", js);
    const font = p.startsWith("/fonts/") && fontPath(p.slice(7));
    if (font) return send("font/woff2", readFileSync(font));
    const m = /^\/packages\/([a-z0-9-]+)\.mx2$/.exec(p);
    if (m) {
      const id = m[1]!;
      // fixture scenes (tests/fixtures/scene3.ts) are packed like mechanisms
      const built = () => (id.startsWith("fx3-") ? import("../tests/fixtures/scene3").then((m) => encode2(m.pkg3(m.fixtures3[id]!).pkg)) : buildPackage2(id).then((b) => encode2(b.pkg)));
      if (!packages.has(id)) packages.set(id, built());
      packages.get(id)!.then((b) => send("application/octet-stream", b), (e: unknown) => fail(500, e));
      return;
    }
    const meta = /^\/meta\/([a-z0-9-]+)\.json$/.exec(p);
    if (meta) {
      if (meta[1]!.startsWith("fx3-")) return send("application/json", JSON.stringify({ name: "Fixture", teaching: meta[1] === "fx3-ghost" ? ghostTeaching : null, kin: null } satisfies Meta));
      const rec = recordById(meta[1]!) as unknown as { name?: string; kin?: Meta["kin"]; teaching?: Meta["teaching"] } | undefined;
      if (!rec) return fail(404);
      return send("application/json", JSON.stringify({ name: rec.name ?? meta[1]!, teaching: rec.teaching ?? null, kin: rec.kin ?? null } satisfies Meta));
    }
    fail(404);
  });
  return new Promise((ok) => server.listen(0, "127.0.0.1", () => ok({ server, port: (server.address() as { port: number }).port })));
}

export interface Chrome3 {
  gpu: string;
  page: Page;
  shot(id: string, o: Draw3Options, out?: ImageOut): Promise<Buffer>;
  lose(id: string, o: Draw3Options): Promise<Buffer>;
  bench(id: string, o: { w: number; h: number; dpr: number; frames: number; views: Record<string, Partial<Draw3Options>> }): Promise<Bench3>;
  /** Ids of the solids drawn see-through in the view (T10). */
  seeThrough(id: string, o: Draw3Options): Promise<string[]>;
  close(): Promise<void>;
}

const fromUrl = (u: string) => Buffer.from(u.slice(u.indexOf(",") + 1), "base64");

/** Opens the 3D drawing page in local Chrome. Close it when done. */
export async function openChrome3(): Promise<Chrome3> {
  const { server, port } = await serve(await bundle());
  let browser: Browser;
  try {
    browser = await chromium.launch({ channel: "chrome", headless: true, args: ARGS });
  } catch (e) {
    server.close();
    throw new Error("chrome3: local Chrome would not start (drawing needs Google Chrome installed)", { cause: e });
  }
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 }, deviceScaleFactor: 1 });
  page.on("console", (m) => m.type() === "error" && console.error(`page: ${m.text()}`));
  page.on("pageerror", (e) => console.error(`page: ${e.message}`));
  await page.goto(`http://127.0.0.1:${port}/`);
  await page.waitForFunction(() => document.title !== "loading", null, { timeout: 60_000 });
  const title = await page.title();
  if (title !== "ready") throw new Error(`chrome3: the drawing page did not load: ${title}`);
  type W = { draw3: Draw3Page };
  const gpu = await page.evaluate(() => (window as unknown as W).draw3.gpu());
  if (gpu === "no WebGL2") throw new Error("chrome3: no WebGL2 in headless Chrome (GPU blocked?)");
  return {
    gpu,
    page,
    shot: async (id, o, out = {}) => fromUrl(await page.evaluate(([i, oo, x]) => (window as unknown as W).draw3.shot(i, oo, x), [id, o, out] as const)),
    lose: async (id, o) => fromUrl(await page.evaluate(([i, oo]) => (window as unknown as W).draw3.lose(i, oo), [id, o] as const)),
    bench: (id, o) => page.evaluate(([i, oo]) => (window as unknown as W).draw3.bench(i, oo), [id, o] as const),
    seeThrough: (id, o) => page.evaluate(([i, oo]) => (window as unknown as W).draw3.seeThrough(i, oo), [id, o] as const),
    close: async () => {
      await browser.close();
      server.close();
    },
  };
}
