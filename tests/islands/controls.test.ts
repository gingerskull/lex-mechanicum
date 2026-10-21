// What a v3 stage offers from a record (SS5, T14): the sliders and choices of `teaching.controls`, the section and detail
// buttons of `teaching.views`, and which mechanisms the site draws with the v3 engine (SS13).
import { afterEach, describe, expect, it } from "vitest";
import { recordById } from "../../src/catalog";
import { controlsOf, viewButtons } from "../../site/src/data";
import { drawnBy3 } from "../../site/src/drawn";

const rec = (id: string) => recordById(id)!;

describe("the stage's controls from a record", () => {
  it("gives a design choice its options and its default", () => {
    const c = controlsOf(rec("drag-link-quick-return"));
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

describe("which mechanisms the site draws with the v3 engine", () => {
  const was = process.env.SITE_V3;
  afterEach(() => {
    if (was === undefined) delete process.env.SITE_V3;
    else process.env.SITE_V3 = was;
  });

  it("draws none by default, the listed ones on request, and all with 'all'", () => {
    delete process.env.SITE_V3;
    // a mechanism audited at 3.0 (the pilots) is always drawn by v3; the others only on request
    expect(drawnBy3("four-bar")).toBe(true);
    expect(drawnBy3("slider-crank")).toBe(false);
    process.env.SITE_V3 = "slider-crank, scotch-yoke";
    expect(drawnBy3("slider-crank")).toBe(true);
    expect(drawnBy3("scotch-yoke")).toBe(true);
    expect(drawnBy3("spur-gears")).toBe(false);
    process.env.SITE_V3 = "all";
    expect(drawnBy3("spur-gears")).toBe(true);
  });
});
