// Four-bar linkage on engine v3: the exceptions to the builder (standard 5.2, R7).
// - D2, M2: a lightening window in the coupler. It is the one big plate here and it oscillates, so its mass is inertia;
//   6 mm of web stays round every boss and edge.
import type { Polish } from "../../builder";
import type { Vec2 } from "../../core/geom";

export const polish: Polish = (A, H) => {
  const coupler = A.get("coupler")!;
  const tri: Vec2[] = [[0, 0], [120, 0], [54, 43]];
  const g: Vec2 = [(tri[0]![0] + tri[1]![0] + tri[2]![0]) / 3, (tri[0]![1] + tri[1]![1] + tri[2]![1]) / 3];
  coupler.profile.holes.push(H.window(tri.map(([x, y]): Vec2 => [g[0] + (x - g[0]) * 0.42, g[1] + (y - g[1]) * 0.42]), 5));
};
