// Cam (J7): a translating follower's return spring stretched from a pin to a post, a felt oiler behind the roller and
// a zero line on the cam.
import { H } from "../../../hardware/primitives";
import { fromPlane, planeCoords } from "../../frames";
import { Local as LocalFrame, titleOf } from "../../lib";
import type { Rule } from "../types";
import { v3 } from "../../../kin/math";
import { anchorName } from "../../../kin/compose";
import { type KitBuild, baseZ, contactRule } from "./kit";

/**
 * J7: a cam and its follower. The record's roller (a disc body on a pin in the follower) is the roller, so the kit adds
 * none; a translating follower gets its return spring (F6), a compression spring stretched between a pin on the
 * follower's far end and a post past the guide's end stop, above the slide, pushing the follower onto the cam; a felt
 * oiler rides the follower behind the roller (F8); a zero line is engraved on the cam from its hub to its base circle
 * (F9). A swinging follower is held on its cam by its own linkage or by a form-closed partner and takes no spring.
 */
const camBuild: KitBuild = (ctx, c) => {
  const id = c.id;
  const isCam = (b: string) => String(ctx.geoms.get(b)?.shape.type) === "cam";
  // a rocker's nose on a follower (a desmodromic's opening finger on the stem's end): the rocker's own stack holds it
  if (!isCam(c.a) && !isCam(c.b)) return { serves: {}, note: `${titleOf(id)}: a rocker's nose on the follower; nothing to add, the rocker's pivot and the follower's guide hold both.` };
  const cam = isCam(c.b) ? c.b : c.a;
  const other = cam === c.a ? c.b : c.a;
  const camG = ctx.geoms.get(cam);
  const up = c.frame.z;
  const serves: Record<string, string[]> = {};
  const notes: string[] = [];
  // the translating follower: the other body, or the body it rides on a pin, on a prismatic joint to the ground
  const carriers = [other, ...ctx.kin.joints.filter((j) => j.type === "revolute" && (j.a === other || j.b === other)).map((j) => (j.a === other ? j.b : j.a))];
  const slide = ctx.kin.joints.find((j) => j.type === "prismatic" && (j.a === "ground" || j.b === "ground") && carriers.includes(j.a === "ground" ? j.b : j.a));
  const F = slide ? (slide.a === "ground" ? slide.b : slide.a) : null;
  const partF = F ? ctx.parts.get(F) : undefined;
  const exF = F ? ctx.extent(F) : null;
  if (F && slide && partF && exF && camG) {
    const r = ctx.joints.find((q) => q.id === slide.id)!.r;
    const centre = camG.frame.o;
    const away = v3.dot(v3.sub(c.at, centre), r.axis) >= 0 ? 1 : -1;
    const d = v3.unit(v3.mul(v3.perp(r.axis, up), away));
    const o = v3.sub(c.at, v3.mul(up, v3.dot(v3.sub(c.at, c.frame.o), up)));
    const Lf = new LocalFrame({ o, x: d, z: up }, { joints: [id] });
    const xOf = (p: readonly number[]) => v3.dot(v3.sub([p[0]!, p[1]!, p[2]!], o), d);
    const pts = partF.profile.outer.map((q) => fromPlane(partF.frame, q, 0));
    const far = Math.max(...pts.map(xOf));
    const top = v3.dot(v3.sub(fromPlane(exF.frame, [0, 0], exF.w1), o), up);
    // the stroke: the slide's limits, else how far the follower moves along its axis over the cycle
    const along = ctx.sampled.us.map((_, i) => v3.dot(ctx.xfOf(F, i).t, d));
    const travel = Math.max(1, slide.limits ? Math.abs(slide.limits[1] - slide.limits[0]) : Math.max(...along) - Math.min(...along));
    const Ds = 6;
    const zs0 = top + 3;
    const zs1 = zs0 + Ds;
    const xa = far - 6;
    const xb = far + travel + 18;
    const baseTop = ctx.base ? ctx.base.top - o[2] : baseZ(ctx, c);
    {
      Lf.add(H.shaft(`${id}-spin`, { d: 4, z0: top - 0.5, z1: zs1 + 1 }, { body: F, at: [xa, 0, 0], name: "Spring pin Ø4, pressed into the follower" }));
      Lf.add(H.standoff(`${id}-post`, { body: "ground", at: [xb, 0, 0], z0: baseTop, z1: zs1 + 1, name: "Spring post Ø8 on the base, M4" }));
    }
    // the spring at unit length along the follower's axis, stretched from the pin to the post each frame (D9)
    // from the pin's face to the post's (pin Ø4, post Ø8)
    const aW = v3.add(o, v3.add(v3.mul(d, xa + 2.5), v3.mul(up, (zs0 + zs1) / 2)));
    const bW = v3.add(o, v3.add(v3.mul(d, xb - 5.5), v3.mul(up, (zs0 + zs1) / 2)));
    const coil = H.spring(`${id}-spring`, "compression", { body: F, D: Ds, z0: zs0, z1: zs1, name: `Compression spring Ø${Ds}, wire 0.8: holds the follower on the cam` });
    coil.outer = [[0, -Ds / 2], [1, -Ds / 2], [1, Ds / 2], [0, Ds / 2]];
    coil.holes = [];
    coil.marks = [{ kind: "boss", pts: Array.from({ length: 13 }, (_, k): [number, number] => [k / 12, (k % 2 ? 1 : -1) * (Ds / 2 - 0.6)]) }];
    coil.at = [xa + 2.5, 0, 0];
    coil.stretch = [anchorName(F, aW), anchorName("ground", bW)];
    Lf.add(coil);
    // the felt oiler behind the roller, on the follower (F8)
    const rr = Number(ctx.geoms.get(other)?.shape.radius ?? 0);
    const exO = ctx.extent(other);
    if (rr > 0 && exO) {
      const z0 = v3.dot(v3.sub(fromPlane(exO.frame, [0, 0], exO.w0), o), up);
      const z1 = v3.dot(v3.sub(fromPlane(exO.frame, [0, 0], exO.w1), o), up);
      Lf.add(H.felt(`${id}-oil`, [[rr + 0.6, -3], [rr + 3.6, -3], [rr + 3.6, 3], [rr + 0.6, 3]], { body: F, z0: z0 + 1, z1: z1 - 1, name: "Felt oiler on the roller, oil-soaked wool felt" }));
      serves.F8 = [`${id}-oil`];
    } else if (!rr) {
      // a flat face: a felt pad on the foot beside the stem keeps the face oiled
      Lf.add(H.felt(`${id}-oil`, [[1, 9], [7, 9], [7, 15], [1, 15]], { body: F, z0: top, z1: top + 3, name: "Felt oiler on the follower's foot, oil-soaked wool felt" }));
      serves.F8 = [`${id}-oil`];
    }
    ctx.add(Lf.out());
    serves.F6 = [`${id}-spring`, `${id}-post`, `${id}-spin`];
    notes.push(`a compression spring between a pin on the follower and a post past the guide holds the follower on the cam (${travel.toFixed(0)} mm stroke)`);
  } else notes.push("the follower is held on the cam by its own linkage or a form-closed partner");
  // the zero line on the cam, from its hub to its base circle, toward the follower at the reference (F9)
  const part = ctx.parts.get(cam);
  if (part && camG) {
    const p = planeCoords(part.frame, c.at).uv;
    const rIn = Number(camG.shape.bore ?? 8) / 2 + 5;
    const rOut = Math.min(...part.profile.outer.map(([x, y]) => Math.hypot(x, y))) - 2;
    const L0 = Math.hypot(p[0], p[1]) || 1;
    if (rOut > rIn) {
      part.marks.push({ kind: "timing", pts: [[(p[0] / L0) * rIn, (p[1] / L0) * rIn], [(p[0] / L0) * rOut, (p[1] / L0) * rOut]] });
      serves.F9 = [cam];
    }
  }
  return { serves, note: `${titleOf(id)}: ${other === F ? "follower" : "roller follower on its pin"}; ${notes.join("; ")}; felt oiler; zero line on the cam.` };
};
const j7 = contactRule({ id: "j7-cam", ids: ["J7", "F6"], fixture: "kin:camFollower", kits: ["J7"], build: camBuild });

export const CAM_KITS: Rule[] = [j7];
