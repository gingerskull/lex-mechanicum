import { describe, expect, it } from "vitest";
import type { CatalogRecord } from "../../src/catalog/schema";
import { datesRunOut, validate } from "../../src/catalog/validate";
import { record, seasonal, withoutLinks } from "./fixtures";

describe("validate", () => {
  it("passes a valid record", () => {
    expect(validate([record("ok")])).toEqual([]);
  });

  it("names a misspelt family", () => {
    expect(validate([record("x", { family: "Linkages" as CatalogRecord["family"] })])).toEqual([
      'x: family "Linkages" not in vocabulary',
    ]);
  });

  it("names a record with no video", () => {
    expect(validate([record("x", { media: [{ title: "p", url: "https://example.org/p", kind: "photos" }] })])).toEqual([
      "x: no video",
    ]);
  });

  it("names a bad URL", () => {
    const r = record("x");
    r.references[1]!.url = "www.example.org";
    expect(validate([r])).toEqual(["x: bad url www.example.org"]);
  });

  it("names too few references, unless waived; real-world examples may be none", () => {
    const r = record("x", { references: [], real_world: [] });
    expect(validate([r])).toEqual(["x: 0 references, at least 2 needed"]);
    expect(validate([{ ...r, waive: ["references"] }])).toEqual([]);
  });

  it("takes only YouTube videos as real-world examples", () => {
    const r = record("x");
    r.real_world![1]!.url = "https://www.example.org/product";
    expect(validate([r])).toEqual(["x: real-world example not a YouTube video: https://www.example.org/product"]);
  });

  it("names a duplicate id", () => {
    expect(validate([record("x"), record("x")])).toEqual(["x: duplicate id"]);
  });
});

describe("validate a seasonal record (P14)", () => {
  const season = seasonal("s").season!;

  it("passes one with no links, its season block and 2 to 4 images", () => {
    expect(validate([seasonal("s")])).toEqual([]);
    expect(validate([withoutLinks(seasonal("s"))])).toEqual([]);
  });

  it("names the links a seasonal record must not have: its images take their place", () => {
    const links = record("x");
    expect(validate([seasonal("s", { references: links.references, media: links.media, real_world: links.real_world })])).toEqual([
      "s: references on a seasonal record: its images take their place (P14)",
      "s: media on a seasonal record: its images take their place (P14)",
      "s: real_world on a seasonal record: its images take their place (P14)",
    ]);
  });

  it("checks the occasion, the date rule, the duty and unknown fields", () => {
    const bad = { ...season, occasion: " ", date_rule: "", duty: "Festive", launch: { from: "2026-10-28", until: "2026-11-09" } };
    expect(validate([seasonal("s", { season: bad as unknown as typeof season })])).toEqual([
      "s: season.launch is not a field of the season block",
      "s: season.occasion missing",
      "s: season.date_rule missing",
      's: season.duty "Festive" not in vocabulary',
    ]);
  });

  it("wants real days, each end on or after its start, the occurrences in order", () => {
    const dates = [
      { start: "2026-02-30", end: "2026-03-01" },
      { start: "2026-12-26", end: "2027-01-01" },
      { start: "2026-12-31", end: "2027-01-01" },
      { start: "2027-12-26", end: "2027-12-20" },
    ];
    expect(validate([seasonal("s", { season: { ...season, dates } })])).toEqual([
      "s: season.dates[0] is not a start and an end YYYY-MM-DD",
      "s: season.dates[2] starts (2026-12-31) before the occurrence before it has ended (2027-01-01)",
      "s: season.dates[3] ends (2027-12-20) before it starts (2027-12-26)",
    ]);
    expect(validate([seasonal("s", { season: { ...season, dates: [] } })])).toEqual(["s: season.dates has no occurrence"]);
  });

  it("wants 2 to 4 images, each with a prompt and an alt, a file that is a .webp name", () => {
    const img = { prompt: "p", alt: "a" };
    expect(validate([seasonal("s", { images: [img] })])).toEqual(["s: 1 images, 2 to 4 needed"]);
    expect(validate([seasonal("s", { images: [img, img, img, img, img] })])).toEqual(["s: 5 images, 2 to 4 needed"]);
    expect(validate([seasonal("s", { images: [img, img, img, img] })])).toEqual([]);
    expect(validate([seasonal("s", { images: [{ prompt: "", alt: "a" }, { prompt: "p", alt: "", file: "s-2.png" }] })])).toEqual([
      "s: images[0].prompt missing",
      "s: images[1].alt missing",
      's: images[1].file "s-2.png" is not a .webp file name',
    ]);
  });

  it("keeps images to seasonal records", () => {
    expect(validate([record("x", { images: seasonal("s").images! })])).toEqual(["x: images on a record without a season block (P14)"]);
  });

  it("flags dates that have run out: no occurrence starts within the next 13 months", () => {
    const r = seasonal("s");
    expect(datesRunOut(r, "2026-10-28")).toBeNull();
    // an occurrence starting today counts; the day after, none is left
    expect(datesRunOut(r, "2027-10-31")).toBeNull();
    expect(datesRunOut(r, "2027-11-01")).toBe("s: no occurrence of Halloween starts between 2027-11-01 and 2028-12-01; add the next years to season.dates");
    expect(datesRunOut(record("x"), "2040-01-01")).toBeNull();
    const far = seasonal("f", { season: { ...season, dates: [{ start: "2028-01-01", end: "2028-01-01" }] } });
    expect(datesRunOut(far, "2026-10-28")).toMatch(/^f: no occurrence/);
  });
});
