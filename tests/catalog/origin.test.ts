import { describe, expect, it } from "vitest";
import { dayOfId, fillDate, originProblems } from "../../src/catalog/origin";
import type { Origin } from "../../src/catalog/schema";
import { validate } from "../../src/catalog/validate";
import { record } from "./fixtures";

const withOrigin = (origin: Partial<Origin> | undefined) => record("x", { origin: origin as Origin });

describe("dayOfId", () => {
  it("gives the same day for the same id, a different one for another id", () => {
    expect(dayOfId("four-bar")).toEqual(dayOfId("four-bar"));
    expect(dayOfId("four-bar")).toEqual({ month: 2, day: 6 });
    expect(dayOfId("geneva")).toEqual({ month: 2, day: 19 });
  });

  it("stays within months 1 to 12 and days 1 to 28", () => {
    for (const id of ["a", "b", "slider-crank", "tusi-couple", "x".repeat(40)]) {
      const { month, day } = dayOfId(id);
      expect(month).toBeGreaterThanOrEqual(1);
      expect(month).toBeLessThanOrEqual(12);
      expect(day).toBeGreaterThanOrEqual(1);
      expect(day).toBeLessThanOrEqual(28);
    }
  });
});

describe("fillDate", () => {
  it("writes four-digit years, negative before the year 1", () => {
    expect(fillDate("four-bar", 1235)).toBe("1235-02-06");
    expect(fillDate("four-bar", 60)).toBe("0060-02-06");
    expect(fillDate("four-bar", -250)).toBe("-0250-02-06");
  });
});

describe("originProblems", () => {
  it("passes a full date, and a year or a period on the id's day", () => {
    expect(originProblems(withOrigin({ date: "1781-10-25", precision: "day", note: "n" }))).toEqual([]);
    expect(originProblems(withOrigin({ date: fillDate("x", 1781), precision: "year", note: "n" }))).toEqual([]);
    expect(originProblems(withOrigin({ date: fillDate("x", -250), precision: "period", note: "n" }))).toEqual([]);
  });

  it("names a record with no origin, and validate fails on it", () => {
    expect(originProblems(withOrigin(undefined))).toEqual(["x: origin missing"]);
    expect(validate([withOrigin(undefined)])).toEqual(["x: origin missing"]);
  });

  it("names a date that is not YYYY-MM-DD or not in the calendar, and year 0", () => {
    for (const date of ["1781", "1781-1-25", "81-10-25", "1781-13-01", "1781-04-31", "0000-01-01", "-0000-01-01"])
      expect(originProblems(withOrigin({ date, precision: "day", note: "n" }))).toEqual([`x: origin.date "${date}" is not a date YYYY-MM-DD`]);
  });

  it("names an unknown precision and a missing note", () => {
    expect(originProblems(withOrigin({ date: "1781-10-25", precision: "month" as Origin["precision"], note: " " }))).toEqual([
      'x: origin.precision "month" not in vocabulary',
      "x: origin.note missing",
    ]);
  });

  it("names a year or a period not on the id's day", () => {
    expect(originProblems(withOrigin({ date: "1781-10-25", precision: "year", note: "n" }))).toEqual([
      `x: origin.date 1781-10-25 at precision year should be ${fillDate("x", 1781)}`,
    ]);
  });
});
