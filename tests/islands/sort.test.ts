// The library's orders (SS3): New by default (the added date, else the sheet number, highest first), Name A to Z,
// Oldest origin (offered only once records carry origin dates) and Sheet number; the order in the page address.
import { describe, expect, it } from "vitest";
import { DEFAULT_ORDER, offeredOrders, orderFrom, originKey, sortBy, type Sortable } from "../../site/src/sort";
import { SHEETS, sortableOf } from "../../site/src/data";

const ids = (list: (Sortable & { id: string })[]) => list.map((s) => s.id);
const s = (id: string, no: number, name: string, more: Partial<Sortable> = {}) => ({ id, no, name, ...more });

describe("the library's orders", () => {
  it("defaults to New", () => {
    expect(DEFAULT_ORDER).toBe("new");
  });

  it("puts the most recently added first under New, and breaks a tie on the same day by sheet number, highest first", () => {
    const list = [
      s("a", 1, "A", { added: "2026-10-01" }),
      s("b", 2, "B", { added: "2026-10-20" }),
      s("c", 3, "C", { added: "2026-10-01" }),
      s("d", 4, "D", { added: "2026-09-12" }),
    ];
    expect(ids(sortBy(list, "new"))).toEqual(["b", "c", "a", "d"]);
  });

  it("falls back to the sheet number, highest first, under New while records have no added date", () => {
    const list = [s("a", 1, "A"), s("b", 2, "B"), s("c", 3, "C")];
    expect(ids(sortBy(list, "new"))).toEqual(["c", "b", "a"]);
  });

  it("puts sheets without an added date after the dated ones under New", () => {
    const list = [s("a", 1, "A"), s("b", 2, "B", { added: "2026-10-01" }), s("c", 3, "C")];
    expect(ids(sortBy(list, "new"))).toEqual(["b", "c", "a"]);
  });

  it("sorts by name, A to Z, whatever the case, and by sheet number when two names are the same", () => {
    const list = [s("a", 1, "Watt linkage"), s("b", 2, "bevel gears"), s("c", 3, "Ackermann steering"), s("d", 4, "Bevel gears")];
    expect(ids(sortBy(list, "name"))).toEqual(["c", "b", "d", "a"]);
  });

  it("puts the oldest origin first, years before the year 1 included, and sheets without one last", () => {
    const list = [
      s("a", 1, "A", { origin: originKey("1784-06-01") }),
      s("b", 2, "B"),
      s("c", 3, "C", { origin: originKey("-0250-03-14") }),
      s("d", 4, "D", { origin: originKey("-0250-02-20") }),
      s("e", 5, "E", { origin: originKey("1784-06-01") }),
    ];
    expect(ids(sortBy(list, "origin"))).toEqual(["d", "c", "a", "e", "b"]);
  });

  it("sorts by sheet number, lowest first", () => {
    const list = [s("c", 3, "C"), s("a", 1, "A"), s("b", 2, "B")];
    expect(ids(sortBy(list, "sheet"))).toEqual(["a", "b", "c"]);
  });

  it("returns a new list and leaves the given one as it was", () => {
    const list = [s("a", 1, "A"), s("b", 2, "B")];
    const out = sortBy(list, "new");
    expect(out).not.toBe(list);
    expect(ids(list)).toEqual(["a", "b"]);
  });

  it("sorts any item through a key function", () => {
    const cards = [{ k: s("a", 1, "Zed") }, { k: s("b", 2, "Arm") }];
    expect(sortBy(cards, "name", (c) => c.k).map((c) => c.k.id)).toEqual(["b", "a"]);
  });
});

describe("the orders on offer and in the address", () => {
  it("offers Oldest origin only when some sheet has an origin date", () => {
    expect(offeredOrders([s("a", 1, "A"), s("b", 2, "B")])).toEqual(["new", "name", "sheet"]);
    expect(offeredOrders([s("a", 1, "A"), s("b", 2, "B", { origin: originKey("1600-01-01") })])).toEqual(["new", "name", "origin", "sheet"]);
  });

  it("reads ?sort= and falls back to New for a missing, unknown or unoffered order", () => {
    const offered = offeredOrders([s("a", 1, "A")]);
    expect(orderFrom("name", offered)).toBe("name");
    expect(orderFrom("sheet", offered)).toBe("sheet");
    expect(orderFrom(null, offered)).toBe("new");
    expect(orderFrom("price", offered)).toBe("new");
    expect(orderFrom("origin", offered)).toBe("new");
  });

  it("orders origin keys by day, month and year, both sides of the year 1", () => {
    const days = ["-0500-12-31", "-0001-01-01", "0001-01-01", "1400-02-28", "1400-03-01", "2026-10-21"];
    const keys = days.map((d) => originKey(d)!);
    expect([...keys].sort((a, b) => a - b)).toEqual(keys);
    expect(originKey("about 1800")).toBeUndefined();
  });
});

describe("the catalogue's sheets", () => {
  /** The first sheet with more fields on its record, as a record will carry them. */
  const sheetWith = (more: object) => ({ ...SHEETS[0]!, rec: { ...SHEETS[0]!.rec, ...more } });

  it("number every sheet and give each a name", () => {
    const keys = SHEETS.map(sortableOf);
    expect(keys.map((k) => k.no)).toEqual(SHEETS.map((_, i) => i + 1));
    for (const k of keys) expect(k.name.length).toBeGreaterThan(0);
  });

  it("read a record's added date when it has one", () => {
    expect(sortableOf(sheetWith({ added: "2026-10-20" })).added).toBe("2026-10-20");
    expect(sortableOf(sheetWith({ added: "last week" })).added).toBeUndefined();
  });

  it("read a record's date of origin when it has one", () => {
    expect(sortableOf(sheetWith({ origin: { date: "-0250-03-14", sure: "period" } })).origin).toBe(originKey("-0250-03-14"));
    expect(sortableOf(sheetWith({ origin: { date: "Roman era" } })).origin).toBeUndefined();
  });
});
