// The record validator on a composite track: a pin-in-slot's `slot.track` (segments, radii, lengths, the pin on its
// track) and a target-path block that runs a pin along one.
import { describe, expect, it } from "vitest";
import type { Kin, Teaching } from "../../src/catalog/kin";
import { validateKinTeaching } from "../../src/catalog/validate-kin";
import type { Kin as KinBlock } from "../../src/kin/types";
import { trackFollower } from "../kin/fixtures";
import { record } from "./fixtures";

const teaching: Teaching = {
  review: { verdict: "keep", date: "2026-11-15", note: "n" },
  principle: [{ body: "arm" }],
  traces: [],
  overlays: [],
  view: "PLAN",
  controls: [],
  plot: { x: "hand", y: "crank-angle", label: "CRANK" },
  claims: [],
  exceptions: [],
};

type Track = { start: unknown[]; dir: unknown; segments: Record<string, unknown>[] };
const slotOf = (k: KinBlock) => (k.joints.find((j) => j.id === "F")!.slot as { track: Track }).track;

/** The track's problems (and the block's) for the fixture bent by `edit`. */
function problems(edit: (k: KinBlock) => void = () => {}): string[] {
  const kin = trackFollower();
  // the joints each block solves, as a record lists them
  Object.assign(kin.solve[0]!, { joints: ["F"] });
  Object.assign(kin.solve[1]!, { joints: ["A"] });
  edit(kin);
  const p = validateKinTeaching(record("x", { kin: kin as unknown as Kin, teaching } as never), { required: true });
  return p.filter((s) => /track|joint F|solve run/.test(s));
}

describe("track validation", () => {
  it("passes the fixture's S track, its pin on it, and the block that runs it", () => {
    expect(problems()).toEqual([]);
  });

  it("rejects a track without segments, start or direction", () => {
    expect(problems((k) => (slotOf(k).segments = []))).toContain("x: joint F: track.segments must list at least one segment");
    expect(problems((k) => (slotOf(k).start = [60]))).toContain("x: joint F: track.start must be [x, y] or [x, y, z]");
    expect(problems((k) => delete (slotOf(k) as Partial<Track>).dir)).toContain("x: joint F: track.dir must be a direction [x, y, z?] or an angle in degrees");
  });

  it("rejects a zero radius, a length that is not positive, an angle on a line and a segment given twice", () => {
    expect(problems((k) => (slotOf(k).segments[0]!.radius = 0)).some((s) => s.includes("radius must be a non-zero number"))).toBe(true);
    expect(problems((k) => (slotOf(k).segments[1]!.length = -5)).some((s) => s.includes("track segment 2: length must be a positive number"))).toBe(true);
    expect(problems((k) => (slotOf(k).segments[1] = { angle: 30 })).some((s) => s.includes("track segment 2: an angle needs a radius or curvature"))).toBe(true);
    expect(problems((k) => (slotOf(k).segments[0] = { radius: 40, curvature: 0.025, length: 10 })).some((s) => s.includes("gives both radius and curvature"))).toBe(true);
    expect(problems((k) => (slotOf(k).segments[2] = { radius: -40 })).some((s) => s.includes("track segment 3 needs a length"))).toBe(true);
  });

  it("rejects a pin that is off its track", () => {
    const p = problems((k) => (slotOf(k).start = [61, -30]));
    expect(p.some((s) => /joint F: the pin \(at\) is 1\.00 mm off its track/.test(s))).toBe(true);
  });

  it("rejects a target-path on a joint without a track, and an unknown mode", () => {
    expect(problems((k) => (k.solve[0]!.in = { shape: "track", joint: "A" }))).toContain('x: solve run: in.joint "A" is not a pin-in-slot joint with a track');
    expect(problems((k) => (k.solve[0]!.in = { shape: "track", joint: "F", mode: "twice" }))).toContain('x: solve run: in.mode "twice" is not oscillate or once');
  });
});
