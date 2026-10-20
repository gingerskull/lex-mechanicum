// The part family. Every mechanism is built only from these elements (standard K3): stadium links with a ring at each
// boss, flush pivot caps, square-ended sliders on twin stadium rails, stadium slots, involute gears with a D-bore,
// discs, custom outlines and the tracer.
import { capsule, circle, dBore, gearOutline, ring, roundRect, roundedPoly, slot, taper, D2R, xfPose } from "../core/geom";
import type { Axis, Part, Pose, Role, Shape, Solved, Vec2 } from "../model/types";

/** Layer pitch and default plate thickness, mm. */
export const LAYER = 10;
export const THICK = 6;

/** Placement options every constructor passes through. */
export interface Place {
  /** Plating offset from the layer grid, mm. */
  dz?: number;
  /** Clevis partner: the part this one pairs with round a pin. */
  twin?: string;
  fixed?: Pose;
  between?: [string, string];
  at?: string;
  off?: number;
  spin?(s: Solved): number;
  name?: string;
  /** The part's axis (src/core/axis.ts) and, for x or y, where it starts along it. */
  axis?: Axis;
  along?: number;
  /** Solid modifiers: far-end scale and helix lead (src/model/types.ts). */
  taper?: number;
  helix?: number;
}

export interface PartOpts extends Place {
  role?: Role;
  layer?: number;
  thick?: number;
  holes?: Vec2[][];
  marks?: Vec2[][];
}

const S = (outer: Vec2[], holes: Vec2[][] = []): Shape => ({ outer, holes });

const place = (o: Place): Place => {
  const c: Place = {};
  if (o.dz !== undefined) c.dz = o.dz;
  if (o.twin !== undefined) c.twin = o.twin;
  if (o.fixed !== undefined) c.fixed = o.fixed;
  if (o.between !== undefined) c.between = o.between;
  if (o.at !== undefined) c.at = o.at;
  if (o.off !== undefined) c.off = o.off;
  if (o.spin !== undefined) c.spin = o.spin;
  if (o.name !== undefined) c.name = o.name;
  if (o.axis !== undefined && o.axis !== "z") c.axis = o.axis;
  if (o.along !== undefined) c.along = o.along;
  if (o.taper !== undefined) c.taper = o.taper;
  if (o.helix !== undefined) c.helix = o.helix;
  return c;
};

const base = (id: string, role: Role, layer: number, shape: Shape, o: Partial<Part> = {}): Part => ({
  id,
  role,
  layer,
  thick: THICK,
  shape,
  marks: [],
  ...o,
});

export const P = {
  S,
  /**
   * Two-boss link from (0, 0) to (L, 0), a ring at each boss: a stadium of width w, or tapered (D1) with boss radii
   * `r` sized to what each boss carries (a keyed shaft, a bearing, a tapped bolt).
   */
  link(id: string, L: number, o: PartOpts & { w?: number; r?: [number, number] } = {}): Part {
    const w = o.w ?? 16;
    const [r0, r1] = o.r ?? [w / 2, w / 2];
    return base(id, o.role ?? "link", o.layer ?? 0, S(o.r ? taper(L, r0, r1) : capsule(L, w), o.holes ?? []), {
      marks: [ring(r0 - 1.6), ring(r1 - 1.6, L, 0)],
      len: L,
      ...place(o),
    });
  },
  /** Multi-boss plate; pts are the pin centres in local coordinates. */
  plate(id: string, pts: Vec2[], o: PartOpts & { r?: number } = {}): Part {
    const r = o.r ?? 8.5;
    return base(id, o.role ?? "link", o.layer ?? 0, S(roundedPoly(pts, r), o.holes ?? []), {
      marks: pts.map((q) => ring(r - 1.6, q[0], q[1])),
      ...place(o),
    });
  },
  /** Flush pivot cap of radius r; span is the number of layers the pin passes through. */
  cap(id: string, layer: number, r = 5.5, o: Place & { span?: number; accent?: boolean; th?: number; over?: number; top?: "hung" | "free" } = {}): Part {
    const p = base(id, "pin", layer, S(circle(r, 0, 0, 36)), { span: o.span ?? 1, th: o.th ?? THICK, over: o.over ?? 0.8, ...place(o) });
    if (o.accent) p.accent = true;
    if (o.top) p.top = o.top;
    return p;
  },
  /** Square-ended slider block centred on its origin, with a ring where its pin sits. */
  slider(id: string, w: number, h: number, o: PartOpts & { noRing?: boolean } = {}): Part {
    return base(id, o.role ?? "output", o.layer ?? 0, S(roundRect(-w / 2, -h / 2, w / 2, h / 2, Math.min(6, h / 2 - 0.5)), o.holes ?? []), {
      thick: o.thick ?? 7,
      marks: o.noRing ? [] : [ring(6.5)],
      ...place(o),
    });
  },
  /** Twin stadium rails along local x from x0 to x1, gap apart about y = 0; ids id + "a" and id + "b". */
  rails(id: string, x0: number, x1: number, gap: number, o: { layer?: number; fixed?: Pose; name?: string } = {}): [Part, Part] {
    const mk = (k: string, y: number): Part =>
      base(id + k, "ground", o.layer ?? 0, S(capsule(x1 - x0, 7)), {
        thick: 5,
        name: o.name ?? `${id.charAt(0).toUpperCase()}${id.slice(1)} rail`,
        fixed: o.fixed ? xfPose(o.fixed, [x0, y, 0]) : [x0, y, 0],
      });
    return [mk("a", gap / 2 + 3.5), mk("b", -gap / 2 - 3.5)];
  },
  /** Link with a stadium slot from s0 to s1 along local x. */
  slotLink(id: string, L: number, s0: number, s1: number, o: PartOpts & { w?: number; slotW?: number; x0?: number } = {}): Part {
    const w = o.w ?? 22;
    const sw = o.slotW ?? 12;
    return base(id, o.role ?? "output", o.layer ?? 0, S(roundedPoly([[o.x0 ?? 0, 0], [L, 0]], w / 2), [slot(s0, s1, 0, sw / 2), ...(o.holes ?? [])]), {
      marks: o.marks ?? [],
      ...place(o),
    });
  },
  /** Involute spur gear; bore false leaves it solid, a number sets the D-bore radius. */
  gear(id: string, z: number, m: number, o: PartOpts & { teeth?: (k: number) => boolean; bore?: number | false } = {}): Part {
    const rp = (m * z) / 2;
    const holes = o.bore === false ? [] : [dBore(o.bore ?? Math.min(6.5, rp * 0.4))];
    return base(id, o.role ?? "driver", o.layer ?? 0, S(gearOutline(z, m, 1, 1.25, o.teeth), holes), {
      thick: 7,
      marks: [ring(Math.max(rp - 2.6 * m, rp * 0.45))],
      ...place(o),
      z,
      m,
    });
  },
  /** Internal gear: the tooth spaces are cut as an external outline with addendum and dedendum swapped. */
  ringGear(id: string, z: number, m: number, o: PartOpts & { rim?: number } = {}): Part {
    const rp = (m * z) / 2;
    const rim = o.rim ?? rp + 4 * m;
    return base(id, o.role ?? "ground", o.layer ?? 0, S(circle(rim, 0, 0, 96), [gearOutline(z, m, 1.25, 1)]), {
      thick: 7,
      marks: [ring(rim - 3)],
      ...place(o),
      z,
      m,
    });
  },
  /** Straight rack: pitch line on local y = 0, teeth toward +y, tooth k centred at x = k·π·m. */
  rack(id: string, k0: number, k1: number, m: number, o: PartOpts & { depth?: number } = {}): Part {
    const p = Math.PI * m;
    const ad = m;
    const de = 1.25 * m;
    const tw = Math.tan(20 * D2R);
    const depth = o.depth ?? 12;
    const pts: Vec2[] = [[k0 * p - p / 2, -de - depth]];
    for (let k = k0; k <= k1; k++) {
      const c = k * p;
      pts.push([c - p / 4 - de * tw, -de], [c - p / 4 + ad * tw, ad], [c + p / 4 - ad * tw, ad], [c + p / 4 + de * tw, -de]);
    }
    pts.push([k1 * p + p / 2, -de], [k1 * p + p / 2, -de - depth]);
    return base(id, o.role ?? "output", o.layer ?? 0, S(pts), { thick: 7, ...place(o), m });
  },
  disc(id: string, r: number, o: PartOpts = {}): Part {
    return base(id, o.role ?? "driver", o.layer ?? 0, S(circle(r, 0, 0, 72), o.holes ?? []), {
      thick: o.thick ?? THICK,
      marks: o.marks ?? [ring(r - 3)],
      ...place(o),
    });
  },
  custom(id: string, outer: Vec2[], o: PartOpts = {}): Part {
    return base(id, o.role ?? "link", o.layer ?? 0, S(outer, o.holes ?? []), {
      thick: o.thick ?? THICK,
      marks: o.marks ?? [],
      ...place(o),
    });
  },
  /** The traced point marker. */
  tracer(id: string, layer: number, o: Place & { r?: number; thick?: number } = {}): Part {
    return base(id, "trace", layer, S(circle(o.r ?? 3.2, 0, 0, 20)), { thick: o.thick ?? 6.8, ...place(o) });
  },
};

/** z of a part's layer on the grid, before plating: its explode level. */
export const layerZ = (p: Part): number => p.layer * LAYER;

/** z range of a part (its range along its axis), mm, plating included. A pin runs from its layer through `span` layers plus its cap and overhang. */
export function heights(p: Part): [number, number] {
  // a part on an x or y axis: its extent along that axis, from `along`
  if (p.axis === "x" || p.axis === "y") {
    const w0 = (p.along ?? 0) + (p.dz ?? 0);
    return [w0, p.role === "pin" ? w0 + (p.span ?? 1) * LAYER + (p.th ?? THICK) + (p.over ?? 0.8) : w0 + p.thick];
  }
  const z0 = p.layer * LAYER + (p.dz ?? 0);
  if (p.role === "pin") return [z0, (p.layer + (p.span ?? 1)) * LAYER + (p.th ?? THICK) + (p.over ?? 0.8)];
  return [z0, z0 + p.thick];
}
