// The parts a flexible member (MechanismModel.flexible, J12) names: the wheel on each shaft it runs over, and every part
// it joins. A CVT names two sheave halves per shaft; its fixed half is the wheel on the shaft.
import type { MechanismModel } from "./types";

export type Flexible = NonNullable<MechanismModel["flexible"]>[number];

/** The wheel on each shaft the member runs over: sprockets, pulleys, sheaves, a CVT's fixed halves. */
export const wheelsOf = (f: Flexible): string[] => (f.form === "cvt" ? f.pairs.map((p) => p.fixed) : f.over);

/** Every part the member names. */
export const membersOf = (f: Flexible): string[] =>
  f.form === "cvt"
    ? [...f.pairs.flatMap((p) => [p.fixed, p.sliding]), f.belt]
    : f.form === "rope"
      ? [...f.over, ...f.spans, ...(f.wraps ?? []), ...(f.load ? [f.load] : [])]
      : f.form === "belt"
        ? [...f.over, f.band]
        : f.over;
