import { describe, expect, it } from "vitest";
import { basisFromEye, basisOf, basisOfOrient, depthOf, extent, fit, namedOrient, NAMED_VIEWS, project, snapName, snapped, viewLabel, type Box } from "../../src/render/v3/camera";
import { defaultView, parseView, viewsOf } from "../../src/render/v3/views";
import { recordById } from "../../src/catalog";
import type { Teaching } from "../../src/catalog/kin";

const dot = (a: readonly number[], b: readonly number[]) => a[0]! * b[0]! + a[1]! * b[1]! + a[2]! * b[2]!;
const cross = (a: readonly number[], b: readonly number[]) => [a[1]! * b[2]! - a[2]! * b[1]!, a[2]! * b[0]! - a[0]! * b[2]!, a[0]! * b[1]! - a[1]! * b[0]!];

describe("camera", () => {
  it("every pose is an orthonormal right-handed basis", () => {
    for (const [yaw, tilt] of [[0, 0], [30, 62], [90, 90], [200, -40], [45, 54.7356]] as const) {
      const B = basisOf(yaw, tilt);
      expect(dot(B.right, B.right)).toBeCloseTo(1);
      expect(dot(B.up, B.up)).toBeCloseTo(1);
      expect(dot(B.eye, B.eye)).toBeCloseTo(1);
      expect(dot(B.right, B.up)).toBeCloseTo(0);
      expect(dot(B.right, B.eye)).toBeCloseTo(0);
      const c = cross(B.right, B.up);
      for (let k = 0; k < 3; k++) expect(c[k]).toBeCloseTo(B.eye[k]!);
    }
  });

  it("the named views look where their names say", () => {
    const plan = basisOfOrient(namedOrient("PLAN"));
    expect(plan.eye[0]).toBeCloseTo(0);
    expect(plan.eye[1]).toBeCloseTo(0);
    expect(plan.eye[2]).toBeCloseTo(1);
    expect(plan.right[0]).toBeCloseTo(1);
    expect(plan.up[1]).toBeCloseTo(1);
    const front = basisOfOrient(namedOrient("FRONT"));
    expect(front.eye[1]).toBeCloseTo(-1); // the viewer stands at -y
    expect(front.up[2]).toBeCloseTo(1);
    const side = basisOfOrient(namedOrient("SIDE"));
    expect(side.eye[0]).toBeCloseTo(1);
    expect(side.right[1]).toBeCloseTo(1);
  });

  it("the isometric foreshortens the three axes alike and the dimetric two of them", () => {
    const f = (n: (typeof NAMED_VIEWS)[number], v: [number, number, number]) => {
      const B = basisOfOrient(namedOrient(n));
      return Math.hypot(dot(v, B.right), dot(v, B.up));
    };
    const iso = [f("ISOMETRIC", [1, 0, 0]), f("ISOMETRIC", [0, 1, 0]), f("ISOMETRIC", [0, 0, 1])];
    expect(iso[0]).toBeCloseTo(iso[1]!, 3);
    expect(iso[1]).toBeCloseTo(iso[2]!, 3);
    const di = [f("DIMETRIC", [1, 0, 0]), f("DIMETRIC", [0, 1, 0]), f("DIMETRIC", [0, 0, 1])];
    // dimetric 1 : 1 : 1/2 (the axis drawn at 41 degrees is half length): y is half of x and z
    expect(di[1]! / di[0]!).toBeCloseTo(0.5, 1);
    expect(di[0]).toBeCloseTo(di[2]!, 1);
  });

  it("an auxiliary view looks down its axis, turning up to y when the axis is vertical", () => {
    const B = basisFromEye([0, 0, 5]);
    expect(B.eye).toEqual([0, 0, 1]);
    expect(B.up[1]).toBeCloseTo(1);
    const A = basisFromEye([1, 1, 0]);
    expect(A.up[2]).toBeCloseTo(1);
    expect(dot(A.right, A.up)).toBeCloseTo(0);
  });

  it("snaps to the named view within reach and names the rest by azimuth and elevation", () => {
    expect(snapName({ yaw: 2, tilt: 88 })).toBe("FRONT");
    expect(snapName({ yaw: 33, tilt: 0.5 })).toBe("PLAN");
    expect(snapName({ yaw: 44, tilt: 55 })).toBe("ISOMETRIC");
    expect(snapName({ yaw: 10, tilt: 62 })).toBeNull();
    expect(snapped({ yaw: 2, tilt: 88 })).toEqual(namedOrient("FRONT"));
    expect(viewLabel({ yaw: 30, tilt: 50 })).toBe("VIEW 30/40");
    expect(viewLabel({ yaw: 0, tilt: 0, aux: [1, 0, 0] }, "O2")).toBe("AUX ⟂ O2");
    expect(viewLabel({ yaw: 0, tilt: 0, aux: [0, 0, 3] })).toBe("PLAN");
  });

  it("fits a box into the canvas and projects through it", () => {
    const box: Box = [0, 0, 0, 100, 50, 10];
    const B = basisOfOrient(namedOrient("PLAN"));
    const C = fit(B, 400, 300, box, { pad: 20 });
    expect(C.s).toBeCloseTo(3.6); // (400 - 40) / 100
    const [x0, y0] = project(C, [0, 0, 0]);
    const [x1, y1] = project(C, [100, 50, 0]);
    expect(x0).toBeCloseTo(20);
    expect(x1).toBeCloseTo(380);
    expect(y0).toBeGreaterThan(y1); // y runs up the sheet
    expect((y0 + y1) / 2).toBeCloseTo(150);
    expect(depthOf(C, [0, 0, 10])).toBeGreaterThan(depthOf(C, [0, 0, 0]));
    const e = extent(B, box);
    expect(C.d0).toBeLessThan(e.d[0]);
    expect(C.d1).toBeGreaterThan(e.d[1]);
  });

  it("magnifies a window about its centre", () => {
    const box: Box = [0, 0, 0, 100, 50, 10];
    const B = basisOfOrient(namedOrient("PLAN"));
    const C = fit(B, 400, 300, box, { pad: 20, window: { centre: [30, 20, 0], scale: 4 } });
    expect(C.s).toBeCloseTo(14.4);
    const [x, y] = project(C, [30, 20, 0]);
    expect(x).toBeCloseTo(200);
    expect(y).toBeCloseTo(150);
  });
});

describe("views", () => {
  it("parses the view strings of a record", () => {
    expect(parseView("FRONT")?.orient).toEqual(namedOrient("FRONT"));
    expect(parseView("iso")).toBeNull();
    expect(parseView("VIEW 30 40")?.orient).toEqual({ yaw: 30, tilt: 50 });
    expect(parseView("AUX O2")).toBeNull();
    const aux = parseView("AUX O2", (j) => (j === "O2" ? [0, 1, 0] : null));
    expect(aux?.auxName).toBe("O2");
    expect(aux?.orient.aux).toEqual([0, 1, 0]);
  });

  it("every record opens in a view that parses", () => {
    for (const id of ["four-bar", "bevel-gears", "oscillating-cylinder", "watt-linkage", "universal-joint"]) {
      const t = (recordById(id) as unknown as { teaching: Teaching }).teaching;
      const v = defaultView(t, () => [0, 0, 1]);
      expect(v.orient, id).toBeTruthy();
      expect(parseView(t.view, () => [0, 0, 1]), id).not.toBeNull();
    }
  });

  it("reads the section view of the oscillating cylinder: its cut plane, looking down it", () => {
    const t = (recordById("oscillating-cylinder") as unknown as { teaching: Teaching }).teaching;
    const vs = viewsOf(t);
    const sec = vs.find((v) => v.id === "port-face")!;
    expect(sec.state.section?.normal).toEqual([0, 0, 1]);
    expect(sec.state.section?.name).toBe("SECTION PORT-FACE");
    expect(sec.state.orient.aux).toEqual([0, 0, 1]);
    expect(sec.state.section?.highlight).toContain("port");
  });
});
