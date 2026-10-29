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
import type { Controls, Kin } from "../kin/types";
import type { Vec3, Xf } from "../kin/math";
import { jointFrame, moves, xf } from "../kin/math";
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
  // at a setting that changes the geometry (a bend, an offset) each body is carried from the frame it was built in to the
  // setting's, and a moved joint's ground hardware with its joint, as the renderer poses them (src/render/v3/poser)
  const bodyShift = new Map<string, Xf>();
  const jointShift = new Map<string, Xf>();
  if (opts.controls) {
    const built = K.setup(undefined);
    const now = K.setup(opts.controls);
    for (const [id, F1] of now.bodyFrame) {
      const D = xf.mul(F1, xf.inv(built.bodyFrame.get(id) ?? xf.id()));
      if (moves(D)) bodyShift.set(id, D);
    }
    for (const [id, r1] of now.joints) {
      const r0 = built.joints.get(id);
      if (!r0) continue;
      const D = xf.mul(jointFrame(r1.at, r1.axis), xf.inv(jointFrame(r0.at, r0.axis)));
      if (moves(D)) jointShift.set(id, D);
    }
  }
  const shiftOf = (s: Solid3): Xf | undefined => (s.body !== "ground" ? bodyShift.get(s.body) : s.joints.map((j) => jointShift.get(j)).find((D) => D));
  // a stretched member's end: a named kin point, or a kit's body anchor (@body:x:y:z)
  const endOf = (P: { points: Map<string, Vec3>; bodies: Map<string, Xf> }, n: string) => P.points.get(n) ?? anchorAt(n, P.bodies);
  const placer: Placer = {
    place(s, u) {
      // the drive's crank and link are posed from the input (they have no body in the record)
      if (s.drive) return mul(xfMat(driveXf(s.drive, posed(u).get(s.drive.input) ?? xf.id(), u)), mat4(s.frame));
      if (s.stretch) {
        const P = poseAt(u);
        // ends held at the heights the build gave them (a rope part in its sheaves' planes)
        const atZ = (p: Vec3 | null | undefined, k: 0 | 1): Vec3 | null | undefined => (p && s.stretchZ ? [p[0], p[1], s.stretchZ[k]] : p);
        const a = atZ(endOf(P, s.stretch[0]), 0);
        const b = atZ(endOf(P, s.stretch[1]), 1);
        const a0 = atZ(endOf(refPose, s.stretch[0]), 0);
        const b0 = atZ(endOf(refPose, s.stretch[1]), 1);
        // the member's whole matrix, its length included (stretch() then gives 1)
        if (a && b && a0 && b0) return stretchMatrix(a, b, a0, b0, mat4(s.frame)) as Mat4;
      }
      const X0 = s.body === "ground" ? xf.id() : (posed(u).get(s.body) ?? xf.id());
      const D = shiftOf(s);
      const X = D ? xf.mul(X0, D) : X0;
      const B = xfMat(X);
      const C = s.spin ? (mul4(B, turnMatrix(s.spin.at, s.spin.axis, u - s.spin.u0)) as Mat4) : s.convey ? (mul4(B, conveyMatrix(s.convey.path, s.convey.s0, poseAt(u).values[s.convey.path.key] ?? 0, s.convey.s1, poseAt(u).values)) as Mat4) : B;
      return mul(C, mat4(s.frame));
    },

    // a conveyed solid moves along its path, not with its carrier; a moved joint's ground hardware moves with its joint
    key: (s) => (s.drive ? `drive:${s.drive.part}` : s.convey ? `cv:${s.id}` : s.spin ? `spin:${s.spin.at.join(",")}` : s.body === "ground" && shiftOf(s) ? `shift:${s.joints.find((j) => jointShift.has(j))}` : s.body),
  };
  const kin = src.kin;
  // a slide held by springs touches by design (a pseudo-rigid beam's two halves, a roller between springs in a window)
  const contact = kin.joints.filter((j) => CONTACT_JOINTS.has(j.type) || (j.type === "prismatic" && (j as { spring?: unknown }).spring !== undefined)).map((j): [string, string] => [j.a, j.b]);
  // a gear no joint reaches is part of the ground (a fixed ring): a mesh with the ground is a mesh with it
  const fixedGears = kin.bodies.filter((b) => b.id !== "ground" && /gear|rack/i.test(String(b.shape?.type ?? "")) && !kin.joints.some((j) => j.a === b.id || j.b === b.id)).map((b) => b.id);
  for (const j of kin.joints) if (j.type === "gear-mesh" && (j.a === "ground" || j.b === "ground")) for (const g of fixedGears) contact.push([g, j.a === "ground" ? j.b : j.a]);
  return { id: rec.id, solids: assembly3.solids, placer, contact, assembly3, kin };
}

/**
 * The settings at both ends of each param control that moves a ground joint (a bend, an offset), with a label: the
 * clearance and clamp checks run there as well as at the record's own setting (A19), since the supports move with it.
 */
export function rangeEnds(rec: RecordLike): { label: string; controls: Controls }[] {
  const kin = rec.kin as Kin | undefined;
  const controls = (rec.teaching as { controls?: { kind: string; param?: string }[] } | undefined)?.controls ?? [];
  if (!kin) return [];
  const K = makePoseSource(kin).K;
  const built = K.setup(undefined);
  const out: { label: string; controls: Controls }[] = [];
  for (const c of controls) {
    const p = c.kind === "param" && c.param ? kin.params?.find((q) => q.id === c.param) : undefined;
    if (!p || p.min === undefined || p.max === undefined || !(p.max > p.min)) continue;
    for (const v of [p.min, p.max]) {
      const ctl: Controls = { params: { [p.id]: v } };
      const now = K.setup(ctl);
      const moved = kin.joints.some((j) => {
        const r0 = built.joints.get(j.id);
        const r1 = now.joints.get(j.id);
        return (j.a === "ground" || j.b === "ground") && r0 && r1 && moves(xf.mul(jointFrame(r1.at, r1.axis), xf.inv(jointFrame(r0.at, r0.axis))));
      });
      if (moved) out.push({ label: `${p.id} ${v}`, controls: ctl });
    }
  }
  return out;
}
