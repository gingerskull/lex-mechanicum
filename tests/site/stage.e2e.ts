// The stage in a real browser (SS5, SS7), local only: `npm run test:e2e` (builds the site, then runs this). The stage
// opens in the record's view and plays, scrubs on a sideways drag, orbits on a right drag, two fingers or the keyboard,
// snaps to the named views, takes the record's section view and controls, honours the dial, keeps the page's scroll on a
// phone; a browser without WebGL2 gets the still. The
// sheet switch names the sheet it switches to and turns its cog half a turn per sheet.
import { existsSync, readFileSync } from "node:fs";
import { createServer, type Server } from "node:http";
import { extname, join } from "node:path";
import { chromium, type Browser, type BrowserContext, type Page } from "playwright-core";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const OUT = join("dist", "site");
const TYPES: Record<string, string> = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".webp": "image/webp", ".woff2": "font/woff2" };

let server: Server;
let base = "";
let browser: Browser;
beforeAll(async () => {
  if (!existsSync(join(OUT, "packages", "four-bar.mx2"))) throw new Error("build the site first (npm run test:e2e does)");
  server = createServer((q, r) => {
    let p = decodeURIComponent(new URL(q.url ?? "/", "http://x").pathname);
    if (p.endsWith("/")) p += "index.html";
    if (p === "/favicon.ico") {
      r.writeHead(204);
      r.end();
      return;
    }
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
  browser = await chromium.launch({ channel: "chrome", headless: true, args: ["--enable-gpu", "--use-angle=d3d11", "--ignore-gpu-blocklist"] });
});
afterAll(async () => {
  await browser?.close();
  server?.close();
});

async function open(ctx: BrowserContext, path: string): Promise<{ page: Page; errors: string[] }> {
  const page = await ctx.newPage();
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto(base + path);
  return { page, errors };
}
const desktop = () => browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: "dark" });
const phone = () => browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, hasTouch: true, isMobile: true, colorScheme: "dark" });
const ready = (page: Page) => page.waitForSelector('.stagebox[data-ready="1"]', { timeout: 30_000 });
const stageShot = (page: Page) => page.locator("#stage").screenshot();
const differs = (a: Buffer, b: Buffer) => !a.equals(b);
/** Pauses the animation so frames are comparable. */
const pause = async (page: Page) => {
  if ((await page.locator("#play").getAttribute("aria-pressed")) === "true") await page.locator("#play").click();
};
const drag = async (page: Page, dx: number, dy: number, button: "left" | "right" = "left") => {
  const b = (await page.locator("#stage").boundingBox())!;
  const x = b.x + b.width / 2;
  const y = b.y + b.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down({ button });
  await page.mouse.move(x + dx / 2, y + dy / 2, { steps: 4 });
  await page.mouse.move(x + dx, y + dy, { steps: 4 });
  await page.mouse.up({ button });
};

describe("a mechanism page", () => {
  it("opens in the record's view, without the transition stamp, and plays", async () => {
    const ctx = await desktop();
    const { page, errors } = await open(ctx, "/mechanisms/four-bar/");
    await ready(page);
    expect(await page.locator(".stamp3d").count()).toBe(0);
    expect(await page.locator("#record-view").getAttribute("aria-pressed")).toBe("true");
    // the four-bar declares a plan, which opens tilted to the 28 degree view (T7)
    expect(await page.locator('#presets button[data-view="PLAN"]').getAttribute("aria-pressed")).toBe("false");
    expect(await page.locator(".stagebox").getAttribute("data-tilt")).toBe("28");
    const a = await stageShot(page);
    await page.waitForTimeout(600);
    expect(differs(a, await stageShot(page))).toBe(true);
    expect(errors).toEqual([]);
    await ctx.close();
  });

  it("draws the output plot beside the stage", async () => {
    const ctx = await desktop();
    for (const id of ["four-bar", "oscillating-cylinder"]) {
      const { page, errors } = await open(ctx, "/mechanisms/" + id + "/");
      await ready(page);
      await page.waitForTimeout(300);
      const painted = await page.evaluate(() => {
        const p = document.getElementById("plot") as HTMLCanvasElement;
        const d = p.getContext("2d")!.getImageData(0, 0, p.width, p.height).data;
        let n = 0;
        for (let i = 3; i < d.length; i += 4) if (d[i]) n++;
        return n;
      });
      expect(painted, id).toBeGreaterThan(500);
      expect(errors).toEqual([]);
    }
    await ctx.close();
  });

  it("shows no transition stamp on the library cards", async () => {
    const ctx = await desktop();
    const { page } = await open(ctx, "/");
    expect(await page.locator(".card").count()).toBeGreaterThan(0);
    expect(await page.locator(".stamp3d").count()).toBe(0);
    await ctx.close();
  });
});

describe("the sheet switch", () => {
  it("names the sheet it switches to and turns the cog half a turn per sheet (SS7)", async () => {
    const ctx = await desktop();
    const { page, errors } = await open(ctx, "/");
    const btn = page.locator("[data-theme-toggle]").first();
    const turn = () => btn.locator("svg").evaluate((e) => getComputedStyle(e).transform);
    const sheet = () => page.evaluate(() => (document.documentElement.dataset.theme === "light" ? "light" : "dark"));
    // the theme island names the button once it runs
    await page.waitForFunction(() => document.querySelector("[data-theme-toggle]")?.getAttribute("aria-label") !== "Switch sheet");
    expect(await sheet()).toBe("dark");
    expect(await btn.getAttribute("aria-label")).toBe("Switch to Drafting");
    expect(await btn.getAttribute("title")).toBe("Switch to Drafting");
    // rotate(180deg), as computed: matrix(-1, 0, 0, -1, 0, 0) up to rounding
    expect(await turn()).toMatch(/^matrix\(-1, [-\de.]+, [-\de.]+, -1, 0, 0\)$/);
    await btn.click();
    expect(await sheet()).toBe("light");
    expect(await btn.getAttribute("aria-label")).toBe("Switch to Blueprint");
    expect(await btn.getAttribute("title")).toBe("Switch to Blueprint");
    expect(await turn()).toBe("none");
    expect(errors).toEqual([]);
    await ctx.close();
  });
});

describe("the Forge sheet on the stage (SS14)", () => {
  it("draws the whole mechanism on Forge, through its post-process, and again on Blueprint after it", async () => {
    const ctx = await desktop();
    await ctx.addInitScript(() => {
      localStorage.setItem("forge", "1");
      localStorage.setItem("theme", "forge");
    });
    const { page, errors } = await open(ctx, "/mechanisms/geneva/");
    await page.waitForSelector('.stagebox[data-ready="1"]');
    await page.locator("#play").click();
    // the bright pixels of the drawing (lines and solids), so a frame without its solids shows
    const lit = () =>
      page.evaluate(async () => {
        await new Promise((r) => setTimeout(r, 600));
        const c = document.getElementById("stage") as HTMLCanvasElement;
        const d = c.getContext("2d")!.getImageData(0, 0, c.width, c.height).data;
        let n = 0;
        for (let i = 0; i < d.length; i += 4) if (0.2126 * d[i]! + 0.7152 * d[i + 1]! + 0.0722 * d[i + 2]! > 128) n++;
        return n / (c.width * c.height);
      });
    expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe("forge");
    // the switch beside the name (the compact bar's waits for a scroll)
    const btn = page.locator(".dhead [data-theme-toggle]");
    // a quarter turn on Forge: matrix(0, 1, -1, 0, 0, 0) up to rounding
    expect(await btn.locator("svg").evaluate((e) => getComputedStyle(e).transform)).toMatch(/^matrix\([-\de.]+, 1, -1, [-\de.]+, 0, 0\)$/);
    const forge = await lit();
    await btn.click();
    expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe("dark");
    const blueprint = await lit();
    expect(blueprint).toBeGreaterThan(0.01);
    expect(forge).toBeGreaterThan(0.6 * blueprint);
    expect(errors).toEqual([]);
    await ctx.close();
  });
});

describe("library cards", () => {
  it("animate a card on hover from its package", async () => {
    const ctx = await desktop();
    const { page, errors } = await open(ctx, "/");
    for (const id of ["four-bar", "spur-gears"]) {
      const card = page.locator('.card[data-id="' + id + '"]');
      await card.scrollIntoViewIfNeeded();
      await card.hover();
      await page.waitForSelector('.card[data-id="' + id + '"] .thumb.live', { timeout: 30_000 });
      await page.mouse.move(2, 2);
    }
    const loaded = await page.evaluate(() => performance.getEntriesByType("resource").map((e) => e.name));
    expect(loaded.some((n) => n.endsWith("/packages/four-bar.mx2"))).toBe(true);
    expect(loaded.some((n) => n.endsWith("/packages/spur-gears.mx2"))).toBe(true);
    expect(errors).toEqual([]);
    await ctx.close();
  });
});

describe("the stage on a desktop", () => {
  it("scrubs on a sideways drag and leaves the view alone", async () => {
    const ctx = await desktop();
    const { page, errors } = await open(ctx, "/mechanisms/four-bar/");
    await ready(page);
    const deg = await page.locator("#scrub").inputValue();
    await drag(page, 160, 10);
    expect(await page.locator("#play").getAttribute("aria-pressed")).toBe("false");
    expect(await page.locator("#scrub").inputValue()).not.toBe(deg);
    expect(await page.locator("#record-view").getAttribute("aria-pressed")).toBe("true");
    expect(errors).toEqual([]);
    await ctx.close();
  });

  it("orbits on a right drag without opening the menu, names the view it lands on, and resets", async () => {
    const ctx = await desktop();
    const { page, errors } = await open(ctx, "/mechanisms/four-bar/");
    await ready(page);
    await pause(page);
    const plan = await stageShot(page);
    const menu = page.evaluate(() => new Promise<boolean>((ok) => document.getElementById("stage")!.addEventListener("contextmenu", (e) => setTimeout(() => ok(e.defaultPrevented)), { once: true })));
    await drag(page, 40, -120, "right");
    expect(await menu).toBe(true);
    expect(await page.locator("#record-view").getAttribute("aria-pressed")).toBe("false");
    expect(Number(await page.locator(".stagebox").getAttribute("data-tilt"))).toBeGreaterThan(20);
    expect(differs(plan, await stageShot(page))).toBe(true);
    await page.locator('#presets button[data-view="SIDE"]').click();
    expect(await page.locator(".stagebox").getAttribute("data-view")).toBe("SIDE");
    expect(await page.locator('#presets button[data-view="SIDE"]').getAttribute("aria-pressed")).toBe("true");
    await page.locator('#presets button[data-view="ISOMETRIC"]').click();
    expect(await page.locator('#presets button[data-view="ISOMETRIC"]').getAttribute("aria-pressed")).toBe("true");
    await page.locator("#record-view").click();
    expect(await page.locator("#record-view").getAttribute("aria-pressed")).toBe("true");
    expect(errors).toEqual([]);
    await ctx.close();
  });

  it("orbits and takes the named views from the keyboard", async () => {
    const ctx = await desktop();
    const { page, errors } = await open(ctx, "/mechanisms/four-bar/");
    await ready(page);
    await page.locator("#stage").focus();
    await page.keyboard.press("3");
    expect(await page.locator('#presets button[data-view="SIDE"]').getAttribute("aria-pressed")).toBe("true");
    await page.keyboard.press("Shift+ArrowUp");
    await page.keyboard.press("Shift+ArrowUp");
    expect(Number(await page.locator(".stagebox").getAttribute("data-tilt"))).toBe(80);
    await page.keyboard.press("Shift+ArrowLeft");
    expect(await page.locator('#presets button[data-view="SIDE"]').getAttribute("aria-pressed")).toBe("false");
    await page.keyboard.press("0");
    expect(await page.locator("#record-view").getAttribute("aria-pressed")).toBe("true");
    expect(errors).toEqual([]);
    await ctx.close();
  });

  it("keeps the construction key out of sight on a wide stage, and leaves a plan for the 28 degree view to explode", async () => {
    const ctx = await desktop();
    const { page, errors } = await open(ctx, "/mechanisms/four-bar/");
    await ready(page);
    expect(await page.locator("#ckey").isHidden()).toBe(true);
    await page.locator('#presets button[data-view="PLAN"]').click();
    expect(await page.locator(".stagebox").getAttribute("data-view")).toBe("PLAN");
    await page.locator("#explode").fill("60");
    await page.waitForTimeout(700);
    expect(await page.locator(".stagebox").getAttribute("data-tilt")).toBe("28");
    expect(await page.locator("#play").getAttribute("aria-pressed")).toBe("false");
    expect(errors).toEqual([]);
    await ctx.close();
  });

  it("picks a construction label out under the mouse, and pins it on a click without pausing", async () => {
    const ctx = await desktop();
    const { page, errors } = await open(ctx, "/mechanisms/bevel-gears/");
    await ready(page);
    await pause(page);
    await page.locator('.ovl .chip[data-o="construction"]').click();
    await page.waitForTimeout(200);
    // the stage's screenshots scroll it into view: settle that first, so the places found below stay put
    await stageShot(page);
    const b = (await page.locator("#stage").boundingBox())!;
    // find a label: the cursor turns to a pointer over one
    let at: [number, number] | null = null;
    for (let y = 0.06; y < 0.9 && !at; y += 0.03)
      for (let x = 0.3; x < 0.95 && !at; x += 0.02) {
        await page.mouse.move(b.x + b.width * x, b.y + b.height * y);
        if ((await page.locator("#stage").evaluate((c) => (c as HTMLElement).style.cursor)) === "pointer") at = [b.x + b.width * x, b.y + b.height * y];
      }
    expect(at).not.toBeNull();
    await page.mouse.move(b.x + 2, b.y + 2);
    await page.waitForTimeout(100);
    const plain = await stageShot(page);
    await page.mouse.move(...at!);
    await page.waitForTimeout(150);
    expect(differs(plain, await stageShot(page))).toBe(true);
    await page.mouse.click(...at!);
    expect(await page.locator("#play").getAttribute("aria-pressed")).toBe("false");
    await page.mouse.move(b.x + 2, b.y + 2);
    await page.waitForTimeout(150);
    // pinned: still picked out once the mouse has left
    expect(differs(plain, await stageShot(page))).toBe(true);
    expect(errors).toEqual([]);
    await ctx.close();
  });

  it("has no tilt slider (orbit and the named views turn the drawing), and explodes", async () => {
    const ctx = await desktop();
    const { page, errors } = await open(ctx, "/mechanisms/four-bar/");
    await ready(page);
    await pause(page);
    const a = await stageShot(page);
    expect(await page.locator("#tilt").count()).toBe(0);
    await page.locator('#presets button[data-view="ISOMETRIC"]').click();
    const b = await stageShot(page);
    expect(differs(a, b)).toBe(true);
    await page.locator("#explode").fill("100");
    expect(await page.locator("#explodev").textContent()).toBe("100%");
    expect(differs(b, await stageShot(page))).toBe(true);
    expect(errors).toEqual([]);
    await ctx.close();
  });

  it("changes the drawing with the record's own controls", async () => {
    const ctx = await desktop();
    // the universal joint's bend: a param control that moves the output shaft and its blocks
    const { page, errors } = await open(ctx, "/mechanisms/universal-joint/");
    await ready(page);
    await pause(page);
    const a = await stageShot(page);
    const bend = page.locator('input[data-ctl="bend"]');
    await bend.fill("40");
    await bend.dispatchEvent("input");
    await page.waitForTimeout(400);
    expect(differs(a, await stageShot(page))).toBe(true);
    expect(await page.locator("#stage-err").isHidden()).toBe(true);
    expect(errors).toEqual([]);
    await ctx.close();
  });

  it("takes the record's section view and goes back", async () => {
    const ctx = await desktop();
    const { page, errors } = await open(ctx, "/mechanisms/oscillating-cylinder/");
    await ready(page);
    await pause(page);
    const a = await stageShot(page);
    const section = page.locator('#vviews button[data-kind="section"]').first();
    await section.click();
    expect(await section.getAttribute("aria-pressed")).toBe("true");
    expect(await page.locator(".stagebox").getAttribute("data-view")).toBe("AUX");
    expect(differs(a, await stageShot(page))).toBe(true);
    await section.click();
    expect(await section.getAttribute("aria-pressed")).toBe("false");
    expect(await page.locator("#record-view").getAttribute("aria-pressed")).toBe("true");
    expect(errors).toEqual([]);
    await ctx.close();
  });

  it("holds the dial where the visitor puts it", async () => {
    const ctx = await desktop();
    const { page, errors } = await open(ctx, "/mechanisms/bevel-gears/");
    await ready(page);
    expect(await page.locator("#detailv").textContent()).toBe("Full");
    await page.locator("#detail").fill("0");
    expect(await page.locator("#auto").getAttribute("aria-pressed")).toBe("false");
    expect(await page.locator("#detailv").textContent()).toBe("−A–G");
    expect(errors).toEqual([]);
    await ctx.close();
  });

  it("scrubs on the true input", async () => {
    const ctx = await desktop();
    const { page } = await open(ctx, "/mechanisms/four-bar/");
    await ready(page);
    await page.locator("#scrub").fill("200");
    expect(await page.locator("#play").getAttribute("aria-pressed")).toBe("false");
    expect(await page.locator("#scrubv").textContent()).toBe("200°");
    await ctx.close();
  });
});

describe("the stage on a phone", () => {
  it("lets a finger scroll the page, scrubs on a sideways swipe, and orbits with two fingers", async () => {
    const ctx = await phone();
    const { page, errors } = await open(ctx, "/mechanisms/four-bar/");
    await ready(page);
    const cdp = await ctx.newCDPSession(page);
    const swipe = async (from: [number, number][], to: [number, number][]) => {
      await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: from.map(([x, y], id) => ({ x, y, id })) });
      for (let i = 1; i <= 8; i++)
        await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: from.map(([x, y], id) => ({ x: x + ((to[id]![0] - x) * i) / 8, y: y + ((to[id]![1] - y) * i) / 8, id })) });
      await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    };
    await page.locator("#stage").scrollIntoViewIfNeeded();
    const b = (await page.locator("#stage").boundingBox())!;
    const cx = b.x + b.width / 2;
    const cy = b.y + b.height / 2;
    // sideways: the cycle steps and the drawing pauses; the view stays
    const deg = await page.locator("#scrub").inputValue();
    await swipe([[cx - 60, cy]], [[cx + 60, cy]]);
    await page.waitForTimeout(200);
    expect(await page.locator("#play").getAttribute("aria-pressed")).toBe("false");
    expect(await page.locator("#scrub").inputValue()).not.toBe(deg);
    expect(await page.locator("#record-view").getAttribute("aria-pressed")).toBe("true");
    // up or down: the page scrolls, the drawing stays
    const y0 = await page.evaluate(() => scrollY);
    await swipe([[cx, cy + 60]], [[cx, cy - 60]]);
    await page.waitForTimeout(300);
    expect(await page.evaluate(() => scrollY)).toBeGreaterThan(y0);
    expect(await page.locator("#record-view").getAttribute("aria-pressed")).toBe("true");
    // two fingers: an orbit
    await page.locator("#stage").scrollIntoViewIfNeeded();
    const c = (await page.locator("#stage").boundingBox())!;
    const x = c.x + c.width / 2;
    const y = c.y + c.height / 2;
    const t0 = Number(await page.locator(".stagebox").getAttribute("data-tilt"));
    await swipe([[x - 30, y + 40], [x + 30, y + 40]], [[x - 30, y - 40], [x + 30, y - 40]]);
    await page.waitForTimeout(200);
    expect(Number(await page.locator(".stagebox").getAttribute("data-tilt"))).not.toBe(t0);
    expect(await page.locator("#orbit").count()).toBe(0);
    // construction starts off; once on, its key shows under the narrow stage, and a tap picks a line out on the drawing,
    // a second lets it go
    expect(await page.locator("#ckey").isVisible()).toBe(false);
    await page.locator('.ovl .chip[data-o="construction"]').tap();
    const key = page.locator("#ckey button").first();
    expect(await page.locator("#ckey").isVisible()).toBe(true);
    const plain = await stageShot(page);
    await key.tap();
    expect(await key.getAttribute("aria-pressed")).toBe("true");
    await page.waitForTimeout(200);
    expect(differs(plain, await stageShot(page))).toBe(true);
    await key.tap();
    expect(await key.getAttribute("aria-pressed")).toBe("false");
    await page.locator('#presets button[data-view="FRONT"]').tap();
    await page.waitForSelector('#presets button[data-view="FRONT"][aria-pressed="true"]');
    await page.locator("#explode").fill("50");
    expect(await page.locator("#explodev").textContent()).toBe("50%");
    expect(errors).toEqual([]);
    await ctx.close();
  });
});

describe("a browser without WebGL2", () => {
  it("shows the still and a note, keeps the page, and offers no controls on the stage", async () => {
    const b = await chromium.launch({ channel: "chrome", headless: true, args: ["--disable-3d-apis", "--disable-gpu"] });
    const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
    const { page } = await open(ctx, "/mechanisms/four-bar/");
    await page.waitForSelector(".stagenote");
    expect(await page.locator(".stage img.still").count()).toBe(2);
    expect(await page.locator("#play").isDisabled()).toBe(true);
    expect(await page.locator("h1").textContent()).toContain("Four-bar");
    await b.close();
  });
});
