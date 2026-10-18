import { describe, expect, it } from "vitest";
import type { CatalogRecord } from "../../src/catalog/schema";
import { validate } from "../../src/catalog/validate";
import { record } from "./fixtures";

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
