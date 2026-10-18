import { describe, expect, it } from "vitest";
import { stale, type Fingerprint } from "../../tools/thumbs";

const fp = (o: Partial<Fingerprint> = {}): Fingerprint => ({ package: "p", model: "m", renderer: "r", style: "s", view: "v", ...o });
const all = () => true;

describe("thumbnail fingerprints", () => {
  it("leave a thumbnail drawn from the same things alone", () => {
    expect(stale({ a: fp(), b: fp() }, { a: fp(), b: fp() }, all)).toEqual([]);
  });

  it("redraw only the mechanism whose package or model changed, and say what changed", () => {
    expect(stale({ a: fp(), b: fp() }, { a: fp({ package: "p2" }), b: fp() }, all)).toEqual([{ id: "a", why: ["package"] }]);
    expect(stale({ a: fp(), b: fp() }, { a: fp(), b: fp({ model: "m2" }) }, all)).toEqual([{ id: "b", why: ["model"] }]);
  });

  it("redraw every one when the renderer, the style or the view changed", () => {
    for (const k of ["renderer", "style", "view"] as const)
      expect(stale({ a: fp(), b: fp() }, { a: fp({ [k]: "x" }), b: fp({ [k]: "x" }) }, all).map((s) => s.id)).toEqual(["a", "b"]);
  });

  it("draw a new mechanism and a missing image", () => {
    expect(stale({}, { a: fp() }, all)).toEqual([{ id: "a", why: ["new"] }]);
    expect(stale({ a: fp() }, { a: fp() }, (f) => !f.endsWith("a-light-still.webp"))).toEqual([{ id: "a", why: ["missing"] }]);
  });
});
