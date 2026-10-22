// The joint kits for contacts (A21): pin in a slot (J4), slide (J5), gear mesh (J6), cam (J7), belt and flexible member
// (J8, J12), crossed mesh (J9), screw (J11), compliant joint (J13), and the kinds the audits found missing: pallet
// contact, fork and pin, pawl and tooth, pin and lobe, tongue in slot, ring on hub, ring on rollers, strap on sheave,
// groove cam. Each builds its canonical hardware in the contact's own frame from the declared joint.
import { circle, roundRect, type Vec2 } from "../../core/geom";
import { H } from "../../hardware/primitives";
import { BEARINGS, circlipExt } from "../../hardware/tables";
import { planeCoords } from "../frames";
import { fromPlane } from "../frames";
import type { BuildCtx, JointNote } from "../ctx";
import { MIN_GAP } from "../constants";
import { type Contact, contactOf, cutRing, freeSpot, localAt, mid, ringOffsets, stadium } from "../contact";
import { titleOf } from "../lib";
import type { JointInfo, KitId } from "../sites";
import type { Local } from "../lib";
import type { Rule } from "./types";
import { v3 } from "../../kin/math";

interface KitBuild {
  (ctx: BuildCtx, c: Contact, L: Local): { serves?: Record<string, string[]>; note: string; badge?: [string, "ok" | "warn"] } | void;
}

interface KitDef {
  id: string;
  ids: string[];
  fixture: string;
  kits: KitId[];
  build: KitBuild;
  /** Joints of the kit another rule builds. */
  skip?: (ji: JointInfo) => boolean;
}

const bodyOf = (ctx: BuildCtx, id: string): string => (ctx.parts.has(id) ? id : "ground");
const partId = (ctx: BuildCtx, id: string): string | undefined => ctx.parts.get(id)?.id;

/** Local z of the top of the base under a contact, or null when the base is not under the stack axis. */
const baseZ = (ctx: BuildCtx, c: Contact): number => (ctx.base ? ctx.base.top - c.frame.o[2] : -4);

function contactRule(def: KitDef): Rule {
  return {
    id: def.id,
    tier: "AUTO",
    ids: def.ids,
    fixture: def.fixture,
    applies: (ctx) => ctx.joints.some((j) => def.kits.includes(j.kit) && !def.skip?.(j)),
    apply(ctx) {
      for (const ji of ctx.joints.filter((j) => def.kits.includes(j.kit) && !def.skip?.(j))) {
        const c = contactOf(ctx, ji);
        if (!c) {
          ctx.issues.push(`joint ${ji.id}: no body of it is stacked, kit ${ji.kit} not built`);
          continue;
        }
        const L = localAt(ctx, c);
        const r = def.build(ctx, c, L);
        const solids = L.out();
        if (solids.length) ctx.add(solids);
        const note: JointNote = {
          id: ji.id,
          kit: ji.kit,
          at: ji.at,
          title: `${ji.kit} · ${titleOf(ji.id)}`,
          note: r?.note ?? `${titleOf(ji.id)}: ${ji.kit} built from the declared joint.`,
          serves: r?.serves ?? {},
          ...(r?.badge ? { badge: r.badge } : {}),
        };
        ctx.note(note);
        (ctx.fired[def.id] ??= []).push(ji.id);
      }
    },
  };
}

// ------------------------------------------------------------------------------------------------ J4 and kin

const ROLLER = BEARINGS.find((b) => b.name === "625")!;

/** A track roller on a stud in a slot cut in the other body, wear strips on its walls, a felt oiler. */
function rollerInSlot(ctx: BuildCtx, c: Contact, L: Local, what: string): ReturnType<KitBuild> {
  const id = c.id;
  const d = ROLLER.d;
  const D = 13;
  const zc = mid(c.zb, mid(c.za));
  const rw = 4;
  const lo = Math.min(c.za?.[0] ?? zc, c.zb?.[0] ?? zc) - 0.5;
  const hi = Math.max(c.za?.[1] ?? zc, c.zb?.[1] ?? zc) + 1;
  const carrier = bodyOf(ctx, c.a);
  L.add(H.shaft(`${id}-stud`, { d, z0: lo, z1: hi }, { body: carrier, name: `Stud Ø${d} x ${+(hi - lo).toFixed(1)}, pressed into the pin carrier` }));
  L.add(H.roller(`${id}-roller`, d, D, { body: carrier, z0: zc - rw / 2, z1: zc + rw / 2 }));
  const sw = (D + 0.4) / 2 + 1.5;
  const relief = 4;
  const x0 = c.run[0] - relief;
  const x1 = c.run[1];
  const sid = partId(ctx, c.b);
  if (sid) cutRing(ctx, c, sid, stadium(x0, x1, sw));
  const z0 = c.zb?.[0] ?? zc - 3;
  const z1 = c.zb?.[1] ?? zc + 3;
  const strips: string[] = [];
  for (const [k, y] of [[0, sw - 0.75], [1, -(sw - 0.75)]] as const) {
    const wall: Vec2[] = [[x0 - D / 2, y - 0.75], [x1 + D / 2, y - 0.75], [x1 + D / 2, y + 0.75], [x0 - D / 2, y + 0.75]];
    L.add(H.wearStrip(`${id}-wear${k}`, wall, { body: bodyOf(ctx, c.b), z0: z0 + 0.5, z1: z1 - 0.5, ...(k ? { name: "" } : { qty: 2 }) }));
    strips.push(`${id}-wear${k}`);
  }
  L.add(H.felt(`${id}-felt`, [[x0 - D / 2 - 3.5, -1.5], [x0 - D / 2 + 0.5, -1.5], [x0 - D / 2 + 0.5, 1.5], [x0 - D / 2 - 3.5, 1.5]], { body: bodyOf(ctx, c.b), z0: z0 + 1, z1: z1 - 1 }));
  void circlipExt;
  return { serves: { F8: [`${id}-felt`], M14: strips }, note: `${titleOf(id)}: ${what}; Ø${D} track roller on a Ø${d} stud, hardened wear strips in the slot walls, a felt oiler in the relieved end.` };
}

const j4 = contactRule({ id: "j4-slot-roller", ids: ["J4", "M14"], fixture: "kin:geneva", kits: ["J4"], build: (ctx, c, L) => rollerInSlot(ctx, c, L, "pin in a slot") });
const pinLobe = contactRule({ id: "pin-lobe", ids: ["J4", "M14"], fixture: "kin:pinLobe", kits: ["pin-lobe"], build: (ctx, c, L) => rollerInSlot(ctx, c, L, "pin and lobe") });
const grooveCam = contactRule({ id: "groove-cam", ids: ["J7", "M14"], fixture: "kin:grooveCam", kits: ["groove-cam"], build: (ctx, c, L) => rollerInSlot(ctx, c, L, "roller in a groove") });

// ------------------------------------------------------------------------------------------------ J5

/** Extent of a body's part in a contact's frame: [x0, x1, y0, y1]. */
function extentIn(ctx: BuildCtx, c: Contact, body: string): [number, number, number, number] {
  const part = ctx.parts.get(body);
  if (!part) return [-20, 20, -10, 10];
  const p0 = planeCoords(c.frame, c.at).uv;
  const pts = part.profile.outer.map((q) => planeCoords(c.frame, fromPlane(part.frame, q, 0)).uv);
  const xs = pts.map((q) => q[0] - p0[0]);
  const ys = pts.map((q) => q[1] - p0[1]);
  return [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
}

const j5 = contactRule({
  id: "j5-slide",
  ids: ["J5", "F5", "F7", "A6"],
  fixture: "kin:sliderCrank",
  kits: ["J5"],
  build(ctx, c, L) {
    const id = c.id;
    const slider = c.a === "ground" ? c.b : c.a;
    const host = slider === c.a ? c.b : c.a;
    const e = extentIn(ctx, c, slider);
    const zs = ctx.extent(slider);
    if (!zs) return;
    const w0 = zs.w0;
    const w1 = zs.w1;
    const Ls = e[1] - e[0];
    const Ws = e[3] - e[2];
    // the slider's own run along the contact's x: the contact's run is a's on b, so a slide declared ground-first runs
    // the other way
    const run: [number, number] = c.a === slider ? c.run : [-c.run[1], -c.run[0]];
    const x0 = run[0] + e[0] - 10;
    const x1 = run[1] + e[1] + 10;
    const hostBody = bodyOf(ctx, host);
    const rh = w1 - w0 + 1.5;
    const gap = 3;
    // the reference rail (plain, dowelled) and the gibbed rail with its keeper (F1, F2, F7)
    const yr = Ws / 2 + 3.5;
    const sideY: [number, number][] = [[0, e[3] + 3.5 + 0.5], [1, e[2] - 3.5 - 0.5 - gap]];
    const mk = (k: number, y: number): Vec2[] => roundRect(x0, y - 3.5, x1, y + 3.5, 3.5);
    void yr;
    const baseTop = baseZ(ctx, c);
    for (const [k, y] of sideY) {
      L.add(H.plate(`${id}-rail${k}`, mk(k, y), { body: hostBody, kind: "plate", role: "ground", name: k ? "Gibbed slide rail" : "Reference slide rail, dowelled", z0: w0, z1: w0 + rh, joints: [id], mat: "Steel C45, ground" }));
      // a ground riser along the straight run (A6)
      // as wide as its rail, so the slider's underside never meets it (A12)
      if (w0 - baseTop > 0.5) L.add(H.plate(`${id}-riser${k}`, roundRect(x0, y - 3.5, x1, y + 3.5, 1), { body: hostBody, kind: "plate", role: "ground", name: "Ground steel riser", z0: baseTop, z1: w0, mat: "Steel C45, ground" }));
    }
    // gib on the gibbed side, between the slider and its rail (F7)
    L.add(H.gib(`${id}-gib`, x1 - x0 - 20, { body: hostBody, at: [x0 + 10, e[2] - gap / 2 - 0.5, 0], z0: w0 + 0.5, z1: w1 - 0.5 }));
    // keeper plate over the gibbed rail, lapping the slider (F2)
    const ky = e[2] - 3.5 - 0.5 - gap;
    L.add(H.plate(`${id}-keeper`, roundRect(x0 + 8, ky - 5, x1 - 8, ky + 5 + 4, 1), { body: hostBody, kind: "plate", role: "ground", name: "Keeper plate, laps the slider", z0: w0 + rh, z1: w0 + rh + 3, mat: "Aluminium 6061-T6, anodised" }));
    const nScrew = Math.max(2, Math.ceil((x1 - x0 - 16) / 100) + 1);
    for (let k = 0; k < nScrew; k++) {
      const x = x0 + 12 + ((x1 - x0 - 24) * k) / (nScrew - 1);
      L.add(H.screw(`${id}-sc${k}`, "csk", 3, rh + 3 + 4 + Math.max(0, w0 - baseTop), { body: hostBody, at: [x, ky, 0], face: w0 + rh + 3, dir: -1, ...(k ? { name: "", qty: 0 } : {}) }));
    }
    for (const [k, x] of [[0, x0 + 4], [1, x1 - 4]] as const) L.add(H.dowel(`${id}-dw${k}`, 3, { body: hostBody, at: [x, e[3] + 4, 0], z0: baseTop, z1: w0 + rh, ...(k ? { name: "", qty: 0 } : { name: "Dowel pin Ø3 h6, reference rail to base", qty: 2 }) }));
    // wipers at both ends of the slider and a grease nipple on the keeper (F8)
    const sb = bodyOf(ctx, slider);
    // the wipers ride the slider, at its ends where it stands in the reference configuration
    for (const [k, x] of [[0, e[0] - 3], [1, e[1] + 1]] as const) L.add(H.wiper(`${id}-wip${k}`, [[x, e[2]], [x + 2, e[2]], [x + 2, e[3]], [x, e[3]]], { body: sb, z0: w0 + 0.5, z1: w1 - 0.5, ...(k ? { name: "", qty: 0 } : { qty: 2 }) }));
    L.add(H.nipple(`${id}-nip`, { body: hostBody, at: [(x0 + x1) / 2, ky, 0], z0: w0 + rh + 3, z1: w0 + rh + 3 + 9 }));
    // one end stop block with a neoprene pad just past each end of the travel (F5)
    for (const [k, x, s] of [[0, x0 + 1, 1], [1, x1 - 1, -1]] as const) {
      const sx = x - s * 4;
      L.add(H.stop(`${id}-stop${k}`, roundRect(Math.min(x, x - s * 8), e[2] - 4, Math.max(x, x - s * 8), e[3] + 4, 1), { body: hostBody, z0: w0, z1: w1 + 2, ...(k ? { name: "", qty: 0 } : { qty: 2 }) }));
      L.add(H.bumper(`${id}-pad${k}`, 3, 8, { body: hostBody, at: [sx + s * 5, 0, 0], z0: w0 + 1, z1: w0 + 3, ...(k ? { name: "", qty: 0 } : { qty: 2 }) }));
    }
    return {
      serves: { F1: [`${id}-dw0`, `${id}-dw1`], F2: [`${id}-keeper`], F5: [`${id}-stop0`, `${id}-stop1`], F7: [`${id}-gib`], F8: [`${id}-wip0`, `${id}-nip`] },
      note: `${titleOf(id)}: ${Ls.toFixed(0)} mm slider on a dowelled reference rail and a gibbed rail under a keeper; wipers, a grease nipple and an end stop with a pad at each end of the ${(run[1] - run[0]).toFixed(0)} mm travel.`,
    };
  },
});

// ------------------------------------------------------------------------------------------------ J6 and J9

/** A timing mark on a part's top face at the pitch point (F9). */
function timingMark(ctx: BuildCtx, body: string, at: readonly number[]): boolean {
  const part = ctx.parts.get(body);
  if (!part) return false;
  const p = planeCoords(part.frame, [at[0]!, at[1]!, at[2]!]).uv;
  const r = Math.hypot(p[0], p[1]);
  if (r < 2) return false;
  const u: Vec2 = [p[0] / r, p[1] / r];
  part.marks.push({ kind: "timing", pts: [[u[0] * (r - 2.5), u[1] * (r - 2.5)], [u[0] * (r - 0.4), u[1] * (r - 0.4)]] });
  return true;
}

function siteOf(ctx: BuildCtx, body: string) {
  return ctx.sites.find((s) => s.fixed && s.bodies.includes(body));
}

const j6 = contactRule({
  id: "j6-mesh",
  ids: ["J6", "F7", "F9"],
  fixture: "kin:gearPair",
  kits: ["J6"],
  // a friction pair (a rolling joint given by its ratio) is built by src/builder/friction.ts
  skip: (ji) => ji.joint.type === "rolling" && ji.joint.ratio !== undefined,
  build(ctx, c) {
    const marked = [c.a, c.b].filter((b) => timingMark(ctx, b, c.at));
    // the backlash eccentric goes under the housing of the second gear's live shaft (F7)
    const s = siteOf(ctx, c.b) ?? siteOf(ctx, c.a);
    if (s && s.live) ctx.eccentric.add(s.id);
    return { serves: { F9: marked, F7: s ? [`${s.id}-ecc`] : [] }, note: `${titleOf(c.id)}: parallel mesh; timing marks on ${marked.join(" and ") || "the gears"}${s ? `; eccentric housing on ${s.id} sets the backlash` : ""}.` };
  },
});

/** Gears of a crossed mesh get a shim pack at the back face and a thrust washer (F7, F4, F9). */
const j9 = contactRule({
  id: "j9-crossed-mesh",
  ids: ["J9", "F4", "F7", "F9"],
  fixture: "kin:crossedMesh",
  kits: ["J9"],
  build(ctx, c) {
    const marked = [c.a, c.b].filter((b) => timingMark(ctx, b, c.at));
    for (const b of [c.a, c.b]) {
      const s = siteOf(ctx, b);
      if (s) ctx.shim.set(b, 1);
    }
    return { serves: { F9: marked, F7: [c.a, c.b].map((b) => `${b}-shim`), F4: [c.a, c.b].map((b) => `${b}-tw`) }, note: `${titleOf(c.id)}: crossed-axis mesh; a 1 mm shim pack behind each gear sets the mounting distance (backlash, contact pattern), timing marks at the mesh.` };
  },
});

// ------------------------------------------------------------------------------------------------ J7 and cams

const camBuild: KitBuild = (ctx, c, L) => {
  const id = c.id;
  const follower = ctx.kin.bodies.find((b) => b.id === c.b)?.role === "follower" || ctx.kin.bodies.find((b) => b.id === c.a)?.role === "cam" ? c.b : c.a;
  const cam = follower === c.a ? c.b : c.a;
  const fb = bodyOf(ctx, follower);
  const z = mid(ctx.extent(follower) ? [ctx.extent(follower)!.w0, ctx.extent(follower)!.w1] : null, mid(c.za, mid(c.zb)));
  const d = 5;
  const D = 13;
  L.add(H.roller(`${id}-roller`, d, D, { body: fb, z0: z - 2, z1: z + 2 }));
  L.add(H.shaft(`${id}-stud`, { d, z0: z - 4, z1: z + 4.5 }, { body: fb, name: `Follower stud Ø${d}` }));
  // a return spring on a seat with a preload screw along the follower's run (F6)
  const k = c.run[1] - c.run[0] > 1 ? 1 : 1;
  const far = c.run[1] + D / 2 + 6;
  L.add(H.spring(`${id}-spring`, "compression", { body: fb, at: [far + 8, 0, 0], z0: z - 3, z1: z + 3 }));
  L.add(H.plate(`${id}-seat`, roundRect(far + 14, -6, far + 20, 6, 1), { body: "ground", kind: "bracket", role: "ground", name: "Spring seat with preload screw", z0: z - 6, z1: z + 6 }));
  L.add(H.felt(`${id}-oil`, [[-2, D / 2 + 2], [2, D / 2 + 2], [2, D / 2 + 5], [-2, D / 2 + 5]], { body: "ground", z0: z - 2, z1: z + 2 }));
  const zero = timingMark(ctx, cam, c.at);
  void k;
  return { serves: { F6: [`${id}-spring`, `${id}-seat`], F8: [`${id}-oil`], F9: zero ? [cam] : [] }, note: `${titleOf(id)}: roller follower on a stud; return spring on a seat with a preload screw; felt oiler on the track; zero line on the cam.` };
};
const j7 = contactRule({ id: "j7-cam", ids: ["J7", "F6"], fixture: "kin:camFollower", kits: ["J7"], build: camBuild });

// ------------------------------------------------------------------------------------------------ J8 / J12

/** An idler on the slack span: a flanged flat pulley on a stud through an arm slotted across the span, on two posts (F7, F10). */
function idler(ctx: BuildCtx, c: Contact, L: Local, what: string): ReturnType<KitBuild> {
  const id = c.id;
  const ga = ctx.geoms.get(c.a);
  const gb = ctx.geoms.get(c.b);
  const pa = ga ? ga.frame.o : c.at;
  const pb = gb ? gb.frame.o : c.at;
  const span = v3.sub(pb, pa);
  const mid3 = v3.add(pa, v3.mul(span, 0.35));
  const along = v3.unit(span);
  const nrm = v3.cross(c.frame.z, along);
  const R = 9;
  const z = mid(c.za, mid(c.zb));
  const p0 = planeCoords(c.frame, c.at).uv;
  const tries: Vec2[] = [];
  for (const side of [1, -1]) for (const off of [14, 20, 28, 40]) tries.push([side * off, 0]);
  const centre = planeCoords(c.frame, mid3).uv;
  const nuv = planeCoords({ ...c.frame, o: [0, 0, 0] }, nrm).uv;
  const spot = freeSpot(ctx, centre, R, tries.map(([s]) => [nuv[0] * s, nuv[1] * s] as Vec2), c.frame.o[2] + z - 6, c.frame.o[2] + z + 8);
  if (!spot) {
    ctx.issues.push(`${id}: no free place for an idler on the span`);
    return { note: `${titleOf(id)}: ${what}; no free place for the idler found.` };
  }
  const q: Vec2 = [spot[0] - p0[0], spot[1] - p0[1]];
  L.add(H.bearing(`${id}-idler-brg`, ROLLER, { at: [q[0], q[1], 0], z0: z - 2.5, z1: z + 2.5, closure: "seal" }));
  L.add(H.solid(`${id}-idler`, { name: `Flat idler Ø${2 * R}, flanged`, kind: "pulley", role: "hw", mat: "Aluminium 6061-T6, anodised", outer: circle(R, q[0], q[1], 36), holes: [circle(ROLLER.D / 2, q[0], q[1], 24)], z0: z - 3, z1: z + 3, D: 2 * R }));
  L.add(H.plate(`${id}-arm`, roundRect(q[0] - 6, q[1] - 22, q[0] + 6, q[1] + 22, 3), { kind: "bracket", role: "ground", name: "Idler arm, slotted across the span", z0: z + 4, z1: z + 8, holes: [stadium(q[1] - 12, q[1] + 12, 2.6).map(([a, b]): Vec2 => [q[0] + b * 0 + (a - q[1]) * 0 + 0, a])] }));
  void idler;
  return { serves: { F7: [`${id}-arm`], F10: [`${id}-idler`] }, note: `${titleOf(id)}: ${what}; idler on a sealed bearing on a stud through an arm slotted across the span, for the take-up.` };
}

const j8 = contactRule({ id: "j8-belt", ids: ["J8", "V4"], fixture: "kin:beltDrive", kits: ["J8"], build: (ctx, c, L) => idler(ctx, c, L, "belt") });
// a timing belt between two pulleys is built by src/builder/flexible.ts
const j12 = contactRule({ id: "j12-other", ids: ["J12", "F7"], fixture: "kin:chainDrive", kits: ["J12"], skip: (ji) => ["belt", "chain"].includes(String((ji.joint as unknown as Record<string, unknown>).flexible)) && ji.a !== "ground" && ji.b !== "ground", build: (ctx, c, L) => idler(ctx, c, L, "flexible member") });

const strapSheave = contactRule({
  id: "strap-sheave",
  ids: ["J12", "F1", "F2", "A11"],
  fixture: "kin:rope",
  kits: ["strap-sheave"],
  build(ctx, c, L) {
    const id = c.id;
    const z = mid(c.za, mid(c.zb));
    L.add(H.dowel(`${id}-becket`, 4, { body: "ground", at: [8, 0, 0], z0: z - 5, z1: z + 5, name: "Becket pin Ø4, in a post screwed to the base" }));
    L.add(H.collar(`${id}-thimble`, 4, 10, { body: "ground", at: [8, 0, 0], z0: z - 2, z1: z + 2, name: "Thimble Ø10 on the becket pin" }));
    L.add(H.plate(`${id}-guard`, roundRect(-16, -16, 16, 16, 4), { body: "ground", kind: "bracket", role: "ground", name: "Guard over the sheave, keeps the rope in its groove", z0: z + 4, z1: z + 6.5 }));
    return { serves: { F1: [`${id}-becket`], F2: [`${id}-guard`] }, note: `${titleOf(id)}: rope end on a becket pin with a thimble; a guard over the sheave keeps the rope in its groove.` };
  },
});

// J11 is src/builder/screws.ts, J13 src/builder/compliant.ts

// ------------------------------------------------------------------------------------------------ the missing kinds

const pallet = contactRule({
  id: "pallet-contact",
  ids: ["J7", "F6", "M14"],
  fixture: "kin:escapement",
  kits: ["pallet"],
  build(ctx, c, L) {
    const id = c.id;
    const pal = c.a;
    const z0 = ctx.extent(pal)?.w0 ?? 0;
    const z1 = ctx.extent(pal)?.w1 ?? z0 + 6;
    L.add(H.wearStrip(`${id}-stone`, [[-4, -1.2], [4, -1.2], [4, 1.2], [-4, 1.2]], { body: bodyOf(ctx, pal), z0: z0 + 0.5, z1: z1 - 0.5, name: "Pallet stone, hardened, set in the pallet" }));
    L.add(H.setScrew(`${id}-ss`, 2, { body: bodyOf(ctx, pal), at: [0, 2.5, 0], z0: z0 + 1, z1: z1 - 1, outer: circle(1, 0, 0, 12), name: "Set screw M2, adjusts the pallet stone" }));
    return { serves: { M14: [`${id}-stone`], F6: [`${id}-ss`] }, note: `${titleOf(id)}: pallet contact; a hardened pallet stone set in the pallet and held by a set screw for the adjustment.` };
  },
});

const forkPin = contactRule({
  id: "fork-pin",
  ids: ["J4", "F2"],
  fixture: "kin:fork",
  kits: ["fork-pin"],
  build(ctx, c, L) {
    const id = c.id;
    const z = mid(c.zb, mid(c.za));
    L.add(H.roller(`${id}-pin`, 2, 5, { body: bodyOf(ctx, c.a), z0: z - 2, z1: z + 2, name: "Impulse pin Ø5, jewelled, on the balance" }));
    L.add(H.dowel(`${id}-guard`, 2, { body: bodyOf(ctx, c.b), at: [6, 6, 0], z0: z - 3, z1: z + 3, name: "Guard pin Ø2, keeps the lever from tripping" }));
    return { serves: { F2: [`${id}-pin`] }, note: `${titleOf(id)}: impulse pin in the fork; a guard pin beside the fork mouth.` };
  },
});

const pawlTooth = contactRule({
  id: "pawl-tooth",
  ids: ["J7", "F6", "F5"],
  fixture: "kin:ratchet",
  kits: ["pawl-tooth"],
  build(ctx, c, L) {
    const id = c.id;
    const pawl = c.a;
    const z0 = ctx.extent(pawl)?.w0 ?? 0;
    const z1 = ctx.extent(pawl)?.w1 ?? z0 + 6;
    L.add(H.spring(`${id}-spring`, "leaf", { body: "ground", at: [-8, 8, 0], z0: z1 + 0.5, z1: z1 + 1.5, name: "Pawl spring, leaf, screwed down" }));
    L.add(H.screw(`${id}-sc`, "button", 3, 8, { body: "ground", at: [-12, 8, 0], face: z1 + 1.5, dir: -1, name: "Screw M3, holds the pawl spring" }));
    return { serves: { F6: [`${id}-spring`] }, note: `${titleOf(id)}: pawl on a tooth; a screwed-down leaf spring seats the pawl.` };
  },
});

const tongueSlot = contactRule({
  id: "tongue-slot",
  ids: ["J5", "F8", "M14"],
  fixture: "kin:tongueSlot",
  kits: ["tongue-slot"],
  build(ctx, c, L) {
    const id = c.id;
    const z = mid(c.zb, mid(c.za));
    const run = Math.max(8, c.run[1] - c.run[0]);
    for (const [k, y] of [[0, 4], [1, -4]] as const) L.add(H.wearStrip(`${id}-liner${k}`, [[-run / 2 - 4, y - 0.6], [run / 2 + 4, y - 0.6], [run / 2 + 4, y + 0.6], [-run / 2 - 4, y + 0.6]], { body: bodyOf(ctx, c.b), z0: z - 2, z1: z + 2, ...(k ? { name: "", qty: 0 } : { qty: 2 }) }));
    L.add(H.nipple(`${id}-nip`, { body: bodyOf(ctx, c.b), at: [0, 9, 0], z0: z, z1: z + 9 }));
    return { serves: { M14: [`${id}-liner0`], F8: [`${id}-nip`] }, note: `${titleOf(id)}: tongue in its slot; liners on both sides and a grease nipple into the slot.` };
  },
});

const ringHub = contactRule({
  id: "ring-hub",
  ids: ["J3", "F2"],
  fixture: "kin:ringHub",
  kits: ["ring-hub"],
  build(ctx, c, L) {
    const id = c.id;
    const z = ctx.extent(c.a)?.w1 ?? 0;
    L.add(H.retainerPlate(`${id}-ret`, 14, 26, { body: "ground", z0: z + 0.5, z1: z + 2.5, name: "Retainer ring over the ring on its hub" }));
    return { serves: { F2: [`${id}-ret`] }, note: `${titleOf(id)}: ring on its hub, held by a retainer ring.` };
  },
});

const ringRollers = contactRule({
  id: "ring-rollers",
  ids: ["J6", "F2"],
  fixture: "kin:ringRollers",
  kits: ["ring-rollers"],
  build(ctx, c, L) {
    const id = c.id;
    const z = mid(c.za, mid(c.zb));
    L.add(H.washer(`${id}-cage`, 36, 42, { body: bodyOf(ctx, c.a), z0: z - 1.5, z1: z + 1.5, name: "Roller cage ring, keeps the rollers apart" }));
    return { serves: { F2: [`${id}-cage`] }, note: `${titleOf(id)}: ring on rollers; a cage ring keeps the rollers apart.` };
  },
});

export const contactRules: Rule[] = [j6, j9, j4, pinLobe, grooveCam, j5, j7, pallet, forkPin, pawlTooth, tongueSlot, ringHub, ringRollers, j8, j12, strapSheave];

void MIN_GAP;
void ringOffsets;
