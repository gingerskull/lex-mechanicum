// Elliptic trammel on engine v3: the exceptions to the builder (standard 5.2, R7, T12).
// - J5, T12: the two blocks run in the crossed grooves of one groove plate, not each on its own pair of rails. Rails for
//   one slide would stand across the other block's path. The rails, risers and keepers of SX and SY give way to the plate
//   (named in the record's teaching.exceptions): a cross-shaped floor under both grooves and a corner block in each
//   quadrant, whose edges are the groove walls, so each groove runs whole from end to end through the crossing. The
//   trammel is worked by hand at the knob on the rod (its crank is construction only, src/builder/construction.ts), so
//   nothing turns under the plate and the middle stays closed.
import type { Polish } from "../../builder";
import type { Vec2 } from "../../core/geom";

/** Half width of a groove (the blocks are 17 wide), and the corner blocks' reach along the arms. */
const G = 10;
const REACH = 92;
/** The cross-shaped plate's arms: half width. */
const ARM = 17;

export const polish: Polish = (A, H) => {
  const { ctx } = A;
  A.drop((s) => /^S[XY]-/.test(s.id) && !/-wip\d$/.test(s.id));
  const blk = ctx.extent("blockX")!;
  const top = ctx.base!.top;
  // the floor: a + of the arms' width under both grooves
  const cross: Vec2[] = [[ARM, ARM], [ARM, REACH], [-ARM, REACH], [-ARM, ARM], [-REACH, ARM], [-REACH, -ARM], [-ARM, -ARM], [-ARM, -REACH], [ARM, -REACH], [ARM, -ARM], [REACH, -ARM], [REACH, ARM]];
  // a corner block in each quadrant: an L along the two arms that meet there, its inner edges the groove walls
  const corner = (sx: number, sy: number): Vec2[] => {
    const pts: Vec2[] = [[G, G], [REACH, G], [REACH, ARM], [ARM, ARM], [ARM, REACH], [G, REACH]];
    const out = pts.map(([x, y]): Vec2 => [sx * x, sy * y]);
    return sx * sy > 0 ? out : out.reverse();
  };
  A.build({ o: [0, 0, 0], x: [1, 0, 0], z: [0, 0, 1] }, (L) => {
    L.add(H.plate("groove-floor", cross, { kind: "plate", role: "ground", name: "Groove floor, a cross under both grooves", z0: top, z1: blk.w0 - 0.5, mat: "Aluminium 6061-T6, anodised" }));
    [[1, 1], [-1, 1], [-1, -1], [1, -1]].forEach(([sx, sy], k) => {
      L.add(H.plate(`groove-block${k}`, corner(sx!, sy!), { kind: "plate", role: "ground", name: k ? "" : "Corner block, its edges the groove walls, ground steel", qty: k ? 0 : 4, z0: blk.w0 - 0.5, z1: blk.w1 - 1, mat: "Steel C45, ground" }));
    });
  }, { body: "ground" });
};
