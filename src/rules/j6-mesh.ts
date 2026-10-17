// J6: a gear mesh. Hubs with a set screw on the keyed gears (F3), an eccentric bushing under one shaft's housing for
// backlash (F7, built by J2 when it sees the request), thrust washers and retaining rings from J2 (F2, F4), timing
// marks from the timing rule (F9). Runs before J2 so the shafts are sized through the hubs.
import { disc, setScrew } from "../hardware/primitives";
import { solid } from "../hardware/solid";
import type { MeshJoint, PinJoint, Rule, RuleContext } from "./types";

const liveOf = (ctx: RuleContext, part: string): PinJoint | undefined =>
  ctx.info.find((j): j is PinJoint => j.kind === "pin" && j.type === "J2" && j.driven.some((x) => x.part.id === part));

function hub(ctx: RuleContext, m: MeshJoint, gid: string): string | null {
  const g = ctx.parts[gid]!;
  const pj = liveOf(ctx, gid);
  if (!pj || g.z === undefined) return null;
  const x = pj.driven.find((y) => y.part.id === gid)!;
  const host = ctx.solidOf[gid]!;
  const root = (g.m! * g.z) / 2 - 1.25 * g.m!;
  const rh = Math.min(pj.d / 2 + 6, root - 2);
  const id = `${gid}-hub`;
  ctx.add(
    solid(id, {
      name: `Gear hub Ø${2 * rh}, set screw M3 on the ${pj.d <= 8 ? "D-flat" : "key"}`,
      kind: "part",
      role: g.role,
      body: gid,
      at: [x.L[0], x.L[1], 0],
      outer: disc(rh),
      holes: [disc(pj.d / 2 + 0.01)],
      z0: host.z1,
      z1: host.z1 + 5,
      ex: host.ex,
      joints: [m.id, pj.id],
      why: "hub",
      mat: host.mat ?? "Steel C45",
    }),
  );
  ctx.add(setScrew(`${gid}-hub-ss`, 3, { body: gid, at: [x.L[0] + rh - 1.6, x.L[1], 0], z0: host.z1 + 1.5, z1: host.z1 + 3.5, ex: host.ex, joints: [m.id] }));
  return id;
}

export const j6: Rule = {
  id: "j6-mesh",
  tier: "AUTO",
  ids: ["J6", "F7"],
  applies: (ctx) => ctx.info.some((j) => j.type === "J6"),
  apply(ctx) {
    for (const m of ctx.info) {
      if (m.kind !== "mesh") continue;
      const J = ctx.joint(m.id)!;
      for (const gid of [m.a.id, m.b.id]) {
        const h = hub(ctx, m, gid);
        if (h) (J.serves.F3 ??= []).push(h, `${gid}-hub-ss`);
      }
      // backlash on the second shaft: J2 seats its housing on an eccentric bushing
      const pb = liveOf(ctx, m.b.id) ?? liveOf(ctx, m.a.id);
      if (pb && m.form !== "rack") {
        pb.eccentric = true;
        (J.serves.F7 ??= []).push(`${pb.id}-ecc`);
      }
      J.note = `${m.form === "rack" ? "Rack and pinion" : m.form === "internal" ? "Internal mesh" : "Spur mesh"} of ${m.a.id} and ${m.b.id}: hubs with set screws on the keyed gears${pb && m.form !== "rack" ? `, backlash set by an eccentric bushing under the ${pb.id} housing` : ""}, timing marks at the mesh.`;
      J.badge = ["backlash adjustable", pb ? "ok" : "warn"];
    }
  },
};
