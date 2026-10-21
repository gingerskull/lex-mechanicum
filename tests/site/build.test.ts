// The built site (npm run build, then npm run test:site): a page for every registered mechanism, no engine on the
// library page until hover, and the JavaScript a mechanism page loads under 96 KB gzipped: its scripts, everything they
// import (the engine included), and its own model, package excluded (R8, SS8). Other mechanisms' model chunks are
// imported dynamically and never fetched by that page, so they are not counted; each stays under 4 KB instead.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";
import { describe, expect, it } from "vitest";
import { mechanisms } from "../../src/mechanisms";
import { allIds } from "../../src/checks/engine";

const OUT = join("dist", "site");
const read = (f: string) => readFileSync(join(OUT, f), "utf8");
const scripts = (html: string) => [...html.matchAll(/<script[^>]*src="([^"]+)"/g)].map((m) => m[1]!);

/** A module and every chunk it imports statically or dynamically, by file name; `skip` leaves chunks out. */
function closure(file: string, seen = new Set<string>(), skip: (f: string) => boolean = () => false): Set<string> {
  if (seen.has(file)) return seen;
  seen.add(file);
  const src = read(file);
  for (const m of src.matchAll(/(?:import|from)\s*\(?\s*["'`](\.{1,2}\/[^"'`]+\.js)["'`]/g)) {
    const f = join("_astro", m[1]!.replace(/^\.\//, "")).split("\\").join("/");
    if (!skip(f)) closure(f, seen, skip);
  }
  // a module worker the page starts (the v3 stage's setup) is part of what the page loads
  for (const m of src.matchAll(/new URL\(\s*[`"'][^`"']*?(_astro\/[^`"']+\.js)[`"']/g)) if (!skip(m[1]!)) closure(m[1]!, seen, skip);
  return seen;
}

/** A mechanism's model chunks: every lazily loaded model module. */
const isModel = (f: string) => /(^|\/)model\.[\w-]+\.js$/.test(f);

/** Every mechanism page in the build. */
const pages = (): string[] => readdirSync(join(OUT, "mechanisms"));

describe("site build", () => {
  it("has the library and a page for every registered mechanism", () => {
    expect(existsSync(join(OUT, "index.html"))).toBe(true);
    for (const id of allIds()) {
      expect(existsSync(join(OUT, "mechanisms", id, "index.html")), id).toBe(true);
      // a mechanism on the v3 engine ships package v2 only
      expect(existsSync(join(OUT, "packages", `${id}.mxp`)) || existsSync(join(OUT, "packages", `${id}.mx2`)), id).toBe(true);
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

  it("keeps the JavaScript a mechanism page loads under 96 KB gzipped, and every model chunk under 4 KB", () => {
    const models = new Set<string>();
    for (const id of pages()) for (const src of scripts(read(join("mechanisms", id, "index.html")))) for (const f of closure(src.replace(/^\//, ""))) if (isModel(f)) models.add(f);
    for (const f of models) expect(gzipSync(read(f)).byteLength, f).toBeLessThan(4 * 1024);
    for (const id of pages()) {
      const files = new Set<string>();
      for (const src of scripts(read(join("mechanisms", id, "index.html")))) closure(src.replace(/^\//, ""), files, isModel);
      // the page's own model: the model chunk that defines its id (a mechanism on engine v3 has none)
      const q = "[\"'`]";
      const own = [...models].filter((f) => new RegExp(`id:\\s*${q}${id}${q}`).test(read(f)));
      if (id in mechanisms) expect(own.length, `${id}: its model chunk`).toBeGreaterThan(0);
      for (const f of own) closure(f, files);
      const gz = [...files].reduce((n, f) => n + gzipSync(read(f)).byteLength, 0);
      expect(gz, `${id}: ${[...files].join(", ")}`).toBeLessThan(96 * 1024);
    }
  });

  it("counts the setup worker in a v3 page's JavaScript", () => {
    const v3 = pages().filter((id) => read(join("mechanisms", id, "index.html")).includes('data-engine="v3"'));
    for (const id of v3) {
      const files = new Set<string>();
      for (const src of scripts(read(join("mechanisms", id, "index.html")))) closure(src.replace(/^\//, ""), files, isModel);
      expect([...files].some((f) => /edges-worker/.test(f)), id).toBe(true);
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

  it("gives the library bar a clear (x) on the search and the set's name for its stuck state (SS3)", () => {
    const html = read("index.html");
    expect(html).toMatch(/<button[^>]*id="qclear"[^>]*hidden/);
    expect(html).toMatch(/id="libbar"/);
    expect(html).toMatch(new RegExp(`class="settitle"[^>]*>Mechanism Library <span>${allIds().length}</span>`));
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
