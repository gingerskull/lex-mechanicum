// The stage in a real browser (SS5, SS13), local only: `npm run test:e2e` (builds the site with four-bar, bevel-gears and
// oscillating-cylinder on the v3 stage, then runs this). A 2.5D page and a v3 page both work; the v3 stage orbits, snaps to
// the named views, takes the record's section view and controls, honours the dial, keeps the page's scroll on a phone
// until Orbit is on; the 3D stamp shows on v3 pages and cards only; a browser without WebGL2 gets the still.
import { existsSync, readFileSync } from "node:fs";
import { createServer, type Server } from "node:http";
import { extname, join } from "node:path";
import { chromium, type Browser, type BrowserContext, type Page } from "playwright-core";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const OUT = join("dist", "site");
const TYPES: Record<string, string> = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".webp": "image/webp", ".woff2": "font/woff2" };
const V3 = ["four-bar", "bevel-gears", "oscillating-cylinder"];
const V1 = "slider-crank";

let server: Server;
let base = "";
let browser: Browser;
beforeAll(async () => {
  if (!existsSync(join(OUT, "packages", "four-bar.mx2"))) throw new Error("build the site with SITE_V3=four-bar,bevel-gears,oscillating-cylinder first (npm run test:e2e does)");
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
const drag = async (page: Page, dx: number, dy: number) => {
  const b = (await page.locator("#stage").boundingBox())!;
  const x = b.x + b.width / 2;
  const y = b.y + b.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + dx / 2, y + dy / 2, { steps: 4 });
  await page.mouse.move(x + dx, y + dy, { steps: 4 });
  await page.mouse.up();
};

describe("a 2.5D page and a v3 page", () => {
  it("keeps today's stage on a 2.5D mechanism: no stamp, its tilt slider and play work", async () => {
    const ctx = await desktop();
    const { page, errors } = await open(ctx, "/mechanisms/" + V1 + "/");
    await page.waitForFunction(() => document.getElementById("scrubv")?.textContent !== "63°", null, { timeout: 30_000 });
    expect(await page.locator(".stamp3d").count()).toBe(0);
    expect(await page.locator(".stagebox").getAttribute("data-engine")).toBeNull();
    expect(await page.locator("#presets").count()).toBe(0);
    await page.locator("#play").click();
    expect(await page.locator("#play").getAttribute("aria-pressed")).toBe("false");
    await page.locator("#tilt").fill("0");
    expect(await page.locator("#tiltv").textContent()).toBe("Plan");
    expect(errors).toEqual([]);
    await ctx.close();
  });

  it("opens a v3 page in the record's view with the stamp, and plays it", async () => {
    const ctx = await desktop();
    const { page, errors } = await open(ctx, "/mechanisms/four-bar/");
    await ready(page);
    expect(await page.locator(".stamp3d").count()).toBe(1);
    expect(await page.locator("#record-view").getAttribute("aria-pressed")).toBe("true");
    expect(await page.locator('#presets button[data-view="PLAN"]').getAttribute("aria-pressed")).toBe("true");
    const a = await stageShot(page);
    await page.waitForTimeout(600);
    expect(differs(a, await stageShot(page))).toBe(true);
    expect(errors).toEqual([]);
    await ctx.close();
  });

  it("draws the output plot beside a v3 stage", async () => {
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

  it("shows the stamp on the library cards of v3 mechanisms only", async () => {
    const ctx = await desktop();
    const { page } = await open(ctx, "/");
    for (const id of V3) expect(await page.locator('.card[data-id="' + id + '"] .stamp3d').count(), id).toBe(1);
    expect(await page.locator('.card[data-id="' + V1 + '"] .stamp3d').count()).toBe(0);
    expect(await page.locator(".stamp3d").count()).toBe(V3.length);
    await ctx.close();
  });
});

describe("library cards", () => {
  it("animate a v3 card with the v3 renderer on hover, and a 2.5D card with today's", async () => {
    const ctx = await desktop();
    const { page, errors } = await open(ctx, "/");
    for (const id of ["four-bar", V1]) {
      const card = page.locator('.card[data-id="' + id + '"]');
      await card.scrollIntoViewIfNeeded();
      await card.hover();
      await page.waitForSelector('.card[data-id="' + id + '"] .thumb.live', { timeout: 30_000 });
      await page.mouse.move(2, 2);
    }
    const loaded = await page.evaluate(() => performance.getEntriesByType("resource").map((e) => e.name));
    expect(loaded.some((n) => n.endsWith("/packages/four-bar.mx2"))).toBe(true);
    expect(loaded.some((n) => n.endsWith("/packages/four-bar.mxp"))).toBe(false);
    expect(errors).toEqual([]);
    await ctx.close();
  });
});

describe("the v3 stage on a desktop", () => {
  it("orbits by drag, names the view it lands on, and resets", async () => {
    const ctx = await desktop();
    const { page, errors } = await open(ctx, "/mechanisms/four-bar/");
    await ready(page);
    await pause(page);
    const plan = await stageShot(page);
    await drag(page, 40, -120);
    expect(await page.locator("#record-view").getAttribute("aria-pressed")).toBe("false");
    expect(Number(await page.locator("#tilt").inputValue())).toBeGreaterThan(20);
    expect(differs(plan, await stageShot(page))).toBe(true);
    await page.locator('#presets button[data-view="SIDE"]').click();
    expect(await page.locator("#tiltv").textContent()).toBe("Side");
    expect(await page.locator('#presets button[data-view="SIDE"]').getAttribute("aria-pressed")).toBe("true");
    await page.locator('#presets button[data-view="ISOMETRIC"]').click();
    expect(await page.locator('#presets button[data-view="ISOMETRIC"]').getAttribute("aria-pressed")).toBe("true");
    await page.locator("#record-view").click();
    expect(await page.locator("#record-view").getAttribute("aria-pressed")).toBe("true");
    expect(errors).toEqual([]);
    await ctx.close();
  });

  it("moves with the tilt slider and explodes", async () => {
    const ctx = await desktop();
    const { page, errors } = await open(ctx, "/mechanisms/four-bar/");
    await ready(page);
    await pause(page);
    const a = await stageShot(page);
    await page.locator("#tilt").fill("60");
    expect(await page.locator("#tiltv").textContent()).toBe("60°");
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
    expect(await page.locator("#tiltv").textContent()).toBe("Aux");
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

describe("the v3 stage on a phone", () => {
  it("lets a finger scroll the page, turns the drawing sideways, and orbits freely once Orbit is on", async () => {
    const ctx = await phone();
    const { page, errors } = await open(ctx, "/mechanisms/four-bar/");
    await ready(page);
    await pause(page);
    const cdp = await ctx.newCDPSession(page);
    const swipe = async (x0: number, y0: number, x1: number, y1: number) => {
      await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: x0, y: y0 }] });
      for (let i = 1; i <= 8; i++) await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: x0 + ((x1 - x0) * i) / 8, y: y0 + ((y1 - y0) * i) / 8 }] });
      await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    };
    await page.locator("#stage").scrollIntoViewIfNeeded();
    const b = (await page.locator("#stage").boundingBox())!;
    const cx = b.x + b.width / 2;
    const cy = b.y + b.height / 2;
    const before = await stageShot(page);
    await swipe(cx - 60, cy, cx + 60, cy);
    await page.waitForTimeout(200);
    expect(differs(before, await stageShot(page))).toBe(true);
    await page.locator("#orbit").click();
    expect(await page.locator("#orbit").getAttribute("aria-pressed")).toBe("true");
    const t0 = Number(await page.locator("#tilt").inputValue());
    await swipe(cx, cy + 40, cx, cy - 40);
    await page.waitForTimeout(200);
    expect(Number(await page.locator("#tilt").inputValue())).not.toBe(t0);
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
