// The detail dial applied when drawing (standard 9b): passing a rung stops drawing every solid, mark and effect it
// selects, with the view-aware exceptions of the table (DL3). The package always holds everything.
import { DRAFT } from "../style/draft";
import { DETAIL, RUNG_ORDER, rungOf, type RungId } from "../style/detail";
import type { Effect, MarkKind } from "../style/kinds";

/** The dial: "full", or the last rung dropped (A drops A only, H drops A to H). */
export type Dial = RungId | "full";

const rank = (r: RungId) => RUNG_ORDER.indexOf(r);

export interface Ladder {
  solid(detail: RungId): boolean;
  mark(kind: MarkKind): boolean;
  effect(e: Effect): boolean;
  /** "FULL" or the dropped rungs, for the title block (DL4). */
  label: string;
}

export function ladder(dial: Dial, view: { tilt: number; explode: number }): Ladder {
  const upTo = dial === "full" ? -1 : rank(dial);
  const side = view.tilt >= DRAFT.sheet.elevationTilt;
  const drawn = (r: RungId) => {
    if (r === "never") return true;
    const rung = DETAIL.find((x) => x.id === r);
    if (side && rung?.exceptions?.atSide === "skip") return false;
    if (rank(r) > upTo) return true;
    return view.explode > 0 && rung?.exceptions?.whenExplode === "draw";
  };
  return {
    solid: (detail) => drawn(detail),
    mark: (kind) => drawn(rungOf({ mark: kind }).id),
    effect: (e) => drawn(rungOf({ effect: e }).id),
    label: dial === "full" ? "FULL" : dial === "A" ? "DETAIL A" : `DETAIL A-${dial}`,
  };
}
