// Builds the bench page as a static folder and runs it in local Chrome (tools/bench.ts).
import { copyFileSync, mkdirSync, writeFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
import { chromium } from "playwright-core";
import { recordById } from "../../src/catalog";
import { buildPackage } from "../../src/package/build";
import { encode2 } from "../../src/package/format2";
import { FONT_FILES } from "../tokens-css";

const root = fileURLToPath(new URL("../..", import.meta.url));
const require = createRequire(import.meta.url);

/** The pilots the phone page offers when no ids are given. */
export const PAGE_IDS = ["four-bar", "spur-gears", "bevel-gears"];

const html = (ids: string[], v: number) => {
  const faces = FONT_FILES.map((f) => `@font-face{font-family:"${f.family}";font-weight:${f.weight};font-style:normal;src:url("fonts/${f.file}") format("woff2")}`).join("");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>loading</title><link rel="icon" href="data:,"><style>${faces}
body{font:15px/1.4 system-ui,sans-serif;margin:12px;max-width:1400px}fieldset{border:1px solid #888;margin:8px 0}label{margin-right:12px;white-space:nowrap}
button{font:inherit;padding:8px 16px}pre{white-space:pre-wrap;word-break:break-word;font:12px/1.35 ui-monospace,monospace;background:#8881;padding:8px;overflow-x:auto}</style></head>
<body data-ids="${ids.join(",")}" data-v="${v}"><div id="app"></div><script type="module" src="./main.js?v=${v}"></script></body></html>
`;
};

/** Builds the page folder: scripts, fonts, and the packages and record blocks of `ids`. Returns the folder. */
export async function buildPage(out: string, ids: string[]): Promise<string> {
  mkdirSync(join(out, "packages"), { recursive: true });
  mkdirSync(join(out, "fonts"), { recursive: true });
  mkdirSync(join(out, "meta"), { recursive: true });
  await build({
    entryPoints: { main: join(root, "tools/bench-page/main.ts"), "setup-worker": join(root, "src/solids/edges-worker.ts") },
    bundle: true,
    splitting: true,
    format: "esm",
    platform: "browser",
    target: "es2022",
    outdir: out,
    minify: true,
    logLevel: "warning",
  });
  for (const f of FONT_FILES) copyFileSync(join(dirname(require.resolve(`@fontsource/${f.slug}/package.json`)), "files", `${f.slug}-latin-${f.weight}-normal.woff2`), join(out, "fonts", f.file));
  for (const id of ids) {
    const b = await buildPackage(id);
    writeFileSync(join(out, "packages", `${id}.mx2`), await encode2(b.pkg));
    const rec = recordById(id) as unknown as { name?: string; kin?: unknown; teaching?: unknown } | undefined;
    writeFileSync(join(out, "meta", `${id}.json`), JSON.stringify({ name: rec?.name ?? id, teaching: rec?.teaching ?? null, kin: rec?.kin ?? null }));
  }
  writeFileSync(join(out, "index.html"), html(ids, Date.now()));
  return out;
}

/** Runs the page in local Chrome on the real GPU; returns the GPU's name, the report as Markdown, and the raw report. */
export async function runPage(dir: string, o: Record<string, unknown>): Promise<{ gpu: string; md: string; json: unknown }> {
  const types: Record<string, string> = { ".html": "text/html", ".js": "text/javascript", ".woff2": "font/woff2", ".json": "application/json" };
  const server = createServer((q, r) => {
    const u = decodeURIComponent(new URL(q.url ?? "/", "http://x").pathname);
    const p = u === "/" ? "/index.html" : u;
    readFile(join(dir, p)).then(
      (b) => {
        r.writeHead(200, { "content-type": types[p.slice(p.lastIndexOf("."))] ?? "application/octet-stream" });
        r.end(b);
      },
      () => {
        r.writeHead(404);
        r.end();
      },
    );
  });
  await new Promise<void>((ok) => server.listen(0, "127.0.0.1", ok));
  const port = (server.address() as { port: number }).port;
  const browser = await chromium.launch({
    channel: "chrome",
    headless: true,
    args: ["--enable-gpu", "--use-angle=d3d11", "--ignore-gpu-blocklist", "--enable-gpu-rasterization", "--disable-gpu-vsync", "--disable-frame-rate-limit"],
  });
  try {
    const page = await browser.newPage({ viewport: { width: 1400, height: 900 }, deviceScaleFactor: 1 });
    page.on("pageerror", (e) => console.error(`page: ${e.message}`));
    page.on("console", (m) => m.type() === "error" && console.error(`page: ${m.text()}`));
    await page.goto(`http://127.0.0.1:${port}/`);
    await page.waitForFunction(() => document.title === "ready", null, { timeout: 60_000 });
    type W = { bench3: (o: unknown, host: HTMLElement) => Promise<{ device: { gpu: string } }>; bench3md: (r: unknown) => string };
    const json = await page.evaluate((oo) => (window as unknown as W).bench3(oo, document.getElementById("stage")!), o);
    const md = await page.evaluate((j) => (window as unknown as W).bench3md(j), json);
    return { gpu: json.device.gpu, md, json };
  } finally {
    await browser.close();
    server.close();
  }
}
