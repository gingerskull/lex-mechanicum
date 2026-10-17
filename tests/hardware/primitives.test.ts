import { describe, expect, it } from "vitest";
import { H } from "../../src/hardware/primitives";
import { BEARINGS } from "../../src/hardware/tables";

describe("hardware primitives", () => {
  it("steps a shaft at its thread and undercut, all segments one group", () => {
    const segs = H.shaft("ax", { d: 8, z0: 0, z1: 30, thread: { M: 6, z0: 0, z1: 9 }, grooves: [20] });
    expect(new Set(segs.map((s) => s.group))).toEqual(new Set(["ax"]));
    const thread = segs.find((s) => s.marks.some((m) => m.kind === "thread"))!;
    expect([thread.z0, thread.z1, thread.d]).toEqual([0, 9, 6]);
    // the undercut sits just above the thread, smaller than the thread
    const under = segs.find((s) => s.z0 === 9)!;
    expect(under.d!).toBeLessThan(6);
    // the circlip groove: Ø7.6 for an Ø8 shaft
    expect(segs.some((s) => s.z0 === 20 && s.d === 7.6)).toBe(true);
    expect(segs.every((s) => s.kind === "shaft")).toBe(true);
  });

  it("names screws with their standard length and keeps head and shank together", () => {
    const [h, sh] = H.screw("s", "button", 5, 13, { face: 10, dir: -1 });
    expect(h!.name).toBe("Button head M5 x 14 (ISO 7380)");
    expect(h!.group).toBe("s");
    expect(sh!.group).toBe("s");
    expect([sh!.z0, sh!.z1]).toEqual([-4, 10]);
  });

  it("gives every primitive a kind, a material and the detail rung of its kind", () => {
    const b = BEARINGS.find((x) => x.name === "6800")!;
    const parts = H.bearing("b", b);
    const brg = parts[0];
    const balls = parts.find((x) => x.kind === "bearingBalls");
    expect(brg!.detail).toBe("never");
    expect(balls!.detail).toBe("A");
    expect(H.spacer("sp", 6.2, 8.4).detail).toBe("D");
    expect(H.nut("n", 5).detail).toBe("H");
    expect(H.nut("n", 5).lock).toBe("nylon insert");
    expect(H.felt("f", H.disc(2)).detail).toBe("E");
    for (const s of [H.standoff("a"), H.dowel("d", 3), H.circlip("c", 10), H.nipple("n2"), H.sensor("se")]) expect(s.mat).toBeTruthy();
  });
});
