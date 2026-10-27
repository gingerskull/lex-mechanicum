// The build cache's key: shared by every mechanism up to its own folder and record, so a change to one mechanism builds
// only that one again (src/package/built.ts).
import { describe, expect, it } from "vitest";
import { readAudit } from "../../src/audit/sheet";
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

  it("follows the audit header's standard and result, which the package carries", () => {
    const four = recordById("four-bar")!;
    const text = readAudit("four-bar")!;
    expect(buildKey("four-bar", four, text)).toBe(buildKey("four-bar", four));
    expect(buildKey("four-bar", four, text.replace(/result: \w+/, "result: open"))).not.toBe(buildKey("four-bar", four, text));
    expect(buildKey("four-bar", four, text.replace(/standard: [\d.]+/, "standard: 3.11"))).not.toBe(buildKey("four-bar", four, text));
    // the rest of the sheet (judged rows) is not read by a build
    expect(buildKey("four-bar", four, `${text}\n<!-- note -->\n`)).toBe(buildKey("four-bar", four, text));
  });
});
