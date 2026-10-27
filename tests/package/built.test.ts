// The build cache's key: shared by every mechanism up to its own folder and record, so a change to one mechanism builds
// only that one again (src/package/built.ts).
import { describe, expect, it } from "vitest";
import { buildKey, sharedKey } from "../../src/package/built";
import { recordById } from "../../src/catalog";

describe("buildKey", () => {
  it("is stable, and differs between mechanisms and when a record changes", () => {
    const four = recordById("four-bar")!;
    expect(sharedKey()).toMatch(/^[0-9a-f]{32}$/);
    expect(buildKey("four-bar", four)).toBe(buildKey("four-bar", four));
    expect(buildKey("four-bar", four)).not.toBe(buildKey("spur-gears", recordById("spur-gears")!));
    expect(buildKey("four-bar", { ...four, name: `${four.name} (renamed)` })).not.toBe(buildKey("four-bar", four));
  });
});
