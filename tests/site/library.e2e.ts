// The library in a real browser (SS1, SS3, SS10), local only: `npm run test:e2e` builds the site and runs this with the
// stage's tests. The Sort button sits beside Filters and opens a menu of the orders, by mouse, touch or keyboard; the
// cards follow the order picked, through search and filters, and the address keeps it; Clear filters returns to New;
// Previous and Next on a mechanism page follow the sorted library; the empty search and the 404 page say what happened
// and offer a way back. Desktop and phone width, both sheets. Uses the installed Chrome; CHROME_PATH runs another
// Chromium build instead.
import { existsSync, readFileSync } from "node:fs";
import { createServer, type Server } from "node:http";
import { extname, join } from "node:path";
import { chromium, type Browser, type BrowserContext, type Page } from "playwright-core";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { recordById } from "../../src/catalog";
import { allIds } from "../../src/mechanisms";
import { HINTS, LORE_WORDS } from "../../site/src/lore";
import { addDays, longDate, windowsOf } from "../../site/src/season";
import { periodOf, rotationPick } from "../../site/src/featured";
import { sortBy, type Order, type Sortable } from "../../site/src/sort";

const OUT = join("dist", "site");
const TYPES: Record<string, string> = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".webp": "image/webp", ".woff2": "font/woff2" };

let server: Server;
let base = "";
let browser: Browser;
beforeAll(async () => {
  if (!existsSync(join(OUT, "index.html"))) throw new Error("build the site first (npm run test:e2e does)");
  // as GitHub Pages: a path the site does not have gets its 404 page, with the 404 status
  server = createServer((q, r) => {
    let p = decodeURIComponent(new URL(q.url ?? "/", "http://x").pathname);
    if (p.endsWith("/")) p += "index.html";
    const f = join(OUT, p);
    if (!existsSync(f)) {
      r.writeHead(404, { "content-type": "text/html" });
      r.end(readFileSync(join(OUT, "404.html")));
      return;
    }
    r.writeHead(200, { "content-type": TYPES[extname(f)] ?? "application/octet-stream" });
    r.end(readFileSync(f));
  });
  await new Promise<void>((ok) => server.listen(0, "127.0.0.1", ok));
  base = "http://127.0.0.1:" + String((server.address() as { port: number }).port);
  const path = process.env.CHROME_PATH;
  browser = await chromium.launch(path ? { executablePath: path, headless: true } : { channel: "chrome", headless: true });
});
afterAll(async () => {
  await browser?.close();
  server?.close();
});

const desktop = (colorScheme: "dark" | "light" = "dark") => browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme });
const phone = (colorScheme: "dark" | "light" = "dark") => browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, hasTouch: true, isMobile: true, colorScheme });

async function open(ctx: BrowserContext, path: string): Promise<{ page: Page; errors: string[] }> {
  const page = await ctx.newPage();
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(base + path);
  return { page, errors };
}

type Card = Sortable & { id: string };
/** The cards shown, in the page's order, with what the orders read from them. */
const shownCards = (page: Page): Promise<Card[]> =>
  page.$$eval(".grid .card:not([hidden])", (cs) =>
    cs.map((c) => {
      const d = (c as HTMLElement).dataset;
      return { id: d.id!, no: Number(d.no), name: c.querySelector("h2")!.textContent!, added: d.added, origin: d.origin ? Number(d.origin) : undefined };
    }),
  );
const expectOrder = async (page: Page, order: Order) => {
  const cards = await shownCards(page);
  expect(cards.length).toBeGreaterThan(0);
  expect(cards.map((c) => c.id)).toEqual(sortBy(cards, order).map((c) => c.id));
};
/** The library's address as the page has it now (replaceState is not always in page.url() yet). */
const query = async (page: Page) => new URLSearchParams(await page.evaluate(() => location.search));
const focused = (page: Page) => page.evaluate(() => (document.activeElement as HTMLElement | null)?.dataset.sort ?? document.activeElement?.id ?? "");
const menuOpen = async (page: Page) => (await page.locator("#sbtn").getAttribute("aria-expanded")) === "true" && (await page.locator("#sortmenu").isVisible());

describe("sorting the library on a desktop", () => {
  it("opens in the New order, with Sort beside Filters naming it", async () => {
    const ctx = await desktop();
    const { page, errors } = await open(ctx, "/");
    await expectOrder(page, "new");
    // until records carry an added date, New is the sheet number, highest first
    const cards = await shownCards(page);
    if (cards.every((c) => c.added === undefined)) expect(cards.map((c) => c.no)).toEqual([...cards.map((c) => c.no)].sort((a, b) => b - a));
    const sort = page.locator("#sbtn");
    expect(await sort.getAttribute("aria-haspopup")).toBe("menu");
    expect(await sort.getAttribute("aria-expanded")).toBe("false");
    expect(await page.locator("#sortv").textContent()).toBe("New");
    const f = (await page.locator("#ftoggle").boundingBox())!;
    const s = (await sort.boundingBox())!;
    expect(Math.abs(f.y - s.y)).toBeLessThan(1);
    expect(Math.abs(f.height - s.height)).toBeLessThan(1);
    expect(s.x).toBeGreaterThan(f.x + f.width);
    // Oldest origin is offered only once records carry origin dates
    const labels = await page.locator('#sortmenu [role="menuitemradio"]').allTextContents();
    const dated = cards.some((c) => c.origin !== undefined);
    expect(labels).toEqual(dated ? ["New", "Name A to Z", "Oldest origin", "Sheet number"] : ["New", "Name A to Z", "Sheet number"]);
    expect((await query(page)).has("sort")).toBe(false);
    expect(errors).toEqual([]);
    await ctx.close();
  });

  it("sorts by the order picked, keeps it through filters and search, and returns to New on Clear filters", async () => {
    const ctx = await desktop();
    const { page, errors } = await open(ctx, "/");
    await page.locator("#sbtn").click();
    expect(await menuOpen(page)).toBe(true);
    expect(await focused(page)).toBe("new");
    await page.locator('#sortmenu [data-sort="name"]').click();
    expect(await menuOpen(page)).toBe(false);
    expect(await focused(page)).toBe("sbtn");
    expect(await page.locator("#sortv").textContent()).toBe("Name A to Z");
    expect(await page.locator('#sortmenu [data-sort="name"]').getAttribute("aria-checked")).toBe("true");
    expect(await page.locator('#sortmenu [aria-checked="true"]').count()).toBe(1);
    expect((await query(page)).get("sort")).toBe("name");
    await expectOrder(page, "name");

    await page.locator("#ftoggle").click();
    const chip = page.locator('#facets .chip[data-f="family"]').first();
    await chip.click();
    expect((await query(page)).get("family")).toBe(await chip.getAttribute("data-v"));
    expect((await query(page)).get("sort")).toBe("name");
    await expectOrder(page, "name");
    await chip.click();
    await page.locator("#q").fill("gear");
    expect((await query(page)).get("q")).toBe("gear");
    expect((await query(page)).get("sort")).toBe("name");
    await expectOrder(page, "name");
    expect((await shownCards(page)).length).toBeGreaterThan(1);

    await page.locator("#clear").click();
    expect((await query(page)).toString()).toBe("");
    expect(await page.locator("#sortv").textContent()).toBe("New");
    expect(await page.locator('#sortmenu [data-sort="new"]').getAttribute("aria-checked")).toBe("true");
    expect((await shownCards(page)).length).toBe(await page.locator(".grid .card").count());
    await expectOrder(page, "new");
    expect(errors).toEqual([]);
    await ctx.close();
  });

  it("works from the keyboard and closes on Escape, Tab or a click elsewhere", async () => {
    const ctx = await desktop();
    const { page, errors } = await open(ctx, "/");
    expect(await page.locator("#sortmenu").getAttribute("role")).toBe("menu");
    await page.locator("#sbtn").focus();
    await page.keyboard.press("Enter");
    expect(await menuOpen(page)).toBe(true);
    expect(await focused(page)).toBe("new");
    await page.keyboard.press("ArrowDown");
    expect(await focused(page)).toBe("name");
    await page.keyboard.press("End");
    expect(await focused(page)).toBe("sheet");
    await page.keyboard.press("ArrowDown");
    expect(await focused(page)).toBe("new");
    await page.keyboard.press("ArrowUp");
    expect(await focused(page)).toBe("sheet");
    await page.keyboard.press("Home");
    expect(await focused(page)).toBe("new");
    await page.keyboard.press("Escape");
    expect(await menuOpen(page)).toBe(false);
    expect(await focused(page)).toBe("sbtn");
    await expectOrder(page, "new");

    // an arrow key opens it on the current order; Enter picks
    await page.keyboard.press("ArrowDown");
    expect(await menuOpen(page)).toBe(true);
    expect(await focused(page)).toBe("new");
    await page.keyboard.press("End");
    await page.keyboard.press("Enter");
    expect(await menuOpen(page)).toBe(false);
    expect(await focused(page)).toBe("sbtn");
    expect((await query(page)).get("sort")).toBe("sheet");
    await expectOrder(page, "sheet");
    await page.keyboard.press(" ");
    expect(await focused(page)).toBe("sheet");
    await page.keyboard.press("Tab");
    expect(await menuOpen(page)).toBe(false);

    await page.locator("#sbtn").click();
    expect(await menuOpen(page)).toBe(true);
    await page.locator("header.top h1").click();
    expect(await menuOpen(page)).toBe(false);
    expect(errors).toEqual([]);
    await ctx.close();
  });

  it("takes the order from a shared link, and keeps New for an order it does not offer", async () => {
    const ctx = await desktop();
    const { page } = await open(ctx, "/?sort=sheet");
    await expectOrder(page, "sheet");
    expect((await shownCards(page))[0]!.no).toBe(1);
    expect(await page.locator("#sortv").textContent()).toBe("Sheet number");
    expect(await page.locator('#sortmenu [data-sort="sheet"]').getAttribute("aria-checked")).toBe("true");
    for (const asked of ["price", ...((await page.locator('#sortmenu [data-sort="origin"]').count()) ? [] : ["origin"])]) {
      await page.goto(base + "/?sort=" + asked);
      await expectOrder(page, "new");
      expect(await page.locator("#sortv").textContent()).toBe("New");
      expect((await query(page)).has("sort")).toBe(false);
    }
    await ctx.close();
  });

  it("gives a mechanism page's Previous and Next the sorted library's order", async () => {
    const ctx = await desktop();
    const { page } = await open(ctx, "/?sort=name");
    const cards = await shownCards(page);
    await page.locator(".grid .card").first().click();
    await page.waitForURL("**/mechanisms/" + cards[0]!.id + "/");
    expect(await page.locator("#next").textContent()).toBe(cards[1]!.name);
    expect(await page.locator("#prev").textContent()).toBe(cards.at(-1)!.name);
    expect(await page.locator("#back").getAttribute("href")).toBe("/?sort=name");
    await ctx.close();
  });
});

describe("the quiet states", () => {
  it("says no pattern was found when nothing matches, and Clear filters brings the sheets back", async () => {
    const ctx = await desktop();
    const { page, errors } = await open(ctx, "/");
    await page.locator("#q").fill("zzzz qqqq");
    expect(await page.locator("#empty").isVisible()).toBe(true);
    expect(await page.locator("#empty h2").textContent()).toBe("No pattern found");
    expect(await page.locator("#empty p").textContent()).toBe("No pattern in the archive matches. Clear a filter or the search.");
    expect(await page.locator("#shown").textContent()).toMatch(/^0 of \d+ sheets$/);
    await page.locator("#clear").click();
    expect(await page.locator("#empty").isVisible()).toBe(false);
    expect((await shownCards(page)).length).toBe(await page.locator(".grid .card").count());
    expect(errors).toEqual([]);
    await ctx.close();
  });

  for (const [name, make] of [["desktop", desktop], ["phone", phone]] as const)
    it(`answers a missing address with sheet ST-404 and a way to the library (${name})`, async () => {
      const ctx = await make();
      const page = await ctx.newPage();
      const res = await page.goto(base + "/mechanisms/no-such-sheet/");
      expect(res?.status()).toBe(404);
      expect(await page.title()).toBe("Sheet ST-404 · Lex Mechanicum");
      expect(await page.locator("h1").textContent()).toBe("Sheet ST-404");
      expect(await page.locator(".dhead p:not(.lore-hint)").textContent()).toBe("This sheet is not in the archive. Its pattern may be lost, or not yet recovered.");
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await page.locator("main a.btn").click();
      await page.waitForURL(base + "/");
      expect(await page.locator(".grid .card").count()).toBeGreaterThan(0);
      await ctx.close();
    });
});

describe("sorting the library on a phone", () => {
  it("keeps search, Filters, Sort and the sheet switch on one row, Sort as compact as Filters, on both sheets", async () => {
    for (const scheme of ["dark", "light"] as const) {
      const ctx = await phone(scheme);
      const { page, errors } = await open(ctx, "/");
      const box = async (s: string) => (await page.locator(s).boundingBox())!;
      const [search, filters, sort, theme] = [await box("#libbar .search"), await box("#ftoggle"), await box("#sbtn"), await box("#libbar .themebtn")];
      for (const b of [filters, sort, theme]) expect(Math.abs(b.y + b.height / 2 - (search.y + search.height / 2)), scheme).toBeLessThan(1);
      expect(Math.abs(filters.height - sort.height)).toBeLessThan(1);
      expect(sort.x).toBeGreaterThan(filters.x + filters.width);
      expect(theme.x).toBeGreaterThan(sort.x + sort.width);
      expect(theme.x + theme.width).toBeLessThanOrEqual(390);
      // the current order is read out but not shown
      expect((await box("#sbtn .sortv")).width).toBeLessThanOrEqual(1);
      expect(await page.locator("#sbtn").textContent()).toContain("New");
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

      await page.locator("#sbtn").tap();
      expect(await menuOpen(page)).toBe(true);
      const m = (await page.locator("#sortmenu").boundingBox())!;
      expect(m.x).toBeGreaterThanOrEqual(0);
      expect(m.x + m.width).toBeLessThanOrEqual(390);
      // the current order is marked: pressed (ink fill) on an opaque menu
      const look = await page.evaluate(() => {
        const bg = (s: string) => getComputedStyle(document.querySelector(s)!).backgroundColor;
        return { menu: bg("#sortmenu"), checked: bg('#sortmenu [aria-checked="true"]'), other: bg('#sortmenu [aria-checked="false"]') };
      });
      expect(look.menu, scheme).not.toBe("rgba(0, 0, 0, 0)");
      expect(look.checked, scheme).not.toBe(look.other);
      await page.locator('#sortmenu [data-sort="sheet"]').tap();
      expect(await menuOpen(page)).toBe(false);
      expect((await query(page)).get("sort")).toBe("sheet");
      await expectOrder(page, "sheet");
      expect(errors).toEqual([]);
      await ctx.close();
    }
  });

  it("sorts from the stuck bar and goes back to the top of the list", async () => {
    const ctx = await phone();
    const { page } = await open(ctx, "/");
    await page.evaluate(() => scrollTo(0, 3000));
    await page.waitForFunction(() => document.getElementById("libbar")!.classList.contains("stuck"));
    const sort = (await page.locator("#sbtn").boundingBox())!;
    expect(sort.y).toBeGreaterThanOrEqual(0);
    expect(sort.y).toBeLessThan(80);
    await page.locator("#sbtn").tap();
    await page.locator('#sortmenu [data-sort="name"]').tap();
    await expectOrder(page, "name");
    const bar = (await page.locator("#libbar").boundingBox())!;
    const first = (await page.locator(".grid .card").first().boundingBox())!;
    expect(first.y).toBeGreaterThanOrEqual(bar.y + bar.height - 1);
    expect(first.y).toBeLessThan(bar.y + bar.height + 120);
    await ctx.close();
  });
});

describe("the Forge sheet (SS14)", () => {
  const sheet = (page: Page) => page.evaluate(() => document.documentElement.dataset.theme ?? "dark");

  it("opens on the 16th click on the title block's Rev cell, then the switch steps through three sheets and it stays", async () => {
    const ctx = await desktop();
    const { page, errors } = await open(ctx, "/");
    const rev = page.locator("[data-forge-key]");
    for (let i = 0; i < 15; i++) await rev.click();
    expect(await sheet(page)).toBe("dark");
    expect(await page.locator(".forge-fx").count()).toBe(0);
    await rev.click();
    // the moment's layers cover the window, not the page, while the body is filtered
    const cover = await page.evaluate(() => {
      const m = document.querySelector(".forge-moment")?.getBoundingClientRect();
      return m ? [m.height, innerHeight] : null;
    });
    if (cover) expect(cover[0]).toBe(cover[1]);
    await page.waitForFunction(() => document.documentElement.dataset.theme === "forge");
    const fxHeight = await page.evaluate(() => [document.querySelector(".forge-fx")?.getBoundingClientRect().height, innerHeight]);
    expect(fxHeight[0]).toBe(fxHeight[1]);
    // the moment ends by itself, the page is not left filtered, and the living layers take no click
    await page.waitForFunction(() => !document.body.classList.contains("forge-glitching") && !document.querySelector(".forge-moment"), null, { timeout: 4000 });
    expect(await page.locator(".forge-fx").evaluate((e) => getComputedStyle(e).pointerEvents)).toBe("none");
    expect(await page.locator(".tblock div").count()).toBe(4);
    const toggle = page.locator("[data-theme-toggle]").first();
    expect(await toggle.getAttribute("aria-label")).toBe("Switch to Blueprint");
    const order: string[] = [];
    for (let i = 0; i < 3; i++) {
      await toggle.click();
      order.push(await sheet(page));
    }
    expect(order).toEqual(["dark", "light", "forge"]);
    // remembered: a new page opens on Forge, its thumbnails recoloured, without the moment
    await page.goto(base + "/");
    expect(await sheet(page)).toBe("forge");
    expect(await page.locator(".forge-moment").count()).toBe(0);
    expect(await page.locator(".thumb img.t-dark").first().evaluate((e) => getComputedStyle(e).filter)).toContain("forge-tone");
    expect(errors).toEqual([]);
    await ctx.close();
  });

  it("starts the count again after a pause, and a click skips the moment", async () => {
    const ctx = await desktop();
    const { page } = await open(ctx, "/");
    const rev = page.locator("[data-forge-key]");
    for (let i = 0; i < 10; i++) await rev.click();
    await page.waitForTimeout(4200);
    for (let i = 0; i < 6; i++) await rev.click();
    expect(await sheet(page)).toBe("dark");
    for (let i = 0; i < 10; i++) await rev.click();
    await page.mouse.click(5, 5);
    await page.waitForFunction(() => !document.querySelector(".forge-moment"), null, { timeout: 1000 });
    expect(await sheet(page)).toBe("forge");
    await ctx.close();
  });

  it("is a plain fade under reduced motion, and nothing moves", async () => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: "dark", reducedMotion: "reduce" });
    const { page } = await open(ctx, "/");
    const rev = page.locator("[data-forge-key]");
    for (let i = 0; i < 16; i++) await rev.click();
    expect(await page.locator(".forge-moment").count()).toBe(0);
    // a plain fade: the veil eases in rather than cutting
    expect(await page.locator(".forge-veil").evaluate((e) => getComputedStyle(e).transitionDuration)).not.toBe("0s");
    await page.waitForFunction(() => document.documentElement.dataset.theme === "forge");
    const grain = () => page.locator(".forge-grain").evaluate((e) => (e as HTMLElement).style.transform);
    const g = await grain();
    await page.waitForTimeout(500);
    expect(await grain()).toBe(g);
    expect(await page.locator(".fx-flicker").evaluate((e) => getComputedStyle(e).animationName)).toBe("none");
    await ctx.close();
  });
});

describe("finding the Forge sheet (SS14)", () => {
  const sheet = (page: Page) => page.evaluate(() => document.documentElement.dataset.theme ?? "dark");
  const settled = (page: Page) => page.waitForFunction(() => !document.querySelector(".forge-moment, .forge-veil"), null, { timeout: 4000 });
  const centre = async (page: Page) => {
    const b = (await page.locator(".bar [data-theme-toggle]").first().boundingBox())!;
    return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
  };

  it("unlocks when the cog is held: a short press still switches, a hold of a second starts the fill, two more open it", async () => {
    const ctx = await desktop();
    // from the sealed state, where a hint has just been read
    const { page, errors } = await open(ctx, "/?q=mars");
    const c = await centre(page);
    await page.mouse.move(c.x, c.y);
    // a short press is a plain switch
    await page.mouse.down();
    await page.waitForTimeout(300);
    await page.mouse.up();
    expect(await sheet(page)).toBe("light");
    // let go during the fill: nothing switches, nothing opens
    await page.mouse.down();
    await page.waitForTimeout(1500);
    expect(await page.locator(".bar .themebtn .kindle").count()).toBe(1);
    await page.mouse.up();
    expect(await page.locator(".themebtn .kindle").count()).toBe(0);
    expect(await sheet(page)).toBe("light");
    // held to the end: Forge, and the click that ends the hold switches nothing
    await page.mouse.down();
    await page.waitForFunction(() => document.documentElement.dataset.theme === "forge", null, { timeout: 4500 });
    await page.mouse.up();
    await settled(page);
    expect(await sheet(page)).toBe("forge");
    expect(await page.evaluate(() => localStorage.getItem("forge"))).toBe("1");
    // the sealed state says so at once
    expect(await page.locator("#sealed-title").textContent()).toBe("The forge burns");
    expect(errors).toEqual([]);
    await ctx.close();
  });

  it("unlocks from the keyboard: Space held on the switch, a short press still switches", async () => {
    const ctx = await desktop();
    const { page } = await open(ctx, "/");
    const btn = page.locator(".bar [data-theme-toggle]").first();
    await btn.focus();
    await page.keyboard.press(" ");
    expect(await sheet(page)).toBe("light");
    await page.keyboard.down(" ");
    await page.waitForSelector(".forge-moment", { timeout: 4500 });
    // the key still held repeats: the moment plays on
    await page.keyboard.down(" ");
    await page.keyboard.down(" ");
    await page.waitForTimeout(100);
    expect(await page.locator(".forge-moment").count()).toBe(1);
    await page.waitForFunction(() => document.documentElement.dataset.theme === "forge", null, { timeout: 4500 });
    await page.keyboard.up(" ");
    await settled(page);
    expect(await sheet(page)).toBe("forge");
    await ctx.close();
  });

  it("unlocks under a finger held on the switch on a phone, without the browser's long-press menu", async () => {
    const ctx = await phone();
    const { page, errors } = await open(ctx, "/");
    const c = await centre(page);
    const cdp = await ctx.newCDPSession(page);
    const touch = (type: "touchStart" | "touchEnd") => cdp.send("Input.dispatchTouchEvent", { type, touchPoints: type === "touchEnd" ? [] : [{ x: c.x, y: c.y }] });
    let menus = 0;
    await page.exposeFunction("menuOpened", () => menus++);
    await page.evaluate(() => addEventListener("contextmenu", (e) => !e.defaultPrevented && (window as unknown as { menuOpened(): void }).menuOpened()));
    // a tap still switches
    await touch("touchStart");
    await touch("touchEnd");
    expect(await sheet(page)).toBe("light");
    await touch("touchStart");
    await page.waitForFunction(() => document.documentElement.dataset.theme === "forge", null, { timeout: 4500 });
    await touch("touchEnd");
    await settled(page);
    expect(await sheet(page)).toBe("forge");
    expect(menus).toBe(0);
    expect(errors).toEqual([]);
    await ctx.close();
  });

  it("answers a lore word in the search with a sealed state and a hint, and a real word with sheets", async () => {
    for (const make of [desktop, phone]) {
      const ctx = await make();
      const { page } = await open(ctx, "/?q=omnissiah");
      await page.waitForFunction(() => !document.getElementById("sealed")?.hidden);
      expect(await page.locator(".grid .card:not([hidden])").count()).toBe(0);
      expect(await page.locator("#empty").isHidden()).toBe(true);
      expect(await page.locator("#sealed-title").textContent()).toBe("Pattern sealed");
      expect(HINTS).toContain(await page.locator("#sealed [data-lore-hint]").textContent());
      const q = page.locator("#q");
      await q.fill("Tech-Priest");
      expect(await page.locator("#sealed").isVisible()).toBe(true);
      await q.fill(LORE_WORDS[LORE_WORDS.length - 1]!);
      expect(await page.locator("#sealed").isVisible()).toBe(true);
      await q.fill("gear");
      expect(await page.locator("#sealed").isHidden()).toBe(true);
      expect(await page.locator(".grid .card:not([hidden])").count()).toBeGreaterThan(0);
      await ctx.close();
    }
  });

  it("says the forge burns to a lore search once it is open", async () => {
    const ctx = await desktop();
    await ctx.addInitScript(() => localStorage.setItem("forge", "1"));
    const { page } = await open(ctx, "/?q=mars");
    await page.waitForFunction(() => !document.getElementById("sealed")?.hidden);
    expect(await page.locator("#sealed-title").textContent()).toBe("The forge burns");
    await ctx.close();
  });

  it("glints the cog once, on the third visit, while the forge is locked", async () => {
    const ctx = await desktop();
    await ctx.addInitScript(() => {
      if (!sessionStorage.getItem("seeded")) {
        sessionStorage.setItem("seeded", "1");
        localStorage.setItem("forge-visits", "2");
      }
    });
    const { page } = await open(ctx, "/");
    await page.waitForSelector(".themebtn.glint", { timeout: 3000 });
    await page.reload();
    await page.waitForTimeout(2200);
    expect(await page.locator(".themebtn.glint").count()).toBe(0);
    await ctx.close();
  });

  it("leaves a faint hint on the 404 page", async () => {
    const ctx = await phone();
    const { page } = await open(ctx, "/no-such-sheet/");
    const hint = page.locator(".lore-hint");
    expect(await hint.isVisible()).toBe(true);
    expect(HINTS).toContain(await hint.textContent());
    await ctx.close();
  });
});

// A seasonal mechanism (P14) in and out of its listing window, by the visitor's local date (the browser's clock is set):
// on the library, counted, or gone; on its page, the stage, or the placard with the day it comes back; on a library page it
// names as related, the link back, or none. Runs once a seasonal mechanism is registered.
const seasonal = allIds().filter((id) => recordById(id)?.season);
describe.skipIf(!seasonal.length)("a seasonal mechanism's listing", () => {
  // the body is collected even when skipped: nothing here may assume a seasonal mechanism exists
  const id = seasonal[0] ?? "";
  const rec = recordById(id);
  const first = windowsOf(rec?.season?.dates ?? [])[0] ?? { from: "2000-01-04", until: "2000-01-04" };
  const occasion = rec?.season?.occasion ?? "";
  const related = rec?.related.find((x) => allIds().includes(x) && !recordById(x)?.season);
  /** A desktop with its clock at noon, local time, on `day`. */
  const on = async (day: string) => {
    const ctx = await desktop();
    const [y, m, d] = day.split("-").map(Number);
    await ctx.clock.setFixedTime(new Date(y!, m! - 1, d!, 12));
    return ctx;
  };

  it("lists it on the library and counts it in its window, and leaves it out the day before", async () => {
    for (const [day, listed] of [[first.from, true], [addDays(first.from, -1), false]] as const) {
      const ctx = await on(day);
      const { page, errors } = await open(ctx, "/");
      const card = page.locator(`.grid .card[data-id="${id}"]`);
      expect(await card.count(), day).toBe(listed ? 1 : 0);
      if (listed) expect(await card.locator(".folklore").textContent()).toBe("Seasonal folklore");
      const n = await page.locator(".grid .card").count();
      expect(await page.locator("header.top h1 span").textContent(), day).toBe(String(n));
      expect(await page.locator("#shown").textContent(), day).toBe(`${n} sheets`);
      expect(errors).toEqual([]);
      await ctx.close();
    }
  });

  it("draws it on its page in its window, and out of it shows the placard with the day it comes back", async () => {
    let ctx = await on(first.from);
    let { page, errors } = await open(ctx, `/mechanisms/${id}/`);
    await page.waitForSelector('.stagebox[data-ready="1"]', { timeout: 30_000 });
    expect(await page.locator("#placard").isVisible()).toBe(false);
    expect(errors).toEqual([]);
    await ctx.close();
    ctx = await on(addDays(first.from, -1));
    ({ page, errors } = await open(ctx, `/mechanisms/${id}/`));
    await page.waitForTimeout(500);
    expect(await page.locator("#placard").isVisible()).toBe(true);
    expect(await page.locator(".stagebox").isVisible()).toBe(false);
    expect(await page.locator(".stagebox").getAttribute("data-ready")).toBeNull();
    expect(await page.locator("#placard p").textContent()).toBe(`Packed away with the decorations. It comes back for ${occasion} on ${longDate(first.from)}.`);
    expect(errors).toEqual([]);
    await ctx.close();
  });

  it.skipIf(!related)("links back to it from a library page it names, only in its window", async () => {
    for (const [day, listed] of [[first.from, true], [addDays(first.from, -1), false]] as const) {
      const ctx = await on(day);
      const { page } = await open(ctx, `/mechanisms/${related}/`);
      await page.waitForTimeout(300);
      expect(await page.locator(`[data-seasonlinks] a[href$="/mechanisms/${id}/"]`).isVisible(), day).toBe(listed);
      await ctx.close();
    }
  });
});

// The featured slot (SS16): one sheet large above the cards, its title block beside its fitted drawing, picked for the
// day in the browser (the clock is set): the
// rotation's sheet, or the seasonal ones while they are listed, sliding with dots when there are several; its height is
// held before it fills; it steps aside while a search is on and comes back when it is cleared.
describe("the featured slot", () => {
  const library = allIds().filter((id) => !recordById(id)?.season);
  /** A context with its clock at noon, local time, on `day`. */
  const at = async (day: string, make: () => Promise<BrowserContext> = desktop) => {
    const ctx = await make();
    const [y, m, d] = day.split("-").map(Number);
    await ctx.clock.setFixedTime(new Date(y!, m! - 1, d!, 12));
    return ctx;
  };
  /** The slot's slides as the page shows them: id from the link, label, name, and whether each is the one shown. */
  const slides = (page: Page) =>
    page.$$eval(".fslide", (ss) =>
      ss.map((s) => ({ href: (s as HTMLAnchorElement).getAttribute("href") ?? "", label: s.querySelector(".flabel, .folklore")?.textContent ?? "", name: s.querySelector("h2")?.textContent ?? "", on: s.classList.contains("on") })),
    );

  it("features the rotation's sheet outside any seasonal window, the same all three days of its period", async () => {
    const day = "2026-10-10";
    const want = rotationPick(library, periodOf(new Date(Date.UTC(2026, 9, 10, 12))));
    for (const d of [day, addDays(day, 1)]) {
      const ctx = await at(d);
      const { page, errors } = await open(ctx, "/");
      await page.waitForSelector(".fslide.on");
      const s = await slides(page);
      expect(s, d).toHaveLength(1);
      expect(s[0]!.href.endsWith(`/mechanisms/${want}/`), d).toBe(true);
      expect(s[0]!.label).toBe("Featured");
      expect(s[0]!.name).toBe(recordById(want!)!.name);
      expect(await page.locator("#fdots").isHidden()).toBe(true);
      // the stage's still until the engine draws, and the first uses of the record's examples in the title block
      expect(await page.locator(".fslide img").getAttribute("src")).toMatch(new RegExp(`/thumbs/${want}-dark-still\\.webp$`));
      expect(await page.locator(".fslide .fuses li").allTextContents()).toEqual((recordById(want!)!.examples ?? []).slice(0, 3).map((e) => e.use));
      expect(errors).toEqual([]);
      await ctx.close();
    }
  });

  it("holds its height before it fills, on a desktop and a phone", async () => {
    for (const make of [desktop, phone]) {
      const ctx = await at("2026-10-10", make);
      const { page } = await open(ctx, "/");
      await page.waitForSelector(".fslide.on");
      const [filled, empty] = await page.evaluate(() => {
        const v = document.getElementById("fview")!;
        const top = () => document.getElementById("grid")!.getBoundingClientRect().top;
        const a = top();
        const kids = [...v.children];
        v.replaceChildren();
        const b = top();
        v.replaceChildren(...kids);
        return [a, b];
      });
      expect(Math.abs(filled - empty)).toBeLessThan(1);
      await ctx.close();
    }
  });

  it("starts the drawing once in view, and switches its still with the sheet", async () => {
    const ctx = await at("2026-10-10");
    const { page, errors } = await open(ctx, "/");
    await page.waitForSelector(".fslide.live", { timeout: 30_000 });
    await page.locator(".bar [data-theme-toggle]").first().click();
    await page.waitForTimeout(200);
    expect(await page.locator(".fslide img").getAttribute("src")).toMatch(/-light-still\.webp$/);
    expect(errors).toEqual([]);
    await ctx.close();
  });

  it("steps aside while a search is on and comes back when it is cleared", async () => {
    for (const make of [desktop, phone]) {
      const ctx = await at("2026-10-10", make);
      const { page } = await open(ctx, "/");
      await page.waitForSelector(".fslide.on");
      expect(await page.locator("#featured").isVisible()).toBe(true);
      await page.locator("#q").fill("gear");
      expect(await page.locator("#featured").isVisible()).toBe(false);
      await page.locator("#q").fill("");
      expect(await page.locator("#featured").isVisible()).toBe(true);
      await ctx.close();
    }
  });

  const seasonal = allIds().filter((id) => recordById(id)?.season);
  const id = seasonal[0] ?? "";
  const rec = recordById(id);
  const first = windowsOf(rec?.season?.dates ?? [])[0] ?? { from: "2000-01-04", until: "2000-01-04" };

  it.skipIf(!seasonal.length)("features a listed seasonal mechanism instead, with its occasion", async () => {
    const ctx = await at(first.from);
    const { page, errors } = await open(ctx, "/");
    await page.waitForSelector(".fslide.on");
    const s = await slides(page);
    expect(s).toHaveLength(1);
    expect(s[0]!.href.endsWith(`/mechanisms/${id}/`)).toBe(true);
    expect(s[0]!.label).toBe(`Seasonal folklore · ${rec!.season!.occasion}`);
    expect(errors).toEqual([]);
    await ctx.close();
  });

  it.skipIf(!seasonal.length)("slides between several listed at once: dots, arrow keys, and a turn every 8 s", async () => {
    // a library sheet dressed as a second seasonal mechanism, listed from the day after the first's window opens
    const other = library[0]!;
    const ctx = await desktop();
    const [y, m, d] = first.from.split("-").map(Number);
    await ctx.clock.install({ time: new Date(y!, m! - 1, d!, 12) });
    await ctx.addInitScript(
      ([oid, from, until]) => {
        new MutationObserver((_, mo) => {
          const c = document.querySelector<HTMLElement>(`.card[data-id="${oid}"]`);
          if (!c) return;
          c.dataset.season = `${from}/${until}`;
          c.dataset.occasion = "Test day";
          mo.disconnect();
        }).observe(document, { childList: true, subtree: true });
      },
      [other, addDays(first.from, -1), first.until] as const,
    );
    const { page, errors } = await open(ctx, "/");
    await page.waitForSelector(".fslide.on");
    // the dressed sheet's window opened a day earlier: it comes first
    let s = await slides(page);
    expect(s.map((x) => x.href.split("/").at(-2))).toEqual([other, id]);
    expect(s.map((x) => x.on)).toEqual([true, false]);
    expect(await page.locator("#fdots button").count()).toBe(2);
    await page.locator("#fdots button").nth(1).click();
    s = await slides(page);
    expect(s.map((x) => x.on)).toEqual([false, true]);
    expect(await page.locator("#fdots button").nth(1).getAttribute("aria-current")).toBe("true");
    await page.keyboard.press("ArrowRight");
    expect((await slides(page)).map((x) => x.on)).toEqual([true, false]);
    // the turns wait while the slot has the focus; away from it, one comes after 8 s
    await page.locator("#q").focus();
    await page.mouse.move(5, 5);
    await page.clock.runFor(8_100);
    expect((await slides(page)).map((x) => x.on)).toEqual([false, true]);
    expect(errors).toEqual([]);
    await ctx.close();
  });
});
