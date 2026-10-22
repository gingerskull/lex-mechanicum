// The live-shaft housing's bearing (J2): the narrow sealed bearing a housing, a pillow block or a stack carries for a
// shaft of a given bore.
import { BEARINGS, type Bearing } from "../tables";

export function housingBearing(d: number): Bearing {
  return [...BEARINGS].filter((b) => b.d === d && b.B <= 7).sort((a, b) => a.D - b.D)[0] ?? { name: "", d, D: d + 8, B: 5 };
}
