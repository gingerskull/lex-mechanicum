// Outboard arms (A10): a body whose shape carries an `arm` has a second plate fixed to it on a slab of its own, joined at
// a pin it shares with another part (a return crank fixed on the outer end of a main crank pin, outboard of the rod the
// pin carries). For the build only, the arm is a body of its own, `<body>~arm`, riding its body's motion: the placer gives
// it its own slab, the joints whose point lies on the arm alone move to it, and a joint at the shared pin puts it in that
// pin's stack, clamped to the pin. Every solid it gets rides the real body again (src/builder/build.ts).
import type { Setup } from "../kin/compose";
import type { Kin, KinBody, KinJoint } from "../kin/types";
import type { ResolvedJoint } from "../kin/residual";
import { xf, type Xf } from "../kin/math";

export const ARM = "~arm";

/** The real body of a build body: the body an arm belongs to, or the body itself. */
export const realBody = (kin: Kin, id: string): string => (kin.bodies.find((b) => b.id === id) as (KinBody & { armOf?: string }) | undefined)?.armOf ?? id;

interface ArmSpec {
  /** The shared pin, a joint of the body, where the arm is fixed. */
  at: string;
  /** The joints whose point is on the arm. */
  joints: string[];
  length?: number;
  boss?: [number, number];
}

/** The record's kin with each outboard arm a body of its own, and a setup with its joints. */
export function withArms(kin: Kin, S: Setup): { kin: Kin; S: Setup } {
  const arms = kin.bodies.filter((b) => b.shape && typeof (b.shape as { arm?: unknown }).arm === "object");
  if (!arms.length) return { kin, S };
  const bodies: KinBody[] = [...kin.bodies];
  let joints: KinJoint[] = [...kin.joints];
  const resolved = new Map<string, ResolvedJoint>(S.joints);
  const bodyFrame = new Map<string, Xf>(S.bodyFrame);
  for (const b of arms) {
    const spec = (b.shape as { arm: ArmSpec }).arm;
    const id = `${b.id}${ARM}`;
    const pin = S.joints.get(spec.at);
    if (!pin) continue;
    // the arm's frame: at the shared pin, x toward its far joint
    bodies.push({ id, role: b.role, shape: { type: "link", ...(spec.length ? { length: spec.length } : {}), boss: spec.boss ?? [9, 9] }, at: { joint: `${spec.at}${ARM}` }, armOf: b.id } as KinBody & { armOf: string });
    joints = joints.map((j) => (spec.joints.includes(j.id) ? { ...j, a: j.a === b.id ? id : j.a, b: j.b === b.id ? id : j.b } : j));
    const fix: KinJoint = { id: `${spec.at}${ARM}`, type: "revolute", a: b.id, b: id, at: [...pin.at], axis: [...pin.axis] } as KinJoint;
    joints.push(fix);
    for (const j of joints) {
      const r = resolved.get(j.id);
      if (r && r.joint !== j) resolved.set(j.id, { ...r, joint: j });
    }
    resolved.set(fix.id, { ...pin, joint: fix });
  }
  const kin2: Kin = { ...kin, bodies, joints };
  // the arm's frame from its joints, as for any body
  const S2: Setup = { ...S, joints: resolved, bodyFrame };
  return { kin: kin2, S: S2 };
}

/** The arms ride their bodies: their sampled poses are their bodies'. */
export function armPoses(kin: Kin, xfs: Map<string, Xf[]>): void {
  for (const b of kin.bodies) {
    const of = (b as KinBody & { armOf?: string }).armOf;
    if (of) xfs.set(b.id, (xfs.get(of) ?? []).map((X) => X ?? xf.id()));
  }
}
