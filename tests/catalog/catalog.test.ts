import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { buildCatalog, serializeCatalog } from "../../src/catalog/build";
import { loadCatalog, recordById } from "../../src/catalog/index";
import { validate } from "../../src/catalog/validate";
import { allIds } from "../../src/mechanisms";
import { CATALOG, readSources } from "../../tools/catalog";

describe("the real catalogue", () => {
  const committed = readFileSync(CATALOG, "utf8");
  const generated = (JSON.parse(committed) as { generated: string }).generated;
  const { catalog, problems } = buildCatalog(readSources(), generated);

  it("merges 92 valid records", () => {
    expect(problems).toEqual([]);
    expect(catalog.mechanisms).toHaveLength(92);
  });

  it("gives every record a kin and a teaching block that validate as record v3 (the retired build fields wait for the cut-over)", () => {
    expect(validate(catalog.mechanisms, { asVersion: 3 })).toEqual([]);
    for (const r of catalog.mechanisms) {
      expect(r.kin, r.id).toBeDefined();
      expect(r.teaching?.review.verdict, r.id).toMatch(/^(keep|tweak|rethink)$/);
    }
  });

  it("gives every record an origin date from sources/origin.json", () => {
    for (const r of catalog.mechanisms) expect(r.origin?.date, r.id).toMatch(/^-?\d{4}-\d{2}-\d{2}$/);
  });

  it("gives every drawn mechanism the day its sheet went live, from sources/added.json", () => {
    for (const id of allIds()) expect(recordById(id)?.added, id).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("matches the committed mechanisms.json byte for byte (run npm run catalog if not)", () => {
    expect(serializeCatalog(catalog)).toBe(committed);
  });

  it("is what loadCatalog and recordById serve", () => {
    expect(loadCatalog().mechanisms).toHaveLength(92);
    expect(recordById("four-bar")?.motion.label).toBe("Rotary → Oscillating");
    expect(recordById("nope")).toBeUndefined();
  });
});
