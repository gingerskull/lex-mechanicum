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

  it("frames a record's view on top of the fit: a zoom about the stage centre and a pan in fractions of it", () => {
    const B = basisOfOrient(namedOrient("PLAN"));
    // a square box in a wide canvas: the height binds (s 2.6), with room across up to 3.6 / 2.6
    const box: Box = [0, 0, 0, 100, 100, 10];
    const plain = fit(B, 400, 300, box, { pad: 20 });
    expect(plain.s).toBeCloseTo(2.6);
    const C = fit(B, 400, 300, box, { pad: 20, frame: { zoom: 1.2, pan: [0.05, -0.1] } });
    expect(C.s).toBeCloseTo(3.12);
    const [x, y] = project(C, [50, 50, 0]);
    expect(x).toBeCloseTo(220); // 200 + 0.05 * 400
    expect(y).toBeCloseTo(120); // 150 - 0.1 * 300, the pan's y runs down
    // a zoom past the room across is held to it, and the pan eases off in the same proportion
    const wide = fit(B, 400, 300, box, { pad: 20, frame: { zoom: 2, pan: [0.1, 0] } });
    expect(wide.s).toBeCloseTo(3.6);
    expect(project(wide, [50, 50, 0])[0]).toBeCloseTo(200 + ((3.6 / 2.6 - 1) / (2 - 1)) * 0.1 * 400);
    // where the width already binds the frame leaves the fit as it is; a zoom below 1 always applies
    const flat: Box = [0, 0, 0, 100, 50, 10];
    expect(fit(B, 400, 300, flat, { pad: 20, frame: { zoom: 1.2, pan: [0.05, -0.1] } })).toEqual(fit(B, 400, 300, flat, { pad: 20 }));
    expect(fit(B, 400, 300, flat, { pad: 20, frame: { zoom: 0.5, pan: [0, 0] } }).s).toBeCloseTo(1.8);
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

  it("opens a record that declares a plan at the 28 degree view, and keeps any other view it declares", () => {
    expect(defaultView({ view: "PLAN" }).orient).toEqual({ yaw: 0, tilt: 28 });
    expect(defaultView({ view: "FRONT" }).orient).toEqual(parseView("FRONT")!.orient);
    expect(defaultView({ view: "VIEW 30 40" }).orient).toEqual({ yaw: 30, tilt: 50 });
    // a record's frame rides on its own view only: never on the isometric fallback, never on a detail view
    const frame = { zoom: 1.1, pan: [0, -0.05] as [number, number] };
    expect(defaultView({ view: "VIEW 30 40", frame }).frame).toEqual(frame);
    expect(defaultView({ view: "VIEW 30 40" }).frame).toBeUndefined();
    expect(defaultView({ view: "NOT A VIEW", frame }).frame).toBeUndefined();
    const det = viewsOf({ view: "VIEW 30 40", frame, views: [{ id: "z", kind: "detail", center: [0, 0, 0], scale: 3 }] } as never)[0]!;
    expect(det.state.frame).toBeUndefined();
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
