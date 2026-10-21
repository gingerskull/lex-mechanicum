// Where the 3D checks get their solids and their poses, on either engine while both live on the branch:
//  - `legacySource`: a registered 2.5D mechanism, its assembly lifted to Solid3 (src/solids/lift.ts), posed by today's
//    model (standard S6: the transition view of an unrebuilt mechanism);
//  - `recordSource`: a catalogue record v3 built by the hardware builder (src/builder), posed by its own kin block.
import { indexParts, isGround, solidPose } from "../assemble/pose";
import type { Assembly as Assembly2 } from "../assemble";
import { buildAssembly, type Assembly as Assembly3, type Polish } from "../builder";
import { makePoseSource } from "../builder/poses";
import { xfMat } from "../builder/sweeps";
import { buildPackage } from "../package/build";
import type { MechanismModel } from "../model/types";
import { planeMatrix } from "../render/v3/poser";
import { IDENTITY, mat4, type Mat4 } from "../solids/frame";
import { liftAll } from "../solids/lift";
import type { Solid3 } from "../solids/types";
import type { RecordLike } from "../builder/ctx";
import type { Kin } from "../kin/types";
import type { Xf } from "../kin/math";
import { xf } from "../kin/math";
import type { Placer } from "./clash3";

export interface CheckSource {
  id: string;
  engine: "2.5D lifted" | "v3";
  solids: Solid3[];
  placer: Placer;
  /** Body pairs that touch by design. */
  contact: [string, string][];
  /** The 2.5D build a lifted source came from. */
  v1?: { model: MechanismModel; assembly: Assembly2 };
  assembly3?: Assembly3;
  kin?: Kin;
}

const T = (z: number): Mat4 => mat4({ ...IDENTITY, o: [0, 0, z] });
const mul = (a: Mat4, b: Mat4): Mat4 => {
  const o = new Array<number>(16).fill(0);
  for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) for (let k = 0; k < 4; k++) o[c * 4 + r]! += a[k * 4 + r]! * b[c * 4 + k]!;
  return o as Mat4;
};

/** A registered 2.5D mechanism's lifted solids and a placer that poses them with today's model. */
export function legacySource(id: string, model: MechanismModel, assembly: Assembly2): CheckSource {
  const parts = indexParts(model);
  const v1 = new Map(assembly.solids.map((s) => [s.id, s]));
  const solids = liftAll(assembly.solids);
  let at = NaN;
  let S: ReturnType<typeof model.solve> | null = null;
  const solved = (u: number) => {
    if (u !== at || !S) {
      S = model.solve(u);
      at = u;
    }
    return S;
  };
  const placer: Placer = {
    place(s, u) {
      const t = v1.get(s.id);
      if (!t) return mat4(IDENTITY);
      const sv = solved(u);
      const q = solidPose(model, parts, t, sv, u);
      if (!q) return mat4(IDENTITY);
      const axis = s.legacyAxis ?? "z";
      const f = axis === "p" && s.posedBy ? sv.frames?.[s.posedBy] : undefined;
      // the lifted frame holds the solid's own placement in the body's plane; solidPose already carries it, so only the
      // height along the axis stays
      return mul(planeMatrix(axis, q, f), T(s.frame.o[2]));
    },
    key(s) {
      const t = v1.get(s.id);
      if (!t) return s.body;
      return t.motion ? `m:${JSON.stringify(t.motion)}:${t.body}` : isGround(parts, t.body) ? "ground" : t.body;
    },
    stretch(s, u) {
      if (!s.stretch) return 1;
      const p = solved(u).pts;
      const a = p[s.stretch[0]];
      const b = p[s.stretch[1]];
      return a && b ? Math.hypot(b[0] - a[0], b[1] - a[1]) : 1;
    },
  };
  const contact: [string, string][] = [
    ...(model.cams ?? []).map((c): [string, string] => [c.cam, c.follower]),
    ...(model.meshes ?? []).map((m): [string, string] => [m.a, m.b]),
    ...(model.compliant ?? []).flatMap((c): [string, string][] => [[c.neck, c.lever], [c.neck, c.ground]]),
  ];
  return { id, engine: "2.5D lifted", solids, placer, contact, v1: { model, assembly } };
}

export async function legacySourceOf(id: string, opts: { polish?: boolean } = {}): Promise<CheckSource> {
  const b = await buildPackage(id, opts);
  return legacySource(id, b.model, b.assembly);
}

/** Joint types whose two bodies touch by design (teeth, a cam's flank, a belt on its pulley, a thread). */
const CONTACT_JOINTS = new Set(["gear-mesh", "cam-contact", "belt", "rolling", "screw", "flexure"]);

/** A record built by the hardware builder and posed by its own kinematic block. */
export async function recordSource(rec: RecordLike, opts: { polish?: Polish } = {}): Promise<CheckSource> {
  const assembly3 = await buildAssembly(rec, opts.polish ? { polish: opts.polish } : {});
  const src = makePoseSource(rec.kin as Kin);
  const K = src.K;
  let at = NaN;
  let bodies: Map<string, Xf> | null = null;
  const posed = (u: number) => {
    if (u !== at || !bodies) {
      bodies = K.pose(u).bodies;
      at = u;
    }
    return bodies;
  };
  const placer: Placer = {
    place(s, u) {
      const X = s.body === "ground" ? xf.id() : (posed(u).get(s.body) ?? xf.id());
      return mul(xfMat(X), mat4(s.frame));
    },
    key: (s) => s.body,
  };
  const kin = src.kin;
  const contact = kin.joints.filter((j) => CONTACT_JOINTS.has(j.type)).map((j): [string, string] => [j.a, j.b]);
  return { id: rec.id, engine: "v3", solids: assembly3.solids, placer, contact, assembly3, kin };
}

export type { Assembly2 };
