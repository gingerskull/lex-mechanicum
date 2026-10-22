// Where the 3D checks get their solids and their poses: a catalogue record v3 built by the hardware builder (src/builder),
// posed by its own kin block.
import { buildAssembly, type Assembly as Assembly3, type Polish } from "../builder";
import { makePoseSource } from "../builder/poses";
import { xfMat } from "../builder/sweeps";
import { mat4, type Mat4 } from "../solids/frame";
import { driveXf } from "../solids/drive";
import { conveyMatrix, mul4, stretchMatrix, turnMatrix } from "../solids/convey";
import type { Solid3 } from "../solids/types";
import type { RecordLike } from "../builder/ctx";
import type { Kin } from "../kin/types";
import type { Vec3, Xf } from "../kin/math";
import { xf } from "../kin/math";
import { anchorAt } from "../kin/compose";
import type { Placer } from "./clash3";

export interface CheckSource {
  id: string;
  solids: Solid3[];
  placer: Placer;
  /** Body pairs that touch by design. */
  contact: [string, string][];
  assembly3?: Assembly3;
  kin?: Kin;
}

const mul = (a: Mat4, b: Mat4): Mat4 => {
  const o = new Array<number>(16).fill(0);
  for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) for (let k = 0; k < 4; k++) o[c * 4 + r]! += a[k * 4 + r]! * b[c * 4 + k]!;
  return o as Mat4;
};
/** Joint types whose two bodies touch by design (teeth, a cam's flank, a belt on its pulley, a thread). */
const CONTACT_JOINTS = new Set(["gear-mesh", "cam-contact", "belt", "rolling", "screw", "flexure"]);

/** A record built by the hardware builder and posed by its own kinematic block. */
export async function recordSource(rec: RecordLike, opts: { polish?: Polish; controls?: Parameters<typeof makePoseSource>[1] } = {}): Promise<CheckSource> {
  return sourceOf(rec, await buildAssembly(rec, opts.polish ? { polish: opts.polish } : {}), opts);
}

/** The check source of an assembly already built from the record (its package is built from the same assembly). */
export function sourceOf(rec: RecordLike, assembly3: Assembly3, opts: { controls?: Parameters<typeof makePoseSource>[1] } = {}): CheckSource {
  // the solids are built at the record's defaults; `controls` poses them at another setting (a param control's range)
  const src = makePoseSource(rec.kin as Kin, opts.controls);
  const K = src.K;
  let at = NaN;
  let pz: ReturnType<typeof K.pose> | null = null;
  const poseAt = (u: number) => {
    if (u !== at || !pz) {
      pz = K.pose(u, opts.controls);
      at = u;
    }
    return pz;
  };
  const posed = (u: number) => poseAt(u).bodies;
  const refPose = K.referencePose();
  // a stretched member's end: a named kin point, or a kit's body anchor (@body:x:y:z)
  const endOf = (P: { points: Map<string, Vec3>; bodies: Map<string, Xf> }, n: string) => P.points.get(n) ?? anchorAt(n, P.bodies);
  const placer: Placer = {
    place(s, u) {
      // the drive's crank and link are posed from the input (they have no body in the record)
      if (s.drive) return mul(xfMat(driveXf(s.drive, posed(u).get(s.drive.input) ?? xf.id(), u)), mat4(s.frame));
      if (s.stretch) {
        const P = poseAt(u);
        const a = endOf(P, s.stretch[0]);
        const b = endOf(P, s.stretch[1]);
        const a0 = endOf(refPose, s.stretch[0]);
        const b0 = endOf(refPose, s.stretch[1]);
        // the member's whole matrix, its length included (stretch() then gives 1)
        if (a && b && a0 && b0) return stretchMatrix(a, b, a0, b0, mat4(s.frame)) as Mat4;
      }
      const X = s.body === "ground" ? xf.id() : (posed(u).get(s.body) ?? xf.id());
      const B = xfMat(X);
      const C = s.spin ? (mul4(B, turnMatrix(s.spin.at, s.spin.axis, u - s.spin.u0)) as Mat4) : s.convey ? (mul4(B, conveyMatrix(s.convey.path, s.convey.s0, poseAt(u).values[s.convey.path.key] ?? 0, s.convey.s1, poseAt(u).values)) as Mat4) : B;
      return mul(C, mat4(s.frame));
    },

    // a conveyed solid moves along its path, not with its carrier
    key: (s) => (s.drive ? `drive:${s.drive.part}` : s.convey ? `cv:${s.id}` : s.spin ? `spin:${s.spin.at.join(",")}` : s.body),
  };
  const kin = src.kin;
  // a slide held by springs touches by design (a pseudo-rigid beam's two halves, a roller between springs in a window)
  const contact = kin.joints.filter((j) => CONTACT_JOINTS.has(j.type) || (j.type === "prismatic" && (j as { spring?: unknown }).spring !== undefined)).map((j): [string, string] => [j.a, j.b]);
  // a gear no joint reaches is part of the ground (a fixed ring): a mesh with the ground is a mesh with it
  const fixedGears = kin.bodies.filter((b) => b.id !== "ground" && /gear|rack/i.test(String(b.shape?.type ?? "")) && !kin.joints.some((j) => j.a === b.id || j.b === b.id)).map((b) => b.id);
  for (const j of kin.joints) if (j.type === "gear-mesh" && (j.a === "ground" || j.b === "ground")) for (const g of fixedGears) contact.push([g, j.a === "ground" ? j.b : j.a]);
  return { id: rec.id, solids: assembly3.solids, placer, contact, assembly3, kin };
}
