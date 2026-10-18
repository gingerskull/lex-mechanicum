// Overrides and additions to the generated cam assembly (standard 5.2). The rules build the keyed live shaft, the roller
// pin (a clevis, so double shear), the slide on its risers, and the follower train (return spring, preload screw, felt
// oiler, zero line); the cam itself comes out as case-hardened steel. What differs from the rules:
// - the track is a replaceable hardened ring let into the rim (M14); the cam body is cut back behind it;
// - spoke windows in the cam body (M2), inside the base circle so the track and the working profile are untouched;
// - notes, badges and build rules (A16).
import { circle, offsetPoly, polar, type Vec2 } from "../../core/geom";
import type { Polish } from "../../assemble/api";
import { materials } from "../../rules/materials";
import { locking } from "../../rules/locking";
import { straddle } from "../../rules/j2-straddle";
import { rb } from "./model";

/** Track insert depth, radial, and the screws that hold it. */
const TRACK = 4;
const SCREWS = 8;
/** Spoke windows: hub radius round the bore and boss, window outer radius inside the insert's inner face. */
const HUB = 14;
const WINDOWS = 5;

export const polish: Polish = (A, H) => {
  const ctx = A.ctx;
  const cam = A.get("cam")!;
  const rule = ctx.rule;
  ctx.rule = "polish";

  // ---- M14: the track is a hardened ring screwed into the rim. Its outside is the modelled profile (K1) ----
  const track = cam.outer;
  const body = offsetPoly(track, -TRACK);
  cam.outer = body;
  const G = { body: cam.body, z0: cam.z0, z1: cam.z1, ex: cam.ex, joints: ["cam-cam"], role: cam.role };
  A.add(H.wearStrip("cam-track", track, { ...G, holes: [body], name: `Track insert, hardened ring ${TRACK} mm deep, ${SCREWS} x M2 csk` }));
  for (let i = 0; i < SCREWS; i++) {
    const k = Math.floor(((i + 0.5) * track.length) / SCREWS);
    // the middle of the ring, on the profile's normal at that point
    const a = track[k]!;
    const b = body[Math.min(k, body.length - 1)]!;
    const p: Vec2 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    A.add(H.screw(`cam-track-sc${i}`, "csk", 2, 5, { body: cam.body, at: [p[0], p[1], 0], face: cam.z1, dir: -1, ex: cam.ex, joints: ["cam-cam"], name: i ? "" : undefined, qty: i ? 0 : SCREWS }));
  }

  // ---- A9: nothing sweeps over the cam shaft, so it is straddle mounted: the rules do this for gear shafts, here it is
  // asked for by hand (a promotion candidate) ----
  straddle(ctx, [ctx.pinJoint("pO")!]);

  // ---- F8: felt oiler brushing the track at the cam's highest point, once a turn. The rule's felt cannot sit on a
  // profile that moves in and out, so it is placed by hand: a felt in a holder screwed to the base, 0.6 mm off the
  // highest point of the track ----
  {
    const rMax = Math.max(...track.map(([x, y]) => Math.hypot(x, y)));
    const [zc0, zc1] = [cam.z0, cam.z1];
    const G = { joints: ["cam-cam"], ex: A.get("cam-cam-spring-block")?.ex ?? 2 };
    for (let k = 0; k < 12; k++) {
      const a = -Math.PI / 2 + Math.ceil(k / 2) * (k % 2 ? 0.35 : -0.35);
      const p = polar(rMax + 3.1, a);
      if (ctx.clearance(p, 2.5, zc0, zc1) < 0.5) continue;
      const R = (r0: number, r1: number): Vec2[] => [polar(r0, a - 0.09), polar(r1, a - 0.09), polar(r1, a + 0.09), polar(r0, a + 0.09)];
      const holder = H.plate("cam-oiler-holder", R(rMax + 5.6, rMax + 14), { ...G, name: "Oiler holder, screwed to the base", z0: A.b1, z1: zc1 });
      const q = polar(rMax + 9.8, a);
      A.add(holder, H.felt("cam-oiler", circle(2.5, p[0], p[1], 20), { ...G, z0: zc0 + 0.5, z1: zc1 - 0.5 }));
      A.add(H.screw("cam-oiler-sc", "socket", 3, 8, { at: [q[0], q[1], 0], face: zc1, dir: -1, ex: G.ex, joints: ["cam-cam"] }));
      A.joint("cam-cam").serves.F8 = [...(A.joint("cam-cam").serves.F8 ?? []), "cam-oiler"];
      break;
    }
  }

  // ---- M2: spoke windows between the hub and the inside of the track, all inside the base circle ----
  cam.holes.push(...H.spokes({ rIn: HUB, rOut: rb - TRACK - 4, n: WINDOWS, half: 4, fillet: 3 }));
  H.boreChamfers(cam);
  locking.apply(ctx);
  materials.apply(ctx);
  A.set("cam-track", { mat: "Tool steel O1, hardened 58 HRC" });
  ctx.rule = rule;

  // ---- A16: notes, badges, build rules ----
  A.joint("pO", { note: A.joint("pO").note.replace("so the gear is carried", "so the cam is carried") });
  A.joint("cam-cam", {
    note: `${A.joint("cam-cam").note} The track is a hardened ring screwed into the rim of a case-hardened cam; the roller rolls on it, so wear is replaced by changing the ring.`,
  });
  A.joint("pF", {
    note: `${A.joint("pF").note} The roller runs on its own bearing between the two follower plates: a clevis, so the pin is in double shear and the push of the cam goes straight into both plates.`,
    badge: ["double shear", "ok"],
  });
  A.rules.push(
    { title: "The roller in a fork", text: "The follower is a clevis: front and rear plate hold the roller pin at both ends, so the cam load never bends it." },
    { title: "Hard where it wears", text: "The cam is case-hardened and its track is a screwed, hardened ring. The ring and the roller are replaced; the cam is not." },
    { title: "Spring-closed", text: "A compression spring on the stem keeps the roller on the cam; the preload screw sets the force and its nut locks it." },
    { title: "Timed to go back", text: "A zero line on the cam and an index line on the base: fit the cam with the line on the index and the follower at the bottom of its stroke." },
    { title: "Kinematics untouched", text: "The profile is the model's outline; the ring, windows and screws are cut behind and inside it." },
  );
};
