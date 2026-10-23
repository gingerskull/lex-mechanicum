import { describe, expect, it } from "vitest";
import { loadCatalog } from "../../src/catalog";
import { imperialDate } from "../../src/catalog/imperial";

describe("imperialDate", () => {
  it("writes the part of the year gone, the year within the millennium and the millennium", () => {
    expect(imperialDate("2026-10-20")).toBe("800.026.M3");
    expect(imperialDate("2026-01-01")).toBe("000.026.M3");
    expect(imperialDate("2026-12-31")).toBe("997.026.M3");
    expect(imperialDate("1784-04-28")).toBe("322.784.M2");
  });

  it("counts a leap year's 366 days", () => {
    // 29 Feb 2024: 59 days gone of 366
    expect(imperialDate("2024-02-29")).toBe("161.024.M3");
    expect(imperialDate("2024-12-31")).toBe("997.024.M3");
    expect(imperialDate("2023-02-29")).toBeNull();
  });

  it("puts years 1 to 1000 in M1, 1001 to 2000 in M2 and 2001 to 3000 in M3", () => {
    expect(imperialDate("0001-01-01")).toBe("000.001.M1");
    expect(imperialDate("0999-07-02")?.endsWith(".999.M1")).toBe(true);
    expect(imperialDate("1000-07-02")?.endsWith(".000.M1")).toBe(true);
    expect(imperialDate("1001-07-02")?.endsWith(".001.M2")).toBe(true);
    expect(imperialDate("2000-07-02")?.endsWith(".000.M2")).toBe(true);
    expect(imperialDate("2001-07-02")?.endsWith(".001.M3")).toBe(true);
  });

  it("counts years before 1 back from year 0 in M0", () => {
    expect(imperialDate("-0250-12-16")?.endsWith(".250.M0")).toBe(true);
    expect(imperialDate("-0001-06-30")?.endsWith(".001.M0")).toBe(true);
    expect(imperialDate("-1000-06-30")?.endsWith(".000.M0")).toBe(true);
    // 1 BC is a leap year (astronomical year 0)
    expect(imperialDate("-0001-02-29")).not.toBeNull();
    expect(imperialDate("-0002-02-29")).toBeNull();
  });

  it("refuses what is not a date", () => {
    for (const d of ["", "2026-10", "2026-13-01", "2026-04-31", "0000-01-01", "26-10-20"]) expect(imperialDate(d), d).toBeNull();
  });

  it("gives every record's origin a date of the same width", () => {
    for (const r of loadCatalog().mechanisms) expect(imperialDate(r.origin?.date ?? ""), r.id).toMatch(/^\d{3}\.\d{3}\.M\d$/);
  });
});
