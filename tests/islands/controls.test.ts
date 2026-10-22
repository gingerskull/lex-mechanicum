// What a stage offers from a record (SS5, T14): the sliders and choices of `teaching.controls`, and the section and detail
// buttons of `teaching.views`.
import { describe, expect, it } from "vitest";
import { recordById } from "../../src/catalog";
import { controlsOf, viewButtons } from "../../site/src/data";

const rec = (id: string) => recordById(id)!;

describe("the stage's controls from a record", () => {
  it("gives a design choice its options and its default", () => {
    // the drag link keeps its assembly as a design choice; a control on it is added here (the built page drops it,
    // as the parts are built for one assembly)
    const r = rec("drag-link-quick-return");
    const t = r.teaching!;
    const c = controlsOf({ ...r, teaching: { ...t, controls: [...t.controls, { id: "assembly", kind: "design", design: "branch" }] } } as typeof r);
    const a = c.find((x) => x.key === "branch")!;
    expect(a.type).toBe("choice");
    expect(a.target).toBe("design");
    expect(a.options!.map((o) => o.value)).toEqual(["open", "crossed"]);
    expect(a.value).toBe("open");
  });

  it("leaves the cycle's own driver to the scrubber", () => {
    for (const r of [rec("four-bar"), rec("worm-drive"), rec("planetary")]) expect(controlsOf(r).some((c) => c.key === "input"), r.id).toBe(false);
  });

  it("offers a manual driver as a slider with its range and a selector as a choice of its options", () => {
    const ring = controlsOf(rec("planetary")).find((c) => c.key === "ring-hold")!;
    expect(ring).toMatchObject({ type: "range", target: "drivers", min: -180, max: 180, value: 0 });
    const gear = controlsOf(rec("ravigneaux")).find((c) => c.key === "gear")!;
    expect(gear).toMatchObject({ type: "choice", target: "select", value: "2nd" });
    expect(gear.options!.map((o) => o.value)).toEqual(["1st", "2nd", "3rd", "reverse"]);
  });

  it("maps every control of every record to something the kinematics has", () => {
    for (const r of [rec("four-bar"), rec("planetary"), rec("worm-drive"), rec("ravigneaux"), rec("lever-escapement")]) {
      const declared = (r as unknown as { teaching: { controls: { kind: string }[] } }).teaching.controls.filter((c) => c.kind !== "driver").length;
      expect(controlsOf(r).filter((c) => c.target !== "drivers").length, r.id).toBe(declared);
    }
  });

  it("lists the section and detail views a record declares", () => {
    expect(viewButtons(rec("worm-drive"))).toEqual([{ id: "A-A", kind: "section" }]);
    expect(viewButtons(rec("lever-escapement"))).toEqual([{ id: "stones", kind: "detail" }]);
    expect(viewButtons(rec("four-bar"))).toEqual([]);
  });
});
