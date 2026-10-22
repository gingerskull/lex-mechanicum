// The library in a real browser (SS1, SS3, SS10), local only: `npm run test:e2e` builds the site and runs this with the
// stage's tests. The Sort button sits beside Filters and opens a menu of the orders, by mouse, touch or keyboard; the
// cards follow the order picked, through search and filters, and the address keeps it; Clear filters returns to New;
// Previous and Next on a mechanism page follow the sorted library. Desktop and phone width, both sheets. Uses the
// installed Chrome; CHROME_PATH runs another Chromium build instead.
import { existsSync, readFileSync } from "node:fs";
import { createServer, type Server } from "node:http";
import { extname, join } from "node:path";
import { chromium, type Browser, type BrowserContext, type Page } from "playwright-core";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { sortBy, type Order, type Sortable } from "../../site/src/sort";

const OUT = join("dist", "site");
const TYPES: Record<string, string> = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".webp": "image/webp", ".woff2": "font/woff2" };

let server: Server;
let base = "";
let browser: Browser;
beforeAll(async () => {
  if (!existsSync(join(OUT, "index.html"))) throw new Error("build the site first (npm run test:e2e does)");
  server = createServer((q, r) => {
    let p = decodeURIComponent(new URL(q.url ?? "/", "http://x").pathname);
    if (p.endsWith("/")) p += "index.html";
    const f = join(OUT, p);
    if (!existsSync(f)) {
      r.writeHead(404);
      r.end();
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
