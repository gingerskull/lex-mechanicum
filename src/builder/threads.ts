// The threads a record's screw shape declares (record spec, shape `shaft` with `thread`, `threads` or `groove`): a
// trapezoidal lead-screw thread or a ball screw's groove, each over its own axial range of the shaft. Pure data, read by
// the shapes (the screw's ridge) and by the screw kit (the nut's ridge, the balls).

export interface ThreadSpec {
  /** "Tr": a 30 degree trapezoidal thread; "ball": a gothic-arch ball groove. */
  form: "Tr" | "ball";
  /** Outside diameter of the screw (the thread's crest, or the ball screw's land), mm. */
  major: number;
  /** Core diameter under the thread, mm. */
  minor: number;
  pitch: number;
  lead: number;
  hand: "right" | "left";
  /** Axial range on the screw, in its body frame's z. */
  from: number;
  to: number;
  /** Ball groove: ball diameter, ball-centre circle diameter, groove radius. */
  ball?: { d: number; circle: number; groove: number; contact: number };
}

const num = (v: unknown, d: number): number => (typeof v === "number" && Number.isFinite(v) ? v : d);

/** A Tr thread's core: the ISO 2904 minor diameter d3 = d − (P + 2 ac), with ac 0.25 up to P 5. */
const trMinor = (major: number, P: number): number => major - (P + 2 * (P <= 1.5 ? 0.15 : P <= 5 ? 0.25 : 0.5));

function one(t: Record<string, unknown>, shape: Record<string, unknown>, ball: boolean): ThreadSpec {
  const major = num(t.major, num(shape.diameter, 12));
  const pitch = num(t.pitch, num(t.lead, 3));
  const lead = num(t.lead, pitch * num(t.starts, 1));
  const hand = t.hand === "left" ? "left" : "right";
  if (ball) {
    const d = num(t.ball, 3.175);
    const circle = num(t.ballCircle, major + 0.6);
    const groove = 0.52 * d;
    const contact = num(t.contact, 45);
    return { form: "ball", major, minor: circle - 2 * groove, pitch: lead, lead, hand, from: num(t.from, 0), to: num(t.to, 100), ball: { d, circle, groove, contact } };
  }
  return { form: "Tr", major, minor: num(t.minor, trMinor(major, pitch)), pitch, lead, hand, from: num(t.from, 0), to: num(t.to, 100) };
}

/** The threads of a shape, in axial order; none for a shape that is not a screw. */
export function threadsOf(shape: Record<string, unknown> | undefined): ThreadSpec[] {
  if (!shape || shape.type !== "shaft") return [];
  const out: ThreadSpec[] = [];
  if (shape.thread && typeof shape.thread === "object") out.push(one(shape.thread as Record<string, unknown>, shape, false));
  if (Array.isArray(shape.threads)) for (const t of shape.threads) if (t && typeof t === "object") out.push(one(t as Record<string, unknown>, shape, false));
  if (shape.groove && typeof shape.groove === "object") out.push(one(shape.groove as Record<string, unknown>, shape, true));
  return out.sort((a, b) => a.from - b.from);
}

export const isScrew = (shape: Record<string, unknown> | undefined): boolean => threadsOf(shape).length > 0;

/**
 * The ridge of a thread in its axial plane, (u, v): u outward from the core radius minor/2 (a little below it, so the
 * ridge sits in the core), v along the axis from the ridge's centre line. A Tr ridge is a trapezoid with 15 degree
 * flanks and a crest of 0.366 P; a ball screw's land is bounded by the two grooves' arcs.
 */
export function ridgeProfile(t: ThreadSpec): [number, number][] {
  const h = (t.major - t.minor) / 2;
  if (t.form === "Tr") {
    const crest = 0.183 * t.pitch;
    const root = crest + h * Math.tan((15 * Math.PI) / 180);
    return [[-0.3, -root - 0.3 * Math.tan((15 * Math.PI) / 180)], [h, -crest], [h, crest], [-0.3, root + 0.3 * Math.tan((15 * Math.PI) / 180)]];
  }
  // a land between two grooves whose circles (radius g) are centred at the ball circle, half a lead either side
  const b = t.ball!;
  const rc = b.circle / 2;
  const r0 = t.minor / 2;
  const half = (r: number): number => t.lead / 2 - Math.sqrt(Math.max(0, b.groove * b.groove - (rc - r) * (rc - r)));
  const n = 8;
  const up: [number, number][] = [];
  for (let k = 0; k <= n; k++) {
    const r = r0 + ((t.major / 2 - r0) * k) / n;
    up.push([r - r0, half(r)]);
  }
  const side = up.map(([u, v]): [number, number] => [u, -v]);
  return [[-0.3, -t.lead / 2 + 0.05], ...side.slice(1), ...up.slice(1).reverse(), [-0.3, t.lead / 2 - 0.05]];
}

/**
 * The nut's ridge, the mirror of the screw's: from the nut's bore wall inward into the screw's groove, centred half a
 * pitch from the screw's ridge (a Tr nut) or level with it (a ball nut, whose ridge lies between its own grooves),
 * with a running clearance `c`. u is measured inward from the root radius `rootR`, which the nut's bore wall carries.
 */
export function nutRidge(t: ThreadSpec, c = 0.15): { rootR: number; pts: [number, number][]; shift: number } {
  if (t.form === "Tr") {
    const tan = Math.tan((15 * Math.PI) / 180);
    const h = (t.major - t.minor) / 2;
    const crestS = 0.183 * t.pitch;
    const w = (r: number): number => crestS + (t.major / 2 - r) * tan; // the screw ridge's half width at radius r
    const rootR = t.major / 2 + c;
    const tipR = t.minor / 2 + 0.35;
    const hw = (r: number): number => t.pitch / 2 - w(Math.min(r, t.major / 2)) - c;
    void h;
    return { rootR, shift: t.pitch / 2, pts: [[-0.3, -hw(rootR + 0.3)], [rootR - tipR, -hw(tipR)], [rootR - tipR, hw(tipR)], [-0.3, hw(rootR + 0.3)]] };
  }
  const b = t.ball!;
  const rc = b.circle / 2;
  const rootR = rc + b.groove;
  const tipR = t.major / 2 + 0.2;
  const half = (r: number): number => t.lead / 2 - Math.sqrt(Math.max(0, b.groove * b.groove - (r - rc) * (r - rc)));
  const n = 8;
  const pts: [number, number][] = [];
  for (let k = 0; k <= n; k++) {
    const r = rootR - ((rootR - tipR) * k) / n;
    pts.push([rootR - r, half(r)]);
  }
  return { rootR, shift: 0, pts: [[-0.3, -t.lead / 2 + 0.05], ...pts.slice(1).map(([u, v]): [number, number] => [u, -v]), ...pts.slice(1).reverse(), [-0.3, t.lead / 2 - 0.05]] };
}
