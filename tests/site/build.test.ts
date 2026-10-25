// The built site (npm run build, then npm run test:site): a page for every registered mechanism, no engine on the
// library page until hover, and the JavaScript a mechanism page loads under 100 KB gzipped: its scripts and everything
// they import, the engine and the setup worker included, package excluded (R8, SS8).
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";
import { describe, expect, it } from "vitest";
import { allIds } from "../../src/mechanisms";
import { DEFAULT_ORDER, sortBy } from "../../site/src/sort";

const OUT = join("dist", "site");
const read = (f: string) => readFileSync(join(OUT, f), "utf8");
/** The site's own scripts on a page (GoatCounter's, from its own host, is not part of the build). */
const scripts = (html: string) => [...html.matchAll(/<script[^>]*src="([^"]+)"/g)].map((m) => m[1]!).filter((src) => !/^(https?:)?\/\//.test(src));

/** A module and every chunk it imports statically or dynamically, by file name. */
function closure(file: string, seen = new Set<string>()): Set<string> {
  if (seen.has(file)) return seen;
  seen.add(file);
  const src = read(file);
  for (const m of src.matchAll(/(?:import|from)\s*\(?\s*["'`](\.{1,2}\/[^"'`]+\.js)["'`]/g)) closure(join("_astro", m[1]!.replace(/^\.\//, "")).split("\\").join("/"), seen);
  // a module worker the page starts (the stage's setup) is part of what the page loads
  for (const m of src.matchAll(/new URL\(\s*[`"'][^`"']*?(_astro\/[^`"']+\.js)[`"']/g)) closure(m[1]!, seen);
  return seen;
}

/** Every mechanism page in the build. */
const pages = (): string[] => readdirSync(join(OUT, "mechanisms"));

describe("site build", () => {
  it("has the library and a page for every registered mechanism", () => {
    expect(existsSync(join(OUT, "index.html"))).toBe(true);
    for (const id of allIds()) {
      expect(existsSync(join(OUT, "mechanisms", id, "index.html")), id).toBe(true);
      expect(existsSync(join(OUT, "packages", `${id}.mx2`)), id).toBe(true);
      expect(existsSync(join(OUT, "meta", `${id}.json`)), id).toBe(true);
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

  it("keeps the JavaScript a mechanism page loads under 100 KB gzipped, the setup worker counted", () => {
    for (const id of pages()) {
      const files = new Set<string>();
      for (const src of scripts(read(join("mechanisms", id, "index.html")))) closure(src.replace(/^\//, ""), files);
      expect([...files].some((f) => /edges-worker/.test(f)), id).toBe(true);
      const gz = [...files].reduce((n, f) => n + gzipSync(read(f)).byteLength, 0);
      expect(gz, `${id}: ${[...files].join(", ")}`).toBeLessThan(100 * 1024);
    }
  });

  it("ships no polish, rule or hardware module to the browser (R4)", () => {
    const files = new Set<string>();
    for (const id of allIds()) for (const src of scripts(read(join("mechanisms", id, "index.html")))) closure(src.replace(/^\//, ""), files);
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

  it("puts Sort beside Filters, a menu of the orders with New checked, and the cards in the New order (SS3)", () => {
    const html = read("index.html");
    expect(html).toMatch(/<button[^>]*id="sbtn"[^>]*aria-haspopup="menu"[^>]*aria-expanded="false"/);
    expect(html.indexOf('id="ftoggle"')).toBeLessThan(html.indexOf('id="sbtn"'));
    expect(html).toMatch(/<div[^>]*id="sortmenu"[^>]*role="menu"[^>]*hidden/);
    expect([...html.matchAll(/role="menuitemradio"[^>]*aria-checked="true"[^>]*data-sort="(\w+)"/g)].map((m) => m[1])).toEqual(["new"]);
    const cards = [...html.matchAll(/<a class="card"[^>]*>/g)].map((m) => {
      const attr = (k: string) => new RegExp(`${k}="([^"]*)"`).exec(m[0])?.[1];
      return { id: attr("data-id")!, no: Number(attr("data-no")), name: "", added: attr("data-added") };
    });
    expect(cards.length).toBe(allIds().length);
    expect(cards.map((c) => c.id)).toEqual(sortBy(cards, DEFAULT_ORDER).map((c) => c.id));
  });

  it("has a 404 page for a missing address, with the way back to the library", () => {
    const html = read("404.html");
    expect(html).toContain("<h1>Sheet ST-404</h1>");
    expect(html).toContain("This sheet is not in the archive. Its pattern may be lost, or not yet recovered.");
    expect(html).toMatch(/<a class="btn" href="\/"/);
  });

  it("gives the stage its view modes: the Wide toggle, full screen and the remembered mode set before paint", () => {
    const html = read(join("mechanisms", allIds()[0]!, "index.html"));
    expect(html).toMatch(/<button[^>]*id="wide"[^>]*aria-pressed="false"/);
    expect(html).toMatch(/<button[^>]*id="full"[^>]*aria-pressed="false"/);
    const pre = html.indexOf('localStorage.getItem("stage-view")');
    expect(pre).toBeGreaterThan(-1);
    expect(pre).toBeLessThan(html.indexOf('class="dlayout"'));
  });

  it("draws the sheet switch as one cog in the sheet's ink, on the library and a mechanism page (SS7)", () => {
    for (const f of ["index.html", join("mechanisms", allIds()[0]!, "index.html")]) {
      const btns = [...read(f).matchAll(/<button[^>]*class="themebtn"[^>]*>([\s\S]*?)<\/button>/g)];
      expect(btns.length, f).toBeGreaterThan(0);
      for (const [, inner] of btns) {
        expect(inner!.match(/<svg/g), f).toHaveLength(1);
        expect(inner, f).toMatch(/<svg[^>]*viewBox="0 0 16 16"[^>]*fill="currentColor"/);
        // the ring and the half disc, as drawn
        expect(inner!.match(/<path/g), f).toHaveLength(2);
        expect(inner, f).toContain('d="M35.52,35.52v-16.35');
      }
    }
  });

  it("names the app, Lex Mechanicum, in the library's heading under the Mechanism Library kicker, the footer and every page's head", () => {
    const lib = read("index.html");
    expect(lib).toContain('<p class="kicker">Mechanism Library</p>');
    expect(lib).toMatch(new RegExp(`<h1>Lex Mechanicum <span>${allIds().length}</span></h1>`));
    for (const f of ["index.html", "404.html", join("mechanisms", allIds()[0]!, "index.html")]) {
      const html = read(f);
      expect(html, f).toContain('<meta name="application-name" content="Lex Mechanicum">');
      expect(html, f).toContain('<meta property="og:site_name" content="Lex Mechanicum">');
      expect(html, f).toContain("<span>Lex Mechanicum · drawn as built, kinematics solved exactly</span>");
      expect(html, f).not.toMatch(/mechanism[ -]database/i);
    }
  });

  it("numbers the sheets in set ST and finds a sheet by its number", () => {
    const lib = read("index.html");
    expect(lib).toContain("<div><i>Set</i><b>ST</b></div>");
    expect(lib).not.toMatch(/MX-\d/);
    const nos = [...lib.matchAll(/<span class="no">(ST-\d{2})<\/span>/g)].map((m) => m[1]);
    expect(nos).toHaveLength(allIds().length);
    for (const m of lib.matchAll(/<a class="card"[^>]*data-text="([^"]*)"/g)) expect(m[1]).toMatch(/^st-\d{2} /);
    const page = read(join("mechanisms", allIds()[0]!, "index.html"));
    expect(page).toMatch(/<div class="meta"><b>ST-\d{2}<\/b>/);
  });

  it("builds every Recovered badge hidden, with the sheet's added date for the browser to decide on", () => {
    const lib = read("index.html");
    const badges = [...lib.matchAll(/<span class="recovered" data-recovered="(\d{4}-\d{2}-\d{2})" hidden>Recovered<\/span>/g)];
    expect(badges).toHaveLength(allIds().length);
    for (const id of allIds()) expect(read(join("mechanisms", id, "index.html")), id).toMatch(/<span class="recovered" data-recovered="\d{4}-\d{2}-\d{2}" hidden>Recovered<\/span>/);
  });

  it("ships each mechanism's origin as an Imperial date for the title block", () => {
    for (const id of allIds()) {
      const meta = JSON.parse(read(join("meta", `${id}.json`))) as { date?: string };
      expect(meta.date, id).toMatch(/^\d{3}\.\d{3}\.M-?\d+$/);
    }
  });

  it("shows the release line in the footer: the laws, the codename once the release has one, the version", () => {
    const html = read("index.html");
    const version: string = JSON.parse(readFileSync("package.json", "utf8")).version;
    const codename: string | undefined = JSON.parse(readFileSync("data/codenames.json", "utf8"))[version.split(".").slice(0, 2).join(".")];
    expect(html).toContain(`<span>drawn under XVI laws · ${codename ? `${codename} · ` : ""}${version}</span>`);
  });

  it("keeps every page's description short enough for search results (about 155 characters)", () => {
    const desc = (html: string) => /<meta name="description" content="([^"]*)"/.exec(html)![1]!.replace(/&#39;|&quot;|&amp;/g, "x");
    expect(desc(read("index.html")).length).toBeLessThanOrEqual(155);
    for (const id of allIds()) expect(desc(read(join("mechanisms", id, "index.html"))).length, id).toBeLessThanOrEqual(160);
  });

  it("lists the library and every mechanism page in the sitemap, and points robots.txt at it", () => {
    const locs = [...read("sitemap.xml").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]!));
    expect(locs).toHaveLength(allIds().length + 1);
    const home = locs[0]!;
    expect(home.pathname).toMatch(/\/$/);
    for (const id of allIds()) expect(locs.some((u) => u.href === new URL(`mechanisms/${id}/`, home).href), id).toBe(true);
    expect(read("robots.txt")).toContain(`Sitemap: ${new URL("sitemap.xml", home).href}`);
  });

  it("serves the IndexNow key at the site root, holding just the key", () => {
    const keys = readdirSync(OUT).filter((f) => /^[0-9a-f]{32}\.txt$/.test(f));
    expect(keys).toHaveLength(1);
    expect(read(keys[0]!)).toBe(keys[0]!.replace(".txt", ""));
  });

  it("gives every page its canonical address, its own social card and structured data that parses (seo.ts)", () => {
    const meta = (html: string, key: string) => new RegExp(`<meta (?:property|name)="${key}" content="([^"]*)"`).exec(html)?.[1];
    const lds = (html: string) => [...html.matchAll(/<script type="application\/ld\+json">([^<]*)<\/script>/g)].map((m) => JSON.parse(m[1]!) as Record<string, unknown>);
    const lib = read("index.html");
    expect(lib).toMatch(/<title>Lex Mechanicum · Mechanism Library<\/title>/);
    expect(lds(lib).map((d) => d["@type"])).toEqual(["WebSite", "Organization"]);
    expect(meta(lib, "google-site-verification")).toBeTruthy();
    // the mark's card, its address versioned by what it is drawn from (brand.json)
    const fingerprint = (JSON.parse(readFileSync("site/brand/brand.json", "utf8")) as { fingerprint: string }).fingerprint;
    expect(new URL(meta(lib, "og:image")!).search).toBe(`?v=${fingerprint}`);
    expect(lib).toMatch(/<script async data-goatcounter="https:\/\/[a-z0-9-]+\.goatcounter\.com\/count" src="https:\/\/gc\.zgo\.at\/count\.js">/);
    for (const id of allIds()) {
      const html = read(join("mechanisms", id, "index.html"));
      const canonical = /<link rel="canonical" href="([^"]+)"/.exec(html)?.[1];
      expect(canonical && new URL(canonical).pathname, id).toMatch(new RegExp(`/mechanisms/${id}/$`));
      expect(meta(html, "og:url"), id).toBe(canonical);
      const image = meta(html, "og:image")!;
      expect(new URL(image).pathname, id).toMatch(new RegExp(`/cards/${id}\\.jpg$`));
      expect(existsSync(join(OUT, "cards", `${id}.jpg`)), id).toBe(true);
      expect(meta(html, "twitter:image"), id).toBe(image);
      expect(meta(html, "og:image:alt"), id).toBeTruthy();
      const [ld] = lds(html);
      expect(ld, id).toMatchObject({ "@type": "LearningResource", url: canonical, image, inLanguage: "en", isAccessibleForFree: true });
      expect(["Basic", "Intermediate", "Advanced"], id).toContain(ld!.educationalLevel);
    }
    const lost = read("404.html");
    expect(lost).toContain('<meta name="robots" content="noindex">');
    expect(lost).not.toContain('rel="canonical"');
  });
});
