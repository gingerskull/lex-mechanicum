import { describe, expect, it } from "vitest";
import { daysSince, isRecovered, RECOVERED_DAYS } from "../../site/src/recovered";

describe("the Recovered badge", () => {
  const at = (iso: string) => new Date(iso);

  it("counts whole days in UTC, whatever the hour", () => {
    expect(daysSince("2026-10-22", at("2026-10-22T00:00:00Z"))).toBe(0);
    expect(daysSince("2026-10-22", at("2026-10-22T23:59:59Z"))).toBe(0);
    expect(daysSince("2026-10-22", at("2026-10-23T00:00:01Z"))).toBe(1);
    // a viewer east of Greenwich still counts in UTC
    expect(daysSince("2026-10-22", at("2026-10-23T01:30:00+03:00"))).toBe(0);
    expect(daysSince("2026-12-30", at("2027-01-02T12:00:00Z"))).toBe(3);
  });

  it("shows on day 0 and day 6, and is gone on day 7", () => {
    expect(RECOVERED_DAYS).toBe(7);
    expect(isRecovered("2026-10-22", at("2026-10-22T08:00:00Z"))).toBe(true);
    expect(isRecovered("2026-10-22", at("2026-10-28T23:00:00Z"))).toBe(true);
    expect(isRecovered("2026-10-22", at("2026-10-29T00:00:00Z"))).toBe(false);
  });

  it("does not show before the day, without a date, or for what is not a date", () => {
    expect(isRecovered("2026-10-22", at("2026-10-21T23:00:00Z"))).toBe(false);
    expect(isRecovered(undefined, at("2026-10-22T08:00:00Z"))).toBe(false);
    expect(isRecovered("", at("2026-10-22T08:00:00Z"))).toBe(false);
    expect(isRecovered("22 Oct 2026", at("2026-10-22T08:00:00Z"))).toBe(false);
  });
});
