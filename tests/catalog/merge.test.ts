import { describe, expect, it } from "vitest";
import { mergeSources } from "../../src/catalog/merge";
import { record } from "./fixtures";

const p3 = { product: "p3", use: "u", url: "https://www.youtube.com/shorts/aaaaaaaaaa3" };

describe("mergeSources", () => {
  const files = [
    { name: "b2.json", json: [record("c", { related: ["a", "c", "nope"] })] },
    { name: "b1.json", json: [record("a"), record("b")] },
    { name: "rw1.json", json: { a: { real_world: [p3, { ...p3, url: "https://www.youtube.com/watch?v=aaaaaaaaaa1" }] } } },
  ];

  it("concatenates batches in name order and applies patches", () => {
    const { records, problems } = mergeSources(files);
    expect(problems).toEqual([]);
    expect(records.map((r) => r.id)).toEqual(["a", "b", "c"]);
    expect(records[0]!.real_world!.map((x) => x.product)).toEqual(["p1", "p2", "p3"]);
  });

  it("does not duplicate a patch URL already present", () => {
    const { records } = mergeSources(files);
    expect(records[0]!.real_world!.filter((x) => x.url === "https://www.youtube.com/watch?v=aaaaaaaaaa1")).toHaveLength(1);
  });

  it("derives the motion label and keeps only known related ids", () => {
    const { records } = mergeSources(files);
    expect(records[2]!.motion.label).toBe("Rotary → Oscillating");
    expect(records[2]!.related).toEqual(["a"]);
  });

  it("reports an unknown patch id instead of throwing", () => {
    const { records, problems } = mergeSources([...files, { name: "gapA.json", json: { ghost: { media: [] } } }]);
    expect(problems).toEqual(["gapA.json: unknown id ghost"]);
    expect(records).toHaveLength(3);
  });

  it("merges waivers and rejects unknown ones", () => {
    const { records, problems } = mergeSources([...files, { name: "rw2.json", json: { b: { waive: ["media", "x"] } } }]);
    expect(records[1]!.waive).toEqual(["media"]);
    expect(problems).toEqual(['rw2.json: b waives unknown "x"']);
  });

  it("does not change its input", () => {
    const before = JSON.stringify(files);
    mergeSources(files);
    expect(JSON.stringify(files)).toBe(before);
  });
});
