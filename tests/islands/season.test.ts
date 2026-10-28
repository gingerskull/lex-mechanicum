// The seasonal listing (P14): a seasonal mechanism is listed from 3 days before each occurrence of its holiday to the end
// of the 2nd day after it, by the visitor's local date; the library's sheets come first and keep their numbers; related
// links run both ways. Fixture records, as no seasonal record is in the catalogue yet.
import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { loadCatalog } from "../../src/catalog";
import { imagesShown, neighbours, relatedOf, seasonalFor, sheetsOf } from "../../site/src/data";
import { addDays, decodeWindows, encodeWindows, inSeason, listedOn, localDay, longDate, returnsOn, windowsOf } from "../../site/src/season";
import { record, seasonal } from "../catalog/fixtures";

const day = (d: string) => ({ start: d, end: d });

describe("the listing windows", () => {
  it("move a day on the calendar across months, years and leap days", () => {
    expect(addDays("2026-10-31", -3)).toBe("2026-10-28");
    expect(addDays("2026-12-30", 3)).toBe("2027-01-02");
    expect(addDays("2028-03-01", -1)).toBe("2028-02-29");
    expect(addDays("2027-03-01", -1)).toBe("2027-02-28");
    expect(() => addDays("31 Oct", 1)).toThrow();
  });

  it("run from 3 days before the start to 2 days after the end, as the plan's table lists them", () => {
    expect(windowsOf([day("2026-10-31")])).toEqual([{ from: "2026-10-28", until: "2026-11-02" }]);
    expect(windowsOf([day("2026-11-26")])).toEqual([{ from: "2026-11-23", until: "2026-11-28" }]);
    expect(windowsOf([{ start: "2026-12-04", end: "2026-12-12" }])).toEqual([{ from: "2026-12-01", until: "2026-12-14" }]);
    expect(windowsOf([{ start: "2026-12-26", end: "2027-01-01" }])).toEqual([{ from: "2026-12-23", until: "2027-01-03" }]);
    expect(windowsOf([{ start: "2026-12-31", end: "2027-01-01" }])).toEqual([{ from: "2026-12-28", until: "2027-01-03" }]);
  });

  it("go on the page and back unchanged, leaving out what is not a pair of days", () => {
    const ws = windowsOf([day("2026-10-31"), day("2027-10-31")]);
    expect(encodeWindows(ws)).toBe("2026-10-28/2026-11-02 2027-10-28/2027-11-02");
    expect(decodeWindows(encodeWindows(ws))).toEqual(ws);
    expect(decodeWindows("2026-10-28/2026-11-02 junk 2027-10-28 2027-10-28/x")).toEqual([ws[0]]);
    expect(decodeWindows(undefined)).toEqual([]);
  });

  it("list from the first day's 00:00 to the end of the last day, and not a day either side", () => {
    const ws = windowsOf([day("2026-10-31")]);
    expect(listedOn(ws, "2026-10-27")).toBe(false);
    expect(listedOn(ws, "2026-10-28")).toBe(true);
    expect(listedOn(ws, "2026-11-02")).toBe(true);
    expect(listedOn(ws, "2026-11-03")).toBe(false);
    expect(listedOn([], "2026-10-31")).toBe(false);
  });

  it("go by the visitor's local date", () => {
    // local time: a Date built from its parts is the visitor's own day, whatever the time zone of the test machine
    expect(localDay(new Date(2026, 9, 28, 0, 0, 0))).toBe("2026-10-28");
    expect(localDay(new Date(2026, 9, 27, 23, 59, 59))).toBe("2026-10-27");
    const s = encodeWindows(windowsOf([day("2026-10-31")]));
    expect(inSeason(s, new Date(2026, 9, 27, 23, 59, 59))).toBe(false);
    expect(inSeason(s, new Date(2026, 9, 28, 0, 0, 0))).toBe(true);
    expect(inSeason(s, new Date(2026, 10, 2, 23, 59, 59))).toBe(true);
    expect(inSeason(s, new Date(2026, 10, 3, 0, 0, 0))).toBe(false);
  });

  it("may overlap: Christmas, Kwanzaa and New Year are listed together", () => {
    const christmas = windowsOf([day("2026-12-25")]);
    const kwanzaa = windowsOf([{ start: "2026-12-26", end: "2027-01-01" }]);
    const newYear = windowsOf([{ start: "2026-12-31", end: "2027-01-01" }]);
    const on = (d: string) => [christmas, kwanzaa, newYear].map((w) => listedOn(w, d));
    expect(on("2026-12-24")).toEqual([true, true, false]);
    expect(on("2026-12-28")).toEqual([false, true, true]);
    expect(on("2027-01-04")).toEqual([false, false, false]);
  });

  it("say when the mechanism comes back, in the page's form", () => {
    const ws = windowsOf([day("2026-10-31"), day("2027-10-31")]);
    expect(returnsOn(ws, "2026-11-03")).toBe("2027-10-28");
    expect(returnsOn(ws, "2026-01-10")).toBe("2026-10-28");
    expect(returnsOn(ws, "2027-11-03")).toBeUndefined();
    expect(longDate("2027-10-28")).toBe("28 October 2027");
    expect(longDate("2027-01-03")).toBe("3 January 2027");
  });
});

describe("the sheets with seasonal mechanisms", () => {
  const recs = [record("a"), seasonal("s", { related: ["b", "t"] }), record("b"), seasonal("t", { related: ["a"] }), record("c")];
  const sheets = sheetsOf(recs);
  const of = (id: string) => sheets.find((x) => x.id === id)!;

  it("number the library first, so its numbers run on without a gap, and the seasonal mechanisms after it", () => {
    expect(sheets.map((x) => `${x.no} ${x.id}`)).toEqual(["ST-01 a", "ST-02 b", "ST-03 c", "ST-04 s", "ST-05 t"]);
    expect(of("a").season).toBeUndefined();
    expect(of("s").season).toBe("2026-10-28/2026-11-02 2027-10-28/2027-11-02");
  });

  it("change nothing for a library without seasonal mechanisms", () => {
    const lib = loadCatalog().mechanisms.slice(0, 5);
    expect(sheetsOf(lib).map((x) => [x.id, x.no, x.season])).toEqual(lib.map((r, i) => [r.id, `ST-0${i + 1}`, undefined]));
  });

  it("step Previous and Next round the library only, a seasonal page after its last sheet", () => {
    expect(neighbours(of("a"), sheets).map((x) => x.id)).toEqual(["c", "b"]);
    expect(neighbours(of("c"), sheets).map((x) => x.id)).toEqual(["b", "a"]);
    expect(neighbours(of("s"), sheets).map((x) => x.id)).toEqual(["c", "a"]);
    const lib = sheetsOf([record("a"), record("b")]);
    expect(neighbours(lib[0]!, lib).map((x) => x.id)).toEqual(["b", "b"]);
  });

  it("link both ways: a seasonal page to what it names, a library page back to the seasonal ones that name it", () => {
    expect(relatedOf(of("s"), sheets).map((x) => x.id)).toEqual(["b", "t"]);
    expect(seasonalFor(of("b"), sheets).map((x) => x.id)).toEqual(["s"]);
    expect(seasonalFor(of("a"), sheets).map((x) => x.id)).toEqual(["t"]);
    expect(seasonalFor(of("c"), sheets)).toEqual([]);
    // a seasonal page lists what it names itself; it gets no back links
    expect(seasonalFor(of("t"), sheets)).toEqual([]);
  });

  it("show only the images that have a file", () => {
    expect(imagesShown(of("s").rec).map((m) => m.file)).toEqual(["s-1.webp"]);
    expect(imagesShown(of("a").rec)).toEqual([]);
  });

  it("find every image file the catalogue names in site/seasonal", () => {
    for (const r of loadCatalog().mechanisms)
      for (const m of imagesShown(r)) expect(existsSync(new URL(`../../site/seasonal/${m.file}`, import.meta.url)), `${r.id}: ${m.file}`).toBe(true);
  });
});
