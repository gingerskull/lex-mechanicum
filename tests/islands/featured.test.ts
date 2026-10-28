// The featured slot's pick (SS16): seasonal mechanisms while listed, by their holidays' order; otherwise one library
// sheet for three UTC days, the same for every visitor, never the previous period's, never a seasonal one.
import { describe, expect, it } from "vitest";
import { EPOCH, PERIOD_DAYS, featured, periodOf, rotationPick, type Candidate } from "../../site/src/featured";
import { encodeWindows, windowsOf } from "../../site/src/season";

const LIB: Candidate[] = Array.from({ length: 12 }, (_, i) => ({ id: `m${String(i).padStart(2, "0")}` }));
const seasonal = (id: string, start: string, end = start): Candidate => ({ id, season: encodeWindows(windowsOf([{ start, end }])) });
const HALLOWEEN = seasonal("crypt", "2026-10-31");
const CHRISTMAS = seasonal("toggle", "2026-12-25");
const KWANZAA = seasonal("planetary", "2026-12-26", "2027-01-01");
// local noon, as the seasonal listing reads the visitor's own date
const local = (y: number, m: number, d: number) => new Date(y, m - 1, d, 12);
const utc = (y: number, m: number, d: number, h = 12) => new Date(Date.UTC(y, m - 1, d, h));

describe("the seasonal pick", () => {
  it("features a seasonal mechanism while it is listed, before any rotation pick", () => {
    expect(featured([...LIB, HALLOWEEN], local(2026, 10, 29))).toEqual({ ids: ["crypt"], seasonal: true });
    expect(featured([...LIB, HALLOWEEN], local(2026, 11, 2))).toEqual({ ids: ["crypt"], seasonal: true });
  });

  it("shows every one listed at once, in the order of their windows", () => {
    expect(featured([KWANZAA, ...LIB, CHRISTMAS], local(2026, 12, 24))).toEqual({ ids: ["toggle", "planetary"], seasonal: true });
    expect(featured([KWANZAA, ...LIB, CHRISTMAS], local(2026, 12, 28))).toEqual({ ids: ["planetary"], seasonal: true });
  });

  it("never picks a seasonal mechanism out of its window", () => {
    for (let d = 0; d < 400; d++) {
      const now = new Date(local(2026, 11, 3).getTime() + d * 86_400_000);
      const f = featured([...LIB, HALLOWEEN], now);
      if (f.seasonal) continue;
      expect(f.ids).toHaveLength(1);
      expect(f.ids[0]).not.toBe("crypt");
    }
  });
});

describe("the rotation", () => {
  it("counts periods of three UTC days from the epoch", () => {
    expect(EPOCH).toBe("2026-10-01");
    expect(PERIOD_DAYS).toBe(3);
    expect(periodOf(utc(2026, 10, 1, 0))).toBe(0);
    expect(periodOf(utc(2026, 10, 3, 23))).toBe(0);
    expect(periodOf(utc(2026, 10, 4, 0))).toBe(1);
    expect(periodOf(utc(2026, 9, 30, 23))).toBe(-1);
  });

  it("keeps one pick through its period, for every visitor, and changes it after", () => {
    const ids = LIB.map((s) => s.id);
    const a = featured(LIB, utc(2026, 10, 28, 0)).ids;
    // the same UTC day early and late, and the period's other days
    expect(featured(LIB, utc(2026, 10, 28, 23)).ids).toEqual(a);
    expect(featured(LIB, utc(2026, 10, 29)).ids).toEqual(a);
    expect(featured(LIB, utc(2026, 10, 30)).ids).toEqual(a);
    expect(featured(LIB, utc(2026, 10, 31)).ids).not.toEqual(a);
    expect(ids).toContain(a[0]);
  });

  it("never repeats the previous period's pick, and comes round to every sheet", () => {
    const ids = LIB.map((s) => s.id);
    const seen = new Set<string>();
    let last = rotationPick(ids, -1);
    for (let p = 0; p < 400; p++) {
      const pick = rotationPick(ids, p)!;
      expect(pick).not.toBe(last);
      seen.add(pick);
      last = pick;
    }
    expect(seen.size).toBe(ids.length);
  });

  it("is the same whatever order the sheets come in", () => {
    const ids = LIB.map((s) => s.id);
    for (let p = 0; p < 50; p++) expect(rotationPick([...ids].reverse(), p)).toBe(rotationPick(ids, p));
  });

  it("moves few picks when a sheet joins the library", () => {
    const ids = Array.from({ length: 40 }, (_, i) => `s${i}`);
    let moved = 0;
    for (let p = 0; p < 300; p++) if (rotationPick(ids, p) !== rotationPick([...ids, "new"], p)) moved++;
    expect(moved / 300).toBeLessThan(0.1);
  });

  it("features nothing in an empty library, and the one sheet of a library of one", () => {
    expect(featured([], utc(2026, 10, 28))).toEqual({ ids: [], seasonal: false });
    expect(rotationPick(["only"], 5)).toBe("only");
  });
});
