import { describe, expect, it } from "vitest";
import { staleCards, type CardFingerprint } from "../../tools/cards";

const fp = (o: Partial<CardFingerprint> = {}): CardFingerprint => ({ package: "p", model: "m", renderer: "r", style: "s", card: "c", ...o });
const all = () => true;

describe("social card fingerprints", () => {
  it("leave a card drawn from the same things alone", () => {
    expect(staleCards({ a: fp(), b: fp() }, { a: fp(), b: fp() }, all)).toEqual([]);
  });

  it("redraw only the mechanism whose drawing or words changed, and say what changed", () => {
    expect(staleCards({ a: fp(), b: fp() }, { a: fp({ package: "p2" }), b: fp() }, all)).toEqual([{ id: "a", why: ["package"] }]);
    expect(staleCards({ a: fp(), b: fp() }, { a: fp(), b: fp({ card: "c2" }) }, all)).toEqual([{ id: "b", why: ["card"] }]);
  });

  it("redraw every one when the renderer or the style changed", () => {
    for (const k of ["renderer", "style"] as const)
      expect(staleCards({ a: fp(), b: fp() }, { a: fp({ [k]: "x" }), b: fp({ [k]: "x" }) }, all).map((s) => s.id)).toEqual(["a", "b"]);
  });

  it("draw a new mechanism and a missing card", () => {
    expect(staleCards({}, { a: fp() }, all)).toEqual([{ id: "a", why: ["new"] }]);
    expect(staleCards({ a: fp() }, { a: fp() }, (f) => !f.endsWith("a.jpg"))).toEqual([{ id: "a", why: ["missing"] }]);
  });
});
