// Elliptic trammel on engine v3: the exceptions to the builder (standard 5.2, R7, T12).
// - J5, T12: the two blocks run in the crossed grooves of one groove plate, not each on its own pair of rails. Rails for
//   one slide would stand across the other block's path, and a riser under them across the crank's. The rails, risers
//   and keepers of SX and SY give way to the plate (named in the record's teaching.exceptions): groove walls either side
//   of each block, cut back round the centre where the crank pin M runs, and floor strips under the grooves beyond the
//   crank's sweep. Nothing else carries the blocks there: at the crossing a block is held by the rod and the other block.
import type { Polish } from "../../builder";
import type { Vec2 } from "../../core/geom";

/** Half width of a groove (the blocks are 17 wide), wall width, the radius kept clear round the centre for the pin M. */
const G = 10;
const W = 7;
const CLEAR = 40;
/** The floor strips stand clear of the crank's own sweep below the blocks (crank 30 plus its boss). */
const FLOOR = 46;

export const polish: Polish = (A, H) => {
  const { ctx } = A;
  A.drop((s) => /^S[XY]-/.test(s.id) && !/-wip\d$/.test(s.id));
  const blk = ctx.extent("blockX")!;
  const top = ctx.base!.top;
  const rect = (x0: number, y0: number, x1: number, y1: number): Vec2[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
  // the arms reach 92 mm each way: the blocks travel ±60 and are 40 long
  const arms: [Vec2, number][] = [[[1, 0], 92], [[-1, 0], 92], [[0, 1], 92], [[0, -1], 92]];
  A.build({ o: [0, 0, 0], x: [1, 0, 0], z: [0, 0, 1] }, (L) => {
    arms.forEach(([d, reach], k) => {
      const along = (a: number, b: number, c: number, e: number) => (d[0] ? rect(Math.min(d[0] * a, d[0] * b), c, Math.max(d[0] * a, d[0] * b), e) : rect(c, Math.min(d[1] * a, d[1] * b), e, Math.max(d[1] * a, d[1] * b)));
      for (const [s, side] of [[0, 1], [1, -1]] as const) {
        const [c, e] = side > 0 ? [G, G + W] : [-G - W, -G];
        L.add(H.plate(`groove-wall${k}${s}`, along(CLEAR, reach, c, e), { kind: "plate", role: "ground", name: k || s ? "" : "Groove wall, ground steel", qty: k || s ? 0 : 8, z0: blk.w0 - 0.5, z1: blk.w1 - 1, mat: "Steel C45, ground" }));
      }
      L.add(H.plate(`groove-floor${k}`, along(FLOOR, reach, -G - W, G + W), { kind: "plate", role: "ground", name: k ? "" : "Groove floor strip", qty: k ? 0 : 4, z0: top, z1: blk.w0 - 0.5, mat: "Aluminium 6061-T6, anodised" }));
    });
  }, { body: "ground" });
};
