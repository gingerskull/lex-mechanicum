// Where the builder gets its poses. The record's own composition (src/kin) is used when it solves; a record whose
// blocks do not yet close (the rebuild batches complete them) is posed by the numeric loop-closure solver from the
// same bodies, joints and drivers, which is the K1 residual's own solver and holds the branch of the reference
// configuration. Either way the builder sees one thing: a body's transform at each sampled phase. The source says which
// route it took, and the audit repeats it.
import { Kinematics } from "../kin/compose";
import { KinError } from "../kin/ctx";
import type { Controls, Kin } from "../kin/types";

export interface PoseSource {
  /** The kin the builder reads (the record's, or its numeric variant), every body in it. */
  kin: Kin;
  K: Kinematics;
  route: "declared" | "numeric";
  notes: string[];
  controls?: Controls;
}

const PHASES = [0, 1.3, 2.9, 4.4, 5.8];

/** A pin in a slot whose slot has no line of its own (a named path, an arc) constrains nothing the solver can use. */
function dropUnusableSlots(kin: Kin, notes: string[]): Kin {
  const joints = kin.joints.map((j) => {
    if (j.type !== "pin-in-slot" || !j.slot) return j;
    const s = j.slot as unknown as { from?: unknown; to?: unknown };
    if (Array.isArray(s.from) && Array.isArray(s.to)) return j;
    notes.push(`joint ${j.id}: slot given as a path, not a line; the pin is left to the other joints`);
    const { slot: _s, ...rest } = j;
    void _s;
    return rest;
  });
  return { ...kin, joints };
}

/** A body no joint reaches stands where it is (a fixed plate): it is left out of the solving. */
const solvable = (kin: Kin): Kin => {
  const joined = new Set(kin.joints.flatMap((j) => [j.a, j.b]));
  return { ...kin, bodies: kin.bodies.filter((b) => b.id === "ground" || joined.has(b.id)) };
};

function tryPoses(kin: Kin, controls?: Controls): Kinematics {
  const K = new Kinematics(solvable(kin));
  K.setup(controls);
  for (const u of PHASES) K.pose(u, controls);
  return K;
}

/** The bodies a driver moves directly (the non-ground end of its joint). */
function driven(kin: Kin): Set<string> {
  const out = new Set<string>();
  const ids = new Set(kin.drivers.map((d) => d.joint).filter((x): x is string => !!x));
  for (const j of kin.joints) {
    if (!ids.has(j.id)) continue;
    out.add(j.a === "ground" ? j.b : j.b === "ground" ? j.a : j.b);
  }
  return out;
}

export function makePoseSource(kin: Kin, controls?: Controls): PoseSource {
  const notes: string[] = [];
  try {
    const K = tryPoses(kin, controls);
    return { kin, K, route: "declared", notes, controls };
  } catch (e) {
    if (!(e instanceof KinError) && !(e instanceof Error)) throw e;
    notes.push(`composition does not solve (${e.message}); posed by the numeric loop-closure solver`);
  }
  const base = dropUnusableSlots(kin, notes);
  const d = driven(base);
  const unknown = base.bodies.map((b) => b.id).filter((b) => b !== "ground" && !d.has(b));
  const numeric: Kin = { ...base, solve: [], fallback: { numeric: true, loops: [unknown] } };
  const K = tryPoses(numeric, controls);
  return { kin: numeric, K, route: "numeric", notes, controls };
}
