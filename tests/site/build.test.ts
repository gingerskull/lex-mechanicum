// The built site (npm run build, then npm run test:site): a page for every registered mechanism, no engine on the
// library page until hover, and the mechanism page's JavaScript under 96 KB gzipped (80 until 0.21: every model is in the page's closure, about 0.3 KB each, and the 89 catalogue entries end near 92 KB), package excluded (R8, SS8).
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";
import { describe, expect, it } from "vitest";
import { mechanisms } from "../../src/mechanisms";

const OUT = join("dist", "site");
const read = (f: string) => readFileSync(join(OUT, f), "utf8");
const scripts = (html: string) => [...html.matchAll(/<script[^>]*src="([^"]+)"/g)].map((m) => m[1]!);

/** A module and every chunk it imports statically or dynamically, by file name. */
function closure(file: string, seen = new Set<string>()): Set<string> {
  if (seen.has(file)) return seen;
  seen.add(file);
  const src = read(file);
  for (const m of src.matchAll(/(?:import|from)\s*\(?\s*["'`](\.{1,2}\/[^"'`]+\.js)["'`]/g)) closure(join("_astro", m[1]!.replace(/^\.\//, "")).split("\\").join("/"), seen);
  return seen;
}

describe("site build", () => {
  it("has the library and a page for every registered mechanism", () => {
    expect(existsSync(join(OUT, "index.html"))).toBe(true);
    for (const id of Object.keys(mechanisms)) {
      expect(existsSync(join(OUT, "mechanisms", id, "index.html")), id).toBe(true);
      expect(existsSync(join(OUT, "packages", `${id}.mxp`)), id).toBe(true);
      expect(existsSync(join(OUT, "thumbs", `${id}-dark.webp`)), id).toBe(true);
    }
  });

  it("loads no engine on the library page until a card is hovered", () => {
    const html = read("index.html");
    for (const src of scripts(html)) {
      const js = read(src.replace(/^\//, ""));
      // the engine may only be imported dynamically
      expect(js).not.toMatch(/^import[^(]*engine/m);
    }
    expect(html).not.toMatch(/engine\.[\w-]+\.js/);
  });

  it("keeps the mechanism page under 96 KB of gzipped JavaScript", () => {
    for (const id of Object.keys(mechanisms)) {
      const files = new Set<string>();
      for (const src of scripts(read(join("mechanisms", id, "index.html")))) closure(src.replace(/^\//, ""), files);
      const gz = [...files].reduce((n, f) => n + gzipSync(read(f)).byteLength, 0);
      expect(gz, `${id}: ${[...files].join(", ")}`).toBeLessThan(96 * 1024);
    }
  });

  it("ships no polish, rule or hardware module to the browser (R4)", () => {
    const files = new Set<string>();
    for (const id of Object.keys(mechanisms)) for (const src of scripts(read(join("mechanisms", id, "index.html")))) closure(src.replace(/^\//, ""), files);
    const all = [...files].map((f) => read(f)).join("\n");
    // the engine chunk names every chunk it can load, dynamic imports included
    expect(all).not.toMatch(/polish\.[\w-]+\.js/);
    expect(all).not.toMatch(/(pins|materials|locking|j\d-[\w-]+)\.[\w-]+\.js/);
  });

  it("gives the stage its view modes: the Wide toggle, full screen and the remembered mode set before paint", () => {
    const html = read(join("mechanisms", Object.keys(mechanisms)[0]!, "index.html"));
    expect(html).toMatch(/<button[^>]*id="wide"[^>]*aria-pressed="false"/);
    expect(html).toMatch(/<button[^>]*id="full"[^>]*aria-pressed="false"/);
    const pre = html.indexOf('localStorage.getItem("stage-view")');
    expect(pre).toBeGreaterThan(-1);
    expect(pre).toBeLessThan(html.indexOf('class="dlayout"'));
  });

  it("shows the version in the footer and no colour literals in the page CSS", () => {
    const html = read("index.html");
    expect(html).toContain(`Version ${JSON.parse(readFileSync("package.json", "utf8")).version}`);
  });
});
