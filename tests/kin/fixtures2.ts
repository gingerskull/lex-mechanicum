// More kin fixtures: one per remaining block, written by hand like fixtures.ts.
import { dyadRRR, type Kin, type Vec3 } from "../../src/kin";
import { crankRocker } from "./fixtures";

const D = Math.PI / 180;

/**
 * Slider-crank with the geometry written as parameter expressions, so a control that changes a dimension moves it.
 * A selector offers two crank lengths.
 */
export function sliderCrank(): Kin {
  const C: [string, string, number] = ["r+sqrt(l*l-e*e)", "e", 0];
  return {
    bodies: [
      { id: "ground", role: "ground" },
      { id: "crank", role: "driver", at: { joint: "O" } },
      { id: "rod", role: "link" },
      { id: "slider", role: "slider" },
    ],
    joints: [
      { id: "O", type: "revolute", a: "ground", b: "crank", at: [0, 0, 0], axis: [0, 0, 1] },
      { id: "A", type: "revolute", a: "crank", b: "rod", at: ["r", 0, 0], axis: [0, 0, 1] },
      { id: "C", type: "revolute", a: "rod", b: "slider", at: C, axis: [0, 0, 1] },
      { id: "P", type: "prismatic", a: "slider", b: "ground", at: C, axis: [1, 0, 0] },
    ],
    params: [
      { id: "r", value: 30, min: 15, max: 40 },
      { id: "l", value: 90, min: 60, max: 120 },
      { id: "e", value: 10, min: 0, max: 20 },
    ],
    design: [{ id: "closure", options: ["far", "near"], value: "far" }],
    drivers: [
      { id: "input", joint: "O", kind: "rotary", range: [0, 360], default: 0 },
      {
        id: "stroke",
        kind: "select",
        options: { short: { params: { r: 20 } }, long: { params: { r: 35 } } },
        value: "long",
      },
    ],
    solve: [{ block: "slider-dyad", id: "rod", in: { kind: "rrp", a: "A", r: "l", p: [0, "e", 0], d: [1, 0, 0] }, branch: "closure", out: { p: "C", s: "slider-x" } }],
    points: [
      { id: "A", body: "crank", local: ["r", 0, 0] },
      { id: "C", body: "rod", local: C },
    ],
    outputs: [{ id: "slider-x", of: "slider", kind: "position", unit: "mm" }],
    fallback: null,
  };
}

/** The crank-rocker solved by the numeric fallback instead of a dyad block. */
export function crankRockerNumeric(): Kin {
  const k = crankRocker();
  k.solve = [];
  k.fallback = { numeric: true, loops: [["coupler", "rocker"]] };
  return k;
}

/** Spur pair 20:30, module 2, on a ground. */
export function gearPair(): Kin {
  return {
    bodies: [
      { id: "ground", role: "ground" },
      { id: "g1", role: "gear", symmetry: 20 },
      { id: "g2", role: "gear", symmetry: 30 },
    ],
    joints: [
      { id: "S1", type: "revolute", a: "ground", b: "g1", at: [0, 0, 0], axis: [0, 0, 1] },
      { id: "S2", type: "revolute", a: "ground", b: "g2", at: [50, 0, 0], axis: [0, 0, 1] },
      { id: "M", type: "gear-mesh", a: "g1", b: "g2", at: [20, 0, 0], axis: [0, 0, 1], za: 20, zb: 30, ca: [0, 0, 0], cb: [50, 0, 0] },
    ],
    drivers: [{ id: "input", joint: "S1", kind: "rotary", range: [0, 360], default: 0, speed: 3 }],
    solve: [{ block: "gear-mesh", id: "mesh", in: { joint: "M", input: "input" }, out: { angle: "g2-angle" } }],
    fallback: null,
  };
}

/** Pinion and rack: the rack travels r per radian. */
export function rackPinion(): Kin {
  return {
    bodies: [
      { id: "ground", role: "ground" },
      { id: "pinion", role: "gear" },
      { id: "rack", role: "slider" },
    ],
    joints: [
      { id: "S", type: "revolute", a: "ground", b: "pinion", at: [0, 0, 0], axis: [0, 0, 1] },
      { id: "P", type: "prismatic", a: "rack", b: "ground", at: [0, -20, 0], axis: [1, 0, 0] },
      { id: "M", type: "gear-mesh", a: "pinion", b: "rack", at: [0, -20, 0], axis: [0, 0, 1], axis2: [1, 0, 0], radiusA: 20 },
    ],
    drivers: [{ id: "input", joint: "S", kind: "oscillating", lo: 0, hi: 180, default: 0 }],
    solve: [{ block: "gear-mesh", id: "mesh", in: { joint: "M", input: "input" }, out: { travel: "rack-travel" } }],
    fallback: null,
  };
}

/** Simple planetary: sun 24, planet 24, ring 72 (module 1), three planets, ring held, sun driven four turns per cycle. */
export function planetary(): Kin {
  const R = 24;
  const pc = (deg: number): Vec3 => [R * Math.cos(deg * D), R * Math.sin(deg * D), 0];
  const contact = (deg: number, r: number): Vec3 => [r * Math.cos(deg * D), r * Math.sin(deg * D), 0];
  const bodies: Kin["bodies"] = [
    { id: "ground", role: "ground" },
    { id: "sun", role: "gear", symmetry: 24 },
    { id: "ring", role: "gear", symmetry: 72 },
    { id: "carrier", role: "frame", symmetry: 3 },
  ];
  const joints: Kin["joints"] = [
    { id: "Rs", type: "revolute", a: "ground", b: "sun", at: [0, 0, 0], axis: [0, 0, 1] },
    { id: "Rr", type: "revolute", a: "ground", b: "ring", at: [0, 0, 0], axis: [0, 0, 1] },
    { id: "Rc", type: "revolute", a: "ground", b: "carrier", at: [0, 0, 0], axis: [0, 0, 1] },
  ];
  const planets: { body: string; center: Vec3 }[] = [];
  [0, 120, 240].forEach((deg, i) => {
    const id = `p${i + 1}`;
    bodies.push({ id, role: "gear", symmetry: 24 });
    joints.push({ id: `Rp${i + 1}`, type: "revolute", a: "carrier", b: id, at: pc(deg), axis: [0, 0, 1] });
    joints.push({ id: `Msp${i + 1}`, type: "gear-mesh", a: "sun", b: id, at: contact(deg, 12), axis: [0, 0, 1], za: 24, zb: 24, ca: [0, 0, 0], cb: pc(deg), carrier: "carrier" });
    joints.push({ id: `Mpr${i + 1}`, type: "gear-mesh", a: id, b: "ring", at: contact(deg, 36), axis: [0, 0, 1], za: 24, zb: 72, internal: true, ca: pc(deg), cb: [0, 0, 0], carrier: "carrier" });
    planets.push({ body: id, center: pc(deg) });
  });
  return {
    bodies,
    joints,
    drivers: [{ id: "sun-in", joint: "Rs", kind: "rotary", range: [0, 360], default: 0, speed: 4 }],
    solve: [
      {
        block: "willis",
        id: "train",
        in: { zs: 24, zr: 72, zp: 24, center: [0, 0, 0], axis: [0, 0, 1], sun: "sun-in", ring: 0, bodies: { sun: "sun", ring: "ring", carrier: "carrier" }, planets },
        out: { carrier: "carrier-angle", planet: "planet-angle" },
      },
    ],
    fallback: null,
  };
}

/** Translating roller follower on a plate cam: rise 120 deg cycloidal, dwell 60, return 120 harmonic, dwell 60; prime radius 30. */
export function camFollower(): Kin {
  return {
    bodies: [
      { id: "ground", role: "ground" },
      { id: "cam", role: "cam" },
      { id: "follower", role: "follower" },
    ],
    joints: [
      { id: "S", type: "revolute", a: "ground", b: "cam", at: [0, 0, 0], axis: [0, 0, 1] },
      { id: "G", type: "prismatic", a: "follower", b: "ground", at: [30, 0, 0], axis: [1, 0, 0] },
      {
        id: "C",
        type: "cam-contact",
        a: "follower",
        b: "cam",
        at: [30, 0, 0],
        axis: [0, 0, 1],
        ca: [0, 0, 0],
        follower: "roller",
        cam: {
          schedule: [
            { kind: "rise", span: 120, law: "cycloidal" },
            { kind: "dwell", span: 60 },
            { kind: "return", span: 120, law: "harmonic" },
            { kind: "dwell", span: 60 },
          ],
          lift: 12,
          rb: 30,
          theta0: 0,
        },
      },
    ],
    drivers: [{ id: "input", joint: "S", kind: "rotary", range: [0, 360], default: 0 }],
    solve: [{ block: "cam", id: "cam", in: { joint: "C", input: "input", follower: "follower", axis: [1, 0, 0] }, out: { s: "lift", pressure: "pressure-angle" } }],
    fallback: null,
  };
}

/** Lead screw: right-hand, lead 4, nut on a slide; the shaft turns two turns out and back. */
export function leadScrew(): Kin {
  return {
    bodies: [
      { id: "ground", role: "ground" },
      { id: "shaft", role: "driver" },
      { id: "nut", role: "slider" },
    ],
    joints: [
      { id: "R", type: "revolute", a: "ground", b: "shaft", at: [0, 0, 0], axis: [0, 0, 1] },
      { id: "P", type: "prismatic", a: "nut", b: "ground", at: [10, 0, 0], axis: [0, 0, 1] },
      { id: "S", type: "screw", a: "shaft", b: "nut", at: [0, 0, 0], axis: [0, 0, 1], lead: 4, hand: "right" },
    ],
    drivers: [{ id: "input", joint: "R", kind: "oscillating", lo: 0, hi: 720, default: 0 }],
    solve: [{ block: "screw", id: "screw", in: { joint: "S", input: "input" }, out: { advance: "nut-travel" } }],
    fallback: null,
  };
}

/** External Geneva wheel, n slots, crank pin radius r, with the pin in its slot only while engaged. */
export function geneva(n = 4, r = 20): Kin {
  const c = r / Math.sin(Math.PI / n);
  const half = 90 - 180 / n;
  return {
    bodies: [
      { id: "ground", role: "ground" },
      { id: "crank", role: "driver" },
      { id: "wheel", role: "output", symmetry: n },
    ],
    joints: [
      { id: "Rc", type: "revolute", a: "ground", b: "crank", at: [0, 0, 0], axis: [0, 0, 1] },
      { id: "Rw", type: "revolute", a: "ground", b: "wheel", at: [c, 0, 0], axis: [0, 0, 1] },
      {
        id: "Pin",
        type: "pin-in-slot",
        a: "crank",
        b: "wheel",
        at: [r, 0, 0],
        axis: [0, 0, 1],
        slot: { from: [c, 0, 0], to: [c - 1.4 * r, 0, 0], repeat: n, center: [c, 0, 0] },
        active: { driver: "input", lo: -half, hi: half },
      },
    ],
    drivers: [{ id: "input", joint: "Rc", kind: "rotary", range: [0, 360], default: 0 }],
    solve: [{ block: "indexer", id: "index", in: { n, input: "input", phi0: 0, wheel: "wheel", center: [c, 0, 0], axis: [0, 0, 1] }, out: { angle: "wheel-angle" } }],
    fallback: null,
  };
}

/** Five-bar: cranks 40 on a 60 base, distal links 90, two rotary inputs 40 degrees apart. */
export function fiveBar(): Kin {
  const th1 = 100;
  const th2 = 60;
  const E1: Vec3 = [-30 + 40 * Math.cos(th1 * D), 40 * Math.sin(th1 * D), 0];
  const E2: Vec3 = [30 + 40 * Math.cos(th2 * D), 40 * Math.sin(th2 * D), 0];
  const sol = dyadRRR(E1, E2, 90, 90);
  const P = sol.roots[0];
  return {
    bodies: [
      { id: "ground", role: "ground" },
      { id: "c1", role: "driver" },
      { id: "c2", role: "driver" },
      { id: "d1", role: "link" },
      { id: "d2", role: "link" },
    ],
    joints: [
      { id: "O1", type: "revolute", a: "ground", b: "c1", at: [-30, 0, 0], axis: [0, 0, 1] },
      { id: "O2", type: "revolute", a: "ground", b: "c2", at: [30, 0, 0], axis: [0, 0, 1] },
      { id: "E1", type: "revolute", a: "c1", b: "d1", at: E1, axis: [0, 0, 1] },
      { id: "E2", type: "revolute", a: "c2", b: "d2", at: E2, axis: [0, 0, 1] },
      { id: "P", type: "revolute", a: "d1", b: "d2", at: P, axis: [0, 0, 1] },
    ],
    drivers: [
      { id: "in1", joint: "O1", kind: "rotary", range: [0, 360], default: th1 },
      { id: "in2", joint: "O2", kind: "rotary", range: [0, 360], default: th2 },
    ],
    design: [{ id: "elbow", options: ["left", "right"], value: "left" }],
    solve: [{ block: "five-bar", id: "arm", in: { A1: "O1", A2: "O2", l1: 40, l2: 40, l3: 90, l4: 90, th1: "in1", th2: "in2" }, branch: "elbow", out: { P: "P", E1: "E1", E2: "E2" } }],
    points: [
      { id: "E1", body: "c1", local: E1 },
      { id: "E2", body: "c2", local: E2 },
    ],
    fallback: null,
  };
}

/** Sarrus pair: two legs of two 40 mm links in orthogonal vertical planes, the top plate rising straight up. */
export function sarrus(): Kin {
  const th0 = 30;
  const c = 40 * Math.cos(th0 * D);
  const s = 40 * Math.sin(th0 * D);
  const leg = (tag: string, base: Vec3, dir: Vec3, axis: Vec3) => {
    const knee: Vec3 = [base[0] + dir[0] * c, base[1] + dir[1] * c, s];
    const top: Vec3 = [base[0], base[1], 2 * s];
    return { tag, base, knee, top, axis };
  };
  const A = leg("A", [-20, 0, 0], [1, 0, 0], [0, -1, 0]);
  const B = leg("B", [0, -20, 0], [0, 1, 0], [1, 0, 0]);
  const bodies: Kin["bodies"] = [
    { id: "ground", role: "ground" },
    { id: "top", role: "output" },
  ];
  const joints: Kin["joints"] = [];
  for (const g of [A, B]) {
    bodies.push({ id: `lower${g.tag}`, role: "link" }, { id: `upper${g.tag}`, role: "link" });
    joints.push(
      { id: `base${g.tag}`, type: "revolute", a: "ground", b: `lower${g.tag}`, at: g.base, axis: g.axis },
      { id: `knee${g.tag}`, type: "revolute", a: `lower${g.tag}`, b: `upper${g.tag}`, at: g.knee, axis: g.axis },
      { id: `top${g.tag}`, type: "revolute", a: `upper${g.tag}`, b: "top", at: g.top, axis: g.axis },
    );
  }
  return {
    bodies,
    joints,
    drivers: [{ id: "input", joint: "baseA", kind: "oscillating", lo: 10, hi: 70, default: th0 }],
    solve: [
      {
        block: "sarrus",
        id: "pair",
        in: {
          l1: 40,
          l2: 40,
          input: "input",
          theta0: th0,
          top: "top",
          legs: [
            { lower: "lowerA", upper: "upperA", base: "baseA", knee: "kneeA" },
            { lower: "lowerB", upper: "upperB", base: "baseB", knee: "kneeB" },
          ],
        },
        out: { lift: "lift" },
      },
    ],
    fallback: null,
  };
}

/** Anchor escapement: a 30-tooth wheel and a pallet pivoting on the centre line, the pendulum swinging 4 degrees each way. */
export function escapement(): Kin {
  return {
    bodies: [
      { id: "ground", role: "ground" },
      { id: "wheel", role: "gear", symmetry: 30 },
      { id: "pallet", role: "pawl" },
    ],
    joints: [
      { id: "Rw", type: "revolute", a: "ground", b: "wheel", at: [0, 0, 0], axis: [0, 0, 1] },
      { id: "Rp", type: "revolute", a: "ground", b: "pallet", at: [0, 60, 0], axis: [0, 0, 1] },
    ],
    drivers: [{ id: "swing", kind: "manual", default: 0 }],
    solve: [
      {
        block: "escapement",
        id: "esc",
        in: { kind: "anchor", z: 30, amplitude: 4, lock: 0.35, drop: 0.2, recoil: 0.12, wheel: "wheel", pallet: "pallet", wheelCenter: [0, 0, 0], palletCenter: [0, 60, 0] },
        out: { wheel: "wheel-angle", pallet: "pallet-angle" },
      },
    ],
    fallback: null,
  };
}

/** Flexure hinge: a beam on a pseudo-rigid-body pivot, bent 30 degrees each way. */
export function flexureHinge(): Kin {
  return {
    bodies: [
      { id: "ground", role: "ground" },
      { id: "beam", role: "link" },
    ],
    joints: [{ id: "F", type: "flexure", a: "ground", b: "beam", at: [8, 0, 0], axis: [0, 0, 1] }],
    drivers: [{ id: "bend", joint: "F", kind: "oscillating", lo: -30, hi: 30, default: 0 }],
    solve: [{ block: "flexure", id: "flex", in: { joint: "F", input: "bend", beam: "beam", l: 50, thetaMax: 45 }, out: { bend: "bend-state" } }],
    fallback: null,
  };
}

/** Belt drive: pulleys of radius 20 and 40 on an 80 mm centre distance, two belt teeth. */
export function beltDrive(): Kin {
  return {
    bodies: [
      { id: "ground", role: "ground" },
      { id: "p1", role: "gear" },
      { id: "p2", role: "gear" },
      { id: "t1", role: "belt" },
      { id: "t2", role: "belt" },
    ],
    joints: [
      { id: "R1", type: "revolute", a: "ground", b: "p1", at: [0, 0, 0], axis: [0, 0, 1] },
      { id: "R2", type: "revolute", a: "ground", b: "p2", at: [80, 0, 0], axis: [0, 0, 1] },
      { id: "B", type: "belt", a: "p1", b: "p2", at: [0, 0, 0], axis: [0, 0, 1], axis2: [0, 0, 1], radiusA: 20, radiusB: 40 },
    ],
    drivers: [{ id: "input", joint: "R1", kind: "rotary", range: [0, 360], default: 0, speed: 2 }],
    solve: [
      {
        block: "convey",
        id: "belt",
        in: { joint: "B", input: "input", C: 80, r: 20, items: [{ body: "t1", s: 0 }, { body: "t2", s: 100 }], driven: "p2", drivenCenter: [80, 0, 0] },
        out: { angle: "p2-angle", travel: "belt-travel" },
      },
    ],
    fallback: null,
  };
}
