// Local Chrome for every tool that draws: bundles the drawing page (tools/draw-page), serves it with the Plex faces and
// the packages (built on demand from the current code), and opens it in headless Chrome on the real GPU with the
// frame-rate cap off. Nothing draws in Node: `openChrome()` and the page's functions do it. Uses the installed Chrome
// (playwright-core, channel "chrome"); no browser download.
import { createServer, type Server } from "node:http";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
import { chromium, type Browser, type Page } from "playwright-core";
import { buildPackage } from "../src/package/build";
import { encode } from "../src/package/format";
import type { Dial } from "../src/render/detail";
import type { BenchResult, DrawOptions, DrawPage, ImageOut } from "./draw-page/main";
import { FONT_FILES } from "./tokens-css";

export type { BenchResult, DrawOptions, ImageOut } from "./draw-page/main";

const root = fileURLToPath(new URL("..", import.meta.url));
const require = createRequire(import.meta.url);

/** The real GPU in headless Chrome, and frames not held to the display's rate (so a frame costs what it costs). */
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
  const r = await build({ entryPoints: [join(root, "tools/draw-page/main.ts")], bundle: true, format: "esm", platform: "browser", target: "es2022", write: false, logLevel: "warning" });
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
      if (e) console.error(`chrome: ${p}: ${String(e)}`);
      r.writeHead(code);
      r.end();
    };
    if (p === "/") return send("text/html", html());
    if (p === "/main.js") return send("text/javascript", js);
    const font = p.startsWith("/fonts/") && fontPath(p.slice(7));
    if (font) return send("font/woff2", readFileSync(font));
    const m = /^\/packages\/([a-z0-9-]+)\.mxp$/.exec(p);
    if (m) {
      const id = m[1]!;
      if (!packages.has(id)) packages.set(id, buildPackage(id).then((b) => encode(b.pkg)));
      packages.get(id)!.then((b) => send("application/octet-stream", b), (e: unknown) => fail(500, e));
      return;
    }
    fail(404);
  });
  return new Promise((ok) => server.listen(0, "127.0.0.1", () => ok({ server, port: (server.address() as { port: number }).port })));
}

export interface Chrome {
  /** The GPU Chrome draws with. */
  gpu: string;
  page: Page;
  /** One frame as an image (PNG unless asked for WebP). */
  shot(id: string, o: DrawOptions, out?: ImageOut): Promise<Buffer>;
  /** One frame drawn, the GPU context lost and restored, and the frame drawn again. */
  lose(id: string, o: DrawOptions): Promise<Buffer>;
  bench(id: string, o: { w: number; h: number; dpr: number; frames: number; dials: Dial[] }): Promise<BenchResult>;
  /** Images laid out in labelled rows (PNG). */
  compose(g: { w: number; h: number; pad: number; columns: string[]; rows: { label: string; cells: (Buffer | null)[] }[] }): Promise<Buffer>;
  close(): Promise<void>;
}

const dataUrl = (b: Buffer) => `data:image/png;base64,${b.toString("base64")}`;
const fromUrl = (u: string) => Buffer.from(u.slice(u.indexOf(",") + 1), "base64");

/** Opens the drawing page in local Chrome. Close it when done. */
export async function openChrome(): Promise<Chrome> {
  const { server, port } = await serve(await bundle());
  let browser: Browser;
  try {
    browser = await chromium.launch({ channel: "chrome", headless: true, args: ARGS });
  } catch (e) {
    server.close();
    throw new Error("chrome: local Chrome would not start (drawing needs Google Chrome installed)", { cause: e });
  }
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 }, deviceScaleFactor: 1 });
  page.on("console", (m) => m.type() === "error" && console.error(`page: ${m.text()}`));
  page.on("pageerror", (e) => console.error(`page: ${e.message}`));
  await page.goto(`http://127.0.0.1:${port}/`);
  await page.waitForFunction(() => document.title !== "loading", null, { timeout: 60_000 });
  const title = await page.title();
  if (title !== "ready") throw new Error(`chrome: the drawing page did not load: ${title}`);
  type W = { draw: DrawPage };
  const gpu = await page.evaluate(() => (window as unknown as W).draw.gpu());
  if (gpu === "no WebGL2") throw new Error("chrome: no WebGL2 in headless Chrome (GPU blocked?)");
  return {
    gpu,
    page,
    shot: async (id, o, out = {}) => fromUrl(await page.evaluate(([i, oo, x]) => (window as unknown as W).draw.shot(i, oo, x), [id, o, out] as const)),
    lose: async (id, o) => fromUrl(await page.evaluate(([i, oo]) => (window as unknown as W).draw.lose(i, oo), [id, o] as const)),
    bench: (id, o) => page.evaluate(([i, oo]) => (window as unknown as W).draw.bench(i, oo), [id, o] as const),
    compose: async (g) => {
      const rows = g.rows.map((r) => ({ label: r.label, cells: r.cells.map((c) => (c ? dataUrl(c) : null)) }));
      return fromUrl(await page.evaluate((gg) => (window as unknown as W).draw.compose(gg), { ...g, rows }));
    },
    close: async () => {
      await browser.close();
      server.close();
    },
  };
}
