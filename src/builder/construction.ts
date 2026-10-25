// Construction bodies (a body with `construction: true` in the record): bodies of the kinematics only, never built. A
// hand-worked trammel's crank is one: the rod's midpoint really does run round the centre, so the crank stays in the
// kinematics, which drive the rod through it, but in the build the hand stands in for it. The builder's view of the
// record drops the body and its joints; a driver on one of its joints is worked by hand through the built body it
// carries (the rod), at a knob on that body (rules/drive.ts manualDrive), its kind set to manual for the build only.
import type { Kin, KinDriver } from "../kin/types";

export const isConstruction = (b: { shape?: unknown; construction?: unknown }): boolean => (b as { construction?: unknown }).construction === true;

/** The record's kinematics as the builder sees them: construction bodies and their joints dropped. */
export function withoutConstruction(kin: Kin): Kin {
  const gone = new Set(kin.bodies.filter(isConstruction).map((b) => b.id));
  if (!gone.size) return kin;
  const dropped = kin.joints.filter((j) => gone.has(j.a) || gone.has(j.b));
  const joints = kin.joints.filter((j) => !gone.has(j.a) && !gone.has(j.b));
  const drivers = kin.drivers.map((d): KinDriver => {
    const j = dropped.find((q) => q.id === d.joint);
    if (!j) return d;
    // the built bodies the construction body carries, through its other joints; a joint of theirs that is built
    const via = gone.has(j.a) ? j.a : j.b;
    const carried = dropped.filter((q) => q !== j && (q.a === via || q.b === via)).map((q) => (q.a === via ? q.b : q.a)).filter((b) => !gone.has(b) && b !== "ground");
    // a turning joint of theirs for the knob (the hand turns the input round), else any
    const of = joints.filter((q) => carried.includes(q.a) || carried.includes(q.b));
    const on = of.find((q) => q.type === "revolute") ?? of[0];
    // a construction body that carries nothing built leaves its driver as it is; the build reports the joint missing
    return on ? { ...d, kind: "manual", joint: on.id } : d;
  });
  return { ...kin, bodies: kin.bodies.filter((b) => !gone.has(b.id)), joints, drivers };
}
